# Dependency Update Plan

Status: Active  
Initial audit: 2026-09-10  
Next refresh: Before each dependency pull request and after each merge

## Goal

Bring both Node dependency trees onto supported runtimes, remove known critical and high-severity vulnerabilities, and reduce the amount of legacy tooling that must be maintained. Work starts with compatible, low-risk updates and then proceeds by security severity and runtime exposure.

This file is the source of truth for sequencing and progress. Update the audit snapshot and progress ledger after every dependency pull request.

## Rules of engagement

- Use npm as the only package manager. Do not hand-edit lockfiles.
- Keep each pull request limited to one dependency family or one cleanup theme.
- Run the full validation matrix for every pull request, even for patch-only changes.
- Prioritize severity, runtime reachability, and whether input is attacker-controlled. An `npm audit` count alone does not establish exploitability.
- Do not run `npm audit fix --force`. Its current suggestions include breaking upgrades and an invalid-looking downgrade of `firebase-functions-test` to `0.3.3`.
- Prefer removing unused dependencies over updating them.
- Do not accept new critical or high findings without a written exception, owner, and expiry date in this file.

## Current inventory

| Surface | Direct dependencies | Lockfile | Runtime declaration | Outdated snapshot | Audit snapshot |
| --- | ---: | --- | --- | --- | --- |
| Web app and root tooling | 90 production, 1 development | `package-lock.json`, lockfile v3 | `.nvmrc`: Node 22; `engines`: Node >=22 | 74 direct packages reported; 38 can move within the current declared range and 36 require a range change | Initial: 68 vulnerable package nodes (4 critical, 31 high, 18 moderate, 15 low); reconciled Phase 1A/1B: 59 (3 critical, 25 high, 17 moderate, 14 low) |
| Firebase Functions | 3 production, 5 development | `functions/package-lock.json`, lockfile v3, plus a redundant `functions/yarn.lock` | Node 22 declared; production deployment pending | `firebase-functions` can move 6.3.2 -> 6.6.0 in-range; major updates are available for the Firebase SDKs | 39 vulnerable package nodes: 3 critical, 22 high, 11 moderate, 3 low; production-only audit: 29 total, including 3 critical and 18 high |

Audit counts are vulnerable package nodes reported by npm, not unique advisories. The root production-only audit is currently identical to the full audit because nearly all build and test tooling is incorrectly listed under `dependencies`.

### Runtime support finding

Node 18 and Node 20 are both end-of-life upstream. Firebase currently supports Node 20 and Node 22 for Functions and marks Node 18 deprecated. The repository now declares Node 22 as the common target; the production Functions runtime migration remains pending until the baseline deploy succeeds.

References:

