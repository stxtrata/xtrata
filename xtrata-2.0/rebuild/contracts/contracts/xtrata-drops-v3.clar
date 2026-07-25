;; xtrata-drops-v3
;; Singleton drop-distribution contract for the Xtrata collection family
;; (architecture 01-ARCHITECTURE.md sections 4-6). Clarity 4.
;;
;; Design decisions documented for this version:
;; - ALL modes distribute from escrow. The collection creator escrows the
;;   already-minted collection NFTs into this contract (escrow-batch <=25),
;;   and every claim transfers an escrowed NFT out. The mode differences are
;;   purely economic:
;;     mode 1 (pre-inscribed): creator pre-inscribed everything; claimer pays
;;       own network fee.
;;     mode 2 (zero-price):    identical distribution mechanics; no fee budget
;;       required; claimer pays own network fee (UI copy must say so).
;;     mode 3 (sponsored):     activation requires a fee budget of at least
;;       MIN-FEE-BUDGET per inventory item; a relayer sponsors claim txs and
;;       settles via claim-fee / settle-refund.
;;   Direct mint-through-drop (claims that mint at claim time on the
;;   collection) is explicitly OUT OF SCOPE for this contract version and can
;;   arrive in a later iteration; this contract distributes existing items.
;; - Allocation is DETERMINISTIC SEQUENTIAL over the drop inventory (free-list
;;   of released reservation indexes first, then a monotone cursor over slots).
;;   The randomized (VRF-style) allocation described in section 4 is omitted in
;;   this version: it is cosmetic-only by design, and sequential allocation
;;   keeps the state machine and its invariants exactly checkable.
;; - The core NFT contract is a compile-time constant (same templating strategy
;;   as the collection, threat 15) because Clarity fold steps cannot capture
;;   trait references; batch escrow/recovery iterate against the pinned core.
;;   An nft-trait is still declared for interface parity of single-item paths.
;; - The collection trait carries only the mutating assignment entrypoints
;;   (trait functions must return response types, so the optional-returning
;;   read-onlys get-item/get-assignment are consumed off-chain / by tests, not
;;   through the trait). Escrow records {index -> token-id} locally; a bogus
;;   pairing only harms the creator (claims abort, inventory recoverable).
;; - "funded" is not a distinct status: a draft drop with budget is simply a
;;   draft whose fee-budget-remaining is positive; activation gates on it.
;; - Reservations (reserve-claim) are supported for public/allowlist
;;   eligibility; signed-eligibility drops claim in one step only.
;; - cancel-drop refunds the remaining budget to the creator immediately
;;   (spec 4.1.3); settle-refund's REFUND-DELAY guards the ended path.
;; - Inventory bounds: <= 25 range segments x <= 50 indexes + explicit lists,
;;   so one drop can cover up to 1250 range-selected items plus explicit ids.
;;
;; Error codes (u200+ block; collection uses u100-u125, mock core u900s):
;;   u200 ERR-NOT-AUTHORIZED          caller lacks the required role
;;   u201 ERR-NOT-FOUND               drop/claim/reservation missing
;;   u202 ERR-INVALID-MODE            mode not in {1,2,3} / eligibility not in {1,2,3}
;;   u203 ERR-INVALID-STATUS          action not allowed in current drop status
;;   u204 ERR-INVALID-CONFIG          bad create/config parameters
;;   u205 ERR-INVALID-BATCH           bad batch shape/size
;;   u206 ERR-WRONG-COLLECTION        trait arg is not the drop's collection
;;   u207 ERR-RANGE-LIMIT             too many range segments for one drop
;;   u208 ERR-NOT-IN-INVENTORY        escrow/claim index outside drop inventory
;;   u209 ERR-ALREADY-ESCROWED        index already has an escrowed token
;;   u210 ERR-NOT-ESCROWED            no escrowed token for index
;;   u211 ERR-NOT-ACTIVE              drop is not active
;;   u212 ERR-PAUSED                  drop or contract paused
;;   u213 ERR-WINDOW                  outside the claim window
;;   u214 ERR-SOLD-OUT                no claimable inventory remaining
;;   u215 ERR-WALLET-LIMIT            per-wallet limit / allowance reached
;;   u216 ERR-NOT-ALLOWLISTED         wallet not on the drop allowlist
;;   u217 ERR-SIGNATURE-INVALID       attestation signature invalid
;;   u218 ERR-ATTESTATION-EXPIRED     attestation expired
;;   u219 ERR-ATTESTOR-NOT-CONFIGURED no attestor pubkey hash set
;;   u220 ERR-ALREADY-CLAIMED         item already claimed
;;   u221 ERR-ALREADY-RESERVED        claimer already holds a reservation
;;   u222 ERR-RESERVATION-NOT-EXPIRED release before expiry
;;   u223 ERR-INVALID-BUDGET          budget below minimum / zero funding
;;   u224 ERR-FEE-TOO-LARGE           claim-fee above cap or budget
;;   u225 ERR-NOT-CLAIMED             fee settlement without unsettled claims
;;   u226 ERR-REFUND-LOCKED           creator refund before delay
;;   u227 ERR-PENDING-OWNER           invalid ownership-transfer initiation
;;   u228 ERR-NO-PENDING-OWNER        accept without a pending transfer
;;   u229 ERR-ESCROW-INCOMPLETE       activation before full escrow
;;   u230 ERR-ELIGIBILITY             wrong claim entrypoint for eligibility mode
;;   u231 ERR-TRANSFER-FAILED         escrow transfer / allowance violation

