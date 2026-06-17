;; xtrata-manifest-authority-v1.clar
;;
;; STATUS: DRAFT v1.4 - Clarity 4 - NOT AUDITED
;; Pin in Clarinet.toml: clarity_version = 4, epoch = 3.3.
;;
;; On-chain registry for XIP-001 manifest inscriptions: authority class, scope,
;; lifecycle, succession, and compact commitments. Does NOT parse manifest JSON;
;; XIP-001 canonicalisation/integrity verification is resolver-side.
;;
;; v1.2 changes (codex review remediation):
;;  R1 create-scope is self-claim only (tx-sender == authority); a derived
;;     scope-key helper is provided for collision-proof keys.
;;  R2 verification is split: `core-hash-verified` is CONTRACT-SET (never a
;;     registrar claim); `claimed-verification` is registrar-attested, range
;;     checked, and documented as a claim.
;;  R3 succession requires the core parent edge: the new manifest inscription's
;;     on-chain `parents` MUST include the previous manifest id (XIP-001 s6:
;;     "the parent edge is authoritative"). Also enforced at registration when
;;     previous-manifest-id is supplied, and in mark-superseded.
;;  R4 scope policy enforced: a manifest may only become current for a scope if
;;     its lifecycle and authority-class equal the scope's; successive current
;;     manifests must keep the same manifest-type.
;;  R5 commitments are immutable: scope succession reads scope-root/item-count/
;;     changed-count from the record committed at registration; it can no longer
;;     overwrite them.
;;  R6 a manifest that is current for a scope cannot be withdrawn or manually
;;     superseded; it can only be replaced via update-scope-manifest. revoke
;;     remains available as the emergency path (resolvers MUST check status of
;;     the current manifest - see spec).
;;  R7 registration requires the XIP-001 manifest MIME type
;;     application/vnd.xtrata.manifest+json, read from core InscriptionMeta.
;;
;; v1.3 changes (second codex review):
;;  R9  registration is CREATOR-ONLY: tx-sender must be the inscription's
;;      immutable core creator. Closes the registration front-run/poisoning
;;      attack (squat metadata, block the creator with u101, revoke later).
;;  R10 a manifest can be current for AT MOST ONE scope: both succession
;;      entry points reject a candidate whose current-scope is already set
;;      (ERR-MANIFEST-IS-CURRENT), closing the multi-scope marker clobber.
;;
;; v1.4 changes (third codex review):
;;  R11 scopes carry an IMMUTABLE key-authority (the creating principal),
;;      separate from the transferable operational authority. Derived scope
;;      keys validate against key-authority, so set-scope-authority no longer
;;      invalidates derived scope identity.
;;
;; Core integration: calls xtrata-v3-2-3 read-onlys (is-inscription-sealed,
;; get-inscription-hash, get-inscription-creator, get-inscription-meta,
;; get-parents, inscription-exists). `.xtrata-v3-2-3` assumes the same deployer;
;; replace with the fully qualified principal otherwise.

;; -----------------------------------------------------------------------------
;; Constants
;; -----------------------------------------------------------------------------

(define-constant CONTRACT-OWNER tx-sender)

;; XIP-001 s2: inscribed manifests MUST use this mime type.
(define-constant MANIFEST-MIME "application/vnd.xtrata.manifest+json")

