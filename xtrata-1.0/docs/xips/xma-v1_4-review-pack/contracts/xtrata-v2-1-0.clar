;; SIMNET STUB ONLY - minimal legacy interface for compiling xtrata-v3-2-3 in tests.
;; Never deploy. Real legacy contracts exist on mainnet.
(define-read-only (get-inscription-meta (id uint))
  (if false
    (some {
      owner: tx-sender, creator: tx-sender,
      mime-type: "", total-size: u0, total-chunks: u0,
      sealed: true, final-hash: 0x0000000000000000000000000000000000000000000000000000000000000000
    })
    none
  )
)
(define-read-only (get-token-uri-raw (id uint))
  (if false (some "") none)
)
(define-read-only (get-dependencies (id uint))
  (list)
)
(define-read-only (get-chunk (id uint) (index uint))
  (if false (some 0x00) none)
)
(define-read-only (get-chunk-batch (id uint) (indexes (list 50 uint)))
  (list)
)
(define-public (transfer (id uint) (sender principal) (recipient principal))
  (begin
    (asserts! false (err u404))
    (ok true)
  )
)
