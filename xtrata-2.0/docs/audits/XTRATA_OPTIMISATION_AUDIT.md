# Xtrata 2.0 optimisation audit

## Executive summary

*Written last, after all four passes. Section numbering below is pass 1's and has been left alone so its ~40 internal cross-references still resolve — which is why this summary is not numbered §1.*

**The repository is in good health, and the code is better than the process around it.** Four passes read the whole `xtrata-2.0/` subtree: its structure and branch drift, three weeks of change, the transaction and key-handling paths, and finally the money and leakage paths. Nothing found rises to a P0. Three findings are P1: two in the browser inscription agent, neither a recent regression, and one in how every mint surface except the homepage works out what the contract will charge.

**On the question that mattered most: self-custody holds.** The only code path that could send a deposit key off the user's machine is dormant and cannot be switched on from any shipped page. Key export strips keys. No key material reaches logs, URLs, analytics or error reporting. On the leakage side the result is nearly as clean: no build secret reaches the bundle we can inspect — `vite.config.ts` loads every environment variable including unprefixed ones and deliberately puts only a *boolean* into the client, keeping the Hiro key server-side — and the telemetry pipeline hashes wallet addresses with a server-side salt and fails closed when that salt is missing. These are not accidents; the code says why it does each of them. The one blemish is a naming collision rather than a mistake in that code: the Cloudflare Functions accept `VITE_HIRO_API_KEY` as a server-side key name, and `VITE_` is the prefix that makes a variable public. Two deleted lines close it.

**The pattern behind the largest finding is worth naming on its own.** The same decision — what will this mint cost, what caps it, what kind of media is this — is implemented separately on each surface, and every recent fix has landed on exactly one of them. The homepage now asks the contract for its fee; the public collection page and the two admin screens still model it from a single variable the contract stopped using alone. The homepage's fee post-condition was corrected; two admin screens still carry the version that aborts. The media-kind check was fixed at one call site; eight others repeat it inline. None of these is a hard problem. They recur because there is no single place to fix them, and one commit in the window (`3026a159`, sponsored buy) shows exactly what fixing that looks like.

**Recent change quality is high and, unusually, self-documenting.** Every substantive commit in the three-week window ships tests alongside it. Two habits are better than typical: a fault-injection harness landing in the same commit as the bug it found, and commits that state their own negative controls ("restoring the impossible condition fails 3 of the 10 new tests"). Where the author shipped something unverified, the commit message says so — which is the only reason that pattern is auditable at all. Duplication is actively removed rather than accumulated: two separate commits in the window exist purely to collapse copied code, and the largest new subsystem opens by refusing to reimplement minting.

**Where the fast iteration shows is not in the code, it is around it.** Diagnoses shipped before verification (three wrong root causes in sequence on one bug; a revert that blanked a live page). Layout iterated four times to undo its own first approach. `.gitignore` extended reactively, once after a real run nearly staged a wallet key. And two documented invariants are enforced by discipline alone, with no test behind them — one of which was violated once.

**The most important actions.** First, and it takes minutes: read two fee numbers off the deployed contract. The app builds its spend cap for the public collection mint page out of one contract variable when the contract charges from five, and depending on how those five were last set, that cap is either a safe over-estimate or roughly four times too low — in which case every collection mint on that path is paying the opening fee and all the upload fees and then failing at the final step. Nothing in the repository can tell you which; two read-only calls can. Second, merge: 37 commits and ~28k lines have been queued on `main-staging` since a cadence that ran at six merges in two days, and the backlog contains the fix for a defect live on production right now — every market listing renders the same picture, because the page is displaying a contract's existence probe as though it were the artwork. Merging *is* that fix. Then take the sixteen quick wins, of which one is a three-line change in the wizard: the fee it charges is 10% of whatever arrives at the deposit address, while the quote it displays is 10% of what it asked for, so anyone who rounds their payment up is overcharged against a disclosed number. Third, the two agent P1s are one problem seen twice — the agent decides what to broadcast from confirmed chain state, and nothing stops two browser contexts deciding at once — and both fixes already exist in prototype elsewhere in this repository.

**One thing only you can answer.** A code-complete parallel rebuild of the collection and drops stack sits on a branch nothing in the documentation mentions, while the main line spent the same week building a different harness for the same job. Whether those are alternatives or complements changes what a good part of the structural work is worth.

Full findings: §4 (pass 3) and §4b (pass 4). Actions: §5 quick wins, §6 structural, §8 order, §10 open questions. Start here is at the end of the document.

---

Read-only audit of the `xtrata-2.0/` subtree. Nothing outside this file was created, modified or deleted. The only ref-writing command run was `git fetch --all --prune`. No worktrees were created: every other-branch inspection used read-only plumbing (`git log`, `git diff`, `git show`, `git ls-tree`, `git rev-list`, `git merge-base`, `git for-each-ref`), none of which touches the working tree, so the worktree mechanism the brief permits was not needed.

| | |
|---|---|
| Audit date | 2026-08-01 |
| Pass | 1 of 4 — repository mapping and branch drift |
| Scope | `xtrata-2.0/` only. Git history spans the repo; commits touching only sibling subtrees (`Narrate-AI-v2`, `Audionals`, `cicada-v3`, …) are out of scope. |
| Working directory | `/Users/melophonic/Documents/GitHub/xtrata` |
| HEAD at audit time | `b5c7443e5a760c8f15895d4909543e5339421399` on `main-staging` |

**Note on this file.** A previous run of the same pass-1 harness (`xtrata-2.0/audit/run.sh`) wrote a report to this path at 12:55 today, taken at HEAD `6601bc31` — one commit older than the current HEAD. This run replaces it. That earlier run also left `xtrata-2.0/docs/audits/XTRATA_OPTIMISATION_AUDIT-appendices.md` (32 KB, 12:51); it belongs to the superseded run, is not referenced from this file, and is now orphaned. Neither file is tracked by git.

---

## 1. Scope and repository map

### 1.1 What the repository is

One Git repository holding several independent projects side by side at the root. The in-scope project is `xtrata-2.0/`. Root-level siblings, all out of scope: `AAA-Collection`, `Agent-27-claude`, `Archive`, `Audionals`, `cicada-v3`, `claude`, `docs`, `Fable Multi-Agentic Harness Docs`, `Huge-Sphinx`, `Living Synth`, `multi-agent`, `Narrate-AI-v2`, `Pitch-Video`, `pof-test`, `Proof-of-Free`, `reports`, `Social-Auto-Harness`, `Testnet-Version`, `TODO`, `Twitter-Growth`, `xtrata-1.0`, `xtrata-chess`.

`xtrata-1.0/` is the archived predecessor and stays in the tree permanently.

### 1.2 Tracked-file distribution inside `xtrata-2.0/`

1,857 tracked files at HEAD `b5c7443e`, by immediate subdirectory:

| Directory | Tracked files |
|---|---:|
| `recursive-apps/` | 580 |
| `src/` | 420 |
| `contracts/` | 193 |
| `opus-file-generator/` | 102 |
| `functions/` | 93 |
| `docs/` | 78 |
| `scripts/` | 75 |
| `forever-twins/` | 67 |
| `packages/` | 47 |
| `xtrata-agent-one/` | 45 |
| `flowproof/` | 45 |
| `public/` | 28 |
| `xtrata-FM/` | 18 |
| `examples/` | 11 |
| `web/` | 6 |
| `tools/` | 5 |
| `favicons/` | 4 |
| `schemas/` | 3 |
| `suno-more/`, `proofzero/` | 2 each |
| root files (`index.html`, `wrangler.toml`, `package.json`, plan/`.md` docs, vite configs, …) | 26 |

### 1.3 Deployment relationship — verified, not assumed

`xtrata-2.0/wrangler.toml` is the only deployment descriptor in the subtree. There is no `.github/workflows/` anywhere in the repository, so nothing in-repo maps a branch name to an environment; the branch → environment mapping lives in the Cloudflare dashboard and is not verifiable from the repo alone. What the repo does establish:

- The project is a **Cloudflare Pages** site named `xtrata`, built from `dist` (`pages_build_output_dir = "dist"`).
- Bindings: D1 `xtrata-manage` (`7d7cf4b8-…`), R2 `xtrata-manage-assets` (`COLLECTION_ASSETS`), R2 `xtrata-runtime-content-cache` (`RUNTIME_CONTENT_CACHE`).
- `wrangler.toml` states in a comment that **preview deployments (branch builds) mirror production bindings exactly** — "every branch URL runs against the same D1 and R2 as the live site". This is load-bearing for §7: a branch preview build is not isolated from production data.
- Secrets (`SPONSOR_KEY`, `HIRO_API_KEY`, `TELEMETRY_SALT`, `DEBUG_VIEW_KEY`) are dashboard-set for both Production and Preview, not in the repo.

What the branch names mean is therefore inferred from commit topology, not configuration:

- **`main`** receives `main-staging` exclusively, via GitHub pull requests. Every one of the six commits `main` has that `main-staging` lacks is a merge commit titled `Merge pull request #263…#268 from stxtrata/main-staging`. `main` has contributed no original content of its own to `xtrata-2.0/` since the merge base (verified: `git diff 2216dae8 main -- xtrata-2.0/` is empty). This is consistent with `main` = production and `main-staging` = the integration branch, but the repo does not state it.
- **`main-staging`** is the branch checked out and actively worked on. It is where all 2026-07-30 → 2026-08-01 work sits.
- **`staging`** also exists as a real, distinct branch (local and `origin/staging`, both at `1f1d903a`), last touched 2026-03-24. It is *not* the current staging branch — see §7.1.

### 1.4 Build and release surface (for later passes)

`package.json` is `xtrata-v15-1`, private, ESM. `prebuild` chains four extra Vite builds (`agent-one-wallet`, `agent-one`, `radio`, `forever-twins-wallet`) plus two manifest generators, and `postbuild` runs `scripts/copy-static-apps.mjs`. The pre-merge gate is `npm run smoke:premerge` = `contracts:verify` + `lint` + nine named vitest files + `build`.

---

## 2. Repository state

### 2.1 Current branch and HEAD

```
$ git branch --show-current
main-staging

$ git rev-parse HEAD
b5c7443e5a760c8f15895d4909543e5339421399
```

### 2.2 `git status --porcelain` (verbatim, at the start of this pass)

```
?? xtrata-2.0/audit/
?? xtrata-2.0/docs/audits/
?? xtrata-2.0/docs/plans/WIZARD-PIPELINE-PLAN.md
?? xtrata-2.0/docs/plans/WIZARD-RELEASE-RUNBOOK.md
?? xtrata-2.0/prompt-run1.md
?? xtrata-2.0/prompt-run2.md
?? xtrata-2.0/run-xtrata-audit.sh
?? xtrata-chess/
```

One line was added to this while the audit was running, by a process other than the audit. See the Verification section at the end.

### 2.3 `git remote -v` (verbatim)

```
origin	https://github.com/stxtrata/xtrata.git (fetch)
origin	https://github.com/stxtrata/xtrata.git (push)
```

One remote. No fork, no upstream, no deploy remote.

### 2.4 Branches after `git fetch --all --prune`

117 local branches and 110 remote-tracking branches under `origin` (`git branch -r` prints 111 lines because one of them is the `origin/HEAD -> origin/main` symref). `git branch -a -vv` output is long; it is reproduced below in two tables carrying the same fields (name, SHA, upstream, ahead/behind, last-commit date), sorted newest first.

#### Local branches

| Last commit | Branch | SHA | Upstream | Track |
|---|---|---|---|---|
| 2026-08-01 | **main-staging** (HEAD) | `b5c7443e` | origin/main-staging | ahead 1 |
| 2026-07-29 | claude/quirky-mendeleev-e86f44 | `0e0a139c` | origin/main | — |
| 2026-07-29 | **main** | `0e0a139c` | origin/main | — |
| 2026-07-25 | ms-rebuild | `6fc69472` | origin/ms-rebuild | — |
| 2026-07-23 | main-staging-fixes | `a0eae158` | origin/main-staging-fixes | — |
| 2026-07-17 | backup/main-pre-staging-merge-20260717 | `3f341e65` | (none) | — |
| 2026-07-16 | main-staging-astro | `488d5e08` | origin/main-staging-astro | — |
| 2026-07-15 | main-staging-wal-fix | `4ea8dc56` | origin/main-staging-wal-fix | — |
| 2026-07-15 | main-staging-gate-opt | `12cc3382` | origin/main-staging-gate-opt | — |
| 2026-07-15 | main-staging-gate | `b54cf12c` | origin/main-staging-gate | — |
| 2026-07-14 | main-staging-sol | `eccbd255` | origin/main-staging-sol | — |
| 2026-07-14 | main-staging-sol-2 | `593bb409` | origin/main-staging-sol-2 | — |
| 2026-07-14 | main-staging-sol-wiz | `4d6c9d99` | origin/main-staging-sol-wiz | — |
| 2026-07-12 | main-staging-fable | `5ce291c4` | origin/main-staging-fable | — |
| 2026-07-12 | main-staging-fab-opt | `4f7a1abb` | origin/main-staging-fab-opt | — |
| 2026-07-09 | main-staging-terra | `38779c92` | origin/main-staging-terra | — |
| 2026-07-08 | main-staging-wizard | `069abea6` | origin/main-staging-wizard | — |
| 2026-07-08 | main-text-deps2 | `7e5ab5a7` | origin/main-text-deps2 | — |
| 2026-07-08 | main-staging-1.2 | `2c966568` | origin/main-staging-1.2 | — |
| 2026-07-07 | main-text-deps | `7131275f` | (none) | — |
| 2026-07-07 | main-text-thread | `7131275f` | origin/main-text-thread | — |
| 2026-07-07 | main-text-insc | `4129ba48` | origin/main-text-insc | — |
| 2026-07-05 | new-layout | `76a9aff8` | origin/new-layout | — |
| 2026-07-05 | new-layout-2 | `e6e5548d` | origin/new-layout-2 | — |
| 2026-07-05 | new-layout-batch | `13d15f10` | origin/new-layout-batch | — |
| 2026-07-04 | main-agent1 | `1fd15b16` | origin/main-agent1 | — |
| 2026-07-02 | main-f5-optim | `01bb3c54` | origin/main-f5-optim | — |
| 2026-07-01 | main-XA1 | `6efc1307` | origin/main-XA1 | — |
| 2026-06-28 | backup/main-pre-seg-merge-20260628 | `99dc4331` | (none) | — |
| 2026-06-19 | xplorer-filters | `95d2e8ca` | origin/xplorer-filters | — |
| 2026-06-16 | switch-to-core | `6883003d` | origin/switch-to-core | — |
| 2026-06-16 | forever-twins | `459187dd` | (none) | — |
| 2026-06-16 | opus-image-comp | `c4dcaae7` | origin/opus-image-comp | — |
| 2026-06-16 | opus | `cac8599f` | origin/opus | — |
| 2026-06-13 | main-staging-fix | `e1af7467` | origin/main-staging-fix | — |
| 2026-06-11 | rescue-contract-app-review | `1818dacd` | origin/rescue-contract-app-review | — |
| 2026-06-11 | rescue-current-mess | `99483114` | origin/rescue-current-mess | — |
| 2026-06-11 | add-parents | `ecf4a1b2` | origin/add-parents | — |
| 2026-06-10 | caching | `b702dcfd` | origin/caching | ahead 1 |
| 2026-06-09 | standards | `af1d9acf` | origin/standards | — |
| 2026-06-05 | x-board | `ef3a6097` | origin/x-board | — |
| 2026-06-03 | staging-grid-fix | `50a32754` | origin/staging-grid-fix | — |
| 2026-05-31 | main-staging-optim | `4365378b` | origin/main-staging-optim | — |
| 2026-05-31 | main-staging-optim-2 | `f25f2e9e` | origin/main-staging-optim-2 | — |
| 2026-05-29 | opus-updates | `6b7b2a2a` | origin/opus-updates | — |
| 2026-05-28 | txn-issues | `7d9ad80f` | origin/txn-issues | — |
| 2026-05-26 | optimise-runtime | `3f254a0a` | origin/optimise-runtime | — |
| 2026-05-26 | contract-cleaning | `cf989814` | origin/contract-cleaning | — |
| 2026-05-26 | opus-only | `4f8dab8e` | origin/opus-only | — |
| 2026-05-26 | backup-main-before-staging-merge | `5da3a7c8` | (none) | — |
| 2026-05-26 | opus-ONLY-old | `f57f1b4c` | origin/Opus-File_generator_ONLY | — |
| 2026-05-24 | mobile-view | `76cd0ece` | origin/mobile-view | — |
| 2026-05-23 | fee-estimator-updates | `d1dbd586` | origin/fee-estimator-updates | — |
| 2026-05-22 | Galleries | `2a24a571` | origin/Galleries | — |
| 2026-05-22 | bns-test | `3baabf60` | origin/bns-test | — |
| 2026-05-22 | bns-test-2 | `10d18ab8` | origin/bns-test-2 | — |
| 2026-05-22 | main-staging-3 | `ff9a5492` | origin/main-staging-3 | — |
| 2026-05-22 | style-updates | `87c9284c` | origin/style-updates | — |
| 2026-05-22 | Xtrata-Backup-Migration-Service | `8948cf37` | origin/Xtrata-Backup-Migration-Service | — |
| 2026-05-22 | main-staging-2 | `8948cf37` | origin/main-staging-2 | — |
| 2026-05-18 | new-xtrata-homepage | `2c0e9856` | origin/new-xtrata-homepage | — |
| 2026-05-18 | narrate-AI | `4d709bd7` | origin/narrate-AI | — |
| 2026-04-22 | agent-27-staging | `7f1a1117` | origin/agent-27-staging | — |
| 2026-04-22 | agent-27 | `29ff6b6f` | origin/agent-27 | ahead 1 |
| 2026-04-13 | social-auto | `3c19b4f8` | origin/social-auto | — |
| 2026-04-12 | meta-col | `ddf70cba` | origin/meta-col | — |
| 2026-04-12 | html-loader | `2c9b977e` | origin/html-loader | — |
| 2026-04-01 | animate | `c4f19690` | origin/animate | — |
| 2026-04-01 | live-disp | `c4f19690` | origin/live-disp | — |
| 2026-04-01 | live-mint-disp | `3308aa70` | origin/live-mint-disp | — |
| 2026-03-31 | v3-contract | `e57ce0d7` | origin/v3-contract | — |
| 2026-03-29 | nearest-n | `2f0e7b8f` | origin/nearest-n | — |
| 2026-03-29 | staging-clarity | `3ab7b026` | origin/staging-clarity | — |
| 2026-03-27 | runtime-v3 | `75f86354` | origin/runtime-v3 | — |
| 2026-03-27 | backup-new-runtime-before-c780935 | `1027af6f` | (none) | — |
| 2026-03-27 | new-runtime | `1027af6f` | origin/new-runtime | — |
| 2026-03-27 | runtime-v2 | `c0e83b9e` | origin/runtime-v2 | — |
| 2026-03-25 | caching-update | `17c0706a` | origin/caching-update | — |
| 2026-03-24 | lab | `df66238c` | origin/lab | — |
| 2026-03-24 | codex/pricing-staging-clean | `1f1d903a` | **origin/staging** | — |
| 2026-03-24 | **staging** | `1f1d903a` | origin/staging | — |
| 2026-03-24 | hero-coll-image | `17d25b12` | origin/hero-coll-image | — |
| 2026-03-20 | dependency | `9786bb07` | origin/dependency | — |
| 2026-03-19 | codex/pricing-staging-integration | `2fe16d00` | origin/codex/pricing-staging-integration | — |
| 2026-03-19 | free-mint-advprice | `89544b66` | origin/free-mint-advprice | — |
| 2026-03-19 | free-mint-mode | `9179b4d3` | origin/free-mint-mode | — |
| 2026-03-19 | free-mint | `8264a016` | origin/free-mint | — |
| 2026-03-19 | pricing-oracle | `487d1498` | origin/pricing-oracle | — |
| 2026-03-19 | manageportal | `c20e1adf` | origin/manageportal | — |
| 2026-03-19 | bnsnames | `db7980ce` | origin/bnsnames | — |
| 2026-03-18 | inscribe-button | `a629017b` | origin/inscribe-button | — |
| 2026-03-17 | edit-staged-collection | `46d13381` | origin/edit-staged-collection | — |
| 2026-03-17 | fx-update-RR | `4042a270` | origin/fx-update-RR | — |
| 2026-03-17 | mint-preview-and-address/stacks-explorer-links | `09441ebf` | origin/… (same) | — |
| 2026-03-16 | leather-wallet-fix | `e521bcda` | origin/leather-wallet-fix | — |
| 2026-03-15 | recursive-app-plans | `34762a90` | origin/recursive-app-plans | — |
| 2026-03-13 | leather-warning-messages | `b9f9726b` | origin/leather-warning-messages | — |
| 2026-03-13 | hackathon-demo | `5be96b57` | origin/hackathon-demo | — |
| 2026-03-09 | staging-usdc-sbtc-contracts | `ad431101` | origin/staging-usdc-sbtc-contracts | — |
| 2026-03-07 | creator-portal | `970183f7` | origin/creator-portal | — |
| 2026-03-07 | inscription-cover-images | `2172590c` | origin/inscription-cover-images | — |
| 2026-03-06 | small-mint-contract-implementation | `2a8e42c2` | origin/small-mint-contract-implementation | — |
| 2026-03-04 | siblings-mint-order | `2e3c3760` | origin/siblings-mint-order | — |
| 2026-03-04 | banner-on-mint-page | `8ee60c4b` | origin/banner-on-mint-page | — |
| 2026-03-04 | New-Homepage-Designs | `7162bd02` | origin/New-Homepage-Designs | — |
| 2026-03-04 | fees-into-mint-price | `4394a84f` | origin/fees-into-mint-price | — |
| 2026-03-01 | collection-mint-setup-flow-highlights | `830213f7` | origin/… (same) | — |
| 2026-02-28 | collection-mint-setup-flow | `1877c5ed` | origin/collection-mint-setup-flow | — |
| 2026-02-28 | OPTIMISATIONS | `5e43f04f` | origin/OPTIMISATIONS | — |
| 2026-02-23 | http-fullscreen-app | `cc9358c1` | origin/http-fullscreen-app | — |
| 2026-02-17 | SDKs | `2a6eb277` | origin/SDKs | — |
| 2026-02-16 | Collection-Mint-Page | `d9c7f236` | origin/Collection-Mint-Page | — |
| 2026-02-15 | batch-resume-fixed | `b3de53d5` | origin/batch-resume-fixed | — |
| 2026-02-11 | artist-manage-portal | `4702abeb` | origin/artist-manage-portal | — |
| 2026-02-09 | parent-child | `54b32608` | origin/parent-child | — |
| 2026-02-09 | artist-portal | `9c8c31a5` | (none) | — |
| 2026-02-08 | v2-1-0 | `46a5f006` | origin/v2-1-0 | — |

Only three local branches are ahead of their upstream: `main-staging` (1), `caching` (1), `agent-27` (1). No local branch is behind or diverged.

#### Remote-tracking branches, most recent 25

| Last commit | Ref | SHA |
|---|---|---|
| 2026-07-31 | origin/main-staging | `6601bc31` |
| 2026-07-29 | origin/main (= origin/HEAD) | `0e0a139c` |
| 2026-07-25 | origin/ms-rebuild | `6fc69472` |
| 2026-07-23 | origin/main-staging-fixes | `a0eae158` |
| 2026-07-16 | origin/main-staging-astro | `488d5e08` |
| 2026-07-15 | origin/main-staging-wal-fix | `4ea8dc56` |
| 2026-07-15 | origin/main-staging-gate-opt | `12cc3382` |
| 2026-07-15 | origin/main-staging-gate | `b54cf12c` |
| 2026-07-14 | origin/main-staging-sol | `eccbd255` |
| 2026-07-14 | origin/main-staging-sol-2 | `593bb409` |
| 2026-07-14 | origin/main-staging-sol-wiz | `4d6c9d99` |
| 2026-07-12 | origin/main-staging-fable | `5ce291c4` |
| 2026-07-12 | origin/main-staging-fab-opt | `4f7a1abb` |
| 2026-07-09 | origin/main-staging-terra | `38779c92` |
| 2026-07-08 | origin/main-staging-wizard | `069abea6` |
| 2026-07-08 | origin/main-text-deps2 | `7e5ab5a7` |
| 2026-07-08 | origin/main-text-deps | `db3e0329` |
| 2026-07-08 | origin/main-staging-1.2 | `2c966568` |
| 2026-07-07 | origin/main-text-thread | `7131275f` |
| 2026-07-07 | origin/main-text-insc | `4129ba48` |
| 2026-07-05 | origin/new-layout | `76a9aff8` |
| 2026-07-05 | origin/new-layout-2 | `e6e5548d` |
| 2026-07-05 | origin/new-layout-batch | `13d15f10` |
| 2026-07-04 | origin/main-agent1 | `1fd15b16` |
| 2026-07-02 | origin/main-f5-optim | `01bb3c54` |

The remaining 85 remote branches all last moved on or before 2026-07-01; 70 of them on or before 2026-05-29. Their SHAs match the local table above one-for-one except where noted (`origin/main-text-deps` is `db3e0329`, ahead of the untracked local `main-text-deps` at `7131275f`; `origin/agent-27` is `57603df8` against local `29ff6b6f`).

### 2.5 Commits in the last 21 days (2026-07-11 → 2026-08-01), all branches

346 commits total, **all by a single author**: `stxtrata <stxtrata@gmail.com>`. There is no second contributor anywhere in the window. 269 of the 346 touch `xtrata-2.0/`.

The window's commits, newest first (dates are commit dates, all `stxtrata`):

