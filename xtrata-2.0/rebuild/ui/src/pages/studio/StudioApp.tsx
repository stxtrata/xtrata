import { useEffect, useMemo, useSyncExternalStore } from 'react';
import {
  CollectionReads,
  CollectionTxBuilder,
  flatFeeSchedule,
  type ChainObserver,
  type FeeSchedule
} from '@xtrata/collections-client';
import { Layout } from '../../shell/Layout';
import { useWallet } from '../../shell/WalletContext';
import { useCanSign } from '../../shell/NetworkGuardBanner';
import { loadConfig } from '../../config';
import { createBlockHeightReader, createReadOnlyTransport } from '../../services/transport';
import { createSubmitService } from '../../services/submit';
import { createWaitConfirm } from '../../services/waitConfirm';
import { createDeployService } from '../../services/deploy';
import { fetchTxStatus } from '../../services/waitConfirm';
import { StudioServicesContext, type StudioServices } from './services';
import { StudioStoreContext, useStudioState } from './useStudioStore';
import {
  makeExecutorFactory,
  StudioStore,
  STUDIO_STEPS,
  type StudioState,
  type StudioStep
} from './store';
import { SetupStep } from './steps/SetupStep';
import { ImportStep } from './steps/ImportStep';
import { PlanStep } from './steps/PlanStep';
import { RunStep } from './steps/RunStep';
import { CompleteStep } from './steps/CompleteStep';

const STEP_LABELS: Record<StudioStep, string> = {
  setup: '1. Collection',
  import: '2. Files',
  plan: '3. Plan',
  run: '4. Run',
  complete: '5. Report'
};

/** Any valid principal works as the read-only `sender`. */
const READ_ONLY_SENDER: Record<'mainnet' | 'testnet', string> = {
  mainnet: 'SP000000000000000000002Q6VF78',
  testnet: 'ST000000000000000000002AMW42H'
};

const ZERO_FEES: FeeSchedule = flatFeeSchedule({
  beginFee: 0n,
  perChunkFee: 0n,
  sealBaseFee: 0n
});

/**
 * Subscribe to a store instance we hold directly — the context provider that
 * `useStudioState` reads is only established further down the tree.
 */
const useStudioStateOf = (store: StudioStore): StudioState =>
  useSyncExternalStore(store.subscribe, store.getState, store.getState);

const StepBody = (): JSX.Element => {
  const state = useStudioState();
  switch (state.step) {
    case 'setup':
      return <SetupStep />;
    case 'import':
      return <ImportStep />;
    case 'plan':
      return <PlanStep />;
    case 'run':
      return <RunStep />;
    case 'complete':
      return <CompleteStep />;
  }
};

const StepNav = ({ store }: { store: StudioStore }): JSX.Element => {
  const state = useStudioState();
  return (
    <ul className="steps">
      {STUDIO_STEPS.map((step) => (
        <li key={step}>
          <button
            type="button"
            {...(state.step === step ? { 'aria-current': 'step' as const } : {})}
            onClick={() => store.setStep(step)}
          >
            {STEP_LABELS[step]}
          </button>
        </li>
      ))}
    </ul>
  );
};

/**
 * Wires the Studio store to the wallet and the chain.
 *
 * The store is built once and outlives connect/disconnect; the wallet-dependent
 * seam (submit, observer, executor factory) is late-bound whenever the session
 * or the deployed collection id changes. That keeps the setup and import steps
 * usable with no wallet at all, and means "connect a wallet" never resets the
 * work already done.
 */
export const StudioApp = (): JSX.Element => {
  const config = loadConfig();
  const { address } = useWallet();
  const canSign = useCanSign();

  const store = useMemo(
    () =>
      new StudioStore({
        coreContractId: config.coreContractId,
        dropsContractId: config.dropsContractId,
        network: config.networkName
      }),
    [config.coreContractId, config.dropsContractId, config.networkName]
  );

  const state = useStudioStateOf(store);
  const collectionId = state.deploy.contractId ?? null;
  const fees = state.fees ?? ZERO_FEES;

  const transport = useMemo(
    () =>
      createReadOnlyTransport({
        apiBaseUrl: config.apiBaseUrl,
        senderAddress: address ?? READ_ONLY_SENDER[config.network]
      }),
    [address, config.apiBaseUrl, config.network]
  );

  const waitConfirm = useMemo(
    () => createWaitConfirm({ apiBaseUrl: config.apiBaseUrl }),
    [config.apiBaseUrl]
  );

  const builder = useMemo(() => {
    if (!address || !collectionId) return undefined;
    try {
      return new CollectionTxBuilder({
        collectionContractId: collectionId,
        coreContractId: config.coreContractId,
        network: config.networkName,
        sender: address,
        fees
      });
    } catch {
      // Wrong-network or malformed ids are surfaced by the guard banner.
      return undefined;
    }
  }, [address, collectionId, config.coreContractId, config.networkName, fees]);

  const services = useMemo<StudioServices>(() => {
    const base: StudioServices = {
      apiBaseUrl: config.apiBaseUrl,
      network: config.network,
      coreContractId: config.coreContractId,
      dropsContractId: config.dropsContractId,
      canSign,
      transport,
      waitConfirm,
      deploy: createDeployService(),
      ...(address !== undefined ? { address } : {}),
      ...(builder !== undefined ? { builder } : {})
    };
    if (!address || !canSign) return base;
    return { ...base, submit: createSubmitService({ stxAddress: address }) };
  }, [address, builder, canSign, config, transport, waitConfirm]);

  useEffect(() => {
    if (!address || !canSign || !collectionId || !builder || !services.submit) {
      store.bindChain({});
      return;
    }
    const getBlockHeight = createBlockHeightReader({
      apiBaseUrl: config.apiBaseUrl,
      senderAddress: address
    });
    const reads = new CollectionReads({
      collectionContractId: collectionId,
      coreContractId: config.coreContractId,
      transport,
      getBlockHeight
    });
    const observer: ChainObserver = {
      observeItem: (owner, hash) => reads.observeItem(owner, hash),
      getTxStatus: (txid) => fetchTxStatus({ apiBaseUrl: config.apiBaseUrl }, txid),
      getBlockHeight
    };
    store.bindChain({
      effects: { observer, submit: services.submit, waitConfirm },
      createExecutor: makeExecutorFactory({ owner: address, builder, concurrency: 1 })
    });
  }, [address, builder, canSign, collectionId, config, services.submit, store, transport, waitConfirm]);

  return (
    <Layout page="studio" title="Collection Studio">
      <StudioStoreContext.Provider value={store}>
        <StudioServicesContext.Provider value={services}>
          <StepNav store={store} />
          <StepBody />
        </StudioServicesContext.Provider>
      </StudioStoreContext.Provider>
    </Layout>
  );
};
