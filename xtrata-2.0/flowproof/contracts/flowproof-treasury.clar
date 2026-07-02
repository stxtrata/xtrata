;; flowproof-treasury - atomic money-movement + permanent proof (Pattern B).
;;
;; deposit-and-prove routes a deposit through FlowVault AND inscribes the
;; Proof-of-Flow receipt via Xtrata in ONE transaction. Either both succeed or
;; both revert -- the money movement and its permanent, recursively-linked
;; on-chain record are atomic. This is the composable primitive: not an app
;; gluing two SDKs in sequence, but a single on-chain action.
;;
;; tx-sender propagates through contract-call?, so:
;;  - FlowVault applies the USER's routing rules and moves the USER's tokens
;;  - Xtrata records the USER as the inscription creator/owner
;;
;; FlowVault and Xtrata are referenced by their deployed principals; the token is
;; passed as a SIP-010 trait (FlowVault is token-agnostic).

(use-trait sip-010-trait 'STD7QG84VQQ0C35SZM2EYTHZV4M8FQ0R7YNSQWPD.sip-010-trait.sip-010-trait)

(define-constant ERR-DEPOSIT-FAILED (err u200))
(define-constant ERR-INSCRIBE-FAILED (err u201))

;; Atomic: route money through FlowVault, then inscribe the receipt via Xtrata.
(define-public (deposit-and-prove
    (token <sip-010-trait>)
    (amount uint)
    (expected-hash (buff 32))
    (mime (string-ascii 64))
    (total-size uint)
    (chunks (list 32 (buff 16384)))
    (token-uri (string-ascii 256))
    (dependencies (list 50 uint))
    (parents (list 50 uint))
  )
  (begin
    ;; 1) Route the money through FlowVault (applies the caller's routing rules:
    ;;    split -> lock -> hold). Reverts the whole tx on failure.
    (unwrap!
      (contract-call? 'STD7QG84VQQ0C35SZM2EYTHZV4M8FQ0R7YNSQWPD.flowvault-v2 deposit token amount)
      ERR-DEPOSIT-FAILED)
    ;; 2) Inscribe the permanent, lineage-linked receipt via Xtrata, atomically.
    (let (
        (receipt (unwrap!
          (contract-call? 'STRNRHWSD7REAEXVTHDQWKPD4MFBG41024WQKBBM.xtrata-v3-2-3
            mint-single-tx-with-relationships
            expected-hash mime total-size chunks token-uri dependencies parents)
          ERR-INSCRIBE-FAILED))
      )
      (print {
        event: "flowproof-atomic",
        depositor: tx-sender,
        amount: amount,
        receipt-id: (get token-id receipt)
      })
      (ok receipt)
    )
  )
)
