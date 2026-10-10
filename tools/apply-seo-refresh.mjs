import { revisedGuides, serviceEditorial, faqGroups } from '../content/seo-refresh.mjs';
import { applyProjectStories } from './apply-project-stories.mjs';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paragraphs=items=>items.map(p=>`<p>${esc(p)}</p>`).join('');
const metadata=($,title,description)=>{
 $('title').text(`${title} | Ellis Services Group`);
 $('meta[property="og:title"],meta[name="twitter:title"]').attr('content',`${title} | Ellis Services Group`);
 $('meta[name="description"],meta[property="og:description"],meta[name="twitter:description"]').attr('content',description);
};
const projectNotes={
 'metal-roof-ridge-capping-repair-perth':['Metal ridge capping and roof-edge connections','The supplied completed-work images show formed grey capping over corrugated metal roofing, its fixing line and an eave connection. The installation photograph shows fastener work at the capping. These details connect the finished roof profile with the workmanship visible in the sequence.','For a capping repair, we inspect the existing sheets, cap overlaps and fixings, identify the affected runs and form compatible connections. Our metal-roof service explains that work. The photographs document this particular roof; the inspection at a new property establishes its repair scope.'],
 'tile-roof-chimney-flashing-repair-perth':['Chimney flashing and the adjoining tiled-roof valley','The completed-work photographs show formed grey flashing at a brick chimney and the connected valley between tiled slopes. The close views show the apron and tile-to-metal interfaces, while the wider views explain how these junctions sit in the roof.','Chimney and valley repairs need the metal detail checked with the surrounding tiles and the water route below. Our team specifies the affected connections and carries out the agreed flashing, valley and local tile work. Explore the dedicated service for the repair methods used at these junctions.'],
 'metal-roof-hip-ridge-capping-repair-perth':['Hip and ridge capping at a multi-plane roof junction','The supplied images show finished grey capping where several corrugated roof planes meet. The wide and close views reveal the formed intersection, the continuing ridge run and the fixing arrangement; the final photograph shows a hand checking the completed detail.','At a new property, we inspect the cap runs, sheet profile, overlaps and adjoining connections before defining the repair. Our metal-roof service covers local capping and flashing work alongside compatible fixings and affected sheets.'],
 'tile-roof-valley-chimney-flashing-repairs-perth':['Formed valley and chimney flashings on a tiled roof','The finished-work sequence shows a brick chimney base, grey formed flashings and a valley channel between tiled slopes. The different views make the metal-to-tile connection visible and show how the valley continues through the roof junction.','Our flashing repairs service addresses these connected details: we inspect the formed metal, tile edges and downstream drainage, then repair or replace affected components. The proposed scope at each property identifies which parts need work and the compatible materials required.'],
 'metal-roof-ridge-flashing-repair-perth':['Ridge flashing and the adjoining corrugated sheets','The completed photographs show formed grey metal at a roof junction and the finished ridge-capping run. Close views show the connection and fixing line; the wider photograph places those details in the corrugated roof surface.','Ridge and junction repairs involve the formed metal, overlaps, fixing points and adjoining sheet condition. Our team identifies the affected runs and restores the components included in the agreed scope. See the metal-roof and flashing services for the relevant work.']
};

