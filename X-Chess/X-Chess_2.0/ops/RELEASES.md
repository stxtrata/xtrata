# Releases

Every canary and every release candidate, with enough detail to reproduce it or
to work out what somebody was looking at when they reported a problem.

An entry is written when the artefact is BUILT, not when it is inscribed, so
that a build which never shipped still leaves a record of why.

## 2.1.7 — 2026-08-19

Built, not yet inscribed.

* `htmlSha256` `e0d1d4633c33e4086507376bdc734e6c1a0740d943ca7bfe14a134de9816c5cc`
* xtrata chunk hash `5aa3bb352fad4e75c250cfcc2a85a2170f30544ba7cebce805f8efed463b14dc`
* build stamp `2.1.7 - 2026-08-19 22:34 UTC - #c2cd381d`
* **232,674 bytes, 15 chunks.** 1,572 tests, 82 files. `tsc` and docs audit clean.

**The slow half had no bar, because it wrote over its own.** "Replaying every
game to score it" went in as a bare notice, and the note is where the summary,
the field and the progress bar live — so the longest wait on the board replaced
everything explaining it with a sentence saying it would be slow. It sets the
bar to zero and redraws instead.

**And the table fills in a game at a time.** Progress was emitted at round
boundaries on the reasoning that ninety redraws would flicker. Wrong about the
timing: a game is a row read, its entries and a replay, so redraws land a
second or two apart, which is movement rather than flicker — and a five-game
round showed nothing at all until all five had finished. Every game now emits,
the standings grow a row at a time, and drawing is throttled to 220ms so a warm
load answering ninety games at once does not rebuild the body ninety times.

**The build stamp says UTC now**, because it always was and never said so.
`toISOString` is UTC by definition, so every stamp on chain — 2988 through 3024
— reads an hour behind the London wall clock that made it in summer, and the
first thing anybody concludes is a wrong clock rather than an unlabelled one.
UTC stays: the stamp is baked into a permanent artefact, and two people
building the same source in different places should get comparable stamps.

**A move costs one game rather than ninety.** With the loop fixed it
was stable until a round ended, and then did the same full reload to record
five results — because a string comparison says something changed and cannot
say WHAT. The poll reads a row per unfinished game, so it already knows exactly
which moved; it now re-derives those and takes the rest from memory. No row
reads at all in a rescore: the poll has done them, and everything else is
either finished, which cannot change, or was just read and found unmoved. A
game with nothing remembered falls through to the full path, so a gap in the
cache can never become a gap in the table.


## 2.1.6 — 2026-08-19  ·  **inscription 3024, live on mainnet**

Inscribed as a child of 3023. **232,345 bytes, 15 chunks**, stamp
`2.1.6 - 2026-08-19 21:43 - #22884569`.

Carries the clipboard fix that missed 3023, and the reload loop below. Does NOT
carry the targeted rescore, which was built half an hour later under the same
version and never went up — see 2.1.7. That is exactly the gap somebody
reported from this inscription: stable, until a round ended.

**A loaded tournament reloaded itself every thirty seconds, for ever.** The
poll builds a signature of the unfinished games' submission counts and compares
it to the last one — and the last one was CLEARED at the end of every
successful load. Anything differs from nothing, so the first poll always found
a change, re-checked all ninety pairings, re-replayed all ninety games, and
cleared it again. Whether or not a move had been played anywhere.

Two things made it worse. The baseline and the comparison were built in
different places out of different quantities — `nextSeq` on one side and
`moves`, which is what replay ACCEPTED, as the fallback on the other — so one
failed read made the signature differ from itself permanently. And the first
pass re-read a row per game to learn rules hashes it already knew and which
cannot change.

* The signature has one writer and is seeded from the load that just finished.
* A row that did not read carries the last thing known about it, not a zero.
* The pairing pass uses a remembered rules hash and reads nothing. A rules hash
  is fixed when a game is opened, so a hash read before is the hash now.

## 2.1.5 — 2026-08-19  ·  **inscription 3023, live on mainnet**

Inscribed as a child of 3022. **231,411 bytes, 15 chunks**, stamp
`2.1.5 - 2026-08-19 19:47`.

Carries the fix for a shared link to a tournament game showing "anyone". Does
NOT carry the clipboard fix, which was built twenty minutes later under the
same version number and never went up — see 2.1.6.

### Originally recorded as **231,411 bytes, 15 chunks.**

