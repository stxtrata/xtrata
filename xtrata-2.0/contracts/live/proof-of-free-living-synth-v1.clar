;; Proof of Free - Living Synth registry v1
;;
;; This contract is the canonical index between the 1,024 collection NFTs and
;; their playable recording inscriptions. Audio data remains in Xtrata; this
;; contract only accepts immutable Xtrata children registered by the current
;; owner of the parent NFT.

(define-constant CONTRACT-OWNER tx-sender)
(define-constant MAX-EDITIONS u1024)
(define-constant PAGE-SIZE u32)
(define-constant RECORDING-MIME "application/json")
(define-constant MIN-RECORDING-FEE u1000)
(define-constant MAX-RECORDING-FEE u1000000)
(define-constant DEFAULT-RECORDING-FEE u100000)

(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-INVALID-EDITION (err u101))
(define-constant ERR-EDITION-EXISTS (err u102))
(define-constant ERR-NFT-EXISTS (err u103))
(define-constant ERR-NOT-FOUND (err u104))
(define-constant ERR-NOT-NFT-OWNER (err u105))
(define-constant ERR-NOT-RECORDING-OWNER (err u106))
(define-constant ERR-NOT-CHILD (err u107))
(define-constant ERR-INVALID-MIME (err u108))
(define-constant ERR-RECORDING-EXISTS (err u109))
(define-constant ERR-INVALID-CORE (err u111))
(define-constant ERR-PAUSED (err u112))
(define-constant ERR-CORE-LOCKED (err u113))
(define-constant ERR-INVALID-PAGE (err u114))
(define-constant ERR-INVALID-FEE (err u115))

(define-trait xtrata-core-trait
  (
    (get-owner (uint) (response (optional principal) uint))
    (get-parents (uint) (response (list 50 uint) uint))
    (get-inscription-meta (uint)
      (response (optional {
        owner: principal,
        creator: principal,
        mime-type: (string-ascii 64),
        total-size: uint,
        total-chunks: uint,
        sealed: bool,
        final-hash: (buff 32)
      }) uint)
    )
  )
)

(define-data-var core-contract (optional principal) none)
(define-data-var paused bool true)
(define-data-var engine-id (optional uint) none)
(define-data-var registered-editions uint u0)
(define-data-var global-revision uint u0)
(define-data-var recording-fee uint DEFAULT-RECORDING-FEE)
(define-data-var fee-recipient principal CONTRACT-OWNER)

(define-map EditionToNft uint uint)
(define-map NftToEdition uint uint)
(define-map RecordingCounts uint uint)
(define-map ActiveRecordings uint uint)
(define-map NftRevisions uint uint)
(define-map Recordings
  { nft-id: uint, sequence: uint }
  uint
)
(define-map RecordingInfo
  uint
  {
    nft-id: uint,
    edition: uint,
    creator: principal,
    sequence: uint,
    registered-at: uint,
    content-hash: (buff 32)
  }
)

(define-constant PAGE-OFFSETS
  (list u0 u1 u2 u3 u4 u5 u6 u7 u8 u9 u10 u11 u12 u13 u14 u15
        u16 u17 u18 u19 u20 u21 u22 u23 u24 u25 u26 u27 u28 u29 u30 u31)
)

(define-private (assert-owner)
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (ok true)
  )
)

(define-private (assert-live)
  (begin
    (asserts! (not (var-get paused)) ERR-PAUSED)
    (ok true)
  )
)

(define-private (assert-core (core <xtrata-core-trait>))
  (begin
    (asserts!
      (is-eq (some (contract-of core)) (var-get core-contract))
      ERR-INVALID-CORE
    )
    (ok true)
  )
)

(define-private (read-owner (core <xtrata-core-trait>) (token-id uint))
  (contract-call? core get-owner token-id)
)

(define-private (assert-current-nft-owner (core <xtrata-core-trait>) (nft-id uint))
  (begin
    (asserts!
      (is-eq (try! (read-owner core nft-id)) (some tx-sender))
      ERR-NOT-NFT-OWNER
    )
    (ok true)
  )
)

