# X Chess 2.3.1 — signed peer play

**Post-inscription update, 2026-09-09:** the user inscribed the app as **3037**.
Authorized wizard testing then deployed the exact registry at
`SPARQA0T0GWJZADHRMGNVTJ51D014V8P7XPDSTNH.xchess-peer-v1` on mainnet.
Registered game 1 finished and its winner published archive **3038**; sealed-byte
read-back and live verification passed. Enter that address in the existing
registry field. See [test report and remaining issues](../reviews/3037/REPORT.md).
The undeployed/deployment-approval statements below describe the earlier build
stage and are superseded by this update for this deployed registry.

This candidate replaces the earlier referee-service design. Nothing has been
deployed or inscribed as part of this implementation. The separate 2.2.0 release
is preserved. The original on-chain mode still points at the existing mainnet
canary and uses its unchanged rules/replay/rating/core-contract hashes.

## What is ready

The standalone `releases/2.3.1/xchess.html` includes Quick Play, the chess engine,
P-256 signature verification, manual exchange, native WebRTC, a durable local
journal, encrypted recovery and a public archive reader. It has no runtime CDN,
mandatory signaling service, referee or default STUN/TURN account. The original
on-chain mode still reads public Stacks data. Peer registration and optional
opening verification also read Stacks data; peer moves and offline replay do not.

The peer registry is new and **undeployed**. Local demonstrations work now and
are explicitly labelled as lacking verified Stacks identities. The registry
address field is blank deliberately. Do not enter the old core contract there.

## Try it with two players

1. Open the HTML from a trusted local file or localhost/HTTPS. Use separate browser
   profiles or devices. Click **Quick Play**. Choose untimed or an advisory preset.
2. White selects **Create demo invitation**, copies the message and sends it by
   any convenient channel. Black pastes and selects **Import signed message**.
   Black returns the generated join response; White imports that response.
3. For direct play, White selects **Create connection offer**. Black pastes it and
   selects **Answer pasted offer**. White pastes the answer and selects **Accept
   pasted answer**. Each description is signed and bound to the joined match.
4. If there is no route, keep playing by copying **Export signed message** after
   your move and importing it on the other device. Files work too. This exchanges
   the complete signed history, with bounded sizes, for simple recovery.
5. Moves are signed with your local game key and saved before sending. Your wallet
   does not sign moves. Keep an **Encrypted private recovery save** with a strong
   password. It contains game keys, never wallet spending keys or seed phrases.
6. On interruption, use **Resume saved game**, exchange fresh descriptions, or
   import the peer's signed history. **Refresh saved history** loads another tab's
   accepted state. Invalid imports leave the saved game intact.
7. At checkmate, automatic draw or a signed resignation, **Review & Inscribe**
   shows the derived result, byte/chunk counts, file SHA-256 and history root.
   Either player can download/publish. There is no terminal countersignature,
   receipt or loser-approval requirement. Downloading does not inscribe anything.

Boards support square selection with arrows, Home/End and Enter/Space. Promotion
has an explicit piece selector. Public archives have a replay slider.

## Registration after separate deployment approval

The exact new source is `contracts/xchess-peer-v1.clar`, Clarity 4. Review and
publish this separate versioned contract through the established Stacks contract
workflow, then independently compare its deployed source/hash with this package.
Do not reuse `xchess-gates.html` for the peer registry: that page is for the
**existing core canary**, not the new registry. No deployment is authorized now.

Enter the actual registry and network in Quick Play. Connect the creator's wallet,
choose a named opponent and colour, then create. The key is saved before the
wallet request. Send the opponent the registry/network/game number (or setup tx
ID). They connect their wallet, load and review the frozen settings, then join.
Only the named opponent can join, exactly once. Invitations expire after 1,440
Stacks blocks before joining; joined games cannot be cancelled, edited or rekeyed.
The client checks the joined record and waits for two additional blocks before
verified play. A restored registered game must verify its opening again.

Both setup transactions incur current Stacks network fees estimated by the wallet.
There is no new app fee, escrow, wager or payout. Cancellation never causes an
automatic retry. **Restore setup transaction** retrieves a returned tx ID after
reload. If a wallet response was lost before the ID was saved, inspect wallet
history and paste its ID; never blindly resubmit an uncertain transaction.

The registry freezes bytes and public-key encodings. The client validates the
canonical descriptor, curve points, supported rules and legal replay. A registry
format number alone is not a code audit: deploy/check the supplied immutable
source and use a trustworthy chain-data source. Optional opening verification
compares the entire claimed opening with the joined chain record.

## Clocks, branches and permanence

Clocks are advisory estimates. They pause when the Quick Play view closes, reset
on reload/reconnect or a fresh open, and continue while an open view is disconnected.
Expiration and disconnection never produce a verified win or signed resignation.
An abandoned nonterminal board stays unfinished and resumable.

Each player signs only their own actions. A signed mating move is sufficient when
combined with the opponent's prior signed history. Publication cannot be vetoed
by refusing another signature. It does not force an opponent to continue playing.

