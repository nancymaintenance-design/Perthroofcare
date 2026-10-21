import {readFileSync} from 'node:fs';
import {normalizeSource} from './i18n/catalog.mjs';
import {navigationDefinitions} from './service-navigation.mjs';

// Reviewed sentence-level edits, scoped to real routes. This is not a banned-word
// filter: proper names, reviews, safety conditions and legal text remain intact.
export const ownerCopyEdits=JSON.parse(readFileSync(new URL('./owner-copy-data.json',import.meta.url),'utf8'));

export function applyOwnerCopy($,route,graph){
 if(['privacy','legal'].includes(route))return false;
 const guide=navigationDefinitions.find(page=>page.route===route&&page.type==='guide');
 const edits=ownerCopyEdits.filter(edit=>edit.routes.includes(route)||(edit.id.startsWith('S')&&guide&&edit.routes.includes(guide.owner)));
 if(!edits.length)return false;
 let changed=false;
 const revise=(value,attribute=null)=>{
  let next=value;
  for(const edit of edits)if((edit.attribute??null)===attribute)next=next.replaceAll(edit.before,edit.after);
  if(next!==value)changed=true;
  return next;
 };
 const walk=node=>{
  if(node.type==='text'){
   const old=node.data,source=normalizeSource(old),next=revise(source);
   if(next!==source)node.data=old.match(/^\s*/u)[0]+next+old.match(/\s*$/u)[0];
   return;
  }
  if(['script','style','blockquote'].includes(node.name)||node.attribs?.translate==='no'||node.attribs?.['data-review-carousel']!==undefined)return;
  for(const child of node.children??[])walk(child);
 };
 for(const node of $('main').toArray())walk(node);
 $('main img[alt]').each((_,node)=>{const img=$(node);img.attr('alt',revise(img.attr('alt'),'alt'));});
 $('meta[name="description"],meta[property="og:description"],meta[name="twitter:description"]').each((_,node)=>{
  const tag=$(node);tag.attr('content',revise(tag.attr('content')||''));
 });
 // The caller serialises this shared graph after synchronising visible content.
 const jsonWalk=value=>{
  if(typeof value==='string')return revise(value);
  if(Array.isArray(value))return value.map(jsonWalk);
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,child])=>[key,jsonWalk(child)]));
  return value;
 };
 for(let i=0;i<graph.length;i++)graph[i]=jsonWalk(graph[i]);
 return changed;
}