(define-constant ERR-NOT-AUTHORIZED (err u200))
(define-constant ERR-NOT-FOUND (err u201))
(define-constant ERR-INVALID-MODE (err u202))
(define-constant ERR-INVALID-STATUS (err u203))
(define-constant ERR-INVALID-CONFIG (err u204))
(define-constant ERR-INVALID-BATCH (err u205))
(define-constant ERR-WRONG-COLLECTION (err u206))
(define-constant ERR-RANGE-LIMIT (err u207))
(define-constant ERR-NOT-IN-INVENTORY (err u208))
(define-constant ERR-ALREADY-ESCROWED (err u209))
(define-constant ERR-NOT-ESCROWED (err u210))
(define-constant ERR-NOT-ACTIVE (err u211))
(define-constant ERR-PAUSED (err u212))
(define-constant ERR-WINDOW (err u213))
(define-constant ERR-SOLD-OUT (err u214))
(define-constant ERR-WALLET-LIMIT (err u215))
(define-constant ERR-NOT-ALLOWLISTED (err u216))
(define-constant ERR-SIGNATURE-INVALID (err u217))
(define-constant ERR-ATTESTATION-EXPIRED (err u218))
(define-constant ERR-ATTESTOR-NOT-CONFIGURED (err u219))
(define-constant ERR-ALREADY-CLAIMED (err u220))
(define-constant ERR-ALREADY-RESERVED (err u221))
(define-constant ERR-RESERVATION-NOT-EXPIRED (err u222))
(define-constant ERR-INVALID-BUDGET (err u223))
(define-constant ERR-FEE-TOO-LARGE (err u224))
(define-constant ERR-NOT-CLAIMED (err u225))
(define-constant ERR-REFUND-LOCKED (err u226))
(define-constant ERR-PENDING-OWNER (err u227))
(define-constant ERR-NO-PENDING-OWNER (err u228))
(define-constant ERR-ESCROW-INCOMPLETE (err u229))
(define-constant ERR-ELIGIBILITY (err u230))
(define-constant ERR-TRANSFER-FAILED (err u231))

;; modes
(define-constant MODE-PRE-INSCRIBED u1)
(define-constant MODE-ZERO-PRICE u2)
(define-constant MODE-SPONSORED u3)

;; statuses
(define-constant STATUS-DRAFT u0)
(define-constant STATUS-ACTIVE u1)
(define-constant STATUS-PAUSED u2)
(define-constant STATUS-ENDED u3)
(define-constant STATUS-CANCELLED u4)

;; eligibility
(define-constant ELIGIBILITY-PUBLIC u1)
(define-constant ELIGIBILITY-ALLOWLIST u2)
(define-constant ELIGIBILITY-SIGNED u3)

(define-constant MIN-FEE-BUDGET u50000)
(define-constant REFUND-DELAY u144)
(define-constant RESERVATION-EXPIRY u144)
(define-constant MAX-RANGES u25)
(define-constant MAX-ESCROW-BATCH u25)
(define-constant CONTRACT-PRINCIPAL current-contract)
(define-constant NFT-ASSET-NAME "xtrata-inscription")

;; XTRATA-CORE-TEMPLATE-LINE (deploy templater substitutes the line below)
;; Mainnet: (define-constant ALLOWED-NFT-CONTRACT 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3)
(define-constant ALLOWED-NFT-CONTRACT .mock-xtrata-core)

(define-constant ITER-25 (list
  u0 u1 u2 u3 u4 u5 u6 u7 u8 u9 u10 u11 u12
  u13 u14 u15 u16 u17 u18 u19 u20 u21 u22 u23 u24
))

(define-constant ITER-50 (list
  u0 u1 u2 u3 u4 u5 u6 u7 u8 u9
  u10 u11 u12 u13 u14 u15 u16 u17 u18 u19
  u20 u21 u22 u23 u24 u25 u26 u27 u28 u29
  u30 u31 u32 u33 u34 u35 u36 u37 u38 u39
  u40 u41 u42 u43 u44 u45 u46 u47 u48 u49
))

;; SIP-009-shaped transfer surface of the pinned core (interface parity).
(define-trait nft-trait
  (
    (transfer (uint principal principal) (response bool uint))
  )
)

;; Mutating assignment surface of xtrata-collection-v3. Trait functions must
;; return responses, so the optional-returning read-onlys are not carried here.
(define-trait collection-trait
  (
    (assign-to-drop (uint uint) (response bool uint))
    (assign-range-to-drop (uint uint uint) (response uint uint))
    (assign-list-to-drop ((list 50 uint) uint) (response uint uint))
    (unassign-from-drop (uint uint) (response bool uint))
    (unassign-list-from-drop ((list 50 uint) uint) (response uint uint))
  )
)

;; --- state ---

(define-data-var contract-owner principal tx-sender)
(define-data-var pending-owner (optional principal) none)
(define-data-var sponsor principal tx-sender)
(define-data-var attestor-pubkey-hash (optional (buff 20)) none)
(define-data-var claim-fee-cap uint u2000000)
(define-data-var next-drop-id uint u0)
(define-data-var paused bool false)

(define-map Drops
  { drop-id: uint }
  {
    creator: principal,
    collection: principal,
    mode: uint,
    status: uint,
    start-block: uint,
    end-block: uint,
    total-limit: uint,
    per-wallet-limit: uint,
    eligibility: uint,
    fee-budget-total: uint,
    fee-budget-remaining: uint,
    fees-settled: uint,
    inventory-count: uint,
    ranges-total: uint,
    range-count: uint,
    explicit-count: uint,
    escrowed-count: uint,
    claimed-count: uint,
    reserved-count: uint,
    free-count: uint,
    cursor: uint,
    created-at: uint,
    ended-at: (optional uint)
  }
)

;; Inventory: range segments first (slot space [0, ranges-total)), then
;; explicit indexes (slot space [ranges-total, inventory-count)).
(define-map DropRanges
  { drop-id: uint, seq: uint }
  { start: uint, end: uint, cum-before: uint }
)
(define-map DropExplicit { drop-id: uint, slot: uint } uint)
(define-map DropExplicitIndex { drop-id: uint, index: uint } uint)

(define-map EscrowedTokens { drop-id: uint, index: uint } uint)

