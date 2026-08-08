# sponsorship-v1

How a player holding zero STX gets to play chess, with no server anywhere.

---

## 1. The problem, stated exactly

A player with zero STX cannot send any transaction, because a transaction needs
a network fee. That is the whole problem, and it has no clever solution.

**Native Stacks sponsorship does not solve it serverlessly.** A sponsored
transaction needs a second signature from a fee-paying account, added after the
user signs. That account holds a private key, and a key that signs on demand
needs a service to hold it. That is a server, which the whole design forbids.
Verified against current Stacks documentation, not inherited — see ADR-0001.

---

## 2. What is actually done

**Creator-funded on-chain bootstrap, plus fixed on-chain rebates.**

```
creator
  |  one transaction, signed by them, with no other party involved
  v
open-sponsored-game(rules, ranked, opponent)
  |
  +-- contract collects: the game fee + bootstrap + rebate reserve + margin
  +-- contract records the sponsorship, reserving the rebate pool
  +-- contract transfers the BOOTSTRAP to the opponent, immediately
       |
       v
  the opponent's wallet now holds enough to pay a network fee

then, for each submission by the opponent:
  wallet pays the ordinary network fee to a miner
  contract records the entry
  contract sends back a FIXED rebate
  the allowance decreases
```

No X Chess process participates at any point. The creator's single transaction is
the only funding event, and after it the contract acts alone.

---

## 3. The allowance is bounded twice

| bound | why |
|---|---|
| a **count** of rebates | an unexpectedly long game cannot become unbounded |
| a **STX liability** | a change to the rebate amount cannot inflate a promise |

Whichever runs out first ends the sponsorship. Each sponsorship records **its
own** rebate amount at funding time, read from the row and never from the current
configuration, so changing the setting can neither cheapen nor inflate a promise
already paid for.

---

## 4. The constants, and how they were chosen

Measured, not guessed. `tests/sponsorship/zero-stx.test.ts` runs a genuinely
zero-balance wallet through a full game at a range of network fees; the results
are in `ops/measurements/sponsorship-sweep.json` and ADR-0004.

| constant | value |
|---|---|
| bootstrap | 0.060 STX |
| rebate | 0.010 STX |
| rebate count | 45 |
| margin | 0.050 STX |
| game fee | 1.000 STX |
| expiry | 4320 blocks |

**The rebate is set TO the observed mainnet fee, not below it.** That is the
load-bearing choice. At or under the design fee the player is never out of
pocket, so the bootstrap is never touched and is still theirs at the end — the
sweep confirms it, ending at exactly 0.060 STX after a full game at 0.010. The
bootstrap is then pure headroom against a fee spike rather than the thing being
slowly consumed.

Prices:

```
Standard Game          1.00 STX
Sponsor Opponent       1.56 STX     (1.00 + 0.060 + 0.450 + 0.050)
Sponsor Both           2.12 STX     (1.00 + two packages)
```

**A move costs no X Chess fee.** The only cost of playing is the network's own.

### Above the design fee

The reach on the bootstrap alone is exactly

```
floor((bootstrap - fee) / (fee - rebate)) + 1
```

asserted as an equality in the suite: 25 submissions at 0.012 STX, 10 at 0.015,
5 at 0.020, 2 at 0.030. A sustained spike above 0.010 shortens sponsored play.
The owner can raise the rebate to the 0.1 STX ceiling in response, which covers a
tenfold spike, and games already funded keep their own terms.

---

## 5. One allowance, not two

The design brief specified separate "gameplay" and "settlement" rebate counters,
so that a player could never be left unable to afford the transaction that
resigns or agrees a draw.

**That cannot be built without breaking the core invariant.** To hold rebates
back for settlement transactions, the contract would have to recognise which
submissions ARE settlement transactions — it would have to know that `resgn` and
`draw!` are special. That is an opinion about the meaning of the strings it
stores, and the contract must never form one.

So there is one counter, and the concern is answered by the bootstrap instead:

1. At or below the design fee the player is never out of pocket, so after all 45
   rebates they still hold the entire 0.060 STX bootstrap — six more
   transactions' worth. Resigning is always affordable.
2. Running out never blocks a submission. The exhaustion test proves it by
   playing a `resgn` past the end of the allowance.

Full reasoning in ADR-0005.

---

## 6. Running out

When the allowance ends:

- the game does **not** terminate
- the game does **not** become invalid
- replay is **unaffected** — it does not know sponsorship exists
- the player simply starts paying ordinary network fees

```
Sponsored transactions remaining: 0

Your sponsorship allowance has been used.
The game continues normally.
Future transactions require ordinary Stacks network fees.
```

This economic state is never part of chess consensus.

---

## 7. Top-ups

Anyone may add more to a running game: the creator, either player, a third
party, a tournament organiser. There is no billing system and no account — the
payment is the transaction.

A top-up charges the liability and the margin again, but **not** the bootstrap.
The wallet is already funded, which was the bootstrap's whole job; charging for
it twice would be selling something the buyer already has.

---

## 8. Expiry and settlement

The contract does not need to understand checkmate to release an unused reserve,
and must not learn to. Expiry is a **height**.

After it, **anyone at all** may call `settle-sponsorship` — no cron job, no
keeper, no privileged caller. If nobody calls it, the funds simply stay
reserved, which is safe. Settlement moves no money: it releases the reservation,
which is what turns the remainder from a liability into treasury.

Settlement still works after ownership is renounced, because anybody can call
it. A renounced contract cannot strand a reserve.

---

## 9. Solvency

One invariant governs the money, asserted after every operation in every test:

```
contract STX balance  >=  total outstanding sponsorship liabilities
```

`withdrawable = balance - reserved`, never negative. The owner cannot withdraw
below it, so emptying the treasury cannot strand a game — there is a test that
empties it and then plays the game out to the last rebate.

One game's reserve can never be spent by another, because a payout is only made
against that game's own recorded remainder, and Clarity 4's `as-contract?`
allowance is written for that exact number. If the arithmetic were ever wrong,
the language would abort the call before the money moved.

---

## 10. The limitation, stated rather than hidden

**Only a NAMED beneficiary can be bootstrapped.**

An anonymous open game cannot autonomously fund an unknown future player,
because that player would have to send a transaction to say who they are, and
has no STX to pay for it. There is no serverless way around this.

So, for launch:

- open games can exist, and anyone with STX can join one
- named sponsored challenges provide genuine zero-STX onboarding
- an unknown zero-balance participant needs some prior funding

The UI says this. Concealing it would be worse than the limitation.
