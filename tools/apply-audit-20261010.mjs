import {readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {load} from 'cheerio';
import {sameAs,googleMapsUrl,businessHoursText,openingHoursSpecification,localTeamIdentity,groupIdentifiers} from '../content/business-links.mjs';
import {completeAuditContent,substantiveRoutes} from '../content/audit-completion.mjs';
import {applyContentIntent,syncContentKnowledge} from '../content/content-intent.mjs';

const updated='2026-10-10';
const articleImages={
  'metal-roofing-perth':['metal-roof-perth-grey-roof-overview.png','Grey corrugated metal roof with ridge capping and adjoining roof junctions'],
  'gutter-warning-signs':['gutter-case-04-downpipe-detail.png','Gutter outlet and connected downpipe detail from a roof drainage project'],
  'roof-leak-inspection':['roof-leak-case-03-junction-detail.png','Roof junction photographed during a leak repair project'],
  'roof-maintenance-basics':['roof-maintenance-case-05-valley-edge.jpg','Tile roof valley edge inspected as part of roof maintenance'],
  'roof-flashing-explained':['valley-flashing-case-03-chimney-flashing.png','Formed metal flashing around a brick chimney on a tiled roof'],
  'drainage-after-rain':['wa6121-tile-valley-gutter-01.jpg','Tile roof valley and roof drainage details in the WA 6121 project'],
  'roof-leak-detection-perth':['metal-fastener-sequence-02-fastener-detail.png','Corrosion around a metal roof fastener in a photographed repair sequence'],
  'tile-roof-repairs-perth-guide':['tile-roof-case-02-damaged-tiles.png','Damaged roof tiles photographed before repair'],
  'metal-roof-repairs-perth-guide':['metal-fastener-sequence-04-fastener-work.png','Work around metal roof fastener points during the recorded repair'],
  'ridge-capping-repairs-perth-guide':['ridge-case-03-bedding-detail.png','Ridge cap bedding detail on a tiled roof'],
  'roof-valleys-flashing-repairs-perth':['tile-chimney-flashing-case-01-overview.png','Tile roof chimney flashing and adjoining valley after work'],
  'roof-inspection-perth-guide':['roof-inspection-case-03-flashing-detail.png','Flashing connection recorded during a roof inspection']
};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function applyAudit20261010({root,site}){
  const routes=[...readFileSync(join(root,'sitemap.xml'),'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname.replace(/^\/|\/$/g,''));
  const newsFeed=JSON.parse(readFileSync(join(root,'news/feed.json'),'utf8'));
  for(const route of routes){
    const file=join(root,route,'index.html'),$=load(readFileSync(file,'utf8'),{xml:{xmlMode:false,decodeEntities:false}});
    completeAuditContent($,route);
    // Preserve GitHub's assessment-to-written-quote path after local editorial passes.
    $('main a').each((_,el)=>{
      if (/^Request (?:an enquiry|a roof repair enquiry)$/i.test($(el).text().trim())) $(el).text('Request a roof assessment');
    });
    $('.service-brief-enquiry > p:not(.eyebrow)').last().text('A short description is enough to request an on-site assessment. Existing ground-level photographs are optional and can be emailed to ellisservicesgroup3@outlook.com. No photos are needed to request an assessment. We explain the findings, repair plan and written quote before work begins.');
    $('.services-panel-intro p').text('Need help choosing? Describe the issue and we will arrange the right assessment.');
    $('textarea[name="enquiry"]').each((_,el)=>{
      const oldId=$(el).attr('id');
      if (oldId && $('[id]').filter((_,node)=>$(node).attr('id')===oldId).length>1) {
        $(el).attr('id','enquiry-message');
        $('label').filter((_,label)=>$(label).attr('for')===oldId).attr('for','enquiry-message');
      }
    });
    if (route==='about') $('main').append('<section class="section company-registration-note"><div class="container"><h2>Registration and project-specific credentials.</h2><p>The ABR link above is a company-registration record, not proof of a trade licence or insurance. Ask our team to confirm any licence, insurance or specialist requirements relevant to the agreed work.</p></div></section>');
    if (['repair-options','roof-restoration','roof-inspection','roof-maintenance'].includes(route)) $('.service-brief').append('<div class="container"><p>Contact Ellis to arrange an on-site assessment. We explain the findings, agree the repair plan and provide a written quote, including the proposed materials, deterioration addressed and preparation required. Existing photographs are optional.</p></div>');
    if (route.startsWith('news/')) $('.article-reading').append('<section class="guide-access-safety"><h2>Keep observations at ground level.</h2><p>Do not climb ladders, access roofs or approach damaged electrical equipment to collect information. Do not work from a roof or elevated gutter without controlled access. Photographs are optional and do not replace an on-site assessment by Ellis Services Group.</p></section>');
    if (route==='legal') $('main h1').next('p').text('Ellis Services Group provides roof repairs in Perth. The final repair scope is confirmed from the property, access and roofline condition. We assess the roof on site and explain the work and written quote before proceeding.');
    applyContentIntent($,route);
    const canonical=$('link[rel="canonical"]').attr('href');
    const graph=JSON.parse($('script[type="application/ld+json"]').text())['@graph'];
    if (route==='news/gutter-warning-signs') {
      const heading=load($.html())('main h1').text();
      $('[aria-current="page"]').text(heading);
      const breadcrumb=graph.find(n=>n['@type']==='BreadcrumbList');
      if(breadcrumb) breadcrumb.itemListElement.at(-1).name=heading;
      const webPage=graph.find(n=>n['@type']==='WebPage');
      if(webPage) webPage.name=load($.html())('title').text();
    }
    const business=graph.find(n=>n['@type']==='LocalBusiness');
    business.url=`${site}/`;business.telephone='+61405878406';
    business.logo=`${site}/assets/images/ellis-logo.png`;
    business.image=`${site}/assets/images/metal-fastener-sequence-05-completed.png`;
    business.areaServed={'@type':'City',name:'Perth'};
    business.sameAs=[...sameAs];business.hasMap=googleMapsUrl;
    business.openingHoursSpecification=openingHoursSpecification;
    const groupId=`${site}/#ellis-services-group`;
    business.parentOrganization={'@id':groupId};
    business.description=localTeamIdentity;
    graph.push({'@type':'Organization','@id':groupId,name:'Ellis Services Group Pty Ltd',legalName:'Ellis Services Group Pty Ltd',identifier:groupIdentifiers,sameAs:['https://abr.business.gov.au/ABN/View?id=645821745']});
    if(['','about','contact'].includes(route)){
      const identity=`<p class="local-team-identity">${esc(localTeamIdentity)}</p>`;
      if(route==='about')$('main h2').first().after(identity);
      else if(route==='contact')$('main h1').next('p').after(identity);
      else $('main h2').filter((_,el)=>$(el).text()==='ROOF REPAIR SERVICES DELIVERED BY ELLIS SERVICES GROUP.').next('p').replaceWith(identity);
    }
    const hours=`<p class="business-hours">${esc(businessHoursText)}</p>`;
    $('footer .footer-socials').before(hours);
    if(route==='contact')$('main h1').next('p').after(hours);
    if(route==='about')$('main h2').filter((_,el)=>$(el).text()==='Direct Perth contact details.').after(hours);
    for(const node of graph){
      if(node['@type']==='Service')node.provider={'@id':business['@id']};
      if(node['@type']==='WebSite'){node.name='Perth Roof Care';node.alternateName='Ellis Services Group';}
    }
    if(route===''){
      const fullTitle='Perth Roof Care | Roof Repairs & Leak Repairs Perth';
      $('title').text(fullTitle);$('meta[property="og:title"],meta[name="twitter:title"]').attr('content',fullTitle);
      $('.home-service-map h2').first().text('Choose the repair service you need.');
      $('.home-proof h2').first().text('Metal roof fastener repair — a photographed work sequence.');
      $('.home-proof p:not(.eyebrow)').first().text('Follow this metal-roof project from the roof surface and corroded fasteners to the recorded repair work and completed roof. Each photograph shows a different stage.');
      const labels=['Roof repairs','Roof leak repairs','Tile roof repairs','Metal roof repairs','Ridge capping repairs','Valleys & flashing','Gutters & downpipes','Roof cleaning & painting','Commercial roof repairs'];
      const alts=['Tiled roof overview showing adjoining roof slopes and ridge lines','Close view of a roof junction in a leak repair project','Tiled roof surface after the recorded repair work','Metal roof surface after the recorded repair work','Ridge capping and adjoining tiles after repair','Metal valley and chimney flashing on a tiled roof','Gutter outlet and connected downpipe detail','Tile roof valley and drainage detail in the WA 6121 cleaning project','Metal roof surface before the recorded repair work'];
      $('.home-service-map article').each((i,el)=>{const card=$(el);card.find('h3').text(labels[i]);card.find('.eyebrow').text('Roof repair services');card.find('a').last().text(`Explore ${labels[i].toLowerCase()} →`);card.find('img').attr('alt',alts[i]);});
      $('.home-hero-copy').append('<nav class="hero-evidence-links" aria-label="Company and work evidence"><a href="/about/">Company & ABN details</a><a href="/gallery/">Photographed projects</a></nav>');
    }
    if(route==='contact'){
      $('.enquiry-form').before('<div class="contact-next-steps"><h2>What happens next?</h2><p>Include your suburb, roof material if known, where the problem appears and when you noticed it. Existing photographs are helpful; there is no need to access the roof.</p><p>Our team reviews the details with you, arranges the next step and explains the proposed repair scope before work begins.</p></div>');
      $('textarea[name="enquiry"]').attr('placeholder','Your suburb or postcode, roof type, affected area and when the problem occurs.');
    }
    const slug=route.startsWith('news/')?route.slice(5):'';
    if(articleImages[slug]){
      const [name,alt]=articleImages[slug],imagePath=`/assets/images/${name}`;
      const image=$('main img').first();
      if(!image.length){
        const figure=`<figure class="guide-photo"><img src="${imagePath}" alt="${esc(alt)}" loading="lazy" decoding="async"><figcaption>${esc(alt)}. <a href="/gallery/">Explore the project photographs</a>.</figcaption></figure>`;
        const lead=$('.article-lead').first();if(lead.length)lead.after(figure);else $('main h1').after(figure);
      }
      const article=graph.find(n=>n['@type']==='Article');
      const renderedArticle=load($.html());
      article.headline=renderedArticle('main h1').text().trim();
      article.description=renderedArticle('meta[name="description"]').attr('content');
      article.image=new URL($('main img').first().attr('src'),site).href;
      article.author={'@id':business['@id']};article.publisher={'@id':business['@id']};article.dateModified=updated;
      const publication=article.datePublished?` · Published ${article.datePublished.slice(0,10)}`:'';
      const byline=`Prepared by <a href="/about/">Ellis Services Group</a>${publication} · Updated ${updated}`;
      if($('.article-byline').length)$('.article-byline').html(byline);else $('main h1').after(`<p class="article-byline">${byline}</p>`);
      const item=newsFeed.items.find(i=>new URL(i.url).pathname===new URL(canonical).pathname);
      if(item){item.title=article.headline;item.summary=article.description;item.date_modified=`${updated}T00:00:00+08:00`;item.image=article.image;item.content_text=renderedArticle('main p,main li,main td,main th').not('.eyebrow,.article-byline').map((_,e)=>renderedArticle(e).text()).get().join('\n\n');}
    }
    syncContentKnowledge($,graph,site,canonical);
    $('script[type="application/ld+json"]').text(JSON.stringify({'@context':'https://schema.org','@graph':graph}).replaceAll('<','\\u003c'));
    $('head').append('<script defer src="/assets/js/analytics.js"></script>');
    writeFileSync(file,$.html());
  }
  writeFileSync(join(root,'news/feed.json'),JSON.stringify(newsFeed,null,2));
  writeFileSync(join(root,'news/feed.xml'),`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Roof Repairs Perth News — Ellis Services Group</title><link>${site}/news/</link><description>Practical roof repair and maintenance guidance.</description><language>en-au</language>${newsFeed.items.map(i=>`<item><title>${esc(i.title)}</title><link>${esc(i.url)}</link><guid isPermaLink="true">${esc(i.id)}</guid><description>${esc(i.content_text)}</description></item>`).join('')}</channel></rss>`);
  const sitemap=load(readFileSync(join(root,'sitemap.xml'),'utf8'),{xmlMode:true});
  sitemap('url').each((_,el)=>{const route=new URL(sitemap(el).find('loc').text()).pathname.replace(/^\/|\/$/g,'');
    if(substantiveRoutes.has(route)||articleImages[route.replace(/^news\//,'')]||(!route.startsWith('projects/')&&!['privacy','legal'].includes(route))){sitemap(el).find('lastmod').remove();sitemap(el).append(`<lastmod>${updated}</lastmod>`);}
  });
  writeFileSync(join(root,'sitemap.xml'),sitemap.xml());
}
