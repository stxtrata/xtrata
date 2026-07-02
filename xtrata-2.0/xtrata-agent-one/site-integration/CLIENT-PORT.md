# Completion spec — fully backendless Agent One (browser port)

Goal: run the entire Agent One flow **in the browser** (no `/api` server), deployed as a
static app on Cloudflare Pages at `/agent-one/`. Reads/broadcasts go through the same-origin
`/hiro` Pages-Function proxy; the ephemeral deposit wallet + job state live in `localStorage`;
single-tx mint is used for small files and all receipts; the failsafe returns funds on any
error/timeout, then discards the key (guaranteed temporary).

**Source of truth for ALL behaviour: `svc/core.mjs` (+ `agent-large-inscribe.mjs`, `server/server.mjs`).**
Those are proven live. The browser port must reproduce their logic exactly — only the I/O
differs (fetch→`/hiro`, fs→`localStorage`, child_process→in-browser loop, env→`window.XAO_CONFIG`).

## Already done (in `src/agent-one/agent-core.ts`)
Ported + ready: config/`/hiro` network, `deriveFrom`/`newWallet`, `chunkBytes`/`incHash`,
`balance`, `quoteFee`, `waitTx`, `getIdByHash`, `ownerOf`, `send` (Deny + capped fee),
`sendNft`, `sendStx`, `mintSingle` (single-tx), `stagedInscribe` (resume-safe begin→batch→seal).
These are exported for you. Also done: the Hiro proxy (`site-integration/hiro-proxy.pages-function.js`)
and the wallet shim (`src/agent-one/agent-one-wallet.ts` → `window.XtrataWallet`).

## To implement (fill the `window.XtrataAgent` stubs in agent-core.ts)
Port each from `svc/core.mjs` (same names/maths):
1. **`estimate({file|bytes, marginUstx})`** — mirror `core.estimate`: single-tx vs staged quote,
   miner reserve, **receipt cost**, **agent fee = 10% of deposit**, **round required UP to 0.01 STX**.
2. **`buildReceiptHtml(d)`** — copy from core (success branch + the `outcome:'refunded'` branch).
3. **`createJob({file:File, uri, mime, deps, user?, marginUstx, fastTrack})`** — read `file` bytes
   (`await file.arrayBuffer()`), keep bytes in an in-memory `Map<jobId, Uint8Array>`, generate the
   wallet, persist job meta + mnemonic to `localStorage` (key `xao-job-<id>`). Fast-track sets
   `user` = the connected wallet (`window.XtrataWallet.getAddress()`).
4. **`processJob(id)`** — mirror `runJob`+`deliverJob`: if `job.single` → `mintSingle`, else
   `stagedInscribe` (pass an `onProg` that writes `job.progress` to localStorage for the UI);
   then deliver main + receipt to `user`, send agent fee to `AGENT_FEE_ADDRESS`, refund change,
   discard key (only if wallet confirmed empty — else keep + flag `NEEDS_RECOVERY`).
5. **`refundAndClose(id, reason)`** — mirror `core.refundAndClose`: hand back any minted NFT,
   best-effort **failure/refund receipt** (single-tx), sweep STX to funder, discard key if empty.
6. **localStorage job-state** — `listJobs`/`getJob`/writeJob over `localStorage`. **On load, any
   job that is funded but whose bytes are NOT in the in-memory Map → `refundAndClose` (resume-or-refund).**
   Never persist file bytes (quota); persisting the mnemonic is the user's self-recovery backup.
