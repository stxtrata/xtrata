(define-read-only (get-inscription-meta (id uint))
  (if (is-eq id u42)
    (some {
      owner: tx-sender,
      creator: tx-sender,
      mime-type: "text/html",
      total-size: u1234,
      total-chunks: u1,
      sealed: true,
      final-hash: 0xabababababababababababababababababababababababababababababababab
    })
    none))

