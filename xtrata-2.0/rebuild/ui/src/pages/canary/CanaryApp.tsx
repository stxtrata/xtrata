import { useCallback, useEffect, useMemo, useState } from 'react';
import { Layout } from '../../shell/Layout';
import { useWallet } from '../../shell/WalletContext';
import { useCanSign } from '../../shell/NetworkGuardBanner';
import { useToasts } from '../../shell/ToastContext';
import { loadConfig } from '../../config';
import { createBlockHeightReader, createReadOnlyTransport } from '../../services/transport';
import { createSubmitService } from '../../services/submit';
import { createWaitConfirm } from '../../services/waitConfirm';
import { createDeployService } from '../../services/deploy';
import {
  DEFAULT_COLLECTION_CONTRACT_NAME,
  DEFAULT_DROPS_CONTRACT_NAME,
  relayerBaseUrlFromEnv,
  type CanaryDeployConfig
} from './config';
import { IMMUTABILITY_ACKNOWLEDGMENT, PRODUCTION_APPROVAL_PHRASE } from './arming';
import { buildCanaryReport, downloadReport } from './report';
import { createRunners, type CanaryServices } from './runners';
import { ATTESTED_COMMANDS, STAGE_DEFINITIONS, type StageId } from './stages';
import { CanaryStore } from './store';
import { StageCard } from './StageCard';
import { TypedConfirm } from './TypedConfirm';
import { CanaryStoreContext, useCanary, useCanaryState } from './useCanaryStore';
import './canary.css';

/** Any valid principal works as the read-only `sender` (same as the Studio). */
const READ_ONLY_SENDER: Record<'mainnet' | 'testnet', string> = {
  mainnet: 'SP000000000000000000002Q6VF78',
  testnet: 'ST000000000000000000002AMW42H'
};

// --- stage-specific controls ----------------------------------------------

