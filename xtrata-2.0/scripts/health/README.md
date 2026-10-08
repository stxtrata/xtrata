# Xtrata daily health cycle

A daily loop that turns the live `/debug` telemetry into one small, reviewed
fix per day, measures whether each merged fix actually reduced the problem,
and improves its own judgement from those results.

```
06:17 daily (GitHub Actions: .github/workflows/xtrata-health-daily.yml)
  1 collect   /debug/data?range=7d|24h  ─▶ history/<date>.json (counts only)
  2 sync-prs  open / merged / closed for every PR the cycle opened (+ Jim's review notes)
  3 plan      measure merged fixes (rate per 1k events, 3 days before vs after)
              rank issues → pick ONE target → brief.md, scorecard.md
  4 Claude    fix it, following PLAYBOOK.md          (edits files only)
  5 guard     revert off-limits paths, enforce size  (deterministic)
  6 test      vitest → PR (draft + label if tests fail)
  7 Claude    review the harness, following HARNESS-PLAYBOOK.md
              → guard (scripts/health/ only) → tests → PR, when evidence supports it
  8 memory    ledger.json + history + runs.jsonl pushed to the `health-state` branch
```

Nothing is merged automatically. Merging a PR is the approval.

## How it learns

- **Site:** every fix PR is tied to the fingerprints it targets. Three days
  after merge, `plan` compares that issue's rate per 1k events with the three
  days before and records `resolved`, `improved`, `no_effect`, `regressed` or
  `inconclusive`. Issues with an open PR or an unmeasured fix are skipped; two
  failed attempts hand the issue to Jim (`needs_human`). A resolved issue that
  shows up again in the last 24h is reopened and flagged as a regression.
- **Harness:** the scorecard (merge rate, fix precision, rejected PRs with your
  review comments, empty runs, test failures, guard reverts) goes to a second
  agent that may tune `config.json`, add lessons to `PLAYBOOK.md`, or improve the
  ranking code with a test. Your review comments on closed PRs are the strongest
  signal it has, so a one-line "why not" when you close a PR goes a long way.

## One-time setup

0. Put the workflow in place (the remote tools that built this could not write
   into `.github/`, so it ships next to the scripts):
   `git mv xtrata-2.0/scripts/health/xtrata-health-daily.yml .github/workflows/`
1. Repository secrets (Settings → Secrets and variables → Actions):
   - `DEBUG_VIEW_KEY` — the same value as the Cloudflare Pages secret.
   - `CLAUDE_CODE_OAUTH_TOKEN` — run `claude setup-token` locally (uses your
     Claude subscription), **or** `ANTHROPIC_API_KEY` for API billing.
2. Settings → Actions → General → Workflow permissions: **Read and write**, and
   tick **Allow GitHub Actions to create and approve pull requests**.
3. Optional variable `HEALTH_MODEL` (default `opus`).
4. Actions → *Xtrata daily health cycle* → **Run workflow** with *dry run*
   ticked. The job summary shows the brief; if it says the data is unavailable,
   check the key.

## Running locally

```bash
cd xtrata-2.0
# offline, against the synthetic fixture
node scripts/health/bin/collect.mjs --fixture scripts/health/__fixtures__ --state /tmp/hs --work /tmp/hw
node scripts/health/bin/plan.mjs --state /tmp/hs --work /tmp/hw && cat /tmp/hw/brief.md
# live
DEBUG_VIEW_KEY=… node scripts/health/bin/collect.mjs --state /tmp/hs --work /tmp/hw
npx vitest run scripts/health
```

## Privacy and safety

- History and the ledger hold counts, codes, flows and fingerprints only. Error
  samples, stacks and context exist only in the run's artifact (kept 14 days).
- Error text reaches the agent through `untrusted()` and is labelled as data:
  anyone can post to `/log`, so it is treated as possible prompt injection.
- The agents can only read, edit and run tests. The workflow commits, pushes and
  opens PRs after the guard step. Review comments are only fed back to the agent
  when written by the owner, members or collaborators.
- Site PRs can never touch contracts, migrations, `wrangler.toml`, package
  files, `.github/` or the harness itself; harness PRs can only touch
  `scripts/health/`. Wallet, sponsor, contract and telemetry code is allowed but
  flagged in the PR.
