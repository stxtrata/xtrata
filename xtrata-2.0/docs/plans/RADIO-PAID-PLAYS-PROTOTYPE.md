# Paid radio plays: transaction prototype and UI plan

Status: proposed implementation, 15 September 2026. No payment contract deployed,
wallet created, funds moved or automatic signing enabled by this planning work.

## Outcome and boundaries

A listener funds a dedicated local listening wallet, unlocks a bounded session,
and presses Play once. Each actual song start can submit one transaction paying
50 microSTX to the master inscription's current holder and recording one paid
start. Autoplay works normally. Ordinary listening remains free; paid recording
is opt-in and independent of likes and measured listening statistics.

Build a NEW immutable helper contract, provisionally `xtrata-radio-plays-v1-0`.
The existing likes helper only changes endorsement state and cannot do payments.
Do not modify deployed likes or inscription contracts. Version this helper and
verify its deployed source before enabling any signer. No treasury deduction,
subscription expiry, automatic refill or batching in the initial prototype.

## Repository findings

- `contracts/live/xtrata-radio-likes-v1.0.clar` demonstrates fixed core references,
  direct-caller checks, batch reads and indexed events, but contains no transfers.
- `contracts/live/xtrata-v3.2.3.clar:get-owner` returns the actual NFT holder.
  Older core versions and migration identities need explicit resolution; token
  numbers alone must not be assumed globally interchangeable for payments.
- `src/home/radio.js` owns track selection, preload, `player.play()`, native loop,
  restore and media events. Paid starts belong here, not in click handlers.
- `src/lib/radio/play-counter.ts` already measures listening. Keep its consent,
  qualified-play definition and retry queue separate from financial receipts.
- `scripts/wizard/make-wizards.mjs` generates fresh random mnemonics, then derives
  a recoverable Stacks account at m/44'/5757'/0'/0/0. It does NOT use a shared,
  public-derived or embedded private key. Borrow the isolation and recovery
  pattern, not its command-line printing workflow. No secret configuration read.

## First gate: transaction size and economics

An unsigned local serialization experiment used the installed Stacks SDK, a
public test point (no private key), standard authorization, the proposed contract
name, `play`, a 16-byte receipt ID, and a Deny post-condition requiring exactly
50 microSTX sent by the listening wallet:

| Candidate arguments | Serialized bytes | Fee at 1 microSTX/byte |
| --- | ---: | ---: |
| master ID + receipt, one fixed core | 240 | 0.000240 STX |
| core selector + master ID + receipt | 257 | 0.000257 STX |

These are byte measurements, NOT accepted transaction receipts or current fee
quotes. Reproduce them in a committed test fixture during implementation, with
exact builder parameters and final contract name. Add compact encodings as a
comparison, but do not drop payment limits or duplicate protection to save bytes.
Measure the final signed serialization too, current relay requirements, execution
cost, estimated fees and controlled devnet/testnet acceptance.

200 microSTX is the requested TOTAL miner fee, not a per-byte rate. If the exact
transaction cannot be relayed at 200, pause that product promise. Offer the
measured fee for a separate decision; never silently increase the signing cap.
Waiting cannot fix a below-minimum-relay fee. Even acceptance does not guarantee
confirmation within a fixed time.

At a 200 fee plus 50 holder payment, 3,600 starts cost 900,000 microSTX. At a 257
fee plus 50, they cost 1,105,200 microSTX. Funding and withdrawal fees are separate.
A 1 STX local balance therefore does not yet guarantee 3,600 paid starts. Any
future 0.1 STX treasury contribution requires a disclosed collection mechanism;
unspent local wallet funds belong to the listener.

## Helper contract prototype

Proposed entry point: `play(core uint, master-id uint, receipt (buff 16))`.
Allow only explicitly compiled core selectors; no arbitrary executable contract
traits or caller-supplied payment recipients. Require exactly 16 receipt bytes.

Within one public call:

1. Require tx-sender = contract-caller; only direct listening-wallet calls.
2. Resolve the selected supported master and check it exists.
3. Reject an existing `(tx-sender, receipt)` before transferring anything.
4. Resolve its holder ON CHAIN at execution. No cached API recipient is trusted.
5. Transfer exactly u50 from tx-sender to that holder with `try!`.
6. Store the receipt, increment master paid-start/payment totals, and emit a
   versioned event containing master identity, receipt, payer, actual recipient,
   amount and updated count. Return success.

Transfer, receipt and totals roll back together on contract failure. Miner fees
are outside that atomic guarantee: aborted included transactions may cost fees.
Reads: get-config, get-receipt(payer,receipt), get-master-totals, bounded totals
batch. Receipt values store master and recipient for recovery and audit; receipt
IDs are scoped to wallet, not merely to master, to catch mismatched retries.
No administrator withdrawal or user balance held in the helper.

