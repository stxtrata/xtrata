;; forever-twin-helper-v2 :: bitcoin-monkeys :: group G1
;; ---------------------------------------------------------------------------
;; STATUS: REFERENCE PROTOTYPE for docs/forever-twins-v2-spec.md (FT-SPEC-2).
;; Passes the simnet acceptance suite in forever-twins/ft-harness. NOT audited.
;; NOT authorised for deployment. Rendered by scripts/render-helper.mjs.
;;
;; Standard route only (compatibility profile FT-CP-1, tier S): the source must
;; expose SIP-009-shaped `transfer` that requires the current owner as tx-sender,
;; a READ-ONLY `get-owner`, and no function that can move a token out of this
;; contract without this contract signing. Adapters are separate contracts.
;;
;; Groups (docs: forever-twins/Forever-Twins-Collection-Families.md):
;;   G1  plain owner transfer, no in-contract market            -> base template
;;   G2  source has its own listing market (list/buy-in-ustx)   -> base + listing
;;       guard: a deposit is refused unless the source reports NO listing both
;;       before and after the transfer, so no listing can ever exist on a token
;;       this contract holds, even if a family member's transfer failed to
;;       refuse or clear listings (fail-closed; test F-L4).
;;
;; Guarantees this contract is designed to provide (spec section 7.1):
;;   G1 one binding per original, one original per twin, bindings immutable
;;   G2 the twin bytes, mime, size and token-uri are fixed by the finalised
;;      canonical record; a sponsor supplies only the chunks
;;   G3 nobody can inscribe before the canonical record is finalised
;;   G4 funding confers no rights; redemption follows the circulating token
;;   G5 every swap checks ACTUAL ownership in both contracts, before and after
;;   G6 the admin can never pause, block or redirect a swap, and can move a
;;      held token only via the constrained, time-locked rescue path
;; ---------------------------------------------------------------------------

(define-constant ERR-NO-SUCH-TOKEN (err u200))
(define-constant ERR-ALREADY-INSCRIBED (err u201))
(define-constant ERR-NOT-INSCRIBED (err u202))
(define-constant ERR-WRONG-STATE (err u203))
(define-constant ERR-NOT-AUTHORIZED (err u204))
(define-constant ERR-NOT-CANONICAL (err u206))
(define-constant ERR-FINALIZED (err u207))
(define-constant ERR-NOT-FINALIZED (err u208))
(define-constant ERR-COUNT-MISMATCH (err u209))
(define-constant ERR-CUSTODY (err u210))
(define-constant ERR-PAUSED (err u211))
(define-constant ERR-NO-RESCUE (err u212))
(define-constant ERR-TIMELOCK (err u213))
(define-constant ERR-FEE-CAP (err u214))
(define-constant ERR-BAD-CANONICAL (err u215))
(define-constant ERR-RESCUE-DISABLED (err u216))

(define-constant INTERFACE-VERSION u2)
(define-constant COLLECTION-KEY "bitcoin-monkeys")
(define-constant MASTER .xtrata-v3-2-3)
(define-constant SOURCE .bitcoin-monkeys)
(define-constant MAX-FEE u5000000)
(define-constant RESCUE-ENABLED true)
(define-constant RESCUE-DELAY u3)
(define-constant MAX-SINGLE-TX-BYTES u524288)

;; --- admin-settable, all bounded --------------------------------------------
(define-data-var contract-owner principal tx-sender)
(define-data-var inscribe-fee uint u0)
(define-data-var free-threshold uint u0)
(define-data-var fee-recipient principal tx-sender)
(define-data-var inscribe-paused bool false)

;; --- canonical record ----------------------------------------------------------
(define-data-var canonical-finalized bool false)
(define-data-var canonical-count uint u0)
(define-data-var manifest-hash (buff 32) 0x0000000000000000000000000000000000000000000000000000000000000000)
(define-map Canonical uint {
  content-hash: (buff 32),
  mime: (string-ascii 64),
  total-size: uint,
  token-uri: (string-ascii 256),
})

;; --- bindings (value tuple identical to v1 so the existing resolver works) -------
(define-data-var inscribed-count uint u0)
(define-map Bindings uint {
  xtrata-id: uint,
  content-hash: (buff 32),
  inscriber: principal,
  xtrata-escrowed: bool,
  at: uint,
})
(define-map TwinToOriginal uint uint)
(define-map Rescues uint { recipient: principal, side: (string-ascii 8), eligible-at: uint })

