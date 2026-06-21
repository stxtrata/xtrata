# XIP-009: Manifest Authority Registry

- XIP: 009
- Title: Manifest Authority Registry
- Status: Draft
- Category: Standards Track
- Requires: XIP-000, XIP-001
- Spec version: 1.0.0

> The key words **MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**,
> **SHOULD**, **SHOULD NOT**, **RECOMMENDED**, **MAY**, and **OPTIONAL** in this
> document are to be interpreted as described in RFC 2119 and RFC 8174.

## Abstract

XIP-009 specifies `xtrata-manifest-authority-v1` (XMA-1), an on-chain registry
that attaches durable authority, scope, lifecycle, and succession metadata to
XIP-001 manifest inscriptions. The registry does not parse manifest JSON; it
records which manifest claims are recognised, what scope they govern, which
manifest is the current head of a scope, and which compact commitments a
resolver should verify. Core facts (creator, owner, hash, parents, sealed
status, MIME type) remain authoritative in `xtrata-v3-2-3`; XIP-001 remains
authoritative for manifest bytes, canonicalisation, and integrity roots.

This document supersedes the informal "manifest-authority-v1-spec" draft and
incorporates the remediations from three external security reviews. It specifies
permanent scope **sealing** (§4.4) and an explicit lifecycle-operation authority
model (§7).

## Motivation

XIP-001 makes manifests permanent and verifiable, and its §6 makes supersession
an on-chain parent relation. What it deliberately does not provide is a cheap,
queryable answer to: *which manifest is the recognised current one for this
collection / corpus / namespace, who recognised it, and under what authority?*
Without a registry, every resolver must independently walk parent DAGs and apply
precedence heuristics. XMA-1 provides a single registration-and-succession
surface whose guarantees are enforced by contract where the core makes that
possible, and clearly labelled as claims where it does not.

## Specification

### 1. Definitions

- **Manifest inscription** — a sealed Xtrata inscription whose bytes are a
  XIP-001 manifest and whose MIME type is
  `application/vnd.xtrata.manifest+json`.
- **Registration** — a record in XMA-1 keyed by the manifest's inscription id.
- **Scope** — a governed identity (a corpus, collection, namespace…) keyed by a
  32-byte scope key, holding a current-manifest pointer.
- **Scope authority** — the principal that controls a scope's pointer.
- **Scope delegate** — a principal whose *inscriptions* the authority may
  recognise in succession, without pointer rights of its own.

### 2. Contract-set facts vs registrar claims

Every field in a registration is exactly one of the following, and
implementations **MUST NOT** present a claimed field as verified:

| Field | Class | Meaning |
|---|---|---|
| `core-hash-verified` | **contract-set** | The supplied `manifest-hash` equalled the core `final-hash` at registration. `false` when no hash was supplied. |
| `created-at` | **contract-set** | Registration block height (`stacks-block-height`). |
| `current-scope` | **contract-set** | The scope this manifest currently heads, if any. |
| existence, sealed, MIME, parent edges, creator | **contract-checked** at call time against `xtrata-v3-2-3` (not stored; re-derivable). |
| `claimed-verification` | **registrar claim** | Off-chain checks the registrar attests to (`0..3`: none / unverified / verified-off-chain / partial). Range-checked only. |
| `authority-class`, `manifest-type`, `lifecycle`, `target-mode`, `schema-*`, `integrity-root`, `scope-root`, `item-count`, `changed-count`, `manifest-hash` | **registrar claim** | Validity-range-checked and (for the hash) core-checked, but semantically asserted by the registrar. |

### 3. Registration (`register-manifest`)

Registration **MUST** be rejected unless all of the following hold:

1. The inscription id is not already registered.
2. The inscription exists in the core **and is sealed**.
3. The inscription's core MIME type equals
   `application/vnd.xtrata.manifest+json` (XIP-001 §2).
4. If `manifest-hash` is supplied, it equals the core `final-hash`.
5. If `previous-manifest-id` is supplied, the core parent list of the new
   inscription contains it — the XIP-001 §6 parent edge is authoritative and
   **MUST** exist *before* a predecessor may be declared.
6. `tx-sender` is the inscription's immutable core **creator**. Registration
   is creator-only: open registration allows an attacker to front-run the
   creator, poison the record with arbitrary metadata, permanently block the
   creator with `ERR-ALREADY-REGISTERED`, and (as registrar) revoke the
   manifest after it becomes current.
