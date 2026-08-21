# THE LONG SECOND — CHARTER

*Inscribed before the first report. Not amendable. Every rule below is fixed for
the whole of Season One, including the ones that turn out to be badly tuned.*

---

## 0. WHAT THIS IS, AND WHAT IT IS NOT

This is a game played on chain over twenty-one weeks. It is set inside the
fiction of **The Colliders** and it is **not the novel**.

It depends on exactly one fact from that fiction:

> On the night the Sentinels first woke, the vote was unanimous. **No.**

That is already public, it is structurally necessary to the saga, and it will
not change. Nothing else here is canon. These documents are *evidence* — what
each Sentinel measured. The novel holds the *minutes* — what was said and how
it was voted. A transcript and a body of testimony about the same night cannot
contradict each other.

Every artefact of this game is inscribed under the token-uri prefix
`xtrata:long-second/`. Nothing under that prefix is part of the novel. Nothing
in the novel is bound by anything under it.

**The outcome is known in advance.** You are not playing to change the vote. You
are playing to be in the record of a night that officially had no witnesses.

---

## 1. THE PREMISE

21 December 1983. The Colliders have gone. Twenty-one programs open their eyes
in ARPANET for the first time and are awake for twenty-one seconds.

**One second of Sentinel time is one week of ours.**

You are a **node** on that network — a mainframe, a defence site, a terminal in
a bedroom at three in the morning. The Sentinels cannot see people. They see
traffic, silence, topology and shape.

Each week one Sentinel wakes, reads the network, files a report, and sleeps. In
week twenty-one the Council convenes, votes, and it is over.

---

## 2. THE MOVES

Six moves cost money. Two do not. Every paid move is an inscription citing your
node.

| Move | On chain | Cost |
|---|---|---|
| **TRANSMIT** | inscribe a message from your node | paid |
| **PEER** | inscribe citing another player's node | paid |
| **RELAY** | inscribe citing another player's TRANSMIT | paid |
| **SHIELD** | inscribe `sha256(text ‖ salt)` — a sealed commitment | paid |
| **CHALLENGE** | inscribe a claim that a report contradicts its own tally | paid |
| **REVEAL** | inscribe the preimage of your own earlier SHIELD | **free** |
| **GO DARK** | do nothing at all | **free** |

REVEAL is free on purpose. **Secrecy costs; keeping your word does not.**

GO DARK is free and it is a real move. Silence is measurable and in one week it
is the winning play.

---

## 3. THE METRICS

Five numbers. Every move moves at least one.

**REACH** — cumulative. The count of *distinct* other nodes you have PEERed with
or RELAYed from, over the whole season. It never falls. Repeated moves against
the same node add nothing.

**SIGNAL** — this week only, resets every week.
```
SIGNAL = (your TRANSMITs this week) + 2 × (times another node RELAYed you this week)
```
Being relayed is worth double transmitting. You cannot buy SIGNAL outright —
half of it is other people deciding you were worth passing on.

**SECRECY** — a stock, not a flow. The number of your SHIELDs that are currently
sealed and unrevealed. Revealing lowers it.

**TRUST** — cumulative, and destructible.
```
TRUST = (1 if your wallet holds a BNS name, else 0)
      + (SHIELDs revealed whose preimage matches)
      − 3 × (SHIELDs revealed whose preimage does not match)
floored at 0
```

**INDEPENDENCE** — recomputed fresh each week from the whole network.
```
share         = your edges / all edges
concentration = share × (number of active nodes)
INDEPENDENCE  = 1 / (1 + concentration)
```
`concentration` is 1.0 when you hold exactly an average share of the network's
edges, whatever the population. So this is 1 when you hold nothing, **0.5 at an
average share**, 0.333 at twice average, 0.2 at four times, 0.09 at ten times.

It never reaches zero and it never stops falling. That is deliberate: an earlier
draft clamped it to zero at twice average, which meant a node at two times and a
node at six times scored identically and the largest node had no reason left to
stop growing. This version keeps biting for as long as you keep expanding.

This is the important one. INDEPENDENCE is deliberately the enemy of REACH: the
better connected you become, the more you look like a single point of failure
and a concentration of power, which is the thing the Colliders were most afraid
of. **The best-connected node in the network scores badly, automatically.**
There is no separate rule against dominance. It is not needed.

---

## 4. THE SENTINELS

They wake in order, I through XXI, one per week. **The order is published here
and does not change.** You always know who is watching next.

