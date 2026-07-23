;; Production read-only gateway for Xtrata v3.2.3.
;;
;; Clarity traits require response-returning methods. Xtrata's parent and meta
;; readers return raw values, so this immutable adapter normalizes those two
;; methods without storing or altering any data.

(define-constant XTRATA-CORE
  'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3
)

(define-read-only (get-owner (id uint))
  (contract-call? XTRATA-CORE get-owner id)
)

(define-read-only (get-parents (id uint))
  (ok (contract-call? XTRATA-CORE get-parents id))
)

(define-read-only (get-inscription-meta (id uint))
  (ok (contract-call? XTRATA-CORE get-inscription-meta id))
)