;; =============================================================================
;; internal
;; =============================================================================
(define-private (assert-owner)
  (ok (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)))

;; Literal principals (not the constants) are required here: the Clarity
;; read-only checker cannot resolve a constant-bound contract-call? target and
;; would reject get-custody-state / stray-side as "writing". Verified in simnet.
(define-private (source-owner (token-id uint))
  (unwrap-panic (contract-call? .bitcoin-monkeys get-owner token-id)))

(define-private (twin-owner (xtrata-id uint))
  (unwrap-panic (contract-call? .xtrata-v3-2-3 get-owner xtrata-id)))

(define-private (release-twin-to (id uint) (recipient principal))
  (as-contract? ((with-nft MASTER "xtrata-inscription" (list id)))
    (try! (contract-call? MASTER transfer id current-contract recipient))))

(define-private (release-original-to (id uint) (recipient principal))
  (as-contract? ((with-nft SOURCE "bitcoin-monkeys" (list id)))
    (try! (contract-call? SOURCE transfer id current-contract recipient))))

(define-private (fee-for-internal (payer principal))
  (if (< (var-get inscribed-count) (var-get free-threshold)) u0 (var-get inscribe-fee)))

(define-private (charge-fee (payer principal))
  (let ((fee (fee-for-internal payer)))
    (if (or (is-eq fee u0) (is-eq payer (var-get fee-recipient)))
      (ok true)
      (stx-transfer? fee payer (var-get fee-recipient)))))

;; =============================================================================
;; canonical record lifecycle (admin, before finalisation only)
;; =============================================================================
(define-private (seed-one
    (e { id: uint, content-hash: (buff 32), mime: (string-ascii 64), total-size: uint, token-uri: (string-ascii 256) })
    (acc { ok: bool, added: uint }))
  (let ((rec { content-hash: (get content-hash e), mime: (get mime e), total-size: (get total-size e), token-uri: (get token-uri e) }))
    (if (and (get ok acc)
             (> (get total-size e) u0)
             (<= (get total-size e) MAX-SINGLE-TX-BYTES)
             (> (len (get mime e)) u0)
             (> (len (get token-uri e)) u0))
      (if (map-insert Canonical (get id e) rec)
        (merge acc { added: (+ (get added acc) u1) })
        (begin (map-set Canonical (get id e) rec) acc))
      (merge acc { ok: false }))))

(define-public (seed-canonical
    (entries (list 100 { id: uint, content-hash: (buff 32), mime: (string-ascii 64), total-size: uint, token-uri: (string-ascii 256) })))
  (begin
    (try! (assert-owner))
    (asserts! (not (var-get canonical-finalized)) ERR-FINALIZED)
    (let ((r (fold seed-one entries { ok: true, added: u0 })))
      (asserts! (get ok r) ERR-BAD-CANONICAL)
      (var-set canonical-count (+ (var-get canonical-count) (get added r)))
      (ok (var-get canonical-count)))))

;; Finalisation is one-way. `manifest` is the sha256 of the published off-chain
;; manifest (spec 7.4); `expected-count` must equal the number of seeded ids so
;; a partially-seeded record cannot be finalised by mistake.
(define-public (finalize-canonical (manifest (buff 32)) (expected-count uint))
  (begin
    (try! (assert-owner))
    (asserts! (not (var-get canonical-finalized)) ERR-FINALIZED)
    (asserts! (is-eq expected-count (var-get canonical-count)) ERR-COUNT-MISMATCH)
    (var-set manifest-hash manifest)
    (var-set canonical-finalized true)
    (print { event: "canonical-finalized", collection: COLLECTION-KEY, manifest-hash: manifest, canonical-count: expected-count })
    (ok true)))

