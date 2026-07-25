;; mock-xtrata-core
;; Minimal Clarity-3 mock of the production Xtrata core (xtrata-v3.2.3 interface),
;; used only inside the Clarinet test project so xtrata-collection-v3 tests can
;; exercise real begin/chunk/seal flows.
;;
;; Real semantics preserved:
;; - Incremental hash chain: H0 = 32 zero bytes, H(i+1) = sha256(H(i) || chunk).
;; - Sequential chunk index enforcement via UploadState.current-index.
;; - HashToId is ADVISORY only (v3.2.3: duplicate content allowed; begin does
;;   not reject already-sealed hashes; first-seen id kept).
;; - begin fee charged once per new session; resume requires matching params.
;; - Paused-core gating: while paused, only owner or AllowedCallers
;;   (checked against contract-caller) may inscribe.
;; - Native single-tx path (<= 32 chunks) incl. recursive variant.
;;
;; Error codes (u900 block so they never collide with the collection's u100s):
;;   u900 not-authorized | u901 not-found | u902 invalid-batch
;;   u903 hash-mismatch  | u904 paused    | u905 invalid-uri
;;   u906 duplicate      | u907 dependency-missing

(define-constant ERR-NOT-AUTHORIZED (err u900))
(define-constant ERR-NOT-FOUND (err u901))
(define-constant ERR-INVALID-BATCH (err u902))
(define-constant ERR-HASH-MISMATCH (err u903))
(define-constant ERR-PAUSED (err u904))
(define-constant ERR-INVALID-URI (err u905))
(define-constant ERR-DUPLICATE (err u906))
(define-constant ERR-DEPENDENCY-MISSING (err u907))

(define-constant CHUNK-SIZE u16384)
(define-constant MAX-TOTAL-CHUNKS u2048)
(define-constant MAX-UPLOAD-BATCH-SIZE u32)
(define-constant MAX-SINGLE-TX-CHUNKS u32)
(define-constant ZERO-HASH 0x0000000000000000000000000000000000000000000000000000000000000000)

(define-constant CORE-FEE-RECIPIENT tx-sender)
(define-constant BEGIN-FEE u1000)
(define-constant SINGLE-TX-FEE u1000)
(define-constant SEAL-FEE u0)

(define-data-var contract-owner principal tx-sender)
(define-data-var paused bool false)
(define-data-var next-id uint u0)

(define-map AllowedCallers principal bool)
(define-map Owners uint principal)
(define-map TokenURIs uint (string-ascii 256))
(define-map HashToId (buff 32) uint)
(define-map InscriptionDependencies uint (list 50 uint))
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

(define-private (assert-inscription-allowed)
  (begin
    (asserts!
      (or
        (not (var-get paused))
        (is-eq tx-sender (var-get contract-owner))
        (default-to false (map-get? AllowedCallers contract-caller))
      )
      ERR-PAUSED
    )
    (ok true)
  )
)

(define-private (maybe-pay (fee uint))
  (if (and (> fee u0) (not (is-eq tx-sender CORE-FEE-RECIPIENT)))
    (stx-transfer? fee tx-sender CORE-FEE-RECIPIENT)
    (ok true)
  )
)

(define-private (valid-total-shape? (total-size uint) (total-chunks uint))
  (and
    (> total-chunks u0)
    (<= total-chunks MAX-TOTAL-CHUNKS)
    (> total-size u0)
    (<= total-size (* total-chunks CHUNK-SIZE))
  )
)

(define-private (dep-exists (id uint) (acc bool))
  (and acc (is-some (map-get? Owners id)))
)

(define-private (validate-dependencies (deps (list 50 uint)))
  (fold dep-exists deps true)
)

(define-private (process-chunk
  (data (buff 16384))
  (ctx { idx: uint, run-hash: (buff 32) })
)
  {
    idx: (+ (get idx ctx) u1),
    run-hash: (sha256 (concat (get run-hash ctx) data))
  }
)

(define-private (commit-inscription
  (hash (buff 32))
  (token-uri (string-ascii 256))
  (mime (string-ascii 64))
  (total-size uint)
  (total-chunks uint)
  (deps (list 50 uint))
)
  (let ((new-id (var-get next-id)))
    (begin
      (map-set Owners new-id tx-sender)
      (map-set TokenURIs new-id token-uri)
      ;; Advisory first-seen mapping only (duplicates allowed).
      (map-insert HashToId hash new-id)
      (map-insert InscriptionMeta new-id {
        owner: tx-sender,
        creator: tx-sender,
        mime-type: mime,
        total-size: total-size,
        total-chunks: total-chunks,
        sealed: true,
        final-hash: hash
      })
      (if (> (len deps) u0)
        (map-set InscriptionDependencies new-id deps)
        true
      )
      (var-set next-id (+ new-id u1))
      new-id
    )
  )
)

;; --- admin ---

(define-public (set-paused (value bool))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (var-set paused value)
    (ok true)
  )
)

