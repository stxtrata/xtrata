# The feedback, itemised

Every point raised by **peacelovemusic.btc** and **3hunnatheartist.btc** during
game 8, split into fifteen items. The tester's own words are quoted; everything
after each quote is what the item turned out to be on inspection.

Nothing here is dismissed. Where an item is blocked, it is blocked on a decision
that is written down in [`05-DECISIONS.md`](05-DECISIONS.md), not on an opinion.

---

## F1 — The queens

> "Queens are positioned on wrong squares at start of match - should be on own
> colors"

**Real, and the cause is not the one reported.** The pieces are correct. The
board is inverted.

`packages/ui/board.ts:169` computes `const dark = (file + rank) % 2 === 0`. For
a1 that is `(0 + 1) % 2 === 0`, which is false, so a1 renders **light**. In chess
a1 is dark. Every square on the board is the opposite colour to what it should
be.

The symptom the testers saw follows directly: the white queen starts on d1, a
light square, and this board draws d1 dark — so she appears to be on the wrong
colour. So does everything else, but the queen is where a chess player looks
first, because "queen on her own colour" is the standard way to check a board is
set up right.

Also wrong for the same reason, and worth mentioning because players notice it
without being able to say why: h1 renders dark, when "light square on your right"
is the rule every player learns.

Nothing tests square colour, which is why it survived. Confirmed with a truth
table in [`02-FINDINGS.md`](02-FINDINGS.md). **→ Proposal 24.**

---

## F2 — Board coordinates

> "Please can we add grid markings A-G, 1-8 around the edges of the board?"

**Straightforward, and not currently present.** (The files are a–h; a–g would be
seven of them.)

There is a real design question inside it that the plan should not skip: the
board flips (`view.flipped`, `board.ts:164`), so the labels have to flip with it,
and the label row costs vertical space on a phone — which proposal 10 has already
found to be the tightest dimension in the layout. **→ Proposal 26.**

---

## F3 — Finding a game again

> "UX is solid for first run tbh. The biggest quirk is finding the game once
> you've left the screen."

**The sharpest observation in the set**, and the one that generated the most
work. There is currently no history, no list of your own games, and no way back
to a board you were on except retyping the game number into the Play tab.

Splits across proposals **27** (deep links and getting back), **28** (finding
games in Explore) and **29** (knowing which one you are in). **→ Proposals 27,
28, 29.**

---

## F4 — A URL that points at a game

> "Can we update so the URL can also link straight to a game so watching game 8
> could be done with a link like https://xtrata.xyz/inscription/2988-8 or
> something like that for easy linking to games especially for spectators"

**Half of this already works in the tree, and cannot work in the inscription
that is live.** Tested 2026-08-12: the link lands on Play and the Game tab says
"no game loaded".

`xtrata-2.0/functions/inscription/handler.ts:60` is
`runtimeUrl.search = sourceUrl.search`, so the query does reach the board, and
`openFromLink` (`packages/ui/app.ts:495`) does read `?game=`. But that function
landed on 2026-08-10 in `bf8e8b01` and **2988 was built on 2026-08-09**. The live
board has never had it.

Nothing to build. It ships with the next inscription, and is now covered by tests
at the real URL shapes.

What does not exist:

- **The tidy `2988-8` path form.** That needs `normalizeTokenId`
  (`handler.ts:41`) to split on `-` and set `game` in the forwarded query. About
  five lines — but in `xtrata-2.0`, a different project, so it is a separate
  change with its own review.
- **The board producing such a link.** Copy link is currently broken for exactly
  the people who can move, which is already proposal 8 in the master list.

**→ Proposal 27**, with the free half called out first.

---

## F5 — A searchable, filterable Explore

> "having a searchable, filterable explore section that is also very useful for
> finding your own games as well as searching for other games you might like to
> watch etc"

**Not present.** Explore lists the newest 25 games (`app.ts:2334`) with no
search, no filter and no notion of which are yours.

Proposal 14 in the master list already adds "can I play in this" and "is it my
move" badges and sorts actionable rows first, which is the foundation. This item
is the rest: filter by mine / open / live / finished / ranked, search by game
number or player, and a bound that says so when the newest-25 window hides one of
your games. **→ Proposal 28.**

---

## F6 — Which game am I looking at

> "Also clear markings / visual feedback showing which game is currently being
> viewed/heard"

**Not present, and it matters more than it sounds** because of F7: the testers
run several tabs at once, and every tab currently looks the same. The document
title is static, so the browser tab strip — the one place a person actually
distinguishes tabs — says nothing.

Cheapest useful piece: put the game number and whose turn it is in
`document.title`. **→ Proposal 29.**

