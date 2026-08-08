;; xchess-core-v1
;;
;; An append-only log of game submissions, and a creator-funded on-chain reserve
;; that pays a player's gas back to them.
;;
;; The rule that governs every line below:
;;
;;     THE CONTRACT MAY FILTER, NEVER ADJUDICATE.
;;
;; This contract does not know the rules of chess and must never learn them. It
;; stores short strings in a total order and forms no opinion about them. It
;; does not know whose turn it is, whether a move is legal, what check is, who
;; won, or that some of the strings it stores are not moves at all.
;;
;; Two consequences, and they are the whole design:
;;
;;   * Anything this contract rejects never enters the log, so a filter is safe:
;;     every reader sees the same log because the rejected thing is not in it.
;;   * Anything it wrongly accepts is skipped identically by every reader,
;;     because replay is a pure total function of the log.
;;
;; The only filter is length. Four or five characters. Nothing else.
;;
;; ---------------------------------------------------------------------------
;; Clarity 4, and why that is not optional
;; ---------------------------------------------------------------------------
;;
;; `as-contract` does not exist in Clarity 4. It was replaced by `as-contract?`,
;; which requires an explicit allowance for every asset that leaves. Since the
;; sponsorship reserve requires this contract to spend from its own balance,
;; Clarity 4 is forced rather than chosen. See ops/DECISIONS.md ADR-0001.
;;
;; That requirement turns out to be a gift. Every payout below is wrapped in an
;; allowance for exactly the amount the accounting says is owed, so a bug in the
;; arithmetic cannot drain the reserve: the language aborts the call before our
;; own arithmetic gets a chance to be wrong.
;;
;; ---------------------------------------------------------------------------
;; Solvency
;; ---------------------------------------------------------------------------
;;
;; One invariant governs the money, and every test asserts it:
;;
;;     (stx-get-balance SELF) >= (var-get total-reserved)
;;
;; `total-reserved` is the sum of every outstanding sponsorship's remaining
;; liability. Anything above it is treasury and may be withdrawn; anything at or
;; below it belongs to games that have not finished with it yet. One game's
;; reserve can never be spent by another, because a payout is only ever made
;; against that game's own recorded remainder, and the allowance is written for
;; that exact number.

(define-constant FORMAT-VERSION u1)
(define-constant PROTOCOL "xchess-core-v1")

;; This contract's own principal. Clarity 4 has no `self` keyword and no
;; `as-contract`; `(as-contract? () tx-sender)` with no allowances and no
;; outflow is the way to ask.
(define-constant SELF (unwrap-panic (as-contract? () tx-sender)))

;; --------------------------------------------------------------------------
;; Errors
;; --------------------------------------------------------------------------

(define-constant ERR-NO-GAME          (err u100))
(define-constant ERR-BAD-LENGTH       (err u101))
(define-constant ERR-LOG-FULL         (err u102))
(define-constant ERR-NOT-OWNER        (err u103))
(define-constant ERR-ABOVE-CEILING    (err u104))
(define-constant ERR-NO-SPONSORSHIP   (err u106))
(define-constant ERR-ALREADY-SPONSORED (err u107))
(define-constant ERR-NOT-EXPIRED      (err u108))
(define-constant ERR-ALREADY-SETTLED  (err u109))
(define-constant ERR-WOULD-UNDERFUND  (err u110))
(define-constant ERR-SAME-BENEFICIARY (err u111))
(define-constant ERR-ALLOWANCE        (err u113))
(define-constant ERR-NOT-CLAIMANT     (err u114))

;; A ceiling on submissions per game, high enough that reaching it is a
;; deliberate act rather than an accident. It started at 4,096 in an earlier
;; design, which was a cheap denial of service: fill a game's log and nobody can
;; ever move in it again. It cannot be raised after deployment, so it is set
;; high now.
(define-constant MAX-SEQ u65536)

