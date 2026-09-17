# Radio backend wizard

This supersedes the browser-wallet test flow in the paid-play canary. The backend creates and signs with a separate random mainnet wizard key. No extension, browser storage, personal wallet or deployer wallet is used for signing.

Start from `xtrata-2.0`:

```sh
node scripts/wizard/radio-plays-server.mjs
```

Open http://127.0.0.1:8798, or use the canary’s backend wizard link.

1. **Create / get wizard funding address** returns the existing address, or creates it once. It refuses to overwrite a partially created wallet.
2. Fund that address externally, then **Confirm funds / refresh results** checks its confirmed mainnet balance. Funding does not authorise spending.
3. Choose core, song, network fee in microSTX and test count. Approve the bounded run. The backend signs and submits automatically, with no manual transaction popups.

CLI address setup: `node scripts/wizard/radio-plays-server.mjs setup`. Read-only balance/status: `node scripts/wizard/radio-plays-server.mjs status`.

## Key storage and scope

State is in ignored `.artifacts/radio-wizard/`. A random AES-256-GCM encrypted signing key is stored separately from its random local unlock key. Files use mode 0600 and directory 0700. Back up the entire folder securely. This protects against accidentally publishing plaintext keys, not against someone who can read both files or control the computer. An automatically signing wallet is technically hot while the backend uses it.

The HTTP service binds only 127.0.0.1:8798 and rejects unexpected Host/Origin, non-JSON and non-POST commands. It sends no private keys, unlock keys or signed bytes to the browser. There is no remotely exposed funding or signing API.

## Limits and recovery

Runs allow 1–5 transactions, 1–1000 microSTX fixed network fee each, at most 5000 microSTX total per run, and a conservative lifetime ceiling of 10000 microSTX (0.01 STX). Each transaction additionally pays 50 microSTX to the master holder. A 1000 microSTX reserve remains. These small limits are deliberate for initial tests; this is not an unrestricted subscription signer.

The deployed helper source hash and mainnet network are verified. Each call has an exact 50 microSTX spend post-condition. Only one run/process and one unresolved payment are allowed. The backend persists signed bytes before sending and waits for the matching confirmed receipt before the next call. No automatic fee increase or replacement transaction is made. A rejected/failed/uncertain submission blocks further runs until operator investigation; do not delete its journal to bypass this.

Stop halts future payments. Already broadcast payments can confirm. The existing wizard `KILL` file and `WIZARD_KILL_SWITCH` are respected. After a crash, inspect whether a runner is alive before removing a stale run.lock. Return controls are now available in the local panel; see below. Preserve the vault and journal, especially if any transaction is unresolved.

Tests exercise contract payments and receipts, not audible playback. A receipt proves this payment call, not listening duration. Failed transactions can consume network fees.

Validation: backend tests use disposable temporary identities and mocked chain
responses, including an unknown-submission recovery guard. Canary input tests and
the production build pass. On 15 September 2026 the dedicated backend wizard also
completed four mainnet paid starts; no personal, deployer or browser wallet was
used. Three used a 300-microSTX miner fee and one used 257 microSTX, and every
confirmed transaction transferred exactly 50 microSTX to the current master
holder. A 200-microSTX attempt returned HTTP 400 and remains unresolved in the
private journal, so the runner correctly blocks further payments. See the
[dated mainnet report](reports/2026-09-15-wizard.md) for transaction evidence,
accounting and limitations. The local panel works without a website deployment.

This wizard remains operator test tooling. Successful mainnet tests do not make
it a production end-user wallet or connect it automatically to normal radio
playback. The production path, local discovery boundary and recovery requirements
are specified in the [Music Balance integration plan](../plans/RADIO-MUSIC-BALANCE-INTEGRATION.md).

## Wallet return controls — 17 September 2026

Restart the local server to load the updated UI. The canary's local wizard link
opens the same panel at http://127.0.0.1:8798. Public xtrata.xyz wallet integration
is still separate work; this page manages the existing local operator wizard.

The panel shows the confirmed balance, copyable funding address, over-1-STX
warning, return review and transaction activity. Above 1 STX the backend blocks
new test payments. It cannot reject deposits to the address.

- **Return excess** returns the excess minus the selected network fee, leaving
  exactly 1 STX. If the excess cannot cover the fee, it explains why.
- **Return all** returns the balance minus the selected fee, including the
  listening reserve. It is available regardless of the recommended balance.
- Enter and check your own mainnet destination. The wizard never guesses it from
  a deposit sender. Default fee is 300 microSTX; editable from 1 to 1000 microSTX,
  with no automatic increase. This is an explicit choice, not a confirmation guarantee.
- Review the exact destination, amount, fee and remaining balance, check approval
  and select **Confirm and send return**. A review expires after two minutes.
  Changing inputs, stopping, restarting the server or a changed balance/nonce
  requires another review. **Cancel review** does not send a transaction.
