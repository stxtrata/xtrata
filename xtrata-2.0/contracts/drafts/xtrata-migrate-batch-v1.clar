;; xtrata-migrate-batch-v1
;; One-signature batch migration into xtrata-v3-2-3.
;;
;; Why this works: `contract-call?` preserves tx-sender, so when a user calls
;; migrate-batch-v1/v2 here, every inner migrate-from-* call in the core sees
;; the USER as tx-sender — ownership checks pass and the legacy tokens escrow
;; exactly as if the user had signed each migration individually. All begin-fees
;; for the batch are paid inside this single transaction.
;;
;; Wallet UX: sign once with PostConditionMode.Allow (the batch moves N legacy
;; NFTs + mints N v3 NFTs + STX fees — enumerating post-conditions per id is
;; possible client-side for the cautious path).
;;
;; NOTE: a single item failing aborts the WHOLE batch (any try! error rolls
;; back everything). The UI must pre-filter ids: owned by sender on the source
;; core AND not yet present on v3 — exactly what the migrate page's scan
;; already computes.

(define-constant ERR-EMPTY (err u400))

(define-public (migrate-batch-v1 (ids (list 25 uint)))
  (begin
    (asserts! (> (len ids) u0) ERR-EMPTY)
    (fold migrate-one-v1 ids (ok u0))
  )
)

(define-public (migrate-batch-v2 (ids (list 25 uint)))
  (begin
    (asserts! (> (len ids) u0) ERR-EMPTY)
    (fold migrate-one-v2 ids (ok u0))
  )
)

(define-private (migrate-one-v1 (id uint) (acc (response uint uint)))
  (match acc
    done (match (contract-call? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3 migrate-from-v1 id)
      ok-res (ok (+ done u1))
      err-res (err err-res))
    e (err e)
  )
)

(define-private (migrate-one-v2 (id uint) (acc (response uint uint)))
  (match acc
    done (match (contract-call? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3 migrate-from-v2-1-0 id)
      ok-res (ok (+ done u1))
      err-res (err err-res))
    e (err e)
  )
)
