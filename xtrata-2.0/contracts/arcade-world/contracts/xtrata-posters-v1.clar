;; xtrata-posters-v1
;;
;; Poster registry for the Xtrata Arcade (and later rooms). Room-agnostic.
;;
;; - Append-only poster records. Hidden is the only way to take one down; history stays.
;; - The hall computes the wall itself (deterministic rotation) from the pool this
;;   contract serves: it reads `get-version`, then `get-live` + `get-posters`.
;; - Bounded live set: at most 64 poster ids are "live" (not expired, not hidden), so the
;;   hall's load cost does not grow with history. Older posters stay readable by id.
;; - Start days are always in the future (day = burn-block-height / 144), so everyone
;;   sees the same pool for a given day. Admin pins are the one immediate path.
;; - Publishers (whitelist) add `community` posters within contract-enforced caps.
;;   Only admin can place `core` posters, evergreen, pins, or suppress embedded posters.
;; - Review lane: when on, publisher posters start hidden until admin releases them.
;; - Instant stop: set-publisher off, set-hidden, or set-paused.
;; - Successor pointer with a one-way lock; the read interface is frozen at v1.
;;
;; Kind values:   0 template, 1 image, 2 sheet, 3 live (art = binding key)
;; Set values:    0 core, 1 community
;; Action values: 0 none, 1 play inscription (act-id), 2 allowlisted path (act-text),
;;                3 play playlist inscription (act-id)

(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-PAUSED         (err u101))
(define-constant ERR-NOT-FOUND      (err u102))
(define-constant ERR-INVALID        (err u103))
(define-constant ERR-WINDOW         (err u104))
(define-constant ERR-WEIGHT         (err u105))
(define-constant ERR-INSCRIPTION    (err u106))
(define-constant ERR-CAP-DAY        (err u107))
(define-constant ERR-CAP-LIVE       (err u108))
(define-constant ERR-GAP            (err u109))
(define-constant ERR-LIVE-FULL      (err u110))
(define-constant ERR-NO-PENDING     (err u111))
(define-constant ERR-LOCKED         (err u112))
(define-constant ERR-PIN-FULL       (err u113))
(define-constant ERR-SUPPRESS-FULL  (err u114))

(define-constant DAY-BLOCKS u144)
(define-constant MAX-LIVE u64)
(define-constant MAX-COMMUNITY-LIVE u48)
(define-constant MAX-WEIGHT-CORE u100)
(define-constant MAX-WEIGHT-COMMUNITY u20)
(define-constant MAX-SPAN-DAYS u3650)
(define-constant MAX-IMAGE-BYTES u131072)
(define-constant MAX-SHEET-BYTES u307200)
(define-constant MAX-GENESIS-INDEX u159)

(define-data-var admin principal tx-sender)
(define-data-var pending-admin (optional principal) none)
(define-data-var paused bool false)
(define-data-var version uint u0)
(define-data-var count uint u0)
(define-data-var review-lane bool false)
(define-data-var cap-per-day uint u24)
(define-data-var cap-live-per-publisher uint u12)
(define-data-var min-gap uint u1)
(define-data-var successor (optional principal) none)
(define-data-var successor-locked bool false)
(define-data-var live (list 64 uint) (list))
(define-data-var suppressed (list 160 uint) (list))

;; scratch values used by filter/fold helpers (always set just before use)
(define-data-var scratch-day uint u0)
(define-data-var scratch-id uint u0)
(define-data-var scratch-who principal tx-sender)

(define-map Publishers principal bool)
(define-map LastWrite principal uint)
(define-map DayCount { who: principal, day: uint } uint)

(define-map Posters uint
  {
    owner: principal,
    set: uint,
    kind: uint,
    head: (string-ascii 48),
    sub: (string-ascii 140),
    foot: (string-ascii 32),
    colour: (string-ascii 12),
    art: (string-ascii 24),
    image-id: uint,
    image-hash: (buff 32),
    image-size: uint,
    cols: uint,
    frames: uint,
    fps: uint,
    act-kind: uint,
    act-id: uint,
    act-text: (string-ascii 64),
    weight: uint,
    start-day: uint,
    end-day: uint,
    scope: (list 8 (string-ascii 24)),
    hidden: bool,
    evergreen: bool,
    payout: (optional principal),
    added-at: uint
  })

(define-map Pins (string-ascii 24)
  (list 16 { spot: uint, poster: uint, from-day: uint, to-day: uint }))

