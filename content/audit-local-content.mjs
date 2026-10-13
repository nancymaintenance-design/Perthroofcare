// Local audit refinement. Only the cleaning-before-spray-painting sequence,
// property assessment, written repair quote and supplied photographs are company facts.
// The scope guidance below is general selection education, not an Ellis work method.
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const inspectionChargeNotice='Roof inspections are chargeable. Confirm the fee and scope before booking.';
const notice=()=>`<p class="inspection-charge-notice">${inspectionChargeNotice}</p>`;

const scopes={
 'roof-cleaning':[
  ['Cleaning alone, painting or restoration?',
   'Choose the work by its purpose. Cleaning alone addresses surface deposits and debris. Painting adds a finish to a suitable surface. Restoration can combine component repairs with agreed surface work. A cleaner appearance does not establish that cracked tiles, corroded metal or a leaking connection have been repaired.',
   'If your concern is a ceiling stain or recurring leak, describe that first. If the roof is sound and the aim is removing build-up, discuss cleaning as a separate scope. We clean the roof before spray painting when painting is agreed; painting is not required with every cleaning enquiry.'],
  ['Material and deposits change the cleaning decision',
   'Tile, metal, existing coatings and weathered surfaces can respond differently to cleaning. The condition of the covering, loose components, junctions and surface deposits matters when choosing a suitable method. A photograph of staining alone cannot establish the appropriate pressure, treatment or preparation.',
   'For a written quote, ask which roof areas and deposits are included and whether any component repairs need a separate item. If the roof has been coated before, share the records you already have. Product and method selection needs to suit the assessed surface.'],
  ['Include the route for debris and runoff',
   'Roof slopes connect to valleys, gutters, outlets and downpipes. Deposits removed from a roof and existing restrictions in the drainage route are different issues. Clarify whether clearing those components and managing runoff form part of the proposed cleaning scope.',
   'The photograph below records cleaning in progress at one Perth property. It shows a work stage, not the method or result promised for every roof. See the separate painting page for views of the roof after spray painting. Use existing safe photographs only; there is no need to access the roof.']
 ],
 'roof-painting':[
  ['Existing coating and product compatibility',
   'Roof painting is a finishing decision for a suitable surface. Roof material, an existing coating, weathering and exposed damage can affect product compatibility and preparation. A colour preference alone does not establish which system is appropriate or whether the covering is suitable for painting.',
   'Share any records of previous coating work and explain whether appearance or water entry prompted the enquiry. Ask the quote to name the proposed finish and the surface it covers. Product details and applicable terms need confirmation for the property rather than a general promise on this page.'],
  ['Cleaning before spray painting; repairs remain distinct',
   'We clean the roof before spray painting. In a quote, distinguish component repairs, surface cleaning, any necessary preparation and the finish. These items serve different purposes: a coating is not a substitute for addressing a damaged tile, sheet or flashing.',
   'For an active leak, begin with assessment of the affected area before deciding on a wider finish. Where the priority is appearance, compare painting with cleaning alone and the broader restoration option. The useful comparison is the work included and the condition it addresses.'],
  ['The roof after spray painting',
   'The three photographs below show the roof after spray painting at one Perth property. They are separate views of that finished roof. The related cleaning page shows the cleaning stage; these photographs do not show spray application in progress.',
   'For another roof, confirm the surfaces, preparation, proposed products, access and any exclusions in the written quote. The photographs cannot establish coating life or the suitability of the same finish for a different material.']
 ],
 'box-gutter-repairs':[
  ['Separate the outlet, joint and overflow route',
   'A box gutter collects water within a roof arrangement, so its channel, joints, outlet and overflow route need consideration together. Water appearing indoors may be associated with a leaking connection, retained water or overflow. The location of the stain alone does not identify which component is responsible.',
   'Describe where water appears, the rain conditions and whether previous clearing changed the problem. Distinguish water escaping at a joint from water passing over an edge if that is already visible from a safe position. These observations help frame the assessment without requiring you to diagnose the drainage system.'],
  ['Clearing, local joint work or a wider repair?',
   'Debris at an outlet and deterioration through a gutter channel call for different decisions. Clearing can address a restriction where that is the problem. A damaged joint or adjoining roof connection may require local component work. Wider corrosion or repeated overflow can require consideration of the connected run and drainage arrangement.',
   'Ask a written quote to identify the affected component, adjoining material retained and any drainage changes included. A local coating shown in a project photograph does not establish that coating is suitable for every gutter, or that outlet and overflow limitations have been resolved.'],
  ['Use the photographs to describe the components',
   'The photographs below show standing water and debris, adjoining connections and work in progress. The captions distinguish the original condition from local repair stages. They do not record a completed drainage performance test.',
   'Include building height, the affected roof level and the authorised access contact. For managed premises, mention operating hours and permission requirements. Agree which findings and repair items are required for your building before accepting a scope.']
 ],
 'roof-replacement':[
  ['Compare a local repair with whole-roof replacement',
   'A local repair addresses defined defects while suitable surrounding material is retained. Whole-roof replacement is a broader removal and replacement scope. Age or appearance alone does not settle that choice; the extent of deterioration and the limitations of retaining the existing covering matter.',
   'Ask which defects support the recommendation and whether a local repair remains a practical option. Compare what would be retained under each proposal, how adjoining junctions are treated and which limitations remain. Cleaning or painting is a separate surface decision.'],
  ['Define the replacement boundary and concealed items',
   'A replacement quote should identify the covering to be removed, proposed material, affected flashings, roof penetrations and drainage connections. The roof area alone does not explain all of these work items. Removal and disposal should be clear enough to compare proposals on the same basis.',
   'Supporting or concealed components may not be fully visible before opening the roof. Ask how unexpected deterioration will be recorded and further work agreed. Clarify access, occupancy and exclusions; suspected asbestos requires separate identification and specialist arrangements.'],
  ['Distinguish construction records from completion',
   'The three photographs below show the original tiled roof, tile removal exposing battens and installation of a new metal valley in a Perth whole-roof replacement project. They are construction-stage records. This gallery does not show the completed replacement roof.',
   'These views help explain why a replacement scope includes more than a visible surface finish. They cannot establish the condition of another roof, the replacement material needed there or a standard project duration. Arrange a property assessment and compare the written repair and replacement options.']
 ],
 'flat-roof-repairs':[
  ['Identify the covering before choosing a repair',
   'Flat roof describes a roof form, not a single covering or repair system. Sheet material, a membrane, existing treatments and adjoining construction may present different defects. Product selection and a local repair boundary depend on the actual covering and its condition.',
   'Send the material if known, the affected room, previous repair history and when water appears. If the covering is unknown, say so. The assessment needs to distinguish the roof surface from penetrations, edges and wall junctions rather than assuming a new coating is the answer.'],
  ['Consider drainage separately from covering damage',
   'Water remaining on a roof surface can be relevant to drainage, but it does not identify a leak source by itself. Outlets, connected channels, roof edges and adjoining junctions may need consideration alongside the covering. Clearing a restricted outlet and repairing a damaged covering are different work items.',
   'Ask which components the proposed repair addresses and whether any drainage alteration is included. A roof surface patch cannot be assumed to resolve a restriction elsewhere in the water route. Recurring water entry after previous treatment is useful history for the assessment.'],
  ['Match the evidence to the scope',
   'The photographs below show internal drainage and adjoining roof and wall details at a Perth property. They support discussion of connected components. They do not show repair or replacement of an entire flat roof covering.',
   'A targeted repair may be considered where the surrounding material remains suitable; broader deterioration requires a wider comparison. Confirm the actual covering, proposed materials, retained areas, access and exclusions in the written quote. There is no universal membrane or coating specified by these project views.']
 ],
 'strata-roof-repairs':[
  ['Identify the authorised contact and permission',
   'Provide the lot or building identifier, affected room, roof level and the authorised contact arranging the enquiry. The person providing access may differ from the person approving work. Confirm permission for the areas to be inspected before an appointment is arranged.',
   'Shared drainage and a roof spanning several lots do not by themselves establish responsibility for a particular component. The authorised parties need to clarify that boundary and who can approve repairs. A repair enquiry does not determine legal ownership or payment liability.'],
  ['Make the assessment and approval requirements clear',
   'Explain access restrictions, occupied areas and any records the manager needs to consider a quote. Confirm the requested photograph or written-record format before booking. A roof assessment and written repair quote are distinct from a whole-building engineering report or an insurance determination.',
   'For the proposed work, ask which roof or drainage components are included, who approves the scope and how additional work would be agreed. If another lot or shared area needs access, arrange that permission through the authorised contact rather than assuming it is available.'],
  ['A recorded skylight addition at a strata property',
   'The Perth strata project shown below involved adding a skylight to an existing metal roof. Two photographs show the new skylight and its surrounding flashing from different viewpoints. This gallery does not document a leak investigation or whole-roof replacement.',
   'The separate drainage photographs show gutter-edge preparation and local joint treatment. Neither gallery establishes common-property boundaries, work approval or payment responsibility. Use the visible components to explain a similar enquiry, then confirm the assessment and quote for your own building.']
 ]
};