(define-public (set-allowed-caller (caller principal) (allowed bool))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (if allowed
      (map-set AllowedCallers caller true)
      (map-delete AllowedCallers caller)
    )
    (ok true)
  )
)

;; --- staged lifecycle ---

(define-public (begin-inscription
  (expected-hash (buff 32))
  (mime (string-ascii 64))
  (total-size uint)
  (total-chunks uint)
)
  (begin
    (try! (assert-inscription-allowed))
    (asserts! (valid-total-shape? total-size total-chunks) ERR-INVALID-BATCH)
    (match (map-get? UploadState { owner: tx-sender, hash: expected-hash })
      state
        (begin
          ;; Resume: params must match the original declaration.
          (asserts! (is-eq (get mime-type state) mime) ERR-INVALID-BATCH)
          (asserts! (is-eq (get total-size state) total-size) ERR-INVALID-BATCH)
          (asserts! (is-eq (get total-chunks state) total-chunks) ERR-INVALID-BATCH)
          (ok true)
        )
      (begin
        (try! (maybe-pay BEGIN-FEE))
        (map-insert UploadState
          { owner: tx-sender, hash: expected-hash }
          {
            mime-type: mime,
            total-size: total-size,
            total-chunks: total-chunks,
            current-index: u0,
            running-hash: ZERO-HASH
          }
        )
        (ok true)
      )
    )
  )
)

;; v3.2.3 semantics: always start/resume, always (ok none); dedupe is advisory.
(define-public (begin-or-get
  (expected-hash (buff 32))
  (mime (string-ascii 64))
  (total-size uint)
  (total-chunks uint)
)
  (begin
    (try! (assert-inscription-allowed))
    (try! (begin-inscription expected-hash mime total-size total-chunks))
    (ok none)
  )
)

(define-public (add-chunk-batch (hash (buff 32)) (chunks (list 32 (buff 16384))))
  (begin
    (try! (assert-inscription-allowed))
    (let (
      (state (unwrap! (map-get? UploadState { owner: tx-sender, hash: hash }) ERR-NOT-FOUND))
      (batch-len (len chunks))
      (start-idx (get current-index state))
    )
      (begin
        (asserts! (> batch-len u0) ERR-INVALID-BATCH)
        (asserts! (<= (+ start-idx batch-len) (get total-chunks state)) ERR-INVALID-BATCH)
        (let ((result (fold process-chunk chunks { idx: start-idx, run-hash: (get running-hash state) })))
          (map-set UploadState
            { owner: tx-sender, hash: hash }
            (merge state { current-index: (get idx result), running-hash: (get run-hash result) })
          )
          (ok true)
        )
      )
    )
  )
)

(define-private (seal-internal
  (expected-hash (buff 32))
  (token-uri-string (string-ascii 256))
  (dependencies (list 50 uint))
)
  (begin
    (try! (assert-inscription-allowed))
    (asserts! (validate-dependencies dependencies) ERR-DEPENDENCY-MISSING)
    (let ((state (unwrap! (map-get? UploadState { owner: tx-sender, hash: expected-hash }) ERR-NOT-FOUND)))
      (begin
        (asserts! (is-eq (get current-index state) (get total-chunks state)) ERR-INVALID-BATCH)
        (asserts! (is-eq (get running-hash state) expected-hash) ERR-HASH-MISMATCH)
        (asserts! (> (len token-uri-string) u0) ERR-INVALID-URI)
        (try! (maybe-pay SEAL-FEE))
        (map-delete UploadState { owner: tx-sender, hash: expected-hash })
        (ok (commit-inscription
          expected-hash
          token-uri-string
          (get mime-type state)
          (get total-size state)
          (get total-chunks state)
          dependencies
        ))
      )
    )
  )
)

(define-public (seal-inscription (expected-hash (buff 32)) (token-uri-string (string-ascii 256)))
  (seal-internal expected-hash token-uri-string (list))
)

(define-public (seal-recursive
  (expected-hash (buff 32))
  (token-uri-string (string-ascii 256))
  (dependencies (list 50 uint))
)
  (seal-internal expected-hash token-uri-string dependencies)
)

(define-private (seal-batch-item
  (item { hash: (buff 32), token-uri: (string-ascii 256) })
  (acc (response { idx: uint, start: uint } uint))
)
  (let ((current (try! acc)))
    (begin
      (try! (seal-internal (get hash item) (get token-uri item) (list)))
      (ok { idx: (+ (get idx current) u1), start: (get start current) })
    )
  )
)

