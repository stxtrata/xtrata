# How many Stacks collections can actually get a Forever Twin?

Measured 17 August 2026. Two samples: a 32-contract static analysis of NFT contract
source fetched from mainnet, and the 19-collection art measurement in
`COLLECTION-SIZING.md`.

**Headline: the contract interface is not the constraint. The artwork is.**

---

## 1. What the helper actually requires

Worth stating plainly, since the live helpers were written by Rapha and the
requirements have never been written down.

The helper calls exactly two functions on the source collection.

**`get-owner (uint)`**, in `inscribe`, to prove the token exists:

```clarity
(asserts! (is-some (unwrap! (contract-call? SOURCE get-owner token-id) ERR-NO-SUCH-TOKEN))
  ERR-NO-SUCH-TOKEN)
```

**`transfer (uint principal principal)`**, in the swap functions, to move the original
into and out of escrow:

```clarity
(as-contract? ((with-nft SOURCE "leo-cats" (list id)))
  (try! (contract-call? SOURCE transfer id current-contract recipient)))
```

Both are SIP-009. That is the whole contract-level requirement. It also needs the NFT
asset name as a compile-time literal, which is why each helper is a per-collection
clone rather than a factory.

Everything else is about the artwork: can it be fetched, and how big is it.

---

## 2. Contract compatibility: effectively universal

32 mainnet NFT contracts, source fetched and statically analysed. Sample is the NFT
contracts held across three active wallets plus every collection named in
`COLLECTION-SIZING.md`.

| Requirement | Pass |
|---|---|
| Exactly one `define-non-fungible-token` (gives the asset name) | 32/32, 100% |
| `get-owner` read-only | 32/32, 100% |
| `transfer` public | 32/32, 100% |
| `get-token-uri` read-only | 32/32, 100% |
| `get-last-token-id` read-only | 32/32, 100% |
| **All five** | **32/32, 100%** |

Not a single contract in the sample fails the structural test. SIP-009 is doing its
job, and the sample includes airdrops, BNS-V2, vouchers, one-off art contracts and
major collections. Assume near-total contract-level compatibility.

### The one contract-level thing that still needs a per-collection check

**5 of 32 reference `contract-caller` inside `transfer`.** BNS-V2, crashpunks-v2,
stSTXvoucher, aibtcdev-airdrop-1 and bitcoin-faces-airdrop. Escrow runs the transfer
inside `as-contract?`, which changes what `contract-caller` resolves to, so a
`contract-caller` based authorisation check can reject a transfer that a `tx-sender`
check would allow. That does not mean those five fail. It means they cannot be assumed
to work and need one testnet transfer each to confirm.

Zero contracts in the sample gate on `is-standard`, which would have blocked contract
principals from holding the NFT and killed escrow outright. That was the failure mode I
expected to find and it is not there.

Three carry restriction language in `transfer`: BNS-V2 mentions transferability, and
the two Xtrata cores have a pause flag. Nothing resembling a soulbound collection
turned up, though `COLLECTION-SIZING.md` already flags Metaboy as displaying as
"Soulbound" on Gamma while exposing a public `transfer`, so the label and the code can
disagree in either direction. Check per collection.

---

## 3. Artwork: this is where collections actually fail

From the 19 collections measured in `COLLECTION-SIZING.md`, classified by what a twin
would actually cost.

| Category | Count | Share |
|---|---|---|
| Art unreachable today | 2 | 11% |
| Already fully on chain, no twin needed | 1 | 5% |
| Single-transaction viable, 32 chunks or fewer | 8 | 42% |
| Needs the staged path, over 512 KiB per item | 8 | 42% |

Unreachable: Mutant Monkeys and Crash Punks v1. Already on chain: Stacks Invaders.

Of the 16 that are genuine twin candidates, **exactly half are cheap and half are
expensive**. The split is set almost entirely by how large the original artist exported
their images, not by supply.

### The eight cheap ones, and what preserving all of them in full would cost

| Collection | Supply | Chunks/item | Protocol fee, whole collection |
|---|---|---|---|
| Wasteland Apes | 10,000 | 1 | ~110 STX |
| LeoCats | 10,000 | 1 to 10 | ~120 STX |
| Stacks Wizards | 2,100 | 15 | ~53 STX |
| NarcotiX | 2,407 | 3 | ~31 STX |
| Bitcoin Pepes | 2,089 | 1 | ~23 STX (done) |
| Miami Degens | 420 | 8 | ~8 STX |
| Cool Ape | 300 | 8 | ~5 STX |
| Bitcoin Bulls OG | 400 | 1 | ~4 STX |

About **354 STX of protocol fees for roughly 27,700 items across eight complete
collections.** Miner fees at the scripted rate observed on the Pepes helper (0.0064
STX) add about 177 STX. So **preserving eight entire collections costs on the order of
530 STX** if the fee rate is controlled rather than left to wallet estimation.

