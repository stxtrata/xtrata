# Status

Updated 2026-08-08.

## Where this is

Phases A to J complete. There is an application, it builds to a single 68KB
self-contained HTML file, and that artefact has been tested as an artefact -
including under a reproduction of the Xtrata runtime's injection and
`document.write` sequence.

What remains is everything that needs a real wallet, a real endpoint, or a real
chain: the signed wallet matrix, live reads and writes, the mainnet canary, the
canary inscription, and the two acceptance tests. See `ops/LAUNCH.md`: 34 of 57
gate items are closed, and every open one is a reason not to inscribe.

**This is not launch-ready and must not be inscribed.** The gates in
`LAUNCH.md` that are not yet green are listed under "Not started" below.

## Test counts

Run `npm test`, `npm run test:perft:deep`, and `npm run test:clarity`.

`npm run verify` passes end to end. **405 tests, 0 failing.**

`npm run release` REFUSES this build, correctly, on five counts: a placeholder
contract, a `dev` version string, 0 of 14 wallet matrix rows run, an unsigned
matrix, and 23 open items in `ops/LAUNCH.md`. Every technical gate inside it
passes, including deep perft at 762s.

| suite | tests | state |
|---|---|---|
| perft (shallow in `npm test`, deep separately) | 63 / 76 | passing |
| replay behaviour | 32 | passing |
| replay fuzz and totality | 15 | passing |
| canonical rules and readiness | 34 | passing |
| sha256 against Node's | 6 | passing |
| Clarity codec against the SDK | 17 | passing |
| endpoint selection and degrading | 15 | passing |
| wallet conformance | 32 | passing |
| post conditions against the SDK | 15 | passing |
| Elo v1 and determinism | 21 | passing |
| Clarity core contract | 46 | passing |
| mock/contract parity | 2 | passing |
| economic property fuzzing | 4 | passing |
| zero-STX sponsorship sweep | 8 | passing |

The only skips are the heavy perft depths, which `--deep` enables and the release
gate requires. They pass: 76/76, roughly 590 million nodes.

## Done

**Engine.** Dependency-free 0x88, TypeScript. Verified by perft against the six
canonical positions to depth 6/5, plus five castling-rights positions, plus two
fixture-free structural checks (mirror symmetry, and agreement between the fast
pseudo-legal path and the slow path replay actually uses).

**Protocols.** `rules-v1` canonical encoding with ten committed golden vectors
in `tests/rules/golden-rules-v1.json`. Deliberately not JSON: newline-separated
ASCII fields, every one validated against a character set that cannot contain
the separator. `events-v1` control strings (`resgn`, `draw?`, `draw!`), proven
not to collide with any move. `replay-v1` as a pure total function.

**Core contract.** `xchess-core-v1.clar`, Clarity 4. Append-only log keyed by
`(game, seq)`. Sponsorship with bootstrap, fixed rebates, a count bound and a
STX liability bound, top-ups, height-based expiry, and settlement callable by
anybody. Solvency asserted after every money-touching operation in every test.

**The zero-STX scenario, at the contract layer.** A wallet holding exactly zero
is bootstrapped by the creator's single transaction and plays a full game. This
is the brief's §78 acceptance test as far as a contract can carry it; the
remaining half of it is the inscription, which does not exist yet.

**Chain layer.** A hand-rolled Clarity codec matching the SDK byte for byte,
including 3,000 addresses on both networks. An ordered endpoint list where no
host is essential, a 404 is an answer, and chain unavailability is reported
distinctly. An in-memory mock that is proved equal to the contract by a parity
suite comparing full observable state after every step of a 19-step scenario.

**Wallet layer.** Provider discovery, ranking and suppression carrying every
legacy lesson, checked against fakes that reproduce each documented
misbehaviour. Post conditions hand-serialised and matched against the SDK,
including the contract-principal encoding the rebate needs.

**Ranked and ratings.** `ranked-v1` eligibility checked entirely from the chain,
and `elo-v1` with a proof that its rounding can never be ambiguous.

**Application.** Board with click-to-move and promotion, game creation for all
three kinds, explorer, leaderboard derived entirely from the chain, profile.
Everything on screen is derived by replay and nothing is stored.