;; Error codes
(define-constant ERR-UNAUTHORISED (err u100))
(define-constant ERR-ALREADY-REGISTERED (err u101))
(define-constant ERR-NOT-REGISTERED (err u102))
(define-constant ERR-INVALID-AUTHORITY-CLASS (err u103))
(define-constant ERR-INVALID-MANIFEST-TYPE (err u104))
(define-constant ERR-INVALID-LIFECYCLE (err u105))
(define-constant ERR-INVALID-TARGET-MODE (err u106))
(define-constant ERR-SCOPE-EXISTS (err u107))
(define-constant ERR-SCOPE-NOT-FOUND (err u108))
(define-constant ERR-WRONG-PREVIOUS-MANIFEST (err u109))
(define-constant ERR-MANIFEST-NOT-ACTIVE (err u110))
(define-constant ERR-CANNOT-MAKE-WITHDRAWN-CURRENT (err u111))
(define-constant ERR-INVALID-STATUS (err u112))
(define-constant ERR-NOT-SCOPE-AUTHORITY (err u113))
(define-constant ERR-INVALID-SCOPE-KEY (err u114))
(define-constant ERR-INVALID-COUNT (err u115))
(define-constant ERR-HASH-MISMATCH (err u116))
(define-constant ERR-CORE-NOT-SEALED (err u117))
(define-constant ERR-NOT-DELEGATE (err u118))
(define-constant ERR-MANIFEST-IS-CURRENT (err u119))
(define-constant ERR-PARENT-EDGE-MISSING (err u120))
(define-constant ERR-WRONG-MIME (err u121))
(define-constant ERR-INVALID-VERIFICATION-CLASS (err u122))
(define-constant ERR-SCOPE-POLICY-MISMATCH (err u123))
(define-constant ERR-TARGET-NOT-IN-CORE (err u124))

;; Authority classes
(define-constant AUTH-CURATOR u1)
(define-constant AUTH-OWNER-SNAPSHOT u2)
(define-constant AUTH-CREATOR u3)
(define-constant AUTH-COLLECTION-AUTHORITY u4)
(define-constant AUTH-PROJECT-AUTHORITY u5)
(define-constant AUTH-NAMESPACE-AUTHORITY u6)
(define-constant AUTH-CORPUS-AUTHORITY u7)
(define-constant AUTH-STANDARD-AUTHORITY u8)
(define-constant AUTH-DELEGATED-AUTHORITY u9)

;; Manifest types
(define-constant TYPE-COLLECTION u1)
(define-constant TYPE-ALBUM u2)
(define-constant TYPE-GALLERY u3)
(define-constant TYPE-EXHIBITION u4)
(define-constant TYPE-ARCHIVE u5)
(define-constant TYPE-PLAYLIST u6)
(define-constant TYPE-NAMESPACE-ROOT u7)
(define-constant TYPE-SOFTWARE-PACKAGE u8)
(define-constant TYPE-PROVENANCE-GRAPH u9)
(define-constant TYPE-TOKEN-MAP u10)
(define-constant TYPE-STANDARD-DOCUMENT u11)
(define-constant TYPE-STANDARD-CORPUS u12)
(define-constant TYPE-MIGRATION u13)
(define-constant TYPE-LAYOUT u14)
(define-constant TYPE-APP u15)
(define-constant TYPE-FINANCIAL u16)
(define-constant TYPE-DEPENDENCY-GRAPH u17)

;; Lifecycle modes
(define-constant LIFE-SNAPSHOT u1)
(define-constant LIFE-CANONICAL u2)
(define-constant LIFE-CONTINUITY-ENFORCED u3)

;; Target modes
(define-constant TARGET-EXPLICIT-LIST u1)
(define-constant TARGET-SEQUENTIAL-RANGE u2)
(define-constant TARGET-PREDICATE-SNAPSHOT u3)
(define-constant TARGET-HASH-ROOT u4)
(define-constant TARGET-WALLET-SNAPSHOT u5)
(define-constant TARGET-NAMESPACE-SCOPE u6)
(define-constant TARGET-PROJECT-SCOPE u7)
(define-constant TARGET-CORPUS-SCOPE u8)
(define-constant TARGET-RESOLVER-MAP u9)
(define-constant TARGET-DEPENDENCY-GRAPH u10)

;; Status codes
(define-constant STATUS-ACTIVE u1)
(define-constant STATUS-SUPERSEDED u2)
(define-constant STATUS-WITHDRAWN u3)
(define-constant STATUS-REVOKED u4)

;; Registrar-CLAIMED verification classes (off-chain checks the registrar
;; attests to having performed; the contract cannot validate these).
(define-constant CLAIM-NONE u0)
(define-constant CLAIM-UNVERIFIED u1)
(define-constant CLAIM-VERIFIED-OFFCHAIN u2)
(define-constant CLAIM-PARTIAL u3)