(define-private (bump-revision (nft-id uint))
  (let (
    (next-nft-revision (+ (default-to u0 (map-get? NftRevisions nft-id)) u1))
    (next-global-revision (+ (var-get global-revision) u1))
  )
    (map-set NftRevisions nft-id next-nft-revision)
    (var-set global-revision next-global-revision)
    next-nft-revision
  )
)

(define-private (mosaic-cell (edition uint))
  (match (map-get? EditionToNft edition)
    nft-id
      {
        edition: edition,
        nft-id: (some nft-id),
        recording-count: (default-to u0 (map-get? RecordingCounts nft-id)),
        active-recording: (map-get? ActiveRecordings nft-id),
        revision: (default-to u0 (map-get? NftRevisions nft-id))
      }
    {
      edition: edition,
      nft-id: none,
      recording-count: u0,
      active-recording: none,
      revision: u0
    }
  )
)

(define-private (append-mosaic-cell
  (offset uint)
  (state {
    start: uint,
    cells: (list 32 {
      edition: uint,
      nft-id: (optional uint),
      recording-count: uint,
      active-recording: (optional uint),
      revision: uint
    })
  })
)
  (let ((edition (+ (get start state) offset)))
    {
      start: (get start state),
      cells: (unwrap-panic
        (as-max-len?
          (append (get cells state) (mosaic-cell edition))
          u32
        )
      )
    }
  )
)

;; The deployer chooses the Xtrata core once. It cannot later be swapped for a
;; counterfeit contract that lies about ownership or parent relationships.
(define-public (lock-core-contract (core <xtrata-core-trait>))
  (begin
    (try! (assert-owner))
    (asserts! (is-none (var-get core-contract)) ERR-CORE-LOCKED)
    (var-set core-contract (some (contract-of core)))
    (print {
      event: "core-locked",
      core-contract: (contract-of core)
    })
    (ok true)
  )
)

(define-public (set-paused (value bool))
  (begin
    (try! (assert-owner))
    (var-set paused value)
    (print { event: "pause-updated", paused: value })
    (ok value)
  )
)

(define-public (set-recording-fee (value uint))
  (begin
    (try! (assert-owner))
    (asserts!
      (and (>= value MIN-RECORDING-FEE) (<= value MAX-RECORDING-FEE))
      ERR-INVALID-FEE
    )
    (var-set recording-fee value)
    (print { event: "recording-fee-updated", recording-fee: value })
    (ok value)
  )
)

(define-public (set-fee-recipient (recipient principal))
  (begin
    (try! (assert-owner))
    (var-set fee-recipient recipient)
    (print { event: "fee-recipient-updated", fee-recipient: recipient })
    (ok recipient)
  )
)

(define-public (set-engine (core <xtrata-core-trait>) (inscription-id uint))
  (begin
    (try! (assert-owner))
    (try! (assert-core core))
    (asserts! (is-some (try! (contract-call? core get-inscription-meta inscription-id))) ERR-NOT-FOUND)
    (var-set engine-id (some inscription-id))
    (var-set global-revision (+ (var-get global-revision) u1))
    (print { event: "engine-updated", engine-id: inscription-id })
    (ok inscription-id)
  )
)

;; Collection registration is deliberately operator-controlled so an unrelated
;; Xtrata token cannot squat a collection edition.
(define-public (register-edition
  (core <xtrata-core-trait>)
  (edition uint)
  (nft-id uint)
)
  (begin
    (try! (assert-owner))
    (try! (assert-core core))
    (asserts! (and (> edition u0) (<= edition MAX-EDITIONS)) ERR-INVALID-EDITION)
    (asserts! (is-none (map-get? EditionToNft edition)) ERR-EDITION-EXISTS)
    (asserts! (is-none (map-get? NftToEdition nft-id)) ERR-NFT-EXISTS)
    (asserts! (is-some (try! (read-owner core nft-id))) ERR-NOT-FOUND)
    (map-set EditionToNft edition nft-id)
    (map-set NftToEdition nft-id edition)
    (map-set RecordingCounts nft-id u0)
    (map-set NftRevisions nft-id u1)
    (var-set registered-editions (+ (var-get registered-editions) u1))
    (var-set global-revision (+ (var-get global-revision) u1))
    (print {
      event: "edition-registered",
      edition: edition,
      nft-id: nft-id
    })
    (ok nft-id)
  )
)

