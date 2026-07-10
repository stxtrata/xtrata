;; xtrata-market-sponsored-usdcx-v1.0
;;
;; USDCx escrow marketplace with seller-funded fee sponsorship.
;; Extends xtrata-market-usdc-v1.0:
;; - list-token additionally escrows an STX fee budget from the seller. The
;;   budget funds sponsored (STX-free) buys: an off-chain relayer pays the
;;   buyer's mining fee, then reimburses itself from the budget via claim-fee.
;; - buy marks the listing sold (kept in the map for settlement) instead of
;;   deleting it.
;; - claim-fee (sponsor-only, sold listings, capped) reimburses the relayer.
;; - settle-refund returns the unclaimed budget ("dust") to the seller and
;;   deletes the listing. Sponsor may settle immediately after the sale;
;;   the seller may self-settle after REFUND-DELAY blocks, so a dead relayer
;;   can never strand funds.
;; - cancel returns NFT + full remaining budget to the seller.
;;
;; ESCAPE-HATCH INVARIANT: in every reachable state the seller can recover
;; their NFT and unclaimed budget without the sponsor's cooperation.
;;
;; Clarinet/local lock targets: .xtrata-v2-1-0 and .mock-usdcx

;; [LOCAL / CLARINET]
(use-trait nft-trait .sip009-nft-trait.nft-trait)

;; [TESTNET]
;; (use-trait nft-trait 'ST1NXBK3K5YYMD6FD41MVNP3JS1GABZ8TRVX023PT.nft-trait.nft-trait)

;; [MAINNET]
;; (use-trait nft-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)

;; --- CONSTANTS ---

(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-NOT-FOUND (err u101))
(define-constant ERR-ALREADY-LISTED (err u102))
(define-constant ERR-INVALID-PRICE (err u103))
(define-constant ERR-INVALID-FEE (err u104))
(define-constant ERR-INVALID-BUDGET (err u105))
(define-constant ERR-ALREADY-SOLD (err u106))
(define-constant ERR-NOT-SOLD (err u107))
(define-constant ERR-CLAIM-TOO-LARGE (err u108))
(define-constant ERR-REFUND-LOCKED (err u109))

(define-constant BASIS-POINTS u10000)
(define-constant MAX-FEE-BPS u1000)
;; Minimum sponsorship budget a seller must escrow (0.05 STX).
(define-constant MIN-FEE-BUDGET u50000)
;; Blocks after a sale during which only the sponsor may settle (claim window).
(define-constant REFUND-DELAY u144)
(define-constant CONTRACT-PRINCIPAL (as-contract tx-sender))

;; --- STATE ---

(define-data-var contract-owner principal tx-sender)
;; The authorised fee-sponsorship relayer principal.
(define-data-var sponsor principal tx-sender)
;; Max cumulative claim-fee per listing (2 STX default), owner-tunable.
(define-data-var claim-cap uint u2000000)
(define-constant ALLOWED-NFT-CONTRACT .xtrata-v2-1-0)
(define-constant PAYMENT-TOKEN-CONTRACT .mock-usdcx)
(define-data-var fee-bps uint u0)
(define-data-var next-listing-id uint u0)

(define-map Listings
  uint
  {
    seller: principal,
    nft-contract: principal,
    token-id: uint,
    price: uint,
    created-at: uint,
    fee-budget: uint,
    budget-remaining: uint,
    claimed: uint,
    buyer: (optional principal),
    sold-at: (optional uint)
  }
)

(define-map ListingByToken
  { nft-contract: principal, token-id: uint }
  uint
)

;; --- READ-ONLY HELPERS ---

(define-read-only (get-owner) (ok (var-get contract-owner)))
(define-read-only (get-sponsor) (ok (var-get sponsor)))
(define-read-only (get-claim-cap) (ok (var-get claim-cap)))
(define-read-only (get-min-fee-budget) (ok MIN-FEE-BUDGET))
(define-read-only (get-refund-delay) (ok REFUND-DELAY))
(define-read-only (get-nft-contract) (ok ALLOWED-NFT-CONTRACT))
(define-read-only (get-payment-token) (ok PAYMENT-TOKEN-CONTRACT))
(define-read-only (get-fee-bps) (ok (var-get fee-bps)))

(define-read-only (get-last-listing-id)
  (let ((next (var-get next-listing-id)))
    (if (> next u0) (ok (- next u1)) (ok u0))
  )
)

(define-read-only (get-listing (listing-id uint))
  (map-get? Listings listing-id)
)

(define-read-only (get-listing-by-token (nft-contract principal) (token-id uint))
  (match (map-get? ListingByToken { nft-contract: nft-contract, token-id: token-id })
    listing-id (map-get? Listings listing-id)
    none
  )
)

(define-read-only (get-listing-id-by-token (nft-contract principal) (token-id uint))
  (map-get? ListingByToken { nft-contract: nft-contract, token-id: token-id })
)

;; --- PRIVATE HELPERS ---

(define-private (transfer-payment (amount uint) (sender principal) (recipient principal))
  (contract-call? .mock-usdcx transfer amount sender recipient none)
)

(define-private (refund-budget (listing-id uint) (listing {
    seller: principal, nft-contract: principal, token-id: uint, price: uint,
    created-at: uint, fee-budget: uint, budget-remaining: uint, claimed: uint,
    buyer: (optional principal), sold-at: (optional uint)
  }))
  (let ((remaining (get budget-remaining listing)) (seller (get seller listing)))
    (if (> remaining u0)
      (as-contract (stx-transfer? remaining tx-sender seller))
      (ok true)
    )
  )
)

;; --- ADMIN ---

(define-public (set-fee-bps (new-fee uint))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (asserts! (<= new-fee MAX-FEE-BPS) ERR-INVALID-FEE)
    (var-set fee-bps new-fee)
    (ok true)
  )
)

