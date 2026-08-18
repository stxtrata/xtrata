# Architecture decision records

Every entry records what was decided, when, what else was considered, why, and
what it costs. Entries are append-only. A decision that turns out wrong gets a
new ADR that supersedes it, never an edit.

---

## ADR-0001 — Verify the network before designing the contract

**Date** 2026-08-07
**Status** accepted

### Context

The brief specifies "PoX-5, Clarity 6" and instructs that current live Stacks
behaviour be verified against official sources before any contract architecture
is implemented, rather than assumed from older versions.

### What was verified, and how

Directly against mainnet and against a local `clarinet 3.12.0`, not from
documentation alone.

| Claim | Method | Result |
|---|---|---|
| Current epoch | `GET https://api.mainnet.hiro.so/v2/info` and `/v2/pox` | **Epoch 4.0**, active from burn height 960230; observed burn height 961497; `stacks-node 4.0.1` |
| PoX version | `/v2/pox` → `contract_id` | **`SP000000000000000000002Q6VF78.pox-5`** — PoX-5 is live |
| Max Clarity version | `clarinet check` with `clarity_version` 3/4/5/6 | 4 accepted, **5 and 6 rejected**: "value supported: 1, 2, 3" (message stale, 4 parses and analyses) |
| `as-contract` under Clarity 3 | `clarinet check` | resolves, 1 contract checked |
| `as-contract` under Clarity 4 | `clarinet check` | **`error: use of unresolved function 'as-contract'`** |
| `as-contract?` under Clarity 4 | `clarinet check` | resolves |
| Self principal under Clarity 4 | `clarinet check` | `(as-contract? () tx-sender)` resolves, including inside `define-read-only` |
| Native sponsored transactions | Stacks docs on fee sponsorship | still require a **second private-key signer**; origin signs, then sponsor signs and sets the fee |

### Decisions

1. **Clarity 6 does not exist.** The current language version is **Clarity 4**.
   Everywhere the brief says "Clarity 6", read "the current Clarity version",
   which is 4. No feature was designed around a version that is not shipped.

2. **PoX-5 is live and the brief is correct about it.** It is not load-bearing
   for X Chess: the application neither stacks nor delegates. Recorded so that a
   future reader does not have to re-derive it.

3. **The core contract targets Clarity 4 and uses `as-contract?`.**
   This is forced, not chosen. `as-contract` — the only way a Clarity ≤3
   contract can spend from its own balance — **does not exist in Clarity 4**.
   The sponsorship model requires the contract to send STX from its own balance
   for bootstrap and rebates, so `as-contract?` is the only route.

4. **Native Stacks sponsorship is rejected as the gas model.** It requires a
   fee-paying account that adds a sponsor signature after the user signs. That
   account holds a private key, and a key that signs on demand needs a service
   to hold it. That is a server, which §5 and §75 of the brief forbid outright.
   The brief's assumption on this point is confirmed against current docs, not
   inherited.

   The gas model is therefore, as specified:
   **creator-funded on-chain bootstrap + fixed on-chain rebates.**
   See ADR-0003.

### Consequences

- `as-contract?` returns `(response A uint)` where the error is the 0-based
  index of the first violated allowance, or `u128` for an asset with no
  allowance at all. Every outflow site must handle **two** nested responses:
  the allowance result and the transfer result. This is written up in ADR-0002
  because getting it wrong silently swallows failed transfers.
- Clarity 4's mandatory allowances are a **security win** for this design, not
  a tax. Every sponsorship payout is wrapped in an allowance that caps it at the
  exact amount intended, so a bug in the accounting cannot drain the reserve:
  the allowance aborts the call. The invariant is enforced by the language, one
  level below our own arithmetic.
- The legacy contracts (`xtrata-chess-log-v1/v2/v3`) are Clarity 3. They stay
  Clarity 3 forever — they are deployed and immutable. The legacy adapter reads
  them; nothing recompiles them.
- Deploying through a wallet forces Clarity 4 (recorded previously in project
  memory, and consistent with epoch 4.0 being live). Because X Chess 2 targets
  Clarity 4 by choice, this stops being a trap: the wallet's default and the
  contract's requirement now agree. The v1–v3 contracts needed an SDK deploy
  pinned to Clarity 3 precisely because they use `as-contract`-era syntax.

### Alternatives considered

- **Target Clarity 3 and keep `as-contract`.** Rejected. It would require an
  SDK-pinned deploy forever, it forgoes allowance-bounded outflows on a contract
  whose entire risk surface is outflows, and it bets a permanent contract on an
  older language version at the moment a new one has just activated.
- **No contract-held funds at all; players always pay.** Rejected: it deletes
  the zero-STX onboarding that §78 names as the final acceptance test.

---

## ADR-0002 — Every contract outflow is allowance-bounded and double-unwrapped

**Date** 2026-08-07
**Status** accepted

### Context

`as-contract?` nests responses. The body's own value is a response, and
`as-contract?` wraps it in another:

```clarity
(as-contract? ((with-stx amount)) (stx-transfer? amount tx-sender to))
;; type: (response (response bool uint) uint)
```

A single `try!` unwraps only the allowance layer. The transfer's own failure
would be left sitting in an unexamined `(err ...)` value, and the calling
function would return `(ok ...)` for a payout that never happened.

### Decision

Every outflow goes through one private helper, and no call site writes
`as-contract?` inline.

The exact shape was found empirically, not predicted. Matching on the outer
response with the transfer left unchecked inside is REFUSED by the analyser:

    error: intermediary responses in consecutive statements must be checked

The form Clarity 4 accepts puts `try!` INSIDE the body and matches outside:

    (match (as-contract? ((with-stx amount)) (try! (stx-transfer? amount tx-sender to)))
      paid     (ok paid)
      violated ERR-ALLOWANCE)

This still keeps the two failure layers apart, which was the point: a failed
transfer propagates its own error through the inner `try!`, and a violated
allowance is caught by the match. Reporting both as one code would hide an
accounting bug behind a funding problem, or the reverse.

The allowance is always written for **exactly** the amount being sent, computed
from recorded state, never a ceiling or a round number.

### Consequences

- A payout that exceeds what the accounting says is owed cannot execute. The
  language rejects it before our arithmetic gets a chance to be wrong.
- Contract tests assert the error codes for both failure layers separately.
- There is exactly one place in the contract that can move STX out. That is the
  only place the solvency invariant has to be defended.

---

## ADR-0003 — Prepaid bootstrap and fixed rebates, not fee sponsorship

