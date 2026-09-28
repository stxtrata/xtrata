;; xtrata-arcade-scores-v2
;;
;; On-chain arcade leaderboards with stored, replayable runs.
;;
;; - The owner registers boards (e.g. "astro3", "astro3-daily"). Unregistered
;;   board ids are rejected.
;; - Each board keeps a ranked Top 10 per period. Non-daily boards use period
;;   u0. Daily boards use period = burn-block-height / 144 (about one Bitcoin
;;   day); a run may be submitted for the current or the previous period.
;; - One entry per wallet per board-period: a better score replaces the old
;;   entry, a worse or equal one is refused.
;; - Every entry stores the replay bytes of the run that produced it, so
;;   anyone can re-play and verify it. Replays that fall off the Top 10 are
;;   deleted, so at most 10 replays are stored per board-period.
;; - Ties: the earlier entry keeps its place.
;; - The owner may void an entry (intended only for replays that fail
;;   verification); the reason is printed on-chain and the wallet is barred
;;   from that board until the owner lifts it.
;; - Replay binding: bytes 4..23 of every replay must equal the submitting
;;   wallet's hash160. Replays mix this "pilot" into the run, so a run cannot be
;;   copied and submitted from another wallet (or front-run from the mempool).
;;
;; Mode values: u0 => higher score wins, u1 => lower score wins (time).

(define-constant ERR-NOT-AUTHORIZED   (err u100))
(define-constant ERR-PAUSED           (err u101))
(define-constant ERR-NO-BOARD         (err u102))
(define-constant ERR-BOARD-DISABLED   (err u103))
(define-constant ERR-INVALID-SCORE    (err u104))
(define-constant ERR-INVALID-NAME     (err u105))
(define-constant ERR-INVALID-PERIOD   (err u106))
(define-constant ERR-EMPTY-REPLAY     (err u107))
(define-constant ERR-NOT-IMPROVED     (err u108))
(define-constant ERR-NOT-TOP10        (err u109))
(define-constant ERR-INVALID-BOARD    (err u110))
(define-constant ERR-NO-ENTRY         (err u111))
(define-constant ERR-NO-PENDING-OWNER (err u112))
(define-constant ERR-WRONG-PILOT      (err u113))
(define-constant ERR-BANNED           (err u114))

(define-constant MODE-HIGH u0)
(define-constant MODE-LOW  u1)
(define-constant PERIOD-BLOCKS u144)
(define-constant MAX-FEE u1000000)
(define-constant NAME-CHARS "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 _-.")
(define-constant RANKS (list u1 u2 u3 u4 u5 u6 u7 u8 u9 u10))
(define-constant SHIFT-DOWN-ORDER (list u9 u8 u7 u6 u5 u4 u3 u2 u1))

(define-data-var contract-owner principal tx-sender)
(define-data-var pending-owner (optional principal) none)
(define-data-var fee-recipient principal tx-sender)
(define-data-var paused bool false)

(define-map Boards
  (string-ascii 24)
  {
    mode: uint,
    max-score: uint,
    fee: uint,
    engine-id: uint,
    daily: bool,
    enabled: bool
  }
)

(define-map Slots
  { board: (string-ascii 24), period: uint, rank: uint }
  {
    player: principal,
    name: (string-ascii 12),
    score: uint,
    stacks-height: uint,
    burn-height: uint,
    engine-id: uint,
    replay-hash: (buff 32)
  }
)

(define-map PlayerRank
  { board: (string-ascii 24), period: uint, player: principal }
  uint
)

(define-map Replays
  { board: (string-ascii 24), period: uint, player: principal }
  (buff 65536)
)

(define-map Banned
  { board: (string-ascii 24), player: principal }
  bool
)

;; ---------------------------------------------------------------------------
;; Private helpers
;; ---------------------------------------------------------------------------

(define-private (is-owner)
  (is-eq tx-sender (var-get contract-owner))
)

(define-private (better? (mode uint) (a uint) (b uint))
  (if (is-eq mode MODE-LOW) (< a b) (> a b))
)

(define-private (valid-char (c (string-ascii 1)) (acc bool))
  (and acc (is-some (index-of? NAME-CHARS c)))
)

(define-private (valid-name? (name (string-ascii 12)))
  (and (>= (len name) u3) (fold valid-char name true))
)

