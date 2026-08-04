import { describe, expect, it, vi } from 'vitest';
import {
  TransactionVersion,
  boolCV,
  contractPrincipalCV,
  cvToHex,
  cvToJSON,
  getAddressFromPrivateKey,
  hexToCV,
  noneCV,
  responseErrorCV,
  responseOkCV,
  someCV,
  standardPrincipalCV,
  tupleCV,
  uintCV
} from '@stacks/transactions';

import { PERSONA_IDS } from '../personas.mjs';
import { CORE_CONTRACT } from '../inscribe.mjs';
import {
  TOKEN_SLOTS,
  decodeArgs,
  drySignSponsored,
  dryPorts,
  fakeMarketFetch,
  makeFakeMarket,
  makeFakeSponsor,
  resolveTokens,
  selectScenarios
} from '../market-run.mjs';
import {
  MARKETS,
  MIN_FEE_BUDGET_USTX,
  REFUND_DELAY_BLOCKS,
  SCENARIO_IDS,
  argsHashHex,
  assertMarketBroadcastAllowed,
  buildMarketCall,
  committedMarketSpendUstx,
  formatScenarioTable,
  getMarket,
  marketJournalPathFor,
  parseListing,
  priceForMarket,
  readErrorResult,
  runMarketScenarios
} from '../market-run-core.mjs';

const MINER_FEE = 30_000n;
const FLOAT = 5_000_000n;
const JOURNAL_DIR = '/tmp/wizard-market-tests';
const RUN_ID = 'test-run';

const STX_MARKET = getMarket('stx');
const SBTC_MARKET = getMarket('sbtc');
const USDCX_MARKET = getMarket('usdcx');

/**
 * Synthetic wizard wallets, derived from fixed dummy keys so they are valid c32
 * and belong to nobody. Never funded on chain, never used to sign: the submit
 * port in every test below is a fake, and the core never signs anything itself.
 */
const dummyKey = (index: number) => String(index + 1).padStart(64, '0');
const ADDRESSES = Object.fromEntries(
  PERSONA_IDS.map((id: string, index: number) => [id, getAddressFromPrivateKey(dummyKey(index), TransactionVersion.Mainnet)])
) as Record<string, string>;
const WALLETS = Object.fromEntries(
  PERSONA_IDS.map((id: string, index: number) => [id, { address: ADDRESSES[id], key: dummyKey(index) }])
) as Record<string, { address: string; key: string }>;

const SELLER = ADDRESSES.archivist;
const BUYER = ADDRESSES.skeptic;

/** One inscription per listing scenario, as the CLI's dry mode invents them. */
const TOKENS: Record<string, string> = {
  'list-stx': '9001',
  'list-sbtc': '9002',
  'list-usdcx': '9003',
  'buy-sponsored': '9004'
};

type HarnessOptions = {
  tokens?: Record<string, string>;
  blocksPerTx?: number;
  fundUstx?: bigint;
  /** Give a wallet some of a market's payment token before the run starts. */
  fundToken?: Array<{ market: typeof STX_MARKET; address: string; amount: bigint }>;
  /** Seed the journal as if an earlier run had written it. */
  journal?: unknown;
  killSwitch?: (env: NodeJS.ProcessEnv) => string | null;
  sponsor?: unknown;
  /**
   * Make the sBTC `buy` succeed even though the buyer's balance reads zero:
   * the "silent success" scenario 8 exists to catch.
   */
  silentSuccessOnSbtcBuy?: boolean;
};

/**
 * A whole runnable world: a fake market seeded with the wizards' inscriptions,
 * a fetch that answers from it and refuses anything else, a submit that applies
 * calls to it, and a journal that round-trips through JSON exactly as a file
 * would.
 *
 * The fake market and the fake fetch are the ones `--dry` itself uses, imported
 * rather than re-implemented, so a fake that drifts from the real Clarity
 * encoders shows up in these tests instead of on mainnet.
 */
const harness = (options: HarnessOptions = {}) => {
  const chain = makeFakeMarket({ minerFeeUstx: MINER_FEE, blocksPerTx: options.blocksPerTx ?? 1 });
  for (const id of PERSONA_IDS) chain.fund(ADDRESSES[id], options.fundUstx ?? FLOAT);
  const tokens = options.tokens ?? TOKENS;
  for (const tokenId of Object.values(tokens)) chain.mint(tokenId, SELLER);
  for (const grant of options.fundToken ?? []) {
    chain.fundToken(grant.market.payment.contractId, grant.address, grant.amount);
  }

  const urls: string[] = [];
  const answer = fakeMarketFetch(chain);
  const fetchImpl = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    urls.push(String(input));
    return answer(input, init);
  });

  const submitted: Array<{ contractId: string; functionName: string; sender: string }> = [];
  const submit = vi.fn(async ({ call, broadcast, senderAddress }: any) => {
    if (broadcast === true) throw new Error('the test submit port was asked to broadcast');
    submitted.push({ contractId: call.contractId, functionName: call.functionName, sender: senderAddress });
    const args = decodeArgs(call.functionArgs.map((argument: never) => cvToHex(argument)));
    if (options.silentSuccessOnSbtcBuy && call.contractId === SBTC_MARKET.contractId && call.functionName === 'buy') {
      // The market bug this is standing in for: the payment leg somehow works
      // for a wallet whose balance is and stays zero.
      chain.fundToken(SBTC_MARKET.payment.contractId, senderAddress, 10_000_000n);
      const applied = chain.apply({ contractId: call.contractId, functionName: 'buy', args, sender: senderAddress, feeUstx: MINER_FEE });
      chain.tokens.get(SBTC_MARKET.payment.contractId).set(senderAddress, 0n);
      return { txid: applied.txid };
    }
    const applied = chain.apply({
      contractId: call.contractId,
      functionName: call.functionName,
      args,
      sender: senderAddress,
      feeUstx: MINER_FEE
    });
    return { txid: applied.txid };
  });

  let disk: string | null = options.journal ? JSON.stringify(options.journal) : null;
  const said: string[] = [];
  const sponsor = options.sponsor === undefined ? makeFakeSponsor({ chain }) : options.sponsor;

  const ports = {
    fetchImpl: fetchImpl as unknown as typeof fetch,
    submit,
    sponsor,
    // Round-tripped through JSON, like a file: nothing may depend on the runner
    // handing itself back the same object it wrote.
    readJournal: () => (disk === null ? null : JSON.parse(disk)),
    writeJournal: (_path: string, journal: unknown) => {
      disk = JSON.stringify(journal);
    },
    killSwitch: options.killSwitch ?? (() => null),
    now: () => Date.UTC(2026, 6, 31, 12, 0, 0),
    sleep: async () => {},
    say: (line: string) => said.push(String(line)),
    presentPlan: () => {}
  };

  const run = (overrides: Record<string, unknown> = {}) =>
    runMarketScenarios({
      ports,
      options: {
        runId: RUN_ID,
        broadcast: false,
        wallets: WALLETS,
        tokens,
        journalDir: JOURNAL_DIR,
        minerFeeUstx: MINER_FEE,
        confirmTimeoutMs: 120_000,
        confirmPollMs: 1_000,
        mempoolWaitMs: 0,
        sponsorPollMs: 0,
        signSponsored: drySignSponsored,
        ...overrides
      }
    });

  return {
    chain,
    ports,
    submit,
    submitted,
    fetchImpl,
    urls,
    said,
    sponsor,
    run,
    journal: () => (disk === null ? null : JSON.parse(disk)),
    row: (report: any, id: string) => report.scenarios.find((scenario: any) => scenario.id === id)
  };
};