* `htmlSha256` `4fb3e9846559550017c9d6f0902ce89bf00f8d41b10d16e716f63ca6da220098`
* xtrata chunk hash `390f861999b946a7910195710ba8dcfe07a39eb3123df6a44bc971c08d5e5280`
* build stamp `2.1.7 - 2026-08-19 22:16 - #de85733f`
* **232,548 bytes, 15 chunks.** 1,569 tests, 82 files. `tsc` and docs audit clean.
* 1,564 tests passing, 81 files. `tsc --noEmit` clean, docs audit clean.

**Both copy buttons were doing nothing on the inscription**, and had been since
each was written. Measured against 3022 in a browser rather than reasoned
about: `clipboard-write` is `denied` on xtrata.xyz, so `writeText` throws
whatever the user does, and both buttons fell through to printing the link as
prose. `execCommand('copy')` goes through the older permission path and works
on the same page from inside a real click, so it is tried second.

**This entry was opened before `package.json` was bumped**, so the first build
under it stamped 2.1.4 — the version 3022 already holds — and was one signature
away from putting two different permanent artefacts under one number. Caught
by being asked to check rather than by anything here. The version lives in
`package.json` and the ledger cannot see it, which is worth a gate rather than
a habit.

**A shared link to a tournament game could not name its players.** 3022 shows
the move list naming Gambit and Cadence while the Players panel says "anyone"
and the rules note says fifty rule sets were tried. Both halves are true and
they contradict each other on one screen: naming a MOVER needs an address,
which the board has, and naming a SIDE needs the rules, which it did not.

There were three places that recover rules and only two had been given the
manifest candidates. The Game tab was the third, and it is the one a shared
link lands on. It now offers the same candidates and reads the directory when
a game arrives unidentified.

## 2.1.4 — 2026-08-19  ·  **inscription 3022, live on mainnet**

Inscribed as a child of 3002. **231,069 bytes, 15 chunks.**

* `htmlSha256` `c9ea8793b12e591288b87fa78c874634e581ffc8899192df21095c2a672c6b5c`
* xtrata chunk hash `04949cb708e9e768be673e1953f49053b0298add5f0a6f97f6fc840fbef287f9`
* 1,558 tests passing, 81 files. `tsc --noEmit` clean, docs audit clean.
* **Fifteen chunks, up from fourteen.** Still one `add-chunk-batch`
  transaction, which takes thirty-two, so this costs one chunk's protocol fee
  and nothing structural.
* Cost, measured on 3014 rather than estimated: **0.236 STX** for 13 chunks, so
  a shade more for 14.

**A hash here identifies a FILE, not a commit** — the version line carries a
build timestamp, so any rebuild invalidates the figures above. Do not rebuild
between checking them and signing. This entry has been corrected twice today
for exactly that, which is the argument for recording it once the work stops
rather than after every build.

### What it has that 3014 does not

* **Profile pictures.** `X-CHESS-PFP/1`, a picker in Profile, and faces beside
  names in Tournaments, the Leaderboard and Explore. The board never holds the
  bytes: an `<img>` points at the inscription and the browser does the rest.
* **One holdings listing per wallet.** A name and a picture are found the same
  way, and each resolver asked separately — three requests for one address.
* **Deep links** for tournaments and players, with a Copy link button, and a
  shared rule about what a shared link must never carry.
* **The game list pages**, with the refresh timer paused while you read.
* **Explore can name Exhibition Three's players.** It offered no recovery
  candidates and knew no cooldowns, so fifteen rows read "not yet known · rules
  unconfirmed" beside Exhibition Two rows naming both players.
* **A tournament paints before it loads** — the field, the format, the rounds —
  from the manifest already in memory, with no request at all.
* **The `?` on a rating says what it means**, which is "fewer than ten games".
* **The Leaderboard names the field.** Entrant names were recorded only after a
  full tournament load, so a reader who opened the Leaderboard first got raw
  principals for everybody while `xtrata.btc` resolved beside them — BNS being
  a different lookup that had happened. Names are learned wherever pairings
  are, which is before both the Leaderboard walk and the Explore list.
* **Long reads say how far they have got.** A tournament emits a real partial
  view at each round boundary — scored, honest, and marked unfinished — so
  rounds appear rather than a spinner turning. The Leaderboard says what it is
  doing before it walks every ranked game rather than after. Both bars move
  because work finished and never on a timer, so a stalled read looks stalled,
  which is the one thing an indeterminate spinner cannot say.
