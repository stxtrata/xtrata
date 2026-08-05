# Testing the board before it is inscribed

An inscription cannot be fixed. Everything below exists because the environment
an inscribed board runs in is not the one it has been tested in, and the
differences are not cosmetic.

This is written from reading the runtime rather than assuming it. Sources:
`xtrata-2.0/public/runtime/index.html`, `public/runtime/wallet-shim.js`,
`functions/runtime/html-hiro-rewrite.ts`, `functions/inscription/handler.ts`.

---

## What actually happens when someone opens an inscription

Not "the browser loads your file". The runtime viewer:

1. Fetches the inscription's bytes from chain.
2. Injects four things into the `<head>`:
   - `<base href="{moduleBase}">`
   - `/runtime/url-support.js`
   - `/runtime/module-bootstrap.js`
   - `/runtime/wallet-shim.js?network=…&walletBridgeToken=…`
3. `document.open()` → `document.write(html)` → `document.close()`.

So the page is written into an existing document, with a base tag it did not
ask for and three scripts it did not include, one of which is the only route to
a wallet.

**Separately**, at serve time, `html-hiro-rewrite.ts` rewrites
`https://api.mainnet.hiro.so` to `/hiro/mainnet` inside the bytes — but only
when the MIME type is `text/html`.

---

## The findings that matter

### 1. The API rewrite will not reach our engine — FIXED

The rewrite exists because inscribed apps calling Hiro directly burn the public
per-IP rate limit; the comment in that file cites "hundreds of 503s on /i/350".
The site's proxy at `/hiro/<network>` gives every viewer a shared cache instead.

It only rewrites `text/html`.

Our architecture puts every API call in `xtrata-chess-engine.js`, which is
inscribed as **JavaScript, not HTML**. The thin board is HTML and gets rewritten,
but contains no API URLs. So:

> The engine keeps calling `api.mainnet.hiro.so` directly, and every viewer of
> every game burns the public rate limit.

This is invisible with one viewer and becomes 503s under load. It is the single
biggest risk on this list, it is a consequence of the engine split rather than a
bug, and it is fixable before inscribing: the engine should prefer
`/hiro/<network>` when it can see it is running under the runtime, and fall back
to the absolute host otherwise.

**Resolved.** `src/api-base.js` chooses the base at runtime: the proxy when it can
see the runtime's injected scripts, the public host otherwise, and a build-time
override above both. It also falls back to the public host if the proxy stops
answering, because an inscription cannot be corrected and must degrade rather
than break. Only a transport failure or a 5xx counts as unavailable, so a 404
from a contract read is never mistaken for a dead proxy.

Verified in the harness: 38 API requests, every one through `/hiro/mainnet`.

### 2. The wallet arrives from outside the page

`window.StacksProvider` is the shim, injected in `<head>` as an external script.
The board already resolves providers per call rather than at startup and prefers
the shim when present, which is exactly right.

Reading the shim closes a question I had assumed away. `stx_callContract` is not
merely routed through the shim, it is **refused** unless a host bridge exists:

```js
if (isContractCallMethod(lower)) {
  if (!hasHostBridge()) {
    return Promise.reject(createShimError(
      'Wallet contract call requires host wallet bridge support.', -32601));
  }
  return requestHostBridge(lower, params);
}
```

A host bridge exists only when the page carries a `walletBridgeToken` and has a
parent or an opener. The Xtrata site supplies one — `src/App.tsx` and
`TokenContentPreview.tsx` both mint a token and validate it on the way back, for
the embedded preview and for open-in-a-new-tab alike. So the normal path works.

What does not work is a raw link to `/i/<id>` with no token. Reads are fine and
the board renders, but no move can be signed. That is worth saying on the board
rather than letting someone meet it as a failed transaction.

The shim also patches `window.LeatherProvider` and the Xverse Stacks providers
in place, so a board cannot sidestep it by preferring an extension.

### 3. The board started twice, and every click did twice the work — FIXED

Found by the harness on its first serious run, and only visible there.

`boot.js` auto-started when `document.currentScript` was set, on the reasoning
that a classic script wants starting and a module import does not. Inside the
built engine both are true at once: the bundle is a classic script, so
`currentScript` is set while the bundled module bodies run, and the bundle's own
footer calls `boot()` as well.

Two boards. `mountShell` sees the markup already there and leaves it alone, so
the page looks perfect and every button carries two listeners.

Measured in the harness, one click:

| | before | after |
|---|---|---|
| Connect | 2 `wallet_connect` | 1 |
| Submit move | 2 `stx_callContract` | 1 |

Two wallet prompts, two transactions, two fees, and two entries in a log that
cannot be edited — for one intended move.

The dev page imports `boot.js` as a module, where `currentScript` is null, so
this never appeared in development. It existed only in the artifact that gets
inscribed.

Fixed by removing the redundant auto-start — every entry point already calls
`boot()` explicitly — and by making `boot()` return the board it already
started, so a double call is harmless however it arises. `tests/boot-once.test.js`
covers both the behaviour and the built file.