(define-private (period-ok? (daily bool) (period uint))
  (if daily
    (let ((cur (/ burn-block-height PERIOD-BLOCKS)))
      (or (is-eq period cur) (is-eq (+ period u1) cur)))
    (is-eq period u0)
  )
)

(define-private (move-slot (board (string-ascii 24)) (period uint) (from uint) (to uint))
  (match (map-get? Slots { board: board, period: period, rank: from })
    entry
      (begin
        (map-set Slots { board: board, period: period, rank: to } entry)
        (map-set PlayerRank { board: board, period: period, player: (get player entry) } to))
    (map-delete Slots { board: board, period: period, rank: to })
  )
)

(define-private (shift-down-step
  (r uint)
  (ctx { board: (string-ascii 24), period: uint, start: uint })
)
  (begin
    (if (>= r (get start ctx))
      (move-slot (get board ctx) (get period ctx) r (+ r u1))
      false)
    ctx
  )
)

(define-private (shift-up-step
  (r uint)
  (ctx { board: (string-ascii 24), period: uint, start: uint })
)
  (begin
    (if (>= r (get start ctx))
      (move-slot (get board ctx) (get period ctx) (+ r u1) r)
      false)
    ctx
  )
)

;; Removes a player's entry at `rank` and closes the gap.
(define-private (remove-entry (board (string-ascii 24)) (period uint) (player principal) (rank uint))
  (begin
    (map-delete PlayerRank { board: board, period: period, player: player })
    (map-delete Replays { board: board, period: period, player: player })
    (fold shift-up-step RANKS { board: board, period: period, start: rank })
    true
  )
)

;; Counts entries (other than `player`) that stay ahead of `score`.
;; An equal score stays ahead (the earlier entry keeps its place).
(define-private (count-ahead-step
  (r uint)
  (ctx { board: (string-ascii 24), period: uint, mode: uint, score: uint, player: principal, n: uint })
)
  (match (map-get? Slots { board: (get board ctx), period: (get period ctx), rank: r })
    entry
      (if (and
            (not (is-eq (get player entry) (get player ctx)))
            (not (better? (get mode ctx) (get score ctx) (get score entry))))
        (merge ctx { n: (+ (get n ctx) u1) })
        ctx)
    ctx
  )
)

(define-private (rank-for (board (string-ascii 24)) (period uint) (mode uint) (score uint) (player principal))
  (+ u1 (get n (fold count-ahead-step RANKS
    { board: board, period: period, mode: mode, score: score, player: player, n: u0 })))
)

(define-private (sender-hash160)
  (match (principal-destruct? tx-sender)
    ok-parts (get hash-bytes ok-parts)
    err-parts (get hash-bytes err-parts)
  )
)

(define-private (pay-fee (amount uint))
  (if (or (is-eq amount u0) (is-eq tx-sender (var-get fee-recipient)))
    (ok true)
    (stx-transfer? amount tx-sender (var-get fee-recipient))
  )
)

(define-private (evict-last (board (string-ascii 24)) (period uint))
  (match (map-get? Slots { board: board, period: period, rank: u10 })
    last
      (begin
        (map-delete PlayerRank { board: board, period: period, player: (get player last) })
        (map-delete Replays { board: board, period: period, player: (get player last) })
        (print {
          event: "score-evicted",
          board: board,
          period: period,
          player: (get player last),
          score: (get score last)
        })
        true)
    true
  )
)

;; ---------------------------------------------------------------------------
;; Public: submit
;; ---------------------------------------------------------------------------

