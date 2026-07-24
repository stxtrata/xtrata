;; xtrata-drops-v1.2
;;
;; Sponsored free-claim drops with immutable collection campaigns.
;;
;; v1.0 compatibility:
;; - create-drop / claim retain the legacy per-(creator, group-id) behaviour.
;; - relayer-facing get-listing aliases retain their existing tuple shape.
;; - claim-fee, cancel and settle-refund retain the v1.0 settlement model.
;;
;; v1.2 campaigns:
;; - a permanent creator defines supply and claim rules once;
;; - campaigns start claim-closed while inventory intake remains open;
;; - authorised operators may escrow NFTs and budgets for that creator;
;; - up to 25 NFTs may be escrowed atomically in one wallet transaction;
;; - every campaign drop uses the campaign id as its group id;
;; - campaign claims are claimant-authorised, BNS-attested, and atomically record wallet/BNS use;
;; - cancelled or unclaimed assets and unused budgets always return to creator.

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
(define-constant ERR-CAMPAIGN-CLAIM-REQUIRED (err u112))
(define-constant ERR-CAMPAIGN-LIMIT (err u113))
(define-constant ERR-BNS-REQUIRED (err u114))
(define-constant ERR-BNS-LIMIT (err u115))
(define-constant ERR-INVALID-CAMPAIGN (err u116))
(define-constant ERR-CAMPAIGN-INACTIVE (err u117))
(define-constant ERR-SIGNATURE-INVALID (err u118))
(define-constant ERR-ATTESTATION-EXPIRED (err u119))
(define-constant ERR-ATTESTER-NOT-CONFIGURED (err u120))
(define-constant ERR-CAMPAIGN-NOT-READY (err u121))
(define-constant ERR-INVALID-BATCH (err u122))

(define-constant MIN-FEE-BUDGET u50000)
(define-constant REFUND-DELAY u144)
(define-constant MAX-CAMPAIGN-SUPPLY u10000)
(define-constant MAX-CAMPAIGN-BATCH u25)
(define-constant CONTRACT-PRINCIPAL current-contract)
(define-constant NFT-ASSET-NAME "xtrata-inscription")

;; --- STATE ---

(define-data-var contract-owner principal tx-sender)
(define-data-var sponsor principal tx-sender)
(define-data-var bns-attestor-pubkey-hash (optional (buff 20)) none)
(define-data-var claim-cap uint u2000000)
(define-data-var next-drop-id uint u0)
(define-data-var next-campaign-id uint u0)

(define-map AllowedNftContracts principal bool)
(map-set AllowedNftContracts 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3 true)
(define-constant PRIMARY-NFT-CONTRACT 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3)

(define-map Campaigns
  uint
  {
    creator: principal,
    engine-id: uint,
    max-supply: uint,
    drops-created: uint,
    one-per-wallet: bool,
    require-bns: bool,
    one-per-bns: bool,
    intake-open: bool,
    active: bool,
    created-at: uint
  }
)

(define-map CampaignOperators
  { campaign-id: uint, operator: principal }
  bool
)

(define-map CampaignWalletClaims
  { campaign-id: uint, claimer: principal }
  bool
)

(define-map CampaignBnsClaims
  { campaign-id: uint, bns-key: (buff 32) }
  bool
)

(define-map CampaignEditionDrops
  { campaign-id: uint, edition: uint }
  uint
)

(define-map Drops
  uint
  {
    creator: principal,
    funder: principal,
    nft-contract: principal,
    token-id: uint,
    group-id: uint,
    campaign-id: (optional uint),
    edition: (optional uint),
    created-at: uint,
    fee-budget: uint,
    budget-remaining: uint,
    claimed: uint,
    claimer: (optional principal),
    bns-key: (optional (buff 32)),
    claimed-at: (optional uint)
  }
)

(define-map DropByToken
  { nft-contract: principal, token-id: uint }
  uint
)

;; Legacy one-per-(creator, group-id, claimer) index. Campaign claims also
;; populate this when one-per-wallet is enabled, preserving old readers.
(define-map GroupClaims
  { creator: principal, group-id: uint, claimer: principal }
  bool
)

;; --- READ-ONLY HELPERS ---

