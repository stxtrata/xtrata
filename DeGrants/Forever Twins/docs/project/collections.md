# Collections

## Live (before the grant)

These run on the older v1 helpers (built with Rapha / Fak.fun) and don't count towards the new
collections. Addresses from `ft-harness/live-check/targets.mainnet.json`; state read live on
25 Sep 2026 (tip 9,060,018) with the registry reader (`results/registry-check.json`).

| Collection | Helper | Source | Twins | Fee | Finalised |
|---|---|---|---|---|---|
| Bitcoin Pepes | `SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.pepe-4ever-fakfun` | `SP16SRR777TVB1WS5XSS9QT3YEZEC9JQFKYZENRAJ.bitcoin-pepe` | 2,089 | 4 STX | no |
| LEO Cats | `SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.leo-fakfun-xtrata` | `SP2N959SER36FZ5QT1CX9BR63W3E8X35WQCMBYYWC.leo-cats` | 101 | 4 STX | no |
| Miami Degens | `SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.miami-degens-fakfun-xtrata` | `SP1SCEXE6PMGPAC6B4N5P2MDKX8V4GF9QDE1FNNGJ.miami-degens` | 1 | 4 STX | no |

Deployed code of all three matches the sha256 recorded in the registry.

## Tested with the templates (simnet)

All run on real archived contract source (boomcrypto/clarity-deployed-contracts@45a7af60). Each
address below was checked on 25 Sep 2026: the contract exists on mainnet and its archived source
matches the file in `ft-harness/contracts/legacy/` line for line (except `[simnet]` lines).

| Collection | Family | Group | Source contract | Asset name |
|---|---|---|---|---|
| Zombie Wabbits | Stacks Art | G1 | `SPJW1XE278YMCEYMXB8ZFGJMH8ZVAAEDP2S2PJYG.zombie-wabbits` | `zombie-wabbits` |
| Citadels | Stacks Art | G1 | `SPJW1XE278YMCEYMXB8ZFGJMH8ZVAAEDP2S2PJYG.citadels` | `citadels` |
| Funky Donuts | Stacks Art | G1 | `SPJW1XE278YMCEYMXB8ZFGJMH8ZVAAEDP2S2PJYG.funky-donuts` | `funky-donuts` |
| Blocks | Stacks Art | G1 | `SPJW1XE278YMCEYMXB8ZFGJMH8ZVAAEDP2S2PJYG.blocks` | `blocks` |
| The Guests | Gamma | G2 | `SP1CSHTKVHMMQJ7PRQRFYW6SB4QAW6SR3XY2F81PA.the-guests` | `the-guests` |
| Bitslimes | Gamma | G2 | `SP3RYGG161XJQ8MESCWBM7E3WS99AH4B1N8WE25CY.bitslimes` | `bitslimes` |
| Tigress | Gamma | G2 | TBD (not in the part of the archive listing that could be searched; only commission contracts referencing it were found) | `tigress` |
| Megapont Ape Club | Megapont | G2 | `SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.megapont-ape-club-nft` | `Megapont-Ape-Club` |
| Satoshibles | Megapont | G2 | `SP6P4EJF0VG8V0RB3TQQKJBHDQKEF6NVRD1KZE3C.satoshibles` | `Satoshibles` |
| Ordinal Pepe (added 25 Sep) | Gamma | G2 | `SP2ZY7ETKYAN1M7R4HWQ77Q4CVDVH8PVQ41XS0N0S.ordinal-pepe` | `ordinal-pepe` |
| Bitcoin Pepe, Leo Cats | Gamma | G2 | (already live) | |

Note: a different `blocks` and `citadels` also exist at `SP188283WAZZN1NR08EK34FAWGEK3ZACYBESJRBYH`
(with collection bids); they are not the Stacks Art collections.

The repo's screener also pins 28 sources for mechanical custody-risk flags (`npm run screen`).

## Research, 25 September 2026 (read-only)

Supply and URIs are live on-chain reads (`/v2/data_var`, `get-token-uri`). Art was fetched through
public IPFS gateways (Pinata, Filebase) or the project's own host. "Built" means the manifest
builder's own code (`manifest/lib.mjs`) fetched and hashed every token.

