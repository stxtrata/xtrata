# Xtrata Manifest Authority v1 - Sub requirements 
## Gallery Support Requirements

## 1. Purpose

This document clarifies the desired gallery-related behaviour that should be considered while designing the `xtrata-manifest-authority-v1` helper contract.

The goal is not to create a complicated wallet profile system in v1.

The goal is to make sure the manifest authority system can support **user-created galleries** in a clean, composable and future-proof way.

A gallery should be treated as one possible type of manifest.

Wallet search should remain wallet search.

If someone searches a wallet, Xtrata should continue to show the inscriptions owned by that wallet. Gallery functionality should sit alongside that, as an optional curated layer created by the wallet owner or another authorised creator.

---

## 2. Key Simplification

The system should avoid overcomplicating wallet ownership.

There should be a clear distinction between:

1. **Wallet ownership**
2. **Curated gallery manifests**

Wallet ownership is raw and factual.

Gallery manifests are curated, intentional and versionable.

A wallet owner may create a gallery that acts as their preferred collection view, but this should not replace the basic wallet search/indexing behaviour.

---

## 3. What Wallet Search Should Do

Wallet search should remain simple.

When a user searches a wallet address, the system should return inscriptions owned by that wallet.

This should not depend on:

- Profile settings
- Hidden flags
- Gallery choices
- Display preferences
- Curated manifests

Wallet search should remain a direct ownership view.

The front end may later choose to display related galleries as an additional section, for example:

```txt
Owned by this wallet
Curated galleries by this wallet
```

But the wallet search itself should not be redefined as a profile resolver.

---

## 4. What Galleries Should Do

A gallery is a curated manifest that references a set of inscriptions.

A gallery can be used for:

- A selected collection view
- A personal display page
- A themed group of inscriptions
- A music release
- A collaborative collection
- A “best of” wallet view
- A project-specific page
- A Forever Twins collection view
- A public exhibition
- A time-capsule or historical snapshot

The important point is that the gallery is **created intentionally** and **resolved through the manifest authority system**.

The gallery does not change ownership.

The gallery simply says:

```txt
This authorised manifest presents these inscriptions together in this order, under this title, with this metadata.
```

---

## 5. Gallery as Manifest Type

The manifest system should support a gallery manifest type.

Suggested manifest type:

```json
{
  "xip": "xtrata-gallery-manifest-v1",
  "type": "gallery"
}
```

A gallery manifest should be inscribed as normal Xtrata data.

The authority contract should not parse the full JSON.

The contract only needs to know enough to register, authorise, supersede and resolve the manifest.

The full gallery contents can be read by the indexer/front end from the inscription payload.

---

## 6. Suggested Gallery Manifest Shape

A gallery manifest could look broadly like this:

```json
{
  "xip": "xtrata-gallery-manifest-v1",
  "type": "gallery",
  "title": "Proof of Sound",
  "description": "A curated gallery of Cicada on-chain music inscriptions.",
  "creator": "SP123...",
  "owner": "SP123...",
  "slug": "proof-of-sound",
  "cover": {
    "inscription_id": 785
  },
  "items": [
    {
      "inscription_id": 785,
      "position": 1,
      "title": "First on-chain tune",
      "featured": true
    },
    {
      "inscription_id": 786,
      "position": 2
    }
  ],
  "settings": {
    "sort": "manual",
    "show_relationships": true,
    "show_dates": true
  },
  "supersedes": null,
  "parent_manifest": null,
  "version": 1
}
```

The exact JSON schema can be refined separately.

For the v1 contract design, the important requirement is that the contract can support this kind of object as an authoritative, versionable manifest.

---

## 7. Authority Contract Responsibilities

The `xtrata-manifest-authority-v1` contract should not try to become a gallery contract.

It should remain a generic manifest authority contract.

For gallery support, it should be able to:

1. Register a manifest.
2. Associate a manifest with a creator or authority.
3. Associate a manifest with a manifest type.
4. Support supersession/versioning.
5. Allow efficient lookup of the latest valid manifest.
6. Emit useful events for indexers.
7. Allow optional grouping by namespace, slug or subject.

