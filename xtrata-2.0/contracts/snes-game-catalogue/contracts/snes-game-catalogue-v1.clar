;; snes-game-catalogue-v1
;; A registry of SNES games whose ROMs are inscribed on Xtrata. It stores hashes and pointers,
;; never ROM bytes. The Arcade wrapper reads it, fetches the ROM from the Xtrata core, verifies the
;; SHA-256, and hands the bytes to the emulator. The emulator never reads the chain.
;;
;; DRAFT. Not deployed. Tested in Clarinet simnet only.

;; ---------------------------------------------------------------- traits
;; The catalogue checks a ROM inscription through a tiny per-core adapter, because the live Xtrata core's
;; read-only functions return optionals and so cannot satisfy a trait directly. The adapter wraps one
;; Xtrata core (a literal contract-call inside it). A new Xtrata core means one new 15-line adapter
;; and one set-reader call; the catalogue itself never changes.
(define-trait inscription-check-trait
  ((core () (response principal uint))
   ;; ok true only if inscription `ins` exists, is sealed, is exactly `size` bytes, and was created by `creator`
   (check (uint uint principal) (response bool uint))))

;; A token-gate adapter: one function, written per asset (pass NFT, SIP-010 balance, Xtrata holding).
(define-trait publisher-gate-trait
  ((can-publish (principal) (response bool uint))))

;; ---------------------------------------------------------------- constants
(define-constant SET-CORE u0)
(define-constant SET-COMMUNITY u1)

(define-constant ERR-NOT-ADMIN (err u100))
(define-constant ERR-NOT-PUBLISHER (err u101))
(define-constant ERR-NOT-OWNER (err u102))
(define-constant ERR-NOT-FOUND (err u103))
(define-constant ERR-SLUG-TAKEN (err u104))
(define-constant ERR-HASH-TAKEN (err u105))
(define-constant ERR-BAD-INPUT (err u106))
(define-constant ERR-CORE-NOT-ALLOWED (err u107))
(define-constant ERR-REVOKED (err u112))
(define-constant ERR-NOT-PENDING (err u113))

;; ---------------------------------------------------------------- state
(define-data-var admin principal tx-sender)
(define-data-var pending-admin (optional principal) none)
(define-data-var game-count uint u0)
(define-data-var gate (optional principal) none)

(define-map publishers principal { active: bool, label: (string-ascii 32), added-at: uint })
(define-map readers principal bool)   ;; adapter contracts the catalogue accepts, one per Xtrata core

(define-map games uint
  { slug: (string-ascii 32),
    title: (string-ascii 48),
    owner: principal,
    set: uint,
    hidden: bool,
    latest: uint,                         ;; 0 = no version yet
    versions: uint,
    payout: principal,
    licence: (string-ascii 16),           ;; free | pass | paid | private (informational)
    cover: (optional { core: principal, id: uint }),   ;; 512x384, see the artwork standard
    icon: (optional { core: principal, id: uint }) })  ;; 256x256

(define-map versions { id: uint, ver: uint }
  { rom-sha256: (buff 32),                ;; canonical hash: strip 512 B copier header iff size % 1024 == 512
    size: uint,                           ;; ROM bytes, equal to the inscription's total size
    core: principal,                      ;; Xtrata core holding the ROM inscription
    ins: uint,                            ;; inscription id in that core
    core-min: uint,                       ;; lowest emulator core: major*10000 + minor*100 + patch (1.0.0 = 10000)
    profile: (string-ascii 16),           ;; scoring profile name, e.g. "xsh1-v1", "" if none
    board: (optional (string-ascii 24)),  ;; board id in the scores contract, if registered
    note: (string-ascii 96),
    added-at: uint,
    revoked: bool })

(define-map by-hash (buff 32) { id: uint, ver: uint })
(define-map by-slug (string-ascii 32) uint)

;; ---------------------------------------------------------------- helpers
(define-private (is-admin) (is-eq tx-sender (var-get admin)))

(define-private (active-publisher (who principal))
  (match (map-get? publishers who) p (get active p) false))

(define-private (gate-passes (g (optional <publisher-gate-trait>)))
  (match g adapter
    (and (is-eq (some (contract-of adapter)) (var-get gate))
         (is-eq (contract-call? adapter can-publish tx-sender) (ok true)))
    false))

(define-private (can-act (game { owner: principal }))
  ;; owner (while still an active publisher) or admin
  (or (is-admin)
      (and (is-eq tx-sender (get owner game)) (active-publisher tx-sender))))

;; ---------------------------------------------------------------- admin
(define-public (set-publisher (who principal) (active bool) (label (string-ascii 32)))
  (begin
    (asserts! (is-admin) ERR-NOT-ADMIN)
    (map-set publishers who { active: active, label: label, added-at: stacks-block-height })
    (print { event: "publisher", who: who, active: active, label: label })
    (ok true)))

