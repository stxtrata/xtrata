# Xtrata 2.0 Migration Plan

**Goal:** a new `xtrata-2.0/` folder containing only the core app, in a clean directory layout, with duplication and dead weight removed. The built site must look and behave exactly like 1.0.

**Scope (agreed):** core app only — homepage, `src/`, `functions/`, `public/`, live contracts, Agent One wizard, configs. Side projects stay in 1.0. The `index.html` monolith gets split into modules.

---

## 1. What the app actually is (audit findings)

- **Homepage** = `index.html`, 14,014 lines: ~3,700 lines of inline CSS, ~9,700 lines in a single `<script type="module">`. It is bundled by Vite and already imports from `src/lib` (e.g. `/src/lib/wallet/adapter.ts`), so the monolith and the React app share code paths.
- **React app** = `src/` (284 TS/TSX files) with entries `workspace.html`, `lab26/`, `web/migrate.html` via `vite.config.ts`.
- **Agent One** = `src/agent-one/` bundled by two extra Vite configs into `xtrata-agent-one/wizard/agent-one.js` and `agent-one-wallet.js`; the wizard is a static site copied into `dist/agent-one` post-build.
- **Backend** = Cloudflare Pages `functions/` (rpc, hiro, bnsv2, collections, inscription, prices, etc.).
- **Deployment** = `vite build` + `scripts/copy-static-apps.mjs` assembling `dist/`.
- Repo is **980 MB**; the core app is roughly 10 MB of source.

## 2. Duplication and dead weight identified

| Item | Problem | 2.0 action |
|---|---|---|
| `PEPE_ESCROW_RESOLVERS` in index.html vs `src/lib/twins/registry.ts` | Kept "in lockstep" by hand (per AGENTS.md) | Single source: import the registry from `src/lib/twins` into the homepage modules |
| index.html inline JS (~9,700 lines) | Un-treeshaken monolith, shares logic with `src/lib` | Extract to `src/home/*.ts` ES modules; keep `index.html` as thin shell |
| index.html inline CSS (~3,700 lines) | Unmanageable, duplicated tokens | Extract to `src/home/styles/*.css` imported by the entry module |
| `xtrata-agent-one/wizard/{favicons,homepage-wireframe,runtime,x-board,manifest.json,_headers,_redirects}` | Duplicates of `public/` copied into the wizard | Serve from single `public/`; wizard keeps only its own files |
| `wizard/agent-one.js`, `agent-one-wallet.js` | Build artifacts committed in source tree | Build into `dist/` only; never committed |
| Two `node_modules` trees (509 MB + 60 MB in xtrata-agent-one) | Wizard has its own package.json for a dev server | Fold wizard tooling into root package.json (one install) |
| 11× `vitest.config.ts.timestamp-*.mjs` | Vitest crash junk | Exclude; add to .gitignore |
| `functions/rpc` vs `functions/rpc-testnet` | Near-identical proxy functions | One parameterised proxy module shared by both routes |
| Version-pinned scripts (`testnet-v3.2.1/2-rehearsal`, `mainnet-v3.2.1/2/3-handover`) ×9 + matching `src/mainnet-*.ts` | Copy-paste per release | One script driven by a version/config arg; archive old ones in 1.0 |
| `dist/`, `forever-twins.zip`, `*.txt` bug reports, `homepage-themes.html`, `.wrangler`, `.DS_Store`, `.artifacts` | Build output / one-off reports in repo root | Excluded from 2.0 |
| Side projects: `recursive-apps` (116 MB), `flowproof` (82 MB), `contracts/*` non-live (most of 93 MB), `forever-twins`, `opus-file-generator`, `suno-more`, `umg`, `Launch-Campaign`, `Dora-Hacks`, `LetafricaBuild`, `lab26` experiments, `OPTIMISATION`, `Refactor-Plans`, `reports`, `AAA-Collection`, `ledger-native-systems`, `protocol-primitives`, `xtrata_inscription_holder_count` | Not part of the core app | Stay in 1.0. `copy-static-apps.mjs` in 2.0 references them by relative path (`../xtrata-1.0/...`) or drops them, per §5 |

