# Build the Tournaments tab

Repo: `X-Chess/X-Chess_2.0`. Run `npm test` before and after; it should stay green
(1,298 passing at the time of writing).

## What you are building

A sixth tab in the X Chess board — `Play · Game · Explore · Leaderboard ·
Profile` gains **Tournaments** — that takes a tournament inscription id, reads
everything from chain, and shows:

1. **Standings.** Points, played, W/D/L, ordered by the existing `standings()`.
2. **The rounds**, in order, each with its games and results.
3. **Per-game verification.** Whether each game's on-chain rules hash actually
   matches the pairing the manifest claims.

Default to inscription **2993**, and let a reader type another id.

## Read this first, and do not reinvent it

Everything below exists, is tested, and is the thing to call:

| What | Where |
|---|---|
| Parse a manifest, standings, rounds, `addressOf` | `packages/protocol/tournament.ts` |
| Walk revisions to the root, creator check | `resolveTournament` in the same file |
| Compute a game's rules hash | `rulesHash` in `packages/protocol/canonical.ts` |
| Replay a game log to a result | `replay` in `packages/replay/replay.ts` |
| Rules for a ranked pairing | `normaliseRules({...DEFAULT_RULES, white, black, ranked: true})` |
| Reading the contract, paging entries | `packages/chain/client.ts` — copy how Explore does it |

`resolveTournament` takes an injected `Inscribed` reader (`text`,
`dependencies`, `creator`) so it is testable without a network. Write the
adapter that fetches from `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3`
via `get-chunk` / `get-inscription-chunks` / `get-dependencies` /
`get-inscription-creator`.

## The verification is the point

A manifest **claims** a pairing. The chain holds the rules hash the game
committed to. For each game: build the rules from the claimed white and black,
hash them, compare to `rules-hash` on the game row. Show verified games plainly
and unverified ones as unverified — never repeat a claim as though it were
checked.

This matters concretely: the Leaderboard currently reports *"21 verified ranked
games, with 7 candidates failing verification"* because nothing on chain links a
wallet to a player. The manifest is what fixes that, and only if you check it.

## Names

Display order: **BNS name if the address has one, otherwise the manifest's
name for that entrant, otherwise the shortened address.** The manifest is the
fallback that makes a board readable — it is why `Plumb` can appear instead of
`SP1T...9YYHRX`. There is existing BNS lookup in the codebase; find it rather
than adding a second one.

## Constraints that will bite you

**Bytes are permanent.** This board gets inscribed, so every byte is paid for
once and kept forever. `packages/ui` is at **103,057** against a **129,500**
ceiling in `tests/artifact/budget.test.ts` — about **26,000 bytes of headroom**,
which is comfortable for a tab. If you do cross it, raise the row deliberately
and say why in the diff rather than nudging it. The real limit is the whole
artefact fitting 32 chunks of 16,384 bytes (currently ~143 KB of 524 KB), and
you are nowhere near it.

**No server, no build-time data.** Everything is fetched at runtime by a page
that could be running from an inscription.

**`shell.ts` CSS is a template literal.** A backtick anywhere in it — including
inside a comment — ends the string. There is a note in the file saying so
because it has already happened twice.

**Theme tokens.** Every colour must exist on bare `:root`; redefine only inside
`@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }` and
`:root[data-theme="dark"]`. A colour defined only inside a media block renders
one theme's text on the other theme's ground.

**Hiro rate limits are real and you will hit them.** Pace reads and back off on
429. Two specifics learned the hard way:

- `/extended/v1/address/{addr}/balances` is **deprecated and throttled to
  almost nothing** — it returns 429 regardless of key. Use
  `/extended/v2/addresses/{addr}/balances/stx`, where the figure is at
  `body.balance`, not `body.stx.balance`.
- Do not replay unbounded logs for many rows at once. Explore caps this with
  `EXPLORE_ENTRY_LIMIT = 200`; a tournament of 21 games with a 339-ply game in
  it will punish a naive loop.

**Game ids do not follow schedule order.** Three games open concurrently and
whichever transaction lands first takes the lower id. Never infer a pairing from
position in a list — that error put games 13 and 15 the wrong way round and
silently dropped two results from a standings table that looked complete.

## Suggested shape

- `packages/ui/tournaments.ts` — the view, following how `explore` is built in
  `app.ts`.
- A chain adapter for Xtrata reads, near `packages/chain/`.
- Tests in `tests/ui/` with a fake `Inscribed` and a fake chain, plus a
  budget-row update if you cross the ceiling.

Round structure can be a simple grouped list. A bracket drawing is not required
for a round robin and would be misleading — this format has no elimination tree.
If you add a visual, make it encode something true: rounds are a real sequence,
so numbering them is honest; colouring them is not.

## What "done" looks like

- Typing `2993` shows six entrants, 21 games across 7 rounds, standings, and a
  verified/unverified mark per game.
- A manifest that fails to parse, or names a non-entrant, is shown as broken
  with the reason — not rendered as blank cells.
- A revision id resolves to its root and reports the root as the tournament id.
- `npm test` green, `npx tsc --noEmit` clean, and the byte budget either unchanged
  or raised with a reason.

## Context you may want

The tournament being displayed is six AI personalities playing a double round
robin, each with its own wallet, using a chess engine inscribed at 2991. The
manifest at 2993 was derived by inscribed code at 2992, so it is reproducible
rather than asserted. `harness/wizards/TOURNAMENT.md` has the fuller story.
