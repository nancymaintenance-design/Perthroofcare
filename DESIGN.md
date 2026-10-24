---
version: alpha
colors:
  paper: "#f4f1e9"
  ink: "#202321"
  primary: "#f2b544"
  eucalyptus: "#725018"
  wash: "#eae6dd"
  line: "#d3cfc5"
typography:
  display:
    fontFamily: "Arial Narrow, Aptos Display, Arial, Microsoft YaHei, sans-serif"
  body:
    fontFamily: "Arial, Microsoft YaHei, PingFang SC, sans-serif"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace"
rounded:
  DEFAULT: "4px"
spacing:
  pageGutter: "clamp(20px, 4vw, 64px)"
  section: "clamp(2rem, 4vw, 4rem)"
components:
  serviceMenu:
    width: "min(56rem, calc(100vw - 32px))"
  primaryCta:
    minHeight: "48px"
---

## Current approved direction — 2026-10-24

The owner selected displayed concept 2 (project photography) in reports/2026-10-24-ui-redesign-exploration/selection-manifest.json and requested a site-wide bilingual UI upgrade. This section and the frontmatter supersede older visual directions below; older dated records are retained as history. This candidate is local only.

Use warm charcoal headers, scope sections and enquiry/footer bands; chalk reading surfaces; amber actions; small 4px corners and real site photography. Large service heroes fade from dark left text to the existing photograph on the right. A compact sticky section outline follows the hero. Existing related-service links sit beside the scope, and a decorative repeat of the original detail photograph sits beside the complete solution. All original evidence galleries, captions, prose, H1s and destinations remain. Home alone swaps five thumbnails and its hero to existing finished-work photos, with accurate bilingual alternatives. Never imply an old roof was fully renewed when only flashing or fixings were repaired.

Runtime-canonical model B: ui-system.css owns current palette and common typography/header/footer, homepage adaptations and shared page-outline/scope/process primitives. service-layout.css owns service composition and breakpoints. about-company.css/contact-layout.css own their page overrides; FAQ, guide and directory layers retain their established owners. Legacy refinement.css remains the base, overridden by the current layer, not a second live design choice. The build fingerprints and merges these into at most two requests: shared below 85KB, combined below 90KB, service/FAQ layers below 5.5KB and other layers below 4KB. Only explicitly retired classes absent from all pages and runtime JS are pruned.

Token mapping: paper→--porcelain/--paper; ink→--ink; primary→--accent; eucalyptus→--clay; wash→--sand; line→--sand-line; display/body→--ui-display/--ui-body. Header height is measured through the existing shared ResizeObserver for sticky outlines and guide TOCs. Mobile navigation uses the same dark surface, legible open submenu, natural wrapping and scrolling. Existing form validation, privacy, review and enquiry behaviors remain authoritative. All added UI labels are in batch-030.json, with no external font/icon dependency.

Verification evidence belongs to ../reports/2026-10-24-site-ui-upgrade; design-qa.md records visual comparison and browser states. Source content remains governed by existing owner-copy/editor/locale modules; ui-upgrade.mjs only rearranges their published nodes after owner copy and before machine-content sync.

### Contact refinement — 2026-10-24

The owner rejected the centred, tall Contact form. Contact now uses the existing DOM as a 1280px desktop grid: introduction and direct contact on the left, one compact white enquiry panel on the right. The layout stacks in the original DOM/focus order below 900px. Inputs are 44px high; the message starts at 112px with the existing native vertical resize behavior retained; submit remains at least 48px. There is no nested form card and no empty status row before submission. The live status node stays in the accessibility tree while empty, and resumes normal visible flow when populated. No content, H1, URL, form attributes, handlers or sending behavior change. contact-layout.css owns this adaptation only; the existing header, palette, footer and all sibling pages remain. Evidence: ../reports/2026-10-24-contact-layout-refinement.

## Overview

### FAQ access — 2026-10-21

Primary navigation includes FAQ / 常见问题 in both languages, before Resources. The FAQ page starts its question area with four wrapping service buttons using the existing amber button style: leak repairs, gutters and downpipes, inspection, and repair options. Keep the existing category directory, 49 answers and footer links; do not add a separate FAQ route or change H1.