(define-public (submit-score
  (board-id (string-ascii 24))
  (period uint)
  (score uint)
  (name (string-ascii 12))
  (replay (buff 65536))
)
  (let (
    (board (unwrap! (map-get? Boards board-id) ERR-NO-BOARD))
    (mode (get mode board))
    (player tx-sender)
    (pkey { board: board-id, period: period, player: tx-sender })
    (replay-hash (sha256 replay))
  )
    (asserts! (not (var-get paused)) ERR-PAUSED)
    (asserts! (get enabled board) ERR-BOARD-DISABLED)
    (asserts! (and (> score u0) (<= score (get max-score board))) ERR-INVALID-SCORE)
    (asserts! (valid-name? name) ERR-INVALID-NAME)
    (asserts! (period-ok? (get daily board) period) ERR-INVALID-PERIOD)
    (asserts! (> (len replay) u0) ERR-EMPTY-REPLAY)
    (asserts! (is-none (map-get? Banned { board: board-id, player: player })) ERR-BANNED)
    (asserts! (is-eq (unwrap! (slice? replay u4 u24) ERR-WRONG-PILOT) (sender-hash160)) ERR-WRONG-PILOT)

    ;; One entry per wallet: a better score replaces the old one.
    (match (map-get? PlayerRank pkey)
      old-rank
        (let ((old (unwrap-panic (map-get? Slots { board: board-id, period: period, rank: old-rank }))))
          (asserts! (better? mode score (get score old)) ERR-NOT-IMPROVED)
          (remove-entry board-id period player old-rank))
      true)

    (let ((rank (rank-for board-id period mode score player)))
      (asserts! (<= rank u10) ERR-NOT-TOP10)
      (evict-last board-id period)
      (fold shift-down-step SHIFT-DOWN-ORDER { board: board-id, period: period, start: rank })
      (map-set Slots { board: board-id, period: period, rank: rank }
        {
          player: player,
          name: name,
          score: score,
          stacks-height: stacks-block-height,
          burn-height: burn-block-height,
          engine-id: (get engine-id board),
          replay-hash: replay-hash
        })
      (map-set PlayerRank pkey rank)
      (map-set Replays pkey replay)
      (try! (pay-fee (get fee board)))
      (print {
        event: "score-submitted",
        board: board-id,
        period: period,
        player: player,
        name: name,
        score: score,
        rank: rank,
        engine-id: (get engine-id board),
        replay-hash: replay-hash,
        replay-bytes: (len replay),
        fee: (get fee board)
      })
      (ok rank)
    )
  )
)

;; ---------------------------------------------------------------------------
;; Public: owner
;; ---------------------------------------------------------------------------

(define-public (set-board
  (board-id (string-ascii 24))
  (mode uint)
  (max-score uint)
  (fee uint)
  (engine-id uint)
  (daily bool)
  (enabled bool)
)
  (begin
    (asserts! (is-owner) ERR-NOT-AUTHORIZED)
    (asserts! (> (len board-id) u0) ERR-INVALID-BOARD)
    (asserts! (or (is-eq mode MODE-HIGH) (is-eq mode MODE-LOW)) ERR-INVALID-BOARD)
    (asserts! (> max-score u0) ERR-INVALID-BOARD)
    (asserts! (<= fee MAX-FEE) ERR-INVALID-BOARD)
    ;; a board's ordering can never change once it exists
    (match (map-get? Boards board-id)
      existing (asserts! (is-eq (get mode existing) mode) ERR-INVALID-BOARD)
      true)
    (map-set Boards board-id
      { mode: mode, max-score: max-score, fee: fee, engine-id: engine-id, daily: daily, enabled: enabled })
    (print { event: "board-set", board: board-id, mode: mode, max-score: max-score, fee: fee,
             engine-id: engine-id, daily: daily, enabled: enabled })
    (ok true)
  )
)

(define-public (set-board-enabled (board-id (string-ascii 24)) (enabled bool))
  (let ((board (unwrap! (map-get? Boards board-id) ERR-NO-BOARD)))
    (asserts! (is-owner) ERR-NOT-AUTHORIZED)
    (map-set Boards board-id (merge board { enabled: enabled }))
    (print { event: "board-enabled", board: board-id, enabled: enabled })
    (ok true)
  )
)

;; Intended only for entries whose replay fails verification.
(define-public (void-entry
  (board-id (string-ascii 24))
  (period uint)
  (player principal)
  (reason (string-ascii 64))
)
  (let ((rank (unwrap! (map-get? PlayerRank { board: board-id, period: period, player: player }) ERR-NO-ENTRY))
        (entry (unwrap-panic (map-get? Slots { board: board-id, period: period, rank: rank }))))
    (asserts! (is-owner) ERR-NOT-AUTHORIZED)
    (remove-entry board-id period player rank)
    (map-set Banned { board: board-id, player: player } true)
    (print { event: "entry-voided", board: board-id, period: period, player: player,
             score: (get score entry), replay-hash: (get replay-hash entry), reason: reason })
    (ok true)
  )
)

