import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { FiatCurrency, PriceAssetKey, UsdPriceBook } from './types';
import { USD_PRICE_MAX_AGE_MS, USD_PRICE_STALE_MS } from './types';
import { getUsdPriceQuote } from './format';

/**
 * Fiat display helpers (WS-3.3).
 *
 * Fiat is presentation-only — nothing here settles in fiat. USD amounts are
 * derived from the on-chain asset price book; GBP is derived from USD via a
 * USD→GBP FX rate that follows the same staleness rules as the price book.
 */

export const FIAT_SYMBOLS: Record<FiatCurrency, string> = {
  USD: '$',
  GBP: '£'
};

export type FxRateQuote = {
  /** GBP per 1 USD (i.e. multiply a USD amount by this to get GBP). */
  gbpPerUsd: number;
  updatedAt: number;
  sourceId: string;
  isFallback: boolean;
};

const addThousandsSeparators = (value: string) =>
  value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const formatFromCents = (cents: bigint, symbol: string) => {
  const negative = cents < 0n;
  const normalized = negative ? -cents : cents;
  const whole = normalized / 100n;
  const fraction = (normalized % 100n).toString().padStart(2, '0');
  return `${negative ? '-' : ''}${symbol}${addThousandsSeparators(
    whole.toString()
  )}.${fraction}`;
};

/**
 * Format a USD numeric amount into the requested display currency. Returns null
 * when GBP is requested but no fresh FX rate is available (never silently shows
 * a USD figure under a £ sign).
 */
export const formatFiat = (
  usdAmount: number | null | undefined,
  currency: FiatCurrency,
  fxRate?: FxRateQuote | null
): string | null => {
  if (usdAmount === null || usdAmount === undefined || !Number.isFinite(usdAmount)) {
    return null;
  }
  let amount = usdAmount;
  if (currency === 'GBP') {
    if (!fxRate || !Number.isFinite(fxRate.gbpPerUsd) || fxRate.gbpPerUsd <= 0) {
      return null;
    }
    amount = usdAmount * fxRate.gbpPerUsd;
  }
  const cents = BigInt(Math.round(amount * 100));
  return formatFromCents(cents, FIAT_SYMBOLS[currency]);
};

/**
 * Numeric USD value (float) for a base-unit token amount, or null when there is
 * no fresh price. Mirrors the rounding used by the USD string formatter.
 */
export const computeUsdFromBaseUnits = (params: {
  amount: bigint | null | undefined;
  decimals: number;
  assetKey: PriceAssetKey | null | undefined;
  priceBook: UsdPriceBook | null | undefined;
  now?: number;
}): number | null => {
  if (params.amount === null || params.amount === undefined) {
    return null;
  }
  if (params.amount === 0n) {
    return 0;
  }
  const quote = getUsdPriceQuote(
    params.priceBook,
    params.assetKey,
    params.now ?? Date.now()
  );
  if (!quote) {
    return null;
  }
  const negative = params.amount < 0n;
  const normalized = negative ? -params.amount : params.amount;
  const usd = (Number(normalized) / 10 ** params.decimals) * quote.usd;
  return negative ? -usd : usd;
};

// ---- USD→GBP FX rate ----

const isAbortError = (error: unknown) =>
  error instanceof Error && error.name === 'AbortError';

/** Coinbase GBP-USD spot returns USD per 1 GBP; invert to get GBP per USD. */
export const parseGbpPerUsdFromCoinbase = (
  payload: unknown,
  now = Date.now()
): FxRateQuote | null => {
  const data =
    payload && typeof payload === 'object'
      ? (payload as { data?: unknown }).data
      : null;
  if (!data || typeof data !== 'object') {
    return null;
  }
  const amountRaw = (data as Record<string, unknown>).amount;
  const usdPerGbp =
    typeof amountRaw === 'string' ? Number.parseFloat(amountRaw) : NaN;
  if (!Number.isFinite(usdPerGbp) || usdPerGbp <= 0) {
    return null;
  }
  return {
    gbpPerUsd: 1 / usdPerGbp,
    updatedAt: now,
    sourceId: 'GBP-USD',
    isFallback: false
  };
};

export const fetchGbpPerUsd = async (
  signal?: AbortSignal
): Promise<FxRateQuote> => {
  const response = await fetch(
    'https://api.coinbase.com/v2/prices/GBP-USD/spot',
    { headers: { Accept: 'application/json' }, signal }
  );
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`GBP FX request failed (${response.status}).`);
  }
  const quote = parseGbpPerUsdFromCoinbase(JSON.parse(text));
  if (!quote) {
    throw new Error('GBP FX response was not usable.');
  }
  return quote;
};

export const FX_GBP_QUERY_KEY = ['pricing', 'fx-gbp'] as const;

export const isFxRateFresh = (
  quote: FxRateQuote | null | undefined,
  now = Date.now()
) => !!quote && quote.updatedAt > 0 && now - quote.updatedAt <= USD_PRICE_MAX_AGE_MS;

export const useGbpPerUsd = (options?: { enabled?: boolean }) => {
  const enabled = options?.enabled ?? true;
  return useQuery({
    queryKey: [...FX_GBP_QUERY_KEY],
    enabled,
    queryFn: ({ signal }) => fetchGbpPerUsd(signal),
    staleTime: USD_PRICE_STALE_MS,
    retry: 1,
    refetchOnWindowFocus: false,
    meta: { persist: true },
    // Don't surface abort errors as failures.
    throwOnError: (error: unknown) => !isAbortError(error)
  });
};

// ---- Display currency preference (persisted) ----

export const DISPLAY_CURRENCY_STORAGE_KEY = 'xtrata.displayCurrency';

const readStoredCurrency = (): FiatCurrency => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return 'USD';
  }
  const stored = window.localStorage.getItem(DISPLAY_CURRENCY_STORAGE_KEY);
  return stored === 'GBP' ? 'GBP' : 'USD';
};

export const useDisplayCurrency = (): [
  FiatCurrency,
  (currency: FiatCurrency) => void
] => {
  const [currency, setCurrencyState] = useState<FiatCurrency>(readStoredCurrency);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    window.localStorage.setItem(DISPLAY_CURRENCY_STORAGE_KEY, currency);
  }, [currency]);

  const setCurrency = useCallback((next: FiatCurrency) => {
    setCurrencyState(next === 'GBP' ? 'GBP' : 'USD');
  }, []);

  return [currency, setCurrency];
};
