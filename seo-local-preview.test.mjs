import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

test('preview confines traffic to loopback, suppresses tracking and prevents email delivery', async t => {
  const child=spawn(process.execPath,['local-server.mjs'],{cwd:new URL('.',import.meta.url),env:{...process.env,PORT:'4815',PREVIEW_ONLY:'1',RESEND_API_KEY:'never-send',RESEND_FROM:'preview@example.com'},stdio:['ignore','pipe','pipe']});
  t.after(()=>child.kill());
  await once(child.stdout,'data');
  const base='http://127.0.0.1:4815';
  const home=await fetch(base); assert.equal(home.status,200);
  assert.equal(home.headers.get('x-robots-tag'),'noindex, nofollow');
  const html=await home.text();assert.doesNotMatch(html,/src="https:\/\/www.googletagmanager.com/);
  assert.doesNotMatch(html,/src="\/_vercel\/(?:speed-)?insights\/script\.js"/);
  assert.match(html,/rel="canonical" href="https:\/\/www.perthroofcare.com.au\//);
  const redirect=await fetch(base+'/index.html?source=preview',{redirect:'manual'});
  assert.equal(redirect.status,308);assert.equal(redirect.headers.get('location'),'/?source=preview');
  const response=await fetch(base+'/api/enquiry',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:'Preview',phone:'0400000000',email:'preview@example.com',enquiry:'Do not send',privacy:true})});
  assert.equal(response.status,503);assert.match((await response.json()).error,/preview/i);
});