;; -----------------------------------------------------------------------------
;; Data maps
;; -----------------------------------------------------------------------------

;; Primary manifest record, keyed by the manifest inscription id.
;;
;; CONTRACT-SET fields (facts the contract verified against the core at
;; registration; never registrar claims):
;;   core-hash-verified  - supplied manifest-hash equalled core final-hash
;;                         (false when no hash was supplied)
;;   created-at          - registration stacks block height
;;   current-scope       - the scope this manifest is currently the head of
;; REGISTRAR-CLAIMED fields:
;;   claimed-verification, schema-id/version, counts, roots, hash, type/class
;;   metadata (subject to the validity range checks and core checks below).
(define-map manifests
  uint
  {
    registrar: principal,
    authority-class: uint,
    manifest-type: uint,
    lifecycle: uint,
    target-mode: uint,
    status: uint,
    schema-id: uint,
    schema-version: (string-ascii 16),
    manifest-hash: (optional (buff 32)),
    integrity-root: (optional (buff 32)),
    scope-root: (optional (buff 32)),
    item-count: uint,
    changed-count: uint,
    previous-manifest-id: (optional uint),
    superseded-by: (optional uint),
    claimed-verification: uint,
    core-hash-verified: bool,
    current-scope: (optional (buff 32)),
    created-at: uint
  }
)

(define-map scopes
  (buff 32)
  {
    key-authority: principal,
    authority: principal,
    authority-class: uint,
    lifecycle: uint,
    current-manifest-id: (optional uint),
    current-root: (optional (buff 32)),
    current-count: uint,
    created-at: uint,
    updated-at: uint,
    active: bool
  }
)

;; Per-scope inscriber delegates. A delegate may CREATE (inscribe) manifests
;; that the scope authority then recognises in succession calls. Delegates do
;; NOT gain the right to call scope succession functions themselves; only the
;; scope authority advances the current pointer.
(define-map scope-delegates
  { scope-key: (buff 32), delegate: principal }
  {
    added-by: principal,
    added-at: uint,
    active: bool
  }
)

;; Optional explicit target links for small manifests.
;; `core-exists` is CONTRACT-SET (the target inscription existed in the core
;; when the link was added). `claimed-verified` is a registrar claim about
;; off-chain membership verification.
(define-map manifest-targets
  { manifest-id: uint, target-id: uint }
  {
    added-by: principal,
    added-at: uint,
    core-exists: bool,
    claimed-verified: bool,
    claimed-verification: uint
  }
)

;; -----------------------------------------------------------------------------
;; Validity helpers
;; -----------------------------------------------------------------------------

(define-private (valid-authority-class (class uint))
  (and (>= class AUTH-CURATOR) (<= class AUTH-DELEGATED-AUTHORITY))
)

(define-private (valid-manifest-type (mtype uint))
  (and (>= mtype TYPE-COLLECTION) (<= mtype TYPE-DEPENDENCY-GRAPH))
)

(define-private (valid-lifecycle (life uint))
  (and (>= life LIFE-SNAPSHOT) (<= life LIFE-CONTINUITY-ENFORCED))
)

(define-private (valid-target-mode (mode uint))
  (and (>= mode TARGET-EXPLICIT-LIST) (<= mode TARGET-DEPENDENCY-GRAPH))
)

(define-private (valid-status (status uint))
  (and (>= status STATUS-ACTIVE) (<= status STATUS-REVOKED))
)

(define-private (valid-claimed-verification (class uint))
  (<= class CLAIM-PARTIAL)
)

(define-private (is-active-manifest (manifest-id uint))
  (match (map-get? manifests manifest-id)
    record (is-eq (get status record) STATUS-ACTIVE)
    false
  )
)

;; -----------------------------------------------------------------------------
;; v3.2.3 core integration
;; -----------------------------------------------------------------------------

