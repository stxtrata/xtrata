Read-only audit of the `xtrata-2.0` subtree, pass 2 of 4: recent-change review.

Read `xtrata-2.0/docs/audits/XTRATA_OPTIMISATION_AUDIT.md` first — pass 1 wrote the repository state and branch drift sections. Trust that work, do not redo it. Replace the `## 3. Recent-change review` placeholder with your output.

## Scope and constraints

Restrict file inspection to `xtrata-2.0/`. Modify nothing except the report file. No commits, pushes, merges, rebases, resets, stashes or checkouts. Never touch the working tree — there are uncommitted local changes to preserve. Other branches only via detached `/tmp/` worktrees, removed before you finish.

## §3 Recent-change review

Group the last 21 days of commits into themes and read the actual diffs. For each theme record:

- What changed and the apparent intent.
- Whether it is complete across every layer it touches — Clarity contract, service layer, UI, types, config, docs.
- Any regression or behavioural change.
- Duplicated logic introduced during fast iteration.
- Leftover debug code, dead fallbacks, feature flags or commented-out blocks.
- Whether the equivalent change exists on the other two branches, and whether the absence looks intentional.
- Anything already live on `main` that looks like it needs a follow-up fix.

Cite file paths and SHAs throughout. Where something looks wrong, note it in one line and flag it for pass 3 or 4 — do not investigate it here.

End your section with a short list headed `### Leads for passes 3 and 4` naming the specific files and hypotheses the deep-dive passes should prioritise.

## Before finishing

Confirm cited paths and SHAs resolve, remove worktrees, confirm the tree is unchanged apart from the report.
