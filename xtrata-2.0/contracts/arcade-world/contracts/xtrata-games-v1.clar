;; xtrata-games-v1
;;
;; The Arcade's list of EXTRA games. The hall that is inscribed on Stacks never changes; it reads this
;; contract when it starts and adds one cabinet for every live game it finds here, so the room grows by
;; itself. The 21 games built into the hall are NOT in this contract and nothing here can touch, replace,
;; hide or re-number them.
;;
;; - A game is a sealed Xtrata inscription (id + hash + size) holding one cartridge script. The hall
;;   fetches it, checks the hash, and registers it exactly like a built-in game.
;; - Replay number: game number n (0, 1, 2 ...) gets replay index 21 + n for ever. The index is the byte the
;;   score replay carries and the seed is built from it, so it is permanent: never reused, never changed.
;;   Indices 0 to 20 belong to the built-in games. The most added games are MAX-ADDED, so an index always
;;   fits the replay header's single byte.
;; - Records are never edited and there is no delete. A game with a bug is not patched (that would change
;;   what old replays mean): the fix is a new game with a new id and its own score board. In an emergency
;;   the admin can HIDE a game (the hall stops loading it; its boards and replays stay on chain).
;; - Delay: a new game goes live only `delay` burn blocks after it is added (default 144, about a day). That
;;   is the window to notice a bad add and hide it. The delay can be tuned until the admin calls
;;   `lock-delay` (one-way), which the launch procedure does straight after deployment.
;; - The score board for a game is created separately on the scores contract by its owner. Do that first;
;;   the delay gives time for it.
;; - Ids: 3 to 24 characters of a-z, 0-9 and _, and never one of the built-in ids.
;; - Kind: 1 = a cartridge script that calls XA.registerGame. Other kinds are reserved: the hall ignores a
;;   kind it does not know. `engine-min` is the lowest replay engine version the game needs; the hall skips
;;   a game that needs a newer engine than it has.
;; - Roles: admin only (two-step hand-over), pause (blocks adding), successor pointer with a one-way lock.
;; - Reads are frozen at v1: add new reads as new functions, never change these.

(define-constant ERR-NOT-AUTHORIZED (err u500))
(define-constant ERR-PAUSED         (err u501))
(define-constant ERR-NOT-FOUND      (err u502))
(define-constant ERR-INVALID        (err u503))
(define-constant ERR-INSCRIPTION    (err u504))
(define-constant ERR-FULL           (err u505))
(define-constant ERR-TAKEN          (err u506))
(define-constant ERR-BUILT-IN       (err u507))
(define-constant ERR-LOCKED         (err u508))
(define-constant ERR-NO-PENDING     (err u509))

(define-constant GENESIS-COUNT u21)
(define-constant MAX-ADDED u64)
(define-constant MAX-CODE-BYTES u1048576)
(define-constant MAX-DELAY u1008)
(define-constant ID-CHARS "abcdefghijklmnopqrstuvwxyz0123456789_")

;; The ids of the built-in games, in replay-index order is NOT assumed here: this is only the list of names
;; that can never be registered again.
(define-constant BUILT-IN (list
  "xa_block_defence" "xa_block_drop" "xa_block_runner" "xa_brick_breaker" "xa_bubble_pop" "xa_cave_diver"
  "xa_helix_drop" "xa_invader_wave" "xa_lunar_lander" "xa_maze_muncher" "xa_merge_2048" "xa_mine_sprint"
  "xa_neon_snake" "xa_orbit_merge" "xa_pong_streak" "xa_reflex_tap" "xa_road_hopper" "xa_rock_drift"
  "xa_stack_tower" "xa_swerve" "xa_tile_tap"))

(define-data-var admin principal tx-sender)
(define-data-var pending-admin (optional principal) none)
(define-data-var paused bool false)
(define-data-var version uint u0)
(define-data-var count uint u0)
(define-data-var delay uint u144)
(define-data-var delay-locked bool false)
(define-data-var successor (optional principal) none)
(define-data-var successor-locked bool false)

(define-map Games uint
  {
    id: (string-ascii 24),
    title: (string-ascii 32),
    index: uint,
    kind: uint,
    engine-min: uint,
    code-id: uint,
    code-hash: (buff 32),
    code-size: uint,
    added-at: uint,
    live-at: uint,
    hidden: bool
  })

(define-map ById (string-ascii 24) uint)

;; ---------------------------------------------------------------------------
;; Helpers

(define-private (caller-is (who principal))
  (and (is-eq tx-sender who) (is-eq contract-caller who)))

(define-private (is-admin) (caller-is (var-get admin)))

(define-private (bump)
  (begin (var-set version (+ (var-get version) u1)) (var-get version)))

(define-private (note (event (string-ascii 24)) (n uint))
  (print { event: event, n: n, version: (bump) }))

(define-private (inscription-ok? (id uint) (hash (buff 32)) (size uint) (who principal))
  (and
    (is-eq (contract-call? .mock-xtrata-core inscription-exists id) (ok true)) ;; @principal core
    (is-eq (contract-call? .mock-xtrata-core is-inscription-sealed id) (some true)) ;; @principal core
    (is-eq (contract-call? .mock-xtrata-core get-inscription-hash id) (some hash)) ;; @principal core
    (is-eq (contract-call? .mock-xtrata-core get-inscription-size id) (some size)) ;; @principal core
    (is-eq (contract-call? .mock-xtrata-core get-inscription-creator id) (some who)) ;; @principal core
  ))

