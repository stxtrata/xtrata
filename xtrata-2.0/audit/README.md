# Audit harness

Generates `docs/audits/XTRATA_OPTIMISATION_AUDIT.md` by running four read-only
Claude passes over the `xtrata-2.0/` subtree, each building on the last.

That report is committed. This harness is what produced it, so without these
files the report is a document nobody can reproduce or refresh.

```bash
./audit/run.sh all      # all four passes in order
./audit/run.sh 3        # re-run one pass
```

| Pass | Writes | Effort | Turn cap | Time cap |
|---|---|---|---|---|
| 1 | repository mapping, branch drift | medium | 80 | 20 min |
| 2 | recent-change review | high | 120 | 25 min |
| 3 | transaction flow and key handling | xhigh | 200 | 40 min |
| 4 | value correctness, leakage, completion | xhigh | 200 | 40 min |

Each pass appends to the same report and replaces the placeholder heading the
previous pass left for it, so **order matters** — pass 3 reads pass 2's "leads"
list. Re-running a single pass is fine; running 4 before 3 is not.

## Safety properties

Worth knowing before running it, because they are the reason this is safe to
point at a dirty tree:

- **Every pass is read-only.** The allowlist permits `Write`/`Edit` but the
  prompts forbid touching anything except the report, and no git command that
  writes to refs or the working tree is allowed — no commit, checkout, reset,
  stash, clean or restore.
- **Uncommitted work is saved first.** `run.sh` writes `git diff HEAD` to
  `~/xtrata-uncommitted-<timestamp>.patch` before starting.
- **The tree is checked afterwards.** `git status --porcelain` plus `HEAD` are
  captured before and after and diffed, printing `IDENTICAL` when nothing moved.
- **Other branches are read via detached worktrees under `/tmp`**, never by
  changing the checked-out branch.
- It aborts if less than 2 GB is free, since a pass can generate a lot of log.

Each pass runs under a wall-clock cap: `SIGINT` first so the model can finish
writing, then `SIGKILL` 20 seconds later. Prompts instruct each pass to flush
sections to disk as they complete, so an interrupted run still leaves a usable
file.

## Trusting the output

The report is a set of hypotheses, not verified fact, and it has been wrong.

Finding **V4** identified a real live defect but attributed it to the wrong root
cause and understated the blast radius. Its two hypotheses about how the fee
variables were set were both wrong. Every load-bearing claim was checkable
against the chain in a few minutes, and checking is what found the actual cause.

See `## Correction to V4` at the end of the report. Treat findings as leads to
verify, which is how they are written.

## The older two-run harness

`../run-xtrata-audit.sh` with `../prompt-run1.md` and `../prompt-run2.md` is the
previous generation: whole-repo scope, two passes, output to
`XTRATA_REPO_OPTIMISATION_2026-07-31.md`. Superseded by this directory, and
**broken as it currently sits** — it resolves its prompts to `$REPO/prompt-run1.md`
(the repository root) while the files live in `xtrata-2.0/`. Kept for the record,
not for use.
