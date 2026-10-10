# Perth Roof Care UI refresh and service expansion

## Purpose

Make Perth Roof Care feel like a focused Perth roofing service rather than a generic information site. The visual system must support a direct path from a recognised roof issue to a relevant service, documented work and an enquiry. Existing public pages, images, routes, SEO content and machine-readable assets remain available; this release adds or reorganises presentation only.

## Confirmed requirements

- Add the supplied Facebook destination beside the existing Instagram link in the global footer:
  `https://share.google/FPWKvdrPRx3yeK9gp`.
- Simplify the home hero to one photographic image with one readable left-to-right tonal overlay. No stacked masks or separate translucent image layers.
- Complete the home service grid with two genuine service routes: **Roof Cleaning & Painting** and **Commercial Roof Repairs**.
- Change square cards to rounded landscape cards throughout the site.
- Replace the current green-heavy UI with a new whole-site system, retaining every existing resource and route.
- Publish only after the user approves a local preview. No production deployment is part of this change.

## Audience and primary job

The audience is a Perth property owner or manager who has noticed a roof, gutter, drainage, storm or exterior-maintenance issue. The page’s primary job is to let that visitor identify the service, see that Ellis Services Group performs the work, then contact the team.

## Visual direction

### Palette

| Token | Value | Use |
| --- | --- | --- |
| `--ink` | `#1C2427` | Headings, navigation and dark panels |
| `--slate` | `#39494E` | Secondary dark surfaces and footer |
| `--roof-grey` | `#717B7E` | Rules, icon details and supporting labels |
| `--sand` | `#E9E1D2` | Warm page background and card borders |
| `--porcelain` | `#F8F6F1` | Card and content surfaces |
| `--clay` | `#B45D3C` | One purposeful accent for calls to action and focus states |

The system deliberately avoids the current pale green wash. It uses roof metal, masonry and graphite cues, so the palette is specific to the work shown in the supplied photography rather than a generic trade template.

### Typography and layout

- Keep the existing type stack unless the current build already loads a different production-safe font.
- Use the display face only for page and section headings; body copy remains compact and highly legible.
- Use a 1280px maximum content frame, generous vertical rhythm, and a fine horizontal “roofline” rule as the recurring structural motif.
- Use cards as rounded rectangles (`18px` desktop, `14px` mobile), with a 3:2 to 16:10 visual proportion rather than square tiles.

### Signature element

Every primary section begins with a narrow roofline rule: a dark stroke with a small clay connection point. It encodes the idea of connected roof components (ridge, valley, flashing and drainage) without adding decorative clutter.

## Homepage composition

1. **Hero:** single background photo; one `linear-gradient` reading field from charcoal at the left to transparent at the right. The headline, supporting paragraph and enquiry button sit over that field.
2. **Nine-service grid:** a full 3 × 3 grid at desktop, reducing to two and one columns responsively. Every tile has one service, one concise explanation and one canonical route.
3. **Documented work:** retain the existing project proof and photography, but place it in a rounded split card.
4. **Enquiry preparation:** retain the existing three prompts in a balanced three-card row with the same card language.
5. **Company relationship:** retain the Ellis Services Group ownership statement and address as a quieter credibility band.

## New service routes and internal linking

### `/roof-cleaning-painting/`

- Purpose: roof cleaning and roof painting / coating enquiries.
- Content: surface condition, moss/lichen/dirt, coating appearance, preparation, adjacent gutters/downpipes and suitable photo details.
- Related links: roof maintenance, tile roof repairs, metal roof repairs, roof restoration, gutter repairs, contact.
- Include canonical metadata, LocalBusiness/Service schema following the existing service template, sitemap inclusion and footer/service-menu visibility.

### `/commercial-roof-repairs/`

- Purpose: commercial roof repair enquiries for business premises, warehouses, strata/common-property contexts and larger roof areas.
- Content: metal sheets, roof penetrations, gutters, box gutters, flashings, drainage paths, access planning and staged repair scope.
- Related links: metal roof repairs, roof leak repairs, flashing repairs, gutter repairs, storm damage repairs, contact.
- Include canonical metadata, Service schema, sitemap inclusion and footer/service-menu visibility.

Neither page will invent qualifications, pricing, warranty, licensing or outcome claims. They will describe the service Ellis Services Group provides and direct users to discuss a property-specific scope.

## Shared components

- **Header and service menu:** move to the new neutral palette and add both new services in an appropriate services group.
- **Cards:** create a shared visual treatment for `.card`, project cards, area cards and form-support cards. Do not remove content inside existing cards.
- **Footer social row:** keep Instagram and add Facebook as side-by-side, keyboard-accessible external links with matching icon/text alignment and `rel="noopener noreferrer"`.
- **Buttons and focus states:** use clay accent with dark text where contrast permits; retain visibly distinct keyboard focus states.
- **Responsive behavior:** services grid becomes 2 columns below tablet and 1 column on narrow phones; the hero uses a darker vertical version of the same single overlay only at mobile to keep text legible.

## FAQ, articles and machine-readable feeds

The existing FAQ and roof-repair guide content remains public, crawlable and linked. This release expands the existing machine-readable layer using the valid parts of the supplied reference formats:

- Keep one canonical JSON Feed at `/news/feed.json` for published roof-repair guide records, with feed title, home page URL, feed URL, item IDs, canonical URLs, titles, summaries and publication dates sourced from the site’s existing article data.
- Add an explicit `<link rel="alternate" type="application/feed+json">` discovery link to the news index and to relevant article pages. Retain the existing RSS feed alongside it rather than replacing it.
- Embed a small `application/json` **site knowledge** block only where it maps directly to visible page facts: public brand name, operator, canonical URL, service area, page type, and links to related services. The block is not visually rendered, but it contains no hidden keywords and does not contradict on-page copy.
- Extend page JSON-LD with only applicable schema types: `LocalBusiness` / `Organization`, `WebSite`, `WebPage`, `Service`, `Article` and `FAQPage`. FAQPage questions and answers must exactly match visible FAQ content.
- Add the Facebook URL as `sameAs` only after it is used in the visible global footer.

`Product`, `Offer`, `AggregateRating`, `Review`, price, inventory, warranty, licence, certification, response-time and performance-claim fields are not populated from assumptions. When Ellis Services Group provides verifiable source material for any of them, add the supporting visible page copy first and then add the matching applicable structured-data field. Search engines and AI systems should find the same factual service information in both HTML and structured formats.

## Implementation boundaries

- Source of truth is `build.mjs`, which generates the static routes; shared styling is in `public/assets/css/site.css` and `public/assets/css/brand-hero.css`.
- Do not edit generated HTML as the source of truth.
- Do not remove URLs, site content, image assets, structured data, feed output, `llms.txt`, sitemap entries or existing project records.
- Add new canonical routes to all generation, sitemap and testing lists.
- Generate and validate `/news/feed.json`, retain `/news/feed.xml`, and ensure the HTML discovery links point to both feeds.
- Do not run a production Vercel deployment. After local build and tests, launch a local preview server only.

## Verification

- Run syntax checks and the existing test suite.
- Confirm the generated homepage has nine service cards and no empty grid cells.
- Confirm both new pages return 200 locally and appear in sitemap/navigation.
- Confirm both social links appear in generated footer markup.
- Use desktop and mobile screenshots of the local preview to check hero overlay, card radius, grid reflow and footer alignment.
- Leave the local preview process running and provide its localhost URL for user approval before any deployment.
