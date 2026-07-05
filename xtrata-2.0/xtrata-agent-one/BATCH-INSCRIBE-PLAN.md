# Batch Inscribe — Wizard Mode Design Plan

One payment → many inscriptions → one receipt. A dedicated wizard mode for inscribing a
set of files (any mix of types) from a single deposit, with optional parents (shared or
per-item), per-track artwork for music players, intra-batch dependencies, and a single
on-chain receipt that records the whole batch and confirms the safe return of every
parent, every inscription, and all change.

## What the contract allows (constraints the design must respect)

- There is **no multi-file mint in one tx**: each inscription is its own
  `mint-single-tx[-recursive|-with-relationships]` (≤32 chunks) or its own staged
  `begin → add-chunk-batch → seal` run. A batch is therefore **one deposit wallet
  funding N sequential mints** — atomic *payment*, not atomic *minting*. Partial
  success is possible and must be handled honestly (see Failure policy).
- **Parents must be owned by the minter at every mint/seal** (`validate-parents` →
  `ERR-NOT-AUTHORIZED`). Win: a parent escrowed ONCE at the deposit wallet can parent
  **every child in the batch** — it only goes home after the last mint. Per-item
  parents are also supported (all escrowed up front, all returned at the end).
- **Duplicate-hash guard** is per-file: each item is pre-checked with `get-id-by-hash`
  (batch creation refuses items already inscribed; resume is idempotent per item).
- Receipt `dependencies` list caps at 50 → **MAX_BATCH_ITEMS = 40** (items + parents +
  agent identity must fit the receipt's dep list with headroom).

## Job model (svc/core.mjs + src/agent-one/agent-core.ts, kept in step)

Extend the existing job JSON with a `batch` shape; a job with `items` is a batch, a job
without is today's single-item path (fully backward compatible):

```js
{
  jobId, fastTrack, depositAddress, ephemeralMnemonic, requiredUstx, ...
  parents: ['134'],                    // JOB-LEVEL parents: escrowed once, linked to EVERY item
  items: [{
    idx: 0, file, uri, mime, bytes, chunks, single, batches,
    deps: ['90', '@2'],                // '@k' = token id of batch item k (intra-batch reference)
    parents: ['1730'],                 // optional PER-ITEM parents (merged with job-level)
    suno: true, artworkFile,           // player build: audio + paired cover art
    protocolFee, minerReserve,         // per-item quote (for the receipt breakdown)
    status: 'PENDING|INSCRIBING|INSCRIBED|FAILED|SKIPPED',
    tokenId, error, itemMinerFee
  }],
  batchProgress: { current: 0, total: N },
  receiptTokenId                       // ONE receipt for the whole batch
}
```

Ordering: items are inscribed in dependency order (`@k` references force k first;
otherwise user order). The Graph tab already builds these DAGs — batch mode is
"inscribe this whole graph with one payment".

## Pricing (estimate)

`requiredUstx = Σ(itemProtocolFee + itemMinerReserve) + receiptProtocol + receiptMiner
+ parentReserve(total distinct parents) + deliveryReserve(N tokens + receipt + change)
+ margin`, then the agent fee % on the rounded total — same maths as today, summed.
One quote panel shows the per-item lines and the single total. Over-collection is safe:
unused remainder returns as change, itemised on the receipt.

## Asset preparation (music players with per-track artwork)

For each `suno` item the existing pipeline runs per item: opus-optimise → build player
(svc: `buildSunoPlayer` with the vendored v6 template; browser: template config with
`imageBase64`). New: `artworkFile` — when the wizard pairs an image with an audio item
(auto-pair by filename stem, e.g. `track-01.mp3` + `track-01.png`, with manual
override), the pairing feeds the player build as the cover instead of/alongside any
embedded art. Artwork is embedded in the player HTML — it is NOT a separate
inscription unless the user explicitly adds it as its own item (both supported).

## Lifecycle

```
AWAITING_DEPOSIT → (funded) → AWAITING_PARENT (if any parent not yet held)
→ BATCH_INSCRIBING (item 1/N … N/N, per-item progress lines, resume-safe)
→ DELIVERING  (single receipt mint → deliver ALL tokens + receipt → parents home
               → agent fee → change sweep)
→ COMPLETE | COMPLETE_WITH_SKIPS
```

- The parent gate is checked ONCE before item 1 (all distinct parents held; wrong
  inscription → return everything, exactly the current single-job behaviour).
- Each item mint is idempotent (hash pre-check) → crash/restart resumes at
  `batchProgress.current`, never re-paying for a minted item.
- The reaper/stall windows apply per item (progressAt updates every batch/mint), and
  the deposit window gets the same parented extension as today.

## Failure policy (honest partial success)

A deterministic per-item failure (bad file, TX abort) marks that item FAILED and
**continues with the remaining items** — one bad track must not torpedo an album.
Transient failures use the existing retry/backoff. At delivery: everything minted is
delivered, unused funds for failed items return as change, and the receipt lists every
item with its outcome. If **zero** items minted → full `refundAndClose` (all funds +
all escrowed parents back, refund receipt). A `strict: true` option flips this to
abort-remaining-on-first-failure for users who want near-atomicity.

## The single batch receipt

One receipt inscription (HTML, v6-style template extension) covering the whole batch:

- header: `Batch inscription receipt · N items`, date, job id
- per-item table: uri · mime · size · token #id · outcome (✓ inscribed / ✗ failed:
  reason / − skipped) · per-item cost