```
b5c7443e 2026-08-01  Three readings of the same eight things            (HEAD -> main-staging)
6601bc31 2026-07-31  The Builder draws the machinery it keeps describing (origin/main-staging)
31fa7194 2026-07-31  Name the menu after what each destination does, and drop the Wizard from it
ffccbf09 2026-07-31  Take the relations strip out of the size calculation entirely
52acf1bc 2026-07-31  Nine scenarios that trade, and the two that cannot
1cc4e616 2026-07-31  Reserve the relations row, and put ancestors and siblings in it
4b3cf656 2026-07-31  A receipt is not a reply
553aaa0e 2026-07-31  Align the artwork with the bars above it
3167abb5 2026-07-31  Navigate an inscription's family without leaving the enlarged view
14eca936 2026-07-31  A nonce can prove absence; it cannot prove arrival
b4e9b0e5 2026-07-31  Give the enlarged viewer an identity, and arrows that look like arrows
81a52e8e 2026-07-31  A runner that stops rather than guesses
6b2583fb 2026-07-31  Two things the first real mints exposed
cabeb3d1 2026-07-30  Verify the quote before it becomes permanent
0c9b8149 2026-07-30  Three wizards that transact, and a gate before they can
4f717fdb 2026-07-30  Markets: stop offering v2-1-0-welded markets, and say so to agents
fb43fd01 2026-07-30  Fix: "/" sponsorApi silently disabled sponsored buying everywhere
3026a159 2026-07-30  Sponsored market buy: remove the false promise, then wire it properly
df6aff06 2026-07-30  Living synth updates
9fdedbbe 2026-07-30  Mosaic grid must be a fixed square, not auto-fill
543e2322 2026-07-30  Mosaic simulator: a fake chain served from folders
27c4561c 2026-07-30  Plan: the seed list is fixed, and add the pre-render gate
a93697c5 2026-07-30  Rewrite the collection plan for 1,024 tiny seeds
9db3f13d 2026-07-30  Correct the plan: duplicate content is allowed, the client is not
d2ae6b95 2026-07-30  Plan: a Collection Wizard for up to 10,000 items
0e0a139c 2026-07-29  Merge pull request #268 from stxtrata/main-staging   (origin/main, main)
2216dae8 2026-07-29  Controls a finger can actually hit, on the players and the radio   [merge base main…main-staging]
c7653614 2026-07-29  Inscribed player: the tap that asks for sound now makes the sound
4b7fdf22 2026-07-29  SUNO: warn when edits have not been applied to the player
6f0e5532 2026-07-29  The player hides its own controls the instant you lift your finger
745a7e01 2026-07-29  Rescue already-inscribed players that cannot play on a phone
644b47fa 2026-07-29  Stop the inscribed player killing its own audio on phones
a4f80309 2026-07-29  The business case gets its own page, because it is a different room
298c08e6 2026-07-29  Let a tapped inscription actually play on mobile
950925f3 2026-07-29  Never let a text inscription be attached to something you cannot see
e622e699 2026-07-29  Stop selling a product, start selling the measurement
6eaab21d 2026-07-29  Polymarket, and the case for putting money on it after all
e09cabab 2026-07-29  Swap the invented numbers for real ones, and add the sources
94b7b0c8 2026-07-29  A white label you can actually pick up
b958f469 2026-07-29  The same idea, with the maths taken out and the honesty left in
d667252f 2026-07-29  Notes: a market that ranks new music, and the two rules that stop it manufacturing its own answer
ae2d60f2 2026-07-29  Merge branch 'main-staging' of github.com/stxtrata/xtrata into main-staging
4e3e7e7c 2026-07-29  Stop asking the chain for more than it is allowed to give in one read
d0de3efb 2026-07-29  Stop asking the chain for more than it is allowed to give in one read   [duplicate subject — see §7.5]
1dccc79c 2026-07-29  Show the drops that were already claimed
295fb0f4 2026-07-29  Notes: how the radio gets embedded, and the batch size that was breaking reads
e31fd8cd 2026-07-29  SUNO: cap the INSCRIPTION at the contract limit, not the source file
063ab22c 2026-07-29  SUNO takes any audio now, and asks for what is missing
9318367c 2026-07-29  Merge pull request #267 from stxtrata/main-staging
1c7d27f6 2026-07-28  Stop nagging about jobs that never took a penny
a24fffe5 2026-07-28  Fix the /debug page dying on a newline that was never meant to survive
c432a522 2026-07-28  Move job history between sites, without ever moving a key
0944100c 2026-07-28  Merge pull request #266 from stxtrata/main-staging
de76470d 2026-07-28  Unstick: fill the nonce hole underneath the queue, not just the queue
264fa933 2026-07-28  Merge pull request #265 from stxtrata/main-staging
bec19e43 2026-07-28  Unstick: send the replacement to the payer, not to the wallet itself
0034e483 2026-07-28  Merge pull request #264 from stxtrata/main-staging
7dabf318 2026-07-28  Fix the open job collapsing on every poll, and stop hiding jobs that still hold money
b3fd8140 2026-07-28  Wizard history: expand jobs in place, and stop the panel flickering
ce22f5f4 2026-07-28  Merge pull request #263 from stxtrata/main-staging
d8a41ecb 2026-07-28  Merge branch 'main' into main-staging
2db22622 2026-07-28  Radio: keep the dial sweep for power on/off, drop it between songs
c9e6e334 2026-07-28  Radio: two more reasons a click landed on the wrong song
7b031af9 2026-07-28  Radio: clicking a song in Your Station plays THAT song
9245e317 2026-07-27  Radio page: stop the transport buttons jumping on every track change
7972c7cb 2026-07-28  Radio: clicking a song in Your Station plays THAT song   [duplicate subject — see §7.5]
6082465d 2026-07-27  Check the chain, not contracts/live: both open v3.2.4 questions were moot
4cfb332e 2026-07-27  v3.2.4 candidate: let a publisher pay for an author's inscription
63535bc6 2026-07-27  Unstick a jammed wallet, and stop transfers getting stuck in the first place
cb38667c 2026-07-27  Show progress in the tab title, and offer a notification when it finishes
b14f9c94 2026-07-27  Embedded jobs now warn before you leave the site
b3419a3f 2026-07-27  Merge pull request #262 from stxtrata/main-staging
f2830b74 2026-07-27  Radio page: stop the transport buttons jumping on every track change   [duplicate subject]
04804b01 2026-07-27  Revert the drops thumbnail change — it left the Claim page blank
8cdf1f15 2026-07-27  Plan: bring SUNO into the main page's tabs
41da2cf9 2026-07-27  Merge pull request #261 from stxtrata/main-staging
87fbacbb 2026-07-27  Repair the SyntaxError I introduced, and make it impossible to miss again
910ba31a 2026-07-27  Fix the two SUNO errors my keep-open extraction caused
bff4ba19 2026-07-27  Never strand a half-finished upload, and let the user let it go
48b5ea53 2026-07-27  Wizard fee, and stop the drops grid flashing white boxes
ad39ba15 2026-07-27  Passkey wallet: put a real origin boundary between the site and the key
ba2ca8e3 2026-07-27  Passkey canary: GO on iPhone, and stop calling a cancelled prompt a dead device
76acdcb1 2026-07-27  Take the legacy /workspace mint panel offline before it costs anyone else
0440b93d 2026-07-27  Passkey wallet: prove the design on real hardware, and write it down
b2ac6127 2026-07-27  Make the wallet playbook findable, and correct its ship checklist
41a4da82 2026-07-27  Drops: one contract version only, and write the rule down
0f5fc5b1 2026-07-27  Wizard: preview the player, check the deps, and say who holds the money
e29660ec 2026-07-27  Drops: stop the grid waiting on things it does not need
0628c883 2026-07-27  Keep-open banner: shared, and now on the main wizard too
c4403367 2026-07-27  One cancel dialog, and a reminder for jobs left unfinished
be90bd1a 2026-07-27  A mistyped token id no longer destroys a nearly-complete job
c0fa07cc 2026-07-26  Runtime: read the content hash from the index, not the chain
7fd362ee 2026-07-26  Merge pull request #259 from stxtrata/main-staging
e4571b31 2026-07-26  Xplorer: stop bare HTML inscriptions rendering as white cards in the grid
a294be12 2026-07-26  Merge pull request #258 from stxtrata/main-staging
3cb46af3 2026-07-26  Home: stop downloading ~10 MB of music before anyone asks for it
d7c70e03 2026-07-26  Report: the whole chain is 0.55 GB, so cache all of it permanently
8509c5e2 2026-07-26  Bind the runtime content cache bucket that was never created
574be05b 2026-07-26  Runtime: answer 404 when no core holds a token, and say which were searched
565b7859 2026-07-26  Merge pull request #257 from stxtrata/main-staging
b4b0d03f 2026-07-26  Create STORAGE-AND-SPEED-REPORT.md
a1b01bb2 2026-07-26  Agent One: a parent that has arrived stays arrived
25a4c227 2026-07-26  Wizard: four UX fixes, and stop SUNO buying a receipt nobody asked for
409ab8a2 2026-07-26  Merge pull request #256 from stxtrata/main-staging
53b8b50c 2026-07-26  Wizard: say the self-custody part out loud, where the doubt actually is
5461f0b0 2026-07-26  Wizard: protect a job when the tab closes, and let the user hand it over
44355350 2026-07-26  Merge pull request #255 from stxtrata/main
241c62cc 2026-07-26  Plan: wizard resilience — failsafes and buffers, sized from measurement
4b96b7cc 2026-07-26  Agent One: escalate the fee when a transaction is accepted but never mined
a60fc76f 2026-07-26  Wizard: make a redeploy actually reach the browser, and fix an init-time crash
5a7f0df6 2026-07-26  Merge pull request #254 from stxtrata/main-staging
85243ee3 2026-07-26  Merge pull request #253 from stxtrata/main-staging
fc20bd0e 2026-07-26  Agent One: size the miner reserve from the network floor, one model for both quotes
a6b81425 2026-07-26  Agent One: pay the node's LOW fee estimate, not the middle one
9dc56647 2026-07-26  Agent One: stop the escrow checklist asking for a parent it already has, and cap per-batch fees
47eff7ac 2026-07-26  Agent One: finish the sweep for reads that lie when they fail
9354aa8b 2026-07-25  Agent One: fix the fee and broadcast paths, and put them under the harness
289a3aa8 2026-07-25  Agent One: fault-injection harness, and the funds-safety bug it found
8c4a6464 2026-07-25  Agent One: gate the parent on chain state, not the lagging holdings index
e1768ade 2026-07-25  Agent One: move off the Hiro endpoints that are throttled regardless of key
c321bf88 2026-07-25  Agent One: a failed balance read is not an empty wallet
4d2ae471 2026-07-25  Agent One: end the resume loop, and let a cancel rest as cancelled
03269a54 2026-07-25  Wizard: stop the Song details overlay covering the page on every load
47eed217 2026-07-25  Agent One: stop the refund loop that hammered the API
b00f982f 2026-07-25  Agent One: stop a running job and get everything back
0611908b 2026-07-25  SUNO: send the parent to the right contract, and reattach a stranded job
6129a52b 2026-07-25  Wizard: build a player for one song; SUNO: parent and dependency links
dc9d7845 2026-07-25  Merge pull request #252 from stxtrata/main-staging
11e278e5 2026-07-25  Drops: choose the claiming BNS name in the page, not in a browser prompt
7090ed14 2026-07-25  Merge pull request #251 from stxtrata/main-staging
59560897 2026-07-25  BNS: read the primary name from the registry, stop guessing it
56985d06 2026-07-25  Wizard agent: survive background tabs, clear Suno resume path (build 2026-07-25.1)
0383c5ca 2026-07-25  Merge pull request #250 from stxtrata/main-staging
40bff9d8 2026-07-25  Wallet: stop listing the same wallet twice in the chooser
273e31f0 2026-07-25  Merge pull request #249 from stxtrata/main
007c00c2 2026-07-25  Inscribe: allow a parent on text inscriptions, under one Advanced panel
f5d600c4 2026-07-25  Campaign B1: name the one thing that is not free
8c6d806d 2026-07-25  Drops: parallelise the read phase and cache drops reads at the proxy
d69d5814 2026-07-25  proof of free campaign cards
0ee63cd8 2026-07-25  Revert "Add campaign card renderer for the Proof of Free drop"
edb9605f 2026-07-25  Drops: move the blocked-claim notice onto the card that was pressed
2f12b06d 2026-07-25  Add the campaign runner page
a1e63e4b 2026-07-25  Add campaign card renderer for the Proof of Free drop
364ed9ab 2026-07-25  Drops: tell the claimer why a claim was blocked
f790cceb 2026-07-25  Merge pull request #248 from stxtrata/main-staging
6fc69472 2026-07-25  The rebuild is code-complete… (origin/ms-rebuild, ms-rebuild)
ea9cad00 2026-07-25  Retry transient upstream failures on sponsor read-only calls   [merge base main-staging…ms-rebuild]
b91eb7c4 2026-07-25  Accept the attestor key in either compression form
53d36e76 2026-07-25  Fix the hidden key prompt in check-attestor-key.mjs
b4e2b411 2026-07-25  Add scripts/check-attestor-key.mjs to diagnose ATTESTOR_KEY_MISMATCH
4f95adaf 2026-07-25  Drops: show a full campaign, and fix the drop-canary chain reads
b2d6aaca 2026-07-25  Proof of Free V3: recursive collection, inscription canary, drop canary
05c2c728 2026-07-24  Canary: use the main Xtrata app's wallet logic
6d6eabe9 2026-07-24  Merge pull request #247 from stxtrata/main
9ca39254 2026-07-24  Free drop edits
dc2d608f 2026-07-24  PoF
1f6c6797 2026-07-24  Proof of Free contract rewrite
ab0957fe 2026-07-24  proof of Free canary
896414f5 2026-07-24  fix: harden debug issue diagnostics
dea714c3 2026-07-24  Proof of free updates
3cf49aa7 2026-07-24  Merge branch 'main' of https://github.com/stxtrata/xtrata
9e87465a 2026-07-24  Proof of Free and Drops update
656d91ce 2026-07-24  Merge pull request #246 from stxtrata/main-staging
2d209def 2026-07-24  proof of free
cb99b7b8 2026-07-24  Merge pull request #245 from stxtrata/main-staging
4d599858 2026-07-24  Proof of Free
49db77b8 2026-07-24  Prepare Proof of Free deployment console
f347cfb6 2026-07-24  Proof of Free updates
2ca2c9ba 2026-07-23  Added proof of free
1624b6d6 2026-07-23  Merge pull request #243 from stxtrata/main-staging
2c79957e 2026-07-23  Merge pull request #244 from stxtrata/main-staging-fixes
a0eae158 2026-07-23  docs added for proof of session   (origin/main-staging-fixes, main-staging-fixes)
51807c38 2026-07-23  Agent One: delivery reliability + transaction-accurate wizard progress
307f1b78 2026-07-23  feat: add Xtrata Contract Studio leaderboard prototype
08746492 2026-07-23  Merge pull request #242 from stxtrata/main-staging
cf43901c 2026-07-23  docs: plan safe xtrata 1.0 documentation migration
caa7c95a 2026-07-23  fix: render PDF inscriptions in previews
5032da11 2026-07-23  Proof of Session added
4e6596b0 2026-07-23  Harden Living Synth registry and deployment gates
68abefbb 2026-07-23  feat: add Living Synth recording fees
c38c49e1 2026-07-23  feat: add gated Living Synth deployment console
c65fb033 2026-07-22  Merge pull request #241 from stxtrata/main-staging
7ab57324 2026-07-22  fix: use deployed BNS attestation secret name
95858b0f 2026-07-22  Merge pull request #240 from stxtrata/main
a8abacdc 2026-07-22  feat: wire Proof of Free campaign claims
34ffe4ae 2026-07-22  fix: surface live telemetry activity
924bf718 2026-07-22  feat: add claim-gated Proof of Free mosaic
191195a6 2026-07-22  docs: add PoF pre-inscription test deck
48ce6bf4 2026-07-22  feat: add privacy-safe journey telemetry
d2a1a1cd 2026-07-22  feat: add restricted collection drop console
491b2bfe 2026-07-21  feat: add Drops v1.1 deploy workflow
8dbd1ec5 2026-07-21  feat: add campaign-aware drops v1.1
1f69ade9 2026-07-21  fix(wallet): bridge embedded Xverse payments
9dc3e0c9 2026-07-21  wizard wallet fixes
13f0c13a 2026-07-21  fix(wallet): restore Xverse wizard payment provider
f8666f6a 2026-07-21  Auto-recover Xverse stale-session network mismatch on signing requests
c178c7a7 2026-07-21  Repair Xverse preflight (ban stx_getAccounts, add cache + timeout), add wallet playbook
deae7cb7 2026-07-21  Fix Xverse network-mismatch on wizard pay, force account chooser on connect
f7faae86 2026-07-21  Wallet chooser on every connect, wizard iframe provider fix, inscribe re-prepare deadlocks
4c915312 2026-07-21  Add homepage campaign spotlight banners
```

(The remaining commits in the 21-day window sit on the older feature branches listed in §2.4 and predate 2026-07-21 on those branches; none of them touch `xtrata-2.0/`.)

Two things to carry forward. **Commit-message style changed on 2026-07-24**: everything before is Conventional-Commits (`feat:`, `fix:`, `docs:`); everything after is prose sentences. This is a style change, not a process change — the merge-PR cadence is unbroken across it. And **there are no `Co-Authored-By` trailers and no second author**, so "who reviewed this" cannot be answered from git.

### 2.6 Fifty most recent commits per branch

**Current staging branch = `main-staging`** (see §7.1 for why this is not `staging`). Its 50 most recent commits are the first 50 lines of §2.5's listing, from `b5c7443e` down to `c432a522` (2026-07-28, "Move job history between sites, without ever moving a key"). Because the current staging branch *is* `main-staging`, the brief's two separate 50-commit listings collapse into one.

**`main`**, 50 most recent (`0e0a139c` … `8cdf1f15`): identical content to the `main-staging` listing from `2216dae8` downward, with six `Merge pull request #263…#268` commits interleaved at their merge points. Explicitly:

```
0e0a139c 2026-07-29  Merge pull request #268 from stxtrata/main-staging
2216dae8 … 063ab22c   (22 commits, identical to main-staging)
9318367c 2026-07-29  Merge pull request #267 from stxtrata/main-staging
1c7d27f6, a24fffe5, c432a522   (identical to main-staging)
0944100c 2026-07-28  Merge pull request #266 from stxtrata/main-staging
de76470d
264fa933 2026-07-28  Merge pull request #265 from stxtrata/main-staging
bec19e43
0034e483 2026-07-28  Merge pull request #264 from stxtrata/main-staging
7dabf318, b3fd8140
ce22f5f4 2026-07-28  Merge pull request #263 from stxtrata/main-staging
d8a41ecb 2026-07-28  Merge branch 'main' into main-staging
2db22622, c9e6e334, 7b031af9, 9245e317, 7972c7cb, 6082465d, 4cfb332e,
63535bc6, cb38667c, b14f9c94
b3419a3f 2026-07-27  Merge pull request #262 from stxtrata/main-staging
f2830b74, 04804b01, 8cdf1f15
```

### 2.7 Merge bases and divergence

| Pair | Merge base | `rev-list --left-right --count` | Reading |
|---|---|---|---|
| `main-staging` … `main` | `2216dae8` (2026-07-29, "Controls a finger can actually hit…") | `25	6` | staging 25 ahead, `main` 6 ahead |
| `main-staging` … `origin/main-staging` | `6601bc31` | `1	0` | one local commit (`b5c7443e`) not pushed |
| `main` … `origin/main` | `0e0a139c` | `0	0` | in sync |
| `main-staging` … `origin/ms-rebuild` | `ea9cad00` (2026-07-25) | `139	1` | see §7.4 |
| `main-staging` … `origin/staging` | base is far older than `1f1d903a` | — | see §7.1 |

`main`'s six "ahead" commits are **all merge commits** of `main-staging` into `main`. `git diff 2216dae8 main -- xtrata-2.0/` is empty, confirming `main` contributes no original `xtrata-2.0/` content of its own. So the divergence is one-directional in substance: everything on `main` is on `main-staging`; 25 commits on `main-staging` are not on `main`.

### 2.8 Forty most frequently changed files in `xtrata-2.0/`, last 60 days

Change counts from `git log --since="60 days ago" --name-only -- xtrata-2.0/` on the current branch's history.

| Changes | File |
|---:|---|
| 107 | `xtrata-2.0/src/home/main.js` |
| 62 | `xtrata-2.0/xtrata-agent-one/wizard/index.html` |
| 54 | `xtrata-2.0/xtrata-agent-one/wizard/suno.html` |
| 54 | `xtrata-2.0/src/home/styles/home.css` |
| 49 | `xtrata-2.0/index.html` |
| 48 | `xtrata-2.0/src/agent-one/agent-core.ts` |
| 45 | `xtrata-2.0/CHANGELOG-2.0.md` |
| 43 | `xtrata-2.0/src/home/radio.js` |
| 39 | `xtrata-2.0/public/xtrata-radio.js` |
| 32 | `xtrata-2.0/xtrata-agent-one/wizard/manifests.html` |
| 22 | `xtrata-2.0/src/lib/wallet/connect.ts` |
| 19 | `xtrata-2.0/src/home/__tests__/drops-sponsored-claim.test.ts` |
| 18 | `xtrata-2.0/functions/sponsor/[[path]].ts` |
| 17 | `xtrata-2.0/src/lib/wallet/__tests__/connect.test.ts` |
| 17 | `xtrata-2.0/docs/app-reference.md` |
| 16 | `xtrata-2.0/forever-twins/miami-degens/index.html` |
| 16 | `xtrata-2.0/forever-twins/leo-cats/index.html` |
| 16 | `xtrata-2.0/forever-twins/bitcoin-pepes/index.html` |
| 13 | `xtrata-2.0/src/deploy-console.ts` |
| 13 | `xtrata-2.0/functions/sponsor/__tests__/handler.test.ts` |
| 12 | `xtrata-2.0/src/home/radio.css` |
| 12 | `xtrata-2.0/src/home/__tests__/homepage-content.test.ts` |
| 12 | `xtrata-2.0/public/_redirects` |
| 12 | `xtrata-2.0/package.json` |
| 10 | `xtrata-2.0/docs/plans/SPONSOR-RELAYER-RUNBOOK.md` |
| 10 | `xtrata-2.0/contracts/clarinet/Clarinet.toml` |
| 9 | `xtrata-2.0/xtrata-agent-one/svc/core.mjs` |
| 9 | `xtrata-2.0/src/agent-one/__tests__/support/fake-chain.ts` |
| 9 | `xtrata-2.0/first-masterpiece/index.html` |
| 9 | `xtrata-2.0/contracts/clarinet/deployments/default.simnet-plan.yaml` |
| 9 | `xtrata-2.0/.gitignore` |
| 8 | `xtrata-2.0/xtrata-agent-one/wizard/HTML_Template.js` |
| 8 | `xtrata-2.0/src/lib/drops/sponsored-claim.ts` |
| 8 | `xtrata-2.0/scripts/copy-static-apps.mjs` |
| 7 | `xtrata-2.0/xtrata-agent-one/svc/vendor/HTML_Template.js` |
| 7 | `xtrata-2.0/xtrata-agent-one/server/server.mjs` |
| 7 | `xtrata-2.0/vite.config.ts` |
| 7 | `xtrata-2.0/src/sponsor-ops.ts` |
| 7 | `xtrata-2.0/scripts/mainnet-deploy-contract.mjs` |
| 7 | `xtrata-2.0/opus-file-generator/HTML_Template.js` |

Two structural notes for later passes, recorded here as mapping only, not as findings: `src/home/main.js` at 107 changes is the single highest-churn file by a factor of nearly two, and `xtrata-agent-one/wizard/HTML_Template.js`, `xtrata-agent-one/svc/vendor/HTML_Template.js` and `opus-file-generator/HTML_Template.js` are three separately-tracked files sharing a name and similar change counts (8/7/7).

### 2.9 Uncommitted work

**The brief anticipates "four uncommitted modified files". There are none.** Both `git diff HEAD --stat` and `git diff --cached --stat` return empty output: no tracked file is modified, and nothing is staged. `git diff HEAD -- <path>` therefore produces nothing for any path. The working tree's tracked content is byte-identical to `b5c7443e`.

What the tree does carry is eight untracked entries, seven of which are inside `xtrata-2.0/`:

| Path | Size / contents | Assessment |
|---|---|---|
| `xtrata-2.0/audit/` | `pass1.md`–`pass4.md` (2.6–3.2 KB each) + `run.sh` (2.2 KB, executable), all 2026-08-01 12:34–12:37 | **Deliberate WIP — this audit's own harness.** `run.sh` drives four `claude -p` passes at increasing effort, saves an uncommitted-work patch to `$HOME` first, and diffs `git status` before/after. `pass1.md` is the brief for this document. |
| `xtrata-2.0/docs/audits/` | `XTRATA_OPTIMISATION_AUDIT.md` (this file) + `XTRATA_OPTIMISATION_AUDIT-appendices.md` (32 KB, 12:51) | **Deliberate WIP — audit output.** The appendices file belongs to the superseded 12:55 run; see the note at the top of this document. |
| `xtrata-2.0/docs/plans/WIZARD-PIPELINE-PLAN.md` | 6.5 KB, 13:20 | **Deliberate WIP.** Design doc for the persona→marketplace inscription pipeline: 31 inscriptions, ~24 listings, ~3 STX. Directly matched by committed code — `scripts/wizard/` and the `wizards:*` npm scripts arrived on `main-staging` on 2026-07-30/31. This is the plan for shipped work that has not been committed alongside it. |
| `xtrata-2.0/docs/plans/WIZARD-RELEASE-RUNBOOK.md` | 5.3 KB, 13:25 | **Deliberate WIP.** The day-of runbook for the same pipeline, with named gates A–E and per-wallet STX floors. Same status as above. |
| `xtrata-2.0/prompt-run1.md`, `prompt-run2.md` | 3.0 KB / 4.8 KB, 2026-07-31 03:23 | **Superseded scaffolding.** An earlier two-run version of the audit brief, replaced by the four-pass `audit/` directory. Harmless, but stale, and sitting at the subtree root rather than under `audit/`. |
| `xtrata-2.0/run-xtrata-audit.sh` | 1.8 KB executable, 2026-07-31 03:28 | **Superseded scaffolding.** The two-run driver matching `prompt-run1/2.md`; replaced by `audit/run.sh`. Note it writes a full repo backup to `$HOME/xtrata-backup-…`. |
| `xtrata-chess/` | Full Clarinet project (`Clarinet.toml`, `contracts/xtrata-chess-log-v1.clar`, `src/`, `tests/`, `node_modules/`, `dist/`) | **Out of scope** (root sibling, not `xtrata-2.0/`). Recorded because it is a complete, entirely untracked project — nothing of it is in git on any branch. |

