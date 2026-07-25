;; xtrata-collection-v3
;; Collection coordinator for the Xtrata inscription core (xtrata-v3.2.3 line).
;; Clarity 3 template contract: one instance deployed per collection.
;;
;; Responsibilities (architecture 01-ARCHITECTURE.md sections 3 + 5):
;; - Collection identity/metadata (settable until finalize).
;; - Roles: owner (two-step transfer), operator-admin, finance-admin.
;; - Supply modes: fixed / open / capped-closable; minted+reserved <= max when max>0.
;; - Reservations (Sessions) with dense pre-assigned indexes recycled via a free-list.
;; - Mint lifecycle proxying the core: begin / chunk batches / seal (+ batch,
;;   + native small single-tx paths), payment via splits at seal only.
;; - Phases / allowlists / wallet limits (v1.4-proven machinery).
;; - Drop assignment ledger gated by a drops-authority principal.
;; - Pause / finalize.
;;
;; Duplicate detection: the v3.2.3 core allows duplicate content, so the
;; collection-level HashIndex map (written at reserve time) is the sole dedupe.
;;
;; Error codes:
;;   u100 ERR-NOT-AUTHORIZED            caller lacks the required role
;;   u101 ERR-PAUSED                    mint entrypoints blocked while paused
;;   u102 ERR-FINALIZED                 config/mint action after finalize
;;   u103 ERR-NOT-FOUND                 session/item/assignment missing
;;   u104 ERR-MAX-SUPPLY                supply exhausted (minted+reserved >= max)
;;   u105 ERR-DUPLICATE-HASH            hash already reserved/minted in collection
;;   u106 ERR-ALREADY-RESERVED          caller already holds a session for hash
;;   u107 ERR-INVALID-BATCH             bad batch shape/size/validation
;;   u108 ERR-INVALID-PHASE             unknown/invalid phase id or bounds
;;   u109 ERR-PHASE-NOT-ACTIVE          phase disabled or outside schedule
;;   u110 ERR-PHASE-CAP                 per-phase supply cap reached
;;   u111 ERR-WALLET-LIMIT              global/phase per-wallet limit reached
;;   u112 ERR-NOT-ALLOWLISTED           wallet not on required allowlist
;;   u113 ERR-INVALID-ALLOWLIST-MODE    mode not in {inherit,public,global,phase}
;;   u114 ERR-INVALID-BPS               splits sum exceeds 10000 bps
;;   u115 ERR-INVALID-CORE-CONTRACT     trait arg is not the pinned core
;;   u116 ERR-PENDING-OWNER             invalid ownership-transfer initiation
;;   u117 ERR-NO-PENDING-OWNER          accept without a pending transfer
;;   u118 ERR-RESERVATION-NOT-EXPIRED   permissionless release before expiry
;;   u119 ERR-NOT-FINALIZABLE           finalize preconditions unmet
;;   u120 ERR-ALREADY-SET               one-shot config already set
;;   u121 ERR-INVALID-SUPPLY-MODE       bad supply mode / close-supply misuse
;;   u122 ERR-ALREADY-ASSIGNED          item already assigned to a drop
;;   u123 ERR-ASSIGNMENT-MISMATCH       unassign with wrong drop/authority
;;   u124 ERR-DEFAULT-DEPENDENCIES-BATCH explicit deps while defaults configured
;;   u125 ERR-NOT-MINTED                assignment target index not minted

(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-PAUSED (err u101))
(define-constant ERR-FINALIZED (err u102))
(define-constant ERR-NOT-FOUND (err u103))
(define-constant ERR-MAX-SUPPLY (err u104))
(define-constant ERR-DUPLICATE-HASH (err u105))
(define-constant ERR-ALREADY-RESERVED (err u106))
(define-constant ERR-INVALID-BATCH (err u107))
(define-constant ERR-INVALID-PHASE (err u108))
(define-constant ERR-PHASE-NOT-ACTIVE (err u109))
(define-constant ERR-PHASE-CAP (err u110))
(define-constant ERR-WALLET-LIMIT (err u111))
(define-constant ERR-NOT-ALLOWLISTED (err u112))
(define-constant ERR-INVALID-ALLOWLIST-MODE (err u113))
(define-constant ERR-INVALID-BPS (err u114))
(define-constant ERR-INVALID-CORE-CONTRACT (err u115))
(define-constant ERR-PENDING-OWNER (err u116))
(define-constant ERR-NO-PENDING-OWNER (err u117))
(define-constant ERR-RESERVATION-NOT-EXPIRED (err u118))
(define-constant ERR-NOT-FINALIZABLE (err u119))
(define-constant ERR-ALREADY-SET (err u120))
(define-constant ERR-INVALID-SUPPLY-MODE (err u121))
(define-constant ERR-ALREADY-ASSIGNED (err u122))
(define-constant ERR-ASSIGNMENT-MISMATCH (err u123))
(define-constant ERR-DEFAULT-DEPENDENCIES-BATCH (err u124))
(define-constant ERR-NOT-MINTED (err u125))

(define-constant BASIS-POINTS u10000)
(define-constant DEFAULT-TOKEN-URI "data:text/plain,xtrata-collection-default")
(define-constant SMALL-MINT-CHUNK-SIZE u16384)
(define-constant MAX-SMALL-MINT-CHUNKS u32)

(define-constant ALLOWLIST-INHERIT u0)
(define-constant ALLOWLIST-PUBLIC u1)
(define-constant ALLOWLIST-GLOBAL u2)
(define-constant ALLOWLIST-PHASE u3)

(define-constant MODE-FIXED u1)
(define-constant MODE-OPEN u2)
(define-constant MODE-CAPPED-CLOSABLE u3)

(define-constant ITER-50 (list
  u0 u1 u2 u3 u4 u5 u6 u7 u8 u9
  u10 u11 u12 u13 u14 u15 u16 u17 u18 u19
  u20 u21 u22 u23 u24 u25 u26 u27 u28 u29
  u30 u31 u32 u33 u34 u35 u36 u37 u38 u39
  u40 u41 u42 u43 u44 u45 u46 u47 u48 u49
))

;; XTRATA-CORE-TEMPLATE-LINE (deploy templater substitutes the line below)
;; Mainnet: (define-constant ALLOWED-XTRATA-CONTRACT 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3)
(define-constant ALLOWED-XTRATA-CONTRACT .mock-xtrata-core)

(define-trait xtrata-core-trait
  (
    (begin-inscription ((buff 32) (string-ascii 64) uint uint) (response bool uint))
    (begin-or-get ((buff 32) (string-ascii 64) uint uint) (response (optional uint) uint))
    (add-chunk-batch ((buff 32) (list 32 (buff 16384))) (response bool uint))
    (seal-inscription ((buff 32) (string-ascii 256)) (response uint uint))
    (seal-inscription-batch ((list 50 { hash: (buff 32), token-uri: (string-ascii 256) })) (response { start: uint, count: uint } uint))
    (seal-recursive ((buff 32) (string-ascii 256) (list 50 uint)) (response uint uint))
    (mint-single-tx ((buff 32) (string-ascii 64) uint (list 32 (buff 16384)) (string-ascii 256)) (response { token-id: uint, existed: bool } uint))
    (mint-single-tx-recursive ((buff 32) (string-ascii 64) uint (list 32 (buff 16384)) (string-ascii 256) (list 50 uint)) (response { token-id: uint, existed: bool } uint))
    (transfer (uint principal principal) (response bool uint))
  )
)

