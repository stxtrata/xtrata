# Status

Updated 2026-08-19.

## Where this is

**Launched, and inscribed four times.** X Chess 2.0 went to mainnet as
inscription 2988 on 2026-08-09 and has carried real games and real money since.
Three more boards have followed it. Exhibition Three is running now on
`SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xchess-core-v1-canary`, ninety games
across ten characters, with rounds one and two played.

**The sentence that used to be here caused a mistake.** It said 34 of 57 launch
gates were closed "and every open one is a reason not to inscribe", which was
written before 2988 and never revisited. Somebody read it in August, believed
it, and acted on it. The launch gate governs a PRODUCTION launch on a production
contract; it has never governed a canary board, and four canary boards exist. If
you are deciding whether to inscribe, read `ops/RELEASES.md` and the version
table below — not this paragraph's ancestor.

## Boards on chain

Every one is permanent. A newer board does not replace an older one; readers
follow whichever link they were given, so an old board being WRONG matters and
an old board being BEHIND does not.

| version | id | built | hash | what it added |
|---|---|---|---|---|
| 2.0.0 | **2988** | 08-09 | — | the first inscription |
| 2.1.0 | **3008** | 08-18 21:11 | `d19c51f7` | tournaments found by wallet rather than typed; your own games found past the newest-25 window; the waiting-on-you count; the manual embedded from chain |
| 2.1.1 | **3009** | 08-18 21:32 | `e21c6f1f` | the runtime proxy, which had never once been used |
| 2.1.2 | **3014** | 08-18 23:10 | `acc7e9b1` | `Tournament.cooldown`, `TournamentEntrant.depth`, one `rulesFor()` |
| 2.1.3 | not inscribed | 08-19 13:17 | `c7697a3b` | in-check explanation, in-flight warning, tournament cache, collapsed chooser, `revisedInTime` on open |

**2.1.0 → 2.1.1 is the one worth reading.** `underXtrataRuntime()` decided
whether to use Xtrata's caching proxy by looking for injected support scripts,
and a served inscription has none — checked directly against the bytes of 3008
and 2988. So every reader went straight to `api.mainnet.hiro.so` from their own
address and was rate limited, and a refusal carries no
`Access-Control-Allow-Origin`, so the browser reported it as CORS. Hundreds of
"CORS" errors and a board saying it could not reach any endpoint, while the
proxy answered 200 throughout. It is also why 2988 was slow rather than broken:
same fault, less data to exhaust the allowance with.

**2.1.2 → 2.1.3** carries five things, checked against 3014's served bytes
rather than against a changelog. The two that came from a player: picking up a
piece with no legal move now names the squares that have one (game 8 sat forty
hours in check with five legal replies and a board that said nothing), and a
second submission while one is still in the mempool is warned about rather than
silently charged and skipped.

Other inscriptions: engine **2991**, manifest builder **2992**, exhibition one
**2993**, entry validator **2994**, character sheets **2995–3000** and
**3010–3013**, exhibition two **3001**, manual **3003** and **3007**,
exhibition three **3016**. **3015** is abandoned — nothing points at it, the
chooser hides it, and it stays on chain because it is a real document.

## Test counts

`npm test` — **1,484 passing, 17 skipped, 74 files.** `npx tsc --noEmit` clean.

The skips are the heavy perft depths, which `npm run test:perft:deep` enables
and the release gate requires. They pass: 76/76, roughly 590 million nodes.

**The release gate takes about thirteen minutes** and that is not a hang.
`harness/release.mjs` runs `verify.mjs --deep`, and deep perft alone was
measured at 762s. Do not pipe it through `tail`, which buffers until the process
exits and makes a long run look like a dead one.

## What the release gate refuses, and why it is not blocking

`npm run release` refuses this build on two counts, both real and neither about
the code:

- **22 of 59 items in `ops/LAUNCH.md` are unchecked.**
- **The wallet matrix is not signed.** Of 14 rows: 4 pass, 3 fail, 15 entries
  read "not run". Nothing has been signed by a real extension.

Everything technical inside it passes. This gate is the door to a PRODUCTION
contract and a production inscription, and the canary boards have deliberately
gone out ahead of it — which is what a canary is for.

## Done

**Engine.** Dependency-free 0x88, TypeScript. Verified by perft against the six
canonical positions to depth 6/5, plus five castling-rights positions, plus two
fixture-free structural checks.

**Protocols.** `rules-v1` canonical encoding with ten committed golden vectors.
Deliberately not JSON: newline-separated ASCII fields, each validated against a
character set that cannot contain the separator. `events-v1` control strings
proven not to collide with any move. `replay-v1` as a pure total function.

**Core contract.** Append-only log keyed by `(game, seq)`. Sponsorship with
bootstrap, fixed rebates, a count bound and a STX liability bound, top-ups,
height-based expiry, settlement callable by anybody. Solvency asserted after
every money-touching operation in every test.

**Chain layer.** A hand-rolled Clarity codec matching the SDK byte for byte. An
ordered endpoint list where no host is essential, a 404 is an answer, and
unavailability is reported distinctly. An in-memory mock proved equal to the
contract by a parity suite.