(define-map ClaimReservations
  { drop-id: uint, claimer: principal }
  { index: uint, reserved-at: uint }
)
(define-map Claims
  { drop-id: uint, seq: uint }
  { index: uint, claimer: principal, claimed-at: uint }
)
(define-map WalletClaims { drop-id: uint, claimer: principal } uint)
(define-map ItemClaimed { drop-id: uint, index: uint } bool)
(define-map DropAllowlist { drop-id: uint, wallet: principal } uint)
(define-map DropFree { drop-id: uint, slot: uint } uint)

;; --- role assertions + small helpers ---

(define-private (assert-owner)
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (ok true)
  )
)

(define-private (get-drop-or-err (drop-id uint))
  (match (map-get? Drops { drop-id: drop-id })
    drop (ok drop)
    ERR-NOT-FOUND
  )
)

(define-private (assert-creator (drop { creator: principal, collection: principal, mode: uint, status: uint, start-block: uint, end-block: uint, total-limit: uint, per-wallet-limit: uint, eligibility: uint, fee-budget-total: uint, fee-budget-remaining: uint, fees-settled: uint, inventory-count: uint, ranges-total: uint, range-count: uint, explicit-count: uint, escrowed-count: uint, claimed-count: uint, reserved-count: uint, free-count: uint, cursor: uint, created-at: uint, ended-at: (optional uint) }))
  (begin
    (asserts! (is-eq tx-sender (get creator drop)) ERR-NOT-AUTHORIZED)
    (ok true)
  )
)

(define-private (wallet-claims-of (drop-id uint) (wallet principal))
  (default-to u0 (map-get? WalletClaims { drop-id: drop-id, claimer: wallet }))
)

(define-private (effective-limit (inventory uint) (total-limit uint))
  (if (and (> total-limit u0) (< total-limit inventory)) total-limit inventory)
)

;; --- escrow transfer plumbing (pinned core, as-contract? precise allowances) ---

(define-private (transfer-escrowed-out (token-id uint) (recipient principal))
  (match
    (as-contract?
      ((with-nft ALLOWED-NFT-CONTRACT NFT-ASSET-NAME (list token-id)))
      (unwrap!
        (contract-call? .mock-xtrata-core transfer token-id CONTRACT-PRINCIPAL recipient)
        ERR-TRANSFER-FAILED
      )
    )
    transferred (ok true)
    allowance-violation ERR-TRANSFER-FAILED
  )
)

(define-private (refund-remaining (drop-id uint))
  (let (
    (drop (try! (get-drop-or-err drop-id)))
    (remaining (get fee-budget-remaining drop))
    (creator (get creator drop))
  )
    (if (> remaining u0)
      (begin
        (match
          (as-contract? ((with-stx remaining))
            (unwrap! (stx-transfer? remaining tx-sender creator) ERR-TRANSFER-FAILED))
          done true
          allowance-violation (asserts! false ERR-TRANSFER-FAILED)
        )
        (map-set Drops { drop-id: drop-id }
          (merge drop { fee-budget-remaining: u0 }))
        (ok remaining)
      )
      (ok u0)
    )
  )
)

;; --- inventory membership + slot resolution ---

(define-private (range-member-step
  (seq uint)
  (acc { drop-id: uint, index: uint, found: bool })
)
  (if (get found acc)
    acc
    (match (map-get? DropRanges { drop-id: (get drop-id acc), seq: seq })
      range (merge acc {
        found: (and
          (>= (get index acc) (get start range))
          (< (get index acc) (get end range))
        )
      })
      acc
    )
  )
)

(define-private (in-inventory? (drop-id uint) (index uint))
  (or
    (get found (fold range-member-step ITER-25 { drop-id: drop-id, index: index, found: false }))
    (is-some (map-get? DropExplicitIndex { drop-id: drop-id, index: index }))
  )
)

(define-private (range-slot-step
  (seq uint)
  (acc { drop-id: uint, slot: uint, result: (optional uint) })
)
  (if (is-some (get result acc))
    acc
    (match (map-get? DropRanges { drop-id: (get drop-id acc), seq: seq })
      range (if (and
          (>= (get slot acc) (get cum-before range))
          (< (get slot acc) (+ (get cum-before range) (- (get end range) (get start range))))
        )
        (merge acc { result: (some (+ (get start range) (- (get slot acc) (get cum-before range)))) })
        acc
      )
      acc
    )
  )
)

(define-private (resolve-slot (drop-id uint) (slot uint) (ranges-total uint))
  (if (< slot ranges-total)
    (get result (fold range-slot-step ITER-25 { drop-id: drop-id, slot: slot, result: none }))
    (map-get? DropExplicit { drop-id: drop-id, slot: (- slot ranges-total) })
  )
)

;; --- admin ---

(define-public (initiate-contract-ownership-transfer (new-owner principal))
  (begin
    (try! (assert-owner))
    (asserts! (not (is-eq new-owner (var-get contract-owner))) ERR-PENDING-OWNER)
    (var-set pending-owner (some new-owner))
    (ok true)
  )
)

(define-public (cancel-contract-ownership-transfer)
  (begin
    (try! (assert-owner))
    (var-set pending-owner none)
    (ok true)
  )
)

(define-public (accept-contract-ownership)
  (match (var-get pending-owner)
    pending (begin
      (asserts! (is-eq tx-sender pending) ERR-NOT-AUTHORIZED)
      (var-set contract-owner tx-sender)
      (var-set pending-owner none)
      (ok true)
    )
    ERR-NO-PENDING-OWNER
  )
)

(define-public (set-sponsor (new-sponsor principal))
  (begin
    (try! (assert-owner))
    (var-set sponsor new-sponsor)
    (ok true)
  )
)

(define-public (set-attestor-pubkey-hash (new-hash (optional (buff 20))))
  (begin
    (try! (assert-owner))
    (var-set attestor-pubkey-hash new-hash)
    (ok true)
  )
)

(define-public (set-claim-fee-cap (new-cap uint))
  (begin
    (try! (assert-owner))
    (var-set claim-fee-cap new-cap)
    (ok true)
  )
)

