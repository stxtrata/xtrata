# SUNO More — parent/child & dependency options

**Status:** implemented. The staged single-parent limit and the two-send escrow
flow are both handled; the mainnet walk-through in §5 has not been done yet.

How to add relationship options to `xtrata-agent-one/wizard/suno.html` so they
behave the way the central Create page does, and where the two surfaces have to
differ because the agent flow is not the same.

---

## 1. What the page does today

`suno.html` never declares a relationship. Four call sites hardcode it:

| Line | Call | Hardcoded |
|---|---|---|
| `suno.html:304` | single quote, `api('/api/estimate')` | no `parentCount` |
| `suno.html:361` | requote after Apply changes | no `parentCount` |
| `suno.html:388` | single `createJob` payload | no `deps`, no `parents` |
| `suno.html:639` | `A.estimateBatch` | `parentCount: 0` |
| `suno.html:698` | batch `createJob` payload | `parents: []` |

The two existing disclosure sections are **✎ Edit details** (`#editPanel`,
`suno.html:123`) and **More metadata ▾** (`#moreMetaPanel`, `suno.html:136`).
Both hold song metadata that gets baked into the player HTML. A parent link is
not metadata — it is an on-chain relationship recorded at seal time, and the
Create page deliberately keeps it in its own panel. So this belongs in a **third
section**, not as extra fields inside More metadata.

## 2. The pattern to match

The Create page (`index.html:343-386`) splits relationships into two `<details
class="inscribe-details rel-details">` panels:

- **Parent → child** — "ownership link — you must own the parent". Copy stating
  each parent is escrowed for the mint and returned with the new inscription;
  ID textarea; Add / Clear buttons; a chip list; a per-ID status list.
- **Dependencies** — "reference link — no ownership needed". ID textarea and a
  status line, nothing more, because there is nothing to verify.

The behaviour behind it (`src/home/main.js:716-980`):

- `applyParentInput()` parses, dedupes, caps at 50, and clears the input.
- `refreshParentChecks()` reads `getOwner` per ID and renders a pill per parent:
  `in wallet` / `not in wallet` / `missing` / `check failed`.
- `getParentBlockingMessage()` gates the primary button with a specific reason.
- Editing parents invalidates the quote and re-prepares (debounced).

The sibling **wizard** page already implements this same contract against the
*same agent* SUNO uses — `parentList()`, `checkParents()` with per-ID
green/amber/red (`wizard/index.html:1305-1325`), `parentCount` in the estimate
(`:1332`), and the escrow checklist (`:1478-1502`). For SUNO, the wizard is the
closer template: same CSS variables, same `window.XtrataAgent`, same wallet
bundle. Match the Create page's *semantics and copy*; reuse the wizard's
*mechanics*.

## 3. Two things that must differ — read before building

### 3.1 One parent, not a list

`SINGLE_MAX = 32` chunks × `CHUNK = 16384` = **512 KiB** is the single-tx
ceiling (`src/agent-one/agent-core.ts:32`). A SUNO player is several MB, so
**every SUNO inscription is staged**, without exception. The staged path caps
parents at one:

```
agent-core.ts:741   if (!b.single && merged.length > 1)
                      throw `item ${b.idx}: large (staged) inscriptions support at most 1 parent`
svc/core.mjs:259    // Staged (large-file) route seals via the engine, which supports
                    // a single parent per seal.
```

This is an agent/engine limit, not a contract one — `seal-with-relationships`
accepts `(list 50 uint)` (`contracts/live/xtrata-v3.2.3.clar:1266`). But the
batch path throws on it, so the UI must not offer what the agent will reject.

**Therefore: SUNO gets a single "Parent inscription" field, not the Create
page's multi-ID textarea + chip list.** One input, one status line. Dependencies
stay multi-ID — they have no such limit.

Note for whoever picks this up: the browser agent's *single-job* `createJob`
(`agent-core.ts:657`) is missing the staged guard that `svc/core.mjs:259` has
and that its own batch path has. A single SUNO job with two parents would be
accepted and then sealed with two, on a path documented as supporting one.
Worth closing that gap in the same pass — it is three lines — but it is an
agent fix, not a SUNO one.

### 3.2 A parent turns one payment into two sends

This is the part that will silently break if it is skipped.

With no parent, the job is `AWAITING_DEPOSIT → FUNDED → INSCRIBING → …`. With a
parent, the user must **also** transfer the parent NFT to the deposit address,
and the job parks in `AWAITING_PARENT` until it arrives — auto-cancelling after
`SERVER.parentWindowMs` (900 000 ms / 15 min).

