;; xtrata-screen-v1
;;
;; Messaging contract for the Arcade's centre screen (and later screens). Room-agnostic.
;;
;; - Items are short messages, news or ads (text, optional picture by inscription id + hash).
;;   The hall reads `get-version`, then `get-live` and `get-items`, and paints them.
;; - Append-only records: an item is retired or hidden, never edited. History stays readable.
;; - Bounded live set: at most 32 live ids, so the hall's load cost does not grow with history.
;;   Expired, hidden and retired items drop out when anything is added, or when anyone calls `prune`.
;; - Roles: admin; publishers (level 1) post free items within caps; reviewers (level 2) also
;;   approve, reject, hide and retire. Anyone reads.
;; - Review lane: when on, publisher items wait for approval and are not live until then.
;; - PAID SLOTS (off until the admin switches them on): a buyer pays price-per-day x days into
;;   escrow held by this contract and the item waits as `pending`. Approve releases the escrow to
;;   the fee recipient and starts the run; reject, cancel and sweep refund the buyer in full.
;;   Nothing but those paths can move escrow: there is no admin withdraw. Pause blocks buying and
;;   approving, never refunds or retiring.
;; - A paid item that is live and later hidden for abuse is NOT refunded on chain (its payment was
;;   released at approval); any goodwill refund is a manual admin payment.
;; - Successor pointer with a one-way lock; the read interface is frozen at v1.
;;
;; Kind values:   0 message, 1 news, 2 ad
;; Status values: 0 pending (awaiting review), 1 approved (live or scheduled), 2 closed
;; Closed reasons: 1 rejected, 2 cancelled, 3 swept (review window passed), 4 retired
;; Publisher levels: 1 publisher, 2 reviewer

(define-constant ERR-NOT-AUTHORIZED (err u400))
(define-constant ERR-PAUSED         (err u401))
(define-constant ERR-NOT-FOUND      (err u402))
(define-constant ERR-INVALID        (err u403))
(define-constant ERR-WINDOW         (err u404))
(define-constant ERR-INSCRIPTION    (err u405))
(define-constant ERR-CAP-LIVE       (err u406))
(define-constant ERR-SLOTS-OFF      (err u408))
(define-constant ERR-STATUS         (err u409))
(define-constant ERR-TOO-EARLY      (err u410))
(define-constant ERR-CAP-PENDING    (err u411))
(define-constant ERR-NO-PENDING     (err u412))
(define-constant ERR-LOCKED         (err u413))
(define-constant ERR-PRICE          (err u414))

(define-constant DAY-BLOCKS u144)
(define-constant MAX-LIVE u32)
(define-constant MAX-IMAGE-BYTES u131072)
(define-constant MAX-SPAN u52560)               ;; one year of burn blocks
(define-constant MAX-PRICE-PER-DAY u1000000000) ;; 1000 STX
(define-constant MAX-DAYS-LIMIT u90)
(define-constant MAX-PAID-LIVE-LIMIT u16)
(define-constant MAX-PENDING-LIMIT u8)
(define-constant MIN-REVIEW-WINDOW u144)
(define-constant MAX-REVIEW-WINDOW u4320)

(define-data-var admin principal tx-sender)
(define-data-var pending-admin (optional principal) none)
(define-data-var paused bool false)
(define-data-var version uint u0)
;; Sum of the escrow of pending paid items. The balance can be higher (anyone can send STX here); it is never lower.
(define-data-var total-escrow uint u0)
(define-data-var count uint u0)
(define-data-var review-lane bool false)
(define-data-var successor (optional principal) none)
(define-data-var successor-locked bool false)
(define-data-var live (list 32 uint) (list))

;; paid-slot settings (slots are off until the admin switches them on)
(define-data-var slots-enabled bool false)
(define-data-var prices { message: uint, news: uint, ad: uint } { message: u2000000, news: u5000000, ad: u10000000 })
(define-data-var min-days uint u1)
(define-data-var max-days uint u14)
(define-data-var max-paid-live uint u8)
(define-data-var max-pending-per-buyer uint u2)
(define-data-var review-window uint u432)
(define-data-var fee-recipient principal tx-sender)

