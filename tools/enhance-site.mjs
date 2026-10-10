import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { load } from 'cheerio';
import { serviceAnswers, serviceLeads } from '../content/service-faqs.mjs';
import { areaPriorities } from '../content/area-repair-priorities.mjs';
import { guideArticles } from '../content/guide-articles.mjs';
import { applySeoRefresh } from './apply-seo-refresh.mjs';

const escape = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const linkedCard = (url, title, copy) => `<article class="card discovery-card"><h3>${escape(title)}</h3><p>${escape(copy)}</p><a href="${url}">${escape(title)} <span aria-hidden="true">→</span></a></article>`;
const relatedCases = {
  'roof-repairs': ['metal-roof-fastener-repair-sequence', 'tile-roof-valley-chimney-flashing-repairs-perth'],
  'roof-leak-repairs': ['roleystone-metal-roof-fastener-leak-repair', 'tile-roof-chimney-flashing-repair-perth'],
  'tile-roof-repairs': ['tile-roof-valley-chimney-flashing-repairs-perth', 'tile-roof-chimney-flashing-repair-perth'],
  'metal-roof-repairs': ['metal-roof-ridge-capping-repair-perth', 'metal-roof-hip-ridge-capping-repair-perth', 'metal-roof-ridge-flashing-repair-perth'],
  'ridge-capping-repointing': ['metal-roof-ridge-capping-repair-perth'],
  'flashing-repairs': ['tile-roof-chimney-flashing-repair-perth', 'metal-roof-ridge-flashing-repair-perth'],
  'gutter-repairs': ['wa-6121-tile-roof-valley-gutter-cleaning'],
  'gutters-downpipes': ['wa-6121-tile-roof-valley-gutter-cleaning'],
  'roof-cleaning-painting': ['wa-6121-tile-roof-valley-gutter-cleaning']
};
const guideTargets = {
  'metal-roof-repairs': ['metal-roofing-perth','Metal roof materials and repair details'],
  'roof-leak-repairs': ['roof-leak-inspection','Roof leak inspection guide'],
  'gutter-repairs': ['gutter-warning-signs','Gutter warning signs'],
  'roof-maintenance': ['roof-maintenance-basics','Roof maintenance basics'],
  'gutters-downpipes': ['drainage-after-rain','Roof drainage after rain'],
  'flashing-repairs': ['roof-flashing-explained','Roof flashing explained']
};
const guideService = {'metal-roofing-perth':'metal-roof-repairs','gutter-warning-signs':'gutter-repairs','roof-leak-inspection':'roof-inspection','roof-maintenance-basics':'roof-maintenance','drainage-after-rain':'gutters-downpipes','roof-leak-detection-perth':'roof-leak-repairs','tile-roof-repairs-perth-guide':'tile-roof-repairs','metal-roof-repairs-perth-guide':'metal-roof-repairs','ridge-capping-repairs-perth-guide':'ridge-capping-repointing','roof-valleys-flashing-repairs-perth':'flashing-repairs','roof-inspection-perth-guide':'roof-inspection'};

function setMetadata($, title, description) {
  $('title').text(`${title} | Ellis Services Group`);
  $('meta[name="description"],meta[property="og:description"],meta[name="twitter:description"]').attr('content', description);
  $('meta[property="og:title"],meta[name="twitter:title"]').attr('content', `${title} | Ellis Services Group`);
}

