# The decisions only you can make

Four of the ten items cannot start until these are settled. Each is written as a
question with real options and an honest account of what each option costs, plus
a recommendation — but the recommendation is a view, not an answer.

None of these is a refusal. Every one of them is buildable. They are here because
each spends something the project has so far refused to spend, and that is a
choice with your name on it rather than a technical detail.

When one is settled, write it up as an ADR in [`../DECISIONS.md`](../DECISIONS.md)
alongside the other thirteen, and update the affected proposal in
[`../UPGRADES.md`](../UPGRADES.md).

---

## D1 — Where do words live?

**Blocks:** item 30 (chat, comments, presence). **Also shapes** items 31 and 32,
which need somewhere to put a challenge or a tournament roster.

### The problem in one paragraph

The core contract's `submit` takes `(string-ascii 5)`
(`contracts/xchess-core-v1.clar:535`). Five characters. A chat message is not
awkward there, it is **unrepresentable**. So chat cannot use the existing
contract at all, and the question is what it uses instead.

### The options

**A. A separate messages contract.** Words go on chain, in their own contract,
keyed by game id. The core contract is untouched, which keeps the "filter, never
adjudicate" invariant intact.

- *Costs:* a transaction per message. Permanent, public, undeletable trash talk.
  A second contract to deploy, verify and maintain.
- *Buys:* it keeps the whole system true. No server, works forever, and a game's
  conversation is as permanent as the game.

**B. An optional off-chain relay the board treats as decoration.** A small
service the board reads if it is there and ignores if it is not.

- *Costs:* a server exists. Even "optional" needs hosting, moderation and a
  domain — all things the project has so far been able to say it does not have.
  `harness/serverless-audit.mjs` would need an explicit exemption, and the day it
  gets one is the day "no server" becomes "no server, except".
- *Buys:* free, fast, deletable, and it can be turned off without a new
  inscription.

**C. Both, clearly labelled.** What the tester actually suggested. On-chain
messages are permanent and cost a fee; off-chain ones are free and may vanish.
The board shows which is which.

- *Costs:* both of the above, plus the interface complexity of two kinds of
  message in one panel.
- *Buys:* the honest answer to "should this be permanent?" is "sometimes", and
  this is the only option that says so.

**D. Nothing.** Players already have every social network there is.

- *Costs:* the testers asked for this specifically, and trash talk is a real part
  of chess.
- *Buys:* nothing new can break, and the serverless claim stays absolute.

### Recommendation

**A, scoped small.** A messages contract keyed by game id, with a short maximum
length and a fee that makes spam pointless. It is the only option that does not
weaken the one claim this project is built on, and "your trash talk is on Bitcoin
forever" is a better feature than a chat box.

If that feels too heavy for banter, **D for now** is more honest than B. Once
there is a server, there is a server.

### What to write down

Which option, and — if A — the maximum message length and the fee, because both
are permanent once deployed.

---

## D2 — Is a public comment permanent?

**Blocks:** the comments half of item 30. **Follows from D1.**

If comments go on chain, a public comment on somebody else's game is a permanent
public statement with **no moderation path and no delete**. Not "hard to delete" —
there is no mechanism, and there cannot be one on an append-only log.

That is fine for a player's own game log. It is a different thing when a stranger
can attach words to your game forever.

### The options

- **Owner-only comments** — only the two players in a game may comment. Removes
  the abuse surface almost entirely, and loses the spectator conversation the
  tester asked about.
- **Anyone may comment, and the board may choose not to render some of it.**
  Honest about permanence: the words are on chain whatever the board does. A
  filter list in a permanent artefact cannot be updated, so this mostly means the
  board renders everything.
- **No public comments; private per-game chat only.** Sidesteps it.

### Recommendation

**Owner-only to start.** It is the reversible direction: opening it up later is
easy, and closing it after somebody has attached something ugly to a stranger's
permanent game is not.

---

## D3 — Do you tell people who is watching?

**Blocks:** the presence half of item 30.

Live presence is not available on this architecture — see F8 in
[`01-FEEDBACK.md`](01-FEEDBACK.md). A heartbeat needs somewhere to beat, and
there is no server; on chain it costs a transaction per beat.

What *is* available, free, from data already fetched: **last seen**, from the
block height of a player's most recent submission, and **typical pace**, from the
median gap between their moves.

### The question

Is "last moved about four hours ago, usually replies within a day" enough? Or
does presence matter enough to justify whatever D1 chooses as a transport, with a
heartbeat on top?

### Recommendation

**Derived last-seen, and no green dot.** In a game where a move is a Bitcoin
transaction and a reply can take a day, "usually replies within a day" is the
useful fact. A green dot would be a live claim this system cannot make truthfully,
and a status that is sometimes wrong is worse than one that is always modest.

---

## D4 — How does a wager know who won?

