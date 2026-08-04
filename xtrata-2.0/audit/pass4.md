Read-only audit of the `xtrata-2.0` subtree, pass 4 of 4: value correctness, leakage, and report completion. Findings only — implement nothing.

Read `xtrata-2.0/docs/audits/XTRATA_OPTIMISATION_AUDIT.md` first, including pass 3's findings so you do not duplicate them. Replace the `## 4b. Value correctness and leakage` placeholder with your findings, then append the remaining sections.

## Scope and constraints

Restrict file inspection to `xtrata-2.0/`. Modify nothing except the report file. No commits, pushes, merges, rebases, resets, stashes or checkouts. Never touch the working tree. Other branches only via detached `/tmp/` worktrees, removed before you finish.

## §4b findings — two areas

**1. Value correctness.** Balance calculation, deposit detection, fee estimation, change return, sponsored and gasless paths, and unit conversion across STX / sBTC / USDCx. The specific shapes to hunt: micro-unit versus display-unit confusion, floating-point arithmetic on amounts, rounding direction on fees, and any place a user could underpay or overpay.

**2. Leakage and client exposure.** Secrets or env vars exposed to the client bundle that should not be, sensitive values in URLs or query strings, and anything security-relevant written to browser storage or analytics.

Beyond those two, include anything the code genuinely warrants: duplicate implementations of one concept, polling without cleanup, uncleaned timers and listeners, unhandled promise rejections, TODO/FIXME now affecting production. Performance and test gaps only where you can argue the cost or risk is real.

Same evidence bar as pass 3: real `path/file.ts:LINE-LINE`, SHA where relevant, **Verified** or **Hypothesis** label, calibrated confidence, no security claim without the concrete reachable path, delete what you cannot cite, no generic advice. Each finding carries priority, confidence, affected branches, paths, current behaviour, why it matters, evidence, recommended correction, effort, and one suggested regression test.

## Remaining sections

Then write, in this order: §5 Quick wins (high-confidence, low-risk, independently completable); §6 Structural improvements (planned work, not hurried patches); §8 Recommended implementation order, accounting for dependencies between fixes; §9 Things checked and found acceptable — name the systems you and pass 3 genuinely read and why they looked sound; §10 Open questions for Jim — only what the repository and git history cannot answer.

Write §1 Executive summary last, inserted at the top of the file: plain English, repository health, recent change quality, and the most important actions.

Recommendations must preserve Xtrata's self-custody and composability goals.

End the report with **Start here**: exactly three actions, in order.

## Before finishing

Adversarially re-read every P0 and P1 in the whole report, including pass 3's. Downgrade or delete whatever does not survive. Confirm every cited path and SHA across the entire document resolves. Remove worktrees. Confirm the tree is unchanged apart from the report.