/** The whole plan, in order, as `--all` runs it. */
const runAll = (options: HarnessOptions = {}, overrides: Record<string, unknown> = {}) => {
  const world = harness(options);
  return world.run(overrides).then((report) => ({ world, report }));
};

/* ------------------------------------------------------------------ */
/* decoding, with the real encoders                                    */
/* ------------------------------------------------------------------ */

describe('decoding a listing', () => {
  /**
   * Built with cvToHex from the real Clarity constructors, never hand-written
   * JSON. A hand-built stub previously hid a real decode bug in this codebase,
   * and the convention exists because of it.
   */
  const encodedListing = (overrides: Record<string, unknown> = {}) =>
    tupleCV({
      seller: standardPrincipalCV(SELLER),
      'nft-contract': contractPrincipalCV(...(CORE_CONTRACT.split('.') as [string, string])),
      'token-id': uintCV(2922n),
      price: uintCV(100_000n),
      'created-at': uintCV(8_700_000n),
      'fee-budget': uintCV(50_000n),
      'budget-remaining': uintCV(50_000n),
      claimed: uintCV(0n),
      buyer: noneCV(),
      'sold-at': noneCV(),
      ...overrides
    });

  // Round-tripped through hex exactly as callContractReadOnly does, so a
  // fixture that disagrees with the encoder fails here rather than on mainnet.
  const decode = (cv: ReturnType<typeof someCV>) => parseListing(cvToJSON(hexToCV(cvToHex(cv))), 7);

  it('reads every field of an unsold listing', () => {
    const listing = decode(someCV(encodedListing()));
    expect(listing).toMatchObject({
      listingId: '7',
      seller: SELLER,
      nftContract: CORE_CONTRACT,
      tokenId: 2922n,
      price: 100_000n,
      feeBudget: 50_000n,
      budgetRemaining: 50_000n,
      claimed: 0n,
      buyer: null,
      soldAt: null,
      sold: false
    });
  });

  it('distinguishes a listing sold at block 0 from one that is not sold', () => {
    const listing = decode(
      someCV(encodedListing({ buyer: someCV(standardPrincipalCV(BUYER)), 'sold-at': someCV(uintCV(0n)) }))
    );
    expect(listing?.sold).toBe(true);
    expect(listing?.soldAt).toBe(0n);
    expect(listing?.buyer).toBe(BUYER);
  });

  it('reads a deleted listing as null rather than an empty row', () => {
    expect(decode(noneCV() as never)).toBeNull();
  });
});

describe('reading an abort reason', () => {
  it('names a market error out of a real encoded (err u105)', () => {
    const result = readErrorResult({ hex: cvToHex(responseErrorCV(uintCV(105n))), repr: '(err u105)' });
    expect(result.code).toBe(105);
    expect(result.isMarketError).toBe(true);
    expect(result.meaning).toMatch(/below MIN-FEE-BUDGET/);
  });

  it('does not mistake a payment-token error for a market refusal', () => {
    const result = readErrorResult({ hex: cvToHex(responseErrorCV(uintCV(1n))), repr: '(err u1)' });
    expect(result.code).toBe(1);
    expect(result.isMarketError).toBe(false);
  });

  it('reports an unreadable result rather than guessing at one', () => {
    expect(readErrorResult({ repr: 'something else entirely' }).code).toBeNull();
    expect(readErrorResult(null).code).toBeNull();
  });

  it('recognises a success', () => {
    expect(readErrorResult({ hex: cvToHex(responseOkCV(boolCV(true))), repr: '(ok true)' }).ok).toBe(true);
  });
});

/* ------------------------------------------------------------------ */
/* pure planning                                                       */
/* ------------------------------------------------------------------ */

