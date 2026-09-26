import CollectionBuilder from './components/CollectionBuilder';
import CollectionStudioNav, { type StudioTaskId } from './components/CollectionStudioNav';
import CollectionInventoryPanel from './components/CollectionInventoryPanel';
import CreatorSessionBadge from './components/CreatorSessionBadge';
import ReservationsPanel from './components/ReservationsPanel';
import FileRetentionNotice from './components/FileRetentionNotice';
import StorageCleanupPanel from './components/StorageCleanupPanel';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode
} from 'react';
import {
  callReadOnlyFunction,
  ClarityType,
  cvToValue,
  type ClarityValue
} from '@stacks/transactions';
import CollectionListPanel from './components/CollectionListPanel';
import OwnerOversightPanel from './components/OwnerOversightPanel';
import DeployWizardPanel from './components/DeployWizardPanel';
import CollectionSettingsPanel from './components/CollectionSettingsPanel';
import AssetStagingPanel from './components/AssetStagingPanel';
import PublishOpsPanel from './components/PublishOpsPanel';
import DiagnosticsPanel from './components/DiagnosticsPanel';
import SdkToolkitPanel from './components/SdkToolkitPanel';
import InfoTooltip from './components/InfoTooltip';
import AddressLabel from '../components/AddressLabel';
import WalletTopBar from '../components/WalletTopBar';
import { isXtrataOwnerAddress } from '../config/manage';
import { hasCoverImageMetadata, resolveCollectionCoverImageUrl } from '../lib/collections/cover-image';
import { resolveCollectionMintPricingMetadata } from '../lib/collection-mint/pricing-metadata';
import { getNetworkFromAddress } from '../lib/network/guard';
import { toStacksNetwork } from '../lib/network/stacks';
import { useManageWallet } from './ManageWalletContext';
import { resolveCollectionContractLink } from './lib/contract-link';
import { isCollectionV15 } from '../../packages/xtrata-sdk/src/collection-v15';
import {
  collectInventoryHashes,
  computeInventoryDigest,
  isInventoryRegistrationCurrent,
  parseInventoryRegistrationRecord
} from './lib/inventory-registration';
import {
  deriveJourneyStepStates,
  getRecommendedJourneyStepId,
  JOURNEY_STATUS_LABELS,
  type JourneySignals,
  type JourneyStepId
} from './lib/journey';
import {
  parseManageJsonResponse,
  toManageApiErrorMessage
} from './lib/api-errors';

const PANEL_KEYS = [
  'sdk-toolkit',
  'collection-list',
  'owner-oversight',
  'deploy-wizard',
  'launch-controls',
  'collection-settings',
  'asset-staging',
  'publish-ops',
  'debug-tools'
] as const;

type PanelKey = (typeof PANEL_KEYS)[number];
type ExperienceMode = 'guided' | 'advanced';

type CollectionRecord = {
  id?: string | null;
  slug?: string | null;
  contract_address?: string | null;
  state?: string | null;
  metadata?: Record<string, unknown> | null;
};

type ManagedAsset = {
  state?: string | null;
  mime_type?: string | null;
};

type CollectionReadiness = {
  ready?: boolean;
  reason?: string | null;
  deployReady?: boolean;
};

type JourneySnapshot = {
  previewCover?: string | null;
  previewDescription?: string;
  loading: boolean;
  error: string | null;
  mintType: JourneySignals['mintType'];
  collectionState: string;
  activeAssetCount: number;
  deployPricingLockPresent: boolean;
  deployReady: boolean;
  deployPending: boolean;
  launchMintPriceConfigured: boolean;
  launchMaxSupplyConfigured: boolean;
  unpaused: boolean | null;
  hasLivePageCover: boolean;
  hasLivePageDescription: boolean;
  uploadReadinessReason: string | null;
  deployReadinessReason: string | null;
  inventoryRegistered: boolean | null;
  chainReadFailed: boolean;
  stagedFileCount: number;
};

/** A <details> that mounts its (heavy) content only once opened. */
function LazyDetails(props: { className?: string; summary: string; children: ReactNode }) {
  const [opened, setOpened] = useState(false);
  return (
    <details className={props.className} onToggle={(event) => { if ((event.currentTarget as HTMLDetailsElement).open) setOpened(true); }}>
      <summary>{props.summary}</summary>
      {opened ? props.children : null}
    </details>
  );
}

const MANAGE_PANEL_IDS: Record<PanelKey, string> = {
  'sdk-toolkit': 'manage-sdk-toolkit',
  'collection-list': 'manage-collection-list',
  'owner-oversight': 'manage-owner-oversight',
  'deploy-wizard': 'manage-deploy-wizard',
  'launch-controls': 'manage-launch-controls',
  'collection-settings': 'manage-collection-settings',
  'asset-staging': 'manage-asset-staging',
  'publish-ops': 'manage-publish-ops',
  'debug-tools': 'manage-debug-tools'
};

const INITIAL_JOURNEY_SNAPSHOT: JourneySnapshot = {
  loading: false,
  error: null,
  mintType: null,
  collectionState: 'draft',
  activeAssetCount: 0,
  deployPricingLockPresent: false,
  deployReady: false,
  deployPending: false,
  launchMintPriceConfigured: false,
  launchMaxSupplyConfigured: false,
  unpaused: null,
  hasLivePageCover: false,
  hasLivePageDescription: false,
  uploadReadinessReason: null,
  deployReadinessReason: null,
  inventoryRegistered: null,
  chainReadFailed: false,
  stagedFileCount: 0
};

const isActiveAssetState = (value: unknown) => {
  const state = String(value ?? '')
    .trim()
    .toLowerCase();
  return state !== 'expired' && state !== 'sold-out';
};

const isImageMimeType = (value: unknown) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .startsWith('image/');

const toRecord = (value: unknown) =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : null;

const toText = (value: unknown) =>
  typeof value === 'string' ? value.trim() : '';

const unwrapReadOnlyResponse = (value: ClarityValue) => {
  if (value.type === ClarityType.ResponseOk) {
    return value.value;
  }
  if (value.type === ClarityType.ResponseErr) {
    const parsed = cvToValue(value.value) as { value?: unknown } | unknown;
    const detail =
      typeof parsed === 'string'
        ? parsed
        : parsed &&
            typeof parsed === 'object' &&
            'value' in (parsed as Record<string, unknown>)
          ? (parsed as { value?: unknown }).value
          : 'Unknown contract error';
    throw new Error(String(detail));
  }
  return value;
};