* **The prompt protocol is inscribed at 3017**, so a game is reproducible by a
  stranger end to end.

### Deliberately not in it

* **Timed games.** Planned in `docs/PLAN-timed-games.md`, with the questions
  answered. It changes `canonicalRules`, which is the one file where a mistake
  makes two boards disagree about a finished game for ever.
* **Playing a house player from the Play tab.** Planned in
  `docs/PLAN-play-a-house-player.md`. It needs a director watching the chain,
  which is a change to who runs what rather than to the board.

### Since that entry was first written

* **Deep links for tournaments and players.** `?tournament=<id>` opens the
  Tournaments tab at that manifest, `?player=<address>` opens a Profile. A
  tournament link needs nothing but the id, because a manifest names its own
  pairings and the board checks every one against the chain — unlike a game
  link, which has to carry its rules. The player value is validated as an
  address rather than passed through: a link is a thing strangers hand each
  other.
* **The game list pages.** Older/Newer over the same twenty-five reads at a
  different offset, since the window was always an id range rather than a query.
  Three behaviours decided rather than defaulted, each of them a way for the
  list to lie quietly: the refresh timer PAUSES while paged, because a list
  somebody is reading must not move under them; "your games from further back"
  appears only on the newest page, because its condition is "older than this
  page starts" and that is most of the contract on page four; and the count line
  says which stretch of ids is on screen instead of claiming the newest
  twenty-five everywhere.
* **What this address has inscribed**, and a manifest cost corrected from 0.3
  STX to about 0.03 — settled off a real mint transaction rather than off
  `get-fee-unit`, which returns a number that is not the live price.

### Notes from the original entry

* **Two documents, said out loud:** the first person to use this
  picked an image, built the name manifest, and reported the picture missing
  from it. It was not missing — it is a second inscription, shown in its own
  panel directly above. Two panels each ending in "your manifest" read as one
  thing with two halves, and nothing on screen said otherwise. The heading now
  says "its own inscription" and both notes say it does not go inside the name.
* 1,525 tests passing, 77 files. `tsc --noEmit` clean. Docs audit clean.

### What it adds

`X-CHESS-PFP/1`: a wallet naming a picture inscription it holds, attested the
same way a name is — the document's address against the inscription's CREATOR.
The Profile tab gains a square canvas, a grid of what the wallet holds, and the
manifest text to inscribe. Nothing is signed here, as with a name claim: this
board holds no key and never will.

**Why a separate document and not a field on `X-CHESS-PLAYER/1`.** `parsePlayer`
returns `player: null` when any problem is found, and an unknown label is a
problem by design. A player manifest carrying `image:` would therefore cost that
player their NAME on 2988, 3008, 3009 and 3014 — permanently, on artefacts
nobody can correct. Asserted in `tests/protocol/pfp.test.ts` rather than left as
a note.

**Holding, not creating**, and only here. A name is checked against the creator
so it cannot be bought. A picture is checked against the OWNER, because a picture
you bought is the normal case and requiring you to have made it would rule out
everything anybody ever collected. Ownership is re-checked when the picture is
shown, so selling it stops showing it.

`get-inscription-meta` is new in the reader and answers the type, the size and
the current holder in one call, so nothing is fetched until it is worth fetching.

### Verified live, not just in tests

Against `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X` on localhost: 3002 previews
as a 2048×2048 webp; 2994 (`text/javascript`) and 3014 (`text/html`) are refused
by type; 3002 checked against the director is refused as held by somebody else;
and the picker listed five real holdings across webp, png and jpeg.

## 2.1.3 — 2026-08-19

Built, not yet inscribed. **206,223 bytes, 13 chunks.**

* `htmlSha256` `79521871a163957e0c5b65ea09f1238eed083bfbc0ffa22e79238df91246e584`
* xtrata chunk hash `810062d662cf5f3af130dbd9042fcb7c92fd5dba924a333ee987666052742435`
* build stamp `2.1.3 - 2026-08-19 14:34 - #c7697a3b`
* Source hash `#c7697a3b` is UNCHANGED from the 13:17 build this entry first
  recorded. Nothing in `packages/` has moved since; the file hash differs only
  because the version line carries a build timestamp, and `dist/` had been
  rebuilt at 13:37 by something other than the run that wrote this entry. That
  is exactly the drift this ledger warns about two entries down — a hash here
  identifies a FILE, not a commit — so it is corrected rather than explained
  away. The runner now reads characters from chain, but the runner is a harness
  script and is not part of the board, so there is nothing new in these bytes.
