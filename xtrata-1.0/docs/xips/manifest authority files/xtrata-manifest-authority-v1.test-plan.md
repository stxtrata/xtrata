# xtrata-manifest-authority-v1 Test Plan

This is a suggested test suite for conversion into Clarinet/Vitest tests.

## 1. Registration

### registers a basic curator manifest

- call `register-manifest` with authority class `curator`
- expect `(ok manifest-id)`
- expect `get-manifest-record` returns correct registrar, class, type, lifecycle and status

### rejects duplicate manifest registration

- register manifest id `100`
- register `100` again
- expect `ERR-ALREADY-REGISTERED`

### rejects invalid authority class

- call with `authority-class = u99`
- expect `ERR-INVALID-AUTHORITY-CLASS`

### rejects invalid manifest type

- call with `manifest-type = u99`
- expect `ERR-INVALID-MANIFEST-TYPE`

### rejects invalid lifecycle

- call with `lifecycle = u99`
- expect `ERR-INVALID-LIFECYCLE`

### rejects invalid target mode

- call with `target-mode = u99`
- expect `ERR-INVALID-TARGET-MODE`

## 2. Scope creation

### creates a scope

- call `create-scope(scopeKey, authority, corpus-authority, continuity-enforced)`
- expect scope exists
- expect current manifest is `none`

### rejects duplicate scope

- create same scope twice
- expect `ERR-SCOPE-EXISTS`

### allows scope authority handover

- initial authority calls `set-scope-authority`
- expect new authority recorded

### rejects scope authority handover by random principal

- non-authority calls `set-scope-authority`
- expect `ERR-NOT-SCOPE-AUTHORITY`

## 3. Initial current manifest

### scope authority can set first current manifest

- create scope
- register manifest
- call `register-initial-scope-manifest`
- expect current pointer equals manifest id

### non-authority cannot set first current manifest

- create scope with authority A
- register manifest as B
- B calls `register-initial-scope-manifest`
- expect `ERR-NOT-SCOPE-AUTHORITY`

### cannot set first current manifest twice

- set current manifest once
- call `register-initial-scope-manifest` again
- expect `ERR-WRONG-PREVIOUS-MANIFEST`

## 4. Scope succession

### authority can update current manifest with valid predecessor

- create scope
- register v1
- set v1 as current
- register v2 with `previous-manifest-id = some(v1)`
- call `update-scope-manifest(scope, v1, v2, newRoot, count, changedCount)`
- expect current pointer equals v2
- expect v1 status is `superseded`
- expect v1 `superseded-by` is v2

### rejects update with wrong previous manifest

- current is v1
- register v2 with previous v999
- call update with previous v999 or v1 depending on case
- expect `ERR-WRONG-PREVIOUS-MANIFEST`

### rejects update by non-authority

- current is v1
- random principal tries update to v2
- expect `ERR-NOT-SCOPE-AUTHORITY`

### rejects making withdrawn manifest current

- register v2
- withdraw v2
- attempt update to v2
- expect failure

## 5. Manifest lifecycle

### registrar can withdraw own manifest

- register manifest
- call `withdraw-manifest`
- expect status withdrawn

### non-registrar cannot withdraw manifest

- register as A
- withdraw as B
- expect `ERR-UNAUTHORISED`

### registrar can mark superseded manually

- register v1 and v2
- call `mark-superseded(v1, v2)`
- expect v1 superseded

## 6. Target links

### registrar can add small explicit target link

- register manifest
- call `add-manifest-target`
- expect target record exists

### non-registrar cannot add target link

- register as A
- B calls `add-manifest-target`
- expect `ERR-UNAUTHORISED`

## 7. XIP corpus scenario

### official XIP corpus continuity

- create `xip-corpus` scope with corpus authority
- register XIP Corpus Manifest v1 as standard-corpus, continuity-enforced, corpus-scope
- set v1 current
- register XIP Corpus Manifest v2 with `previous-manifest-id = v1`
- update current to v2
- expect v1 superseded, v2 current, root updated

### reject isolated XIP update as official corpus update

- create scope and current v1
- register XIP-001 document manifest but not corpus manifest, or without previous v1
- attempt to update scope
- expect wrong previous/lifecycle/type failure depending on final contract rules

## 8. Future v3.2.3 integration tests

Once wired to the real core contract:

- reject non-existent manifest id
- reject unsealed manifest id
- reject manifest not created by scope authority where required
- verify owner snapshot target batch
- verify creator target batch


## Added in wired draft v1.1

### Core integration checks
- register-manifest fails with ERR-CORE-NOT-SEALED (u117) for unknown inscription ids and for begun-but-unsealed inscriptions.
- register-manifest fails with ERR-HASH-MISMATCH (u116) when a supplied manifest-hash differs from the core final-hash; succeeds when equal; succeeds when manifest-hash is none.
- Duplicate-content scenario: inscribe identical bytes twice (two ids, same final-hash); register only id A; assert id B is unregistered and get-id-by-hash-based resolution would be wrong (documented resolver advisory, not a contract assertion).

### Scope delegates
- add-scope-delegate: only scope authority may add; unknown scope fails ERR-SCOPE-NOT-FOUND; non-authority fails ERR-NOT-SCOPE-AUTHORITY.
- remove-scope-delegate: removing an unknown delegate fails ERR-NOT-DELEGATE (u118); removal deactivates (is-active-scope-delegate false).
- Succession with delegate creator: manifest inscribed by delegate D, registered by anyone, made current by scope authority -> succeeds.
- Succession with non-delegate creator (neither authority nor active delegate) -> fails ERR-UNAUTHORISED.
- Removed delegate: manifests inscribed by D after removal are rejected at succession; a manifest made current before removal remains current.
- Delegates cannot call register-initial-scope-manifest / update-scope-manifest themselves (still ERR-NOT-SCOPE-AUTHORITY).
- set-scope-authority does not clear delegates; decide and test whether the new authority inherits the delegate set (current draft: yes, inherited).
