# Verified facts

Things checked against the chain or the deployed source rather than remembered.
Each carries the date it was checked. Re-check before quoting any of it back to
them.

## How to re-check

```bash
# fee schedule, pause state, limits, allowlist
node xtrata-2.0/scripts/xtrata-state-snapshot.mjs --callers SPY8JZN46DRC0ZDQV7EKWPJY8644VTE8B5B9EHM3

# contract source, before citing any line number
curl -sS "https://api.hiro.so/extended/v1/contract/SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3" \
  | python3 -c "import sys,json; sys.stdout.write(json.load(sys.stdin)['source_code'])" \
  | diff - xtrata-2.0/contracts/live/xtrata-v3.2.3.clar && echo "matches chain"

# the derivation gate
npx vitest run src/lib/wallet/passkey/__tests__/derivation-cross-check.test.ts
```

**Cite line numbers only from `contracts/live/`.** There are nine copies of the
v3.2.3 source in the repo and the flowproof mirror is about 95 lines offset. We
were bitten by this once already.

## Fees, read 2026-08-04 at Stacks tip 8,702,017

```
single-tx-fee-unit     10000
upload-chunk-fee-unit   1000
begin-fee-unit        100000
upload-batch-fee-unit 100000
seal-fee-unit         100000
paused                 false
```

A one chunk article quotes **11,000 microSTX** single-tx.

**Staged fees are not spread evenly.** `begin` charges, uploads are free however
many batches, and `seal` charges the rest. The seal fee has a cliff every 32
chunks:

| Chunks | Batches | Staged total |
|---|---|---|
| 1 | 1 | 201,000 |
| 32 | 1 | 232,000 |
| **33** | **2** | **332,000** |
| 100 | 4 | 532,000 |

One extra chunk between rows two and three costs 100,000, not 1,000. Live
`quote-staged-fee` readings, not arithmetic.

## Fee guards, live in v3.2.3

`assert-valid-fee-update` runs on every fee setter:

| Guard | Value |
|---|---|
| Ceiling per fee unit | 1 STX, the transaction reverts above it |
| Most a fee can rise in one change | 2x |
| Most a fee can fall in one change | to one tenth |

This is the answer to issue #2 and Steve called it the answer he wanted.

## Idempotency, proved in simnet 2026-08-04

There is **no gate** on the same address re-inscribing identical bytes. Two token
ids, two fees, no error.

The guard that does exist keys on `{tx-sender, expected-hash}` and only fires
while a **staged session is open**, blocking the single-tx path for that sender.
It is not a content lock, and another sender is unaffected.

Three things the test turned up:

- `get-id-by-hash` always names the **first** token for a hash, never the latest.
- **`begin-or-get` is idempotent on the fee.** Re-calling it for a session you
  already own resumes and charges nothing, so a crashed uploader can retry safely.
- Chunks are keyed `{final-hash, creator, index}` and written with `map-set`, so
  a same-creator duplicate rewrites the same rows rather than storing a second
  copy. Second fee, but not second storage.

## Upload expiry

The constant is 4320 and every core comments it as "~30 days at 10-min block
cadence". That was true before Nakamoto.

**On live v3.2.3 it is about 15 hours.** The check uses `stacks-block-height`,
which now advances every ~12.5 seconds. Measured across 39,000 blocks on
2026-08-04: mean 12.55 s/block, range 13.2 to 18.4 hours per window.

**Fixed in the v3.2.4 candidate** by pegging to `burn-block-height`, so 4320 means
4320 Bitcoin blocks and 30 days again.

Either way, **an expired session cannot be resumed.** Both `add-chunk-batch` and
`begin-or-get` reject it. Recovery means purging indexes 0 to `total-chunks - 1`
in batches of 50 first. `xtrata-2.0/scripts/xtrata-abandon-upload.mjs` does it.

## Their mint attempts, mainnet 2026-08-04

Two landed, one burned.

| Token | Type | Size | Chunks | Protocol fee |
|---|---|---|---|---|
| 2974 | `text/html` | 30,737 | 2 | 12,000 |
| 2975 | `image/avif` | 22,799 | 2 | 12,000 |

Both reconstruct byte perfect and their hash chains re-verify. Fee maths exact.

The third, `0x87dc6267`, aborted with `u103` and burned **54,730 microSTX**. Same
bytes, same chunking as the retry. The only difference was the declared hash: they
sent a plain SHA-256 of the file where the contract wants the chained form. We
confirmed this by pulling their content back off chain and hashing it both ways.

Our own docs are correct on this, under "Incremental Hashing (Required)", so it
is a patterns entry for their repo rather than a docs fix on ours.

## Their artifacts, checked 2026-08-17

| | |
|---|---|
| Library | `stacks-passkey-wallet`, MIT, npm `0.2.2` |
| Vectors | `03f19fb`, `test/vectors/` — **four** vectors, five negative controls |
| Their verifier | imports nothing from `src/`, cross-checks `@stacks/wallet-sdk` and `bitcoinjs-lib` |
| #12 | in the **library** repo, pinned to `0.2.0`, surface locked with Skullcoin 8 Aug |

Their opening message says "43 vectors + 5 negative controls". The 5 is exact.
The file holds four and their own README says "re-derives all four vectors", so 43
is probably the assertion count. Worth settling, since they led with no rounding
up.

Their negative control #4 pins a real bug they shipped and fixed in 0.2.0:
testnet addresses derived at mainnet coin type but encoded with the testnet
prefix, producing `tb1…` addresses no standard wallet reproduces. Exactly the
class of failure the cross-check gate exists to catch.

## Outstanding on our side

**Their mainnet address `SPY8JZN46DRC0ZDQV7EKWPJY8644VTE8B5B9EHM3` is not
allowlisted.** Checked 2026-08-04, still `false`. Invisible while v3.2.3 is
unpaused, which is why their mints went through. It is the pause insurance they
asked for before the holiday.
