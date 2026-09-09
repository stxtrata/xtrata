# Implementation handoff: server-independent X Chess Quick Play

Authoritative user requirements, 9 September 2026. Implement this in the active
X Chess candidate you are already developing. Coordinate your own existing work;
do not overwrite the separate 2.2.0 release or another agent's changes.

## Objective and scope

Build an optional peer-to-peer mode in which two named players register a game
on chain, exchange signed moves off chain, and either can inscribe the complete
finished game without obtaining another signature from the loser. No mandatory
operator-run chess service, hosted referee, account server, database, or relay.
The inscription must contain or immutably reference everything needed to verify
and replay the completed game after transport services disappear.

The user accepted the following tradeoffs:

- Direct networking cannot be guaranteed on every network without a relay.
- Manual connection exchange and signed-message copy/paste provide durable
  fallbacks that require no particular transport provider.
- Clocks are advisory in this iteration. Clock expiration and disconnection do
  not establish a verified win. Preserve unfinished games for resumption.
- On-chain abandonment challenges, enforceable timeouts and competitive ranking
  are later work, not part of this implementation.

Do not deploy contracts, send live transactions or inscribe anything during
development. Build, test and package reviewable artifacts with deployment and
inscription instructions. Simnet, fake wallets and local browser tests are fine.

## Important correction to previous material

`reviews/fast-play/IMPLEMENTATION.md` proposed a trusted clock/order service.
That recommendation is superseded by this handoff. Its Node proof in `proof.mjs`
and 17 tests require referee signatures: they are useful experiments but are NOT
the accepted peer protocol and do not validate the new implementation. Remove
the referee assumption rather than concealing it behind an optional endpoint.

`X-Chess_2.0/docs/PLAN-offchain-play.md` is historical research, not an approved
specification. Do not inherit its claims that two transactions always suffice,
that highest-sequence settlement automatically proves a winner, that abandonment
is necessarily a loss, or that signed off-chain games have identical ranking
guarantees to the existing canonical on-chain log. These need more protocol work.

## Player journey

1. **Create:** choose the named opponent, colours and an advisory timing preset
   (or untimed). Generate a game-specific key locally and register its public
   key with the immutable opening settings in a creator transaction.
2. **Join:** only the named opponent can join, registering their own local game
   public key in a second transaction. Show exactly the settings being accepted.
3. **Connect:** exchange a WebRTC offer and answer manually through copy/paste
   or files. Verify that the session is bound to the joined game and keys.
4. **Play:** both browsers validate and automatically sign their own moves.
   No wallet dialogs or blockchain transactions per move. Retain signed history
   locally before treating a move as safely sent/received.
5. **Recover:** reconnect by exchanging fresh connection descriptions and
   synchronize verified history. Export/import signed moves or transcript
   extensions if automatic networking is unavailable.
6. **Finish:** derive checkmate/draw by replay, or verify a signed resignation.
   The winner sees “Review & Inscribe”. The other player can also export or
   inscribe. There is no “opponent must approve this result” step.
7. **Archive:** publish the full signed evidence, not just a result or hash.
   Verify the sealed bytes after inscription. Keep a downloadable archive if
   signing, upload, or discovery is unavailable.

A two-browser local demonstration mode may precede deployment. Label it clearly:
its keys prove continuity within the session, not verified Stacks identities.
Do not invent a deployed registry or mark a local opening as chain-verified.

## Minimal registry and wallet integration

Use a new versioned registry contract or an explicitly separate extension in the
active candidate. Do not reinterpret old five-character move entries.

Suggested surface:

```text
create-peer-game(opponent, creator-colour, creator-public-key, descriptor)
join-peer-game(game-id, expected-descriptor-hash, opponent-public-key)
get-peer-game(game-id)
```

Derive each wallet identity from its transaction sender. Restrict joining to the
named opponent; allow it exactly once. Freeze colours, rule version, starting
position, time configuration, key algorithm and player keys. Prevent settings
changes, key replacement and unilateral cancellation after joining. If invitation
expiry/cancellation exists, it must apply only before joining. No wagering,
sponsorship or fee machinery is needed for this new mode unless already required
by the active app. Document actual network fees without fixed promises.

Every signed message must bind to a canonical hash of the complete joined
descriptor, including network, registry contract, game ID, players, public keys,
engine/rule version and a unique match nonce. Confirm and verify the joined chain
record before enabling verified play. Reject a read-back mismatch. Handle wallet
cancellation and uncertain transaction outcomes without automatic rebroadcasts.

