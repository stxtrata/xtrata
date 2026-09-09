# Peer play v1: implemented local development mode

This implements the agreed five-step flow: on-chain create/join with game keys, manually exchanged connection invitation/response, automatically signed off-chain moves, durable signed history on both browsers, and publication by either player without another signature. It is a separate, unranked mode. No public deployment or real inscription has been performed.

## Run and use

1. From `X-Chess_3.0`, run `npm run build`. Serve `dist` over localhost, for example `python3 -m http.server 4348 --directory dist`. Open `http://localhost:4348/xchess.html?xchess-view=peer`. WebCrypto, IndexedDB, Web Locks and WebRTC need a suitable secure browser context; localhost qualifies. Use the same origin when returning to a game.
2. Deploy `contracts/xchess-peer-v1.clar` on your local development chain. `Clarinet.toml` includes it alongside the existing V3 core. Configure the registry, API and confirmations in Peer play. Defaults target the local development deployer; the HTML alone does not start a chain.
3. Connect the creator's wallet, name the opponent, choose colour and advisory clock, and create. Use the game number from the `peer-created` transaction event. The opponent connects their own wallet and joins that number. Both game keys are saved before either setup transaction is submitted. Wait for confirmation, then load the game in both browsers.
4. One player makes a connection invitation and sends the resulting text privately through an existing communication channel. The other pastes it and clicks Answer invitation, then returns their response. The first player pastes that response and applies it. ICE gathering is completed before copying, so no further candidate exchange is required for that attempt.
5. Click a piece and destination to move. Choose the promotion piece before moving a pawn to its last rank. Both browsers save verified received history; the mover saves before attempting transmission. Reconnect by exchanging a new invitation/response. Resend saved history if necessary. If connection is unavailable, download the signed history after your move; your opponent imports it after loading the same on-chain game.
6. After a verified terminal result, either player can Prepare completed record. Inscribe that exact downloaded JSON through Xtrata's existing upload/seal workflow, then optionally register the inscription number here. Registration is a discovery hint, not contract adjudication. Re-download the sealed bytes and import them here to verify the record against the loaded opening.

The session key is non-exportable and cannot spend wallet funds. Clearing browser data, losing the device or changing origins can make that player unable to sign further moves. History downloads contain public keys and signatures, never the private key. Browser storage is not permanent archival storage; retain downloaded records. Wallet connection alone cannot regenerate the session key. Key migration/recovery is not implemented.

## Contract boundary

`xchess-peer-v1` is a separate local registry; it neither changes V2's log ABI nor replaces `xchess-core-v3`.

| Function | Effect |
| --- | --- |
| `create-game(opponent, creator-white, creator-key, rules, base-ms, increment-ms)` | Allocates a game with immutable players, rules and clock settings. Currently only rules version 1 is accepted. |
| `join-game(id, opponent-key)` | Named opponent consents and registers a distinct key within 1,440 Stacks blocks. Only one join is accepted. |
| `get-game(id)` | Returns the immutable opening after join. |
| `record-archive(id, inscription, archive-hash)` | Either participant appends a reference. No final opponent authorization, no first-writer lock. |
| `get-record-count(id)`, `get-record(id, index)` | Exposes all references for future discovery clients. |

The contract validates key encoding length/prefix; the browser validates the actual P-256 curve point. It does not verify P-256 signatures, replay chess, validate an inscription reference, award a win, move funds or update rankings. A result becomes verified through independent reading and replay. Do not connect these references directly to wagers, payouts or V2 rankings.

The UI reads the configured chain API and checks its network and confirmation height. That API is an explicit read-trust dependency, as with the existing client; this is not a chain light client. Public deployments must pin and review the registry code and rules snapshot before accepting its openings. The UI permits registry overrides for local development; a matching `get-format` alone is not proof of contract identity.

## Exact record and signatures

The wire/archive format is `xchess-peer-v1`. Rules `standard-v2-engine-snapshot-1` use the copied V2 engine in `src/peer/chess/`, isolated from future edits to the V2 source. `dist/peer-manifest.json` records those source hashes. A rule change requires a new protocol/rules version and explicit acceptance; existing games never silently change rules. Additional variants and custom starting positions are not enabled in this version.

An opening binds protocol, rules, network, registry, game number, white/black wallet addresses, their registered keys, base/increment milliseconds, and joined height. A reader must obtain this opening from its trusted chain source; it must not accept an uploaded record's self-declared keys as authoritative.

```
h0 = SHA256(canonical(opening))
action_i = {
  domain: "xchess-peer-v1", match: h0, seq: i, prev: h_(i-1),
  side, kind, move, fen: resultingCanonicalFEN
}
signature_i = ECDSA-P256-SHA256(gamePrivateKey, canonical(action_i))
h_i = SHA256(canonical(action_i))
archive = {format: "xchess-peer-v1", opening, events: [{action, signature}, ...]}
archiveHash = SHA256(canonical(archive))
```

Canonical encoding is recursively sorted JSON object keys, ordered arrays, safe integer numbers, and exact schemas. Signatures are raw 64-byte IEEE P1363 `r || s`, lowercase hex; public keys are raw uncompressed 65-byte curve points. Hashes chain message content rather than randomized signature bytes, so re-signing an identical action does not create a different history branch. The downloadable canonical JSON bytes hash to `archiveHash`; the final history root and result are derived by replay, and the last signed action contains the final FEN. A bare root without the full signed history is insufficient evidence.

