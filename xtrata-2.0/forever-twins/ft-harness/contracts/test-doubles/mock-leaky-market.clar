;; Test double: a DELIBERATELY UNSAFE G2-shaped source. Its transfer neither
;; refuses nor clears listings, and buy-in-ustx moves the token from whoever
;; currently owns it. Exists only to prove the G2 listing guard is fail-closed
;; (family suite F-L4). No archived contract is known to behave like this.
(define-non-fungible-token leaky uint)
(define-map market uint { price: uint })
(define-constant DEPLOYER tx-sender)
(define-public (simnet-mint (id uint) (to principal))
  (begin (asserts! (is-eq tx-sender DEPLOYER) (err u401)) (nft-mint? leaky id to)))
(define-public (list-in-ustx (id uint) (price uint))
  (begin (asserts! (is-eq (some tx-sender) (nft-get-owner? leaky id)) (err u401)) (ok (map-set market id { price: price }))))
(define-public (unlist-in-ustx (id uint))
  (begin (asserts! (is-eq (some tx-sender) (nft-get-owner? leaky id)) (err u401)) (ok (map-delete market id))))
(define-public (buy-in-ustx (id uint))
  (let ((owner (unwrap! (nft-get-owner? leaky id) (err u404))) (l (unwrap! (map-get? market id) (err u406))))
    (try! (stx-transfer? (get price l) tx-sender owner))
    (map-delete market id)
    (nft-transfer? leaky id owner tx-sender)))
(define-public (transfer (id uint) (sender principal) (recipient principal))
  (begin (asserts! (is-eq tx-sender sender) (err u401)) (nft-transfer? leaky id sender recipient)))
(define-read-only (get-owner (id uint)) (ok (nft-get-owner? leaky id)))
(define-read-only (get-listing-in-ustx (id uint)) (map-get? market id))