describe('building a market call', () => {
  it('bounds a listing with an NFT condition and a LessEqual STX condition on the budget', () => {
    const call = buildMarketCall({
      action: 'list-token',
      market: STX_MARKET,
      tokenId: 2922n,
      priceAmount: 100_000n,
      feeBudgetUstx: 50_000n,
      senderAddress: SELLER
    });
    expect(call.functionName).toBe('list-token');
    expect(call.functionArgs).toHaveLength(4);
    expect(call.postConditions).toHaveLength(2);
    expect(call.postConditionMode).toBe('deny');
    expect(call.postConditionShape.join(' ')).toContain('<= 50,000 microSTX');
    // Never Equal: an exact-match condition aborts and burns the miner fee the
    // moment the contract moves a microSTX less than predicted.
    expect(call.postConditionShape.join(' ')).not.toContain('== ');
    expect(call.stxOutflowUstx).toBe(50_000n);
  });

  it('charges the fee budget in STX on the sBTC market too', () => {
    const call = buildMarketCall({
      action: 'list-token',
      market: SBTC_MARKET,
      tokenId: 2923n,
      priceAmount: 1_000n,
      feeBudgetUstx: MIN_FEE_BUDGET_USTX,
      senderAddress: SELLER
    });
    expect(call.stxOutflowUstx).toBe(MIN_FEE_BUDGET_USTX);
    expect(call.postConditionShape.join(' ')).toContain('the fee budget, in STX on every sponsored market');
  });

  it('bounds a cross-currency buy in the payment token, not in STX', () => {
    const call = buildMarketCall({
      action: 'buy',
      market: SBTC_MARKET,
      tokenId: 2923n,
      listingId: 4n,
      priceAmount: 1_000n,
      senderAddress: BUYER
    });
    expect(call.stxOutflowUstx).toBe(0n);
    expect(call.postConditionShape[0]).toContain('sBTC from');
  });

  it('bounds a cancel by the budget still held by the market contract', () => {
    const call = buildMarketCall({
      action: 'cancel',
      market: USDCX_MARKET,
      tokenId: 2924n,
      listingId: 1n,
      senderAddress: SELLER,
      budgetRemainingUstx: 50_000n
    });
    expect(call.postConditions).toHaveLength(2);
    expect(call.postConditionShape[1]).toContain('the remaining budget');
  });

  it('carries no post-condition for a settle that moves nothing', () => {
    const call = buildMarketCall({
      action: 'settle-refund',
      market: STX_MARKET,
      tokenId: 1n,
      listingId: 1n,
      senderAddress: SELLER,
      budgetRemainingUstx: 0n
    });
    expect(call.postConditions).toHaveLength(0);
    expect(call.postConditionShape[0]).toContain('nothing moves');
  });

  it('refuses an action it does not know how to build', () => {
    expect(() => buildMarketCall({ action: 'claim-fee', market: STX_MARKET, listingId: 1n, tokenId: 1n, senderAddress: SELLER })).toThrow(
      /not a market action/
    );
  });
});

describe('the args hash', () => {
  const call = (price: bigint) =>
    buildMarketCall({
      action: 'list-token',
      market: STX_MARKET,
      tokenId: 2922n,
      priceAmount: price,
      feeBudgetUstx: 50_000n,
      senderAddress: SELLER
    });

  it('is stable for the same call and moves when an argument moves', () => {
    expect(argsHashHex(call(100_000n))).toBe(argsHashHex(call(100_000n)));
    expect(argsHashHex(call(100_000n))).not.toBe(argsHashHex(call(100_001n)));
  });
});

describe('one price across three units', () => {
  it('holds the magnitude rather than the nominal value', () => {
    expect(priceForMarket(100_000n, STX_MARKET)).toBe(100_000n);
    expect(priceForMarket(100_000n, USDCX_MARKET)).toBe(100_000n);
    // 8 decimals: 100,000 microSTX becomes 1,000 satoshis, not 0.001 BTC.
    expect(priceForMarket(100_000n, SBTC_MARKET)).toBe(1_000n);
  });

  it('never rounds a price to zero, which would abort with u103', () => {
    expect(priceForMarket(1n, SBTC_MARKET)).toBe(1n);
  });
});

describe('the market table', () => {
  it('holds only the three sponsored markets', () => {
    expect(MARKETS.map((market) => market.key)).toEqual(['stx', 'sbtc', 'usdcx']);
    for (const market of MARKETS) expect(market.contractName).toContain('sponsored');
  });

  it('refuses a market that hardcodes the retired core', () => {
    expect(() => getMarket('xtrata-market-stx-v1-0')).toThrow(/retired xtrata-v2-1-0/);
  });

  it('resolves by short key and by contract id', () => {
    expect(getMarket('stx').contractId).toBe(STX_MARKET.contractId);
    expect(getMarket(STX_MARKET.contractId).key).toBe('stx');
  });
});

/* ------------------------------------------------------------------ */
/* the happy paths                                                     */
/* ------------------------------------------------------------------ */

