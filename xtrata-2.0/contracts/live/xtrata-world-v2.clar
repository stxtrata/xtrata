;; xtrata-world-v2  (Xtrata World Standard XWS v1, "xws-1")
;;
;; One registry for every space and object in the Xtrata world.
;;
;; - A SPACE is something that contains others and may be walked into: the world root,
;;   a domain (arcade), a room (hall, lobby, casino), a plot a user owns. Spaces form a
;;   tree (containment = authority). Depth <= 6, 64 children each.
;; - An OBJECT lives in a space (floor, wall, door, sign, machine ...). Objects nest up
;;   to 4 deep. Each object has a kind, a transform, short JSON params (stored, never
;;   parsed here), up to 4 bindings to behaviour contracts, an optional portal (doors)
;;   and a timeline of states by Bitcoin block height.
;; - KINDS are registered once: tier 0 built-in (admin), 1 data-only recipe
;;   (inscription), 2 sandboxed module (inscription + approval), 3 in-hall module (admin).
;; - Authority flows down: a space's policy can only be narrower than its parent's.
;;   Ancestors moderate (suspend, hide, evict) but never edit. Owners and delegates
;;   (capability grants, with inherit and expiry) build.
;; - Money: fees are paid in the same transaction as the action; this contract never
;;   holds funds. Xtrata's share (basis points of every fee plus flat floors) is set only
;;   by the root owner, is capped here, and rises only after a delay.
;; - Root owner (two-step hand-over, may be a contract) and admins with narrow caps.
;; - Successor pointer with a one-way lock. The read interface is frozen at "xws-1".
;;
;; Codes
;;   space kind:   0 domain (container only)  1 room  2 plot
;;   space state:  0 draft  1 live  2 suspended  3 retired
;;   runtime:      0 native  1 composed  2 page  3 hosted      (policy bit = 1 << code)
;;   object state: 0 visible  1 hidden  2 retired
;;   interface:    1 display-v1  2 state-v1  3 gate-v1  4 action-v1 (policy bit = 1 << (code-1))
;;   kind category: 0 shell 1 material 2 shape 3 prop 4 light 5 audio 6 display 7 door
;;                  8 cover 9 interactive 10 container
;;   interaction:  0 none  1 knock  2 peek  3 enter (needs a portal)
;;   portals-in:   0 open  1 consent  2 closed
;;   portals-out:  0 anywhere  1 same plot/domain or open targets  2 same plot/domain only
;;   capabilities: 1 STATE 2 OBJECT 4 KIND 8 LINK 16 ENTRY 32 CHILD 64 GRANT 128 MOD 256 PAUSE
;;   admin caps:   1 PAUSE  2 KINDS  4 TRUST  8 MOD

;; ---------------------------------------------------------------------------
;; Errors

(define-constant ERR-NOT-AUTHORIZED (err u300))
(define-constant ERR-PAUSED         (err u301))
(define-constant ERR-NOT-FOUND      (err u302))
(define-constant ERR-INVALID        (err u303))
(define-constant ERR-EXISTS         (err u304))
(define-constant ERR-QUOTA          (err u305))
(define-constant ERR-DEPTH          (err u306))
(define-constant ERR-POLICY         (err u307))
(define-constant ERR-STATE          (err u308))
(define-constant ERR-NO-PENDING     (err u309))
(define-constant ERR-LOCKED         (err u310))
(define-constant ERR-FEE-CAP        (err u311))
(define-constant ERR-NOT-TRANSFERABLE (err u312))
(define-constant ERR-BAD-KIND       (err u313))
(define-constant ERR-INSCRIPTION    (err u314))
(define-constant ERR-TIMELINE-FULL  (err u315))
(define-constant ERR-BAD-LINK       (err u316))
(define-constant ERR-BAD-BINDING    (err u317))
(define-constant ERR-NOT-LISTED     (err u318))
(define-constant ERR-CAPS           (err u319))

;; ---------------------------------------------------------------------------
;; Constants

(define-constant ROOT u1)
(define-constant MAX-DEPTH u6)
(define-constant MAX-CHILDREN u64)
(define-constant MAX-OBJECTS u256)
(define-constant MAX-NEST u4)
(define-constant MAX-OBJECT-CHILDREN u32)
(define-constant MAX-DESCENDANTS u10000)
(define-constant MAX-BPS u2500)
(define-constant MAX-FLAT u50000000)
(define-constant FEE-DELAY u144)
(define-constant MAX-RECIPE-BYTES u8192)
(define-constant MAX-MODULE-BYTES u262144)

(define-constant CAP-STATE u1)
(define-constant CAP-OBJECT u2)
(define-constant CAP-KIND u4)
(define-constant CAP-LINK u8)
(define-constant CAP-ENTRY u16)
(define-constant CAP-CHILD u32)
(define-constant CAP-GRANT u64)
(define-constant CAP-MOD u128)
(define-constant CAP-PAUSE u256)
(define-constant CAP-ALL u511)
(define-constant CAP-OVERSIGHT u384)

(define-constant A-PAUSE u1)
(define-constant A-KINDS u2)
(define-constant A-TRUST u4)
(define-constant A-MOD u8)

(define-constant STEPS (list u0 u1 u2 u3 u4 u5 u6))

;; ---------------------------------------------------------------------------
;; State

(define-data-var root-owner principal tx-sender)
(define-data-var pending-root-owner (optional principal) none)
(define-data-var treasury principal tx-sender)
(define-data-var paused bool false)
(define-data-var version uint u0)
(define-data-var next-id uint u2)
(define-data-var kind-count uint u0)
(define-data-var successor (optional principal) none)
(define-data-var successor-locked bool false)

(define-data-var fees-active { bps: uint, create-flat: uint, transfer-flat: uint }
  { bps: u0, create-flat: u0, transfer-flat: u0 })
(define-data-var fees-pending (optional { bps: uint, create-flat: uint, transfer-flat: uint, at: uint }) none)

;; scratch values used by filter/fold helpers (always set just before use)
(define-data-var scratch-seq uint u0)
(define-data-var scratch-now uint u0)

(define-map Admins principal uint)
(define-map Approved principal bool)

(define-map Spaces uint
  {
    parent: uint, slug: (string-ascii 24), title: (string-ascii 48), kind: uint,
    owner: principal, pending-owner: (optional principal),
    transferable: bool, epoch: uint, state: uint, paused: bool, runtime: uint,
    entry: (optional { id: uint, hash: (buff 32), size: uint }),
    policy: {
      max-children: uint, max-descendants: uint, max-objects: uint, max-depth: uint,
      runtimes: uint, tiers: uint, interfaces: uint, approved-only: bool,
      portals-in: uint, portals-out: uint, review: bool, create-fee: uint
    },
    depth: uint, children: uint, child-slots: uint, descendants: uint,
    objects: uint, object-slots: uint,
    created-at: uint, updated-at: uint, version: uint
  })

(define-map Slugs { parent: uint, slug: (string-ascii 24) } uint)
(define-map Children { parent: uint, idx: uint } uint)
(define-map Grants { space: uint, who: principal }
  { caps: uint, inherit: bool, expires: uint, epoch: uint })
(define-map Listings uint { price: uint, buyer: (optional principal), epoch: uint })

(define-map Kinds uint
  {
    category: uint, name: (string-ascii 32), tier: uint, builtin: (string-ascii 24),
    src-id: uint, src-hash: (buff 32), src-size: uint,
    by-space: uint, hidden: bool, approved: bool, owner: principal, added-at: uint
  })

(define-map Objects uint
  {
    space: uint, parent: uint, kind: uint, name: (string-ascii 24),
    transform: { x: int, y: int, z: int, yaw: uint, scale: uint },
    params: (string-ascii 512),
    bindings: (list 4 { role: (string-ascii 16), contract: principal, interface: uint }),
    portal: (optional { to-space: uint, arrival: uint, path: (string-ascii 64) }),
    state: uint, depth: uint, children: uint,
    author: principal, created-at: uint, updated-at: uint
  })
(define-map SpaceObjects { space: uint, idx: uint } uint)

