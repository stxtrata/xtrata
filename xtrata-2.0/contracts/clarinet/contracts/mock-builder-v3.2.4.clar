;; mock-builder-v3.2.4
;;
;; Not for deployment. This stands in for a third-party contract built ON TOP of
;; the Xtrata core, so the composability suite can probe what a builder can and
;; cannot do without changing the core.
;;
;; Three shapes are represented:
;;   1. A publisher that pays for someone else's inscription (DeOrganized).
;;   2. A vault that owns inscriptions itself (DAO, treasury, escrow).
;;   3. A marketplace that takes custody and passes a token on.

(define-constant ERR-NOT-OWNER (err u900))

;; --- Shape 1: publisher pays, author owns ---
;;
;; No as-contract. tx-sender stays the user who called this contract, so the
;; user pays. The point of the test is that `author` can differ from the payer.
(define-public (publish-for
  (author principal)
  (expected-hash (buff 32))
  (mime (string-ascii 64))
  (total-size uint)
  (chunks (list 32 (buff 16384)))
  (token-uri-string (string-ascii 256))
)
  (contract-call? .xtrata-v3-2-4 mint-single-tx-to
    author expected-hash mime total-size chunks token-uri-string)
)

;; Same, but the CONTRACT pays out of its own balance via as-contract while the
;; author still ends up owning it. This is the fully sponsored shape: the author
;; needs no STX at all.
(define-public (sponsor-for
  (author principal)
  (expected-hash (buff 32))
  (mime (string-ascii 64))
  (total-size uint)
  (chunks (list 32 (buff 16384)))
  (token-uri-string (string-ascii 256))
)
  (as-contract
    (contract-call? .xtrata-v3-2-4 mint-single-tx-to
      author expected-hash mime total-size chunks token-uri-string)
  )
)

;; --- Shape 2: the contract itself owns the inscription ---
(define-public (mint-into-vault
  (expected-hash (buff 32))
  (mime (string-ascii 64))
  (total-size uint)
  (chunks (list 32 (buff 16384)))
  (token-uri-string (string-ascii 256))
)
  (contract-call? .xtrata-v3-2-4 mint-single-tx-to
    (as-contract tx-sender) expected-hash mime total-size chunks token-uri-string)
)

;; --- Shape 3: marketplace passing a token on from its own custody ---
;;
;; The seller must transfer in first. The core's transfer asserts
;; tx-sender == sender, so there is no approve-and-pull.
(define-public (release-to (id uint) (buyer principal))
  (as-contract (contract-call? .xtrata-v3-2-4 transfer id tx-sender buyer))
)

;; --- Read composability: can a contract read inscription bytes on chain? ---
(define-read-only (peek-chunk (id uint) (index uint))
  (contract-call? .xtrata-v3-2-4 get-chunk id index)
)

(define-read-only (peek-owner (id uint))
  (contract-call? .xtrata-v3-2-4 get-owner id)
)