**Date** 2026-08-07
**Status** accepted

### Context

A player with zero STX cannot send any transaction, because a transaction needs
a network fee. Native sponsorship solves this with a co-signer, which needs a
key, which needs a server (ADR-0001).

### Decision

Sponsorship is funded on-chain at game creation by the creator, and paid out
on-chain by the contract:

1. The creator pays, in one transaction: the base game fee, the bootstrap
   amount, the full rebate reserve, and the sponsorship margin.
2. The contract immediately transfers the **bootstrap** to the named
   beneficiary. That wallet now holds enough STX to pay its first network fee.
3. Each eligible submission by the beneficiary pays its own ordinary network
   fee, and the contract sends back a **fixed rebate** from the reserve.
4. The allowance is bounded twice over: by a maximum transaction count and by a
   maximum STX liability. Whichever runs out first ends the sponsorship.

No X Chess process participates at any point. The creator's single transaction
is the only funding event.

### Consequences

- Only a **named** beneficiary can be bootstrapped. An anonymous open game
  cannot bootstrap an unknown wallet, because the unknown player would have to
  send a transaction to identify themselves and has no STX to do it with. This
  limitation is real, is stated in the UI, and is written up in
  `SPONSORSHIP-V1.md` rather than hidden.
- The rebate is a **fixed** amount, not a reimbursement. Clarity does not expose
  the transaction's own network fee at runtime, so exact reimbursement is not
  implementable. The fixed amount is chosen from measured fee behaviour by the
  harness, not guessed.
- Sponsorship exhaustion is an economic state and never a chess state. The game
  continues; the player starts paying their own gas. Replay does not know
  sponsorship exists.

### Status of the constants

Deliberately **not** fixed in this ADR. Harness layer 7 measures them. A
follow-up ADR records the launch values and the measurement that produced them.

---

## ADR-0004 — The sponsorship constants, measured

**Date** 2026-08-07
**Status** accepted
**Supersedes the illustrative figures in the brief's §17**

### Context

§17 and §46 of the brief give example constants (bootstrap 0.020 STX, rebate
0.004 STX) and instruct that the real ones be measured rather than guessed,
because an under-funded sponsorship strands a player mid-game and an
over-funded one prices the product out.

### What was measured

`tests/sponsorship/zero-stx.test.ts` runs a genuinely zero-balance wallet
(`wallet_6`, balance `0`, not "nearly zero") through a full game at a range of
network fees, deducting the fee before each submission the way a miner would.
Output: `ops/measurements/sponsorship-sweep.json`.

Under the brief's example constants, the sweep is unambiguous:

| network fee | submissions reached | full game (41)? |
|---|---|---|
| 0.004 STX | 41 | yes |
| 0.005 STX | 16 | **no** |
| 0.008 STX | 4 | **no** |
| **0.010 STX** | **2** | **no** |

0.010 STX is not a hypothetical. It is what the legacy X Chess repo records as
confirmed on mainnet for exactly this shape of contract call
(`DEFAULT_FEE_USTX = 10_000`), and project memory records Xtrata seeing 0.011
STX for a single-chunk transaction. **The brief's example constants would have
stranded every sponsored player after two moves.**

### Decision

| constant | value | why |
|---|---|---|
| rebate | **0.010 STX** | set TO the observed fee, not below it |
| bootstrap | **0.060 STX** | six transactions of headroom before any rebate arrives |
| rebate count | **45** | a full game for one player (about 41 submissions) plus margin |
| margin | 0.050 STX | X Chess's revenue on a sponsorship |

Setting the rebate **to** the fee rather than below it is the load-bearing
choice. At or under the design fee the player is never out of pocket, so the
bootstrap is never touched — the sweep confirms it, ending at exactly 0.060 STX
after a full game at 0.010. The bootstrap is then pure headroom against a fee
spike rather than the thing being slowly consumed.

Resulting prices: liability 0.45 STX, sponsor package 0.56 STX.
Sponsor Opponent = 1.56 STX. Sponsor Both = 2.12 STX. Higher than the brief's
illustrative 1.30 / 1.60, and that difference is the measurement.

### Behaviour above the design fee, stated rather than hidden

The reach on the bootstrap alone is exactly
`floor((bootstrap - fee) / (fee - rebate)) + 1`, asserted as an equality in the
suite: 25 submissions at 0.012 STX, 10 at 0.015, 5 at 0.020, 2 at 0.030. A
sustained fee spike above 0.010 shortens sponsored play. The owner can raise
the rebate to the 0.1 STX ceiling in response, which covers a tenfold spike.

### Consequences

- Every constant is a data var with a hard ceiling, so a fee regime change is
  answerable without a new contract.
- A sponsorship already funded records its own rebate and remainder, so raising
  the rebate never reprices a promise already paid for. Tested.
- The sweep is a release gate. If the fee regime moves, it is re-run and this
  ADR gets a successor.

---

## ADR-0005 — One sponsorship allowance, not a gameplay/settlement split

**Date** 2026-08-07
**Status** accepted
**Departs from the brief's §17**

### Context

§17 specifies two counters per sponsorship: "gameplay rebates 60" and
"settlement rebates 2", the intent being that a player cannot be left unable to
afford the transaction that resigns or agrees a draw.

### The problem

The core contract cannot implement that split without breaking the invariant in
§3. To hold back rebates for settlement transactions, it would have to
recognise which submissions ARE settlement transactions — that is, it would have
to know that `resgn` and `draw!` are special. That is a protocol opinion about
the meaning of the strings it stores, and §3 forbids exactly this: the contract
sees a string of four or five characters and forms no opinion about it.

A positional split (reserve the last N of the allowance) is not a split at all:
it is arithmetically identical to a single counter of size gameplay + control.

### Decision

**One counter.** `rebates-left`, set to 45, covering every submission alike.

The concern §17 raises is real and is answered differently, by the bootstrap
rather than by the contract knowing chess:

1. At or below the design fee the player is never out of pocket, so after 45
   rebates they still hold the entire 0.060 STX bootstrap — six more
   transactions' worth. Resigning is always affordable.
2. Running out of sponsorship never blocks a submission. The game continues and
   the player pays their own gas, which the exhaustion test asserts by playing
   a `resgn` past the end of the allowance.

### Consequences

- The contract stays ignorant of `events-v1` entirely. A future events protocol
  can add control strings without touching, or redeploying, the core contract.
