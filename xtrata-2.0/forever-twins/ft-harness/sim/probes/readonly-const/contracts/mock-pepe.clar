;; Test double reproducing the bitcoin-pepe transfer/listing semantics that matter
;; to a Forever Twins helper (transfer requires tx-sender == sender and not listed;
;; list/unlist accept tx-sender OR contract-caller as owner). Mint is test-only.
(define-non-fungible-token bitcoin-pepe uint)
(define-map market uint { price: uint })
(define-constant DEPLOYER tx-sender)
(define-public (test-mint (id uint) (to principal))
  (begin (asserts! (is-eq tx-sender DEPLOYER) (err u401)) (nft-mint? bitcoin-pepe id to)))
(define-private (is-sender-owner (id uint))
  (let ((owner (unwrap! (nft-get-owner? bitcoin-pepe id) false)))
    (or (is-eq tx-sender owner) (is-eq contract-caller owner))))
(define-public (list-in-ustx (id uint) (price uint))
  (begin (asserts! (is-sender-owner id) (err u401)) (ok (map-set market id { price: price }))))
(define-public (unlist-in-ustx (id uint))
  (begin (asserts! (is-sender-owner id) (err u401)) (ok (map-delete market id))))
(define-public (transfer (id uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) (err u401))
    (asserts! (is-none (map-get? market id)) (err u403))
    (nft-transfer? bitcoin-pepe id sender recipient)))
(define-read-only (get-owner (id uint)) (ok (nft-get-owner? bitcoin-pepe id)))