;; True only when the inscription exists in core AND is sealed.
(define-private (core-manifest-exists-and-sealed (manifest-id uint))
  (match (contract-call? .xtrata-v3-2-3 is-inscription-sealed manifest-id)
    sealed sealed
    false
  )
)

;; If the registrar supplied a manifest-hash, it must equal the core's
;; recorded final-hash. Returns the verified flag on success.
(define-private (core-hash-check (manifest-id uint) (claimed (optional (buff 32))))
  (match claimed
    h (match (contract-call? .xtrata-v3-2-3 get-inscription-hash manifest-id)
        core-hash (if (is-eq core-hash h) (ok true) ERR-HASH-MISMATCH)
        ERR-CORE-NOT-SEALED
      )
    (ok false)
  )
)

;; XIP-001 s2: the inscription MUST carry the manifest mime type.
(define-private (core-mime-is-manifest (manifest-id uint))
  (match (contract-call? .xtrata-v3-2-3 get-inscription-meta manifest-id)
    meta (is-eq (get mime-type meta) MANIFEST-MIME)
    false
  )
)

;; XIP-001 s6: the on-chain parent edge is authoritative for supersession.
;; True when `predecessor` is among the core parents of `manifest-id`.
(define-private (core-parent-edge (manifest-id uint) (predecessor uint))
  (is-some (index-of? (contract-call? .xtrata-v3-2-3 get-parents manifest-id) predecessor))
)

;; R9: only the inscription's immutable core creator may register it.
(define-private (is-core-creator (manifest-id uint) (who principal))
  (match (contract-call? .xtrata-v3-2-3 get-inscription-creator manifest-id)
    creator (is-eq creator who)
    false
  )
)

;; When a predecessor is declared at registration, the core parent edge must
;; already exist (parents are sealed, immutable facts).
(define-private (predecessor-edge-ok (manifest-id uint) (predecessor (optional uint)))
  (match predecessor
    prev (core-parent-edge manifest-id prev)
    true
  )
)

(define-private (core-inscription-exists (id uint))
  ;; inscription-exists returns (ok bool) with an indeterminate err type,
  ;; so unwrap with a static default.
  (default-to false (some (unwrap-panic (contract-call? .xtrata-v3-2-3 inscription-exists id))))
)

;; True when `who` is an active registered delegate for the scope.
(define-private (is-scope-delegate (scope-key (buff 32)) (who principal))
  (match (map-get? scope-delegates { scope-key: scope-key, delegate: who })
    entry (get active entry)
    false
  )
)

;; The acceptable-creator rule for scope succession: the core creator of the
;; manifest inscription must be the scope authority itself OR an active
;; delegate of the scope.
(define-private (created-by-authority-or-delegate (scope-key (buff 32)) (manifest-id uint) (authority principal))
  (match (contract-call? .xtrata-v3-2-3 get-inscription-creator manifest-id)
    creator (or (is-eq creator authority) (is-scope-delegate scope-key creator))
    false
  )
)

;; Scope policy (R4): a manifest may only become current for a scope when its
;; declared lifecycle and authority-class equal the scope's.
(define-private (matches-scope-policy
    (record {
      registrar: principal, authority-class: uint, manifest-type: uint,
      lifecycle: uint, target-mode: uint, status: uint, schema-id: uint,
      schema-version: (string-ascii 16), manifest-hash: (optional (buff 32)),
      integrity-root: (optional (buff 32)), scope-root: (optional (buff 32)),
      item-count: uint, changed-count: uint,
      previous-manifest-id: (optional uint), superseded-by: (optional uint),
      claimed-verification: uint, core-hash-verified: bool,
      current-scope: (optional (buff 32)), created-at: uint
    })
    (scope {
      key-authority: principal, authority: principal,
      authority-class: uint, lifecycle: uint,
      current-manifest-id: (optional uint), current-root: (optional (buff 32)),
      current-count: uint, created-at: uint, updated-at: uint, active: bool
    })
  )
  (and
    (is-eq (get lifecycle record) (get lifecycle scope))
    (is-eq (get authority-class record) (get authority-class scope))
  )
)