const toClarityPrimitive = (value: ClarityValue): unknown => {
  const parsed = cvToValue(value) as unknown;
  if (
    parsed &&
    typeof parsed === 'object' &&
    'value' in (parsed as Record<string, unknown>)
  ) {
    return (parsed as { value: unknown }).value;
  }
  return parsed;
};

const parseUintPrimitive = (value: unknown): bigint | null => {
  if (typeof value === 'bigint') {
    return value >= 0n ? value : null;
  }
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
    return BigInt(Math.floor(value));
  }
  if (typeof value === 'string' && /^\d+$/.test(value)) {
    return BigInt(value);
  }
  return null;
};

const getStepPanelKey = (stepId: JourneyStepId): PanelKey | null => {
  if (stepId === 'connect-wallet') {
    return null;
  }
  if (stepId === 'create-draft' || stepId === 'deploy-contract') {
    return 'deploy-wizard';
  }
  if (stepId === 'upload-artwork' || stepId === 'lock-staged-assets') {
    return 'asset-staging';
  }
  if (stepId === 'configure-launch' || stepId === 'unpause-contract') {
    return 'launch-controls';
  }
  if (
    stepId === 'prepare-live-page' ||
    stepId === 'publish-backend' ||
    stepId === 'monitor-launch'
  ) {
    return 'publish-ops';
  }
  return 'collection-list';
};

const getJourneyTargetId = (
  stepId: JourneyStepId,
  mode: ExperienceMode
): string | null => {
  if (stepId === 'prepare-live-page') {
    return 'manage-live-page-settings';
  }
  if (stepId === 'publish-backend') {
    return 'manage-publish-collection-button';
  }
  if (stepId === 'unpause-contract') {
    return mode === 'advanced'
      ? 'manage-contract-action-select'
      : 'manage-unpause-contract-button';
  }
  if (stepId === 'configure-launch' && mode === 'advanced') {
    return 'manage-contract-action-select';
  }
  return null;
};

const GUIDED_PRIMARY_PANELS: PanelKey[] = [
  'collection-list',
  'deploy-wizard',
  'asset-staging',
  'launch-controls',
  'publish-ops'
];
const ACTIVE_COLLECTION_STORAGE_PREFIX = 'xtrata-manage-active-collection-v1';