function replaceLegacyPage($, route) {
  const restoration = route === 'roof-restoration';
  const title = restoration ? 'Roof Restoration Perth' : 'Roof Repair Options Perth';
  const lead = restoration ? 'We restore Perth roofs through coordinated tile or metal repairs, ridge and flashing work, drainage maintenance and suitable surface preparation. Our inspection establishes the work your roof needs before cleaning or coating is specified.' : 'Choose the right extent of roof work with an inspection from Ellis Services Group. We explain targeted repair, component replacement and wider restoration so you can commission work that suits the roof condition.';
  const work = restoration ? [
    ['Repair before finishing', 'We identify broken tiles, unstable ridge caps, deteriorated metal fixings and damaged flashing first. These defects need repair before surface work; a new coating alone does not repair a broken component.'],
    ['Preparation matched to the roof', 'Tile and metal surfaces need different preparation. We check existing coatings, corrosion and substrate condition, plan appropriate cleaning and specify compatible materials for the proposed finish.'],
    ['Drainage and completion', 'Valley channels, gutters and outlets are checked alongside the roof surface. The completed scope brings together the repair details, surface work and drainage maintenance appropriate to the property.']
  ] : [
    ['Targeted repair', 'A local defect with serviceable surrounding material can suit tile replacement, fastener work, a flashing repair or a gutter joint repair. We inspect the adjoining roof to confirm the affected area.'],
    ['Component replacement', 'A corroded valley, damaged sheet, unstable ridge run or failed gutter section can require replacement of that component. We select compatible materials and reconnect adjoining details.'],
    ['Coordinated restoration', 'When several areas need attention, a coordinated scope can combine covering repairs, ridge work, drainage maintenance and surface preparation. We explain the priorities and the extent of each work item.']
  ];
  const questions = restoration ? [
    ['Does roof restoration include repairing leaks?', 'Leak-related defects are identified during inspection and included in the repair scope before surface finishing. Our team checks tiles or sheets, ridges, flashings and drainage and explains the required work.'],
    ['Can a metal roof be restored?', 'A metal roof can suit coordinated repairs and surface work where its condition supports that approach. We inspect corrosion, sheet integrity, fixings and existing finish and specify local replacement or broader work accordingly.'],
    ['How is a restoration scope prepared?', 'We inspect the covering and connected roofline, record damaged components and assess the existing surface. The scope sets out repairs, access, preparation, proposed finish and drainage work so each stage is clear.']
  ] : [
    ['How do you choose between repair and replacement?', 'We check the extent of the defect and the condition of surrounding material. A local repair suits isolated damage; component replacement addresses material that is no longer suitable for repair. We explain the recommended scope after inspection.'],
    ['Can several repairs be combined in one job?', 'Yes. We can coordinate tile, ridge, flashing and drainage work where these components are connected. A combined scope identifies each work item and the access arrangements needed to complete it.'],
    ['What should I provide before requesting a quote?', 'Provide the suburb, roof material if known, affected room or roof area, timing of leaks and any existing photographs. Our team uses this to prepare for inspection and explain the work and materials required.']
  ];
  $('main').html(`<section class="topic-rail service-hero" style="--service-hero-image:url('/assets/images/roof-repairs-case-05-roof-overview.jpg')"><div class="container"><p class="eyebrow">ELLIS SERVICES GROUP / PERTH</p><h1 id="service-overview">${title.toUpperCase()}.</h1><p>${lead}</p><a class="button" href="/contact/">Request an enquiry</a></div></section><section class="section service-brief"><div class="container"><p class="eyebrow">SCOPE OF WORK</p><h2>${restoration ? 'One coordinated plan for your roof.' : 'The right repair for the condition found.'}</h2><p>${lead}</p><div class="service-work-grid">${work.map(([h,p])=>`<article class="service-work-card"><h3>${h}</h3><p>${p}</p></article>`).join('')}</div></div></section><section class="section focus-faq"><div class="container"><h2>${title} — questions answered</h2><div class="faq-list">${questions.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div></div></section><section class="section service-path"><div class="container"><h2>Explore the repair services.</h2><nav aria-label="Related roof repair services"><a href="/roof-repairs/">Roof Repairs Perth →</a><a href="/roof-cleaning-painting/">Roof Cleaning &amp; Painting →</a><a href="/roof-leak-repairs/">Roof Leak Repairs Perth →</a></nav></div></section>`);
  setMetadata($, title, `${title} by Ellis Services Group. Inspection, targeted repairs, compatible replacements and coordinated roof work. Contact our Perth team.`);
}