(define-read-only (get-owner) (ok (var-get contract-owner)))
(define-read-only (get-sponsor) (ok (var-get sponsor)))
(define-read-only (get-bns-attestor-pubkey-hash) (ok (var-get bns-attestor-pubkey-hash)))
(define-read-only (get-claim-cap) (ok (var-get claim-cap)))
(define-read-only (get-min-fee-budget) (ok MIN-FEE-BUDGET))
(define-read-only (get-refund-delay) (ok REFUND-DELAY))
(define-read-only (get-nft-contract) (ok PRIMARY-NFT-CONTRACT))
(define-read-only (get-next-campaign-id) (ok (var-get next-campaign-id)))

(define-read-only (is-nft-allowed (nft-principal principal))
  (ok (default-to false (map-get? AllowedNftContracts nft-principal)))
)

(define-read-only (get-last-drop-id)
  (let ((next (var-get next-drop-id)))
    (if (> next u0) (ok (- next u1)) (ok u0))
  )
)

(define-read-only (get-campaign (campaign-id uint))
  (map-get? Campaigns campaign-id)
)

(define-read-only (get-campaign-drop-id (campaign-id uint) (edition uint))
  (map-get? CampaignEditionDrops { campaign-id: campaign-id, edition: edition })
)

(define-read-only (get-max-campaign-batch) (ok MAX-CAMPAIGN-BATCH))

(define-read-only (is-campaign-operator (campaign-id uint) (operator principal))
  (match (map-get? Campaigns campaign-id)
    campaign
      (ok (or
        (is-eq operator (get creator campaign))
        (default-to false (map-get? CampaignOperators {
          campaign-id: campaign-id,
          operator: operator
        }))
      ))
    (ok false)
  )
)

(define-read-only (has-claimed-campaign-wallet (campaign-id uint) (claimer principal))
  (ok (default-to false (map-get? CampaignWalletClaims {
    campaign-id: campaign-id,
    claimer: claimer
  })))
)

(define-read-only (has-claimed-campaign-bns (campaign-id uint) (bns-key (buff 32)))
  (ok (default-to false (map-get? CampaignBnsClaims {
    campaign-id: campaign-id,
    bns-key: bns-key
  })))
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
  (ok (default-to false (map-get? GroupClaims {
    creator: creator,
    group-id: group-id,
    claimer: claimer
  })))
)

;; Relayer-compatible aliases. Extra campaign fields stay on get-drop while
;; this market-shaped projection remains unchanged from v1.0.
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

(define-private (campaign-operator-allowed
  (campaign-id uint)
  (campaign {
    creator: principal, engine-id: uint, max-supply: uint, drops-created: uint,
    one-per-wallet: bool, require-bns: bool, one-per-bns: bool, intake-open: bool, active: bool,
    created-at: uint
  })
)
  (or
    (is-eq tx-sender (get creator campaign))
    (default-to false (map-get? CampaignOperators {
      campaign-id: campaign-id,
      operator: tx-sender
    }))
  )
)

(define-private (store-drop
  (creator principal)
  (funder principal)
  (nft-principal principal)
  (token-id uint)
  (fee-budget uint)
  (group-id uint)
  (campaign-id (optional uint))
  (edition (optional uint))
)
  (let ((drop-id (var-get next-drop-id)))
    (begin
      (map-set Drops drop-id {
        creator: creator,
        funder: funder,
        nft-contract: nft-principal,
        token-id: token-id,
        group-id: group-id,
        campaign-id: campaign-id,
        edition: edition,
        created-at: stacks-block-height,
        fee-budget: fee-budget,
        budget-remaining: fee-budget,
        claimed: u0,
        claimer: none,
        bns-key: none,
        claimed-at: none
      })
      (map-set DropByToken { nft-contract: nft-principal, token-id: token-id } drop-id)
      (var-set next-drop-id (+ drop-id u1))
      drop-id
    )
  )
)

