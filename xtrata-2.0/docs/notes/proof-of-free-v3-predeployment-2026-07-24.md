# Proof of Free v3 predeployment preparation — 2026-07-24

The Living Synth v3 release now has an engine-first deployment path. Its
builder refuses release seeds/master HTML with a placeholder engine ID. The
same universal engine includes a claimed-only 32×32 master mode that verifies
the controller, engine SHA-256, supply, active state, and all BNS/wallet rules,
and fails closed to black.

`build-contract.mjs` derives `proof-of-free-v1` from the audited Drops v1.1
source and pins the confirmed engine ID/hash. It restricts the deployment to
campaign zero, supply 1024, BNS required, one per BNS, and one per wallet;
starts closed; permits provisioning while closed; refuses to open before all
1,024 NFTs are escrowed; uses one-based editions; and disables legacy direct
drop/claim entry points.

The Pages claimed registry now supports an exact environment-allowlisted PoF
controller and emits the strict envelope consumed by the master. The sponsor
handler treats an exact `SPONSOR_MARKETS`-allowlisted `proof-of-free-v1`
contract as the existing five-argument campaign ABI.

Evidence run on 2026-07-24:

- Living Synth Node release tests: 4 passed.
- Headless Chrome master smoke: registry failure remained all-black and only
  the two claimed cells were revealed/triggerable.
- Generated dedicated controller: `clarinet check` passed (existing unchecked
  input warnings inherited from Drops v1.1).
- Focused registry and production sponsor handler tests: 36 passed, including
  direct on-chain controller fingerprint/policy reads.
- Full Xtrata application suite: 1,000 passed; full Clarinet suite: 322 passed,
  35 skipped; production build passed.

No mainnet artifact has been generated with a fake ID. The real deployment
continues from the engine inscription gate in
`Proof-of-Free/Living-Synth-v3/DEPLOYMENT.md`.

## Deployment-console continuation

The main deploy console now includes a `proof-of-free-v1` card. It preloads the
frozen engine candidate hash, verifies the user-entered inscription ID against
canonical Xtrata metadata, generates and preflights the engine-bound contract,
offers the exact generated `.clar` as a download, submits the wallet-signed
deployment and post-deploy sponsor/BNS/campaign calls, and verifies
`get-collection-config` plus inactive campaign `0`.

The console generator is tested byte-for-byte against the command-line release
generator. A headless Chrome smoke verified that preflight is locked before the
engine check, the expected hash is prefilled, matching on-chain metadata
unlocks generation, and the generated source passes browser preflight.
The deployment helper tests passed 14 focused checks, including six dedicated
Proof of Free generation, invariant, parity, and read-only parsing checks.
