import { useCallback, useRef } from 'react';
import { rollup } from '@xtrata/collections-client';
import { useToasts } from '../../../shell/ToastContext';
import { useStudio, useStudioState } from '../useStudioStore';
import { ItemStatusRow } from '../ItemStatus';

/**
 * Run screen.
 *
 * Two things it must never do: claim something landed that the chain has not
 * confirmed, and resume from local state. Every start/resume/retry says
 * "verifying on-chain state" first because that is literally what the executor
 * does — it re-observes every item before it acts.
 */
export const RunStep = (): JSX.Element => {
  const store = useStudio();
  const state = useStudioState();
  const { notify, notifyError } = useToasts();
  const importInput = useRef<HTMLInputElement>(null);

  const agg = rollup(state.progress);
  const running = state.run.phase === 'running' || state.run.phase === 'verifying';

  const start = useCallback(async () => {
    try {
      await store.startRun();
    } catch (error) {
      notifyError(error, 'Run');
    }
  }, [notifyError, store]);

  const retry = useCallback(async () => {
    try {
      await store.retryFailed();
    } catch (error) {
      notifyError(error, 'Retry');
    }
  }, [notifyError, store]);

  const exportManifestFile = useCallback(() => {
    try {
      const json = store.exportManifestJson();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${state.manifest?.collection.name ?? 'collection'}-manifest.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      notify({
        kind: 'success',
        title: 'Manifest exported',
        body: 'Keep this with the files — together they rebuild the same plan anywhere.'
      });
    } catch (error) {
      notifyError(error, 'Manifest export');
    }
  }, [notify, notifyError, state.manifest, store]);

  const importManifestFile = useCallback(
    async (file: File) => {
      try {
        const { manifest, missingFiles } = store.importManifestJson(await file.text());
        notify({
          kind: missingFiles.length > 0 ? 'warn' : 'success',
          title: 'Manifest imported',
          body:
            missingFiles.length > 0
              ? `${missingFiles.length} file(s) are not loaded here: ${missingFiles.slice(0, 3).join(', ')}…`
              : `${manifest.items.length} items, checksum verified.`
        });
      } catch (error) {
        notifyError(error, 'Manifest import');
      }
    },
    [notify, notifyError, store]
  );

  return (
    <div>
      <section className="card">
        <div className="row spread">
          <h2>Run</h2>
          <span className="badge">{state.run.phase}</span>
        </div>

        {state.run.phase === 'verifying' ? (
          <div className="banner banner--info" role="status">
            <p>
              <strong>Verifying on-chain state…</strong> Every item is re-read from the collection
              and the core before anything is submitted, so nothing is broadcast twice.
            </p>
          </div>
        ) : null}

        {state.run.phase === 'paused' ? (
          <div className="banner banner--warn" role="status">
            <p>
              <strong>Paused.</strong> {state.run.reason ?? 'Stopped at a transaction boundary.'}{' '}
              Resuming re-reads chain state first — nothing already landed will be resubmitted.
            </p>
          </div>
        ) : null}

        {state.missingFiles.length > 0 ? (
          <div className="banner banner--warn" role="alert">
            <div>
              <strong>{state.missingFiles.length} file(s) from the manifest are not loaded.</strong>
              <p>Re-import them on the previous step; items are matched by content hash, not name.</p>
            </div>
          </div>
        ) : null}

        <div className="row">
          <button
            type="button"
            className="btn btn--primary"
            disabled={running || !state.plan}
            onClick={() => void start()}
          >
            {state.run.phase === 'paused' ? 'Resume' : 'Start run'}
          </button>
          <button
            type="button"
            className="btn"
            disabled={!running || state.run.pauseRequested}
            onClick={() => store.requestPause()}
          >
            {state.run.pauseRequested ? 'Pausing at next transaction…' : 'Pause'}
          </button>
          <button
            type="button"
            className="btn"
            disabled={running || store.failedCount === 0}
            onClick={() => void retry()}
          >
            Retry failed ({store.failedCount})
          </button>
        </div>
      </section>

      <section className="card">
        <h2>Manifest backup</h2>
        <p className="muted">
          The manifest is a cache, not a record of what happened on chain — but it is what lets you
          continue on another machine. Export it with the files; import it there and the plan is
          rebuilt identically (the checksum is verified on import).
        </p>
        <div className="row">
          <button type="button" className="btn" onClick={exportManifestFile} disabled={!state.manifest}>
            Export manifest
          </button>
          <button type="button" className="btn" onClick={() => importInput.current?.click()}>
            Import manifest
          </button>
          <input
            ref={importInput}
            type="file"
            accept="application/json,.json"
            className="visually-hidden"
            aria-label="Import a manifest file"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void importManifestFile(file);
              event.target.value = '';
            }}
          />
        </div>
      </section>

      <section className="card">
        <div className="row spread">
          <h2>Items</h2>
          <span className="muted mono">
            {agg.done} done · {agg.inFlight} in flight · {agg.failed} failed · {agg.expired} expired
          </span>
        </div>
        <div className="table-scroll">
          <table>
            <caption className="visually-hidden">Per-item run status</caption>
            <thead>
              <tr>
                <th>#</th>
                <th>File</th>
                <th>State</th>
                <th>Chunks</th>
                <th>Txs</th>
                <th>Error</th>
              </tr>
            </thead>
            <tbody>
              {state.progress.map((progress) => (
                <ItemStatusRow
                  key={progress.index}
                  progress={progress}
                  fileName={state.manifest?.items[progress.index]?.fileName ?? `item ${progress.index}`}
                />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="row spread">
        <button type="button" className="btn" onClick={() => store.setStep('plan')} disabled={running}>
          Back
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => store.setStep('complete')}
          disabled={!state.report}
        >
          Next: report
        </button>
      </div>
    </div>
  );
};