;; Emergency stop: blocks claims/reservations everywhere, never recovery.
(define-public (set-paused (value bool))
  (begin
    (try! (assert-owner))
    (var-set paused value)
    (ok true)
  )
)

;; --- drop lifecycle ---

(define-public (create-drop
  (collection <collection-trait>)
  (mode uint)
  (eligibility uint)
  (start-block uint)
  (end-block uint)
  (total-limit uint)
  (per-wallet-limit uint)
)
  (begin
    (asserts! (or (is-eq mode MODE-PRE-INSCRIBED) (is-eq mode MODE-ZERO-PRICE) (is-eq mode MODE-SPONSORED)) ERR-INVALID-MODE)
    (asserts! (or (is-eq eligibility ELIGIBILITY-PUBLIC) (is-eq eligibility ELIGIBILITY-ALLOWLIST) (is-eq eligibility ELIGIBILITY-SIGNED)) ERR-INVALID-MODE)
    (asserts! (or (is-eq end-block u0) (<= start-block end-block)) ERR-INVALID-CONFIG)
    (let ((drop-id (var-get next-drop-id)))
      (map-insert Drops { drop-id: drop-id } {
        creator: tx-sender,
        collection: (contract-of collection),
        mode: mode,
        status: STATUS-DRAFT,
        start-block: start-block,
        end-block: end-block,
        total-limit: total-limit,
        per-wallet-limit: per-wallet-limit,
        eligibility: eligibility,
        fee-budget-total: u0,
        fee-budget-remaining: u0,
        fees-settled: u0,
        inventory-count: u0,
        ranges-total: u0,
        range-count: u0,
        explicit-count: u0,
        escrowed-count: u0,
        claimed-count: u0,
        reserved-count: u0,
        free-count: u0,
        cursor: u0,
        created-at: stacks-block-height,
        ended-at: none
      })
      (var-set next-drop-id (+ drop-id u1))
      (print { event: "create-drop", drop-id: drop-id, creator: tx-sender, collection: (contract-of collection), mode: mode, eligibility: eligibility })
      (ok drop-id)
    )
  )
)

;; --- inventory (draft only; the collection's assignment ledger enforces
;;     the one-drop-per-item invariant on-chain) ---

(define-public (add-inventory-range
  (collection <collection-trait>)
  (drop-id uint)
  (start uint)
  (end uint)
)
  (let ((drop (try! (get-drop-or-err drop-id))))
    (begin
      (try! (assert-creator drop))
      (asserts! (is-eq (contract-of collection) (get collection drop)) ERR-WRONG-COLLECTION)
      (asserts! (is-eq (get status drop) STATUS-DRAFT) ERR-INVALID-STATUS)
      (asserts! (< (get range-count drop) MAX-RANGES) ERR-RANGE-LIMIT)
      (asserts! (< start end) ERR-INVALID-BATCH)
      (let ((count (try! (contract-call? collection assign-range-to-drop start end drop-id))))
        (map-set DropRanges
          { drop-id: drop-id, seq: (get range-count drop) }
          { start: start, end: end, cum-before: (get ranges-total drop) })
        (map-set Drops { drop-id: drop-id } (merge drop {
          range-count: (+ (get range-count drop) u1),
          ranges-total: (+ (get ranges-total drop) count),
          inventory-count: (+ (get inventory-count drop) count)
        }))
        (print { event: "add-inventory-range", drop-id: drop-id, start: start, end: end, count: count })
        (ok count)
      )
    )
  )
)

(define-private (record-explicit-step
  (index uint)
  (acc { drop-id: uint, slot: uint })
)
  (begin
    (map-set DropExplicit { drop-id: (get drop-id acc), slot: (get slot acc) } index)
    (map-set DropExplicitIndex { drop-id: (get drop-id acc), index: index } (get slot acc))
    { drop-id: (get drop-id acc), slot: (+ (get slot acc) u1) }
  )
)

(define-public (add-inventory-items
  (collection <collection-trait>)
  (drop-id uint)
  (indexes (list 50 uint))
)
  (let ((drop (try! (get-drop-or-err drop-id))))
    (begin
      (try! (assert-creator drop))
      (asserts! (is-eq (contract-of collection) (get collection drop)) ERR-WRONG-COLLECTION)
      (asserts! (is-eq (get status drop) STATUS-DRAFT) ERR-INVALID-STATUS)
      (asserts! (> (len indexes) u0) ERR-INVALID-BATCH)
      (let ((count (try! (contract-call? collection assign-list-to-drop indexes drop-id))))
        (fold record-explicit-step indexes { drop-id: drop-id, slot: (get explicit-count drop) })
        (map-set Drops { drop-id: drop-id } (merge drop {
          explicit-count: (+ (get explicit-count drop) count),
          inventory-count: (+ (get inventory-count drop) count)
        }))
        (print { event: "add-inventory-items", drop-id: drop-id, count: count })
        (ok count)
      )
    )
  )
)

;; --- escrow (draft only, creator only; NFTs move creator -> this contract) ---

(define-private (escrow-step
  (entry { index: uint, token-id: uint })
  (acc (response { drop-id: uint, count: uint } uint))
)
  (let ((current (try! acc)))
    (begin
      (asserts! (in-inventory? (get drop-id current) (get index entry)) ERR-NOT-IN-INVENTORY)
      (asserts!
        (map-insert EscrowedTokens
          { drop-id: (get drop-id current), index: (get index entry) }
          (get token-id entry))
        ERR-ALREADY-ESCROWED
      )
      (try! (contract-call? .mock-xtrata-core transfer
        (get token-id entry) tx-sender CONTRACT-PRINCIPAL))
      (ok (merge current { count: (+ (get count current) u1) }))
    )
  )
)

