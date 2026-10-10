---
version: alpha
colors:
  paper: "#ffffff"
  ink: "#242424"
  primary: "#f2b544"
  eucalyptus: "#705015"
  wash: "#f3f3f1"
  line: "#d8d8d3"
typography:
  display:
    fontFamily: "Arial Narrow, Arial, sans-serif"
  body:
    fontFamily: "Arial, sans-serif"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace"
rounded:
  DEFAULT: "18px"
spacing:
  pageGutter: "clamp(20px, 4vw, 64px)"
  section: "clamp(2.5rem, 5vw, 5rem)"
components:
  serviceMenu:
    width: "min(56rem, calc(100vw - 32px))"
  primaryCta:
    minHeight: "48px"
---

## Overview

Ellis Services Group is a practical Perth roof-repair service site. Its public pages should feel like a concise field brief: a visitor identifies the roof detail, understands the relevant repair topic, then makes direct contact. The register is brand-led but restrained. The site should never feel like a generic article library, a giant sales page, or a keyword catalogue.

## Colors

Use pure white for reading, charcoal for text, enquiry bands and the footer, and amber for primary actions and the small roofline motif. Light neutral grey separates article and service collections. Amber buttons use charcoal text; small links and labels on white use dark ochre, never low-contrast yellow. The legacy eucalyptus/clay tokens now alias the accessible dark-ochre text role, not the action fill. Runtime ownership remains refinement.css, loaded after site.css and brand-hero.css; responsive-images.css changes image sources only. The hero uses one neutral charcoal overlay for contrast. Original logo artwork, platform icons and photograph colors are preserved.

Token mapping (runtime-canonical model): `paper → --porcelain/--paper`; `ink → --ink/--coastal-ink/--night`; `primary → --accent` (button, roofline and dark-surface label); `eucalyptus → --clay/--eucalyptus` (light-surface links and labels); `wash → --sand/--sky-wash`; `line → --sand-line`. Hover and active amber are `--accent-hover:#e6a62e` and `--accent-active:#d99a24`. The shared refinement layer owns legacy selector adaptation so the approved palette survives regeneration without altering content or layout.

## Typography

Display type is compact and forceful for one service keyword-led heading per route. Body copy remains sentence case and narrow enough for fast scanning. Mono type is reserved for small service labels and factual metadata.

## Layout

Desktop content has deliberate side gutters and a maximum readable width. The primary content pattern is: concise topic rail, answer-first service summary, a limited number of useful modules, related services, and a direct enquiry path. Pages should not include consecutive generic panels simply to make them longer.

## Elevation & Depth

Static content remains flat. Borders and quiet background changes separate groups. Dropdowns alone may use a restrained shadow because they float above the page.

## Shapes

Cards use 18px rounded rectangles and buttons use 12px corners. Text-based work categories use open columns and dividing lines rather than another card grid. The signature motif is a small roof-ridge outline beside selected section labels, paired with actual project photographs.

## Components

The service dropdown is a viewport-contained navigation surface. It must align to the open trigger, stay inside both side edges, and scroll within its own maximum height rather than extending below or beyond the browser viewport.

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
