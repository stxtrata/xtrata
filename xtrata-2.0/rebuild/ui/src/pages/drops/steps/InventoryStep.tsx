import { useCallback, useEffect, useMemo, useState } from 'react';
import { MAX_ESCROW_BATCH, MAX_INVENTORY_ITEMS, MAX_RANGES } from '@xtrata/collections-client';
import { useToasts } from '../../../shell/ToastContext';
import { useDrops, useDropsState } from '../useDropsStore';
import { useDropsServices } from '../services';
import { describeSelection } from '../inventory';

/**
 * Steps 2–4 — resolve the inventory.
 *
 * The headline is the single button at the top: one action that walks the
 * collection's unassigned scan and turns every minted-but-unassigned index
 * into a bounded set of range/explicit transactions. It is index-based, so it
 * does not care how many transactions or sessions inscribed the collection —
 * a hundred items uploaded across thirty batches select exactly as easily as
 * one contiguous run.
 */
export const InventoryStep = (): JSX.Element => {
  const store = useDrops();
  const state = useDropsState();
  const services = useDropsServices();
  const { notify, notifyError } = useToasts();

  const [rangeStart, setRangeStart] = useState('0');
  const [rangeEnd, setRangeEnd] = useState('');
  const [search, setSearch] = useState('');
  const [picked, setPicked] = useState<Set<number>>(new Set());
  const [scanRequested, setScanRequested] = useState(false);

  // One bounded scan up front so the headline button can name a real number.
  useEffect(() => {
    if (scanRequested || !services.collectionReads || !state.collectionInfo) return;
    setScanRequested(true);
    store.loadScan().catch((error) => notifyError(error, 'Unassigned scan'));
  }, [notifyError, scanRequested, services.collectionReads, state.collectionInfo, store]);

  const unassigned = useMemo(
    () => state.scan.filter((entry) => entry.minted && !entry.assigned),
    [state.scan]
  );

  const onSelectAll = useCallback(async () => {
    try {
      const selection = await store.selectAllUnassigned();
      notify({
        kind: 'success',
        title: 'Inventory selected',
        body: `${describeSelection(selection)} — ${selection.ranges.length} range segment(s), ${selection.explicit.length} single item(s).`
      });
    } catch (error) {
      notifyError(error, 'Select all');
    }
  }, [notify, notifyError, store]);

  const onSelectWhole = useCallback(() => {
    try {
      store.selectWholeCollection();
    } catch (error) {
      notifyError(error, 'Whole collection');
    }
  }, [notifyError, store]);

  const onSelectRange = useCallback(() => {
    try {
      store.selectIndexRange(Number(rangeStart), Number(rangeEnd));
    } catch (error) {
      notifyError(error, 'Index range');
    }
  }, [notifyError, rangeEnd, rangeStart, store]);

  const onSelectPicked = useCallback(() => {
    try {
      store.selectExplicitIndexes([...picked]);
    } catch (error) {
      notifyError(error, 'Selected items');
    }
  }, [notifyError, picked, store]);

  const togglePicked = (index: number): void => {
    setPicked((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const filtered = useMemo(() => {
    const term = search.trim();
    if (term.length === 0) return unassigned;
    return unassigned.filter((entry) => String(entry.index).includes(term));
  }, [search, unassigned]);

  const summary = store.planSummary;

  return (
    <div>
      <section className="card">
        <h2>Everything not yet in a drop</h2>
        <p className="muted">
          One action. This reads the collection's own unassigned scan across the whole index space and
          resolves it into the smallest set of index ranges the contract accepts — it does not depend on
          how many transactions inscribed the collection.
        </p>
        <button
          type="button"
          className="btn btn--primary"
          disabled={state.scanning || !services.collectionReads}
          onClick={() => void onSelectAll()}
          data-testid="select-all-unassigned"
        >
          {state.scanning
            ? 'Scanning the collection…'
            : unassigned.length > 0
              ? `Select all ${unassigned.length.toLocaleString()} available items`
              : 'Select all available items'}
        </button>
        {state.scan.length > 0 ? (
          <p className="hint">
            {unassigned.length.toLocaleString()} of {state.scan.length.toLocaleString()} minted items are
            unassigned. The rest already belong to another drop.
          </p>
        ) : null}
      </section>

      <section className="card">
        <h2>Other ways to choose</h2>
        <div className="row" style={{ marginBottom: '12px' }}>
          <button type="button" className="btn" onClick={onSelectWhole} disabled={!state.collectionInfo}>
            Whole collection (0 – {(state.collectionInfo?.mintedCount ?? 0) - 1})
          </button>
        </div>

        <fieldset style={{ border: 'none', padding: 0, margin: '0 0 12px' }}>
          <legend className="muted">Index range</legend>
          <div className="row">
            <div className="field" style={{ marginBottom: 0 }}>
              <label htmlFor="range-start">From (inclusive)</label>
              <input
                id="range-start"
                className="mono"
                inputMode="numeric"
                value={rangeStart}
                onChange={(event) => setRangeStart(event.target.value)}
              />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label htmlFor="range-end">To (exclusive)</label>
              <input
                id="range-end"
                className="mono"
                inputMode="numeric"
                value={rangeEnd}
                onChange={(event) => setRangeEnd(event.target.value)}
              />
            </div>
            <button type="button" className="btn" onClick={onSelectRange}>
              Select range
            </button>
          </div>
        </fieldset>

        <fieldset style={{ border: 'none', padding: 0 }}>
          <legend className="muted">Specific items</legend>
          <div className="field">
            <label htmlFor="item-search">Search by index</label>
            <input
              id="item-search"
              className="mono"
              value={search}
              placeholder="e.g. 42"
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="table-scroll" style={{ maxHeight: '220px', overflowY: 'auto' }}>
            <table>
              <caption className="visually-hidden">Unassigned items</caption>
              <thead>
                <tr>
                  <th>Pick</th>
                  <th>Index</th>
                  <th>State</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 400).map((entry) => (
                  <tr key={entry.index}>
                    <td>
                      <input
                        type="checkbox"
                        checked={picked.has(entry.index)}
                        aria-label={`Select item ${entry.index}`}
                        onChange={() => togglePicked(entry.index)}
                      />
                    </td>
                    <td className="mono">{entry.index}</td>
                    <td>unassigned</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="row" style={{ marginTop: '8px' }}>
            <button type="button" className="btn" onClick={onSelectPicked} disabled={picked.size === 0}>
              Select {picked.size} picked item{picked.size === 1 ? '' : 's'}
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setPicked(new Set())}
              disabled={picked.size === 0}
            >
              Clear picks
            </button>
          </div>
          {filtered.length > 400 ? (
            <p className="hint">Showing the first 400 matches — narrow the search to see more.</p>
          ) : null}
        </fieldset>
      </section>

      {state.selection && summary ? (
        <section className="card">
          <h2>Resolved inventory</h2>
          <dl className="grid-2">
            <div>
              <dt className="muted">Items</dt>
              <dd className="mono" data-testid="selection-count">
                {summary.itemCount.toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="muted">Chosen by</dt>
              <dd>{state.selectionSource}</dd>
            </div>
            <div>
              <dt className="muted">Range segments</dt>
              <dd className="mono">
                {summary.rangeSegments} / {MAX_RANGES}
              </dd>
            </div>
            <div>
              <dt className="muted">Single items</dt>
              <dd className="mono">{summary.explicitItems.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="muted">Indexes</dt>
              <dd className="mono" data-testid="selection-description">
                {describeSelection(state.selection)}
              </dd>
            </div>
          </dl>

          <h3>Transactions this will take</h3>
          <table>
            <caption className="visually-hidden">Bounded transaction plan</caption>
            <thead>
              <tr>
                <th>Stage</th>
                <th>Transactions</th>
                <th>Bound</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>add-inventory-range</td>
                <td className="mono" data-testid="range-txs">
                  {summary.rangeTxs}
                </td>
                <td className="muted">one per range segment, {MAX_RANGES} segments per drop</td>
              </tr>
              <tr>
                <td>add-inventory-items</td>
                <td className="mono" data-testid="explicit-txs">
                  {summary.explicitTxs}
                </td>
                <td className="muted">{MAX_INVENTORY_ITEMS} indexes per transaction</td>
              </tr>
              <tr>
                <td>escrow-batch</td>
                <td className="mono" data-testid="escrow-txs">
                  {summary.escrowTxs}
                </td>
                <td className="muted">{MAX_ESCROW_BATCH} items per transaction</td>
              </tr>
              <tr>
                <td>activate-drop</td>
                <td className="mono">1</td>
                <td className="muted">once, after every gate is met</td>
              </tr>
            </tbody>
          </table>

          {state.selectionRefitted ? (
            <div className="banner banner--info" style={{ marginTop: '12px' }}>
              <div>
                <strong>Re-fitted to the contract's range limit.</strong>
                <p>
                  Your items are scattered enough to need more than {MAX_RANGES} range segments, so the
                  shortest runs were moved into explicit item batches. Same items, one legal plan.
                </p>
              </div>
            </div>
          ) : null}

          <div className="banner banner--warn" style={{ marginTop: '12px' }} role="note">
            <div>
              <strong>Inventory becomes immutable at activation.</strong>
              <p>
                Items can be added only while the drop is a draft. Once you activate it, this list is
                fixed: nothing can be added, and items only leave by being claimed or by recovering them
                after you end or cancel the drop.
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <div className="row spread">
        <button type="button" className="btn" onClick={() => store.setStep('collection')}>
          Back
        </button>
        <button
          type="button"
          className="btn btn--primary"
          disabled={!state.selection}
          onClick={() => store.setStep('mode')}
        >
          Next: choose a mode
        </button>
      </div>
    </div>
  );
};
