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
- Full Xtrata application suite: 993 passed; full Clarinet suite: 322 passed,
  35 skipped; production build passed.

No mainnet artifact has been generated with a fake ID. The real deployment
continues from the engine inscription gate in
`Proof-of-Free/Living-Synth-v3/DEPLOYMENT.md`.
