;; FlowProof test USDCx - a freely-mintable SIP-010 stand-in for testnet demos.
;;
;; The official testnet USDCx (ST1PQHQKV....usdcx) is a real Circle CCTP / xReserve
;; bridge token: minting requires a Circle-attestor signature, so it cannot be
;; faucet-minted. FlowVault is token-agnostic -- deposit/withdraw take any
;; <sip-010-trait> -- so for testnet testing we deposit THIS token instead.
;; On mainnet, point FlowProof at the real USDCx; nothing else changes.
;;
;; Implements FlowVault's exact SIP-010 trait so it can be passed to deposit().

(impl-trait 'STD7QG84VQQ0C35SZM2EYTHZV4M8FQ0R7YNSQWPD.sip-010-trait.sip-010-trait)

(define-fungible-token usdcx)

(define-constant ERR-NOT-OWNER (err u101))
(define-constant ERR-FAUCET-CAP (err u103))

(define-data-var token-uri (optional (string-utf8 256)) none)

;; --- SIP-010 ---

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (or (is-eq tx-sender sender) (is-eq contract-caller sender)) ERR-NOT-OWNER)
    (try! (ft-transfer? usdcx amount sender recipient))
    (match memo to-print (print to-print) 0x)
    (ok true)
  )
)

(define-read-only (get-name) (ok "USDCx (FlowProof test)"))
(define-read-only (get-symbol) (ok "USDCx"))
(define-read-only (get-decimals) (ok u6))
(define-read-only (get-balance (who principal)) (ok (ft-get-balance usdcx who)))
(define-read-only (get-total-supply) (ok (ft-get-supply usdcx)))
(define-read-only (get-token-uri) (ok (var-get token-uri)))

;; --- Open faucet (testnet only): anyone can mint up to 100k per call ---

(define-public (faucet (amount uint))
  (begin
    (asserts! (<= amount u100000000000) ERR-FAUCET-CAP) ;; <= 100,000 USDCx (6 decimals)
    (ft-mint? usdcx amount tx-sender)
  )
)