* 1,484 tests passing, 74 files. `tsc --noEmit` clean.
* Cost, measured on 3014 rather than estimated: **0.236 STX all in** for 13 chunks.

### What it has that 3014 does not

Checked against the served bytes of 3014, not against the changelog:

* **The in-check explanation.** Picking up a piece with no legal move now names
  the squares that do have one. 3014 has none of this — game 8 sat forty hours
  with five legal replies and a board that said nothing.
* **The already-in-flight warning** before a second submission at the same turn.
* **Finished tournament games are cached**, keyed on game plus `nextSeq`, with
  the row still read every visit so a hit is checked rather than trusted.
* **The collapsed chooser** — one chip per tournament, newest revision shown.
* **`revisedInTime` on the open path**, so a revision that missed its window
  cannot quietly supersede a valid manifest.

### Why 2.1.3 and not 2.1.2

2.1.2 is permanent on chain as **3014** (`acc7e9b1`, built 2026-08-18 23:10).
Reusing the number would put two different artefacts under one version, which is
the mistake this ledger exists to catch and has now caught twice.

## 2.1.2 — 2026-08-18  ·  **inscription 3014, live on mainnet**

Written after the fact, which is itself the note worth keeping: the ledger's own
rule is that an entry is written when the artefact is BUILT, and 3014 went to
chain without one. So did **3009** (2.1.1, `e21c6f1f`) before it. A ledger with
gaps is a ledger nobody can use to answer "what was that reader looking at",
which is the only question it exists for.

* Build stamp `2.1.2 - 2026-08-18 23:10 - #acc7e9b1`, 13 chunks, 0.236 STX.
* Carries the tournament work: `Tournament.cooldown`, `TournamentEntrant.depth`,
  the single `rulesFor()`, and the verifier fix that stopped a declared cooldown
  reading as "the rules this game committed to are not this pairing".
* Superseded by 2.1.3 for the five items above. 3014 remains correct for
  everything it does contain; it is behind, not wrong.

## 2.1.1 — 2026-08-18

The proxy fix. **Inscribe this, not 3008.**

* **201,569 bytes, 13 chunks.** 0.30 STX protocol + ~0.21 STX miner.
* `htmlSha256` `639d47223ab83b38bf577ec56a9f8f0e0c7da215e4c186c080352b15d9abdc43`
* xtrata chunk hash `b7b6e6c51702c1af883c61e6e67c4ed9bfdea0d84b47e51cdd00aa2e0102e4c6`
* 1,439 tests passing, 70 files.

### What 3008 got wrong, and 2988 before it

`underXtrataRuntime()` decided whether to use the runtime's caching proxy by
looking for injected support scripts. **A served inscription has none.** Checked
directly: `https://xtrata.xyz/i/3008` and `/i/2988` both arrive with zero script
tags.

So detection returned false on every real viewer, `/hiro/mainnet` was never
tried, and each reader went straight to `api.mainnet.hiro.so` from their own
address. The public allowance goes quickly against 43 games and 2,604
submissions, and a rate-limit refusal carries no `Access-Control-Allow-Origin`,
so the browser reports it as a CORS failure rather than a 429. That is the 384
"CORS" errors and the "could not reach any Stacks endpoint" banner — with the
chain fine and `https://xtrata.xyz/hiro/mainnet/v2/info` answering 200 the whole
time.

It also explains 2988 being slow rather than broken: same fault, less data to
exhaust the allowance with.

**Detection now reads the injected `<base href="null">`**, which IS present in
both, is the same tag the UI already works around for relative links, and is
not something an un-rewritten page would ever set.

### Why the tests passed

The fixture was a runtime that injects scripts — a shape no inscription has ever
been served in. It proved detection against a page that does not exist, so it
passed while the function returned false on every live viewer. The fixture is
now copied from the served bytes of 3008, and the assertion is on the base
CHOSEN rather than on the boolean, because the boolean was never the point.

## 2.1.0 — 2026-08-18

Prepared for inscription, not yet inscribed.

**Rebuilt 21:02** after the help panel, the embedded manual and the rating
checkpoint reader landed. The figures below replace the 11-chunk ones this entry
first carried; the reasoning about the version number is unchanged.

