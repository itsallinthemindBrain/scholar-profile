# Change History

## 2026-04-07
**Changed:** Expanded `.gitignore` to cover secrets and credentials
**Reason:** Security audit found `.gitignore` only covered `node_modules/`, `test-results/`, and `coverage/`. Added `.env*`, `*.key`, `*.pem`, `secrets.json`, `credentials.json`, and IDE configs to prevent accidental commits of sensitive files.

## 2026-04-06
**Changed:** Cloned and set up on new laptop
**Reason:** New machine setup; npm dependencies installed.