- parents section: `#1730 · escrowed for the batch, linked to items 1–N, returned to
  you` (with return txids)
- totals: deposit received, Σ protocol, Σ miner, receipt cost, agent fee, **change
  returned**, total paid (+USD)
- receipt `deps = [every minted tokenId, every parent, agentIdentityId]` — the
  on-chain graph links the receipt to everything it covers.

Delivered once to the payer with the tokens. Refund-path receipts get the same
per-item table with the all-returned wording.

## Wizard UI — "Batch" tab

1. **Drop zone**: multi-file / folder drop. Auto-classify by mime; auto-pair
   audio↔image by filename stem; auto-URI from filenames.
2. **Items table**: one row per item — file, type chip, uri (editable), deps
   (token ids or `@row`), per-item parents, SUNO toggle, artwork cell (paired
   thumbnail, click to change), per-item est. cost. Add/remove/reorder rows.
3. **Shared settings**: job-level parents ("link ALL items to…"), fast-track,
   margin. Live total quote.
4. **Deposit panel**: identical to today (one address, one exact amount, escrow
   checklist with parents + send-parent buttons, extended countdown).
5. **Progress**: the items table becomes the live status board — per-row spinner →
   token id ✓ / error ✗, plus the familiar phase line. Batch summary on COMPLETE
   with "View batch receipt".

## API surface

- Server: `POST /api/jobs` accepts `items[]` (multipart or per-item upload paths);
  `GET /api/jobs/:id` includes `items` + `batchProgress`. `/run`, `/deliver`
  unchanged (batch-aware internally).
- Browser agent (`window.XtrataAgent`): `createJob({ items: [...] })` mirrors it;
  IndexedDB stores per-item bytes (`jobId:idx`).
- Wallet shim: unchanged (STX pay + sendInscription already cover batch needs).

## Implementation phases

1. **Core batch engine** (svc/core.mjs): items model, summed estimate, ordered
   idempotent mint loop with `@k` dep resolution, parent gate hoist, batch deliver
   (all tokens + parents + change), batch receipt builder, refund paths item-aware.
   Mock-mode end-to-end test (mixed types + shared parent + one forced failure).
2. **Browser port** (agent-core.ts): same logic in-browser; per-item IndexedDB bytes;
   per-item asset prep (opus/player/artwork) before payment.
3. **Wizard Batch tab** (wizard/index.html): drop-pair-quote-track UI; deposit +
   escrow checklist reuse; live items board; batch receipt view.
4. **Server API + spec**: items in POST /api/jobs, SERVICE_SPEC.md batch section,
   recover-all already NFT-aware (no change needed).
5. **Polish**: Graph tab "Inscribe graph as batch" button; suno.html batch handoff;
   caps/warnings (items > 40, total > deposit-cap advice).

## Safety invariants (unchanged, restated for batch)

Key is never wiped while the wallet holds ANY inscription (parents, minted-but-
undelivered tokens, receipt) or STX above dust; every failure path returns ALL
inscriptions + funds to the sender; deletion stays blocked while a key exists;
recover-all/recover-deposit clear NFTs before sweeping. Batch adds no new custody
surface — same one-shot wallet, same window, more items.

## Future hook (project brief)

The single-deposit model is the right anchor for non-STX payments (sBTC/USDCx/
USDC/USDT, USD/GBP): a batch quotes one total in the chosen asset, a payment
adapter converts/verifies at the deposit step, and everything downstream
(mint/deliver/receipt) stays STX-native and unchanged.
