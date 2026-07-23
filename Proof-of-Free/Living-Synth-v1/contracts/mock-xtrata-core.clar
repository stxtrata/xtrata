;; Test-only Xtrata surface used by the Clarinet suite.

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

(define-public (mint-test-inscription
  (id uint)
  (owner principal)
  (mime-type (string-ascii 64))
  (parents (list 50 uint))
  (final-hash (buff 32))
)
  (begin
    (map-set Owners id owner)
    (map-set Parents id parents)
    (map-set Meta id {
      owner: owner,
      creator: owner,
      mime-type: mime-type,
      total-size: u128,
      total-chunks: u1,
      sealed: true,
      final-hash: final-hash
    })
    (ok id)
  )
)

(define-public (transfer-test-inscription (id uint) (new-owner principal))
  (let ((meta (unwrap! (map-get? Meta id) (err u404))))
    (map-set Owners id new-owner)
    (map-set Meta id (merge meta { owner: new-owner }))
    (ok true)
  )
)

(define-public (set-test-inscription-shape (id uint) (total-size uint) (sealed bool))
  (let ((meta (unwrap! (map-get? Meta id) (err u404))))
    (map-set Meta id (merge meta { total-size: total-size, sealed: sealed }))
    (ok true)
  )
)

(define-read-only (get-owner (id uint))
  (ok (map-get? Owners id))
)

(define-read-only (get-parents (id uint))
  (default-to (list) (map-get? Parents id))
)

(define-read-only (get-inscription-meta (id uint))
  (map-get? Meta id)
)
