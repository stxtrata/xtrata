;; mock-xtrata-core (simnet only)
;; Stand-in for xtrata-v3-2-3 with signature-identical read-only functions used by
;; the poster and world contracts: inscription-exists, is-inscription-sealed,
;; get-inscription-hash, get-inscription-size, get-inscription-creator.
;; `put` is test-only.

(define-map Meta uint { hash: (buff 32), size: uint, creator: principal, sealed: bool })

(define-public (put (id uint) (hash (buff 32)) (size uint) (creator principal) (sealed bool))
  (ok (map-set Meta id { hash: hash, size: size, creator: creator, sealed: sealed })))

(define-read-only (inscription-exists (id uint))
  (ok (is-some (map-get? Meta id))))

(define-read-only (is-inscription-sealed (id uint))
  (match (map-get? Meta id) m (some (get sealed m)) none))

(define-read-only (get-inscription-hash (id uint))
  (match (map-get? Meta id) m (some (get hash m)) none))

(define-read-only (get-inscription-size (id uint))
  (match (map-get? Meta id) m (some (get size m)) none))

(define-read-only (get-inscription-creator (id uint))
  (match (map-get? Meta id) m (some (get creator m)) none))
