;; xtrata-chess-log-v3
;;
;; Version 2 with opening a game priced separately from playing one.
;;
;; Everything that made v1 what it is stays exactly as it was. The contract
;; still does not know the rules of chess. It still stores short strings in a
;; total order and forms no opinion about them. Replay in the board is still
;; what decides which submissions count, and the rule that keeps that sound is
;; unchanged:
;;
;;     THE CONTRACT MAY FILTER, NEVER ADJUDICATE.
;;
;; v2 charged the same fee for opening a game as for making a move, which gets
;; the incentives backwards. A move is the thing people should do freely; a game
;; is a permanent id, a row in a map, and an entry in every list of games from
;; here on. Those are not worth the same, and pricing them the same means either
;; moves cost too much or games cost too little.
;;
;; So v3 splits them. The move fee keeps v2's behaviour exactly, including that
;; it may be zero. The open fee is new and is bounded on both sides:
;;
;;   * OPEN-FEE-CEILING is ten STX. As with the move fee, no owner can ever
;;     charge more, because the constant is in the code where no owner reaches.
;;   * OPEN-FEE-FLOOR is 0.0001 STX. This one is the more unusual guard, and it
;;     is deliberate: the floor means opening a game can never become free, not
;;     even by the owner's choice. Opening is the only call that costs the chain
;;     permanent storage no matter what follows it, and a free one is an
;;     invitation to fill the map with empty games.
;;
;; A floor is a real constraint on the owner, not a default. It cannot be
;; lowered later, and a renounced contract keeps it forever.
;; The two guards v2 introduced still apply to both fees: a ceiling no owner can
;; exceed, and a renounce that freezes everything permanently.
;;
;; The fee is also the only spam control the board has ever had, and raising the
;; move fee raises the cost of junk in exactly the same proportion as the cost of
;; play. That is a trade, not a win. Splitting the open fee out is what lets the
;; move fee stay low without leaving game creation free.

(define-constant FORMAT-VERSION u3)

(define-constant ERR-NO-GAME      (err u100))
(define-constant ERR-BAD-LENGTH   (err u101))
(define-constant ERR-LOG-FULL     (err u102))
(define-constant ERR-NOT-OWNER    (err u103))
(define-constant ERR-FEE-TOO-HIGH (err u104))
(define-constant ERR-NO-OWNER     (err u105))
(define-constant ERR-FEE-TOO-LOW  (err u106))

;; A ceiling on submissions per game, high enough that reaching it is a
;; deliberate act rather than an accident.
(define-constant MAX-SEQ u65536)

;; One STX. The highest fee any owner can ever set, fixed in the code where no
;; owner can reach it. Without this, "programmable fee" would mean the owner can
;; close the board at will.
(define-constant FEE-CEILING u1000000)

;; 0.01 STX, which is what a move has actually cost in practice.
(define-constant DEFAULT-FEE u10000)

;; Opening a game, priced separately from playing one.
;;
;; Bounded at both ends. The ceiling stops an owner closing the board; the floor
;; stops anyone, including the owner, making game creation free. Ten STX and
;; 0.0001 STX respectively.
(define-constant OPEN-FEE-CEILING u10000000)
(define-constant OPEN-FEE-FLOOR u100)

;; One STX.
(define-constant DEFAULT-OPEN-FEE u1000000)

(define-data-var game-count uint u0)

;; Charged on submit-move. A submission that replay will skip still consumed a
;; slot in the log, so it is charged like any other.
(define-data-var move-fee uint DEFAULT-FEE)

;; Charged on open-game. A game that is opened and never played still consumed
;; an id and a row that cannot be reclaimed, which is what this pays for.
(define-data-var open-fee uint DEFAULT-OPEN-FEE)

(define-data-var fee-recipient principal tx-sender)

;; none means ownership has been renounced. At that point the fee, the
;; recipient, and this contract's behaviour are fixed forever.
(define-data-var owner (optional principal) (some tx-sender))

(define-map Games
  uint
  {
    opened-by: principal,
    opened-at: uint,
    next-seq: uint,
    rules-hash: (optional (buff 32))
  }
)

(define-map Moves
  { game: uint, seq: uint }
  {
    mv: (string-ascii 5),
    sender: principal,
    height: uint
  }
)

;; --------------------------------------------------------------------------
;; The fee
;; --------------------------------------------------------------------------

(define-private (is-owner)
  (match (var-get owner)
    who (is-eq tx-sender who)
    false
  )
)

;; Paying the recipient when the sender *is* the recipient would be a transfer
;; to self: it costs runtime, can fail, and moves nothing. Skipped rather than
;; attempted.
;;
;; Takes the amount rather than reading one, because there are two fees now and
;; a function that picked its own would be one edit away from charging the wrong
;; one silently.
(define-private (charge (amount uint))
  (let
    (
      (to (var-get fee-recipient))
    )
    (if (or (is-eq amount u0) (is-eq tx-sender to))
      (ok true)
      (stx-transfer? amount tx-sender to)
    )
  )
)

;; --------------------------------------------------------------------------
;; Public
;; --------------------------------------------------------------------------

(define-public (open-game (rules-hash (optional (buff 32))))
  (let
    (
      (id (+ (var-get game-count) u1))
    )
    ;; Charged before anything is written, so a sender who cannot pay leaves no
    ;; trace and consumes no game id.
    (try! (charge (var-get open-fee)))

    ;; #[allow(unchecked_data)]
    (map-set Games id
      {
        opened-by: tx-sender,
        opened-at: stacks-block-height,
        next-seq: u0,
        rules-hash: rules-hash
      }
    )
    (var-set game-count id)
    (print
      {
        event: "game-opened",
        game: id,
        opened-by: tx-sender,
        height: stacks-block-height,
        rules-hash: rules-hash,
        fee: (var-get open-fee)
      }
    )
    (ok id)
  )
)