The contract should avoid storing the full gallery contents.

The gallery contents live in the inscription.

The contract stores authority and resolution pointers.

---

## 8. Desirable Contract Concepts

The contract should support these broad ideas.

### Manifest ID

The Xtrata inscription ID of the manifest.

```clarity
manifest-id: uint
```

### Manifest Type

A lightweight type marker.

For example:

```clarity
manifest-type: "gallery"
manifest-type: "collection-map"
manifest-type: "profile"
manifest-type: "release"
manifest-type: "xip"
```

In Clarity this may be represented as a string-ascii, buff, uint enum, or another simple type depending on what is safest and cheapest.

### Authority

The principal allowed to register or supersede the manifest.

For a wallet-created gallery, this would usually be the wallet.

```clarity
authority: principal
```

### Subject

The thing the manifest is about.

For a wallet gallery, this may be the wallet principal.

For a collection gallery, this may eventually be a contract principal.

For other manifest types, this could be optional.

```clarity
subject: optional principal
```

### Slug / Key

A short identifier for resolving a named manifest.

For example:

```txt
main-gallery
proof-of-sound
forever-twins
selected-collection
```

This would allow a wallet to have multiple galleries.

Possible lookup:

```txt
authority + manifest-type + slug -> active manifest id
```

### Supersession

A newer manifest can supersede an older manifest.

```txt
manifest v1 -> manifest v2 -> manifest v3
```

The resolver should be able to find the latest active version.

---

## 9. Recommended Minimal On-Chain Mappings

The v1 contract could include mappings along these lines:

```clarity
;; manifest id -> manifest record
manifest-records

;; manifest id -> superseding manifest id
superseded-by

;; authority + manifest type + slug -> active manifest id
active-manifests
```

A conceptual record might contain:

```clarity
{
  authority: principal,
  subject: optional principal,
  manifest-type: string-ascii,
  slug: optional string-ascii,
  created-at: uint,
  supersedes: optional uint
}
```

The exact Clarity representation can be optimised later.

The important design requirement is that the contract can answer:

```txt
What manifest is active for this authority/type/slug?
Does this manifest supersede another manifest?
What is the latest active manifest in this chain?
Who had authority to register this manifest?
```

---

## 10. Gallery Resolution

A front end or indexer should be able to resolve a gallery efficiently.

Example:

```txt
authority: SP123...
type: gallery
slug: proof-of-sound
```

Expected result:

```txt
active manifest id: 902
```

Then the indexer/front end reads inscription `902`, parses the JSON gallery manifest, and renders the gallery.

If manifest `902` supersedes manifest `900`, the system can show version history.

If a newer manifest is later registered as active for the same authority/type/slug, the resolver should return the newer manifest.

---

## 11. Supersession Rules

A manifest should only be able to supersede another manifest if the caller has authority to do so.

Recommended v1 rule:

A manifest can supersede an earlier manifest if:

- The caller is the same authority as the original manifest, or
- The caller is an approved delegate of that authority, if delegation is included, or
- The contract has another explicit rule allowing that relationship.

For v1, the simplest rule is best:

```txt
Only the original authority can supersede its own manifest.
```

Delegation can come later if needed.

---

## 12. Gallery Creation Flow

The intended front-end flow would be:

1. User connects wallet.
2. User selects inscriptions to include in a gallery.
3. User gives the gallery a title, description and optional cover.
4. Front end generates a gallery manifest JSON.
5. User inscribes that manifest through Xtrata.
6. User registers the new manifest ID with `xtrata-manifest-authority-v1`.
7. The contract records that this wallet has an active gallery manifest for the chosen slug.
8. The indexer picks up the event.
9. Xtrata can now render the gallery efficiently.

---

## 13. Gallery Update Flow

To update a gallery:

1. User opens their existing gallery.
2. Front end loads the active manifest.
3. User edits the gallery.
4. Front end creates a new gallery manifest JSON.
5. New manifest includes:

