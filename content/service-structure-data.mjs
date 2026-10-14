// Reviewed service decisions. Existing topic bodies, answers and photo records
// retain their own source owners; this manifest replaces repeated sales prose.
// Curated next decisions, separate from the full educational topic links and
// actual project references retained with their matching work records.
export const serviceRelated={
 'roof-repairs':['roof-leak-repairs','metal-roof-repairs','repair-options#compare-repair-options','roof-inspection',['/news/roof-repair-cost-perth/','Repair quote inclusions']],
 'roof-leak-repairs':['tile-roof-repairs','metal-roof-repairs','flashing-repairs','gutters-downpipes',['/news/roof-repair-cost-perth/','Repair quote inclusions']],
 'tile-roof-repairs':['roof-leak-repairs','ridge-capping-repointing','flashing-repairs','repair-options'],
 'metal-roof-repairs':['roof-leak-repairs','flashing-repairs','roof-replacement','repair-options'],
 'ridge-capping-repointing':['tile-roof-repairs','roof-leak-repairs','roof-repairs'],
 'flashing-repairs':['roof-leak-repairs','tile-roof-repairs','metal-roof-repairs'],
 'gutter-repairs':['gutters-downpipes','downpipe-repairs#downpipe-repair-or-replace','box-gutter-repairs','roof-maintenance',['/news/gutter-warning-signs/','Gutter warning signs']],
 'gutters-downpipes':['gutter-repairs','downpipe-repairs','box-gutter-repairs','roof-maintenance',['/news/drainage-after-rain/','Drainage after rain']],
 'downpipe-repairs':['gutter-repairs#gutter-repair-or-replace','gutters-downpipes',['/news/gutter-warning-signs/','Gutter warning signs']],
 'roof-maintenance':['roof-inspection','gutter-repairs','roof-cleaning',['/areas/leederville-roof-repairs/#leederville-maintenance','Leederville maintenance'],['/news/roof-maintenance-basics/','Roof maintenance priorities']],
 'roof-cleaning-painting':['roof-cleaning','roof-painting','roof-maintenance','roof-leak-repairs','roof-restoration#restoration-quote-factors'],
 'commercial-roof-repairs':['metal-roof-repairs','box-gutter-repairs','flat-roof-repairs','roof-inspection','strata-roof-repairs'],
 'storm-damage-roof-repairs':['roof-leak-repairs','tile-roof-repairs','flashing-repairs','roof-repairs#repair-quote-factors'],
 'roof-restoration':['repair-options#compare-repair-options','roof-cleaning','roof-painting','roof-repairs','roof-replacement'],
 'roof-inspection':['repair-options#compare-repair-options','roof-leak-repairs','roof-maintenance','strata-roof-repairs','roof-replacement'],
 'repair-options':['roof-repairs#repair-quote-factors','roof-restoration#restoration-quote-factors','roof-replacement','roof-inspection',['/news/roof-repair-cost-perth/','Repair quote inclusions']],
 'roof-cleaning':['roof-painting','roof-maintenance','roof-leak-repairs'],
 'roof-painting':['roof-cleaning','roof-restoration','roof-leak-repairs'],
 'box-gutter-repairs':['gutter-repairs','gutters-downpipes','flat-roof-repairs','commercial-roof-repairs'],
 'roof-replacement':['repair-options#compare-repair-options','roof-repairs','roof-inspection'],
 'flat-roof-repairs':['box-gutter-repairs','roof-leak-repairs','commercial-roof-repairs'],
 'strata-roof-repairs':['roof-inspection','commercial-roof-repairs','roof-leak-repairs']
};

