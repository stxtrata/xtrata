# Radio: one passkey, many derived wallets

Step 1 of the plan in the Xtrata Music project (`claude/radio-derived-wallets-plan.md`). This step changes the wallet box only: nothing on the radio page uses it yet, so it is safe to ship alone.

## What it is
A listening wallet's key is `HKDF(passkey secret, label)`. Slot 0 keeps the original label (`xtrata-radio-listening-key-v1`) and is the wallet every listener already has. Slot n >= 1 uses `<label>/slot/<n>`, so the same passkey gives as many separate wallets as are needed (limit `MAX_SLOT`, 100,000), each with its own balance and nonce. Money is kept apart by address, so no ledger is needed to say whose it is.

Never change the labels or the HKDF settings: `src/lib/listening-wallet/__tests__/listening-wallet.test.ts` locks slot 0, 1, 2 and 100 against an independent RFC 5869 implementation.

## Wallet box (`src/listening-wallet/frame/engine.ts`)
- On unlock the engine keeps a non-extractable HKDF `CryptoKey`, not the passkey bytes. Slots are derived on demand, with no further passkey tap. Lock, or closing the page, drops it.
- New calls (feature flag `slots`):
  - `listening.slotAddress {slot}`: the address of that wallet. Moves nothing.
  - `listening.openSlot {slot}`: makes that wallet the open one. Refused while a panel is waiting or a signature is being made.
  - `listening.bindSlot {slot, issued}`: returns a binding signed by BOTH the passkey's own wallet and the derived wallet (`src/lib/listening-wallet/slots.ts`). It spends nothing and shows no panel. The server will use it to credit an album's plays and likes to the listener's one linked main wallet.
- `listening.status` reports `slot` while unlocked.
- `listening.link` works only on slot 0. Returns from any slot go to the passkey's linked main wallet (the link is stored per passkey), and still show the full address in the panel.
- One session budget covers all wallets (plays and fees of the listener, whichever wallet pays).

## Shipping
The wallet box deploys separately: `npm run build:listening-wallet`, then `wrangler pages deploy` from `dist-listening-wallet`. The radio page checks `features` for `slots` before using any of these calls, as it does for `partial`.

## Server (step 2)
- `radio_gifts` gains `root` (the passkey's first wallet) and `slot`, with a unique index on `(root, slot)`. A new table `radio_listening_slots` stores each numbered wallet's binding (both signatures). Both are created at runtime; `functions/migrations/029_radio_derived_wallets.sql` is the same thing for a fresh database.
- `GET /radio/gift/slots?root=SP…` returns `{ next }`, the next free number. It is a suggestion; the unique index settles a race (a clash answers 409 "just taken" and the page asks again).
- `POST /radio/gift/claim` takes an optional `binding` (`root, slot, address, issued, rootSignature, slotSignature`). The address must be the claimed wallet, both signatures must verify, and the binding must be under 15 minutes old. Only a gift with an album (player) can go into a numbered wallet: a starter gift goes to the listener's own wallet, once, with the same brand-new-wallet rule as before.
- `GET /radio/gift/shelf?root=SP…&after=<number>&limit=<=100` pages the albums in a passkey's numbered wallets (`{ total, next, shelf: [{ slot, address, state, player, ... }] }`). Public data only. The wallet box re-derives every address from its number, so a row whose address does not match is ignored.
- `GET /radio/listening-wallet/link?listening=…` resolves a numbered wallet to the main wallet its passkey is linked to (`mainsFor`), unless the numbered wallet has a link of its own.

## Likes: always signed by the first wallet
The wallet box (`rootLike` feature) signs every like with the passkey's own wallet (slot 0), whichever album wallet is open, and reports it as `root` in `listening.status`. So a listener's likes live under one address, and `chain-likes.ts` keeps reading one wallet per listener rather than hundreds.

The cost is that the first wallet needs a little STX (a like is a 0.0002 STX network fee) even when the listener only uses albums. The radio therefore reads that wallet's balance while an album is open (`likeFunds` in the controller snapshot) and, when it is out of funds, shows a red banner above the player with the full address, a copy button and, with a main wallet connected, a one-tap top-up (`topUpLikes`). Likes pause (never fall back to signing from the album wallet) until the top-up lands. Controllers that meet an older box without `rootLike` keep the old behaviour (the open wallet signs).

## Counting plays under one listener
`readMusicStats` (`functions/lib/music-stats.ts`) resolves a paying wallet in two steps: a numbered album wallet to the passkey wallet it was derived from (`radio_listening_slots`), then that wallet to its linked main wallet (`radio_listening_wallets`). Supporters are counted once per listener. Each query falls back to the older form when a table is missing.

## On the radio page
- **Claiming an album.** A gift link that carries an album goes into the next free numbered wallet of the open passkey (`gifts.ts`): `GET /radio/gift/slots`, then the box's `listening.bindSlot` (no popup), then `POST /radio/gift/claim` with the proof. If another claim took the number (409 "just taken") it asks the box for a fresh proof for the next number, up to five times. Any unlocked passkey wallet may receive an album, new or old. A starter gift (no album) still needs a brand-new wallet and goes into the open one. A wallet box without `slots` shows "still updating" instead.
- **My albums** (`shelf.ts`, helpers in `src/lib/listening-wallet/shelf.ts`). The fold lists every album, read a page of 100 at a time. Search matches title, artist, song titles and `#number`; sort is recently played, newest, oldest or title; pinned albums come first; "Pinned only" filters. Pins and recents are per-device (local storage, keyed by the passkey wallet, recents capped at 100). The list draws 12 at a time with "Show more". Tapping Play calls `openAlbum(slot)`: the box switches wallet, the controller re-reads that wallet's balance, album and plays, and the radio loads the album as its looping gift band. "Back to my own wallet" is `openAlbum(0)`. The last open album is reopened after an unlock.
- **Curated-album lock** (`albumLock` in the snapshot, `setGiftLock` on the radio). While a curated album's wallet is open, the album is the only band (no FM, LIKED or CHAIN) until the listener has funded either that wallet or their own first wallet with at least 0.1 STX from an address that is neither the gifter nor the gift treasury. A positive answer is remembered on the device; an unreadable history keeps it locked and unknown, and is retried. This is a page default, not security: nothing stops the listener reading the chain or playing songs elsewhere. Plays that run out still stop the album (no free mode).

## Not done yet
- A second waiting link: only one `#gift=` code is kept on the device at a time, so a second album link opened before the first is claimed replaces it (the first can be opened again from its own link).
- Selling: links first, with redemption designed so a token can prove ownership later (see the project doc `radio-derived-wallets-credit-and-sales`).
- Refunds of unclaimed paid albums after 30 days, and artist-prepaid promotion batches.
