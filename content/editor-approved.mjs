import {readFileSync} from 'node:fs';
import {normalizeSource} from './i18n/catalog.mjs';
const edits=JSON.parse(readFileSync(new URL('./editor-approved.json',import.meta.url),'utf8'));
// Approved route-local edits. Never apply a shared label to navigation/other pages.
export function applyEditorApproved($,route){
 let changed=false;
 for(const edit of edits.filter(e=>e.route===route)){
  const hits=[],done=[];
  function walk(node){if(node.type==='text'){const value=normalizeSource(node.data);if(value===normalizeSource(edit.before))hits.push(node);if(value===normalizeSource(edit.after))done.push(node);return;}if(['script','style'].includes(node.name)||node.attribs?.translate==='no')return;for(const child of node.children??[])walk(child);}
  walk($('main')[0]);
  if(hits.length===0&&done.length===1)continue;
  if(hits.length!==1)throw Error('Approved editor field changed upstream: '+route+' '+edit.fieldId+' ('+hits.length+')');
  const node=hits[0],leading=node.data.match(/^\s*/)[0],trailing=node.data.match(/\s*$/)[0];node.data=leading+edit.after+trailing;changed=true;
 }
 return changed;
}
