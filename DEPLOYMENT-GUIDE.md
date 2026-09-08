# Deployment handoff — Ellis Services Group website

## Upload folder

Upload the contents of this directory to a new GitHub repository:

`D:\codex\2026-09-07\obsidian\outputs\ellis-roofing-website`

This is a static website with a small Vercel function at `api/enquiry.js`. Keep the supplied `.gitignore`; it prevents Resend secrets, local Vercel state, dependencies and internal delivery receipts from being committed.

## Required decision before production

The current HTML, sitemap and robots file use `https://ellisservicesgroup.com` as a temporary canonical base. Do **not** deploy it as the production canonical unless that is the exact domain you own and intend to use. Once the final GoDaddy domain is confirmed, replace that base consistently in `build.mjs`, run the build, test, and then publish.

## GitHub

1. Create a new private GitHub repository for the website.
2. Upload this directory's publishable files, including `api`, `assets`, each page folder, `build.mjs`, `package.json`, `robots.txt`, `sitemap.xml` and `favicon.ico`.
3. Do not upload a real `.env` file or any API keys. The committed `.env.example` is safe because it contains blank/sample values only.

## Vercel

1. In Vercel, choose **Add New → Project**, import the GitHub repository, and set the repository root to this folder.
2. Select **Other** as the framework preset. Set the build command to `npm run build`; leave the output directory as the repository root (`.`) so the generated HTML folders and static assets are served.
3. Deploy once to obtain a Vercel preview URL. Confirm `/`, `/services/`, `/contact/`, `/sitemap.xml` and `/favicon.ico` load before attaching the customer-facing domain.
4. The enquiry form is safe by default: until the variables below are configured, it returns a clear `503` response and sends no email.

### Resend settings (configure only when you are ready to receive enquiries)

Add these in **Vercel → Project Settings → Environment Variables** for the environment(s) you intend to use:

| Variable | Value |
| --- | --- |
| `RESEND_API_KEY` | Your Resend API key (secret; never add it to GitHub) |
| `RESEND_FROM` | A Resend-verified sender, e.g. `Ellis Services Group <enquiries@your-domain.com>` |

The function sends accepted form submissions only to `ellisservicesgroup3@outlook.com`. First test with a controlled internal enquiry after configuration, then confirm email delivery and sender verification in Resend.

## GoDaddy domain connection

1. Add the exact final domain in **Vercel → Project → Settings → Domains** first.
2. Vercel will display the DNS record required for that project. In GoDaddy DNS management, add exactly that A, CNAME, or verification TXT record without deleting unrelated email records.
3. Return to Vercel and wait for domain verification and SSL provisioning. Add both apex and `www` versions only if you intend to use both, then redirect one to the chosen canonical version to avoid duplicate URLs.
4. After DNS is live, replace the temporary canonical base described above with the exact chosen `https` domain and make a fresh deployment.

## Production acceptance checklist

- [ ] Final legal domain confirmed and canonical URLs regenerated
- [ ] Privacy/lead-handling text approved
- [ ] Preview pages and mobile layout reviewed by a named human
- [ ] Resend sender verified and one controlled form submission received
- [ ] `www` / apex redirect choice confirmed
- [ ] Sitemap and robots URL checked on the final domain

No deployment, DNS change or email configuration has been performed in preparing this package.
