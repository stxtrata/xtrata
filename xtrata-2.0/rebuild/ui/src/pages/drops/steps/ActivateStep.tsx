import { useCallback } from 'react';
import { microToStx } from '../../../services/fees';
import { useToasts } from '../../../shell/ToastContext';
import { useDrops, useDropsState } from '../useDropsStore';
import { useDropsServices } from '../services';

/**
 * Step 8 — build the drop on chain, in the order the contract requires:
 * create → inventory → escrow → (allowlist) → (fund) → activate.
 *
 * Each action is its own button rather than one "do it all" run: these are
 * wallet-signed transactions, several of them, and a creator who has to
 * approve twelve popups should be able to see exactly which stage they are in
 * and resume from there. The gate list under the buttons is read back from the
 * drop row on chain after every action — it is the contract's opinion, not
 * this page's.
 */
export const ActivateStep = (): JSX.Element => {
  const store = useDrops();
  const state = useDropsState();
  const services = useDropsServices();
  const { notify, notifyError } = useToasts();

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

  const gates = store.activationGates;
  const busy = state.busy !== null;
  const drop = state.drop;

  return (
    <div>
      {!services.canSign ? (
        <div className="banner banner--info">
          <p>Connect a wallet on {services.network} to build this drop.</p>
        </div>
      ) : null}

      <section className="card">
        <h2>Build the drop</h2>
        <ol className="steps-list">
          <li>
            <div className="row spread">
              <div>
                <strong>1. Create the drop</strong>
                <p className="muted">
                  Registers the mode, eligibility, window and limits. The drop starts as a draft.
                </p>
              </div>
              <button
                type="button"
                className="btn btn--primary"
                disabled={busy || !services.canSign || state.dropId !== null}
                onClick={() => void run('Create drop', () => store.createDrop())}
              >
                {state.dropId === null ? 'Create drop' : `Created #${state.dropId}`}
              </button>
            </div>
          </li>
          <li>
            <div className="row spread">
              <div>
                <strong>2. Assign the inventory</strong>
                <p className="muted">
                  {store.planSummary?.inventoryTxs ?? 0} transaction(s). The collection's assignment ledger
                  rejects any item that already belongs to another drop.
                </p>
              </div>
              <button
                type="button"
                className="btn"
                disabled={busy || !services.canSign || state.dropId === null}
                onClick={() => void run('Add inventory', () => store.addInventory())}
              >
                Add inventory
              </button>
            </div>
          </li>
          <li>
            <div className="row spread">
              <div>
                <strong>3. Escrow the items</strong>
                <p className="muted">
                  {store.planSummary?.escrowTxs ?? 0} transaction(s) of 25. Transfers each item's NFT to the
                  drops contract — claims are paid out of this escrow in every mode.
                </p>
              </div>
              <button
                type="button"
                className="btn"
                disabled={busy || !services.canSign || state.dropId === null}
                onClick={() => void run('Escrow items', () => store.escrowInventory())}
              >
                Escrow items
              </button>
            </div>
          </li>
          {state.config.eligibility === 'allowlist' ? (
            <li>
              <div className="row spread">
                <div>
                  <strong>4. Write the allowlist</strong>
                  <p className="muted">{state.allowlist.length} wallet(s) staged.</p>
                </div>
                <button
                  type="button"
                  className="btn"
                  disabled={busy || !services.canSign || state.dropId === null || state.allowlist.length === 0}
                  onClick={() => void run('Set allowlist', () => store.applyAllowlist())}
                >
                  Set allowlist
                </button>
              </div>
            </li>
          ) : null}
          {state.config.mode === 'sponsored' ? (
            <li>
              <div className="row spread">
                <div>
                  <strong>5. Fund the sponsor budget</strong>
                  <p className="muted">
                    {microToStx(state.budgetInputMicroStx)} — the activation gate needs{' '}
                    {microToStx(store.exposure.minimumBudget)}
                    {store.budgetShortfall > 0n ? `, still short ${microToStx(store.budgetShortfall)}` : ''}.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn"
                  disabled={
                    busy || !services.canSign || state.dropId === null || state.budgetInputMicroStx <= 0n
                  }
                  onClick={() => void run('Fund budget', () => store.fundBudget())}
                >
                  Fund budget
                </button>
              </div>
            </li>
          ) : null}
        </ol>
      </section>

      <section className="card">
        <h2>Activation gates</h2>
        <p className="muted">Read back from the drop row after each transaction.</p>
        <ul>
          {gates.map((gate) => (
            <li key={gate.label} data-testid={`gate-${gate.label.toLowerCase().replace(/\s+/g, '-')}`}>
              <span className={`state state--${gate.met ? 'done' : 'pending'}`}>
                {gate.met ? 'met' : 'pending'}
              </span>{' '}
              <strong>{gate.label}</strong> — <span className="muted">{gate.detail}</span>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="btn btn--primary"
          disabled={busy || !services.canSign || !store.canActivate}
          onClick={() => void run('Activate drop', () => store.activate())}
          data-testid="activate-drop"
        >
          Activate drop
        </button>
        <p className="hint">
          Activation freezes the inventory. After it, items leave only by being claimed, or by recovery
          once you end or cancel the drop.
        </p>
        <button
          type="button"
          className="btn btn--sm btn--ghost"
          onClick={() => void store.refreshDrop().catch((error) => notifyError(error, 'Refresh'))}
          disabled={state.dropId === null}
        >
          Re-read the drop from chain
        </button>
      </section>

      {state.txLog.length > 0 ? (
        <section className="card">
          <h2>Transactions</h2>
          <div className="table-scroll">
            <table>
              <caption className="visually-hidden">Submitted transactions</caption>
              <thead>
                <tr>
                  <th>Step</th>
                  <th>Function</th>
                  <th>Status</th>
                  <th>Transaction</th>
                </tr>
              </thead>
              <tbody>
                {state.txLog.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.label}</td>
                    <td className="mono">{entry.functionName}</td>
                    <td>
                      <span
                        className={`state state--${
                          entry.status === 'success' ? 'done' : entry.status === 'failed' ? 'bad' : 'active'
                        }`}
                      >
                        {entry.status}
                      </span>
                      {entry.error ? <div className="muted">{entry.error}</div> : null}
                      {entry.chainErrorCode !== undefined ? (
                        <div className="mono">u{entry.chainErrorCode}</div>
                      ) : null}
                    </td>
                    <td className="mono">{entry.txid ? `${entry.txid.slice(0, 12)}…` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {drop ? (
        <div className="row spread">
          <button type="button" className="btn" onClick={() => store.setStep('costs')}>
            Back
          </button>
          <button type="button" className="btn btn--primary" onClick={() => store.setStep('monitor')}>
            Go to the dashboard
          </button>
        </div>
      ) : null}
    </div>
  );
};
