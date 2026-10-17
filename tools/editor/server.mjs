import {createServer} from 'node:http';
import {readFile,realpath} from 'node:fs/promises';
import {resolve,join,extname,sep} from 'node:path';
import {randomBytes} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {sourceRoot,publicRoot,pages} from './manifest.mjs';
import {editorContent,checkedChanges,normalizeDraftChanges,renderPreview,hash} from './content.mjs';
import {sameOrigin,authorized} from './security.mjs';
import {readDraft,saveDraft,listHistory,restoreRevision,EditorError} from './store.mjs';
export async function startEditor({host='127.0.0.1',port=4206,draftRoot=join(sourceRoot,'.local-editor','drafts')}={}){
 if(host!=='127.0.0.1')throw Error('Loopback only');
 const token=randomBytes(32).toString('hex');let origin='';
 const json=(res,status,value)=>{res.writeHead(status,{'content-type':'application/json; charset=utf-8'});res.end(JSON.stringify(value));};
 async function body(req){let str='';for await(const chunk of req){str+=chunk;if(Buffer.byteLength(str)>1048576)throw new EditorError(413,'草稿过大');}try{return JSON.parse(str);}catch{throw new EditorError(400,'草稿格式无效');}}
 const server=createServer(async(req,res)=>{
  res.setHeader('Cache-Control','no-store');res.setHeader('X-Robots-Tag','noindex, nofollow');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');
  res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; frame-src 'self'; connect-src 'self'; form-action 'none'; object-src 'none'; frame-ancestors 'self'");
  try{
   if(!sameOrigin(req,origin))throw new EditorError(403,'仅允许本地同源访问');
   const url=new URL(req.url,origin),path=url.pathname;
   if(path.startsWith('/api/'))throw new EditorError(403,'本地后台不发送咨询或邮件');
   if(path==='/__editor/api/session'&&req.method==='GET')return json(res,200,{token});
   if(path.startsWith('/__editor/api/')){
    if(!authorized(req,origin,token,req.method!=='GET'))throw new EditorError(403,'会话失效，请刷新后台');
    if(path==='/__editor/api/pages'&&req.method==='GET')return json(res,200,pages.map(p=>({pageId:p.pageId,title:editorContent(p.pageId).fields.find(f=>f.kind==='seoTitle').publishedValue,kind:'page'})));
    const m=path.match(/^\/__editor\/api\/(draft|preview|history|restore|workflow)\/([^/]+)$/);if(!m)throw new EditorError(404,'页面不存在');
    const pageId=decodeURIComponent(m[2]),model=editorContent(pageId),draft=await readDraft(draftRoot,pageId);
    if(m[1]==='draft'&&req.method==='PUT'){
     const input=await body(req);if(input?.baseHash!==model.baseHash)throw new EditorError(409,'页面基线已更新，请重新载入');
     const next=normalizeDraftChanges(model,input.changes);
     if(draft&&draft.baseHash!==model.baseHash&&Object.keys(next).length)throw new EditorError(409,'旧草稿需由助手核对同步，不能直接套到新页面');
     return json(res,200,await saveDraft(draftRoot,{pageId,baseHash:model.baseHash,expectedRevision:input.expectedRevision,changes:next}));
    }
    const changes=checkedChanges(model,draft);
    if(m[1]==='draft'&&req.method==='GET')return json(res,200,{pageId,baseHash:model.baseHash,fields:model.fields,draft,legacyDraft:false,legacyReview:[]});
    if(m[1]==='history'&&req.method==='GET')return json(res,200,await listHistory(draftRoot,pageId));
    if(m[1]==='workflow'&&req.method==='GET')return json(res,200,{state:Object.keys(changes).length?'needs-translation':'published',draft,proposalHash:null,chineseHash:hash(JSON.stringify(changes)),changes:model.fields.filter(f=>changes[f.id]!==undefined).map(f=>({fieldId:f.id,sourcePath:f.sourcePath,chineseBefore:f.publishedValue,chineseAfter:changes[f.id],englishBefore:f.value,englishAfter:null}))});
    if(m[1]==='preview'&&req.method==='GET'){res.setHeader('content-type','text/html; charset=utf-8');return res.end(renderPreview(model,draft,url.searchParams.get('locale')!=='en-AU',origin));}
    if(m[1]==='restore'&&req.method==='POST'){const input=await body(req);return json(res,200,await restoreRevision(draftRoot,pageId,input.historyRevision,input.expectedRevision,model.baseHash));}
    throw new EditorError(405,'方法不支持');
   }
   if(!['GET','HEAD'].includes(req.method))throw new EditorError(403,'本地预览禁止提交');
   const ui={'/__editor/':'index.html','/__editor/editor.css':'editor.css','/__editor/field-design.css':'field-design.css','/__editor/client.js':'client.mjs'};
   let file;if(ui[path])file=join(sourceRoot,'editor/ui',ui[path]);
   else if(path.startsWith('/assets/')||['/favicon.png','/favicon.ico'].includes(path)){
    const target=await realpath(join(publicRoot,decodeURIComponent(path)));if(!target.startsWith(publicRoot+sep)&&!target.startsWith(publicRoot))throw new EditorError(404,'资源不存在');file=target;
   }else throw new EditorError(404,'页面不存在');
   const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2'};
   res.setHeader('content-type',mime[extname(file)]||'application/octet-stream');res.end(await readFile(file));
  }catch(e){json(res,e instanceof EditorError?e.status:e.code==='ENOENT'?404:400,{error:e instanceof EditorError?e.message:'无法读取或保存，请保留输入后重试'});}
 });
 for(let i=0;;i++){try{await new Promise((done,reject)=>{server.once('error',reject);server.listen(port,host,()=>{server.removeListener('error',reject);done();});});break;}catch(e){if(e.code!=='EADDRINUSE'||i>=20)throw e;port++;}}
 origin='http://127.0.0.1:'+server.address().port;
 return {url:origin+'/__editor/',close:()=>new Promise((done,reject)=>server.close(e=>e?reject(e):done()))};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){const server=await startEditor();console.log('Perth Roof Care 本地后台 '+server.url);}
