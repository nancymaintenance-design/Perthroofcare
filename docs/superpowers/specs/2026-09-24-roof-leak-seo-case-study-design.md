# Roof Leak SEO Case Study Design

## Purpose

Increase the relevance and trustworthiness of the site for the Perth roof-leak intent cluster, led by a documented Ellis Services Group metal-roof repair project. The outcome is a stronger service path to a usable enquiry, not a promise of a particular ranking, repair outcome, price, warranty, licence or insurance cover.

## Evidence and priorities

The supplied Google Search Console screenshot covers the selected 28-day window and reports 1,800 impressions, 4 clicks, a 0.2% CTR and an average position of 83.1. The visible queries include `roof leak repairs perth` (215 impressions and 0 clicks) and `perth leaking roof repairs` (192 impressions and 0 clicks). This establishes roof-leak repair as the first content cluster, but does not establish a causal ranking explanation or a guaranteed result.

The supplied first-party project evidence is a metal-roof repair at 160-154 Heath Road, Roleystone WA 6111. The public case study must use only `Roleystone, WA`; it must not publish the property address. The supplied account is: aged, rusted roof fastener/rivet points allowed water ingress; after discussing a limited customer budget, the repair used structural adhesive and renewed coating/spraying as the economical repair approach. The four supplied images are site-detail images. They are not labelled before/after because their order and capture stage are not explicitly established.

## Public information architecture

### New case-study route

Create `/projects/roleystone-metal-roof-fastener-leak-repair/` with one self-contained case study.

- Page title: `Metal Roof Leak Repair in Roleystone, WA`.
- SEO title: `Metal Roof Leak Repair Roleystone WA | Ellis Services Group`.
- H1: `METAL ROOF FASTENER LEAK REPAIR IN ROYLEYSTONE.`
- Intro identifies the roof as metal, the location as Roleystone, WA, and the issue as ageing/corroded fastener points.
- Sections cover the observed condition, budget discussion, economical repair approach, the four site-detail images, and a safe next step.
- The repair description says structural adhesive and renewed coating/spraying were used for this project. It does not claim that this approach is suitable for every roof, establish an unspecified service life, or promise that it is the lowest price for every property.
- The case page links to `/roof-leak-repairs/`, `/metal-roof-repairs/`, `/flashing-repairs/`, `/roof-inspection/` and `/contact/`.

### Core service pages

Rewrite `/roof-leak-repairs/` as the cluster hub with a unique title, description, H1 and visible local intent. Its content explains that a visible ceiling mark may be away from the entry point, and identifies roof-covering joints, valleys, penetrations, flashings, roof fasteners and drainage as distinct contexts rather than diagnoses. It links to the Roleystone case study and the relevant material/detail pages.

Expand `/metal-roof-repairs/` with a material-specific section on aged fixings, corrosion around fastener points and coating condition. It links to the Roleystone case study and leak-repair hub without representing the project as a universal repair method.

Existing service routes remain distinct. Do not create duplicated suburb landing pages.

### Homepage and resource links

Add a concise real-project route from the homepage and/or the Resources listing only where it can be presented as a documented project, not as a testimonial or generic gallery item. Maintain current desktop and mobile layout rules.

## Structured data and metadata

Continue the verified organization facts already published: legal entity, ABN/ACN, office address, phone, email and ABR source link. Add schema only when every claimed field is known:

- `LocalBusiness` may use the confirmed identity, telephone, email, website office address and Perth service area.
- A `Service` reference may describe roof leak repair and metal roof repair services in Perth.
- Breadcrumb markup may reflect the Projects route.

Do not add AggregateRating, Review, price, licence, insurance, warranty, emergency-response or availability claims. No structured-data type is presented as a ranking guarantee.

## Conversion and measurement boundaries

Keep highly visible telephone, email and enquiry links on relevant service and case-study pages. Do not claim enquiry completion until the endpoint is confirmed to deliver email.

GA4 events for telephone click, mailto click and successful enquiry submissions require a valid GA4 Measurement ID. Enquiry email delivery requires verified Resend configuration. Both are out of this change until the owner supplies those credentials/configuration; no placeholder client tracking code or secrets will be committed.

## Assets and accessibility

Copy the four approved source images into the project image directory using stable, descriptive filenames. Use accurate alt text describing roof fastener corrosion, structural adhesive/coating detail or metal-roof surface context; do not include the customer address in alt text. Define responsive image frames that preserve layout without stretching or cropping away the repair detail.

## Testing and acceptance criteria

Automated checks must prove that:

1. the case-study route is generated, included in sitemap and has one unique H1, canonical URL, unique title and description;
2. public HTML includes Roleystone, WA but not the exact Heath Road address;
3. the case study accurately names the supplied repair approach and four unique image assets;
4. roof-leak and metal-roof pages contain focused content and reciprocal internal links to the case study;
5. structured data includes only confirmed business facts and has no rating, review, price, licence, insurance or warranty assertion;
6. existing route, accessibility, image-frame and form-safety tests remain green.

## Explicit non-goals

- No invented case studies, customer reviews, ratings or testimonials.
- No public display of the supplied street address.
- No promise that content changes will cause a defined ranking, CTR, traffic or sales result.
- No Google Business Profile edits, citation submissions, GSC submissions, Resend setup or GA4 setup in this code change.
