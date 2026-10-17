// Windows desktop bootstrap, kept as JS so it can compile the TypeScript editor.
// Local startup only. No npm shell, execution-policy changes, Git or deployment.
const fs=require('node:fs'),path=require('node:path'),{spawn,spawnSync}=require('node:child_process'),{pathToFileURL}=require('node:url');
const alive=pid=>{if(!Number.isSafeInteger(pid)||pid<=0)return false;try{process.kill(pid,0);return true;}catch{return false;}};
async function findManaged(sourceRoot,stateRoot){
 try{const state=JSON.parse(fs.readFileSync(path.join(stateRoot,'state.json'),'utf8')),u=new URL(state.url);
  if(state.sourceRoot!==sourceRoot||!alive(state.pid)||u.protocol!=='http:'||u.hostname!=='127.0.0.1'||u.pathname!=='/__editor/'||u.username||u.password||u.search||u.hash)return null;
  const r=await fetch(u,{signal:AbortSignal.timeout(2000)});if(!r.ok||!(await r.text()).includes('<h1>中文草稿编辑器</h1>'))return null;
  return state.url;
 }catch{return null;}
}
async function launchManaged({sourceRoot,stateRoot=path.join(sourceRoot,'.local-editor','launcher'),port=4206,draftRoot}){
 sourceRoot=fs.realpathSync(sourceRoot);fs.mkdirSync(stateRoot,{recursive:true});
 const lock=path.join(stateRoot,'startup.lock');let locked=false;
 for(let attempt=0;attempt<120;attempt++){
  const running=await findManaged(sourceRoot,stateRoot);if(running)return {url:running,reused:true};
  try{fs.writeFileSync(lock,String(process.pid),{flag:'wx'});locked=true;break;}catch(e){if(e.code!=='EEXIST')throw e;
   // Only recover our own generated startup marker when its process is gone.
   const owner=Number(fs.readFileSync(lock,'utf8'));if(Number.isSafeInteger(owner)&&owner>0&&!alive(owner)){try{fs.unlinkSync(lock);}catch(e){if(e.code!=='ENOENT')throw e;}}
   await new Promise(r=>setTimeout(r,250));
  }
 }
 if(!locked)throw Error('后台正在启动，请稍后再次双击。');
 try{const running=await findManaged(sourceRoot,stateRoot);if(running)return {url:running,reused:true};
  const {startEditor}=await import(pathToFileURL(path.join(sourceRoot,'tools','editor','server.mjs')).href);
  const server=await startEditor({host:'127.0.0.1',port,sourceRoot,...(draftRoot?{draftRoot}: {})});
  const temporary=path.join(stateRoot,'state.json.tmp');fs.writeFileSync(temporary,JSON.stringify({pid:process.pid,sourceRoot,url:server.url},null,2));fs.renameSync(temporary,path.join(stateRoot,'state.json'));
  return {url:server.url,reused:false,server};
 }finally{fs.unlinkSync(lock);}
}
module.exports={findManaged,launchManaged};
if(require.main===module){
 const sourceRoot=path.resolve(__dirname,'../..'),stateRoot=path.join(sourceRoot,'.local-editor','launcher');
 launchManaged({sourceRoot,stateRoot}).then(({url,reused})=>{
  fs.appendFileSync(path.join(stateRoot,'launcher.log'),`${new Date().toISOString()} ${reused?'Reused':'Started'} ${url}\n`);
  const browser=spawn('rundll32.exe',['url.dll,FileProtocolHandler',url],{windowsHide:true,detached:true,stdio:'ignore'});browser.on('error',error=>fs.appendFileSync(path.join(stateRoot,'launcher.log'),`Browser: ${error.message}\n`));browser.unref();
 }).catch(error=>{
  fs.mkdirSync(stateRoot,{recursive:true});fs.appendFileSync(path.join(stateRoot,'launcher.log'),`${new Date().toISOString()} ${error.stack}\n`);
  const log=path.join(stateRoot,'launcher.log').replaceAll("'","''");
  spawn('powershell.exe',['-NoProfile','-WindowStyle','Hidden','-Command',`Add-Type -AssemblyName PresentationFramework; [System.Windows.MessageBox]::Show('本地后台未能启动。请将以下日志发给助手：${log}','Perth Roof Care 本地后台')`],{windowsHide:true,stdio:'ignore'});
  process.exitCode=1;
 });
}
