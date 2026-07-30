# Collection Wizard — 1,024 seed inscriptions

The collection: a shared **engine**, a **mosaic** that reads the collection contract, and
**1,024 items that are each a few bytes of seed**. The engine renders the artwork from the
seed; the seed is the whole item.

That shape makes this far smaller than a general "10k collection" problem, and moves the
risk somewhere unexpected. Written after reading the deployed Clarity rather than
reasoning from the client, which is how two earlier drafts of this went wrong.

---

## 1. Build order

Two tools, because the work has two different characters.

**Canary — ordered, one-off, each step feeding the next:**

| # | Step | Produces | Gate before continuing |
|---|---|---|---|
| 1 | Inscribe the engine | engine token id | confirmed on-chain, id read back |
| 2 | Deploy the collection contract | contract address | `get-locked-core-contract` is the CURRENT core |
| 3 | Inscribe the mosaic (contract address inside it) | mosaic token id | confirmed; mosaic can read the contract |
| 4 | `set-default-dependencies [engine, mosaic]` | — | read back and matches exactly |
| 5 | `set-max-supply 1024`, phases, recipients, splits | — | read back; `max-supply` is set-once |
| 6 | **Wizard**: 1,024 × `mint-small-single-tx` | 1,024 token ids | every seed accounted for |
| 7 | `finalize` | locked collection | only when 6 is provably complete |

**Wizard — repetitive, resumable, paced:** step 6 only.

Steps 1–5 are a canary because each is irreversible-ish and consumes the previous step's
output. Step 6 is a wizard because it is the same thing 1,024 times and the hard parts are
throughput, resume and money.

---

## 2. The blocker in step 2

`xtrata-collection-mint-v1.4` hard-locks to the **old** core:

```clarity
(define-constant ALLOWED-XTRATA-CONTRACT 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v2-1-0)
```

The live core is `xtrata-v3-2-3`. Deploying v1.4 as-is would mint this collection against a
superseded core, which also contradicts the project rule that the app talks to the newest
contract only.

**A new collection-mint version locked to `xtrata-v3-2-3` is a prerequisite**, not a
nice-to-have. The good news is it looks like a small port: the single-tx path calls
`begin-or-get`, `add-chunk-batch`, `seal-recursive` and `seal-inscription`, and **all four
exist in v3.2.3**, as does `seal-inscription-batch`. So the likely change is the constant
plus a trait conformance check — but the trait must be diffed properly, and the new
contract needs its own test pass before anything is deployed.

---

## 3. Why single-transaction minting, not batches of 50

`mint-small-single-tx` does begin + chunks + seal **in one transaction**, and applies
`default-dependencies` automatically when they are set. For a few-byte item that is one
transaction per token *with* the on-chain dependency graph.

Batching looked attractive and is a trap here:

- `mint-seal-batch` seals 50 items per transaction, but each item still needs its own
  prior upload session. For 1,024 tiny items that is ~1,024 begins + 21 seals ≈ 1,045
  transactions, versus 1,024 single-tx mints. Worse, not better.
- `mint-seal-batch` **refuses outright when default-dependencies are set**
  (`ERR-DEFAULT-DEPENDENCIES-BATCH`), so batching would cost the lineage that makes this
  collection coherent.

**One transaction per token is the floor.** No path in any of the five collection versions
mints multiple tokens from multiple payloads in one transaction. 1,024 transactions.

Cost is therefore almost entirely per-transaction overhead — the bytes are free in
practical terms. **Measure one item's real cost on mainnet and multiply; do not quote a
figure from this document.**

---

## 4. The collision problem, and the fix

This is the part specific to tiny content, and the reason for this rewrite.

`HashToId` in the core is **advisory** — a first-seen record, not a uniqueness constraint:

```clarity
;; map-insert preserves the original token-id when duplicate content mints later.
```

Duplicate content mints fine. `get-id-by-hash` answers "who was first", not "is this
taken". With a few-byte seed the value space is small enough that a stranger may well have
inscribed those exact bytes already, for entirely unrelated reasons. Two failures follow:

1. **Resume would silently skip real work.** If resume treats "hash exists" as "my item is
   done", a stranger's year-old token makes us skip an item we never minted — and we would
   finish believing we had 1,024 when we had 1,019.
2. **The client would refuse legitimate items.** `createJob` throws on any pre-existing
   hash, with a message claiming the contract blocks it. It does not, and with few-byte
   seeds this misfires on genuine work.

### The fix: namespace the content

Do not inscribe bare seed bytes. Inscribe:

```
xtrata:seed/<collection-slug>/<index>:<seed>
```

Forty-odd bytes. Still one transaction, cost unchanged, still far inside the single-tx
shape. What it buys:

- **Collisions with unrelated inscriptions become impossible**, so `get-id-by-hash`
  becomes trustworthy again and the client's duplicate check stops misfiring.
- **Each item carries its own index**, so the collection is self-describing on-chain and
  the manifest can be verified against the items themselves.
- **Twin detection is local and trivial** — 1,024 strings in a set.

The engine parses the seed out of that string; it is reading the inscription content
either way.