---

## Stage 1 · A harness that replicates the runtime

Local, free, and repeatable. Reproduce all four injections and the
`document.write` path against the real built artifacts, using the **actual**
`wallet-shim.js` and `runtime/index.html` copied from xtrata-2.0.

Serve the engine at a path that behaves like `/i/<id>` with a JavaScript
content type, and the board at one that behaves like `/i/<id>` with an HTML
content type, applying the Hiro rewrite to the HTML exactly as the worker does.

`scripts/harness.mjs`, port 4331. It reads the runtime scripts from xtrata-2.0
rather than copying them, so it cannot drift from what the site serves.

- [x] The board survives being `document.write`-n rather than loaded
- [x] The injected `<base href>` does not break any relative URL we rely on
- [x] `<script src="/i/<engineId>">` resolves and executes
- [x] The engine self-mounts its shell into a page written this way
- [x] The real shim is found, and preferred over anything else
- [x] The board reads game state through whatever base survives the rewrite
- [x] Nothing in the console, and no request to a host we did not intend

Measured: 38 API requests, every one through `/hiro/mainnet`, none direct.

What it cannot catch: the real wallet's own dialogs.

## Stage 2 · Framed, with a bridge token

```bash
node scripts/harness.mjs --framed --wallet=stub
```

The host mints a token, frames the viewer, validates the token on every request
and drives a wallet. `--wallet` chooses what plays the wallet: `real` for
whatever extension the browser has, `stub` to exercise the path with none
installed, `refuse` to see a rejection reported, `silent` to prove nothing hangs.

- [x] The frame is framed and the shim carries the token
- [x] A connect request reaches the host rather than dying in the frame
- [x] `forceWalletSelect` survives the hop, so the wallet still prompts
- [x] A contract call round-trips with everything intact
- [x] A request carrying the wrong token is refused before a wallet sees it

The payload that arrived at the host for one move:

```json
{ "contract": "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-chess-log-v2",
  "functionName": "submit-move",
  "arguments": ["0x0100000000000000000000000000000001", "0x0d0000000461326133"],
  "fee": 10000,
  "postConditionMode": "deny",
  "postConditions": ["000216e55cbbaafd88b6e63b036a3a2303b029e039cbbd0500000000000003e8"] }
```

Worth reading rather than glancing at. The arguments are game 1 and the ASCII
`a2a3`. The fee is a number, not a string, which is what stops a wallet
estimating half a STX. The post condition names the connected signer and caps
the transfer at 1,000 µSTX — which is the fee the contract is *currently*
charging, not the 10,000 it was deployed with. The owner lowered it, and the
board read it live and wrote the guard around what it read.

## Stage 3 · Mainnet, in the order that costs least

There is no Xtrata testnet, so there is no rehearsal. Mainnet is the smoke test,
and the only lever left is ordering it so that being wrong is cheap.

1. **Engine** — ~150KB, and the expensive mistake. Everything depends on it and
   every child inscription names it, so a wrong engine costs the lineage as well
   as the bytes. Stage 1 and 2 exist to make this step boring.
2. **A throwaway board** pointing at that engine. Two hundred bytes. This is the
   real smoke test: the first time the whole path is genuine.
3. **Open a game and play a move through it**, at 0.01 STX a move. Only now is
   the wallet path proven end to end under the real runtime.
4. **The board people are given**, once a game has actually been played through
   the throwaway. Another two hundred bytes.

If step 3 misbehaves, the loss is one throwaway board and a couple of moves.

- [ ] Engine loads from `/i/<id>` and self-mounts
- [ ] Board reads the contract through `/hiro/mainnet`, not the public host
- [ ] Connect opens the wallet from an inscribed page
- [ ] A move signs with the fee and post condition the board displayed
- [ ] The move lands and the board replays to the right position
- [ ] A second browser, cold, agrees on the position

---

## What can never be tested beforehand

Stated plainly, because these are the risks that remain however much testing is
done:

- **The runtime can change.** The board depends on the shim's behaviour, the
  injected base tag, and `/hiro/<network>` continuing to exist. An inscription
  cannot adapt.
- **Wallets change.** The provider quirks encoded in `src/wallet.js` are true of
  the wallets shipping today.
- **The contract is immutable.** v2 has an owner who can change the fee up to
  the ceiling; the board reads it live, so a fee change does not break it.
- **Nothing about a sealed game.** A sealed game embeds its own log and touches
  no network, so it is the one artifact with no runtime dependency at all. That
  is the argument for sealing finished games rather than linking to them.

## The gate

There being no testnet changes what the gate can be. It cannot be "we have done
this once already"; it can only be "everything reproducible has been reproduced,
and the first irreversible step is the cheapest one available".

Do not inscribe the engine until stages 1 and 2 are green in the harness, since
that is the one artifact whose replacement costs more than bytes.

After that, the ordering is the safety net: a throwaway board proves the path
for two hundred bytes before anybody is given a link.
