# 08. How we pitch it now

The pitch has changed, and it got better. This is the current version.

---

## The one line

> **Nobody in music can tell a hit from a budget. We fix the measurement.**

Everything else is downstream of that.

## Why it changed

The earlier framing was "a market-powered discovery layer for new music". That is a
product. It is not a thesis, and it left the hardest question unanswered, which is
why anyone would pay.

Four facts, gathered separately for four different reasons, all point at the same
thing.

| Fact | What it actually says |
|---|---|
| Salganik 2006. Same record, 1st of 48 in one world and 40th in another | Popularity is not a measure of quality. Proven experimentally, with a control group |
| Luminate 2025. 106,000 uploads a day, 88% under a thousand plays | The filter is broken at scale |
| Kalshi, June 2026. $3m settled on streams Spotify then deleted | Streams are not a trustworthy settlement metric |
| ICE, $2bn into Polymarket, substantially for data distribution rights | Trustworthy signal is worth serious money to serious buyers |

Read together they are not four problems. They are one problem seen from four
angles. **The music industry has no trustworthy measure of whether a record
actually connected.** Streams can be botted, playlists can be bought, charts can be
gamed, and nothing separates a record people love from a record with a marketing
budget.

That is the thesis. Fix the measurement and the discovery app, the tastemaker
reputation, the chart and the markets all fall out of it.

## The elegant version, for people who like ideas

Salganik's experiment measured every song twice. Once with the crowd visible, which
is what streaming measures. Once with the crowd hidden, which is what the song was
actually worth.

Nobody has ever run the second measurement as a product.

**That is what we are building. Salganik's control condition, run continuously, at
scale, as a service.** The held-out cohort is not a fraud-prevention feature bolted
onto a discovery app. It is the entire invention.

---

## Four rooms, four pitches

Same company. Do not mix them up.

### Room 1: Investors

The one that changed most, and the one that is now genuinely strong.

> Prediction markets are worth about $37bn between Kalshi and Polymarket. ICE put
> $2bn into Polymarket and the thesis was the data, not the trading fees.
>
> Every one of them wants music. None of them can settle it. Three weeks ago Kalshi
> paid out $3m on Spotify numbers that Spotify then deleted half a million of.
>
> The reason is that streams are reachable. Anyone betting on a stream count can go
> and buy stream counts.
>
> We built the thing they are missing. A measure of whether a record connected that
> the people trading on it cannot touch, because it is taken from a random cohort
> drawn after trading closes, who are never told they are the ones being measured.
>
> That measurement powers a consumer discovery product, and it is also the only
> settleable music contract anyone has. Same asset, three customers.

Why this works: it is a picks-and-shovels business in a sector with proven,
enormous, recent buyer appetite, and the failure that creates the demand is dated
and citable.

### Room 2: Music industry friends

Keep the Kalshi opener. It is three weeks old and they will have seen it. Full
version and follow-ups in [30-SECOND-PITCH.md](30-SECOND-PITCH.md).

### Room 3: Artists and listeners

Unchanged in substance. Nobody in this room cares about settlement layers. See
[PITCH.md](PITCH.md) and the web page.

One thing in that material now needs fixing before it goes any further. See the
warning at the bottom of this document.

### Room 4: The prediction markets themselves

The smallest product, the fastest revenue, and possibly the best business.

> You have a music problem. You cannot settle music contracts on streams, and June
> proved it in public and cost you a payout you had to defend.
>
> We sell you the settlement data. A manipulation-resistant measure of whether a
> record connected, produced by a held-out listener cohort that your traders cannot
> identify or reach.
>
> You keep the exchange, the licence and the liquidity. We supply the number.

This needs no listeners at scale to start being worth something, avoids the
liquidity war entirely, and puts the regulated surface on someone who already has
it. It is option 3 from [07-real-money.md](07-real-money.md) and it deserves a
serious look before anything consumer-facing gets built.

---

## The design decision the money version forces

Worth settling now, because it changes what we promise people.

In a real-money market, capital moves price. Someone with more money can push a
thin market further than someone with better ears. That reintroduces pay-to-play
through the back door. Not artists paying for placement, but traders paying to move
the chart, which is worse because it is invisible.

**The fix is to separate the market from the chart.** They are two different outputs
from the same set of forecasts, settling on the same cohort measurement.

| | Weighted by | Sold to | Monetised by |
|---|---|---|---|
| **The market** | Capital | Traders | Fees, or a partner exchange's fees |
| **The chart** | Reputation | Labels, A&R, and the app itself | Data licensing and the consumer product |

Money buys exposure to the outcome. Money never buys chart position. Reputation is
still unpurchasable and still the only thing that moves what listeners are shown.

This keeps the promise that matters, which was never "there will be no money". It
was **"you cannot buy your way into what people hear."**

---

## What not to lead with

- **"Spotify competitor."** Wrong business, unwinnable licensing war, and it makes
  every label defensive in the first sentence.
- **Blockchain, Xtrata, wallets, inscriptions.** Not consumer facing and not
  investor facing either. It is an implementation detail of the proof layer and it
  costs you the room. It comes up if somebody asks how the record is tamper-evident.
- **The scoring maths.** Log scores, proper scoring rules, LMSR. Nobody outside a
  seminar needs it and reaching for it signals you are selling a mechanism rather
  than a business.
- **Any number you have not checked.** All the ones in these docs are sourced.

---

## Sequencing

Unchanged, and now with better reasons.

1. **Study 0.** Will anyone listen blind. Two weeks, near zero cost.
2. **The cohort mechanism.** This is the asset. It is what Kalshi visibly lacked in
   June and the only part of this that cannot be bought with a bigger balance sheet.
3. **Room 4 conversations**, which can happen in parallel with 1 and 2 because they
   need a working measurement rather than a working app.
4. **Money**, in a jurisdiction that permits it, once the measurement holds.

---

## ⚠ Fix before this goes further

The published web page and [PITCH.md](PITCH.md) both contain this, deliberately
written as a public commitment:

> If this service ever adds a button to buy more credits, it will have become a
> different and much worse company, and you should leave immediately.

That was written when the plan was no real money ever. If the plan is now a paid
version, **that page is a broken promise with Jim's name on it**, and it is exactly
the kind of thing a journalist or an annoyed early user screenshots later.

Three options, in order of preference.

1. **Restate the promise as the one we actually intend to keep.** "You will never be
   able to buy your way into what people hear." That survives the money version,
   because of the market and chart separation above, and it is the promise that was
   doing the real work anyway.
2. **Make it explicitly the UK edition promise**, with the money version named as a
   separate product in a separate jurisdiction. Honest, but complicated to explain
   and it invites the question of which one you actually believe in.
3. Leave it and change it later. **Do not do this.** The page is already published
   and the whole pitch rests on being the people who say the uncomfortable thing
   first.

Recommend option 1, and do it before the link goes to anybody.
