# Perth Roof Care core-page SEO change log

Date: 2026-09-30
Branch: `seo/perth-roof-care-core-pages-20260930`
Scope: existing URLs only; no new SEO landing-page expansion.

## Identity and content guardrails

- Public site identity retained: **Ellis Services Group**. The working label in this audit is the repository/project label, not a replacement public brand.
- No public phone, email, address, licences, insurance, warranty, pricing, review, completion, emergency-response or locality claim was added or changed.
- Existing images and documented project records remain the only case-study material used. No unsupported before/after, date, author or outcome claim was introduced.
- This work does not change URLs, redirects, canonical strategy, global header/footer navigation, robots policy or contact-form submission behaviour.

## URL-by-URL implementation record

| URL | Search role and main topic | Concrete changes |
| --- | --- | --- |
| `/` | Broad entry for `roof repairs Perth` | Expanded the visible service-routing section to distinguish roof repair, leaks, tile, metal, ridge, flashing and roof-drainage enquiries; retained enquiry and project routes. |
| `/roof-repairs/` | Diagnostic roof-repairs hub | Clarified repair-assessment role, repair-vs-replacement discussion, FAQ, and linked to leak, tile, metal, flashing and drainage services. |
| `/roof-leak-repairs/` | Commercial roof-leak service page | Kept the page focused on observed water symptoms, investigation of the water path and safe enquiry preparation; retained links to inspection, flashing and the existing documented project. |
| `/flashing-repairs/` | Commercial flashing and valley repair page | Clarified junction locations and assessment factors; added an explanatory article path plus leak and tile-repair routes. |
| `/gutters-downpipes/` | Combined roof-drainage service | Replaced generic wording with a roof-drainage system scope, visible outlet/overflow discussion, service-specific FAQ and the existing WA 6121 project link. |
| `/downpipe-repairs/` | Downpipe-specific commercial page | Added a distinct scope for visible pipe lengths, brackets, joints, bends and lower connections. It expressly excludes underground stormwater work, so it does not promise a service that has not been verified. |
| `/news/roof-flashing-explained/` | Informational support article | Rewrote as a short explanatory guide: what flashing does, what a property owner can safely note and when to discuss repair. It now links naturally to flashing repair, leak repair and contact. |

## Internal-link policy implemented

The pages above use descriptive, crawlable HTML links. Commercial pages route to the closest complementary service; the informational flashing article routes to the relevant commercial services only after answering its informational question. The service hierarchy is intentionally limited to avoid a sitewide list of unrelated keyword links.

The detailed owner, intent and internal-link map is in [intent-map.csv](intent-map.csv). It keeps `/gutters-downpipes/` and `/downpipe-repairs/` as separate intents rather than treating them as duplicate pages.

## Structured data and feed guardrail

The homepage now emits one linked `LocalBusiness`, `WebSite` and `WebPage` JSON-LD graph using only the public name, canonical URL, phone, email and address already visible on the site. The unverified founding date that had been generated previously was removed. Each priority service page now emits `WebPage`, `Service`, `FAQPage` and `BreadcrumbList` entries; the FAQ answers are exactly the visible answers on that page.

The generated site also publishes `/llms.txt`, a plain-text guide to the public identity, key service URLs and content boundaries. It is not cloaked content, a ranking guarantee or a substitute for visible HTML. This change does not add synthetic reviews, ratings, author biographies, dates, service areas, emergency availability or other evidence that has not been supplied. Any future schema expansion must be based on owner-approved business facts and tested in a structured-data validator before release.

## Rollback

No production release was made. Before any release, retain this branch and review the rendered pages. If a reviewed, deployed commit needs reversal, use a targeted `git revert <release-commit>` in the release workflow; do not delete the canonical URLs or use a blanket reset. The audit and GSC review plan are intentionally retained so results can be compared after a verified release date is recorded.
