;; xtrata-space-token-v1 (DRAFT. Not part of the arcade launch.)
;;
;; One SIP-009 token per wrapped space of xtrata-world-v2, so wallets and marketplaces can show, send and sell a space.
;; Custody pattern, no change to the registry:
;;   wrap:    the owner proposes the space to this contract in the registry, then calls wrap(space). This contract accepts
;;            it (so it becomes the registry owner) and mints the token, id = space id, to the previous owner.
;;   holder:  the token holder gets a standing grant of every right the registry lets an owner hand out (all but moderation).
;;            Selling the token moves that grant to the buyer in the same transaction. The registry epoch does not move,
;;            so scheduled states, bindings and portals stay as they are; only the previous holder's own grants lapse.
;;   unwrap:  the holder burns the token, this contract proposes the space back, the holder accepts it in the registry.
;; Owner-only registry functions (policy, listing, transfer lock) are not grantable, so the few that matter are forwarded here
;; for the token holder: set-policy. Add more as needed (each is a one-liner).
;; Clarity 4: as-contract? with an empty allowance list, so this contract can call the registry but can never move an asset
;; on a caller's say-so (the registry's flat transfer fee is zero at launch; if it is switched on, wrap() needs a STX allowance).
;; The registry address is fixed at deploy (replace .xtrata-world-v2 with the full principal when deploying).

(define-non-fungible-token space uint)

(define-constant ERR-NOT-AUTHORIZED (err u500))
(define-constant ERR-NOT-PROPOSED (err u501))
(define-constant ERR-NOT-WRAPPED (err u502))
(define-constant ERR-NOT-HOLDER (err u503))
(define-constant HOLDER-CAPS u383)   ;; all nine rights except moderation (128): 511 - 128

(define-data-var uri (string-ascii 200) "")

;; SIP-009
(define-read-only (get-last-token-id) (ok u0))
(define-read-only (get-token-uri (id uint)) (ok (some (var-get uri))))
(define-read-only (get-owner (id uint)) (ok (nft-get-owner? space id)))

(define-public (transfer (id uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) ERR-NOT-AUTHORIZED)
    (asserts! (is-eq (some sender) (nft-get-owner? space id)) ERR-NOT-AUTHORIZED)
    (try! (nft-transfer? space id sender recipient))
    ;; the old holder's standing grant goes, the new holder's comes: same transaction, no gap
    (try! (as-contract? () (try! (contract-call? .xtrata-world-v2 revoke id sender))))
    (try! (as-contract? () (try! (contract-call? .xtrata-world-v2 grant id recipient HOLDER-CAPS false u0))))
    (print { event: "space-token-transfer", space: id, from: sender, to: recipient })
    (ok true)))

;; The owner has already called registry.propose-space-transfer(space, <this contract>).
(define-public (wrap (id uint))
  (let ((s (unwrap! (contract-call? .xtrata-world-v2 get-space id) ERR-NOT-WRAPPED)) (holder tx-sender))
    (asserts! (is-eq (get owner s) holder) ERR-NOT-AUTHORIZED)
    (asserts! (is-eq (get pending-owner s) (some current-contract)) ERR-NOT-PROPOSED)
    (try! (as-contract? () (try! (contract-call? .xtrata-world-v2 accept-space-transfer id))))
    (try! (nft-mint? space id holder))
    (try! (as-contract? () (try! (contract-call? .xtrata-world-v2 grant id holder HOLDER-CAPS false u0))))
    (print { event: "space-wrapped", space: id, holder: holder })
    (ok true)))

;; Burns the token and offers the space back; the holder then calls registry.accept-space-transfer(space).
(define-public (unwrap (id uint))
  (let ((holder tx-sender))
    (asserts! (is-eq (some holder) (nft-get-owner? space id)) ERR-NOT-HOLDER)
    (try! (nft-burn? space id holder))
    (try! (as-contract? () (try! (contract-call? .xtrata-world-v2 revoke id holder))))
    (try! (as-contract? () (try! (contract-call? .xtrata-world-v2 propose-space-transfer id holder))))
    (print { event: "space-unwrapped", space: id, holder: holder })
    (ok true)))

;; owner-only registry functions, forwarded for the holder
(define-public (set-policy (id uint)
  (policy { max-children: uint, max-descendants: uint, max-objects: uint, max-depth: uint, runtimes: uint, tiers: uint,
            interfaces: uint, approved-only: bool, portals-in: uint, portals-out: uint, review: bool, create-fee: uint }))
  (begin
    (asserts! (is-eq (some tx-sender) (nft-get-owner? space id)) ERR-NOT-HOLDER)
    (as-contract? () (try! (contract-call? .xtrata-world-v2 set-policy id policy)))))
