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

---

# Round 2 — new-layout branch follow-ups (2026-07-04)

## Wizard
- **Live parent ownership check** — `window.XtrataAgent.ownerOf(id)` exposed from
  `src/agent-one/agent-core.ts` (read-only `get-owner`); the Relationships expander
  verifies each parent id as you type (debounced 500 ms) and on wallet
  connect/disconnect: green "owned by your connected wallet", red "no owner found" /
  "owned by <addr>", amber "connect to confirm". MOCK mode shows a neutral note.
- **The "use original" box explained + fixed** — that row is the automatic audio
  optimiser (mp3/wav/flac… → Opus HQ before quoting). The perpetual spinner was the
  ffmpeg.wasm ENGINE LOAD having no timeout (a stalled CDN fetch spun forever, and
  Skip only took effect between steps). Now: 30 s engine-load timeout (+ retry on next
  file), Skip resolves instantly via a race (late encoder results are discarded),
  clearer copy ("Audio optimisation: …", "Use the original file instead"), and every
  failure path degrades to "inscribe the original as-is".
- **Working preview before committing** — the review card renders the EXACT bytes to
  be inscribed: images/video inline, audio with controls (A/B the Opus conversion via
  the revert toggle), HTML in a sandboxed iframe (note: on-chain `/inscription/…`
  refs resolve only after inscription), PDF inline, text/JSON excerpt (20 KB cap),
  byte-for-byte note for other types. Object URLs revoked on change/reset.

## Site
- **Connect → My Wallet** — an explicit connect on the landing page loads holdings
  and, if any exist, routes to `/my-wallet`; a restored session shows an
  "Open My Wallet" intro button instead (no surprise redirect on every visit).
- **Stuck Prev/Next fixed (root cause)** — both `loadExplorerPage` and
  `loadWalletPage` ran code between `walletLoadingPage = true` and their `try`
  blocks; any throw there (cache prime, grid render, status write) stranded the flag
  and permanently disabled the pager. Both loaders now run under a single
  try/finally (`pageIds` hoisted so the finally can never hit a TDZ), and the
  Prev/Next click handlers surface load errors in the grid status instead of
  unhandled rejections.
- **Sticky condensing header** — `.site-header` wraps topbar + nav (+ docked radio):
  sticky at top, slimmer baseline, condenses further past 24 px of scroll
  (logo 28 px, single-line wallet readout, tighter buttons). Toggled by a passive
  scroll listener; all previous header elements/ids unchanged.
- **My Wallet = personal ledger only** — wallet lookup and example chips removed
  from the page; the layout caps the grid column at
  `clamp(320px, 100vh - 300px, 560px)` so the full 4×4 grid is on screen with a
  sticky preview beside it (stacks below 900 px).
- **Examples & lookup relocated** — landing page gets a "View examples" strip of
  plain links; `?gallery=<id>` and `?wallet=/?showcase=` (+`&sel=<tokenId>`) are
  Xplorer-page deep links handled in `initialize()` (BNS names go through the
  lookup path, addresses direct). The lookup form itself is wrapped in a collapsed
  "Look up any wallet or .btc name" details, hidden on My Wallet, shown on the
  Xplorer (overrides the explorer-mode hide with higher specificity).

## Radio
- **Fullscreen mode** — click the XTRATA FM logo on the receiver screen (or the
  docked header pill) to toggle a fullscreen overlay (Esc / ✕ / logo exits, hint bar
  explains); pure CSS state on the same element so playback is never interrupted.
  `XtrataRadio.setFullscreen/toggleFullscreen/isFullscreen` exposed.
- **Listener deep link** — `/?radio=fullscreen` (also full/fs/1/on) opens the
  homepage with the receiver already fullscreen; a fresh session shows
  "TAP ANYWHERE TO START" (autoplay needs one gesture), a resumed session just plays.
- **Header dock** — `initXtrataRadio({ mount })`: the homepage mounts the radio in
  the nav's `.radio-slot` as a compact pill (fullscreen on click); standalone pages
  keep the floating bottom-left widget. Docked mode never persists the min/max pref.
- **Tab/window switching** — audio was never paused on tab switch (no
  visibilitychange handler); background tabs keep playing. The remaining gap is
  same-tab NAVIGATION (browser autoplay policy requires a gesture after a page
  load): position is persisted every 1.5 s and restore auto-plays when the browser
  allows, else one tap resumes. True gapless same-tab navigation would need an SPA
  shell — noted as a possible future step, not attempted here.

## Verification (round 2)
- agent-one, radio and main vite builds green in a clean env; `copy-static-apps`
  emits dist/wizard with the new files; vitest **713/713**; id audits clean
  (main.js 101 referenced ids all present; wizard 63/63); regenerated
  `public/xtrata-radio.js` committed.

---

# Round 3 — SPA tabs, Xplorer navigation upgrades, My Wallet fit (2026-07-04)

## SPA tabs — the radio never stops
The four site pages already shared one shell, so tab-style switching was the
natural next step: same-tab site links (nav, landing cards, example chips,
intro buttons, the connect→My Wallet hop) are intercepted, `history.pushState`
updates the URL, and `switchToPage()` swaps `data-page` + runs that page's
loads — **no reload, so the radio, wallet session and summary caches all
survive**. `popstate` re-classifies on back/forward. Leaving the Xplorer clears
`explorerMode`/gallery state so its CSS can't suppress other pages' panels.
`/wizard`, `/g/…` and static apps still navigate normally (different
documents); the radio restores from its saved position there. `PAGE_MODE`
became mutable; shared view logic extracted into `openPublicViewFromParams()`
and `openMyWalletDefaultView()`.

## Xplorer navigation
- **Smart jump field** — one "Go to:" input: `512` / `#512` → inscription,
  `p12` / `page 12` → page (old page input hidden but functional under it).
- **Random** — jumps anywhere in 1…latest; rolls within the matching set when
  filters are active and indexed.
- **Keyboard** — ←/→ turn pages, ↑/↓ move the selection (Xplorer + My Wallet);
  disabled while typing, with modifiers, or when the fullscreen viewer is open.
- **Shareable position** — `/xplorer?p=12` deep-links a page; plain grid views
  keep `?p=` in the address bar (token selections still write `/x/<id>`).
- **Idle prefetch** — neighbouring pages' summaries warm the cache via
  `requestIdleCallback`, so Prev/Next are usually instant.
- **Filter chips always visible** — the popover flattens into an inline chip
  row in explorer mode (toggle button hidden; Clear filters kept).
- **Back affordance** — public wallet/gallery views on the Xplorer page show
  "← Back to the Xplorer".

## My Wallet fit (screenshot feedback)
The preview column was `1fr` and exploded on wide screens. Now the grid column
is `clamp(300px, 100vh - 330px, 540px)` and the preview column
`clamp(230px, 100vh - 560px, 310px)`, with compacted panel chrome and preview
meta — full 4×4 grid plus preview square, metadata, relationships and send
controls fit on screen without scrolling (stacks below 900 px).

## Verification (round 3)
Main build green; vitest **713/713**; id audit clean (102 ids); structural
greps for smart field / random / back link / classifyPath / popstate all pass.