The captured Xtrata bridge's `SHIM_METHODS` in
`X-Chess_2.0/harness/runtime/captured/2026-09-07/wallet-shim.js` lacks message
signing methods. Two contract calls avoid requiring wallet-message signing.
Single-transaction creation with both players' prior wallet-signed authorizations
is a future optimization, not a reason to block this version. Verify current
bridge behavior through tests rather than assuming direct-extension behavior.

## Cryptography and event protocol

Use established signature primitives, not custom cryptography. Select an
algorithm supported in target browsers and the offline verifier; freeze exact
public-key/signature encodings and test vectors. A registered game public key
does not have to be a wallet's spending key. Native Web Crypto P-256 is one
candidate; Ed25519 requires checking the supported browser/runtime matrix.

Private game keys remain on the player's device. They authorize this match only;
never request or export wallet seed phrases/private keys. Choose recoverable
local storage deliberately. If recovery exports contain private game keys, make
them encrypted and explicitly distinct from public game archives. Losing the
game key means losing the ability to sign further moves unless a safe recovery
mechanism was established beforehand; never silently generate a replacement.

Use an unambiguous, bounded, versioned encoding. Do not rely on arbitrary JSON
property order. An illustrative protocol is:

```text
match = SHA256(canonical joined descriptor)
H0 = SHA256(canonical [protocol-domain, match, starting-position])

eventPayload = {
  protocol, match, sequence, previousHash,
  actor, kind, value, resultingPositionHash
}
signature = Sign(actorGamePrivateKey, canonical eventPayload)
Hi = SHA256(canonical eventPayload)
```

Each next payload includes `Hi`; signatures are verified separately. Domain
separation and the match commitment prevent signatures being reused in another
game or application. Include promotion choices. Position identity must capture
side to move, castling and en-passant rights as well as pieces; retain the complete
history for repetition/draw rules. Hashes bind history but do not establish that
its moves were legal: always replay through the pinned chess engine.

Freeze the exact event grammar and sequencing before implementation. For v1,
prefer move events and resignation; derive automatic draws from the explicitly
selected rules. Defer negotiated draws if implementing their offer/accept state
machine would delay correctness. Do not shoehorn an off-turn resignation into
the next mover's turn: authenticate the resigning player separately and bind it
to a specific accepted history root. Handle concurrent resignation/move evidence
explicitly, without silently overwriting a branch.

Both sides sign only their own actions. Do NOT require both signatures for every
move or a countersignature on the terminal move: that recreates the loser veto.
An acknowledgment may help delivery, but cannot gate the validity of a signed
terminal move. The next signed move implicitly acknowledges its preceding root.

The winner can retain and publish their signed mating move with the opponent's
prior signed history even if the opponent disconnects before acknowledging it.
The archive verifier derives mate independently. This proves the signed game
line, not that the opponent's browser displayed the final move.

## Forks, state synchronization and limits of the guarantee

A signed hash chain authenticates a line of play. It does not prove that no other
signed branch exists. A malicious player can sign two different moves at the
same sequence. No hosted referee means no universally ordered off-chain log.

- Refuse to sign a different action at an already signed sequence/root, including
  after reload or in a second tab. Serialize local signing and persist the signed
  action before transport. Use appropriate locking/concurrency guards.
- Deduplicate identical events; accept only a verified extension of the current
  history. Do not overwrite local state merely because a remote log is longer.
- Verify the complete shared prefix, signatures and legality on reconnect/import.
- Preserve conflicting evidence and visibly mark a dispute. Do not auto-select
  the highest sequence or first uploaded result as authoritative.
- Distinguish “valid signed game line” from a globally unique competitive result.
  No automatic integration into the existing ratings or payouts.

The loser cannot veto publication of an already evidenced result. That is not a
promise to force completion, prove clock honesty or resolve every malicious fork.
Do not misrepresent this boundary in UI copy or release notes.

## Networking without a mandatory backend

Use `RTCPeerConnection` with a reliable, ordered `RTCDataChannel`. Implement
manual offer/answer exchange, preferably gathering the necessary ICE candidates
before exporting each description to reduce repeated exchanges. Bind the channel
to the intended match and authenticate all game messages regardless of transport.
Enforce message size/rate limits and validate every imported field.

No fixed signaling server or chess API is required. `window.postMessage` can
support frames/windows within the local browser, but is not remote networking.

