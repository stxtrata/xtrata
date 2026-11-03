;; xtrata-lease-v1 (DRAFT. Not part of the arcade launch.)
;;
;; Rent the right to change one space of xtrata-world-v2 for a number of burn blocks, paid as you go.
;;
;; The registry never holds money and has no notion of rent. What it does have is time-limited grants, and a rule for
;; delegates: whoever holds GRANT on a space (through a grant from the owner) may issue non-inheriting grants of the
;; rights it holds itself, never GRANT, always expiring, at most MAX-GRANT-BLOCKS ahead (1,008 burn blocks, about a
;; week), and what it issued lapses the moment its own grant does. This contract is that delegate. The tenant pays here,
;; this contract tells the registry, and the registry does the enforcing: a tenant can never change anything outside
;; the rights offered, can never pass them on, and loses them at expiry without anyone sending a transaction.
;;
;; The money is held here, in escrow, and released block by block (the way xtrata-screen-v1 holds paid slots):
;;   - The rent is paid up front into this contract. The lessor earns it one burn block at a time and takes what has
;;     accrued with settle(), which anyone may call.
;;   - Whether a lease is still running is read from the registry, not from this contract's own records: the tenant's grant
;;     must be there, issued by this contract, for this owner's epoch, running to the agreed end, and this contract's own
;;     grant from the owner must be there with the right to grant. If the lessor revokes the tenant, pulls this contract's
;;     grant, or the space is sold (the registry bumps the epoch), the lease is dead: the lessor keeps what had accrued as of
;;     the last settle() and the tenant is refunded the rest.
;;   - So an early revoke, a sale or a pulled grant costs the lessor the unclaimed rent, never the tenant. Lessors who
;;     claim often lose almost nothing; settle before selling.
;;
;; Length: one rental is at most a week (the registry's delegate limit, MAX-GRANT-BLOCKS = 1,008). The same tenant can
;; keep extending, and an extension may never reach more than a week past now, so a lease is a rolling week: the lessor's
;; exposure and the tenant's prepayment are both bounded. The owner can always issue a longer grant directly in the registry.
;;
;; How a lease is set up (the lessor is the owner of the space):
;;   1. registry.grant(space, <this contract>, caps-to-rent-out | GRANT, inherit=false, expires=0)
;;   2. lease.offer(space, caps, price-per-block, min-blocks, max-blocks)
;; A tenant then calls lease.rent(space, blocks, price-per-block). One tenant at a time.
;;
;; Wallet note (post-conditions, deny mode): rent() sends exactly blocks * price from the tenant to this contract;
;; settle() and surrender() send from this contract, so a wallet declares what quote-settle(space) returns.
;;
;; Still open: the tenant is a wallet (a contract cannot rent); the operator's fee is taken from the lessor's share when it
;; is paid out, at the rate in force then. The registry address is fixed at deploy (replace .xtrata-world-v2 with the full
;; principal when deploying).

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
;; space -> the current or last lease. balance: rent still held here. remaining: burn blocks of it not yet paid out.
;; last: the height the lessor has been paid through. end: when the tenant's grant runs out.
(define-map Leases uint { tenant: principal, lessor: principal, epoch: uint, end: uint, last: uint, balance: uint, remaining: uint })

(define-read-only (get-version) "xtrata-lease-v1 draft")
(define-read-only (get-offer (space uint)) (map-get? Offers space))
(define-read-only (get-lease (space uint)) (map-get? Leases space))
(define-read-only (get-fee) { bps: (var-get fee-bps), to: (var-get fee-to) })

;; Is the lease still alive in the registry's eyes? (see the header)
(define-private (healthy? (space uint) (l { tenant: principal, lessor: principal, epoch: uint, end: uint, last: uint, balance: uint, remaining: uint }))
  (match (contract-call? .xtrata-world-v2 get-space space)
    s (and (is-eq (get epoch s) (get epoch l))
           (match (contract-call? .xtrata-world-v2 get-grant space (get tenant l))
             g (and (is-eq (get by g) current-contract) (is-eq (get epoch g) (get epoch l)) (is-eq (get expires g) (get end l)))
             false)
           (match (contract-call? .xtrata-world-v2 get-grant space current-contract)
             o (and (is-eq (get epoch o) (get epoch l)) (> (bit-and (get caps o) CAP-GRANT) u0)
                    (or (is-eq (get expires o) u0) (> (get expires o) burn-block-height)))
             false))
    false))

;; What settling would do right now, and the lease as it would stand afterwards.
;;   finished and nothing held: nothing happens.
;;   alive and inside the term: the lessor is paid for the blocks since `last`, the lease goes on.
;;   alive and past the end:    the lessor is paid everything left, the lease is finished.
;;   dead:                      the lessor is paid nothing more, the tenant is refunded everything left, finished (end is pulled back to now).
;; A lease is running exactly while its `end` is in the future; a dead lease has had its end pulled back to now.
(define-private (plan (space uint) (l { tenant: principal, lessor: principal, epoch: uint, end: uint, last: uint, balance: uint, remaining: uint }))
  (let ((now burn-block-height))
    (if (and (is-eq (get balance l) u0) (<= (get end l) now))
      { pay: u0, refund: u0, done: true, after: l }
      (if (healthy? space l)
        (let (
          (upto (if (< now (get end l)) now (get end l)))
          (k (if (> upto (get last l)) (- upto (get last l)) u0))
          (done (>= upto (get end l)))
          (pay (if done (get balance l) (if (> (get remaining l) u0) (/ (* (get balance l) k) (get remaining l)) u0))))
          { pay: pay, refund: u0, done: done,
            after: (if done
              (merge l { balance: u0, remaining: u0, last: upto })
              (merge l { balance: (- (get balance l) pay), remaining: (- (get remaining l) k), last: upto })) })
        { pay: u0, refund: (get balance l), done: true,
          after: (merge l { balance: u0, remaining: u0, last: now, end: (if (< now (get end l)) now (get end l)) }) }))))

(define-private (pay-out (to principal) (amount uint))
  (if (> amount u0)
    (as-contract? ((with-stx amount)) (try! (stx-transfer? amount tx-sender to)))
    (ok true)))

(define-private (fee-of (pay uint)) (/ (* pay (var-get fee-bps)) u10000))

;; Sends the lessor's share (less the operator's cut) and any refund. The lease is the one `plan` was made from.
(define-private (disburse (l { tenant: principal, lessor: principal, epoch: uint, end: uint, last: uint, balance: uint, remaining: uint })
                          (p { pay: uint, refund: uint, done: bool, after: { tenant: principal, lessor: principal, epoch: uint, end: uint, last: uint, balance: uint, remaining: uint } }))
  (let ((fee (fee-of (get pay p))))
    (try! (pay-out (get lessor l) (- (get pay p) fee)))
    (try! (pay-out (var-get fee-to) fee))
    (try! (pay-out (get tenant l) (get refund p)))
    (ok true)))

