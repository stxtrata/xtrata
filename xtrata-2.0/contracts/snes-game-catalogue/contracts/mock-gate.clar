;; TEST ONLY. Stand-in for a token-gate adapter.
(define-data-var allowed (optional principal) none)
(define-public (set-allowed (who (optional principal))) (ok (var-set allowed who)))
(define-read-only (can-publish (who principal)) (ok (is-eq (some who) (var-get allowed))))
