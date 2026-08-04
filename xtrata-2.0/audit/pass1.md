Read-only audit of the `xtrata-2.0` subtree, pass 1 of 4: repository mapping and branch drift. Mapping only — do not investigate code quality, do not write findings. Later passes do that.

## Scope

Restrict all file inspection to the `xtrata-2.0/` subtree. Git history commands may span the whole repository, but ignore commits that touch only other subtrees (Narrate-AI-v2 and similar sibling projects are out of scope).

## Hard constraints

- Modify nothing except the report file named below. No commits, pushes, merges, rebases, resets, stashes, checkouts, cherry-picks, tags or deploys.
- Never run `git clean`, `git restore`, `git checkout <path>`, or anything that touches the working tree. There are uncommitted local changes — preserve them byte-identically.
- `git fetch --all --prune` is permitted. Nothing else that writes to refs.
- Inspect other branches only via `git worktree add --detach /tmp/...`, removed before you finish. Never change the primary workspace's checked-out branch.
- Verify branch names, remotes and deployment relationships. Assume nothing about what `main-staging` or `main` mean.

## Output

Create `xtrata-2.0/docs/audits/XTRATA_OPTIMISATION_AUDIT.md`. Write each section to disk as soon as it is complete. Leave placeholder headings `## 3. Recent-change review`, `## 4. Top findings` and `## 4b. Value correctness and leakage` with `_(pending)_` beneath each.

## §2 Repository state

Record verbatim: current branch and HEAD SHA; `git status --porcelain`; `git remote -v`; `git branch -a -vv` after fetching; commits from the last 21 days across all branches with dates and authors; the 50 most recent commits on each of the current staging branch, `main-staging` and `main`; merge base and `git rev-list --left-right --count` for each pair; and the 40 most frequently changed files in `xtrata-2.0/` over the last 60 days.

Also record what the four uncommitted modified files contain (`git diff HEAD -- <path>`) and whether they look like work-in-progress or accidental drift.

## §7 Branch drift and release risks

Compare staging ↔ `main-staging`, `main-staging` ↔ `main`, staging ↔ `main`. Classify each material difference as: intentional / probably intentional but undocumented / accidental / potentially dangerous / undeterminable without human context. Flag fixes stuck in staging, production changes missing from staging, conflicting implementations of one feature, likely merge-conflict files, and stale branches.

## Before finishing

Confirm every path and SHA cited resolves. Remove your worktrees. Confirm `git status --porcelain` is unchanged apart from the report. Then stop.