```json
{
  "supersedes": 900,
  "version": 2
}
```

6. User inscribes the new manifest.
7. User registers the new manifest as superseding the old one.
8. The contract updates the active pointer for that authority/type/slug.
9. Xtrata resolves the gallery to the new manifest.

The old gallery remains permanently available as historical state.

---

## 14. What v1 Should Avoid

The v1 contract should avoid taking on too much.

It should not:

- Parse full gallery JSON.
- Decide what inscriptions are visible.
- Replace wallet ownership search.
- Create a private profile system.
- Store long descriptions or item arrays.
- Try to enforce whether a gallery item is owned by the gallery creator.
- Try to become a social/profile contract.
- Try to solve name services.
- Try to manage encrypted/private data.

Those things can be handled by the front end, indexer, later contracts, or separate XIPs.

---

## 15. Whether Gallery Items Must Be Owned

The v1 contract probably should not enforce ownership of every item in a gallery.

Reason:

A gallery may intentionally include:

- A user’s own inscriptions
- Collaborations
- Referenced works
- Parent/child inscriptions
- Collection examples
- Historical artefacts
- Related manifests
- Works by other wallets

So ownership enforcement should be a front-end or manifest-level convention, not a hard contract rule.

The manifest could include a field such as:

```json
{
  "curation_mode": "owned-only"
}
```

But the contract should not need to validate that.

---

## 16. Efficient Reading Requirements

The whole point of registering gallery manifests through the authority contract is to make reading simple.

The front end should not have to scan all inscriptions to find a wallet’s current gallery.

Instead, it should be able to ask:

```txt
What is the active gallery manifest for wallet SP123 and slug "main"?
```

And receive a manifest ID.

Then it reads that inscription directly.

This is the core requirement for v1.

---

## 17. Suggested Read-Only Functions

The contract should ideally expose read-only functions like:

```clarity
(get-active-manifest
  (authority principal)
  (manifest-type ...)
  (slug ...)
)
```

```clarity
(get-manifest-record
  (manifest-id uint)
)
```

```clarity
(get-superseded-by
  (manifest-id uint)
)
```

```clarity
(get-latest-manifest
  (manifest-id uint)
)
```

The exact function names can change, but the contract should support these lookup patterns.

If `get-latest-manifest` is too expensive or awkward on-chain because of chain walking, the indexer can handle latest-resolution off-chain while the contract simply stores direct active pointers.

For v1, direct active pointers are probably more useful than recursive chain walking.

---

## 18. Suggested Public Functions

The contract may need public functions like:

```clarity
(register-manifest ...)
```

Registers a manifest under an authority/type/slug.

```clarity
(set-active-manifest ...)
```

Sets an already registered manifest as the active manifest for an authority/type/slug.

```clarity
(register-and-activate-manifest ...)
```

Convenience function to register and immediately activate.

```clarity
(supersede-manifest ...)
```

Links a new manifest as superseding an older manifest.

```clarity
(register-superseding-manifest ...)
```

Registers a new manifest and marks it as superseding the previous active manifest.

For the first version, this could be compressed into fewer functions if simpler.

---

## 19. Important Event Requirements

The contract should emit events that make indexing easy.

Useful event data:

```txt
event: manifest-registered
manifest-id
authority
subject
manifest-type
slug
supersedes
```

```txt
event: active-manifest-set
authority
manifest-type
slug
manifest-id
previous-manifest-id
```

```txt
event: manifest-superseded
old-manifest-id
new-manifest-id
authority
manifest-type
slug
```

These events allow the Xtrata indexer to keep a clean table of current manifests without scanning everything repeatedly.

---

## 20. Front-End Behaviour

The front end can use this contract to support galleries without changing wallet search.

### Wallet Search Page

When viewing/searching a wallet:

- Show owned inscriptions as normal.
- Optionally show “Galleries created by this wallet”.
- Optionally show “Selected collection view” if the wallet has registered one.
- Do not hide raw owned inscriptions because of gallery settings.