**Wallet layer.** Provider discovery, ranking and suppression carrying every
legacy lesson. Post conditions hand-serialised and matched against the SDK.

**Tournaments.** Manifests committed before play, verified pairing by pairing
against the chain, results derived by replay and never read from a claim.
Revisions are same-creator, strictly-before-first-move, depth-capped, and
collapsed in the chooser so a correction is authoritative rather than hidden.

**Ratings.** `ranked-v1` eligibility checked entirely from the chain, `elo-v1`
with a proof its rounding can never be ambiguous, and rating checkpoints that
must be minted by xtrata.btc and regenerated before they will be inscribed.

**Build and artefact.** One self-contained HTML file, **242,259 bytes — 15 of
the 32 Xtrata chunks** that upload in a single transaction. `tests/artifact`
reads `dist/` rather than source, which is the only way the double-boot class of
bug is visible at all.

**The gates canary.** `dist/xchess-gates.html`, 26 steps across six phases, each
marked done only when its effect has been READ BACK OFF CHAIN.

## Findings that changed the design

1. **Clarity 6 does not exist; Clarity 4 is current and removed `as-contract`.**
   ADR-0001.
2. **The brief's sponsorship constants would have stranded every sponsored
   player after two moves.** Measured and replaced. ADR-0004.
3. **The §17 rebate split cannot be built without teaching the contract which
   strings are control events**, which §3 forbids. ADR-0005.
4. **Replay reported a game as live when the start position was already
   terminal.** Fixed.
5. **A sponsored move needs a post condition covering the rebate the CONTRACT
   sends.** ADR-0006.
6. **Replay applied `events-v1` to legacy games, changing their results** —
   opposite winners from identical bytes. ADR-0007.
7. **Three artefact-only bugs**, none visible in any source file.
8. **The runtime proxy was never used.** See 2.1.0 → 2.1.1 above. Detection was
   tested against a page shape no inscription has ever been served in, so it
   passed while returning false on every real reader.
9. **A pairing gets one ranked game, ever.** A rules hash commits white, black,
   ranked and the protocol, and nothing naming the tournament. Exhibitions one
   and two used all thirty pairings their six players had. Exhibition Three
   exists because it declares `cooldown: 1`, which changes the hash and frees
   every pairing while never rejecting a move in a two-player game.
10. **`--after` on a tournament manifest means REVISION, not sequence.** 3015
    declared 3001 and resolved to Exhibition Two's id — a finished tournament
    appearing to have been revised into a ninety-game one. Re-inscribed at 3016.
    The inscriber now refuses it and `--revises` is the deliberate escape hatch.

## Open

- **Characters are read from chain.** Closed 2026-08-19, at the round 2/3
  boundary of Exhibition Three. `run-tournament.mjs` builds its field from the
  manifest's `entrants[].entry` ids, fetching each sheet from the Xtrata core
  and both parsing AND rendering it with the validator at 2994 — not the copy in
  this repo, because a runner that parsed from chain and rendered locally would
  have moved the drift rather than removed it. The header prints each
  character's inscription id beside the engine's. `--local-characters` is the
  escape hatch for lab work and says out loud that the run is unreproducible; a
  failed chain read refuses rather than falling back.

  What changed for the six transcribed characters, measured rather than
  repeated: they were written prompt-first and hard-wrapped, and the entry
  format joins continuation lines with a space unconditionally, so their sheets
  carry the same WORDS with six to eight newlines collapsed to none. Net one
  character. `tests/wizards/entries.test.ts` now asserts that unwrapping
  explains the whole difference, so a word changing on either side fails.

  **The sheets cannot be re-inscribed to fix this.** The format has no way to
  keep a line break inside a field — `parseEntry` joins any indented line with a
  space and a blank line ends the field — so no sheet can render the original
  wrapping. And manifest 3016 permanently names 2995–3000, with the revision
  window shut two rounds ago. Exhibition Four should be written sheet-first, as
  the four newest already were.

- **The signed wallet matrix.** Nothing has been signed by a real extension and
  there is still no way to RUN the fourteen rows.
- **The artefact has never been driven by a real browser.** Every layout and
  colour claim is arithmetic or jsdom.
- **A production contract**, if the canary is not to be it. 2988 cannot be
  repointed.
- **The sequence link between manifests does not exist.** `--after` promised a
  walk-back chain and delivers a revision edge. A real one needs a second link
  kind the format does not have. Unstarted.
- **The one-ply control arm has never completed.** Everything claimed about the
  engine's effect rests on the on-chain record rather than a controlled
  comparison. Lab work, and it costs nothing.
- **A post-launch runbook.** Nothing written describes operating a permanent
  thing.

## The risk that matters most

**R1 in `ops/RISKS.md`.** A sponsored move needs a post condition covering the
rebate the CONTRACT sends, with a contract-principal encoding no previous build
ever produced. The bytes match the SDK; that proves the encoding, not that a
real wallet or the Xtrata bridge accepts it. Nothing closes this but a real
wallet.
