;; u64bxr-v9.2.17: xStrata Optimized Protocol (SIP-009 Compatible)
;;
;; Final posture (v9.2.17):
;; 1) Open participation: anyone can inscribe (fees apply).
;; 2) Content is immutable once sealed (no post-mint edits, no mutable pointers tied to an id).
;; 3) Creator is immutable provenance; owner can transfer.
;; 4) Admin can: set fee unit (bounded), set royalty recipient, pause/unpause, transfer admin ownership.
;; 5) Seal requires ALL declared chunks uploaded (current-index == total-chunks).
;; 6) Upload sessions are resumable indefinitely:
;;    - begin-inscription acts as "start-or-resume" for {uploader, file-hash}
;;    - no automatic expiry
;; 7) Dependencies must already exist at seal time (no forward refs).
;; 8) Pause is a safety brake on inscription writes only:
;;    - pause stops begin-inscription, add-chunk-batch, sealing
;;    - pause does NOT stop transfers or read-only access
;; 9) Optional uploader-only abandon-upload exists, but is not required for correctness and never deletes chunks.

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; --- SIP-009 TRAIT (IMPLEMENT FOR WALLET/INDEXER COMPATIBILITY) ---
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;; [TESTNET]
(impl-trait 'ST1NXBK3K5YYMD6FD41MVNP3JS1GABZ8TRVX023PT.nft-trait.nft-trait)
(use-trait nft-trait 'ST1NXBK3K5YYMD6FD41MVNP3JS1GABZ8TRVX023PT.nft-trait.nft-trait)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; --- ASSET DEFINITION ---
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define-non-fungible-token xstrata-inscription uint)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; --- ERROR CODES ---
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define-constant ERR-NOT-AUTHORIZED     (err u100))
(define-constant ERR-NOT-FOUND          (err u101))
(define-constant ERR-INVALID-BATCH      (err u102))
(define-constant ERR-HASH-MISMATCH      (err u103))
(define-constant ERR-INVALID-URI        (err u107))
(define-constant ERR-PAUSED             (err u109))
(define-constant ERR-INVALID-FEE        (err u110))
(define-constant ERR-DEPENDENCY-MISSING (err u111))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; --- CONSTANTS ---
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define-constant MAX-BATCH-SIZE u50)

;; Fee bounds (microSTX): 0.001 STX .. 1.0 STX
(define-constant FEE-MIN u1000)
(define-constant FEE-MAX u1000000)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; --- SVG (COMPATIBLE / SAFE) ---
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define-constant SVG-STATIC
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50'><circle cx='25' cy='25' r='20' fill='none' stroke='#6366f1' stroke-width='4'/><circle cx='25' cy='25' r='12' fill='none' stroke='#ec4899' stroke-width='4'/></svg>"
)

;; Precomputed base64(SVG-STATIC)
(define-constant SVG-STATIC-B64
  "PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA1MCA1MCc+PGNpcmNsZSBjeD0nMjUnIGN5PScyNScgcj0nMjAnIGZpbGw9J25vbmUnIHN0cm9rZT0nIzYzNjZmMScgc3Ryb2tlLXdpZHRoPSc0Jy8+PGNpcmNsZSBjeD0nMjUnIGN5PScyNScgcj0nMTInIGZpbGw9J25vbmUnIHN0cm9rZT0nI2VjNDg5OScgc3Ryb2tlLXdpZHRoPSc0Jy8+PC9zdmc+"
)

(define-constant SVG-DATAURI-PREFIX "data:image/svg+xml;base64,")

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; --- DATA VARS (ADMIN + FEES + PAUSE) ---
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define-data-var contract-owner principal tx-sender)

(define-data-var next-id uint u0)
(define-data-var royalty-recipient principal tx-sender)

;; Single pricing "knob" (microSTX), bounded for predictability
;; Baseline 0.1 STX = 100_000 microSTX
(define-data-var fee-unit uint u100000)

