# Wizard — Auto-run + change-back-to-payer for different-address inscriptions

Make "inscribe to a different address than I pay from" behave like every other Wizard job:
**fully automatic after funding** (no Run/Deliver clicks), with the **inscription sent to
the chosen address** and **the change + any parents returned to the paying wallet**. Today
that case silently drops into a slower manual path and routes change by best-effort payer
detection. This is a real-funds change in `agent-core.ts` **and** its `svc/core.mjs` mirror,
plus the Wizard card, plus a rebuild.

## Root cause (what actually happened)

- Ticking **"Manual delivery — send the inscription to a different address"** sets
  `fast=false` in the Wizard (`index.html:1031`) → the job is created with `fastTrack:false`,
  `user = <the other address>`, and no `expectedFunder` (`index.html:1044-1046`).
- The auto-pilot only runs fast-track jobs: `watchTick` calls `autoRun` **`if (j.fastTrack)`**
  (`agent-core.ts:1010`). So a non-fast-track job never advances on its own → the manual
  **Run inscription** / **Deliver + refund + wipe key** buttons appear (they render *only*
  for `!job.fastTrack`, `index.html:1180`) and wait for clicks.
- Nothing about signing needs the user: inscribe and deliver are signed by the **ephemeral
  deposit key** (`deriveFrom(job.ephemeralMnemonic)`, `agent-core.ts:639/798`), never the
  user's wallet. So auto-running this case is safe — it's a UX gap, not a constraint.
- Change routing today: `deliver()` sends the NFT to `job.user` (the other address,
  `agent-core.ts:814`) and sweeps change to `refundTo = resolveFunder(job) || job.user`
  (`:799/:831`). `resolveFunder` detects the payer on-chain (`detectFunder`, `:359`), so
  change is *meant* to return to the payer — **but if detection fails it falls back to the
  delivery address.** That silent fallback is the ambiguity the user flagged.

## The fix — decouple `recipient` (NFT) from `user` (payer = change)

Right now `job.user` is overloaded: it is both the NFT recipient *and* the change fallback.
Split them:

- **`job.recipient`** — where the inscription (and, by decision below, its receipt) goes.
- **`job.user` / funder** — the paying wallet = where **change + parents** return.

With the connected wallet always the payer, `user` is known up front, so change routing
becomes reliable (`refundTo = resolveFunder(job) || job.user` now falls back to the *payer*,
not the delivery address). The job stays `fastTrack:true`, so `watchTick` auto-runs it with
no other changes to the auto-pilot.

### 1. Wizard UI (`xtrata-agent-one/wizard/index.html`)

- Relabel the checkbox (`:185`) from "Manual delivery … (disables ⚡ fast-track)" to
  **"Send the inscription to a different address"** — it no longer disables fast-track.
- Keep the `#user` field (reused as the **recipient** address) revealed by the checkbox.
- In the inscribe handler (`:1030-1046`): drop `fast=!manual`. Always fast-track when a
  wallet is connected; build:

  ```js
  const differentAddr = $('#manualMode').checked;
  const recipient = differentAddr ? $('#user').value.trim() : WALLET;
  // require connection (payer = change destination); validate recipient is SP…/SM…
  payload = { …, fastTrack:true, user:WALLET, expectedFunder:WALLET, recipient };
  ```
- Card copy: show **"Inscription → `recipient` · change + any parents → your wallet"** and,
  when `recipient !== payer`, keep the existing ⚡ "processing starts automatically on
  arrival" line. Remove the non-fast-track button block for this case (it no longer applies).

### 2. `src/agent-one/agent-core.ts`

- `createJob` (`:445-478`): accept `recipient`; store `job.recipient = recipient || user || null`.
- `deliver` (`:782-844`): send the inscription NFT to **`job.recipient || job.user`**
  (currently `job.user`, `:814`) **and** retarget the receipt-NFT send (`:829`) to the same
  `recipient || user`; leave `refundTo`/change + parent-return on the payer path unchanged
  (`:799/:822/:831`).
- `autoRun` (`:906-943`): **no change** — `job.user = funder` (`:915`) still sets the payer as
  change destination; `job.recipient` is untouched; `fastTrack:true` means `watchTick`
  already auto-runs it.
