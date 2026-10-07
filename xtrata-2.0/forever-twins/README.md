# Forever Twins

Permanent on-chain twins for NFTs whose art lives somewhere that can disappear (IPFS pins, project servers, cloud buckets). A **twin** is a Stacks token whose artwork is stored in full through [Xtrata](https://xtrata.xyz), byte for byte, bound one-to-one to the original by a per-collection **helper contract**. One side of every pair is always held by the helper, and a holder can swap sides at any time, for free. The original NFT is never changed.

- Public site: <https://xtrata.xyz/forever-twins/>
- Collections: <https://xtrata.xyz/forever-twins/collections/>
- Guides: <https://xtrata.xyz/forever-twins/guides/> (what it is, preserve your collection, onboarding, verify it yourself)
- Registry (machine-readable): <https://xtrata.xyz/forever-twins/data/registry.v2.json>

## Status

**Unaudited prototype.** The contracts have not had an independent audit. They have been tested as described below and are deployed on Stacks mainnet, but nothing here is a guarantee. Read the code and the tests before relying on it.

Deployed helpers (from the registry; the full source SHA-256 of each is in the registry and on the verification guide):

| Collection | Interface / group | Helper contract | Source SHA-256 |
|---|---|---|---|
| Bitcoin Pepes | v1 / G2 | `SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.pepe-4ever-fakfun` | `a7e0bb232bf0…` |
| LEO Cats | v1 / G2 | `SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.leo-fakfun-xtrata` | `56586eec666d…` |
| Miami Degens | v1 / G1 | `SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.miami-degens-fakfun-xtrata` | `c0fc432d0596…` |
| NYC Degens | v3 / G1 | `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.forever-twin-nyc-degens` | `cfa6b98191f5…` |
| Megapont Ape Club | v3 / G2 | `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.forever-twin-megapont-ape-club` | `d092d883666f…` |
| Bitcoin Monkeys | v3 / G1 | `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.forever-twin-bitcoin-monkeys` | `de53ff3fdfd4…` |

Bitcoin Pepes, LEO Cats and Miami Degens are earlier (v1) helpers built with Fak.fun; their original pages are linked from the collection pages. NYC Degens, Megapont Ape Club and Bitcoin Monkeys use the v3 helper in this repository.

What a deployed helper does and does not mean: a helper being live means anyone can create twins and swap through it. It does not mean every token in the collection has a twin. Each collection page reports four separate numbers: recovered (art fetched and fingerprinted), seeded on-chain, inscribed twins, and swap-ready.

## How it works

1. A manifest builder fetches every token's art at a recorded chain height and writes a manifest (hash, mime type, size, metadata link per token).
2. The helper is deployed, the record is seeded in batches of 100, and the record is **finalised** with the manifest's SHA-256. From then on the record cannot change.
3. Anyone can inscribe a twin: the helper checks the art against the locked record, takes its fee, and the Xtrata core stores the bytes.
4. A holder swaps their original for its twin (and back). Swaps check real ownership in both contracts and cannot be paused.

Custody groups: **G1** collections have plain holder-authorised transfers. **G2** collections have their own listing market, so the helper refuses to take a listed token.

Files over 512 KB cannot be inscribed in a single transaction. They are either pre-inscribed and bound by the owner before finalisation, or (large-on-demand helpers, such as Bitcoin Monkeys) inscribed later by any visitor through a guided multi-transaction route.

The owner of a helper can only: set the fee (even amounts up to a ceiling fixed at deploy), rescue a token that was sent to the helper by mistake (announced on-chain, executable after about three days), and hand ownership to a new address in two steps. Nobody can pause swaps, change the record, move a paired token, or change who is paid.

## Repository layout

| Path | What it is |
|---|---|
| `ft-harness/templates/` | The Clarity helper template (v3), with G1/G2 and large-on-demand blocks |
| `ft-harness/scripts/` | Renderer and per-collection deploy configs |
| `ft-harness/manifest/` | Manifest builder, published manifests (`out/`), fork-test scripts |
| `ft-harness/sim/` | Simnet test suites run against the real Xtrata core |
| `ft-harness/live-check/`, `ft-harness/screener/` | Read-only mainnet checks and the custody-risk source screener |
| `ft-harness/registry/` | The pinned registry used for deploy-time checks |
| `data/registry.v2.json` | The public registry (single source of truth for the pages) |
| `collection/`, `collections/`, `community/`, `guides/`, `assets/` | The public pages |
| `bitcoin-pepes/`, `leo-cats/`, `miami-degens/` | Original pages for the v1 helpers |
| `../functions/ft/` | The token-URI resolver, served at `/ft/<collection>/<id>.json` |
| `../canaries/forever-twins-launch/` | The browser wallet page used to deploy and seed helpers |
| `../src/forever-twins/large/` | The large-file wizard |
| `contracts-reference/` | Archived third-party contract sources used as references |

## Run the tests

```bash
cd xtrata-2.0/forever-twins/ft-harness
npm ci
npm test
```

Needs Node 20 or later. The suites run in a local simnet and make no network calls except `live-check`, which only does GET requests and read-only contract calls. The harness holds no keys and signs nothing; deploys are done from a browser wallet page, never from a script with a private key. See `ft-harness/README.md` for what each suite proves.

Mainnet-fork rehearsals (stxer) were run before each deployment, for example [Megapont Ape Club](https://stxer.xyz/simulations/mainnet/a10895449469d1a3fc6a2ba542c2962d), [Ordinal Pepe](https://stxer.xyz/simulations/mainnet/b6d121ca537ec4cdefa81c16671bd963) and [Bitcoin Monkeys (large-on-demand)](https://stxer.xyz/simulations/mainnet/af68717eddb6132b8c53cadb5b73d0eb).

## Licence and third-party code

The Forever Twins code, templates, tests and documentation in this folder are released under the [MIT licence](LICENSE).

The exceptions are contract sources written by other teams, copied from the chain for testing: `contracts-reference/`, `ft-harness/screener/sources/` and `ft-harness/contracts/legacy/`. They are not covered by this licence and their rights stay with their authors.

## Internal notes

Campaign drafts (`strategy/`, `copy/`, `ops/`, `publish/`) and loose planning notes are working documents and are not published on the site.