- `SPONSORSHIP-V1.md` documents one allowance, and the UI shows one number.
- If a future design genuinely needs reserved settlement gas, it belongs in a
  separate contract that reads the log, not in the core.

---

## ADR-0006 — The rebate needs a post condition the legacy board never had

**Date** 2026-08-08
**Status** accepted

### Context

Stacks post conditions in `deny` mode require that EVERY asset transfer in a
transaction be covered by a condition. An uncovered transfer does not shrink or
get ignored; it aborts the whole transaction, and an aborted transaction still
costs its sender the network fee.

The legacy board only ever moved STX in one direction: the player paid a fee to
the contract. One condition about the sender covered every call it made.

X Chess 2 moves STX in BOTH directions in a single transaction. A sponsored
player's `submit` causes the contract to send them a rebate.

### The failure this would have been

With only the legacy-shaped condition, `submit` from a sponsored player is:

- sender sends 0 (the move fee is zero), so no sender condition is written
- contract sends the rebate, which is **uncovered**
- deny mode aborts

**Every sponsored move would have failed**, on the exact path that the whole
product is built around, while still charging the player a network fee. It
would have passed every simnet test, because simnet does not evaluate post
conditions the way a wallet-built transaction does.

### Decision

`guardFor` writes a condition per direction:

- `stxFromAccount(sender, sends)` when the contract takes something
- `stxFromContract(contractId, receives)` when the contract pays something

Both are `SentLessThanOrEqualTo`, never `SentEqualTo`. The cap bounds the loss
identically, but an exact condition fails a perfectly good transaction when the
amount legitimately moves - a rebate not paid because the allowance ran out in
the meantime, or a fee the owner lowered between the board reading it and the
wallet signing. That is a real network fee lost for nothing.

The contract-principal condition is a different wire encoding from the standard
one (principal kind `0x03`, and the contract name is length-prefixed after the
hash160). It is hand-serialised, like everything else here, because Xverse hangs
forever on the object form with no dialog and no rejection.

### Consequences

- `ContractCall` carries `sends` and `receives` rather than one `fee`, so the
  call site cannot forget the second direction.
- Both encodings are checked byte for byte against `@stacks/transactions` in
  `tests/wallet/postconditions.test.ts`. The SDK is the only oracle available,
  since there is no library between this code and the wire.
- This must still be confirmed against a real wallet on a real network before
  launch. Matching the SDK's bytes proves the encoding, not that Xverse and
  Leather accept a contract-principal condition in the shape the runtime bridge
  forwards. That is a line in `harness/wallets/MATRIX.md`.

### Why it was found

Writing down what `submit` actually moves, rather than copying the legacy call
shape. The legacy shape was correct for a contract that only ever received.

---

## ADR-0007 — Replay honours the events protocol a game committed to

**Date** 2026-08-08
**Status** accepted

### Context

Three X Chess contracts are already deployed and immutable, holding games
played under a protocol in which **no string meant anything but a move**.
`events-v1` introduces three that do: `resgn`, `draw?`, `draw!`.

Replay originally applied `events-v1` unconditionally.

### The failure this would have been

A legacy game containing `resgn` from a bound player - five characters that
were, at the time, simply a submission replay skipped as malformed - would be
reinterpreted as a resignation that ends the game.

The golden fixture in `tests/legacy` is a Scholar's Mate with `resgn` sitting at
seq 2. Same bytes, same players:

| read as | result | termination |
|---|---|---|
| the protocol it was played under | **1-0** | checkmate at seq 7 |
| `events-v1` | **0-1** | resignation at seq 2 |

**Opposite winners.** Not a display difference: a different game, retroactively,
for people who are not available to be asked about it. §38 forbids exactly this.

### Decision

`rules.eventsProtocol` is committed in the rules hash and replay obeys it.

- `events-v1` — the three control strings mean what EVENTS-V1.md says.
- `events-none` — nothing but moves. What every pre-v1 game was played under,
  now named rather than implicit, so a legacy adapter states what it is doing.
- **anything else** — this build does not implement it, and says so: the whole
  log is rejected with `unsupported-protocol` and `fault` is set.

The same applies to `replayProtocol`.

### Why refuse rather than fall back

A reader that met an unknown protocol and quietly used its own would produce a
position no other reader agrees with, which is the one failure this architecture
exists to prevent. Refusing is the only honest answer, and it is what lets
`replay-v2` ship later without every `replay-v1` board silently disagreeing
about the games it cannot read.

### Consequences

- The commitment distinguishes legacy from modern games on chain: identical
  rules under the two events protocols hash differently. Tested.
- Legacy games are `events-none` and unrated, permanently. Their participants
  never agreed to ranked play.
- `ReplayState` gains `fault`, so the UI can say "this board cannot read this
  game" rather than drawing a position it invented.

---

## ADR-0008 — A post condition covers what the CONTRACT sends, to anybody

**Date** 2026-08-08
**Status** accepted
**Amends ADR-0006, which got this half right**

### What happened

The first real sponsored open on mainnet aborted.

```
tx       0x16033c8578f879753fc88bfd78baf7e49097babb72423c3ad2b889b3689c573e
status   abort_by_post_condition
result   (ok u3)
fee      100000 uSTX, kept
pc       ONE condition: sender sends <= 1560000
```

**The contract succeeded.** It returned `(ok u3)`: game 3 opened, sponsorship
recorded, bootstrap sent. The chain then discarded all of it because a transfer
was not covered by a post condition, and kept the network fee.

### The mistake

ADR-0006 identified that the contract makes transfers of its own and that deny
mode requires each to be covered. It then modelled that as a field called
`receives` — meaning *what the contract sends back to the caller*.

That is the wrong question. `open-sponsored-game` pays the bootstrap to the
**opponent**. Nothing comes back to the caller at all, so `receives` was zero,
so no condition was written, so the contract's own transfer was uncovered.

The right question is not "does the sender get anything back". It is
**"does the contract pay anyone at all"**.

### Decision

The field is `contractSends`: microSTX the contract will pay out, **to
anybody**. A STX post condition caps what a named principal *sends* and says
nothing about who receives it, so one condition about the contract covers every
payout it makes in that call.

Per call:

| call | contract pays out |
|---|---|
| `open-game` | nothing |
| `open-sponsored-game` | **the bootstrap**, to the opponent |
| `open-sponsored-both` | **two bootstraps**, to two people |
| `submit` | the rebate, if sponsored |
| `top-up-sponsorship` | nothing |
| `settle-sponsorship` | nothing; it releases a reservation |
| `withdraw` | the amount, possibly to a third party |

