import { useMemo } from 'react';
import {
  CollectionReads,
  DropsReads,
  DropsTxBuilder
} from '@xtrata/collections-client';
import { Layout } from '../../shell/Layout';
import { useWallet } from '../../shell/WalletContext';
import { useCanSign } from '../../shell/NetworkGuardBanner';
import { loadConfig } from '../../config';
import {
  createBlockHeightReader,
  createNonceReader,
  createReadOnlyTransport
} from '../../services/transport';
import { createSubmitService } from '../../services/submit';
import { createWaitConfirm } from '../../services/waitConfirm';
import { RelayerClient } from './relayer';
import { createSponsoredSigner, DropsServicesContext, type DropsServices } from './services';
import { DropsStoreContext, useDropsState, useDropsStateOf } from './useDropsStore';
import { BUILDER_STEPS, DropsBuilderStore, type BuilderStep } from './store';
import { CollectionStep } from './steps/CollectionStep';
import { InventoryStep } from './steps/InventoryStep';
import { ModeStep } from './steps/ModeStep';
import { TimingStep } from './steps/TimingStep';
import { CostsStep } from './steps/CostsStep';
import { ActivateStep } from './steps/ActivateStep';
import { MonitorStep } from './steps/MonitorStep';
import { ClaimPage } from './ClaimPage';

const STEP_LABELS: Record<BuilderStep, string> = {
  collection: '1. Collection',
  inventory: '2. Inventory',
  mode: '3. Mode',
  timing: '4. Timing',
  costs: '5. Costs',
  activate: '6. Activate',
  monitor: '7. Dashboard'
};

/** Any valid principal works as the read-only `sender`. */
const READ_ONLY_SENDER: Record<'mainnet' | 'testnet', string> = {
  mainnet: 'SP000000000000000000002Q6VF78',
  testnet: 'ST000000000000000000002AMW42H'
};

export interface DropsRoute {
  view: 'builder' | 'claim';
  /** Claim view target. */
  dropId: number | null;
  /** Studio handoff. */
  collectionId: string | null;
}

/**
 * One entry, two audiences. `?drop=<id>` (or `?view=claim`) is the collector's
 * claim page; anything else is the creator's builder. `?collection=<id>` is
 * the Collection Studio handoff and pre-fills step 1.
 */
export const parseRoute = (href: string): DropsRoute => {
  let params: URLSearchParams;
  try {
    params = new URL(href).searchParams;
  } catch {
    return { view: 'builder', dropId: null, collectionId: null };
  }
  const raw = params.get('drop');
  const dropId = raw !== null && /^\d+$/.test(raw) ? Number(raw) : null;
  const view = params.get('view') === 'claim' || dropId !== null ? 'claim' : 'builder';
  return { view, dropId, collectionId: params.get('collection') };
};

const StepBody = (): JSX.Element => {
  const state = useDropsState();
  switch (state.step) {
    case 'collection':
      return <CollectionStep />;
    case 'inventory':
      return <InventoryStep />;
    case 'mode':
      return <ModeStep />;
    case 'timing':
      return <TimingStep />;
    case 'costs':
      return <CostsStep />;
    case 'activate':
      return <ActivateStep />;
    case 'monitor':
      return <MonitorStep />;
  }
};

