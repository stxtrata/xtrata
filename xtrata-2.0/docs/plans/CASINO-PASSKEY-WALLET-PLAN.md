# ParallaX Casino: passkey wallet for the LAYR exchange (plan)

Written 2026-10-31. **Status: BUILT 2026-10-31, not deployed.** Behind a flag (`?passkey=1`) until `casino-wallet.xtrata.xyz` is live.
Decisions in section 7; what was built and how to ship it in section 8. Testnet only.

Goal: someone with no Stacks wallet walks up to a LAYR exchange, taps once (Face ID / fingerprint), gets a
testnet wallet with free testnet STX in it, buys LAYR and plays. No extension, no seed phrase, no popups
after that.

Companion docs: `docs/radio/PAY-PER-PLAY.md`, `docs/radio/GIFTS.md`, `docs/radio/DERIVED-WALLETS.md`,
`docs/PASSKEY-WALLET.md`, `docs/WALLET-PLAYBOOK.md`, `docs/plans/CASINO-ONCHAIN-LAYR-PLAN.md`.

## 0. The plan in eight lines

1. The radio already does this on mainnet: a passkey's PRF secret is HKDF'd into a Stacks key, inside an
   isolated wallet box (`wallet.xtrata.xyz`) that the page talks to over the bridge. The casino reuses that code.
2. It reuses the **code**, not the **deployment**. The radio's wallet box is mainnet, trusts only
   `radio.xtrata.xyz`, and must never trust `xtrata.xyz` (inscriptions run as that origin; PAY-PER-PLAY.md
   "Why a separate radio address"). So the casino gets a second build of the same box: testnet, its own
   hostname, its own salt and HKDF label.
3. The box signs exactly **one** transaction shape: a plain testnet STX transfer of 1–10 whole STX to the
   exchange address `ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA`, memo `ParallaX LAYR`. Nothing else.
   No returns, no links, no contract calls.
4. The exchange's existing flow (pending → check → verifyTransfer → credit LAYR) stays exactly as it is.
   The passkey wallet plugs in at the one place a wallet is asked to pay: the `run:` hook of `ask()` in
   `ParallaxTestnetLAYR.create`.
5. Free testnet STX come from Hiro's faucet only (500 testnet STX per request, no server work). No
   starter treasury.
6. "Operates automatically": one in-box approval, with no spending cap, covers every buy until the wallet
   locks or the tab closes. As soon as the faucet STX land, the page buys 10 STX (1,000,000 LAYR) by itself.
7. iPhone/Safari: the passkey is made in a new tab, exactly as the radio does (`create.html`).
   In-app browsers: the radio's "Open in Safari" prompt.
8. No PRF on this device: because it is testnet play money, the box may fall back to a random key kept
   in the box origin's storage. That fallback must never be ported to mainnet.

## 1. What exists today (read from the code)

| Piece | Where | State |
| --- | --- | --- |
| LAYR exchange panel | `public/casino/index.html`, `#layrDispenserPanel`, panel states `disconnected / connecting / ready / busy / shut` (`pxPaintExchange`) | Live, testnet |
| Exchange client | same file, `window.ParallaxTestnetLAYR.create()` | `connect()` via @stacks/connect (Xverse/Leather), `purchase(stx)` → `payViaWallet()` → `stx_transferStx`, then `check()` polls `api.testnet.hiro.so` and credits via `account.applyTestnetFunding(proof)` |
| Only on-chain act | | A plain STX transfer, sender = connected address, recipient = the exchange address, 1–10 whole STX |
| Funding help | `#lxFaucet` link | Sends people to the Hiro explorer faucet by hand |
| Passkey → key | `src/lib/listening-wallet/derive.ts` | HKDF(PRF) → secp256k1, **mainnet** address, known-answer locked |
| Passkey ceremony | `src/listening-wallet/frame/passkey.ts`, `create.ts`, `create.html` | Create, PRF stability check (two matching results), WebKit new-tab create |
| Bridge | `src/lib/wallet/passkey/bridge/{protocol,client,host}.ts` | Origin/source/id checks, method allowlist, `assertNoSecrets` |
| Wallet box app | `src/listening-wallet/frame/engine.ts`, `main.ts`, `ui.ts` | Radio-specific `listening.*` methods, `StacksMainnet` hard-coded (`src/lib/listening-wallet/tx.ts`) |
| Box build | `vite.listening-wallet.config.ts` → `dist-listening-wallet/`, Pages project `xtrata-listening-wallet` | CSP `connect-src 'none'`, `frame-ancestors` = exact parents |
| In-app browser detect | `src/radio-ppp/in-app.ts` | Reusable as is |
| Funding a new wallet | `functions/lib/radio-gifts.ts` | Mainnet treasury, one-send-at-a-time D1 machinery, brand-new-wallet rule |

