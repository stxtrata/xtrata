;; xtrata-manifest-authority-v1.clar
;; Draft helper contract for registering XIP-001 manifest inscriptions.
;;
;; STATUS: v1 RELEASE CANDIDATE - Clarity 4 - core checks wired to xtrata-v3-2-3
;; NOT AUDITED. Pin in Clarinet.toml: clarity_version = 4, epoch = 3.3.
;; (Clarinet/clarity-vm requires epoch 3.3 for Clarity 4 contracts.)
;;
;; VERIFIED: compiles as Clarity 4 against the live xtrata-v3-2-3 source in
;; Clarinet simnet; 22-test smoke suite passes (registration, hash verification,
;; scope creation, delegate add/remove, succession, predecessor mismatch,
;; authority gates). See tests/smoke.mjs.
;;
;; Clarity version notes:
;; - Uses stacks-block-height (block-height removed in Clarity 3+).
;; - Targets Clarity 4 (SIP-033/034, activated Nov 2025) for forward
;;   compatibility with contract-hash? (future contract-principal scope
;;   authorities) and to-ascii? (future manifest generation helpers).
;;   No Clarity-4-only builtins are required by this contract itself, so it
;;   also compiles as Clarity 3 if a conservative deployment is preferred.
;;
;; This draft intentionally does not parse manifest JSON on-chain.
;; It records compact authority, scope, lifecycle and root commitments.
;;
;; Before deployment, review the exact read-only interface exposed by
;; xtrata-v3-2-3 and wire real existence/sealed/creator/owner checks where marked.

;; -----------------------------------------------------------------------------
;; Constants
;; -----------------------------------------------------------------------------

(define-constant CONTRACT-OWNER tx-sender)

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

;; Verification classes
(define-constant VERIFY-NONE u0)
(define-constant VERIFY-UNVERIFIED-CLAIM u1)
(define-constant VERIFY-VERIFIED-AT-REGISTRATION u2)
(define-constant VERIFY-PARTIAL u3)

;; -----------------------------------------------------------------------------
;; Data maps
;; -----------------------------------------------------------------------------

;; Primary manifest record. Keyed by the manifest inscription id.
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
    verification-class: uint,
    verification-block: (optional uint),
    created-at: uint
  }
)

