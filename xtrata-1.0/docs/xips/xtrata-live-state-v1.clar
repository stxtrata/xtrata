;; traits/xtrata-live-state-v1.clar
(impl-trait .traits.xtrata-live-state-v1)

;; ----------------------------------------------------------------------------
;; Constants & Errors
;; ----------------------------------------------------------------------------
(define-constant ERR-NO-ENDORSEMENT u1)
(define-constant ERR-NOT-AUTHORIZED u2)
(define-constant ERR-NOT-FOUND u3)

;; ----------------------------------------------------------------------------
;; Data Variables
;; ----------------------------------------------------------------------------
(define-data-var endorsed-scope 
  (optional { scope-hash: (buff 32), manifest-hash: (buff 32) }) 
  none)
(define-data-var contract-owner principal tx-sender)

;; ----------------------------------------------------------------------------
;; Data Maps
;; ----------------------------------------------------------------------------
(define-map tokens
  { token-id: uint }
  {
    level: uint,
    xp: uint,
    hp: uint,
    status: (string-utf8 32),
    last-updated-block: uint,
    nonce: uint
  }
)

;; ----------------------------------------------------------------------------
;; Internal Helpers (Uint to String Conversion)
;; ----------------------------------------------------------------------------
(define-private (digit-to-char (d uint))
  (unwrap-panic (element-at "0123456789" d))
)

(define-private (uint-to-ascii-iter (n uint) (acc (string-utf8 64)))
  (if (<= n u9)
    (unwrap-panic (as-max-len? (concat (digit-to-char n) acc) u64))
    (let ((q (/ n u10))
          (r (mod n u10)))
      (uint-to-ascii-iter q (unwrap-panic (as-max-len? (concat (digit-to-char r) acc) u64)))
    )
  )
)

(define-read-only (uint-to-ascii (n uint))
  (if (<= n u9)
    (unwrap-panic (as-max-len? (digit-to-char n) u64))
    (uint-to-ascii-iter (/ n u10) (unwrap-panic (as-max-len? (digit-to-char (mod n u10)) u64)))
  )
)

;; ----------------------------------------------------------------------------
;; Trait Implementation: xtrata-live-state-v1
;; ----------------------------------------------------------------------------
(define-read-only (get-endorsed-manifest-scope)
  (let ((current (var-get endorsed-scope)))
    (if (is-some current)
      (ok (unwrap-panic current))
      (err ERR-NO-ENDORSEMENT)))
)

(define-read-only (get-token-state (token-id uint))
  (let ((token-data (map-get? tokens { token-id: token-id })))
    (if (is-some token-data)
      (let ((td (unwrap-panic token-data)))
        (ok {
          ;; Return attributes as string-utf8 pairs per trait spec
          attributes: (list
            { key: "level", value: (unwrap-panic (to-utf8 (uint-to-ascii (get level td)))) }
            { key: "xp", value: (unwrap-panic (to-utf8 (uint-to-ascii (get xp td)))) }
            { key: "hp", value: (unwrap-panic (to-utf8 (uint-to-ascii (get hp td)))) }
            { key: "status", value: (unwrap-panic (to-utf8 (get status td))) }
          ),
          last-updated-block: (get last-updated-block td),
          nonce: (get nonce td)
        })
      )
      (err ERR-NOT-FOUND)))
)

;; ----------------------------------------------------------------------------
;; Administrative Functions
;; ----------------------------------------------------------------------------
(define-private (is-owner)
  (is-eq tx-sender (var-get contract-owner))
)

(define-public (set-endorsed-manifest-scope (scope-hash (buff 32)) (manifest-hash (buff 32)))
  (begin
    (asserts! (is-owner) (err ERR-NOT-AUTHORIZED))
    (var-set endorsed-scope (some { scope-hash: scope-hash, manifest-hash: manifest-hash }))
    (ok true)
  )
)

(define-public (update-token-state 
  (token-id uint) 
  (level uint) 
  (xp uint) 
  (hp uint) 
  (status (string-utf8 32)))
  (begin
    (asserts! (is-owner) (err ERR-NOT-AUTHORIZED))
    (let ((existing (map-get? tokens { token-id: token-id }))
          (current-nonce (if (is-some existing) 
                             (get nonce (unwrap-panic existing)) 
                             u0)))
      (map-set tokens { token-id: token-id }
        {
          level: level,
          xp: xp,
          hp: hp,
          status: status,
          last-updated-block: block-height,
          nonce: (+ u1 current-nonce)
        }
      )
    )
    (ok true)
  )
)