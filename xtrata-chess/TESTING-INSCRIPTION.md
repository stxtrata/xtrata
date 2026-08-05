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

## The two findings that matter

### 1. The API rewrite will not reach our engine

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

**Must be settled before inscribing.** Everything else can be verified.

### 2. The wallet arrives from outside the page

`window.StacksProvider` is the shim, injected in `<head>` as an external script.
The board already resolves providers per call rather than at startup and prefers
the shim when present, which is exactly right — but it has only ever been tested
against a shim I wrote in a console, never the real one.

---

## Stage 1 · A harness that replicates the runtime

Local, free, and repeatable. Reproduce all four injections and the
`document.write` path against the real built artifacts, using the **actual**
`wallet-shim.js` and `runtime/index.html` copied from xtrata-2.0.

Serve the engine at a path that behaves like `/i/<id>` with a JavaScript
content type, and the board at one that behaves like `/i/<id>` with an HTML
content type, applying the Hiro rewrite to the HTML exactly as the worker does.

What this catches:

- [ ] The board survives being `document.write`-n rather than loaded
- [ ] The injected `<base href>` does not break any relative URL we rely on
- [ ] `<script src="/i/<engineId>">` resolves and executes
- [ ] The engine self-mounts its shell into a page written this way
- [ ] The real shim is found, and preferred over anything else
- [ ] The board reads game state through whatever base survives the rewrite
- [ ] Nothing in the console, and no request to a host we did not intend

What it cannot catch: the shim's bridge mode with a genuine host, and the real
wallet.

## Stage 2 · Framed, with a bridge token

The shim routes over `postMessage` when the page is framed and carries a
`walletBridgeToken`. Run the harness inside an iframe with a token and a host
that answers `xtrata:wallet:request` and replies `xtrata:wallet:response`.

- [ ] `usingHostBridge()` reports true
- [ ] A connect request reaches the host rather than dying in the frame
- [ ] A contract call round-trips, post conditions and fee intact
- [ ] A host that never answers times out rather than hanging forever

## Stage 3 · Testnet, end to end

Deploy v2 to testnet, inscribe the engine and a board there, and play a game
through the real runtime with a real wallet. This is the first point at which
the whole path is genuine.

- [ ] Connect from an inscribed page opens the wallet
- [ ] A move is signed, with the fee and the post condition the board showed
- [ ] The move appears, and the board replays to the right position
- [ ] Two browsers agree on the position
- [ ] The mempool view shows an in-flight move to the other viewer

## Stage 4 · Mainnet, in the order that costs least

Inscribe in an order where each step is cheap to abandon:

1. **Engine** — the expensive one, ~150KB. Everything depends on it, so it is
   worth being certain first.
2. **A throwaway board** pointing at the engine. If something is wrong, a
   200-byte inscription is a cheap mistake.
3. **Play a real game through it**, at 0.01 STX a move.
4. **The board people are given**, only once a game has actually been played
   through the throwaway.

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

Do not inscribe until finding 1 is resolved, stage 1 is fully green, and a game
has been played end to end on testnet through the real runtime.

Everything else is recoverable by inscribing a corrected board, which costs a
few hundred bytes. A wrong engine costs 150KB and a broken lineage, because
every child inscription names it as a dependency.