;; Pause switch (admin adjustable)
;; IMPORTANT: pause blocks inscription writes only; transfers and reads remain available.
(define-data-var paused bool false)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; --- TOKEN URI STORAGE ---
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define-map TokenURIs uint (string-ascii 256))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; --- STORAGE ---
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define-map InscriptionMeta uint
  {
    owner: principal,
    creator: principal,
    mime-type: (string-ascii 64),
    total-size: uint,
    total-chunks: uint,
    sealed: bool,
    final-hash: (buff 32)
  }
)

(define-map InscriptionDependencies uint (list 50 uint))

(define-map UploadState
  { owner: principal, hash: (buff 32) }
  {
  mime-type: (string-ascii 64),
  total-size: uint,
  total-chunks: uint,
  current-index: uint,
  running-hash: (buff 32)
}
)

(define-map Chunks { context: (buff 32), creator: principal, index: uint } (buff 16384))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; --- INTERNAL HELPERS ---
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define-private (assert-not-paused)
  (begin
    (asserts! (not (var-get paused)) ERR-PAUSED)
    (ok true)
  )
)

;; Return type MUST be consistent: (response bool uint)
(define-private (maybe-pay (amount uint))
  (if (> amount u0)
    (if (is-eq tx-sender (var-get royalty-recipient))
      (ok true)
      (stx-transfer? amount tx-sender (var-get royalty-recipient))
    )
    (ok true)
  )
)

;; Cheaper "existence" rule for sequential IDs (no burns):
;; Dependency exists iff dep-id < next-id at the time of sealing.
(define-private (dep-exists? (id uint))
  (< id (var-get next-id))
)

(define-private (validate-dependencies (deps (list 50 uint)))
  (let ((res (fold validate-dep deps { ok: true })))
    (get ok res)
  )
)

(define-private (validate-dep (id uint) (acc { ok: bool }))
  (if (get ok acc)
    (if (dep-exists? id)
      { ok: true }
      { ok: false }
    )
    acc
  )
)

;; ceil(total-chunks / MAX-BATCH-SIZE)
(define-private (num-batches (total-chunks uint))
  (let (
    (q (/ total-chunks MAX-BATCH-SIZE))
    (r (mod total-chunks MAX-BATCH-SIZE))
  )
    (if (is-eq r u0) q (+ q u1))
  )
)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; --- SIP-009 REQUIRED FUNCTIONS ---
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define-read-only (get-last-token-id)
  (if (is-eq (var-get next-id) u0)
    (ok u0)
    (ok (- (var-get next-id) u1))
  )
)

(define-read-only (get-next-token-id)
  (ok (var-get next-id))
)

(define-read-only (get-token-uri (id uint))
  (if (is-some (nft-get-owner? xstrata-inscription id))
    (ok (match (map-get? TokenURIs id)
          uri (some uri)
          none))
    (ok none)
  )
)

(define-read-only (get-owner (id uint))
  (ok (nft-get-owner? xstrata-inscription id))
)

(define-public (transfer (id uint) (sender principal) (recipient principal))
  (begin
    ;; IMPORTANT: transfers are NOT paused
    (asserts! (is-eq tx-sender sender) ERR-NOT-AUTHORIZED)
    (asserts! (is-eq (some sender) (nft-get-owner? xstrata-inscription id)) ERR-NOT-AUTHORIZED)

    (try! (nft-transfer? xstrata-inscription id sender recipient))

    ;; meta should exist for minted tokens; enforce (safer than silently ignoring)
    (let ((meta (unwrap! (map-get? InscriptionMeta id) ERR-NOT-FOUND)))
      (map-set InscriptionMeta id (merge meta { owner: recipient }))
    )

    (ok true)
  )
)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; --- OPTIONAL READ-ONLY HELPERS (ON-CHAIN SVG ACCESS) ---
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define-read-only (get-svg (id uint))
  (if (is-some (nft-get-owner? xstrata-inscription id))
    (ok (some SVG-STATIC))
    (ok none)
  )
)

(define-read-only (get-svg-data-uri (id uint))
  (if (is-some (nft-get-owner? xstrata-inscription id))
    (ok (some (concat SVG-DATAURI-PREFIX SVG-STATIC-B64)))
    (ok none)
  )
)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; --- ADMIN FUNCTIONS ---
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define-public (set-royalty-recipient (recipient principal))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (var-set royalty-recipient recipient)
    (ok true)
  )
)

