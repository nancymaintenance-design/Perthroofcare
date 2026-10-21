# Perth Roof Care deployment guide

This guide covers the existing Perth Roof Care website operated by Ellis Services Group Pty Ltd. It is a maintenance and release procedure for the current project.

## Fixed project targets

| Target | Value |
| --- | --- |
| Source | `E:/Ellis-Services/Perth Roof Care/source` |
| Git origin | `https://github.com/nancymaintenance-design/Perthroofcare.git` |
| Production branch | `main` |
| Vercel project | `perthroofcare` / `prj_LEVx3CtXaEo4lc6hmC8Lm1ptepmw` |
| Vercel team | `team_HgQsqT9oDcIK0DwS4mIs4L0W` |
| Formal domain | `https://www.perthroofcare.com.au/` |
| Chinese home | `https://www.perthroofcare.com.au/zh/` |

The apex domain redirects to `www` through the existing configuration. Domain, DNS, email and project settings already exist; routine releases do not require recreating them. Check the live deployment when needed rather than assuming a recorded commit is still current.

## Before modifying or releasing

1. Read `E:/Ellis-Services/AGENTS.md`, `../obsidian/00-首页.md`, `../obsidian/02-最新资料同步.md` and the latest relevant report.
2. In this source directory, inspect `git remote -v`, `git branch --show-current` and `git status --short`, then run `git fetch origin main` and compare HEAD with `origin/main`.
3. Preserve all existing uncommitted work. Review incoming and local changes before integration; do not reset or overwrite the working copy from remote or an archive.
4. Confirm that the intended change is confined to Perth Roof Care. Retain the current routes, design, bilingual content pairing and business facts unless the task authorizes changes.
5. Obtain explicit authorization for the current release before pushing or merging. Authorization to maintain or test the site does not authorize production publication.

## Build configuration and content

Use Node.js 24.x and the repository lockfile. `npm ci` installs dependencies when required. `npm run build` and `npm test` both invoke the current `vercel-build.mjs` pipeline.

`vercel.json` specifies framework `null`, build command `node vercel-build.mjs` and static output directory `public`. The build also writes `.vercel/output/static`, `.vercel/output/config.json` and the Node.js 24 enquiry function under `.vercel/output/functions/api/enquiry.func`. Preserve this existing build arrangement; do not change the output directory to the repository root or create an obsolete `api/enquiry.js` file.

Approved editor content is applied before the route-specific `owner-copy` layer. Maintain Chinese text in `content/i18n/zh` and regenerate through the existing build. Do not edit generated Chinese pages or `public` manually. JSON-LD, Feed, RSS and llms must remain consistent with visible content.

## Verification before release

1. Run `npm test` and `git diff --check`; inspect the exit codes and failures.
2. Review the actual diff, affected English and Chinese pages, corresponding language links and machine-readable output. For a maintenance-only change, compare the complete generated output with the prior baseline.
3. Start a normal local server with `npm run dev` and run `node tools/verify-release.mjs http://127.0.0.1:4173`. Use the actual port if changed. This performs GET requests only.
4. For human review without enquiries or analytics, use `npm run preview:seo`. Its noindex headers and disabled enquiry endpoint intentionally differ from production; the production-style release checker must use normal mode.
5. The release checker compares sitemap routes, canonical/indexability, organization and hours, GA4 and footer structure, ordered stylesheet references and every referenced CSS asset's status, type and exact bytes against the local build. It also checks redirects, 404 and GET `/api/enquiry` returning 405. One shared stylesheet plus a page layer is supported, up to two per page; preserve their order.
6. Save test logs, evidence and limitations in `../reports`, and append the new status to the project Obsidian homepage and latest-state note. Keep historical release records intact.

The verifier expects its target to match the local build. Before publishing a changed candidate, comparing it with unchanged production may correctly report differences; that alone does not indicate a production fault. Network failures must be reported as connectivity failures.

## Authorized production release

After explicit authorization, re-fetch main and inspect changes since testing. Re-test any integration changes. Publish the reviewed commit through the existing GitHub production branch using a normal, non-forced push; do not overwrite newer remote changes. Vercel then builds from GitHub automatically. Do not use a direct CLI production deployment or an old working copy.

Confirm through Vercel that the intended project, Git commit, main branch, production target and domain aliases match, and that the deployment is READY with no alias error. Then run:

```text
node tools/verify-release.mjs https://www.perthroofcare.com.au
```

Also check affected bilingual content and public documents on the formal domain. Record the actual commit, deployment ID, timestamps and results in a new release report. Deployment readiness and GET checks do not establish email delivery, bookings or customer acquisition results.

## Enquiry configuration and testing

The local handler is `local-server.mjs`; production uses `enquiry.js`, packaged by the build as a Vercel function at `/api/enquiry`. Delivery requires `RESEND_API_KEY` and a verified `RESEND_FROM`, configured securely in the deployment environment. The source recipient is `ellisservicesgroup3@outlook.com`. `env.example` contains blank placeholders; never put actual credentials in Git, reports or Obsidian.

Do not submit a production enquiry, send a test email or call a number without explicit authorization. The release checker only uses GET on the endpoint, which must return 405 in normal mode. Confirm actual delivery separately when authorized; sending an enquiry does not confirm an appointment.
