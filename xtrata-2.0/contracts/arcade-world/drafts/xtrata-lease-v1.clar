;; xtrata-lease-v1 (DRAFT. Not part of the arcade launch.)
;;
;; Rent the right to change one space of xtrata-world-v2 for a number of burn blocks.
;;
;; The registry never holds money and has no notion of rent. What it does have is time-limited grants, and a rule for
;; delegates: whoever holds GRANT on a space (through a grant from the owner) may issue non-inheriting grants of the
;; rights it holds itself, never GRANT, always expiring, at most MAX-GRANT-BLOCKS ahead (1,008 burn blocks, about a
;; week), and what it issued lapses the moment its own grant does. This contract is that delegate. The tenant pays here,
;; this contract tells the registry, and the registry does the enforcing: a tenant can never change anything outside
;; the rights offered, can never pass them on, and loses them at expiry without anyone sending a transaction.
;;
;; How a lease is set up (the lessor is the owner of the space):
;;   1. registry.grant(space, <this contract>, caps-to-rent-out | GRANT, inherit=false, expires=0)
;;   2. lease.offer(space, caps, price-per-block, min-blocks, max-blocks)
;; A tenant then calls lease.rent(space, blocks, price-per-block). One tenant at a time; the same tenant may extend.
;;
;; What this draft does NOT do (decide before it is used for real money):
;;   - The owner can still revoke the tenant in the registry at any time (the owner always can), with no refund.
;;     Protecting a tenant from that means the space is owned by a contract, not by the lessor: a later version.
;;   - A sale or transfer of the space (the registry bumps the epoch) lapses every grant at once, this contract's
;;     included, so the tenant loses the rest of the term. The offer is then stale and rent() refuses it; the new owner
;;     starts again. No pro-rata refund.
;;   - The tenant is a wallet (tx-sender is contract-caller). A contract cannot rent.
;; The registry address is fixed at deploy (replace .xtrata-world-v2 with the full principal when deploying).

(define-constant ERR-NOT-AUTHORIZED (err u400))
(define-constant ERR-NO-OFFER (err u401))
(define-constant ERR-INVALID (err u402))
(define-constant ERR-TAKEN (err u403))
(define-constant ERR-TOO-LONG (err u404))
(define-constant ERR-PRICE (err u405))
(define-constant ERR-STALE (err u406))
(define-constant ERR-NO-LEASE (err u407))
(define-constant ERR-OWN-SPACE (err u408))

(define-constant MAX-RENT-BLOCKS u1008)      ;; the registry's MAX-GRANT-BLOCKS
(define-constant CAP-GRANT u64)
(define-constant CAP-MOD u128)
(define-constant CAP-ALL u511)
(define-constant MAX-PRICE u1000000000)      ;; microSTX per block
(define-constant MAX-FEE-BPS u1000)          ;; the operator's cut is at most 10%

(define-data-var operator principal tx-sender)
(define-data-var fee-bps uint u0)
(define-data-var fee-to principal tx-sender)

;; space -> the standing offer: who made it, which rights, the price, the shortest and longest rental, the registry epoch it was made in
(define-map Offers uint { lessor: principal, caps: uint, price: uint, min-blocks: uint, max-blocks: uint, epoch: uint })
;; space -> the current or last tenant
(define-map Leases uint { tenant: principal, expires: uint, epoch: uint })

(define-read-only (get-version) "xtrata-lease-v1 draft")
(define-read-only (get-offer (space uint)) (map-get? Offers space))
(define-read-only (get-lease (space uint)) (map-get? Leases space))
(define-read-only (get-fee) { bps: (var-get fee-bps), to: (var-get fee-to) })

;; Is `who` holding a live grant on the space in its current epoch? Read from the registry, which is the truth: a sale, a
;; revoke by the owner or the end of the term all show up here without anyone telling this contract.
(define-private (grant-live? (space uint) (who principal) (epoch uint))
  (match (contract-call? .xtrata-world-v2 get-grant space who)
    g (and (is-eq (get epoch g) epoch)
           (or (is-eq (get expires g) u0) (> (get expires g) burn-block-height)))
    false))

;; the lease is live while the tenant's grant is, and this contract's own grant (which that one hangs from) is
(define-private (lease-live? (space uint) (epoch uint) (tenant principal))
  (and (grant-live? space tenant epoch) (grant-live? space current-contract epoch)))

;; who may change the space right now by lease, if anyone
(define-read-only (active-tenant (space uint))
  (match (map-get? Leases space)
    l (match (contract-call? .xtrata-world-v2 get-space space)
        s (if (and (is-eq (get epoch l) (get epoch s)) (lease-live? space (get epoch s) (get tenant l))) (some (get tenant l)) none)
        none)
    none))

