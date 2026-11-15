# Artists release their own music (plan for after the launch)

Status: plan only. Nothing here is built. It starts after the 1,000 players and the Music Hero awards are live.

## The idea

Anyone signed in to the radio with a wallet that holds song masters gets a "Release music" section: pick one or
more of their songs, put them in order, choose a cover inscription, name it. One song is a single, a few an EP,
more an album. Today only a gift admin can make an album; the album, cover, copies-with-plays and share-link
machinery already exist (`functions/lib/radio-gifts.ts`, `src/lib/listening-wallet/gift-players.ts`).

## Three stages, cheapest and safest first

1. **Release (no money through Xtrata).** The artist gets a link and a page. A listener opens it and adds the
   album to their player; it plays with the listener's own plays. The artist earns on every play, because each play
   already pays the song's holder. Only songs the wallet holds can go in (curated compilations of other people's
   songs come later).
2. **Sponsored copies.** The artist funds copies that come with their own plays, to hand out (what the Melophonic
   copies are today). Works for admins now; opening it to every artist needs limits and abuse checks.
3. **Selling.** The buyer pays for their own copy with plays included, plus a premium that goes straight to the
   artist. Reuses the sponsored-copy machinery with the buyer as payer. Last, because it brings pricing, refunds and
   support questions.

## Decided (Jim, 15 Nov 2026)

- **An album a listener adds stays added.** They chose to claim it, even one with no plays of its own, so it is
  in their player from then on, on any device, until they hide or remove it themselves.
- Hide and remove are both offered: hide keeps it but out of sight; remove takes it off their player.

## What "stays added" needs

- A record of "this player has added this album" that follows the player, not the device: kept on the server
  against the player's address, written only with proof the request comes from that player (signed inside the wallet
  box, the same way an album wallet is bound to its player today). Never just browser storage.
- It holds no money and moves none: an added album with no plays of its own is a list of songs the player may play
  with its own plays. Removing it changes nothing on chain.
- A sponsored or bought copy keeps working as now (its own wallet and plays); "remove" for one of those must first
  deal with any plays left in it (move them back to the player, or return them), never strand them.

## Open questions

- Should an added album also appear on the wall of things a player shows publicly (its page), or stay private?
- Who may see how many players have added a release: the artist only, or everyone?
- Stage 2: the limits for artist-funded batches (size, how many open at once).
- Stage 3: is the premium a fixed price set by the artist, and is there a refund window?