7. All enumerated fields are within their defined ranges, including
   `claimed-verification`.

The registrar therefore always equals the core creator. For delegated
workflows the *delegate* (as core creator of the manifest it inscribed)
registers its own inscription.

### 4. Scopes

#### 4.1 Creation is self-claim only

`create-scope` assigns `tx-sender` as the authority; there is **no** authority
argument. A scope **MUST NOT** be created on behalf of a third party
(transfer afterwards via `set-scope-authority`).

#### 4.2 Scope keys and the residual squatting risk

Raw 32-byte scope keys are first-come-first-served. A hostile party can still
occupy a *label* (e.g. the bytes `"xip-corpus"`) as themselves. To make a key
unsquattable, an authority **SHOULD** use the derived form, computed on-chain
by the read-only `derive-scope-key`:

```
scope-key = sha256( consensus-buff(authority-principal) || label-32-bytes )
```

A derived key is bound to the scope's **immutable `key-authority`** — the
principal that created the scope, recorded once and never modifiable.
Resolvers recompute the key from `(key-authority, label)` and **MUST** treat a
scope whose stored `key-authority` does not match the derivation input as
invalid. The transferable *operational* `authority` (§4.2.1) plays no role in
key validation, so transferring a scope does not invalidate its derived
identity. Well-known ecosystem scopes (e.g. the XIP corpus) **SHOULD** publish
their `(key-authority, label)` pair so the key is independently computable.

#### 4.2.1 Key authority vs operational authority

| Field | Mutability | Role |
|---|---|---|
| `key-authority` | **immutable** (set to `tx-sender` at creation) | Anchors derived-key validation (§4.2); provenance of the scope claim. |
| `authority` | transferable via `set-scope-authority` | Controls the pointer, delegates, and succession (§§5–6). |

#### 4.3 Scope policy

A scope fixes `authority-class` and `lifecycle` at creation. A manifest **MUST
NOT** become current for a scope unless its registered `lifecycle` and
`authority-class` equal the scope's. Successive current manifests **MUST**
keep the same `manifest-type`.

#### 4.4 Sealing a scope (`close-scope`)

A scope **MAY** be permanently *sealed* by calling `close-scope`. Sealing is a
**one-way** operation: a sealed scope can never be reopened. Only the immutable
`key-authority` (the original creator, §4.2.1) **MAY** seal a scope; the
transferable operational `authority` **MUST NOT** be able to seal, so the power
to finalise a scope always remains with its originator even after operational
control has been handed off. Attempts by any other principal **MUST** be
rejected with `ERR-NOT-SCOPE-AUTHORITY` (`u113`).

A sealed scope (`active = false`) **MUST** reject every further mutation —
`add-scope-delegate`, `remove-scope-delegate`, `set-scope-authority`,
`register-initial-scope-manifest`, and `update-scope-manifest` — with
`ERR-SCOPE-CLOSED` (`u125`). Re-sealing an already-sealed scope is likewise
rejected with `u125`. The scope retains its current-manifest pointer, which a
resolver **SHOULD** surface as the scope's final, authoritative answer. The
read-only `is-scope-active` returns `false` for a sealed scope.

Sealing deliberately trades recoverability for finality. Emergency
`revoke-manifest` (§7) still acts at the manifest level on a sealed scope's
final head, but because succession is closed, **no successor can be appointed
afterwards**: a sealed scope whose final head is revoked has no active answer
and cannot recover. Authorities **SHOULD** seal only when they intend the
current head to be final, and **SHOULD NOT** seal a scope whose head they may
later need to replace.

### 5. Delegates

The scope authority **MAY** add/remove delegates. The split is:

- Delegates **MAY** *inscribe* manifests that qualify for the scope.
- Delegates **MUST NOT** be able to advance the scope pointer; succession
  functions require the authority.
- At succession, the candidate's core **creator** must be the authority or an
  *active* delegate. Removal is soft (audit trail preserved); manifests already
  current remain current; manifests created by a removed delegate **MUST** be
  rejected in future successions.
- `set-scope-authority` does not clear delegates; the new authority inherits
  the delegate set and **SHOULD** review it on transfer.

### 6. Succession

#### 6.1 Initial head (`register-initial-scope-manifest`)

