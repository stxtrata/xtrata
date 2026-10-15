# Radio gift wallets

Someone without a Stacks wallet gets a gift link. They open it on radio.xtrata.xyz and tap once to make a passkey listening wallet. The gift treasury then funds that wallet with 0.1 to 1 STX, and they start paying artists as they listen.

**Status (14 Oct 2026): live.** The treasury is set up and switched on, and the first gifts have landed on chain (0.1 STX at 19:30 on 13 Oct; a 0.2 STX gift was claimed and played on an iPhone at 22:48). Recipients on iPhone and in Safari make their passkey in a new tab (below).

Code: `functions/lib/radio-gifts.ts` (server), `functions/radio/gift/[[path]].ts` (endpoints), `src/lib/listening-wallet/gifts.ts` (shared rules), `src/radio-ppp/gifts.ts` (panel). Plan: Xtrata Music project, `claude/radio-gift-wallets-plan.md`.

## Kinds of gift

| Kind | Who makes it | Paid from | Returns and refunds go to |
| --- | --- | --- | --- |
| Campaign | the admin (`RADIO_GIFT_ADMIN`), signing a request in the panel | the treasury's campaign pool, capped per day | the treasury |
| Friend | anyone with a Stacks wallet, in "🎁 Send someone a wallet" | the gifter, up front: amount + 0.003 STX, memo `gift <id>` | the gifter (an unclaimed gift is refunded after 30 days) |

- Links look like `https://radio.xtrata.xyz/radio.html#gift=<code>`. The code sits after `#`, so browsers never send it to a server, and the page moves it to the device and takes it out of the address bar at once.
- Only the code's hash is stored.

## The recipient's side

- **One button:** "Claim my gift · no wallet needed" makes a passkey-only listening wallet; the claim is sent as soon as the new wallet exists and is empty, and the panel tracks the transfer like a deposit until it lands ("Gift on its way" clears when it has).
- **iPhone, iPad and Safari:** the passkey is made on `wallet.xtrata.xyz/create` in a new tab, then the radio tab signs in with it (WebKit will not create a passkey inside the wallet frame). See PAY-PER-PLAY.md, "iPhone, iPad and Safari".
- **Apps' built-in browsers** (Instagram, Facebook, X, TikTok, LinkedIn and others name themselves in the user agent): passkeys often fail there, so the panel first offers "Open in Safari" (or Chrome on Android) carrying the gift code, plus "Copy link". The normal buttons stay, since some apps do manage. Links opened from Messages, Mail and similar use Safari's own view and work as in Safari.
- **Which wallet takes the gift:** only a brand-new one: made in this browser, or never used (confirmed balance 0 and nonce 0, e.g. made in another tab after the page reloaded). Someone who unlocks an older wallet keeps the link, shown as one quiet line with "Forget this gift link here"; "Not now" on the landing does the same. The server also refuses a second gift for one wallet.

## How the treasury never pays twice

- **One send at a time.** A send (claim or refund) is written together with its gift's change of state in one D1 transaction, before broadcast, with its nonce and signed bytes. A partial unique index allows only one open send.
- **Broadcast failures never release a gift.** A refused or unanswered broadcast stays open, and the same bytes go out again. If a send is stuck it is re-signed with the same nonce and a higher fee (at most 0.02 STX), so only one version can ever land.
- **The chain settles it, from one source (Hiro's indexer).**
  - Done: a transaction of the send succeeded.
  - Released: the indexer shows the send's nonce was executed without a success, and still shows that 5 minutes later.
- **Friends' deposits are never lost.**
  - An unpaid gift is set aside after a day (`abandoned`) but still matched by its memo, so a late payment still makes it live.
  - A memo'd payment that belongs to no waiting gift goes in `radio_gift_orphans` as `needs-refund`, and is held back from campaign gifts.

## Limits

- Claims go only to brand-new listening wallets (no history, no balance), one gift per wallet.
- At most 3 claims per IP (salted hash) per day.
- Campaign gifts are capped at `RADIO_GIFT_DAILY_CAP` per 24 h (default 2 STX).
- Friend money held at once is capped at `RADIO_GIFT_ESCROW_CAP` (default 25 STX).
- Campaign gifts never spend money owed to friends or awaiting a refund.
- Each signed campaign request works once, within 15 minutes of signing.
- Optional Cloudflare Turnstile on claims (`RADIO_GIFT_TURNSTILE_SITE_KEY` + `RADIO_GIFT_TURNSTILE_SECRET`).

## Setup (Cloudflare Pages, project `xtrata`, Production)

1. Create a NEW wallet for the treasury only. Never use a personal, deployer or sponsor wallet (AGENTS.md).
2. Fund it with the float: 10 STX.
3. Set secrets:
   - `RADIO_GIFT_TREASURY_KEY`: the treasury's private key (64 hex characters, optionally ending `01`).
   - `RADIO_GIFT_ADMIN`: your own address. It only signs campaign and player requests and never holds gift money. Several admins: separate the addresses with commas, e.g. `SP…jim,SP3JB6BCKV14CG25NF017CR7KRVSM8RAGHB52DWHX`. Every admin can make campaign links (paid from the treasury, within the daily cap) and albums from the songs it holds.
   - Optional: `RADIO_GIFT_DAILY_CAP` and `RADIO_GIFT_ESCROW_CAP` (microSTX), and the two Turnstile keys.
   - `RADIO_GIFT_ENABLED` = `1` last.
4. Optionally apply `functions/migrations/027_radio_gifts.sql`. The tables are also created on first use.
5. Redeploy `xtrata`. Secrets apply only to new deployments.
6. Kill switch: set `RADIO_GIFT_ENABLED` to anything but `1` and redeploy. Claims, new gifts and refunds all stop. Sends already made still settle on the chain.

## Operating

- **A gift stuck "on its way".** The recipient's panel shows the reason the network gave (`radio_gift_sends.last_error`, also logged as `[radio:gifts] broadcast failed`). The same bytes are retried every 20 seconds while failing, on any gift request (the recipient's page asks every 30 seconds).
- **Treasury blocked.** `[radio:gifts] ALERT treasury blocked` in the logs means an open send doesn't match its gift. Nothing is sent until someone looks.
  - Check `radio_gift_sends WHERE status='sent'` against `radio_gifts`.
