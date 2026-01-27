#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

if [ "$#" -lt 1 ] || [ "$#" -gt 2 ]; then
  echo "Usage: $(basename "$0") <source-folder> [new-folder]" >&2
  echo "Example: $(basename "$0") xtrata-1.0 xtrata-1.1" >&2
  echo "Example: $(basename "$0") xtrata-1.0  # auto-picks xtrata-1.1, xtrata-1.2, ..." >&2
  exit 1
fi

SRC="$ROOT_DIR/$1"
DEST="${2:-}"

if [ ! -d "$SRC" ]; then
  echo "Source folder not found: $SRC" >&2
  exit 1
fi

if [ -z "$DEST" ]; then
  SRC_NAME="$(basename "$SRC")"
  if [[ "$SRC_NAME" =~ ^(.+)\.[0-9]+$ ]]; then
    PREFIX="${BASH_REMATCH[1]}"
  else
    PREFIX="$SRC_NAME"
  fi

  next=1
  while :; do
    candidate="$ROOT_DIR/${PREFIX}.$(printf "%03d" "$next")"
    if [ ! -e "$candidate" ]; then
      DEST="$candidate"
      break
    fi
    next=$((next + 1))
  done
else
  DEST="$ROOT_DIR/$DEST"
fi

if [ -e "$DEST" ]; then
  echo "Destination already exists: $DEST" >&2
  exit 1
fi

rsync -a "$SRC/" "$DEST/"

printf "Cloned %s -> %s\n" "$SRC" "$DEST"
