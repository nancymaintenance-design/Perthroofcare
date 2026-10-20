import {serviceLabels} from './service-labels.mjs';

// Editorial relationships: confirmed keyword map + actual page scope, not URL nesting.
const serviceParents={
 'gutter-repairs':'gutters-downpipes','downpipe-repairs':'gutters-downpipes','box-gutter-repairs':'gutters-downpipes',
 'roof-cleaning':'roof-cleaning-painting','roof-painting':'roof-cleaning-painting','strata-roof-repairs':'commercial-roof-repairs'
};
const chineseServices=['屋面维修','屋面渗漏维修','瓦屋面维修','金属屋面维修','屋脊盖瓦与重新勾缝','屋面天沟及泛水板维修','檐沟维修','檐沟与落水管','落水管维修','屋面维护','屋面清洗与喷涂','商业屋面维修','风暴损坏屋面维修','屋面翻修','屋面检查','维修选项','屋面清洗','屋面涂装','箱型檐沟维修','屋面更换','平屋面维修','分层产权物业屋面维修'];
const guideRows=[
 ['metal-roofing-perth','metal-roof-repairs','Metal roof materials and repairs','金属屋面材料与维修'],
 ['gutter-warning-signs','gutter-repairs','Gutter overflow and warning signs','檐沟溢水与故障迹象'],
 ['roof-leak-inspection','roof-leak-repairs','Investigating roof leaks','屋面漏水检查'],
 ['roof-maintenance-basics','roof-maintenance','Roof maintenance guide','屋面保养指南'],
 ['roof-flashing-explained','flashing-repairs','Roof flashing explained','屋面泛水说明'],
 ['drainage-after-rain','gutters-downpipes','Roof drainage after rain','雨后屋面排水'],
 ['roof-leak-detection-perth','roof-leak-repairs','Tracing recurring roof leaks','反复漏水的排查'],
 ['tile-roof-repairs-perth-guide','tile-roof-repairs','Broken tile replacement and matching','破损屋面瓦更换与匹配'],
 ['metal-roof-repairs-perth-guide','metal-roof-repairs','Metal roof screws and washers','金属屋面螺钉与垫圈'],
 ['ridge-capping-repairs-perth-guide','ridge-capping-repointing','Repointing and rebedding','屋脊重新勾缝与重铺砂浆'],
 ['roof-valleys-flashing-repairs-perth','flashing-repairs','Valley and chimney flashing leaks','屋面天沟与烟囱泛水漏水'],
 ['roof-inspection-perth-guide','roof-inspection','Roof checks before winter rain','冬雨前的屋面检查'],
 ['roof-repair-cost-perth','roof-repairs','Roof repair quotes and cost factors','屋面维修报价与费用因素']
];
const projectRows=[
 ['roleystone-metal-roof-fastener-leak-repair','metal-roof-repairs','Fastener leak repair in Roleystone','Roleystone 金属屋面紧固件漏水维修'],
 ['metal-roof-fastener-repair-sequence','metal-roof-repairs','Metal roof fastener repair','金属屋面紧固件维修'],
 ['wa-6121-tile-roof-valley-gutter-cleaning',null,'Tile repairs and valley cleaning','瓦屋面维修与天沟清理'],
 ['metal-roof-ridge-capping-repair-perth','metal-roof-repairs','Metal roof ridge capping repair','金属屋面屋脊盖板维修'],
 ['tile-roof-chimney-flashing-repair-perth','flashing-repairs','Tile roof chimney flashing repair','瓦屋面烟囱泛水维修'],
 ['metal-roof-hip-ridge-capping-repair-perth','metal-roof-repairs','Metal roof hip and ridge capping','金属屋面斜脊与屋脊盖板维修'],
 ['tile-roof-valley-chimney-flashing-repairs-perth','flashing-repairs','Tile roof valley and chimney flashing','瓦屋面天沟与烟囱泛水维修'],
 ['metal-roof-ridge-flashing-repair-perth','flashing-repairs','Metal roof ridge flashing repair','金属屋面屋脊泛水维修']
];
const areaRows=[
 ['cottesloe','Cottesloe'],['mosman-park','Mosman Park'],['city-beach','City Beach'],['scarborough','Scarborough'],
 ['claremont','Claremont'],['nedlands','Nedlands'],['subiaco','Subiaco'],['perth','Perth CBD'],['leederville','Leederville'],
 ['joondalup','Joondalup'],['hillarys','Hillarys'],['fremantle','Fremantle'],['rockingham','Rockingham'],['kalamunda','Kalamunda'],
 ['victoria-park','Victoria Park'],['bayswater','Bayswater']
];
const infoRows=[
 ['','home','Home','首页'],['services','directory','Roof repair services','屋面维修服务'],
 ['service-areas','directory','Service areas','服务地区'],['gallery','directory','Roof repair projects','屋面维修案例'],
 ['news','directory','Roof repair guides','屋面维修指南'],['faq','information','Roof repair FAQs','屋面维修常见问题'],
 ['about','information','About us','关于我们'],['contact','contact','Contact us','联系我们'],
 ['privacy','information','Privacy','隐私'],['legal','information','Website information','网站信息']
];
export const navigationDefinitions=Object.freeze([
 ...infoRows.map(([route,type,en,zh])=>({route,type,en,zh,parent:route?'':null,owner:route===''?'':null,basis:'Existing substantive directory/company route; home retains broad Perth roof repairs intent.'})),
 ...Object.entries(serviceLabels).map(([route,en],i)=>({route,type:serviceParents[route]?'subservice':'service',en,zh:chineseServices[i],parent:serviceParents[route]||'',owner:route,basis:'Existing service scope and confirmed keyword map; specific query destination retained.'})),
 ...guideRows.map(([slug,owner,en,zh])=>({route:'news/'+slug,type:'guide',en,zh,parent:owner,owner,basis:'Guide body and maintained guide-to-service links identify this repair scope.'})),
 ...projectRows.map(([slug,owner,en,zh])=>({route:'projects/'+slug,type:'case',en,zh,parent:owner||'gallery',owner,basis:owner?'Photographed work and project narrative match the service; metal capping is not tiled-roof repointing.':'Combined tile repairs and valley cleaning: retain multi-service case collection.',related:owner?[owner]:['tile-roof-repairs','gutters-downpipes','roof-maintenance']})),
 ...areaRows.map(([slug,name])=>({route:'areas/'+slug+'-roof-repairs',type:'location',en:name+' roof repairs',zh:name+' 屋面维修',parent:'service-areas',owner:'',related:['roof-leak-repairs','tile-roof-repairs','metal-roof-repairs','gutters-downpipes'],basis:'Actual locality page under useful area directory; broad city intent stays with home.'}))
]);