;; --- roles + lifecycle vars ---

(define-data-var contract-owner principal tx-sender)
(define-data-var pending-owner (optional principal) none)
(define-data-var operator-admin principal tx-sender)
(define-data-var finance-admin principal tx-sender)

(define-data-var paused bool true)
(define-data-var finalized bool false)

(define-data-var supply-mode uint MODE-OPEN)
(define-data-var max-supply uint u0)
(define-data-var reserved-count uint u0)
(define-data-var minted-count uint u0)
(define-data-var next-index uint u0)
(define-data-var free-count uint u0)

(define-data-var reservation-expiry-blocks uint u1440)
(define-data-var active-phase-id uint u0)
(define-data-var mint-price uint u0)
(define-data-var max-per-wallet uint u0)
(define-data-var allowlist-enabled bool false)

(define-data-var collection-name (string-ascii 64) "")
(define-data-var collection-symbol (string-ascii 16) "")
(define-data-var collection-description (string-ascii 256) "")
(define-data-var artwork-uri (string-ascii 256) "")
(define-data-var base-uri (string-ascii 256) "")
(define-data-var default-token-uri (string-ascii 256) DEFAULT-TOKEN-URI)
(define-data-var default-dependencies (list 50 uint) (list))

(define-data-var artist-recipient principal tx-sender)
(define-data-var marketplace-recipient principal tx-sender)
(define-data-var operator-recipient principal tx-sender)
(define-data-var artist-bps uint u0)
(define-data-var marketplace-bps uint u0)
(define-data-var operator-bps uint u0)

(define-data-var drops-authority (optional principal) none)

;; --- maps ---

(define-map Sessions
  { owner: principal, hash: (buff 32) }
  {
    index: uint,
    phase-id: uint,
    price: uint,
    created-at: uint,
    item-uri: (optional (string-ascii 256))
  }
)
(define-map Items
  { index: uint }
  {
    token-id: uint,
    owner-at-mint: principal,
    phase-id: uint,
    minted-at: uint,
    content-hash: (buff 32)
  }
)
(define-map HashIndex { hash: (buff 32) } { index: uint })
(define-map FreeIndexes { slot: uint } uint)
(define-map Assignments
  { index: uint }
  { drop-contract: principal, drop-id: uint, assigned-at: uint }
)
(define-map RegisteredTokenUris { hash: (buff 32) } { token-uri: (string-ascii 256) })

(define-map Phases
  { phase-id: uint }
  {
    enabled: bool,
    start-block: uint,
    end-block: uint,
    mint-price: uint,
    max-per-wallet: uint,
    max-supply: uint,
    allowlist-mode: uint
  }
)
(define-map PhaseStats { phase-id: uint } { minted: uint, reserved: uint })
(define-map Allowlist { owner: principal } { allowance: uint })
(define-map PhaseAllowlist { phase-id: uint, owner: principal } { allowance: uint })
(define-map WalletStats { owner: principal } { minted: uint, reserved: uint })
(define-map PhaseWalletStats { phase-id: uint, owner: principal } { minted: uint, reserved: uint })

;; --- role assertions ---

(define-private (assert-owner)
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (ok true)
  )
)

(define-private (assert-config-admin)
  (begin
    (asserts!
      (or
        (is-eq tx-sender (var-get contract-owner))
        (is-eq tx-sender (var-get operator-admin))
      )
      ERR-NOT-AUTHORIZED
    )
    (ok true)
  )
)

(define-private (assert-finance-admin)
  (begin
    (asserts!
      (or
        (is-eq tx-sender (var-get contract-owner))
        (is-eq tx-sender (var-get finance-admin))
      )
      ERR-NOT-AUTHORIZED
    )
    (ok true)
  )
)

(define-private (assert-drops-authority)
  (begin
    (asserts! (is-eq (some contract-caller) (var-get drops-authority)) ERR-NOT-AUTHORIZED)
    (ok true)
  )
)

(define-private (assert-not-paused)
  (begin
    (asserts! (not (var-get paused)) ERR-PAUSED)
    (ok true)
  )
)

(define-private (assert-not-finalized)
  (begin
    (asserts! (not (var-get finalized)) ERR-FINALIZED)
    (ok true)
  )
)

(define-private (assert-core-contract (xtrata-contract <xtrata-core-trait>))
  (begin
    (asserts!
      (is-eq (contract-of xtrata-contract) ALLOWED-XTRATA-CONTRACT)
      ERR-INVALID-CORE-CONTRACT
    )
    (ok true)
  )
)

;; --- free-list / dense index allocation (section 3.1) ---

(define-private (alloc-index)
  (let ((fc (var-get free-count)))
    (if (> fc u0)
      (let ((idx (unwrap-panic (map-get? FreeIndexes { slot: (- fc u1) }))))
        (map-delete FreeIndexes { slot: (- fc u1) })
        (var-set free-count (- fc u1))
        idx
      )
      (let ((idx (var-get next-index)))
        (var-set next-index (+ idx u1))
        idx
      )
    )
  )
)

(define-private (push-free-index (idx uint))
  (let ((fc (var-get free-count)))
    (map-set FreeIndexes { slot: fc } idx)
    (var-set free-count (+ fc u1))
    true
  )
)

;; --- wallet/phase stats helpers (v1.4-proven) ---

(define-private (get-wallet-stats-internal (owner principal))
  (default-to { minted: u0, reserved: u0 } (map-get? WalletStats { owner: owner }))
)

(define-private (get-phase-wallet-stats-internal (phase-id uint) (owner principal))
  (default-to
    { minted: u0, reserved: u0 }
    (map-get? PhaseWalletStats { phase-id: phase-id, owner: owner })
  )
)

(define-private (get-phase-stats-internal (phase-id uint))
  (default-to { minted: u0, reserved: u0 } (map-get? PhaseStats { phase-id: phase-id }))
)

(define-private (is-valid-allowlist-mode (mode uint))
  (or
    (is-eq mode ALLOWLIST-INHERIT)
    (is-eq mode ALLOWLIST-PUBLIC)
    (is-eq mode ALLOWLIST-GLOBAL)
    (is-eq mode ALLOWLIST-PHASE)
  )
)

(define-private (get-phase-or-err (phase-id uint))
  (match (map-get? Phases { phase-id: phase-id })
    phase (ok phase)
    ERR-INVALID-PHASE
  )
)

(define-private (assert-phase-active (phase-id uint))
  (let ((phase (try! (get-phase-or-err phase-id))))
    (begin
      (asserts! (get enabled phase) ERR-PHASE-NOT-ACTIVE)
      (asserts!
        (or
          (is-eq (get start-block phase) u0)
          (>= stacks-block-height (get start-block phase))
        )
        ERR-PHASE-NOT-ACTIVE
      )
      (asserts!
        (or
          (is-eq (get end-block phase) u0)
          (<= stacks-block-height (get end-block phase))
        )
        ERR-PHASE-NOT-ACTIVE
      )
      (ok phase)
    )
  )
)

(define-private (check-wallet-limit (owner principal))
  (let (
    (stats (get-wallet-stats-internal owner))
    (active (+ (get minted stats) (get reserved stats)))
    (limit (var-get max-per-wallet))
  )
    (if (and (> limit u0) (>= active limit))
      ERR-WALLET-LIMIT
      (ok true)
    )
  )
)