A ninth untracked entry, `xtrata-2.0/scripts/wizard/collection-marks.mjs`, appeared during the audit and is described in the Verification section.

Nothing here reads as accidental drift. The two `prompt-run*.md` files and `run-xtrata-audit.sh` are the only stale items, and they are superseded tooling rather than lost work.

**Separately: ignored on-disk residue.** `xtrata-2.0/rebuild/` exists in the working tree and does not appear in `git status` because every one of its remaining contents is ignored — `client/node_modules`, `contracts/node_modules`, `relayer/node_modules`, `ui/{node_modules,dist,.claude}`. No source file survives. On `origin/ms-rebuild` this same path holds the entire tracked rebuild. What is on disk is the build residue of a past `ms-rebuild` checkout, orphaned when the branch was left. It costs disk and nothing else, but it makes `xtrata-2.0/rebuild/` look present when the code is not.

---

## 3. Recent-change review

### 3.0 What this pass covers, and one correction to the pass-1 baseline

Window: **2026-07-12 → 2026-08-02**, the last 21 days. On the `main-staging` lineage, **247 commits touch `xtrata-2.0/`** in that window. Every diff cited below was read, not inferred from the commit subject.

**HEAD has moved since pass 1.** Pass 1 was taken at `b5c7443e` (2026-08-01). The tree is now at **`c33bb100`** on `main-staging`, five commits later — `fb774eba`, `1ba94532`, `f91ea838`, `1836d63f`, `b25d3b37`, `a69416fd`, `8f1c00f2`, `be142707`, `ee095f00`, `31797b03`, `ba64a1d0` landed across 2026-08-01 and 2026-08-02. Three pass-1 statements are now stale as a result, and §3.9 lists them. `git status --porcelain` has also shrunk: `xtrata-2.0/docs/plans/WIZARD-PIPELINE-PLAN.md`, `WIZARD-RELEASE-RUNBOOK.md` and `scripts/wizard/collection-marks.mjs` were untracked at pass 1 and are now committed (`a69416fd`, `8f1c00f2`); `xtrata-chess/` no longer appears.

**One factual correction.** Pass 1 §2.5 states "there are no `Co-Authored-By` trailers and no second author, so 'who reviewed this' cannot be answered from git." That is wrong. **147 of the 247 in-window commits carry `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`**, including every commit from 2026-07-26 onward. The trailer is the reviewability signal pass 1 looked for and did not find. Separately, `ffccbf09` opens "Not my changes. Reviewed, verified and committing them because they finish a job I left half done, and they caught a bug I had introduced" — a second party's work committed under the single author, which is a review record the authorship field cannot express.

**Branch geometry, which makes the third bullet of the brief cheap to answer.** The merge base `main-staging`…`main` is still `2216dae8` (2026-07-29). So:

- Every theme dated **2026-07-30 or later is on `main-staging` only** (themes A–D, and `ba64a1d0`). That is 37 commits.
- Every theme dated **2026-07-29 or earlier is on both** `main-staging` and `main`, identical content, reached through PRs #263–#268.
- **`staging` carries none of it.** `git merge-base main-staging staging` is `1f1d903a` — `staging`'s own HEAD, 2026-03-24. `staging` is an ancestor of `main-staging`, four months behind, and contains no in-window work at all. Pass 1 §7.1 established that `staging` is not the staging branch; nothing in this pass contradicts that, and per-theme "is it on `staging`" is uniformly "no, structurally". I do not repeat it per theme.

**`main` is no longer merge-only.** Pass 1 §7.2 concluded that `main` "has contributed no original content of its own". That stopped being true on 2026-08-01. `main` now carries two non-merge commits of its own — `83adb003` and `a055ca17` — covered in §3.13.

---

### 3.1 Theme A — the wizard fleet pipeline (`scripts/wizard/`)

19 commits, 2026-07-30 → 2026-08-02. `d2ae6b95`, `9db3f13d`, `a93697c5`, `27c4561c` (plan), `0c9b8149`, `cabeb3d1`, `6b2583fb`, `81a52e8e`, `14eca936`, `52acf1bc`, `6601bc31`, `b5c7443e`, `8f1c00f2`, `a69416fd`, `b25d3b37`, `1836d63f`, `be142707`, `31797b03`, `ee095f00`.

**What changed and why.** A Node harness that drives three synthetic "wizard" wallets from empty to a complete, cross-referenced, listed on-chain collection. It grew from a plan (`docs/plans/COLLECTION-WIZARD-PLAN.md`, `d2ae6b95`) through three art collections (`b5c7443e`), maker's marks and a shared coat of arms (`8f1c00f2`), to a graph-ordered pipeline that mints 35 inscriptions in dependency order and refuses to start a stage until the previous one has been **read back off chain** (`a69416fd`, `scripts/wizard/pipeline-core.mjs`, 1,595 lines). It then ran for real on mainnet on 2026-08-01 (`be142707`).

**Completeness across layers.** Complete within its layer and deliberately confined to it. It touches no Clarity contract, no UI, no Cloudflare function, no service module — it is a standalone CLI harness under `scripts/wizard/` plus six `wizards:*` entries in `package.json` (`b5c7443e`) and plan/runbook docs. 25 modules, 18,775 source lines, 14 test files, 8,319 test lines. `.gitignore` was extended for each new journal shape as it appeared: `.run-*`, `.market-*`, `.collection-*` (`b5c7443e`), `.pipeline-*` (`ee095f00`). That last one is a **reactive** gitignore addition — the pattern was added only after a real run produced an untracked journal, and `ee095f00`'s own message says "an untracked file next to a `git add -A` is how the wizard keys nearly got staged once already".

**Regressions and behavioural changes.**

- `b25d3b37` corrects the cost model constant from `41_000n` to `11_000n` µSTX per mint (`scripts/wizard/pipeline-core.mjs`, `costModel`). The commit is explicit that this only sized the cap and the report, not what was paid. Worth noting that `docs/plans/WIZARD-ROUND-1-REPORT.md` — committed on 2026-07-31 in `52acf1bc` — already recorded "every protocol fee 11,000 µSTX" from a real run. The measured evidence sat in the repo for a day before the constant that contradicted it was corrected.
- `b5c7443e` fixes a live defect in its own harness: `--collection` was documented in `--help` and never wired, so exporting any collection wrote the Builder's plates regardless of the id requested.
- `1836d63f` adds `scripts/wizard/hiro-fetch.mjs` (176 lines) after the round-1 run halted: the plates gate issued 48 read calls in a burst and Hiro rate-limited at roughly call 40. The new port attaches the API key, spaces calls 120 ms apart and honours `Retry-After`.

**Duplicated logic.** Largely avoided by design — `pipeline-core.mjs`'s header states it does not reimplement minting and imports the per-mint rails from `inscribe.mjs` and `run-thread-core.mjs`, calling `runCollection` rather than copying its loop. One genuine duplicate survives: **`readChainTip` is implemented three times**. `scripts/wizard/inscribe.mjs:369` (`fetchChainTip`), `scripts/wizard/market-run-core.mjs:630` and `scripts/wizard/provision-core.mjs:660`. The market copy is a near-literal re-typing of the `inscribe.mjs` original — same URL `/extended/v2/blocks?limit=1`, same `results[0].height ?? total` fallback, same error string — differing only in skipping the `readJson` wrapper. The provision copy at least wraps `fetchChainTip` and adds a null-on-failure contract. Flagged for pass 3.

Structurally, four `*-core.mjs` runners each carry their own `…JournalPathFor`, `empty…Journal`, `…StatusReport`, `format…Plan` and `format…Report`. That is parallel shape rather than copied code, but it is four places to change when the journal format moves.

**Leftovers.** None found. No `TODO`/`FIXME`/`XXX`/`HACK` anywhere under `xtrata-2.0/src` (one comment containing the word `DEPRECATED`, at `src/agent-one/agent-core.ts:86`, describing a Hiro endpoint). No commented-out blocks, no debug flags, no dead fallbacks in the wizard tree.

**Known-outstanding, from the project's own round-1 record.** `docs/plans/WIZARD-RELEASE-ROUND-1.md` names four defects the real run exposed. Two are fixed (`1836d63f` for the rate limit; the plan formatter now lives in `pipeline-core.mjs` so a caller cannot supply `inscribe.mjs`'s corpus-shaped `formatPlan`). **Two are not.**

| Round-1 defect | Status | Evidence |
|---|---|---|
| Plan formatter crashed on a persona plan (no `plan.subject.id`) | Fixed | `formatPipelinePlan` in `pipeline-core.mjs`, `1836d63f` |
| Plates gate rate-limited, run halted | Fixed | `scripts/wizard/hiro-fetch.mjs`, `1836d63f` |
| Manifest reports "8 members" and "9 members" on consecutive lines | **Open** | `scripts/wizard/collection-run-core.mjs:1148` prints `members.length`; `:1371` prints `plan.parentIds.length`. The two disagree by one because the persona edge is in the dependency list and not in the prose. Cosmetic; the doc says "worth fixing before someone trusts the wrong line" |
| Gateway serves `<header><base href="null">`, 18 bytes not minted | **Open, and live** | See §3.11 — root cause located, and it is not confined to the gateway |

**Branch presence.** `main-staging` only. Not on `main`, not on `staging`. The absence looks **intentional but is now overdue**: this is 37 commits and the largest single body of unmerged work in the repository, sitting behind a merge cadence that ran at six PRs in two days as recently as 2026-07-28.

---

### 3.2 Theme B — sponsored market buy, and the market version weld

5 commits, 2026-07-30 and 2026-08-02. `3026a159`, `fb43fd01`, `4f717fdb`, plus `cabeb3d1` (adjacent) and `ba64a1d0`.

**What changed and why.** The market page advertised "Buy — no STX needed" with a green badge on sponsored listings while `marketBuy` called `showContractCall` unconditionally, so zero-STX buyers were sent into a transaction they could not pay for. `3026a159` removes the promise, then extracts every sponsored-purchase decision into a new DOM-free, React-free `src/lib/market/sponsored-buy.ts` (319 lines) that both `src/screens/market/useSponsoredBuy.ts` and `SponsoredBuySection.tsx` now import, so the two surfaces cannot answer the same question differently. That divergence is named as the cause of the false promise.

**Completeness across layers.** This is the most complete theme in the window: service module (`sponsored-buy.ts`, `registry.ts`), vanilla UI (`src/home/main.js`), React UI (`useSponsoredBuy.ts`, `SponsoredBuySection.tsx`), data (`src/data/market-registry.json`), types, three new test files, plan doc (`docs/plans/SPONSORED-MARKET-BUY-PLAN.md`), and — unusually — the **agent-facing docs regenerate with it**: `4f717fdb` moves `XTRATA_AGENT_SKILL.md`, four `docs/ai-skills/skill-*.md`, `public/llms.txt` and `public/llms-full.txt` in the same commit as the code, via `scripts/sdk/llms-generate.mjs`.

**Regressions and behavioural changes.**

- `fb43fd01` is a genuine self-inflicted regression caught within hours: `marketSponsorClientFor` normalised the relayer base with `.replace(/\/+$/, '')` and treated the falsy result as "no relayer". Every sponsored market in `src/data/market-registry.json` sets `sponsorApi` to `"/"` because the relayer is same-origin, so the guard rejected all three mainnet markets and the whole of `3026a159`'s work returned `false` every time — silently, because the caller falls through to self-paid by design. Fixed by `resolveSponsorBase` in `src/lib/market/sponsored-buy.ts:48`, which distinguishes `''` (same-origin, valid) from `null` (unconfigured). The commit is candid that a fixture would not have caught it because the bug was in the real data.
- `4f717fdb` is a behavioural change with real user impact: pre-sponsored markets weld their NFT contract in at deploy time as a Clarity constant with no getter and no setter, so a v3 inscription could not be listed anywhere. Worse, the buy path was telling sellers of legacy listings to migrate to v3 and relist — moving their token out of the one core those markets accept. The weld is now recorded as `lockedNftContract` in the registry (it cannot be read from chain), `sellEntries()` becomes `getSellableMarkets(activeCore, network)`, and an inverted comparator in `populateSellMarkets` that sorted sponsored markets *last* is corrected.

**Feature flags.** `SPONSORED_CHECKOUT_ENABLED` was introduced in `3026a159` and **deleted the same day** in `4f717fdb`, once the contract fact replaced it as the gate. Grepped: zero references remain anywhere in the subtree. Clean removal.

**Duplicated logic.** This theme *removes* duplication rather than adding it — that is its stated purpose. One residual: `fallbackToSelfPaid` is defined independently in `src/lib/market/sponsored-buy.ts` and in `packages/xtrata-sdk/src/sponsor.ts:91`, with the SDK's list of non-fallback codes (`LISTING_SOLD`, `DUPLICATE`, `LISTING_BUSY`) not matching the app's test expectations, which also assert `ATTESTOR_DISABLED` (`src/lib/market/__tests__/sponsor-client.test.ts:237`). Two error taxonomies for one protocol. Flagged for pass 4.

**Not verified by the author.** `3026a159` states plainly: no browser run, the DOM glue in `marketSponsoredBuy` is covered structurally not behaviourally, and there are **no live sponsored listings on mainnet at all** (`get-last-listing-id` reads 0 / 2 / 0), so the branch cannot be exercised on production either. Stage 3 (restoring the copy), the testnet rehearsal from a genuinely zero-STX wallet, and Playwright coverage are all still open in the plan.

**Branch presence.** `main-staging` only. **The `fb43fd01` classification from pass 1 §7.2 should be downgraded.** Pass 1 flagged it "potentially dangerous while unmerged — if the bad configuration is what production is running, this is a live defect". Reading the diff: the `"/"` value has always been in `src/data/market-registry.json`, and the defect it caused was that the *new* sponsored branch from `3026a159` never fired. Since `3026a159` is itself unmerged, production has no sponsored branch to disable. Nothing is broken on `main`; the fix and the bug are both staging-only and cancel out.

---

### 3.3 Theme C — the fullscreen viewer, the relations strip, and the nav

10 commits, 2026-07-31. `b4e9b0e5`, `3167abb5`, `553aaa0e`, `1cc4e616`, `ffccbf09`, `4b3cf656`, `31fa7194`, plus `6601bc31`, `52acf1bc`, `b5c7443e` (wizard-adjacent).

**What changed and why.** The enlarged inscription viewer gains an identity header, real arrow glyphs (`b4e9b0e5`), and a relations strip that lets you walk an inscription's on-chain family — ancestors, siblings, dependants — without leaving the view (`3167abb5`, +129 lines in `src/home/main.js`, +108 in `src/home/styles/home.css`, a new `src/home/__tests__/fullscreen-relations.test.ts`). `4b3cf656` then splits incoming edges into Replies and Receipts.

**Completeness across layers.** Complete: markup (`index.html`), behaviour (`src/home/main.js`), styling (`src/home/styles/home.css`), tests. No contract or service change is implied — the data comes from existing `get-dependencies` reads.

**Regressions and behavioural changes.** This theme is four iterations on one layout bug, and it is the clearest example in the window of fast iteration producing and then correcting its own defect:

- `3167abb5` adds the strip; `553aaa0e` aligns the artwork; `1cc4e616` reserves the row.
- `ffccbf09` inverts the whole approach and is explicit about why: the author's own version had `syncFullscreenChromeSpace` read `!strip.hidden`, so a strip that fills two round trips later could still move the artwork — "which was the entire defect". The fix makes the chrome the only measured thing and the relations row a CSS constant, and removes the `hidden` attribute from the markup entirely so the row is reserved from first paint. It also caught a bug the author had introduced: two media queries at 680 px and portrait overrode `--fullscreen-chrome-space` with a flat 136 px, silently dropping the relations row out of the reservation **on exactly the screens with the least height to spare**. A test now asserts no px override of the reservation can come back.
- `ffccbf09` also removes a load-bearing comment: a test had anchored on comment text and broke when the comment was corrected. It now slices to the rule's own closing brace.

**Duplicated logic.** None introduced. Note the opposite: `src/home/main.js` already carries eight sites writing `kind === 'image' || kind === 'svg'` (lines 3493, 5982, 6289, 6783, 7095, 7202 and others) — a media-kind predicate repeated inline rather than extracted. That repetition is what made the ninth site's divergence invisible; see §3.4.

**Leftovers found and removed.** `31fa7194` renames the nav (`Create → Inscribe`, `Collect → Buy & sell`, `Build → Developers`) and drops the Wizard entry. In doing so it discovered **dead markup that had never executed**: `largeFileNotice` exists in `index.html`, marked `hidden`, and appeared in no JavaScript anywhere — nothing ever unhid it, so the automatic large-file hand-off to the Wizard "has never fired once". Removing the nav entry on the strength of it would have lost the Wizard for exactly the files that need it. It is wired now, on the `SMALL_MINT_HELPER_MAX_CHUNKS` threshold. `/create-wizard` still routes and its embed still works; only the nav entry is gone.

**One thing worth watching.** `4b3cf656` classifies receipts by token-URI convention (`xtrata:receipt/<jobId>`), not by any fact the chain records. The commit says so itself: "an inscription that happens to use that URI prefix would be counted as a receipt." Not a defect today; it is a correctness assumption that will not survive a third party using the prefix.

**Branch presence.** `main-staging` only.

---

### 3.4 Theme D — market thumbnails, and an existence probe rendered as art

1 commit, `ba64a1d0`, 2026-08-02. The most recent substantive change in the repository.

**What changed and why.** Twenty-four distinct pixel-art plates were listed on the market and every card rendered the same three concentric circles. Two defects stacked:

1. The on-chain SVG branch was **unreachable dead code**. It read `kind === 'image' && fetchable && mime.includes('svg')`, but `getMediaKind` returns `'svg'` for `image/svg+xml` and `'image'` only for raster types. The two are disjoint, so the condition could never be true. Consequence: the page made **one** `get-chunk` call across twenty-five listings.
2. Everything therefore fell through to the `summary.svgDataUri` fallback — and on an Xtrata core `get-svg-data-uri` returns a **constant** for every token that exists, identical from v1.1 through v3.4. It answers "does this id exist", not "what does it look like". The page was rendering an existence probe as though it were the artwork.

The commit's own reading of severity is the right one and worth carrying into pass 4: a missing preview is an absence and reads as one; a constant rendered as art is a confident wrong answer with nothing on the page to say so.

**Completeness.** Fix plus 153 lines of new tests (`src/home/__tests__/market-svg-thumbnails.test.ts`), with negative controls stated: restoring the impossible condition fails 3 of 10 new tests, removing the placeholder gate fails 1. The `svgDataUri` fallback is **skipped, not removed**, because `fetchTokenSummary` is generic and another contract's `svgDataUri` may be real — the check matches three independent marks in the decoded SVG.

**Branch presence, and this is the important part.** Fixed on `main-staging` at `src/home/main.js:11201`. **The impossible condition is still live on `main` at `src/home/main.js:10689`.** Any market or grid surface on production that depends on that branch is showing the existence-probe constant. Flagged for pass 4 as the highest-visibility live defect found in this pass.

---

### 3.5 Theme E — the inscribed audio player on phones

7 commits, 2026-07-29, plus 4 radio commits 2026-07-27/28. `644b47fa`, `745a7e01`, `298c08e6`, `6f0e5532`, `c7653614`, `4b7fdf22`, `2216dae8`; `f2830b74`, `9245e317`, `7b031af9`/`7972c7cb`, `c9e6e334`, `2db22622`.

**What changed and why.** Newer inscribed players would not start on iPhone. The sequence is three wrong diagnoses corrected by user-supplied evidence, and it is documented as such in the commits.

**Regressions and behavioural changes — including a self-revert.**

- `644b47fa` blamed a full-track `decodeAudioData` blowing the frame's memory budget, and added a size guard to the template.
- `745a7e01` added `injectMobilePlaybackShim` in `src/lib/viewer/html-preview.ts` (55 lines) plus 92 lines of tests, rewriting the runtime of *already-inscribed* players on mobile — carefully argued as legitimate because the inscribed bytes and content hash are untouched and the shim takes a `.catch()` branch the original author wrote.
- **`6f0e5532` reverts both.** The real cause was the controls auto-hiding on `pointerleave`, which is a mouse idea: a finger emits one `pointerdown` then nothing, and `pointerleave` fires the instant it lifts, so every tap was followed immediately by the controls fading out from under the next one. Evidence that killed the memory theory: #1117 is 7.64 MB and plays; #2883 is 6.82 MB and did not. The larger file works.

Net effect on the tree: `src/lib/viewer/html-preview.ts` and `src/lib/viewer/__tests__/playback-shim.test.ts` were added and deleted within the window and leave no residue. This is a clean revert, not an abandoned experiment — but it means **147 lines of the window's diff are net-zero** and any per-file churn count for `src/home/main.js` overstates settled change.

**Duplicated logic — the one real triplication in the subtree, and it is guarded.** `HTML_Template.js` exists three times: `opus-file-generator/HTML_Template.js`, `xtrata-agent-one/wizard/HTML_Template.js`, `xtrata-agent-one/svc/vendor/HTML_Template.js`. Every fix in this theme had to be applied by hand to all three, and every commit in the theme does exactly that. **A byte-parity test enforces it**: `src/home/__tests__/player-template-mobile.test.ts:149-151` reads all three and asserts `other === first` with the message "`…` has drifted from `…`". Verified as still passing structurally — the guard exists and names the drift. That converts an ongoing hazard into a build-time failure, and is the right mitigation short of a single source. Recorded as a mitigated risk, not a finding.

**Why this matters more than most UI work.** The test file's own header says it: the template is inscribed, so a player shipped broken stays broken forever for every inscription made while it was broken. The 2026-07-03 regression in `a6e49511` is named as the reason the guards exist.

**Branch presence.** All of theme E is at or below `2216dae8`, so it is on **both `main` and `main-staging`**, identical.

---

### 3.6 Theme F — Agent One reliability, fees and funds safety

14 commits, 2026-07-25 → 2026-07-26. `b00f982f`, `47eed217`, `4d2ae471`, `c321bf88`, `e1768ade`, `8c4a6464`, `289a3aa8`, `9354aa8b`, `47eff7ac`, `9dc56647`, `a6b81425`, `fc20bd0e`, `4b96b7cc`, `a1b01bb2`.

**What changed and why.** A concentrated hardening run on `src/agent-one/agent-core.ts` (48 changes in 60 days, the second-highest-churn file in the subtree). The organising idea is the one CLAUDE.md names as "a recurring bug class worth knowing": **a read that failed and a read that returned nothing are not the same answer.** `c321bf88` ("a failed balance read is not an empty wallet"), `8c4a6464` (gate the parent on chain state, not the lagging holdings index), `a1b01bb2` ("a parent that has arrived stays arrived") and `47eff7ac` ("finish the sweep for reads that lie when they fail") are four passes at the same class, ending in a sweep across 11 files including `scripts/premerge-live-smoke.mjs`, `scripts/sweep-sponsor-wallet.mjs`, `src/sponsor-ops.ts` and `xtrata-agent-one/svc/sponsor-service.mjs`.

**Completeness across layers.** Complete and unusually well-instrumented. `289a3aa8` adds a fault-injection harness (`src/agent-one/__tests__/support/fake-chain.ts`, 191 lines) and, in the same commit, the funds-safety bug it found. Every subsequent fee/broadcast commit extends the fake chain alongside the fix (`9354aa8b` +57, `4b96b7cc` +23, `fc20bd0e` +24, `a6b81425` +12). The fee work converges on one model for both quotes: pay the node's LOW estimate rather than the middle (`a6b81425`), size the miner reserve from the network floor (`fc20bd0e`), cap per-batch fees (`9dc56647`), and escalate when a transaction is accepted but never mined (`4b96b7cc`).

**Process gap worth recording.** CLAUDE.md states the wizard bundle's cache-buster appears in **four** places that must move together: `src/agent-one/agent-core.ts` (`AGENT_BUILD`), and the `?v=` in `wizard/index.html`, `wizard/manifests.html`, `wizard/suno.html`. Most commits in this theme honour it. **`1c7d27f6` (2026-07-28) does not** — it changes `src/agent-one/agent-core.ts` and `src/agent-one/unfinished.ts`, both bundled into `agent-one.js`, and leaves `AGENT_BUILD` at `2026-07-28.3` with no HTML touched. The consequence CLAUDE.md predicts is a browser silently running an old bundle against a changed API. It was repaired incidentally by the `.4`–`.7` bumps on 2026-07-29, and **all four locations currently agree at `2026-07-28.7`** (`src/agent-one/agent-core.ts:554`, `wizard/index.html:799`, `wizard/manifests.html:216`, `wizard/suno.html:238` and `XAO_MIN_AGENT_BUILD` at `:253`). So: a real rule violation, now moot, and evidence that the rule is enforced by discipline alone. There is no test asserting the four agree. Flagged for pass 4 as a cheap guard worth adding.

**Duplicated logic.** None introduced. The theme's direction is the opposite — `fc20bd0e` explicitly collapses two fee models into one.

**Branch presence.** On **both `main` and `main-staging`**.

---

### 3.7 Theme G — wizard job lifecycle: keep-open, cancel, unstick, history

14 commits, 2026-07-26 → 2026-07-28. `5461f0b0`, `53b8b50c`, `25a4c227`, `a60fc76f`, `be90bd1a`, `c4403367`, `0628c883`, `b14f9c94`, `cb38667c`, `bff4ba19`, `b3fd8140`, `7dabf318`, `bec19e43`, `de76470d`, `c432a522`, `1c7d27f6`.

**What changed and why.** Everything a long-running inscription job needs when the human walks away: a keep-open banner, a leave guard on embedded jobs, progress in the tab title with a completion notification, one cancel dialog instead of several, a reminder for unfinished jobs, job-history export between sites, and two "unstick" fixes for a jammed wallet.