(define-read-only (quote (space uint) (blocks uint))
  (match (map-get? Offers space)
    o (let ((cost (* (get price o) blocks)) (fee (/ (* cost (var-get fee-bps)) u10000)))
        (some { cost: cost, fee: fee, to-lessor: (- cost fee) }))
    none))

(define-public (offer (space uint) (caps uint) (price uint) (min-blocks uint) (max-blocks uint))
  (let ((s (unwrap! (contract-call? .xtrata-world-v2 get-space space) ERR-NO-OFFER)))
    (asserts! (is-eq contract-caller (get owner s)) ERR-NOT-AUTHORIZED)
    (asserts! (and (> caps u0) (<= caps CAP-ALL) (is-eq (bit-and caps (+ CAP-GRANT CAP-MOD)) u0)) ERR-INVALID)
    (asserts! (<= price MAX-PRICE) ERR-INVALID)
    (asserts! (and (>= min-blocks u1) (>= max-blocks min-blocks) (<= max-blocks MAX-RENT-BLOCKS)) ERR-INVALID)
    (map-set Offers space { lessor: (get owner s), caps: caps, price: price, min-blocks: min-blocks, max-blocks: max-blocks, epoch: (get epoch s) })
    (print { event: "lease-offer", space: space, lessor: (get owner s), caps: caps, price: price, min-blocks: min-blocks, max-blocks: max-blocks })
    (ok true)))

;; The lessor withdraws the offer; a tenant already in keeps the rest of the term (the lessor can still revoke in the registry).
(define-public (cancel-offer (space uint))
  (let ((o (unwrap! (map-get? Offers space) ERR-NO-OFFER)))
    (asserts! (is-eq contract-caller (get lessor o)) ERR-NOT-AUTHORIZED)
    (map-delete Offers space)
    (print { event: "lease-offer-cancelled", space: space })
    (ok true)))

(define-public (rent (space uint) (blocks uint) (expected-price uint))
  (let (
    (o (unwrap! (map-get? Offers space) ERR-NO-OFFER))
    (s (unwrap! (contract-call? .xtrata-world-v2 get-space space) ERR-NO-OFFER))
    (now burn-block-height)
    (old (map-get? Leases space))
    (live (match old l (and (is-eq (get epoch l) (get epoch s)) (lease-live? space (get epoch s) (get tenant l))) false))
    (same (and live (match old l (is-eq (get tenant l) tx-sender) false)))
    (base (match old l (if same (get expires l) now) now))
    (expires (+ base blocks))
    (cost (* (get price o) blocks))
    (fee (/ (* cost (var-get fee-bps)) u10000)))
    (asserts! (is-eq tx-sender contract-caller) ERR-NOT-AUTHORIZED)
    ;; the offer must still describe this owner and this owner's epoch (a sale or transfer makes it stale)
    (asserts! (and (is-eq (get owner s) (get lessor o)) (is-eq (get epoch s) (get epoch o))) ERR-STALE)
    (asserts! (not (is-eq tx-sender (get lessor o))) ERR-OWN-SPACE)
    (asserts! (is-eq expected-price (get price o)) ERR-PRICE)
    (asserts! (and (>= blocks (get min-blocks o)) (<= blocks (get max-blocks o))) ERR-INVALID)
    (asserts! (or (not live) same) ERR-TAKEN)
    (asserts! (<= expires (+ now MAX-RENT-BLOCKS)) ERR-TOO-LONG)
    ;; the registry checks the rest: this contract's own grant is live, holds these rights, and may issue this long
    (try! (contract-call? .xtrata-world-v2 grant space tx-sender (get caps o) false expires))
    (if (> (- cost fee) u0) (try! (stx-transfer? (- cost fee) tx-sender (get lessor o))) true)
    (if (> fee u0) (try! (stx-transfer? fee tx-sender (var-get fee-to))) true)
    (map-set Leases space { tenant: tx-sender, expires: expires, epoch: (get epoch s) })
    (print { event: "lease", space: space, tenant: tx-sender, expires: expires, cost: cost, fee: fee })
    (ok expires)))

;; The tenant gives the space back early (no refund).
(define-public (surrender (space uint))
  (let ((l (unwrap! (map-get? Leases space) ERR-NO-LEASE)))
    (asserts! (is-eq contract-caller (get tenant l)) ERR-NOT-AUTHORIZED)
    (try! (contract-call? .xtrata-world-v2 revoke space (get tenant l)))
    (map-set Leases space (merge l { expires: burn-block-height }))
    (print { event: "lease-surrendered", space: space, tenant: (get tenant l) })
    (ok true)))

(define-public (set-fee (bps uint) (to principal))
  (begin
    (asserts! (is-eq tx-sender (var-get operator)) ERR-NOT-AUTHORIZED)
    (asserts! (<= bps MAX-FEE-BPS) ERR-INVALID)
    (var-set fee-bps bps)
    (var-set fee-to to)
    (ok true)))