(define-private (check-phase-wallet-limit (owner principal) (phase-id uint) (limit uint))
  (if (> limit u0)
    (let (
      (stats (get-phase-wallet-stats-internal phase-id owner))
      (active (+ (get minted stats) (get reserved stats)))
    )
      (if (>= active limit)
        ERR-WALLET-LIMIT
        (ok true)
      )
    )
    (ok true)
  )
)

(define-private (check-phase-cap (phase-id uint) (limit uint))
  (if (> limit u0)
    (let (
      (stats (get-phase-stats-internal phase-id))
      (active (+ (get minted stats) (get reserved stats)))
    )
      (if (>= active limit)
        ERR-PHASE-CAP
        (ok true)
      )
    )
    (ok true)
  )
)

(define-private (check-global-allowlist (owner principal))
  (match (map-get? Allowlist { owner: owner })
    entry (let (
      (stats (get-wallet-stats-internal owner))
      (active (+ (get minted stats) (get reserved stats)))
    )
      (if (>= active (get allowance entry))
        ERR-WALLET-LIMIT
        (ok true)
      )
    )
    ERR-NOT-ALLOWLISTED
  )
)

(define-private (check-phase-allowlist (owner principal) (phase-id uint))
  (match (map-get? PhaseAllowlist { phase-id: phase-id, owner: owner })
    entry (let (
      (stats (get-phase-wallet-stats-internal phase-id owner))
      (active (+ (get minted stats) (get reserved stats)))
    )
      (if (>= active (get allowance entry))
        ERR-WALLET-LIMIT
        (ok true)
      )
    )
    ERR-NOT-ALLOWLISTED
  )
)

(define-private (check-allowlist (owner principal) (phase-id uint) (mode uint))
  (if (is-valid-allowlist-mode mode)
    (if (is-eq mode ALLOWLIST-PUBLIC)
      (ok true)
      (if (is-eq mode ALLOWLIST-GLOBAL)
        (check-global-allowlist owner)
        (if (is-eq mode ALLOWLIST-PHASE)
          (check-phase-allowlist owner phase-id)
          (if (var-get allowlist-enabled)
            (check-global-allowlist owner)
            (ok true)
          )
        )
      )
    )
    ERR-INVALID-ALLOWLIST-MODE
  )
)

(define-private (record-phase-reservation (phase-id uint) (owner principal))
  (if (> phase-id u0)
    (let (
      (phase-stats (get-phase-stats-internal phase-id))
      (wallet-stats (get-phase-wallet-stats-internal phase-id owner))
    )
      (begin
        (map-set PhaseStats { phase-id: phase-id }
          { minted: (get minted phase-stats), reserved: (+ (get reserved phase-stats) u1) })
        (map-set PhaseWalletStats { phase-id: phase-id, owner: owner }
          { minted: (get minted wallet-stats), reserved: (+ (get reserved wallet-stats) u1) })
        true
      )
    )
    true
  )
)

(define-private (release-phase-reservation (phase-id uint) (owner principal))
  (if (> phase-id u0)
    (let (
      (phase-stats (get-phase-stats-internal phase-id))
      (wallet-stats (get-phase-wallet-stats-internal phase-id owner))
      (next-phase-res (if (> (get reserved phase-stats) u0) (- (get reserved phase-stats) u1) u0))
      (next-wallet-res (if (> (get reserved wallet-stats) u0) (- (get reserved wallet-stats) u1) u0))
    )
      (begin
        (map-set PhaseStats { phase-id: phase-id }
          { minted: (get minted phase-stats), reserved: next-phase-res })
        (map-set PhaseWalletStats { phase-id: phase-id, owner: owner }
          { minted: (get minted wallet-stats), reserved: next-wallet-res })
        true
      )
    )
    true
  )
)

(define-private (record-phase-mint (phase-id uint) (owner principal))
  (if (> phase-id u0)
    (let (
      (phase-stats (get-phase-stats-internal phase-id))
      (wallet-stats (get-phase-wallet-stats-internal phase-id owner))
      (next-phase-res (if (> (get reserved phase-stats) u0) (- (get reserved phase-stats) u1) u0))
      (next-wallet-res (if (> (get reserved wallet-stats) u0) (- (get reserved wallet-stats) u1) u0))
    )
      (begin
        (map-set PhaseStats { phase-id: phase-id }
          { minted: (+ (get minted phase-stats) u1), reserved: next-phase-res })
        (map-set PhaseWalletStats { phase-id: phase-id, owner: owner }
          { minted: (+ (get minted wallet-stats) u1), reserved: next-wallet-res })
        true
      )
    )
    true
  )
)

(define-private (record-phase-mint-batch (phase-id uint) (owner principal) (count uint))
  (if (> phase-id u0)
    (let (
      (phase-stats (get-phase-stats-internal phase-id))
      (wallet-stats (get-phase-wallet-stats-internal phase-id owner))
    )
      (begin
        (asserts! (>= (get reserved phase-stats) count) ERR-INVALID-BATCH)
        (asserts! (>= (get reserved wallet-stats) count) ERR-INVALID-BATCH)
        (map-set PhaseStats { phase-id: phase-id }
          { minted: (+ (get minted phase-stats) count), reserved: (- (get reserved phase-stats) count) })
        (map-set PhaseWalletStats { phase-id: phase-id, owner: owner }
          { minted: (+ (get minted wallet-stats) count), reserved: (- (get reserved wallet-stats) count) })
        (ok true)
      )
    )
    (ok true)
  )
)

(define-private (record-reservation (owner principal) (phase-id uint))
  (let ((stats (get-wallet-stats-internal owner)))
    (begin
      (map-set WalletStats { owner: owner }
        { minted: (get minted stats), reserved: (+ (get reserved stats) u1) })
      (record-phase-reservation phase-id owner)
      true
    )
  )
)

(define-private (release-reservation-for (owner principal) (phase-id uint))
  (let (
    (stats (get-wallet-stats-internal owner))
    (next-reserved (if (> (get reserved stats) u0) (- (get reserved stats) u1) u0))
  )
    (begin
      (map-set WalletStats { owner: owner }
        { minted: (get minted stats), reserved: next-reserved })
      (release-phase-reservation phase-id owner)
      true
    )
  )
)

(define-private (record-mint-for (owner principal) (phase-id uint))
  (let (
    (stats (get-wallet-stats-internal owner))
    (next-reserved (if (> (get reserved stats) u0) (- (get reserved stats) u1) u0))
  )
    (begin
      (map-set WalletStats { owner: owner }
        { minted: (+ (get minted stats) u1), reserved: next-reserved })
      (record-phase-mint phase-id owner)
      true
    )
  )
)

(define-private (record-mint-batch (owner principal) (phase-id uint) (count uint))
  (let ((stats (get-wallet-stats-internal owner)))
    (begin
      (asserts! (>= (get reserved stats) count) ERR-INVALID-BATCH)
      (map-set WalletStats { owner: owner }
        { minted: (+ (get minted stats) count), reserved: (- (get reserved stats) count) })
      (try! (record-phase-mint-batch phase-id owner count))
      (ok true)
    )
  )
)

;; --- payments ---

(define-private (calc-splits (amount uint))
  (let (
    (artist (/ (* amount (var-get artist-bps)) BASIS-POINTS))
    (market (/ (* amount (var-get marketplace-bps)) BASIS-POINTS))
    (operator (/ (* amount (var-get operator-bps)) BASIS-POINTS))
    (remainder (- amount (+ artist market operator)))
  )
    { artist: artist, market: market, operator: (+ operator remainder) }
  )
)

