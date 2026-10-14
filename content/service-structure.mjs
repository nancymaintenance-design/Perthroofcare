import {serviceLabels} from './service-labels.mjs';
import {serviceCopy,topicGuide,topicPlacement} from './service-structure-data.mjs';
import {educationalTopics} from './keyword-map-content.mjs';
import {inspectionChargeNotice} from './audit-local-content.mjs';

const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paragraph=s=>`<p>${esc(s)}</p>`;
const topicHref=t=>`/news/${topicGuide[t.route]}/#education-${t.id.toLowerCase()}`;
const section=(purpose,title,body)=>`<section class="section service-section" data-service-section="${purpose}"><div class="container"><h2>${title}</h2>${body}</div></section>`;

function addGuideEducation($,route){
 const topics=educationalTopics.filter(t=>route===`news/${topicGuide[t.route]}`);
 if(!topics.length)return false;
 for(const t of topics){
  const id=`education-${t.id.toLowerCase()}`;
  if($(`#${id}`).length)continue;
  const [index,heading]=topicPlacement[t.id],parent=$(`#guide-section-${index}`).closest('section');
  if(parent.length!==1)throw new Error(`Missing education context ${route} / ${t.id}`);
  parent.append(`<div class="guide-education" id="${id}"><h3>${esc(heading)}</h3>${paragraph(t.body)}${t.id==='Q022'?'<p>For background on condensation, see the Australian Government’s <a href="https://www.yourhome.gov.au/passive-design/condensation">Your Home condensation guidance</a>.</p>':''}<p><a href="/${t.route}/#roof-questions-explained">${esc(serviceLabels[t.route])}</a></p></div>`);
 }
 // Existing H2 contents links still lead to the contextual parent sections.
 return true;
}

function fastenerCase(){
 return `<div class="service-case" id="metal-fastener-project"><h3>Fastener work and completed roof views</h3><p>This project record follows the roof surface and corroded fastener details through repair work to completed roof views. It shows the components and work at that property, with photographs of the different stages.</p><div class="project-case-grid"><figure><img src="/assets/images/metal-fastener-sequence-04-fastener-work.png" alt="Fastener work in progress in the recorded metal roof project" loading="lazy" decoding="async"><figcaption>Fastener work in progress in the same recorded project.</figcaption></figure><figure><img src="/assets/images/metal-fastener-sequence-05-completed.png" alt="Completed metal roof view from the recorded fastener repair project" loading="lazy" decoding="async"><figcaption>Completed roof view from the recorded fastener repair project.</figcaption></figure></div><p><a href="/projects/metal-roof-fastener-repair-sequence/">Metal roof fastener repair sequence</a></p></div>`;
}

function simplifyHub($,route){
 if(!['','services'].includes(route))return false;
 if($('main').hasClass('service-hub'))return false;
 $('main').addClass('service-hub');
 $('main .home-enquiry,main > .content-intent').remove();
 if(route==='services'){
  $('main h1').text('Roof repair services');
  const more=['roof-restoration','repair-options','roof-cleaning','roof-painting','box-gutter-repairs','roof-replacement','flat-roof-repairs','strata-roof-repairs'];
  $('.services-directory > .container').append(`<div class="hub-service-links" id="related-work-options"><h3>Finishing and wider roof work</h3><p>${more.map(r=>`<a href="/${r}/">${esc(serviceLabels[r])}</a>`).join(' · ')}</p></div>`);
  $('.additional-service-paths,main > #related-work-options').remove();
  $('.home-proof h2').text('Metal roof fastener work');
  $('.home-proof .container').append('<p><a href="/gallery/">All photographed project records</a></p>');
 }
 $('main a[href="/contact/"]').each((_,e)=>{const a=$(e);if(a.parent('p').length&&a.parent().text().trim()===a.text().trim())a.parent().remove();else a.remove();});
 $('main').append('<div class="container hub-enquiry content-intent"><p>For a leak, damaged component or planned maintenance, our team can arrange an assessment and explain the written repair scope. <a href="/roof-leak-repairs/">Roof leak repairs</a> · <a href="/repair-options/">Repair options</a></p>'+paragraph(inspectionChargeNotice)+'<p><a class="button" href="/contact/">Request a roof assessment</a></p></div>');
 return true;
}

