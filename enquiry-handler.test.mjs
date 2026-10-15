import test from 'node:test';
import assert from 'node:assert/strict';
import enquiry from './enquiry.js';

const valid={name:'Test fixture',phone:'0400000000',email:'fixture@example.invalid',enquiry:'Synthetic roof enquiry for isolated tests',privacy:true,website:''};
function harness(t,{configured=true,outcome='success'}={}){
 const previous={RESEND_API_KEY:process.env.RESEND_API_KEY,RESEND_FROM:process.env.RESEND_FROM};
 for(const [key,value] of Object.entries({RESEND_API_KEY:configured?'isolated-test-key':undefined,RESEND_FROM:configured?'fixture@example.invalid':undefined})){
  if(value===undefined)delete process.env[key];else process.env[key]=value;
 }
 t.after(()=>{for(const [key,value] of Object.entries(previous)){if(value===undefined)delete process.env[key];else process.env[key]=value;}});
 const deliveries=[];
 t.mock.method(globalThis,'fetch',async(url,options)=>{
  deliveries.push({url,options,payload:JSON.parse(options.body)});
  if(outcome==='throw')throw new Error('Isolated transport failure');
  return new Response('{}',{status:outcome==='failure'?500:200,headers:{'content-type':'application/json'}});
 });
 return {deliveries,async run(body=valid,overrides={}){
  const response={headers:{},setHeader(key,value){this.headers[key]=value;},status(code){this.statusCode=code;return this;},json(data){this.body=data;return this;}};
  await enquiry({method:'POST',headers:{'content-type':'application/json'},body,...overrides},response);
  assert.equal(response.headers['cache-control'],'no-store');
  return response;
 }};
}

test('production JSON enquiry rejects every consent value except boolean true before delivery',async t=>{
 const h=harness(t);
 for(const privacy of [false,undefined,'false','true',1,{},[]]){
  const response=await h.run({...valid,privacy});
  assert.equal(response.statusCode,400,`privacy ${JSON.stringify(privacy)} cannot grant consent`);
  assert.match(response.body.error,/privacy information/);
 }
 assert.equal(h.deliveries.length,0,'rejected consent never reaches the mail boundary');
});

test('production JSON enquiry with boolean consent sends one escaped message to the configured recipient',async t=>{
 const h=harness(t),response=await h.run({...valid,name:' <fixture> ',enquiry:'Roof <detail> & test'});
 assert.equal(response.statusCode,200);assert.deepEqual(response.body,{ok:true});
 assert.equal(h.deliveries.length,1);
 const {url,options,payload}=h.deliveries[0];
 assert.equal(url,'https://api.resend.com/emails');assert.equal(options.method,'POST');
 assert.deepEqual(payload.to,['ellisservicesgroup3@outlook.com']);
 assert.equal(payload.from,'fixture@example.invalid');
 assert.match(payload.text,/Name: <fixture>/);assert.match(payload.html,/&lt;fixture&gt;/);
 assert.match(payload.html,/Roof &lt;detail&gt; &amp; test/);assert.doesNotMatch(payload.html,/<fixture>/);
});

test('production handler retains POST-only JSON transport and body limits without delivery',async t=>{
 const h=harness(t);
 for(const [overrides,status] of [[{method:'GET'},405],[{headers:{'content-type':'application/x-www-form-urlencoded'}},415],[{headers:{'content-type':'multipart/form-data'}},415],[{headers:{'content-type':'application/json','content-length':'12001'}},413]])assert.equal((await h.run(valid,overrides)).statusCode,status);
 for(const body of [null,[], 'unparsed JSON'])assert.equal((await h.run(body)).statusCode,400);
 assert.equal(h.deliveries.length,0);
});

test('production handler rejects missing required fields and malformed email without delivery',async t=>{
 const h=harness(t);
 for(const name of ['name','phone','email','enquiry'])assert.equal((await h.run({...valid,[name]:' '})).statusCode,400,name);
 assert.equal((await h.run({...valid,email:'invalid-email'})).statusCode,400);
 assert.equal(h.deliveries.length,0);
});

test('production honeypot returns its existing success response without mail or consent validation',async t=>{
 const h=harness(t),response=await h.run({website:'synthetic-bot'});
 assert.equal(response.statusCode,200);assert.deepEqual(response.body,{ok:true});assert.equal(h.deliveries.length,0);
});

test('production handler retains readable missing-configuration feedback without delivery',async t=>{
 const h=harness(t,{configured:false}),response=await h.run();
 assert.equal(response.statusCode,503);assert.match(response.body.error,/not configured/);assert.equal(h.deliveries.length,0);
});

for(const outcome of ['failure','throw'])test(`production handler retains readable ${outcome} delivery feedback through a mocked boundary`,async t=>{
 const h=harness(t,{outcome}),response=await h.run();
 assert.equal(response.statusCode,502);assert.match(response.body.error,/direct contact details/);assert.equal(h.deliveries.length,1);
});
