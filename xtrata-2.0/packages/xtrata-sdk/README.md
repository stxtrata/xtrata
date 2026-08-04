# @xtrata/sdk

SDK package for protocol-first integrations:
- Core contract helpers (config/network/client)
- Simple Mode wrappers (`simple`) for easiest onboarding
- Safe transaction helpers (`safe`) for deterministic caps + guided flow states
- Wallet failure recovery helper (`buildMintRecoveryGuide`) for resume-safe UX
- Workflow planners (`workflows`) for mint and market write transactions
- Backup migration helpers (`backup-migration`) for registry and holder
  migration call planning
- Mint helpers (fees, caps, post-conditions, dependencies)
- Collection mint lifecycle helpers
- Market helpers
- Sponsored-transaction client (`sponsor`) for zero-STX buys via the relayer
- Payment-asset helpers (`payments`): STX/sBTC/SIP-010 descriptors, deny-mode
  spend-cap post conditions, fiat (USD/GBP) display quotes
- Deploy helper primitives

Current packaging mode:
- Source of truth: `src/`
- Build output: `dist/`
- Package entrypoints resolve from `dist/*`
- Tarball smoke validation is available via `npm run sdk:pack:smoke` from repo root.
- Example tarball smoke validation is available via `npm run sdk:examples:tarball:smoke` from repo root.

Three different batch sizes are in play, and conflating them is a money bug:

- **30** (`MAX_UPLOAD_BATCH_SIZE`) — chunks this SDK sends per
  `add-chunk-batch` / `mint-add-chunk-batch`. A client-side cap, safely under
  the contract's limit.
- **32** (`FEE_BATCH_SIZE`) — the deployed contract's `MAX-UPLOAD-BATCH-SIZE`,
  the batch size it CHARGES for. This is the divisor for protocol fee math.
  Verified against mainnet source for `xtrata-v3-2-3` (line 75, asserted at
  line 1067).
- **50** (`MAX_BATCH_SIZE`) — the length of the index lists the contract types
  as `(list 50 uint)`, e.g. `purge-expired-chunk-batch`. Correct for those
  lists and for read batching. **Never** correct for fee math.

This file previously stated the deployed ABI constant was 50 and directed its
use for protocol fee math. It is 32. Six fee sites followed that premise and
capped seal post-conditions below the fee the contract charges.

Quick start:

```sh
npm install @xtrata/sdk
```

```ts
import { createXtrataReadClient } from '@xtrata/sdk/simple';
```
