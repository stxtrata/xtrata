# Xtrata Music Balance: production integration plan

> Superseded on 17 September 2026 by [the simplified local wizard plan](RADIO-MUSIC-BALANCE-SIMPLIFIED.md). The architecture and gates below are historical, not current requirements.

Status: handoff-ready implementation plan, revised 17 September 2026. Planning only; no
production activation, new wallet, signing or payments are authorised by this
document. The operator wizard has completed four confirmed mainnet test payments;
ordinary radio playback is still free and is not connected to that signer.

## Handoff: start here

Implementation update, 17 September 2026: a read-only protocol, panel, simulator,
development preview and executable focused harness now exist. See
[implementation progress](../radio/SUPPORT-IMPLEMENTATION.md) for tested scope
and remaining gates. The inventory below describes the original handoff baseline.

No production Music Wallet companion, browser extension, `/music-balance` page,
shared paid-start adapter, status/activity UI or `test:radio-support` runner exists
yet. The existing backend wizard and browser test wallet are evidence and operator
tools; do not turn either into the end-user signer or reuse their wallet state.

The first implementation slice is Gates 1–2 of the
[test harness](RADIO-MUSIC-BALANCE-TEST-HARNESS.md): versioned schemas, deterministic
fake companion, passive detection and the non-signing status/history UI. It must
introduce no key, native host, broadcast path or radio payment hook. Commit each
green gate independently and update its harness report before continuing.

Locked decisions:

- Use the existing immutable paid-play helper and fixed 50-microSTX holder payment.
- Use a separate locally controlled Music Wallet; never the likes/personal wallet.
- Normal listening is always available and never waits for a payment component.
- The website receives public status/history and start outcomes, never signing power.
- Integrate audible starts once in `src/home/radio.js` for both first-party views.
- Production uses an authenticated companion/extension bridge, not open localhost.

Decisions that remain gated rather than implied: native packaging and OS keystore
implementation, final withdrawal reserve, production miner fee, multi-transaction
throughput, support beyond macOS/Chrome, and canonical resolution for album or
edition pointers. Do not silently choose these while implementing an earlier gate.

Source-of-truth order for the next implementation:

1. Repository and project `AGENTS.md` rules.
2. This integration plan for product and architecture decisions.
3. The linked test harness for executable gates and pass evidence.
4. The deployed contract source and dated mainnet report for proven chain behaviour.
5. The backend wizard and browser test wallet as reference code only.
6. `RADIO-PAID-PLAYS-PROTOTYPE.md` as historical rationale, not current direction.

## 1. Product decision

Use **Xtrata Music Balance** as the page/link name, **Music Wallet** for the
local account, and **Support as you listen** for the enabled mode. Suggested route:
`/music-balance`. This is prepaid optional support, not a monthly subscription,
access pass, renewal or platform-held balance. Unspent funds belong to the user.

Main message: “Add a little STX. Support songs as they start. Listening stays free.”
A user opts in once to automated per-start payments from their dedicated local
wallet. Thereafter it works in the main app radio and the standalone `/radio`
without approving individual transactions, as long as funds, signer and network
are available. Normal autoplay continues. Funding never draws automatically from
the user's ordinary wallet. There is no platform or treasury fee in this release.

The practical promise is **one transaction per eligible audible start while paid
mode is ready**, not guaranteed settlement of every click in every network state.
A network cannot promise immediate settlement, and the radio must never wait for
it. If payment cannot proceed safely, that start is free and visibly unrecorded
as a paid start. There is no later bill for missed starts.

Review correction: only an intent known never to have been accepted/signed may
be labelled free. A timeout after submitting an intent is an unknown outcome;
retain its identity, reconcile it, and do not create a replacement. Music always
continues. A late result may still confirm an already-authorised payment.

## 2. What is already proven, and what is not

- Deployed `xtrata-radio-plays-v1-0`: atomic 50 microSTX holder transfer, paid-start
  counter and wallet-scoped 16-byte receipt. Explicit core identity, no admin.