(define-public (set-sponsor (new-sponsor principal))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (var-set sponsor new-sponsor)
    (ok true)
  )
)

(define-public (set-claim-cap (new-cap uint))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (var-set claim-cap new-cap)
    (ok true)
  )
)

;; --- MARKET FUNCTIONS ---

;; List an inscription for sale, escrowing the NFT and an STX fee budget that
;; will sponsor the buyer's mining fee. Unused budget is refunded on
;; settle-refund or cancel.
(define-public (list-token (nft-contract <nft-trait>) (token-id uint) (price uint) (fee-budget uint))
  (let ((nft-principal (contract-of nft-contract)))
    (begin
      (asserts! (is-eq nft-principal ALLOWED-NFT-CONTRACT) ERR-NOT-AUTHORIZED)
      (asserts! (> price u0) ERR-INVALID-PRICE)
      (asserts! (>= fee-budget MIN-FEE-BUDGET) ERR-INVALID-BUDGET)
      (asserts!
        (is-none (map-get? ListingByToken { nft-contract: nft-principal, token-id: token-id }))
        ERR-ALREADY-LISTED
      )
      (try! (contract-call? nft-contract transfer token-id tx-sender CONTRACT-PRINCIPAL))
      (try! (stx-transfer? fee-budget tx-sender CONTRACT-PRINCIPAL))
      (let ((listing-id (var-get next-listing-id)))
        (map-set Listings listing-id {
          seller: tx-sender,
          nft-contract: nft-principal,
          token-id: token-id,
          price: price,
          created-at: stacks-block-height,
          fee-budget: fee-budget,
          budget-remaining: fee-budget,
          claimed: u0,
          buyer: none,
          sold-at: none
        })
        (map-set ListingByToken { nft-contract: nft-principal, token-id: token-id } listing-id)
        (var-set next-listing-id (+ listing-id u1))
        (print {
          event: "list",
          listing-id: listing-id,
          seller: tx-sender,
          nft-contract: nft-principal,
          token-id: token-id,
          price: price,
          fee-budget: fee-budget
        })
        (ok listing-id)
      )
    )
  )
)

;; Cancel an unsold listing: NFT and full remaining budget go back to the seller.
(define-public (cancel (nft-contract <nft-trait>) (listing-id uint))
  (let ((listing (unwrap! (map-get? Listings listing-id) ERR-NOT-FOUND)))
    (begin
      (asserts! (is-eq ALLOWED-NFT-CONTRACT (get nft-contract listing)) ERR-NOT-AUTHORIZED)
      (asserts! (is-eq (contract-of nft-contract) (get nft-contract listing)) ERR-NOT-FOUND)
      (asserts! (is-eq tx-sender (get seller listing)) ERR-NOT-AUTHORIZED)
      (asserts! (is-none (get sold-at listing)) ERR-ALREADY-SOLD)
      (try!
        (as-contract
          (contract-call?
            nft-contract
            transfer
            (get token-id listing)
            CONTRACT-PRINCIPAL
            (get seller listing)
          )
        )
      )
      (try! (refund-budget listing-id listing))
      (map-delete Listings listing-id)
      (map-delete ListingByToken {
        nft-contract: (get nft-contract listing),
        token-id: (get token-id listing)
      })
      (print {
        event: "cancel",
        listing-id: listing-id,
        seller: (get seller listing),
        nft-contract: (get nft-contract listing),
        token-id: (get token-id listing),
        budget-refunded: (get budget-remaining listing)
      })
      (ok true)
    )
  )
)

