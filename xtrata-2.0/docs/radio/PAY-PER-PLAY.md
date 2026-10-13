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

## Panel layout (for newcomers)

First-time setup shows four steps (Connect · Passkey · Link & fund · Listen) with a "Step N of 4"
line and the SETUP HELPER badge. They go away for good once a paid play has confirmed (or when a
linked wallet only needs unlocking): a set-up listener sees one line, "Paying as you listen · up to
N plays left · balance", and a Switch off button. Everything else (how it works, wallet details,
Return all, Lock, Show listening wallet box, history) is in one "Wallet & history" fold. The
listening wallet box opens in place only while it needs a tap. Inside the wallet box, panels show a
short summary and the button first; the full terms fold under "Details" (the key warning stays in
the summary; the return-address confirm and return review keep the full address visible).

## Likes and attribution

- **Likes from the listening wallet.** Once a listener has a listening wallet on the radio, every tap
  on the heart toggles the like from it, straight on `xtrata-radio-likes-v1-0` (`set-liked`), for a
  fixed 0.0002 STX network fee (`LIKE_FEE`) from the same 1 STX approval, at most one every 3 s.
  No wallet popup, and it never opens the main-wallet endorse page. The tap reads the song's
  current state first (`/radio/chain-likes`), so it likes or unlikes correctly even if the radio's
  list is still loading. If something is missing the panel says what (unlock — the like is sent
  straight after unlocking; link; top up; paying switched off; other tab). A like made from the
  main wallet is left to the main wallet.
- **The heart while a like is on its way.** From the tap until the chain confirms, the heart is
  orange and gently pulsing (`src/lib/radio/like-tracker.ts`: starting, sent, cooling), then locked
  3 more seconds. Taps meanwhile do nothing, so a like cannot be toggled on and off in quick
  succession. The controller enforces the same lock on what it signs (`LIKE_COOLDOWN_MS`), and
  only one like is in flight at a time.
- **Older wallet boxes.** The wallet build reports `features` in `listening.status` (`cancel`,
  `like`). A build without `like` makes the heart fall back to the main-wallet page, and the
  panel's fold says the wallet box is out of date, instead of a like timing out.
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

**Wallet box updates:** `.github/workflows/listening-wallet-deploy.yml` builds and deploys
wallet.xtrata.xyz whenever its code changes on main (or from the Actions tab). It needs two
repository secrets: `CLOUDFLARE_API_TOKEN` (Account → Cloudflare Pages: Edit) and
`CLOUDFLARE_ACCOUNT_ID`. Without them the job warns and does nothing; deploy by hand instead:
`npm run build:listening-wallet && cd dist-listening-wallet && npx wrangler pages deploy . --project-name xtrata-listening-wallet --branch main`.

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
     address(es), comma-separated. Secrets can be changed without a code push. Optional third
     secret: `RADIO_PPP_PASSKEY_ONLY` = `1` (see Passkey-only listeners below).
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

## Passkey-only listeners (no Stacks wallet)

A listener with no Stacks wallet can create a listening wallet from a passkey, get an address, have
anyone send it about 1 STX, and start paying artists. No connect, no link, no popups.

**Switch:** a third secret, `RADIO_PPP_PASSKEY_ONLY` = `1` (default off; anything else is off). It
needs `RADIO_PPP_ENABLED=1` and only works on the radio host. It does not widen
`RADIO_PPP_ALLOWLIST`: a connected, invited main wallet keeps the linked flow, and a connected but
not-invited wallet can still listen passkey-only. Redeploy the **main** project after changing it
(the wallet box needs the matching build. It is a direct-upload Pages project, and the GitHub Action
skips silently while the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repo secrets are unset, so
deploy it by hand: `npm run build:listening-wallet`, then in `dist-listening-wallet`
`npx wrangler pages deploy . --project-name xtrata-listening-wallet --branch main`. An older box
still pays but says it cannot return to another address or like yet).

