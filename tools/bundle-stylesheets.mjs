import {readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {load} from 'cheerio';
import {transform} from 'lightningcss';

// Keep the original cascade, including media and interactive-state rules.
// Only publication copies change; editable source styles remain intact.
export function bundleStylesheets(publicDirectory,routes){
  const bundles=new Map();
  const publishedClasses=new Set();
  for(const route of routes){
    const $=load(readFileSync(join(publicDirectory,route,'index.html'),'utf8'));
    $('[class]').each((_,el)=>{for(const name of $(el).attr('class').split(/\s+/))publishedClasses.add(name);});
  }
  for(const route of routes){
    const file=join(publicDirectory,route,'index.html');
    const $=load(readFileSync(file,'utf8'));
    const links=$('link[rel="stylesheet"]');
    const cascade=$('link[rel="stylesheet"],style');
    if(!links.length)throw new Error(`No stylesheet for ${route||'/'}`);
    const inputs=cascade.toArray().map(el=>{
      if(el.tagName==='style')return $(el).html();
      const node=$(el),url=new URL(node.attr('href'),'https://preview.invalid');
      if(url.origin!=='https://preview.invalid'||!/^\/assets\/css\/[\w.-]+\.css$/.test(url.pathname))throw new Error(`Unsupported stylesheet: ${url.href}`);
      const css=readFileSync(join(publicDirectory,url.pathname),'utf8'),media=node.attr('media');
      return media&&media!=='all'?`@media ${media}{${css}}`:css;
    });
    const key=inputs.join('\n');
    let href=bundles.get(key);
    if(!href){
      const {code}=transform({filename:'site.css',code:Buffer.from(key),minify:true,visitor:{Rule:{style(rule){
        // Only the retired, non-JS-created atlas layout namespace is pruned.
        // Never infer all interactive or pseudo-class rules from static coverage.
        const selectors=rule.value.selectors.filter(selector=>!selector.some(part=>part.type==='class'&&part.name.startsWith('atlas-')&&!publishedClasses.has(part.name)));
        if(!selectors.length)return [];
        // Mixed live/retired lists stay intact rather than rewriting declarations.
      }}}});
      const digest=createHash('sha256').update(code).digest('hex').slice(0,16);
      href=`/assets/css/site-${digest}.css`;
      writeFileSync(join(publicDirectory,href),code);
      bundles.set(key,href);
    }
    links.first().attr('href',href).removeAttr('media');
    links.slice(1).remove();
    $('style').remove();
    writeFileSync(file,$.html());
  }
  console.log(`Stylesheets: ${routes.length} pages, ${bundles.size} fingerprinted bundles; cascade preserved.`);
}