;; One-knob fee model:
;; - begin fee  = fee-unit
;; - seal fee   = fee-unit * (1 + ceil(total-chunks / 50))
;;
;; Governance constraints:
;; - absolute bounds: [0.001, 1.0] STX
;; - bounded change per update:
;;    * increases: new <= old*2
;;    * decreases: new >= old/10
(define-public (set-fee-unit (new-fee uint))
  (let ((old (var-get fee-unit)))
    (begin
      (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
      (asserts! (>= new-fee FEE-MIN) ERR-INVALID-FEE)
      (asserts! (<= new-fee FEE-MAX) ERR-INVALID-FEE)

      ;; bounded change
      (asserts! (<= new-fee (* old u2)) ERR-INVALID-FEE)   ;; max 2x up
      (asserts! (>= new-fee (/ old u10)) ERR-INVALID-FEE)  ;; max 10x down

      (var-set fee-unit new-fee)
      (ok true)
    )
  )
)

(define-public (set-paused (value bool))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (var-set paused value)
    (ok true)
  )
)

(define-public (transfer-contract-ownership (new-owner principal))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (var-set contract-owner new-owner)
    (ok true)
  )
)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; --- CORE LOGIC ---
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;; Start-or-resume:
;; - If no UploadState exists for {tx-sender, expected-hash}, create it and charge begin fee.
;; - If it already exists, treat as resume:
;;   - do NOT charge begin fee again
;;   - require parameters match the original declaration
(define-public (begin-inscription (expected-hash (buff 32)) (mime (string-ascii 64)) (total-size uint) (total-chunks uint))
  (begin
    (try! (assert-not-paused))
    (asserts! (> total-chunks u0) ERR-INVALID-BATCH)

    (match (map-get? UploadState { owner: tx-sender, hash: expected-hash })
      state
        (begin
          ;; Resume path: parameters must match original session (no silent mutation)
          (asserts! (is-eq (get mime-type state) mime) ERR-INVALID-BATCH)
          (asserts! (is-eq (get total-size state) total-size) ERR-INVALID-BATCH)
          (asserts! (is-eq (get total-chunks state) total-chunks) ERR-INVALID-BATCH)
          (ok true)
        )
      (begin
        ;; New session path: pay begin fee once
        (try! (maybe-pay (var-get fee-unit)))

        (map-insert UploadState
          { owner: tx-sender, hash: expected-hash }
          {
            mime-type: mime,
            total-size: total-size,
            total-chunks: total-chunks,
            current-index: u0,
            running-hash: 0x0000000000000000000000000000000000000000000000000000000000000000
          }
        )
        (ok true)
      )
    )
  )
)

;; Optional uploader-only cleanup (not required for correctness).
;; Clears UploadState only; never deletes chunks.
(define-public (abandon-upload (expected-hash (buff 32)))
  (begin
    (try! (assert-not-paused))
    (unwrap! (map-get? UploadState { owner: tx-sender, hash: expected-hash }) ERR-NOT-FOUND)
    (map-delete UploadState { owner: tx-sender, hash: expected-hash })
    (ok true)
  )
)

(define-public (add-chunk-batch (hash (buff 32)) (chunks (list 50 (buff 16384))))
  (begin
    (try! (assert-not-paused))
    (let (
      (state (unwrap! (map-get? UploadState { owner: tx-sender, hash: hash }) ERR-NOT-FOUND))
      (start-idx (get current-index state))
      (start-hash (get running-hash state))
      (batch-len (len chunks))
      (total (get total-chunks state))
    )
      (begin
        (asserts! (> batch-len u0) ERR-INVALID-BATCH)
        (asserts! (<= batch-len MAX-BATCH-SIZE) ERR-INVALID-BATCH)
        (asserts! (<= (+ start-idx batch-len) total) ERR-INVALID-BATCH)

        (let ((result (fold process-chunk chunks
          { idx: start-idx, run-hash: start-hash, target-hash: hash, creator: tx-sender })))
          (map-set UploadState
            { owner: tx-sender, hash: hash }
            (merge state {
              current-index: (get idx result),
              running-hash: (get run-hash result)
            })
          )
          (ok true)
        )
      )
    )
  )
)

