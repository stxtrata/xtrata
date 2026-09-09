;; Fast Play registry. No move transactions, chess adjudication, custody or payouts.
;; P-256 game keys are opaque registered bytes; the inscribed reader verifies them.
(define-constant ERR (err u400))
(define-data-var count uint u0)
(define-map games uint {
  creator: principal, opponent: principal, creator-white: bool,
  creator-key: (buff 65), opponent-key: (optional (buff 65)), referee: (buff 65),
  base-ms: uint, increment-ms: uint, opened-height: uint, joined-height: uint
})
(define-read-only (get-format) u1)
(define-read-only (get-count) (var-get count))
(define-read-only (get-game (id uint)) (map-get? games id))
(define-private (key-ok (key (buff 65)))
  (and (is-eq (len key) u65) (is-eq (slice? key u0 u1) (some 0x04))))
(define-public (create-game (opponent principal) (creator-white bool)
    (creator-key (buff 65)) (referee (buff 65)) (base-ms uint) (increment-ms uint))
  (let ((id (+ (var-get count) u1)))
    (asserts! (and (is-eq tx-sender contract-caller) (not (is-eq tx-sender opponent))
      (key-ok creator-key) (key-ok referee) (not (is-eq creator-key referee))
      (<= base-ms u86400000) (or (is-eq base-ms u0) (>= base-ms u60000))
      (<= increment-ms u60000) (or (> base-ms u0) (is-eq increment-ms u0))) ERR)
    (map-insert games id {creator: tx-sender, opponent: opponent, creator-white: creator-white,
      creator-key: creator-key, opponent-key: none, referee: referee,
      base-ms: base-ms, increment-ms: increment-ms,
      opened-height: stacks-block-height, joined-height: u0})
    (var-set count id)
    (print {event: "fast-created", game: id})
    (ok id)))
(define-public (join-game (id uint) (opponent-key (buff 65)))
  (let ((game (unwrap! (map-get? games id) ERR)))
    (asserts! (and (is-eq tx-sender contract-caller) (is-eq tx-sender (get opponent game))
      (is-none (get opponent-key game)) (key-ok opponent-key)
      (not (is-eq opponent-key (get creator-key game)))
      (not (is-eq opponent-key (get referee game)))
      (<= stacks-block-height (+ (get opened-height game) u1440))) ERR)
    (map-set games id (merge game {opponent-key: (some opponent-key), joined-height: stacks-block-height}))
    (print {event: "fast-joined", game: id})
    (ok id)))
