# Risks and open questions

## Risk register

| Risk | Impact | Mitigation | Owner |
|---|---|---|---|
| Contracts unaudited; only simnet-tested | Holder NFTs in custody at risk from an undiscovered bug; swaps can't be paused | Real-harness run, mainnet-fork runs, start with small collections, clear "unaudited" labelling | Jim |
| Milestone 1 deadline (Q3 ends 30 Sep) | Late milestone | Confirm due date; aim for 2 Oct; buffer day | Jim |
| Manifest built from the wrong art | Twins permanently wrong for that collection | Build from original sources, publish, check before finalising; redeploy is cheap before finalising | Jim |
| Art already lost for a candidate | Can't preserve it | Check resolvability first; record findings for the recap | Jim |
| Token art over 512 KB | Token can't be seeded | Check sizes during selection | Jim |
| Owner key lost or stolen | Lost: fee frozen, no rescue. Stolen: fee set up to the cap, strays misdirected | Hardware wallet; two-step handover lets the key move | Jim |
| Payout key lost | That half goes to a dead address forever | Own wallets with backed-up seeds, never exchange addresses | Jim, Rapha |
| Holder sends NFT directly to helper | Stray, stuck until rescued; permanent if rescue unavailable | UI warnings, docs, rescue while available | Jim |
| G2 holder has an active listing | Swap refused (u217), confusion | "Unlist first" message in the UI | Jim |
| Second helper deployed for a collection | One original, two twins | Registry lists one helper per collection | Jim |
| ~~Core doesn't verify chunks against the hash~~ | Resolved 25 Sep: it does (rolling hash, u103; length/shape, u102). See architecture.md | — | — |
| Public IPFS gateways throttle bulk reads (Pinata public gateway returned 429 during research) | Manifest builds fail or crawl | Builder retries and refuses on any failure; use a dedicated gateway for final builds | Jim |
| Source metadata not frozen (all three recommended picks) | Metadata could be repointed before the snapshot | Manifest records the snapshot block; review the manifest publicly before finalising | Jim |
| Twin token-URI policy (D3) undecided | Finalised URIs are permanent | Decide before building final manifests; configs use the spec's recommended resolver URL | Jim |
| Stacks Art metadata gone (Zombie Wabbits, Citadels, Funky Donuts, Blocks) | These cannot be preserved from their original source | Record as a preservation-risk finding; needs art recovery | Jim |
| Archived third-party sources in the repo | Licensing questions on release | Check before publishing; note in README | Jim |
| STX price moves over open timescales | 1 STX fee worth more or less | Owner can change the fee within the cap | Jim |

## Open questions

- [ ] Does DeGrants accept the "preserved" definition in [decisions.md](decisions.md), and when is
      Milestone 1 due?
- [ ] Payout addresses for Jim and Rapha.
- [ ] Which 3 collections plus backup? Recommended 25 Sep: Megapont Ape Club, Bitslimes, NYC
      Degens; backup Ordinal Pepe ([collections.md](collections.md)). Needs Jim's decision.
- [ ] Twin token-URI policy (spec D3): resolver URL, inscribed metadata, or original URI?
- [x] Does `mint-single-tx` verify chunks against the content hash? **Yes** (25 Sep; see
      architecture.md).
- [ ] Final `MAX-FEE` value (5 STX in examples).
- [ ] Rescue enabled for every Milestone 1 helper? (Current plan: yes.)
- [ ] Licence for the open-source release.
- [x] Addresses of the live v1 helpers, for the registry (from `live-check/targets.mainnet.json`,
      checked live 25 Sep).
