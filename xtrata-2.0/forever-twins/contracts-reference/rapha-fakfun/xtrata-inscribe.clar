;; xtrata-inscribe  (Rapha / Fak.fun)
;; Fetched from mainnet 2026-08-10 for reference. Not authored here.
;; SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.xtrata-inscribe
;;
;; Smart-wallet extension (extension-trait) letting a passkey wallet inscribe
;; text through the Xtrata core. Whitelisted in fakfun-wallet-v16.onboard.
;; Pinned to xtrata-v3-2-3, so it stops working when that core is paused.
;; See contracts/drafts/v3.2.4/CUTOVER-ADDENDUM.md section 5b.

(impl-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.extension-trait.extension-trait)

(define-constant err-bad-payload (err u8001))

(define-public (call (payload (buff 2048)))
  (let ((args (unwrap!
      (from-consensus-buff?
        {
          expected-hash: (buff 32),
          mime: (string-ascii 64),
          total-size: uint,
          chunks: (list 32 (buff 16384)),
          token-uri-string: (string-ascii 256),
        }
        payload
      )
      err-bad-payload
    )))
    (try! (contract-call? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3
      mint-single-tx
      (get expected-hash args)
      (get mime args)
      (get total-size args)
      (get chunks args)
      (get token-uri-string args)
    ))
    (ok true)
  )
)