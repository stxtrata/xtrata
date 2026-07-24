# Proof of Free v3 deployment runbook

## The order

The engine is first. The controller source contains the confirmed engine
inscription ID and SHA-256 as immutable Clarity constants, so the contract
cannot be finalized before that ID exists.

The complete mainnet order is:

1. freeze and test the engine;
2. inscribe and verify the engine;
3. generate, audit, and deploy `proof-of-free-v1`;
4. configure its sponsor and BNS attestor;
5. create immutable campaign `0` (it starts closed);
6. build and inscribe the 1,024 tiny seed HTML files;
7. escrow them in edition order with sponsorship budgets;
8. verify all 1,024 contract records and registry state;
9. inscribe the master mosaic and verify its fail-closed state;
10. open campaign `0`, then execute one real claim as the mainnet canary.

The master comes late because it references both the engine and deployed
controller. It can be inscribed before opening: while campaign `0` is inactive
it must show 1,024 black, inert squares.

## Roles and identities

- NFT contract: canonical
  `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3`.
- Collection controller name: `proof-of-free-v1`.
- Full controller ID: `<DEPLOYER>.proof-of-free-v1`. Confirm the deployer
  address before generating public configuration; a Clarity contract name
  alone is not a contract ID.
- Campaign: `u0`, maximum supply `u1024`.
- Rules: `one-per-wallet=true`, `require-bns=true`, `one-per-bns=true`.
- Contract state, not the web UI, is authoritative for claim eligibility.

The controller starts campaign `0` inactive, permits provisioning while
inactive, and refuses to open until `drops-created == 1024`. Generic legacy
`create-drop` and `claim` entry points are disabled. Claim editions are
one-based so they map directly to seed editions and mosaic cells.

## Stage 0: freeze candidate

```sh
cd Proof-of-Free/Living-Synth-v3
npm test
node scripts/build-collection.mjs
shasum -a 256 artifacts/proof-of-free-engine-v3.js
```

Gate:

- tests pass;
- two consecutive builds produce the same engine hash and manifest;
- engine artifact MIME is `text/javascript`;
- no seed or master release is built with engine ID `0`;
- browser tests cover one instrument and a registry failure (all-black mosaic).

Record the Git commit, engine bytes, and SHA-256. Do not rebuild from changed
sources after this point.

## Stage 1: engine inscription

Inscribe exactly `artifacts/proof-of-free-engine-v3.js` through canonical
Xtrata core and wait for transaction success. Reconstruct `/i/<ENGINE_ID>` and
compare its bytes and SHA-256 with the frozen artifact.

The deploy-console workflow is:

1. open `/web/deploy-console.html`;
2. find **Proof of Free v1 — Living Synth v3 controller**;
3. enter the new Xtrata engine inscription ID;
4. leave the prefilled candidate hash unchanged unless the frozen artifact was
   deliberately rebuilt and re-audited;
5. click **0. Verify inscribed engine**.

The contract preflight button remains disabled until Xtrata reports a sealed
`text/javascript` inscription whose final hash exactly matches the input.

Gate: route content, MIME, byte count, and SHA-256 all match. A mismatch stops
the launch; never put an unverified ID in the controller.

## Stage 2: controller

Generate both deployment and Clarinet variants using the real engine values:

```sh
node scripts/build-contract.mjs \
  --engine-id <ENGINE_ID> \
  --engine-sha256 <ENGINE_SHA256>

node scripts/build-contract.mjs \
  --engine-id <ENGINE_ID> \
  --engine-sha256 <ENGINE_SHA256> \
  --clarinet

clarinet check release/contracts/proof-of-free-v1.clarinet.clar
```

Alternatively, after the engine gate passes in `/web/deploy-console.html`:

1. click **1. Load + preflight**;
2. confirm the source byte count/SHA-256 and that the contract name is free;
3. click **Download generated .clar** and retain it with the release evidence;
4. connect the `SP3JN…743X` deployer wallet;
5. click **2. Deploy** and confirm the Clarity 4 publish;
6. after confirmation, re-run preflight so the card enters post-deploy mode;
7. set sponsor, set the BNS attestor hash, then create locked campaign `0`;
8. after each transaction confirms, click **6. Verify contract + campaign 0**.

The downloaded console source and `build-contract.mjs` output are covered by a
byte-for-byte parity test.

Audit the generated diff against `xtrata-drops-v1.1`, then deploy the mainnet
variant as `proof-of-free-v1`. Read and verify:

