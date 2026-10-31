# ParallaX Casino: joining the room with the casino wallet (plan)

Written 2026-10-31. **Status: BUILT 2026-10-31 (steps 1-6), not yet deployed.** Decisions in section 7. Testnet.

Deploy: wallet box (`npm run build:casino-wallet` + `wrangler pages deploy`), the room Worker
(`npx wrangler deploy --config workers/casino-room/wrangler.toml`), then the site. Checks: `npx vitest run functions/lib/__tests__/casino-room*
src/casino-wallet src/lib/casino-wallet src/casino-room` and `scripts/test-casino-wallet-browser.mjs` (rooms R1, R2).

Goal: anyone using the casino's own wallet (the passkey wallet or the browser-only wallet from
`docs/plans/CASINO-PASSKEY-WALLET-PLAN.md`), on a phone or anywhere, can join the room (be seen at seats and machines, walk the
floor, chat) exactly like a Leather or Xverse player. Today the room's "Join the room" panel offers only Leather and Xverse.

## 0. The plan in seven lines

1. Joining the room is one free SIP-018 signature over a fixed sentence (`functions/lib/casino-room-proof.ts`); the server
   recovers the public key and checks it is the address that asked. The casino wallet can make exactly that signature.
2. So the **sign-in server does not change**: same challenge, same session cookie, same names. The only server change is the
   switch that turns anonymous watching off (step 6).
3. The casino wallet box gets ONE new method, `casino.signRoomJoin`: it rebuilds the room sentence itself from the challenge and
   signs only that (domain "ParallaX Casino", its own address, a fresh challenge). It can never be used to sign anything else.
4. The room panel gets a third button next to Leather and Xverse: **Casino wallet**. It opens the same casino wallet the exchange
   uses (one wallet for both), signs the join in the box, and the rest of the room flow is unchanged.
5. A passkey wallet is the same address on every device where the passkey syncs, so a player is the same person in the room
   on their phone and laptop. A browser-only wallet is one identity per browser.
6. **Sign in on arrival (Jim, 2026-10-31).** Every visitor is asked to join the room as soon as they arrive, and anyone who
   connects a wallet (at the exchange or anywhere) is signed into the room straight away. Anonymous watching is OFF by default,
   behind a server switch that can turn it back on later.
7. Later: an **Other Stacks wallet** button through the standard wallet chooser (wallets that are neither Leather nor Xverse),
   and nicknames for players with no BNS name.

## 1. How the room sign-in works today (read from the code)

| Step | Where | What |
| --- | --- | --- |
| Connect | `src/casino-room/wallet.ts` `connectWallet(kind)` | Leather or Xverse only (`WalletKind = 'leather' \| 'xverse'`); returns `{ kind, address, network, via }` |
| Challenge | `POST /casino/room/challenge?address=…` | Stateless, HMAC-signed, 2 minutes, network from the address (ST → testnet chain id) |
| Sign | `src/casino-room/main.ts` `signIn()` | `requestStructuredSignature({ domain, message })` with `roomProofData(challenge)`: domain `ParallaX Casino` v1, message = one plain sentence with account, expiry and nonce |
| Verify | `functions/lib/casino-room-proof.ts` `verifyRoomProof` | `sha256(encodeStructuredData(...))`, `publicKeyFromSignatureRsv`, address must match; identity = hash160 of the key |
| Session | `POST /casino/room/session` | 4 h HMAC cookie; no more signatures for seats, moves, chat |
| UI | `main.ts` `paint()` | "Join the room" lists buttons for `['leather', 'xverse']` |

The radio wallet already signs SIP-018 the same way (`signMessageHashRsv` over `sha256(encodeStructuredData(...))`, RSV hex,
in `src/lib/listening-wallet/link.ts` and `slots.ts`), so this is a known, tested pattern in the repo.

## 2. Build steps

### Step 1. Wallet box: `casino.signRoomJoin` (src/casino-wallet/frame/engine.ts)

- Params: `{ address, network, nonce, expires }` (the public fields of the room challenge; the MAC stays on the page).
- Refuse unless: the wallet is open; `address` is the open wallet's own address; `network` is `testnet` (the casino wallet is ST);
  `nonce` is 64 hex; `expires` is in the future and no more than 2 minutes 30 s away (the room's TTL plus clock skew).
- Build `roomProofData({ address, network, nonce, expires })` with the room's own function (import from
  `functions/lib/casino-room-proof.ts`, or move `roomProofText`/`roomProofData` into `src/lib/casino-room/proof-data.ts` and import
  it from both sides so the box bundle does not pull in the HMAC/session code), hash it, `signMessageHashRsv`, return
  `{ signature }` (RSV hex). `assertNoSecrets` already allows this shape.
- No panel while the wallet is open (decision 1): the player's tap on **Casino wallet** in the room is the consent, the message is
  fixed, free and moves nothing. If the wallet is locked, the page opens it first (one passkey tap, or one tap for browser-only).
