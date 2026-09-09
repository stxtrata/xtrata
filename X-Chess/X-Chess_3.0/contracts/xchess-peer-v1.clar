;; Local prototype registry for serverless signed chess. No adjudication or money.
;; P-256 keys are opaque here; readers validate curve points and replay signatures.
(define-constant ERR (err u400))
(define-data-var count uint u0)
(define-map games uint {
  creator: principal, opponent: principal, creator-white: bool,
  creator-key: (buff 65), opponent-key: (optional (buff 65)),
  rules: uint, base-ms: uint, increment-ms: uint,
  opened-height: uint, joined-height: uint
})
(define-map record-count uint uint)
(define-map records {game: uint, index: uint} {
  publisher: principal, inscription: uint, archive-hash: (buff 32)
})
(define-read-only (get-format) u1)
(define-read-only (get-count) (var-get count))
(define-read-only (get-game (id uint)) (map-get? games id))
(define-read-only (get-record-count (id uint)) (default-to u0 (map-get? record-count id)))
(define-read-only (get-record (id uint) (index uint)) (map-get? records {game: id, index: index}))
(define-private (key-ok (key (buff 65)))
  (and (is-eq (len key) u65) (is-eq (slice? key u0 u1) (some 0x04))))
(define-public (create-game (opponent principal) (creator-white bool)
    (creator-key (buff 65)) (rules uint) (base-ms uint) (increment-ms uint))
  (let ((id (+ (var-get count) u1)))
    (asserts! (and (is-eq tx-sender contract-caller) (not (is-eq tx-sender opponent))
      (key-ok creator-key) (is-eq rules u1)
      (<= base-ms u86400000) (or (is-eq base-ms u0) (>= base-ms u60000))
      (<= increment-ms u60000) (or (> base-ms u0) (is-eq increment-ms u0))) ERR)
    (map-insert games id {creator: tx-sender, opponent: opponent, creator-white: creator-white,
      creator-key: creator-key, opponent-key: none, rules: rules,
      base-ms: base-ms, increment-ms: increment-ms,
      opened-height: stacks-block-height, joined-height: u0})
    (var-set count id)
    (print {event: "peer-created", game: id})
    (ok id)))
(define-public (join-game (id uint) (opponent-key (buff 65)))
  (let ((game (unwrap! (map-get? games id) ERR)))
    (asserts! (and (is-eq tx-sender contract-caller) (is-eq tx-sender (get opponent game))
      (is-none (get opponent-key game)) (key-ok opponent-key)
      (not (is-eq opponent-key (get creator-key game)))
      (<= stacks-block-height (+ (get opened-height game) u1440))) ERR)
    (map-set games id (merge game {opponent-key: (some opponent-key), joined-height: stacks-block-height}))
    (print {event: "peer-joined", game: id})
    (ok id)))
;; Discovery hints only. A bad first record cannot lock out a later valid one.
;; The inscription must be fetched, hashed, authenticated and replayed by readers.
(define-public (record-archive (id uint) (inscription uint) (archive-hash (buff 32)))
  (let ((game (unwrap! (map-get? games id) ERR)) (index (get-record-count id)))
    (asserts! (and (is-eq tx-sender contract-caller) (is-some (get opponent-key game))
      (or (is-eq tx-sender (get creator game)) (is-eq tx-sender (get opponent game)))
      (is-eq (len archive-hash) u32)) ERR)
    (map-insert records {game: id, index: index}
      {publisher: tx-sender, inscription: inscription, archive-hash: archive-hash})
    (map-set record-count id (+ index u1))
    (print {event: "peer-record", game: id, index: index, inscription: inscription, archive-hash: archive-hash})
    (ok index)))