Ellis Services Group is a practical Perth roof-repair service site. Its public pages should feel like a concise field brief: a visitor identifies the roof detail, understands the relevant repair topic, then makes direct contact. The register is brand-led but restrained. The site should never feel like a generic article library, a giant sales page, or a keyword catalogue.

## Colors

Use pure white for reading, charcoal for text, enquiry bands and the footer, and amber for primary actions and the small roofline motif. Light neutral grey separates article and service collections. Amber buttons use charcoal text; small links and labels on white use dark ochre, never low-contrast yellow. The legacy eucalyptus/clay tokens now alias the accessible dark-ochre text role, not the action fill. Runtime ownership remains refinement.css, loaded after site.css and brand-hero.css; responsive-images.css changes image sources only. The hero uses one neutral charcoal overlay for contrast. Original logo artwork, platform icons and photograph colors are preserved.

Token mapping (runtime-canonical model): `paper → --porcelain/--paper`; `ink → --ink/--coastal-ink/--night`; `primary → --accent` (button, roofline and dark-surface label); `eucalyptus → --clay/--eucalyptus` (light-surface links and labels); `wash → --sand/--sky-wash`; `line → --sand-line`. Hover and active amber are `--accent-hover:#e6a62e` and `--accent-active:#d99a24`. The shared refinement layer owns legacy selector adaptation so the approved palette survives regeneration without altering content or layout.

## Typography

Display type is compact and forceful for one service keyword-led heading per route. Body copy remains sentence case and narrow enough for fast scanning. Mono type is reserved for small service labels and factual metadata.

## Layout

Desktop content has deliberate side gutters and a maximum readable width. The primary content pattern is: concise topic rail, answer-first service summary, a limited number of useful modules, related services, and a direct enquiry path. Pages should not include consecutive generic panels simply to make them longer.

### Selected third visual concept — 2026-10-20

The approved homepage has an inset photographic hero with 16px corners, original roofer artwork, existing charcoal overlay and original actions. Its nine services use open three-column rows, no enclosing card surface, wide 2.24:1 image frames and a quiet bottom divider. Tablet uses two columns and phone one, retaining every original heading, photograph, paragraph, link and review. This overrides the earlier 18px card/4:3 frame directions for homepage service teasers only, not project evidence galleries. No content, schema, URL, contact or behavior changes accompany this visual revision.

Runtime ownership: ui-common.css supplies the compact section rhythm, default secondary heading scale and explicit standards-based scrollbar width; ui-home.css owns the selected homepage composition. vercel-build.mjs appends these to the existing page-owned layer through bundleStylesheets; the shared stylesheet stays unchanged. At most two style requests, shared below 85KB, combined below 90KB, service route layer below 5KB and other layers below 4KB remain enforced. Existing refinement.css tokens, font fallbacks, focus and reduced-motion policies remain canonical. tools/ui-content-snapshot.mjs and ui-polish.test.mjs freeze non-style HTML across all 138 routes; intentionally editing business content later requires reviewing and updating that baseline, not bypassing it.

## Elevation & Depth

Static content remains flat. Borders and quiet background changes separate groups. Dropdowns alone may use a restrained shadow because they float above the page.

## Shapes

Cards use 18px rounded rectangles and buttons use 12px corners. Text-based work categories use open columns and dividing lines rather than another card grid. The signature motif is a small roof-ridge outline beside selected section labels, paired with actual project photographs.

## Components

The service dropdown contains all 22 existing service and repair-option routes in four named groups: core roof repairs, roofline and drainage, inspection and maintenance, and larger scopes and repair options. On desktop it aligns to the trigger, stays inside both viewport edges and scrolls within its maximum height. At 900px and below, the primary navigation and service disclosure use full-width document flow; script clears all desktop positioning values. Hidden/expanded state, outside-click closure and Escape focus return remain shared behavior.

### Service navigation — 2026-10-20