* **201,457 bytes, 13 chunks.** 0.30 STX protocol + 0.20 STX miner.
* `htmlSha256` `73b06d12918a9668d161927ecb93cd5a8c29943539a8c56f4b0cfff52dba6e37`
* xtrata chunk hash `29216b301a93f78010db5ebc9fb163f089dbf3b8e11e3f10f95cb28e72708113`
* `MANUAL_PAGE` 3007, inscribed ahead of this build so the fallback names a
  manual that documents everything the build reads.
* 1,436 tests passing, 70 files.

**THE BUILD IS NOT BYTE-REPRODUCIBLE**, and this is the entry that has to say
so. The version line carries a build TIMESTAMP, so two builds of identical
source differ — the same tree produced `ef408179…` at 20:24 and `bcee38aa…` at
21:02. That is deliberate, since the timestamp is what tells a bug reporter
which build they were looking at, but it has a consequence worth stating once:
the hash above belongs to ONE FILE, not to a commit. Do not rebuild between
checking it and inscribing, or the thing inscribed is not the thing checked.

### Timed games are deliberately not in this

Planned in `docs/PLAN-timed-games.md` and held back. It changes `canonicalRules`,
which is the one file where a mistake makes two boards disagree about a finished
game for ever, and holding a proved build back for it would have risked both.

**Why 2.1.0 and not 2.0.0.** 2.0.0 is already on chain as inscription 2988 and
has been since 9 August. Bumping `2.0.0-dev` to `2.0.0` looked like the obvious
move and would have put two different permanent artefacts under one version —
which is the exact thing this ledger exists to prevent, and it was caught only
because writing the entry landed next to the existing one. The contract and every
protocol are unchanged since 2988, so this is a minor bump rather than a major.

* **179,090 bytes, 11 chunks**, one `add-chunk-batch` transaction. 0.32 STX
  at the live fee unit of 100,000 uSTX.
* `htmlSha256` `90bbace8ada3d634bb18ca18560ae93c79c16ec739262bcf38745f68c6747ee6`
* Contract `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xchess-core-v1-canary`.

### Why the version changed at all

`2.0.0-dev` was about to become permanent. The build did NOT read the version
from `package.json` — it carried its own literal default — so the number in the
manifest and the number in the artefact were two separate facts that happened to
agree. Bumping `package.json` alone would have changed nothing anybody could see,
and the board would have said `dev` for ever. The build now reads `package.json`,
with `--version` still overriding.

### What is in it since the last canary

* Tournaments are found rather than typed: a group of manifests is the wallet
  they are sent to. See ADR-0017 and `docs/MANIFESTS.md`.
* Your own games are found past the end of the newest-25 window, from your own
  transaction history, and remembered locally.
* The Explore tab carries a count of games waiting on your move, which updates
  without the tab being opened and clears when a game ends.
* Every game says what a move actually costs, because `stx_callContract` has no
  fee parameter and the wallet's own estimate has been up to fifteen times the
  price every move here confirms at. When a move of yours is stuck it says the
  nonce instead, which is the one thing neither wallet can tell you.
* Provenance distinguishes a tournament nobody has started from one that could
  not be checked.

### Verified before the build

* 1,379 tests, 17 skipped.
* The runtime replica suite passes, which is the only thing that catches the
  four constraints invisible in local dev: one boot rather than two, the proxy
  rather than the public host, survival of `document.write`, and an unframed
  page saying up front that it cannot sign.

## The manual — inscription 3003, live on mainnet

Inscribed 2026-08-18 at block 8,795,587, tx
`3ade6c0f2cf3bcd706dea945d18692d252b53c84ca9be37c427103ba5ec83e28`.

```
source        docs/manual/xchess-manual.txt
bytes         10,968  (one chunk, one transaction)
final hash    0xf06feae73fefa2439d7a5c351e87e08eb0027f517e714d51b08e1ff9bb642e6b
creator       SP4ERAJ8SN0J7V3DWZNKBWM7HGWCFV9A3HH62S2S
parent        Genesis #107
cost          0.30 STX protocol + 0.02 miner
```

**Not part of the board, and that is the point.** The board carries a short
manual built in, which needs no reads and cannot fail. This is the long one, and
it is separate because a board is permanent while documentation is the thing most
likely to be wrong. A correction is a new inscription: inscribe it, send it to the
directory wallet, and every board already out there reads it without being
rebuilt. Use `--after 3003` so a reader can walk back through earlier versions.

Verified after confirmation, from a browser with its cache cleared: the board
found 3003 by reading the wallet, parsed it, marked it `official` because the same
wallet minted it, and rendered 23 index entries, 12 glossary definitions and 5
commands.

