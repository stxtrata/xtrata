(define-trait registry-trait
  (
    (inscribe
      (uint (buff 32) (string-ascii 64) uint (list 32 (buff 16384)) (string-ascii 256))
      (response uint uint)
    )
    (get-inscribed-count () (response uint uint))
  )
)

(define-trait swap-registry-trait
  (
    (swap-nft-for-xtrata (uint) (response bool uint))
    (swap-xtrata-for-nft (uint) (response bool uint))
  )
)

(define-public (inscribe
    (registry <registry-trait>)
    (token-id uint)
    (expected-hash (buff 32))
    (mime (string-ascii 64))
    (total-size uint)
    (chunks (list 32 (buff 16384)))
    (token-uri (string-ascii 256))
  )
  (let ((xtrata-id (try! (contract-call? registry inscribe
      token-id expected-hash mime total-size chunks token-uri
    ))))
    (print {
      event: "inscribed",
      registry: (contract-of registry),
      token-id: token-id,
      xtrata-id: xtrata-id,
      content-hash: expected-hash,
      inscriber: tx-sender,
      inscribed-count: (try! (contract-call? registry get-inscribed-count)),
    })
    (ok xtrata-id)
  )
)

(define-public (swap-nft-for-xtrata
    (registry <swap-registry-trait>)
    (token-id uint)
  )
  (begin
    (try! (contract-call? registry swap-nft-for-xtrata token-id))
    (print {
      event: "swap-nft-for-xtrata",
      registry: (contract-of registry),
      token-id: token-id,
      holder: tx-sender,
    })
    (ok true)
  )
)

(define-public (swap-xtrata-for-nft
    (registry <swap-registry-trait>)
    (token-id uint)
  )
  (begin
    (try! (contract-call? registry swap-xtrata-for-nft token-id))
    (print {
      event: "swap-xtrata-for-nft",
      registry: (contract-of registry),
      token-id: token-id,
      holder: tx-sender,
    })
    (ok true)
  )
)