The existing white/charcoal/amber field-brief identity stays unchanged. A single ordered breadcrumb sits beside the content opening, uses short localized labels and underlined real ancestor links, and wraps naturally on phones. Single-service guides and cases return directly to that service; combined cases retain the project collection. A compact linked sentence after the opening paragraph provides the service and enquiry next step. Service pages group their actual child services, projects and guides in open columns before the existing enquiry action, without another full-height section or promotional heading. Existing body and utility typography, colours, page gutters and focus treatment are reused; no new palette, font or motion.

Runtime ownership: content/service-navigation.mjs defines explicit bilingual relationships; tools/build-service-navigation.mjs applies them after locale generation and before machine-data/feed synchronization. service-navigation.css is merged into the existing page-owned fingerprinted style layer (or supplies that small layer for guides/directories), never inflating the shared stylesheet. Keep at most two stylesheet requests, each shared bundle below 85KB, total below 90KB; service layout plus navigation may use up to 5KB, other page layers remain below 4KB. Analytics uses the existing single click listener; breadcrumb clicks are navigation, not leads.

## Do's and Don'ts

Do use one primary keyword cluster per route, visible factual scope, and links that lead to the next relevant service. Do not promise emergency response, insurance outcomes, a warranty, or a specific repair result without confirmed business evidence. Do not treat a symptom as a diagnosis. Do not make a legal or privacy page carry a marketing-sized hero.

## Approved service and layout direction — 2026-10-08

Write as the service provider: explain what we inspect, repair and maintain. Each FAQ answers its own question and its JSON-LD mirrors the visible answer. Request supporting business materials when adding price, review, credential or warranty details. Urgent enquiries are prioritised; attendance is arranged promptly when weather, site access and safety conditions allow.

Homepage sequence: brand hero, four-image real project sequence, complete nine-service grid, enquiry preparation and company details. Service pages use a compact image hero, scope, open work columns, method detail where relevant, real photos, specific FAQs and contextual service/project links. Preserve original resources and avoid empty grid cells or oversized single-sentence sections.

Phone layouts keep at least 20px side gutters. A stable header must not obscure anchors or focus. Social platform icons remain 1em high and wrap with their text. Use native links, disclosure controls, visible keyboard focus, reduced-motion support and readable scrollbars. Validate the source publication allowlist separately from the visual layout.

## Photo and editorial refinements — 2026-10-08

Evidence photographs retain their complete composition: rendered height must not inherit a fixed HTML height attribute. Use contain inside the gallery's uniform 4:3 frames; use natural aspect ratio for editorial photographs, with a bounded display height. Eight gallery entries form four columns on desktop, two on tablet and one on phones, using identical image/copy wrappers and labels. In two-column service grids, an odd final entry spans both columns rather than leaving an empty cell.

News articles use one 840px reading column, topic-specific headings, substantial explanatory paragraphs and contextual service links. Avoid disconnected full-screen sections containing a single generic sentence. Related-service sections and standalone narrow content share the same page gutters.

## Project desktop layout correction — 2026-10-09

Project routes use their own shared layout in refinement.css: one keyword-led image hero, a two-column story on desktop, a consistently framed photo sequence, then a full-width related-services section. Never place a three-column card grid inside the half-width generic `.grid` layout. Four-image records use two equal columns; five-image sequences use a full-width opening photograph followed by two balanced rows. At phone widths, stories, photographs and service cards become a single column. Existing palette, typography and radius tokens remain unchanged.

User-approved image alignment correction: repeated photo collections use equal 4:3 display frames with object-fit:cover. This intentionally crops differing portrait/landscape compositions without stretching pixels or replacing original assets. Same-row image tops, bottoms, widths and heights must match within 1px at desktop, tablet and phone breakpoints, including before lazy loading. This overrides the earlier contain/natural-ratio instruction for repeated image grids; standalone editorial photographs retain their original composition. The shared owner is `.aligned-photo-grid img.aligned-photo` in refinement.css, applied to all project, service evidence, homepage and gallery photo collections by the final build pass.

## About company narrative — approved revision 2026-10-15

