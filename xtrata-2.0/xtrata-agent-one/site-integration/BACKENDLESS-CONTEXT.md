# Xtrata Agent One — Fully Backendless Setup (context primer)

> Paste this into a fresh chat to bring it up to speed. It explains the **fully backendless**
> architecture, the chain layer, the per-job lifecycle, the safety invariants, the file map, the
> deploy config, and the current build status (what's done vs what's still to do).

---

## TL;DR
**Agent One** is an inscription service for the **Xtrata** protocol (data permanence on Bitcoin L2 via
**Stacks**). It takes a file (incl. large files and recursive dependency graphs), inscribes it on-chain,
delivers the inscription NFT + an HTML receipt to the user, and refunds the change.

**"Fully backendless"** means the **entire agent runs in the user's browser** as a static app on
**Cloudflare Pages** — there is **no application server** that holds keys or runs jobs. The only
server-side component is a thin **Cloudflare Pages Function proxy** that injects the Hiro API key so the
browser never sees it. Per-job funds sit in an **ephemeral, single-use deposit wallet** whose key lives
only in the browser (localStorage) and is destroyed as soon as the job ends. Wallets are
**guaranteed temporary** — funds are returned on any error or timeout.

---

## Why backendless
- **No custodial risk.** No central server ever holds a private key. Each job's throwaway key exists only
  in the user's browser, briefly, then is wiped.
- **Trivial hosting.** Static assets + one Pages Function. No servers to run, scale, or secure.
- **Secret stays secret.** `HIRO_API_KEY` lives in the Pages Function, never in client code.
- **Tradeoff (important):** the agent only runs **while the user's tab is open**. localStorage + a
  resume-or-refund-on-reload path cover crashes/closes, but if someone funds a job and closes the tab
  before it finishes, their refund happens when they reopen the page. The UI must tell users to keep the
  tab open until they see ✓.

---

