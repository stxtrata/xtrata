# Collection sizing for Forever Twins

Measured 2026-08-12 against mainnet. Every number here is either read from chain or
measured by fetching the collection's own art from the storage its `get-token-uri`
points at. Where a number is an extrapolation from a sample, it says so and gives
the sample size.

Reproduce with `scripts/measure-collection.mjs`.

## What "collection size" means here

A Forever Twin stores the source image **byte for byte** in Xtrata. That is not an
assumption: Miami Degen #406 is the one Miami Degen inscribed so far, its Xtrata
twin reports `total-size` = 126,772, and the PNG its token URI points at is exactly
126,772 bytes. The twin is the file, not a re-encode of it.

So the mineable total for a collection is `supply x mean image bytes`. Chunks are
variable-length `(buff 16384)`, so the last chunk is partial and there is no padding
to account for.

## The three live Forever Twin collections

| | Bitcoin Pepes | LeoCats | Miami Degens |
|---|---|---|---|
| Source contract | `SP16SRR777TVB1WS5XSS9QT3YEZEC9JQFKYZENRAJ.bitcoin-pepe` | `SP2N959SER36FZ5QT1CX9BR63W3E8X35WQCMBYYWC.leo-cats` | `SP1SCEXE6PMGPAC6B4N5P2MDKX8V4GF9QDE1FNNGJ.miami-degens` |
| Supply (`get-last-token-id`) | 2,089 | 10,000 | 420 |
| Inscribed (`get-inscribed-count`) | 2,089 (100%) | 101 (1.0%) | 1 (0.2%) |
| Mean bytes per item | 5,538 | 23,740 | 133,941 |
| Median bytes per item | 5,500 | 7,857 | 133,135 |
| Chunks per item | 1 | 1 for 83%, 6-10 for the rest | 8-9 |
| **Total mineable data** | **11.6 MB** | **237 MB** | **56.3 MB** |
| Still to inscribe | 0 | ~235 MB | ~56.2 MB |

### Where those per-item numbers come from

**Bitcoin Pepes** is finished, so the sizes are read straight off the twins. 56 twins
sampled via `get-inscription-meta`: mean 5,538 bytes, range 4,902-6,379, every one a
single chunk. The collection cost 11.6 MB of chain to preserve in full.

**LeoCats** was measured twice and the two agree, which is the useful part:

- 93 existing twins read from chain: mean 23,609 bytes, median 8,009, max 149,933.
- 200 source PNGs sampled from IPFS across the whole id range: mean 23,740 bytes,
  median 7,857, p90 95,521, max 112,524.

The two means differ by 0.6%. The distribution is bimodal: a typical LeoCat is
~7.8 KB and fits one chunk, but 17.5% of the collection is 30 KB or larger, up to
~112 KB. Those outliers carry most of the weight. The on-chain chunk mix confirms it:
of 93 twins, 77 are 1 chunk and 16 are 6-10 chunks.

Do not size LeoCats off the median. 10,000 x 7,857 would say 79 MB; the real figure
is ~237 MB.

**Miami Degens** has one twin, so the on-chain sample is a single point (126,772
bytes, 8 chunks). 20 source PNGs sampled from IPFS: mean 133,941, tight range
125,425-143,637. Miami Degens is the most uniform of the three and the heaviest per
item.

### Reading of these three

Bitcoin Pepes was cheap because the art is small. LeoCats is 20x the data of
Bitcoin Pepes despite being only 5x the item count, and Miami Degens is 24x the data
per item. The per-collection cost of Forever Twins is set almost entirely by how
large the original artist exported their PNGs, not by supply.

## What it costs

Two separate fees, and they behave differently.

**Xtrata protocol fee** is deterministic: `10,000 + 1,000 per chunk` microSTX for a
single-transaction mint, confirmed by `quote-single-tx-fee` on the live core.

| Payload | Chunks | Protocol fee |
|---|---|---|
| Bitcoin Pepe (5.5 KB) | 1 | 0.011 STX |
| LeoCat, typical (8 KB) | 1 | 0.011 STX |
| LeoCat, large (95 KB) | 6 | 0.016 STX |
| Miami Degen (127 KB) | 8 | 0.018 STX |
| 512 KiB, the single-tx ceiling | 32 | 0.042 STX |

Anything over 512 KiB drops out of single-transaction minting into the staged path,
which is much more expensive per item. A 1.07 MB file quotes at 0.432 STX
(`begin` 0.1 + `seal` 0.332) and needs 5 transactions instead of 1.

**Stacks miner fee** is the larger and more variable cost, and it is the one lever
worth controlling. Measured from the actual `inscribe` transactions:

