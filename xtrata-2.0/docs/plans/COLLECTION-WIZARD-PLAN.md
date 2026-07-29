# Collection Wizard — inscribing up to 10,000 items

Goal: a creator brings a collection and leaves with it fully on-chain, without
babysitting 10,000 transactions or losing money when something goes wrong halfway.

---

## 1. First, what 10,000 actually means

There are two very different collections hiding behind that number, and the wizard has
to know which one it is holding.

**Shape A — 10,000 standalone files.** Photos, tracks, documents. Each item is its own
bytes. At even 40 KB an item that is 400 MB of uploads, ~25,000 chunk transactions plus
10,000 seals. This is expensive and slow and mostly should be discouraged.

**Shape B — generative: N shared assets + 10,000 small items.** The usual 10k PFP
shape. Traits are inscribed **once** (say 200 files), then each item is a ~1 KB
recursive stub whose `deps` point at the trait tokens it composes. 10,000 single-tx
mints of a kilobyte each, not 10,000 uploads.

Shape B is what recursion is *for*, and it is roughly two orders of magnitude cheaper.
**The wizard's most valuable job is to detect which shape it has been given and steer
Shape A towards Shape B where the content allows it.** A wizard that silently inscribes
400 MB because nobody mentioned traits has failed at its actual job.

Cost is dominated by per-transaction protocol + miner fees, so:

- Shape B ≈ 10,000 seals + ~200 asset uploads.
- Shape A ≈ 10,000 seals + tens of thousands of chunk transactions.

**Do not quote a price from this document.** Both numbers must come from
`quote-inscription-fee` against the real bytes, measured on mainnet, before any UI shows
a total. Every fee figure this project has assumed rather than measured has been wrong.

---

## 2. What already works in our favour

More than expected. The collection wizard is mostly orchestration over machinery that
already exists and has been hardened this month:

- **Sealing is idempotent.** `stagedInscribe` opens with
  `getIdByHash(h)` → if the content is already inscribed it returns that token and
  charges nothing ([agent-core.ts:415](../../src/agent-one/agent-core.ts)). A 10,000-item
  run can therefore be re-entered any number of times and only does outstanding work.
  This is the single most important fact in this plan.
- **Uploads resume mid-file** from `get-upload-state`, keyed by
  `(contentHash, minterPrincipal)`.
- **A stalled job now parks instead of dying.** `NEEDS_FUNDS` keeps the deposit key when
  an upload is half-finished, so a collection that runs out of STX waits to be topped up
  rather than refunding and stranding paid-for chunks.
- **Jobs survive a closed tab**, are listed on return by the unfinished-job reminder,
  and are never punished for time the tab was shut (`creditClosedTime`).
- **Progress is visible without watching** — tab title, and an opt-in notification.
- **A stray inscription no longer voids a run.**

---

## 3. The four constraints that decide the design

These are measured from the code, not assumed.

### 3.1 The contract rejects duplicate content — and job creation throws on it

`createJob` and `createBatchJob` both refuse if an item's hash already exists on-chain:

> `This exact content is already inscribed on-chain as token #N — no payment was taken.`

Two consequences, and both matter enormously at 10k:

1. **Every item must be byte-unique.** Generative collections produce collisions more
   often than people expect — two items with the same trait set, or the same stub with
   whitespace differences only. A 10,000-item collection with a single duplicate pair
   cannot be fully inscribed.
2. **Resuming must not re-declare finished items.** Execution tolerates
   already-inscribed content; *job creation* throws on it. So a resumed collection must
   rebuild its work list from what is missing, not re-submit the original 10,000.

**Therefore: a full duplicate audit before any payment** — internal (item vs item, by
hash) and external (item vs chain, by `getIdByHash`). 10,000 hashes computed locally is
fast; 10,000 chain reads is not, so it needs batching and caching, and it must be
honest when a read fails rather than assuming "not inscribed".

### 3.2 One receipt cannot cover 10,000 items

`MAX_BATCH_ITEMS = 40`, and the comment says why: *receipt deps cap 50 − parents /
identity headroom*. The batch receipt references each item as a dependency, so the
ceiling is a contract-level list limit, not a UI choice.

