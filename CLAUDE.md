# Scholar Profile — Academic Portfolio

## What This Project Does
Academic portfolio website for Dr. Enrico L. Enriquez (Math professor, USC Cebu). Shows publications, citations, and academic info. Deployed to Azure Static Web Apps via GitHub Actions.

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML5, CSS3, JavaScript |
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
│       └── js/scripts.js
├── infra/              # Bicep infrastructure
│   ├── main.bicep
│   └── prod.bicepparam
└── staticwebapp.config.json
```

## What scripts.js Does
- Fade-in scroll animations
- Smooth scrolling
- Active nav link highlighting
- `initLiveStats()` — fetches live citation and publication counts from the OpenAlex API

## OpenAlex API Integration
- Author ID: `A5019932260`
- Endpoint: `https://api.openalex.org`
- Timeout: 5 seconds; falls back to hardcoded values if the API is slow or down
- CSP allows `connect-src https://api.openalex.org`

## Linting & Testing (ESLint v9)
```bash
npm install
npm run lint          # HTML + CSS + JS
npm run test          # Vitest unit tests
npm run test:coverage # With coverage report
```

## CI/CD (Two Workflows)
| Workflow | Trigger | What it does |
|---|---|---|
| App deploy | Push to `main` | Lints, then deploys the site |
| Infra deploy | Push to `main` with `infra/**` changes | Runs `az deployment sub create` |

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
- Auth is bypassed when running locally

## Mobile Layout Rules
- Mobile-first; minimum viewport 375px
- Breakpoints: 768px (tablet), 1024px (desktop)
- Touch targets: at least 44px
- No horizontal scrolling