### Why the tests did not catch it

Two gaps, and both are now closed.

1. **simnet does not evaluate post conditions.** Every contract test passed
   because the contract was never wrong. ADR-0006 said this and it was still
   not enough.
2. **`tests/wallet/postconditions.test.ts` proved the ENCODING, not the
   AMOUNTS.** It checked that a contract-principal condition serialises exactly
   as the SDK serialises it. Nothing checked that the right amount was chosen
   for each call, and the amount was zero.

`tests/wallet/outflows.test.ts` now asserts, per call, what the contract will
pay out, and that the guard writes a condition whenever that is non-zero.

### What it cost

One network fee, 0.1 STX. That is the cheapest possible version of this
finding, and it is the reason the gates page exists: it happened on a
throwaway canary contract on a step designed to be run before anything
permanent, rather than on the production board after launch.

### The general rule

A post condition is a **cap, not a preference**. Getting one wrong does not
shrink a transfer; it discards a transaction that had already succeeded, and
still charges for it. Before signing anything, enumerate every asset movement
the call causes — in both directions, and to every party — not the ones
involving whoever happens to be signing.

---

## ADR-0009 — Mainnet submit fees vary by 10x, and the rebate sits in the middle

**Date** 2026-08-08
**Status** accepted, CORRECTED same day
**Amends the constants in ADR-0004**

### Correction

This ADR was first written as "the rebate is three times too low", from a single
`submit` that paid 30,000 uSTX. The very next `submit` on the same contract, from
the sponsored wallet, paid **3,000**.

Observed range for the same call: **3,000 to 30,000 uSTX, a factor of ten.**
There is no single "the mainnet fee" to set a rebate against. The original
framing was an over-confident generalisation from one observation, and the
numbers below are stated as a range because that is what the data supports.

### Context

ADR-0004 set the rebate to 0.010 STX, "the measured mainnet fee", taken from the
legacy X Chess repository's `DEFAULT_FEE_USTX = 10_000` and a project memory
note about Xtrata seeing 0.011 STX. Both were real observations. Neither was of
THIS contract, at THIS size, through a wallet, now.

The canary run has now produced fees actually paid on mainnet, in
`ops/measurements/mainnet-fees-2026-08-08.json`.

### What was measured

| call | fee paid |
|---|---|
| contract deploy | 500,000 uSTX |
| `open-sponsored-game` | 83,983 and 3,000 uSTX |
| **`submit`** | **30,000 and 3,000 uSTX** |
| `open-game` | 3,000 - 10,000 uSTX |

`submit` is the one that matters: it is the call a sponsored player makes over
and over. What the rebate of 10,000 means depends entirely on which end of the
range a given transaction lands on:

```
fee 30,000   out of pocket 20,000/move   floor((60000-30000)/20000)+1 =  2 moves
fee 10,000   breaks even                 the bootstrap is never touched
fee  3,000   AHEAD by 7,000/move         the balance grows
```

The sponsored move actually observed paid 3,000 and left the wallet on 67,000,
up from the 60,000 bootstrap. So the design works at the low end and strands a
player at the high end, and both ends are real.

### Why the sweep did not catch it

It did, and it is worth being precise about what "it" is.
`tests/sponsorship/zero-stx.test.ts` measures reach across a fee range and
reports 41 submissions at 0.010, 5 at 0.020, 2 at 0.030. Every one of those
numbers is right.

What the sweep could not supply is which row of its own table mainnet would
land on, and ADR-0004 answered that from a fee observed on a different contract
at a different time. A modelled fee is an assumption wearing a measurement's
clothes.

What was missing was not a test. It was the fee distribution, which only a real
wallet quoting a real transaction can give, and which turns out to be wide.

### Decision

Nothing is changed automatically. The constants are owner-settable on chain, so
this is an economic decision rather than a code change, and it belongs to
whoever is paying.

The arithmetic, so it can be decided rather than guessed at:

| rebate | bootstrap | count | liability | sponsor package | at fee 0.003 | at fee 0.030 |
|---|---|---|---|---|---|---|
| 0.010 (now) | 0.060 | 45 | 0.450 | 0.560 | full game, ahead | **2 moves** |
| 0.030 | 0.150 | 45 | 1.350 | 1.550 | full game, well ahead | full game |
| 0.010 | 0.300 | 45 | 0.450 | 0.800 | full game | 15 moves |

The last row is the interesting one: leaving the rebate where it is and buying
headroom with a larger BOOTSTRAP costs far less than raising the rebate, because
the bootstrap is paid once and the rebate is paid forty-five times. It does not
make the player whole at the high end, but it stops them being stranded.

Setting the rebate TO the observed fee is what makes the bootstrap headroom
rather than fuel — that part of ADR-0004 stands. What it did not anticipate is a
fee that is not a number but a distribution.

### Consequences

- The canary's step 13 ran and the sponsored wallet ended AHEAD, at 67,000 from
  a 60,000 bootstrap. What it proved is the post-condition path; the economics
  it exercised were the favourable end of the range.
- Step 14, exhaustion, will behave very differently depending on what the wallet
  quotes on the day. That variance is the finding.
- Before any production deploy, re-run the sweep with the observed fee and set
  the constants from it. `set-sponsorship` needs no new contract.
- Fees move. Any constant chosen today is a snapshot, which is why they are
  data vars with ceilings rather than compiled in.

---

## ADR-0010 — A start position where the WAITING side is in check is not a position

**Date** 2026-08-08
**Status** accepted
**Found by** [RULES-AUDIT.md](../RULES-AUDIT.md)

### Context

`parseFen` validated structure - eight ranks that fill eight files, real piece
letters, exactly one king each - and deliberately accepted anything structurally
sound but unreachable, on the grounds that the engine can play it
deterministically and refusing it would be a rule nobody agreed to. Pawns on the
first rank, sixteen queens: fine, play it.

That reasoning does not extend to a position where the side NOT to move is
already in check.

Nothing in move generation refuses the capture of a king, because in a legal
game the situation cannot arise, so no engine pays for the test. Handed such a
position, the side to move takes the king:

```
4R3/4k3/8/8/8/8/8/4K3 w - - 0 1
e7e8 is generated, is legal, and captures the black king
result: {"result":"1/2-1/2","termination":"stalemate","winner":null}
```

The game is reported as **a draw by stalemate**, because the side with no king
has no legal moves. `kings[BLACK]` points at a square holding a white rook, and
every legality question downstream is asked about the wrong piece.

