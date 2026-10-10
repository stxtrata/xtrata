# SNES catalogue launch canary

Single-file browser page (`canaries/build/snes-catalogue-canary.html`) that takes the on-chain SNES catalogue from nothing to registered and emulator-tested. Build: `npm run build:canary:snes-catalogue`. Mock-chain test: `NODE_PATH=<playwright + @stacks/transactions@6> CHROME_PATH=<chromium> node canaries/snes-catalogue/mock-chain-test.cjs` (runs the whole flow twice; the second run follows "Forget local progress" and must send nothing).

**Mainnet only.** It targets the live Xtrata core `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3`.

## What it does (23 steps, each re-runnable, each re-reads the chain)

1. Connect wallet, preflight (pins, core open, fee quotes, what is already on chain).
2. Deploy `snes-game-catalogue-v1` (Clarity 4), verify; deploy `snes-xtrata-adapter-v3-2-3`, verify it reads the live core.
3. Inscribe each game's ROM, cover and icon (13 inscriptions, one transaction each), then read every byte back.
4. A temporary in-browser wallet (key saved to a file first) takes the admin role, allows the adapter, enrols your wallet as publisher, adds the 5 games, transfers each to your wallet, registers each ROM, and proves a duplicate hash and a wrong size are refused. Admin goes back to your wallet, a stranger is refused, the temporary wallet is swept.
5. Reads the whole catalogue back as the Arcade page will, loads every game into the real emulator through the contract (and refuses a tampered ROM), loads the same ROMs from local files and checks they are recognised by hash, then opens every game by its inscription ID (the emulator must not claim "Verified on-chain copy" for these) and checks the refusals.
6. Final audit. A management panel stays on the page for the owner powers afterwards (publishers, hide/show, core/community tab, revoke a version, token gate, admin hand-over).

## Cost and signatures

- Web-wallet signatures: **18** (2 deploys, 13 inscriptions, 1 funding transfer, propose-admin, accept-admin). About 26 more calls are signed in the page by the temporary wallet.
- Core fees are quoted live from the core and capped by deny-mode post-conditions. Network fees at the 0.02 STX floor apply to the temporary wallet's ~27 transactions (about 0.6 STX is sent to it; unspent funds are swept back). The ~1.2 MB of inscriptions cost about 1 STX per MB in core fees plus per-transaction network fees. Preflight prints the estimate for the connected wallet.

## Not covered

- Staged upload (files over 512 KB) is implemented but not exercised: every current file fits one transaction.
- The publisher token gate is not exercised (no gate is set at launch).
- Nothing is deployed, signed or inscribed until the owner opens the page and approves each wallet prompt.

## Pinned

Catalogue, adapter, emulator v1.0, ROMs and art are pinned in `scripts/build-snes-catalogue-canary.mjs`; the build refuses a mismatch and prints the new value for an intended change. `ROM MIME` is `application/x-snes-rom`; `profile` is empty for the test games (scoring not set up yet) and cannot be changed on a version after registration.

## Local harness (no wallet, no network, no cost)

`npm run build:snes-harness` builds `canaries/build/snes-arcade-harness.html`. Open it from disk (double-click) or, to test the emulator's Fullscreen button too, serve the folder (`cd canaries/build && python3 -m http.server 8080`, then open `http://localhost:8080/snes-arcade-harness.html`): browsers refuse fullscreen inside a frame on a `file://` page. It runs the real emulator, the Arcade wrapper's loading code (`wrapper.ts`, the same module the canary runs against mainnet) and an in-page mock chain (`harness/mock-node.ts`, mirroring the catalogue contract's rules and error codes). Start state: the five games registered as after the launch.

- Pick a game from the emulator's Games menu: loads from a mock inscription, hash-checked, "Verified on-chain copy".
- Use the emulator's own Load ROM: a local file, matched to the catalogue by hash.
- Open by inscription ID: matched, unlisted (play only) or refused (missing, unsealed, other core, too big).
- Act as you (admin), a publisher or a stranger: inscribe a ROM file, register a game, add a version, hide, move between Core and Community, revoke, enrol publishers. The emulator's menu follows each change.
- Tamper switch (a menu pick must be refused), an inscription that is never sealed, reset to launch state or to empty. Changes are remembered in the browser.

Test: `NODE_PATH=<playwright> CHROME_PATH=<chromium> node canaries/snes-catalogue/harness/harness-test.cjs` (menu, local file, ID matched / unlisted / refused, publisher and stranger, community tab, duplicate hash, tamper, reload).

## Key hints (added 9 Oct 2026)
The emulator's on-screen pad now prints the player's keyboard key on each button (default Z = B, X = A, A = Y, S = X, Q = L, W = R, Enter = Start, Shift = Select). The letters follow rebinds and "Reset to defaults". A **Key hints** switch in Display settings turns them off (remembered, default on). The harness also has a switchable **Controls** card for the Arcade wrapper to copy; it only knows the default keys.
**This changed the emulator page**: the pinned emulator is now sha256 `853987b1c7699e0f29d4e5c83bfbe3cf08497219184662ee1bde5c8d106af0b7` (357288 bytes), release `8cc56f4f2965a90f917357530bf766419cb4e39bc443d2303b408ad38231a30a`. The earlier `98ef0e15…` build is superseded; inscribe only the new one. Core script unchanged (`69f2d2fc…`).

## Decisions (9 Oct 2026)
MIME `application/x-snes-rom`; empty scoring profile and undeclared boards on test games; STAR PATROL without art; deploy from the wallet that will stay admin; whitelist only for now, token-gate asset to be chosen before outside publishers. Still untested: token gate, staged upload route.

## Ranked start (added 9 Oct 2026, before inscription)
New bridge request `ranked-start {seed}` (API `XtrataSNES.rankedStart(seed)`, capability `ranked-start`): a clean cold boot whose battery RAM is zero except a 32-byte seed at offset 0. The player's stored save is neither read nor written during the run (autosave and Clear are blocked), the run stays replayable, and the seed goes into the replay log: XSR1 **version 2** carries the 32-byte seed after the profile id; unseeded runs still produce version 1, byte-for-byte as before. `replay()` and `playReplay()` apply the seed from the log (or `opts.seed` for a raw run list). Reset or loading another ROM leaves ranked mode and restores the stored save. `info().ranked` reports the mode. The ROM must have at least 32 bytes of battery RAM (STAR PATROL and the four test games do). Test: `ranked-test.cjs`.
**Emulator is now sha256 `aa4017bcf37e2600721c6d48bfe4f2d8ec9561a5216b9d130dab401edfce923d` (359,234 bytes), release `6324e69a96a11f6938cc12a679c126812b56a69094806a7fa2e339b74de2637b`.** `853987b1…` (key hints only) and `98ef0e15…` are superseded. Core unchanged (`69f2d2fc…`).