const titles={
 about:'About Perth Roof Care',
 'news/drainage-after-rain':'Roof Drainage Perth: Outlets & Downpipes',
 'news/metal-roofing-perth':'Metal Roofing Perth: Materials & Repairs',
 'news/metal-roof-repairs-perth-guide':'Metal Roof Screws & Washer Repairs Perth',
 'news/ridge-capping-repairs-perth-guide':'Roof Repointing vs Rebedding Perth',
 'news/roof-inspection-perth-guide':'Roof Inspection Before Perth Winter Rain',
 'news/roof-leak-detection-perth':'Roof Leak Detection Perth: Recurring Leaks',
 'news/roof-leak-inspection':'Roof Leak Inspection Perth: Ceiling Stains',
 'news/roof-maintenance-basics':'Roof Maintenance Perth: What to Check',
 'news/roof-repair-cost-perth':'Roof Repair Cost Factors Perth',
 'news/roof-valleys-flashing-repairs-perth':'Roof Valley & Chimney Flashing Repairs Perth',
 'news/tile-roof-repairs-perth-guide':'Broken Roof Tiles Perth: Matching & Repairs',
 'projects/tile-roof-chimney-flashing-repair-perth':'Tile Roof Chimney Flashing Repair Perth',
 'projects/tile-roof-valley-chimney-flashing-repairs-perth':'Tile Roof Valley & Chimney Flashing Perth'
};
const descriptions={
 'news/roof-maintenance-basics':'Plan Perth roof maintenance around tiles, metal sheets, valleys, flashings and drainage. Use observations to distinguish upkeep from component repairs.',
 'projects/metal-roof-fastener-repair-sequence':'Follow a photographed Perth metal roof fastener repair: roof condition, corroded fixing details, repair work and completed roof views.',
 'projects/roleystone-metal-roof-fastener-leak-repair':'Metal roof fastener leak repair in Roleystone, WA. Four project photographs show corroded fixing areas and local repair details.'
};
export const localMetadataRoutes=[...new Set([...Object.keys(titles),...Object.keys(descriptions)])];