- Mainnet test: four successful payments; three at 300 microSTX network fee and
  one at 257; each paid the holder 50. The 200-fee attempt returned HTTP 400 and
  stopped the runner. Do not advertise 200 as the paid-play production fee.
- Existing likes are separate wallet-signed on-chain endorsement transactions.
- Existing measured plays track duration/completion independently.
- The wizard is a single-operator test tool, not a production end-user service.
  Its co-located unlock key, process locks, fixed test caps and failure recovery
  are not sufficient for a public wallet rollout. Keep the test wallet isolated;
  never migrate its key, funds or journal into user installations.
- Four transactions do not prove cross-tab reliability, long-running autoplay,
  reboot recovery, withdrawals, broad browser support or production security.

## 3. Local signer architecture: preserve the user's backend requirement

Recommend a signed **desktop Music Wallet companion**, with a small browser
extension communicating through native messaging. Initial supported release:
macOS + desktop Chrome, matching our test environment. Windows and other desktop
browsers follow their own support tests; mobile users continue with free radio.
Do not claim desktop local-wallet support works on iOS/Android automatically.

Why a companion: a hosted page cannot spawn an arbitrary local backend, use the
OS keystore unattended, or discover a private wallet on another device. A browser
wallet could avoid installation but changes the requested security/operation
model. A cloud signer creates custody and service responsibilities. Neither is a
silent fallback.

Why native messaging for production: our current loopback panel cannot accept
commands from xtrata.xyz; it deliberately requires its own Origin. Public-web
requests to localhost also encounter browser Local Network Access permissions.
Do not fix that by enabling wildcard CORS or exposing a public signing endpoint.
A narrow paired extension/native bridge avoids dependence on localhost HTTP for
normal playback. Validate installation and connection UX before full build.

```mermaid
flowchart LR
  S[Music Balance setup page] --> E[Paired browser extension]
  A[Main app radio] --> H[Shared radio playback hook]
  R[Dedicated /radio] --> H
  H -->|public start intent only| E
  E --> N[Local companion: policy + journal + signer]
  N --> K[OS-protected local key]
  N -->|signed play transaction| C[Existing paid-play contract]
  C --> P[Current master holder: 50 microSTX]
  C --> D[Receipt + paid-start total]
  N -->|public status| E
  E --> A
  E --> R
```

Each installation creates a fresh random key; no deterministic public secret,
embedded production key, or shared wizard account. Key generation, encryption,
signing and withdrawal approvals occur in the native process. Use OS-backed
secret storage, signed/notarized app distribution and a password-encrypted backup
verified before funding. Fail closed on insecure keystore fallback. Never send
key or backup plaintext through the website, extension, analytics or logs.

OS-protected storage enables “automatically available on this computer” after
initial approval. Computer locked, keystore denied, companion stopped or explicit
Lock means free playback until available again. Explain this during setup. A
local automatic signer is technically hot while available; do not call it cold.

## 4. Setup page and navigation

Add a normal **Music Balance** link beside radio/music navigation in the active
`index.html` homepage. Add the same link to `/radio`. No purchase modal on Play,
no required wallet connection, and no large promotional block in the player.

`/music-balance` is a single guided page whose cards progressively become a
management dashboard:

1. **Understand:** optional; real network fee plus 0.00005 STX to current master
   holder per eligible start; starts skipped after audio begins remain payable;
   data public. “Continue listening free” always available.
2. **Install and pair:** detect supported environment only after user interaction;
   install companion/extension, approve pairing with the exact production origin.
   No local-service probe or permission prompt for visitors who have not opted in.
3. **Create and recover:** companion creates wallet, exports encrypted backup and
   verifies restoration locally. Page receives public address and backup-ready
   state only. Never reuse the connected likes/funding wallet as signer.
4. **Fund:** mainnet address + copy + QR + optional reviewed transfer through the
   user's existing wallet. Amount is user-selected; default suggestion 1 STX,
   smaller amounts permitted. Funding network fee shown separately. Confirm from
   chain balance, never merely a wallet callback. Duplicate clicks cannot create
   duplicate funding requests. No automatic top-up.
