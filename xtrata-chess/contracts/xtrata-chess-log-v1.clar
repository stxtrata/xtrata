;; xtrata-chess-log-v1
;;
;; An append-only log of chess moves. This contract does not know the rules of
;; chess and never will. It stores short strings in a total order, and nothing
;; else.
;;
;; The rules live in the inscribed board renderer, which replays this log from
;; the first entry and skips any submission that is not legal in the position
;; reached so far. That replay is deterministic, so every reader derives the
;; same position from the same log. The agreement is the consensus.
;;
;; The invariant that keeps this sound:
;;
;;     THE CONTRACT MAY FILTER, NEVER ADJUDICATE.
;;
;; Anything rejected here never enters the log, so there is nothing to disagree
;; about. Anything wrongly accepted here is skipped identically by every reader.
;; What the contract must never do is make a chess judgement, because then two
;; referees exist and the board can fork.
;;
;; Version 1 is deliberately wide open. Anyone may open a game. Anyone may
;; submit the next move of any game. There is no cooldown, no turn check, and
;; no binding of a colour to an address. Turn order needs no enforcement here:
;; a move for the wrong side is simply not legal in the current position, so
;; replay skips it like any other illegal move.
;;
;; PERMANENT FORMAT NOTES. Descendants inherit these, so they are fixed:
;;
;;   * A move is UCI: four or five ASCII characters, from-square then
;;     to-square, with an optional promotion piece. "e2e4", "e7e8q".
;;   * Replay order is the seq counter and nothing else. Never derive order
;;     from block height, timestamps, or anything that can tie within a block.
;;   * seq is a sequence number, not a ply count. It counts submissions,
;;     including ones replay will skip, so it drifts from the real ply count.
;;     Never treat it as a chess concept.
;;   * A game id is only unique within this contract, so a globally meaningful
;;     id is this contract principal plus the game number.

(define-constant FORMAT-VERSION u1)

(define-constant ERR-NO-GAME    (err u100))
(define-constant ERR-BAD-LENGTH (err u101))
(define-constant ERR-LOG-FULL   (err u102))

;; A generous ceiling on submissions per game. Real games run to roughly eighty
;; plies and the fifty move rule bounds them well below this, but the log also
;; holds submissions that replay rejects, so there is room for noise.
(define-constant MAX-SEQ u4096)

(define-data-var game-count uint u0)

(define-map Games
  uint
  {
    opened-by: principal,
    opened-at: uint,
    next-seq: uint
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
;; Public
;; --------------------------------------------------------------------------

;; Open a new game and return its id. Games are numbered from u1 so that the
;; renderer can walk 1..game-count without a registry.
(define-public (open-game)
  (let
    (
      (id (+ (var-get game-count) u1))
    )
    (map-set Games id
      {
        opened-by: tx-sender,
        opened-at: stacks-block-height,
        next-seq: u0
      }
    )
    (var-set game-count id)
    (print
      {
        event: "game-opened",
        game: id,
        opened-by: tx-sender,
        height: stacks-block-height
      }
    )
    (ok id)
  )
)

;; Append a submission to a game's log.
;;
;; The only check is that the string is four or five characters. That is a
;; filter, not a judgement: it keeps arbitrary junk out of storage without the
;; contract forming any opinion about chess. Character validation is left out
;; on purpose, because the renderer rejects anything unparseable anyway and the
;; runtime cost is better spent nowhere.
(define-public (submit-move (game uint) (mv (string-ascii 5)))
  (let
    (
      (entry (unwrap! (map-get? Games game) ERR-NO-GAME))
      (seq (get next-seq entry))
      (size (len mv))
    )
    (asserts! (or (is-eq size u4) (is-eq size u5)) ERR-BAD-LENGTH)
    (asserts! (< seq MAX-SEQ) ERR-LOG-FULL)
    (map-set Moves
      { game: game, seq: seq }
      {
        mv: mv,
        sender: tx-sender,
        height: stacks-block-height
      }
    )
    (map-set Games game (merge entry { next-seq: (+ seq u1) }))
    (print
      {
        event: "move-submitted",
        game: game,
        seq: seq,
        mv: mv,
        sender: tx-sender,
        height: stacks-block-height
      }
    )
    (ok seq)
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

(define-read-only (get-game-count)
  (var-get game-count)
)

(define-read-only (get-game (game uint))
  (map-get? Games game)
)

(define-read-only (get-move (game uint) (seq uint))
  (map-get? Moves { game: game, seq: seq })
)

;; Page size for get-page. Fixed because Clarity needs a concrete list to fold
;; over, and the renderer pages until it has caught up with next-seq.
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

;; Return up to fifty consecutive log entries starting at `start`. Trailing
;; `none` values mean the caller has reached the end of the log. Read only
;; calls cost nothing, so paging is free for the renderer.
(define-read-only (get-page (game uint) (start uint))
  (get out
    (fold page-step
      PAGE-OFFSETS
      { game: game, start: start, out: (list) }
    )
  )
)