STUN and TURN may be optional configurable connection aids. Explain their roles
and do not describe public endpoints as permanent or infrastructure-free. Default
behavior must not silently require a managed TURN account. If no direct route
exists, give a useful explanation and offer signed-message export/import. Never
promise universal connectivity without relays. Do not persist relay credentials
in public exports or immutable app code. Connection descriptions may reveal IP
addresses and should not be included in permanent game archives.

On channel loss, preserve the match, show disconnected status and enable fresh
offer/answer exchange. Close obsolete peer connections and bound negotiation
timeouts. Protect against duplicate channels, stale callbacks and oversized
transcript floods. A rejected import must leave the previous verified game intact.

## Advisory clocks

Label clocks advisory and exclude them from verified-result decisions. Clock
expiration must never synthesize a resignation or a timeout win. State how clocks
behave during refresh/disconnection; do not imply a local elapsed-time display is
independent evidence. Untimed play is the safest default. A finished board result
is verifiable; an abandoned nonterminal board remains unfinished/resumable.

On-chain challenge deadlines and enforceable real-time clocks are explicitly
deferred. Do not add an oracle/referee service to solve them in this iteration.

## Public archives and inscription

Publish the complete joined descriptor/opening reference, rule/engine identifiers,
player public keys, signed events, final history hash, final position and derived
result/termination. Omit private keys, connection descriptions and local settings.
Reject unsupported versions and forged result labels. Permit unfinished recovery
exports but do not label them completed-game inscriptions.

An independent reader must verify the chain opening when available, authenticate
signers, replay all moves, recompute hashes and derive the outcome. If the opening
cannot be fetched, distinguish “signatures/replay valid; opening unverified” from
“verified on-chain identities”. Self-contained evidence is not automatically
proof that the claimed registry record exists.

Reuse the active project's supported Xtrata inscription workflow. If there is no
embedded uploader, produce the exact upload-ready archive and a documented
existing inscription flow; do not invent wallet APIs. An optional immutable
viewer dependency can reduce per-game bytes, but it must be pinned and available
on chain. Measure actual byte/chunk counts and include content hashes. A completed
game inscription can require multiple transactions. Either player can publish;
an archive submitter's address is not evidence of winning. Deduplicate copies by
game identity and final root, and flag known conflicting records.

## Required acceptance tests

1. Two independent browser contexts finish Fool's Mate over a real WebRTC data
   channel with no application server carrying moves. Closing the losing context
   before final acknowledgment does not prevent exporting/verifying the mate.
2. The same game completes with WebRTC unavailable using manual signed messages.
3. Public archive verifies in a fresh offline reader; no runtime CDN or service
   calls are needed for signature checking and chess replay.
4. Tampering with move, signer, order, sequence, prior hash, game ID, network,
   contract, key, final position or result is rejected. Signed illegal moves fail.
5. Duplicate/out-of-order messages, truncation, alternative branches, simultaneous
   channels, stale callbacks and reconnect imports do not corrupt state.
6. Refresh/resume retains keys and exact signed history. Two tabs cannot make the
   ordinary client sign conflicting moves. Storage denial/quota failure is clear
   and does not falsely claim a successful save. Recovery exports restore safely.
7. Advisory expiration/disconnect never becomes a verified win. Resignation and
   automatic draws follow the frozen event/rule semantics.
8. Simnet verifies named-opponent-only joining, identity derivation, immutable
   descriptor/keys, duplicate join rejection and pre-join expiry if implemented.
9. Actual frontend create/join ABI is exercised against simnet or a faithful
   adapter; fixture-only crypto tests do not establish contract integration.
10. Captured Xtrata direct/framed runtime, wallet cancellation, pending transaction
    recovery, desktop/mobile layout and keyboard navigation are checked. Distinguish
    real-extension/manual checks from fake-wallet automation in the report.
11. Connection configuration and unavailable STUN/TURN scenarios fail usefully;
    manual mode still works. No mandatory app endpoint is contacted at startup.
12. Build the single-file inscription candidate, check size/dependencies, bind
    test reports to its SHA-256, and verify unchanged existing game behavior with
    the relevant regression suite. Do not claim mainnet inscription compatibility
    solely from a Node proof.

Deliver source, build artifact, registry source, test results, an honest list of
remaining deployment/manual checks, and concise user instructions. Proceed with
implementation using these defaults; no further product decision is needed to
begin. Keep the user's permanence requirement ahead of convenience shortcuts.

## Technical references

- [WebRTC data channels](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Using_data_channels)
- [WebRTC signaling](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling)
- [STUN/TURN and network limitations](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Protocols)
- [Scope of window.postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
- [Web Crypto key generation](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey)
