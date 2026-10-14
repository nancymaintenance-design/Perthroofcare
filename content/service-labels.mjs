// One display-name owner for service navigation and the final service envelope.
// Route keys deliberately exclude geographic project, guide and area pages.
export const serviceLabels=Object.freeze({
 'roof-repairs':'Roof repairs','roof-leak-repairs':'Roof leak repairs','tile-roof-repairs':'Tile roof repairs','metal-roof-repairs':'Metal roof repairs',
 'ridge-capping-repointing':'Ridge capping & repointing','flashing-repairs':'Roof valleys & flashing repairs','gutter-repairs':'Gutter repairs','gutters-downpipes':'Gutters & downpipes',
 'downpipe-repairs':'Downpipe repairs','roof-maintenance':'Roof maintenance','roof-cleaning-painting':'Roof cleaning & painting','commercial-roof-repairs':'Commercial roof repairs',
 'storm-damage-roof-repairs':'Storm damage roof repairs','roof-restoration':'Roof restoration','roof-inspection':'Roof inspection','repair-options':'Repair options',
 'roof-cleaning':'Roof cleaning','roof-painting':'Roof painting','box-gutter-repairs':'Box gutter repairs','roof-replacement':'Roof replacement','flat-roof-repairs':'Flat roof repairs','strata-roof-repairs':'Strata roof repairs'
});

function serviceTarget(href){
 if(!href||(!href.startsWith('/')&&!href.startsWith('https://www.perthroofcare.com.au/')))return;
 const url=new URL(href,'https://www.perthroofcare.com.au');
 if(url.origin!=='https://www.perthroofcare.com.au')return;
 return url.pathname.replace(/^\/|\/$/g,'');
}

const legacyLabelAliases={
 'ridge-capping-repointing':['Ridge capping repairs'],
 'storm-damage-roof-repairs':['Emergency roof repairs','Emergency & storm damage roof repairs'],
 'repair-options':['Roof repair options']
};
// The final audit preserves entities in text nodes. Compare ampersand spellings
// as the same conjunction without changing that parser or unrelated prose.
const comparableLabel=text=>text.toLowerCase().replace(/&(?:amp|#0*38|#x0*26);/g,'&').replace(/\s*&\s*/g,' and ').replace(/\s+/g,' ').trim();

function replaceLinkLabel($,anchor,label,target){
 const texts=[];
 function visit(node){
  if(node.type==='text'){if(node.data.replace(/[→↗\s]/g,''))texts.push(node);return;}
  if(node.attribs?.['aria-hidden']==='true'||['svg','img'].includes(node.name))return;
  for(const child of node.children||[])visit(child);
 }
 visit(anchor[0]);
 if(!texts.length)return;
 const sentence=anchor.closest('p,li');
 const surrounding=sentence.clone().find('a').remove().end().text();
 const inline=/[a-z]/i.test(surrounding);
 if(inline){
  // A linked clause can complete the surrounding sentence. Only recognised
  // service-name aliases are shortened inside prose; factual phrasing survives.
  const existing=comparableLabel(anchor.text().replace(/[→↗]/g,'').trim().replace(/\.$/,'').replace(/\s+(?:in\s+)?Perth$/i,''));
  if(![label,...(legacyLabelAliases[target]||[])].some(alias=>comparableLabel(alias)===existing))return;
 }
 texts.forEach((node,index)=>{
  const leading=node.data.match(/^\s*/)[0],trailing=node.data.match(/\s*([→↗]\s*)?$/)[0];
  node.data=index===0?leading+(inline?label.toLowerCase():label)+trailing:leading+trailing;
 });
 if(anchor.attr('aria-label'))anchor.attr('aria-label',label);
}

// Runs after declarative rewriting and before knowledge/schema synchronisation.
export function applyServiceLabels($,route,graph){
 $('a[href]').each((_,e)=>{
  const anchor=$(e),target=serviceTarget(anchor.attr('href')),label=serviceLabels[target];
  // FAQ answer text is a protected record, including its contextual links.
  if(route==='faq'&&anchor.closest('main details').length)return;
  if(label)replaceLinkLabel($,anchor,label,target);
 });
 $('.home-service-map article').each((_,e)=>{
  const card=$(e),target=card.find('a[href]').map((_,a)=>serviceTarget($(a).attr('href'))).get().find(r=>serviceLabels[r]);
  if(target){
   card.find('h3').first().text(serviceLabels[target]);
   // Directory eyebrows repeated the old place-stacked heading. Use the same
   // category label as the home cards and keep the core name in the heading.
   if(card.closest('.services-directory').length)card.find('.eyebrow').text('Roof repair services');
  }
 });
 const label=serviceLabels[route];if(!label)return false;
 const h1=$('main h1').first();h1.text(label);
 h1.closest('section').find('.eyebrow').first().text(label);
 $('[aria-current="page"]').text(label);
 const title=label+' Perth | Ellis Services Group';
 $('title').text(title);$('meta[property="og:title"],meta[name="twitter:title"]').attr('content',title);
 for(const node of graph){
  if(node['@type']==='Service')node.name=label;
  if(node['@type']==='BreadcrumbList'&&node.itemListElement?.length)node.itemListElement.at(-1).name=label;
 }
 return true;
}
