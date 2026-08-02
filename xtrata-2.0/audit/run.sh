#!/usr/bin/env bash
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1
BASE="$PWD"
REPO="$(git rev-parse --show-toplevel)"
LOG="$HOME/xtrata-audit-$(date +%Y%m%d-%H%M).log"
exec > >(tee -a "$LOG") 2>&1

AVAIL=$(df -k / | awk 'NR==2{print $4}')
if [ "$AVAIL" -lt 2000000 ]; then echo "under 2GB free — aborting"; exit 1; fi

cd "$REPO" || exit 1
PATCH="$HOME/xtrata-uncommitted-$(date +%Y%m%d-%H%M).patch"
git diff HEAD > "$PATCH"
echo "uncommitted work saved: $PATCH ($(wc -c < "$PATCH") bytes)"
{ git status --porcelain; git rev-parse HEAD; } > /tmp/xt-before.txt

run_limit() {
  local secs=$1; shift
  "$@" & local pid=$!
  ( sleep "$secs"; kill -INT "$pid" 2>/dev/null
    sleep 20; kill -9 "$pid" 2>/dev/null ) & local wd=$!
  wait "$pid"; local rc=$?
  kill "$wd" 2>/dev/null
  return $rc
}

T='Read,Grep,Glob,Write,Edit,MultiEdit,Bash(git log:*),Bash(git status:*),Bash(git diff:*),Bash(git show:*),Bash(git rev-parse:*),Bash(git rev-list:*),Bash(git merge-base:*),Bash(git branch:*),Bash(git remote:*),Bash(git fetch:*),Bash(git cat-file:*),Bash(git worktree:*),Bash(rg:*),Bash(ls:*),Bash(cat:*),Bash(wc:*),Bash(sort:*),Bash(uniq:*),Bash(head:*),Bash(mkdir:*)'

cap_for()    { case $1 in 1) echo 1200;; 2) echo 1500;; 3) echo 2400;; 4) echo 2400;; esac; }
effort_for() { case $1 in 1) echo medium;; 2) echo high;; 3) echo xhigh;; 4) echo xhigh;; esac; }
turns_for()  { case $1 in 1) echo 80;; 2) echo 120;; 3) echo 200;; 4) echo 200;; esac; }

PASSES=("$@")
[ "${1:-}" = "all" ] && PASSES=(1 2 3 4)
[ ${#PASSES[@]} -eq 0 ] && { echo "usage: ./audit/run.sh <1|2|3|4|all>"; exit 1; }

for p in "${PASSES[@]}"; do
  echo "=== pass $p start $(date) — effort $(effort_for "$p") ==="
  run_limit "$(cap_for "$p")" claude -p "$(cat "$BASE/audit/pass$p.md")" \
    --model opus --effort "$(effort_for "$p")" --max-turns "$(turns_for "$p")" \
    --allowedTools "$T"
  echo "=== pass $p exit $? at $(date) ==="
  [ ${#PASSES[@]} -gt 1 ] && sleep 20
done

cd "$REPO" || exit 1
{ git status --porcelain; git rev-parse HEAD; } > /tmp/xt-after.txt
echo "--- tree diff (report only) ---"
diff /tmp/xt-before.txt /tmp/xt-after.txt && echo "IDENTICAL"
git worktree list
echo "=== done $(date) ==="
