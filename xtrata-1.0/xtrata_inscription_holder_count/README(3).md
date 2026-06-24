# Xtrata holders → airdrop list

Pulls **every Stacks wallet associated with an Xtrata inscription** across the
three contracts and writes deduplicated CSVs you can airdrop to.

Contracts (already baked into the script):

```
SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v1-1-1
SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v2-1-0
SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3
```

## How it works

For each contract it reads the contract interface (to find the NFT asset class
and the `get-owner` function), enumerates every minted token via Hiro's NFT
`mints` endpoint, then calls `get-owner` (read-only) per token to get the
**current** on-chain owner. Owners are deduplicated across all three contracts.

## Run it

Needs **Node 18+**.

```bash
npm install
# optional but recommended — a free Hiro API key removes rate limits and makes it ~10x faster:
export HIRO_API_KEY=your_key_here        # get one at https://platform.hiro.so
node xtrata_holders.mjs                   # uses the three contracts above
```

For ~1,075 inscriptions this is one read-only call per token, so a few minutes
without a key, well under a minute with one. The script retries/back-offs on rate
limits automatically.

To point it at different contracts: `node xtrata_holders.mjs SP....c1 SP....c2 SP....c3`

## What you get (in `./out/`)

| file | contents |
|---|---|
| **`holders_current.csv`** | **Current** holders — wallets only, one address per line. The straightforward airdrop list (these wallets hold an Xtrata inscription right now). |
| **`minters.csv`** | Wallets that **minted** at least one inscription — the literal "early supporters," including any who have since sold. |
| **`detailed.csv`** | `address, type, held_v1, held_v2, held_v3, held_total, minted_total` — full per-contract breakdown for weighting or filtering. |

Plus a console summary: per-contract holder counts, total inscriptions scanned
(should land near your ~1,075), unique wallets holding now, how many hold across
**all three**, and how many tokens are sitting in marketplace/escrow contracts.

## Which list should you airdrop to?

- **Reward current community → `holders_current.csv`.** People who hold today and
  can receive the drop.
- **Reward original early supporters → `minters.csv`.** The wallets that actually
  minted, even if they later sold.
- **Catch everyone → union of both:**
  ```bash
  cat out/holders_current.csv out/minters.csv | sort -u > out/airdrop_union.csv
  ```

## Caveats worth knowing

- **Marketplace listings.** A token listed for sale is, on-chain, owned by the
  marketplace/escrow **contract**, not the seller. Those show up as `type=contract`
  in `detailed.csv` and are **excluded** from the wallet airdrop list. The summary
  tells you how many there are; if you want to reach those sellers you'd resolve
  them per-marketplace (not done here, since it's marketplace-specific).
- **"Current" is a snapshot.** Re-run shortly before you airdrop so transfers are
  fresh.
- **No guessing.** The script only counts what the chain reports for those three
  exact contracts.

## Verify the logic without touching the chain

```bash
node test_offline.mjs
```

This runs the whole pipeline against a mocked Hiro API (overlapping owners, a
burned token, a marketplace-held token) and asserts the dedupe, the wallet/contract
split, and the "held in all three" intersection. All checks should print `PASS`.
