# Perth Office Map Design

## Goal

Add one office-location section at the bottom of the homepage, before the existing contact band and footer, so visitors can identify the confirmed Perth office address and open it in Google Maps.

## Confirmed inputs

- Business: Ellis Services Group / Perth Roof Care.
- Address: `140 St Georges Terrace, Perth WA 6000, Australia`.
- Reference layout: heading, address, short visit note, embedded map, and a link that opens the location in Google Maps.
- Source link: the user-supplied Google Maps Place URL for 140 St Georges Terrace.
- Scope: local preview only; do not publish or modify Vercel, DNS, or other production state.

## Design

`build.mjs` is the source of generated route HTML. It will add a single semantic `<section class="office-location">` to the home route, immediately before its closing `</main>`. The section has a `data-office-location` marker, an eyebrow, the H2 “Visit our Perth office”, the fully formatted address, a short appointment-first visit note, a titled Google Maps iframe, and an external “Open in Google Maps” link. The iframe uses the stable address-query embed URL; the user-supplied Place URL remains the external destination.

`site.css` will own only the new component's layout: a bordered map frame with a 16:9 aspect ratio, full-width iframe, and responsive spacing consistent with the existing paper, eucalyptus, and sand-line design system. It must not change existing homepage sections, contact forms, or the global footer.

`static-smoke.test.mjs` will assert the section's page placement, accessible iframe title, confirmed address, exact embed intent, external-map link, and that no other route gains the homepage-only marker. It will also assert the minimal responsive frame CSS contract.

## Constraints

- Do not edit generated `index.html` or `public/` directly; run the build to regenerate them.
- Keep the address consistent with the existing confirmed contact facts.
- No API key, tracking script, form change, or external service configuration.
- Do not publish. The user will inspect the local preview before any request to synchronize online.

## Validation

Run the focused smoke test after the source change, then `npm test` (which invokes `vercel-build.mjs` and the full static test suite). Start the existing local server only after the test suite is green, and check the homepage returns HTTP 200 on the local port.
