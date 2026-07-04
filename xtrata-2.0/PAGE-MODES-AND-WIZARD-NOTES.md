# Page modes + Inscription Wizard restructure — change notes (2026-07-04)

One change set, three goals: (1) move the inscribe panel off the homepage into its own
page alongside Xplorer- and My-Wallet-style pages, (2) rename the public wizard path
from `/agent-one` to `/wizard`, (3) railroad both inscribe flows so the default path is
"drop a file → pay → inscribed" with everything else optional and expandable.

## 1 · Site: one shell, four pages (the data-page router)

`src/home/main.js` was deliberately NOT split — CHANGELOG-2.0.md already flags that
fragmenting its shared `state`/`dom` scope without in-browser smoke tests is pure
regression risk. Instead the proven `/xplorer` pattern (one shell, URL-driven mode) was
extended into a general page router:

- **`index.html <head>`** — a tiny pre-paint script classifies the URL into
  `home | inscribe | xplorer | my-wallet`, sets `document.documentElement.dataset.page`
  and the document title. Runs before CSS applies, so there is no flash of the wrong
  panels (this also fixes the old flash of homepage content on `/xplorer`).
- **`src/home/styles/home.css`** — a page-modes block appended at the END of the file
  (appended last on purpose: `:root[data-page=…]` rules must win specificity ties
  against `body.has-ledger` / `body.explorer-mode`). Each page shows only its panels:
  - `/` — hero, SUNO More / Forever Twins mode cards, four new tool cards, docs.
    Workspace panels hidden.
  - `/inscribe` — inscribe panel only, centred single column.
  - `/my-wallet` (alias `/wallet`) — wallet/ledger panel only: lookup, example
    galleries, grid, transfers.
  - `/xplorer`, `/x/:id` — existing explorer-mode behaviour, unchanged.
- **`src/home/main.js`** — additive changes only, no element removed, no listener
  dropped: a `PAGE_MODE` constant; `initialize()` only runs the default grid preload
  (own wallet or Music-by-Various) on `my-wallet`; `/xplorer` now force-enables
  explorer mode even for malformed `/x/…` ids; the intro "Inscribe a file" button and
  the topbar "View inscriptions" button navigate to `/inscribe` / `/my-wallet` when the
  target panel is not on the current page.
- **Deep links all preserved**: `/x/:id`, `?view=explorer`, `?token=`, `?wallet=`
  (classified as my-wallet), curated galleries, and the Opus-generator handoff
  (`/?handoff=…` is classified as inscribe, so the handed-off player lands visible).
- Nav + landing cards use `target="_self"` deliberately — the global "open internal
  links in a new tab" radio-preservation rewrite skips links that already carry a
  target, and the radio restores itself from localStorage across same-tab navigation.

### Adding a page later
Extend the head router, append a `:root[data-page='x']` CSS block, gate any boot data
loads on `PAGE_MODE`, and add a `/route / 200` line to `public/_redirects`.

## 2 · Inscribe page: drop-first, auto-prepare

`index.html` form reordered and simplified; `main.js` railroads it:

- Dropzone is the first field; name + type auto-fill from the file (existing
  `setSelectedFile` behaviour) and the payload now **auto-prepares on drop**
  (`autoPrepareHook` → the same handler as the Prepare button, guarded against
  re-entry/busy). Default flow is drop → "Start inscription".
- "Write text instead", "Advanced — type & token URI", and "Relationships — add
  parents" are collapsed `<details>` expanders; all element ids inside are unchanged,
  so every `dom.*` reference in main.js still resolves (audited: 98 referenced ids,
  0 missing — the only 4 misses, `fullscreenButton`/`intro*Value`, were already absent
  before this change and are null-guarded).
- Cross-link to the wizard for large files / managed flow.

## 3 · Wizard: `/agent-one` → `/wizard`, public-facing rename only

- `scripts/copy-static-apps.mjs` now targets `dist/wizard`.
- `public/_redirects`: permanent 301s from `/agent-one`, `/agent-one/*` and
  `/inscription-wizard*` to `/wizard/…`; `/manifests` rewrite retargeted; new page
  routes (`/inscribe`, `/my-wallet`, `/xplorer`, `/wallet`) added.
