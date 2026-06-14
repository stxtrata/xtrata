# Xtrata Forever Twin Index Helper Contract Plan

## 1. Purpose

The purpose of this helper contract is to create a permanent on-chain index between external NFT collection token IDs and the Xtrata inscription IDs created for their Forever Twins.

When an existing NFT collection is ported into Xtrata through a Forever Twin contract, each original token has its own local collection ID, for example:

```text
Bitcoin Pepe #44
```

When that token is converted into a Forever Twin, Xtrata creates or links it to an Xtrata inscription ID, for example:

```text
Xtrata inscription #512
```

This helper contract records the relationship between those two IDs on-chain:

```text
Bitcoin Pepe #44 ⇄ Xtrata inscription #512
```

The aim is to avoid relying on a frontend database or off-chain indexer to understand which original NFT became which Xtrata inscription.

---

## 2. Working Name

Suggested contract name:

```clarity
xtrata-forever-twin-index-v1
```

Alternative names:

```clarity
xtrata-twin-index-v1
xtrata-collection-linker-v1
xtrata-id-translator-v1
```

Preferred name:

```clarity
xtrata-forever-twin-index-v1
```

---

## 3. Core Idea

The helper contract should act as a simple registry.

It should not mint NFTs.

It should not escrow NFTs.

It should not verify IPFS metadata.

It should not replace the Forever Twin contract.

It should only record confirmed mappings created by approved Forever Twin contracts.

The Forever Twin contract handles the actual conversion process. Once a conversion succeeds, it calls the index helper and records:

```text
original collection contract
original local token ID
Xtrata inscription ID
Forever Twin contract
block height
```

This creates a reliable on-chain lookup in both directions.

---

## 4. Required Lookups

The helper contract must support two main read paths.

### 4.1 Original NFT to Xtrata ID

Given:

```text
collection contract
local token ID
```

Return:

```text
Xtrata inscription ID
```

Example:

```text
Bitcoin Pepe contract + token #44
→ Xtrata inscription #512
```

### 4.2 Xtrata ID to Original NFT

Given:

```text
Xtrata inscription ID
```

Return:

```text
original collection contract
local token ID
```

Example:

```text
Xtrata inscription #512
→ Bitcoin Pepe contract + token #44
```

---

## 5. Data Model

### 5.1 Original to Xtrata Map

```clarity
(define-map original-to-xtrata
  {
    collection: principal,
    token-id: uint
  }
  {
    xtrata-id: uint,
    twin-contract: principal,
    recorded-at: uint
  }
)
```

### 5.2 Xtrata to Original Map

```clarity
(define-map xtrata-to-original
  {
    xtrata-id: uint
  }
  {
    collection: principal,
    token-id: uint,
    twin-contract: principal,
    recorded-at: uint
  }
)
```

### 5.3 Approved Forever Twin Contracts

```clarity
(define-map approved-twin-contracts
  {
    contract: principal
  }
  {
    approved: bool,
    approved-at: uint
  }
)
```

This ensures only trusted Forever Twin contracts can write to the index.

---

## 6. Public Read Functions

### 6.1 Get Xtrata ID From Original Token

```clarity
(define-read-only (get-xtrata-id (collection principal) (token-id uint))
  (map-get? original-to-xtrata
    {
      collection: collection,
      token-id: token-id
    }
  )
)
```

Expected return:

```clarity
(some {
  xtrata-id: u512,
  twin-contract: .bitcoin-pepe-forever-twin,
  recorded-at: u123456
})
```

### 6.2 Get Original Token From Xtrata ID

```clarity
(define-read-only (get-original-token (xtrata-id uint))
  (map-get? xtrata-to-original
    {
      xtrata-id: xtrata-id
    }
  )
)
```

Expected return:

```clarity
(some {
  collection: .bitcoin-pepe,
  token-id: u44,
  twin-contract: .bitcoin-pepe-forever-twin,
  recorded-at: u123456
})
```

### 6.3 Check Whether a Twin Exists

```clarity
(define-read-only (has-twin (collection principal) (token-id uint))
  (is-some
    (map-get? original-to-xtrata
      {
        collection: collection,
        token-id: token-id
      }
    )
  )
)
```

### 6.4 Check Whether an Xtrata ID Is Already Linked

```clarity
(define-read-only (is-xtrata-id-linked (xtrata-id uint))
  (is-some
    (map-get? xtrata-to-original
      {
        xtrata-id: xtrata-id
      }
    )
  )
)
```