;; free-post caps
(define-data-var kind-caps { message: uint, news: uint, ad: uint } { message: u16, news: u12, ad: u8 })
(define-data-var cap-live-per-publisher uint u8)

;; scratch values used by filter helpers (always set just before use)
(define-data-var scratch-kind uint u0)
(define-data-var scratch-who principal tx-sender)
(define-data-var scratch-id uint u0)

(define-map Publishers principal uint)
(define-map PendingCount principal uint)

(define-map Items uint
  {
    kind: uint,
    head: (string-ascii 80),
    body: (string-ascii 240),
    image-id: uint,
    image-hash: (buff 32),
    image-size: uint,
    weight: uint,
    publisher: principal,
    paid: bool,
    buyer: (optional principal),
    days: uint,
    price: uint,
    escrow: uint,
    status: uint,
    hidden: bool,
    starts-at: uint,
    ends-at: uint,
    added-at: uint,
    closed-reason: uint
  })

;; ---------------------------------------------------------------------------
;; Helpers

(define-private (caller-is (who principal))
  (and (is-eq tx-sender who) (is-eq contract-caller who)))

(define-private (is-admin) (caller-is (var-get admin)))

(define-private (level)
  (if (is-eq contract-caller tx-sender) (default-to u0 (map-get? Publishers tx-sender)) u0))

(define-private (is-reviewer) (or (is-admin) (>= (level) u2)))
(define-private (can-publish) (or (is-admin) (>= (level) u1)))

(define-private (umax (a uint) (b uint)) (if (> a b) a b))

(define-private (bump)
  (begin (var-set version (+ (var-get version) u1)) (var-get version)))

(define-private (note (event (string-ascii 24)) (id uint))
  (print { event: event, id: id, version: (bump) }))

(define-private (inscription-ok? (id uint) (hash (buff 32)) (size uint) (who principal))
  (and
    (is-eq (contract-call? .xtrata-v3-2-3 inscription-exists id) (ok true)) ;; @principal core
    (is-eq (contract-call? .xtrata-v3-2-3 is-inscription-sealed id) (some true)) ;; @principal core
    (is-eq (contract-call? .xtrata-v3-2-3 get-inscription-hash id) (some hash)) ;; @principal core
    (is-eq (contract-call? .xtrata-v3-2-3 get-inscription-size id) (some size)) ;; @principal core
    (is-eq (contract-call? .xtrata-v3-2-3 get-inscription-creator id) (some who)) ;; @principal core
  ))

;; No picture: size 0, id 0 and an empty hash. Otherwise a sealed inscription of the stated size,
;; made by `who`, within the size cap.
(define-private (image-valid? (id uint) (hash (buff 32)) (size uint) (who principal))
  (if (is-eq size u0)
    (and (is-eq id u0) (is-eq (len hash) u0))
    (and (<= size MAX-IMAGE-BYTES) (inscription-ok? id hash size who))))

(define-private (price-of (kind uint))
  (let ((p (var-get prices)))
    (if (is-eq kind u0) (get message p) (if (is-eq kind u1) (get news p) (if (is-eq kind u2) (get ad p) u0)))))

(define-private (cap-of (kind uint))
  (let ((c (var-get kind-caps)))
    (if (is-eq kind u0) (get message c) (if (is-eq kind u1) (get news c) (get ad c)))))

(define-private (alive? (id uint))
  (match (map-get? Items id)
    it (and (is-eq (get status it) u1) (not (get hidden it)) (> (get ends-at it) burn-block-height))
    false))

(define-private (prune) (var-set live (filter alive? (var-get live))))

(define-private (is-kind? (id uint))
  (match (map-get? Items id) it (is-eq (get kind it) (var-get scratch-kind)) false))
(define-private (is-paid? (id uint))
  (match (map-get? Items id) it (get paid it) false))
;; counts against a publisher's own live cap: their free items only (a bought slot is the buyer's money, not a post)
(define-private (is-who-free? (id uint))
  (match (map-get? Items id) it (and (not (get paid it)) (is-eq (get publisher it) (var-get scratch-who))) false))
