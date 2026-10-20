;; xtrata-door-skins-v1
;;
;; Skin registry for the doors of the Xtrata Arcade and the rooms that follow it. Room-agnostic.
;;
;; A SKIN is a finish for a door: what the leaf, the frame and the hardware are made of
;; (oak, brushed steel, stained glass, ...). Door SHAPES (rect, arch, gothic, ...) are the
;; hall's door styles and live in the world contract's looks; a scene picks a shape with its
;; door look and a finish with the built-in `door-skin` overlay look, whose params name a
;; skin key, for example {"skin":"oak","frame":"stone","hardware":"brass","wear":30}.
;; The hall reads this contract to learn which skin keys exist, which door styles each one
;; may wear, and what its defaults are. The world contract never calls this one, so a skin
;; can be added at any time without touching rooms, bays or scenes.
;;
;; - A skin has a unique KEY (lowercase letters, digits and hyphens). Keys are never reused,
;;   not even by hidden skins, so a scene written today means the same thing forever.
;; - Tiers: 0 BUILT-IN, drawn by code in a hall release (admin only; `builtin` names the
;;   hall's recipe). 1 DATA RECIPE, an inscription holding a small JSON recipe (noise layers
;;   and colours; no code) that the hall validates, clamps and renders with its own
;;   texture kit. Tier 1 is how skins are added after a hall is inscribed.
;; - Publishers (whitelist) register tier 1 skins within a per-publisher cap. While the
;;   review lane is on (the default), a publisher's skin is not usable until admin
;;   approves it. Admin skins are approved at once.
;; - Append-only. Hidden is the only way to take a skin down; history stays readable.
;;   Admin may change which door styles a skin may wear (a pairing, not the content).
;; - STYLES is a bit mask over the hall's door styles in their fixed, append-only order
;;   (bit 0 rect, 1 tall, 2 wide, 3 arch, 4 gothic, 5 double, 6 cathedral, 7 circle,
;;   8 oval, 9 hexagon, 10 octagon, 11 industrial, 12 vintage, 13 scifi; later styles
;;   take the next bits). Bits for styles the hall does not know are ignored.
;; - Successor pointer with a one-way lock; the read interface is frozen at v1.
;;
;; Family values: 0 wood, 1 painted, 2 metal, 3 glass and stone, 4 futuristic, 5 other
;; Sound values:  0 wood, 1 metal, 2 tech, 3 glass
;; Set values:    0 core, 1 community
;; Frame, hardware and wear are defaults the hall validates (wear is 0 to 100); the
;; contract only bounds their length.

(define-constant ERR-NOT-AUTHORIZED (err u300))
(define-constant ERR-PAUSED         (err u301))
(define-constant ERR-NOT-FOUND      (err u302))
(define-constant ERR-INVALID        (err u303))
(define-constant ERR-EXISTS         (err u304))
(define-constant ERR-INSCRIPTION    (err u305))
(define-constant ERR-NO-PENDING     (err u306))
(define-constant ERR-LOCKED         (err u307))
(define-constant ERR-CAP            (err u308))
(define-constant ERR-FULL           (err u309))

(define-constant MAX-SKINS u512)
(define-constant MAX-RECIPE-BYTES u8192)
(define-constant MAX-STYLE-MASK u4294967295)
(define-constant MAX-PUBLISHER-CAP u64)
(define-constant KEY-CHARS "abcdefghijklmnopqrstuvwxyz0123456789-")

(define-data-var admin principal tx-sender)
(define-data-var pending-admin (optional principal) none)
(define-data-var paused bool false)
(define-data-var version uint u0)
(define-data-var skin-count uint u0)
(define-data-var review-lane bool true)
(define-data-var cap-per-publisher uint u24)
(define-data-var successor (optional principal) none)
(define-data-var successor-locked bool false)

(define-map Publishers principal bool)
(define-map PublisherSkins principal uint)
(define-map SkinKeys (string-ascii 24) uint)

(define-map Skins uint
  {
    key: (string-ascii 24), name: (string-ascii 32), family: uint, tier: uint,
    builtin: (string-ascii 24),
    src-id: uint, src-hash: (buff 32), src-size: uint,
    styles: uint, sound: uint, frame: (string-ascii 16), hardware: (string-ascii 16), wear: uint,
    set: uint, hidden: bool, approved: bool, owner: principal, added-at: uint
  })

;; ---------------------------------------------------------------------------
;; Helpers

(define-private (caller-is (who principal))
  (and (is-eq tx-sender who) (is-eq contract-caller who)))

(define-private (is-admin) (caller-is (var-get admin)))

(define-private (bump)
  (begin (var-set version (+ (var-get version) u1)) (var-get version)))

(define-private (inscription-ok? (id uint) (hash (buff 32)) (size uint) (who principal))
  (and
    (is-eq (contract-call? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3 inscription-exists id) (ok true)) ;; @principal core
    (is-eq (contract-call? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3 is-inscription-sealed id) (some true)) ;; @principal core
    (is-eq (contract-call? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3 get-inscription-hash id) (some hash)) ;; @principal core
    (is-eq (contract-call? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3 get-inscription-size id) (some size)) ;; @principal core
    (is-eq (contract-call? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3 get-inscription-creator id) (some who)) ;; @principal core
  ))

(define-private (key-char-ok? (c (string-ascii 1)) (ok-so-far bool))
  (and ok-so-far (is-some (index-of? KEY-CHARS c))))

;; 2 to 24 characters of a-z, 0-9 and "-", not starting or ending with "-".
(define-private (valid-key? (key (string-ascii 24)))
  (and (>= (len key) u2)
       (fold key-char-ok? key true)
       (not (is-eq (element-at? key u0) (some "-")))
       (not (is-eq (element-at? key (- (len key) u1)) (some "-")))))

