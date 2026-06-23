#!/usr/bin/env bash
# Refresh the linked Xtrata knowledge base (docs, XIPs, agent files) from the
# sibling Xtrata repo, so Huge Sphinx / Xtrata Agent 1 always has current facts.
# Markdown only — node_modules, zips, and the review-pack bloat are excluded.
#
#   bash scripts/sync-xtrata-knowledge.sh
#
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"        # project root (Huge-Sphinx)
SRC="$(cd "$HERE/../xtrata-1.0" 2>/dev/null && pwd || true)"   # sibling Xtrata repo
DEST="$HERE/xtrata-knowledge"

if [ -z "${SRC:-}" ] || [ ! -d "$SRC/docs" ]; then
  echo "✗ Could not find the Xtrata repo at $HERE/../xtrata-1.0"
  echo "  If your Xtrata folder lives elsewhere, edit SRC at the top of this script."
  exit 1
fi

mkdir -p "$DEST"
rsync -a --delete --prune-empty-dirs \
  --exclude='node_modules' --exclude='*.zip' --exclude='xma-v1_4-review-pack' \
  --include='*/' --include='*.md' --exclude='*' \
  "$SRC/docs/" "$DEST/docs/"
cp "$SRC/XTRATA_AGENT_SKILL.md" "$DEST/XTRATA_AGENT_SKILL.md"
cp "$SRC/AGENTS.md" "$DEST/AGENTS.md"

echo "✓ Synced Xtrata knowledge → $DEST"
echo "  $(find "$DEST" -name '*.md' | wc -l | tr -d ' ') markdown files · XIPs: $(ls "$DEST/docs/xips/"XIP-*.md 2>/dev/null | wc -l | tr -d ' ')"