(define-private (not-id? (id uint)) (not (is-eq id (var-get scratch-id))))

;; Put an approved item into the live set, enforcing the caps. Prunes first.
(define-private (add-live (id uint))
  (let ((it (unwrap! (map-get? Items id) ERR-NOT-FOUND)))
    (var-set scratch-id id)
    (var-set live (filter not-id? (var-get live)))
    (prune)
    (var-set scratch-kind (get kind it))
    (var-set scratch-who (get publisher it))
    (asserts! (< (len (var-get live)) MAX-LIVE) ERR-CAP-LIVE)
    (asserts! (< (len (filter is-kind? (var-get live))) (cap-of (get kind it))) ERR-CAP-LIVE)
    (if (get paid it)
      (asserts! (< (len (filter is-paid? (var-get live))) (var-get max-paid-live)) ERR-CAP-LIVE)
      (if (is-eq (get publisher it) (var-get admin))
        true
        (asserts! (< (len (filter is-who-free? (var-get live))) (var-get cap-live-per-publisher)) ERR-CAP-LIVE)))
    (var-set live (unwrap! (as-max-len? (append (var-get live) id) u32) ERR-CAP-LIVE))
    (ok true)))

;; Sends escrow out of the contract. The only places this is called are approve (to the fee
;; recipient) and the refund paths (to the buyer).
(define-private (pay-out (amount uint) (to principal))
  (if (> amount u0)
    (begin
      (var-set total-escrow (- (var-get total-escrow) amount))
      (as-contract? ((with-stx amount)) (try! (stx-transfer? amount tx-sender to))))
    (ok true)))

;; Is there room for one more item of this kind (and one more paid item) right now? A read-only look used at
;; purchase time so nobody pays for a slot that cannot go live. approve stays the final check.
(define-private (has-room? (kind uint))
  (let ((l (filter alive? (var-get live))))
    (var-set scratch-kind kind)
    (and (< (len l) MAX-LIVE)
         (< (len (filter is-kind? l)) (cap-of kind))
         (< (len (filter is-paid? l)) (var-get max-paid-live)))))

(define-private (dec-pending (who principal))
  (let ((n (default-to u0 (map-get? PendingCount who))))
    (if (> n u0) (map-set PendingCount who (- n u1)) false)))

;; ---------------------------------------------------------------------------
;; Free posting (admin, publishers)

(define-public (post-item
  (kind uint) (head (string-ascii 80)) (body (string-ascii 240))
  (image-id uint) (image-hash (buff 32)) (image-size uint)
  (weight uint) (starts-at uint) (ends-at uint))
  (let (
    (id (var-get count))
    (admin? (is-admin))
    (from (umax starts-at burn-block-height))
    (status (if (and (not admin?) (var-get review-lane)) u0 u1)))
    (asserts! (not (var-get paused)) ERR-PAUSED)
    (asserts! (can-publish) ERR-NOT-AUTHORIZED)
    (asserts! (<= kind u2) ERR-INVALID)
    (asserts! (> (len head) u0) ERR-INVALID)
    (asserts! (and (>= weight u1) (<= weight u10)) ERR-INVALID)
    (asserts! (and (> ends-at from) (<= (- ends-at from) MAX-SPAN)) ERR-WINDOW)
    (asserts! (image-valid? image-id image-hash image-size tx-sender) ERR-INSCRIPTION)
    (map-set Items id {
      kind: kind, head: head, body: body,
      image-id: image-id, image-hash: image-hash, image-size: image-size,
      weight: weight, publisher: tx-sender, paid: false, buyer: none, days: u0, price: u0, escrow: u0,
      status: status, hidden: false, starts-at: from, ends-at: ends-at,
      added-at: burn-block-height, closed-reason: u0 })
    (var-set count (+ id u1))
    (if (is-eq status u1) (try! (add-live id)) true)
    (note "item-posted" id)
    (ok id)))

