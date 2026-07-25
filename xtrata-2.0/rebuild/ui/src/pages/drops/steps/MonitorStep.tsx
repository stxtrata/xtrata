import { useCallback, useEffect, useMemo, useState } from 'react';
import { MAX_ESCROW_BATCH, REFUND_DELAY } from '@xtrata/collections-client';
import { microToStx } from '../../../services/fees';
import { useToasts } from '../../../shell/ToastContext';
import { shortenAddress } from '../../../shell/WalletContext';
import { useDrops, useDropsState } from '../useDropsStore';
import { useDropsServices } from '../services';
import { expandSelection, recoveryTxCount } from '../inventory';
import { MODE_COPY } from '../copy';

const PAGE_SIZE = 25;

/**
 * Steps 9 and 10 — the live dashboard and the way out.
 *
 * Every number here is read from the drop row and the claim index; nothing is
 * inferred from what this session submitted. Recovery is spelled out rather
 * than labelled: a creator pressing "recover" is moving NFTs and clearing
 * on-chain assignments, and should know that before the wallet opens.
 */
export const MonitorStep = (): JSX.Element => {
  const store = useDrops();
  const state = useDropsState();
  const services = useDropsServices();
  const { notify, notifyError } = useToasts();
  const [page, setPage] = useState(0);
  const [recoverable, setRecoverable] = useState<number[] | null>(null);

  const drop = state.drop;

  useEffect(() => {
    if (state.dropId === null) return;
    void store.refreshDrop().catch((error) => notifyError(error, 'Drop'));
    void store.loadClaims().catch((error) => notifyError(error, 'Claims'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.dropId]);

  const run = useCallback(
    async (label: string, action: () => Promise<unknown>) => {
      try {
        await action();
        notify({ kind: 'success', title: label, body: 'Confirmed on chain.' });
      } catch (error) {
        notifyError(error, label);
      }
    },
    [notify, notifyError]
  );

  const claimPageRows = useMemo(
    () => state.claims.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [page, state.claims]
  );

  const claimUrl = useMemo(() => {
    if (state.dropId === null || typeof window === 'undefined') return null;
    const url = new URL('/drops.html', window.location.origin);
    url.searchParams.set('drop', String(state.dropId));
    return url.toString();
  }, [state.dropId]);

  const onLoadRecoverable = useCallback(async () => {
    try {
      const { indexes } = await store.loadRecoverable();
      const claimed = new Set(state.claims.map((claim) => claim.index));
      setRecoverable(indexes.filter((index) => !claimed.has(index)));
    } catch (error) {
      notifyError(error, 'Recovery');
    }
  }, [notifyError, state.claims, store]);

  if (state.dropId === null || !drop) {
    return (
      <div className="banner banner--info">
        <p>Create or open a drop to see its dashboard.</p>
      </div>
    );
  }

  const copy = MODE_COPY[state.config.mode];
  const busy = state.busy !== null;
  const failedTxs = state.txLog.filter((entry) => entry.status === 'failed');

  return (
    <div>
      <section className="card">
        <div className="row spread">
          <h2>
            Drop #{state.dropId}{' '}
            <span className={`state state--${drop.statusName === 'active' ? 'done' : 'pending'}`}>
              {drop.statusName}
            </span>
          </h2>
          <button
            type="button"
            className="btn btn--sm"
            onClick={() => {
              void store.refreshDrop().catch((error) => notifyError(error, 'Drop'));
              void store.loadClaims().catch((error) => notifyError(error, 'Claims'));
            }}
          >
            Refresh
          </button>
        </div>
        <dl className="grid-2">
          <div>
            <dt className="muted">Claimed</dt>
            <dd className="mono" data-testid="claimed-count">
              {drop.claimedCount.toLocaleString()} of {drop.inventoryCount.toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="muted">Remaining</dt>
            <dd className="mono" data-testid="remaining-count">
              {(state.remaining ?? 0).toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="muted">Reserved (awaiting settlement)</dt>
            <dd className="mono">{drop.reservedCount.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="muted">Still escrowed</dt>
            <dd className="mono">{drop.escrowedCount.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="muted">Budget remaining</dt>
            <dd className="mono" data-testid="budget-remaining">
              {microToStx(drop.feeBudgetRemaining)} of {microToStx(drop.feeBudgetTotal)}
            </dd>
          </div>
          <div>
            <dt className="muted">Fees settled</dt>
            <dd className="mono">{drop.feesSettled.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="muted">Window</dt>
            <dd className="mono">
              {drop.startBlock.toLocaleString()} → {drop.endBlock === 0 ? 'open' : drop.endBlock.toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="muted">Mode</dt>
            <dd>{copy.label}</dd>
          </div>
        </dl>
        {claimUrl ? (
          <p className="hint">
            Claim page: <a href={claimUrl}>{claimUrl}</a>
          </p>
        ) : null}
      </section>

      <section className="card">
        <div className="row spread">
          <h2>Claims ({state.claims.length.toLocaleString()})</h2>
          {state.loadingClaims ? <span className="muted">loading…</span> : null}
        </div>
        {state.claims.length === 0 ? (
          <p className="muted">No claims yet.</p>
        ) : (
          <>
            <div className="table-scroll">
              <table>
                <caption className="visually-hidden">Confirmed claims</caption>
                <thead>
                  <tr>
                    <th>Item index</th>
                    <th>Claimer</th>
                    <th>Block</th>
                  </tr>
                </thead>
                <tbody>
                  {claimPageRows.map((claim) => (
                    <tr key={`${claim.index}-${claim.claimer}`}>
                      <td className="mono">{claim.index}</td>
                      <td className="mono" title={claim.claimer}>
                        {shortenAddress(claim.claimer)}
                      </td>
                      <td className="mono">{claim.claimedAt.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="row spread">
              <button
                type="button"
                className="btn btn--sm"
                disabled={page === 0}
                onClick={() => setPage((current) => Math.max(0, current - 1))}
              >
                Previous
              </button>
              <span className="muted">
                {page * PAGE_SIZE + 1}–{Math.min(state.claims.length, (page + 1) * PAGE_SIZE)} of{' '}
                {state.claims.length}
              </span>
              <button
                type="button"
                className="btn btn--sm"
                disabled={(page + 1) * PAGE_SIZE >= state.claims.length}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>

      {failedTxs.length > 0 ? (
        <section className="card">
          <h2>Failures</h2>
          <ul>
            {failedTxs.map((entry) => (
              <li key={entry.id}>
                <strong>{entry.label}</strong> — <span className="mono">{entry.functionName}</span>:{' '}
                {entry.error}
                {entry.chainErrorCode !== undefined ? ` (u${entry.chainErrorCode})` : ''}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="card">
        <h2>Control</h2>
        <div className="row">
          <button
            type="button"
            className="btn"
            disabled={busy || !services.canSign || drop.statusName !== 'active'}
            onClick={() => void run('Pause drop', () => store.pauseDrop())}
          >
            Pause
          </button>
          <button
            type="button"
            className="btn"
            disabled={busy || !services.canSign || drop.statusName !== 'paused'}
            onClick={() => void run('Resume drop', () => store.resumeDrop())}
          >
            Resume
          </button>
          <button
            type="button"
            className="btn"
            disabled={busy || !services.canSign || !['active', 'paused'].includes(drop.statusName)}
            onClick={() => void run('End drop', () => store.endDrop())}
          >
            End
          </button>
          <button
            type="button"
            className="btn btn--danger"
            disabled={busy || !services.canSign || !['draft', 'active', 'paused'].includes(drop.statusName)}
            onClick={() => void run('Cancel drop', () => store.cancelDrop())}
          >
            Cancel
          </button>
        </div>
        <p className="hint">
          Pausing stops claims but never blocks recovery. Ending closes the drop and starts the{' '}
          {REFUND_DELAY}-block creator refund delay. Cancelling closes the drop and refunds the remaining
          budget ({microToStx(drop.feeBudgetRemaining)}) in the same transaction.
        </p>
      </section>

      <section className="card">
        <h2>Recover unclaimed items</h2>
        <p>
          Recovery does three things in one transaction, for up to {MAX_ESCROW_BATCH} items at a time: it{' '}
          <strong>returns the escrowed NFTs</strong> to you, <strong>clears their assignments</strong> in
          the collection so they can go into another drop, and — once the drop is cancelled —{' '}
          <strong>refunds the remaining budget</strong>. It only works after the drop is ended or
          cancelled.
        </p>
        <div className="row">
          <button
            type="button"
            className="btn"
            disabled={busy || !['ended', 'cancelled'].includes(drop.statusName)}
            onClick={() => void onLoadRecoverable()}
          >
            Find recoverable items
          </button>
          {recoverable ? (
            <span className="muted" data-testid="recoverable-summary">
              {recoverable.length.toLocaleString()} item(s) → {recoveryTxCount(recoverable.length)}{' '}
              transaction(s) of {MAX_ESCROW_BATCH}
            </span>
          ) : null}
        </div>
        {recoverable && recoverable.length > 0 ? (
          <button
            type="button"
            className="btn btn--primary"
            style={{ marginTop: '8px' }}
            disabled={busy || !services.canSign}
            onClick={() => void run('Recover items', () => store.runRecovery(recoverable))}
          >
            Recover {recoverable.length} item(s) in {recoveryTxCount(recoverable.length)} transaction(s)
          </button>
        ) : null}
        <p className="hint">
          The index list is read from the drop's own ranges and explicit slots on chain, so this works on
          a freshly opened page; already-claimed items are excluded automatically.
          {state.selection
            ? ` (${expandSelection(state.selection).length.toLocaleString()} index(es) are also resolved in this session.)`
            : ''}
        </p>
      </section>
    </div>
  );
};
