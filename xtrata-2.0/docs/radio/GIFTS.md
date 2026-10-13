# Radio gift wallets

Someone without a Stacks wallet gets a gift link. They open it on radio.xtrata.xyz and tap once to make a passkey listening wallet. The gift treasury then funds that wallet with 0.1 to 1 STX, and they start paying artists as they listen.

Code: `functions/lib/radio-gifts.ts` (server), `functions/radio/gift/[[path]].ts` (endpoints), `src/lib/listening-wallet/gifts.ts` (shared rules), `src/radio-ppp/gifts.ts` (panel). Plan: Xtrata Music project, `claude/radio-gift-wallets-plan.md`.

## Kinds of gift

| Kind | Who makes it | Paid from | Returns and refunds go to |
| --- | --- | --- | --- |
| Campaign | the admin (`RADIO_GIFT_ADMIN`), signing a request in the panel | the treasury's campaign pool, capped per day | the treasury |
| Friend | anyone with a Stacks wallet, in "🎁 Gift Stacks music" | the gifter, up front: amount + 0.003 STX, memo `gift <id>` | the gifter (an unclaimed gift is refunded after 30 days) |

- Links look like `https://radio.xtrata.xyz/radio.html#gift=<code>`. The code sits after `#`, so browsers never send it to a server, and the page moves it to the device and takes it out of the address bar at once.
- Only the code's hash is stored.

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

- **Treasury blocked.** `[radio:gifts] ALERT treasury blocked` in the logs means an open send doesn't match its gift. Nothing is sent until someone looks.
  - Check `radio_gift_sends WHERE status='sent'` against `radio_gifts`.
- **Refunds by hand** (`radio_gift_orphans WHERE status='needs-refund'`).
  - Send them from the treasury only while no send is open, so a hand-made transfer cannot take the open send's nonce.
  - Then mark the row `refunded`.
- **Topping up:** send STX to the treasury address (shown in `/radio/listening-wallet/config` as `gifts.treasury`).

## Checks

- `npx vitest run functions/lib/__tests__/radio-gifts.test.ts`: double-pay paths, caps, deposits, refunds, orphans.
- `node scripts/test-radio-gift-browser.mjs [shots]`: link → passkey → automatic claim (including a busy treasury), with the real wallet frame. Also the gift fold and admin box. Build the test wallet first (see the file header).