;; Retire an item: the admin, a reviewer, or the publisher of a free item. Works while paused.
(define-public (retire (id uint))
  (let ((it (unwrap! (map-get? Items id) ERR-NOT-FOUND)))
    (asserts! (< (get status it) u2) ERR-STATUS)
    (asserts! (or (is-reviewer)
                  (and (not (get paid it)) (caller-is (get publisher it))))
              ERR-NOT-AUTHORIZED)
    ;; a pending paid item is refunded through reject/cancel, not retired
    (asserts! (not (and (is-eq (get status it) u0) (> (get escrow it) u0))) ERR-STATUS)
    (map-set Items id (merge it { status: u2, closed-reason: u4 }))
    (var-set scratch-id id)
    (var-set live (filter not-id? (var-get live)))
    (note "item-retired" id)
    (ok true)))

;; Hide or unhide an item (admin or reviewer). Unhiding puts it back in the live set if it is still running.
(define-public (set-hidden (id uint) (hidden bool))
  (let ((it (unwrap! (map-get? Items id) ERR-NOT-FOUND)))
    (asserts! (is-reviewer) ERR-NOT-AUTHORIZED)
    (asserts! (is-eq (get status it) u1) ERR-STATUS)
    (map-set Items id (merge it { hidden: hidden }))
    (if hidden
      (begin (var-set scratch-id id) (var-set live (filter not-id? (var-get live))))
      (begin
        ;; unhiding while paused would leave the item running but missing from the live set
        (asserts! (not (var-get paused)) ERR-PAUSED)
        (if (> (get ends-at it) burn-block-height) (try! (add-live id)) true)))
    (note "item-hidden" id)
    (ok true)))

;; Anyone can drop expired, hidden and retired ids from the live set (costs only the fee).
(define-public (prune-live)
  (let ((before (len (var-get live))))
    (prune)
    ;; the version only moves when something was dropped, so nobody can force every hall to re-read for free
    (if (< (len (var-get live)) before) (note "pruned" u0) (print { event: "pruned", id: u0, version: (var-get version) }))
    (ok (len (var-get live)))))

;; ---------------------------------------------------------------------------
;; Paid slots

(define-public (buy-slot
  (kind uint) (head (string-ascii 80)) (body (string-ascii 240))
  (image-id uint) (image-hash (buff 32)) (image-size uint) (days uint))
  (let (
    (buyer tx-sender)
    (id (var-get count))
    (price (if (and (>= days (var-get min-days)) (<= days (var-get max-days))) (* (price-of kind) days) u0))
    (pend (default-to u0 (map-get? PendingCount tx-sender))))
    (asserts! (not (var-get paused)) ERR-PAUSED)
    (asserts! (var-get slots-enabled) ERR-SLOTS-OFF)
    (asserts! (is-eq contract-caller tx-sender) ERR-NOT-AUTHORIZED)
    (asserts! (<= kind u2) ERR-INVALID)
    (asserts! (> (len head) u0) ERR-INVALID)
    (asserts! (and (>= days (var-get min-days)) (<= days (var-get max-days))) ERR-WINDOW)
    (asserts! (> price u0) ERR-PRICE)
    (asserts! (< pend (var-get max-pending-per-buyer)) ERR-CAP-PENDING)
    (asserts! (image-valid? image-id image-hash image-size buyer) ERR-INSCRIPTION)
    (asserts! (has-room? kind) ERR-CAP-LIVE)
    (try! (stx-transfer? price buyer current-contract))
    (var-set total-escrow (+ (var-get total-escrow) price))
    (map-set Items id {
      kind: kind, head: head, body: body,
      image-id: image-id, image-hash: image-hash, image-size: image-size,
      weight: u1, publisher: buyer, paid: true, buyer: (some buyer), days: days, price: price, escrow: price,
      status: u0, hidden: false, starts-at: u0, ends-at: u0,
      added-at: burn-block-height, closed-reason: u0 })
    (map-set PendingCount buyer (+ pend u1))
    (var-set count (+ id u1))
    (print { event: "slot-bought", id: id, buyer: buyer, kind: kind, days: days, price: price, version: (bump) })
    (ok id)))

