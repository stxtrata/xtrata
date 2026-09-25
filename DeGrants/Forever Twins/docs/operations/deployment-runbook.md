# Deployment runbook: one helper

For deploying a v3 helper for one collection. Do every step; tick as you go.

## 0. Before anything
- [ ] Collection passes [onboarding eligibility](../guides/onboarding.md).
- [ ] `npm test` and `npm run test:v3` pass in the real harness.
- [ ] Mainnet-fork run for this collection passes.
- [ ] Owner key on a hardware wallet, funded for deploy and seeding fees.

## 1. Config
- [ ] `scripts/configs/mainnet-<collection>.json` with: `collectionKey`, `master`
      (`SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3`), `source`, `sourceAsset`
      (exact, case-sensitive), `group`, `listingReadFn` (G2), `payees` [Jim, Rapha],
      `initialFeeUstx` 1000000, `maxFeeUstx`, `rescueEnabled`, `rescueDelayBurnBlocks` 432,
      `profileTier` "S".
- [ ] `node scripts/render-helper-v3.mjs <config> <out.clar>` succeeds (it refuses bad payees,
      odd fees, fee above cap).
- [ ] Read the rendered payee constants aloud against the agreed addresses.

## 2. Read-only checks against mainnet
- [ ] `npm run live-check` including the source: `get-owner` is read-only, asset name correct,
      listing function present (G2).

## 3. Manifest
- [ ] Confirm the twin token-URI policy (D3) and set `twinTokenUri` in
      `manifest/configs/<collection>.json`.
- [ ] `npm run manifest:build -- manifest/configs/<collection>.json --snapshot-api https://api.hiro.so`
      (exit 2 means refused: a token over 512 KB or a failed fetch; read `<key>.report.json`).
- [ ] Count equals supply; `report.largest` under 512 KB; look at `identicalContent`.
- [ ] Publish `<key>.manifest.json` byte-for-byte; record the sha256 from `<key>.manifest.sha256`.

## 4. Deploy
- [ ] Deploy with Clarity 4 from the owner key. Record contract address and tx id.
- [ ] `get-twin-interface`: version u3, correct source, group, payees, fee, owner.

## 5. Seed
- [ ] `npm run manifest:plan -- manifest/out/<key>.manifest.json --helper <SP...helper>`
      gives every `seed-canonical` batch (100 entries) and the `finalize-canonical` call as
      Clarity args and unsigned payloads. Sign and send from the owner wallet. Record tx ids.
- [ ] `npm run manifest:check -- manifest/out/<key>.manifest.json --helper <SP...helper>`
      must say "ready to finalise" (every `get-canonical` entry and the count match).

## 6. Community review (optional but recommended)
- [ ] Announce the manifest link and helper address; allow time for checks.

## 7. Finalise
- [ ] `finalize-canonical(manifest-sha256, count)`. Irreversible.
- [ ] `is-finalized` true; `canonical-count` equals supply.
- [ ] Run `manifest:check` again: "finalised and matches manifest" (includes the manifest hash).

## 8. First use
- [ ] One inscription; check each payee received half and `fee-for` matched.
- [ ] One swap in and one swap back; `get-custody-state` consistent.

## 9. Publish
- [ ] Add to `ft-harness/registry/registry.v1.json` (one helper per collection; record the
      deployed source sha256) and run `npm run registry:verify`.
- [ ] Add to the evidence log in [../grant/reporting.md](../grant/reporting.md).
- [ ] Announce.

## Rescue procedure (if a stray arrives)
1. Confirm the stray with `stray-side` and find the real sender on an explorer.
2. `propose-rescue(token-id, sender)`; post publicly with the explorer link.
3. After the delay, `execute-rescue(token-id)`; check custody state.