(define-private (process-chunk
  (data (buff 16384))
  (ctx { idx: uint, run-hash: (buff 32), target-hash: (buff 32), creator: principal })
)
  (let (
    (current-idx (get idx ctx))
    (current-hash (get run-hash ctx))
    (target-hash (get target-hash ctx))
    (creator (get creator ctx))
    (next-hash (sha256 (concat current-hash data)))
  )
    (map-set Chunks { context: target-hash, creator: creator, index: current-idx } data)
    { idx: (+ current-idx u1), run-hash: next-hash, target-hash: target-hash, creator: creator }
  )
)

(define-private (seal-internal (expected-hash (buff 32)) (token-uri-string (string-ascii 256)) (new-id uint))
  (let (
    (state (unwrap! (map-get? UploadState { owner: tx-sender, hash: expected-hash }) ERR-NOT-FOUND))
    (final-hash (get running-hash state))
    (chunks (get total-chunks state))
    (batches (num-batches chunks))
    ;; seal fee = fee-unit * (1 + batches)
    (seal-fee (* (var-get fee-unit) (+ u1 batches)))
  )
    (begin
      (try! (assert-not-paused))
      (asserts! (is-eq (get current-index state) chunks) ERR-INVALID-BATCH)
      (asserts! (is-eq final-hash expected-hash) ERR-HASH-MISMATCH)
      (asserts! (> (len token-uri-string) u0) ERR-INVALID-URI)

      (try! (maybe-pay seal-fee))

      (try! (nft-mint? xstrata-inscription new-id tx-sender))

      (map-insert InscriptionMeta new-id {
        owner: tx-sender,
        creator: tx-sender,
        mime-type: (get mime-type state),
        total-size: (get total-size state),
        total-chunks: chunks,
        sealed: true,
        final-hash: final-hash
      })

      (map-set TokenURIs new-id token-uri-string)

      (map-delete UploadState { owner: tx-sender, hash: expected-hash })
      (var-set next-id (+ new-id u1))

      (ok new-id)
    )
  )
)

(define-public (seal-inscription (expected-hash (buff 32)) (token-uri-string (string-ascii 256)))
  (seal-internal expected-hash token-uri-string (var-get next-id))
)

(define-public (seal-recursive (expected-hash (buff 32)) (token-uri-string (string-ascii 256)) (dependencies (list 50 uint)))
  (begin
    (try! (assert-not-paused))
    (asserts! (validate-dependencies dependencies) ERR-DEPENDENCY-MISSING)
    (let ((new-id (try! (seal-internal expected-hash token-uri-string (var-get next-id)))))
      (map-insert InscriptionDependencies new-id dependencies)
      (ok new-id)
    )
  )
)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; --- READERS ---
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define-read-only (get-inscription-meta (id uint))
  (map-get? InscriptionMeta id)
)

;; Safer than (unwrap! ... none) for Clarinet inference:
(define-read-only (get-chunk (id uint) (index uint))
  (match (map-get? InscriptionMeta id)
    meta
      (map-get? Chunks {
        context: (get final-hash meta),
        creator: (get creator meta),
        index: index
      })
    none
  )
)

;; Safer than (default-to (list) ...) for some inference edge cases:
(define-read-only (get-dependencies (id uint))
  (match (map-get? InscriptionDependencies id)
    deps deps
    (list)
  )
)

(define-read-only (get-upload-state (expected-hash (buff 32)) (owner principal))
  (map-get? UploadState { owner: owner, hash: expected-hash })
)

(define-read-only (get-pending-chunk (hash (buff 32)) (creator principal) (index uint))
  (map-get? Chunks { context: hash, creator: creator, index: index })
)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; --- ADMIN READERS (OPTIONAL) ---
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define-read-only (get-admin)
  (ok (var-get contract-owner))
)

(define-read-only (get-royalty-recipient)
  (ok (var-get royalty-recipient))
)

(define-read-only (get-fee-unit)
  (ok (var-get fee-unit))
)

(define-read-only (is-paused)
  (ok (var-get paused))
)