So a collection is **not** one batch job. Either:

- **(a)** ~250 batch jobs of 40, each with its own receipt — 250 receipts, ugly; or
- **(b)** a **manifest inscription**: one document listing every item (hash → token id),
  inscribed once at the end, and one collection receipt that depends on the *manifest*
  rather than on 10,000 items.

**(b) is the design.** It gives one artefact that proves the whole collection, one
receipt, and a natural resume index. Item jobs then need no receipts at all.

### 3.3 Nonces are sequential and chaining is limited

One deposit wallet means one nonce sequence. `TooMuchChaining` is already handled as a
transient, which tells us the node caps unconfirmed transactions per account. So
throughput is bounded by how many transactions can be in flight, not by our loop speed,
and the existing `safeNonce` / RBF work is load-bearing here.

Two implications: submission must be **paced against confirmations** rather than fired as
fast as possible, and a stuck nonce blocks everything behind it — so RBF escalation
(already built) becomes essential rather than nice-to-have at this scale.

### 3.4 It will take hours, in a browser tab

Even at a healthy rate, 10,000 transactions is a multi-hour job. That is a UX problem,
not an engineering one, and the answer is what already exists: resumability,
tab-title progress, notifications, and the honest framing that closing the tab pauses
rather than destroys. **Do not** try to make the tab unclosable, and do not reach for the
server handoff — it is deliberately dormant because it breaks self-custody.

---

## 4. Architecture

**A collection is a plan plus a tree of jobs, persisted separately from both.**

```
xao-collection-<id>            the PLAN: items, hashes, phases, per-item token ids
  phase 1  assets              N shared/trait inscriptions (Shape B only)
  phase 2  bind               fill asset token ids into item templates -> final bytes
  phase 3  items              ~250 jobs x 40 items, no receipts
  phase 4  manifest           one inscription listing hash -> token id for all items
  phase 5  receipt            one collection receipt depending on the manifest
```

The plan is the source of truth and is append-only per item: `pending → inscribed #N`.
Rebuilding the work list is "every item without a token id", which makes resume trivial
and makes 3.1's create-time duplicate check a non-issue on re-entry.

**Phase 2 is the part people underestimate.** In a recursive collection the item content
cannot be finalised until the asset token ids are known, because the ids are *inside* the
item bytes. So item hashes do not exist until phase 1 completes. Consequences: no total
price can be quoted for phase 3 until phase 1 is done, and the duplicate audit (3.1) has
to run *after* binding, not before. The wizard must present this as two priced stages,
not one — pretending otherwise means quoting a number that cannot be known yet.

**Money: fund in tranches.** Escrowing 10,000 items' worth of STX into one browser
wallet at the start is both a big ask and a big single point of failure. Instead fund per
tranche (say 500 items), and let `NEEDS_FUNDS` do exactly what it was built for: pause,
say how much is needed, wait, continue. This is a feature, not a workaround — it caps how
much is ever at risk in one browser-held key.

---

## 5. The wizard flow

1. **Drop a collection.** A folder, a zip, or a Foundry bundle. Read a manifest if one
   is present; otherwise infer.
2. **Tell them what they have.** Item count, total bytes, detected shape, and — if
   Shape A looks convertible — *say so plainly*, with the cost difference.
3. **Audit before money.** Byte-unique check across items; chain check for
   already-inscribed hashes; name/URI collisions; per-item size ceilings. Refuse to
   start on a duplicate rather than discovering it at item 6,000.
4. **Price the stages.** Phase 1 exactly. Phase 3 as an estimate with a clear "priced
   properly once assets are inscribed" caveat, because 4 above.
5. **Fund tranche 1**, then run: assets → bind → items, checkpointing every item.
6. **Manifest + receipt** at the end.
7. **Leaving and returning is normal**, not an error path — the plan reloads, the work
   list rebuilds, and it carries on.

---

## 6. Test suite

The existing `FakeChain` harness is the right foundation: it already models owners vs a
lagging index, fee estimation, mempool acceptance vs confirmation, nonces, upload state
and per-URL faults. It needs three additions — a chaining cap, a duplicate-hash
registry, and enough speed to run 10,000 items.

