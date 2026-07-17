/**
 * Buy controls for a sponsored listing: "no STX needed" primary action with
 * live progress, and a self-paid fallback when sponsorship is unavailable.
 * Small on purpose — designed to slot into MarketScreen's listing card.
 */
import { useSponsoredBuy, type SignSponsoredBuy } from './useSponsoredBuy';
import type { SponsorClient } from '../../lib/market/sponsor-client';
import {
  getSponsoredBuyEligibility,
  type SponsoredBuyEligibility
} from '../../lib/market/sponsored';
import type { MarketRegistryEntry } from '../../lib/market/registry';

const PROGRESS_LABELS: Record<string, string> = {
  signing: 'Waiting for wallet…',
  submitting: 'Sending to sponsor…',
  RECEIVED: 'Sponsoring…',
  SPONSORED: 'Broadcast — confirming…',
  CONFIRMED: 'Confirmed — settling…',
  CLAIMED: 'Settling…'
};

export type SponsoredBuySectionProps = {
  market: Pick<MarketRegistryEntry, 'sponsored'> | null;
  listing: { soldAt: bigint | null; budgetRemaining: bigint } | null;
  estimatedFeeUstx: bigint;
  relayerAvailable: boolean;
  assetSymbol: string;
  client: SponsorClient;
  contractId: string;
  listingId: bigint;
  signSponsoredBuy: SignSponsoredBuy;
  /** invoked when the user opts for the normal self-paid purchase */
  onSelfPaidBuy: () => void;
  pollIntervalMs?: number;
};

const ineligibilityMessage = (
  eligibility: Exclude<SponsoredBuyEligibility, { ok: true }>
) => {
  switch (eligibility.reason) {
    case 'listing-sold':
      return 'This listing has already been sold.';
    case 'budget-exhausted':
      return 'The sponsorship budget for this listing is used up.';
    case 'relayer-unavailable':
      return 'Sponsored checkout is temporarily unavailable.';
    default:
      return null;
  }
};

const SponsoredBuySection = (props: SponsoredBuySectionProps) => {
  const { state, start, reset, busy } = useSponsoredBuy({
    client: props.client,
    contractId: props.contractId,
    listingId: props.listingId,
    signSponsoredBuy: props.signSponsoredBuy,
    pollIntervalMs: props.pollIntervalMs
  });

  const eligibility = getSponsoredBuyEligibility({
    market: props.market,
    listing: props.listing,
    estimatedFeeUstx: props.estimatedFeeUstx,
    relayerAvailable: props.relayerAvailable
  });

  if (!eligibility.ok && eligibility.reason === 'not-sponsored-market') {
    return (
      <button type="button" className="btn btn--primary" onClick={props.onSelfPaidBuy}>
        Buy with {props.assetSymbol}
      </button>
    );
  }

  if (state.phase === 'settled') {
    return (
      <div className="sponsored-buy sponsored-buy--settled" role="status">
        <p>
          Purchase complete — you paid no STX.
          {state.buyTxId ? <span className="mint-hash"> tx {state.buyTxId}</span> : null}
        </p>
      </div>
    );
  }

  if (state.phase === 'failed') {
    return (
      <div className="sponsored-buy sponsored-buy--failed" role="alert">
        <p>Sponsored checkout failed: {state.message}</p>
        {state.fallbackToSelfPaid ? (
          <button type="button" className="btn btn--primary" onClick={props.onSelfPaidBuy}>
            Buy with {props.assetSymbol} (pay your own network fee)
          </button>
        ) : null}
        <button type="button" className="btn btn--ghost" onClick={reset}>
          Dismiss
        </button>
      </div>
    );
  }

  if (busy) {
    const label =
      state.phase === 'sponsoring'
        ? PROGRESS_LABELS[state.jobState] ?? 'Sponsoring…'
        : PROGRESS_LABELS[state.phase] ?? 'Working…';
    return (
      <div className="sponsored-buy sponsored-buy--busy" role="status">
        <p>{label}</p>
      </div>
    );
  }

  if (!eligibility.ok) {
    const message = ineligibilityMessage(eligibility);
    return (
      <div className="sponsored-buy">
        {message ? <p className="muted">{message}</p> : null}
        {eligibility.reason !== 'listing-sold' ? (
          <button type="button" className="btn btn--primary" onClick={props.onSelfPaidBuy}>
            Buy with {props.assetSymbol}
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="sponsored-buy">
      <button type="button" className="btn btn--primary" onClick={() => void start()}>
        Buy with {props.assetSymbol} — no STX needed
      </button>
      <button type="button" className="btn btn--ghost" onClick={props.onSelfPaidBuy}>
        Pay my own network fee instead
      </button>
    </div>
  );
};

export default SponsoredBuySection;
