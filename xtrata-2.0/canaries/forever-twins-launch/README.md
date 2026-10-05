# Forever Twins launch canary

One self-contained page that launches a Forever Twins helper for one collection from the Xtrata web wallet
(Xverse or Leather), in the only safe order. It holds no key: every transaction is signed in the wallet. Each step
unlocks only when the one before it passed, and each re-reads the chain rather than trusting the page, so a reload or
"Forget local progress" resumes from what the chain already holds and nothing is sent twice.

First used for **NYC Degens** (G1, 420 tokens, fully sponsored). It is generic: a new collection needs only a helper
config, a manifest and a pin.

## Build

```bash
npm run build:canary:forever-twins -- --collection nyc-degens
```

Writes `canaries/build/forever-twins-launch-<key>-canary.html`. The build:

- renders the helper from `forever-twins/ft-harness/templates` with `scripts/configs/mainnet-<key>.v3.json`;
- requires `manifest/out/<key>.manifest.json` to match its `.sha256`, to be a full (not partial) manifest, and to be
  byte-identical to `public/ft/data/<key>.manifest.json` (the copy the resolver serves);
- refuses unless the rendered helper sha256, the manifest sha256 and the deployer match `pins.json`.

New collection: review the config and manifest, then pin once:
`npm run build:canary:forever-twins -- --collection <key> --pin --deployer <SP… address that will own the helper>`.
Re-pin only if a change is intended.

Optional helper-config fields the canary reads: `testToken` (the token used for the test inscription; default is the first
manifest token, so pick an unlisted one for a G2 collection) and `listingReadFn` (G2; default `get-listing-in-ustx`).
Seeding takes at most 100 records per signature, so a 2,500-token collection needs 25.

## Run

Wallet extensions do not inject into `file://`, so serve it. Use a port other than 8080 (your local IPFS gateway):

```bash
cd canaries/build && python3 -m http.server 8765
# open http://localhost:8765/forever-twins-launch-nyc-degens-canary.html
```

| # | Step | Signs | What it proves |
|---|------|-------|----------------|
| 1 | Connect | wallet | Only the pinned deployer can continue (a payee wallet is refused) |
| 2 | Preflight | none | Helper and manifest match the pins; no large (>512 KB) files; core open; source collection live; **the source's token URIs still match the manifest snapshot (a spread of tokens)**; G2: the listing read works; name free; balance; resolver status |
| 3 | Deploy | wallet | Helper deployed (Clarity 4); skipped if the pinned source is already there |
| 4 | Verify | none | Source, master, source, group, both payees, fee, ceiling, owner all as configured |
| 5 | Seed | wallet × batches | Canonical records written in batches (100 / 50 / 25); batches already on chain are skipped, a partial or different batch stops the run |
| 6 | Audit | none | Every record read back and compared with the manifest; no extra ids; count right |
| 7 | Finalise | wallet | ONE-WAY. Blocked until the resolver serves a byte-identical manifest, sample token-uris answer and the source's token URIs are still unchanged since the snapshot; you type the collection key to confirm |
| 8 | Test inscription | wallet | One twin inscribed from this (non-payee) wallet: file read from the local gateway and checked (size, sha256, rolling hash) before signing; sender post-condition; both payees get half the fee; binding, custody and ownership verified |
| 9 | Hand-off | none | Resolver config change, sponsor-script commands and the registry entry |

Cost for NYC Degens: deploy and 5 seed calls plus finalise are small network fees; the test inscription costs the
full fee (0.1 STX) plus the core fee (about 0.02 STX) because this wallet is not a payee. Keep at least 3 STX free.

## After the canary

1. `functions/ft/collections.json`: set `helper` and `manifestStatus: "final"`, deploy the resolver.
2. Sponsor the rest with `forever-twins/ft-harness/manifest/sponsor-inscribe.mjs` (the hand-off prints the commands).
3. Add the registry entry (`registry/registry.v1.json`) and run `npm run registry:verify`.

## Tests

```bash
node canaries/forever-twins-launch/make-test-collection.mjs <repoRoot> <freshScratchDir> <deployer> [G2]
node scripts/build-forever-twins-launch-canary.mjs --root <freshScratchDir> --collection testcol --pin --deployer <deployer>
NODE_PATH=<dir with playwright + @stacks/transactions v6> CHROME_PATH=<chromium> \
  GROUP=G1|G2 node canaries/forever-twins-launch/mock-chain-test.cjs <freshScratchDir>   # GROUP must match the [G2] argument above
```

Builds a synthetic 60-token collection and runs every step against an in-memory chain (helper, core and Hiro API)
with a stub Leather wallet. It checks: wrong wallet refused; finalise blocked until the resolver is live; tampered file
refused before signing; non-payee inscription pays each payee 0.05 STX; re-run after "Forget progress" resumes from
the chain and sends nothing.

## What this cannot cover

- Real wallet signing was not exercised (extensions need a real browser session). Seed transactions carry up to 100
  records (~25 KB); if a wallet struggles, pick a smaller seed batch (50 or 25) before seeding.
- The test inscription reads the file from your local IPFS gateway directly from the page (default
  `http://127.0.0.1:8080`). If the browser blocks it (CORS), the sponsor script does the same inscription from the
  command line.
- The mock chain implements the helper's behaviour as read from the contract; the fork rehearsal on stxer
  (`manifest/stxer-fork-test.mjs`) is the check against the real contract and core.
