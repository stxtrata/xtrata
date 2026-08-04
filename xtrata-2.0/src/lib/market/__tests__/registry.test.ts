import { describe, expect, it } from 'vitest';
import {
  getMarketContractId,
  getMarketRegistryEntry,
  getSellableMarkets,
  marketAcceptsNftContract,
  MARKET_REGISTRY
} from '../registry';

const V3_CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
const V2_CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v2-1-0';
const V1_CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v1-1-1';

const EXPECTED_STX_MARKET =
  'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-market-stx-v1-0';
const EXPECTED_USDC_MARKET =
  'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-market-usdc-v1-0';
const EXPECTED_SBTC_MARKET =
  'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-market-sbtc-v1-0';
const EXPECTED_LEGACY_STX_MARKET =
  'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-market-v1-1';

describe('market registry', () => {
  it('loads first-party STX, USDCx, and sBTC market entries', () => {
    expect(MARKET_REGISTRY.length).toBeGreaterThanOrEqual(5);
    expect(getMarketContractId(MARKET_REGISTRY[0]!)).toBe(EXPECTED_STX_MARKET);
    expect(getMarketRegistryEntry(EXPECTED_LEGACY_STX_MARKET)?.label).toContain(
      'Legacy'
    );

    const usdcEntry = getMarketRegistryEntry(EXPECTED_USDC_MARKET);
    expect(usdcEntry?.paymentTokenContractId).toBe(
      'SP120SBRBQJ00MCWS7TM5R8WJNTTKD5K0HFRC2CNE.usdcx'
    );

    const sbtcEntry = getMarketRegistryEntry(EXPECTED_SBTC_MARKET);
    expect(sbtcEntry?.paymentTokenContractId).toBe(
      'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token'
    );
  });
});

/**
 * These pin facts read off mainnet, not preferences. Every pre-sponsored market
 * has `(define-constant ALLOWED-NFT-CONTRACT …)` compiled in and `list-token`
 * asserts against it, so it can never accept an inscription from another core.
 * There is no getter for the constant, so the registry is the only place this
 * can live — and getting it wrong costs a seller a miner fee on a transaction
 * that aborts with ERR-NOT-AUTHORIZED behind an opaque wallet error.
 */
describe('market NFT-contract locks', () => {
  it('records the welded core for every pre-sponsored market', () => {
    const expected: Record<string, string> = {
      'xtrata-market-stx-v1-0': V2_CORE,
      'xtrata-market-sbtc-v1-0': V2_CORE,
      'xtrata-market-usdc-v1-0': V2_CORE,
      'xtrata-market-v1-0': V1_CORE,
      'xtrata-market-v1-1': V1_CORE
    };
    for (const [contractName, core] of Object.entries(expected)) {
      const entry = MARKET_REGISTRY.find((e) => e.contractName === contractName);
      expect(entry, `${contractName} missing from the registry`).toBeTruthy();
      expect(entry?.lockedNftContract, `${contractName} lock`).toBe(core);
    }
  });

  it('leaves sponsored markets unlocked — they have a settable allow-list', () => {
    for (const entry of MARKET_REGISTRY.filter((e) => e.sponsored)) {
      expect(entry.lockedNftContract, `${entry.contractName}`).toBeUndefined();
    }
  });

  it('accepts only an exact core match on a locked market', () => {
    const stx = getMarketRegistryEntry(EXPECTED_STX_MARKET);
    expect(marketAcceptsNftContract(stx, V2_CORE)).toBe(true);
    expect(marketAcceptsNftContract(stx, V3_CORE)).toBe(false);
    expect(marketAcceptsNftContract(stx, null)).toBe(false);
    // Principals are case-insensitive in practice; a case difference must not
    // silently strand a seller.
    expect(marketAcceptsNftContract(stx, V2_CORE.toLowerCase())).toBe(true);
  });

  it('an unlocked market accepts anything', () => {
    expect(marketAcceptsNftContract({ lockedNftContract: undefined }, V3_CORE)).toBe(true);
  });

  it('a v3 seller is offered the sponsored markets and nothing else', () => {
    const sellable = getSellableMarkets(V3_CORE, 'mainnet');
    expect(sellable.length).toBe(3);
    expect(sellable.every((e) => e.sponsored)).toBe(true);
  });

  it('sponsored markets come first, so sBTC and USDCx lead with the useful one', () => {
    const sellable = getSellableMarkets(V2_CORE, 'mainnet');
    // v2 can use both its welded markets and the sponsored ones.
    expect(sellable.length).toBeGreaterThan(3);
    const firstStandard = sellable.findIndex((e) => !e.sponsored);
    const lastSponsored = sellable.map((e) => !!e.sponsored).lastIndexOf(true);
    expect(lastSponsored).toBeLessThan(firstStandard);
  });

  it('never offers a locked market to the core it cannot take', () => {
    for (const core of [V3_CORE, V2_CORE, V1_CORE]) {
      for (const entry of getSellableMarkets(core, 'mainnet')) {
        expect(
          !entry.lockedNftContract || entry.lockedNftContract === core,
          `${entry.contractName} offered for ${core}`
        ).toBe(true);
      }
    }
  });
});
