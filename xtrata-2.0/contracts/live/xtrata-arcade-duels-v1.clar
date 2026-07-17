;; xtrata-arcade-duels-v1
;;
;; Token-stake auto-battler for Xtrata inscriptions.
;;
;; - Players escrow one FIGHTER and one WEAPON inscription (from the eligible
;;   drop ranges) to enter a duel. WINNER TAKES ALL FOUR escrowed tokens.
;; - A Forever Twin must be presented to play: the entrant must hold the
;;   Xtrata twin in the same wallet. The twin is verified via the twin helper
;;   contract's binding and is NEVER escrowed or at stake - its content hash
;;   is snapshotted at entry and blesses the loadout.
;; - All stats derive deterministically from on-chain inscription hashes.
;;   Randomness comes from a Stacks block header hash at a height fixed at
;;   accept time (unknown to both players when committing).
;;
;; Stat formula (parity-locked with the client, see DUELS-V1-PLAN.md):
;;   base    = u16be(fighter-hash[0..2])            mod 100   ;; 0..99
;;   weapon  = u16be(weapon-hash[0..2])             mod 60    ;; 0..59
;;   twin    = u16be(twin-hash[0..2])               mod 40    ;; 0..39
;;   synergy = 20 when (fighter-hash[3] xor weapon-hash[3]) mod 4 == 0 else 0
;;   luck    = u16be(sha256(seed || side-byte)[0..2]) mod 120 ;; 0..119
;;   total   = base + weapon + twin + synergy + luck
;;   seed    = sha256(header-hash(seed-height) || consensus-buff(duel-id))
;;   side-byte: 0x01 challenger, 0x02 acceptor; tie-break byte 0x03 (even = challenger)
;;
;; SIM/LIVE NOTE: the ONLY lines that differ between the clarinet (sim) and
;; mainnet (live) versions of this file are the CONTRACT-CALL TARGETS marked
;; ;; @principal below (core + three twin helpers). Logic is byte-identical.

(define-constant ERR-NOT-AUTHORIZED      (err u200))
(define-constant ERR-NOT-FOUND           (err u201))
(define-constant ERR-BAD-STATE           (err u202))
(define-constant ERR-NOT-ELIGIBLE        (err u203))
(define-constant ERR-TWIN-NOT-BOUND      (err u204))
(define-constant ERR-TWIN-NOT-HELD       (err u205))
(define-constant ERR-SELF-DUEL           (err u206))
(define-constant ERR-NOT-YOUR-CHALLENGE  (err u207))
(define-constant ERR-TOO-EARLY           (err u208))
(define-constant ERR-SEED-UNAVAILABLE    (err u209))
(define-constant ERR-HASH-MISSING        (err u210))
(define-constant ERR-RANGES-FULL         (err u211))
(define-constant ERR-BAD-RANGE           (err u212))
(define-constant ERR-NOT-OPEN            (err u213))
(define-constant ERR-BAD-COLLECTION      (err u214))

(define-constant ROLE-FIGHTER u0)
(define-constant ROLE-WEAPON  u1)

(define-constant STATE-OPEN      u0)
(define-constant STATE-ACCEPTED  u1)
(define-constant STATE-RESOLVED  u2)
(define-constant STATE-CANCELLED u3)

(define-constant TWIN-PEPES  u0)
(define-constant TWIN-LEOS   u1)
(define-constant TWIN-DEGENS u2)

(define-data-var contract-owner principal tx-sender)
(define-data-var next-duel-id uint u1)
;; blocks after creation before an unaccepted challenge can be cancelled by anyone
(define-data-var open-ttl uint u1008)

;; Eligible drop id ranges per role (admin-managed; up to 20 ranges).
(define-data-var eligible-ranges (list 20 { role: uint, start: uint, end: uint }) (list))