(define-read-only (quote-settle (space uint))
  (match (map-get? Leases space)
    l (let ((p (plan space l)) (fee (fee-of (get pay p))))
        (some { to-lessor: (- (get pay p) fee), fee: fee, refund: (get refund p), done: (get done p), balance-after: (get balance (get after p)) }))
    none))

(define-read-only (quote (space uint) (blocks uint))
  (match (map-get? Offers space)
    o (some { cost: (* (get price o) blocks) })
    none))

;; who may change the space right now by lease, if anyone
(define-read-only (active-tenant (space uint))
  (match (map-get? Leases space)
    l (if (and (< burn-block-height (get end l)) (healthy? space l)) (some (get tenant l)) none)
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

;; The lessor withdraws the offer; a tenant already in keeps the rest of the term (and the lessor keeps earning).
(define-public (cancel-offer (space uint))
  (let ((o (unwrap! (map-get? Offers space) ERR-NO-OFFER)))
    (asserts! (is-eq contract-caller (get lessor o)) ERR-NOT-AUTHORIZED)
    (map-delete Offers space)
    (print { event: "lease-offer-cancelled", space: space })
    (ok true)))

;; Anyone may settle: it pays the lessor what has accrued, or refunds the tenant if the lease is dead.
(define-public (settle (space uint))
  (let ((l (unwrap! (map-get? Leases space) ERR-NO-LEASE)) (p (plan space l)))
    (try! (disburse l p))
    (map-set Leases space (get after p))
    (print { event: "lease-settled", space: space, pay: (get pay p), refund: (get refund p), done: (get done p) })
    (ok { pay: (get pay p), refund: (get refund p), done: (get done p) })))

(define-public (rent (space uint) (blocks uint) (expected-price uint))
  (let (
    (o (unwrap! (map-get? Offers space) ERR-NO-OFFER))
    (s (unwrap! (contract-call? .xtrata-world-v2 get-space space) ERR-NO-OFFER))
    (now burn-block-height)
    (cost (* (get price o) blocks)))
    (asserts! (is-eq tx-sender contract-caller) ERR-NOT-AUTHORIZED)
    ;; the offer must still describe this owner and this owner's epoch (a sale or transfer makes it stale)
    (asserts! (and (is-eq (get owner s) (get lessor o)) (is-eq (get epoch s) (get epoch o))) ERR-STALE)
    (asserts! (not (is-eq tx-sender (get lessor o))) ERR-OWN-SPACE)
    (asserts! (is-eq expected-price (get price o)) ERR-PRICE)
    (asserts! (and (>= blocks (get min-blocks o)) (<= blocks (get max-blocks o))) ERR-INVALID)
    ;; settle whatever lease was there first: the lessor is paid what accrued, a dead lease is refunded
    (let (
      (old (map-get? Leases space))
      (settled (match old l (let ((p (plan space l))) (try! (disburse l p)) (some (get after p))) none))
      (running (match settled l (> (get end l) now) false))
      (same (match settled l (and (> (get end l) now) (is-eq (get tenant l) tx-sender)) false)))
      (asserts! (or (not running) same) ERR-TAKEN)
      (let (
        (lease (match settled
          l (if same
              { tenant: tx-sender, lessor: (get lessor o), epoch: (get epoch s), end: (+ (get end l) blocks), last: (get last l),
                balance: (+ (get balance l) cost), remaining: (+ (get remaining l) blocks) }
              { tenant: tx-sender, lessor: (get lessor o), epoch: (get epoch s), end: (+ now blocks), last: now, balance: cost, remaining: blocks })
          { tenant: tx-sender, lessor: (get lessor o), epoch: (get epoch s), end: (+ now blocks), last: now, balance: cost, remaining: blocks })))
        (asserts! (<= (get end lease) (+ now MAX-RENT-BLOCKS)) ERR-TOO-LONG)
        ;; the registry checks the rest: this contract's own grant is live, holds these rights, and may issue this long
        (try! (contract-call? .xtrata-world-v2 grant space tx-sender (get caps o) false (get end lease)))
        (if (> cost u0) (try! (stx-transfer? cost tx-sender current-contract)) true)
        (map-set Leases space lease)
        (print { event: "lease", space: space, tenant: tx-sender, end: (get end lease), cost: cost })
        (ok (get end lease))))))

;; The tenant gives the space back early: the lessor is paid to now, the tenant gets the rest.
(define-public (surrender (space uint))
  (let ((l (unwrap! (map-get? Leases space) ERR-NO-LEASE)))
    (asserts! (is-eq contract-caller (get tenant l)) ERR-NOT-AUTHORIZED)
    (let (
      (p (plan space l))
      (left (get balance (get after p)))
      (fee (fee-of (get pay p))))
      (try! (pay-out (get lessor l) (- (get pay p) fee)))
      (try! (pay-out (var-get fee-to) fee))
      (try! (pay-out (get tenant l) (+ (get refund p) left)))
      ;; end the tenant's grant in the registry (it may already be gone)
      (match (contract-call? .xtrata-world-v2 get-grant space (get tenant l))
        g (if (is-eq (get by g) current-contract) (is-ok (contract-call? .xtrata-world-v2 revoke space (get tenant l))) false)
        false)
      (map-set Leases space (merge l { balance: u0, remaining: u0, last: burn-block-height,
                                       end: (if (< burn-block-height (get end l)) burn-block-height (get end l)) }))
      (print { event: "lease-surrendered", space: space, tenant: (get tenant l), pay: (get pay p), refund: (+ (get refund p) left) })
      (ok true))))

(define-public (set-fee (bps uint) (to principal))
  (begin
    (asserts! (is-eq tx-sender (var-get operator)) ERR-NOT-AUTHORIZED)
    (asserts! (<= bps MAX-FEE-BPS) ERR-INVALID)
    (var-set fee-bps bps)
    (var-set fee-to to)
    (ok true)))