;; Ceilings no owner can ever exceed, fixed in the code where no owner can reach
;; them. Without these, "configurable fee" would mean the owner can close the
;; board at will.
(define-constant OPEN-FEE-CEILING     u10000000)  ;; 10 STX
(define-constant BOOTSTRAP-CEILING    u1000000)   ;; 1 STX
(define-constant REBATE-CEILING       u100000)    ;; 0.1 STX
(define-constant REBATE-COUNT-CEILING u200)
(define-constant MARGIN-CEILING       u1000000)   ;; 1 STX

;; --------------------------------------------------------------------------
;; Configuration
;;
;; Every one of these is a launch parameter measured by the harness rather than
;; guessed. The values here are starting points; ops/DECISIONS.md records the
;; measurement that fixes them.
;; --------------------------------------------------------------------------

(define-data-var open-fee uint u1000000)        ;; 1 STX to open a game

;; The sponsorship constants, set from ops/measurements/sponsorship-sweep.json
;; and recorded in ADR-0004. They are not guesses and they are not the brief's
;; illustrative figures, which assumed a network fee this chain does not have.
;;
;; The rebate is set TO the observed mainnet fee for a contract call rather than
;; below it. That is the whole design: at or under the design fee a sponsored
;; player is never out of pocket, so the bootstrap is never touched and is still
;; theirs at the end. Setting the rebate below the fee would make every move
;; drain the bootstrap a little, and the sweep shows exactly how fast that ends
;; a game.
(define-data-var bootstrap-amount uint u60000)  ;; 0.06 STX, six transactions of headroom
(define-data-var rebate-amount uint u10000)     ;; 0.01 STX, the measured mainnet fee
(define-data-var rebate-count uint u45)         ;; a full game for one player, plus a margin
(define-data-var sponsor-margin uint u50000)    ;; 0.05 STX
(define-data-var expiry-blocks uint u4320)      ;; when an unused reserve may be released

(define-data-var owner (optional principal) (some tx-sender))

;; --------------------------------------------------------------------------
;; Storage
;;
;; Keyed by (game, seq) rather than a growing list. This is load-bearing: a map
;; keyed by sequence gives flat cost per entry, while appending to a list means
;; reading and rewriting the whole list, so move eighty would cost far more than
;; move two, and long games are exactly the ones most worth having.
;;
;; Deliberately absent: the board position, whose turn it is, and who won. All
;; three are derived by replay, and storing any of them would be the contract
;; forming a chess opinion.
;; --------------------------------------------------------------------------

(define-data-var game-count uint u0)

(define-map Games
  uint
  {
    opened-by: principal,
    opened-at: uint,
    next-seq: uint,
    ;; The commitment that pins a game's rules. The rules themselves live in the
    ;; board, because every one of them is a question about the log.
    rules-hash: (optional (buff 32)),
    ;; A DISCOVERY HINT and nothing more. The truth about whether a game is
    ;; ranked is inside the rules that hash to rules-hash. A game that claims
    ;; ranked here but commits to unranked rules simply fails eligibility when a
    ;; reader checks it, and contributes to nobody's rating.
    ranked: bool
  }
)

(define-map Entries
  { game: uint, seq: uint }
  {
    value: (string-ascii 5),
    sender: principal,
    height: uint
  }
)

;; --------------------------------------------------------------------------
;; Sponsorship
;;
;; One row per (game, beneficiary). Bounded twice over, by a count and by a STX
;; liability, so that neither an unexpectedly long game nor a change in the
;; rebate amount can turn a bounded promise into an unbounded one.
;; --------------------------------------------------------------------------

(define-map Sponsorships
  { game: uint, who: principal }
  {
    ;; How many more submissions earn a rebate.
    rebates-left: uint,
    ;; The fixed amount per rebate, captured at funding time. Read from the row
    ;; and never from the current configuration, so that changing the setting
    ;; cannot alter a promise already paid for.
    rebate: uint,
    ;; Remaining STX liability. The hard cap: whichever of this and rebates-left
    ;; runs out first ends the sponsorship.
    reserved: uint,
    ;; After this height anyone may release whatever is left to the treasury.
    expiry: uint,
    settled: bool,
    funded-by: principal
  }
)

