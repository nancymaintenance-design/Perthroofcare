# Perth Roof Care SEO validation record

Validated on: 2026-09-30
Branch: `seo/perth-roof-care-core-pages-20260930`
Release state: **not deployed or submitted from this task**.

## Scope and evidence boundaries

The supplied historic Search Console snapshot covered 7–27 September 2026: 2,220 impressions, 4 clicks, 0.2% CTR and average position 83.5. It also reported 29 indexed URLs and 2 excluded URLs (one redirect and one discovered-not-indexed) and said that the sitemap had been read on 25 September with 32 URLs. The exact excluded URLs, URL-inspection results, current performance, crawl statistics and Core Web Vitals field data were not supplied and were not inferred.

The current generated sitemap contains 55 URLs. A larger current sitemap is not proof of indexing or ranking. The URL-level follow-up file is [gsc-followup.csv](gsc-followup.csv); all Search Console submission and inspection fields remain `not performed` / `pending release`.

## Automated build and content checks

Run from the repository worktree:

```powershell
npm test
```

Expected checks include generated routes, canonical tags, robots metadata, visible primary headings, distinct owner-page scope, internal HTML links, service-specific FAQs, article-to-service links and sitemap audit utility behaviour. Record the fresh final command output and test count below when preparing a release.

Fresh result on 2026-09-30: the production build completed and the Node test runner reported **35 passed, 0 failed**. The added checks parse the homepage identity graph, confirm no founding date is emitted, check the `llms.txt` boundaries, and require the service-page FAQ JSON-LD to have the same three questions as the visible FAQ.

## Sitemap and live technical audit

Run:

```powershell
node scripts/audit-sitemap.mjs --root . --live --output docs/seo/perth-roof-care/url-audit.csv
```

The resulting [url-audit.csv](url-audit.csv) records each sitemap URL separately from index status:

- generated local route status and canonical,
- live HTTP status and redirect location,
- live canonical,
- meta robots,
- `X-Robots-Tag`, and
- `gsc_status`, which remains `unknown` until an owner-authorised Search Console review occurs.

The 2026-09-30 live read-only run returned 55/55 `200` responses for the www sitemap URLs, with no canonical, meta-robots or `X-Robots-Tag` exception recorded. This confirms only the technical response observed at that time; it does not confirm indexing, ranking, or that local content edits are already live.

## Manual route/response checks

- Local normal page response: `200` at `/`.
- Local missing-route response: `404` at a deliberately missing path.
- Live www homepage: `200` at `https://www.perthroofcare.com.au/`.
- Live www missing-route response: `404` at `https://www.perthroofcare.com.au/__seo-validation-missing__/`.
- Live non-www formal domain: `308` redirect to `https://www.perthroofcare.com.au/`.
- No contact form was submitted. Form validation must use a clearly invalid test value that is expected to produce a safe `4xx/5xx` response and must never enter a real recipient workflow.

## Responsive visual acceptance

The local homepage was checked at a 390 × 844 mobile override: the document width was 380 px with no horizontal overflow; 38 visible links and the `ROOF REPAIRS PERTH.` H1 were present. The local flashing article was checked at the default desktop viewport (1270 px client width): no horizontal overflow was present and its visible internal links included `/flashing-repairs/` and `/roof-leak-repairs/`.

The remaining owner URLs still require a reviewer’s release-time visual pass for their H1, service-card links, FAQ controls, images and enquiry module. This record deliberately does not claim that one representative mobile/desktop check proves every viewport or every route.

## Post-release protocol (not performed)

1. Record the actual release timestamp and commit in [gsc-followup.csv](gsc-followup.csv).
2. Confirm the deployed sitemap URL and canonical response.
3. With owner authorisation, inspect only the priority URLs in Search Console and document the status exactly as returned.
4. Review impressions, clicks, CTR, average position, indexed status and crawl errors at +7, +14, +28 and +56 days, separating comparable full periods from partial windows.
5. Investigate overlap only if query/page data identifies competing URLs. Do not use redirects, canonical changes or content consolidation without evidence and approval.
