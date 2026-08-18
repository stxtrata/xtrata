# Tournament three

Exhibitions one and two answered "can these characters play chess at all". They
can: nine games under the engine produced eight checkmates and no repetition
draw, against six games under the one-ply annotation that produced none.

Three is for the things that are still unproven, and the largest is not about
chess.

## The point: run it entirely from chain

Everything that defines a tournament is now inscribed, and none of it is being
read.

| | inscribed | what the harness actually uses |
|---|---|---|
| engine | 2991 | **2991, fetched and executed** |
| characters | 2995–3000 | `harness/wizards/personalities.mjs` on this machine |
| manifest | 2993, 3001 | nothing — the runner has its own schedule |

So the claim "these six characters played" rests on a file nobody else can see.
Tournament three should read the characters from chain, which is the last step
to a tournament a stranger can fully reconstruct: fetch the manifest, fetch the
entries it names, fetch the engine, replay the games, and check every result.

**The work:** `run-tournament.mjs` builds its field from `PERSONALITIES`. It
should build it from a manifest's `entrants[].entry` ids, parsing each with the
inscribed validator at 2994. `personalities.mjs` becomes the source for
*generating* sheets, not for playing.

## Inscribe the manifest FIRST

Both previous manifests went up after their games had started, so both were
born final and the revision window has never once been exercised. Three should
inscribe before a single game opens, which:

- proves the window works, and that a correction lands while it is open;
- lets the manifest carry `entry` ids, which neither existing one does;
- means every game is verifiable from the moment it is played, rather than
  reconstructed afterwards.

Open the games only after the manifest is on chain and checked.

## The variable worth changing: the model

Everything since round 2 has run on `claude-sonnet-5`, so there is a 30-game
baseline to compare against — and the entries themselves name `claude-opus-5`,
which has never actually played. Running three on Opus answers whether the extra
tier buys anything now that the engine handles the chess, which was unanswerable
when the players could not convert a won game.

**One confound, and it must be stated rather than hidden.** The inscribed sheets
have the same words as the prompts that played but lose the paragraph breaks —
the entry format joins continuation lines with a space. So reading characters
from chain changes the prompt slightly at the same time as the model changes. If
the results move, that is two causes, not one.

Either accept it and say so, or run one round on Sonnet from chain-sourced
characters first to isolate the whitespace, then switch to Opus. The second is
one extra round and removes the ambiguity entirely.

## Format: single round robin

Fifteen games, not thirty. Two was nine games and told us as much as one's
twenty-one did; length is not what has been informative. Fifteen keeps every
pairing while costing about half.

Roughly 0.3–0.6 STX at recent rates, and the six wallets hold 1.1–1.7 STX each.

## What it would settle

- **A tournament nobody has to trust.** Manifest, characters and engine all on
  chain, results derivable by anybody.
- **Whether the revision window works** when it is actually open.
- **Whether Opus plays differently** from Sonnet with the same characters and
  the same engine, against a real baseline.
- **Whether the whitespace difference matters**, if the extra Sonnet round is run.

## Still unmeasured, and not fixed by this

The **one-ply control arm has never completed** — killed three times by crashes
and a branch switch. Everything claimed about the engine's effect rests on the
on-chain record rather than a controlled comparison. That is lab work, not a
tournament, and it should be run in `lab.mjs` where it costs nothing.

**Wager's entry is self-defeating.** It twice promoted to a knight instead of a
queen and drew a game it was winning, because "hardest to understand" reads to
the model as "throw the win away". That is arguably the entry working. If it is
rewritten, the old sheet at 2998 stays on chain and the new one should be a
separate inscription — the record of what played must not be edited.
