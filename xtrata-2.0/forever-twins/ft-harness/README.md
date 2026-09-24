# Forever Twins harness

Evidence, acceptance tests and read-only tooling for **FT-SPEC-2**
(`docs/forever-twins-v2-spec.md`).

**Safety:** nothing here holds keys, signs, deploys or broadcasts. The simulations run in a local simnet.
`live-check` makes only GET requests and read-only calls.

## Quick start (about 2 minutes)

```bash
cd xtrata-2.0/forever-twins/ft-harness
npm ci                # @stacks/clarinet-sdk 3.24.0, @stacks/transactions 7
npm test              # all four suites, about 150 checks; results in results/*.json
npm run screen        # screen the 28 pinned sources -> results/screen.json
npm run live-check    # READ-ONLY mainnet check -> results/live-check-<timestamp>.json
```

Needs Node 20 or later. `npm run screen` needs Python 3.

## What each part is for

| Command | File | Proves |
|---|---|---|
| `npm run test:existing` | `sim/existing-helper-evidence.mjs` | Behaviour of the **current** helper logic (`pepe-4ever-fakfun`, with only MASTER, SOURCE and asset renamed) against a Pepe double, the real Gamma-template Bitcoin Pepe source, and the real ThisIsNumberOne V1/V2 sources. Scenario ids P1–P8, G1–G2, V1-*, V2-* are cited as F1–F8 in the spec. |
| `npm run test:v2` | `sim/acceptance-v2.mjs` | Renders `templates/forever-twin-helper-v2.clar.tmpl` and runs the spec's acceptance tests T01–T20 against the real Zombie Wabbits and Gamma sources. |
| `npm run test:shared-probe` | `sim/shared-helper-probe.mjs` | Whether one shared helper could hold several collections (runtime `with-nft`, implicit trait conformance), and the Clarity read-only limits that shape the design. |
| `npm run test:live-check` | `live-check/test-against-simnet.mjs` | Runs the real `live-check.mjs` against a mock Stacks API backed by simnet, with seeded anomalies, and asserts that each one is found. |
| `npm run screen` | `screener/screen_sources.py` | Mechanical custody-risk **flags** per source. It never admits a contract; see spec section 4.3. |
| `npm run screen:fetch` | `screener/fetch-sources.sh` | Re-fetches sources from the pinned archive, or from a node with `FT_SOURCE_MODE=live`. |
| `npm run live-check` | `live-check/live-check.mjs` | Reads mainnet at a recorded tip. See spec section 10 for what it reads and flags. |

## live-check options

```bash
HIRO_API_KEY=... npm run live-check -- --all            # full binding scan (slow without a key)
npm run live-check -- --only bitcoin-pepes --max-bindings 200
npm run live-check -- --api http://your-node:3999 --delay-ms 100
npm run live-check -- --skip-bindings --skip-census     # quick state and source check
```

Edit `live-check/targets.mainnet.json` to add helpers or sources. Paths in that file are relative to the
file itself. Anomalies are observations at a tip, not verdicts; see spec section 10.

## Rendering a helper for another collection

```bash
node scripts/render-helper.mjs scripts/configs/mainnet-zombie-wabbits.EXAMPLE.json > /tmp/out.clar
```

The renderer only accepts profile tier `S`. Rendering is **not** deployment, and nothing in this
package authorises a deployment (spec sections 7.2 and 11).

## Simnet deviations from mainnet (all marked in-file)

- `contracts/core/xtrata-v3-2-3.clar`: `migrate-from-v1` and `migrate-from-v2-1-0` removed. The
  `xtrata-v1-1-1` / `xtrata-v2-1-0` stubs exist only so the core compiles.
- Legacy sources: mainnet `impl-trait` and commission-trait principals localised. `gamma-bitcoin-pepe`
  has an appended `simnet-mint`. All transfer, list, buy, burn and sale code is verbatim.
- `ref-helper-*`: `pepe-4ever-fakfun` logic with MASTER, SOURCE and the `with-nft` asset name changed.
- Simnet is not a mainnet fork. Repeat on a pinned fork (stxer) before any deployment decision.

## Adding a new collection to the evidence base

1. Add it to `screener/sources.txt`, then run `npm run screen:fetch` and `npm run screen`.
2. If it screens as a standard candidate, copy its archived source into `contracts/legacy/`, localising
   only trait lines. Add a render config and a manifest entry, and copy the T-suite with the new source.
3. Add adversarial scenarios for anything the screen or review flagged.
4. Add it to `live-check/targets.mainnet.json` with a census block.