;; =============================================================================
;; inscribe: anyone may fund; the canonical record fixes everything but the chunks
;; =============================================================================
(define-public (inscribe (token-id uint) (chunks (list 32 (buff 16384))))
  (let (
      (c (unwrap! (map-get? Canonical token-id) ERR-NOT-CANONICAL))
      (orig-owner (unwrap! (source-owner token-id) ERR-NO-SUCH-TOKEN))
    )
    (asserts! (not (var-get inscribe-paused)) ERR-PAUSED)
    (asserts! (var-get canonical-finalized) ERR-NOT-FINALIZED)
    (asserts! (is-none (map-get? Bindings token-id)) ERR-ALREADY-INSCRIBED)
    ;; an original already sitting in this contract would be born stranded
    (asserts! (not (is-eq orig-owner current-contract)) ERR-CUSTODY)
    (try! (charge-fee tx-sender))
    (let ((master-fee (get total-fee (try! (contract-call? MASTER quote-single-tx-fee (get total-size c) (len chunks))))))
      (try! (stx-transfer? master-fee tx-sender current-contract))
      (let (
          (result (try! (as-contract? ((with-stx master-fee))
            (try! (contract-call? MASTER mint-single-tx (get content-hash c) (get mime c) (get total-size c) chunks (get token-uri c))))))
          (xtrata-id (get token-id result))
          (n (+ (var-get inscribed-count) u1))
        )
        (asserts! (map-insert TwinToOriginal xtrata-id token-id) ERR-ALREADY-INSCRIBED)
        (map-insert Bindings token-id {
          xtrata-id: xtrata-id, content-hash: (get content-hash c), inscriber: tx-sender,
          xtrata-escrowed: true, at: stacks-block-height })
        (var-set inscribed-count n)
        (print { event: "inscribed", collection: COLLECTION-KEY, token-id: token-id, xtrata-id: xtrata-id,
                 content-hash: (get content-hash c), inscriber: tx-sender, inscribed-count: n })
        (ok xtrata-id)))))

;; =============================================================================
;; swaps: never pausable, always check real ownership on both sides
;; =============================================================================
(define-public (swap-original-for-twin (token-id uint))
  (let ((b (unwrap! (map-get? Bindings token-id) ERR-NOT-INSCRIBED))
        (x-id (get xtrata-id b)))
    (asserts! (get xtrata-escrowed b) ERR-WRONG-STATE)
    (asserts! (is-eq (twin-owner x-id) (some current-contract)) ERR-CUSTODY)
    (try! (contract-call? SOURCE transfer token-id tx-sender current-contract))
    (asserts! (is-eq (source-owner token-id) (some current-contract)) ERR-CUSTODY)
    (try! (release-twin-to x-id tx-sender))
    (map-set Bindings token-id (merge b { xtrata-escrowed: false }))
    (print { event: "swap-original-for-twin", collection: COLLECTION-KEY, token-id: token-id, xtrata-id: x-id, holder: tx-sender })
    (ok true)))

(define-public (swap-twin-for-original (token-id uint))
  (let ((b (unwrap! (map-get? Bindings token-id) ERR-NOT-INSCRIBED))
        (x-id (get xtrata-id b)))
    (asserts! (not (get xtrata-escrowed b)) ERR-WRONG-STATE)
    ;; fail loudly (u210) if the original has left custody by any route
    (asserts! (is-eq (source-owner token-id) (some current-contract)) ERR-CUSTODY)
    (try! (contract-call? MASTER transfer x-id tx-sender current-contract))
    (try! (release-original-to token-id tx-sender))
    (map-set Bindings token-id (merge b { xtrata-escrowed: true }))
    (print { event: "swap-twin-for-original", collection: COLLECTION-KEY, token-id: token-id, xtrata-id: x-id, holder: tx-sender })
    (ok true)))

;; =============================================================================
;; rescue: the ONLY admin path that moves a held token (spec 7.6, decision D2)
;;  - only when this contract holds a token it should not (a stray deposit)
;;  - only the stray side, so the pairing invariant is restored, never broken
;;  - announced on-chain, executable after RESCUE-DELAY Bitcoin blocks
;; =============================================================================
(define-read-only (stray-side (token-id uint))
  (let ((o (source-owner token-id)))
    (match (map-get? Bindings token-id)
      b (let ((t (twin-owner (get xtrata-id b))))
          (if (and (is-eq o (some current-contract)) (is-eq t (some current-contract)))
            (if (get xtrata-escrowed b) (some "original") (some "twin"))
            none))
      ;; unbound original sent here directly
      (if (is-eq o (some current-contract)) (some "original") none))))

(define-public (propose-rescue (token-id uint) (recipient principal))
  (let ((side (unwrap! (stray-side token-id) ERR-NO-RESCUE)))
    (asserts! RESCUE-ENABLED ERR-RESCUE-DISABLED)
    (try! (assert-owner))
    (map-set Rescues token-id { recipient: recipient, side: side, eligible-at: (+ burn-block-height RESCUE-DELAY) })
    (print { event: "rescue-proposed", collection: COLLECTION-KEY, token-id: token-id, side: side, recipient: recipient,
             eligible-at: (+ burn-block-height RESCUE-DELAY) })
    (ok true)))