;; -----------------------------------------------------------------------------
;; Public functions - manifest registry
;; -----------------------------------------------------------------------------

(define-public (register-manifest
    (manifest-id uint)
    (authority-class uint)
    (manifest-type uint)
    (lifecycle uint)
    (target-mode uint)
    (schema-id uint)
    (schema-version (string-ascii 16))
    (manifest-hash (optional (buff 32)))
    (integrity-root (optional (buff 32)))
    (scope-root (optional (buff 32)))
    (item-count uint)
    (changed-count uint)
    (previous-manifest-id (optional uint))
    (claimed-verification uint)
  )
  (let ((hash-verified (try! (core-hash-check manifest-id manifest-hash))))
    (asserts! (is-none (map-get? manifests manifest-id)) ERR-ALREADY-REGISTERED)
    (asserts! (valid-authority-class authority-class) ERR-INVALID-AUTHORITY-CLASS)
    (asserts! (valid-manifest-type manifest-type) ERR-INVALID-MANIFEST-TYPE)
    (asserts! (valid-lifecycle lifecycle) ERR-INVALID-LIFECYCLE)
    (asserts! (valid-target-mode target-mode) ERR-INVALID-TARGET-MODE)
    (asserts! (valid-claimed-verification claimed-verification) ERR-INVALID-VERIFICATION-CLASS)
    (asserts! (core-manifest-exists-and-sealed manifest-id) ERR-CORE-NOT-SEALED)
    (asserts! (is-core-creator manifest-id tx-sender) ERR-UNAUTHORISED)
    (asserts! (core-mime-is-manifest manifest-id) ERR-WRONG-MIME)
    (asserts! (predecessor-edge-ok manifest-id previous-manifest-id) ERR-PARENT-EDGE-MISSING)
    (map-set manifests manifest-id {
      registrar: tx-sender,
      authority-class: authority-class,
      manifest-type: manifest-type,
      lifecycle: lifecycle,
      target-mode: target-mode,
      status: STATUS-ACTIVE,
      schema-id: schema-id,
      schema-version: schema-version,
      manifest-hash: manifest-hash,
      integrity-root: integrity-root,
      scope-root: scope-root,
      item-count: item-count,
      changed-count: changed-count,
      previous-manifest-id: previous-manifest-id,
      superseded-by: none,
      claimed-verification: claimed-verification,
      core-hash-verified: hash-verified,
      current-scope: none,
      created-at: stacks-block-height
    })
    (ok manifest-id)
  )
)

;; R6: a manifest that is current for a scope cannot be withdrawn; replace it
;; via update-scope-manifest first.
(define-public (withdraw-manifest (manifest-id uint))
  (let ((record (unwrap! (map-get? manifests manifest-id) ERR-NOT-REGISTERED)))
    (asserts! (is-eq tx-sender (get registrar record)) ERR-UNAUTHORISED)
    (asserts! (is-none (get current-scope record)) ERR-MANIFEST-IS-CURRENT)
    (map-set manifests manifest-id (merge record { status: STATUS-WITHDRAWN }))
    (ok true)
  )
)

;; Emergency path: revocation is allowed even while current (a compromised or
;; defective manifest must be flaggable immediately). The scope pointer is NOT
;; cleared - the continuity chain is preserved so a successor can be appointed
;; via update-scope-manifest. Resolvers MUST check the status of the current
;; manifest and treat a revoked current manifest as non-authoritative.
(define-public (revoke-manifest (manifest-id uint))
  (let ((record (unwrap! (map-get? manifests manifest-id) ERR-NOT-REGISTERED)))
    (asserts! (or (is-eq tx-sender (get registrar record)) (is-eq tx-sender CONTRACT-OWNER)) ERR-UNAUTHORISED)
    (map-set manifests manifest-id (merge record { status: STATUS-REVOKED }))
    (ok true)
  )
)

