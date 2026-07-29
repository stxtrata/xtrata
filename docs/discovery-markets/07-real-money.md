# 07. Polymarket, and the real money question

Researched 2026-07-29. Everything here is sourced and checkable.

This document exists because the earlier docs recommended starting without real
money, and Jim's read is that the Polymarket model is the target. Having gone and
looked properly, **he is more right than I was**, but not for the reason either of
us assumed, and there is one hard obstacle that has nothing to do with the design.

---

## How Polymarket actually works

Mechanically it is simpler than it sounds.

**Binary outcome shares.** Every market is a question with a YES and a NO share.
Shares trade between $0 and $1 in USDC. If you are right, each share you hold
redeems for exactly $1.00. If you are wrong it is worth nothing. So a share
trading at $0.61 is the market saying 61% likely, and the price *is* the forecast.
That is the elegant part. There is no separate "odds" layer, the price is the
probability.

**A real order book, not a bookmaker.** Polymarket runs a central limit order book
where you trade against other users, never against the house. It is hybrid, with
order matching off-chain for speed and settlement on-chain via a contract on
Polygon. Place a limit order and the system automatically mirrors it as the
opposite-side order. Because you trade peer to peer, Polymarket has no position and
no exposure. They do not care who wins.

**Resolution by optimistic oracle.** Markets settle through UMA's optimistic
oracle. Somebody proposes the outcome on-chain and posts a bond. If nobody disputes
within two hours, it settles. A dispute goes to a 48 hour vote of UMA token
holders. The design assumption is that challenging a false result is profitable, so
false results get challenged.

That resolution layer is the part most relevant to us, and it is also the weakest
part of the whole architecture. It works when the outcome is a public fact that
everybody can see. It gets shaky exactly where our design lives.

---

## How it makes money

Here is the fact that matters most, and it is not the fee schedule.

> **Polymarket charged nothing for most of its existence and reported roughly zero
> revenue as recently as 2025.**

Fees only started arriving in January 2026. That is years of venture-funded
operation to accumulate liquidity, because in an order-book market liquidity is the
entire moat. Thin books mean wide spreads, wide spreads drive traders away, and
that is a death spiral. Deep books attract more depth. Polymarket bought its way
through that curve with investor money.

Current revenue, as of the 2026 fee structure:

| Stream | Notes |
|---|---|
| **Taker fees** | The main one. Makers pay nothing and receive rebates funded from taker fees. Rates vary by category, with sports lowest and crypto highest, and some categories still free |
| **Market creation fees** | Charging for the right to list a question |
| **Spread capture** | On high volume markets |
| **Liquidity incentive programmes** | Institutional makers pay for priority access |
| **Data licensing** | See below. This is the one to pay attention to |

Reported fee figures are inconsistent across secondary sources, with some quoting
per-category rates that look like basis points and others quoting "1 to 2% per
matched order". Do not quote a specific number without checking Polymarket's own
fee documentation.

### The number that should change how you think about this

ICE, the company that owns the New York Stock Exchange, committed $2bn to
Polymarket. The reported thesis was **not trading fees**. It was data. ICE took
exclusive global distribution of Polymarket's event-driven data to institutional
capital markets.

The most sophisticated buyer in the space paid two billion dollars substantially
for the right to sell the signal, not to clip the trades.

That is a direct, expensive, third-party validation of the argument in
[06-open-questions.md](06-open-questions.md), which was that the early revenue in a
music version is selling early signal to people who need it, and trading activity
is the instrument that generates it rather than the product itself.

### Is this a big business

Yes, unambiguously, and Jim's instinct on scale is right.

| | Kalshi | Polymarket |
|---|---|---|
| Valuation | ~$22bn | ~$15bn |
| 2025 revenue | ~$260m | ~nil |
| June 2026 volume | ~$31.5bn | ~$10.8bn |
| Take rate | ~1.14% | monetising since Q1 2026, ~$300m annualised projected |

Kalshi's private valuation now exceeds every listed sportsbook except Flutter.

---

## Is Polymarket gambling

**The answer is different in the two jurisdictions that matter, and this is the
whole ballgame.**

### United States: legally not gambling

Polymarket US operates as QCX LLC, a **CFTC-regulated Designated Contract Market**,
after acquiring the licensed exchange and clearinghouse QCEX for $112m in 2025.
Contracts are fully collateralised, dollar for dollar, with no margin and no
leverage.

Under that framework these are **event contracts**, which are derivatives. They sit
under the CFTC, not under gaming regulators. Legally that is a different category
of thing entirely, and it is why the US relaunch was possible.

There is a live and favourable development here. On 10 June 2026 the CFTC issued a
proposed rulemaking on event contracts. Its definition of prohibited "gaming"
turns on activities engaged in for recreation, governed by rules, with outcomes
depending on participants' luck, skill or athletic ability *during the activity*.
Crucially the proposal **excludes awards contests**, naming the Nobel Prize and the
Academy Awards, on the basis that they turn on evaluative judgments by external
panels rather than on the participants' own performance.

Music awards would fall the same way. Our metric, which is listening behaviour in a
held-out cohort, is not obviously gaming under that definition either. It is novel
and would need counsel, but the direction of travel is favourable rather than
hostile.

### United Kingdom: yes, and Polymarket is blocked here

This is the part that changes the plan.

- Polymarket **does not operate in the UK**. It is not licensed by the Gambling
  Commission and it blocks UK IP addresses. The UK is one of roughly 33 restricted
  countries. British users cannot open accounts, deposit or trade.
