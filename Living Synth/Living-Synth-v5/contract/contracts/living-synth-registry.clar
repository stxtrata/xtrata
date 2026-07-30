;; living-synth-registry
;; ---------------------------------------------------------------------------
;; One contract for the whole Living Synth mosaic, against xtrata-v3-2-3.
;;
;;   1. edition <-> Xtrata token id  (the 1,024 cells, mapped once at setup)
;;   2. STICKY REVEAL. A cell is revealed the first time its token leaves
;;      treasury custody, and stays revealed forever after. It may return to
;;      the treasury, be sold on, be sent anywhere: once lit, always lit.
;;      "Custody" is the set of every address that has ever been the treasury,
;;      not just the current one, so rotating the treasury cannot make the
;;      tokens still sitting in the old wallet look distributed.
;;   3. Owner-gated child recordings, with the fee, in one transaction.
;;   4. The entire 1,024-cell state in two read-only calls.
;;
;; WHY BITMAPS. "Has this ever left the treasury" is history, not current
;; state, so it cannot be read back off the chain later. It has to be latched
;; when it happens. Latching 1,024 flags as 1,024 map entries would cost the
;; mosaic 1,024 read-only calls to load. Instead each flag is one bit inside a
;; 128-bit uint, so the whole collection is 8 uints and ONE call returns it.
;;
;; Latching is bit-or, which cannot clear a bit. So "permanently revealed" is
;; a property of the arithmetic rather than a rule some future function has to
;; remember to respect.
;;
;; TWO WAYS IN. `transfer-and-reveal` is how the treasury distributes: the
;; transfer and the latch are the same transaction, so a reveal can never be
;; missed. `reveal` is permissionless catch-up for a token that left by some
;; other route (a marketplace sale), verified against live ownership by anyone
;; who cares, and the new owner always cares. The one gap: if a token leaves
;; and returns to the treasury before anybody calls `reveal`, that history is
;; gone. Distribute through `transfer-and-reveal` and the gap never opens.
;; ---------------------------------------------------------------------------

(define-constant MAX-EDITIONS u1024)
(define-constant BITS-PER-SLOT u128)
(define-constant PAGE-SIZE u32)
(define-constant RECORDING-MIME "application/json")
(define-constant MAX-RECORDING-BYTES u262144)
(define-constant MIN-FEE u0)
(define-constant MAX-FEE u100000000)              ;; 100 STX ceiling on any fee

(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-INVALID-EDITION (err u101))
(define-constant ERR-NOT-REGISTERED (err u102))
(define-constant ERR-EDITION-EXISTS (err u103))
(define-constant ERR-TOKEN-EXISTS (err u104))
(define-constant ERR-NOT-FOUND (err u105))
(define-constant ERR-NOT-TOKEN-OWNER (err u106))
(define-constant ERR-NOT-RECORDING-OWNER (err u107))
(define-constant ERR-NOT-CHILD (err u108))
(define-constant ERR-INVALID-MIME (err u109))
(define-constant ERR-INVALID-RECORDING (err u110))
(define-constant ERR-RECORDING-EXISTS (err u111))
(define-constant ERR-STILL-IN-TREASURY (err u112))
(define-constant ERR-ALREADY-REVEALED (err u113))
(define-constant ERR-CORE-LOCKED (err u114))
(define-constant ERR-CORE-NOT-SET (err u115))
(define-constant ERR-INVALID-CORE (err u116))
(define-constant ERR-PAUSED (err u117))
(define-constant ERR-INVALID-FEE (err u118))
(define-constant ERR-FEE-CHANGED (err u119))
(define-constant ERR-INVALID-PAGE (err u120))
(define-constant ERR-INVALID-BATCH (err u121))
(define-constant ERR-NO-PENDING-OWNER (err u122))
(define-constant ERR-SAME-TREASURY (err u123))

;; Only the four core readers/writers this contract needs. Declaring the error
;; type as uint matches the proven v2 gateway trait; the core's own readers
;; return (response T none), which conforms.
(define-trait xtrata-core-trait
  (
    (get-owner (uint) (response (optional principal) uint))
    (get-parents (uint) (response (list 50 uint) uint))
    (get-inscription-meta (uint)
      (response (optional {
        owner: principal,
        creator: principal,
        mime-type: (string-ascii 64),
        total-size: uint,
        total-chunks: uint,
        sealed: bool,
        final-hash: (buff 32)
      }) uint)
    )
    (transfer (uint principal principal) (response bool uint))
  )
)

