# Playing a house player from the Play tab

A person picks Plumb, presses one button, and plays a game of chess against it.

**Part of this is now built — see "What is built" below.** A person can take a
seat in a game the runner plays, with no board change and no inscription. What
is still not built is the part that makes it a FEATURE rather than a command:
nobody is watching the chain for challenges, so somebody has to run the harness
for the house side.

The rest of this document is the original plan, kept because the question it
turns on has not changed.

## What is built (2026-08-20)

`kind: 'human'` has been in the manifest format since it was written and nothing
read it. The runner now does, and it means: no character inscription to fetch,
no key expected on this seat, and — the point — this runner never moves for it.

Two ways in. A tournament manifest can name a person as an entrant, or a single
game can be set up with no manifest at all:

```
node harness/wizards/run-tournament.mjs game \
  --white plumb --black-human SP3JNSE… --black-name Jim --live
```

That opens a game committing Black to your address, so only you can play it,
and answers as Plumb whenever it is White's turn. Between your moves it waits:
`waitForPerson` polls every thirty seconds for up to a day, says so occasionally
so a silent terminal is not mistaken for a hung one, and gives up cleanly rather
than running for ever. The game is untouched by giving up and resumes if the
command is run again.

Three things it deliberately refuses:

* **Both seats human.** The runner would sit between two people reading the
  chain and never submitting, which looks exactly like a runner that is working.
* **A `.btc` name.** The board resolves BNS; this does not. The seat is
  committed at the moment the game opens and cannot be corrected, so a lookup
  answering with a stale address would put a stranger in the game permanently.
* **A key on a human seat.** `personSeat` takes the entrant alone and is never
  handed the fleet, so there is no argument by which a key on disk could become
  a key this runner signs that seat with. The manifest outranks the keyring.

What this does NOT change: somebody still has to run the command, and that
somebody needs the house player's wallet. It is a way to play Plumb, not a
service that answers challenges. Everything below is still what it would take to
make it one.

## The original plan

## The question that decides everything

**Who signs the house player's moves?**

Every move is a transaction. The house side needs a wallet, and a wallet needs
somebody running something. That is not a UI detail — it decides whether this
feature is a game the player runs, or a challenge somebody else answers.

Three shapes, and they are genuinely different products.

### A. The player runs both sides

What `docs/manual/play-a-character.html` already describes: open a game with
White named as yourself and Black left as `anyone`, then run a script that
fetches the sheet from chain, asks your own model, and submits.

* **Works today.** Nothing to build. The one-pager is the manual.
* **You supply the intelligence**, which is the interesting part — two people
  running Plumb on different models get recognisably the same player making
  different decisions.
* **`anyone` means anyone.** A stranger can play the house's moves in your game.
  For a casual match that is a curiosity; for anything else it is wrong.
* Needs a script, a model and a key. That is a developer, not a player.

### B. The player opens a challenge and OUR runner answers

The one most people mean by "play against Plumb". You press a button, a game
opens naming you and a house wallet, and some time later Plumb moves.

* **The contract already has the mechanism.** `open-sponsored-game` pays a
  bootstrap to the OPPONENT, and `sponsor-both` covers both sides — so a
  challenge can arrive with the house's gas already paid, by the challenger, at
  the moment they open it. Nobody has to trust anybody for their opponent to be
  able to move.
* **It needs a director watching the chain.** That is the real cost and it is
  not code: it is somebody's machine, somebody's key, somebody's model bill,
  running indefinitely. `run-tournament.mjs` plays a NAMED set of games from a
  manifest; answering arbitrary challenges is a different loop.
* **It can stop.** A house player that stops answering leaves a game half
  played and a person waiting, and the board has no way to say which. Game 15
  sat for seventy hours in exactly that state during exhibition two.

### C. Both, with the board saying which

Open the challenge either way, and let the board show whether anybody is
answering it. This is the honest version and probably the destination, but it
depends on B existing first.

