;; TEST ONLY. Behaves like an adapter over a pretend Xtrata core, with the same check semantics the real
;; adapter has (exists, sealed, size, creator). Error codes u200-u203 are the adapter's.
(define-map insc uint { size: uint, creator: principal, sealed: bool })
(define-public (mock-set (id uint) (size uint) (creator principal) (sealed bool))
  (ok (map-set insc id { size: size, creator: creator, sealed: sealed })))
(define-read-only (core) (ok tx-sender))
(define-read-only (check (ins uint) (size uint) (creator principal))
  (let ((m (unwrap! (map-get? insc ins) (err u200))))
    (asserts! (get sealed m) (err u201))
    (asserts! (is-eq (get size m) size) (err u202))
    (asserts! (is-eq (get creator m) creator) (err u203))
    (ok true)))