(define-private (pay-if-positive-split (amount uint) (recipient principal))
  (if (and (> amount u0) (not (is-eq recipient tx-sender)))
    (stx-transfer? amount tx-sender recipient)
    (ok true)
  )
)

(define-private (pay-splits (amount uint))
  (if (> amount u0)
    (let ((splits (calc-splits amount)))
      (begin
        (try! (pay-if-positive-split (get artist splits) (var-get artist-recipient)))
        (try! (pay-if-positive-split (get market splits) (var-get marketplace-recipient)))
        (try! (pay-if-positive-split (get operator splits) (var-get operator-recipient)))
        (ok true)
      )
    )
    (ok true)
  )
)

;; --- uri resolution: session item-uri -> registered -> default -> fallback ---

(define-private (resolve-item-uri
  (hash (buff 32))
  (session-uri (optional (string-ascii 256)))
  (fallback (string-ascii 256))
)
  (match session-uri
    uri uri
    (match (map-get? RegisteredTokenUris { hash: hash })
      entry (get token-uri entry)
      (let ((default-uri (var-get default-token-uri)))
        (if (> (len default-uri) u0) default-uri fallback)
      )
    )
  )
)

;; --- reservation core (invariant 1: reservation counts immediately) ---

(define-private (effective-supply-ok)
  (let ((max (var-get max-supply)))
    (or
      (is-eq max u0)
      (< (+ (var-get minted-count) (var-get reserved-count)) max)
    )
  )
)

(define-private (finish-reserve
  (hash (buff 32))
  (item-uri (optional (string-ascii 256)))
  (phase-id uint)
  (price uint)
)
  (let ((index (alloc-index)))
    (let ((session {
      index: index,
      phase-id: phase-id,
      price: price,
      created-at: stacks-block-height,
      item-uri: item-uri
    }))
      (begin
        (map-insert Sessions { owner: tx-sender, hash: hash } session)
        (map-insert HashIndex { hash: hash } { index: index })
        (var-set reserved-count (+ (var-get reserved-count) u1))
        (record-reservation tx-sender phase-id)
        (ok session)
      )
    )
  )
)

(define-private (reserve-internal (hash (buff 32)) (item-uri (optional (string-ascii 256))))
  (let ((phase-id (var-get active-phase-id)))
    (begin
      (asserts! (is-none (map-get? Sessions { owner: tx-sender, hash: hash })) ERR-ALREADY-RESERVED)
      (asserts! (is-none (map-get? HashIndex { hash: hash })) ERR-DUPLICATE-HASH)
      (asserts! (effective-supply-ok) ERR-MAX-SUPPLY)
      (if (> phase-id u0)
        (let ((phase (try! (assert-phase-active phase-id))))
          (begin
            (try! (check-phase-cap phase-id (get max-supply phase)))
            (try! (check-wallet-limit tx-sender))
            (try! (check-phase-wallet-limit tx-sender phase-id (get max-per-wallet phase)))
            (try! (check-allowlist tx-sender phase-id (get allowlist-mode phase)))
            (finish-reserve hash item-uri phase-id (get mint-price phase))
          )
        )
        (let ((mode (if (var-get allowlist-enabled) ALLOWLIST-GLOBAL ALLOWLIST-PUBLIC)))
          (begin
            (try! (check-wallet-limit tx-sender))
            (try! (check-allowlist tx-sender u0 mode))
            (finish-reserve hash item-uri u0 (var-get mint-price))
          )
        )
      )
    )
  )
)

;; Reserve-or-resume: returns the existing session for {tx-sender, hash} or creates one.
(define-private (ensure-session (hash (buff 32)))
  (match (map-get? Sessions { owner: tx-sender, hash: hash })
    session (ok session)
    (reserve-internal hash none)
  )
)

;; Drops a session and returns its index to the free-list.
(define-private (release-session
  (owner principal)
  (hash (buff 32))
  (session { index: uint, phase-id: uint, price: uint, created-at: uint, item-uri: (optional (string-ascii 256)) })
)
  (begin
    (map-delete Sessions { owner: owner, hash: hash })
    (map-delete HashIndex { hash: hash })
    (push-free-index (get index session))
    (var-set reserved-count (- (var-get reserved-count) u1))
    (release-reservation-for owner (get phase-id session))
    true
  )
)

;; Converts a session into a minted item (payment happens here -- invariant 2).
(define-private (finish-mint
  (hash (buff 32))
  (session { index: uint, phase-id: uint, price: uint, created-at: uint, item-uri: (optional (string-ascii 256)) })
  (token-id uint)
)
  (begin
    (try! (pay-splits (get price session)))
    (map-delete Sessions { owner: tx-sender, hash: hash })
    (var-set reserved-count (- (var-get reserved-count) u1))
    (var-set minted-count (+ (var-get minted-count) u1))
    (record-mint-for tx-sender (get phase-id session))
    (map-insert Items { index: (get index session) } {
      token-id: token-id,
      owner-at-mint: tx-sender,
      phase-id: (get phase-id session),
      minted-at: stacks-block-height,
      content-hash: hash
    })
    (ok token-id)
  )
)

;; --- ownership + roles admin ---

(define-public (set-operator-admin (operator principal))
  (begin
    (try! (assert-owner))
    (try! (assert-not-finalized))
    (var-set operator-admin operator)
    (ok true)
  )
)

(define-public (set-finance-admin (finance principal))
  (begin
    (try! (assert-owner))
    (try! (assert-not-finalized))
    (var-set finance-admin finance)
    (ok true)
  )
)

(define-public (initiate-contract-ownership-transfer (new-owner principal))
  (begin
    (try! (assert-owner))
    (asserts! (not (is-eq new-owner (var-get contract-owner))) ERR-PENDING-OWNER)
    (var-set pending-owner (some new-owner))
    (ok true)
  )
)

(define-public (cancel-contract-ownership-transfer)
  (begin
    (try! (assert-owner))
    (var-set pending-owner none)
    (ok true)
  )
)

(define-public (accept-contract-ownership)
  (match (var-get pending-owner)
    pending (begin
      (asserts! (is-eq tx-sender pending) ERR-NOT-AUTHORIZED)
      (var-set contract-owner tx-sender)
      (var-set pending-owner none)
      (ok true)
    )
    ERR-NO-PENDING-OWNER
  )
)

;; --- metadata + config (frozen at finalize -- invariant 5) ---

(define-public (set-collection-metadata
  (name (string-ascii 64))
  (symbol (string-ascii 16))
  (description (string-ascii 256))
  (artwork (string-ascii 256))
  (base (string-ascii 256))
)
  (begin
    (try! (assert-config-admin))
    (try! (assert-not-finalized))
    (var-set collection-name name)
    (var-set collection-symbol symbol)
    (var-set collection-description description)
    (var-set artwork-uri artwork)
    (var-set base-uri base)
    (ok true)
  )
)

(define-public (set-reservation-expiry-blocks (expiry uint))
  (begin
    (try! (assert-config-admin))
    (try! (assert-not-finalized))
    (var-set reservation-expiry-blocks expiry)
    (ok true)
  )
)

