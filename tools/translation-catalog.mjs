import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, relative, isAbsolute, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { collectPageEntries, addCatalogString, NEUTRAL_RULES } from '../content/i18n/catalog.mjs';

const projectRoot=fileURLToPath(new URL('..',import.meta.url));
const workspace='.superpowers/sdd/2026-10-16-bilingual-services/catalog';

export function generateTranslationCatalog({root=projectRoot,batchSize=180,outputDirectory=join(root,workspace)}={}) {
  if(!Number.isInteger(batchSize)||batchSize<150||batchSize>250) throw new RangeError('batchSize must be an integer between 150 and 250');
  const allowed=resolve(root,workspace),output=resolve(outputDirectory),within=relative(allowed,output);
  if(within.startsWith('..')||isAbsolute(within)) throw new Error(`Catalog output must stay inside ${allowed}`);
  const routes=[...readFileSync(join(root,'sitemap.xml'),'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(match=>new URL(match[1]).pathname);
  const strings=new Map(),records=new Map(),exclusions=new Map();
  for(const route of routes) {
    const {entries,exclusions:neutral}=collectPageEntries(readFileSync(join(root,route.replace(/^\//,''),'index.html'),'utf8'));
    for(const {source,location} of entries) {
      const id=addCatalogString(strings,source);
      if(!records.has(id)) records.set(id,{id,source,routes:new Set(),locations:new Set()});
      const record=records.get(id);record.routes.add(route);record.locations.add(`${route} ${location}`);
    }
    for(const {source,reason} of neutral) {
      const key=reason+'\0'+source;
      if(!exclusions.has(key)) exclusions.set(key,{source,reason,routes:new Set()});
      exclusions.get(key).routes.add(route);
    }
  }
  const entries=[...records.values()].sort((a,b)=>a.id.localeCompare(b.id)).map(record=>({...record,routes:[...record.routes].sort(),locations:[...record.locations].sort()}));
  mkdirSync(output,{recursive:true});
  const write=(name,data)=>writeFileSync(join(output,name),JSON.stringify(data,null,2)+'\n');
  const batches=[];
  for(let index=0;index<entries.length;index+=batchSize) {
    const chunk=entries.slice(index,index+batchSize),file=`batch-${String(batches.length+1).padStart(3,'0')}.json`;
    write(file,{sources:Object.fromEntries(chunk.map(({id,source})=>[id,source])),provenance:Object.fromEntries(chunk.map(({id,routes,locations})=>[id,{routes,locations}]))});
    batches.push({file,count:chunk.length,ids:chunk.map(({id})=>id)});
    console.log(`Catalog artifact: ${file} (${chunk.length} strings)`);
  }
  write('index.json',{version:1,idAlgorithm:'sha256(normalizeSource).slice(0,20)',dictionaryContract:'Union of batch dictionaries: { [sourceId]: Chinese string }; no empty, source-identical, or non-Han translations for meaningful sources.',routeCount:routes.length,stringCount:entries.length,sourceBytes:Buffer.byteLength(entries.map(e=>e.source).join('\n'),'utf8'),routes,batches,entries});
  console.log(`Catalog artifact: index.json (${routes.length} routes; ${entries.length} unique strings)`);
  write('neutral-exclusions.json',{rules:NEUTRAL_RULES,entries:[...exclusions.values()].map(record=>({...record,routes:[...record.routes].sort()}))});
  console.log('Catalog artifact: neutral-exclusions.json');
  return {outputDirectory:output,routeCount:routes.length,stringCount:entries.length,batches};
}

if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url) {
  const args=process.argv.slice(2);
  if(args.length&&!(args.length===2&&args[0]==='--batch-size')) throw new Error('Usage: node tools/translation-catalog.mjs [--batch-size 150..250]');
  generateTranslationCatalog({batchSize:args.length?Number(args[1]):180});
}