(define-public (set-gate (adapter (optional principal)))
  (begin
    (asserts! (is-admin) ERR-NOT-ADMIN)
    (var-set gate adapter)
    (print { event: "gate", adapter: adapter })
    (ok true)))

(define-public (set-reader (adapter principal) (allowed bool))
  (begin
    (asserts! (is-admin) ERR-NOT-ADMIN)
    (map-set readers adapter allowed)
    (print { event: "reader", adapter: adapter, allowed: allowed })
    (ok true)))

(define-public (set-set (id uint) (set uint))
  (let ((g (unwrap! (map-get? games id) ERR-NOT-FOUND)))
    (asserts! (is-admin) ERR-NOT-ADMIN)
    (asserts! (or (is-eq set SET-CORE) (is-eq set SET-COMMUNITY)) ERR-BAD-INPUT)
    (map-set games id (merge g { set: set }))
    (print { event: "set", id: id, set: set })
    (ok true)))

;; Admin remedy for a bad or squatted entry. The row stays (history), the hash is freed.
(define-public (revoke-version (id uint) (ver uint))
  (let ((v (unwrap! (map-get? versions { id: id, ver: ver }) ERR-NOT-FOUND)))
    (asserts! (is-admin) ERR-NOT-ADMIN)
    (map-set versions { id: id, ver: ver } (merge v { revoked: true }))
    (if (is-eq (map-get? by-hash (get rom-sha256 v)) (some { id: id, ver: ver }))
      (map-delete by-hash (get rom-sha256 v))
      true)
    (print { event: "revoke", id: id, ver: ver })
    (ok true)))

(define-public (propose-admin (new principal))
  (begin
    (asserts! (is-admin) ERR-NOT-ADMIN)
    (var-set pending-admin (some new))
    (ok true)))

(define-public (accept-admin)
  (let ((p (unwrap! (var-get pending-admin) ERR-NOT-PENDING)))
    (asserts! (is-eq tx-sender p) ERR-NOT-PENDING)
    (var-set admin p)
    (var-set pending-admin none)
    (print { event: "admin", admin: p })
    (ok true)))

;; ---------------------------------------------------------------- publisher
;; Whitelisted publishers add directly. Anyone passing the token gate is enrolled on the spot
;; (label "gate"), so later calls need no gate again. Selling the pass later does not undo this;
;; the admin can still revoke with set-publisher.
;; A game added by the admin goes straight into the core set; everyone else's starts in the community set
;; (the admin can move it with set-set).
(define-public (add-game (slug (string-ascii 32)) (title (string-ascii 48))
                         (cover (optional { core: principal, id: uint }))
                         (icon (optional { core: principal, id: uint }))
                         (gate-adapter (optional <publisher-gate-trait>)))
  (let ((id (+ (var-get game-count) u1)))
    (if (active-publisher tx-sender)
      true
      (if (gate-passes gate-adapter)
        (map-set publishers tx-sender { active: true, label: "gate", added-at: stacks-block-height })
        false))
    (asserts! (active-publisher tx-sender) ERR-NOT-PUBLISHER)
    (asserts! (and (> (len slug) u0) (> (len title) u0)) ERR-BAD-INPUT)
    (asserts! (map-insert by-slug slug id) ERR-SLUG-TAKEN)
    (map-set games id
      { slug: slug, title: title, owner: tx-sender, set: (if (is-admin) SET-CORE SET-COMMUNITY), hidden: false,
        latest: u0, versions: u0, payout: tx-sender, licence: "free", cover: cover, icon: icon })
    (var-set game-count id)
    (print { event: "add-game", id: id, slug: slug, title: title, owner: tx-sender })
    (ok id)))

;; Registers one ROM version. The catalogue checks, through the adapter, that the inscription
;; exists, is sealed (immutable), is exactly `size` bytes, and was created by the game's owner.
;; It cannot check the SHA-256 (the wrapper and the emulator do), so a wrong hash makes a ROM that
;; nobody can load, and a squatted hash can be freed by the admin with revoke-version.
(define-public (add-version (id uint) (adapter <inscription-check-trait>)
                            (rom-sha256 (buff 32)) (size uint) (ins uint)
                            (core-min uint) (profile (string-ascii 16))
                            (board (optional (string-ascii 24))) (note (string-ascii 96))
                            (make-latest bool))
  (let ((g (unwrap! (map-get? games id) ERR-NOT-FOUND))
        (ver (+ (get versions (unwrap! (map-get? games id) ERR-NOT-FOUND)) u1))
        (core (try! (contract-call? adapter core))))
    (asserts! (can-act { owner: (get owner g) }) ERR-NOT-OWNER)
    (asserts! (default-to false (map-get? readers (contract-of adapter))) ERR-CORE-NOT-ALLOWED)
    (asserts! (and (> size u0) (> core-min u0)) ERR-BAD-INPUT)
    (try! (contract-call? adapter check ins size (get owner g)))
    (asserts! (map-insert by-hash rom-sha256 { id: id, ver: ver }) ERR-HASH-TAKEN)
    (map-set versions { id: id, ver: ver }
      { rom-sha256: rom-sha256, size: size, core: core, ins: ins, core-min: core-min,
        profile: profile, board: board, note: note, added-at: stacks-block-height, revoked: false })
    (map-set games id
      (merge g { versions: ver, latest: (if (or make-latest (is-eq (get latest g) u0)) ver (get latest g)) }))
    (print { event: "add-version", id: id, ver: ver, sha256: rom-sha256, core: core, ins: ins })
    (ok ver)))

