# Corgi Kennel — art sources

Metadata and images checked on **3 November 2026**. Every included token image was read from the canonical image URI in Hiro metadata for its exact contract. Some contracts legitimately publish the same WELSH artwork. No logo or NFT character was redrawn.

The lossless WebP files preserve source aspect ratios. Images larger than 480 px were proportionally downsampled to a maximum of 480 px; the original source hash, URI and fetched metadata are recorded in `sources.json`.

## Main symbols

| Engine slot | Theme | Art status | Exact contract |
| --- | --- | --- | --- |
| `cherry` | Baby Welshcorgicoin | Original image unavailable | `SP1Z92MPDQEWZXW36VX71Q25HKF5K2EPCJ304F275.tokensoft-token-v4kjvtr37ht` |
| `lemon` | Generational Welsh | Bundled | `SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.generational-welsh` |
| `chip` | Phoenix Welsh | Original image unavailable | `SP3S2565C4DP2MGR3CMANMGYDCDA314Q258CG2R7C.phoenix-welsh-faktory` |
| `block` | Liquid Staked Welsh v2 | Bundled | `SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.liquid-staked-welsh-v2` |
| `artifact` | ANONYMOUS WELSH CVLT | Bundled | `SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.anonymous-welsh-cvlt` |
| `bitcoin` | Welshcorgicoin | Bundled | `SP3NE50GEXFG9SZGTT51P40X2CKYSZ5CC4ZTZ7A2G.welshcorgicoin-token` |
| `wild` | Happy Welsh #1 | 10 genuine individual NFTs bundled | `SPJW1XE278YMCEYMXB8ZFGJMH8ZVAAEDP2S2PJYG.happy-welsh` |
| `vault` | LEO-WELSH Liquidity Pool | Bundled genuine 4×4 pixel art from token metadata | `SP22KATK6MJF40987KB2KSZQ6E027HQ0CPP73C9Y.leo-welsh-v1` |

## Day One — verified on-chain record