// The area notes already establish the topic; these links add supporting context,
// never an assertion that a photographed project occurred in that suburb.
export const areaContextLinks={
 cottesloe:['metal-roof-repairs-perth-guide','Metal roof fixing and sheet decisions'],
 'mosman-park':['roof-valleys-flashing-repairs-perth','Roof and wall junction repair context'],
 'city-beach':['drainage-after-rain','Roof-edge drainage observations after rain'],
 scarborough:['metal-roof-repairs-perth-guide','Corroded screws, washers and surrounding sheets'],
 claremont:['tile-roof-repairs-perth-guide','Matching replacement roof tiles'],
 nedlands:['roof-valleys-flashing-repairs-perth','Chimney and adjoining valley connections'],
 subiaco:['roof-inspection-perth-guide','Inspection scope and access questions'],
 leederville:['roof-flashing-explained','Flashing at connected roof junctions'],
 joondalup:['roof-leak-detection-perth','Recurring leaks after earlier repairs'],
 hillarys:['roof-leak-inspection','Rain patterns and leak inspection observations'],
 fremantle:['tile-roof-repairs-perth-guide','Tile profiles and local replacement decisions'],
 rockingham:['metal-roof-repairs-perth-guide','Metal roof corrosion and fixing repairs'],
 kalamunda:['roof-maintenance-basics','Valley deposits and maintenance priorities'],
 'victoria-park':['roof-flashing-explained','Roof-to-wall flashing context'],
 bayswater:['drainage-after-rain','Connected gutter outlets and downpipes']
};