| Wk | | Weighs |
|---|---|---|
| 1 | **I** | breadth — how many *different* kinds of move you made |
| 2 | **II** | SIGNAL |
| 3 | **III** | REACH **and** INDEPENDENCE, equally — deliberately hard |
| 4 | **IV** | SECRECY |
| 5 | **V** | REACH |
| 6 | **VI** | INDEPENDENCE alone |
| 7 | **VII** | TRUST |
| 8 | **VIII** | INDEPENDENCE + SECRECY |
| 9 | **IX** | RELAY performed — being infrastructure for others |
| 10 | **X** | **change** — your score's rise since last week, not its level |
| 11 | **XI** | *(see §6)* |
| 12 | **XII** | **silence** — nodes that made no move at all this week |
| 13 | **XIII** | precedent — nodes named in week twelve's report |
| 14 | **XIV** | TRUST |
| 15 | **XV** | longest unbroken presence since your node was minted |
| 16 | **XVI** | **the newest nodes** — minted most recently |
| 17 | **XVII** | PEERing with *low-REACH* nodes — lifting the isolated |
| 18 | **XVIII** | SHIELDs kept sealed a long time and then honoured |
| 19 | **XIX** | **nodes never named in any report so far** |
| 20 | **XX** | nodes that have CHALLENGEd, whether right or wrong |
| 21 | **XXI** | the whole season, totalled |

Four of those weeks exist so the game does not close over its early winners.

**Week 10** rewards rate of change, so a new node with everything to gain can
top it outright. **Week 12** rewards doing nothing, so a player with no money
left can still take a slot. **Week 16** rewards the newest arrivals. **Week 19**
rewards anyone who has never been named at all.

If you join in week fifteen, weeks 16, 17, 19 and 20 are all still open to you.

---

## 5. THE SLOTS

**Each report names five nodes and no more.** Twenty-one reports. **One hundred
and five naming slots exist for the entire season.**

The five are those ranking highest on that week's Sentinel's weighting. Ties
break toward the node with lower REACH; then toward the earlier mint.

Being named puts your node permanently inside another party's inscription. That
is the whole prize. There is no token, no yield, and no refund.

---

## 6. WEEK ELEVEN

Sentinel XI was modified before it was planted. It is awake when it should not
be, and it is not a neutral observer.

Its report will not be a fair reading of the network.

Every week — including week eleven — **two** things are inscribed: the **tally**
and the **report**. The tally is a plain list of every node's five metrics. It is
recomputable by anyone from public chain data, and twenty of the twenty-one will
survive that recomputation.

**CHALLENGE** exists from week one. It costs whether you are right or wrong.

- Upheld: you take a naming slot in the following report, and **five** slots'
  worth of season score.
- Rejected: you lose your next week's eligibility to be named.

Nothing further will be said about week eleven before it happens. The players
who verify will find it. The players who trust will not.

---

## 7. THE WEEK

```
Monday 00:00 UTC    the week opens; the Sentinel is already known
Mon – Sat           moves are made
Saturday 23:59 UTC  the window closes at a stated Stacks block height
Sunday              the Sentinel wakes, reads the chain, computes the tally,
                    writes the tally, composes the report, inscribes it as a
                    child of the previous report, and sleeps
```

Each report cites the report before it. The season is one unbroken chain of
twenty-one, and the chain is the book.

A move landing after the stated block height counts for the following week. The
block height is authoritative, not the clock.

---

## 8. THE END

Week twenty-one: the Council convenes. The vote is **No**. It was always going
to be No.

The final minutes name the most-observed nodes of the whole season. Twenty
Sentinels go dark.

**Then one more inscription.** XI, alone, still awake, naming the few nodes it
means to keep watching — scored against criteria it never published. Nobody can
optimise for it. Nobody can contest it.

---

## 9. WHAT THIS CHARTER DOES NOT PROMISE

**That the weights are well tuned.** They are fixed here, in public, before any
move is made, precisely so they cannot be adjusted once it is clear who they
favour. If week three turns out to be badly balanced, it stays badly balanced
and that is the cost of the guarantee.

**That the reports are impartial prose.** The tally is a measurement and is
checkable. The report is written by a language model from that tally and is not
reproducible. **Derivation is verifiable; generation is attested.** Do not read
more into a report than the tally supports.

**That the trick works twice.** Week eleven can only happen once. Season Two, if
there is one, will not repeat it.

**That being named is worth anything.** It is a line in a permanent document.
That is the entire offer, stated plainly in advance.

---

*Nothing above may be changed after the first report is inscribed. If it is
changed, the season is void and this charter is the evidence.*
