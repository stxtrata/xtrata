#!/usr/bin/env bash
set -uo pipefail
REPO="$(git rev-parse --show-toplevel)"
BACKUP="$HOME/xtrata-backup-$(date +%Y%m%d-%H%M)"
LOG="$HOME/xtrata-audit-log-$(date +%H%M).txt"
exec > >(tee -a "$LOG") 2>&1
echo "=== started $(date) ==="

run_limit() {                      # run_limit <seconds> <command...>
  local secs=$1; shift
  "$@" & local pid=$!
  ( sleep "$secs"; kill -INT "$pid" 2>/dev/null
    sleep 20; kill -9 "$pid" 2>/dev/null ) & local wd=$!
  wait "$pid"; local rc=$?
  kill "$wd" 2>/dev/null
  return $rc
}

cp -a "$REPO" "$BACKUP" || { echo "BACKUP FAILED — aborting"; exit 1; }
echo "backup at $BACKUP"

cd "$REPO" || exit 1
{ git status --porcelain; git rev-parse HEAD; } > /tmp/xt-before.txt
echo "--- tree before ---"; cat /tmp/xt-before.txt

T='Read,Grep,Glob,Write,Bash(git log:*),Bash(git status:*),Bash(git diff:*),Bash(git show:*),Bash(git rev-parse:*),Bash(git rev-list:*),Bash(git merge-base:*),Bash(git branch:*),Bash(git remote:*),Bash(git fetch:*),Bash(git cat-file:*),Bash(git worktree:*),Bash(rg:*),Bash(ls:*),Bash(cat:*),Bash(wc:*),Bash(sort:*),Bash(uniq:*),Bash(head:*),Bash(mkdir:*)'

echo "=== run 1 start $(date) ==="
run_limit 1200 claude -p "$(cat "$REPO/prompt-run1.md")" --effort medium --max-turns 80 \
  --allowedTools "$T"
echo "=== run 1 exit $? at $(date) ==="

sleep 20

echo "=== run 2 start $(date) ==="
run_limit 4200 claude -p "$(cat "$REPO/prompt-run2.md")" --effort xhigh --max-turns 250 \
  --allowedTools "$T"
echo "=== run 2 exit $? at $(date) ==="

cd "$REPO" || exit 1
{ git status --porcelain; git rev-parse HEAD; } > /tmp/xt-after.txt
echo "--- tree diff (should show only the report) ---"
diff /tmp/xt-before.txt /tmp/xt-after.txt && echo "IDENTICAL"
git worktree list
echo "=== finished $(date) ==="