;; ---------------------------------------------------------------------------
;; Helpers

(define-private (caller-is (who principal))
  (and (is-eq tx-sender who) (is-eq contract-caller who)))

(define-private (is-admin) (caller-is (var-get admin)))

(define-private (can-publish)
  (or (is-admin) (and (caller-is tx-sender) (default-to false (map-get? Publishers tx-sender)))))

(define-private (today) (/ burn-block-height DAY-BLOCKS))

(define-private (bump)
  (begin (var-set version (+ (var-get version) u1)) (var-get version)))

(define-private (note (event (string-ascii 24)) (id uint))
  (print { event: event, id: id, version: (bump) }))

(define-private (inscription-ok? (id uint) (hash (buff 32)) (size uint) (who principal))
  (and
    (is-eq (contract-call? .mock-xtrata-core inscription-exists id) (ok true)) ;; @principal core
    (is-eq (contract-call? .mock-xtrata-core is-inscription-sealed id) (some true)) ;; @principal core
    (is-eq (contract-call? .mock-xtrata-core get-inscription-hash id) (some hash)) ;; @principal core
    (is-eq (contract-call? .mock-xtrata-core get-inscription-size id) (some size)) ;; @principal core
    (is-eq (contract-call? .mock-xtrata-core get-inscription-creator id) (some who)) ;; @principal core
  ))

;; live-set filters (read scratch vars)
(define-private (alive? (id uint))
  (match (map-get? Posters id)
    p (and (not (get hidden p))
           (or (get evergreen p) (> (get end-day p) (var-get scratch-day))))
    false))

(define-private (not-scratch-id? (id uint)) (not (is-eq id (var-get scratch-id))))

(define-private (owned-live-step (id uint) (n uint))
  (match (map-get? Posters id)
    p (if (is-eq (get owner p) (var-get scratch-who)) (+ n u1) n)
    n))

(define-private (community-step (id uint) (n uint))
  (match (map-get? Posters id)
    p (if (is-eq (get set p) u1) (+ n u1) n)
    n))

;; Prunes expired/hidden ids, then appends `id`. Errors if the set is full, or if a
;; community poster would take the community share (48 of 64) past its limit.
(define-private (live-add (id uint))
  (begin
    (var-set scratch-day (today))
    (let ((kept (filter alive? (var-get live))))
      (if (is-some (index-of? kept id))
        (ok (var-set live kept))
        (match (if (and (is-eq (get set (unwrap! (map-get? Posters id) ERR-NOT-FOUND)) u1)
                        (>= (fold community-step kept u0) MAX-COMMUNITY-LIVE))
                 none
                 (as-max-len? (append kept id) u64))
          next (ok (var-set live next))
          ERR-LIVE-FULL)))))

(define-private (live-remove (id uint))
  (begin
    (var-set scratch-id id)
    (var-set live (filter not-scratch-id? (var-get live)))))

(define-private (check-weight (set uint) (weight uint))
  (and (>= weight u1)
       (<= weight (if (is-eq set u0) MAX-WEIGHT-CORE MAX-WEIGHT-COMMUNITY))))

;; ---------------------------------------------------------------------------
;; Adding posters