export function refineLocalContent($,route){
 if(scopes[route]){
  scopes[route].forEach(([heading,...paragraphs],i)=>{
   const section=$(`#scope-${i+1}`);section.find('h2').text(heading);
   section.find('p').remove();section.children().first().append(paragraphs.map(p=>`<p>${esc(p)}</p>`).join(''));
  });
  // One appointment explanation replaces the repeated fee and generic scope paragraph.
  $('main > section.content-intent > .narrow > p').first().text('Send your suburb, roof material if known, affected area and previous work details. Existing safe photographs are optional. Our Perth team assesses the property and provides a written repair quote. We are open Monday–Sunday, 9am–9pm Perth local time.');
 }
 if([...Object.keys(scopes),'roof-inspection','contact','about'].includes(route)){
  $('main > section').first().find('.inspection-charge-notice').remove();
  const hero=$('main > section').first(),action=hero.find('a.button').first();
  if(action.length){const holder=action.parent('p');(holder.length?holder:action).before(notice());}
  else hero.find('h1').next('p').after(notice());
  if(route==='contact'){
   $('main form .inspection-charge-notice').remove();
   $('main form button[type="submit"]').before(notice());
  }
 }
 if(route==='roof-inspection'){
  $('#inspection-fee').remove();
  $('.service-brief > .container > p').filter((_,e)=>$(e).text().startsWith('Contact Ellis to arrange')).remove();
 }
 if(route==='about'){
  // Keep the company record, credentials distinction and direct contacts; remove
  // duplicated defect summary marked by the earlier wording rewrite.
  const intro=$('main > article').first();
  intro.find('p.about-duplicate-defect-summary').remove();
 }
 if(titles[route]){
  const title=`${titles[route]} | Ellis Services Group`;
  $('title').text(title);$('meta[property="og:title"],meta[name="twitter:title"]').attr('content',title);
 }
 if(descriptions[route])$('meta[name="description"],meta[property="og:description"],meta[name="twitter:description"]').attr('content',descriptions[route]);
 if(route==='news/roof-repair-cost-perth'){
  $('main h1').text('Roof Repair Cost Factors Perth: Comparing Quotes');
  $('[aria-current="page"]').text($('main h1').text());
  $('.article-lead').text('Compare roof repair quotes by the defect, materials, access and work included. Confirm the inspection fee and scope before booking; the repair price follows assessment of your property.');
  $('.article-reading > section').first().find('h2').text('Use the guide to compare the work included');
  $('.article-reading > section').first().find('p').text('Roof repair costs depend on the assessed scope. Use the questions below to compare quotes and distinguish component repairs from optional surface work. The guide explains cost factors rather than a list of prices.');
  $('.guide-topic').first().find('p').text('Roof inspections are chargeable. Confirm the fee, the investigation area and any records required before booking. An inspection and a repair quote are different parts of the decision; confirm their separate scope with the team.');
 }
}
