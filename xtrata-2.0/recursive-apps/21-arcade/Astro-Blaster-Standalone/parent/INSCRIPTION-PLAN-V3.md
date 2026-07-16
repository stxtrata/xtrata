# Astro Blaster v3 - Sandbox-Native Inscription Plan

v3 makes the game work from Xtrata's sandboxed embed surfaces (viewer/xplorer
`<iframe sandbox="allow-scripts" srcdoc>`), not just top-level pages. Token #73
(the v2 parent) fails there because: sandboxed iframes get no wallet extension
providers, no query string (so no `walletBridgeToken`), an opaque origin (so
`postMessage(..., location.origin)` never delivers), relative `/hiro/...` URLs
that cannot resolve, and silently-ignored `alert()/confirm()`.

## What changed

Inscription-side (new files, old leaves reused):
- `modules/main-v3.js` — replaces the `main` leaf (old id 87):
  - all `alert()`/`confirm()` replaced with in-DOM notices (`arcadeNotify`)
  - never runs in-frame `@stacks/connect` auth when the provider is the host
    bridge shim (popups are blocked in the sandbox; the HOST runs the real
    wallet prompt instead)
  - when no wallet is reachable at all, emits an `open-runtime` intent so the
    host opens `/runtime/` top-level ("claim your score" path)
- `parent/astro-blaster-parent-v3.template.html` — replaces the parent (#73):
  - hello handshake: broadcasts `xtrata:wallet:hello` (targetOrigin `'*'`,
    nonce); a wallet-capable host replies `xtrata:wallet:hello-ack` with a
    bridge token; the provider shim then installs even in sandboxed embeds
  - `?walletBridgeToken=` still works as the fast path on `/runtime/`
  - all outgoing postMessage uses the acked host origin (or `'*'` when the
    document origin is opaque); responses are matched by request id and, when
    known, host origin
  - absolute-first API bases: `<real-origin>/hiro/<net>` when the document has
    a real origin, otherwise the literal `https://api.mainnet.hiro.so` (which
    Xtrata's embed pipeline rewrites to its caching proxy)
  - `window.ArcadeHostBridge` (hasBridge/getInfo/requestRuntimeOpen) exposed
    to the modules; `CONFIG.parentTokenId` + `CONFIG.runtimeOrigin` drive the
    claim deep link

Host-side (xtrata-2.0 site, deploy BEFORE relying on embedded wallet flow):
- `src/App.tsx` — answers `xtrata:wallet:hello` (mints + registers a bridge
  token), accepts token-validated requests from opaque-origin (srcdoc) frames,
  and handles `open-runtime` intents (rebuilds the URL on our origin with
  whitelisted params only, adds a fresh bridge token, window.open)
- `src/home/main.js` — additive tail listener: handles `open-runtime` intents
  on the public homepage/xplorer (opens `/runtime/` top-level; no bridge token
  needed there because wallet extensions inject real providers top-level)
- `parent/fill-inscription-ids.mjs` — field replacement now scoped to the
  CONFIG block (the old whole-document regex matched runtime code and threw);
  `--parent <id>` now also fills `parentTokenId` in v3 templates

## Reused leaf inscriptions (do NOT re-inscribe)
1. styles — #69
2. utils — #70
3. gameRuntime — #71 (game01_astro_blaster v2.37)
4. highscores — #80

## New inscriptions (2)
1. `modules/main-v3.js` as `text/javascript` → note its new id `<MAIN_V3_ID>`
2. Fill ids, then inscribe the parent:

```bash
node parent/fill-inscription-ids.mjs \
  --template parent/astro-blaster-parent-v3.template.html \
  --styles 69 --utils 70 --highscores 80 --game-runtime 71 \
  --main <MAIN_V3_ID>
```

Inscribe `parent/astro-blaster-parent-v3.template.html` as recursive parent,
dependency order `[69, 70, 80, 71, <MAIN_V3_ID>]`. Then:

```bash
node parent/fill-inscription-ids.mjs \
  --template parent/astro-blaster-parent-v3.template.html \
  --parent <PARENT_V3_ID>
```

(The parent-id fill only affects the claim deep link; the already-minted
parent works without it, linking to `/runtime/?contractId=...` sans tokenId.)

## Verify BEFORE inscribing

```bash
# from Astro-Blaster-Standalone/ (needs playwright; chromium path may differ)
npm i playwright
node sandbox-test/run-harness.mjs
```

The harness hosts the v3 parent in a real `sandbox="allow-scripts"` srcdoc
iframe with mocked get-chunk reads and a scripted wallet host, and asserts:
boot + all 5 modules injected; hello handshake grants the bridge; Connect
drives the bridge (badge shows the address); `submit-score` rides the bridge
and returns a txId; and with a host that ignores hello, the game still boots,
shows an in-DOM notice (no alert) and emits the `open-runtime` intent.
Both scenarios pass as of 2026-07-16.

Manual check: `sandbox-test/host.html` over any local HTTP server; the
checkbox toggles whether the mock host grants the bridge.

## Expected behavior after deploy
- Embedded viewer/xplorer (workspace app): play + live leaderboard reads via
  proxy; Connect works in-place via the hello-granted bridge (wallet popup is
  triggered by the host page); submit-score opens Xverse from the host.
- Embedded on the public homepage: play + reads; Connect falls back to the
  claim path — homepage opens `/runtime/` top-level where Xverse injects
  providers directly.
- `/i/<id>` or `/runtime/` top-level: wallet extensions inject providers;
  main-v3 uses the normal @stacks/connect flow.
- Raw gateway with no Xtrata host at all: play + reads (absolute Hiro URL),
  local personal best, in-DOM notice pointing at xtrata.xyz for submissions.

## Known follow-ups
- `highscores.js` (#80) still contains one `window.alert` on submit failure —
  harmless (ignored) in sandboxes, works top-level. Roll into the next
  highscores leaf revision.
- Homepage host only handles the open-runtime intent; if in-place embedded
  wallet flow is wanted on the public site later, port the App.tsx hello
  responder + request handler onto the homepage wallet session.
- Attestation stays off (`requiresAttestation: false`); the oracle
  (`functions/arcade/attest-score.ts`) + v1.1-style verification can be turned
  on later via config without re-inscribing.