SUNO's `PHASE` map (`suno.html:402-405`) has entries for `FUNDED`,
`INSCRIBING`, `INSCRIBED`, `DELIVERING` — and nothing for `AWAITING_PARENT`.
`refresh()` (`:451`) has a branch for `AWAITING_DEPOSIT` and then
`else if (PHASE[st])`, which is false for `AWAITING_PARENT`. The result of
shipping a parent field without fixing this: the user pays, the screen keeps
saying *"Waiting for payment to land…"*, and 15 minutes later the job cancels
and refunds with no explanation.

So the escrow flow is **required scope**, not a follow-up:

- A fourth step chip in the progress rail — `Payment · Parent · Inscribe ·
  Deliver` — shown only when the job declares a parent.
- A `PHASE.AWAITING_PARENT` entry: *"Deposit received ✓ — send parent #N to the
  deposit wallet to start the mint."*
- A one-click **Send parent now** button, reusing `w.sendInscription({…,
  recipient: job.depositAddress})` exactly as `wizard/index.html:1561` does. The
  recipient is hardcoded to the job's deposit address there and must stay that
  way here — it is what stops a parent going somewhere unrecoverable.
- The countdown to auto-cancel, from `status.parents` + `job.fundedAt`.
- The `status.parents.unexpected` warning — an inscription that arrives but was
  not declared is returned to sender, and the user should be told.

## 4. Build order

**Step 1 — markup.** Third disclosure below `#editWrap`, matching the page's
existing `button` + `div` toggle idiom (SUNO does not use `<details>`):

```
🔗 Relationships — parent & dependencies ▾      (#relToggle / #relPanel)
  ├─ Parent inscription   (#sParent, one numeric token id)
  │    copy: ownership link — you must own it; it is escrowed for the mint
  │          and comes back with your song. One parent per song: SUNO players
  │          are large, and large inscriptions seal with a single parent.
  │    #sParentCheck — the live owner pill
  └─ Dependencies         (#sDeps, comma-separated ids)
       copy: reference link — no ownership needed, anything can reference
             anything. Free: dependencies add nothing to your quote.
```

In batch mode the same panel means "parent for **every** song in this batch",
mirroring the wizard's *Shared settings — parents for ALL items*. Per-song
parents are deliberately out of scope for v1: one album, one parent is the
real-world case, and per-row inputs would need the row UI rebuilt. Say so in
the panel copy rather than leaving it ambiguous.

**Step 2 — validation and the owner check.** Port `checkParents()` from
`wizard/index.html:1305`, reduced to one ID, debounced at 500 ms, re-run on
wallet connect/disconnect. Four states, same wording as the Create page: `in
wallet` / `not in wallet` / `missing` / `check failed`.

**Step 3 — quote.** Thread `parentCount` into all three estimate calls
(`:304`, `:361`, `:639`). Each parent reserves `PARENT_RETURN_FEE = 30 000
µSTX` (`agent-core.ts:39`) for its return transfer, so the quote genuinely
changes — re-quote on parent change, and never leave a stale figure on the
button.

**Step 4 — payload.** `deps` and `parents` into both `createJob` calls
(`:388`, `:698`). Validate before submit exactly as the wizard does
(`index.html:1372-1374`): numeric ids, no duplicates.

**Step 5 — the gate.** `updateGo()` / `sbUpdateGo()` (`:377`, `:664`) grow a
parent check, in the style of `getParentBlockingMessage()`: refuse to submit
while the check is pending or the parent is not in the connected wallet, and say
which it is. The Create page never lets you start a job that will fail on
escrow; neither should this.

**Step 6 — the escrow flow** from §3.2. Not optional.

## 5. Testing

- Unit: the SUNO page has no test file yet. The nearest pattern is
  `src/home/__tests__/drops-sponsored-claim.test.ts` — source assertions over
  the HTML. Add one asserting the panel ids exist, `parentCount` reaches all
  three estimate calls, `parents` reaches both payloads, and that
  `PHASE.AWAITING_PARENT` is defined.
- `?mock=1` covers the happy path without chain or funds, but **not** the parent
  escrow: `createBatchJob` skips every `ownerOf` check under `MOCK`, and mock
  jobs never enter `AWAITING_PARENT`. The two-send flow has to be walked once on
  mainnet with a cheap parent before it goes near users.
- Regression: a song with no parent must produce a byte-identical payload to
  today's, and must not gain a Parent step in the progress rail.

## 6. Summary of the difference from the Create page

| | Create page | SUNO More |
|---|---|---|
| Parents | many, chips + per-ID pills | exactly one (staged limit) |
| Dependencies | many | many — same |
| Ownership check | `client.getOwner` | `XtrataAgent.ownerOf` |
| Escrow | user holds; contract checks at mint | user **sends** parent to the job's deposit wallet, gets it back after |
| Gate | `getParentBlockingMessage()` | same idea, in `updateGo()` / `sbUpdateGo()` |
| Batch | per-item + shared | shared only in v1 |
