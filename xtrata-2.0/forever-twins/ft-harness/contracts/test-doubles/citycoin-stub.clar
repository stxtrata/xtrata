;; [simnet] Stand-in for the CityCoin tokens (MIA, NYC) that nyc-degens calls only in its
;; CityCoin-priced mint paths. Never exercised by the suites; present so the archived source deploys.
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin (asserts! (is-eq tx-sender sender) (err u4)) (ok true)))
