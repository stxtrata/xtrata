;; Simnet form of the production Xtrata v3.2.3 gateway. Only the target
;; principal differs; this exercises the raw get-parents/get-inscription-meta
;; ABI exposed by the deployed core.

(define-constant XTRATA-CORE .mock-xtrata-core)

(define-read-only (get-owner (id uint))
  (contract-call? .mock-xtrata-core get-owner id)
)

(define-read-only (get-parents (id uint))
  (ok (contract-call? .mock-xtrata-core get-parents id))
)

(define-read-only (get-dependencies (id uint))
  (ok (contract-call? .mock-xtrata-core get-dependencies id))
)

(define-read-only (get-inscription-meta (id uint))
  (ok (contract-call? .mock-xtrata-core get-inscription-meta id))
)
