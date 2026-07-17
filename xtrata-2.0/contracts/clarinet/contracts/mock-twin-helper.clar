;; mock-twin-helper (simnet only)
;; Stand-in for the Forever Twin helper contracts (pepe-4ever-fakfun etc.).
;; Same Bindings tuple shape and get-binding signature.

(define-map Bindings
  uint
  {
    xtrata-id: uint,
    content-hash: (buff 32),
    inscriber: principal,
    xtrata-escrowed: bool,
    at: uint
  }
)

(define-public (set-binding
    (token-id uint)
    (xtrata-id uint)
    (content-hash (buff 32))
    (inscriber principal)
    (xtrata-escrowed bool))
  (begin
    (map-set Bindings token-id
      { xtrata-id: xtrata-id, content-hash: content-hash,
        inscriber: inscriber, xtrata-escrowed: xtrata-escrowed, at: stacks-block-height })
    (ok true)
  )
)

(define-read-only (get-binding (token-id uint))
  (map-get? Bindings token-id)
)