- Preparing a return stops the test loop. Cancelled and completed returns leave
  tests stopped; the operator must explicitly approve another test run. This
  operator behaviour does not implement production autoplay resumption.

Returns and tests share one process lock and nonce guard. Pending/unknown play
transactions must resolve before returning funds; an unavailable transaction is
not permission to spend around it. Refresh checks return confirmations but never
rebroadcasts. Saved signed returns are journaled and flushed before submission;
repeated confirmation of their request ID cannot create another transfer. Return
status and explorer links are shown without exposing keys or signed bytes.
Kill switches apply to returns too. A signed/submitted transaction may still
confirm after Stop. An uncertain return blocks later tests and returns.

The previously recorded 200-microSTX play attempt is not altered or removed by
these controls. If it remains unresolved, the UI will explain that recovery is
required before a return. Never delete its journal merely to bypass the guard.

Tests: `npx vitest run scripts/wizard/__tests__/radio-plays-backend.test.ts
scripts/wizard/__tests__/radio-returns.test.ts` (one command). Browser checks:
`node scripts/radio-support/wizard-returns-smoke.mjs`. These use temporary wallets
and mocked chain calls only; screenshots stay under ignored `.artifacts/`.

## Radio inside the local wizard

Use **Load / refresh songs**, choose a song and press **Play / pause**. This local
player reads the public verified core-3 catalogue and extracts audio from the
original inscriptions. It shows title, artist and album where available, supports
previous/next, native audio controls and playlist looping. It never executes
inscription HTML/scripts. Free playback needs no funded wallet or paid approval.

To test payments, expand **Paid mainnet test settings**, choose the fixed miner
fee, maximum starts (limited by the 0.005 STX session budget) and duration (1–30 minutes), check the approval box and
confirm **Enable paid test listens**. Defaults: 300 microSTX miner fee, ten starts,
ten minutes. Each eligible start adds the existing 50-microSTX holder payment.
The maximum session cost is 5000 microSTX; the existing 10000-microSTX lifetime
wizard ceiling, 1000-microSTX reserve, mainnet checks and kill switches remain.
One acknowledgement covers the whole session, including successive confirmed payments.
At fee 257 microSTX the session cap allows up to 16 starts; at 300 it allows 14.
The separate manual test runner retains its five-test limit.
These are real mainnet calls when you enable them in your funded wizard.

Enabling midway through a song never retroactively charges that song. A new
unmuted playback start can trigger once; resume, seek and buffering cannot trigger
a second payment. Busy/pending starts stay free, without later catch-up charges.
Only one unresolved payment is allowed. **Free listens / stop paid tests** ends
approval while music continues. Signed/submitted payments can still confirm.
Reload and server restart do not restore paid approval. One tab owns the session;
a 30-second heartbeat lease and the selected expiry stop abandoned sessions.
Changing fee/limit controls requires new approval. Starting a return also stops
paid playback tests, without cancelling already signed transactions.

**Recent start outcomes** explains requested/free/uncertain starts. **Activity**
shows durable transaction evidence; refresh reconciles pending play and return
records without broadcasting. A browser start event is not proof of listening
duration, and this canary does not add browser listening statistics to production.

The old 200-microSTX uncertain test is not bypassed: if it cannot be reconciled,
enabling paid mode reports the issue and music remains free. Approval cannot
override that recovery guard. This UI does not modify the deployed contract.

Validation: `npx vitest run scripts/wizard/__tests__/radio-listening.test.ts`
and `node scripts/radio-support/wizard-listening-smoke.mjs`. The latter plays
real generated PCM audio in isolated desktop/mobile Chrome and sends only
simulated chain calls from temporary wizard keys. No funded wallet is used.

### Explicit recovery of a prepared fee test

The operator-only `retryPreparedPlay(txid, fee)` method permits one explicit
higher-fee retry of a saved prepared call. It requires an absent original tx,
an unused matching account nonce, no pending nonce, no existing play receipt,
the pinned helper source, eligible owner, balance/reserve and lifetime budget.
It preserves the same nonce and receipt, so the two attempts cannot both execute.
The original signed record is preserved in a private local recovery file; the
journal links both transaction IDs and reconciles whichever confirms. New signed
bytes are persisted before submission. This is not an automatic fee increase or
a journal deletion, and each live invocation needs explicit spending authority.
Node failures now retain a bounded reason code when provided, without logging
raw response data. Recovery tests use disposable wallets and mock network calls.

Play activity and recent start outcomes display the song title, artist when
known, inscription ID, and the 50 microSTX recipient address. Confirmed payments
say “paid to”; unresolved payments show the intended recipient. New radio starts
save display metadata with their journal entry; older entries use the current
catalogue where available. Missing metadata falls back to the inscription ID.