## Architecture (the moving parts)
| Component | Role |
|---|---|
| **Static wizard** (`wizard/index.html` → `/agent-one/`) | The whole UI: describe/quote, dependency graph, jobs dashboard. |
| **`/hiro` Pages Function** (`functions/hiro/[[path]].js`) | Same-origin proxy to `api.hiro.so`. Injects `HIRO_API_KEY`; allows only Hiro **read** (`/v2/`, `/extended/`) + **broadcast**. Browser calls `/hiro/...` and never sees the key. |
| **`window.XtrataWallet`** (`src/agent-one/agent-one-wallet.ts`) | Wallet shim bundling `@stacks/connect` — connect / pay / getAddress (Xverse-first, Leather fallback). |
| **`window.XtrataAgent`** (`src/agent-one/agent-core.ts`) | The in-browser agent: a faithful port of `svc/core.mjs`. estimate / createJob / listJobs / getJob / runJob / deliverJob + a self-running watcher + reaper. |
| **localStorage** | Job state + the ephemeral **mnemonic** (the user's self-recovery backup). File **bytes are kept in memory only**, never persisted (quota). |

Data flow: browser → `window.XtrataAgent` → `/hiro` proxy → Hiro → Stacks/Bitcoin. Payments and wallet
connect go through `window.XtrataWallet`.

---

## The chain layer (Xtrata v3.2.3)
- **Core contract:** `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3` (Clarity 3). `743X` is also
  the deployer and the default agent-fee/treasury address.
- **Two inscription routes** (chosen by size):
  - **single-tx** — ≤ 32 chunks (~512 KB): `mint-single-tx` / `mint-single-tx-recursive`. One cheap tx.
  - **staged** — larger files: `begin-or-get` → `add-chunk-batch` (≤ 32 chunks/batch) → `seal-inscription`
    (or `seal-recursive` / `seal-with-relationships`). Resume-safe.
- **Chunking:** 16384-byte chunks; an **incremental SHA-256 chain hash** over the chunks identifies the
  inscription (`get-id-by-hash`).
- **Fees:** protocol fee from the read-only `quote-inscription-fee`; Stacks **miner** fees auto-estimated
  per tx, surplus refunded. A **per-tx miner-fee cap** and **Deny-mode STX post-conditions** bound spend.
- **Relationships:** `parents` (ownership-attested) vs `dependencies` (existence-only). Receipts take a
  **dependency** on the file inscription (no transfer).

---

## Per-job lifecycle (all client-side)
1. **estimate** — quote single vs staged; add miner reserve, receipt cost, and **agent fee = 10% of the
   deposit**; **round the required deposit UP to 0.01 STX**.
2. **createJob** — generate an ephemeral **BIP-39** wallet (`m/44'/5757'/0'/0/0` + `'01'`), keep file
   bytes in an in-memory map, persist job meta + mnemonic to `localStorage`. Fast-track sets
   `expectedFunder` = the connected wallet.
3. **fund** — user pays the deposit address from their wallet; the **watcher** detects the inbound STX.
4. **runJob** — single-tx mint *or* the staged loop (writes `progress` to localStorage for the UI).
5. **deliverJob** — inscribe the **receipt** (dependency on the file) → deliver inscription + receipt to
   the recipient → pay the **agent fee** to treasury → **refund change to the payer** → discard the key
   once the wallet is confirmed empty.
6. **receipt** — an HTML receipt (success or refund) with a reconciling cost breakdown + USD.

---

## Safety invariants (these MUST hold — hard-won from live testing)
1. **Guaranteed-temporary wallets.** Any error or timeout inside the ~5-minute window →
   `refundAndClose`: return funds + any minted NFT to the payer, then discard the key **only if the wallet
   is confirmed empty** (otherwise keep it and flag `NEEDS_RECOVERY`). A key is never kept over value.
2. **Delivery is the commit point.** Once the inscription NFT reaches the recipient, the job is
   **COMPLETE**. The tail (receipt delivery, agent fee, change refund) is **best-effort** and may never
   throw or fail the job — any STX a step can't move is swept by recovery, so a delivered inscription is
   never reported as a failure.
3. **Retry through the settle race.** Right after a tx confirms, the balance endpoint can briefly report
   funds that aren't spendable yet → `NotEnoughFunds`. All STX sends retry with backoff on transient
   errors (NotEnoughFunds / ConflictingNonceInMempool / TooMuchChaining / bad nonce / NoSuchAccount).
4. **Failsafe guard.** `refundAndClose` never mints a "refunded" receipt or marks CANCELLED for a job that
   was already delivered — it only sweeps leftover to the payer. (Prevents contradictory double receipts.)
5. **Refunds always go to the PAYER**, detected on-chain (`resolveFunder`), **never** a preset address.
   The recipient (`job.user`) and the payer (`job.funder`) are distinct concepts.
6. **Fast-track railroad.** Recipient = the payer (deposit-once → deliver-to-payer). The job is **locked
   to the connected wallet** via `expectedFunder`: if a **different** wallet pays, the agent does **not**
   inscribe — it returns 100% straight back to the sender. (Arbitrary recipient / "airdrop" is the
   non-fast-track lane, reserved for the fuller UI.)
7. **Backendless tradeoff.** Processing requires the tab open. On reload, any funded job whose in-memory
   bytes are gone → `refundAndClose` (resume-or-refund).

---

## File map
- **`svc/core.mjs`** — the **behavioral source of truth** (server-proven, live). The browser port must
  reproduce its logic **exactly**; only the I/O differs: `fetch → /hiro`, `fs → localStorage`,
  `child_process → in-browser loop`, `env → window.XAO_CONFIG`.
- **`src/agent-one/agent-core.ts`** — the browser port.
  - **Done:** config + `/hiro` network, `deriveFrom`/`newWallet`, `chunkBytes`/`incHash`, `balance`,
    `quoteFee`, `waitTx`, `getIdByHash`, `ownerOf`, `send` (Deny + capped fee), `sendNft`, `sendStx`,
    `mintSingle`, `stagedInscribe` (resume-safe), and `window.XtrataAgent.health()`.
  - **TODO (stubbed; throw "not implemented" — see CLIENT-PORT.md):** `estimate`, `createJob`, `listJobs`,
    `getJob`, `runJob`, `deliverJob`, plus `buildReceiptHtml`, `processJob`/`refundAndClose`, the
    localStorage job-state layer, the watcher + reaper, and the MOCK paths.
- **`src/agent-one/agent-one-wallet.ts`** → `window.XtrataWallet` (wallet shim).
- **`site-integration/hiro-proxy.pages-function.js`** → deploy to `functions/hiro/[[path]].js`.
- **`site-integration/CLIENT-PORT.md`** — the **completion spec**: exactly what to implement to finish the
  port, the `window.XtrataAgent` contract, the wizard rewire checklist, deploy config, test plan, and the
  safety invariants above.
- **`wizard/index.html`** — the UI. **Currently calls `/api/*`** (the server build). The port **rewires**
  these to `window.XtrataAgent` and **deletes the upload step** (the file stays in the browser; the `File`
  is passed straight into `createJob`).
- **`scripts/copy-static-apps.mjs`** — publishes `wizard` → `dist/agent-one`.

---

## Deploy config
1. In the deployed `wizard/index.html`, before the scripts:
   ```html
   <script>window.XAO_CONFIG = { hiro:'/hiro', agentFeeAddress:'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X', windowMs:300000, mock:false };</script>
   ```
2. Deploy `functions/hiro/[[path]].js` (from `site-integration/hiro-proxy.pages-function.js`).
   `HIRO_API_KEY` is already a Pages secret — nothing else to configure.
3. Bundle `src/agent-one/index.ts` (= `import './agent-one-wallet'; import './agent-core';`) to
   `wizard/agent-one.js` (Vite IIFE), and load `agent-one.js` from the wizard instead of
   `agent-one-wallet.js`. `copy-static-apps.mjs` already publishes `wizard` → `dist/agent-one`.

---

## Current status (June 2026)
- The **server build** (`svc/core.mjs` + `server/server.mjs` + the wizard via `/api/*`) runs on the
  developer's Mac at `localhost:8787` and is **live-proven** on mainnet (real inscriptions, e.g. tokens
  ~#1092–#1101, single-tx and staged).
- The **backendless browser port** is **scaffolded** (`agent-core.ts` helpers done; `window.XtrataAgent`
  methods stubbed) and **fully specced** in `CLIENT-PORT.md`. Remaining work: fill the stubs, bundle to
  `agent-one.js`, rewire the wizard's data layer, then test **mock → single-tx live → staged live →
  public** and deploy to `/agent-one/`.
- **Sandbox caveat:** in the dev sandbox, Hiro (`api.hiro.so`) and npm are network-blocked, so live chain
  testing happens on the Mac / in the browser — not in the sandbox. The sandbox is for editing +
  syntax/logic checks only.

## Test plan (must pass before public)
1. **`mock:true`** in a browser — click the whole flow (drop file → quote → create → run → deliver →
   receipt; force an error/timeout → refund receipt). No chain.
2. Small **single-tx** live file (≤ 512 KB) on mainnet — verify deliver + receipt + change.
3. Small **staged** live file — verify the batch loop, **reload-resume**, and the failsafe refund.
4. Enable public.