;; The sum of every outstanding `reserved`. The number the solvency invariant is
;; written against.
(define-data-var total-reserved uint u0)

;; --------------------------------------------------------------------------
;; Ranked index and result hints
;;
;; Both are DISCOVERY aids. Neither is authoritative and neither is validated
;; here, validating a chess result would be adjudication. A reader finds a
;; candidate through these, then fetches the log and replays it. A dishonest
;; hint simply fails verification and is ignored.
;; --------------------------------------------------------------------------

(define-data-var ranked-count uint u0)
(define-map RankedIndex uint uint)

(define-map ResultHints
  uint
  {
    result: (string-ascii 7),
    terminal-seq: uint,
    claimant: principal,
    height: uint
  }
)

;; --------------------------------------------------------------------------
;; Money
;; --------------------------------------------------------------------------

(define-private (is-owner)
  (match (var-get owner) who (is-eq tx-sender who) false)
)

;; Everything paid in is held by the contract, not forwarded to a recipient.
;; That is what lets the solvency invariant be stated about a single balance.
(define-private (collect (amount uint))
  (if (is-eq amount u0)
    (ok true)
    (stx-transfer? amount tx-sender SELF)
  )
)

;; THE ONLY PLACE STX LEAVES THIS CONTRACT.
;;
;; One helper, so there is exactly one site the solvency invariant has to be
;; defended at. No caller writes `as-contract?` inline.
;;
;; The allowance is written for exactly `amount`, computed from recorded state,
;; never a ceiling and never a round number. If the body tried to move more, the
;; language reverts the whole thing and returns the index of the allowance that
;; was violated, which is what ERR-ALLOWANCE reports.
;;
;; The two failure layers stay distinguishable. A failed transfer propagates its
;; own error through the inner `try!`; a violated allowance is caught by the
;; match. Reporting both as one code would hide an accounting bug behind a
;; funding problem, or the reverse.
(define-private (pay-out (amount uint) (to principal))
  (if (is-eq amount u0)
    (ok true)
    (match (as-contract? ((with-stx amount)) (try! (stx-transfer? amount tx-sender to)))
      paid (ok paid)
      violated ERR-ALLOWANCE
    )
  )
)

;; What the contract may pay out to nobody in particular: everything it holds
;; beyond what it owes. Never negative, because a subtraction that would go
;; below zero is the insolvency this whole file exists to prevent.
(define-read-only (get-withdrawable)
  (let ((balance (stx-get-balance SELF)) (owed (var-get total-reserved)))
    (if (> balance owed) (- balance owed) u0)
  )
)

(define-private (reserve (amount uint))
  (var-set total-reserved (+ (var-get total-reserved) amount))
)

;; Guarded rather than trusted. `total-reserved` should never be asked to drop
;; below zero, and if a bug ever asked it to, clamping is the safe direction:
;; it over-reports what is owed, which blocks a withdrawal rather than allowing
;; one it should not.
(define-private (release (amount uint))
  (let ((owed (var-get total-reserved)))
    (var-set total-reserved (if (> amount owed) u0 (- owed amount)))
  )
)

;; --------------------------------------------------------------------------
;; Opening a game
;; --------------------------------------------------------------------------

(define-private (register (rules-hash (optional (buff 32))) (ranked bool))
  (let ((id (+ (var-get game-count) u1)))
    ;; #[allow(unchecked_data)]
    (map-set Games id
      {
        opened-by: tx-sender,
        opened-at: stacks-block-height,
        next-seq: u0,
        rules-hash: rules-hash,
        ranked: ranked
      }
    )
    (var-set game-count id)
    (if ranked
      (let ((index (var-get ranked-count)))
        (map-set RankedIndex index id)
        (var-set ranked-count (+ index u1))
      )
      true
    )
    (print
      {
        event: "game-opened",
        game: id,
        opened-by: tx-sender,
        height: stacks-block-height,
        rules-hash: rules-hash,
        ranked: ranked,
        fee: (var-get open-fee)
      }
    )
    id
  )
)

