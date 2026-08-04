;; Proof of Free - recording fees
;; ---------------------------------------------------------------------------
;; Everything else lives natively on Xtrata: the editions are Xtrata inscriptions
;; (SIP-009 tokens), ownership and transfers are Xtrata's, child recordings that
;; evolve a synth are inscribed as Xtrata parent-child links, and a tile is
;; revealed in the mosaic by its ownership (out of the treasury wallet).
;;
;; This contract does ONE thing: collect the fee to inscribe a derivative
;; recording to the treasury, with an on-chain receipt. Fees are owner-updatable.
;;   kind u0 = child performance (xtrata-performance JSON) -> 0.1 STX
;;   kind u1 = live set        (xtrata-session JSON)      -> 1 STX
;; ---------------------------------------------------------------------------

(define-constant ERR-OWNER-ONLY (err u100))
(define-constant ERR-BAD-KIND (err u101))

(define-data-var contract-owner principal tx-sender)
(define-data-var treasury principal tx-sender)          ;; the Xtrata wallet
(define-data-var child-fee uint u100000)                ;; 0.1 STX (micro-STX)
(define-data-var live-set-fee uint u1000000)            ;; 1 STX
(define-data-var receipts-count uint u0)

;; a receipt ties a fee payment to the recording it inscribes
(define-map receipts uint { payer: principal, kind: uint, parent: uint, ref: (string-ascii 80), height: uint })

(define-private (is-owner) (is-eq tx-sender (var-get contract-owner)))

;; Pay to inscribe a recording. `parent` = the edition being evolved (u0 for a
;; live set); `ref` = the recording's Xtrata inscription id or content hash.
(define-public (pay-inscription-fee (kind uint) (parent uint) (ref (string-ascii 80)))
  (let ((fee (if (is-eq kind u1) (var-get live-set-fee) (var-get child-fee)))
        (rid (+ (var-get receipts-count) u1)))
    (asserts! (or (is-eq kind u0) (is-eq kind u1)) ERR-BAD-KIND)
    (try! (stx-transfer? fee tx-sender (var-get treasury)))
    (map-set receipts rid { payer: tx-sender, kind: kind, parent: parent, ref: ref, height: burn-block-height })
    (var-set receipts-count rid)
    (print { event: "recording-fee", id: rid, kind: kind, parent: parent, ref: ref, payer: tx-sender, fee: fee })
    (ok rid)))

;; ---- owner admin ----
(define-public (set-child-fee (n uint))
  (begin (asserts! (is-owner) ERR-OWNER-ONLY) (var-set child-fee n) (ok true)))
(define-public (set-live-set-fee (n uint))
  (begin (asserts! (is-owner) ERR-OWNER-ONLY) (var-set live-set-fee n) (ok true)))
(define-public (set-treasury (who principal))
  (begin (asserts! (is-owner) ERR-OWNER-ONLY) (var-set treasury who) (ok true)))
(define-public (transfer-ownership (who principal))
  (begin (asserts! (is-owner) ERR-OWNER-ONLY) (var-set contract-owner who) (ok true)))

;; ---- read-only ----
(define-read-only (get-fees) { child: (var-get child-fee), liveSet: (var-get live-set-fee) })
(define-read-only (get-receipt (rid uint)) (map-get? receipts rid))
(define-read-only (get-receipts-count) (var-get receipts-count))
(define-read-only (get-treasury) (var-get treasury))
(define-read-only (get-owner) (var-get contract-owner))