(define-private (refund-budget (drop {
    creator: principal, funder: principal, nft-contract: principal, token-id: uint,
    group-id: uint, campaign-id: (optional uint), edition: (optional uint),
    created-at: uint, fee-budget: uint, budget-remaining: uint, claimed: uint,
    claimer: (optional principal), bns-key: (optional (buff 32)),
    claimed-at: (optional uint)
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

(define-private (transfer-escrowed-nft
  (nft-contract <nft-trait>)
  (token-id uint)
  (recipient principal)
)
  (match
    (as-contract?
      ((with-nft (contract-of nft-contract) NFT-ASSET-NAME (list token-id)))
      (unwrap!
        (contract-call? nft-contract transfer token-id CONTRACT-PRINCIPAL recipient)
        ERR-NOT-AUTHORIZED
      )
    )
    transferred (ok transferred)
    allowance-violation ERR-NOT-AUTHORIZED
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

(define-public (set-bns-attestor-pubkey-hash (new-hash (optional (buff 20))))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (var-set bns-attestor-pubkey-hash new-hash)
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

;; --- CAMPAIGNS ---

(define-public (create-campaign
  (engine-id uint)
  (max-supply uint)
  (one-per-wallet bool)
  (require-bns bool)
  (one-per-bns bool)
)
  (begin
    (asserts!
      (and (> max-supply u0) (<= max-supply MAX-CAMPAIGN-SUPPLY))
      ERR-INVALID-CAMPAIGN
    )
    (asserts! (or (not one-per-bns) require-bns) ERR-INVALID-CAMPAIGN)
    (let ((campaign-id (var-get next-campaign-id)))
      (map-set Campaigns campaign-id {
        creator: tx-sender,
        engine-id: engine-id,
        max-supply: max-supply,
        drops-created: u0,
        one-per-wallet: one-per-wallet,
        require-bns: require-bns,
        one-per-bns: one-per-bns,
        intake-open: true,
        active: false,
        created-at: stacks-block-height
      })
      (var-set next-campaign-id (+ campaign-id u1))
      (print {
        event: "create-campaign",
        campaign-id: campaign-id,
        creator: tx-sender,
        engine-id: engine-id,
        max-supply: max-supply,
        one-per-wallet: one-per-wallet,
        require-bns: require-bns,
        one-per-bns: one-per-bns
      })
      (ok campaign-id)
    )
  )
)

(define-public (set-campaign-operator (campaign-id uint) (operator principal) (allowed bool))
  (let ((campaign (unwrap! (map-get? Campaigns campaign-id) ERR-NOT-FOUND)))
    (begin
      (asserts! (is-eq tx-sender (get creator campaign)) ERR-NOT-AUTHORIZED)
      (map-set CampaignOperators {
        campaign-id: campaign-id,
        operator: operator
      } allowed)
      (print {
        event: "set-campaign-operator",
        campaign-id: campaign-id,
        creator: tx-sender,
        operator: operator,
        allowed: allowed
      })
      (ok true)
    )
  )
)

(define-public (set-campaign-active (campaign-id uint) (active bool))
  (let ((campaign (unwrap! (map-get? Campaigns campaign-id) ERR-NOT-FOUND)))
    (begin
      (asserts! (is-eq tx-sender (get creator campaign)) ERR-NOT-AUTHORIZED)
      (asserts!
        (or (not active) (is-eq (get drops-created campaign) (get max-supply campaign)))
        ERR-CAMPAIGN-NOT-READY
      )
      (map-set Campaigns campaign-id (merge campaign {
        active: active,
        intake-open: (if active false (get intake-open campaign))
      }))
      (print {
        event: "set-campaign-active",
        campaign-id: campaign-id,
        creator: tx-sender,
        active: active
      })
      (ok true)
    )
  )
)

;; --- DROP CREATION ---

;; Legacy v1.0 drop creation.
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
      (let ((drop-id (store-drop
        tx-sender tx-sender nft-principal token-id fee-budget group-id none none
      )))
        (print {
          event: "create-drop",
          drop-id: drop-id,
          creator: tx-sender,
          funder: tx-sender,
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

;; Campaign drop creation. The caller owns/funds the NFT, while cancellation
;; and unused-budget refunds belong to the permanent campaign creator.
(define-public (create-campaign-drop
  (nft-contract <nft-trait>)
  (token-id uint)
  (fee-budget uint)
  (campaign-id uint)
)
  (let (
    (nft-principal (contract-of nft-contract))
    (campaign (unwrap! (map-get? Campaigns campaign-id) ERR-NOT-FOUND))
  )
    (begin
      (asserts! (get intake-open campaign) ERR-CAMPAIGN-INACTIVE)
      (asserts! (campaign-operator-allowed campaign-id campaign) ERR-NOT-AUTHORIZED)
      (asserts! (< (get drops-created campaign) (get max-supply campaign)) ERR-CAMPAIGN-LIMIT)
      (asserts! (nft-allowed nft-principal) ERR-NOT-AUTHORIZED)
      (asserts! (>= fee-budget MIN-FEE-BUDGET) ERR-INVALID-BUDGET)
      (asserts!
        (is-none (map-get? DropByToken { nft-contract: nft-principal, token-id: token-id }))
        ERR-ALREADY-LISTED
      )
      (try! (contract-call? nft-contract transfer token-id tx-sender CONTRACT-PRINCIPAL))
      (try! (stx-transfer? fee-budget tx-sender CONTRACT-PRINCIPAL))
      (let (
        (edition (get drops-created campaign))
        (drop-id (store-drop
          (get creator campaign)
          tx-sender
          nft-principal
          token-id
          fee-budget
          campaign-id
          (some campaign-id)
          (some edition)
        ))
      )
        (map-set Campaigns campaign-id (merge campaign {
          drops-created: (+ edition u1)
        }))
        (map-set CampaignEditionDrops {
          campaign-id: campaign-id,
          edition: edition
        } drop-id)
        (print {
          event: "create-campaign-drop",
          drop-id: drop-id,
          campaign-id: campaign-id,
          edition: edition,
          creator: (get creator campaign),
          funder: tx-sender,
          nft-contract: nft-principal,
          token-id: token-id,
          fee-budget: fee-budget
        })
        (ok { drop-id: drop-id, edition: edition })
      )
    )
  )
)

(define-private (store-campaign-batch-token
  (token-id uint)
  (acc (response {
    campaign-id: uint,
    creator: principal,
    fee-budget: uint,
    edition: uint,
    start-drop-id: uint
  } uint))
)
  (let (
    (current (try! acc))
    (campaign-id (get campaign-id current))
    (edition (get edition current))
  )
    (begin
      (asserts!
        (is-none (map-get? DropByToken {
          nft-contract: PRIMARY-NFT-CONTRACT,
          token-id: token-id
        }))
        ERR-ALREADY-LISTED
      )
      (try! (contract-call?
        'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3
        transfer
        token-id
        tx-sender
        CONTRACT-PRINCIPAL
      ))
      (let ((drop-id (store-drop
        (get creator current)
        tx-sender
        PRIMARY-NFT-CONTRACT
        token-id
        (get fee-budget current)
        campaign-id
        (some campaign-id)
        (some edition)
      )))
        (map-set CampaignEditionDrops {
          campaign-id: campaign-id,
          edition: edition
        } drop-id)
        (print {
          event: "create-campaign-drop",
          drop-id: drop-id,
          campaign-id: campaign-id,
          edition: edition,
          creator: (get creator current),
          funder: tx-sender,
          nft-contract: PRIMARY-NFT-CONTRACT,
          token-id: token-id,
          fee-budget: (get fee-budget current)
        })
        (ok (merge current { edition: (+ edition u1) }))
      )
    )
  )
)

;; Atomically escrows up to 25 existing Xtrata v3.2.3 inscriptions with a
;; uniform sponsorship budget. A failure for any token rolls back the complete
;; batch, including NFT transfers, STX funding, editions and global drop ids.
(define-public (create-campaign-drops
  (token-ids (list 25 uint))
  (fee-budget uint)
  (campaign-id uint)
)
  (let (
    (campaign (unwrap! (map-get? Campaigns campaign-id) ERR-NOT-FOUND))
    (count (len token-ids))
  )
    (begin
      (asserts! (> count u0) ERR-INVALID-BATCH)
      (asserts! (<= count MAX-CAMPAIGN-BATCH) ERR-INVALID-BATCH)
      (asserts! (get intake-open campaign) ERR-CAMPAIGN-INACTIVE)
      (asserts! (campaign-operator-allowed campaign-id campaign) ERR-NOT-AUTHORIZED)
      (asserts!
        (<= (+ (get drops-created campaign) count) (get max-supply campaign))
        ERR-CAMPAIGN-LIMIT
      )
      (asserts! (>= fee-budget MIN-FEE-BUDGET) ERR-INVALID-BUDGET)
      (try! (stx-transfer? (* fee-budget count) tx-sender CONTRACT-PRINCIPAL))
      (let (
        (start-drop-id (var-get next-drop-id))
        (start-edition (get drops-created campaign))
        (result (try! (fold store-campaign-batch-token token-ids (ok {
          campaign-id: campaign-id,
          creator: (get creator campaign),
          fee-budget: fee-budget,
          edition: start-edition,
          start-drop-id: start-drop-id
        }))))
      )
        (map-set Campaigns campaign-id (merge campaign {
          drops-created: (get edition result)
        }))
        (print {
          event: "create-campaign-drops",
          campaign-id: campaign-id,
          creator: (get creator campaign),
          funder: tx-sender,
          start-drop-id: start-drop-id,
          start-edition: start-edition,
          count: count,
          fee-budget: fee-budget
        })
        (ok {
          start-drop-id: start-drop-id,
          start-edition: start-edition,
          count: count
        })
      )
    )
  )
)

;; --- CLAIMS ---

;; Legacy v1.0 claim. Campaign drops must use claim-campaign so policy cannot
;; be bypassed with a direct self-paid transaction.
(define-public (claim (nft-contract <nft-trait>) (drop-id uint))
  (let ((drop (unwrap! (map-get? Drops drop-id) ERR-NOT-FOUND)))
    (let (
      (claimer tx-sender)
      (creator (get creator drop))
      (nft-contract-principal (get nft-contract drop))
      (token-id (get token-id drop))
      (group-id (get group-id drop))
    )
      (asserts! (is-none (get campaign-id drop)) ERR-CAMPAIGN-CLAIM-REQUIRED)
      (asserts! (nft-allowed nft-contract-principal) ERR-NOT-AUTHORIZED)
      (asserts! (is-eq (contract-of nft-contract) nft-contract-principal) ERR-NOT-FOUND)
      (asserts! (is-none (get claimed-at drop)) ERR-ALREADY-CLAIMED)
      (asserts! (not (is-eq claimer creator)) ERR-SELF-CLAIM)
      (asserts!
        (not (default-to false (map-get? GroupClaims {
          creator: creator,
          group-id: group-id,
          claimer: claimer
        })))
        ERR-GROUP-LIMIT
      )
      (try! (transfer-escrowed-nft nft-contract token-id claimer))
      (map-set GroupClaims {
        creator: creator,
        group-id: group-id,
        claimer: claimer
      } true)
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

;; The claimant submits this transaction after the relayer verifies current BNS
;; ownership and signs a short-lived attestation. This remains user-authorised
;; in both self-paid and sponsored transactions: the attestation is bound to
;; tx-sender, this contract, this chain, this campaign, this drop and the BNS key.
(define-public (claim-campaign
  (nft-contract <nft-trait>)
  (drop-id uint)
  (bns-key (optional (buff 32)))
  (expires-at uint)
  (signature (buff 65))
)
  (let ((drop (unwrap! (map-get? Drops drop-id) ERR-NOT-FOUND)))
    (let (
      (campaign-id (unwrap! (get campaign-id drop) ERR-CAMPAIGN-CLAIM-REQUIRED))
      (campaign (unwrap! (map-get? Campaigns campaign-id) ERR-NOT-FOUND))
      (creator (get creator drop))
      (nft-contract-principal (get nft-contract drop))
      (token-id (get token-id drop))
    )
      (asserts! (>= expires-at stacks-block-height) ERR-ATTESTATION-EXPIRED)
      (let (
        (attestor-hash (unwrap!
          (var-get bns-attestor-pubkey-hash)
          ERR-ATTESTER-NOT-CONFIGURED
        ))
        (payload (unwrap! (to-consensus-buff? {
          bns-key: bns-key,
          campaign-id: campaign-id,
          chain-id: chain-id,
          claimer: tx-sender,
          contract: CONTRACT-PRINCIPAL,
          drop-id: drop-id,
          expires-at: expires-at
        }) ERR-SIGNATURE-INVALID))
        (recovered-pubkey (unwrap!
          (secp256k1-recover? (sha256 payload) signature)
          ERR-SIGNATURE-INVALID
        ))
      )
      (asserts! (is-eq (hash160 recovered-pubkey) attestor-hash) ERR-SIGNATURE-INVALID)
      (asserts! (get active campaign) ERR-CAMPAIGN-INACTIVE)
      (asserts! (nft-allowed nft-contract-principal) ERR-NOT-AUTHORIZED)
      (asserts! (is-eq (contract-of nft-contract) nft-contract-principal) ERR-NOT-FOUND)
      (asserts! (is-none (get claimed-at drop)) ERR-ALREADY-CLAIMED)
      (asserts! (not (is-eq tx-sender creator)) ERR-SELF-CLAIM)
      (asserts! (or (not (get require-bns campaign)) (is-some bns-key)) ERR-BNS-REQUIRED)
      (asserts!
        (or
          (not (get one-per-wallet campaign))
          (not (default-to false (map-get? CampaignWalletClaims {
            campaign-id: campaign-id,
            claimer: tx-sender
          })))
        )
        ERR-GROUP-LIMIT
      )
      (match bns-key
        key
          (asserts!
            (or
              (not (get one-per-bns campaign))
              (not (default-to false (map-get? CampaignBnsClaims {
                campaign-id: campaign-id,
                bns-key: key
              })))
            )
            ERR-BNS-LIMIT
          )
        true
      )
      (try! (transfer-escrowed-nft nft-contract token-id tx-sender))
      (if (get one-per-wallet campaign)
        (begin
          (map-set CampaignWalletClaims {
            campaign-id: campaign-id,
            claimer: tx-sender
          } true)
          (map-set GroupClaims {
            creator: creator,
            group-id: campaign-id,
            claimer: tx-sender
          } true)
        )
        true
      )
      (match bns-key
        key
          (if (get one-per-bns campaign)
            (map-set CampaignBnsClaims {
              campaign-id: campaign-id,
              bns-key: key
            } true)
            true
          )
        true
      )
      (map-set Drops drop-id (merge drop {
        claimer: (some tx-sender),
        bns-key: bns-key,
        claimed-at: (some stacks-block-height)
      }))
      (map-delete DropByToken {
        nft-contract: nft-contract-principal,
        token-id: token-id
      })
      (print {
        event: "claim-campaign",
        drop-id: drop-id,
        campaign-id: campaign-id,
        edition: (get edition drop),
        claimer: tx-sender,
        creator: creator,
        nft-contract: nft-contract-principal,
        token-id: token-id,
        bns-key: bns-key
      })
      (ok true)
      )
    )
  )
)

;; --- CANCELLATION AND SETTLEMENT ---

(define-public (cancel (nft-contract <nft-trait>) (drop-id uint))
  (let ((drop (unwrap! (map-get? Drops drop-id) ERR-NOT-FOUND)))
    (begin
      (asserts! (nft-allowed (get nft-contract drop)) ERR-NOT-AUTHORIZED)
      (asserts! (is-eq (contract-of nft-contract) (get nft-contract drop)) ERR-NOT-FOUND)
      (asserts! (is-eq tx-sender (get creator drop)) ERR-NOT-AUTHORIZED)
      (asserts! (is-none (get claimed-at drop)) ERR-ALREADY-CLAIMED)
      (try! (transfer-escrowed-nft nft-contract (get token-id drop) (get creator drop)))
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
        funder: (get funder drop),
        campaign-id: (get campaign-id drop),
        nft-contract: (get nft-contract drop),
        token-id: (get token-id drop),
        budget-refunded: (get budget-remaining drop)
      })
      (ok true)
    )
  )
)

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
          campaign-id: (get campaign-id drop),
          refunded: (get budget-remaining drop),
          claimed: (get claimed drop)
        })
        (ok true)
      )
    )
  )
)