;; ---------------------------------------------------------------------------
;; Skins

(define-public (register-skin
  (key (string-ascii 24)) (name (string-ascii 32)) (family uint) (tier uint)
  (builtin (string-ascii 24)) (src-id uint) (src-hash (buff 32)) (src-size uint)
  (styles uint) (sound uint) (frame (string-ascii 16)) (hardware (string-ascii 16)) (wear uint))
  (let (
    (id (var-get skin-count))
    (admin? (is-admin))
    (publisher? (default-to false (map-get? Publishers tx-sender)))
    (made (default-to u0 (map-get? PublisherSkins tx-sender))))
    (asserts! (not (var-get paused)) ERR-PAUSED)
    (asserts! (or admin? publisher?) ERR-NOT-AUTHORIZED)
    ;; built-ins are code in a hall release, so only admin can name one
    (asserts! (or admin? (is-eq tier u1)) ERR-NOT-AUTHORIZED)
    (asserts! (<= tier u1) ERR-INVALID)
    (asserts! (< id MAX-SKINS) ERR-FULL)
    (asserts! (valid-key? key) ERR-INVALID)
    (asserts! (> (len name) u0) ERR-INVALID)
    (asserts! (<= family u5) ERR-INVALID)
    (asserts! (<= sound u3) ERR-INVALID)
    (asserts! (<= wear u100) ERR-INVALID)
    (asserts! (and (> styles u0) (<= styles MAX-STYLE-MASK)) ERR-INVALID)
    (asserts! (is-none (map-get? SkinKeys key)) ERR-EXISTS)
    (if (is-eq tier u0)
      (asserts! (> (len builtin) u0) ERR-INVALID)
      (begin
        (asserts! (is-eq (len builtin) u0) ERR-INVALID)
        (asserts! (and (> src-size u0) (<= src-size MAX-RECIPE-BYTES)) ERR-INSCRIPTION)
        (asserts! (inscription-ok? src-id src-hash src-size tx-sender) ERR-INSCRIPTION)))
    (if admin?
      true
      (asserts! (< made (var-get cap-per-publisher)) ERR-CAP))
    (map-set Skins id {
      key: key, name: name, family: family, tier: tier, builtin: builtin,
      src-id: src-id, src-hash: src-hash, src-size: src-size,
      styles: styles, sound: sound, frame: frame, hardware: hardware, wear: wear,
      set: (if admin? u0 u1), hidden: false,
      approved: (or admin? (not (var-get review-lane))),
      owner: tx-sender, added-at: stacks-block-height })
    (map-set SkinKeys key id)
    (if admin? true (map-set PublisherSkins tx-sender (+ made u1)))
    (var-set skin-count (+ id u1))
    (print { event: "skin", id: id, key: key, tier: tier, set: (if admin? u0 u1), version: (bump) })
    (ok id)))

(define-public (set-skin-hidden (id uint) (hidden bool))
  (let ((s (unwrap! (map-get? Skins id) ERR-NOT-FOUND)))
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (map-set Skins id (merge s { hidden: hidden }))
    (print { event: "skin-hidden", id: id, hidden: hidden, version: (bump) })
    (ok true)))

(define-public (approve-skin (id uint) (approved bool))
  (let ((s (unwrap! (map-get? Skins id) ERR-NOT-FOUND)))
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (map-set Skins id (merge s { approved: approved }))
    (print { event: "skin-approved", id: id, approved: approved, version: (bump) })
    (ok true)))

;; Which door styles may wear this skin. A pairing, not the skin's content, so admin may change it.
(define-public (set-skin-styles (id uint) (styles uint))
  (let ((s (unwrap! (map-get? Skins id) ERR-NOT-FOUND)))
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (asserts! (and (> styles u0) (<= styles MAX-STYLE-MASK)) ERR-INVALID)
    (map-set Skins id (merge s { styles: styles }))
    (print { event: "skin-styles", id: id, styles: styles, version: (bump) })
    (ok true)))

;; ---------------------------------------------------------------------------
;; Roles, limits, pause, hand-over, successor

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

(define-public (set-cap-per-publisher (n uint))
  (begin
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (asserts! (<= n MAX-PUBLISHER-CAP) ERR-INVALID)
    (var-set cap-per-publisher n)
    (print { event: "cap", n: n, version: (bump) })
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
(define-read-only (get-skin-count) (var-get skin-count))
(define-read-only (get-skin (id uint)) (map-get? Skins id))
(define-read-only (get-skins (ids (list 20 uint))) (map get-skin ids))
(define-read-only (get-skin-id (key (string-ascii 24))) (map-get? SkinKeys key))
;; A skin by its key, with its id, the way the hall asks for it.
(define-read-only (get-skin-by-key (key (string-ascii 24)))
  (match (map-get? SkinKeys key)
    id (match (map-get? Skins id)
         s (some (merge s { id: id }))
         none)
    none))
(define-read-only (get-publisher-skins (who principal)) (default-to u0 (map-get? PublisherSkins who)))
(define-read-only (is-publisher (who principal)) (default-to false (map-get? Publishers who)))
(define-read-only (get-successor) { successor: (var-get successor), locked: (var-get successor-locked) })
(define-read-only (get-limits)
  { review-lane: (var-get review-lane), cap-per-publisher: (var-get cap-per-publisher), max-skins: MAX-SKINS, max-recipe-bytes: MAX-RECIPE-BYTES })
(define-read-only (get-config)
  { admin: (var-get admin), pending-admin: (var-get pending-admin), paused: (var-get paused) })
