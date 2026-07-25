import { useCallback, useState } from 'react';
import { reportToJson, reportToMarkdown } from '@xtrata/collections-client';
import { useToasts } from '../../../shell/ToastContext';
import { useStudio, useStudioState } from '../useStudioStore';
import { useStudioServices } from '../services';
import { buildClosureTxs } from '../config-txs';

const download = (name: string, body: string, type: string): void => {
  const url = URL.createObjectURL(new Blob([body], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
};

/**
 * Completion: the report, the irreversible closure controls, and the handoff
 * into the Drop Builder.
 *
 * `close-supply` and `finalize` are one-way, so both are behind a typed
 * confirmation rather than a single click.
 */
export const CompleteStep = (): JSX.Element => {
  const store = useStudio();
  const state = useStudioState();
  const services = useStudioServices();
  const { notify, notifyError } = useToasts();
  const [confirmText, setConfirmText] = useState('');
  const [busy, setBusy] = useState(false);

  const report = state.report;
  const contractId = state.deploy.contractId;

  const runClosure = useCallback(
    async (options: { closeSupply: boolean; finalize: boolean }, phrase: string) => {
      if (!services.builder || !services.submit) return;
      if (confirmText.trim() !== phrase) {
        notify({
          kind: 'warn',
          title: 'Confirmation required',
          body: `Type "${phrase}" to confirm — this cannot be undone.`
        });
        return;
      }
      setBusy(true);
      try {
        for (const step of buildClosureTxs(services.builder, options)) {
          const { txid } = await services.submit(step.tx);
          notify({ kind: 'info', title: step.label, body: txid });
          if (services.waitConfirm) await services.waitConfirm(txid);
        }
        setConfirmText('');
      } catch (error) {
        notifyError(error, 'Collection closure');
      } finally {
        setBusy(false);
      }
    },
    [confirmText, notify, notifyError, services]
  );

  return (
    <div>
      <section className="card">
        <h2>Report</h2>
        {report ? (
          <>
            <dl className="grid-2">
              <div>
                <dt className="muted">Collection</dt>
                <dd>{report.collectionName}</dd>
              </div>
              <div>
                <dt className="muted">Network</dt>
                <dd className="mono">{report.network}</dd>
              </div>
              <div>
                <dt className="muted">Succeeded / failed</dt>
                <dd className="mono">
                  {report.totals.succeeded} / {report.totals.failed}
                </dd>
              </div>
              <div>
                <dt className="muted">Transactions</dt>
                <dd className="mono">{report.totals.txCount}</dd>
              </div>
              <div>
                <dt className="muted">Manifest checksum</dt>
                <dd className="mono">{report.manifestChecksum}</dd>
              </div>
              <div>
                <dt className="muted">Generated</dt>
                <dd className="mono">{report.generatedAt}</dd>
              </div>
            </dl>
            <div className="row">
              <button
                type="button"
                className="btn"
                onClick={() => download('collection-report.json', reportToJson(report), 'application/json')}
              >
                Download JSON
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => download('collection-report.md', reportToMarkdown(report), 'text/markdown')}
              >
                Download Markdown
              </button>
            </div>
            <div className="table-scroll" style={{ marginTop: '16px' }}>
              <table>
                <caption className="visually-hidden">Final item outcomes</caption>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>File</th>
                    <th>State</th>
                    <th>Token</th>
                    <th>Txs</th>
                    <th>Error</th>
                  </tr>
                </thead>
                <tbody>
                  {report.items.map((item) => (
                    <tr key={item.index}>
                      <td className="mono">{item.index}</td>
                      <td>{item.fileName}</td>
                      <td>{item.state}</td>
                      <td className="mono">{item.tokenId ?? '—'}</td>
                      <td className="mono">{item.txCount}</td>
                      <td className="muted">{item.error ?? ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="muted">No report yet — finish a run first.</p>
        )}
      </section>

      <section className="card">
        <h2>Close the collection</h2>
        <div className="banner banner--warn">
          <p>
            Both actions are one-way. <strong>Close supply</strong> fixes the maximum at whatever is
            minted plus reserved. <strong>Finalize</strong> freezes every configuration value
            permanently and requires that no reservation is outstanding.
          </p>
        </div>
        <div className="field" style={{ maxWidth: '360px' }}>
          <label htmlFor="confirm">Type the action name to confirm</label>
          <input
            id="confirm"
            type="text"
            value={confirmText}
            onChange={(event) => setConfirmText(event.target.value)}
            placeholder="close-supply or finalize"
          />
        </div>
        <div className="row">
          <button
            type="button"
            className="btn btn--danger"
            disabled={!services.canSign || busy}
            onClick={() => void runClosure({ closeSupply: true, finalize: false }, 'close-supply')}
          >
            Close supply
          </button>
          <button
            type="button"
            className="btn btn--danger"
            disabled={!services.canSign || busy}
            onClick={() => void runClosure({ closeSupply: false, finalize: true }, 'finalize')}
          >
            Finalize
          </button>
        </div>
      </section>

      <section className="card">
        <h2>Create a drop</h2>
        <p className="muted">
          Hand this collection to the Drop Builder. Inventory is selected there by index range over
          the collection, so a whole collection is one selection action.
        </p>
        <a
          className="btn btn--primary"
          href={contractId ? `/drops.html?collection=${encodeURIComponent(contractId)}` : '/drops.html'}
          aria-disabled={!contractId}
        >
          Create Drop
        </a>
        {!contractId ? <p className="hint">Deploy the collection first to pass it through.</p> : null}
      </section>

      <div className="row spread">
        <button type="button" className="btn" onClick={() => store.setStep('run')}>
          Back to run
        </button>
        <span />
      </div>
    </div>
  );
};
