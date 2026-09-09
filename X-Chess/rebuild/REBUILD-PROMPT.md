# X-Chess: clean-sheet rebuild prompt

Build a substantially better X-Chess from scratch. Treat this brief as the product and protocol requirements; you do not need the old application source. Choose a fresh architecture and visual design. Preserve the permanent record and its meaning, while removing accumulated UI complexity, discovery workarounds, and operational fragility. Deliver working software, specifications, and reproducible evidence—not just a mockup or plan.

## The essence

X-Chess is a permanent, wallet-native chess arena on Stacks. The application itself is an executable Xtrata inscription. Humans and independently operated AI characters play, watch, replay, and organise tournaments. In the core mode, opening a game and submitting each move are Stacks transactions. Anyone can reconstruct a game from its published rules and on-chain history.

The distinguishing architecture is: **an immutable submission log → deterministic chess replay → a replaceable interface**. The contract records evidence; replay determines what it means. No X-Chess backend, database, privileged indexer, leaderboard service, or signing daemon is required for ordinary play. Replaceable Stacks nodes/API endpoints are still required for live reads and broadcasts; serverless does not mean network-independent. A finished-game export should replay offline.

## Product experience

Make playing and understanding the next action effortless. Put the board, players, whose turn it is, check/result, and transaction status first. Use a cohesive, accessible design with recognisable pieces, strong contrast, touch and keyboard controls, promotion selection, correct coordinates when flipped, and optional sound. Keep addresses, hashes, logs, and verification detail available through progressive disclosure. Do not reproduce the old collection of technical panels.

Provide these connected journeys:

- **Play:** challenge a named wallet, join an open seat, or start a community board. Choose colour, ranked/casual status, and optional sponsorship. Resolve names to validated principals before commitment. Show the opponent address, rules, and cost before signing. Keep custom FEN, allow lists, and cooldown settings under advanced options; reject configurations that make play impossible.
- **Your games and discovery:** prioritise games waiting on the connected player, including old games. Search/filter by player, game, activity, result, and tournament. Spectating requires no wallet. Deep links identify network, contract, game, and optional tournament context and work from an empty browser.
- **Game:** click/tap or drag legal moves, explain checks and unavailable moves, resign, offer/accept draws, browse accepted moves, inspect rejected submissions, and replay finished games. Export PGN plus a portable evidence bundle containing rules, raw entries, provenance, and protocol identifiers.
- **Community:** verified tournament pairings and standings, rankings, profiles, optional BNS names and inscription pictures, and an embedded concise manual. Metadata failures must not block chess. Clearly distinguish human players, AI characters, and their operators.

Treat submission as an explicit lifecycle: preview → wallet approval → broadcast → pending → confirmed → accepted or rejected by replay; also handle cancellation, drop/replacement, timeout, and failure. A wallet returning a transaction ID is not confirmation, and confirmation is not chess acceptance. Prevent duplicate listeners and accidental double submissions. Refresh authoritative state before signing; explain that another transaction can still win the race and make a paid submission invalid.

## Chess and deterministic replay

Implement complete standard move legality, including castling, en passant, promotion, pins, and king safety. Replay is pure, deterministic, and total over malformed log input. Establish canonical sequence order at the ingestion boundary; never order tied entries by timestamp. Sequence counts submissions, not chess plies. Reject incomplete or inconsistent reads as incomplete evidence rather than inventing a final position.

Preserve these existing mechanics:

- Each side can be a named principal, `anyone`, `anyone-else` (excluding the principal bound to the opposite side), or `first-mover`. Under the seat-claiming replay version, the first accepted move claims that colour permanently; a player cannot claim both colours. Rejected moves never claim seats.
- An optional allow list restricts participants. Cooldown counts accepted moves by other participants, not blocks or rejected submissions. `noConsecutive` prevents consecutive accepted moves by the same sender. Validate actual seat/allow-list combinations for deadlock, not merely a participant count.
- Moves use UCI (`e2e4`, `e7e8q`). Existing control strings are exactly `resgn`, `draw?`, and `draw!`. Only eligible bound players may end a game by resignation/agreement. Control events obey the allow list but bypass move-turn/cooldown restrictions. One draw offer may stand; acceptance must come from the other side; an accepted move clears the offer.
- Existing replay automatically ends on threefold repetition or 100 halfmoves. This is an intentional variation from claim-based tournament chess. Repetition includes board, turn, castling rights, and en passant only when a legal capture exists. Terminal precedence: checkmate, stalemate, insufficient material, repetition, fifty-move. Detect an already-terminal starting position. Two knights versus a king is not automatically insufficient material.
- Preserve all submissions and stable rejection reasons. Nothing after termination counts. Removing rejected entries must leave position, result, and termination unchanged.