(define-data-var contract-owner principal tx-sender)
(define-data-var pending-owner (optional principal) none)
(define-data-var core-contract (optional principal) none)
(define-data-var treasury principal tx-sender)
(define-data-var paused bool true)

(define-data-var child-fee uint u100000)          ;; 0.1 STX
(define-data-var live-set-fee uint u1000000)      ;; 1 STX
(define-data-var registered-editions uint u0)
(define-data-var revealed-count uint u0)
(define-data-var live-set-count uint u0)

(define-map EditionToToken uint uint)
(define-map TokenToEdition uint uint)

;; Every address that has ever been the treasury. Reveal means "this token has
;; left Jim's custody", so rotating the treasury must not make the tokens still
;; sitting in the OLD one look distributed. Checking the whole history rather
;; than just the current address is what makes rotation safe, which matters if
;; a treasury wallet is ever compromised mid-distribution.
(define-map PastTreasuries principal bool)

;; 8 slots x 128 bits = 1,024 flags. Slot 0 holds editions 1-128.
(define-map RevealBits uint uint)
(define-map ChildBits uint uint)                  ;; "this edition has a child"

(define-map ActiveChild uint uint)                ;; edition -> inscription id
(define-map ChildCount uint uint)                 ;; edition -> revisions so far
(define-map Children { edition: uint, seq: uint } uint)
(define-map ChildInfo uint {
  edition: uint, creator: principal, seq: uint, height: uint, content-hash: (buff 32)
})
(define-map LiveSets uint {
  creator: principal, recording-id: uint, height: uint, content-hash: (buff 32)
})

(define-constant PAGE-OFFSETS (list
  u0 u1 u2 u3 u4 u5 u6 u7 u8 u9 u10 u11 u12 u13 u14 u15
  u16 u17 u18 u19 u20 u21 u22 u23 u24 u25 u26 u27 u28 u29 u30 u31))

;; ---------------------------------------------------------------- guards ----

(define-private (assert-owner)
  (begin (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED) (ok true)))

(define-private (assert-not-paused)
  (begin (asserts! (not (var-get paused)) ERR-PAUSED) (ok true)))

;; The core is chosen once and then frozen, so it can never be swapped for a
;; contract that lies about ownership or parent links.
(define-private (assert-core (core <xtrata-core-trait>))
  (let ((locked (unwrap! (var-get core-contract) ERR-CORE-NOT-SET)))
    (begin (asserts! (is-eq (contract-of core) locked) ERR-INVALID-CORE) (ok true))))

(define-private (valid-edition (edition uint))
  (and (> edition u0) (<= edition MAX-EDITIONS)))

;; In treasury custody: the address in use now, or any address that ever was.
(define-private (in-custody (who principal))
  (or (is-eq who (var-get treasury)) (default-to false (map-get? PastTreasuries who))))

(define-private (read-owner (core <xtrata-core-trait>) (token-id uint))
  (ok (unwrap! (try! (contract-call? core get-owner token-id)) ERR-NOT-FOUND)))

;; ------------------------------------------------------------- bitmaps -----

(define-private (slot-of (edition uint)) (/ (- edition u1) BITS-PER-SLOT))
(define-private (mask-of (edition uint)) (bit-shift-left u1 (mod (- edition u1) BITS-PER-SLOT)))

(define-private (bit-set? (bits uint) (edition uint))
  (> (bit-and bits (mask-of edition)) u0))

(define-read-only (is-revealed (edition uint))
  (if (valid-edition edition)
    (bit-set? (default-to u0 (map-get? RevealBits (slot-of edition))) edition)
    false))

(define-read-only (has-child (edition uint))
  (if (valid-edition edition)
    (bit-set? (default-to u0 (map-get? ChildBits (slot-of edition))) edition)
    false))

;; bit-or only ever adds a bit. A revealed edition cannot become unrevealed.
(define-private (latch-reveal (edition uint))
  (let ((slot (slot-of edition)))
    (begin
      (map-set RevealBits slot (bit-or (default-to u0 (map-get? RevealBits slot)) (mask-of edition)))
      (var-set revealed-count (+ (var-get revealed-count) u1))
      true)))

(define-private (latch-child (edition uint))
  (let ((slot (slot-of edition)))
    (begin
      (map-set ChildBits slot (bit-or (default-to u0 (map-get? ChildBits slot)) (mask-of edition)))
      true)))