5. **Enable once:** explicit native approval: “Automatically support eligible
   song starts on xtrata.xyz using this wallet until its usable balance runs out
   or I turn this off.” Show fixed fee, holder payment, total, reserve, supported
   origins and whether later top-ups resume automatically. Recommended default:
   approved top-ups resume under unchanged policy; an explicit pause stays paused.

When enabled, detection of confirmed funds activates the mode automatically.
There is no separate Enable click for each top-up or each visit. A stored setting
on the webpage alone can never authorise spending. The companion is authoritative.

Dashboard: confirmed balance; reserved/pending debit; usable balance; indicative
starts remaining; current policy; activity; top up; pause; lock; backup; withdraw;
unpair. Show exact balance only to the local user; never put it in analytics or a
public API. Do not put unbounded signup/testing controls on the production page.

### Local capability check

The radio performs a passive, bounded capability check only when the installed
extension announces itself. It must not scan localhost, enumerate extensions,
poll the chain, show a browser permission prompt or delay audio for ordinary
visitors. The page asks the bridge for one public status snapshot with a short
timeout and treats timeout, absence, schema mismatch or denial as `not-available`.
It retries only after a deliberate user action, an extension status event, or a
slow background interval while the radio is already active.

The status response contains no secret and exposes only:

```ts
type MusicWalletStatus = {
  schema: 1;
  address: string;        // dedicated Music Wallet address
  paired: boolean;
  locked: boolean;
  enabled: boolean;
  network: 'mainnet';
  policyVersion: string;
  minerFeeMicroStx: string;
  holderPaymentMicroStx: string;
  totalPerStartMicroStx: string;
  confirmedMicroStx: string;
  reservedMicroStx: string;
  withdrawalReserveMicroStx: string;
  usableMicroStx: string;
  estimatedStarts: string;
  pendingCount: number;
  attention?: 'low-balance' | 'recovery' | 'offline' | 'policy' | 'active-elsewhere';
  updatedAt: string;
};
```

The native companion is authoritative. The webpage must not infer that support
is enabled merely because an address or old balance is cached. A cached snapshot
may render immediately with a visible “checking” state, but automatic payment
intents wait for a fresh paired, unlocked, enabled status and a playback lease.
Every response must be correlated to the requesting document and request nonce;
`updatedAt` alone is not proof of freshness. The internal installation/pairing
identifier stays inside the authenticated extension/native bridge and is not
exposed to page JavaScript. Never confuse the Music Wallet address with the
separately connected wallet used for likes.

### Radio status and activity drawer

Reserve a stable area in both the homepage radio and `/radio` for a compact
**Support as you listen** control. Its collapsed states are:

| State | Display | Behaviour |
| --- | --- | --- |
| No companion/pairing | `Support as you listen` | Opens explanation/setup; free playback unchanged |
| Checking | `Checking Music Wallet…` | No payment intent; audio starts normally |
| Ready and enabled | green indicator, shortened address, usable balance | Eligible new starts are offered to the companion |
| Pending | `Supporting…` plus pending count | Audio continues; repeated media events do not duplicate |
| Paused/locked | amber indicator and reason | Starts are free; opens dashboard to resume/unlock |
| Low/empty | `Balance empty · listening free` | Starts are free; top-up action available |
| Recovery/error | `Payment needs attention · listening free` | No new signing; opens local recovery view |

Use “Music Wallet connected” only when the fresh status is paired and available.
Display a shortened address with Copy and Explorer actions, the confirmed balance,
reserved/pending amount when non-zero, usable balance, and an indicative number
of supported starts. Do not use the ordinary wallet's Connect/Disconnect buttons
for this signer. The control opens the Music Balance dashboard and offers Pause;
funding, withdrawal, policy changes and recovery always open native review.

Below the summary, an expandable **Supported starts and payments** list shows the
companion's sanitised journal. The collapsed summary includes confirmed count,
pending count and confirmed spend. Load the first page only when expanded, then
paginate with a fixed limit and cursor; do not continuously stream an unbounded
journal into the radio page.

