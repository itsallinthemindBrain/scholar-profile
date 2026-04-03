# Scholar Profile — Dr. Enrico L. Enriquez

Academic portfolio for Dr. Enrico L. Enriquez, Full Professor of Mathematics at the University of San Carlos, Cebu City. Features a live publication and citation counter pulled from the OpenAlex API, a research papers showcase, e-book store, and contact section — all protected behind GitHub OAuth authentication.

## Tech Stack

- **Frontend**: HTML5 / CSS3 / Vanilla JS (no framework, no build step)
- **Hosting**: Azure Static Web Apps (Free tier, `eastasia`)
- **Auth**: GitHub OAuth via Azure Static Web Apps built-in auth
- **Live Stats API**: OpenAlex (`https://api.openalex.org`) — no credentials required
- **IaC**: Bicep (subscription-scoped), modules for resource group + SWA
- **CI/CD**: GitHub Actions — lint gates deploy, PR staging environments

## Project Structure

```
scholar-profile/
├── frontend/
│   ├── index.html                  # Main portfolio (auth-required)
│   ├── login.html                  # GitHub OAuth login (public)
│   ├── css/styles.css              # Glassmorphism design, mobile-first
│   └── assets/
│       ├── js/scripts.js           # Fade-in, smooth scroll, nav, live stats
│       └── images/papa.jpg         # Profile photo
├── infra/
│   ├── main.bicep                  # Subscription-scoped template
│   ├── prod.bicepparam             # Production parameters (no secrets)
│   └── modules/
│       ├── resourceGroup.bicep
│       └── staticWebApp.bicep
├── .github/workflows/
│   ├── azure-static-web-apps-calm-field-0e7a67400.yml  # App CI/CD
│   └── deploy-infra.yml            # Infrastructure deployment
├── staticwebapp.config.json        # Routes, auth, security headers
├── package.json                    # Lint scripts + dev dependencies
├── eslint.config.js                # ESLint v9 flat config
├── .htmlhintrc                     # HTMLHint rules
└── .stylelintrc.json               # Stylelint rules
```

## Local Development

```bash
# Serve locally (auth is bypassed — staticwebapp.config.json rules only apply on Azure)
python -m http.server 8000 -d frontend
# then open http://localhost:8000
```

## Linting

```bash
npm install

npm run lint          # Run all linters (HTML + CSS + JS)
npm run lint:html     # HTMLHint
npm run lint:css      # Stylelint
npm run lint:js       # ESLint
```

Linting runs automatically in CI before every deploy.

## Live Stats Integration (OpenAlex API)

`scripts.js` fetches real-time publication and citation counts on page load:

- **Author ID**: `A5019932260`
- **Endpoint**: `https://api.openalex.org/authors/A5019932260?select=cited_by_count,works_count`
- **Timeout**: 5 seconds — if the request fails or times out, hardcoded fallback values are displayed (`1,213+` citations, `64+` publications)
- **No API key required**: OpenAlex is a public API

The CSP in `staticwebapp.config.json` explicitly allows `connect-src https://api.openalex.org`.

## Infrastructure (Bicep)

Resources created: resource group `scholar-profile-rg-prod` + SWA `scholar-profile-swa-prod` in `southeastasia`.

**Automatic deploy** (via GitHub Actions on `infra/**` changes):
```bash
git push origin main  # triggers deploy-infra.yml if infra/** files changed
```

**Manual deploy**:
```bash
az deployment sub create \
  --location southeastasia \
  --template-file infra/main.bicep \
  --parameters infra/prod.bicepparam \
               repositoryToken=$GITHUB_TOKEN
```

`repositoryToken` is `@secure()` in Bicep — never hardcode it in `prod.bicepparam`.

## CI/CD

| Trigger | Action |
|---|---|
| Push to `main` | Lint then deploy to production |
| PR opened/updated | Lint then deploy to staging environment |
| PR closed | Staging environment torn down |
| Push to `main` with `infra/**` changes | Deploy Bicep infrastructure |
| `workflow_dispatch` on `deploy-infra.yml` | Manual infra deploy |

## Required GitHub Secrets

| Secret | Used by |
|---|---|
| `AZURE_STATIC_WEB_APPS_API_TOKEN_CALM_FIELD_0E7A67400` | App deploy workflow |
| `AZURE_CREDENTIALS` | Infra deploy workflow (service principal JSON) |
| `AZURE_STATIC_WEB_APPS_REPOSITORY_TOKEN` | Infra deploy — Bicep `repositoryToken` |

## Adding E-Books

1. Save the cover image to `frontend/assets/images/covers/your-ebook-cover.jpg`
2. Copy the `.ebook-card` template block in `index.html` (marked with comments)
3. Replace the placeholder values: title, authors, description, price, buy link
4. Replace `.ebook-cover-placeholder` with `<img src="assets/images/covers/your-ebook-cover.jpg" alt="Book Title" loading="lazy" />`
5. Push to `main` — CI/CD deploys automatically

## Security

Security headers are set globally in `staticwebapp.config.json`:
- `Content-Security-Policy` — strict self-origin; explicitly allows `api.openalex.org`
- `Strict-Transport-Security` — 2-year HSTS with preload
- `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`
- `Permissions-Policy` — disables camera, microphone, geolocation, payment, etc.
- `Cross-Origin-Opener-Policy` / `Cross-Origin-Resource-Policy` — same-origin isolation
