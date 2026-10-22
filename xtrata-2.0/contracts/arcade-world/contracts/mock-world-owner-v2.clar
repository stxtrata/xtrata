;; mock-world-owner-v2 (simnet only)
;; A contract acting as the root owner of xtrata-world-v2, like a multi-signature owner would.

(define-public (relay-accept) (contract-call? .xtrata-world-v2 accept-root-owner))
(define-public (relay-set-treasury (who principal)) (contract-call? .xtrata-world-v2 set-treasury who))
(define-public (relay-set-admin (who principal) (caps uint)) (contract-call? .xtrata-world-v2 set-admin who caps))