;; The recording must be owned by the caller and must carry the collection NFT
;; in its immutable Xtrata parent list. A newly registered recording becomes the
;; default sound immediately. Earlier children remain indexed and playable, but
;; cannot replace the newest child as the mosaic default.
(define-public (register-recording
  (core <xtrata-core-trait>)
  (nft-id uint)
  (recording-id uint)
)
  (let (
    (edition (unwrap! (map-get? NftToEdition nft-id) ERR-NOT-FOUND))
    (meta (unwrap! (try! (contract-call? core get-inscription-meta recording-id)) ERR-NOT-FOUND))
    (sequence (+ (default-to u0 (map-get? RecordingCounts nft-id)) u1))
  )
    (try! (assert-live))
    (try! (assert-core core))
    (try! (assert-current-nft-owner core nft-id))
    (asserts! (is-eq (try! (read-owner core recording-id)) (some tx-sender)) ERR-NOT-RECORDING-OWNER)
    (asserts! (is-eq (get mime-type meta) RECORDING-MIME) ERR-INVALID-MIME)
    (asserts!
      (is-some (index-of (try! (contract-call? core get-parents recording-id)) nft-id))
      ERR-NOT-CHILD
    )
    (asserts! (is-none (map-get? RecordingInfo recording-id)) ERR-RECORDING-EXISTS)
    (if (is-eq tx-sender (var-get fee-recipient))
      true
      (try! (stx-transfer? (var-get recording-fee) tx-sender (var-get fee-recipient)))
    )
    (map-set Recordings { nft-id: nft-id, sequence: sequence } recording-id)
    (map-set RecordingCounts nft-id sequence)
    (map-set RecordingInfo recording-id {
      nft-id: nft-id,
      edition: edition,
      creator: tx-sender,
      sequence: sequence,
      registered-at: stacks-block-height,
      content-hash: (get final-hash meta)
    })
    (map-set ActiveRecordings nft-id recording-id)
    (let ((revision (bump-revision nft-id)))
      (print {
        event: "recording-registered",
        nft-id: nft-id,
        edition: edition,
        recording-id: recording-id,
        sequence: sequence,
        creator: tx-sender,
        revision: revision,
        content-hash: (get final-hash meta),
        recording-fee: (var-get recording-fee),
        fee-recipient: (var-get fee-recipient)
      })
    )
    (ok recording-id)
  )
)

(define-read-only (get-system-state)
  {
    core-contract: (var-get core-contract),
    engine-id: (var-get engine-id),
    paused: (var-get paused),
    registered-editions: (var-get registered-editions),
    global-revision: (var-get global-revision),
    recording-fee: (var-get recording-fee),
    fee-recipient: (var-get fee-recipient)
  }
)

(define-read-only (get-recording-fee)
  (var-get recording-fee)
)

(define-read-only (get-fee-recipient)
  (var-get fee-recipient)
)

(define-read-only (get-edition (edition uint))
  (if (and (> edition u0) (<= edition MAX-EDITIONS))
    (some (mosaic-cell edition))
    none
  )
)

;; Thirty-two calls return the whole 1,024-cell mosaic, rather than requiring
;; 1,024 independent read-only requests.
(define-read-only (get-mosaic-page (page uint))
  (if (< page (/ MAX-EDITIONS PAGE-SIZE))
    (ok
      (get cells
        (fold append-mosaic-cell PAGE-OFFSETS {
          start: (+ (* page PAGE-SIZE) u1),
          cells: (list)
        })
      )
    )
    ERR-INVALID-PAGE
  )
)

(define-read-only (get-recording-count (nft-id uint))
  (default-to u0 (map-get? RecordingCounts nft-id))
)

(define-read-only (get-recording-id (nft-id uint) (sequence uint))
  (map-get? Recordings { nft-id: nft-id, sequence: sequence })
)

(define-read-only (get-recording (recording-id uint))
  (map-get? RecordingInfo recording-id)
)

(define-read-only (is-recognized-recording (nft-id uint) (recording-id uint))
  (match (map-get? RecordingInfo recording-id)
    info (is-eq (get nft-id info) nft-id)
    false
  )
)