The casino page is a hand-edited single file; `room.js` is built from `src/casino-room/` (`npm run build:casino-room`).
`src/casino-room/__tests__/layr-exchange-connect.test.ts` already tests the exchange connect path.

## 2. Key decision: second box, not a shared one

| | A. Second build of the box (recommended) | B. Add `casino.*` methods to `wallet.xtrata.xyz` |
| --- | --- | --- |
| One passkey for radio and casino | No (different hostname = different passkey) | Yes |
| Touches the live mainnet wallet box | No | Yes |
| Parent origin | `https://xtrata.xyz` is fine: worst case is someone else's page spending your *testnet* STX on LAYR for you | Must not add `xtrata.xyz` to a mainnet box. Casino would have to move to its own locked-down host (like `radio.xtrata.xyz`), plus per-parent method allowlists in `host.ts` |
| Work | Small: copy configs, parametrise two modules | Larger, and a security review of the mainnet box |

Go with **A** now. B is the path if the casino ever goes mainnet: by then it needs its own host anyway.

Proposed hostname: `casino-wallet.xtrata.xyz` (separate Pages project `xtrata-casino-wallet`). Treat it as
permanent once people have passkeys on it (the passkey binds to the hostname).

## 3. Build steps

### Step 1. Shared library changes (no behaviour change for the radio)

- `src/lib/listening-wallet/derive.ts`: add a network parameter to the address step
  (`TransactionVersion.Testnet` for the casino). **Do not edit the radio constants.** Add new ones in a
  new module `src/lib/casino-wallet/derive.ts`:
  - `CASINO_PRF_SALT = 'xtrata.casino.testnet-wallet.v1'`
  - `CASINO_HKDF_INFO = 'xtrata-casino-testnet-key-v1'`
  - Known-answer tests for both, the same way the radio's are locked. The existing radio vectors must still pass untouched.
- `src/listening-wallet/frame/passkey.ts`: take the salt, relying-party name and passkey label as parameters
  (`Xtrata casino wallet (testnet) · ABCD`) instead of reading radio constants. Radio passes its existing values.
- Bridge: no change. The casino gets its own method list in `protocol.ts` (a second allowlist), so a
  radio box can never answer a casino method and vice versa.

### Step 2. The casino wallet box (`src/casino-wallet/frame/`)

A slim engine, much smaller than the radio's because there are no links, returns, likes or slots.

| Method | What it does | Prompt? |
| --- | --- | --- |
| `casino.status` | `{ state: none / locked / unlocked, address, kind: passkey / device, budgetLeft }` | No |
| `casino.create` | Make a passkey (new tab on WebKit), prove PRF twice, derive, show the address | Yes, in box |
| `casino.unlock` | Passkey tap → derive → hold key in memory | Yes, in box |
| `casino.approve` | In-box confirm: "Let the casino buy LAYR with this testnet wallet without asking". No amount cap (decision 4); lasts until lock or the tab closes. Can be folded into the create/unlock confirm so a new player taps once | Yes, in box |
| `casino.signBuy {stx, fee, nonce}` | Signs ONLY the exchange transfer (below). Inside an approval: no prompt. Outside one: an in-box confirm | Only without approval |
| `casino.lock` / `casino.cancel` | Drop the key / close a waiting panel | No |

`src/lib/casino-wallet/tx.ts`, the only transaction shape:

```ts
// recipient fixed in the box, never taken from the page
makeSTXTokenTransfer({ recipient: 'ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA',
  amount: BigInt(stx) * 1_000_000n,      // stx is a whole number 1..10
  memo: 'ParallaX LAYR', fee, nonce,     // fee capped (e.g. <= 10_000 µSTX), nonce from the page
  network: new StacksTestnet(), anchorMode: AnchorMode.Any, senderKey })
```

The box keeps the radio's rules: confirm buttons arm after 0.8 s, ignore synthetic clicks, refuse while
covered; no method returns key material; `assertNoSecrets` on every reply; `connect-src 'none'` (the page
does all network work).

