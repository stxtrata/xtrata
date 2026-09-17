# Music Balance: simple local wizard plan

Status: current direction, 17 September 2026, following the user's request to
simplify around the original wizard and a small 1 STX balance. This supersedes
the architecture and launch gates in RADIO-MUSIC-BALANCE-INTEGRATION.md and
RADIO-MUSIC-BALANCE-TEST-HARNESS.md. Those documents remain historical reference.
This is a plan change, not payment activation or a change to any funded wallet.

## What the user gets

Create Music Wallet → copy funding address → add up to 1 STX → enable
“Support as you listen” once. Thereafter eligible song starts are paid
without wallet popups while the local service is running and funds are available.
The radio displays status, balance and expandable payment history. Pause is one
click. Free radio continues for everyone, including on any payment failure.

No seed phrase, password, backup verification or key export is required in the
normal flow. Xtrata does not receive or store users' keys on its servers. The
local wizard must still generate and store a signing key automatically: a normal
Stacks wallet cannot sign without one. This is not a keyless wallet.

Setup copy, before funding: “This small spending wallet lives on this computer.
You do not need to manage keys. Losing its local files can lose the balance;
software with access to those files can spend it. Keep no more than 1 STX here.”
Require this acknowledgement alongside the one-time automatic spending consent.
Do not imply that every user's computer is safe because the balance is small.

## Reuse the working backend

Adapt the original `scripts/wizard/radio-plays-backend.mjs` approach: generate a
fresh random wallet per installation; AES-256-GCM vault and a separate local
unlock file; private directory and file permissions; no keys in the browser,
logs, public reports or Git. Both files remain local. Their co-location is an
explicit accepted tradeoff, not protection from a compromised local account.

No mandatory OS keychain, password/seed onboarding or verified backup ceremony
for this release. Do not reuse the operator test wallet, its funds or its journal.
Keep the existing bounded wizard canary independent from end-user balances.
Do not migrate to the older browser test wallet or embed a common private key.

Reuse its transaction builder, exact holder-payment post-condition, source/network
checks and recovery logic where verified. Replace operator-only test caps with
an explicit end-user policy; retain test caps unchanged in the operator tool.
Use the durable simulation and strict message schemas already built as test
fixtures rather than rebuilding an unrelated wallet engine.

## The 1 STX rule

1 STX is the supported funding/balance target, not an enforceable address cap.
Anyone can send STX directly to a normal account; the app cannot reject that
transfer. Never advertise a guaranteed maximum possible loss of 1 STX.

- Show the actual confirmed balance, even above 1 STX.
- Funding UI permits only an amount up to 1 STX minus confirmed balance and
  known incoming funding; refresh before requesting a transfer. No auto-top-up.
- If the observed balance exceeds 1 STX, pause new paid starts and show
  “This wallet holds more than the recommended 1 STX. Return the excess or
  return your whole balance.” Show **Return excess** and **Return all** buttons.
  Music stays free while new paid starts are paused.
- Never automatically sweep, return or burn excess funds. Provide an explicit,
  locally reviewed withdrawal with recipient, amount and fee before signing.
- Pending incoming transfers may be missed or change; explain the UI restriction
  as a funding aid, not a blockchain guarantee.

After spending down, the user may top up to the target. New funds resume support
only if the user left it enabled and the policy has not changed. A pause stays
paused. Losing local state has no platform recovery guarantee; a new installation
creates a new wallet, not access to the old funds.

## Returning funds

**Return all** stays available in the wallet dashboard at any balance and while
support is paused, disabled or above the target. Users may request it at any time;
execution requires the local wizard and network to be available and pending
payments to be resolved. No seed export or external wallet-signing popup is
required: the wizard signs the approved return from its own account.

Show a locally reviewed confirmation with the full mainnet destination address,
amount received, miner fee and balance remaining. Offer a previously confirmed
return address or let the user enter one. Never assume the last funding sender
is the user's wallet: deposits can originate from exchanges or third parties.
Validate the address/network and require explicit approval before every return.
Do not automatically return funds merely because a balance threshold was crossed.

After reconciling pending transactions, let B be the confirmed spendable balance
in microSTX, F the reviewed miner fee and T = 1,000,000 microSTX:

- **Return excess:** send B − T − F, leaving exactly 1 STX. Label the amount as
  “Excess returned after network fee”. If the excess cannot cover the fee, explain
  that no excess transfer is available at that fee; offer Return all instead.