| Collection | Group | Supply (mint finished?) | Metadata / art hosted at | Resolves today? | Largest file seen | Frozen | Verdict |
|---|---|---|---|---|---|---|---|
| Megapont Ape Club | G2 | 2,500 (sold out, `last-id` 2500 = `APE-LIMIT`) | IPFS (`ipfs://QmRhkJ.../{id}`, art `ipfs://QmZjrC...`) | yes: all 2,500 built, 0 failures | 480,034 B (id 1153, GIF; 30 of 32 chunks) | no | **Pick** |
| Bitslimes | G2 | 1,361 (minted out, `last-id` 1362 > limit 1361) | IPFS (`ipfs://ipfs/QmahBF.../json/`, art `ipfs://ipfs/QmT6Df.../images/`) | yes for every token built (121 of 1,361); full build still to run | 196,090 B of 121 built (all 512x512 PNG) | no | **Pick** |
| Ordinal Pepe | G2 | 100 (minted out, `last-id` 101 > limit 100) | IPFS (`ipfs://ipfs/QmRFMu.../json/`, GIF art) | yes: all 100 built, 0 failures | 140,745 B (every token is the same GIF) | no | **Backup** (an edition: one GIF for all 100 tokens) |
| NYC Degens | G1 | 420 (minted out, `last-id` 420 = limit) | IPFS (`ipfs://QmayEq.../`, id mapped through `.conversion`; identity on every id sampled) | yes for every token built (183 of 420); full build still to run | 129,532 B of 183 built (all PNG) | n/a | **Pick** (G1; added to both family suites 25 Sep, passes) |
| Satoshibles | G2 | 5,000 (sold out) | Project server (`api.satoshibles.com`, `satoshibles.com/.../image.png`) | yes (ids 1, 5000) | ~150 KB (served as WebP under `.png`) | no | Not now: centralised host and content negotiation make the bytes depend on the client; 50 seeding calls |
| The Guests | G2 | 500 (minted out) | IPFS (`ipfs://ipfs/QmVumm.../`) | yes (id 1) | **907,785 bytes** (id 1, 1773x1773 PNG) | no | Not with the standard template: over 512 KB |
| Zombie Wabbits, Citadels, Funky Donuts, Blocks | G1 | 45 / 2,222 / 3,000 / 2,500 (counters at their caps) | One shared JSON per collection on `stacksart.com/assets/<name>.json` | **no: every one redirects to the Stacks Art homepage** | unknown | n/a | Not now: the on-chain metadata is gone, so a manifest cannot be built from the original source. Record as a preservation-risk finding; needs art recovery first |
| Fractal NFT | G2 | 18 of 112 minted | IPFS | not checked | | no | Not eligible: mint unfinished |
| Tigress | G2 | TBD | | | | | Address TBD |

## Milestone 1 selection

Recommended: **Megapont Ape Club (G2), Bitslimes (G2), NYC Degens (G1)**, with **Ordinal Pepe
(G2)** as backup.

| Collection | Supply | Largest file (<= 512 KB?) | Art hosted at | Resolves today? | Mint finished? | Est. seeding txs | Pick |
|---|---|---|---|---|---|---|---|
| Megapont Ape Club | 2,500 | 480,034 B (yes, 30 chunks) | IPFS | yes, all 2,500 | yes | 25 | 1 |
| Bitslimes | 1,361 | 196,090 B of 121 built (all 512x512 PNG) (yes) | IPFS | yes for every token built (121 of 1,361); full build still to run | yes | 14 | 2 |
| NYC Degens | 420 | 129,532 B of 183 built (all PNG) (yes) | IPFS | yes for every token built (183 of 420); full build still to run | yes | 5 | 3 |
| Ordinal Pepe | 100 | 140,745 B (yes) | IPFS | yes, all 100 | yes | 1 | backup |

Why these:
- Each family is covered by the v3 suite on its real contract source, and each archived source is
  byte-identical to the deployed contract (checked 25 Sep): Megapont and Gamma (G2), Degens (G1).
  That gives both templates a mainnet deployment.
- All art is on IPFS, resolves today, and fits the 512 KB single-transaction limit.
- Every mint is finished, so the record can be complete before finalising.
- Megapont's 2,489 PNGs are all under 9.1 KB (one chunk each); its 11 animated GIFs run from
  33 KB to 480 KB, the largest (id 1153) close to the limit.
- NYC Degens is the sister collection of the live Miami Degens, a natural next step for that
  community.

