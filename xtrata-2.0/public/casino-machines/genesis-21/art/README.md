# Genesis21 slot art - source verification (generated 2026-11-01)

RESULT: 0 images saved for all six collections. Every host that serves the token metadata or art
(IPFS gateways, Arweave, assets.hiro.so, project CDNs) is blocked from the sandbox/device shell
(curl returns 000 / CONNECT tunnel refused). Only xtrata.xyz (incl. /hiro Hiro proxy), github.com,
api.github.com, raw.githubusercontent.com, registry.npmjs.org, pypi.org are reachable. xtrata.xyz/ipfs/<cid>
is just the SPA fallback (HTML), not a gateway. No art was fabricated.

All contracts below were verified on-chain via https://xtrata.xyz/hiro/mainnet/extended/v1/contract/<id>
(+ /v2/contracts/interface and call-read get-last-token-id / get-token-uri). Each art/<slug>/manifest.json holds
`candidateTokens` (18 real, existing token ids with on-chain token URI and, where Hiro had it, image URL) and an empty `tokens`
list; `build/fetch_art.mjs <slug|all>` downloads + resizes (<=240px, nearest-neighbour under 200px) and fills `tokens` once hosts are allowed.

| Slug | Contract | Verified how | Supply (last id) | Images | Blocker |
|---|---|---|---|---|---|
| arties | SP2BE8TZATXEVPGZ8HAFZYE5GKZ02X0YDKAN7ZTGW.arties | Principal from stacks.gamma.io/collections/arties; contract exists (block 35466, 2021-10-27); NFT `arties`; call-read ok | 2604 | 0 | ipfs gateways, assets.hiro.so, arweave.net. Hiro cache shows the same image CID (Qmc3CRx...) for every sampled token - check once reachable. |
| satoshe | SP248HH800501WYSG7Z2SS1ZWHQW1GGH85ME34NT2.layer-v1-1 (HeyLayer multi-collection contract) ids 10000000001+ | Contract exists (block 40649, 2021-12-07). **SatoSHE link is INFERRED, not verified** (heylayer URL /collection/1 + id scheme). No public source gives a SatoSHE principal. | 19 usable tokens in collection 1; 6183 mints contract-wide | 0 | IPFS gateways; also cannot confirm collection name until metadata JSON is readable |
| satoshibles | SP6P4EJF0VG8V0RB3TQQKJBHDQKEF6NVRD1KZE3C.satoshibles | Gamma collection page + on-chain (block 47486 = 2022-02-04, i.e. the Stacks side of the bridge, not 2021) | 5000 | 0 | satoshibles.com, api.satoshibles.com, assets.hiro.so |
| stacks-punks | SPJW1XE278YMCEYMXB8ZFGJMH8ZVAAEDP2S2PJYG.stacks-punks-v3 | Gamma collection page + on-chain (block 26664, 2021-08-20) | 9523 | 0 | stackspunks.com, stxnft.mypinata.cloud (Gamma og:image path .../QmbhuEQK3cCXk3Ev4DeNoq3pWFiErHgXibwkWwPHoLPxLq/punk0_lg.png), assets.hiro.so. On-chain URI is one shared punks.json for all ids. |
| this-is-1 | SP3QSAJQ4EA8WXEDSRRKMZZ29NH91VZ6C5X88FGZQ.thisisnumberone-v2 | On-chain (block 15309, 2021-05-16), 1197 mints, ids 0..1196; URI base https://thisisnumberone.com/nfts/ | 1196 | 0 | thisisnumberone.com (per-token JSON path unknown) |
| boomboxes | SP497E7RX3233ATBS2AB9G4WTHB63X5PBSP5VGAQ.boomboxes-cycle-12 | Found via deployer tx list; boomcrypto/boom-contracts README confirms "Boombox NFTs" per stacking cycle; on-chain (block 20185, 2021-07-01) | 96 | 0 | cloudflare-ipfs.com (+ ipfs gateways for the image inside the JSON) |

## This Is #1 - which contract and why
- Picked: thisisnumberone-v2 (deployer SP3QSAJ..., same address that deployed Crash Punks). It is the platform's own 2021 contract, 1197 mints.
- Candidate B: SP3N4AJFZZYC4BK99H53XP8KDGXFGQ2PRSQP2HGT6.thisisnumberone - the official Gamma "thisisnumberone" collection, only 5 tokens, deployed ~Mar 2022. Gamma og:image: ipfs QmNpDudYeuktKDvKTckdQsnH4fhMto2fZYRM57CARLJw6y/thisisnumberone-1.jpg (via stxnft.mypinata.cloud). Best fallback if the jackpot symbol needs a known-good image.
- Candidate C: SP3QSAJQ4EA8WXEDSRRKMZZ29NH91VZ6C5X88FGZQ.thisisnumberone-v1 - 5 early tokens (u0-u4). Also thisisnumberone-genesis (SP3N4AJ..., 4 tokens, unrevealed URI) exists.

## Boomboxes note
Each stacking cycle is its own contract and get-token-uri returns the SAME IPFS JSON for every id inside a cycle (one artwork per cycle). For varied reels use one image per cycle: cycle 12 (96), 14 (96), 16 (261), 17 (3), 18 (309), 20-v1 (304), 20-v2 (6); cycle 6 has no token URI. See `boomboxCycleContracts` in boomboxes/manifest.json.

## Hosts to allow (minimum set)
assets.hiro.so (Hiro's cache of the images for arties/satoshibles/stacks-punks), cloudflare-ipfs.com, ipfs.io, stxnft.mypinata.cloud, arweave.net, satoshibles.com, api.satoshibles.com, stackspunks.com, thisisnumberone.com.
