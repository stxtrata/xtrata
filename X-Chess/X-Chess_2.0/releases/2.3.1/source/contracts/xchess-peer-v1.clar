;; Immutable named-player registration for xchess-peer-v1.
;; No chess referee, move transactions, escrow, payouts or timeout adjudication.
;; The versioned descriptor and P-256 keys are verified by the inscribed client.
(define-constant ERR (err u400))
(define-data-var count uint u0)
(define-map games uint {
  creator: principal, opponent: principal, creator-white: bool,
  creator-key: (buff 65), opponent-key: (optional (buff 65)),
  descriptor: (buff 1024), descriptor-hash: (buff 32),
  opened-height: uint, joined-height: uint
})
(define-read-only (get-peer-format) u1)
(define-read-only (get-peer-count) (var-get count))
(define-read-only (get-peer-game (id uint)) (map-get? games id))
(define-private (key-ok (key (buff 65)))
  (and (is-eq (len key) u65) (is-eq (slice? key u0 u1) (some 0x04))))
(define-public (create-peer-game (opponent principal) (creator-white bool)
    (creator-key (buff 65)) (descriptor (buff 1024)))
  (let ((id (+ (var-get count) u1)))
    (asserts! (and (is-eq tx-sender contract-caller) (not (is-eq tx-sender opponent))
      (key-ok creator-key) (> (len descriptor) u0)) ERR)
    (map-insert games id {creator: tx-sender, opponent: opponent, creator-white: creator-white,
      creator-key: creator-key, opponent-key: none,
      descriptor: descriptor, descriptor-hash: (sha256 descriptor),
      opened-height: stacks-block-height, joined-height: u0})
    (var-set count id)
    (print {event: "peer-created", game: id})
    (ok id)))
(define-public (join-peer-game (id uint) (expected-descriptor-hash (buff 32)) (opponent-key (buff 65)))
  (let ((game (unwrap! (map-get? games id) ERR)))
    (asserts! (and (is-eq tx-sender contract-caller) (is-eq tx-sender (get opponent game))
      (is-none (get opponent-key game)) (key-ok opponent-key)
      (not (is-eq opponent-key (get creator-key game)))
      (is-eq expected-descriptor-hash (get descriptor-hash game))
      (<= stacks-block-height (+ (get opened-height game) u1440))) ERR)
    (map-set games id (merge game {opponent-key: (some opponent-key), joined-height: stacks-block-height}))
    (print {event: "peer-joined", game: id})
    (ok id)))
