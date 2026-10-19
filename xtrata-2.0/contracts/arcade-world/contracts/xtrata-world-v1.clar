;; xtrata-world-v1
;;
;; Rooms, bays, scenes and looks for the Xtrata Arcade and the rooms that follow it.
;;
;; - A ROOM is an id (e.g. "arcade-hall") with a title, an owner and a current entry
;;   inscription. The room's own code defines how many BAYS it has and where they are;
;;   this contract only decides what is in them.
;; - A SCENE is what a bay shows from a Bitcoin block height onward. Scenes are
;;   appended, never edited. The active scene is the non-retracted scene with the
;;   greatest from-height that has passed (ties: the later one). If there is none, the
;;   bay shows its default: posters, exactly as before this contract existed.
;;   A from-height in the past is raised to "now", so a new scene is never buried
;;   under an older one that already started.
;; - A scene has a base (0 posters, 1 wall, 2 door), optional layers (cover, overlay,
;;   sound, light), a door interaction and an optional link to another room or an
;;   allowlisted path. Layers carry a look id plus a short params text that the contract
;;   stores and never parses; the hall validates it.
;; - A LOOK is a reusable design registered once. Tiers: 0 built-in (hall release),
;;   1 data-only recipe (inscription), 2 sandboxed module (inscription, admin
;;   approval), 3 in-hall module (admin only, approval). Looks are hidden, never edited.
;; - Successor pointer with a one-way lock; the read interface is frozen at v1.
;;
;; Look kinds:  0 door, 1 cover, 2 overlay, 3 sound, 4 light  (a layer's slot = look kind)
;; Interaction: 0 none (prop), 1 knock, 2 peek, 3 enter (needs a link)

(define-constant ERR-NOT-AUTHORIZED (err u200))
(define-constant ERR-PAUSED         (err u201))
(define-constant ERR-NOT-FOUND      (err u202))
(define-constant ERR-INVALID        (err u203))
(define-constant ERR-EXISTS         (err u204))
(define-constant ERR-BAD-LOOK       (err u205))
(define-constant ERR-INSCRIPTION    (err u206))
(define-constant ERR-TIMELINE-FULL  (err u207))
(define-constant ERR-NO-PENDING     (err u208))
(define-constant ERR-LOCKED         (err u209))
(define-constant ERR-BAD-LINK       (err u210))
(define-constant ERR-BAD-BAY        (err u211))
(define-constant ERR-LAYERS         (err u212))

(define-constant MAX-BAYS u8)
(define-constant MAX-TIMELINE u48)
(define-constant MAX-RECIPE-BYTES u8192)
(define-constant MAX-MODULE-BYTES u262144)

(define-data-var admin principal tx-sender)
(define-data-var pending-admin (optional principal) none)
(define-data-var paused bool false)
(define-data-var version uint u0)
(define-data-var look-count uint u0)
(define-data-var successor (optional principal) none)
(define-data-var successor-locked bool false)

;; scratch values used by filter/fold helpers (always set just before use)
(define-data-var scratch-slot uint u0)
(define-data-var scratch-now uint u0)
(define-data-var scratch-seq uint u0)

(define-map Publishers principal bool)

(define-map Rooms (string-ascii 24)
  { title: (string-ascii 48), owner: principal, entry-id: (optional uint), bays: uint, hidden: bool })

(define-map Looks uint
  {
    kind: uint, name: (string-ascii 32), tier: uint, builtin: (string-ascii 24),
    src-id: uint, src-hash: (buff 32), src-size: uint,
    set: uint, hidden: bool, approved: bool, owner: principal, added-at: uint
  })

(define-map Scenes { room: (string-ascii 24), bay: uint, seq: uint }
  {
    from-height: uint,
    retracted: bool,
    base: uint,
    door-look: (optional uint),
    layers: (list 8 { slot: uint, look: uint, params: (string-ascii 256), state: (string-ascii 24) }),
    interaction: uint,
    link: (optional { target-room: (string-ascii 24), arrival-bay: uint, path: (string-ascii 64) }),
    author: principal,
    added-at: uint
  })

(define-map SeqCount { room: (string-ascii 24), bay: uint } uint)
(define-map Timeline { room: (string-ascii 24), bay: uint } (list 48 { seq: uint, from: uint }))

;; ---------------------------------------------------------------------------
;; Helpers

(define-private (caller-is (who principal))
  (and (is-eq tx-sender who) (is-eq contract-caller who)))

(define-private (is-admin) (caller-is (var-get admin)))

(define-private (bump)
  (begin (var-set version (+ (var-get version) u1)) (var-get version)))

(define-private (inscription-ok? (id uint) (hash (buff 32)) (size uint) (who principal))
  (and
    (is-eq (contract-call? .mock-xtrata-core inscription-exists id) (ok true)) ;; @principal core
    (is-eq (contract-call? .mock-xtrata-core is-inscription-sealed id) (some true)) ;; @principal core
    (is-eq (contract-call? .mock-xtrata-core get-inscription-hash id) (some hash)) ;; @principal core
    (is-eq (contract-call? .mock-xtrata-core get-inscription-size id) (some size)) ;; @principal core
    (is-eq (contract-call? .mock-xtrata-core get-inscription-creator id) (some who)) ;; @principal core
  ))

(define-private (usable-look? (id uint) (kind uint))
  (match (map-get? Looks id)
    l (and (is-eq (get kind l) kind) (not (get hidden l)) (get approved l))
    false))

(define-private (usable-layer? (layer { slot: uint, look: uint, params: (string-ascii 256), state: (string-ascii 24) }))
  (and (>= (get slot layer) u1) (<= (get slot layer) u4)
       (usable-look? (get look layer) (get slot layer))))

(define-private (all-layers-ok-step
  (layer { slot: uint, look: uint, params: (string-ascii 256), state: (string-ascii 24) })
  (ok-so-far bool))
  (and ok-so-far (usable-layer? layer)))

(define-private (slot-match?
  (layer { slot: uint, look: uint, params: (string-ascii 256), state: (string-ascii 24) }))
  (is-eq (get slot layer) (var-get scratch-slot)))

(define-private (slot-count
  (layers (list 8 { slot: uint, look: uint, params: (string-ascii 256), state: (string-ascii 24) }))
  (slot uint))
  (begin (var-set scratch-slot slot) (len (filter slot-match? layers))))

;; A room's owner (or admin) writes scenes.
(define-private (can-write-room? (owner principal))
  (or (is-admin) (caller-is owner)))

;; ---------------------------------------------------------------------------
;; Rooms

(define-public (register-room (id (string-ascii 24)) (title (string-ascii 48)) (owner principal) (bays uint))
  (begin
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (asserts! (and (> (len id) u0) (> (len title) u0)) ERR-INVALID)
    (asserts! (and (>= bays u1) (<= bays MAX-BAYS)) ERR-INVALID)
    (asserts! (is-none (map-get? Rooms id)) ERR-EXISTS)
    (map-set Rooms id { title: title, owner: owner, entry-id: none, bays: bays, hidden: false })
    (print { event: "room", id: id, owner: owner, bays: bays, version: (bump) })
    (ok true)))

(define-public (set-room-entry (id (string-ascii 24)) (entry-id (optional uint)))
  (let ((r (unwrap! (map-get? Rooms id) ERR-NOT-FOUND)))
    (asserts! (can-write-room? (get owner r)) ERR-NOT-AUTHORIZED)
    (asserts! (or (is-admin) (not (var-get paused))) ERR-PAUSED)
    (map-set Rooms id (merge r { entry-id: entry-id }))
    (print { event: "room-entry", id: id, entry-id: entry-id, version: (bump) })
    (ok true)))

(define-public (set-room-owner (id (string-ascii 24)) (owner principal))
  (let ((r (unwrap! (map-get? Rooms id) ERR-NOT-FOUND)))
    (asserts! (can-write-room? (get owner r)) ERR-NOT-AUTHORIZED)
    (asserts! (or (is-admin) (not (var-get paused))) ERR-PAUSED)
    (map-set Rooms id (merge r { owner: owner }))
    (print { event: "room-owner", id: id, owner: owner, version: (bump) })
    (ok true)))

(define-public (set-room-hidden (id (string-ascii 24)) (hidden bool))
  (let ((r (unwrap! (map-get? Rooms id) ERR-NOT-FOUND)))
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (map-set Rooms id (merge r { hidden: hidden }))
    (print { event: "room-hidden", id: id, hidden: hidden, version: (bump) })
    (ok true)))

;; ---------------------------------------------------------------------------
;; Looks

(define-public (register-look
  (kind uint) (name (string-ascii 32)) (tier uint) (builtin (string-ascii 24))
  (src-id uint) (src-hash (buff 32)) (src-size uint))
  (let ((id (var-get look-count)) (admin? (is-admin)))
    (asserts! (not (var-get paused)) ERR-PAUSED)
    (asserts! (or admin? (default-to false (map-get? Publishers tx-sender))) ERR-NOT-AUTHORIZED)
    (asserts! (<= kind u4) ERR-INVALID)
    (asserts! (<= tier u3) ERR-INVALID)
    (asserts! (> (len name) u0) ERR-INVALID)
    ;; built-ins (tier 0) and in-hall modules (tier 3) are admin only
    (asserts! (or admin? (and (>= tier u1) (<= tier u2))) ERR-NOT-AUTHORIZED)
    (if (is-eq tier u0)
      (asserts! (> (len builtin) u0) ERR-INVALID)
      (begin
        (asserts! (is-eq (len builtin) u0) ERR-INVALID)
        (asserts! (<= src-size (if (is-eq tier u1) MAX-RECIPE-BYTES MAX-MODULE-BYTES)) ERR-INSCRIPTION)
        (asserts! (inscription-ok? src-id src-hash src-size tx-sender) ERR-INSCRIPTION)))
    (map-set Looks id {
      kind: kind, name: name, tier: tier, builtin: builtin,
      src-id: src-id, src-hash: src-hash, src-size: src-size,
      set: (if admin? u0 u1), hidden: false,
      approved: (<= tier u1), owner: tx-sender, added-at: stacks-block-height })
    (var-set look-count (+ id u1))
    (print { event: "look", id: id, kind: kind, tier: tier, version: (bump) })
    (ok id)))

(define-public (set-look-hidden (id uint) (hidden bool))
  (let ((l (unwrap! (map-get? Looks id) ERR-NOT-FOUND)))
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (map-set Looks id (merge l { hidden: hidden }))
    (print { event: "look-hidden", id: id, hidden: hidden, version: (bump) })
    (ok true)))

(define-public (approve-look (id uint) (approved bool))
  (let ((l (unwrap! (map-get? Looks id) ERR-NOT-FOUND)))
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (map-set Looks id (merge l { approved: approved }))
    (print { event: "look-approved", id: id, approved: approved, version: (bump) })
    (ok true)))

;; ---------------------------------------------------------------------------
;; Scenes

(define-private (put-scene
  (s {
    room: (string-ascii 24), bay: uint, from-height: uint, base: uint,
    door-look: (optional uint),
    layers: (list 8 { slot: uint, look: uint, params: (string-ascii 256), state: (string-ascii 24) }),
    interaction: uint,
    link: (optional { target-room: (string-ascii 24), arrival-bay: uint, path: (string-ascii 64) })
  })
  (acc (response uint uint)))
  (match acc
    n
      (let (
        (room (get room s))
        (bay (get bay s))
        (r (unwrap! (map-get? Rooms room) ERR-NOT-FOUND))
        (key { room: room, bay: bay })
        (seq (default-to u0 (map-get? SeqCount key)))
        (layers (get layers s))
        (from (if (> (get from-height s) burn-block-height) (get from-height s) burn-block-height))
        (timeline (default-to (list) (map-get? Timeline key))))
        (asserts! (can-write-room? (get owner r)) ERR-NOT-AUTHORIZED)
        (asserts! (< bay (get bays r)) ERR-BAD-BAY)
        (asserts! (<= (get base s) u2) ERR-INVALID)
        (asserts! (<= (get interaction s) u3) ERR-INVALID)
        ;; base door needs a usable door look; other bases must not name one
        (match (get door-look s)
          dl (begin
               (asserts! (is-eq (get base s) u2) ERR-BAD-LOOK)
               (asserts! (usable-look? dl u0) ERR-BAD-LOOK)
               true)
          (begin (asserts! (not (is-eq (get base s) u2)) ERR-BAD-LOOK) true))
        ;; layers: slots 1..4, each look usable and of the matching kind;
        ;; cover, sound and light at most once, overlays may repeat
        (asserts! (fold all-layers-ok-step layers true) ERR-BAD-LOOK)
        (asserts! (and (<= (slot-count layers u1) u1)
                       (<= (slot-count layers u3) u1)
                       (<= (slot-count layers u4) u1)) ERR-LAYERS)
        ;; link rules
        (match (get link s)
          lk (begin
               (if (> (len (get target-room lk)) u0)
                 (match (map-get? Rooms (get target-room lk))
                   tr (begin
                        (asserts! (and (not (get hidden tr)) (< (get arrival-bay lk) (get bays tr))) ERR-BAD-LINK)
                        true)
                   (begin (asserts! false ERR-BAD-LINK) true))
                 (asserts! (and (is-eq (element-at? (get path lk) u0) (some "/"))
                                (not (is-eq (element-at? (get path lk) u1) (some "/")))
                                (not (is-eq (element-at? (get path lk) u1) (some "\\")))) ERR-BAD-LINK))
               true)
          (begin (asserts! (not (is-eq (get interaction s) u3)) ERR-BAD-LINK) true))
        (map-set Scenes { room: room, bay: bay, seq: seq } {
          from-height: from, retracted: false, base: (get base s),
          door-look: (get door-look s), layers: layers,
          interaction: (get interaction s), link: (get link s),
          author: tx-sender, added-at: stacks-block-height })
        (map-set SeqCount key (+ seq u1))
        (map-set Timeline key
          (unwrap! (as-max-len? (append timeline { seq: seq, from: from }) u48) ERR-TIMELINE-FULL))
        (print { event: "scene", room: room, bay: bay, seq: seq, from-height: from, base: (get base s), version: (bump) })
        (ok (+ n u1)))
    e (err e)))

(define-public (add-scene
  (s {
    room: (string-ascii 24), bay: uint, from-height: uint, base: uint,
    door-look: (optional uint),
    layers: (list 8 { slot: uint, look: uint, params: (string-ascii 256), state: (string-ascii 24) }),
    interaction: uint,
    link: (optional { target-room: (string-ascii 24), arrival-bay: uint, path: (string-ascii 64) })
  }))
  (begin
    (asserts! (or (is-admin) (not (var-get paused))) ERR-PAUSED)
    (try! (put-scene s (ok u0)))
    (ok (- (default-to u0 (map-get? SeqCount { room: (get room s), bay: (get bay s) })) u1))))

;; A whole scripted sequence in one transaction (all or nothing).
(define-public (add-scenes
  (ss (list 8 {
    room: (string-ascii 24), bay: uint, from-height: uint, base: uint,
    door-look: (optional uint),
    layers: (list 8 { slot: uint, look: uint, params: (string-ascii 256), state: (string-ascii 24) }),
    interaction: uint,
    link: (optional { target-room: (string-ascii 24), arrival-bay: uint, path: (string-ascii 64) })
  })))
  (begin
    (asserts! (or (is-admin) (not (var-get paused))) ERR-PAUSED)
    (fold put-scene ss (ok u0))))

(define-private (not-seq? (e { seq: uint, from: uint })) (not (is-eq (get seq e) (var-get scratch-seq))))

;; Retracting hides a scene from resolution. History stays readable. Works while paused,
;; because retract is an escape hatch.
(define-public (retract-scene (room (string-ascii 24)) (bay uint) (seq uint))
  (let (
    (r (unwrap! (map-get? Rooms room) ERR-NOT-FOUND))
    (key { room: room, bay: bay })
    (scene (unwrap! (map-get? Scenes { room: room, bay: bay, seq: seq }) ERR-NOT-FOUND)))
    (asserts! (can-write-room? (get owner r)) ERR-NOT-AUTHORIZED)
    (map-set Scenes { room: room, bay: bay, seq: seq } (merge scene { retracted: true }))
    (var-set scratch-seq seq)
    (map-set Timeline key (filter not-seq? (default-to (list) (map-get? Timeline key))))
    (print { event: "scene-retracted", room: room, bay: bay, seq: seq, version: (bump) })
    (ok true)))

;; Frees timeline space: keeps the currently active scene and everything still to come.
(define-private (keep-scene? (e { seq: uint, from: uint }))
  (or (is-eq (get seq e) (var-get scratch-seq)) (> (get from e) (var-get scratch-now))))

(define-public (compact-bay (room (string-ascii 24)) (bay uint))
  (let (
    (r (unwrap! (map-get? Rooms room) ERR-NOT-FOUND))
    (key { room: room, bay: bay })
    (view (resolve room bay)))
    (asserts! (can-write-room? (get owner r)) ERR-NOT-AUTHORIZED)
    (var-set scratch-now burn-block-height)
    (var-set scratch-seq (get active-seq view))
    (map-set Timeline key (filter keep-scene? (default-to (list) (map-get? Timeline key))))
    (print { event: "bay-compacted", room: room, bay: bay, version: (bump) })
    (ok true)))

;; ---------------------------------------------------------------------------
;; Resolution: which scene is showing now

(define-private (resolve-step
  (e { seq: uint, from: uint })
  (ctx { now: uint, found: bool, active-seq: uint, active-height: uint,
         next-found: bool, next-height: uint }))
  ;; Retracted scenes are removed from the timeline, so every entry here counts.
  (if (<= (get from e) (get now ctx))
    (if (or (not (get found ctx)) (>= (get from e) (get active-height ctx)))
      (merge ctx { found: true, active-seq: (get seq e), active-height: (get from e) })
      ctx)
    (if (or (not (get next-found ctx)) (< (get from e) (get next-height ctx)))
      (merge ctx { next-found: true, next-height: (get from e) })
      ctx)))

(define-private (resolve (room (string-ascii 24)) (bay uint))
  (fold resolve-step
    (default-to (list) (map-get? Timeline { room: room, bay: bay }))
    { now: burn-block-height,
      found: false, active-seq: u0, active-height: u0,
      next-found: false, next-height: u0 }))

;; ---------------------------------------------------------------------------
;; Roles, pause, hand-over, successor

(define-public (set-publisher (who principal) (allowed bool))
  (begin
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (map-set Publishers who allowed)
    (print { event: "publisher", who: who, allowed: allowed, version: (bump) })
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
(define-read-only (get-room (id (string-ascii 24))) (map-get? Rooms id))
(define-read-only (get-look (id uint)) (map-get? Looks id))
(define-read-only (get-looks (ids (list 20 uint))) (map get-look ids))
(define-read-only (get-look-count) (var-get look-count))
(define-read-only (get-scene-count (room (string-ascii 24)) (bay uint))
  (default-to u0 (map-get? SeqCount { room: room, bay: bay })))
(define-read-only (get-scene (room (string-ascii 24)) (bay uint) (seq uint))
  (map-get? Scenes { room: room, bay: bay, seq: seq }))
(define-read-only (get-timeline (room (string-ascii 24)) (bay uint))
  (default-to (list) (map-get? Timeline { room: room, bay: bay })))
(define-read-only (get-height) burn-block-height)

;; The bay as the hall needs it: the scene showing now (none = show the default,
;; posters) and the height of the next scheduled change, so the hall can animate it.
(define-read-only (get-bay (room (string-ascii 24)) (bay uint))
  (match (map-get? Rooms room)
    r
      (if (< bay (get bays r))
        (let ((v (resolve room bay)))
          (some {
            active-seq: (if (get found v) (some (get active-seq v)) none),
            active: (if (get found v)
                      (map-get? Scenes { room: room, bay: bay, seq: (get active-seq v) })
                      none),
            next-height: (if (get next-found v) (some (get next-height v)) none),
            height: burn-block-height }))
        none)
    none))

(define-read-only (get-bays (room (string-ascii 24)))
  (list (get-bay room u0) (get-bay room u1) (get-bay room u2) (get-bay room u3)
        (get-bay room u4) (get-bay room u5) (get-bay room u6) (get-bay room u7)))

(define-read-only (get-successor) { successor: (var-get successor), locked: (var-get successor-locked) })
(define-read-only (is-publisher (who principal)) (default-to false (map-get? Publishers who)))
(define-read-only (get-config)
  { admin: (var-get admin), pending-admin: (var-get pending-admin), paused: (var-get paused) })