(define-map States { obj: uint, seq: uint }
  {
    from-height: uint, retracted: bool, patch: (string-ascii 256),
    visibility: uint, interaction: uint, author: principal, added-at: uint
  })
(define-map StateCount uint uint)
(define-map Timeline uint (list 8 { seq: uint, from: uint }))

;; inbound portal consents: target space + source space, valid for the target's epoch
(define-map Consents { to: uint, from: uint } uint)

;; ---------------------------------------------------------------------------
;; The root space exists from deployment. Its owner is the root owner.

(map-set Spaces ROOT
  {
    parent: u0, slug: "", title: "Xtrata World", kind: u0,
    owner: tx-sender, pending-owner: none,
    transferable: false, epoch: u0, state: u1, paused: false, runtime: u0,
    entry: none,
    policy: {
      max-children: MAX-CHILDREN, max-descendants: MAX-DESCENDANTS, max-objects: u128, max-depth: MAX-DEPTH,
      runtimes: u15, tiers: u15, interfaces: u15, approved-only: false,
      portals-in: u0, portals-out: u0, review: false, create-fee: u0
    },
    depth: u0, children: u0, child-slots: u0, descendants: u0,
    objects: u0, object-slots: u0,
    created-at: stacks-block-height, updated-at: stacks-block-height, version: u0
  })

;; ---------------------------------------------------------------------------
;; Small helpers

(define-private (umin (a uint) (b uint)) (if (< a b) a b))
(define-private (umax (a uint) (b uint)) (if (> a b) a b))

(define-private (is-contract? (who principal))
  (match (principal-destruct? who)
    ok-p (is-some (get name ok-p))
    err-p (is-some (get name err-p))))

;; A standard principal must be both the tx-sender and the direct caller (no relayed
;; calls); a contract principal (e.g. a multi-signature owner) acts as the direct caller.
(define-private (caller-is (who principal))
  (if (is-contract? who)
    (is-eq contract-caller who)
    (and (is-eq tx-sender who) (is-eq contract-caller who))))

(define-private (bump)
  (begin (var-set version (+ (var-get version) u1)) (var-get version)))

(define-private (is-root-owner) (caller-is (var-get root-owner)))

(define-private (admin-has? (cap uint))
  (and (> (bit-and (default-to u0 (map-get? Admins contract-caller)) cap) u0)
       (caller-is contract-caller)))

(define-private (space-owner (id uint))
  (if (is-eq id ROOT)
    (var-get root-owner)
    (match (map-get? Spaces id) s (get owner s) (var-get root-owner))))

(define-private (touch (id uint))
  (match (map-get? Spaces id)
    s (map-set Spaces id (merge s { updated-at: stacks-block-height, version: (+ (get version s) u1) }))
    false))

(define-private (runtime-bit (runtime uint)) (bit-shift-left u1 runtime))
(define-private (interface-bit (code uint)) (bit-shift-left u1 (- code u1)))

;; ---------------------------------------------------------------------------
;; Capabilities and chain checks (every walk is bounded by MAX-DEPTH)

(define-private (caps-step (i uint)
  (ctx { cur: uint, caps: uint, who: principal, first: bool }))
  (if (is-eq (get cur ctx) u0)
    ctx
    (match (map-get? Spaces (get cur ctx))
      s
        (let (
          (own-caps (if (caller-is (space-owner (get cur ctx)))
                      (if (get first ctx) CAP-ALL CAP-OVERSIGHT)
                      u0))
          (g-caps (match (map-get? Grants { space: (get cur ctx), who: (get who ctx) })
                    gr (if (and (is-eq (get epoch gr) (get epoch s))
                                (or (is-eq (get expires gr) u0) (< burn-block-height (get expires gr)))
                                (or (get first ctx) (get inherit gr)))
                         (get caps gr)
                         u0)
                    u0)))
          { cur: (get parent s), caps: (bit-or (get caps ctx) (bit-or own-caps g-caps)),
            who: (get who ctx), first: false })
      { cur: u0, caps: (get caps ctx), who: (get who ctx), first: false })))

(define-private (admin-caps)
  (bit-or
    (if (admin-has? A-MOD) CAP-OVERSIGHT u0)
    (if (admin-has? A-PAUSE) CAP-PAUSE u0)))

(define-private (caps-from (start uint) (first bool))
  (bit-or
    (get caps (fold caps-step STEPS { cur: start, caps: u0, who: contract-caller, first: first }))
    (admin-caps)))

(define-private (caps-of (space uint)) (caps-from space true))

(define-private (has-cap? (space uint) (cap uint))
  (> (bit-and (caps-of space) cap) u0))

;; Oversight from strictly above the space (ancestor owners, inheriting grants, admins).
(define-private (oversight-above? (space uint))
  (match (map-get? Spaces space)
    s (or (is-eq space ROOT)
          (> (bit-and (caps-from (get parent s) false) CAP-MOD) u0))
    false))

(define-private (chain-write-step (i uint) (ctx { cur: uint, ok: bool }))
  (if (is-eq (get cur ctx) u0)
    ctx
    (match (map-get? Spaces (get cur ctx))
      s { cur: (get parent s),
          ok: (and (get ok ctx) (<= (get state s) u1) (not (get paused s))) }
      { cur: u0, ok: false })))

;; Writable: no global pause, and no suspended/retired/paused space on the way to the root.
(define-private (writable? (space uint))
  (and (not (var-get paused))
       (get ok (fold chain-write-step STEPS { cur: space, ok: true }))))

(define-private (chain-open-step (i uint) (ctx { cur: uint, ok: bool }))
  (if (is-eq (get cur ctx) u0)
    ctx
    (match (map-get? Spaces (get cur ctx))
      s { cur: (get parent s), ok: (and (get ok ctx) (is-eq (get state s) u1)) }
      { cur: u0, ok: false })))

;; Open: live all the way up.
(define-private (open? (space uint))
  (get ok (fold chain-open-step STEPS { cur: space, ok: true })))

;; The anchor a door may be limited to: nearest plot, else the top-level domain, else self.
(define-private (anchor-step (i uint)
  (ctx { cur: uint, plot: uint, top: uint }))
  (if (is-eq (get cur ctx) u0)
    ctx
    (match (map-get? Spaces (get cur ctx))
      s { cur: (get parent s),
          plot: (if (and (is-eq (get plot ctx) u0) (is-eq (get kind s) u2)) (get cur ctx) (get plot ctx)),
          top: (if (is-eq (get depth s) u1) (get cur ctx) (get top ctx)) }
      { cur: u0, plot: (get plot ctx), top: (get top ctx) })))

(define-private (anchor-of (space uint))
  (let ((r (fold anchor-step STEPS { cur: space, plot: u0, top: u0 })))
    (if (> (get plot r) u0) (get plot r) (if (> (get top r) u0) (get top r) space))))

;; ---------------------------------------------------------------------------
;; Policy

(define-private (policy-valid?
  (p { max-children: uint, max-descendants: uint, max-objects: uint, max-depth: uint,
       runtimes: uint, tiers: uint, interfaces: uint, approved-only: bool,
       portals-in: uint, portals-out: uint, review: bool, create-fee: uint }))
  (and (<= (get max-children p) MAX-CHILDREN)
       (<= (get max-descendants p) MAX-DESCENDANTS)
       (<= (get max-objects p) MAX-OBJECTS)
       (<= (get max-depth p) MAX-DEPTH)
       (<= (get runtimes p) u15)
       (<= (get tiers p) u15)
       (<= (get interfaces p) u15)
       (<= (get portals-in p) u2)
       (<= (get portals-out p) u2)))

