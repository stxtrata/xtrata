# ParallaX Casino: on-chain LAYR settlement and on-chain playback (plan)

Written 2026-10-29. **Status: PLAN ONLY.** No contract exists, nothing is deployed, nothing is signed. Everything here is
testnet until Jim says otherwise (see the mainnet gate in P6 and decision 1 in section 6).

Companion docs: `docs/plans/CASINO-ROUND-LOG.md` (the client-reported round log, the first step of this plan),
`docs/PASSKEY-WALLET.md` and `docs/WALLET-PLAYBOOK.md` (wallet rules), `docs/plans/SPONSOR-RELAYER-RUNBOOK.md` (fee sponsoring),
`contracts/arcade-world/` (the contract patterns this plan copies). Project docs: `casino-pvp-design.md` (chip token, shared bankroll,
commit-reveal and ordering lessons), `casino-holdem-v1.md`, `casino-testnet-wizards.md`.

## 0. The plan in ten lines

1. Today LAYR is a number in the browser. Only the buy-in (STX to the shop address) touches the chain. Spins, wins, cash-outs and
   balances are browser-only and can be edited by the player.
2. Step one (already under way) is a **round log** in D1: every spin, bonus, gamble, purchase and bank move is reported by the pages.
   It is statistics, not proof.
3. Step two makes the engines **deterministic functions of a seed stream** (same seed, same rounds, in the browser, on a server,
   in tests and later in Clarity), and builds a **replay page** that re-plays logged rounds through the real machine.
4. Step three puts **LAYR on chain**: a SIP-010 token minted only by a **treasury contract** against STX (1 STX = 100,000 LAYR), with
   bankroll limits, an admin timelock, a pause that never traps a player's funds, and a successor pointer.
5. Step four plays through **sessions**, not spins. Stake is locked in the treasury, the player plays many spins off chain, and one
   close transaction settles the net result. Per-spin transactions are economically absurd at these bet sizes (section 3.2).
6. Randomness must be unpredictable to the player at the moment they bet. **"Player secret plus a public block hash" is NOT enough**:
   the player could compute every future spin and size bets or stop at the peak (section 3.1). The house contributes a committed secret.
7. Every settled session commits a **transcript hash** and reveals both seeds on chain. Anyone can then re-derive every spin and
   re-play the session: **on-chain playback**. Notable sessions can be inscribed through Xtrata.
8. Until a Clarity verifier exists (P5), the house's honesty is **auditable, not enforced**: a cheating operator is provable after
   the fact, but only a bond and reputation punish it. P5 adds one-spin fraud proofs so the contract itself can overrule the house.
9. Mainnet is a separate gate: legal advice, independent contract review, bankroll funding and caps. LAYR that can be cashed out
   for STX is real-money gambling in most places. This plan does not assume that is allowed.
10. Jim's calls are listed in section 6. The ones that change the design: closed-loop or cash-out, operator in the loop, shared or
    per-player jackpots.

## 1. Where we are today (verified from the code and the session's audit)

| Fact | Detail |
| --- | --- |
| Pages | `/casino/` (built from the `mach/` pipeline into `public/casino/index.html`) and `/casino-b/` (the GPT build, `public/casino-b/index.html`). Both run the same five machine engines. |
| Machines | The Drop, Forever Twins, Deep Strata, Block Fortune, Neon Vault. Block Fortune, The Drop, Forever Twins and Deep Strata share one engine family (the shared machine kit); Neon Vault has its own. |
| RTP | **94.38% on all five, exactly** (full 32^5 enumeration plus a Markov/DP model for the bonuses; 5.62% house edge). Perceived generosity is variance. |
| LAYR | Play money. 1 STX = 100,000 LAYR, so 1 LAYR = 10 microSTX. Smallest bet on Block Fortune and Neon Vault is 20 LAYR = 0.0002 STX. |
| Buy-in | The LAYR Exchange asks the wallet for an STX transfer to the testnet shop address `ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA` with memo `PARALLAX-LAYR-xxxxxx`, then checks `api.testnet.hiro.so` and credits the **browser** balance. The shop address is an ordinary wallet: STX sent there is not converted or tracked by any contract. |
| Everything else | Spins, wins, jackpots, gambles, balances and "cash-out" live in the page (localStorage). A modified browser can set any balance or report any win. |
| Jackpots | One meter per bet level per machine, seed 500x bet, +2% of every paid bet at that level. **Per browser**, not shared. |
| Determinism | The engines are pure functions of the five reel stops (each 0..31) plus, for bonuses, the dealt prizes/frames. A round can be replayed from its logged stops (this is what makes the round log useful). |
| Two LAYRs | (a) the browser balance above; (b) `layr-test`, the SIP-010 chip token used by the PvP testnet work (`casino-pvp-design.md`). This plan makes them one token. The repo location of the `layr-test` source is still unresolved. |

What the round log (P0) adds: a record of what the pages **say** happened. It is not trusted input to anything.

## 2. Goals, non-goals, principles