**Completeness across layers.** Complete. Two new service modules (`src/agent-one/unfinished.ts`, `src/agent-one/ui-panels.ts`), `agent-core.ts`, three wizard HTML pages, `src/home/main.js` for the embedded case, and a test file per behaviour (`confirm-danger`, `unfinished-jobs`, `keep-open`, `embedded-leave-guard`, `tab-progress`, `job-export`, `unfinished-upload`, `stray-inscription`, `cancel-safety`).

**Duplication actively removed.** `c4403367` and `0628c883` are both consolidation commits: the keep-open banner and the cancel dialog had been implemented separately in `wizard/index.html` and `wizard/suno.html`, and both move into shared `src/agent-one/ui-panels.ts`. Net effect in `0628c883`: `+90` in the shared module, `−48` in `suno.html`. This is the correct response to the fast-iteration duplication the brief asks about, applied by the author before the audit found it.

**Regressions.** `87fbacbb` and `910ba31a` (2026-07-27) are both repairs of errors introduced by `0628c883`'s extraction — a `SyntaxError` and two SUNO errors. `87fbacbb`'s subject, "make it impossible to miss again", indicates a guard was added with the fix. This is the expected cost of an extraction across hand-written HTML, and it was paid the same day.

**Money-path fixes.** `bec19e43` ("send the replacement to the payer, not to the wallet itself") and `de76470d` ("fill the nonce hole underneath the queue, not just the queue") are the two halves of one nonce-gap defect. `7dabf318` stops hiding jobs that still hold money. `1c7d27f6` stops nagging about jobs that never took a penny. These belong in pass 4's value-correctness review, not here.

**Branch presence.** On **both `main` and `main-staging`** — these are the commits behind PRs #263–#267.

---

### 3.8 Theme H — runtime content cache and page weight

6 commits, 2026-07-26, plus 2 duplicates 2026-07-29. `b4b0d03f`, `574be05b`, `8509c5e2`, `d7c70e03`, `3cb46af3`, `c0fa07cc`; `d0de3efb`/`4e3e7e7c`.

**What changed and why.** A measurement report (`docs/plans/STORAGE-AND-SPEED-REPORT.md`, 528 lines) concludes the whole chain is 0.55 GB and can be cached permanently. `8509c5e2` then binds the R2 bucket the code already expected — `RUNTIME_CONTENT_CACHE` / `xtrata-runtime-content-cache` — in both `wrangler.toml` and `functions/wrangler.toml`. The commit subject is "**Bind the runtime content cache bucket that was never created**": config had been referencing a binding that did not exist. `c0fa07cc` adds `functions/runtime/index-meta.ts` so a cache hit can read the content hash from the index rather than the chain. `574be05b` makes the runtime answer 404 when no core holds a token, naming which cores were searched. `3cb46af3` stops the homepage downloading ~10 MB of music before anyone asks.

**Completeness across layers.** Complete: config (`wrangler.toml` ×2), functions (`content.ts`, `lib.ts`, `index-meta.ts`), client (`src/home/homepage.js`, `radio.js`, `public/xtrata-radio.js`), CSS, tests, docs.

**On the duplicate-subject pair.** Pass 1 §7.5 classified `4e3e7e7c` and `d0de3efb` as pull-without-rebase noise. Verified more precisely: `git diff d0de3efb 4e3e7e7c -- xtrata-2.0/` is **one file, `RADIO-EMBED-PLAN.md`, +21/−12**. The code in `functions/runtime/lib.ts` and `packages/xtrata-reconstruction/src/index.ts` is byte-identical between the two. So the work is not double-applied and the tree is correct; the second commit re-states the same change with an extended plan doc. Pass 1's classification holds; the tree carries no risk from it.

**Branch presence.** On **both `main` and `main-staging`**.

---

### 3.9 Theme I — drops, Proof of Free, and the one-version rule

~18 commits, 2026-07-21 → 2026-07-29. `8dbd1ec5`, `491b2bfe`, `d2a1a1cd`, `924bf718`, `a8abacdc`, `191195a6`, the 2026-07-24 Proof of Free batch, `364ed9ab`, `edb9605f`, `11e278e5`, `8c6d806d`, `4f95adaf`, `48b5ea53`, `e29660ec`, `41a4da82`, `04804b01`, `1dccc79c`.

**What changed and why.** Campaign-aware drops v1.1, a deploy workflow, a claim-gated mosaic, blocked-claim reasons surfaced on the card that was pressed, BNS name selection moved into the page, a parallelised read phase, and finally a claimed-drops gallery (`1dccc79c`, +1,907 lines, new `src/lib/drops/gallery.ts`).

**The one-version rule, and its measured justification.** `41a4da82` removes `xtrata-drops-v1-0` from `src/data/drops-registry.json` and writes the rule into `xtrata-2.0/CLAUDE.md`. Measured on `/drops`: requests 134 → 45, contract reads 68 → 34 (all 34 to v1-0 returned no live drops), last response 8.2 s → 3.1 s, cards shown unchanged at 24. Verified: the registry now holds exactly one entry. The commit is also careful about what the rule does *not* license — `src/lib/drops/collection-lock.ts` and `src/sponsor-ops.ts` still name v1-0 because that is where the activity genuinely happened, and the CLAUDE.md text says so.

**A shipped regression and its revert.** `04804b01` reverts a drops-thumbnail change that "left the Claim page blank" — every card sat on "BINARY / TAP TO LOAD" and the grid looked empty. The commit is unusually honest about the cause: routing drop thumbnails through `liveHtmlFrameManager` gates rendering on an `IntersectionObserver`, so a tile renders only if the observer fires *and* the element is still connected when it does; either failing leaves the poster up permanently, which is indistinguishable from an empty page. **The revert does not identify which of two candidate causes it was** — `resetBackgroundThumbnailHydration` calling `manager.reset()` after tiles registered, or `renderDrops` replacing slots after hydration registered the frames. It reverts to the iframe rendering that "ran for months" and keeps only the one sub-change that cannot blank anything. Recorded here because the underlying fragility in `liveHtmlFrameManager` is untouched and the market grid still uses it. Flagged for pass 3.

The author states this was shipped without being able to verify it, and said so at the time. That pattern recurs — `3026a159` in theme B is the other instance.

**Branch presence.** On **both `main` and `main-staging`**.

---

### 3.10 Theme J — wallet: Xverse repair, then a passkey spike

~12 commits. Xverse: `f7faae86`, `deae7cb7`, `c178c7a7`, `f8666f6a`, `13f0c13a`, `9dc3e0c9`, `1f69ade9` (2026-07-21), `40bff9d8` (2026-07-25). Passkey: `0440b93d`, `ba2ca8e3`, `ad39ba15`, `b2ac6127` (2026-07-27).

**What changed and why.** The 2026-07-21 run is the production incident that produced `docs/WALLET-PLAYBOOK.md` and the six locked-down rules now quoted at the top of `xtrata-2.0/CLAUDE.md` — two Xverse bridges with different request shapes, never send `sender` on `stx_callContract`, never use `stx_getAccounts` in the preflight, detect providers on the top same-origin window, open the chooser on every connect, abort when a confirmed account disagrees with the post-conditions. `b2ac6127` makes the playbook findable and corrects its ship checklist.

**Completeness.** Complete and test-locked: `src/lib/wallet/__tests__/connect.test.ts` (17 changes in 60 days) and `src/agent-one/__tests__/wallet-payment.test.ts` are named in CLAUDE.md as the enforcement, with the instruction "a failure there means a rule is being violated: fix the code, never weaken the test."

**The passkey subsystem is unwired, and that appears deliberate.** `0440b93d` and `ad39ba15` add `src/lib/wallet/passkey/` — `envelope.ts`, `seed.ts`, `session-return.ts`, `bridge/client.ts`, `bridge/host.ts`, `bridge/protocol.ts`, roughly 810 source lines against 920 test lines — plus `docs/PASSKEY-WALLET.md` and a canary app at `recursive-apps/23-passkey-canary/`. **Grepped: nothing outside its own tests imports any of it.** `src/lib/wallet/connect.ts` has no reference to it, nor does `index.html` or `public/_redirects`. The only shipped artefact is the canary, wired in `scripts/copy-static-apps.mjs:46-47` to `dist/passkey-canary`. Classification: **intentional spike, correctly isolated** — it costs nothing at runtime because unreferenced modules never enter the bundle graph. Recorded so a later pass does not read it as dead code to delete; the design doc and the on-hardware canary result are the deliverable.

**Branch presence.** On **both `main` and `main-staging`**.

---

### 3.11 Theme K — the contract layer

**v3.2.4 candidate** (`4cfb332e`, `6082465d`, 2026-07-27). A 1,733-line candidate at `contracts/drafts/v3.2.4/xtrata-v3.2.4-candidate.clar` adding `mint-single-tx-to`, `mint-single-tx-recursive-to` and `mint-single-tx-with-relationships-to`, so a publisher can pay while the author owns and is recorded as creator. The change is small because `commit-inscription` is a single choke point that already took `creator` separately; every pre-existing caller passes `tx-sender`, reproducing v3.2.3 exactly. Verified by the author as `clarinet check` clean over 51 contracts, existing draft suite 18/0, new sponsored suite 11/0.

`6082465d` is the more interesting commit and produces a finding of its own. It re-checks the migration plan against mainnet rather than the repo and both open questions dissolve, because **`contracts/live/` holds source for contracts that were never deployed.** `xtrata-drops-v1.2` and `xtrata-v3-2-3-gateway` are both in `contracts/live/` and neither is on chain. The plan had been written against them. The generalisable lesson the commit itself draws — "confirm what is actually deployed before planning any call against it" — is exactly right, and the directory name is the trap. A directory called `live/` containing undeployed source will mislead the next reader the same way. Flagged for pass 3.

The candidate is registered nowhere in `contracts/clarinet/Clarinet.toml`, so `npm run contracts:verify` in the pre-merge gate does not see it. For a draft that is arguably correct; it does mean the 11/0 suite runs only when invoked by hand.

**Living Synth** (`c38c49e1`, `68abefbb`, `4e6596b0`, 2026-07-23). A gated deployment console: `contracts/live/proof-of-free-living-synth-v1.clar` (383 lines, then reworked twice), `src/lib/deploy/living-synth.ts`, `src/deploy-console.ts` (+693 then +83 then +217), `web/deploy-console.html`. Complete across contract, service, UI, docs and tests. Per `6082465d`, **neither the Living Synth contract nor its gateway is deployed** — so this is a complete, gated, undeployed feature. Not a defect; worth knowing before pass 4 reads `deploy-console.ts` as live surface.

**Contract Studio** (`307f1b78`, 2026-07-23). A leaderboard prototype: `xtrata-studio-leaderboard-v1.clar`, a mock core, `Clarinet.toml` and simnet-plan entries, clarinet tests, a React page, `public/_redirects`, and two phase docs. Explicitly labelled a prototype and correctly registered in Clarinet, unlike the v3.2.4 draft.

**Branch presence.** All on **both `main` and `main-staging`**.

---

### 3.12 Theme L — telemetry and the debug console

`48ce6bf4`, `34ffe4ae` (2026-07-22), `896414f5` (2026-07-24), `a24fffe5` (2026-07-28).

`48ce6bf4` is the largest single commit in the window's earlier half: 31 files, +3,083/−456. Privacy-safe journey telemetry across a new `src/lib/telemetry/` (8 modules), a `functions/log.ts` ingest endpoint, `functions/debug.ts` and `functions/debug/data.ts` viewers, a D1 migration (`functions/migrations/009_telemetry.sql`), `vite.config.ts` and `wrangler.toml` changes, and a 714-line plan. Complete across every layer including the database. `a24fffe5` then fixes the `/debug` page dying on a newline "that was never meant to survive". Access is gated by `DEBUG_VIEW_KEY`, a dashboard secret per pass 1 §1.3.

Nothing here reads as unfinished. Recorded for completeness and because it is the only in-window change that touches the D1 schema — relevant to pass 1 §1.3's note that **preview builds share production D1 and R2**.

**Branch presence.** On **both `main` and `main-staging`**.

---

### 3.13 Theme M — the Proof of Creation results page, and a new direct-to-`main` pattern

Five commits across two branches, 2026-08-01. `fb774eba`, `1ba94532`, `f91ea838` on `main-staging`; `83adb003`, `a055ca17` on `main`.

**What happened.** `fb774eba` adds `xtrata-2.0/proofzero/results/index.html` (666 lines) naming five 60-STX award winners. `83adb003` then cherry-picks **only that file** across to `main` — "Takes only `xtrata-2.0/proofzero/results/index.html` across from main-staging (`fb774eba`) … Nothing else from that branch comes with it." `1ba94532` deletes it from `main-staging` with the stated reason: "Keeping a second copy here would mean two versions of a page that names five winners, and the next staging merge would try to reconcile them." Then `f91ea838` re-adds it to `main-staging` with a link fix — all 19 links moved from `/collection/<id>` to `/inscription/<id>` — and `a055ca17` carries that fix to `main`.

**This is well-reasoned and well-documented**, and it is the correct way to publish one file from a branch carrying 37 unmerged commits. Two observations:

1. **The stated policy is not what the tree now holds.** `1ba94532` argued the page should live only on `main`. `f91ea838` re-added it "only to carry the fix through to `main`", and it stayed. Both branches now carry the file, and the blobs are **identical** (`ea192f0155b7bb49391a6ce32e963fba1a8b1eea` on both), so there is no divergence and no merge conflict — but the second copy the removal commit warned about does exist. Low severity, one-line cleanup or one-line policy update.
2. **Pass 1 §7.2's "there is no hotfix-on-`main` pattern in this repository" is now out of date.** `main` carries two non-merge commits of its own, both from 2026-08-01, and `git diff 2216dae8 main -- xtrata-2.0/` is no longer empty — it is exactly this file, +666. The divergence counts are now `37 8`, not `25 6`.

**Content note, not a code finding.** `fb774eba`'s message records that several award-winning entries contain imagined interfaces — "Seal into the chain", "Preserve", "Carve" are CSS class toggles calling no wallet, contract or network — and that two display invented chain data (2902 shows a hardcoded txid on a "Certificate of Permanence"; 2826 draws block heights from 872,106 and labels 872,104 as genesis). The page was rewritten to say so. This is the same verification discipline the audit's own memory notes flag for inscribed HTML, applied correctly.

---

### 3.14 Cross-cutting observations

**Where the fast iteration actually shows.** Not in duplicated code — the theme-G and theme-B commits *remove* duplication deliberately, and theme A's `pipeline-core.mjs` opens with a paragraph refusing to reimplement minting. It shows in three other places:

1. **Reactive `.gitignore`.** Four separate journal patterns added one at a time, each after the corresponding runner shipped, the last (`ee095f00`) only after a real run left an untracked file. Near-miss noted in the commit itself.
2. **Layout iterated on production-shaped assumptions.** Theme C took four commits to settle one reservation, and the fourth had to undo the first three's approach.
3. **Diagnoses shipped before verification.** Theme E carries three wrong root causes in sequence, `04804b01` reverts an unverified push that blanked a live page, and `3026a159` ships a money path with no browser run. In every case the author says so in the commit message, which is the mitigating factor and makes the pattern auditable at all.

**Test discipline is high and rising.** Every substantive commit in the window ships tests in the same commit. Two patterns are better than typical: fault injection with the bug it found in one commit (`289a3aa8`), and stated negative controls (`ba64a1d0`: "restoring the impossible condition fails 3 of the 10 new tests"). Suite size grew from ~1,201 (`76acdcb1`, 07-27) to 1,887 (`31fa7194`, 07-31) plus 503 in the wizard harness (`b5c7443e`).

**Where the rules are enforced by discipline, not by tests.** Two documented invariants in `xtrata-2.0/CLAUDE.md` have no automated guard: the four-place cache-buster (violated once, §3.6) and the one-version registry rule (currently honoured). The three-copy `HTML_Template.js` invariant, by contrast, does have one. The asymmetry is worth closing.

**Documentation moves with the code, with one gap.** `CHANGELOG-2.0.md` was last touched at `b5c7443e` (2026-08-01), so the 2026-08-02 commits — including `ba64a1d0`, the market thumbnail fix — are not in it. `docs/plans/` gained 22 files in the window. Two of them are confusingly named: `WIZARD-ROUND-1-REPORT.md` is the *thread* round 1 (7 inscriptions, 2026-07-30/31, from `52acf1bc`) and `WIZARD-RELEASE-ROUND-1.md` is the *collection* round 1 (35 inscriptions, 2026-08-01, from `be142707`). Distinct documents, near-identical names.

---

### 3.15 Live on `main` and needing a follow-up fix

Four items, ordered by severity. Each is stated once and handed to a later pass.

| # | What | Where | Status |
|---|---|---|---|
| 1 | `injectAfterTag` builds the regex `` `<${tagName}[^>]*>` ``, so searching for `head` matches **`<header>`** — `<head` is a prefix of `<header`. A page with a `<header>` and no `<head>` gets `<base>` injected inside the header. Separately, `injectHtmlBaseHref` guards only on falsiness, so the **string** `"null"` passes. The two combine into the exact `<header><base href="null">` that round 1 observed on inscription #2963 | `src/lib/viewer/module-paths.ts:152-153` and `:166`; the `"null"` almost certainly enters via `functions/runtime/content.ts:829` and `:740`, which write `moduleBaseHref` into R2 custom metadata **without** the `?? ''` guard used at `:884`, and `:395` reads it back as a truthy string | **Live and identical on `main` and `main-staging`.** `module-paths.ts` unchanged since `e086e852` (2026-07-02); `content.ts` last touched `c0fa07cc`. Harmless for root-relative pages; breaks any inscription using relative URLs |
| 2 | The market/grid SVG branch is unreachable dead code, so every listing renders `get-svg-data-uri` — a per-contract **constant** — as though it were the artwork | `src/home/main.js:10689` on `main` | **Live on `main` only.** Fixed on `main-staging` at `:11201` (`ba64a1d0`). Merging staging clears it |
| 3 | `resolveFeePostConditions` picks `Equal` for every ordinary user and the safe `LessEqual` only for the royalty recipient — the protection is inverted. Combined with the legacy fee model it produced the "300000 SentEq 11000" aborts that cost a bounty participant ~0.665 STX | `src/screens/MintScreen.tsx:1284-1287` | **Live on both branches.** `76acdcb1` closed the public door by redirecting `/workspace`, and says so explicitly: "This does not fix MintScreen … MintScreen still ships at `/admin`, where it works only because the admin is the fee recipient. That trap is still armed for the next person given admin access" |
| 4 | `DEFAULT_FEE_UNIT_MICROSTX = 100_000` yields ~300,000 µSTX for a one-chunk single-tx mint against a real v3-2-3 protocol fee of **11,000** — a 27× over-estimate. Seven modules import this file, **including `src/home/main.js`**, the live homepage mint path | `src/lib/contract/fees.ts:5`; importers include `src/home/main.js`, `MintScreen.tsx`, `CollectionMintScreen.tsx`, `ContractAdminScreen.tsx`, `V323OwnerConsoleScreen.tsx`, `CollectionMintAdminScreen.tsx`, `PreinscribedCollectionAdminScreen.tsx` | **Live on both branches.** The wizard harness corrected its own copy of this number in `b25d3b37`; the app's did not move. Whether the homepage uses it for post-conditions or only for display is the question, and it decides whether this is cosmetic or a repeat of #3 |

---

### Leads for passes 3 and 4

Ordered by expected value. Each names the file and the hypothesis, not the answer.

1. **`src/lib/contract/fees.ts:5` × `src/home/main.js`.** Hypothesis: the 27× fee over-estimate that burned a real user through `MintScreen` also reaches the *homepage* mint path, which is the one path `76acdcb1` redirected users **to**. Trace whether `main.js` feeds `feeEstimate.totalMicroStx` into a post-condition amount or only into displayed copy. If the former, item 4 above is item 3 again on the surface everyone uses. **Highest-value single question in this pass.**
2. **`src/screens/MintScreen.tsx:1284-1287`.** The inverted `Equal`/`LessEqual` condition, live at `/admin`, acknowledged and unfixed. One-line fix; confirm nothing else depends on the inversion, and check whether `CollectionMintScreen.tsx` and the other five `fees.ts` importers share the shape.
3. **`src/lib/viewer/module-paths.ts:152-153, 166` and `functions/runtime/content.ts:740, 829, 395`.** Confirm the `"null"` provenance chain — `buildRuntimeModuleBaseHref` returns `null` → unguarded write to R2 custom metadata → read back as truthy `"null"` → injected. Note the asymmetry with `:884`, which *does* guard. Then fix the `<head`/`<header>` prefix match; a `` `<${tagName}(?=[\s>])` `` assertion covers it. Check `TokenCardMedia.tsx:462` and `TokenContentPreview.tsx:1169`, which call the same helper.
4. **`src/home/main.js:10689` on `main`.** Verify the dead-branch fix in `ba64a1d0` is the whole of it, and sweep the remaining eight `kind === 'image' || kind === 'svg'` sites for a tenth divergence. Consider whether the repeated inline predicate should be one exported helper — its repetition is what hid this for months.
5. **`src/lib/market/sponsored-buy.ts` × `packages/xtrata-sdk/src/sponsor.ts:91`.** Two independent `fallbackToSelfPaid` taxonomies for one protocol. The SDK omits `ATTESTOR_DISABLED`, which the app's own test at `src/lib/market/__tests__/sponsor-client.test.ts:237` asserts is non-fallback. Establish which is authoritative before the sponsored path is exercised for real; a wrong `true` here means paying a second miner fee on a purchase that may still confirm.
6. **`liveHtmlFrameManager` in `src/home/main.js`.** `04804b01` reverted away from it without identifying which of two causes blanked the Claim page. The market grid still uses it, and the reverted analysis says the market grid is unaffected only because it registers during its own render. Determine whether that is a property or a coincidence.
7. **`contracts/live/`.** Contains source for contracts that are **not deployed** (`xtrata-drops-v1.2`, `xtrata-v3-2-3-gateway`, `proof-of-free-living-synth-v1`), which already caused one migration plan to be written against the wrong target (`6082465d`). Enumerate the directory against mainnet and propose a naming or manifest fix. Also: `contracts/drafts/v3.2.4/` is absent from `Clarinet.toml`, so its 11/0 suite is outside `npm run contracts:verify`.
8. **`scripts/wizard/market-run-core.mjs:630` vs `inscribe.mjs:369` vs `provision-core.mjs:660`.** Three `readChainTip`/`fetchChainTip` implementations with two different failure contracts (throw vs null). Low severity, trivially collapsible, and the kind of thing that diverges next.
9. **`scripts/wizard/collection-run-core.mjs:1148` and `:1371`.** Round-1 defect 3, still open: `members.length` and `plan.parentIds.length` disagree by one and print on consecutive lines.
10. **Guard the two ungated invariants.** A test asserting `AGENT_BUILD` equals the `?v=` in all three wizard HTML files (violated once at `1c7d27f6`), and a test asserting `src/data/drops-registry.json` holds one entry per network. Both patterned on the existing `player-template-mobile.test.ts:149-151` parity guard, which is the model that works.

---

## 4. Top findings

**Pass 3 of 4 — transaction flow and key handling.** Audit date 2026-08-02, HEAD `c33bb100` on `main-staging`. Read-only: nothing outside this file was created, modified or deleted, and no worktree was created (branch comparison used `git diff --name-only main main-staging`, which does not touch the working tree).

**Branch parity, established once.** Every file cited below is byte-identical on `main` and `main-staging`: `git diff --name-only main main-staging -- src/agent-one/ xtrata-agent-one/wizard/ src/lib/market/sponsor-client.ts packages/xtrata-sdk/src/sponsor.ts contracts/live/xtrata-v3.2.3.clar` returns empty. **All four findings are live on both branches.** Per §3.0, `staging` is four months behind and structurally carries none of this.

**One caveat on the contract evidence.** Findings 1 and 2 cite `contracts/live/xtrata-v3.2.3.clar` as the source for the deployed `xtrata-v3-2-3` (`src/agent-one/agent-core.ts:30-32`). §3.11 established that `contracts/live/` also holds source for contracts that were never deployed, so this is repo source used as a proxy for deployed bytecode. It is the right contract name and the constants match, but the two contract asserts below are worth confirming against the chain before acting on the severity split in finding 2.

### The answer to the question the brief called most important

**The self-custody claims hold.** Verified, high confidence:

- The handoff — the only code path that sends a deposit key off the machine — is genuinely dormant. `HANDOFF_ENDPOINT` is `cfg.handoffEndpoint || ''` (`agent-core.ts:2292`), `handoffJob` throws on an empty endpoint before touching the job (`:2296`), the UI hides the button on `handoffAvailable()` (`suno.html:794-799`), and **no HTML in the subtree sets `handoffEndpoint`** — the `XAO_CONFIG` defaults at `wizard/index.html:796`, `suno.html:232` and `manifests.html:214` set only `hiro`, `agentFeeAddress`, `windowMs` and `mock`. `agent-core.ts:2276-2291` documents the switch-off and its reason.
- Export strips keys (`agent-core.ts:2203-2213`), locked by `src/agent-one/__tests__/job-export.test.ts:39-50`.
- **No key material reaches logs, URLs, analytics or error reporting.** `xaoLog` writes messages, never the job object (`agent-core.ts:555-559`); `publicJob` destructures `ephemeralMnemonic` out before anything reaches the UI (`:562`); the only URL-borne job data is the id (`unfinished.ts:99`); `functions/log.ts:10` states the telemetry contract and the telemetry modules contain no key/seed field.
- `src/lib/wallet/passkey/**` touches no browser storage at all (grep for `localStorage|sessionStorage|indexedDB` across the directory returns nothing), consistent with §3.10's finding that it is an isolated spike.

The qualification is finding 1: *"only this browser can spend that wallet"* is true, but *"only one runner at a time is spending from it"* is not enforced — and `agent-core.ts:2209` shows the design already treats that as the harm to prevent.

---

### F1 — Nothing prevents two same-origin contexts running the same job and the same deposit wallet at once

| | |
|---|---|
| Priority | **P1** |
| Confidence | High on the mechanism; medium on how often it fires |
| Status | **Verified** (code-level; not reproduced live) |
| Branches | `main` and `main-staging`, identical |
| Effort | **M** |

