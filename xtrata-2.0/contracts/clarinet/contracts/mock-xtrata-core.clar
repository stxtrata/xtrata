;; mock-xtrata-core (simnet only)
;; Minimal stand-in for xtrata-v3-2-3: same signatures for the three
;; functions the duels contract calls (get-owner, get-inscription-hash,
;; transfer), plus a test-only mint.

(define-constant ERR-NOT-AUTHORIZED (err u403))
(define-constant ERR-NOT-FOUND (err u404))

(define-non-fungible-token xtrata-inscription uint)
(define-map Hashes uint (buff 32))

(define-public (mint (id uint) (owner principal) (hash (buff 32)))
  (begin
    (try! (nft-mint? xtrata-inscription id owner))
    (map-set Hashes id hash)
    (ok true)
  )
)

(define-read-only (get-owner (id uint))
  (ok (nft-get-owner? xtrata-inscription id))
)

(define-read-only (get-inscription-hash (id uint))
  (map-get? Hashes id)
)

(define-public (transfer (id uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) ERR-NOT-AUTHORIZED)
    (asserts! (is-eq (some sender) (nft-get-owner? xtrata-inscription id)) ERR-NOT-AUTHORIZED)
    (try! (nft-transfer? xtrata-inscription id sender recipient))
    (ok true)
  )
)