**Goals**
- G1. LAYR balances live in the player's wallet on chain, not in the browser.
- G2. A player can verify that no spin was rigged after they bet, and the house can verify the player did not forge a win.
- G3. Winnings settle on chain in one transaction per session, with a way out if the operator disappears.
- G4. Anyone can replay any settled session from public data, in the real machine UI, and check the arithmetic.
- G5. The same chip token and bankroll serve the machines and the PvP tables (Liar's Dice, Hold'em), as already planned.

**Non-goals (for now)**
- A transaction per spin. A fully trustless slot with no operator before P5. Mainnet value. Moving the 3D casino rooms on chain.
- Changing any machine's maths. RTP stays 94.38%; any change to RNG consumption is re-verified against the exact tables.

**Principles** (copied from what has already worked in this project)
1. **Contracts are referees for money only; they never run animations or trust the UI.** Replay is display and audit.
2. **Two referees is the fork trap.** The JS engine and any Clarity verifier must agree; differential fuzz proves it (as for
   `casino-holdem-v1`: about 28,700 calls, 0 mismatches).
3. **Rules are committed by hash.** A session records the hash of the ruleset (engine build) it was played under, so an engine
   change cannot silently change an old session's meaning.
4. **Nothing may depend on two transactions being in different blocks** (ordering finding, `casino-pvp-design.md` 3a).
5. **Fail open for play, fail closed for money.** Logging/replay failures never block play; money paths refuse on any doubt.
6. **Pause never traps funds.** Like `retract` working while paused in `xtrata-world-v1`, session refunds/timeouts work while paused.
7. **Hot keys hold little.** The operator key signs states; it holds no admin role and little STX (same posture as `SPONSOR_KEY`).
8. **Deployed contracts cannot be edited.** Version and migrate: successor pointer with a one-way lock, frozen read interface.
   Per the repo's "newest only" rule the casino pages talk to exactly one treasury version; an older one is reachable only through an
   explicit migration path, never read side by side.
9. **Test before trust:** simnet suites with conservation checks after every scenario, then testnet, then an independent review
   (the arcade-world review found real bugs; budget for one).

## 3. Design findings that shape everything

### 3.1 The foresight problem (why "player secret + public block hash" fails)

If the whole stream is `f(playerSecret, publicBlockHash, n)`, then as soon as the anchor block exists the **player** can compute
every future spin. With free choice of bet size, gamble, or when to cash out they can:
- bet minimum on spins they know lose and maximum on spins they know win;
- gamble only the wins they know will double;
- cash out at the peak of the (known) balance path (optimal stopping with perfect information is +EV even with negative drift).

Fixes, in order of how much they cost:
- **Sealed batches** (fixed bet, fixed number of spins, claim at the end, no gamble, no early stop): foresight is harmless because
  nothing the player chooses depends on it. Fully trustless. A small product on its own, and the best first target for a Clarity port.
- **House secret in the stream** (live sessions): the house commits to `sha256(houseSeed)` before it sees the player's seed; spins
  derive from both seeds (and optionally a later block hash). The player cannot predict spins. This is the industry-standard
  "provably fair" scheme.
- **Per-spin future block** (one transaction per spin, outcome from a block after the bet): trustless and slow; only for jackpots.

The house-secret scheme gives the **house** foresight instead, which creates a residual risk: *selective denial* (the operator goes
quiet when the next spin is a big win). Section 4.6 lists what protects against it at each phase. The stronger variant, a blind house
via dual hash chains (house reveals first, player reveals last, a missed reveal forfeits the bet), is noted in 4.4 as an option for P5+.

### 3.2 Fee economics: why sessions

1 LAYR = 10 microSTX. A testnet contract call costs about 0.01 STX (project docs) = 1,000 LAYR = 50 smallest bets. Mainnet fees are
unmeasured here (the sponsor runbook quotes about 0.003 to 0.03 STX per mining fee).

| Stake locked in a session | Open + close fees at 0.01 STX each | Fees as a share of stake |
| --- | --- | --- |
| 5,000 LAYR (0.05 STX) | 0.02 STX | 40% |
| 40,000 LAYR (0.4 STX) | 0.02 STX | 5% |
| 200,000 LAYR (2 STX) | 0.02 STX | 1% |

On top of a 5.62% house edge, anything above a few percent of fee overhead kills the product. So: minimum session size in the
tens of thousands of LAYR, and/or **sponsored open/close** through the existing relayer (TO-VERIFY: the relayer is built for the
drops/market contracts; sponsoring arbitrary contract calls needs a new gate, see Appendix B).

### 3.3 Bonuses are already "dealt at spin start"

Per the machine docs, all outcomes, including bonus prizes and every hold-and-respin frame, are dealt when the spin starts; the
animation only reveals them, and the player's picks (vault tiles, geode) are cosmetic. So **one spin = one round of dealt
randomness**, which fits a session protocol: the server (or a Clarity verifier) computes a whole round from one derived seed. The
one genuine decision is the **gamble** (double up), which needs its own fresh derivation (`g` counter) and is why sealed batches
cannot offer it.

One exception, found in the engine source: **Neon Vault** draws each vault prize at the moment of the pick (`pick` takes a random
prize from its table), not at spin start, so its bonus needs one derived draw per pick (`p` counter) and the picks are a genuine
sequence the verifier must follow. The other four machines deal everything up front.