### Gallery Page

A gallery can have its own route:

```txt
/g/{authority}/{slug}
```

or:

```txt
/gallery/{manifest-id}
```

or:

```txt
/i/{manifest-id}/gallery
```

The gallery page resolves the latest active manifest and renders the curated gallery.

---

## 21. Desirable Gallery Features Enabled by This Design

This design supports:

- One wallet creating many galleries.
- A wallet choosing a “main” gallery.
- A wallet creating a selected collection view.
- A collection creating an official gallery.
- A project creating a release page.
- A gallery being updated through superseding manifests.
- A gallery having a full historical version chain.
- The indexer reading current gallery state efficiently.
- The front end rendering galleries without scanning all inscriptions.

---

## 22. MVP Recommendation

For v1, the best minimum target is:

```txt
authority + manifest-type + slug -> active manifest id
```

This alone unlocks most gallery use cases.

Example:

```txt
SP123...
gallery
main
=> manifest id 900
```

Or:

```txt
SP123...
gallery
proof-of-sound
=> manifest id 902
```

From there, the front end can render the gallery by reading the manifest inscription.

Supersession can either:

- Update the active pointer directly, or
- Also record the supersession relationship for history.

The active pointer is the most important part for efficient reading.

---

## 23. Recommended Contract Design Priority

The v1 contract should prioritise:

1. Simple manifest registration.
2. Simple active pointer lookup.
3. Simple supersession history.
4. Useful indexer events.
5. Generic manifest types.

It should not prioritise:

1. Wallet profiles.
2. Privacy controls.
3. Complex visibility rules.
4. Ownership enforcement.
5. Full manifest validation.
6. Recursive on-chain resolution.

---

## 24. Plain-English Summary

The contract should not try to decide what a wallet “is”.

It should simply allow a wallet or authorised principal to say:

```txt
This manifest is my active gallery called “main”.
```

Or:

```txt
This manifest is the latest version of my gallery called “Proof of Sound”.
```

Then Xtrata can efficiently read that manifest and render the gallery.

That keeps wallet search clean, keeps the authority contract generic, and still gives Xtrata the gallery system it needs.

---

## 25. Implementation Prompt for Repo Agent

```txt
We are designing `xtrata-manifest-authority-v1`.

Please keep the contract generic. It should not become a wallet profile contract.

One important use case it must support is user-created galleries. A gallery is simply a manifest type. The gallery contents live in the manifest inscription JSON. The authority contract should not parse that JSON.

The key requirement is efficient registration and resolution of active manifests.

The most important lookup pattern is:

authority + manifest-type + slug -> active manifest id

For example:

wallet SP123 + type gallery + slug main -> manifest id 900

Wallet search should remain wallet search. Searching a wallet should continue to return inscriptions owned by that wallet. Galleries should be optional curated views alongside wallet ownership, not a replacement for ownership search.

Please design the contract with the following capabilities in mind:

1. Register a manifest ID under an authority.
2. Store a lightweight manifest type, such as gallery, collection-map, profile, release, xip, etc.
3. Optionally store a slug/key, such as main, proof-of-sound, selected-collection.
4. Optionally store a subject principal, if the manifest is about a wallet, contract or collection.
5. Set or update the active manifest for authority/type/slug.
6. Record supersession relationships, where a new manifest supersedes an older manifest.
7. Emit clean events for indexers whenever manifests are registered, activated or superseded.
8. Provide read-only functions for looking up active manifests and manifest records.

The contract should not:
- Parse manifest JSON.
- Store gallery item arrays.
- Replace wallet search.
- Enforce visibility rules.
- Claim privacy.
- Enforce that gallery items are owned by the gallery creator.
- Become a social profile/name service contract.

For v1, prioritise the simplest useful model:

authority + manifest-type + slug -> active manifest id

This should be enough for the front end and indexer to support galleries efficiently while keeping the manifest authority contract reusable for other Xtrata manifest types.
```