const StepNav = ({ store }: { store: DropsBuilderStore }): JSX.Element => {
  const state = useDropsState();
  return (
    <ul className="steps">
      {BUILDER_STEPS.map((step) => (
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
 * Wires the drops store, the read clients and the wallet together.
 *
 * Same discipline as the Studio: the store is built once and outlives
 * connect/disconnect, and everything wallet-dependent is late-bound, so the
 * read-only screens (pick a collection, resolve inventory, price the drop)
 * work before a wallet exists and connecting one never discards that work.
 */
export const DropsApp = ({ route }: { route: DropsRoute }): JSX.Element => {
  const config = loadConfig();
  const { address } = useWallet();
  const canSign = useCanSign();

  const store = useMemo(
    () =>
      new DropsBuilderStore(
        {
          dropsContractId: config.dropsContractId,
          coreContractId: config.coreContractId,
          network: config.networkName
        },
        route.collectionId ? { collectionId: route.collectionId } : {}
      ),
    [config.coreContractId, config.dropsContractId, config.networkName, route.collectionId]
  );

  const state = useDropsStateOf(store);
  const collectionId = state.collectionId;

  const transport = useMemo(
    () =>
      createReadOnlyTransport({
        apiBaseUrl: config.apiBaseUrl,
        senderAddress: address ?? READ_ONLY_SENDER[config.network]
      }),
    [address, config.apiBaseUrl, config.network]
  );

  const getBlockHeight = useMemo(
    () =>
      createBlockHeightReader({
        apiBaseUrl: config.apiBaseUrl,
        senderAddress: address ?? READ_ONLY_SENDER[config.network]
      }),
    [address, config.apiBaseUrl, config.network]
  );

  const waitConfirm = useMemo(
    () => createWaitConfirm({ apiBaseUrl: config.apiBaseUrl }),
    [config.apiBaseUrl]
  );

  const dropsReads = useMemo(
    () => new DropsReads({ dropsContractId: config.dropsContractId, transport }),
    [config.dropsContractId, transport]
  );

  const collectionReads = useMemo(() => {
    if (!collectionId || !collectionId.includes('.')) return undefined;
    try {
      return new CollectionReads({
        collectionContractId: collectionId,
        coreContractId: config.coreContractId,
        transport,
        getBlockHeight
      });
    } catch {
      // Malformed or wrong-network ids surface on the step itself.
      return undefined;
    }
  }, [collectionId, config.coreContractId, getBlockHeight, transport]);

  const builder = useMemo(() => {
    if (!address || !collectionId || !collectionId.includes('.')) return undefined;
    try {
      return new DropsTxBuilder({
        dropsContractId: config.dropsContractId,
        collectionContractId: collectionId,
        nftContractId: config.coreContractId,
        network: config.networkName,
        sender: address
      });
    } catch {
      return undefined;
    }
  }, [address, collectionId, config.coreContractId, config.dropsContractId, config.networkName]);

  const relayer = useMemo(
    () => (config.relayerBaseUrl ? new RelayerClient({ baseUrl: config.relayerBaseUrl }) : undefined),
    [config.relayerBaseUrl]
  );

  const services = useMemo<DropsServices>(() => {
    const base: DropsServices = {
      apiBaseUrl: config.apiBaseUrl,
      network: config.network,
      coreContractId: config.coreContractId,
      dropsContractId: config.dropsContractId,
      relayerBaseUrl: config.relayerBaseUrl,
      canSign,
      transport,
      dropsReads,
      waitConfirm,
      getBlockHeight,
      getNonce: createNonceReader({
        apiBaseUrl: config.apiBaseUrl,
        senderAddress: address ?? READ_ONLY_SENDER[config.network]
      }),
      ...(address !== undefined ? { address } : {}),
      ...(collectionReads !== undefined ? { collectionReads } : {}),
      ...(builder !== undefined ? { builder } : {}),
      ...(relayer !== undefined ? { relayer } : {})
    };
    if (!address || !canSign) return base;
    return {
      ...base,
      submit: createSubmitService({ stxAddress: address }),
      signSponsored: createSponsoredSigner({})
    };
  }, [
    address,
    builder,
    canSign,
    collectionReads,
    config,
    dropsReads,
    getBlockHeight,
    relayer,
    transport,
    waitConfirm
  ]);

  /**
   * Bound during render, not in an effect.
   *
   * Child effects run BEFORE parent effects, so a step that loads something on
   * mount (the Studio handoff auto-loading its collection) would otherwise run
   * against a store whose read clients were not attached yet and fail with
   * "no collection is loaded". `bindChain` only swaps dependency references —
   * it touches no state and notifies no subscriber — so calling it here is
   * safe and removes the ordering race entirely.
   */
  useMemo(() => {
    store.bindChain({
      dropsReads,
      getBlockHeight,
      ...(address !== undefined ? { address } : {}),
      ...(collectionReads !== undefined ? { collectionReads } : {}),
      ...(builder !== undefined ? { builder } : {}),
      ...(services.submit !== undefined ? { submit: services.submit } : {}),
      waitConfirm
    });
  }, [address, builder, collectionReads, dropsReads, getBlockHeight, services.submit, store, waitConfirm]);

  if (route.view === 'claim') {
    return (
      <Layout page="drops" title={route.dropId === null ? 'Claim' : `Claim — drop #${route.dropId}`}>
        <DropsServicesContext.Provider value={services}>
          {route.dropId === null ? (
            <div className="banner banner--info">
              <p>
                No drop selected. Open a claim link, or add <code>?drop=&lt;id&gt;</code> to this URL.
              </p>
            </div>
          ) : (
            <ClaimPage dropId={route.dropId} />
          )}
        </DropsServicesContext.Provider>
      </Layout>
    );
  }

  return (
    <Layout page="drops" title="Drop Builder">
      <DropsStoreContext.Provider value={store}>
        <DropsServicesContext.Provider value={services}>
          <StepNav store={store} />
          <StepBody />
        </DropsServicesContext.Provider>
      </DropsStoreContext.Provider>
    </Layout>
  );
};
