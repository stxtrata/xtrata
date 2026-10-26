# Preservation checker: data and tools (Phase 0)

Behind the planned "paste your NFT link, contract or wallet and see where it stands" page. The page itself is not built yet; this
folder holds what it will stand on. Design decision (26 Oct 2026): a **softer version**. The page tells people honestly about what
they look up or hold, with no public, browsable list of collections, and every report card has a request button.

## Files

| File | What it is |
|---|---|
| `export_checker_data.py` | Builds `out/checker-data.json` from the census (`../census/`), the hand-checked layer and, once read, the frozen flags. Stops if its numbers disagree with the census write-up. |
| `checker-verdicts.json` | The hand-checked layer: summaries, the few status overrides, helper hints, the 16 Oct re-test. Nothing in it is new evidence; each entry comes from the preservation-risk write-up. |
| `ft-frozen-flags.cjs` | Browser script that reads each collection's "frozen" flag from chain (read-only). Not yet run against the live API: see below. |
| `ft-frozen-flags.test.cjs` | `node --test ft-frozen-flags.test.cjs` (14 tests against a fake Hiro). |
| `out/` | Generated: `checker-data.json` and `frozen-read-list.json`. Git-ignored on purpose (see "Public repo" below). |

The request store lives with the site code, not here: `functions/migrations/031_checker_requests.sql`, `functions/checker/requests.ts`.

## The one public scale

Census buckets (Healthy / Fragile / Walking dead / ...) and the older risk ratings (Lost / High / Medium / Lower) are folded into one scale
that says what a holder can rely on:

| Status | Plain meaning | From |
|---|---|---|
| `on_chain` | The picture can be rebuilt from the contract | On chain |
| `solid` | Contract reaches the art; several independent hosts hold it | Healthy |
| `one_host` | Contract reaches the art today; it rests on one host or server | Fragile |
| `marketplace_broken` | Contract reaches the art; the marketplace's copy is partly broken | Marketplace copy broken |
| `marketplace_only` | Contract's link is dead; the art shows only because the marketplace kept a copy | Walking dead (and Blocks, by hand check) |
| `not_found` | Our tests couldn't find the art (the headline shows how many sampled pieces did load) | Lost, Failing |
| `unclear`, `not_art` | Couldn't tell / not an art collection | Unclear, Not artwork |

Each record also carries `evidence_level` (`sampled` or `hand_checked`), the date each layer was checked, generated `good` and `worry` lines, and the
hand-written `summary` where there is one. There is no rank and no volume in the output.

## Rebuild the dataset

```bash
python3 -I export_checker_data.py                      # census + hand layer
python3 -I export_checker_data.py --frozen frozen-flags.json   # plus the frozen flags, once read
```

## Reading the frozen flags (still to do)

The census recorded whether a contract has a function for changing the token link. It did not record whether the owner has since locked it, and "can change the link"
is the basis of the "25 of the 34 broken collections could still be repaired" line. Reading the flag turns "has a function" into a checked answer.

1. Open any browser tab (Hiro allows CORS) and keep it visible.
2. Paste `ft-frozen-flags.cjs`.
3. `FTFROZEN.run(await (await fetch('<url of out/frozen-read-list.json>')).json())`, about 4 to 5 minutes for 241 collections. It resumes if interrupted.
4. `copy(FTFROZEN.json())`, save as `frozen-flags.json`, rebuild with `--frozen`.

Each collection ends as `frozen`, `not_frozen`, `no_flag` (the source has no boolean freeze flag we can read) or `read_failed`. Only the first two give a yes/no. `no_flag` and
`read_failed` stay unknown on the page and say why; they are never turned into "not frozen".

## Cautions

- **Detection is by name.** The census's "has a setter" matches setter functions by their usual names (`set-...-uri`, `update-...-metadata`), and "freeze mentioned" is a text match for freeze/frozen anywhere in the source. Both can miss unusual names. The page says "we didn't find", never "there is no".
- **Sample-based.** Up to 4 tokens through the contract and 16 through the marketplace image address; one run on 13 Oct 2026, the 34 broken ones re-tested on 16 Oct. Re-run before naming any collection publicly as lost.
- **Helper hints are dated.** `helper` in a record is the state on 13 Oct. The page must read live twin counts from chain.
- **Public repo.** This repository is public, and `../census/` already contains the named per-collection results (`ft-census-results-classified.csv/.json`). `out/` is git-ignored so the generated dataset isn't added by accident, but that does not make the census private. If "no public list" is meant strictly, decide where the census data and `checker-verdicts.json` should live before the page goes out.
