(use-trait nft-trait .sip009-nft-trait.nft-trait)
;; expected to FAIL analysis: trait dispatch inside read-only
(define-read-only (owner-of (src <nft-trait>) (id uint)) (contract-call? src get-owner id))