Requires: active scope; sender is authority; no current head; candidate is
registered, ACTIVE, **not already current for any scope**
(`ERR-MANIFEST-IS-CURRENT` — a manifest heads at most one scope, so the
`current-scope` marker can never be clobbered), matches scope policy (§4.3);
candidate's core creator is the authority or an active delegate. The scope pointer, root, and count are set
**from the candidate's registered commitments**.

#### 6.2 Update (`update-scope-manifest`)

Takes only `(scope-key, previous-manifest-id, new-manifest-id)`. Requires all
of §6.1's checks on the candidate (including not-already-current), plus:

- `previous-manifest-id` is the scope's current head;
- the candidate **declared** `previous-manifest-id` as its predecessor at
  registration (commitments are immutable — see §6.3);
- the **core parent edge** new → previous exists (XIP-001 §6);
- `manifest-type` is unchanged from the outgoing head.

On success, atomically: the old head becomes `SUPERSEDED` with
`superseded-by` set and its `current-scope` cleared; the new head's
`current-scope` is set; the scope pointer, `current-root`, and `current-count`
advance to the values the new head **committed at registration**.

#### 6.3 Immutable commitments

After registration, a record's `scope-root`, `item-count`, `changed-count`,
hashes, and predecessor declaration **MUST NOT** be modifiable by any function,
including succession. A manifest whose commitments are wrong is replaced, not
edited.

#### 6.4 Core parent-ownership constraint (workflow requirement)

`xtrata-v3-2-3` requires the minter to **own** every declared parent at seal
time. Therefore the inscriber of a successor manifest **MUST** hold the
predecessor inscription when sealing. Delegated-succession workflows account
for this: the authority transfers the current head inscription to the delegate
(or the delegate held it already) before the delegate inscribes the successor.
Ownership of the inscription does not affect XMA-1 authority checks, which use
the immutable core **creator**.

### 7. Lifecycle operations

| Operation | Who | While current for a scope? |
|---|---|---|
| `withdraw-manifest` | registrar | **Rejected** (`ERR-MANIFEST-IS-CURRENT`). Replace via succession first. |
| `mark-superseded` | registrar / contract owner | **Rejected** while current; otherwise requires declared predecessor **and** core parent edge. |
| `revoke-manifest` | registrar / contract owner | **Allowed** (emergency path). The scope pointer is *not* cleared so the continuity chain survives and a successor can be appointed. |

The authority model is deliberately asymmetric: `revoke-manifest` and
`mark-superseded` accept either the registrar **or** the contract owner (revoke
is an emergency governance lever), whereas `withdraw-manifest` is the
registrar's housekeeping path and accepts the registrar **only** — the contract
owner cannot withdraw a manifest it did not register. Implementations **MUST
NOT** collapse this distinction.

Because a revoked manifest can remain the structural chain head, resolvers
**MUST** check the status of a scope's current manifest. The read-only
`get-current-active-manifest` returns the head only while ACTIVE and **SHOULD**
be preferred over `get-current-manifest` for display.

Scope-level finality is separate from these manifest-level operations: see
`close-scope` (§4.4), which permanently seals a whole scope.

### 8. Duplicate-hash advisory

The core is content-addressed but non-canonicalising: identical bytes can be
inscribed more than once with the same `final-hash`; `get-id-by-hash` is
advisory (first-seen). XMA-1 keys everything by inscription id. Resolvers
**MUST NOT** resolve a registered manifest by content hash alone; the
registered `manifest-hash` is an integrity commitment for the bytes of one
specific inscription id, not an identity key.

### 9. Target links

`add-manifest-target` records explicit member links for small manifests. The
contract **MUST** verify the target inscription exists in the core
(contract-set `core-exists`); `claimed-verified` / `claimed-verification`
remain registrar claims, range-checked.

### 10. What resolvers/indexers enforce (out of contract scope)

XIP-001 canonical JSON; manifest hash ↔ inscription hash; integrity/corpus
roots recompute; mapping expansion; corpus slot preservation; semver rules;
agreement between manifest JSON and registration metadata; fork detection per
XIP-001 §5 (fail closed on competing tips).

## Test vectors

### TV-1: derive-scope-key (REQUIRED by XIP-000 §9)

