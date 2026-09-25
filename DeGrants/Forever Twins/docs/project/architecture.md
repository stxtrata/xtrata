# Architecture

## Components

| Component | What it is | Status |
|---|---|---|
| Xtrata core | `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3`. Inscribes data on Stacks and mints the inscription NFT (asset `xtrata-inscription`). Provides `quote-single-tx-fee` and `mint-single-tx`. | Live on mainnet |
| Source collection | The existing NFT contract being preserved. Untouched. | Existing |
| Helper contract | One per collection. Holds the canonical record, mints twins through the core, runs swaps. | v1 live for 3 collections; v3 ready, not deployed |
| Manifest | Off-chain JSON listing every token's content hash, mime, size, token-uri. Its sha256 is stored on-chain at finalisation. | Builder, seeding plan and checker in `ft-harness/manifest/` |
| Registry | Public list of helpers and their state, read from `get-twin-interface` (v3) or the v1 getters. | v1 built: `ft-harness/registry/` (JSON, page, verifier); lists the 3 live v1 helpers |
| Resolver | Maps twins to originals via helper bindings. v3 keeps the same bindings tuple as v1/v2. | Exists |
| Preservation page | Holder-facing UI: inscribe, swap in, swap back. | Not built |
| ft-harness | Simnet tests, renderer, screener, read-only live-check. | In repo |

## Helper lifecycle

```
deploy ──> seed-canonical (x N, 100 per call) ──> finalize-canonical ──> open for use
            owner only, editable                   one-way; manifest hash   inscribe / swap
                                                   and count locked
```

- Nobody can inscribe before finalisation.
- After finalisation the record can never change, and every seeded token can be inscribed
  exactly once. When every token has a twin, inscribing ends by itself.
- Tokens minted after deployment are not covered. Only use collections whose mint has finished.

## Custody model

For each token there is at most one twin, and exactly one of the pair is inside the helper:

| State | Original | Twin | `xtrata-escrowed` |
|---|---|---|---|
| Inscribed, not swapped | with its holder | in the helper | true |
| Swapped in | in the helper | with its holder | false |

`get-custody-state` reads real ownership from both contracts and reports `consistent` or
`stranded`; viewers must show those states rather than trust the stored flag.

A **stray** is a token sitting in the helper that should not be there, e.g. an original sent
directly with the source's `transfer`. The helper cannot know who sent it. The owner can return
it via the time-locked rescue.

## Groups and routes

| Group | Source type | Difference |
|---|---|---|
| G1 | Plain owner transfer, no in-contract market | Base template |
| G2 | Source has its own listing market (`list-in-ustx` / `buy-in-ustx`) | Swap-in refused (u217) unless the source reports no listing before and after the deposit |

Other routes from the collection-families doc, not built yet: T0 preservation record (no custody,
no swaps), T1-E edition route, T2 owner-query adapter, T4 bespoke adapter. The v3 template is
the T1 standard route (profile tier S only).

## What gets verified where

- **The core checks the chunks against the hash (confirmed 25 Sep 2026 from the
  `xtrata-v3.2.3` source).** `mint-single-tx` -> `mint-single-tx-internal` folds every chunk
  through `process-chunk`, which (a) requires each chunk to be exactly the length implied by
  `total-size` (16,384 bytes for every chunk but the last) and (b) builds the Xtrata rolling
  hash `h0 = 32 zero bytes; h = sha256(h || chunk)`. It then asserts
  `run-hash == expected-hash` and fails with `u103` (`ERR-HASH-MISMATCH`) otherwise, or `u102`
  (`ERR-INVALID-BATCH`) for a wrong length or shape. The helper passes `content-hash`, `mime`,
  `total-size` and `token-uri` from the finalised canonical record, so a sponsor really does
  supply only the chunks: any other bytes make the whole transaction revert (no twin, no fee).
  Evidence: `family-suite-v3` F-1 checks on all 12 sources (forged same-length bytes -> u103,
  no binding, no STX moved; wrong length -> u102), and `acceptance-v2` T-series checks.
  The deployed mainnet source was compared with the repo copy on 25 Sep 2026: `process-chunk`,
  `mint-single-tx-internal`, `mint-single-tx`, `expected-chunk-length`, `valid-total-shape?`,
  `assert-single-tx-shape` and `commit-inscription` are identical, and the whole file differs
  only in the commented local/mainnet trait lines (lines 36-46).
- Caveats: `mime` is not checked against the bytes (it comes from the record, so it is only as
  right as the manifest); duplicate content is allowed (two tokens with identical art both
  mint; `get-id-by-hash` returns the first); single-transaction mints are capped at 32 chunks
  x 16,384 bytes = **512 KB**, which is where the per-token size limit comes from.
- The record's `content-hash` is therefore the **Xtrata rolling hash**, not a plain sha256 of
  the file. The manifest carries both: `xtrataHash` (seeded on-chain) and `sha256` (for anyone
  checking the file by ordinary means).
- The manifest hash on-chain lets anyone confirm the published manifest is the one that was
  finalised.
- The source collection usually has no on-chain art hash, so faithfulness rests on the published
  manifest being built from the collection's real art.
