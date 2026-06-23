# XIP-010: Dynamic State Resolver Profile

- XIP: 010
- Title: Dynamic State Resolver Profile
- Status: Draft
- Category: Standards Track
- Requires: XIP-000, XIP-001, XIP-003, XIP-006
- Optional: XIP-009
- Spec version: 0.3.0

## 1. Abstract

This XIP defines an optional soft field, `state`, that may appear in any XIP-001 manifest envelope.

The `state` field carries one or more **State Resolver Descriptors**. A descriptor binds a manifest to one or more smart contracts that hold frequently mutating, contract-authoritative attributes for the manifest’s members. Examples include an RPG character’s `level`, `xp`, `hp`, `status`, equipped items, staking receipt state, badge progress, membership status, or any other token-linked value that changes more frequently than curatorial metadata.

Indexers conforming to XIP-006 and XIP-010 MAY follow the descriptor, verify bidirectional endorsement from the referenced contract, call a trait-conformant read-only function, validate the returned attributes against the manifest-declared schema, and surface those attributes alongside the manifest’s curatorial fields.

The manifest hash, signing message, and integrity envelope cover the **descriptor**: which contract, which interface, which schema, which token binding, and which display rules. They do not cover the live values returned by the contract.

Live state values are contract-set facts. They are attested by the referenced contract, not by the manifest. This preserves XIP-001’s sealed-inscription integrity model while giving wallets, marketplaces, and indexers a standardised retrieval surface for dynamic on-chain attributes.

The core model is:

> The descriptor is sealed. The values are live.

## 2. Motivation

XIP-001’s supersession model is well-suited to curatorial mutation: a new cover image, a corrected description, a restructured member set, a re-anchored namespace binding, or a revised collection manifest. Each supersession produces a permanent, verifiable historical artifact, and the cost is acceptable at the mutation frequencies curatorial change implies.

A large class of NFTs and tokenised objects, however, carry stateful attributes that mutate at transaction or block frequency, or at a frequency materially higher than curatorial metadata changes. Examples include:

* an RPG character’s `level`, `xp`, `hp`, `status`, or equipment
* a staking receipt’s current state
* a game item’s durability
* a badge’s progress
* a membership token’s active/inactive status
* an evolving on-chain artwork’s current phase

For this class of data:

* superseding the manifest on every mutation is economically infeasible
* supersession latency exceeds the intended mutation rate
* the resulting permanent history would often be noise rather than useful provenance
* the contract is already the source of truth
* replicating live values into sealed manifests creates a synchronisation problem with no integrity benefit

The wider Stacks NFT ecosystem has identified a related gap in SIP-009, SIP-016, and SIP-019:

* SIP-009 defines NFT ownership and `get-token-uri`
* SIP-016 defines a JSON metadata shape
* SIP-019 can notify indexers that metadata has changed
* none of these standards define a universal way to discover, retrieve, verify, and display dynamic on-chain attributes from a contract

This XIP addresses that gap as a non-breaking profile of the XIP-001 manifest envelope.

It does not replace SIP-009 or live game/state contracts. Instead, it defines how a manifest can describe the contract-read rules that resolvers should follow.

The intended split is:

| Layer                          | Authority                                          |
| ------------------------------ | -------------------------------------------------- |
| NFT ownership                  | SIP-009 contract or Xtrata core contract           |
| Live mutable values            | State contract implementing `xtrata-live-state-v1` |
| Attribute schema               | Xtrata manifest                                    |
| Manifest integrity             | XIP-001 hash/signature/integrity rules             |
| Current manifest               | XIP-009 scope registry, where used                 |
| Resolution behaviour           | XIP-006 + XIP-010                                  |
| Marketplace-compatible display | SIP-016-compatible output                          |

This XIP follows the same design principle as XIP-001’s pointer patterns:

> The manifest carries the context and resolution rules. The contract carries the facts.

## 3. Specification

The key words “MUST”, “MUST NOT”, “REQUIRED”, “SHALL”, “SHALL NOT”, “SHOULD”, “SHOULD NOT”, “RECOMMENDED”, “MAY”, and “OPTIONAL” in this document are to be interpreted as described in RFC 2119.

### 3.1. Relationship to existing XIPs

This XIP is a profile of XIP-001 in the sense defined by XIP-000.

It:

* MUST NOT redefine the XIP-001 envelope, JCS canonicalisation, manifest hash, signing message, Merkle construction, or precedence ladder
* MUST NOT alter XIP-003’s curatorial soft-field semantics
* MUST NOT redefine `traits`. The `state` field is a new soft field, not a replacement for manifest-declared traits
* MUST NOT alter XIP-006’s base resolver algorithm
* MUST NOT alter XIP-009’s registry semantics. Scope registration, succession, and sealing proceed exactly as without `state`
* MUST remain backwards-compatible with resolvers that do not implement XIP-010

An indexer that does not implement XIP-010 MUST treat `state` as an unrecognised soft field and continue resolving the manifest normally.

### 3.2. The `state` soft field

A manifest envelope MAY include a top-level field named `state`.

The value of `state` MUST be either:

1. a single State Resolver Descriptor object, or
2. a non-empty array of State Resolver Descriptor objects.

Example:

```json
{
  "xtrata": {
    "version": "1.0",
    "kind": "collection",
    "name": "Example RPG"
  },
  "state": {
    "descriptor-version": "1.0",
    "interface": "xtrata-live-state-v1",
    "state-contract": "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.example-rpg-state",
    "state-function": "get-token-state",
    "param-types": ["uint"],
    "token-id-source": "manifest-member-id",
    "binding": "contract-endorses-scope",
    "declared-attributes": [
      {
        "key": "level",
        "type": "uint",
        "display-name": "Level",
        "display-type": "number",
        "order": 10
      }
    ]
  }
}
```

For all integrity, signing, and canonicalisation purposes, the `state` field is part of the envelope and is covered by `manifestHash` exactly as any other field. XIP-001 canonicalisation rules apply in full.

### 3.3. State Resolver Descriptor

A State Resolver Descriptor is a JSON object with the following fields.

| Field                  | Type                   | Required | Meaning                                                                                                                               |
| ---------------------- | ---------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `descriptor-version`   | string                 | REQUIRED | Version of this descriptor schema. For this XIP version, MUST be `"1.0"`.                                                             |
| `interface`            | string                 | REQUIRED | Trait identifier. For descriptor-version `"1.0"`, MUST be `"xtrata-live-state-v1"`.                                                   |
| `state-contract`       | string                 | REQUIRED | Fully qualified Stacks contract principal holding or adapting the live state.                                                         |
| `state-function`       | string                 | REQUIRED | Name of the read-only function to call. For `xtrata-live-state-v1`, MUST be `"get-token-state"`.                                      |
| `param-types`          | array of strings       | REQUIRED | Parameter type tags. For descriptor-version `"1.0"`, MUST be exactly `["uint"]`.                                                      |
| `token-id-source`      | string                 | REQUIRED | Defines which token/member identifier is passed to `get-token-state`. For descriptor-version `"1.0"`, MUST be `"manifest-member-id"`. |
| `binding`              | string                 | REQUIRED | Endorsement model. For descriptor-version `"1.0"`, MUST be `"contract-endorses-scope"`.                                               |
| `declared-attributes`  | array of AttributeDecl | REQUIRED | Schema declaration of attributes the contract may return and indexers may surface.                                                    |
| `description`          | string                 | OPTIONAL | Human-readable description of what this state resolver covers.                                                                        |
| `refresh-hint-blocks`  | integer ≥ 1            | OPTIONAL | Suggested minimum block interval between refreshes. Indexers MAY ignore.                                                              |
| `refresh-hint-seconds` | integer ≥ 0            | OPTIONAL | Suggested minimum wall-clock interval between refreshes. Indexers MAY ignore.                                                         |

The following fields are intentionally constrained in descriptor-version `"1.0"`:

```json
{
  "interface": "xtrata-live-state-v1",
  "state-function": "get-token-state",
  "param-types": ["uint"],
  "token-id-source": "manifest-member-id",
  "binding": "contract-endorses-scope"
}
```

Future descriptor versions MAY define additional interfaces, parameter types, token binding modes, or binding models.

Indexers implementing descriptor-version `"1.0"` MUST reject descriptor objects that use unknown or unsupported values for these fields.

### 3.4. Attribute Declaration

An AttributeDecl is a JSON object with the following fields.