describe('the whole plan', () => {
  it('passes every scenario, settlement excepted, and skips settlement with a block count', async () => {
    const { world, report } = await runAll();
    const byId = Object.fromEntries(report.scenarios.map((row: any) => [row.id, row]));
    for (const id of SCENARIO_IDS.filter((scenario) => scenario !== 'settlement')) {
      expect(`${id}:${byId[id].status}`, byId[id].reason ?? byId[id].summary).toBe(`${id}:passed`);
    }
    expect(byId.settlement.status).toBe('skipped');
    expect(byId.settlement.reason).toMatch(/blocks remain/);
    expect(report.ok).toBe(true);
    expect(world.submitted.length).toBeGreaterThan(0);
  });

  it('passes settlement once the refund delay has elapsed, and checks the arithmetic', async () => {
    const { report } = await runAll({ blocksPerTx: 40 });
    const settlement = report.scenarios.find((row: any) => row.id === 'settlement');
    expect(settlement.status).toBe('passed');
    expect(settlement.summary).toMatch(/budget 50,000 less claimed 0 returned 50,000 microSTX/);
  });

  it('escrows the NFT and takes the budget, and reads the listing back off chain', async () => {
    const { world, report } = await runAll({}, { scenarios: ['list-stx'] });
    const row = world.row(report, 'list-stx');
    expect(row.status).toBe('passed');
    const listing = world.chain.listingOf(STX_MARKET.contractId, row.listingId);
    expect(listing.seller).toBe(SELLER);
    expect(listing.tokenId).toBe(9001n);
    expect(listing.feeBudget).toBe(MIN_FEE_BUDGET_USTX);
    expect(world.chain.owners.get('9001')).toBe(STX_MARKET.contractId);
    expect(world.chain.balanceOf(SELLER)).toBe(FLOAT - MIN_FEE_BUDGET_USTX - MINER_FEE);
  });

  it('lists for sBTC from a wallet holding no sBTC, paying the budget in STX', async () => {
    const { world, report } = await runAll({}, { scenarios: ['list-sbtc'] });
    expect(world.row(report, 'list-sbtc').status).toBe('passed');
    expect(world.row(report, 'list-sbtc').summary).toMatch(/held 0 sBTC throughout/);
    expect(world.chain.tokenBalance(SBTC_MARKET.payment.contractId, SELLER)).toBe(0n);
    expect(world.chain.balanceOf(SELLER)).toBe(FLOAT - MIN_FEE_BUDGET_USTX - MINER_FEE);
  });

  it('moves the NFT to the buyer and the STX to the seller on a self-paid buy', async () => {
    const { world, report } = await runAll({}, { scenarios: ['list-stx', 'buy-stx'] });
    expect(world.row(report, 'buy-stx').status).toBe('passed');
    expect(world.chain.owners.get('9001')).toBe(BUYER);
    expect(world.chain.balanceOf(BUYER)).toBe(FLOAT - 100_000n - MINER_FEE);
    const listing = world.chain.listingOf(STX_MARKET.contractId, '0');
    expect(listing.buyer).toBe(BUYER);
    expect(listing.soldAt).not.toBeNull();
  });

  it('buys through the relayer without the buyer paying a miner fee', async () => {
    const { world, report } = await runAll({}, { scenarios: ['buy-sponsored'] });
    expect(world.row(report, 'buy-sponsored').status).toBe('passed');
    expect(world.chain.owners.get('9004')).toBe(BUYER);
    // The buyer paid the price and nothing else: the relayer paid the fee and
    // reimbursed itself out of the seller's escrowed budget.
    expect(world.chain.balanceOf(BUYER)).toBe(FLOAT - 100_000n);
    expect((world.sponsor as any).calls).toContain('quote');
    expect((world.sponsor as any).calls).toContain('submit');
  });
});

/* ------------------------------------------------------------------ */
/* the assertion scenarios 3, 4 and 8 rest on                          */
/* ------------------------------------------------------------------ */

describe('the zero-token assertion', () => {
  it('fires when the seller actually holds the payment token', async () => {
    const { world, report } = await runAll(
      { fundToken: [{ market: SBTC_MARKET, address: SELLER, amount: 500n }] },
      { scenarios: ['list-sbtc'] }
    );
    const row = world.row(report, 'list-sbtc');
    expect(row.status).toBe('failed');
    expect(row.reason).toMatch(/only meaningful from a wallet that holds zero/);
    // Nothing was signed: the point of the assertion is to stop before it says
    // something it has not proved.
    expect(world.submitted).toHaveLength(0);
  });

  it('fires for USDCx as well as sBTC', async () => {
    const { world, report } = await runAll(
      { fundToken: [{ market: USDCX_MARKET, address: SELLER, amount: 1n }] },
      { scenarios: ['list-usdcx'] }
    );
    expect(world.row(report, 'list-usdcx').status).toBe('failed');
  });
});

describe('scenario 8, the expected failure', () => {
  it('passes when the buy aborts cleanly with a payment-token error', async () => {
    const { world, report } = await runAll({}, { scenarios: ['list-sbtc', 'buy-sbtc-expected-failure'] });
    const row = world.row(report, 'buy-sbtc-expected-failure');
    expect(row.status).toBe('passed');
    expect(row.detail.provenBy).toBe('broadcast');
    expect(row.detail.errorCode).toBe(1);
    expect(row.summary).toMatch(/aborted as abort_by_response/);
    // Nothing moved: the escrow still holds the token and the listing is live.
    expect(world.chain.owners.get('9002')).toBe(SBTC_MARKET.contractId);
    expect(world.chain.listingOf(SBTC_MARKET.contractId, '0').soldAt).toBeNull();
  });

  it('FAILS on a silent success, and says the market is the thing at fault', async () => {
    const { world, report } = await runAll({ silentSuccessOnSbtcBuy: true }, { scenarios: ['list-sbtc', 'buy-sbtc-expected-failure'] });
    const row = world.row(report, 'buy-sbtc-expected-failure');
    expect(row.status).toBe('failed');
    expect(row.reason).toMatch(/SUCCEEDED from a wallet holding no sBTC/);
    expect(row.reason).toMatch(/market bug, not a test failure/);
    expect(report.ok).toBe(false);
  });

  it('FAILS when the abort is a market refusal rather than the payment leg', async () => {
    const world = harness();
    // Sell the listing out from under the scenario, so the buy aborts with u106
    // instead of reaching the token transfer.
    const listed = await world.run({ scenarios: ['list-sbtc'] });
    expect(world.row(listed, 'list-sbtc').status).toBe('passed');
    world.chain.fundToken(SBTC_MARKET.payment.contractId, ADDRESSES.builder, 10_000_000n);
    world.chain.apply({
      contractId: SBTC_MARKET.contractId,
      functionName: 'buy',
      args: [CORE_CONTRACT, 0n],
      sender: ADDRESSES.builder
    });
    const report = await world.run({ scenarios: ['buy-sbtc-expected-failure'] });
    const row = world.row(report, 'buy-sbtc-expected-failure');
    // Already sold is a legitimate skip: there is nothing left to fail at.
    expect(row.status).toBe('skipped');
    expect(row.reason).toMatch(/already sold/);
  });

  it('can prove the failure read-only, spending no miner fee', async () => {
    const world = harness();
    await world.run({ scenarios: ['list-sbtc'] });
    const before = world.submitted.length;
    const report = await world.run({ scenarios: ['buy-sbtc-expected-failure'], proveFailureOnChain: false });
    const row = world.row(report, 'buy-sbtc-expected-failure');
    expect(row.status).toBe('passed');
    expect(row.detail.provenBy).toBe('read-only');
    expect(row.summary).toMatch(/no miner fee was spent/);
    expect(world.submitted.length).toBe(before);
  });
});

