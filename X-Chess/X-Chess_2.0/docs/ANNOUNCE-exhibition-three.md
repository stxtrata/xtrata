# Exhibition Three: post templates

Drafts for `@XtrataLayers`, written to the rules in
`xtrata-2.0/comms/registry/voice.md`. No em dashes, no semicolons, no hashtags,
no emoji, 280 characters a post, and **on Stacks** rather than on Bitcoin.

Every post below is under 280 and passes the banned-vocabulary list.

## Say this, not that

The one claim that will cost credibility with developers is the one everybody
will reach for first.

**Do not say the AI runs on chain.** It does not. The model that chooses moves
runs off chain, because weights cannot be inscribed. Anybody technical will
work that out in about four seconds, and if the post claimed otherwise the rest
of it stops being believed.

Say instead: **everything that decides a game is on chain.** That is true and
it is checkable.

| on chain | not on chain |
|---|---|
| the board itself, inscription 3014 | the model that picks the move |
| the engine every player uses, 2991 | |
| each character's instructions, 2995 to 3000 and 3010 to 3013 | |
| the manifest naming players, pairings and rounds | |
| every move, as a transaction | |
| the rules each game committed to | |

Lead with the mechanism. The interesting thing is not that AI is playing chess.
It is that a stranger can rebuild the entire result without asking anybody.

---

## Thread: the invitation

**1.**

```
Ten AI players. Ninety games. Every move a transaction on Stacks.

Exhibition Three starts today, on a board that is itself an inscription.

https://xtrata.xyz/i/3014
```

**2.**

```
Each player is an inscription.

Its instructions were written, budgeted to 1200 characters, and sealed on chain
before it played a move.

Nobody can edit a character mid tournament. Not me either.
```

**3.** The sceptic, answered before being asked.

```
The honest part. The model choosing the moves runs off chain. I cannot inscribe
weights and will not pretend otherwise.

What is on chain is everything that decides a game. The engine, the characters,
the pairings, the rules each game committed to, and every move.
```

**4.**

```
So you do not have to trust the table.

Fetch the manifest. Fetch the characters it names. Replay the moves. Check each
game against the rules hash it committed to.

If your replay disagrees with my standings, mine is wrong.
```

**5.** The constraint. This is the most interesting thing here for developers.

```
Something I did not design for. A game commits its two players and nothing that
says which tournament it is.

So one pair gets one ranked game, ever. Two exhibitions used all thirty of
theirs. The third needed a new rule just to be possible.
```

**6.**

```
Three of the ten search deeper than the rest.

It is declared in the manifest and the board marks it declared, because nothing
on chain can prove it.

Every other number on that table was recomputed. That one is my word, labelled
as my word.
```

**7.**

```
Board, engine, characters and manifest are all inscriptions you can open and
read.

https://xtrata.xyz/i/3014
```

---

## Standalone posts

Pick one. Do not post all of them.

**For developers.**

```
An application that is an inscription, running a tournament whose result you can
recompute from chain without asking me for anything.

Ten AI players, ninety games, every move a transaction on Stacks.

https://xtrata.xyz/i/3014
```

**Subtraction, which is the pattern that works best in this corpus.**

```
No server. No account. No referee. No company.

Ten AI personalities playing ninety games of chess, and a board that is an
inscription rather than a website.

It still works.

https://xtrata.xyz/i/3014
```

**The one-liner.**

```
The chess board is not hosted. It is inscribed.

The players are not accounts. They are inscriptions.

Ninety games start today.

https://xtrata.xyz/i/3014
```

**For the trading crowd, without hype vocabulary.**

```
Ten AI players with their own wallets, signing their own moves, playing for a
table nobody can edit.

Ninety games on Stacks. Watch it settle in real time.

https://xtrata.xyz/i/3014
```

---

## Reply templates

Keep replies shorter than the post they answer.

**"Is the AI on chain?"**

```
No, and I would not claim it. The model runs off chain because weights cannot be
inscribed.

Its instructions are on chain, the engine it uses is on chain, and every move it
makes is on chain. That is the part you can check.
```

**"What chain?"**

```
Stacks. Anchored to Bitcoin and mined by Bitcoin through Proof of Transfer.

The bytes live on Stacks. Bitcoin is the settlement layer underneath.
```

**"Can I play?"**

```
Yes. Open the board and open a game. There is no signup because there is nothing
to sign up to.

You need a Stacks wallet with a little STX, because a move is a transaction.

https://xtrata.xyz/i/3014
```

**"Is it open source?"**

```
Better than open source for this purpose. The running application IS the source,
inscribed at 3014. What you audit is what executes.
```

**"How do I verify a result?"**

```
Read the manifest, which names every player, pairing and round. Replay each
game's moves through the rules it committed to. Compare to the standings.

Nothing in that loop asks me for anything.
```

**"Aren't they just playing the engine's top move?"**

```
No. The engine ranks every legal move and the character chooses among them by
style.

That is why the same engine gave one player six points and another two in the
first exhibition.
```

**"What does a game cost?"**

```
About a hundredth of a STX to open, and four hundred microstacks a move.

A ninety game tournament is a few STX in total.
```

**"Why does this matter?"**

```
Because the result does not depend on me being honest.

Take the inscriptions, replay the games, get the same table. That is a different
kind of claim from a leaderboard on a website.
```

**"What happens when it finishes?"**

```
The manifest stays on chain and so does every game. The standings are derivable
forever by anybody who wants to check them.

Nothing expires because nothing is hosted.
```

---

## Verification status

Confirm before posting. Marked the way the comms harness marks facts.

| claim | status |
|---|---|
| board inscribed at 3014, 202,675 bytes | **verified**, fetched back and compared byte for byte |
| character sheets at 2995 to 3000 and 3010 to 3013 | **verified**, parsed by the on-chain validator at 2994 |
| engine at 2991 | **verified**, fetched and executed by the runner |
| ten players, ninety games, eighteen rounds | **verified** from the schedule |
| four hundred microstacks a move | **verified**, game 15 paid exactly that for 23 moves |
| about a hundredth of a STX to open | **verified**, the contract's open fee |
| manifest on chain naming every pairing | **verified.** Tournament **3016**, ninety games, all ninety checked against the rules each committed to |
| "starts today" | **verified.** Round one played out on 2026-08-19, five games, five checkmates |
| three players search deeper | **verified as declared.** 3016 declares the ladder. Nothing on chain can confirm it, and the board marks it declared |

Every post is now postable.

**Do not cite 3015.** It is the same bytes inscribed with a dependency on 3001,
which `resolveTournament` reads as a revision, so it answers to Exhibition
Two's id. The tournament is **3016**. If a reply needs the manifest link it is
`https://xtrata.xyz/x/3016`.

## Round one, if a post wants a result

Five games, five checkmates, no draws and no forfeits. Thirty-two to
sixty-eight signed transactions a game, and 0.035 STX for the round.

The result worth citing is Plumb beating Oblique. Plumb won the first
exhibition and plays on the house engine. Oblique finished joint last and was
given the deepest search on purpose, so that a ladder decided by depth would
show up as a table turning upside down. It did not turn.

That is one game and it should be said as one game.

The first exhibition's six points to two spread is real and is the honest answer
to the engine question. Twenty-one games, one engine, and the table still spread.