The [WELSH deployment transaction](https://explorer.hiro.so/txid/0x51a1069fc2b9ed446136a5bacff92710fa42206893ace3d9d423337f50e1e355?chain=mainnet) is `0x51a1069fc2b9ed446136a5bacff92710fa42206893ace3d9d423337f50e1e355`. Hiro returned **Stacks block 39,013**, **Bitcoin burn block 711,078**, and **2021-11-24T06:14:54.000Z**. The complete returned transaction is bundled in `metadata/day-one-tx.json`. The designed Day One card may show these exact facts; it must not invent extra fields.

## Happy Welsh provenance and limitation

The [official WELSH website](https://www.welshcorgicoin.com/) links to the [Happy Welsh Gamma collection](https://stacks.gamma.io/collections/happy-welsh). Gamma identifies the contract `SPJW1XE278YMCEYMXB8ZFGJMH8ZVAAEDP2S2PJYG.happy-welsh`.

A successful live `get-token-uri(u1)` read returned `ipfs://QmTZ7BtjVrxGnELvzb2HXv3K7mf6PQ4Mvgz7nvpWdFKtCQ/{id}.json`. Per-token metadata resolved the artwork inside `ipfs://QmajLS1WEMdBCNPwFh3yRKPxSiYQnfiZqooSyreGsXtzX1/`. Genuine NFT images were recovered through the Filebase public IPFS gateway. **10 individual NFTs are bundled: #1, #3, #4, #5, #7, #8, #11, #12, #13 and #18.** They were visually reviewed; no offensive art was selected. Individual metadata snapshots and original/derivative image hashes accompany them.

Eighteen IDs were attempted. The other eight image/metadata downloads timed out after two bounded attempts. This is not a claim that those NFTs or their images do not exist. The ten available examples satisfy the machine's requirement for authentic Happy Welsh NFT imagery; no count of 18 available images is claimed.

The official website montage remains a supplemental source reference. The reels can now use the genuine individual NFT files. Happy Welsh #4 contains an existing McDonald’s mark on its cap; the public-use permission review should include embedded marks as well as the NFT artwork itself.

The live Forever Twins registry endpoint returned 403. A valid snapshot was recovered from the [official source repository](https://raw.githubusercontent.com/stxtrata/xtrata/main/xtrata-2.0/forever-twins/data/registry.v2.json) on 3 November 2026. It contains no Happy Welsh collection or helper. Show Happy Welsh artwork desaturated and stamped **NOT YET FOREVER**, with the snapshot date in the source panel. This registry snapshot is not a live eligible-twin count; a failed live count still says **checking**.

## Pedigree selection

Hiro's [Welsh token query](https://api.hiro.so/metadata/v1/ft?name=welsh&limit=60) reported 63 results; 60 were fetched in this page. The build bundles **17 distinct contracts** with successfully retrieved logos. They were visually reviewed; no offensive art was included. This is a themed selection, not a claim of project affiliation or endorsement.

| Token | Symbol | Exact contract |
| --- | --- | --- |
| ANONYMOUS WELSH CVLT | CVLT | `SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.anonymous-welsh-cvlt` |
| Charisma Virtual Welsh | cvWELSH | `SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.charisma-virtual-welsh` |
| Generational Welsh | gWELSH | `SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.generational-welsh` |
| Liquid Staked Babywelsh | sBABYWELSH | `SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.liquid-staked-babywelsh` |
| Liquid Staked Welsh | sWELSH | `SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.liquid-staked-welsh` |
| Liquid Staked Welshcorgicoin | lsWELSH | `SP1VGCMHKXYGZ4Y0DWZR6449M0EJY3PZV2XX61EMH.dme020-liquid-staked-welsh` |
| Liquid Staked Welsh v2 | sWELSH | `SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.liquid-staked-welsh-v2` |
| Recovery Welsh | rWELSH | `SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.recovery-welsh-dexterity` |
| Redemption Welsh | rWELSH | `SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.redemption-welsh-dexterity` |
| Synthetic Welsh | iouWELSH | `SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.synthetic-welsh` |
| Virtual Welsh | vWELSH | `SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.virtual-welsh-dexterity` |
| Welsh Community LP | STX-WELSH | `SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.welsh-community-lp` |
| Welsh Community Pool | vlSTXWELSH | `SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.vlistx-welsh` |
| Welshcorgicoin | WELSH | `SP3NE50GEXFG9SZGTT51P40X2CKYSZ5CC4ZTZ7A2G.welshcorgicoin-token` |
| Welsh Street Credit | CREDIT | `SP2A7PT3DMWVT2BHHMKQ2T0Y4AA05NST96SDM2FCE.credit-token` |
| Welsh Street Token | STREET | `SP2A7PT3DMWVT2BHHMKQ2T0Y4AA05NST96SDM2FCE.street-token` |
| Welsh Unleashed | WXL | `SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.welsh-unleashed-dexterity` |

## Missing source art

- **Baby Welshcorgicoin:** the exact-contract metadata was recovered, but both original S3 metadata and artwork now return HTTP 404. Its Hiro cached image returns 403. Use an honest ART UNAVAILABLE notice until an exact-contract source is supplied.
- **Phoenix Welsh:** exact-contract metadata was recovered, but original Supabase metadata and SVG return HTTP 400. Its Hiro cached image returns 403. Use an honest ART UNAVAILABLE notice until an exact-contract source is supplied.

## Permissions

**Permission remains required before a public build for every third-party logo and Happy Welsh artwork included here.** Retrieval and attribution do not establish a licence. `sources.json` lists the project names and exact contracts. The downloaded community GitHub logo is still a project mark; no trademark permission is assumed. These symbols are artwork only and create no holder entitlement or endorsement.

## Recorded sound effects

Two real CC0 sound recordings are bundled: a 0.32-second bark by Brandon Morris (submitted by HaelDB), and a 4.5-second applause excerpt by eXpl0it3r. See `audio/LICENSES.md`, `metadata/audio-license-evidence.json`, and the `audio` section of `sources.json` for original author pages, declared licences and source/derivative hashes. The audio files need no additional permission under the offered CC0 licence.

## Refreshing sources

Run `python3 tools/refresh-art.py` to stage a refresh. The script verifies exact contracts and the NFT URI chain, retains verified snapshots on failure, and keeps the reviewed pedigree allowlist. New or changed image hashes are staged for visual review instead of silently becoming artwork. `--apply` applies unchanged or explicitly reviewed images. `python3 tools/refresh-art.py --help` explains the SHA-256 acceptance syntax.