**Where.** `src/agent-one/agent-core.ts:1865` (`const PROCESSING = new Set<string>()`), `:1953-1956`, `:2000-2022`, `:1814-1858`, `:1882-1883`, `:2363`; `src/agent-one/unfinished.ts:12-22`.

**SHA.** The structure is long-standing, not a recent regression — `PROCESSING` arrives with `e086e852` ("xtrata 2.0 created as optimised version"). What is recent is the exposure: `56985d06` (2026-07-25) added the `target="_blank"` links to `/wizard/` that open the second context, in the commit titled "Wizard agent: survive background tabs, clear Suno resume path".

**Current behaviour.** The only mutual exclusion on job execution is `PROCESSING`, an in-memory `Set` in the agent bundle's module scope. Job state lives in `localStorage` under the `xao-job-` prefix (`unfinished.ts:9-22`) and file bytes in IndexedDB (`agent-core.ts:496-551`) — both **per-origin, shared by every tab and iframe**. Every context that loads `agent-one.js` starts its own `setInterval(watchTick, 4000)` (`:2363`) and its own reaper, and `listJobsRaw()` filters on the key prefix only, with no origin, page or owner field. All three wizard pages create `fastTrack: true` jobs (`wizard/index.html:1483`, `:1729`; `suno.html:624`, `:1163`; `manifests.html:457`), and `watchTick` auto-runs any `fastTrack` job it finds (`:2020-2022`), so any page will pick up any other page's job.

**Why the status gate does not close it.** `watchTick` skips jobs outside `['AWAITING_DEPOSIT','FUNDED','EXPIRED','AWAITING_PARENT']` (`:2000`), but the transition into `INSCRIBING` is not atomic with the decision to run. `watchTick` awaits `statusJob` (network, `:2003`) and `restoreAll()` (IndexedDB, `:2013`); `autoRun` then awaits `detectFunder` — a Hiro `/extended/v1/address/…/transactions?limit=50` fetch (`:1815`, `:765-775`) — and, when parents are declared, `parentsStatus` (`:1827`), and only writes `job.status = 'INSCRIBING'` at **`:1858`**. That window is one to several throttle-prone round trips wide. Two further states are resumable *by design* and held for a long time: `AWAITING_PARENT` for up to `PARENT_WINDOW_MS` (15 min, `:1850`) and `FUNDED` between transient retries for `15000 × retryCount` (`:1930-1935`, `:1990`). Finally `visibilitychange` and `focus` fire `watchTick()` immediately (`:1882-1883`), so switching to the second context triggers the pickup at once rather than on a tick boundary.

**How a user gets two contexts.** The product supplies them. `suno.html:226` offers the main wizard with `target="_blank"`; `suno.html:885`, `:925` and `:927` offer `<a href="/wizard/" target="_blank">open wizard History</a>` **exactly when a job is `NEEDS_RECOVERY` or still open** — the moment the job in `localStorage` is live. Separately, `src/home/main.js:14290-14296` mounts `/wizard/?embedded=1` in a same-origin iframe, and `embedded` only toggles CSS (`wizard/index.html:442-458`) — the iframe runs the full watcher.

**Why it matters.** Two runners on one ephemeral wallet produce, depending on file size (`SINGLE_MAX = 32` chunks × 16 KiB, `:33`):
- **≤ 512 KiB (`mintSingle`):** the sole duplicate-mint guard is `const pre = await getIdByHash(h); if (pre) return pre;` (`:406-408`) — a read of *confirmed* state. The contract does not back it up: `contracts/live/xtrata-v3.2.3.clar:5-9` states "duplicate content can mint new tokens … begin/seal/mint/migration never block … only because the hash already exists". Both contexts read "not inscribed", both broadcast at nonces N and N+1, and the deposit is sized for one mint. Either a second token is minted and paid for, or the second aborts on funds and burns its miner fee (~0.5 STX at the 1 µSTX/byte floor for a 512 KiB transaction).
- **> 512 KiB (`stagedInscribe`):** both read the same `current-index` (`:420`), both send the same `chunks.slice(idx, idx+BATCH)` (`:436`, `:458`). `add-chunk-batch` asserts only `(<= (+ start-idx batch-len) total)` (contract `:1068`), so for `total ≥ 2 × BATCH` the duplicate **passes** and folds the same chunks in at the wrong index. The divergence surfaces only at seal, on `(asserts! (is-eq final-hash expected-hash) ERR-HASH-MISMATCH)` (contract `:1152`) — after every upload fee has been spent, on an upload that can now never seal. For `33 ≤ total < 64` the duplicate aborts on the assert, burning one batch fee.

Two lesser symptoms share the root cause: concurrent recovery/refund sweeps colliding on nonces (the jam class `63535bc6` and `de76470d` were written to cure), and `creditClosedTime()` double-crediting — it reads `HEARTBEAT_KEY` then writes it non-atomically (`:2342-2343`), so two contexts restored together each shift every unfinished job's clocks by the same gap, extending the stall reaper and the parent-escrow refund window by an extra multiple of the closed time.

**Evidence that this is the project's own threat model.** `agent-core.ts:2207-2211`, justifying why export strips keys: *"copying one to a second origin makes that false, and would let two tabs race each other's recovery on the same funds."* The harm is named exactly; it is guarded **across** origins and unguarded **within** one.

**Recommended correction (structural).** A single-runner lease, not per-call patches. `src/lib/utils/tab-guard.ts` already implements one — a `localStorage` lock at `xtrata.tab.active` with a 2 s heartbeat and a 6 s staleness cut (`:5-7`, `:78`), used by `App.tsx`, `PublicApp.tsx` and `SimplePublicHome.tsx` to stop multiple tabs doing heavy reads. The agent, where the stake is money rather than API quota, does not use it. Either lift that primitive into the agent bundle keyed **per job id**, or use `navigator.locks.request(\`xao-job-${id}\`)` around the body of `background()` and take the lock *before* `watchTick`'s first `await`. Pair it with F2's mempool pre-check, which covers the residual case where two contexts acquire and release around each other.

**Regression test.** In `src/agent-one/__tests__/`, drive two agent instances against one shared `localStorage`/IndexedDB double and the existing `fake-chain.ts` harness: seed one `FUNDED` `fastTrack` job, run both watchers, and assert the fake chain received **exactly one** `mint-single-tx` (and, for a 64-chunk fixture, exactly one `add-chunk-batch` per index). The harness at `src/agent-one/__tests__/support/fake-chain.ts:327` already builds the `window.XAO_CONFIG` shape needed.

---

### F2 — Resume decisions read only confirmed chain state, so an in-flight transaction is invisible and gets re-sent

| | |
|---|---|
| Priority | **P1** |
| Confidence | High on the mechanism; medium on frequency |
| Status | **Verified** (code-level; not reproduced live) |
| Branches | `main` and `main-staging`, identical |
| Effort | **S** |

**Where.** `src/agent-one/agent-core.ts:294-351` (`confirmOrEscalate`), `:1896`, `:1930-1935`, `:412-459` (`stagedInscribe`), `:406-408` (`mintSingle`), `:927-940` (`pendingQueue`).

**SHA.** `4b96b7cc` (2026-07-26) introduced `confirmOrEscalate`; `63535bc6` (2026-07-27) last touched it.

**Current behaviour.** This is F1's corruption reached **without a second context**. `confirmOrEscalate` polls for a bounded budget — 210 iterations at 2 s then 6 s (`:301`, `:348`), roughly 18 minutes — and then throws `not confirmed: …` (`:351`). `FATAL_ERR` (`:1896`) does not match that string, so `background()` classifies it as transient, sets the job back to `FUNDED`/`INSCRIBED` and schedules a resume after `15 s × retryCount` (`:1930-1935`). The resume re-enters `stagedInscribe`, which re-derives its position from `get-upload-state` — **confirmed state only** (`:420`) — and re-sends the same `chunks.slice(idx, idx+BATCH)` at the next nonce (`:436`, `:458`). Nothing anywhere on this path consults the mempool. If the original transaction later confirms, both land, and the outcome is the `ERR-HASH-MISMATCH` dead upload described in F1. `mintSingle`'s `getIdByHash` pre-check (`:406-408`) has the identical blind spot.

**Why the RBF escalation does not cover it.** `confirmOrEscalate` bumps the fee 2× up to `RBF_MAX = 3` (`:272-273`, `:322-337`), which usually gets the transaction mined inside the budget — **except** when the wallet is already at its affordable ceiling, where the code explicitly logs "cannot escalate, waiting" and rides out the clock (`:341-345`). That is the under-funded job, which is also the job most likely to be slow. The file's own comments record transactions pending far longer than the poll budget: "a chunk batch pending seven minutes at the floor" (`:283-284`) and "waiting forty hours, holding 9.7 STX and an inscription hostage" (`:353-357`).

**Why it matters.** Same funds outcome as F1, on a single tab, with no user mis-step required. It is also the one defect class this repo has already solved *elsewhere*: `scripts/wizard/run-thread-core.mjs:705-775` (`classifyIntentNonce`, from `14eca936`) checks the mempool **first** — "a mint in the mempool has not landed *yet*, which is not the same as never, and must never be mistaken for proof of absence" — precisely so a retry cannot double-mint. `docs/plans/WIZARD-ROUND-1-REPORT.md:60` calls getting this backwards "the one way to double-mint". The Node pipeline got that lesson; the browser agent, which handles real users' deposits, did not.

**Recommended correction.** Before any re-send, require the deposit wallet to have nothing in flight. **The primitive is already in the file**: `pendingQueue(addr)` reads `/extended/v1/address/{addr}/mempool` and returns nonce/fee/function-name per pending transaction (`:927-940`), and is currently used only by `stuckStatus` (`:2155-2160`). Gate the resume in `stagedInscribe`/`mintSingle` on it — a pending `add-chunk-batch` or `mint-single-tx` from this wallet means wait, not re-send. This is the same read that F1's lease cannot make race-free on its own, so the two corrections are complementary rather than alternative. Keep the existing "a failed read is not an empty answer" discipline: `pendingQueue` already throws rather than returning `[]` on a bad response (`:929-931`), so treat a throw as "cannot resume yet".

**Regression test.** Extend `fake-chain.ts` to hold a broadcast transaction in a pending state indefinitely, force `confirmOrEscalate` past its budget, let the resume run, then confirm the held transaction. Assert the chain saw **one** `add-chunk-batch` per index and that the seal succeeds — the current code produces two at index 0 and an `ERR-HASH-MISMATCH` seal.

---

### F3 — Every abandoned, never-funded job leaves a BIP39 mnemonic in `localStorage` permanently, and the ordinary delete path refuses to remove it

| | |
|---|---|
| Priority | **P3** |
| Confidence | High on the mechanism; the wallets are empty by construction, so the risk is genuinely small |
| Status | **Verified** |
| Branches | `main` and `main-staging`, identical |
| Effort | **S** |

**Where.** `src/agent-one/agent-core.ts:1795-1802`, `:2102`, `:2140-2151`; `src/agent-one/unfinished.ts:45-46`, `:79`; copy at `xtrata-agent-one/wizard/suno.html:86`.

**Current behaviour.** A job whose deposit window closes without payment is parked `EXPIRED` with `keepKey`, `keepKeyGrace` and the key retained — deliberately, so a late payment cannot land at a keyless address (`:1799-1802`). `graceKeyOnly` then filters those jobs out of the reminder list (`unfinished.ts:45-46`, `:79`), so they are invisible in the UI. Meanwhile `deleteJob` **refuses to remove any job holding a key** (`:2102`), and the only path that does remove one, `discardJob`, first requires two successful network reads to prove the wallet is empty and holds no inscription (`:2140-2151`). Net effect: one 24-word mnemonic accumulates per abandoned attempt, hidden, with no expiry and no route out through the normal delete button.

**Why it matters.** Modest, and worth stating at its real size: these wallets never received a penny, which is exactly why the grace flag was set. The two costs are unbounded accumulation of key material on shared or public browsers, and a copy mismatch — `suno.html:86` promises the deposit wallet "is emptied and its key destroyed the moment your inscription and change are back with you", which is accurate for the funded path but silently untrue for the abandoned one. (The other retention cases — a failed balance read, or an NFT still held — are correct and safe: they keep the key rather than strand value, and surface a `keepKeyReason`.)

**Recommended correction.** Give the grace key a lifetime. The deposit window is `WINDOW_MS × 12` for `AWAITING_DEPOSIT` (`:2036`); once a multiple of that has passed with the balance still zero, delete the mnemonic and let `deleteJob` collect the record. Alternatively let `deleteJob` accept a `keepKeyGrace` job when a balance read confirms zero, which reuses the `discardJob` safety check already written.

**Regression test.** Create a job, expire it unfunded, advance the clock past the grace lifetime, tick the reaper, and assert `localStorage.getItem('xao-job-<id>')` either no longer parses to an object carrying `ephemeralMnemonic` or is gone entirely.

---

### F4 — The published SDK and the app disagree on which sponsor failures allow a self-paid retry

| | |
|---|---|
| Priority | **P3** |
| Confidence | High that the divergence exists; **low** that it can currently cause a loss |
| Status | **Verified** as a divergence; the harm is a **Hypothesis** |
| Branches | `main` and `main-staging`, identical |
| Effort | **S** |

**Where.** `packages/xtrata-sdk/src/sponsor.ts:91` versus `src/lib/market/sponsor-client.ts:101-111`. This is lead 5 from §3, resolved.

**Current behaviour.** The app treats nine codes as non-fallback; the SDK treats three. The SDK therefore answers `fallbackToSelfPaid: true` for `BUDGET_TOO_SMALL`, `BNS_REQUIRED`, `BNS_NOT_OWNED`, `CAMPAIGN_INACTIVE`, `ATTESTATION_EXPIRED`, `ATTESTOR_DISABLED` and `ATTESTOR_KEY_MISMATCH`, where the app answers `false`. `@xtrata/sdk` is a published MIT package (`packages/xtrata-sdk/package.json`, v0.2.0) whose description advertises a "sponsored-transaction client", so third-party integrators get the looser taxonomy.

**Why the harm is scoped smaller than the lead assumed.** All six BNS/campaign/attestor codes are raised only on the drops and campaign-claim routes of `functions/sponsor/[[path]].ts` (`:1123`, `:1128`, `:1140`, `:1331`, `:1345`, `:1352`, `:1368`, `:1416`), and `contracts/live/xtrata-market-sponsored-stx-v1.1.clar` contains **no** BNS, campaign or attestation reference at all. On the market-buy flow the SDK exposes, those codes cannot arise, so today the divergence is dormant. The realistic loss — an integrator told to retry self-paid against a gate the contract will reject, burning a miner fee — needs an SDK consumer reaching the campaign endpoints.

**What would settle it.** Whether `mapRelayerError` in the SDK is reachable from any campaign or drops claim helper it exports, and whether the attestation gate at `functions/sponsor/[[path]].ts:1352` ("campaign attestor is not configured **on-chain**") is contract-enforced or relayer policy. If contract-enforced, the app's `false` is authoritative and the SDK is wrong; if relayer policy, the SDK's `true` is right and the app is over-restrictive. **That direction is currently undecided in the repo, which is itself the finding.**

**Recommended correction.** One exported taxonomy, imported by both — the SDK is already a workspace package (`tsconfig.json` maps `packages/xtrata-sdk/src`), so `src/lib/market/sponsor-client.ts` can consume it rather than restate it. Whichever list wins, it should be derived from the relayer's own `fail()` sites so a new code cannot be added in `functions/` without forcing a decision here. Note that `src/lib/market/__tests__/sponsor-client.test.ts:237` currently pins the app's answer for `ATTESTOR_DISABLED`; that test encodes an assumption that has not been checked against the contract.

**Regression test.** A shared table test asserting the app and SDK classify every member of `SponsorErrorCode` identically, so the two lists cannot drift again.

---

### Checked and clear

Recorded so a later pass does not re-derive them. **Nonce handling in `send()`** reuses the signed nonce exactly for replacements (`agent-core.ts:264-266`, `:327`), which is correct RBF, and watches every txid broadcast for that nonce rather than only the newest (`:290-292`, `:302`); `safeNonce` logs its fallback instead of failing silently (`:98-115`). **`waitTx` and `confirmOrEscalate`** both distinguish "the API was unreachable" from "the transaction did not confirm" (`:145`, `:350`) — the read-failure discipline CLAUDE.md names, applied correctly. **Recovery after refresh, tab close and sleep** is sound: bytes in IndexedDB with a durable-storage request and a surfaced persist error (`:502-540`), a Worker-based sleep that survives background-tab timer throttling (`:57-63`), and closed-tab time credited back to job clocks (`:2324-2360`). **Mainnet/testnet selection** cannot be mis-set in practice: network, address version and `health()` are hardcoded mainnet (`:52`, `:72`, `:2045`) and `XAO_CONFIG.hiro` defaults to `/hiro/mainnet` in all three pages. **`scripts/wizard/make-wizards.mjs`** generates fresh entropy, prints to stdout only and never writes a real key to disk (`:1-24`, `:79`). **`classifyIntentNonce`** (`scripts/wizard/run-thread-core.mjs:720-775`) checks the mempool before treating a low `last_executed_tx_nonce` as proof of absence, and asks the content hash first throughout — the asymmetry `14eca936` claims is the one implemented.

---

## 4b. Value correctness and leakage

**Pass 4 of 4 — value correctness, leakage, and report completion.** Audit date 2026-08-02, HEAD `c33bb100` on `main-staging`. Read-only: the only path written was this file. No worktree was created — branch comparison used `git diff --name-only main main-staging -- <paths>`, which does not touch the working tree.

**Branch parity, established once.** `git diff --name-only main main-staging` over every file cited below returns empty: `src/agent-one/agent-core.ts`, `src/lib/contract/fees.ts`, `src/screens/MintScreen.tsx`, `src/screens/CollectionMintScreen.tsx`, `src/lib/mint/post-conditions.ts`, `src/sponsor-ops.ts`, `vite.config.ts`, `src/screens/CampaignConsoleScreen.tsx`, `src/CollectionMintLivePage.tsx`, `src/main.tsx`. **Every finding in this section is live on both branches**, with the single exception noted in V3. Per §3.0, `staging` is four months behind and carries none of it.

### The answer to the question §3 called highest-value

**Lead 1 is answered, and the answer is no.** The homepage mint path does *not* repeat the `MintScreen` post-condition defect. `src/home/main.js:1602-1620` pins `FungibleConditionCode.LessEqual` **unconditionally**, and carries a comment naming precisely the failure the `Equal` version causes: *"Using an exact (Equal) condition adds a 'pays no less' constraint with no benefit to the sender and breaks whenever the real protocol fee differs from the estimate."* Better still, the homepage does not lean on the stale constant at all in the normal case: it quotes the exact fee on chain via `quoteSingleTxFee` / `quoteStagedFee` (`main.js:4808-4832`) and prefers those quotes at every call site (`:5161-5163`, `:5296-5297`, `:5409-5410`).

So §3.15 item 4 is **downgraded** — see V3. The inverted condition remains real, remains live, and is now known to sit in **two** screens rather than one — see V2.

---

### V1 — The wizard fee is charged on the deposit balance, not on the quote, so every overpayment is taxed at 10%

| | |
|---|---|
| Priority | **P2** |
| Confidence | **High** on the mechanism and the arithmetic; medium on how often users overpay |
| Status | **Verified** (code-level; not reproduced live) |
| Branches | `main` and `main-staging`, identical |
| Effort | **S** |

**Where.** `src/agent-one/agent-core.ts:1637-1639` (the charge), `:1461-1468` (what `received` is), `:624-634` (what was quoted), `:1282` and `:1355` (the quote stored as `agentFeeExpectedUstx`), `xtrata-agent-one/wizard/index.html:1690` (the quote shown to the user).

**Current behaviour.** `estimate()` computes the fee as a proper gross-up in bigint — `feeExact = (baseCosts * pct) / (100n - pct)`, deposit rounded up to 0.01 STX, then `agentFeeUstx = (required * pct) / 100n` (`:624-628`). That number is stored on the job as `agentFeeExpectedUstx` and rendered in the wizard's cost panel as "Wizard fee (10%)".

At settlement, `deliver()` ignores it:

```
const received = BigInt(job.depositReceivedUstx || job.requiredUstx);
const agentFee = pct > 0n ? (received * pct) / 100n : 0n;      // :1639
```

`job.depositReceivedUstx` is not the quote. It is the **highest of up to three live balance reads** of the deposit address (`:1461-1468`), taken once at the funding gate. **`agentFeeExpectedUstx` is written at `:1282` and `:1355` and read nowhere in the subtree** — grep across `src/` and `xtrata-agent-one/` returns only those two assignments.

**Why it matters.** Everything else about an overpayment comes back: `sweepStxTo` returns the whole remaining balance to the detected funder (`:1245`, `:1619`). The agent fee is the one part that does not. A user quoted 1.34 STX who sends a round 2 STX is charged 0.2 STX instead of the 0.134 they were shown — a 0.066 STX overcharge on a receipt that still prints "Wizard fee (10%)" as though it matched the quote. The effect scales linearly with the overpayment and has no ceiling.

Two routes make this more than hypothetical. Deposit addresses are **public by design** — `:763-764` says so, and `detectFunder` exists specifically because "a 1 µSTX dust tx must never claim fast-track delivery + refunds". Any inbound STX from any sender inflates `received`. And a user who funds a second attempt to the same address, or rounds up from a wallet that only offers whole-STX entry, hits it directly.

**Why it is P2 and not P1.** No funds are lost or stranded, nothing aborts, and the user still receives their inscription and their change. It is an overcharge against a disclosed quote, bounded by the size of the overpayment.

**Recommended correction.** Cap the charge at what was quoted, which is already on the job:

```
const quoted = BigInt(job.agentFeeExpectedUstx || '0');
const pctFee = pct > 0n ? (received * pct) / 100n : 0n;
const agentFee = quoted > 0n && pctFee > quoted ? quoted : pctFee;
```

This preserves self-custody exactly — the fee is still paid out of the ephemeral wallet the user funded, by a key only their browser holds — and changes no external interface. Keep the `min`, not a straight substitution: when a job is resumed and `depositReceivedUstx` is genuinely below the quote, charging the smaller number is the correct behaviour and is what the current code already does.

**Regression test.** In `src/agent-one/__tests__/`, using `support/fake-chain.ts`: create a job, fund the deposit address with **twice** `requiredUstx`, run to delivery, and assert the STX transfer to `agentFeeAddress` equals `job.agentFeeExpectedUstx` — not 10% of the deposit. Today that assertion fails at exactly 2×.

---

### V2 — `CollectionMintScreen` carries a second copy of the inverted fee post-condition

| | |
|---|---|
| Priority | **P2** |
| Confidence | **High** — byte-for-byte the same construct as `MintScreen` |
| Status | **Verified** |
| Branches | `main` and `main-staging`, identical |
| Effort | **S** |

**Where.** `src/screens/CollectionMintScreen.tsx:673-686`, used at `:1397` and `:1612`. This resolves the second half of §3 lead 2 ("check whether `CollectionMintScreen.tsx` and the other five `fees.ts` importers share the shape").

**Current behaviour.** Identical to `src/screens/MintScreen.tsx:1277-1290`, including the inversion:

```
const conditionCode =
  !royaltyRecipient || royaltyRecipient === sender
    ? FungibleConditionCode.LessEqual
    : FungibleConditionCode.Equal;
```

The safe `LessEqual` is selected when there is no royalty recipient **or the recipient is the sender** — i.e. for the admin. Every ordinary user, for whom `royaltyRecipient` is set and differs, gets `Equal`. That is the condition that produced the "300000 SentEq 11000" aborts recorded in `src/main.tsx:76-82`.

**Reachability, stated precisely.** Both screens are reached only through `App`, and `App` is mounted only behind `AdminGate` at `ADMIN_PATH` (`src/main.tsx:106-110`; `src/App.tsx:66`, `:76-77`, `:2078`, `:2085`). The public collection page at `/collection/<id>` is `CollectionMintLivePage`, a **different** component that uses the correct builders (below). So this widens the *fix surface* from one screen to two; it does not widen the blast radius beyond the admin route that `76acdcb1` already described as "still armed for the next person given admin access".

**Why it matters.** The remaining five `fees.ts` importers were checked and are clear: `ContractAdminScreen.tsx:22`, `CollectionMintAdminScreen.tsx:22`, `V323OwnerConsoleScreen.tsx:15` and `PreinscribedCollectionAdminScreen.tsx:19` import only `formatMicroStx` and `MICROSTX_PER_STX` — display helpers, no post-conditions. So the defect is exactly two screens, and both can be fixed by deletion rather than by editing the condition.

**Recommended correction.** Delete both local `resolveFeePostConditions` helpers and call `src/lib/mint/post-conditions.ts`, which already exists, is uniformly `LessEqual`, is bigint throughout, and returns `null` rather than a wrong cap when an input is missing (`:129-143`, `:150-168`, `:176-197`). `CollectionMintLivePage.tsx:1542-1686` is the worked example of a screen consuming it correctly.

**Regression test.** A repository-level table test asserting that no module under `src/screens/` or `src/home/` constructs a `FungibleConditionCode.Equal` STX post-condition. That is a single grep-shaped assertion and it locks both screens plus anything added later.

---

### V3 — Correction to §3.15 item 4: the fee-unit over-estimate is a display and cap defect, not an abort or an overpay

| | |
|---|---|
| Priority | **P3** (downgraded from the P-implied severity in §3.15) |
| Confidence | **High** |
| Status | **Verified** |
| Branches | `main` and `main-staging`, identical |
| Effort | **S** |

**Where.** `src/lib/contract/fees.ts:5` (`DEFAULT_FEE_UNIT_MICROSTX = 100_000`); consumed on the homepage via `src/home/main.js:1478-1491`.

**What §3.15 item 4 asked, and the answer.** It asked whether `main.js` feeds `feeEstimate.totalMicroStx` into a post-condition amount. It does — at `:5181` and `:5252` — but always through `resolveFeePostConditions`, which is `LessEqual`-only (`:1602-1620`). An over-large `LessEqual` cap cannot abort a transaction and cannot cause an overpay; it only fails to constrain as tightly as it could. The `Equal` failure mode requires the `Equal` construct, and the homepage does not have it.

