#!/usr/bin/env bash
set -euo pipefail

CONTRACT_ID="SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v2-1-0"
WALLET="SPXGFH9JTKPF2TQZJ2AH7NSMMMXJ72VMGH8PR654"

LIMIT=50
OFFSET=0

# Be gentle with Hiro.
SLEEP_SECONDS=4
RATE_LIMIT_SLEEP=70

OUT_JSONL="xtrata-wallet-contract-history.jsonl"
OUT_TSV="xtrata-wallet-contract-history.tsv"

: > "$OUT_JSONL"
: > "$OUT_TSV"

printf "time\tfunction\tstatus\tresult\ttx_id\n" >> "$OUT_TSV"

echo "Scanning contract history:"
echo "  Contract: $CONTRACT_ID"
echo "  Wallet:   $WALLET"
echo "  Limit:    $LIMIT per request"
echo "  Sleep:    $SLEEP_SECONDS seconds between successful requests"
echo "  Retry:    $RATE_LIMIT_SLEEP seconds after rate-limit response"
echo ""

while true; do
  URL="https://api.hiro.so/extended/v1/tx?contract_id=${CONTRACT_ID}&limit=${LIMIT}&offset=${OFFSET}"

  echo "Fetching offset ${OFFSET}..."

  BODY="$(curl -sL "$URL" -H "Accept: application/json")"

  # Hiro sometimes returns plain text for rate limits, not JSON.
  if ! echo "$BODY" | jq empty >/dev/null 2>&1; then
    if echo "$BODY" | grep -qi "rate limit"; then
      echo "Rate limited. Waiting ${RATE_LIMIT_SLEEP}s, then retrying same offset..."
      sleep "$RATE_LIMIT_SLEEP"
      continue
    fi

    echo "Non-JSON response from Hiro at offset ${OFFSET}. Stopping."
    echo "$BODY" | head
    exit 1
  fi

  # JSON error object.
  if echo "$BODY" | jq -e '.error? // empty' >/dev/null; then
    MESSAGE="$(echo "$BODY" | jq -r '.message? // .error? // empty')"

    if echo "$MESSAGE" | grep -qi "rate limit"; then
      echo "Rate limited. Waiting ${RATE_LIMIT_SLEEP}s, then retrying same offset..."
      sleep "$RATE_LIMIT_SLEEP"
      continue
    fi

    echo "Hiro returned an error at offset ${OFFSET}:"
    echo "$BODY" | jq
    exit 1
  fi

  COUNT="$(echo "$BODY" | jq '.results | length')"

  if [ "$COUNT" -eq 0 ]; then
    echo "No more results. Done."
    break
  fi

  MATCH_COUNT="$(echo "$BODY" | jq --arg wallet "$WALLET" '
    [
      .results[]
      | select(.tx_type=="contract_call")
      | select(.sender_address==$wallet)
    ]
    | length
  ')"

  echo "  Page results: $COUNT, wallet matches: $MATCH_COUNT"

  echo "$BODY" \
  | jq -c --arg wallet "$WALLET" '
      .results[]
      | select(.tx_type=="contract_call")
      | select(.sender_address==$wallet)
      | {
          time: .burn_block_time_iso,
          block_height: .block_height,
          function: .contract_call.function_name,
          status: .tx_status,
          result: .tx_result.repr,
          tx_id: .tx_id,
          args: .contract_call.function_args
        }
    ' >> "$OUT_JSONL"

  echo "$BODY" \
  | jq -r --arg wallet "$WALLET" '
      .results[]
      | select(.tx_type=="contract_call")
      | select(.sender_address==$wallet)
      | [
          .burn_block_time_iso,
          .contract_call.function_name,
          .tx_status,
          .tx_result.repr,
          .tx_id
        ]
      | @tsv
    ' >> "$OUT_TSV"

  if [ "$COUNT" -lt "$LIMIT" ]; then
    echo "Final page reached. Done."
    break
  fi

  OFFSET=$((OFFSET + LIMIT))
  sleep "$SLEEP_SECONDS"
done

echo ""
echo "Saved:"
echo "  $OUT_TSV   - readable timeline"
echo "  $OUT_JSONL - compact detailed records with args"
echo ""

echo "Quick summary:"
awk -F'\t' '
  NR > 1 {
    total++;
    by_status[$3]++;
    by_func[$2]++;
    if ($3 != "success") failed++;
  }
  END {
    print "  Total wallet calls found: " total + 0;
    print "  Failed calls: " failed + 0;
    print "";
    print "  By status:";
    for (s in by_status) print "    " s ": " by_status[s];
    print "";
    print "  By function:";
    for (f in by_func) print "    " f ": " by_func[f];
  }
' "$OUT_TSV"

echo ""
echo "Failed calls:"
awk -F'\t' 'NR == 1 || $3 != "success" { print }' "$OUT_TSV" | column -t -s $'\t'

echo ""
echo "Begin/seal timeline:"
awk -F'\t' 'NR == 1 || $2 == "begin-inscription" || $2 == "seal-inscription" { print }' "$OUT_TSV" | column -t -s $'\t'
