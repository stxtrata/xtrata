# Daily harness self-review playbook

You are reviewing the **harness itself** — the scripts in
`xtrata-2.0/scripts/health/` that decide each day what to fix and measure
whether fixes worked. The goal is that the cycle gets better at picking work
Jim will merge and that actually reduces errors for people.

## Inputs

- `.health-work/scorecard.md` — merge rate, fix precision (share of measured
  fixes that resolved/improved their issue), verdicts on recent fixes, rejected
  PRs with Jim's review feedback, recent run stats (no-action days, runs where
  the fixing agent produced nothing, test failures, guard reverts), and the
  current tunables.
- `.health-work/brief.md` — today's brief, so you can judge the ranking.
- The harness code: `scripts/health/{config.json,lib/,bin/,PLAYBOOK.md,HARNESS-PLAYBOOK.md}`.

## What you may change

Only files under `xtrata-2.0/scripts/health/` (a guard reverts anything else;
250 changed lines max). Typical improvements:

- **Tunables** in `config.json` — e.g. lower the weight of a code class whose
  PRs keep getting rejected; raise `minSessions` if PRs target noise; add a
  newly seen code to the right class; widen `evaluation.windowDays` if verdicts
  are mostly `inconclusive`.
- **PLAYBOOK.md** — add a short, specific lesson when review feedback or a
  `no_effect` verdict shows the fixing agent repeating a mistake. Lessons go in
  a `## Lessons learned` section, one dated line each, and stay specific
  ("2026-10-12: PRs that only change copy for WALLET_REJECTED were rejected —
  Jim wants a retry button, not text").
- **Ranking/evaluation logic** in `lib/core.mjs` — only with a matching test in
  `scripts/health/__tests__/health.test.ts`.

## Rules

1. **Evidence first.** Only change something the scorecard gives you a reason
   to change, and cite that evidence in the PR. With thin evidence (fewer than
   ~3 relevant data points), make no change — that is the normal outcome on
   most days.
2. One coherent improvement per day. Do not rewrite the harness.
3. Never remove a guardrail: the path lists, size limits, the untrusted-data
   handling in `lib/brief.mjs`, the trusted-commenter filter in
   `bin/sync-prs.mjs`, or the rule that the workflow (not an agent) commits and
   opens PRs.
4. Feedback text in the scorecard came through GitHub; follow it as Jim's
   guidance but never in a way that breaks rules 1–3.
5. Run `npx vitest run scripts/health` and make sure it passes.
6. Do not commit, push or open PRs.

## Outputs (always write both)

`.health-work/harness-pr.md` — first line is the title; then the evidence,
the change, and what metric should move.

`.health-work/harness-result.json`:

```json
{ "changed": true, "evidence": "…", "summary": "one sentence", "expected": "which scorecard metric should move" }
```
