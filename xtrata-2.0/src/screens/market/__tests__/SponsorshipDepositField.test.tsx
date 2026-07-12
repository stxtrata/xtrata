// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import SponsorshipDepositField from '../SponsorshipDepositField';
import type { SponsorClient } from '../../../lib/market/sponsor-client';
import { SponsorClientError } from '../../../lib/market/sponsor-client';

afterEach(cleanup);

const quote = {
  estimatedFeeUstx: 20_000n,
  budgetUstx: 60_000n,
  minBudgetUstx: 50_000n,
  expiresAt: Date.now() + 60_000
};

const makeClient = (overrides: Partial<SponsorClient> = {}): SponsorClient =>
  ({
    quote: vi.fn().mockResolvedValue(quote),
    submit: vi.fn(),
    status: vi.fn(),
    available: vi.fn(),
    ...overrides
  }) as unknown as SponsorClient;

describe('SponsorshipDepositField', () => {
  it('prefills with the relayer quote and commits it upward', async () => {
    const onBudgetChange = vi.fn();
    render(<SponsorshipDepositField client={makeClient()} onBudgetChange={onBudgetChange} />);
    await waitFor(() => {
      expect(onBudgetChange).toHaveBeenCalledWith(60_000n);
    });
    const input = screen.getByLabelText(/sponsorship deposit in stx/i) as HTMLInputElement;
    expect(input.value).toBe('0.06');
    expect(screen.getByText(/suggested: 0\.06 STX/i)).toBeTruthy();
    expect(screen.getByText(/unused portion is refunded/i)).toBeTruthy();
  });

  it('quote failure shows manual guidance and commits null', async () => {
    const onBudgetChange = vi.fn();
    const client = makeClient({
      quote: vi.fn().mockRejectedValue(new SponsorClientError('RELAYER_UNAVAILABLE', 'down'))
    });
    render(<SponsorshipDepositField client={client} onBudgetChange={onBudgetChange} />);
    await waitFor(() => {
      expect(onBudgetChange).toHaveBeenCalledWith(null);
    });
    expect(screen.getByRole('alert').textContent).toMatch(/could not fetch a live quote/i);
  });

  it('validates edits: below minimum, above useful max, garbage', async () => {
    const onBudgetChange = vi.fn();
    render(<SponsorshipDepositField client={makeClient()} onBudgetChange={onBudgetChange} />);
    const input = await screen.findByLabelText(/sponsorship deposit in stx/i);

    fireEvent.change(input, { target: { value: '0.01' } });
    expect(screen.getByText(/minimum deposit is 0\.05 STX/i)).toBeTruthy();
    expect(onBudgetChange).toHaveBeenLastCalledWith(null);

    fireEvent.change(input, { target: { value: '5' } });
    expect(screen.getByText(/deposits above 2 STX cannot be claimed/i)).toBeTruthy();
    expect(onBudgetChange).toHaveBeenLastCalledWith(null);

    fireEvent.change(input, { target: { value: 'abc' } });
    expect(screen.getByText(/enter a valid STX amount/i)).toBeTruthy();

    fireEvent.change(input, { target: { value: '0.1' } });
    expect(onBudgetChange).toHaveBeenLastCalledWith(100_000n);
  });
});
