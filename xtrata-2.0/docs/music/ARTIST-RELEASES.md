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

## Stage 1 answers (Jim, 15 Nov 2026) and what is built

- **Scope:** stage 1 only (free releases, no plays included).
- **Songs:** an artist may only release songs their wallet holds.
- **Who sees a listener's added albums:** only that listener.
- **Add count:** everyone can see how many players have added a release.

Built, and off until `RADIO_RELEASES_ENABLED=1` is set on the `xtrata` Pages project:

- `src/lib/music-releases/release.ts`: the two signed messages (make a release; read or change a shelf).
- `functions/lib/radio-releases.ts`, `functions/radio/release/`: make a release (holder check, 20 a day per
  artist), view one, list an artist's, list the songs a wallet holds, and the private shelf. Tables are created on
  first use (`radio_releases`, `radio_release_shelf`, `radio_release_seen`).
- Wallet box action `listening.signShelf` (feature `shelf`): the player's own key signs every shelf read and change.
  **Needs a wallet box deploy** before the shelf works; until then adding or listing fails with a message and nothing is saved.
- `src/radio-ppp/releases.ts`: the link card (`?release=<id>`), the list of added albums with hide, show and
  remove, and the artist's "Release your music" fold.

Nothing here moves money or sends a transaction. Not yet built: "remove" for a sponsored or bought copy (those
are not on the shelf; they stay as they are).

## Stages 2 and 3 (Jim, 15 Nov 2026): answers and what is built

Answers: an artist may have up to **25 STX** in unclaimed copies at a time; a sale is paid **straight to the artist**;
buyers pay from a **connected Stacks wallet** (or any wallet, by memo) for now, the player's own balance later; the
price buys **the album only** (it plays with the buyer's own plays).

Each has its own switch on the `xtrata` Pages project, and both need `RADIO_RELEASES_ENABLED=1`:

- **Stage 2, `RADIO_RELEASE_COPIES_ENABLED=1`** (also needs gifts on: `RADIO_GIFT_ENABLED=1` and the treasury).
  The artist of a release may fund prefunded batches of it (the machinery gift admins already use,
  `functions/lib/radio-gifts.ts` `createBatch`): one signature, one payment to the gift treasury, N links, each
  giving the album with its own plays; unclaimed copies are refunded to the artist after 30 days. Only for a release
  the signer made, never starter copies. Cap: `RADIO_RELEASE_COPIES_CAP` microSTX (default 25 STX) of one artist's
  money held at once, counting batches still waiting for payment. Gift admins are not capped. Page: "Send copies" on
  a release in "Your releases".
- **Stage 3, `RADIO_RELEASE_SALES_ENABLED=1`.** The artist signs a price (0 = free, else 0.1 to 1,000 STX;
  `POST /radio/release/price`). Adding a priced release opens an order instead (`radio_release_orders`, one per
  player and release); the buyer sends the price to the artist's wallet with the memo `buy <order>`; the server reads
  that transfer from the chain (`POST /radio/release/paid`, by txid or by memo) and only once it has confirmed puts
  the album on the player's shelf. Xtrata never holds the money, takes nothing and cannot refund. A paid album is the
  player's for good (remove and add again is free); players who added it while free keep it; an unpaid order follows
  the price, an order with a payment on its way keeps its price. With sales paused a priced album is neither sold nor
  given away, and a payment already made still counts. A chain that cannot be read is an error, never "unpaid".

Not built: paying from the player's own balance (needs a new wallet box payment action), plays bundled with a sale,
refunds through Xtrata, editing or deleting a release.

## Open questions

- Whether passkey-only listeners should be able to buy from their player's balance (a wallet box change).