(define-private (add-one
  (p {
    set: uint, kind: uint,
    head: (string-ascii 48), sub: (string-ascii 140), foot: (string-ascii 32),
    colour: (string-ascii 12), art: (string-ascii 24),
    image-id: uint, image-hash: (buff 32), image-size: uint,
    cols: uint, frames: uint, fps: uint,
    act-kind: uint, act-id: uint, act-text: (string-ascii 64),
    weight: uint, start-day: uint, end-day: uint,
    scope: (list 8 (string-ascii 24)), evergreen: bool, payout: (optional principal)
  })
  (acc (response uint uint)))
  (match acc
    n
      (let (
        (admin? (is-admin))
        (day (today))
        (id (var-get count))
        (kind (get kind p))
        (set (get set p))
        (hidden (and (not admin?) (var-get review-lane)))
        (day-key { who: tx-sender, day: day })
        (used (default-to u0 (map-get? DayCount day-key))))
        (asserts! (<= kind u3) ERR-INVALID)
        (asserts! (<= set u1) ERR-INVALID)
        (asserts! (or admin? (and (is-eq set u1) (not (get evergreen p)))) ERR-NOT-AUTHORIZED)
        (asserts! (>= (len (get head p)) u1) ERR-INVALID)
        (asserts! (<= (get act-kind p) u3) ERR-INVALID)
        (asserts! (check-weight set (get weight p)) ERR-WEIGHT)
        (asserts! (and (> (get start-day p) day)
                       (> (get end-day p) (get start-day p))
                       (<= (- (get end-day p) (get start-day p)) MAX-SPAN-DAYS)) ERR-WINDOW)
        (asserts! (or (not (is-eq kind u3)) (> (len (get art p)) u0)) ERR-INVALID)
        (if (or (is-eq kind u1) (is-eq kind u2))
          (begin
            (asserts! (<= (get image-size p) (if (is-eq kind u1) MAX-IMAGE-BYTES MAX-SHEET-BYTES)) ERR-INSCRIPTION)
            (asserts! (inscription-ok? (get image-id p) (get image-hash p) (get image-size p) tx-sender) ERR-INSCRIPTION)
            (asserts! (or (is-eq kind u1)
                          (and (> (get cols p) u0) (> (get frames p) u0) (<= (get frames p) u64)
                               (> (get fps p) u0) (<= (get fps p) u30))) ERR-INVALID)
            true)
          true)
        (if admin?
          true
          (begin
            (asserts! (< used (var-get cap-per-day)) ERR-CAP-DAY)
            (var-set scratch-who tx-sender)
            (var-set scratch-day day)
            (asserts! (or hidden
                          (< (fold owned-live-step (filter alive? (var-get live)) u0)
                             (var-get cap-live-per-publisher))) ERR-CAP-LIVE)
            (map-set DayCount day-key (+ used u1))
            true))
        (map-set Posters id {
          owner: tx-sender, set: set, kind: kind,
          head: (get head p), sub: (get sub p), foot: (get foot p),
          colour: (get colour p), art: (get art p),
          image-id: (get image-id p), image-hash: (get image-hash p), image-size: (get image-size p),
          cols: (get cols p), frames: (get frames p), fps: (get fps p),
          act-kind: (get act-kind p), act-id: (get act-id p), act-text: (get act-text p),
          weight: (get weight p), start-day: (get start-day p), end-day: (get end-day p),
          scope: (get scope p), hidden: hidden, evergreen: (get evergreen p),
          payout: (get payout p), added-at: stacks-block-height })
        (var-set count (+ id u1))
        (if hidden true (begin (try! (live-add id)) true))
        (note "poster-added" id)
        (ok (+ n u1)))
    e (err e)))

(define-private (write-gate)
  (begin
    (asserts! (not (var-get paused)) ERR-PAUSED)
    (asserts! (can-publish) ERR-NOT-AUTHORIZED)
    (if (is-admin)
      true
      (begin
        (asserts! (match (map-get? LastWrite tx-sender) last (>= burn-block-height (+ last (var-get min-gap))) true) ERR-GAP)
        (map-set LastWrite tx-sender burn-block-height)
        true))
    (ok true)))

(define-public (add-poster
  (p {
    set: uint, kind: uint,
    head: (string-ascii 48), sub: (string-ascii 140), foot: (string-ascii 32),
    colour: (string-ascii 12), art: (string-ascii 24),
    image-id: uint, image-hash: (buff 32), image-size: uint,
    cols: uint, frames: uint, fps: uint,
    act-kind: uint, act-id: uint, act-text: (string-ascii 64),
    weight: uint, start-day: uint, end-day: uint,
    scope: (list 8 (string-ascii 24)), evergreen: bool, payout: (optional principal)
  }))
  (begin
    (try! (write-gate))
    (try! (add-one p (ok u0)))
    (ok (- (var-get count) u1))))

(define-public (add-posters
  (ps (list 10 {
    set: uint, kind: uint,
    head: (string-ascii 48), sub: (string-ascii 140), foot: (string-ascii 32),
    colour: (string-ascii 12), art: (string-ascii 24),
    image-id: uint, image-hash: (buff 32), image-size: uint,
    cols: uint, frames: uint, fps: uint,
    act-kind: uint, act-id: uint, act-text: (string-ascii 64),
    weight: uint, start-day: uint, end-day: uint,
    scope: (list 8 (string-ascii 24)), evergreen: bool, payout: (optional principal)
  })))
  (begin
    (try! (write-gate))
    (fold add-one ps (ok u0))))

;; ---------------------------------------------------------------------------
;; Changing posters (never edits content)

