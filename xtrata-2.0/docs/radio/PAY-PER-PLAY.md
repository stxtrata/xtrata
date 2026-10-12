# Radio pay-per-play with a passkey listening wallet

Status (2026-10-12): built and tested with mocks and Chrome's virtual authenticator. **Not deployed.
No mainnet transaction has been made with it.** Off by default: nothing appears on /radio until the
variables below are set.

Pay-per-play is optional. People turn it on to do the right thing, because it feels good and leaves
a permanent on-chain record that they paid the artist. Listening is always free, for everyone, and
any failure means that song plays free.

Pay-per-play runs only on its own radio address, **radio.xtrata.xyz** (see "Why a separate radio
address"). The radio on xtrata.xyz keeps working as before and its panel links there.

This replaces the 17 Sep "local wizard" direction (docs/plans/RADIO-MUSIC-BALANCE-SIMPLIFIED.md) for
the **web** radio. The desktop Music App keeps its own wallet.

## How it works

The panel shows every gate as a numbered track, always visible, with a "Stage N of 8" line under it:

1 Radio address → 2 Connect wallet → 3 Access (canary allowlist) → 4 Passkey wallet → 5 Link →
6 Add funds → 7 Switch on → 8 First paid play. A blocked gate (not invited, no passkey PRF, over
1 STX) shows red. The track completes once a paid play has confirmed on-chain
(`src/radio-ppp/stages.ts`).

1. **Turn on.** The listener reads the warnings and the paying terms, then creates a listening
   wallet with a passkey (Face ID, Touch ID, Windows Hello or a phone). That one confirm inside the
   wallet frame also switches paying on. Nothing to install.
2. **Link.** Their main wallet (Xverse/Leather) signs one SIP-018 message, the listener confirms
   the full address inside the wallet frame, and the listening wallet countersigns. No fee, no
   spending permission. Returns go only to the main wallet confirmed this way.
3. **Deposit.** One transfer popup sends what is needed to reach 1 STX (or copy the address). No
   second deposit is offered until it confirms.
4. **Listen.** A song that has been heard for **30 seconds** is a play, and a play pays 50 microSTX
   to its holder via `xtrata-radio-plays-v1-0` plus a 300 microSTX fee. No further step. Only
   continuous audible playback counts: paused, muted, volume-zero, buffering and seeked-over time
   does not, so skips stay free. A song shorter than a minute counts at half its length (the radio
   play counter's rule); if the length is unknown it needs the full 30 seconds. The radio emits
   `xtrata:radio-listened` once per song when this is reached (`src/lib/radio/audible-listen.ts`);
   the earlier `xtrata:radio-audible-start` event still fires at audible start for the lounge.

Paying stays on until the listener presses **Switch off** (remembered on that device until they
press **Switch on**) or the wallet runs out (songs then play free, and paying carries on by itself
after a top-up confirms). One approval covers up to 1 STX of plays; after that, or after 7 days in
one open tab, the wallet asks again. Closing the page drops the key; the next visit is one passkey
tap. When a locked wallet has paying switched on, the radio opens its "Unlock and keep paying"
confirm inside the wallet box as soon as the page loads, moved up under the stages, so the
listener's first tap goes straight to the passkey. The paying terms are on that panel, and it is
still the listener's own tap inside the wallet origin, with the arming delay and visibility check.
Cancelling it stops it reopening until the listener asks again. "Use a different listening wallet"
withdraws it (`listening.cancel`, which can only close a panel, never approve one). The panel shows
"Paying as you listen · up to N more plays remaining": whichever runs out first of the approval and
the balance.

About 2,850 plays per STX at the default fee. Below 0.05 STX the radio asks to top up. Above 1 STX
new paid plays pause and **Return excess** / **Return all** appear. Nothing is ever swept
automatically.

## Likes and attribution

- **Likes from the listening wallet.** With paying switched on, approved, linked to the connected
  main wallet and running in this tab, the radio's heart sends `set-liked` from the listening wallet:
  no wallet popup, network fee only (the session fee, counted against the same 1 STX approval,
  at most one like every 3 s). Otherwise the heart opens the usual main-wallet review. The listening
  wallet never likes a song that is already liked, and only unlikes its own likes; a like the main
  wallet made is unliked by the main wallet.
- **Credited to the main wallet.** The likes contract keys likes by `tx-sender` and has no
  "on behalf of" call, so on-chain a like is the listening wallet's. The dual-signed link (both keys
  signed it, verified when saved) is what ties them together:
  - `/radio/chain-likes?wallet=MAIN` adds the likes of every listening wallet linked to MAIN, with
    `by` saying who liked each song, so the liked band follows the listener everywhere they connect.
  - Music stats (`readMusicStats`) count a linked listening wallet as its main wallet, and the paid
    plays reader (`chain-activity.js`, so Music Heroes too) credits its plays to the main wallet,
    showing "via listening wallet …". `GET /radio/listening-wallet/link?listening=…` gives the map.
- The panel shows which main wallet a listening wallet serves ("Linked to", with its BNS name when
  it has one) and every listening wallet linked to the connected wallet. The walk-through header
  says SETUP HELPER until paid plays are taking place.
- Song names in the history come from the radio catalogue with the radio's own title and artist
  overrides (`artist-credits.mjs`).

## Security model

- **No stored key.** The key is HKDF(passkey PRF output) and is re-derived on every unlock
  (`src/lib/listening-wallet/derive.ts`). It lives in memory in the wallet frame and is dropped on
  lock or when the page closes. Storage on the wallet origin holds only credential ids, addresses
  and the public link signature. Lose the passkey and the balance is lost; that is shown before
  funding. The derivation constants are locked by known-answer tests: **never change them**.
- **Separate origin.** The key exists only on `wallet.xtrata.xyz`, a separate Pages project with a
  strict CSP (`default-src 'none'`, `connect-src 'none'`, `frame-ancestors` = the exact parents,
  by default only `https://radio.xtrata.xyz`). Script on any other origin cannot read it. The bridge (`src/lib/wallet/passkey/bridge`) has no method
  that returns key material, and `assertNoSecrets` blocks any reply that looks like one.
- **Approvals happen in the frame.** Creating, unlocking, linking (setting the return address),
  approving spending and confirming a return are buttons inside the wallet origin. The page can ask;
  it cannot approve. Confirm buttons are not focused, arm only after 0.8 s, ignore synthetic clicks,
  and (where the browser supports IntersectionObserver v2, i.e. Chromium) stay disabled until fully
  visible for 0.8 s and refuse to confirm while the frame is covered, faded or transformed by the
  page. Disabled buttons are dimmed with colour, never opacity, which v2 would read as hidden. The bridge answers only the window that
  embeds it.
- **Why a separate radio address.** The wallet has to trust one web address to embed it. That
  cannot be xtrata.xyz: its executable runtime (`/runtime/`) and gallery (`/g`) deliberately run
  inscriptions *as* xtrata.xyz so wallet extensions work for the arcade and X-Board, and those
  inscriptions have `https://xtrata.xyz/runtime/` written on-chain. Anyone could inscribe HTML and
  link people to it. So the wallet trusts only `radio.xtrata.xyz`, served by the same Pages project,
  where nothing but the radio may run as the origin:
  - `/runtime/` (including the executable runtime), `/g`, `/explorer` and `/debug` redirect to
    xtrata.xyz (`functions/lib/radio-host.ts`, folder `_middleware.ts` files);
  - inscription content the radio needs (`/runtime/content`, `/i/`, `/inscription/`) is served with
    `Content-Security-Policy: sandbox`, so HTML among it cannot run as the radio;
  - every other static page on that host gets the same sandbox from `public/_headers`, except the
    radio's own pages; links from the radio to the rest of Xtrata go to xtrata.xyz.
- **What a compromised page on the radio address could still do** (should one ever exist there):
  - Within an approved session: trigger paid plays (50 microSTX to the real holder plus the
    approved fee each), at most one per 20 seconds, up to the session's play count and budget.
  - Within an approved session: like or unlike songs from the listening wallet (fee only, at most
    one every 3 seconds, from the same budget). A like moves no assets (Deny mode, no post-conditions).
  - Ask to change the return address. The frame shows the full new address and, if one was set on
    this device, warns that it replaces it. Only a listener who confirms that is at risk. On a new
    device with no local record there is no "replaces" warning, only the address to check.
  - Show misleading amounts in a return panel (the frame cannot read the chain). It cannot change
    the destination; a transfer larger than the real balance is rejected by the network.
- **Still open on xtrata.xyz itself (not pay-per-play):** inscriptions run as xtrata.xyz there by
  design, so a malicious one can read what xtrata.xyz stores in the browser and ask the listener's
  Xverse/Leather to sign things. Moving the executable runtime to its own address would fix that but
  changes the wallet bridge the arcade and X-Board use; it is separate, carefully tested work.
- **One payment in flight.** A new listen pays only when nothing is unresolved, and a like waits
  (up to 2 minutes) for an earlier transaction to confirm, so they never race for a nonce. A payment that was
  signed but may not have reached the network is re-broadcast with the same signed bytes, never
  replaced. A payment the node refused outright, or whose nonce another transaction used, is marked
  failed. After 30 minutes unseen, the listener can clear it. Each new listen first catches up on
  confirmations and the kill switch, so background tabs keep working. One tab at a time (Web Locks).
- **Passkey PRF must be proven stable** (two matching results) before an address is shown for
  funding, and again the first time a (synced) passkey is used on a new device. Devices without PRF get "pay-per-play isn't available here; listening stays free". There
  is deliberately no password fallback: the address is public, so a password-derived key could be
  brute-forced offline.

## Deploy (all steps are yours)

1. **D1:** `npx wrangler d1 execute xtrata-manage --remote --file=functions/migrations/026_radio_listening_wallets.sql`
2. **Wallet origin, a new Cloudflare Pages project** (not a path on xtrata.xyz, which would give no
   isolation):
   - Repository: this repo, root directory `xtrata-2.0`.
   - Build command: `npm ci && npm run build:listening-wallet`. Output directory: `dist-listening-wallet`.
   - Variable `VITE_LISTENING_WALLET_PARENTS` = `https://radio.xtrata.xyz` (the default when unset).
     This sets both the bridge allowlist and CSP `frame-ancestors`. Never add `https://xtrata.xyz`.
   - Custom domain `wallet.xtrata.xyz`. **Treat this hostname as permanent**: passkeys bind to it,
     so changing it orphans every listening wallet.
   - No Functions, no analytics, no other files on this project, ever.
3. **Radio address:** in the main xtrata Pages project, add the custom domain `radio.xtrata.xyz`
   (same project, same deployment). If you pick a different hostname, also change the
   `https://radio.xtrata.xyz` rules at the end of `public/_headers` and the wallet's parent variable.
4. **Main site settings.** The project's variables are managed by `wrangler.toml`, so:
   - `RADIO_PPP_HOST = "radio.xtrata.xyz"` and `RADIO_LISTENING_WALLET_ORIGIN =
     "https://wallet.xtrata.xyz"` are already in `wrangler.toml` `[vars]`.
   - Add two **Secrets** in the dashboard (Settings → Variables and Secrets → Production, type
     Secret): `RADIO_PPP_ENABLED` = `1` and `RADIO_PPP_ALLOWLIST` = the canary main wallet
     address(es), comma-separated. Secrets can be changed without a code push.
   - Redeploy (a push to main, or retry the latest production deployment).
5. **Check the radio address is locked down** before turning anything on:
   - `curl -sI https://radio.xtrata.xyz/runtime/` → `302` to `https://xtrata.xyz/runtime/`
   - `curl -sI https://radio.xtrata.xyz/` → contains `content-security-policy: sandbox`
   - `curl -sI https://radio.xtrata.xyz/radio` → no `content-security-policy` header
   - `curl -sI "https://radio.xtrata.xyz/runtime/content?tokenId=1&network=mainnet&contractId=SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3"` → `content-security-policy: sandbox`
   If the second or third check fails, Cloudflare is not applying the host rules in `_headers`:
   keep `RADIO_PPP_ENABLED` at `0` and tell me.
6. **Kill switch:** set the `RADIO_PPP_ENABLED` secret to `0` and retry the latest deployment. Open radios stop new payments at
   their next check: on the next song once the cached setting is over 5 minutes old, or immediately
   on any action. Broadcast transactions cannot be recalled.

## Canary checklist

Use a **disposable** main wallet and a small amount (AGENTS.md: never personal, deployer or sponsor
wallets).

- [ ] xtrata.xyz/radio shows only a link to radio.xtrata.xyz and loads no wallet.
- [ ] radio.xtrata.xyz: the radio plays, artwork shows, and links like "Inscribe your own" open
      xtrata.xyz.
- [ ] Desktop Chrome on radio.xtrata.xyz/radio: create, link, deposit 1 STX, approve first play, confirm on explorer.
- [ ] The holder received exactly 50 microSTX; the fee matches what was approved.
- [ ] Lock, reload, unlock: same address, link restored, no new wallet popup.
- [ ] Second tab: shows "already running in another tab", plays free.
- [ ] Send 0.5 STX extra from another wallet: radio shows the over-1-STX warning; Return excess
      leaves exactly 1 STX; Return all leaves 0. Both land in the linked main wallet.
- [ ] iPhone Safari and Android Chrome: create and unlock (PRF inside a cross-origin iframe has only
      been tested in desktop Chrome's virtual authenticator so far).
- [ ] Desktop Safari, Firefox, Edge: note which say "not available here" (iPhone Edge failed PRF
      in the July spike).
- [ ] Synced passkey on a second device: "I already have a listening wallet" unlocks the same
      address and restores the link.
- [ ] Cover the wallet frame (e.g. dev tools opacity 0.3): confirm is refused in Chrome.
- [ ] Kill switch: set `RADIO_PPP_ENABLED=0`, redeploy, confirm the panel disappears and no new plays pay.
- [ ] Record txids and results in docs/radio/reports/.

When the checklist passes, widen `RADIO_PPP_ALLOWLIST` (or set it to `all`).

## Known limits

- Each main wallet keeps its newest five listening-wallet links on the server; older ones drop off.
  That affects restoring the link on another device, and the older wallet's likes and paid plays
  are then no longer credited to the main wallet.
- Each linked listening wallet adds one contract read per 25 songs when the main wallet's likes are
  loaded. New links are capped at 500 an hour.
- One listening-wallet passkey per authenticator: creating a second on the same device is refused
  ("use Unlock instead"). "Use a different listening wallet" lets the listener pick any of theirs.
- The one-tab lock is per browser. Two devices unlocking the same wallet at once can race on a
  nonce: one transaction is rejected (no double payment) and the play is free. A server-side lease
  is a possible follow-up.
- If the main passkey wallet (docs/PASSKEY-WALLET.md) later shares `wallet.xtrata.xyz`, its passkeys
  appear in the same browser picker. Choosing one derives an unrelated, empty listening wallet
  (different salt), so nothing is at risk, but the passkey names should stay distinct.
- Paid starts, not verified full listens (same as the contract today).
- Cross-origin iframe passkeys need the parent's `allow` attribute (set by `src/radio-ppp/page.ts`)
  and browser support; the canary will show real coverage.
- The radio page loads `/radio/ppp.js` only when `/radio/listening-wallet/config` says it is enabled.
- Listeners connect their main wallet once on radio.xtrata.xyz: it is a different address from
  xtrata.xyz, so the browser keeps its connection separately. The homepage radio stays free-play.
- The bare `radio.xtrata.xyz/` shows a blank (sandboxed) page. Link people to
  `radio.xtrata.xyz/radio`, or add a Cloudflare redirect rule from `/` to `/radio`.

## Code map

| Path | Role |
| --- | --- |
| `src/lib/listening-wallet/derive.ts` | PRF → listening key (known-answer locked) |
| `src/lib/listening-wallet/policy.ts` | 1 STX target, reserve, fees, sessions, return arithmetic |
| `src/lib/listening-wallet/link.ts` | SIP-018 link message, signing, verification |
| `src/lib/listening-wallet/tx.ts` | The only two transaction shapes the wallet signs |
| `src/listening-wallet/frame/` | The wallet origin app (engine, passkey, UI) |
| `src/radio-ppp/` | /radio panel and controller (no key) |
| `functions/radio/listening-wallet/` | `config` (gate) and `link` endpoints |
| `functions/lib/radio-host.ts`, `functions/*/_middleware.ts`, `public/_headers` | Radio address lockdown |
| `functions/migrations/026_radio_listening_wallets.sql` | Public link records |

## Tests

```sh
npx vitest run src/lib/listening-wallet src/listening-wallet src/radio-ppp functions/radio/__tests__/listening-wallet.test.ts functions/lib/__tests__/radio-host.test.ts
VITE_LISTENING_WALLET_PARENTS=https://radio.xtrata.test npm run build:listening-wallet && npm run build:radio-ppp
CHROME_PATH=<chrome or chromium> node scripts/test-listening-wallet-browser.mjs
CHROME_PATH=<chrome or chromium> node scripts/test-radio-ppp-browser.mjs [screenshot-dir]
npm run build:listening-wallet   # rebuild with the production parents afterwards
```

The browser checks use Chrome's virtual authenticator with PRF, a strict-CSP wallet origin and a
second parent origin that must be refused. They do not prove real-device passkey behaviour.
