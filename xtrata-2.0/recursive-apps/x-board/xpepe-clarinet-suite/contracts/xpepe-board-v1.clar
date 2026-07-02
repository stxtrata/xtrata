;; Bitcoin Pepe Twins Board — v1 registry (free, Pepe-gated claims)
;; Purpose: permanent slot ownership for the 329-square Pepe board.
;; Claims move NO STX — holders only pay the network fee.
;; Gating: the claimed inscription must be an admitted Pepe twin AND owned by the
;; caller. Status: first draft. Run Clarinet tests + external review before use.
;;
;; NOTE: v2 (auction + lifetime ownership + rentals + update fee) supersedes this
;; economic model. v1 is the simple free baseline the standalone board ships with.

;; -----------------------------------------------------------------------------
;; Constants and errors
;; -----------------------------------------------------------------------------
(define-constant CONTRACT-OWNER tx-sender)

(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-INVALID-SLOT   (err u101))
(define-constant ERR-SLOT-TAKEN     (err u102))
(define-constant ERR-NOT-OWNER      (err u103))
(define-constant ERR-NOT-PEPE       (err u104))
(define-constant ERR-NOT-PEPE-OWNER (err u105))
(define-constant ERR-PAUSED         (err u106))
(define-constant ERR-INDIRECT-CALL  (err u107))

(define-constant MAX-SLOT-ID u328)        ;; 329 slots, u0..u328

;; -----------------------------------------------------------------------------
;; State
;; -----------------------------------------------------------------------------
(define-data-var admin principal CONTRACT-OWNER)
(define-data-var paused bool false)
(define-data-var claimed-count uint u0)

;; Permanent slot ownership + the Pepe inscription it displays.
(define-map slots
  { slot-id: uint }
  { owner: principal, inscription-id: uint, claimed-at: uint }
)

;; Admin-seeded allowlist of Pepe-twin inscription ids.
(define-map pepe-allow { inscription-id: uint } { ok: bool })

;; -----------------------------------------------------------------------------
;; Guards / helpers
;; -----------------------------------------------------------------------------
(define-private (is-direct-call) (is-eq tx-sender contract-caller))
(define-private (is-admin) (is-eq tx-sender (var-get admin)))
(define-private (valid-slot (slot-id uint)) (<= slot-id MAX-SLOT-ID))
(define-private (is-pepe (inscription-id uint))
  (default-to false (get ok (map-get? pepe-allow { inscription-id: inscription-id })))
)

;; Verify the caller owns the inscription on the Xtrata contract.
;; IMPORTANT: confirm the exact Xtrata read-only signature before deployment.
;; Assumed here: (get-owner (uint)) -> (response (optional principal) uint).
(define-private (owns-pepe (inscription-id uint))
  (match (contract-call? 'SP2CWY47KCSYT6VZDV8CZ1WSBA5JASPHDP95ADB96.xtrata-v2 get-owner inscription-id)
    owner-opt (is-eq (some tx-sender) owner-opt)
    err-val   false
  )
)

;; -----------------------------------------------------------------------------
;; Admin: seed Pepe allowlist, pause, transfer admin
;; -----------------------------------------------------------------------------
(define-public (set-pepe (inscription-id uint) (ok bool))
  (begin
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (ok (map-set pepe-allow { inscription-id: inscription-id } { ok: ok }))
  )
)

(define-public (set-pepe-batch (ids (list 200 uint)))
  (begin
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (ok (fold seed-one ids u0))
  )
)
(define-private (seed-one (id uint) (n uint))
  (begin (map-set pepe-allow { inscription-id: id } { ok: true }) (+ n u1))
)

(define-public (set-paused (value bool))
  (begin (asserts! (is-admin) ERR-NOT-AUTHORIZED) (ok (var-set paused value)))
)

(define-public (set-admin (who principal))
  (begin (asserts! (is-admin) ERR-NOT-AUTHORIZED) (ok (var-set admin who)))
)

;; -----------------------------------------------------------------------------
;; Public: claim, update display, release
;; -----------------------------------------------------------------------------
(define-public (claim-slot (slot-id uint) (inscription-id uint))
  (begin
    (asserts! (is-direct-call) ERR-INDIRECT-CALL)
    (asserts! (not (var-get paused)) ERR-PAUSED)
    (asserts! (valid-slot slot-id) ERR-INVALID-SLOT)
    (asserts! (is-none (map-get? slots { slot-id: slot-id })) ERR-SLOT-TAKEN)
    (asserts! (is-pepe inscription-id) ERR-NOT-PEPE)
    (asserts! (owns-pepe inscription-id) ERR-NOT-PEPE-OWNER)
    (map-set slots { slot-id: slot-id }
      { owner: tx-sender, inscription-id: inscription-id, claimed-at: stacks-block-height })
    (var-set claimed-count (+ (var-get claimed-count) u1))
    (print { event: "claim", slot: slot-id, owner: tx-sender, inscription: inscription-id })
    (ok true)
  )
)

(define-public (update-display (slot-id uint) (inscription-id uint))
  (let ((entry (unwrap! (map-get? slots { slot-id: slot-id }) ERR-INVALID-SLOT)))
    (asserts! (is-direct-call) ERR-INDIRECT-CALL)
    (asserts! (is-eq tx-sender (get owner entry)) ERR-NOT-OWNER)
    (asserts! (is-pepe inscription-id) ERR-NOT-PEPE)
    (asserts! (owns-pepe inscription-id) ERR-NOT-PEPE-OWNER)
    (map-set slots { slot-id: slot-id } (merge entry { inscription-id: inscription-id }))
    (print { event: "update", slot: slot-id, inscription: inscription-id })
    (ok true)
  )
)

(define-public (release-slot (slot-id uint))
  (let ((entry (unwrap! (map-get? slots { slot-id: slot-id }) ERR-INVALID-SLOT)))
    (asserts! (is-direct-call) ERR-INDIRECT-CALL)
    (asserts! (is-eq tx-sender (get owner entry)) ERR-NOT-OWNER)
    (map-delete slots { slot-id: slot-id })
    (var-set claimed-count (- (var-get claimed-count) u1))
    (print { event: "release", slot: slot-id })
    (ok true)
  )
)

;; -----------------------------------------------------------------------------
;; Reads
;; -----------------------------------------------------------------------------
(define-read-only (get-slot (slot-id uint)) (map-get? slots { slot-id: slot-id }))
(define-read-only (get-owner (slot-id uint)) (get owner (map-get? slots { slot-id: slot-id })))
(define-read-only (is-pepe-id (inscription-id uint)) (is-pepe inscription-id))
(define-read-only (can-claim (slot-id uint))
  (and (not (var-get paused)) (valid-slot slot-id) (is-none (map-get? slots { slot-id: slot-id })))
)
(define-read-only (get-stats)
  { claimed: (var-get claimed-count), max-slot: MAX-SLOT-ID, paused: (var-get paused), admin: (var-get admin) }
)