**Scale and orchestration**
- 10,000 items complete across ~250 jobs with correct token ids in the plan.
- Killed at item 4,137 and re-entered: does exactly the outstanding work, re-inscribes
  nothing, spends nothing on completed items.
- Re-running a fully complete collection is a no-op and costs zero.
- The plan never loses an item: for every input there is a token id or a recorded reason.

**The duplicate constraint (3.1)**
- Two byte-identical items are caught in the audit, before any payment.
- An item already on-chain is detected and excluded, not re-declared.
- A FAILED chain read during the audit reports "could not check" and blocks the start —
  never "not inscribed". (This is the bug class that has cost most this month.)
- Whitespace-only differences between stubs count as distinct — and are flagged as
  probably-unintended.

**Phase 2 binding**
- Item bytes contain the real asset token ids after binding.
- Item hashes are computed *after* binding, never before.
- A collection cannot enter phase 3 with any unbound placeholder left.
- If an asset is re-inscribed (a retry that produced a different id), every dependent
  item is rebound and re-hashed.

**Throughput and nonces**
- `TooMuchChaining` pauses submission and resumes; no nonce gap is left.
- A stuck nonce is escalated by RBF and the queue behind it drains.
- Submission paces against confirmations rather than flooding the mempool.

**Money**
- A tranche running dry parks in `NEEDS_FUNDS` with the shortfall and the deposit
  address, and never refunds mid-collection.
- Topping up continues from the exact item it stopped at.
- Change returns to the payer at the end, once, not per tranche.
- No path destroys the deposit key while any item or upload is unfinished.

**Manifest and receipt**
- The manifest lists every item with its hash and token id, and matches the plan exactly.
- The receipt depends on the manifest, and its dep count is 1, not 10,000.
- A collection with skipped items says so on the receipt rather than claiming success.

**Page-level**
- `wizard-pages-parse.test.ts` extended to the new page: every inline script parses,
  every wired element exists, div nesting balances.

**Deliberately NOT in the automated suite** — needs mainnet, and must be done before
launch: real fee measurement at 10k, real throughput, and a full dress rehearsal on a
small collection (50 items) end to end including the manifest and receipt.

---

## 7. Phasing

Each phase is shippable and independently useful.

1. **Plan + audit, no inscribing.** Drop a collection, get the shape, the duplicate
   report and a price. Pure analysis, zero risk, and immediately valuable — it would
   catch collisions people currently find the hard way.
2. **Small collections end to end** (≤200 items), single tranche, manifest + receipt.
   Everything real, at a size where a mistake is affordable.
3. **Tranche funding + resume** hardening. This is where 10k becomes possible.
4. **Recursive binding (phase 2)** for Shape B, which is the cost story.
5. **Scale**: pacing, RBF integration, 10k dress rehearsal.

Do not start at 10,000. Phase 2 at 200 items exercises every code path except pacing.

---

## 8. What must be measured, not assumed

- Actual per-item cost for both shapes, from `quote-inscription-fee` on mainnet.
- Sustained transactions per minute from one account, and the real chaining cap.
- Whether 10,000 items' worth of plan and bytes is comfortable in IndexedDB.
- How long the audit's chain reads take at 10,000, and whether they need a server-side
  index rather than per-item reads.

That last one is the likeliest place this plan changes shape: if 10,000 `getIdByHash`
reads is impractical from a browser, the audit needs a bulk endpoint, and that is worth
knowing before building the UI around it.

---

## 9. What this is not

- **Not a new agent.** It orchestrates `agent-core`'s existing job machinery; the
  money, escrow and recovery paths are untouched.
- **Not a reason to revive the server handoff.** A multi-hour job is exactly when
  custody would be most tempting to give away and most costly to have given.
- **Not the wizard unification** (`ONE-WIZARD-PLAN.md`), though it should reuse the
  shared panels — `confirmDanger`, keep-open, unfinished-job — rather than growing its
  own copies, which is the mistake that plan exists to undo.
