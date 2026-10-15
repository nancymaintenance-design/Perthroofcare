// Approved keyword-gap report, 12 October 2026. Existing routes only.
// No fixed prices, invented project records, new regions or expanded service promises.
const section=(id,title,body)=>`<section class="section keyword-gap-content" id="${id}"><div class="narrow"><h2>${title}</h2>${body}</div></section>`;
const question=(q,a)=>`<details><summary>${q}</summary><p>${a}</p></details>`;

const content={
 'roof-repairs':section('repair-quote-factors','What affects roof repair costs in Perth?',`
  <p>The cost of a roof repair depends on the defect, the surrounding material and the access needed to do the work. A leaking joint, a damaged tile and a corroded metal connection are different jobs. We assess the affected area before providing a written quote; a suburb or ceiling photograph alone is not enough to price the repair.</p>
  <h3>Material, extent and connected components</h3>
  <p>For tiles, the replacement profile and the condition of nearby tiles or ridge details matter. For metal roofing, a fixing repair may also involve the sheet around the fixing or an adjoining flashing. Ask which components are included, what can remain in place and whether any adjacent defects need a separate item.</p>
  <h3>Access and preparation</h3>
  <p>Building height, roof pitch, restricted access and structures below the work area can change the equipment and preparation required. Include these details when requesting an assessment. Safe access is part of planning the job, not an optional extra to leave out when comparing quotes.</p>
  <h3>Read the work items, not just the total</h3>
  <p>A useful comparison identifies the repairs, materials, access arrangements, preparation, removal of affected material and completion checks included. Confirm any inspection charge, exclusions and how additional work would be agreed if opening the area reveals further deterioration. Ask for optional surface work to be separated from repairs needed to address the defect.</p>
  <p>Use our <a href="/repair-options/#compare-repair-options">repair, restoration and replacement comparison</a> to choose the scale of work. For broader finishing, see <a href="/roof-restoration/#restoration-quote-factors">roof restoration quote factors</a>.</p>
  <div class="faq-list">${question('Can you give a fixed roof repair price from this website?','No. This website does not publish a universal roof repair price. Tell us your suburb, roof material if known, the affected area and any previous repair history. We confirm the assessment arrangements, explain the findings and provide a written repair quote before the agreed work begins.')}${question('Is an inspection included in the repair price?','Confirm the inspection fee, records and any relationship to the repair quote before booking. Do not assume an inspection is free or automatically credited. Our <a href="/roof-inspection/">roof inspection service</a> explains the questions to ask.')}</div>
  <p><a href="/contact/">Request an assessment and a written roof repair quote</a>. Existing ground-level photos are optional; do not climb onto the roof to obtain them.</p>`),

 'roof-restoration':section('restoration-quote-factors','Roof restoration costs: what belongs in the quote?',`
  <p>Roof restoration is a coordinated scope of suitable repairs and any agreed preparation or finish. Its cost depends on the roof condition and the work included, not just its area or appearance. A quote for cleaning and painting is not directly comparable with a quote that also repairs tiles, ridge support, flashings or drainage.</p>
  <h3>Establish whether wider work is appropriate</h3>
  <p>Identify the defects first. A roof with one affected component may need a local repair rather than a wider restoration. If the surrounding material is extensively deteriorated, a surface finish alone does not establish that restoration is suitable. Ask what the assessment found, what can be retained and which work is needed before preparation starts.</p>
  <h3>Separate repairs, cleaning, preparation and finishing</h3>
  <ul><li>List the damaged components and affected runs included in the repair work.</li><li>Identify cleaning and preparation appropriate to the existing material and finish.</li><li>Confirm the proposed finishing system, where it is to be applied and the relevant product requirements.</li><li>Include access arrangements, protection of adjoining areas, disposal and checks of the completed work.</li></ul>
  <p>Height, pitch, access, existing coatings and the extent of component repairs can all affect the scope. Clarify exclusions, optional items and how any newly exposed defects will be discussed before additional work proceeds. We do not publish a single restoration price for every Perth property.</p>
  <div class="faq-list">${question('Does a restoration quote include gutter replacement?','Not automatically. Gutter repairs, replacement of an affected section and wider drainage work need to be identified in the agreed quote. Confirm any whole-system replacement separately; it is not implied by the word restoration.')}${question('Can restoration replace a structural assessment?','No. Restoration and roof repair observations are not automatically an engineering or whole-building assessment. If there are wider structural concerns, discuss the appropriate assessment before choosing repairs or a surface finish.')}</div>
  <p>Compare <a href="/repair-options/#compare-repair-options">local repairs and wider roof work</a>, then review the separate <a href="/roof-cleaning-painting/#roof-cleaning-scope">roof cleaning scope</a> and <a href="/roof-cleaning-painting/#roof-painting-scope">roof painting scope</a>. <a href="/contact/">Discuss an assessment for your roof</a>.</p>`),

 'news/ridge-capping-repairs-perth-guide':section('repointing-quote-factors','What affects roof repointing costs in Perth?',`
  <p>Repointing and rebedding are different work items. Repointing addresses the exposed pointing where the supporting detail is suitable; loose or deteriorated bedding may require lifting and rebedding the affected caps. A surface-only quote should not be compared with a quote that includes rebuilding the support as though they were the same repair.</p>
  <h3>Compare the affected ridge runs and preparation</h3>
  <p>The length and location of the affected ridge or hip runs, the stability of the caps, removal of unsound material and any damaged tiles change the scope. Access, roof pitch and height also matter. Ask the quote to identify which runs are included, the preparation required, whether caps or adjoining tiles need replacement and what completion checks apply.</p>
  <p>Our <a href="/ridge-capping-repointing/">ridge capping and repointing service</a> explains the component work. If the quote combines ridge repairs with surface preparation, compare it with the <a href="/roof-restoration/#restoration-quote-factors">restoration scope and cost factors</a> rather than assuming the wider work is needed.</p>
  <div class="faq-list">${question('Can I compare repointing quotes using a rate per metre alone?','A rate alone does not explain the work. Check whether the quotes cover the same runs, preparation, supporting bedding, replacement caps or tiles, access and included checks. This website does not publish a universal rate; ask for the property-specific work items in writing.')}</div>
  <p><a href="/contact/">Arrange a ridge assessment and written repair quote</a>. Photographs from ground level can help describe the enquiry but do not establish whether repointing or rebedding is required.</p>`),

 'roof-cleaning-painting':
  section('roof-cleaning-scope','Roof cleaning in Perth: choose the method for the material',`
   <p>Cleaning removes deposits from the roof surface; it does not repair cracked tiles, damaged metal, failed flashings or an active water-entry defect. Start by identifying the roof material, its condition, existing coatings and the reason for cleaning. Those details help establish what preparation and cleaning are appropriate.</p>
   <h3>Check condition before choosing the cleaning work</h3>
   <p>Loose components, corrosion, damaged tiles and weak connections need consideration before the surface is disturbed. A method suitable for one roof or finish is not automatically suitable for another. Our scope should identify the area, the proposed method and any repairs needed first rather than treating one pressure setting or chemical treatment as a universal solution.</p>
   <h3>Include the drainage route and adjoining areas</h3>
   <p>Ask how debris and runoff will be managed around valleys, gutters, outlets, downpipes and nearby surfaces. Confirm which clearing or drainage work is included and which requires a separate item. The <a href="/projects/wa-6121-tile-roof-valley-gutter-cleaning/">WA 6121 tile roof and valley gutter cleaning record</a> shows one documented scope, not a package for every property.</p>
   <p>For an ongoing upkeep plan, review <a href="/roof-maintenance/">roof maintenance and inspection priorities</a>. If water is entering the building, start with <a href="/roof-leak-repairs/">roof leak investigation and repair</a> rather than booking surface cleaning as a leak fix.</p>`)+
  section('roof-painting-scope','Roof painting in Perth: assess suitability before a finish',`
   <p>Painting is a finishing decision. The existing material and coating, surface condition and required component repairs determine whether a proposed finish is appropriate. A fresh appearance is not proof that a leak or deteriorated connection has been repaired.</p>
   <h3>Define preparation and the proposed coating system</h3>
   <p>Ask the quote to distinguish defect repairs, cleaning, preparation and finishing. Confirm the actual product system proposed for the inspected material, any existing-coating limitations and the preparation and application requirements. Do not assume every roof can use the same coating or that a finish can substitute for replacing damaged components.</p>
   <h3>Confirm the scope and written terms</h3>
   <p>Agree which surfaces and components are included, how adjoining areas are protected, access arrangements and the checks recorded at completion. Ask for the terms applicable to your particular work; this page does not promise a universal coating life, manufacturer approval or standard warranty.</p>
   <div class="faq-list">${question('Do roof cleaning and painting have to be booked together?','No single combined scope suits every roof. Cleaning may be appropriate without painting, while a finish may require repairs and preparation first. The inspection and your objective determine which work is suitable; the written quote should separate the stages.')}${question('Can painting stop a recurring roof leak?','A coating is not a substitute for tracing water entry and correcting defective roof components. Ask for the leak findings and required repairs before deciding on any optional surface finish.')}</div>
   <p>See <a href="/roof-restoration/#restoration-quote-factors">how restoration combines repairs and finishing</a> or <a href="/contact/">request an assessment of cleaning or painting suitability</a>. Existing photos are optional.</p>`),

 'gutter-repairs':section('gutter-repair-or-replace','Gutter repairs or replacement: how to choose the scope',`
  <p>A leaking join does not automatically mean replacing the whole gutter system. The condition of the surrounding run, its supports, fall and connection to the outlet and downpipe helps determine whether a focused repair is appropriate.</p>
  <h3>Local joint repair or an affected-section replacement</h3>
  <p>A sound adjoining run may support a local connection repair. Deterioration extending beyond the join may require replacement of the affected section and its connections. Ask which length, corners, outlets and supports are included and whether damage to adjoining fascia or eaves needs a separate assessment.</p>
  <h3>Recurring overflow needs a connected check</h3>
  <p>Water arriving from the roof, retained debris, the outlet and downpipe can all be relevant. Replacing a visible gutter section alone does not establish that a downstream blockage or wider drainage issue has been addressed. Our <a href="/gutters-downpipes/">connected gutter and downpipe assessment</a> and <a href="/downpipe-repairs/#downpipe-repair-or-replace">downpipe repair or replacement guidance</a> explain that distinction.</p>
  <div class="faq-list">${question('Does a gutter replacement enquiry include the whole house?','No. Describe the affected runs so the team can confirm the scope. A local damaged-section replacement is different from whole-house gutter work. For internal drainage, we also undertake <a href="/box-gutter-repairs/">box gutter repairs</a>. Underground drainage and wider changes must be specifically agreed.')}</div>
  <p><a href="/contact/">Request a gutter assessment and itemised repair quote</a>. Include where water escapes and whether the problem returns after clearing.</p>`),

 'downpipe-repairs':section('downpipe-repair-or-replace','Downpipe repair or replacement: compare the affected components',`
  <p>A separated joint, a loose bracket and deterioration through a pipe wall need different work. Inspection considers the visible pipe, its support, the outlet above and the connection below. A repair at one joint should not be assumed to resolve water backing up from another part of the drainage route.</p>
  <p>Where adjoining material is suitable, a local reconnection or component repair may be relevant. If a pipe section is damaged beyond that connection, the quote should identify the affected section, compatible fittings, supports and access. Ask what is being retained and which connected items are excluded.</p>
  <p>Review <a href="/gutter-repairs/#gutter-repair-or-replace">gutter repair and section replacement decisions</a> with the <a href="/news/gutter-warning-signs/">guide to recurring overflow</a>. Underground drainage investigation and wider system changes need separate confirmation. <a href="/contact/">Discuss the visible pipe damage and assessment arrangements</a>.</p>`),

 'repair-options':section('compare-repair-options','Roof repair vs restoration vs replacement',`
  <p>Choose the extent of work from the condition found, not from a surface photograph or the age of the roof alone. A local repair addresses a defined defect. Restoration combines suitable component repairs with any agreed preparation or finish. Whole-roof replacement is a separate project and is not implied by a local repair enquiry.</p>
  <h3>When a local repair may fit</h3>
  <p>An isolated damaged tile, fixing, flashing or drainage connection can suit focused work where the adjoining material remains serviceable. Ask which defect is being corrected, what surrounding components were considered and the limits of the proposed repair. See <a href="/roof-repairs/#repair-quote-factors">local repair scope and quote factors</a>.</p>
  <h3>When wider restoration may be useful</h3>
  <p>Several suitable repairs and an agreed surface objective may be organised together. The quote should distinguish necessary component work from optional preparation and finishing. Cleaning or painting does not make an unsuitable roof suitable for restoration. Review <a href="/roof-restoration/#restoration-quote-factors">restoration stages, suitability and costs</a>.</p>
  <h3>When a wider assessment is needed</h3>
  <p>Widespread deterioration, repeated connected problems or surrounding material that cannot support an appropriate local repair may justify a broader assessment. Ask for the evidence and what can be retained. We also undertake <a href="/roof-replacement/">whole-roof replacement in Perth</a>, with a separately agreed removal and replacement scope.</p>
  <h3>Compare like-for-like written quotes</h3>
  <p>Check that each quote addresses the same defects, components, access, preparation and included checks. Identify exclusions, optional items and how additional work is approved. A lower total for fewer components is not the same proposal. If the recommendation remains unclear, seek clarification or a separate assessment before deciding.</p>
  <div class="faq-list">${question('Does an older roof always need replacement?','Age alone does not establish the condition of the covering, connections or supporting material. The current defects, surrounding condition and repair limitations need assessment. Ask what evidence supports the recommended extent of work rather than deciding from age alone.')}</div>
  <p><a href="/roof-inspection/">Confirm the inspection scope and records you need</a> or <a href="/contact/">arrange an assessment before choosing the repair option</a>.</p>`),

 'areas/leederville-roof-repairs':section('leederville-maintenance','Roof maintenance for Leederville properties',`
  <p>For a Leederville property, maintenance starts with the roof and access conditions at that address. Tell us about recurring leaf deposits, previous leaks, additions to the building and when the roof was last inspected. These details help separate routine upkeep from a defect requiring repair.</p>
  <p>Before winter rain, discuss the condition of tiles or metal sheets, ridge and flashing connections, valleys, gutters and outlets. The assessment establishes what is relevant to your roof; a suburb name does not establish its material, exposure or maintenance interval. Do not climb onto the roof to gather information.</p>
  <p>Use the <a href="/roof-maintenance/">roof maintenance service</a> for preventive priorities and the <a href="/roof-inspection/">roof inspection scope</a> to confirm any records or fees before booking. Active water entry belongs with <a href="/roof-leak-repairs/">leak investigation and repair</a>, rather than being treated as routine cleaning.</p>
  <p><a href="/contact/">Discuss maintenance for your Leederville property</a>, including the address, building height and access contact. Existing ground-level photographs are optional.</p>`),

 'roof-maintenance':section('maintenance-and-repair','Preventive maintenance is not the same as a leak repair',`
  <p>Maintenance organises upkeep around the condition of the roof and connected drainage. If water is already entering the building or a component is damaged, identify the defect and the repair required rather than relying on a general clean. Agree which maintenance items are included and which need a separate repair scope.</p>
  <p>Our <a href="/areas/leederville-roof-repairs/#leederville-maintenance">Leederville maintenance guidance</a> explains the property and access information useful for that service area. For surface work, compare <a href="/roof-cleaning-painting/#roof-cleaning-scope">roof cleaning suitability</a> with <a href="/roof-cleaning-painting/#roof-painting-scope">painting preparation and scope</a>. <a href="/contact/">Arrange maintenance around your roof's current condition</a>.</p>`),

 'faq':section('leak-or-condensation','Roof leak or condensation: what should I record?',`
  <p>Rain-related water entry and moisture occurring in dry weather are different observations, but neither pattern is a diagnosis on its own. Water can travel before it becomes visible. Condensation, plumbing and equipment can also be relevant, so a ceiling stain alone does not establish that the roof needs sealing.</p>
  <h3>Note the timing and location safely</h3>
  <ul><li>Does the dampness follow rain, appear only in heavy rain, or occur during dry weather too?</li><li>Is it in one room or several areas, and is nearby plumbing or equipment in use?</li><li>Is the mark new, recurring or changing after a previous repair?</li></ul>
  <p>Existing photographs and a short timing record help explain the enquiry. Keep observations at ground level and away from damaged electrical equipment. Do not enter a roof space or climb onto the roof to identify the source.</p>
  <div class="faq-list">${question('Does moisture on a dry day rule out a roof leak?','No. The timing of a visible mark alone cannot confirm or exclude the source. Explain when it appears, recent rain, any previous repairs and nearby plumbing or equipment so the enquiry can be directed to the appropriate assessment.')}${question('Should I book painting to cover a ceiling stain or stop dampness?','A surface finish does not identify or correct the moisture source. First arrange the appropriate investigation and address the cause. Our <a href="/roof-leak-repairs/">roof leak repair service</a> and <a href="/news/roof-leak-detection-perth/">water-entry investigation guide</a> explain the roof-related assessment.')}</div>
  <p><a href="/contact/">Describe the moisture pattern and arrange the next step</a>.</p>`),

 'storm-damage-roof-repairs':section('urgent-assessment','Urgent roof leaks during opening hours',`
  <p>An urgent roof enquiry does not have to follow a named storm. Tell us if water is entering now, where it appears and whether materials are displaced. Our opening hours are Monday–Sunday, 9am–9pm Perth local time. Contact us to discuss availability; these hours are not a promise of immediate attendance or a 24-hour callout service.</p>
  <p>Assessment, temporary protection and permanent repairs can require different arrangements. Weather, access and site conditions determine what can be done safely. Keep people clear of the affected area and do not climb onto the roof to place a patch or take photos.</p>
  <p>For a leak without visible storm damage, see <a href="/roof-leak-repairs/">how roof leaks are investigated</a>. If you are comparing work proposals, review <a href="/roof-repairs/#repair-quote-factors">repair scope and quote factors</a>. <a href="tel:+611300838722">Call 0405 878 406 to discuss the current situation</a>.</p>`),

 'commercial-roof-repairs':section('commercial-scope-records','Confirm commercial access, approval and required records',`
  <p>A useful commercial enquiry identifies the affected tenancy or roof level, the person authorised to approve work and the building access contact. Include operating hours, restricted areas and equipment near the affected roof. Confirm induction or access arrangements before a visit is booked.</p>
  <p>Ask which photographs, findings and repair records can be provided for the agreed scope. If a manager or insurer requires a particular format, explain that before booking; a repair record is not automatically an engineering report, insurance determination or assessment of the whole building.</p>
  <p>Shared or strata responsibility needs to be clarified with the authorised decision-maker. This page does not add a separate strata-management or specialist reporting service. Review the <a href="/roof-inspection/">inspection scope and records</a>, then <a href="/contact/">send the location, access contact and approval requirements</a>.</p>`),

 'roof-inspection':section('inspection-record-expectations','What to confirm about inspection findings and photographs',`
  <p>Before booking, explain whether you need photographs, written repair priorities or a specific report format. Agree what can be supplied and how access limitations will be recorded. Inspection observations should identify the components seen, the concerns found and any areas that could not be assessed; they are not a guarantee about concealed conditions.</p>
  <p>The existing <a href="/news/roof-inspection-perth-guide/">roof inspection guide and photographs</a> illustrate the kinds of roof connections considered. They are not a sample report from your building or proof that the same defects are present. Use <a href="/repair-options/#compare-repair-options">repair options</a> to discuss the findings, and <a href="/contact/">confirm fees and required records before booking</a>.</p>`),

 'metal-roof-repairs':section('metal-repair-evidence','Use the photographs to understand a fixing repair',`
  <p>The <a href="/projects/roleystone-metal-roof-fastener-leak-repair/">Roleystone metal-roof fastener record</a> shows corrosion and fixing details from that job. It helps explain why the fastener and surrounding sheet need consideration together. It does not establish that every rust mark needs the same work or that the photographs prove a result for another roof.</p>
  <p>For your property, the assessment identifies the affected fixings, adjoining material and connected capping or flashing. The <a href="/news/metal-roof-repairs-perth-guide/">metal roof repair guide</a> explains those distinctions. <a href="/contact/">Describe the affected metal roof area</a>; existing photos are optional.</p>`),

 'tile-roof-repairs':section('tile-repair-evidence','Check the tile profile and the adjoining junction',`
  <p>A tile replacement needs to suit the existing profile and overlap, not just the colour. Include any spare-tile information you already have when requesting an assessment. Do not remove a tile or climb onto the roof to obtain a sample.</p>
  <p>The <a href="/projects/tile-roof-valley-chimney-flashing-repairs-perth/">tiled valley and chimney flashing photographs</a> show how tiles meet formed metal on one recorded roof. They illustrate a connected junction rather than proving the cause of a leak at your property. Review <a href="/news/tile-roof-repairs-perth-guide/">tile matching and local repair decisions</a>, then <a href="/contact/">arrange an assessment of the affected tiles and connections</a>.</p>`),

 'roof-leak-repairs':section('leak-symptom-next-step','When the visible symptom does not identify the repair',`
  <p>A stain after rain, dampness in dry weather and a leak returning after earlier work need their timing and location explained. The <a href="/faq/#leak-or-condensation">roof leak and condensation questions</a> help organise those observations without attempting a remote diagnosis.</p>
  <p>Use the <a href="/news/roof-leak-detection-perth/">leak investigation guide</a> to understand the water-path assessment. An on-site inspection establishes the roof-related defects and repair scope; existing photos are optional.</p>`)
};

