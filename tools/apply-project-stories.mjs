import { projectStories } from '../content/project-stories.mjs';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function applyProjectStories(documents){
 for(const [slug,story] of Object.entries(projectStories)){
  const $=documents.get('projects/'+slug);
  if(!$)throw new Error(`Missing project route: ${slug}`);
  const sections=$('main section');
  $('main').addClass('project-page');
  const hero=$('main .hero,main .service-hero').first(),photo=$('main img').first();
  const heading=hero.find('h1').text().replace(/ROYLEYSTONE/g,'ROLEYSTONE'),label=hero.find('.eyebrow').first().text().replace(/ROYLEYSTONE/g,'ROLEYSTONE');
  hero.attr('class','section project-hero').removeAttr('style').html(`<div class="container project-hero-layout"><div class="project-hero-copy"><p class="eyebrow">${escape(label)}</p><h1>${escape(heading)}</h1><p>${escape(story.lead)}</p><a class="button" href="/contact/">Discuss your roof repair</a></div><figure class="project-hero-photo"><img src="${escape(photo.attr('src'))}" alt="${escape(photo.attr('alt'))}" width="${photo.attr('width')||1000}" height="${photo.attr('height')||750}" loading="eager" decoding="async"></figure></div>`);
  $('main .project-case-grid').each((i,e)=>{
   $(e).closest('section').addClass('project-photos');
   if($(e).children('figure').length%2===1)$(e).addClass('project-photos-featured');
  });
  if(slug==='roleystone-metal-roof-fastener-leak-repair'){
   $('h1,.breadcrumb,.breadcrumbs,main .eyebrow').each((i,e)=>{if(!$(e).children().length)$(e).text($(e).text().replace(/ROYLEYSTONE/g,'ROLEYSTONE'));});
  }
  const intro=sections.filter((i,e)=>$(e).find('h2').length&&!$(e).find('img').length).first();
  intro.addClass('project-story').attr('id','project-story');
  intro.html(`<div class="container project-story-grid"><p class="eyebrow">OUR PROJECT / ELLIS SERVICES GROUP</p><p class="project-story-updated">Project story updated 2026-10-09</p>${story.topics.map(([h,p])=>`<section class="project-story-topic"><h2>${escape(h)}</h2><p>${escape(p)}</p></section>`).join('')}</div>`);
  // Keep all photo grids, captions and confirmed-work cards in their existing order.
  sections.first().find('p:not(.eyebrow)').filter((i,e)=>!$(e).find('a').length).first().text(story.lead);
  $('meta[name="description"],meta[property="og:description"],meta[name="twitter:description"]').attr('content',story.summary);
  $('main .project-case-note').text('Our team coordinated the recorded work around the roof condition and the agreed project scope.');
  const related=sections.last();
  related.addClass('project-services').find('.container').removeClass('grid');
  related.find('h2').first().text('Related roof repair services');
  related.find('p.eyebrow').first().text('RELATED ROOF REPAIR SERVICES');
  related.find('p:not(.eyebrow)').first().text('Arrange the same type of roof work with Ellis Services Group. Choose the service below to see our repair scope, related projects and direct contact options.');
  related.find('.card').each((i,e)=>{
   const card=$(e),href=card.find('a').attr('href');
   const route=href?.replace(/^\/|\/$/g,'');
   if(!documents.has(route))return;
   card.find('p').text(documents.get(route)('.service-hero > .container > p:not(.eyebrow)').first().text());
   card.find('a').text(`Explore ${documents.get(route)('h1').text().replace(/\.$/,'')} →`);
  });
  const serviceRoutes=new Set(story.services);
  related.find('nav a').each((i,e)=>{const route=$(e).attr('href')?.replace(/^\/|\/$/g,'');if(route!=='contact'&&documents.has(route))serviceRoutes.add(route);});
  related.find('nav').remove();
  if(!related.find('.cards').length){
   related.find('.container').append(`<div class="cards">${[...serviceRoutes].map(route=>`<article class="card"><h3>${escape(documents.get(route)('h1').text().replace(/\.$/,''))}</h3><p>${escape(documents.get(route)('.service-hero > .container > p:not(.eyebrow)').first().text())}</p><a href="/${route}/">Explore this service →</a></article>`).join('')}</div>`);
  }
  related.find('.container').append(`<nav class="project-story-services" aria-label="Services for this project">${[...serviceRoutes].map(route=>`<a href="/${route}/">${escape(documents.get(route)('h1').text().replace(/\.$/,''))} →</a>`).join('')}<a href="/contact/">Arrange your roof repair →</a></nav>`);
 }
 const gallery=documents.get('gallery');
 gallery('main > section:first-child > .container').append('<p class="project-period">Most of the projects in this collection were completed during 2025 and early 2026. Explore the individual stories for the roof components and work recorded.</p>');
 gallery('main article').each((i,e)=>{const card=gallery(e),href=card.find('a[href^="/projects/"]').attr('href'),story=projectStories[href?.split('/')[2]];if(story)card.find('p:not(.eyebrow)').first().text(story.summary);});
 // One shared image-frame contract for every repeated photo collection.
 for(const $ of documents.values()){
  $('.home-proof-sequence,.home-service-map .cards,.case-library-grid,.project-case-grid,[class$="-evidence-grid"]').each((i,e)=>{
   const grid=$(e);if(grid.find('img').length<2)return;
   grid.addClass('aligned-photo-grid').find('img').addClass('aligned-photo');
  });
 }
}