- Add `casino.signRoomJoin` to `WalletMethod` / `WALLET_METHODS` in `bridge/protocol.ts`, and `'room'` to `CASINO_FEATURES` so the
  page can tell an older box (no room button until the box is redeployed).

### Step 2. Page side: `ParallaxPasskeyWallet.signRoomJoin(challenge)` (src/casino-room/passkey-wallet.ts)

- Sends the four public fields, gets the signature, and checks it locally with `verifyRoomProof` before posting it (same
  "check before use" rule as buys).

### Step 3. One wallet for the exchange and the room (public/casino/index.html, `#pxPasskeyWallet`)

Expose a tiny helper for the room client, so both use the same open wallet and the same "what does this device hold" logic:

```js
window.ParallaxCasinoWalletUI = {
  available(),          // the box is loaded and answers 'room'
  describe(),           // { label: 'Casino wallet · ST2DP…T9DH' | 'Make a free casino wallet', mode: 'unlock'|'device'|'create' }
  open()                // opens it through the exchange client (ex.connectPasskey), returns the address; no faucet, no buy here
};
```

Opening an existing wallet from the room does not fund or buy. A wallet made new from the arrival prompt does (step 5), using the
exchange's own `fundAndBuy` (faucet not repeated within 10 minutes, first buy never repeated), so one tap gives a new player a
wallet, a room seat and chips. Expose it as `ParallaxCasinoWalletUI.fundNew()`.

### Step 4. Room client (src/casino-room/wallet.ts, main.ts)

- `WalletKind` gains `'casino'`. `connectWallet('casino')` calls `ParallaxCasinoWalletUI.open()` and returns
  `{ kind: 'casino', address, network: 'testnet', via: 'casino-wallet' }`.
- `signIn()`: for `kind === 'casino'`, get the signature from `ParallaxPasskeyWallet.signRoomJoin(challenge)` instead of
  `requestStructuredSignature`. Everything after (session POST, cookie, reconnect) is unchanged.
- `rememberProvider` is skipped for `'casino'` (it only matters for extension signing).
- `paint()`: the "Join the room" row shows **Casino wallet** (label from `describe()`) when `available()`, alongside Leather and
  Xverse. On a phone with no extension it is the obvious button; for a brand-new visitor with no casino wallet it reads
  "Make a free casino wallet" and makes one (passkey, or browser-only where passkeys are not available).
- Errors: "Cancelled in the casino wallet" from the box is shown as a quiet cancel, like the extension cancels.
- Rebuild `room.js` (`npm run build:casino-room`) and bump its `?v=` in the page.

### Step 5. Sign in on arrival (src/casino-room/main.ts, public/casino/index.html)

When the room is on and the visitor has no live room session (the 4 h cookie):

| Visitor | What they see on arrival |
| --- | --- |
| Has a casino wallet on this device | The Join panel opens by itself: **Sign in as ST2DP…T9DH**. Passkey wallet: one passkey tap (unlock), then the join is signed silently. Browser-only: one tap |
| Connected Leather/Xverse here before (`STX_PROVIDER`) | The Join panel opens with that wallet first: one wallet signature, as today |
| Brand new (no wallet, no chips) | The Join panel opens with **Make a free casino wallet** first (Leather/Xverse below). One tap makes the passkey wallet, signs into the room, and, as at the exchange, gets 500 free testnet STX and buys the first 1,000,000 LAYR (same once-only rules: faucet not repeated within 10 min, first buy never repeated) |

- **Connect anywhere = sign in.** When a wallet connects at the exchange (casino wallet or extension) and there is no room session,
  the room client signs in straight away: casino wallet silently, Leather/Xverse with their usual signature popup. The exchange
  announces it with a `px-wallet-connected` window event `{ kind, address }`; the room client listens for it.
- **Not now** closes the panel. The casino stays playable solo; with anonymous watching off they simply do not see or appear in
  the room. They are asked again on their next visit, and the Room button is always there.
- A live session (signed in less than 4 h ago, same browser) means no prompt at all.
- The prompt waits until the page is loaded and the visitor has had a moment (about 2 s after the casino is ready), and never
  opens over a game in progress (`currentSpot()` is null), so it does not interrupt a hand.

### Step 6. Anonymous watching off by default (server switch)

Today a visitor who has not signed in is a **guest**: their socket receives the whole room (who sits where, walkers, spins), they
just are not shown to others (`functions/lib/casino-room.ts`).

- New Pages variable `CASINO_ROOM_GUESTS`. Unset or anything but `1` = **off** (the new default). `1` = today's behaviour.
- Off: a guest connection receives only the counts (`joined`, `guests`) and the room's `features`, so the page can still say
  "12 people in the room · sign in to join them". No spots, walkers, spins or chat until the session cookie is presented.
