# Stacks NFT preservation census

A read-only survey of where the art behind the top Stacks NFT collections lives, and whether it can still be reached.
First run: 13 Oct 2026, top 250 collections by Gamma all-time volume.

## What it checks

For each collection, two layers:

1. **Contract layer.** Contract source and `get-token-uri` read through the Hiro API (up to 4 tokens). The metadata and image are
   fetched as written, then through three IPFS gateways (Filebase, Pinata public, Gamma's `stxnft.mypinata.cloud`).
2. **Marketplace layer.** Up to 16 tokens loaded from the image addresses Gamma's own API serves.

It also records whether the owner can still change the token URI, signs of on-chain art in the source (SVG functions, data URIs),
which machines on IPFS still store each folder (IPFS delegated routing), and each contract's deploy date.

## Where it runs

The cloud workspace and the Mac's sandboxed shell cannot reach Gamma, Hiro or IPFS gateways, so the harness runs as a script inside a
`gamma.io` tab of the Claude desktop app's built-in browser (same-origin access to Gamma's API; Hiro and gateways allow CORS).
Timers go through a Web Worker because hidden tabs throttle page timers.

## Files

| File | Purpose |
|---|---|
| `ft-census.js` | Browser harness. Paste into a gamma.io tab; `FT.runCollection(row)` / lanes over `FT.list`. Results in `FT.results` and localStorage `ftcensus-v1`. |
| `ft-census-results.json` | Raw results: list, per-collection results, deploy dates, IPFS provider cache. |
| `ft-census-retests.json` | Slow re-tests: r1 marketplace images, r2 placeholder/folder token URIs (`$TOKEN_ID`, bare CIDs), r3 errored or image-less contracts. |
| `manual-overrides.json` | Hand checks (video metadata, `imageUrl` keys, dead gateways, Megapont, stacksart.com shared files). |
| `analyse.py` | Classifier: `python3 analyse.py ft-census-results.json ft-census-retests.json manual-overrides.json` |
| `ft-census-results-classified.csv/.json` | One row per collection with its status bucket and evidence. |
| `build_dashboard.py`, `dashboard.tpl.html` | Builds the published dashboard page. |

## Buckets

On chain · Healthy (Arweave, or IPFS with several hosts) · Fragile (works, one host) · Marketplace copy broken · Walking dead (contract
link dead, Gamma copy works) · Failing (both partly broken) · Lost (contract dead, no Gamma images load) · Unclear · Not artwork.

## Known limits

Sampled tokens, not every token. One run from one network on one day: re-run to confirm anything marked dead before naming it publicly.
Metadata conventions vary (`image`, `imageUrl`, `video`, `$TOKEN_ID` placeholders, folders); new ones may need adding to the harness.