---

## F7 — Being told it is your move somewhere else

> "If players are playing multiple games they can have multiple tabs open to
> watch different games - is there also a way that we could add something to
> update a player in one game that it is their move in another game? Could this
> be done via the explore panel or something?"

**Buildable, and cheaper than it sounds, with one honest limit.**

The board already polls a hidden tab when a live game is loaded and the player
asked for sound (`BACKGROUND_POLL_MS`, `app.ts:98`), and the sound system already
exists. What is missing is that the poll only ever watches *this* game.

The limit to state plainly: with no server there are no push notifications. A tab
must be open for anything to be noticed. What is achievable is "this open tab
also watches your other games", not "your phone buzzes". **→ Proposal 29.**

---

## F8 — Present / away status

> "Is there a good way to weave some kind of seated / standing or present / away
> status that players can use to let other players know if they are currently
> looking at the board or listening for their turn?"

**This one runs into the architecture, and the honest answer is a qualified no.**

Real presence needs somewhere to put a heartbeat that is not a chain. Writing
presence on chain costs a transaction per heartbeat, which is absurd for
something true for thirty seconds. There is no server. So live presence is not
available on the current design.

What *is* available, entirely from the chain and costing nothing:

- **Last seen**, derived from the block height of a player's most recent
  submission in any game — the app already fetches block times
  (`packages/chain/block-time.ts`).
- **Expected pace**, from the median gap between that player's moves.

"Last moved about four hours ago, usually replies within a day" is honest,
derivable and probably more useful in correspondence chess than a green dot. A
green dot would be a live status this system cannot truthfully offer.

Grouped with the messaging decision because they share a transport. **→ Proposal
30, blocked on decisions D1 and D3.**

---

## F9 — A chat panel

> "Players have requested a chat panel (some said for 'trash talking') so we need
> to work out best way to implement this - probably with some kind of
> posy-message system that ties to each game ID?"

**Wanted, and it collides with the two strongest constraints in the project at
once.**

- **On chain, through the current contract, is not merely awkward — it is
  impossible.** `submit` takes `(string-ascii 5)`
  (`contracts/xchess-core-v1.clar:535`). Five characters. A message is not
  representable, and widening it means a new contract.
- **Off chain means a server**, which `harness/serverless-audit.mjs` mechanically
  refuses in shipped code, and which breaks the one claim the whole project is
  built on: that it keeps working if every machine the authors ever ran
  disappears.

There are real options — a separate messages contract, a per-game memo
convention, an optional off-chain relay the board treats as decoration and works
without — and they have genuinely different costs. That is a decision, not an
implementation detail. **→ Proposal 30, blocked on D1 and D2.**

---

## F10 — Public comments

> "Can we also consider if it's worthwhile adding a public comments section too?
> I am assuming all of this would be off chain but could we consider offering
> both so it is possible to make comments on-chain as well?"

**Same transport question as F9**, and the tester has already put their finger on
the right framing by asking for both. Offering both is coherent: on-chain
comments are permanent, paid and public; off-chain comments are free, deletable
and require a host.

One extra consideration comments raise that private chat does not: a public
comment on a permanent board is a permanent public statement attached to somebody
else's game, with no moderation path and no delete. That belongs in the decision.
**→ Proposal 30, blocked on D1, D2 and D3.**

---

## F11 — More facts in Explore

> "In the Explore section can we add more available info for example which
> address or BNS created each game? Sponsorship details including who and how
> much and what remains for each sponsored player etc."

**All of it is already on chain and most of it is already fetched.**

`GameRow` carries `openedBy`; BNS resolution exists (`packages/chain/bns.ts`);
`SponsorshipRow` carries `rebatesLeft`, the per-rebate amount and `expiry`, and
`client.ts:58` already decodes `expiry` — which, as proposal 23 found, **no UI
file reads at all**.

That last point makes this more than cosmetic. A sponsorship expires roughly
fifteen hours after funding, and once expired **anyone at all** can settle it and
end it permanently. Showing "expires in about four hours" is the difference
between a sponsored game a player can protect and one that quietly dies. **→
Proposal 28.**

---

## F12 — A faster game mode

> "I am interested to understand if there is anything we could do to create
> different game modes - EG a faster game mode where the results are inscribed
> only at the end of the game, potentially using stacked hashing throughout the
> game to ensure the start and end hash match before allowing the exact same
> hashed match to be inscribed at the end of the match rather than inscribing
> every move the whole match json is inscribed at the end - thoughts on this?"

**A good instinct, correctly reasoned, and it is a state channel.** The stacked
hash the tester describes is exactly the right primitive, and the project already
has one: the Xtrata chunk chain is `sha256(running || chunk)` and
`packages/protocol/sha256.ts` implements it.