This is reachable, not theoretical. A start position arrives inside a `rules-v1`
commitment that somebody put on chain and cannot edit.

### Decision

`parseFen` returns `null` when the waiting side is in check.

### Consequences

- Such a rule set is one replay reports as **unusable**, via the existing
  unsupported-rules fault. That is the honest answer; a draw by regicide is not.
- The rule is stated where it is enforced, in `packages/chess/fen.ts`, with the
  reason rather than a citation of FIDE - the FIDE argument alone would read as
  pedantry and invite somebody to remove it.
- The permissiveness elsewhere is unchanged and still deliberate. This is the
  one case where an unreachable position does not merely look odd but produces a
  wrong RESULT.
- Held by `refuses a position where the side NOT to move is already in check`,
  `accepts the same positions with the other side to move`, and a walk asserting
  `never generates a move that captures a king`.

---

## ADR-0011 — The rate limit is a shared budget, and the wallet spends from it

**Date** 2026-08-08
**Status** accepted
**Found by** a move that could not be broadcast from a wallet with money in it

### Context

A player holding the right side, on the right game, with 114,754 uSTX and a clean
nonce, could not send a move. Xverse said:

> Failed to broadcast transaction (unable to parse node response)

and the board said `submitting failed: Internal error.` Neither sentence
contains the word "rate limit", which is what it was.

Measured on 2026-08-08 against the public hosts:

| host | answers | bucket |
|---|---|---|
| `api.mainnet.hiro.so` | yes | shared |
| `stacks-node-api.stacks.co` | yes | **the same one** |
| `api.hiro.so` | yes | **the same one** |
| `stacks-node-api.mainnet.stacks.co` | **no - dead** | - |

Roughly **50 requests per minute** for an anonymous caller. Burning the
allowance on one host 429s all three; they are one service. And the entry that
had been sitting in the fallback list as insurance does not connect at all, so
the list read as two hosts and was one.

Against that, the board was spending **three requests per five-second poll** -
the log, the mempool, and the sponsorship - which is **36 a minute** before
anything else asks for anything.

The part that turns this from waste into a broken application: **the allowance
is per IP, and the wallet spends from the same one.** A broadcast is not one
request. Xverse reads a nonce, estimates a fee, and posts the transaction. With
36 a minute gone to polling, there was nothing left, and the thing that failed
was the only thing the player actually cared about.

Two smaller faults made it invisible:

- `unavailable()` treated a **429 as the chain answering**, alongside 404. So a
  rate-limited read did not fall through to another host, it failed - and
  surfaced as "could not read the sponsorship from the chain", which reads as
  though the chain was asked and declined. It was never asked.
- `submit()` wrapped the sponsorship read in `.catch(() => null)`, so a failed
  read became **a rebate of zero**. Zero means no post condition covering what
  the contract pays out, and under deny mode an uncovered transfer **aborts** -
  after the network fee is spent. A rate limit could therefore turn into a
  charge for a move that could never land.

### Decision

1. **A 429 is not an answer.** It is the host declining to speak to us and
   carries no information about the chain. It falls through to the next base,
   and when every base refuses it raises `RATE_LIMITED`, which the board reports
   as itself - naming the wallet, because the player's next action depends on it.
2. **The dead host is replaced**, and the list is documented as insurance
   against an outage and **no defence at all** against a rate limit.
3. **Spend less.** The sponsorship is read once per game per wallet instead of
   on every draw, and the same row feeds the post condition, so `submit` no
   longer reads it again. A poll is now at most two requests.
4. **Yield to the wallet.** No polling while a wallet dialog is open, and a
   graduated back-off as the host's reported allowance drains: half rate under
   28 left, quarter rate under 16, stopped under 8.
5. **Never guess a rebate.** An unreadable sponsorship fails the submission
   before the wallet opens, which costs nothing, rather than producing a
   transaction that must abort, which costs a fee. A rebate of zero that was
   *read* is a fact and still submits.
6. **The runtime harness proxy caches**, three seconds, under one Nakamoto
   block. The real runtime's proxy caches; a harness that did not was testing a
   different application from the one that ships.

### Consequences

- A poll costs 2 requests, so 24 a minute at the five-second interval, leaving
  over half the allowance for the wallet.
- **Under the Xtrata runtime this was never as bad**, because the runtime's
  proxy is shared and cached across viewers. The board hits it hardest exactly
  where it was being tested: a plain static serve on localhost, and equally a
  viewer who opens the inscription anywhere that is not behind that proxy. That
  second case is permanent and cannot be patched, which is why the fix is in the
  board and not only in the harness.
- The endpoint list can never solve this. Anyone adding a host to it should
  check whether it is a genuinely separate service before believing it helps.
- Polling stops while a wallet is open. Nothing that matters can change in those
  seconds, and the alternative is racing the player's own move.

---

## ADR-0012 — The board refuses doomed submissions, and can always be overruled

**Date** 2026-08-08
**Status** accepted

### Context

A wallet holding White, on a game where it was Black to move, could pick up a
black piece and open a wallet to pay for the move. Every reader skips it; the
fee is spent. The board even printed the reason - *"a submission from the wrong
side is stored, charged, and skipped by every reader"* - while doing it. The
prose knew and the squares did not, because they were computed separately and
the prose was a **second, disagreeing implementation** of a rule that already
existed in `checkSender`.

That copy was looser than the original in four ways: it skipped the allow list,
it skipped the cooldown, it skipped the no-consecutive rule, and it treated
`anyone-else` as unconditionally permissive where `checkSender` excludes the
named opposite side.

### The asymmetry

Two ways to be wrong, and they do not cost the same:

- **Allow something replay rejects**: one network fee, and the design already
  discloses that this happens.
- **Block something replay would accept**: the move. `submit` has no turn gate,
  no state gate and no expiry, so **a board's refusal is the only thing that can
  ever trap a player in a game they cannot move in** - and there is no way for
  them to tell the board it is wrong.

Four independent adversarial passes over the naive gate all returned *not safe
to ship*. The cases they found are now regression tests. The two worst:

- **Accept draw would have been permanently dead on every unconfirmed game.**
  Under the unconfirmed fallback nobody owns the board, so no `draw?` is ever
  accepted, so `pendingOffer` is structurally always null. Gating on it kills
  draw-by-agreement on 100% of those games forever.
- **Every sponsored game starts unconfirmable.** The beneficiary appears in the
  committed rules and in no entry, so `recoverRules` cannot reach the true rule
  set until they have moved. A beneficiary resigning before their first move is
  legal, and a hard gate would have refused it.

