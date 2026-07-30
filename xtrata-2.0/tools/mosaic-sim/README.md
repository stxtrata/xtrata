# Mosaic simulator

A fake chain served from folders, so the mosaic can be driven into states mainnet cannot
produce — and looked at long before the engine, the contract or a single item exists.

```bash
node tools/mosaic-sim/seed-state.mjs half      # build a scenario
node tools/mosaic-sim/server.mjs               # then open http://localhost:8123
```

State is re-read on **every request**, so moving a file between folders takes effect on
the next page reload. No restart.

## How it works

The mosaic under test runs **unmodified** — byte-identical to what gets inscribed. Only
the chain beneath it is fake. The server answers the same endpoints the real thing calls,
with properly Clarity-encoded responses:

| Endpoint | Answers |
|---|---|
| `POST /v2/contracts/call-read/…/<fn>` | collection + core read-onlys |
| `GET /i/<tokenId>` | item content, as the runtime serves it |
| `GET /__state` | what the harness thinks the world looks like (debugging + tests) |

Anything the mosaic calls that the harness does not model returns **404 with an
explanation** rather than a plausible default. A mosaic reaching for something unmodelled
is a finding, not a gap to paper over.

## The three states

Driven entirely by which folder an item is in:

```
(neither folder)      not minted yet
state/treasury/0417   minted, held by the treasury wallet
state/released/0417   minted, held by a collector
```

Dragging `0417` from `treasury/` to `released/` is what a sale looks like.

File contents are the real namespaced seed: `xtrata:seed/<slug>/0417:9f3a2c`.

`state/config.json` carries `slug`, `maxSupply`, `defaultDependencies` (stand-ins for the
engine and mosaic ids), `finalized`, and `holders` (index → collector address).
`state/mint-order.json` pins the order items were minted in.

## Two traps built in on purpose

A mosaic that gets either of these wrong looks perfect right up until launch day.

**Token id is not the collection index.** Ids start at 3000, so anything that conflates
the two breaks on the first item rather than at item 400.

**Mint order is not collection order.** The wizard mints in whatever order it reaches
items, so `get-minted-id(0)` is *not* collection item 0. Scenarios pin a deliberately
scrambled order; if a scenario forgets to, the server says so on startup, because the
tidy case hides ordering bugs.

The reference mosaic therefore maps token → collection index by **reading the content**,
never by arithmetic on the token id or by assuming mint order.

## Scenarios

```
launch       everything minted, nothing sold
first-sale   one sale — the first thing anyone will look at
half         scattered sales, NOT a contiguous prefix
sold-out     all released
empty        nothing minted — the mosaic before the wizard runs
```

And the ones that should never happen, which is where a renderer actually breaks:

```
hole         item 500 never minted; must NOT shift everything after it
twin         index 417 in both folders — the retry-mints-a-duplicate failure
stray        index 2000 exists, beyond maxSupply and not in the list
tail-only    nothing at index 0, which naive loops assume exists
malformed    a row whose content is not a namespaced seed
```

## What this does and does not test

**Does:** the mosaic's read and render path, against states including impossible ones.

**Does not:** the contract's logic. The folders *stand in* for the contract, so they
cannot verify it. The new collection-mint contract needs its own Clarinet tests; these are
complementary.

The state layer itself is covered by
`src/agent-one/__tests__/mosaic-sim-state.test.ts`, including that the two traps above
stay traps.

## A finding from building it

Rendering 1,024 items takes roughly twenty seconds, because the reference mosaic does
three sequential reads per item — `get-minted-id`, the content, then `get-owner`. That is
honest about what a naive implementation costs, and it means **the real mosaic will need
batching or parallelism**, not that the harness is slow. Worth solving before launch
rather than discovering it with an audience.
