(define-constant SRC .mock-pepe)
;; expected to FAIL analysis: constant-bound contract-call? inside read-only
(define-read-only (owner-of (id uint)) (contract-call? SRC get-owner id))
