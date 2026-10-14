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
   - `RADIO_GIFT_ADMIN`: your own address. It only signs campaign requests and never holds gift money.
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