;; A standard game. The creator pays the base fee; both players pay their own
;; network fees from here on.
(define-public (open-game (rules-hash (optional (buff 32))) (ranked bool))
  (begin
    ;; Charged before anything is written, so a sender who cannot pay leaves no
    ;; trace and consumes no game id.
    (try! (collect (var-get open-fee)))
    (ok (register rules-hash ranked))
  )
)

;; What sponsoring one player costs, and what of it is a liability.
(define-read-only (get-sponsor-price)
  (let (
      (bootstrap (var-get bootstrap-amount))
      (liability (* (var-get rebate-amount) (var-get rebate-count)))
    )
    {
      bootstrap: bootstrap,
      liability: liability,
      margin: (var-get sponsor-margin),
      total: (+ bootstrap (+ liability (var-get sponsor-margin)))
    }
  )
)

;; Fund one beneficiary: hand over the bootstrap at once, and reserve the rest.
;;
;; The bootstrap leaves immediately and is not reserved, because it is no longer
;; the contract's money. The rebate pool is reserved and stays on the balance
;; sheet until it is spent or released.
(define-private (fund (game uint) (who principal))
  (let (
      (price (get-sponsor-price))
      (liability (get liability price))
    )
    (asserts! (is-none (map-get? Sponsorships { game: game, who: who })) ERR-ALREADY-SPONSORED)

    ;; #[allow(unchecked_data)]
    (map-set Sponsorships { game: game, who: who }
      {
        rebates-left: (var-get rebate-count),
        rebate: (var-get rebate-amount),
        reserved: liability,
        expiry: (+ stacks-block-height (var-get expiry-blocks)),
        settled: false,
        funded-by: tx-sender
      }
    )
    (reserve liability)

    ;; Reserved before the bootstrap goes out, so that at no point inside this
    ;; call does the contract hold less than it claims to owe.
    (try! (pay-out (get bootstrap price) who))

    (print
      {
        event: "sponsorship-funded",
        game: game,
        who: who,
        funded-by: tx-sender,
        bootstrap: (get bootstrap price),
        reserved: liability,
        rebate: (var-get rebate-amount),
        rebates: (var-get rebate-count),
        expiry: (+ stacks-block-height (var-get expiry-blocks))
      }
    )
    (ok true)
  )
)

;; Sponsor a named opponent. The creator pays their own gas; the opponent may
;; start with nothing at all.
;;
;; Named, and it has to be. An open game cannot bootstrap an unknown future
;; player, because that player would have to send a transaction to say who they
;; are and has no STX to pay for it. This is a real limit of the protocol and it
;; is stated in the UI rather than hidden. See SPONSORSHIP-V1.md.
(define-public (open-sponsored-game
    (rules-hash (optional (buff 32)))
    (ranked bool)
    (opponent principal)
  )
  (let ((price (get-sponsor-price)))
    (asserts! (not (is-eq opponent tx-sender)) ERR-SAME-BENEFICIARY)
    (try! (collect (+ (var-get open-fee) (get total price))))
    (let ((id (register rules-hash ranked)))
      (try! (fund id opponent))
      (ok id)
    )
  )
)

;; Sponsor both sides. For exhibitions, demos, events, onboarding and
;; tournaments, where neither player should have to think about gas.
(define-public (open-sponsored-both
    (rules-hash (optional (buff 32)))
    (ranked bool)
    (white principal)
    (black principal)
  )
  (let ((price (get-sponsor-price)))
    (asserts! (not (is-eq white black)) ERR-SAME-BENEFICIARY)
    (try! (collect (+ (var-get open-fee) (* u2 (get total price)))))
    (let ((id (register rules-hash ranked)))
      (try! (fund id white))
      (try! (fund id black))
      (ok id)
    )
  )
)