Each row shows time, artwork thumbnail when already cached, song title, artist,
master core/id, state, holder payment, miner fee, total debit and a transaction
link when available. Pending rows show their current stage. Free starts are not
financial transactions and are omitted from this list. Unknown/recovery rows are
never labelled failed or charged until reconciliation establishes the outcome.
The public bridge returns no signed bytes, nonce secrets, private key material or
raw node responses. Suggested history response:

```ts
type SupportedStart = {
  playbackId: string;
  core: 1 | 2 | 3;
  masterId: number;
  title?: string;
  artist?: string;
  startedAt: string;
  state: 'reserved' | 'signed' | 'submitted' | 'unknown' | 'confirmed' |
    'confirmed-abort' | 'definitely-rejected' | 'recovery-required';
  holderMicroStx: string;
  minerFeeMicroStx?: string;
  totalDebitMicroStx?: string;
  recipient?: string;
  receipt?: string;
  txid?: string;
  confirmedAt?: string;
  blockHeight?: number;
};
```

The companion returns title/artist only as display hints tied to the canonical
master. The page may enrich from its existing metadata cache, but core/id and
verified chain events remain the accounting identity. History must reconcile
across refresh without requiring the user's ordinary wallet to reconnect.
`historyPage` is implicitly scoped to the paired local wallet, accepts only an
opaque cursor and a limit capped at 50, and cannot query an arbitrary address.

## 5. Shared radio integration and zero impact on free listeners

`src/home/radio.js` is the shared playback engine. It creates/selects audio,
restores tracks and feeds the standalone view through snapshots. Integrate here
once, not independently in homepage and `/radio` click handlers. Main app HTML
and `public/radio.html` render the same optional public status snapshot.

- Add a tiny optional capability stub; dynamically load payment integration only
  for a paired, opted-in installation. No seed libraries or chain polling for
  free users. Use an extension capability announcement, not scanning local ports.
- Register a best-effort asynchronous media observer. Payment errors cannot throw
  into selection, pause, next, preload or audio playback promises. Never await
  payment readiness before `player.play()`.
- First-party top-level homepage and `/radio` are in scope. The existing widget
  and full-page view within one document share one engine/payment lifecycle.
- Third-party iframes, externally hosted embeds and raw livestream connections
  remain free and cannot call the signer. First-party framed players are excluded
  initially too; explicit frame/top-level policy is tested.
- The connected personal wallet remains responsible for likes and optional
  reviewed funding. Switching/disconnecting that wallet does not switch the
  Music Wallet, reset paid receipts, alter liked songs or secretly disable support.

Status chip occupies a reserved small slot: “Free listening”, “Supporting songs”,
“Payment pending”, or “Free - top up / reconnect / payment needs attention”. For
nonparticipants retain the existing radio layout apart from the navigation link.
No error modal or automatic redirect. Text and accessible live status accompany
colour. Rate-limit notifications; a single persistent reason is enough.

## 6. What counts as a paid start

Create a public random playback ID and canonical `(network, core, masterId)`
before calling play. Capture immutable identity before asynchronous events: the
current normal selection assigns nowPlaying after play resolves, so it is unsafe
to infer payment identity from a late UI snapshot. Do not change ordinary counter
semantics to solve this financial identity requirement.

| Event | Paid action |
| --- | --- |
| First successful unmuted playback, volume above zero | One start intent |
| Prefetch, loading failure, blocked autoplay | None |
| Pause/resume, buffer recovery, seek, repeated playing event | Reuse ID; none extra |
| Starts muted then unmuted while playing | First audible start only |
| New song, deliberate replay, natural loop | New playback ID and start |
| Rapid skip after audible start | Prior eligible start remains payable |
| Reload/reconnect restoring same playback | Reuse backend receipt; never charge twice |
| Ambiguous restored identity | Free until next unambiguous track selection |
| Funding arrives halfway through a freely started song | Start support at next new start |
| Switching between two UI views of same playback | No new start |

Persist playback identity for restoration before starting; never persist a new
identity for a failed load as though payment happened. Handle native loop wraps
explicitly (ended does not necessarily fire); distinguish rewind/seek from wraps.
Free analytics, paid starts and likes stay separate fields and separate semantics.