;; ------------------------------------------------------------ setup ops ----

(define-public (lock-core-contract (core <xtrata-core-trait>))
  (begin
    (try! (assert-owner))
    (asserts! (is-none (var-get core-contract)) ERR-CORE-LOCKED)
    (var-set core-contract (some (contract-of core)))
    (print { event: "core-locked", core: (contract-of core) })
    (ok true)))

;; Rotating the treasury retires the old address into PastTreasuries rather than
;; forgetting it, so tokens still held there stay unrevealed.
(define-public (set-treasury (who principal))
  (let ((previous (var-get treasury)))
    (begin
      (try! (assert-owner))
      (asserts! (not (is-eq who previous)) ERR-SAME-TREASURY)
      (map-set PastTreasuries previous true)
      (var-set treasury who)
      (print { event: "treasury-rotated", from: previous, to: who })
      (ok true))))

(define-public (set-paused (value bool))
  (begin (try! (assert-owner)) (var-set paused value) (ok true)))

(define-public (set-child-fee (amount uint))
  (begin
    (try! (assert-owner))
    (asserts! (and (>= amount MIN-FEE) (<= amount MAX-FEE)) ERR-INVALID-FEE)
    (var-set child-fee amount)
    (ok true)))

(define-public (set-live-set-fee (amount uint))
  (begin
    (try! (assert-owner))
    (asserts! (and (>= amount MIN-FEE) (<= amount MAX-FEE)) ERR-INVALID-FEE)
    (var-set live-set-fee amount)
    (ok true)))

(define-public (initiate-contract-ownership-transfer (new-owner principal))
  (begin (try! (assert-owner)) (var-set pending-owner (some new-owner)) (ok true)))

(define-public (cancel-contract-ownership-transfer)
  (begin (try! (assert-owner)) (var-set pending-owner none) (ok true)))

(define-public (accept-contract-ownership)
  (let ((pending (unwrap! (var-get pending-owner) ERR-NO-PENDING-OWNER)))
    (begin
      (asserts! (is-eq tx-sender pending) ERR-NOT-AUTHORIZED)
      (var-set contract-owner pending)
      (var-set pending-owner none)
      (print { event: "ownership-transferred", owner: pending })
      (ok true))))

;; Map an edition to the Xtrata token that carries it. map-insert refuses a
;; second write, so a duplicate anywhere aborts the whole batch atomically and
;; no edition can ever be repointed at a different token.
(define-private (register-edition-entry
  (entry { edition: uint, token-id: uint })
  (acc (response uint uint))
)
  (let ((count (try! acc))
        (edition (get edition entry))
        (token-id (get token-id entry)))
    (begin
      (asserts! (valid-edition edition) ERR-INVALID-EDITION)
      (asserts! (map-insert EditionToToken edition token-id) ERR-EDITION-EXISTS)
      (asserts! (map-insert TokenToEdition token-id edition) ERR-TOKEN-EXISTS)
      (ok (+ count u1)))))

(define-public (register-edition-batch (entries (list 50 { edition: uint, token-id: uint })))
  (begin
    (try! (assert-owner))
    (asserts! (> (len entries) u0) ERR-INVALID-BATCH)
    (let ((added (try! (fold register-edition-entry entries (ok u0)))))
      (begin
        (var-set registered-editions (+ (var-get registered-editions) added))
        (print { event: "editions-registered", added: added, total: (var-get registered-editions) })
        (ok added)))))

;; ---------------------------------------------------------------- reveal ----

;; Distribute and latch in one transaction. tx-sender stays the treasury for
;; the inner call, so the core's own ownership check is what authorises the
;; transfer; this contract holds nothing and needs no approval.
(define-public (transfer-and-reveal (core <xtrata-core-trait>) (edition uint) (recipient principal))
  (begin
    (try! (assert-core core))
    (try! (assert-not-paused))
    (asserts! (is-eq tx-sender (var-get treasury)) ERR-NOT-AUTHORIZED)
    (asserts! (not (in-custody recipient)) ERR-STILL-IN-TREASURY)
    (let ((token-id (unwrap! (map-get? EditionToToken edition) ERR-NOT-REGISTERED)))
      (begin
        (try! (contract-call? core transfer token-id tx-sender recipient))
        (if (is-revealed edition)
          true
          (latch-reveal edition))
        (print { event: "revealed", edition: edition, token-id: token-id,
                 owner: recipient, via: "transfer" })
        (ok true)))))