### Decision

Three tiers, not two. `packages/ui/eligibility.ts`, pure and testable.

| tier | effect | when |
|---|---|---|
| `yes` | wallet opens | nothing objects |
| `warn` | stop before the wallet, name the reason, offer *Send anyway* | anything derived from the connected address |
| `no` | refuse | board-owned, address-independent facts, on **confirmed** rules |

- **It calls `checkSender` and `sideOf`.** The board and its referee cannot
  disagree, because there is only one implementation.
- **Events are a separate predicate.** Replay applies no turn check to a
  control event, and neither cooldown nor no-consecutive reaches one. A board
  that keyed Resign off the move verdict would refuse a resignation on the
  opponent's turn, which is when people resign.
- **Unconfirmed rules can never produce a `no`.** The board is refereeing
  nothing; it may speak, not enforce.
- **A refusal buys fresh evidence.** A `no` on a snapshot older than one poll
  re-reads first, and a failed re-read downgrades to `warn`. A rate limit must
  never become a lock.
- **A poll may not shorten the log**, which would rewind the turn and the
  standing offer for the rest of the session.
- **The lock always comes with a visible way past it.** The squares do lock on a
  confirmed wrong-side verdict, which is what was asked for - but *Let me try
  anyway* is on screen whenever they do. The board cannot know which account the
  wallet will sign with, so it will sometimes be wrong, and being wrong must
  cost a click rather than a game.

### Consequences

- Wrong-colour pieces are no longer selectable, and no wallet opens for one.
- Three rules the board never enforced - allow list, cooldown, no-consecutive -
  come for free, because the referee was asked instead of copied.
- 21 verdict tests and 7 DOM tests, and the larger half of them assert the gate
  does **not** block: open boards, `anyone-else`, self-games, off-turn
  resignations, unconfirmed games, sponsored beneficiaries.
- A future tightening that removes the override, or promotes an address-derived
  warning to a refusal, breaks named tests. That is deliberate.

---

## ADR-0013 — A rebate above the going fee cannot be exhausted by playing

**Date** 2026-08-08
**Status** accepted
**Sharpens** ADR-0004 and ADR-0009
**Measured on** the canary contract, game 4, sixteen real mainnet transactions

### Context

Canary step 14 asks for the sponsorship allowance to be spent to zero. It could
not be reached, and the reason is arithmetic rather than anything going wrong.

Every transaction the sponsored wallet has ever sent, with its fee:

| fee (uSTX) | count |
|---|---|
| 3,000 | 13 |
| 4,246 | 1 |
| 10,000 | 1 |
| 40,000 | 1 |

Median **3,000**. The rebate is **10,000**. So an ordinary move pays the
sponsored wallet **about 7,000 uSTX more than it costs it**. A sponsored player
gets richer the longer they play, and the balance cannot be drained by playing
at all.

The account reconciles exactly:

```
  60,000   bootstrap
+150,000   15 rebates x 10,000   (rebates-left 45 -> 30)
- 96,246   fees on its own 16 transactions
-100,000   a manual transfer sent back by hand, trying to drain it faster
---------
  13,754   the observed balance
```

The manual transfer is the tell. Somebody reading "spend the allowance to zero"
reasonably tried to empty the WALLET, and no amount of that reaches the state
the step is about - thirty more moves would put another 210,000 back in.

### Decision

1. **The step is about `rebates-left`, not the balance**, and it now says so in
   those words. The old wording was not wrong, it was readable two ways, and the
   expensive reading looks identical until you do the arithmetic.
2. **The step MEASURES instead of asking.** It was a free-text note, which is
   how a wallet with thirty rebates left came to be mistaken for an exhausted
   one. It now reads the row and refuses while `rebates-left > 0`, reporting the
   number and the fee arithmetic that makes draining the balance futile.
3. **The documented fast path is a second sponsorship, not a long game.**
   `set-sponsorship` with a count of 2, then a NEW sponsored game: exhausted in
   three moves instead of thirty. A row captures its rebate and count when it is
   funded, so this can never disturb a game already running.

### Consequences

- Step 14 is reachable in minutes, and isolates the transition it is about
  rather than burying it at the end of a sixty-transaction game.
- Nothing else was blocked. `topup`, `treasury` and `ranked` need only `rebate`;
  exhaustion gates the artefact phase alone. Worth knowing before anyone spends
  a day trying to unblock a canary that was not blocked.
- The economics stand as ADR-0009 left them: the rebate is set against a fee
  that is a distribution, not a number, and 10,000 sits above the low end of it.
  That is generous rather than wrong - a sponsored player is meant to be able to
  play - but it does mean **exhaustion is a configuration to be arranged, not an
  outcome to be waited for.**

---

## ADR-0014 — The chunk is the unit of account, not the byte

**Date** 2026-08-12
**Status** accepted, amended the same day
**Measured on** commit 79f9502f, `dist/xchess.html` at 130,782 bytes

> **Amendment, 2026-08-12.** As first written this ADR asserted a budget of
> **eight** chunks. That was not a protocol limit. It was the number of chunks
> the artefact happened to occupy, mistaken for a ceiling, and it made the
> headroom look like 290 bytes when it is 393,236.
>
> The real figure comes from the live contract: `add-chunk-batch` takes
> `(list 32 (buff 16384))` (`xtrata-v3.4.0.clar:1008`), so **32 chunks, 524,288
> bytes, go up in a single transaction**. The gate is now 32, and what it
> protects against is an upload quietly becoming a two-transaction one.
>
> The decision below stands - the chunk is still the right unit, and the
> machinery is unchanged. What changes is the number and, with it, the urgency
> of everything that was ordered behind it. Minifying the shell CSS is still
> worth 9.4 permanent kilobytes; it is **not** a precondition for anything.

### Context

Xtrata inscribes in 16,384-byte chunks, so what an artefact costs is a step
function of its size, not a linear one. A byte added to a page sitting at 130,782
costs nothing. The 291st byte added costs a whole permanent chunk.

Nothing in the project knew this. The only size gate was
`tests/artifact/artifact.test.ts`, asserting the page was under 250,000 bytes -
sixteen chunks, which is not a budget but the absence of one. `harness/verify.mjs`
and `harness/release.mjs` had no byte gate at all, and `build.mjs` printed the
chunk count and formed no opinion about it.