;; Approve a pending item (admin or reviewer). A paid item's escrow goes to the fee recipient and
;; its run starts now; a free item from the review lane goes live in its own window.
(define-public (approve (id uint))
  (let (
    (it (unwrap! (map-get? Items id) ERR-NOT-FOUND))
    (now burn-block-height))
    (asserts! (not (var-get paused)) ERR-PAUSED)
    (asserts! (is-reviewer) ERR-NOT-AUTHORIZED)
    (asserts! (is-eq (get status it) u0) ERR-STATUS)
    (if (get paid it)
      (let ((ends (+ now (* (get days it) DAY-BLOCKS))))
        ;; a stale request waits no longer than the review window; sweep refunds it
        (asserts! (<= (- now (get added-at it)) (var-get review-window)) ERR-WINDOW)
        (map-set Items id (merge it { status: u1, starts-at: now, ends-at: ends, escrow: u0 }))
        (try! (add-live id))
        (try! (pay-out (get escrow it) (var-get fee-recipient)))
        (match (get buyer it) b (dec-pending b) false)
        true)
      (begin
        (asserts! (> (get ends-at it) now) ERR-WINDOW)
        (map-set Items id (merge it { status: u1 }))
        (try! (add-live id))
        true))
    (note "item-approved" id)
    (ok true)))

;; Reject a pending item (admin or reviewer): a paid item's escrow goes back to the buyer. Works while paused.
(define-public (reject (id uint) (reason uint))
  (let ((it (unwrap! (map-get? Items id) ERR-NOT-FOUND)))
    (asserts! (is-reviewer) ERR-NOT-AUTHORIZED)
    (asserts! (is-eq (get status it) u0) ERR-STATUS)
    (map-set Items id (merge it { status: u2, closed-reason: u1, escrow: u0 }))
    (match (get buyer it) b (dec-pending b) false)
    (try! (pay-out (get escrow it) (default-to tx-sender (get buyer it))))
    (print { event: "item-rejected", id: id, reason: reason, version: (bump) })
    (ok true)))

;; The buyer takes a pending item back and is refunded in full. Works while paused.
(define-public (cancel (id uint))
  (let (
    (it (unwrap! (map-get? Items id) ERR-NOT-FOUND))
    (b (unwrap! (get buyer it) ERR-NOT-AUTHORIZED)))
    (asserts! (caller-is b) ERR-NOT-AUTHORIZED)
    (asserts! (is-eq (get status it) u0) ERR-STATUS)
    (map-set Items id (merge it { status: u2, closed-reason: u2, escrow: u0 }))
    (dec-pending b)
    (try! (pay-out (get escrow it) b))
    (note "item-cancelled" id)
    (ok true)))

;; Once the review window has passed, anyone can send a pending paid item's escrow back to its buyer.
(define-public (sweep (id uint))
  (let (
    (it (unwrap! (map-get? Items id) ERR-NOT-FOUND))
    (b (unwrap! (get buyer it) ERR-NOT-FOUND)))
    (asserts! (is-eq (get status it) u0) ERR-STATUS)
    (asserts! (> (- burn-block-height (get added-at it)) (var-get review-window)) ERR-TOO-EARLY)
    (map-set Items id (merge it { status: u2, closed-reason: u3, escrow: u0 }))
    (dec-pending b)
    (try! (pay-out (get escrow it) b))
    (note "item-swept" id)
    (ok true)))

;; ---------------------------------------------------------------------------
;; Admin

(define-public (set-publisher (who principal) (lvl uint))
  (begin
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (asserts! (<= lvl u2) ERR-INVALID)
    (if (is-eq lvl u0) (map-delete Publishers who) (map-set Publishers who lvl))
    (print { event: "publisher-set", who: who, level: lvl, version: (bump) })
    (ok true)))

(define-public (set-review-lane (on bool))
  (begin
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (var-set review-lane on)
    (note "review-lane" (if on u1 u0))
    (ok true)))

(define-public (set-slots-enabled (on bool))
  (begin
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (var-set slots-enabled on)
    (note "slots-enabled" (if on u1 u0))
    (ok true)))

