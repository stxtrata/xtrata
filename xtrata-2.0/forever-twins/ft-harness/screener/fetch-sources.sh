#!/usr/bin/env bash
# Re-fetch archived sources listed in sources.txt into screener/sources/.
# ARCHIVE mode (default): pinned boomcrypto mirror commit - reproducible.
# LIVE mode: FT_SOURCE_MODE=live fetches the deployed source from a Stacks node
#   (FT_API, default https://api.hiro.so). Use live-check.mjs to compare the two.
set -euo pipefail
cd "$(dirname "$0")"
MODE="${FT_SOURCE_MODE:-archive}"
COMMIT="45a7af60288ae72eb36592a9c428e41034c04367"
API="${FT_API:-https://api.hiro.so}"
mkdir -p sources
grep -v '^#' sources.txt | while read -r addr name; do
  [ -z "${addr:-}" ] && continue
  if [ "$MODE" = live ]; then
    curl -sf ${HIRO_API_KEY:+-H "x-api-key: $HIRO_API_KEY"} "$API/v2/contracts/source/$addr/$name?proof=0" \
      | python3 -c 'import json,sys; sys.stdout.write(json.load(sys.stdin)["source"])' > "sources/$name.clar" && echo "live    $addr.$name"
    sleep 1.2
  else
    curl -sf -o "sources/$name.clar" "https://raw.githubusercontent.com/boomcrypto/clarity-deployed-contracts/$COMMIT/contracts/$addr/$name.clar" && echo "archive $addr.$name"
  fi
done
