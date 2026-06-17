# XMA-1 v1.5 Test Plan

Executable suites (all against the live xtrata-v3-2-3 source in Clarinet simnet,
helper compiled as Clarity 4 / epoch 3.3), run together via `npm test`:

- `tests/smoke.mjs` — 58 assertions mapping to the codex review findings (R#).
- `tests/edge.mjs` — 53 assertions over feature seams not tied to a finding
  (E1–E8), including the v1.5 permanent-seal behaviour (E8).
- `tests/fuzz.mjs` — randomized property suite: long sequences of registry
  operations with a global-invariant sweep after every step (`npm run fuzz` for
  ad-hoc/longer runs; `npm test` pins SEED=1 OPS=150). A failing run prints its
  SEED for exact replay.
- `tests/scope-key-vector.mjs` — XIP-000 §9 derive-scope-key vector (TV-1).

This plan maps the scenario suites to the codex review findings (R#).

## Registration
- unknown/unsealed inscription -> ERR-CORE-NOT-SEALED u117
- wrong manifest-hash -> ERR-HASH-MISMATCH u116; matching hash sets
  contract-set core-hash-verified=true; no hash sets it false (R2)
- non-manifest MIME -> ERR-WRONG-MIME u121 (R7)
- declared predecessor without core parent edge -> ERR-PARENT-EDGE-MISSING u120 (R3)
- out-of-range claimed-verification -> ERR-INVALID-VERIFICATION-CLASS u122 (R2)
- duplicate registration -> ERR-ALREADY-REGISTERED u101

## Scopes (R1)
- create-scope assigns tx-sender; no third-party authority argument exists
- raw label remains claimable by an attacker AS THEMSELVES (documented residual)
- derive-scope-key(authority, label) returns the bound key
- set-scope-authority only by current authority; delegates inherited on
  transfer (documented; new authority should audit)

## Scope policy (R4)
- snapshot/owner-class manifest rejected as head of a continuity corpus scope
  -> ERR-SCOPE-POLICY-MISMATCH u123
- manifest-type must be unchanged across succession -> u123

## Delegates
- only authority adds/removes (u113); unknown removal -> ERR-NOT-DELEGATE u118
- delegate-created manifest accepted in succession; delegate cannot call
  succession functions (u113); non-delegate creator rejected (u100)
- removed delegate rejected for future successions; already-current manifest
  unaffected

## Succession
- previous must be the scope head (u109); candidate must have DECLARED the
  predecessor at registration (u109) AND carry the core parent edge (u120) (R3)
- commitments immutable: scope root/count advance to the values committed at
  registration; succession takes no root/count arguments (R5)
- supersession pointers (status u2, superseded-by, current-scope released) set
  atomically

## Lifecycle vs pointer (R6)
- withdraw of current head -> ERR-MANIFEST-IS-CURRENT u119
- mark-superseded of current head -> u119; otherwise requires declaration +
  core parent edge
- revoke of current head ALLOWED (emergency); structural pointer preserved;
  get-current-active-manifest returns none; recovery succession appoints
  successor of the revoked head

## Targets
- target must exist in core -> ERR-TARGET-NOT-IN-CORE u124 (contract-set
  core-exists); claim range checked (u122)

## Core workflow constraints (discovered, documented in XIP-009 s6.4)
- core validate-parents requires the minter to OWN each declared parent at
  seal time; suite transfers the predecessor inscription before the successor
  is inscribed
- core final-hash is chained sha256 (seed 32 zero bytes), not sha256(content)

## Registration authority (R9, 2nd review #1)
- non-creator registration (front-run) -> ERR-UNAUTHORISED u100
- creator registration succeeds; registrar == creator invariant

## Single-scope currency (R10, 2nd review #2)
- already-current manifest rejected as a second scope's initial head -> u119
- already-current candidate rejected in update-scope-manifest -> u119

## Scope-key vector (2nd review #3)
- tests/scope-key-vector.mjs: off-chain sha256(consensus-buff(principal)||label)
  == on-chain derive-scope-key, byte-exact (XIP-009 TV-1)

## Key authority vs operational authority (R11, 3rd review #1)
- derived scope created from derive-scope-key(w1,label)
- set-scope-authority transfers operational authority; key-authority immutable
- re-derivation from (key-authority,label) still equals the stored key

## Edge-case suite (tests/edge.mjs, E1-E8)
- E1 derived-key squat: a derived key can be claimed by a non-deriving
  principal; resolvers MUST verify key-authority == derived-from (XIP-009 s4.2)
- E2 contract-owner may revoke a manifest it did not register; withdraw remains
  registrar-only (documented asymmetry, XIP-009 s7)
- E3 fork resolution: two competing successors of one head; loser stranded (u109)
- E4 authority-transfer aftermath: old authority defanged (u113); delegates
  inherited by the new authority
- E5 idempotent re-withdraw; orphan predecessor declaration (core edge only)
- E6 boundary inputs: claim=0, item-count=0, self-referential predecessor (u120)
- E7 manifest-type frozen by the first scope head; later type change -> u123
- E8 permanent seal (close-scope, v1.5 S1): key-authority-only, one-way, sealed
  scope rejects all mutation (u125), final manifest preserved, revoke-still-works
  but no recovery

## Seal / scope finality (v1.5 S1)
- close-scope gated to immutable key-authority; operational authority cannot seal
  (u113); one-way (double-seal -> u125)
- sealed scope rejects add/remove-delegate, set-authority, register-initial,
  update-scope-manifest (all u125)
- is-scope-active reflects sealed state; get-current-active-manifest preserved

## Property / fuzz (tests/fuzz.mjs)
- randomized op sequences (create/register/seed/succeed/revoke/withdraw/seal/
  transfer/set-authority/add+remove-delegate) with a global-invariant sweep
  after every step. Invariants: pointer consistency (INV1), single-scope
  currency (INV2), active-view correctness (INV3), seal immutability (INV4),
  no resurrection to ACTIVE (INV5), succession continuity (INV6)
- reproducible via SEED; negative-control confirmed the sweep catches a
  deliberately corrupted invariant

## Not yet covered (for future work)
- gas/cost profiling of succession with contract-calls to core
- external audit (the contract remains DRAFT / NOT AUDITED)