// Separate jobs illustrating the case's components, not identity claims about
// the photographs in that case. Keys identify the reviewed case index.
export const serviceProjectReferences={
 'roof-repairs':{0:[['tile-roof-valley-chimney-flashing-repairs-perth','Perth tile valley and chimney flashing project']]},
 'roof-leak-repairs':{0:[['tile-roof-chimney-flashing-repair-perth','Perth tile roof chimney flashing project']]},
 'tile-roof-repairs':{0:[['tile-roof-valley-chimney-flashing-repairs-perth','Perth tile valley and chimney flashing project'],['tile-roof-chimney-flashing-repair-perth','Perth tile roof chimney flashing project']]},
 'metal-roof-repairs':{0:[['roleystone-metal-roof-fastener-leak-repair','Roleystone metal roof fastener repairs'],['metal-roof-ridge-capping-repair-perth','Perth metal roof ridge capping project'],['metal-roof-hip-ridge-capping-repair-perth','Perth metal roof hip and ridge capping project'],['metal-roof-ridge-flashing-repair-perth','Perth metal roof ridge flashing project']]},
 'flashing-repairs':{0:[['tile-roof-chimney-flashing-repair-perth','Perth tile roof chimney flashing project'],['metal-roof-ridge-flashing-repair-perth','Perth metal roof ridge flashing project']]},
 'gutter-repairs':{1:[['wa-6121-tile-roof-valley-gutter-cleaning','WA 6121 valley gutter cleaning and tile repairs']]},
 'gutters-downpipes':{0:[['wa-6121-tile-roof-valley-gutter-cleaning','WA 6121 valley gutter cleaning and tile repairs']]}
};