## 7. Companion bridge and cross-tab coordination

Pairing requires a user gesture and native confirmation, binds exact HTTPS origin
and browser installation, and has revocation. Extension validates top-level tab,
origin, document instance and schema. Native host only accepts the installed
extension ID. Production excludes preview domains, wildcard subdomains, opaque
origins and arbitrary local pages. Inscribed HTML remains sandboxed and cannot
inherit extension privileges or invoke the bridge.

Expose only `status`, `historyPage`, `acquirePlaybackLease`, `startIntent`,
`releaseLease` and `openDashboard`; funding/withdrawal/policy changes require
native review. No arbitrary signing API, caller-selected recipient, arbitrary
contract/network, nonce, serialized transaction or spending amount. Backend pins
helper and verifies source/config. Secret key never enters bridge messages. Public
pairing identifiers are not themselves spending credentials.

One installation-wide backend writer, durable SQLite transaction journal and
unique `(wallet, playbackId)` constraint. One automatic-support playback lease
per wallet prevents multiple tabs from silently draining one balance. Other tabs
play free with “Support active in another tab”; takeover is explicit. Heartbeats
use bounded leases; loss pauses new intents, not music. In-page widget and full
radio do not compete when they are the same engine instance. Browser restarts
reconcile backend journal before accepting new starts.

Origin restrictions do not make a compromised trusted site harmless. Treat start
intents as untrusted; independently validate master, frequency, policy and budget.
The backend cannot prove physical listening from browser messages. Explain that
this records paid starts, not certified listening. Review trusted-page CSP and
inscription isolation before production activation.

## 8. Policy, costs and balance exhaustion

Initial recommended fixed miner fee: **300 microSTX**, plus fixed holder payment
50, total **350 microSTX (0.00035 STX)**. Show tested 257 as evidence, not a universal
minimum guarantee. Obtain current relay/fee diagnostics but never silently exceed
the approved fixed fee. If that fee is unsuitable, continue free and request a
policy change on the dashboard. Low-fee experiments remain in canary only.

Usable = confirmed chain balance - locally reserved maximum debits - withdrawal
reserve. Use integer microSTX and atomic reservations. Determine reserve from a
protected withdrawal envelope/fee policy; 1000 microSTX is a provisional floor,
not a guaranteed withdrawal cost. Display leftover reserve/dust honestly.

Estimated starts = floor(usable / 350) under this fixed policy; no expiry or
promised monthly allowance. No hidden 0.1 STX deduction. When a new reservation
cannot fit, mark balance-low and continue free, then resume on next new start
following a confirmed top-up if support was left enabled.

Default authorisation is the user's usable prepaid balance until paused, not the
wizard's 5-test/0.01-STX caps. Optional daily spending limit belongs in advanced
controls and is enforced by the companion. Fee changes, new helpers, new payment
recipients/models and origins require new consent; an app update cannot silently
expand a saved policy. Top-ups do not override an explicit lock or pause.

## 9. Durable payment pipeline and failure recovery

At most one unresolved transaction at first release. A small unsigned queue can
hold at most three intents for 60 seconds while a normal confirmation completes;
reserve their full costs immediately. Expired/overflowed intents become free and
release reservations. No queue replay on a later visit or after funds return.
Queue pressure changes paid status only; it never delays or rejects audio.

This conservative first release will not pay every song during normal block
confirmation delays: one transaction may be unresolved while up to three starts
wait briefly, after which further or expired starts are free. State that limitation
in the UI and reports. Multi-nonce or multi-unresolved throughput is a later gated
design decision requiring new recovery tests; it is not a harmless optimisation.

State machine: observed -> reserved -> signed -> submitted/unknown -> confirmed,
confirmed-abort, definitely-rejected, expired-free or recovery-required. Persist
signed bytes, txid, nonce and policy snapshot atomically before broadcasting.
Public reports never include signed bytes. Retry only identical bytes after
read-only reconciliation, with bounded backoff and the original policy. Never
create a new receipt/nonce to escape uncertainty.