### 3.4 Everything random must be an integer decision

The engines currently draw from an rng. For bit-exact agreement between browser, server, tests and Clarity every random decision
must be an integer operation on stream words: reel stops are `byte & 31` (256 is exactly 8 x 32, so **no rejection sampling and no
bias**); the vault shuffle and other non-power-of-two choices use rejection sampling over 32-bit words; probabilities such as
"4% per empty cell per respin" become `word32 < floor(p x 2^32)`. This is a refactor of five engines and must keep the exact RTP
tables unchanged (P1 exit test).

### 3.5 Jackpots become a design question

Today each browser has its own meters. On chain, a **shared** meter per machine and bet level is natural (and a better draw), but
contributions then settle in batches at session close, so the jackpot paid is the meter at settlement, not at spin time. A
**per-wallet** meter keeps today's behaviour. Jackpot reserve must be segregated in the treasury so it can always be paid
(decision 4).

## 4. Target architecture

### 4.1 Diagram

```
 wallet (Xverse / Leather)         browser: casino page + machine iframes          operator (Cloudflare)
 ───────────────────────           ──────────────────────────────────────          ─────────────────────
  STX ──buy──┐                      engine (pure, deterministic)                    result service
             ▼                      replay mode (reads a transcript)                 holds houseSeed + signing key
       ┌───────────┐  open-session  round logger ──────────────► D1 casino_events    runs the same engine
       │ casino-   │◄───────────────  session client ◄── signed results ───────────► (per-spin request)
       │ treasury  │  close-session   (houseSeed commit, playerSeed, nonce)           D1 transcripts (cache)
       │ (clarity) │◄───────────────
       └─────┬─────┘                                                     
   mints/burns│ escrow, bankroll, jackpot pools, caps, timelock
             ▼
       ┌───────────┐          chain events (print) + Hiro API          ┌────────────────────────┐
       │ layr      │ ───────────────────────────────────────────────► │ replay page            │
       │ SIP-010   │   session id → seeds, commitments, summary        │ re-derives every spin, │
       └───────────┘                                                    │ checks hashes, plays   │
                                                                        │ it in the real machine │
   Xtrata core ◄── optional: inscribe a notable session (replay inscription) ─────────────────────┘
```

### 4.2 Components

| Component | What it is | Notes |
| --- | --- | --- |
| `layr` | SIP-010 fungible token, 0 decimals | Mint/burn only by the treasury. Same chip token as the PvP tables (`layr-test` today). |
| `casino-treasury` | Clarity contract | Buy/sell, session escrow, bankroll, jackpot pools, limits, rake sink, admin timelock, pause, successor pointer. |
| Result service | Cloudflare Worker/Function + secret key | Holds `houseSeed`s, runs the engine, signs states. TO-VERIFY whether Pages Functions suffice or a separate Worker/Durable Object is needed for per-session state. |
| Round log | D1 `casino_events` (P0) | Client-reported, untrusted. Becomes the cache of playable transcripts. |
| Transcript store | D1 table (new) + on-chain hash | Verified transcripts keyed by session id; integrity from the on-chain hash. |
| Replay page | Static page + machine iframes in replay mode | Reads chain + transcript store; re-derives and checks before playing. |
| Engines | The five pure engines, built once, used in the browser, the Worker, Node tests and (P5) ported to Clarity | Pinned by a ruleset hash. |

### 4.3 Session lifecycle (live sessions, recommended mode)

