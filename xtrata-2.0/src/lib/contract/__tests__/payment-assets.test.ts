import { describe, expect, it } from 'vitest';
import { FungibleConditionCode } from '@stacks/transactions';
import {
  buildPaymentPostCondition,
  getAvailablePaymentAssets,
  STX_PAYMENT_ASSET
} from '../payment-assets';

const SENDER = 'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B';

describe('getAvailablePaymentAssets', () => {
  it('offers STX only when the contract lacks multi-asset payment', () => {
    const assets = getAvailablePaymentAssets({
      supportsMultiAssetPayment: false
    });
    expect(assets).toEqual([STX_PAYMENT_ASSET]);
  });

  it('offers STX plus the known SIP-010 assets when capable', () => {
    const assets = getAvailablePaymentAssets({
      supportsMultiAssetPayment: true
    });
    const symbols = assets.map((a) => a.symbol);
    expect(symbols[0]).toBe('STX');
    expect(symbols).toContain('USDCx');
    expect(symbols).toContain('sBTC');
  });

  it('carries the correct decimals for each asset (6dp stables, 8dp sBTC)', () => {
    const assets = getAvailablePaymentAssets({
      supportsMultiAssetPayment: true
    });
    const bySymbol = new Map(assets.map((a) => [a.symbol, a]));
    expect(bySymbol.get('STX')?.decimals).toBe(6);
    expect(bySymbol.get('USDCx')?.decimals).toBe(6);
    expect(bySymbol.get('sBTC')?.decimals).toBe(8);
  });
});

describe('buildPaymentPostCondition', () => {
  const assets = getAvailablePaymentAssets({ supportsMultiAssetPayment: true });
  const bySymbol = new Map(assets.map((a) => [a.symbol, a]));

  it('returns null for STX (handled by the existing flow)', () => {
    expect(
      buildPaymentPostCondition({
        asset: STX_PAYMENT_ASSET,
        senderAddress: SENDER,
        amount: 1_000_000n
      })
    ).toBeNull();
  });

  it('builds an exact-amount post condition for USDCx (6dp)', () => {
    const usdcx = bySymbol.get('USDCx');
    if (!usdcx) throw new Error('USDCx missing');
    const pc = buildPaymentPostCondition({
      asset: usdcx,
      senderAddress: SENDER,
      amount: 2_500_000n // 2.50 USDCx
    });
    expect(pc?.conditionCode).toBe(FungibleConditionCode.Equal);
    expect(pc?.amount).toBe(2_500_000n);
    expect(pc?.assetInfo.contractName.content).toBe('usdcx');
  });

  it('builds an exact-amount post condition for sBTC (8dp)', () => {
    const sbtc = bySymbol.get('sBTC');
    if (!sbtc) throw new Error('sBTC missing');
    const pc = buildPaymentPostCondition({
      asset: sbtc,
      senderAddress: SENDER,
      amount: 100_000n // 0.001 sBTC
    });
    expect(pc?.conditionCode).toBe(FungibleConditionCode.Equal);
    expect(pc?.amount).toBe(100_000n);
    expect(pc?.assetInfo.contractName.content).toBe('sbtc-token');
  });
});
