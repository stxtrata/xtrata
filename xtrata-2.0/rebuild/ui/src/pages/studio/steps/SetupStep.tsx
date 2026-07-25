import { useCallback, useMemo, useState } from 'react';
import { useToasts } from '../../../shell/ToastContext';
import { fetchContractSource } from '../../../services/deploy';
import { microToStx } from '../../../services/fees';
import { useStudio, useStudioState } from '../useStudioStore';
import { useStudioServices } from '../services';
import {
  assertDeployedSourceMatches,
  sourceHash,
  validateContractName,
  type SupplyMode
} from '../template';
import {
  buildConfigTxs,
  createDefaultConfigDraft,
  creatorOnlyPhase,
  publicMintPhase,
  validateConfigDraft,
  type CollectionConfigDraft
} from '../config-txs';

const SUPPLY_MODES: { value: SupplyMode; label: string; hint: string }[] = [
  { value: 'open', label: 'Open', hint: 'Mint until you close it. Max supply stays 0.' },
  { value: 'fixed', label: 'Fixed', hint: 'A hard cap set now and never raised.' },
  {
    value: 'capped-closable',
    label: 'Capped, closable',
    hint: 'Open now; close-supply later freezes it at whatever has been minted.'
  }
];

const stxToMicro = (value: string): bigint => {
  const trimmed = value.trim();
  if (!/^\d+(\.\d{0,6})?$/.test(trimmed)) return 0n;
  const [whole = '0', fraction = ''] = trimmed.split('.');
  return BigInt(whole) * 1_000_000n + BigInt((fraction + '000000').slice(0, 6));
};

