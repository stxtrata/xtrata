# Proof of Free — on-chain architecture (Xtrata)

**Everything runs on Xtrata's native infrastructure**, on Stacks (which settles with
Bitcoin finality). The only bespoke on-chain piece is a tiny **recording-fee contract**.

## What Xtrata gives us (no contract needed)

- **The editions are Xtrata inscriptions** and are natively **SIP-009 tokens** — so
  ownership, transfers, and marketplaces are all Xtrata's.
- **Recursion:** the engine is inscribed once; the mosaic and every edition seed
  reference it by inscription id (a dependency), so there's no duplicated engine.
- **Parent-child evolution:** a **child recording** (an `xtrata-performance` JSON) is
  inscribed as a *child of the parent edition inscription*. The mosaic, when it plays
  edition N, uses the latest child to **evolve that synth for public playback**.
- **Reveal = ownership.** The mosaic starts empty and shows a tile once its edition is
  **held by someone other than the treasury** — i.e. it's been gifted or sold. That's
  read straight from Xtrata ownership; nothing to track in a contract. (Xtrata's
  sponsored **free-claims** are a natural give-away path: the claim moves the token out
  of treasury, which is the reveal.)

## The one contract — `recording-fees`

Users pay to inscribe a derivative recording; the fee goes to the treasury with a
receipt. Owner-updatable.

- `pay-inscription-fee (kind parent ref)` — `kind u0` = child performance → **0.1 STX**,
  `kind u1` = live set (`xtrata-session`) → **1 STX**.
- `set-child-fee` / `set-live-set-fee` change the prices; `set-treasury`,
  `transfer-ownership` for admin.
- Ships and tested in [`../contract`](../contract) (8 passing Clarinet tests).

## How the mosaic reads state

- **Which tiles to show:** read Xtrata ownership for the collection and reveal editions
  whose owner isn't the treasury (via Xtrata's API/indexer, or the collection contract's
  `get-owner`). Each edition sits at its fixed genome position, so a distributed set
  scatters across the logo.
- **What each tile plays:** genesis by default; if the edition has a child inscription,
  play the latest child (Xtrata parent-child).
- **Reveal simulation** (shipped, `living-synth-v5-demo.html?sim=1`): a local preview of
  the reveal filling in — seed / reroll / step 32 / auto — so you can see how the scatter
  reads before anything is distributed.

## Order of operations (all Stacks, one wallet)

1. **Inscribe the engine** on Xtrata → engine inscription id.
2. **Deploy `recording-fees`** on Stacks (treasury = the Xtrata wallet).
3. **Inscribe the mosaic** on Xtrata (references the engine id; carries the collection +
   fee-contract config).
4. **Inscribe the edition seeds** on Xtrata (each references the engine id) into the
   treasury.
5. **Distribute** — gift (incl. sponsored free-claims) or sell; each first move out of
   treasury reveals that tile.
6. **Live:** owners record child performances / live sets, `pay-inscription-fee`, then
   inscribe them on Xtrata — children evolve their synth in the mosaic; live sets play
   back as songs.

## The Canary page (next)

A single self-contained HTML mission-control that walks the sequence with **one Stacks
wallet** (Leather/Xverse via `@stacks/connect`) — connect → inscribe engine → deploy fee
contract → inscribe mosaic → inscribe editions → distribute — each step with a
read-only **verify** and a status, later steps locked until earlier ones pass. Because
Xtrata inscribes via wallet-signed Stacks transactions, the whole flow signs in-browser;
the inscribe steps use Xtrata's Wizard/SDK and record the returned inscription ids.
