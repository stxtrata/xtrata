# Building the Tournaments tab — what step 0 established

Three unknowns were resolved before any UI was written, because each one
changes the shape of the rest. All three answers are negative or awkward, which
is exactly why they were worth settling first.

## 1. An inscription's block height is not in Xtrata

`provenance()` needs to compare when the manifest was inscribed against when its
first game was opened. Xtrata does not record it. Both
`get-inscription-meta` and `get-inscription-summary` return creator, final-hash,
mime-type, owner, sealed, total-chunks, total-size, dependencies, parents and
migration-source — **and no height**.

The route that works is three hops through the Stacks API, not the contract:

```
inscription id
  -> /extended/v1/tokens/nft/history?asset_identifier=…::xtrata-inscription&value=0x<uint CV>
  -> the mint event's tx_id            (block_height is NOT populated on the event)
  -> /extended/v1/tx/<txid>            -> block_height
```

Measured: manifest **2993 was minted at block 8,787,817**. Its games were opened
far below `COMPILED_ACCEPTED_BEFORE` (8,787,816), so `honours()` accepts it
through the compiled fallback, which is the intended and final use of that path.

Two API calls per manifest, cacheable forever — an inscription is immutable, so
its height cannot change. If either call fails, `provenance()` returns null and
the tab says "not checked", which is already handled and must never be reported
as "committed".

## 2. The result hint is a claim, not a result

`getResultHint` exists on the chain client and returns a row carrying a
**`claimant`**. That field is the whole answer: somebody asserted the result. It
is not derived by the contract.

The board has never used it — `packages/ui/app.ts` does not reference it once,
and replays instead. That convention is right and the tab follows it. Replay is
the proof; a hint would be repeating a claim as though it were checked, which is
the exact failure this tab exists to prevent.

So results cost what they cost: every entry of every game, paged and replayed.
Roughly 1,700 entries across the 21 games, one of which (game 18) holds 340 on
its own. Page at the width Explore uses and expect several rate-limit windows on
a cold load.

**Verification is separable and much cheaper.** Checking that a claimed pairing
matches the chain needs one `getGame(id)` and a `rulesHash` comparison — 21
reads, no replay. Do that first and render it; fill results in behind it.

## 3. The protocol byte budget breaks immediately

`packages/protocol/tournament.ts` is not currently bundled — nothing in the app
imports it — so it costs nothing today and the budget looks fine. Importing it
costs **3,999 bytes**:

```
packages/protocol   11,423  ->  15,422   ceiling 14,500   over by 922
```

That is before one line of the tab is written. The brief for this work cited the
`packages/ui` row (103,057 of 129,500, comfortable and true) — the row that
actually breaks is protocol, and it breaks on the first import.

Raise it deliberately in the commit that adds the import, with this arithmetic
next to it. Do not discover it as a failing test and nudge the number.

## What this means for the build

* The chain adapter needs **two sources**: Xtrata read-only calls for content,
  dependencies and creator; the Stacks API for the one thing Xtrata does not
  keep, which is when it happened.
* Verification and results are two passes at different costs. Do not fuse them.
* The first commit that imports `tournament.ts` also raises the protocol
  ceiling, or the suite goes red for a reason unrelated to whatever is being
  worked on at the time.