| Field          | Type        | Required                                                | Meaning                                                                                                                                                                                |
| -------------- | ----------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key`          | string      | REQUIRED                                                | Machine-readable attribute key. MUST be 1-64 characters. SHOULD use lowercase ASCII identifiers matching `^[a-z0-9][a-z0-9._-]{0,63}$`. MUST match the `key` returned by the contract. |
| `type`         | string      | REQUIRED                                                | One of `"uint"`, `"int"`, `"bool"`, `"string-ascii"`, `"string-utf8"`, or `"buff"`.                                                                                                    |
| `max-len`      | integer ≥ 1 | REQUIRED for string and buff types; forbidden otherwise | Maximum encoded length.                                                                                                                                                                |
| `display-name` | string      | OPTIONAL                                                | Human-readable display label.                                                                                                                                                          |
| `display-type` | string      | OPTIONAL                                                | Marketplace/UI display hint. Suggested values: `"number"`, `"boost_number"`, `"boost_percentage"`, `"date"`, `"string"`, `"raw"`.                                                      |
| `unit`         | string      | OPTIONAL                                                | Display unit, for example `"XP"`, `"points"`, `"%"`, `"blocks"`.                                                                                                                       |
| `order`        | integer     | OPTIONAL                                                | Suggested display order. Lower values SHOULD be displayed first.                                                                                                                       |
| `description`  | string      | OPTIONAL                                                | Human-readable description.                                                                                                                                                            |
| `mutable-by`   | string      | OPTIONAL                                                | Informational mutation model. One of `"contract-owner"`, `"token-owner"`, `"approved"`, `"any"`, or `"contract-defined"`. The contract remains authoritative.                          |

Indexers MUST NOT surface returned attributes that are not declared in `declared-attributes`.

Indexers MUST NOT silently coerce returned values into the declared type.

Duplicate declared keys make the descriptor malformed. An indexer MUST suppress a descriptor that contains duplicate `declared-attributes.key` values.

### 3.5. Token ID binding

For descriptor-version `"1.0"`, `token-id-source` MUST be `"manifest-member-id"`.

This means the `uint` passed to `get-token-state` is the member or token identifier being resolved by the manifest.

This XIP deliberately does not define collection-local ID translation, migrated ID translation, Forever Twin ID mapping, or cross-contract ID conversion. Those may be defined by future XIPs.

If a collection requires ID translation in v1, it SHOULD use an adapter contract that implements `xtrata-live-state-v1` and performs the translation internally.

### 3.6. Bidirectional binding

To prevent a manifest from fraudulently claiming that a contract holds state for a collection or scope when the contract has not consented, the binding is bidirectional.

The manifest points to a `state-contract`.

The `state-contract` MUST expose a read-only function named `get-endorsed-manifest-scope`, as defined in the `xtrata-live-state-v1` trait.

An indexer following the state descriptor MUST call `get-endorsed-manifest-scope` and verify that:

1. `manifest-hash` equals the canonical XIP-001 manifest hash.
2. `scope-hash` equals the expected scope hash for the resolved manifest.
3. The contract response conforms to the `xtrata-live-state-v1` trait.

If any of these checks fail, the indexer MUST fail closed for that descriptor. The manifest itself remains valid; only the live-state augmentation is suppressed.

#### 3.6.1. Scope hash derivation with XIP-009

Where a XIP-009 scope is available, the expected `scope-hash` MUST be the SHA-256 hash of the manifest’s XIP-009 scope key.

#### 3.6.2. Scope hash derivation without XIP-009

Where XIP-009 is not used, the expected fallback scope key MUST be:

```text
xip-010:manifest:<manifest-hash-hex>
```

Where `<manifest-hash-hex>` is the lowercase hex representation of the canonical XIP-001 manifest hash, with no `0x` prefix.

The expected fallback `scope-hash` MUST be SHA-256 over the UTF-8 bytes of that fallback scope key.

This fallback mode binds the state contract to a specific manifest, not to a long-lived registry scope. Collections requiring current-manifest discovery or scope-level succession SHOULD use XIP-009.

A contract MAY implement `get-endorsed-manifest-scope` such that it returns `(err u1)` by default. In that case, the contract has not endorsed the manifest, and the descriptor MUST be suppressed.

Updating the endorsement does not require superseding the manifest. The endorsement lives on the contract side and follows whatever governance the contract defines.

### 3.7. The `xtrata-live-state-v1` trait

Contracts referenced by a State Resolver Descriptor MUST implement the following Clarity trait.

The trait MUST be published as a separate versioned artifact before this XIP advances beyond Draft, for example:

```text
traits/xtrata-live-state-v1.clar
```

Reference or example implementations MUST be separate from the trait definition, for example:

```text
examples/example-rpg-state.clar
examples/example-adapter-state.clar
```

Trait definition:

```clarity
(define-trait xtrata-live-state-v1
  (
    ;; Returns live state for the given token id.
    ;;
    ;; `attributes` is a bounded list of key/value pairs.
    ;; `as-of-block` is the block height at which the values should be interpreted.
    ;; `state-version` is a contract-defined monotonically increasing state version where available.
    ;; Contracts that do not track a state version MUST return u0.
    ;;
    ;; Any err response MUST be treated by indexers as fail-closed for that token/descriptor.
    (get-token-state
      (uint)
      (response
        {
          attributes: (list 32 {
            key: (string-utf8 64),
            value: (string-utf8 256)
          }),
          as-of-block: uint,
          state-version: uint
        }
        uint))

    ;; Returns the manifest scope this contract endorses.
    ;;
    ;; err u1 SHOULD mean no endorsement set.
    (get-endorsed-manifest-scope
      ()
      (response
        {
          scope-hash: (buff 32),
          manifest-hash: (buff 32)
        }
        uint))
  )
)
```

Rationale for `(list 32 ...)`:

* a bounded list is required by Clarity
* thirty-two display-relevant live attributes is sufficient for descriptor-version `"1.0"`
* contracts requiring more live attributes SHOULD prioritise display-relevant attributes, group lower-priority values, or wait for a future paginated interface

Rationale for `value: (string-utf8 256)`:

* a fixed string value avoids trait divergence across contracts
* each contract can return a different attribute set without changing the trait shape
* type information is recovered from the sealed manifest’s `declared-attributes`
* numeric, boolean, and buffer values have unambiguous string encodings
* UTF-8 permits human-readable state values where necessary
* longer values are out of scope for v1 and SHOULD be represented by a manifest-declared pointer or a future paginated/typed interface

Implementation note:

Contracts implementing this trait MUST return UTF-8 strings for both `key` and `value`. Clarity reference implementations SHOULD use UTF-8 string literals, for example `u"level"` and `u"42"`, where required by the trait type.

Before this XIP moves from Draft to Review, the trait and all reference implementations MUST compile under the project’s supported Clarinet/Clarity toolchain.

### 3.8. Adapter contracts

A State Resolver Descriptor MAY reference an adapter contract rather than the original NFT, game, or state contract.

This allows existing SIP-009 collections with bespoke read-only functions to expose XIP-010-compatible live state without redeploying the original collection contract.

The adapter contract becomes the `state-contract` for XIP-010 purposes and MUST implement `xtrata-live-state-v1`, including `get-endorsed-manifest-scope`.

The adapter MAY call into one or more underlying contracts to construct the returned attribute list. Indexers treat the adapter contract as the state authority for the returned values.

Adapter contracts are the RECOMMENDED migration path for existing contracts that cannot be upgraded to implement `xtrata-live-state-v1` directly.

Xtrata-aware UIs SHOULD indicate where known that TS values are supplied through an adapter contract rather than directly from the original NFT or game contract.

### 3.9. Value encoding contract

When the contract returns `attributes`, each entry’s `value` field MUST be encoded according to the matching `AttributeDecl.type`.

| `AttributeDecl.type` | Encoding                                                           |
| -------------------- | ------------------------------------------------------------------ |
| `uint`               | Decimal ASCII, no leading zeros, no sign. Example: `"4294967295"`. |
| `int`                | Decimal ASCII with optional leading `-`. Example: `"-42"`.         |
| `bool`               | `"true"` or `"false"` lowercase.                                   |
| `string-ascii`       | Literal ASCII string.                                              |
| `string-utf8`        | Literal UTF-8 string, NFC-normalised.                              |
| `buff`               | Lowercase hex, even-length, no `0x` prefix.                        |

An indexer receiving a value that does not conform to the declared type for that key MUST fail closed for that key only, not for the whole descriptor.

Indexers MUST NOT silently coerce invalid values.

Examples:

```json
{ "key": "level", "type": "uint", "returned": "42", "valid": true }
{ "key": "level", "type": "uint", "returned": "forty-two", "valid": false }
{ "key": "active", "type": "bool", "returned": "true", "valid": true }
{ "key": "active", "type": "bool", "returned": "True", "valid": false }
```

### 3.10. Duplicate returned keys

If a contract response contains the same `key` more than once for a single token/descriptor response, the indexer MUST suppress that key only and emit a structured warning.

The descriptor remains valid.

The manifest remains valid.

Other non-duplicated keys MAY be surfaced normally if they pass validation.

Indexers MUST NOT use first-wins or last-wins behaviour for duplicate returned keys.

### 3.11. Member-level override

Per XIP-003’s member-level override model, a member manifest MAY carry its own `state` field that overrides the collection-level `state` field for that member.

The override is total.

A member-level `state` field entirely replaces the collection-level `state` field. Partial-merge semantics are forbidden.

Example:

* collection manifest declares `level`, `xp`, and `hp`
* member manifest declares only `level`
* for that member, the resolver surfaces only `level`
* it MUST NOT combine `level` from the member descriptor with `xp` and `hp` from the collection descriptor

This rule avoids ambiguity about which descriptor governs which attributes.

### 3.12. Indexer conformance

An indexer claiming XIP-010 conformance MUST:

1. Resolve the manifest via XIP-006 normally, obtaining the canonical manifest and manifest trust tier.
2. If the manifest carries no `state` field, proceed exactly as a non-XIP-010 resolver.
3. If the manifest carries a `state` field, parse the descriptor or descriptors.
4. Suppress malformed descriptors without invalidating the manifest.
5. Reject unknown `descriptor-version` values.
6. Reject unknown `interface` values.
7. Reject malformed or unsupported `state-contract` principals.
8. Verify bidirectional binding per §3.6.
9. For each token/member being resolved, call `get-token-state(token-id)` for each valid descriptor.
10. Validate each returned attribute against `declared-attributes`.
11. Discard unknown keys.
12. Suppress duplicate returned keys.
13. Suppress type-mismatched keys.
14. Surface valid returned attributes under the display tier `TS`, meaning “state-attested”.
15. Surface `as-of-block` and `state-version` alongside TS values in Xtrata-aware output.
16. Rate-limit refreshes.
17. Fail closed on contract error, timeout, malformed response, or non-conforming response.

An indexer MUST NOT call `get-token-state` more than once per block per token per descriptor.

`refresh-hint-blocks` and `refresh-hint-seconds` are advisory. They are not binding. Indexers MAY ignore them.

Indexers SHOULD enforce a wall-clock timeout on read-only calls. A RECOMMENDED default is 5 seconds.

Indexers that do not claim XIP-010 conformance MUST treat `state` as an unrecognised soft field and MUST NOT attempt to interpret it.

### 3.13. TS display tier

XIP-010 defines a display tier named `TS`, meaning **state-attested**.

`TS` is not a replacement for XIP-006 trust tiers.

The manifest’s XIP-006 trust tier describes the trust status of the manifest and descriptor. `TS` describes the source of the live values.

A high-trust manifest does not make the live values high-trust by inheritance. The live values are always contract-attested.

User interfaces SHOULD visually distinguish:

* manifest-declared curatorial metadata
* contract-attested live state
* unresolved or suppressed state
* adapter-supplied contract state, where known

Suggested display labels:

```text
Manifest metadata: verified
Live state: contract-attested
Live state source: adapter contract
Live state as of block: 85001
```

### 3.14. SIP-016-compatible output mapping

A XIP-010 resolver MAY emit SIP-016-compatible JSON for existing wallets, marketplaces, and indexers.

When doing so, valid TS attributes MAY be included in the standard SIP-016 `attributes` array using their `display-name` where present, or their `key` otherwise.

Example:

```json
{
  "name": "Example RPG #42",
  "description": "A dynamic RPG character.",
  "image": "https://xtrata.xyz/i/123",
  "attributes": [
    {
      "trait_type": "Level",
      "value": 42
    },
    {
      "trait_type": "XP",
      "value": 1337
    },
    {
      "trait_type": "Status",
      "value": "burning"
    }
  ]
}
```

A Xtrata-aware resolver SHOULD also expose a provenance extension object carrying source, tier, block, state-version, and adapter information where known.

Example:

```json
{
  "name": "Example RPG #42",
  "description": "A dynamic RPG character.",
  "image": "https://xtrata.xyz/i/123",
  "attributes": [
    {
      "trait_type": "Level",
      "value": 42
    },
    {
      "trait_type": "XP",
      "value": 1337
    },
    {
      "trait_type": "Status",
      "value": "burning"
    }
  ],
  "xtrata": {
    "state": {
      "tier": "TS",
      "interface": "xtrata-live-state-v1",
      "state-contract": "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.example-rpg-state",
      "state-function": "get-token-state",
      "as-of-block": 85001,
      "state-version": 14,
      "source": "contract-attested"
    }
  }
}
```

If the state source is an adapter contract, a Xtrata-aware resolver SHOULD indicate this where known:

```json
{
  "xtrata": {
    "state": {
      "tier": "TS",
      "source": "adapter-contract",
      "state-contract": "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.example-rpg-adapter"
    }
  }
}
```

Resolvers MUST NOT represent suppressed or unresolved state attributes as if they were valid returned values.

### 3.15. Supersession and descriptor evolution

When a contract changes its public attribute schema, the manifest SHOULD be superseded with a new manifest whose `state` descriptor reflects the new schema.

Examples of schema changes include:

* adding a new displayable attribute
* removing an attribute
* changing an attribute type
* changing display names or display order
* changing the state contract
* changing the adapter contract
* changing the token binding model

The contract’s `get-endorsed-manifest-scope` SHOULD then be updated to endorse the new manifest hash.

This is intentional. Schema changes are curatorial or interpretive changes, not live state changes. The supersession history of descriptor evolution is itself useful provenance.

### 3.16. What `state` MUST NOT be used for

To prevent scope creep that would undermine XIP-001’s integrity model, the following uses of `state` are forbidden by this XIP:

* **Pricing or listing terms.** Use the relevant marketplace trait or marketplace contract. Pricing MUST NOT be surfaced via `state`.
* **Ownership.** Ownership is a SIP-009 or Xtrata-core fact.
* **Transferability.** Transfer logic belongs to the NFT/core contract.
* **Collection identity.** Collection identity belongs to the manifest and resolver trust model.
* **Provenance.** Provenance belongs to manifest history, inscriptions, graph edges, and registry scopes.
* **Manifest-declared fields.** If the manifest declares a `cover`, a state attribute named `cover` is contradictory and MUST be suppressed.
* **Authority laundering.** State values MUST NOT be presented as manifest-authored curatorial facts.

## 4. Rationale

### 4.1. Why a dynamic state resolver profile

The problem is not only that dynamic state exists. The problem is that wallets, marketplaces, and indexers do not have a universal way to discover how that state should be read and displayed.

A resolver profile lets Xtrata define:

* where live state is read from
* which interface the contract must implement
* which attributes are valid
* how values are typed
* how values are displayed
* how contract endorsement is verified
* how resolved output remains SIP-016-compatible

This makes Xtrata useful to existing dynamic NFT contracts without forcing all live state into sealed inscriptions.

### 4.2. Why bidirectional binding

A unidirectional pointer from manifest to contract would allow any manifest to claim association with any contract.

That would create a fraud surface similar to arbitrary image URLs in traditional metadata.

The bidirectional check ensures that the state contract has actively endorsed the manifest before its values are surfaced under that manifest’s identity.

### 4.3. Why a trait

A trait gives contract authors a canonical interface to implement and gives indexers a fixed function and response shape to validate.

Indexers SHOULD verify conformance by calling the required read-only functions and validating the returned Clarity types.

The trait avoids per-contract adapter logic at the indexer layer.

### 4.4. Why adapter contracts

Many existing contracts cannot be upgraded.

Adapter contracts allow those collections to become XIP-010-compatible without redeploying their original NFT contracts.

The adapter absorbs collection-specific logic. The indexer still sees one standard trait.

This keeps the resolver layer simple while still supporting real-world adoption.

### 4.5. Why stringified values

A fully typed tuple would require the trait to declare all possible attribute names and value types up front. That is not practical for a general NFT standard.

A list of key/value strings is the smallest universal interface. The manifest restores type information through `declared-attributes`.

This trades some redundancy for uniformity and simple indexer behaviour.

### 4.6. Why unknown keys are discarded

Contracts may return additional keys before a manifest is superseded to declare them.

Discarding unknown keys allows forward-compatible contract evolution while preventing unregistered attributes from being surfaced.

Rejecting the whole descriptor would create a strict deployment ordering requirement that is hard to satisfy.

### 4.7. Why duplicate returned keys are suppressed per key

Duplicate returned keys create ambiguity.

First-wins and last-wins behaviour would make indexers disagree if they process responses differently.

Suppressing only the duplicated key preserves valid non-duplicated state while preventing ambiguous values from reaching display.

### 4.8. Why `TS` does not inherit manifest trust tier

The manifest tier reflects who authored and authorised the descriptor.

The contract attests the values.

These are different authorities.

Conflating them would allow a high-trust manifest to launder low-quality or malicious contract state into a high-trust display tier. `TS` makes the distinction explicit.

### 4.9. Why `as-of-block`

Some live state is stored and updated by transactions. Other live state is computed from current chain context, such as a staking receipt whose value changes as block height advances.

`as-of-block` is therefore more general than `last-updated-block`.

It identifies the block height at which the returned values should be interpreted.

## 5. Security Considerations

### 5.1. Manifest descriptor integrity

Because `state` is part of the manifest envelope, any tampering with the descriptor changes the manifest hash.

Changing any of the following invalidates the original hash:

* `state-contract`
* `state-function`
* `interface`
* `binding`
* `declared-attributes`
* `token-id-source`
* display metadata
* refresh hints

An attacker cannot alter the descriptor without producing a different manifest.

### 5.2. Bidirectional binding abuse

A malicious contract may endorse a malicious manifest.

This is not a circumvention of XIP-010. It is the contract consenting to the binding.

The threat XIP-010 cannot solve is a malicious contract lying about its own state values. The contract is the source of truth for contract-set facts. If the contract lies, no manifest-layer standard can rescue the values it controls.

### 5.3. Expensive read-only calls

A malicious or poorly written state contract could make `get-token-state` expensive.

Indexers MUST rate-limit calls and SHOULD enforce timeouts.

Indexers SHOULD pre-flight descriptors by verifying endorsement and response shape before issuing high-volume per-token reads.

### 5.4. Stale-state display

Displayed state may become stale if an indexer does not refresh.

Indexers MUST include `as-of-block` with Xtrata-aware TS output.

Indexers SHOULD avoid displaying live state values where `as-of-block` is unavailable, invalid, or obviously inconsistent with the current chain state.

### 5.5. Schema drift during supersession

During the window between a contract schema change and a manifest supersession:

* new unknown keys are discarded
* missing declared keys are absent
* invalid typed values are suppressed per key
* duplicate returned keys are suppressed per key
* the descriptor itself remains valid unless endorsement or required fields fail

Indexers MUST NOT treat normal schema drift as a full manifest failure.

### 5.6. Cross-contract replay

A descriptor cannot be replayed across scopes without contract cooperation, because the bidirectional binding includes the endorsed scope hash and manifest hash.

A contract that endorses manifest `M1` for scope `S1` cannot be silently used by manifest `M2` for scope `S2` unless it returns matching endorsement values.

### 5.7. Privacy

Live state is public on-chain. This XIP introduces no new on-chain disclosure.

However, indexers aggregating live state across many tokens may reveal patterns that are not obvious from individual contract reads. This is inherent to public blockchain indexing and outside Xtrata’s threat model.

### 5.8. Attribute spoofing

A malicious contract may return values that imitate trusted metadata, such as a `verified` or `official` attribute.

Indexers and UIs MUST distinguish TS attributes from manifest trust status and MUST NOT allow TS values to override resolver trust tiers, collection identity, provenance, ownership, or marketplace terms.

### 5.9. Adapter contract trust

Adapter contracts are useful for legacy compatibility, but they introduce an additional contract layer.

A malicious or incorrect adapter may misread, transform, omit, or fabricate values from an underlying contract.

For XIP-010 purposes, the adapter is the state authority because it is the contract that implements `xtrata-live-state-v1` and endorses the manifest. UIs SHOULD show adapter use where known.

## 6. Test Vectors

Per XIP-000, this XIP requires reproducible test vectors before moving from Draft to Review.

The vectors below are normative in structure. The manifest hash in Vector 1 is generated over the exact JCS output shown below, but SHOULD still be independently verified by the formal vector suite before Review.

### 6.1. Vector 1: Valid descriptor, single state resolver

Input manifest, pre-JCS:

```json
{
  "xtrata": {
    "version": "1.0",
    "kind": "collection",
    "name": "Example RPG"
  },
  "state": {
    "descriptor-version": "1.0",
    "interface": "xtrata-live-state-v1",
    "state-contract": "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.example-rpg-state",
    "state-function": "get-token-state",
    "param-types": ["uint"],
    "token-id-source": "manifest-member-id",
    "binding": "contract-endorses-scope",
    "declared-attributes": [
      {
        "key": "level",
        "type": "uint",
        "display-name": "Level",
        "display-type": "number",
        "order": 10
      },
      {
        "key": "xp",
        "type": "uint",
        "display-name": "XP",
        "display-type": "number",
        "unit": "points",
        "order": 20
      },
      {
        "key": "hp",
        "type": "uint",
        "display-name": "HP",
        "display-type": "number",
        "order": 30
      },
      {
        "key": "status",
        "type": "string-ascii",
        "max-len": 32,
        "display-name": "Status",
        "display-type": "string",
        "order": 40
      }
    ],
    "refresh-hint-blocks": 1
  }
}
```

Expected JCS output:

```json
{"state":{"binding":"contract-endorses-scope","declared-attributes":[{"display-name":"Level","display-type":"number","key":"level","order":10,"type":"uint"},{"display-name":"XP","display-type":"number","key":"xp","order":20,"type":"uint","unit":"points"},{"display-name":"HP","display-type":"number","key":"hp","order":30,"type":"uint"},{"display-name":"Status","display-type":"string","key":"status","max-len":32,"order":40,"type":"string-ascii"}],"descriptor-version":"1.0","interface":"xtrata-live-state-v1","param-types":["uint"],"refresh-hint-blocks":1,"state-contract":"ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.example-rpg-state","state-function":"get-token-state","token-id-source":"manifest-member-id"},"xtrata":{"kind":"collection","name":"Example RPG","version":"1.0"}}
```

Note: JCS sorts object keys but does not reorder array elements. The order of `declared-attributes` is preserved.

Expected manifest hash:

```text
ab7883f6456c130e05e3d11ce9fa0d97f35bd65d2626ff815ddb843f1ec7880a
```

### 6.2. Vector 2: Contract return value parsing

Given the descriptor from Vector 1 and the following contract response:

```clarity
(ok {
  attributes: (list
    { key: u"level", value: u"42" }
    { key: u"xp", value: u"1337" }
    { key: u"hp", value: u"99" }
    { key: u"status", value: u"burning" }
  ),
  as-of-block: u85001,
  state-version: u14
})
```

The indexer MUST surface:

```json
{
  "level": {
    "value": 42,
    "type": "uint",
    "as-of-block": 85001,
    "state-version": 14,
    "tier": "TS"
  },
  "xp": {
    "value": 1337,
    "type": "uint",
    "as-of-block": 85001,
    "state-version": 14,
    "tier": "TS"
  },
  "hp": {
    "value": 99,
    "type": "uint",
    "as-of-block": 85001,
    "state-version": 14,
    "tier": "TS"
  },
  "status": {
    "value": "burning",
    "type": "string-ascii",
    "as-of-block": 85001,
    "state-version": 14,
    "tier": "TS"
  }
}
```

### 6.3. Vector 3: Type-mismatch fail-closed

Given the descriptor from Vector 1 and a contract response where `level` is returned as `"forty-two"`, the indexer MUST:

* drop the `level` key
* surface the remaining valid keys normally
* emit a structured warning containing:

  * `state-contract`
  * token/member id
  * key
  * expected type
  * received value
* not retry that token/descriptor until the next block

The descriptor remains valid.

The manifest remains valid.

Only the invalid key is suppressed.

### 6.4. Vector 4: Bidirectional binding failure

Given a valid manifest with:

```json
"state-contract": "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.example-rpg-state"
```

but the contract’s `get-endorsed-manifest-scope` returns:

```clarity
(err u1)
```

the indexer MUST:

* resolve the manifest normally per XIP-006
* suppress all live-state augmentation for this descriptor
* emit a structured info log with reason `"no-endorsement"`
* surface the manifest’s curatorial fields as if no `state` field were present

### 6.5. Vector 5: Member-level override

Given:

* a collection manifest with state descriptor `D_collection`
* a member manifest with state descriptor `D_member`

the indexer MUST:

* use `D_member` exclusively for the overriding member
* ignore `D_collection` for that member
* use `D_collection` for members without an override

Partial merge is forbidden.

### 6.6. Vector 6: Duplicate returned key

Given a contract response containing two `level` entries:

```clarity
(ok {
  attributes: (list
    { key: u"level", value: u"42" }
    { key: u"level", value: u"43" }
    { key: u"xp", value: u"1337" }
  ),
  as-of-block: u85001,
  state-version: u14
})
```

the indexer MUST:

* suppress the `level` key
* surface `xp` normally if it passes validation
* emit a structured warning containing:

  * `state-contract`
  * token/member id
  * key
  * reason `"duplicate-returned-key"`

The indexer MUST NOT use first-wins or last-wins behaviour.

### 6.7. Future conformance vectors

Before this XIP advances beyond Draft, the following additional vectors SHOULD be added:

* malformed `state-contract`
* unknown `descriptor-version`
* unsupported `interface`
* wrong `state-function`
* wrong `param-types`
* invalid `token-id-source`
* missing required `max-len`
* invalid key format
* unknown returned key
* duplicate returned key
* duplicate declared key
* contract timeout
* oversized returned list
* adapter contract success
* adapter contract endorsement failure
* SIP-016-compatible output generation
* XIP-009 scope binding
* fallback manifest-hash scope binding

## 7. Backward Compatibility

Manifests without a `state` field are unaffected.

Resolvers that do not implement XIP-010 treat `state` as an unrecognised soft field.

XIP-001 canonicalisation, signing, hashing, Merkle roots, and precedence rules are unchanged.

XIP-003 curatorial fields are unchanged.

XIP-006 resolution remains valid whether or not XIP-010 is implemented.

XIP-009 registry semantics are unchanged.

Contracts that do not implement `xtrata-live-state-v1` cannot be referenced directly by a conformant descriptor. They MAY be supported through an adapter contract.

## 8. Registry Considerations

This XIP registers the following Xtrata parameters:

| Name                  | Value                     | XIP     |
| --------------------- | ------------------------- | ------- |
| Soft field name       | `state`                   | XIP-010 |
| Descriptor version    | `1.0`                     | XIP-010 |
| Trait identifier      | `xtrata-live-state-v1`    | XIP-010 |
| Binding model         | `contract-endorses-scope` | XIP-010 |
| Display tier          | `TS`                      | XIP-010 |
| Token ID source       | `manifest-member-id`      | XIP-010 |
| State function        | `get-token-state`         | XIP-010 |
| Fallback scope prefix | `xip-010:manifest:`       | XIP-010 |

## 9. Future Work

Future XIPs or descriptor versions may define:

* parameterised state queries, for example `get-token-state-since(token-id, block)`
* batch state queries, for example `get-batch-token-state(token-ids)`
* paginated state queries for more than 32 attributes
* typed return values rather than stringified values
* event-based refresh hints
* SIP-019-aligned metadata refresh rules
* cross-contract ID translation
* Forever Twin ID mapping
* migrated ID mapping
* external-token-id binding
* xtrata-inscription-id binding
* cross-chain state pointers
* off-chain signed state attestations
* richer marketplace display mapping
* stricter direct-vs-adapter provenance reporting

These are out of scope for descriptor-version `"1.0"`.

## 10. Required Artifacts Before Review

This XIP MUST NOT advance from Draft to Review until the following artifacts exist in the repository:

```text
xips/XIP-010-Dynamic-State-Resolver-Profile.md
traits/xtrata-live-state-v1.clar
examples/example-rpg-state.clar
examples/example-adapter-state.clar
vectors/xip-010/
tests/xip-010/
```

The trait and example contracts MUST compile under the project’s supported Clarinet/Clarity toolchain.

The vector suite MUST include byte-exact JCS canonicalisation outputs and SHA-256 hashes generated from those exact bytes.

The conformance tests SHOULD include malformed descriptors, endorsement failures, duplicate keys, invalid type encodings, adapter contract behaviour, and SIP-016-compatible output generation.

## 11. References

* XIP-000 - Xtrata Improvement Proposal process and template.
* XIP-001 - Manifest envelope, canonicalisation, manifest hash, signing message, Merkle integrity root, precedence ladder, supersession.
* XIP-003 - Manifest profiles and soft-field curatorial vocabulary.
* XIP-006 - Universal resolver and trust vocabulary; fail-closed semantics.
* XIP-009 - Manifest Authority Registry, where used for scope binding and current-manifest discovery.
* SIP-009 - Stacks NFT standard.
* SIP-016 - Stacks NFT metadata JSON shape.
* SIP-019 - Stacks metadata-update notification.
* RFC 2119 - Requirement keywords.
* RFC 8785 - JSON Canonicalization Scheme, as restricted by XIP-001.
* Megapont forum proposal - Proposal to extend NFT metadata standards in the Stacks ecosystem.

## 12. Change Log

| Document Version | Date       | Change                                                                                                                                                                                                                                                                             |
| ---------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.1.0            | 2026-06-18 | Initial draft as “Live State Pointer”.                                                                                                                                                                                                                                             |
| 0.2.0            | 2026-06-18 | Renamed to “Dynamic State Resolver Profile”; corrected binding spelling; added adapter contracts, token binding, SIP-016 output mapping, TS display tier, `as-of-block`, `state-version`, display metadata, bounded Clarity list, and corrected JCS array-order rule.              |
| 0.3.0            | 2026-06-18 | Added deterministic non-XIP-009 fallback scope binding, duplicate key rules, adapter UI guidance, required artifact list, compile-test requirement for trait/reference contracts, implementation note for UTF-8 Clarity strings, and generated provisional Vector 1 manifest hash. |

## 13. Open Questions

The following items should be reviewed before this XIP advances from Draft to Review.

### 13.1. Attribute list size

The v1 trait uses `(list 32 ...)`. The community should confirm whether 32 live attributes is the right v1 limit.

### 13.2. UTF-8 vs ASCII in the trait

This draft uses `(string-utf8 64)` for keys and `(string-utf8 256)` for values.

This is flexible, but reference implementations must be careful to use UTF-8 string literals and avoid ASCII/UTF-8 type mismatches.

The community should confirm whether v1 should instead use ASCII-only values for implementation simplicity.

### 13.3. `as-of-block` semantics

The draft defines `as-of-block` as the block height at which values should be interpreted. More precise guidance may be needed for contracts that compute values from current block height rather than storing state.

### 13.4. Runtime trait conformance

The wording should be reviewed by Clarity implementers to ensure indexer conformance expectations match what is realistically checkable from deployed contracts.

### 13.5. SIP-016 extension object

The proposed `xtrata.state` extension object should be reviewed for compatibility with marketplaces that reject unknown top-level fields.

### 13.6. Adapter trust display

Adapter contracts are useful, but the UI may need a standard way to show whether TS values came directly from the original state contract or through an adapter.

### 13.7. Event refresh

Descriptor-version `"1.0"` uses polling. A future version should consider SIP-019-compatible refresh signalling or Xtrata-specific state-change events.

---
