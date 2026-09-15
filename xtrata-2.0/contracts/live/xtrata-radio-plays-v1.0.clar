;; Optional paid starts. No custody, treasury, administrator or automatic wallet access.
;; Core selectors are explicit: identical IDs in different cores are distinct masters.
(define-constant HOLDER-PAYMENT u50)
(define-map receipts {payer: principal, receipt: (buff 16)} {core: uint, id: uint, recipient: principal})
(define-map totals {core: uint, id: uint} uint)
(define-read-only (get-config)
 (ok {version: u1, holder-payment: HOLDER-PAYMENT, receipt-bytes: u16,
  core-1: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v1-1-1,
  core-2: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v2-1-0,
  core-3: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3}))
(define-read-only (get-receipt (payer principal) (receipt (buff 16)))
 (map-get? receipts {payer: payer, receipt: receipt}))
(define-read-only (get-total (core uint) (id uint))
 (default-to u0 (map-get? totals {core: core, id: id})))
(define-read-only (get-owner (core uint) (id uint))
 (if (is-eq core u3)
  (contract-call? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3 get-owner id)
  (if (is-eq core u2)
   (contract-call? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v2-1-0 get-owner id)
   (if (is-eq core u1)
    (contract-call? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v1-1-1 get-owner id)
    (err u101)))))
(define-public (play (core uint) (id uint) (receipt (buff 16)))
 (begin
  (asserts! (is-eq tx-sender contract-caller) (err u100))
  (asserts! (is-eq (len receipt) u16) (err u102))
  (asserts! (is-none (get-receipt tx-sender receipt)) (err u103))
  (let ((recipient (unwrap! (try! (get-owner core id)) (err u104)))
        (count (get-total core id)))
   (asserts! (not (is-eq recipient tx-sender)) (err u105))
   ;; Escrow/custodian contracts need a separately reviewed beneficiary resolver.
   (asserts! (is-none (get name (unwrap! (principal-destruct? recipient) (err u106)))) (err u106))
   (try! (stx-transfer? HOLDER-PAYMENT tx-sender recipient))
   (map-set receipts {payer: tx-sender, receipt: receipt} {core: core, id: id, recipient: recipient})
   (map-set totals {core: core, id: id} (+ count u1))
   (print {event: "radio-paid-play", version: u1, core: core, id: id,
    payer: tx-sender, receipt: receipt, recipient: recipient, amount: HOLDER-PAYMENT, total: (+ count u1)})
   (ok {recipient: recipient, amount: HOLDER-PAYMENT, total: (+ count u1)}))))
