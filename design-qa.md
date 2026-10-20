# UI design QA — 20 October 2026

final result: passed

## Target and scope

Selected visual truth: `C:/Users/UFTR/.codex/generated_images/01a1239b-d07d-7213-ace8-fbf86ef70c74/exec-6520fa1b-ec97-4440-9aac-7f725f244139.png` — the third displayed option, not submission order.

Implementation: `http://127.0.0.1:4184/zh/`.
Evidence directory: `E:/Ellis-Services/Perth Roof Care/reports/2026-10-20-ui-design/`.
Final screenshot: `implementation-final.png`. Full simultaneous comparison: `comparison-final.png`; focused service typography/image comparison: `comparison-detail.png`. Both were opened and inspected together, not judged from paths alone.

Desktop CSS viewport: 1435 × 1096, devicePixelRatio 1. Source raster: 1435 × 1096. Browser screenshot transport returns JPEG bytes under the .png filename, final raster 1420 × 1085; comparison normalizes that transport image to 1435 × 1096. This is capture normalization, not a claim of pixel-identical matching. State: Chinese homepage, top, collapsed navigation, light theme, original published content.

This is the existing marketing website, not a new application. Preserve all nine services, reviews, original imagery, text, URLs, structured data and interaction code. The mock's altered words and image color grading are not authoritative business content. No replacement assets, fonts, routes or sections were created.

## Comparison history

1. Before implementation: hero x=0, radius=0 and enclosed 1px service cards contradicted the chosen concept. Implemented inset hero, rounded clipping and open service rows.
2. `implementation-1.png` / `comparison-1.png`: P1 service images remained about 308px tall due the existing alignment rule; P2 heading remained too large. Increased only the homepage image selector specificity, corrected the descendant selector and constrained section heading size. Project galleries remain 4:3.
3. Intermediate capture: P2 paragraph top margins created an unnecessary gap after service titles. Removed that margin, retained natural paragraph height, and adjusted readable body/heading sizes. Recaptured and compared after the fixes.
4. Final comparison: no actionable P0/P1/P2 remaining. Hero x≈35.9px, height≈428.6px, radius16px; wide service images≈410.7 × 183.3px. Reference hero height≈424px. Open rows, three aligned image columns, dividers and hierarchy follow the selected direction.

## Required fidelity surfaces

- Typography: existing Arial/Arial Narrow and Chinese system fallbacks retained; homepage H1 52px at this viewport, service heading up to48px, card titles28.8px and body18px. No clipping or fabricated text. Native font rendering/weight differs slightly from the generated mock (P3 only).
- Spacing/layout: inset hero, compact section rhythm, flat three-column services and natural-height text. Tablet two columns; phone one. No new fixed-height text panels or empty spacer sections.
- Colors/tokens: existing charcoal, white, neutral wash, amber actions and dark-ochre links. Original neutral hero overlay intentionally retained for contrast; generated mock's brighter image grading is not reproduced.
- Images: real original logo, roofer and service photographs retained, responsive source variants unchanged. Wide teaser crop is deliberate; no stretching or replacement imagery. Existing raster screenshot compression is an evidence limitation, not a modified site asset.
- Copy/content: all 138 sitemap pages have the identical non-style HTML snapshot hash before/after: `08371404c8f9ad389676ee26fce8fa0c42822b894b1e7c3e71ff25ad62936e19`. This includes text, links, image attributes, canonical/hreflang and JSON-LD. Feed/RSS/llms and content-source files have no Git changes.

## Runtime checks

IAB browser: home EN/ZH, Chinese About/Contact, English leak repairs and Services at 360/390/768/1435px: 24 checks, zero document horizontal overflows. See browser-checks.json, mobile-390.png and mobile-en-390.png. Latest CSS scrollbar addition was separately checked at desktop; it restores native width and retains configured colors.

Mobile menu opens; service submenu expands; Escape closes it. Review pause changes to play and next advances. Hero assessment action opens the Chinese Contact form; empty submit focuses Name with five invalid required fields, without sending an enquiry. Console error log empty. Existing API behavior is covered by project tests; no real email or phone call was sent. No JS interaction changes.

`npm test`: production build plus 314/314 tests pass, including UI preservation/bundling tests now included in the normal test list. Node syntax checks and git diff --check pass. Existing <85KB shared, <90KB combined, <4KB ordinary route and <5KB service route budgets pass; no third stylesheet request.

Scoped premium static audit of the two changed visual layers: zero findings. Default recursive audit was stopped after excessively scanning generated copies; it is not reported as an all-repository pass. A legacy scrollbar cross-file warning led to explicit standards width in the new common layer; computed runtime colors and width were verified. This marketing project has no separate configured typecheck/lint or product-admin contracts.

Read-only reviewer: no Critical/Important findings; minor request to include the new tests in npm test was implemented and rerun. No new contracts or broad refactor introduced.

## Handoff and limitations

Local only, branch codex/ui-polish-20261020, base d6ae315. No push, merge or production deployment. Preview remains available for owner review. Production, Safari/Firefox, real mobile hardware, full screen-reader/200% zoom matrix and live lead delivery were not newly tested; no claims about SEO performance or business uplift.

P3 follow-up: optional native-device font/photographic grading review. No blocker remains for the approved local visual handoff.