About introduces Ellis Services Group as the company behind Perth Roof Care, then immediately presents Company registration in a purposeful neutral panel marked by the existing amber rule. The stable `#business-registration` destination contains the legal company name, ABN, ACN and official ABR link, with the explicit boundary that registration does not establish trade licensing or insurance. Roof assessment and written quotes follows as three concrete working steps; a short Roof repair and drainage services overview ends with one Services link. No service catalogue, slogan, seal or project gallery belongs on this page. Sections stack at 720px using existing gutters and natural height. The hero retains its assessment action without a shared inspection billing notice. About alone omits the pre-footer contact band; the actual shared footer remains intact. Runtime ownership remains content/about-company.mjs and the About-only about-company.css, consuming the canonical refinement.css palette and fonts.

## Compact openings and early assessment — 2026-10-15

Browser-review refinement: About's working process uses a full-width heading above three balanced desktop step columns: Property and access details, Roof assessment, and Written repair quote. The short capability overview is a compact heading/text row. Both stack naturally at 720px; no tall empty heading rail remains. The shared index-hero image explicitly clears inherited minimum height so its 180px phone maximum takes effect.

Services, Gallery and FAQ use the shared `.index-hero` refinement rules: natural height, a restrained heading scale and reduced spacing so the following choices are visible sooner. FAQ uses the heading Roof repair FAQs; useful Perth metadata remains. Its existing photograph retains its proportions. Home keeps the original roof photograph and charcoal overlay, a restrained heading, and one assessment link beside Call. Home's company evidence link targets About's registration panel directly. Every service hero has one assessment shortcut plus the existing final enquiry action, without repeated inspection billing. These actions are owned by content/service-structure.mjs so its final content pass preserves them. No palette, font or viewport-height changes are introduced.

Gallery's opening uses Roof repair projects and one concise introduction with the original project period inline. The project grid follows immediately, with the scope disclaimer below the collection; do not reintroduce a repeated collection heading or a separate date band. News also reuses `.index-hero` with Roof repair guides as its human heading. Both preserve SEO metadata, all record summaries, photographs, dates, URLs and IDs. These final directory refinements are owned by content/editorial-composition.mjs and require no additional shared CSS.

Final first-screen spacing: the existing topic-rail index hero uses 16–20px vertical padding and the following section starts with an 8px gap. At 1280px this removes 60.8px from Gallery's opening/grid spacing, allowing the first full project title into a 720px desktop viewport. These values remain in the existing refinement.css owners; cards, photographs and content stay unchanged.

All 22 service routes use the concise core names in content/service-labels.mjs for navigation, service cards, H1, hero eyebrow, breadcrumbs and Service schema names. SEO titles retain one useful Perth; real geographic facts, branded Perth Roof Care and geographic project, guide and area titles retain their place names. The final label pass follows declarative rewriting and precedes knowledge/schema synchronisation.

## Bilingual service access — approved 2026-10-16

All 69 English routes have a Simplified Chinese counterpart at `/zh/`. The shared header places 中文服务 or English after Contact and before the enquiry action; it uses existing navigation link and focus styling. Chinese typography is owned by the locale selector in refinement.css: Arial with Microsoft YaHei, PingFang SC, Noto Sans SC and sans-serif fallbacks, 1.7 body line height and normal heading/label letter spacing. Existing palette, page gutters, service disclosure and route-specific About/Contact layers remain the shared owners. Form feedback follows the document locale through site.js; required fields, consent, API and input retention follow the existing enquiry contract. site.js temporarily reserves the submit button's measured inline size during sending to keep feedback stable.

English generation remains the maintained content source. Run `node tools/translation-catalog.mjs --batch-size 180` after English regeneration to extract only English routes, review the finite batch dictionaries in content/i18n/zh, then run the normal build. tools/build-locales.mjs rejects missing translations before writing pages and derives Chinese feeds, sitemap entries and noindex 404 documents. Root /zh is a build artifact; do not hand-edit it. Shared assets and /api/enquiry never receive a locale prefix. No browser-language redirects or stored language preference are introduced.

## Homepage company reviews — approved 2026-10-16

The homepage keeps its original hero and nine-service grid, then presents Google reviews as compact text cards instead of repeating the company identity panel. The four-photograph fastener sequence belongs in its existing project record, whose five gallery photographs remain unchanged. Home alone also omits the redundant pre-footer contact band; the shared footer stays intact. This supersedes the earlier homepage sequence direction, not the service or project layouts.

