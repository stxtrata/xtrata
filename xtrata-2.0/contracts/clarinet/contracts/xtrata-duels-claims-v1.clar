;; xtrata-duels-claims-v1
;;
;; One-time claim distribution for the XTRATA DUELS free drop.
;;
;; - The contract owner deposits pre-inscribed FIGHTER and WEAPON inscriptions
;;   into two pools held by this contract.
;; - Every Forever Twin grants EXACTLY ONE claim, forever: the claimer must
;;   hold the twin's Xtrata inscription in their wallet (liquid on Xtrata,
;;   same rule as the duels arena). Claiming deals one random fighter and one
;;   random weapon from the pools to the claimer.
;; - Assignment is random via a recent block header hash mixed with the twin
;;   identity; you get what you get. Tokens are freely tradable afterwards.
;; - The claim is recorded per (collection, local-id) twin - trading the twin
;;   does NOT reset its claim.
;;
;; SIM/LIVE NOTE: the ONLY lines that differ between the clarinet (sim) and
;; mainnet (live) versions of this file are the CONTRACT-CALL TARGETS marked
;; ;; @principal below (core + three twin helpers). Logic is byte-identical.

(define-constant ERR-NOT-AUTHORIZED   (err u300))
(define-constant ERR-TWIN-NOT-BOUND   (err u301))
(define-constant ERR-TWIN-NOT-HELD    (err u302))
(define-constant ERR-ALREADY-CLAIMED  (err u303))
(define-constant ERR-POOL-EMPTY       (err u304))
(define-constant ERR-SEED-UNAVAILABLE (err u305))
(define-constant ERR-BAD-COLLECTION   (err u306))
(define-constant ERR-POOL-BROKEN      (err u307))
(define-constant ERR-CLAIMS-PAUSED    (err u308))

(define-constant TWIN-PEPES  u0)
(define-constant TWIN-LEOS   u1)
(define-constant TWIN-DEGENS u2)

(define-constant ROLE-FIGHTER u0)
(define-constant ROLE-WEAPON  u1)

(define-data-var contract-owner principal tx-sender)
(define-data-var claims-open bool false)

;; Pools: dense index -> token id, with a live count per role.
(define-map FighterPool uint uint)
(define-map WeaponPool uint uint)
(define-data-var fighter-remaining uint u0)
(define-data-var weapon-remaining uint u0)

;; One claim per twin, keyed by (collection, local-id). Records what was dealt.
(define-map Claims
  { collection: uint, local-id: uint }
  { claimer: principal, fighter: uint, weapon: uint, at: uint }
)

;; ---------------------------------------------------------------------------
;; Twin verification (identical rule to the duels arena)

(define-private (twin-binding (collection uint) (local-id uint))
  (if (is-eq collection TWIN-PEPES)
    (contract-call? .mock-twin-helper get-binding local-id)            ;; @principal pepes-helper
    (if (is-eq collection TWIN-LEOS)
      (contract-call? .mock-twin-helper get-binding local-id)          ;; @principal leos-helper
      (if (is-eq collection TWIN-DEGENS)
        (contract-call? .mock-twin-helper get-binding local-id)        ;; @principal degens-helper
        none
      )
    )
  )
)

(define-private (verify-twin-held (collection uint) (local-id uint) (player principal))
  (let (
    (binding (unwrap! (twin-binding collection local-id) ERR-TWIN-NOT-BOUND))
    (twin-id (get xtrata-id binding))
    (owner (unwrap! (unwrap! (contract-call? .mock-xtrata-core get-owner twin-id) ERR-TWIN-NOT-HELD) ERR-TWIN-NOT-HELD)) ;; @principal core
  )
    (asserts! (is-eq owner player) ERR-TWIN-NOT-HELD)
    (ok twin-id)
  )
)

;; ---------------------------------------------------------------------------
;; Pool management (owner only). The owner transfers each deposited token to
;; this contract in the same call, so the pool always matches real custody.

(define-private (deposit-one (id uint) (acc { role: uint, ok: bool }))
  (if (not (get ok acc))
    acc
    (let (
      (transferred (contract-call? .mock-xtrata-core transfer id tx-sender (as-contract tx-sender))) ;; @principal core
    )
      (match transferred
        success
          (begin
            (if (is-eq (get role acc) ROLE-FIGHTER)
              (begin
                (map-set FighterPool (var-get fighter-remaining) id)
                (var-set fighter-remaining (+ (var-get fighter-remaining) u1))
              )
              (begin
                (map-set WeaponPool (var-get weapon-remaining) id)
                (var-set weapon-remaining (+ (var-get weapon-remaining) u1))
              )
            )
            acc
          )
        failure (merge acc { ok: false })
      )
    )
  )
)

(define-public (deposit-fighters (ids (list 100 uint)))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (asserts! (get ok (fold deposit-one ids { role: ROLE-FIGHTER, ok: true })) ERR-POOL-BROKEN)
    (ok (var-get fighter-remaining))
  )
)

(define-public (deposit-weapons (ids (list 100 uint)))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (asserts! (get ok (fold deposit-one ids { role: ROLE-WEAPON, ok: true })) ERR-POOL-BROKEN)
    (ok (var-get weapon-remaining))
  )
)

