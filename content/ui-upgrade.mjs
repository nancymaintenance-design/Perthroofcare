// Selected visual target: displayed concept 2, 2026-10-24. Layout only.
// Original prose, headings, evidence galleries and business data remain owned
// by their existing content modules. Home thumbnails are the explicit exception.
export const homeHeroPhoto='metal-fastener-sequence-05-completed.png';
export const homePhotoChoices={
  0:['roof-inspection-case-06-overview-after.png','Tiled roof and ridge after the recorded maintenance work'],
  1:['tile-chimney-flashing-case-01-overview.png','Completed chimney flashing and adjoining tiles in the recorded project'],
  5:['tile-chimney-flashing-case-04-chimney-detail.png','Completed metal flashing around the chimney in the recorded project'],
  7:['perth-tile-roof-painting-finish-02.jpg','Tiled roof after spray painting in the recorded Perth project'],
  8:['metal-hip-ridge-case-01-overview.png','Completed metal roof with hip and ridge capping in the recorded project']
};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function applyUiUpgrade($,route){
 if($('body').hasClass('ui-upgrade'))return false;
 $('body').addClass('ui-upgrade');
 $('header').addClass('ui-header');
 // Keep the supplied Ellis artwork/wordmark and all current navigation targets.
 $('header .brand').append('<span class="ui-site-name" translate="no">PERTH ROOF CARE</span>');
 if(!$('link[href="/assets/css/ui-system.css"]').length)$('head').append('<link rel="stylesheet" href="/assets/css/ui-system.css">');
 if(route===''){
  $('.home-topic-rail').attr('data-ui-hero-image',homeHeroPhoto);
  for(const [index,[name,alt]] of Object.entries(homePhotoChoices)){
   const photo=$('.home-service-map article').eq(Number(index)).find('img');
   if(photo.length!==1)throw new Error('Missing homepage photo slot '+index);
   photo.attr('src','/assets/images/'+name).attr('alt',alt).removeAttr('srcset sizes width height');
  }
 }
 if(!$('main').hasClass('service-layout'))return true;
 const hero=$('.service-hero'),content=$('[data-service-section="content"]'),solution=$('[data-service-section="solution"]'),work=$('[data-service-section="work"]');
 const related=$('.service-related').first();
 const links=[];
 for(const [section,id,label] of [[content,'ui-service-content','Repair scope'],[solution,'ui-service-solution','Assessment & quote'],[work,'ui-service-work','Project photos']]){
  if(!section.length)continue;
  if(!section.attr('id'))section.attr('id',id);
  links.push([section.attr('id'),label]);
 }
 if(related.length){if(!related.attr('id'))related.attr('id','ui-related-services');links.push([related.attr('id'),'Related services']);}
 hero.after('<nav class="ui-section-nav" aria-label="On this page"><div class="container">'+links.map(([id,label],i)=>`<a href="#${esc(id)}"${i===0?' aria-current="location"':''}>${esc(label)}</a>`).join('')+'</div></nav>');
 const contentBox=content.children('.container');
 contentBox.append('<div class="ui-scope-grid"><div class="ui-scope-copy"></div></div>');
 const scope=contentBox.find('.ui-scope-copy');
 scope.append(contentBox.children('h2'),contentBox.children('.service-description'));
 if(related.length)contentBox.find('.ui-scope-grid').append(related);
 const solutionBox=solution.children('.container');
 solutionBox.append('<div class="ui-solution-layout"><div class="ui-solution-copy"></div></div>');
 const layout=solutionBox.children('.ui-solution-layout'),copy=layout.children('.ui-solution-copy');
 copy.append(solutionBox.children('h2'),solutionBox.children('.service-solution-body'));
 const photo=work.find('figure img').first();
 if(photo.length){
  // Decorative repetition only; the original, captioned evidence stays intact.
  // An actual site photograph, never a generated replacement or a completion claim.
  layout.prepend(`<div class="ui-solution-media" aria-hidden="true" style="--ui-detail-image:url('${esc(photo.attr('src'))}')"></div>`);
 }else layout.addClass('ui-solution-layout--text');
 return true;
}
