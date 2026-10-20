import {navigationDefinitions} from './service-navigation.mjs';
import {serviceLabels} from './service-labels.mjs';

// Final English copy sweep. Exact, reviewed sentences only: technical and safety
// qualifications are deliberately not matched by broad negative-word filters.
export const removedMetaSentences=[
 'A roof assessment is not a whole-building engineering report or an insurance determination; photographs do not establish approvals or liability.',
 'The ABR company-registration record does not establish a trade licence or insurance.',
 'They are not a price guide or a guarantee of the same outcome at another property.',
 'General guide imagery illustrates materials and components; it is not evidence of a job at your property.',
 'Maintenance does not guarantee that a roof will never leak.',
 'Maintenance cannot guarantee that a roof will never leak.',
 'Maintenance does not guarantee that a roof will remain leak-free in every future weather event.',
 'A universal online price cannot describe every roof.',
 'This website does not publish a universal inspection fee or assume that every inspection is free.',
 'This website does not publish a universal rate; ask for the property-specific work items in writing.',
 'this guide does not establish a standard warranty.',
 'They cannot establish coating life, leak correction or suitability for another roof.',
 'They cannot establish another roof’s material needs or a standard duration.',
 'The photographs support discussion of internal drainage and wall connections.',
 'They do not show repair of an entire flat roof covering or establish a universal membrane or coating specification.',
 'The skylight addition shown below does not document a leak investigation or whole-roof replacement.',
 'photographs do not establish approvals or liability.',
 'This is an example of roof work at a strata property, not a record of leak investigation or whole-roof replacement.',
 'They illustrate the components that may need discussion in a strata roof enquiry; the photographs alone do not establish common-property boundaries, work approvals or responsibility for payment.',
 'It provides a useful example of related work items; it does not establish a fixed maintenance interval or a universal checklist for every building.',
 'A material name does not imply manufacturer authorisation or a universal repair method.',
 'No universal cleaning pressure, chemical treatment, coating life or warranty is promised.',
 'No universal pressure, chemical treatment or cleaning interval is specified.',
 'A roof assessment is not a whole-building engineering report or an insurance determination.',
 'A repair assessment is not automatically an engineering report, certification or an insurance determination.',
 'A roof assessment is not automatically a whole-building, engineering or insurance report.',
 'A roof condition inspection is not automatically a pre-purchase building inspection, structural assessment or insurance report.',
 'An enquiry does not guarantee an insurance outcome.'
];
const stageEdits=[
 ['The assessment establishes what is relevant to your roof; a suburb name does not establish its material, exposure or maintenance interval.','The assessment establishes what is relevant to your roof.'],
 ['A roof assessment is not automatically a whole-building, engineering, sale or insurance report, and it does not promise access to concealed or unsafe areas.','Access to concealed or unsafe areas is excluded.'],
 ['The photographs show the roof after spray painting and do not show spray application in progress.','The photographs show the roof after spray painting.'],
 ['The photographs are construction-stage records; this gallery does not show the completed replacement roof.','The photographs are construction-stage records.'],
 ['The photographs are construction-stage records, not views of the completed replacement roof.','The photographs are construction-stage records.'],
 ['The photographs record original conditions and work in progress, not a completed drainage performance test.','The photographs record original conditions and work in progress.'],
 ['The work record below shows cleaning in progress, not a completed cleaning-only result.','The work record below shows cleaning in progress.'],
 ['The recorded project shows cleaning and finished painted views, without spray application in progress.','The recorded project shows cleaning and finished painted views.'],
 ['Some pages include supplied images and documented project records. A documented project describes the recorded situation and agreed scope for that property; it does not establish that the same approach, cost or outcome will apply elsewhere.','Some pages include supplied images and documented project records. A documented project describes the recorded situation and agreed scope for that property.']
];
export function applyCopyCleanup($,route){
 if(route==='privacy')return false;
 let changed=false;
 if(route.startsWith('news/')){
  // Replace removed citations with the existing, explicitly mapped service path.
  // Keep heading IDs so existing article fragments remain usable.
  const owner=navigationDefinitions.find(entry=>entry.route===route)?.owner;
  $('.article-references').filter((_,el)=>$(el).find('a[href*="safeworkaustralia.gov.au"],a[href*="bom.gov.au"]').length).each((_,el)=>{
   if(!owner)throw new Error(`Reference replacement needs a confirmed service: ${route}`);
   const block=$(el),heading=block.children('h2').first().clone().text('Roof repairs and inspections');
   block.empty().append(heading,'<p>Tell us your suburb, the affected roof or drainage area and when the problem occurs. We will arrange an assessment and explain the repair scope.</p>',`<p><a href="/${owner}/">${serviceLabels[owner]}</a> · <a href="/contact/">Arrange an assessment</a></p>`);
   changed=true;
  });
  $('.audit-technical-sources').filter((_,el)=>$(el).find('a[href*="lysaght.com"]').length).each((_,el)=>{
   const block=$(el);
   block.children('h2').first().text('Flashing materials and adjoining roof components');
   block.children('p').first().text('We assess the flashing shape, adjoining roof materials and connected drainage before specifying repairs. The written quote identifies the affected components and suitable materials.');
   block.children('ul').remove();
   changed=true;
  });
  $('main a[href*="yourhome.gov.au/passive-design/condensation"]').each((_,el)=>{$(el).closest('p').remove();changed=true;});
  $('.article-references h2[id],.audit-technical-sources h2[id]').each((_,el)=>{
   const heading=$(el),href='#'+heading.attr('id');
   $('.content-toc a').filter((_,a)=>$(a).attr('href')===href).each((_,a)=>{
    if($(a).text()!==heading.text()){$(a).text(heading.text());changed=true;}
   });
  });
 }
 $('.about-company-registration-note,.review-source-note').each((_,el)=>{$(el).remove();changed=true;});
 $('main p,main li,main figcaption,main img[alt]').each((_,el)=>{
  const node=$(el);
  let nodeChanged=false;
  if(node.text().startsWith('The linked photograph record illustrates relevant roof components; it is not evidence of a completed job in ')){node.remove();changed=true;return;}
  const clean=value=>{
   let next=value;
   for(const sentence of removedMetaSentences)next=next.replaceAll(sentence,'');
   for(const [before,after] of stageEdits)next=next.replaceAll(before,after);
   next=next.replace('Existing metal-roof fastener photograph illustrating component condition, not a quote or a price comparison','Existing metal-roof fastener photograph illustrating component condition');
   // Repair punctuation where a removed second clause shared a sentence.
   return next.replace(/;\s*(?=Send your suburb|$)/g,'. ').replace(/;\s*$/g,'.').replace(/ {2,}/g,' ').trim();
  };
  // Preserve whitespace adjacent to inline links by editing only actual matches.
  const visitExact=element=>{for(const child of element.children||[]){if(child.type==='text'){const original=child.data;const next=clean(original);if(next!==original.trim()){child.data=(/^\s/.test(original)?' ':'')+next+(/\s$/.test(original)||child.next?.type==='tag'?' ':'');changed=true;nodeChanged=true;}}else if(child.type==='tag')visitExact(child);}};
  visitExact(el);
  if(nodeChanged&&node.is('p')&&node.closest('details').length&&node.next('p').length&&node.text().trim())node.append(' ');
  if(node.is('img[alt]')){const old=node.attr('alt'),next=clean(old);if(old!==next){node.attr('alt',next);changed=true;}}
  if(nodeChanged&&!node.is('img')&&!node.text().trim()&&!node.find('img,input,button').length){
   if(node.attr('id')&&!node.parent().attr('id'))node.parent().attr('id',node.attr('id'));
   node.remove();
  }
 });
 return changed;
}