- `public/_headers`: COOP/COEP cross-origin isolation stays scoped to
  **`/wizard/suno` only** — the main wizard page must remain non-isolated or the
  wallet popup flow breaks (this is also why the new optimiser uses the
  single-threaded ffmpeg core, below). `no-cache` rule moved to `/wizard/*.js`.
- Links updated: homepage SUNO hero, `public/bip110.html`, `public/radio.html`,
  radio ticker strings in `src/home/radio.js` (bundle `public/xtrata-radio.js`
  regenerated via `build:radio`), wizard-folder `_redirects`/`_headers`, and
  Agent-One branding in `suno.html` / `manifests.html`.
- **Unchanged on purpose** (user decision — zero build risk): `xtrata-agent-one/`
  folder name, `src/agent-one/` sources, `vite.agent-one*.config.ts`, and the
  `agent-one.js` / `agent-one-wallet.js` bundle filenames.

## 4 · Wizard redesign: the railroad

`xtrata-agent-one/wizard/index.html` rebuilt as a single vertical flow — no tabs, no
up-front decisions:

1. **Drop** — one large dropzone (compacts to a chip once a file lands).
2. **Review** — type/URI auto-detected (`EXT` map unchanged); audio auto-optimises
   (below); the quote runs automatically (now includes `parentCount`, which the old
   manual estimate omitted) with the full fee breakdown in a collapsed "Cost
   breakdown". Two expanders hold everything optional: **Options** (category/type
   override, URI, manual delivery, margin) and **Relationships** (deps + parents, link
   to the graph composer).
3. **Pay** — one button, `Inscribe — pay X STX`: connects the wallet if needed,
   creates the job (fast-track + `expectedFunder` lock by default) and opens the
   wallet payment immediately.
4. **Progress/Done** — the active job renders inline (deposit card, countdowns, the
   full parent-escrow checklist with one-click "Send #id to deposit now", phase
   progress) and finishes with receipt + "View on Xplorer" + "Inscribe another file".

Demoted, not removed: the jobs table lives in a collapsed **History** section (an
unfinished-jobs notice appears on load when relevant); the dependency-graph composer
is an **Advanced** expander with all original logic (its "send to wizard" now prefills
deps and asks for the file via the dropzone — the dead server-path input was removed;
backendless mode never accepted server paths anyway).

Job lifecycle, parent-escrow, refund and receipt logic were ported **verbatim** from
the tabbed wizard; `renderJob` became `renderJobDetail(jobId, container, isActive)` so
the active flow and a history selection can render simultaneously (countdown timers
remain active-job-only). `?mock=1` rehearsal works end to end.

### New: `xtrata-agent-one/wizard/optimize-audio.js`
Auto-converts dropped mp3/wav/flac/aiff/m4a/aac/ogg to Opus-in-WebM (`.weba`) with the
exact Music-HQ preset + Audional/Xtrata tags from `suno-build.js` /
AUDIO_OPTIMIZATION.md, then quotes on the smaller file. A toggle reverts to the
original; "already efficient" results keep the original automatically.
**Key constraint:** it loads `@ffmpeg/core-st@0.11.1` (single-threaded,
`mainName:'main'`) so the page needs no SharedArrayBuffer and therefore no isolation
headers — slower encodes, intact wallet. Fail-safe by design: engine unavailable,
timeout (240 s), user skip, or a ≥95 % output all fall back to the original file.

## Verification

- Full pipeline in a clean Linux env: manifests → agent-one-wallet → agent-one →
  radio → main vite build → `copy-static-apps` (emits `dist/wizard/…`). Green.
- `npx vitest run`: **713/713 across 135 files.**
- Static audits: every id referenced by `main.js` exists in `index.html`; every id in
  the new wizard script exists in its markup (58/58); no leftover refs to removed
  wizard elements; `dist/` greps clean of stale `/agent-one` links (only the
  intentional 301 lines and the kept bundle filenames remain).
- Not run here: `npm run lint` — a fresh install resolves
  `eslint-plugin-react-refresh@0.4.26` (`^0.4.6` range), which ships an ESLint-9-style
  config that ESLint 8 rejects. Environmental; consider pinning `0.4.19`.
- Recommended manual smoke before deploy: one real fast-track inscription, one
  `?mock=1` rehearsal, one audio drop (watch the optimiser row), and a click around
  `/` → `/inscribe` → `/xplorer` → `/my-wallet` with a connected wallet.