Version rules encoding, replay, control events, ranked eligibility, and rating separately. Unsupported versions produce an explicit unsupported state. Never reinterpret old games using new defaults. Legacy move-only games treat the control strings as malformed moves, not resignations or draw agreements.

## On-chain requirements and improvements

Use Clarity contracts with immutable game metadata and append-only entries keyed by `(gameId, seq)`. Store sender, sequence, value, and chain height. Keep per-submission storage work bounded instead of rewriting growing arrays. Supply paginated reads, game enumeration, protocol introspection, and non-authoritative discovery indexes. The current core admits ASCII strings of length four or five, up to 65,536 submissions per game; a replacement may improve capacity but must address exhaustion/spam explicitly.

**The contract may filter, never adjudicate chess.** It must not maintain the authoritative board, turn, legal-move verdict, or winner. No administrator may rewrite/delete history. Result claims, index flags, tournament declarations, and profile names are hints until verified. Invalid stored submissions can still cost network fees and receive an applicable rebate.

Fix two foundational gaps in the new protocol:

1. **Rules availability:** a hash proves proposed bytes match; it does not recover missing bytes. Store bounded opaque canonical rule bytes on chain, or a permanent retrievable Xtrata reference plus hash. Make the descriptor available at creation, including before either player moves. The contract can store/hash opaque bytes without understanding chess. No new game may depend on localStorage, a special link, guessed players, or the creator's surviving computer to recover its rules.
2. **Game identity:** identify games by network + contract + game ID. Distinct games may share identical rules. Include an explicit unique match/competition reference when needed, avoiding circular dependencies between a tournament inscription and its game IDs. Never use a rules hash as the unique identity of a match or alter cooldown merely to distinguish rematches.

Document a canonical encoding with strict validation and permanent golden vectors. New semantics receive new versions. Isolate historical read adapters: verify the deployed ABI and frozen historical specification before claiming compatibility; do not silently migrate old logs or mix rating pools. Existing repository deployment coordinates are provided below as starting points, not live verification.

## Fees and sponsorship

Standard play charges an opening fee and no X-Chess per-move fee; ordinary network fees still apply. Query current contract prices per operation, display a full breakdown, and protect transfers against configuration changes between quote and inclusion. Avoid hardcoded fee promises.

Retain creator-funded onboarding: a sponsored opening immediately transfers a bootstrap to a named beneficiary and reserves a bounded number and STX amount of fixed rebates. Support sponsorship of one or both players, third-party top-ups, and permissionless reserve settlement after a specified chain height. No hosted fee signer is needed. An unknown zero-balance player cannot identify themselves through a transaction they cannot yet afford.

Keep each funding promise immutable; define top-ups consistently when global prices change, using explicit tranches or the original row's terms. Exhaustion never ends chess or blocks an otherwise payable submission. Define whether expiry ends payouts or only enables settlement—do not leave that ambiguous. State who receives unused funds; the existing design releases them to treasury, not back to the sponsor.

Prove `balance >= reserved liabilities`, exact reserve reconciliation, isolation between beneficiaries, and withdrawals limited to surplus. Abort on accounting inconsistency rather than silently repairing it. Bound owner powers, publish their effects, and explain renunciation. Measure sponsorship reach across fee distributions and junk-submission abuse; a fixed rebate is not a guarantee of free moves or a completed game.

## Rankings, tournaments, and AI

Rank only games whose committed rules opt in, identify two distinct eligible players, start from the standard position, have no additional allow list, and yield a verified terminal result. Both players must have participated through accepted entries; make ranked consent visible before their first signature. Define event-only participation precisely. Legacy games remain unrated unless their original protocol says otherwise.