(define-private (unhide-one (id uint) (acc (response bool uint)))
  (match acc
    ok-v
      (match (map-get? Posters id)
        p (begin
            (map-set Posters id (merge p { hidden: false }))
            (var-set scratch-day (today))
            (if (or (get evergreen p) (> (get end-day p) (today)))
              (try! (live-add id))
              true)
            (ok true))
        ERR-NOT-FOUND)
    e (err e)))

(define-private (refresh-live (id uint))
  (match (map-get? Posters id)
    p (if (and (not (get hidden p)) (or (get evergreen p) (> (get end-day p) (today))))
        (begin (var-set scratch-day (today)) (live-add id))
        (ok true))
    ERR-NOT-FOUND))

(define-public (set-hidden (id uint) (hidden bool))
  (let ((p (unwrap! (map-get? Posters id) ERR-NOT-FOUND)))
    (asserts! (or (is-admin) (and hidden (is-eq tx-sender (get owner p)))) ERR-NOT-AUTHORIZED)
    (if hidden
      (begin
        (map-set Posters id (merge p { hidden: true }))
        (live-remove id)
        (note "poster-hidden" id)
        (ok true))
      (begin
        (try! (unhide-one id (ok true)))
        (note "poster-released" id)
        (ok true)))))

;; Review lane: release a batch of hidden posters.
(define-public (release-posters (ids (list 20 uint)))
  (begin
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (try! (fold unhide-one ids (ok true)))
    (print { event: "posters-released", count: (len ids), version: (bump) })
    (ok true)))

(define-public (set-weight (id uint) (weight uint))
  (let ((p (unwrap! (map-get? Posters id) ERR-NOT-FOUND)))
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (asserts! (check-weight (get set p) weight) ERR-WEIGHT)
    (map-set Posters id (merge p { weight: weight }))
    (note "poster-weight" id)
    (ok true)))

;; Window changes: end-day may always move (but stays after today); start-day only
;; while the poster has not started, and only to a future day.
(define-public (set-window (id uint) (start-day uint) (end-day uint))
  (let ((p (unwrap! (map-get? Posters id) ERR-NOT-FOUND)) (day (today)))
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (asserts! (and (> end-day start-day) (> end-day day)
                   (<= (- end-day start-day) MAX-SPAN-DAYS)) ERR-WINDOW)
    (asserts! (or (is-eq start-day (get start-day p))
                  (and (> (get start-day p) day) (> start-day day))) ERR-WINDOW)
    (map-set Posters id (merge p { start-day: start-day, end-day: end-day }))
    (try! (refresh-live id))
    (note "poster-window" id)
    (ok true)))

(define-public (set-set (id uint) (set uint))
  (let ((p (unwrap! (map-get? Posters id) ERR-NOT-FOUND)))
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (asserts! (<= set u1) ERR-INVALID)
    (asserts! (check-weight set (get weight p)) ERR-WEIGHT)
    (map-set Posters id (merge p { set: set }))
    (note "poster-set" id)
    (ok true)))

(define-public (set-evergreen (id uint) (evergreen bool))
  (let ((p (unwrap! (map-get? Posters id) ERR-NOT-FOUND)))
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (map-set Posters id (merge p { evergreen: evergreen }))
    (try! (refresh-live id))
    (note "poster-evergreen" id)
    (ok true)))

;; ---------------------------------------------------------------------------
;; Pins (admin only; the one immediate path)

(define-private (pin-keep? (pin { spot: uint, poster: uint, from-day: uint, to-day: uint }))
  (and (>= (get to-day pin) (var-get scratch-day))
       (not (is-eq (get spot pin) (var-get scratch-id)))))

(define-public (set-pin (room (string-ascii 24)) (spot uint) (poster uint) (from-day uint) (to-day uint))
  (let ((kept (begin
                (var-set scratch-day (today))
                (var-set scratch-id spot)
                (filter pin-keep? (default-to (list) (map-get? Pins room))))))
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (asserts! (is-some (map-get? Posters poster)) ERR-NOT-FOUND)
    (asserts! (and (>= to-day from-day) (>= to-day (today))) ERR-WINDOW)
    (map-set Pins room
      (unwrap! (as-max-len? (append kept { spot: spot, poster: poster, from-day: from-day, to-day: to-day }) u16)
               ERR-PIN-FULL))
    (print { event: "pin-set", room: room, spot: spot, poster: poster, from-day: from-day, to-day: to-day, version: (bump) })
    (ok true)))