export const priorityServices=['roof-repairs','roof-leak-repairs','tile-roof-repairs','metal-roof-repairs','ridge-capping-repointing','flashing-repairs','gutters-downpipes','gutter-repairs','downpipe-repairs','roof-inspection','roof-maintenance','commercial-roof-repairs'];

export function createNavigationMap(pages,origin){
 const records=new Map();
 for(const definition of navigationDefinitions)for(const locale of ['en-AU','zh-Hans']){
  const prefix=locale==='zh-Hans'?'/zh/':'/',path=prefix+(definition.route?definition.route+'/':''),url=origin+path;
  const page=pages.get(path);if(!page)throw new Error('Navigation page missing: '+path);
  const counterpart=page.$(`link[hreflang="${locale==='en-AU'?'zh-Hans':'en-AU'}"]`).attr('href');
  const expected=origin+(locale==='en-AU'?'/zh/':'/')+(definition.route?definition.route+'/':'');
  if(counterpart!==expected)throw new Error('Navigation language pair mismatch: '+path);
  if(page.$('link[rel=canonical]').attr('href')!==url)throw new Error('Navigation canonical mismatch: '+path);
  if(page.$('html').attr('lang')!==locale)throw new Error('Navigation language mismatch: '+path);
  const indexing=page.$('meta[name="robots"],meta[name="googlebot"]').map((_,e)=>page.$(e).attr('content')).get().join(',');
  if(/noindex|\bnone\b/i.test(indexing))throw new Error('Navigation page not indexable: '+path);
  records.set(path,{page_id:(locale==='zh-Hans'?'zh:':'en:')+(definition.route||'home'),path,url,locale,page_type:definition.type,service_group:definition.owner??null,commercial_owner_url:definition.owner===null?null:origin+prefix+(definition.owner?definition.owner+'/':''),primary_parent_url:definition.parent===null?null:origin+prefix+(definition.parent?definition.parent+'/':''),breadcrumb_label:locale==='zh-Hans'?definition.zh:definition.en,alternate_url:counterpart,indexing:indexing||'indexable; no noindex',basis:definition.basis,definition});
 }
 if(records.size!==pages.size)throw new Error('Unmapped public routes: '+[...pages.keys()].filter(k=>!records.has(k)).join(','));
 validateNavigationMap(records);
 return records;
}

export function validateNavigationMap(records){
 const byUrl=new Map([...records.values()].map(r=>[r.url,r]));
 for(const record of records.values()){
  const seen=new Set([record.url]);let cursor=record;
  if(record.commercial_owner_url){
   const owner=byUrl.get(record.commercial_owner_url);
   if(!owner)throw new Error('Missing service destination: '+record.url);
   if(owner.locale!==record.locale)throw new Error('Cross-language service destination: '+record.url);
  }
  while(cursor.primary_parent_url){
   if(seen.has(cursor.primary_parent_url))throw new Error('Navigation cycle: '+record.url);
   const parent=byUrl.get(cursor.primary_parent_url);if(!parent)throw new Error('Missing parent: '+record.url);
   if(parent.locale!==record.locale)throw new Error('Cross-language parent: '+record.url);
   seen.add(parent.url);cursor=parent;
  }
 }
}

export function breadcrumbTrail(record,records){
 const byUrl=new Map([...records.values()].map(r=>[r.url,r]));
 const trail=[record];let cursor=record;
 while(cursor.primary_parent_url){cursor=byUrl.get(cursor.primary_parent_url);trail.unshift(cursor);}
 return trail;
}