(define-public (cancel-rescue (token-id uint))
  (begin
    (try! (assert-owner))
    (asserts! (map-delete Rescues token-id) ERR-NO-RESCUE)
    (print { event: "rescue-cancelled", collection: COLLECTION-KEY, token-id: token-id })
    (ok true)))

(define-public (execute-rescue (token-id uint))
  (let ((r (unwrap! (map-get? Rescues token-id) ERR-NO-RESCUE))
        (side (unwrap! (stray-side token-id) ERR-NO-RESCUE)))
    (try! (assert-owner))
    (asserts! (>= burn-block-height (get eligible-at r)) ERR-TIMELOCK)
    (asserts! (is-eq side (get side r)) ERR-NO-RESCUE)
    (if (is-eq side "original")
      (try! (release-original-to token-id (get recipient r)))
      (try! (release-twin-to (get xtrata-id (unwrap-panic (map-get? Bindings token-id))) (get recipient r))))
    (map-delete Rescues token-id)
    (print { event: "rescue-executed", collection: COLLECTION-KEY, token-id: token-id, side: side, recipient: (get recipient r) })
    (ok true)))

;; =============================================================================
;; bounded admin settings (none affects swaps)
;; =============================================================================
(define-public (set-fee (new-fee uint))
  (begin (try! (assert-owner)) (asserts! (<= new-fee MAX-FEE) ERR-FEE-CAP) (ok (var-set inscribe-fee new-fee))))
(define-public (set-free-threshold (n uint))
  (begin (try! (assert-owner)) (ok (var-set free-threshold n))))
(define-public (set-fee-recipient (p principal))
  (begin (try! (assert-owner)) (ok (var-set fee-recipient p))))
(define-public (set-inscribe-paused (v bool))
  (begin (try! (assert-owner)) (ok (var-set inscribe-paused v))))
(define-public (transfer-ownership (new-owner principal))
  (begin (try! (assert-owner)) (print { event: "owner-changed", collection: COLLECTION-KEY, owner: new-owner }) (ok (var-set contract-owner new-owner))))

;; =============================================================================
;; discovery interface (common to every v2 helper and adapter; spec 7.3)
;; =============================================================================
(define-read-only (get-twin-interface)
  { interface-version: INTERFACE-VERSION, collection-key: COLLECTION-KEY, master: MASTER, source: SOURCE,
    source-asset: "bitcoin-monkeys", route: "standard", group: "G1",
    canonical-finalized: (var-get canonical-finalized),
    canonical-count: (var-get canonical-count), manifest-hash: (var-get manifest-hash),
    inscribed-count: (var-get inscribed-count), swaps-enabled: true,
    rescue-enabled: RESCUE-ENABLED, rescue-delay: RESCUE-DELAY, owner: (var-get contract-owner) })

(define-read-only (get-binding (token-id uint)) (map-get? Bindings token-id))
(define-read-only (get-canonical (token-id uint)) (map-get? Canonical token-id))
(define-read-only (get-original-by-twin (xtrata-id uint)) (map-get? TwinToOriginal xtrata-id))
(define-read-only (get-rescue (token-id uint)) (map-get? Rescues token-id))
(define-read-only (fee-for (payer principal)) (fee-for-internal payer))
(define-read-only (get-fee) (ok (var-get inscribe-fee)))
(define-read-only (get-free-threshold) (ok (var-get free-threshold)))
(define-read-only (get-inscribed-count) (ok (var-get inscribed-count)))
(define-read-only (is-finalized) (ok (var-get canonical-finalized)))
(define-read-only (get-owner) (ok (var-get contract-owner)))

;; Real custody, not the stored flag. `consistent` is false whenever the chain
;; disagrees with the binding; viewers must show that state, not hide it.
(define-read-only (get-custody-state (token-id uint))
  (match (map-get? Bindings token-id)
    b (let ((o (source-owner token-id)) (t (twin-owner (get xtrata-id b))) (me (some current-contract)))
        (some { xtrata-id: (get xtrata-id b), xtrata-escrowed: (get xtrata-escrowed b),
                original-owner: o, twin-owner: t,
                consistent: (if (get xtrata-escrowed b)
                              (and (is-eq t me) (not (is-eq o me)) (is-some o))
                              (and (is-eq o me) (not (is-eq t me)) (is-some t))),
                stranded: (and (is-eq o me) (is-eq t me)) }))
    none))