;; A child policy must sit inside its parent's (ceilings only narrow).
(define-private (policy-within?
  (c { max-children: uint, max-descendants: uint, max-objects: uint, max-depth: uint,
       runtimes: uint, tiers: uint, interfaces: uint, approved-only: bool,
       portals-in: uint, portals-out: uint, review: bool, create-fee: uint })
  (p { max-children: uint, max-descendants: uint, max-objects: uint, max-depth: uint,
       runtimes: uint, tiers: uint, interfaces: uint, approved-only: bool,
       portals-in: uint, portals-out: uint, review: bool, create-fee: uint })
  (cd uint) (pd uint))
  (and (<= (get max-children c) (get max-children p))
       (<= (get max-descendants c) (get max-descendants p))
       (<= (get max-objects c) (get max-objects p))
       (<= (+ cd (get max-depth c)) (+ pd (get max-depth p)))
       (is-eq (bit-and (get runtimes c) (bit-not (get runtimes p))) u0)
       (is-eq (bit-and (get tiers c) (bit-not (get tiers p))) u0)
       (is-eq (bit-and (get interfaces c) (bit-not (get interfaces p))) u0)
       (or (not (get approved-only p)) (get approved-only c))
       (>= (get portals-in c) (get portals-in p))
       (>= (get portals-out c) (get portals-out p))
       (or (not (get review p)) (get review c))))

;; ---------------------------------------------------------------------------
;; Fees: this contract never holds money. Payer -> treasury and payer -> recipient.

(define-private (fees-now)
  (match (var-get fees-pending)
    pend (if (>= burn-block-height (get at pend))
           { bps: (get bps pend), create-flat: (get create-flat pend), transfer-flat: (get transfer-flat pend) }
           (var-get fees-active))
    (var-get fees-active)))

;; Splits `price` (what the payer owes the recipient) with Xtrata's share:
;; protocol = max(price * bps / 10000, flat); the payer pays max(price, protocol).
;; The protocol share rounds down; the remainder goes to the recipient.
(define-private (pay-split (price uint) (recipient principal) (flat uint) (kind (string-ascii 16)))
  (let (
    (eff (if (is-eq recipient tx-sender) u0 price))
    (f (fees-now))
    (pct (/ (* eff (get bps f)) u10000))
    (proto (umax pct flat))
    (to-recipient (if (> eff proto) (- eff proto) u0)))
    (begin
      (if (> proto u0) (try! (stx-transfer? proto tx-sender (var-get treasury))) true)
      (if (> to-recipient u0) (try! (stx-transfer? to-recipient tx-sender recipient)) true)
      (if (or (> proto u0) (> to-recipient u0))
        (begin
          (print { event: "fee-paid", kind: kind, payer: tx-sender, recipient: recipient,
                   protocol: proto, to-recipient: to-recipient, version: (bump) })
          true)
        true)
      (ok (+ proto to-recipient)))))

;; ---------------------------------------------------------------------------
;; Root owner and admins

(define-public (propose-root-owner (who principal))
  (begin
    (asserts! (is-root-owner) ERR-NOT-AUTHORIZED)
    (var-set pending-root-owner (some who))
    (print { event: "root-owner-proposed", who: who, version: (bump) })
    (ok true)))

(define-public (accept-root-owner)
  (let ((pending (unwrap! (var-get pending-root-owner) ERR-NO-PENDING)))
    (asserts! (caller-is pending) ERR-NOT-AUTHORIZED)
    (var-set root-owner pending)
    (var-set pending-root-owner none)
    (print { event: "root-owner-set", who: pending, version: (bump) })
    (ok true)))

(define-public (set-treasury (who principal))
  (begin
    (asserts! (is-root-owner) ERR-NOT-AUTHORIZED)
    (var-set treasury who)
    (print { event: "treasury-set", who: who, version: (bump) })
    (ok true)))

(define-public (set-admin (who principal) (caps uint))
  (begin
    (asserts! (is-root-owner) ERR-NOT-AUTHORIZED)
    (asserts! (<= caps u15) ERR-INVALID)
    (if (is-eq caps u0) (map-delete Admins who) (map-set Admins who caps))
    (print { event: "admin-set", who: who, caps: caps, version: (bump) })
    (ok true)))

(define-public (set-paused (value bool))
  (begin
    (asserts! (or (is-root-owner) (admin-has? A-PAUSE)) ERR-NOT-AUTHORIZED)
    (var-set paused value)
    (print { event: "paused", value: value, version: (bump) })
    (ok true)))

;; Approved contracts: allowed as bindings where a space requires approval, and always
;; required for action-v1 (anything that can move money).
(define-public (set-approved (who principal) (value bool))
  (begin
    (asserts! (or (is-root-owner) (admin-has? A-TRUST)) ERR-NOT-AUTHORIZED)
    (map-set Approved who value)
    (print { event: "approved-set", who: who, value: value, version: (bump) })
    (ok true)))

(define-public (set-fees (bps uint) (create-flat uint) (transfer-flat uint))
  (let ((cur (fees-now)))
    (asserts! (is-root-owner) ERR-NOT-AUTHORIZED)
    (asserts! (and (<= bps MAX-BPS) (<= create-flat MAX-FLAT) (<= transfer-flat MAX-FLAT)) ERR-FEE-CAP)
    ;; decreases apply immediately; any increase waits FEE-DELAY burn blocks
    (var-set fees-active {
      bps: (umin bps (get bps cur)),
      create-flat: (umin create-flat (get create-flat cur)),
      transfer-flat: (umin transfer-flat (get transfer-flat cur)) })
    (var-set fees-pending
      (if (or (> bps (get bps cur)) (> create-flat (get create-flat cur)) (> transfer-flat (get transfer-flat cur)))
        (some { bps: bps, create-flat: create-flat, transfer-flat: transfer-flat,
                at: (+ burn-block-height FEE-DELAY) })
        none))
    (print { event: "fee-params-set", bps: bps, create-flat: create-flat, transfer-flat: transfer-flat,
             effective-at: (if (is-some (var-get fees-pending)) (+ burn-block-height FEE-DELAY) burn-block-height),
             version: (bump) })
    (ok true)))

(define-public (set-successor (who (optional principal)))
  (begin
    (asserts! (is-root-owner) ERR-NOT-AUTHORIZED)
    (asserts! (not (var-get successor-locked)) ERR-LOCKED)
    (var-set successor who)
    (print { event: "successor", who: who, version: (bump) })
    (ok true)))

(define-public (lock-successor)
  (begin
    (asserts! (is-root-owner) ERR-NOT-AUTHORIZED)
    (var-set successor-locked true)
    (print { event: "successor-locked", version: (bump) })
    (ok true)))

;; ---------------------------------------------------------------------------
;; Spaces

;; Adds `delta` (+1 or -1 as a flag) to the descendant counter of every ancestor, and
;; fails the walk if an ancestor's max-descendants would be exceeded.
(define-private (desc-up-step (i uint) (ctx { cur: uint, ok: bool }))
  (if (is-eq (get cur ctx) u0)
    ctx
    (match (map-get? Spaces (get cur ctx))
      s (let ((n (+ (get descendants s) u1)))
          (map-set Spaces (get cur ctx) (merge s { descendants: n }))
          { cur: (get parent s), ok: (and (get ok ctx) (<= n (get max-descendants (get policy s)))) })
      { cur: u0, ok: false })))

(define-private (desc-down-step (i uint) (ctx { cur: uint, ok: bool }))
  (if (is-eq (get cur ctx) u0)
    ctx
    (match (map-get? Spaces (get cur ctx))
      s (begin
          (map-set Spaces (get cur ctx)
            (merge s { descendants: (if (> (get descendants s) u0) (- (get descendants s) u1) u0) }))
          { cur: (get parent s), ok: (get ok ctx) })
      { cur: u0, ok: false })))

