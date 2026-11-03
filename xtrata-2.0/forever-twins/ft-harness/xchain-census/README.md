# Cross-chain preservation census (Forever Twins)

A targeted, read-only survey of NFT collections on chains other than Stacks, looking for art that is at risk:
links to dead or centralised hosts, art kept alive only by an indexer's cache, and contracts whose owner can still
repoint the art. It is the sibling of the Stacks census in `../census/`.

Chains supported in v1: **Ethereum, Base, Polygon, Arbitrum, Optimism** (EVM) and **Tezos**.
Solana needs a DAS-capable RPC key (for example Helius) and is not wired in yet.

## How it works

Three passes, so the expensive tests only go where the risk is:

1. **Discover.** Build a candidate list from three sources:
   - `XC.discoverCoinGecko(pages)`: CoinGecko's NFT list by market cap (250 per page), filtered to the EVM chains above.
   - `XC.discoverObjkt(limit)`: objkt.com's Tezos collections by all-time volume.
   - `seeds-curated.json`: hand-picked platform contracts (shared contracts of marketplaces that changed or closed).
     Addresses in this file are hypotheses until triage reads the contract's `name()`; check it matches.
2. **Triage (cheap).** For each candidate: read the contract code, whether it is an upgradeable proxy, whether it has
   URI setter functions (`setBaseURI` and similar) and a freeze function, then read the token pointer for two tokens.
   Each collection gets a risk score from the pointer type:

   | Pointer type | Score |
   |---|---|
   | data: URI (on chain) | 0 |
   | Arweave | 1 |
   | ipfs:// | 2 |
   | IPFS through a named gateway | 3 |
   | own web server or API, cloud bucket | 4 |
   | app host (Heroku, Vercel, Cloud Run…), dead IPFS gateway | 5 |

   +1 if the contract is an upgradeable proxy, +0.5 if it has a URI setter and no freeze function.
3. **Deep test (targeted).** `XC.pickTargets(minScore, max)` picks the riskiest; `XC.runDeep(list, n)` then tests
   `n` sample tokens each on two layers:
   - **Contract layer:** the pointer as written, then Filebase and Pinata's public gateway for IPFS, `arweave.net` for
     `ar://`; then the image (or video / HTML, by range request) the metadata names.
   - **Index layer:** the copy an indexer keeps. EVM chains: Alchemy's NFT CDN (`demo` key built in; put your own
     free key in `XC.keys.alchemy` for real runs). Optional OpenSea image if `XC.keys.opensea` is set. Tezos: TzKT's
     cached metadata.
   - **IPFS hosting:** which storage providers still answer for each folder (public IPFS routing).

## Running it

The cloud workspace and the Mac's sandboxed shell cannot reach RPCs, indexers or IPFS gateways, so the harness
runs inside the Claude desktop app's built-in browser, in any https tab (we used `https://api.tzkt.io/v1/head`).

```js
// 1. paste xc-census.js into the tab (loads window.XC; results persist in localStorage)
// 2. optional keys
XC.keys.alchemy = '<your Alchemy key>';      // default 'demo' is rate-limited
XC.keys.opensea = '<your OpenSea key>';      // optional second index layer
// 3. discover + triage
const cg = await XC.discoverCoinGecko(2);    // top 500 by market cap, EVM only
const tz = await XC.discoverObjkt(100);
XC.runTriage([...SEEDS, ...cg, ...tz], 5);   // SEEDS = contents of seeds-curated.json
XC.status();                                 // poll
// 4. deep test the riskiest
XC.runDeep(XC.pickTargets(3, 80), 6, 4);
// 5. export (the result is saved to a file by the tool call when it is large)
XC.dump();
```

Then on any machine with Python 3:

```bash
python3 xc-analyse.py xc-results.json
```

This writes a triage table (every candidate with its score), a classified table and JSON for the deep-tested set.

**Targeting a subset.** Any target can carry `ids` (explicit token ids) or, for Tezos, `filter` (a TzKT query
fragment), for example `{"chain":"tezos","contract":"KT1RJ6…","filter":"&firstMinter=tz1…"}` to test one artist's
work on a shared platform contract.

## Buckets (deep-tested collections)

| Bucket | Meaning |
|---|---|
| On chain | Art comes from the chain itself (data: URI or inline SVG) |
| Healthy | Contract route works; art on Arweave or on IPFS held by several providers |
| Fragile | Contract route works today but rests on one host (own server, cloud bucket, one IPFS provider) |
| Walking dead | Contract route dead; an indexer's cached copy still shows the art |
| Failing | Some sampled tokens dead on the contract route |
| Lost | Contract route dead and no working cached copy |
| Unclear | The test could not decide (for example no standard pointer function) |

## Limits

- Sample-based (default 6 tokens per collection), one run, one network. Re-run before naming anything as lost.
- "Fragile" is about single points of failure, not about the team behind a collection.
- A server that serves the art today can change what it serves tomorrow; the census records reachability, not
  whether the bytes match the original.
- Non-standard contracts (CryptoPunks, CryptoKitties, some platform contracts) have no `tokenURI` and land in
  Unclear unless given a custom adapter.
- Public RPCs and Alchemy's demo key rate-limit; the harness spaces calls per host and retries 429s.
- Some servers block browser reads of their metadata (no CORS). The harness then tests the art address taken from
  the indexer's copy of the metadata, at its original host, and says so in the notes. Check those collections with a
  server-side fetch before calling them dead (the pilot's hand checks are recorded in `xc-analyse.py` as `NOTES`).
- v1.3 added the Tezos version of that fallback. v1.4 (after the full run) retries `http://` pointers over https, because an
  https tab blocks plain-http fetches as mixed content (this made CyberKongz VX and WADESIDE look dead in the full run until
  hand-checked), and runs a DNS-over-HTTPS lookup on hosts that give a network error, recording `nxdomain` when the domain
  no longer exists.

## Files

| File | Purpose |
|---|---|
| `xc-census.js` | Browser harness (discovery, triage, deep test, export) |
| `seeds-curated.json` | Hand-picked platform contracts to always include |
| `xc-analyse.py` | Turns `XC.dump()` into triage and classified tables |
| `xc-results-pilot-2026-10-16.json` | Pilot run (101 triaged, 25 deep-tested) |
| `xc-results-full-2026-10-16.json` (+ `-triage.csv`, `-classified.csv/.json`) | Full run (301 triaged, 106 deep-tested) |
| `build_xc_dashboard.py`, `xc-dashboard.tpl.html` | Builds the published dashboard: `python3 build_xc_dashboard.py xc-results-full-2026-10-16 out.html` |