Hash chains prove the supplied line, not that no other signed branch exists.
Durable per-sequence reservations prevent the ordinary client from signing
conflicting actions across tabs/reloads. Known divergent branches are preserved
and labelled disputed; a longer remote log never wins automatically. There are
no peer ratings or payouts. Keep rejected over-limit evidence as a separate file.

Clearing browser storage or losing a game key prevents further signing unless a
private recovery save exists. Backups are encrypted using PBKDF2-SHA256 (310,000
iterations), a random salt and AES-256-GCM. A backup is a consistent snapshot of
history/reservations. It cannot know about later actions missing from that save.
Avoid using the same restored key on two devices. Public archives never include
private keys, passwords, relay credentials or connection descriptions.

Direct WebRTC was tested between local independent browser profiles. Direct
connectivity across restrictive NAT/firewalls is not guaranteed. Optional STUN
helps discover routes; user-supplied TURN can relay encrypted traffic. Neither is
required by the protocol. Manual signed-message exchange works without WebRTC.
Connection descriptions can reveal addresses: never include them in inscriptions.

## Exact protocol and offline verification

`packages/peer/protocol.ts` is the frozen v1 grammar. Canonical JSON sorts record
keys, preserves array order, uses UTF-8 and nonnegative safe integer numbers,
rejects unknown fields and limits nesting to 24. Domains and encodings are exact:

- Protocol `xchess-peer-v1`, algorithm `P256-SHA256-raw-v1`.
- P-256 public key: 65 raw SEC1 bytes (`04 || x || y`), lowercase hex.
  Signature: 64 IEEE-P1363 bytes (`r || s`), lowercase hex. ECDSA signs SHA-256
  of canonical payload bytes using native WebCrypto. Signature bytes themselves
  are excluded from history roots, so equivalent valid signatures deduplicate.
- `match = SHA256(canonical(opening))`; opening includes kind, network, registry,
  game number, descriptor and both players' wallet identities/public keys.
- `H0 = SHA256(canonical(["xchess-peer-v1/genesis", match, initialFen]))`.
- Move payload: `protocol, match, sequence, previousHash, actor, kind:"move",
  value:UCI, resultingPositionHash`. Sequence starts at 1. Next root is
  `SHA256(canonical(payload))`. Position hash covers the complete resulting FEN.
- Resignation payload: `protocol, match, actor, kind:"resignation", atSequence,
  atHash, resultingPositionHash`. It can be signed off-turn. It does not consume
  a mover sequence or change that move root. A racing later move or multiple
  resignations produces disputed evidence. The archive file hash also binds all
  resignation evidence; the move root alone does not.
- Rules `xchess-automatic-draw-v1`: mate/stalemate/material, automatic threefold
  repetition and automatic fifty-move rule, using the pinned existing engine.
  These last two are automatic protocol rules, not FIDE claim procedures.
- Engine ID is SHA-256 of the ordered `board.ts`, `engine.ts`, `fen.ts`, `moves.ts`,
  `uci.ts`: filename + NUL + file bytes + NUL for each. The unit test pins it.
- Maximum 2,048 moves across supplied lines, eight conflicting branches, eight
  resignations per line and 2,000,000 public-message bytes. Exhaustion never
  invents a result. Transport has additional chunk, rate, queue and timeout caps.

The public JSON includes the complete opening, signed moves/resignations, known
branches and a recomputable final summary. Open it through **Open public archive
 offline**, or run the packaged independent CLI with Node 22 or later:

```sh
node verify-peer.mjs peer-fools-mate.json
```

The CLI has no npm/CDN/network dependencies. It verifies signatures and replay,
prints the actual file SHA-256 and reports the identity limitation explicitly.
A demo is never a verified wallet match. A claimed chain opening remains
unverified until checked against the chain. Unsupported versions, changed fields,
invalid signatures, illegal moves and forged final results fail verification.

## Inscription preparation — do not publish this candidate yet

The release manifest contains the exact HTML SHA-256, rolling Xtrata chunk hash
and measured byte/chunk count. A build is technically prepared for inscription;
it is not proof of a successful mainnet deployment or inscription.

After separate approval and registry/runtime checks, upload the unmodified HTML
through the existing Xtrata uploader as `text/html`. A game's **Download inscription
JSON** is a separate `application/json` upload. Xtrata may require begin, chunk and
seal transactions: the chunk budget is not a promise of one total transaction.
After sealing, retrieve the inscribed bytes, compare their SHA-256, and reopen the
archive to verify/replay. Deduplicate records by match plus final root and compare
full evidence if either differs; submitter address is not evidence of winning.

## Evidence and checks still requiring live environments

The package's `VALIDATION.json` ties reports to the candidate SHA-256. Browser
reports identify fake-wallet/captured-runtime checks separately from real native
WebRTC. No personal wallet or live chain transaction was exercised. Remaining
checks are real Xverse/Leather signing in the live direct/framed Xtrata viewer,
mobile Safari/Android wallet paths, cross-network ICE/TURN behavior, deployment
source read-back, and sealed inscription byte read-back. These are not marked
passed by local automation. Test instructions are in `harness/peer/ci.mjs` and the
package scripts. The original 2.2.0 review/deep-perft evidence remains historical.
