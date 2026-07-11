;; xtrata-drops-v1.0
;;
;; Sponsored free-claim drops: "Claim" as a first-class product, not
;; "buy for 0 STX". A creator escrows an inscription NFT plus an STX fee
;; budget; anyone can then CLAIM it with a sponsored transaction (fee 0,
;; zero STX needed). The off-chain relayer pays the claimer's mining fee
;; and reimburses itself from the budget via claim-fee; unused budget
;; returns to the creator via settle-refund.
;;
;; Shape mirrors xtrata-market-sponsored-stx-v1.1 so the same relayer
;; settlement path works unchanged:
;; - get-listing / get-last-listing-id read-only aliases are provided
;;   with the same tuple keys (budget-remaining, sold-at = claim height).
;; - claim marks the drop claimed (kept in the map for settlement).
;; - claim-fee (sponsor-only, claimed drops, capped) reimburses the relayer.
;; - settle-refund returns unclaimed budget to the creator and deletes the
;;   drop. Sponsor may settle immediately; the creator may self-settle
;;   after REFUND-DELAY blocks, so a dead relayer can never strand funds.
;; - cancel returns NFT + full remaining budget to the creator.
;;
;; Group limits: each drop carries a creator-chosen group-id. A claimer may
;; claim at most ONE drop per (creator, group-id), so a 50-item drop with a
;; shared group-id is one-per-person. Use a unique group-id per drop to
;; disable the limit.
;;
;; ESCAPE-HATCH INVARIANT: in every reachable state the creator can recover
;; their NFT and unclaimed budget without the sponsor's cooperation.
;;
;; CLARITY 4: escrow outflows use as-contract? with precise allowances
;; (with-nft / with-stx), so wallet-popup deploys work without a CLI signer.

;; [LOCAL / CLARINET]
;; (use-trait nft-trait .sip009-nft-trait.nft-trait)

