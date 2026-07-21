/**
 * Payment-asset abstraction for Xtrata flows.
 *
 * Goal: let mint/market/workflow code describe "what the user pays with"
 * independently of STX. Supported shapes:
 *
 * - `stx` — native STX (micro-STX amounts).
 * - `sip10` — any SIP-010 fungible token (sBTC, USDCx/aeUSDC, USDC, USDT…)
 *   described by its contract id + asset name + decimals.
 * - Fiat (USD/GBP) is a *display/quote* concern only: helpers convert a
 *   crypto amount to a fiat estimate given a caller-supplied rate. No fiat
 *   settlement happens on-chain.
 *
 * Only STX and sBTC descriptors ship as verified built-ins. USDC-family
 * tokens vary by bridge/issuer; pass an explicit descriptor for those
 * (see `sip10Asset`) after verifying the contract id on the target network.
 */

import {
  FungibleConditionCode,
  createAssetInfo,
  makeStandardFungiblePostCondition,
  makeStandardSTXPostCondition,
  validateStacksAddress
} from '@stacks/transactions';
import type { NetworkType } from './types.js';
import { SdkValidationError } from './errors.js';

export type StxAsset = {
  kind: 'stx';
  symbol: 'STX';
  decimals: 6;
};

export type Sip10Asset = {
  kind: 'sip10';
  symbol: string;
  /** `ADDRESS.contract-name` of the SIP-010 token contract. */
  contractId: string;
  /** Clarity asset name used in post conditions (e.g. `sbtc-token`). */
  assetName: string;
  decimals: number;
  network: NetworkType;
};

export type PaymentAsset = StxAsset | Sip10Asset;

export type QuoteCurrency = 'USD' | 'GBP';

export type FiatQuote = {
  currency: QuoteCurrency;
  /** Fiat value as a decimal string, rounded to 2 places. */
  amount: string;
  /** Rate used: fiat units per whole token (e.g. USD per STX). */
  rate: number;
  /** Symbol of the asset the quote is for (e.g. `STX`, `sBTC`). */
  asset: string;
};

export const STX_ASSET: StxAsset = Object.freeze({
  kind: 'stx',
  symbol: 'STX',
  decimals: 6
});

/**
 * Canonical mainnet sBTC token (deployed by the sBTC working group).
 * 8 decimals; 1 sBTC = 1 BTC.
 */
export const SBTC_MAINNET: Sip10Asset = Object.freeze({
  kind: 'sip10',
  symbol: 'sBTC',
  contractId: 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token',
  assetName: 'sbtc-token',
  decimals: 8,
  network: 'mainnet'
});

const CONTRACT_ID_PATTERN = /^[A-Z0-9]+\.[a-zA-Z][a-zA-Z0-9-_]{0,127}$/;

/** Build (and validate) a SIP-010 asset descriptor. */
export const sip10Asset = (input: Omit<Sip10Asset, 'kind'>): Sip10Asset => {
  if (!CONTRACT_ID_PATTERN.test(input.contractId)) {
    throw new SdkValidationError(
      'PAYMENT_BAD_CONTRACT_ID',
      `Invalid SIP-010 contract id: ${input.contractId}`
    );
  }
  const [address] = input.contractId.split('.');
  if (!validateStacksAddress(address)) {
    throw new SdkValidationError(
      'PAYMENT_BAD_ADDRESS',
      `Invalid Stacks address in contract id: ${address}`
    );
  }
  if (!input.assetName) {
    throw new SdkValidationError('PAYMENT_BAD_ASSET_NAME', 'assetName is required');
  }
  if (!Number.isInteger(input.decimals) || input.decimals < 0 || input.decimals > 18) {
    throw new SdkValidationError(
      'PAYMENT_BAD_DECIMALS',
      `decimals must be an integer 0..18, got ${input.decimals}`
    );
  }
  return { kind: 'sip10', ...input };
};

/**
 * Deny-mode post condition capping what the payer can spend in `asset`.
 * Mirrors the STX spend-cap discipline used across mint/market flows.
 */
export const buildPaymentPostCondition = (
  payerAddress: string,
  asset: PaymentAsset,
  maxAmountBaseUnits: bigint
) => {
  if (!validateStacksAddress(payerAddress)) {
    throw new SdkValidationError('PAYMENT_BAD_PAYER', `Invalid payer address: ${payerAddress}`);
  }
  if (maxAmountBaseUnits < 0n) {
    throw new SdkValidationError('PAYMENT_BAD_AMOUNT', 'maxAmountBaseUnits must be >= 0');
  }
  if (asset.kind === 'stx') {
    return makeStandardSTXPostCondition(
      payerAddress,
      FungibleConditionCode.LessEqual,
      maxAmountBaseUnits
    );
  }
  const [address, contractName] = asset.contractId.split('.');
  return makeStandardFungiblePostCondition(
    payerAddress,
    FungibleConditionCode.LessEqual,
    maxAmountBaseUnits,
    createAssetInfo(address, contractName, asset.assetName)
  );
};

/** Convert base units (micro-STX, sats…) to a whole-token decimal string. */
export const formatBaseUnits = (amount: bigint, decimals: number): string => {
  if (decimals === 0) return amount.toString();
  const negative = amount < 0n;
  const abs = negative ? -amount : amount;
  const base = 10n ** BigInt(decimals);
  const whole = abs / base;
  const frac = (abs % base).toString().padStart(decimals, '0').replace(/0+$/, '');
  return `${negative ? '-' : ''}${whole}${frac ? `.${frac}` : ''}`;
};

/**
 * Fiat display estimate for a crypto amount. `rate` is fiat per whole token
 * (caller sources it from a price oracle/API of their choosing).
 */
export const quoteFiat = (
  asset: PaymentAsset,
  amountBaseUnits: bigint,
  currency: QuoteCurrency,
  rate: number
): FiatQuote => {
  if (!Number.isFinite(rate) || rate < 0) {
    throw new SdkValidationError('PAYMENT_BAD_RATE', `rate must be a non-negative number, got ${rate}`);
  }
  const whole = Number(formatBaseUnits(amountBaseUnits, asset.decimals));
  const fiat = whole * rate;
  return {
    currency,
    amount: fiat.toFixed(2),
    rate,
    asset: asset.symbol
  };
};
