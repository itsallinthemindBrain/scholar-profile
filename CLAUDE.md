# Scholar Profile — Academic Portfolio

## What This Project Does
Academic portfolio website for Dr. Enrico L. Enriquez (Math professor, USC Cebu). Shows publications, live citations, and academic info. Deployed to Azure Static Web Apps via GitHub Actions.

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML5, CSS3, JavaScript |
| Testing | Vitest + jsdom |
| Hosting | Azure Static Web Apps |
| Auth | GitHub OAuth via `staticwebapp.config.json` |
| CI/CD | GitHub Actions |
| IaC | Bicep (`infra/`) |

## Project Structure
```
scholar-profile/
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── css/styles.css
│   └── assets/
│       ├── images/
│       ├── profile.jpg
│       └── js/
│           ├── scripts.js       # UI interactions
│           ├── live-stats.js    # OpenAlex API integration
│           └── __tests__/       # Vitest unit tests
├── infra/                       # Bicep infrastructure
│   ├── main.bicep
│   ├── main.json
│   ├── modules/
│   └── prod.bicepparam
└── staticwebapp.config.json
```

## What scripts.js Does
- `initFadeIn()` — scroll fade-in via `IntersectionObserver` on `.fade-in` elements
- `initSmoothScroll()` — smooth anchor scrolling (`a[href^="#"]`)
- `initNavHighlight()` — highlights active nav link based on visible section
- `initNavToggle()` — hamburger nav toggle; manages `.nav-open` and `aria-expanded`; closes on outside click

## OpenAlex API Integration (`live-stats.js`)
- **Author ID**: `A5019932260`
- **Endpoint**: `https://api.openalex.org/authors/{id}?select=cited_by_count,works_count`
- **Timeout**: 5 seconds via `AbortController`
- **Fallback**: hardcoded values (`1,213+` citations, `64+` works) if API fails or times out
- Updates `#stat-citations` and `#stat-publications` elements in the DOM
- CSP allows `connect-src https://api.openalex.org`

## Linting & Testing (ESLint v9)
```bash
npm install
npm run lint          # HTML + CSS + JS
npm run test          # Vitest unit tests
npm run test:coverage # with coverage report
```

## CI/CD (Two Workflows)
| Workflow | Trigger | What it does |
|---|---|---|
| `azure-static-web-apps-calm-field-0e7a67400.yml` | Push to `main` / PR | Lints, then deploys the site |
| `deploy-infra.yml` | Push to `main` with `infra/**` changes | Runs `az deployment sub create` |

Pull requests get a temporary staging environment. Lint runs before deploy — failure blocks the deploy.

## Bicep Infrastructure
- Subscription-scoped; creates a resource group + Static Web App
- `repositoryToken` uses `@secure()` — never hardcode it
- Deploy manually:
```bash
az deployment sub create \
  --location eastasia \
  --template-file infra/main.bicep \
  --parameters infra/prod.bicepparam repositoryToken=<token>
```

## Auth Behavior
- GitHub OAuth enforced on all routes except `/login.html` and `/.auth/*`
- Unauthenticated requests redirect to `/login.html` (302)
- Auth is bypassed when running locally

## Mobile Layout Rules
- Mobile-first; minimum viewport 375px (iPhone SE)
- Breakpoints: 768px (tablet), 1024px (desktop)
- Touch targets: at least 44px
- No horizontal scrolling