export function enhanceSite({ root, site }) {
  const sitemap = readFileSync(join(root,'sitemap.xml'),'utf8');
  const routes = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname.replace(/^\/|\/$/g,''));
  const documents = new Map(routes.map(route=>[route,load(readFileSync(join(root,route,'index.html'),'utf8'), { xml: { xmlMode:false, decodeEntities:false } })]));
  const titleFor = route => documents.get(route)('h1').text().replace(/\.$/,'').replace(/&amp;/g,'&');
  const business = {'@type':'LocalBusiness','@id':`${site}/#business`,name:'Ellis Services Group',alternateName:'Perth Roof Care',legalName:'Ellis Services Group Pty Ltd',url:site,telephone:'0405878406',email:'ellisservicesgroup3@outlook.com',address:{'@type':'PostalAddress',streetAddress:'140 St Georges Terrace',addressLocality:'Perth',addressRegion:'WA',postalCode:'6000',addressCountry:'AU'},sameAs:['https://www.instagram.com/elliservices_group/','https://share.google/FPWKvdrPRx3yeK9gp','https://share.google/Z4tImXHToPi9H4LmH']};

  for (const [route,$] of documents) {
    if (serviceAnswers[route]) {
      $('.focus-faq details').each((i,el)=>$(el).find('p').text(serviceAnswers[route][i]));
      $('.service-hero > .container > p').not('.eyebrow').first().text(serviceLeads[route]);
      $('.service-brief-copy h2').each((_,el)=>{if(/context/i.test($(el).text()))$(el).text(`${titleFor(route)} — inspection and repair scope.`);});
      setMetadata($, titleFor(route).replaceAll('&amp;','&'), `${serviceLeads[route].split('. ')[0]}. Contact Ellis Services Group.`.slice(0,160));
    }
    if (['roof-restoration','repair-options'].includes(route)) replaceLegacyPage($,route);
    if(route.startsWith('news/')&&guideService[route.slice(5)]){
      const service=guideService[route.slice(5)], answers=serviceAnswers[service];
      const main=$('main');
      main.find('.hero p:not(.eyebrow)').text(serviceLeads[service]);
      const oldSections=main.find('section').filter((_,el)=>!$(el).attr('class')&&$(el).find('p').length===1&&!/Contact|feedback/i.test($(el).find('h2').text()));
      oldSections.each((i,el)=>{if(i<3){$(el).find('h2').text(['Inspection and repair priorities','How the repair is carried out','Materials and connected roof details'][i]);$(el).find('p').text(answers[i]);}else{$(el).find('h2').text('Arrange the right repair scope');$(el).find('p').text(serviceLeads[service]+' Provide the property suburb, roof type, affected area and timing of any water entry so our team can prepare for the inspection.');}});
      main.find('.resource-guide-detail > .container > p').not('.eyebrow').slice(0,3).each((i,el)=>$(el).text(answers[i]));
      main.find('section.section').first().find('article').each((i,el)=>{if(i<3){$(el).find('h2,h3').text(['Inspection priorities','Repair method','Materials and adjoining details'][i]);$(el).find('p').text(answers[i]);}});
      main.find('p').each((_,el)=>{if($(el).text().startsWith('Our work starts with'))$(el).text('Our team explains the inspection findings, proposed materials and repair scope before work starts, then records the completed work for follow-up.');});
    }
    if(route.startsWith('news/')){
      const guide=guideArticles[route.slice(5)];
      if(guide){
        const image=$('main img').first().clone();
        if(route==='news/metal-roofing-perth')image.attr('src','/assets/images/metal-roof-perth-grey-roof-overview.png').attr('alt','Grey corrugated metal roof with ridge capping, roof junction flashing and surrounding suburban homes').removeAttr('srcset sizes width height');
        const references=$('main a[href^="https://"]').map((_,el)=>({href:$(el).attr('href'),text:$(el).text()})).get();
        const faqs=documents.get(guide.service)('.focus-faq details').map((i,el)=>({q:documents.get(guide.service)(el).find('summary').text(),a:serviceAnswers[guide.service][i]})).get();
        $('main').html(`<article class="compact-information news-article"><div class="narrow article-reading"><p class="eyebrow">PERTH ROOF REPAIR GUIDE / ELLIS SERVICES GROUP</p><h1>${escape(guide.title)}</h1><p class="article-lead">${escape(guide.intro)}</p>${image.length?`<figure class="guide-photo">${$.html(image)}<figcaption>${escape(image.attr('alt'))}</figcaption></figure>`:''}${guide.sections.map(([h,...paragraphs])=>`<section class="guide-topic"><h2>${escape(h)}</h2>${paragraphs.map(p=>`<p>${escape(p)}</p>`).join('')}</section>`).join('')}<section><h2>Questions about ${escape(guide.title.split(' — ')[0])}</h2><div class="faq-list">${faqs.map(({q,a})=>`<details><summary>${escape(q)}</summary><p>${escape(a)}</p></details>`).join('')}</div></section><section><h2>Arrange the related roof repair service</h2><p>Our team inspects the property and carries out the work described in the agreed repair scope. Explore the matching service and our photographed projects, or contact Ellis Services Group to arrange a visit.</p><nav class="article-service-links" aria-label="Related services"><a href="/${guide.service}/">${escape(titleFor(guide.service))} →</a><a href="/gallery/">Roof repair projects →</a><a href="/contact/">Arrange a roof repair inspection →</a></nav></section>${references.length?`<section class="article-references"><h2>Safety and weather resources</h2><p>For roof access safety and current weather warnings, consult these resources. Repair enquiries and roof inspections are arranged directly with our team.</p><ul>${references.map(r=>`<li><a href="${escape(r.href)}">${escape(r.text)}</a></li>`).join('')}</ul></section>`:''}</div></article>`);
        if(route==='news/metal-roofing-perth')$('.guide-photo').addClass('guide-photo--full-width');
        setMetadata($,guide.title,guide.intro.split('. ')[0]+'. Arrange an inspection with Ellis Services Group.');
        if(route==='news/metal-roofing-perth')$('meta[property="og:image"],meta[name="twitter:image"]').attr('content',`${site}/assets/images/metal-roof-perth-grey-roof-overview.png`);
      }else{
        const article=$('main > article');article.addClass('compact-information news-article');
        article.children('.narrow').addClass('article-reading');
        const service=guideService[route.slice(5)];
        if(service){
          article.find('h1').text(article.find('h1').text().replace(/LEAK CONTEXT/gi,'LEAK REPAIR').replace(/CONTEXT/gi,'REPAIR METHODS'));
          article.find('.article-reading > p').not('.eyebrow,.article-byline').first().text(serviceLeads[service]);
          article.find('section > h2').each((_,el)=>{let t=$(el).text();t=t.replace('Inspection and repair priorities',`Inspection priorities for ${titleFor(service).toLowerCase()}`).replace('How the repair is carried out',`${titleFor(service)}: repair methods`).replace('Materials and connected roof details','Compatible materials and adjoining roof components').replace('Arrange the right repair scope','Plan the roof repair inspection and scope');$(el).text(t);});
          setMetadata($,article.find('h1').text().replace(/\.$/,''),serviceLeads[service].split('. ')[0]+'. Contact Ellis Services Group.');
        }
      }
    }
    // Every shared navigation contains the same destinations.
    if (!$('header nav > a[href="/service-areas/"]').length) $('header nav > a[href="/news/"]').after('<a href="/service-areas/">Areas</a>');
    if (!$('header nav > a[href="/gallery/"]').length) $('header nav > a[href="/news/"]').after('<a href="/gallery/">Our Work</a>');
    $('footer b').each((_,el)=>{if($(el).text()==='Information')$(el).text('Guides & company');});
    $('.contact-band h2').text('Roof repairs start with our team.');
    $('header .services-panel-intro p').text('Roof repairs, maintenance and drainage services across Perth.');
    $('.service-brief-copy p:not(.eyebrow),.service-work-card p').each((_,el)=>{
      let t=$(el).text();
      t=t.replaceAll('repair discussion','repair assessment').replaceAll('leak-repair discussion','leak investigation').replaceAll('can be discussed','are assessed by our team').replaceAll('useful context','inspection details').replaceAll('Useful context','Inspection details').replaceAll('enquiry context','inspection planning');
      $(el).text(t);
    });
    const links = relatedCases[route] || [];
    const guide = guideTargets[route];
    if (links.length || guide || route==='roof-repairs') {
      const nav = `<nav class="evidence-links" aria-label="Related repair projects and guides">${links.map(slug=>`<a href="/projects/${slug}/">${escape(titleFor(`projects/${slug}`))} <span aria-hidden="true">→</span></a>`).join('')}${guide?`<a href="/news/${guide[0]}/">${guide[1]} →</a>`:''}${route==='roof-repairs'?'<a href="/roof-restoration/">Roof Restoration Perth →</a><a href="/repair-options/">Compare roof repair options →</a>':''}<a href="/gallery/">See our roof repair projects →</a></nav>`;
      $('.service-path .container').append(nav);
    }
    if (route.startsWith('areas/')) {
      const slug=route.replace('areas/','').replace('-roof-repairs','');
      const priorities=areaPriorities[slug];
      if(priorities){
        const locality=titleFor(route).replace(/ ROOF REPAIRS$/,'');
        $('.area-local-summary p:not(.eyebrow)').eq(0).text(`Ellis Services Group provides tile and metal roof repairs, leak investigation, flashing repairs and roof drainage work for ${locality} properties. We inspect the affected roof area and organise the repairs around its materials, condition and access.`);
        $('.area-local-services').before(`<section class="section local-repair-detail"><div class="container"><p class="eyebrow">${locality} / REPAIR PRIORITIES</p><h2>What we check and repair.</h2><div class="local-priority-grid">${priorities.map(([h,p])=>`<article><h3>${h}</h3><p>${p}</p></article>`).join('')}</div><p>We confirm the repair scope after inspecting the property and explain the affected components, compatible materials and access arrangements. Your suburb, roof type, leak timing and existing photographs help our team prepare for the visit.</p></div></section>`);
        setMetadata($,`${locality} Roof Repairs`,`${locality} roof repairs by Ellis Services Group. ${priorities[0][0]}, leak investigation, tiles, flashings and drainage. Arrange an inspection.`.slice(0,160));
      }
    }
    if(route==='about'){
      $('.hero p:not(.eyebrow)').text('Perth Roof Care is operated by Ellis Services Group Pty Ltd. Our team provides roof repairs, leak investigation and roof drainage services across Perth.');
      $('main p').each((_,el)=>{
        const t=$(el).text();
        if(t.startsWith('This page brings together'))$(el).text('Our Perth team delivers roof repairs, leak investigation, tile and metal roof work, flashing repairs and drainage services. We inspect the property, explain the work required and coordinate the repair scope with the owner or building manager.');
        if(t.startsWith('A roof question may start'))$(el).text('We investigate ceiling stains and rainwater entry and repair damaged tiles, deteriorated fixings, ridge caps, valleys, flashings, gutters and downpipes. Inspection connects the visible defect with the adjoining roof so the proposed work addresses the affected area.');
        if(t.startsWith('Ellis Services Group provides information'))$(el).text('Ellis Services Group provides roof repairs, roof leak investigation, tile and metal roof repairs, ridge capping and repointing, flashing work, gutter and downpipe repairs, roof maintenance and inspections across Perth. Each service page explains the work and helps you contact our team.');
        if(t.startsWith('The purpose of the website'))$(el).text('Our team assesses these connected roof details and carries out repair and maintenance work suited to the materials and property condition. We explain repair priorities clearly and arrange practical access for the work.');
        if(t.startsWith('That record is a company-registration'))$(el).text('Perth Roof Care is operated by Ellis Services Group Pty Ltd. Our Perth office is at 140 St Georges Terrace, Perth WA 6000. Contact our team to arrange roof repair services.');
      });
      $('main h2').each((_,el)=>{if(/clear starting point/i.test($(el).text()))$(el).text('Perth roof repairs delivered by our team.');if(/help you discuss/i.test($(el).text()))$(el).text('The roof and drainage work we carry out.');});
    }
    if(route.startsWith('projects/')){
      $('main section.grid').each((_,el)=>{
        const section=$(el);if(section.closest('.container').length)return;
        const inner=$('<div class="container grid"></div>');section.contents().appendTo(inner);section.removeClass('grid').append(inner);
        inner.find('h2').first().text('Roof repair services for the photographed components.');
        inner.find('p:not(.eyebrow)').first().text('Explore the service that matches the roof components shown in this project. Our team inspects your property, explains the repair scope and carries out the agreed work, including the relevant material, junction and drainage repairs.');
      });
    }
  }

  const news=documents.get('news');
  const guideCards=news('.guide-index .cards');
  for(const slug of ['metal-roofing-perth','gutter-warning-signs','roof-leak-inspection','roof-maintenance-basics','drainage-after-rain']){
    const route=`news/${slug}`;
    guideCards.append(linkedCard(`/${route}/`, titleFor(route), documents.get(route)('main p').not('.eyebrow').first().text()));
  }
  news('.guide-index > .container > p:not(.eyebrow)').text('Read practical guidance from Ellis Services Group on roof materials, leak paths, repair methods and maintenance. Each article connects to the relevant service so you can arrange the work your roof needs.');
  news('.guide-index > .container > h2').text('Practical answers from our roofing team.');
  news('.guide-index article').each((_,el)=>{const card=news(el),href=card.find('a[href^="/news/"]').attr('href'),doc=documents.get(href?.replace(/^\/|\/$/g,''));if(doc){card.find('h2,h3').first().text(doc('h1').text());card.find('p').first().text(doc('main .article-lead,main .article-reading > p:not(.eyebrow,.article-byline)').first().text());}});

  const gallery=documents.get('gallery');
  for(const slug of ['roleystone-metal-roof-fastener-leak-repair','metal-roof-fastener-repair-sequence','wa-6121-tile-roof-valley-gutter-cleaning']){
    const route=`projects/${slug}`;
    const image=documents.get(route)('main img').first().attr('src');
    gallery('.case-library-grid').append(`<article class="card case-library-card">${image?`<img src="${image}" alt="${escape(titleFor(route))}" loading="lazy">`:''}<h2>${escape(titleFor(route))}</h2><p>Explore the photographed roof details, recorded work and connected repair services.</p><a href="/${route}/">View the documented case →</a></article>`);
  }
  gallery('main > section').first().find('p:not(.eyebrow)').text('Our roof repair projects show tile and metal roof details, ridge and hip capping, chimney flashing, fastener work and drainage maintenance. Explore the photographs and the matching repair services.');
  gallery('main > section').eq(1).find('.container > h2').first().text('Our roof repair projects.');
  gallery('main > section').eq(1).find('.container > p:not(.eyebrow)').text('See photographed examples of our roofing work. The repair scope for your property is prepared from its roof material, condition and access.');
  gallery('.case-library-grid > article').each((_,el)=>{
    const card=gallery(el),existing=card.children('div').first();card.removeClass('card');
    if(existing.length)existing.addClass('case-library-copy');
    else{const copy=gallery('<div class="case-library-copy"></div>');card.children().not('img').appendTo(copy);card.append(copy);}
    const copy=card.children('.case-library-copy');
    if(!copy.children('.eyebrow').length)copy.prepend('<p class="eyebrow">ROOF REPAIR PROJECT</p>');
    else copy.children('.eyebrow').text('ROOF REPAIR PROJECT');
  });

  documents.get('services')('main').append(`<section class="section additional-service-paths"><div class="container"><h2>Plan the extent of your roof work.</h2><div class="cards">${linkedCard('/roof-restoration/','Roof Restoration Perth','Coordinate repairs, drainage maintenance and appropriate surface work.')}${linkedCard('/repair-options/','Roof Repair Options','Compare local repair, component replacement and wider restoration.')}${linkedCard('/gallery/','Our Roof Repair Projects','See photographed roof details and completed work.')}</div></div></section>`);

  const home=documents.get('');
  setMetadata(home,'Perth Roof Care — Roof Repairs & Leak Repair','Perth Roof Care, operated by Ellis Services Group Pty Ltd. Tile and metal roof repairs, leak investigation, flashing and drainage services across Perth.');
  home('.home-hero-copy p:not(.eyebrow)').first().text('Roof leaks, damaged tiles, metal roof defects and drainage problems — inspected and repaired by Ellis Services Group. Tell us about your Perth property and we will arrange the next step.');
  home('.home-hero-copy h1').after('<p class="hero-service-line">INSPECT. REPAIR. MAINTAIN.</p>');
  home('.home-hero-copy').append('<a class="hero-phone" href="tel:+61405878406">Call 0405 878 406</a>');
  const images=['roof-repairs-case-05-roof-overview.jpg','roof-leak-case-03-junction-detail.png','tile-roof-case-06-completed.png','metal-roof-case-06-overview-after.png','ridge-case-06-overview-after.png','valley-flashing-case-03-chimney-flashing.png','gutter-case-04-downpipe-detail.png','wa6121-tile-valley-gutter-01.jpg','metal-roof-case-01-overview-before.png'];
  home('.home-service-map article').each((i,el)=>{
    const card=home(el), href=card.find('a').attr('href'), route=href?.replace(/^\/|\/$/g,'');
    card.prepend(`<img class="service-card-photo" src="/assets/images/${images[i]}" alt="${escape(card.find('h3').text())}" loading="lazy">`);
    if(serviceLeads[route])card.find('p:not(.eyebrow)').text(serviceLeads[route].split('. ')[0]+'.');
    card.find('a').text(card.find('h3').text().replace(/\.$/,'')+' →');
  });
  home('.home-proof .container').html(`<div class="proof-intro"><p class="eyebrow">DOCUMENTED PROJECT</p><h2>METAL ROOF REPAIRS PERTH — REAL FASTENER WORK RECORD.</h2><p>Follow the supplied metal-roof project sequence: the roof surface, corroded fastener detail, recorded repair work and completed roof. Each photograph explains a different part of the work.</p><a class="text-link" href="/projects/metal-roof-fastener-repair-sequence/">View the documented metal-roof project →</a><a class="text-link" href="/gallery/">Explore all our roof repair projects →</a></div><div class="home-proof-sequence">${[['01-overall-before','Roof surface before work'],['02-fastener-detail','Corroded fastener detail'],['04-fastener-work','Recorded fastener work'],['05-completed','Completed roof surface']].map(([f,t])=>`<figure><img src="/assets/images/metal-fastener-sequence-${f}.png" alt="${t}" loading="lazy"><figcaption>${t}</figcaption></figure>`).join('')}</div>`);
  // The existing full project retains its fifth photograph and detailed record.
  home('.home-service-map').before(home('.home-proof'));
  home('.home-enquiry h2').text('Tell us about your roof. We will plan the repair.');
  home('.home-enquiry .cards article').each((i,el)=>{const c=home(el);if(i===0)c.find('p').text('Tell us the property suburb and affected roof area so our team can plan the visit.');});

  // The final editorial pass runs before rebuilding visible/schema answers and feeds.
  applySeoRefresh(documents);
  for (const [route,$] of documents) {
    // Update only phrases with an exact approved editorial replacement.
    let html=$.html().replaceAll('These supplied images record','These project images show').replaceAll('These supplied photographs','These project photographs').replaceAll('supplied completion photographs','completion photographs').replaceAll('repair context for Perth properties','repair services for Perth properties').replaceAll('repair context for Perth','repair services for Perth').replaceAll('needs discussion','needs repair').replaceAll('roof-repair context','roof-repair work').replaceAll('clear enquiry','roof repair enquiry').replaceAll('Clear enquiry','Roof repair enquiry').replaceAll('they are with the final repair scope confirmed from the property condition','our inspection identifies the connected defects and required repair work');
    const final=load(html,{xml:{xmlMode:false,decodeEntities:false}});
    final('main img').attr('decoding','async');
    const title=final('h1').text().replaceAll('&amp;','&').replace(/\.$/,'');
    const canonical=final('link[rel="canonical"]').attr('href');
    const parent=route.startsWith('news/')?['Roof repair guides','/news/']:route.startsWith('projects/')?['Our work','/gallery/']:route.startsWith('areas/')?['Service areas','/service-areas/']:serviceAnswers[route]||['roof-restoration','repair-options'].includes(route)?['Services','/services/']:null;
    const crumbs=[{name:'Home',item:`${site}/`},...(parent?[{name:parent[0],item:`${site}${parent[1]}`}]:[]),...(route?[{name:title,item:canonical}]:[])];
    if(route){
      const nav=`<nav class="breadcrumbs" aria-label="Breadcrumb">${crumbs.map((c,i)=>i===crumbs.length-1?`<span aria-current="page">${escape(c.name)}</span>`:`<a href="${new URL(c.item).pathname}">${escape(c.name)}</a><span aria-hidden="true">/</span>`).join('')}</nav>`;
      const container=final('main > section:first-child > .container').first();
      if(container.length)container.prepend(nav);else final('main').prepend(`<div class="container">${nav}</div>`);
    }
    const graph=[];
    final('script[type="application/ld+json"]').each((_,el)=>{
      const obj=JSON.parse(final(el).text());
      for(const node of obj['@graph']||[obj])if(!['FAQPage','BreadcrumbList','LocalBusiness'].includes(node['@type'])){
        if(node['@type']==='Article'){
          node.headline=title;node.description=final('meta[name="description"]').attr('content');
          if(final('.guide-topic').length)node.about=title;
          if(final('.guide-topic').length && /Updated 2026-10-09/.test(final('.article-byline').text()))node.dateModified='2026-10-09';
          const image=final('main img').first().attr('src');if(image)node.image=new URL(image,site).href;
        }
        if(node['@type']==='WebPage'){node.name=title;if(final('.project-story').length){node.description=final('meta[name="description"]').attr('content');node.hasPart={'@id':`${canonical}#project-story`};}}
        if(node['@type']==='Service'){node.name=title;if(route==='roof-inspection')node.serviceType='Roof inspection';}
        graph.push(node);
      }
      final(el).remove();
    });
    graph.push(business);
    if(final('.project-story').length)graph.push({'@type':'CreativeWork','@id':`${canonical}#project-story`,name:title,description:final('meta[name="description"]').attr('content'),text:final('.project-story-topic p').map((_,el)=>final(el).text()).get().join('\n\n'),dateModified:'2026-10-09',inLanguage:'en-AU',author:{'@id':`${site}/#business`},mainEntityOfPage:canonical,image:final('main img').map((_,el)=>new URL(final(el).attr('src'),site).href).get()});
    if(route)graph.push({'@type':'BreadcrumbList',itemListElement:crumbs.map((c,i)=>({'@type':'ListItem',position:i+1,...c}))});
    const faqs=final('main details').map((_,el)=>({'@type':'Question',name:final(el).find('summary').text().replaceAll('&amp;','&'),acceptedAnswer:{'@type':'Answer',text:final(el).find('p').text().replaceAll('&amp;','&')}})).get();
    if(faqs.length)graph.push({'@type':'FAQPage','@id':`${canonical}#faq`,mainEntity:faqs});
    if(!graph.some(n=>n['@type']==='WebPage'))graph.push({'@type':'WebPage','@id':`${canonical}#webpage`,url:canonical,name:title,inLanguage:'en-AU',publisher:{'@id':`${site}/#business`}});
    if(route.startsWith('news/')&&!graph.some(n=>n['@type']==='Article'))graph.push({'@type':'Article',headline:title,description:final('meta[name="description"]').attr('content'),mainEntityOfPage:canonical,author:{'@id':`${site}/#business`},publisher:{'@id':`${site}/#business`},inLanguage:'en-AU'});
    if(['roof-restoration','repair-options'].includes(route))graph.push({'@type':'Service',name:title,url:canonical,provider:{'@id':`${site}/#business`},areaServed:{'@type':'City',name:'Perth'}});
    final('head').append(`<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@graph':graph}).replaceAll('<','\\u003c')}</script>`);
    const knowledge=final('#page-knowledge');
    if(knowledge.length){const k=JSON.parse(knowledge.text());k.pageType=route===''?'HomePage':route==='news'?'CollectionPage':k.pageType;k.summary=final('main p:not(.eyebrow)').first().text();k.questions=faqs.map(q=>({question:q.name,answer:q.acceptedAnswer.text}));k.relatedUrls=[...new Set(final('main a[href^="/"]').map((_,el)=>`${site}${final(el).attr('href')}`).get())];knowledge.text(JSON.stringify(k).replaceAll('<','\\u003c'));}
    final('head').append('<link rel="stylesheet" href="/assets/css/refinement.css"><link rel="stylesheet" href="/assets/css/responsive-images.css">');
    writeFileSync(join(root,route,'index.html'),final.html());
  }
  const llms=readFileSync(join(root,'llms.txt'),'utf8').replace(/^- No price,.*$/gm,'- Repair scope is prepared with Ellis Services Group for the individual property.');
  writeFileSync(join(root,'llms.txt'),llms+`\n## Projects and service planning\n- [Our roof repair projects](${site}/gallery/)\n- [Roof restoration](${site}/roof-restoration/)\n- [Roof repair options](${site}/repair-options/)\n- [All roof repair guides](${site}/news/)\n`);
  for(const [file,prefix] of [['news/feed.json','news/'],['case-studies.json','projects/']]){
    const feed=JSON.parse(readFileSync(join(root,file),'utf8'));
    feed.description=prefix==='news/'?'Roof repair guides from Ellis Services Group.':'Photographed roof repair projects from Ellis Services Group.';
    for(const route of routes.filter(r=>r.startsWith(prefix))){
      const url=`${site}/${route}/`, dom=load(readFileSync(join(root,route,'index.html'),'utf8'));
      let item=feed.items.find(i=>i.url===url);
      if(!item){item={id:url,url,title:titleFor(route)};feed.items.push(item);}
      item.title=dom('h1').text().trim();
      item.summary=dom('meta[name="description"]').attr('content');
      const updated=dom('.article-byline').text().match(/Updated (\d{4}-\d{2}-\d{2})/);
      if(updated)item.date_modified=`${updated[1]}T00:00:00+08:00`;
      if(dom('.project-story-updated').length)item.date_modified='2026-10-09T00:00:00+08:00';
      item.content_text=dom('main p').not('.eyebrow').map((_,el)=>dom(el).text()).get().join('\n\n');
    }
    writeFileSync(join(root,file),JSON.stringify(feed,null,2));
    if(prefix==='news/')writeFileSync(join(root,'news/feed.xml'),`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Roof Repairs Perth News — Ellis Services Group</title><link>${site}/news/</link><description>Practical roof repair and maintenance guidance.</description>${feed.items.map(i=>`<item><title>${escape(i.title)}</title><link>${escape(i.url)}</link><guid>${escape(i.id)}</guid><description>${escape(i.content_text)}</description></item>`).join('')}</channel></rss>`);
  }
}