;; More sponsorship for a game already running. Anybody may pay: the creator,
;; either player, a third party, a tournament organiser. No billing system and
;; no account, the payment is the transaction.
(define-public (top-up-sponsorship (game uint) (who principal))
  (let (
      (existing (unwrap! (map-get? Sponsorships { game: game, who: who }) ERR-NO-SPONSORSHIP))
      (price (get-sponsor-price))
      (liability (get liability price))
    )
    (asserts! (is-some (map-get? Games game)) ERR-NO-GAME)
    (asserts! (not (get settled existing)) ERR-ALREADY-SETTLED)

    ;; The margin is charged again; the bootstrap is not. The wallet is already
    ;; funded, that was the bootstrap's whole job, so charging for it twice
    ;; would be selling something the buyer already has.
    (try! (collect (+ liability (var-get sponsor-margin))))

    ;; #[allow(unchecked_data)]
    (map-set Sponsorships { game: game, who: who }
      (merge existing
        {
          rebates-left: (+ (get rebates-left existing) (var-get rebate-count)),
          reserved: (+ (get reserved existing) liability),
          expiry: (+ stacks-block-height (var-get expiry-blocks))
        }
      )
    )
    (reserve liability)
    (print
      {
        event: "sponsorship-topped-up",
        game: game,
        who: who,
        by: tx-sender,
        added: liability,
        rebates-added: (var-get rebate-count)
      }
    )
    (ok true)
  )
)

;; --------------------------------------------------------------------------
;; Submitting
;; --------------------------------------------------------------------------

;; Pay the sender's rebate, if they have one left.
;;
;; Silent when there is nothing to pay. Running out of sponsorship is an
;; ordinary economic state, never an error and never a reason to refuse a
;; submission: the game carries on and the player starts paying their own gas.
;;
;; Both bounds are checked. `rebates-left` alone would not be enough, because
;; the configured rebate could have changed since funding; `reserved` alone
;; would not be enough either, because it is the money and not the promise. A
;; payout happens only when both still allow it.
(define-private (maybe-rebate (game uint) (who principal))
  (match (map-get? Sponsorships { game: game, who: who })
    sponsorship
      (let ((amount (get rebate sponsorship)))
        (if (or
              (get settled sponsorship)
              (is-eq (get rebates-left sponsorship) u0)
              (< (get reserved sponsorship) amount)
            )
          (ok false)
          (begin
            ;; Bookkeeping before the money moves, so the recorded liability is
            ;; never higher than what the contract still holds against it.
            (map-set Sponsorships { game: game, who: who }
              (merge sponsorship
                {
                  rebates-left: (- (get rebates-left sponsorship) u1),
                  reserved: (- (get reserved sponsorship) amount)
                }
              )
            )
            (release amount)
            (try! (pay-out amount who))
            (print
              {
                event: "rebate-paid",
                game: game,
                who: who,
                amount: amount,
                rebates-left: (- (get rebates-left sponsorship) u1)
              }
            )
            (ok true)
          )
        )
      )
    (ok false)
  )
)

;; The only way anything enters the log.
;;
;; The length check is the only filter, and there is deliberately nothing else.
;; No character validation: replay rejects anything unparseable anyway, and the
;; runtime cost is better spent nowhere. The contract has no idea what a square
;; is, and must not acquire one.
(define-public (submit (game uint) (value (string-ascii 5)))
  (let (
      (entry (unwrap! (map-get? Games game) ERR-NO-GAME))
      (seq (get next-seq entry))
      (size (len value))
    )
    ;; Cheap checks first: a refusal should cost nothing.
    (asserts! (or (is-eq size u4) (is-eq size u5)) ERR-BAD-LENGTH)
    (asserts! (< seq MAX-SEQ) ERR-LOG-FULL)

    ;; #[allow(unchecked_data)]
    (map-set Entries
      { game: game, seq: seq }
      { value: value, sender: tx-sender, height: stacks-block-height }
    )
    ;; #[allow(unchecked_data)]
    (map-set Games game (merge entry { next-seq: (+ seq u1) }))
    (print
      {
        event: "entry-submitted",
        game: game,
        seq: seq,
        value: value,
        sender: tx-sender,
        height: stacks-block-height
      }
    )

    ;; A rebate cannot be attempted for more than the row records, and the
    ;; solvency invariant guarantees the contract holds it. So a failure here is
    ;; not a funding problem, it is a bug, and aborting loudly is the right
    ;; answer to a bug in the code that moves money.
    (try! (maybe-rebate game tx-sender))
    (ok seq)
  )
)

