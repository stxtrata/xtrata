# X Chess: fast play with unilateral final inscription

Design and local proof of concept — 9 September 2026. No contract deployment,
wallet operation, live server or inscription has been performed. This is a new
mode proposal, not a change to the existing 2.2.0 release or the separate 3.0 work.

## Recommendation

Use an on-chain match registry, game-specific signing keys, and a small WebSocket
service that orders moves and keeps the official clock. Store the full signed
game record in an Xtrata inscription when play ends. Either player can publish
it without another signature from the opponent. Give the winner the prominent
“Review & Inscribe” button; also let the other player download or inscribe it.

The service is trusted for clock readings, availability and a single accepted
history. Chess legality and board-derived outcomes remain independently checked
by replaying the existing engine. This mode therefore needs a service during
play; the completed archive must remain readable and verifiable after that
service disappears. It should initially have separate history/rankings from
existing on-chain games and no automatic payouts.

## The simplest player flow

| Step | Player action | Blockchain activity |
| --- | --- | --- |
| Create | Choose opponent address, colours and clock; approve registration of this game's public key | Creator transaction |
| Join | Invited opponent checks settings and registers their game public key | Opponent transaction |
| Ready | Both browsers confirm readiness after the joined match is confirmed | None; signed start protocol |
| Play | Click normal chess moves; see the opponent's moves and clock | None; automatic game-key signatures |
| Finish | Board reaches a terminal position, resignation is received or official clock expires | None; service persists and distributes ending evidence |
| Record | Winner reviews the archive and approves inscription; opponent approval is unnecessary | Xtrata inscription workflow, potentially several transactions |

Either colour can create the game. The player who loses may refuse to join, but
cannot withdraw the already-granted game authorization after play starts. The
application never gets the player's wallet private key. A game key authorizes
only that match's actions; it cannot transfer wallet funds or authorize another
game. A compromised game key can nevertheless make moves or resign that game.

Two setup transactions are the simplest fit for the current environment. The
captured production bridge at
`X-Chess_2.0/harness/runtime/captured/2026-09-07/wallet-shim.js` exposes contract
calls but its `SHIM_METHODS` list does not expose message signing. This observation
is about that captured bridge, not proof that every current wallet lacks support.