(define-public (clear-pin (room (string-ascii 24)) (spot uint))
  (begin
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (var-set scratch-day u0)
    (var-set scratch-id spot)
    (map-set Pins room (filter pin-keep? (default-to (list) (map-get? Pins room))))
    (print { event: "pin-cleared", room: room, spot: spot, version: (bump) })
    (ok true)))

;; ---------------------------------------------------------------------------
;; Suppressing embedded (genesis) posters by index

(define-private (not-scratch-idx? (i uint)) (not (is-eq i (var-get scratch-id))))

(define-public (suppress-genesis (idx uint))
  (begin
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (asserts! (<= idx MAX-GENESIS-INDEX) ERR-INVALID)
    (if (is-some (index-of? (var-get suppressed) idx))
      (ok true)
      (begin
        (var-set suppressed (unwrap! (as-max-len? (append (var-get suppressed) idx) u160) ERR-SUPPRESS-FULL))
        (print { event: "genesis-suppressed", idx: idx, version: (bump) })
        (ok true)))))

(define-public (unsuppress-genesis (idx uint))
  (begin
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (var-set scratch-id idx)
    (var-set suppressed (filter not-scratch-idx? (var-get suppressed)))
    (print { event: "genesis-unsuppressed", idx: idx, version: (bump) })
    (ok true)))

;; ---------------------------------------------------------------------------
;; Roles, caps, pause, hand-over, successor

(define-public (set-publisher (who principal) (allowed bool))
  (begin
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (map-set Publishers who allowed)
    (print { event: "publisher", who: who, allowed: allowed, version: (bump) })
    (ok true)))

(define-public (set-review-lane (on bool))
  (begin
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (var-set review-lane on)
    (print { event: "review-lane", on: on, version: (bump) })
    (ok true)))

(define-public (set-caps (per-day uint) (live-per-publisher uint) (gap uint))
  (begin
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (asserts! (and (<= per-day u100) (<= live-per-publisher MAX-LIVE) (<= gap u144)) ERR-INVALID)
    (var-set cap-per-day per-day)
    (var-set cap-live-per-publisher live-per-publisher)
    (var-set min-gap gap)
    (print { event: "caps", per-day: per-day, live-per-publisher: live-per-publisher, gap: gap, version: (bump) })
    (ok true)))

(define-public (set-paused (value bool))
  (begin
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (var-set paused value)
    (print { event: "paused", value: value, version: (bump) })
    (ok true)))

(define-public (propose-admin (who principal))
  (begin
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (var-set pending-admin (some who))
    (ok true)))

(define-public (accept-admin)
  (let ((pending (unwrap! (var-get pending-admin) ERR-NO-PENDING)))
    (asserts! (is-eq tx-sender pending) ERR-NOT-AUTHORIZED)
    (var-set admin pending)
    (var-set pending-admin none)
    (print { event: "admin", who: pending, version: (bump) })
    (ok true)))

(define-public (set-successor (who (optional principal)))
  (begin
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (asserts! (not (var-get successor-locked)) ERR-LOCKED)
    (var-set successor who)
    (print { event: "successor", who: who, version: (bump) })
    (ok true)))

(define-public (lock-successor)
  (begin
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (var-set successor-locked true)
    (print { event: "successor-locked", version: (bump) })
    (ok true)))

;; ---------------------------------------------------------------------------
;; Reads (frozen at v1: add new reads as new functions, never change these)

(define-read-only (get-version) (var-get version))
(define-read-only (get-count) (var-get count))
(define-read-only (get-today) (today))
(define-read-only (get-poster (id uint)) (map-get? Posters id))
(define-read-only (get-posters (ids (list 10 uint))) (map get-poster ids))
(define-read-only (get-page (start uint))
  (map get-poster (list start (+ start u1) (+ start u2) (+ start u3) (+ start u4)
                        (+ start u5) (+ start u6) (+ start u7) (+ start u8) (+ start u9))))
(define-read-only (get-live) (var-get live))
(define-read-only (get-pins (room (string-ascii 24))) (default-to (list) (map-get? Pins room)))
(define-read-only (get-suppressed) (var-get suppressed))
(define-read-only (get-successor) { successor: (var-get successor), locked: (var-get successor-locked) })
(define-read-only (is-publisher (who principal)) (default-to false (map-get? Publishers who)))
(define-read-only (get-config)
  { admin: (var-get admin), pending-admin: (var-get pending-admin), paused: (var-get paused),
    review-lane: (var-get review-lane), cap-per-day: (var-get cap-per-day),
    cap-live-per-publisher: (var-get cap-live-per-publisher), min-gap: (var-get min-gap) })