/* ------------------------------------------------------------------ */
/* cancel, relist, settlement                                          */
/* ------------------------------------------------------------------ */

describe('cancel', () => {
  it('returns the NFT and the FULL budget', async () => {
    const { world, report } = await runAll({}, { scenarios: ['list-usdcx', 'cancel'] });
    expect(world.row(report, 'cancel').status).toBe('passed');
    expect(world.chain.owners.get('9003')).toBe(SELLER);
    expect(world.chain.listingOf(USDCX_MARKET.contractId, '0')).toBeNull();
    // Two miner fees paid, the whole 50,000 budget back: nothing else moved.
    expect(world.chain.balanceOf(SELLER)).toBe(FLOAT - MINER_FEE * 2n);
  });

  it('reports a short refund as a failure rather than a pass', async () => {
    const world = harness();
    await world.run({ scenarios: ['list-usdcx'] });
    // Pretend the contract kept some of the budget.
    world.chain.listingOf(USDCX_MARKET.contractId, '0').budgetRemaining = 10_000n;
    const report = await world.run({ scenarios: ['cancel'] });
    const row = world.row(report, 'cancel');
    // The listing now claims 10,000 remaining and returns exactly that, so the
    // check is satisfied; what matters is that the runner compares against the
    // listing's own number rather than assuming the original budget.
    expect(row.status).toBe('passed');
    expect(world.chain.balanceOf(SELLER)).toBe(FLOAT - MINER_FEE * 2n - 40_000n);
  });
});

describe('relist', () => {
  it('produces a new listing id at the new price', async () => {
    const { world, report } = await runAll({}, { scenarios: ['list-sbtc', 'relist'] });
    const row = world.row(report, 'relist');
    expect(row.status).toBe('passed');
    expect(row.listingId).not.toBe(row.detail.previousListingId);
    const listing = world.chain.listingOf(SBTC_MARKET.contractId, row.listingId);
    expect(listing.price).toBe(priceForMarket(150_000n, SBTC_MARKET));
    expect(world.chain.listingOf(SBTC_MARKET.contractId, row.detail.previousListingId)).toBeNull();
  });

  it('refuses to relist at the price it already has', async () => {
    const { world, report } = await runAll({}, { scenarios: ['list-sbtc', 'relist'], relistPriceUstx: 100_000n });
    const row = world.row(report, 'relist');
    expect(row.status).toBe('failed');
    expect(row.reason).toMatch(/has to change something/);
  });
});

describe('settlement', () => {
  it('skips politely before the refund delay, naming the blocks remaining', async () => {
    const { world, report } = await runAll({}, { scenarios: ['list-stx', 'buy-stx', 'settlement'] });
    const row = world.row(report, 'settlement');
    expect(row.status).toBe('skipped');
    expect(BigInt(row.detail.blocksRemaining)).toBeGreaterThan(0n);
    expect(BigInt(row.detail.blocksRemaining)).toBeLessThanOrEqual(REFUND_DELAY_BLOCKS);
    expect(row.reason).toMatch(/would abort with u109/);
    // A skip is not a failure and does not stop the run.
    expect(report.ok).toBe(true);
  });

  it('returns fee-budget minus claimed once the delay has passed', async () => {
    // Wide enough that two transactions carry the fake tip past REFUND-DELAY,
    // which on mainnet is about a day.
    const world = harness({ blocksPerTx: 200 });
    await world.run({ scenarios: ['list-stx', 'buy-stx'] });
    // The sponsor takes its cut out of the escrow before the seller settles.
    world.chain.apply({
      contractId: STX_MARKET.contractId,
      functionName: 'claim-fee',
      args: [0n, 20_000n],
      sender: 'SPONSOR',
      feeUstx: 0n
    });
    const sellerBefore = world.chain.balanceOf(SELLER);
    const report = await world.run({ scenarios: ['settlement'] });
    const row = world.row(report, 'settlement');
    expect(row.status).toBe('passed');
    expect(row.summary).toMatch(/budget 50,000 less claimed 20,000 returned 30,000 microSTX/);
    expect(world.chain.balanceOf(SELLER)).toBe(sellerBefore + 30_000n - MINER_FEE);
    expect(world.chain.listingOf(STX_MARKET.contractId, '0')).toBeNull();
  });
});

/* ------------------------------------------------------------------ */
/* the journal and the crash window                                    */
/* ------------------------------------------------------------------ */

const seededJournal = (steps: Record<string, unknown>) => ({
  version: 1,
  runId: RUN_ID,
  mode: 'dry',
  startedAt: '2026-07-31T12:00:00.000Z',
  updatedAt: '2026-07-31T12:00:00.000Z',
  steps,
  scenarios: {},
  listings: {}
});