Caveats for Jim:
- Ordinal Pepe is an edition: all 100 tokens point to the same 140,745-byte GIF, so each twin
  would re-inscribe identical bytes (the core allows it). The spec's edition route (inscribe once,
  small per-token records) is the better fit; it isn't built. Use it only if a pick falls through.
- NYC Degens' `get-token-uri` goes through a `.conversion` lookup contract; it's an identity
  mapping (checked on-chain), and the builder reads each token's URI from the chain anyway
  (`metadataUri: "chain"`).
- None of these collections has frozen metadata; the manifest pins what the metadata points to at
  the snapshot. Record the snapshot block in each manifest.
- Public gateways rate-limit bulk reads. Build the final manifests through a dedicated gateway.
  During research Pinata's public gateway throttled (429) and Filebase timed out (504) on
  uncached files; one NYC Degens image (#122) returned 404 on Pinata but 200 on Filebase. The
  builder retries, then refuses rather than skipping a token.
- Bitslimes and NYC Degens were only partly built here (gateway throttling); their full builds
  run on Jim's machine with `npm run manifest:build`. Megapont and Ordinal Pepe were built in full.

Seeding takes one `seed-canonical` call per 100 tokens. Any token with art over 512 KB cannot
use the standard template.

## Third-party sponsor demo candidates (researched 25 Sep 2026)

Both contracts are byte-identical to the deployed source and pass the family suites
(`family-suite-v3` 537/537 including them). Art was built with the manifest builder in the
desktop app's browser.

| Collection | Group | Source | Supply | Built | Over 512 KB | Largest | Notes |
|---|---|---|---|---|---|---|---|
| See Yourself Out (SZN 2 by Boozy) | G2 (Gamma) | `SP3M05ETW09E98NNFMFHT1WND3ZRX9DV31TFC6DFW.see-yourself-out` | 100 (sold out) | 100/100, 0 failures | **12** (ids 1, 9, 12, 14, 24, 42, 60, 68, 75, 81, 82, 89) | 5,724,376 B (id 82, GIF) | 53 GIF, 47 PNG, all distinct. The 88 in-limit files total 2.43 STX in core fees. Metadata calls it "the first evolving art experiment on Stacks" and it isn't frozen. In-browser manifest sha256 (no snapshot, all 100): `3dfccd19...68991090` |
| Bitcoin Monkeys | G1 (Degens) | `SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.bitcoin-monkeys` | 2,500 (sold out) | sizes for 335 tokens (123 full builds + 212 size-only checks) | **42 of 335 (~12.5%)**, so roughly 260-370 across the collection | 1,432,911 B | PNGs, most 320-400 KB. `get-token-uri` goes through a `conversion` lookup that is the identity for ids 1-2500. Public gateways were very slow on this collection |

Neither can be preserved in full with the standard v3 template: `inscribe` uses the core's
single-transaction mint, which is capped at 512 KB (32 chunks).

### Option discussed: pre-inscribe the oversized files, then bind them

The Xtrata core already accepts large files through its multi-transaction upload
(`begin-inscription` -> `add-chunk-batch` -> `seal-inscription`, up to 32 MiB), with the same
rolling-hash check at seal. The idea: the owner inscribes the oversized files that way, moves
those Xtrata tokens into the helper, and the helper records them as already-inscribed twins
before finalisation. Everything else stays a normal sponsor inscription.

This **needs a contract change** (not made; Jim to decide):
- `seed-canonical` currently rejects entries over 512 KB (u215); it would accept them for tokens
  that will be pre-bound.
- A new owner-only, pre-finalisation `bind-preinscribed (token-id, xtrata-id)` that checks the
  core's recorded hash for `xtrata-id` equals the token's canonical `content-hash`, that the
  helper owns `xtrata-id`, and that the token isn't already bound; then writes the same
  `Bindings` entry `inscribe` would (twin in helper custody), with no fee.
- `inscribe` refuses tokens that are pre-bound (it already refuses bound tokens).
- New simnet tests for the path, including a wrong-hash bind being refused.

Estimated cost of the pre-inscription part (live core fee units: begin 0.1, seal 0.1, extra batch
0.1, chunk 0.001 STX):
- See Yourself Out, 12 files: about 6.6 STX in core fees over roughly 74 transactions.
- Bitcoin Monkeys, ~310 files of ~0.3-1.4 MB: about 0.23-0.43 STX each, roughly 70-130 STX in
  core fees and 1,200+ transactions.