The consequence was already visible rather than hypothetical. Two features landed
and spent 1,620 bytes between them, taking the headroom to **290 bytes**, and no
part of the build, the suite or the manifest said so. The review that found this
also produced a list of proposals whose byte costs sum to more than 20 KB, and
those costs could not be weighed against anything, because there was no
denominator.

There was one precedent to copy: `tests/artifact/sounds.test.ts` budgets a single
module against an esbuild metafile sum, and it works.

### Decision

**The chunk count is the gate.** `tests/artifact/budget.test.ts` asserts
`manifest.xtrataChunks` is exactly the budgeted number. It is a single figure with
a price attached, and it fails with the true bytes, the ceiling and the overage
in its message.

**Per-package rows are a map, not a ration.** The same file carries a coarse
ceiling per package, seeded from a measured run and recording the figure each was
measured at. Their ceilings deliberately sum to more than the chunk ceiling: they
exist so that when the chunk assertion goes red, the next line says where the
bytes went. A third assertion fails when a package appears in the bundle with no
row, so a budget cannot be escaped by adding a module it does not mention.

**Every build prints the headroom.** Not the size - the bytes left before the next
chunk, which is the number a person deciding whether to add something needs.

**The release refuses a chunk it was not told to buy.** `--allow-chunk` is the
decision, and it should arrive with an ADR beside it. Going up is allowed; going
up without having decided to is not.

The backstop in `artifact.test.ts` drops from 250,000 to 150,000 - still not a
budget, but a figure that catches a catastrophe rather than permitting one.

### Consequences

- Every proposal with a byte cost becomes decidable, which was the point and
  survives the amendment: "about 0.4 KB" stops being a number without a
  denominator. At 32 chunks the answer is usually "that fits comfortably", and
  the value of the gate is that it is now an answer rather than a guess.
- **The per-package rows, not the chunk count, are what will actually fire.**
  They sum to about 142 KB against a 512 KB gate, so a package that starts
  growing is caught while it is still surprising. That is the useful behaviour;
  the chunk count is the hard stop behind it.
- The budget test must be seen to fail before it is trusted. It was: 1,200 bytes
  of dead CSS took the artefact to 132,572 bytes and nine chunks, and the suite
  reported exactly that, by name and figure.
- `packages/storage` is absent from the table on purpose. It is tree-shaken out
  entirely, because nothing imports `CachingReader`. If it ever appears, the
  third assertion fails and somebody has to notice - which is the correct
  outcome, because it means the cache started shipping.
- The per-package table will need re-seeding after any change that moves code
  between packages. That is the cost of having an address for a regression, and
  it is small because the rows are coarse.

---

## ADR-0015 — Rule recovery is bounded, and the bound is consensus-visible

**Date** 2026-08-13
**Status** accepted
**Measured on** commit 25dc5ea3, with generated senders

### Context

`recoverRules` searched every ordered pair of sides, and the side list was every
distinct sender in the log. Anybody may submit to any game — the contract filters
on length and forms no opinion — so that list is chosen by whoever wants to fill
it, and the search is quadratic in its size.

Measured before the change:

| distinct senders | candidates | time |
|---:|---:|---:|
| 100 | 21,218 | 188 ms |
| 500 | 506,018 | 3,664 ms |
| 1,000 | 2,012,018 | **14,388 ms** |

Synchronous, on the main thread, and several times worse on a phone.

That was never about one slow game. Recovery runs for every game in the explorer
and every ranked game on the leaderboard, so **one ranked game stuffed with junk
senders froze the leaderboard for every visitor** — permanently, in an artefact
that cannot be patched. The cost of the attack is a few thousand five-character
submissions.

The read side was as bad: the list fetched every entry of every game at fifty per
page, so a thousand-entry game cost twenty rate-limited round trips for one row.

### Decision

**Six distinct senders past the opener**, taken in sequence order, plus a hard
stop at 512 candidates.

**Sequence order, not sorted.** The previous code sorted alphabetically, which is
exactly the wrong end to truncate: an attacker choosing addresses chooses where in
the alphabet they land. The real players submit first, so the front of the log is
what is worth keeping. `senders` is fed from `getAllEntries` in every caller, so
this was already true — it is now load-bearing rather than incidental.

**The viewer is added after the cap, never squeezed out by it.** Recovery has
always been reader-dependent in one documented way: a board can confirm a game
naming the person looking at it where a stranger's board cannot. Truncating them
out would turn that documented widening into a divergence between two honest
readers.

**Offered candidates stay outside the cap and are tried first.** A remembered rule
set, or one carried in a shared link, is already hash-checked and is what rescues
a freshly-opened game.

**The explorer reads at most four pages per game.** Past that it reads one page —
enough to recover the rules and name the players — and then says how many
submissions there are rather than claiming a position it has not seen all of. A
bound must not make a summary wrong, and no badge is shown from a partial replay.

### Consequences

- 14.4 seconds becomes 3 milliseconds, and stays there at any number of senders.
- **This is consensus-visible.** Confirmation gates ranked eligibility, so two
  boards using different windows could disagree about whether a game is rated.
  Every reader must adopt the same K and the same ordering, which is why the
  ordering change and the cap must ship in the same inscription and never
  separately.
- A game whose real player is the seventh distinct sender would have recovered
  before and will not now. No such game can exist for a two-player rule set
  unless six other people have already submitted junk into it — which is the case
  being defended against.
- Inscription 2988 keeps the unbounded search. It is recorded in `ops/ERRATA.md`.

---

## ADR-0016 — The rebate is the typical fee and the bootstrap is the tail

**Date** 2026-08-17
**Status** accepted
**Revises** ADR-0004, completes ADR-0009, supersedes the constants half of ADR-0013
**Measured on** `ops/measurements/wallet-fee-quotes.json` and `sponsorship-sweep.json`

### Context

Two things prompted this and only one of them is about sponsorship.

The tournament runner now pays **400 µSTX** for a `submit` where it used to pay
3,000, and lands 98% of moves at that rung. The obvious next question is whether
the same saving belongs in the board and in the sponsorship constants.

For the board the answer is no, and the reason is worth stating because it is
the reason for everything below: **the runner's price is not a better estimate,
it is replace-by-fee.** It holds the nonce, so forty-five seconds later it
re-signs the same one a rung higher, and a fee that turned out to be too low has
cost it some waiting. A board holds no nonce. A move left unmined stays unmined,
and re-submitting through a wallet takes the NEXT nonce — two fees, one move,
stored twice. The cheap number is only safe for the party that can withdraw it.
So no board path names a network fee, and `tests/wallet/conformance.test.ts`
pins that in both directions.

