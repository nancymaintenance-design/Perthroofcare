# Ellis Services Group | Perth Roof Repairs

Static English-language website for Ellis Services Group's Perth roof-repair services. It includes crawlable route folders, sitemap and robots files, a supplied company logo/favicon, and a same-origin enquiry endpoint.

## Local checks

Run `npm run dev`, then open `http://localhost:4173`. Run `npm test` for static, accessibility-oriented structure, SEO route and form-safety checks. `npm run build` regenerates page files from `build.mjs`.

## Enquiry form

Locally, `server.mjs` handles `/api/enquiry`. On Vercel, `api/enquiry.js` handles the same endpoint. Both reject delivery unless `RESEND_API_KEY` and `RESEND_FROM` are set. Never commit a real key; use the blank/sample `.env.example` only as a reference. Accepted enquiries are addressed to `ellisservicesgroup3@outlook.com`.

## Deployment

See [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md) before connecting GitHub, Vercel or GoDaddy. Confirm the final domain before production: the current canonical base is a temporary placeholder and must be replaced consistently if your selected domain differs.

Before release, verify legal entity details, privacy and lead handling, operating hours, licences/accreditations, service-area wording, quote language, and any analytics/cookie obligations. Do not add unverified reviews, ratings, guarantees, case studies, response-time claims, or real-project claims.
