# Public IPFS gateway availability, Milestone 1 collections

Run 22 Oct 2026, 17:45 to 17:59 UTC (re-test of throttled requests 17:56 to 17:59). Stacks block 9,279,798 at the time of the fee read.
Collections: NYC Degens, Megapont Ape Club, Bitcoin Monkeys, Bitcoin Birds. Read-only GET requests from a browser on one machine and network.

## Method

- Sample: for each collection, the first and last token and four spread through the collection (6 tokens; Bitcoin Monkeys adds #378, the large-file token, so 7). For each token, the art file and, where the collection has one, the metadata file. 44 files in all, taken from the published manifests (`ft-harness/manifest/out/*.manifest.json`).
- 8 gateways per file: ipfs.io, dweb.link, w3s.link, trustless-gateway.link, 4everland.io, gateway.pinata.cloud, ipfs.filebase.io, stxnft.mypinata.cloud. 352 requests, timeout 40 s.
- "Served" means the SHA-256 of the returned bytes equals the sha256 recorded for that file in the manifest, not just an HTTP 200. No hash mismatches occurred anywhere.
- Requests that were throttled (Pinata public, on the Birds files) or timed out under load (Filebase, on large Monkeys files) were re-run one at a time, 3 s apart, 90 s timeout. All 12 matched. The table below reports the result after that re-test.
- Script to repeat it: `gateway-check.mjs` in this folder.

## Result per CID (files served byte-exact / files sampled)

| Collection | CID | Kind | gateway.pinata.cloud | ipfs.filebase.io | stxnft.mypinata.cloud | 4everland.io |
|---|---|---|---|---|---|---|
| NYC Degens | QmSpu1tFB4zamGqKp9urEQsYpZ3ztq64vigXSdpBAFS4qi | art | 6/6 | 6/6 | 6/6 | 0/6 (no usable response) |
| NYC Degens | QmayEqWwWc87a5ig4ujkRdcyTe6uw2cXEJz177iMHQY4SP | metadata | 6/6 | 6/6 | 6/6 | 0/6 (no usable response) |
| Megapont Ape Club | QmZjrCc9836Njqw1Yx8ztM6FbJzvuZijwtZJSkKPxLTMWU | art | 6/6 | 6/6 | 6/6 | 4/6 |
| Megapont Ape Club | QmRhkJToXrJYhAGBNP6NLNUTTrXSmuNAF2fH2JKphaJPLx | metadata | 6/6 | 6/6 | 6/6 | 2/6 |
| Bitcoin Monkeys | QmYCnfeseno5cLpC75rmy6LQhsNYQCJabiuwqNUXMaA3Fo | art | 7/7 | 7/7 (4 needed a slow re-test: 0.5 to 1.4 MB files took up to 37 s) | 7/7 | 0/7 (no usable response) |
| Bitcoin Monkeys | QmXPHzFbdFuoyw7AY7BVgr9nbimyjuzyerQyD6uJaoUgdz | metadata | 7/7 | 7/7 | 7/7 | 0/7 (no usable response) |
| Bitcoin Birds | QmNcUCdjFK39Pk5iRrKY7Ez6hmqBcdnuxDZDAjTmeoxUqZ | art | 6/6 (after re-test; throttled on the first pass) | 6/6 | 6/6 | 0/6 (no usable response) |

Bitcoin Birds has no metadata CID: the contract points at a Stacks Art web URL that no longer serves the art.

## Gateways that gave no usable result

- **ipfs.io, dweb.link, w3s.link:** every request failed within about 100 ms, for every CID, in the Claude browser pane and in Chrome on the same machine, including a control request for an unrelated well-known IPFS file. The sites' home pages answered. This looks like something on the test machine or its network, not a finding about the gateways. Not counted either way. Re-run `gateway-check.mjs` from a different network to fill these in.
- **trustless-gateway.link:** answered some requests without CORS headers (so the bytes could not be read) and failed or timed out on the rest. Not counted.
- **4everland.io:** worked on some Megapont Ape Club files and failed outright on the other collections. Inconsistent; shown above as measured.

## Who actually stores the content (13 Oct 2026 census, IPFS routing lookup)

Gateways are access points, not independent copies. The census asked the IPFS network which storage providers answer for each CID (provider records found in brackets):

| CID | Collection / kind | Providers |
|---|---|---|
| QmSpu1tFB4…S4qi | NYC Degens art | Pinata only (2) |
| QmayEqWwWc…Y4SP | NYC Degens metadata | Pinata only (2) |
| QmZjrCc983…TMWU | Megapont Ape Club art | Filebase, Pinata, others (8) |
| QmRhkJToXr…aJPLx | Megapont Ape Club metadata | Filebase, Pinata (5) |
| QmYCnfeseno…A3Fo | Bitcoin Monkeys art | Pinata, others (3) |
| QmXPHzFbdF…goUgdz | Bitcoin Monkeys metadata | Pinata only (2) |
| QmNcUCdjFK…xUqZ | Bitcoin Birds art | Pinata only (2) |

gateway.pinata.cloud and stxnft.mypinata.cloud are two hostnames for the same provider (Pinata), and a gateway that answers may be fetching from another host, so "served by three gateways" does not mean three independent copies. For NYC Degens, Bitcoin Birds and the Bitcoin Monkeys metadata the 13 Oct lookup found Pinata alone storing the content; Megapont Ape Club had Filebase, Pinata and others, and the Bitcoin Monkeys art had Pinata plus others.

## Earlier, narrower measurement (13 Oct census)

The 250-collection census tested up to 4 tokens per collection through Filebase first, and Pinata public only when Filebase timed out, plus 16 tokens through Gamma's own Pinata gateway (`stxnft.mypinata.cloud`): NYC Degens, Megapont Ape Club, Bitcoin Monkeys and Bitcoin Birds all returned 16 of 16 on the Gamma layer. This 22 Oct run supersedes it for the "how many public gateways serve the art" question.

## Fee correction (same day)

`get-fee` on `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.forever-twin-nyc-degens` returns u1000000 (1 STX) at block 9,279,798. The other helpers: Megapont Ape Club u1000000, Bitcoin Monkeys u1000000, Bitcoin Birds u0.

## Follow-up changes made after this run

- `xtrata-2.0/forever-twins/data/registry.v2.json`: the "How widely hosted?" lines for NYC Degens, Megapont Ape Club, Bitcoin Monkeys and Bitcoin Birds now carry these results (registry-v2 suite: 76 passed, 0 failed).
- `xtrata-2.0/forever-twins/guides/what-is-forever-twins.html`: NYC Degens fee corrected from 0.1 STX to 1 STX.
