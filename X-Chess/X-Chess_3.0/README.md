# X-Chess 3.0 local candidate

Open **`dist/xchess.html`**. It contains both arenas and the Peer play view, with no remotely loaded application assets. Serve it over localhost or HTTPS for peer-play browser APIs.

- **New arena:** the supplied V3 interface, corrected board colours, keyboard navigation, default practice creation, guarded replay/submission, bounded wallet requests, persistent pending-transaction recovery, and the V2 shared read transport. Local-contract games support committed rules, named/open seats, custom FEN, ranked consent, match references, sponsorship of up to two beneficiaries, top-ups, settlement, and portable evidence.
- **V2 games, profiles & tournaments:** the complete, byte-pinned 2.2.0 application. This retains historical replay, BNS/profile/picture features, game discovery, rankings, tournaments, piece/sound settings, and the deployed canary interface. These tools remain in the V2 view; they have not all been redesigned inside the new arena. Old unqualified game/tournament/player links select this view automatically.

The arena switch reloads the page. Export local practice evidence before switching if you want to keep it. Confirmed on-chain games can be recovered from their links. Pending V3 transactions are recorded separately in local storage and require inspection before another submission.

## Local contract

`contracts/xchess-core-v3.clar` is a **new local source contract**, not a deployed replacement for the canary. Historical contracts and the V2 project were not edited.

It retains the V2 append-only log ABI and adds:

| Functions | Purpose |
| --- | --- |
| `open-described-game`, `get-descriptor`, `descriptor-hash` | Immutable rule bytes, explicit options version, opaque extension bytes, and match reference; complete descriptor commitment |
| `open-v3-game`, `get-v3-game`, `get-protocol-v3` | New-arena ABI, opening-fee quote guard, optional atomic funding for two beneficiaries |
| `get-count`, `get-entries-page`, `get-games-page` | Bounded 32-item reads and enumeration; entries include submission sequence |
| `sponsor-game`, `get-funding`, `quote-rebate`, `top-up`, `settle` | Funding quotes, immutable rebate terms, bounded top-ups, expiry, and reserve settlement |
| `get-capabilities` | Descriptor limits and supported contract capabilities |

The contract stores opaque rules and options; it does not adjudicate chess. The frontend currently interprets options version 1 with empty extension bytes. Other option versions/bytes are explicitly unsupported until their frontend semantics and tests are added. Named seats, FEN, consent, cooldown and match references already live in the canonical rule descriptor. Advisory clocks are available in the separate Peer play view. Wagers, chat, and a hosted AI opponent are not included.

Sponsorship fixes: top-ups reserve at the original row's rebate rate, expiry stops payouts, and reserve underflow aborts instead of resetting liabilities. Standard moves have no application move fee. Settlement makes retained funds withdrawable treasury; it does not transfer them to the sponsor.

`settings/Devnet.toml` contains deliberately public, deterministic **test-only** keys. Never fund them on a public network. `local-config.json` points to their local deployer and `http://localhost:3999`. Edit this configuration and rebuild to use another local deployment. Start a Docker-backed development chain, when available, with `clarinet devnet start` from this directory. The completed automated contract tests use Clarinet simnet and do not require Docker.

## Build and test

This project uses the pinned toolchain and shared modules in the adjacent `X-Chess_2.0` directory. If its dependencies are missing, run `npm ci` there first.

```sh
cd X-Chess_3.0
npm run build
npm run check:contract
npm test
```

For real-browser checks, run `npm run test:browser:serve`, then open:

- `http://127.0.0.1:4349/` for the original 36 V2 browser/runtime checks against the combined artifact.
- `http://127.0.0.1:4349/v3-tests` for 44 new-arena checks in direct and captured framed-runtime scenarios.

Both use fake wallets and fixture reads. Their reports bind results to the HTML hash. Re-run them after changing the build. `tests/journey.mjs` connects the actual new frontend's read/signing ABI to Clarinet simnet, opens a game, submits a move, and recovers it from a fresh page. It performs no external transactions.

`dist/manifest.json` records the HTML SHA-256, rolling chunk hash, chunk count and V2 baseline hash. The single-file loader expands embedded gzip data using the browser's `DecompressionStream`. It preserves the host wallet bridge's listeners; it does not use document replacement or a remote decompression service. The expanded V3 file is a development artifact, not the distribution file.

## Source provenance and limits

Only the supplied HTML was available for V3. `src/imported-app.js` is its reformatted bundle, including its vendored dependencies, with targeted corrections. `src/shell.html` preserves its styles and license notices. `src/v2-wallet.ts` imports the existing tested V2 wallet and read-transport modules. The original Downloads file remains unchanged.

The new arena and V2 keep separate protocol/rating interpretations. V3 ratings cover loaded node-verified games in the selected contract/network; imported provenance is not promoted to verified ratings. V2's full historical verification flow remains in the V2 view.

This is a local development candidate. Real extension/mobile signing, deployment of the new contract, and inscription of the final HTML have not been performed. Browser runtime tests use the captured production shim and fake wallets; they are not evidence of a new live wallet transaction. Older browsers without `DecompressionStream` are not supported by the compressed distribution.

## Peer play

V3 now includes a **Peer play** view (`?xchess-view=peer`) and the local `xchess-peer-v1` registry. Players create/join on chain, pair browsers manually, exchange automatically signed moves over WebRTC, and can download/import signed histories when offline. Either player can prepare a verifiable completed record without another opponent signature. Clocks are advisory; abandonment and disputed timing do not award wins.

See [the implementation and operating guide](docs/PEER-PLAY-V1.md). Run `npm run test:peer` for protocol and registry tests, and `node tests/peer-browser-server.mjs` for the localhost browser fixture. This contract is local only; actual public deployment and inscription remain untested.
