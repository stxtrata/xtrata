# Xtrata Manifest Authority - v1.4 review pack

Remediates BOTH codex reviews (findings 1-8, then 1-4). DRAFT / NOT AUDITED.

## Run (self-contained, no network beyond npm)
    npm install
    npm test
Expected: "58 passed, 0 failed" then "VECTOR OK: off-chain == on-chain".
The SIP-009 nft-trait requirement is pre-cached in .cache/requirements/; the
legacy v1/v2 contracts are compile-only stubs (never deploy). contracts/xtrata-v3-2-3.clar is the live core source with the
SIP-009 trait binding switched to the mainnet reference for simnet resolution;
behaviour is otherwise unchanged from the deployed contract.

## Contents
contracts/helpers/xtrata-manifest-authority-v1.clar  v1.4 (Clarity 4 / epoch 3.3)
docs/XIP-009-Manifest-Authority-Registry.md          Draft Standards Track XIP, spec 0.4.0 (incl. TV-1)
docs/codex-remediation-map.md                        Both reviews, finding-by-finding
tests/smoke.mjs                                      58 assertions incl. all attack scenarios
tests/scope-key-vector.mjs                           XIP-000 s9 vector generator (TV-1)
tests/xtrata-manifest-authority-v1.test-plan.md      Plan + open items

## v1.4 deltas (on top of v1.3's creator-only registration + single-scope rule)
- Immutable key-authority anchors derived scope identity; operational
  authority remains transferable (XIP-009 s4.2.1)
- README core-source wording corrected; test-plan heading fixed
