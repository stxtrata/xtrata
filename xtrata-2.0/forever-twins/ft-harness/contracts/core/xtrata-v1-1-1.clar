;; [simnet stub] legacy core reader, only so v3.2.3 analyses. Never holds data here.
(define-read-only (get-chunk (id uint) (index uint)) (if (is-eq id u0) (some 0x00) none))
(define-read-only (get-chunk-batch (id uint) (indexes (list 50 uint))) (map get-one indexes))
(define-private (get-one (i uint)) (get-chunk u1 i))