**No-PRF fallback (testnet only).** If the device cannot do PRF (or the person picks "Quick wallet, no
passkey"), the box generates a random key and stores it in **its own** origin's storage (never
`xtrata.xyz`'s). Labelled clearly as "this browser only". This is acceptable here only because the funds are
testnet; PAY-PER-PLAY.md explains why the radio refuses it.

### Step 3. Build and deploy config

- `vite.casino-wallet.config.ts`: copy of `vite.listening-wallet.config.ts`. Output `dist-casino-wallet/`.
  `VITE_CASINO_WALLET_PARENTS` defaults to `https://xtrata.xyz` (plus the staging origin if you test there).
  Same CSP and headers generator.
- `package.json`: `build:casino-wallet`.
- Pages project `xtrata-casino-wallet`, custom domain `casino-wallet.xtrata.xyz`. Deploy by hand like the
  radio box: `npx wrangler pages deploy . --project-name xtrata-casino-wallet --branch main` from
  `dist-casino-wallet`.
- Check: `curl -s -o /dev/null -w '%{http_code}\n' https://casino-wallet.xtrata.xyz/create` prints 200.

### Step 4. Page side: a small client bundle

`src/casino-room/passkey-wallet.ts`, built into `public/casino/` (next to `room.js`, or folded into the
`build:casino-room` output). It:

- mounts the box iframe lazily (only when the exchange opens), with
  `allow="publickey-credentials-get https://casino-wallet.xtrata.xyz; publickey-credentials-create https://casino-wallet.xtrata.xyz"`;
- wraps the bridge client: `status / create / unlock / approve / signBuy`;
- before `signBuy`: reads the nonce (`/extended/v1/address/{a}/nonces` → `possible_next_nonce`) and picks
  the fee;
- after `signBuy`: decodes the signed bytes and checks recipient, amount and sender before broadcasting
  (the radio's "checked before it is broadcast" rule), then `POST /v2/transactions` to
  `api.testnet.hiro.so` and returns `{ txid }`;
- exposes `window.ParallaxPasskeyWallet`.

### Step 5. Wire it into `ParallaxTestnetLAYR` (in `public/casino/index.html`)

Minimal and contained, because the existing pending/check/credit logic is already right:

- New state `walletKind: 'extension' | 'passkey'`.
- `connectPasskey()`: `status` → `unlock` or `create` → set `address` from the box, `walletKind='passkey'`,
  `refreshBalance()`. Same pending-address guard as `connect()`.
- `payViaWallet()`: first line, `if (walletKind === 'passkey') return ParallaxPasskeyWallet.buy(base)`.
  It already runs under `ask()`'s watchdog through the `run:` option, so timeouts, `late` answers and the
  "save pending before asking" rule all still apply.
- Balance guard in `purchase()`: for passkey wallets compare against `stx + fee`, not `stx`.
- On page load: if the box reports a wallet on this device, show "Welcome back · unlock" (one tap) instead
  of "Connect wallet". Never auto-unlock without a tap.
- `cancel()`: also cancels a waiting box panel (`casino.cancel`).

### Step 6. Funding the new wallet

**6a. Hiro faucet (first).** After create, the page calls
`POST https://api.testnet.hiro.so/extended/v1/faucets/stx?address=<ST…>`, then polls
`refreshBalance()` until STX arrive. The panel shows "Getting your free testnet STX…" with the faucet tx
link. Hiro documents a limit of one regular STX request per minute.

**6b. Starter treasury (only if 6a is unreliable).** `POST /casino/starter {address}`: a Pages Function
with a **testnet** treasury key (`CASINO_TESTNET_TREASURY_KEY`, a new wallet used for nothing else). It
reuses the one-send-at-a-time / same-bytes rebroadcast machinery from `functions/lib/radio-gifts.ts`.
Rules: brand-new wallet only (balance 0, nonce 0), one starter per wallet, per-connection cap per 24 h,
optional Turnstile, kill switch `CASINO_STARTER_ENABLED`. Top the treasury up from the faucet by hand.
This also survives a room full of people on one Wi-Fi, which an IP-limited faucet may not.

### Step 7. Exchange panel UX

New `data-state` values: `passkey-create`, `funding`, `approve`.

Disconnected state shows two buttons:

- **Play now: no wallet needed** (primary) → create passkey → "Getting free testnet STX…" → in-box
  approve ("Let the casino spend up to 50 testnet STX on chips") → auto-buy the first 10 STX (1,000,000 LAYR) → done.
- **I have a Stacks wallet** → the existing Xverse/Leather path.

Connected with a passkey wallet: address chip, "Passkey wallet · testnet", balance, "Top up from faucet",
and "Use my own wallet instead" (chips are per browser anyway, so switching loses nothing).

In-app browsers: reuse `in-app.ts` and the radio's "Open in Safari / Copy link" block above the buttons.

Copy to show once, before create: "A testnet wallet made from your passkey. Testnet STX have no value.
Lose the passkey and you lose the wallet, nothing else."

Respect `casino-status.json`: when the exchange is closed, hide "Play now".

## 4. What a hostile page could do (and why that is fine here)

Anything that runs as `xtrata.xyz` (including an inscription in `/runtime/`) could embed the casino box.
To spend it would need the person to unlock with their passkey inside the box, and even then the only thing
the box can sign is a 1–10 STX testnet transfer **to the exchange**. No key ever leaves the box. Worst case:
someone's free testnet STX get turned into chips early. Write that into the doc next to the code, so nobody
later "reuses" this box on mainnet without moving it to a locked-down host (option B).

## 5. Tests

- Known-answer vectors for the casino derivation (testnet addresses); the radio vectors unchanged.
- `tx.ts`: refuses any recipient, amount outside 1–10, non-whole STX, fee over the cap, mainnet.
- Bridge: a radio box refuses `casino.*`; a casino box refuses `listening.*`; an unlisted parent gets silence.
- Extend `src/casino-room/__tests__/layr-exchange-connect.test.ts`: passkey path end to end with a mocked
  box (pending saved before signing, late answer handled, credit once).
- Browser run with Chrome's virtual authenticator, copying `scripts/test-listening-wallet-browser.mjs`.
- Real devices: iPhone Safari (new-tab create), desktop Chrome, Android Chrome, one in-app browser.

## 6. Order of work

| # | Step | Ships alone? |
| --- | --- | --- |
| 0 | Check the faucet from a browser: CORS on `xtrata.xyz`, how much it sends, the 429 behaviour | Yes (research) |
| 1 | Parametrise derive/passkey, add casino constants and vectors | Yes, radio unchanged |
| 2–3 | Casino box + build + deploy to `casino-wallet.xtrata.xyz` | Yes, nothing uses it yet |
| 4–5 | Client bundle + `ParallaxTestnetLAYR` passkey path, behind a flag (`?passkey=1`) | Yes |
| 6a | Faucet funding | Yes |
| 7 | Panel UX, then remove the flag | Yes |
| 6b | Starter treasury, only if needed | Yes |

## 7. Decisions for Jim (each has a default)

1. **Separate casino box (A) or one shared box (B)?** Default A.
2. **Auto-buy on first funding?** Default yes: 10 STX → 1,000,000 LAYR, so new players land with chips.
3. **Faucet only, or the starter treasury too?** Default faucet first; treasury if the faucet fails in testing.
4. **Session approval size.** Default 50 testnet STX or 24 h, whichever comes first.
5. **No-PRF fallback key.** Default on, testnet only.

## 8. Built (2026-10-31)

Everything above is built and tested. Nothing is deployed: the casino page shows no change until the flag is on.

### Files

| Path | What |
| --- | --- |
| `src/lib/casino-wallet/derive.ts` | PRF → HKDF (`xtrata-casino-testnet-key-v1`) → testnet key; the browser-only random key. Known-answer locked |
| `src/lib/casino-wallet/tx.ts` | The only signable shape (1-10 STX to the exchange, memo `ParallaX LAYR`, fee 0.003 STX, cap 0.05) and `checkSignedBuy`, the page's check before broadcast |
| `src/lib/casino-wallet/messages.ts` | `casino.*` bridge shapes |
| `src/casino-wallet/frame/` | The wallet box: `engine.ts` (create / unlock / browser-only / signBuy / lock), `main.ts`, `create.ts` + `create.html` (WebKit new-tab passkey), `options.ts` (salt, names, wording) |
| `vite.casino-wallet.config.ts` | Box build → `dist-casino-wallet/` with the same CSP/headers generator as the radio box. `npm run build:casino-wallet` |
| `src/casino-room/passkey-wallet.ts` | Page side → `public/casino/passkey-wallet.js` (`window.ParallaxPasskeyWallet`): frame, faucet, nonce, check, broadcast. `npm run build:casino-passkey` |
| `public/casino/index.html` | Exchange module: `connectPasskey()`, passkey branch in `payViaWallet`, fee in the balance check, `NOT_SENT` clears the pending record. Plus the "Play now" UI script (`#pxPasskeyWallet`) and its styles |
| `public/casino-b/index.html` | The same exchange-module change only (the test requires both pages to carry the same module). No UI, never loads the wallet script, so nothing changes there |
| Shared with the radio, behaviour unchanged | `passkey.ts` takes options (radio values are the defaults), `ui.ts` exports `panelUi`, `create-request.ts` takes a name pattern, `CancelledError` takes a message, `protocol.ts` lists the `casino.*` methods |

### How it behaves

- **Play now · no wallet needed** → the casino wallet opens as its own dialog above the page (not inside the exchange panel: the frame's
  confirm button only arms while fully visible with no blur, transform or overlap, and the panel has a blur and scrolls) → passkey
  made and proven (two matching PRF results) → Hiro faucet (500 STX) → as soon as the balance covers it, the exchange buys
  10 STX = 1,000,000 LAYR by itself → the exchange's existing check/credit flow credits it.
- The first buy is marked per address before it is asked for, so it never repeats (reload, second tab). The faucet is not asked
  again on its own within 10 minutes; "Get 500 free testnet STX" asks on demand.
- Every later buy goes through with no popup. Returning players see "Open my casino wallet · ST…", one tap.
- **No passkey? Play in this browser only** → a random testnet key kept in the box origin's own storage (never xtrata.xyz's).
  If the browser has no passkeys at all, Play now uses this directly.
- A buy that never reached the network (nonce read failed, refused by the node, box signed something else) throws `NOT_SENT` and
  the exchange drops its pending record. A broadcast whose answer was lost keeps the txid, and the normal confirmation check finds it.
- "I have a Stacks wallet" is the existing Xverse/Leather path, unchanged.

### Tests

```sh
npx vitest run src/lib/casino-wallet src/casino-wallet src/casino-room src/lib/listening-wallet src/listening-wallet src/lib/wallet/passkey
VITE_CASINO_WALLET_PARENTS=https://xtrata.test npm run build:casino-wallet && npm run build:casino-passkey
CHROME_PATH=<chrome or chromium> node scripts/test-casino-wallet-browser.mjs [screenshot-dir]
npm run build:casino-wallet   # rebuild with the production parent afterwards
```

The browser check runs the real casino page and the real box on separate origins with Chrome's virtual authenticator (PRF on and
off) and a fake Hiro testnet: create → faucet → auto-buy credited 1,000,000 LAYR → second buy with no popup → reload unlocks the
same wallet with no repeat buy; the browser-only wallet; flag off leaves the page unchanged; another site cannot embed the box.
It slows the page's render loop (headless software WebGL draws about one frame a second).