;; --------------------------------------------------------------------------
;; Settlement
;;
;; The contract does not need to understand checkmate to release an unused
;; reserve, and must not learn to. Expiry is a height, and after it anyone at
;; all may trigger settlement, no cron job, no keeper, no privileged caller.
;; If nobody calls it, the funds simply stay reserved, which is safe.
;; --------------------------------------------------------------------------

(define-public (settle-sponsorship (game uint) (who principal))
  (let ((sponsorship (unwrap! (map-get? Sponsorships { game: game, who: who }) ERR-NO-SPONSORSHIP)))
    (asserts! (not (get settled sponsorship)) ERR-ALREADY-SETTLED)
    (asserts! (>= stacks-block-height (get expiry sponsorship)) ERR-NOT-EXPIRED)

    (let ((leftover (get reserved sponsorship)))
      (map-set Sponsorships { game: game, who: who }
        (merge sponsorship { reserved: u0, rebates-left: u0, settled: true })
      )
      ;; The money does not move. It is already in the contract; releasing the
      ;; reservation is what turns it from a liability into treasury.
      (release leftover)
      (print
        {
          event: "sponsorship-settled",
          game: game,
          who: who,
          released: leftover,
          by: tx-sender
        }
      )
      (ok leftover)
    )
  )
)

;; --------------------------------------------------------------------------
;; Result hints
;;
;; Not validated, and not validatable here without teaching this contract chess.
;; A reader takes the hint as a place to look, fetches the log, replays it, and
;; believes the replay. A dishonest hint costs its sender a network fee and
;; convinces nobody.
;; --------------------------------------------------------------------------

(define-public (claim-result (game uint) (result (string-ascii 7)) (terminal-seq uint))
  (begin
    (asserts! (is-some (map-get? Games game)) ERR-NO-GAME)
    ;; First claim wins the slot. A later claimant cannot overwrite it, because
    ;; a hint that can be replaced is a hint that can be used to hide a game.
    (asserts! (is-none (map-get? ResultHints game)) ERR-NOT-CLAIMANT)
    ;; #[allow(unchecked_data)]
    (map-set ResultHints game
      {
        result: result,
        terminal-seq: terminal-seq,
        claimant: tx-sender,
        height: stacks-block-height
      }
    )
    (print
      {
        event: "result-claimed",
        game: game,
        result: result,
        terminal-seq: terminal-seq,
        claimant: tx-sender
      }
    )
    (ok true)
  )
)

;; --------------------------------------------------------------------------
;; Owner
;; --------------------------------------------------------------------------

;; The one thing an owner must never be able to do is take money that is owed to
;; a game. This is the only withdrawal path and it is bounded by what the
;; contract holds beyond its liabilities.
(define-public (withdraw (amount uint) (to principal))
  (begin
    (asserts! (is-owner) ERR-NOT-OWNER)
    (asserts! (<= amount (get-withdrawable)) ERR-WOULD-UNDERFUND)
    (try! (pay-out amount to))
    (print { event: "withdrawn", amount: amount, to: to, by: tx-sender })
    (ok amount)
  )
)

(define-public (set-open-fee (amount uint))
  (begin
    (asserts! (is-owner) ERR-NOT-OWNER)
    (asserts! (<= amount OPEN-FEE-CEILING) ERR-ABOVE-CEILING)
    (var-set open-fee amount)
    (print { event: "open-fee-changed", fee: amount, by: tx-sender })
    (ok amount)
  )
)