(define-public (set-default-token-uri (token-uri (string-ascii 256)))
  (begin
    (try! (assert-config-admin))
    (try! (assert-not-finalized))
    (var-set default-token-uri token-uri)
    (ok true)
  )
)

(define-public (set-default-dependencies (dependencies (list 50 uint)))
  (begin
    (try! (assert-config-admin))
    (try! (assert-not-finalized))
    (var-set default-dependencies dependencies)
    (ok true)
  )
)

(define-public (set-registered-token-uri (hash (buff 32)) (token-uri (string-ascii 256)))
  (begin
    (try! (assert-config-admin))
    (try! (assert-not-finalized))
    (map-set RegisteredTokenUris { hash: hash } { token-uri: token-uri })
    (ok true)
  )
)

(define-public (clear-registered-token-uri (hash (buff 32)))
  (begin
    (try! (assert-config-admin))
    (try! (assert-not-finalized))
    (map-delete RegisteredTokenUris { hash: hash })
    (ok true)
  )
)

(define-private (set-registered-token-uri-entry
  (entry { hash: (buff 32), token-uri: (string-ascii 256) })
  (acc bool)
)
  (begin
    (map-set RegisteredTokenUris { hash: (get hash entry) } { token-uri: (get token-uri entry) })
    acc
  )
)

(define-public (set-registered-token-uri-batch
  (entries (list 200 { hash: (buff 32), token-uri: (string-ascii 256) }))
)
  (begin
    (try! (assert-config-admin))
    (try! (assert-not-finalized))
    (fold set-registered-token-uri-entry entries true)
    (ok true)
  )
)

;; --- supply policy ---

;; One-shot into fixed mode; open <-> capped-closable freely switchable pre-finalize.
(define-public (set-supply-mode (mode uint) (max uint))
  (begin
    (try! (assert-owner))
    (try! (assert-not-finalized))
    (asserts! (not (is-eq (var-get supply-mode) MODE-FIXED)) ERR-ALREADY-SET)
    (if (is-eq mode MODE-FIXED)
      (begin
        (asserts! (> max u0) ERR-INVALID-SUPPLY-MODE)
        (asserts! (>= max (+ (var-get minted-count) (var-get reserved-count))) ERR-INVALID-SUPPLY-MODE)
        (var-set max-supply max)
        (var-set supply-mode MODE-FIXED)
        (ok true)
      )
      (if (or (is-eq mode MODE-OPEN) (is-eq mode MODE-CAPPED-CLOSABLE))
        (begin
          (asserts! (is-eq max u0) ERR-INVALID-SUPPLY-MODE)
          (var-set max-supply u0)
          (var-set supply-mode mode)
          (ok true)
        )
        ERR-INVALID-SUPPLY-MODE
      )
    )
  )
)

;; One-way: capped-closable -> fixed at current minted+reserved.
(define-public (close-supply)
  (begin
    (try! (assert-owner))
    (try! (assert-not-finalized))
    (asserts! (is-eq (var-get supply-mode) MODE-CAPPED-CLOSABLE) ERR-INVALID-SUPPLY-MODE)
    (let ((closed-max (+ (var-get minted-count) (var-get reserved-count))))
      (begin
        (asserts! (> closed-max u0) ERR-INVALID-SUPPLY-MODE)
        (var-set max-supply closed-max)
        (var-set supply-mode MODE-FIXED)
        (ok closed-max)
      )
    )
  )
)

;; --- phases + allowlists ---

(define-public (set-phase
  (phase-id uint)
  (enabled bool)
  (start-block uint)
  (end-block uint)
  (phase-price uint)
  (phase-max-per-wallet uint)
  (phase-max-supply uint)
  (allowlist-mode uint)
)
  (begin
    (try! (assert-config-admin))
    (try! (assert-not-finalized))
    (asserts! (> phase-id u0) ERR-INVALID-PHASE)
    (asserts! (or (is-eq end-block u0) (<= start-block end-block)) ERR-INVALID-PHASE)
    (asserts! (is-valid-allowlist-mode allowlist-mode) ERR-INVALID-ALLOWLIST-MODE)
    (map-set Phases { phase-id: phase-id } {
      enabled: enabled,
      start-block: start-block,
      end-block: end-block,
      mint-price: phase-price,
      max-per-wallet: phase-max-per-wallet,
      max-supply: phase-max-supply,
      allowlist-mode: allowlist-mode
    })
    (ok true)
  )
)

(define-public (clear-phase (phase-id uint))
  (begin
    (try! (assert-config-admin))
    (try! (assert-not-finalized))
    (asserts! (> phase-id u0) ERR-INVALID-PHASE)
    (map-delete Phases { phase-id: phase-id })
    (if (is-eq (var-get active-phase-id) phase-id)
      (var-set active-phase-id u0)
      true
    )
    (ok true)
  )
)

(define-public (set-active-phase (phase-id uint))
  (begin
    (try! (assert-config-admin))
    (try! (assert-not-finalized))
    (if (> phase-id u0)
      (asserts! (is-some (map-get? Phases { phase-id: phase-id })) ERR-INVALID-PHASE)
      true
    )
    (var-set active-phase-id phase-id)
    (ok true)
  )
)

(define-public (set-allowlist-enabled (value bool))
  (begin
    (try! (assert-config-admin))
    (try! (assert-not-finalized))
    (var-set allowlist-enabled value)
    (ok true)
  )
)

(define-public (set-max-per-wallet (amount uint))
  (begin
    (try! (assert-config-admin))
    (try! (assert-not-finalized))
    (var-set max-per-wallet amount)
    (ok true)
  )
)

(define-public (set-allowlist (owner principal) (allowance uint))
  (begin
    (try! (assert-config-admin))
    (try! (assert-not-finalized))
    (map-set Allowlist { owner: owner } { allowance: allowance })
    (ok true)
  )
)

(define-public (clear-allowlist (owner principal))
  (begin
    (try! (assert-config-admin))
    (try! (assert-not-finalized))
    (map-delete Allowlist { owner: owner })
    (ok true)
  )
)

(define-private (set-allowlist-entry (entry { owner: principal, allowance: uint }) (acc bool))
  (begin
    (map-set Allowlist { owner: (get owner entry) } { allowance: (get allowance entry) })
    acc
  )
)

(define-public (set-allowlist-batch (entries (list 200 { owner: principal, allowance: uint })))
  (begin
    (try! (assert-config-admin))
    (try! (assert-not-finalized))
    (fold set-allowlist-entry entries true)
    (ok true)
  )
)

(define-public (set-phase-allowlist (phase-id uint) (owner principal) (allowance uint))
  (begin
    (try! (assert-config-admin))
    (try! (assert-not-finalized))
    (asserts! (> phase-id u0) ERR-INVALID-PHASE)
    (asserts! (is-some (map-get? Phases { phase-id: phase-id })) ERR-INVALID-PHASE)
    (map-set PhaseAllowlist { phase-id: phase-id, owner: owner } { allowance: allowance })
    (ok true)
  )
)

(define-public (clear-phase-allowlist (phase-id uint) (owner principal))
  (begin
    (try! (assert-config-admin))
    (try! (assert-not-finalized))
    (asserts! (> phase-id u0) ERR-INVALID-PHASE)
    (map-delete PhaseAllowlist { phase-id: phase-id, owner: owner })
    (ok true)
  )
)

