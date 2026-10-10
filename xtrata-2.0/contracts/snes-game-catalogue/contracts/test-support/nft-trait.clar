;; TEST ONLY. The SIP-009 trait the live Xtrata core implements (SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait).
(define-trait nft-trait
  ((get-last-token-id () (response uint uint))
   (get-token-uri (uint) (response (optional (string-ascii 256)) uint))
   (get-owner (uint) (response (optional principal) uint))
   (transfer (uint principal principal) (response bool uint))))