(define-public (seal-inscription-batch
  (items (list 50 { hash: (buff 32), token-uri: (string-ascii 256) }))
)
  (begin
    (try! (assert-inscription-allowed))
    (asserts! (> (len items) u0) ERR-INVALID-BATCH)
    (let ((start-id (var-get next-id)))
      (let ((result (try! (fold seal-batch-item items (ok { idx: u0, start: start-id })))))
        (ok { start: start-id, count: (get idx result) })
      )
    )
  )
)

;; --- native single-tx path ---

(define-private (mint-single-tx-internal
  (expected-hash (buff 32))
  (mime (string-ascii 64))
  (total-size uint)
  (chunks (list 32 (buff 16384)))
  (token-uri-string (string-ascii 256))
  (dependencies (list 50 uint))
)
  (let ((chunk-count (len chunks)))
    (begin
      (try! (assert-inscription-allowed))
      (asserts! (valid-total-shape? total-size chunk-count) ERR-INVALID-BATCH)
      (asserts! (<= chunk-count MAX-SINGLE-TX-CHUNKS) ERR-INVALID-BATCH)
      (asserts! (> (len token-uri-string) u0) ERR-INVALID-URI)
      (asserts! (is-none (map-get? UploadState { owner: tx-sender, hash: expected-hash })) ERR-DUPLICATE)
      (asserts! (validate-dependencies dependencies) ERR-DEPENDENCY-MISSING)
      (let ((result (fold process-chunk chunks { idx: u0, run-hash: ZERO-HASH })))
        (begin
          (asserts! (is-eq (get run-hash result) expected-hash) ERR-HASH-MISMATCH)
          (try! (maybe-pay SINGLE-TX-FEE))
          (let ((new-id (commit-inscription
            expected-hash
            token-uri-string
            mime
            total-size
            chunk-count
            dependencies
          )))
            (ok { token-id: new-id, existed: false })
          )
        )
      )
    )
  )
)

(define-public (mint-single-tx
  (expected-hash (buff 32))
  (mime (string-ascii 64))
  (total-size uint)
  (chunks (list 32 (buff 16384)))
  (token-uri-string (string-ascii 256))
)
  (mint-single-tx-internal expected-hash mime total-size chunks token-uri-string (list))
)

(define-public (mint-single-tx-recursive
  (expected-hash (buff 32))
  (mime (string-ascii 64))
  (total-size uint)
  (chunks (list 32 (buff 16384)))
  (token-uri-string (string-ascii 256))
  (dependencies (list 50 uint))
)
  (mint-single-tx-internal expected-hash mime total-size chunks token-uri-string dependencies)
)

;; --- SIP-009-ish transfer ---

(define-public (transfer (id uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) ERR-NOT-AUTHORIZED)
    (asserts! (is-eq (some sender) (map-get? Owners id)) ERR-NOT-AUTHORIZED)
    (map-set Owners id recipient)
    (let ((meta (unwrap! (map-get? InscriptionMeta id) ERR-NOT-FOUND)))
      (map-set InscriptionMeta id (merge meta { owner: recipient }))
    )
    (ok true)
  )
)

;; --- readers ---

(define-read-only (get-id-by-hash (hash (buff 32)))
  (map-get? HashToId hash)
)

(define-read-only (get-owner (id uint))
  (ok (map-get? Owners id))
)

(define-read-only (get-token-uri (id uint))
  (ok (map-get? TokenURIs id))
)

(define-read-only (get-inscription-meta (id uint))
  (map-get? InscriptionMeta id)
)

(define-read-only (is-inscription-sealed (id uint))
  (ok (is-some (map-get? Owners id)))
)

(define-read-only (get-dependencies (id uint))
  (default-to (list) (map-get? InscriptionDependencies id))
)

(define-read-only (get-upload-state (expected-hash (buff 32)) (owner principal))
  (map-get? UploadState { owner: owner, hash: expected-hash })
)

(define-read-only (get-next-token-id)
  (ok (var-get next-id))
)

;; mode u1 = staged, u2 = single-tx (flat mock fees)
(define-read-only (quote-inscription-fee (total-size uint) (total-chunks uint) (mode uint))
  (if (is-eq mode u1)
    (ok (+ BEGIN-FEE SEAL-FEE))
    (if (is-eq mode u2)
      (ok SINGLE-TX-FEE)
      ERR-INVALID-BATCH
    )
  )
)

(define-read-only (is-paused)
  (ok (var-get paused))
)