1. **Quote.** Client asks the result service for a session. Service returns `sessionId`, `houseCommit = sha256(houseSeed)`, an
   expiry, and its signature. (Committing first stops the house choosing a seed after seeing the player's.)
2. **Open (wallet tx 1).** Client picks `playerSeed` (32 random bytes), keeps it, and calls
   `open-session(machine, stake, sha256(playerSeed), houseCommit, houseSig)`. The treasury checks the signature, moves `stake` LAYR from
   the player into escrow, reserves bankroll cover for the session's exposure cap, and emits a `print` event.
   Post-conditions: exact fungible transfer, deny mode (wallet playbook).
3. **Start.** After the open tx confirms (Hiro check, as the Exchange does today) the client sends `playerSeed` to the service, which
   checks it against the commitment.
4. **Play.** Each spin: client sends `{sessionId, n, bet, choice?}`; service derives the round from the seed stream, runs the engine,
   applies the result to the balance, and returns `{round, balance, n}` signed with the operator key. The client keeps every signed
   state. Turbo, animation and sound are client-only. The client engine re-runs the round locally to check the result is consistent
   with the stops shown.
5. **Close (wallet tx 2).** Service returns `houseSeed` plus a final signed state. Client calls
   `close-session(sessionId, finalBalance, houseSeed, playerSeed, transcriptHash, houseSig)`. The treasury checks both seeds against the
   commitments and the signature, pays `finalBalance` to the player, returns the unused cover, books the house result, and emits the
   settlement event (seeds, hash, summary).
6. **If the operator vanishes.** `force-close(lastSignedState)` pays the last signed balance after a challenge window measured in
   `stacks-block-time` seconds (not block counts; ordering rule 4). The operator may submit any later state it signed during the window.
   A session nobody closes refunds the stake after a long timeout.
7. **Verify (anyone, any time).** Re-derive every spin from `(houseSeed, playerSeed, sessionId, n)`, run the pinned engine, compare to the
   transcript and to the settled balance (this is the replay page's first step).

The client must **persist `playerSeed` and the latest signed state before the first signing** (the Hold'em lesson: a lost seed is a
forfeit), offer a backup, and resume an interrupted session after a reload.

### 4.4 Randomness: three modes

| Mode | Stream | Latency | What is trustless | What it cannot do |
| --- | --- | --- | --- | --- |
| **A. Live session** (recommended) | `houseSeed` (committed first) + `playerSeed` (+ optional later Bitcoin block hash) | one request per spin; 2 wallet txs per session | Outcomes cannot change after commit; checkable by anyone after reveal. Contract-enforced overrule only from P5. | Needs the operator online; residual selective-denial risk (4.6). |
| **B. Sealed batch** | `playerSeed` + anchor block hash chosen after purchase | 2 txs per batch of N spins, no operator | Fully trustless once the Clarity verifier exists (P5): the contract can recompute or the dispute names one spin. | Fixed bet and N, no gamble, no early stop. |
| **C. Provable spin** | hash of a block after the bet tx | one tx per spin | Fully trustless | Too slow/costly for normal play; jackpot claims only. |
| *Option for P5+*: dual hash chains | house reveals link `h_k` first, player reveals `p_k` last, outcome `f(h_k, p_k)`, a missed reveal forfeits the bet | 3 messages per spin | The operator no longer has foresight | More protocol, more state, more dispute code. |

**Derivation v1 (draft, to be fixed by golden vectors in P1)**
```
spinSeed(n)   = SHA256("PLX1/spin" || houseSeed || playerSeed || sessionId || u64be(n) [|| anchorHash])
word(n, c)    = SHA256(spinSeed(n) || u32be(c))        // c = 0,1,2,... consumed in a fixed, documented order
reel stop i   = byte i of word(n, 0), masked & 31       // i = 0..4, no bias
gamble g      = SHA256("PLX1/gamble" || houseSeed || playerSeed || sessionId || u64be(n) || u32be(g))
bonus draws   = the following words, via rejection sampling or integer thresholds, in the engine's fixed consumption order
rulesetHash   = SHA256(engine build + paytables + strips)  // recorded in the session; changing the engine changes the hash
```
An independent implementation (Node test, Clarity port) must reproduce the published vectors byte for byte.

### 4.5 LAYR token and treasury

**Token.** `layr`, SIP-010, 0 decimals, name/symbol/URI set once. `mint` and `burn` callable only by the treasury principal.

**Treasury functions (sketch; Appendix C has the interface draft)**
- `buy-layr(microstx)`: pulls STX and mints `microstx / 10` LAYR (100,000 LAYR per STX). The rate is a constant of this contract version; reject amounts that do not divide evenly.
- `sell-layr(layr)`: **only if decision 1 allows redemption.** Burns LAYR, pays STX from reserve at the same peg, fee optional.
- Sessions: `open-session`, `close-session`, `force-close`, `refund-expired`, with per-session exposure cover.
- Bankroll: `fund-bankroll`, `withdraw-surplus` (admin, timelocked, never below liabilities), `set-limits` (timelocked).
- Jackpot pools per machine and bet level, segregated from the free bankroll.
- Rake/fees: destination is this bankroll (the "shared bankroll contract" the PvP design waits for).
- Governance: two-step admin, 24 h timelock on parameter changes with a one-way freeze (PvP pattern), pause, `set-successor` and
  `lock-successor` (arcade-world pattern), operator key rotation with a delay, all player actions require `tx-sender = contract-caller`.

**Invariants the test suite must hold after every scenario**
- I1. LAYR minted = LAYR burned + LAYR outstanding (wallets + escrow + bankroll).
- I2. If redeemable: STX reserve is at least outstanding LAYR x 10 microSTX plus segregated jackpot cover.
- I3. No path pays a session more than `stake + exposure cap`, and cover is always reserved before play.
- I4. A session pays out once. Closed/forced/refunded sessions cannot be closed again.
- I5. Pause blocks new sessions and buys, never refunds, timeouts or `force-close`.
- I6. Only the treasury can mint; no admin function can move escrowed player funds.
- I7. An exact public function list (assert absences: no admin drain), as in the PvP suites.

**Bankroll risk (parameters, not decisions made):** per-session exposure cap, per-wallet daily cap, max stake, jackpot reserve. First
step in P2: compute each machine's true maximum single-round payout (free-spin multiplier, cascades up to 30 drops, jackpot at full
meter) from the engines, so the cap cannot be below a payable outcome.

### 4.6 Settlement, trust and disputes by phase

| Phase | Who decides a spin | What stops a cheating operator | What stops a cheating player | Residual risk |
| --- | --- | --- | --- | --- |
| P2 (plumbing) | Client (honour) | Nothing; value is zero | Nothing; value is zero | Testnet only, play money |
| P3 | Operator, from committed seeds | Provable after the fact by replay; bond and reputation | Player never supplies stops; seeds mixed | Operator can drop a winning bet or sign a wrong state; player is only made whole by trust |
| P4 | Same | Same, plus every settled session is public and replayable by anyone | Same | Same |
| P5 | Operator, overruled by contract | One-spin fraud proof: contract recomputes the named spin and slashes/overrules | Same, plus session-key-signed bets | Verifier cost limits; bonus rounds are the heavy case |
| Blind-house option | Both seeds, house reveals first | House has no foresight; a drop is no longer selective | Same | Protocol complexity |

### 4.7 On-chain playback

**What the chain holds (small):** session id, player, machine, ruleset hash, both seed commitments and (after close) both seeds,
transcript hash, final balance, summary (spins, wagered, won, biggest win), emitted as `print` events and readable through Hiro.

**What the transcript holds (also small):** with the seed derivation, spin outcomes are **recomputed**, so the transcript is only the
player's decisions: bet changes, gamble calls, session start/stop. Estimated 1 to 2 bytes per spin plus a header, so a 500-spin
session is about 1 KB. (The P0 log records the stops directly: about 4 bytes of stops per spin plus bonus details.)

**Where it lives:** chain = hash and seeds; D1 (or R2) = cache of the body, always checked against the hash; optional inscription for
highlights. If the cache is lost, the player's own device and the operator's copy are the fallbacks (decision 6 covers privacy).

**Replay page (`/casino/replay#<sessionId>`):**
1. Read the settlement from chain. 2. Fetch the transcript, check `sha256` against the on-chain hash. 3. Re-derive all spins, run the
pinned engine, check the totals against the settled balance. A mismatch is shown plainly, with the first differing spin. "Could not check right now" (a failed read) is shown differently from "checked and it does not match"; the page never turns an error into a verdict.
4. Play it back in the **real machine UI in replay mode** (the machine page fed a recorded round instead of its own rng), with speed
control, skip to bonuses and big wins, and a scrubber.

**Playback v0 (P1, no chain):** the same page, reading the D1 round log. It shows what a browser *reported*, flagged unverified.

**Xtrata tie-in (later):** notable sessions (biggest win, a jackpot) are inscribed through the Xtrata core as a "replay inscription"
(JSON: ruleset hash, seeds, decisions). Cost is dominated by the begin/upload/seal transactions, not bytes (TO-VERIFY). A `live`
poster in the arcade hall could be bound to "biggest win" using the existing posters contract.

### 4.8 Wallet, keys and sponsoring

- Only two wallet prompts per session (open, close) plus buy/sell. No per-spin signing, so no session keys until P5 needs signed bets.
- Contract calls follow `WALLET-PLAYBOOK.md` exactly: no `sender` field in Xverse mobile calls, serialized hex post-conditions, deny
  mode with exact fungible/STX post-conditions, a signed-transaction gate before broadcast, and an account preflight. The passkey
  wallet is not live and is not a dependency.
- Operator key: an secp256k1 key in a Cloudflare secret (like `SPONSOR_KEY`). Its public key is registered in the treasury; rotation
  is delayed. It holds no admin role and no meaningful STX.
- Sponsoring open/close (so fees do not eat small sessions): extend the relayer with an allowlisted treasury gate. TO-VERIFY.

## 5. Roadmap: P0 to P6

Each phase is shippable, ends with a short report and waits for Jim's go-ahead. Mainnet only on his explicit say-so.

| Phase | Name | On chain? | Output | Trust after the phase |
| --- | --- | --- | --- | --- |
| P0 | Round log | no | `POST /casino/log`, D1 `casino_events`, debug dashboard, client hooks in both pages | Statistics only |
| P1 | Deterministic engines and replay v0 | no | Integer RNG interface, ruleset hash, golden vectors, replay page over the log | Replay of what was reported |
| P2 | LAYR token and treasury (testnet) | yes | `layr`, `casino-treasury`, Exchange reads wallet balances, legacy-balance claim, bankroll tooling | Balances on chain; play still honour system; zero value |
| P3 | Provable live sessions | yes | Result service, quote/open/play/close, seeds, signed states, force-close, resume | Outcomes provable after the fact; operator trusted for payment |
| P4 | On-chain transcript and verified playback | yes | Transcript hash and seeds in the close event, replay page against chain, highlight inscriptions | Anyone can verify a settled session |
| P5 | Trust-minimised disputes | yes | Clarity one-spin verifier (machine by machine), fraud proof, bond, sealed batches, session-key bets | Contract can overrule the operator on a named spin |
| P6 | Mainnet readiness | yes | Legal review, independent review, funding, caps, monitoring, runbook, canary | Mainnet gate |

### P0. Round log (in progress)
Scope, event contract and queries are in `CASINO-ROUND-LOG.md`; the event schema snapshot is in Appendix A.
- **Entry:** done. **Exit:** for every logged page session, `sum(win) - sum(bet of paid spins)` reconciles with the client's balance
  change (allowing for gamble and bank moves); a duplicate retry changes nothing; logging failure does not affect play.
- **Tests:** ingest unit tests (validation, caps, duplicates), a Playwright run capturing the POSTs and comparing with the engine's own
  state, a fail-open run with the endpoint returning errors.
- **Lesson to carry:** the log stores **no seeds, keys or signatures** and is client-reported.

### P1. Deterministic engines and replay v0 (no chain)
- **Scope:** (1) replace the float rng with an integer stream interface in all five engines (`u32()`, `below(n)`, `chance(num, den)`);
(2) fix the consumption order per machine and document it; (3) compute a `rulesetHash` per machine; (4) a Node `stream` module
implementing Derivation v1 plus published test vectors; (5) a replay mode for the machine pages and `/casino/replay` reading the P0 log;
(6) build the engines for Worker use from the same sources.
- **Entry:** P0 shipped and reconciling.
- **Exit:** (a) exact RTP of all five machines is still 94.38% (re-run the enumeration and DP, compare tables); (b) 1,000,000 random
seeded rounds per machine: browser build and Node build produce identical rounds; (c) 100% of logged spins replay to the logged win;
(d) golden vectors checked into the repo.
- **Risk:** engines differ slightly between the `/casino` and `/casino-b` builds (the deployed engine sources are not byte-identical,
only their tables are). P1 must unify them or pin a hash per build.

### P2. LAYR token and treasury (testnet)
- **Scope:** `layr` and `casino-treasury` in Clarinet with simnet tests; deploy to testnet from a dedicated wallet; the LAYR Exchange
buys through the treasury and reads on-chain balances; a **legacy claim** path (decision 5); bankroll funding and limit tooling in an
`ops/` style toolkit with the same guards as arcade-world (`--execute`, confirmation env var, key file, kill file, dry run default);
a dress rehearsal on a simulated chain before any testnet send.
- **Entry:** decisions 1, 3, 4, 5, 8 answered; P1 vectors exist (the treasury will later check against them).
- **Exit:** invariants I1 to I7 hold across the full suite, including conservation after every scenario; a testnet run buys, opens a
dummy session, closes, force-closes and refunds from two wallets; an independent read of the contract finds nothing blocking.
- **Tests:** simnet adversarial suite (wrong signature, replay, double close, pause, timelock, caps, unauthorised mint), differential
checks of the peg arithmetic, a testnet smoke from the Exchange page with Xverse and Leather.
- **Honest label:** until P3, anything the client reports is untrusted, so P2 settles with an operator-attested honour system and
LAYR has no value.

### P3. Provable live sessions
- **Scope:** the lifecycle in 4.3; result service on Cloudflare with the engine bundled; operator key and rotation; signed states;
`force-close`; session resume; client verification at close; abuse limits (rate limits, one live session per wallet and machine,
Web Locks to stop two tabs).
- **Entry:** P2 on testnet; engine bundle builds for the Worker; Worker/DO question answered.
- **Exit:** (a) a 10,000-spin soak per machine with random failures (network drops, tab closes, operator down mid-session) conserves LAYR
and every session ends in a defined state; (b) the client's post-close verification passes on every soak session; (c) a tampered
client (forged stops, edited balance) is rejected; (d) a deliberately wrong operator state is caught by the verifier script.
- **Tests:** Playwright full sessions on both pages; a chaos harness; replay equality between server transcript and client log.

### P4. On-chain transcript and verified playback
- **Scope:** transcript hash and both seeds in the close event; transcript store; replay page against chain; "this session is verified"
badge; a highlight inscriber; privacy controls (decision 6).
- **Entry:** P3 stable on testnet.
- **Exit:** from a session id and only public chain access plus the transcript store, the replay page reproduces the settled balance and
plays the session; a corrupted transcript is detected; the page works from a second device with an empty cache.
- **Measure here:** Hiro read limits and event-log retrieval cost (unmeasured today).

### P5. Trust-minimised disputes
- **Scope:** a Clarity verifier for one named spin (start with the simplest machine and the base game, then bonuses), fraud-proof
challenge with a bond and a window, session-key-signed bets, sealed batches (mode B) as the first fully trustless product, evaluation
of the dual-hash-chain variant.
- **Entry:** Clarity cost measurements for the verifier on testnet (runtime and read limits, `secp256k1-verify`, sha256 loops).
- **Exit:** differential fuzz, Clarity versus JS, over tens of thousands of calls with 0 mismatches (the Hold'em standard); a malicious
operator state is overruled on chain in the rehearsal; the worst-case bonus round fits the cost limits, or that machine stays
operator-trusted and says so.
- **Risk:** the heavy cases are DS cascades (up to 30 drops) and hold-and-respin frames. They may force a bounded or simplified
verifier, or an optimistic design where the claimant supplies the intermediate frames and the contract only checks transitions.

### P6. Mainnet readiness
- **Scope:** legal advice on whether and how LAYR may be redeemable; independent contract review; operator key custody and incident
runbook; bankroll funding plan and caps; monitoring (the dashboard from P0 plus on-chain reconciliation); a mainnet canary with tiny
limits; a kill switch drill.
- **Entry:** P5 (or an explicit decision to launch operator-trusted), plus Jim's explicit go.
- **Exit:** a rehearsal that mirrors mainnet on testnet passes; caps start low and are raised in steps.

## 6. Risks and open questions for Jim

### Risks
| Risk | Mitigation |
| --- | --- |
| Real-money gambling regulation | Closed-loop by default; no redemption without legal advice; mainnet is its own gate. Not legal advice. |
| Player foresight exploit | House secret in the stream; sealed batches only for fixed bets (section 3.1) |
| Operator key theft or a dishonest operator | Key holds no admin role; delayed rotation; bond; public transcripts make cheating provable; P5 overrules on chain |
| Operator downtime mid-session | `force-close` with the last signed state; client resume; timeout refund |
| Selective denial by the operator | Residual until P5 or the blind-house option; say so in the UI and docs |
| Bankroll insolvency | Cover reserved at open, per-session and daily caps, segregated jackpot reserve, surplus withdrawal never below liabilities |
| Engine drift (browser, Worker, Clarity disagree) | Ruleset hash, golden vectors, million-round equality tests, differential fuzz |
| Old sessions become unreadable after an engine change | Ruleset hash per session; keep old engine builds addressable |
| Fees swamp small sessions | Minimum session size, sponsored open/close |
| Hiro rate limits or outages | Measure in P4; cache; reads degrade to "unverified", never block play |
| Wallet quirks (Xverse mobile, Leather) | Follow the wallet playbook; test both before each phase exit |
| Lost seed or state on the client | Persist before signing; offer backup; operator keeps the session record |
| Privacy: sessions are public and wallet-linked | Decision 6; the D1 log already stores `addr` when connected |
| Miner influence on block hashes | Only an optional extra input in mode A; in mode B and C acceptable while closed-loop; prefer a Bitcoin header hash (TO-VERIFY) |
| Scope creep | Phases end with a report; mainnet only on an explicit go |

### Decisions for Jim (each has a default so work can start)
1. **Closed-loop or redeemable?** Default: closed-loop (buy only, no cash-out) until you have legal advice. This changes the treasury
   (a redeemable token needs full reserve accounting) and the whole mainnet story.
2. **Operator in the loop for live sessions?** Default: yes (mode A), with sealed batches (mode B) as the trustless product later. The
   alternative is mode B only, which cannot offer gamble, variable bet or early cash-out.
3. **Who is the house?** A dedicated wallet to deploy and admin, a separate operator signing key, and a funding source for the
   bankroll. Default: new dedicated wallets, never a personal one. Not chosen yet.
4. **Jackpots: shared or per wallet?** Default: shared per machine and bet level, settled at session close, reserve segregated.
5. **Existing browser balances.** Options: honour only LAYR that was bought on chain (match the shop-address payments and memos to
   wallets), airdrop a fixed amount, or start everyone at zero. Default: honour verified buy-ins only.
6. **Transcript privacy.** Settlements on chain are public and wallet-linked. Default: public by session id, no names; a wallet can
   opt out of highlight inscriptions.
7. **Fees and session size.** Minimum session, whether open/close are sponsored. Default: minimum about 40,000 LAYR on testnet, sponsor
   later.
8. **Rake destination and PvP unification.** Default: one `layr` token and one treasury for machines and tables; PvP rake goes to the
   treasury.
9. **Replay inscriptions.** Which sessions, who pays. Default: manual, biggest wins only, admin-paid.
10. **Mainnet gate.** Default criteria: P5 done or an explicit operator-trusted launch, legal review, independent review, tiny caps.

## Appendix A. Stage-1 event schema (the round log)

Snapshot of the P0 contract. `CASINO-ROUND-LOG.md`, `functions/lib/casino-ingest.ts` and
`functions/migrations/033_casino_events.sql` are authoritative.

`POST /casino/log`, JSON, same-origin, always answers 204 (fail open), batches of up to 50 events:
```
{ "v": 1, "page": "casino" | "casino-b", "pid": "p_...", "sid": "s_...", "addr": null | "ST...", "events": [ ... ] }
```
Every event carries `seq` (counter per `sid`, makes retries harmless), `t` (client epoch ms), `m` (machine: `bf` Block Fortune,
`drop` The Drop, `twins` Forever Twins, `ds` Deep Strata, `nv` Neon Vault, `ex` LAYR Exchange, `bank` the shared bankroll) and `k` (kind).

| `k` | Fields | Stored as |
| --- | --- | --- |
| `spin` | `bet`, `free` (0/1), `win` (total paid: lines + scatters + jackpot), `jp` (the jackpot part), `st` (5 ints, 0..31), `fx` (subset of `F` free spins, `V` vault, `C` chain), `rid` | bet charged only when `free = 0`; stops as `"a,b,c,d,e"` |
| `bonus` | `ty` (`vault` / `chain` / `pick`), `bet`, `win`, `jp`, `rid`, `d` = `{aw:[9], pk:[3]}` (vault) / `{sum, full}` (chain) / `{mult}` (pick) | paid separately from the triggering spin |
| `gamble` | `stake`, `w` (1 won / 0 lost), `win` (2 x stake or 0), `ch` (the call) | |
| `buy` | `tx` (0x + 64 hex), `layr` (credited), `bh` (block height, optional) | matched against the shop-address ledger |
| `move` | `dir` (`in` bankroll to machine / `out` machine to bankroll), `n` (LAYR) | |

Not stored: IP address, fingerprint, any seed, key or signature, anything typed by the player.

**What P3 adds to a transcript** that the P0 schema lacks: `sessionId`, `rulesetHash`, both seed commitments and seeds, `n` (spin
nonce), the signed state per step, and the gamble counter `g`. These live in a separate transcript table, never in `casino_events`.

## Appendix B. Verified and still to verify

**Verified in this work (read from the code, or measured)**
| Item | How |
| --- | --- |
| All five machines are exactly 94.38% RTP (5.62% edge) | Full enumeration of 32^5 positions plus DP for bonuses, cross-checked by simulation; the live engine tables equal the audited ones |
| ~41% of spins return something; ~27 to 29% of players are ahead after 500 spins | Bootstrap on the per-spin distributions |
| Only the buy-in is on chain; spins, wins, cash-outs and balances are browser-only | Read of `LX` in `public/casino/index.html` and `applyTestnetFunding` in casino-b |
| Shop address, rate 100,000, memo format, Hiro testnet check | Same |
| Telemetry pattern: same-origin check, size clamps, always-204, D1 binding `DB` (`xtrata-manage`), manual wrangler migrations | `functions/log.ts`, `functions/lib/*`, `wrangler.toml` |

**Stated by earlier project docs (not re-tested here)**
| Item | Source |
| --- | --- |
| `stacks-block-time` is unix seconds; windows should use it, not block counts | `casino-pvp-design.md` |
| `get-stacks-block-info? id-header-hash` equals Hiro `index_block_hash` | project docs |
| sha256 commit-reveal works in Clarity; Clarity has `secp256k1-verify` and `secp256k1-recover?` but no P-256 | `casino-pvp-design.md`, `PASSKEY-WALLET.md` |
| Transactions from different wallets can share a block and block time | `casino-pvp-design.md` 3a |
| Testnet deploys cost about 0.1 to 0.6 STX and calls about 0.01 STX | `casino-pvp-design.md` |
| Hold'em/Dice differential fuzz reached 0 mismatches over about 28,700 calls | `casino-holdem-v1.md` |

**TO-VERIFY (do not assume)**
| Item | Why it matters | When |
| --- | --- | --- |
| Mainnet fee levels for contract calls | Session size and sponsoring | P2 |
| Which entropy sources the deployed Clarity version exposes (Bitcoin header hash, tenure VRF seed) | Strongest optional anchor in mode A and the anchor for mode B | P2 |
| Clarity runtime and read limits for a one-spin verifier, `secp256k1-verify` cost, sha256 loop cost | Whether P5 is feasible per machine | P5 (measure early on testnet) |
| Hiro read limits and event-log retrieval for `print` events | Replay page and polling | P4 |
| Can the relayer sponsor arbitrary allowlisted contract calls (it is built for drops/market) | Fee economics | P2 |
| Do Pages Functions suffice for the result service, or is a separate Worker/Durable Object needed for per-session state; request quotas at turbo speed (about one request per second per player) | Hosting and cost | P3 |
| Whether Xverse and Leather handle FT post-conditions plus the call shapes needed, on mobile | P2 exit | P2 |
| Cost and mechanics of inscribing a small replay JSON through the Xtrata core | Highlights | P4 |
| Maximum single-round payout per machine (free-spin multipliers, cascades, full jackpot) | Exposure caps | P2 |
| Whether `/casino` and `/casino-b` engines can share one source or must be hash-pinned separately | Replay across builds | P1 |
| Location and licence of the `layr-test` source | Token unification | P2 |
| Legal position on redeemable LAYR in the target jurisdictions | Mainnet | P6 |

## Appendix C. Interface draft (sketch only, not code to deploy)

```
;; layr (SIP-010)           transfer, get-name, get-symbol, get-decimals (0), get-balance, get-total-supply, get-token-uri
;;                          mint / burn : treasury only

;; casino-treasury
;; reads   get-session (id)  get-limits  get-bankroll  get-jackpot (machine, level)  get-operator  get-version  get-successor
;; buys    buy-layr (microstx)        sell-layr (layr)            ;; sell only if redeemable (decision 1)
;; session open-session (machine, stake, player-commit, house-commit, house-sig, expiry)
;;         close-session (id, final-balance, house-seed, player-seed, transcript-hash, house-sig)
;;         force-close (id, state, house-sig)        ;; starts a window; a later signed state wins
;;         refund-expired (id)
;; P5      challenge-spin (id, n, claimed-state, proof) ;; contract recomputes spin n
;; admin   propose-admin / accept-admin, set-limits (timelocked), set-operator (delayed), set-paused,
;;         fund-bankroll, withdraw-surplus (timelocked), set-successor, lock-successor
;; events  print { event: "open" | "close" | "force" | "refund" | "buy" | "sell", ... }  ;; indexable, feeds the replay page
```