- **Refunds by hand** (`radio_gift_orphans WHERE status='needs-refund'`).
  - Send them from the treasury only while no send is open, so a hand-made transfer cannot take the open send's nonce.
  - Then mark the row `refunded`.
- **Topping up:** send STX to the treasury address (shown in `/radio/listening-wallet/config` as `gifts.treasury`).

## Checks

- `npx vitest run functions/lib/__tests__/radio-gifts.test.ts`: double-pay paths, caps, deposits, refunds, orphans.
- `node scripts/test-radio-gift-browser.mjs [shots]`: link → passkey → automatic claim (including a busy treasury), with the real wallet frame. Also the gift fold and admin box. Build the test wallet first (see the file header).

## Gift players (Gift Edition)

A gift link can carry a **player**: a named album that loads onto the radio when the recipient claims the gift. The recipient gets the album as its own looping band, a plays-left meter, and **no free mode**: when the paid plays run out the radio stops until they add more. Plan and decisions: Xtrata Music project, `claude/radio-gift-player-plan.md`.

Code: `src/lib/listening-wallet/gift-players.ts` (rules, signing), `functions/lib/radio-gifts.ts` (`createPlayer`, `playerView`), `src/lib/listening-wallet/ledger.ts` (where money came from), `src/radio-ppp/controller.ts` (plays, stop, returns), `src/home/radio.js` (the gift band).

### Making one (admin, phase 1)

1. Open the radio as the gift admin: **🎁 Gift Stacks music → Gift players**. Enter a title, an optional artist, and the radio song numbers in play order (1 to 40, ready songs in the radio catalogue). Sign once. The server stores the definition; titles and artists shown to listeners come from the catalogue, never from what was typed.
2. Under **Campaign links** pick the player, a size (300 / 500 / 1,000 plays or Max = 1 STX), how many links, and sign. Links look like any other gift link.
- **An album is made by the wallet that owns all of its songs.** When a player is created the server asks the core contract (`get-owner`) who holds each song, and every one must be the signing wallet. A song held by someone else, by a contract (for example listed for sale) or by no one refuses the player; a chain that cannot answer says "try again", never "allowed". The check runs at creation only: an album already made stays valid if a song is sold later. The core contract applies the same rule natively to an inscription minted with the songs as its **parents** (the minter must own every parent), which is the planned on-chain form of an album (see the Xtrata Music project doc `radio-editions-and-sales-plan.md`).
- **An album never stops working.** Nothing deactivates a player or a link that has been made: selling a song afterwards, or a chain outage, changes nothing for existing albums, their links or recipients (tested). Only songs the radio catalogue cannot confirm are left out of the album view.
- A player never changes. A new version is a new player, so a link already sent cannot become something its sender did not mean.
- Migration `functions/migrations/028_radio_gift_players.sql` (the tables are also created on first use).

### What the recipient sees

- The link says who sent “Title”, how many songs and about how many plays. One tap makes the passkey wallet and the gift lands in it.
- The radio switches to the album (looping, in order). The panel shows `🎁 Gift Edition · Title · N plays left`; the interface speaks in plays, not STX.
- **Stop rules.** The radio stops (and says why on its screen) when: the wallet is locked, paying is switched off, there are no paid plays left (counting payments in flight and songs waiting to be paid), or the wallet is over 1 STX. A slow or failed read of the chain or the server is **not** a reason to stop, and a payment that could not be made stays queued and counts against the plays: it never turns into a free song.
- Running low (20 plays) or out: one quiet line pointing at the listening address and, as an optional extra, Xverse and Leather. Never a popup, never a block.

### Where the money goes back to

A gifted wallet returns each part of its balance to whoever it came from:

| Part | Goes to |
| --- | --- |
| Unused gift | the gifter (friend gift) or the treasury (campaign) |
| What a listener added | the address that sent it |
| Above 1 STX | the sender of the newest deposit |
| Dust or a contract sender | an address the listener chooses |

- **How it is worked out.** The page reads the wallet's inbound transfers and its outgoing transfers from Hiro, attributes money (not addresses): deposits from the treasury are the gift, deposits of at least 0.1 STX from a standard address belong to that sender, a return reduces what the address it went to had put in first, and spending uses the oldest money first. If the history is incomplete, too long, or does not add up to the balance, the answer is **“Could not check”** and nothing is sent.
- **One part at a time.** Only one transaction can be in flight per wallet, so the first press shows the split and the next press returns the first part; press again after it confirms for the next. Each part pays its own network fee.
- **Checked before it is broadcast.** The page compares what the wallet box signed (destination and exact amount) with what it asked for.
- **Linked to a main wallet.** Everything goes to that wallet, as it always has.
- Needs the wallet box with the `partial` feature (returns of a chosen amount). `npm run build:listening-wallet`, then deploy `dist-listening-wallet` to the wallet Pages project by hand. Until then a split return says the box needs an update; nothing is sent.

### Known limits

- The outgoing list shares Hiro's transactions endpoint with plays, so a wallet with more than about 1,000 transactions reads as “could not check”. The listener can still choose an address to return to.
- Phase 1 has no follow-likes and no onboarding prompt beyond the quiet pointer above.
