# Codex review -> v1.2 remediation map

| # | Finding | Resolution | Where |
|---|---------|------------|-------|
| 1 | Scope squatting | create-scope is self-claim only (tx-sender becomes authority; no authority arg). derive-scope-key(authority,label)=sha256(consensus-buff(principal)||label) gives collision-proof keys. Residual: raw labels remain first-come AS the claimant - documented in XIP-009 s4.2 + Security considerations. | contract create-scope, derive-scope-key; XIP-009 s4 |
| 2 | Fake verification | Split: contract-set core-hash-verified (never claimable) vs registrar claimed-verification, range-checked (u122). Targets: contract-set core-exists + renamed claimed-* fields, range-checked. | contract R2 fields; XIP-009 s2 |
| 3 | Parent edge unchecked | Core get-parents consulted: at registration when a predecessor is declared, at succession, and in mark-superseded (u120). XIP-001 s6 edge is authoritative. | contract core-parent-edge; XIP-009 s3.5, s6.2 |
| 4 | Scope policy ignored | Candidate lifecycle + authority-class must equal scope's; manifest-type fixed across succession (u123). | contract matches-scope-policy; XIP-009 s4.3 |
| 5 | Mutable commitments | Succession functions take no root/count arguments; pointer advances from values committed at registration; records never rewritten. | contract update-scope-manifest; XIP-009 s6.3 |
| 6 | Pointer desync | withdraw + mark-superseded rejected while current (u119, via contract-set current-scope marker). revoke allowed as emergency, pointer preserved, get-current-active-manifest added; resolver duty documented. | contract R6; XIP-009 s7 |
| 7 | MIME unchecked | Registration requires application/vnd.xtrata.manifest+json from core InscriptionMeta (u121). | contract core-mime-is-manifest; XIP-009 s3.3 |
| 8 | Process status | Spec rewritten as Draft Standards Track XIP-009 per XIP-000 template (header schema, RFC2119, Requires gate). Contract relabelled DRAFT v1.2. | docs/XIP-009 |

New discoveries surfaced while testing the fixes (documented in XIP-009):
- Core validate-parents requires OWNING each declared parent at seal time ->
  delegated succession needs the predecessor inscription handed to the
  inscriber first (s6.4).
- Core final-hash is chained sha256 with a 32-zero-byte seed (Test vectors).

New error codes (v1.2): u119 MANIFEST-IS-CURRENT, u120 PARENT-EDGE-MISSING,
u121 WRONG-MIME, u122 INVALID-VERIFICATION-CLASS, u123 SCOPE-POLICY-MISMATCH,
u124 TARGET-NOT-IN-CORE.

# Second codex review -> v1.3 remediation map

| # | Finding | Resolution | Where |
|---|---------|------------|-------|
| 1 | Registration front-run / poisoning | Registration is creator-only: tx-sender must equal the core creator (u100). Registrar == creator always; delegates register their own inscriptions. Trade-off (lost-key creators) documented. | contract is-core-creator; XIP-009 s3.6 |
| 2 | Multi-scope current clobber | Both succession entry points reject a candidate whose current-scope is already set (u119): a manifest heads at most one scope. Mirroring requires distinct inscriptions. | contract R10 asserts; XIP-009 s6.1 |
| 3 | derive-scope-key vector missing | TV-1 added to XIP-009 with exact preimage bytes and digest; reproducible generator tests/scope-key-vector.mjs recomputes off-chain and asserts equality with the on-chain read-only. | XIP-009 Test vectors; tests/scope-key-vector.mjs |
| 4 | Pack not independently runnable | Pack is now a complete Clarinet project: full Clarinet.toml, settings/Devnet.toml, core + legacy stubs + cached nft-trait requirement, package.json. `npm install && npm test` from the pack root. | repo layout, README |

# Third codex review -> v1.4 remediation map

| # | Finding | Resolution | Where |
|---|---------|------------|-------|
| 1 | Authority transfer invalidates derived scope identity | Scopes carry an immutable key-authority (creator principal) separate from the transferable operational authority. Derived keys validate against key-authority only; set-scope-authority never touches it. Tested: transfer then re-derive. | contract scopes tuple, create-scope; XIP-009 s4.2/s4.2.1 |
| 2 | Included core not verbatim | README corrected: live source with SIP-009 trait binding switched to the mainnet reference for simnet; behaviour otherwise unchanged. | README |
| 3 | Stale test-plan version heading | Heading bumped to v1.4 and suite count updated (58). | test plan |