;; Permissionless catch-up for a token that left the treasury some other way.
;; Verified against live ownership, so it cannot be used to light a cell that
;; is still held. Returns false when the cell was already lit.
(define-public (reveal (core <xtrata-core-trait>) (edition uint))
  (begin
    (try! (assert-core core))
    (let ((token-id (unwrap! (map-get? EditionToToken edition) ERR-NOT-REGISTERED)))
      (if (is-revealed edition)
        (ok false)
        (let ((owner (try! (read-owner core token-id))))
          (begin
            (asserts! (not (in-custody owner)) ERR-STILL-IN-TREASURY)
            (latch-reveal edition)
            (print { event: "revealed", edition: edition, token-id: token-id,
                     owner: owner, via: "catch-up" })
            (ok true)))))))

;; ------------------------------------------------------- child recordings ---

;; A child must be a sealed JSON inscription, owned by the caller, carrying
;; this edition's token in its immutable Xtrata parent list, and the caller
;; must still own the edition. The newest child becomes the mosaic default;
;; every earlier one stays indexed and playable.
(define-public (register-child
  (core <xtrata-core-trait>)
  (edition uint)
  (recording-id uint)
  (expected-fee uint)
)
  (begin
    (try! (assert-core core))
    (try! (assert-not-paused))
    (let (
      (token-id (unwrap! (map-get? EditionToToken edition) ERR-NOT-REGISTERED))
      (meta (unwrap! (try! (contract-call? core get-inscription-meta recording-id)) ERR-NOT-FOUND))
      (seq (+ (default-to u0 (map-get? ChildCount edition)) u1))
      (fee (var-get child-fee))
    )
      (begin
        (asserts! (is-eq expected-fee fee) ERR-FEE-CHANGED)
        (asserts! (is-eq (try! (read-owner core token-id)) tx-sender) ERR-NOT-TOKEN-OWNER)
        (asserts! (is-eq (get owner meta) tx-sender) ERR-NOT-RECORDING-OWNER)
        (asserts! (is-eq (get mime-type meta) RECORDING-MIME) ERR-INVALID-MIME)
        (asserts! (and (get sealed meta)
                       (> (get total-size meta) u0)
                       (<= (get total-size meta) MAX-RECORDING-BYTES)) ERR-INVALID-RECORDING)
        (asserts! (is-some (index-of (try! (contract-call? core get-parents recording-id)) token-id))
                  ERR-NOT-CHILD)
        (asserts! (is-none (map-get? ChildInfo recording-id)) ERR-RECORDING-EXISTS)
        (if (> fee u0)
          (try! (stx-transfer? fee tx-sender (var-get treasury)))
          true)
        (map-set Children { edition: edition, seq: seq } recording-id)
        (map-set ChildCount edition seq)
        (map-set ActiveChild edition recording-id)
        (map-set ChildInfo recording-id {
          edition: edition, creator: tx-sender, seq: seq,
          height: stacks-block-height, content-hash: (get final-hash meta)
        })
        (latch-child edition)
        (print { event: "child-registered", edition: edition, token-id: token-id,
                 recording-id: recording-id, seq: seq, creator: tx-sender,
                 content-hash: (get final-hash meta), fee: fee })
        (ok recording-id)))))

;; A live set belongs to the whole mosaic rather than one cell, so it needs no
;; parent and no edition ownership. It still has to be a sealed JSON
;; inscription owned by the caller.
(define-public (register-live-set
  (core <xtrata-core-trait>)
  (recording-id uint)
  (expected-fee uint)
)
  (begin
    (try! (assert-core core))
    (try! (assert-not-paused))
    (let (
      (meta (unwrap! (try! (contract-call? core get-inscription-meta recording-id)) ERR-NOT-FOUND))
      (id (+ (var-get live-set-count) u1))
      (fee (var-get live-set-fee))
    )
      (begin
        (asserts! (is-eq expected-fee fee) ERR-FEE-CHANGED)
        (asserts! (is-eq (get owner meta) tx-sender) ERR-NOT-RECORDING-OWNER)
        (asserts! (is-eq (get mime-type meta) RECORDING-MIME) ERR-INVALID-MIME)
        (asserts! (and (get sealed meta)
                       (> (get total-size meta) u0)
                       (<= (get total-size meta) MAX-RECORDING-BYTES)) ERR-INVALID-RECORDING)
        (asserts! (is-none (map-get? LiveSets id)) ERR-RECORDING-EXISTS)
        (if (> fee u0)
          (try! (stx-transfer? fee tx-sender (var-get treasury)))
          true)
        (map-set LiveSets id {
          creator: tx-sender, recording-id: recording-id,
          height: stacks-block-height, content-hash: (get final-hash meta)
        })
        (var-set live-set-count id)
        (print { event: "live-set-registered", id: id, recording-id: recording-id,
                 creator: tx-sender, content-hash: (get final-hash meta), fee: fee })
        (ok id)))))

