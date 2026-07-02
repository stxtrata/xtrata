# Production cutover: xtrata-1.0 → xtrata-2.0

Safe, ordered, reversible. Nothing in this plan deletes or modifies xtrata-1.0 —
it stays in the repo permanently as the archived reference. The switch is one
Cloudflare build setting; everything else is verification and rollback insurance.

**Current state (2026-07-02):** work lives on branch `main-f5-optim` with both
folders committed. Production domain is served by the git-connected Cloudflare
Pages project **xtrata** (root dir `xtrata-1.0`). The direct-upload project
**xtrata-2-0** (xtrata-2-0.pages.dev) is the staging mirror and already has
`HIRO_API_KEY` set.

**One prerequisite to confirm in the dashboard before starting:** which branch
the `xtrata` Pages project treats as *production* (Settings → Builds &
deployments → Production branch). The plan assumes `main`; substitute if not.

---

## Phase 0 — Freeze and back up (10 min)

```bash
cd /Users/melophonic/Documents/GitHub/xtrata

# commit everything outstanding (there is at least one untracked plan doc)
git add -A && git commit -m "Pre-cutover snapshot: final 1.0 + 2.0 state"

# permanent, named recovery points
git tag v1.0-final-pre-cutover
git branch backup/pre-2.0-cutover-$(date +%Y%m%d)
git push origin main-f5-optim --tags
git push origin backup/pre-2.0-cutover-$(date +%Y%m%d)

# optional offline archive of 1.0 source (excludes junk)
zip -rq ~/Desktop/xtrata-1.0-backup-$(date +%F).zip xtrata-1.0 \
  -x "*/node_modules/*" "*/dist/*" "*/.wrangler/*"
```

Checkpoint: `git tag -l | grep pre-cutover` shows the tag; zip exists.

## Phase 1 — Prove 2.0 from a cold start (15 min)

```bash
cd xtrata-2.0
rm -rf node_modules dist
npm install
npm run build                      # must finish with the x-board aliases line
npx vitest run                     # must be fully green
npm run test:contracts             # sync + verify pass

# build output sanity
ls dist/index.html dist/workspace.html dist/_redirects dist/_headers \
   dist/agent-one/index.html dist/agent-one/suno.html dist/agent-one/manifests.html
```

Checkpoint: all green. Any failure stops the plan here — nothing has changed anywhere.

## Phase 2 — Final staging soak on xtrata-2-0.pages.dev (same day)

```bash
npx wrangler pages deploy dist --project-name=xtrata-2-0
```

Manual pass on https://xtrata-2-0.pages.dev — the ten-minute checklist:
1. Homepage loads; theme switch; Radio toggles on/off with tuning sound.
2. Wallet connect (Xverse) → BNS name appears in status + readout.
3. Explorer browse + one early inscription (#1–#5) renders in a gallery/preview
   (client ladder covers migrated v1 content until the runtime chain work ships).
4. Wizard `/agent-one/` estimate on a small file; SUNO page `?mock=1` full flow.
5. `/manifests` — load holdings, build, validate, preview.
6. `/g/<your-name>.btc` resolves; `/web/migrate.html` connect + scan (stop after scan).
7. Forever Twins landing + one collection page; live counts populate.

Checkpoint: nothing broken that isn't also broken on production 1.0.

## Phase 3 — Merge to the production branch (no visible change yet)

```bash
cd /Users/melophonic/Documents/GitHub/xtrata
git checkout main && git pull origin main
git merge --no-ff main-f5-optim -m "Promote xtrata-2.0 (site still builds 1.0 until root-dir switch)"
git push origin main
```

This triggers a production deploy that STILL builds from `xtrata-1.0` — by
design. Verify production is unchanged (same bundle hash as before the push):

```bash
curl -s https://xtrata.xyz/ | grep -o 'main-[A-Za-z0-9_-]*\.js'
```

Checkpoint: production identical; 2.0 folder now present on `main`.

## Phase 4 — The switch (dashboard, ~1 min, instantly reversible)

Cloudflare dashboard → Workers & Pages → **xtrata** → Settings → Builds & deployments:

| Setting | Old | New |
|---|---|---|
| Root directory | `xtrata-1.0` | `xtrata-2.0` |
| Build command | `npm run build` | unchanged |
| Build output directory | `dist` | unchanged |
| Env vars (HIRO_API_KEY, allowlists…) | — | untouched (project-level) |

Then trigger the build:

```bash
git commit --allow-empty -m "Build production from xtrata-2.0" && git push origin main
```

Watch the deploy in the dashboard until it succeeds.

## Phase 5 — Post-switch verification (5 min)

```bash
# new bundle serving (hash must differ from Phase 3's)
curl -s https://xtrata.xyz/ | grep -o 'main-[A-Za-z0-9_-]*\.js'

# 2.0-only routes now exist on the production domain
curl -sI https://xtrata.xyz/manifests            | head -1   # 200
curl -sI https://xtrata.xyz/agent-one/suno       | head -1   # 200
curl -s  https://xtrata.xyz/g/nosuchname 2>&1    | head -3   # JSON error (function alive)
curl -s  https://xtrata.xyz/hiro/mainnet/v2/info | head -c 80 # API proxy + key OK

# headers/redirects made it
curl -sI https://xtrata.xyz/opus-file-generator/ | grep -i cross-origin
```

Browser: hard-refresh (Cmd+Shift+R), repeat the Phase 2 checklist quickly, and
confirm wallet connect + one real read-only flow (view a wallet's inscriptions).

## Phase 6 — Rollback options (keep this section handy for 48h)

Fastest first:
1. **Instant:** dashboard → xtrata → Deployments → last 1.0 deployment → *Rollback*.
   Zero rebuild; production is back on 1.0 in seconds.
2. **Config revert:** flip Root directory back to `xtrata-1.0`, retry deploy (~2 min).
3. **Git revert:** `git revert -m 1 <merge-sha> && git push` — only needed if a
   2.0 commit itself must come off `main`; combine with option 2.

## Phase 7 — Aftercare

- Soak 48h; watch Cloudflare analytics for error-rate changes and the functions
  log for `/g`, `/hiro`, `/runtime` failures.
- Keep `xtrata-1.0/` in the repo untouched (it is the rollback substrate and the
  archive). Revisit only after weeks of stability, and even then archive rather
  than delete.
- The direct-upload `xtrata-2-0` Pages project becomes the permanent staging
  target: deploy there first, production follows via git.
- Next scheduled work: RUNTIME-LEGACY-CHAIN-PLAN.md (removes the client-side
  content ladders properly).