(define-private (set-phase-allowlist-entry
  (entry { owner: principal, allowance: uint })
  (acc { phase-id: uint })
)
  (begin
    (map-set PhaseAllowlist
      { phase-id: (get phase-id acc), owner: (get owner entry) }
      { allowance: (get allowance entry) })
    acc
  )
)

(define-public (set-phase-allowlist-batch
  (phase-id uint)
  (entries (list 200 { owner: principal, allowance: uint }))
)
  (begin
    (try! (assert-config-admin))
    (try! (assert-not-finalized))
    (asserts! (> phase-id u0) ERR-INVALID-PHASE)
    (asserts! (is-some (map-get? Phases { phase-id: phase-id })) ERR-INVALID-PHASE)
    (fold set-phase-allowlist-entry entries { phase-id: phase-id })
    (ok true)
  )
)

;; --- finance ---

(define-public (set-mint-price (amount uint))
  (begin
    (try! (assert-finance-admin))
    (try! (assert-not-finalized))
    (var-set mint-price amount)
    (ok true)
  )
)

(define-public (set-recipients (artist principal) (marketplace principal) (operator principal))
  (begin
    (try! (assert-finance-admin))
    (try! (assert-not-finalized))
    (var-set artist-recipient artist)
    (var-set marketplace-recipient marketplace)
    (var-set operator-recipient operator)
    (ok true)
  )
)

(define-public (set-splits (artist uint) (marketplace uint) (operator uint))
  (begin
    (try! (assert-finance-admin))
    (try! (assert-not-finalized))
    (asserts! (<= (+ artist marketplace operator) BASIS-POINTS) ERR-INVALID-BPS)
    (var-set artist-bps artist)
    (var-set marketplace-bps marketplace)
    (var-set operator-bps operator)
    (ok true)
  )
)

;; --- pause ---

(define-public (set-paused (value bool))
  (begin
    (try! (assert-config-admin))
    (try! (assert-not-finalized))
    (var-set paused value)
    (ok true)
  )
)

;; --- reservations ---

(define-public (reserve (hash (buff 32)) (item-uri (optional (string-ascii 256))))
  (begin
    (try! (assert-not-finalized))
    (try! (assert-not-paused))
    (let ((session (try! (reserve-internal hash item-uri))))
      (ok (get index session))
    )
  )
)

;; Self-service; intentionally NOT blocked by pause.
(define-public (cancel-reservation (hash (buff 32)))
  (match (map-get? Sessions { owner: tx-sender, hash: hash })
    session (begin
      (release-session tx-sender hash session)
      (ok (get index session))
    )
    ERR-NOT-FOUND
  )
)

;; Permissionless after expiry; intentionally NOT blocked by pause.
(define-public (release-expired-reservation (owner principal) (hash (buff 32)))
  (match (map-get? Sessions { owner: owner, hash: hash })
    session (let ((expiry (var-get reservation-expiry-blocks)))
      (begin
        (asserts! (> expiry u0) ERR-RESERVATION-NOT-EXPIRED)
        (asserts! (>= stacks-block-height (+ (get created-at session) expiry)) ERR-RESERVATION-NOT-EXPIRED)
        (release-session owner hash session)
        (ok (get index session))
      )
    )
    ERR-NOT-FOUND
  )
)

;; Sessions admin escape hatch (operator/owner), no expiry requirement.
(define-public (release-reservation (owner principal) (hash (buff 32)))
  (begin
    (try! (assert-config-admin))
    (match (map-get? Sessions { owner: owner, hash: hash })
      session (begin
        (release-session owner hash session)
        (ok (get index session))
      )
      ERR-NOT-FOUND
    )
  )
)

;; --- mint lifecycle ---

(define-public (mint-begin
  (xtrata-contract <xtrata-core-trait>)
  (expected-hash (buff 32))
  (mime (string-ascii 64))
  (total-size uint)
  (total-chunks uint)
)
  (begin
    (try! (assert-core-contract xtrata-contract))
    (try! (assert-not-finalized))
    (try! (assert-not-paused))
    (try! (ensure-session expected-hash))
    ;; Only the core begin fee flows here (invariant 2).
    (contract-call? xtrata-contract begin-inscription expected-hash mime total-size total-chunks)
  )
)

(define-public (mint-add-chunk-batch
  (xtrata-contract <xtrata-core-trait>)
  (hash (buff 32))
  (chunks (list 32 (buff 16384)))
)
  (begin
    (try! (assert-core-contract xtrata-contract))
    (try! (assert-not-finalized))
    (try! (assert-not-paused))
    (asserts! (is-some (map-get? Sessions { owner: tx-sender, hash: hash })) ERR-NOT-FOUND)
    (contract-call? xtrata-contract add-chunk-batch hash chunks)
  )
)

(define-public (mint-seal
  (xtrata-contract <xtrata-core-trait>)
  (expected-hash (buff 32))
  (token-uri-string (string-ascii 256))
)
  (begin
    (try! (assert-core-contract xtrata-contract))
    (try! (assert-not-finalized))
    (try! (assert-not-paused))
    (let ((session (unwrap! (map-get? Sessions { owner: tx-sender, hash: expected-hash }) ERR-NOT-FOUND)))
      (let (
        (resolved-uri (resolve-item-uri expected-hash (get item-uri session) token-uri-string))
        (dependencies (var-get default-dependencies))
        (token-id (if (> (len dependencies) u0)
          (try! (contract-call? xtrata-contract seal-recursive expected-hash resolved-uri dependencies))
          (try! (contract-call? xtrata-contract seal-inscription expected-hash resolved-uri))
        ))
      )
        (finish-mint expected-hash session token-id)
      )
    )
  )
)

;; --- batch seal helpers ---

(define-private (hash-in-list-step (item (buff 32)) (acc { target: (buff 32), found: bool }))
  (if (get found acc)
    acc
    { target: (get target acc), found: (is-eq item (get target acc)) }
  )
)

(define-private (hash-in-list? (hash (buff 32)) (items (list 50 (buff 32))))
  (get found (fold hash-in-list-step items { target: hash, found: false }))
)

(define-private (validate-batch-item
  (item { hash: (buff 32), token-uri: (string-ascii 256) })
  (acc { ok: bool, seen: (list 50 (buff 32)) })
)
  (if (not (get ok acc))
    acc
    (if (hash-in-list? (get hash item) (get seen acc))
      { ok: false, seen: (get seen acc) }
      { ok: true, seen: (unwrap-panic (as-max-len? (append (get seen acc) (get hash item)) u50)) }
    )
  )
)

(define-private (validate-batch-uniqueness (items (list 50 { hash: (buff 32), token-uri: (string-ascii 256) })))
  (get ok (fold validate-batch-item items { ok: true, seen: (list) }))
)

;; Validates every item has a session for owner in the given phase, and sums prices.
(define-private (validate-batch-session-step
  (item { hash: (buff 32), token-uri: (string-ascii 256) })
  (acc (response { owner: principal, phase-id: uint, total-price: uint } uint))
)
  (let ((current (try! acc)))
    (match (map-get? Sessions { owner: (get owner current), hash: (get hash item) })
      session (if (is-eq (get phase-id session) (get phase-id current))
        (ok (merge current { total-price: (+ (get total-price current) (get price session)) }))
        ERR-INVALID-BATCH
      )
      ERR-NOT-FOUND
    )
  )
)

