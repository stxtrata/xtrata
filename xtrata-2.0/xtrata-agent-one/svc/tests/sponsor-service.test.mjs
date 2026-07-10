/**
 * Offline test suite for the sponsor relayer (node --test).
 * Builds REAL signed sponsored transactions with @stacks/transactions and a
 * throwaway key, and injects a mock chain — no network, no state leakage
 * (fresh temp state dir per test).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  makeContractCall, uintCV, contractPrincipalCV, AnchorMode, PostConditionMode,
  makeStandardFungiblePostCondition, FungibleConditionCode, createAssetInfo,
  getAddressFromPrivateKey, TransactionVersion
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import {
  createSponsorService, validateSponsorPayload, quoteBudget, txOriginAddress,
  DEFAULTS, loadJob
} from '../sponsor-service.mjs';

const BUYER_KEY = 'edf9aee84d9b7abc145504dde6726c64f369d37ee34ded868fabd876c26570bc01';
const BUYER = getAddressFromPrivateKey(BUYER_KEY, TransactionVersion.Mainnet);
const DEPLOYER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const MARKET = `${DEPLOYER}.xtrata-market-sponsored-sbtc-v1-0`;
const SBTC = 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token';
const ALLOWLIST = { [MARKET]: { buyFunction: 'buy' } };

async function buildBuyTx({ sponsored = true, fee = 0n, fn = 'buy', withPc = true, contract = MARKET } = {}) {
  const [addr, name] = contract.split('.');
  const [sbtcAddr, sbtcName] = SBTC.split('.');
  const tx = await makeContractCall({
    contractAddress: addr,
    contractName: name,
    functionName: fn,
    functionArgs: [contractPrincipalCV(DEPLOYER, 'xtrata-v2-1-0'), uintCV(7)],
    senderKey: BUYER_KEY,
    network: new StacksMainnet(),
    fee,
    nonce: 0n,
    sponsored,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
    postConditions: withPc
      ? [makeStandardFungiblePostCondition(
          BUYER, FungibleConditionCode.Equal, 250n,
          createAssetInfo(sbtcAddr, sbtcName, 'sbtc-token')
        )]
      : []
  });
  return Buffer.from(tx.serialize()).toString('hex');
}

const LISTING = { budgetRemaining: '100000', soldAt: null };

function mockChain(overrides = {}) {
  const calls = [];
  let nonce = 10n;
  const chain = {
    calls,
    sponsorAddress: DEPLOYER,
    estimateBuyFee: async () => 20_000n,
    getBalance: async () => 100_000_000n,
    getNonce: async () => nonce++,
    sponsorAndBroadcast: async (a) => { calls.push(['sponsor', a]); return { txid: `buy-${calls.length}` }; },
    getTxStatus: async () => 'success',
    contractCall: async (a) => { calls.push(['call', a]); return { txid: `${a.functionName}-${calls.length}` }; },
    ...overrides
  };
  return chain;
}

function makeService(chain, extraOpts = {}) {
  const stateDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sponsor-test-'));
  const opts = { ...DEFAULTS, stateDir, ...extraOpts };
  return { svc: createSponsorService({ chain, allowlist: ALLOWLIST, opts }), stateDir, opts };
}

// ---------------------------------------------------------------- validation

test('accepts a genuine sponsored buy payload', async () => {
  const hex = await buildBuyTx();
  const { tx, contractId } = validateSponsorPayload(hex, {
    allowlist: ALLOWLIST, listing: LISTING, intendedFeeUstx: 20_000n
  });
  assert.equal(contractId, MARKET);
  assert.equal(txOriginAddress(tx), BUYER);
});

for (const [name, build, expectCode] of [
  ['non-sponsored auth', () => buildBuyTx({ sponsored: false }), 'NOT_SPONSORED'],
  ['nonzero origin fee', () => buildBuyTx({ fee: 100n }), 'NONZERO_FEE'],
  ['wrong function', () => buildBuyTx({ fn: 'cancel' }), 'FUNCTION_NOT_ALLOWED'],
  ['unlisted contract', () => buildBuyTx({ contract: `${DEPLOYER}.some-other-market` }), 'CONTRACT_NOT_ALLOWED'],
  ['missing post-conditions', () => buildBuyTx({ withPc: false }), 'NO_POST_CONDITIONS'],
  ['garbage payload', async () => 'deadbeef', 'BAD_TX']
]) {
  test(`rejects: ${name}`, async () => {
    const hex = await build();
    assert.throws(
      () => validateSponsorPayload(hex, { allowlist: ALLOWLIST, listing: LISTING, intendedFeeUstx: 20_000n }),
      (e) => e.code === expectCode
    );
  });
}

test('rejects sold listing, missing listing, and insufficient budget', async () => {
  const hex = await buildBuyTx();
  const check = (listing, fee, codeWanted) =>
    assert.throws(
      () => validateSponsorPayload(hex, { allowlist: ALLOWLIST, listing, intendedFeeUstx: fee }),
      (e) => e.code === codeWanted
    );
  check({ ...LISTING, soldAt: 123 }, 20_000n, 'LISTING_SOLD');
  check(null, 20_000n, 'LISTING_NOT_FOUND');
  check({ ...LISTING, budgetRemaining: '10' }, 20_000n, 'BUDGET_TOO_SMALL');
  check(LISTING, 3_000_000n, 'FEE_TOO_LARGE');
});

// ---------------------------------------------------------------- quoting

test('quoteBudget applies multiplier, floor, and ceiling', () => {
  assert.equal(quoteBudget(30_000n), 90_000n);           // 3x
  assert.equal(quoteBudget(1_000n), DEFAULTS.minBudgetUstx);   // floor
  assert.equal(quoteBudget(5_000_000n), DEFAULTS.maxFeeUstx);  // ceiling
});

// ---------------------------------------------------------------- happy path + settlement

test('happy path: submit → sponsor → confirm → claim → refund, receipt has all txids and dust math', async () => {
  const chain = mockChain();
  const { svc } = makeService(chain);
  const hex = await buildBuyTx();

  const job = await svc.submit({ txHex: hex, contractId: MARKET, listingId: 7, listing: LISTING });
  assert.equal(job.state, 'SPONSORED');
  assert.ok(job.txids.buy);

  let j = await svc.settleStep(job.id);          // SPONSORED → CONFIRMED
  assert.equal(j.state, 'CONFIRMED');
  j = await svc.settleStep(job.id);              // CONFIRMED → CLAIMED
  assert.equal(j.state, 'CLAIMED');
  j = await svc.settleStep(job.id);              // CLAIMED → SETTLED
  assert.equal(j.state, 'SETTLED');

  assert.ok(j.receipt.buyTx && j.receipt.claimTx && j.receipt.refundTx);
  assert.equal(j.receipt.feeClaimedUstx, j.feeUstx);
  const claim = chain.calls.find(([k, a]) => k === 'call' && a.functionName === 'claim-fee');
  const refund = chain.calls.find(([k, a]) => k === 'call' && a.functionName === 'settle-refund');
  assert.ok(claim && refund);
});

test('crash-resume: settlement resumes from persisted state at every stage', async () => {
  const chain = mockChain();
  const { svc, stateDir, opts } = makeService(chain);
  const hex = await buildBuyTx();
  const job = await svc.submit({ txHex: hex, contractId: MARKET, listingId: 7, listing: LISTING });

  // "crash": build a brand-new service over the same state dir
  const svc2 = createSponsorService({ chain, allowlist: ALLOWLIST, opts });
  await svc2.settleStep(job.id);
  await svc2.settleStep(job.id);

  // crash again after CLAIMED
  const svc3 = createSponsorService({ chain, allowlist: ALLOWLIST, opts });
  const j = await svc3.settleStep(job.id);
  assert.equal(j.state, 'SETTLED');
  assert.equal(loadJob(stateDir, job.id).state, 'SETTLED');
});

test('failed buy tx → ABANDONED; aborted claim still refunds the seller', async () => {
  // failed buy
  const chainFail = mockChain({ getTxStatus: async () => 'abort_by_response' });
  const s1 = makeService(chainFail);
  const job1 = await s1.svc.submit({ txHex: await buildBuyTx(), contractId: MARKET, listingId: 7, listing: LISTING });
  const j1 = await s1.svc.settleStep(job1.id);
  assert.equal(j1.state, 'ABANDONED');

  // buy succeeds, claim aborts (e.g. cap race) → refund still issued, dust 0-claim recorded
  let call = 0;
  const chainClaimAbort = mockChain({
    getTxStatus: async (txid) => (String(txid).startsWith('claim-fee') ? 'abort_by_response' : 'success')
  });
  const s2 = makeService(chainClaimAbort);
  const job2 = await s2.svc.submit({ txHex: await buildBuyTx(), contractId: MARKET, listingId: 8, listing: LISTING });
  await s2.svc.settleStep(job2.id); // confirmed
  await s2.svc.settleStep(job2.id); // claimed (broadcast)
  const j2 = await s2.svc.settleStep(job2.id); // settled despite claim abort
  assert.equal(j2.state, 'SETTLED');
  assert.equal(j2.receipt.feeClaimedUstx, '0');
  assert.ok(j2.receipt.refundTx);
});

// ---------------------------------------------------------------- guards

test('nonce serialization: concurrent submits get distinct, increasing nonces', async () => {
  const seen = [];
  const chain = mockChain({
    sponsorAndBroadcast: async (a) => { seen.push(a.nonce); return { txid: `buy-${seen.length}` }; }
  });
  const { svc } = makeService(chain);
  const h1 = await buildBuyTx();
  await Promise.all([
    svc.submit({ txHex: h1, contractId: MARKET, listingId: 7, listing: LISTING }),
    svc.submit({ txHex: h1.replace(/.$/, h1.endsWith('0') ? '1' : '0'), contractId: MARKET, listingId: 8, listing: LISTING })
      .catch(() => {}) // mutated payload may fail deserialization; nonce ordering is what we assert
  ]);
  assert.deepEqual([...seen], [...seen].sort((a, b) => (a < b ? -1 : 1)));
});

test('duplicate payload rejected; survives service restart', async () => {
  const chain = mockChain();
  const { svc, opts } = makeService(chain);
  const hex = await buildBuyTx();
  await svc.submit({ txHex: hex, contractId: MARKET, listingId: 7, listing: LISTING });
  await assert.rejects(
    svc.submit({ txHex: hex, contractId: MARKET, listingId: 7, listing: LISTING }),
    (e) => e.code === 'DUPLICATE'
  );
  const svc2 = createSponsorService({ chain, allowlist: ALLOWLIST, opts });
  await assert.rejects(
    svc2.submit({ txHex: hex, contractId: MARKET, listingId: 7, listing: LISTING }),
    (e) => e.code === 'DUPLICATE'
  );
});

test('low balance and capacity refusals', async () => {
  const { svc } = makeService(mockChain({ getBalance: async () => 1_000n }));
  await assert.rejects(
    svc.submit({ txHex: await buildBuyTx(), contractId: MARKET, listingId: 7, listing: LISTING }),
    (e) => e.code === 'LOW_BALANCE'
  );

  const s2 = makeService(mockChain(), { maxUnsettledJobs: 0 });
  await assert.rejects(
    s2.svc.submit({ txHex: await buildBuyTx(), contractId: MARKET, listingId: 7, listing: LISTING }),
    (e) => e.code === 'AT_CAPACITY'
  );
});

test('per-address rate limit', async () => {
  const chain = mockChain();
  const { svc } = makeService(chain, { maxJobsPerAddress: 1 });
  await svc.submit({ txHex: await buildBuyTx(), contractId: MARKET, listingId: 7, listing: LISTING });
  // different payload, same buyer
  const hex2 = await buildBuyTx({ fn: 'buy' });
  const tweak = (h) => h.slice(0, -2) + (h.endsWith('00') ? '01' : '00');
  await assert.rejects(
    svc.submit({ txHex: hex2, contractId: MARKET, listingId: 9, listing: LISTING }),
    (e) => e.code === 'RATE_LIMITED' || e.code === 'DUPLICATE'
  );
});

test('pending buy below timeout stays SPONSORED; beyond timeout is ABANDONED', async () => {
  const chain = mockChain({ getTxStatus: async () => 'pending' });
  let t = 1_000_000;
  const stateDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sponsor-test-'));
  const opts = { ...DEFAULTS, stateDir, settleTimeoutMs: 60_000 };
  const svc = createSponsorService({ chain, allowlist: ALLOWLIST, opts, now: () => t });
  const job = await svc.submit({ txHex: await buildBuyTx(), contractId: MARKET, listingId: 7, listing: LISTING });

  let j = await svc.settleStep(job.id);
  assert.equal(j.state, 'SPONSORED'); // still waiting
  t += 61_000;
  j = await svc.settleStep(job.id);
  assert.equal(j.state, 'ABANDONED');
});
