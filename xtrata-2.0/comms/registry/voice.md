# Xtrata voice

Derived from the hand-written X-Chess posting board
(`X-Chess/shots/tweets.html`), which is the best corpus of real Xtrata posts
that exists. When in doubt, go and read it.

---

## Terminology: which chain, and how to say it

This is the one category of mistake that costs credibility with the people
whose opinion matters most, because they will spot it instantly.

**Stacks is its own chain.** It is anchored to Bitcoin and inherits Bitcoin's
security. It is mined by Bitcoin through Proof of Transfer, which is unique to
Stacks. Xtrata inscribes to Stacks. Bitcoin is the settlement layer underneath,
not the place the bytes live.

The repo already states this correctly, in `scripts/gen-announcement.mjs`,
which draws the stack as three layers:

> XTRATA, the data layer, **writes into**
> STACKS, the execution layer, which **settles to / is anchored by**
> BITCOIN, the settlement layer

Say:

- **on Stacks**
- **on chain** (always safe, and usually the best choice)
- anchored to Bitcoin
- settles to Bitcoin
- secured by Bitcoin
- mined by Bitcoin through Proof of Transfer
- inherits Bitcoin's security

Never say:

- ~~on Bitcoin~~
- ~~inscribed on Bitcoin~~
- ~~lives on Bitcoin~~
- ~~a move on Bitcoin~~

`on Bitcoin` is rejected by the linter. If a post is genuinely about Bitcoin L1
itself, set `"allowOnBitcoin": true` on it and say why in the note.

**The X Chess corpus gets this wrong in five places** and it is otherwise the
best writing we have, so it is worth naming them rather than trusting the file
wholesale: "a move on Bitcoin", "Chess on Bitcoin, on a phone", "a full game on
Bitcoin", "a web page that lives on Bitcoin", and "inscribed on Bitcoin". Use
those posts for their structure and rhythm, and fix the chain word.

---

## Hard rules, enforced by `lint-post.mjs`

1. **No em dashes.** Use a full stop. Two short sentences beat one long one.
2. **No semicolons.** Same reason.
3. **No hashtags. No emoji.**
4. **280 characters per post**, counted per post and not per thread.
5. **Every post that names a product carries its link**, except posts inside a
   thread where the link is in the first or last post.
6. **No hype vocabulary.** Banned: revolutionary, game-changing, unlock,
   empower, seamless, cutting-edge, leverage, disrupt, unleash, supercharge,
   next-generation, paradigm.

A failing post gets rewritten. The linter is not advisory.

---

## How it actually sounds

Short declarative sentences. One idea per line. The mechanism stated plainly,
with no adjectives doing the work a fact should do.

> You do not join X Chess. You open a board.

> The board is not hosted. It is inscribed.
> The artefact is the application.

> It stores no position. No turn. No winner.
> Just a list of four character strings and the arithmetic to read it.

---

## Patterns that work

**Subtraction.** Describe what was removed. It is more legible than describing
what was added, because the reader already knows what the removed thing costs.

> Imagine boiling chess.com down until nothing is left but the chess.
> Delete the servers. Delete the accounts. Delete the referee. Delete the company.
> It still works.

**Answer the sceptic inside the post.** Do not wait to be asked.

> Self sustaining is a strong claim so here is the mechanism.
> Opening a game costs a fee. That fee funds a reserve. The reserve pays the gas of players who hold nothing.

**Make it impossible rather than unlikely.** Trust claims land when they rest
on mechanism, not promise.

> The board is open to the world and closed to me. I cannot quietly play both colours.
> This makes it impossible rather than unlikely.

**Admit what is hard.** The proudest line in the corpus is stated as a personal
opinion, which is why it reads as true.

> That is the bit I am proudest of.

---

## Patterns to avoid

- Announcing a feature without the mechanism underneath it.
- Any sentence that would survive being copied onto a competitor's site.
- Numbers without a date or a source.
- Threads longer than they need to be. Stop when the argument is finished.
- Reacting to news for the sake of appearing current.

---

## First person

The account writes as Jim, singular, not as a company "we". The corpus uses
"I" for opinions and mechanism-ownership, and it is the reason the posts read
as a person rather than a brand.

Exception: announcements of shipped work can use plain third person. "X Chess
is live." carries no pronoun and needs none.

---

## Fact-check annotation

The X-Chess board marks posts whose claims were not confirmed:

> UNVERIFIED. Only true if there is no seed import step in front of it.

Carry this forward. Every queued post has a `verified` field:

- `"verified"` — every claim traces to a signal or a registry field
- `"unverified"` — carries a claim nobody checked, and `verifyNote` says which

An `unverified` post can still be queued. It cannot be approved without the
note being resolved first, and the board shows it in red.