;; Manual (non-scope) supersession. R3: requires the core parent edge and the
;; declared predecessor to agree. R6: not allowed while old is current for a
;; scope (use update-scope-manifest).
(define-public (mark-superseded (old-manifest-id uint) (new-manifest-id uint))
  (let (
      (old (unwrap! (map-get? manifests old-manifest-id) ERR-NOT-REGISTERED))
      (new (unwrap! (map-get? manifests new-manifest-id) ERR-NOT-REGISTERED))
    )
    (asserts! (or (is-eq tx-sender (get registrar old)) (is-eq tx-sender CONTRACT-OWNER)) ERR-UNAUTHORISED)
    (asserts! (is-none (get current-scope old)) ERR-MANIFEST-IS-CURRENT)
    (asserts! (is-eq (get status new) STATUS-ACTIVE) ERR-MANIFEST-NOT-ACTIVE)
    (asserts! (is-eq (get previous-manifest-id new) (some old-manifest-id)) ERR-WRONG-PREVIOUS-MANIFEST)
    (asserts! (core-parent-edge new-manifest-id old-manifest-id) ERR-PARENT-EDGE-MISSING)
    (map-set manifests old-manifest-id (merge old { status: STATUS-SUPERSEDED, superseded-by: (some new-manifest-id) }))
    (ok true)
  )
)

;; -----------------------------------------------------------------------------
;; Public functions - scopes and current manifests
;; -----------------------------------------------------------------------------

;; R1: scopes are SELF-CLAIM ONLY - the transaction sender becomes both the
;; immutable key-authority (the principal a derived key is validated against,
;; R11) and the initial operational authority. Assigning a scope to a third
;; party at creation is not allowed; transfer the OPERATIONAL authority
;; afterwards via set-scope-authority (key-authority never changes). For
;; collision-proof keys, use derive-scope-key, which binds the key to the
;; claiming principal.
(define-public (create-scope
    (scope-key (buff 32))
    (authority-class uint)
    (lifecycle uint)
  )
  (begin
    (asserts! (is-none (map-get? scopes scope-key)) ERR-SCOPE-EXISTS)
    (asserts! (valid-authority-class authority-class) ERR-INVALID-AUTHORITY-CLASS)
    (asserts! (valid-lifecycle lifecycle) ERR-INVALID-LIFECYCLE)
    (map-set scopes scope-key {
      key-authority: tx-sender,
      authority: tx-sender,
      authority-class: authority-class,
      lifecycle: lifecycle,
      current-manifest-id: none,
      current-root: none,
      current-count: u0,
      created-at: stacks-block-height,
      updated-at: stacks-block-height,
      active: true
    })
    (ok scope-key)
  )
)

(define-public (set-scope-authority (scope-key (buff 32)) (new-authority principal))
  (let ((scope (unwrap! (map-get? scopes scope-key) ERR-SCOPE-NOT-FOUND)))
    (asserts! (is-eq tx-sender (get authority scope)) ERR-NOT-SCOPE-AUTHORITY)
    (map-set scopes scope-key (merge scope { authority: new-authority, updated-at: stacks-block-height }))
    (ok true)
  )
)

(define-public (add-scope-delegate (scope-key (buff 32)) (delegate principal))
  (let ((scope (unwrap! (map-get? scopes scope-key) ERR-SCOPE-NOT-FOUND)))
    (asserts! (get active scope) ERR-SCOPE-NOT-FOUND)
    (asserts! (is-eq tx-sender (get authority scope)) ERR-NOT-SCOPE-AUTHORITY)
    (map-set scope-delegates { scope-key: scope-key, delegate: delegate } {
      added-by: tx-sender,
      added-at: stacks-block-height,
      active: true
    })
    (ok true)
  )
)

