import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {load} from 'cheerio';
import {publicRoot,pages} from './manifest.mjs';
import {EditorError} from './store.mjs';
export const hash=value=>createHash('sha256').update(value).digest('hex');
function slots($){
 const out=[];
 function walk(n){
  if(n.type==='text'){if(/[\p{L}]/u.test(n.data))out.push({node:n,kind:'text',value:n.data.trim()});return;}
  if(['script','style','svg','noscript'].includes(n.name)||n.attribs?.translate==='no'||n.attribs?.class?.split(/\s+/).includes('google-review-card'))return;
  if(n.name==='img'&&n.attribs.alt)out.push({node:n,attr:'alt',kind:'alt',value:n.attribs.alt});
  for(const c of n.children??[])walk(c);
 }
 const main=$('main')[0];if(main)walk(main);
 const title=$('title')[0];if(title?.children[0])out.push({node:title.children[0],kind:'seoTitle',value:$(title).text()});
 $('meta[name="description"],meta[property="og:title"],meta[property="og:description"],meta[name="twitter:title"],meta[name="twitter:description"]').each((_,n)=>out.push({node:n,attr:'content',kind:'seoDescription',value:$(n).attr('content')}));
 return out;
}
export function editorContent(pageId){
 const page=pages.find(p=>p.pageId===pageId);if(!page)throw new EditorError(404,'页面未登记');
 const english=readFileSync(join(publicRoot,page.route,'index.html'),'utf8'),chinese=readFileSync(join(publicRoot,'zh',page.route,'index.html'),'utf8');
 const en=slots(load(english)),zh=slots(load(chinese));if(en.length!==zh.length)throw new EditorError(409,'中英文结构不一致，请通知助手核对');
 const fields=en.map((s,i)=>({id:'field-'+i,value:s.value,publishedValue:zh[i].value,kind:s.kind,sourcePath:page.route+'#field-'+i,locked:/@|\bABN\b|\bACN\b|0405|614058|140 St Georges|\$\s*\d|\bAUD\b/i.test(s.value)}));
 return {pageId,route:page.route,baseHash:hash(english+chinese),fields,english,chinese};
}
export function normalizeDraftChanges(model,input){
 if(!input||typeof input!=='object'||Array.isArray(input))throw new EditorError(400,'草稿格式无效');
 const out={};for(const [id,value] of Object.entries(input)){
  const field=model.fields.find(f=>f.id===id);if(!field||field.locked)throw new EditorError(400,'字段不可编辑，请重新载入');
  if(typeof value!=='string'||!value.trim()||value.length>20000)throw new EditorError(400,'中文内容不能为空或超过20000字');out[id]=value;
 }return out;
}
export function checkedChanges(model,draft){if(!draft)return {};if(model.baseHash!==draft.baseHash)throw new EditorError(409,'页面基线已更新，请让助手合并旧草稿，勿覆盖');return normalizeDraftChanges(model,draft.changes);}
export function renderPreview(model,draft,chinese,origin){
 const $=load(chinese?model.chinese:model.english),fields=slots($),changes=chinese?checkedChanges(model,draft):{};
 for(let i=0;i<fields.length;i++){
  const slot=fields[i],f=model.fields[i];if(changes[f.id]!==undefined){if(slot.attr)$(slot.node).attr(slot.attr,changes[f.id]);else slot.node.data=changes[f.id];}
  if(chinese&&!f.locked&&slot.kind==='text')$(slot.node).replaceWith($('<span>').attr({'data-editor-field':f.id,tabindex:'0',role:'button','aria-label':'编辑中文'}).text(slot.node.data));
 }
 $('script').remove();$('iframe').remove();$('link[rel="canonical"],link[rel="alternate"],meta[property="og:url"]').remove();
 $('head').prepend($('<base>').attr('href',origin+'/')).append('<meta name="robots" content="noindex,nofollow"><style>[data-editor-field]:hover,[data-editor-field]:focus-visible{outline:2px solid #075873;outline-offset:2px;cursor:text}</style>');
 const bridge=`document.addEventListener('submit',e=>{e.preventDefault();e.stopImmediatePropagation()},true);document.addEventListener('click',e=>{const n=e.target.closest('[data-editor-field]');if(n){e.preventDefault();e.stopImmediatePropagation();parent.postMessage({type:'editor-field',id:n.dataset.editorField},new URL(document.baseURI).origin);return}if(e.target.closest('a,button,input,select,textarea')){e.preventDefault();e.stopImmediatePropagation()}},true);document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-editor-field]')){e.preventDefault();parent.postMessage({type:'editor-field',id:e.target.dataset.editorField},new URL(document.baseURI).origin)}});`;
 $('body').append($('<script>').text(bridge));return $.html();
}