;; [TESTNET]
;; (use-trait nft-trait 'ST1NXBK3K5YYMD6FD41MVNP3JS1GABZ8TRVX023PT.nft-trait.nft-trait)

;; [MAINNET]
(use-trait nft-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)

;; --- CONSTANTS ---

(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-NOT-FOUND (err u101))
(define-constant ERR-ALREADY-LISTED (err u102))
(define-constant ERR-INVALID-BUDGET (err u105))
(define-constant ERR-ALREADY-CLAIMED (err u106))
(define-constant ERR-NOT-CLAIMED (err u107))
(define-constant ERR-CLAIM-TOO-LARGE (err u108))
(define-constant ERR-REFUND-LOCKED (err u109))
(define-constant ERR-GROUP-LIMIT (err u110))
(define-constant ERR-SELF-CLAIM (err u111))

;; Minimum sponsorship budget a creator must escrow (0.05 STX).
(define-constant MIN-FEE-BUDGET u50000)
;; Blocks after a claim during which only the sponsor may settle.
(define-constant REFUND-DELAY u144)
(define-constant CONTRACT-PRINCIPAL current-contract)
;; Asset name of the xtrata inscription NFT (for precise C4 allowances).
(define-constant NFT-ASSET-NAME "xtrata-inscription")

;; --- STATE ---

(define-data-var contract-owner principal tx-sender)
;; The authorised fee-sponsorship relayer principal.
(define-data-var sponsor principal tx-sender)
;; Max cumulative claim-fee per drop (2 STX default), owner-tunable.
(define-data-var claim-cap uint u2000000)
;; Owner-managed allowlist of inscription cores this contract accepts.
;; v3-only by policy: v2 inscriptions must migrate to v3 first.
(define-map AllowedNftContracts principal bool)
(map-set AllowedNftContracts 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3 true)
(define-constant PRIMARY-NFT-CONTRACT 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3)
(define-data-var next-drop-id uint u0)

(define-map Drops
  uint
  {
    creator: principal,
    nft-contract: principal,
    token-id: uint,
    group-id: uint,
    created-at: uint,
    fee-budget: uint,
    budget-remaining: uint,
    claimed: uint,
    claimer: (optional principal),
    claimed-at: (optional uint)
  }
)

(define-map DropByToken
  { nft-contract: principal, token-id: uint }
  uint
)

;; One claim per (creator, group-id, claimer).
(define-map GroupClaims
  { creator: principal, group-id: uint, claimer: principal }
  bool
)

;; --- READ-ONLY HELPERS ---

(define-read-only (get-owner) (ok (var-get contract-owner)))
(define-read-only (get-sponsor) (ok (var-get sponsor)))
(define-read-only (get-claim-cap) (ok (var-get claim-cap)))
(define-read-only (get-min-fee-budget) (ok MIN-FEE-BUDGET))
(define-read-only (get-refund-delay) (ok REFUND-DELAY))
(define-read-only (get-nft-contract) (ok PRIMARY-NFT-CONTRACT))
(define-read-only (is-nft-allowed (nft-principal principal))
  (ok (default-to false (map-get? AllowedNftContracts nft-principal))))

(define-read-only (get-last-drop-id)
  (let ((next (var-get next-drop-id)))
    (if (> next u0) (ok (- next u1)) (ok u0))
  )
)

(define-read-only (get-drop (drop-id uint))
  (map-get? Drops drop-id)
)

(define-read-only (get-drop-by-token (nft-contract principal) (token-id uint))
  (match (map-get? DropByToken { nft-contract: nft-contract, token-id: token-id })
    drop-id (map-get? Drops drop-id)
    none
  )
)

(define-read-only (has-claimed-in-group (creator principal) (group-id uint) (claimer principal))
  (ok (default-to false (map-get? GroupClaims { creator: creator, group-id: group-id, claimer: claimer })))
)

;; Relayer-compatible aliases: same tuple keys the market settlement path
;; reads (seller, budget-remaining, sold-at). price is always u0.
(define-read-only (get-last-listing-id) (get-last-drop-id))

(define-read-only (get-listing (listing-id uint))
  (match (map-get? Drops listing-id)
    drop (some {
      seller: (get creator drop),
      nft-contract: (get nft-contract drop),
      token-id: (get token-id drop),
      price: u0,
      created-at: (get created-at drop),
      fee-budget: (get fee-budget drop),
      budget-remaining: (get budget-remaining drop),
      claimed: (get claimed drop),
      buyer: (get claimer drop),
      sold-at: (get claimed-at drop)
    })
    none
  )
)

;; --- PRIVATE HELPERS ---

(define-private (nft-allowed (nft-principal principal))
  (default-to false (map-get? AllowedNftContracts nft-principal))
)

(define-private (refund-budget (drop {
    creator: principal, nft-contract: principal, token-id: uint, group-id: uint,
    created-at: uint, fee-budget: uint, budget-remaining: uint, claimed: uint,
    claimer: (optional principal), claimed-at: (optional uint)
  }))
  (let ((remaining (get budget-remaining drop)) (creator (get creator drop)))
    (if (> remaining u0)
      (match (as-contract? ((with-stx remaining))
          (unwrap! (stx-transfer? remaining tx-sender creator) ERR-NOT-AUTHORIZED))
        done (ok true)
        allowance-violation ERR-NOT-AUTHORIZED
      )
      (ok true)
    )
  )
)

;; --- ADMIN ---

(define-public (set-nft-allowed (nft-principal principal) (allowed bool))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (map-set AllowedNftContracts nft-principal allowed)
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

;; --- DROP FUNCTIONS ---

;; Create a drop: escrow the NFT and an STX fee budget that will sponsor the
;; claimer's mining fee. Unused budget is refunded on settle-refund or cancel.
(define-public (create-drop (nft-contract <nft-trait>) (token-id uint) (fee-budget uint) (group-id uint))
  (let ((nft-principal (contract-of nft-contract)))
    (begin
      (asserts! (nft-allowed nft-principal) ERR-NOT-AUTHORIZED)
      (asserts! (>= fee-budget MIN-FEE-BUDGET) ERR-INVALID-BUDGET)
      (asserts!
        (is-none (map-get? DropByToken { nft-contract: nft-principal, token-id: token-id }))
        ERR-ALREADY-LISTED
      )
      (try! (contract-call? nft-contract transfer token-id tx-sender CONTRACT-PRINCIPAL))
      (try! (stx-transfer? fee-budget tx-sender CONTRACT-PRINCIPAL))
      (let ((drop-id (var-get next-drop-id)))
        (map-set Drops drop-id {
          creator: tx-sender,
          nft-contract: nft-principal,
          token-id: token-id,
          group-id: group-id,
          created-at: stacks-block-height,
          fee-budget: fee-budget,
          budget-remaining: fee-budget,
          claimed: u0,
          claimer: none,
          claimed-at: none
        })
        (map-set DropByToken { nft-contract: nft-principal, token-id: token-id } drop-id)
        (var-set next-drop-id (+ drop-id u1))
        (print {
          event: "create-drop",
          drop-id: drop-id,
          creator: tx-sender,
          nft-contract: nft-principal,
          token-id: token-id,
          group-id: group-id,
          fee-budget: fee-budget
        })
        (ok drop-id)
      )
    )
  )
)

;; Cancel an unclaimed drop: NFT and full remaining budget go back to the creator.
(define-public (cancel (nft-contract <nft-trait>) (drop-id uint))
  (let ((drop (unwrap! (map-get? Drops drop-id) ERR-NOT-FOUND)))
    (begin
      (asserts! (nft-allowed (get nft-contract drop)) ERR-NOT-AUTHORIZED)
      (asserts! (is-eq (contract-of nft-contract) (get nft-contract drop)) ERR-NOT-FOUND)
      (asserts! (is-eq tx-sender (get creator drop)) ERR-NOT-AUTHORIZED)
      (asserts! (is-none (get claimed-at drop)) ERR-ALREADY-CLAIMED)
      (unwrap!
        (as-contract?
          ((with-nft (contract-of nft-contract) NFT-ASSET-NAME (list (get token-id drop))))
          (unwrap!
            (contract-call?
              nft-contract
              transfer
              (get token-id drop)
              CONTRACT-PRINCIPAL
              (get creator drop)
            )
            ERR-NOT-AUTHORIZED
          )
        )
        ERR-NOT-AUTHORIZED
      )
      (try! (refund-budget drop))
      (map-delete Drops drop-id)
      (map-delete DropByToken {
        nft-contract: (get nft-contract drop),
        token-id: (get token-id drop)
      })
      (print {
        event: "cancel-drop",
        drop-id: drop-id,
        creator: (get creator drop),
        nft-contract: (get nft-contract drop),
        token-id: (get token-id drop),
        budget-refunded: (get budget-remaining drop)
      })
      (ok true)
    )
  )
)

;; Claim a drop for free. Works both self-paid and as the inner call of a
;; sponsored transaction (tx-sender is the claimer either way). The drop is
;; kept (marked claimed) so the fee budget can be claimed/refunded afterwards.
(define-public (claim (nft-contract <nft-trait>) (drop-id uint))
  (let ((drop (unwrap! (map-get? Drops drop-id) ERR-NOT-FOUND)))
    (let (
      (claimer tx-sender)
      (creator (get creator drop))
      (nft-contract-principal (get nft-contract drop))
      (token-id (get token-id drop))
      (group-id (get group-id drop))
    )
      (asserts! (nft-allowed nft-contract-principal) ERR-NOT-AUTHORIZED)
      (asserts! (is-eq (contract-of nft-contract) nft-contract-principal) ERR-NOT-FOUND)
      (asserts! (is-none (get claimed-at drop)) ERR-ALREADY-CLAIMED)
      (asserts! (not (is-eq claimer creator)) ERR-SELF-CLAIM)
      (asserts!
        (not (default-to false (map-get? GroupClaims { creator: creator, group-id: group-id, claimer: claimer })))
        ERR-GROUP-LIMIT
      )
      (unwrap!
        (as-contract?
          ((with-nft (contract-of nft-contract) NFT-ASSET-NAME (list token-id)))
          (unwrap!
            (contract-call?
              nft-contract
              transfer
              token-id
              CONTRACT-PRINCIPAL
              claimer
            )
            ERR-NOT-AUTHORIZED
          )
        )
        ERR-NOT-AUTHORIZED
      )
      (map-set GroupClaims { creator: creator, group-id: group-id, claimer: claimer } true)
      (map-set Drops drop-id (merge drop {
        claimer: (some claimer),
        claimed-at: (some stacks-block-height)
      }))
      (map-delete DropByToken {
        nft-contract: nft-contract-principal,
        token-id: token-id
      })
      (print {
        event: "claim",
        drop-id: drop-id,
        claimer: claimer,
        creator: creator,
        nft-contract: nft-contract-principal,
        token-id: token-id,
        group-id: group-id
      })
      (ok true)
    )
  )
)

;; Reimburse the sponsor for the mining fee it paid on the claimer's sponsored
;; transaction. Sponsor-only, claimed drops only, bounded by the remaining
;; budget and the per-drop claim cap.
(define-public (claim-fee (drop-id uint) (amount uint))
  (let ((drop (unwrap! (map-get? Drops drop-id) ERR-NOT-FOUND)))
    (begin
      (asserts! (is-eq tx-sender (var-get sponsor)) ERR-NOT-AUTHORIZED)
      (asserts! (is-some (get claimed-at drop)) ERR-NOT-CLAIMED)
      (asserts! (> amount u0) ERR-CLAIM-TOO-LARGE)
      (asserts! (<= amount (get budget-remaining drop)) ERR-CLAIM-TOO-LARGE)
      (asserts! (<= (+ (get claimed drop) amount) (var-get claim-cap)) ERR-CLAIM-TOO-LARGE)
      (let ((recipient (var-get sponsor)))
        (unwrap!
          (as-contract? ((with-stx amount))
            (unwrap! (stx-transfer? amount tx-sender recipient) ERR-NOT-AUTHORIZED))
          ERR-NOT-AUTHORIZED
        )
      )
      (map-set Drops drop-id (merge drop {
        budget-remaining: (- (get budget-remaining drop) amount),
        claimed: (+ (get claimed drop) amount)
      }))
      (print {
        event: "claim-fee",
        drop-id: drop-id,
        sponsor: tx-sender,
        amount: amount,
        budget-remaining: (- (get budget-remaining drop) amount)
      })
      (ok true)
    )
  )
)

;; Return the unclaimed budget ("dust") to the creator and close the drop.
;; The sponsor may settle at any time after the claim; the creator may
;; self-settle once REFUND-DELAY blocks have passed since the claim, so funds
;; are never stranded by an unresponsive relayer.
(define-public (settle-refund (drop-id uint))
  (let ((drop (unwrap! (map-get? Drops drop-id) ERR-NOT-FOUND)))
    (let ((claimed-height (unwrap! (get claimed-at drop) ERR-NOT-CLAIMED)))
      (begin
        (asserts!
          (or
            (is-eq tx-sender (var-get sponsor))
            (and
              (is-eq tx-sender (get creator drop))
              (>= stacks-block-height (+ claimed-height REFUND-DELAY))
            )
          )
          (if (is-eq tx-sender (get creator drop)) ERR-REFUND-LOCKED ERR-NOT-AUTHORIZED)
        )
        (try! (refund-budget drop))
        (map-delete Drops drop-id)
        (print {
          event: "settle-refund",
          drop-id: drop-id,
          creator: (get creator drop),
          refunded: (get budget-remaining drop),
          claimed: (get claimed drop)
        })
        (ok true)
      )
    )
  )
)
