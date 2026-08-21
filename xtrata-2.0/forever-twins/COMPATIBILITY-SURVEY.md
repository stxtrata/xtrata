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

---

## 7. Correction to the fragility test, verified 17 August 2026

"Can the art be fetched" is the wrong test, and the earlier "2 of 19 unreachable" figure
understates the problem rather than overstating it.

### What was measured

Mutant Monkeys, 4,639 items, 220,928 STX lifetime volume, 952 owners.

| Source | Result |
|---|---|
| The contract's own pointer, an Oracle Cloud ORDS route | 404 on every id tested |
| Gamma's private gateway, `stxnft.mypinata.cloud` | 200 |
| `ipfs.io` | 504 after 28s |
| `dweb.link` | 504 after 28s |
| `4everland.io` | 504 after 30s |
| Control: a widely pinned CID on `ipfs.io` | 200 in 0.18s |

The control is what makes this conclusive. Public gateways were working and fast for
content genuinely on the network, and timed out on this collection's CID.

Crash Punks v1 shows the same shape from a different angle: its Gaia hub bucket returns
530 while `gaia.blockstack.org` itself returns 301, so the service is up and the bucket
is gone.

### Why this matters more than "unreachable"

There are three states, not two, and the middle one is the dangerous one because it is
invisible:

1. **Healthy.** The contract's pointer resolves, or the CID is retrievable from public
   IPFS.
2. **Silently dependent.** The pointer is dead, but a marketplace serves the art from its
   own commercial pinning account. Everything looks fine on the marketplace. Nothing
   looks wrong to a holder. The art has exactly one custodian, and it is neither the
   project nor the holders. **Mutant Monkeys is in this state today.**
3. **Gone.** No pointer, no cache.

A naive fetch test sees a rendering marketplace and records state 2 as healthy. That is
why the count of at-risk collections is almost certainly higher than 2 of 19.

### The test the harvester should implement

For each token, record all four independently rather than collapsing to a boolean:

- Does the contract's `get-token-uri` target resolve? Test the host root too, so a bad
  day is distinguishable from a dead bucket.
- If the target is IPFS, does the CID resolve on at least two public gateways, with a
  known-good control CID in the same run to prove the gateways are healthy?
- Does it resolve on any marketplace-operated gateway?
- Time to first byte, since a 28-second success is a different kind of alive from a
  0.18-second one.

A collection where only the marketplace gateway answers is the headline finding, not a
footnote. It is also the most persuasive possible argument for Forever Twins, because
the holder cannot see the risk from anywhere in the normal experience.

### Consequence for public claims

Do not say "the art is gone" for a state-2 collection. It is not gone, it is dependent.
The accurate line is that the artwork is retrievable from exactly one commercial cache
and the contract's own pointer is dead. That survives being checked, which "gone" would
not, because anyone can open the marketplace and see pictures.

---

## 8. Bitcoin Monkeys, the parent collection, checked 17 August 2026

`SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.bitcoin-monkeys`
2,500 items, 694 owners, 985,610 STX lifetime volume.

**Verdict: healthy on data availability. Do not describe it as at risk in the link-rot
sense.**

### What the contract points at

`get-token-uri` builds the URI from an on-chain data var plus a lookup contract:

```clarity
(ok (some (concat (concat (var-get ipfs-root)
  (unwrap-panic (contract-call? .conversion lookup token-id))) ".json")))
```

`ipfs-root`, read live via `/v2/data_var/`, is:

```
ipfs://QmXPHzFbdFuoyw7AY7BVgr9nbimyjuzyerQyD6uJaoUgdz/bitcoin_monkeys_
```

### Availability

| Source | Result |
|---|---|
| `ipfs.io`, bare directory CID | **200 in 1.8s** |
| `stxnft.mypinata.cloud` | 200 in 4.9s |
| `dweb.link`, bare CID | 504 |
| Control CID on `ipfs.io` | 200 in 0.07s |

The content is genuinely on the public IPFS network. One healthy public gateway is
sufficient proof of availability, and gateway-to-gateway variance is normal.

### Two methodology mistakes this caught

**1. A blank marketplace page is not evidence.** The old `stacks.gamma.io` interface
rendered no item images for this collection, and its avatar was an empty square. The
current `gamma.io` interface renders every item perfectly. A screenshot of a failing UI
says nothing about the art.

**2. Test the bare CID before concluding.** The first test appended a guessed filename,
`bitcoin_monkeys_1.json`, and got 504 from every gateway. The real filename comes from
the `.conversion` contract lookup, not the raw token id. The bare directory CID returned
200 in under two seconds. **A 504 on a wrong path looks identical to a 504 on missing
content.** Always resolve the CID itself first, then the path within it.

### The real finding here, which is a different risk

