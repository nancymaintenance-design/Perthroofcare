import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
function setup(hostname='www.perthroofcare.com.au'){
  const events=[],handlers={},window={location:{hostname,pathname:'/roof-leak-repairs/'},gtag:(...args)=>events.push(args)};
  runInNewContext(readFileSync(new URL('./analytics.js',import.meta.url),'utf8'),{window,document:{addEventListener:(name,fn)=>handlers[name]=fn}});
  return {events,handlers,window};
}
test('lead is measured only for confirmed API success, never failed or malformed responses',()=>{
  const {window,events}=setup();
  window.ellisAnalytics.leadConfirmed({ok:false},{ok:true});
  window.ellisAnalytics.leadConfirmed({ok:true},{});
  window.ellisAnalytics.leadConfirmed({ok:true},{ok:false});
  assert.equal(events.length,0);
  window.ellisAnalytics.leadConfirmed({ok:true},{ok:true,name:'Secret',email:'private@example.com'});
  assert.equal(events.length,1);assert.equal(events[0][1],'generate_lead');
  assert.deepEqual(JSON.parse(JSON.stringify(events[0][2])),{page_type:'service',method:'website_form'});
});
test('contact click events contain categories only and never phone or email values',()=>{
  const {handlers,events}=setup();
  for(const href of ['tel:+61405878406','mailto:private@example.com'])handlers.click({target:{closest:()=>({getAttribute:()=>href})}});
  assert.deepEqual(events.map(e=>e[1]),['click_to_call','email_click']);
  assert.doesNotMatch(JSON.stringify(events),/614058|private@/);
});
test('localhost never emits analytics even if a gtag function exists',()=>{
  for(const host of ['localhost','127.0.0.1','::1','[::1]']){
    const {window,events,handlers}=setup(host);window.ellisAnalytics.leadConfirmed({ok:true},{ok:true});
    handlers.click?.({target:{closest:()=>({getAttribute:()=> 'tel:+61405878406'})}});
    assert.equal(events.length,0);
  }
});
