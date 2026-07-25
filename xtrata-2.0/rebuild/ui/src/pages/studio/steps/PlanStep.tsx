import { useCallback, useEffect, useState } from 'react';
import { CHUNK_SIZE, MAX_CHUNK_BATCH, MAX_SEAL_BATCH } from '@xtrata/collections-client';
import { useToasts } from '../../../shell/ToastContext';
import { loadFeeSchedule, microToStx } from '../../../services/fees';
import { useStudio, useStudioState } from '../useStudioStore';
import { useStudioServices } from '../services';

/**
 * Plan review: what will actually be broadcast, and what it costs.
 *
 * Totals come straight from the client planner over the sealed manifest, and
 * the fee schedule is derived from the core's own `quote-inscription-fee` — so
 * the number on this screen and the spend caps in the post-conditions come from
 * the same source.
 */
export const PlanStep = (): JSX.Element => {
  const store = useStudio();
  const state = useStudioState();
  const services = useStudioServices();
  const { notifyError } = useToasts();
  const [loadingFees, setLoadingFees] = useState(false);

  const loadFees = useCallback(async () => {
    if (!services.transport) return;
    setLoadingFees(true);
    try {
      const result = await loadFeeSchedule({
        transport: services.transport,
        coreContractId: services.coreContractId
      });
      store.setFees(result.schedule, result.source);
    } catch (error) {
      notifyError(error, 'Fee quote');
    } finally {
      setLoadingFees(false);
    }
  }, [notifyError, services.coreContractId, services.transport, store]);

  useEffect(() => {
    if (!state.fees) void loadFees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onBuildPlan = useCallback(() => {
    try {
      store.buildPlan();
    } catch (error) {
      notifyError(error, 'Plan');
    }
  }, [notifyError, store]);

  const { manifest, plan } = state;

  if (!manifest) {
    return (
      <div className="banner banner--info">
        <p>Import files and build a manifest first.</p>
      </div>
    );
  }

  const totalBytes = manifest.items.reduce((sum, item) => sum + item.byteLength, 0);
  const totalChunks = manifest.items.reduce((sum, item) => sum + item.chunkCount, 0);
  const singleTx = manifest.items.filter((item) => item.mode === 'single-tx').length;

  return (
    <div>
      <section className="card">
        <h2>Manifest</h2>
        <dl className="grid-2">
          <div>
            <dt className="muted">Items</dt>
            <dd className="mono">{manifest.items.length}</dd>
          </div>
          <div>
            <dt className="muted">Total bytes</dt>
            <dd className="mono">{totalBytes.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="muted">Chunks ({CHUNK_SIZE.toLocaleString()} B each)</dt>
            <dd className="mono">{totalChunks.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="muted">Single-tx / staged</dt>
            <dd className="mono">
              {singleTx} / {manifest.items.length - singleTx}
            </dd>
          </div>
          <div>
            <dt className="muted">Checksum</dt>
            <dd className="mono">{manifest.checksum}</dd>
          </div>
          <div>
            <dt className="muted">Network</dt>
            <dd className="mono">{manifest.network}</dd>
          </div>
        </dl>
        <p className="hint">
          Bounds: ≤ {MAX_CHUNK_BATCH} chunks per upload transaction, ≤ {MAX_SEAL_BATCH} seals per
          seal-batch transaction.
        </p>
      </section>

      <section className="card">
        <div className="row spread">
          <h2>Fees</h2>
          <button type="button" className="btn btn--sm" onClick={() => void loadFees()} disabled={loadingFees}>
            {loadingFees ? 'Quoting…' : 'Re-quote from the core'}
          </button>
        </div>
        {state.fees ? (
          <p className="muted">
            Schedule source: <code>{state.feeSource}</code>
          </p>
        ) : (
          <p className="muted">No fee schedule loaded yet.</p>
        )}
        <button
          type="button"
          className="btn"
          onClick={onBuildPlan}
          disabled={!state.fees}
          style={{ marginTop: '8px' }}
        >
          Build transaction plan
        </button>
      </section>

      {plan ? (
        <>
          <section className="card">
            <h2>Totals</h2>
            <dl className="grid-2">
              <div>
                <dt className="muted">Transactions</dt>
                <dd className="mono">{plan.totalTxs}</dd>
              </div>
              <div>
                <dt className="muted">Estimated inscription fees</dt>
                <dd className="mono">{microToStx(plan.totalEstimatedFeeMicroStx)}</dd>
              </div>
              <div>
                <dt className="muted">Mint price total</dt>
                <dd className="mono">{microToStx(plan.totalMintPriceMicroStx)}</dd>
              </div>
              <div>
                <dt className="muted">Network fees</dt>
                <dd className="muted">Charged per transaction by your wallet, on top of the above.</dd>
              </div>
            </dl>
          </section>

          <section className="card">
            <h2>Per-item breakdown</h2>
            <div className="table-scroll">
              <table>
                <caption className="visually-hidden">Planned transactions per item</caption>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>File</th>
                    <th>Mode</th>
                    <th>Chunks</th>
                    <th>Chunk batches</th>
                    <th>Txs</th>
                    <th>Sealed in batch</th>
                    <th>Est. fee</th>
                  </tr>
                </thead>
                <tbody>
                  {plan.items.map((item) => {
                    const source = manifest.items[item.index]!;
                    return (
                      <tr key={item.index}>
                        <td className="mono">{item.index}</td>
                        <td>{source.fileName}</td>
                        <td>{item.mode}</td>
                        <td className="mono">{source.chunkCount}</td>
                        <td className="mono">{item.chunkBatchCount}</td>
                        <td className="mono">{item.txCount}</td>
                        <td>{item.sealedInBatch ? 'yes' : 'no'}</td>
                        <td className="mono">{microToStx(item.estimatedFeeMicroStx)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}

      <div className="row spread">
        <button type="button" className="btn" onClick={() => store.setStep('import')}>
          Back
        </button>
        <button
          type="button"
          className="btn btn--primary"
          disabled={!plan || !services.canSign}
          onClick={() => store.setStep('run')}
        >
          Next: run
        </button>
      </div>
      {!services.canSign ? (
        <p className="hint">Connect a wallet on {services.network} to run the plan.</p>
      ) : null}
    </div>
  );
};