(define-private (char-ok? (c (string-ascii 1)) (acc bool))
  (and acc (is-some (index-of? ID-CHARS c))))

(define-private (id-valid? (id (string-ascii 24)))
  (and (>= (len id) u3) (fold char-ok? id true)))

;; scratch value for the fold below (always set just before use)
(define-data-var scratch-id (string-ascii 24) "")

(define-private (same-id? (built-in-id (string-ascii 16)) (found bool))
  (or found (is-eq (var-get scratch-id) built-in-id)))

(define-private (built-in? (id (string-ascii 24)))
  (begin (var-set scratch-id id) (fold same-id? BUILT-IN false)))

;; ---------------------------------------------------------------------------
;; Add

;; Adds a game. The inscription must be sealed, of the stated size and hash, and made by the admin.
;; It goes live `delay` blocks from now. Returns the game number n; its replay index is 21 + n.
(define-public (add-game
  (id (string-ascii 24)) (title (string-ascii 32))
  (code-id uint) (code-hash (buff 32)) (code-size uint)
  (kind uint) (engine-min uint))
  (let ((n (var-get count)))
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (asserts! (not (var-get paused)) ERR-PAUSED)
    (asserts! (< n MAX-ADDED) ERR-FULL)
    (asserts! (id-valid? id) ERR-INVALID)
    (asserts! (> (len title) u0) ERR-INVALID)
    (asserts! (not (built-in? id)) ERR-BUILT-IN)
    (asserts! (is-none (map-get? ById id)) ERR-TAKEN)
    (asserts! (<= kind u9) ERR-INVALID)
    (asserts! (and (>= engine-min u1) (<= engine-min u255)) ERR-INVALID)
    (asserts! (and (> code-size u0) (<= code-size MAX-CODE-BYTES)) ERR-INVALID)
    (asserts! (is-eq (len code-hash) u32) ERR-INVALID)
    (asserts! (inscription-ok? code-id code-hash code-size tx-sender) ERR-INSCRIPTION)
    (map-set Games n
      { id: id, title: title, index: (+ GENESIS-COUNT n), kind: kind, engine-min: engine-min,
        code-id: code-id, code-hash: code-hash, code-size: code-size,
        added-at: burn-block-height, live-at: (+ burn-block-height (var-get delay)), hidden: false })
    (map-set ById id n)
    (var-set count (+ n u1))
    (print { event: "game-added", n: n, index: (+ GENESIS-COUNT n), id: id, live-at: (+ burn-block-height (var-get delay)),
             version: (bump) })
    (ok n)))

;; Emergency switch: the hall stops loading a hidden game. Reversible. Boards and replays are untouched.
(define-public (set-hidden (n uint) (value bool))
  (begin
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (let ((g (unwrap! (map-get? Games n) ERR-NOT-FOUND)))
      (map-set Games n (merge g { hidden: value }))
      (note (if value "game-hidden" "game-shown") n)
      (ok true))))

;; ---------------------------------------------------------------------------
;; Admin

(define-public (set-paused (value bool))
  (begin
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (var-set paused value)
    (note "paused" (if value u1 u0))
    (ok true)))

;; Tunable until `lock-delay`. Applies to games added afterwards.
(define-public (set-delay (blocks uint))
  (begin
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (asserts! (not (var-get delay-locked)) ERR-LOCKED)
    (asserts! (<= blocks MAX-DELAY) ERR-INVALID)
    (var-set delay blocks)
    (note "delay" blocks)
    (ok true)))

(define-public (lock-delay)
  (begin
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (var-set delay-locked true)
    (note "delay-locked" (var-get delay))
    (ok true)))

(define-public (propose-admin (who principal))
  (begin
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (var-set pending-admin (some who))
    (print { event: "admin-proposed", who: who, version: (bump) })
    (ok true)))

(define-public (accept-admin)
  (let ((pending (unwrap! (var-get pending-admin) ERR-NO-PENDING)))
    (asserts! (caller-is pending) ERR-NOT-AUTHORIZED)
    (var-set admin pending)
    (var-set pending-admin none)
    (print { event: "admin-set", who: pending, version: (bump) })
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
    (note "successor-locked" u0)
    (ok true)))

;; ---------------------------------------------------------------------------
;; Reads (frozen at v1)

(define-read-only (get-version) (var-get version))
(define-read-only (get-count) (var-get count))
(define-read-only (get-admin) (var-get admin))
(define-read-only (get-game (n uint)) (map-get? Games n))
(define-read-only (get-games (ns (list 10 uint))) (map get-game ns))
(define-read-only (get-game-number (id (string-ascii 24))) (map-get? ById id))
(define-read-only (get-height) burn-block-height)
(define-read-only (is-paused) (var-get paused))
(define-read-only (get-successor) { successor: (var-get successor), locked: (var-get successor-locked) })

;; Is game n loaded by the hall right now: it exists, is not hidden, and its delay has passed.
(define-read-only (is-live (n uint))
  (match (map-get? Games n)
    g (and (not (get hidden g)) (>= burn-block-height (get live-at g)))
    false))

(define-read-only (get-config)
  { admin: (var-get admin), paused: (var-get paused), count: (var-get count), delay: (var-get delay),
    delay-locked: (var-get delay-locked), genesis: GENESIS-COUNT, max-added: MAX-ADDED,
    max-code-bytes: MAX-CODE-BYTES, version: (var-get version) })