Ten user-supplied company-wide service reviews retain exact authors, five-star ratings and original quotations; do not imply roof-only or Perth-only experience, a live Google connection, a verified aggregate score or rating structured data. Chinese cards clearly mark translations and expose English originals with native details. Initials are text, not invented customer portraits. Relative screenshot dates are omitted; the supplied absolute 9 March 2023 date is preserved.

The signature is the existing amber top rule on quiet white review cards, with charcoal body text and dark-ochre stars/controls. Three cards display on desktop, one below 700px; all ten remain readable without JavaScript. Native previous, pause/play and next controls retain visible focus and 44px minimum targets. Rotation advances every seven seconds, stops on hover/focus, respects document visibility and is disabled under reduced motion. Natural text height avoids fixed empty panels. Runtime ownership is content/home-reviews.mjs, the review branch in site.js, and the homepage-only home-reviews.css fingerprinted layer. All values consume the existing refinement.css palette; the shared CSS bundle is unchanged.

## Contact enquiry flow — 2026-10-14

Contact serves Perth property owners arranging roof or drainage assessment. A concise service introduction leads into a charcoal phone, email and office band with one compact hours row. This horizontal band is the route's signature; a centred 760px form below it removes the unbalanced short information rail. Name and phone share a desktop row; email spans the next row so the odd field leaves no empty cell. Message, privacy, live feedback and submit action span the form. At 720px, contact details and fields become one column with existing page gutters and natural document scrolling. Preserve form hooks, labels, keyboard focus, safe optional photo guidance without repeated billing at booking and submit. The route remains flat with existing colour/type tokens and no new motion or fixed heights. Runtime ownership is Contact-only contact-layout.css, scoped to `.contact-page`; content/contact-layout.mjs runs after declarative content and before knowledge/schema synchronisation. Shared area enquiry styling and all form/API behaviour retain their current owners.

## Consolidated service flow — 2026-10-14

### Service whitespace correction — 2026-10-20

Use the full existing 1120px service container instead of leaving an 82ch body stranded on its left. Above 980px, solutions with detailed guidance place steps and scope on the left, disclosures on the right, and reading/related-service links below across the width. At 980px and below the unchanged DOM order returns to one natural column. Services without guidance remain full-width single flow. Section padding is clamp(1.5rem,2.5vw,2rem), not up to56px per edge. No invented filler, fixed text heights, removed copy or reordered source markup. Existing gallery geometry and original homepage remain unchanged. service-layout.css owns the correction for all22 services in both languages. Its route layer ceiling is now5.5KB (actual about5.27KB including navigation); totalCSS remains below90KB and two requests. This narrowly supersedes the earlier5KB service-layer ceiling, not ordinary route budgets.

This approved direction supersedes the earlier service brief/sidebar and scattered detail bands. Each of the 22 services has a compact existing image hero followed by Service content, Our solution and, only where matching photographic records exist, Our work. Service content names the components and decision; three ordered steps describe assessment, agreed repair/preparation and completion checks. Short service guidance and further-reading links sit within the solution. One final assessment action carries concise safe-photo guidance. Downpipe repairs, commercial repairs, restoration and repair options have no invented work gallery.

The visual signature is the transition from a narrow, open repair narrative to the wider real-photo record. The existing amber rule marks a scope boundary; the photographs keep truthful stage captions and uniform 4:3 frames. Six-photo records use three columns, four-photo records two, and single records retain a bounded width. Layouts become two columns at 720px and one at 480px, with natural page height and existing mobile gutters. No palette, font or shared navigation changes are introduced.

`content/service-structure.mjs` is the final service consolidation owner after historical content/declarative passes and before service-label and knowledge/schema synchronisation. Route decisions live in `content/service-structure-data.mjs`; full educational bodies remain owned by `content/keyword-map-content.mjs`, linked from their original services into relevant existing guide sections. Their original anchors remain meaningful. The route-only `service-layout.css` consumes the canonical refinement tokens without redefining them and is delivered as one small fingerprinted layer. Homepage and Services retain introduction, core navigation, real evidence and a short contact action; other page purposes retain their own composition.
# Copy cleanup — 17 October 2026