;; ---------------------------------------------------------------------------
;; Random draw: pick index = seed mod remaining, then swap-with-last so the
;; pool stays dense. Seed mixes the previous block's header hash with the twin
;; identity and both pool sizes, so consecutive claims in one block differ.

(define-private (draw-seed (twin-id uint) (salt (buff 1)))
  (let (
    (header (unwrap! (get-stacks-block-info? id-header-hash (- stacks-block-height u1)) ERR-SEED-UNAVAILABLE))
  )
    (ok (sha256 (concat
      (concat header salt)
      (concat
        (unwrap-panic (to-consensus-buff? twin-id))
        (unwrap-panic (to-consensus-buff? (+ (var-get fighter-remaining) (var-get weapon-remaining))))
      )
    )))
  )
)

(define-private (seed-mod (seed (buff 32)) (m uint))
  (mod (buff-to-uint-be (unwrap-panic (as-max-len? (unwrap-panic (slice? seed u0 u16)) u16))) m)
)

(define-private (draw-fighter (seed (buff 32)))
  (let (
    (remaining (var-get fighter-remaining))
    (idx (seed-mod seed remaining))
    (id (unwrap! (map-get? FighterPool idx) ERR-POOL-BROKEN))
    (last-idx (- remaining u1))
    (last-id (unwrap! (map-get? FighterPool last-idx) ERR-POOL-BROKEN))
  )
    (map-set FighterPool idx last-id)
    (map-delete FighterPool last-idx)
    (var-set fighter-remaining last-idx)
    (ok id)
  )
)

(define-private (draw-weapon (seed (buff 32)))
  (let (
    (remaining (var-get weapon-remaining))
    (idx (seed-mod seed remaining))
    (id (unwrap! (map-get? WeaponPool idx) ERR-POOL-BROKEN))
    (last-idx (- remaining u1))
    (last-id (unwrap! (map-get? WeaponPool last-idx) ERR-POOL-BROKEN))
  )
    (map-set WeaponPool idx last-id)
    (map-delete WeaponPool last-idx)
    (var-set weapon-remaining last-idx)
    (ok id)
  )
)

(define-private (payout (id uint) (recipient principal))
  (as-contract (contract-call? .mock-xtrata-core transfer id tx-sender recipient)) ;; @principal core
)

;; ---------------------------------------------------------------------------
;; The claim

(define-public (claim (twin-collection uint) (twin-local-id uint))
  (let (
    (claim-key { collection: twin-collection, local-id: twin-local-id })
    (twin-id (try! (verify-twin-held twin-collection twin-local-id tx-sender)))
  )
    (asserts! (var-get claims-open) ERR-CLAIMS-PAUSED)
    (asserts! (is-none (map-get? Claims claim-key)) ERR-ALREADY-CLAIMED)
    (asserts! (> (var-get fighter-remaining) u0) ERR-POOL-EMPTY)
    (asserts! (> (var-get weapon-remaining) u0) ERR-POOL-EMPTY)
    (let (
      (fighter (try! (draw-fighter (try! (draw-seed twin-id 0x01)))))
      (weapon (try! (draw-weapon (try! (draw-seed twin-id 0x02)))))
    )
      (try! (payout fighter tx-sender))
      (try! (payout weapon tx-sender))
      (map-set Claims claim-key
        { claimer: tx-sender, fighter: fighter, weapon: weapon, at: stacks-block-height })
      (print { event: "duels-claim", collection: twin-collection, local-id: twin-local-id,
               twin-id: twin-id, claimer: tx-sender, fighter: fighter, weapon: weapon })
      (ok { fighter: fighter, weapon: weapon })
    )
  )
)

;; ---------------------------------------------------------------------------
;; Reads + admin

(define-read-only (get-claim (collection uint) (local-id uint))
  (map-get? Claims { collection: collection, local-id: local-id })
)

(define-read-only (get-pool-remaining)
  { fighters: (var-get fighter-remaining), weapons: (var-get weapon-remaining) }
)

(define-read-only (get-claims-open)
  (var-get claims-open)
)

(define-read-only (get-owner-principal)
  (var-get contract-owner)
)

(define-public (set-claims-open (open bool))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (var-set claims-open open)
    (ok true)
  )
)

;; Recover undealt pool tokens (e.g. after the claim window closes).
;; NOTE: withdrawing does NOT rewrite the dense pool index, so this is a
;; decommissioning action: only use it once claims are closed for good.
;; Re-opening claims after a withdrawal can leave pool entries pointing at
;; tokens the contract no longer holds, which makes those draws fail.
(define-public (withdraw-remaining (ids (list 100 uint)) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (asserts! (not (var-get claims-open)) ERR-CLAIMS-PAUSED)
    (asserts! (get ok (fold withdraw-one ids { recipient: recipient, ok: true })) ERR-POOL-BROKEN)
    (ok true)
  )
)

(define-private (withdraw-one (id uint) (acc { recipient: principal, ok: bool }))
  (if (not (get ok acc))
    acc
    (match (payout id (get recipient acc))
      success acc
      failure (merge acc { ok: false })
    )
  )
)

(define-public (transfer-contract-ownership (new-owner principal))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (var-set contract-owner new-owner)
    (ok true)
  )
)
