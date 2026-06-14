# XMA-1 v1.4 Test Plan

The executable reference suite is `tests/smoke.mjs` (58 assertions, all passing
against the live xtrata-v3-2-3 source in Clarinet simnet, helper compiled as
Clarity 4 / epoch 3.3). This plan maps suites to the codex review findings (R#).

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

## Not yet covered (for codex / future work)
- scope deactivation paths (no deactivate function exists yet - decide)
- fuzz/property tests over enum ranges and succession orderings
- gas/cost profiling of succession with contract-calls to core
