# SDK Quickstart: Write Workflows (Mint + Market)

Use `@xtrata/sdk/workflows` when you want prebuilt write transaction plans with:
- deny-mode post-condition defaults
- deterministic spend caps
- guided mint flow state

## 1) Core mint workflow plan

```ts
import { chunkBytes, computeExpectedHash } from '@xtrata/sdk/mint';
import { buildCoreMintWorkflowPlan } from '@xtrata/sdk/workflows';

const contract = {
  address: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
  contractName: 'xtrata-v2-1-1',
  network: 'mainnet' as const
};

const payloadBytes = new TextEncoder().encode('hello xtrata');
const expectedHash = computeExpectedHash(chunkBytes(payloadBytes));

const plan = buildCoreMintWorkflowPlan({
  contract,
  senderAddress: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
  payloadBytes,
  expectedHash,
  mimeType: 'text/plain',
  tokenUri: 'ipfs://example',
  mintPrice: 1_000_000n,
  protocolFeeMicroStx: 100_000n
});

// Wallet transaction payloads:
const beginCall = plan.beginCall;
const chunkCalls = plan.addChunkBatchCalls.map((entry) => entry.call);
const sealCall = plan.sealCall;

// UX helpers:
console.log(plan.safety.summaryLines);
console.log(plan.flow.nextAction);
```

## 2) Collection mint workflow plan

```ts
import { buildCollectionMintWorkflowPlan } from '@xtrata/sdk/workflows';

const plan = buildCollectionMintWorkflowPlan({
  contract: {
    address: 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7',
    contractName: 'xtrata-collection-ahv0-34f95221',
    network: 'mainnet'
  },
  xtrataContract: {
    address: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
    contractName: 'xtrata-v2-1-1',
    network: 'mainnet'
  },
  senderAddress: 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7',
  payloadBytes: new Uint8Array([1, 2, 3]),
  expectedHash: new Uint8Array(32),
  mimeType: 'image/png',
  tokenUri: 'ipfs://example',
  mintPrice: 1_000_000n,
  protocolFeeMicroStx: 100_000n
});
```

## 3) Small-file single-tx helper plan (<= 30 chunks)

```ts
import { buildSmallMintSingleTxWorkflowPlan } from '@xtrata/sdk/workflows';

const plan = buildSmallMintSingleTxWorkflowPlan({
  helperContract: {
    address: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
    contractName: 'xtrata-small-mint-v1-0',
    network: 'mainnet'
  },
  xtrataContract: {
    address: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
    contractName: 'xtrata-v2-1-1',
    network: 'mainnet'
  },
  senderAddress: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
  payloadBytes: new TextEncoder().encode('small payload'),
  expectedHash: new Uint8Array(32),
  mimeType: 'text/plain',
  tokenUri: 'ipfs://example',
  protocolFeeMicroStx: 100_000n
});

// Single wallet call, deny-mode spend cap included
const singleTxCall = plan.call;
```

## 4) Market list / buy / cancel plans

```ts
import {
  buildMarketBuyWorkflowPlan,
  buildMarketCancelWorkflowPlan,
  buildMarketListWorkflowPlan
} from '@xtrata/sdk/workflows';

const marketContract = {
  address: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
  contractName: 'xtrata-market-stx-v1-0',
  network: 'mainnet' as const
};
const nftContract = {
  address: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
  contractName: 'xtrata-v2-1-1',
  network: 'mainnet' as const
};

const listPlan = buildMarketListWorkflowPlan({
  marketContract,
  nftContract,
  senderAddress: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
  tokenId: 58n,
  priceMicroStx: 2_500_000n
});

const buyPlan = buildMarketBuyWorkflowPlan({
  marketContract,
  nftContract,
  buyerAddress: 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7',
  listingId: 101n,
  tokenId: 58n,
  listingPriceMicroStx: 2_500_000n
});

const cancelPlan = buildMarketCancelWorkflowPlan({
  marketContract,
  nftContract,
  listingId: 101n,
  tokenId: 58n
});

console.log(listPlan.summaryLines);
console.log(buyPlan.summaryLines);
console.log(cancelPlan.summaryLines);
```

These workflow plans are designed so integrators can call `openContractCall` directly with consistent, deny-mode defaults.

Validation note:
- Workflow planners fail fast with `SdkValidationError` when critical inputs are malformed (missing sender, invalid hash length, oversized URI, zero/negative spend values, network mismatches).

## Quoting a v1.5 collection mint on core v3.2.3

```ts
import { readCollectionV15FeeUnits, quoteCollectionV15Mint } from '@xtrata/sdk';

// Supply a read-only adapter that returns the decoded uint (bigint).
// Unavailable or invalid reads must throw or return null.
const units = await readCollectionV15FeeUnits(readCoreUint);
const quote = quoteCollectionV15Mint(units, 33, 1_000_000n);
// quote.begin: begin cap; quote.upload: zero;
// quote.seal: reserved collection price + protocol seal fee;
// quote.total: price + begin + seal, also used by the helper's <=30-chunk route.
```

Register the verified hashes with `set-registered-token-uri-batch` before opening
minting. Re-read fees before each payable step. For resumed mints, use the price
stored in `get-reservation`, not the current phase price. Keep wallet transactions
in deny mode with sender STX caps. Confirm a collection receipt using
`get-token-mint-context`; a core hash lookup alone is not proof of a collection
sale. No write, wallet signing, or deployment occurs when calling these quote
helpers. Existing SDK workflow defaults are historical; v1.5 clients must use the
explicit granular quote path above instead of legacy aggregate fee estimates.