Reconciliation checks sender, txid, call arguments, master, receipt, fees, canonical
block and transfer event. Reorg handling reopens the original entry, not a new
payment. An included abort can spend its miner fee and must update accounting.
Resolve API inconsistencies conservatively without freezing the radio.

The present runner records a generic HTTP 400 and wedges its journal. Production
must preserve sanitised node reason codes, distinguish definite nonacceptance
from unknown outcomes, and prove nonce/receipt state before releasing reservations.
Do not broadly treat all 400/404 responses as permission to sign another payment.
The existing rejected test entry is a recovery fixture, not something to delete.

Pause cancels unsigned intents and future automatic signing. Signed-but-unsent
transactions remain quarantined for explicit recovery, because signed bytes may
still be executable. Submitted transactions may confirm. Restart/upgrade reconciles
first and requires a fresh active player lease; no daemon-generated synthetic starts.

## 10. Master resolution, compatibility and data

V1 supports verified direct masters in explicitly supported cores. Do not resolve
payments by song title, artist field, first dependency or fallback core search.
Album/edition pointers need a separately tested canonical-reference resolver with
cycle/ambiguity/content checks before payments are enabled for them. Unresolved,
unsupported, self-owned or escrow-held masters play free with a reason; the existing
contract rejects those payments. No new helper is needed for supported direct masters.

Do not conflate a holder with a copyright owner or always with the artist. The
contract pays the current standard-principal holder at execution, including after
a sale while a transaction is pending. It is not an artist-split contract.

Add an idempotent chain event index (txid + event index; canonicality tracked) for
paid starts and actual holder receipts. Reuse server-side Hiro authentication and
bounded cache; never accept browser-claimed paid totals. Catalogue fields:
measured plays, completed listens, on-chain likes, confirmed paid starts, confirmed
holder payments. Show freshness/unavailable state, never convert unavailable to 0.
Subscription wallet addresses are public on chain; avoid joining them to personal
likes wallets in telemetry. Installation secret backups are never uploaded.

## 11. Recovery and compatibility are launch requirements

- Native-reviewed withdrawal to a user-confirmed mainnet address, with fee preview,
  pending reconciliation and a recovery reserve. No automated sweep or refill.
- Verified encrypted backup export/import; one active device per key. Moving a
  wallet requires old signer shutdown and fresh pairing. For two devices recommend
  separate balances; detect foreign nonce use and pause support on conflicts.
- Clear uninstall guidance: withdraw or verify backup first. Updates preserve keys,
  journal, pairing and revocation state, and use signed distribution.
- Local signer unavailable, unsupported browser, mobile, denied permissions,
  offline chain, corrupt storage, low funds or paused mode all preserve free radio.
- No installation-dependent feature gating for normal playback, likes, catalogue,
  minting or connected-wallet workflows.

## 12. Implementation map and stages

Proposed new code (names may be refined during implementation):

| Area | Location / work |
| --- | --- |
| Navigation | `index.html`, `public/radio.html`; preserve layout |
| Setup/dashboard | `public/music-balance.html`, `src/music-balance/` |
| Shared start adapter | `src/home/radio.js`, new `src/lib/radio/paid-plays/` |
| Status/activity UI | shared radio renderer plus stable CSS slot; paged sanitised journal view |
| Pure protocol/policy | reusable master ID, transaction, intent and public status schemas |
| Native companion | `tools/music-wallet/`: OS vault, SQLite queue, nonce owner, signer, policy, recovery |
| Browser bridge | `extensions/music-wallet/`: pairing and constrained native messaging |
| Public data | paid-start event index/API and catalogue integration under functions/radio |
| Tests | unit, simulated transactions, mocked native bridge, real radio Playwright fixtures |
| Operator tooling | existing wizard/canary retained independently; never user-wallet storage |

A. **Capability/status vertical slice:** define and test versioned `status` and
`historyPage` schemas, absence/timeout behaviour, native authentication and a fake
companion. Render every status and history state against the existing radio with
no signer and no payment hook. Measure that free visitors get no prompt, polling
or playback delay.

