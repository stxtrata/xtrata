# On-chain architecture (Xtrata + one registry contract)

Everything runs on Xtrata's native infrastructure, on Stacks, which settles with
Bitcoin finality. One bespoke contract sits alongside it,
[`living-synth-registry`](../contract/contracts/living-synth-registry.clar).

## What Xtrata gives us

- **The editions are Xtrata inscriptions** and therefore natively SIP-009
  tokens, so ownership, transfers and marketplaces are all Xtrata's.
- **Recursion.** The engine is inscribed once. The mosaic and every edition seed
  reference it by inscription id as a dependency, so there is no duplicated
  engine.
- **Parent-child.** A child recording, an `xtrata-performance` JSON, is inscribed
  as a child of the parent edition inscription. `xtrata-v3-2-3` records that link
  immutably and exposes it through `get-parents`.

## Why a contract is needed at all

An earlier version of this document claimed reveal and child lookup needed
"nothing to track in a contract". Both claims were wrong, for different reasons.

**Reveal is history, not state.** The rule is that a cell lights up the first
time its token leaves the treasury, and stays lit forever after. Current
ownership cannot answer that. A token that was gifted and later came back looks
identical to one that never moved. The fact has to be latched at the moment it
happens or it is lost.

**Parent-child only points upward.** `get-parents(recording)` tells you what a
recording is a child of. There is no `get-children(token)`. You can verify a
child you already know about, but you cannot enumerate an edition's children from
the chain. Something has to index them.

So the registry stores exactly those two things and nothing else. No audio, no
artwork, no genome. Those stay in the inscriptions.

## Reveal, in one call

Latching 1,024 separate flags would cost the mosaic 1,024 read-only calls on
load. Instead each flag is one bit inside a 128-bit uint. Eight uints hold the
whole collection, so **`get-reveal-bits` returns every cell's state in a single
call**. `get-child-bits` does the same for "this cell has a child", so the mosaic
only fetches the children that actually exist.

Latching is `bit-or`, which cannot clear a bit. Permanence is arithmetic rather
than a rule to be enforced.

Custody is the whole history of treasury addresses, not just the current one, so
rotating the treasury never makes the tokens still sitting in the old wallet look
distributed.

Two ways in:

| call | who | when |
|---|---|---|
| `transfer-and-reveal` | treasury | every deliberate distribution. Transfer and latch are one transaction, so it cannot be missed. |
| `reveal` | anyone | catch-up for a token that left by another route. Verified against live ownership. |

The one gap: a token that leaves and returns before anyone calls `reveal` loses
that history. Distributing through `transfer-and-reveal` closes it.

## How the mosaic reads state

| question | call |
|---|---|
| which cells are revealed | `get-reveal-bits`, one call |
| which cells have a child | `get-child-bits`, one call |
| what does cell N play | `get-active-child (N)`, only for cells the bitmap flags |
| fees, treasury, counts | `get-state` |
| everything about 32 cells | `get-mosaic-page (page)` |

Genesis is the default. If a cell has an active child, the mosaic plays that
instead. Earlier children stay selectable through `get-child-at`.

**Status: not yet wired.** `apps/mosaic/mosaic.html` still reads reveal from a
`holdersUrl` HTTP endpoint that a visitor can override through the query string,
and keeps child recordings in `localStorage` behind a stubbed owner check. The
registry is deployed nowhere and read by nothing. Wiring the mosaic to it is the
next piece of work.

## Order of operations

1. Inscribe the **engine** on Xtrata, then record its inscription id.
2. Deploy **`living-synth-registry`** on Stacks.
3. `lock-core-contract` to `xtrata-v3-2-3`, then `set-treasury` if the treasury
   should differ from the deployer. Do both **before** distributing anything.
4. Inscribe the **edition seeds** into the treasury, each referencing the engine
   id.
5. `register-edition-batch` to map edition numbers to token ids, 50 at a time.
6. Inscribe the **mosaic**, with the registry contract id baked into its config.
7. `set-paused false`.
8. **Distribute** through `transfer-and-reveal`. Each call lights one cell.
9. Owners record child performances, inscribe them as Xtrata children of their
   edition, then call `register-child`, which takes the fee and makes the
   recording that cell's new default.

Step 3 before step 8 matters. Rotating the treasury later is safe, but setting it
up front keeps the custody history short and the audit trail obvious.

## The superseded fee contract

`recording-fees` is live on mainnet at
`SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7.recording-fees` with zero receipts. It
charged for a recording without checking that the payer owned the edition or that
the receipt referred to a real inscription, so the fee was honour-system in both
directions. The registry replaces it by taking the fee in the same transaction
that verifies and records the child.

Contract detail: [`../contract/README.md`](../contract/README.md) ·
deploy: [`deploy-runbook.md`](deploy-runbook.md)
