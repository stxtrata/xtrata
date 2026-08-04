# Deploy runbook

Two contracts and a pile of inscriptions. The order matters, and inscriptions are
immutable, so the engine especially has to be right before it goes up.

## Before you start

- **Nothing is inscribed yet.** The `ENGINE_ID = '#2838'` constant in
  `apps/canary/canary.html` is a placeholder. Xtrata inscription 2838 is a sealed
  31,036-byte `text/html`, and the engine artifact is a 113 KB
  `text/javascript`, so it is not the engine.
- **Rebuild first.** `node scripts/build-collection.mjs`. If `artifacts/` or
  `living-synth-v5-demo.html` change, the tree was stale and whatever you were
  about to inscribe was the wrong bytes.
- **Contracts green.** `cd contract && clarinet check && npm test`. Expect
  3 contracts, 0 errors, 46 tests passing.
- **Decide the treasury** before distributing anything. Rotation is safe, but
  setting it up front keeps the custody history short.

## What the Canary does and does not do

`apps/canary/canary.html` is a local console, not a hosted page. Serve it over
http, because wallets and the CDN imports do not like `file://`:

```sh
cd Living-Synth-v5/apps/canary && npx serve .
```

It **predates `living-synth-registry`** and has not been updated. Today it covers
wallet connect, recording inscription ids as you go, and verifying the old
`recording-fees` contract. It has no step for deploying the registry, locking the
core, registering editions, or distributing.

It is also **mainnet only**. `NETWORK` is hardcoded and there is no testnet path,
so the testnet dry-run this document used to describe was not achievable. Rehearse
on simnet with `npm test` instead, which exercises every registry path against a
mock core.

Until the Canary is rewritten, the registry steps below are wallet or CLI calls.

## 1. Inscribe the engine

Inscribe `artifacts/proof-of-free-engine-v5.js` as `text/javascript` on Xtrata.
Record the inscription id. The mosaic and all 1,024 seeds recurse into it, so it
is the one thing that genuinely cannot be redone.

## 2. Deploy the registry

Deploy `contract/contracts/living-synth-registry.clar` to Stacks mainnet. The
Clarinet project pins `clarity_version = 3`, and the contract uses no
`as-contract`, so a wallet deploy at Clarity 4 also works. Pick one and record
which.

Then, from the deploying wallet:

1. `lock-core-contract` pointing at
   `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3`. This can only be
   done once.
2. `set-treasury` if the treasury should differ from the deployer.
3. Confirm with `get-state`: core locked, treasury correct, `paused` still true.

Leave it paused until the editions are registered.

## 3. Inscribe the edition seeds

```sh
node scripts/build-collection.mjs --seeds --engine-id <ENGINE_INSCRIPTION_ID>
```

Inscribe `release/seeds/*.html` into the treasury, in batches at your own pace.
Each references the engine id as a dependency. Keep the returned token ids
against their edition numbers, because step 4 needs that mapping.

## 4. Register the editions

`register-edition-batch` with up to 50 `{edition, token-id}` pairs per call, so
21 calls for the full collection. `map-insert` means a duplicate anywhere in a
batch aborts that whole transaction, which is deliberate. Nothing is half
written.

Check `get-state.registered-editions` reaches 1024.

## 5. Inscribe the mosaic

Inscribe `living-synth-v5-demo.html`, referencing the engine id, with the
registry contract id baked into its config block.

Note: the mosaic does **not** read the registry yet. It still reads a
`holdersUrl` HTTP endpoint. Do not inscribe the mosaic until that is wired, or
you will permanently inscribe the spoofable version.

## 6. Go live

`set-paused false`.

## 7. Distribute

`transfer-and-reveal (core) (edition) (recipient)` for every gift, claim or sale
you settle yourself. Transfer and reveal are one transaction, so a cell can never
be distributed without lighting up.

For anything that leaves by another route, a marketplace sale say, anyone can
call `reveal (core) (edition)` afterwards to catch up. It verifies live ownership,
so it cannot be abused, and the new owner has every reason to call it.

Watch `get-state.revealed-count` and `get-reveal-bits`.

## 8. Owners evolve their synths

1. Owner records a child performance in the mosaic and exports the
   `xtrata-performance` JSON.
2. Owner inscribes it on Xtrata as a **child of their edition's token**.
3. Owner calls `register-child (core) (edition) (recording-id) (expected-fee)`.
   That single transaction verifies ownership of both the edition and the
   recording, checks the parent link and the mime type, takes the 0.1 STX fee,
   and makes the recording that cell's new default.

Live sets use `register-live-set` at 1 STX and need no parent.

## Ops, owner wallet, any time

- Prices: `set-child-fee`, `set-live-set-fee`, capped at 100 STX each.
- `set-treasury` rotates the treasury. The old address is retired into the
  custody set rather than forgotten, so tokens still sitting there stay
  unrevealed.
- `set-paused` stops new registrations. It does **not** stop `reveal`, because
  recording the truth about a token that already moved should never be blocked.
- Ownership moves in two steps: `initiate-contract-ownership-transfer` then
  `accept-contract-ownership` from the new owner.

## Gotchas

- Deploy and configure the registry **before** baking its id into the mosaic.
- Register editions before unpausing, or `register-child` fails with
  `ERR-NOT-REGISTERED` (u102).
- `lock-core-contract` is permanent. Getting the core address wrong means
  redeploying the registry.
- If a read fails right after a transaction, it probably is not confirmed yet.
  Wait a block.
- `recording-fees` at `SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7` is superseded
  and has zero receipts. Do not include it in this flow.
