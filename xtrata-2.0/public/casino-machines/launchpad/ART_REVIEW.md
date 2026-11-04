# Launchpad art review

Build snapshot: **3 November 2026**. STX.City data was retrieved at **15:40:32 UTC**.

## Proposed final shortlist

The list is ready for Jim's review. It is not a record of his approval or of permission from the projects.

| Engine slot | Display role | Original artwork | Snapshot status |
| --- | --- | --- | --- |
| `cherry` | Launch IV | Yeti | On curve, 8.7791513% |
| `lemon` | Launch III | Building Blocks | On curve, 1.1190141% |
| `chip` | Launch II | Bucket Coin | On curve, 10.2052089% |
| `block` | Launch I | Capy | On curve, 5.05793731% |
| `artifact` | Graduate | JACKAROO and BAO | Both reported at 100% |
| `bitcoin` | Moonshot | Teiko Token | Reported at 100%; highest reported volume among the eligible STX.City graduates in this snapshot |
| `wild` | STX Wild | Official Stacks website SVG | Exact supplied file, unchanged |
| `scatter` | Countdown | Teiko deployment transaction | Verified successful deployment, 1 February 2025 |
| `vault` | Pre-launch Seat | BLOCKS artwork and its Faktory prelaunch contract | Verified historical launch; current seat availability is not represented |
| `chain` | Curve Step | Seven successful Capy buys | Historical transactions with decoded amounts and dates |

The four active tiers are ordered by reported volume among the selected candidates. The engine slots, odds and prizes are unaffected by this art selection.

## Exact token identities

| Artwork | Contract |
| --- | --- |
| Yeti | `SP2346SFHXV54G5VMKNMY8F6N71J8DBWP04SKC0KM.yeti-stxcity` |
| Building Blocks | `SP3SNCBK1ZH05J3SBST16ZXP2AHSPE9H645ZTRVQ6.building-blocks-stxcity` |
| Bucket Coin | `SP2AWE8GJ52MKEAGGBTTNEEXZSM9VF8CTYK7ZCZDC.bucket-coin-stxcity` |
| Capy | `SPBKM76FM8T8DEAQ11C9CF9WJKTSMKE140M0VXFM.capy-stxcity` |
| JACKAROO | `SP3J2H949KF8N4EPXKB42ZQT4EFGJFEW36DX20J1D.jackaroo-stxcity` |
| BAO | `SP10VQCN71BZ0CXVKH7DF2H1MEQNKG9C49R9AHGKB.bao-stxcity` |
| Teiko Token | `SP1T0VY3DNXRVP6HBM75DFWW0199CR0X15PC1D81B.teiko-token-stxcity` |
| BLOCKS | `SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.b-faktory` |

## Source and image handling

The [STX.City snapshot endpoint](https://stx.city/api/fetchFrontEnd/bondingData?page=1&limit=1000) returned 996 records, including 927 contracts with the required `-stxcity` suffix and 53 eligible graduates. Each selected token's exact contract was then resolved through [Hiro's token metadata API](https://docs.hiro.so/en/apis/token-metadata-api/reference/tokens/fungible-tokens).

Every token image is the project artwork referenced by that exact contract's Hiro `image_uri`. The full-size direct image endpoints often returned HTTP 403; the launchpad's own public image proxy supplied those same images. Both the metadata image URI and actual retrieval URL are recorded in `sources.json`.

The nine retrieved original image files remain in `art/`, with SHA-256 hashes. Eight raster originals have small WebP copies in `art/derivatives/` for the game. Each copy fits within 480 by 480 pixels, keeps the complete image and its aspect ratio, and preserves transparency and any source ICC profile. Pillow's Lanczos filter performs the resize. Complex artwork uses WebP quality 90; Bucket Coin and BAO use lossless WebP encoding after resizing. There is no cropping, padding, generative redrawing, intentional recolouring or stretching. Lossy compression can change decoded pixel values, as any such encoding does.

The [official Stacks SVG](https://cdn.prod.website-files.com/618b0aafa4afde65f2fe38fe/65dbdd6c87cf20baca9ac049_stacks-logo-navbar.svg) comes from the [Stacks website](https://www.stacks.co/) and remains byte for byte unchanged.

The runtime embeds the compact copies, so reel art works offline. Its JSON is approximately 545 KB, reduced from 3.91 MB. Source records retain both the original and derivative dimensions, hashes and paths.

## Historical seat and chart data

The [BLOCKS prelaunch contract](https://explorer.hiro.so/txid/SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.b-pre-faktory?chain=mainnet) has on-chain constants for 20 seats and a price of 69,000 sats per seat, paid in sBTC. A successful historical seat purchase is retained with the source evidence. Show this as a historical launch snapshot. The game does not sell or award those real seats; its nine prize choices remain the shared engine's presentation.

The side-chart points are seven observed successful Capy buys, ordered oldest to newest. Each price is the decoded STX input divided by the decoded token quantity returned, with token decimals applied. The resulting unit is **STX per CAPY including the fee**. Label the display **CAPY · HISTORIC BUY PRICES** and show the snapshot date. It is not a live quote, a complete history or a simulated bonding-curve formula.

## Excluded candidates

- **Stacking Turtle:** recognizable Squirtle-like character in the token artwork.
- **Rocket Van:** recognizable VW-style vehicle emblem.
- **ZEROPOINTS:** borrowed meme-face artwork.

Those image files are excluded from this bundle. The wider token list also contained offensive names, real-person mockery, tragedy references and obvious imitations; these were not selected. The accepted files were visually inspected for the brief's content rules. That inspection is not an independent trademark clearance.

## Remaining constraints

- Jim has not yet approved this shortlist.
- Project permission is still needed for **Yeti, Building Blocks, Bucket Coin, Capy, JACKAROO, BAO, Teiko Token, Stacks and BLOCKS** before a public build.
- Faktory's token-list API returned HTTP 401. Its comparable volume ranking could not be established; no authenticated route or harvested credential was used. The BLOCKS seat is independently supported by public metadata and on-chain source.
- The Moonshot claim is limited to the eligible STX.City snapshot. Do not call Teiko the biggest token by market capitalization or across both launchpads.
- The platform's `trading_volume` field has no independently confirmed unit or measurement window in this research. Do not relabel it as USD, STX, 24-hour volume or market capitalization.
- This focused bundle has one original logo per token and two Graduate variants. It does not reach approximately 18 art variants per engine slot. No imitation fills the gap.
- Numeric token and transaction displays must keep their snapshot labels; historical data must not look like live market information.

## Runtime fields

`runtime-art.json` uses `snapshot` and `snapshot_at` strings, both `2026-11-03`. The ten slots are under `symbols`, with an array of variants for each. Raster variants' `image` values are embedded WebP data URIs; the STX variant embeds the original SVG. Factual record variants use `image: null` and provide their transaction fields for drawing as data tiles.

`asset` identifies the retained original file. `display_asset` identifies the small runtime file. The `derivative` object records the resize and encoding method, output dimensions and hashes. `side_chart.points` contains `time`, `block`, `price`, `stx`, `tokens` and `tx_id` for each historical buy.

To capture a later snapshot, run `node tools/fetch-launchpad-snapshot.mjs` from the machine folder. If Faktory makes a token-list endpoint publicly accessible, pass its URL as the first argument. The command writes `art/evidence/launchpad-refresh.json` with either the returned data or the source failure. The dated shortlist remains fixed until a new art review.
