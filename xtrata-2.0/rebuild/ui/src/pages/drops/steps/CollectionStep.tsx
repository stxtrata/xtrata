import { useCallback, useEffect, useState } from 'react';
import { useToasts } from '../../../shell/ToastContext';
import { useDrops, useDropsState } from '../useDropsStore';
import { useDropsServices } from '../services';

/**
 * Step 1 — pick the collection this drop draws from.
 *
 * The Studio links here with `?collection=<contractId>`, so the common path is
 * "the field is already filled in, press Load". Everything shown is read from
 * the collection contract; nothing is taken on trust from the link.
 */
export const CollectionStep = (): JSX.Element => {
  const store = useDrops();
  const state = useDropsState();
  const services = useDropsServices();
  const { notifyError } = useToasts();
  const [draftId, setDraftId] = useState(state.collectionId);
  const [autoLoaded, setAutoLoaded] = useState(false);

  const load = useCallback(
    async (contractId: string) => {
      store.setCollectionId(contractId.trim());
      try {
        await store.loadCollection();
        await store.loadChainContext();
      } catch (error) {
        notifyError(error, 'Collection');
      }
    },
    [notifyError, store]
  );

  // Handoff from the Studio: load once, automatically, when the id arrived on
  // the URL and a transport exists.
  useEffect(() => {
    if (autoLoaded || !services.collectionReads || !state.collectionId || state.collectionInfo) return;
    setAutoLoaded(true);
    void load(state.collectionId);
  }, [autoLoaded, load, services.collectionReads, state.collectionId, state.collectionInfo]);

  useEffect(() => {
    setDraftId(state.collectionId);
  }, [state.collectionId]);

  const info = state.collectionInfo;
  const authorityMatches =
    info === null ? null : info.dropsAuthority === services.dropsContractId;

  return (
    <div>
      <section className="card">
        <h2>Collection</h2>
        <p className="muted">
          A drop draws its inventory from exactly one collection. Paste the deployed collection
          contract, or arrive here from the Collection Studio with the handoff link.
        </p>
        <div className="field">
          <label htmlFor="collection-id">Collection contract id</label>
          <input
            id="collection-id"
            className="mono"
            value={draftId}
            placeholder="SP… .my-collection"
            onChange={(event) => setDraftId(event.target.value)}
          />
          <p className="hint">Format: <code>SPxxxxxxxx.contract-name</code></p>
        </div>
        <div className="row">
          <button
            type="button"
            className="btn btn--primary"
            disabled={draftId.trim().length === 0 || state.loadingCollection || !services.collectionReads}
            onClick={() => void load(draftId)}
          >
            {state.loadingCollection ? 'Loading…' : 'Load collection'}
          </button>
          <a className="btn" href="/studio.html">
            Open the Collection Studio
          </a>
        </div>
        {!services.collectionReads ? (
          <p className="hint">Enter a collection id to read it from the chain.</p>
        ) : null}
      </section>

      {info ? (
        <section className="card">
          <h2>{info.name || 'Untitled collection'}</h2>
          <dl className="grid-2">
            <div>
              <dt className="muted">Symbol</dt>
              <dd className="mono">{info.symbol || '—'}</dd>
            </div>
            <div>
              <dt className="muted">Owner</dt>
              <dd className="mono">{info.owner}</dd>
            </div>
            <div>
              <dt className="muted">Minted items</dt>
              <dd className="mono" data-testid="minted-count">
                {info.mintedCount.toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="muted">Reserved (in-flight)</dt>
              <dd className="mono">{info.reservedCount.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="muted">Next index</dt>
              <dd className="mono">{info.nextIndex.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="muted">Max supply</dt>
              <dd className="mono">{info.maxSupply === 0 ? 'open' : info.maxSupply.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="muted">Unassigned (not in any drop)</dt>
              <dd className="mono" data-testid="unassigned-count">
                {state.scan.length > 0
                  ? state.scan.filter((entry) => entry.minted && !entry.assigned).length.toLocaleString()
                  : 'scan on the next step'}
              </dd>
            </div>
            <div>
              <dt className="muted">Status</dt>
              <dd>
                {info.paused ? 'paused' : 'live'}
                {info.finalized ? ', finalized' : ''}
              </dd>
            </div>
          </dl>
        </section>
      ) : null}

      {info && authorityMatches === false ? (
        <div className="banner banner--danger" role="alert">
          <div>
            <strong>This collection has not authorized the drops contract.</strong>
            <p>
              Its <code>drops-authority</code> is{' '}
              <code>{info.dropsAuthority ?? 'unset'}</code>, but this build assigns inventory through{' '}
              <code>{services.dropsContractId}</code>. Every <code>add-inventory-*</code> call would be
              rejected by the collection. Set the authority from the Collection Studio first.
            </p>
          </div>
        </div>
      ) : null}

      {info && info.mintedCount === 0 ? (
        <div className="banner banner--warn" role="alert">
          <div>
            <strong>Nothing to distribute yet.</strong>
            <p>This collection has no minted items. Inscribe items before building a drop.</p>
          </div>
        </div>
      ) : null}

      <div className="row spread">
        <span />
        <button
          type="button"
          className="btn btn--primary"
          disabled={!info || info.mintedCount === 0}
          onClick={() => store.setStep('inventory')}
        >
          Next: choose inventory
        </button>
      </div>
    </div>
  );
};
