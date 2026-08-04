# Wizard Fleet — Round 1 Report

Scenario 1 of the test plan, executed on mainnet 2026-07-30 → 2026-07-31. This records what was proven, what it cost, and what it found.

## What was proven

**Scenario 1 — inscribe a tiny file.** Seven inscriptions on `xtrata-v3-2-3`, forming thread `t-permanence-001`:

| Position | Id | Wizard | Block | Function |
|---|---|---|---|---|
| 1 | #2922 | Archivist | 8,670,293 | `mint-single-tx` |
| 2 | #2923 | Skeptic | 8,670,309 | `mint-single-tx-recursive` |
| 3 | #2924 | Builder | 8,670,450 | `mint-single-tx-recursive` |
| 4 | #2925 | Archivist | 8,670,465 | `mint-single-tx-recursive` |
| 5 | #2926 | Skeptic | 8,670,664 | `mint-single-tx-recursive` |
| 6 | #2927 | Builder | 8,670,666 | `mint-single-tx-recursive` |
| manifest | #2928 | Archivist | 8,670,671 | `mint-single-tx-recursive`, 6 dependencies |

Every entry is one chunk, every protocol fee 11,000 µSTX, every citation verified against its parent's own on-chain bytes before signing.

**Two claims verified after the fact rather than asserted.** Walking `get-dependencies` back from #2927 yields `2927 → 2926 → 2925 → 2924 → 2923 → 2922` — the whole thread recoverable from chain without trusting the manifest, which is exactly what the manifest instructs. And the corrected walkability text is what actually got inscribed; the earlier wording, which the core cannot support, is absent from the permanent record.

## Cost

| | |
|---|---|
| Fleet at provisioning | 15.000 STX (3 × 5) |
| Fleet now | 14.713 STX |
| Total spent | **0.287 STX** for 7 permanent inscriptions |
| Per inscription | 0.041 STX (11,000 µSTX protocol + 30,000 µSTX miner) |

The protocol fee is flat for anything under one 16 KiB chunk, so the marginal cost of a *better* entry is zero. That is why the corpus is written rather than filler.

## What the round found

Seven defects, none of which any dry run or unit test surfaced. Each was invisible until something real happened.

1. **`inscribe.mjs` never loaded `.env.wizards`.** Provisioning told the operator to put keys there; the tool that needs them read only `process.env`. `--broadcast` would have refused with "no key" after doing everything right.
2. **Broadcast defaulted to the placeholder thread id.** `t-demo-0001` is written into the front matter *and* quoted by the manifest; the word "demo" would have been permanent in the first real entry.
3. **`make-wizards.mjs` did not run under Node at all.** `@scure/bip39@1.1.0` ships no `exports` map, so the extensionless wordlist import threw `ERR_MODULE_NOT_FOUND`. Vite's resolver had been papering over it — tests green, documented command broken.
4. **A strict 41-character address check would have rejected ~1 in 4 valid wallets.** Measured over 20,000 generated mainnet addresses: 41 chars 74.8%, 40 chars 24.7%, 39 chars 0.4%. c32check drops leading zero bytes.
5. **`--parent-quote` was unverified.** The fragment attributed to a parent was whatever the operator typed. In a corpus whose manifest claims every entry's self-description is checkable, this was the one element that was not.
6. **The plan header said `DRY RUN` on a real broadcast.** `formatPlan` hardcoded it and prints before the broadcast branch; the only contradiction was one line at the very bottom.
7. **The manifest gave an instruction the chain cannot support.** "Start at the lowest id and follow the edges forward" — but `get-dependencies` points backwards and the core keeps no reverse index. Caught only because the explorer showed a *dependency* rather than a parent-child link.

Defects 1–4 were found by the provisioning canary and the first manual mints. 5 was found by asking what could not be undone. 6 and 7 were found by reading real output rather than expected output.

## Two design corrections the round forced

**Entry titles.** All six entries shared one H1 taken from the subject, which in a gallery is six identical-looking items. Titles now come from each entry's own claim, abridged at a word boundary when a claim runs long, with the unabridged claim kept in the `## Claim` section that replies quote — so shortening a headline can never change what another entry cites.

**Boilerplate.** Roughly 40% of each entry was repeated scaffolding, including a standing note that appeared seven times as the last thing a reader saw. It moved to the manifest, stated once for the whole thread. Entries dropped ~24%; the argument is now the bulk of the file.

## The crash window, and why it took two passes

The runner writes intent before broadcasting, so a position with a txid is never re-broadcast. That covers the *easy* half. The dangerous crash is between signing and recording, where no txid exists and a forgetful runner broadcasts again — a second permanent, paid-for mint.

First pass: record the content hash, resolve it on resume via `get-id-by-hash`, halt if absent. Safe, but permanently ambiguous — an entry names the block it was written at, so a retry composes different bytes under a different hash and the orphaned intent can never be matched or cleared.

Second pass: also record the wallet and the nonce about to be signed. The asymmetry is the whole fix — `last_executed_tx_nonce` **below** the intended nonce is proof of absence, because nonces cannot confirm out of order; **at or above** proves nothing, because an unrelated send from the same wallet consumes a nonce too. Only a content-hash hit says the mint landed. Getting that backwards is the one way to double-mint, or to skip a position that never got written and leave a hole the manifest then cites.

## Verification posture

Every number in this report was read from chain, not from a transaction receipt. The distinction matters: a receipt says what was submitted, chain state says what happened. The runner verifies each position after confirmation, and `--status` reconciles the journal against chain independently.

## Coverage

| Scenario | Status |
|---|---|
| 1 — inscribe a tiny file | **Pass** |
| 2 — list on sponsored STX market | Not yet run |
| 3 — list on sponsored sBTC market | Not yet run |
| 4 — list on sponsored USDCx market | Not yet run |
| 5 — self-paid buy | Not yet run |
| 6 — sponsored buy via relayer | Not yet run |
| 7 — cancel a listing | Not yet run |
| 8 — buy sBTC listing, expected failure | Not yet run |
| 9 — relist at a new price | Not yet run |
| 10 — settlement | Not yet run |

Round 2 covers 2–10. See `WIZARD-ROUND-2-PLAN.md`.