### Belt and braces regardless

Even with namespacing, resume must reconcile **three** sources and not trust any one
alone: our local record of token ids, the collection contract's minted index, and
`get-id-by-hash` for the namespaced content. A read that fails must report "could not
check" and stop — never "not inscribed". That rule has cost more than any other this
month.

### Seed uniqueness is on us

Nothing on-chain stops two identical seeds. Two identical seeds means two indistinguishable
artworks in a 1,024 collection. The wizard enforces 1,024 distinct seeds locally, before a
single transaction goes out.

---

## 5. What the wizard actually does

Much less than the earlier draft assumed. No chunking, no upload resume, no dependency
binding, no large-file handling — a few kilobytes of content in total.

1. **Take the seed list** (or generate it), and refuse to start unless there are exactly
   1,024 distinct seeds.
2. **Build the namespaced content** for each and hash it locally.
3. **Reconcile** against the three sources above; the work list is what is genuinely
   missing.
4. **Fund a tranche** — not all 1,024 at once. `NEEDS_FUNDS` already pauses, states the
   shortfall, and continues on top-up, which caps how much is ever in one browser-held key.
5. **Loop**, paced against confirmations rather than flooding the mempool, with the
   existing RBF escalation for a stuck nonce, because a stuck nonce blocks everything
   behind it.
6. **Manifest** at the end: one inscription listing index → seed → token id, and one
   receipt depending on the manifest. (`MAX_BATCH_ITEMS = 40` exists because a receipt
   lists its items as dependencies and the contract caps that list at 50 — so a receipt
   can never cover 1,024 items directly.)
7. **Report honestly** — any seed without a token id is named, not rounded away.

---

## 6. Test suite

Built on the existing `FakeChain` harness, which already models owners versus a lagging
index, fee estimation, mempool acceptance versus confirmation, nonces, upload state and
per-URL faults. It needs a chaining cap and a minted-index for the collection contract.

**Collision behaviour — the heart of it**
- A stranger's token with the same bytes as a bare seed does NOT cause that item to be
  skipped.
- Namespaced content is unaffected by any bare-seed collision.
- Resume driven by all three sources agrees with the chain; driven by `get-id-by-hash`
  alone it would skip — assert the difference explicitly, so nobody "simplifies" it later.
- A failed reconciliation read stops the run and says "could not check".

**Seeds**
- Fewer or more than 1,024 seeds refuses to start.
- Any duplicate seed refuses to start, naming both indices.
- Every item's content matches `xtrata:seed/<slug>/<index>:<seed>` exactly, and indices
  are contiguous 0..1023.

**Ordering and prerequisites**
- Minting refuses if `default-dependencies` is unset or does not match the engine and
  mosaic ids.
- Minting refuses against a contract whose locked core is not the current core.
- `finalize` refuses while any seed lacks a token id.

**Scale and resume**
- 1,024 items complete with 1,024 distinct token ids recorded.
- Killed at item 437 and re-entered: does exactly the outstanding work, mints nothing
  twice, spends nothing on completed items.
- Re-running a complete collection is a no-op costing zero.

**Throughput and money**
- `TooMuchChaining` pauses and resumes with no nonce gap.
- A stuck nonce is escalated and the queue behind it drains.
- A tranche running dry parks in `NEEDS_FUNDS` with the shortfall, never refunds
  mid-collection, and continues from the exact item on top-up.
- No path destroys the deposit key while any seed is unminted.

**Manifest and receipt**
- The manifest lists all 1,024 with index, seed and token id, and matches the chain.
- The receipt depends on the manifest — dep count 1, not 1,024.
- A collection finishing short says so rather than claiming success.

**Page-level**
- `wizard-pages-parse.test.ts` extended to the new page: inline scripts parse, wired
  elements exist, div nesting balances.

**Not automatable — must be done on mainnet before the real run**
- One item's true cost, and a measured total.
- Sustained transactions per minute from one wallet, and the real chaining cap.
- A dress rehearsal of the full canary plus ~20 items, including manifest and receipt.

---

## 7. Phasing

1. **New collection-mint contract** locked to `xtrata-v3-2-3`, with tests. Blocks
   everything else.
2. **Canary** for steps 1–5, with read-back gates. Useful immediately and needed for the
   real launch regardless of the wizard.
3. **Seed validator** — takes the seed list, enforces 1,024 distinct, builds namespaced
   content, reconciles against chain, prices it. No minting, no risk, and it answers the
   cost question early.
4. **Wizard mint loop** at ~20 items on mainnet, end to end including manifest and
   receipt.
5. **Full run**: tranche funding, pacing, 1,024.

---

## 8. What this is not

- **Not a new agent.** It orchestrates existing job machinery; money, escrow and recovery
  paths are untouched.
- **Not a reason to revive the server handoff.** It stays dormant; a long job is when
  custody is most tempting to hand over and most costly to have handed.
- **Not a general 10k collection tool.** It is built for this shape — tiny namespaced
  seeds over a shared engine. A collection of 10,000 full-size files is a different
  problem with a different cost profile, and should not be forced through this path.
