import {localMetadataRoutes,areaContextLinks} from './audit-local-content.mjs';

export const localServices={
 'roof-cleaning':'Roof cleaning',
 'roof-painting':'Roof painting',
 'box-gutter-repairs':'Box gutter repair',
 'roof-replacement':'Whole-roof replacement',
 'flat-roof-repairs':'Flat roof repair',
 'strata-roof-repairs':'Strata roof repair'
};

// The 39 pages with actual copy, metadata or contextual-link changes in Task 1,
// checked against main..c61dcc7. A rebuild alone must not advance these dates.
export const localEditorialRoutes=new Set([
 ...Object.keys(localServices),'roof-inspection','contact','about',
 ...localMetadataRoutes,
 ...Object.keys(areaContextLinks).map(area=>`areas/${area}-roof-repairs`)
]);
export const localEditorialDate='2026-10-13';

export function refineLocalServiceGraph($,graph,route,canonical){
 const business=graph.find(node=>node['@type']==='LocalBusiness');
 if(localServices[route]){
  const id=canonical+'#service';
  const service={
   '@type':'Service','@id':id,
   name:$('main h1').first().text().trim().replace(/\.$/,''),
   serviceType:localServices[route],url:canonical,
   provider:{'@id':business['@id']},areaServed:[{'@type':'City',name:'Perth'}]
  };
  const existing=graph.findIndex(node=>node['@id']===id);
  if(existing>=0)graph[existing]=service;else graph.push(service);
  const webPage=graph.find(node=>node['@type']==='WebPage');
  webPage.mainEntity={'@id':id};
 }
 // Perth is confirmed; WA remains the office's addressRegion, not a promise
 // to serve the whole state. Retain evidenced local places such as Roleystone.
 for(const node of graph.filter(node=>node['@type']==='Service')){
  node.areaServed=[node.areaServed].flat()
   .filter(area=>area&&!['WA','Western Australia'].includes(area.name))
   .map(area=>area['@type']==='PostalAddress'?{'@type':'Place',name:`${area.addressRegion==='Western Australia'?'WA':area.addressRegion} ${area.postalCode}`,address:area}:area);
  if(!node.areaServed.some(area=>area['@type']==='City'&&area.name==='Perth'))node.areaServed.unshift({'@type':'City',name:'Perth'});
 }
}
