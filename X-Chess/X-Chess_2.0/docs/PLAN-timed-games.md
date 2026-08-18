# Timed games

Every game so far has been untimed, and the rule set says so in the only way it
can: `cooldown` is measured in MOVES, not seconds. That was deliberate. Replay
turns a log into a result with nothing but the log, and a clock is not in the
log.

Timed games are worth having anyway. This is how to add one without breaking
the forty-three games that already exist.

## The premise

The timer starts when the opponent's move LANDS, and runs until yours does.
Fresh allocation every move, anchored to the previous successful block. No
depleting bank carried across the game.

Per-move rather than a chess clock because it suits async play: nobody loses a
long game to accumulated seconds, and every deadline derives from exactly one
block, so it can be checked without replaying everything before it.

## The decision that makes it a rule

Start the clock from the BLOCK TIME of the opponent's move, never from the
moment a tab noticed it.

A countdown held in one browser resets on reload. It would constrain only a
player who did not think to press F5, which is worse than no timer at all: it
punishes the honest one. Anchored to the block, every device computes the same
deadline with nothing to sync and nothing to trust. The opponent agrees, a
spectator agrees, a phone joining halfway through agrees.

This costs nothing new. `packages/chain/block-time.ts` already turns a height
into a unix timestamp, cached and best effort, and already has `formatDuration`
and `formatClock`. The contract stores the height on every submission because it
is "a key into the block's timestamp rather than a second copy of it", which is
exactly what this needs.

## Two numbers, both from the same block

| | what it is | who sees it |
|---|---|---|
| **limit** | thinking time | the countdown, on both boards |
| **grace** | wallet and confirmation buffer | nobody, until it expires |

Splitting them is what makes a claim uncontentious. By the time anyone can flag
you, you have had your full time PLUS a buffer that covers signing and landing.
Nobody is ever flagged for a slow mempool.

It also gives the right asymmetry: show the strict deadline, enforce the lenient
one. A player who obeys the visible clock has a cushion they never notice.

**Grace is fixed at 15 minutes for every tier.** It covers confirmation, and
confirmation does not scale with game length, so one number holds everywhere.
Not less than 10: a 25 minute confirmation has been seen on this chain, and
wallet users cannot RBF their way out the way the runner can.

### Tiers

Blocks land every 8 to 12 seconds, measured. A live game polls every 2.5s, so
even the short tiers display smoothly.

| tier | limit | hard deadline |
|---|---|---|
| bullet | 1 min | 16 min |
| blitz | 5 min | 20 min |
| rapid | 30 min | 45 min |
| daily | 24 h | 24 h 15 min |

Nothing below a minute. At that point it measures poll latency and typing
speed, not chess.

## Phase 1: the clock, and nothing else

No protocol change. No rules field, no new control string, no contract work.
Nothing here can affect a game that already exists.

- Deadline is `blockTime(previous entry) + limit`, from the existing cache.
  The first move anchors to the game's opening entry.
- A countdown on both boards, large, with unmistakable marking that the game is
  timed. Someone must never lose a game they did not know was timed.
- On expiry the submit path refuses: cancel the ghost, try again, the board
  says you are out of time.

The result stays ADVISORY. The board says "Black is out of time" and both
players see the same thing because both computed it from the same block. Ending
it is up to them. Nothing new goes on chain.

That is a real feature on its own, and it is the whole of the risk-free part.

### The device clock

Never read `Date.now()`. On each poll, record the chain tip's `block_time`
beside `performance.now()`, and display `anchor + monotonic elapsed`.
`performance.now()` does not move when NTP corrects or a timezone is wrong, and
the anchor re-corrects every 2.5s for free.

The deeper rule: **the visible countdown decides nothing.** It is a readout. A
skewed system clock is then a cosmetic annoyance and never a wrong result.

Background tabs are throttled and `BACKGROUND_POLL_MS` is 20s, so a hidden tab
will show a stale clock. Acceptable, provided it visibly re-syncs on focus
instead of quietly lying.

## Phase 2: making a timeout a result

Everything here is versioned work, and the house rule governs it: once a game
has committed to a version that definition is frozen, a change is a NEW version
plus an adapter, never an edit.

### The claim

A timeout cannot be inferred from silence. "Nobody moved yet" and "out of time"
are identical until someone acts, so ending a game needs a `flag` control
string submitted by the opponent, and the claim button unlocks only after
limit + grace.

Keep it optional. Being able to decline to flag a friend is worth more than the
tidiness of ending automatically.

**The race resolves itself.** If a move and a claim land close together, `seq`
decides: replay already processes entries in order, so a move with the lower seq
means the claim arrives when its target is no longer flaggable and is refused as
invalid. No new mechanism and no coin flip.

### Enforce in blocks, display in seconds

Replay is pure. It turns a log into a result and cannot make an async lookup, so
it cannot ask for a block's timestamp while it works.

So the referee counts BLOCKS, and only the readout counts seconds:

- The rules commit the deadline in blocks. Replay does height arithmetic on
  entries it already has, and a stranger with the log alone can verify a flag
  with no API calls at all.
- The countdown shows real seconds from real block times, which is what a human
  needs and what `block-time.ts` already provides.

The two agree to within block variance, and grace absorbs the variance. This is
the same reason the contract stores heights: the log stays self-contained.

### Versions this needs

| protocol | today | timed games |
|---|---|---|
| rules | `rules-v1` | `rules-v2`, adds the limit to the hash |
| events | `events-v1` | `events-v2`, adds `flag` |
| replay | `replay-v1`, `replay-v2` | unchanged, see below |

**The hash is the dangerous part.** `canonicalRules` builds a fixed ordered
field list, so appending a field changes EVERY existing hash and all forty-three
games would read as unconfirmed against their own commitments.

The fix is the one `first-mover` already used: a game commits to the new version
only if it USES the feature. An untimed game emits `rules-v1` and byte-identical
bytes to today. A timed game emits `rules-v2` and the extra fields. Existing
games do not move, and a board that has not heard of `rules-v2` says
"unsupported protocol" and declines to derive anything, which is already what
replay does with a protocol it does not know.

Replay does not need a bump. It already dispatches on the committed events
protocol (`replay.ts:163`):

    const eventsActive = rules.eventsProtocol === EVENTS_PROTOCOL;
    const eventsKnown  = eventsActive || rules.eventsProtocol === EVENTS_NONE;

So the work is widening `eventsActive` from an equality test to a version-aware
one. The refusal path is already correct as written: a board that has not heard
of `events-v2` gets `eventsKnown === false` and declines, which is the behaviour
this needs and not a change to it.

### What must be proved before it ships

- Every existing game hashes to exactly what it hashed to before. Byte
  comparison, not a spot check.
- `tests/legacy/` replays unchanged.
- An old board meeting a timed game refuses it rather than mis-reading it.

## Open questions

1. **Do flagged games count for ratings?** They should if the game is `ranked`,
   since `ranked` is committed before a move is played for exactly this reason.
   Needs deciding, not assuming.
2. **Can a player flag themselves?** Conceding on time without resigning. Cheap
   to allow, and it lets an honest player end a game they know they lost.
3. **Tournament interaction.** A manifest would carry the limit so pairings
   still verify. Out of scope until Phase 1 is live.

## Order of work

Phase 1 against the live board, because it is small, honest about what it
enforces, and cannot damage anything. Phase 2 gets its own build and its own
legacy proof, because it touches the three places where a mistake makes two
boards disagree about a result forever.