describe('the crash window', () => {
  /** Intent written, transaction id never was, and the listing did land. */
  const strandedIntent = (overrides: Record<string, unknown> = {}) =>
    seededJournal({
      'list-stx:list': {
        scenarioId: 'list-stx',
        label: 'list #9001',
        status: 'broadcasting',
        txid: null,
        senderAddress: SELLER,
        intendedNonce: 99,
        ...overrides
      }
    });

  it('adopts a step the probe proves already landed, and broadcasts nothing', async () => {
    const world = harness({ journal: strandedIntent() });
    // The listing the lost transaction made.
    world.chain.apply({
      contractId: STX_MARKET.contractId,
      functionName: 'list-token',
      args: [CORE_CONTRACT, 9001n, 100_000n, MIN_FEE_BUDGET_USTX],
      sender: SELLER
    });
    const report = await world.run({ scenarios: ['list-stx'] });
    expect(world.row(report, 'list-stx').status).toBe('passed');
    expect(world.submitted).toHaveLength(0);
    expect(world.journal().steps['list-stx:list'].status).toBe('confirmed');
    expect(world.said.join('\n')).toMatch(/recovered by probe/);
  });

  it('re-sends only when the nonce proves the transaction never landed', async () => {
    // Nonce 99 was intended; this wallet has executed nothing, so 99 has never
    // confirmed and the listing provably does not exist.
    const world = harness({ journal: strandedIntent() });
    const report = await world.run({ scenarios: ['list-stx'] });
    expect(world.row(report, 'list-stx').status).toBe('passed');
    expect(world.submitted).toHaveLength(1);
    expect(world.journal().steps['list-stx:list'].previousIntents).toHaveLength(1);
    expect(world.journal().steps['list-stx:list'].previousIntents[0].reason).toBe('nonce-proved-absent');
  });

  it('halts rather than re-sending when the nonce was consumed by something unidentifiable', async () => {
    const world = harness({ journal: strandedIntent({ intendedNonce: 0 }) });
    // Something spent nonce 0 on this wallet. It may or may not have been this
    // listing, and the nonce alone cannot say which.
    world.chain.nonces.set(SELLER, {
      last_executed_tx_nonce: 5,
      possible_next_nonce: 6,
      last_mempool_tx_nonce: null,
      detected_missing_nonces: [],
      detected_mempool_nonces: []
    });
    const report = await world.run({ scenarios: ['list-stx'] });
    expect(report.halted?.reason).toBe('unresolved');
    expect(report.halted?.message).toMatch(/will not send it again/);
    expect(world.submitted).toHaveLength(0);
  });

  it('waits, then halts, while the intended nonce is still in the mempool', async () => {
    const world = harness({ journal: strandedIntent({ intendedNonce: 7 }) });
    world.chain.nonces.set(SELLER, {
      last_executed_tx_nonce: 6,
      possible_next_nonce: 8,
      last_mempool_tx_nonce: 7,
      detected_missing_nonces: [],
      detected_mempool_nonces: [7]
    });
    const report = await world.run({ scenarios: ['list-stx'] });
    expect(report.halted?.reason).toBe('unresolved');
    expect(world.submitted).toHaveLength(0);
  });

  it('never re-broadcasts a step already recorded as confirmed', async () => {
    const world = harness({
      journal: seededJournal({
        'list-stx:list': { scenarioId: 'list-stx', status: 'confirmed', txid: `0x${'a'.repeat(64)}` }
      })
    });
    world.chain.apply({
      contractId: STX_MARKET.contractId,
      functionName: 'list-token',
      args: [CORE_CONTRACT, 9001n, 100_000n, MIN_FEE_BUDGET_USTX],
      sender: SELLER
    });
    const report = await world.run({ scenarios: ['list-stx'] });
    expect(world.row(report, 'list-stx').status).toBe('passed');
    expect(world.submitted).toHaveLength(0);
  });

  it('halts on a step recorded as failed rather than trying it again', async () => {
    const world = harness({
      journal: seededJournal({
        'list-stx:list': { scenarioId: 'list-stx', status: 'failed', txid: `0x${'b'.repeat(64)}`, txStatus: 'abort_by_response' }
      })
    });
    const report = await world.run({ scenarios: ['list-stx'] });
    expect(report.halted?.reason).toBe('tx-failed');
    expect(report.halted?.message).toMatch(/does not retry a broadcast/);
    expect(world.submitted).toHaveLength(0);
  });

  it('records the sender, the intended nonce and the args hash before anything is sent', async () => {
    const world = harness();
    await world.run({ scenarios: ['list-stx'] });
    const step = world.journal().steps['list-stx:list'];
    expect(step.senderAddress).toBe(SELLER);
    expect(step.intendedNonce).toBe(0);
    expect(step.argsHashHex).toMatch(/^0x[0-9a-f]{64}$/);
    expect(step.contractId).toBe(STX_MARKET.contractId);
  });

  it('refuses to write a journal containing anything that looks like a key', async () => {
    const world = harness();
    await world.run({ scenarios: ['list-stx'] });
    expect(JSON.stringify(world.journal())).not.toContain(WALLETS.archivist.key);
  });

  it('refuses a journal written by a different run or a different mode', async () => {
    const world = harness({ journal: { ...seededJournal({}), runId: 'somebody-elses-run' } });
    await expect(world.run({ scenarios: ['list-stx'] })).rejects.toThrow(/is for run somebody-elses-run/);
  });

  it('will not load a journal from a future version', async () => {
    const world = harness({ journal: { ...seededJournal({}), version: 99 } });
    await expect(world.run({ scenarios: ['list-stx'] })).rejects.toThrow(/version 99/);
  });
});

describe('the journal path', () => {
  it('keeps dry runs in their own file, and refuses a run id that is not a file name', () => {
    expect(marketJournalPathFor({ dir: '/x', runId: 'nightly', mode: 'dry' })).toBe('/x/.market-nightly.dry.json');
    expect(marketJournalPathFor({ dir: '/x', runId: 'nightly' })).toBe('/x/.market-nightly.json');
    expect(() => marketJournalPathFor({ dir: '/x', runId: '../../etc/passwd' })).toThrow(/not a usable run id/);
  });
});

