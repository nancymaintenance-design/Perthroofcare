// Editorial additions based on existing site records; no invented job results or credentials.
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const list=items=>`<ul>${items.map(i=>`<li>${esc(i)}</li>`).join('')}</ul>`;
const section=(cls,title,body)=>`<section class="section ${cls}"><div class="container"><h2>${esc(title)}</h2>${body}</div></section>`;
const comparison=(caption,rows)=>`<div class="audit-table-scroll" tabindex="0" role="region" aria-label="${esc(caption)}"><table class="audit-decision-comparison"><caption>${esc(caption)}</caption><thead><tr><th scope="col">Option</th><th scope="col">What needs checking</th><th scope="col">Scope boundary</th></tr></thead><tbody>${rows.map(row=>`<tr>${row.map((cell,i)=>i===0?`<th scope="row">${esc(cell)}</th>`:`<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const decisions={
 'roof-repairs':{title:'Local repair, component replacement or wider work?',items:[
  'An isolated defect can suit a targeted repair where the surrounding roof remains serviceable. Inspection establishes that boundary.',
  'A damaged tile, sheet, valley or flashing may require replacement of the affected component rather than another surface patch.',
  'Several connected defects can be organised in one scope. Surface cleaning or coating is considered separately from the component repairs.'
 ],project:'metal-roof-fastener-repair-sequence'},
 'roof-leak-repairs':{title:'Choose the repair from the water-entry evidence.',items:[
  'Record where and when water appears. An indoor mark does not by itself identify the point where rain enters the roof.',
  'Check the affected covering together with uphill laps, fasteners, flashing and connected drainage. A previous patch is part of the inspection history.',
  'The scope should identify the defect being addressed and the inspection or completion checks appropriate to it. No single patch method suits every leak.'
 ],project:'roleystone-metal-roof-fastener-leak-repair'},
 'metal-roof-repairs':{title:'A fixing repair is different from a sheet repair.',items:[
  'Check the screw or washer together with the sheet around its fixing hole. The surrounding material can change the required repair.',
  'Separate a local connection defect from corrosion affecting a larger sheet area or formed capping run.',
  'Select materials and connections for the existing roof and exposure. A project photograph is an example, not a specification for another property.'
 ],project:'metal-roof-ridge-capping-repair-perth'},
 'tile-roof-repairs':{title:'Separate tile, ridge and flashing defects.',items:[
  'Check the damaged tile and adjoining overlaps, including whether a compatible replacement profile is available.',
  'Assess ridge cap support separately from the exposed pointing finish. Loose support is not corrected by simply covering its surface.',
  'Check connected valleys and chimney or wall flashing when the reported leak is near a junction. The repair can involve more than the visible broken tile.'
 ],project:'tile-roof-valley-chimney-flashing-repairs-perth'}
};
const areas={
 leederville:{name:'Leederville',items:['Identify whether the affected roof belongs to the original building or an addition.','Describe which roof level, wall junction or drainage outlet is connected to the leak.','Arrange the access contact and mention neighbouring structures that may affect the visit.'],project:'tile-roof-chimney-flashing-repair-perth',guide:'roof-flashing-explained'},
 perth:{name:'Perth CBD',items:['Identify the affected tenancy, building manager and roof level.','Record whether leaks are near equipment, penetrations or shared drainage routes.','Describe access arrangements and operating-hour restrictions before the visit is scheduled.'],project:'metal-roof-ridge-flashing-repair-perth',guide:'roof-leak-detection-perth'},
 fremantle:{name:'Fremantle',items:['Share the existing tile or metal profile if known; photographs already taken from the ground can help.','Note whether the problem is at a chimney, masonry wall or roof-edge connection.','Describe any exposure, previous repairs or debris conditions without assuming the cause of the leak.'],project:'tile-roof-chimney-flashing-repair-perth',guide:'roof-flashing-explained'},
 joondalup:{name:'Joondalup',items:['Identify the affected tile field, ridge run or metal roof section.','Note whether overflowing drainage and indoor water marks occur in the same rain event.','Provide previous repair or cleaning records so maintenance and component repair can be considered separately.'],project:'wa-6121-tile-roof-valley-gutter-cleaning',guide:'roof-inspection-perth-guide'},
 bayswater:{name:'Bayswater',items:['Describe whether the leak affects the main roof, an extension or a separate building.','Record nearby valley outlets, gutters or downpipes visible safely from ground level.','Provide the site contact and any restrictions on access to adjoining properties or shared areas.'],project:'metal-roof-fastener-repair-sequence',guide:'roof-leak-detection-perth'}
};
export const substantiveRoutes=new Set(['','contact','about','roof-restoration',...Object.keys(decisions),...Object.keys(areas).map(a=>`areas/${a}-roof-repairs`)]);

export function completeAuditContent($,route){
 const decision=decisions[route];
 if(decision){
  const body=list(decision.items)+`<p><a href="/projects/${decision.project}/">See the documented project example →</a> · <a href="/repair-options/">Compare the extent of roof work →</a></p>`;
  const quote=list(['The affected roof area and the defects included in the proposed work.','Repair or replacement components, compatible materials and finish where relevant.','Access arrangements and any preparation, clearing or adjoining roof work included.','Completion checks, exclusions and any additional work requiring a separate decision.'])+'<p>Roof height, access, material availability and the extent of connected damage can change the scope. A fixed online price would not describe every property. <a href="/contact/">Send your suburb and roof details to discuss the work →</a></p>';
  $('main').append(section('audit-repair-decision',decision.title,body),section('audit-quote-scope','What to compare in a roof repair quote.',quote));
 }
 const slug=route.match(/^areas\/(.*)-roof-repairs$/)?.[1],area=areas[slug];
 if(area){
  const body=list(area.items)+`<p>The linked photograph record illustrates relevant roof components; it is not evidence of a completed job in ${esc(area.name)}. The project page states the location only where our records support it.</p><p><a href="/projects/${area.project}/">View the relevant roof-work example →</a> · <a href="/news/${area.guide}/">Read the related inspection guide →</a> · <a href="/contact/">Discuss access and an inspection for your property →</a></p>`;
  $('main').append(section('audit-area-preparation',`Prepare a ${area.name} roof repair enquiry.`,body));
 }
 if(['news/roof-flashing-explained','news/roof-leak-detection-perth'].includes(route)){
  const flashing=route.endsWith('roof-flashing-explained');
  const observations=flashing?['Identify the affected wall, chimney, roof penetration or valley from a safe position.','Record whether water appears after wind-driven rain, prolonged rain or any rain event.','Mention previous flashing or sealant work and provide existing photographs or repair documents.','Note the adjoining roof material if known; do not climb onto the roof to collect measurements.']:['Mark the affected room and whether the first sign is staining, dripping or overflow.','Record the timing and weather conditions of each event rather than only the latest leak.','Keep a record of previous repairs and whether the water-entry pattern changed afterward.','Provide safely obtained existing photographs; leave roof access and diagnosis to the inspection.'];
  const content=`<section class="audit-observation-checklist"><h2>Ground-level observations to prepare before an inspection</h2>${list(observations)}<p>These observations help explain the enquiry; they do not establish a diagnosis or a safe DIY repair method.</p></section><section class="audit-technical-sources"><h2>Manufacturer context and scope</h2><p>Lysaght explains the role of formed flashing at roof junctions and the need to consider surrounding materials. Its maintenance resources cover roof components, connections and drainage. Product-specific details must be checked against the actual roof; these sources are not a claim that this property uses a particular product.</p><ul><li><a href="https://lysaght.com/support-technical/support/design/guide-metal-flashing" rel="noopener">Lysaght: metal flashing functions and material compatibility</a></li><li><a href="https://lysaght.com/support-technical/support/maintenance" rel="noopener">Lysaght: roofing and rainwater maintenance resources</a></li></ul><p><a href="/projects/tile-roof-chimney-flashing-repair-perth/">See the photographed chimney flashing example →</a> · <a href="/flashing-repairs/">Explore flashing repair services →</a></p></section>`;
  const target=$('.article-reading').first();(target.length?target:$('main')).append(content);
 }
 if(route==='news/ridge-capping-repairs-perth-guide'){
  $('.article-reading').append(comparison('Repointing, rebedding and cap replacement are distinct decisions',[
   ['Repointing','Condition of the exposed pointing and the support beneath it.','Renewing a finish is not a substitute for correcting loose support.'],
   ['Rebedding','Cap stability, supporting bedding and adjoining tiles.','The affected run and any required pointing should be identified in the scope.'],
   ['Cap or tile replacement','Cracked or damaged components and available compatible replacements.','Replacing components is distinct from renewing mortar or pointing.']
  ]));
 }
 if(route==='roof-restoration'){
  $('main').append(section('audit-restoration-scope','Compare restoration with a local repair.',comparison('Choose the extent of work from the inspected condition',[
   ['Local repair','A defined defect and serviceable surrounding material.','Addresses the identified component rather than every roof surface.'],
   ['Component replacement','Material or connections no longer suitable for local repair.','Specify the affected sheets, tiles, flashing or drainage section.'],
   ['Coordinated restoration','Several repair needs and a suitable surface for proposed preparation or finishing.','Define repairs before any cleaning or coating; surface finishing alone does not replace defective components.']
  ])+'<p>Ask which repair, access, preparation, finish and drainage items are included and excluded. <a href="/contact/">Discuss the inspected scope →</a></p>'));
 }
 if(route==='about'){
  $('main').append(section('audit-editorial-policy','How to read our guides and project records.','<p>Perth Roof Care publishes general roof repair guidance alongside photographed Ellis Services Group projects. A project record describes that job; it does not establish the correct repair, price or outcome for a different property. Guide publication and update dates are editorial dates, not construction dates.</p><p>Company registration identifies the operating entity and should not be read as proof of a particular trade licence or insurance policy. Ask our team about the people responsible for your work and the documentation applicable to the proposed scope. Technical decisions are made for the inspected roof rather than from a photograph alone.</p><p><a href="/gallery/">Explore the project records →</a> · <a href="/contact/">Discuss your property and documentation requirements →</a></p>'));
 }
}