A later one-transaction opening could include both players' prior wallet-signed
authorizations of an exact match descriptor and session public keys, with a unique
nonce and expiry. One player pays to register both. This requires verified
message-signing support through the actual Xtrata bridge and on-chain signature
validation. It cannot safely omit the invited player's consent. Stacks documents
[structured message signing](https://docs.stacks.co/stacks-connect/message-signing)
and [SIP-018 domain separation](https://github.com/stacksgov/sips/blob/main/sips/sip-018/sip-018-signed-structured-data.md).

## Opening commitment and minimal contract

Use a separate versioned fast-game registry rather than pretending an archive is
a sequence of the current contract's five-character `submit` entries. The current
2.0 contract and the local 3.0 descriptor prototype still use per-move logs.

Suggested contract surface (design, not deployed code):

- `create-fast-game(opponent, colour, creator-game-key, descriptor)`: takes the
  creator identity from transaction sender, pins both wallet addresses, immutable
  rules/clock descriptor and referee public key, and records the creator key.
- `join-fast-game(game-id, expected-descriptor-hash, opponent-game-key)`: only the
  named opponent can join once; their transaction anchors consent and their key.
- `get-fast-game(game-id)`: returns the full immutable joined descriptor and keys.
- Expiry/cancellation applies only to unjoined invitations. Once joined, neither
  player may rewrite settings, replace keys or unilaterally cancel the game.

The descriptor includes protocol and encoding versions, network, registry
contract, unique game identity, wallet addresses, colours, starting position,
engine/rules identifier, base time, increment, start policy, latency policy,
disconnect/outage policy, draw/timeout rules and referee key. Pin the full final
joined descriptor into every readiness, move, receipt and ending signature.
Use integer milliseconds and bounded fields; reject unknown protocol versions.
Start play only after the required confirmation policy and both signed ready
messages. An unstarted invitation is never a win by timeout.

An optional later `record-archive` operation could advertise an inscription ID
and content digest. It must not treat a caller's result string or the first
uploaded archive as truth. Keeping an extra result-index transaction out of v1
is simpler: an archive names its opening contract and game ID and readers verify
the relationship. Production still needs a concrete discovery/indexing route
through Xtrata metadata/search or an app-maintained index; a manual inscription
link works independently. No automatic competitive ranking in this first mode.

## Automatic move signing and cumulative hashes

Generate one signing key pair per player per game. Store the private key locally
using supported browser cryptography; send only the public key at registration.
The service never receives private player keys. Freeze a supported algorithm and
encoding after testing the target desktop/mobile browsers and inscription
frames. Prefer platform cryptography where supported; bundle any required
audited verifier into the archive reader, with no runtime CDN requirement.
The proof uses Node Ed25519 and does not establish browser compatibility.
[MDN documents Web Crypto key generation and compatibility constraints](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey).

For each ply:

1. The browser signs a move intent containing the match commitment, sequence,
   previous accepted history hash and UCI move (including promotion choice).
2. The service checks the correct player's signature, current sequence, previous
   hash, legal move and official deadline. It serializes acceptance per game.
3. The service appends a durable receipt containing the move-intent hash, previous
   history hash, resulting FEN, sequence, clock balances and acceptance time.
   It signs that receipt and delivers it to both players.
4. Both clients verify it, persist it and use its hash as the next history hash.
   A local animation before receipt is provisional; only an accepted receipt
   advances the official game.

Illustratively, with an unambiguous versioned canonical encoding:

```text
match = SHA256(joined on-chain descriptor)
H0 = SHA256(signed-start payload bound to match)
Mi = {match, sequence, previous: Hi-1, move}
Ri = {match, sequence, previous: Hi-1, moveHash: SHA256(Mi),
      resultingFEN, acceptanceTime, remainingClocks}
Hi = SHA256(Ri)
```

The mover signs `Mi`; the referee signs `Ri`. Signature bytes are verified
separately rather than used as the history identity. Hashing this way commits to
every preceding move and receipt, not just the final board. Replaying the moves
checks castling, en passant, promotion, repetition history and legal outcomes.

Hashes alone are insufficient: an attacker can construct another history and
recompute all its hashes. Authorized signatures prevent that substitution.
Player signatures alone can still describe competing branches if a player signs
two moves at the same sequence. The referee supplies the canonical order and
must never accept/sign conflicting receipts. A malicious referee can equivocate;
two valid conflicting referee receipts are evidence of a disputed match, not a
reason to accept whichever archive arrives first. This design trusts the referee
not to do so; it is not a trustless state channel.

## Finishing without a loser veto

| Ending | Required evidence | Opponent approval at the end? |
| --- | --- | --- |
| Checkmate | Full signed accepted history; independent replay derives mate and winner; referee terminal certificate binds its canonical root | No |
| Resignation | Resigning player's signed event bound to current match/root, durably accepted by referee | No additional approval |
| Board-derived draw | Accepted history, versioned draw policy and replay | No |
| Agreed draw | Signed offer and acceptance already present in event history | Both agree to the draw itself; no later publication approval |
| Clock expiration | Referee's signed expiration certificate bound to accepted root and time control | No |
| Player disconnect | Clock continues under the pre-agreed policy; eventual timeout evidence | No |
| Untimed abandonment | Preserve unfinished history; no invented winner | A missing player cannot be forced to finish an untimed game |
| Referee outage | Apply the published outage policy; no unsupported timeout wins | Availability limitation belongs to the service, not the loser |

Persist the final certificate automatically at termination, before notifying the
players. Serve the complete transcript/certificate by game ID even when one
player has disconnected. Allow either participant to copy the same result and
retry an inscription after rejection or network failure. Do not require a
wallet signature from the loser, an “accept result” click, or their presence.

For a win by checkmate, the losing player's last ordinary move is already signed
before the winner delivers mate. For a loss on time, the losing player need not
send anything: the previously authorized referee records expiration. A loser
may refuse further moves, but cannot prevent a timed game from reaching its
defined timeout ending while the service is available.

## Clock rules and trust

Offer bounded presets such as 3+2, 5+3 and 10+5 initially, plus untimed casual
play with the explicit abandonment limitation. A 5+3 clock means five minutes
per player with three seconds added after each accepted legal move.

The server's acceptance time controls the clock. Consume time on the side to
move; a move reaching the service at or after its deadline is too late. Add the
increment exactly once after successful acceptance. Duplicate transmissions
return the existing receipt and never add time twice. Invalid moves do not stop
the running clock. Client timestamps are advisory only. Show network status
and explain that transit delay counts under this simple initial policy.

Use monotonic elapsed time within a running process and durable game records.
Acceptance, clock update and terminal status must be atomic per game. A recovery
policy must handle process restarts, clock jumps and uncertain outage intervals;
do not silently restart a clock or assign a loss based on guessed downtime.
For v1, mark an unresolvable service interruption as an interrupted game rather
than fabricating a winner. Participants disconnecting does not trigger this
service-outage exception. Test reconnects and application crashes separately.

Timeout adjudication must define when an opponent cannot possibly mate and a
flag instead produces a draw. This is not solved merely by testing whether the
whole position has insufficient material. The existing engine's draw policy
must also be explicitly carried into or revised for this mode. The proof below
only verifies expiration evidence; it intentionally returns no timeout winner.

A referee signature proves that the designated service attested to a time. It
does not cryptographically prove the service's clock was honest. Removing that
trust requires a much larger dispute protocol, normally including on-chain
challenge transactions and response windows. Such a protocol cannot promise
only setup and final inscription transactions in every disputed game, and its
chain deadlines do not directly prove second-level blitz timing.

## What gets inscribed

Archive the opening reference and descriptor, player keys, start evidence, full
move/event log, player signatures, referee receipts, final root/FEN, terminal
certificate and versioned rule/verification references. A compact JSON or binary
format plus a recursively referenced immutable viewer can avoid repeating the
entire app per game. Never retain only a server URL, board hash or winner label.

The reader resolves the confirmed opening, verifies identities and signatures,
recomputes the history hashes, replays legal moves, derives the result or checks
the appropriate clock/resignation/draw evidence, and only then labels it valid.
An uploader's wallet identity is not proof of winning. Different people may
inscribe copies; deduplicate by registry/game/final-root rather than assigning
multiple wins. Flag conflicting certified outcomes. Download the archive before
starting inscription, retain it locally on failed signing, and read the sealed
bytes back from chain to verify the digest after inscription completes.

During fast play there are no move transaction fees. Opening/joining and the
final inscription still cost fees; actual payload sizes and transaction count
must be measured against the chosen Xtrata workflow before quoting savings.

## Implementation sequence

| Order | Work | Completion evidence |
| --- | --- | --- |
| 1 | Freeze fast-game descriptor, canonical encoding, move/event and clock rules | Golden vectors; independent hash/signature/replay verification |
| 2 | Implement minimal create/join registry | Simnet tests for caller identity, fixed opponent/settings, single join, invitation expiry, immutable keys |
| 3 | Implement game-key creation, registration and readiness UI | Desktop/mobile and direct/framed wallet tests; no per-move wallet prompts |
| 4 | Implement persistent WebSocket referee | Atomic sequence/clock acceptance, reconnect recovery, duplicate suppression, terminal persistence, deliberate outage tests |
| 5 | Add Quick Play board and clock controls | Two real browser clients play full games, reconnect, resign, promote and run out of time |
| 6 | Add archive serializer, independent viewer and inscription action | Tamper tests, offline replay, size budget and test inscription read-back |
| 7 | Review fast-mode ranking/disputes separately | Published trust policy and verification gates before competitive use |

Existing reusable code: `packages/chess/engine.ts`, board UI, chain encoding and
wallet contract-call support. New code: session authorization, fast-game schema,
clock/event replay, transport, referee persistence, registry and archive reader.
The 2.2.0 build and in-progress 3.0 files were not changed by this experiment.

## Local evidence and limits

Run from the X-Chess workspace:

```sh
node reviews/fast-play/run.mjs
```

On 9 September 2026, Node v22.20.0: **17 tests passed, zero failed**. The runner
bundles the existing TypeScript chess engine into a temporary directory and
removes it afterward. It performs no network or wallet calls.

The tests exercise Fool's Mate publication without the losing key, public-only
archive replay, altered/reordered/missing moves, wrong game/network/clock/key,
wrong signer, legal checks, false mate, final-FEN/root mismatch, increment,
duplicate moves, exact deadline, premature expiration, unauthorized clock key,
backward time and substitution of an alternative branch without a referee
receipt.

This is a protocol experiment, not deployable Quick Play. Its opening descriptor
is a trusted fixture, its keys are Node-generated Ed25519 keys, and its referee
is a local function. It has no Stacks identity verification, registry, browser
key storage, ready-message collection, network transport, persistence, complete
draw/resignation/timeout adjudication, production parser limits, archive upload
or UI. Tests demonstrate the signature/hash/no-final-loser-signature mechanism;
they do not validate end-to-end on-chain operation, referee honesty, availability
or full clock adjudication. Those remain explicit implementation gates above.