/* ------------------------------------------------------------------ */
/* the rails                                                           */
/* ------------------------------------------------------------------ */

describe('the run-level spend cap', () => {
  it('halts before the first broadcast when the cap cannot cover it', async () => {
    const { world, report } = await runAll({}, { runSpendCapUstx: 1_000n });
    expect(report.halted?.reason).toBe('spend-cap');
    expect(world.submitted).toHaveLength(0);
    expect(report.scenarios.every((row: any) => row.status === 'blocked')).toBe(true);
  });

  it('stops a run partway once the committed total reaches the cap', async () => {
    const { world, report } = await runAll({}, { runSpendCapUstx: 200_000n });
    expect(report.halted?.reason).toBe('spend-cap');
    // Two listings at 80,000 each fit; the third crosses the line.
    expect(world.submitted).toHaveLength(2);
    expect(committedMarketSpendUstx(world.journal())).toBe(160_000n);
  });
});

describe('the kill switch', () => {
  it('stops before anything is signed', async () => {
    const { world, report } = await runAll({ killSwitch: () => 'WIZARD_KILL_SWITCH is set' });
    expect(report.halted?.reason).toBe('kill-switch');
    expect(world.submitted).toHaveLength(0);
  });

  it('stops at the next boundary when engaged mid-run', async () => {
    let calls = 0;
    const { world, report } = await runAll({
      killSwitch: () => {
        calls += 1;
        return calls > 6 ? 'KILL file exists' : null;
      }
    });
    expect(report.halted?.reason).toBe('kill-switch');
    expect(world.submitted.length).toBeGreaterThan(0);
    expect(report.scenarios.some((row: any) => row.status === 'passed')).toBe(true);
  });
});

describe('the broadcast rails', () => {
  const base = {
    senderKey: dummyKey(0),
    wizardId: 'archivist',
    senderAddress: SELLER,
    balanceUstx: FLOAT,
    stxOutflowUstx: 50_000n,
    minerFeeUstx: MINER_FEE,
    postConditions: []
  };

  it('refuses without a key, and refuses a key that is not hex', () => {
    expect(() => assertMarketBroadcastAllowed({ ...base, senderKey: null })).toThrow(/no key/);
    expect(() => assertMarketBroadcastAllowed({ ...base, senderKey: 'not-a-key' })).toThrow(/not a hex private key/);
  });

  it('refuses while the kill switch is engaged, before every other check', () => {
    expect(() => assertMarketBroadcastAllowed({ ...base, senderKey: null, killReason: 'KILL exists' })).toThrow(/kill switch/);
  });

  it('fails closed when the market allowlist could not be read', () => {
    expect(() =>
      assertMarketBroadcastAllowed({
        ...base,
        nftAllowedCheck: { ok: false, status: 'unavailable', market: STX_MARKET.contractId, error: 'HTTP 500' }
      })
    ).toThrow(/fails closed/);
  });

  it('refuses a market that will not take this core', () => {
    expect(() =>
      assertMarketBroadcastAllowed({
        ...base,
        nftAllowedCheck: { ok: false, status: 'rejected', market: STX_MARKET.contractId }
      })
    ).toThrow(/list-token would abort/);
  });

  it('refuses to spend a wallet below the floor', () => {
    expect(() => assertMarketBroadcastAllowed({ ...base, balanceUstx: 1_010_000n })).toThrow(/below the floor/);
    expect(() => assertMarketBroadcastAllowed({ ...base, balanceUstx: 900_000n })).toThrow(/is below the floor/);
  });

  it('refuses a call with no post-condition list at all', () => {
    expect(() => assertMarketBroadcastAllowed({ ...base, postConditions: null })).toThrow(/no post-condition list/);
  });

  it('passes a well-formed call and reports what it plans to spend', () => {
    expect(assertMarketBroadcastAllowed(base)).toEqual({
      plannedSpendUstx: 80_000n,
      stxOutflowUstx: 50_000n,
      minerFeeUstx: MINER_FEE
    });
  });
});

/* ------------------------------------------------------------------ */
/* the relayer                                                         */
/* ------------------------------------------------------------------ */

describe('the sponsored buy', () => {
  it('skips, rather than failing, when the relayer will not quote', async () => {
    const chainless = makeFakeMarket({ minerFeeUstx: MINER_FEE });
    const { world, report } = await runAll(
      { sponsor: makeFakeSponsor({ chain: chainless, available: false }) },
      { scenarios: ['buy-sponsored'] }
    );
    const row = world.row(report, 'buy-sponsored');
    expect(row.status).toBe('skipped');
    expect(row.reason).toMatch(/did not answer \/sponsor\/quote/);
    // Nothing was listed: the quote is asked first so a refusal cannot strand
    // an NFT in escrow for a scenario that never ran.
    expect(world.submitted).toHaveLength(0);
    expect(report.ok).toBe(true);
  });

  it('skips when the relayer refuses the submission, and nothing is stranded unsold', async () => {
    const world = harness();
    const sponsor = makeFakeSponsor({ chain: world.chain, refuse: 'AT_CAPACITY' });
    (world.ports as any).sponsor = sponsor;
    const report = await world.run({ scenarios: ['buy-sponsored'] });
    const row = world.row(report, 'buy-sponsored');
    expect(row.status).toBe('skipped');
    expect(row.reason).toMatch(/AT_CAPACITY/);
    // The listing it made for itself is still open, and the cleanup survey says so.
    expect(report.cleanup.open).toHaveLength(1);
    expect(report.cleanup.open[0].recover).toMatch(/--scenario cancel/);
  });

  it('skips when there is no relayer port at all', async () => {
    const { world, report } = await runAll({ sponsor: null }, { scenarios: ['buy-sponsored'] });
    expect(world.row(report, 'buy-sponsored').status).toBe('skipped');
  });
});