That last point matters more than payload size. Observed miner fees across the three
live helpers vary by 32 times, from 0.0064 STX where the run was scripted to 0.321 STX
where a wallet estimated it. Finishing LeoCats costs about 65 STX scripted or about
2,000 STX at wallet defaults.

### The eight expensive ones

Crash Punks v2 at 3.94 GB, The Guests at 330 MB, Bitcoin Badgers at 1.44 GB,
SpaghettiPunk Club at 1.22 GB, Smoke Ethereals at 628 MB, STACKANIME at 433 MB,
Metaboy at 7.92 GB, The Explorer Guild at 14.1 GB.

Above 512 KiB an item drops out of single-transaction minting into the staged path,
which is several transactions and roughly forty times the protocol fee per item. The
Explorer Guild at 10,000 items and 1.4 MB each would be thousands of STX and tens of
thousands of transactions. It is not preservable as a straight copy at any sane cost.

`COLLECTION-SIZING.md` already works through the alternative for Crash Punks:
inscribe the component parts recursively rather than the flattened picture, which
Xtrata already has the primitive for via `mint-single-tx-recursive`. That is a real
route for generative collections but it is per-collection work, not something a
self-serve tool does unattended.

---

## 4. The number depends on what you count

This is the honest answer to "what percentage".

**By collection, counting only whether a twin is technically possible: near 100%.**
The contract interface almost never blocks it.

**By collection, counting whether it is affordable as a straight copy: about half.**
8 of 16 candidates in the measured sample sit inside single-transaction minting.

**By collection, counting what a self-serve tool can do unattended: about half again,**
because the staged path, recursive part-based inscription and dead-art recovery all
need judgement.

**By bytes, counting how much of the ecosystem's art could realistically be saved:
a few per cent.** The 19 measured collections hold roughly 31 GB between them, and
Metaboy plus The Explorer Guild alone are 22 GB of that, 71 per cent. The collections
that are cheap to preserve are a decent number of collections but a small fraction of
the total data.

Both framings are true and they support different sentences. "Most Stacks collections
can have a Forever Twin" is defensible. "Most Stacks NFT art can be preserved" is not.

---

## 5. Why the three live ones worked

Nothing special about their contracts. All three are ordinary SIP-009.

They worked because the art is small. Bitcoin Pepes averages 5,538 bytes, one chunk per
item, which is why the whole collection cost 11.6 MB and about 23 STX. LeoCats is
mostly one chunk with a 17.5 per cent tail of larger files. Miami Degens is eight
chunks but only 420 items.

If Rapha had started with The Explorer Guild instead, the pattern would have looked
impossible rather than proven.

---

## 6. What this means for the blueprint

The blueprint already commits to publishing "the metadata and URI patterns the
harvester supports, and the ones it does not". That is the right shape and this survey
says what should go in it.

Realistic wording for the supported set:

- SIP-009 contracts whose `get-token-uri` resolves to `ipfs://`, `ipfs://ipfs/`,
  `ar://` or `https://`, with metadata pointing at a fetchable image.
- Items up to 512 KiB, which is single-transaction minting.
- Original NFT transferable to a contract principal, confirmed per collection.

Named as out of scope, honestly:

- Items over 512 KiB, which need the staged path and cost roughly forty times as much.
  Possible, but a deliberate per-collection decision, not self-serve.
- Collections whose art is already unreachable. Nothing can preserve a dead link.
- Collections whose art is already fully on chain, which need no twin.
- Generative collections better served by recursive part-based inscription.

One more thing worth publishing, because nobody has: **the count of collections whose
art is already gone.** Two of nineteen in this sample, and that sample is biased toward
collections that still have market activity. Across the long tail it will be worse. That
number is the entire argument for the project and it is currently unmeasured.

---

## Caveats on this survey

- **The 32-contract static sample is not a random sample of Stacks.** It is what three
  active wallets hold plus the collections already measured. It is biased toward
  contracts that exist and are used, which is the right bias for this question but it
  is not a census.
- **Static analysis is not execution.** A contract that looks compatible can still
  reject a transfer for a reason that only shows up when you try it. The five
  `contract-caller` cases are the known instances of this.
- **Two data sources that used to work are now closed.** `api.gamma.io` returns 403 and
  `gql.stxnft.com` returns 403. Hiro's `by_trait` endpoint 404s. So a full census of
  SIP-009 contracts was not obtainable, which is why the sample is what it is. If a
  census matters later, the route is harvesting asset identifiers from block events
  rather than any collection API.
- **"Unreachable" means unreachable today, through four IPFS gateways.** It is not
  proof the art is gone forever, and it is not proof it will be there tomorrow.