(define-public (create-space
  (parent uint) (slug (string-ascii 24)) (title (string-ascii 48)) (kind uint)
  (owner principal) (runtime uint) (transferable bool)
  (policy { max-children: uint, max-descendants: uint, max-objects: uint, max-depth: uint,
            runtimes: uint, tiers: uint, interfaces: uint, approved-only: bool,
            portals-in: uint, portals-out: uint, review: bool, create-fee: uint }))
  (let (
    (p (unwrap! (map-get? Spaces parent) ERR-NOT-FOUND))
    (pp (get policy p))
    (id (var-get next-id))
    (depth (+ (get depth p) u1))
    (root? (is-root-owner)))
    (asserts! (writable? parent) ERR-PAUSED)
    (asserts! (has-cap? parent CAP-CHILD) ERR-NOT-AUTHORIZED)
    (asserts! (<= kind u2) ERR-INVALID)
    (asserts! (and (> (len slug) u0) (> (len title) u0)) ERR-INVALID)
    (asserts! (<= runtime u3) ERR-INVALID)
    (asserts! (is-none (map-get? Slugs { parent: parent, slug: slug })) ERR-EXISTS)
    (asserts! (<= depth MAX-DEPTH) ERR-DEPTH)
    (asserts! (<= depth (+ (get depth p) (get max-depth pp))) ERR-DEPTH)
    (asserts! (< (get children p) (get max-children pp)) ERR-QUOTA)
    (asserts! (< (get child-slots p) MAX-CHILDREN) ERR-QUOTA)
    ;; native and hosted spaces run hall-level code: root owner only
    (asserts! (or root? (is-eq runtime u1) (is-eq runtime u2)) ERR-NOT-AUTHORIZED)
    (asserts! (> (bit-and (get runtimes pp) (runtime-bit runtime)) u0) ERR-POLICY)
    (asserts! (policy-valid? policy) ERR-INVALID)
    (asserts! (policy-within? policy pp depth (get depth p)) ERR-POLICY)
    ;; descendants quota up the chain
    (asserts! (get ok (fold desc-up-step STEPS { cur: parent, ok: true })) ERR-QUOTA)
    ;; the creation fee, with Xtrata's share (root owner is exempt)
    (if root?
      true
      (begin (try! (pay-split (get create-fee pp) (space-owner parent) (get create-flat (fees-now)) "create")) true))
    (map-set Spaces id {
      parent: parent, slug: slug, title: title, kind: kind,
      owner: owner, pending-owner: none,
      ;; only the root owner may create a space with a chosen lock; others get the default
      transferable: (if root? transferable (not (is-eq kind u0))),
      epoch: u0, state: u0, paused: false, runtime: runtime,
      entry: none, policy: policy,
      depth: depth, children: u0, child-slots: u0, descendants: u0,
      objects: u0, object-slots: u0,
      created-at: stacks-block-height, updated-at: stacks-block-height, version: u0 })
    (map-set Slugs { parent: parent, slug: slug } id)
    (map-set Children { parent: parent, idx: (get child-slots p) } id)
    ;; re-read the parent: the descendant walk already updated its counter
    (let ((p2 (unwrap! (map-get? Spaces parent) ERR-NOT-FOUND)))
      (map-set Spaces parent (merge p2 {
        children: (+ (get children p2) u1), child-slots: (+ (get child-slots p2) u1),
        updated-at: stacks-block-height, version: (+ (get version p2) u1) })))
    (var-set next-id (+ id u1))
    (print { event: "space-created", space: id, parent: parent, slug: slug, kind: kind,
             owner: owner, runtime: runtime, actor: contract-caller, version: (bump) })
    (ok id)))

(define-public (set-space-title (id uint) (title (string-ascii 48)))
  (let ((s (unwrap! (map-get? Spaces id) ERR-NOT-FOUND)))
    (asserts! (writable? id) ERR-PAUSED)
    (asserts! (has-cap? id CAP-ENTRY) ERR-NOT-AUTHORIZED)
    (asserts! (> (len title) u0) ERR-INVALID)
    (map-set Spaces id (merge s { title: title, updated-at: stacks-block-height, version: (+ (get version s) u1) }))
    (print { event: "space-title", space: id, actor: contract-caller, version: (bump) })
    (ok true)))

(define-public (set-space-runtime (id uint) (runtime uint))
  (let ((s (unwrap! (map-get? Spaces id) ERR-NOT-FOUND)))
    (asserts! (writable? id) ERR-PAUSED)
    (asserts! (caller-is (space-owner id)) ERR-NOT-AUTHORIZED)
    (asserts! (<= runtime u3) ERR-INVALID)
    (asserts! (or (is-root-owner) (is-eq runtime u1) (is-eq runtime u2)) ERR-NOT-AUTHORIZED)
    (asserts! (> (bit-and (get runtimes (get policy (unwrap! (map-get? Spaces (get parent s)) ERR-NOT-FOUND)))
                          (runtime-bit runtime)) u0) ERR-POLICY)
    (map-set Spaces id (merge s { runtime: runtime, updated-at: stacks-block-height, version: (+ (get version s) u1) }))
    (print { event: "space-runtime", space: id, runtime: runtime, actor: contract-caller, version: (bump) })
    (ok true)))

;; The inscription that renders the space (a page, or a composed-room snapshot).
(define-public (set-space-entry (id uint) (entry (optional { id: uint, hash: (buff 32), size: uint })))
  (let ((s (unwrap! (map-get? Spaces id) ERR-NOT-FOUND)))
    (asserts! (writable? id) ERR-PAUSED)
    (asserts! (has-cap? id CAP-ENTRY) ERR-NOT-AUTHORIZED)
    (match entry
      e (asserts! (entry-ok? (get id e) (get hash e) (get size e)) ERR-INSCRIPTION)
      true)
    (map-set Spaces id (merge s { entry: entry, updated-at: stacks-block-height, version: (+ (get version s) u1) }))
    (print { event: "entry-set", space: id, entry: entry, actor: contract-caller, version: (bump) })
    (ok true)))

(define-private (entry-ok? (id uint) (hash (buff 32)) (size uint))
  (and
    (is-eq (contract-call? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3 inscription-exists id) (ok true)) ;; @principal core
    (is-eq (contract-call? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3 is-inscription-sealed id) (some true)) ;; @principal core
    (is-eq (contract-call? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3 get-inscription-hash id) (some hash)) ;; @principal core
    (is-eq (contract-call? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3 get-inscription-size id) (some size)) ;; @principal core
  ))

;; draft/live: the owner. Suspend and unsuspend: oversight from above only (so an owner
;; cannot undo moderation). Retire: the owner, once no live children remain.
(define-public (set-space-state (id uint) (state uint))
  (let ((s (unwrap! (map-get? Spaces id) ERR-NOT-FOUND)))
    (asserts! (not (is-eq id ROOT)) ERR-STATE)
    (asserts! (<= state u3) ERR-INVALID)
    (asserts! (not (is-eq (get state s) u3)) ERR-STATE)
    (if (or (is-eq state u2) (is-eq (get state s) u2))
      (asserts! (or (is-root-owner) (oversight-above? id)) ERR-NOT-AUTHORIZED)
      (begin
        (asserts! (writable? id) ERR-PAUSED)
        (asserts! (caller-is (space-owner id)) ERR-NOT-AUTHORIZED)))
    (if (is-eq state u3)
      (begin
        (asserts! (is-eq (get children s) u0) ERR-STATE)
        (map-set Spaces (get parent s)
          (let ((ps (unwrap! (map-get? Spaces (get parent s)) ERR-NOT-FOUND)))
            (merge ps { children: (if (> (get children ps) u0) (- (get children ps) u1) u0) })))
        (fold desc-down-step STEPS { cur: (get parent s), ok: true })
        true)
      true)
    (map-set Spaces id (merge (unwrap! (map-get? Spaces id) ERR-NOT-FOUND)
      { state: state, updated-at: stacks-block-height, version: (+ (get version s) u1) }))
    (print { event: "space-state", space: id, state: state, actor: contract-caller, version: (bump) })
    (ok true)))

(define-public (set-space-paused (id uint) (value bool))
  (let ((s (unwrap! (map-get? Spaces id) ERR-NOT-FOUND)))
    (asserts! (has-cap? id CAP-PAUSE) ERR-NOT-AUTHORIZED)
    (map-set Spaces id (merge s { paused: value, updated-at: stacks-block-height, version: (+ (get version s) u1) }))
    (print { event: "space-paused", space: id, value: value, actor: contract-caller, version: (bump) })
    (ok true)))

