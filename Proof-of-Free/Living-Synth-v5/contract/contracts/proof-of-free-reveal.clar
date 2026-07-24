;; Proof of Free - reveal & recording-fee registry (SIP-009)
;; ---------------------------------------------------------------------------
;; The mosaic is the public face: it starts EMPTY and lights up a tile the first
;; time that tile's token LEAVES the Xtrata treasury wallet (gifted or sold) -
;; so distribution drives the reveal and the team keeps full control of pace.
;;
;; Random placement is fixed by a PRE-COMMITTED, VERIFIABLE SHUFFLE: a seed is
;; committed as a hash at deploy and revealed later (contract checks
;; sha256(seed) == hash). Token #k maps to mosaic position S[k-1], where S is a
;; Fisher-Yates shuffle of 1..1024 seeded by the revealed seed - computed
;; OFF-CHAIN by the mosaic/verifiers, so the contract never has to store the
;; permutation. The contract only guarantees the seed's integrity, tracks which
;; tokens have left treasury (a 1024-bit reveal map in 32 x 32-bit chunks), and
;; collects owner-updatable fees for inscribing child / live-set recordings.
;; ---------------------------------------------------------------------------

(impl-trait .nft-trait.nft-trait)
(define-non-fungible-token proof-of-free uint)

;; ---- config ----
(define-constant COLLECTION-SIZE u1024)       ;; 32 reveal chunks x 32 bits = 1024

;; ---- errors ----
(define-constant ERR-OWNER-ONLY (err u100))
(define-constant ERR-BAD-POSITION (err u101))
(define-constant ERR-ALREADY-MINTED (err u102))
(define-constant ERR-NOT-TOKEN-OWNER (err u104))
(define-constant ERR-SEED-COMMITTED (err u105))
(define-constant ERR-NO-COMMIT (err u106))
(define-constant ERR-ALREADY-REVEALED (err u107))
(define-constant ERR-BAD-SEED (err u108))
(define-constant ERR-BAD-KIND (err u109))

;; ---- state ----
(define-data-var contract-owner principal tx-sender)
(define-data-var treasury principal tx-sender)          ;; the Xtrata wallet
(define-data-var minted-count uint u0)
(define-data-var last-token-id uint u0)
(define-data-var revealed-count uint u0)
(define-data-var reveal-hash (optional (buff 32)) none) ;; commitment
(define-data-var reveal-seed (optional (buff 32)) none) ;; revealed value
(define-data-var base-uri (string-ascii 256) "")

;; recording-inscription fees (micro-STX). 1 STX = 1,000,000 uSTX.
(define-data-var child-recording-fee uint u100000)      ;; 0.1 STX
(define-data-var live-set-fee uint u1000000)            ;; 1 STX
(define-data-var recordings-count uint u0)

(define-map reveal-chunks uint uint)                    ;; chunk-index -> 32-bit mask
(define-map inscriptions uint (string-ascii 80))        ;; token/position -> inscription id
(define-map recordings uint { payer: principal, kind: uint, parent: uint, hash: (buff 32), height: uint })

;; ---- internals ----
(define-private (is-owner) (is-eq tx-sender (var-get contract-owner)))

;; Flip the reveal bit for a token on its first exit from treasury.
(define-private (reveal-token (id uint))
  (let ((c (/ (- id u1) u32)) (b (mod (- id u1) u32)))
    (let ((cur (default-to u0 (map-get? reveal-chunks c))) (mask (bit-shift-left u1 b)))
      (if (is-eq u0 (bit-and cur mask))
        (begin
          (map-set reveal-chunks c (bit-or cur mask))
          (var-set revealed-count (+ (var-get revealed-count) u1))
          true)
        false))))

(define-private (mint-acc (id uint) (n uint))
  (if (and (>= id u1) (<= id COLLECTION-SIZE) (is-none (nft-get-owner? proof-of-free id)))
    (begin
      (unwrap-panic (nft-mint? proof-of-free id (var-get treasury)))
      (if (> id (var-get last-token-id)) (var-set last-token-id id) true)
      (+ n u1))
    n))

;; ---- SIP-009 ----
(define-read-only (get-last-token-id) (ok (var-get last-token-id)))
(define-read-only (get-token-uri (id uint)) (ok (some (var-get base-uri))))
(define-read-only (get-owner (id uint)) (ok (nft-get-owner? proof-of-free id)))

;; Standard transfer. When a token leaves the treasury for the FIRST time it is
;; revealed on the mosaic; secondary transfers change nothing.
(define-public (transfer (id uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) ERR-NOT-TOKEN-OWNER)
    (try! (nft-transfer? proof-of-free id sender recipient))
    (if (is-eq sender (var-get treasury)) (reveal-token id) true)
    (ok true)))

;; ---- minting (owner mints inscribed editions into the treasury) ----
(define-public (mint (id uint))
  (begin
    (asserts! (is-owner) ERR-OWNER-ONLY)
    (asserts! (and (>= id u1) (<= id COLLECTION-SIZE)) ERR-BAD-POSITION)
    (asserts! (is-none (nft-get-owner? proof-of-free id)) ERR-ALREADY-MINTED)
    (try! (nft-mint? proof-of-free id (var-get treasury)))
    (var-set minted-count (+ (var-get minted-count) u1))
    (if (> id (var-get last-token-id)) (var-set last-token-id id) true)
    (ok id)))