`derive-scope-key` is a new integrity-bearing construction:
`sha256( consensus-buff(principal) || label )`, where `consensus-buff` is the
Clarity consensus serialization (`to-consensus-buff?`): for a standard
principal, `0x05 || version(1 byte) || hash160(20 bytes)` = 22 bytes; `label`
is exactly 32 bytes (callers MUST pad/truncate off-chain).

Reproducible vector (regenerate with `tests/scope-key-vector.mjs`):

```
authority      : ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
label          : "xip-corpus" ASCII, zero-padded to 32 bytes
label (hex)    : 7869702d636f7270757300000000000000000000000000000000000000000000
consensus-buff : 051a6d78de7b0625dfbfc16c3a8a5735f6dc3dc3f2ce
preimage       : 051a6d78de7b0625dfbfc16c3a8a5735f6dc3dc3f2ce7869702d636f7270757300000000000000000000000000000000000000000000
sha256 digest  : b011383f7ce08e676a133a837dfbda79d32958cb4ef79229ff1d2003fab7cdd2
```

The generator recomputes the digest off-chain (Node `crypto` +
`@stacks/transactions` `serializeCV`) and asserts byte equality with the
on-chain read-only. Per XIP-000 §9, where vector and prose disagree, the
vector is authoritative.

### Other integrity bytes

All other commitments are XIP-001's, whose vectors apply unchanged. The reference
behavioural suite (`tests/smoke.mjs`, 58 assertions) executes against the live
`xtrata-v3-2-3` source in Clarinet simnet and includes the review attack
scenarios: scope front-running, fabricated verification, missing parent edge,
snapshot-as-corpus, commitment swap at succession, and stranded-pointer
attempts. One core-derived vector worth restating: the core `final-hash` is
the **chained** digest `H_i = sha256(H_{i-1} || chunk_i)` with
`H_0 = 32 zero bytes` — not `sha256(content)`.

## Security considerations

- **Residual label squatting (accepted, mitigated):** raw scope keys are
  first-come. Self-claim-only removes impersonation; derived keys (§4.2)
  remove squatting for authorities that use them. Ecosystem-reserved labels
  should bootstrap with derived keys.
- **Revoked current head:** revocation deliberately does not clear the pointer
  (§7); consumers using `get-current-manifest` without a status check will
  display a revoked manifest. Use `get-current-active-manifest`.
- **Delegate inheritance on authority transfer** (§5): a transferred scope
  inherits delegates; new authorities must audit them.
- **Registrar claims:** `claimed-verification` and target claims are
  attestation, not verification; UIs **MUST** label them as such (§2).
- **Creator-only registration trade-off:** a creator who loses key access can
  never register their inscriptions; re-inscription under a new key (with
  parent edges where possible) is the recovery path.
- **One-scope-per-manifest:** mirroring one manifest across scopes requires
  distinct inscriptions (duplicate content mints fine in the core); this is
  deliberate so the `current-scope` marker is single-valued and `u119`
  protections are sound.
- **Contract-call trust:** XMA-1's guarantees are only as good as the bound
  core contract; the `.xtrata-v3-2-3` reference **MUST** resolve to the
  audited deployed core (fully qualify if deployers differ).
- **Scope sealing is irreversible (finality vs recovery):** `close-scope`
  (§4.4) cannot be undone, is restricted to the immutable `key-authority`, and
  closes succession permanently. Emergency revoke still works at the manifest
  level, but a sealed scope whose head is later revoked cannot appoint a
  successor. Authorities **SHOULD** seal only when the current head is intended
  to be final.

## Conformance

A conforming registry implements §§3–7 and 9 exactly. A conforming resolver
honours §§2, 7, 8, and 10. A conforming authority workflow observes §6.4.

## Relationship to other XIPs

Requires XIP-000 (process) and XIP-001 (envelope, canonicalisation, parent-edge
supersession). Complements XIP-002 (identity facts), XIP-005 (namespace scopes
are natural XMA-1 scopes), XIP-006 (resolver conformance should reference §10).
Registration does not alter manifest bytes, hashes, creators, parents, or
integrity roots.

## Summary

XMA-1 turns "which manifest is official for this scope?" into a single on-chain
read, enforcing on-chain everything the core makes checkable — sealed status,
MIME, hash, creator, parent edges, policy, immutable commitments, pointer
atomicity — and explicitly labelling everything else as a claim.
