# Perth Roof Care

Perth Roof Care is operated by Ellis Services Group Pty Ltd. This repository builds the existing English and Simplified Chinese website, with crawlable static pages and a same-origin enquiry endpoint.

## Project identity

- English: https://www.perthroofcare.com.au/
- Chinese: https://www.perthroofcare.com.au/zh/
- Repository: https://github.com/nancymaintenance-design/Perthroofcare.git
- Vercel project: `perthroofcare`; production branch: `main`.
- Only working source: `E:/Ellis-Services/Perth Roof Care/source`.
- Project notes: `../obsidian`; reports and verification evidence: `../reports`.

Read `E:/Ellis-Services/AGENTS.md` and the latest project Obsidian notes before maintenance. Check origin, branch, local changes and freshly fetched `origin/main`; compare and preserve existing work before integrating changes. Historical copies and archives are reference material only.

## Local build and checks

Use Node.js 24.x. For a fresh dependency installation, run `npm ci` in the source directory.

- `npm run build` runs `vercel-build.mjs`, including the base build, approved content, owner copy, Chinese localization, service navigation, machine-readable content, images and stylesheet bundles.
- `npm run preview:seo` serves a local review at `http://127.0.0.1:4173` with enquiries disabled, analytics scripts removed and noindex headers. This mode is for local review only.
- `npm run dev` serves the built `public` directory at the same address, or the port set by `PORT`. It does not rebuild automatically. Its enquiry handler can send email when configured; do not submit a form without explicit authorization.
- `npm test` rebuilds and runs the regression suite, including `verify-release.test.mjs` for the release checker.
- `node tools/verify-release.mjs http://127.0.0.1:4173` checks a normal local server after building. It expects production-like indexability and GET `/api/enquiry` to return 405, so do not use preview-only mode for this check.

The build generates `public` and `.vercel/output`, including the Node.js enquiry function. `vercel.json` declares `node vercel-build.mjs`, framework `null` and output directory `public`. Do not maintain generated `public` or `zh` files by hand.

## Content and design maintenance

Update the real content source and the existing Chinese catalog in `content/i18n/zh`. `content/editor-approved.json` supplies approved editor content; `content/owner-copy.mjs` applies the route-specific sentence rules in `content/owner-copy-data.json` afterward. Check whether these rules overlap a new editor change. S21 supplies the drainage overflow answer for the service and its associated guide; inactive duplicate G12 has been removed.

Preserve the selected design in `DESIGN.md`, existing URLs, H1, canonical, hreflang, indexing policy, review quotations and verified business facts unless the current task authorizes a change. The build uses a shared stylesheet and a page layer, with at most two stylesheet requests; do not delete a layer to satisfy an obsolete single-file check. The release checker compares ordered references and every referenced CSS response with the local build.

## Enquiry handling

`local-server.mjs` handles local `/api/enquiry`. In production, `vercel-build.mjs` packages `enquiry.js` into `.vercel/output/functions/api/enquiry.func/index.js` for the same endpoint. Both handlers require `RESEND_API_KEY` and `RESEND_FROM` to deliver a valid enquiry; the configured recipient in source is `ellisservicesgroup3@outlook.com`. Missing delivery configuration returns 503 for otherwise valid enquiries.

Use the blank `env.example` as a configuration reference. Keep real credentials outside Git, reports and Obsidian. A successful enquiry response is not an appointment confirmation. Real form submissions, email delivery tests and calls require explicit authorization.

## Release

Follow [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md). Production uses the existing GitHub main → Vercel automatic build → formal domain chain. Push, merge or production release requires explicit authorization for the current task. Do not create a replacement repository, deploy from an old copy, or publish via the CLI.
