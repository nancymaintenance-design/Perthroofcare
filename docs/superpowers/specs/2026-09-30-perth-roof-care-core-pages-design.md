# Perth Roof Care core pages — design

## Confirmed context

- Repository: `nancymaintenance-design/Perthroofcare`; production domain: `https://www.perthroofcare.com.au`.
- Public brand in the existing site is **Ellis Services Group**. This change does not replace brand, contact details, routes, images or business claims.
- Scope is the seven existing URLs named in the request. No URL migration, bulk location-page expansion, production deployment or Search Console write is part of this work.
- GSC values in the companion documentation are a user-provided historic snapshot for 7–27 September 2026, not a fresh API export or a ranking diagnosis.

## Page ownership and visitor path

`/` remains the broad Roof Repairs Perth entry point. It routes a visitor by visible symptom or roof component; it does not duplicate service-page bodies. `/roof-repairs/` remains the diagnostic hub for people who do not yet know the fault type. `/roof-leak-repairs/`, `/flashing-repairs/`, `/gutters-downpipes/` and `/downpipe-repairs/` each retain a narrow intent and an enquiry path. The flashing guide remains informational and links naturally to the flashing service.

The static generator will express these roles with unique H1/lead/scope, three scoped assessment cards, service-specific FAQs, a maximum of four relevant internal links, and existing documented evidence only where the site already has supplied material. The gutter-and-downpipe service will point to the existing documented gutter/downpipe sequence; the downpipe page will not claim a separate case.

## Safety and verification

No unverified 24/7, emergency attendance, licence, insurance, price, warranty, response-time, diagnosis or customer-outcome claim will be added. Existing contact and form behavior are preserved; form success is checked only against the isolated no-email endpoint already covered by tests. The build test suite will prove canonical URLs, index directives, key owner-page content, the service/article and gutter/downpipe links, and generated sitemap structure. A separate audit script will capture the live HTTP outcome without submitting forms.

## Delivery boundaries

Changes are made only on `seo/perth-roof-care-core-pages-20260930`. They remain local pending review; no push, PR, merge, deployment, sitemap submission, URL inspection request or external listing action occurs in this round.