(define-public (remove-scope-delegate (scope-key (buff 32)) (delegate principal))
  (let (
      (scope (unwrap! (map-get? scopes scope-key) ERR-SCOPE-NOT-FOUND))
      (entry (unwrap! (map-get? scope-delegates { scope-key: scope-key, delegate: delegate }) ERR-NOT-DELEGATE))
    )
    (asserts! (is-eq tx-sender (get authority scope)) ERR-NOT-SCOPE-AUTHORITY)
    (map-set scope-delegates { scope-key: scope-key, delegate: delegate } (merge entry { active: false }))
    (ok true)
  )
)

;; R5: the root/count committed at registration are read from the record;
;; they are no longer caller arguments.
(define-public (register-initial-scope-manifest
    (scope-key (buff 32))
    (manifest-id uint)
  )
  (let (
      (scope (unwrap! (map-get? scopes scope-key) ERR-SCOPE-NOT-FOUND))
      (record (unwrap! (map-get? manifests manifest-id) ERR-NOT-REGISTERED))
    )
    (asserts! (get active scope) ERR-SCOPE-NOT-FOUND)
    (asserts! (is-eq tx-sender (get authority scope)) ERR-NOT-SCOPE-AUTHORITY)
    (asserts! (is-none (get current-manifest-id scope)) ERR-WRONG-PREVIOUS-MANIFEST)
    (asserts! (is-eq (get status record) STATUS-ACTIVE) ERR-MANIFEST-NOT-ACTIVE)
    (asserts! (is-none (get current-scope record)) ERR-MANIFEST-IS-CURRENT)
    (asserts! (matches-scope-policy record scope) ERR-SCOPE-POLICY-MISMATCH)
    (asserts! (created-by-authority-or-delegate scope-key manifest-id (get authority scope)) ERR-UNAUTHORISED)
    (map-set manifests manifest-id (merge record { current-scope: (some scope-key) }))
    (map-set scopes scope-key (merge scope {
      current-manifest-id: (some manifest-id),
      current-root: (get scope-root record),
      current-count: (get item-count record),
      updated-at: stacks-block-height
    }))
    (ok manifest-id)
  )
)

;; Scope succession. Enforces:
;;  - sender is scope authority
;;  - old manifest is the scope's current manifest
;;  - new manifest is registered, active, matches scope policy (R4), keeps the
;;    same manifest-type as the old current manifest (R4)
;;  - new manifest declared old as predecessor at registration (R5: immutable)
;;  - the core parent edge new->old exists (R3, XIP-001 s6)
;;  - new manifest's core creator is the authority or an active delegate
;;  - scope pointer and commitments advance atomically from the values
;;    committed at registration (R5)
(define-public (update-scope-manifest
    (scope-key (buff 32))
    (previous-manifest-id uint)
    (new-manifest-id uint)
  )
  (let (
      (scope (unwrap! (map-get? scopes scope-key) ERR-SCOPE-NOT-FOUND))
      (old (unwrap! (map-get? manifests previous-manifest-id) ERR-NOT-REGISTERED))
      (new (unwrap! (map-get? manifests new-manifest-id) ERR-NOT-REGISTERED))
    )
    (asserts! (get active scope) ERR-SCOPE-NOT-FOUND)
    (asserts! (is-eq tx-sender (get authority scope)) ERR-NOT-SCOPE-AUTHORITY)
    (asserts! (is-eq (get current-manifest-id scope) (some previous-manifest-id)) ERR-WRONG-PREVIOUS-MANIFEST)
    (asserts! (is-eq (get status new) STATUS-ACTIVE) ERR-MANIFEST-NOT-ACTIVE)
    (asserts! (is-none (get current-scope new)) ERR-MANIFEST-IS-CURRENT)
    (asserts! (matches-scope-policy new scope) ERR-SCOPE-POLICY-MISMATCH)
    (asserts! (is-eq (get manifest-type new) (get manifest-type old)) ERR-SCOPE-POLICY-MISMATCH)
    (asserts! (is-eq (get previous-manifest-id new) (some previous-manifest-id)) ERR-WRONG-PREVIOUS-MANIFEST)
    (asserts! (core-parent-edge new-manifest-id previous-manifest-id) ERR-PARENT-EDGE-MISSING)
    (asserts! (created-by-authority-or-delegate scope-key new-manifest-id (get authority scope)) ERR-UNAUTHORISED)

    ;; Mark previous as superseded, release its current-scope marker.
    (map-set manifests previous-manifest-id (merge old {
      status: STATUS-SUPERSEDED,
      superseded-by: (some new-manifest-id),
      current-scope: none
    }))

    ;; Mark new as current for the scope. Its commitments are NOT modified.
    (map-set manifests new-manifest-id (merge new { current-scope: (some scope-key) }))

    ;; Atomically advance the scope pointer from the registered commitments.
    (map-set scopes scope-key (merge scope {
      current-manifest-id: (some new-manifest-id),
      current-root: (get scope-root new),
      current-count: (get item-count new),
      updated-at: stacks-block-height
    }))

    (ok new-manifest-id)
  )
)