---

## 7. Write Function

### 7.1 Record Twin Mapping

```clarity
(define-public (record-twin
  (collection principal)
  (token-id uint)
  (xtrata-id uint)
)
  ;; only approved Forever Twin contracts can call this
)
```

This function should:

1. Check that `contract-caller` is an approved Forever Twin contract.
2. Check that the original token has not already been mapped.
3. Check that the Xtrata inscription ID has not already been mapped.
4. Write to `original-to-xtrata`.
5. Write to `xtrata-to-original`.
6. Return success.

Important: use `contract-caller`, not `tx-sender`, for authorisation.

This allows the user to call the Forever Twin contract, while the Forever Twin contract calls the helper contract.

---

## 8. Admin Functions

The contract should have an owner/admin.

### 8.1 Contract Owner

```clarity
(define-data-var contract-owner principal tx-sender)
```

### 8.2 Approve Forever Twin Contract

```clarity
(define-public (approve-twin-contract (contract principal))
  ;; only owner
)
```

This allows a new Forever Twin contract to write mappings.

### 8.3 Revoke Forever Twin Contract

```clarity
(define-public (revoke-twin-contract (contract principal))
  ;; only owner
)
```

This prevents a faulty or deprecated Forever Twin contract from writing future mappings.

Existing mappings should not be deleted.

---

## 9. Important Rules

### 9.1 Mappings Should Be Permanent

Once a mapping exists, it should not be editable under normal conditions.

This is important for trust.

The index should behave like a historical record, not a mutable database.

### 9.2 No Duplicate Original Tokens

The same original NFT must not be mapped to multiple Xtrata IDs.

Bad:

```text
Bitcoin Pepe #44 → Xtrata #512
Bitcoin Pepe #44 → Xtrata #590
```

### 9.3 No Duplicate Xtrata IDs

The same Xtrata inscription ID must not be mapped to multiple original tokens.

Bad:

```text
Xtrata #512 → Bitcoin Pepe #44
Xtrata #512 → Bitcoin Pepe #98
```

### 9.4 The Index Should Not Control Ownership

The helper contract should not decide who owns the NFT.

Ownership and escrow rules remain inside the Forever Twin contract and/or the original NFT contract.

The index only answers:

```text
What does this ID correspond to?
```

---

## 10. How Future Forever Twin Contracts Use It

Each new Forever Twin contract should be connected to the index.

Example flow:

```text
1. User owns Original NFT #44.
2. User calls Bitcoin Pepe Forever Twin contract.
3. Forever Twin contract verifies ownership / escrow / payment.
4. Forever Twin contract creates or links the Xtrata inscription.
5. Forever Twin contract receives the Xtrata inscription ID.
6. Forever Twin contract calls xtrata-forever-twin-index-v1.
7. Index records Original #44 ⇄ Xtrata #512.
8. Frontends can now read the relationship directly on-chain.
```

---

## 11. Suggested Contract Call From Forever Twin Contract

Inside a Forever Twin contract, after successful conversion:

```clarity
(try!
  (contract-call? .xtrata-forever-twin-index-v1 record-twin
    original-collection-contract
    original-token-id
    xtrata-inscription-id
  )
)
```

This should happen only after the Forever Twin conversion is known to be valid.

If the index write fails, the whole transaction should fail.

That way there is never a successful Forever Twin conversion without a matching index record.

---

## 12. Frontend Benefits

With this helper contract, the frontend can avoid maintaining its own translation table.

The frontend can simply ask:

```clarity
(get-xtrata-id .bitcoin-pepe u44)
```

or:

```clarity
(get-original-token u512)
```

This makes it much easier to display:

```text
Bitcoin Pepe #44
Forever Twin: Xtrata #512
```

or:

```text
Xtrata #512
Original: Bitcoin Pepe #44
```

---

## 13. Explorer / Marketplace Benefits

This also helps external tools, explorers, marketplaces and collection pages.

They can query the helper contract to understand:

```text
Which Xtrata inscription belongs to this original NFT?
Which original NFT does this Xtrata inscription represent?
Which Forever Twin contract created the relationship?
When was the relationship recorded?
```

This makes Forever Twins easier to integrate without bespoke off-chain logic.

---

## 14. Future-Proofing

The helper should be collection-agnostic.

