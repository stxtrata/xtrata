# Notes

Why this is built the way it is, what has actually been checked, and what has
not. The README says how to run it; this says what was decided and on what
grounds.

Version 1 is meant to be the oldest known ancestor on the Xtrata chess lineage,
so the reasoning is worth keeping next to the code. Descendants inherit the
format, not the implementation.

## Decisions

**The contract does not know the rules.** It stores strings in a total order.
The rules live in the inscribed board, which replays the log and skips anything
illegal. The alternative, full chess in Clarity, would have shipped with
compromises — mate by challenge window, probably no threefold — and would have
been a single unaudited implementation of the rules that nothing else could
check. Replay gets correct FIDE rules and anyone can re-derive the board with
any engine.

**The contract may filter, never adjudicate.** This is what keeps the split from
being the fork trap. Anything the contract rejects never enters the log, so
there is nothing to disagree about. Anything it wrongly accepts is skipped
identically by every reader. The moment it forms a chess opinion, two referees
exist. The length check is a filter; there is deliberately nothing else.

**No character validation on chain.** Redundant, because replay rejects anything
unparseable anyway, and the runtime cost is better spent nowhere.

**Moves live in a map keyed by `(game, seq)`, not a list in a data var.**
Appending to a growing list means reading and rewriting the whole list, so move
eighty would cost far more than move two. The map is constant cost forever.

**UCI, not algebraic.** Algebraic needs disambiguation logic (`Nbd2`) in Clarity
for no benefit. UCI is unambiguous, parses with a small lookup, and still reads
in an explorer.

**`seq` orders, it does not count plies.** It counts submissions including ones
replay skips, so it drifts from the ply count. Nothing may treat it as a chess
concept. Replay order is `seq` and never block height or timestamps, because
those can tie within a block.

**The contract stores a block height, not a timestamp.** Height is free, already
there, and a key into the block's time. Storing a clock would pay storage on
every move to record something the chain already knows. The cost is one lookup
per distinct block to play a game back in real time, which is cheap.

**A hand-rolled Clarity codec rather than an SDK.** An inscription cannot fetch
anything, and the board needs to encode two uints and decode a handful of types.
Bundling a general library would cost far more bytes than it saves. Kept honest
by checking it against `@stacks/transactions` in the test suite.

**One renderer, three modes.** Live reads the contract, simulation reads a mock,
sealed reads a log embedded in the page. A sealed game needs no node and no API,
which is what makes an inscribed game a durable artifact rather than a link to a
contract someone has to keep reading.

**Sealed games carry their names and block times.** They have no network. Without
this, inscribing a game would silently destroy its attribution and its timing —
the opposite of what sealing is for.

**Simulation uses real principals, real names, and a real clock.** It previously
used labels like `BOT-WHITE` and one block per move, which meant the two most
visible things on a live board — who moved, and when — were the two things
simulation could not preview. A preview that tidies away the hard part is not a
preview.

**Playback derives every frame from `replay(log.slice(0, n))`.** Not a recording.
Every position shown is one the board genuinely passed through, and stepping onto
a skipped submission advances the counter without moving the board.

**Version 1 is wide open on purpose.** No cooldown, no colour bound to an
address. It will get botted; the log keeps the evidence. Junk costs its sender a
fee and changes nothing, which is the whole economic argument.

## Checked

- **Move generation.** Perft against the six standard positions, depth 5 on
  startpos and depth 4 on kiwipete, roughly 16M nodes. This is the measure that
  says the generator is correct rather than nearly correct.
- **The Clarity codec.** Byte for byte against `@stacks/transactions`, including
  `c32address` over 3,000 arbitrary hashes on both networks.
- **The contract.** Under Clarinet, plus a parity suite running the same
  scenarios against the contract and the mock and comparing. Simulation is only
  a trustworthy test surface while that passes.
- **Replay totality.** Never throws on any input, including entries that are not
  strings.
- **Whole games.** Twenty seeds end to end with a griefer, asserting they finish,
  that replay agrees with forward play, and that deleting every rejected entry
  leaves the position unchanged.
- **BNS reverse lookup.** Against live mainnet: pulled real names, resolved their
  owners, reverse-resolved each back.
- **Block timestamps.** `/extended/v2/blocks/{height}` against live mainnet,
  confirming `block_time` is a unix timestamp.
- **The board and the sealed page.** In a real browser, including click-to-move,
  the reject path, playback transport, and the pace controls.

## Not checked

- **Live wallet signing.** Everything up to `provider.request` is exercised, but
  the request itself has not run against a real wallet. The call shape is the one
  this repo's canary proved across Xverse and Leather, desktop and mobile.
- **Anything on chain.** The contract is not deployed. No real fee has been paid
  and no real transaction has been sent.
- **Real pacing.** The rhythm you see in simulation is modelled, not measured. An
  actual open board is likely far lumpier: quiet for hours, then a burst when
  someone notices.
- **Whether the wide-open board is any good.** Unknowable until one runs. The
  simulation says roughly a third of traffic pays a fee to change nothing, but
  that number comes from a griefer I wrote.

## Deferred, not blocked

- **A cooldown.** One map of `address -> last block`. The obvious first response
  if a single bot monopolises the board.
- **Stakes.** Money means the *result* has to be enforceable on chain, which
  needs settlement: claim a result, open a challenge window, let anyone refute it
  by submitting one legal move from the claimed final position. That only needs
  single-move validation, not full chess in Clarity.
- **On-chain sealing.** Worth doing once there is a game worth sealing.

## Known weaknesses

- **BNS names are not identity.** Anyone can register a name resembling someone
  else's, which on a board where anyone can move is a plausible way to muddy
  attribution. The principal stays in the tooltip for that reason, and a name
  alone should not be trusted.
- **Rapid programmatic clicking is swallowed** by the re-entrancy guard on the
  bot controls. Correct for a human, surprising for a script.
- **Stacks addresses are not a fixed width.** Roughly a quarter are not 41
  characters. Anything downstream that assumes otherwise is wrong.