B. **Compatibility spike and security design:** signed native host + extension,
pairing, keystore restart behaviour, trusted origin restrictions and zero prompts
for free users. Confirm package/distribution plan before claiming public readiness.

C. **Shared protocol and recovery:** production policy, persistent idempotence,
master resolver, reserve/nonce accounting; recover definite rejection and unknown
submission fixtures. Add withdrawal/backup restoration before asking users to fund.

D. **Setup/dashboard:** native creation, backup verification, funding detection,
one-time opt-in and persistent mode. No paid radio hook active yet.

E. **One radio hook:** in-app and standalone using identical integration; mock all
payments through exhaustive media/reload/tab tests. No extra local permissions or
payment bundles for free users. Feature flag remains off.

F. **Own-wallet mainnet canary:** fresh disposable balances, separately bounded
authorization, long playlist, two-tab/reload/background/sleep tests, exhaustion,
confirmed top-up, failed-fee recovery, withdrawal and audited receipts. Never test
with users' existing funded music wallets. Existing initial tests are insufficient.

G. **Small opt-in rollout:** macOS/Chrome first; allowlist capability, staged flags,
rollback that stops new intents while retaining recovery tools. Only then expand
browser/OS coverage. Mobile is a separate delivery milestone.

## 13. Acceptance matrix and release gates

The executable gate sequence, failure matrix, report format and iteration rules
are defined in the [Support as you listen test harness](RADIO-MUSIC-BALANCE-TEST-HARNESS.md).
The default harness is offline and cannot broadcast. Its mainnet canary is a
separate final gate requiring a fresh disposable wallet and separately recorded,
bounded authorisation.

1. New visitor: identical free audio start latency/controls; zero signing, local
   discovery, wallet prompts or extra chain polling. Lazy stub performance measured.
2. Funded opted-in user: first eligible start produces one exact payment, both
   homepage and /radio; no per-song wallet popup. Correct master after fast skips.
3. Reload, repeated playing, buffer, pause/resume, seek and page handover cannot
   duplicate payment. Explicit replay and natural loop each produce a fresh start.
4. Native stop, keystore lock, companion crash, bridge denial, missing metadata,
   storage failure, offline API, slow confirmations and queue overflow never stop music.
5. Two tabs/instances cannot spend concurrently or duplicate one playback. Takeover
   is visible; stale leaders cannot retain signing rights.
6. Empty/insufficient balance plays free; confirmed top-up enables next start only;
   paused mode stays paused; no catch-up debit for prior free songs.
7. Crash injection around every journal/broadcast boundary preserves max debit,
   receipt identity and nonce. Duplicate relay cannot double-pay. Reorg and abort
   tests reconcile exact fees and ownership at execution.
8. Wrong network/core/contract/recipient, changed fee/policy, untrusted origin or
   subframe cannot request a payment. Key/backup/raw transaction absent from logs.
9. Verified backup restores the same address; withdrawal succeeds after safe queue
   resolution; losing/denying local state never traps the radio in paid-only mode.
10. All new receipts reconcile with chain counters and exact transfer events;
    ordinary metrics and on-chain likes remain unchanged.

Do not enable production until these gates pass. “Until balance runs out” means
usable balance after reserve and reservations, while the companion and chain are
available. It cannot mean guaranteed payment during failures without either
blocking music or creating later catch-up charges, both excluded by this design.

## References

- Internal evidence: `docs/radio/reports/2026-09-15-wizard.md` and JSON audit.
- Current engine: `src/home/radio.js`; normal selection and restore paths both
  call `playCounter.select` before audio playback; normal nowPlaying updates late.
- Current backend: `scripts/wizard/radio-plays-backend.mjs`, server and suite.
- Chrome Local Network Access: https://developer.chrome.com/release-notes/142
- Electron OS-protected storage: https://www.electronjs.org/docs/latest/api/safe-storage
  (macOS production app should be signed; Linux fallback must be checked).
- Native messaging implementation must be verified against browser documentation
  during the compatibility spike; this plan does not claim current cross-browser support.