**Build and artefact.** One self-contained HTML file, 68KB, with a manifest
carrying protocol versions and source hashes. `tests/artifact` reads `dist/`
rather than source, which is the only way the double-boot class of bug is
visible at all.

**Xtrata runtime.** An emulator serving the real runtime scripts from xtrata-2.0
for manual and wallet testing, plus an automated suite that reproduces the four
injections, the serve-time Hiro rewrite and `document.write` against the built
artefact.

**Cache.** Only immutable facts are cached, and the cache-destruction test
proves that deleting every byte reproduces identical verified state, including
the derived ratings.

**Legacy.** An adapter for the three deployed contracts, and golden fixtures
proving their games keep the results they had.

**The gates canary.** `dist/xchess-gates.html`, a second self-contained
artefact that walks an operator through every physically gated step from
preflight to the permanent inscription: 26 steps across six phases, each one
marked done only when its effect has been READ BACK OFF CHAIN. Irreversible
steps require the step's own name to be typed. Redoing a step reopens
everything downstream of it. The gating is tested like the contract, not like a
UI.

**Live mainnet reads.** All three legacy contracts are deployed and were read
end to end, through the real chain layer, codec and address encoding. Their
games are frozen in `harness/fixtures/legacy-mainnet.json`.

**Harness gates 1, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14**, `npm run verify`, and
`npm run release` with its refusal conditions.

## Findings that changed the design

1. **Clarity 6 does not exist; Clarity 4 is current, and it removed
   `as-contract`.** Verified against mainnet and clarinet. ADR-0001.
2. **The brief's example sponsorship constants would have stranded every
   sponsored player after two moves** at the fee legacy X Chess actually
   confirmed on mainnet. Measured, and replaced. ADR-0004.
3. **The gameplay/settlement rebate split in §17 cannot be built without
   teaching the contract which strings are control events**, which §3 forbids.
   Collapsed to one allowance; the concern it raises is answered by the
   bootstrap instead. ADR-0005.
4. **Replay reported a game as live when the rule set's own start position was
   already terminal** (king and knight against a lone king). Found by a test
   written while fixing a wrong fixture. Fixed.
5. **A sponsored move needs a post condition covering the rebate the CONTRACT
   sends.** Under deny mode an uncovered transfer aborts the transaction. The
   legacy board only ever received, so its call shape would have failed every
   sponsored move while still charging the network fee. ADR-0006.
6. **Replay applied `events-v1` to legacy games, changing their results.** A
   legacy Scholar's Mate with `resgn` at sequence 2 read as 0-1 by resignation
   instead of 1-0 by checkmate. Opposite winners from identical bytes. Replay
   now obeys the events protocol a game committed to. ADR-0007.
7. **Three artefact-only bugs**, none visible in any source file: an escaped
   closing tag that meant the config script never closed; boot running before
   `<body>` existed; and a boot guard in module scope, which does nothing if the
   bundle itself executes twice.

## Not started

Every line is a launch gate and none is green. See `ops/LAUNCH.md`.

- The application and its screens
- Local cache and the cache-destruction test
- Legacy adapters and legacy golden games
- Build, bundling, single-file artefact, manifest
- The Xtrata runtime emulator (harness layer 10)
- Artefact regression tests reading `dist/` (layer 11)
- `npm run release` and its refusal conditions
- The signed wallet matrix (layer 9)
- Devnet, testnet, mainnet canary, canary inscription
- Production contract and production inscription

## The risk that matters most

**R1 in `ops/RISKS.md`.** A sponsored move needs a post condition covering the
rebate the CONTRACT sends, with a contract-principal encoding no previous X Chess
build ever produced. The bytes match the SDK; that proves the encoding, not that
a real wallet or the Xtrata bridge accepts it. If they do not, every sponsored
move aborts while still charging the network fee.

Nothing closes this but a real wallet.

## Next

Everything left needs something real.

1. Live reads against mainnet, and the endpoint-independence run.
2. The wallet matrix, signed. **Row 4 first**: a sponsored move, with the
   contract-principal post condition that has never reached a wallet.
3. Devnet, then a labelled mainnet canary contract.
4. A canary inscription, and the whole matrix against it.
5. Only then: the production contract and the production inscription.