## 3. Target directory structure

```
xtrata-2.0/
├── index.html              # thin shell: markup only, links CSS + one module script
├── workspace.html
├── package.json            # single manifest, pruned scripts
├── vite.config.ts          # merged: main + agent-one + wallet targets
├── tsconfig.json  .eslintrc.cjs  .prettierrc  .env.example  wrangler.toml
├── public/                 # single copy of favicons, manifest, runtime, _headers…
├── src/
│   ├── main.tsx  App.tsx …          # React app (unchanged behaviour)
│   ├── home/                        # ← extracted homepage monolith
│   │   ├── main.ts                  # entry; composes modules below
│   │   ├── styles/                  # extracted CSS (tokens, layout, components)
│   │   ├── state/  api/  ui/        # split by concern during extraction
│   │   └── …
│   ├── agent-one/                   # wizard core + wallet shim (as now)
│   ├── lib/                         # shared libs — single source of truth
│   └── components/  config/  data/  admin/
├── functions/              # Cloudflare functions, rpc proxy deduped
├── contracts/live/         # live contract sources only (+ clarinet tests)
├── agent-one-wizard/       # wizard HTML/site only (no dupes, no node_modules)
├── scripts/                # pruned: manifest gen, copy-static-apps, one parameterised release script
└── docs/                   # app-reference.md, assumptions.md, contract-inventory.md only
```

## 4. Monolith split strategy (index.html)

1. **CSS first (low risk):** move `<style>` blocks verbatim into `src/home/styles/home.css`, import from the entry module. Byte-identical rules → identical rendering.
2. **JS extraction (incremental):** move the single 9,700-line script into `src/home/main.ts` unchanged, confirm the built site works, then split into modules by existing section boundaries (wallet, explorer, mint flow, campaign panels, fullscreen viewer…). No behaviour changes — moves and imports only.
3. **Dedupe against `src/lib`:** replace inlined copies (twins resolvers, wallet adapter glue, network constants) with imports from `src/lib/**`. Each replacement verified individually.
4. Vite bundles it all; `manualChunks` config carried over.

## 5. Build pipeline in 2.0

- One `vite.config.ts` with three build targets (main app, agent-one IIFE, wallet IIFE) via `npm run build` orchestration — same outputs as today (`dist/agent-one/agent-one.js` etc.).
- `copy-static-apps.mjs` kept but pointed at the sub-apps' new home. Decision needed at build time: either (a) reference `../xtrata-1.0/<app>` so the full site still assembles, or (b) 2.0 builds core-only and 1.0 remains the assembly repo for side apps. Recommend (a) initially — zero user-visible change.
- Pruned npm scripts: dev, build, test, lint, contracts:sync/verify, one release script.

## 6. Verification (must pass before 2.0 is "done")

1. `npm run build` succeeds; `dist/` structure matches 1.0's (same routes/files present).
2. Serve 1.0 and 2.0 builds side by side; screenshot-compare homepage, workspace, wizard, explorer, mint flow states.
3. `npm test` (vitest + contract sync/verify + clarinet) green.
4. Manual smoke of critical flows: wallet connect, collection browse, Inscription Wizard end-to-end on testnet, Forever Twins escrow display.
5. Diff check: every file in 2.0 either copied verbatim from 1.0 or listed in a change log with reason.

## 7. Execution order

1. Scaffold `xtrata-2.0/`, copy configs + `public/` + `functions/` + `src/` + wizard + `contracts/live` verbatim (minus junk). Build, verify parity. **← safe checkpoint**
2. CSS extraction → verify.
3. JS extraction (move-only) → verify.
4. Module split + dedupe against `src/lib` → verify per step.
5. Wizard cleanup (remove duplicated static shells, fold node_modules) → verify wizard build.
6. Functions/scripts dedupe → verify.
7. Full verification pass (§6), write CHANGELOG-2.0.md.

Estimated result: repo drops from ~980 MB to ~15 MB of source (plus one node_modules), one build entry point, no hand-synced duplicate logic.