Two things it must answer to work here, both solvable and neither trivial:

- **Abandonment.** If moves are not on chain as they happen, a losing player
  simply stops signing and the game has no ending. This is the same hole
  proposal 22 (`time!`) fills for ordinary games, and a fast mode needs its own
  version of it.
- **§79.** The architecture promises that the chain plus the published documents
  are enough to reconstruct every game. If only a final hash is inscribed, that
  breaks — unless the full signed move list is submitted at the end, which is
  what the tester actually proposed. That works, and it is a different storage
  shape from `submit`'s five-character entries.

Notably it composes well with proposal 20's sealed game, which is already the
"one finished game as a self-contained object" format. **→ Proposal 33, blocked
on D5.**

---

## F13 — Tournaments

> "Check we can set up a tournament, how to do it, how to fit it into the UI so
> tournaments can be set up both named as well as anyone can join/play that can
> be its own referee and compute the results at the end etc then we can have a
> tournament with a prize pool/bounty"

**Splits cleanly into a part that is nearly free and a part that is blocked.**

*Nearly free:* a tournament is a set of games. Standings are already derivable —
`ranked-v1` decides which games count and `elo-v1` computes ratings, both purely
from the chain. "Its own referee" is a fair description of what replay already
is. A tournament could be a named group of games plus a derived standings table,
with no contract change at all.

*Blocked:* the prize pool. Paying somebody requires the contract to know who won,
and it cannot. Same wall as F14.

**→ Proposal 32**, split accordingly; the pot is blocked on D4.

---

## F14 — Wagers

> "Can we add ability for users to add a wager to their games? Both parties lock
> some stacks into the contract and the winner takes all?"

**The hardest item here, and the one most likely to lose somebody real money if
it is built quickly.**

Locking the stake is easy — the contract already holds STX and has a solvency
invariant asserted after every operation. Paying it out is the problem, and it is
not a small problem.

The contract has `claim-result` (`clar:616`), which looks like the answer and is
not. Its own comment says so:

> "Not validated, and not validatable here without teaching this contract chess.
> ... A dishonest hint costs its sender a network fee and convinces nobody."

That is fine for a hint. Wire money to it and "convinces nobody" becomes
"whoever claims first takes the pot", because first claim wins the slot and
cannot be overwritten (`clar:621`). A losing player who claims quickly wins the
money.

So a wager needs an adjudication design, and there are only a few honest shapes:
both players signing the outcome, with a fallback for the one who vanishes; or a
challenge window; or a named adjudicator, which reintroduces a trusted party. Each
has a real cost. This is the single most important thing in this folder to get
right and the least urgent to start. **→ Proposal 31, blocked on D4.**

---

## F15 — Switching games failed

> "when I tried to switch from game 8 to game 1 using the open button in the
> explore tab for game 1 it did not work. I got this message: Could not reach any
> Stacks endpoint, so loading game 1 is unavailable. The chain is fine; this page
> cannot see it."

**Real, reproduced, and the cause is a one-way ratchet in the failover.**

The request loop is `for (let attempt = index; attempt < bases.length; attempt++)`
(`packages/chain/endpoint.ts:214`). It starts at the remembered base and only
tries bases *after* it. `index` moves forward on a successful fallback and never
moves back. So a host that recovers is never returned to, and a host earlier in
the list is never retried — leaving the board pinned further and further down the
list, until any wobble in the last host produces exactly the message the tester
saw, with healthy hosts untried.

Full reproduction in [`02-FINDINGS.md`](02-FINDINGS.md). **→ Proposal 25.**

---

## Where each item went

| item | proposal | note |
|---|---|---|
| F1 queens | 24 | Confirmed defect, one expression |
| F2 coordinates | 26 | |
| F3 finding a game | 27, 28, 29 | The largest single theme |
| F4 deep-link URL | 27 | Check the query form first, it may already work |
| F5 search and filter | 28 | Extends master proposal 14 |
| F6 which game is this | 29 | |
| F7 turn alerts elsewhere | 29 | Open tab only, no push |
| F8 presence | 30 | Live presence not available; derived "last seen" is |
| F9 chat | 30 | Blocked on D1, D2 |
| F10 public comments | 30 | Blocked on D1, D2, D3 |
| F11 explore facts | 28 | Sponsorship expiry is the load-bearing one |
| F12 fast game mode | 33 | Blocked on D5 |
| F13 tournaments | 32 | Standings free, pot blocked on D4 |
| F14 wagers | 31 | Blocked on D4 |
| F15 endpoint failure | 25 | Confirmed defect, reproduced |