(define-public (escrow-batch
  (drop-id uint)
  (entries (list 25 { index: uint, token-id: uint }))
)
  (let ((drop (try! (get-drop-or-err drop-id))))
    (begin
      (try! (assert-creator drop))
      (asserts! (is-eq (get status drop) STATUS-DRAFT) ERR-INVALID-STATUS)
      (asserts! (> (len entries) u0) ERR-INVALID-BATCH)
      (let ((result (try! (fold escrow-step entries (ok { drop-id: drop-id, count: u0 })))))
        (map-set Drops { drop-id: drop-id } (merge drop {
          escrowed-count: (+ (get escrowed-count drop) (get count result))
        }))
        (print { event: "escrow-batch", drop-id: drop-id, count: (get count result) })
        (ok (get count result))
      )
    )
  )
)

;; --- funding + activation ---

;; Anyone may fund a drop's sponsorship budget while it can still claim.
(define-public (fund-budget (drop-id uint) (amount uint))
  (let ((drop (try! (get-drop-or-err drop-id))))
    (begin
      (asserts! (> amount u0) ERR-INVALID-BUDGET)
      (asserts!
        (or
          (is-eq (get status drop) STATUS-DRAFT)
          (is-eq (get status drop) STATUS-ACTIVE)
          (is-eq (get status drop) STATUS-PAUSED)
        )
        ERR-INVALID-STATUS
      )
      (try! (stx-transfer? amount tx-sender CONTRACT-PRINCIPAL))
      (map-set Drops { drop-id: drop-id } (merge drop {
        fee-budget-total: (+ (get fee-budget-total drop) amount),
        fee-budget-remaining: (+ (get fee-budget-remaining drop) amount)
      }))
      (print { event: "fund-budget", drop-id: drop-id, funder: tx-sender, amount: amount })
      (ok true)
    )
  )
)

(define-public (activate-drop (drop-id uint))
  (let ((drop (try! (get-drop-or-err drop-id))))
    (begin
      (try! (assert-creator drop))
      (asserts! (is-eq (get status drop) STATUS-DRAFT) ERR-INVALID-STATUS)
      (asserts! (> (get inventory-count drop) u0) ERR-INVALID-CONFIG)
      ;; All modes distribute from escrow (see header).
      (asserts! (is-eq (get escrowed-count drop) (get inventory-count drop)) ERR-ESCROW-INCOMPLETE)
      ;; Sponsored mode: budget must cover the minimum exposure per item.
      (if (is-eq (get mode drop) MODE-SPONSORED)
        (asserts!
          (>= (get fee-budget-remaining drop) (* MIN-FEE-BUDGET (effective-limit (get inventory-count drop) (get total-limit drop))))
          ERR-INVALID-BUDGET
        )
        true
      )
      (map-set Drops { drop-id: drop-id } (merge drop { status: STATUS-ACTIVE }))
      (print { event: "activate-drop", drop-id: drop-id })
      (ok true)
    )
  )
)

(define-public (pause-drop (drop-id uint))
  (let ((drop (try! (get-drop-or-err drop-id))))
    (begin
      (asserts!
        (or (is-eq tx-sender (get creator drop)) (is-eq tx-sender (var-get contract-owner)))
        ERR-NOT-AUTHORIZED
      )
      (asserts! (is-eq (get status drop) STATUS-ACTIVE) ERR-INVALID-STATUS)
      (map-set Drops { drop-id: drop-id } (merge drop { status: STATUS-PAUSED }))
      (ok true)
    )
  )
)

(define-public (resume-drop (drop-id uint))
  (let ((drop (try! (get-drop-or-err drop-id))))
    (begin
      (asserts!
        (or (is-eq tx-sender (get creator drop)) (is-eq tx-sender (var-get contract-owner)))
        ERR-NOT-AUTHORIZED
      )
      (asserts! (is-eq (get status drop) STATUS-PAUSED) ERR-INVALID-STATUS)
      (map-set Drops { drop-id: drop-id } (merge drop { status: STATUS-ACTIVE }))
      (ok true)
    )
  )
)

;; Creator/owner may end at will; anyone may end once past end-block.
(define-public (end-drop (drop-id uint))
  (let ((drop (try! (get-drop-or-err drop-id))))
    (begin
      (asserts!
        (or
          (is-eq tx-sender (get creator drop))
          (is-eq tx-sender (var-get contract-owner))
          (and (> (get end-block drop) u0) (> stacks-block-height (get end-block drop)))
        )
        ERR-NOT-AUTHORIZED
      )
      (asserts!
        (or (is-eq (get status drop) STATUS-ACTIVE) (is-eq (get status drop) STATUS-PAUSED))
        ERR-INVALID-STATUS
      )
      (map-set Drops { drop-id: drop-id } (merge drop {
        status: STATUS-ENDED,
        ended-at: (some stacks-block-height)
      }))
      (print { event: "end-drop", drop-id: drop-id })
      (ok true)
    )
  )
)

;; Creator cancellation: closes claims and refunds the remaining budget
;; immediately. Escrowed NFTs / assignments return via recover-batch.
(define-public (cancel-drop (drop-id uint))
  (let ((drop (try! (get-drop-or-err drop-id))))
    (begin
      (try! (assert-creator drop))
      (asserts!
        (or
          (is-eq (get status drop) STATUS-DRAFT)
          (is-eq (get status drop) STATUS-ACTIVE)
          (is-eq (get status drop) STATUS-PAUSED)
        )
        ERR-INVALID-STATUS
      )
      (map-set Drops { drop-id: drop-id } (merge drop {
        status: STATUS-CANCELLED,
        ended-at: (some stacks-block-height)
      }))
      (let ((refunded (try! (refund-remaining drop-id))))
        (print { event: "cancel-drop", drop-id: drop-id, refunded: refunded })
        (ok refunded)
      )
    )
  )
)

;; --- claims ---

