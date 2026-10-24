# Perth Roof Care — selected concept 2 UI QA, 2026-10-24

source visual truth: ../reports/2026-10-24-ui-redesign-exploration/display-2-project-photography.png

Implementation: ../reports/2026-10-24-site-ui-upgrade/service-full.png; service-desktop.png; service-detail-open.png. Full-view comparison: comparison-full.png. Focused comparisons: comparison-hero-scope.png and comparison-solution.png in the same report folder. Source and implementation were opened together in each combined comparison input.

## Dimensions and state

Source raster is 946×1663. Browser viewport is 1440×1000 CSS pixels; scrollbar leaves 1425px screenshot content width. Full implementation capture is 1425×4142, density 1. Both images were scaled proportionally to 720px wide, never stretched; the full comparison has two adjacent columns. Focused regions use the same horizontal normalization and their original aspect ratios. State: Chinese roof-repairs route, top of page; full capture after scrolling through all evidence so lazy images were loaded; an additional real-browser capture records an expanded guidance item. Source is a concept, not an existing responsive specification. Other page families and mobile states inherit its palette, photography and hierarchy.

## Binding constraints and intentional adaptations

The user explicitly requires existing copy, H1, URL and business data to remain. Therefore the concept's invented link descriptions, extra hero CTA, newly rewritten step subheadings and abbreviated enquiry are not copied. The existing four related destinations, full guidance, safety/warranty boundary, six original evidence photographs and captions, enquiry and footer remain. The implementation is longer than the concept because these existing sections cannot be deleted. The original authentic logo and all navigation labels remain, with the Perth site name added beside the operator wordmark. Typography uses installed Arial/Aptos/Chinese system fallbacks, without new font requests; desktop text remains readable at 16–18px rather than scaling text from a flattened concept raster. Hero/detail photographs are the actual corresponding site files, not recreated raster art.

## Comparison history

1. P1: legacy light scope background inherited white text. Fixed with the page-owned content-section surface; latest service-desktop/full and comparisons show charcoal with readable text.
2. P1: mobile primary menu inherited a light background under white links. Fixed shared open-menu dark surface and bounded scroll. mobile-menu-open.png and actual last-service navigation verify usability at 320px.
3. P1: FAQ hero inherited white background under white headings. Fixed the precise hero selector. faq-desktop.png and overview-phone.png verify both layouts.
4. P2: old homepage container inherited hero min-height, adding excess vertical space and centring the text. Reset container min-height/margins and old duplicate overlays; final home-desktop/phone show left-aligned copy and the finished metal roof.
5. P2: desktop header site name wrapped, and mobile brand consumed menu space. Corrected desktop grid and nowrap; phone shows the authentic logo and Perth site name while keeping the original operator text in the accessible DOM. 320/390/1024/1440 checks pass.
6. P2: related-service chevron lacked contrast on charcoal. Reused existing SVG with a light filter; latest comparison shows visible chevrons. No new hand-drawn assets.
7. P2: new layers exceeded stylesheet budgets. Removed only reviewed retired CSS families absent from all pages and runtime JS; moved About/Contact overrides back to their owners, trimmed redundant declarations. No ceiling was raised; all 138 budgets and tests pass.

## Final assessment

- Fonts: forceful compact H1, sentence-case body, natural Chinese wrapping; no clipping on 320/390/1024/1440 samples. Original 1854 headings/summary labels retained.
- Layout: photograph-led hero; sticky light outline; dark two-column scope and related-service rows; chalk photo/solution section; original galleries and dark enquiry/footer. Tablet and phone flow in one column where needed. Directory, FAQ, guides, company/contact and legal pages use the same shared language without stripping their content.
- Colors/tokens: charcoal #202321, chalk #f4f1e9, amber #f2b544, neutral separators; DESIGN frontmatter matches current runtime tokens. Dark/light inherited-contrast defects above have been corrected.
- Assets: authentic logo, existing SVG icons and real site photos. Five home thumbnails and home background replaced as requested; service evidence and captions preserved. Original portrait/composite evidence uses contain treatment where required. Full service screenshot has no pending or broken images.
- Interactions: FAQ bilingual search/no-results/clear and categories; 320px category selector; desktop/mobile service menus; Escape focus restoration; same-route locale switch; review pause/next/previous; sticky service outline; guide TOC initially level with introduction and sticking below the header. Contact was inspected without submitting.
- Runtime: 138 routes at 1440px and 390px, plus twenty 1024/320px family checks: no page overflow or loaded-image failures. Console errors/warnings checked: none captured. Full HTTP checks: 138 pages, 10 CSS, 9 public documents. 341 project tests pass.
- Static tool limitations: premium-audit.json retains six known cross-file false positives; premium-audit-review.md documents runtime evidence. This is not a claim that the raw strict auditor returned clean.

## Open questions / follow-up polish

No actionable P0/P1/P2 remains. Optional P3: later approval could refine the exact photograph crop or use a licensed display typeface, but no additional dependency is introduced now. No production form was sent, no external enquiry was made, and no deployment occurred. This is browser QA, not a formal exhaustive accessibility certification.

final result: passed


## Latest scoped revision: Contact compact layout, 2026-10-24

The owner rejected the Contact form's scale and lateral whitespace. This supersedes the earlier Contact acceptance above. Source and implementation comparison, twelve responsive cases, field sizing, keyboard checks and the final pass are recorded in ../reports/2026-10-24-contact-layout-refinement/design-qa.md. Original non-style HTML and all form handlers remain unchanged; all 341 tests pass.

final result: passed