(define-public (set-banned (board-id (string-ascii 24)) (player principal) (banned bool))
  (begin
    (asserts! (is-owner) ERR-NOT-AUTHORIZED)
    (if banned
      (map-set Banned { board: board-id, player: player } true)
      (map-delete Banned { board: board-id, player: player }))
    (print { event: "banned", board: board-id, player: player, banned: banned })
    (ok true)
  )
)

(define-public (set-paused (value bool))
  (begin
    (asserts! (is-owner) ERR-NOT-AUTHORIZED)
    (var-set paused value)
    (print { event: "paused", value: value })
    (ok true)
  )
)

(define-public (set-fee-recipient (recipient principal))
  (begin
    (asserts! (is-owner) ERR-NOT-AUTHORIZED)
    (var-set fee-recipient recipient)
    (ok true)
  )
)

(define-public (propose-owner (new-owner principal))
  (begin
    (asserts! (is-owner) ERR-NOT-AUTHORIZED)
    (var-set pending-owner (some new-owner))
    (ok true)
  )
)

(define-public (accept-owner)
  (let ((pending (unwrap! (var-get pending-owner) ERR-NO-PENDING-OWNER)))
    (asserts! (is-eq tx-sender pending) ERR-NOT-AUTHORIZED)
    (var-set contract-owner pending)
    (var-set pending-owner none)
    (print { event: "owner-changed", owner: pending })
    (ok true)
  )
)

;; ---------------------------------------------------------------------------
;; Read-only
;; ---------------------------------------------------------------------------

(define-read-only (current-period)
  (/ burn-block-height PERIOD-BLOCKS)
)

(define-read-only (get-board (board-id (string-ascii 24)))
  (map-get? Boards board-id)
)

(define-read-only (get-entry (board-id (string-ascii 24)) (period uint) (rank uint))
  (map-get? Slots { board: board-id, period: period, rank: rank })
)

(define-read-only (get-top10 (board-id (string-ascii 24)) (period uint))
  (list
    (map-get? Slots { board: board-id, period: period, rank: u1 })
    (map-get? Slots { board: board-id, period: period, rank: u2 })
    (map-get? Slots { board: board-id, period: period, rank: u3 })
    (map-get? Slots { board: board-id, period: period, rank: u4 })
    (map-get? Slots { board: board-id, period: period, rank: u5 })
    (map-get? Slots { board: board-id, period: period, rank: u6 })
    (map-get? Slots { board: board-id, period: period, rank: u7 })
    (map-get? Slots { board: board-id, period: period, rank: u8 })
    (map-get? Slots { board: board-id, period: period, rank: u9 })
    (map-get? Slots { board: board-id, period: period, rank: u10 })
  )
)

(define-read-only (get-player-rank (board-id (string-ascii 24)) (period uint) (player principal))
  (map-get? PlayerRank { board: board-id, period: period, player: player })
)

(define-read-only (get-replay (board-id (string-ascii 24)) (period uint) (player principal))
  (map-get? Replays { board: board-id, period: period, player: player })
)

;; The rank `score` would take for `player`, or u0 if it would be refused
;; (no board, disabled, bad period, out of range, not an improvement, not Top 10).
(define-read-only (preview-rank (board-id (string-ascii 24)) (period uint) (score uint) (player principal))
  (match (map-get? Boards board-id)
    board
      (let (
        (mode (get mode board))
        (existing (map-get? PlayerRank { board: board-id, period: period, player: player }))
        (improves (match existing
          r (match (map-get? Slots { board: board-id, period: period, rank: r })
              e (better? mode score (get score e))
              true)
          true))
        (rank (rank-for board-id period mode score player))
      )
        (if (and
              (get enabled board)
              (not (var-get paused))
              (> score u0)
              (<= score (get max-score board))
              (period-ok? (get daily board) period)
              improves
              (is-none (map-get? Banned { board: board-id, player: player }))
              (<= rank u10))
          rank
          u0))
    u0
  )
)

(define-read-only (is-banned (board-id (string-ascii 24)) (player principal))
  (is-some (map-get? Banned { board: board-id, player: player }))
)

(define-read-only (get-owner) (var-get contract-owner))
(define-read-only (get-pending-owner) (var-get pending-owner))
(define-read-only (get-fee-recipient) (var-get fee-recipient))
(define-read-only (is-paused) (var-get paused))