(define-private (assert-claimable (drop { creator: principal, collection: principal, mode: uint, status: uint, start-block: uint, end-block: uint, total-limit: uint, per-wallet-limit: uint, eligibility: uint, fee-budget-total: uint, fee-budget-remaining: uint, fees-settled: uint, inventory-count: uint, ranges-total: uint, range-count: uint, explicit-count: uint, escrowed-count: uint, claimed-count: uint, reserved-count: uint, free-count: uint, cursor: uint, created-at: uint, ended-at: (optional uint) }))
  (begin
    (asserts! (not (var-get paused)) ERR-PAUSED)
    (asserts! (is-eq (get status drop) STATUS-ACTIVE) ERR-NOT-ACTIVE)
    (asserts! (>= stacks-block-height (get start-block drop)) ERR-WINDOW)
    (asserts!
      (or (is-eq (get end-block drop) u0) (<= stacks-block-height (get end-block drop)))
      ERR-WINDOW
    )
    (ok true)
  )
)

;; wallet-limit + allowlist gate for a NEW allocation (reserve or fresh claim).
;; `extra` counts an outstanding reservation as one pending claim.
(define-private (check-wallet-eligibility (drop-id uint) (eligibility uint) (per-wallet-limit uint))
  (let (
    (claims (wallet-claims-of drop-id tx-sender))
    (pending (if (is-some (map-get? ClaimReservations { drop-id: drop-id, claimer: tx-sender })) u1 u0))
    (active (+ claims pending))
  )
    (begin
      (if (> per-wallet-limit u0)
        (asserts! (< active per-wallet-limit) ERR-WALLET-LIMIT)
        true
      )
      (if (is-eq eligibility ELIGIBILITY-ALLOWLIST)
        (let ((allowance (unwrap! (map-get? DropAllowlist { drop-id: drop-id, wallet: tx-sender }) ERR-NOT-ALLOWLISTED)))
          (asserts! (< active allowance) ERR-WALLET-LIMIT)
        )
        true
      )
      (ok true)
    )
  )
)

;; Allocates the next claimable index: released reservations first (LIFO),
;; then the sequential cursor over the drop's slot space.
(define-private (allocate-index (drop-id uint))
  (let ((drop (try! (get-drop-or-err drop-id))))
    (begin
      (asserts!
        (< (+ (get claimed-count drop) (get reserved-count drop))
           (effective-limit (get inventory-count drop) (get total-limit drop)))
        ERR-SOLD-OUT
      )
      (let ((fc (get free-count drop)))
        (if (> fc u0)
          (let ((idx (unwrap-panic (map-get? DropFree { drop-id: drop-id, slot: (- fc u1) }))))
            (map-delete DropFree { drop-id: drop-id, slot: (- fc u1) })
            (map-set Drops { drop-id: drop-id } (merge drop { free-count: (- fc u1) }))
            (ok idx)
          )
          (let ((idx (unwrap! (resolve-slot drop-id (get cursor drop) (get ranges-total drop)) ERR-NOT-IN-INVENTORY)))
            (map-set Drops { drop-id: drop-id } (merge drop { cursor: (+ (get cursor drop) u1) }))
            (ok idx)
          )
        )
      )
    )
  )
)

;; Settles a claim for tx-sender at `index`: set-once item row, escrow
;; transfer out, counters. Reservation bookkeeping handled by callers.
(define-private (settle-claim (drop-id uint) (index uint))
  (let ((drop (try! (get-drop-or-err drop-id))))
    (let ((token-id (unwrap! (map-get? EscrowedTokens { drop-id: drop-id, index: index }) ERR-NOT-ESCROWED)))
      (begin
        (asserts! (map-insert ItemClaimed { drop-id: drop-id, index: index } true) ERR-ALREADY-CLAIMED)
        (try! (transfer-escrowed-out token-id tx-sender))
        (map-delete EscrowedTokens { drop-id: drop-id, index: index })
        (map-set Claims { drop-id: drop-id, seq: (get claimed-count drop) }
          { index: index, claimer: tx-sender, claimed-at: stacks-block-height })
        (map-set WalletClaims { drop-id: drop-id, claimer: tx-sender }
          (+ (wallet-claims-of drop-id tx-sender) u1))
        (map-set Drops { drop-id: drop-id } (merge drop {
          claimed-count: (+ (get claimed-count drop) u1),
          escrowed-count: (- (get escrowed-count drop) u1)
        }))
        (print { event: "claim", drop-id: drop-id, index: index, token-id: token-id, claimer: tx-sender })
        (ok { index: index, token-id: token-id })
      )
    )
  )
)