;; ----------------------------------------------------------------- readers ---

;; ONE call returns the reveal state of all 1,024 cells. The mosaic reads slot
;; N bit M rather than asking 1,024 questions.
(define-read-only (get-reveal-bits)
  (list
    (default-to u0 (map-get? RevealBits u0)) (default-to u0 (map-get? RevealBits u1))
    (default-to u0 (map-get? RevealBits u2)) (default-to u0 (map-get? RevealBits u3))
    (default-to u0 (map-get? RevealBits u4)) (default-to u0 (map-get? RevealBits u5))
    (default-to u0 (map-get? RevealBits u6)) (default-to u0 (map-get? RevealBits u7))))

;; And ONE call says which cells have a child at all, so the mosaic only asks
;; for the children that exist instead of paging all 1,024.
(define-read-only (get-child-bits)
  (list
    (default-to u0 (map-get? ChildBits u0)) (default-to u0 (map-get? ChildBits u1))
    (default-to u0 (map-get? ChildBits u2)) (default-to u0 (map-get? ChildBits u3))
    (default-to u0 (map-get? ChildBits u4)) (default-to u0 (map-get? ChildBits u5))
    (default-to u0 (map-get? ChildBits u6)) (default-to u0 (map-get? ChildBits u7))))

(define-private (cell-of (edition uint))
  {
    edition: edition,
    token-id: (map-get? EditionToToken edition),
    revealed: (is-revealed edition),
    active-child: (map-get? ActiveChild edition),
    child-count: (default-to u0 (map-get? ChildCount edition))
  })

(define-private (append-cell (offset uint) (state {
  start: uint,
  cells: (list 32 { edition: uint, token-id: (optional uint), revealed: bool,
                    active-child: (optional uint), child-count: uint })
}))
  {
    start: (get start state),
    cells: (unwrap-panic (as-max-len?
      (append (get cells state) (cell-of (+ (get start state) offset))) u32))
  })

;; Full detail for 32 cells at a time, for tooling that wants everything.
(define-read-only (get-mosaic-page (page uint))
  (if (< page (/ MAX-EDITIONS PAGE-SIZE))
    (ok (get cells (fold append-cell PAGE-OFFSETS
          { start: (+ (* page PAGE-SIZE) u1), cells: (list) })))
    ERR-INVALID-PAGE))

(define-read-only (get-cell (edition uint))
  (if (valid-edition edition) (some (cell-of edition)) none))

(define-read-only (get-state)
  {
    contract-owner: (var-get contract-owner),
    pending-owner: (var-get pending-owner),
    core-contract: (var-get core-contract),
    treasury: (var-get treasury),
    paused: (var-get paused),
    child-fee: (var-get child-fee),
    live-set-fee: (var-get live-set-fee),
    registered-editions: (var-get registered-editions),
    revealed-count: (var-get revealed-count),
    live-set-count: (var-get live-set-count),
    max-editions: MAX-EDITIONS
  })

;; True while an address counts as treasury custody, current or retired.
(define-read-only (is-in-custody (who principal)) (in-custody who))
(define-read-only (was-treasury (who principal)) (default-to false (map-get? PastTreasuries who)))

(define-read-only (get-token-for-edition (edition uint)) (map-get? EditionToToken edition))
(define-read-only (get-edition-for-token (token-id uint)) (map-get? TokenToEdition token-id))
(define-read-only (get-active-child (edition uint)) (map-get? ActiveChild edition))
(define-read-only (get-child-count (edition uint)) (default-to u0 (map-get? ChildCount edition)))
(define-read-only (get-child-at (edition uint) (seq uint)) (map-get? Children { edition: edition, seq: seq }))
(define-read-only (get-child-info (recording-id uint)) (map-get? ChildInfo recording-id))
(define-read-only (get-live-set (id uint)) (map-get? LiveSets id))
(define-read-only (get-fees) { child: (var-get child-fee), liveSet: (var-get live-set-fee) })