| Helper | Median miner fee | Note |
|---|---|---|
| `pepe-4ever-fakfun` | 0.0064 STX (n=49) | scripted, low fee rate |
| `leo-fakfun-xtrata` | 0.207 STX (n=18) | wallet default estimation |
| `miami-degens-fakfun-xtrata` | 0.321 STX (n=1) | wallet default estimation |

That is a 32x spread on the same kind of work. Finishing LeoCats at the Pepes fee
rate is roughly 65 STX of miner fees; at the rate the LeoCats claims have actually
been paying, it is roughly 2,000 STX. If we ever sponsor a collection ourselves, fee
strategy matters more than payload size.

Full-collection protocol fees, for reference: LeoCats ~120 STX for all 10,000,
Miami Degens ~7.8 STX for all 420. The helper's own `inscribe-fee` (4 STX for
LeoCats, 3 STX for Bitcoin Pepes after the free threshold) is a campaign choice and
sits on top of both.

## Crash Punks: inscribe the parts, not the picture

### Why the straight copy does not work

| | Value |
|---|---|
| Contract | `SP3QSAJQ4EA8WXEDSRRKMZZ29NH91VZ6C5X88FGZQ.crashpunks-v2` |
| Supply on chain | 5,754 (Gamma shows 5,633 indexed items, 9,216 minted originally) |
| Image format | 1024x1024 RGBA PNG |
| Mean bytes per item | 684,724 (n=8) |
| **Total as a straight copy** | **~3.94 GB** |
| Single-tx eligible | No. 1.07 MB is 66 chunks, the cap is 32 |
| Protocol fee per item | 0.432 STX staged, vs 0.011 for a 1-chunk item |
| Transactions required | ~5 per item, ~29,000 total |

So a byte-for-byte Crash Punks twin is ~2,500 STX in protocol fees alone, before
miner fees on 29,000 transactions, to put 3.94 GB on chain. It is the wrong shape
for the collection.

### The parts version

Crash Punks is a layered generator collection. The metadata proves it: 19 ordered
trait categories, with explicit paint order baked into the names — `Background`,
`Back Accessory`, `Outfit Back`, `Headgear Back`, `Neck`, `Head`, `Outfit Front`,
`Headgear Front`, and so on. Empty string means "no layer". From 150 sampled tokens:

| Trait | Distinct values seen |
|---|---|
| Outfit Front | 39 |
| Mouth | 29 |
| Eyes | 20 |
| Back Accessory | 16 |
| Background / Mohawks | 14 each |
| Outfit Back / Hair / Eyegear | 13 each |
| Neck / Headgear Front | 12 each |
| Head / Side Head Markings | 10 each |
| the remaining 6 categories | 3-7 each |

227 distinct non-empty values in a 150-token sample. A full pass would find the rare
ones too; call the real library 300-450 unique layer assets.

That is the whole collection. Instead of 5,754 flattened pictures you inscribe:

1. **The layer library**, once. 300-450 transparent PNGs. Even at a generous 40 KB
   each that is 12-18 MB, and layers that are mostly transparent compress far below
   the flattened composite.
2. **The renderer**, once. One HTML/JS inscription that reads a recipe and composites
   the layers in paint order onto a canvas.
3. **One tiny recipe per token.** A document naming 19 layer inscription ids. Well
   under 1 KB, so 1 chunk, so 0.011 STX and one transaction.

Total: roughly **15-20 MB instead of 3.94 GB**, and 5,754 single-chunk transactions
instead of 29,000 staged ones. Two orders of magnitude.

### Xtrata already has the primitive

This does not need a new core contract. `xtrata-v3-2-3` ships:

- `mint-single-tx-recursive(expected-hash, mime, total-size, chunks, token-uri, dependencies)`
  — mint a small payload that declares up to 50 dependency inscription ids.
- `seal-recursive(expected-hash, token-uri, dependencies)` for the staged path.
- `InscriptionDependencies` map plus `get-dependencies(id)`, so the layer set is
  on-chain, queryable, and permanent.

One detail matters a lot here: `validate-dependencies` only checks that each
dependency **exists** (`dep-exists?` is a lookup in `InscriptionMeta`). It does not
check ownership. `validate-parents` is the one that requires `tx-sender` to own the
referenced tokens, and parents are a separate argument. So a shared layer library can
be minted once, held anywhere, and depended on by all 5,754 twins with no ownership
juggling and no per-twin approval.

19 layers per token is comfortably inside the 50-dependency limit.

### The Forever Twin helper barely changes