**Where returns go**, in this order:
1. the linked main wallet, if the listening wallet was ever linked (always wins);
2. an address the listener typed in the panel;
3. the **funder**: the sender of the first deposit of at least 0.1 STX from a plain `SP` address
   (contracts, self-sends and dust are skipped). The page finds it from Hiro `stx_inbound`
   (`src/lib/listening-wallet/funder.ts`); the wallet box stays offline.

The wallet box never trusts the page: it shows the **full** destination address and the listener
confirms it there. A failed lookup is shown as "could not check", never "no funder", and nothing is
sent without a destination. Known weakness: whoever sends 0.1 STX first becomes the default, and an
exchange hot wallet looks like any other sender, so the panel shows the address in full and offers a
different one. The confirm step is the safeguard; treat the default as a suggestion.

**Identity:** passkey-only likes are signed from the listening address and listed under it (likes
page and heart); plays are credited to it. Linking a main wallet later moves them under that wallet
via the existing link. The panel gently points to Xverse/Leather and never blocks.

**Canary:** test with disposable wallets only (AGENTS.md). Check: create with no wallet connected,
fund from a second disposable wallet, confirm a paid play, like a song, then return all and confirm
the full address shown in the wallet box is the funder.

## One listening wallet per wallet address

A person with a Stacks wallet that has several addresses (Xverse, Leather) gets a **separate listening
wallet for each address they connect**, on the same device. Each is linked to its own address, so that
address's plays, likes and returns stay separate, like a playlist per profile. A passkey-only listener
(no Stacks wallet) stays a single wallet.

How it works (wallet box feature `multi`; `src/listening-wallet/frame/engine.ts`):
- The page passes the connected address to `listening.status` and `listening.unlock`. The box answers
  with **the wallet linked to that address**; else a wallet that was never linked (a passkey-only one,
  which the first address to link it claims); else none, and the page offers a new one for that address.
  A wallet linked to a *different* address is never offered. The address only chooses among this
  device's wallets: it grants nothing, and every unlock, create, link and return still needs the
  passkey and the in-box confirm with the full address.
- Switching to another address while a wallet is open locks it (the box does this itself on the next
  status call), drops what it was waiting to pay, and shows the new address's wallet or the set-up step.
  A wallet opened for the same address stays open.
- Creating a wallet for an address names the passkey `Xtrata listening wallet · SP…` so several are
  can be told apart in the password manager. The device remembers up to 25 wallets (it never silently forgets
  one that may hold funds). Funds in an address's wallet are reached by connecting that address.
- The wallet box greets a linked wallet as "Welcome back, <name or short main address>" (the page passes
  the BNS name as a display-only `label`, sanitised by the box). The panel shows "Credited to <name ·
  address>" and keeps the listening address in a "Listening wallet (technical)" row, needed to fund it.
- **Connecting an address with no wallet here** starts the normal set-up. If this device already has
  wallets for other addresses, the box reports them (`others`, public addresses only) and the panel
  says so first: "This device already has a listening wallet for <name>. If you meant to use that one,
  switch to that wallet", then offers "Set up for <address>" as a new account. An address that already
  has its wallet is never asked anything: it unlocks with one passkey tap. With no wallet connected the
  panel lists the addresses this device has wallets for.
- **Older wallet box** (no `multi`): it ignores the address and answers with its last wallet. If that
  wallet is linked to a different address the panel stays on `wrong-wallet`: locked, with no unlock,
  paying, likes, deposits, links or returns, and the box is told to update. Deploy the box by hand.

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

## Browser caching

Cloudflare's zone **Browser Cache TTL** overrides the `no-cache` in `public/_headers` for scripts
on the custom domains (they arrive with `max-age=14400`), so a browser could run a four-hour-old
`/radio/ppp.js` or `/xtrata-radio.js` inside a fresh page. The pages load them by content hash
instead (`?v=…`, written by `scripts/stamp-radio-assets.mjs` after `build:radio` and
`build:radio-ppp`). Setting the zone's Browser Cache TTL to **Respect Existing Headers** fixes it
for every other script too.

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
