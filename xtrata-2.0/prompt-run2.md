Read-only audit of this repository, run 2 of 2. Produce findings only — do not implement any of them.

**Start by reading `docs/audits/XTRATA_REPO_OPTIMISATION_2026-07-31.md`** (or the copy at the repository root). Run 1 already wrote the repository state, recent-change review and branch-drift sections. Do not redo that git work — trust it, build on it, and append your sections to the same file. If that file does not exist, run 1 failed: do a fast 10-minute version of the mapping yourself, then continue.

## Hard constraints

- Modify nothing except that report file. No commits, pushes, merges, rebases, resets, stashes, checkouts, cherry-picks, tags or deploys.
- Never run `git clean`, `git restore`, `git checkout <path>`, or anything that touches the working tree.
- If the working tree is dirty, leave it byte-identical. Verify with `git status --porcelain` at the end.
- Inspect other branches only via detached worktrees under `/tmp/`, removed before you finish.

## What I want

Not checklist coverage — the handful of things genuinely wrong or genuinely risky, established well enough that I can act without re-deriving your reasoning.

Work by hypothesis. Use run 1's recent-change review and hot-file list to form specific theories about where this codebase is likely broken, then test them against the source, including trying to disprove them. A finding you attacked and that survived is worth ten you pattern-matched. Where several problems share a root cause, give me the one structural correction rather than the symptoms.

Concentrate on four areas, locating real code with ripgrep before reasoning about it:

1. **Inscription and transaction flow** — submission, nonces, duplicate submission, retry and replacement, confirmation and mempool monitoring, recovery after refresh, tab close or sleep, mainnet vs testnet selection, idempotency, and the states a user or their funds can be left in when something fails halfway.
2. **Wallet and key handling** — wizard/temporary wallet creation, key generation, where keys actually live and for how long (memory, `localStorage`, `sessionStorage`, IndexedDB), when they are destroyed, and whether the self-custody claims made in the UI and docs are fully supported by the implementation. If they are not, that is the single most important thing you can tell me.
3. **Value correctness** — balances, deposit detection, fee estimation, change return, sponsored/gasless paths, and unit conversion across STX / sBTC / USDCx. Micro-unit vs display-unit confusion and floating-point arithmetic on amounts are the specific shapes to hunt.
4. **Leakage** — keys or secrets in logs, URLs, analytics or browser storage; client-exposed env vars that should not be.

Beyond those, follow what the code suggests: duplicate implementations of one concept, polling without cleanup, uncleaned timers and listeners, unhandled rejections, TODO/FIXME now affecting production. Performance and test gaps are in scope only where you can argue the cost or risk is real.

## Evidence bar

- Every finding cites real `path/file.ts:LINE-LINE`, plus a SHA where it concerns a recent change, confirmed to exist and to say what you claim.
- Label each **Verified** or **Hypothesis**; for a Hypothesis, name what would settle it.
- Calibrated confidence, and be willing to say low. Three honest uncertainties beat twenty false certainties.
- No security claim without the concrete code path and the conditions required to reach it.
- Delete anything you cannot cite rather than softening it into a hedge. No advice that would apply to any repository.
- Length is not a virtue. If the honest answer is six findings, give me six.

## Sections to append

Replace the `## 4. Top findings` placeholder with your findings, ranked P0/P1/P2/P3, each carrying: priority, confidence, verified-or-hypothesis, affected branches, file:line, SHA where applicable, current behaviour, why it matters, evidence, recommended correction, effort (S/M/L), and one suggested regression test.

Then append: §1 Executive summary (write it last, at the top of the file); §5 Quick wins; §6 Structural improvements; §8 Recommended implementation order; §9 Things checked and found acceptable — name the systems you genuinely read and why they looked sound; §10 Open questions for Jim, only what the repository and git history cannot answer.

Write sections to disk as they complete.

## Before finishing

Adversarially re-read your own P0 and P1 claims: could a maintainer who knows this code read the same lines and conclude you are wrong? Downgrade or delete whatever does not survive. Verify every path and SHA resolves. Remove your worktrees. Confirm the working tree is unchanged.

End the report with **Start here tomorrow morning**: exactly three actions, in order.