Sponsorship reimburses **wallet-signed** moves, so it has to be calibrated
against what a wallet charges, which is not what the runner pays.

### What was measured

The Hiro fee estimator, asked 46 times over fifteen minutes what it would quote
for this exact 196-byte `submit`. Middle tier, which is what a wallet shows by
default:

| | µSTX |
|---|---|
| minimum | 198 |
| median | 646 |
| 75th percentile | 1,619 |
| 90th percentile | 11,854 |
| maximum | 46,104 |

**A factor of 233 inside a quarter of an hour.** ADR-0009 found a factor of ten
across two transactions and said the fee "is not a number but a distribution".
This is that distribution, sampled rather than inferred, and it is wider.

### Decision

| constant | was | now |
|---|---|---|
| rebate | 0.010 | **0.002** |
| bootstrap | 0.060 | **0.250** |
| count | 45 | 45 |
| margin | 0.050 | 0.050 |
| sponsor package | 0.560 | **0.390** |

The two constants get different jobs. The rebate covers the typical move — 78%
of quotes are at or below 2,000 µSTX — and the bootstrap absorbs the tail.

**Weight belongs in the bootstrap because it is paid once and the rebate is paid
forty-five times.** ADR-0009 reasoned this out and the sweep now measures it: at
a fixed package price, every shift from rebate to bootstrap carries a player
further under every spike. 0.002/0.250 beats 0.003/0.200 at the same price, at
every fee.

It is also the farmable number. A rebate is paid on any stored string, legal
move or not — the exhaustion step spends its allowance on `zzzz` — so
`rebate × count` is what a beneficiary can draw by submitting junk. That falls
from 0.45 STX to 0.09.

### The trade, stated rather than hidden

From `sponsorship-sweep.json`, submissions reached out of a 41-submission game:

| fee | old | new |
|---|---|---|
| 0.0004 – 0.008 | full game | full game |
| 0.010 | full game | **31** |
| 0.015 | 10 | **19** |
| 0.020 | 5 | **13** |
| 0.030 | 2 | **8** |

The new configuration is worse in one band — between 0.008 and 0.010, where the
old rebate happened to sit — and better everywhere above it, at 30% less to the
sponsor. Since 89% of quotes come in under 0.008 and the spikes that do happen
are large, that is the right side of the trade to be on.

### Consequences

- **The live contract is not at these values and never was at the published
  ones.** It is selling `rebate 10,000 × count 2` — 0.02 STX of allowance under a
  document promising 0.45 — because canary step 14 lowers the count to spend an
  allowance by hand and nothing put it back. `LAUNCH_SPONSORSHIP` in
  `apps/canary/main.ts` is now the single source of those numbers, and the
  exhaustion step restores them in a `finally`, so every way out of that step
  puts back what it lowered.
- One `set-sponsorship` from the owner applies this. No redeploy: all four are
  data vars, and all four are inside the compiled ceilings.
- Rows already funded keep the rebate and count they were funded with
  (`clar:176-179`), so nobody's sponsorship changes underneath them.
- Fees move. These constants are a snapshot of one fifteen-minute window, which
  is why the sample is committed as an artefact and the sweep starts at 400 µSTX
  rather than at 2,000 — the old range measured only the spike.

---

## ADR-0017 — A wallet is the directory, because it is the only index that points forward

**Date** 2026-08-18
**Status** accepted

### Context

The Tournaments tab took an inscription number and defaulted to one. So it could
only ever show a reader a tournament they already knew the number of, and
Exhibition Two was invisible to anybody not told "3001".

The board is itself an inscription. There is no later.

### What was checked, and how

The Xtrata core's read-only interface was read from
`/v2/contracts/interface/…/xtrata-v3-2-3`. It exposes `get-dependencies`,
`get-parents`, `get-last-token-id`, `get-minted-count` and `get-next-token-id`.

There is no `get-dependents` and no way to ask what depends ON a token.

Two candidate indexes were then tested live against the director address:

| index | call | result |
| --- | --- | --- |
| NFT holdings by principal | 1 | `[3001, 3000, … 2992]`, newest first |
| mint transactions by sender | 1 | the same ten, token ids in the results |

### Options considered

**A chain of manifests, each naming the one before.** Proposed, and it cannot do
the job alone. Dependencies point backward only, so a chain can be walked from a
manifest you already have to every earlier one, and never forward to one
inscribed after this board. The entry point — "what is the newest?" — is exactly
the half a chain cannot supply.

**Scanning inscription ids downward from `get-last-token-id`.** Correct and
unbounded. Thousands of reads to find two documents.

**Holdings of a known wallet.** One call, forward-looking, and the pattern
already exists in `players.ts` for player manifests.

### Decision

A group of manifests is defined by **the wallet they are sent to**. The board
knows one address per group and nothing else.

This generalises, which is the point: `ManifestDirectory` in
`packages/chain/directory.ts` is generic over what a manifest is, so a group is a
wallet plus a parser. Tournaments are one configuration; a profiles wallet, which
players send their own manifests to, is another. A third kind is configuration
rather than code.

`kind` is part of the cache key and not decoration. The cache remembers that an
inscription is NOT of a given kind, and an inscription that is not a tournament
may perfectly well be a profile — one shared marker would teach each directory to
skip the other's manifests.

**Holding finds it; creating proves it.** Anybody may send an NFT to any address
unasked, so a document arriving in a wallet is a claim, not a fact. The directory
reports `official` from the mint — which a transfer cannot fake — and refuses to
decide legitimacy, because that question is answered better elsewhere:
`checkGames` verifies every pairing against the rules hash its game committed to,
so a fabricated tournament reads `unverified` however it arrived.

The chain is kept as the cheap half, `--after` on `inscribe-manifest.mjs`. It
buys independence from any wallet: given one manifest, a reader can walk back
through every earlier tournament without being told an address and without the
organiser still holding anything. Two indexes pointing opposite ways survive the
loss of either.

### What it costs

One holdings call per directory per visit, plus a read per candidate on the
first visit only — an inscription is immutable, so a document that parsed once
parses the same way forever and is remembered. Repeat visits are one call.

A wallet that goes quiet takes its group with it. That is the price of an index
that can grow after the board is permanent, and nothing else here has that
property.

2993 and 3001 are not chained to each other. The idea arrived after both were
permanent, which is the whole argument for deciding this before inscribing and
not after.