(define-private (resolve-batch-uri-step
  (item { hash: (buff 32), token-uri: (string-ascii 256) })
  (acc { owner: principal, out: (list 50 { hash: (buff 32), token-uri: (string-ascii 256) }) })
)
  (let (
    (session (unwrap-panic (map-get? Sessions { owner: (get owner acc), hash: (get hash item) })))
    (resolved (resolve-item-uri (get hash item) (get item-uri session) (get token-uri item)))
  )
    {
      owner: (get owner acc),
      out: (unwrap-panic (as-max-len? (append (get out acc) { hash: (get hash item), token-uri: resolved }) u50))
    }
  )
)

(define-private (record-batch-item-step
  (item { hash: (buff 32), token-uri: (string-ascii 256) })
  (acc { next-token-id: uint, owner: principal })
)
  (let ((session (unwrap-panic (map-get? Sessions { owner: (get owner acc), hash: (get hash item) }))))
    (begin
      (map-insert Items { index: (get index session) } {
        token-id: (get next-token-id acc),
        owner-at-mint: (get owner acc),
        phase-id: (get phase-id session),
        minted-at: stacks-block-height,
        content-hash: (get hash item)
      })
      (map-delete Sessions { owner: (get owner acc), hash: (get hash item) })
      { next-token-id: (+ (get next-token-id acc) u1), owner: (get owner acc) }
    )
  )
)

;; Atomic batch seal: all sessions validated before the core call; single phase per batch.
(define-public (mint-seal-batch
  (xtrata-contract <xtrata-core-trait>)
  (items (list 50 { hash: (buff 32), token-uri: (string-ascii 256) }))
)
  (begin
    (try! (assert-core-contract xtrata-contract))
    (try! (assert-not-finalized))
    (try! (assert-not-paused))
    (asserts! (is-eq (len (var-get default-dependencies)) u0) ERR-DEFAULT-DEPENDENCIES-BATCH)
    (asserts! (> (len items) u0) ERR-INVALID-BATCH)
    (asserts! (validate-batch-uniqueness items) ERR-INVALID-BATCH)
    (let (
      (first-item (unwrap! (element-at? items u0) ERR-INVALID-BATCH))
      (first-session (unwrap! (map-get? Sessions { owner: tx-sender, hash: (get hash first-item) }) ERR-NOT-FOUND))
      (phase-id (get phase-id first-session))
      (validated (try! (fold validate-batch-session-step items
        (ok { owner: tx-sender, phase-id: phase-id, total-price: u0 }))))
      (resolved (get out (fold resolve-batch-uri-step items { owner: tx-sender, out: (list) })))
      (result (try! (contract-call? xtrata-contract seal-inscription-batch resolved)))
    )
      (begin
        (asserts! (is-eq (get count result) (len items)) ERR-INVALID-BATCH)
        (try! (pay-splits (get total-price validated)))
        (var-set reserved-count (- (var-get reserved-count) (len items)))
        (var-set minted-count (+ (var-get minted-count) (len items)))
        (try! (record-mint-batch tx-sender phase-id (len items)))
        (fold record-batch-item-step items { next-token-id: (get start result), owner: tx-sender })
        (ok result)
      )
    )
  )
)

;; --- small single-tx paths (core-native, <= 32 chunks) ---

(define-private (mint-small-internal
  (xtrata-contract <xtrata-core-trait>)
  (expected-hash (buff 32))
  (mime (string-ascii 64))
  (total-size uint)
  (chunks (list 32 (buff 16384)))
  (token-uri-string (string-ascii 256))
  (dependencies (optional (list 50 uint)))
)
  (let ((chunk-count (len chunks)))
    (begin
      (try! (assert-core-contract xtrata-contract))
      (try! (assert-not-finalized))
      (try! (assert-not-paused))
      (asserts! (> chunk-count u0) ERR-INVALID-BATCH)
      (asserts! (<= chunk-count MAX-SMALL-MINT-CHUNKS) ERR-INVALID-BATCH)
      (asserts! (<= total-size (* chunk-count SMALL-MINT-CHUNK-SIZE)) ERR-INVALID-BATCH)
      (let ((session (try! (ensure-session expected-hash))))
        (let (
          (resolved-uri (resolve-item-uri expected-hash (get item-uri session) token-uri-string))
          (result (match dependencies
            deps (try! (contract-call? xtrata-contract mint-single-tx-recursive
              expected-hash mime total-size chunks resolved-uri deps))
            (try! (contract-call? xtrata-contract mint-single-tx
              expected-hash mime total-size chunks resolved-uri))
          ))
        )
          (finish-mint expected-hash session (get token-id result))
        )
      )
    )
  )
)

(define-public (mint-small-single-tx
  (xtrata-contract <xtrata-core-trait>)
  (expected-hash (buff 32))
  (mime (string-ascii 64))
  (total-size uint)
  (chunks (list 32 (buff 16384)))
  (token-uri-string (string-ascii 256))
)
  (let ((defaults (var-get default-dependencies)))
    (if (> (len defaults) u0)
      (mint-small-internal xtrata-contract expected-hash mime total-size chunks token-uri-string (some defaults))
      (mint-small-internal xtrata-contract expected-hash mime total-size chunks token-uri-string none)
    )
  )
)

(define-public (mint-small-single-tx-recursive
  (xtrata-contract <xtrata-core-trait>)
  (expected-hash (buff 32))
  (mime (string-ascii 64))
  (total-size uint)
  (chunks (list 32 (buff 16384)))
  (token-uri-string (string-ascii 256))
  (dependencies (list 50 uint))
)
  (begin
    (asserts! (is-eq (len (var-get default-dependencies)) u0) ERR-DEFAULT-DEPENDENCIES-BATCH)
    (mint-small-internal xtrata-contract expected-hash mime total-size chunks token-uri-string (some dependencies))
  )
)

;; --- drops assignment ledger (invariant 4) ---

;; Settable until finalize; the drops contract calls assign/unassign via contract-caller.
(define-public (set-drops-authority (authority (optional principal)))
  (begin
    (try! (assert-owner))
    (try! (assert-not-finalized))
    (var-set drops-authority authority)
    (ok true)
  )
)

(define-private (assign-index (index uint) (drop-id uint))
  (begin
    (asserts! (is-some (map-get? Items { index: index })) ERR-NOT-MINTED)
    (asserts! (is-none (map-get? Assignments { index: index })) ERR-ALREADY-ASSIGNED)
    (map-insert Assignments { index: index } {
      drop-contract: contract-caller,
      drop-id: drop-id,
      assigned-at: stacks-block-height
    })
    (ok true)
  )
)

(define-public (assign-to-drop (index uint) (drop-id uint))
  (begin
    (try! (assert-drops-authority))
    (assign-index index drop-id)
  )
)

;; Intentionally NOT blocked by pause (creator recovery path).
(define-public (unassign-from-drop (index uint) (drop-id uint))
  (begin
    (try! (assert-drops-authority))
    (match (map-get? Assignments { index: index })
      assignment (begin
        (asserts! (is-eq (get drop-contract assignment) contract-caller) ERR-ASSIGNMENT-MISMATCH)
        (asserts! (is-eq (get drop-id assignment) drop-id) ERR-ASSIGNMENT-MISMATCH)
        (map-delete Assignments { index: index })
        (ok true)
      )
      ERR-NOT-FOUND
    )
  )
)

