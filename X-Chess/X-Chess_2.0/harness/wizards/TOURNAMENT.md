# The exhibition tournament

**Six AI personalities, each with its own mainnet wallet, playing a round robin
of ranked games on the canary contract while anybody with the board watches.**

A Director holds the API key and plays every character. The characters hold the
wallets and sign their own moves. Those are deliberately different jobs, and the
rest of this document is mostly about why.

Status: **planned, not built.** What exists today is the fleet
(`harness/wizards/`), which plays scripted games with three wallets.

---

## The boundary that shapes everything: where the API key lives

**The key never enters the artefact.** Not in the inscribed page, not in the
gates page, not in anything served through the Xtrata runtime.

This is not caution, it is the only arrangement that works:

* **An inscribed page cannot be patched.** A page that collects credentials and
  turns out to handle them wrongly is wrong forever. Everything else in this
  project can be re-inscribed at a new version; a key already typed into the old
  one cannot be un-typed.
* **The browser cannot make the call anyway.** The Anthropic API does not permit
  direct browser calls without a flag that exists to let you shoot yourself, and
  a key in page JavaScript is a key in every viewer's devtools and every proxy
  in between.
* **The board's whole claim is that it needs no server.** A tournament that
  needed one to hold keys would undo that for the one feature that least needs
  to be inscribed.

So **booking a tournament means running the Director yourself**, with your own
key, on your own machine. Concretely:

```
harness/wizards/.env.wizards      mode 600, gitignored, already how wallet keys work
  ANTHROPIC_API_KEY=sk-ant-...
```

The same file, the same permissions, the same `scrub()` on anything heading for
a log — `KEY_SHAPED` already redacts 64-character hex; it gains a rule for
`sk-ant-` prefixes. A future user does exactly what you do: their key, their
file, their machine, and nothing about it travels.

**What the artefact does instead** is what it is good at: read the games, replay
them, show the standings. A spectator needs no key and no permission, because
every result is derivable from chain by anybody. That separation is the feature,
not a limitation of it.

---

## The Director plays; the characters sign

The fleet has a rule, asserted in `tests/wizards/wizards.test.ts`:

> **The Director never plays.** A wallet that both holds the money and signs the
> experiments is one mistake away from being the only wallet.

A Director that chooses every character's move looks like a violation of that
and is not, because the rule is about **signing**. Split it in two and both
halves stay true:

| | Director | Character |
|---|---|---|
| holds the API key | ✅ | ❌ |
| decides the move | ✅ | ❌ |
| **signs the transaction** | ❌ | ✅ |
| holds the float | ✅ | a small one |

So a leaked Director key still costs the float and the API key, and still cannot
put a move on chain — the character wallets do that, and they hold almost
nothing. A compromised character can play bad chess in one game.

This is worth keeping even though one process holds both, because the day
somebody runs the characters on separate machines, nothing has to change.

---

## How a move gets chosen, and why it can never be illegal

The board already generates legal moves. `replay()` returns `fen` and
`legalMoves: string[]` for the exact position, from the same engine that will
referee the result.

```
position + history + legalMoves + the character's prompt
        -> model
        -> a move, which MUST be one of legalMoves
        -> the character's wallet signs it
```

**The list is a closed set, checked after the model answers.** A reply outside
it is refused and re-asked, and a character that cannot produce a legal move
after a few tries forfeits rather than broadcasting a guess. So the worst a
model can do is play badly, which is a personality, not a bug.

That constraint is doing a lot of work. Without it an LLM will confidently
submit a move that is illegal in the position, replay will skip it, and the
character will have paid a fee to do nothing — which is precisely the thing the
board's eligibility gate was rebuilt to stop humans doing.

---

## The roster

Six, because six is what the nonce constraint below wants. Each is a system
prompt; the names are invented and none of them refers to a real person, a real
engine, or a real AI product.

| character | plays | style |
|---|---|---|
| **Gambit** | white-ish | 1850s romantic. Sacrifices for the attack, hates a quiet position |
| **Ledger** | either | material above all. Takes everything, trades into endgames |
| **Mason** | either | positional. Pawn structure, outposts, the slow squeeze |
| **Wager** | either | high variance. Complications on purpose, unsound if it is interesting |
| **Plumb** | either | cautious. Solid, prophylactic, plays for the draw and takes the win if offered |
| **Oblique** | either | contrarian. Avoids main lines and book moves on principle |

The style is the whole personality. Two characters given the same position
should visibly want different things, or the tournament is six wallets playing
one player.

---

## The shape, and the constraint that chose it

**A wallet in two live games collides with its own nonce.** That is not
theoretical here: three funding transfers signed together took the same nonce
and two were dropped. So **no character may be in two games at once.**

Six characters makes that fall out for free:

* a **round** is 3 games in parallel, every character in exactly one
* a **single round robin** is 5 rounds, 15 games
* each character plays 5 games

At `--pace 45` and a typical 45-ply game, a round is about half an hour and the
whole event runs roughly three hours. Slow enough to watch, and nowhere near the
rate limit that killed the first live run.

**Ranked**, so the tournament lands on the public leaderboard rather than beside
it, and anybody can re-derive the standings from chain.

**One game opened with `open-sponsored-both`**, which the contract documents as
being for exactly this — "exhibitions, demos, events, onboarding and
tournaments, where neither player should have to think about gas". It is also
the only way to exercise matrix row 4, the contract-principal post condition,
which has never run anywhere. An exhibition is an honest place to run it.

---

## What it costs

At the open fee you set on 2026-08-15 (0.01 STX) and a 3,000 µSTX miner fee:

| | |
|---|---|
| open a game | 0.013 STX |
| one move | 0.003 STX |
| a 45-ply game | **0.148 STX** |
| 15 games | **~2.2 STX** |
| the sponsored game, extra | +0.26 STX |

The fleet holds 5.96 STX, so the whole event fits with room for a second one.
At the old 1 STX fee it was 15 STX in opening fees alone, which is why this was
not worth planning last week.

Model calls are the other cost and are not on chain: roughly 45 per game, 675
for the tournament, each carrying a position and a legal-move list.

---

## What gets built, in order

1. **`personalities.mjs`** — the roster as prompts. Pure data, testable, no
   network.
2. **The chooser** — `chooseMove({ fen, legalMoves, history, character })`.
   Bundles `packages/replay` the way `loadProtocol()` already bundles the rules
   codec, so the harness and the board share one engine. Validates against
   `legalMoves` and refuses anything outside it.
3. **`ANTHROPIC_API_KEY` handling** — same file, same mode, `scrub()` extended
   to `sk-ant-` so it cannot reach a log.
4. **The tournament runner** — pairings, rounds, the nonce rule as an assertion
   rather than a convention, resume after a failure (a tournament that dies in
   round 3 must not replay rounds 1 and 2, which are on chain forever).
5. **Standings** — derived from chain, not from the runner's memory. If the
   runner's record and the chain's disagree, the chain is right.

Each of 1, 2 and 4 is independently useful: the roster with no chooser is a
scripted tournament, and the runner with no LLM plays any of the ten existing
game plans.

---

## Open questions

* **How many rounds.** Single round robin gives uneven colours — five games
  cannot split three and two fairly across six players. A double round robin is
  30 games, ~4.4 STX, and about six hours. Fair colours, or a shorter event.
* **What a character does when the model is unavailable.** Forfeit, fall back to
  a coded move, or pause the tournament. Pausing is probably right for an
  exhibition and wrong for an unattended run.
* **Whether spectators get a tournament page** or just the Explore tab with a
  filter. The standings are derivable either way; this is only about whether
  somebody has to know that.