`metadata-frozen` reads `0x04`, which is `false`. **The metadata is not frozen.** The
contract owner can repoint `ipfs-root` at any time, changing what all 2,500 tokens
resolve to in a single transaction.

So the art is durable but the pointer is mutable. That is a distinct failure mode from
link rot and it is not visible to holders either. It belongs in the fragility measurement
as its own column.

### The narrative worth keeping

Same creator, same deployer address, same era, two collections:

- **Bitcoin Monkeys**, 986K STX volume: art on public IPFS, retrievable, healthy.
- **Mutant Monkeys**, 221K STX volume, minted by burning a Bitcoin Monkeys SERUM: pointer
  returns 404, and the art is not on any public IPFS node tested. It exists in one
  commercial pinning account.

Nobody was negligent. One collection was set up in a way that survived and one was not,
by the same team. That is entropy across a portfolio rather than carelessness, and it is
a better argument for Forever Twins than any single dead link.

### Note for collection selection

This deployer also holds `wasteland-apes-nft` and `byzantion-bitcoin-bulls`, two of the
candidate collections in `COLLECTION-SIZING.md`. Given Bitcoin Monkeys is on healthy
public IPFS, check both before describing either as at risk. They may be cheap to
preserve and perfectly healthy, which is a fine reason to preserve them but not an
at-risk story.

---

## 9. CORRECTION, and the rule that supersedes sections 7 and 8

**Sections 7 and 8 overstated the case. All four collections tested have artwork that is
retrievable from public IPFS. The only genuine defect found is Mutant Monkeys' dead
contract pointer.**

### The asymmetry that caused the error

The same CID, `QmWAYP9LJD15mgrnapfpJhBArG6T3J4XKTM77tzqggvP7w`, on five public gateways:

| Gateway | Result |
|---|---|
| `ipfs.io` | 504, four separate attempts |
| `dweb.link` | 504 |
| `4everland.io` | 504 |
| `w3s.link` | 504 |
| **`gateway.ipfs.io`** | **200 in 1.4s** |

Downloaded and verified: 1,306,539 bytes, PNG, 2000 x 2000, genuine image data.

**A 200 proves the content exists. A 504 proves nothing.** A gateway timeout means that
gateway could not locate the content among its peers inside its own timeout. It is a
statement about the gateway, not about the network. Four gateways failing and one
succeeding is not a marginal case, it is the normal condition of IPFS.

This is the reverse of how the earlier sections read the evidence, and it is the reverse
of how most people would read it.

### Corrected status of all four collections

| Collection | Contract points at | Pointer resolves | On public IPFS | Metadata frozen |
|---|---|---|---|---|
| Bitcoin Monkeys | `ipfs://QmXPHz…` | yes | **yes**, ipfs.io 1.0s | no |
| Bitcoin Bulls OG | `ipfs://bafybeih…` | yes | **yes**, dweb.link 0.3s | no freeze mechanism exists |
| Wasteland Apes | `ipfs://Qmf1gSo…` | yes | **yes**, w3s.link 3.9s | no |
| Mutant Monkeys | `https://…oraclecloudapps.com/…` | **no, 404** | **yes**, gateway.ipfs.io 1.4s | no |

Every live value above was read from the chain via `/v2/data_var/`, not from source
defaults, which differ. Mutant Monkeys' source default is `ipfs://placeholder/` while its
live value is the Oracle Cloud URL.

### What is still true, and it is the only claim worth making

Mutant Monkeys' contract points at a URL that returns 404 for every token id tested, and
`metadata-frozen` is false so it was never sealed. **A holder with only their token and
the contract has no route to their own artwork.** The art exists on IPFS, but nothing on
chain says so. The recovery path is knowledge held by a marketplace.

That is a real and demonstrable failure of the on-chain record. It is not "the art is
gone" and it is not "one custodian".

### Rules for the harvester, superseding section 7

1. **Never conclude unavailability from gateway failures.** Try at least six public
   gateways including `gateway.ipfs.io`, which succeeded where four others failed. Record
   which gateway answered.
2. **Treat any single 200 as proof of availability** and stop testing.
3. **Report "not retrieved by N gateways", never "unavailable".** The honest output is a
   retrieval difficulty score, not a binary.
4. **A control CID per run is necessary but not sufficient.** The control proved the
   gateways were healthy, and they still returned false negatives for real content.
5. **The genuinely checkable failure is the pointer, not the payload.** Does
   `get-token-uri` resolve, yes or no. That is deterministic, fast, and cannot produce a
   false negative the way IPFS retrieval can. Lead the fragility measurement with it.

### Consequence for the "2 of 19 unreachable" figure

That number came from single-gateway testing and should not be used. The likely truth is
that far less art is unreachable than it suggested, and the real story is pointer rot
rather than data loss. Re-run the whole survey under the rules above before publishing
anything.