---

## Format

```
### <version>  <date>

commit            <sha>
contract          <principal>.<name>          deployed in <tx>
html sha256       <64 hex>
bytes             <n>
manifest          replayHash / rulesHash / ratingHash / contractHash
inscription       <id>, or "not inscribed"
verify            <pass/fail>, <n> tests
wallet matrix     <n>/14 rows, signed by <who> on <date>
known limitations <the things a user would notice>
```

---

## 2.0.0-dev — 2026-08-08

The first build that exists. **Not a release candidate and not inscribable.**

```
commit            (working tree, uncommitted)
contract          SP000000000000000000002Q6VF78.xchess-core-v1   PLACEHOLDER, not deployed
html sha256       recorded in dist/manifest.json per build
bytes             ~68,000
inscription       not inscribed
verify            passing
wallet matrix     0/14 rows
```

**Why it is not a candidate.** `npm run release` refuses it, and correctly, on
four counts:

1. the contract is a placeholder that is not deployed anywhere
2. the version string still says `dev`
3. no wallet matrix row has been run
4. `ops/LAUNCH.md` has open items

**Known limitations, as of this build:**

- Nothing has ever been signed by a real wallet.
- Nothing has been read from a live endpoint; only the mock and simnet.
- The contract-principal post condition that every sponsored move depends on has
  never reached a wallet. Risk R1.
- The runtime emulator has been exercised under jsdom, not a real browser.
- Sealed-game generation is not implemented.
- The explorer does not yet surface legacy games, though the adapter exists.

**What this build does establish:**

- The engine is correct by perft (~590M nodes).
- Replay is total and deterministic under fuzzing, and honours the protocol a
  game committed to.
- The contract is solvent under property testing, and a zero-STX wallet plays a
  full game at the design fee with its bootstrap untouched.
- The artefact boots once, loads nothing, and carries no server reference.

---

## 2.0.0 — 2026-08-09  ·  **inscription 2988, live on mainnet**

Written retroactively on 2026-08-14. **This entry was missing**, which is the
worst gap a ledger of this kind can have: the one build that actually shipped was
the one with no record of what it was.

```
commit            (not recorded at the time)
contract          SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xchess-core-v1-canary
html sha256       (not recorded at the time)
build hash        c2861564
bytes             123,062
inscription       2988   <https://xtrata.xyz/i/2988>
verify            passing at the time
wallet matrix     0/14 rows, unsigned
```

**Known limitations, all confirmed after it went up.** Every square drawn the
wrong colour; an endpoint failover that never recovers; a promotion that cannot
be cancelled and can fire a move that was abandoned; reduced motion inert; the
selection ring at 1.006:1 on light squares; Copy link producing a dead link from
the one page a player can sign on; a failed move vanishing without explanation;
a rules-recovery search anybody can freeze; the runtime rewrite eating the
primary chain host; and `?game=` deep links that do nothing, because
`openFromLink` was written the day after this was built.

Each is described, with what it costs and whether the tree still has it, in
`ops/ERRATA.md`. **An inscription cannot be corrected, so that list is the only
remedy this build will ever have.**

**What it does establish:** two people played real games on it, with real
transactions, from a permanent inscription against a live contract. Everything
above was found because of that.

---

## Before the next entry

A release candidate needs, at minimum:

- a real deployed contract, canary or production, named in the build
- a version that is not `dev`
- the wallet matrix signed against that exact build hash
- `ops/LAUNCH.md` with no open items

`npm run release` checks all four and refuses without them.

**Two of those have changed since this was written**, and both are worth knowing
before the next entry is attempted:

The matrix can now be RUN, at `dist/xchess-gates.html?track=wallet`, and the gate
reads evidence rather than the absence of the words "not run" — fourteen RESULT
lines carrying the build hash, the provider that served each call and a
transaction id. Editing the table no longer satisfies anything.

And the build is only reproducible if it is PINNED. It stamps itself with the
clock, so two builds of identical source disagree across a minute boundary, and
`verify` rebuilds as its last layer. Build with `SOURCE_DATE_EPOCH` set and do
not rebuild after gathering evidence, or every signed row refers to an artefact
that no longer exists. See `ops/INSCRIBING.md`. It is not a
formality: an inscription is permanent and a contract is immutable, so the
expensive mistake is not a failed release, it is one that should have failed.