(define-map Duels
  uint
  {
    challenger: principal,
    c-fighter: uint,
    c-weapon: uint,
    c-twin-id: uint,
    c-twin-hash: (buff 32),
    opponent: (optional principal),
    acceptor: (optional principal),
    a-fighter: (optional uint),
    a-weapon: (optional uint),
    a-twin-id: (optional uint),
    a-twin-hash: (optional (buff 32)),
    created-at: uint,
    seed-height: (optional uint),
    state: uint
  }
)

(define-map Results
  uint
  {
    winner: principal,
    challenger-total: uint,
    acceptor-total: uint,
    seed: (buff 32)
  }
)

;; ---------------------------------------------------------------------------
;; Eligibility

(define-private (range-hit (range { role: uint, start: uint, end: uint })
                           (acc { role: uint, id: uint, hit: bool }))
  (if (and (is-eq (get role range) (get role acc))
           (>= (get id acc) (get start range))
           (<= (get id acc) (get end range)))
    (merge acc { hit: true })
    acc
  )
)

(define-read-only (is-eligible (id uint) (role uint))
  (get hit (fold range-hit (var-get eligible-ranges) { role: role, id: id, hit: false }))
)

(define-public (set-eligible-ranges (ranges (list 20 { role: uint, start: uint, end: uint })))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (asserts! (fold range-valid ranges true) ERR-BAD-RANGE)
    (var-set eligible-ranges ranges)
    (ok true)
  )
)

(define-private (range-valid (range { role: uint, start: uint, end: uint }) (acc bool))
  (and acc
       (<= (get start range) (get end range))
       (or (is-eq (get role range) ROLE-FIGHTER) (is-eq (get role range) ROLE-WEAPON)))
)

;; ---------------------------------------------------------------------------
;; Twin verification: entrant must HOLD the Xtrata twin (never escrowed here).

