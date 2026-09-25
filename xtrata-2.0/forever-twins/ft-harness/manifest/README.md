# Manifest builder, seeding plan and checker

Everything here is read-only or offline. No keys, no signing, nothing is broadcast.

| Step | Command | Output |
|---|---|---|
| 1. Build | `npm run manifest:build -- manifest/configs/<key>.json --snapshot-api https://api.hiro.so` | `manifest/out/<key>.manifest.json`, `.manifest.sha256`, `.report.json` |
| 2. Plan | `npm run manifest:plan -- manifest/out/<key>.manifest.json --helper <SP...helper>` | `manifest/out/<key>.seed-plan.json`: `seed-canonical` batches of 100 plus `finalize-canonical`, as Clarity args hex and unsigned contract-call payloads |
| 3. Check | `npm run manifest:check -- manifest/out/<key>.manifest.json --helper <SP...helper>` | `manifest/out/<key>.check.json`: every `get-canonical` entry and the interface compared with the manifest |

## Rules the tools enforce

- `twin.contentHash` is the **Xtrata rolling hash** (16,384-byte chunks, `h0` = 32 zero bytes,
  `h = sha256(h || chunk)`), exactly what `xtrata-v3-2-3` `mint-single-tx` recomputes from the
  inscriber's chunks. The plain `sha256` of the file is recorded as well.
- Mime comes from the file's magic bytes, not the server header.
- The builder **refuses** (exit 2, no manifest) if any token is over 512 KB (32 x 16,384 bytes)
  or any fetch failed. A finalised record can never be completed, so there is no partial mode
  for real manifests; `--ids` builds are labelled `declared-subset ... NOT for finalisation` and
  the planner refuses them.
- The manifest's sha256 is taken over the exact bytes written; that value is what
  `finalize-canonical` commits to. Publish the file byte-for-byte.
- `metadataUri: "chain"` reads each token's URI from the source's live `get-token-uri`
  (needed for sources such as NYC Degens that map ids through a lookup contract).

## Configs

`manifest/configs/` holds configs for the recommended Milestone 1 collections. `twinTokenUri` uses
the spec's recommended resolver URL (`https://xtrata.xyz/ft/<key>/<id>.json`); decision D3 is
still open, so confirm it before building a manifest you intend to finalise.

Public IPFS gateways rate-limit bulk reads (Pinata's public gateway returned 429 "You need a
Dedicated Gateway" during research). `ipfs.filebase.io` served full collections; a dedicated
gateway is better for final builds.

Tests: `npm run test:manifest` (build -> plan -> seed -> check -> finalise -> check -> inscribe,
all in simnet with the real core).