**Second mitigation.** The constant is usually not reached at all. `getFeeUnitNumber()` (`:1478-1485`) reads the live `feeUnitMicroStx` from contract admin status, and separately `:4808-4832` fetches an exact on-chain quote, which is preferred wherever available (`:5161-5163`, `:5296-5297`, `:5409-5410`). `DEFAULT_FEE_UNIT_MICROSTX` applies only when the admin-status read **and** the on-chain quote have both failed.

**What remains real.** The constant is genuinely stale — 100,000 µSTX against a measured v3-2-3 protocol fee of 11,000 (`docs/plans/WIZARD-ROUND-1-REPORT.md`; the wizard harness corrected its own copy in `b25d3b37` and the app's did not move). In the double-read-failure case the user is shown a "Total estimated cost" up to ~27× the truth, which is a plausible reason to abandon a mint. That is the whole of the harm on this surface.

**Recommended correction.** Lower the constant to 11,000 and add a comment tying it to the deployed core, or — better — make the fallback refuse rather than guess, consistent with the `ownerOfChecked` discipline in `xtrata-2.0/CLAUDE.md`: when neither the admin status nor the quote can be read, show "could not price this right now" instead of a number nobody can stand behind.

**Regression test.** Assert that with `adminStatus.feeUnitMicroStx = null` and both quote calls rejecting, the prepared-state panel renders an explicit unavailable state rather than a numeric total.

---

### L1 — The runtime wallet-bridge token is a reusable six-hour capability carried in a URL, and the site sets no `Referrer-Policy`

| | |
|---|---|
| Priority | **P3** |
| Confidence | High that the token is reusable and URL-borne; **the impact is a Hypothesis** and is bounded by the wallet prompt |
| Status | **Verified** as described; harm **not** demonstrated |
| Branches | `main` and `main-staging`, identical |
| Effort | **S** |

**Where.** `src/lib/viewer/runtime-open.ts:7` (`walletBridgeToken` param), `:57-74` (appended to the URL), `:155-190` (mint, store, validate); `src/App.tsx:1151` (validation); `public/runtime/wallet-shim.js:24` (read back out of `location.search`). Referrer policy: `public/_headers` sets none; the only `Referrer-Policy` in the subtree is `functions/debug.ts:284` and `:313`, scoped to that endpoint's own responses.

**Current behaviour.** Two things compound. First, `isRuntimeWalletBridgeTokenValid` (`runtime-open.ts:171-190`) prunes expired tokens but **does not consume a token on successful validation**, so a token is replayable for its whole `RUNTIME_WALLET_BRIDGE_TOKEN_TTL_MS` of six hours (`:9`). Second, it travels as a query-string parameter on `/runtime/?…&walletBridgeToken=<uuid>`, so it lands in browser history and in the `Referer` of same-origin subresource requests made by the page — and `/runtime/` is the page that renders arbitrary third-party inscribed HTML.

**What it actually authorises, stated honestly.** Holding a valid token lets a frame reach the bridge methods in `src/App.tsx`, including `stx_callContract`. But every one of those routes to `walletAdapter`, which opens the user's wallet and requires an explicit confirmation. **A stolen token does not permit silent spending**, and that is why this is P3 rather than higher. What it permits without a prompt is the read side — reading the connected session and network.

**Why it is worth fixing anyway.** The cross-origin case is currently safe only because modern browsers default to `strict-origin-when-cross-origin`, which strips the query string from `Referer` on cross-origin requests. Nothing in this repository asserts that; it is an inherited default protecting a capability token. Making it explicit costs one line.

**Recommended correction.** Two independent one-line changes: add `Referrer-Policy: no-referrer` for `/runtime/*` in `public/_headers`, and delete the token in `isRuntimeWalletBridgeTokenValid` on the first successful validation so it is single-use. The sandboxed-iframe path already re-mints per handshake (`src/App.tsx:255-258`), so single-use does not break it.

**Regression test.** Assert `isRuntimeWalletBridgeTokenValid(storage, t)` returns `true` once and `false` on the immediately following call with the same token.

---

### L2 — An operator's third-party API key is persisted in plaintext `localStorage` with no expiry

| | |
|---|---|
| Priority | **P3** |
| Confidence | **High** on the mechanism; the exposure is bounded to the admin's own browser |
| Status | **Verified** |
| Branches | `main` and `main-staging`, identical |
| Effort | **S** |

**Where.** `src/screens/CampaignConsoleScreen.tsx:232` (`AI_KEY_STORAGE = 'xtrata.campaign.ai.key'`), `:450` (read on mount), `:483` (written on every change), `:647-649` (used).

**Current behaviour.** The campaign console accepts an API key for `https://api.openai.com/v1/responses` (`:240`) and mirrors it into `localStorage` on every keystroke. It is sent as `Authorization: Bearer …` (`:649`) — correct transport, not a URL parameter — but it is persisted unencrypted, has no TTL, survives wallet disconnect and browser restart, and is readable by any script running on the origin.

**Why it matters, and why it is small.** This is the operator's own third-party key, not a shipped Xtrata secret, and the screen is admin-gated (`src/App.tsx:73-74`, `:2073`, behind `AdminGate`). No Xtrata secret is involved and no user funds are at risk. The cost is a long-lived credential sitting in the same origin's storage as everything else, on a machine that may be shared.

**Recommended correction.** Move it to `sessionStorage`, or proxy the call through a Pages Function holding the key as a dashboard secret — the pattern `vite.config.ts:81-82` already uses for `HIRO_API_KEY`, where the key reaches only the server side and the client learns just a boolean.

**Regression test.** Assert that after the console unmounts, `localStorage.getItem('xtrata.campaign.ai.key')` is `null`.

---

### M1 — The sponsor operator console re-implements STX parsing in floating point, next to a correct bigint parser

| | |
|---|---|
| Priority | **P3** |
| Confidence | **High** |
| Status | **Verified** |
| Branches | `main` and `main-staging`, identical |
| Effort | **S** |

**Where.** `src/sponsor-ops.ts:167` and `:226`, against `src/lib/utils/amounts.ts:3-33`.

**Current behaviour.** Both sites convert an operator-entered STX string to µSTX with `BigInt(Math.round(Number(x) * 1_000_000))`. `src/lib/utils/amounts.ts` already exports `parseDecimalAmount(raw, decimals)`, which does the same job entirely in bigint, validates the shape against `/^\d+(\.\d+)?$/`, and **rejects** more fractional digits than the asset has rather than silently rounding.

**Why it matters.** `Math.round` makes the float path exact for realistic magnitudes, so this is not a precision bug in practice — it is a validation and duplication bug. `"20.0000005"` becomes 20,000,001 µSTX silently on the float path; `parseDecimalAmount` returns `null` and the caller can say so. `sponsor-ops.ts` is a real surface, built as its own entry point (`vite.config.ts:112`, `web/sponsor-ops.html`), and the amounts it parses fund the relayer float.

**Recommended correction.** Replace both with `parseDecimalAmount(raw, 6)` and surface `null` as a validation message. This is the same "one implementation of one concept" move that `3026a159` made for sponsored buy.

**Regression test.** Assert `'20.0000005'` is rejected rather than rounded, and that a valid `'20.03'` yields exactly `20_030_000n`.

---

### M2 — Correction to F4: the app/SDK divergence is six codes, not seven

Verified while confirming F4's citations. `src/lib/market/sponsor-client.ts:101-111` lists **nine** non-fallback codes: `LISTING_SOLD`, `DUPLICATE`, `LISTING_BUSY`, `BNS_REQUIRED`, `BNS_NOT_OWNED`, `CAMPAIGN_INACTIVE`, `ATTESTATION_EXPIRED`, `ATTESTOR_DISABLED`, `ATTESTOR_KEY_MISMATCH`. `BUDGET_TOO_SMALL` is **not** among them, so the app answers `fallbackToSelfPaid: true` for it — exactly as `packages/xtrata-sdk/src/sponsor.ts:91` does. F4's prose lists `BUDGET_TOO_SMALL` as a divergence; it is an agreement.

The real divergence is the six BNS/campaign/attestor codes. F4's priority (**P3**), its reasoning about why the harm is dormant, and its recommended correction are all unaffected.

---

### V4 — The app reconstructs a five-variable contract fee from one variable, and `LessEqual` only protects the user while that reconstruction over-estimates

| | |
|---|---|
| Priority | **P1** |
| Confidence | **High** that the model cannot express the contract's fee function; **Hypothesis** on which direction the error runs against the live core today, and the finding names the two calls that settle it |
| Status | **Verified** (model mismatch, code-level); direction unverified |
| Branches | `main` and `main-staging`, identical |
| Effort | **M** |

**Where.** `src/lib/contract/fees.ts:37-45`, `:54-72`; `src/lib/mint/post-conditions.ts:84-93` (`resolveSealSpendCapMicroStx`); `src/CollectionMintLivePage.tsx:1864`, `:1600-1613`, `:3334`, `:3340`, `:3344`; `contracts/live/xtrata-v3.2.3.clar:124-133`, `:429-437`, `:676-680`, `:755-777`, `:1568`, `:1572`, `:1601-1603`. The corrected counter-example: `src/home/main.js:4811`, `:4822`, `:5160-5163` (`main`: `:4754`, `:4765`).

**Why this is not already covered by V3.** V3's load-bearing argument is *"An over-large `LessEqual` cap cannot abort a transaction and cannot cause an overpay"*. That is true and correctly reasoned. What neither V3 nor §9 asks is whether the cap can be **under**-large. On the public collection mint path it can, and there `LessEqual` stops protecting and starts aborting.

**Current behaviour.** v3.2.3 charges from five independent mutable variables (`:129-133`) and computes (`:429-437`, restated in the contract's own comment at `:676-680`):

- `begin` = `begin-fee-unit`
- `seal` = `seal-fee-unit` + `upload-chunk-fee-unit`·min(chunks, 32) + `upload-batch-fee-unit`·ceil(max(chunks−32, 0)/32)
- `single-tx` = `single-tx-fee-unit` + `upload-chunk-fee-unit`·chunks

The app reads **one** of the five. `get-fee-unit` returns `upload-batch-fee-unit` and nothing else:

```clarity
(define-read-only (get-fee-unit)
  (ok (var-get upload-batch-fee-unit))          ;; :1601-1603
)
```

From that single number `fees.ts:61-65` reconstructs `beginMicroStx = F` and `sealMicroStx = F · (1 + ceil(chunks/32))`, and `post-conditions.ts:84-93` repeats the same formula in bigint to produce the post-condition cap. **These are not the same function**, and no value of `F` makes them agree in general: the contract's seal is linear in `chunks` with a slope (`upload-chunk-fee-unit`) the app never reads.

They agree closely under one specific administrative action. `set-fee-unit(u)` writes all four flat units to `u` and derives `upload-chunk = max(FEE-MIN, floor(u/32))` with `FEE-MIN = u1` (`:86`, `:755-777`); at that setting `F·(1 + ceil(chunks/32))` sits a few µSTX *above* the contract's seal and every cap holds. They diverge whenever the units are set individually, which the contract also permits (`:698-753`).

**Why it matters.** The public collection mint page reads only `coreClient.getFeeUnit` (`CollectionMintLivePage.tsx:1864`) and feeds it into `buildCollectionSealStxPostConditions` → `resolveSealSpendCapMicroStx` (`:1600-1613`). If the reconstruction lands **below** the contract's actual seal fee, the seal aborts on the post-condition — after the begin fee and every upload batch have already been paid. That is the most expensive failure this codebase can produce: money spent, nothing minted, upload stranded mid-flight. The same number also drives the cost range a collector is shown before minting (`:3334`, `:3340`, `:3344`).

**The direction is decidable in two calls, and this pass could not make them** — network access was unavailable, so this is stated as a Hypothesis rather than guessed at. The repository's own measurement is that a one-chunk `mint-single-tx` costs exactly **11,000 µSTX**, quoted live against v3-2-3 on 2026-08-01 for five different body types (`docs/plans/WIZARD-RELEASE-ROUND-1.md:51`, `:65`; `docs/plans/WIZARD-ROUND-1-REPORT.md:19`, `:30`). That equals `single-tx-fee-unit + upload-chunk-fee-unit`, and **two settings satisfy it**:

| Setting | `upload-chunk` | App cap at 32 chunks | Contract seal at 32 chunks | Outcome |
|---|---:|---:|---:|---|
| uniform `set-fee-unit(u≈10,667)` | 333 | 21,334 | 21,322 | cap holds, by 12 µSTX |
| units set individually, `upload-chunk` left at its deployed `u2000`, flat units 9,000 | 2,000 | 18,000 | **73,000** | **cap is 4× too low — every such seal aborts** |

**Evidence that the fix is already written elsewhere.** The contract exposes `quote-staged-fee` (`:1568`) and `quote-single-tx-fee` (`:1572`); the client exposes them as `quoteStagedFee` / `quoteSingleTxFee` (`src/lib/contract/client.ts:612-634`); and `src/home/main.js:4802-4832` calls both, stores the answers, and post-conditions against them — with a comment stating the intent exactly: *"Quote the exact fees the core will charge so the user is told the real cost and each transaction's post-condition caps at the right amount."* Grep `CollectionMintLivePage.tsx` for `quoteStagedFee`: no match. The homepage learned this lesson; the public collection page did not.

**Recommended correction.** Make the contract the source of the number on every surface, as the homepage already does: have `resolveSealSpendCapMicroStx` and `estimateContractFees` accept a quoted fee rather than reconstruct one, falling back to the five individual getters (`getBeginFeeUnit`, `getUploadChunkFeeUnit`, `getUploadBatchFeeUnit`, `getSealFeeUnit`, `getSingleTxFeeUnit` — all already declared at `src/lib/contract/client.ts:387-391`) only where no quote is available, and refusing to quote where neither is readable (V5). This preserves composability rather than weakening it: `packages/xtrata-sdk/src/mint.ts:99-119` carries a byte-identical copy of the same wrong model and must move with it, or third-party integrators inherit the defect at the moment the SDK becomes worth using.

**Regression test.** A table test in `src/lib/contract/__tests__/fees.test.ts` that computes the contract's own seal formula from all five variables for chunks ∈ {1, 31, 32, 33, 64, 65} across a spread of fee settings — including `upload-chunk-fee-unit` set independently of `upload-batch-fee-unit` — and asserts the app's cap is **≥** the contract's fee in every case. The current model fails that test at `chunks = 32, upload-chunk = 2000, upload-batch = 9000`.

---

### V5 — A fee-unit read that fails is silently replaced with 0.1 STX, which is the bug class CLAUDE.md names

| | |
|---|---|
| Priority | **P2** |
| Confidence | **High** on the mechanism; **Medium** on how often the read actually fails |
| Status | **Verified** |
| Branches | `main` and `main-staging`, identical |
| Effort | **S** |

**Where.** `src/lib/contract/fees.ts:27-35`; `src/home/main.js:1478-1485` and `:4845-4849`; `src/CollectionMintLivePage.tsx:1864`; `packages/xtrata-sdk/src/mint.ts:84-87`.

**Current behaviour.** V3 identifies the stale constant and recommends, as its better option, making the fallback refuse rather than guess. This finding is why that is the *only* acceptable option, and it names a second site V3 does not reach. `normalizeMicroStx` returns `DEFAULT_FEE_UNIT_MICROSTX` for `null`, `undefined`, non-finite and non-positive alike (`fees.ts:27-35`), and every upstream failure path produces exactly those values: `getFeeUnitNumber` returns `null` when `state.adminStatus` is absent (`main.js:1478-1485`), and `fetchAdminStatus` sets `state.adminStatus = null` in its `catch` (`:4845-4849`); `CollectionMintLivePage.tsx:1864` writes `await coreClient.getFeeUnit(senderAddress).catch(() => null)` — a failed read collapsed into a value indistinguishable from a contract that charges nothing.

**Why it matters.** This is verbatim the class `xtrata-2.0/CLAUDE.md` calls *"a recurring bug class worth knowing"* — *"A read that FAILED and a read that returned 'nothing' are not the same answer"* — and which theme F (§3.6) spent fourteen commits eliminating from `src/agent-one/`. It survives untouched in the fee path, on the money surfaces. The substituted value is not neutral: `100_000` against a measured live flat unit near 11,000 is roughly 9×, so a transient Hiro throttle does not merely degrade the estimate, it changes the post-condition cap by an order of magnitude — and under V4 the direction of that change is not knowable in advance. §9 credits Agent-One's read discipline correctly; this is the one value path where it was never applied.

**Recommended correction.** Return a discriminated result from `getFeeSchedule` rather than a number, and have each mint surface disable its action with *"could not read the protocol fee right now"*. Keep `DEFAULT_FEE_UNIT_MICROSTX` as a display placeholder only, never as a post-condition input. `packages/xtrata-sdk/src/mint.ts:84-87` carries the identical fallback and must move with it. The correct shape already exists two files away: `agent-core.ts:1461-1467` counts successful reads separately from the value and throws *"could not read the deposit balance … nothing was spent, retrying"* rather than treating failure as zero.

**Regression test.** Drive `getFeeEstimate` with a rejecting admin-status query and both quote calls rejecting, and assert no post-condition is built and the mint control is disabled. Today it silently builds one at 100,000 µSTX per unit.

---

### L3 — `VITE_HIRO_API_KEY` is simultaneously a documented server-secret name and a Vite-public prefix

| | |
|---|---|
| Priority | **P2** |
| Confidence | **High** that the mechanism is real and reachable, demonstrated from a built artefact; **unknown** whether the deployment currently uses that name, which is a Cloudflare dashboard fact this audit cannot read |
| Status | **Verified** mechanism; **Hypothesis** on current exposure |
| Branches | `main` and `main-staging`, identical |
| Effort | **S** |

**Where.** `.env.example:8`; `functions/lib/hiro-keys.ts:52-58`; `functions/sponsor/[[path]].ts:150-152`; `vite.config.ts:80`. The bare `import.meta.env` references that serialise the whole variable set into the bundle: `src/lib/network/config.ts:15`, `src/lib/bns/config.ts:18`, `:26`, `:58`, `src/lib/utils/logger.ts:76`, `src/screens/AdminDiagnosticsScreen.tsx:80`.

**This qualifies §9's "clean by construction" verdict.** That verdict is correct about `vite.config.ts` — only `Boolean(hiroApiKey)` reaches `define`, and the key itself is used solely in dev-server proxy headers. What it does not account for is that the *server* side independently accepts a `VITE_`-prefixed name for the same secret:

```ts
appendUnique(keys, splitList(env.HIRO_API_KEYS));
appendUnique(keys, splitList(env.HIRO_API_KEY));
appendUnique(keys, splitList(env.VITE_HIRO_API_KEY));   // functions/lib/hiro-keys.ts:58
```

and `.env.example:8` offers `VITE_HIRO_API_KEY=` as a name to fill in, with no warning, three lines below the line recommending `HIRO_API_KEYS` for Pages. Vite exposes every `VITE_`-prefixed variable to the client, and where a module reads `import.meta.env` as a whole object rather than one property, the build inlines an object literal containing all of them.

**Evidence, from the built artefact rather than the documentation.** `dist/assets/*.js` (built 2026-07-31) contains exactly two object-literal keys of that shape — `VITE_STACKS_API_MAINNET:` and `VITE_STACKS_EXPLORER_BASE:` — while containing *property accesses* for eleven `VITE_*` names. The two appearing as literal keys are the two that were defined in that build environment. That is the mechanism demonstrated: what is defined gets inlined, whether or not any code asked for it. `dist/` contains no occurrence of `HIRO_API_KEY`, so the local build carries no key — which is why this is a trap rather than a live leak.

**The concrete path.** Cloudflare Pages presents one "Environment variables" surface per environment, and a variable set there is visible to both the build and the Functions runtime. An operator wiring up `functions/lib/hiro-keys.ts:58` by setting `VITE_HIRO_API_KEY` in the dashboard would, in that same action, bake the key into `index-*.js` for every visitor. Per §1.3 the same variables are configured for Production *and* Preview, so it would ship on the eighteen abandoned `main-staging-*` preview URLs too (§7.6). The loss is a paid API key and the rate-limit budget behind it, not funds — hence P2, not P1.

**Recommended correction.** Delete `.env.example:8` and `functions/lib/hiro-keys.ts:58`, leaving `HIRO_API_KEYS`, `HIRO_API_KEY` and the numbered form. `vite.config.ts:80` already reads the unprefixed name via `loadEnv(mode, cwd, '')`, which loads regardless of prefix, so the dev proxy loses nothing. Then replace the six bare `import.meta.env` reads with named property reads, so a future `VITE_`-prefixed secret cannot be swept in by a module that never asked for it.

**Regression test.** A build-output assertion in the pre-merge gate: grep `dist/assets/*.js` for `/VITE_[A-Z_]*(KEY|SECRET|TOKEN|SALT)/` and fail on a match. Cheap, and it catches the class rather than this one name.

---

### L4 — The wallet-bridge token falls back to `Math.random()` outside a secure context

| | |
|---|---|
| Priority | **P3** |
| Confidence | **High** on the mechanism; **Low** on production reachability, stated below |
| Status | **Verified** (code-level) |
| Branches | `main` and `main-staging`, identical |
| Effort | **S** |

**Where.** `src/lib/viewer/runtime-open.ts:46-53`. Complements L1, which covers the same token's reusability and URL carriage but not how it is generated.

**Current behaviour.** `createRuntimeWalletBridgeToken` uses `crypto.randomUUID()` when available and otherwise returns `` `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}` ``. `crypto.randomUUID` requires a secure context, so on plain `http://` the fallback fires and the token is a timestamp the attacker also knows plus `Math.random()`, which is not a CSPRNG. `src/App.tsx:1124-1128` states that for an opaque-origin sender this token is *the sole gate*.

**Why it matters, bounded honestly.** Production is HTTPS, so the fallback never runs there. What makes it worth fixing anyway is where it *does* run: `xtrata-2.0/CLAUDE.md` instructs wizard verification against `python3 -m http.server 8099`, and §3.10's canary work happens the same way — i.e. the fallback is live exactly in the context where untrusted inscribed HTML is being deliberately rendered and a real wallet is connected. As L1 establishes, a stolen token still cannot spend silently, because every write method routes through the wallet prompt; the read side needs no prompt.

**Recommended correction.** Use `crypto.getRandomValues` over a 16-byte buffer — available in every context `randomUUID` is not — and throw rather than degrade if neither exists. A bridge that cannot be securely gated should not open.

**Regression test.** Stub `crypto.randomUUID` as undefined and assert the token still carries ≥128 bits from `getRandomValues`, or that the call throws. Today it returns a `Math.random()` string.

---

### L5 — The admin gate prints the full admin allowlist to anyone it refuses

| | |
|---|---|
| Priority | **P3** |
| Confidence | **High**; the impact is disclosure, not escalation, and the limit is stated |
| Status | **Verified** |
| Branches | `main` and `main-staging`, identical |
| Effort | **S** |

**Where.** `src/lib/admin/access.ts:15`, `:24`; `src/admin/AdminGate.tsx:109`, `:180-183`.

**Current behaviour.** `ADMIN_ALLOWLIST` is `parseAllowlist(import.meta.env.VITE_ADMIN_ALLOWLIST)`, a build-time constant in the public bundle — which §9 notes and correctly classifies as an allowlist rather than a credential. What §9 does not note is that when the gate refuses a visitor it renders the list:

```tsx
<span className="meta-label">Allowlist</span>
<span className="meta-value">{allowlist.length > 0 ? allowlist.join(', ') : 'None'}</span>
```

**Why it matters, and its limit.** This is **not** a privilege escalation: every admin action is a contract call gated on-chain (`contracts/live/xtrata-v3.2.3.clar:767`), so bypassing the client-side gate yields a console that cannot do anything privileged. Two real costs remain. The complete set of admin wallet addresses is volunteered to any visitor of `/admin`, which is targeting information. And because the gate is client-side only, a bypassed gate puts `MintScreen` in front of a non-admin — the exact surface whose exact-match post-condition (V2) aborts and burns a miner fee for anyone who is not the fee recipient. Fixing V2 removes the second cost entirely.

**Recommended correction.** Do not render the allowlist to unauthorised visitors; the refusal message alone is sufficient. Add a comment marking the gate as a UI convenience, not access control, so nobody later mistakes it for one.

**Regression test.** Render `AdminGate` with a non-allowlisted session and assert the output contains no string matching `/S[PT][0-9A-Z]{20,}/`.

---

### Value paths checked and found correct

Recorded so a later reader does not re-derive them. **`src/lib/mint/post-conditions.ts`** (407 lines) is the model *for condition codes and arithmetic*: every builder emits `LessEqual` only, all arithmetic is bigint, chunk-batch division rounds up via `(totalChunks + chunkBatchSize - 1n) / chunkBatchSize` (`:95`), and every builder returns `null` rather than a guessed cap when an input is missing. **The public collection mint page** (`src/CollectionMintLivePage.tsx:1542-1686`) consumes those builders throughout and never constructs a condition itself. **Read V4 before treating that as the whole verdict:** what is correct here is the *shape* of the cap, not the *amount* fed into it — `resolveSealSpendCapMicroStx` (`:84-93`) reconstructs a five-variable contract fee from the single variable `get-fee-unit` returns, and `LessEqual` protects the user only for as long as that reconstruction over-estimates. **Multi-asset settlement** (`src/lib/market/settlement.ts`, `src/lib/contract/fungible-assets.ts`) carries per-asset decimals in a registry — USDCx 6, sBTC 8 — parses through `parseDecimalAmount`, and distinguishes three states where two would have been easier: `unresolved` (read not yet back), `stx`, and `fungible-token` with an unknown contract id, which `isMarketSettlementSupported` refuses rather than defaulting. That is the "a failed read is not an empty answer" discipline applied to money. **`estimateDataMiningFeeMicroStx`** (`src/lib/mint/estimates.ts:41-52`) is bigint with explicit round-half-up. **The sponsor relayer's fee arithmetic** (`functions/sponsor/[[path]].ts:110-112`, `:1076-1078`, `:1424-1453`) is bigint, capped at `MAX_FEE_USTX`, floored at `MIN_BUDGET_USTX`, and the drops branch that caps below the estimate logs exactly what it capped and why (`:1435-1443`); the function holds no module-level mutable state, so it is correct across Cloudflare isolates. **`agent-core.ts`'s deposit and change arithmetic** is bigint end to end apart from V1: `minerBudget` (`:588-593`), the gross-up at `:624-628`, `sweepStxTo` (`:1245`) which always leaves exactly `REFUND_TX_FEE` behind, and `ustxToStx` (`:480`) which is display-only and whose trailing-zero strip is safe because `toFixed(6)` always leaves a decimal point in the way. **`vite.config.ts`** deserves specific credit: `loadEnv(mode, process.cwd(), '')` loads every variable including unprefixed secrets, and the author put only `Boolean(hiroApiKey)` into `define` (`:83`, `:98`) while the key itself reaches only the dev-server proxy headers (`:82`, `:145-163`). No secret is baked into the client bundle. **Telemetry** (`functions/log.ts`, `functions/lib/telemetry-ingest.ts:20-43`) hashes wallet addresses with a server-side salt and **returns `null` when the salt is absent** rather than emitting an unsalted hash, and scrubs seed phrases, addresses, private keys and long hex before persisting. **No `TODO`, `FIXME`, `XXX` or `HACK` marker exists anywhere** in `src/`, `functions/`, `scripts/` or `packages/` — confirming and extending §3.1's narrower claim. **`useSponsoredBuy.ts:137-142`** clears its poll interval on cleanup.

---

## 5. Quick wins

High confidence, low risk, each completable on its own without waiting for anything else. Ordered by value per unit of effort.

| # | Change | Where | Effort | Closes |
|---|---|---|---|---|
| 1 | Cap the wizard fee at the quoted `agentFeeExpectedUstx` | `src/agent-one/agent-core.ts:1639` | **S** | V1 |
| 2 | Delete the two local `resolveFeePostConditions` and call `src/lib/mint/post-conditions.ts` | `MintScreen.tsx:1277-1290`, `CollectionMintScreen.tsx:673-686` | **S** | V2, §3.15 #3 |
| 3 | Fix the `<head`/`<header>` prefix match: `` new RegExp(`<${tagName}(?=[\s>])[^>]*>`, 'i') `` | `src/lib/viewer/module-paths.ts:152-153` | **S** | half of §3.15 #1 |
| 4 | Guard `moduleBaseHref` on write, matching the `?? ''` already used one branch over | `functions/runtime/content.ts:740`, `:829` (cf. `:884`) | **S** | other half of §3.15 #1 |
| 5 | Add `Referrer-Policy: no-referrer` for `/runtime/*`; make the bridge token single-use | `public/_headers`; `src/lib/viewer/runtime-open.ts:171-190` | **S** | L1 |
| 6 | Replace the two float STX parsers with `parseDecimalAmount(raw, 6)` | `src/sponsor-ops.ts:167`, `:226` | **S** | M1 |
| 7 | Lower `DEFAULT_FEE_UNIT_MICROSTX` to 11,000, or make the double-failure case refuse to quote | `src/lib/contract/fees.ts:5` | **S** | V3 |
| 8 | Move the campaign AI key to `sessionStorage` | `src/screens/CampaignConsoleScreen.tsx:232` | **S** | L2 |
| 9 | Test asserting `AGENT_BUILD` equals the `?v=` in all three wizard HTML files | new test; pattern from `player-template-mobile.test.ts:149-151` | **S** | §3.6, lead 10 |
| 10 | Test asserting `drops-registry.json` holds one entry per network | new test | **S** | lead 10 |
| 11 | Collapse the three `readChainTip`/`fetchChainTip` copies onto one with a single failure contract | `scripts/wizard/inscribe.mjs:369`, `market-run-core.mjs:630`, `provision-core.mjs:660` | **S** | lead 8 |
| 12 | Make the manifest print one member count, not two that disagree | `scripts/wizard/collection-run-core.mjs:1148`, `:1371` | **S** | lead 9, round-1 defect 3 |
| 13 | Delete `VITE_HIRO_API_KEY` as an accepted key name — one line from each file | `.env.example:8`, `functions/lib/hiro-keys.ts:58` | **S** | most of L3 |
| 14 | Replace the six bare `import.meta.env` reads with named property reads | `src/lib/network/config.ts:15`, `src/lib/bns/config.ts:18`, `:26`, `:58`, `src/lib/utils/logger.ts:76`, `src/screens/AdminDiagnosticsScreen.tsx:80` | **S** | rest of L3 |
| 15 | Generate the bridge token from `crypto.getRandomValues`, and throw rather than degrade | `src/lib/viewer/runtime-open.ts:46-53` | **S** | L4 |
| 16 | Stop rendering the admin allowlist to refused visitors | `src/admin/AdminGate.tsx:180-183` | **S** | L5 |

Items 3 and 4 are listed separately because either alone leaves the bug reachable: the regex fix stops `<base>` landing inside `<header>`, and the write guard stops the string `"null"` existing in the first place. Do both.

Items 13 and 14 are likewise a pair. #13 removes the specific trap; #14 removes the class, so the next `VITE_`-prefixed secret cannot be swept into the bundle by a module that never asked for it. #13 alone is worth shipping on its own if #14 slips.

**Not a quick win, despite looking like one.** V4 is deliberately absent from this table. Changing the fee model is a small diff but it is not low-risk until the two read-only calls in §8.0.3 have been made, because the correct fix depends on which direction the current model is wrong in. §5 item 7 is the safe part of it and can proceed independently.

---

## 6. Structural improvements

Work that needs planning, a design decision, or a human answer — not a hurried patch. None of these should be attempted as a drive-by.

**6.1 A single-runner lease for the browser agent (F1), paired with a mempool pre-check (F2).** These are the report's two P1s and they are one problem seen from two angles: the agent decides what to send from *confirmed* state, and nothing stops two deciders running. Both corrections are already prototyped elsewhere in this repository — `src/lib/utils/tab-guard.ts` implements a `localStorage` lease with a 2 s heartbeat and a 6 s staleness cut (`:5-7`, interval at `:138`), and `pendingQueue(addr)` (`agent-core.ts:927-940`) already reads the mempool but is used only by `stuckStatus`. The design work is deciding the lease key (per job id, not per tab), where it is taken relative to `watchTick`'s first `await`, and what a lease that cannot be acquired shows the user. Treat `navigator.locks` as the primary and the `localStorage` lease as the fallback. **Do not ship one without the other**: the lease closes the common case, the mempool check closes the single-tab case the lease cannot see.

**6.2 One sponsor error taxonomy, derived from the relayer (F4, M2).** The app and the published SDK maintain two hand-written lists of which failures permit a self-paid retry, and they disagree on six codes. The structural fix is not to reconcile the lists but to remove one: the SDK is already a workspace package mapped in `tsconfig.json`, so `src/lib/market/sponsor-client.ts` can import the taxonomy instead of restating it. Whichever list wins must be derived from the relayer's own `fail()` sites in `functions/sponsor/[[path]].ts` so a new code cannot be added server-side without forcing the decision. The prerequisite is the open question in §10.3 — nothing in the repository settles which list is correct.

**6.3 Rename or manifest `contracts/live/`.** The directory holds source for contracts that were never deployed (`xtrata-drops-v1.2`, `xtrata-v3-2-3-gateway`, `proof-of-free-living-synth-v1`), and that has already cost one migration plan written against the wrong target (`6082465d`). It also weakens the evidence base of this audit: §4's own caveat notes that F1 and F2 cite `contracts/live/xtrata-v3.2.3.clar` as a proxy for deployed bytecode. Either split into `contracts/deployed/` and `contracts/candidates/`, or add a manifest recording, per contract, the mainnet address and the transaction that deployed it. The verification step is the one `6082465d` performed by hand: enumerate the directory against the chain.

**6.4 Extract the media-kind predicate.** `kind === 'image' || kind === 'svg'` is written inline at eight sites in `src/home/main.js` (`:3493`, `:5982`, `:6289`, `:6783`, `:7095`, `:7202` and others). The ninth site diverged into an impossible condition and rendered an existence probe as artwork on every market card for months (`ba64a1d0`, §3.4). One exported helper makes the next divergence a type error rather than a silent blank.

**6.5 Determine whether `liveHtmlFrameManager` is safe for the market grid.** `04804b01` reverted away from it without identifying which of two candidate causes blanked the Claim page, and the reverted analysis argues the market grid is unaffected only because it registers during its own render. Establish whether that is a property or a coincidence before anything else adopts the manager.

**6.6 Give the grace key a lifetime (F3).** Low severity but genuinely unbounded: one BIP39 mnemonic accumulates per abandoned, never-funded job, invisible in the UI and unreachable by the ordinary delete path. The design question is what multiple of the deposit window is long enough to be safe.

**6.7 Decide `ms-rebuild`, and decide the merge backlog.** Both are §7 items and both are human calls — see §10.1 and §10.2.

**6.8 One source of truth for what a mint costs (V4, V5, and the rest of V2).** The app currently answers "what will the core charge" in three incompatible ways: the homepage asks the contract (`main.js:4811`, `:4822`), the collection and admin screens reconstruct it from one variable (`fees.ts:54-72`, `post-conditions.ts:84-93`), and the published SDK holds a fourth copy of the reconstruction (`packages/xtrata-sdk/src/mint.ts:99-119`). The contract exposes `quote-staged-fee` and `quote-single-tx-fee` precisely so nobody has to model it (`contracts/live/xtrata-v3.2.3.clar:1568`, `:1572`). The structural fix is a single `src/lib/mint/pricing.ts` that takes a client and returns a quoted fee or an explicit "cannot price right now", consumed by all four callers and re-exported by the SDK rather than duplicated in it.

Sequence it carefully: **the design decision comes from §8.0.3**, not from the code. If the live fee variables were set uniformly, the current model over-estimates and this is a tidy-up that also fixes V3's display defect. If they were set individually, the current model under-caps the public collection seal and this is urgent. Do not start the refactor before that is known, because the two situations call for different interim behaviour — the first can ship gradually, the second wants the collection page's seal cap widened the same day.

This is also the answer to a pattern the report keeps hitting from different directions: §6.4 (the media-kind predicate), V2 (the post-condition helper) and this item are all one concept implemented per-surface, and each was fixed on exactly one surface at a time. `3026a159` is the counter-example that shows the shape of the fix — extract the *decision* into a DOM-free module and have every surface import it. Its own header says why: *"They had no code in common, which is how the public page ended up advertising 'no STX needed' on a button that always called `showContractCall`"* (`src/lib/market/sponsored-buy.ts:5-8`).

---

## 7. Branch drift and release risks

### 7.1 First: what "staging" actually names

The brief asks for staging ↔ `main-staging` ↔ `main` as three distinct comparisons. Verified against the repository, two of those are not distinct and one is a trap:

- **The current staging branch is `main-staging`.** It is the checked-out branch, it carries all work from 2026-07-30 to 2026-08-01, and it is the source of every merge into `main` (PRs #240–#268). So *staging ↔ `main-staging`* is a comparison of a branch with itself, and *staging ↔ `main`* is the same comparison as *`main-staging` ↔ `main`*.
- **A branch literally named `staging` also exists**, local and remote, both at `1f1d903a` ("Merge pull request #94 from stxtrata/hero-coll-image"), last moved **2026-03-24 — over four months ago**. It is not the staging branch. Two further local branches point at that same dead SHA: `codex/pricing-staging-clean` (which tracks `origin/staging` under a different name) and `staging` itself.

**Classification: potentially dangerous.** Not because of its content, but because of its name. A tool, script, human or agent that resolves "staging" by branch name lands on a four-month-old tree, and `wrangler.toml` states that branch preview builds share production D1 and R2. Nothing in the repo documents that `main-staging`, not `staging`, is the live integration branch — §1.3 had to infer it from merge topology. The rest of §7 uses "staging" to mean `main-staging`.

### 7.2 `main-staging` ↔ `main`

Merge base `2216dae8`; staging 25 ahead, `main` 6 ahead, all six being merge commits of staging into `main`. Content-wise `main` ⊆ `main-staging` — `git diff 2216dae8 main -- xtrata-2.0/` is empty.

The 25 staging-only commits change 73 files in `xtrata-2.0/`: **+28,226 / −154 lines**. That ratio is the story — this is almost entirely new surface, not modification of shipped code. Grouped:

| Group | Files | Lines | Classification |
|---|---|---|---|
| `scripts/wizard/` — a new 18-module inscription/market harness plus 12 test files (`market-run-core.mjs` 2,736 lines; `run-thread-core.mjs` 2,334; `collection-run-core.mjs` 1,501; `inscribe.mjs` 1,493; `provision-core.mjs` 1,087) and a 783-line `README.md` | 32 | ~22,900 added | **Intentional.** Self-contained new directory, no existing file touched, `.env.wizards.example` committed with real keys gitignored, tests alongside every module. |
| `tools/mosaic-sim/` — local fake-chain simulator (`server.mjs`, `state.mjs`, `seed-state.mjs`, `mosaic.html`, `README.md`) | 5 | 631 added | **Intentional.** Dev tooling; its scratch state is gitignored (`tools/mosaic-sim/state/`). |
| Sponsored market buy — new `src/lib/market/sponsored-buy.ts` (319) and `registry.ts` (44), rewrites of `useSponsoredBuy.ts` (±82) and `SponsoredBuySection.tsx` (±39), `src/lib/drops/sponsored-claim.ts` (±12), `src/data/market-registry.json` (±17), plus three new test files | 11 | ~1,070 net | **Intentional, and the highest-risk group.** Commits `3026a159` ("remove the false promise, then wire it properly"), `fb43fd01` (a `"/"` `sponsorApi` value silently disabling sponsored buying everywhere) and `4f717fdb` (stop offering `v2-1-0`-welded markets) are money-path changes. Flagged for §4b, not judged here. |
| Homepage / fullscreen relations UI — `src/home/main.js` (+627 net), `src/home/styles/home.css` (±212), `index.html` (±48), three new `src/home/__tests__/` files | 7 | ~1,300 | **Intentional.** |
| Docs and generated LLM manifests — `docs/plans/WIZARD-ROUND-2-PLAN.md`, `WIZARD-TEST-WALLETS-PLAN.md`, `public/llms.txt`, `public/llms-full.txt`, `scripts/sdk/llms-generate.mjs`, `package.json` | 6 | ~500 | **Intentional.** `llms*.txt` are generated by `sdk:llms:generate`, so they move with `package.json`'s new `wizards:*` scripts. |

**Fixes stuck in staging.** Three of the 25 read as corrections to behaviour that is live on `main` right now:

| Commit | What it fixes | Classification |
|---|---|---|
| `fb43fd01` | A `sponsorApi` value of `"/"` silently disabled sponsored buying everywhere. | **Potentially dangerous while unmerged** — if the bad configuration is what production is running, this is a live defect with the fix sitting in staging for two days. Whether production actually carries that value is a Cloudflare-dashboard question this audit cannot answer. |
| `4f717fdb` | Stops offering markets welded to `v2-1-0` and says so to agents. | Probably intentional to hold — matches the repo's stated "newest contract only" rule (`CLAUDE.md`), so it is a correctness change, not a hotfix. |
| `cabeb3d1` | "Verify the quote before it becomes permanent." | Probably intentional to hold — inscription is irreversible, so this tightens a gate rather than repairing a break. |

**Production changes missing from staging: none.** Verified by the empty `git diff 2216dae8 main -- xtrata-2.0/`. There is no hotfix-on-`main` pattern in this repository; every change reaches `main` through `main-staging`.

**Conflicting implementations of one feature: none within this pair.** Sponsored buy is rewritten in place rather than added alongside; `useSponsoredBuy.ts` and `SponsoredBuySection.tsx` are modified, not duplicated.

**Likely merge-conflict files: none.** `main` has no independent `xtrata-2.0/` content, so merging staging into `main` is a fast-forward in substance. The gap is release risk (28k lines merged in one PR), not conflict risk.

**Overall classification for this pair: intentional, but the merge cadence has broken.** PRs #263–#268 all landed 2026-07-28/29 — six merges in two days. Then nothing for three days while 25 commits and 28,226 lines accumulated. The pattern that was running is small, frequent merges; what is queued now is not that.

### 7.3 `main-staging` ↔ `origin/main-staging`

`1 0` — one local commit, `b5c7443e` ("Three readings of the same eight things", 2026-08-01), not pushed. **Classification: accidental or simply in-flight**, and low-consequence: a single commit, less than a day old, on the branch being actively worked. Worth noting only because everything in §7.2 is measured from a HEAD that exists on exactly one machine.

### 7.4 `main-staging` ↔ `origin/ms-rebuild` — the large stale branch

Merge base `ea9cad00` (2026-07-25). Counts: **139 ahead on staging, 1 ahead on `ms-rebuild`.**

`ms-rebuild` is a single commit, `6fc69472`, whose message describes a complete ground-up rebuild: a new Clarinet project (`xtrata-collection-v3` Clarity 3, `xtrata-drops-v3` Clarity 4) targeting core v3.2.3, a typed client package, a rebuilt sponsor relayer, a new Vite app with Collection Studio / Drop Builder / claim page and a 15-stage deployment canary, ten design documents, and 965 passing tests. Its own message names three blockers: the relayer's audit ledger is not persisted (sponsor exposure totals live in memory per isolate, making auto-shutdown unreliable), nothing has run on testnet, and there is no browser test suite.

Two facts change how this should be read:

1. **Its entire diff is confined to `xtrata-2.0/rebuild/`.** `git show --name-only 6fc69472 -- xtrata-2.0/` touches only `rebuild/{client,contracts,docs,relayer,ui}`. It shares no file with anything `main-staging` has changed. **Merging it would produce zero conflicts.**
2. **It is 139 commits behind.** The 392-file, ±100k-line difference reported by `git diff main-staging origin/ms-rebuild -- xtrata-2.0/` is almost entirely staging's own week of work being *absent* from `ms-rebuild` — passkey wallet, mosaic sim, `scripts/wizard/`, sponsored buy — not the rebuild diverging from it.

**Classification: undeterminable without human context, tending to potentially dangerous.** A week-old, self-described-code-complete parallel implementation of the collection and drops stack, carrying three named pre-mainnet blockers, sitting unmerged with no branch-level record of whether it is the intended direction, an abandoned experiment, or waiting on those blockers. Nothing in `xtrata-2.0/docs/` on `main-staging` mentions it. Meanwhile `main-staging` continued building `scripts/wizard/` — a *different* collection/inscription harness — over the same week. Whether those two are alternatives or complements is exactly the question a human has to answer, and it is the single most consequential unresolved item in this section.

The on-disk residue at `xtrata-2.0/rebuild/` (§2.9) compounds this: the path looks occupied locally while containing no source.

### 7.5 Duplicate commits — merge-flow artefacts

Three subjects appear twice in the 21-day window on the same lineage:

| Subject | SHAs | Classification |
|---|---|---|
| "Stop asking the chain for more than it is allowed to give in one read" | `4e3e7e7c`, `d0de3efb` (both 2026-07-29) | **Accidental, benign.** Sits directly above `ae2d60f2` "Merge branch 'main-staging' … into main-staging" — the signature of a pull that re-applied work. |
| "Radio: clicking a song in Your Station plays THAT song" | `7b031af9` (07-28), `7972c7cb` (07-28) | Same pattern, around `d8a41ecb` "Merge branch 'main' into main-staging". |
| "Radio page: stop the transport buttons jumping on every track change" | `9245e317` (07-27), `f2830b74` (07-27) | Same. |

These are history noise from `git pull` without rebase across the `main` ↔ `main-staging` boundary, not competing implementations. **No action implied**, but they mean commit count overstates distinct work by roughly 3 in this window, and `git log --oneline` is not a reliable de-duplicated changelog for this repository.

### 7.6 Stale branches

110 remote branches (excluding the `origin/HEAD` symref). Distribution by last commit, measured from 2026-08-01:

| Age band | Count |
|---|---:|
| Active (≤ 7 days) | 3 — `main-staging`, `main`, `ms-rebuild` |
| 8–30 days | 22 |
| 31–60 days | 13 |
| **> 60 days** | **72** |

Seventy-two remote branches have not moved in over two months; the oldest, `origin/v2-1-0`, dates to 2026-02-08 — nearly six months. Every one has a local counterpart, so the local list is 117 branches for what is effectively three live lines of work.

**Classification: accidental accumulation, low severity individually, meaningful in aggregate.** Three specific sub-cases are worth separating out:

- **`origin/staging` and `staging`** — dangerous by name, covered in §7.1.
- **Branches whose names imply they are staging.** Eighteen remote branches begin `origin/main-staging-`: `-1.2`, `-2`, `-3`, `-astro`, `-fab-opt`, `-fable`, `-fix`, `-fixes`, `-gate`, `-gate-opt`, `-optim`, `-optim-2`, `-sol`, `-sol-2`, `-sol-wiz`, `-terra`, `-wal-fix`, `-wizard`. Two of them collide on content: `main-staging-2` and `Xtrata-Backup-Migration-Service` are the *same* SHA `8948cf37`. Given `wrangler.toml`'s note that branch previews share production bindings, eighteen abandoned staging-named branches are eighteen preview URLs that will still build against live D1 and R2 if anyone triggers them.
- **Explicit backup branches** — `backup/main-pre-staging-merge-20260717`, `backup/main-pre-seg-merge-20260628`, `backup-main-before-staging-merge`, `backup-new-runtime-before-c780935`, `rescue-current-mess`, `rescue-contract-app-review`. **Probably intentional but undocumented**: six point-in-time safety copies with no note anywhere saying which are still needed. Two of them (`backup/main-pre-staging-merge-20260717`, `backup/main-pre-seg-merge-20260628`) exist only locally, so the safety they represent lives on one machine.

**Merge-conflict risk across the stale set: not assessable branch-by-branch here, and mostly moot.** Any branch older than 2026-06-01 predates the wallet playbook, the runtime cache binding, the drops single-version rule and the whole `scripts/wizard/` tree. Reviving one is a rewrite, not a merge. The exception is `ms-rebuild` (§7.4), which is recent and path-disjoint.

### 7.7 Summary of §7 by classification

| Classification | Item |
|---|---|
| **Potentially dangerous** | `staging`/`origin/staging` at a 2026-03-24 SHA while `main-staging` is the real staging branch, with branch previews bound to production D1/R2 (§7.1) |
| **Potentially dangerous** | `fb43fd01` — the `"/"` `sponsorApi` fix is in staging, unmerged, while the defect may be live (§7.2) |
| **Undeterminable without human context** | `ms-rebuild` — a code-complete parallel rebuild, 1 commit, 139 behind, path-disjoint, three named pre-mainnet blockers, no doc anywhere on `main-staging` (§7.4) |
| **Probably intentional but undocumented** | 28,226 unmerged lines across 73 files after a run of six merges in two days (§7.2) |
| **Probably intentional but undocumented** | Six backup/rescue branches, two of them local-only, none annotated (§7.6) |
| **Probably intentional but undocumented** | `WIZARD-PIPELINE-PLAN.md` and `WIZARD-RELEASE-RUNBOOK.md` uncommitted while the code they describe is committed (§2.9) |
| **Intentional** | `scripts/wizard/`, `tools/mosaic-sim/`, sponsored-buy rewrite, homepage relations UI (§7.2) |
| **Accidental** | One unpushed local commit `b5c7443e` (§7.3) |
| **Accidental** | Three duplicated commit subjects from pull-without-rebase (§7.5) |
| **Accidental** | 72 remote branches idle > 60 days; `xtrata-2.0/rebuild/` on-disk residue with no source in it (§7.6, §2.9) |

---

## 8. Recommended implementation order

Ordered so that nothing is done twice and nothing is done against a moving target. The dependency arrows are the point; the numbering within a stage is not.

### Stage 0 — before writing any code

**8.0.1 Answer §10.1 (`ms-rebuild`).** It is a code-complete parallel implementation of the collection and drops stack. If it is the intended direction, a good part of stages 2 and 3 below is work on code that is being replaced. This gates nothing technically and everything economically, and it is one sentence from Jim.

**8.0.2 Merge `main-staging` into `main`.** 37 commits and ~28k lines are queued behind a cadence that ran at six PRs in two days as recently as 2026-07-28. This must come **first among code actions** for a reason that is not release hygiene: §3.15 item 2 — the market/grid SVG branch rendering `get-svg-data-uri`, a per-contract constant, as though it were the artwork — is **live on `main` and already fixed on `main-staging`** (`ba64a1d0`). Merging is the entire fix. Every day it waits is a day production shows the same three concentric circles for every listing. Nothing else in this plan should be built on top of an unmerged 28k-line backlog.

**8.0.3 Read the five fee variables off the deployed core, and settle V4.** Two read-only calls against `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3`, no wallet and no gas:

```
get-upload-chunk-fee-unit
get-upload-batch-fee-unit      # what get-fee-unit returns, and the only one the app reads
```

Then compare against `resolveSealSpendCapMicroStx`'s `F·(1 + ceil(chunks/32))` for a 32-chunk asset. If `upload-chunk-fee-unit` is roughly `upload-batch-fee-unit / 32`, the fee variables were set uniformly through `set-fee-unit`, the app's caps hold, and V4 is a robustness fix that can take its place in stage 3. If `upload-chunk-fee-unit` is materially larger than that — the deployed default of `u2000` against a flat unit near 9,000 being the case to look for — then the public `/collection/<id>` seal post-condition is capped roughly 4× below the fee the contract will charge, every collection seal on that path aborts after the begin fee and all upload batches have been paid, and V4 moves to the front of stage 1.

This costs minutes and it is the only item in the report whose *priority* is unresolved rather than whose *fix* is. Everything else in §8 can be scheduled without it; V4 cannot.

### Stage 1 — quick wins, in parallel, no interdependencies

All sixteen items in §5. They touch disjoint files and none blocks another, with two couplings already noted: **§5 items 3 and 4 must ship together** or `<header><base href="null">` stays reachable by the other route, and **items 13 and 14** are the specific trap and its class.

Three orderings inside this stage matter:

- Do **§5 #2** (delete the two local `resolveFeePostConditions`) before **§5 #7** (the `fees.ts` constant). Once both screens use `src/lib/mint/post-conditions.ts`, the constant is display-only *on those screens* and the choice between "lower it to 11,000" and "refuse to quote" is easier to make. Note that #2 does not make the constant harmless everywhere — V4 and V5 are about the *amount* those builders receive, not the condition code, and they are unaffected by #2.
- Do **§5 #1** (cap the wizard fee) before touching anything else in `agent-core.ts`. It is a three-line change in `deliver()` and stage 2 rewrites the control flow around it.
- **If §8.0.3 came back badly**, V4 joins this stage ahead of everything else in it: widen the collection page's seal cap to the contract's own quote before any other work, because until that lands every collection mint on the public path spends the begin fee and every upload fee and then aborts at seal.

### Stage 2 — the two P1s, together

**8.2.1 F1 + F2 as one piece of work** (§6.1). Sequence inside it: take the per-job lease first, because it is the cheaper change and it makes the mempool check's behaviour deterministic when you come to test it; then gate every re-send in `stagedInscribe` and `mintSingle` on `pendingQueue`. Extend `src/agent-one/__tests__/support/fake-chain.ts` once, for both — it needs a transaction that stays pending indefinitely, which serves F2's test directly and F1's second context indirectly.

Do **not** attempt F3 (the grace-key lifetime) in the same change. It touches the same reaper and the same `keepKey` flags, and mixing an unbounded-accumulation cleanup into a funds-safety fix makes both harder to review.

### Stage 3 — structural, each independently reviewable

| Order | Item | Depends on |
|---|---|---|
| 3.1 | §6.3 rename/manifest `contracts/live/` | — |
| 3.2 | §6.8 one source of truth for mint pricing (V4, V5) | §8.0.3 answered — it decides both urgency and interim behaviour; **do after 3.1**, since "which fee is the deployed one" is the same question as "which contract is the deployed one" |
| 3.3 | §6.2 one sponsor error taxonomy | §10.3 answered; benefits from 3.1 for the same reason |
| 3.4 | §6.4 extract the media-kind predicate | Stage 0.2 merged, so there is one copy of `main.js` to change |
| 3.5 | §6.5 determine `liveHtmlFrameManager` safety | — |
| 3.6 | §6.6 grace-key lifetime (F3) | Stage 2 landed |

3.2, 3.3 and 3.4 are the same refactor applied to three concepts and should be done in that order rather than together — each is independently reviewable, and doing them as one change would produce a diff nobody can review against the money paths it touches.

### Stage 4 — housekeeping, any time

Rename or delete the branch literally named `staging` (§7.1) — it is four months stale and any tool resolving "staging" by name lands on it, against production D1 and R2. Prune the 72 remote branches idle over 60 days, annotating the six backup/rescue branches first. Remove the `xtrata-2.0/rebuild/` on-disk residue once §10.1 is answered. Move `prompt-run1.md`, `prompt-run2.md` and `run-xtrata-audit.sh` under `audit/` or delete them.

**One thing deliberately not scheduled.** The v3.2.4 candidate's absence from `Clarinet.toml` (§3.11) is correct for a draft and should stay that way until the candidate is promoted. Do not "fix" it by registering the draft.

---

## 9. Things checked and found acceptable

Named because a later reader should not spend the time again, and because several of these are the reason findings elsewhere are scoped small.

**Self-custody, read end to end across passes 3 and 4, and the claim holds.** The handoff — the only code path that could send a deposit key off the machine — is dormant and cannot be enabled from any shipped page: `HANDOFF_ENDPOINT` is `cfg.handoffEndpoint || ''` (`agent-core.ts:2292`), `handoffJob` throws before touching the job (`:2296`), and no HTML in the subtree sets `handoffEndpoint`. Export strips keys (`:2203-2213`), locked by `src/agent-one/__tests__/job-export.test.ts:39-50`. No key material reaches logs, URLs, analytics or error reporting: `xaoLog` writes messages not job objects (`:555-559`), `publicJob` destructures `ephemeralMnemonic` out (`:562`), the only URL-borne job data is the id (`unfinished.ts:99`). Pass 4 adds the leakage half: the telemetry pipeline that would be the obvious exfiltration route hashes addresses with a server-side salt and fails closed when the salt is missing (`functions/lib/telemetry-ingest.ts:33-43`), and scrubs seed phrases, addresses, private keys and long hex before persisting (`:20-31`).

**No build-time secret reaches the client bundle in the build we can inspect.** This was the single highest-value leakage question. `vite.config.ts:80` calls `loadEnv(mode, process.cwd(), '')` — an empty prefix, which loads *every* environment variable including the unprefixed `HIRO_API_KEY`. The author put only `Boolean(hiroApiKey)` into `define` (`:83`, `:98`); the key itself is used solely in dev-server proxy headers (`:82`, `:145-163`), which never ship. The `import.meta.env` consumers that do reach the bundle (`src/lib/admin/access.ts:15`, `src/config/manage.ts:53`, `src/lib/bns/config.ts`, `src/lib/network/config.ts`) carry allowlists and API base URLs, not credentials, and `dist/assets/*.js` contains no occurrence of `HIRO_API_KEY`. **One qualification, which is L3:** the *server* side independently accepts `VITE_HIRO_API_KEY` as a Hiro key (`functions/lib/hiro-keys.ts:58`) and `.env.example:8` invites that name, so an operator configuring the Functions runtime through the Pages dashboard would bake the key into the bundle in the same action. The `vite.config.ts` half is clean by construction; the naming convention around it is not.

**The post-condition layer, where it is used.** `src/lib/mint/post-conditions.ts` is uniformly `LessEqual`, uniformly bigint, rounds batch counts up, and returns `null` rather than a guessed cap on missing input. The public collection mint page consumes it throughout. The homepage's own `resolveFeePostConditions` reaches the same answer by a different route and documents why. Three of the four mint surfaces are correct; V2 names the two screens that are not.

**Multi-asset value handling.** `fungible-assets.ts` carries USDCx at 6 decimals and sBTC at 8 in a registry keyed by contract id, and its comment explains why USDT is deliberately absent — no verifiable mainnet contract id, so nothing was hardcoded. `settlement.ts` distinguishes `unresolved` from `stx` from `unsupported-token` and refuses the last two rather than defaulting, and every parse goes through `parseDecimalAmount`, which is bigint and rejects over-precise input. Micro/display confusion, the shape the brief asked us to hunt, does not occur here.

**The sponsor relayer.** Fee arithmetic is bigint, floored, capped, and the one place it caps *below* the estimate logs exactly what it did and why (`functions/sponsor/[[path]].ts:1435-1443`). There is no module-level mutable state, so the in-memory-exposure hazard that `ms-rebuild`'s own commit message names for *its* relayer does not apply to this one.

**Agent-One's read discipline.** Pass 3 recorded it; pass 4 confirms it holds on the value paths specifically. The funding gate takes the best of three balance reads and distinguishes "every read failed" from "the balance is zero" (`agent-core.ts:1461-1467`). `balance()` throws rather than returning `0n` on a bad response (`:91-96`). `detectFunder` picks the largest cumulative sender rather than the first, so dust cannot claim a refund (`:763-790`). `sweepStxTo` always leaves exactly `REFUND_TX_FEE` behind, so the sweep can always pay for itself (`:1245`).

**Timers, listeners and polling.** The `setInterval` calls at `agent-core.ts:2363-2365`, `sponsor-ops.ts:458` and `src/home/radio.js:854`, `:864`, `:1734` are module-scope daemons that live for the page and correctly have no teardown. The React ones clear on unmount — `useSponsoredBuy.ts:137-142` is the money-path case and it does. No leak found worth reporting.

**No leftover markers.** Zero `TODO`, `FIXME`, `XXX` or `HACK` across `src/`, `functions/`, `scripts/` and `packages/`. Pass 3 checked `src/` alone; pass 4 widened it and the result is unchanged. The brief's "TODO/FIXME now affecting production" category is genuinely empty.

**No floating-point arithmetic reaches a transaction argument or a post-condition anywhere in the subtree.** Swept rather than assumed: the only `parseFloat` call sites in `src/` are `src/lib/pricing/hooks.ts:21` and `src/lib/pricing/fiat.ts:115`, both on USD spot rates that are display-only, and the only `toFixed` sites in `src/home/main.js` (`:1218`, `:1512`, `:10547-10548`) are a log timecode, an exchange-rate label and a byte-size label. `Math.round` appears on amounts only where a `number` is narrowed to `bigint` for a cap it already over-approximates. M1 is the sole float parser on a value path and it is an operator console, not a user surface. The brief's "floating-point arithmetic on amounts" category is, apart from M1, genuinely empty.

**The legacy public panels are unreferenced, not dead weight.** `src/PublicApp.tsx` (2,799 lines) and `src/SimplePublicHome.tsx` (1,859) are no longer imported by `src/main.tsx` — the comment at `:5-7` says so and explains why they are kept — so Rollup never pulls them into the bundle graph and they cost disk and reading time only. Recorded so a later sweep does not delete them as dead code: they are the reference for restoring `/workspace` once V2 is fixed, which is exactly what `src/main.tsx:77-88` says they are for.

**Telemetry's one open-ended input is unexercised.** `breadcrumb(label, data?)` accepts arbitrary `data` which rides along with error events, but a grep across `src/` finds no caller outside the telemetry library itself. One documentation nit rather than a finding: `functions/log.ts:10-11` says raw wallet addresses "never land here", when in fact they arrive in the request body and are hashed on receipt. Same-origin HTTPS carrying a public value, so the behaviour is right; the sentence overstates it.

**From pass 3, not re-derived here.** Nonce handling in `send()` and RBF replacement; `waitTx`/`confirmOrEscalate` distinguishing unreachable-API from not-confirmed; recovery after refresh, tab close and sleep; mainnet/testnet selection being unmissable; `scripts/wizard/make-wizards.mjs` never writing a key to disk; `classifyIntentNonce` checking the mempool before treating absence as proof. **One correction to pass 3 while confirming its citations:** F2 states `pendingQueue` is "currently used only by `stuckStatus` (`:2155-2160`)". There is a second caller, `unstickQueue` at `agent-core.ts:952`. That is the manual unstick path rather than a resume path, so F2's conclusion — that no resume decision consults the mempool — stands unchanged.

---

## 10. Open questions for Jim

Only what the repository and its git history cannot answer. Everything else in this report was settled from the tree.

**10.1 Is `ms-rebuild` the intended direction, an abandoned experiment, or blocked?** It is one commit, 139 behind, path-disjoint from everything on `main-staging`, and its own message describes a code-complete ground-up rebuild of the collection and drops stack with three named pre-mainnet blockers. Nothing in `docs/` on `main-staging` mentions it. Meanwhile `main-staging` spent the same week building `scripts/wizard/`, a *different* collection and inscription harness. Whether those are alternatives or complements is not inferable from the repository, and it changes the value of several items in §8 stage 3. **This is the single most consequential unanswered question in the audit.**

**10.2 Is the 37-commit, ~28k-line staging backlog being deliberately held, and if so, for what?** The merge cadence was six PRs in two days through 2026-07-28, then stopped. The work queued behind it includes the fix for a defect currently live on `main` (§3.15 item 2). Nothing in the history says whether this is a release gate, a rehearsal that has not happened, or simply the week getting away.

**10.3 Is the campaign attestation gate contract-enforced or relayer policy?** This decides F4 and blocks §6.2. If `functions/sponsor/[[path]].ts:1352`'s "campaign attestor is not configured on-chain" reflects a contract rule, the app's `fallbackToSelfPaid: false` is authoritative and the published SDK is wrong. If it is relayer policy that could change, the SDK's `true` is right and the app is over-restrictive. The repository states the condition but not its origin, and `src/lib/market/__tests__/sponsor-client.test.ts:237` currently pins an answer that has not been checked against the contract.

**10.4 Which branch does Cloudflare Pages treat as production, and which as preview?** §1.3 inferred `main` = production from merge topology because no `.github/workflows/` exists and `wrangler.toml` names no branch. The same file records that preview builds share production D1 and R2. That combination means the answer determines whether the 18 abandoned `main-staging-*` branches and the four-month-old `staging` branch are harmless or are eighteen preview URLs pointed at live data.

**10.5 What is the intended wizard fee policy when a user overpays?** V1 assumes the quote is the promise and recommends capping there. If the intent is genuinely "10% of whatever arrives", the fix is the opposite one — change the disclosure, not the arithmetic. The code currently implements the second and displays the first, so one of them is wrong, but which is a product decision.

**10.6 Are the six backup and rescue branches still needed?** `backup/main-pre-staging-merge-20260717`, `backup/main-pre-seg-merge-20260628`, `backup-main-before-staging-merge`, `backup-new-runtime-before-c780935`, `rescue-current-mess`, `rescue-contract-app-review`. Two exist only locally, so whatever safety they represent lives on one machine. Nothing annotates any of them.

**10.7 How were the v3-2-3 fee variables actually set — through `set-fee-unit`, or individually?** This decides V4's priority and it is the one question in the report that the repository provably cannot answer, because the five values are mutable `define-data-var`s and the tree only records their deploy-time defaults. The measured evidence in `docs/plans/WIZARD-RELEASE-ROUND-1.md:51` and `:65` — a flat 11,000 µSTX for a one-chunk `mint-single-tx`, quoted live on 2026-08-01 — is consistent with *both* a uniform `set-fee-unit(u≈10,667)` and individually-set units leaving `upload-chunk-fee-unit` at its deployed `u2000`. Under the first, the public collection page's seal cap holds. Under the second, it is roughly 4× too low and every collection seal on that path aborts after the money is spent. §8.0.3 is the two-call check; this entry records that if you already know the answer from having made the change, the check is unnecessary.

**10.8 Is `VITE_HIRO_API_KEY` set in the Cloudflare Pages environment?** L3 establishes that the name is a trap and that the local build does not carry a key. Whether the deployed build does is a dashboard fact. If it is set, the key is in the public bundle on production and on every preview URL, and it should be rotated as well as renamed.

---

## Verification (pass 1)

- Every SHA cited in this document was resolved with `git rev-parse` / `git log` / `git for-each-ref` against the repository at audit time and exists.
- Every file path cited was confirmed present, either in the working tree or in the named tree object (`origin/ms-rebuild` for `xtrata-2.0/rebuild/**`).
- No worktrees were created, so none needed removal. `git worktree list` shows only the primary workspace at `/Users/melophonic/Documents/GitHub/xtrata` on `main-staging`.
- The checked-out branch was never changed. HEAD is still `b5c7443e`. The only ref-writing command run was `git fetch --all --prune`.
- No tracked file was modified and nothing was staged: `git diff HEAD` and `git diff --cached` are both empty at the end of the pass, as they were at the start.
- The only path this audit wrote was this report, `xtrata-2.0/docs/audits/XTRATA_OPTIMISATION_AUDIT.md`, which sits under the already-untracked `xtrata-2.0/docs/audits/` entry and so adds no line to the porcelain output.

**One difference between the start and end `git status --porcelain`, which this audit did not cause.** A ninth untracked line appeared partway through the pass:

```
?? xtrata-2.0/scripts/wizard/collection-marks.mjs
```

12,199 bytes, mtime 2026-08-01 18:55 — a maker's-marks and coat-of-arms generator for the wizard collection, whose header references a `collection-marks.test.ts` that does not exist in the tree. It was written by some other process on this machine while the audit was running. The audit's only write was this report; it did not create, modify or delete that file, and it has been left untouched. §2.2 records the porcelain output as it stood at the start of the pass; this is the only delta.

### Pass 4 verification

Performed at HEAD `c33bb100` on `main-staging`, over the whole document rather than pass 4's own sections.

- **Every SHA cited anywhere in this report resolves to a commit.** All 56 distinct SHAs were fed to `git cat-file --batch-check`; none returned `missing`, and every one is of type `commit`.
- **Every file path cited anywhere in this report exists** in the working tree at `c33bb100`. Checked explicitly, including all of pass 3's citations.
- **Line-level citations in pass 4's findings were each opened and read**, not inferred. Two pass-3 line references were re-derived and confirmed exactly: `MintScreen.tsx:1284-1287` is the `conditionCode` ternary, and `packages/xtrata-sdk/src/sponsor.ts:91` is the `fallbackToSelfPaid` assignment. One is imprecise and harmless: pass 3's `tab-guard.ts:78` for the heartbeat lands on `useActiveTabGuard`'s opening lines; the interval itself is at `:138`. The constants at `:5-7` are correct.
- **Adversarial re-read of every P0 and P1.** There are no P0s. Both P1s were re-verified against the code rather than accepted:
  - **F1 survives.** `PROCESSING` is confirmed module-scope at `agent-core.ts:1865`; `watchTick` is confirmed to call `background(j.jobId, () => autoRun(...))` for any `fastTrack` job at `:2020-2022`; the status gate and the intervening awaits are as described. **Priority unchanged at P1.**
  - **F2 survives.** `FATAL_ERR` is confirmed at `:1896` as `/TX abort|locked to|unrecoverable|file bytes|empty file/i`, which does **not** match the `'not confirmed: '` thrown at `:351`, so the transient branch at `:1930` is confirmed to be the one taken. **Priority unchanged at P1.**
  - Pass 4's own findings were held to the same bar. Nothing reached P1: V1 and V2 are P2 because neither loses funds nor aborts a transaction, and L1's impact is explicitly bounded by the wallet confirmation prompt, which is stated in the finding rather than left implied.
- **Two corrections to pass 3 are recorded in place** rather than silently: V3 downgrades §3.15 item 4, and M2 removes one code from F4's divergence list. Neither changes a recommendation.
- **The working tree is unchanged apart from this report.** `git status --porcelain` is byte-identical to its state at the start of the pass; `git diff HEAD` and `git diff --cached` are both empty. HEAD is still `c33bb100` and the checked-out branch is still `main-staging`.
- **No worktree was created**, so none needed removal — `git worktree list` shows only the primary workspace. No ref-writing command was run in this pass at all: no fetch, no checkout, no commit.

### Pass 4, second contribution

**Two pass-4 runs wrote this document.** The first wrote §4b (V1–V3, L1–L2, M1–M2), §5, §6, §8, §9, §10 and the verification block above. A second run audited the same scope independently and, on finding the sections already written, added rather than replaced. Everything above this heading is the first run's except where explicitly marked. What the second run contributed: **V4, V5, L3, L4, L5**; the qualifications to §4b's "Value paths checked and found correct" and §9's "no build-time secret reaches the client bundle"; §5 items 13–16; §6.8; §8.0.3 and the reordering of stages 1 and 3 that follows from it; §10.7 and §10.8; three additions to §9; and the revised **Start here**.

- **The `## Verification` heading had been lost**, leaving pass 1's verification bullets orphaned under §10 with no heading. Restored as "Verification (pass 1)". No content was changed.
- **Every path cited in the new findings was opened and read**, not inferred, at HEAD `c33bb100`. Branch parity for all of them was established with a single `git diff --name-only main main-staging` over the fifteen files V4, V5 and L3–L5 cite; the output is empty. The one file that does differ between branches, `src/home/main.js`, is cited with both line numbers where it appears (`main-staging:1602` / `main:1579`; `main-staging:4811`,`:4822` / `main:4754`,`:4765`).
- **Pass 2's §3.15 citations were re-verified rather than trusted.** `git show main:xtrata-2.0/src/home/main.js` line 10689 reads `if (kind === 'image' && fetchable && mime.includes('svg'))` — the impossible condition, confirmed still live on `main`; `main-staging:11201` reads `if (kind === 'svg' && fetchable)`, confirmed fixed. `module-paths.ts:152-153` is the `` `<${tagName}[^>]*>` `` regex; `:166` is the falsy-only guard. `content.ts:740` and `:829` write `moduleBaseHref` unguarded while `:884` writes `moduleBaseHref ?? ''` — the asymmetry pass 2 described is exactly as stated.
- **Adversarial re-read of every P0 and P1, including the new one.** No P0s exist. F1 and F2 were re-checked independently of the first run's re-check and both survive; the one imprecision found is recorded in §9 (F2's `pendingQueue` has a second caller, `unstickQueue` at `:952`, which does not change its conclusion). **V4 was held to the harder standard because it is new and P1.** The part that is P1 is verified from the contract source and the client source together: `get-fee-unit` returns one of five variables (`:1601-1603`), the app's seal formula is not the contract's seal formula (`fees.ts:61-65` against `:429-437`), and the public collection page passes that reconstruction into a `LessEqual` cap with no quote anywhere in the file. The part that is *not* verified — which of two admin settings is live — is labelled Hypothesis in the finding, given a two-call check in §8.0.3, and raised as §10.7 rather than resolved by guessing. V4 keeps P1 because a cap that may be 4× low on a public money path is a P1 question even before it is a P1 answer.
- **Nothing else was promoted.** V5 and L3 are P2 because neither loses funds: V5 misprices, L3 exposes a paid API key. L4 and L5 are P3 with their reachability bounded in the findings themselves — L4 to non-secure contexts, L5 to disclosure rather than escalation.
- **One limit on this contribution, stated rather than worked around.** Network access was unavailable, so no mainnet read-only call was made. Three claims turn on live contract state; each is labelled **Hypothesis**, names the exact call that settles it, and appears in §8.0.3 and §10.7 as work rather than as a conclusion. No chain state is asserted anywhere in the new findings.
- **File inspection stayed inside `xtrata-2.0/`** throughout, including `dist/`, which is inside the subtree. `.env.local` was not read; only its ignore status was considered, and no secret value appears anywhere in this document.
- **The working tree is unchanged apart from this report**, re-confirmed at the end of this contribution: `git status --porcelain` shows the same five untracked entries it showed at the start (`xtrata-2.0/audit/`, `xtrata-2.0/docs/audits/`, `prompt-run1.md`, `prompt-run2.md`, `run-xtrata-audit.sh`), `git diff HEAD` and `git diff --cached` are both empty, HEAD is `c33bb100`, and the branch is `main-staging`. **No worktree was created**, so none needed removal — `git worktree list` shows only the primary workspace. No ref-writing command was run: no fetch, checkout, commit, merge, rebase, reset or stash.

---

## Start here

Three actions, in order.

1. **Read two numbers off the deployed core** — `get-upload-chunk-fee-unit` and `get-upload-batch-fee-unit` on `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3`. Two read-only calls, no wallet, no gas, minutes. If the first is roughly the second divided by 32, V4 is a robustness fix and can wait for §8 stage 3. If it is materially larger — the deployed default of 2,000 against a flat unit near 9,000 being the case to look for — then the public `/collection/<id>` seal post-condition is capped about 4× below what the contract will charge, and every collection mint on that path is currently spending the begin fee and every upload fee before aborting at seal. This is first because it is the only thing in the report whose *priority* is unknown rather than whose fix is, and because it is the cheapest question in it.

2. **Merge `main-staging` into `main`.** It is the whole fix for the market thumbnails currently rendering an existence probe as artwork on production (§3.15 item 2, `ba64a1d0`), and every other recommendation assumes one branch rather than two. Nothing else should be built on a 37-commit backlog. Then take §5 in any order — sixteen small, independent changes, of which **#1 (cap the wizard fee at the quote, `agent-one/agent-core.ts:1639`, three lines)** is the only place in this audit where a user is charged more than the interface told them, and **#13 (delete one line from `.env.example` and one from `functions/lib/hiro-keys.ts`)** removes the one way a live API key could reach the public bundle.

3. **Answer §10.1: is `ms-rebuild` the direction or not?** One sentence from you decides whether a good part of the structural work in §8 stage 3 is worth doing at all. Everything technical can proceed without it; the sequencing cannot.

---

## Correction to V4 (post-audit, verified against mainnet 2026-08-02)

V4's **mechanism is confirmed live**. Its **root cause and blast radius as written
were wrong**, and §10.7 is now answered. No other finding is altered.

### The fee variables were set individually (answers §10.7)

Read-only against `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3`:

| Variable | µSTX |
|---|---:|
| begin-fee-unit | 100,000 |
| seal-fee-unit | 100,000 |
| upload-batch-fee-unit | 100,000 |
| upload-chunk-fee-unit | 1,000 |
| single-tx-fee-unit | 10,000 |

Not a uniform `set-fee-unit`, which would have forced upload-chunk to 3,125.
Both settings V4 hypothesised were wrong: upload-chunk was lowered to 1,000, not
left at the u2000 default.

### The defect

The app divides chunk counts by `MAX_BATCH_SIZE = 50` to count fee batches. The
deployed contract charges per `MAX-UPLOAD-BATCH-SIZE = u32` (mainnet source line
75, asserted at line 1067). Confirmed against the contract's own
`quote-staged-fee`:

| chunks | contract seal fee | app cap | result |
|---:|---:|---:|---|
| 32 | 132,000 | 200,000 | holds |
| 33 | 232,000 | 200,000 | **aborts, short 32,000** |
| 65 | 332,000 | 300,000 | **aborts, short 32,000** |

Asymptotically the contract charges ~1.56x what the post-condition permits. The
abort happens **at seal**, after the begin fee and every upload batch fee have
been spent — which is what makes it P1 rather than a display bug.

### Root cause the audit did not identify

`packages/xtrata-sdk/README.md` stated the deployed ABI constant was 50 and
directed its use for protocol fee math. Six fee sites followed that one wrong
documented number. This is a single error propagated, not six independent ones,
so the README was corrected first.

### Second consequence, absent from V4

`src/lib/deploy/pricing-lock.ts` used the same divisor. Its output is stored in
collection metadata as `absorbedSealFeeMicroStx` / `worstCaseSealFeeMicroStx`.
Nothing wrong was written on chain — this is our own API — but assets over 32
chunks under-state the absorbed fee, and where `mintPriceStx` absorbs fees the
operator eats the difference. Collections deployed before the fix carry
under-stated locks. Remediation deliberately not attempted.

### Not affected

- The Wizard (`src/agent-one/agent-core.ts:33`) defines its own `BATCH = 32` and
  never imports `MAX_BATCH_SIZE`.
- The single-transaction route: files at or under 30 chunks never stage.

### Correct uses of MAX_BATCH_SIZE = 50, left unchanged

The contract types index lists as `(list 50 uint)` (lines 177, 178, 267), so 50
remains right for `purge-expired-chunk-batch` (`src/screens/MintScreen.tsx`) and
for read batching (`src/lib/viewer/content.ts`).