- `get-collection-config`: exact engine ID/hash, campaign `0`, supply `1024`,
  and all rules true;
- `get-nft-contract`: canonical Xtrata v3.2.3;
- `get-next-campaign-id`: `0` before initialization;
- owner, sponsor, and BNS attestor values.

Set the sponsor address and the BNS attestor hash. Configure the site with:

```text
POF_CONTRACT_ID=<DEPLOYER>.proof-of-free-v1
SPONSOR_MARKETS=<existing comma-separated allowlist>,<DEPLOYER>.proof-of-free-v1
```

`BNS_ATTESTATION_PRIVATE_KEY` must match the configured attestor hash. It must
not be the sponsor wallet key and must never be committed.

Create campaign `0` with:

```clarity
(create-campaign u<ENGINE_ID> u1024 true true true)
```

Gate: return value is `(ok u0)`; a second campaign creation fails; campaign is
inactive; attempts with any other engine, supply, or false rule fail.

## Stage 3: seeds and provisioning

Build release seeds only after the engine ID is final:

```sh
node scripts/build-collection.mjs --engine-id <ENGINE_ID> --seeds
```

Inscribe seed files in numeric edition order. For every result, verify:

- edition in embedded JSON equals the filename edition;
- engine ID, engine version, and genome hash match the manifest;
- on-chain content SHA-256 matches the manifest;
- the canonical Xtrata token owner is the provisioning wallet.

Create campaign drops in the same strict order. The controller assigns
editions `1..1024` from this order. Store a signed deployment ledger containing
edition, seed SHA-256, token ID, inscription transaction, drop ID, escrow
transaction, and fee budget.

Gate after every batch:

- `get-campaign(0).drops-created` equals the ledger length;
- each `get-drop(drop-id)` has campaign `0`, expected edition/token, no
  claimer, and its budget;
- NFT ownership is the controller;
- duplicate token, wrong NFT contract, and edition 1025 attempts fail;
- public claims still fail because the campaign is inactive.

Do not use a mainnet claim as an early canary: one-per-wallet and one-per-BNS
are permanent, and the contract deliberately cannot open before all 1,024
items are loaded. Test the complete flow on simnet/testnet first.

## Stage 4: claimed-only registry and master

Deploy the Xtrata site changes and query:

```text
/collection-drop/registry?contract=<URL_ENCODED_CONTROLLER_ID>&campaign=0
```

Before opening, it must report the exact contract, engine ID/hash, supply,
inactive state, all three strict policies, and zero claims.

Build the master:

```sh
node scripts/build-collection.mjs \
  --engine-id <ENGINE_ID> \
  --controller <DEPLOYER>.proof-of-free-v1 \
  --registry-url "https://xtrata.xyz/collection-drop/registry?contract=<CONTROLLER_ID>&campaign=0" \
  --master
```

Use the actual registry URL as one quoted argument. Inspect
`release/proof-of-free-master.html`, then inscribe and reconstruct it.

Gate:

- 32x32 grid is entirely black;
- no black cell responds to click/touch;
- “play claimed” is disabled;
- wrong contract, engine hash, supply, policy, inactive state, malformed
  claims, duplicate edition/token, HTTP failure, and invalid JSON all fail
  closed to an all-black grid.

## Stage 5: opening and mainnet canary

Only after the 1,024-entry ledger and master checks pass:

1. call `(set-campaign-active u0 true)`;
2. confirm registry reports active with zero claims;
3. claim one chosen drop from a separate STX-empty wallet holding a valid BNS;
4. confirm NFT transfer, wallet/BNS claim maps, sponsorship reimbursement,
   refund settlement, and exactly one revealed/triggerable mosaic cell;
5. attempt a second claim with the same wallet and a second wallet using the
   same BNS; both must fail;
6. let the public launch proceed.

Claims are append-only reveal events. Later NFT transfers do not black out a
cell because the mosaic represents which synths have been claimed, not current
ownership.

## Stop and recovery rules

- Before opening: leave campaign inactive. Correct website/configuration
  faults and re-run gates. Contract, engine, or seed byte faults require a new
  version; do not silently substitute artifacts.
- After opening: immediately set campaign inactive to stop new claims if the
  attestor, sponsor, registry, or claim path is compromised. Already claimed
  NFTs remain with collectors and revealed cells remain part of history.
- Never rotate the engine behind v3. A new engine means a new engine version
  and controller contract name.
- Keep the deployment ledger, generated contract, manifests, hashes,
  transaction IDs, and test output as the release evidence bundle.
