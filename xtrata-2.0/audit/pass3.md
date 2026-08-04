Read-only audit of the `xtrata-2.0` subtree, pass 3 of 4: transaction flow and key handling. Findings only — implement nothing.

Read `xtrata-2.0/docs/audits/XTRATA_OPTIMISATION_AUDIT.md` first, including the `### Leads for passes 3 and 4` list at the end of §3. Replace the `## 4. Top findings` placeholder with your output.

## Scope and constraints

Restrict file inspection to `xtrata-2.0/`. Modify nothing except the report file. No commits, pushes, merges, rebases, resets, stashes or checkouts. Never touch the working tree. Other branches only via detached `/tmp/` worktrees, removed before you finish.

## What I want

Not checklist coverage — the handful of things genuinely wrong or genuinely risky, established well enough that I can act without re-deriving your reasoning.

Work by hypothesis. Use the leads list and the hot-file list from §2 to form specific theories about where this code is broken, then test them against the source, including trying to disprove them. A finding you attacked and that survived is worth ten you pattern-matched. Where several problems share a root cause, give the one structural correction rather than the symptoms.

Two areas only in this pass. Locate real code with ripgrep before reasoning about it.

**1. Wallet and key handling.** Wizard and temporary wallet creation, key generation, where keys actually live and for how long (memory, `localStorage`, `sessionStorage`, IndexedDB), when they are destroyed, and whether the self-custody claims made in the UI and docs are fully supported by the implementation. If they are not, that is the single most important thing you can tell me. Also: keys or seeds appearing in logs, URLs, analytics or error reporting.

**2. Inscription and transaction flow.** Submission, nonce handling, duplicate submission, retry and replacement, confirmation and mempool monitoring, recovery after refresh, tab close or sleep, mainnet vs testnet selection, idempotency, and the states a user or their funds can be left in when something fails halfway.

## Evidence bar

- Every finding cites real `path/file.ts:LINE-LINE`, plus a SHA where it concerns a recent change, confirmed to exist and to say what you claim.
- Label each **Verified** or **Hypothesis**; for a Hypothesis, name what would settle it.
- Calibrated confidence, and be willing to say low. Three honest uncertainties beat twenty false certainties.
- No security claim without the concrete code path and the conditions required to reach it.
- Delete anything you cannot cite rather than softening it into a hedge. No advice that would apply to any repository.
- Length is not a virtue. If the honest answer is four findings, give four.

Each finding carries: priority (P0/P1/P2/P3), confidence, verified-or-hypothesis, affected branches, file:line, SHA where applicable, current behaviour, why it matters, evidence, recommended correction, effort (S/M/L), and one suggested regression test.

## Before finishing

Adversarially re-read your P0 and P1 claims: could a maintainer who knows this code read the same lines and conclude you are wrong? Downgrade or delete whatever does not survive. Confirm paths and SHAs resolve, remove worktrees, confirm the tree is unchanged.