Every action is verified for game domain, sequence, previous hash, active player's key, signature, legality and exact resulting FEN. The verifier retains the full engine history, including repetition. It refuses actions after a terminal position and refuses incomplete prefixes as completed games. It does not accept timestamp, timeout or disconnect actions. Both the archive size (2 MB) and event count (2,048) are bounded. The bound is a prototype limit; a nonterminal record at the cap remains unfinished, not a forced draw.

Actions are serialized on the side to move to avoid competing asynchronous control events. Resignations and draw offers therefore happen on that player's turn. A draw offer is signed before the offerer's next move, travels with that move, and expires if the recipient plays a move instead of accepting. Acceptance is another signed action. Checkmate, stalemate, insufficient material, automatic repetition and fifty-move draws use the pinned engine's rules.

## No loser veto, with precise limits

At checkmate the winner signs their own last move. The loser's preceding moves are already signed. The winner possesses all evidence needed to replay and publish the result. There is no last-board countersignature or referee receipt. A received signed resignation is similarly sufficient. Agreeing a draw requires both players' signed choices.

This guarantees independent publication of an available completed transcript, not forced completion of an unfinished game. A loser who disconnects before completion has not thereby proved a chess loss. Local clock expiry is not independently provable. A modified browser can lie about elapsed time; network and background-tab delay also vary.

Clocks are explicitly advisory, started/reset locally by agreement. They are not embedded as trusted timestamps. Reloading does not preserve elapsed timing and requires another local start. They never terminate the verifier's game. Precise competitive blitz flags would require an explicitly trusted clock authority or a different protocol. No such service is mandatory here.

A valid signed prefix is still a valid prefix: hashing does not detect all withheld later moves. The verifier rejects a nonterminal prefix as a completed result. If both parties signed conflicting branches, each branch may be internally valid. Merge rejects competing content, preserves the existing record and stores incoming evidence; it never chooses the longest branch or claims that hashes determine the authoritative branch. Terminal proofs do not solve all equivocation disputes. An eventual public history index must surface conflicting proofs and keep these games separate from V2 ranking guarantees.

## Transport and persistence

`postMessage` communicates between browser windows; it does not carry moves between remote computers. The implementation uses an ordered reliable WebRTC data channel. Manual SDP exchange provides signaling without an X-Chess signaling server. No STUN/TURN endpoint or paid provider is hardcoded. Users may configure replaceable ICE servers. Some networks require TURN relay service, and direct-only mode cannot promise universal connectivity. See [MDN signaling](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling) and [MDN ICE, STUN and TURN](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Protocols).

Each reconnect sends saved history and merges only compatible prefixes. Duplicate/stale prefixes are harmless. Transfer uses small framed chunks with buffering, size checks and a bounded incoming queue. A complete received record is authenticated and saved before the UI shows it as accepted. There is no automatic acknowledgement requirement at the end. Large histories currently transfer in full; an authenticated suffix optimization can follow profiling.

IndexedDB retains non-exportable CryptoKeys and records; Web Locks serialize sign/save/merge operations across same-origin tabs. Signing reads the latest saved prefix inside the lock. Storage failure prevents transmission of a new action. Peer history is public signed data; signaling is not separately authenticated by a wallet, so keep the invitation exchange private and authenticated through your chosen communication channel. A substituted connection cannot forge moves but can withhold traffic or observe history. Both peers must keep their pages available; background notifications and guaranteed delivery after closing the browser are not provided.

## Deferred dispute protocol

An on-chain abandonment challenge is a separate future design, not a hidden feature of this registry. It must authenticate a legal claimed prefix, distinguish conflicting branches, define who owes the next response, provide a chain-based response deadline and specify valid response evidence. A claim that a nonterminal position is the latest state does not imply the other player lost. A longer sequence alone is not adequate adjudication. A block deadline resolves non-response under new agreed rules; it cannot retrospectively prove that a five-minute local clock expired.

If future contracts must verify move signatures themselves, revisit the curve choice before freezing the protocol: native Clarity `secp256k1-verify` is not P-256. P-256 was selected here for browser-native signing and off-chain verification. See [Clarity functions](https://docs.stacks.co/reference/clarity/functions) and [WebCrypto signing](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/sign).

## Verification

`npm run test:peer` runs protocol/adversarial tests and Clarity simnet registry tests. `npm test` also runs the existing V3 app and contract journey checks. Typecheck the peer UI with the adjacent TypeScript compiler and ES2022/DOM libraries.

For repeatable browser tests, run `node tests/peer-browser-server.mjs` and open `http://127.0.0.1:4351`. This is a localhost-only fixture with simulated wallets and Clarinet simnet transactions. It tests real browser IndexedDB/Web Locks, real local WebRTC pairing and chunked transfer, UI setup/join, automatic moves, mate after disconnection, publication reference, manual import, reload recovery and the shipped artifact's peer-view loader. It does not broadcast transactions or make real inscriptions. Results are saved to `peer-browser-results.json`.

Remote-device/NAT testing, TURN interoperability, storage eviction/recovery UX, public contract review/deployment, and actual sealed-inscription retrieval remain deployment validation work. The existing service/referee-based fast-play work under V2 is separate and was not changed by this implementation.