- Batch path (`deliverBatch`) gets the same `recipient || user` treatment for symmetry.

### 3. `svc/core.mjs` (server mirror — keep in step)

- `createJob` (`:232-262`): accept + store `recipient` alongside `user`.
- `deliverJob` (`:810-866`): NFT send (`:852`) → `job.recipient || job.user`; `refundTo`
  (`:832`, already commented "change ALWAYS returns to the payer") unchanged. Receipt data
  already carries `recipient: x.recipient || job.user` (`:666/:749`) — feed `job.recipient`.

### 4. Rebuild + resync (required to take effect)

The live Wizard runs a **stale bundle**: `agent-one.js` was built Jul 4 but `agent-core.ts`
is Jul 5, so current source changes aren't deployed. After editing, rebuild per the sandbox
recipe (rsync → `/tmp/xbuild`, warm npm cache; never build in-place — repo `node_modules`
are macOS binaries): `vite -c vite.agent-one.config.ts` (+ wallet bundle if touched) →
`node scripts/copy-static-apps.mjs` to refresh `dist/wizard/`.

## Decision (confirmed) — receipt follows the inscription

**Receipt → `recipient`** (delivered together with the inscription). In `deliver()`/
`deliverJob()` the receipt-NFT send currently targets `job.user` (`agent-core.ts:829`,
`svc/core.mjs` equivalent) — retarget it to `job.recipient || job.user` alongside the main
inscription send. Change, agent fee, and parents are unaffected (payer / fee address).

## Edge cases

- **Wallet not connected** → the friendly different-address flow requires a connection (payer
  must be known so change is guaranteed home). Gate the inscribe button on it. A legacy
  "advanced, pay from another wallet" path (funder-detected change) can stay behind an
  Advanced toggle, or be dropped — call it.
- **Payer detection fails at deliver** → now harmless: `user` is the connected payer, so the
  `|| job.user` fallback is the payer, not the delivery address.
- **`expectedFunder` lock** stays = connected wallet → a payment from any other wallet is
  auto-refunded (unchanged safety).
- **Parents** escrowed at the deposit wallet still return to the payer (`refundTo`), not the
  recipient — correct (they were the payer's).

## Verification

- **Mock walkthrough** (`wizard/index.html?mock=1`): connect wallet → tick "different
  address", enter an SP… → inscribe → confirm it **auto-advances FUNDED → INSCRIBING →
  DELIVERING → COMPLETE with no clicks**, the receipt shows *Inscription → other address*,
  *Change → your wallet*.
- **`npx vitest run`** (713 tests) — must stay green; add/adjust a svc `deliverJob` test
  asserting `recipient` gets the NFT and the payer gets the change when `recipient !== user`.
- **Node harness** on the Wizard handler: assert a different-address submit yields
  `{fastTrack:true, user:WALLET, expectedFunder:WALLET, recipient:<addr>}`.
- Confirm the default (same-wallet) flow is byte-for-byte unchanged.

## Checklist

1. `agent-core.ts`: `createJob` store `recipient`; `deliver`/`deliverBatch` NFT → `recipient || user`.
2. `svc/core.mjs`: mirror the same (createJob + deliverJob + receipt `recipient`).
3. `wizard/index.html`: relabel checkbox, always-fast-track handler, pass `recipient`, card copy.
4. Rebuild `agent-one.js`, `node scripts/copy-static-apps.mjs`, resync `dist/wizard`.
5. Verify (mock walkthrough + vitest + harness); confirm same-wallet path unchanged.

## Out of scope

- Changing the embedded `/inscribe` panel (separate work — see
  `INSCRIBE-PANEL-FILE-VS-TEXT-PLAN.md`).
- Multi-recipient / per-parent routing; arbitrary custom change addresses (this keeps change
  on the payer, which is what was requested).

---
*Real-funds change across two mirrored cores (`agent-core.ts` + `svc/core.mjs`) + Wizard UI +
rebuild. Net effect: different-address inscriptions auto-complete after funding, inscription
to the chosen address, change + parents guaranteed back to the paying wallet.*