;; Scope records. scope-key is a compact hash/key chosen by the profile.
;; For example sha256("xip-corpus") at the app layer, or another XIP-defined key.
(define-map scopes
  (buff 32)
  {
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
;; scope authority advances the current pointer. This gives
;; AUTH-DELEGATED-AUTHORITY real on-chain meaning: a manifest whose core
;; creator is a registered delegate of the scope is acceptable for succession.
(define-map scope-delegates
  { scope-key: (buff 32), delegate: principal }
  {
    added-by: principal,
    added-at: uint,
    active: bool
  }
)

;; Optional explicit registration of small target links.
;; Large lists should live in XIP-001 manifest JSON and be committed by roots.
(define-map manifest-targets
  { manifest-id: uint, target-id: uint }
  {
    added-by: principal,
    added-at: uint,
    verified: bool,
    verification-class: uint
  }
)

;; -----------------------------------------------------------------------------
;; Validation helpers
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

(define-private (is-active-manifest (manifest-id uint))
  (match (map-get? manifests manifest-id)
    record (is-eq (get status record) STATUS-ACTIVE)
    false
  )
)

;; -----------------------------------------------------------------------------
;; v3.2.3 core integration (wired)
;;
;; NOTE: `.xtrata-v3-2-3` must match the contract name as deployed under the
;; SAME deployer as this helper. If the core lives under a different deployer,
;; replace with the fully qualified principal, e.g.
;;   'SPXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.xtrata-v3-2-3
;; The live source header says "xtrata-v3.2.3"; Clarity contract names cannot
;; contain dots, so confirm the on-chain name (likely xtrata-v3-2-3) before
;; deployment.
;; -----------------------------------------------------------------------------

;; True only when the inscription exists in core AND is sealed.
;; Core's is-inscription-sealed returns (optional bool):
;;   none        -> no InscriptionMeta (not minted / unknown id)
;;   (some bool) -> sealed flag
(define-private (core-manifest-exists-and-sealed (manifest-id uint))
  (match (contract-call? .xtrata-v3-2-3 is-inscription-sealed manifest-id)
    sealed sealed
    false
  )
)

;; If the registrar supplied a manifest-hash, it must equal the core's
;; recorded final-hash for the inscription. (none) skips the check.
(define-private (core-hash-matches (manifest-id uint) (claimed (optional (buff 32))))
  (match claimed
    h (match (contract-call? .xtrata-v3-2-3 get-inscription-hash manifest-id)
        core-hash (is-eq core-hash h)
        false
      )
    true
  )
)

;; True when `who` is an active registered delegate for the scope.
(define-private (is-scope-delegate (scope-key (buff 32)) (who principal))
  (match (map-get? scope-delegates { scope-key: scope-key, delegate: who })
    entry (get active entry)
    false
  )
)

;; The acceptable-creator rule for scope succession:
;; the core creator of the manifest inscription must be the scope authority
;; itself OR an active delegate of the scope.
(define-private (created-by-authority-or-delegate (scope-key (buff 32)) (manifest-id uint) (authority principal))
  (match (contract-call? .xtrata-v3-2-3 get-inscription-creator manifest-id)
    creator (or (is-eq creator authority) (is-scope-delegate scope-key creator))
    false
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
    (verification-class uint)
  )
  (begin
    (asserts! (is-none (map-get? manifests manifest-id)) ERR-ALREADY-REGISTERED)
    (asserts! (valid-authority-class authority-class) ERR-INVALID-AUTHORITY-CLASS)
    (asserts! (valid-manifest-type manifest-type) ERR-INVALID-MANIFEST-TYPE)
    (asserts! (valid-lifecycle lifecycle) ERR-INVALID-LIFECYCLE)
    (asserts! (valid-target-mode target-mode) ERR-INVALID-TARGET-MODE)
    (asserts! (core-manifest-exists-and-sealed manifest-id) ERR-CORE-NOT-SEALED)
    (asserts! (core-hash-matches manifest-id manifest-hash) ERR-HASH-MISMATCH)
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
      verification-class: verification-class,
      verification-block: (if (> verification-class VERIFY-UNVERIFIED-CLAIM) (some stacks-block-height) none),
      created-at: stacks-block-height
    })
    (ok manifest-id)
  )
)

(define-public (withdraw-manifest (manifest-id uint))
  (let ((record (unwrap! (map-get? manifests manifest-id) ERR-NOT-REGISTERED)))
    (asserts! (is-eq tx-sender (get registrar record)) ERR-UNAUTHORISED)
    (map-set manifests manifest-id (merge record { status: STATUS-WITHDRAWN }))
    (ok true)
  )
)

(define-public (revoke-manifest (manifest-id uint))
  (let ((record (unwrap! (map-get? manifests manifest-id) ERR-NOT-REGISTERED)))
    ;; Current draft allows only the original registrar or contract owner.
    ;; Consider whether scope authorities should also be able to revoke scope manifests.
    (asserts! (or (is-eq tx-sender (get registrar record)) (is-eq tx-sender CONTRACT-OWNER)) ERR-UNAUTHORISED)
    (map-set manifests manifest-id (merge record { status: STATUS-REVOKED }))
    (ok true)
  )
)

(define-public (mark-superseded (old-manifest-id uint) (new-manifest-id uint))
  (let (
      (old (unwrap! (map-get? manifests old-manifest-id) ERR-NOT-REGISTERED))
      (new (unwrap! (map-get? manifests new-manifest-id) ERR-NOT-REGISTERED))
    )
    (asserts! (or (is-eq tx-sender (get registrar old)) (is-eq tx-sender CONTRACT-OWNER)) ERR-UNAUTHORISED)
    (asserts! (is-eq (get status new) STATUS-ACTIVE) ERR-MANIFEST-NOT-ACTIVE)
    (map-set manifests old-manifest-id (merge old { status: STATUS-SUPERSEDED, superseded-by: (some new-manifest-id) }))
    (ok true)
  )
)

