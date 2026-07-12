/**
 * List-flow field for the seller's sponsorship deposit: shows the relayer's
 * quoted budget, explains the refund guarantee, validates the amount.
 */
import { useEffect, useState } from 'react';
import type { SponsorClient, SponsorQuote } from '../../lib/market/sponsor-client';
import {
  MIN_FEE_BUDGET_USTX,
  MAX_USEFUL_BUDGET_USTX,
  validateFeeBudget
} from '../../lib/market/sponsored';

const formatStx = (ustx: bigint) => {
  const whole = ustx / 1_000_000n;
  const frac = (ustx % 1_000_000n).toString().padStart(6, '0').replace(/0+$/, '');
  return frac ? `${whole}.${frac}` : whole.toString();
};

export type SponsorshipDepositFieldProps = {
  client: SponsorClient;
  /** committed µSTX budget (null until valid) */
  onBudgetChange: (budgetUstx: bigint | null) => void;
};

const SponsorshipDepositField = ({ client, onBudgetChange }: SponsorshipDepositFieldProps) => {
  const [quote, setQuote] = useState<SponsorQuote | null>(null);
  const [quoteFailed, setQuoteFailed] = useState(false);
  const [raw, setRaw] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    client
      .quote()
      .then((q) => {
        if (cancelled) return;
        setQuote(q);
        setRaw(formatStx(q.budgetUstx));
        onBudgetChange(q.budgetUstx);
      })
      .catch(() => {
        if (cancelled) return;
        setQuoteFailed(true);
        onBudgetChange(null);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  const parse = (value: string): bigint | null => {
    if (!/^\d+(\.\d{1,6})?$/.test(value.trim())) return null;
    const [w, f = ''] = value.trim().split('.');
    return BigInt(w) * 1_000_000n + BigInt(f.padEnd(6, '0') || '0');
  };

  const parsed = parse(raw);
  const validation = validateFeeBudget(parsed);

  const handleChange = (value: string) => {
    setRaw(value);
    const next = parse(value);
    const check = validateFeeBudget(next);
    onBudgetChange(check.ok ? check.budgetUstx : null);
  };

  return (
    <div className="sponsorship-deposit">
      <label>
        <span className="lbl">Sponsorship deposit (STX)</span>
        <input
          type="text"
          inputMode="decimal"
          aria-label="Sponsorship deposit in STX"
          value={raw}
          onChange={(event) => handleChange(event.target.value)}
        />
      </label>
      <p className="muted">
        Covers the buyer's network fee so they need no STX. The unused portion
        is refunded to you when the item sells or you cancel.
      </p>
      {quoteFailed ? (
        <p className="muted" role="alert">
          Could not fetch a live quote — enter between {formatStx(MIN_FEE_BUDGET_USTX)} and{' '}
          {formatStx(MAX_USEFUL_BUDGET_USTX)} STX.
        </p>
      ) : null}
      {quote ? (
        <p className="muted">Suggested: {formatStx(quote.budgetUstx)} STX</p>
      ) : null}
      {!validation.ok && raw !== '' ? (
        <p role="alert">
          {validation.reason === 'below-minimum'
            ? `Minimum deposit is ${formatStx(MIN_FEE_BUDGET_USTX)} STX.`
            : validation.reason === 'above-useful-maximum'
              ? `Deposits above ${formatStx(MAX_USEFUL_BUDGET_USTX)} STX cannot be claimed and would be wasted.`
              : 'Enter a valid STX amount.'}
        </p>
      ) : null}
    </div>
  );
};

export default SponsorshipDepositField;