- **Return all:** send B − F, leaving zero. Release the ordinary listening reserve
  for this operation. Disable automatic support so later deposits do not resume
  it without the user enabling it again. If B cannot cover F, explain why the
  transfer cannot proceed; do not silently increase fees or request more funds.

Pause new starts and cancel unsigned play intents when preparing a return. Use
the same exclusive nonce owner and durable journal as plays. Pending or unknown
signed payments must reconcile first; show their status rather than guessing the
available balance. Recompute immediately before signing; a changed amount or fee
requires a refreshed confirmation. A cancelled return restores the previous
support preference, subject to the existing above-limit/recovery guards.

Prevent double-click and restart duplicates using a persisted return request ID
and signed transaction. Never create a replacement for an uncertain submission.
Show pending, confirmed or failed status and an explorer link in activity. After
Return excess confirms, resume only if support was previously enabled, the
balance is within target and no explicit user pause or recovery block applies.

## Keep only the essential connection controls

For xtrata.xyz and its standalone radio, retain the narrow extension/native bridge
already started. It connects the hosted radio to the existing local wizard; it
is not a second wallet or new custody model. One local installation and one-time
approval for exactly https://xtrata.xyz. No wildcard CORS, public signing server,
arbitrary transaction RPC, or reliance on a page-provided origin.

Keep the original loopback canary working as operator tooling. A hosted website
cannot automatically start this backend on a visitor's computer. Installation and
service availability must be explained honestly. Initial scope remains tested
desktop environments; unsupported users simply continue listening free.

Expose only public status/history and a constrained song-start request. The
backend sets contract, network, fee and holder amount; the page cannot choose a
recipient or supply transaction bytes. Keep one active player across tabs and
one unresolved payment, durable receipts, nonce ownership and pause/revoke.
If the service is absent, stop checking promptly and never block audio.

## Payment behaviour

Use the existing helper: 50 microSTX to the current master holder, plus a fixed
miner fee shown before enabling. The paid-play fee needs a verified release
setting: 257 microSTX has confirmed in the recorded tests, 300 is the conservative
test value; 200 must not be promised as reliable from likes evidence alone.
Never automatically raise a fee. Preserve a displayed recovery reserve.

Use one shared hook in the homepage radio and /radio. A new eligible audible
start may pay once; buffering, pause/resume, seek and reload must not duplicate
it. Unsupported masters and starts while the signer is busy/empty play free.
No backlog charged later. An uncertain submission remains pending/unknown until
reconciled; it cannot be relabelled free or replaced simply after a timeout.
Do not claim payment for every song until throughput tests demonstrate coverage.
Likes and measured listening counters retain their current independent behaviour.

## Streamlined implementation and tests

1. **Local wallet + dashboard:** reuse wizard storage, create/reuse address,
   balance refresh, 1 STX funding controls, enable/pause, paged history and reviewed
   withdrawal. Test fresh temporary wallets, repeat setup, permissions, lost/corrupt
   files, balance boundaries (below/at/above 1 STX), pending funding and restart.
2. **Connect to radio:** finish the constrained bridge and attach existing support
   UI and one shared start hook. Test origin/frame rejection, one-time consent,
   disconnect/revocation, two tabs, replay/skip/reload and no-wallet free listening.
3. **Reliable payments:** persist before broadcast, reconcile exact tx/receipt and
   holder transfer, retain unknowns and handle abort fees. Test every crash boundary,
   exhaustion/top-up, pause, duplicates, changed policy and safe withdrawal using
   simulations. Include exact excess/all arithmetic, insufficient fee balance,
   reserve release for full return, untrusted funding sender, changed recipient,
   repeated clicks, pending-play/return races, restart uncertainty and cancellation.
   Test actual installed browser-to-native transport separately.
4. **Bounded live canary + rollout:** fresh disposable wizard with separately
   authorised count/fee/spend limits. Reconcile receipts, balances and paid-start
   coverage; record report. Then opt-in rollout with a stop switch. Do not use
   personal wallets or the existing funded operator wallet for these tests.

Existing 34 focused tests remain useful groundwork, not evidence that these four
stages are complete. Mandatory OS keystore integration, password backup onboarding,
cross-platform packaging and exhaustive legacy gate sequencing are deferred.
Key secrecy from the website, spending consent, exact transactions, recovery and
free-play isolation are retained. No mainnet transactions are authorised by this
planning document.