;; -----------------------------------------------------------------------------
;; Public functions - scopes and current manifests
;; -----------------------------------------------------------------------------

(define-public (create-scope
    (scope-key (buff 32))
    (authority principal)
    (authority-class uint)
    (lifecycle uint)
  )
  (begin
    (asserts! (is-none (map-get? scopes scope-key)) ERR-SCOPE-EXISTS)
    (asserts! (valid-authority-class authority-class) ERR-INVALID-AUTHORITY-CLASS)
    (asserts! (valid-lifecycle lifecycle) ERR-INVALID-LIFECYCLE)
    (map-set scopes scope-key {
      authority: authority,
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

(define-public (register-initial-scope-manifest
    (scope-key (buff 32))
    (manifest-id uint)
    (root (optional (buff 32)))
    (item-count uint)
  )
  (let (
      (scope (unwrap! (map-get? scopes scope-key) ERR-SCOPE-NOT-FOUND))
      (record (unwrap! (map-get? manifests manifest-id) ERR-NOT-REGISTERED))
    )
    (asserts! (get active scope) ERR-SCOPE-NOT-FOUND)
    (asserts! (is-eq tx-sender (get authority scope)) ERR-NOT-SCOPE-AUTHORITY)
    (asserts! (is-none (get current-manifest-id scope)) ERR-WRONG-PREVIOUS-MANIFEST)
    (asserts! (is-eq (get status record) STATUS-ACTIVE) ERR-MANIFEST-NOT-ACTIVE)
    (asserts! (created-by-authority-or-delegate scope-key manifest-id (get authority scope)) ERR-UNAUTHORISED)
    (map-set scopes scope-key (merge scope {
      current-manifest-id: (some manifest-id),
      current-root: root,
      current-count: item-count,
      updated-at: stacks-block-height
    }))
    (ok manifest-id)
  )
)

(define-public (update-scope-manifest
    (scope-key (buff 32))
    (previous-manifest-id uint)
    (new-manifest-id uint)
    (new-root (optional (buff 32)))
    (new-item-count uint)
    (changed-count uint)
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
    (asserts! (is-eq (get previous-manifest-id new) (some previous-manifest-id)) ERR-WRONG-PREVIOUS-MANIFEST)
    (asserts! (created-by-authority-or-delegate scope-key new-manifest-id (get authority scope)) ERR-UNAUTHORISED)

    ;; Mark previous as superseded and point it at the new manifest.
    (map-set manifests previous-manifest-id (merge old {
      status: STATUS-SUPERSEDED,
      superseded-by: (some new-manifest-id)
    }))

    ;; Store changed-count on the new record for resolver/indexer convenience.
    (map-set manifests new-manifest-id (merge new {
      changed-count: changed-count,
      scope-root: new-root,
      item-count: new-item-count
    }))

    ;; Atomically advance the scope current pointer.
    (map-set scopes scope-key (merge scope {
      current-manifest-id: (some new-manifest-id),
      current-root: new-root,
      current-count: new-item-count,
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
    (verified bool)
    (verification-class uint)
  )
  (let ((record (unwrap! (map-get? manifests manifest-id) ERR-NOT-REGISTERED)))
    (asserts! (is-eq tx-sender (get registrar record)) ERR-UNAUTHORISED)
    (map-set manifest-targets { manifest-id: manifest-id, target-id: target-id } {
      added-by: tx-sender,
      added-at: stacks-block-height,
      verified: verified,
      verification-class: verification-class
    })
    (ok true)
  )
)

;; -----------------------------------------------------------------------------
;; Read-only functions
;; -----------------------------------------------------------------------------

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
