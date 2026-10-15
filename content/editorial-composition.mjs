import {faqRecords} from './faq-records.mjs';
import {projectStageLabels} from './project-stage-labels.mjs';
import {editorialHeadingMap} from './editorial-heading-map.mjs';
import {inspectionChargeNotice} from './audit-local-content.mjs';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const key=s=>s.toLowerCase().replace(/\.$/,'').trim();
const faqGroups=[['leak-patterns','Leaks, stains and previous repairs'],['tiles-ridges','Tiles and ridge capping'],['junctions-metal','Valleys, flashings and metal roofs'],['drainage-moisture','Drainage and other moisture sources'],['repair-decisions','Repair, restoration and replacement'],['inspection-enquiry','Inspection, quotes and winter preparation'],['company-records','Company details, projects and privacy']];
function composeFaq($){
 const hero=$('main > section').first().clone();
 const questions=faqGroups.map(([id,title])=>`<section class="faq-category" id="${id}"><h2>${esc(title)}</h2><div class="faq-list">${faqRecords.filter(r=>r.group===id).map(r=>{
  let answer=r.paragraphs.filter(Boolean).map(p=>`<p>${p}</p>`).join('');
  for(const alias of r.aliases.slice(1).reverse())answer=`<div id="${alias}">${answer}</div>`;
  return `<details${r.aliases.length?` id="${r.aliases[0]}"`:''}><summary>${esc(r.question)}</summary>${answer}</details>`;
 }).join('')}</div></section>`).join('');
 $('main').empty().append(hero).append(`<section class="section" id="educational-questions"><div class="container"><nav class="faq-topic-nav" aria-label="Roof question topics"><ul>${faqGroups.map(([id,title])=>`<li><a href="#${id}">${esc(title)}</a></li>`).join('')}</ul></nav>${questions}<nav id="related-work-options" aria-label="Related roof services"><h2>Roof repairs and inspections</h2><p><a href="/box-gutter-repairs/">Box gutter repairs</a> · <a href="/flat-roof-repairs/">Flat roof repairs</a> · <a href="/news/">Roof repair guides</a></p></nav><div class="content-intent"><h2>Send a roof repair question</h2><p>These answers explain general repair decisions. Include the roof material, suburb, timing of water entry and previous repairs when contacting the team. Leave roof access and close-up investigation to the inspection.</p><p>${inspectionChargeNotice}</p><p><a class="button" href="/contact/">Send your roof question</a></p></div></div></section>`);
}
const guideGroups=[
 ['Leaks and inspection',['roof-leak-detection-perth','roof-leak-inspection','roof-inspection-perth-guide']],
 ['Roof materials and junction repairs',['tile-roof-repairs-perth-guide','metal-roof-repairs-perth-guide','metal-roofing-perth','ridge-capping-repairs-perth-guide','roof-valleys-flashing-repairs-perth','roof-flashing-explained']],
 ['Drainage and maintenance',['gutter-warning-signs','drainage-after-rain','roof-maintenance-basics']],
 ['Repair costs and written quotes',['roof-repair-cost-perth']]
];
const guideSummaries={
 'roof-leak-detection-perth':'Trace recurring leaks through rain patterns, ceiling stains and connected roof details; understand why earlier sealing may not resolve the source.',
 'roof-leak-inspection':'Prepare the affected room, rainfall timing and repair history for an inspection of the connected roof and drainage path.',
 'roof-inspection-perth-guide':'Review roof coverings, ridge and wall junctions, drainage, inspection fees and records before agreeing maintenance priorities.',
 'tile-roof-repairs-perth-guide':'Compare cracked or slipped tiles, compatible replacement profiles and adjoining ridge or flashing work.',
 'metal-roof-repairs-perth-guide':'Understand screw seals, fixing-hole corrosion and sheet condition before choosing local fastener or sheet repairs.',
 'metal-roofing-perth':'Identify corrugated metal roof profiles, coatings, laps and capping details relevant to compatible repair materials.',
 'ridge-capping-repairs-perth-guide':'Distinguish deteriorated pointing from failed bedding, and identify the ridge runs and adjoining tiles included in a repair quote.',
 'roof-valleys-flashing-repairs-perth':'Follow runoff through valleys and chimney junctions; distinguish debris clearing from formed-metal repairs or replacement.',
 'roof-flashing-explained':'Understand how flashing connects roof coverings to walls, chimneys and openings, with safe observations to report.',
 'gutter-warning-signs':'Separate blocked outlets, leaking joints, loose supports and corrosion when assessing overflow and local gutter work.',
 'drainage-after-rain':'Record valley discharge, gutter overflow and downpipe behaviour to explain a connected roof drainage problem.',
 'roof-maintenance-basics':'Plan tile, metal and drainage maintenance from known defects, seasonal deposits and previous repair records.',
 'roof-repair-cost-perth':'Compare inspection fees, repair materials, access, waste removal, exclusions and written terms without assuming a universal price.'
};
function composeNews($){
 const hero=$('main > section').first().addClass('index-hero');
 hero.find('h1').text('Roof repair guides');hero.find('.breadcrumbs [aria-current="page"]').text('Roof repair guides');
 const cards=new Map();$('.guide-index article').each((_,e)=>{const card=$(e).clone(),href=card.find('a[href^="/news/"]').first().attr('href');if(href)cards.set(href.split('/')[2],card);});
 const directory=$('.guide-index > .container').empty();
 for(const [title,slugs] of guideGroups){
  const group=$(`<section class="faq-category"${slugs.includes('roof-repair-cost-perth')?' id="related-work-options"':''}><h2>${esc(title)}</h2><div class="cards"></div></section>`);
  for(const slug of slugs){const card=cards.get(slug);if(!card)throw new Error(`Missing guide card ${slug}`);
   const heading=card.find('h2,h3').first();heading[0].tagName='h3';
   // The group and title supply the topic; retain only the reviewed task summary.
   card.find('.eyebrow').remove();
   card.find('p').slice(1).remove();
   card.find('p').first().text(guideSummaries[slug]);
   // One complete title link per guide; headings remain the reading hierarchy.
   card.find('a').text('Read the guide');group.find('.cards').append(card);
  }directory.append(group);
 }
 $('main > #related-work-options,main > .content-intent').remove();
 const enquiry=$('.home-enquiry');enquiry.find('h2').text('Send a roof assessment enquiry');
 enquiry.find('.container').children('p:not(.eyebrow)').first().text('General guidance cannot diagnose a property. Send the suburb, affected roof or drainage area, timing and previous repair details. Existing safe photographs are optional.');
 const fee=enquiry.find('.inspection-charge-notice');if(!fee.length)enquiry.find('a[href="/contact/"]').closest('p').before(`<p class="inspection-charge-notice">${inspectionChargeNotice}</p>`);
 directory.append(enquiry.find('.container').contents());enquiry.remove();
 directory.append($('.rss-resource .container').contents());$('.rss-resource').remove();
}
function composeGallery($){
 const hero=$('main > section').first();
 hero.find('h1').text('Roof repair projects');hero.find('.breadcrumbs [aria-current="page"]').text('Roof repair projects');
 const period=hero.find('.project-period').remove(),periodText=period.text().trim(),dateEnd=periodText.indexOf('.')+1;
 const lead=hero.find('p:not(.eyebrow)').first().text('Project photographs show tile and metal roof details, ridge and hip capping, chimney flashing, fastener work and drainage maintenance. ');
 lead.append(`<span class="project-period">${esc(periodText.slice(0,dateEnd))}</span>`);
 const library=$('.case-library > .container');library.children('.eyebrow,h2').remove();
 const intro=library.children('p:not(.eyebrow)').first().text('These supplied photographs record work at individual properties. They are not a price guide or a guarantee of the same outcome at another property. Repair scope depends on the roof material, condition and access. '+periodText.slice(dateEnd).trim()+' Each project links to the matching repair services.');
 library.find('.case-library-grid').after(intro);
 const actions=$('main > .texture a,main > .content-intent a').toArray().map(a=>$.html(a));
 library.append(`<p>${inspectionChargeNotice}</p><p>${actions.join(' · ')}</p>`);
 $('main > .texture,main > .content-intent').remove();
}
// Final reviewed composition, after historical content passes and before schema.
export function applyEditorialComposition($,route){
 if($('main').attr('data-editorial-composition')==='2026-10-15')return false;
 if(route==='about')return false;
 if(route==='faq')composeFaq($);
 if(route==='news')composeNews($);
 if(route==='gallery')composeGallery($);
 if(route==='')$('main h1').text('Roof repairs in Perth');
 $('main figcaption').each((_,e)=>{const replacement=projectStageLabels[$(e).text()];if(replacement){const link=$(e).find('a').clone();$(e).text(replacement);if(link.length){$(e).text(replacement.replace(/ Explore the project photographs\.$/,''));$(e).append(' ',link);}}});
 $('main .eyebrow').each((_,e)=>{const old=$(e).text();const label={
  'DOCUMENTED PROJECT':'Roof repair project',
  'REAL CASE RECORD / LOCATION NOT PUBLISHED':'Roof repair photographs',
  'URGENT ROOF-RESPONSE RECORD / LOCATION NOT PUBLISHED':'Roof-void observations',
  'DOCUMENTED COMPLETED WORK / PERTH':'Completed roof work / Perth',
  'COMPLETED PROJECT RECORDS':'Roof repair projects',
  'DOCUMENTED PROJECT / ROLEYSTONE, WA':'Metal fastener repairs / Roleystone, WA',
  'DOCUMENTED PROJECT / WESTERN AUSTRALIA 6121':'Tile and drainage work / Western Australia 6121',
  'DOCUMENTED COMPLETED WORK':'Completed roof work',
  'WHAT THE PHOTO RECORD SHOWS':'Roof components and repair details'
 }[old];if(label)$(e).text(label);});
 const common={
  'direct links to perth roof repair services':'Roof repair services',
  'request a roof repair service':'Send a roof repair enquiry',
  'keep material continuity':'Matching existing roof materials',
  'pinpoint local covering damage':'Locating damage in the roof covering',
  'connected rainwater goods':'Connected gutters and downpipes',
  'separate each roof elevation':'Individual roof elevations',
  'a targeted scope agreed with the customer':'Agreed metal fastener repair scope',
  '1 / prepare the affected detail':'1 / Fastener-area preparation',
  'metal roof fastener leak repair in roleystone':'Metal roof fastener leak repair in Roleystone'
 };
 const specific=Object.fromEntries(Object.entries(editorialHeadingMap[route]||{}).map(([a,b])=>[key(a),b]));
 $('main h1,main h2,main h3,main summary').each((_,e)=>{const replacement=specific[key($(e).text())]||common[key($(e).text())];if(replacement)$(e).text(replacement);});
 if(route==='services')$('.hub-service-links h3').text('Cleaning, painting and specialist roof work');
 // Area guidance belongs with the existing assessment description, not a final band.
 if(route.startsWith('areas/')){
  const target=$('.local-repair-detail > .container').first();
  $('main > .content-intent').each((_,e)=>{const block=$(e);block.find('h2').remove();target.append(block.find('> .container').contents());block.remove();});
 }
 // Merge the repeated safety appendix into the existing observation section.
 if(route.startsWith('news/')){
  const safety=$('.guide-access-safety'),observations=$('.audit-observation-checklist');
  if(safety.length&&observations.length){const content=$('<div></div>');const id=safety.find('h2[id]').attr('id');if(id)content.attr('id',id);content.append(safety.children().not('h2'));observations.append(content);safety.remove();}
 }
 $('.content-toc a[href^="#"]').each((_,a)=>{const target=$($(a).attr('href'));if(target.is('h2,h3'))$(a).text(target.text());});
 $('main').attr('data-editorial-composition','2026-10-15');return true;
}
