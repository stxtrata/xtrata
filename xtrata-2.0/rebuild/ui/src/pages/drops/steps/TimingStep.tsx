import { useCallback, useMemo, useState } from 'react';
import { useToasts } from '../../../shell/ToastContext';
import { useDrops, useDropsState } from '../useDropsStore';
import { useDropsServices } from '../services';
import { describeBlock, validateWindow } from '../blocks';
import { ELIGIBILITY_COPY, ELIGIBILITY_ORDER } from '../copy';
import { parseAllowlist } from '../store';

/**
 * Step 6 — the claim window, the limits, and who is allowed to claim.
 *
 * Block heights are shown with an approximate wall-clock translation, hedged
 * every time: block production is not a clock, and a creator should not read
 * "about 3 days" as a promise.
 */
export const TimingStep = (): JSX.Element => {
  const store = useDrops();
  const state = useDropsState();
  const services = useDropsServices();
  const { notify, notifyError } = useToasts();
  const [allowlistText, setAllowlistText] = useState('');

  const { config, tipHeight } = state;
  const window = useMemo(
    () => validateWindow({ startBlock: config.startBlock, endBlock: config.endBlock, tipHeight }),
    [config.endBlock, config.startBlock, tipHeight]
  );

  const parsed = useMemo(() => parseAllowlist(allowlistText), [allowlistText]);

  const applyAllowlist = useCallback(() => {
    store.setAllowlist(parsed.entries);
    notify({
      kind: 'success',
      title: 'Allowlist staged',
      body: `${parsed.entries.length} wallet(s). It is written on chain after the drop is created.`
    });
  }, [notify, parsed.entries, store]);

  const numberField = (
    id: string,
    label: string,
    value: number,
    onChange: (next: number) => void,
    hint: string
  ): JSX.Element => (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        className="mono"
        inputMode="numeric"
        value={String(value)}
        onChange={(event) => {
          const next = Number(event.target.value);
          onChange(Number.isFinite(next) && next >= 0 ? Math.floor(next) : 0);
        }}
      />
      <p className="hint">{hint}</p>
    </div>
  );

  return (
    <div>
      <section className="card">
        <h2>Claim window</h2>
        <p className="muted">
          Current chain tip:{' '}
          <span className="mono">{tipHeight === null ? 'unknown' : tipHeight.toLocaleString()}</span>
          {services.getBlockHeight ? (
            <>
              {' '}
              <button
                type="button"
                className="btn btn--sm btn--ghost"
                onClick={() => void store.loadChainContext().catch((error) => notifyError(error, 'Chain tip'))}
              >
                refresh
              </button>
            </>
          ) : null}
        </p>
        {numberField(
          'start-block',
          'Start block',
          config.startBlock,
          (startBlock) => store.updateConfig({ startBlock }),
          '0 means claims open the moment the drop is activated.'
        )}
        <p className="hint" data-testid="start-block-description">
          {describeBlock({ block: config.startBlock, tipHeight, kind: 'start' })}
        </p>
        {numberField(
          'end-block',
          'End block',
          config.endBlock,
          (endBlock) => store.updateConfig({ endBlock }),
          '0 means no end block — you end the drop yourself.'
        )}
        <p className="hint" data-testid="end-block-description">
          {describeBlock({ block: config.endBlock, tipHeight, kind: 'end' })}
        </p>
        {window.errors.map((problem) => (
          <p className="error" key={problem.message} role="alert">
            {problem.message}
          </p>
        ))}
        {window.warnings.map((problem) => (
          <p className="hint" key={problem.message}>
            ⚠ {problem.message}
          </p>
        ))}
      </section>

      <section className="card">
        <h2>Limits</h2>
        {numberField(
          'total-limit',
          'Total claims',
          config.totalLimit,
          (totalLimit) => store.updateConfig({ totalLimit }),
          '0 means the whole inventory is claimable. A lower number caps the drop below its inventory.'
        )}
        {numberField(
          'per-wallet-limit',
          'Per wallet',
          config.perWalletLimit,
          (perWalletLimit) => store.updateConfig({ perWalletLimit }),
          '0 means no per-wallet cap. Note an outstanding reservation counts against a wallet.'
        )}
      </section>

      <section className="card">
        <h2>Eligibility</h2>
        <div role="radiogroup" aria-label="Eligibility">
          {ELIGIBILITY_ORDER.map((value) => {
            const copy = ELIGIBILITY_COPY[value];
            return (
              <label key={value} style={{ display: 'block', marginBottom: '8px' }}>
                <div className="row">
                  <input
                    type="radio"
                    name="eligibility"
                    value={value}
                    checked={config.eligibility === value}
                    onChange={() => store.setEligibility(value)}
                  />
                  <strong>{copy.label}</strong>
                </div>
                <p className="muted">{copy.summary}</p>
                {copy.requirement ? <p className="hint">{copy.requirement}</p> : null}
              </label>
            );
          })}
        </div>

        {config.eligibility === 'allowlist' ? (
          <div className="field">
            <label htmlFor="allowlist">Allowlist (one wallet per line, optional allowance)</label>
            <textarea
              id="allowlist"
              className="mono"
              rows={6}
              value={allowlistText}
              placeholder={'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7 2\nSP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE'}
              onChange={(event) => setAllowlistText(event.target.value)}
            />
            <p className="hint">
              Written on chain with <code>set-allowlist-batch</code>, up to 200 wallets per transaction.
              Missing allowance defaults to 1.
            </p>
            {parsed.errors.map((error) => (
              <p className="error" key={error}>
                {error}
              </p>
            ))}
            <div className="row">
              <button
                type="button"
                className="btn"
                disabled={parsed.entries.length === 0}
                onClick={applyAllowlist}
              >
                Stage {parsed.entries.length} wallet{parsed.entries.length === 1 ? '' : 's'}
              </button>
              <span className="muted">{state.allowlist.length} staged</span>
            </div>
          </div>
        ) : null}

        {config.eligibility === 'signed' && state.attestorConfigured === false ? (
          <div className="banner banner--danger" role="alert">
            <div>
              <strong>No attestor is configured on the drops contract.</strong>
              <p>
                <code>claim-signed</code> returns u219 until the contract owner sets an attestor pubkey
                hash matching the key the relayer signs attestations with. Nobody could claim this drop.
              </p>
            </div>
          </div>
        ) : null}
      </section>

      <div className="row spread">
        <button type="button" className="btn" onClick={() => store.setStep('mode')}>
          Back
        </button>
        <button
          type="button"
          className="btn btn--primary"
          disabled={window.errors.length > 0}
          onClick={() => store.setStep('costs')}
        >
          Next: costs and exposure
        </button>
      </div>
    </div>
  );
};