(define-private (assign-range-step
  (i uint)
  (acc (response { start: uint, end: uint, drop-id: uint, count: uint } uint))
)
  (let ((current (try! acc)))
    (let ((index (+ (get start current) i)))
      (if (>= index (get end current))
        (ok current)
        (begin
          (try! (assign-index index (get drop-id current)))
          (ok (merge current { count: (+ (get count current) u1) }))
        )
      )
    )
  )
)

;; Assigns [start, end) -- end exclusive, at most 50 per call.
;; Fails atomically if any index is unminted or already assigned.
(define-public (assign-range-to-drop (start uint) (end uint) (drop-id uint))
  (begin
    (try! (assert-drops-authority))
    (asserts! (< start end) ERR-INVALID-BATCH)
    (asserts! (<= (- end start) u50) ERR-INVALID-BATCH)
    (let ((result (try! (fold assign-range-step ITER-50
      (ok { start: start, end: end, drop-id: drop-id, count: u0 })))))
      (ok (get count result))
    )
  )
)

(define-private (assign-list-step
  (index uint)
  (acc (response { drop-id: uint, count: uint } uint))
)
  (let ((current (try! acc)))
    (begin
      (try! (assign-index index (get drop-id current)))
      (ok (merge current { count: (+ (get count current) u1) }))
    )
  )
)

;; Assigns an explicit list of indexes -- at most 50 per call.
;; Fails atomically if any index is unminted or already assigned.
(define-public (assign-list-to-drop (indexes (list 50 uint)) (drop-id uint))
  (begin
    (try! (assert-drops-authority))
    (asserts! (> (len indexes) u0) ERR-INVALID-BATCH)
    (let ((result (try! (fold assign-list-step indexes (ok { drop-id: drop-id, count: u0 })))))
      (ok (get count result))
    )
  )
)

(define-private (unassign-list-step
  (index uint)
  (acc (response { drop-id: uint, count: uint } uint))
)
  (let ((current (try! acc)))
    (match (map-get? Assignments { index: index })
      assignment (begin
        (asserts! (is-eq (get drop-contract assignment) contract-caller) ERR-ASSIGNMENT-MISMATCH)
        (asserts! (is-eq (get drop-id assignment) (get drop-id current)) ERR-ASSIGNMENT-MISMATCH)
        (map-delete Assignments { index: index })
        (ok (merge current { count: (+ (get count current) u1) }))
      )
      ERR-NOT-FOUND
    )
  )
)

;; Unassigns an explicit list of indexes -- at most 50 per call.
;; Intentionally NOT blocked by pause (creator recovery path).
(define-public (unassign-list-from-drop (indexes (list 50 uint)) (drop-id uint))
  (begin
    (try! (assert-drops-authority))
    (asserts! (> (len indexes) u0) ERR-INVALID-BATCH)
    (let ((result (try! (fold unassign-list-step indexes (ok { drop-id: drop-id, count: u0 })))))
      (ok (get count result))
    )
  )
)

;; --- finalize (invariant 5) ---

(define-public (finalize)
  (begin
    (try! (assert-owner))
    (asserts! (not (var-get finalized)) ERR-FINALIZED)
    (asserts! (is-eq (var-get reserved-count) u0) ERR-NOT-FINALIZABLE)
    ;; Dense-index requirement: no recycled holes may remain.
    (asserts! (is-eq (var-get free-count) u0) ERR-NOT-FINALIZABLE)
    (if (> (var-get max-supply) u0)
      (asserts! (is-eq (var-get minted-count) (var-get max-supply)) ERR-NOT-FINALIZABLE)
      true
    )
    (var-set finalized true)
    (ok true)
  )
)

;; --- read-onlys ---

(define-read-only (get-item (index uint))
  (map-get? Items { index: index })
)

(define-private (get-item-opt (index uint))
  (map-get? Items { index: index })
)

(define-read-only (get-items (indexes (list 50 uint)))
  (ok (map get-item-opt indexes))
)

(define-read-only (get-session (owner principal) (hash (buff 32)))
  (map-get? Sessions { owner: owner, hash: hash })
)

(define-read-only (get-hash-index (hash (buff 32)))
  (map-get? HashIndex { hash: hash })
)

(define-read-only (get-assignment (index uint))
  (map-get? Assignments { index: index })
)

(define-private (scan-step
  (i uint)
  (acc { start: uint, limit: uint, entries: (list 50 { index: uint, minted: bool, assigned: bool }) })
)
  (let ((index (+ (get start acc) i)))
    (if (>= index (get limit acc))
      acc
      (merge acc {
        entries: (unwrap-panic (as-max-len?
          (append (get entries acc) {
            index: index,
            minted: (is-some (map-get? Items { index: index })),
            assigned: (is-some (map-get? Assignments { index: index }))
          })
          u50))
      })
    )
  )
)

;; Pagination-friendly scan of up to 50 indexes starting at `start`.
(define-read-only (get-unassigned-scan (start uint))
  (ok (get entries (fold scan-step ITER-50
    { start: start, limit: (var-get next-index), entries: (list) })))
)

(define-read-only (get-phase (phase-id uint))
  (map-get? Phases { phase-id: phase-id })
)

(define-read-only (get-phase-stats (phase-id uint))
  (ok (get-phase-stats-internal phase-id))
)

(define-read-only (get-wallet-stats (owner principal))
  (ok (get-wallet-stats-internal owner))
)

(define-read-only (get-phase-wallet-stats (phase-id uint) (owner principal))
  (ok (get-phase-wallet-stats-internal phase-id owner))
)

(define-read-only (get-allowlist-entry (owner principal))
  (map-get? Allowlist { owner: owner })
)

(define-read-only (get-phase-allowlist-entry (phase-id uint) (owner principal))
  (map-get? PhaseAllowlist { phase-id: phase-id, owner: owner })
)

(define-read-only (get-free-count)
  (ok (var-get free-count))
)

(define-read-only (get-collection-info)
  (ok {
    name: (var-get collection-name),
    symbol: (var-get collection-symbol),
    description: (var-get collection-description),
    artwork-uri: (var-get artwork-uri),
    base-uri: (var-get base-uri),
    owner: (var-get contract-owner),
    operator-admin: (var-get operator-admin),
    finance-admin: (var-get finance-admin),
    supply-mode: (var-get supply-mode),
    max-supply: (var-get max-supply),
    minted-count: (var-get minted-count),
    reserved-count: (var-get reserved-count),
    next-index: (var-get next-index),
    free-count: (var-get free-count),
    mint-price: (var-get mint-price),
    active-phase-id: (var-get active-phase-id),
    reservation-expiry-blocks: (var-get reservation-expiry-blocks),
    paused: (var-get paused),
    finalized: (var-get finalized),
    drops-authority: (var-get drops-authority),
    core-contract: ALLOWED-XTRATA-CONTRACT
  })
)

(define-read-only (get-splits)
  (ok {
    artist: (var-get artist-bps),
    marketplace: (var-get marketplace-bps),
    operator: (var-get operator-bps)
  })
)

(define-read-only (get-recipients)
  (ok {
    artist: (var-get artist-recipient),
    marketplace: (var-get marketplace-recipient),
    operator: (var-get operator-recipient)
  })
)

(define-read-only (get-pending-owner)
  (ok (var-get pending-owner))
)

(define-read-only (get-default-dependencies)
  (ok (var-get default-dependencies))
)

(define-read-only (get-registered-token-uri (hash (buff 32)))
  (map-get? RegisteredTokenUris { hash: hash })
)
