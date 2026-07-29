# Deploy runbook — Proof of Free (Xtrata + Stacks)

Rehearse the whole thing on **testnet**, then repeat on **mainnet**. Everything is
driven from `apps/canary/canary.html` with one Stacks wallet (Leather or Xverse).

## Opening the Canary

It's a **local tool**, not a hosted page. Serve it over `http://localhost` (wallets and
the CDN imports prefer an http origin to `file://`):

```sh
cd Living-Synth-v5/apps/canary && npx serve .    # or: python3 -m http.server 8080
# then open http://localhost:3000/canary.html (or :8080)
```

To give it a real URL, host `apps/canary/` on GitHub Pages / Netlify / a path on your
site, or inscribe it on Xtrata like the rest.

## Before you start

- **Wallet** with the treasury account; the account you deploy from becomes the
  collection **owner + treasury**.
- **Contract passes:** `cd contract && npm test` → 8 green.
- **Have ready:** the engine artifact (`artifacts/proof-of-free-engine-v5.js`), the
  mosaic (`living-synth-v5-demo.html`), the edition seeds, and your Xtrata
  **holders endpoint** + **collection id** (for the `pof-chain` config).
- Order rule: **engine → contract → mosaic → editions**. Inscriptions are immutable —
  the engine especially. Let each Stacks tx confirm before the next dependent step.

## Phase 1 — Testnet dry-run

Open the Canary, set network = **testnet**.

1. **Connect** the wallet; fund it from the Stacks testnet faucet.
2. **Inscribe the engine** on Xtrata (testnet) → paste its inscription id into step 2.
3. **Deploy `recording-fees`** → sign → wait for confirmation → **Verify fees** (reads
   back `child 100000` / `liveSet 1000000` µSTX).
4. **Test a fee:** step 6 → *pay child fee (0.1 STX)* → confirm 0.1 STX lands in the
   treasury and `get-receipt` logs it. (Optionally call `set-child-fee` from your wallet
   and re-verify to prove prices are updatable.)
5. **Inscribe the mosaic** on Xtrata with the `pof-chain` block from step 4's *show
   config* (network `testnet`, your `holdersUrl` / `collection` / `treasury`) → paste id.
6. **Inscribe 1–2 edition seeds** into the treasury, then **transfer one out**. Open the
   mosaic (baked config, or `?live&holdersUrl=…&treasury=…`) → that tile reveals and
   plays; the rest stay dark.
7. **Evolve a synth:** record a child performance, `pay-inscription-fee`, inscribe it as
   an Xtrata **child** of that edition → the mosaic plays the evolved synth.

All green ⇒ the full loop works. **Reset** the Canary's testnet state before mainnet.

## Phase 2 — Mainnet

Switch network = **mainnet**; fund the treasury with STX for deploys + inscriptions.
Repeat with **final** content:

1. Connect (mainnet).
2. Inscribe the **final engine** → record id (immutable — get it right).
3. Deploy `recording-fees` → verify.
4. Inscribe the **final mosaic**, baking the **mainnet** `pof-chain` config (engine id +
   contract + your holders endpoint) → record id.
5. Inscribe editions into the treasury in batches.
6. **Distribute** — gift, sponsored free-claim, or sale. Each first exit from treasury
   reveals that tile.

## Verify each phase

- **Contract:** Canary *verify fees*; `get-treasury`; `get-receipt` after a paid fee.
- **Mosaic:** opens empty; a tile reveals only after its edition leaves treasury; a child
  evolves its synth; the engine inscription resolves via recursion.

## Ops (owner wallet, anytime)

- Change prices: `set-child-fee` / `set-live-set-fee`.
- `set-treasury` (move the vault) · `transfer-ownership` (hand over admin).

## Gotchas

- **`pof-chain.network` must match** where you deployed (testnet vs mainnet).
- Deploy the contract **before** baking its id into the mosaic config.
- Treasury defaults to the deploy wallet — call `set-treasury` first if you want a
  separate cold treasury before distributing.
- If *verify* fails right after deploy, the tx probably isn't confirmed yet — wait a block.