7. **Watcher + reaper** (setInterval, with a `Set` PROCESSING guard) — mirror `server.mjs`:
   auto-run funded fast-track jobs; refund+close anything past `WINDOW_MS` with no progress, and
   refund on any error. Run only while the tab is open (that's the backendless tradeoff).
8. **MOCK paths** everywhere (fake quote/funding/txids, but still build receipt HTML) so the whole
   flow is clickable with `XAO_CONFIG.mock=true` and zero chain.

## window.XtrataAgent contract (what the wizard calls)
`health()`, `estimate(opts)`, `createJob(opts)`, `listJobs()`, `getJob(id)`, `runJob(id)`,
`deliverJob(id)` — async, returning the same shapes the current `/api/*` returns (see
`server/server.mjs` routes). The watcher/reaper self-run. Wallet via `window.XtrataWallet`.

## Bundle (Vite)
Add `src/agent-one/index.ts` = `import './agent-one-wallet'; import './agent-core';` and build it
(IIFE) to `xtrata-agent-one/wizard/agent-one.js` (extend `vite.agent-one-wallet.config.ts` or add a
sibling config; `prebuild` already runs the wallet build — add this one too). The wizard loads
`agent-one.js` instead of `agent-one-wallet.js`.

## Wizard rewire (`xtrata-agent-one/wizard/index.html`)
Replace the data layer — currently every call is `api('/api/...')`. Map each to `window.XtrataAgent`:
- `api('/api/health')` → `XtrataAgent.health()`
- `api('/api/estimate',{body:{file|bytes}})` → `XtrataAgent.estimate({...})`  (pass the File/bytes directly)
- `api('/api/upload')` → **delete** (file stays in the browser; pass the `File` into `createJob`)
- `api('/api/jobs',POST)` → `XtrataAgent.createJob({file, uri, mime, deps, user, marginUstx, fastTrack})`
- `api('/api/jobs')` → `XtrataAgent.listJobs()`
- `api('/api/jobs/:id')` → `XtrataAgent.getJob(id)`
- `api('/api/jobs/:id/run')` / `/deliver` → `XtrataAgent.runJob(id)` / `deliverJob(id)`
- `/api/jobs/:id/receipt` → render the stored receipt HTML from the job (data URL / new tab)
Keep all the UI/markup, statuses, countdown, progress, and fast-track default as-is.

## Deploy config
In the deployed `wizard/index.html` add before the scripts:
```html
<script>window.XAO_CONFIG = { hiro:'/hiro', agentFeeAddress:'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X', windowMs:300000, mock:false };</script>
```
Deploy `functions/hiro/[[path]].js` (from `site-integration/hiro-proxy.pages-function.js`); `HIRO_API_KEY`
is already a Pages secret. `copy-static-apps.mjs` already publishes `wizard` → `dist/agent-one`.

## Test plan (must pass before public)
1. `mock:true` in a browser → click the whole flow (drop file → quote → create → run → deliver →
   receipt; force an error/timeout → refund receipt). No chain.
2. Small **single-tx** live file (≤512 KB) on mainnet — verify deliver + receipt + change.
3. Small **staged** live file — verify the batch loop, resume (reload mid-job), and the failsafe refund.
4. Then enable public.

## Security recap
No central server holds keys (each throwaway key lives only in the user's browser, briefly, then is
destroyed). `HIRO_API_KEY` stays in the Pages Function. The failsafe guarantees funds return on any
failure; the only persisted key case is an unconfirmed refund (flagged `NEEDS_RECOVERY`). Tab-open is
required for processing (backendless tradeoff); reload triggers resume-or-refund.
## Safety invariants (added after live testing — the browser port MUST reproduce these)
These came out of a real staged job that succeeded on-chain but was mis-reported. `svc/core.mjs` is the
source of truth; mirror exactly.

1. **Delivery is the commit point — the tail is best-effort.** Once the inscription NFT is sent to the
   recipient, set `job.inscriptionDelivered=true` and persist immediately. After that, receipt delivery,
   agent fee, and change refund must NEVER throw or fail the job. Wrap each in try/catch; on a leftover
   that can't move, keep the key + flag for recovery but still finish `COMPLETE`. (A delivered inscription
   must never show as failed/CANCELLED.)
2. **Refund retry through the settle race.** Right after a tx confirms, the balance endpoint can briefly
   report funds that aren't spendable yet → `NotEnoughFunds`. Use a retry helper (`sweepStxTo` /
   `sendStxRetry`): re-read balance, back off ~8s, retry on transient errors
   (NotEnoughFunds / ConflictingNonceInMempool / TooMuchChaining / bad nonce / NoSuchAccount).
3. **Failsafe guard.** `refundAndClose` must check `inscriptionDelivered || status==='COMPLETE'` FIRST and,
   if so, only sweep leftover to the payer — never mint a "refunded" receipt or set CANCELLED. (Prevents
   the contradictory double-receipt.)
4. **Refunds always go to the PAYER, never a preset address.** `resolveFunder(job)` = on-chain inbound
   sender (cache as `job.funder`). deliverJob change-refund and every `refundAndClose` sweep go to the
   funder. The recipient (`job.user`) and the payer (`job.funder`) are different concepts.
5. **Fast-track railroad.** Recipient = funder (deposit-once → deliver-to-payer; overrides any preset
   user). If `job.expectedFunder` is set (the wizard sets it = connected wallet) and a DIFFERENT wallet
   pays → do NOT inscribe; `refundAndClose` 100% back to the actual sender with reason "returned to
   sender". Wizard passes `expectedFunder` on fast-track create and shows a "pay from this wallet only"
   lock on the deposit panel. Arbitrary-recipient (airdrop) stays for the non-fast-track lane.
6. **Receipt accounting.** Compute the real main-inscription miner fee and the change estimate from the
   LIVE post-inscription balance (not the up-front reserve). The on-chain receipt is necessarily a
   pre-delivery estimate; the saved/dashboard receipt uses the actual refunded amount so it reconciles.