export function applySeoRefresh(documents){
 const services=documents.get('services');
 services('main > section:first-child p:not(.eyebrow)').text('Roof repairs, leak investigation, tile and metal work, drainage, inspections and maintenance — choose the service that matches your property.');
 services('.home-service-map').addClass('services-directory');
 services('.home-service-map h2').first().text('Find the right roof repair service.');
 services('.home-proof p:not(.eyebrow)').first().text('Explore our fastener repair photographs and the metal-roof service that handles fixings, sheets and connected junctions.');
 services('.home-proof .container > div').append('<p><a href="/projects/metal-roof-fastener-repair-sequence/">View the photographed fastener repair project →</a></p>');
 for(const [route,$] of documents){
  const editorial=serviceEditorial[route];
  if(editorial){
   $('.service-brief-copy h2').text(editorial.heading);
   $('.service-brief-copy p:not(.eyebrow)').remove();
   $('.service-brief-copy').append(paragraphs(editorial.paragraphs));
   $('.service-work-intro h2').text('Common defects and the components we repair.');
   if(editorial.cards)$('.service-work-card').each((i,e)=>{if(editorial.cards[i]){$(e).find('h3').text(editorial.cards[i][0]);$(e).find('p').text(editorial.cards[i][1]);}});
   $('.focus-faq h2').text('Questions about this repair service.');
   $('.service-path h2').text('Related repair services and project examples.');
   const steps=route==='storm-damage-roof-repairs'?[
    'Report active water entry and the affected area so we can prioritise the enquiry and plan access.',
    'We assess the damaged covering and connections and explain appropriate protection and permanent repairs.',
    'We carry out the agreed repairs when safe access is available and review the repaired components.'
   ]:[
    'We inspect the affected area and adjoining components and explain the defects found.',
    'The scope identifies the repairs, compatible materials, access arrangements and included work.',
    'We complete the agreed work and review the repaired connections and relevant drainage details.'
   ];
   $('.focus-faq').before(`<section class="section repair-delivery"><div class="container"><p class="eyebrow">FROM INSPECTION TO REPAIR</p><h2>How we organise and complete the work.</h2><ol>${steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol><p><a href="/contact/">Arrange your roof inspection and repair →</a></p></div></section>`);
   const description=$('.service-hero > .container > p:not(.eyebrow)').first().text().split('. ')[0]+'.';
   metadata($,$('h1').text().replace(/\.$/,''),description);
   $('.case-intro .eyebrow,.case-record .eyebrow,.service-case-record .eyebrow').each((i,e)=>$(e).text($(e).text().replace(/\s*\/\s*LOCATION NOT PUBLISHED/i,'')));
  }
 }
 const inspection=documents.get('roof-inspection');
 inspection('h1').text('ROOF INSPECTION PERTH.');
 metadata(inspection,'Roof Inspection Perth','Roof inspections in Perth covering tiles, metal sheets, ridges, flashings and drainage. Ellis Services Group explains findings and repair priorities.');
 const storm=documents.get('storm-damage-roof-repairs');
 metadata(storm,'Emergency & Storm Damage Roof Repairs Perth','Urgent storm-damage enquiries are prioritised. Ellis Services Group arranges assessment, protection and roof repairs as weather and safe access allow.');
 if(!services('.home-service-map a[href="/storm-damage-roof-repairs/"]').length)services('.home-service-map .cards').append('<article class="card"><p class="eyebrow">Emergency &amp; Storm Damage</p><h3>EMERGENCY ROOF REPAIRS PERTH.</h3><p>Urgent enquiries are prioritised. We assess damaged covering and junctions and arrange protection and repairs when weather and safe access allow.</p><a href="/storm-damage-roof-repairs/">Emergency and storm damage repairs →</a></article>');
 services('.home-service-map article').each((i,e)=>{const card=services(e),route=card.find('a').attr('href')?.replace(/^\/|\/$/g,'');if(serviceEditorial[route])card.find('p:not(.eyebrow)').text(documents.get(route)('.service-hero > .container > p:not(.eyebrow)').first().text().split('. ')[0]+'.');if(route==='roof-inspection'){card.find('h3').text('ROOF INSPECTION PERTH.');card.find('.eyebrow').text('Roof Inspection Perth');}});
 metadata(services,'Roof Repair Services Perth','Explore Perth roof repairs, leak investigation, tile and metal work, gutters, emergency repairs, inspections and maintenance by Ellis Services Group.');

 const faq=documents.get('faq');
 faq('h1').text('Roof Repairs Perth — Frequently Asked Questions');
 faq('main > section:first-child p:not(.eyebrow)').text('Answers from Ellis Services Group about leak repairs, roof materials, drainage, inspections, quotes and arranging the work.');
 const list=faq('.faq-list').first();
 list.parent().html(faqGroups.map(([heading,items])=>`<section class="faq-category"><h2>${esc(heading)}</h2><div class="faq-list">${items.map(([q,a,route])=>`<details><summary>${esc(q)}</summary><p>${esc(a)} <a href="/${route}/">${esc(documents.get(route)('h1').text().replace(/\.$/,''))} →</a></p></details>`).join('')}</div></section>`).join(''));
 metadata(faq,'Roof Repairs Perth FAQ','Answers about Perth roof leak repairs, tiles, metal roofing, gutters, inspections and quotes, with direct links to Ellis Services Group services.');

 for(const [slug,g] of Object.entries(revisedGuides)){
  const $=documents.get('news/'+slug);
  const existingImages=$('main img').toArray().map(e=>$.html(e));
  const datePublished=$('.article-byline').text().match(/\d{4}-\d{2}-\d{2}/)?.[0]||'2026-09-27';
  $('main').html(`<article class="compact-information news-article"><div class="narrow article-reading"><p class="eyebrow">PERTH ROOF REPAIR GUIDE / ELLIS SERVICES GROUP</p><h1>${esc(g.title)}</h1><p class="article-lead">${esc(g.intro)}</p><p class="article-byline">Prepared by <a href="/about/">Ellis Services Group</a> · Published ${datePublished} · Updated 2026-10-09</p>${existingImages.map(img=>`<figure class="guide-photo">${img}</figure>`).join('')}${g.sections.map(([h,...ps])=>`<section class="guide-topic"><h2>${esc(h)}</h2>${paragraphs(ps)}</section>`).join('')}<section><h2>Related questions</h2><div class="faq-list">${g.questions.map(([q,a])=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div></section><section><h2>Explore the work and arrange a repair</h2><p><a href="/projects/${g.project}/">${esc(documents.get('projects/'+g.project)('h1').text())} →</a></p><p><a href="/${g.service}/">${esc(documents.get(g.service)('h1').text())} →</a> · <a href="/contact/">Arrange an inspection →</a></p><p>Perth office: 140 St Georges Terrace, Perth WA 6000. Call <a href="tel:+61405878406">0405 878 406</a> or email <a href="mailto:ellisservicesgroup3@outlook.com">ellisservicesgroup3@outlook.com</a>.</p></section></div></article>`);
  metadata($,g.title,g.description);
  const service=documents.get(g.service);
  service('.service-brief-copy').append(`<p><a href="/news/${slug}/">${esc(g.title)} →</a></p>`);
  if(g.service==='roof-inspection')$('.article-reading > section').last().append('<p><a href="/roof-maintenance/">Plan ongoing roof maintenance after the inspection →</a></p>');
 }
 const news=documents.get('news');
 news('main article').each((i,e)=>{const card=news(e),href=card.find('a[href^="/news/"]').attr('href'),g=revisedGuides[href?.split('/')[2]];if(g){card.find('h2,h3').first().text(g.title);card.find('p:not(.eyebrow)').first().text(g.description);}});

 const cbd=documents.get('areas/perth-roof-repairs');
 cbd('h1').text('ROOF REPAIRS PERTH CBD.');
 cbd('main > section:first-child p:not(.eyebrow)').text('Roof repairs for Perth CBD businesses and managed buildings, with site access coordinated around the affected tenancy and roof area.');
 metadata(cbd,'Roof Repairs Perth CBD','Perth CBD roof repairs for managed buildings and businesses. Ellis Services Group coordinates leak investigation, roof junction repairs and drainage work.');
 for(const [route,$] of documents){
  $('a[href="/roof-inspection/"]').each((i,e)=>{if(/Inspection.*Maintenance/i.test($(e).text()))$(e).text('Roof Inspection Perth →');});
  $('a[href="/areas/perth-roof-repairs/"]').each((i,e)=>$(e).text('Perth CBD roof repairs →'));
  if(route.startsWith('projects/')){
   $('main .eyebrow').each((i,e)=>$(e).text($(e).text().replace(/\s*\/\s*LOCATION NOT PUBLISHED/i,'')));
   $('main h2').each((i,e)=>{if(/FOUR PHOTOGRAPHS OF ONE/i.test($(e).text()))$(e).text('Completed roof connections and repair details.');});
   const note=projectNotes[route.slice(9)];
   if(note){
    const intro=$('main p').filter((i,e)=>$(e).text().startsWith('These completion photographs')).first();
    intro.text(note[1]);
    const boiler=$('main p').filter((i,e)=>/tailored to the property, price, warranty|predicted outcome/.test($(e).text())).first();
    boiler.text(note[2]);
    $('main h2').filter((i,e)=>/VISIBLE ROOFLINE DETAILS/i.test($(e).text())).first().text(note[0]);
   }
  }
 }
 // Correct the tile-ridge service's unrelated metal-ridge evidence link.
 const ridge=documents.get('ridge-capping-repointing');
 ridge('.evidence-links a[href="/projects/metal-roof-ridge-capping-repair-perth/"]').attr('href','/news/ridge-capping-repairs-perth-guide/').text('Repointing and rebedding explained →');
 const home=documents.get('');
 home('.home-hero-copy h1').text('PERTH ROOF CARE — ROOF REPAIRS PERTH.');
 applyProjectStories(documents);
 // Every existing card and image is retained; only the brand/service heading changes.
}