Found while testing: `scripts/test-listening-wallet-browser.mjs` (the radio's) fails at its first status check with or without
these changes. It expects `{ state, session }` and the box now also returns `features`. Worth refreshing separately.

### Ship it (Jim)

1. **Wallet origin.** Create a Cloudflare Pages project `xtrata-casino-wallet` (direct upload) and give it the custom domain
   `casino-wallet.xtrata.xyz`. Treat the hostname as permanent: passkeys bind to it.
2. `npm run build:casino-wallet`, then from `dist-casino-wallet`:
   `npx wrangler pages deploy . --project-name xtrata-casino-wallet --branch main`.
   Check: `curl -sI https://casino-wallet.xtrata.xyz/ | grep -i frame-ancestors` shows `https://xtrata.xyz`, and
   `curl -s -o /dev/null -w '%{http_code}\n' https://casino-wallet.xtrata.xyz/create` prints 200.
3. Commit and deploy the main site as usual (`public/casino/index.html`, `public/casino/passkey-wallet.js`, `public/casino-b/index.html`).
4. Try it: `https://xtrata.xyz/casino/?passkey=1` on desktop Chrome, an iPhone (new-tab passkey) and Android. `?passkey=0` turns it off.
5. To make it the default for everyone: in `#pxPasskeyWallet` (casino page), change `if(get(FLAG)!=='1')return;` to
   `if(get(FLAG)==='0')return;`.