export default function CollectionManagerApp() {
  const { walletSession, connect, disconnect } = useManageWallet();
  const isXtrataOwner = isXtrataOwnerAddress(walletSession.address);
  const [walletPending, setWalletPending] = useState(false);
  const [activeCollectionId, setActiveCollectionId] = useState('');
  const [activeCollectionLabel, setActiveCollectionLabel] = useState('');
  const [storedActiveCollectionId, setStoredActiveCollectionId] = useState('');
  const [collectionListRefreshKey, setCollectionListRefreshKey] = useState(0);
  const [createNewCollectionToken, setCreateNewCollectionToken] = useState(0);

  const [collapsed, setCollapsed] = useState<Record<PanelKey, boolean>>({
    'sdk-toolkit': true,
    'collection-list': false,
    'owner-oversight': true,
    'deploy-wizard': false,
    'launch-controls': false,
    'collection-settings': true,
    'asset-staging': false,
    'publish-ops': false,
    'debug-tools': true
  });
  const [studioAction, setStudioAction] = useState<{ key: string } | undefined>();
  const [experienceMode, setExperienceMode] = useState<ExperienceMode>('guided');
  const [journeySnapshot, setJourneySnapshot] = useState<JourneySnapshot>(
    INITIAL_JOURNEY_SNAPSHOT
  );
  const [journeyRefreshKey, setJourneyRefreshKey] = useState(0);
  const [activeJourneyStepId, setActiveJourneyStepId] =
    useState<JourneyStepId | null>(null);

  const showAdvancedPanels = experienceMode === 'advanced';
  const walletConnected = Boolean(walletSession.address);
  const hasActiveCollection = activeCollectionId.trim().length > 0;
  const selectionScopeKey = walletSession.address?.trim().toUpperCase() ?? '';
  const activeCollectionStorageKey = selectionScopeKey
    ? `${ACTIVE_COLLECTION_STORAGE_PREFIX}:${selectionScopeKey}`
    : '';

  useEffect(() => {
    setActiveCollectionId('');
    setActiveCollectionLabel('');
    if (typeof window === 'undefined' || !activeCollectionStorageKey) {
      setStoredActiveCollectionId('');
      return;
    }
    try {
      setStoredActiveCollectionId(
        window.localStorage.getItem(activeCollectionStorageKey)?.trim() ?? ''
      );
    } catch {
      setStoredActiveCollectionId('');
    }
  }, [activeCollectionStorageKey]);

  useEffect(() => {
    if (typeof window === 'undefined' || !activeCollectionStorageKey) {
      return;
    }
    // Only record a selection. Clearing happens explicitly ("New collection"):
    // the initial empty state must not erase the collection we want to resume.
    try {
      if (activeCollectionId.trim()) {
        window.localStorage.setItem(activeCollectionStorageKey, activeCollectionId.trim());
      }
    } catch {
      // Ignore storage write failures; selection remains in-memory.
    }
  }, [activeCollectionId, activeCollectionStorageKey]);

  const journeySignals = useMemo<JourneySignals>(
    () => ({
      walletConnected,
      hasActiveCollection,
      mintType: journeySnapshot.mintType,
      activeAssetCount: journeySnapshot.activeAssetCount,
      deployPricingLockPresent: journeySnapshot.deployPricingLockPresent,
      deployReady: journeySnapshot.deployReady,
      deployPending: journeySnapshot.deployPending,
      launchMintPriceConfigured: journeySnapshot.launchMintPriceConfigured,
      launchMaxSupplyConfigured: journeySnapshot.launchMaxSupplyConfigured,
      hasLivePageCover: journeySnapshot.hasLivePageCover,
      hasLivePageDescription: journeySnapshot.hasLivePageDescription,
      published: journeySnapshot.collectionState === 'published',
      unpaused: journeySnapshot.unpaused,
      uploadReadinessReason: journeySnapshot.uploadReadinessReason,
      deployReadinessReason: journeySnapshot.deployReadinessReason,
      inventoryRegistered: journeySnapshot.inventoryRegistered,
      chainReadFailed: journeySnapshot.chainReadFailed
    }),
    [walletConnected, hasActiveCollection, journeySnapshot]
  );

  const journeySteps = useMemo(
    () =>
      deriveJourneyStepStates({
        signals: journeySignals,
        activeStepId: activeJourneyStepId
      }),
    [journeySignals, activeJourneyStepId]
  );
  const recommendedJourneyStepId = useMemo(
    () => getRecommendedJourneyStepId(journeySteps),
    [journeySteps]
  );
  const doneJourneyStepCount = useMemo(
    () => journeySteps.filter((step) => step.status === 'done').length,
    [journeySteps]
  );
  const blockedJourneyStepCount = useMemo(
    () => journeySteps.filter((step) => step.status === 'blocked').length,
    [journeySteps]
  );
  // The advanced workspace always shows every panel; the guided builder has its own steps.
  const lockStepFocused = false;
  const assetStagingHeading = 'Artwork & metadata';
  const assetStagingSummary = lockStepFocused
    ? ''
    : 'Upload files once and prepare the manifest for launch day.';

  const refreshJourneySnapshot = useCallback(async () => {
    const normalizedCollectionId = activeCollectionId.trim();
    if (!normalizedCollectionId) {
      setJourneySnapshot(INITIAL_JOURNEY_SNAPSHOT);
      return;
    }

    setJourneySnapshot((current) => ({
      ...current,
      loading: true,
      error: null
    }));

    try {
      const [collectionResponse, assetsResponse, readinessResponse] =
        await Promise.all([
          fetch(`/collections/${encodeURIComponent(normalizedCollectionId)}`, {
            cache: 'no-store'
          }),
          fetch(`/collections/${encodeURIComponent(normalizedCollectionId)}/assets`, {
            cache: 'no-store'
          }),
          fetch(
            `/collections/${encodeURIComponent(normalizedCollectionId)}/readiness`,
            { cache: 'no-store' }
          )
        ]);

      const collection = await parseManageJsonResponse<CollectionRecord>(
        collectionResponse,
        'Collection'
      );
      const assets = await parseManageJsonResponse<ManagedAsset[]>(
        assetsResponse,
        'Collection assets'
      );
      const readiness = await parseManageJsonResponse<CollectionReadiness>(
        readinessResponse,
        'Collection readiness'
      );

      const metadata = toRecord(collection.metadata) ?? null;
      const metadataCollection = toRecord(metadata?.collection) ?? null;
      const collectionPage = toRecord(metadata?.collectionPage) ?? null;
      const coverImage = toRecord(collectionPage?.coverImage) ?? null;
      const pricingMetadata = resolveCollectionMintPricingMetadata(metadata?.pricing);
      const mintType =
        toText(metadata?.mintType) === 'pre-inscribed'
          ? 'pre-inscribed'
          : 'standard';
      const preInscribedMint = mintType === 'pre-inscribed';
      const collectionState = toText(collection.state).toLowerCase() || 'draft';
      const activeAssetCount = assets.filter((asset) =>
        isActiveAssetState(asset.state)
      ).length;
      const hasFallbackCoverImage = assets.some(
        (asset) =>
          isActiveAssetState(asset.state) && isImageMimeType(asset.mime_type)
      );
      const deployReady = readiness.deployReady === true;
      const deploySubmitted =
        toText(collection.contract_address).length > 0 &&
        toText(metadata?.deployTxId).length > 0;
      let launchMintPriceConfigured = false;
      let launchMaxSupplyConfigured = false;
      let unpaused: boolean | null = null;
      let chainReadFailed = false;
      let inventoryRegistered: boolean | null = null;
      const usesRegisteredInventory =
        !preInscribedMint && isCollectionV15(toText(metadata?.templateVersion));
      const inventoryHashes = collectInventoryHashes(assets);

      if (deployReady) {
        const resolvedTarget = resolveCollectionContractLink({
          collectionId: toText(collection.id),
          collectionSlug: toText(collection.slug),
          contractAddress: toText(collection.contract_address),
          metadata
        });
        if (resolvedTarget && usesRegisteredInventory) {
          // Registration is a launch gate for v1.5/v1.6: unknown hashes or a
          // stale verification both count as "not registered yet".
          const digest = inventoryHashes ? await computeInventoryDigest(inventoryHashes) : null;
          inventoryRegistered = isInventoryRegistrationCurrent({
            record: parseInventoryRegistrationRecord(metadata),
            contractId: resolvedTarget.contractId,
            hashCount: inventoryHashes?.length ?? 0,
            digest
          });
        }
        if (resolvedTarget) {
          try {
            const network =
              getNetworkFromAddress(resolvedTarget.address) ??
              (walletSession.network === 'testnet' ? 'testnet' : 'mainnet');
            const callReadOnly = async (functionName: string) => {
              const response = await callReadOnlyFunction({
                contractAddress: resolvedTarget.address,
                contractName: resolvedTarget.contractName,
                functionName,
                functionArgs: [],
                network: toStacksNetwork(network),
                senderAddress: resolvedTarget.address
              });
              return toClarityPrimitive(unwrapReadOnlyResponse(response));
            };

            const pausedPromise = callReadOnly(
              preInscribedMint ? 'get-paused' : 'is-paused'
            );
            const mintPricePromise = callReadOnly(
              preInscribedMint ? 'get-price' : 'get-mint-price'
            );
            const maxSupplyPromise: Promise<unknown> = preInscribedMint
              ? Promise.resolve(null)
              : callReadOnly('get-max-supply');
            const [pausedRaw, mintPriceRaw, maxSupplyRaw] = await Promise.all([
              pausedPromise,
              mintPricePromise,
              maxSupplyPromise
            ]);

            const pausedValue =
              typeof pausedRaw === 'boolean' ? pausedRaw : null;
            const mintPriceValue = parseUintPrimitive(mintPriceRaw);
            const maxSupplyValue = parseUintPrimitive(maxSupplyRaw);
            unpaused =
              pausedValue === null ? null : !pausedValue;
            launchMintPriceConfigured = preInscribedMint
              ? mintPriceValue !== null
              : pricingMetadata.mode !== 'raw-on-chain' ||
                  (collectionState === 'published' && mintPriceValue !== null) ||
                  // v1.5/v1.6: a price set from the advanced controls is still a
                  // price; don't deadlock launch on the metadata display mode.
                  (usesRegisteredInventory && mintPriceValue !== null && mintPriceValue > 0n);
            launchMaxSupplyConfigured =
              preInscribedMint ||
              (maxSupplyValue !== null && maxSupplyValue > 0n);
          } catch {
            // A failed read is "could not check", not "not configured".
            unpaused = null;
            launchMintPriceConfigured = false;
            launchMaxSupplyConfigured = false;
            chainReadFailed = true;
          }
        }
      }

      setJourneySnapshot({
        previewCover: resolveCollectionCoverImageUrl({ coverImage, collectionId: normalizedCollectionId }),
        previewDescription: toText(collectionPage?.description) || toText(metadataCollection?.description),
        loading: false,
        error: null,
        mintType,
        collectionState,
        activeAssetCount,
        deployPricingLockPresent:
          toRecord(metadata?.deployPricingLock) !== null,
        deployReady,
        deployPending: deploySubmitted && !deployReady,
        launchMintPriceConfigured,
        launchMaxSupplyConfigured,
        unpaused,
        hasLivePageCover: hasCoverImageMetadata(coverImage) || hasFallbackCoverImage,
        hasLivePageDescription:
          toText(collectionPage?.description).length > 0 ||
          toText(metadataCollection?.description).length > 0,
        uploadReadinessReason:
          readiness.ready === true ? null : toText(readiness.reason) || null,
        deployReadinessReason:
          deployReady ? null : toText(readiness.reason) || null,
        inventoryRegistered,
        chainReadFailed,
        stagedFileCount: inventoryHashes?.length ?? activeAssetCount
      });
    } catch (error) {
      setJourneySnapshot((current) => ({
        ...current,
        loading: false,
        error: toManageApiErrorMessage(
          error,
          'Unable to refresh checklist data.'
        )
      }));
    }
  }, [activeCollectionId, walletSession.network]);

  const requestJourneyRefresh = useCallback(() => {
    setJourneyRefreshKey((current) => current + 1);
  }, []);

  useEffect(() => {
    void refreshJourneySnapshot();
  }, [refreshJourneySnapshot, journeyRefreshKey]);

  useEffect(() => {
    if (experienceMode !== 'guided') {
      return;
    }

    const current = journeySteps.find(
      (step) => step.id === activeJourneyStepId
    );
    if (
      !current ||
      current.status === 'locked' ||
      current.status === 'done'
    ) {
      setActiveJourneyStepId(recommendedJourneyStepId);
    }
  }, [
    experienceMode,
    journeySteps,
    activeJourneyStepId,
    recommendedJourneyStepId
  ]);

  useEffect(() => {
    if (experienceMode !== 'guided') {
      return;
    }
    const activeStep = journeySteps.find(
      (step) => step.id === activeJourneyStepId
    );
    if (!activeStep) {
      return;
    }
    const panelKey = getStepPanelKey(activeStep.id);
    if (!panelKey || !GUIDED_PRIMARY_PANELS.includes(panelKey)) {
      return;
    }
    setCollapsed((prev) => {
      const next = { ...prev };
      GUIDED_PRIMARY_PANELS.forEach((candidate) => {
        next[candidate] = candidate !== panelKey;
      });
      return next;
    });
  }, [experienceMode, journeySteps, activeJourneyStepId]);

  const expandPanel = useCallback((key: PanelKey) => {
    setCollapsed((prev) => (prev[key] ? { ...prev, [key]: false } : prev));
  }, []);

  const collapsePanel = useCallback((key: PanelKey) => {
    setCollapsed((prev) => (!prev[key] ? { ...prev, [key]: true } : prev));
  }, []);

  const handlePanelToggleButtonClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>, key: PanelKey) => {
      event.stopPropagation();
      if (collapsed[key]) {
        expandPanel(key);
        return;
      }
      collapsePanel(key);
    },
    [collapsed, collapsePanel, expandPanel]
  );

  const handleCollapsedPanelKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>, key: PanelKey) => {
      if (!collapsed[key]) {
        return;
      }
      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }
      event.preventDefault();
      expandPanel(key);
    },
    [collapsed, expandPanel]
  );

  const getCollapsedPanelInteractionProps = useCallback(
    (key: PanelKey) =>
      collapsed[key]
        ? {
            role: 'button' as const,
            tabIndex: 0,
            'aria-expanded': false,
            onClick: () => expandPanel(key),
            onKeyDown: (event: KeyboardEvent<HTMLElement>) =>
              handleCollapsedPanelKeyDown(event, key)
          }
        : {
            'aria-expanded': true
          },
    [collapsed, expandPanel, handleCollapsedPanelKeyDown]
  );

  const jumpToPanel = (key: PanelKey, targetId?: string | null) => {
    setCollapsed((prev) => ({ ...prev, [key]: false }));
    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(() => {
        const panel = document.getElementById(MANAGE_PANEL_IDS[key]);
        if (panel) {
          panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        if (targetId) {
          window.requestAnimationFrame(() => {
            const target = document.getElementById(targetId);
            if (!target) {
              return;
            }
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            if (
              target instanceof HTMLButtonElement ||
              target instanceof HTMLInputElement ||
              target instanceof HTMLSelectElement ||
              target instanceof HTMLTextAreaElement
            ) {
              target.focus({ preventScroll: true });
            }
          });
        }
      });
    }
  };

  const setGuidedMode = () => {
    setExperienceMode('guided');
    setActiveJourneyStepId(recommendedJourneyStepId);
    setCollapsed((prev) => ({
      ...prev,
      'collection-settings': true,
      'debug-tools': true
    }));
  };

  const setAdvancedMode = () => {
    setExperienceMode('advanced');
  };

  const openStudioTask = (task: StudioTaskId) => {
    const actions = { pricing: 'set-mint-price', schedule: 'set-phase', allowlist: 'set-allowlist-batch' };
    if (task === 'pricing' || task === 'schedule' || task === 'allowlist') {
      setAdvancedMode();
      setStudioAction({ key: actions[task] });
      jumpToPanel('collection-settings', 'manage-contract-action-select');
      return;
    }
    if (task === 'storage') {
      document.getElementById('manage-storage-workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    const panels = { collections: 'collection-list', create: 'deploy-wizard', artwork: 'asset-staging', metadata: 'publish-ops', launch: 'launch-controls' } as const;
    jumpToPanel(panels[task]);
  };

  const handleSelectCollection = (collection: {
    id: string;
    label: string;
    deployed: boolean;
  }) => {
    setActiveCollectionId(collection.id);
    setActiveCollectionLabel(collection.label);
    setCollapsed((prev) => ({
      ...prev,
      'deploy-wizard': collection.deployed,
      'asset-staging': false,
      'publish-ops': false
    }));
    requestJourneyRefresh();
  };

  const handleDraftReady = (collection: {
    id: string;
    label: string;
    deployed: boolean;
  }) => {
    setActiveCollectionId(collection.id);
    setActiveCollectionLabel(collection.label);
    setCollectionListRefreshKey((current) => current + 1);
    setCollapsed((prev) => ({
      ...prev,
      'deploy-wizard': collection.deployed,
      'asset-staging': false
    }));
    requestJourneyRefresh();
  };

  const handleJourneyRefresh = () => {
    requestJourneyRefresh();
  };

  const handleCreateNewCollection = useCallback(() => {
    setStoredActiveCollectionId('');
    if (typeof window !== 'undefined' && activeCollectionStorageKey) {
      try {
        window.localStorage.removeItem(activeCollectionStorageKey);
      } catch {
        // Selection is in-memory only when storage is unavailable.
      }
    }
    setActiveCollectionId('');
    setActiveCollectionLabel('');
    setCreateNewCollectionToken((current) => current + 1);
    setActiveJourneyStepId('create-draft');
    requestJourneyRefresh();
    jumpToPanel('deploy-wizard');
  }, [jumpToPanel, requestJourneyRefresh, activeCollectionStorageKey]);

  // Guided mode has no always-mounted picker, so resume the saved collection here.
  useEffect(() => {
    const storedId = storedActiveCollectionId.trim();
    if (experienceMode !== 'guided' || !storedId || activeCollectionId.trim()) {
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch(`/collections/${encodeURIComponent(storedId)}`, {
          cache: 'no-store'
        });
        if (!response.ok || cancelled) return;
        const record = (await response.json()) as Record<string, unknown>;
        const state = toText(record.state).toLowerCase();
        const owner = toText(record.artist_address).toUpperCase();
        const wallet = walletSession.address?.trim().toUpperCase() ?? '';
        if (cancelled || state === 'archived' || (owner && wallet && owner !== wallet)) return;
        setActiveCollectionId(toText(record.id) || storedId);
        setActiveCollectionLabel(toText(record.display_name) || toText(record.slug));
        requestJourneyRefresh();
      } catch {
        // Resume is best-effort; the creator can still pick from Switch collection.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [experienceMode, storedActiveCollectionId, activeCollectionId, walletSession.address, requestJourneyRefresh]);

  const handleJourneyStepClick = (stepId: JourneyStepId) => {
    const step = journeySteps.find((candidate) => candidate.id === stepId);
    if (!step || step.status === 'locked') {
      return;
    }
    setActiveJourneyStepId(stepId);
    const panelKey = getStepPanelKey(stepId);
    if (!panelKey) {
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    if (
      panelKey === 'collection-settings' &&
      experienceMode === 'guided'
    ) {
      setAdvancedMode();
    }
    const stepTargetId = getJourneyTargetId(stepId, experienceMode);
    if (panelKey === 'launch-controls' && experienceMode === 'advanced') {
      jumpToPanel('collection-settings', stepTargetId);
      return;
    }
    jumpToPanel(panelKey, stepTargetId);
  };

  const handleConnectWallet = async () => {
    setWalletPending(true);
    try {
      await connect();
    } finally {
      setWalletPending(false);
    }
  };

  const handleDisconnectWallet = async () => {
    setWalletPending(true);
    try {
      await disconnect();
    } finally {
      setWalletPending(false);
    }
  };

  const standardMintForChecks = journeySnapshot.mintType !== 'pre-inscribed';
  const advancedLaunchChecks = [
      { label: 'Contract confirmed on-chain', ok: journeySignals.deployReady, hint: 'finish Prepare contract' },
      ...(journeySignals.inventoryRegistered === null || journeySignals.inventoryRegistered === undefined
        ? []
        : [{ label: 'Every uploaded file registered on the contract', ok: journeySignals.inventoryRegistered, hint: 'check and register files in Prepare contract' }]),
      ...(journeySignals.chainReadFailed
        ? [{ label: 'Contract status readable', ok: false, hint: 'could not read your contract — refresh readiness' }]
        : []),
      ...(standardMintForChecks
        ? [{ label: 'Max supply set', ok: journeySignals.launchMaxSupplyConfigured, hint: 'set it in Mint rules' }]
        : []),
      { label: 'Price set', ok: journeySignals.launchMintPriceConfigured, hint: 'set it in Mint rules' }
    ];
  if (experienceMode === 'guided') {
    const launchChecks = advancedLaunchChecks;
    return <CollectionBuilder collectionId={activeCollectionId} collectionName={activeCollectionLabel}
      walletKey={`${walletSession.network}:${walletSession.address || 'disconnected'}`}
      signals={journeySignals} loading={journeySnapshot.loading} error={journeySnapshot.error}
      previewCover={journeySnapshot.previewCover} previewDescription={journeySnapshot.previewDescription}
      onRefresh={handleJourneyRefresh} onAdvanced={setAdvancedMode} onCreate={handleCreateNewCollection}
      wallet={<><WalletTopBar walletSession={walletSession} walletPending={walletPending} onConnect={handleConnectWallet} onDisconnect={handleDisconnectWallet} showAddressWhenNamed /><CreatorSessionBadge /></>}
      picker={<CollectionListPanel activeCollectionId={activeCollectionId} preferredCollectionId={storedActiveCollectionId} refreshKey={journeyRefreshKey} onSelectCollection={handleSelectCollection} />}
      deploy={(stage) => <DeployWizardPanel stage={stage} activeCollectionId={activeCollectionId} createNewToken={createNewCollectionToken} isXtrataOwner={isXtrataOwner} onDraftReady={handleDraftReady} onJourneyRefreshRequested={requestJourneyRefresh} journeyRefreshToken={journeyRefreshKey} />}
      artwork={<><FileRetentionNotice collectionId={activeCollectionId} refreshKey={journeyRefreshKey} /><AssetStagingPanel activeCollectionId={activeCollectionId} onJourneyRefreshRequested={requestJourneyRefresh} highlightLockAction /></>}
      retention={<FileRetentionNotice collectionId={activeCollectionId} refreshKey={journeyRefreshKey} compact />}
      inventory={<CollectionInventoryPanel key={activeCollectionId} collectionId={activeCollectionId} refreshKey={journeyRefreshKey} onVerified={requestJourneyRefresh} />}
      rules={<><CollectionSettingsPanel mode="guided" activeCollectionId={activeCollectionId} isXtrataOwner={isXtrataOwner} stagedFileCount={journeySnapshot.stagedFileCount} onJourneyRefreshRequested={requestJourneyRefresh} />
        <LazyDetails className="creator-builder__optional" summary="Optional: schedules, allowlists, wallet limits and payouts">
          <CollectionSettingsPanel mode="advanced" activeCollectionId={activeCollectionId} isXtrataOwner={isXtrataOwner} onJourneyRefreshRequested={requestJourneyRefresh} />
        </LazyDetails></>}
      page={<>
        <ol className="creator-launch-steps meta-value"><li>Add your cover image and description.</li><li>Publish your mint page.</li><li>Open minting (at the bottom of this step).</li></ol>
        <PublishOpsPanel activeCollectionId={activeCollectionId} onJourneyRefreshRequested={requestJourneyRefresh}
          priceConfigured={journeySignals.deployReady && !journeySignals.chainReadFailed ? journeySignals.launchMintPriceConfigured : undefined}
          studioBlockers={launchChecks.filter((check) => !check.ok && check.label !== 'Price set').map((check) => `${check.label}: ${check.hint ?? 'not ready'}.`)} />
        <CollectionSettingsPanel mode="launch" activeCollectionId={activeCollectionId} isXtrataOwner={isXtrataOwner} launchChecks={launchChecks} onJourneyRefreshRequested={requestJourneyRefresh} />
      </>}
      storage={activeCollectionId ? <><ReservationsPanel key={`res-${activeCollectionId}`} collectionId={activeCollectionId} /><StorageCleanupPanel key={activeCollectionId} collectionId={activeCollectionId} /></> : null}
    />;
  }

  return (
    <div className="app manage-app">
      <header className="app__header">
        <span className="eyebrow">Artist workspace</span>
        <h1>Your collection workspace</h1>
        <p className="meta-value">
          Logged in as:{' '}
          <AddressLabel
            className="meta-value"
            address={walletSession.address}
            network={walletSession.network}
            fallback="Not connected"
            showAddressWhenNamed
          />
        </p>
        <p>Create, organise and launch from one place. Choose a task below or follow the launch checklist.</p>
        <p className="meta-value">
          Pair your launch with the <a href="/manifests">Manifest Studio</a> — group inscribed
          works into collections and galleries, and publish your own page at{' '}
          <code>/g/your-name.btc</code>. <a href="/agent-one/">Inscription Wizard</a> ·{' '}
          <a href="/g/512">Example gallery link format</a>
        </p>
        <CreatorSessionBadge />
        <WalletTopBar
          walletSession={walletSession}
          walletPending={walletPending}
          onConnect={handleConnectWallet}
          onDisconnect={handleDisconnectWallet}
          showAddressWhenNamed
        />
        <div className="mint-actions">
          <span className="meta-value">
            {activeCollectionId ? (
              <>
                Active drop: {activeCollectionLabel || 'Selected drop'} ·{' '}
                <code>{activeCollectionId}</code>
              </>
            ) : (
              'No active drop selected. Choose an existing drop below or start a new one.'
            )}
          </span>
          <span className="info-label">
            <button
              className="button button--ghost"
              type="button"
              onClick={handleCreateNewCollection}
            >
              Create new collection
            </button>
            <InfoTooltip text="Clears the selected drop and resets Step 1 so you can start a fresh draft." />
          </span>
        </div>
      </header>
      <main className="app__main">
        <CollectionStudioNav collectionName={activeCollectionLabel} fileCount={journeySnapshot.activeAssetCount}
          state={journeySnapshot.loading ? 'Checking status' : journeySnapshot.collectionState ?? ''} onSelect={openStudioTask} />
        <section className="panel app-section manage-journey">
          <div className="panel__header">
            <div>
              <h2>
                Start here
                <InfoTooltip text="Guided mode keeps only the essential launch steps visible. Advanced mode reveals contract controls and diagnostics." />
              </h2>
              <p>
                Complete steps in order. Locked items unlock automatically when
                their prerequisites are complete.
              </p>
            </div>
            <div className="panel__actions">
              <span className="info-label">
                <button
                  className="button button--ghost"
                  type="button"
                  onClick={handleJourneyRefresh}
                  disabled={journeySnapshot.loading}
                >
                  {journeySnapshot.loading
                    ? 'Refreshing checklist...'
                    : 'Refresh checklist'}
                </button>
                <InfoTooltip text="Recompute all step states from latest backend and on-chain snapshots." />
              </span>
              <div className="manage-journey__mode-toggle" role="group" aria-label="Experience mode">
                <span className="info-label">
                  <button
                    className="button button--ghost"
                    type="button"
                    onClick={setGuidedMode}
                  >
                    Guided mode
                  </button>
                  <InfoTooltip text="Shows the essential launch sequence with fewer controls." />
                </span>
                <span className="info-label">
                  <button
                    className={`button ${experienceMode === 'advanced' ? '' : 'button--ghost'}`}
                    type="button"
                    onClick={setAdvancedMode}
                  >
                    Advanced mode
                  </button>
                  <InfoTooltip text="Shows detailed contract/admin tools, diagnostics, and expert controls." />
                </span>
              </div>
            </div>
          </div>
          <div className="panel__body">
            <p className="meta-value">
              Progress: {doneJourneyStepCount}/{journeySteps.length} complete
              {blockedJourneyStepCount > 0
                ? ` · ${blockedJourneyStepCount} need attention`
                : ''}
            </p>
            {journeySnapshot.error ? (
              <div className="alert">{journeySnapshot.error}</div>
            ) : null}
            <details className="collection-studio__checklist"><summary>View the full launch checklist</summary><div className="manage-journey__steps">
              {journeySteps.map((step, index) => (
                <button
                  key={step.id}
                  type="button"
                  className={`button button--ghost manage-journey__step manage-journey__step--${step.status}${
                    activeJourneyStepId === step.id ? ' manage-journey__step--active' : ''
                  }`}
                  onClick={() => handleJourneyStepClick(step.id)}
                  disabled={step.status === 'locked'}
                  aria-current={activeJourneyStepId === step.id ? 'step' : undefined}
                >
                  <span className="manage-journey__step-index">
                    Step {index + 1}
                  </span>
                  <strong>{step.title}</strong>
                  <span className="manage-journey__step-status">
                    {JOURNEY_STATUS_LABELS[step.status]}
                  </span>
                  <span className="manage-journey__step-note">
                    {step.summary}
                  </span>
                  {step.lockedReason ? (
                    <span className="manage-journey__step-reason">
                      {step.lockedReason}
                    </span>
                  ) : null}
                  {step.blockedReason ? (
                    <span className="manage-journey__step-reason">
                      {step.blockedReason}
                    </span>
                  ) : null}
                  {step.doneNote ? (
                    <span className="manage-journey__step-reason">
                      {step.doneNote}
                    </span>
                  ) : null}
                </button>
              ))}
            </div></details>
          </div>
        </section>

        <section
          className={`panel app-section${collapsed['sdk-toolkit'] ? ' panel--collapsed' : ''}`}
          id={MANAGE_PANEL_IDS['sdk-toolkit']}
          {...getCollapsedPanelInteractionProps('sdk-toolkit')}
        >
          <div className="panel__header">
            <div>
              <h2>
                SDK toolkit
                <InfoTooltip text="Builder-ready snippets and links for teams integrating Xtrata into third-party apps." />
              </h2>
              <p>Build on Xtrata without rebuilding contract logic from scratch.</p>
            </div>
            <div className="panel__actions">
              <button
                className="button button--ghost"
                type="button"
                onClick={(event) =>
                  handlePanelToggleButtonClick(event, 'sdk-toolkit')
                }
              >
                {collapsed['sdk-toolkit'] ? 'Expand' : 'Collapse'}
              </button>
            </div>
          </div>
          <div className="panel__body">
            <SdkToolkitPanel
              activeCollectionId={activeCollectionId}
              activeCollectionLabel={activeCollectionLabel}
            />
          </div>
        </section>

        <section
          className={`panel app-section${collapsed['collection-list'] ? ' panel--collapsed' : ''}`}
          id={MANAGE_PANEL_IDS['collection-list']}
          {...getCollapsedPanelInteractionProps('collection-list')}
        >
          <div className="panel__header">
            <div>
              <h2>
                Your drops
                <InfoTooltip text="View each draft collection and jump to its deploy/metadata details." />
              </h2>
              <p>See what is in progress and what is already deployed.</p>
            </div>
            <div className="panel__actions">
              <button
                className="button button--ghost"
                type="button"
                onClick={(event) =>
                  handlePanelToggleButtonClick(event, 'collection-list')
                }
              >
                {collapsed['collection-list'] ? 'Expand' : 'Collapse'}
              </button>
            </div>
          </div>
          <div className="panel__body">
            <CollectionListPanel
              activeCollectionId={activeCollectionId}
              preferredCollectionId={activeCollectionId || storedActiveCollectionId}
              refreshKey={collectionListRefreshKey}
              onSelectCollection={handleSelectCollection}
            />
          </div>
        </section>

        {isXtrataOwner && (
          <section
            className={`panel app-section${collapsed['owner-oversight'] ? ' panel--collapsed' : ''}`}
            id={MANAGE_PANEL_IDS['owner-oversight']}
            {...getCollapsedPanelInteractionProps('owner-oversight')}
          >
            <div className="panel__header">
              <div>
                <h2>
                  Owner oversight
                  <InfoTooltip text="Owner-only view of activity across other allowlisted artist wallets." />
                </h2>
                <p>Monitor launch progress across all allowlisted artists from one place.</p>
              </div>
              <div className="panel__actions">
                <button
                  className="button button--ghost"
                  type="button"
                  onClick={(event) =>
                    handlePanelToggleButtonClick(event, 'owner-oversight')
                  }
                >
                  {collapsed['owner-oversight'] ? 'Expand' : 'Collapse'}
                </button>
              </div>
            </div>
            <div className="panel__body">
              <OwnerOversightPanel />
            </div>
          </section>
        )}

        <section
          className={`panel app-section${collapsed['deploy-wizard'] ? ' panel--collapsed' : ''}`}
          id={MANAGE_PANEL_IDS['deploy-wizard']}
          {...getCollapsedPanelInteractionProps('deploy-wizard')}
        >
          <div className="panel__header">
            <div>
              <h2>
                Collection basics &amp; contract
                <InfoTooltip text="Create a draft and deploy with a locked template using collection basics plus Xtrata-managed payout defaults. The price collectors pay is set in Registration, supply & price." />
              </h2>
              <p>Set collection basics and deploy the contract here. The price is set after your artwork is locked and the contract is deployed.</p>
            </div>
            <div className="panel__actions">
              <button
                className="button button--ghost"
                type="button"
                onClick={(event) =>
                  handlePanelToggleButtonClick(event, 'deploy-wizard')
                }
              >
                {collapsed['deploy-wizard'] ? 'Expand' : 'Collapse'}
              </button>
            </div>
          </div>
          <div className="panel__body">
            <DeployWizardPanel
              activeCollectionId={activeCollectionId}
              createNewToken={createNewCollectionToken}
              isXtrataOwner={isXtrataOwner}
              onDraftReady={handleDraftReady}
              onJourneyRefreshRequested={requestJourneyRefresh}
              journeyRefreshToken={journeyRefreshKey}
            />
          </div>
        </section>

        <section
          className={`panel app-section${collapsed['asset-staging'] ? ' panel--collapsed' : ''}`}
          id={MANAGE_PANEL_IDS['asset-staging']}
          {...getCollapsedPanelInteractionProps('asset-staging')}
        >
          <div className="panel__header">
            <div>
              <h2>
                {assetStagingHeading}
                <InfoTooltip
                  text={
                    lockStepFocused
                      ? 'Locking files records the largest file so pricing can include its inscription cost.'
                      : 'Upload files to Cloudflare, compute hashes/chunks, and store manifest rows for minting.'
                  }
                />
              </h2>
              <p>{assetStagingSummary}</p>
            </div>
            <div className="panel__actions">
              <button
                className="button button--ghost"
                type="button"
                onClick={(event) =>
                  handlePanelToggleButtonClick(event, 'asset-staging')
                }
              >
                {collapsed['asset-staging'] ? 'Expand' : 'Collapse'}
              </button>
            </div>
          </div>
          <div className="panel__body">
            <AssetStagingPanel
              activeCollectionId={activeCollectionId}
              onJourneyRefreshRequested={requestJourneyRefresh}
              highlightLockAction={lockStepFocused}
            />
          </div>
        </section>

        {(
          <section
            className={`panel app-section${collapsed['launch-controls'] ? ' panel--collapsed' : ''}`}
            id={MANAGE_PANEL_IDS['launch-controls']}
            {...getCollapsedPanelInteractionProps('launch-controls')}
          >
            <div className="panel__header">
              <div>
                <h2>
                  Registration, supply &amp; price
                  <InfoTooltip text="Register every file on your contract, set max supply once, and set the price collectors pay." />
                </h2>
                <p>
                  Register your files, set how many can be minted and the price collectors pay.
                </p>
              </div>
              <div className="panel__actions">
                <button
                  className="button button--ghost"
                  type="button"
                  onClick={(event) =>
                    handlePanelToggleButtonClick(event, 'launch-controls')
                  }
                >
                  {collapsed['launch-controls'] ? 'Expand' : 'Collapse'}
                </button>
              </div>
            </div>
            <div className="panel__body">
              <CollectionInventoryPanel key={activeCollectionId} collectionId={activeCollectionId} refreshKey={journeyRefreshKey} onVerified={requestJourneyRefresh} />
              <CollectionSettingsPanel
                mode="guided"
                activeCollectionId={activeCollectionId}
                isXtrataOwner={isXtrataOwner}
                stagedFileCount={journeySnapshot.stagedFileCount}
                onJourneyRefreshRequested={requestJourneyRefresh}
              />
            </div>
          </section>
        )}

        <section
          className={`panel app-section${collapsed['publish-ops'] ? ' panel--collapsed' : ''}`}
          id={MANAGE_PANEL_IDS['publish-ops']}
          {...getCollapsedPanelInteractionProps('publish-ops')}
        >
          <div className="panel__header">
            <div>
              <h2>
                Review &amp; launch
                <InfoTooltip text="Publish your mint page, then open minting. Monitor reservations afterwards." />
              </h2>
              <p>Publish your page, then open minting when every check passes.</p>
            </div>
            <div className="panel__actions">
              <button
                className="button button--ghost"
                type="button"
                onClick={(event) =>
                  handlePanelToggleButtonClick(event, 'publish-ops')
                }
              >
                {collapsed['publish-ops'] ? 'Expand' : 'Collapse'}
              </button>
            </div>
          </div>
          <div className="panel__body">
            <PublishOpsPanel
              activeCollectionId={activeCollectionId}
              onJourneyRefreshRequested={requestJourneyRefresh}
              priceConfigured={journeySignals.deployReady && !journeySignals.chainReadFailed ? journeySignals.launchMintPriceConfigured : undefined}
              studioBlockers={advancedLaunchChecks.filter((check) => !check.ok && check.label !== 'Price set').map((check) => `${check.label}: ${check.hint ?? 'not ready'}.`)}
            />
            <CollectionSettingsPanel mode="launch" activeCollectionId={activeCollectionId} isXtrataOwner={isXtrataOwner}
              launchChecks={advancedLaunchChecks} onJourneyRefreshRequested={requestJourneyRefresh} />
            {activeCollectionId ? <ReservationsPanel key={`res-${activeCollectionId}`} collectionId={activeCollectionId} /> : null}
          </div>
        </section>

        <div id="manage-storage-workspace" className="collection-studio__storage">
          {activeCollectionId ? <StorageCleanupPanel key={activeCollectionId} collectionId={activeCollectionId} /> : <p className="panel">Choose or create a collection to manage its temporary storage.</p>}
        </div>


        {showAdvancedPanels && (
          <>
            <section
              className={`panel app-section${collapsed['collection-settings'] ? ' panel--collapsed' : ''}`}
              id={MANAGE_PANEL_IDS['collection-settings']}
              {...getCollapsedPanelInteractionProps('collection-settings')}
            >
              <div className="panel__header">
                <div>
                  <h2>
                    Collection controls
                    <InfoTooltip text="Load the draft to edit display name, contract references, and other advanced launch settings." />
                  </h2>
                  <p>Manage prices, schedules, allowlists and collection settings. Review each change before submitting.</p>
                </div>
                <div className="panel__actions">
                  <button
                    className="button button--ghost"
                    type="button"
                    onClick={(event) =>
                      handlePanelToggleButtonClick(event, 'collection-settings')
                    }
                  >
                    {collapsed['collection-settings'] ? 'Expand' : 'Collapse'}
                  </button>
                </div>
              </div>
              <div className="panel__body">
                <CollectionSettingsPanel
                  mode="advanced"
                  requestedAction={studioAction}
                  activeCollectionId={activeCollectionId}
                  isXtrataOwner={isXtrataOwner}
                  onJourneyRefreshRequested={requestJourneyRefresh}
                />
              </div>
            </section>

            <section
              className={`panel app-section${collapsed['debug-tools'] ? ' panel--collapsed' : ''}`}
              id={MANAGE_PANEL_IDS['debug-tools']}
              {...getCollapsedPanelInteractionProps('debug-tools')}
            >
              <div className="panel__header">
                <div>
                  <h2>
                    Advanced system checks
                    <InfoTooltip text="Run D1 and storage checks if you suspect backend issues." />
                  </h2>
                  <p>Technical checks for troubleshooting backend availability.</p>
                </div>
                <div className="panel__actions">
                  <button
                    className="button button--ghost"
                    type="button"
                    onClick={(event) =>
                      handlePanelToggleButtonClick(event, 'debug-tools')
                    }
                  >
                    {collapsed['debug-tools'] ? 'Expand' : 'Collapse'}
                  </button>
                </div>
              </div>
              <div className="panel__body">
                <DiagnosticsPanel activeCollectionId={activeCollectionId} />
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