The helper contracts are already the right shape. Looking at
`leo-fakfun-xtrata.clar`: `inscribe` calls `MASTER mint-single-tx`, stores a
`Bindings` entry, and `swap-nft-for-xtrata` / `swap-xtrata-for-nft` only move token
ids around. None of the escrow logic touches the content.

A recursive variant needs three changes:

1. `inscribe` calls `mint-single-tx-recursive` instead of `mint-single-tx`, taking a
   `dependencies (list 50 uint)` argument.
2. Add a `set-layer-registry` / `get-layer-registry` so the layer ids are a fixed,
   finalisable part of the contract rather than caller-supplied. Otherwise a caller
   could point their twin at whatever layers they liked.
3. `CanonicalHash` now pins the **recipe** hash, not the picture hash. Same
   mechanism, different object.

Escrow, swap, fee, discount, and finalisation all stay exactly as they are. The
switchable "either the original pointer or the Xtrata token" property the user asked
about is untouched, because it never depended on what the content was.

### The honest risks

**Point 3 above is the real change of meaning, and it should be stated out loud.**
Today a Forever Twin's canonical hash proves "this is that exact file". A recursive
twin's hash proves "this is that exact recipe, and here are the exact layers it
draws". Those are both strong claims, but they are not the same claim, and the
campaign copy has to be honest about which one it is making. A recomposed punk is
*a faithful reconstruction*, not *the original file*, unless the render is proven
byte-identical.

**Pixel-exactness needs proving, not assuming.** If the original 1024x1024 PNGs were
produced by straight alpha compositing of the same layers at the same resolution,
byte-identical output is achievable and should be verified by rendering all 5,754 and
diffing against the originals. If the generator applied any global pass — colour
grading, a background blur, a re-encode, resampling — the reconstruction will look
right and hash differently. Run the diff before promising anything. Publish the
result either way; "5,754 of 5,754 render pixel-identical" is a far better claim than
anything marketing could write.

**The layers have to exist.** This is the actual blocker. The user built the
collection in a generator but does not think they still have the files. Options, in
order of preference: recover the original generator assets; get them from grace.btc
or Risidio, who made and deployed it; or reconstruct layers by differencing rendered
tokens, which is a real image-processing project and will not be clean for
overlapping or anti-aliased layers.

**The renderer is an inscribed app** and inherits the three known constraints:
contract calls need a host bridge, the Hiro rewrite path is HTML-only, and
`document.currentScript` will boot a bundle twice. Those are all invisible in local
dev, so the renderer needs verifying on a static serve and then on-chain, not just
locally.

### Verdict

Realistic, and the most interesting thing on this list. The contract primitive exists
and is live, the helper change is small and touches nothing about escrow, and the
saving is ~200x. It is gated on one non-technical thing: getting the original layer
assets. Worth asking grace.btc / Risidio before scoping anything else.

It is also a better story than the flattened twins. "We put the collection on chain"
is fine. "We put the *generator* on chain, and now every punk regenerates itself from
permanent parts" is the thing people will repost.

## Other Stacks collections worth a Forever Twin

