# Xtrata Manifest Authority v1 - Draft Specification

## 1. Purpose

`xtrata-manifest-authority-v1` is a helper contract for registering XIP-001 manifest inscriptions and attaching minimal, durable authority metadata to them.

It exists because Xtrata v3.2.3 deliberately stores hard inscription facts, while manifests store context. Once manifests become the main way that collections, packages, namespaces, galleries, standards and apps are understood, there needs to be a clean on-chain way to say:

> This inscription is a manifest.  
> This is the type of manifest it is.  
> This is the authority class of the claim.  
> This is the scope it belongs to.  
> This is the previous manifest it supersedes.  
> This is the current recognised manifest for that scope.  
> These are the compact commitments a resolver should verify.

The helper does **not** parse or validate the manifest JSON. XIP-001 already defines canonicalisation, manifest hashes, mapping, integrity roots, off-chain signatures and precedence rules.

## 2. Design principle

> Manifests are claims. Manifest Authority records who made the claim, what kind of claim it is, what scope it targets, what checks were performed, and whether it is current.

The helper should remain boring, small, cheap and inspectable.

## 3. Relationship to Xtrata v3.2.3

The v3.2.3 core remains the source of truth for:

- inscription existence
- creator
- owner
- content hash/final hash
- mime type
- sealed status
- parent links
- dependencies
- migration lineage
- fee recipient/protocol economics

The helper may call into v3.2.3 to check some facts, depending on the final public interface available in the deployed core.

The helper should never re-assert core facts as if it owns them.

## 4. Relationship to XIP-001

XIP-001 defines:

- envelope fields
- canonical JSON serialisation
- `manifestHash`
- mapping types
- `integrity.root`
- off-chain authority signatures
- precedence rules
- version/supersession conventions

The helper records compact metadata that points to an XIP-001 manifest inscription.

Recommended wording for XIP-001 compatibility:

> A XIP-001 manifest MAY be registered in a recognised Manifest Authority contract. Such registration does not alter the manifest bytes, manifest hash, Xtrata inscription hash, creator, parents or integrity root. It records additional on-chain metadata for discovery, authority class, target scope, lifecycle state, current pointers and verification status.

## 5. Manifest classes

The helper separates two concepts:

| Concept | Meaning |
|---|---|
| Manifest type | What the manifest is for: collection, gallery, playlist, standard corpus, package, namespace root, etc. |
| Authority class | Who/what gives the manifest weight: curator, creator, owner-snapshot, project authority, corpus authority, namespace authority, etc. |

This avoids overloading the XIP-001 field `type`.

## 6. Lifecycle modes

The helper distinguishes between three important modes:

### Snapshot

A point-in-time claim.

Example:

> At block X, wallet Y owned these inscriptions.

Useful for provenance, exhibitions, curation and historical records. It does not by itself control the future.

### Canonical

A recognised authority registers a manifest as canonical for a scope.

Example:

> This is the official Froggies collection manifest.

### Continuity-enforced

A stronger canonical mode where every new official manifest for the scope must succeed the previous current manifest.

Example:

> This is the official XIP corpus manifest. The next official XIP corpus manifest must reference this one and preserve the corpus continuity rules.

## 7. Scope-locked succession

A scope is the thing governed by a continuity manifest.

Examples:

- `xip-corpus`
- `froggies-collection`
- `cicada-collection`
- `xtrata-namespace-root`
- `bvst-standard-set`
- `xtrata-app-package`

For each scope, the helper may store a current manifest pointer.

A valid update must:

1. come from the scope authority
2. identify the previous current manifest
3. register a new sealed manifest inscription
4. prove successor relationship at the manifest-chain level
5. provide a new root/count commitment for resolver verification
6. update the current pointer atomically

The contract can enforce the pointer/sender/supersession shape. Resolvers verify the full manifest contents and continuity rules.

## 8. XIP corpus example

Initial official corpus:

```text
XIP Corpus Manifest v1
contains:
- XIP-000
- XIP-001
- XIP-002
- XIP-003
- XIP-004
- XIP-005
- XIP-006
- XIP-007
- XIP-008
```

Later XIP-001 is updated to `1.0.1`.

The official process should not be merely:

> publish XIP-001 v1.0.1

It should be:

1. inscribe XIP-001 v1.0.1 as a successor to XIP-001 v1.0.0
2. inscribe XIP Corpus Manifest v2 as a successor to XIP Corpus Manifest v1
3. register XIP Corpus Manifest v2 as the new current manifest for `xip-corpus`
4. publish a new corpus root that proves all active XIP slots remain accounted for

This gives the standards corpus continuity.

## 8a. Delegated inscription (AUTH-DELEGATED-AUTHORITY)

A scope authority may register **scope delegates**: principals whose inscriptions are acceptable as official manifests for that scope.

Rules:

- Only the scope authority can add or remove delegates (`add-scope-delegate` / `remove-scope-delegate`).
- Delegates may **inscribe** manifests, but may NOT advance the scope's current pointer. Only the scope authority calls `register-initial-scope-manifest` / `update-scope-manifest`.
- At succession time the contract checks that the manifest inscription's core creator (per `xtrata-v3-2-3 get-inscription-creator`) is either the scope authority or an active delegate of the scope.
- Removing a delegate deactivates them for future successions; manifests already made current remain current.

This separates "who may produce the bytes" from "who may recognise them", which is the correct trust split for multisig-controlled or service-operated inscribers.

## 8b. Duplicate-hash advisory

Xtrata v3.2.3 is content-addressed but **non-canonicalising**: identical bytes can be inscribed more than once, producing multiple inscription ids with the same `final-hash`. The core's `get-id-by-hash` is advisory and returns only the *first-seen* id.

Therefore:

- The Manifest Authority keys all registrations and scope pointers on **inscription id**, never on content hash.
- Resolvers and indexers MUST NOT resolve a registered manifest by content hash alone. A later duplicate inscription of the same bytes shares the hash but carries no registration, no authority class and no scope standing.
- The registered `manifest-hash` commitment is verified against the core's recorded `final-hash` for that specific id at registration time (`ERR-HASH-MISMATCH`). It is an integrity commitment for the bytes, not an identity key.

## 9. What the contract should enforce

The contract can enforce:

- sender is scope authority
- old manifest is current
- new manifest is not already registered
- new manifest exists/sealed, if v3.2.3 exposes this check
- new manifest was created by the scope authority or an active registered delegate (via v3.2.3 `get-inscription-creator`)
- supplied manifest-hash matches the core's recorded final-hash for the inscription id
- new manifest declares the previous current manifest as its predecessor in the registration arguments
- lifecycle state is active/current/superseded/withdrawn
- current pointer updates atomically
- compact roots/counts are committed to on-chain

## 10. What resolvers/indexers should enforce

Resolvers/indexers should enforce:

- XIP-001 canonical JSON
- manifest hash matches the inscription hash
- integrity roots and corpus roots recompute correctly
- explicit/sequential/predicate mappings expand correctly
- XIP corpus slots are preserved unless explicitly replaced/withdrawn
- semver and XIP-specific rules
- manifest JSON agrees with the registration metadata

## 11. Recommended contract name

Preferred:

```clarity
xtrata-manifest-authority-v1
```

Human-readable name:

```text
XMA-1: Xtrata Manifest Authority
```

Possible later XIP:

```text
XIP-009: Manifest Authority Registry
```