- The **UKGC treats prediction markets as betting intermediaries requiring a
  licence.**
- Separately, the **FCA's binary options ban** covers prediction market contracts.
  That is a second, independent obstacle, and it is not solved by getting a
  gambling licence.
- Europe is tightening, not loosening. In January 2026 the Dutch regulator issued a
  penalty order requiring Polymarket to cease operations within four weeks, with
  fines of €420,000 a week up to €840,000.

So the honest statement is this. **The model Jim wants to copy is one that its
originator is legally unable to offer to a single person in the United Kingdom.**

That is not a reason to abandon it. It is a reason to be extremely deliberate about
domicile, entity structure and launch market, and to get that advice before design
decisions harden around assumptions that only work in one jurisdiction.

---

## The wisdom of crowds point, and what actually makes it work

Jim's framing is that the breakthrough was crowds beating the betting companies and
the pollsters, and that this is the principle to apply to music. Correct, and worth
being precise about *why* it works, because the precision determines whether it
transfers.

A prediction market is accurate when three things are true.

1. **Participants hold dispersed private information.** No single person knows the
   answer, but the information exists scattered across many heads.
2. **Being wrong is costly.** This filters loud opinion from real belief.
3. **The outcome is objective and beyond the participants' reach.** Nobody trading
   the market can change what actually happens.

Now score music discovery against those three.

**Condition 1 is exceptionally strong.** Stronger than for elections, honestly.
Taste genuinely is dispersed private information. Knowing which record is about to
move in a specific scene is precisely the thing A&R people are paid for, it is
unevenly distributed, and it is almost entirely undocumented. This is the best
possible raw material for a market.

**Condition 2 is satisfiable.** Money does it well. Scarce non-purchasable credits
also do it, less powerfully.

**Condition 3 is where music breaks, and it is the whole problem.** An election is
decided by millions of people who have never heard of Polymarket. A trader cannot
move it. But if the settlement metric is listening behaviour on your own platform,
traders can reach it. That is not theoretical. Kalshi settled a $3m contract on
Spotify streams in June 2026 and paid out on numbers that Spotify then deleted half
a million of.

---

## Where I was wrong, and where I was right

**I was wrong to frame this as a money question.** Money is not the risk axis. I
treated "no real money" as the safe default, and that was imprecise thinking.

The actual load-bearing safety property is **whether the settlement metric is
reachable by the people trading on it.** Money is a separate axis. It raises the
prize for attacking a reachable metric, but it does nothing to a metric that cannot
be reached.

**Which means the design already contains the thing that makes real money viable.**
The disjoint-cohort rule and the randomised-exposure rule in
[03-integrity.md](03-integrity.md) exist precisely to make an internal metric behave
like an external one. A resolution cohort that is randomly drawn after trading
closes, never announced, excludes everyone who traded, and excludes the artist's
graph, is unreachable in the same way an election is unreachable. Owning a tenth of
the platform to move one record is the music equivalent of needing to change the
actual vote.

So the sequencing argument changes. It is no longer "start without money because
money is dangerous". It is:

> **Prove the cohort mechanism holds, then add money. The cohort mechanism is what
> makes money survivable, and it is worthless to prove it after the fact.**

That is a better argument for the same first step, and it means the pilot is not a
detour away from the real business. It is the thing that de-risks the real business.

**Where the original caution still stands.** Liquidity. Polymarket needed years of
subsidy to get books deep enough to be informative, on questions that millions of
people already cared about. A market on an unknown record in a niche scene has a
fraction of that natural interest. Thin books produce noisy prices, and noisy
prices are worse than no prices because they look authoritative. This is the real
reason markets have to be scarce and earned, as in
[01-concept.md](01-concept.md), and it is a harder problem for us than it was for
them.

---

## Routes to a real money version

Roughly in order of how quickly they could happen.

**1. Non-money product in the UK, money product in the US.** The design is
identical, the settlement is identical, only the stake differs. This is probably
the realistic shape, and it means the credit version is not a compromise, it is the
UK edition and the proving ground.

**2. List contracts on an existing CFTC-regulated venue rather than buying one.**
Polymarket paid $112m for QCEX. You do not have to. Getting music contracts listed
by an existing Designated Contract Market, with us supplying the settlement data
and the discovery layer, is dramatically cheaper and puts the regulated surface on
somebody who already has it.

**3. Be the settlement oracle, not the exchange.** The most defensible position in
this whole stack might not be running a market at all. If our cohort mechanism
produces the only manipulation-resistant measure of whether a record actually
connected, then Kalshi and Polymarket are customers, not competitors, and the June
2026 incident is the sales pitch. They have a demonstrated, expensive, public
problem with music settlement data. We would be selling the fix.

**4. UKGC licence plus resolving the FCA binary options position.** Slowest and
most expensive, and the FCA issue does not go away with a gambling licence.

Option 3 deserves more thought than it has had. It is the smallest product, it
needs no listeners to start being valuable to somebody, and it turns the biggest
regulatory obstacle into somebody else's problem.

---

## What I would still do first

Unchanged, and now for a better reason.

Study 0, then the cohort mechanism, then money. Not because money is scary, but
because **the cohort mechanism is the asset**. It is what makes a music market
settleable at all, it is what Kalshi visibly lacked in June, and it is the only
part of this that cannot be bought with a bigger balance sheet.

Everything else in this space is a liquidity war against people with $15bn and
$22bn of paper. That is not a war to pick. Owning the thing that makes music
outcomes measurable is a much better position than owning another order book.