const AttestForm = ({
  stage,
  commands,
  disabled,
  onAttest
}: {
  stage: StageId;
  commands: string[];
  disabled: boolean;
  onAttest: (attestation: {
    commands: string[];
    output: string;
    outcome: 'passed' | 'failed';
    attestedBy: string;
  }) => void;
}): JSX.Element => {
  const [output, setOutput] = useState('');
  const [attestedBy, setAttestedBy] = useState('');
  const [outcome, setOutcome] = useState<'passed' | 'failed'>('passed');

  return (
    <div className="canary-attest">
      <p className="canary-attest__note">
        This browser cannot run these commands. Whatever you record here is an{' '}
        <strong>attestation</strong>, and the report says so wherever this stage appears.
      </p>
      <div className="field">
        <label htmlFor={`${stage}-output`}>Paste the command output</label>
        <textarea
          id={`${stage}-output`}
          className="mono"
          rows={6}
          value={output}
          onChange={(event) => setOutput(event.target.value)}
        />
      </div>
      <div className="grid-2">
        <div className="field">
          <label htmlFor={`${stage}-by`}>Attested by</label>
          <input
            id={`${stage}-by`}
            type="text"
            value={attestedBy}
            onChange={(event) => setAttestedBy(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor={`${stage}-outcome`}>Outcome</label>
          <select
            id={`${stage}-outcome`}
            value={outcome}
            onChange={(event) => setOutcome(event.target.value === 'failed' ? 'failed' : 'passed')}
          >
            <option value="passed">All checks passed</option>
            <option value="failed">Something failed</option>
          </select>
        </div>
      </div>
      <div className="row">
        <button
          type="button"
          className="btn btn--primary"
          disabled={disabled || output.trim().length === 0 || attestedBy.trim().length === 0}
          onClick={() => onAttest({ commands, output, outcome, attestedBy })}
        >
          Record attestation
        </button>
      </div>
    </div>
  );
};

const SkipForm = ({
  stage,
  disabled,
  onSkip
}: {
  stage: StageId;
  disabled: boolean;
  onSkip: (reason: string) => void;
}): JSX.Element => {
  const [reason, setReason] = useState('');
  return (
    <div className="field canary-skip">
      <label htmlFor={`${stage}-skip`}>Skip this stage — the reason is recorded in the report</label>
      <input
        id={`${stage}-skip`}
        type="text"
        value={reason}
        onChange={(event) => setReason(event.target.value)}
      />
      <div className="row">
        <button
          type="button"
          className="btn btn--ghost"
          disabled={disabled || reason.trim().length === 0}
          onClick={() => onSkip(reason)}
        >
          Skip with this reason
        </button>
      </div>
    </div>
  );
};

const ApprovalForm = ({
  disabled,
  onApprove
}: {
  disabled: boolean;
  onApprove: (params: { phrase: string; acknowledged: boolean; approvedBy: string }) => void;
}): JSX.Element => {
  const [acknowledged, setAcknowledged] = useState(false);
  const [approvedBy, setApprovedBy] = useState('');

  return (
    <div className="canary-approval">
      <label className="canary-approval__ack">
        <input
          type="checkbox"
          checked={acknowledged}
          onChange={(event) => setAcknowledged(event.target.checked)}
        />
        <span>{IMMUTABILITY_ACKNOWLEDGMENT}</span>
      </label>
      <div className="field">
        <label htmlFor="approval-by">Approved by</label>
        <input
          id="approval-by"
          type="text"
          value={approvedBy}
          onChange={(event) => setApprovedBy(event.target.value)}
        />
      </div>
      <TypedConfirm
        title="Approve production deployment"
        phrase={PRODUCTION_APPROVAL_PHRASE}
        irreversible
        confirmLabel="Grant production approval"
        details={[
          { label: 'Effect', value: 'Unlocks stage 13 — mainnet deployment', tone: 'warn' },
          {
            label: 'Prerequisites',
            value: 'Acknowledge immutability and name yourself before the phrase can be confirmed',
            tone: 'muted'
          }
        ]}
        onConfirm={() =>
          onApprove({ phrase: PRODUCTION_APPROVAL_PHRASE, acknowledged, approvedBy })
        }
      />
      {!acknowledged || approvedBy.trim().length === 0 ? (
        <p className="canary-approval__blocked" role="status">
          Tick the acknowledgment and name yourself — approval is refused without both.
        </p>
      ) : null}
      {disabled ? <p className="canary-approval__blocked">This gate is locked.</p> : null}
    </div>
  );
};

// --- the page -------------------------------------------------------------

const CanaryBody = ({ services }: { services: CanaryServices }): JSX.Element => {
  const state = useCanaryState();
  const { notifyError, notify } = useToasts();
  const store = useCanary();
  const runners = useMemo(() => createRunners(services), [services]);

  const run = useCallback(
    (id: StageId) => {
      const runner = runners[id];
      if (!runner) return;
      void store.runStage(id, runner).catch((error: unknown) => notifyError(error, `Stage ${id}`));
    },
    [notifyError, runners, store]
  );

  const guarded = useCallback(
    (action: () => void, context: string) => {
      try {
        action();
      } catch (error) {
        notifyError(error, context);
      }
    },
    [notifyError]
  );

  const report = useMemo(() => buildCanaryReport(state), [state]);
  const pending = state.pendingConfirmation;

  return (
    <>
      <section className="card canary-summary">
        <div className="spread">
          <div>
            <strong>
              {report.totals.passed} passed · {report.totals.failed} failed ·{' '}
              {report.totals.skipped} skipped · {report.totals.pending} not run
            </strong>
            <p className="muted">
              Target network <code>{state.config.network}</code>, deployer{' '}
              <code className="mono">{state.config.deployerAddress || '(not connected)'}</code>.{' '}
              {report.totals.operatorAttested} stage(s) rest on an operator attestation rather than
              machine evidence.
            </p>
          </div>
          <div className="row">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => downloadReport(report, 'json')}
            >
              Download report (JSON)
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => downloadReport(report, 'md')}
            >
              Download report (Markdown)
            </button>
          </div>
        </div>
      </section>

      {STAGE_DEFINITIONS.map((definition) => {
        const stage = state.stages[definition.id];
        const gate = store.gate(definition.id);
        const canStart = store.canStart(definition.id);
        const hasRunner = runners[definition.id] !== undefined;
        const isPendingHere = pending?.stage === definition.id;

        return (
          <StageCard key={definition.id} definition={definition} stage={stage} gate={gate}>
            {definition.verification === 'attested' ? (
              <AttestForm
                stage={definition.id}
                commands={ATTESTED_COMMANDS[definition.id] ?? []}
                disabled={!gate.open}
                onAttest={(attestation) =>
                  guarded(
                    () => store.attest(definition.id, attestation),
                    `Stage ${definition.number}`
                  )
                }
              />
            ) : null}

            {definition.id === 'review' ? (
              <div className="field">
                <label htmlFor="review-notes">Review notes (captured in the report)</label>
                <textarea
                  id="review-notes"
                  rows={4}
                  value={state.reviewNotes}
                  onChange={(event) => store.setReviewNotes(event.target.value)}
                />
              </div>
            ) : null}

            {definition.id === 'production-approval' ? (
              <ApprovalForm
                disabled={!gate.open}
                onApprove={({ phrase, acknowledged, approvedBy }) =>
                  guarded(() => {
                    store.approveProduction({
                      phrase,
                      expectedPhrase: PRODUCTION_APPROVAL_PHRASE,
                      acknowledgedImmutability: acknowledged,
                      approvedBy
                    });
                    notify({
                      kind: 'warn',
                      title: 'Production approved',
                      body: 'Stage 13 is now unlocked. Every deployment still needs its own typed confirmation.'
                    });
                  }, `Stage ${definition.number}`)
                }
              />
            ) : null}

            {isPendingHere && pending ? (
              <TypedConfirm
                title={pending.title}
                phrase={pending.phrase}
                details={pending.details}
                irreversible={pending.irreversible}
                confirmLabel="Deploy now"
                onConfirm={() => store.confirmPending(pending.id)}
                onCancel={() => store.cancelPending(pending.id)}
              />
            ) : null}

            <div className="row canary-stage__actions">
              {hasRunner ? (
                <button
                  type="button"
                  className="btn btn--primary"
                  disabled={!canStart}
                  onClick={() => run(definition.id)}
                >
                  {stage.status === 'pending' ? 'Run stage' : 'Re-run stage'}
                </button>
              ) : null}
              {stage.status !== 'pending' ? (
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => store.resetFrom(definition.id)}
                >
                  Reset from here
                </button>
              ) : null}
            </div>

            {definition.skippable ? (
              <SkipForm
                stage={definition.id}
                disabled={!gate.open}
                onSkip={(reason) =>
                  guarded(
                    () => store.skipStage(definition.id, reason),
                    `Stage ${definition.number}`
                  )
                }
              />
            ) : null}
          </StageCard>
        );
      })}
    </>
  );
};