(define-private (twin-binding (collection uint) (local-id uint))
  (if (is-eq collection TWIN-PEPES)
    (contract-call? 'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.pepe-4ever-fakfun get-binding local-id)            ;; @principal pepes-helper
    (if (is-eq collection TWIN-LEOS)
      (contract-call? 'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.leo-fakfun-xtrata get-binding local-id)          ;; @principal leos-helper
      (if (is-eq collection TWIN-DEGENS)
        (contract-call? 'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.miami-degens-fakfun-xtrata get-binding local-id)        ;; @principal degens-helper
        none
      )
    )
  )
)

(define-private (verify-twin (collection uint) (local-id uint) (player principal))
  (let (
    (binding (unwrap! (twin-binding collection local-id) ERR-TWIN-NOT-BOUND))
    (twin-id (get xtrata-id binding))
    (owner (unwrap! (unwrap! (contract-call? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3 get-owner twin-id) ERR-TWIN-NOT-HELD) ERR-TWIN-NOT-HELD)) ;; @principal core
  )
    (asserts! (is-eq owner player) ERR-TWIN-NOT-HELD)
    (ok { twin-id: twin-id, twin-hash: (get content-hash binding) })
  )
)

;; ---------------------------------------------------------------------------
;; Escrow helpers

(define-private (escrow-in (id uint) (player principal))
  (contract-call? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3 transfer id player (as-contract tx-sender)) ;; @principal core
)

(define-private (payout (id uint) (winner principal))
  (as-contract (contract-call? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3 transfer id tx-sender winner)) ;; @principal core
)

;; ---------------------------------------------------------------------------
;; Stat math (parity-locked with the client)

(define-private (read-u16 (b (buff 32)) (i uint))
  (buff-to-uint-be (unwrap-panic (as-max-len? (unwrap-panic (slice? b i (+ i u2))) u2)))
)

(define-private (read-u8 (b (buff 32)) (i uint))
  (buff-to-uint-be (unwrap-panic (as-max-len? (unwrap-panic (slice? b i (+ i u1))) u1)))
)

(define-read-only (derive-loadout-score
    (fighter-hash (buff 32))
    (weapon-hash (buff 32))
    (twin-hash (buff 32))
    (seed (buff 32))
    (side-byte (buff 1)))
  (let (
    (base    (mod (read-u16 fighter-hash u0) u100))
    (wpn     (mod (read-u16 weapon-hash u0) u60))
    (twin    (mod (read-u16 twin-hash u0) u40))
    (synergy (if (is-eq (mod (bit-xor (read-u8 fighter-hash u3) (read-u8 weapon-hash u3)) u4) u0) u20 u0))
    (luck    (mod (read-u16 (sha256 (concat seed side-byte)) u0) u120))
  )
    { base: base, weapon: wpn, twin: twin, synergy: synergy, luck: luck,
      total: (+ base wpn twin synergy luck) }
  )
)

(define-private (inscription-hash-or-err (id uint))
  (ok (unwrap! (contract-call? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3 get-inscription-hash id) ERR-HASH-MISSING)) ;; @principal core
)

;; ---------------------------------------------------------------------------
;; Duel lifecycle

(define-public (challenge
    (fighter uint)
    (weapon uint)
    (twin-collection uint)
    (twin-local-id uint)
    (opponent (optional principal)))
  (let (
    (duel-id (var-get next-duel-id))
    (twin (try! (verify-twin twin-collection twin-local-id tx-sender)))
  )
    (asserts! (is-eligible fighter ROLE-FIGHTER) ERR-NOT-ELIGIBLE)
    (asserts! (is-eligible weapon ROLE-WEAPON) ERR-NOT-ELIGIBLE)
    (try! (escrow-in fighter tx-sender))
    (try! (escrow-in weapon tx-sender))
    (map-set Duels duel-id {
      challenger: tx-sender,
      c-fighter: fighter,
      c-weapon: weapon,
      c-twin-id: (get twin-id twin),
      c-twin-hash: (get twin-hash twin),
      opponent: opponent,
      acceptor: none,
      a-fighter: none,
      a-weapon: none,
      a-twin-id: none,
      a-twin-hash: none,
      created-at: stacks-block-height,
      seed-height: none,
      state: STATE-OPEN
    })
    (var-set next-duel-id (+ duel-id u1))
    (print { event: "duel-challenge", duel-id: duel-id, challenger: tx-sender,
             fighter: fighter, weapon: weapon, twin-id: (get twin-id twin), opponent: opponent })
    (ok duel-id)
  )
)

(define-public (accept
    (duel-id uint)
    (fighter uint)
    (weapon uint)
    (twin-collection uint)
    (twin-local-id uint))
  (let (
    (duel (unwrap! (map-get? Duels duel-id) ERR-NOT-FOUND))
    (twin (try! (verify-twin twin-collection twin-local-id tx-sender)))
    (seed-height (+ stacks-block-height u1))
  )
    (asserts! (is-eq (get state duel) STATE-OPEN) ERR-BAD-STATE)
    (asserts! (not (is-eq tx-sender (get challenger duel))) ERR-SELF-DUEL)
    (asserts! (match (get opponent duel) target (is-eq tx-sender target) true) ERR-NOT-YOUR-CHALLENGE)
    (asserts! (is-eligible fighter ROLE-FIGHTER) ERR-NOT-ELIGIBLE)
    (asserts! (is-eligible weapon ROLE-WEAPON) ERR-NOT-ELIGIBLE)
    (try! (escrow-in fighter tx-sender))
    (try! (escrow-in weapon tx-sender))
    (map-set Duels duel-id (merge duel {
      acceptor: (some tx-sender),
      a-fighter: (some fighter),
      a-weapon: (some weapon),
      a-twin-id: (some (get twin-id twin)),
      a-twin-hash: (some (get twin-hash twin)),
      seed-height: (some seed-height),
      state: STATE-ACCEPTED
    }))
    (print { event: "duel-accept", duel-id: duel-id, acceptor: tx-sender,
             fighter: fighter, weapon: weapon, twin-id: (get twin-id twin), seed-height: seed-height })
    (ok seed-height)
  )
)

(define-public (resolve (duel-id uint))
  (let (
    (duel (unwrap! (map-get? Duels duel-id) ERR-NOT-FOUND))
    (seed-height (unwrap! (get seed-height duel) ERR-BAD-STATE))
  )
    (asserts! (is-eq (get state duel) STATE-ACCEPTED) ERR-BAD-STATE)
    (asserts! (> stacks-block-height seed-height) ERR-TOO-EARLY)
    (let (
      (header (unwrap! (get-stacks-block-info? id-header-hash seed-height) ERR-SEED-UNAVAILABLE))
      (seed (sha256 (concat header (unwrap-panic (to-consensus-buff? duel-id)))))
      (challenger (get challenger duel))
      (acceptor (unwrap! (get acceptor duel) ERR-BAD-STATE))
      (a-fighter (unwrap! (get a-fighter duel) ERR-BAD-STATE))
      (a-weapon (unwrap! (get a-weapon duel) ERR-BAD-STATE))
      (c-fh (try! (inscription-hash-or-err (get c-fighter duel))))
      (c-wh (try! (inscription-hash-or-err (get c-weapon duel))))
      (a-fh (try! (inscription-hash-or-err a-fighter)))
      (a-wh (try! (inscription-hash-or-err a-weapon)))
      (c-score (get total (derive-loadout-score c-fh c-wh (get c-twin-hash duel) seed 0x01)))
      (a-score (get total (derive-loadout-score a-fh a-wh (unwrap! (get a-twin-hash duel) ERR-BAD-STATE) seed 0x02)))
      (winner (if (> c-score a-score)
                challenger
                (if (> a-score c-score)
                  acceptor
                  ;; tie-break: even byte => challenger
                  (if (is-eq (mod (read-u16 (sha256 (concat seed 0x03)) u0) u2) u0) challenger acceptor))))
    )
      ;; winner takes all four escrowed tokens
      (try! (payout (get c-fighter duel) winner))
      (try! (payout (get c-weapon duel) winner))
      (try! (payout a-fighter winner))
      (try! (payout a-weapon winner))
      (map-set Duels duel-id (merge duel { state: STATE-RESOLVED }))
      (map-set Results duel-id {
        winner: winner,
        challenger-total: c-score,
        acceptor-total: a-score,
        seed: seed
      })
      (print { event: "duel-resolved", duel-id: duel-id, winner: winner,
               challenger-total: c-score, acceptor-total: a-score, seed: seed })
      (ok winner)
    )
  )
)

;; Challenger can cancel their own OPEN challenge at any time; anyone can
;; sweep an expired open challenge back to its challenger after open-ttl.
(define-public (cancel (duel-id uint))
  (let ((duel (unwrap! (map-get? Duels duel-id) ERR-NOT-FOUND)))
    (asserts! (is-eq (get state duel) STATE-OPEN) ERR-NOT-OPEN)
    (asserts! (or (is-eq tx-sender (get challenger duel))
                  (> stacks-block-height (+ (get created-at duel) (var-get open-ttl))))
              ERR-NOT-AUTHORIZED)
    (try! (payout (get c-fighter duel) (get challenger duel)))
    (try! (payout (get c-weapon duel) (get challenger duel)))
    (map-set Duels duel-id (merge duel { state: STATE-CANCELLED }))
    (print { event: "duel-cancelled", duel-id: duel-id })
    (ok true)
  )
)

;; ---------------------------------------------------------------------------
;; Reads + admin

(define-read-only (get-duel (duel-id uint))
  (map-get? Duels duel-id)
)

(define-read-only (get-result (duel-id uint))
  (map-get? Results duel-id)
)

(define-read-only (get-next-duel-id)
  (var-get next-duel-id)
)

(define-read-only (get-eligible-ranges)
  (var-get eligible-ranges)
)

(define-read-only (get-owner-principal)
  (var-get contract-owner)
)

(define-public (set-open-ttl (blocks uint))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (asserts! (and (>= blocks u6) (<= blocks u4320)) ERR-BAD-RANGE)
    (var-set open-ttl blocks)
    (ok true)
  )
)

(define-public (transfer-contract-ownership (new-owner principal))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (var-set contract-owner new-owner)
    (ok true)
  )
)