The signer adds Deny post-condition mode and exact u50 STX spend from the payer.
This limits spend; the contract determines the recipient. An ownership sale
while pending pays the holder at execution, which the UI must explain. Prototype
rejects payer = holder (STX self-transfer fails) and excludes it from paid starts;
the UI plays normally and says no holder payment is needed. Show unresolved or
unsupported/escrowed master cases as ineligible, not a guessed artist payout.
Define escrow beneficiary support separately; do not automatically route to a
marketplace custodian and describe it as an artist royalty.

A recursive album/edition needs an explicit, validated master reference and a
matching dependency/content relationship. Do not infer masters from a title,
first dependency or artist string. First release supports verified direct masters;
references require fixtures covering supported metadata formats, legacy migration,
ambiguous IDs, spoofed references and cycles. Store the edition source locally
for display; all paid aggregation keys use the canonical master identity. The
contract proves a payment to an inscription holder, not actual audio delivery or
that the inscription legally represents a master recording.

## Local wallet and authorisation

Proposed modules under `src/lib/radio/paid-plays/`: vault, session-policy,
transaction, master-resolver, outbox, coordinator and playback-adapter.

Generate a separate random BIP39 wallet per browser installation using vetted
existing libraries. Encrypt its seed with a password-derived AES-GCM key; store
only ciphertext, version, salt, KDF parameters, unique IV and public address in
IndexedDB. Calibrate a reviewed password KDF for supported devices; test tamper,
wrong-password and backup compatibility. Never persist the password or an
unencrypted decrypting key alongside the vault. Offer an explicit recovery backup
and a restore check before funding; no seed in telemetry, logs or general app
state. Existing wizard secrets never enter a browser.

Keep signing material in a dedicated worker while unlocked. Worker isolation
reduces accidental exposure but is NOT a security boundary against compromised
same-origin application code. Audit CSP, third-party scripts and inscribed HTML
sandboxing before enabling funds. A browser path is not a separate origin.
Session caps enforced by application code are also not protection against stolen
keys: the funded balance is the ultimate financial exposure. Drop references on
lock; JavaScript cannot guarantee physical memory zeroisation.

Session approval binds network, verified helper/version/source, fixed u50 holder
payment, maximum miner fee, cumulative budget, expiry and allowed operation.
Default maximum balance authorised is 1 STX; expiry 8 hours. Stop new signing
immediately on lock, expiry, paid-mode off or an observed policy change. Do not
lock solely because an actively playing tab becomes hidden. Reload starts locked
and reconciles prior receipts without signing. Listening continues free until
explicitly unlocked; no surprise retroactive charges.

The ordinary connected wallet is used only for explicitly reviewed funding and
is distinct from the listening wallet. Switching it cannot silently change or
refill the listening wallet. MVP: one device per listening wallet; importing its
key elsewhere can cause nonce conflicts and must halt automation on detection.

## Playback lifecycle and duplicate rules

Assign and persist a random playback receipt BEFORE starting selected audio.
Capture track/master identity before `playing` can fire: the current engine sets
some nowPlaying fields after `play()` resolves, so a naive listener can charge
the previous song. Only the active selection generation may authorise a receipt.

Charge once on first audible `playing` for that receipt. If it starts muted,
wait for unmute while playing; no elapsed-time threshold. No charge on prefetch,
failed loading or a rejected autoplay request. Pause/resume, seeking, buffering,
repeated `playing` and restoring that playback reuse the same receipt. Switching
to another song, explicitly replaying a song or starting a natural loop creates
a new receipt. Handle native `player.loop` explicitly because `ended` may not fire;
distinguish seek-to-start from natural wrap in tests.

A started then immediately skipped track remains chargeable. This must be visible
in opt-in text. Pending receipts reflect consent at their start; unsent receipts
are cancelled when paid mode is switched off. Broadcast transactions cannot be
recalled by a Pause/Lock button. No mass catch-up charging after offline periods.
Uncertain restored identity defaults to free playback rather than another charge.

## Durable transaction queue

Use integer microSTX/BigInt throughout. IndexedDB atomically stores playback ID,
master, consent snapshot, reserved debit and status. Web Locks elect one signer
per network/address across same-origin tabs; BroadcastChannel publishes public
status only. Missing storage or coordination support disables automation.

States: prepared -> signed -> submitted/unknown -> confirmed, aborted, dropped
or cancelled. Persist signed bytes, their locally calculated txid and nonce BEFORE
broadcast; signed bytes are executable spending authorisation and must be confined
to the local vault/outbox, excluded from telemetry and caches. Recovery polls the
known txid AND contract receipt, and rebroadcasts identical bytes after uncertain
submission. Never mint a fresh receipt to retry the same playback.

