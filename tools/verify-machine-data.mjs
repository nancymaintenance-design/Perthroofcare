import {readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {load} from 'cheerio';
import {editorContent} from './editor/content.mjs';

const hash=x=>createHash('sha256').update(x).digest('hex');
const before=JSON.parse(readFileSync(process.argv[2],'utf8'));
const pages=[];
for(const [route,baseline] of Object.entries(before.views)){
 const $=load(readFileSync(join('public',route,'index.html'),'utf8'));
 const graph=JSON.parse($('script[type="application/ld+json"]').text())['@graph'];
 const ids=graph.map(n=>n['@id']).filter(Boolean);
 assert.equal(new Set(ids).size,ids.length,'duplicate graph identity: '+route);
 $('script[type="application/ld+json"]').remove();
 assert.equal(hash($.html()),baseline,'Non-JSON page changed: '+route);
 pages.push({route,types:graph.map(n=>n['@type']),service:graph.find(n=>n['@type']==='Service')?.['@id'],article:graph.find(n=>n['@type']==='Article')?.['@id']});
}
for(const [file,expected] of Object.entries(before.feeds)){
 const feed=JSON.parse(readFileSync('public/'+file,'utf8'));
 assert.deepEqual(JSON.parse(JSON.stringify(feed.items.map(({id,url,date_published,date_modified})=>({id,url,date_published,date_modified})))),expected,'Feed identity/date changed: '+file);
}
for(const [id,baseline] of Object.entries(before.editor))assert.equal(hash(JSON.stringify(editorContent(id).fields)),baseline.fieldsHash,'Editor fields changed: '+id);
const drafts=[];
for(const name of readdirSync('.local-editor/drafts').filter(n=>n.endsWith('.json'))){
 const draft=JSON.parse(readFileSync('.local-editor/drafts/'+name,'utf8'));
 const model=editorContent(draft.pageId),baseline=before.editor[draft.pageId];
 assert.ok(draft.baseHash===baseline.baseHash||draft.baseHash===model.baseHash,'Draft was already stale before this task: '+name);
 drafts.push({name,revision:draft.revision,changesHash:hash(JSON.stringify(draft.changes)),changeCount:Object.keys(draft.changes).length,oldHash:draft.baseHash,newHash:model.baseHash});
}
console.log(JSON.stringify({visiblePagesUnchanged:pages.length,editorPagesUnchanged:Object.keys(before.editor).length,feedIdsAndDatesUnchanged:true,pages,drafts},null,2));