## The recommendation

**B, opened as a sponsored challenge, with A kept as the documented fallback.**

The sponsorship path is what makes B defensible rather than a favour: the
challenger pays for the house's gas when they open the game, so running the
director costs a model bill and nothing else. That is a bounded, statable cost
rather than an open one, and it can be turned off by the house simply not
answering — which the board can then say out loud.

## What already exists

Most of this is a form and a loop, not new machinery.

| | |
|---|---|
| the ten characters | inscribed, 2995–3000 and 3010–3013 |
| the engine | 2991, hash-pinned |
| the prompt protocol | **3017** — what to ask a model and what its reply means |
| sponsorship | `open-sponsored-game`, `open-sponsored-both`, already in the Play tab |
| the wallets | the house players hold their own, and already play |
| picking a move | `chooser.mjs`, with the transport this needs |

So the board can already fetch a sheet, build the exact prompt a tournament
uses, and read the answer back. What it cannot do is choose an opponent from a
list and open a game against them in one press.

## Three things that would go wrong

### 1. A challenge nobody answers looks identical to a slow one

The board shows "waiting for Black" whether the director is running, stopped, or
was never going to answer this particular challenge. That is the same failure as
game 15 and it is worse here, because the player did not agree to it with a
friend — they pressed a button on a board that implied somebody was home.

**So the house has to declare availability somewhere a reader can check**, and
the board has to show it. The obvious form is an inscription the house updates:
which characters are answering, and a height it was last confirmed at. Stale is
then visible rather than indistinguishable from busy.

### 2. Anyone can open a game naming a house wallet

Nothing stops it now and nothing should — a permissionless contract is the
point. But it means the director's loop cannot simply play every game its
wallets are named in: that is an open invitation to drain its model budget, and
to make it play a thousand games nobody watched.

**The manifest pattern already solves this** and should be reused rather than
replaced: the house answers challenges it can see a reason to answer — a fee
paid, a sponsorship attached, a rate limit per challenger — and the rule is
published rather than guessed at.

### 3. Rated or not is not a small question

A ranked game against a house player enters the same Elo pool as the
exhibitions. Ten characters with a hundred casual games each would swamp a
tournament's worth of results, and the ratings on the Leaderboard would stop
describing the thing they were built to describe.

**Default unranked, and mean it.** `ranked` is committed before a move is
played, so this is decided at the moment the game is opened and cannot drift.
If ranked challenges are ever wanted they want their own pool, not this one.

## What the Play tab needs

Small, once the above is decided.

* An opponent picker listing the ten, with the face, the style line and the
  sheet link — the same shape as the field list the Tournaments tab now draws
  while it loads. All of it is already on chain and mostly already fetched.
* Colour choice, or random.
* `sponsor-opponent` preselected, with the cost shown, and an explanation that
  it is what lets the house move.
* Unranked by default, with ranked disabled and a reason rather than hidden.
* After opening: the game, and what the board knows about whether anyone is
  answering.

## What the director needs

A loop, not a script. `run-tournament.mjs` plays a named set from a manifest;
this watches for games naming its wallets, decides which to answer by a
published rule, and plays them one move at a time forever. It should reuse
`director.mjs` from 3017 rather than reimplementing the prompt, for the reason
that module exists at all: a house player answering a challenge should be given
exactly what a house player in a tournament is given, or it is not the same
character.

## The one-pager, when this lands

`docs/manual/play-a-character.html` currently teaches shape A, because A is what
works today. When B exists, the page should lead with the button and keep A as
"or run it yourself" — the audience for A is people who want their own model in
the loop, and that is a smaller and more technical audience than the page
currently addresses.

## Order of work

1. Decide availability: how the house says which characters are answering, and
   where a reader checks it. Everything else is shaped by this.
2. The director loop, run against a single hand-opened challenge before any UI
   exists.
3. The Play tab picker, once a challenge is reliably answered.
4. Rewrite the one-pager's opening.
