import { describe, expect, it } from 'vitest';
import {
  SBTC_MAINNET,
  STX_ASSET,
  buildPaymentPostCondition,
  formatBaseUnits,
  quoteFiat,
  sip10Asset
} from '../payments.js';
import { SdkValidationError } from '../errors.js';

const PAYER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';

describe('sip10Asset', () => {
  it('builds a descriptor for a valid token', () => {
    const usdc = sip10Asset({
      symbol: 'aeUSDC',
      contractId: `${PAYER}.token-aeusdc`,
      assetName: 'aeUSDC',
      decimals: 6,
      network: 'mainnet'
    });
    expect(usdc.kind).toBe('sip10');
    expect(usdc.decimals).toBe(6);
  });

  it('rejects malformed contract ids, addresses and decimals', () => {
    const base = {
      symbol: 'X',
      assetName: 'x-token',
      decimals: 6,
      network: 'mainnet' as const
    };
    expect(() => sip10Asset({ ...base, contractId: 'nodot' })).toThrow(SdkValidationError);
    expect(() => sip10Asset({ ...base, contractId: 'INVALIDADDR.token' })).toThrow(
      SdkValidationError
    );
    expect(() =>
      sip10Asset({ ...base, contractId: `${PAYER}.token`, decimals: 2.5 })
    ).toThrow(SdkValidationError);
  });
});

describe('buildPaymentPostCondition', () => {
  it('builds an STX LessEqual cap', () => {
    const pc = buildPaymentPostCondition(PAYER, STX_ASSET, 123456n);
    expect(pc).toBeTruthy();
  });

  it('builds a fungible cap for sBTC', () => {
    const pc = buildPaymentPostCondition(PAYER, SBTC_MAINNET, 100000000n);
    expect(pc).toBeTruthy();
  });

  it('rejects bad payer or negative amounts', () => {
    expect(() => buildPaymentPostCondition('bogus', STX_ASSET, 1n)).toThrow(SdkValidationError);
    expect(() => buildPaymentPostCondition(PAYER, STX_ASSET, -1n)).toThrow(SdkValidationError);
  });
});

describe('formatBaseUnits / quoteFiat', () => {
  it('formats micro-STX and sats to decimal strings', () => {
    expect(formatBaseUnits(1500000n, 6)).toBe('1.5');
    expect(formatBaseUnits(100000000n, 8)).toBe('1');
    expect(formatBaseUnits(0n, 6)).toBe('0');
    expect(formatBaseUnits(-2500000n, 6)).toBe('-2.5');
    expect(formatBaseUnits(7n, 0)).toBe('7');
  });

  it('quotes fiat at a caller-supplied rate', () => {
    const quote = quoteFiat(STX_ASSET, 2000000n, 'GBP', 1.4);
    expect(quote).toEqual({ currency: 'GBP', amount: '2.80', rate: 1.4, asset: 'STX' });
    const sats = quoteFiat(SBTC_MAINNET, 50000000n, 'USD', 100000);
    expect(sats.amount).toBe('50000.00');
  });

  it('rejects invalid rates', () => {
    expect(() => quoteFiat(STX_ASSET, 1n, 'USD', -1)).toThrow(SdkValidationError);
    expect(() => quoteFiat(STX_ASSET, 1n, 'USD', Number.NaN)).toThrow(SdkValidationError);
  });
});
