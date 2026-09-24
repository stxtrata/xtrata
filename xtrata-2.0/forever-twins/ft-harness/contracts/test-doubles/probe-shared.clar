(use-trait nft-trait .sip009-nft-trait.nft-trait)
(define-map Sources principal (string-ascii 128))
(define-public (register (src principal) (asset (string-ascii 128))) (ok (map-set Sources src asset)))
;; pull: holder deposits via trait call
(define-public (deposit (src <nft-trait>) (id uint))
  (begin (asserts! (is-some (map-get? Sources (contract-of src))) (err u1))
    (contract-call? src transfer id tx-sender current-contract)))
;; release with a runtime-selected contract + asset name in the allowance
(define-public (release (src <nft-trait>) (id uint) (to principal))
  (let ((asset (unwrap! (map-get? Sources (contract-of src)) (err u1))))
    (as-contract? ((with-nft (contract-of src) asset (list id)))
      (try! (contract-call? src transfer id current-contract to)))))
;; release with a WRONG asset name registered, to see the allowance bite