export const keywordGapRoutes=Object.keys(content);

export function applyKeywordGapContent(documents){
 for(const [route,markup] of Object.entries(content)){
  const $=documents.get(route);
  if(!$)throw new Error(`Missing reviewed keyword-gap owner: ${route}`);
  $('main .keyword-gap-content').remove();
  if(route.startsWith('news/'))$('.article-reading').append(markup);
  else {
   const anchor=$('main > section.focus-faq,main > section.area-enquiry').first();
   if(anchor.length)anchor.before(markup);else $('main').append(markup);
  }
 }
 const storm=documents.get('storm-damage-roof-repairs');
 storm('main h1').text('EMERGENCY & STORM DAMAGE ROOF REPAIRS PERTH.');
 storm('.service-hero > .container > p:not(.eyebrow)').first().text('Urgent roof leaks and storm-damaged roof components in Perth — contact Ellis Services Group during opening hours to discuss assessment and repair availability. Work depends on weather and safe access.');
 const descriptions={
  'roof-repairs':'Roof repairs in Perth for tiles, metal roofs, ridges and flashings. Understand repair cost factors, confirm inspection arrangements and request a written quote.',
  'roof-restoration':'Roof restoration in Perth: assess repairs, cleaning, preparation and finishing. Compare suitability, quote factors and local repair options with Ellis.',
  'roof-cleaning-painting':'Roof cleaning and painting in Perth: compare material suitability, preparation, drainage protection and repairs needed before an agreed finish.',
  'gutter-repairs':'Gutter repairs in Perth: compare joint repairs and affected-section replacement, check connected drainage and arrange an assessment and written quote.',
  'repair-options':'Compare roof repair, restoration and wider replacement decisions in Perth. Understand scope, quote inclusions and when a broader assessment is needed.',
  'storm-damage-roof-repairs':'Urgent roof leak and storm damage enquiries in Perth, Monday–Sunday 9am–9pm. Discuss availability; assessment and repairs depend on weather and safe access.'
 };
 for(const [route,description] of Object.entries(descriptions)){
  const $=documents.get(route);
  $('meta[name="description"],meta[property="og:description"],meta[name="twitter:description"]').attr('content',description);
 }
}