export const serviceCopy={
 'roof-repairs':{
  heading:'Local defects and connected roof components',
  content:'We repair damaged tiles, metal sheets, ridges, valleys, flashings and roof-edge drainage. An isolated defect can suit a local repair where surrounding material remains serviceable; several connected defects can be coordinated in one scope. Cleaning or painting is a separate surface decision.',
  steps:['Inspect the affected roof area and adjoining water path, including earlier repairs and concealed areas accessible within the agreed scope.','Specify the components to retain, repair or replace, compatible materials, preparation, access and waste removal in a written quote.','Complete the agreed repairs and review the repaired connections and relevant drainage details. Explain any exclusions or further work before it proceeds.'],
  boundary:'For a rental, identify who can approve the work and arrange access. Any warranty terms must be confirmed in writing for the particular scope. Confirm the inspection fee and any credit against repair work before booking; a universal online price cannot describe every roof.',
  anchors:{'repair-quote-factors':'steps'},caseTitles:['Tile, ridge and junction records']
 },
 'roof-leak-repairs':{
  heading:'Rain patterns and indoor water marks',
  content:'A ceiling stain marks where moisture becomes visible, which can be away from the entry point. We relate heavy or wind-driven rain, dry-weather dampness and recurring leaks to tiles or sheets, ridges, valleys, flashings and drainage. Plumbing, condensation or equipment faults may require another trade.',
  steps:['Trace the reported water path and review previous sealing or repairs; a visible stain or fresh patch does not establish the source.','Repair the identified tile, fixing, sheet, flashing or drainage defect with materials suited to the adjoining roof. Agree the access, scope and written quote first.','Review the repaired connections and water route, explaining access limits or further investigation appropriate to the leak.'],
  boundary:'For a leak noticed after solar installation, share the installation and leak dates. Timing alone does not establish the cause. Electrical equipment must be handled by the appropriate specialist.',
  anchors:{'leak-symptom-next-step':'content'},caseTitles:['Tiled-roof leak repair sequence']
 },
 'tile-roof-repairs':{
  heading:'Compatible tiles and adjoining junctions',
  content:'We replace damaged concrete and terracotta tiles where the surrounding covering supports a local repair. Matching means a compatible profile, fit and overlap, not colour alone; spare tiles and supplier availability are checked before a match is confirmed. Damage beside a ridge, valley or chimney can require connected repairs.',
  steps:['Inspect cracked, displaced or missing tiles, the supporting detail and adjacent ridge, valley and flashing connections.','Source compatible tiles, agree the affected area and access, then replace damaged components and restore alignment and adjoining details as required.','Review tile overlaps and the repaired junctions. Explain any unmatched material, wider deterioration or excluded work in the written scope.'],
  boundary:'Two-storey height, roof pitch and structures below the work affect controlled access. Do not climb onto the roof to check a tile or obtain photographs.',
  anchors:{'tile-repair-evidence':'content'},caseTitles:['Tile, ridge and valley repair sequence','Two-storey tile roof repair']
 },
 'metal-roof-repairs':{
  heading:'Fixings, sheets and formed junctions',
  content:'A metal roof fixing relies on the screw, washer and surrounding sheet together. Replacing a screw may not address corrosion around its hole. We assess corrugated iron, tin and COLORBOND descriptions against the actual profile and finish, then distinguish local fastener or flashing work from affected-sheet replacement.',
  steps:['Inspect corrosion, loose sheets, fixings, laps, ridge and hip capping, roof edges and penetrations with the connected water path.','Agree compatible fasteners, sheet or formed-flashing details and the extent of removal. Local repair depends on serviceable surrounding material.','Review seating, repaired laps and adjoining connections after the agreed work, with exclusions and any wider replacement requirement explained.'],
  boundary:'Solar panels and roof equipment can affect access and the investigation area. Electrical or equipment work requires the appropriate specialist; roofing photographs do not establish a fault in that equipment.',
  anchors:{'metal-repair-evidence':'content'},caseTitles:['Metal roof and junction repair sequence']
 },
 'ridge-capping-repointing':{
  heading:'Ridge support and pointing condition',
  content:'Bedding supports the ridge caps; pointing is the exposed finish at their connections. Repointing can suit firm caps with deteriorated pointing. Loose caps or failed bedding need the support addressed, with damaged caps and adjoining tiles considered in the same repair area.',
  steps:['Inspect ridge and hip stability, cracked or missing mortar, displaced caps and nearby water marks without asking you to test caps by hand.','Define the runs needing repointing or rebedding, compatible materials, replacement caps and adjoining tile work in the quote.','Complete the agreed work and review the secured ridge connections and neighbouring tiles. Explain any wider defects outside that scope.'],
  boundary:'Cracks alone do not establish the depth of the defect. Access, roof pitch and material condition determine the suitable work; a local surface finish cannot replace failed bedding.',
  anchors:{},caseTitles:['Tiled ridge bedding and pointing records']
 },
 'flashing-repairs':{
  heading:'Valleys and roof junctions',
  content:'Valleys carry water where roof slopes meet. Flashings shed it at walls, chimneys, skylights and penetrations. Their formed shape, overlaps and connection to adjoining tiles or sheets matter as much as the visible edge. Clearing deposits, repairing local damage and replacing perforated metal are different scopes.',
  steps:['Inspect the channel or junction, uphill water path, adjoining covering and downstream outlet to establish the affected components.','Form the repair or replacement detail for the actual roof material and connection. Agree any tile lifting, access and disposal before work.','Review repaired overlaps, fixings and the connected drainage route. Record limitations where adjoining material or equipment needs separate work.'],
  boundary:'A skylight leak may involve roof flashing, the skylight itself or glazing. Roof repairs do not automatically include skylight replacement, vents, whirlybirds or air-conditioning equipment work.',
  anchors:{},caseTitles:['Valley and chimney flashing records']
 },
 'gutter-repairs':{
  heading:'Leaking joints, sagging runs and overflow',
  content:'Overflow can come from debris, poor fall, restricted outlets or deteriorated gutter material. We assess the gutter with its supports, roof-edge discharge and connected downpipe. Clearing a blockage is different from repairing a joint or replacing a corroded length; recurring overflow needs the connected route checked.',
  steps:['Locate water escape and inspect fall, brackets, seams, outlets and nearby eaves or valley discharge.','Agree clearing, joint or support repairs, local replacement and any connected roof-edge tile work, using compatible components.','Review the repaired run and outlet connections, identifying any remaining drainage restriction or separate downstream work.'],
  boundary:'Photographs are optional and can be emailed to ellisservicesgroup3@outlook.com. No photos are needed to request an assessment. Use existing ground-level views; do not access an elevated gutter.',
  anchors:{'gutter-repair-or-replace':'steps'},caseTitles:['Gutter, outlet and connection sequence','Gutter clearing and roof-edge tile work']
 },
 'gutters-downpipes':{
  heading:'The route from roof edge to discharge',
  content:'A full gutter and a leaking pipe can be parts of the same drainage problem. We inspect the run, outlet, downpipe joints and supports together so clearing or local repairs address the affected connection. Overflow is not automatically caused by leaves, and roof drainage work does not automatically include underground drains.',
  steps:['Check where overflow or leakage appears, the rainfall pattern and the visible route from roof edge through the outlet and pipe.','Clear deposits where required and repair or replace the affected gutter, connection, pipe section or support within the agreed scope.','Review the connected roofline drainage details and explain restrictions or downstream work outside the repair boundary.'],
  boundary:'Building height, restricted access and adjoining roof-edge damage can change the work. Ground-level observations and existing photographs are enough to start an enquiry.',
  anchors:{},caseTitles:['Gutter clearing and roof-edge tile work']
 },
 'downpipe-repairs':{
  heading:'Pipe sections, joints and supports',
  content:'Loose brackets can let a downpipe move and strain joints or the gutter outlet. We distinguish a local joint or support repair from replacement of a deteriorated pipe section, checking surrounding material and the visible discharge route. Overflow at the gutter and leakage from a pipe seam need connected assessment.',
  steps:['Inspect pipe condition, wall fixings, supports, joints and the gutter outlet, including any visible restriction.','Agree compatible fittings, affected lengths and access. Secure or replace supports and repair the connected damaged components.','Review the repaired joints and supports with the outlet connection; identify any separate underground drainage or wider gutter issue.'],
  boundary:'Photographs are optional and can be emailed to ellisservicesgroup3@outlook.com. No photos are needed to request an assessment. Keep observations at ground level.',
  anchors:{'downpipe-repair-or-replace':'steps'},caseTitles:[]
 },
 'roof-maintenance':{
  heading:'Condition-led upkeep before seasonal rain',
  content:'Planned maintenance combines clearing deposits with checks of tiles or metal sheets, ridges, valleys, flashings and outlets. Broken tiles, loose capping, failed fixings or leaking junctions require defined repair work. Previous leaks, nearby trees and changes since earlier maintenance help establish priorities.',
  steps:['Inspect the covering and connected drainage against the repair history and accessible condition.','Prioritise debris clearing and necessary component repairs, separating optional cleaning or finishing from defects needing attention.','Review the maintained connections and outlets and identify follow-up items suited to the property.'],
  boundary:'Maintenance does not guarantee that a roof will never leak. Observations and photographs should be made from ground level, with roof and elevated gutter access left to controlled work arrangements.',
  anchors:{'maintenance-and-repair':'content'},caseTitles:['Tile and junction maintenance records']
 },
 'roof-cleaning-painting':{
  heading:'Repair, preparation and surface finish',
  content:'Cleaning removes deposits; painting adds a finish to a suitable surface. We assess tiles or metal, existing coatings, damaged components and drainage before agreeing either scope. A fresh finish does not establish that a leak has been repaired. Cleaning and painting can be considered separately.',
  steps:['Establish the roof material, existing finish and defect repairs needed before surface work.','We clean the roof before spray painting. Preparation and product compatibility must suit the assessed covering and existing coating; confirm access and protection of adjoining areas.','Review the agreed finished areas and connected drainage, with exclusions, product details and applicable written terms confirmed for the property.'],
  boundary:'No universal cleaning pressure, chemical treatment, coating life or warranty is promised. The recorded project shows cleaning and finished painted views, without spray application in progress.',
  anchors:{'roof-cleaning-scope':'content','roof-painting-scope':'steps'},caseTitles:['Cleaning and finished painted-roof views']
 },
 'commercial-roof-repairs':{
  heading:'Roof repairs around building operations',
  content:'Commercial work can involve sheets, capping, flashings, penetrations, gutters and downpipes. We coordinate the assessment and repair scope with the building contact, considering operating hours, occupied areas, roof equipment and restrictions on access. Shared components do not establish who can approve the work.',
  steps:['Connect affected rooms and leak timing with accessible roof and drainage details, reviewing previous repair records.','Agree materials, access, protection of occupied areas and the work sequence with the authorised contact before repairs begin.','Review the repaired components and provide the findings or records agreed for that scope; arrange any additional work separately.'],
  boundary:'Confirm required photographs or written records before booking. A repair assessment is not automatically an engineering report, certification or an insurance determination. Equipment and electrical work need the appropriate specialist.',
  anchors:{'commercial-scope-records':'steps'},caseTitles:[]
 },
 'storm-damage-roof-repairs':{
  heading:'Urgent assessment and permanent repairs',
  content:'Displaced tiles, loose capping, damaged sheets and affected drainage need assessment of the connected roof. Urgent enquiries are prioritised; attendance is arranged promptly when weather, site access and safety conditions allow. Temporary protection and permanent repairs are separate work items.',
  steps:['Report active water entry, affected rooms, displaced materials and the event timing from a safe place so we can plan assessment.','Inspect accessible damage and agree appropriate protection, component repairs and the access needed for the work.','Carry out the agreed repairs when conditions permit and review the repaired roof connections, with further investigation explained.'],
  boundary:'Opening hours are Monday–Sunday, 9am–9pm Perth local time, not a promise of immediate attendance or a 24-hour callout. Keep clear of electrical hazards, sagging ceilings and fallen materials; call emergency services for immediate life or electrical danger. An enquiry does not guarantee an insurance outcome.',
  anchors:{'urgent-assessment':'boundary'},caseTitles:['Roof-void observations from an urgent enquiry']
 },
 'roof-restoration':{
  heading:'Coordinated repairs and surface work',
  content:'Restoration brings suitable component repairs together with agreed cleaning, preparation and finishing. A few broken tiles or an isolated leak may need only a local repair. Wider work is assessed against the covering, material condition and your objective; painting is not a substitute for a sound roof detail.',
  steps:['Assess tiles or sheets, ridge support, flashings and drainage to establish whether a broader programme is appropriate.','Separate repair items from cleaning, preparation and finish in the quote, identifying materials, deterioration addressed and preparation required. We clean before spray painting where painting is agreed.','Review the agreed repair and finishing scope, drainage details and exclusions. Confirm additional work, product information and any warranty terms in writing.'],
  boundary:'Access, removal of damaged material and disposal should be clear in the comparison. Whole-roof replacement is a separate decision where retained material cannot support an appropriate repair.',
  anchors:{'restoration-quote-factors':'steps'},caseTitles:[]
 },
 'roof-inspection':{
  heading:'Findings, access and repair priorities',
  content:'An inspection can investigate an active leak, assess roof condition or plan maintenance. The agreed purpose determines the accessible coverings, ridges, valleys, flashings, penetrations and drainage to examine. Earlier findings and repair history are useful when a leak returns or proposals differ.',
  steps:['Agree the assessment purpose, accessible areas and any requested photographs or written records before booking.','Inspect the relevant roof and drainage components, relate findings to the reported concern and explain limitations or further investigation.','Set out repair priorities and a separate written repair quote, distinguishing urgent defects from planned upkeep.'],
  boundary:'Roof inspections are chargeable: confirm the fee and scope before booking. A roof assessment is not automatically a whole-building, engineering, sale or insurance report, and it does not promise access to concealed or unsafe areas.',
  anchors:{'inspection-record-expectations':'steps'},caseTitles:['Roof inspection and maintenance records']
 },
 'repair-options':{
  heading:'Repair, restoration and replacement',
  content:'A targeted repair addresses an isolated defect while suitable surrounding material is retained. Component replacement renews a damaged tile, sheet, valley or flashing. Restoration coordinates suitable repairs with preparation and finishing; whole-roof replacement is a separate removal and renewal scope. Age or appearance alone does not settle the choice.',
  steps:['Assess the extent of deterioration, connected defects and what can safely remain in place.','Compare proposals for the same components, materials, access, preparation, waste removal and exclusions; separate optional cleaning or painting from necessary repairs.','Agree the work boundary, completion checks and how concealed deterioration or extra work will be approved before proceeding.'],
  boundary:'Ask for the findings supporting wider work and any limitations of local repair. Inspection charges, available records and applicable warranty terms need confirmation for the property, not assumptions from a total price.',
  anchors:{'compare-repair-options':'content'},caseTitles:[]
 },
 'roof-cleaning':{
  heading:'Deposits, surface condition and drainage',
  content:'Our cleaning service addresses surface deposits and debris. Painting adds a finish, while restoration can combine repairs and surface work. Tile, metal and existing coatings need different suitability checks; a cleaner appearance does not repair damaged components. We clean the roof before spray painting when painting is agreed.',
  steps:['Assess covering condition, deposits, loose components and previous coatings before choosing the cleaning method.','Agree the roof areas, access and protection, with repairs and clearing of valleys, gutters or outlets identified separately where needed.','Review the included areas and runoff route. Cleaning alone does not establish readiness for every coating system.'],
  boundary:'No universal pressure, chemical treatment or cleaning interval is specified. Existing safe photographs are optional. The work record below shows cleaning in progress, not a completed cleaning-only result.',
  anchors:{'scope-1':'content','scope-2':'steps','scope-3':'boundary','service-questions':'guidance'},caseTitles:['Roof cleaning in progress']
 },
 'roof-painting':{
  heading:'Existing coatings and a compatible finish',
  content:'Roof painting is a finishing decision for a suitable covering. Existing coating, weathering and damage affect product compatibility and preparation; colour alone does not determine the system. Leaks and component repairs remain distinct from appearance work.',
  steps:['Assess the actual roof material, existing coating and defects before agreeing the surface and product scope.','We clean the roof before spray painting. The sequence separates necessary repairs, cleaning and preparation from the chosen finish.','Review the agreed finished areas and exclusions. Product details and any applicable written terms must be confirmed for the property.'],
  boundary:'The photographs show the roof after spray painting and do not show spray application in progress. They cannot establish coating life, leak correction or suitability for another roof.',
  anchors:{'scope-1':'content','scope-2':'steps','scope-3':'boundary','service-questions':'guidance'},caseTitles:['Finished painted-roof views']
 },
 'box-gutter-repairs':{
  heading:'Channels, joints and overflow routes',
  content:'A box gutter collects water within connected roof details. Its channel, joints, outlet and overflow route need assessment together. Indoor staining alone cannot distinguish a leaking joint, retained water or overflow. Clearing debris and repairing deteriorated gutter material are different jobs.',
  steps:['Relate rain conditions and earlier clearing to the channel, adjoining junctions and outlet condition.','Define local joint work, affected lengths or drainage changes, checking compatibility with retained materials rather than assuming a coating suits every gutter.','Review the repaired connections and explain remaining drainage limitations and any further work needed.'],
  boundary:'Include building height, affected level and authorised access contact. The photographs record original conditions and work in progress, not a completed drainage performance test.',
  anchors:{'scope-1':'content','scope-2':'steps','scope-3':'boundary','service-questions':'guidance'},caseTitles:['Box gutter condition and local work']
 },
 'roof-replacement':{
  heading:'Whole-roof scope and retained components',
  content:'We undertake whole-roof replacement in Perth. Widespread deterioration or material unable to support a suitable local repair can justify a wider scope. The assessment compares what can be retained, the covering to remove and the proposed replacement; age or appearance alone is insufficient.',
  steps:['Compare local repair and replacement against the observed defects, adjoining junctions and limitations of retaining the covering.','Define new covering, flashings, penetrations, drainage connections, removal, disposal and access. Agree how concealed deterioration will be recorded and further work approved.','Review the agreed replacement components and completion checks, distinguishing the final scope from construction-stage photographs.'],
  boundary:'Suspected asbestos requires separate identification and specialist arrangements. The photographs are construction-stage records; this gallery does not show the completed replacement roof. They cannot establish another roof’s material needs or a standard duration.',
  anchors:{'scope-1':'content','scope-2':'steps','scope-3':'boundary','service-questions':'guidance'},caseTitles:['Whole-roof replacement construction stages']
 },
 'flat-roof-repairs':{
  heading:'Covering, drainage and connected junctions',
  content:'Flat roof describes a form, not a single covering or repair system. Sheets, membranes and existing treatments need different compatibility checks. Standing water can be relevant to drainage but does not identify a leak source by itself; penetrations, roof edges and wall junctions also matter.',
  steps:['Identify the covering, previous treatments and water-entry pattern with the outlets and adjoining roof details.','Agree a repair boundary and compatible materials, separating outlet clearing or drainage alterations from damaged-covering repairs.','Review the agreed repaired components and explain retained areas, exclusions or wider deterioration requiring another scope.'],
  boundary:'The photographs support discussion of internal drainage and wall connections. They do not show repair of an entire flat roof covering or establish a universal membrane or coating specification.',
  anchors:{'scope-1':'content','scope-2':'steps','scope-3':'boundary','service-questions':'guidance'},caseTitles:['Internal drainage and wall-junction work']
 },
 'strata-roof-repairs':{
  heading:'Authorised access and defined repair scope',
  content:'The lot or building, affected room and roof level help define an enquiry. The authorised contact must confirm permission to inspect shared or adjoining areas and identify who approves work. Roof or drainage arrangements alone do not determine ownership, payment liability or common-property boundaries.',
  steps:['Review leak history, occupied areas and access restrictions; agree requested photographs or written records before booking.','Define the affected roof or drainage components, materials and approval arrangements, including how additional work or access to another lot is agreed.','Review the agreed work and records with the authorised contact, noting any exclusions or further assessment.'],
  boundary:'The skylight addition shown below does not document a leak investigation or whole-roof replacement. A roof assessment is not a whole-building engineering report or an insurance determination; photographs do not establish approvals or liability.',
  anchors:{'scope-1':'content','scope-2':'steps','scope-3':'boundary','service-questions':'guidance'},caseTitles:['Gutter-edge preparation and joint treatment','Skylight addition on a metal roof']
 }
};