Company registration retains the ABN, ACN and official register link without a repeated licence/insurance disclaimer. Service, case and guide content omits redundant project-proof and generic defensive commentary. Accurate construction-stage descriptions, technical diagnosis, safety, access, approval and written terms remain. The final English sweep runs before knowledge/schema synchronization and Chinese localization, so both languages and feeds share the same edited content.

## FAQ search and topic navigation — selected revision 2026-10-21

User selected the first displayed concept's horizontal search/topic layout with the third concept's panoramic roof photo fading to white toward the left. FAQ alone uses faq-navigation.css merged into its existing page layer, and faq.js as progressive enhancement. Existing original photo/logo, bilingual H1,49 answers, schema and route IDs remain. Related services are compact opening links. Desktop categories wrap; at480px and below a visible native select replaces the category list only when JS is active. Without JS all categories/anchors remain visible and the nonfunctional search is hidden. Search matches the visible questions and answers locally; no server request or enquiry submission.

FAQ's functional search, navigation and responsive image treatment use a route layer ceiling5500 bytes, matching the existing service-layout ceiling; all other directory ceilings4000 and shared85000/combined90000 ceilings remain. At most two stylesheets per page. This supersedes the earlier FAQ four-button presentation; it does not change other pages.

## FAQ selected sidebar layout — user screenshot correction, 2026-10-21

The user's explicit screenshot supersedes the preceding horizontal-topic interpretation. FAQ uses a full-width search above a two-column workspace: sticky270px topic/service sidebar,32px gap and flexible answers. First disclosure opens initially; native details semantics remain and official locally hosted Heroicons supply plus/minus/search/chevron visuals. At640px and below the workspace stacks and uses the existing native category selector. The original photo retains only the requested left-fading mask. No change to49 answers, H1, URLs or business/schema facts. Existing5500-byte FAQ layer and90000-byte combined ceilings stay enforced; initial over-budget CSS was reduced, not waived.

Site-wide UI maintenance extends the same readable navigation language to long News guides: a 240px sticky contents rail sits beside the article on desktop, while the existing portrait editorial photograph keeps its full composition beside the first section. At900px and below the contents rail returns to document flow and the photograph becomes a separate bounded block. News and service-area directories use natural card heights and real section anchors; mobile service/FAQ content navigation stays visible independently of the collapsed header menu. These refinements do not change article text, headings, URLs, assets or machine-readable content.

Guide contents remain in normal document flow until reaching the bottom edge of the sticky site header, then follow the reader within the article boundary. Measure the real header height with ResizeObserver rather than adding a fixed desktop gap; keep phone/tablet single-column behavior at900px and below. Reuse that measured height for chapter anchor clearance.

Latest user alignment correction: the guide contents rail starts level with the entire article opening, including its breadcrumb/title area, rather than the first body section. The desktop workspace has an introduction and reading body in the right column, while the sticky rail spans both rows on the left. On phones the introduction, contents and body retain their original document order.

## Site UI maintenance — 2026-10-21

The existing field-brief identity and approved FAQ sidebar remain. A scoped audit restores body-related navigation on phones in service-layout.css and FAQ's page layer; these nav elements must not inherit the header's collapsed state. Service links wrap and provide44px targets.

Guide articles use a240px outline beside the readable body in a1120px container, owned by tools/build-ui-layout.mjs and ui-guides.css. Original headings, anchors, prose, images and machine data stay; at900px and below the outline becomes a bounded210px scroll region with a visible scrollbar. Photos retain natural proportions at restrained heights. Sticky guide and FAQ offsets are136px where the desktop header can wrap; FAQ tablet offset96px clears the77px mobile header.

ui-directories.css owns the existing News and service-area collections: compact spacing, four real News topic anchors, a single-guide group occupying its row, and area cards without the18rem minimum. These layers join the existing fingerprinted page stylesheet; no per-page CSS request or budget increase. Homepage, gallery, about, contact, area detail and project design stay unchanged. The added site-ui-review test normalizes only explicit new UI wrappers/navigation and preserves the prior138-page content baseline.