(define-public (set-prices (message uint) (news uint) (ad uint))
  (begin
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (asserts! (and (<= message MAX-PRICE-PER-DAY) (<= news MAX-PRICE-PER-DAY) (<= ad MAX-PRICE-PER-DAY)) ERR-INVALID)
    (var-set prices { message: message, news: news, ad: ad })
    (note "prices" u0)
    (ok true)))

(define-public (set-limits (min-d uint) (max-d uint) (paid-live uint) (pending uint) (window uint))
  (begin
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (asserts! (and (>= min-d u1) (<= min-d max-d) (<= max-d MAX-DAYS-LIMIT)) ERR-INVALID)
    (asserts! (and (>= paid-live u1) (<= paid-live MAX-PAID-LIVE-LIMIT)) ERR-INVALID)
    (asserts! (and (>= pending u1) (<= pending MAX-PENDING-LIMIT)) ERR-INVALID)
    (asserts! (and (>= window MIN-REVIEW-WINDOW) (<= window MAX-REVIEW-WINDOW)) ERR-INVALID)
    (var-set min-days min-d)
    (var-set max-days max-d)
    (var-set max-paid-live paid-live)
    (var-set max-pending-per-buyer pending)
    (var-set review-window window)
    (note "limits" u0)
    (ok true)))

(define-public (set-caps (message uint) (news uint) (ad uint) (per-publisher uint))
  (begin
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (asserts! (and (<= message MAX-LIVE) (<= news MAX-LIVE) (<= ad MAX-LIVE) (<= per-publisher MAX-LIVE)) ERR-INVALID)
    (var-set kind-caps { message: message, news: news, ad: ad })
    (var-set cap-live-per-publisher per-publisher)
    (note "caps" u0)
    (ok true)))

;; Escrow released at approval goes to whoever is the recipient at that moment.
(define-public (set-fee-recipient (who principal))
  (begin
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (asserts! (not (is-eq who current-contract)) ERR-INVALID)   ;; a transfer to itself would make every paid approval fail
    (var-set fee-recipient who)
    (print { event: "fee-recipient", who: who, version: (bump) })
    (ok true)))

(define-public (set-paused (value bool))
  (begin
    (asserts! (is-admin) ERR-NOT-AUTHORIZED)
    (var-set paused value)
    (note "paused" (if value u1 u0))
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
;; Reads (frozen at v1: add new reads as new functions, never change these)

(define-read-only (get-version) (var-get version))
(define-read-only (get-count) (var-get count))
(define-read-only (get-admin) (var-get admin))
(define-read-only (get-item (id uint)) (map-get? Items id))
(define-read-only (get-items (ids (list 10 uint))) (map get-item ids))
(define-read-only (get-live) (var-get live))
(define-read-only (get-publisher (who principal)) (default-to u0 (map-get? Publishers who)))
(define-read-only (get-pending-count (who principal)) (default-to u0 (map-get? PendingCount who)))
(define-read-only (is-paused) (var-get paused))
(define-read-only (get-successor) { successor: (var-get successor), locked: (var-get successor-locked) })
(define-read-only (get-height) burn-block-height)
(define-read-only (get-config)
  {
    paused: (var-get paused), review-lane: (var-get review-lane), slots-enabled: (var-get slots-enabled),
    prices: (var-get prices), min-days: (var-get min-days), max-days: (var-get max-days),
    max-paid-live: (var-get max-paid-live), max-pending-per-buyer: (var-get max-pending-per-buyer),
    review-window: (var-get review-window), fee-recipient: (var-get fee-recipient),
    kind-caps: (var-get kind-caps), cap-live-per-publisher: (var-get cap-live-per-publisher),
    pending-admin: (var-get pending-admin)
  })
(define-read-only (get-escrow-total) (var-get total-escrow))
;; STX held that belongs to no item (gifts sent straight to the contract). It cannot be withdrawn.
(define-read-only (get-unaccounted) (- (stx-get-balance current-contract) (var-get total-escrow)))