Ranked by lifetime marketplace volume (from Gamma's public index), with total
mineable data measured the same way as above. 8 images sampled per collection unless
noted.

| Collection | Volume (STX) | Supply | Mean bytes | **Total data** | Chunks/item |
|---|---|---|---|---|---|
| Crash Punks v2 | 472,721 | 5,754 | 684,724 | 3.94 GB | 42 (staged) |
| Wasteland Apes | 251,253 | 10,000 | 6,482 | **64.8 MB** | 1 |
| Mutant Monkeys | 220,928 | 4,639 | *unreachable* | *unknown* | - |
| LeoCats | 123,185 | 10,000 | 23,740 | 237 MB | 1-10 |
| The Guests | 99,941 | 500 | 659,855 | 330 MB | 41 (staged) |
| Stacks Invaders | 32,671 | 3,494 | *already on chain* | *not a twin candidate* | - |
| Crash Punks v1 | 27,264 | 5,720 | *unreachable* | *unknown* | - |
| Bitcoin Bulls OG | 11,086 | 400 | 1,688 | **0.7 MB** | 1 |
| Bitcoin Badgers | 10,828 | 1,048 | 1,374,192 | 1.44 GB | 84 (staged) |
| Miami Degens | 9,995 | 420 | 133,941 | 56.3 MB | 8 |
| Bitcoin Pepes | 8,384 | 2,089 | 5,538 | 11.6 MB | 1 |
| SpaghettiPunk Club | 3,026 | 1,274 | 954,982 | 1.22 GB | 59 (staged) |
| Cool Ape | 1,083 | 300 | 117,582 | 35.3 MB | 8 |
| Smoke Ethereals | 992 | 508 | 1,236,418 | 628 MB | 76 (staged) |
| STACKANIME | 715 | 687 | 629,598 | 433 MB | 39 (staged) |
| Stacks Wizards | 9 | 2,100 | 244,195 | 513 MB | 15 |
| Metaboy | not ranked | 4,155 | 1,907,144 | 7.92 GB | 117 (staged) |
| The Explorer Guild | not on Gamma | 10,000 | 1,408,560 | 14.1 GB | 86 (staged) |

Metaboy is worth a transferability check before anything else: Gamma displays it as
"Metaboy - Soulbound", but the deployed contract does expose a public `transfer`, so
either the name is stale or the restriction lives inside the function body. That
check matters generally, not just here — the whole escrow model depends on the
original NFT being transferable into the helper, so confirm it per collection.

### The two to build first, and pay for ourselves

These are the sponsored experiments: build the helper contract, inscribe the entire
collection at our own cost, and use the finished thing as the reference
implementation. Both are small enough that "we did the whole collection" is a
sentence we can actually say.

**Wasteland Apes** — `SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.wasteland-apes-nft`

The standout by a wide margin. Second-highest lifetime volume on Stacks at
251,253 STX and 10,000 items, and the whole collection is only 64.8 MB because the
art is ~6.5 KB per ape. Every item fits one chunk.

| | |
|---|---|
| Xtrata protocol fees, all 10,000 | ~110 STX |
| Miner fees at the Pepes rate (0.0064 STX) | ~64 STX |
| Miner fees at wallet-default rate (0.21 STX) | ~2,100 STX |
| Transactions | 10,000, all single-tx |

The miner fee is the whole budget question, and it is ours to control. Script the
run at a chosen fee rate rather than letting a wallet estimate each one, and the
full collection lands for under 200 STX. This is the best popularity-per-byte on
Stacks and the strongest candidate for a fully-sponsored twin.

Contract checks passed: public `transfer`, so escrow works, and no on-chain art
rendering, so a twin is genuinely adding permanence rather than duplicating it. Note
that `set-base-uri` and `set-contract-uri` are still live — `freeze-metadata` exists
but `metadata-frozen` reads `false` as of 2026-08-12, so the pointer to the art can
still be changed by the admin. That is a fair and factual part of the pitch.

**Bitcoin Bulls OG** — `SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.byzantion-bitcoin-bulls`

Almost free, and the right one to do *first* because it is a complete end-to-end run
in an afternoon. 400 items at 1,688 bytes each is 0.7 MB for the entire collection.

| | |
|---|---|
| Xtrata protocol fees, all 400 | ~4.4 STX |
| Miner fees at the Pepes rate | ~2.6 STX |
| Transactions | 400, all single-tx |

Lifetime volume is lower at 11,086 STX, so it is not the headline. It is the
rehearsal: same helper contract, same canonical-hash seeding, same swap flow, at a
cost where a mistake is free. Note the same deployer address as Wasteland Apes —
one conversation may open both.

Contract checks passed: public `transfer`, no on-chain art rendering, and no
`set-base-uri` at all, so the token URI is fixed for good. The only exposure is IPFS
pinning, which is exactly the gap a twin closes.

Suggested order: Bitcoin Bulls OG end-to-end to prove the pipeline, then Wasteland
Apes as the flagship. Both need the founder conversation first; sponsoring a
collection without the team is not a thing we should do.

**Stacks Invaders is off this list** — its art is already generated on chain. See
the next section.

Everything at 500 KB+ per item — Crash Punks, The Guests, SpaghettiPunk, Bitcoin
Badgers, Smoke Ethereals, The Explorer Guild — is in staged-mint territory and is
only worth doing as a parts/recursive twin, if it is a generator collection at all.

## Stacks Invaders: already on chain, so not a twin

`SPV8C2N59MA417HYQNG6372GCV0SEQE01EV4Z1RQ.stacks-invaders-v0` renders its own art.
`get-token-svg(token-id)` returns a complete SVG assembled inside the contract from a
`base-model` table, a `colour-code` table, and the Bitcoin block height the token was
minted against. The IPFS token URI is a convenience mirror, not the source of truth.

**The 100 MB figure in the first version of this table was wrong.** It measured the
IPFS PNG render, which is not the artwork. The real numbers:

| | Value |
|---|---|
| On-chain SVG per token | 953 bytes mean (n=8, range 849-1,092) |
| Whole collection, flat | **3.33 MB** |
| Chunks per item | 1 |
| Xtrata protocol fees for all 3,494 | ~38 STX |

There is no permanence gap here, so there is no Forever Twin to build. But there is
still something worth doing, for two reasons.

**It is already the parts architecture.** Everything the Crash Punks proposal wants
to build, Stacks Invaders already is: a small model library, a colour table, and a
per-token recipe that is literally one number. `block-digit-3` is a two-character
slice, so there are at most 100 models at up to 3 KB each — a parts library under
300 KB for a 3,494-piece collection. Recreating it on Xtrata as a recursive
inscription set is the cleanest possible demonstration of `mint-single-tx-recursive`,
and unlike Crash Punks the layers are not lost, they are readable from the contract
right now.

Worth being straight about the economics though: at 953 bytes each token already fits
one chunk, so the recursive version saves no fees and no transactions. It goes from
3.33 MB to roughly 1 MB. The reason to do it is that the generator becomes the
artefact, not that it is cheaper.

**On chain does not mean immutable.** `model-set`, `colour-set` and
`model-special-set` are public and gated only on `tx-sender` being the artist address
or the deployer. None of them checks `metadata-frozen` — that flag guards
`set-base-uri` and nothing else, and as of 2026-08-12 it reads `false` anyway. So the
artwork the contract renders today can be rewritten by two principals at any time,
and there is no function in the contract that can stop it.

That is not an accusation; it is an ordinary admin capability and the artist
presumably has no intention of using it. But it is a real and different permanence
argument from the one Forever Twins usually makes. Not "your art will disappear" but
"your art can be edited, and nothing in the contract can prevent it". An Xtrata
inscription is a hash-pinned snapshot of the collection exactly as it renders today,
which is a thing the source contract structurally cannot offer.

Approach for this one is a port or a mirror, not a twin: no escrow, no swap, because
the original is not at risk of vanishing. Worth a separate conversation with the
artist about what they would actually want it to mean.

### Two collections whose art is already failing

These are worth a separate look, because they are the campaign's own argument
happening in public.

**Crash Punks v1** (5,720 items, 27,264 STX volume) points at
`gaia.blockstack.org/hub/15jk6bTU1rvvLa5QfhvthKWPxJtwN6XkTP/...`. Every request today
returned Cloudflare error 1016 (origin DNS failure), including the root hub path.
Gamma still renders the collection because it holds cached IPFS copies at
`Qmb84Uca...`, the same CID Crash Punks v2 uses — so the art is recoverable, but the
pointer written into the contract is not currently resolving.

**Mutant Monkeys** (4,639 items, 220,928 STX volume — third-highest on the list)
points at an Oracle Cloud ORDS endpoint,
`w6d0eyjkea1lvhl-pq.adb.uk-london-1.oraclecloudapps.com/ords/cs/metadata/mutant_monkeys/{id}.json`.
The host resolves and answers, but every id tested (0, 1, 2, 100, 4000) returns a
structured 404. The metadata route is gone. Gamma has cached IPFS CIDs per token, so
recovery is possible from the index rather than from the collection's own pointer.

Both need re-checking before anything is said publicly — a failed read is not proof
of permanent loss, and a 530 could be a bad day. But if these hold, Mutant Monkeys in
particular is a 220,000 STX collection whose on-chain pointer to its own art no
longer works, and that is the Forever Twins pitch without any embellishment.

## Caveats

- **Measure the artefact, not the mirror.** Stacks Invaders was first sized at 100 MB
  off its IPFS PNGs; the real art is a ~950-byte SVG the contract renders itself, and
  the whole collection is 3.33 MB. Before sizing any collection, read the contract's
  public functions and check for a `get-token-svg`-style renderer. `get-token-uri`
  pointing at IPFS does not mean IPFS holds the artwork. Wasteland Apes and Bitcoin
  Bulls OG have both been checked and have no on-chain renderer; the rest of the
  survey table has not.
- Per-item means for the survey table are 8-sample estimates and will move a few
  percent. The three live FT collections are measured much more heavily (56, 93 and
  200 samples) and should be treated as firm.
- Crash Punks supply differs by source: `get-last-token-id` says 5,754, Gamma's index
  says 5,633 items, and the mint was 9,216. The v1 to v2 migration explains the gap.
  Confirm which population a campaign is actually addressing before quoting a number.
- Miner fee estimates assume current network conditions and the fee rate chosen at
  submit time. See the 32x spread above.
- Megapont Ape Club and Satoshibles were not measured; the contract ids tried did not
  resolve. pixANIME was rate-limited out of the supply pass.