;; Policy: an owner can only narrow; an ancestor with oversight can set anything that
;; still fits inside the parent's policy. Existing children keep their own policies.
(define-public (set-policy (id uint)
  (policy { max-children: uint, max-descendants: uint, max-objects: uint, max-depth: uint,
            runtimes: uint, tiers: uint, interfaces: uint, approved-only: bool,
            portals-in: uint, portals-out: uint, review: bool, create-fee: uint }))
  (let (
    (s (unwrap! (map-get? Spaces id) ERR-NOT-FOUND))
    (above? (or (is-root-owner) (oversight-above? id))))
    (asserts! (writable? id) ERR-PAUSED)
    (asserts! (or above? (caller-is (space-owner id))) ERR-NOT-AUTHORIZED)
    (asserts! (policy-valid? policy) ERR-INVALID)
    (if (is-eq id ROOT)
      (asserts! (is-root-owner) ERR-NOT-AUTHORIZED)
      (let ((ps (unwrap! (map-get? Spaces (get parent s)) ERR-NOT-FOUND)))
        (asserts! (policy-within? policy (get policy ps) (get depth s) (get depth ps)) ERR-POLICY)))
    ;; an owner narrows only (the create-fee is the owner's to set)
    (asserts! (or above?
                  (policy-within? policy (get policy s) (get depth s) (get depth s)))
              ERR-POLICY)
    (map-set Spaces id (merge s { policy: policy, updated-at: stacks-block-height, version: (+ (get version s) u1) }))
    (print { event: "policy-set", space: id, actor: contract-caller, version: (bump) })
    (ok true)))

;; ---------------------------------------------------------------------------
;; Grants

(define-public (grant (space uint) (who principal) (caps uint) (inherit bool) (expires uint))
  (let (
    (s (unwrap! (map-get? Spaces space) ERR-NOT-FOUND))
    (mine (bit-and (caps-of space) (bit-not CAP-MOD))))
    (asserts! (writable? space) ERR-PAUSED)
    (asserts! (> (bit-and (caps-of space) CAP-GRANT) u0) ERR-NOT-AUTHORIZED)
    (asserts! (and (> caps u0) (<= caps CAP-ALL)) ERR-INVALID)
    (asserts! (is-eq (bit-and caps CAP-MOD) u0) ERR-CAPS)
    (asserts! (is-eq (bit-and caps (bit-not mine)) u0) ERR-CAPS)
    (asserts! (or (is-eq expires u0) (> expires burn-block-height)) ERR-INVALID)
    (map-set Grants { space: space, who: who }
      { caps: caps, inherit: inherit, expires: expires, epoch: (get epoch s) })
    (print { event: "grant", space: space, who: who, caps: caps, inherit: inherit, expires: expires,
             actor: contract-caller, version: (bump) })
    (ok true)))

(define-public (revoke (space uint) (who principal))
  (begin
    (asserts! (is-some (map-get? Spaces space)) ERR-NOT-FOUND)
    (asserts! (or (has-cap? space CAP-GRANT) (has-cap? space CAP-MOD) (caller-is who)) ERR-NOT-AUTHORIZED)
    (map-delete Grants { space: space, who: who })
    (print { event: "revoke", space: space, who: who, actor: contract-caller, version: (bump) })
    (ok true)))

;; ---------------------------------------------------------------------------
;; Ownership: transfer (two-step) and sale. Both bump the epoch, which lapses every
;; grant and inbound consent made under the old owner.

(define-private (hand-over (id uint) (to principal))
  (let ((s (unwrap-panic (map-get? Spaces id))))
    (map-set Spaces id (merge s {
      owner: to, pending-owner: none, epoch: (+ (get epoch s) u1),
      updated-at: stacks-block-height, version: (+ (get version s) u1) }))
    (map-delete Listings id)
    (print { event: "space-owner", space: id, from: (get owner s), to: to, epoch: (+ (get epoch s) u1), version: (bump) })
    true))

(define-public (propose-space-transfer (id uint) (to principal))
  (let ((s (unwrap! (map-get? Spaces id) ERR-NOT-FOUND)))
    (asserts! (not (is-eq id ROOT)) ERR-NOT-TRANSFERABLE)
    (asserts! (writable? id) ERR-PAUSED)
    (asserts! (caller-is (get owner s)) ERR-NOT-AUTHORIZED)
    (asserts! (get transferable s) ERR-NOT-TRANSFERABLE)
    (map-set Spaces id (merge s { pending-owner: (some to) }))
    (print { event: "transfer-proposed", space: id, to: to, version: (bump) })
    (ok true)))

(define-public (cancel-space-transfer (id uint))
  (let ((s (unwrap! (map-get? Spaces id) ERR-NOT-FOUND)))
    (asserts! (caller-is (get owner s)) ERR-NOT-AUTHORIZED)
    (map-set Spaces id (merge s { pending-owner: none }))
    (ok true)))

;; The recipient pays the flat transfer fee (zero at launch).
(define-public (accept-space-transfer (id uint))
  (let (
    (s (unwrap! (map-get? Spaces id) ERR-NOT-FOUND))
    (pending (unwrap! (get pending-owner s) ERR-NO-PENDING)))
    (asserts! (writable? id) ERR-PAUSED)
    (asserts! (caller-is pending) ERR-NOT-AUTHORIZED)
    (asserts! (get transferable s) ERR-NOT-TRANSFERABLE)
    (let ((flat (get transfer-flat (fees-now))))
      (if (> flat u0) (try! (stx-transfer? flat tx-sender (var-get treasury))) true)
      (if (> flat u0)
        (begin
          (print { event: "fee-paid", kind: "transfer", payer: tx-sender, recipient: (var-get treasury),
                   protocol: flat, to-recipient: u0, version: (bump) })
          true)
        true))
    (hand-over id pending)
    (ok true)))

;; Only the root owner can lock or unlock; an owner may lock their own space.
(define-public (set-transferable (id uint) (value bool))
  (let ((s (unwrap! (map-get? Spaces id) ERR-NOT-FOUND)))
    (asserts! (not (is-eq id ROOT)) ERR-NOT-TRANSFERABLE)
    (asserts! (or (is-root-owner) (and (not value) (caller-is (get owner s)))) ERR-NOT-AUTHORIZED)
    (map-set Spaces id (merge s { transferable: value, updated-at: stacks-block-height, version: (+ (get version s) u1) }))
    (print { event: "transferable-set", space: id, value: value, version: (bump) })
    (ok true)))

(define-public (list-space (id uint) (price uint) (buyer (optional principal)))
  (let ((s (unwrap! (map-get? Spaces id) ERR-NOT-FOUND)))
    (asserts! (not (is-eq id ROOT)) ERR-NOT-TRANSFERABLE)
    (asserts! (writable? id) ERR-PAUSED)
    (asserts! (caller-is (get owner s)) ERR-NOT-AUTHORIZED)
    (asserts! (get transferable s) ERR-NOT-TRANSFERABLE)
    (map-set Listings id { price: price, buyer: buyer, epoch: (get epoch s) })
    (print { event: "space-listed", space: id, price: price, buyer: buyer, version: (bump) })
    (ok true)))

(define-public (delist-space (id uint))
  (let ((s (unwrap! (map-get? Spaces id) ERR-NOT-FOUND)))
    (asserts! (caller-is (get owner s)) ERR-NOT-AUTHORIZED)
    (map-delete Listings id)
    (print { event: "space-delisted", space: id, version: (bump) })
    (ok true)))

(define-public (buy-space (id uint))
  (let (
    (s (unwrap! (map-get? Spaces id) ERR-NOT-FOUND))
    (l (unwrap! (map-get? Listings id) ERR-NOT-LISTED)))
    (asserts! (writable? id) ERR-PAUSED)
    (asserts! (get transferable s) ERR-NOT-TRANSFERABLE)
    (asserts! (is-eq (get epoch l) (get epoch s)) ERR-NOT-LISTED)
    (asserts! (caller-is tx-sender) ERR-NOT-AUTHORIZED)
    (asserts! (not (is-eq tx-sender (get owner s))) ERR-INVALID)
    (asserts! (match (get buyer l) b (is-eq b tx-sender) true) ERR-NOT-AUTHORIZED)
    (try! (pay-split (get price l) (get owner s) u0 "sale"))
    (print { event: "sale", space: id, price: (get price l), buyer: tx-sender, seller: (get owner s) })
    (hand-over id tx-sender)
    (ok true)))


;; ---------------------------------------------------------------------------
;; Kinds (what an object can be)

(define-private (inscription-ok? (id uint) (hash (buff 32)) (size uint) (who principal))
  (and
    (is-eq (contract-call? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3 inscription-exists id) (ok true)) ;; @principal core
    (is-eq (contract-call? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3 is-inscription-sealed id) (some true)) ;; @principal core
    (is-eq (contract-call? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3 get-inscription-hash id) (some hash)) ;; @principal core
    (is-eq (contract-call? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3 get-inscription-size id) (some size)) ;; @principal core
    (is-eq (contract-call? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3 get-inscription-creator id) (some who)) ;; @principal core
  ))

(define-private (kind-ok? (id uint) (tiers uint))
  (match (map-get? Kinds id)
    k (and (not (get hidden k)) (get approved k)
           (> (bit-and tiers (bit-shift-left u1 (get tier k))) u0))
    false))

(define-private (kind-category (id uint))
  (match (map-get? Kinds id) k (get category k) u99))

;; Register a kind. `space` is where the caller holds the KIND capability. Tier 0 (built-in)
;; and tier 3 (in-hall module) need the root owner or a KINDS admin; tier 2 modules wait for
;; approval; the space's policy limits which tiers its holders may register.
(define-public (register-kind
  (space uint) (category uint) (name (string-ascii 32)) (tier uint) (builtin (string-ascii 24))
  (src-id uint) (src-hash (buff 32)) (src-size uint))
  (let (
    (id (var-get kind-count))
    (s (unwrap! (map-get? Spaces space) ERR-NOT-FOUND))
    (admin? (or (is-root-owner) (admin-has? A-KINDS))))
    (asserts! (writable? space) ERR-PAUSED)
    (asserts! (or admin? (has-cap? space CAP-KIND)) ERR-NOT-AUTHORIZED)
    (asserts! (<= category u10) ERR-INVALID)
    (asserts! (<= tier u3) ERR-INVALID)
    (asserts! (> (len name) u0) ERR-INVALID)
    (asserts! (or admin? (and (>= tier u1) (<= tier u2))) ERR-NOT-AUTHORIZED)
    (asserts! (or admin? (> (bit-and (get tiers (get policy s)) (bit-shift-left u1 tier)) u0)) ERR-POLICY)
    (if (is-eq tier u0)
      (asserts! (> (len builtin) u0) ERR-INVALID)
      (begin
        (asserts! (is-eq (len builtin) u0) ERR-INVALID)
        (asserts! (<= src-size (if (is-eq tier u1) MAX-RECIPE-BYTES MAX-MODULE-BYTES)) ERR-INSCRIPTION)
        (asserts! (inscription-ok? src-id src-hash src-size tx-sender) ERR-INSCRIPTION)))
    (map-set Kinds id {
      category: category, name: name, tier: tier, builtin: builtin,
      src-id: src-id, src-hash: src-hash, src-size: src-size,
      by-space: space, hidden: false, approved: (<= tier u1), owner: tx-sender,
      added-at: stacks-block-height })
    (var-set kind-count (+ id u1))
    (print { event: "kind-registered", kind: id, category: category, tier: tier, space: space,
             actor: contract-caller, version: (bump) })
    (ok id)))

(define-public (set-kind-hidden (id uint) (hidden bool))
  (let ((k (unwrap! (map-get? Kinds id) ERR-NOT-FOUND)))
    (asserts! (or (is-root-owner) (admin-has? A-KINDS)) ERR-NOT-AUTHORIZED)
    (map-set Kinds id (merge k { hidden: hidden }))
    (print { event: "kind-hidden", kind: id, hidden: hidden, version: (bump) })
    (ok true)))

(define-public (approve-kind (id uint) (approved bool))
  (let ((k (unwrap! (map-get? Kinds id) ERR-NOT-FOUND)))
    (asserts! (or (is-root-owner) (admin-has? A-KINDS)) ERR-NOT-AUTHORIZED)
    (map-set Kinds id (merge k { approved: approved }))
    (print { event: "kind-approved", kind: id, approved: approved, version: (bump) })
    (ok true)))

;; ---------------------------------------------------------------------------
;; Objects

(define-private (transform-ok? (t { x: int, y: int, z: int, yaw: uint, scale: uint }))
  (and (>= (get x t) -100000) (<= (get x t) 100000)
       (>= (get y t) -100000) (<= (get y t) 100000)
       (>= (get z t) -100000) (<= (get z t) 100000)
       (< (get yaw t) u36000)
       (>= (get scale t) u1) (<= (get scale t) u10000)))

(define-public (create-object
  (space uint) (parent-obj uint) (kind uint) (name (string-ascii 24))
  (transform { x: int, y: int, z: int, yaw: uint, scale: uint })
  (params (string-ascii 512)))
  (let (
    (s (unwrap! (map-get? Spaces space) ERR-NOT-FOUND))
    (pol (get policy s))
    (id (var-get next-id))
    (po (if (is-eq parent-obj u0) none (map-get? Objects parent-obj)))
    (pd (match po p (get depth p) u0))
    (owner? (caller-is (space-owner space))))
    (asserts! (writable? space) ERR-PAUSED)
    (asserts! (has-cap? space CAP-OBJECT) ERR-NOT-AUTHORIZED)
    (asserts! (> (len name) u0) ERR-INVALID)
    (asserts! (transform-ok? transform) ERR-INVALID)
    (asserts! (kind-ok? kind (get tiers pol)) ERR-BAD-KIND)
    (asserts! (< (get objects s) (get max-objects pol)) ERR-QUOTA)
    (asserts! (< (get object-slots s) MAX-OBJECTS) ERR-QUOTA)
    (asserts! (or (is-eq parent-obj u0)
                  (match po p (and (is-eq (get space p) space) (< pd MAX-NEST)
                                   (< (get children p) MAX-OBJECT-CHILDREN)
                                   (< (get state p) u2))
                    false))
              ERR-DEPTH)
    (map-set Objects id {
      space: space, parent: parent-obj, kind: kind, name: name, transform: transform, params: params,
      bindings: (list), portal: none,
      state: (if (and (not owner?) (get review pol)) u1 u0),
      depth: (+ pd u1), children: u0,
      author: contract-caller, created-at: stacks-block-height, updated-at: stacks-block-height })
    (map-set SpaceObjects { space: space, idx: (get object-slots s) } id)
    (map-set Spaces space (merge s {
      objects: (+ (get objects s) u1), object-slots: (+ (get object-slots s) u1),
      updated-at: stacks-block-height, version: (+ (get version s) u1) }))
    (match po p (map-set Objects parent-obj (merge p { children: (+ (get children p) u1) })) false)
    (var-set next-id (+ id u1))
    (print { event: "object-set", object: id, space: space, parent: parent-obj, kind: kind,
             actor: contract-caller, version: (bump) })
    (ok id)))

(define-public (set-object
  (id uint) (name (string-ascii 24))
  (transform { x: int, y: int, z: int, yaw: uint, scale: uint })
  (params (string-ascii 512)))
  (let ((o (unwrap! (map-get? Objects id) ERR-NOT-FOUND)))
    (asserts! (writable? (get space o)) ERR-PAUSED)
    (asserts! (has-cap? (get space o) CAP-OBJECT) ERR-NOT-AUTHORIZED)
    (asserts! (< (get state o) u2) ERR-STATE)
    (asserts! (> (len name) u0) ERR-INVALID)
    (asserts! (transform-ok? transform) ERR-INVALID)
    (map-set Objects id (merge o { name: name, transform: transform, params: params,
                                   updated-at: stacks-block-height }))
    (print { event: "object-set", object: id, space: (get space o), actor: contract-caller, version: (bump) })
    (ok true)))

;; visible / hidden / retired. Moderation (MOD) may hide; it works even while the space is
;; suspended or paused, because hiding is an escape hatch. Retiring needs no live parts.
(define-public (set-object-state (id uint) (state uint))
  (let (
    (o (unwrap! (map-get? Objects id) ERR-NOT-FOUND))
    (space (get space o))
    (s (unwrap! (map-get? Spaces space) ERR-NOT-FOUND)))
    (asserts! (<= state u2) ERR-INVALID)
    (asserts! (< (get state o) u2) ERR-STATE)
    (asserts! (if (is-eq state u1)
                (or (has-cap? space CAP-OBJECT) (has-cap? space CAP-MOD))
                (has-cap? space CAP-OBJECT))
              ERR-NOT-AUTHORIZED)
    ;; where a review lane applies, only the owner or a moderator can make hidden content visible
    (asserts! (or (not (get review (get policy s))) (not (is-eq state u0))
                  (caller-is (space-owner space)) (has-cap? space CAP-MOD))
              ERR-NOT-AUTHORIZED)
    (if (is-eq state u2)
      (begin
        (asserts! (is-eq (get children o) u0) ERR-STATE)
        (map-set Spaces space (merge s {
          objects: (if (> (get objects s) u0) (- (get objects s) u1) u0),
          updated-at: stacks-block-height, version: (+ (get version s) u1) }))
        (match (map-get? Objects (get parent o))
          p (map-set Objects (get parent o)
              (merge p { children: (if (> (get children p) u0) (- (get children p) u1) u0) }))
          false)
        true)
      true)
    (map-set Objects id (merge o { state: state, updated-at: stacks-block-height }))
    (print { event: "object-state", object: id, space: space, state: state, actor: contract-caller, version: (bump) })
    (ok true)))

;; ---------------------------------------------------------------------------
;; Bindings: behaviour contracts attached to an object

(define-private (binding-step
  (b { role: (string-ascii 16), contract: principal, interface: uint })
  (acc { ok: bool, mask: uint, approved-only: bool }))
  (let (
    (bit (if (and (>= (get interface b) u1) (<= (get interface b) u4)) (interface-bit (get interface b)) u0))
    (approved (default-to false (map-get? Approved (get contract b)))))
    { ok: (and (get ok acc) (> (len (get role b)) u0) (> bit u0)
               (> (bit-and (get mask acc) bit) u0)
               (or approved (not (or (get approved-only acc) (is-eq (get interface b) u4))))),
      mask: (get mask acc), approved-only: (get approved-only acc) }))

(define-public (set-bindings
  (id uint) (bindings (list 4 { role: (string-ascii 16), contract: principal, interface: uint })))
  (let (
    (o (unwrap! (map-get? Objects id) ERR-NOT-FOUND))
    (space (get space o))
    (s (unwrap! (map-get? Spaces space) ERR-NOT-FOUND))
    (pol (get policy s)))
    (asserts! (writable? space) ERR-PAUSED)
    (asserts! (has-cap? space CAP-LINK) ERR-NOT-AUTHORIZED)
    (asserts! (< (get state o) u2) ERR-STATE)
    (asserts! (get ok (fold binding-step bindings
                {ok: true, mask: (get interfaces pol), approved-only: (get approved-only pol)}))
              ERR-BAD-BINDING)
    (map-set Objects id (merge o { bindings: bindings, updated-at: stacks-block-height }))
    (print { event: "binding-set", object: id, space: space, count: (len bindings),
             actor: contract-caller, version: (bump) })
    (ok true)))

;; ---------------------------------------------------------------------------
;; Portals (doors)

;; An external path must be a site path: starts with "/", not "//" or "/\".
(define-private (path-ok? (path (string-ascii 64)))
  (and (is-eq (element-at? path u0) (some "/"))
       (not (is-eq (element-at? path u1) (some "/")))
       (not (is-eq (element-at? path u1) (some "\\")))))

(define-private (portal-ok? (src uint) (pt { to-space: uint, arrival: uint, path: (string-ascii 64) }))
  (let (
    (ss (unwrap! (map-get? Spaces src) false))
    (sp (get policy ss)))
    (if (is-eq (get to-space pt) u0)
      ;; a site path: only spaces with unrestricted outbound doors
      (and (is-eq (get portals-out sp) u0) (path-ok? (get path pt)))
      (match (map-get? Spaces (get to-space pt))
        ts
          (let (
            (tp (get policy ts))
            (same-anchor (is-eq (anchor-of src) (anchor-of (get to-space pt))))
            (consented (is-eq (map-get? Consents { to: (get to-space pt), from: src }) (some (get epoch ts)))))
            (and
              (open? (get to-space pt))
              ;; arrival: the target's entrance (0) or one of its own live objects
              (or (is-eq (get arrival pt) u0)
                  (match (map-get? Objects (get arrival pt))
                    ao (and (is-eq (get space ao) (get to-space pt)) (< (get state ao) u2))
                    false))
              ;; leaving: the source's outbound rule
              (or (is-eq (get portals-out sp) u0)
                  same-anchor
                  (and (is-eq (get portals-out sp) u1) (is-eq (get portals-in tp) u0)))
              ;; entering: the target's inbound rule (consent is for cross-owner doors)
              (or (is-eq (get to-space pt) src)
                  (is-eq (get portals-in tp) u0)
                  (and (is-eq (get portals-in tp) u1)
                       (or (is-eq (space-owner src) (space-owner (get to-space pt))) consented)))))
        false))))

(define-public (set-portal
  (id uint) (portal (optional { to-space: uint, arrival: uint, path: (string-ascii 64) })))
  (let (
    (o (unwrap! (map-get? Objects id) ERR-NOT-FOUND))
    (space (get space o)))
    (asserts! (writable? space) ERR-PAUSED)
    (asserts! (has-cap? space CAP-LINK) ERR-NOT-AUTHORIZED)
    (asserts! (< (get state o) u2) ERR-STATE)
    (asserts! (is-eq (kind-category (get kind o)) u7) ERR-BAD-LINK)
    (match portal pt (asserts! (portal-ok? space pt) ERR-BAD-LINK) true)
    (map-set Objects id (merge o { portal: portal, updated-at: stacks-block-height }))
    (print { event: "portal-set", object: id, space: space, portal: portal,
             actor: contract-caller, version: (bump) })
    (ok true)))

;; The owner of a target space (or a LINK delegate) admits doors from another space.
(define-public (allow-portal-from (to uint) (from uint))
  (let ((ts (unwrap! (map-get? Spaces to) ERR-NOT-FOUND)))
    (asserts! (is-some (map-get? Spaces from)) ERR-NOT-FOUND)
    (asserts! (writable? to) ERR-PAUSED)
    (asserts! (has-cap? to CAP-LINK) ERR-NOT-AUTHORIZED)
    (map-set Consents { to: to, from: from } (get epoch ts))
    (print { event: "portal-consent", to: to, from: from, actor: contract-caller, version: (bump) })
    (ok true)))

(define-public (revoke-portal-from (to uint) (from uint))
  (begin
    (asserts! (is-some (map-get? Spaces to)) ERR-NOT-FOUND)
    (asserts! (or (has-cap? to CAP-LINK) (has-cap? to CAP-MOD)) ERR-NOT-AUTHORIZED)
    (map-delete Consents { to: to, from: from })
    (print { event: "portal-consent-revoked", to: to, from: from, actor: contract-caller, version: (bump) })
    (ok true)))

;; ---------------------------------------------------------------------------
;; States: an object's timeline by burn block height

(define-private (put-state
  (st { obj: uint, from: uint, patch: (string-ascii 256), visibility: uint, interaction: uint })
  (acc (response uint uint)))
  (match acc
    n
      (let (
        (id (get obj st))
        (o (unwrap! (map-get? Objects id) ERR-NOT-FOUND))
        (space (get space o))
        (seq (default-to u0 (map-get? StateCount id)))
        (from (umax (get from st) burn-block-height))
        (timeline (default-to (list) (map-get? Timeline id))))
        (asserts! (writable? space) ERR-PAUSED)
        (asserts! (has-cap? space CAP-STATE) ERR-NOT-AUTHORIZED)
        (asserts! (< (get state o) u2) ERR-STATE)
        (asserts! (<= (get visibility st) u1) ERR-INVALID)
        (asserts! (<= (get interaction st) u3) ERR-INVALID)
        ;; "enter" needs a door that leads somewhere
        (asserts! (or (< (get interaction st) u3) (is-some (get portal o))) ERR-BAD-LINK)
        (map-set States { obj: id, seq: seq } {
          from-height: from, retracted: false, patch: (get patch st),
          visibility: (get visibility st), interaction: (get interaction st),
          author: contract-caller, added-at: stacks-block-height })
        (map-set StateCount id (+ seq u1))
        (map-set Timeline id
          (unwrap! (as-max-len? (append timeline { seq: seq, from: from }) u8) ERR-TIMELINE-FULL))
        (print { event: "state-added", object: id, space: space, seq: seq, from-height: from, version: (bump) })
        (ok (+ n u1)))
    e (err e)))

(define-public (add-state
  (st { obj: uint, from: uint, patch: (string-ascii 256), visibility: uint, interaction: uint }))
  (begin
    (try! (put-state st (ok u0)))
    (ok (- (default-to u0 (map-get? StateCount (get obj st))) u1))))

;; A whole scripted sequence across several objects in one transaction (all or nothing).
(define-public (add-states
  (sts (list 8 { obj: uint, from: uint, patch: (string-ascii 256), visibility: uint, interaction: uint })))
  (fold put-state sts (ok u0)))

(define-private (not-seq? (e { seq: uint, from: uint })) (not (is-eq (get seq e) (var-get scratch-seq))))

;; Retract hides a state from resolution; history stays readable. Works while paused or
;; suspended (escape hatch), for the space's STATE holders and for moderators.
(define-public (retract-state (obj uint) (seq uint))
  (let (
    (o (unwrap! (map-get? Objects obj) ERR-NOT-FOUND))
    (space (get space o))
    (st (unwrap! (map-get? States { obj: obj, seq: seq }) ERR-NOT-FOUND)))
    (asserts! (or (has-cap? space CAP-STATE) (has-cap? space CAP-MOD)) ERR-NOT-AUTHORIZED)
    (map-set States { obj: obj, seq: seq } (merge st { retracted: true }))
    (var-set scratch-seq seq)
    (map-set Timeline obj (filter not-seq? (default-to (list) (map-get? Timeline obj))))
    (print { event: "state-retracted", object: obj, space: space, seq: seq, version: (bump) })
    (ok true)))

(define-private (keep-state? (e { seq: uint, from: uint }))
  (or (is-eq (get seq e) (var-get scratch-seq)) (> (get from e) (var-get scratch-now))))

;; Frees timeline space: keeps the active state and everything still to come.
(define-public (compact-object (obj uint))
  (let (
    (o (unwrap! (map-get? Objects obj) ERR-NOT-FOUND))
    (view (resolve obj)))
    (asserts! (has-cap? (get space o) CAP-STATE) ERR-NOT-AUTHORIZED)
    (var-set scratch-now burn-block-height)
    (var-set scratch-seq (get active-seq view))
    (map-set Timeline obj (filter keep-state? (default-to (list) (map-get? Timeline obj))))
    (print { event: "object-compacted", object: obj, space: (get space o), version: (bump) })
    (ok true)))

(define-private (resolve-step
  (e { seq: uint, from: uint })
  (ctx { now: uint, found: bool, active-seq: uint, active-height: uint,
         next-found: bool, next-height: uint }))
  ;; Retracted states are removed from the timeline, so every entry here counts.
  (if (<= (get from e) (get now ctx))
    (if (or (not (get found ctx)) (>= (get from e) (get active-height ctx)))
      (merge ctx { found: true, active-seq: (get seq e), active-height: (get from e) })
      ctx)
    (if (or (not (get next-found ctx)) (< (get from e) (get next-height ctx)))
      (merge ctx { next-found: true, next-height: (get from e) })
      ctx)))

(define-private (resolve (obj uint))
  (fold resolve-step
    (default-to (list) (map-get? Timeline obj))
    { now: burn-block-height,
      found: false, active-seq: u0, active-height: u0,
      next-found: false, next-height: u0 }))

;; ---------------------------------------------------------------------------
;; Paged reads

(define-constant IDX16 (list u0 u1 u2 u3 u4 u5 u6 u7 u8 u9 u10 u11 u12 u13 u14 u15))
(define-private (rep16 (x uint)) (list x x x x x x x x x x x x x x x x))

(define-private (object-at (space uint) (idx uint))
  (match (map-get? SpaceObjects { space: space, idx: idx })
    oid (some { id: oid, object: (map-get? Objects oid) })
    none))

(define-private (child-at (parent uint) (idx uint))
  (match (map-get? Children { parent: parent, idx: idx })
    cid (some { id: cid, space: (map-get? Spaces cid) })
    none))

(define-read-only (get-objects (space uint) (page uint))
  (map object-at (rep16 space) (map + IDX16 (rep16 (* page u16)))))

(define-read-only (get-children (parent uint) (page uint))
  (map child-at (rep16 parent) (map + IDX16 (rep16 (* page u16)))))

(define-private (path-step (slug (string-ascii 24)) (cur (optional uint)))
  (match cur c (map-get? Slugs { parent: c, slug: slug }) none))

(define-read-only (resolve-path (slugs (list 6 (string-ascii 24))))
  (fold path-step slugs (some ROOT)))

(define-read-only (get-object (id uint)) (map-get? Objects id))
(define-read-only (get-kind (id uint)) (map-get? Kinds id))
(define-read-only (get-kinds (ids (list 20 uint))) (map get-kind ids))
(define-read-only (get-kind-count) (var-get kind-count))
(define-read-only (get-state-count (obj uint)) (default-to u0 (map-get? StateCount obj)))
(define-read-only (get-state (obj uint) (seq uint)) (map-get? States { obj: obj, seq: seq }))
(define-read-only (get-timeline (obj uint)) (default-to (list) (map-get? Timeline obj)))
(define-read-only (get-consent (to uint) (from uint)) (map-get? Consents { to: to, from: from }))

;; The object as the hall needs it: the state showing now (none = the object's own
;; params) and the height of the next scheduled change, so the hall can animate it.
(define-read-only (get-object-view (id uint))
  (match (map-get? Objects id)
    o (let ((v (resolve id)))
        (some {
          id: id, object: o,
          active-seq: (if (get found v) (some (get active-seq v)) none),
          active: (if (get found v) (map-get? States { obj: id, seq: (get active-seq v) }) none),
          next-height: (if (get next-found v) (some (get next-height v)) none),
          height: burn-block-height }))
    none))

;; ---------------------------------------------------------------------------
;; Reads (frozen at xws-1: add new reads as new functions, never change these)

(define-read-only (get-interface) "xws-1")
(define-read-only (get-version) (var-get version))
(define-read-only (get-height) burn-block-height)
(define-read-only (get-space (id uint))
  (match (map-get? Spaces id)
    s (some (if (is-eq id ROOT) (merge s { owner: (var-get root-owner) }) s))
    none))
(define-read-only (get-root) { owner: (var-get root-owner), pending: (var-get pending-root-owner),
  treasury: (var-get treasury), paused: (var-get paused) })
(define-read-only (get-admin (who principal)) (default-to u0 (map-get? Admins who)))
(define-read-only (is-approved (who principal)) (default-to false (map-get? Approved who)))
(define-read-only (get-fees)
  { active: (fees-now), pending: (var-get fees-pending), caps: { bps: MAX-BPS, flat: MAX-FLAT, delay: FEE-DELAY } })
(define-read-only (get-listing (id uint)) (map-get? Listings id))
(define-read-only (get-grant (space uint) (who principal)) (map-get? Grants { space: space, who: who }))
(define-read-only (get-successor) { successor: (var-get successor), locked: (var-get successor-locked) })
(define-read-only (is-open (space uint)) (open? space))
(define-read-only (is-writable (space uint)) (writable? space))
