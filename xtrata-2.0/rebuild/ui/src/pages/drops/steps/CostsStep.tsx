import { useEffect, useMemo, useState } from 'react';
import { microToStx } from '../../../services/fees';
import { useDrops, useDropsState } from '../useDropsStore';
import { MODE_COPY } from '../copy';

/**
 * Step 7 — the number nobody should be able to miss: worst-case sponsor
 * exposure, shown before a single microSTX is funded.
 *
 * Both numbers come from the client's `sponsorExposure()`, which mirrors the
 * contract's own activation gate (`MIN-FEE-BUDGET × effective-limit`) and its
 * per-claim `claim-fee-cap`. The UI does not do this arithmetic itself, so the
 * figure on screen cannot drift from the assertion on chain.
 */

export const stxToMicro = (value: string): bigint => {
  const trimmed = value.trim();
  if (!/^\d+(\.\d{0,6})?$/.test(trimmed)) return 0n;
  const [whole = '0', fraction = ''] = trimmed.split('.');
  return BigInt(whole) * 1_000_000n + BigInt((fraction + '000000').slice(0, 6));
};

export const CostsStep = (): JSX.Element => {
  const store = useDrops();
  const state = useDropsState();
  const exposure = store.exposure;
  const summary = store.planSummary;
  const copy = MODE_COPY[state.config.mode];
  const [budgetText, setBudgetText] = useState('');

  // Default the budget field to the exact activation gate, so the common case
  // is "accept the number the contract will check".
  useEffect(() => {
    if (state.config.mode !== 'sponsored' || budgetText !== '' || exposure.minimumBudget === 0n) return;
    setBudgetText(microToStx(exposure.minimumBudget).replace(' STX', ''));
    store.setBudgetInput(exposure.minimumBudget);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exposure.minimumBudget, state.config.mode]);

  const worstCase = useMemo(() => exposure.worstCaseSettlement ?? null, [exposure]);

  return (
    <div>
      <section className="card">
        <h2>What this drop costs you</h2>
        <dl className="grid-2">
          <div>
            <dt className="muted">Mode</dt>
            <dd>{copy.label}</dd>
          </div>
          <div>
            <dt className="muted">Items in the drop</dt>
            <dd className="mono">{(summary?.itemCount ?? 0).toLocaleString()}</dd>
          </div>
          <div>
            <dt className="muted">Claimable (after the total limit)</dt>
            <dd className="mono" data-testid="claimable-count">
              {exposure.claimable.toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="muted">Your transactions</dt>
            <dd className="mono">
              {summary ? summary.totalTxs + 1 : 1} (create, inventory, escrow, activate)
            </dd>
          </div>
        </dl>
        <p>{copy.costInscription}</p>
        <p>{copy.costCreator}</p>
        <p data-testid="claim-cost-statement">{copy.costClaim}</p>
      </section>

      {state.config.mode === 'sponsored' ? (
        <>
          <section className="card">
            <h2>Sponsor exposure</h2>
            <p className="muted">
              A sponsored drop pays claimers' network fees out of a budget you escrow in the drops
              contract. Your exposure is capped by that budget — the contract can never spend more than
              you funded — but fund it deliberately.
            </p>
            <dl className="grid-2">
              <div>
                <dt className="muted">Minimum budget to activate</dt>
                <dd className="mono" data-testid="minimum-budget">
                  {microToStx(exposure.minimumBudget)}
                </dd>
              </div>
              <div>
                <dt className="muted">Gate the contract checks</dt>
                <dd className="muted">
                  minimum fee budget ({microToStx(state.minFeeBudget)}) × {exposure.claimable} claimable
                </dd>
              </div>
              <div>
                <dt className="muted">Worst case, every claim taken</dt>
                <dd className="mono" data-testid="worst-case">
                  {worstCase === null ? 'needs the contract claim-fee cap' : microToStx(worstCase)}
                </dd>
              </div>
              <div>
                <dt className="muted">Per-claim cap</dt>
                <dd className="mono">
                  {state.claimFeeCap === null ? 'unknown' : microToStx(state.claimFeeCap)}
                </dd>
              </div>
            </dl>
            <div className="banner banner--warn" role="note">
              <div>
                <strong>
                  Worst-case exposure: {worstCase === null ? microToStx(exposure.minimumBudget) : microToStx(worstCase)}
                </strong>
                <p>
                  That is the most the sponsor can draw from this drop if every claimable item is taken at
                  the maximum per-claim fee. Anything unspent is refundable to you — immediately on cancel,
                  or 144 blocks after the drop ends.
                </p>
              </div>
            </div>
          </section>

          <section className="card">
            <h2>Budget to fund</h2>
            <div className="field">
              <label htmlFor="budget">Amount (STX)</label>
              <input
                id="budget"
                className="mono"
                value={budgetText}
                onChange={(event) => {
                  setBudgetText(event.target.value);
                  store.setBudgetInput(stxToMicro(event.target.value));
                }}
              />
              <p className="hint">
                {microToStx(state.budgetInputMicroStx)} — funded with <code>fund-budget</code> on the next
                step. Anyone may top a drop up later; only the creator gets refunds.
              </p>
              {state.budgetInputMicroStx < exposure.minimumBudget ? (
                <p className="error">
                  Below the activation gate of {microToStx(exposure.minimumBudget)} — activate-drop would
                  return u223.
                </p>
              ) : null}
            </div>
          </section>
        </>
      ) : (
        <section className="card">
          <h2>Sponsor exposure</h2>
          <p data-testid="no-exposure">
            None. {copy.label} drops hold no sponsor budget, so this drop cannot draw funds from you after
            it is activated. {copy.costClaim}
          </p>
        </section>
      )}

      <div className="row spread">
        <button type="button" className="btn" onClick={() => store.setStep('timing')}>
          Back
        </button>
        <button type="button" className="btn btn--primary" onClick={() => store.setStep('activate')}>
          Next: create and activate
        </button>
      </div>
    </div>
  );
};
