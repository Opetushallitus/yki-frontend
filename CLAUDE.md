# YKI Frontend — Archived Reference Repo

## Status: DEPRECATED

This is the **old YKI frontend** — a Spring Boot + React SPA (React 16, Redux, create-react-app). It is archived and kept for two purposes:

1. **Data tooling** — the old frontend + old Clojure backend share the same database as `kieli-ja-kaantajatutkinnot/`. Running the old stack together is the practical way to seed realistic data for testing new features.
2. **Historical reference** — understanding original behavior when porting features to `kieli-ja-kaantajatutkinnot/`.

**Do not add features or fix bugs here.** Any actual development goes in `kieli-ja-kaantajatutkinnot/`.

---

## Primary Use Case: Running with Real Backend (Data Seeding)

This is the most likely reason you are here. You want to insert data via the old UI so it lands in the shared database and becomes available for testing features in the new system.

**Prerequisites:**
- Old Clojure backend (`yki/`) running on port 8080
- Both old and new system point to the same PostgreSQL database

**Steps:**

1. Start the Clojure backend:
```bash
cd ../yki
lein run
```

2. Create `src/main/js/.env.local`:
```
REACT_APP_USE_LOCAL_PROXY_BACKEND=true
REACT_APP_LOCAL_PROXY=http://localhost:8080
```

3. Start the frontend:
```bash
cd src/main/js
npm install --legacy-peer-deps
npm start
```

4. Navigate to a route (the app has `basename="/yki"` — `localhost:3000` alone shows a blank page):
   - `http://localhost:3000/yki/jarjestajarekisteri` — organizer registry
   - `http://localhost:3000/yki/tutkintotilaisuudet` — exam sessions
   - `http://localhost:3000/yki/tutkintopaivat` — exam dates
   - `http://localhost:3000/yki/maksuraportit` — payments report
   - `http://localhost:3000/yki/osallistumiskiellot/odottavat` — quarantine (pending)

---

## Secondary Use Case: Mock Mode (Investigation or Critical Fixes)

Assume the user is **not actively developing this repo** — the default assumption is read/investigate. Use this mode when the backend is unavailable or unnecessary: exploring UI behavior, reading code, or applying a targeted critical fix without spinning up the full stack.

No backend needed. API calls are served from local mock JSON files in `src/main/js/dev/rest/`.

```bash
cd src/main/js
npm install --legacy-peer-deps
npm start
```

Do **not** create `.env.local` — its absence is what activates mock mode.

---

## Tech Stack

For exact versions, check `src/main/js/package.json`.

- **React** with class and functional components
- **Redux** + Redux Thunk for async actions
- **React Router DOM**
- **Formik + Yup** for forms and validation
- **Axios** with request interceptors (CSRF, Caller-Id, language param)
- **i18next** for localization (fetched from OPH localization service)
- **Flatpickr** for date pickers
- **Ramda** utilities
- **Cypress** for E2E tests, **Enzyme** for unit tests
- **Spring Boot** thin backend (serves static assets, SPA routing, logs)

---

## Project Structure

```
src/main/js/src/
  components/     # Presentational components
  containers/     # Stateful container components
  store/
    actions/      # Redux action creators (async via Thunk)
    reducers/     # Redux reducers
  api/            # API integration
  util/           # Utility functions
  hoc/            # Higher-order components
  i18n.js         # i18next setup
  axios.js        # Axios instance (CSRF, Caller-Id, lang interceptors)
  setupProxy.js   # Dev proxy config (serves local mock JSON by default; set REACT_APP_USE_LOCAL_PROXY_BACKEND=true to proxy to a real backend)
  App.js          # Root component, routing, Redux Provider
  index.js        # Entry point
```

---

## Production Build

Not needed for normal use. If required: `./mvnw` is pinned to Maven 3.5.4 which is too old — install a current one first (`brew install maven`), then:

```bash
(cd src/main/js && npm install --legacy-peer-deps)
NODE_OPTIONS=--openssl-legacy-provider mvn clean install
```

---

## Authentication

- CAS-based auth; 401 responses on admin routes (`/jarjestajarekisteri`, `/tutkintotilaisuudet`, `/tutkintopaivat`, `/maksuraportit`) trigger redirect to `/yki/auth/cas`
- CSRF token injected from cookie on every request

---

## Behavior Guidelines for Claude

### This is an archived repo — do not change code

Reading this codebase is for understanding **original behavior** for porting or reimplementing features in `kieli-ja-kaantajatutkinnot/`. Do not suggest or apply fixes here.

### Be direct, not sycophantic

- Do not open responses with affirmations ("Great question!", "Sure!", "Absolutely!").
- Do not soften findings to avoid seeming critical.
- If something is wrong, confusing, or notable, say so plainly.

### Bugs are known features here

This repo is frozen. If you encounter something that looks like a bug — a race condition, an off-by-one error, a missing null check, an incorrect API assumption — **do not fix it**. Instead:

1. **Flag it explicitly**: state clearly what the issue is and where it is.
2. **Describe the observable behavior**: what actually happens vs. what one might expect.
3. **Note it as a porting consideration**: if it's relevant to the migration, say so.

The assumption is that everything in this repo is a known, existing behavior. The goal is accurate documentation of that behavior, not correction of it.
