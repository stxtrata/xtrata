;; Paid plays, version 2 (DRAFT, testnet only until reviewed).
;; One transaction settles one or several plays, each paid straight from the listener to the song's
;; current holder at a rate the owner can change within fixed limits. No custody and no treasury:
;; this contract never holds STX, and the owner can change the two settings below and nothing else.
;; Core selectors are explicit: identical IDs in different cores are distinct masters.

;; ---- limits the owner cannot move ----
(define-constant RATE-MIN u50)     ;; microSTX per play: never less than version 1 paid
(define-constant RATE-MAX u1000)   ;; and never more than this, whatever the owner sets
(define-constant BATCH-MAX u10)    ;; most plays one transaction may settle

;; ---- settings (owner) ----
(define-data-var owner principal tx-sender)
(define-data-var rate uint u50)    ;; microSTX the holder receives for each play
(define-data-var batch uint u1)    ;; most plays in one settlement: 1 = pay every play, as version 1 did

;; ---- records ----
;; One receipt per settlement (the listener's player makes it up; it can never be used twice).
(define-map receipts {payer: principal, receipt: (buff 16)} {plays: uint, paid: uint, skipped: uint, amount: uint, rate: uint})
(define-map totals {core: uint, id: uint} uint)   ;; paid plays of a song
(define-map earned {core: uint, id: uint} uint)   ;; microSTX paid for a song through this contract

(define-read-only (get-config)
 (ok {version: u2, rate: (var-get rate), batch: (var-get batch), owner: (var-get owner),
  rate-min: RATE-MIN, rate-max: RATE-MAX, batch-max: BATCH-MAX, receipt-bytes: u16,
  core-1: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v1-1-1,
  core-2: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v2-1-0,
  core-3: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3}))
(define-read-only (get-receipt (payer principal) (receipt (buff 16)))
 (map-get? receipts {payer: payer, receipt: receipt}))
(define-read-only (get-total (core uint) (id uint))
 (default-to u0 (map-get? totals {core: core, id: id})))
(define-read-only (get-earned (core uint) (id uint))
 (default-to u0 (map-get? earned {core: core, id: id})))
(define-read-only (get-owner (core uint) (id uint))
 (if (is-eq core u3)
  (contract-call? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3 get-owner id)
  (if (is-eq core u2)
   (contract-call? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v2-1-0 get-owner id)
   (if (is-eq core u1)
    (contract-call? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v1-1-1 get-owner id)
    (err u101)))))

;; ---- owner ----
;; Both settings at once, so a change is one event and never half applied.
(define-public (set-settings (new-rate uint) (new-batch uint))
 (begin
  (asserts! (is-eq tx-sender (var-get owner)) (err u110))
  (asserts! (and (>= new-rate RATE-MIN) (<= new-rate RATE-MAX)) (err u111))
  (asserts! (and (>= new-batch u1) (<= new-batch BATCH-MAX)) (err u112))
  (var-set rate new-rate)
  (var-set batch new-batch)
  (print {event: "radio-plays-settings", version: u2, rate: new-rate, batch: new-batch, by: tx-sender})
  (ok {rate: new-rate, batch: new-batch})))
(define-public (set-owner (new-owner principal))
 (begin
  (asserts! (is-eq tx-sender (var-get owner)) (err u110))
  (var-set owner new-owner)
  (print {event: "radio-plays-owner", version: u2, owner: new-owner, by: tx-sender})
  (ok new-owner)))

;; ---- settling ----
;; Who a play pays, or why it cannot be paid:
;;   u104 no such song (or its core would not say); u105 the listener holds the song themselves;
;;   u106 a contract holds it (escrow and custodians need a separately reviewed beneficiary resolver).
(define-private (payee (core uint) (id uint))
 (match (get-owner core id)
  found (match found
   who (if (is-eq who tx-sender)
    {recipient: none, why: u105}
    (if (match (principal-destruct? who) d (is-some (get name d)) e true)
     {recipient: none, why: u106}
     {recipient: (some who), why: u0}))
   {recipient: none, why: u104})
  e {recipient: none, why: u104}))

;; One play of a settlement. A play that cannot be paid is reported and skipped, so one song changing
;; hands (or going into escrow) between the play and the settlement cannot block the listener's other
;; plays. `n` is the play's place in the settlement, from 0; with the receipt it names the play.
(define-private (pay-one (core uint) (id uint)
                         (state {receipt: (buff 16), rate: uint, n: uint, paid: uint, skipped: uint, amount: uint}))
 (let ((to (payee core id)) (pay (get rate state)) (next (merge state {n: (+ (get n state) u1)})))
  (asserts! (and (>= core u1) (<= core u3)) (err u101))
  (match (get recipient to)
   who (let ((count (+ (get-total core id) u1)))
    (try! (stx-transfer? pay tx-sender who))
    (map-set totals {core: core, id: id} count)
    (map-set earned {core: core, id: id} (+ (get-earned core id) pay))
    (print {event: "radio-paid-play", version: u2, core: core, id: id, payer: tx-sender,
     receipt: (get receipt state), n: (get n state), recipient: who, amount: pay, total: count})
    (ok (merge next {paid: (+ (get paid state) u1), amount: (+ (get amount state) pay)})))
   (begin
    (print {event: "radio-play-skipped", version: u2, core: core, id: id, payer: tx-sender,
     receipt: (get receipt state), n: (get n state), why: (get why to)})
    (ok (merge next {skipped: (+ (get skipped state) u1)}))))))

;; Checks every settlement passes before any play is paid.
(define-private (open (receipt (buff 16)) (agreed-rate uint) (plays uint))
 (begin
  (asserts! (is-eq tx-sender contract-caller) (err u100))
  (asserts! (is-eq (len receipt) u16) (err u102))
  (asserts! (is-none (map-get? receipts {payer: tx-sender, receipt: receipt})) (err u103))
  (asserts! (is-eq agreed-rate (var-get rate)) (err u107))
  (asserts! (and (>= plays u1) (<= plays (var-get batch))) (err u108))
  (ok {receipt: receipt, rate: agreed-rate, n: u0, paid: u0, skipped: u0, amount: u0})))

(define-private (close (state {receipt: (buff 16), rate: uint, n: uint, paid: uint, skipped: uint, amount: uint}))
 (begin
  (map-set receipts {payer: tx-sender, receipt: (get receipt state)}
   {plays: (get n state), paid: (get paid state), skipped: (get skipped state), amount: (get amount state), rate: (get rate state)})
  (ok {paid: (get paid state), skipped: (get skipped state), amount: (get amount state)})))

;; ---- settle, written out: easy to read in an explorer, but a bigger transaction ----
;; `agreed-rate` is the rate the listener signed for: if the owner has changed the rate since, nothing
;; is paid and the listener's player asks again at the new rate.
(define-private (step (p {core: uint, id: uint})
                      (acc (response {receipt: (buff 16), rate: uint, n: uint, paid: uint, skipped: uint, amount: uint} uint)))
 (pay-one (get core p) (get id p) (try! acc)))
(define-public (settle (plays (list 10 {core: uint, id: uint})) (receipt (buff 16)) (agreed-rate uint))
 (close (try! (fold step plays (open receipt agreed-rate (len plays))))))

;; ---- settle, packed: the same thing in the fewest bytes, so the network fee stays small ----
;; data = rate (2 bytes, big-endian) + receipt (16 bytes) + one 5-byte entry per play:
;;        core (1 byte) + song id (4 bytes, big-endian). So 23 bytes for one play, 68 for ten.
(define-private (num (data (buff 68)) (from uint) (to uint))
 (buff-to-uint-be (unwrap! (as-max-len? (unwrap! (slice? data from to) u0) u16) u0)))
(define-private (step-packed (i uint)
                             (acc (response {data: (buff 68), plays: uint, state: {receipt: (buff 16), rate: uint, n: uint, paid: uint, skipped: uint, amount: uint}} uint)))
 (let ((a (try! acc)) (at (+ u18 (* i u5))))
  (if (>= i (get plays a))
   (ok a)
   (ok (merge a {state: (try! (pay-one (num (get data a) at (+ at u1)) (num (get data a) (+ at u1) (+ at u5)) (get state a)))})))))
(define-public (settle-packed (data (buff 68)))
 (let ((size (len data)) (plays (if (>= (len data) u23) (/ (- (len data) u18) u5) u0)))
  (asserts! (and (>= size u23) (is-eq size (+ u18 (* plays u5)))) (err u109))
  (let ((state (try! (open (unwrap! (as-max-len? (unwrap! (slice? data u2 u18) (err u109)) u16) (err u109)) (num data u0 u2) plays))))
   (close (get state (try! (fold step-packed (list u0 u1 u2 u3 u4 u5 u6 u7 u8 u9) (ok {data: data, plays: plays, state: state}))))))))