export const SetupStep = (): JSX.Element => {
  const store = useStudio();
  const state = useStudioState();
  const services = useStudioServices();
  const { notify, notifyError } = useToasts();
  const { draft, deploy } = state;

  const build = useMemo(() => store.buildSource(), [store, state.draft]);
  const nameError = validateContractName(deploy.contractName);
  const [priceText, setPriceText] = useState('0');
  const [config, setConfig] = useState<CollectionConfigDraft>(() =>
    createDefaultConfigDraft(services.address ?? 'SP000000000000000000002Q6VF78')
  );
  const [busy, setBusy] = useState<string | null>(null);
  const configErrors = validateConfigDraft(config);

  const contractId =
    deploy.contractId ??
    (services.address && deploy.contractName && !nameError
      ? `${services.address}.${deploy.contractName}`
      : null);

  const onDeploy = useCallback(async () => {
    if (!services.deploy || !services.address) return;
    if (build.errors.length > 0 || nameError) return;
    setBusy('deploy');
    store.updateDeploy({ status: 'submitting', error: undefined });
    try {
      const { txid } = await services.deploy({
        contractName: deploy.contractName,
        codeBody: build.source,
        network: services.network,
        stxAddress: services.address
      });
      const id = `${services.address}.${deploy.contractName}`;
      store.updateDeploy({ status: 'confirming', txid, contractId: id });
      notify({ kind: 'info', title: 'Deploy submitted', body: `${txid} — waiting for confirmation.` });
      if (services.waitConfirm) {
        const result = await services.waitConfirm(txid);
        if (result.status !== 'success') {
          store.updateDeploy({ status: 'failed', error: `deploy transaction ${result.status}` });
          return;
        }
      }
      store.updateDeploy({ status: 'verifying-source' });
      await verifySource(id);
    } catch (error) {
      store.updateDeploy({ status: 'failed', error: String(error) });
      notifyError(error, 'Deploy');
    } finally {
      setBusy(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [build, deploy.contractName, nameError, notify, notifyError, services, store]);

  const verifySource = useCallback(
    async (id: string) => {
      const actual = await fetchContractSource({ apiBaseUrl: services.apiBaseUrl, contractId: id });
      if (actual === null) {
        store.updateDeploy({ status: 'confirming', error: 'not indexed yet — try verify again' });
        return;
      }
      try {
        const verification = assertDeployedSourceMatches({
          expected: build.source,
          actual,
          contractId: id
        });
        store.updateDeploy({
          status: 'verified',
          contractId: id,
          sourceMatch: verification.match,
          expectedHash: verification.expectedHash,
          actualHash: verification.actualHash,
          error: undefined
        });
        notify({
          kind: 'success',
          title: 'Deployed source verified',
          body: `sha256 ${verification.expectedHash.slice(0, 16)}… (${verification.match} match)`
        });
      } catch (error) {
        store.updateDeploy({ status: 'failed', error: String(error), sourceMatch: 'none' });
        notifyError(error, 'Source verification');
      }
    },
    [build.source, notify, notifyError, services.apiBaseUrl, store]
  );

  const applyConfig = useCallback(async () => {
    if (!services.builder || !services.submit) return;
    const steps = buildConfigTxs(services.builder, config);
    setBusy('config');
    try {
      for (const step of steps) {
        const { txid } = await services.submit(step.tx);
        notify({ kind: 'info', title: step.label, body: txid });
        if (services.waitConfirm) await services.waitConfirm(txid);
      }
      notify({ kind: 'success', title: 'Collection configured', body: `${steps.length} transactions applied.` });
    } catch (error) {
      notifyError(error, 'Configuration');
    } finally {
      setBusy(null);
    }
  }, [config, notify, notifyError, services]);

  return (
    <div>
      <section className="card">
        <h2>Collection identity</h2>
        <div className="grid-2">
          <div className="field">
            <label htmlFor="c-name">Name</label>
            <input
              id="c-name"
              type="text"
              value={draft.name}
              maxLength={64}
              onChange={(e) => store.updateDraft({ name: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="c-symbol">Symbol</label>
            <input
              id="c-symbol"
              type="text"
              value={draft.symbol}
              maxLength={16}
              onChange={(e) => store.updateDraft({ symbol: e.target.value })}
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="c-desc">Description</label>
          <textarea
            id="c-desc"
            value={draft.description}
            maxLength={256}
            onChange={(e) => store.updateDraft({ description: e.target.value })}
          />
        </div>
        <div className="grid-2">
          <div className="field">
            <label htmlFor="c-art">Artwork URI</label>
            <input
              id="c-art"
              type="text"
              value={draft.artworkUri}
              maxLength={256}
              onChange={(e) => store.updateDraft({ artworkUri: e.target.value })}
            />
            <span className="hint">Collection-level cover art. Printable ASCII only.</span>
          </div>
          <div className="field">
            <label htmlFor="c-base">Base URI</label>
            <input
              id="c-base"
              type="text"
              value={draft.baseUri}
              maxLength={256}
              onChange={(e) => store.updateDraft({ baseUri: e.target.value })}
            />
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Supply</h2>
        <fieldset>
          <legend>Supply mode</legend>
          {SUPPLY_MODES.map((mode) => (
            <div className="field" key={mode.value}>
              <label>
                <input
                  type="radio"
                  name="supply-mode"
                  value={mode.value}
                  checked={draft.supplyMode === mode.value}
                  onChange={() =>
                    store.updateDraft({
                      supplyMode: mode.value,
                      maxSupply: mode.value === 'fixed' ? draft.maxSupply || 1 : 0
                    })
                  }
                />{' '}
                {mode.label}
              </label>
              <span className="hint">{mode.hint}</span>
            </div>
          ))}
        </fieldset>
        <div className="grid-2">
          <div className="field">
            <label htmlFor="c-max">Max supply</label>
            <input
              id="c-max"
              type="number"
              min={0}
              value={draft.maxSupply}
              disabled={draft.supplyMode !== 'fixed'}
              onChange={(e) => store.updateDraft({ maxSupply: Number(e.target.value) })}
            />
          </div>
          <div className="field">
            <label htmlFor="c-expiry">Reservation expiry (blocks)</label>
            <input
              id="c-expiry"
              type="number"
              min={1}
              value={draft.reservationExpiryBlocks}
              onChange={(e) => store.updateDraft({ reservationExpiryBlocks: Number(e.target.value) })}
            />
            <span className="hint">
              After this many blocks anyone may release an abandoned reservation and its index
              returns to the free list.
            </span>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Deploy</h2>
        <div className="field">
          <label htmlFor="c-contract">Contract name</label>
          <input
            id="c-contract"
            type="text"
            value={deploy.contractName}
            onChange={(e) => store.setContractName(e.target.value)}
            aria-invalid={nameError !== null}
            aria-describedby="c-contract-hint"
          />
          <span id="c-contract-hint" className={nameError ? 'error' : 'hint'}>
            {nameError ??
              'Deployed contracts are immutable — names are versioned, e.g. my-collection-v1.'}
          </span>
        </div>

        {build.errors.length > 0 ? (
          <div className="banner banner--danger" role="alert">
            <div>
              <strong>The contract source cannot be built.</strong>
              <ul>
                {build.errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="muted">
            Source ready · sha256 <code>{sourceHash(build.source).slice(0, 24)}…</code> ·{' '}
            {build.source.length.toLocaleString()} bytes · Clarity 3
          </p>
        )}
        {build.warnings.map((warning) => (
          <div className="banner banner--warn" key={warning}>
            <p>{warning}</p>
          </div>
        ))}

        <details>
          <summary>Preview the exact source that will be deployed</summary>
          <pre className="mono table-scroll" style={{ maxHeight: '320px', overflow: 'auto' }}>
            {build.source.split('\n').slice(0, 160).join('\n')}
          </pre>
        </details>

        <div className="row" style={{ marginTop: '12px' }}>
          <button
            type="button"
            className="btn btn--primary"
            disabled={
              !services.canSign ||
              busy !== null ||
              build.errors.length > 0 ||
              nameError !== null ||
              deploy.status === 'verified'
            }
            onClick={() => void onDeploy()}
          >
            {busy === 'deploy' ? 'Deploying…' : 'Deploy collection contract'}
          </button>
          <button
            type="button"
            className="btn"
            disabled={!contractId || busy !== null}
            onClick={() => contractId && void verifySource(contractId)}
          >
            Verify deployed source
          </button>
          <span className="muted">Status: {deploy.status}</span>
        </div>

        {deploy.contractId ? (
          <p className="mono muted">{deploy.contractId}</p>
        ) : null}
        {deploy.sourceMatch === 'normalized' ? (
          <div className="banner banner--warn">
            <p>
              The deployed source matches only after whitespace normalization. The logic is
              identical; the wallet reformatted the file.
            </p>
          </div>
        ) : null}
        {deploy.error ? (
          <div className="banner banner--danger" role="alert">
            <p>{deploy.error}</p>
          </div>
        ) : null}
      </section>

      <section className="card">
        <h2>Phases, pricing and splits</h2>
        <p className="muted">
          Applied after the deploy, as ordinary admin transactions. Unpausing is always last, so the
          collection is never open while half-configured.
        </p>

        <div className="row">
          <button
            type="button"
            className="btn btn--sm"
            onClick={() =>
              setConfig((current) => ({ ...current, phases: [creatorOnlyPhase()], activePhaseId: 1 }))
            }
          >
            Preset: creator only
          </button>
          <button
            type="button"
            className="btn btn--sm"
            onClick={() =>
              setConfig((current) => ({
                ...current,
                phases: [
                  creatorOnlyPhase(),
                  publicMintPhase({ mintPriceMicroStx: stxToMicro(priceText), maxPerWallet: 5 })
                ],
                activePhaseId: 1
              }))
            }
          >
            Preset: creator only + public
          </button>
        </div>

        <div className="grid-2" style={{ marginTop: '12px' }}>
          <div className="field">
            <label htmlFor="c-price">Public mint price (STX)</label>
            <input
              id="c-price"
              type="text"
              inputMode="decimal"
              value={priceText}
              onChange={(e) => setPriceText(e.target.value)}
            />
            <span className="hint">{microToStx(stxToMicro(priceText))}</span>
          </div>
          <div className="field">
            <label htmlFor="c-active">Active phase</label>
            <select
              id="c-active"
              value={config.activePhaseId}
              onChange={(e) => setConfig((c) => ({ ...c, activePhaseId: Number(e.target.value) }))}
            >
              <option value={0}>None (collection defaults)</option>
              {config.phases.map((phase) => (
                <option key={phase.phaseId} value={phase.phaseId}>
                  {phase.phaseId} — {phase.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-scroll">
          <table>
            <caption className="visually-hidden">Configured phases</caption>
            <thead>
              <tr>
                <th>#</th>
                <th>Label</th>
                <th>Price</th>
                <th>Per wallet</th>
                <th>Allowlist</th>
              </tr>
            </thead>
            <tbody>
              {config.phases.map((phase) => (
                <tr key={phase.phaseId}>
                  <td className="mono">{phase.phaseId}</td>
                  <td>{phase.label}</td>
                  <td>{microToStx(phase.mintPriceMicroStx)}</td>
                  <td>{phase.maxPerWallet === 0 ? 'unlimited' : phase.maxPerWallet}</td>
                  <td className="mono">{phase.allowlistMode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <fieldset style={{ marginTop: '16px' }}>
          <legend>Payout splits (basis points, ≤ 10000 total)</legend>
          <div className="grid-2">
            {(['artistBps', 'marketplaceBps', 'operatorBps'] as const).map((key) => (
              <div className="field" key={key}>
                <label htmlFor={`c-${key}`}>{key.replace('Bps', '')}</label>
                <input
                  id={`c-${key}`}
                  type="number"
                  min={0}
                  max={10000}
                  value={config.splits?.[key] ?? 0}
                  onChange={(e) =>
                    setConfig((c) =>
                      c.splits ? { ...c, splits: { ...c.splits, [key]: Number(e.target.value) } } : c
                    )
                  }
                />
              </div>
            ))}
          </div>
        </fieldset>

        {configErrors.length > 0 ? (
          <div className="banner banner--danger" role="alert">
            <ul>
              {configErrors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <button
          type="button"
          className="btn"
          disabled={
            !services.canSign ||
            busy !== null ||
            configErrors.length > 0 ||
            deploy.status !== 'verified'
          }
          onClick={() => void applyConfig()}
        >
          {busy === 'config' ? 'Applying…' : 'Apply configuration'}
        </button>
        {deploy.status !== 'verified' ? (
          <p className="hint">Verify the deployed source before configuring.</p>
        ) : null}
      </section>

      <div className="row spread">
        <span />
        <button type="button" className="btn btn--primary" onClick={() => store.setStep('import')}>
          Next: import files
        </button>
      </div>
    </div>
  );
};
