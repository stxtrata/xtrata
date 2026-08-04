;; mock-xtrata-core, a test double for xtrata-v3-2-3.
;; Implements exactly the four functions living-synth-registry consumes, plus
;; setters so a test can stage ownership, parent links and inscription meta.
;; Never deployed to mainnet.

(define-constant ERR-NOT-OWNER (err u1))

(define-map Owners uint principal)
(define-map Parents uint (list 50 uint))
(define-map Meta uint {
  owner: principal,
  creator: principal,
  mime-type: (string-ascii 64),
  total-size: uint,
  total-chunks: uint,
  sealed: bool,
  final-hash: (buff 32)
})

(define-read-only (get-owner (id uint))
  (ok (map-get? Owners id)))

(define-read-only (get-parents (id uint))
  (ok (default-to (list) (map-get? Parents id))))

(define-read-only (get-inscription-meta (id uint))
  (ok (map-get? Meta id)))

(define-public (transfer (id uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq (some tx-sender) (map-get? Owners id)) ERR-NOT-OWNER)
    (asserts! (is-eq sender tx-sender) ERR-NOT-OWNER)
    (map-set Owners id recipient)
    (ok true)))

;; ---- test staging ----

(define-public (test-set-owner (id uint) (who principal))
  (begin (map-set Owners id who) (ok true)))

(define-public (test-set-parents (id uint) (parents (list 50 uint)))
  (begin (map-set Parents id parents) (ok true)))

(define-public (test-set-meta
  (id uint)
  (owner principal)
  (mime (string-ascii 64))
  (total-size uint)
  (sealed bool)
  (final-hash (buff 32))
)
  (begin
    (map-set Meta id {
      owner: owner, creator: owner, mime-type: mime,
      total-size: total-size, total-chunks: u1, sealed: sealed, final-hash: final-hash
    })
    (map-set Owners id owner)
    (ok true)))