(define-public (set-latest (id uint) (ver uint))
  (let ((g (unwrap! (map-get? games id) ERR-NOT-FOUND))
        (v (unwrap! (map-get? versions { id: id, ver: ver }) ERR-NOT-FOUND)))
    (asserts! (can-act { owner: (get owner g) }) ERR-NOT-OWNER)
    (asserts! (not (get revoked v)) ERR-REVOKED)
    (map-set games id (merge g { latest: ver }))
    (print { event: "set-latest", id: id, ver: ver })
    (ok true)))

(define-public (set-art (id uint) (cover (optional { core: principal, id: uint })) (icon (optional { core: principal, id: uint })))
  (let ((g (unwrap! (map-get? games id) ERR-NOT-FOUND)))
    (asserts! (can-act { owner: (get owner g) }) ERR-NOT-OWNER)
    (map-set games id (merge g { cover: cover, icon: icon }))
    (print { event: "set-art", id: id })
    (ok true)))

(define-public (set-hidden (id uint) (hidden bool))
  (let ((g (unwrap! (map-get? games id) ERR-NOT-FOUND)))
    (asserts! (can-act { owner: (get owner g) }) ERR-NOT-OWNER)
    (map-set games id (merge g { hidden: hidden }))
    (print { event: "set-hidden", id: id, hidden: hidden })
    (ok true)))

(define-public (set-payout (id uint) (payout principal))
  (let ((g (unwrap! (map-get? games id) ERR-NOT-FOUND)))
    (asserts! (can-act { owner: (get owner g) }) ERR-NOT-OWNER)
    (map-set games id (merge g { payout: payout }))
    (ok true)))

(define-public (set-licence (id uint) (licence (string-ascii 16)))
  (let ((g (unwrap! (map-get? games id) ERR-NOT-FOUND)))
    (asserts! (can-act { owner: (get owner g) }) ERR-NOT-OWNER)
    (map-set games id (merge g { licence: licence }))
    (ok true)))

(define-public (transfer-game (id uint) (new-owner principal))
  (let ((g (unwrap! (map-get? games id) ERR-NOT-FOUND)))
    (asserts! (can-act { owner: (get owner g) }) ERR-NOT-OWNER)
    (asserts! (active-publisher new-owner) ERR-NOT-PUBLISHER)
    (map-set games id (merge g { owner: new-owner, payout: new-owner }))
    (print { event: "transfer-game", id: id, owner: new-owner })
    (ok true)))

;; ---------------------------------------------------------------- reads
(define-read-only (get-count) (var-get game-count))
(define-read-only (get-admin) (var-get admin))
(define-read-only (get-pending-admin) (var-get pending-admin))
(define-read-only (get-gate) (var-get gate))
(define-read-only (is-publisher (who principal)) (active-publisher who))
(define-read-only (is-reader (adapter principal)) (default-to false (map-get? readers adapter)))
(define-read-only (get-game (id uint)) (map-get? games id))
(define-read-only (get-version (id uint) (ver uint)) (map-get? versions { id: id, ver: ver }))
(define-read-only (get-by-hash (h (buff 32))) (map-get? by-hash h))
(define-read-only (get-by-slug (slug (string-ascii 32))) (map-get? by-slug slug))

;; One call per menu card: the game plus the version the menu would load.
(define-read-only (get-card (id uint))
  (match (map-get? games id)
    g (some { id: id, game: g, version: (map-get? versions { id: id, ver: (get latest g) }) })
    none))

;; Ten cards per read, so the wrapper builds the whole menu in a few calls.
(define-read-only (get-page (start uint))
  (list (get-card start) (get-card (+ start u1)) (get-card (+ start u2)) (get-card (+ start u3)) (get-card (+ start u4))
        (get-card (+ start u5)) (get-card (+ start u6)) (get-card (+ start u7)) (get-card (+ start u8)) (get-card (+ start u9))))