It should not be hardcoded only for Bitcoin Pepes.

It should support any future Forever Twin project by approving each new Forever Twin contract.

This allows the same helper contract to support:

```text
Bitcoin Pepes
StacksBoard slots
future SIP-009 collections
music NFTs
art collections
game assets
other Xtrata migrations
```

---

## 15. Optional Future Features

These are not required for v1, but could be considered later.

### 15.1 Project IDs

Add project IDs for easier grouping:

```clarity
project-id: uint
```

This could allow the frontend to group all mappings under a named project.

### 15.2 Collection Metadata Registry

Store basic project metadata:

```text
project name
original collection contract
forever twin contract
creator
created-at
```

### 15.3 Migration Counters

Track how many tokens from a collection have been converted.

Example:

```clarity
(get-project-count project-id)
```

### 15.4 Supersession Records

If a future replacement contract is deployed, record that one index or twin contract supersedes another.

This should not alter old records, only add a new historical layer.

---

## 16. Recommended v1 Scope

For the first version, keep it deliberately simple.

Build only:

1. Admin owner.
2. Approved Forever Twin contract list.
3. `record-twin`.
4. `get-xtrata-id`.
5. `get-original-token`.
6. `has-twin`.
7. `is-xtrata-id-linked`.

Avoid anything that creates complexity too early.

The value of v1 is that the mapping becomes permanent, simple, readable and trustworthy.

---

## 17. Security Considerations

### 17.1 Use `contract-caller`

The helper should authorise the calling contract using `contract-caller`.

Do not rely only on `tx-sender`.

### 17.2 Only Approved Twin Contracts Can Write

Random users must not be able to write arbitrary mappings.

Only approved Forever Twin contracts should be allowed to call `record-twin`.

### 17.3 Prevent Duplicate Writes

The helper must reject:

```text
original token already mapped
Xtrata ID already mapped
```

### 17.4 No Admin Editing of Records

Avoid admin powers that can rewrite mappings.

If correction mechanisms are needed later, use a separate v2 contract or append-only correction/supersession model.

### 17.5 Fail Whole Conversion If Indexing Fails

Forever Twin contracts should call the index helper with `try!`.

If indexing fails, the Forever Twin conversion should fail too.

---

## 18. Suggested Error Codes

```clarity
(define-constant ERR_NOT_OWNER u100)
(define-constant ERR_NOT_APPROVED_TWIN_CONTRACT u101)
(define-constant ERR_ORIGINAL_ALREADY_MAPPED u102)
(define-constant ERR_XTRATA_ALREADY_MAPPED u103)
(define-constant ERR_INVALID_ID u104)
```

---

## 19. Suggested Test Suite

### Admin Tests

- Owner can approve a Forever Twin contract.
- Non-owner cannot approve a Forever Twin contract.
- Owner can revoke a Forever Twin contract.
- Non-owner cannot revoke a Forever Twin contract.

### Write Tests

- Approved Forever Twin contract can record a mapping.
- Unapproved contract cannot record a mapping.
- Same original token cannot be recorded twice.
- Same Xtrata ID cannot be recorded twice.
- Successful write creates both lookup directions.

### Read Tests

- Original token returns correct Xtrata ID.
- Xtrata ID returns correct original token.
- Unknown original token returns none.
- Unknown Xtrata ID returns none.
- `has-twin` returns true for mapped token.
- `has-twin` returns false for unmapped token.
- `is-xtrata-id-linked` returns true for mapped Xtrata ID.
- `is-xtrata-id-linked` returns false for unmapped Xtrata ID.

### Integration Tests

- Forever Twin contract completes conversion and records mapping.
- Forever Twin conversion fails if index write fails.
- Mapping remains readable after transfer of either twin asset.
- Multiple collections can use the same index helper.

---

## 20. Implementation Summary

The final system should look like this:

```text
Original SIP-009 Collection
        ↓
Forever Twin Contract
        ↓
Xtrata Inscription
        ↓
Xtrata Forever Twin Index Helper
```

The index helper records:

```text
Original Collection Contract + Local Token ID
⇄
Xtrata Inscription ID
```

This creates a simple on-chain translation layer for all current and future Forever Twin contracts.

The key benefit is that anyone can read the relationship directly from chain without needing Xtrata, a marketplace, or a frontend to maintain a separate database.

The helper contract becomes the shared public index of Forever Twin relationships across the Xtrata ecosystem.