;; Changing these alters the price of sponsorships bought FROM NOW ON. Every
;; sponsorship already funded keeps the rebate and the remainder recorded in its
;; own row, so a change here can neither cheapen a promise already made nor make
;; one more expensive.
(define-public (set-sponsorship
    (bootstrap uint)
    (rebate uint)
    (count uint)
    (margin uint)
  )
  (begin
    (asserts! (is-owner) ERR-NOT-OWNER)
    (asserts! (<= bootstrap BOOTSTRAP-CEILING) ERR-ABOVE-CEILING)
    (asserts! (<= rebate REBATE-CEILING) ERR-ABOVE-CEILING)
    (asserts! (<= count REBATE-COUNT-CEILING) ERR-ABOVE-CEILING)
    (asserts! (<= margin MARGIN-CEILING) ERR-ABOVE-CEILING)
    (var-set bootstrap-amount bootstrap)
    (var-set rebate-amount rebate)
    (var-set rebate-count count)
    (var-set sponsor-margin margin)
    (print
      {
        event: "sponsorship-changed",
        bootstrap: bootstrap,
        rebate: rebate,
        count: count,
        margin: margin,
        by: tx-sender
      }
    )
    (ok true)
  )
)

(define-public (set-expiry-blocks (blocks uint))
  (begin
    (asserts! (is-owner) ERR-NOT-OWNER)
    (var-set expiry-blocks blocks)
    (print { event: "expiry-changed", blocks: blocks, by: tx-sender })
    (ok blocks)
  )
)

;; Passing none renounces ownership permanently: is-owner can never be true
;; again, so the fees and the sponsorship terms are frozen exactly as they
;; stand. There is no way back, which is the point.
;;
;; Worth being plain about what renouncing costs here, because it is not the
;; same as it was for a contract that held no money: a renounced contract can
;; never withdraw its treasury again either. The surplus stays in the contract
;; forever. Sponsorship settlement still works, because anyone may call it.
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
;;
;; Deliberately absent: anything that would answer a chess question. There is no
;; get-position, no get-turn, no get-winner. Those are replay's answers and the
;; contract does not have them.
;; --------------------------------------------------------------------------

(define-read-only (get-format-version) FORMAT-VERSION)
(define-read-only (get-protocol) PROTOCOL)
(define-read-only (get-max-seq) MAX-SEQ)
(define-read-only (get-self) SELF)
(define-read-only (get-open-fee) (var-get open-fee))
(define-read-only (get-open-fee-ceiling) OPEN-FEE-CEILING)
(define-read-only (get-expiry-blocks) (var-get expiry-blocks))
(define-read-only (get-bootstrap-amount) (var-get bootstrap-amount))
(define-read-only (get-rebate-amount) (var-get rebate-amount))
(define-read-only (get-rebate-count) (var-get rebate-count))
(define-read-only (get-sponsor-margin) (var-get sponsor-margin))
(define-read-only (get-owner) (var-get owner))
(define-read-only (get-game-count) (var-get game-count))
(define-read-only (get-game (game uint)) (map-get? Games game))
(define-read-only (get-entry (game uint) (seq uint)) (map-get? Entries { game: game, seq: seq }))
(define-read-only (get-total-reserved) (var-get total-reserved))
(define-read-only (get-balance) (stx-get-balance SELF))
(define-read-only (get-ranked-count) (var-get ranked-count))
(define-read-only (get-ranked-game (index uint)) (map-get? RankedIndex index))
(define-read-only (get-result-hint (game uint)) (map-get? ResultHints game))

(define-read-only (get-sponsorship (game uint) (who principal))
  (map-get? Sponsorships { game: game, who: who })
)

;; The invariant, readable from outside so that anybody can check it at any
;; height without trusting us about it.
(define-read-only (is-solvent)
  (>= (stx-get-balance SELF) (var-get total-reserved))
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
        out: (list 50 (optional { value: (string-ascii 5), sender: principal, height: uint }))
      }
    )
  )
  (merge acc
    {
      out: (unwrap-panic
        (as-max-len?
          (append (get out acc)
            (map-get? Entries { game: (get game acc), seq: (+ (get start acc) offset) })
          )
          u50
        )
      )
    }
  )
)

(define-read-only (get-page (game uint) (start uint))
  (get out (fold page-step PAGE-OFFSETS { game: game, start: start, out: (list) }))
)