;; Buy a listed inscription. Works both self-paid and as the inner call of a
;; sponsored transaction (tx-sender is the buyer either way). The listing is
;; kept (marked sold) so the fee budget can be claimed/refunded afterwards.
(define-public (buy (nft-contract <nft-trait>) (listing-id uint))
  (let ((listing (unwrap! (map-get? Listings listing-id) ERR-NOT-FOUND)))
    (let (
      (buyer tx-sender)
      (price (get price listing))
      (seller (get seller listing))
      (nft-contract-principal (get nft-contract listing))
      (token-id (get token-id listing))
      (fee-bps-value (var-get fee-bps))
    )
      (asserts! (is-eq nft-contract-principal ALLOWED-NFT-CONTRACT) ERR-NOT-AUTHORIZED)
      (asserts! (is-eq (contract-of nft-contract) nft-contract-principal) ERR-NOT-FOUND)
      (asserts! (is-none (get sold-at listing)) ERR-ALREADY-SOLD)
      (let (
        (fee (/ (* price fee-bps-value) BASIS-POINTS))
        (seller-amount (- price fee))
      )
        (begin
          (try!
            (as-contract
              (contract-call?
                nft-contract
                transfer
                token-id
                CONTRACT-PRINCIPAL
                buyer
              )
            )
          )
          (try! (transfer-payment seller-amount buyer seller))
          (if (> fee u0)
            (begin
              (try! (transfer-payment fee buyer (var-get contract-owner)))
              true
            )
            true
          )
          (map-set Listings listing-id (merge listing {
            buyer: (some buyer),
            sold-at: (some stacks-block-height)
          }))
          (map-delete ListingByToken {
            nft-contract: nft-contract-principal,
            token-id: token-id
          })
          (print {
            event: "buy",
            listing-id: listing-id,
            buyer: buyer,
            seller: seller,
            nft-contract: nft-contract-principal,
            token-id: token-id,
            price: price,
            fee: fee
          })
          (ok true)
        )
      )
    )
  )
)

;; Reimburse the sponsor for the mining fee it paid on the buyer's sponsored
;; transaction. Sponsor-only, sold listings only, bounded by the remaining
;; budget and the per-listing claim cap.
(define-public (claim-fee (listing-id uint) (amount uint))
  (let ((listing (unwrap! (map-get? Listings listing-id) ERR-NOT-FOUND)))
    (begin
      (asserts! (is-eq tx-sender (var-get sponsor)) ERR-NOT-AUTHORIZED)
      (asserts! (is-some (get sold-at listing)) ERR-NOT-SOLD)
      (asserts! (> amount u0) ERR-CLAIM-TOO-LARGE)
      (asserts! (<= amount (get budget-remaining listing)) ERR-CLAIM-TOO-LARGE)
      (asserts! (<= (+ (get claimed listing) amount) (var-get claim-cap)) ERR-CLAIM-TOO-LARGE)
      (let ((recipient (var-get sponsor)))
        (try! (as-contract (stx-transfer? amount tx-sender recipient)))
      )
      (map-set Listings listing-id (merge listing {
        budget-remaining: (- (get budget-remaining listing) amount),
        claimed: (+ (get claimed listing) amount)
      }))
      (print {
        event: "claim-fee",
        listing-id: listing-id,
        sponsor: tx-sender,
        amount: amount,
        budget-remaining: (- (get budget-remaining listing) amount)
      })
      (ok true)
    )
  )
)

;; Return the unclaimed budget ("dust") to the seller and close the listing.
;; The sponsor may settle at any time after the sale; the seller may
;; self-settle once REFUND-DELAY blocks have passed since the sale, so funds
;; are never stranded by an unresponsive relayer.
(define-public (settle-refund (listing-id uint))
  (let ((listing (unwrap! (map-get? Listings listing-id) ERR-NOT-FOUND)))
    (let ((sold-height (unwrap! (get sold-at listing) ERR-NOT-SOLD)))
      (begin
        (asserts!
          (or
            (is-eq tx-sender (var-get sponsor))
            (and
              (is-eq tx-sender (get seller listing))
              (>= stacks-block-height (+ sold-height REFUND-DELAY))
            )
          )
          (if (is-eq tx-sender (get seller listing)) ERR-REFUND-LOCKED ERR-NOT-AUTHORIZED)
        )
        (try! (refund-budget listing-id listing))
        (map-delete Listings listing-id)
        (print {
          event: "settle-refund",
          listing-id: listing-id,
          seller: (get seller listing),
          refunded: (get budget-remaining listing),
          claimed: (get claimed listing)
        })
        (ok true)
      )
    )
  )
)