;; -----------------------------------------------------------------------------
;; Optional explicit target links for small manifests
;; -----------------------------------------------------------------------------

(define-public (add-manifest-target
    (manifest-id uint)
    (target-id uint)
    (claimed-verified bool)
    (claimed-verification uint)
  )
  (let ((record (unwrap! (map-get? manifests manifest-id) ERR-NOT-REGISTERED)))
    (asserts! (is-eq tx-sender (get registrar record)) ERR-UNAUTHORISED)
    (asserts! (valid-claimed-verification claimed-verification) ERR-INVALID-VERIFICATION-CLASS)
    (asserts! (core-inscription-exists target-id) ERR-TARGET-NOT-IN-CORE)
    (map-set manifest-targets { manifest-id: manifest-id, target-id: target-id } {
      added-by: tx-sender,
      added-at: stacks-block-height,
      core-exists: true,
      claimed-verified: claimed-verified,
      claimed-verification: claimed-verification
    })
    (ok true)
  )
)

;; -----------------------------------------------------------------------------
;; Read-only functions
;; -----------------------------------------------------------------------------

;; Collision-proof scope key derivation (R1/R11): binds the key to the
;; CREATING principal. Resolvers recompute the key off-chain from
;; (key-authority, label) - the scope's immutable key-authority field, NOT the
;; transferable operational authority - so authority transfer does not
;; invalidate derived scope identity.
(define-read-only (derive-scope-key (authority principal) (label (buff 32)))
  (sha256 (concat (unwrap-panic (to-consensus-buff? authority)) label))
)

(define-read-only (get-manifest-record (manifest-id uint))
  (map-get? manifests manifest-id)
)

(define-read-only (get-scope (scope-key (buff 32)))
  (map-get? scopes scope-key)
)

(define-read-only (get-current-manifest (scope-key (buff 32)))
  (match (map-get? scopes scope-key)
    scope (get current-manifest-id scope)
    none
  )
)

;; Returns the current manifest id only when its record is still ACTIVE.
;; Resolvers SHOULD prefer this over get-current-manifest (a revoked manifest
;; can remain the structural chain head - see revoke-manifest).
(define-read-only (get-current-active-manifest (scope-key (buff 32)))
  (match (get-current-manifest scope-key)
    id (if (is-active-manifest id) (some id) none)
    none
  )
)

(define-read-only (get-manifest-target (manifest-id uint) (target-id uint))
  (map-get? manifest-targets { manifest-id: manifest-id, target-id: target-id })
)

(define-read-only (is-manifest-registered (manifest-id uint))
  (is-some (map-get? manifests manifest-id))
)

(define-read-only (get-scope-delegate (scope-key (buff 32)) (delegate principal))
  (map-get? scope-delegates { scope-key: scope-key, delegate: delegate })
)

(define-read-only (is-active-scope-delegate (scope-key (buff 32)) (delegate principal))
  (is-scope-delegate scope-key delegate)
)

(define-read-only (is-current-for-scope (scope-key (buff 32)) (manifest-id uint))
  (match (map-get? scopes scope-key)
    scope (is-eq (get current-manifest-id scope) (some manifest-id))
    false
  )
)