(define-public (mint-many (ids (list 200 uint)))
  (begin
    (asserts! (is-owner) ERR-OWNER-ONLY)
    (let ((n (fold mint-acc ids u0)))
      (var-set minted-count (+ (var-get minted-count) n))
      (ok n))))

;; ---- commit / reveal the placement seed ----
(define-public (commit-seed (hash (buff 32)))
  (begin
    (asserts! (is-owner) ERR-OWNER-ONLY)
    (asserts! (is-none (var-get reveal-hash)) ERR-SEED-COMMITTED)
    (var-set reveal-hash (some hash))
    (ok true)))

(define-public (reveal-seed-value (seed (buff 32)))
  (let ((h (unwrap! (var-get reveal-hash) ERR-NO-COMMIT)))
    (asserts! (is-owner) ERR-OWNER-ONLY)
    (asserts! (is-none (var-get reveal-seed)) ERR-ALREADY-REVEALED)
    (asserts! (is-eq (sha256 seed) h) ERR-BAD-SEED)
    (var-set reveal-seed (some seed))
    (ok true)))

;; ---- recording-inscription fees ----
;; kind u0 = parent/child recording (xtrata-performance) - u1 = live set (xtrata-session)
(define-public (pay-recording-fee (kind uint) (parent uint) (recording-hash (buff 32)))
  (let ((fee (if (is-eq kind u1) (var-get live-set-fee) (var-get child-recording-fee)))
        (rid (+ (var-get recordings-count) u1)))
    (asserts! (or (is-eq kind u0) (is-eq kind u1)) ERR-BAD-KIND)
    (try! (stx-transfer? fee tx-sender (var-get treasury)))
    (map-set recordings rid { payer: tx-sender, kind: kind, parent: parent, hash: recording-hash, height: burn-block-height })
    (var-set recordings-count rid)
    (print { event: "recording-fee", id: rid, kind: kind, parent: parent, payer: tx-sender, fee: fee })
    (ok rid)))

(define-public (set-child-recording-fee (n uint))
  (begin (asserts! (is-owner) ERR-OWNER-ONLY) (var-set child-recording-fee n) (ok true)))
(define-public (set-live-set-fee (n uint))
  (begin (asserts! (is-owner) ERR-OWNER-ONLY) (var-set live-set-fee n) (ok true)))

;; ---- inscription registry (position/token -> Bitcoin inscription id) ----
(define-public (set-inscription (id uint) (inscription-id (string-ascii 80)))
  (begin
    (asserts! (is-owner) ERR-OWNER-ONLY)
    (asserts! (and (>= id u1) (<= id COLLECTION-SIZE)) ERR-BAD-POSITION)
    (map-set inscriptions id inscription-id)
    (ok true)))

;; ---- admin ----
(define-public (set-treasury (who principal))
  (begin (asserts! (is-owner) ERR-OWNER-ONLY) (var-set treasury who) (ok true)))
(define-public (set-base-uri (uri (string-ascii 256)))
  (begin (asserts! (is-owner) ERR-OWNER-ONLY) (var-set base-uri uri) (ok true)))
(define-public (transfer-ownership (who principal))
  (begin (asserts! (is-owner) ERR-OWNER-ONLY) (var-set contract-owner who) (ok true)))

;; ---- read-only views for the mosaic + verifiers ----
(define-read-only (get-chunk (i uint)) (default-to u0 (map-get? reveal-chunks i)))
(define-read-only (get-revealed-chunks)
  (map get-chunk (list u0 u1 u2 u3 u4 u5 u6 u7 u8 u9 u10 u11 u12 u13 u14 u15
                       u16 u17 u18 u19 u20 u21 u22 u23 u24 u25 u26 u27 u28 u29 u30 u31)))
(define-read-only (is-revealed (id uint))
  (let ((c (/ (- id u1) u32)) (b (mod (- id u1) u32)))
    (not (is-eq u0 (bit-and (default-to u0 (map-get? reveal-chunks c)) (bit-shift-left u1 b))))))
(define-read-only (get-revealed-count) (var-get revealed-count))
(define-read-only (get-minted-count) (var-get minted-count))
(define-read-only (get-reveal-hash) (var-get reveal-hash))
(define-read-only (get-reveal-seed) (var-get reveal-seed))
(define-read-only (get-inscription (id uint)) (map-get? inscriptions id))
(define-read-only (get-recording (rid uint)) (map-get? recordings rid))
(define-read-only (get-fees) { child: (var-get child-recording-fee), liveSet: (var-get live-set-fee) })
(define-read-only (get-treasury) (var-get treasury))
(define-read-only (get-config)
  { size: COLLECTION-SIZE, owner: (var-get contract-owner), treasury: (var-get treasury),
    minted: (var-get minted-count), revealed: (var-get revealed-count),
    revealedSeed: (is-some (var-get reveal-seed)), recordings: (var-get recordings-count) })