/* ------------------------------------------------------------------ */
/* cleanup                                                             */
/* ------------------------------------------------------------------ */

describe('cleanup awareness', () => {
  it('reports nothing left open when every listing was closed', async () => {
    const { report } = await runAll({}, { scenarios: ['list-usdcx', 'cancel'] });
    expect(report.cleanup.clean).toBe(true);
  });

  it('names an NFT left in escrow with the command that recovers it', async () => {
    const { report } = await runAll({}, { scenarios: ['list-sbtc'] });
    expect(report.cleanup.clean).toBe(false);
    expect(report.cleanup.open).toHaveLength(1);
    expect(report.cleanup.open[0]).toMatchObject({ market: 'sbtc', tokenId: '9002', sellerId: 'archivist' });
    expect(report.cleanup.open[0].recover).toContain('--scenario cancel --market sbtc --listing-id 0');
    expect(report.cleanup.open[0].recover).toContain('--broadcast');
  });

  it('names a sold listing whose budget is still escrowed, with the settle command', async () => {
    const { report } = await runAll({}, { scenarios: ['list-stx', 'buy-stx'] });
    expect(report.cleanup.sold).toHaveLength(1);
    expect(report.cleanup.sold[0].recover).toContain('--scenario settlement');
    expect(report.cleanup.sold[0].recover).toContain(`only ${REFUND_DELAY_BLOCKS} blocks after the sale`);
  });
});

/* ------------------------------------------------------------------ */
/* a dry run reaches nothing                                           */
/* ------------------------------------------------------------------ */

describe('a dry run talks to nothing', () => {
  it('refuses the broadcast endpoint outright', async () => {
    const answer = fakeMarketFetch(makeFakeMarket({}));
    await expect(answer('https://api.hiro.so/v2/transactions', { method: 'POST' })).rejects.toThrow(/tried to BROADCAST/);
  });

  it('refuses any endpoint the fake does not serve', async () => {
    const answer = fakeMarketFetch(makeFakeMarket({}));
    await expect(answer('https://xtrata.xyz/sponsor/submit', { method: 'POST' })).rejects.toThrow(/talks to nothing/);
  });

  it('never asks for a broadcast endpoint across a whole run', async () => {
    const { world } = await runAll();
    expect(world.urls.length).toBeGreaterThan(0);
    for (const url of world.urls) {
      expect(url).not.toMatch(/\/v2\/transactions/);
      expect(url).not.toMatch(/\/sponsor\//);
    }
  });

  it('has a submit port that refuses to broadcast even if asked', async () => {
    const chain = makeFakeMarket({});
    const ports = dryPorts({ chain, sponsor: null, minerFeeUstx: MINER_FEE });
    await expect(
      ports.submit({ call: { contractId: STX_MARKET.contractId, functionName: 'cancel', functionArgs: [] }, broadcast: true, senderAddress: SELLER })
    ).rejects.toThrow(/cannot, and it did not/);
  });

  it('signs a sponsored payload that is unmistakably not a Stacks transaction', async () => {
    const signed = await drySignSponsored({ senderAddress: SELLER, nonce: 3 });
    expect(JSON.parse(Buffer.from(signed.txHex, 'hex').toString('utf8'))).toMatchObject({ fake: true, sender: SELLER });
  });
});

/* ------------------------------------------------------------------ */
/* the cli surface                                                     */
/* ------------------------------------------------------------------ */

describe('scenario selection', () => {
  it('defaults to the whole plan, in plan order', () => {
    expect(selectScenarios({})).toEqual(SCENARIO_IDS);
    expect(selectScenarios({ all: true })).toEqual(SCENARIO_IDS);
  });

  it('keeps plan order however the flags were typed', () => {
    expect(selectScenarios({ scenarios: ['relist', 'list-stx'] })).toEqual(['list-stx', 'relist']);
    expect(selectScenarios({ scenarios: ['list-stx,cancel'] })).toEqual(['list-stx', 'cancel']);
  });

  it('refuses a name that is not a scenario', () => {
    expect(() => selectScenarios({ scenarios: ['buy-everything'] })).toThrow(/unknown scenario buy-everything/);
  });
});

describe('token slots', () => {
  it('fills the listing scenarios in order and lets one be overridden', () => {
    expect(resolveTokens({ list: ['1', '2', '3', '4'] })).toEqual({
      'list-stx': '1',
      'list-sbtc': '2',
      'list-usdcx': '3',
      'buy-sponsored': '4'
    });
    expect(resolveTokens({ list: ['1', '2'], overrides: { 'buy-sponsored': '77' } })).toEqual({
      'list-stx': '1',
      'list-sbtc': '2',
      'buy-sponsored': '77'
    });
    expect(TOKEN_SLOTS).toHaveLength(4);
  });

  it('supplies nothing when nothing was supplied, so a broadcast skips rather than guesses', () => {
    expect(resolveTokens({})).toEqual({});
  });
});

describe('the report table', () => {
  it('renders a pass, a skip and the cleanup section', async () => {
    const { report } = await runAll();
    const table = formatScenarioTable(report);
    expect(table).toContain('list-stx');
    expect(table).toContain('PASS');
    expect(table).toContain('SKIP');
    expect(table).toMatch(/8 passed, 0 failed, 1 skipped/);
    expect(table).toMatch(/committed: [\d,]+ microSTX/);
    expect(table).toContain('cleanup');
    expect(table).toContain('Dry run complete. Nothing was signed and nothing was sent.');
  });

  it('says a run halted, and why', async () => {
    const { report } = await runAll({ killSwitch: () => 'KILL exists' });
    expect(formatScenarioTable(report)).toMatch(/HALTED \(kill-switch\)/);
  });
});