;; One-step claim (or settlement of the caller's reservation) for
;; public/allowlist drops.
(define-public (claim (drop-id uint))
  (let ((drop (try! (get-drop-or-err drop-id))))
    (begin
      (try! (assert-claimable drop))
      (asserts! (not (is-eq (get eligibility drop) ELIGIBILITY-SIGNED)) ERR-ELIGIBILITY)
      (match (map-get? ClaimReservations { drop-id: drop-id, claimer: tx-sender })
        reservation (begin
          ;; Reserved path: eligibility was checked at reservation time.
          (map-delete ClaimReservations { drop-id: drop-id, claimer: tx-sender })
          (map-set Drops { drop-id: drop-id } (merge drop {
            reserved-count: (- (get reserved-count drop) u1)
          }))
          (settle-claim drop-id (get index reservation))
        )
        (begin
          (try! (check-wallet-eligibility drop-id (get eligibility drop) (get per-wallet-limit drop)))
          (let ((index (try! (allocate-index drop-id))))
            (settle-claim drop-id index)
          )
        )
      )
    )
  )
)

;; One-step claim for signed-eligibility drops. The attestation binds
;; {chain-id, claimer=tx-sender, collection, contract, drop-id, expires-at}.
(define-public (claim-signed (drop-id uint) (expires-at uint) (signature (buff 65)))
  (let ((drop (try! (get-drop-or-err drop-id))))
    (begin
      (try! (assert-claimable drop))
      (asserts! (is-eq (get eligibility drop) ELIGIBILITY-SIGNED) ERR-ELIGIBILITY)
      (asserts! (>= expires-at stacks-block-height) ERR-ATTESTATION-EXPIRED)
      (let (
        (attestor-hash (unwrap! (var-get attestor-pubkey-hash) ERR-ATTESTOR-NOT-CONFIGURED))
        (payload (unwrap! (to-consensus-buff? {
          chain-id: chain-id,
          claimer: tx-sender,
          collection: (get collection drop),
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
        (try! (check-wallet-eligibility drop-id ELIGIBILITY-PUBLIC (get per-wallet-limit drop)))
        (let ((index (try! (allocate-index drop-id))))
          (settle-claim drop-id index)
        )
      )
    )
  )
)

;; Optional two-step: lock an index to the claimer before settlement.
;; Public/allowlist drops only (signed drops claim in one step).
(define-public (reserve-claim (drop-id uint))
  (let ((drop (try! (get-drop-or-err drop-id))))
    (begin
      (try! (assert-claimable drop))
      (asserts! (not (is-eq (get eligibility drop) ELIGIBILITY-SIGNED)) ERR-ELIGIBILITY)
      (asserts!
        (is-none (map-get? ClaimReservations { drop-id: drop-id, claimer: tx-sender }))
        ERR-ALREADY-RESERVED
      )
      (try! (check-wallet-eligibility drop-id (get eligibility drop) (get per-wallet-limit drop)))
      (let ((index (try! (allocate-index drop-id))))
        (let ((updated (try! (get-drop-or-err drop-id))))
          (map-insert ClaimReservations { drop-id: drop-id, claimer: tx-sender }
            { index: index, reserved-at: stacks-block-height })
          (map-set Drops { drop-id: drop-id } (merge updated {
            reserved-count: (+ (get reserved-count updated) u1)
          }))
          (print { event: "reserve-claim", drop-id: drop-id, index: index, claimer: tx-sender })
          (ok index)
        )
      )
    )
  )
)

;; Permissionless release of an expired claim reservation; the index
;; returns to the drop's free-list. Never blocked by pause.
(define-public (release-expired-claim (drop-id uint) (claimer principal))
  (let (
    (drop (try! (get-drop-or-err drop-id)))
    (reservation (unwrap! (map-get? ClaimReservations { drop-id: drop-id, claimer: claimer }) ERR-NOT-FOUND))
  )
    (begin
      (asserts!
        (>= stacks-block-height (+ (get reserved-at reservation) RESERVATION-EXPIRY))
        ERR-RESERVATION-NOT-EXPIRED
      )
      (map-delete ClaimReservations { drop-id: drop-id, claimer: claimer })
      (map-set DropFree { drop-id: drop-id, slot: (get free-count drop) } (get index reservation))
      (map-set Drops { drop-id: drop-id } (merge drop {
        reserved-count: (- (get reserved-count drop) u1),
        free-count: (+ (get free-count drop) u1)
      }))
      (print { event: "release-expired-claim", drop-id: drop-id, claimer: claimer, index: (get index reservation) })
      (ok (get index reservation))
    )
  )
)

;; --- allowlist (creator-managed, per drop) ---

(define-public (set-allowlist-entry (drop-id uint) (wallet principal) (allowance uint))
  (let ((drop (try! (get-drop-or-err drop-id))))
    (begin
      (try! (assert-creator drop))
      (map-set DropAllowlist { drop-id: drop-id, wallet: wallet } allowance)
      (ok true)
    )
  )
)

(define-private (set-allowlist-step
  (entry { wallet: principal, allowance: uint })
  (acc uint)
)
  (begin
    (map-set DropAllowlist { drop-id: acc, wallet: (get wallet entry) } (get allowance entry))
    acc
  )
)

(define-public (set-allowlist-batch
  (drop-id uint)
  (entries (list 200 { wallet: principal, allowance: uint }))
)
  (let ((drop (try! (get-drop-or-err drop-id))))
    (begin
      (try! (assert-creator drop))
      (fold set-allowlist-step entries drop-id)
      (ok true)
    )
  )
)

;; --- recovery (ended/cancelled drops; creator only; never pause-blocked) ---

(define-private (recover-step
  (index uint)
  (acc (response { drop-id: uint, creator: principal, recovered: uint } uint))
)
  (let ((current (try! acc)))
    (begin
      (asserts!
        (is-none (map-get? ItemClaimed { drop-id: (get drop-id current), index: index }))
        ERR-ALREADY-CLAIMED
      )
      (match (map-get? EscrowedTokens { drop-id: (get drop-id current), index: index })
        token-id (begin
          (try! (transfer-escrowed-out token-id (get creator current)))
          (map-delete EscrowedTokens { drop-id: (get drop-id current), index: index })
          (ok (merge current { recovered: (+ (get recovered current) u1) }))
        )
        (ok current)
      )
    )
  )
)

;; Returns unclaimed escrowed NFTs to the creator and clears their collection
;; assignments (one bounded batch per call). Also usable for a cancelled draft
;; whose items were assigned but never escrowed.
(define-public (recover-batch
  (collection <collection-trait>)
  (drop-id uint)
  (indexes (list 25 uint))
)
  (let ((drop (try! (get-drop-or-err drop-id))))
    (begin
      (try! (assert-creator drop))
      (asserts! (is-eq (contract-of collection) (get collection drop)) ERR-WRONG-COLLECTION)
      (asserts!
        (or (is-eq (get status drop) STATUS-ENDED) (is-eq (get status drop) STATUS-CANCELLED))
        ERR-INVALID-STATUS
      )
      (asserts! (> (len indexes) u0) ERR-INVALID-BATCH)
      (let ((result (try! (fold recover-step indexes
        (ok { drop-id: drop-id, creator: (get creator drop), recovered: u0 })))))
        (try! (contract-call? collection unassign-list-from-drop indexes drop-id))
        (map-set Drops { drop-id: drop-id } (merge drop {
          escrowed-count: (- (get escrowed-count drop) (get recovered result))
        }))
        (print { event: "recover-batch", drop-id: drop-id, recovered: (get recovered result) })
        (ok (get recovered result))
      )
    )
  )
)

;; --- sponsorship settlement ---

;; Sponsor reimburses itself for a confirmed sponsored claim.
(define-public (claim-fee (drop-id uint) (amount uint))
  (let ((drop (try! (get-drop-or-err drop-id))))
    (begin
      (asserts! (is-eq tx-sender (var-get sponsor)) ERR-NOT-AUTHORIZED)
      (asserts! (> amount u0) ERR-FEE-TOO-LARGE)
      (asserts! (<= amount (var-get claim-fee-cap)) ERR-FEE-TOO-LARGE)
      (asserts! (<= amount (get fee-budget-remaining drop)) ERR-FEE-TOO-LARGE)
      ;; only settle against claims that actually confirmed
      (asserts! (< (get fees-settled drop) (get claimed-count drop)) ERR-NOT-CLAIMED)
      (let ((recipient (var-get sponsor)))
        (match
          (as-contract? ((with-stx amount))
            (unwrap! (stx-transfer? amount tx-sender recipient) ERR-TRANSFER-FAILED))
          done true
          allowance-violation (asserts! false ERR-TRANSFER-FAILED)
        )
      )
      (map-set Drops { drop-id: drop-id } (merge drop {
        fee-budget-remaining: (- (get fee-budget-remaining drop) amount),
        fees-settled: (+ (get fees-settled drop) u1)
      }))
      (print { event: "claim-fee", drop-id: drop-id, amount: amount })
      (ok true)
    )
  )
)

;; Returns the remaining budget to the creator. The sponsor may settle at any
;; time; the creator only for an ended/cancelled drop after REFUND-DELAY.
(define-public (settle-refund (drop-id uint))
  (let ((drop (try! (get-drop-or-err drop-id))))
    (begin
      (if (is-eq tx-sender (var-get sponsor))
        true
        (begin
          (asserts! (is-eq tx-sender (get creator drop)) ERR-NOT-AUTHORIZED)
          (asserts!
            (or (is-eq (get status drop) STATUS-ENDED) (is-eq (get status drop) STATUS-CANCELLED))
            ERR-REFUND-LOCKED
          )
          (asserts!
            (>= stacks-block-height (+ (unwrap! (get ended-at drop) ERR-REFUND-LOCKED) REFUND-DELAY))
            ERR-REFUND-LOCKED
          )
        )
      )
      (let ((refunded (try! (refund-remaining drop-id))))
        (print { event: "settle-refund", drop-id: drop-id, refunded: refunded })
        (ok refunded)
      )
    )
  )
)

;; --- read-onlys ---

(define-read-only (get-drop (drop-id uint))
  (map-get? Drops { drop-id: drop-id })
)

(define-read-only (get-next-drop-id) (ok (var-get next-drop-id)))
(define-read-only (get-owner) (ok (var-get contract-owner)))
(define-read-only (get-pending-owner) (ok (var-get pending-owner)))
(define-read-only (get-sponsor) (ok (var-get sponsor)))
(define-read-only (get-attestor-pubkey-hash) (ok (var-get attestor-pubkey-hash)))
(define-read-only (get-claim-fee-cap) (ok (var-get claim-fee-cap)))
(define-read-only (get-min-fee-budget) (ok MIN-FEE-BUDGET))
(define-read-only (get-refund-delay) (ok REFUND-DELAY))
(define-read-only (get-reservation-expiry) (ok RESERVATION-EXPIRY))
(define-read-only (is-paused) (ok (var-get paused)))
(define-read-only (get-nft-contract) (ok ALLOWED-NFT-CONTRACT))

(define-read-only (get-inventory-slot (drop-id uint) (slot uint))
  (match (map-get? Drops { drop-id: drop-id })
    drop (ok (resolve-slot drop-id slot (get ranges-total drop)))
    ERR-NOT-FOUND
  )
)

(define-read-only (get-drop-range (drop-id uint) (seq uint))
  (map-get? DropRanges { drop-id: drop-id, seq: seq })
)

(define-read-only (get-claim (drop-id uint) (seq uint))
  (map-get? Claims { drop-id: drop-id, seq: seq })
)

(define-read-only (get-wallet-claims (drop-id uint) (wallet principal))
  (ok (wallet-claims-of drop-id wallet))
)

(define-read-only (get-claim-reservation (drop-id uint) (claimer principal))
  (map-get? ClaimReservations { drop-id: drop-id, claimer: claimer })
)

(define-read-only (get-allowlist-entry (drop-id uint) (wallet principal))
  (map-get? DropAllowlist { drop-id: drop-id, wallet: wallet })
)

(define-read-only (get-escrowed-token (drop-id uint) (index uint))
  (map-get? EscrowedTokens { drop-id: drop-id, index: index })
)

(define-read-only (is-item-claimed (drop-id uint) (index uint))
  (ok (is-some (map-get? ItemClaimed { drop-id: drop-id, index: index })))
)

;; Remaining claimable count (inventory or total-limit cap, minus
;; claims + live reservations).
(define-read-only (get-remaining (drop-id uint))
  (match (map-get? Drops { drop-id: drop-id })
    drop (ok (- (effective-limit (get inventory-count drop) (get total-limit drop))
                (+ (get claimed-count drop) (get reserved-count drop))))
    ERR-NOT-FOUND
  )
)

(define-private (claims-scan-step
  (i uint)
  (acc { drop-id: uint, start: uint, limit: uint, entries: (list 50 (optional { index: uint, claimer: principal, claimed-at: uint })) })
)
  (let ((seq (+ (get start acc) i)))
    (if (>= seq (get limit acc))
      acc
      (merge acc {
        entries: (unwrap-panic (as-max-len?
          (append (get entries acc) (map-get? Claims { drop-id: (get drop-id acc), seq: seq }))
          u50))
      })
    )
  )
)

;; Paginated claim index: up to 50 claims starting at `start`.
(define-read-only (get-claims-scan (drop-id uint) (start uint))
  (match (map-get? Drops { drop-id: drop-id })
    drop (ok (get entries (fold claims-scan-step ITER-50
      { drop-id: drop-id, start: start, limit: (get claimed-count drop), entries: (list) })))
    ERR-NOT-FOUND
  )
)
