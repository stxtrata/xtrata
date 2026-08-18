# Manifests, and how the board finds them

A manifest is a plain-text document inscribed on Xtrata. There are two kinds so
far and the mechanism is the same for both, so a third costs configuration
rather than code.

| kind | header | says | inscribed by |
| --- | --- | --- | --- |
| tournament | `X-CHESS-TOURNAMENT/1` | the entrants, and which game id is which pairing | the organiser |
| profile | `X-CHESS-PLAYER/1` | what an address calls itself | the address itself |

## The problem

Nothing indexes them. Xtrata can tell you what inscription 3001 is; it cannot
tell you which inscriptions are tournaments.

Nor can dependencies help, though it looks as though they should. The core
exposes `get-dependencies` and `get-parents` and **nothing that asks what depends
ON a token**. A chain of manifests, each naming the one before it, can therefore
be walked backward from one you already hold and never forward to one inscribed
after the board was. The board is itself an inscription, so "the newest" is
exactly the question it cannot answer that way.

## The answer: a wallet per group

**What points forward is an address.** A wallet's contents can grow after the
board is permanent. Nothing else here has that property.

So a group of manifests is defined by the wallet they are sent to, and the board
needs to know one address per group:

```
tournaments   the director's wallet
profiles      a wallet players send their own manifests to
```

Finding a group is then one API call — the wallet's Xtrata NFT holdings, newest
first — followed by a read per candidate. See `packages/chain/directory.ts`.

### Sending a manifest to a directory

Inscribe it, then transfer it to the wallet for its group. When the Xtrata core
supports inscribing directly to a recipient, that becomes one step and the
transfer disappears.

A manifest that is never sent is not lost — it still reads by number, and the
tab still accepts one typed in. It is simply not listed.

## Holding finds it; creating proves it

Anybody may send an NFT to any address without asking. So a document sitting in a
wallet is a **claim**, and the board says so:

* **official** — minted by that wallet. A transfer cannot fake this.
* **held** — in the wallet, inscribed by somebody else. Listed, drawn with a
  dashed border, and the tooltip says why.

The board deliberately does not decide from this whether a tournament is
legitimate, because a better answer already exists. `checkGames` verifies every
pairing against the rules hash the game committed to on chain, so a fabricated
manifest reads `unverified` however it arrived and scores nothing. The directory
only decides what is worth READING.

This is the same split `packages/chain/players.ts` draws for profiles, where it
does more work: a profile is only believed when the document's address matches
the inscription's creator, so a name cannot be bought, sold or gifted.

## Caching

An inscription is immutable, so a document that parsed once parses the same way
forever. Both the text and the fact that an inscription is *not* of a given kind
are remembered in local storage, and only the holdings list is re-read.

The kind is part of the cache key. An inscription that is not a tournament may
perfectly well be a profile, so one shared "not a manifest" marker would teach
each directory to skip the other's.

## The chain, kept as the cheap half

`inscribe-manifest.mjs --after <id>` adds the previous manifest as a dependency
alongside Genesis. It cannot find the newest — see above — but it buys
independence from any wallet: given one manifest, a reader can walk back through
every earlier tournament without being told an address, and without the organiser
still holding anything.

Two indexes pointing opposite ways survive the loss of either.

**Decide it before inscribing.** A dependency cannot be added afterwards.
Manifests 2993 and 3001 are not chained to each other because the idea arrived
after both were permanent.

## See also

* `ops/DECISIONS.md` — ADR-0017, with what was checked and what was rejected
* `packages/chain/directory.ts` — the mechanism
* `packages/chain/players.ts` — why a profile is checked against its creator
* `packages/protocol/tournament.ts` — `checkGames`, which is what actually decides