export const CanaryApp = (): JSX.Element => {
  const config = loadConfig();
  const { address, walletNetwork } = useWallet();
  const canSign = useCanSign();

  const deployConfig = useMemo<CanaryDeployConfig>(
    () => ({
      network: config.network,
      deployerAddress: address ?? '',
      apiBaseUrl: config.apiBaseUrl,
      coreContractId: config.coreContractId,
      dropsContractName: DEFAULT_DROPS_CONTRACT_NAME,
      collectionContractName: DEFAULT_COLLECTION_CONTRACT_NAME,
      relayerBaseUrl: relayerBaseUrlFromEnv()
    }),
    [address, config.apiBaseUrl, config.coreContractId, config.network]
  );

  // Built once and outlives connect/disconnect, like the Studio's store: a
  // wallet reconnect must never discard a run that is already under way.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const store = useMemo(() => new CanaryStore({ config: deployConfig }), []);

  useEffect(() => {
    if (store.getState().config.deployerAddress !== deployConfig.deployerAddress) {
      store.updateConfig({ deployerAddress: deployConfig.deployerAddress });
    }
  }, [deployConfig.deployerAddress, store]);

  const transport = useMemo(
    () =>
      createReadOnlyTransport({
        apiBaseUrl: config.apiBaseUrl,
        senderAddress: address ?? READ_ONLY_SENDER[config.network]
      }),
    [address, config.apiBaseUrl, config.network]
  );

  const services = useMemo<CanaryServices>(() => {
    const base: CanaryServices = {
      apiBaseUrl: config.apiBaseUrl,
      appNetwork: config.network,
      networkName: config.networkName,
      walletNetwork,
      canSign,
      transport,
      getBlockHeight: createBlockHeightReader({
        apiBaseUrl: config.apiBaseUrl,
        senderAddress: address ?? READ_ONLY_SENDER[config.network]
      }),
      waitConfirm: createWaitConfirm({ apiBaseUrl: config.apiBaseUrl }),
      deploy: createDeployService(),
      ...(address !== undefined ? { address } : {})
    };
    if (!address || !canSign) return base;
    return { ...base, submit: createSubmitService({ stxAddress: address }) };
  }, [address, canSign, config, transport, walletNetwork]);

  return (
    <Layout page="canary" title="Deployment Canary">
      <CanaryStoreContext.Provider value={store}>
        <CanaryBody services={services} />
      </CanaryStoreContext.Provider>
    </Layout>
  );
};