(define-public (submit-move (game uint) (mv (string-ascii 5)))
  (let
    (
      (entry (unwrap! (map-get? Games game) ERR-NO-GAME))
      (seq (get next-seq entry))
      (size (len mv))
    )
    ;; Cheap checks first: a refusal should not cost a fee, and a fee should not
    ;; be taken for a submission that was never going to be stored.
    (asserts! (or (is-eq size u4) (is-eq size u5)) ERR-BAD-LENGTH)
    (asserts! (< seq MAX-SEQ) ERR-LOG-FULL)
    (try! (charge (var-get move-fee)))

    ;; #[allow(unchecked_data)]
    (map-set Moves
      { game: game, seq: seq }
      {
        mv: mv,
        sender: tx-sender,
        height: stacks-block-height
      }
    )
    ;; #[allow(unchecked_data)]
    (map-set Games game (merge entry { next-seq: (+ seq u1) }))
    (print
      {
        event: "move-submitted",
        game: game,
        seq: seq,
        mv: mv,
        sender: tx-sender,
        height: stacks-block-height,
        fee: (var-get move-fee)
      }
    )
    (ok seq)
  )
)

;; --------------------------------------------------------------------------
;; Owner
;; --------------------------------------------------------------------------

(define-public (set-move-fee (amount uint))
  (begin
    (asserts! (is-owner) ERR-NOT-OWNER)
    (asserts! (<= amount FEE-CEILING) ERR-FEE-TOO-HIGH)
    (var-set move-fee amount)
    (print { event: "fee-changed", fee: amount, by: tx-sender })
    (ok amount)
  )
)

;; The floor is checked as strictly as the ceiling. An owner who wants opening
;; to be free has to deploy a different contract, which is the intent.
(define-public (set-open-fee (amount uint))
  (begin
    (asserts! (is-owner) ERR-NOT-OWNER)
    (asserts! (<= amount OPEN-FEE-CEILING) ERR-FEE-TOO-HIGH)
    (asserts! (>= amount OPEN-FEE-FLOOR) ERR-FEE-TOO-LOW)
    (var-set open-fee amount)
    (print { event: "open-fee-changed", fee: amount, by: tx-sender })
    (ok amount)
  )
)

(define-public (set-fee-recipient (who principal))
  (begin
    (asserts! (is-owner) ERR-NOT-OWNER)
    ;; #[allow(unchecked_data)]
    (var-set fee-recipient who)
    (print { event: "recipient-changed", recipient: who, by: tx-sender })
    (ok who)
  )
)

;; Hand the contract to somebody else, or to nobody.
;;
;; Passing none renounces ownership permanently: is-owner can never be true
;; again, so the fee and the recipient are frozen exactly as they stand. There
;; is no way back, which is the point.
(define-public (transfer-ownership (new-owner (optional principal)))
  (begin
    (asserts! (is-owner) ERR-NOT-OWNER)
    ;; #[allow(unchecked_data)]
    (var-set owner new-owner)
    (print
      {
        event: "ownership-transferred",
        to: new-owner,
        by: tx-sender,
        renounced: (is-none new-owner)
      }
    )
    (ok new-owner)
  )
)

;; --------------------------------------------------------------------------
;; Read only
;; --------------------------------------------------------------------------

(define-read-only (get-format-version)
  FORMAT-VERSION
)

(define-read-only (get-max-seq)
  MAX-SEQ
)

;; The board reads this before every call, so it can tell the wallet exactly how
;; much will move and show it to the person signing.
(define-read-only (get-move-fee)
  (var-get move-fee)
)

(define-read-only (get-fee-ceiling)
  FEE-CEILING
)

;; Read before opening a game, the same way the move fee is read before a move,
;; so the wallet is told exactly how much will move.
(define-read-only (get-open-fee)
  (var-get open-fee)
)

(define-read-only (get-open-fee-ceiling)
  OPEN-FEE-CEILING
)

(define-read-only (get-open-fee-floor)
  OPEN-FEE-FLOOR
)

(define-read-only (get-fee-recipient)
  (var-get fee-recipient)
)

(define-read-only (get-owner)
  (var-get owner)
)

(define-read-only (get-game-count)
  (var-get game-count)
)

(define-read-only (get-game (game uint))
  (map-get? Games game)
)

(define-read-only (get-move (game uint) (seq uint))
  (map-get? Moves { game: game, seq: seq })
)

(define-constant PAGE-OFFSETS
  (list
    u0  u1  u2  u3  u4  u5  u6  u7  u8  u9
    u10 u11 u12 u13 u14 u15 u16 u17 u18 u19
    u20 u21 u22 u23 u24 u25 u26 u27 u28 u29
    u30 u31 u32 u33 u34 u35 u36 u37 u38 u39
    u40 u41 u42 u43 u44 u45 u46 u47 u48 u49
  )
)

(define-private (page-step
  (offset uint)
  (acc
    {
      game: uint,
      start: uint,
      out: (list 50 (optional { mv: (string-ascii 5), sender: principal, height: uint }))
    }
  )
)
  (merge acc
    {
      out: (unwrap-panic
        (as-max-len?
          (append (get out acc)
            (map-get? Moves
              {
                game: (get game acc),
                seq: (+ (get start acc) offset)
              }
            )
          )
          u50
        )
      )
    }
  )
)

(define-read-only (get-page (game uint) (start uint))
  (get out
    (fold page-step
      PAGE-OFFSETS
      { game: game, start: start, out: (list) }
    )
  )
)