**Blocks:** item 31 entirely, and item 32's prize pool. **The most consequential
decision here, and the one where building first loses somebody real money.**

### The problem

Locking the stake is easy. The contract already holds STX and asserts solvency
after every money-touching operation. **Paying it out is the problem.**

The contract cannot know who won, and must not learn — "the contract may filter,
never adjudicate" is the invariant the whole design rests on.

`claim-result` (`clar:616`) looks like the answer. It is not, and its own comment
says so:

> "Not validated, and not validatable here without teaching this contract chess.
> … A dishonest hint costs its sender a network fee and convinces nobody."

That is exactly right for a hint. Attach money and "convinces nobody" becomes
**"whoever claims first takes the pot"**, because the first claim wins the slot
and cannot be overwritten (`clar:621`). A losing player who claims quickly wins.

### The options

**A. Both players sign the outcome.** The pot pays out when both agree. If one
vanishes, a timeout splits the stake, or returns it.

- *Costs:* a player who is losing simply never signs, so the timeout is the real
  path and needs to be fair. Two extra transactions per wagered game.
- *Buys:* no adjudicator, no trusted party, and the contract never forms an
  opinion about chess. Fully consistent with the invariant.

**B. Optimistic claim with a challenge window.** One player claims; the other has
N blocks to dispute. Undisputed claims pay out.

- *Costs:* what happens on dispute? The contract still cannot referee. It ends in
  a split, or in option C. And it requires the loser to be watching — a player on
  holiday loses their stake to a false claim.
- *Buys:* one transaction in the common case, where both players are honest.

**C. A named adjudicator, chosen by both at game creation.** Could be a third
person, or a contract they both trust.

- *Costs:* reintroduces a trusted party, which is the thing this project has
  spent its whole design avoiding.
- *Buys:* it actually resolves disputes, which A and B do not.

**D. No wagers.** The rating is the stake.

- *Costs:* the testers asked for it, and it is the most obvious way for this to
  be more than a curiosity.
- *Buys:* no new contract, no adjudication problem, nobody loses money to a bug.

### Recommendation

**A, with a generous timeout, and only after `time!` (master proposal 22)
exists.** Mutual settlement is the only shape that keeps the invariant, and the
abandonment hole it leaves is the same hole `time!` was designed to fill — so
build the clock first and the wager becomes much simpler.

And treat this as the thing to do *last*, not first. Everything else in this
folder makes the application better. This one can make it harmful.

### What to write down

The design, the timeout, what happens to a stake when nobody settles, and an
explicit statement of what a player can lose if the design is wrong.

---

## D5 — What does a fast game give up?

**Blocks:** item 33.

The tester's proposal is sound and is essentially a state channel: play off
chain, chain the moves with a running hash, inscribe the whole game at the end.
The project already has the hash primitive — the Xtrata chunk chain is
`sha256(running || chunk)` (`packages/protocol/sha256.ts`).

Two things it must answer:

**Abandonment.** With no moves on chain during play, a losing player stops
signing and the game has no ending. Same hole as D4, same answer: it needs a
clock.

**§79.** The architecture promises that the chain plus the published documents
are enough to reconstruct every game. A final hash alone breaks that. Submitting
the full signed move list at the end preserves it — which is what the tester
proposed — but that is a different storage shape from `submit`'s five-character
entries, and it means a new contract or an Xtrata inscription per game.

### The question

Is a fast mode worth a second way for a game to exist? Two storage shapes means
two replay paths, two sets of golden vectors, and every future reader must handle
both, forever.

### The options

- **A. Build it as a second mode**, with its own protocol documents and version.
- **B. Build it as an inscription rather than a contract**, which fits master
  proposal 20's sealed game almost exactly — a finished game as a self-contained
  object is already the format, and this would be a signed one.
- **C. Not yet.** Revisit if slow play turns out to be what actually stops people
  playing. Nobody has said that yet; the testers said finding games was the
  problem.

### Recommendation

**C for now, and B when the time comes.** The sealed game in master proposal 20
is already most of the way to the artefact a fast game would produce, so building
that first makes this much smaller later — and it is worth knowing whether pace
is really the complaint before adding a second way for a game to exist forever.

---

## Summary

| | question | blocks | recommendation |
|---|---|---|---|
| **D1** | Where do words live? | 30 | A messages contract, scoped small — or nothing, honestly |
| **D2** | Are public comments permanent? | 30 | Owner-only first; it is the reversible direction |
| **D3** | Do you show presence? | 30 | Derived last-seen. No green dot |
| **D4** | How does a wager know who won? | 31, 32's pot | Mutual settlement, after `time!`, and do it last |
| **D5** | What does a fast game give up? | 33 | Not yet; build the sealed game first |

**Nothing in steps 0 to 3 of [`03-PLAN.md`](03-PLAN.md) waits on any of this** —
that is the two defects, the byte budget and the whole navigation batch, which is
most of what the testers asked for.
