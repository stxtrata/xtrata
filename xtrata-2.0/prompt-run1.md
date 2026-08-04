Read-only audit of this repository, run 1 of 2. Mapping only — do not investigate code quality, do not write findings, do not implement anything. Run 2 does that.

## Hard constraints

- Modify nothing except the single report file named below. No commits, pushes, merges, rebases, resets, stashes, checkouts, cherry-picks, tags or deploys.
- Never run `git clean`, `git restore`, `git checkout <path>`, or anything that touches the working tree.
- If the working tree is dirty, leave it byte-identical. Record `git status --porcelain` at the start and again at the end, and include both.
- `git fetch --all --prune` is permitted. Nothing else that writes to refs.
- Inspect other branches only via `git worktree add --detach /tmp/...`, removed before you finish. Never change the primary workspace's checked-out branch.
- Verify branch names, remotes and deployment relationships. Assume nothing about what `main-staging` or `main` mean.

## Output

Create `docs/audits/XTRATA_REPO_OPTIMISATION_2026-07-31.md` (repo root if that directory does not exist). Write each section to disk as soon as it is complete — an interrupted run must still leave a usable file. Leave a placeholder heading `## 4. Top findings` with the text `_(run 2)_` beneath it.

## §2 Repository state

Record verbatim output of: current branch and HEAD SHA; `git status --porcelain`; `git remote -v`; `git branch -a -vv` after fetching; commits from the last 14 days across all branches with dates and authors; the 50 most recent commits on each of the staging branch, `main-staging` and `main`; merge base and `git rev-list --left-right --count` for each pair; and the 40 most frequently changed files over the last 60 days.

## §3 Recent-change review

Group the last 14 days of commits into themes and read the actual diffs. For each theme record: what changed and the apparent intent; whether it is complete across every layer it touches (contract, service, UI, types, config, docs); any regression or behavioural change; duplicated logic from fast iteration; leftover debug code, dead fallbacks, flags or commented-out blocks; whether the equivalent change exists on the other two branches; and anything already live on `main` that looks like it needs a follow-up.

State facts with file paths and SHAs. Where something looks wrong, note it in one line and move on — run 2 will investigate.

## §7 Branch drift and release risks

Compare staging ↔ `main-staging`, `main-staging` ↔ `main`, staging ↔ `main`. Classify each material difference as: intentional / probably intentional but undocumented / accidental / potentially dangerous / undeterminable without human context. Flag fixes stuck in staging, production changes missing from staging, conflicting implementations of one feature, likely merge-conflict files, and stale branches.

## Before finishing

Confirm every path and SHA you cited resolves. Remove your worktrees. Re-run `git status --porcelain` and confirm the tree is unchanged apart from the report. Then stop — do not begin run 2's work.