// Existing public guides hold the full educational text; ownership stays on
// the service via its one data-topic link. These are not new routes.
export const topicGuide={
 'roof-leak-repairs':'roof-leak-detection-perth',
 'tile-roof-repairs':'tile-roof-repairs-perth-guide',
 'ridge-capping-repointing':'ridge-capping-repairs-perth-guide',
 'flashing-repairs':'roof-valleys-flashing-repairs-perth',
 'metal-roof-repairs':'metal-roof-repairs-perth-guide',
 'gutter-repairs':'gutter-warning-signs',
 'box-gutter-repairs':'drainage-after-rain',
 'repair-options':'roof-repair-cost-perth',
 'roof-painting':'roof-maintenance-basics',
 'roof-replacement':'roof-repair-cost-perth',
 'roof-inspection':'roof-inspection-perth-guide',
 'roof-repairs':'roof-repair-cost-perth',
 'roof-maintenance':'roof-maintenance-basics'
};

// Existing guide H2 sections provide the reading context, avoiding a second
// disconnected education appendix. Each topic becomes a named H3 underneath.
export const topicPlacement={
 Q001:[2,'Heavy-rain leaks and drainage capacity'],Q002:[2,'Wind-driven rain at connections'],
 Q003:[1,'Ceiling stains after rain'],Q004:[1,'Stains and other moisture sources'],
 Q005:[1,'Water travel before a stain appears'],Q006:[1,'Distance between entry and visible water'],
 Q007:[3,'Recurring leaks after repair'],Q008:[3,'Sealant and unresolved water paths'],
 Q009:[1,'Cracked tiles and connected water entry'],Q010:[2,'Individual tile replacement and profiles'],
 Q011:[1,'Repointing and rebedding'],Q012:[3,'Loose caps and repair signs'],
 Q013:[1,'Valleys and concentrated runoff'],Q014:[1,'Valley iron replacement decisions'],
 Q015:[2,'Flashing at walls and openings'],Q016:[3,'Damaged flashing and recurring stains'],
 Q017:[2,'Screw, washer and fixing-hole leaks'],Q018:[5,'Local repairs and sheet condition'],
 Q019:[8,'Skylights and separate equipment work'],Q020:[1,'Overflow into eaves and roof spaces'],
 Q021:[2,'Box gutter outlets and overflow'],Q022:[10,'Condensation, plumbing and roof moisture'],
 Q023:[6,'Local repair and wider restoration'],Q024:[5,'Painting and leak repairs'],
 Q025:[6,'Whole-roof replacement decisions'],Q026:[4,'Second assessments and repair evidence'],
 Q027:[8,'Inspection components, fees and records'],Q028:[5,'Repair quote inclusions'],
 Q029:[4,'Roof and drainage preparation before winter'],Q030:[7,'Leak location, timing and repair history']
};