// Terminal content owner: every historical service pass runs before this one.
// Evidence is moved intact; narrative is explicitly rewritten by serviceCopy.
export function applyServiceStructure($,route){
 if(route.startsWith('news/'))return addGuideEducation($,route);
 if(['','services'].includes(route))return simplifyHub($,route);
 const copy=serviceCopy[route];if(!copy)return false;
 const main=$('main');if(main.hasClass('service-layout'))return false;
 const originalIds=main.find('[id]').map((_,e)=>$(e).attr('id')).get();
 const hero=main.children('.service-hero').first().clone();
 if(!hero.length)throw new Error(`Service hero missing: ${route}`);
 hero.find('a[href="/contact/"]').parent('p').remove();
 hero.find('a[href="/contact/"]').remove();
 hero.find('h1').attr('id','service-overview');
 if(!hero.find('.inspection-charge-notice').length)hero.find('h1').parent().append(`<p class="inspection-charge-notice">${inspectionChargeNotice}</p>`);

 const evidence=main.children().filter((_,e)=>$(e).find('img').length).toArray().map((e,index)=>{
  const record=$(e).clone();record[0].tagName='div';record.removeClass('section').addClass('service-case');
  record.children('.container,.narrow').each((_,wrapper)=>$(wrapper).replaceWith($(wrapper).contents()));
  const heading=record.find('h2').first();
  if(!copy.caseTitles[index])throw new Error(`Unreviewed service evidence: ${route} / ${index}`);
  heading[0].tagName='h3';heading.text(copy.caseTitles[index]);
  record.find('a[href="/contact/"]').each((_,a)=>{const p=$(a).parent('p');if(p.length&&p.text().trim()===$(a).text().trim())p.remove();else $(a).remove();});
  return record;
 });
 if(evidence.length!==copy.caseTitles.length)throw new Error(`Evidence count differs from reviewed manifest: ${route}`);

 const links=new Map();
 main.find('a[href]').each((_,e)=>{
  const a=$(e),href=a.attr('href');
  if(!href.startsWith('/')||href==='/contact/'||a.closest('.breadcrumbs').length||evidence.some(record=>record.find('a').toArray().some(n=>$(n).attr('href')===href)))return;
  if(!links.has(href))links.set(href,$.html(a));
 });
 const guidance=main.find('.focus-faq details,#service-questions details').clone();
 const topics=educationalTopics.filter(t=>t.route===route);
 const reading=topics.length?`<div class="service-reading" id="roof-questions-explained"><h3>Further reading</h3><ul>${topics.map(t=>`<li data-topic="${t.id}"><a href="${topicHref(t)}">${esc(topicPlacement[t.id][1])}</a></li>`).join('')}</ul></div>`:'';
 const related=`<p class="service-related keyword-gap-content"${originalIds.includes('related-work-options')?' id="related-work-options"':''}>Related services and guides: ${[...links.values()].join(' · ')}</p>`;
 const guidanceMarkup=guidance.length?`<div class="focus-faq service-guidance"><h3>Scope details</h3>${guidance.toArray().map(e=>$.html(e)).join('')}</div>`:'';
 main.empty().addClass('service-layout').append(hero);
 main.append(section('content','Service content',`<div class="service-description"><h3>${esc(copy.heading)}</h3>${paragraph(copy.content)}</div>`));
 main.append(section('solution','Our solution',`<div class="service-solution-body content-intent"><ol class="service-steps repair-delivery">${copy.steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol><p class="service-boundary">${esc(copy.boundary)}</p>${guidanceMarkup}${reading}${related}</div>`));
 if(evidence.length){
  main.append(section('work','Our work','<div class="service-case-list"></div>'));
  const target=main.find('.service-case-list');for(const record of evidence)target.append(record);
  if(route==='metal-roof-repairs')target.append(fastenerCase());
 }
 const target=main.children('section').last().children('.container');
 target.append(`<div class="service-enquiry"><p>We assess the roof on site and explain the written repair quote before work. ${inspectionChargeNotice} Existing safe photos are optional; do not climb onto the roof or enter an unsafe roof space.</p><a class="button" href="/contact/">Request a roof assessment</a></div>`);
 const targets={content:'.service-description',steps:'.service-steps',boundary:'.service-boundary',guidance:'.service-guidance'};
 for(const [id,targetName] of Object.entries(copy.anchors)){
  const target=main.find(targets[targetName]);if(target.length!==1)throw new Error(`Missing anchor content ${route} / ${id}`);
  target.attr('id',id);
 }
 for(const id of originalIds)if(main.find(`[id="${id}"]`).length!==1)throw new Error(`Lost service anchor ${route} / ${id}`);
 $('head').append('<link rel="stylesheet" href="/assets/css/service-layout.css">');
 return true;
}
