// @vitest-environment happy-dom
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import SponsoredBuySection from '../SponsoredBuySection';
import type { SponsorClient, SponsorJob } from '../../../lib/market/sponsor-client';
import { SponsorClientError } from '../../../lib/market/sponsor-client';

afterEach(cleanup);

const job = (state: SponsorJob['state'], txids: SponsorJob['txids'] = {}): SponsorJob => ({
  id: 'sp-1',
  state,
  txids
});

const makeClient = (overrides: Partial<SponsorClient> = {}): SponsorClient =>
  ({
    quote: vi.fn(),
    submit: vi.fn().mockResolvedValue(job('SPONSORED', { buy: 'tx-buy' })),
    status: vi.fn().mockResolvedValue(job('SETTLED', { buy: 'tx-buy', refund: 'tx-refund' })),
    available: vi.fn().mockResolvedValue(true),
    ...overrides
  }) as unknown as SponsorClient;

const baseProps = {
  market: { sponsored: true },
  listing: { soldAt: null as bigint | null, budgetRemaining: 100_000n },
  estimatedFeeUstx: 20_000n,
  relayerAvailable: true,
  assetSymbol: 'sBTC',
  contractId: 'SP0.market',
  listingId: 7n,
  signSponsoredBuy: vi.fn().mockResolvedValue({ txHex: '00ff' }),
  onSelfPaidBuy: vi.fn(),
  pollIntervalMs: 5
};

describe('SponsoredBuySection', () => {
  it('renders the no-STX primary action with a self-paid alternative', () => {
    render(<SponsoredBuySection {...baseProps} client={makeClient()} />);
    expect(
      screen.getByRole('button', { name: /buy with sBTC — no STX needed/i })
    ).toBeTruthy();
    expect(
      screen.getByRole('button', { name: /pay my own network fee/i })
    ).toBeTruthy();
  });

  it('plain buy button on non-sponsored markets', () => {
    render(
      <SponsoredBuySection
        {...baseProps}
        market={{ sponsored: false }}
        client={makeClient()}
      />
    );
    const button = screen.getByRole('button', { name: /^buy with sBTC$/i });
    button.click();
    expect(baseProps.onSelfPaidBuy).toHaveBeenCalled();
    expect(screen.queryByText(/no STX needed/i)).toBeNull();
  });

  it('walks sign → submit → poll → settled and confirms zero STX paid', async () => {
    render(<SponsoredBuySection {...baseProps} client={makeClient()} />);
    screen.getByRole('button', { name: /no STX needed/i }).click();
    await waitFor(() => {
      expect(screen.getByText(/purchase complete — you paid no STX/i)).toBeTruthy();
    });
    expect(screen.getByText(/tx tx-buy/i)).toBeTruthy();
  });

  it('user rejecting the wallet returns quietly to idle', async () => {
    const props = {
      ...baseProps,
      signSponsoredBuy: vi.fn().mockResolvedValue(null)
    };
    render(<SponsoredBuySection {...props} client={makeClient()} />);
    screen.getByRole('button', { name: /no STX needed/i }).click();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /no STX needed/i })).toBeTruthy();
    });
  });

  it('relayer refusal offers the self-paid fallback', async () => {
    const client = makeClient({
      submit: vi
        .fn()
        .mockRejectedValue(new SponsorClientError('LOW_BALANCE', 'reserve low'))
    });
    render(<SponsoredBuySection {...baseProps} client={client} />);
    screen.getByRole('button', { name: /no STX needed/i }).click();
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeTruthy();
    });
    expect(screen.getByText(/reserve low/i)).toBeTruthy();
    const fallback = screen.getByRole('button', { name: /pay your own network fee/i });
    fallback.click();
    expect(baseProps.onSelfPaidBuy).toHaveBeenCalled();
  });

  it('abandoned sponsorship surfaces as failure with fallback', async () => {
    const client = makeClient({
      status: vi.fn().mockResolvedValue({ ...job('ABANDONED'), error: 'buy tx timed out' })
    });
    render(<SponsoredBuySection {...baseProps} client={client} />);
    screen.getByRole('button', { name: /no STX needed/i }).click();
    await waitFor(() => {
      expect(screen.getByText(/buy tx timed out/i)).toBeTruthy();
    });
    expect(screen.getByRole('button', { name: /pay your own network fee/i })).toBeTruthy();
  });

  it('sold listings show no buy affordance; exhausted budget falls back to self-paid', () => {
    const { unmount } = render(
      <SponsoredBuySection
        {...baseProps}
        listing={{ soldAt: 10n, budgetRemaining: 100_000n }}
        client={makeClient()}
      />
    );
    expect(screen.getByText(/already been sold/i)).toBeTruthy();
    expect(screen.queryByRole('button', { name: /buy/i })).toBeNull();
    unmount();

    render(
      <SponsoredBuySection
        {...baseProps}
        listing={{ soldAt: null, budgetRemaining: 1n }}
        client={makeClient()}
      />
    );
    expect(screen.getByText(/budget for this listing is used up/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /^buy with sBTC$/i })).toBeTruthy();
  });

  it('shows progress labels while the relayer works', async () => {
    let resolveStatus: (j: SponsorJob) => void = () => {};
    const client = makeClient({
      status: vi.fn().mockImplementation(
        () => new Promise<SponsorJob>((resolve) => { resolveStatus = resolve; })
      )
    });
    render(<SponsoredBuySection {...baseProps} client={client} />);
    screen.getByRole('button', { name: /no STX needed/i }).click();
    await waitFor(() => {
      expect(screen.getByRole('status')).toBeTruthy();
    });
    expect(screen.getByText(/broadcast — confirming/i)).toBeTruthy();
    resolveStatus(job('SETTLED', { buy: 'tx-buy' }));
    await waitFor(() => {
      expect(screen.getByText(/purchase complete/i)).toBeTruthy();
    });
  });
});
