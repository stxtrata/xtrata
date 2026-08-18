# X Chess 2

Chess on Stacks, where the board itself is a permanent Xtrata inscription.

Every game is on chain, every move is a transaction, and the position, the
result and every rating are **derived by replaying the log** rather than stored.
There is no X Chess server: no API, no database, no signing service, no
indexer, no leaderboard. If every machine anybody involved has ever operated
disappeared tomorrow, the application would keep working.

**Live on mainnet as Xtrata inscription 2988.** Open
<https://xtrata.xyz/i/2988> and play. See
[Where this actually stands](#where-this-actually-stands).

---

## Contents

- [Get it running in two minutes](#get-it-running-in-two-minutes)
- [Prerequisites](#prerequisites)
- [Every command](#every-command)
- [Running the tests](#running-the-tests)
- [Building](#building)
- [Looking at the app](#looking-at-the-app)
- [The Xtrata runtime harness](#the-xtrata-runtime-harness)
- [Deploying and inscribing: the gates page](#deploying-and-inscribing-the-gates-page)
- [What is in this repository](#what-is-in-this-repository)
- [The documents](#the-documents)
- [Where this actually stands](#where-this-actually-stands)
- [Troubleshooting](#troubleshooting)

---

## Get it running in two minutes

```bash
npm install
npm run build
npm run serve
```

Then open <http://localhost:4330> and click `xchess.html`.

To convince yourself it works rather than just looks like it:

```bash
npm test
```

That is about two minutes and 867 tests. Nothing in it touches the
network, a wallet, or any money.

---

## Prerequisites

| what | version | why |
|---|---|---|
| Node.js | 22 or newer | everything |
| npm | 10 or newer | everything |
| Clarinet | 3.12 or newer | the contract tests only |

Clarinet is only needed for `npm run test:clarity` and `npm run check:contract`.
Everything else runs without it.

```bash
brew install clarinet     # macOS
clarinet --version        # expect 3.12.0 or newer
```

**The contract targets Clarity 4.** That is forced, not chosen: `as-contract`
does not exist in Clarity 4, and the sponsorship reserve requires the contract
to spend from its own balance, which means `as-contract?`. An older Clarinet
cannot compile it. See `ops/DECISIONS.md`, ADR-0001.

Two suites can optionally reach the network, and both are read-only and opt-in:
`npm run test:live`, and the recursion route in the runtime harness.

---

## Every command

```bash
npm install                  # once
```

**Checking**

| command | what it does | needs |
|---|---|---|
| `npm test` | every test that needs no network or wallet (~2 min) | |
| `npm run test:unit` | engine, replay, rules, codec, wallet, ratings | |
| `npm run test:perft` | move generation, shallow depths (~5 s) | |
| `npm run test:perft:deep` | the full canonical set, ~590M nodes (~13 min) | |
| `npm run test:clarity` | the contract, in Clarinet simnet (~3 min) | Clarinet |
| `npm run test:artifact` | the BUILT artefacts, and the Xtrata runtime | `npm run build` first |
| `npm run test:live` | reads mainnet, freezes the legacy games as fixtures | network |
| `npm run typecheck` | TypeScript, no emit | |
| `npm run check:contract` | `clarinet check` | Clarinet |
| `npm run audit:serverless` | refuses any server dependency in shipped code | |

**Gates**

| command | what it does |
|---|---|
| `npm run verify` | every gate that needs no person. Fails fast, in order. |
| `npm run verify -- --deep` | the same, with deep perft. What a release runs. |
| `npm run release` | verify + build + artefact tests + the gates a machine cannot close. **Refuses** unless all of them pass. |

**Building and looking**

| command | what it does |
|---|---|
| `npm run build` | `dist/xchess.html`, `dist/xchess-gates.html`, `dist/manifest.json` |
| `npm run serve` | plain static server on :4330 |
| `npm run serve:runtime` | the Xtrata runtime emulator on :4331 |

---

## Running the tests

`npm test` is the one to run. What follows is what it is actually proving, in
case a failure needs interpreting.

### Where the tests are

```
tests/perft/        move generation, against published node counts
tests/replay/       replay's behaviour, stated as things a reader may rely on
tests/fuzz/         replay under hostile input: totality and determinism
tests/rules/        the canonical rule encoding, pinned to golden vectors
tests/protocol/     SHA-256 and the Clarity codec, against Node and the SDK
tests/wallet/       provider discovery and post conditions
tests/rankings/     Elo v1, and the determinism it has to have
tests/chain/        endpoint selection and graceful degradation
tests/clarity/      the contract, under Clarinet
tests/economics/    solvency and accounting, over random operation sequences
tests/sponsorship/  the zero-STX player, and the fee sweep
tests/legacy/       that new protocol assumptions do not corrupt old games
tests/ui/           the board's own rendering: square colour, coordinates, sound
tests/engine/       the chess edge cases the rules audit turned up
tests/artifact/     the BUILT html, not the source
tests/runtime/      the artefact under the Xtrata runtime
tests/e2e/          cache destruction, and the deployment gating
tests/bns/          resolving a .btc name, and refusing to guess one
tests/chess/        the engine every tournament player is handed
tests/wizards/      the tournament harness: schedules, manifests, forfeits
```

### The ones worth understanding

**Perft** is the only way to know a chess engine is correct rather than nearly
correct. `npm run test:perft` runs shallow depths in about five seconds;
`npm run test:perft:deep` runs the full canonical set, about 590 million nodes,
in around thirteen minutes. The release gate requires the deep run.

**Replay fuzzing** feeds thousands of seeded random logs — legal moves, line
noise, impossible promotions, entries after checkmate — and asserts two things:
replay never throws, and the same bytes always give the same answer. It also
asserts the property everything rests on: *removing every rejected entry from a
log does not change the position or the result.*

**The Clarity suite** needs Clarinet and takes about three minutes. It includes
the economic property tests, which run 900 random operations and check five
invariants after every single one, and the zero-STX sweep, which measures how
far a sponsorship actually carries a player and writes the result to
`ops/measurements/`.

**The artefact tests read `dist/`, not the source.** This is not a detail. The
legacy project's worst bug — the app booting twice, so every click signed two
transactions — was correct in every source file and wrong only in the bundle.
Three more bugs of exactly that shape were found here the same way.

### When a test fails

**Check the fixture first.** In this project the engine has been right and the
fixture wrong more often than the reverse — four times during the initial build.
The engine has fixture-free cross-checks for exactly this reason: mirroring a
position must not change its node count, and the fast and slow move paths must
agree. If those pass and a published number does not, suspect the number.

---

## Building

```bash
npm run build
```

Produces:

```
dist/xchess.html      179,090 bytes   the board, self-contained
dist/xchess-gates.html   ~98 KB   the deployment and inscription gates
dist/manifest.json                provenance: hashes, protocol versions
```

Both are **one HTML file each, loading nothing**. An inscription cannot fetch
anything, so everything is inlined, and every byte is permanent.

Options:

```bash
npm run build -- --contract SP....xchess-core-v1 --network mainnet --version 2.0.0
npm run build -- --canary-name xchess-core-v1-canary
```

**The build remembers what it was last pointed at.** Once you have built with
`--contract`, a plain `npm run build` keeps that same contract and says so:

```
contract  SP3JN....xchess-core-v1-canary (mainnet) - kept from the last build
```

Before that, an argument-less build silently rebound the board to the
placeholder contract, which does not exist on any network — so the board could
read nothing, every game was "no such game", and the only clue was a warning
several hundred lines up a harness log. `npm run verify` runs the build, so
verifying your work was enough to break it. The memory lives in
`.xchess-build-target.json`, which is build output and not committed; a fresh clone has
nothing to remember and falls back to the placeholder, loudly.

The build refuses to emit a page with more than one unescaped `</script>`. That
guard exists because an inlined module containing that text once truncated an
entire build **silently** — the page looked like a page and simply stopped.

### The manifest

`dist/manifest.json` is the provenance nobody has to be trusted about: the
contract the board is bound to, the SHA-256 of the HTML, and hashes of the
replay, rules, rating and contract sources. Two builds agreeing on those agree
about the rules of the game, not just their version numbers.

---

## Looking at the app

```bash
npm run build
npm run serve
```

<http://localhost:4330> lists what was built.

**Serve it, do not open the file directly.** A page opened from `file://` has a
null origin and every API request it makes is refused by CORS before it leaves
the browser. You would see an application that cannot read the chain and no
useful explanation of why.

This tells you nothing about how it behaves as an inscription. For that:

---

## The Xtrata runtime harness

An inscription does not simply load. The viewer fetches its bytes, injects a
`<base>` and three support scripts, and then builds the document with
`document.open()` / `write()` / `close()`. Separately, at serve time, Hiro API
bases are rewritten — but only for `text/html`.

The legacy project found three permanent bugs there and **nowhere else**, and
none was visible in ordinary development. So:

```bash
npm run serve:runtime              # http://localhost:4331
npm run serve:runtime -- --framed  # with a host bridge, so signing works
```

`--framed` is not an extra. `stx_callContract` is refused with `-32601` unless
the page carries a `walletBridgeToken` and has a parent or opener. That is how
the Xtrata site opens inscriptions, so it is how every move will be signed.
Unframed, the board reads and replays perfectly and can sign nothing — which is
correct behaviour, not a fault.

```bash
npm run serve:runtime -- --framed --wallet=stub    # a stand-in that approves
npm run serve:runtime -- --framed --wallet=refuse  # one that rejects
npm run serve:runtime -- --framed --wallet=silent  # one that never answers
```

The harness reads the **real** runtime scripts from `../../xtrata-2.0/public/runtime`,
so they cannot drift from what the site serves. If that checkout is missing, the
runtime routes say so plainly rather than pretending.

The automated half of this runs in `npm run test:artifact` and needs no browser.

---

## Deploying and inscribing: the gates page

`dist/xchess-gates.html` is a second self-contained artefact that walks an
operator through **every physically gated step** from preflight to the permanent
inscription. Twenty-six steps across six phases.

```bash
npm run build -- --network testnet --canary-name xchess-core-v1-t1
npm run serve
# then open http://localhost:4330/xchess-gates.html with a wallet installed
```

### Build it for testnet first

**`npm run build` with no arguments produces a MAINNET gates page.** Step 5
deploys a contract with real STX, and it cannot be undone. For a first run,
always pass `--network testnet` and a throwaway contract name, as above.

The page checks the network it was built for against the account you connect,
and refuses to go on if they disagree — so a testnet build cannot deploy to
mainnet by accident. That check is the last line of defence, not the first one.
The first one is building it for the network you meant.

### What it does not do

**No seed phrase. No private key. No environment variable.** Every transaction
is built on the page, shown in full, and handed to whichever wallet the browser
has. Nothing is signed without a deliberate confirmation.

### The rule it enforces

> A step is not done because its button was clicked. It is done when its effect
> has been **read back off chain**.

`deploy` and `deployed` are separate steps. Nothing downstream of `deploy`
unlocks until the contract has been read back and reports its own principal,
protocol and format version from the chain. The failure worth catching is not
the transaction that fails — that one is loud. It is the one that is accepted
and then does not say what you meant.

Three more things it enforces:

- **Irreversible steps require typing the step's own name.** `prod-inscribe`,
  not "yes". You cannot type it without having read which step you are on.
- **Redoing a step reopens everything downstream, transitively.** Otherwise a
  re-deploy would leave twenty later steps marked green against a contract that
  no longer exists.
- **`stx_deployContract` gets three shape fallbacks.** Unlike
  `stx_callContract`, it has no provenance: nothing in this project has ever
  deployed through a wallet.

### The phases

| phase | steps |
|---|---|
| Before anything is spent | wallet · account · contract name free · source hash |
| The contract | deploy · **read it back** |
| Configuration | set the constants · **read them back** |
| Exercising it | standard game · submit · sponsored open · bootstrap arrived · **sponsored rebate** · exhaustion · top-up · treasury · settle · ranked |
| The artefact | manifest matches · wallet matrix signed · inscribe canary · run the matrix against the **inscription** |
| Production | deploy · verify · inscribe · launch suite |

Copy report at any point gives you something to paste into `ops/RELEASES.md`.

### Before you use it in anger

Read `harness/wallets/MATRIX.md`. Row 4 is the one that has never run anywhere:
a sponsored move needs a post condition covering the rebate the **contract**
sends, with a contract-principal encoding no X Chess build has ever put in front
of a wallet. If a wallet or the Xtrata bridge mishandles it, every sponsored move
aborts while still charging its network fee.

---

## What is in this repository

```
contracts/        xchess-core-v1.clar        the whole contract
packages/
  chess/          the engine: board, fen, moves, uci, perft
  replay/         replay, events, results
  protocol/       canonical rule hashing, sha256, protocol versions
  chain/          clarity codec, endpoints, live client, mock, legacy adapter
  wallet/         provider discovery, requests, post conditions
  ratings/        ranked-v1 eligibility, elo-v1
  storage/        the disposable verified cache
  ui/             board, shell, app, boot, gates, canary
  build/          the build
apps/
  chess/          the board's entry point
  canary/         the gates page's entry point
harness/
  verify.mjs           the verification gates
  release.mjs          the release gates, which refuse
  serve.mjs            a plain static server
  runtime/serve.mjs    the Xtrata runtime emulator
  serverless-audit.mjs refuses any server dependency in shipped code
  wallets/MATRIX.md    the rows a machine cannot run
  fixtures/            real games read off mainnet
ops/              STATUS, DECISIONS, RISKS, RELEASES, LAUNCH, measurements
tests/            see above
```

### The architectural rule

> **The contract may filter, never adjudicate.**

The contract does not know the rules of chess and must never learn them. It
stores short strings in a total order and forms no opinion about them. It does
not know whose turn it is, what check is, or that some of the strings it stores
are not moves at all.

Anything it rejects never enters the log, so a filter is safe. Anything it
wrongly accepts is skipped identically by every reader, because replay is a pure
total function of the log.

If you find yourself teaching the contract about chess, stop. That is the design
failing, not the contract.

---

## The documents

Read in this order:

| file | what it is |
|---|---|
| `ARCHITECTURE.md` | the whole thing, written so somebody could rebuild it |
| `RULES-V1.md` | the exact bytes a rule set hashes to, with golden vectors |
| `EVENTS-V1.md` | the submissions that are not moves |
| `REPLAY-V1.md` | how a log becomes a position and a result |
| `RANKED-V1.md` | what makes a game count towards a rating |
| `RATING-V1.md` | elo-v1, and why two readers cannot disagree |
| `SPONSORSHIP-V1.md` | how a player holding nothing gets to play |
| `RULES-AUDIT.md` | the chess edge cases, and the one bug the audit found |
| `ops/DECISIONS.md` | thirteen ADRs, including three that contradict the brief |
| `ops/RISKS.md` | what could still go wrong, and what closes each one |
| `ops/LAUNCH.md` | the checklist. Every unchecked line is a reason not to inscribe |
| `ops/STATUS.md` | where this actually is |

Those seven protocol documents are the deliverable that matters most. Given only
the chain, the contracts and them, an independent developer can reconstruct every
game, position, result and rating without this repository existing.

---

## Where this actually stands

**Live on mainnet. Real games, real moves, real money.**

The application is Xtrata inscription **2988**, version 2.0.0, built
2026-08-09, build hash `c2861564`, and inscription 2988 is 123,062 bytes. Served at
<https://xtrata.xyz/i/2988> and reconstructed from the chain on every load.

It talks to `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xchess-core-v1-canary`
on mainnet.

### Live state, read from the contract on 2026-08-17

| Reading | Value |
| --- | --- |
| `get-game-count` | 30 |
| Moves submitted across all games | 1691 |
| Distinct addresses that have opened a game | 9 |
| `get-ranked-count` | 25 |
| `get-open-fee` | 10000 uSTX (0.01 STX) |
| `get-bootstrap-amount` | 250000 uSTX |
| `get-rebate-amount` | 2000 uSTX |
| `get-rebate-count` | 45 |
| `get-sponsor-price` total | 390000 uSTX (0.39 STX) |
| `is-solvent` | true |

The longest game so far is game 18 at 340 submissions. Every one of those 1,691
moves is a signed transaction, so the claim that a move is a transaction is no
longer a design statement.

**The sponsorship readings are ADR-0016's, applied the same day in
`0x85cdc6dd21c3f4e674f1607bc89b419dcee06a3218eacfb1f3d307f15cd2800b`.** Until
that transaction the contract was selling a rebate of 10,000 µSTX with a count
of 2 — 0.02 STX of allowance under a document promising 0.45 — because canary
step 14 lowers the count to spend an allowance by hand and nothing put it back.
The step now restores what it lowers.

That transaction cost **0.019870 STX** in network fees, quoted by the wallet at
"Medium". It is worth keeping next to the numbers it set: ten times the rebate
it was writing, and a fair sample of why the rebate is no longer asked to track
the fee on its own.

**These numbers are a snapshot and go stale.** Re-read them from the contract
before quoting them anywhere. The commands are in
`xtrata-2.0/comms/README.md`, and the same rule applies to anything published
from `xtrata-2.0/comms/`.

### Known open point

The inscribed build hardcodes the contract name `xchess-core-v1-canary`, and
the inscription is permanent. If a contract named `xchess-core-v1` is ever
deployed as the "real" one, inscription 2988 will keep talking to the canary
regardless. Either the canary is the production contract from here on, or a new
inscription is needed. Decide which before promoting a second contract, because
2988 cannot be repointed.

`ops/LAUNCH.md` and `ops/RISKS.md` still describe the pre-launch gates. R1
remains the risk that matters most.

---

## Troubleshooting

**`clarinet: command not found`**
Only the contract suites need it. `npm test` does not.

**`clarity_version field invalid (value supported: 1, 2, 3)`**
Clarinet is too old. The contract is Clarity 4 and cannot be built by an older
one. Upgrade to 3.12 or newer.

**`dist/xchess.html is missing`**
`npm run build` first. The artefact suites deliberately read what was built
rather than the source.

**The board loads but says it cannot reach the chain**
You opened it from `file://`. Use `npm run serve`.

**The board loads but Connect does nothing**
Under the runtime harness without `--framed` there is no host bridge, so
`stx_callContract` is refused with `-32601`. That is the runtime behaving as
written. Use `npm run serve:runtime -- --framed`.

**`Could not read wallet-shim.js from .../xtrata-2.0/public/runtime`**
The runtime harness reads the real scripts rather than copies, so it needs
`xtrata-2.0` checked out beside the repository root. Everything else works
without it.

**A perft number disagrees**
Check the fixture first. See [When a test fails](#when-a-test-fails).

**The economics suite takes three minutes**
It is running 900 random operations and checking five invariants after every
one. That is the intended cost.

## Manifests

Tournaments and player profiles are inscribed documents, and the board finds
each group by the wallet they are sent to — one address per group, because a
wallet is the only index that grows after the board is permanent. See
[docs/MANIFESTS.md](docs/MANIFESTS.md).
