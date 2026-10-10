;; snes-xtrata-adapter-v3-2-3
;; Tells the SNES game catalogue about ROM inscriptions held by the live Xtrata core
;; SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3.
;;
;; The catalogue cannot call the core directly: Xtrata's read-only functions return optionals, and a Clarity trait
;; function must return a response. This adapter wraps them. It holds no state and has no owner. A new Xtrata core
;; means a new adapter and one `set-reader` call on the catalogue; the catalogue never changes.
;;
;; Error codes: u200 inscription not found, u201 not sealed, u202 size differs, u203 creator differs.
;; Deploy it AFTER snes-game-catalogue-v1 from the same address (it implements the catalogue's trait).
(impl-trait .snes-game-catalogue-v1.inscription-check-trait)

(define-constant XTRATA-CORE 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3)

(define-read-only (core) (ok XTRATA-CORE))

(define-read-only (check (ins uint) (size uint) (creator principal))
  (begin
    (asserts! (is-some (contract-call? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3 get-inscription-size ins)) (err u200))
    (asserts! (is-eq (contract-call? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3 is-inscription-sealed ins) (some true)) (err u201))
    (asserts! (is-eq (contract-call? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3 get-inscription-size ins) (some size)) (err u202))
    (asserts! (is-eq (contract-call? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3 get-inscription-creator ins) (some creator)) (err u203))
    (ok true)))