- The Durable Object already marks each peer as guest or signed (`a` null or an address); the change is where it builds the
  view and where it fans out spins and moves (`roomView`, the `play` and `move` broadcasts): skip or reduce for guests when the
  switch is off. Pass the switch from the HTTP layer (`casino-room-http.ts`) into the object with the connection.
- The room's `hello` tells the client whether guests can watch, so the panel text matches.
- Tests: `functions/lib/__tests__/casino-room*.test.ts` gain guest-off cases (a guest sees counts only, no spins, no moves, no
  chat; a signed player sees everything; switch on = unchanged).

### Step 7. Names

Casino wallets have no BNS name, so the room shows a short address (as it already does for any address without one). That is
fine for testing. A nickname (signed once, stored by the room) is a separate, optional piece (decision 4).

## 3. What changes and what does not

| Piece | Change |
| --- | --- |
| `functions/casino/room/*` sign-in, cookie, chat | **None** |
| Durable Object (`functions/lib/casino-room.ts`) | Guests see counts only unless `CASINO_ROOM_GUESTS=1` (step 6) |
| `functions/lib/casino-room-proof.ts` | None, or only moving the two message-building functions to a shared file |
| Wallet box (`casino-wallet.xtrata.xyz`) | One method; **redeploy needed** |
| `public/casino/passkey-wallet.js` | One function; rebuild |
| `public/casino/room.js` | Third button, casino branch in sign-in, arrival prompt, sign in on connect; rebuild |
| `public/casino/index.html` | `ParallaxCasinoWalletUI` helper; `room.js?v=` bump |
| `public/casino-b/` | Nothing |

## 4. Safety

- The box signs only the room sentence for its own address with a fresh expiry. A hostile page that got the wallet open could at
  most sign the player into the room (which the player was doing anyway); it cannot sign a transaction or any other message
  through this method. The sign-in grants nothing beyond being seen and chatting for 4 hours.
- A different SIP-018 domain from every other Xtrata signature (room-proof.ts already guarantees that), so a room signature can
  never be replayed elsewhere.
- Same identity rules as today: the session is per key (hash160), so a passkey wallet is one person across devices.

## 5. Tests

- Unit: `casino.signRoomJoin` output passes the server's own `verifyRoomProof` (`functions/lib/casino-room-proof.ts`) for a
  challenge from `issueRoomChallenge`; refuses another address, mainnet, an expired or far-future expiry, a bad nonce, a locked wallet.
- Unit: the bridge still refuses `casino.*` on the radio box and `listening.*` on the casino box.
- Room client: `connectWallet('casino')` with a fake `ParallaxCasinoWalletUI`; `signIn` posts the box signature, not an extension one.
- Browser (extend `scripts/test-casino-wallet-browser.mjs`): mock `/casino/room/challenge` and `/session` with the real
  issue/verify functions and the room WebSocket with Playwright's `routeWebSocket`; a new player taps Room → Casino wallet →
  passkey → signed in; a second context with the same virtual passkey credential signs in as the same address (the cross-device
  case); a browser-only wallet signs in; Leather/Xverse buttons unchanged.
- Browser: arrival prompt for each visitor type in step 5; connecting at the exchange signs into the room; a valid cookie means
  no prompt; "Not now" leaves the casino playable and the room hidden.
- Real devices: iPhone Safari (passkey made in a new tab, then join), Android Chrome, desktop.

## 6. Order of work

| # | Step | Ships alone? |
| --- | --- | --- |
| 1 | Box method + unit tests, redeploy the box | Yes, nothing uses it yet |
| 2 | Page side `signRoomJoin` + `ParallaxCasinoWalletUI` | Yes |
| 3 | Room client button + sign-in branch, rebuild room.js | Yes (the button shows only when the box answers `room`) |
| 4 | Arrival prompt + sign in on connect | Yes |
| 5 | Guests off: server switch, deploy (off by default) | Yes; set `CASINO_ROOM_GUESTS=1` to undo |
| 6 | Browser test, real devices | |
| 7 | Later: Other Stacks wallet, nicknames | Later |

## 7. Decisions (Jim, 2026-10-31)

1. **No extra box prompt when joining.** The tap in the Room panel is the consent; the box prompts only to unlock.
2. **Everyone is asked to sign in on arrival, and anyone who connects a wallet is signed into the room straight away.**
   Anonymous watching is off by default (`CASINO_ROOM_GUESTS` unset), with the switch to enable it later.
3. **Other Stacks wallet:** later phase.
4. **Nicknames:** later phase.

Open point (default chosen so work can start): "anonymous use off" is taken to mean the ROOM (seeing and being seen, chat). The
casino games stay playable solo for someone who taps "Not now". If it should mean no play at all without signing in, the arrival
prompt becomes a gate with no "Not now"; that is a one-line change in step 5.