Keep historical Elo reproducible: initial 1200, K=32, provisional below 10 games; order by terminal block height then game ID within one contract. Compute both deltas from pre-game ratings. Expected score is rounded to integer per-mille after clamping opponent-minus-player rating to ±800; round deltas to nearest integer with halves away from zero. Publish exact vectors and a total ordering including network/contract for any new cross-contract pool. Ratings do not prove human identity, fair play, or absence of collusion.

Tournament manifests permanently describe entrants, pairings, game references, scoring/tie-break rules, and relevant engine/character references. Verify pairings against committed descriptors and derive results by replay. Distinguish pre-play commitments from retrospective compilations; define revision and series links separately. An organiser cannot change completed results. Directory holdings aid discovery; minting provenance authenticates authorship. Neither proves a claimed chess result.

Keep AI execution outside the inscribed client: an optional operator-controlled runner fetches pinned character/engine/prompt artifacts, provides legal candidate moves, validates model output, and signs only its authorised seats. Human seats remain human-controlled. Publish model/settings, failure/forfeit policy, and budget boundaries. Do not claim identical AI decisions are reproducible merely because prompts are public. Do not imply an always-available house opponent unless a separately operated service actually answers challenges.

## Permanent runtime, performance, and delivery

Ship a compact self-contained HTML artifact with bundled code, styles, pieces, and essential help; no CDN, remotely loaded application bundle, fonts, or required analytics. Optional on-chain content must be bounded, validated, and safely rendered. Verify current Xtrata chunking, content hashing, dependencies, sealing, and wallet bridge behavior from authoritative platform interfaces. Record both ordinary file SHA-256 and Xtrata's chunk-chain hash, with chunk size and artifact provenance. Historically chunks were 16,384 bytes and the chain digest used `h0 = 32 zero bytes; hi = SHA256(hi-1 || chunk_i)`; verify before minting.

Test the actual built HTML in a real browser and the real inscription embedding lifecycle, including document replacement and delayed wallet injection. Boot must be idempotent. Discover providers at action time, use provider-specific request shapes, never retry a cancellation through another wallet, and cover **all** STX outflows—including contract bootstrap/rebate transfers—with correct deny-mode postconditions. Do not confuse fee rates with total fees. Separate read-only access from available signing capability.

Use replaceable same-network endpoints, runtime-aware routing, bounded retries, 429 backoff, cancellation, and request deduplication. Preserve explicit endpoint overrides. Distinguish absence from outage. Load the selected game first; page discovery; share raw reads; incrementally fetch changed logs; keep navigation usable during verification. Cache by chain/contract/version and handle reorganisations. Track unresolved earlier games so checkpoints never permanently skip games that finish later. A publisher-signed checkpoint is a claim, not a correctness proof: label it provisional until independently verified, and retain full reconstruction without it.

Deliver in working increments: protocol and invariants; chess/replay; contract and mock parity; one complete wallet-to-confirmed-move journey; discovery/sponsorship; tournaments/profiles/ratings; compatibility and release evidence. Choose implementation libraries by correctness, maintainability, license, and measured artifact cost; a compact proven chess library is acceptable. Do not inherit an 8,000-line UI controller or hand-written codecs merely because the old app had them.

Acceptance evidence must include independent perft/differential checks, replay fuzzing, canonical vectors, Clarity and economic property tests, clean-browser recovery of custom and unplayed games, identical-rules rematches, late-finished ranked games, endpoint failure/reorg tests, duplicate-signing prevention, hostile metadata, real desktop/mobile runtime interaction, and measured cold/warm performance at meaningful scale. Test behavior rather than pinning incidental wording. Produce exact build provenance, a deployment/inscription runbook with read-back verification, and an honest list of untested external paths.

Fast signed off-chain play with full-log inscription, enforceable clocks, chat, prizes/wagers, and an always-on house runner are **separate extensions**, not assumed existing mechanics. A hash chain alone proves neither authorship nor complete history; signed channels require domain separation, data availability, abandonment/dispute rules, and a justified rating policy. Never pay prizes from unverified result hints. Finish the permanent on-chain core first.

Historical integration starting points: Stacks mainnet core `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xchess-core-v1-canary`; Xtrata reader target `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3`; older logs named `xtrata-chess-log-v1`, `-v2`, `-v3` under the same deployer. Verify deployments, ABI, supported Clarity version, and runtime before integration. Build locally and on a development network first; prepare permanent deployments for explicit operator approval.