- [Node.js release status](https://nodejs.org/en/about/previous-releases)
- [Firebase Functions runtime management](https://firebase.google.com/docs/functions/manage-functions)
- [Firebase Admin Node.js release notes](https://firebase.google.com/support/release-notes/admin/node)

## Verified baseline

The baseline was run on Node 20.20.2 with npm 10.8.2.

| Check | Result on 2026-09-10 | Notes |
| --- | --- | --- |
| `npm test -- --watchAll=false --runInBand` | Pass | 3 suites, 8 tests |
| `npm run build` | Pass | Vite 6.2.3; warns about 19-month-old browser data, `eval` in the old PDF.js bundle, and chunks over 500 kB |
| `npm --prefix functions ci --ignore-scripts` | Pass | Emits the expected engine warning because Functions declares Node 18 while the audit host runs Node 20 |
| `npm --prefix functions run build` | Pass | TypeScript compilation succeeds after installing the Functions tree |
| `npm --prefix functions run lint` | Pass | ESLint succeeds after installing the Functions tree |

There is no committed CI workflow, so these checks currently depend on a developer running them.

### Node 22 deployment baseline validation

The runtime-only migration was validated on 2026-09-16 with Node 22.23.2 and npm 10.9.8. No application or dependency versions changed in this migration.

| Check | Result | Notes |
| --- | --- | --- |
| Root `npm ci --ignore-scripts` | Pass | Clean install using the root npm lockfile |
| Root `npm test -- --watchAll=false --runInBand` | Pass | 5 suites, 20 tests |
| Root `npm run build` | Pass | TypeScript and Vite production build complete; existing PDF.js and large-chunk warnings remain |
| Functions `npm ci --ignore-scripts` | Pass | Clean install using `functions/package-lock.json` |
| Functions `npm run lint` | Pass | ESLint 9.28.0 |
| Functions `npm run build` | Pass | TypeScript 4.9.5 |
| Firebase CLI | Ready | 15.30.1 installed for Node 22; direct production deploy intentionally left to the project owner |

## Key dependency paths

### Critical findings

| Surface | Vulnerable package | Current path | Intended resolution |
| --- | --- | --- | --- |
| Web | `protobufjs` | `firebase` -> `@firebase/firestore` -> `@grpc/proto-loader` | Resolved in Phase 1 by the Firebase v11 refresh, which now selects `protobufjs` 7.6.6 |
| Web | `websocket-driver` | `firebase` -> `@firebase/database` -> `faye-websocket` | Same Firebase refresh/upgrade; a second copy comes from the obsolete Webpack dev server |
| Root test tooling | `form-data` | Jest 27 -> jsdom 16 | Replace the CRA/Jest harness with a current test stack, or upgrade Jest as an interim step |
| Root legacy tooling | `shell-quote` | `react-dev-utils`; another copy via `webpack-dev-server` -> `launch-editor` | Remove the unused CRA/Webpack development stack |
| Functions production | `fast-xml-parser` | `firebase-admin` 11 -> `@google-cloud/storage` | Upgrade `firebase-admin` to 13.10.0 or later |
| Functions production | `protobufjs` | `firebase-admin` 11 and `firebase-functions` 6 | Upgrade the Firebase server SDK family and confirm the resolved versions |
| Functions production | `websocket-driver` | `firebase-admin` 11 -> database compatibility packages | Upgrade `firebase-admin` and confirm the resolved version |

Representative advisories:

- [`form-data` unsafe multipart boundary generation](https://github.com/advisories/GHSA-fjxv-7rqg-78g4)
- [`protobufjs` arbitrary code execution](https://github.com/advisories/GHSA-xq3m-2v4x-88gg)
- [`shell-quote` improper escaping](https://github.com/advisories/GHSA-w7jw-789q-3m8p)
- [`websocket-driver` message corruption](https://github.com/advisories/GHSA-xv26-6w52-cph6)
- [`fast-xml-parser` entity-encoding bypass](https://github.com/advisories/GHSA-m7jm-9gc2-mpf2)

### Direct high and moderate findings

| Severity | Direct package | Current | Compatible/latest target observed | Action |
| --- | --- | ---: | ---: | --- |
| High | `lodash` | 4.18.1 | 4.18.1 | Updated in Phase 1 |
| High | `browserslist` | 4.28.9 | 4.28.9 | Updated in Phase 1 |
| High | `postcss` | 8.5.28 | 8.5.28 | Top-level package updated in Phase 1; remove vulnerable legacy copies later |
| High | `vite` | 6.4.3 | 6.4.3 in-range; 8.3.0 latest | In-range fix applied; do the major toolchain upgrade separately |
| High | `react-pdf` | 6.2.2 | 11.0.0 | Major security migration; malicious PDFs can execute JavaScript in affected versions ([advisory](https://github.com/advisories/GHSA-87hq-q4gp-9wr4)) |
| High | `@types/react-pdf` | 5.7.4 | Remove | It pulls an old `pdfjs-dist` at runtime; current `react-pdf` ships types and the project also has a local declaration shim |
| High | `workbox-webpack-plugin` | 6.6.1 | Remove if unused; otherwise 7.4.1 | It belongs to the legacy Webpack configuration, not the active Vite build |
| High | `firebase-admin` | 11.11.1 | 13.10.0 | Major migration in the Functions security PR |
| High, no npm fix | `@nathanhigh/patreon` | 0.5.2 | Replace | Last published metadata is from 2022; it retains `isomorphic-fetch` -> `node-fetch` 1.7.3 with a secure-header forwarding advisory |
| Moderate | `@mdxeditor/editor` | 3.55.0 | 3.55.0 in-range; 4.2.4 latest | Phase 1 applied 3.55.0, but the audit still reports its vulnerable `js-yaml` path; retain the v4 migration |
| Moderate | `@excalidraw/excalidraw` | 0.14.2 | 0.18.1 | Major security migration for the XSS advisory ([advisory](https://github.com/advisories/GHSA-v7v8-gjv7-ffmr)) |
| Moderate | `webpack-dev-server` | 4.15.2 | Remove if unused | The active development server is Vite |
| Moderate | `css-minimizer-webpack-plugin`, `resolve-url-loader` | 3.4.1, 4.0.0 | Remove if unused | Legacy Webpack-only chain |
| Moderate | `firebase-functions-test` | 3.3.0 | Remove if unused; otherwise 3.5.0 | No source or test currently imports it |

## Execution plan

### Phase 0 — Guardrails and ownership

- [ ] Add a CI workflow using Node 22 that installs and validates both lockfiles.
- [ ] Add explicit package-local scripts for `lint` and non-watch `test:ci`; let CI provide the combined repository check instead of coupling the two packages through a web-app script.
- [ ] Add pinned `packageManager` fields to both packages.
- [x] Set `.nvmrc` and both package engine declarations to Node 22.
- [ ] Confirm npm as canonical, then remove `functions/yarn.lock` in the first Functions change.
- [ ] Pin the Firebase CLI version in CI/deployment tooling instead of relying on an unspecified global installation.
- [ ] Add dependency update automation only after the first cleanup pass, with grouped updates and no automatic merge for majors.

Phase 0 may land with Phase 1 if that keeps the first pull request small. It must not delay the compatible security patches.

### Phase 1 — Trivial and compatible-range updates

Goal: take the fixes already allowed by current manifests, without crossing a semver-major boundary.

#### 1A/1B. Combined compatible web batch — complete

Decision: combine active security-bearing, UI, Vite, and type updates into one validation and commit pass. Do not update legacy packages merely to make `npm outdated` quieter; remove them in Phase 2D instead.

- [x] Update `@babel/core` 7.26.10 -> 7.29.7 and `babel-preset-react-app` 10.0.1 -> 10.1.0.
- [x] Update `@mdxeditor/editor` 3.29.1 -> 3.55.0 and preserve the existing link text when publishing its now-required update payload.
- [x] Update `browserslist` 4.24.4 -> 4.28.9, `lodash` 4.17.21 -> 4.18.1, and `postcss` 8.5.3 -> 8.5.28.
- [x] Update `firebase` 11.9.0 -> 11.10.0 and refresh its compatible transitives.
- [x] Update `vite` 6.2.3 -> 6.4.3, `@vitejs/plugin-react` 4.3.4 -> 4.7.0, and `vite-plugin-svgr` 4.3.0 -> 4.5.0.
- [x] Update the active Font Awesome 6 packages to 6.7.2 and the React adapter to 0.2.6. Leave the unused regular icon pack unchanged for removal later.
- [x] Update `@react-spring/web` to 9.7.5, `grommet` to 2.56.1, `posthog-js` to the latest compatible 1.429.x release, and `react-minimal-pie-chart` to 8.4.1.
- [x] Retain the merged React Grid Layout v2 migration at 2.2.3, use its shipped types, and exclude the saved batch's obsolete RGL v1 source, dependency, and `@types/react-grid-layout` changes.
- [x] Update `@types/jest`, `@types/lodash`, `@types/node` 20.x, `@types/react-color`, `@types/react-dom` 18.x, and `@types/styled-components` within their current majors.
- [x] Update root TypeScript 5.8.3 -> 5.9.3.
- [x] Perform a clean `npm ci --ignore-scripts`; run all 10 tests across 4 suites, the TypeScript/Vite production build, and `npm ls --depth=0` successfully.
- [x] Re-run the full and production audits: 59 vulnerable nodes (3 critical, 25 high, 17 moderate, 14 low), down from 68 (4 critical, 31 high, 18 moderate, 15 low).
- [x] Confirm the Firebase refresh removed the critical `protobufjs` finding by resolving 7.6.6. The remaining critical paths are `form-data`, `shell-quote`, and `websocket-driver`.
- [x] Complete the manual browser smoke checklist, including RGL v2 resize/persistence behavior.
- [x] Review and accept the bundle growth as non-blocking for this batch. Compared with the original audit baseline (which predates the merged RGL v2 work), the largest raw/gzip changes are the main chunk 456.62/135.73 kB -> 577.54/177.34 kB, Markdown Editor 650.00/208.23 kB -> 705.36/227.03 kB, and Firebase 732.87/212.08 kB -> 763.39/220.97 kB. This comparison cannot attribute the main-chunk change solely to this dependency batch; handle any follow-up bundle analysis as separate work.
- [x] Commit the combined dependency batch as `f880914`; commit the no-active-campaign linking follow-up as `93a5437`.

Intentionally skipped: Webpack/CRA loaders and plugins, Workbox, Tailwind, root ESLint 8, `resolve`, `semver`, and the unused regular Font Awesome icon pack. These remain candidates for removal during the legacy-toolchain cleanup rather than update targets.

#### 1C. Compatible Functions updates

- [ ] Update `firebase-functions` 6.3.2 -> 6.6.0.
- [ ] Update the ESLint 9 family and `typescript-eslint` within their current majors.
- [ ] Remove unused `firebase-functions-test`; if tests are added first, update it to 3.5.0 instead.
- [ ] Keep TypeScript at 4.9.5 in this PR; move to 5.9.3 with the Firebase SDK migration so compiler changes are isolated.
- [ ] Regenerate only `functions/package-lock.json`; do not regenerate the Yarn lock.

Phase 1 exit criteria:

- All baseline checks pass.
- The app smoke test passes for dashboard load/save, article editing, drawing, PDF viewing, account login, and shared/player views.
- Audit counts and remaining critical dependency paths are recorded in the progress ledger.

### Phase 1D — Separate the web and Functions package contexts

Goal: make the web app and Firebase Functions explicit sibling packages before starting major migrations. This is a structure-only pull request: do not change dependency versions in the same change.

Target layout:

```text
/
├── docs/
├── firebase.json
├── database.rules.json
├── storage.rules
├── web/
│   ├── package.json
│   ├── package-lock.json
│   ├── src/
│   ├── public/
│   ├── config/
│   ├── scripts/
│   ├── index.html
│   ├── tsconfig.json
│   └── vite.config.mts
└── functions/
    ├── package.json
    ├── package-lock.json
    └── src/
```

Keep Firebase project configuration, rules, repository documentation, and project-level configuration at the repository root. Do not retain the web app's `package.json` at the root.

Expected value:

- npm commands, audits, and installs have unambiguous web or Functions scope.
- Developers cannot accidentally rely on the web app's dependency tree when building Functions.
- CI and deployment can validate each deployable independently.
- Web-only CRA/Webpack cleanup is contained within `web/`.
- The Firebase project root is no longer conflated with the browser application root.

Implementation checklist:

- [ ] Move the web manifest, npm lockfile, source, public assets, Vite/TypeScript configuration, test script, and remaining CRA configuration into `web/` while preserving Git history.
- [ ] Keep one independent npm lockfile in `web/` and one in `functions/`.
- [ ] Do not introduce npm workspaces or a shared root lockfile in this pull request.
- [ ] Remove cross-package web scripts such as `build-functions` and the current combined `deploy` script.
- [ ] Update `firebase.json` hosting output from `build` to `web/build`; leave the Functions source set to `functions`.
- [ ] Update CI/deploy commands to build each package explicitly with `npm --prefix web ...` and `npm --prefix functions ...`.
- [ ] Update `.gitignore`, `.vscode`, README instructions, environment-file locations, and any configuration that assumes the repository root is the Vite root.
- [ ] Search for `process.cwd()`, hard-coded `build/`, `src/`, `public/`, and config paths before and after the move.
- [ ] Confirm Vite still loads the intended `.env` files from `web/` and does not expose project-root secrets.
- [ ] Re-run the complete automated and manual baseline without changing package versions.
- [ ] Perform a Firebase Hosting preview and Functions emulator run; perform a non-production deploy if packaging differs from the preview.
- [ ] Refresh audit counts using package-local commands and update the progress ledger.

Retain separate lockfiles initially. Firebase CLI has some monorepo-aware module resolution, but the Functions source directory is still the deployment boundary. Consider a root npm workspace only as a later, independent proposal after proving clean installs, emulator behavior, and a non-production Functions deployment with a shared lockfile.

References:

- [Firebase CLI project and source-directory behavior](https://firebase.google.com/docs/cli)
- [Firebase CLI Node runtime module resolution](https://github.com/firebase/firebase-tools/blob/main/src/deploy/functions/runtimes/node/index.ts)

Phase 1D exit criteria:

- No application package manifest remains at the repository root.
- `web/` and `functions/` each install cleanly from their own npm lockfile.
- Web tests/build and Functions lint/build pass with package-local commands.
- Hosting preview serves `web/build`, and the Functions emulator discovers both v1 and v2 handlers.
- `git status` contains no generated build output or unintended environment files.

### Phase 2 — Critical vulnerabilities and unsupported runtimes

Work in this order, using separate pull requests where practical.

#### 2A. Node 22 runtime deployment — code complete, production deploy pending

- [x] Change `.nvmrc`, the root package engines, and the Functions package engines to Node 22; regenerate both npm lockfiles without changing dependency versions.
- [x] Validate clean installs, all 20 web tests, the web production build, and Functions lint/build on Node 22.23.2.
- [x] Install Firebase CLI 15.30.1 for the Node 22 nvm environment.
- [ ] From a clean tree on Node 22, run the direct production build and `firebase deploy`; note that the Hosting postdeploy hook runs `npm version patch`.
- [ ] Confirm both `patreon_login` and `patreon_login_v2` run on Node 22, inspect deployment logs, and smoke Patreon authentication success and failure.

##### 2A follow-up — Firebase Functions SDK family and security

- [ ] Update `firebase-admin` 11.11.1 -> 13.10.0.
- [ ] Update `firebase-functions` 6.6.x -> 7.3.2 after reviewing the v7 migration notes.
- [ ] Update Functions TypeScript 4.9.5 -> 5.9.3. Do not jump to TypeScript 7 while `typescript-eslint` supports `<6.1.0`.
- [ ] Update `@eslint/js` to 10.0.1, `eslint` to 10.10.0, and `typescript-eslint` to 8.70.0 as one lint-tooling group.
- [ ] Compile, lint, run emulator smoke tests, and deploy both v1 and v2 Patreon handlers to a non-production project.
- [ ] Confirm that `fast-xml-parser`, `protobufjs`, and `websocket-driver` critical findings are gone from the Functions production audit.

#### 2B. Replace the unmaintained Patreon client

- [ ] Extract shared Patreon callback logic so the v1 and v2 handlers do not duplicate it.
- [ ] Replace `@nathanhigh/patreon` with a small typed client using Node 22's built-in `fetch`, or an actively maintained official client if one is available at implementation time. Consider using a similar approach to what is done in https://github.com/cynicaloptimist/improved-initiative/
- [ ] Add tests for token exchange, identity/tier parsing, missing or malformed state, Patreon error responses, and redirect allow-listing.
- [ ] Remove `@nathanhigh/patreon`, `isomorphic-fetch`, and `node-fetch` from the resolved production tree.
- [ ] Treat redirect validation as part of this change: `state.finalRedirect` is currently accepted as an arbitrary URL.

#### 2C. Web Firebase critical paths

- [ ] Upgrade `firebase` 11 -> 12.19.0 in its own pull request if needed to clear the remaining `websocket-driver` path; Phase 1 already cleared `protobufjs`.
- [ ] Replace undeclared `@firebase/analytics` and `@firebase/storage` imports with supported `firebase/analytics` and `firebase/storage` entry points, or declare those packages explicitly if there is a documented reason.
- [ ] Exercise authentication, Realtime Database sync, Storage upload/delete, analytics initialization, and shared dashboard flows.

#### 2D. Remove the inactive CRA/Webpack stack

- [ ] Prove which files under `config/webpack*` and `config/webpackDevServer.config.js` are unreachable from current scripts.
- [ ] Migrate the current Jest suite to Vitest, or upgrade to Jest 30 if CRA-compatible behavior is still required. Prefer the option that lets the repository delete `react-dev-utils` and the copied CRA configuration.
- [ ] Remove unused Webpack-only loaders/plugins, Workbox integration, Tailwind integration if no stylesheet uses it, and stale CRA scripts/configuration.
- [ ] Remove unused test libraries (`@testing-library/react` and `@testing-library/user-event`) unless new tests use them.
- [ ] Remove `@types/react-pdf` and validate against `react-pdf`'s own types.
- [ ] Remove the ineffective npm `resolutions` entry; if an override is truly needed, use npm `overrides` with a documented expiry.
- [ ] Confirm the web package's critical `form-data` and `shell-quote` paths are gone.

Phase 2 exit criteria:

- Both dependency trees install and validate on Node 22.
- `npm audit --omit=dev` reports zero critical vulnerabilities in both trees.
- No no-fix production dependency remains without a time-bounded exception.
- The Functions emulator and a non-production deployment pass.

### Phase 3 — High-severity application dependencies

#### 3A. PDF stack

- [ ] Upgrade `react-pdf` 6.2.2 -> 11.0.0 with its compatible `pdfjs-dist`.
- [ ] Replace the legacy `react-pdf/dist/esm/entry.vite` import with the current worker configuration.
- [ ] Test local and remote PDFs, multipage navigation, outline rendering, worker loading, malformed files, and a known-safe regression fixture.
- [ ] Confirm the arbitrary-JavaScript advisory and all high `pdfjs-dist` findings are gone.

#### 3B. Remaining high findings

- [ ] Triage each remaining high finding by dependency path and runtime reachability.
- [ ] Prefer parent-package updates or removal over permanent transitive overrides.
- [ ] Document any finding that is build-only or unreachable, including evidence and an exception expiry no later than 90 days.
- [ ] Require zero unexplained production high findings before moving to routine modernization.

### Phase 4 — Moderate findings and major UI migrations

- [ ] Upgrade Excalidraw 0.14 -> 0.18.1; test load/restore, editing, persistence, collaboration-related data, and exported drawings.
- [ ] Upgrade MDX Editor 3 -> 4.2.4 to clear the remaining vulnerable `js-yaml` path; test links, card links, markdown round-tripping, and toolbar behavior.
- [ ] Resolve remaining moderate findings, prioritizing browser code that processes user-controlled content.

### Phase 5 — Remaining major-version modernization

Do these as separate dependency-family projects, not one bulk pull request:

- [ ] React 18 -> 19 with `react-dom`, `react-is`, type packages, and the chosen test stack.
- [ ] React Router 5 -> 7.
- [ ] Vite 6 -> 8 with `@vitejs/plugin-react` and SVG plugins.
- [ ] Styled Components 5 -> 6 and compatible Grommet validation.
- [ ] Font Awesome 6 -> 7 and React adapter 0.x -> 3.x.
- [x] React Grid Layout 1 -> 2. Completed before the Phase 1A/1B reconciliation; retained at 2.2.3 with package-provided types and CardGrid regression tests.
- [ ] Tailwind 3 -> 4 only if Tailwind is proven active; otherwise remove it.
- [ ] Review the remaining major-only packages (`@react-spring/web`, Jest/Babel, loaders, PostCSS plugins, Workbox, and utility packages) and either upgrade or remove them.

## Dependency hygiene backlog

- [ ] Reclassify build/test packages from the web package's `dependencies` to `devDependencies` after confirming the hosting build installs development dependencies.
- [ ] Remove unused `@fortawesome/free-regular-svg-icons`; current source imports only the solid icon pack.
- [ ] Verify all type packages against imports and packages that now ship their own types.
- [ ] Remove dead root packages discovered during the CRA/Vite cleanup rather than carrying them through majors.
- [ ] Update README instructions, which still describe Create React App behavior and commands that no longer exist.
- [ ] Add a monthly scheduled audit/update issue after critical and high debt reaches zero.

## Validation matrix

Before Phase 1D, run from a clean checkout with the pull request's target Node version:

```sh
npm ci
npm test -- --watchAll=false --runInBand
npm run build
npm audit --json
npm audit --omit=dev --json

npm --prefix functions ci
npm --prefix functions run lint
npm --prefix functions run build
npm --prefix functions audit --json
npm --prefix functions audit --omit=dev --json
```

After Phase 1D, use package-local commands for both sibling packages:

```sh
npm --prefix web ci
npm --prefix web run test:ci
npm --prefix web run build
npm --prefix web audit --json
npm --prefix web audit --omit=dev --json

npm --prefix functions ci
npm --prefix functions run lint
npm --prefix functions run build
npm --prefix functions audit --json
npm --prefix functions audit --omit=dev --json
```

For Firebase or authentication changes, also run the Local Emulator Suite and a non-production deployment smoke test. Record the Firebase CLI version used.

Manual browser smoke checklist:

- [x] Create, rename, switch, share, and delete a dashboard.
- [x] Resize cards from each handle, drag them, cross responsive breakpoints, reload, and confirm the RGL v2 layout persists.
- [x] Create/edit/save each card type.
- [x] Verify Markdown links and card links.
- [x] Draw, reload, and restore an Excalidraw card.
- [x] Upload and view a multipage PDF; confirm the worker is loaded from the intended origin.
- [x] Sign in/out, sync an account, and exercise Patreon login success and failure.
- [x] Open shared and player views.
- [x] Check the production bundle for unexpected size or chunk-count regressions.

## Progress ledger

| Date | Change/PR | Status | Node | Web/root audit C/H/M/L | Functions production C/H/M/L | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-09-10 | Initial audit | Complete | Root 20.20.2; Functions declares 18 | 4 / 31 / 18 / 15 | 3 / 18 / 7 / 1 | Root tests/build pass; Functions install/build/lint pass |
| 2026-09-10/11 | Phase 1A/1B combined compatible web batch | Complete | 20 temporarily | 3 / 25 / 17 / 14 | n/a | Committed as `f880914`; clean install, dependency tree, 4 suites/10 tests, build, manual smoke, and bundle review pass; no-active-campaign linking follow-up is `93a5437` |
| TBD | Phase 1C compatible Functions updates | Not started | 22 | n/a | TBD | Remove redundant Functions Yarn lock |
| TBD | Phase 1D sibling package layout | Not started | 22 | TBD | TBD | Structure-only move; Hosting preview and Functions emulator required |
| 2026-09-16 | Phase 2A Node 22 runtime baseline | Awaiting production deploy | 22.23.2 | n/a | 3 / 18 / 7 / 1 | Runtime commit `f4c34c3`; clean installs, 5 suites/20 tests, web build, and Functions lint/build pass; direct deploy and production smoke remain |
| TBD | Phase 2A Firebase Functions SDK/security | Not started | 22 | n/a | TBD | Upgrade Admin/Functions SDKs after the runtime baseline deploy |
| TBD | Phase 2B Patreon replacement | Not started | 22 | n/a | TBD | No-fix dependency must be removed |
| TBD | Phase 2C web Firebase | Not started | 22 | TBD | n/a | Resolve the remaining Firebase `websocket-driver` critical path |
| TBD | Phase 2D legacy toolchain removal | Not started | 22 | TBD | n/a | Reclassify dependencies after cleanup |
| TBD | Phase 3 high findings | Not started | 22 | TBD | TBD | Zero unexplained production highs required |

## Definition of done

- Node 22 is used consistently for local development, CI, builds, and Firebase Functions.
- The browser application lives in `web/`; `web/` and `functions/` are sibling package contexts, with no application manifest at the repository root.
- npm is the sole package manager and each tree has one committed lockfile.
- Clean installs, tests, builds, lint, emulator checks, and staging deployment pass.
- Production audits contain no critical or high vulnerabilities.
- Any remaining development-only moderate/low finding has a documented dependency path and disposition.
- Direct dependencies are limited to packages actually imported at runtime; build and test tooling is classified as development-only.
- CI and scheduled dependency checks prevent the repository from returning to the current level of drift.