For MVP allow one unresolved transaction and at most three waiting starts, with
60-second unsigned expiry. Reserve fees + payment for every accepted receipt;
spendable balance excludes reservations and a quoted withdrawal reserve. Respect
session budget even if someone externally tops up. Nonce gaps, competing device
transactions or unexpected contract results stop signing. Do not automatically
fee-bump, replace or re-nonce a transaction of uncertain status. A dropped or
aborted receipt needs reconciled nonce/receipt state before manual retry.

If queue capacity is reached or a payment remains unresolved for 60 seconds,
continue free playback, pause new paid starts and show a recovery action. Already
broadcast starts remain visible and reconciled. Poll with backoff; no unlimited
background work. Handle noncanonical results/reorgs by reconciling the same
receipt; distinguish pending from confirmed in UI and aggregate index.

## UI integration

First rollout: top-level `/radio` only, behind disabled-by-default capability flag.
Existing embedded players and external livestreams do not gain automatic signers.
Their listening measurements and free playback remain unchanged.

Add a compact “Paid listening” panel with states: Off, Setup, Locked, Funding
pending, Ready, Active, Paused (reason), and Recovery needed. Keep artwork/controls
stable and expose keyboard-accessible labels/live status, not colour alone.

Setup: explain optional per-start payment, holder destination, skip rule, public
receipts and local wallet risks; create/recover -> verify backup -> review funding
amount/address/network/fee -> explicitly fund. Verify confirmed funding, not just
the wallet callback. Never open funding automatically.

Session review: show available balance, separate miner/holder costs, maximum
session spend, expiry and “Enable paid listening”. Estimated starts are clearly
estimates computed from current permitted costs/reserves. Do not market an
unverified 3,600-start subscription.

Active: show paid/free mode, balance, pending/confirmed counts and current song
payment. Normal Play/Next remain the only playback actions. Provide “Stop paid
listening”, “Lock”, “Add funds”, “Activity” and “Withdraw remaining balance”.
Withdrawal requires explicit recipient/fee review, queue reconciliation and
separate approval; reserve funds for it and explain possible unspendable dust.

Activity lists song/master/edition, recipient, holder amount, actual fee, status,
time and explorer link. Never call the listening wallet a verified person. Show
paid starts and holder earnings separately from ordinary qualified plays, likes
and completion metrics in catalogue/private stats. Index confirmed contract
events idempotently by txid/event index and reconcile canonicality; do not accept
browser-submitted payment totals as authoritative. Add bounded authenticated
Hiro read/relay endpoints reusing existing key handling, with no server keys for
users, no request-body logging, payload limits and broadcast endpoint rate limits.

## Delivery order and acceptance tests

1. Transaction experiment and Clarity simnet contract/tests. Record bytes, fees,
   execution cost and economic limits; settle the fee gate before real funding.
   Cover ownership transfers, supported cores, duplicate/wrong-length receipts,
   missing masters, same payer/owner, rollback, exact totals and unexpected calls.
2. Pure transaction builder + policy checks + simulated outbox. Test recipient
   and spend protection, malicious inputs, budgets, reserve accounting, nonce
   conflicts, HTTP timeout after successful broadcast, identical retry, aborted
   fees, crash at every persistence boundary and reorg reconciliation.
3. Encrypted vault/recovery and cross-tab coordinator. Use disposable local test
   fixtures only, no personal or existing wizard secrets. Test two tabs, reload,
   restore, storage failure, locking, session expiry, corruption and fee cap refusal.
4. Radio adapter + mocked UI. Test actual playback/autoplay/resume/loop/seek/skip,
   stale selections, unavailable metadata, muted playback, slow confirmations and
   browser background/sleep. Verify free playback survives every payment failure.
5. Optional controlled devnet/testnet end-to-end with disposable accounts and
   explicit bounded funding/broadcast authorisation. Testnet success does not
   prove mainnet fee acceptance. No production keys or personal-wallet testing.
6. Add user-driven deploy-canary card, contract registry/source verification,
   support/recovery guide and event index migration. Review exact production
   contract/source, tested fee and UI before explicit deployment/funding approval.
   Small opt-in canary first; auto-spending remains off for all other users.

Stop release if we cannot prove: no duplicate payment across reloads, exact holder
payment/count atomicity, correct master ownership, spend/fee bounds, recovery of
funds, explicit opt-in and reliable preservation of free playback. No signing,
payment or deployment is authorised by this planning document alone.

## References

- Stacks post-conditions: https://docs.stacks.co/learn/transactions/post-conditions
- Fee API (including serialized size): https://docs.stacks.co/reference/api
- STX transfer semantics: https://docs.stacks.co/reference/clarity/functions
- Browser coordination: https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API
- Local encryption: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto
