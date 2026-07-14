    import {
      bufferCV,
      FungibleConditionCode,
      cvToHex,
      cvToJSON,
      hexToCV,
      listCV,
      makeStandardSTXPostCondition,
      makeContractSTXPostCondition,
      PostConditionMode,
      principalCV,
      stringAsciiCV,
      uintCV,
      contractPrincipalCV
    } from '@stacks/transactions';
    import { createStacksWalletAdapter } from '/src/lib/wallet/adapter.ts';
    import {
      THEME_STORAGE_KEY,
      OPUS_HTML_HANDOFF_KEY,
      OPUS_HTML_HANDOFF_DB,
      OPUS_HTML_HANDOFF_STORE,
      THEME_IDS,
      CURATED_GALLERIES,
      EXAMPLE_VIEW_DESCRIPTIONS,
      XTRATA_BRAND_MARK_URL,
      WALLET_PAGE_SIZE,
      WALLET_FALLBACK_SCAN_LIMIT,
      MAX_GRID_EAGER_FULL_LOAD_BYTES,
      GRID_THUMBNAIL_HYDRATION_CONCURRENCY,
      MAX_LIVE_HTML_FRAMES,
      GRID_SUMMARY_CACHE_MAX_SCOPES,
      GRID_SUMMARY_CACHE_MAX_ENTRIES,
      EXPLORER_FILTER_INDEX_CHUNK_SIZE,
      CONNECTED_LEDGER_MODE_STORAGE_PREFIX,
      GRID_MIME_LABELS,
      EXPLORER_CODE_MIME_TYPES,
      EXPLORER_FILTER_LABELS,
      TWIN_HOLDER_LABELS,
      PEPE_ESCROW_RESOLVERS
    } from '/src/home/config.js';
    import { initXtrataRadio } from '/src/home/radio.js';
    import {
      isWizardShellRequest,
      WIZARD_EMBED_ROUTE
    } from '/src/home/page-mode.js';
    import { showContractCall, signSponsoredContractCall } from '/src/lib/wallet/connect.ts';
    import {
      CONTRACT_REGISTRY,
      getLegacyContract
    } from '/src/lib/contract/registry.ts';
    import { getContractId } from '/src/lib/contract/config.ts';
    import { MARKET_REGISTRY, getMarketContractId } from '/src/lib/market/registry.ts';
    import DROPS_REGISTRY from '/src/data/drops-registry.json';
    import {
      getMarketSettlementAsset,
      getMarketSettlementLabel,
      buildMarketBuyPostConditions,
      formatMarketPriceWithUsd
    } from '/src/lib/market/settlement.ts';
    import { isSponsoredMarket } from '/src/lib/market/sponsored.ts';
    import {
      getMarketListingPublicBlockReason,
      isMarketListingPubliclyBuyable
    } from '/src/lib/market/actions.ts';
    import { loadMarketActivity } from '/src/lib/market/indexer.ts';
    import {
      buildTransferCall,
      createXtrataClient
    } from '/src/lib/contract/client.ts';
    import { fetchContractAdminStatus } from '/src/lib/contract/admin-status.ts';
    import {
      estimateContractFees,
      formatMicroStx,
      getFeeSchedule
    } from '/src/lib/contract/fees.ts';
    import {
      formatMicroStxWithUsd,
      getUsdPriceQuote
    } from '/src/lib/pricing/format.ts';
    import { fetchUsdPriceBook } from '/src/lib/pricing/hooks.ts';
    import { resolveContractCapabilities } from '/src/lib/contract/capabilities.ts';
    import {
      buildTransferPostCondition,
      buildContractTransferPostCondition
    } from '/src/lib/contract/post-conditions.ts';
    import { getNetworkMismatch } from '/src/lib/network/guard.ts';
    import { getApiBaseUrls } from '/src/lib/network/config.ts';
    import { toStacksNetwork } from '/src/lib/network/stacks.ts';
    import {
      batchChunks,
      chunkBytes,
      computeExpectedHash,
      MAX_UPLOAD_BATCH_SIZE
    } from '/src/lib/chunking/hash.ts';
    import {
      DEFAULT_BATCH_SIZE,
      DEFAULT_TOKEN_URI,
      MAX_MIME_LENGTH,
      SMALL_MINT_HELPER_CONTRACT_NAME,
      SMALL_MINT_HELPER_MAINNET_ADDRESS,
      SMALL_MINT_HELPER_MAX_CHUNKS,
      MAX_TOKEN_URI_LENGTH
    } from '/src/lib/mint/constants.ts';
    import {
      estimateDataMiningFeeMicroStx,
      estimateSequentialMintTransactions
    } from '/src/lib/mint/estimates.ts';
    import {
      clearMintAttempt,
      loadMintAttempt,
      saveMintAttempt
    } from '/src/lib/mint/attempt-cache.ts';
    import { bytesToHex } from '/src/lib/utils/encoding.ts';
    import { formatBytes, truncateMiddle } from '/src/lib/utils/format.ts';
    import { resolveBnsNames } from '/src/lib/bns/resolver.ts';
    import {
      loadWalletHoldingsIndex,
      loadWalletHoldingsPage
    } from '/src/lib/viewer/wallet-index.ts';
    import {
      getTransferValidationMessage,
      validateTransferRequest
    } from '/src/lib/wallet/transfer.ts';
    import { getWalletLookupState } from '/src/lib/wallet/lookup.ts';
    import {
      loadInscriptionThumbnailFromCache,
      saveInscriptionThumbnailToCache
    } from '/src/lib/viewer/cache.ts';
    import {
      injectGridThumbnailHtml,
      injectInteractivePreviewHtml
    } from '/src/lib/viewer/html-preview.ts';
    import {
      buildRuntimeModuleBaseHref,
      injectHtmlBaseHref
    } from '/src/lib/viewer/module-paths.ts';
    import {
      hasRuntimeContentUrls,
      inlineRuntimeContentUrls
    } from '/src/lib/viewer/runtime-inline.ts';
    import { buildRuntimeInscriptionContentUrl } from '/src/lib/collections/cover-image.ts';
    import { resolveInscriptionMimeType } from '/src/lib/mint/mime.ts';
    import {
      mergeDependencySources,
      parseDependencyInput,
      validateDependencyIds
    } from '/src/lib/mint/dependencies.ts';
    import { createImageThumbnail, THUMBNAIL_SIZE } from '/src/lib/viewer/thumbnail.ts';
    import {
      getSquareFramedImageStyle,
      shouldUsePixelatedImageRendering
    } from '/src/lib/viewer/image-rendering.ts';
    import {
      fetchTokenSummary,
      fetchTokenSummaryWithFallback
    } from '/src/lib/viewer/queries.ts';
    import { fetchIndexedSummaries } from '/src/lib/viewer/index-summaries.ts';
    import {
      loadIndexedChildren,
      loadChildIndexCursor,
      recordChildParents,
      syncChildIndex
    } from '/src/lib/viewer/parent-child-index.ts';
    import { fetchLineage, fetchDependents } from '/src/lib/viewer/relations-api.ts';
    import {
      decodeTokenUriToImage,
      fetchTokenImageFromUri,
      fetchOnChainContent,
      getFiniteAnimatedImageReplayDelayMs,
      getMediaKind,
      getMimeTypeEssence,
      getTextPreview,
      isAnimatedImagePayload,
      isHttpUrl,
      isLikelyImageUrl,
      resolveMimeType
    } from '/src/lib/viewer/content.ts';

    const isCoreEntry = (entry) =>
      entry.protocolVersion === '2.1.0' ||
      entry.protocolVersion === '2.1.1' ||
      entry.protocolVersion === '3.0.0' ||
      entry.protocolVersion === '3.2.3' ||
      entry.protocolVersion === '3.4.0' ||
      entry.contractName?.toLowerCase().includes('v2-1-0') === true ||
      entry.contractName?.toLowerCase().includes('v2-1-1') === true ||
      entry.contractName?.toLowerCase().includes('v3-0-0') === true ||
      entry.contractName?.toLowerCase().includes('v3-2-3') === true ||
      entry.contractName?.toLowerCase().includes('v3-4-0') === true;

    const coreContracts = CONTRACT_REGISTRY.filter(isCoreEntry);
    const versionWeight = (entry) => {
      if (entry.protocolVersion === '3.4.0' || entry.contractName?.includes('v3-4-0')) {
        return 30400;
      }
      if (entry.protocolVersion === '3.2.3' || entry.contractName?.includes('v3-2-3')) {
        return 30203;
      }
      if (entry.protocolVersion === '3.0.0' || entry.contractName?.includes('v3-0-0')) {
        return 30000;
      }
      if (entry.protocolVersion === '2.1.1' || entry.contractName?.includes('v2-1-1')) {
        return 20101;
      }
      if (entry.protocolVersion === '2.1.0' || entry.contractName?.includes('v2-1-0')) {
        return 20100;
      }
      return 0;
    };
    const ACTIVE_CONTRACTS = (coreContracts.length > 0 ? coreContracts : CONTRACT_REGISTRY)
      .slice()
      .sort((left, right) => versionWeight(right) - versionWeight(left));
    const DEFAULT_CONTRACT =
      ACTIVE_CONTRACTS.find(
        (entry) =>
          entry.protocolVersion === '3.4.0' ||
          entry.contractName?.toLowerCase().includes('v3-4-0') ||
          entry.protocolVersion === '3.2.3' ||
          entry.contractName?.toLowerCase().includes('v3-2-3')
      ) ?? ACTIVE_CONTRACTS[0];
    const SMALL_MINT_HELPER_TARGET_CORE_CONTRACT_ID =
      `${SMALL_MINT_HELPER_MAINNET_ADDRESS}.xtrata-v2-1-0`;
    const walletAdapter = createStacksWalletAdapter({
      appName: 'Xtrata Simple Inscription',
      appIcon: `${window.location.origin}/favicon.svg`
    });

    const $ = (id) => document.getElementById(id);

    // Page mode classified pre-paint by the router script in index.html <head>.
    // Primary tab page modes control which panels are
    // visible (CSS) and which data loads run (see initialize/switchToPage).
    // Mutable: nav clicks switch pages CLIENT-SIDE (SPA-style tabs) so the
    // radio and wallet session are never torn down between site pages.
    let PAGE_MODE = document.documentElement.dataset.page || 'home';

    const PAGE_TITLES = {
      home: 'Xtrata — Create something the internet cannot forget',
      inscribe: 'Inscribe — Xtrata',
      wizard: 'Inscription Wizard — Xtrata',
      xplorer: 'Xtrata Xplorer',
      'my-wallet': 'My Wallet — Xtrata',
      market: 'Market — Xtrata',
      drops: 'Drops — Claim free inscriptions — Xtrata'
    };

    // Set once the prepare handler exists; lets setSelectedFile auto-prepare a
    // freshly dropped file so the default flow is drop → (prepared) → inscribe.
    let autoPrepareHook = null;

    const dom = {
      themeSelect: $('themeSelect'),
      refreshWalletButton: $('refreshWalletButton'),
      connectedReadout: $('connectedReadout'),
      connectedReadoutValue: $('connectedReadoutValue'),
      connectedReadoutAddress: $('connectedReadoutAddress'),
      connectButton: $('connectButton'),
      disconnectButton: $('disconnectButton'),
      viewInscriptionsButton: $('viewInscriptionsButton'),
      wizardFrame: $('wizardFrame'),
      networkBadge: $('networkBadge'),
      mintSubtitle: $('mintSubtitle'),
      walletTitle: $('walletTitle'),
      walletStatus: $('walletStatus'),
      inscriptionForm: $('inscriptionForm'),
      nameInput: $('nameInput'),
      payloadType: $('payloadType'),
      tokenUriInput: $('tokenUriInput'),
      tokenUriHeadPreview: $('tokenUriHeadPreview'),
      fileInput: $('fileInput'),
      dropzone: $('dropzone'),
      dropzoneText: $('dropzoneText'),
      textPayload: $('textPayload'),
      textStats: $('textStats'),
      tabFile: $('tabFile'),
      tabText: $('tabText'),
      inscriptionForm: $('inscriptionForm'),
      inscribePanelBody: $('inscribePanelBody'),
      textCost: $('textCost'),
      inscribeTextButton: $('inscribeTextButton'),
      inscribeChange: $('inscribeChange'),
      threadReplyTo: $('threadReplyTo'),
      threadReplyNote: $('threadReplyNote'),
      activityLog: $('activityLog'),
      textAdvancedDetails: $('textAdvancedDetails'),
      textAdvancedLogSlot: $('textAdvancedLogSlot'),
      largeFileNotice: $('largeFileNotice'),
      largeFileNoticeText: $('largeFileNoticeText'),
      parentRelationshipPanel: $('parentRelationshipPanel'),
      parentRelationshipBadge: $('parentRelationshipBadge'),
      parentIdsInput: $('parentIdsInput'),
      addParentsButton: $('addParentsButton'),
      clearParentsButton: $('clearParentsButton'),
      parentChipList: $('parentChipList'),
      parentStatusList: $('parentStatusList'),
      dependencyIdsInput: $('dependencyIdsInput'),
      dependencyStatusList: $('dependencyStatusList'),
      payloadPreview: $('payloadPreview'),
      payloadPreviewExpandButton: $('payloadPreviewExpandButton'),
      preparedMeta: $('preparedMeta'),
      duplicateWarning: $('duplicateWarning'),
      duplicateText: $('duplicateText'),
      allowDuplicateInput: $('allowDuplicateInput'),
      resumeNotice: $('resumeNotice'),
      batchGuide: $('batchGuide'),
      batchGuideTitle: $('batchGuideTitle'),
      batchGuideStatus: $('batchGuideStatus'),
      prepareButton: $('prepareButton'),
      inscribeButton: $('inscribeButton'),
      resetInscriberButton: $('resetInscriberButton'),
      clearInscriberButton: $('clearInscriberButton'),
      processingNotice: $('processingNotice'),
      stepBegin: $('stepBegin'),
      stepUpload: $('stepUpload'),
      stepSeal: $('stepSeal'),
      txLog: $('txLog'),
      walletTokenUriHeadPreview: $('walletTokenUriHeadPreview'),
      walletSubtitle: $('walletSubtitle'),
      walletCountBadge: $('walletCountBadge'),
      walletPrevButton: $('walletPrevButton'),
      walletNextButton: $('walletNextButton'),
      walletPageReadout: $('walletPageReadout'),
      walletLookupForm: $('walletLookupForm'),
      walletLookupControl: $('walletLookupControl'),
      walletLookupInput: $('walletLookupInput'),
      walletLookupButton: $('walletLookupButton'),
      walletLookupStatus: $('walletLookupStatus'),
      walletGridStatus: $('walletGridStatus'),
      walletMarketListings: $('walletMarketListings'),
      walletMarketListingsSummary: $('walletMarketListingsSummary'),
      walletMarketListingsBody: $('walletMarketListingsBody'),
      walletMarketListingsStatus: $('walletMarketListingsStatus'),
      tokenGrid: $('tokenGrid'),
      tokenPreviewPanel: $('tokenPreviewPanel'),
      tokenPreviewMedia: $('tokenPreviewMedia'),
      tokenPreviewMeta: $('tokenPreviewMeta'),
      selectedRelationships: $('selectedRelationships'),
      selectedThread: $('selectedThread'),
      previewExpandButton: $('previewExpandButton'),
      fullscreenButton: $('fullscreenButton'),
      explorerLink: $('explorerLink'),
      xtrataExplorerLink: $('xtrataExplorerLink'),
      backToGridButton: $('backToGridButton'),
      xtrataExplorerTools: $('xtrataExplorerTools'),
      xtrataExplorerStatus: $('xtrataExplorerStatus'),
      explorerPageInput: $('explorerPageInput'),
      explorerTokenInput: $('explorerTokenInput'),
      explorerJumpButton: $('explorerJumpButton'),
      explorerRandomButton: $('explorerRandomButton'),
      explorerLatestButton: $('explorerLatestButton'),
      explorerPrevPageButton: $('explorerPrevPageButton'),
      explorerNextPageButton: $('explorerNextPageButton'),
      explorerFilterGroup: $('explorerFilterGroup'),
      explorerFilterToggle: $('explorerFilterToggle'),
      explorerClearFiltersButton: $('explorerClearFiltersButton'),
      explorerHomeLink: $('explorerHomeLink'),
      explorerFilterInputs: [...document.querySelectorAll('[data-explorer-filter]')],
      transferRecipientInput: $('transferRecipientInput'),
      transferButton: $('transferButton'),
      transferStatus: $('transferStatus'),
      fullscreenViewer: $('fullscreenViewer'),
      fullscreenTitle: $('fullscreenTitle'),
      fullscreenMeta: $('fullscreenMeta'),
      fullscreenStage: $('fullscreenStage'),
      fullscreenRawLink: $('fullscreenRawLink'),
      fullscreenPrevButton: $('fullscreenPrevButton'),
      fullscreenNextButton: $('fullscreenNextButton'),
      fullscreenCloseButton: $('fullscreenCloseButton'),
      introConnectButton: $('introConnectButton'),
      introPrepareButton: $('introPrepareButton'),
      introMyWalletLink: $('introMyWalletLink'),
      registryModeBadge: $('registryModeBadge'),
      registryIntroLead: $('registryIntroLead'),
      introNetworkValue: $('introNetworkValue'),
      introContractValue: $('introContractValue'),
      introStateValue: $('introStateValue')
    };



        const WALLET_SHOWCASE_DEFAULT_TOKEN_IDS = Object.freeze({
          'dyle.btc': 296n
        });

        const CURATED_GALLERY_DEFAULT_TOKEN_IDS = Object.freeze({
          'code-various': 287n
        });

        // Per-gallery read clients: a gallery may pin a specific core in the
        // lineage (e.g. v1 origins reads xtrata-v1-1-1). Cached by contract id.
        const galleryReadClientCache = new Map();
        const getGalleryReadClient = (contractId) => {
          if (!contractId) {
            return null;
          }
          if (galleryReadClientCache.has(contractId)) {
            return galleryReadClientCache.get(contractId);
          }
          const entry = findContractById(contractId);
          const client = entry ? createXtrataClient({ contract: entry }) : null;
          galleryReadClientCache.set(contractId, client);
          return client;
        };

        // Content fallback lineage: when reading the primary core misses the
        // bytes (e.g. a token migrated v1->v2->v3 leaves its content stranded on
        // v1, because v3's get-chunk only delegates one hop), try the legacy
        // cores in order [v2, v1]. Migration preserves the id, so the same id is
        // read on each. Only used when reading the primary core.
        const V1_CORE_CONTRACT_ID =
          'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v1-1-1';
        const getContentFallbackClients = (contentClient) => {
          if (contentClient !== state.client) {
            return null;
          }
          const lineage = [];
          if (state.legacyClient) {
            lineage.push(state.legacyClient);
          }
          const v1Client = getGalleryReadClient(V1_CORE_CONTRACT_ID);
          if (v1Client && v1Client !== state.client && !lineage.includes(v1Client)) {
            lineage.push(v1Client);
          }
          return lineage.length > 0 ? lineage : null;
        };
        const getActiveGalleryReadClient = () => {
          if (!state.curatedGalleryId) {
            return null;
          }
          const gallery = CURATED_GALLERIES.find(
            (entry) => entry.id === state.curatedGalleryId
          );
          return gallery?.contractId
            ? getGalleryReadClient(gallery.contractId)
            : null;
        };

        let activeExampleDescriptionKey = null;



    const setExampleDescription = (key) => {
      const info = EXAMPLE_VIEW_DESCRIPTIONS[key] ?? null;

      document.querySelectorAll('.wallet-example-chip').forEach((button) => {
        const buttonKey =
          button.dataset.walletShowcase?.trim().toLowerCase() ??
          button.dataset.curatedGallery?.trim() ??
          (button.dataset.latestView ? 'latest' : '') ??
          '';

        const buttonInfo = EXAMPLE_VIEW_DESCRIPTIONS[buttonKey] ?? null;

        if (buttonInfo) {
          button.title = buttonInfo.tooltip || buttonInfo.description;
        }

        button.classList.toggle('is-active', !!info && buttonKey === key);
      });

      const descriptionEl = document.getElementById('walletExampleDescription');

      if (descriptionEl) {
        descriptionEl.hidden = true;
        descriptionEl.innerHTML = '';
      }

      updateWalletLookupStatus();
    };

      const clearExampleDescription = () => {
        activeExampleDescriptionKey = null;
        setExampleDescription(null);
      };

    const loadTheme = () => {
      try {
        const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
        return THEME_IDS.has(saved) ? saved : 'monochrome';
      } catch (error) {
        return 'monochrome';
      }
    };
    const applyTheme = (theme) => {
      const nextTheme = THEME_IDS.has(theme) ? theme : 'monochrome';
      document.body.dataset.theme = nextTheme;
      if (dom.themeSelect) {
        dom.themeSelect.value = nextTheme;
      }
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      } catch (error) {}
    };

    const state = {
      contract: DEFAULT_CONTRACT,
      client: null,
      legacyContract: null,
      legacyClient: null,
      walletSession: walletAdapter.getSession(),
      walletViewAddress: null,
      walletViewName: null,
      connectedWalletNameAddress: null,
      connectedWalletName: null,
      connectedWalletNameResolved: false,
      connectedWalletNamePending: false,
      connectedWalletNameRequestId: 0,
      // Reverse-resolved BNS name for a viewed (looked-up) address. Display-only:
      // never fed back into the lookup state machine.
      walletViewResolvedName: null,
      walletViewResolvedNameAddress: null,
      walletViewResolvedNameRequestId: 0,
      curatedGalleryId: null,
      curatedGalleryTitle: null,
      homeLatestView: false,
      walletLookupPending: false,
      walletLookupNotice: null,
      walletLookupAbortController: null,
      walletViewRequestId: 0,
      transferPending: false,
      adminStatus: null,
      selectedFile: null,
      prepared: null,
      lastMintAttempt: null,
      handoffDependencyIds: [],
      parentIds: [],
      parentStatusById: new Map(),
      parentStatusMessage: null,
      parentChecking: false,
      parentCheckRequestId: 0,
      duplicateId: null,
      uploadState: null,
      busy: false,
      tokenUriPreviewRequestId: 0,
      walletTokenUriPreviewRequestId: 0,
      tokenUriPreviewTimer: null,
      payloadPreviewUrl: null,
      tokenPreviewUrl: null,
      tokenPreviewTokenId: null,
      tokenPreviewBytes: null,
      tokenPreviewMimeType: null,
      tokenPreviewSourceUrl: null,
      tokenPreviewHtmlDoc: null,
      tokenPreviewRequestId: 0,
      selectedOwnerNameRequestId: 0,
      selectedEscrowHolderRequestId: 0,
      // Last resolved escrow holder for the selected token, so re-renders
      // (e.g. from the BNS owner-name path) keep showing the real holder +
      // listed state instead of racing back to the helper contract owner.
      selectedEscrowHolder: null,
      selectedParentsRequestId: 0,
      selectedChildrenRequestId: 0,
      selectedThreadRequestId: 0,
      childScanRunning: false,
      childScanCancel: false,
      childScanTokenId: null,
      fullscreenUrl: null,
      fullscreenOpen: false,
      fullscreenSource: null,
      tokenThumbUrls: new Map(),
      thumbnailCache: new Map(),
      gridLiveMediaCache: new Map(),
      summaryCacheScopes: new Map(),
      escrowHolderCache: new Map(),
      twinReverseIndexCache: new Map(),
      thumbnailHydrationQueue: [],
      thumbnailHydrationQueued: new Set(),
      thumbnailHydrationInFlight: new Set(),
      thumbnailHydrationAttempted: new Set(),
      thumbnailHydrationRunId: 0,
      walletTokenIds: [],
      walletPageIds: [],
      walletTotalCount: 0,
      walletUsesPagedHoldings: false,
      // Forever Twins escrowed on behalf of the viewed wallet (the wallet holds
      // the original Pepe/Leo; the Xtrata twin is in the helper contract). These
      // are injected onto page 0 of the wallet grid, marked with the padlock.
      escrowTwinInjection: { address: null, ids: [], requestId: 0 },
      walletMarketListings: { address: null, listings: [], requestId: 0 },
      walletTokenCache: new Map(),
      walletTokens: [],
      walletPageIndex: 0,
      walletLoadingPage: false,
      selectedTokenId: null,
      connectedWalletMatureMode: false,
      explorerMode: false,
      explorerInitialTokenId: null,
      explorerLatestTokenId: null,
      explorerFilterKinds: new Set(),
      explorerFilteredTokenIds: [],
      explorerIndexedSummaryIds: new Set(),
      explorerFilterIndexContractId: null,
      explorerFilterIndexLoading: false,
      explorerFilterIndexComplete: false,
      explorerFilterBackgroundLoading: false,
      explorerFiltersCollapsed: true,
      explorerFollowLatestFiltered: false,
      explorerFilterIndexRunId: 0,
      lastSubmittedTxId: null,
      usdPriceBook: null,
      usdPriceBookLoading: false
    };


    const sleep = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

    const waitForGridPaint = () =>
      new Promise((resolve) => {
        if (typeof window.requestAnimationFrame !== 'function') {
          window.setTimeout(resolve, 0);
          return;
        }
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(resolve);
        });
      });

    const isAscii = (value) => /^[\x00-\x7F]*$/.test(value);

    const nowLabel = () =>
      new Intl.DateTimeFormat(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(new Date());

    const debugSessionStartedAt = performance.now();
    const padTimeUnit = (value, width = 2) =>
      String(value).padStart(width, '0');
    const debugTimecode = () => {
      const now = new Date();
      const elapsedMs = Math.round(performance.now() - debugSessionStartedAt);
      return {
        clock: [
          padTimeUnit(now.getHours()),
          padTimeUnit(now.getMinutes()),
          padTimeUnit(now.getSeconds())
        ].join(':') + `.${padTimeUnit(now.getMilliseconds(), 3)}`,
        elapsedMs
      };
    };

    const normalizeTxId = (payload) => {
      if (typeof payload === 'string' && payload.length > 0) {
        return payload;
      }
      const raw = payload?.txId ?? payload?.txid ?? '';
      return typeof raw === 'string' && raw.length > 0 ? raw : 'submitted';
    };

    const formatTokenId = (id) => `#${id.toString()}`;

    const normalizeAddress = (value) => value?.trim().toUpperCase() ?? '';

    const addressesEqual = (left, right) => {
      const a = normalizeAddress(left);
      const b = normalizeAddress(right);
      return a.length > 0 && a === b;
    };

    const runReadOnlyLimited = async (items, limit, task) => {
      const results = new Array(items.length);
      let cursor = 0;
      const workers = Array.from(
        { length: Math.max(1, Math.min(limit, items.length)) },
        async () => {
          while (cursor < items.length) {
            const index = cursor;
            cursor += 1;
            results[index] = await task(items[index], index);
          }
        }
      );
      await Promise.all(workers);
      return results;
    };

    const supportsParentRelationships = () =>
      resolveContractCapabilities(state.contract).supportsRelationships === true;

    const renderParentSelection = () => {
      const parentIds = state.parentIds ?? [];
      const supportsParents = supportsParentRelationships();
      dom.parentIdsInput.disabled = state.busy || !supportsParents;
      dom.addParentsButton.disabled =
        state.busy || !supportsParents || !dom.parentIdsInput.value.trim();
      dom.clearParentsButton.disabled = state.busy || parentIds.length === 0;
      dom.parentRelationshipBadge.textContent = supportsParents
        ? parentIds.length > 0
          ? `${parentIds.length} selected`
          : 'optional'
        : 'v3 required';
      dom.parentChipList.replaceChildren();
      const pickContractId = getContractId(state.contract);
      for (const id of parentIds) {
        const status = state.parentStatusById.get(id.toString());
        const tone =
          status?.status === 'owned'
            ? 'ok'
            : status?.status === 'missing' || status?.status === 'not-owned'
              ? 'error'
              : status?.status === 'error'
                ? 'warn'
                : '';
        const tile = document.createElement('div');
        tile.className = `parent-thumb parent-thumb--pick${tone ? ` parent-thumb--${tone}` : ''}`;
        tile.dataset.tokenId = id.toString();
        tile.dataset.contractId = pickContractId;
        const media = document.createElement('span');
        media.className = 'parent-thumb__media';
        media.dataset.tokenId = id.toString();
        media.dataset.contractId = pickContractId;
        setTokenThumbLabel(media, 'loading');
        const tag = document.createElement('span');
        tag.className = 'parent-thumb__id';
        tag.textContent = formatTokenId(id);
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'parent-thumb__remove';
        remove.textContent = '✕';
        remove.title = `Remove parent ${formatTokenId(id)}`;
        remove.setAttribute('aria-label', `Remove parent ${formatTokenId(id)}`);
        remove.disabled = state.busy;
        remove.addEventListener('click', () => removeParentId(id));
        tile.append(media, tag, remove);
        dom.parentChipList.append(tile);
      }
      void hydrateRelationGroupSummaries(
        pickContractId,
        parentIds,
        dom.parentChipList,
        'Parent'
      );
      dom.parentStatusList.replaceChildren();
      if (!supportsParents) {
        dom.parentStatusList.textContent =
          'Parent-child links require a v3 relationship-aware contract.';
        return;
      }
      if (parentIds.length === 0) {
        dom.parentStatusList.textContent = 'No parents selected.';
        return;
      }
      if (state.parentStatusMessage) {
        const message = document.createElement('div');
        message.textContent = state.parentStatusMessage;
        dom.parentStatusList.append(message);
      }
      for (const id of parentIds) {
        const key = id.toString();
        const status = state.parentStatusById.get(key);
        const pill = document.createElement('span');
        let tone = '';
        let label = state.parentChecking ? 'checking' : 'pending';
        if (status?.status === 'owned') {
          tone = 'ok';
          label = 'in wallet';
        } else if (status?.status === 'missing') {
          tone = 'error';
          label = 'missing';
        } else if (status?.status === 'not-owned') {
          tone = 'error';
          label = 'not in wallet';
        } else if (status?.status === 'error') {
          tone = 'warn';
          label = 'check failed';
        }
        pill.className = `relationship-status${tone ? ` ${tone}` : ''}`;
        pill.textContent = `#${key}: ${label}`;
        dom.parentStatusList.append(pill);
      }
    };

    const getParentBlockingMessage = () => {
      const parentIds = state.parentIds ?? [];
      if (parentIds.length === 0) {
        return null;
      }
      if (!supportsParentRelationships()) {
        return 'Parent-child links require a v3 relationship-aware contract.';
      }
      if (!state.walletSession.isConnected || !state.walletSession.address) {
        return 'Connect the wallet that owns every selected parent inscription.';
      }
      if (state.parentChecking) {
        return 'Waiting for parent ownership checks to finish.';
      }
      if (state.parentStatusMessage?.startsWith('Parent check failed')) {
        return state.parentStatusMessage;
      }
      for (const id of parentIds) {
        const status = state.parentStatusById.get(id.toString());
        if (!status || status.status === 'pending') {
          return 'Waiting for parent ownership checks to finish.';
        }
        if (status.status === 'missing') {
          return `Parent ID #${id.toString()} was not found on-chain.`;
        }
        if (status.status === 'not-owned') {
          return `Parent ID #${id.toString()} is not in the connected wallet.`;
        }
        if (status.status === 'error') {
          return `Parent ID #${id.toString()} could not be confirmed.`;
        }
      }
      return null;
    };

    const refreshParentChecks = async () => {
      const parentIds = state.parentIds ?? [];
      const requestId = state.parentCheckRequestId + 1;
      state.parentCheckRequestId = requestId;
      state.parentStatusById = new Map();
      state.parentStatusMessage = null;
      if (parentIds.length === 0 || !supportsParentRelationships()) {
        state.parentChecking = false;
        renderParentSelection();
        updateControls();
        return;
      }
      if (!state.walletSession.isConnected || !state.walletSession.address) {
        state.parentChecking = false;
        state.parentStatusMessage =
          'Connect the wallet that owns every selected parent inscription.';
        renderParentSelection();
        updateControls();
        return;
      }
      state.parentChecking = true;
      state.parentStatusMessage = 'Checking selected parents in the connected wallet.';
      renderParentSelection();
      updateControls();
      try {
        const sender = state.walletSession.address;
        const owners = await runReadOnlyLimited(parentIds, 4, (id) =>
          state.client.getOwner(id, sender)
        );
        if (requestId !== state.parentCheckRequestId) {
          return;
        }
        const nextStatus = new Map();
        parentIds.forEach((id, index) => {
          const owner = owners[index];
          const status = !owner
            ? 'missing'
            : addressesEqual(owner, sender)
              ? 'owned'
              : 'not-owned';
          nextStatus.set(id.toString(), { status, owner: owner ?? null });
        });
        state.parentStatusById = nextStatus;
        state.parentStatusMessage = null;
      } catch (error) {
        if (requestId !== state.parentCheckRequestId) {
          return;
        }
        const message = error instanceof Error ? error.message : String(error);
        state.parentStatusMessage = `Parent check failed: ${message}`;
        state.parentStatusById = new Map(
          parentIds.map((id) => [id.toString(), { status: 'error', owner: null }])
        );
      } finally {
        if (requestId === state.parentCheckRequestId) {
          state.parentChecking = false;
          renderParentSelection();
          updateControls();
        }
      }
    };

    const markRelationshipPreparedDirty = () => {
      state.prepared = null;
      state.duplicateId = null;
      state.uploadState = null;
      resetSteps();
      renderPreparedState();
    };

    const applyParentInput = () => {
      const parsed = parseDependencyInput(dom.parentIdsInput.value);
      if (parsed.invalidTokens.length > 0) {
        state.parentStatusMessage = `Invalid parent IDs: ${parsed.invalidTokens.join(', ')}.`;
        renderParentSelection();
        updateControls();
        return;
      }
      if (parsed.ids.length === 0) {
        state.parentStatusMessage = 'Enter at least one parent ID.';
        renderParentSelection();
        updateControls();
        return;
      }
      const merged = mergeDependencySources(state.parentIds ?? [], parsed.ids);
      const validation = validateDependencyIds(merged);
      if (!validation.ok) {
        state.parentStatusMessage =
          validation.reason === 'max-50'
            ? 'A maximum of 50 parent IDs is allowed.'
            : 'Parent IDs are invalid.';
        renderParentSelection();
        updateControls();
        return;
      }
      state.parentIds = merged;
      dom.parentIdsInput.value = '';
      state.parentStatusMessage = null;
      markRelationshipPreparedDirty();
      void refreshParentChecks();
    };

    const removeParentId = (id) => {
      state.parentIds = (state.parentIds ?? []).filter((value) => value !== id);
      markRelationshipPreparedDirty();
      void refreshParentChecks();
    };

    const clearParentIds = () => {
      state.parentIds = [];
      state.parentStatusById = new Map();
      state.parentStatusMessage = null;
      dom.parentIdsInput.value = '';
      markRelationshipPreparedDirty();
      renderParentSelection();
      updateControls();
    };

    const isLikelyStacksAddressInput = (value) =>
      /^S[PTMN][A-Z0-9]*$/i.test(value.trim());

    const isSupportiveLogMessage = (message) =>
      message.startsWith('No problem') ||
      message.startsWith('Existing upload data') ||
      message.startsWith('On-chain confirmed');

    const toBtcLookupLabel = (value) => {
      const trimmed = value.trim().toLowerCase();
      const withoutSuffix = trimmed.replace(/\.btc$/i, '');
      return withoutSuffix.split('.')[0].replace(/[^a-z0-9-]/g, '');
    };

    const normalizeWalletLookupInputValue = (value) => {
      const compact = value.trim().replace(/\s+/g, '');
      if (!compact) {
        return '';
      }
      if (isLikelyStacksAddressInput(compact)) {
        return compact.toUpperCase();
      }
      return toBtcLookupLabel(compact);
    };

    const updateWalletLookupInputMode = () => {
      const value = dom.walletLookupInput.value.trim();
      dom.walletLookupControl.classList.toggle('is-address', isLikelyStacksAddressInput(value));
    };

    const normalizeWalletLookupField = () => {
      const nextValue = normalizeWalletLookupInputValue(dom.walletLookupInput.value);
      if (dom.walletLookupInput.value !== nextValue) {
        dom.walletLookupInput.value = nextValue;
      }
      updateWalletLookupInputMode();
      return nextValue;
    };

    const getWalletLookupSubmitValue = () => {
      const inputValue = normalizeWalletLookupField();
      if (!inputValue) {
        return '';
      }
      const directLookup = getWalletLookupState(inputValue, state.walletSession.address ?? null);
      if (directLookup.lookupAddress || isLikelyStacksAddressInput(inputValue)) {
        return inputValue;
      }
      return `${inputValue}.btc`;
    };

    const contractExplorerUrl = (contract) =>
      `https://explorer.hiro.so/address/${encodeURIComponent(getContractId(contract))}?chain=${contract.network}`;

    const tokenExplorerUrl = (contract, id) =>
      `${contractExplorerUrl(contract)}&token_id=${id.toString()}`;

    const inscriptionEndpointUrl = (id) =>
      new URL(`/inscription/${encodeURIComponent(id.toString())}`, window.location.origin).toString();

    const parsePositiveBigInt = (value) => {
      const normalized = String(value ?? '').trim();
      if (!/^\d+$/.test(normalized)) {
        return null;
      }
      const parsed = BigInt(normalized);
      return parsed > 0n ? parsed : null;
    };

    const findContractById = (value) => {
      const target = String(value ?? '').trim();
      if (!target) {
        return null;
      }
      const targetLower = target.toLowerCase();
      return (
        ACTIVE_CONTRACTS.find((entry) => getContractId(entry).toLowerCase() === targetLower) ??
        CONTRACT_REGISTRY.find((entry) => getContractId(entry).toLowerCase() === targetLower) ??
        ACTIVE_CONTRACTS.find((entry) => entry.contractName?.toLowerCase() === targetLower) ??
        CONTRACT_REGISTRY.find((entry) => entry.contractName?.toLowerCase() === targetLower) ??
        null
      );
    };

    const getPrettyExplorerRequest = () => {
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      const route = pathParts[0]?.toLowerCase() ?? '';
      if (route === 'xplorer' && pathParts.length === 1) {
        return { enabled: true, tokenId: null };
      }
      if (route === 'x') {
        if (pathParts.length === 1) {
          return { enabled: true, tokenId: null };
        }
        if (pathParts.length === 2) {
          const tokenId = parsePositiveBigInt(pathParts[1]);
          return { enabled: tokenId !== null, tokenId };
        }
      }
      return { enabled: false, tokenId: null };
    };

    const getExplorerRequest = () => {
      const params = new URLSearchParams(window.location.search);
      const prettyRequest = getPrettyExplorerRequest();
      const view = params.get('view')?.trim().toLowerCase() ?? '';
      const enabled =
        prettyRequest.enabled ||
        view === 'explorer' ||
        params.has('explorer') ||
        params.has('token') ||
        params.has('inscription');
      if (!enabled) {
        return { enabled: false, contract: null, tokenId: null };
      }
      const contract = findContractById(params.get('contract')) ?? DEFAULT_CONTRACT;
      const tokenId =
        prettyRequest.tokenId ??
        parsePositiveBigInt(params.get('token')) ??
        parsePositiveBigInt(params.get('inscription')) ??
        parsePositiveBigInt(params.get('explorer'));
      return { enabled: true, contract, tokenId };
    };

    const xtrataExplorerUrl = (contract, id = null) => {
      const url = new URL(window.location.href);
      url.hash = '';
      url.search = '';
      if (id !== null && getContractId(contract) === getContractId(DEFAULT_CONTRACT)) {
        url.pathname = `/x/${encodeURIComponent(id.toString())}`;
        return url.toString();
      }
      if (id === null && getContractId(contract) === getContractId(DEFAULT_CONTRACT)) {
        url.pathname = '/xplorer';
        return url.toString();
      }
      url.searchParams.set('view', 'explorer');
      url.searchParams.set('contract', getContractId(contract));
      if (id !== null) {
        url.searchParams.set('token', id.toString());
      }
      return url.toString();
    };

    const appendLog = (message, tone = '') => {
      const item = document.createElement('li');
      const time = document.createElement('time');
      const body = document.createElement('span');
      if (tone === 'support' || isSupportiveLogMessage(message)) {
        item.classList.add('support');
      }
      if (tone && tone !== 'support') {
        item.classList.add(tone);
      }
      time.textContent = nowLabel();
      body.textContent = message;
      item.append(time, body);
      dom.txLog.prepend(item);
      while (dom.txLog.children.length > 24) {
        dom.txLog.lastElementChild?.remove();
      }
      console.log(`[homepage] ${message}`);
    };

    const debugLog = (scope, message, details = {}, level = 'info') => {
      const method = level === 'warn' ? 'warn' : level === 'error' ? 'error' : 'info';
      const timecode = debugTimecode();
      const payload =
        details && typeof details === 'object' && !Array.isArray(details)
          ? {
              ...details,
              timecode: timecode.clock,
              elapsedMs: timecode.elapsedMs
            }
          : {
              details,
              timecode: timecode.clock,
              elapsedMs: timecode.elapsedMs
            };
      console[method](
        `[homepage:${scope} ${timecode.clock} +${(timecode.elapsedMs / 1000).toFixed(3)}s] ${message}`,
        payload
      );
    };

    const applyPixelPerfectImageRendering = (
      img,
      {
        mimeType = null,
        sourceUrl = null,
        isSvgSource = false,
        squareFrame = false
      } = {}
    ) => {
      const updateRendering = () => {
        if (squareFrame) {
          const squareFrameStyle = getSquareFramedImageStyle({
            sourceWidth: img.naturalWidth || 0,
            sourceHeight: img.naturalHeight || 0,
            referenceSizeFloor: THUMBNAIL_SIZE
          });
          if (squareFrameStyle) {
            Object.assign(img.style, squareFrameStyle);
          }
        }
        const rect = img.getBoundingClientRect();
        const normalizedMime = (mimeType ?? '').toLowerCase();
        const urlLower = (sourceUrl ?? img.currentSrc ?? img.src ?? '').toLowerCase();
        const resolvedSvgSource =
          isSvgSource ||
          normalizedMime.includes('svg') ||
          urlLower.startsWith('data:image/svg') ||
          urlLower.includes('.svg');
        const pixelated = shouldUsePixelatedImageRendering({
          naturalWidth: img.naturalWidth || 0,
          naturalHeight: img.naturalHeight || 0,
          renderedWidth: rect.width,
          renderedHeight: rect.height,
          mimeType,
          isSvgSource: resolvedSvgSource
        });
        img.classList.toggle('preview-media--pixelated', pixelated);
      };
      const scheduleUpdate = () => {
        requestAnimationFrame(updateRendering);
      };
      img.addEventListener('load', scheduleUpdate);
      if (img.complete && img.naturalWidth > 0) {
        scheduleUpdate();
      }
    };

    const getPreviewCanvasSize = (target) => {
      const rect = target.getBoundingClientRect();
      const cssSize = Math.max(
        1,
        Math.round(Math.min(
          rect.width || target.clientWidth || 512,
          rect.height || target.clientHeight || rect.width || target.clientWidth || 512
        ))
      );
      const pixelRatio = Math.min(Math.max(window.devicePixelRatio || 1, 1), 2);
      return {
        cssSize,
        pixelSize: Math.max(1, Math.round(cssSize * pixelRatio))
      };
    };

    const drawSquareImagePreview = (canvas, image, target, { mimeType = null, isSvgSource = false } = {}) => {
      const { pixelSize } = getPreviewCanvasSize(target);
      const sourceWidth = image.naturalWidth || image.videoWidth || image.width || pixelSize;
      const sourceHeight = image.naturalHeight || image.videoHeight || image.height || pixelSize;
      if (!Number.isFinite(sourceWidth) || !Number.isFinite(sourceHeight) || sourceWidth <= 0 || sourceHeight <= 0) {
        return false;
      }
      canvas.width = pixelSize;
      canvas.height = pixelSize;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return false;
      }
      const referenceSize = Math.max(sourceWidth, sourceHeight, THUMBNAIL_SIZE);
      const scale = pixelSize / referenceSize;
      const targetWidth = Math.max(1, Math.round(sourceWidth * scale));
      const targetHeight = Math.max(1, Math.round(sourceHeight * scale));
      const dx = Math.round((pixelSize - targetWidth) / 2);
      const dy = Math.round((pixelSize - targetHeight) / 2);
      const usePixelatedRendering = shouldUsePixelatedImageRendering({
        naturalWidth: sourceWidth,
        naturalHeight: sourceHeight,
        renderedWidth: targetWidth,
        renderedHeight: targetHeight,
        mimeType,
        isSvgSource
      });
      ctx.imageSmoothingEnabled = !usePixelatedRendering;
      if (!usePixelatedRendering) {
        ctx.imageSmoothingQuality = 'high';
      }
      ctx.clearRect(0, 0, pixelSize, pixelSize);
      ctx.drawImage(image, dx, dy, targetWidth, targetHeight);
      canvas.classList.toggle('preview-media--pixelated', usePixelatedRendering);
      debugLog('preview', 'square canvas image preview drawn', {
        sourceWidth,
        sourceHeight,
        canvasSize: pixelSize,
        referenceSize,
        targetWidth,
        targetHeight,
        offsetX: dx,
        offsetY: dy,
        mimeType,
        pixelated: usePixelatedRendering
      });
      return true;
    };

    const renderSquareImagePreview = (
      target,
      sourceUrl,
      {
        mimeType = null,
        isSvgSource = false,
        alt = 'Image preview',
        preserveAnimation = false,
        replayDelayMs = null,
        onError = null
      } = {}
    ) => {
      const renderNativeImage = () => {
        const img = document.createElement('img');
        img.alt = alt;
        img.classList.add('preview-image--truthful');
        applyPixelPerfectImageRendering(img, {
          mimeType,
          sourceUrl,
          isSvgSource,
          squareFrame: true
        });
        if (onError) {
          img.addEventListener('error', onError, { once: true });
        }
        img.src = sourceUrl;
        target.replaceChildren(img);
        if (Number.isFinite(replayDelayMs) && replayDelayMs > 0) {
          const replay = () => {
            if (!img.isConnected || img.parentElement !== target) {
              return;
            }
            img.src = '';
            requestAnimationFrame(() => {
              if (!img.isConnected || img.parentElement !== target) {
                return;
              }
              img.src = sourceUrl;
              window.setTimeout(replay, replayDelayMs);
            });
          };
          window.setTimeout(replay, replayDelayMs);
        }
      };

      // SVG/XML image animation runs inside the image document. Drawing it to a
      // canvas captures only the current frame, so keep SVG sources live.
      if (preserveAnimation || isSvgSource) {
        renderNativeImage();
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.className = 'preview-image-canvas';
      canvas.setAttribute('role', 'img');
      canvas.setAttribute('aria-label', alt);
      target.replaceChildren(canvas);

      const img = document.createElement('img');
      img.decoding = 'async';
      img.onload = () => {
        if (!drawSquareImagePreview(canvas, img, target, { mimeType, isSvgSource })) {
          renderNativeImage();
        }
      };
      img.onerror = onError ?? renderNativeImage;
      img.src = sourceUrl;
    };

    const playPreviewVideoWhenReady = (video) => {
      const play = () => {
        const playAttempt = video.play();
        if (playAttempt && typeof playAttempt.catch === 'function') {
          void playAttempt.catch(() => {});
        }
      };
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        play();
        return;
      }
      video.addEventListener('loadeddata', play, { once: true });
    };

    const getBuildHiroKeyFlag = () => {
      try {
        return typeof __XSTRATA_HAS_HIRO_KEY__ !== 'undefined'
          ? Boolean(__XSTRATA_HAS_HIRO_KEY__)
          : null;
      } catch (error) {
        return null;
      }
    };

    const summarizeApiBase = (baseUrl) => ({
      baseUrl,
      usesHiroProxy:
        baseUrl.startsWith('/hiro/') ||
        (typeof window !== 'undefined' &&
          baseUrl.startsWith(`${window.location.origin}/hiro/`)),
      sameOrigin:
        baseUrl.startsWith('/') ||
        (typeof window !== 'undefined' &&
          baseUrl.startsWith(window.location.origin))
    });

    const logApiConfiguration = () => {
      const apiBases = getApiBaseUrls(state.contract.network).map(summarizeApiBase);
      debugLog('api', 'resolved API configuration', {
        network: state.contract.network,
        contractId: getContractId(state.contract),
        buildHasHiroKey: getBuildHiroKeyFlag(),
        apiBases
      });
    };

    const setStatus = (element, message, badgeLabel = 'idle', badgeTone = 'amber') => {
      element.dataset.status = badgeLabel;
      element.innerHTML = '';
      const text = document.createElement('span');
      text.innerHTML = message;
      const badge = document.createElement('span');
      badge.className = `badge ${badgeTone}`;
      badge.textContent = badgeLabel;
      element.append(text, badge);
    };

    const setStep = (key, status, label) => {
      const step =
        key === 'begin'
          ? dom.stepBegin
          : key === 'upload'
            ? dom.stepUpload
            : dom.stepSeal;
      step.className = `step ${status === 'idle' ? '' : status}`;
      step.querySelector('span').textContent = label;
    };

    const resetSteps = () => {
      setStep('begin', 'idle', 'Idle');
      setStep('upload', 'idle', 'Idle');
      setStep('seal', 'idle', 'Idle');
    };

    const getFeeUnitNumber = () => {
      const value = state.adminStatus?.feeUnitMicroStx;
      if (value === null || value === undefined) {
        return null;
      }
      const asNumber = Number(value);
      return Number.isSafeInteger(asNumber) && asNumber > 0 ? asNumber : null;
    };

    const getFeeEstimate = (totalChunks = state.prepared?.chunks.length ?? 0) =>
      estimateContractFees({
        schedule: getFeeSchedule(state.contract, getFeeUnitNumber()),
        totalChunks
      });

    const loadUsdPriceBook = async () => {
      if (state.usdPriceBook || state.usdPriceBookLoading) {
        return;
      }
      state.usdPriceBookLoading = true;
      renderPreparedState();
      try {
        state.usdPriceBook = await fetchUsdPriceBook();
      } catch (error) {
        state.usdPriceBook = null;
      } finally {
        state.usdPriceBookLoading = false;
        renderPreparedState();
      }
    };

    const getLiveStxUsdRateLabel = () => {
      const quote = getUsdPriceQuote(state.usdPriceBook, 'stx');
      if (quote) {
        return `1 STX = $${quote.usd.toFixed(quote.usd >= 1 ? 2 : 4)}`;
      }
      return state.usdPriceBookLoading ? 'Fetching...' : 'Unavailable';
    };

    // Network (miner) fee for a contract call carrying `byteLength` payload
    // bytes. Base rate is ~1 STX/MB, but large calls need headroom above the
    // mempool minimum (the wallet's own default floors near 0.0005 STX and is
    // rejected for big inscriptions). We add a margin + a small floor, and use
    // this for BOTH the displayed estimate and the fee passed to the wallet so
    // the prompt matches the panel.
    const walletMinerFeeMicroStx = (byteLength) => {
      const base = estimateDataMiningFeeMicroStx(BigInt(byteLength));
      const withHeadroom = (base * 5n) / 4n; // +25% over the 1 STX/MB base
      const floor = 6_000n; // ~0.006 STX so tiny calls still clear the mempool
      return withHeadroom > floor ? withHeadroom : floor;
    };

    const formatDataMiningEstimate = (bytes) => {
      const miningFeeMicroStx = walletMinerFeeMicroStx(bytes.length);
      const display = formatMicroStxWithUsd(miningFeeMicroStx, state.usdPriceBook);
      return {
        miningFeeMicroStx,
        label: display.combined,
        detail: `${display.combined} network fee (set automatically in the wallet)`
      };
    };

    const formatEstimatedTotalFees = (feeEstimate, miningFeeMicroStx) =>
      formatMicroStxWithUsd(
        BigInt(Math.max(0, Math.round(feeEstimate.totalMicroStx))) +
          miningFeeMicroStx,
        state.usdPriceBook
      ).combined;

    const formatExtraFee = (feeEstimate) =>
      formatMicroStxWithUsd(
        BigInt(Math.max(0, Math.round(feeEstimate.totalMicroStx))),
        state.usdPriceBook
      ).combined;

    const getPreparedTransactionCount = (usesSingleTx, estimate) =>
      usesSingleTx ? 1 : estimate.totalTransactions;

    const getSmallMintHelperContract = () =>
      state.contract.network === 'mainnet' &&
      getContractId(state.contract) === SMALL_MINT_HELPER_TARGET_CORE_CONTRACT_ID
        ? {
            address: SMALL_MINT_HELPER_MAINNET_ADDRESS,
            contractName: SMALL_MINT_HELPER_CONTRACT_NAME,
            network: 'mainnet'
          }
        : null;

    const smallMintEligible = () => {
      const prepared = state.prepared;
      return (
        !!prepared &&
        !state.uploadState &&
        prepared.chunks.length > 0 &&
        (prepared.dependencyIds ?? []).length <= 50 &&
        (prepared.parentIds ?? []).length <= 50 &&
        prepared.chunks.length <= SMALL_MINT_HELPER_MAX_CHUNKS
      );
    };

    // v3+ cores expose their own one-transaction mint-single-tx route, so small
    // inscriptions (<= SMALL_MINT_HELPER_MAX_CHUNKS) are minted in a single
    // wallet signature directly on the core — no 3-stage begin/upload/seal and no
    // external helper contract.
    const shouldUseNativeSingleTx = () =>
      resolveContractCapabilities(state.contract).supportsNativeSingleTx === true &&
      smallMintEligible();

    // Older cores (v2.x) lack a native single-tx route; they use the external
    // helper contract instead.
    const shouldUseSmallMintHelper = () => {
      const capabilities = resolveContractCapabilities(state.contract);
      return (
        !shouldUseNativeSingleTx() &&
        !!getSmallMintHelperContract() &&
        capabilities.version !== '1.1.1' &&
        smallMintEligible()
      );
    };

    // True when the inscription will be minted in one transaction by either path.
    const shouldUseSingleTx = () =>
      shouldUseNativeSingleTx() || shouldUseSmallMintHelper();

    const resolveFeePostConditions = (amountMicroStx) => {
      const sender = state.walletSession.address;
      if (!sender || !Number.isFinite(amountMicroStx) || amountMicroStx < 0) {
        return undefined;
      }
      // A fee post-condition only needs to CAP the sender's spend. Using an
      // exact (Equal) condition adds a "pays no less" constraint with no benefit
      // to the sender and breaks whenever the real protocol fee differs from the
      // estimate — e.g. the v3 core-native single-tx fee (single-tx-fee-unit +
      // chunks·upload-chunk-fee-unit) is far below the summed 3-stage estimate.
      // LessEqual protects the sender and tolerates the contract charging less.
      return [
        makeStandardSTXPostCondition(
          sender,
          FungibleConditionCode.LessEqual,
          BigInt(Math.round(amountMicroStx))
        )
      ];
    };

    const renderMeta = (target, lines) => {
      target.innerHTML = '';
      const widePreparedMetaKeys = new Set([
        'Transactions required',
        'Extra fee',
        'Mining fee',
        'Total estimated cost'
      ]);
      for (const line of lines) {
        const meta = Array.isArray(line)
          ? { key: line[0], value: line[1] }
          : line;
        if (meta.section) {
          const section = document.createElement('div');
          section.className = 'meta-section';
          section.textContent = meta.section;
          target.append(section);
          continue;
        }
        const row = document.createElement('div');
        row.className = 'meta-line';
        if (meta.layout) {
          row.classList.add(`meta-line--${meta.layout}`);
        }
        if (
          target === dom.preparedMeta &&
          (meta.wide || widePreparedMetaKeys.has(meta.key))
        ) {
          row.classList.add('meta-line--wide');
        }
        const label = document.createElement('span');
        label.className = 'meta-key';
        if (meta.subkey) {
          const primary = document.createElement('span');
          primary.textContent = meta.key;
          const secondary = document.createElement('span');
          secondary.className = 'meta-key__sub';
          secondary.textContent = meta.subkey;
          label.append(primary, secondary);
        } else {
          label.textContent = meta.key;
        }
        const body = meta.href
          ? document.createElement('a')
          : document.createElement('span');
        body.className = `meta-value${
          meta.valueClass ? ` ${meta.valueClass}` : ''
        }`;
        body.title = String(meta.title ?? meta.value);
        body.textContent = String(meta.value);
        if (meta.href) {
          body.href = meta.href;
          body.target = '_blank';
          body.rel = 'noreferrer';
          body.classList.add('meta-value--link');
        }
        if (meta.tooltip) {
          body.classList.add('meta-value--tooltip');
          body.dataset.tooltip = String(meta.tooltip);
          body.tabIndex = 0;
          body.setAttribute('aria-label', `${meta.key}: ${meta.tooltip}`);
        }
        if (typeof meta.onClick === 'function') {
          body.classList.add('meta-value--link');
          body.setAttribute('role', 'button');
          body.tabIndex = 0;
          if (meta.actionLabel) {
            body.setAttribute('aria-label', meta.actionLabel);
            body.title = meta.actionLabel;
          }
          const handler = (event) => {
            event.preventDefault();
            meta.onClick();
          };
          body.addEventListener('click', handler);
          body.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              handler(event);
            }
          });
        }
        row.append(label, body);
        target.append(row);
      }
    };

    const getUploadBatchProgress = (currentIndex, totalChunks) => {
      const batchSize = Math.min(DEFAULT_BATCH_SIZE, MAX_UPLOAD_BATCH_SIZE);
      const totalBatches = Math.ceil(totalChunks / batchSize);
      const confirmedBatches =
        currentIndex <= 0 ? 0 : Math.ceil(currentIndex / batchSize);
      const nextBatch = Math.min(totalBatches, confirmedBatches + 1);
      return { batchSize, totalBatches, confirmedBatches, nextBatch };
    };

    const renderBatchGuide = () => {
      if (!dom.batchGuide || !dom.batchGuideStatus || !dom.batchGuideTitle) {
        return;
      }
      const totalChunks =
        state.prepared?.chunks.length ??
        Number(state.uploadState?.totalChunks ?? state.lastMintAttempt?.totalChunks ?? 0);
      if (!Number.isSafeInteger(totalChunks) || totalChunks <= SMALL_MINT_HELPER_MAX_CHUNKS) {
        dom.batchGuide.hidden = true;
        return;
      }
      const currentIndex = Number(state.uploadState?.currentIndex ?? 0);
      const progress = getUploadBatchProgress(currentIndex, totalChunks);
      dom.batchGuideTitle.textContent =
        `${progress.totalBatches} confirmed upload transactions required`;
      dom.batchGuideStatus.textContent =
        progress.confirmedBatches >= progress.totalBatches
          ? `All ${progress.totalBatches} upload batches are confirmed. The inscription is ready to seal.`
          : `${progress.confirmedBatches} of ${progress.totalBatches} upload batches confirmed. Next: batch ${progress.nextBatch} of ${progress.totalBatches}.`;
      dom.batchGuide.hidden = false;
    };

    const renderResumeNotice = () => {
      dom.resumeNotice.hidden = true;
      dom.resumeNotice.replaceChildren();
      renderBatchGuide();
      if (!state.uploadState) {
        if (state.lastMintAttempt && !state.selectedFile) {
          const heading = document.createElement('strong');
          heading.textContent = 'Unfinished inscription remembered.';
          const body = document.createElement('span');
          body.textContent = state.lastMintAttempt.payloadBlob
            ? 'The saved file will be restored automatically.'
            : `Re-select ${state.lastMintAttempt.fileName ?? 'the original file'} to continue safely.`;
          dom.resumeNotice.append(heading, body);
          dom.resumeNotice.hidden = false;
        }
        return;
      }
      const current = state.uploadState.currentIndex.toString();
      const total = state.uploadState.totalChunks.toString();
      const progress = getUploadBatchProgress(Number(current), Number(total));
      const heading = document.createElement('strong');
      heading.textContent = 'Existing upload data found. No problem.';
      const body = document.createElement('span');
      body.textContent =
        `${current}/${total} chunks are confirmed. ${progress.confirmedBatches}/${progress.totalBatches} upload batches are complete. Click Resume inscription to continue with batch ${progress.nextBatch}/${progress.totalBatches}.`;
      dom.resumeNotice.append(heading, body);
      dom.resumeNotice.hidden = false;
    };


    // Build (and cache) the xtrata-id -> local-id map for a helper contract by
    // scanning its "inscribed" print events. This is the reverse lookup the
    // contract does not expose directly, and works for every bound token
    // (including those minted straight into escrow that never had a swap tx).
    const buildTwinReverseIndex = async (resolver) => {
      const cacheKey = resolver.helperContractId;
      const cached = state.twinReverseIndexCache.get(cacheKey);
      if (cached) {
        return cached;
      }
      const promise = (async () => {
        const index = new Map();
        const pageSize = 50;
        const maxEvents = 5000;
        let offset = 0;
        let seen = 0;
        while (seen < maxEvents) {
          let page;
          try {
            page = await fetchHiroJson(
              `/extended/v1/contract/${encodeURIComponent(
                resolver.helperContractId
              )}/events?limit=${pageSize}&offset=${offset}`,
              state.contract.network
            );
          } catch (error) {
            break;
          }
          const results = page?.results ?? [];
          if (results.length === 0) {
            break;
          }
          for (const event of results) {
            seen += 1;
            const repr = event?.contract_log?.value?.repr;
            if (
              event?.contract_log?.topic !== 'print' ||
              typeof repr !== 'string' ||
              repr.indexOf('"inscribed"') === -1
            ) {
              continue;
            }
            const localMatch = repr.match(/\(token-id u(\d+)\)/);
            const xtrataMatch = repr.match(/\(xtrata-id u(\d+)\)/);
            if (!localMatch || !xtrataMatch) {
              continue;
            }
            if (!index.has(xtrataMatch[1])) {
              index.set(xtrataMatch[1], BigInt(localMatch[1]));
            }
          }
          if (results.length < pageSize) {
            break;
          }
          offset += pageSize;
        }
        return index;
      })();
      state.twinReverseIndexCache.set(cacheKey, promise);
      promise.catch(() => state.twinReverseIndexCache.delete(cacheKey));
      return promise;
    };

    // Invert the xtrata-id -> local-id reverse index to local-id -> xtrata-id.
    const buildTwinForwardIndex = async (resolver) => {
      const reverse = await buildTwinReverseIndex(resolver);
      const forward = new Map();
      for (const [xtrataIdStr, localId] of reverse.entries()) {
        forward.set(localId.toString(), BigInt(xtrataIdStr));
      }
      return forward;
    };

    // Fetch the token ids of a source collection (Pepe/Leo) held directly by a
    // wallet, via the Hiro NFT holdings endpoint. Bounded + paginated.
    const fetchWalletSourceTokenIds = async (walletAddress, resolver, network) => {
      const assetId = `${resolver.sourceContractId}::${resolver.sourceAssetName}`;
      const ids = [];
      const pageSize = 50;
      const maxItems = 2000;
      let offset = 0;
      while (ids.length < maxItems) {
        let page;
        try {
          page = await fetchHiroJson(
            `/extended/v1/tokens/nft/holdings?principal=${encodeURIComponent(walletAddress)}` +
              `&asset_identifiers=${encodeURIComponent(assetId)}` +
              `&limit=${pageSize}&offset=${offset}`,
            network
          );
        } catch (error) {
          break;
        }
        const results = page?.results ?? [];
        for (const item of results) {
          const localId = parseUintRepr(item?.value?.repr);
          if (localId !== null) {
            ids.push(localId);
          }
        }
        const total = Number(page?.total ?? results.length);
        offset += pageSize;
        if (results.length < pageSize || offset >= total) {
          break;
        }
      }
      return ids;
    };

    // Determine the Xtrata twin ids that are escrowed on behalf of a wallet:
    // the wallet holds the original Pepe/Leo while the twin sits in the helper.
    const computeEscrowedTwinIdsForWallet = async (walletAddress, network) => {
      const seen = new Set();
      const out = [];
      const resolvers = [...PEPE_ESCROW_RESOLVERS.values()];
      for (const resolver of resolvers) {
        let sourceIds = [];
        let forward = new Map();
        try {
          [sourceIds, forward] = await Promise.all([
            fetchWalletSourceTokenIds(walletAddress, resolver, network),
            buildTwinForwardIndex(resolver)
          ]);
        } catch (error) {
          continue;
        }
        // Candidate twins: source tokens the wallet holds that have a binding.
        const candidates = sourceIds
          .map((localId) => ({ localId, xtrataId: forward.get(localId.toString()) ?? null }))
          .filter((entry) => entry.xtrataId !== null);
        // Confirm each twin is currently escrowed via the live binding.
        await runLimited(candidates, 4, async (entry) => {
          try {
            const json = await callReadOnlyJson({
              contractId: resolver.helperContractId,
              functionName: 'get-binding',
              args: [uintCV(entry.localId)],
              network
            });
            const tuple = unwrapBindingTuple(json);
            const escrowed = tuple?.['xtrata-escrowed']?.value === true;
            const xtrataId = entry.xtrataId;
            if (escrowed && xtrataId !== null && !seen.has(xtrataId.toString())) {
              seen.add(xtrataId.toString());
              out.push(xtrataId);
            }
          } catch (error) {
            // Ignore individual binding read failures.
          }
        });
      }
      // Newest twins first.
      out.sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
      return out;
    };

    // Navigate a cvToJSON (optional (tuple ...)) binding result to its tuple map.
    const unwrapBindingTuple = (node) => {
      let current = node;
      while (
        current &&
        typeof current.type === 'string' &&
        (current.type.startsWith('(optional') || current.type.startsWith('(response'))
      ) {
        current = current.value ?? null;
      }
      return current && typeof current.type === 'string' && current.type.startsWith('(tuple')
        ? current.value
        : null;
    };

    const getInjectedEscrowTwinIds = () => {
      const injection = state.escrowTwinInjection;
      if (
        state.explorerMode ||
        !injection ||
        !injection.address ||
        !addressesEqual(injection.address, getViewingWalletAddress())
      ) {
        return [];
      }
      return injection.ids;
    };

    // Kick off (once per viewed wallet) the escrowed-twin computation and, when
    // it finds any, re-render the wallet page so they appear on page 0.
    const refreshEscrowTwinInjection = async (walletAddress) => {
      if (!walletAddress || state.explorerMode) {
        return;
      }
      const requestId = (state.escrowTwinInjection.requestId ?? 0) + 1;
      state.escrowTwinInjection = { address: walletAddress, ids: [], requestId };
      let ids = [];
      try {
        ids = await computeEscrowedTwinIdsForWallet(walletAddress, state.contract.network);
      } catch (error) {
        return;
      }
      if (
        requestId !== state.escrowTwinInjection.requestId ||
        !addressesEqual(walletAddress, getViewingWalletAddress())
      ) {
        return;
      }
      state.escrowTwinInjection = { address: walletAddress, ids, requestId };
      if (ids.length > 0) {
        // Reveal the grid/ledger even when the wallet has no other inscriptions,
        // then (re)render page 0 so the escrowed twins appear and get selected.
        setExperienceMode();
        const baseCount = state.walletUsesPagedHoldings
          ? state.walletTotalCount
          : state.walletTokenIds.length;
        const totalCount = baseCount + ids.length;
        setStatus(
          dom.walletGridStatus,
          `<strong>Grid</strong> ${totalCount} inscription${totalCount === 1 ? '' : 's'} available`,
          'ready',
          'blue'
        );
        if (state.walletPageIndex === 0) {
          await loadWalletPage({ pageAlreadyLoaded: true });
        }
        // If nothing is selected yet (e.g. an otherwise-empty wallet), select
        // the first injected twin so the preview panel opens.
        if (state.selectedTokenId === null && state.walletTokens.length > 0) {
          await selectToken(state.walletTokens[0].id);
        }
        updateControls();
      } else {
        updateWalletPagerControls();
      }
    };

    // Some original NFTs are not held directly in a wallet but custodied by a
    // marketplace/escrow contract (e.g. listed for sale). In that case the NFT
    // owner resolves to the marketplace contract, so we hop once more to recover
    // the real owner (the seller who listed it). Keyed by custody contract id.
    const NFT_CUSTODY_RESOLVERS = new Map([
      [
        'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.pepe-nft-marketplace',
        {
          contractId:
            'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.pepe-nft-marketplace',
          label: 'Marketplace',
          // Human-facing hint shown when the underlying NFT is custodied here.
          stateHint: 'Listed',
          // Link target for the "Marketplace" line. Defaults to the Stacks
          // explorer contract page; set to a marketplace URL when known.
          buildUrl: () =>
            'https://explorer.hiro.so/address/' +
            'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.pepe-nft-marketplace?chain=mainnet',
          // Read the listing and return its seller principal.
          resolve: async (localTokenId, network) => {
            const json = await callReadOnlyJson({
              contractId:
                'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.pepe-nft-marketplace',
              functionName: 'get-listing',
              args: [uintCV(localTokenId)],
              network
            }).catch(() => null);
            return readTuplePrincipal(json, 'seller');
          }
        }
      ],
      [
        'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.leo-nft-market-faktory',
        {
          contractId:
            'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.leo-nft-market-faktory',
          label: 'Marketplace',
          stateHint: 'Listed',
          buildUrl: () =>
            'https://explorer.hiro.so/address/' +
            'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.leo-nft-market-faktory?chain=mainnet',
          resolve: async (localTokenId, network) => {
            const json = await callReadOnlyJson({
              contractId:
                'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.leo-nft-market-faktory',
              functionName: 'get-listing',
              args: [uintCV(localTokenId)],
              network
            }).catch(() => null);
            return readTuplePrincipal(json, 'seller');
          }
        }
      ]
    ]);

    // POST a read-only call and return the decoded cvToJSON result.
    const callReadOnlyJson = async ({ contractId, functionName, args = [], network = 'mainnet' }) => {
      const [address, name] = contractId.split('.');
      if (!address || !name) {
        throw new Error(`Invalid contract id: ${contractId}`);
      }
      const url = buildHiroApiUrl(
        `/v2/contracts/call-read/${address}/${name}/${functionName}`,
        network
      );
      if (!url) {
        throw new Error('No Hiro API endpoint configured.');
      }
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: address,
          arguments: args.map((arg) => cvToHex(arg))
        })
      });
      if (!response.ok) {
        throw new Error(`Read-only call failed (${response.status}).`);
      }
      const payload = await response.json();
      if (!payload?.okay || typeof payload.result !== 'string') {
        throw new Error('Read-only call returned no result.');
      }
      return cvToJSON(hexToCV(payload.result));
    };

    // Read a principal field from a cvToJSON (optional (tuple ...)) result.
    const readTuplePrincipal = (node, key) => {
      let current = node;
      while (
        current &&
        typeof current.type === 'string' &&
        (current.type.startsWith('(optional') || current.type.startsWith('(response'))
      ) {
        current = current.value ?? null;
      }
      const tuple =
        current && typeof current.type === 'string' && current.type.startsWith('(tuple')
          ? current.value
          : null;
      const field = tuple?.[key];
      return field && typeof field.value === 'string' ? field.value : null;
    };

    // Given an address that may be a custody contract, resolve through to the
    // real owner (e.g. marketplace listing seller). Bounded to avoid loops.
    // Returns the real owner plus the custodian (if any) so callers can show a
    // "Listed" hint and marketplace link.
    const resolveCustodyOwner = async (address, localTokenId, network) => {
      let current = address;
      let custodian = null;
      for (let hops = 0; hops < 3; hops += 1) {
        const resolver = NFT_CUSTODY_RESOLVERS.get(current);
        if (!resolver) {
          break;
        }
        custodian = resolver;
        const next = await resolver.resolve(localTokenId, network);
        if (!next || next === current) {
          break;
        }
        current = next;
      }
      return { owner: current, custodian };
    };

    const clarityUintHex = (value) => {
      const hex = BigInt(value).toString(16).padStart(32, '0');
      return `0x01${hex}`;
    };

    const buildHiroApiUrl = (path, network = 'mainnet') => {
      const [baseUrl] = getApiBaseUrls(network);
      if (!baseUrl) {
        return null;
      }
      return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
    };

    const fetchHiroJson = async (path, network = 'mainnet') => {
      const url = buildHiroApiUrl(path, network);
      if (!url) {
        throw new Error('No Hiro API endpoint configured.');
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Hiro request failed (${response.status}).`);
      }
      return await response.json();
    };

    const parseUintRepr = (value) => {
      const match = String(value ?? '').trim().match(/^u(\d+)$/);
      return match ? BigInt(match[1]) : null;
    };

    const findPepeEscrowResolver = (owner) => {
      const normalizedOwner = owner?.trim() ?? '';
      if (!normalizedOwner) {
        return null;
      }
      return PEPE_ESCROW_RESOLVERS.get(normalizedOwner) ?? null;
    };

    const resolvePepeEscrowHolder = async (token) => {
      const resolver = findPepeEscrowResolver(token.owner);
      if (!resolver) {
        return null;
      }
      const cacheKey = `${getTokenCacheContractId(token)}:${token.id.toString()}`;
      const cached = state.escrowHolderCache.get(cacheKey);
      if (cached) {
        return cached;
      }
      // Reverse-resolve the original (local) collection token id for this
      // Xtrata inscription using the helper's inscribed events.
      const reverseIndex = await buildTwinReverseIndex(resolver).catch(() => null);
      let sourceTokenId =
        reverseIndex?.get(token.id.toString()) ?? null;

      // Fallback: recover the local id from the escrow-deposit transaction
      // (covers tokens swapped back into escrow if events are unavailable).
      let escrowTxId = null;
      if (sourceTokenId === null) {
        const coreAssetId = `${getTokenCacheContractId(token)}::xtrata-inscription`;
        const coreHistory = await fetchHiroJson(
          `/extended/v1/tokens/nft/history?asset_identifier=${encodeURIComponent(coreAssetId)}` +
            `&value=${encodeURIComponent(clarityUintHex(token.id))}&limit=20`,
          state.contract.network
        ).catch(() => null);
        const escrowTransfer = (coreHistory?.results ?? []).find(
          (event) =>
            event?.asset_event_type === 'transfer' &&
            event?.recipient === token.owner &&
            typeof event?.tx_id === 'string'
        );
        if (escrowTransfer) {
          escrowTxId = escrowTransfer.tx_id;
          const tx = await fetchHiroJson(
            `/extended/v1/tx/${encodeURIComponent(escrowTransfer.tx_id)}`,
            state.contract.network
          ).catch(() => null);
          const sourceTokenArg = tx?.contract_call?.function_args?.find(
            (arg) => arg?.name === 'token-id'
          );
          sourceTokenId = parseUintRepr(sourceTokenArg?.repr);
        }
      }
      if (sourceTokenId === null) {
        return null;
      }
      // The real owner is the current holder of the original collection NFT.
      const sourceAssetId = `${resolver.sourceContractId}::${resolver.sourceAssetName}`;
      const sourceHistory = await fetchHiroJson(
        `/extended/v1/tokens/nft/history?asset_identifier=${encodeURIComponent(sourceAssetId)}` +
          `&value=${encodeURIComponent(clarityUintHex(sourceTokenId))}&limit=1`,
        state.contract.network
      ).catch(() => null);
      const latest = sourceHistory?.results?.[0] ?? null;
      const rawHolder = latest?.recipient ?? null;
      if (!rawHolder) {
        return null;
      }
      // If the NFT is custodied by a known marketplace/escrow contract (e.g.
      // listed for sale), resolve through to the real owner (the seller).
      const custodyResult = await resolveCustodyOwner(
        rawHolder,
        sourceTokenId,
        state.contract.network
      ).catch(() => ({ owner: rawHolder, custodian: null }));
      const holder = custodyResult.owner ?? rawHolder;
      const custodian = custodyResult.custodian ?? null;
      if (!holder) {
        return null;
      }
      const result = {
        label: resolver.label,
        collectionName: resolver.collectionName,
        itemNoun: resolver.itemNoun,
        holder,
        sourceTokenId,
        sourceContractId: resolver.sourceContractId,
        txId: escrowTxId,
        listed: !!custodian,
        marketplaceLabel: custodian?.label ?? null,
        marketplaceHint: custodian?.stateHint ?? null,
        marketplaceUrl: custodian?.buildUrl
          ? custodian.buildUrl(sourceTokenId)
          : null
      };
      state.escrowHolderCache.set(cacheKey, result);
      return result;
    };

    const renderNoSelectedInscriptionMeta = () => {
      state.selectedOwnerNameRequestId += 1;
      state.selectedEscrowHolderRequestId += 1;
      state.selectedEscrowHolder = null;
      clearSelectedInscriptionRelationships();
      state.selectedThreadRequestId += 1;
      if (dom.selectedThread) {
        dom.selectedThread.replaceChildren();
        dom.selectedThread.hidden = true;
      }
      renderMeta(dom.tokenPreviewMeta, [['Status', 'None selected']]);
    };

    const renderSelectedInscriptionMeta = (
      token,
      ownerName = null,
      mimeTypeOverride = null,
      escrowHolder = null
    ) => {
      const effectiveMimeType =
        mimeTypeOverride ?? state.tokenPreviewMimeType ?? token.meta?.mimeType ?? null;
      const isEscrowed = !!findPepeEscrowResolver(token.owner);
      // Reuse the previously resolved escrow holder for this token if the caller
      // didn't pass one (e.g. the BNS owner-name re-render). This prevents a
      // late owner-name render from clobbering the resolved holder/listed state.
      if (!escrowHolder && state.selectedEscrowHolder?.tokenId === token.id) {
        escrowHolder = state.selectedEscrowHolder.data;
      }
      // When escrowed, the on-chain owner is the helper contract; show the
      // resolved real holder (current owner of the original NFT) as Owner and
      // flag the twin as Escrowed for clarity.
      const ownerValue = escrowHolder
        ? escrowHolder.holderName ?? truncateMiddle(escrowHolder.holder, 8, 8)
        : ownerName ?? (token.owner ? truncateMiddle(token.owner, 8, 8) : 'unknown');
      // Effective wallet address to open in the grid when the Owner is clicked:
      // the real holder when escrowed, otherwise the token owner. Skip contract
      // principals (still escrow-resolving) so we never load a contract id.
      const ownerWalletAddress = escrowHolder
        ? escrowHolder.holder
        : !isEscrowed && token.owner
          ? token.owner
          : null;
      const ownerLine = { key: 'Owner', value: ownerValue };
      // Owner is click-to-load-wallet. On the homepage it loads the wallet's
      // grid in place. In the Xplorer (which has no wallet grid of its own) it
      // opens the wallet back on the homepage via /?wallet=<address>.
      if (ownerWalletAddress) {
        if (state.explorerMode) {
          ownerLine.onClick = () => {
            window.location.assign(
              `/?wallet=${encodeURIComponent(ownerWalletAddress)}`
            );
          };
          ownerLine.actionLabel = `Open this wallet's inscriptions on the homepage`;
        } else {
          ownerLine.onClick = () => {
            void viewWalletByAddress(ownerWalletAddress);
          };
          ownerLine.actionLabel = `View this wallet's inscriptions in the grid`;
        }
      }
      const stateValue = escrowHolder
        ? escrowHolder.listed
          ? `Escrowed · ${escrowHolder.marketplaceHint ?? 'Listed'}`
          : 'Escrowed'
        : 'Escrowed (resolving owner...)';
      const lines = [
        ['Type', getGridMimeLabel(effectiveMimeType)],
        ['Size', token.meta?.totalSize ? formatBytes(token.meta.totalSize) : 'unknown'],
        ownerLine,
        ...(isEscrowed ? [['State', stateValue]] : []),
        ...(escrowHolder && escrowHolder.listed && escrowHolder.marketplaceUrl
          ? [{
              key: escrowHolder.marketplaceLabel ?? 'Marketplace',
              value: 'View listing',
              href: escrowHolder.marketplaceUrl,
              title: 'Open the marketplace listing for the underlying NFT'
            }]
          : []),
        ...(escrowHolder
          ? [[
              escrowHolder.itemNoun ?? 'Collection',
              `#${escrowHolder.sourceTokenId.toString()}`
            ]]
          : []),
        ['Xtrata ID', formatTokenId(token.id)]
      ];
      renderMeta(dom.tokenPreviewMeta, lines);
      // Don't resolve a BNS name for the raw owner when escrowed — the owner is
      // the helper contract; the real holder's name is resolved by the escrow
      // path. This also avoids a late render overwriting the holder display.
      if (!ownerName && !isEscrowed) {
        void resolveSelectedInscriptionOwnerName(token);
      }
      if (!escrowHolder && isEscrowed) {
        void resolveSelectedEscrowHolder(token);
      }
      void renderSelectedInscriptionRelationships(token);
      void renderSelectedInscriptionThread(token);
    };

    const clearSelectedInscriptionRelationships = () => {
      state.selectedParentsRequestId += 1;
      state.selectedChildrenRequestId += 1;
      if (dom.selectedRelationships) {
        dom.selectedRelationships.replaceChildren();
        dom.selectedRelationships.hidden = true;
      }
    };

    // Thread view: an inscription's dependencies are its "in reply to" links (existence-only
    // references). Read them live from the contract so a reply shows its thread parent
    // immediately, and make each one clickable to walk up the thread. (Reverse — a message's
    // replies — needs a dependency index and is a separate step.)
    const renderSelectedInscriptionThread = async (token) => {
      const el = dom.selectedThread;
      if (!el) return;
      state.selectedThreadRequestId += 1;
      const requestId = state.selectedThreadRequestId;
      el.replaceChildren();
      el.hidden = true;
      if (!token || !state.client) return;
      const contractId = getTokenCacheContractId(token);
      // Forward (what this replies to) is a live contract read; reverse (its replies) comes
      // from the dependents edge index. Fetch both together.
      const [deps, dependents] = await Promise.all([
        state.client.getDependencies(token.id, getReadOnlySenderAddress()).catch(() => []),
        fetchDependents({ contractId, id: token.id }).catch(() => null)
      ]);
      if (requestId !== state.selectedThreadRequestId || state.selectedTokenId !== token.id) return;
      const replies = dependents?.dependents ?? [];
      if ((!deps || deps.length === 0) && replies.length === 0) return;

      const makeLink = (id) => {
        const link = document.createElement('button');
        link.type = 'button';
        link.className = 'selected-thread__id';
        link.textContent = formatTokenId(id);
        link.title = `Open ${formatTokenId(id)}`;
        link.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          void selectToken(id, { scrollToPreview: true });
        });
        return link;
      };
      const appendGroup = (label, ids, role = 'dep') => {
        const head = document.createElement('div');
        head.className = `selected-thread__head selected-thread__head--${role}`;
        head.textContent = label;
        const row = document.createElement('div');
        row.className = 'selected-thread__ids';
        for (const id of ids) row.append(makeLink(id));
        el.append(head, row);
      };

      if (deps && deps.length > 0) {
        appendGroup(`🔗 Dependencies (${deps.length})`, deps, 'dep');
      }
      if (replies.length > 0) {
        appendGroup(`🔗 Dependents (${replies.length}${dependents?.hasMore ? '+' : ''})`, replies, 'dep');
      }
      el.hidden = false;
    };

    const getCachedRelationshipSummary = (id) =>
      state.walletTokenCache.get(id.toString()) ?? null;

    const hydrateRelationshipThumbCard = async (contractId, relatedId, media, role) => {
      if (!media.isConnected) {
        return;
      }
      const token = getCachedRelationshipSummary(relatedId);
      if (!token) {
        media.dataset.thumbnailState = 'summary-miss';
        setTokenThumbLabel(media, 'loading');
        return;
      }
      await renderRelationshipThumbMedia(token, media, role);
    };

    // Shared thumbnail tile for a related inscription (parent or child). It
    // renders from already-cached summary/thumbnail/live-media data first; the
    // relation group batches any missing summary reads after initial paint.
    const buildRelationshipThumbCard = (contractId, relatedId, role) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'parent-thumb';
      card.dataset.tokenId = relatedId.toString();
      card.dataset.contractId = contractId;
      card.title = `View ${role} ${formatTokenId(relatedId)}`;
      const media = document.createElement('span');
      media.className = 'parent-thumb__media';
      media.dataset.tokenId = relatedId.toString();
      media.dataset.contractId = contractId;
      setTokenThumbLabel(media, 'loading');
      const tag = document.createElement('span');
      tag.className = 'parent-thumb__id';
      tag.textContent = formatTokenId(relatedId);
      card.append(media, tag);
      card.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        void selectRelationshipToken(contractId, relatedId);
      });
      void hydrateRelationshipThumbCard(contractId, relatedId, media, role);
      return card;
    };

    const selectRelationshipToken = async (contractId, relatedId) => {
      let token = getCachedRelationshipSummary(relatedId);
      if (!token) {
        const summaries = await fetchWalletTokenSummaries([relatedId]).catch(() => []);
        token = summaries.find((entry) => entry.id === relatedId) ?? null;
        if (token) {
          state.walletTokenCache.set(token.id.toString(), token);
        }
      }
      if (!token) {
        appendLog(
          `Could not load relationship ${formatTokenId(relatedId)} from ${contractId}.`
        );
        return;
      }
      await selectToken(relatedId, { scrollToPreview: true });
    };

    const hydrateRelationGroupSummaries = async (contractId, ids, thumbs, role) => {
      const missingIds = [
        ...new Map(
          ids
            .filter((id) => !getCachedRelationshipSummary(id))
            .map((id) => [id.toString(), id])
        ).values()
      ];
      if (missingIds.length > 0 && state.client) {
        try {
          const summaries = await fetchWalletTokenSummaries(missingIds);
          for (const token of summaries) {
            state.walletTokenCache.set(token.id.toString(), token);
          }
          debugLog('relationships', 'relationship summaries fetched', {
            contractId,
            role,
            requested: missingIds.length,
            returned: summaries.length
          });
        } catch (error) {
          debugLog(
            'relationships',
            'relationship summary fetch failed',
            {
              contractId,
              role,
              requested: missingIds.length,
              error: error instanceof Error ? error.message : String(error)
            },
            'warn'
          );
        }
      }
      for (const media of thumbs.querySelectorAll('.parent-thumb__media')) {
        const id = BigInt(media.dataset.tokenId);
        void hydrateRelationshipThumbCard(contractId, id, media, role);
      }
    };

    // Renders one labelled group of related inscriptions (heading + id list +
    // thumbnail row). Returns nothing; appends into `section`.
    const appendRelationGroup = (section, contractId, title, ids, role) => {
      if (!ids || ids.length === 0) {
        return;
      }
      const heading = document.createElement('div');
      heading.className = 'selected-relationships__head';
      heading.textContent = `${title} (${ids.length})`;
      const idLine = document.createElement('div');
      idLine.className = 'selected-relationships__ids';
      idLine.textContent = ids.map((id) => formatTokenId(id)).join(', ');
      const thumbs = document.createElement('div');
      thumbs.className = 'selected-relationships__thumbs';
      for (const id of ids) {
        thumbs.append(buildRelationshipThumbCard(contractId, id, role));
      }
      section.append(heading, idLine, thumbs);
      void hydrateRelationGroupSummaries(contractId, ids, thumbs, role);
    };

    // Depth -> human label for lineage tiers beyond the direct relation.
    const depthLabel = (depth, direction) => {
      if (direction === 'down') {
        if (depth === 1) return 'Children';
        if (depth === 2) return 'Grandchildren';
        if (depth === 3) return 'Great-grandchildren';
        return `Descendants +${depth}`;
      }
      if (depth === 1) return 'Parents';
      if (depth === 2) return 'Grandparents';
      if (depth === 3) return 'Great-grandparents';
      return `Ancestors -${depth}`;
    };

    const groupByDepth = (nodes) => {
      const byDepth = new Map();
      for (const node of nodes) {
        const list = byDepth.get(node.depth) ?? [];
        list.push(node.id);
        byDepth.set(node.depth, list);
      }
      return [...byDepth.entries()].sort((a, b) => a[0] - b[0]);
    };

    // Orchestrates every relationship direction for the selected inscription:
    // its live on-chain parents, then the full server-indexed lineage (children,
    // grandchildren, …, ancestors above direct parents, and half-siblings). Falls
    // back to the local IndexedDB child index + scan when the server lineage
    // endpoint is unavailable.
    // Generation accent colour: a warm scale upward (ancestors) and a cool scale
    // downward (descendants), brand blue for the focus row. Lightness steps with
    // depth so each tier reads as distinct at any depth, in a confined space.
    const relGenAccent = (kind, depth) => {
      if (kind === 'focus') return 'var(--blue)';
      const light = Math.max(48, 72 - depth * 7);
      return kind === 'up' ? `hsl(34 92% ${light}%)` : `hsl(190 70% ${light}%)`;
    };

    // One generation row: a sticky generation label plus a horizontally
    // scrollable track of thumbnail cards. The focus row places the selected
    // piece first (highlighted) followed by its siblings.
    const buildRelationshipRow = ({ contractId, ids, kind, depth, label, selectedId = null }) => {
      const row = document.createElement('div');
      row.className = `rel-row rel-row--${kind}`;
      row.dataset.depth = String(depth);
      row.style.setProperty('--rel-acc', relGenAccent(kind, depth));
      const track = document.createElement('div');
      track.className = 'rel-row__track';
      const labelEl = document.createElement('span');
      labelEl.className = 'rel-row__label';
      const count = (selectedId != null ? 1 : 0) + (ids ? ids.length : 0);
      labelEl.textContent = `${label} · ${count}`;
      track.append(labelEl);
      if (selectedId != null) {
        const selfCard = buildRelationshipThumbCard(contractId, selectedId, 'self');
        selfCard.classList.add('rel-card--self');
        selfCard.title = `Selected ${formatTokenId(selectedId)}`;
        track.append(selfCard);
      }
      const role =
        kind === 'focus' ? 'sibling' : kind === 'up' ? (depth === 1 ? 'parent' : 'ancestor') : 'child';
      track.dataset.relRole = role;
      for (const id of ids ?? []) {
        track.append(buildRelationshipThumbCard(contractId, id, role));
      }
      row.append(track);
      // Hydration is deferred to the orchestrator, AFTER the rows are attached to
      // the live viewport: hydrateRelationshipThumbCard() no-ops on detached
      // media, so hydrating here (before append) would leave tiles stuck loading.
      return row;
    };

    // Focused, scrollable family-tree view of the selected inscription:
    // ancestors above (deepest generation at the top, parents nearest the focus),
    // the selected piece + siblings on the focus row, descendants below. Prefers
    // the one-round-trip server lineage (depth-tagged ancestors + descendants +
    // half-siblings); falls back to the live ancestor walk + local child index
    // when the endpoint is unavailable. Each row scrolls horizontally, the
    // viewport scrolls vertically, and the whole tree stays inside the preview
    // column.
    const renderSelectedInscriptionRelationships = async (token) => {
      const container = dom.selectedRelationships;
      if (!container) {
        return;
      }
      state.selectedParentsRequestId += 1;
      state.selectedChildrenRequestId += 1;
      const requestId = state.selectedChildrenRequestId;
      if (!token || !supportsParentRelationships()) {
        container.replaceChildren();
        container.hidden = true;
        return;
      }
      container.hidden = false;
      const contractId = getTokenCacheContractId(token);

      const tree = document.createElement('div');
      tree.className = 'rel-tree';
      const viewport = document.createElement('div');
      viewport.className = 'rel-tree__viewport';
      const status = document.createElement('div');
      status.className = 'rel-tree__status';
      status.textContent = 'Loading lineage…';
      tree.append(viewport, status);
      container.replaceChildren(tree);

      const lineage = await fetchLineage({ contractId, id: token.id }).catch(() => null);
      if (requestId !== state.selectedChildrenRequestId || state.selectedTokenId !== token.id) {
        return;
      }

      let ancestorGroups = [];
      let descendantGroups = [];
      let siblings = [];
      let coverageText = '';
      if (lineage) {
        ancestorGroups = groupByDepth(lineage.ancestors);
        descendantGroups = groupByDepth(lineage.descendants);
        siblings = lineage.siblings ?? [];
        coverageText = lineage.complete
          ? `Lineage complete across ${lineage.mintedCount.toString()} inscriptions.`
          : `Index ${lineage.syncedCount.toString()}/${lineage.mintedCount.toString()} — newer relations may still be syncing.`;

        // The server edge index can briefly lag a freshly sealed inscription.
        // Always reconcile direct parents from the contract so confirmed
        // relationships appear immediately, while deeper lineage continues to
        // come from the indexed endpoint.
        try {
          const sender = getReadOnlySenderAddress();
          const liveParents = await state.client.getParents(token.id, sender);
          if (
            requestId !== state.selectedChildrenRequestId ||
            state.selectedTokenId !== token.id
          ) {
            return;
          }
          if (liveParents.length > 0) {
            const indexedDirectParents =
              ancestorGroups.find(([depth]) => depth === 1)?.[1] ?? [];
            const directParents = new Map(
              [...indexedDirectParents, ...liveParents].map((id) => [
                id.toString(),
                id
              ])
            );
            ancestorGroups = [
              ...ancestorGroups.filter(([depth]) => depth !== 1),
              [1, [...directParents.values()]]
            ];
            void recordChildParents({
              contractId,
              childId: token.id,
              parentIds: liveParents
            });
            if (lineage.parents.length === 0) {
              coverageText = `${coverageText} Direct parents confirmed on-chain.`;
            }
          }
        } catch (error) {
          // Keep the indexed lineage when the live read is temporarily
          // unavailable; the existing fallback still handles endpoint failure.
        }
      } else {
        // Server lineage unavailable: live ancestor walk + local descendant index.
        try {
          const sender = getReadOnlySenderAddress();
          ancestorGroups = [...(await walkAncestorsLive(token.id, sender, contractId)).entries()];
        } catch (error) {
          ancestorGroups = [];
        }
        try {
          descendantGroups = [...(await walkDescendantsLocal(token.id, contractId)).entries()];
        } catch (error) {
          descendantGroups = [];
        }
        if (requestId !== state.selectedChildrenRequestId || state.selectedTokenId !== token.id) {
          return;
        }
        coverageText = 'Local index — server lineage unavailable.';
      }

      // Ancestors: deepest generation at the very top, parents just above focus.
      for (const [depth, ids] of [...ancestorGroups].sort((a, b) => b[0] - a[0])) {
        viewport.append(
          buildRelationshipRow({ contractId, ids, kind: 'up', depth, label: depthLabel(depth, 'up') })
        );
      }
      // Focus row: the selected piece plus its siblings.
      const focusRow = buildRelationshipRow({
        contractId,
        ids: siblings,
        kind: 'focus',
        depth: 0,
        label: 'Selected',
        selectedId: token.id
      });
      viewport.append(focusRow);
      // Descendants: children just below focus, deeper generations further down.
      for (const [depth, ids] of [...descendantGroups].sort((a, b) => a[0] - b[0])) {
        viewport.append(
          buildRelationshipRow({ contractId, ids, kind: 'down', depth, label: depthLabel(depth, 'down') })
        );
      }

      // Now that every row is attached to the live viewport, hydrate the tiles —
      // one batched summary fetch per row (covers the selected piece too), then
      // each tile renders from cache. Doing this here (post-append) is what makes
      // detached-media hydration no-op irrelevant.
      for (const track of viewport.querySelectorAll('.rel-row__track')) {
        const trackIds = Array.from(track.querySelectorAll('.parent-thumb__media'), (mediaEl) => {
          try {
            return BigInt(mediaEl.dataset.tokenId);
          } catch (error) {
            return null;
          }
        }).filter((id) => id !== null);
        if (trackIds.length > 0) {
          void hydrateRelationGroupSummaries(contractId, trackIds, track, track.dataset.relRole || 'relation');
        }
      }

      const hasAny =
        ancestorGroups.length > 0 || descendantGroups.length > 0 || siblings.length > 0;
      status.textContent = hasAny ? coverageText : 'No parents, children, or siblings.';

      // Focus row sits in the vertical middle when there are ancestors above it;
      // a root piece (no ancestors) sits at the top instead.
      requestAnimationFrame(() => {
        if (requestId !== state.selectedChildrenRequestId) {
          return;
        }
        viewport.scrollTop =
          ancestorGroups.length > 0
            ? Math.max(0, focusRow.offsetTop - (viewport.clientHeight - focusRow.clientHeight) / 2)
            : 0;
      });
    };

    // Walk the ancestor chain live from the chain: BFS up via get-parents,
    // recording the shallowest depth each ancestor is reached at (so a node
    // reachable by multiple paths is listed once, at its closest tier). Cheap —
    // lineages are shallow — and works with or without the server index. Each
    // visited child -> parents edge is opportunistically recorded so the local
    // reverse index is seeded as a side effect.
    const walkAncestorsLive = async (tokenId, sender, contractId, maxDepth = 16) => {
      const byDepth = new Map();
      const seen = new Set([tokenId.toString()]);
      let frontier = [tokenId];
      let depth = 1;
      while (frontier.length > 0 && depth <= maxDepth) {
        const lists = await runReadOnlyLimited(frontier, 4, (id) =>
          state.client.getParents(id, sender)
        );
        const levelIds = [];
        const next = [];
        frontier.forEach((childId, index) => {
          const parents = lists[index] ?? [];
          void recordChildParents({ contractId, childId, parentIds: parents });
          for (const parentId of parents) {
            const key = parentId.toString();
            if (seen.has(key)) continue;
            seen.add(key);
            levelIds.push(parentId);
            next.push(parentId);
          }
        });
        if (levelIds.length > 0) {
          byDepth.set(depth, levelIds);
        }
        frontier = next;
        depth += 1;
      }
      return byDepth;
    };

    // Walk the descendant chain downward through the local reverse index
    // (loadIndexedChildren), recording the shallowest depth each descendant is
    // reached at. There is no on-chain get-children, so this only sees edges the
    // index already holds — but the live ancestor walk seeds those edges as you
    // browse, and the Scan control fills the rest. Mirrors walkAncestorsLive.
    const walkDescendantsLocal = async (tokenId, contractId, maxDepth = 16) => {
      const byDepth = new Map();
      const seen = new Set([tokenId.toString()]);
      let frontier = [tokenId];
      let depth = 1;
      while (frontier.length > 0 && depth <= maxDepth) {
        const lists = await Promise.all(
          frontier.map((id) =>
            loadIndexedChildren({ contractId, parentId: id }).catch(() => [])
          )
        );
        const levelIds = [];
        const next = [];
        for (const list of lists) {
          for (const childId of list ?? []) {
            const key = childId.toString();
            if (seen.has(key)) continue;
            seen.add(key);
            levelIds.push(childId);
            next.push(childId);
          }
        }
        if (levelIds.length > 0) {
          byDepth.set(depth, levelIds);
        }
        frontier = next;
        depth += 1;
      }
      return byDepth;
    };

    // Upward navigation: full ancestor lineage (Parents, Grandparents, …) read
    // live from the chain, depth-grouped.
    const renderAncestorsSection = async (token, contractId, section) => {
      const requestId = ++state.selectedParentsRequestId;
      const heading = document.createElement('div');
      heading.className = 'selected-relationships__head';
      heading.textContent = 'Parents';
      const status = document.createElement('div');
      status.className = 'selected-relationships__status';
      status.textContent = 'Loading lineage…';
      section.replaceChildren(heading, status);

      let byDepth;
      try {
        const sender = getReadOnlySenderAddress();
        byDepth = await walkAncestorsLive(token.id, sender, contractId);
      } catch (error) {
        if (
          requestId !== state.selectedParentsRequestId ||
          state.selectedTokenId !== token.id
        ) {
          return;
        }
        status.textContent = 'Parent relationships unavailable.';
        return;
      }
      if (
        requestId !== state.selectedParentsRequestId ||
        state.selectedTokenId !== token.id
      ) {
        return;
      }
      if (byDepth.size === 0) {
        heading.textContent = 'Parents (0)';
        status.textContent = 'No parents.';
        return;
      }
      section.replaceChildren();
      for (const [depth, ids] of [...byDepth.entries()].sort((a, b) => a[0] - b[0])) {
        appendRelationGroup(
          section,
          contractId,
          depthLabel(depth, 'up'),
          ids,
          depth === 1 ? 'parent' : 'ancestor'
        );
      }
    };

    // Downward + lateral navigation. Prefers the server lineage index (one
    // round-trip: children, grandchildren, …, ancestors above direct parents,
    // and half-siblings). Degrades to the local IndexedDB child index + scan
    // button when the endpoint is unavailable (e.g. local/static hosting).
    const renderLineageSection = async (token, contractId, section) => {
      const requestId = ++state.selectedChildrenRequestId;
      const status = document.createElement('div');
      status.className = 'selected-relationships__status';
      status.textContent = 'Loading lineage…';
      section.replaceChildren(status);

      const lineage = await fetchLineage({ contractId, id: token.id });
      if (
        requestId !== state.selectedChildrenRequestId ||
        state.selectedTokenId !== token.id
      ) {
        return;
      }
      if (!lineage) {
        // Server lineage unavailable — fall back to the local child index.
        void renderLocalChildrenSection(token, contractId, section);
        return;
      }

      section.replaceChildren();
      // Descendants grouped by depth: Children, Grandchildren, deeper tiers.
      // (Ancestors are rendered live in the parents section above.)
      for (const [depth, ids] of groupByDepth(lineage.descendants)) {
        appendRelationGroup(section, contractId, depthLabel(depth, 'down'), ids, 'child');
      }
      // Half-siblings.
      appendRelationGroup(section, contractId, 'Siblings', lineage.siblings, 'sibling');

      const hasAny =
        lineage.descendants.length > 0 || lineage.siblings.length > 0;
      const coverage = document.createElement('span');
      coverage.className = 'selected-relationships__status';
      if (!hasAny) {
        coverage.textContent = lineage.complete
          ? 'No children, siblings, or deeper lineage.'
          : 'No lineage indexed yet — the index is still catching up.';
      } else if (!lineage.complete) {
        coverage.textContent =
          `Index ${lineage.syncedCount.toString()}/${lineage.mintedCount.toString()} — newer relations may still be syncing.`;
      } else {
        coverage.textContent = `Lineage complete across ${lineage.mintedCount.toString()} inscriptions.`;
      }
      section.append(coverage);
    };

    // Local fallback: children read from the persisted reverse index, plus a
    // Scan control to build/refresh it (used only when the server lineage
    // endpoint is unreachable).
    const renderLocalChildrenSection = async (token, contractId, section) => {
      const requestId = ++state.selectedChildrenRequestId;
      const heading = document.createElement('div');
      heading.className = 'selected-relationships__head';
      heading.textContent = 'Children';
      const status = document.createElement('div');
      status.className = 'selected-relationships__status';
      status.textContent = 'Reading child index…';
      section.replaceChildren(heading, status);

      let byDepth = new Map();
      try {
        byDepth = await walkDescendantsLocal(token.id, contractId);
      } catch (error) {
        byDepth = new Map();
      }
      if (
        requestId !== state.selectedChildrenRequestId ||
        state.selectedTokenId !== token.id
      ) {
        return;
      }

      let totalFound = 0;
      if (byDepth.size > 0) {
        section.replaceChildren();
        for (const [depth, ids] of [...byDepth.entries()].sort((a, b) => a[0] - b[0])) {
          totalFound += ids.length;
          appendRelationGroup(section, contractId, depthLabel(depth, 'down'), ids, 'child');
        }
      } else {
        heading.textContent = 'Children (0)';
        status.textContent = 'No indexed children yet.';
      }

      // Coverage line + scan control. The index is contract-wide, so the cursor
      // tells us how much of the minted list has been scanned regardless of
      // which token is selected.
      const controls = document.createElement('div');
      controls.className = 'selected-relationships__scan';
      const coverage = document.createElement('span');
      coverage.className = 'selected-relationships__status';
      const scanButton = document.createElement('button');
      scanButton.type = 'button';
      scanButton.className = 'small-link';
      controls.append(scanButton, coverage);
      section.append(controls);

      const supportsScan = state.client.supportsMintedIndex === true;
      try {
        const cursor = await loadChildIndexCursor(contractId);
        if (
          requestId !== state.selectedChildrenRequestId ||
          state.selectedTokenId !== token.id
        ) {
          return;
        }
        coverage.textContent =
          cursor > 0n ? `Indexed ${cursor.toString()} inscriptions so far.` : 'Not indexed yet.';
      } catch (error) {
        coverage.textContent = '';
      }

      if (!supportsScan) {
        scanButton.hidden = true;
        coverage.textContent = 'Child indexing requires a minted-index contract (v2.1.0+).';
        return;
      }
      scanButton.textContent = state.childScanRunning
        ? 'Cancel scan'
        : totalFound > 0
          ? 'Rescan for children'
          : 'Scan for children';
      scanButton.disabled = state.childScanRunning && state.childScanTokenId !== token.id;
      scanButton.addEventListener('click', () => {
        if (state.childScanRunning) {
          state.childScanCancel = true;
          return;
        }
        void runChildIndexScan(token, contractId, scanButton, coverage);
      });
    };

    // Runs the bounded, cancellable reverse-index scan for the selected token's
    // contract, streaming progress into the Children section and re-rendering
    // it on completion so newly-found children appear.
    const runChildIndexScan = async (token, contractId, scanButton, coverage) => {
      if (state.childScanRunning) {
        return;
      }
      state.childScanRunning = true;
      state.childScanCancel = false;
      state.childScanTokenId = token.id;
      scanButton.textContent = 'Cancel scan';
      coverage.textContent = 'Starting scan…';
      try {
        const sender = getReadOnlySenderAddress();
        const result = await syncChildIndex({
          client: state.client,
          contractId,
          senderAddress: sender,
          parentId: token.id,
          shouldCancel: () => state.childScanCancel,
          onProgress: (progress) => {
            if (state.selectedTokenId !== token.id) {
              return;
            }
            coverage.textContent =
              `Scanning ${progress.scanned.toString()}/${progress.total.toString()}… ` +
              `${progress.found.toString()} child${progress.found === 1n ? '' : 'ren'} found.`;
          }
        });
        coverage.textContent = result.cancelled
          ? `Scan paused at ${result.nextMintedIndex.toString()}/${result.mintedCount.toString()}.`
          : `Scan complete — covered ${result.mintedCount.toString()} inscriptions.`;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        coverage.textContent = `Scan failed: ${message}`;
      } finally {
        state.childScanRunning = false;
        state.childScanCancel = false;
        state.childScanTokenId = null;
        // Re-render with the freshly indexed children if the token is still selected.
        if (state.selectedTokenId === token.id) {
          const section = scanButton.closest('.selected-relationships__group');
          if (section) {
            void renderLocalChildrenSection(token, contractId, section);
          }
        }
      }
    };

    const resolveSelectedInscriptionOwnerName = async (token) => {
      const owner = token.owner?.trim() ?? '';
      if (!owner) {
        return;
      }
      const requestId = ++state.selectedOwnerNameRequestId;
      try {
        const namesResult = await resolveBnsNames({
          address: owner,
          network: state.contract.network
        });
        const ownerName = namesResult.primary;
        const currentToken = getSelectedToken();
        if (
          !ownerName ||
          requestId !== state.selectedOwnerNameRequestId ||
          state.selectedTokenId !== token.id ||
          !addressesEqual(currentToken?.owner, owner)
        ) {
          return;
        }
        renderSelectedInscriptionMeta(token, ownerName);
      } catch (error) {
        debugLog(
          'bns',
          'selected owner name lookup failed',
          {
            owner: truncateMiddle(owner, 8, 8),
            error: error instanceof Error ? error.message : String(error)
          },
          'warn'
        );
      }
    };

    const resolveSelectedEscrowHolder = async (token) => {
      const requestId = ++state.selectedEscrowHolderRequestId;
      try {
        const escrowHolder = await resolvePepeEscrowHolder(token);
        const currentToken = getSelectedToken();
        if (
          !escrowHolder ||
          requestId !== state.selectedEscrowHolderRequestId ||
          state.selectedTokenId !== token.id ||
          !addressesEqual(currentToken?.owner, token.owner)
        ) {
          return;
        }
        // Resolve a BNS name for the *real* holder (the escrowed twin's owner is
        // the helper contract, so token.owner never resolves to a name). This
        // lets the preview panel show the holder's .btc name when they have one.
        try {
          const holderNames = await resolveBnsNames({
            address: escrowHolder.holder,
            network: state.contract.network
          });
          if (
            holderNames.primary &&
            requestId === state.selectedEscrowHolderRequestId &&
            state.selectedTokenId === token.id
          ) {
            escrowHolder.holderName = holderNames.primary;
          }
        } catch (bnsError) {
          debugLog(
            'bns',
            'escrow holder name lookup failed',
            {
              holder: truncateMiddle(escrowHolder.holder, 8, 8),
              error: bnsError instanceof Error ? bnsError.message : String(bnsError)
            },
            'warn'
          );
        }
        // Remember the resolved holder so later re-renders keep showing it.
        state.selectedEscrowHolder = { tokenId: token.id, data: escrowHolder };
        renderSelectedInscriptionMeta(token, null, null, escrowHolder);
      } catch (error) {
        debugLog(
          'readonly',
          'selected escrow holder lookup failed',
          {
            tokenId: token.id.toString(),
            owner: token.owner ? truncateMiddle(token.owner, 8, 8) : null,
            error: error instanceof Error ? error.message : String(error)
          },
          'warn'
        );
      }
    };

    const revokePayloadPreview = () => {
      if (state.payloadPreviewUrl) {
        URL.revokeObjectURL(state.payloadPreviewUrl);
        state.payloadPreviewUrl = null;
      }
    };

    const revokeTokenPreview = () => {
      if (state.tokenPreviewUrl) {
        URL.revokeObjectURL(state.tokenPreviewUrl);
        state.tokenPreviewUrl = null;
      }
      state.tokenPreviewTokenId = null;
      state.tokenPreviewBytes = null;
      state.tokenPreviewMimeType = null;
      state.tokenPreviewSourceUrl = null;
      state.tokenPreviewHtmlDoc = null;
    };

    const revokeFullscreenPreview = () => {
      if (state.fullscreenUrl) {
        URL.revokeObjectURL(state.fullscreenUrl);
        state.fullscreenUrl = null;
      }
    };

    const revokeGridThumbUrls = () => {
      const revokedCount = state.tokenThumbUrls.size;
      state.tokenThumbUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
      state.tokenThumbUrls.clear();
      if (revokedCount > 0) {
        debugLog('cache', 'revoked grid thumbnail object URLs', {
          revokedCount
        });
      }
    };

    const resetBackgroundThumbnailHydration = () => {
      const discardedQueued = state.thumbnailHydrationQueue.length;
      state.thumbnailHydrationRunId += 1;
      state.thumbnailHydrationQueue = [];
      state.thumbnailHydrationQueued.clear();
      state.thumbnailHydrationAttempted.clear();
      state.gridLiveMediaCache.clear();
      liveHtmlFrameManager.reset();
      debugLog('cache', 'background thumbnail queue reset', {
        runId: state.thumbnailHydrationRunId,
        discardedQueued,
        activeFetches: state.thumbnailHydrationInFlight.size
      });
    };

    const clearElement = (element, text) => {
      element.innerHTML = '';
      element.textContent = text;
    };

    const clearTokenUriHeadPreviewTarget = (target) => {
      target.replaceChildren();
      target.classList.remove('on');
      target.setAttribute('aria-hidden', 'true');
    };

    const clearTokenUriHeadPreview = () => {
      clearTokenUriHeadPreviewTarget(dom.tokenUriHeadPreview);
    };

    const clearWalletTokenUriHeadPreview = () => {
      clearTokenUriHeadPreviewTarget(dom.walletTokenUriHeadPreview);
    };

    const renderTokenUriHeadPreviewTarget = (target, imageUrl) => {
      const img = document.createElement('img');
      img.alt = '';
      img.addEventListener(
        'error',
        () => {
          if (target.firstElementChild === img) {
            clearTokenUriHeadPreviewTarget(target);
          }
        },
        { once: true }
      );
      img.src = imageUrl;
      target.replaceChildren(img);
      target.classList.add('on');
      target.setAttribute('aria-hidden', 'false');
    };

    const renderTokenUriHeadPreview = (imageUrl) => {
      renderTokenUriHeadPreviewTarget(dom.tokenUriHeadPreview, imageUrl);
    };

    const renderWalletTokenUriHeadPreview = (imageUrl) => {
      renderTokenUriHeadPreviewTarget(dom.walletTokenUriHeadPreview, imageUrl);
    };

    const resolveTokenUriHeadImage = async (tokenUri) => {
      const inlineImage = decodeTokenUriToImage(tokenUri);
      if (inlineImage) {
        return inlineImage;
      }
      if (isHttpUrl(tokenUri) && isLikelyImageUrl(tokenUri)) {
        return tokenUri;
      }
      const resolvedImage = await fetchTokenImageFromUri(tokenUri);
      if (resolvedImage) {
        return resolvedImage;
      }
      return isHttpUrl(tokenUri) ? tokenUri : null;
    };

    const updateTokenUriHeadPreview = async () => {
      const tokenUri = dom.tokenUriInput.value.trim();
      const requestId = ++state.tokenUriPreviewRequestId;
      clearTokenUriHeadPreview();
      if (!tokenUri) {
        return;
      }
      const imageUrl = await resolveTokenUriHeadImage(tokenUri);
      if (requestId !== state.tokenUriPreviewRequestId || !imageUrl) {
        return;
      }
      renderTokenUriHeadPreview(imageUrl);
    };

    const updateWalletTokenUriHeadPreview = async (tokenUri) => {
      const requestId = ++state.walletTokenUriPreviewRequestId;
      clearWalletTokenUriHeadPreview();
      if (!tokenUri) {
        return;
      }
      const imageUrl = await resolveTokenUriHeadImage(tokenUri);
      if (requestId !== state.walletTokenUriPreviewRequestId || !imageUrl) {
        return;
      }
      renderWalletTokenUriHeadPreview(imageUrl);
    };

    const queueTokenUriHeadPreviewUpdate = () => {
      if (state.tokenUriPreviewTimer !== null) {
        window.clearTimeout(state.tokenUriPreviewTimer);
      }
      state.tokenUriPreviewTimer = window.setTimeout(() => {
        state.tokenUriPreviewTimer = null;
        void updateTokenUriHeadPreview();
      }, 180);
    };

    const setWalletCountLabel = (countOrLabel) => {
      if (!dom.walletCountBadge) {
        return;
      }
      if (typeof countOrLabel === 'number') {
        const full = `${countOrLabel} inscription${countOrLabel === 1 ? '' : 's'}`;
        dom.walletCountBadge.textContent = state.explorerMode
          ? `${countOrLabel} insc.`
          : full;
        dom.walletCountBadge.title = full;
        return;
      }
      dom.walletCountBadge.textContent = countOrLabel;
      dom.walletCountBadge.title = countOrLabel;
    };




    const getGridMimeLabel = (mimeType) => {
      const normalized = mimeType?.trim().toLowerCase() ?? '';
      if (GRID_MIME_LABELS.has(normalized)) {
        return GRID_MIME_LABELS.get(normalized);
      }
      if (normalized.endsWith('+json')) {
        return 'JSON';
      }
      if (normalized.endsWith('+xml')) {
        return 'XML';
      }
      return getMediaKind(normalized || null).toUpperCase();
    };

    const getExplorerTokenFilterKind = (token) => {
      if (token.svgDataUri) {
        return 'image';
      }
      const essence = getMimeTypeEssence(token.meta?.mimeType ?? null) ?? '';
      if (
        EXPLORER_CODE_MIME_TYPES.has(essence) ||
        essence.endsWith('+json') ||
        essence.endsWith('+xml') ||
        essence.endsWith('+yaml')
      ) {
        return 'code';
      }
      if (essence === 'application/pdf') {
        return 'document';
      }
      const kind = getMediaKind(essence || token.meta?.mimeType || null);
      if (kind === 'svg') {
        return 'image';
      }
      if (
        kind === 'image' ||
        kind === 'html' ||
        kind === 'video' ||
        kind === 'audio' ||
        kind === 'text'
      ) {
        return kind;
      }
      return 'other';
    };

    const hasActiveExplorerFilters = () => state.explorerFilterKinds.size > 0;

    const getExplorerFilterLabel = () => {
      if (!hasActiveExplorerFilters()) {
        return 'All types';
      }
      return [...state.explorerFilterKinds]
        .map((kind) => EXPLORER_FILTER_LABELS[kind] ?? kind)
        .join(' + ');
    };

    const setTokenThumbLabel = (thumb, label) => {
      const text = document.createElement('span');
      text.className = 'token-thumb-label';
      text.textContent = label;
      thumb.replaceChildren(text);
    };

    const renderBytesPreview = (target, bytes, mimeType, urlSetter, options = {}) => {
      target.innerHTML = '';
      const previewMimeType =
        resolveMimeType(mimeType ?? null, bytes) ??
        mimeType ??
        null;
      const kind = getMediaKind(previewMimeType);
      let objectUrl = null;
      const getObjectUrl = () => {
        if (!objectUrl) {
          const blob = new Blob([bytes], {
            type: previewMimeType || 'application/octet-stream'
          });
          objectUrl = URL.createObjectURL(blob);
          urlSetter(objectUrl);
        }
        return objectUrl;
      };

      if (kind === 'image' || kind === 'svg') {
        const url = getObjectUrl();
        if (options.truthfulImageSizing) {
          renderSquareImagePreview(target, url, {
            mimeType: previewMimeType,
            isSvgSource: kind === 'svg',
            alt: 'Inscription preview',
            preserveAnimation:
              kind === 'image' && isAnimatedImagePayload(bytes, previewMimeType),
            replayDelayMs:
              kind === 'image'
                ? getFiniteAnimatedImageReplayDelayMs(bytes, previewMimeType)
                : null
          });
          return;
        }
        const img = document.createElement('img');
        img.alt = 'Payload preview';
        applyPixelPerfectImageRendering(img, {
          mimeType: previewMimeType,
          sourceUrl: url,
          isSvgSource: kind === 'svg'
        });
        img.src = url;
        target.append(img);
        return;
      }

      if (kind === 'video') {
        const video = document.createElement('video');
        video.controls = true;
        video.autoplay = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = 'auto';
        video.setAttribute('controlsList', 'nodownload');
        video.src = getObjectUrl();
        target.append(video);
        playPreviewVideoWhenReady(video);
        return;
      }

      if (kind === 'audio') {
        const audio = document.createElement('audio');
        audio.controls = true;
        audio.setAttribute('controlsList', 'nodownload');
        audio.src = getObjectUrl();
        target.append(audio);
        return;
      }

      if (kind === 'html') {
        const frame = document.createElement('iframe');
        frame.title = 'inscription-preview';
        frame.referrerPolicy = 'no-referrer';
        frame.loading = 'lazy';
        frame.sandbox = previewMimeType?.trim().toLowerCase() === 'application/pdf'
          ? ''
          : 'allow-scripts';
        if (options.htmlDoc && previewMimeType?.trim().toLowerCase() !== 'application/pdf') {
          frame.srcdoc = options.interactiveHtml
            ? injectInteractivePreviewHtml(options.htmlDoc)
            : injectGridThumbnailHtml(options.htmlDoc);
        } else {
          frame.src = getObjectUrl();
        }
        target.append(frame);
        return;
      }

      if (kind === 'text') {
        const preview = getTextPreview(bytes, 1400);
        const pre = document.createElement('pre');
        pre.textContent = preview.truncated
          ? `${preview.text}\n...`
          : preview.text;
        target.append(pre);
        return;
      }

      target.textContent = 'Binary payload';
    };

    const setBusy = (busy) => {
      state.busy = busy;
      dom.connectButton.disabled = busy;
      dom.disconnectButton.disabled = busy;
      dom.themeSelect.disabled = busy;
      dom.prepareButton.disabled = busy;
      if (dom.processingNotice) {
        dom.processingNotice.hidden = !busy;
      }
      updateControls();
    };

    const getMismatch = () =>
      getNetworkMismatch(state.contract.network, state.walletSession.network);

    const getViewingWalletAddress = () =>
      state.walletViewAddress ?? state.walletSession.address ?? null;

    const getViewingWalletLabel = () => {
      if (state.walletViewName) {
        return state.walletViewName;
      }
      const viewingAddress = getViewingWalletAddress();
      if (!viewingAddress) {
        return null;
      }
      if (
        state.walletViewResolvedName &&
        addressesEqual(state.walletViewResolvedNameAddress, viewingAddress)
      ) {
        return state.walletViewResolvedName;
      }
      return truncateMiddle(viewingAddress, 8, 8);
    };

    // Reverse-resolve a BNS name for the currently viewed address (display only).
    const resolveViewingWalletName = async () => {
      const viewingAddress = getViewingWalletAddress();
      if (!viewingAddress || state.walletViewName) {
        return;
      }
      if (addressesEqual(state.walletViewResolvedNameAddress, viewingAddress)) {
        return;
      }
      const requestId = ++state.walletViewResolvedNameRequestId;
      state.walletViewResolvedNameAddress = viewingAddress;
      state.walletViewResolvedName = null;
      try {
        const namesResult = await resolveBnsNames({
          address: viewingAddress,
          network: state.contract.network
        });
        if (
          requestId !== state.walletViewResolvedNameRequestId ||
          !addressesEqual(getViewingWalletAddress(), viewingAddress)
        ) {
          return;
        }
        state.walletViewResolvedName = namesResult.primary;
        if (namesResult.primary) {
          updateWalletStatus();
          updateConnectedReadout();
        }
      } catch (error) {
        debugLog(
          'bns',
          'viewing wallet name lookup failed',
          {
            wallet: truncateMiddle(viewingAddress, 8, 8),
            error: error instanceof Error ? error.message : String(error)
          },
          'warn'
        );
      }
    };

    const getConnectedWalletLabel = () => {
      const connectedAddress = state.walletSession.address ?? null;
      if (!connectedAddress) {
        return null;
      }
      return state.connectedWalletName &&
        addressesEqual(state.connectedWalletNameAddress, connectedAddress)
        ? state.connectedWalletName
        : truncateMiddle(connectedAddress, 8, 8);
    };

    const updateConnectedReadout = () => {
      const connectedAddress = state.walletSession.address ?? null;
      const connected = state.walletSession.isConnected && !!connectedAddress;
      if (!dom.connectedReadout || !dom.connectedReadoutValue || !dom.connectedReadoutAddress) {
        return;
      }
      dom.connectedReadout.hidden = !connected;
      if (!connected) {
        dom.connectedReadoutValue.textContent = '';
        dom.connectedReadoutAddress.textContent = '';
        return;
      }
      const label = getConnectedWalletLabel() ?? truncateMiddle(connectedAddress, 8, 8);
      const hasResolvedName =
        !!state.connectedWalletName &&
        addressesEqual(state.connectedWalletNameAddress, connectedAddress);
      dom.connectedReadoutValue.textContent = label;
      dom.connectedReadout.title = hasResolvedName
        ? `${state.connectedWalletName} (${connectedAddress})`
        : connectedAddress;
      dom.connectedReadoutAddress.textContent = hasResolvedName ? connectedAddress : '';
      dom.connectedReadoutAddress.hidden = !hasResolvedName;
    };

    const resolveConnectedWalletName = async () => {
      const connectedAddress = state.walletSession.address?.trim() ?? '';
      if (!connectedAddress) {
        return;
      }
      const alreadyResolvingConnectedAddress =
        addressesEqual(state.connectedWalletNameAddress, connectedAddress) &&
        (state.connectedWalletNamePending || state.connectedWalletNameResolved);
      if (alreadyResolvingConnectedAddress) {
        return;
      }
      const requestId = ++state.connectedWalletNameRequestId;
      state.connectedWalletNameAddress = connectedAddress;
      state.connectedWalletName = null;
      state.connectedWalletNameResolved = false;
      state.connectedWalletNamePending = true;
      try {
        const namesResult = await resolveBnsNames({
          address: connectedAddress,
          network: state.contract.network
        });
        if (
          requestId !== state.connectedWalletNameRequestId ||
          !addressesEqual(state.walletSession.address, connectedAddress)
        ) {
          return;
        }
        state.connectedWalletName = namesResult.primary;
        state.connectedWalletNameResolved = true;
        updateConnectedReadout();
        updateWalletStatus();
      } catch (error) {
        if (requestId !== state.connectedWalletNameRequestId) {
          return;
        }
        state.connectedWalletNameResolved = true;
        debugLog(
          'bns',
          'connected wallet name lookup failed',
          {
            wallet: truncateMiddle(connectedAddress, 8, 8),
            error: error instanceof Error ? error.message : String(error)
          },
          'warn'
        );
      } finally {
        if (requestId === state.connectedWalletNameRequestId) {
          state.connectedWalletNamePending = false;
        }
      }
    };

    const getWalletLookupDisplayValue = () =>
      state.walletViewName
        ? toBtcLookupLabel(state.walletViewName)
        : state.walletViewAddress ?? '';

    const isViewingExternalConnectedWallet = () =>
      !!state.walletSession.address &&
      !!state.walletViewAddress &&
      !addressesEqual(state.walletViewAddress, state.walletSession.address);

    const shouldClearWalletLookupOnSubmit = () => {
      const hasActiveView =
        !!state.curatedGalleryId ||
        !!state.walletViewAddress ||
        !!state.walletViewName ||
        isViewingExternalConnectedWallet();
      if (!hasActiveView) {
        return false;
      }
      // Only treat the submit as "clear" (back to the default view) when the box
      // is empty or still shows the wallet currently on screen. A NEW, different
      // address/name means the user wants to jump straight to that wallet, so we
      // must NOT clear first. Previously this returned true for ANY active view,
      // which swallowed the second lookup — you had to clear, then retype the
      // target before it would load.
      const inputValue = normalizeWalletLookupInputValue(dom.walletLookupInput.value);
      const displayValue = getWalletLookupDisplayValue();
      return (
        !inputValue ||
        inputValue === displayValue ||
        (!!state.walletViewAddress && addressesEqual(inputValue, state.walletViewAddress))
      );
    };

    const getReadOnlySenderAddress = () =>
      state.walletSession.address ?? getViewingWalletAddress() ?? state.contract.address;

    const clearSelectedTokenPreview = () => {
      state.tokenPreviewRequestId += 1;
      state.selectedTokenId = null;
      revokeTokenPreview();
      dom.explorerLink.hidden = true;
      dom.xtrataExplorerLink.hidden = true;
      clearElement(dom.tokenPreviewMedia, 'No selection');
      renderNoSelectedInscriptionMeta();
      void updateWalletTokenUriHeadPreview(null);
      updateTransferControls();
    };

    const isConnectedWalletAddress = (address) =>
      !!state.walletSession.isConnected &&
      !!state.walletSession.address &&
      !!address &&
      addressesEqual(address, state.walletSession.address);

    const getConnectedLedgerModeStorageKey = () => {
      if (!state.walletSession.address) {
        return null;
      }
      return [
        CONNECTED_LEDGER_MODE_STORAGE_PREFIX,
        state.contract.network,
        getContractId(state.contract),
        state.walletSession.address
      ].join(':');
    };

    const refreshConnectedWalletMatureMode = () => {
      const key = getConnectedLedgerModeStorageKey();
      if (!key) {
        state.connectedWalletMatureMode = false;
        return;
      }
      try {
        state.connectedWalletMatureMode = window.localStorage.getItem(key) === '1';
      } catch (error) {
        state.connectedWalletMatureMode = false;
      }
    };

    const markConnectedWalletMatureMode = () => {
      if (!state.walletSession.isConnected || !state.walletSession.address) {
        return;
      }
      if (state.connectedWalletMatureMode) {
        return;
      }
      state.connectedWalletMatureMode = true;
      const key = getConnectedLedgerModeStorageKey();
      if (!key) {
        return;
      }
      try {
        window.localStorage.setItem(key, '1');
      } catch (error) {}
    };

    const rememberConnectedWalletResult = (viewingAddress, count) => {
      if (!isConnectedWalletAddress(viewingAddress) || count <= 0) {
        return;
      }
      markConnectedWalletMatureMode();
    };

    const getSelectedToken = () => {
      if (state.selectedTokenId === null) {
        return null;
      }
      return (
        state.walletTokenCache.get(state.selectedTokenId.toString()) ??
        state.walletTokens.find((token) => token.id === state.selectedTokenId) ??
        null
      );
    };

    // Gallery discovery: when a BNS name resolves, quietly probe /g/<name> and
    // offer a "Visit gallery" link if the name has a published gallery manifest.
    let galleryProbeRequestId = 0;
    const galleryProbeCache = new Map();
    const appendGalleryLink = (name) => {
      const link = document.createElement('a');
      link.href = `/g/${encodeURIComponent(name)}`;
      link.target = '_blank';
      link.rel = 'noopener';
      link.className = 'wallet-gallery-link';
      link.style.marginLeft = '8px';
      link.style.fontWeight = '700';
      link.textContent = 'Visit gallery →';
      dom.walletLookupStatus.appendChild(link);
    };
    const maybeOfferGalleryLink = () => {
      const name = state.walletViewName;
      if (!name || !dom.walletLookupStatus) {
        return;
      }
      const cached = galleryProbeCache.get(name);
      if (cached === true) {
        appendGalleryLink(name);
        return;
      }
      if (cached === false) {
        return;
      }
      const requestId = ++galleryProbeRequestId;
      fetch(`/g/${encodeURIComponent(name)}?format=json`)
        .then((response) => {
          galleryProbeCache.set(name, response.ok);
          if (response.ok && requestId === galleryProbeRequestId && state.walletViewName === name) {
            appendGalleryLink(name);
          }
        })
        .catch(() => {
          galleryProbeCache.set(name, false);
        });
    };

    const updateWalletLookupStatus = () => {
      dom.walletLookupStatus.hidden = false;

      if (state.walletLookupNotice) {
        dom.walletLookupStatus.textContent = state.walletLookupNotice;
        return;
      }

      const activeExampleInfo =
        activeExampleDescriptionKey
          ? EXAMPLE_VIEW_DESCRIPTIONS[activeExampleDescriptionKey] ?? null
          : null;

      if (activeExampleInfo) {
        dom.walletLookupStatus.textContent = activeExampleInfo.description;
        return;
      }

      const viewingAddress = getViewingWalletAddress();

      if (state.walletViewAddress) {
        dom.walletLookupStatus.textContent = `Viewing ${getViewingWalletLabel()}.`;
        maybeOfferGalleryLink();
        return;
      }

      dom.walletLookupStatus.textContent = viewingAddress
        ? 'Using connected wallet.'
        : 'Using connected wallet when available.';
    };

    const updateTransferControls = () => {
      const selectedToken = getSelectedToken();
      const walletAddress = state.walletSession.address ?? null;
      const walletOwnsToken =
        !!selectedToken && !!walletAddress && addressesEqual(selectedToken.owner, walletAddress);
      const transferValidation = validateTransferRequest({
        senderAddress: walletOwnsToken ? walletAddress : null,
        recipientAddress: dom.transferRecipientInput.value,
        tokenId: selectedToken?.id ?? null,
        networkMismatch: !!getMismatch()
      });
      let message = getTransferValidationMessage(transferValidation);
      if (!selectedToken) {
        message = 'Select an inscription to send.';
      } else if (!walletAddress) {
        message = 'Connect the owner wallet to send this inscription.';
      } else if (!walletOwnsToken) {
        message = 'Only the connected owner can send this inscription.';
      }
      const listBtn = $('listForSaleButton');
      if (listBtn) listBtn.disabled = state.selectedTokenId === null || !state.walletSession.isConnected;
      dom.transferButton.disabled =
        state.busy ||
        state.transferPending ||
        !walletOwnsToken ||
        !transferValidation.ok;
      dom.transferRecipientInput.disabled = state.transferPending;
      if (!state.transferPending) {
        dom.transferStatus.textContent =
          message ?? 'Ready to send the selected inscription.';
      }
    };

    const isMatureMobileWalletView = () =>
      (document.body.classList.contains('has-ledger') ||
        document.body.classList.contains('explorer-mode')) &&
      window.matchMedia(
        document.body.classList.contains('explorer-mode')
          ? '(max-width: 980px), (pointer: coarse)'
          : '(max-width: 1366px), (pointer: coarse)'
      ).matches;

    const scrollToWalletGrid = () => {
      const target = dom.tokenGrid ?? dom.walletGridStatus;
      target?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    };

    const scrollToSelectedPreview = () => {
      dom.tokenPreviewPanel?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    };

    const setExperienceMode = () => {
      const connected = state.walletSession.isConnected && !!state.walletSession.address;
      const viewingAddress = getViewingWalletAddress();
      // Escrowed twins injected for this wallet count as visible holdings, so a
      // wallet that holds *only* an escrowed twin still opens the grid/ledger.
      const count =
        (state.walletUsesPagedHoldings ? state.walletTotalCount : state.walletTokenIds.length) +
        getInjectedEscrowTwinIds().length;
      const viewingConnectedWallet = isConnectedWalletAddress(viewingAddress);
      const connectedWalletHasVisibleLedger = viewingConnectedWallet && count > 0;
      const hasCuratedGallery = !!state.curatedGalleryId && count > 0;
      const hasHomeLatestView = state.homeLatestView && count > 0;
      const hasLedger =
        connected && (state.connectedWalletMatureMode || connectedWalletHasVisibleLedger);
      const hasPublicLedger =
        (!connected && !!viewingAddress && count > 0) || hasCuratedGallery || hasHomeLatestView;
      document.body.classList.toggle('has-ledger', hasLedger);
      document.body.classList.toggle('has-public-ledger', hasPublicLedger);
      document.body.classList.toggle('explorer-mode', state.explorerMode);
      // Viewing a specific wallet inside Xplorer: hide the global-feed controls
      // (page/token jump + type filters) to avoid confusion — they don't apply
      // to a single wallet's holdings.
      document.body.classList.toggle(
        'explorer-wallet-view',
        state.explorerMode && !!state.walletViewAddress
      );
      document.body.classList.toggle('intro-mode', !hasLedger && !state.explorerMode);
      if (dom.walletTitle) {
        if (state.explorerMode) {
          dom.walletTitle.setAttribute('aria-label', 'Xtrata Xplorer');
          dom.walletTitle.innerHTML =
            `<img class="panel-title__brand-x" src="${XTRATA_BRAND_MARK_URL}" alt="X" />trata ` +
            `<img class="panel-title__brand-x" src="${XTRATA_BRAND_MARK_URL}" alt="X" />plorer`;
        } else {
          dom.walletTitle.removeAttribute('aria-label');
          dom.walletTitle.textContent = 'Wallet Inscriptions';
        }
      }
      if (dom.introNetworkValue) {
        dom.introNetworkValue.textContent = `Stacks ${state.contract.network}`;
      }
      if (dom.introContractValue) {
        dom.introContractValue.textContent = getContractId(state.contract);
      }
      if (dom.registryModeBadge) {
        dom.registryModeBadge.textContent =
          PAGE_MODE === 'home'
            ? 'A living world of permanent digital objects'
            : hasLedger
              ? 'Live registry view'
              : 'Permanent media records';
      }
      if (dom.registryIntroLead) {
        dom.registryIntroLead.textContent =
          PAGE_MODE === 'home'
            ? 'Make, collect, trade, connect and build with songs, art, apps, games and ideas that live fully on-chain.'
            : state.curatedGalleryTitle
              ? `${state.curatedGalleryTitle} is open below in Wallet Inscriptions.`
              : state.homeLatestView
                ? 'The latest Xtrata inscriptions are open below in Wallet Inscriptions.'
                : !viewingAddress
                  ? 'Create and hold durable records for songs, masters, artwork, credits, documents, apps, and collaboration history, anchored to Bitcoin through Stacks.'
                  : !connected && count === 0
                    ? 'Public wallet lookup is active, but this contract has no inscriptions for that address yet.'
                    : connected && count === 0
                      ? 'Your wallet is connected, but this contract has no inscriptions for it yet. Start with a simple record, then the page will open into the full registry ledger view.'
                      : connected
                        ? `Wallet connected with ${count} inscription${count === 1 ? '' : 's'}. Switching into the fuller registry view.`
                        : `Public ledger view loaded with ${count} inscription${count === 1 ? '' : 's'} available for this address.`;
      }
      if (dom.introStateValue) {
        dom.introStateValue.textContent = state.curatedGalleryTitle
          ? `${count} selected inscription${count === 1 ? '' : 's'} loaded.`
          : state.homeLatestView
          ? `Latest page loaded with ${state.walletPageIds.length} inscription${state.walletPageIds.length === 1 ? '' : 's'}.`
          : !viewingAddress
          ? 'Connect a wallet or enter an address to inspect a ledger.'
          : count === 0
            ? 'No inscriptions found for this contract yet.'
            : `${count} inscription${count === 1 ? '' : 's'} available in this ledger.`;
      }
      if (dom.introConnectButton) {
        dom.introConnectButton.hidden = connected;
      }
      if (dom.introMyWalletLink) {
        dom.introMyWalletLink.hidden = !connected;
      }
    };

    const updateControls = () => {
      setExperienceMode();
      const connected = state.walletSession.isConnected && !!state.walletSession.address;
      const mismatch = getMismatch();
      const viewingAddress = getViewingWalletAddress();
      const duplicateBlocked = state.duplicateId !== null && !dom.allowDuplicateInput.checked;
      const parentBlocked = getParentBlockingMessage();
      const visibleWalletCount = state.walletUsesPagedHoldings
        ? state.walletTotalCount
        : state.walletTokenIds.length;
      const hasConnectedInscriptionView =
        connected && document.body.classList.contains('has-ledger') && visibleWalletCount > 0;
      const hasGridBackTarget =
        (hasConnectedInscriptionView || state.explorerMode) && state.selectedTokenId !== null;
      dom.connectButton.hidden = connected;
      dom.disconnectButton.hidden = !connected;
      dom.viewInscriptionsButton.hidden = !hasConnectedInscriptionView;
      dom.viewInscriptionsButton.disabled = state.busy;
      dom.backToGridButton.hidden = !hasGridBackTarget;
      dom.inscribeButton.disabled =
        state.busy ||
        !connected ||
        !!mismatch ||
        !state.prepared ||
        duplicateBlocked ||
        !!parentBlocked;
      dom.inscribeButton.textContent = state.uploadState
        ? 'Resume inscription'
        : shouldUseSingleTx()
          ? (state.prepared?.parentIds?.length ?? 0) > 0
            ? 'Start relationship single-tx inscription'
            : (state.prepared?.dependencyIds?.length ?? 0) > 0
            ? 'Start recursive single-tx inscription'
            : 'Start single-tx inscription'
          : (state.prepared?.parentIds?.length ?? 0) > 0
            ? 'Start relationship inscription'
            : (state.prepared?.dependencyIds?.length ?? 0) > 0
            ? 'Start recursive inscription'
            : 'Start inscription';
      if (dom.payloadPreviewExpandButton) {
        dom.payloadPreviewExpandButton.disabled = state.busy || !state.prepared;
        dom.payloadPreviewExpandButton.hidden = !state.prepared;
      }
      renderParentSelection();
      dom.refreshWalletButton.disabled = state.busy || state.walletLoadingPage || (!viewingAddress && !state.explorerMode);
      dom.walletLookupButton.textContent = shouldClearWalletLookupOnSubmit()
        ? 'Clear'
        : state.walletLookupPending
          ? 'Resolving'
          : 'View';
      dom.walletLookupButton.disabled = state.busy || state.walletLookupPending;
      if (dom.explorerJumpButton) {
        const explorerControlsDisabled =
          !state.explorerMode ||
          state.busy ||
          state.walletLoadingPage;
        dom.explorerJumpButton.disabled = explorerControlsDisabled;
        dom.explorerLatestButton.disabled = explorerControlsDisabled;
        dom.explorerPageInput.disabled = explorerControlsDisabled;
        dom.explorerTokenInput.disabled = explorerControlsDisabled;
      }
      updateWalletLookupInputMode();
      updateConnectedReadout();
      updateWalletLookupStatus();
      updateTransferControls();
      updateWalletPagerControls();
      syncExplorerFilterControls();
      updateFullscreenControls();
    };

    const getWalletPageCount = () =>
      state.walletUsesPagedHoldings
        ? state.walletTotalCount > 0
          ? Math.ceil(state.walletTotalCount / WALLET_PAGE_SIZE)
          : 0
        : state.walletTokenIds.length > 0
          ? Math.ceil(state.walletTokenIds.length / WALLET_PAGE_SIZE)
          : 0;

    const clampWalletPageIndex = () => {
      const pageCount = getWalletPageCount();
      if (pageCount === 0) {
        state.walletPageIndex = 0;
        return;
      }
      state.walletPageIndex = Math.min(
        Math.max(0, state.walletPageIndex),
        pageCount - 1
      );
    };

    // Prepend escrowed-twin ids to page 0 of the wallet view (deduped against
    // the wallet's actual holdings). They ride along page 0 only so the
    // server-side holdings pagination math is unaffected.
    const withInjectedEscrowTwins = (pageIds) => {
      if (state.walletPageIndex !== 0) {
        return pageIds;
      }
      const injected = getInjectedEscrowTwinIds();
      if (injected.length === 0) {
        return pageIds;
      }
      const existing = new Set(pageIds.map((id) => id.toString()));
      const prefix = injected.filter((id) => !existing.has(id.toString()));
      return prefix.length > 0 ? [...prefix, ...pageIds] : pageIds;
    };

    const getWalletPageIds = () => {
      clampWalletPageIndex();
      if (state.walletUsesPagedHoldings) {
        return withInjectedEscrowTwins(state.walletPageIds);
      }
      const start = state.walletPageIndex * WALLET_PAGE_SIZE;
      return withInjectedEscrowTwins(
        state.walletTokenIds.slice(start, start + WALLET_PAGE_SIZE)
      );
    };

    const updateWalletPagerControls = () => {
      if (!dom.walletPrevButton || !dom.walletNextButton || !dom.walletPageReadout) {
        return;
      }
      if (
        state.explorerMode &&
        hasActiveExplorerFilters() &&
        !state.explorerFilterIndexComplete
      ) {
        if (dom.explorerPageInput) {
          dom.explorerPageInput.max = '';
          dom.explorerPageInput.value = '';
        }
        dom.walletPageReadout.textContent = 'Latest matches';
        dom.walletPrevButton.disabled = true;
        dom.walletNextButton.disabled = true;
        if (dom.explorerPrevPageButton) dom.explorerPrevPageButton.disabled = true;
        if (dom.explorerNextPageButton) dom.explorerNextPageButton.disabled = true;
        return;
      }
      const pageCount = getWalletPageCount();
      const hasPages = pageCount > 0;
      if (state.explorerMode && dom.explorerPageInput) {
        dom.explorerPageInput.max = hasPages ? String(pageCount) : '';
        dom.explorerPageInput.value = hasPages ? String(state.walletPageIndex + 1) : '';
      }
      dom.walletPageReadout.textContent = hasPages
        ? `Page ${state.walletPageIndex + 1} / ${pageCount}`
        : 'Page 0 / 0';
      dom.walletPrevButton.disabled =
        state.busy || state.walletLoadingPage || !hasPages || state.walletPageIndex <= 0;
      dom.walletNextButton.disabled =
        state.busy ||
        state.walletLoadingPage ||
        !hasPages ||
        state.walletPageIndex >= pageCount - 1;
      if (dom.explorerPrevPageButton) dom.explorerPrevPageButton.disabled = dom.walletPrevButton.disabled;
      if (dom.explorerNextPageButton) dom.explorerNextPageButton.disabled = dom.walletNextButton.disabled;
    };

    const syncExplorerFilterControls = () => {
      const disabled =
        !state.explorerMode ||
        state.busy;
      if (dom.explorerFilterGroup) {
        dom.explorerFilterGroup.classList.toggle('is-collapsed', state.explorerFiltersCollapsed);
      }
      if (dom.explorerFilterToggle) {
        dom.explorerFilterToggle.disabled = disabled;
        dom.explorerFilterToggle.setAttribute(
          'aria-expanded',
          state.explorerFiltersCollapsed ? 'false' : 'true'
        );
        dom.explorerFilterToggle.setAttribute(
          'aria-label',
          state.explorerFiltersCollapsed ? 'Show type filters' : 'Hide type filters'
        );
        dom.explorerFilterToggle.title = state.explorerFiltersCollapsed
          ? 'Show type filters'
          : 'Hide type filters';
        dom.explorerFilterToggle.textContent = state.explorerFiltersCollapsed ? '▸' : '▾';
      }
      dom.explorerFilterInputs.forEach((input) => {
        const kind = input.dataset.explorerFilter ?? '';
        input.checked = state.explorerFilterKinds.has(kind);
        input.disabled = disabled;
        input.closest('.explorer-filter-chip')?.classList.toggle('is-active', input.checked);
      });
      if (dom.explorerClearFiltersButton) {
        dom.explorerClearFiltersButton.disabled =
          disabled || state.explorerFilterKinds.size === 0;
      }
    };

    const applyContract = (contract) => {
      state.contract = contract;
      state.client = createXtrataClient({ contract });
      state.legacyContract = getLegacyContract(contract);
      state.legacyClient = state.legacyContract
        ? createXtrataClient({ contract: state.legacyContract })
        : null;
      state.primaryMintedIdCache = null;
      refreshConnectedWalletMatureMode();
      logApiConfiguration();
      setExperienceMode();
      dom.networkBadge.textContent = contract.network;
      dom.mintSubtitle.textContent = `${contract.label} · ${contract.protocolVersion}`;
      state.prepared = null;
      state.duplicateId = null;
      state.uploadState = null;
      state.parentIds = [];
      state.parentStatusById = new Map();
      state.parentStatusMessage = null;
      state.parentChecking = false;
      state.parentCheckRequestId += 1;
      dom.parentIdsInput.value = '';
      state.walletTokenIds = [];
      state.walletPageIds = [];
      state.walletTotalCount = 0;
      state.walletUsesPagedHoldings = false;
      state.walletTokenCache = new Map();
      state.walletTokens = [];
      state.walletPageIndex = 0;
      state.selectedTokenId = null;
      state.explorerLatestTokenId = null;
      state.explorerFilteredTokenIds = [];
      state.explorerIndexedSummaryIds = new Set();
      state.explorerFilterIndexContractId = null;
      state.explorerFilterIndexLoading = false;
      state.explorerFilterIndexComplete = false;
      state.explorerFilterBackgroundLoading = false;
      state.explorerFollowLatestFiltered = false;
      state.explorerFilterIndexRunId += 1;
      void closeFullscreenViewer();
      void updateWalletTokenUriHeadPreview(null);
      resetBackgroundThumbnailHydration();
      revokeGridThumbUrls();
      renderPreparedState();
      resetSteps();
      updateWalletStatus();
      updateControls();
    };

    const updateWalletStatus = () => {
      const connected = state.walletSession.isConnected && !!state.walletSession.address;
      const mismatch = getMismatch();
      const viewingAddress = getViewingWalletAddress();
      const viewingLabel = getViewingWalletLabel();
      if (state.explorerMode) {
        setStatus(
          dom.walletStatus,
          `<strong>Xplorer</strong> ${getContractId(state.contract)}`,
          'ready',
          'blue'
        );
        dom.walletSubtitle.textContent = `Browse Xtrata inscriptions.`;
        return;
      }
      if (state.curatedGalleryTitle) {
        dom.walletSubtitle.textContent = `Viewing ${state.curatedGalleryTitle}.`;
      }
      if (state.homeLatestView) {
        setStatus(
          dom.walletStatus,
          `<strong>Latest</strong> ${getContractId(state.contract)}`,
          'ready',
          'blue'
        );
        dom.walletSubtitle.textContent = `Viewing latest ${state.contract.label} inscriptions.`;
        return;
      }
      if (!connected) {
        setStatus(
          dom.walletStatus,
          '<strong>Wallet</strong> not connected',
          'idle',
          'amber'
        );
        dom.walletSubtitle.textContent = state.curatedGalleryTitle
          ? `Viewing ${state.curatedGalleryTitle}.`
          : viewingAddress
          ? `Viewing ${viewingLabel}.`
          : 'Connect a wallet or enter an address.';
        if (!state.curatedGalleryTitle && viewingAddress) {
          void resolveViewingWalletName();
        }
        return;
      }
      if (mismatch) {
        setStatus(
          dom.walletStatus,
          `<strong>Wallet</strong> ${getConnectedWalletLabel() ?? truncateMiddle(state.walletSession.address)} · expected ${mismatch.expected}`,
          'network',
          'rose'
        );
        dom.walletSubtitle.textContent = state.walletViewAddress
          ? `Viewing ${viewingLabel}.`
          : `Wallet is on ${mismatch.actual}; contract is ${mismatch.expected}.`;
        return;
      }
      setStatus(
        dom.walletStatus,
        `<strong>Wallet</strong> ${getConnectedWalletLabel() ?? truncateMiddle(state.walletSession.address)}`,
        'ready',
        'blue'
      );
      void resolveConnectedWalletName();
      if (state.walletViewAddress) {
        void resolveViewingWalletName();
      }
      dom.walletSubtitle.textContent = state.curatedGalleryTitle
        ? `Viewing ${state.curatedGalleryTitle}.`
        : state.walletViewAddress
        ? `Viewing ${viewingLabel}.`
        : `Connected Wallet: ${getConnectedWalletLabel()}.`;
    };

    const renderPreparedState = () => {
      if (!state.prepared) {
        revokePayloadPreview();
        if (state.selectedFile) {
          clearElement(dom.payloadPreview, 'Ready to prepare');
          renderMeta(dom.preparedMeta, [
            ['Status', 'Selected - not prepared'],
            {
              key: 'File',
              value: state.selectedFile.name,
              title: state.selectedFile.name
            },
            ['Size', formatBytes(BigInt(state.selectedFile.size))],
            ['Next step', 'Add parents, then click Prepare']
          ]);
        } else {
          clearElement(dom.payloadPreview, 'No payload');
          renderMeta(dom.preparedMeta, [['Status', 'Not prepared']]);
        }
        dom.duplicateWarning.classList.remove('on');
        renderResumeNotice();
        if (dom.inscribeTextButton) dom.inscribeTextButton.disabled = true;
        if (dom.largeFileNotice) dom.largeFileNotice.hidden = true;
        updateControls();
        return;
      }

      const feeEstimate = getFeeEstimate(state.prepared.chunks.length);
      const usesSingleTx = shouldUseSingleTx();
      // When the core charges a single flat single-tx fee (quoted in advance),
      // show that real amount instead of the summed 3-stage estimate.
      const singleTxFeeMicroStx = state.prepared.singleTxFeeMicroStx;
      const stagedFee = state.prepared.stagedFee;
      const effectiveFeeEstimate =
        shouldUseNativeSingleTx() && typeof singleTxFeeMicroStx === 'number'
          ? {
              beginMicroStx: singleTxFeeMicroStx,
              sealMicroStx: 0,
              totalMicroStx: singleTxFeeMicroStx,
              feeBatches: 0
            }
          : stagedFee
            ? {
                beginMicroStx: stagedFee.beginMicroStx,
                sealMicroStx: stagedFee.sealMicroStx,
                totalMicroStx: stagedFee.totalMicroStx,
                feeBatches: feeEstimate.feeBatches
              }
            : feeEstimate;
      const sequentialTxEstimate = estimateSequentialMintTransactions({
        totalChunks: state.prepared.chunks.length,
        batchSize: Math.min(DEFAULT_BATCH_SIZE, MAX_UPLOAD_BATCH_SIZE)
      });
      const dataMiningEstimate = formatDataMiningEstimate(state.prepared.bytes);
      const transactionCount = getPreparedTransactionCount(
        usesSingleTx,
        sequentialTxEstimate
      );
      const dependencyIds = state.prepared.dependencyIds ?? [];
      const dependencyLabel = dependencyIds.map((id) => id.toString()).join(', ');
      const parentIds = state.prepared.parentIds ?? [];
      const parentLabel = parentIds.map((id) => id.toString()).join(', ');

      // Per-stage protocol fee breakdown, so the user sees what is charged when.
      // Fees are only really paid on delivery: a small anti-spam fee up front,
      // nothing on each upload batch, and the bulk only on the seal that mints
      // the token.
      const usdBook = state.usdPriceBook;
      let feeBreakdownRows;
      if (shouldUseNativeSingleTx() && typeof singleTxFeeMicroStx === 'number') {
        feeBreakdownRows = [
          {
            key: 'Inscription fee',
            subkey: 'Charged on mint — one transaction',
            value: formatMicroStxWithUsd(BigInt(Math.round(singleTxFeeMicroStx)), usdBook).combined,
            layout: 'stack'
          }
        ];
      } else if (stagedFee) {
        const batchCount = Math.max(0, Number(transactionCount) - 2);
        feeBreakdownRows = [
          {
            key: 'Begin — anti-spam fee',
            subkey: 'Paid now, on the first transaction',
            value: formatMicroStxWithUsd(BigInt(Math.round(stagedFee.beginMicroStx)), usdBook).combined,
            layout: 'stack'
          },
          {
            key: `Upload batch${batchCount === 1 ? '' : 'es'}${batchCount > 0 ? ` (${batchCount})` : ''}`,
            subkey: 'No fee — your data is uploaded free',
            value: 'Free',
            layout: 'stack'
          },
          {
            key: 'Seal — mints your token',
            subkey: 'The remaining fee, paid only on delivery',
            value: formatMicroStxWithUsd(BigInt(Math.round(stagedFee.sealMicroStx)), usdBook).combined,
            layout: 'stack'
          }
        ];
      } else {
        feeBreakdownRows = [
          { key: 'Protocol fee', value: formatExtraFee(effectiveFeeEstimate), layout: 'stack' }
        ];
      }

      renderMeta(dom.preparedMeta, [
        { section: 'File' },
        {
          key: 'Name',
          value: state.prepared.file.name,
          title: state.prepared.file.name,
          valueClass: 'meta-value--filename'
        },
        ['Size', formatBytes(BigInt(state.prepared.bytes.length))],
        ['Type', state.prepared.mimeType],
        ['Chunks', state.prepared.chunks.length.toString()],
        {
          key: 'Hash',
          value: 'SHA-256 ready',
          title: state.prepared.expectedHashHex,
          tooltip: state.prepared.expectedHashHex
        },
        ...(dependencyIds.length > 0
          ? [
              {
                key: 'Dependencies',
                value: dependencyLabel,
                title: `Recursive dependency inscription ID${dependencyIds.length === 1 ? '' : 's'}: ${dependencyLabel}`,
                wide: true
              }
            ]
          : []),
        ...(parentIds.length > 0
          ? [
              {
                key: 'Parents',
                value: parentLabel,
                title: `Parent inscription ID${parentIds.length === 1 ? '' : 's'}: ${parentLabel}`,
                wide: true
              }
            ]
          : []),
        { section: 'Mint plan' },
        {
          key: 'Transactions required',
          value: transactionCount.toString(),
          title: `${transactionCount} transaction${
            transactionCount === 1 ? '' : 's'
          } required`,
          layout: 'stat',
          valueClass: 'meta-value--count'
        },
        { section: 'Protocol fee — paid on delivery' },
        ['Live exchange rate', getLiveStxUsdRateLabel()],
        ...feeBreakdownRows,
        {
          key: 'Mining fee',
          value: dataMiningEstimate.label,
          title: dataMiningEstimate.detail,
          layout: 'stack'
        },
        {
          key: 'Total estimated cost',
          subkey: 'For this inscription',
          value: formatEstimatedTotalFees(
            effectiveFeeEstimate,
            dataMiningEstimate.miningFeeMicroStx
          ),
          layout: 'total'
        }
      ]);

      revokePayloadPreview();
      renderBytesPreview(dom.payloadPreview, state.prepared.bytes, state.prepared.mimeType, (url) => {
        state.payloadPreviewUrl = url;
      }, {
        htmlDoc:
          getMediaKind(state.prepared.mimeType) === 'html'
            ? new TextDecoder().decode(state.prepared.bytes)
            : null,
        interactiveHtml: true
      });

      if (state.duplicateId !== null) {
        dom.duplicateText.textContent =
          `Existing inscription found at ${formatTokenId(state.duplicateId)}. This content is already safely on-chain.`;
        dom.duplicateWarning.classList.add('on');
      } else {
        dom.duplicateWarning.classList.remove('on');
      }
      renderResumeNotice();
      // Streamlined text card: cost is the flat rate (shown by syncTextCard); just keep the
      // inscribe button in sync once the background prepare is ready.
      if (dom.inscribeTextButton) {
        const textCardBytes = new TextEncoder().encode(dom.textPayload.value).length;
        dom.inscribeTextButton.disabled = !(state.prepared && textCardBytes > 0 && textCardBytes <= 16384 && !state.busy);
      }
      // Large-file nudge: over the single-tx limit (> 512 KB) → suggest the Wizard (non-blocking).
      if (dom.largeFileNotice) {
        const staged = !!state.prepared && transactionCount > 1;
        dom.largeFileNotice.hidden = !staged;
        if (staged && dom.largeFileNoticeText) {
          dom.largeFileNoticeText.textContent =
            `At ${formatBytes(BigInt(state.prepared.bytes))} it's over the 512 KB single-transaction limit, so inscribing it here takes ${transactionCount} wallet signatures. It's completely safe — the Wizard just does the whole thing in one click and one payment.`;
        }
      }
      updateControls();
    };

    const inferTextFileName = (mimeType) => {
      const requested = dom.nameInput.value.trim();
      if (requested) {
        return requested;
      }
      if (mimeType === 'application/json') {
        return 'inscription.json';
      }
      if (mimeType === 'text/html') {
        return 'inscription.html';
      }
      if (mimeType === 'image/svg+xml') {
        return 'inscription.svg';
      }
      return 'inscription.txt';
    };

    const resolvePayloadFile = () => {
      if (state.selectedFile) {
        return state.selectedFile;
      }
      const text = dom.textPayload.value;
      if (text.length === 0) {
        throw new Error('Select a file or enter a text payload.');
      }
      const mimeType = dom.payloadType.value || 'text/plain';
      return new File([text], inferTextFileName(mimeType), { type: mimeType });
    };

    const validatePayload = (file, bytes, chunks, tokenUriValue) => {
      if (bytes.length === 0 || chunks.length === 0) {
        throw new Error('Payload is empty.');
      }
      const mimeType = resolveInscriptionMimeType({
        fileName: file.name,
        declaredMimeType: file.type || dom.payloadType.value || 'application/octet-stream',
        bytes
      });
      if (!isAscii(mimeType) || mimeType.length > MAX_MIME_LENGTH) {
        throw new Error('Mime type must be ASCII and no more than 64 characters.');
      }
      if (!isAscii(tokenUriValue) || tokenUriValue.length > MAX_TOKEN_URI_LENGTH) {
        throw new Error('Token URI must be ASCII and no more than 256 characters.');
      }
      return mimeType;
    };

    const normalizeOpusHandoffDependencyIds = (dependencies) => {
      const tokens = Array.isArray(dependencies)
        ? dependencies
        : typeof dependencies === 'string'
        ? dependencies.split(/[,\s]+/)
        : [];
      const ids = [];
      const invalidTokens = [];
      for (const value of tokens) {
        const token = String(value ?? '').trim().replace(/^#/, '');
        if (!token) {
          continue;
        }
        if (!/^\d+$/.test(token)) {
          invalidTokens.push(String(value));
          continue;
        }
        ids.push(BigInt(token));
      }
      if (invalidTokens.length > 0) {
        throw new Error(`Invalid dependency ID${invalidTokens.length === 1 ? '' : 's'}: ${invalidTokens.join(', ')}.`);
      }
      const unique = Array.from(new Set(ids));
      unique.sort((left, right) => (left < right ? -1 : left > right ? 1 : 0));
      if (unique.length > 50) {
        throw new Error('Recursive inscriptions can include at most 50 dependency IDs.');
      }
      return unique;
    };

    const getCompactOpusHandoffFilename = (payload, fallbackFilename) => {
      const metadataTitle =
        payload?.metadata && typeof payload.metadata.title === 'string'
          ? payload.metadata.title.trim()
          : '';
      const fallbackStem = String(fallbackFilename || '')
        .replace(/\.[^.]+$/, '')
        .trim();
      const rawStem = metadataTitle || fallbackStem || 'opus-player';
      let stem = rawStem
        .replace(/[^a-z0-9]+/gi, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase();
      if (!stem) {
        stem = 'opus-player';
      }
      if (stem.length > 44) {
        stem = stem.slice(0, 44).replace(/-+$/g, '') || 'opus-player';
      }
      const mode =
        payload?.mode === 'recursive'
          ? 'recursive'
          : payload?.mode === 'embedded'
          ? 'embedded'
          : '';
      const suffix = mode && !stem.endsWith(`-${mode}`) ? `-${mode}` : '';
      return `xtrata-audio-${stem}${suffix}.html`;
    };

    const refreshUploadState = async (expectedHash) => {
      state.uploadState = null;
      const owner = state.walletSession.address;
      if (!owner) {
        return;
      }
      try {
        state.uploadState = await state.client.getUploadState(
          expectedHash,
          owner,
          owner
        );
        if (state.uploadState) {
          appendLog(
            `Existing upload data found: ${state.uploadState.currentIndex.toString()}/${state.uploadState.totalChunks.toString()} chunks already saved. No problem - Resume inscription will continue from here.`,
            'support'
          );
        }
      } catch (error) {
        state.uploadState = null;
      }
    };

    const preparePayload = async () => {
      const file = resolvePayloadFile();
      const bytes = new Uint8Array(await file.arrayBuffer());
      const chunks = chunkBytes(bytes);
      const expectedHash = computeExpectedHash(chunks);
      const tokenUriValue = dom.tokenUriInput.value.trim() || DEFAULT_TOKEN_URI;
      const mimeType = validatePayload(file, bytes, chunks, tokenUriValue);
      const batches = batchChunks(chunks, Math.min(DEFAULT_BATCH_SIZE, MAX_UPLOAD_BATCH_SIZE));
      const expectedHashHex = bytesToHex(expectedHash);
      const dependencyIds = state.handoffDependencyIds ?? [];
      const parentIds = state.parentIds ?? [];

      state.prepared = {
        file,
        bytes,
        chunks,
        batches,
        expectedHash,
        expectedHashHex,
        tokenUriValue,
        mimeType,
        dependencyIds,
        parentIds
      };
      const prepared = state.prepared; // capture: fee writes below target THIS object, even if a concurrent edit nulls state.prepared
      const mintAttempt = {
        contractId: getContractId(state.contract),
        expectedHashHex,
        fileName: file.name,
        mimeType,
        totalBytes: bytes.length,
        totalChunks: chunks.length,
        batchSize: Math.min(DEFAULT_BATCH_SIZE, MAX_UPLOAD_BATCH_SIZE),
        tokenUri: tokenUriValue,
        dependencyIds: dependencyIds.map((id) => id.toString()),
        parentIds: parentIds.map((id) => id.toString()),
        payloadBlob: file.slice(0, file.size, file.type || mimeType),
        updatedAt: Date.now()
      };
      state.lastMintAttempt = mintAttempt;
      void saveMintAttempt(mintAttempt);
      state.duplicateId = null;
      state.uploadState = null;
      dom.allowDuplicateInput.checked = false;
      appendLog(`Prepared ${file.name} (${formatBytes(BigInt(bytes.length))}).`);

      const sender = getReadOnlySenderAddress();
      try {
        const duplicate = await state.client.getIdByHash(expectedHash, sender);
        state.duplicateId = duplicate;
      } catch (error) {
        state.duplicateId = null;
      }

      // If a keystroke or clear replaced/nulled state.prepared during the hash check above,
      // this prepare is stale — stop before touching it (a late quote must never crash).
      if (state.prepared !== prepared) return;

      // Quote the exact fees the core will charge so the user is told the real
      // cost and each transaction's post-condition caps at the right amount.
      // Single-tx: one flat fee. Staged: begin-fee on begin, seal-fee on seal.
      prepared.singleTxFeeMicroStx = null;
      prepared.stagedFee = null;
      const capabilities = resolveContractCapabilities(state.contract);
      if (capabilities.supportsNativeSingleTx === true && chunks.length > 0) {
        if (chunks.length <= SMALL_MINT_HELPER_MAX_CHUNKS) {
          try {
            const quoted = await state.client.quoteSingleTxFee(
              BigInt(bytes.length),
              BigInt(chunks.length),
              sender
            );
            prepared.singleTxFeeMicroStx = Number(quoted);
          } catch (error) {
            prepared.singleTxFeeMicroStx = null;
          }
        }
        try {
          const staged = await state.client.quoteStagedFee(
            BigInt(bytes.length),
            BigInt(chunks.length),
            sender
          );
          prepared.stagedFee = {
            beginMicroStx: Number(staged.beginFee),
            sealMicroStx: Number(staged.sealFee),
            totalMicroStx: Number(staged.totalFee)
          };
        } catch (error) {
          prepared.stagedFee = null;
        }
      }

      await refreshUploadState(expectedHash);
      renderPreparedState();
      void loadUsdPriceBook();
    };

    const fetchAdminStatus = async () => {
      const sender = getReadOnlySenderAddress();
      try {
        state.adminStatus = await fetchContractAdminStatus({
          client: state.client,
          senderAddress: sender
        });
      } catch (error) {
        state.adminStatus = null;
      }
      renderPreparedState();
    };

    const requestContractCall = (options) => {
      const walletAddress = state.walletSession.address;
      const network = state.walletSession.network ?? state.contract.network;
      const contract = options.contract ?? state.contract;
      return new Promise((resolve, reject) => {
        showContractCall({
          contractAddress: contract.address,
          contractName: contract.contractName,
          functionName: options.functionName,
          functionArgs: options.functionArgs,
          network,
          stxAddress: walletAddress,
          postConditionMode: options.postConditions ? PostConditionMode.Deny : undefined,
          postConditions: options.postConditions,
          // Size-based miner fee for payload-bearing calls; omitted lets the
          // wallet estimate (fine for the tiny begin/seal transactions).
          ...(options.feeMicroStx != null ? { fee: options.feeMicroStx } : {}),
          onFinish: (payload) => resolve(payload),
          onCancel: () => reject(new Error('Wallet cancelled or failed to broadcast.'))
        });
      });
    };

    const waitForTransactionConfirmation = async (txId, label) => {
      const normalizedTxId = normalizeTxId({ txId });
      const apiBases = getApiBaseUrls(state.contract.network);
      const startedAt = Date.now();
      const timeoutMs = 45 * 60 * 1000;
      appendLog(
        `${label} submitted. Waiting for on-chain confirmation before continuing.`,
        'waiting'
      );
      while (Date.now() - startedAt < timeoutMs) {
        setStatus(
          dom.walletStatus,
          `<strong>Waiting for confirmation</strong> ${label}`,
          'wait',
          'amber'
        );
        await sleep(8000);
        for (const apiBase of apiBases) {
          try {
            const response = await fetch(
              `${apiBase}/extended/v1/tx/${normalizedTxId}`
            );
            if (!response.ok) {
              continue;
            }
            const payload = await response.json();
            const txStatus = String(payload?.tx_status ?? '').toLowerCase();
            if (!txStatus || txStatus === 'pending') {
              continue;
            }
            if (txStatus !== 'success') {
              throw new Error(`${label} finished with status ${txStatus}.`);
            }
            appendLog(`${label} confirmed on-chain.`, 'confirmed');
            return;
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            if (message.includes('finished with status')) {
              throw error;
            }
          }
        }
      }
      throw new Error(
        `${label} confirmation timed out. The transaction may still confirm. Reload and resume to check the saved on-chain progress.`
      );
    };

    const waitForUploadIndex = async (expectedHash, expectedIndex, label) => {
      const owner = state.walletSession.address;
      if (!owner) {
        throw new Error('Wallet disconnected while checking upload confirmation.');
      }
      for (let attempt = 0; attempt < 20; attempt += 1) {
        const uploadState = await state.client
          .getUploadState(expectedHash, owner, owner)
          .catch(() => null);
        if (uploadState && Number(uploadState.currentIndex) >= expectedIndex) {
          state.uploadState = uploadState;
          renderPreparedState();
          return uploadState;
        }
        await sleep(3000);
      }
      throw new Error(
        `${label} confirmed, but the upload index has not updated yet. Reload and resume; confirmed chunks will not be lost.`
      );
    };

    const validateMintReadiness = async () => {
      if (!state.walletSession.isConnected || !state.walletSession.address) {
        throw new Error('Connect a wallet before inscribing.');
      }
      const mismatch = getMismatch();
      if (mismatch) {
        throw new Error(`Network mismatch: wallet on ${mismatch.actual}, contract is ${mismatch.expected}.`);
      }
      if (!state.prepared) {
        await preparePayload();
      }
      const parentBlocked = getParentBlockingMessage();
      if (parentBlocked) {
        throw new Error(parentBlocked);
      }
      if (state.duplicateId !== null && !dom.allowDuplicateInput.checked) {
        throw new Error('Existing payload must be acknowledged before continuing.');
      }
      const capabilities = resolveContractCapabilities(state.contract);
      if (capabilities.supportsPause) {
        try {
          const paused = state.adminStatus?.paused ?? await state.client.isPaused(state.walletSession.address);
          const admin = state.adminStatus?.admin ?? null;
          if (paused && !addressesEqual(admin, state.walletSession.address)) {
            throw new Error('Contract is paused. Only the contract owner can mint.');
          }
        } catch (error) {
          if (error instanceof Error && error.message.includes('paused')) {
            throw error;
          }
        }
      }
    };

    const checkDependencyPresence = async (dependencyIds) => {
      if (dependencyIds.length === 0) {
        return { ok: true, missing: [], legacyAvailable: [] };
      }
      appendLog('Checking dependency IDs on-chain...');
      const sender = getReadOnlySenderAddress();
      const metaResults = await runReadOnlyLimited(dependencyIds, 4, (id) =>
        state.client.getInscriptionMeta(id, sender)
      );
      const missing = dependencyIds.filter((id, index) => !metaResults[index]);
      if (missing.length === 0) {
        return { ok: true, missing, legacyAvailable: [] };
      }
      let legacyAvailable = [];
      if (state.legacyClient) {
        const legacyResults = await runReadOnlyLimited(missing, 4, (id) =>
          state.legacyClient.getInscriptionMeta(id, sender)
        );
        legacyAvailable = missing.filter((id, index) => !!legacyResults[index]);
      }
      return { ok: false, missing, legacyAvailable };
    };

    const formatDependencyPresenceFailure = (dependencyCheck) => {
      const missingList = dependencyCheck.missing.map((id) => id.toString()).join(', ');
      const legacyList = dependencyCheck.legacyAvailable.map((id) => id.toString()).join(', ');
      const legacyLabel = state.legacyContract?.label ?? 'legacy contract';
      const stillMissing = dependencyCheck.missing.filter(
        (id) => !dependencyCheck.legacyAvailable.includes(id)
      );
      const stillMissingList = stillMissing.map((id) => id.toString()).join(', ');
      if (dependencyCheck.legacyAvailable.length > 0) {
        return stillMissing.length > 0
          ? `Dependency IDs missing in ${state.contract.label}: ${stillMissingList}. IDs found in ${legacyLabel}: ${legacyList}. Migrate legacy dependencies before sealing.`
          : `Dependency IDs found in ${legacyLabel} but not yet migrated: ${legacyList}. Migrate them before sealing.`;
      }
      return `Dependency IDs not found in ${state.contract.label}: ${missingList}.`;
    };

    const checkPreparedRelationships = async (prepared) => {
      const dependencyCheck = await checkDependencyPresence(prepared.dependencyIds ?? []);
      if (!dependencyCheck.ok) {
        throw new Error(formatDependencyPresenceFailure(dependencyCheck));
      }
      const parentIds = prepared.parentIds ?? [];
      if (parentIds.length === 0) {
        return;
      }
      await refreshParentChecks();
      const parentBlocked = getParentBlockingMessage();
      if (parentBlocked) {
        throw new Error(parentBlocked);
      }
    };

    const getSealFunctionName = (dependencyIds, parentIds) => {
      if (parentIds.length > 0) {
        return 'seal-with-relationships';
      }
      return dependencyIds.length > 0 ? 'seal-recursive' : 'seal-inscription';
    };

    const getSealLogLabel = (dependencyIds, parentIds) => {
      if (parentIds.length > 0) {
        const parentLabel = parentIds.map((id) => id.toString()).join(', ');
        const dependencyLabel =
          dependencyIds.length > 0
            ? `, deps: ${dependencyIds.map((id) => id.toString()).join(', ')}`
            : '';
        return `Step 3: seal-with-relationships (parents: ${parentLabel}${dependencyLabel})`;
      }
      return dependencyIds.length > 0
        ? `Step 3: seal-recursive (deps: ${dependencyIds.map((id) => id.toString()).join(', ')})`
        : 'Step 3: seal-inscription';
    };

    const buildSealFunctionArgs = (prepared) => {
      const dependencyIds = prepared.dependencyIds ?? [];
      const parentIds = prepared.parentIds ?? [];
      if (parentIds.length > 0) {
        return [
          bufferCV(prepared.expectedHash),
          stringAsciiCV(prepared.tokenUriValue),
          listCV(dependencyIds.map((id) => uintCV(id))),
          listCV(parentIds.map((id) => uintCV(id)))
        ];
      }
      if (dependencyIds.length > 0) {
        return [
          bufferCV(prepared.expectedHash),
          stringAsciiCV(prepared.tokenUriValue),
          listCV(dependencyIds.map((id) => uintCV(id)))
        ];
      }
      return [bufferCV(prepared.expectedHash), stringAsciiCV(prepared.tokenUriValue)];
    };

    const runInscription = async () => {
      // Not an error — inscribing just needs a connected wallet. Prompt gently (amber) and
      // open the connect flow instead of failing; no busy lock is taken on this path.
      if (!state.walletSession.isConnected || !state.walletSession.address) {
        setStatus(
          dom.walletStatus,
          '<strong>Connect your wallet</strong> to inscribe — it only takes a moment.',
          'connect wallet',
          'amber'
        );
        appendLog('Connect your wallet to inscribe.', 'support');
        try { await connectWallet(); } catch (_) {}
        return;
      }
      setBusy(true);
      resetSteps();
      let flowStarted = false;
      try {
        await validateMintReadiness();
        const prepared = state.prepared;
        const dependencyIds = prepared.dependencyIds ?? [];
        const parentIds = prepared.parentIds ?? [];
        await checkPreparedRelationships(prepared);
        await refreshUploadState(prepared.expectedHash);
        flowStarted = true;
        const feeEstimate = getFeeEstimate(prepared.chunks.length);
        const hasUploadState = !!state.uploadState;

        if (shouldUseNativeSingleTx()) {
          // v3+ native one-transaction mint directly on the core.
          setStep('begin', 'pending', 'Wallet prompt');
          setStep('upload', 'pending', 'Single tx');
          setStep('seal', 'pending', 'Single tx');
          appendLog(
            `Native single-tx mint on ${getContractId(state.contract)} (<=${SMALL_MINT_HELPER_MAX_CHUNKS} chunks)${
              parentIds.length > 0
                ? ` with ${parentIds.length} parent${parentIds.length === 1 ? '' : 's'}`
                : dependencyIds.length > 0 ? ` with ${dependencyIds.length} recursive dependency${dependencyIds.length === 1 ? '' : 'ies'}` : ''
            }.`
          );
          const coreArgs = [
            bufferCV(prepared.expectedHash),
            stringAsciiCV(prepared.mimeType),
            uintCV(BigInt(prepared.bytes.length)),
            listCV(prepared.chunks.map((chunk) => bufferCV(chunk))),
            stringAsciiCV(prepared.tokenUriValue)
          ];
          // Cap at the quoted single-tx fee when known; fall back to the 3-stage
          // estimate (always >= the single-tx fee) if the quote is unavailable.
          const singleTxCapMicroStx =
            typeof prepared.singleTxFeeMicroStx === 'number'
              ? prepared.singleTxFeeMicroStx
              : feeEstimate.totalMicroStx;
          const singleTx = await requestContractCall({
            functionName:
              parentIds.length > 0
                ? 'mint-single-tx-with-relationships'
                : dependencyIds.length > 0 ? 'mint-single-tx-recursive' : 'mint-single-tx',
            functionArgs:
              parentIds.length > 0
                ? [
                    ...coreArgs,
                    listCV(dependencyIds.map((id) => uintCV(id))),
                    listCV(parentIds.map((id) => uintCV(id)))
                  ]
                : dependencyIds.length > 0
                ? [...coreArgs, listCV(dependencyIds.map((id) => uintCV(id)))]
                : coreArgs,
            postConditions: resolveFeePostConditions(singleTxCapMicroStx),
            feeMicroStx: walletMinerFeeMicroStx(prepared.bytes.length)
          });
          const singleTxId = normalizeTxId(singleTx);
          state.lastSubmittedTxId = singleTxId;
          appendLog(`Single-tx mint sent: ${singleTxId}`, 'action');
          setStep('begin', 'pending', 'Confirming');
          setStep('upload', 'pending', 'Confirming');
          setStep('seal', 'pending', 'Confirming');
          await waitForTransactionConfirmation(singleTxId, 'Single-transaction mint');
          setStep('begin', 'done', 'Confirmed');
          setStep('upload', 'done', 'Confirmed');
          setStep('seal', 'done', 'Confirmed');
          state.lastMintAttempt = null;
          void clearMintAttempt(getContractId(state.contract));
          setStatus(
            dom.walletStatus,
            `<strong>Confirmed</strong> ${truncateMiddle(singleTxId, 8, 8)}`,
            'ready',
            'green'
          );
          await loadWalletInscriptions();
          return;
        }

        if (shouldUseSmallMintHelper()) {
          const smallMintHelperContract = getSmallMintHelperContract();
          if (!smallMintHelperContract) {
            throw new Error('Small mint helper deployment is unavailable for this network.');
          }
          setStep('begin', 'pending', 'Wallet prompt');
          setStep('upload', 'pending', 'Single tx');
          setStep('seal', 'pending', 'Single tx');
          appendLog(
            `Small-file helper route active (<=${SMALL_MINT_HELPER_MAX_CHUNKS} chunks)${
              dependencyIds.length > 0 ? ` with ${dependencyIds.length} recursive dependency${dependencyIds.length === 1 ? '' : 'ies'}` : ''
            }.`
          );
          const singleTx = await requestContractCall({
            contract: smallMintHelperContract,
            functionName:
              dependencyIds.length > 0
                ? 'mint-small-single-tx-recursive'
                : 'mint-small-single-tx',
            functionArgs:
              dependencyIds.length > 0
                ? [
                    principalCV(getContractId(state.contract)),
                    bufferCV(prepared.expectedHash),
                    stringAsciiCV(prepared.mimeType),
                    uintCV(BigInt(prepared.bytes.length)),
                    listCV(prepared.chunks.map((chunk) => bufferCV(chunk))),
                    stringAsciiCV(prepared.tokenUriValue),
                    listCV(dependencyIds.map((id) => uintCV(id)))
                  ]
                : [
                    principalCV(getContractId(state.contract)),
                    bufferCV(prepared.expectedHash),
                    stringAsciiCV(prepared.mimeType),
                    uintCV(BigInt(prepared.bytes.length)),
                    listCV(prepared.chunks.map((chunk) => bufferCV(chunk))),
                    stringAsciiCV(prepared.tokenUriValue)
                  ],
            postConditions: resolveFeePostConditions(feeEstimate.totalMicroStx),
            feeMicroStx: walletMinerFeeMicroStx(prepared.bytes.length)
          });
          const singleTxId = normalizeTxId(singleTx);
          state.lastSubmittedTxId = singleTxId;
          appendLog(`Single-tx mint sent: ${singleTxId}`, 'action');
          setStep('begin', 'pending', 'Confirming');
          setStep('upload', 'pending', 'Confirming');
          setStep('seal', 'pending', 'Confirming');
          await waitForTransactionConfirmation(singleTxId, 'Single-transaction mint');
          setStep('begin', 'done', 'Confirmed');
          setStep('upload', 'done', 'Confirmed');
          setStep('seal', 'done', 'Confirmed');
          state.lastMintAttempt = null;
          void clearMintAttempt(getContractId(state.contract));
          setStatus(
            dom.walletStatus,
            `<strong>Confirmed</strong> ${truncateMiddle(singleTxId, 8, 8)}`,
            'ready',
            'green'
          );
          await loadWalletInscriptions();
          return;
        }

        if (!hasUploadState) {
          setStep('begin', 'pending', 'Wallet prompt');
          appendLog('Step 1: begin-inscription');
          const beginTx = await requestContractCall({
            functionName: 'begin-inscription',
            functionArgs: [
              bufferCV(prepared.expectedHash),
              stringAsciiCV(prepared.mimeType),
              uintCV(BigInt(prepared.bytes.length)),
              uintCV(BigInt(prepared.chunks.length))
            ],
            postConditions: resolveFeePostConditions(
              prepared.stagedFee?.beginMicroStx ?? feeEstimate.beginMicroStx
            )
          });
          const beginTxId = normalizeTxId(beginTx);
          appendLog(`Begin transaction sent: ${beginTxId}`, 'action');
          setStep('begin', 'pending', 'Confirming');
          await waitForTransactionConfirmation(beginTxId, 'Begin transaction');
          await refreshUploadState(prepared.expectedHash);
          if (!state.uploadState) {
            throw new Error(
              'Begin confirmed, but the upload session is not visible yet. Reload and resume in a moment.'
            );
          }
          setStep('begin', 'done', 'Confirmed');
        } else {
          setStep('begin', 'done', 'Already started');
          appendLog(
            `Existing upload data found: ${state.uploadState.currentIndex.toString()}/${state.uploadState.totalChunks.toString()} chunks already saved. Resuming inscription.`,
            'support'
          );
        }

        const currentIndex = state.uploadState
          ? Number(state.uploadState.currentIndex)
          : 0;
        if (!Number.isSafeInteger(currentIndex) || currentIndex < 0) {
          throw new Error('Upload state is too large to resume safely.');
        }
        if (currentIndex > prepared.chunks.length) {
          throw new Error('On-chain upload state is ahead of this payload.');
        }

        const uploadBatchSize = Math.min(DEFAULT_BATCH_SIZE, MAX_UPLOAD_BATCH_SIZE);
        const totalBatches = Math.ceil(prepared.chunks.length / uploadBatchSize);
        const confirmedBatches =
          currentIndex <= 0 ? 0 : Math.ceil(currentIndex / uploadBatchSize);
        const remainingChunks = prepared.chunks.slice(currentIndex);
        const remainingBatches = batchChunks(
          remainingChunks,
          uploadBatchSize
        );

        if (remainingBatches.length > 0) {
          setStep(
            'upload',
            'pending',
            `${confirmedBatches}/${totalBatches} confirmed`
          );
          for (let index = 0; index < remainingBatches.length; index += 1) {
            const batch = remainingBatches[index];
            const absoluteBatchNumber = confirmedBatches + index + 1;
            const expectedIndex = currentIndex +
              remainingBatches
                .slice(0, index + 1)
                .reduce((sum, entry) => sum + entry.length, 0);
            appendLog(
              `Wallet action required: upload batch ${absoluteBatchNumber} of ${totalBatches}.`,
              'action'
            );
            const batchBytes = batch.reduce((sum, chunk) => sum + chunk.length, 0);
            const uploadTx = await requestContractCall({
              functionName: 'add-chunk-batch',
              functionArgs: [
                bufferCV(prepared.expectedHash),
                listCV(batch.map((chunk) => bufferCV(chunk)))
              ],
              feeMicroStx: walletMinerFeeMicroStx(batchBytes)
            });
            const uploadTxId = normalizeTxId(uploadTx);
            appendLog(
              `Batch ${absoluteBatchNumber}/${totalBatches} sent: ${uploadTxId}`,
              'action'
            );
            setStep(
              'upload',
              'pending',
              `Confirming ${absoluteBatchNumber}/${totalBatches}`
            );
            await waitForTransactionConfirmation(
              uploadTxId,
              `Upload batch ${absoluteBatchNumber}/${totalBatches}`
            );
            await waitForUploadIndex(
              prepared.expectedHash,
              expectedIndex,
              `Upload batch ${absoluteBatchNumber}/${totalBatches}`
            );
            setStep(
              'upload',
              'pending',
              `${absoluteBatchNumber}/${totalBatches} confirmed`
            );
          }
          setStep('upload', 'done', `${totalBatches}/${totalBatches} confirmed`);
        } else {
          setStep('upload', 'done', 'Already uploaded');
        }

        setStep('seal', 'pending', 'Wallet prompt');
        appendLog(
          getSealLogLabel(dependencyIds, parentIds)
        );
        const sealFunctionName = getSealFunctionName(dependencyIds, parentIds);
        const sealTx = await requestContractCall({
          functionName: sealFunctionName,
          functionArgs: buildSealFunctionArgs(prepared),
          postConditions: resolveFeePostConditions(
            prepared.stagedFee?.sealMicroStx ?? feeEstimate.sealMicroStx
          )
        });
        const sealTxId = normalizeTxId(sealTx);
        state.lastSubmittedTxId = sealTxId;
        appendLog(`Seal transaction sent: ${sealTxId}`, 'action');
        setStep('seal', 'pending', 'Confirming');
        await waitForTransactionConfirmation(sealTxId, 'Seal transaction');
        setStep('seal', 'done', 'Confirmed');
        state.lastMintAttempt = null;
        void clearMintAttempt(getContractId(state.contract));
        setStatus(
          dom.walletStatus,
          `<strong>Confirmed</strong> ${truncateMiddle(sealTxId, 8, 8)}`,
          'ready',
          'green'
        );
        await loadWalletInscriptions();
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        appendLog(`Mint failed: ${message}`);
        if (flowStarted && state.prepared?.expectedHash) {
          await refreshUploadState(state.prepared.expectedHash);
        }
        if (flowStarted) {
          if (state.uploadState) {
            appendLog(
              'No problem - existing upload data was found. Click Resume inscription to continue from the saved chunks.',
              'support'
            );
          } else {
            appendLog(
              'No problem - restart the inscription when ready. Re-select the same file and the app will reuse any existing upload data it finds.',
              'support'
            );
          }
        }
        setStatus(
          dom.walletStatus,
          flowStarted
            ? `<strong>Mint stopped</strong> ${message}. No problem - restart when ready.`
            : `<strong>Mint blocked</strong> ${message}`,
          'error',
          'rose'
        );
        const pendingStep = [dom.stepSeal, dom.stepUpload, dom.stepBegin].find((step) =>
          step.classList.contains('pending')
        );
        if (pendingStep) {
          pendingStep.classList.remove('pending');
          pendingStep.classList.add('error');
          pendingStep.querySelector('span').textContent = 'Error';
        }
        renderPreparedState();
      } finally {
        setBusy(false);
        updateControls();
      }
    };

    const renderTokenGridPlaceholders = (label = '') => {
      dom.tokenGrid.innerHTML = '';
      for (let index = 0; index < 16; index += 1) {
        const card = document.createElement('button');
        card.type = 'button';
        card.disabled = true;
        card.className = 'token-card empty';
        const thumb = document.createElement('div');
        thumb.className = 'token-thumb';
        thumb.textContent = label;
        const meta = document.createElement('div');
        meta.className = 'token-meta';
        meta.innerHTML = '<span>empty</span>';
        card.append(thumb, meta);
        dom.tokenGrid.append(card);
      }
      updateTransferControls();
    };

    const getTokenClient = (token) => {
      const galleryClient = getActiveGalleryReadClient();
      if (galleryClient) {
        return galleryClient;
      }
      const legacyId = state.legacyClient ? getContractId(state.legacyClient.contract) : null;
      return legacyId && token.sourceContractId === legacyId
        ? state.legacyClient
        : state.client;
    };

    const getTokenCacheContractId = (token) =>
      token.sourceContractId ?? getContractId(getTokenClient(token).contract);

    const getThumbnailKey = (token) =>
      `${getTokenCacheContractId(token)}:${token.id.toString()}`;

    const formatDebugTokenIds = (ids) =>
      ids.map((id) => id.toString());

    const formatDebugOptions = (options = {}) =>
      Object.fromEntries(
        Object.entries(options).map(([key, value]) => [
          key,
          typeof value === 'bigint' ? value.toString() : value
        ])
      );

    const getGridModeLabel = () => {
      if (state.curatedGalleryId) {
        return 'curated-gallery';
      }
      if (state.explorerMode) {
        return 'explorer';
      }
      if (getViewingWalletAddress()) {
        return 'wallet';
      }
      return 'empty';
    };

    const getGridCacheStats = (pageIds = getWalletPageIds()) => {
      let summaryHits = 0;
      let thumbnailMemoryHits = 0;
      let liveMediaHits = 0;
      let inlineSvgHits = 0;

      for (const id of pageIds) {
        const token = state.walletTokenCache.get(id.toString()) ?? null;
        if (!token) {
          continue;
        }
        summaryHits += 1;
        if (token.svgDataUri) {
          inlineSvgHits += 1;
          continue;
        }
        const cacheKey = getThumbnailKey(token);
        if (state.thumbnailCache.has(cacheKey)) {
          thumbnailMemoryHits += 1;
        }
        if (state.gridLiveMediaCache.has(cacheKey)) {
          liveMediaHits += 1;
        }
      }

      return {
        summaryHits,
        summaryMisses: Math.max(0, pageIds.length - summaryHits),
        thumbnailMemoryHits,
        liveMediaHits,
        inlineSvgHits,
        summaryCacheSize: state.walletTokenCache.size,
        thumbnailMemoryCacheSize: state.thumbnailCache.size,
        liveMediaCacheSize: state.gridLiveMediaCache.size,
        thumbObjectUrlCount: state.tokenThumbUrls.size
      };
    };

    const getGridDebugContext = (pageIds = getWalletPageIds()) => {
      const pageCount = getWalletPageCount();
      const totalCount = state.walletUsesPagedHoldings
        ? state.walletTotalCount
        : state.walletTokenIds.length;
      return {
        mode: getGridModeLabel(),
        contractId: getContractId(state.contract),
        galleryId: state.curatedGalleryId,
        galleryTitle: state.curatedGalleryTitle,
        wallet: getViewingWalletAddress()
          ? truncateMiddle(getViewingWalletAddress(), 8, 8)
          : null,
        pageIndex: state.walletPageIndex,
        page: pageCount > 0 ? state.walletPageIndex + 1 : 0,
        pageCount,
        pageSize: WALLET_PAGE_SIZE,
        totalCount,
        usesPagedHoldings: state.walletUsesPagedHoldings,
        selectedTokenId: state.selectedTokenId?.toString() ?? null,
        pageIds: formatDebugTokenIds(pageIds),
        filters: state.explorerMode ? getExplorerFilterLabel() : null,
        filterIndexComplete: state.explorerMode
          ? state.explorerFilterIndexComplete
          : null,
        cache: getGridCacheStats(pageIds),
        hydration: {
          runId: state.thumbnailHydrationRunId,
          queued: state.thumbnailHydrationQueue.length,
          inFlight: state.thumbnailHydrationInFlight.size,
          attempted: state.thumbnailHydrationAttempted.size
        }
      };
    };

    const getTokenRuntimeContentUrl = (token) =>
      buildRuntimeInscriptionContentUrl({
        coreContractId: getTokenCacheContractId(token),
        tokenId: token.id
      });

    const prepareRuntimeHtmlForToken = async (token, html, contextLabel = 'preview') => {
      if (!html) {
        return html;
      }
      const moduleBaseHref = buildRuntimeModuleBaseHref({
        network: state.network,
        contractId: getTokenCacheContractId(token),
        tokenUriPath: token.tokenUri,
        entryTokenId: token.id
      });
      const htmlWithBase = injectHtmlBaseHref(html, moduleBaseHref);
      if (!hasRuntimeContentUrls(htmlWithBase)) {
        return htmlWithBase;
      }
      const contentClient = getTokenClient(token);
      try {
        debugLog('preview', 'inlining runtime content for HTML inscription', {
          tokenId: token.id.toString(),
          contractId: getTokenCacheContractId(token),
          context: contextLabel
        });
        return await inlineRuntimeContentUrls({
          html: htmlWithBase,
          client: contentClient,
          fallbackClients: getContentFallbackClients(contentClient)
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        debugLog(
          'preview',
          'runtime content inline failed; using raw HTML',
          {
            tokenId: token.id.toString(),
            contractId: getTokenCacheContractId(token),
            context: contextLabel,
            error: message
          },
          'warn'
        );
        appendLog(`Runtime preview fallback for ${formatTokenId(token.id)}: ${message}`);
        return htmlWithBase;
      }
    };

    const getFullscreenPagePosition = () => {
      const pageIds = getWalletPageIds();
      const selectedId = state.selectedTokenId;
      const index = selectedId === null
        ? -1
        : pageIds.findIndex((id) => id === selectedId);
      return { pageIds, index };
    };

    const updateFullscreenControls = () => {
      const selectedToken = getSelectedToken();
      const pageCount = getWalletPageCount();
      const { pageIds, index } = getFullscreenPagePosition();
      const isTokenFullscreen = state.fullscreenSource !== 'prepared';
      const hasSelectedPagePosition = isTokenFullscreen && !!selectedToken && index >= 0;
      const canGoPrevious =
        hasSelectedPagePosition && (index > 0 || state.walletPageIndex > 0);
      const canGoNext =
        hasSelectedPagePosition &&
        (index < pageIds.length - 1 || state.walletPageIndex < pageCount - 1);
      if (dom.fullscreenButton) {
        dom.fullscreenButton.disabled = state.busy || !selectedToken;
      }
      dom.previewExpandButton.disabled = state.busy || !selectedToken;
      dom.previewExpandButton.hidden = !selectedToken;
      dom.fullscreenPrevButton.disabled =
        state.busy || state.walletLoadingPage || !canGoPrevious;
      dom.fullscreenNextButton.disabled =
        state.busy || state.walletLoadingPage || !canGoNext;
    };

    const setFullscreenNotice = (message) => {
      const notice = document.createElement('div');
      notice.className = 'fullscreen-viewer__notice';
      notice.textContent = message;
      dom.fullscreenStage.replaceChildren(notice);
    };

    const setFullscreenMeta = (token, mimeType) => {
      const kind = getMediaKind(mimeType ?? null).toUpperCase();
      const size = token.meta?.totalSize ? formatBytes(token.meta.totalSize) : 'unknown size';
      dom.fullscreenTitle.textContent = 'Inscription';
      dom.fullscreenMeta.textContent = `${kind} · ${size}`;
    };

    const getSelectedTokenPreviewSource = async () => {
      const token = getSelectedToken();
      if (!token) {
        throw new Error('Select an inscription first.');
      }
      const tokenId = token.id.toString();
      if (
        state.tokenPreviewTokenId === tokenId &&
        (state.tokenPreviewBytes || state.tokenPreviewSourceUrl)
      ) {
        return {
          token,
          bytes: state.tokenPreviewBytes,
          mimeType: state.tokenPreviewMimeType ?? token.meta?.mimeType ?? null,
          sourceUrl: state.tokenPreviewSourceUrl,
          htmlDoc: state.tokenPreviewHtmlDoc
        };
      }
      if (!token.meta || token.meta.totalSize <= 0n) {
        if (!token.svgDataUri) {
          throw new Error('This inscription has no on-chain content to preview.');
        }
        state.tokenPreviewTokenId = tokenId;
        state.tokenPreviewBytes = null;
        state.tokenPreviewMimeType = 'image/svg+xml';
        state.tokenPreviewSourceUrl = token.svgDataUri;
        state.tokenPreviewHtmlDoc = null;
        return {
          token,
          bytes: null,
          mimeType: 'image/svg+xml',
          sourceUrl: token.svgDataUri,
          htmlDoc: null
        };
      }
      const runtimeImageUrl = getTokenRuntimeImageUrl(token);
      if (runtimeImageUrl) {
        const mimeType = token.meta.mimeType ?? 'application/octet-stream';
        state.tokenPreviewTokenId = tokenId;
        state.tokenPreviewBytes = null;
        state.tokenPreviewMimeType = mimeType;
        state.tokenPreviewSourceUrl = runtimeImageUrl;
        state.tokenPreviewHtmlDoc = null;
        return {
          token,
          bytes: null,
          mimeType,
          sourceUrl: runtimeImageUrl,
          htmlDoc: null
        };
      }
      const contentClient = getTokenClient(token);
      const bytes = await fetchOnChainContent({
        client: contentClient,
        fallbackClients: getContentFallbackClients(contentClient),
        cacheContractId: token.sourceContractId ?? getContractId(contentClient.contract),
        id: token.id,
        senderAddress: getReadOnlySenderAddress(),
        totalSize: token.meta.totalSize,
        mimeType: token.meta.mimeType ?? null
      });
      const mimeType = resolveMimeType(token.meta.mimeType ?? null, bytes) ?? token.meta.mimeType ?? 'application/octet-stream';
      const htmlDoc = getMediaKind(mimeType) === 'html'
        ? await prepareRuntimeHtmlForToken(token, new TextDecoder().decode(bytes), 'fullscreen')
        : null;
      state.tokenPreviewTokenId = tokenId;
      state.tokenPreviewBytes = bytes;
      state.tokenPreviewMimeType = mimeType;
      state.tokenPreviewSourceUrl = null;
      state.tokenPreviewHtmlDoc = htmlDoc;
      return { token, bytes, mimeType, sourceUrl: null, htmlDoc };
    };

    const configureFullscreenRawLink = (token) => {
      dom.fullscreenRawLink.href = inscriptionEndpointUrl(token.id);
      dom.fullscreenRawLink.textContent = 'Open endpoint';
      dom.fullscreenRawLink.setAttribute(
        'aria-label',
        `Open inscription ${token.id.toString()} endpoint in a new tab`
      );
      dom.fullscreenRawLink.removeAttribute('download');
      dom.fullscreenRawLink.hidden = false;
    };

    const renderFullscreenContent = ({ token, bytes, mimeType, sourceUrl, htmlDoc }) => {
      revokeFullscreenPreview();
      setFullscreenMeta(token, mimeType);
      dom.fullscreenRawLink.hidden = true;
      dom.fullscreenRawLink.removeAttribute('href');
      dom.fullscreenRawLink.removeAttribute('download');
      dom.fullscreenRawLink.removeAttribute('aria-label');

      if (sourceUrl) {
        const kind = getMediaKind(mimeType ?? null);
        configureFullscreenRawLink(token);
        renderSquareImagePreview(dom.fullscreenStage, sourceUrl, {
          mimeType,
          isSvgSource: kind === 'svg',
          alt: 'Inscription preview',
          preserveAnimation:
            kind === 'image' && isPotentialAnimatedRasterMimeType(mimeType),
          replayDelayMs: null
        });
        return;
      }

      if (!bytes || bytes.length === 0) {
        setFullscreenNotice('No content is available for this inscription.');
        return;
      }

      const fullscreenMimeType =
        resolveMimeType(mimeType ?? null, bytes) ??
        mimeType ??
        null;
      const kind = getMediaKind(fullscreenMimeType);
      const blob = new Blob([bytes], {
        type: fullscreenMimeType || 'application/octet-stream'
      });
      const url = URL.createObjectURL(blob);
      state.fullscreenUrl = url;
      configureFullscreenRawLink(token);

      if (kind === 'image' || kind === 'svg') {
        renderSquareImagePreview(dom.fullscreenStage, url, {
          mimeType: fullscreenMimeType,
          isSvgSource: kind === 'svg',
          alt: 'Inscription preview',
          preserveAnimation:
            kind === 'image' && isAnimatedImagePayload(bytes, fullscreenMimeType),
          replayDelayMs:
            kind === 'image'
              ? getFiniteAnimatedImageReplayDelayMs(bytes, fullscreenMimeType)
              : null
        });
        return;
      }

      dom.fullscreenStage.replaceChildren();

      if (kind === 'video') {
        const video = document.createElement('video');
        video.controls = true;
        video.autoplay = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = 'auto';
        video.src = url;
        dom.fullscreenStage.append(video);
        playPreviewVideoWhenReady(video);
        return;
      }

      if (kind === 'audio') {
        const audio = document.createElement('audio');
        audio.controls = true;
        audio.src = url;
        dom.fullscreenStage.append(audio);
        return;
      }

      if (kind === 'html') {
        const frame = document.createElement('iframe');
        frame.title = 'inscription-preview';
        frame.referrerPolicy = 'no-referrer';
        frame.loading = 'lazy';
        frame.sandbox = mimeType?.trim().toLowerCase() === 'application/pdf'
          ? ''
          : 'allow-scripts';
        if (htmlDoc && mimeType?.trim().toLowerCase() !== 'application/pdf') {
          frame.srcdoc = htmlDoc;
        } else {
          frame.src = url;
        }
        dom.fullscreenStage.append(frame);
        return;
      }

      if (kind === 'text') {
        const pre = document.createElement('pre');
        pre.textContent = new TextDecoder().decode(bytes);
        dom.fullscreenStage.append(pre);
        return;
      }

      const link = document.createElement('a');
      link.className = 'btn ghost';
      link.href = inscriptionEndpointUrl(token.id);
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.textContent = 'Open inscription endpoint';
      dom.fullscreenStage.append(link);
    };

    const renderFullscreenSelectedToken = async () => {
      setFullscreenNotice('Loading inscription...');
      try {
        const source = await getSelectedTokenPreviewSource();
        renderFullscreenContent(source);
        updateFullscreenControls();
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setFullscreenNotice(message);
        appendLog(`Fullscreen preview failed: ${message}`);
      }
    };

    const renderFullscreenPreparedPayload = () => {
      revokeFullscreenPreview();
      const prepared = state.prepared;
      dom.fullscreenRawLink.hidden = true;
      dom.fullscreenRawLink.removeAttribute('href');
      dom.fullscreenRawLink.removeAttribute('download');
      dom.fullscreenRawLink.removeAttribute('aria-label');

      if (!prepared || !prepared.bytes || prepared.bytes.length === 0) {
        dom.fullscreenTitle.textContent = 'Prepared payload';
        dom.fullscreenMeta.textContent = 'No payload prepared';
        setFullscreenNotice('Prepare a payload first.');
        return;
      }

      const fullscreenMimeType =
        resolveMimeType(prepared.mimeType ?? null, prepared.bytes) ??
        prepared.mimeType ??
        'application/octet-stream';
      const kind = getMediaKind(fullscreenMimeType);
      const blob = new Blob([prepared.bytes], { type: fullscreenMimeType });
      const url = URL.createObjectURL(blob);
      state.fullscreenUrl = url;
      dom.fullscreenTitle.textContent = 'Prepared payload';
      dom.fullscreenMeta.textContent =
        `${kind.toUpperCase()} · ${formatBytes(BigInt(prepared.bytes.length))} · ${prepared.file.name}`;
      dom.fullscreenRawLink.href = url;
      dom.fullscreenRawLink.textContent = 'Open payload';
      dom.fullscreenRawLink.download = prepared.file.name;
      dom.fullscreenRawLink.setAttribute('aria-label', 'Open prepared payload in a new tab');
      dom.fullscreenRawLink.hidden = false;

      if (kind === 'image' || kind === 'svg') {
        renderSquareImagePreview(dom.fullscreenStage, url, {
          mimeType: fullscreenMimeType,
          isSvgSource: kind === 'svg',
          alt: 'Prepared payload preview',
          preserveAnimation:
            kind === 'image' && isAnimatedImagePayload(prepared.bytes, fullscreenMimeType),
          replayDelayMs:
            kind === 'image'
              ? getFiniteAnimatedImageReplayDelayMs(prepared.bytes, fullscreenMimeType)
              : null
        });
        return;
      }

      dom.fullscreenStage.replaceChildren();

      if (kind === 'video') {
        const video = document.createElement('video');
        video.controls = true;
        video.autoplay = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = 'auto';
        video.src = url;
        dom.fullscreenStage.append(video);
        playPreviewVideoWhenReady(video);
        return;
      }

      if (kind === 'audio') {
        const audio = document.createElement('audio');
        audio.controls = true;
        audio.src = url;
        dom.fullscreenStage.append(audio);
        return;
      }

      if (kind === 'html') {
        const frame = document.createElement('iframe');
        frame.title = 'prepared-inscription-preview';
        frame.referrerPolicy = 'no-referrer';
        frame.loading = 'lazy';
        frame.sandbox = 'allow-scripts';
        frame.src = url;
        dom.fullscreenStage.append(frame);
        return;
      }

      if (kind === 'text') {
        const pre = document.createElement('pre');
        pre.textContent = new TextDecoder().decode(prepared.bytes);
        dom.fullscreenStage.append(pre);
        return;
      }

      const link = document.createElement('a');
      link.className = 'btn ghost';
      link.href = url;
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.download = prepared.file.name;
      link.textContent = 'Open prepared payload';
      dom.fullscreenStage.append(link);
    };

    const openFullscreenViewer = async () => {
      const token = getSelectedToken();
      if (!token) {
        return;
      }
      state.fullscreenSource = 'token';
      state.fullscreenOpen = true;
      dom.fullscreenViewer.hidden = false;
      dom.fullscreenViewer.setAttribute('aria-hidden', 'false');
      document.body.classList.add('fullscreen-viewer-open');
      updateFullscreenControls();
      await renderFullscreenSelectedToken();
      dom.fullscreenCloseButton.focus({ preventScroll: true });
    };

    const openPreparedPayloadFullscreen = () => {
      if (!state.prepared) {
        return;
      }
      state.fullscreenSource = 'prepared';
      state.fullscreenOpen = true;
      dom.fullscreenViewer.hidden = false;
      dom.fullscreenViewer.setAttribute('aria-hidden', 'false');
      document.body.classList.add('fullscreen-viewer-open');
      updateFullscreenControls();
      renderFullscreenPreparedPayload();
      dom.fullscreenCloseButton.focus({ preventScroll: true });
    };

    const closeFullscreenViewer = async () => {
      if (!state.fullscreenOpen) {
        updateFullscreenControls();
        return;
      }
      state.fullscreenOpen = false;
      state.fullscreenSource = null;
      dom.fullscreenViewer.hidden = true;
      dom.fullscreenViewer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('fullscreen-viewer-open');
      revokeFullscreenPreview();
      dom.fullscreenStage.textContent = 'No selection';
      updateFullscreenControls();
    };

    const navigateFullscreenSelection = async (direction) => {
      if (state.busy || state.walletLoadingPage || state.fullscreenSource === 'prepared') {
        return;
      }
      const { pageIds, index } = getFullscreenPagePosition();
      debugLog('grid', 'fullscreen selection navigation requested', {
        direction,
        selectedTokenId: state.selectedTokenId?.toString() ?? null,
        selectedPageIndex: index,
        ...getGridDebugContext(pageIds)
      });
      const nextId = pageIds[index + direction];
      if (nextId !== undefined) {
        await selectToken(nextId);
        if (state.fullscreenOpen) {
          await renderFullscreenSelectedToken();
        }
        return;
      }

      const pageCount = getWalletPageCount();
      const targetPageIndex = state.walletPageIndex + direction;
      if (index < 0 || targetPageIndex < 0 || targetPageIndex >= pageCount) {
        return;
      }

      const previousPageIndex = state.walletPageIndex;
      try {
        if (state.fullscreenOpen) {
          setFullscreenNotice(direction > 0 ? 'Loading next page...' : 'Loading previous page...');
        }
        state.walletPageIndex = targetPageIndex;
        await loadWalletPage({ deferSelection: true });
        const targetPageIds = getWalletPageIds();
        const targetId =
          direction > 0
            ? targetPageIds[0]
            : targetPageIds[targetPageIds.length - 1];
        if (targetId === undefined) {
          updateFullscreenControls();
          return;
        }
        await selectToken(targetId);
        if (state.fullscreenOpen) {
          await renderFullscreenSelectedToken();
        }
      } catch (error) {
        state.walletPageIndex = previousPageIndex;
        const message = error instanceof Error ? error.message : String(error);
        appendLog(`Large viewer page navigation failed: ${message}`);
        if (state.fullscreenOpen) {
          setFullscreenNotice('Unable to load that page.');
        }
        updateWalletPagerControls();
        updateFullscreenControls();
      }
    };

    const focusWalletTokenById = async (targetTokenId) => {
      const targetId =
        typeof targetTokenId === 'bigint'
          ? targetTokenId
          : BigInt(targetTokenId);
      debugLog('grid', 'focus token requested', {
        targetTokenId: targetId.toString(),
        mode: getGridModeLabel(),
        currentPageIndex: state.walletPageIndex,
        pageCount: getWalletPageCount(),
        pageIds: formatDebugTokenIds(getWalletPageIds()),
        usesPagedHoldings: state.walletUsesPagedHoldings
      });
      if (state.explorerMode) {
        if (!state.explorerLatestTokenId) {
          await refreshExplorerLatestTokenId();
        }
        const pageIndex = getExplorerTokenPageIndex(targetId);
        if (pageIndex === null) {
          debugLog('grid', 'focus token unavailable in explorer range', {
            targetTokenId: targetId.toString(),
            latestTokenId: state.explorerLatestTokenId?.toString() ?? null,
            filters: getExplorerFilterLabel()
          }, 'warn');
          return false;
        }
        debugLog('grid', 'focus token loading explorer page', {
          targetTokenId: targetId.toString(),
          targetPageIndex: pageIndex
        });
        state.walletPageIndex = pageIndex;
        await loadExplorerPage({ selectTokenId: targetId, scrollToPreview: true });
        return state.selectedTokenId === targetId;
      }
      const currentPageContainsTarget = getWalletPageIds().includes(targetId);
      if (currentPageContainsTarget) {
        debugLog('grid', 'focus token found on current page', {
          targetTokenId: targetId.toString(),
          pageIndex: state.walletPageIndex
        });
        debugLog('grid', 'focus token hydrating current page', {
          targetTokenId: targetId.toString(),
          pageIndex: state.walletPageIndex
        });
        renderTokenGrid();
        await selectToken(targetId);
        return true;
      }

      const originalPageIndex = state.walletPageIndex;

      if (state.walletUsesPagedHoldings) {
        const pageCount = getWalletPageCount();
        for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
          if (pageIndex === state.walletPageIndex) {
            continue;
          }
          debugLog('grid', 'focus token scanning holdings page', {
            targetTokenId: targetId.toString(),
            fromPageIndex: state.walletPageIndex,
            targetPageIndex: pageIndex,
            pageCount
          });
          state.walletPageIndex = pageIndex;
          await loadWalletPage({ deferSelection: true, deferHydration: true });
          if (getWalletPageIds().includes(targetId)) {
            debugLog('grid', 'focus token found after page scan', {
              targetTokenId: targetId.toString(),
              pageIndex,
              pageIds: formatDebugTokenIds(getWalletPageIds())
            });
            debugLog('grid', 'focus token hydrating scanned page', {
              targetTokenId: targetId.toString(),
              pageIndex
            });
            renderTokenGrid();
            await selectToken(targetId);
            return true;
          }
        }
      } else {
        const index = state.walletTokenIds.findIndex((id) => id === targetId);
        if (index >= 0) {
          const targetPageIndex = Math.floor(index / WALLET_PAGE_SIZE);
          debugLog('grid', 'focus token found in local holdings index', {
            targetTokenId: targetId.toString(),
            tokenIndex: index,
            targetPageIndex
          });
          if (targetPageIndex !== state.walletPageIndex) {
            state.walletPageIndex = targetPageIndex;
            await loadWalletPage({ deferSelection: true, deferHydration: true });
          }
          debugLog('grid', 'focus token hydrating indexed page', {
            targetTokenId: targetId.toString(),
            targetPageIndex
          });
          renderTokenGrid();
          await selectToken(targetId);
          return true;
        }
      }

      if (state.walletPageIndex !== originalPageIndex) {
        debugLog('grid', 'focus token not found; restoring original page', {
          targetTokenId: targetId.toString(),
          originalPageIndex,
          currentPageIndex: state.walletPageIndex
        }, 'warn');
        state.walletPageIndex = originalPageIndex;
        await loadWalletPage({ deferSelection: true });
      }
      debugLog('grid', 'focus token not found', {
        targetTokenId: targetId.toString(),
        pageCount: getWalletPageCount()
      }, 'warn');
      return false;
    };

    const applyCachedThumbnail = async (token, thumbElement, options = {}) => {
      if (token.svgDataUri) {
        thumbElement.classList.add('has-thumbnail');
        thumbElement.dataset.thumbnailState = 'inline-svg';
        debugLog('cache', 'using inline SVG data URI thumbnail', {
          tokenId: token.id.toString(),
          contractId: getTokenCacheContractId(token)
        });
        return true;
      }
      const cacheKey = getThumbnailKey(token);
      const startedAt = performance.now();
      const memoryHit = state.thumbnailCache.has(cacheKey);
      let thumbnail = state.thumbnailCache.get(cacheKey);
      if (thumbnail === undefined) {
        debugLog('cache', 'thumbnail IndexedDB lookup started', {
          tokenId: token.id.toString(),
          contractId: getTokenCacheContractId(token)
        });
        thumbnail = await loadInscriptionThumbnailFromCache(
          getTokenCacheContractId(token),
          token.id
        );
        state.thumbnailCache.set(cacheKey, thumbnail);
      }
      if (!thumbnail?.data) {
        thumbElement.dataset.thumbnailState = 'miss';
        debugLog('cache', 'thumbnail cache miss', {
          tokenId: token.id.toString(),
          contractId: getTokenCacheContractId(token),
          source: memoryHit ? 'memory' : 'indexeddb',
          ms: Math.round(performance.now() - startedAt)
        });
        return false;
      }
      if (!thumbElement.isConnected) {
        debugLog('cache', 'thumbnail target stale', {
          tokenId: token.id.toString(),
          contractId: getTokenCacheContractId(token)
        });
        return false;
      }
      if (options.requireActivePage !== false) {
        const activePageIds = new Set(getWalletPageIds().map((id) => id.toString()));
        if (!activePageIds.has(token.id.toString())) {
          return false;
        }
      }
      const oldUrl = state.tokenThumbUrls.get(cacheKey);
      if (oldUrl) {
        URL.revokeObjectURL(oldUrl);
      }
      const blob = new Blob([thumbnail.data], {
        type: thumbnail.mimeType ?? 'image/webp'
      });
      const url = URL.createObjectURL(blob);
      state.tokenThumbUrls.set(cacheKey, url);
      thumbElement.innerHTML = '';
      const img = document.createElement('img');
      img.alt = 'Inscription preview';
      applyPixelPerfectImageRendering(img, {
        mimeType: thumbnail.mimeType ?? 'image/webp',
        sourceUrl: url
      });
      img.src = url;
      thumbElement.classList.add('has-thumbnail');
      thumbElement.dataset.thumbnailState = 'hit';
      thumbElement.replaceChildren(img);
      debugLog('cache', 'thumbnail cache hit', {
        tokenId: token.id.toString(),
        contractId: getTokenCacheContractId(token),
        bytes: thumbnail.data.length,
        mimeType: thumbnail.mimeType ?? 'image/webp',
        source: memoryHit ? 'memory' : 'indexeddb',
        ms: Math.round(performance.now() - startedAt)
      });
      return true;
    };

    // Locate the live grid thumb element for a token without rebuilding the
    // grid, so a freshly-warmed thumbnail can be applied to just that card
    // instead of triggering a full re-render (which revokes every blob URL and
    // restarts all media streams).
    const findGridThumbElement = (token) => {
      if (!dom.tokenGrid || !token) {
        return null;
      }
      const card = dom.tokenGrid.querySelector(
        `.token-card[data-token-id="${token.id.toString()}"]`
      );
      return card ? card.querySelector('.token-thumb') : null;
    };

    const warmThumbnailCacheFromBytes = async (token, bytes, mimeType, options = {}) => {
      const kind = getMediaKind(mimeType);
      if (kind !== 'image' && kind !== 'svg') {
        return null;
      }
      const contractId = getTokenCacheContractId(token);
      const cacheKey = getThumbnailKey(token);
      if (kind === 'image' && isAnimatedImagePayload(bytes, mimeType)) {
        state.gridLiveMediaCache.set(cacheKey, {
          kind: 'image',
          bytes,
          mimeType
        });
        debugLog('cache', 'animated image uses live grid media', {
          tokenId: token.id.toString(),
          contractId,
          bytes: bytes.length,
          mimeType
        });
        if (options.renderGrid !== false) {
          const thumbElement = findGridThumbElement(token);
          if (thumbElement) {
            renderGridLiveMedia(token, thumbElement, state.gridLiveMediaCache.get(cacheKey));
          } else {
            scheduleGridRender();
          }
        }
        return null;
      }
      try {
        const thumbnail = await createImageThumbnail({
          bytes,
          mimeType
        });
        if (!thumbnail?.data) {
          debugLog('cache', 'thumbnail generation skipped', {
            tokenId: token.id.toString(),
            contractId,
            mimeType
          });
          return null;
        }
        await saveInscriptionThumbnailToCache(contractId, token.id, thumbnail.data, {
          mimeType: thumbnail.mimeType,
          width: thumbnail.width,
          height: thumbnail.height
        });
        state.thumbnailCache.set(cacheKey, thumbnail);
        debugLog('cache', 'thumbnail cache warmed from preview bytes', {
          tokenId: token.id.toString(),
          contractId,
          bytes: thumbnail.data.length,
          mimeType: thumbnail.mimeType
        });
        if (options.renderGrid !== false) {
          const thumbElement = findGridThumbElement(token);
          if (thumbElement) {
            await applyCachedThumbnail(token, thumbElement);
          } else {
            scheduleGridRender();
          }
        }
        return thumbnail;
      } catch (error) {
        debugLog(
          'cache',
          'thumbnail cache warm failed',
          {
            tokenId: token.id.toString(),
            contractId,
            mimeType,
            error: error instanceof Error ? error.message : String(error)
          },
          'warn'
        );
        return null;
      }
    };

    const isGridHtmlDocument = (mimeType) => {
      const normalized = getMimeTypeEssence(mimeType);
      return normalized === 'text/html' || normalized === 'application/xhtml+xml';
    };

    const isGridPdfDocument = (mimeType) =>
      getMimeTypeEssence(mimeType) === 'application/pdf';

    const isPotentialAnimatedRasterMimeType = (mimeType) => {
      const normalized = getMimeTypeEssence(mimeType) ?? '';
      return (
        normalized === 'image/png' ||
        normalized === 'image/apng' ||
        normalized === 'image/gif' ||
        normalized === 'image/webp' ||
        normalized === 'application/octet-stream' ||
        normalized === ''
      );
    };

    const shouldProbeCachedAnimatedThumbnail = (token) =>
      !!token.meta &&
      token.meta.totalSize > 0n &&
      token.meta.totalSize <= MAX_GRID_EAGER_FULL_LOAD_BYTES &&
      isPotentialAnimatedRasterMimeType(token.meta.mimeType ?? null);

    const getTokenRuntimeImageUrl = (token) => {
      // SVG is included here so the grid renders it as a direct <img> from the
      // runtime content endpoint (served as image/svg+xml). The browser scales
      // the vector to the card; this avoids the canvas thumbnail rasterizer,
      // which returns null for SVGs that declare no intrinsic width/height (most
      // generative SVGs) — the reason XML/SVG tiles previously showed blank even
      // though the preview canvas, which renders the same <img> directly, worked.
      const kind = getMediaKind(token.meta?.mimeType ?? null);
      return kind === 'image' || kind === 'svg'
        ? getTokenRuntimeContentUrl(token)
        : null;
    };

    const isSvgToken = (token) =>
      getMediaKind(token.meta?.mimeType ?? null) === 'svg';

    const renderGridRuntimeImage = (token, thumbElement) => {
      const sourceUrl = getTokenRuntimeImageUrl(token);
      if (!sourceUrl) {
        return false;
      }
      const cacheKey = getThumbnailKey(token);
      const startedAt = performance.now();
      const img = document.createElement('img');
      img.alt = 'Inscription preview';
      img.decoding = 'async';
      applyPixelPerfectImageRendering(img, {
        mimeType: token.meta?.mimeType ?? null,
        sourceUrl,
        isSvgSource: isSvgToken(token),
        squareFrame: true
      });
      img.addEventListener('load', () => {
        if (
          !thumbElement.isConnected ||
          thumbElement.dataset.thumbnailKey !== cacheKey ||
          thumbElement.dataset.thumbnailState !== 'runtime-image'
        ) {
          return;
        }
        debugLog('cache', 'runtime image grid display ready', {
          tokenId: token.id.toString(),
          contractId: getTokenCacheContractId(token),
          size: token.meta?.totalSize?.toString() ?? null,
          mimeType: token.meta?.mimeType ?? null,
          ms: Math.round(performance.now() - startedAt)
        });
      }, { once: true });
      img.addEventListener('error', () => {
        if (
          !thumbElement.isConnected ||
          thumbElement.dataset.thumbnailKey !== cacheKey ||
          thumbElement.dataset.thumbnailState !== 'runtime-image'
        ) {
          return;
        }
        debugLog(
          'cache',
          'runtime image grid stream failed; falling back to local reconstruction',
          {
            tokenId: token.id.toString(),
            contractId: getTokenCacheContractId(token),
            sourceUrl
          },
          'warn'
        );
        thumbElement.classList.remove('has-thumbnail');
        setTokenThumbLabel(thumbElement, 'loading');
        thumbElement.dataset.thumbnailState = 'runtime-image-fallback';
        if (!scheduleBackgroundThumbnailHydration(token, thumbElement)) {
          setTokenThumbLabel(
            thumbElement,
            getGridMimeLabel(token.meta?.mimeType ?? null)
          );
          thumbElement.dataset.thumbnailState = 'failed-runtime-image';
        }
      }, { once: true });
      img.src = sourceUrl;
      thumbElement.classList.add('has-thumbnail');
      thumbElement.dataset.thumbnailState = 'runtime-image';
      thumbElement.replaceChildren(img);
      debugLog('cache', 'runtime image grid stream started', {
        tokenId: token.id.toString(),
        contractId: getTokenCacheContractId(token),
        size: token.meta?.totalSize?.toString() ?? null,
        mimeType: token.meta?.mimeType ?? null
      });
      return true;
    };

    // ------------------------------------------------------------------
    // Live HTML-frame manager (phase one: execution gate + budget + poster)
    //
    // HTML inscriptions (e.g. embedded X-Board apps) are expensive: each one
    // runs its own scripts, network fetches and ~hundreds of slot renders. The
    // byte-hydration queue throttles *fetching*; this manager throttles
    // *executing*. A tile's iframe srcdoc is only set when the tile is in the
    // viewport AND within MAX_LIVE_HTML_FRAMES. Everything else shows a static
    // poster the user can click to force-render.
    //
    // Trusted lane (phase two): a board that completes the embed handshake is
    // marked trusted and exempted from the budget, because it self-throttles
    // internally. Trusted status persists for the session so scroll-back is
    // cheap. See docs/grid-embed-contract.md.
    // ------------------------------------------------------------------
    const liveHtmlFrameManager = (() => {
      const tiles = new Map(); // thumbElement -> record
      let observer = null;

      const now = () =>
        typeof performance !== 'undefined' && performance.now
          ? performance.now()
          : Date.now();

      const liveCount = () => {
        let n = 0;
        tiles.forEach((r) => {
          if (r.active && !r.trusted) n += 1;
        });
        return n;
      };

      const activate = (record) => {
        if (record.active || !record.frame.isConnected) return;
        record.frame.srcdoc = injectGridThumbnailHtml(record.html);
        record.active = true;
        record.activatedAt = now();
        if (record.poster) record.poster.hidden = true;
      };

      const deactivate = (record) => {
        if (!record.active) return;
        record.frame.srcdoc = '';
        record.active = false;
        // NB: record.trusted persists for the session so a known-good board is
        // not budget-blocked when scrolled back into view.
        if (record.poster) record.poster.hidden = false;
      };

      // Oldest active, non-trusted tile to evict so a visible tile can run.
      const pickEvictable = (exclude, allowIntersecting) => {
        let victim = null;
        tiles.forEach((r) => {
          if (r === exclude || !r.active || r.trusted) return;
          if (!allowIntersecting && r.intersecting) return;
          if (!victim || r.activatedAt < victim.activatedAt) victim = r;
        });
        return victim;
      };

      const requestActivation = (record) => {
        if (record.active) return;
        // Gated tiles (e.g. relationship pair/child thumbs) never auto-activate;
        // they stay as a poster until the user clicks (forceActivate).
        if (record.gated) return;
        // Grid tiles render eagerly: every on-screen HTML inscription runs, no
        // per-tile clicking. Off-screen tiles are still deactivated by the
        // IntersectionObserver, so concurrency stays bounded to what's visible.
        activate(record);
      };

      const fillFreeSlots = () => {
        tiles.forEach((r) => {
          if (r.active || !r.intersecting || r.gated) return;
          activate(r);
        });
      };

      const forceActivate = (record) => {
        if (record.active) return;
        if (!record.trusted && liveCount() >= MAX_LIVE_HTML_FRAMES) {
          const victim = pickEvictable(record, true);
          if (victim) deactivate(victim);
        }
        activate(record);
      };

      const ensureObserver = () => {
        if (observer || typeof IntersectionObserver !== 'function') {
          return observer;
        }
        observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              const record = tiles.get(entry.target);
              if (!record) continue;
              record.intersecting = entry.isIntersecting;
              if (entry.isIntersecting) {
                requestActivation(record);
              } else {
                deactivate(record);
              }
            }
            fillFreeSlots();
          },
          { root: null, rootMargin: '300px', threshold: 0 }
        );
        return observer;
      };

      // Phase-two receiver: a cooperating board posts {type:'xtrata:embed:hello'}
      // once its script runs. We mark that frame trusted (exempt from budget)
      // and ack so it can switch into lite/embedded rendering.
      if (typeof window !== 'undefined' && window.addEventListener) {
        window.addEventListener('message', (event) => {
          const data = event && event.data;
          if (!data || data.type !== 'xtrata:embed:hello') return;
          tiles.forEach((record) => {
            if (
              record.frame.contentWindow &&
              record.frame.contentWindow === event.source
            ) {
              record.trusted = true;
              if (record.poster) record.poster.hidden = true;
              if (event.source && typeof event.source.postMessage === 'function') {
                event.source.postMessage(
                  {
                    type: 'xtrata:embed:ack',
                    mode: 'grid-thumbnail',
                    budget: 'trusted'
                  },
                  '*'
                );
              }
            }
          });
        });
      }

      const register = (thumbElement, media, options = {}) => {
        const existing = tiles.get(thumbElement);
        if (existing) {
          if (observer) observer.unobserve(thumbElement);
          tiles.delete(thumbElement);
        }

        const frame = document.createElement('iframe');
        frame.title = 'inscription-preview';
        frame.sandbox = 'allow-scripts';
        frame.referrerPolicy = 'no-referrer';
        frame.loading = 'lazy';

        const poster = document.createElement('div');
        poster.className = 'token-thumb-gate';
        const label = document.createElement('div');
        label.className = 'token-thumb-gate__label';
        label.textContent = getGridMimeLabel(media.mimeType ?? null) || 'HTML';
        const hint = document.createElement('div');
        hint.className = 'token-thumb-gate__hint';
        hint.textContent = 'Tap to load';
        poster.append(label, hint);

        const record = {
          frame,
          poster,
          html: media.html,
          active: false,
          intersecting: false,
          trusted: false,
          gated: !!options.gated,
          activatedAt: 0
        };

        poster.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          forceActivate(record);
        });

        tiles.set(thumbElement, record);
        thumbElement.append(frame, poster);

        const obs = ensureObserver();
        if (obs) {
          obs.observe(thumbElement);
        } else {
          // No IntersectionObserver: activate now, still bounded by budget.
          record.intersecting = true;
          requestActivation(record);
        }
      };

      const reset = () => {
        if (observer) {
          observer.disconnect();
          observer = null;
        }
        tiles.forEach((record) => {
          record.frame.srcdoc = '';
        });
        tiles.clear();
      };

      return { register, reset };
    })();

    const renderGridLiveMedia = (token, thumbElement, media, options = {}) => {
      const cacheKey = getThumbnailKey(token);
      const oldUrl = state.tokenThumbUrls.get(cacheKey);
      if (oldUrl) {
        URL.revokeObjectURL(oldUrl);
        state.tokenThumbUrls.delete(cacheKey);
      }
      thumbElement.classList.add('has-thumbnail');
      thumbElement.dataset.thumbnailState = media.kind;
      thumbElement.replaceChildren();

      if (media.kind === 'image' || media.kind === 'svg') {
        const blob = new Blob([media.bytes], {
          type: media.mimeType ?? 'application/octet-stream'
        });
        const url = URL.createObjectURL(blob);
        state.tokenThumbUrls.set(cacheKey, url);
        const img = document.createElement('img');
        img.alt = 'Inscription preview';
        applyPixelPerfectImageRendering(img, {
          mimeType: media.mimeType ?? null,
          sourceUrl: url,
          isSvgSource: media.kind === 'svg',
          squareFrame: true
        });
        img.src = url;
        thumbElement.append(img);
        const replayDelayMs =
          media.kind === 'image'
            ? getFiniteAnimatedImageReplayDelayMs(media.bytes, media.mimeType ?? null)
            : null;
        if (Number.isFinite(replayDelayMs) && replayDelayMs > 0) {
          const replay = () => {
            if (
              !img.isConnected ||
              thumbElement.dataset.thumbnailKey !== cacheKey ||
              state.tokenThumbUrls.get(cacheKey) !== url
            ) {
              return;
            }
            img.src = '';
            requestAnimationFrame(() => {
              if (
                !img.isConnected ||
                thumbElement.dataset.thumbnailKey !== cacheKey ||
                state.tokenThumbUrls.get(cacheKey) !== url
              ) {
                return;
              }
              img.src = url;
              window.setTimeout(replay, replayDelayMs);
            });
          };
          window.setTimeout(replay, replayDelayMs);
        }
        return true;
      }

      if (media.kind === 'video') {
        const blob = new Blob([media.bytes], {
          type: media.mimeType ?? 'video/mp4'
        });
        const url = URL.createObjectURL(blob);
        state.tokenThumbUrls.set(cacheKey, url);
        const video = document.createElement('video');
        video.src = url;
        video.muted = true;
        video.loop = true;
        video.autoplay = true;
        video.playsInline = true;
        video.preload = 'auto';
        video.addEventListener('loadeddata', () => {
          const playAttempt = video.play();
          if (playAttempt && typeof playAttempt.catch === 'function') {
            void playAttempt.catch(() => {});
          }
        });
        thumbElement.append(video);
        return true;
      }

      if (media.kind === 'audio') {
        setTokenThumbLabel(thumbElement, getGridMimeLabel(media.mimeType ?? null));
        return true;
      }

      if (media.kind === 'html') {
        // Gated mount: the iframe only executes when on-screen and within the
        // live-frame budget (or on click). Prevents N heavy board inscriptions
        // from running at once. See liveHtmlFrameManager above. Relationship
        // thumbs pass { gated: true } so they stay click-to-load.
        liveHtmlFrameManager.register(thumbElement, media, {
          gated: !!options.gated
        });
        return true;
      }

      if (media.kind === 'pdf') {
        const blob = new Blob([media.bytes], {
          type: media.mimeType ?? 'application/pdf'
        });
        const url = URL.createObjectURL(blob);
        state.tokenThumbUrls.set(cacheKey, url);
        const frame = document.createElement('iframe');
        frame.title = 'inscription-preview';
        frame.sandbox = '';
        frame.referrerPolicy = 'no-referrer';
        frame.loading = 'lazy';
        frame.src = url;
        thumbElement.append(frame);
        return true;
      }

      return false;
    };

    const shouldBackgroundHydrateThumbnail = (token) => {
      if (token.svgDataUri || !token.meta || token.meta.totalSize <= 0n) {
        return false;
      }
      const kind = getMediaKind(token.meta.mimeType ?? null);
      if (
        state.selectedTokenId === token.id &&
        (kind === 'image' || kind === 'svg')
      ) {
        return false;
      }
      if (token.meta.totalSize > MAX_GRID_EAGER_FULL_LOAD_BYTES) {
        return false;
      }
      return (
        kind === 'image' ||
        kind === 'svg' ||
        kind === 'video' ||
        kind === 'html' ||
        kind === 'binary'
      );
    };

    const compareBackgroundThumbnailHydrationJobs = (left, right) => {
      const leftSize = left.token.meta?.totalSize ?? 0n;
      const rightSize = right.token.meta?.totalSize ?? 0n;
      return leftSize < rightSize ? -1 : leftSize > rightSize ? 1 : 0;
    };

    const runBackgroundThumbnailHydration = async (job) => {
      const { token, thumbElement, cacheKey, runId } = job;
      if (runId !== state.thumbnailHydrationRunId) {
        return;
      }
      const contentClient = getTokenClient(token);
      const cacheContractId = getTokenCacheContractId(token);
      try {
        debugLog('cache', 'background thumbnail fetch started', {
          tokenId: token.id.toString(),
          contractId: cacheContractId,
          size: token.meta?.totalSize?.toString() ?? null,
          mimeType: token.meta?.mimeType ?? null
        });
        const bytes = await fetchOnChainContent({
          client: contentClient,
          fallbackClients: getContentFallbackClients(contentClient),
          cacheContractId,
          id: token.id,
          senderAddress: getReadOnlySenderAddress(),
          totalSize: token.meta?.totalSize ?? 0n,
          mimeType: token.meta?.mimeType ?? null
        });
        const mimeType =
          resolveMimeType(token.meta?.mimeType ?? null, bytes) ??
          token.meta?.mimeType ??
          'application/octet-stream';
        const kind = getMediaKind(mimeType);
        if (kind === 'audio') {
          state.gridLiveMediaCache.set(cacheKey, {
            kind: 'audio',
            mimeType
          });
          displayResolvedGridMedia(token, thumbElement, cacheKey);
          debugLog('cache', 'background audio grid display ready', {
            tokenId: token.id.toString(),
            contractId: cacheContractId,
            bytes: bytes.length,
            mimeType
          });
          return;
        }
        if (kind === 'video') {
          state.gridLiveMediaCache.set(cacheKey, {
            kind: 'video',
            bytes,
            mimeType
          });
          displayResolvedGridMedia(token, thumbElement, cacheKey);
          debugLog('cache', 'background video grid display ready', {
            tokenId: token.id.toString(),
            contractId: cacheContractId,
            bytes: bytes.length,
            mimeType
          });
          return;
        }
        if (isGridHtmlDocument(mimeType)) {
          state.gridLiveMediaCache.set(cacheKey, {
            kind: 'html',
            bytes,
            html: await prepareRuntimeHtmlForToken(
              token,
              new TextDecoder().decode(bytes),
              'grid'
            ),
            mimeType
          });
          displayResolvedGridMedia(token, thumbElement, cacheKey);
          debugLog('cache', 'background html grid display ready', {
            tokenId: token.id.toString(),
            contractId: cacheContractId,
            bytes: bytes.length,
            mimeType
          });
          return;
        }
        if (isGridPdfDocument(mimeType)) {
          state.gridLiveMediaCache.set(cacheKey, {
            kind: 'pdf',
            bytes,
            mimeType
          });
          displayResolvedGridMedia(token, thumbElement, cacheKey);
          return;
        }
        if (kind === 'svg') {
          // Render SVG directly as a blob <img> rather than rasterising it: the
          // canvas thumbnail path yields 0x0 for SVGs that declare no intrinsic
          // size. This is the fallback when the runtime-content <img> failed
          // (e.g. the endpoint hiccuped), so SVG tiles still render from bytes.
          state.gridLiveMediaCache.set(cacheKey, {
            kind: 'svg',
            bytes,
            mimeType: 'image/svg+xml'
          });
          displayResolvedGridMedia(token, thumbElement, cacheKey);
          debugLog('cache', 'background svg grid display ready', {
            tokenId: token.id.toString(),
            contractId: cacheContractId,
            bytes: bytes.length,
            mimeType
          });
          return;
        }
        if (kind !== 'image' && kind !== 'svg') {
          debugLog('cache', 'background thumbnail skipped non-image content', {
            tokenId: token.id.toString(),
            contractId: cacheContractId,
            mimeType
          });
          return;
        }
        if (kind === 'image' && isAnimatedImagePayload(bytes, mimeType)) {
          state.gridLiveMediaCache.set(cacheKey, {
            kind: 'image',
            bytes,
            mimeType
          });
          displayResolvedGridMedia(token, thumbElement, cacheKey);
          debugLog('cache', 'background animated image grid display ready', {
            tokenId: token.id.toString(),
            contractId: cacheContractId,
            bytes: bytes.length,
            mimeType
          });
          return;
        }
        const thumbnail = await warmThumbnailCacheFromBytes(token, bytes, mimeType, {
          renderGrid: false
        });
        if (!thumbnail) {
          return;
        }
        const cachedThumbTarget =
          thumbElement.isConnected && thumbElement.dataset.thumbnailKey === cacheKey
            ? thumbElement
            : findLiveGridThumb(token.id, cacheKey);
        if (cachedThumbTarget) {
          await applyCachedThumbnail(token, cachedThumbTarget, {
            requireActivePage:
              cachedThumbTarget.dataset.thumbnailContext !== 'relationship'
          });
        }
      } catch (error) {
        debugLog(
          'cache',
          'background thumbnail fetch failed',
          {
            tokenId: token.id.toString(),
            contractId: cacheContractId,
            error: error instanceof Error ? error.message : String(error)
          },
          'warn'
        );
        if (
          thumbElement.isConnected &&
          thumbElement.dataset.thumbnailKey === cacheKey
        ) {
          const applied = await applyCachedThumbnail(token, thumbElement, {
            requireActivePage: thumbElement.dataset.thumbnailContext !== 'relationship'
          });
          if (!applied) {
            setTokenThumbLabel(
              thumbElement,
              getGridMimeLabel(token.meta?.mimeType ?? null)
            );
            thumbElement.dataset.thumbnailState = 'failed-live-media';
          }
        }
      }
    };

    const pumpBackgroundThumbnailHydrationQueue = () => {
      while (
        state.thumbnailHydrationInFlight.size < GRID_THUMBNAIL_HYDRATION_CONCURRENCY &&
        state.thumbnailHydrationQueue.length > 0
      ) {
        const job = state.thumbnailHydrationQueue.shift();
        state.thumbnailHydrationQueued.delete(job.cacheKey);
        if (job.runId !== state.thumbnailHydrationRunId) {
          continue;
        }
        state.thumbnailHydrationInFlight.add(job.cacheKey);
        void runBackgroundThumbnailHydration(job).finally(() => {
          state.thumbnailHydrationInFlight.delete(job.cacheKey);
          pumpBackgroundThumbnailHydrationQueue();
        });
      }
    };

    const scheduleBackgroundThumbnailHydration = (token, thumbElement) => {
      const cacheKey = getThumbnailKey(token);
      if (
        state.thumbnailHydrationAttempted.has(cacheKey) ||
        state.thumbnailHydrationQueued.has(cacheKey) ||
        state.thumbnailHydrationInFlight.has(cacheKey)
      ) {
        return false;
      }
      if (!shouldBackgroundHydrateThumbnail(token)) {
        return false;
      }
      state.thumbnailHydrationAttempted.add(cacheKey);
      state.thumbnailHydrationQueued.add(cacheKey);
      state.thumbnailHydrationQueue.push({
        token,
        thumbElement,
        cacheKey,
        runId: state.thumbnailHydrationRunId
      });
      state.thumbnailHydrationQueue.sort(compareBackgroundThumbnailHydrationJobs);
      debugLog('cache', 'background thumbnail queued', {
        tokenId: token.id.toString(),
        contractId: getTokenCacheContractId(token),
        priorityBytes: token.meta?.totalSize?.toString() ?? null,
        queueDepth: state.thumbnailHydrationQueue.length
      });
      pumpBackgroundThumbnailHydrationQueue();
      return true;
    };

    const renderRelationshipThumbMedia = async (token, media, role) => {
      if (!media.isConnected) {
        return false;
      }
      const cacheKey = getThumbnailKey(token);
      media.dataset.thumbnailKey = cacheKey;
      media.dataset.thumbnailContext = 'relationship';
      media.classList.remove('parent-thumb--error');

      if (token.svgDataUri) {
        const img = document.createElement('img');
        img.alt = `${role} ${formatTokenId(token.id)}`;
        applyPixelPerfectImageRendering(img, {
          mimeType: 'image/svg+xml',
          sourceUrl: token.svgDataUri,
          isSvgSource: true
        });
        img.src = token.svgDataUri;
        media.classList.add('has-thumbnail');
        media.dataset.thumbnailState = 'inline-svg';
        media.replaceChildren(img);
        return true;
      }

      const liveMedia = state.gridLiveMediaCache.get(cacheKey);
      if (liveMedia && renderGridLiveMedia(token, media, liveMedia, { gated: true })) {
        return true;
      }

      const cached = await applyCachedThumbnail(token, media, {
        requireActivePage: false
      });
      if (cached) {
        return true;
      }

      if (renderGridRuntimeImage(token, media)) {
        return true;
      }

      const label = getGridMimeLabel(token.meta?.mimeType ?? null);
      setTokenThumbLabel(media, label);
      media.dataset.thumbnailState = 'pending-live-media';
      // Relationship thumbs (e.g. HTML inscriptions) render via a direct one-off
      // fetch rather than the grid's shared background queue. That queue is reset
      // (runId bump) on every grid re-render and is size-sorted, so large HTML is
      // deprioritised or cancelled and never paints here — which is why images
      // (handled synchronously above) appeared but HTML did not. This paints into
      // `media` once fetched, guarded by isConnected + key, and reuses the shared
      // live-media cache so the grid benefits too.
      if (
        !state.thumbnailHydrationAttempted.has(cacheKey) &&
        shouldBackgroundHydrateThumbnail(token)
      ) {
        state.thumbnailHydrationAttempted.add(cacheKey);
        void runBackgroundThumbnailHydration({
          token,
          thumbElement: media,
          cacheKey,
          runId: state.thumbnailHydrationRunId
        });
        return true;
      }
      media.dataset.thumbnailState = 'fallback-label';
      return false;
    };

    // Coalesce hydration-triggered re-renders into one per frame. A full
    // renderTokenGrid revokes every grid blob URL and rebuilds the DOM, which
    // invalidates the thumbElement references held by in-flight media/thumbnail
    // callbacks — each of which would then trigger another full render, causing
    // a render storm and visible flicker (images briefly reverting to the mime
    // placeholder). Scheduling collapses that cascade.
    let gridRenderScheduled = false;
    const scheduleGridRender = () => {
      if (gridRenderScheduled) {
        return;
      }
      gridRenderScheduled = true;
      const run = () => {
        gridRenderScheduled = false;
        renderTokenGrid();
      };
      if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(run);
      } else {
        setTimeout(run, 16);
      }
    };

    // Find the current live thumb element for a token's grid square (matching
    // the expected thumbnail key), so a single cell can be updated in place.
    const findLiveGridThumb = (tokenId, cacheKey) => {
      if (!dom.tokenGrid) {
        return null;
      }
      const card = dom.tokenGrid.querySelector(
        `.token-card[data-token-id="${tokenId.toString()}"]`
      );
      const thumb = card ? card.querySelector('.token-thumb') : null;
      return thumb && thumb.dataset.thumbnailKey === cacheKey ? thumb : null;
    };

    // Render freshly-resolved live media into ONE grid square without rebuilding
    // the whole grid. A full re-render (scheduleGridRender) tears down and
    // reloads every other iframe, so HTML squares would all reload whenever any
    // one finished loading. Targeting the single current cell keeps each square
    // independent: once loaded it stays loaded.
    const displayResolvedGridMedia = (token, thumbElement, cacheKey) => {
      const media = state.gridLiveMediaCache.get(cacheKey);
      if (!media) {
        return;
      }
      const target =
        thumbElement.isConnected && thumbElement.dataset.thumbnailKey === cacheKey
          ? thumbElement
          : findLiveGridThumb(token.id, cacheKey);
      if (target) {
        renderGridLiveMedia(token, target, media);
      }
    };

    const renderTokenGrid = (options = {}) => {
      const allowBackgroundHydration = !options.deferHydration;
      revokeGridThumbUrls();
      dom.tokenGrid.innerHTML = '';
      clampWalletPageIndex();
      const pageIds = getWalletPageIds();
      const baseCount = state.walletUsesPagedHoldings
        ? state.walletTotalCount
        : state.walletTokenIds.length;
      // Escrowed twins ride along page 0 in addition to the wallet's holdings,
      // so include them in the count and render enough cells to show them all.
      const injectedCount = getInjectedEscrowTwinIds().length;
      const totalCount = baseCount + injectedCount;
      setWalletCountLabel(totalCount);
      updateWalletPagerControls();
      debugLog('grid', 'render grid page', {
        ...getGridDebugContext(pageIds),
        allowBackgroundHydration,
        deferHydration: !!options.deferHydration
      });

      const cellCount = Math.max(WALLET_PAGE_SIZE, pageIds.length);
      for (let index = 0; index < cellCount; index += 1) {
        const id = pageIds[index] ?? null;
        const token = id !== null
          ? state.walletTokenCache.get(id.toString()) ?? null
          : null;
        const card = document.createElement('button');
        card.type = 'button';
        card.className = `token-card${token ? '' : ' empty'}${token && state.selectedTokenId === token.id ? ' active' : ''}`;
        if (token) {
          card.dataset.tokenId = token.id.toString();
        }
        // Forever Twin escrow marker: a twin owned by a registered helper
        // contract is locked in escrow (the holder keeps the original NFT).
        // Flag the card with a padlock + coloured border so it's easy to
        // differentiate escrowed/locked twins from regular inscriptions.
        if (token && findPepeEscrowResolver(token.owner)) {
          card.classList.add('token-card--escrowed');
          const lock = document.createElement('span');
          lock.className = 'token-escrow-badge';
          lock.innerHTML =
            '<svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true" focusable="false"><path fill="currentColor" d="M18.6 6.62c-1.44 0-2.8.56-3.77 1.53L12 10.66 10.48 12h.01L7.8 14.39c-.64.64-1.49.99-2.4.99-1.87 0-3.39-1.51-3.39-3.38S3.53 8.62 5.4 8.62c.91 0 1.76.35 2.44 1.03l1.13 1 1.51-1.34L9.22 8.2C8.2 7.18 6.84 6.62 5.4 6.62 2.42 6.62 0 9.04 0 12s2.42 5.38 5.4 5.38c1.44 0 2.8-.56 3.77-1.53l2.83-2.5.01.01L14.2 9.61c.64-.64 1.49-.99 2.4-.99 1.87 0 3.39 1.51 3.39 3.38s-1.52 3.38-3.39 3.38c-.9 0-1.76-.35-2.44-1.03l-1.14-1.01-1.51 1.34 1.27 1.12c1.02 1.02 2.37 1.57 3.82 1.57 2.98 0 5.4-2.42 5.4-5.38s-2.42-5.37-5.4-5.37z"/></svg>';
          lock.setAttribute('role', 'img');
          lock.setAttribute('aria-label', 'Forever Twin');
          lock.title =
            'Forever Twin — this Xtrata inscription is bound to an original collection NFT through the Forever Twin contract.';
          card.append(lock);
        }
        const thumb = document.createElement('div');
        thumb.className = 'token-thumb';
        const meta = document.createElement('div');
        meta.className = 'token-meta';
        let shouldApplyCachedThumbnail = false;
        let shouldScheduleBackgroundHydration = false;

        if (id === null) {
          card.disabled = true;
          thumb.textContent = '';
          meta.innerHTML = '<span>empty</span>';
        } else if (!token) {
          card.disabled = true;
          thumb.textContent = '...';
          meta.innerHTML = '<span>loading</span>';
        } else {
          const kind = getGridMimeLabel(token.meta?.mimeType ?? null);
          let displayKind = kind;
          thumb.dataset.thumbnailKey = getThumbnailKey(token);
          if (token.svgDataUri) {
            const img = document.createElement('img');
            img.alt = 'Inscription preview';
            applyPixelPerfectImageRendering(img, {
              mimeType: 'image/svg+xml',
              sourceUrl: token.svgDataUri,
              isSvgSource: true
            });
            img.src = token.svgDataUri;
            thumb.classList.add('has-thumbnail');
            thumb.dataset.thumbnailState = 'inline-svg';
            thumb.append(img);
          } else if (isSvgToken(token) && renderGridRuntimeImage(token, thumb)) {
            // SVG with no precomputed data-uri (e.g. served from the D1 index):
            // render the vector directly from the runtime content endpoint
            // instead of the rasterizer, which fails for size-less SVGs.
            shouldApplyCachedThumbnail = false;
          } else {
            const cacheKey = getThumbnailKey(token);
            const liveMedia = state.gridLiveMediaCache.get(cacheKey);
            displayKind = liveMedia?.mimeType ? getGridMimeLabel(liveMedia.mimeType) : kind;
            if (liveMedia && renderGridLiveMedia(token, thumb, liveMedia)) {
              shouldApplyCachedThumbnail = false;
            } else if (
              allowBackgroundHydration &&
              shouldProbeCachedAnimatedThumbnail(token) &&
              renderGridRuntimeImage(token, thumb)
            ) {
              shouldApplyCachedThumbnail = false;
            } else {
              const shouldProbeAnimatedImage = shouldProbeCachedAnimatedThumbnail(token);
              const isAnimatedProbePending =
                allowBackgroundHydration &&
                shouldProbeAnimatedImage &&
                (!state.thumbnailHydrationAttempted.has(cacheKey) ||
                  state.thumbnailHydrationQueued.has(cacheKey) ||
                  state.thumbnailHydrationInFlight.has(cacheKey));
              setTokenThumbLabel(thumb, isAnimatedProbePending ? 'loading' : displayKind);
              thumb.dataset.thumbnailState = isAnimatedProbePending
                ? 'pending-live-media'
                : 'pending-cache';
              shouldApplyCachedThumbnail = !isAnimatedProbePending;
              shouldScheduleBackgroundHydration = isAnimatedProbePending;
            }
          }
          const size = token.meta?.totalSize ?? null;
          meta.innerHTML =
            `<span>${displayKind}${size !== null ? ` · ${formatBytes(size)}` : ''}</span>`;
          card.addEventListener('click', () => {
            void selectToken(token.id, { scrollToPreview: true });
          });
        }
        card.append(thumb, meta);
        dom.tokenGrid.append(card);
        if (token && allowBackgroundHydration && shouldScheduleBackgroundHydration) {
          scheduleBackgroundThumbnailHydration(token, thumb);
        } else if (token && allowBackgroundHydration && shouldApplyCachedThumbnail) {
          void applyCachedThumbnail(token, thumb).then((applied) => {
            if (
              !applied &&
              allowBackgroundHydration &&
              renderGridRuntimeImage(token, thumb)
            ) {
              return;
            }
            if (
              allowBackgroundHydration &&
              (!applied || shouldProbeCachedAnimatedThumbnail(token))
            ) {
              scheduleBackgroundThumbnailHydration(token, thumb);
            }
          });
        }
      }
      updateTransferControls();
    };

    const updateSelectedTokenGridCard = () => {
      const selectedTokenId = state.selectedTokenId?.toString() ?? null;
      dom.tokenGrid.querySelectorAll('.token-card[data-token-id]').forEach((card) => {
        card.classList.toggle('active', card.dataset.tokenId === selectedTokenId);
      });
    };

    const renderSelectedTokenPreviewPayload = (token, requestId, bytes, mimeType, htmlDoc, startedAt, source) => {
      if (
        requestId !== state.tokenPreviewRequestId ||
        state.selectedTokenId !== token.id
      ) {
        debugLog('preview', 'discarding stale selected inscription preview', {
          tokenId: token.id.toString(),
          source
        });
        return false;
      }
      revokeTokenPreview();
      state.tokenPreviewTokenId = token.id.toString();
      state.tokenPreviewBytes = bytes;
      state.tokenPreviewMimeType = mimeType;
      state.tokenPreviewSourceUrl = null;
      state.tokenPreviewHtmlDoc = htmlDoc;
      renderSelectedInscriptionMeta(token, null, mimeType);
      renderBytesPreview(dom.tokenPreviewMedia, bytes, mimeType, (url) => {
        state.tokenPreviewUrl = url;
      }, { truthfulImageSizing: true, htmlDoc, interactiveHtml: true });
      void warmThumbnailCacheFromBytes(token, bytes, mimeType);
      debugLog('preview', 'selected inscription preview rendered', {
        tokenId: token.id.toString(),
        contractId: getTokenCacheContractId(token),
        bytes: bytes.length,
        mimeType,
        requestId,
        source,
        ms: Math.round(performance.now() - startedAt)
      });
      updateControls();
      return true;
    };

    const loadSelectedTokenPreviewLocally = async (token, requestId) => {
      const contentClient = getTokenClient(token);
      const cacheContractId = token.sourceContractId ?? getContractId(contentClient.contract);
      const startedAt = performance.now();
      const cacheKey = getThumbnailKey(token);
      const liveMedia = state.gridLiveMediaCache.get(cacheKey);
      if (
        liveMedia?.bytes &&
        (liveMedia.kind === 'video' ||
          (liveMedia.kind === 'image' &&
            isAnimatedImagePayload(liveMedia.bytes, liveMedia.mimeType ?? null)))
      ) {
        const mimeType =
          liveMedia.mimeType ??
          token.meta.mimeType ??
          'application/octet-stream';
        if (
          renderSelectedTokenPreviewPayload(
            token,
            requestId,
            liveMedia.bytes,
            mimeType,
            null,
            startedAt,
            'grid-live-media-cache'
          )
        ) {
          return;
        }
      }
      if (
        liveMedia?.kind === 'html' &&
        liveMedia.bytes &&
        isGridHtmlDocument(liveMedia.mimeType)
      ) {
        const mimeType = liveMedia.mimeType ?? token.meta.mimeType ?? 'text/html';
        const htmlDoc =
          liveMedia.html ??
          (await prepareRuntimeHtmlForToken(
            token,
            new TextDecoder().decode(liveMedia.bytes),
            'preview-cache'
          ));
        if (
          renderSelectedTokenPreviewPayload(
            token,
            requestId,
            liveMedia.bytes,
            mimeType,
            htmlDoc,
            startedAt,
            'grid-live-media-cache'
          )
        ) {
          return;
        }
      }
      debugLog('preview', 'local preview content fetch started', {
        tokenId: token.id.toString(),
        contractId: cacheContractId,
        size: token.meta.totalSize.toString(),
        mimeType: token.meta.mimeType ?? null,
        requestId
      });
      const bytes = await fetchOnChainContent({
        client: contentClient,
        fallbackClients: getContentFallbackClients(contentClient),
        cacheContractId,
        id: token.id,
        senderAddress: getReadOnlySenderAddress(),
        totalSize: token.meta.totalSize,
        mimeType: token.meta.mimeType ?? null
      });
      const mimeType = resolveMimeType(token.meta.mimeType ?? null, bytes) ?? token.meta.mimeType ?? 'application/octet-stream';
      const htmlDoc = getMediaKind(mimeType) === 'html'
        ? await prepareRuntimeHtmlForToken(token, new TextDecoder().decode(bytes), 'preview')
        : null;
      renderSelectedTokenPreviewPayload(
        token,
        requestId,
        bytes,
        mimeType,
        htmlDoc,
        startedAt,
        'local-reconstruction'
      );
    };

    const handleSelectedTokenPreviewFailure = (token, requestId, error) => {
      if (
        requestId !== state.tokenPreviewRequestId ||
        state.selectedTokenId !== token.id
      ) {
        debugLog('preview', 'discarding stale selected inscription preview failure', {
          tokenId: token.id.toString()
        });
        return;
      }
      const message = error instanceof Error ? error.message : String(error);
      clearElement(dom.tokenPreviewMedia, 'Preview unavailable');
      appendLog(`Preview failed for ${formatTokenId(token.id)}: ${message}`);
      updateControls();
    };

    const selectToken = async (id, options = {}) => {
      const requestId = ++state.tokenPreviewRequestId;
      state.selectedTokenId = id;
      const token =
        state.walletTokenCache.get(id.toString()) ??
        state.walletTokens.find((entry) => entry.id === id) ??
        null;
      debugLog('preview', 'select token requested', {
        tokenId: id.toString(),
        requestId,
        tokenFound: !!token,
        ...getGridDebugContext()
      });
      updateSelectedTokenGridCard();
      updateTransferControls();
      revokeTokenPreview();
      dom.explorerLink.hidden = true;
      dom.xtrataExplorerLink.hidden = true;

      if (!token) {
        debugLog('preview', 'selected token missing from summary cache', {
          tokenId: id.toString(),
          requestId,
          summaryCacheSize: state.walletTokenCache.size
        }, 'warn');
        clearElement(dom.tokenPreviewMedia, 'No selection');
        renderNoSelectedInscriptionMeta();
        void updateWalletTokenUriHeadPreview(null);
        updateControls();
        return;
      }

      void updateWalletTokenUriHeadPreview(token.tokenUri);

      clearElement(dom.tokenPreviewMedia, 'Loading');
      renderSelectedInscriptionMeta(token);
      if (options.scrollToPreview && isMatureMobileWalletView()) {
        window.requestAnimationFrame(scrollToSelectedPreview);
      }

      const tokenContract = getTokenClient(token).contract;
      dom.explorerLink.href = tokenExplorerUrl(tokenContract, token.id);
      dom.explorerLink.hidden = false;
      dom.xtrataExplorerLink.href = xtrataExplorerUrl(tokenContract, token.id);
      dom.xtrataExplorerLink.hidden = false;
      if (state.explorerMode) {
        window.history.replaceState(null, '', xtrataExplorerUrl(tokenContract, token.id));
        if (dom.explorerTokenInput) {
          dom.explorerTokenInput.value = token.id.toString();
        }
      }

      try {
        if (!token.meta || token.meta.totalSize <= 0n) {
          clearElement(dom.tokenPreviewMedia, token.svgDataUri ? '' : 'No on-chain content');
          if (token.svgDataUri) {
            renderSquareImagePreview(dom.tokenPreviewMedia, token.svgDataUri, {
              mimeType: 'image/svg+xml',
              isSvgSource: true,
              alt: 'Inscription preview'
            });
            state.tokenPreviewTokenId = token.id.toString();
            state.tokenPreviewBytes = null;
            state.tokenPreviewMimeType = 'image/svg+xml';
            state.tokenPreviewSourceUrl = token.svgDataUri;
            state.tokenPreviewHtmlDoc = null;
            debugLog('preview', 'inline SVG preview rendered', {
              tokenId: token.id.toString(),
              requestId
            });
          } else {
            debugLog('preview', 'selected token has no on-chain content', {
              tokenId: token.id.toString(),
              requestId
            });
          }
          updateControls();
          return;
        }
        const cachedLiveMedia = state.gridLiveMediaCache.get(getThumbnailKey(token));
        if (
          cachedLiveMedia?.kind === 'image' &&
          cachedLiveMedia.bytes &&
          isAnimatedImagePayload(
            cachedLiveMedia.bytes,
            cachedLiveMedia.mimeType ?? token.meta.mimeType ?? null
          )
        ) {
          await loadSelectedTokenPreviewLocally(token, requestId);
          return;
        }
        const runtimeImageUrl = getTokenRuntimeImageUrl(token);
        if (runtimeImageUrl) {
          const mimeType = token.meta.mimeType ?? 'application/octet-stream';
          if (
            state.explorerMode &&
            token.meta.totalSize <= MAX_GRID_EAGER_FULL_LOAD_BYTES &&
            isPotentialAnimatedRasterMimeType(mimeType)
          ) {
            await loadSelectedTokenPreviewLocally(token, requestId);
            return;
          }
          state.tokenPreviewTokenId = token.id.toString();
          state.tokenPreviewBytes = null;
          state.tokenPreviewMimeType = mimeType;
          state.tokenPreviewSourceUrl = runtimeImageUrl;
          state.tokenPreviewHtmlDoc = null;
          renderSelectedInscriptionMeta(token, null, mimeType);
          renderSquareImagePreview(dom.tokenPreviewMedia, runtimeImageUrl, {
            mimeType,
            alt: 'Inscription preview',
            preserveAnimation: isPotentialAnimatedRasterMimeType(mimeType),
            onError: () => {
              if (
                requestId !== state.tokenPreviewRequestId ||
                state.selectedTokenId !== token.id
              ) {
                return;
              }
              debugLog(
                'preview',
                'runtime image preview stream failed; falling back to local reconstruction',
                {
                  tokenId: token.id.toString(),
                  contractId: getTokenCacheContractId(token),
                  sourceUrl: runtimeImageUrl
                },
                'warn'
              );
              clearElement(dom.tokenPreviewMedia, 'Loading');
              void loadSelectedTokenPreviewLocally(token, requestId).catch((error) => {
                handleSelectedTokenPreviewFailure(token, requestId, error);
              });
            }
          });
          debugLog('preview', 'runtime image preview stream started', {
            tokenId: token.id.toString(),
            contractId: getTokenCacheContractId(token),
            size: token.meta.totalSize.toString(),
            mimeType
          });
          updateControls();
          return;
        }
        await loadSelectedTokenPreviewLocally(token, requestId);
      } catch (error) {
        handleSelectedTokenPreviewFailure(token, requestId, error);
      }
    };

    const cancelWalletLookup = () => {
      state.walletLookupAbortController?.abort();
      state.walletLookupAbortController = null;
      state.walletLookupPending = false;
    };

    // Keep the address bar in step with the wallet actually on screen, so the
    // URL is correct/shareable and a refresh reopens the same wallet. Uses
    // replaceState (no history spam) — a .btc name is preferred for readability,
    // otherwise the raw address.
    const applyWalletViewUrl = (nameOrAddress) => {
      const value = (nameOrAddress ?? '').toString().replace(/\.btc$/i, '').trim();
      try {
        if (!value) {
          clearWalletViewUrl();
          return;
        }
        window.history.replaceState(null, '', `/?wallet=${encodeURIComponent(value)}`);
      } catch (_) {
        // history API unavailable — non-fatal
      }
    };
    const clearWalletViewUrl = () => {
      try {
        window.history.replaceState(null, '', state.explorerMode ? '/xplorer' : '/my-wallet');
      } catch (_) {
        // non-fatal
      }
    };

    const clearWalletLookupToConnectedWallet = async () => {
      state.walletViewRequestId += 1;
      cancelWalletLookup();

      state.walletLookupNotice = null;
      state.walletViewAddress = null;
      state.walletViewName = null;
      state.curatedGalleryId = null;
      state.curatedGalleryTitle = null;
      state.homeLatestView = false;

      clearExampleDescription();

      clearSelectedTokenPreview();

      dom.walletLookupInput.value = '';
      updateWalletLookupInputMode();

      appendLog(
        state.explorerMode
          ? 'Cleared wallet view — showing the latest inscriptions.'
          : 'Returned to connected wallet view.'
      );

      clearWalletViewUrl();
      updateWalletStatus();
      await loadWalletInscriptions();
      updateControls();
    };

    // Programmatically load a wallet's holdings into the grid (e.g. when the
    // owner/holder address in the preview panel is clicked). Mirrors the
    // resolved-address branch of viewWalletFromInput so it behaves identically
    // in both homepage and Xplorer (explorer-mode) contexts.
    const viewWalletByAddress = async (address) => {
      const normalized = (address ?? '').trim();
      if (!normalized) {
        return;
      }
      state.walletViewRequestId += 1;
      cancelWalletLookup();
      state.walletLookupNotice = null;

      const isConnectedAddress =
        state.walletSession.address &&
        addressesEqual(normalized, state.walletSession.address);
      state.walletViewAddress = isConnectedAddress ? null : normalized;
      state.walletViewName = null;
      state.curatedGalleryId = null;
      state.curatedGalleryTitle = null;
      state.homeLatestView = false;
      clearExampleDescription();
      // Drop the previous wallet's selected inscription so the preview panel
      // never shows a stale token from the wallet we just left.
      clearSelectedTokenPreview();

      if (dom.walletLookupInput) {
        dom.walletLookupInput.value = isConnectedAddress ? '' : normalized;
        updateWalletLookupInputMode();
      }
      if (isConnectedAddress) {
        clearWalletViewUrl();
      } else {
        applyWalletViewUrl(normalized);
      }
      appendLog(`Viewing wallet: ${truncateMiddle(normalized, 8, 8)}.`);
      updateWalletStatus();
      // Bring the grid into view (helpful in explorer-mode where the click
      // originates from the preview panel).
      const scrollTarget = dom.tokenGrid ?? dom.walletGridStatus;
      if (scrollTarget?.scrollIntoView) {
        scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      await loadWalletInscriptions();
      updateControls();
    };

    const viewWalletFromInput = async (options = {}) => {
      if (shouldClearWalletLookupOnSubmit()) {
        await clearWalletLookupToConnectedWallet();
        return;
      }
      state.walletViewRequestId += 1;
      const lookupValue = getWalletLookupSubmitValue();
      const baseLookupState = getWalletLookupState(
        lookupValue,
        state.walletSession.address ?? null
      );
      cancelWalletLookup();
      state.walletLookupNotice = null;

      if (!baseLookupState.entered) {
        state.walletViewAddress = null;
        state.walletViewName = null;
        state.curatedGalleryId = null;
        state.curatedGalleryTitle = null;
        state.homeLatestView = false;
        clearExampleDescription();

        clearSelectedTokenPreview();
        dom.walletLookupInput.value = '';
        updateWalletLookupInputMode();
        updateWalletStatus();
        await loadWalletInscriptions(options);
        updateControls();
        return;
      }
      if (!baseLookupState.valid) {
        state.walletLookupNotice = 'Enter a valid Stacks address or .btc name.';
        updateControls();
        return;
      }

      if (baseLookupState.lookupAddress) {
        const isConnectedAddress =
          state.walletSession.address &&
          addressesEqual(baseLookupState.lookupAddress, state.walletSession.address);
        state.walletViewAddress = isConnectedAddress ? null : baseLookupState.lookupAddress;
        state.walletViewName = null;
        state.curatedGalleryId = null;
        state.curatedGalleryTitle = null;
        state.homeLatestView = false;
        clearExampleDescription();
        clearSelectedTokenPreview();

        dom.walletLookupInput.value = isConnectedAddress ? '' : baseLookupState.lookupAddress;
        updateWalletLookupInputMode();
        if (isConnectedAddress) {
          clearWalletViewUrl();
        } else {
          applyWalletViewUrl(baseLookupState.lookupAddress);
        }
        appendLog(`Viewing wallet: ${truncateMiddle(baseLookupState.lookupAddress, 8, 8)}.`);
        updateWalletStatus();
        await loadWalletInscriptions(options);
        updateControls();
        return;
      }

      const lookupName = baseLookupState.lookupName;
      if (!lookupName) {
        updateControls();
        return;
      }

      const abortController = new AbortController();
      state.walletLookupAbortController = abortController;
      state.walletLookupPending = true;
      state.walletLookupNotice = `Resolving ${lookupName}...`;
      updateControls();

      try {
        const { resolveBnsAddress } = await import('/src/lib/bns/resolver.ts');
        const resolved = await resolveBnsAddress({
          name: lookupName,
          network: state.contract.network,
          signal: abortController.signal
        });
        if (state.walletLookupAbortController !== abortController) {
          return;
        }
        const resolvedLookupState = getWalletLookupState(
          lookupValue,
          state.walletSession.address ?? null,
          {
            resolvedNameAddress: resolved.address,
            bnsStatus: resolved.address ? 'resolved' : 'missing'
          }
        );
        if (!resolvedLookupState.resolvedAddress) {
          state.walletLookupNotice = `No address found for ${lookupName}.`;
          return;
        }
        const isConnectedAddress =
          state.walletSession.address &&
          addressesEqual(resolvedLookupState.resolvedAddress, state.walletSession.address);
        state.walletViewAddress = isConnectedAddress ? null : resolvedLookupState.resolvedAddress;
        state.walletViewName = isConnectedAddress ? null : lookupName;
        state.curatedGalleryId = null;
        state.curatedGalleryTitle = null;
        state.homeLatestView = false;
        clearSelectedTokenPreview();
        dom.walletLookupInput.value = isConnectedAddress ? '' : toBtcLookupLabel(lookupName);
        updateWalletLookupInputMode();
        if (isConnectedAddress) {
          clearWalletViewUrl();
        } else {
          applyWalletViewUrl(lookupName);
        }
        state.walletLookupNotice = null;
        appendLog(
          `Resolved ${lookupName} to ${truncateMiddle(resolvedLookupState.resolvedAddress, 8, 8)}.`
        );
        updateWalletStatus();
        await loadWalletInscriptions(options);
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }
        state.walletLookupNotice =
          'BNS lookup is temporarily unavailable. Try again or paste a wallet address directly.';
        appendLog(
          `BNS lookup failed for ${lookupName}: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      } finally {
        if (state.walletLookupAbortController === abortController) {
          state.walletLookupAbortController = null;
          state.walletLookupPending = false;
          updateControls();
        }
      }
    };

const openCuratedGallery = async (galleryId, options = {}) => {
  const gallery = CURATED_GALLERIES.find((entry) => entry.id === galleryId);
  if (!gallery) {
    return;
  }

  const startedAt = performance.now();
  state.walletViewRequestId += 1;
  const viewRequestId = state.walletViewRequestId;
  debugLog('grid', 'curated gallery load started', {
    viewRequestId,
    galleryId: gallery.id,
    galleryTitle: gallery.title,
    tokenCount: gallery.tokenIds.length,
    tokenIds: formatDebugTokenIds(gallery.tokenIds)
  });
  cancelWalletLookup();

  state.curatedGalleryId = gallery.id;
  state.curatedGalleryTitle = gallery.title;
  state.homeLatestView = false;
  state.walletViewAddress = null;
  state.walletViewName = null;
  state.walletLookupNotice = null;
  state.walletUsesPagedHoldings = false;
  state.walletTotalCount = gallery.tokenIds.length;
  state.walletPageIds = [];
  state.walletTokenIds = [...gallery.tokenIds];
  state.walletPageIndex = 0;

  // Show the "Viewing..." description for this curated example.
  activeExampleDescriptionKey = gallery.id;
  setExampleDescription(gallery.id);

  clearSelectedTokenPreview();

  state.walletTokenCache = new Map();

  dom.walletLookupInput.value = '';
  updateWalletLookupInputMode();
  updateWalletStatus();
  setExperienceMode();

  setStatus(
    dom.walletGridStatus,
    `<strong>Grid</strong> loading ${gallery.title}`,
    'loading',
    'blue'
  );

  renderTokenGridPlaceholders('...');

  try {
    const summaryOptions = {
      primaryOnly: gallery.primaryOnly === true
    };
    const primedSummaries = primeWalletTokenCacheFromSummaryCache(
      gallery.tokenIds,
      summaryOptions
    );
    if (primedSummaries > 0) {
      debugLog('grid', 'curated gallery summary cache primed', {
        viewRequestId,
        galleryId: gallery.id,
        primed: primedSummaries
      });
      renderTokenGrid({ deferHydration: true });
    }

    const missingIds = gallery.tokenIds.filter(
      (id) => !state.walletTokenCache.has(id.toString())
    );
    const summaries = missingIds.length > 0
      ? await fetchWalletTokenSummaries(missingIds, summaryOptions)
      : [];
    debugLog('grid', 'curated gallery summaries fetched', {
      viewRequestId,
      galleryId: gallery.id,
      requested: gallery.tokenIds.length,
      missing: missingIds.length,
      returned: summaries.length,
      returnedIds: summaries.map((token) => token.id.toString())
    });

    summaries.forEach((token) => {
      state.walletTokenCache.set(token.id.toString(), token);
    });

    // Keep curated galleries in the exact order defined in CURATED_GALLERIES.
    // This avoids fetch results or later sorting forcing a different display order.
    const loadedTokenIds = new Set(state.walletTokenCache.keys());

    state.walletTokenIds = gallery.tokenIds.filter((id) =>
      loadedTokenIds.has(id.toString())
    );

    // Optional per-gallery ordering: push HTML tokens (they carry their own
    // artwork, so they preview best) to the top, preserving the configured
    // order within each group. Used by the music gallery, which mixes
    // html players, audio, and video.
    if (gallery.htmlFirst) {
      state.walletTokenIds = state.walletTokenIds
        .map((id, index) => ({ id, index }))
        .sort((a, b) => {
          const isHtml = (id) =>
            getMediaKind(
              state.walletTokenCache.get(id.toString())?.meta?.mimeType ?? null
            ) === 'html'
              ? 0
              : 1;
          return isHtml(a.id) - isHtml(b.id) || a.index - b.index;
        })
        .map((entry) => entry.id);
    }

    state.walletTotalCount = state.walletTokenIds.length;

    setStatus(
      dom.walletGridStatus,
      `<strong>Grid</strong> ${gallery.title} loaded`,
      'ready',
      'blue'
    );

    renderTokenGrid({ deferHydration: true });
    await waitForGridPaint();

    const configuredDefaultTokenId =
      CURATED_GALLERY_DEFAULT_TOKEN_IDS[gallery.id] ?? null;

    const defaultTokenId =
      configuredDefaultTokenId !== null &&
      state.walletTokenIds.some(
        (id) => id.toString() === configuredDefaultTokenId.toString()
      )
        ? configuredDefaultTokenId
        : state.walletTokenIds[0] ?? null;

    if (defaultTokenId !== null) {
      await selectToken(defaultTokenId);
    } else {
      clearSelectedTokenPreview();
    }
    renderTokenGrid();

    setExperienceMode();
    debugLog('grid', 'curated gallery load finished', {
      viewRequestId,
      galleryId: gallery.id,
      selectedTokenId: state.selectedTokenId?.toString() ?? null,
      ...getGridDebugContext(),
      ms: Math.round(performance.now() - startedAt)
    });

    if (options.scroll !== false) {
      document.getElementById('walletTitle')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    setStatus(
      dom.walletGridStatus,
      `<strong>Grid</strong> ${message}`,
      'error',
      'rose'
    );
    debugLog('grid', 'curated gallery load failed', {
      viewRequestId,
      galleryId: gallery.id,
      error: message,
      ms: Math.round(performance.now() - startedAt)
    }, 'warn');
  } finally {
    updateControls();
  }
};
    const transferSelectedToken = () => {
      const selectedToken = getSelectedToken();
      const senderAddress = state.walletSession.address ?? null;
      const walletOwnsToken =
        !!selectedToken && !!senderAddress && addressesEqual(selectedToken.owner, senderAddress);
      const validation = validateTransferRequest({
        senderAddress: walletOwnsToken ? senderAddress : null,
        recipientAddress: dom.transferRecipientInput.value,
        tokenId: selectedToken?.id ?? null,
        networkMismatch: !!getMismatch()
      });
      if (!walletOwnsToken || !selectedToken || !validation.ok || !senderAddress) {
        dom.transferStatus.textContent =
          selectedToken && senderAddress && !walletOwnsToken
            ? 'Only the connected owner can send this inscription.'
            : getTransferValidationMessage(validation) ?? 'Transfer is not ready yet.';
        updateTransferControls();
        return;
      }

      const recipient = validation.recipient ?? dom.transferRecipientInput.value.trim();
      const network = state.walletSession.network ?? state.contract.network;
      const callOptions = buildTransferCall({
        contract: state.contract,
        network: toStacksNetwork(network),
        id: selectedToken.id,
        sender: senderAddress,
        recipient,
        overrides: {
          postConditionMode: PostConditionMode.Deny,
          postConditions: [
            buildTransferPostCondition({
              contract: state.contract,
              senderAddress,
              tokenId: selectedToken.id
            })
          ]
        }
      });

      state.transferPending = true;
      dom.transferStatus.textContent = 'Waiting for wallet confirmation...';
      updateControls();
      appendLog(`Transferring ${formatTokenId(selectedToken.id)} to ${recipient}.`);

      try {
        showContractCall({
          ...callOptions,
          stxAddress: senderAddress,
          onFinish: (payload) => {
            state.transferPending = false;
            dom.transferStatus.textContent = `Transfer submitted: ${payload.txId}`;
            appendLog(`Transfer submitted: ${payload.txId}`);
            updateControls();
            void loadWalletInscriptions();
          },
          onCancel: () => {
            state.transferPending = false;
            dom.transferStatus.textContent = 'Transfer cancelled or failed in wallet.';
            appendLog('Transfer cancelled or failed in wallet.');
            updateControls();
          }
        });
        appendLog('Transfer wallet prompt opened.');
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        state.transferPending = false;
        dom.transferStatus.textContent = `Transfer failed: ${message}`;
        appendLog(`Transfer failed: ${message}`);
        updateControls();
      }
    };

    const runLimited = async (items, limit, task) => {
      const results = new Array(items.length);
      let cursor = 0;
      const workers = Array.from(
        { length: Math.max(1, Math.min(limit, items.length)) },
        async () => {
          while (cursor < items.length) {
            const index = cursor;
            cursor += 1;
            results[index] = await task(items[index], index);
          }
        }
      );
      await Promise.all(workers);
      return results;
    };

    const fetchWalletHoldingsPage = async (params) => {
      debugLog('hiro', 'wallet holdings request', {
        pageIndex: params.pageIndex,
        limit: WALLET_PAGE_SIZE,
        offset: params.pageIndex * WALLET_PAGE_SIZE,
        contractCount: params.contractIds.length,
        wallet: truncateMiddle(params.walletAddress)
      });
      const page = await loadWalletHoldingsPage({
        ...params,
        pageSize: WALLET_PAGE_SIZE
      });
      debugLog('hiro', 'wallet holdings response ok', {
        base: summarizeApiBase(page.sourceBase),
        pageIndex: params.pageIndex,
        returned: page.tokenIds.length,
        total: page.total
      });
      return {
        ids: page.tokenIds,
        total: page.total,
        sourceBase: page.sourceBase
      };
    };

    // Fetch (cached per primary contract) the set of primary-minted token ids
    // that fall within the legacy id range, so reads can be routed in one shot.
    const getPrimaryMintedIdSet = async (sender, legacyMaxId) => {
      if (!state.client || legacyMaxId === null) {
        return null;
      }
      const cacheKey = getContractId(state.contract);
      if (state.primaryMintedIdCache && state.primaryMintedIdCache.key === cacheKey) {
        return state.primaryMintedIdCache.set;
      }
      try {
        const count = await state.client.getMintedCount(sender);
        const total = Number(count);
        if (!Number.isFinite(total) || total <= 0) {
          const empty = new Set();
          state.primaryMintedIdCache = { key: cacheKey, set: empty };
          return empty;
        }
        const scanCount = Math.min(total, 2000);
        const indices = Array.from({ length: scanCount }, (_, index) => BigInt(index));
        const mintedIds = await runLimited(indices, 6, async (index) => {
          try {
            return await state.client.getMintedId(index, sender);
          } catch (error) {
            return null;
          }
        });
        const set = new Set(
          mintedIds
            .filter((id) => id !== null && id <= legacyMaxId)
            .map((id) => id.toString())
        );
        state.primaryMintedIdCache = { key: cacheKey, set };
        return set;
      } catch (error) {
        return null;
      }
    };

    const getSummaryFetchContext = (options = {}) => {
      if (!state.client) {
        return null;
      }
      const primaryContractId = getContractId(state.client.contract);
      const galleryReadClient = getActiveGalleryReadClient();
      if (options.primaryOnly === true) {
        return {
          scopeKey: `direct:${primaryContractId}`,
          primaryContractId,
          lineageContractIds: [],
          useDirectRead: true,
          directReadClient: state.client
        };
      }
      if (galleryReadClient) {
        const galleryContractId = getContractId(galleryReadClient.contract);
        return {
          scopeKey: `direct:${galleryContractId}`,
          primaryContractId: galleryContractId,
          lineageContractIds: [],
          useDirectRead: true,
          directReadClient: galleryReadClient
        };
      }
      const lineageContractIds = (getContentFallbackClients(state.client) ?? [])
        .map((candidate) => getContractId(candidate.contract));
      return {
        scopeKey: `lineage:${[primaryContractId, ...lineageContractIds].join('>')}`,
        primaryContractId,
        lineageContractIds,
        useDirectRead: false,
        directReadClient: state.client
      };
    };

    const getSummaryScopeCache = (scopeKey, create = true) => {
      if (!scopeKey) {
        return null;
      }
      const existing = state.summaryCacheScopes.get(scopeKey);
      if (existing) {
        if (create) {
          state.summaryCacheScopes.delete(scopeKey);
          state.summaryCacheScopes.set(scopeKey, existing);
        }
        return existing;
      }
      if (!create) {
        return null;
      }
      const cache = new Map();
      state.summaryCacheScopes.set(scopeKey, cache);
      while (state.summaryCacheScopes.size > GRID_SUMMARY_CACHE_MAX_SCOPES) {
        const oldest = state.summaryCacheScopes.keys().next().value;
        state.summaryCacheScopes.delete(oldest);
      }
      return cache;
    };

    const rememberSummaryCache = (scopeKey, summaries) => {
      const cache = getSummaryScopeCache(scopeKey);
      if (!cache) {
        return;
      }
      for (const token of summaries) {
        if (!token || !(token.meta || token.owner || token.svgDataUri)) {
          continue;
        }
        const key = token.id.toString();
        if (cache.has(key)) {
          cache.delete(key);
        }
        cache.set(key, token);
      }
      while (cache.size > GRID_SUMMARY_CACHE_MAX_ENTRIES) {
        const oldest = cache.keys().next().value;
        cache.delete(oldest);
      }
    };

    const primeWalletTokenCacheFromSummaryCache = (ids, options = {}) => {
      const context = getSummaryFetchContext(options);
      const cache = context ? getSummaryScopeCache(context.scopeKey, false) : null;
      if (!cache || options.force === true) {
        return 0;
      }
      let hits = 0;
      for (const id of ids) {
        const key = id.toString();
        if (state.walletTokenCache.has(key)) {
          continue;
        }
        const token = cache.get(key);
        if (token) {
          state.walletTokenCache.set(key, token);
          hits += 1;
        }
      }
      return hits;
    };

    const fetchWalletTokenSummaries = async (ids, options = {}) => {
      const startedAt = performance.now();
      // primaryOnly: read strictly from the active (primary) contract, skipping
      // the legacy fallback. Used by galleries whose token ids live on the
      // primary core but fall within the legacy id range (e.g. v3 #359, which
      // would otherwise be shadowed by the v2 token of the same id).
      const primaryOnly = options.primaryOnly === true;
      // A gallery pinned to a specific core (e.g. v1 origins) reads strictly
      // from that core's client, with no legacy fallback.
      const summaryContext = getSummaryFetchContext(options);
      const directReadClient = summaryContext?.directReadClient ?? state.client;
      const useDirectRead = summaryContext?.useDirectRead ?? primaryOnly;
      const scopeCache = summaryContext
        ? getSummaryScopeCache(summaryContext.scopeKey, false)
        : null;
      const allowSummaryCache = options.force !== true;
      const sender = getReadOnlySenderAddress();
      let legacyMaxId = null;
      // Migrated tokens are held in escrow by the primary (v3) contract, so a
      // legacy token whose owner is the primary contract has moved to v3. Passing
      // this as escrowOwner lets the fallback resolve each id in 1–2 reads (legacy
      // read; primary read only when escrow-owned) instead of pre-fetching the
      // whole primary minted-id set — which grew large and blocked page loads.
      const escrowOwner =
        state.legacyClient && !useDirectRead
          ? getContractId(state.client.contract)
          : null;
      if (state.legacyClient && !useDirectRead) {
        try {
          legacyMaxId = await state.legacyClient.getLastTokenId(sender);
        } catch (error) {
          legacyMaxId = null;
        }
      }
      const visibleIds = [...ids]
        .sort((left, right) => (left < right ? 1 : left > right ? -1 : 0));
      const cachedSummaries = [];
      const cachedSummaryIds = new Set();
      const idsToResolve = [];
      for (const id of visibleIds) {
        const cached = allowSummaryCache ? scopeCache?.get(id.toString()) : null;
        if (cached) {
          cachedSummaries.push(cached);
          cachedSummaryIds.add(id.toString());
        } else {
          idsToResolve.push(id);
        }
      }
      debugLog('readonly', 'token summaries request started', {
        requested: ids.length,
        visibleIds: formatDebugTokenIds(visibleIds),
        cached: cachedSummaries.length,
        resolving: idsToResolve.length,
        summaryScope: summaryContext?.scopeKey ?? null,
        contractId: getContractId(state.contract),
        legacyContractId: state.legacyClient
          ? getContractId(state.legacyClient.contract)
          : null,
        sender: truncateMiddle(sender, 8, 8),
        summaryCacheSize: state.walletTokenCache.size
      });
      // Serve the whole visible page from the D1 index in one round-trip
      // (primary-first across the lineage). Ids the index hasn't synced yet — or
      // SVGs — fall through to the per-token chain path below.
      let indexedSummaries = null;
      if (summaryContext && idsToResolve.length > 0) {
        try {
          indexedSummaries = await fetchIndexedSummaries({
            primaryContractId: summaryContext.primaryContractId,
            lineageContractIds: summaryContext.lineageContractIds,
            ids: idsToResolve
          });
        } catch (error) {
          indexedSummaries = null;
        }
      }
      const resolvedSummaries = await runLimited(idsToResolve, 4, async (id) => {
        try {
          const indexed = indexedSummaries?.get(id.toString());
          if (indexed) {
            return indexed;
          }
          if (state.legacyClient && !useDirectRead) {
            return await fetchTokenSummaryWithFallback({
              primaryClient: state.client,
              legacyClient: state.legacyClient,
              id,
              senderAddress: sender,
              legacyMaxId,
              escrowOwner,
              // Primary-first across the full lineage [v2, v1] so tokens migrated
              // v1->v3 directly (never on v2) still resolve to the primary core.
              lineageClients: getContentFallbackClients(state.client)
            });
          }
          return await fetchTokenSummary({
            client: directReadClient,
            id,
            senderAddress: sender
          });
        } catch (error) {
          debugLog(
            'readonly',
            'token summary fetch failed',
            {
              tokenId: id.toString(),
              contractId: getContractId(state.contract),
              legacyContractId: state.legacyClient
                ? getContractId(state.legacyClient.contract)
                : null,
              error: error instanceof Error ? error.message : String(error)
            },
            'warn'
          );
          return null;
        }
      });
      const resolvedById = new Map();
      for (const token of resolvedSummaries) {
        if (token && (token.meta || token.owner || token.svgDataUri)) {
          resolvedById.set(token.id.toString(), token);
        }
      }
      const cachedById = new Map(
        cachedSummaries
          .filter((token) => !!token && (token.meta || token.owner || token.svgDataUri))
          .map((token) => [token.id.toString(), token])
      );
      const filtered = visibleIds
        .map((id) => cachedById.get(id.toString()) ?? resolvedById.get(id.toString()) ?? null)
        .filter((token) => !!token);
      if (summaryContext) {
        rememberSummaryCache(summaryContext.scopeKey, filtered);
      }
      debugLog('readonly', 'token summaries request finished', {
        requested: ids.length,
        returned: filtered.length,
        cached: cachedSummaryIds.size,
        resolved: resolvedById.size,
        dropped: visibleIds.length - filtered.length,
        returnedIds: filtered.map((token) => token.id.toString()),
        ms: Math.round(performance.now() - startedAt)
      });
      return filtered;
    };

    const refreshExplorerLatestTokenId = async () => {
      const latest = await state.client.getLastTokenId(getReadOnlySenderAddress());
      state.explorerLatestTokenId = latest;
      state.walletUsesPagedHoldings = true;
      state.walletTotalCount =
        latest > BigInt(Number.MAX_SAFE_INTEGER)
          ? Number.MAX_SAFE_INTEGER
          : Number(latest);
      return latest;
    };

    const getExplorerAllTokenIds = () => {
      const latest = state.explorerLatestTokenId;
      if (!latest || latest <= 0n) {
        return [];
      }
      const ids = [];
      for (let id = 1n; id <= latest; id += 1n) {
        ids.push(id);
      }
      return ids;
    };

    const resetExplorerFilterIndexForContract = () => {
      const contractId = getContractId(state.contract);
      if (state.explorerFilterIndexContractId === contractId) {
        return;
      }
      state.explorerFilterIndexContractId = contractId;
      state.explorerFilteredTokenIds = [];
      state.explorerIndexedSummaryIds = new Set();
      state.explorerFilterIndexComplete = false;
      state.explorerFilterBackgroundLoading = false;
    };

    const getExplorerFilteredIdsFromCache = () => {
      const selectedKinds = state.explorerFilterKinds;
      return getExplorerAllTokenIds().filter((id) => {
        const token = state.walletTokenCache.get(id.toString()) ?? null;
        return !!token && selectedKinds.has(getExplorerTokenFilterKind(token));
      });
    };

    const applyExplorerFilteredIdsFromCache = () => {
      state.explorerFilteredTokenIds = getExplorerFilteredIdsFromCache();
      state.walletTotalCount = state.explorerFilteredTokenIds.length;
    };

    const completeExplorerFilterIndexInBackground = (runId) => {
      if (
        state.explorerFilterBackgroundLoading ||
        state.explorerFilterIndexComplete ||
        !hasActiveExplorerFilters()
      ) {
        return;
      }
      state.explorerFilterBackgroundLoading = true;
      void (async () => {
        const allIds = getExplorerAllTokenIds();
        const missingIds = allIds.filter(
          (id) => !state.explorerIndexedSummaryIds.has(id.toString())
        );
        for (let index = 0; index < missingIds.length; index += EXPLORER_FILTER_INDEX_CHUNK_SIZE) {
          if (runId !== state.explorerFilterIndexRunId) {
            return;
          }
          const chunk = missingIds.slice(index, index + EXPLORER_FILTER_INDEX_CHUNK_SIZE);
          const summaries = await fetchWalletTokenSummaries(chunk);
          if (runId !== state.explorerFilterIndexRunId) {
            return;
          }
          chunk.forEach((id) => {
            state.explorerIndexedSummaryIds.add(id.toString());
          });
          for (const token of summaries) {
            state.walletTokenCache.set(token.id.toString(), token);
          }
          await sleep(0);
        }
        if (runId !== state.explorerFilterIndexRunId) {
          return;
        }
        state.explorerFilterIndexComplete = true;
        applyExplorerFilteredIdsFromCache();
        if (state.explorerFollowLatestFiltered) {
          state.walletPageIndex = getExplorerLatestPageIndex();
          await loadExplorerPage({ selectLatestOnPage: true, skipFilterIndex: true });
        } else {
          clampWalletPageIndex();
          state.walletPageIds = getExplorerPageIds();
          renderTokenGrid();
          updateWalletPagerControls();
          updateExplorerStatus();
        }
      })().finally(() => {
        if (runId === state.explorerFilterIndexRunId) {
          state.explorerFilterBackgroundLoading = false;
          updateControls();
          updateExplorerStatus();
        }
      });
    };

    const ensureExplorerFilterIndex = async (options = {}) => {
      if (!hasActiveExplorerFilters()) {
        state.explorerFilteredTokenIds = [];
        state.explorerFilterIndexComplete = false;
        return true;
      }
      if (!state.explorerLatestTokenId) {
        await refreshExplorerLatestTokenId();
      }
      resetExplorerFilterIndexForContract();
      const runId = ++state.explorerFilterIndexRunId;
      const allIds = getExplorerAllTokenIds();
      const missingIds = allIds.filter(
        (id) => !state.explorerIndexedSummaryIds.has(id.toString())
      );
      if (missingIds.length === 0) {
        state.explorerFilterIndexComplete = true;
        applyExplorerFilteredIdsFromCache();
        return true;
      }
      state.explorerFilterIndexLoading = true;
      updateControls();
      if (missingIds.length > 0) {
        setWalletCountLabel('filtering');
        renderTokenGridPlaceholders('...');
      }
      const scanIds = options.preferLatest ? [...missingIds].reverse() : missingIds;

      try {
        for (let index = 0; index < scanIds.length; index += EXPLORER_FILTER_INDEX_CHUNK_SIZE) {
          if (runId !== state.explorerFilterIndexRunId) {
            return false;
          }
          const chunk = scanIds.slice(index, index + EXPLORER_FILTER_INDEX_CHUNK_SIZE);
          setStatus(
            dom.walletGridStatus,
            `<strong>Grid</strong> indexing ${index + 1}-${Math.min(index + chunk.length, scanIds.length)} of ${scanIds.length} unchecked inscriptions`,
            'filter',
            'blue'
          );
          const summaries = await fetchWalletTokenSummaries(chunk);
          if (runId !== state.explorerFilterIndexRunId) {
            return false;
          }
          chunk.forEach((id) => {
            state.explorerIndexedSummaryIds.add(id.toString());
          });
          for (const token of summaries) {
            state.walletTokenCache.set(token.id.toString(), token);
          }
          applyExplorerFilteredIdsFromCache();
          if (
            options.allowPartial &&
            state.explorerFilteredTokenIds.length >= (options.minMatches ?? WALLET_PAGE_SIZE)
          ) {
            state.explorerFilterIndexComplete = false;
            state.walletTotalCount = state.explorerFilteredTokenIds.length;
            completeExplorerFilterIndexInBackground(runId);
            return true;
          }
          await sleep(0);
        }

        state.explorerFilterIndexComplete = true;
        applyExplorerFilteredIdsFromCache();
        return true;
      } finally {
        if (runId === state.explorerFilterIndexRunId) {
          state.explorerFilterIndexLoading = false;
          updateControls();
        }
      }
    };

    const getExplorerPageIds = () => {
      if (hasActiveExplorerFilters()) {
        if (!state.explorerFilterIndexComplete) {
          return state.explorerFilteredTokenIds.slice(-WALLET_PAGE_SIZE);
        }
        clampWalletPageIndex();
        const start = state.walletPageIndex * WALLET_PAGE_SIZE;
        return state.explorerFilteredTokenIds.slice(start, start + WALLET_PAGE_SIZE);
      }
      const latest = state.explorerLatestTokenId;
      if (!latest || latest <= 0n) {
        return [];
      }
      clampWalletPageIndex();
      const start = BigInt(state.walletPageIndex * WALLET_PAGE_SIZE) + 1n;
      if (start > latest) {
        return [];
      }
      const end = start + BigInt(WALLET_PAGE_SIZE - 1) > latest
        ? latest
        : start + BigInt(WALLET_PAGE_SIZE - 1);
      const ids = [];
      for (let id = start; id <= end; id += 1n) {
        ids.push(id);
      }
      return ids;
    };

    const getExplorerTokenPageIndex = (tokenId) => {
      if (hasActiveExplorerFilters()) {
        const filteredIndex = state.explorerFilteredTokenIds.findIndex((id) => id === tokenId);
        return filteredIndex >= 0 ? Math.floor(filteredIndex / WALLET_PAGE_SIZE) : null;
      }
      const latest = state.explorerLatestTokenId;
      if (!latest || tokenId <= 0n || tokenId > latest) {
        return null;
      }
      const index = (tokenId - 1n) / BigInt(WALLET_PAGE_SIZE);
      return index > BigInt(Number.MAX_SAFE_INTEGER)
        ? null
        : Number(index);
    };

    const getExplorerLatestPageIndex = () => {
      if (hasActiveExplorerFilters() && !state.explorerFilterIndexComplete) {
        return 0;
      }
      const pageCount = getWalletPageCount();
      return pageCount > 0 ? pageCount - 1 : 0;
    };

    const updateExplorerStatus = () => {
      if (!state.explorerMode || !dom.xtrataExplorerStatus) {
        return;
      }
      const latest = state.explorerLatestTokenId;
      const pageCount = getWalletPageCount();
      const filterLabel = getExplorerFilterLabel();
      if (!latest || latest <= 0n) {
        dom.xtrataExplorerStatus.textContent =
          'No inscriptions have been found for this contract yet.';
        return;
      }
      if (hasActiveExplorerFilters()) {
        if (!state.explorerFilterIndexComplete) {
          dom.xtrataExplorerStatus.textContent =
            `${filterLabel}: showing ${state.walletTotalCount} newest match${state.walletTotalCount === 1 ? '' : 'es'} while the full filter index completes.`;
          return;
        }
        dom.xtrataExplorerStatus.textContent =
          `${filterLabel}: ${state.walletTotalCount} matching inscription${state.walletTotalCount === 1 ? '' : 's'}. Latest #${latest.toString()}. Page ${pageCount === 0 ? 0 : state.walletPageIndex + 1} of ${pageCount}.`;
        return;
      }
      dom.xtrataExplorerStatus.textContent =
        `Latest inscription #${latest.toString()}. Page ${state.walletPageIndex + 1} of ${pageCount}.`;
    };

    const syncExplorerPageUrl = () => {
      // Keep the address bar shareable: token selections write /x/<id> (see
      // selectToken); plain grid pages write /xplorer?p=<n> so copied links and
      // reload/back restore the position.
      if (!state.explorerMode || state.selectedTokenId !== null) {
        return;
      }
      try {
        const url = new URL(window.location.href);
        url.pathname = '/xplorer';
        url.search = state.walletPageIndex > 0 ? `?p=${state.walletPageIndex + 1}` : '';
        url.hash = '';
        window.history.replaceState(null, '', url.toString());
      } catch {
        // Leave the URL untouched if history access fails.
      }
    };

    const prefetchAdjacentExplorerPages = () => {
      // Warm the summary cache for the neighbouring pages while the browser is
      // idle so Prev/Next feel instant. Unfiltered explorer only — filtered id
      // sets already live in memory once indexed.
      if (!state.explorerMode || hasActiveExplorerFilters()) {
        return;
      }
      const latest = state.explorerLatestTokenId;
      if (!latest || latest <= 0n) {
        return;
      }
      const idle = window.requestIdleCallback || ((fn) => window.setTimeout(fn, 1200));
      idle(() => {
        if (!state.explorerMode || state.walletLoadingPage) {
          return;
        }
        const pageCount = getWalletPageCount();
        const ids = [];
        for (const pageIndex of [state.walletPageIndex + 1, state.walletPageIndex - 1]) {
          if (pageIndex < 0 || pageIndex >= pageCount) {
            continue;
          }
          const start = BigInt(pageIndex * WALLET_PAGE_SIZE) + 1n;
          if (start > latest) {
            continue;
          }
          const end =
            start + BigInt(WALLET_PAGE_SIZE - 1) > latest
              ? latest
              : start + BigInt(WALLET_PAGE_SIZE - 1);
          for (let id = start; id <= end; id += 1n) {
            if (!state.walletTokenCache.has(id.toString())) {
              ids.push(id);
            }
          }
        }
        if (ids.length === 0) {
          return;
        }
        void fetchWalletTokenSummaries(ids)
          .then((summaries) => {
            for (const token of summaries) {
              state.walletTokenCache.set(token.id.toString(), token);
            }
            debugLog('grid', 'adjacent explorer pages prefetched', {
              prefetched: summaries.length
            });
          })
          .catch(() => {
            // Prefetch is best-effort; the normal load path handles errors.
          });
      });
    };

    const loadExplorerPage = async (options = {}) => {
      const startedAt = performance.now();
      const homeLatest = !!options.homeLatest;
      state.explorerMode = !homeLatest;
      state.homeLatestView = homeLatest;
      state.walletViewAddress = null;
      state.walletViewName = null;
      state.curatedGalleryId = null;
      state.curatedGalleryTitle = null;
      state.walletUsesPagedHoldings = true;
      state.walletTokenIds = [];
      debugLog('grid', 'explorer page load started', {
        options: formatDebugOptions(options),
        contractId: getContractId(state.contract),
        requestedPageIndex: state.walletPageIndex,
        selectedTokenId: state.selectedTokenId?.toString() ?? null,
        latestTokenId: state.explorerLatestTokenId?.toString() ?? null,
        filters: getExplorerFilterLabel()
      });

      if (!state.explorerLatestTokenId || options.refreshLatest) {
        setStatus(dom.walletGridStatus, '<strong>Grid</strong> loading latest inscriptions', 'loading', 'blue');
        renderTokenGridPlaceholders('...');
        await refreshExplorerLatestTokenId();
        debugLog('grid', 'explorer latest token resolved', {
          latestTokenId: state.explorerLatestTokenId?.toString() ?? null,
          totalCount: state.walletTotalCount,
          ms: Math.round(performance.now() - startedAt)
        });
      }

      if (hasActiveExplorerFilters()) {
        if (!options.skipFilterIndex) {
          state.explorerFollowLatestFiltered = !!options.selectLatestOnPage;
          const indexed = await ensureExplorerFilterIndex({
            preferLatest: !!options.selectLatestOnPage,
            allowPartial: !!options.selectLatestOnPage,
            minMatches: WALLET_PAGE_SIZE
          });
          if (!indexed) {
            debugLog('grid', 'explorer page load stopped while indexing filters', {
              options: formatDebugOptions(options),
              filters: getExplorerFilterLabel(),
              ms: Math.round(performance.now() - startedAt)
            });
            return;
          }
        } else {
          state.explorerFollowLatestFiltered = !!options.selectLatestOnPage;
        }
      } else {
        state.explorerFilteredTokenIds = [];
        state.walletTotalCount =
          state.explorerLatestTokenId > BigInt(Number.MAX_SAFE_INTEGER)
            ? Number.MAX_SAFE_INTEGER
            : Number(state.explorerLatestTokenId ?? 0n);
      }

      if (hasActiveExplorerFilters() && options.selectLatestOnPage) {
        state.walletPageIndex = getExplorerLatestPageIndex();
      }

      clampWalletPageIndex();
      state.walletPageIds = getExplorerPageIds();
      debugLog('grid', 'explorer page ids resolved', {
        ...getGridDebugContext(state.walletPageIds),
        options: formatDebugOptions(options)
      });
      state.walletLoadingPage = true;
      resetBackgroundThumbnailHydration();
      updateControls();
      updateWalletPagerControls();
      updateFullscreenControls();
      updateExplorerStatus();

      // Everything below runs under one try/finally: a thrown error anywhere
      // in the page load must never strand walletLoadingPage=true, which used
      // to grey out Prev/Next (and the jump controls) until a full reload.
      let pageIds = [];
      try {
      if (state.walletPageIds.length === 0) {
        state.walletTokens = [];
        state.selectedTokenId = null;
        void closeFullscreenViewer();
        void updateWalletTokenUriHeadPreview(null);
        clearElement(dom.tokenPreviewMedia, 'No selection');
        renderNoSelectedInscriptionMeta();
        setStatus(
          dom.walletGridStatus,
          hasActiveExplorerFilters()
            ? '<strong>Grid</strong> no matches for selected filters'
            : '<strong>Grid</strong> no inscriptions found',
          'empty',
          'amber'
        );
        renderTokenGrid();
        debugLog('grid', 'explorer page load finished empty', {
          ...getGridDebugContext(state.walletPageIds),
          options: formatDebugOptions(options),
          ms: Math.round(performance.now() - startedAt)
        });
        return;
      }

      setStatus(
        dom.walletGridStatus,
        hasActiveExplorerFilters()
          ? state.explorerFilterIndexComplete
            ? `<strong>Grid</strong> ${state.walletTotalCount} ${getExplorerFilterLabel().toLowerCase()} match${state.walletTotalCount === 1 ? '' : 'es'}`
            : `<strong>Grid</strong> showing newest ${getExplorerFilterLabel().toLowerCase()} matches`
          : `<strong>Grid</strong> ${state.walletTotalCount} inscription${state.walletTotalCount === 1 ? '' : 's'} available`,
        'ready',
        'blue'
      );

      pageIds = getWalletPageIds();
      const primedSummaries = primeWalletTokenCacheFromSummaryCache(pageIds, {
        force: !!options.force
      });
      if (primedSummaries > 0) {
        debugLog('grid', 'explorer page summary cache primed', {
          primed: primedSummaries,
          pageIds: formatDebugTokenIds(pageIds),
          summaryCacheSize: state.walletTokenCache.size
        });
      }
      const missingIds = pageIds.filter((id) => !state.walletTokenCache.has(id.toString()));
      debugLog('grid', 'explorer page summary cache checked', {
        ...getGridDebugContext(pageIds),
        missingIds: formatDebugTokenIds(missingIds),
        force: !!options.force
      });
      renderTokenGrid();

        if (missingIds.length > 0 || options.force) {
          const idsToFetch = options.force ? pageIds : missingIds;
          const summaries = await fetchWalletTokenSummaries(idsToFetch, {
            force: !!options.force
          });
          for (const token of summaries) {
            state.walletTokenCache.set(token.id.toString(), token);
          }
          debugLog('grid', 'explorer page summaries stored', {
            requestedIds: formatDebugTokenIds(idsToFetch),
            returnedIds: summaries.map((token) => token.id.toString()),
            summaryCacheSize: state.walletTokenCache.size
          });
        } else {
          debugLog('grid', 'explorer page reused summary cache', {
            pageIds: formatDebugTokenIds(pageIds),
            summaryCacheSize: state.walletTokenCache.size
          });
        }

        state.walletTokens = pageIds
          .map((id) => state.walletTokenCache.get(id.toString()) ?? null)
          .filter((token) => !!token);
        renderTokenGrid({ deferHydration: !!options.deferHydration });

        if (!options.deferSelection) {
          const requestedId = options.selectTokenId ?? null;
          const currentId =
            state.selectedTokenId !== null &&
            pageIds.some((id) => id === state.selectedTokenId) &&
            state.walletTokenCache.has(state.selectedTokenId.toString())
              ? state.selectedTokenId
              : null;
          const selectedId =
            requestedId !== null &&
            pageIds.some((id) => id === requestedId) &&
            state.walletTokenCache.has(requestedId.toString())
              ? requestedId
              : currentId ??
                (options.selectLatestOnPage
                  ? state.walletTokens[state.walletTokens.length - 1]?.id
                  : state.walletTokens[0]?.id) ??
                null;

          if (selectedId !== null) {
            await selectToken(selectedId, { scrollToPreview: !!options.scrollToPreview });
          } else {
            clearSelectedTokenPreview();
          }
        }
      } finally {
        state.walletLoadingPage = false;
        updateControls();
        updateWalletPagerControls();
        updateFullscreenControls();
        updateExplorerStatus();
        debugLog('grid', 'explorer page load finished', {
          ...getGridDebugContext(pageIds),
          options: formatDebugOptions(options),
          ms: Math.round(performance.now() - startedAt)
        });
        if (state.explorerMode && !options.homeLatest) {
          syncExplorerPageUrl();
          prefetchAdjacentExplorerPages();
        }
      }
    };

    const loadWalletPage = async (options = {}) => {
      if (state.explorerMode) {
        await loadExplorerPage(options);
        return;
      }
      const viewingAddress = getViewingWalletAddress();
      if (!viewingAddress) {
        return;
      }
      const startedAt = performance.now();
      clampWalletPageIndex();
      debugLog('grid', 'wallet page load started', {
        options: formatDebugOptions(options),
        wallet: truncateMiddle(viewingAddress, 8, 8),
        requestedPageIndex: state.walletPageIndex,
        usesPagedHoldings: state.walletUsesPagedHoldings,
        totalCount: state.walletUsesPagedHoldings
          ? state.walletTotalCount
          : state.walletTokenIds.length,
        summaryCacheSize: state.walletTokenCache.size
      });
      resetBackgroundThumbnailHydration();
      state.walletLoadingPage = true;
      updateWalletPagerControls();
      updateFullscreenControls();
      // One try/finally for the whole load — see loadExplorerPage: an error must
      // never strand walletLoadingPage=true (stuck greyed-out pager buttons).
      let pageIds = [];
      try {
      if (state.walletUsesPagedHoldings && !options.pageAlreadyLoaded) {
        try {
          const contractId = getContractId(state.contract);
          const contractIds = state.legacyContract
            ? [contractId, getContractId(state.legacyContract)]
            : [contractId];
          const page = await fetchWalletHoldingsPage({
            network: state.contract.network,
            walletAddress: viewingAddress,
            contractIds,
            pageIndex: state.walletPageIndex
          });
          state.walletTotalCount = page.total;
          state.walletPageIds = page.ids;
          debugLog('grid', 'wallet holdings page applied', {
            ...getGridDebugContext(state.walletPageIds),
            sourceBase: summarizeApiBase(page.sourceBase)
          });
        } catch (error) {
          debugLog('grid', 'wallet page holdings request failed', {
            options: formatDebugOptions(options),
            wallet: truncateMiddle(viewingAddress, 8, 8),
            error: error instanceof Error ? error.message : String(error),
            ms: Math.round(performance.now() - startedAt)
          }, 'warn');
          throw error;
        }
      }

      pageIds = getWalletPageIds();
      debugLog('grid', 'wallet page ids resolved', {
        ...getGridDebugContext(pageIds),
        options: formatDebugOptions(options)
      });
      if (pageIds.length === 0) {
        state.walletTokens = [];
        state.selectedTokenId = null;
        void closeFullscreenViewer();
        void updateWalletTokenUriHeadPreview(null);
        renderTokenGrid();
        debugLog('grid', 'wallet page load finished empty', {
          ...getGridDebugContext(pageIds),
          options: formatDebugOptions(options),
          ms: Math.round(performance.now() - startedAt)
        });
        return;
      }

      const primedSummaries = primeWalletTokenCacheFromSummaryCache(pageIds, {
        force: !!options.force
      });
      if (primedSummaries > 0) {
        debugLog('grid', 'wallet page summary cache primed', {
          primed: primedSummaries,
          pageIds: formatDebugTokenIds(pageIds),
          summaryCacheSize: state.walletTokenCache.size
        });
      }
      const missingIds = pageIds.filter((id) => !state.walletTokenCache.has(id.toString()));
      debugLog('grid', 'wallet page summary cache checked', {
        ...getGridDebugContext(pageIds),
        missingIds: formatDebugTokenIds(missingIds),
        force: !!options.force
      });
      renderTokenGrid({ deferHydration: !!options.deferHydration });

        if (missingIds.length > 0 || options.force) {
          const idsToFetch = options.force ? pageIds : missingIds;
          const summaries = await fetchWalletTokenSummaries(idsToFetch, {
            force: !!options.force
          });
          for (const token of summaries) {
            state.walletTokenCache.set(token.id.toString(), token);
          }
          debugLog('grid', 'wallet page summaries stored', {
            requestedIds: formatDebugTokenIds(idsToFetch),
            returnedIds: summaries.map((token) => token.id.toString()),
            summaryCacheSize: state.walletTokenCache.size
          });
        } else {
          debugLog('grid', 'wallet page reused summary cache', {
            pageIds: formatDebugTokenIds(pageIds),
            summaryCacheSize: state.walletTokenCache.size
          });
        }
        state.walletTokens = pageIds
          .map((id) => state.walletTokenCache.get(id.toString()) ?? null)
          .filter((token) => !!token);
        renderTokenGrid({ deferHydration: !!options.deferHydration });
        if (
          state.walletTokens.length > 0 &&
          !options.deferSelection &&
          (!state.selectedTokenId ||
            !state.walletTokens.some((token) => token.id === state.selectedTokenId))
        ) {
          void selectToken(state.walletTokens[0].id);
        }
      } finally {
        state.walletLoadingPage = false;
        updateWalletPagerControls();
        updateFullscreenControls();
        debugLog('grid', 'wallet page load finished', {
          ...getGridDebugContext(pageIds),
          options: formatDebugOptions(options),
          ms: Math.round(performance.now() - startedAt)
        });
      }
    };

    const loadWalletInscriptions = async (options = {}) => {
      // In Xplorer (explorer mode) the grid defaults to the global latest feed —
      // BUT an explicit wallet lookup must take precedence, otherwise submitting a
      // name/address in the "View wallet" box just reloaded the latest feed and the
      // requested wallet never appeared (it only worked once explorer mode had been
      // left). When a wallet is being viewed, fall through and load its holdings;
      // clearing the lookup (walletViewAddress → null) returns to the default feed.
      if (state.explorerMode && !state.walletViewAddress) {
        await loadExplorerPage({ refreshLatest: true, force: true });
        return;
      }
      const viewingAddress = getViewingWalletAddress();
      if (!viewingAddress) {
        state.walletMarketListings = {
          address: null,
          listings: [],
          requestId: (state.walletMarketListings.requestId ?? 0) + 1
        };
        renderWalletMarketListings();
        state.walletTokenIds = [];
        state.walletPageIds = [];
        state.walletTotalCount = 0;
        state.walletUsesPagedHoldings = false;
        state.walletTokenCache = new Map();
        state.walletTokens = [];
        state.walletPageIndex = 0;
        state.selectedTokenId = null;
        void closeFullscreenViewer();
        void updateWalletTokenUriHeadPreview(null);
        resetBackgroundThumbnailHydration();
        revokeGridThumbUrls();
        setWalletCountLabel(0);
        setStatus(
          dom.walletGridStatus,
          '<strong>Grid</strong> enter a wallet address or connect',
          'empty',
          'amber'
        );
        renderTokenGridPlaceholders();
        updateWalletPagerControls();
        setExperienceMode();
        updateTransferControls();
        return;
      }

      // Market escrow is still seller-controlled ownership. Load it alongside
      // direct NFT holdings so a listed inscription never disappears from the
      // seller's My Wallet view.
      void refreshWalletMarketListings(viewingAddress);

      setStatus(dom.walletGridStatus, '<strong>Grid</strong> loading wallet holdings', 'loading', 'blue');
      renderTokenGridPlaceholders('...');
      state.walletTokenIds = [];
      state.walletPageIds = [];
      state.walletTotalCount = 0;
      state.walletUsesPagedHoldings = false;
      state.walletTokenCache = new Map();
      state.walletTokens = [];
      state.walletPageIndex = 0;
      state.selectedTokenId = null;
      void closeFullscreenViewer();
      void updateWalletTokenUriHeadPreview(null);
      resetBackgroundThumbnailHydration();
      revokeGridThumbUrls();
      updateWalletPagerControls();

      try {
        const contractId = getContractId(state.contract);
        const contractIds = state.legacyContract
          ? [contractId, getContractId(state.legacyContract)]
          : [contractId];
        try {
          const firstPage = await fetchWalletHoldingsPage({
            network: state.contract.network,
            walletAddress: viewingAddress,
            contractIds,
            pageIndex: 0
          });
          state.walletUsesPagedHoldings = true;
          state.walletTotalCount = firstPage.total;
          state.walletPageIds = firstPage.ids;
          rememberConnectedWalletResult(viewingAddress, state.walletTotalCount);
          setExperienceMode();
          appendLog(
            `Hiro holdings page loaded: ${firstPage.ids.length}/${firstPage.total} visible.`
          );
          if (state.walletTotalCount === 0) {
            setStatus(dom.walletGridStatus, '<strong>Grid</strong> no inscriptions found', 'empty', 'amber');
            clearElement(dom.tokenPreviewMedia, 'No selection');
            renderNoSelectedInscriptionMeta();
            void updateWalletTokenUriHeadPreview(null);
            renderTokenGrid();
            setExperienceMode();
            // A wallet with no Xtrata holdings may still have escrowed twins
            // (it holds the original Pepe/Leo). Surface those if present.
            void refreshEscrowTwinInjection(viewingAddress);
            return;
          }
          setStatus(
            dom.walletGridStatus,
            `<strong>Grid</strong> ${state.walletTotalCount} inscription${state.walletTotalCount === 1 ? '' : 's'} available`,
            'ready',
            'blue'
          );
          await loadWalletPage({
            pageAlreadyLoaded: true,
            deferSelection: !!options.deferSelection,
            deferHydration: !!options.deferHydration
          });
          // Surface any Forever Twins escrowed on behalf of this wallet.
          void refreshEscrowTwinInjection(viewingAddress);
          return;
        } catch (pageError) {
          state.walletUsesPagedHoldings = false;
          state.walletTotalCount = 0;
          state.walletPageIds = [];
          appendLog(
            `Paged Hiro holdings unavailable; trying cached holdings fallback. ${
              pageError instanceof Error ? pageError.message : String(pageError)
            }`
          );
        }

        const holdings = await loadWalletHoldingsIndex({
          network: state.contract.network,
          walletAddress: viewingAddress,
          contractIds,
          maxIds: Number.MAX_SAFE_INTEGER
        });

        let ids = holdings?.tokenIds ?? [];
        if (ids.length === 0) {
          const last = await state.client.getLastTokenId(getReadOnlySenderAddress());
          const scanLimit = BigInt(WALLET_FALLBACK_SCAN_LIMIT);
          const start = last > scanLimit ? last - scanLimit : 0n;
          const scanIds = [];
          for (let id = last; id >= start; id -= 1n) {
            scanIds.push(id);
            if (id === 0n) {
              break;
            }
          }
          const summaries = await fetchWalletTokenSummaries(scanIds);
          const ownedSummaries = summaries.filter((token) =>
            addressesEqual(token.owner, viewingAddress)
          );
          for (const token of ownedSummaries) {
            state.walletTokenCache.set(token.id.toString(), token);
          }
          state.walletTokenIds = ownedSummaries
            .map((token) => token.id)
            .sort((left, right) => (left < right ? 1 : left > right ? -1 : 0));
          if (state.walletTokenIds.length > 0) {
            appendLog(
              `Wallet holdings index unavailable; scanned the latest ${scanIds.length} token IDs.`
            );
          }
        } else {
          ids = ids.sort((left, right) => (left < right ? 1 : left > right ? -1 : 0));
          state.walletTokenIds = ids;
        }

        rememberConnectedWalletResult(viewingAddress, state.walletTokenIds.length);
        setExperienceMode();
        if (state.walletTokenIds.length === 0) {
          setStatus(dom.walletGridStatus, '<strong>Grid</strong> no inscriptions found', 'empty', 'amber');
          clearElement(dom.tokenPreviewMedia, 'No selection');
          renderNoSelectedInscriptionMeta();
          void updateWalletTokenUriHeadPreview(null);
          renderTokenGrid();
        } else {
          setStatus(
            dom.walletGridStatus,
            `<strong>Grid</strong> ${state.walletTokenIds.length} inscription${state.walletTokenIds.length === 1 ? '' : 's'} available`,
            'ready',
            'blue'
          );
          await loadWalletPage({
            deferSelection: !!options.deferSelection,
            deferHydration: !!options.deferHydration
          });
        }
        void refreshEscrowTwinInjection(viewingAddress);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        state.walletTokenIds = [];
        state.walletPageIds = [];
        state.walletTotalCount = 0;
        state.walletUsesPagedHoldings = false;
        state.walletTokenCache = new Map();
        state.walletTokens = [];
        state.walletPageIndex = 0;
        state.selectedTokenId = null;
        void closeFullscreenViewer();
        void updateWalletTokenUriHeadPreview(null);
        resetBackgroundThumbnailHydration();
        revokeGridThumbUrls();
        setStatus(dom.walletGridStatus, `<strong>Grid</strong> ${message}`, 'error', 'rose');
        appendLog(`Wallet load failed: ${message}`);
        renderTokenGridPlaceholders();
        updateWalletPagerControls();
      }
    };

    const connectWallet = async () => {
      setBusy(true);
      try {
        state.walletSession = await walletAdapter.connect();
        if (PAGE_MODE === 'drops') {
          renderDrops();
        }
        refreshConnectedWalletMatureMode();
        appendLog(state.walletSession.address ? `Wallet connected: ${truncateMiddle(state.walletSession.address)}` : 'Wallet connection cancelled.');
        updateWalletStatus();
        await fetchAdminStatus();
        await refreshParentChecks();
        if (state.prepared) {
          await refreshUploadState(state.prepared.expectedHash);
          renderPreparedState();
        }
        await loadWalletInscriptions();
        if (PAGE_MODE === 'market') {
          renderMarketListings();
          renderSellerDashboard();
        }
        if (PAGE_MODE === 'home' && state.walletSession.isConnected && state.walletSession.address) {
          // A wallet that connects on the landing page and holds inscriptions
          // goes straight to its ledger on the My Wallet page.
          const holdingCount =
            (state.walletUsesPagedHoldings
              ? state.walletTotalCount
              : state.walletTokenIds.length) + getInjectedEscrowTwinIds().length;
          if (holdingCount > 0) {
            appendLog('Opening My Wallet with your inscriptions…');
            window.history.pushState(null, '', '/my-wallet');
            void switchToPage('my-wallet');
            return;
          }
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        appendLog(`Wallet connect failed: ${message}`);
        setStatus(dom.walletStatus, `<strong>Wallet error</strong> ${message}`, 'error', 'rose');
      } finally {
        setBusy(false);
        updateControls();
        // The text inscribe button isn't covered by updateControls — re-enable it on connect.
        if (dom.inscribeTextButton && dom.inscribePanelBody?.dataset.mode === 'text') {
          const b = new TextEncoder().encode(dom.textPayload?.value || '').length;
          dom.inscribeTextButton.disabled = !(b > 0 && b <= 16384 && !state.busy);
        }
      }
    };

    const disconnectWallet = async () => {
      setBusy(true);
      try {
        await walletAdapter.disconnect();
        state.walletSession = walletAdapter.getSession();
        if (PAGE_MODE === 'drops') {
          // Drop actions depend on the active principal. Replace an owner's
          // reclaim action as soon as that session ends, before slower wallet
          // and admin refreshes complete.
          renderDrops();
        }
        state.walletTokenIds = [];
        state.walletPageIds = [];
        state.walletTotalCount = 0;
        state.walletUsesPagedHoldings = false;
        state.walletTokenCache = new Map();
        state.walletTokens = [];
        state.walletPageIndex = 0;
        state.selectedTokenId = null;
        state.connectedWalletMatureMode = false;
        void updateWalletTokenUriHeadPreview(null);
        revokeGridThumbUrls();
        state.uploadState = null;
        appendLog('Wallet disconnected.');
        updateWalletStatus();
        await fetchAdminStatus();
        await refreshParentChecks();
        await loadWalletInscriptions();
        if (PAGE_MODE === 'market') {
          renderMarketListings();
          renderSellerDashboard();
        }
        renderPreparedState();
      } finally {
        setBusy(false);
        updateControls();
      }
    };

    const setExplorerModeFromRequest = () => {
      const request = getExplorerRequest();
      if (!request.enabled) {
        return;
      }
      state.explorerMode = true;
      state.explorerInitialTokenId = request.tokenId;
      state.contract = request.contract ?? DEFAULT_CONTRACT;
    };

    const loadExplorerMode = async () => {
      state.explorerMode = true;
      state.homeLatestView = false;
      state.walletLookupNotice = null;
      state.walletViewAddress = null;
      state.walletViewName = null;
      state.curatedGalleryId = null;
      state.curatedGalleryTitle = null;
      clearExampleDescription();
      clearSelectedTokenPreview();
      updateWalletStatus();
      setStatus(dom.walletGridStatus, '<strong>Grid</strong> loading latest inscriptions', 'loading', 'blue');
      renderTokenGridPlaceholders('...');

      try {
        await refreshExplorerLatestTokenId();
        const requestedTokenId = state.explorerInitialTokenId;
        let initialSelectTokenId = null;
        if (requestedTokenId !== null) {
          const pageIndex = getExplorerTokenPageIndex(requestedTokenId);
          if (pageIndex !== null) {
            state.walletPageIndex = pageIndex;
            initialSelectTokenId = requestedTokenId;
          } else {
            state.walletPageIndex = getExplorerLatestPageIndex();
            appendLog(
              `Inscription #${requestedTokenId.toString()} is outside this contract range. Showing latest inscriptions.`
            );
          }
        } else {
          // Shareable page position: /xplorer?p=12 opens straight onto page 12.
          const requestedPage = Number.parseInt(
            new URLSearchParams(window.location.search).get('p') ?? '',
            10
          );
          const pageCount = getWalletPageCount();
          state.walletPageIndex =
            Number.isSafeInteger(requestedPage) && requestedPage >= 1 && pageCount > 0
              ? Math.min(requestedPage - 1, pageCount - 1)
              : getExplorerLatestPageIndex();
        }
        await loadExplorerPage({
          selectTokenId: initialSelectTokenId,
          scrollToPreview: initialSelectTokenId !== null,
          selectLatestOnPage: initialSelectTokenId === null
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        state.walletPageIds = [];
        state.walletTokens = [];
        setStatus(dom.walletGridStatus, `<strong>Grid</strong> ${message}`, 'error', 'rose');
        renderTokenGridPlaceholders();
        appendLog(`Explorer load failed: ${message}`);
      } finally {
        updateControls();
      }
    };

    const jumpToExplorerPage = async () => {
      if (!state.explorerMode || state.walletLoadingPage) {
        return;
      }
      debugLog('grid', 'explorer page jump requested', {
        pageInput: dom.explorerPageInput.value,
        tokenInput: dom.explorerTokenInput.value,
        currentPageIndex: state.walletPageIndex,
        pageCount: getWalletPageCount(),
        filters: getExplorerFilterLabel()
      });
      if (hasActiveExplorerFilters()) {
        const indexed = await ensureExplorerFilterIndex();
        if (!indexed) {
          return;
        }
      }
      const pageCount = getWalletPageCount();
      const requestedPage = Number.parseInt(dom.explorerPageInput.value, 10);
      if (!Number.isSafeInteger(requestedPage) || requestedPage < 1 || requestedPage > pageCount) {
        setStatus(
          dom.walletGridStatus,
          `<strong>Grid</strong> enter a page from 1 to ${pageCount || 1}`,
          'wait',
          'amber'
        );
        return;
      }
      state.walletPageIndex = requestedPage - 1;
      dom.explorerTokenInput.value = '';
      await loadExplorerPage();
      scrollToWalletGrid();
    };

    const jumpToExplorerToken = async () => {
      if (!state.explorerMode || state.walletLoadingPage) {
        return;
      }
      debugLog('grid', 'explorer token jump requested', {
        tokenInput: dom.explorerTokenInput.value,
        currentPageIndex: state.walletPageIndex,
        latestTokenId: state.explorerLatestTokenId?.toString() ?? null,
        filters: getExplorerFilterLabel()
      });
      if (!state.explorerLatestTokenId) {
        await refreshExplorerLatestTokenId();
      }
      if (hasActiveExplorerFilters()) {
        const indexed = await ensureExplorerFilterIndex();
        if (!indexed) {
          return;
        }
      }
      const tokenId = parsePositiveBigInt(dom.explorerTokenInput.value);
      if (tokenId === null) {
        await jumpToExplorerPage();
        return;
      }
      const pageIndex = getExplorerTokenPageIndex(tokenId);
      if (pageIndex === null) {
        setStatus(
          dom.walletGridStatus,
          hasActiveExplorerFilters()
            ? `<strong>Grid</strong> that inscription is not in the selected filters`
            : `<strong>Grid</strong> enter an inscription from 1 to ${state.explorerLatestTokenId?.toString() ?? '1'}`,
          'wait',
          'amber'
        );
        return;
      }
      state.walletPageIndex = pageIndex;
      await loadExplorerPage({ selectTokenId: tokenId, scrollToPreview: true });
    };

    const handleExplorerJump = async () => {
      if (!state.explorerMode) {
        return;
      }
      // Smart field: "512" / "#512" → inscription id, "p12" / "page 12" → page.
      const raw = dom.explorerTokenInput.value.trim();
      // A Stacks address or a dotted BNS name (e.g. darthdude.btc) is
      // unambiguously a wallet lookup — token/page inputs are always numeric,
      // #id or p12. Route it to the shared /?wallet=<addr|name> deep-link, which
      // resolves BNS names and opens that wallet's holdings (same path the
      // homepage uses), instead of falling through to a failed page jump.
      const looksLikeWalletAddress = /^S[PTMN][0-9A-Z]{20,}$/i.test(raw);
      const looksLikeBnsName = /^[a-z0-9][a-z0-9-]*\.[a-z0-9-]{2,}$/i.test(raw);
      if (raw && (looksLikeWalletAddress || looksLikeBnsName)) {
        window.location.href = `/?wallet=${encodeURIComponent(raw)}`;
        return;
      }
      const pageMatch = raw.match(/^p(?:age)?\s*(\d+)$/i);
      if (pageMatch) {
        dom.explorerPageInput.value = pageMatch[1];
        dom.explorerTokenInput.value = '';
        await jumpToExplorerPage();
        return;
      }
      if (raw.startsWith('#')) {
        dom.explorerTokenInput.value = raw.slice(1).trim();
      }
      if (dom.explorerTokenInput.value.trim()) {
        await jumpToExplorerToken();
        return;
      }
      await jumpToExplorerPage();
    };

    const jumpToRandomInscription = async () => {
      if (!state.explorerMode || state.walletLoadingPage) {
        return;
      }
      if (!state.explorerLatestTokenId) {
        await refreshExplorerLatestTokenId();
      }
      const latest = state.explorerLatestTokenId;
      if (!latest || latest <= 0n) {
        return;
      }
      // With filters active and indexed, roll within the matching set so the
      // jump always lands on something visible.
      if (
        hasActiveExplorerFilters() &&
        state.explorerFilterIndexComplete &&
        state.explorerFilteredTokenIds.length > 0
      ) {
        const pick =
          state.explorerFilteredTokenIds[
            Math.floor(Math.random() * state.explorerFilteredTokenIds.length)
          ];
        dom.explorerTokenInput.value = pick.toString();
      } else {
        dom.explorerTokenInput.value = String(1 + Math.floor(Math.random() * Number(latest)));
      }
      await jumpToExplorerToken();
    };

    const showLatestExplorerPage = async () => {
      if (!state.explorerMode || state.walletLoadingPage) {
        return;
      }
      debugLog('grid', 'explorer latest page requested', {
        currentPageIndex: state.walletPageIndex,
        latestTokenId: state.explorerLatestTokenId?.toString() ?? null,
        filters: getExplorerFilterLabel()
      });
      await refreshExplorerLatestTokenId();
      state.walletPageIndex = getExplorerLatestPageIndex();
      dom.explorerTokenInput.value = '';
      await loadExplorerPage({ force: true, selectLatestOnPage: true });
      scrollToWalletGrid();
    };

    const loadHomeLatestView = async (options = {}) => {
      if (state.walletLoadingPage) {
        return;
      }
      debugLog('grid', 'home latest view requested', {
        currentPageIndex: state.walletPageIndex,
        latestTokenId: state.explorerLatestTokenId?.toString() ?? null
      });
      activeExampleDescriptionKey = 'latest';
      setExampleDescription('latest');
      clearSelectedTokenPreview();
      setStatus(dom.walletGridStatus, '<strong>Grid</strong> loading latest inscriptions', 'loading', 'blue');
      renderTokenGridPlaceholders('...');
      await refreshExplorerLatestTokenId();
      state.walletPageIndex = getExplorerLatestPageIndex();
      dom.explorerTokenInput.value = '';
      await loadExplorerPage({
        ...options,
        homeLatest: true,
        force: true,
        selectLatestOnPage: true
      });
      if (options.scrollToGrid) {
        scrollToWalletGrid();
      }
    };

    const readExplorerFilterControls = () =>
      new Set(
        dom.explorerFilterInputs
          .filter((input) => input.checked)
          .map((input) => input.dataset.explorerFilter)
          .filter(Boolean)
      );

    const applyExplorerFilterControls = async () => {
      if (!state.explorerMode) {
        return;
      }
      state.explorerFilterKinds = readExplorerFilterControls();
      state.explorerFilterIndexRunId += 1;
      state.explorerFilteredTokenIds = [];
      state.explorerFilterIndexComplete = false;
      state.explorerFilterBackgroundLoading = false;
      state.explorerFollowLatestFiltered = true;
      state.walletPageIndex = 0;
      state.selectedTokenId = null;
      clearSelectedTokenPreview();
      syncExplorerFilterControls();
      await showLatestExplorerPage();
    };

    const clearExplorerFilters = async () => {
      dom.explorerFilterInputs.forEach((input) => {
        input.checked = false;
      });
      await applyExplorerFilterControls();
    };

    const setSelectedFile = (file) => {
      state.selectedFile = file;
      state.prepared = null;
      state.duplicateId = null;
      state.uploadState = null;
      state.handoffDependencyIds = [];
      dom.fileInput.value = '';
      if (file) {
        dom.inscribePanelBody?.classList.add('has-payload'); // reveal details + inscribe button
        dom.dropzoneText.innerHTML = '';
        const chip = document.createElement('span');
        chip.className = 'file-chip';
        chip.textContent = `${file.name} · ${formatBytes(BigInt(file.size))}`;
        dom.dropzoneText.append(chip);
        if (!dom.nameInput.value.trim()) {
          dom.nameInput.value = file.name;
        }
        if (file.type) {
          dom.payloadType.value = file.type;
        }
      } else {
        dom.inscribePanelBody?.classList.remove('has-payload'); // back to just the dropzone
        dom.dropzoneText.textContent = 'Choose file or drop it here';
      }
      renderPreparedState();
      if (file && autoPrepareHook && !state.busy) {
        // Railroad the default flow: a dropped file is prepared immediately,
        // so the only remaining decision is "Start inscription".
        window.setTimeout(() => {
          if (state.selectedFile === file && !state.busy && !state.prepared) {
            void autoPrepareHook();
          }
        }, 0);
      }
    };

    // Manual recovery. If a wallet transaction is cancelled or fails — in
    // particular if a wallet popup leaves the request pending so the flow's
    // finally never runs — the busy lock can persist and disable every control.
    // Reset force-clears the lock and the step indicators so the user can prepare
    // or start again without reloading the page. The prepared file is kept.
    // These two controls are deliberately never gated by state.busy, so they keep
    // working even when the rest of the panel is locked.
    const resetInscriberFlow = () => {
      setBusy(false);
      resetSteps();
      updateWalletStatus();
      renderPreparedState();
      updateControls();
      appendLog('Controls reset — you can prepare or start the inscription again.', 'support');
    };

    // Clear the inscription panel back to an empty state for a fresh file: drops
    // the selected file, prepared payload, parents, and form fields.
    const clearInscriberPanel = () => {
      if (
        (state.busy || state.lastMintAttempt) &&
        !window.confirm(
          'Clear this inscription?\n\nThere is an inscription in progress. Its on-chain progress is saved and would resume on its own if you left it — clearing removes that local record. Clear anyway?'
        )
      ) {
        return;
      }
      if (state.payloadPreviewUrl) {
        URL.revokeObjectURL(state.payloadPreviewUrl);
        state.payloadPreviewUrl = null;
      }
      setSelectedFile(null);
      clearParentIds();
      dom.nameInput.value = '';
      dom.tokenUriInput.value = '';
      if (dom.textPayload) {
        dom.textPayload.value = '';
      }
      if (dom.threadReplyTo) {
        dom.threadReplyTo.value = '';
      }
      if (dom.dependencyIdsInput) {
        dom.dependencyIdsInput.value = '';
      }
      if (dom.dependencyStatusList) {
        dom.dependencyStatusList.textContent = 'No dependencies added.';
      }
      state.handoffDependencyIds = [];
      if (dom.payloadType) {
        dom.payloadType.selectedIndex = 0;
      }
      if (dom.allowDuplicateInput) {
        dom.allowDuplicateInput.checked = false;
      }
      setBusy(false);
      state.lastMintAttempt = null;
      void clearMintAttempt(getContractId(state.contract));
      resetSteps();
      updateWalletStatus();
      renderPreparedState();
      updateControls();
      appendLog('Inscription panel cleared — drop a new file to begin.', 'support');
    };

    const restoreSavedMintAttempt = async () => {
      if (window.location.search.includes('handoff=opus-player')) {
        return false;
      }
      const attempt = await loadMintAttempt(getContractId(state.contract));
      state.lastMintAttempt = attempt;
      if (!attempt) {
        renderResumeNotice();
        return false;
      }
      dom.tokenUriInput.value = attempt.tokenUri || DEFAULT_TOKEN_URI;
      state.handoffDependencyIds = (attempt.dependencyIds ?? []).map((id) => BigInt(id));
      state.parentIds = (attempt.parentIds ?? []).map((id) => BigInt(id));
      if (attempt.payloadBlob instanceof Blob) {
        const file = new File(
          [attempt.payloadBlob],
          attempt.fileName || 'unfinished-inscription',
          { type: attempt.mimeType || attempt.payloadBlob.type }
        );
        setSelectedFile(file);
        state.handoffDependencyIds = (attempt.dependencyIds ?? []).map((id) => BigInt(id));
        state.parentIds = (attempt.parentIds ?? []).map((id) => BigInt(id));
        appendLog(
          `Restored unfinished inscription ${file.name}. Checking confirmed on-chain progress.`,
          'support'
        );
        await preparePayload();
        // Resume safety: if this inscription already has on-chain progress (a begin session /
        // uploaded chunks), surface the file view so the user can finish it. A partially
        // committed inscription must never be buried behind the collapsed landing.
        if (state.uploadState) {
          applyInscribeMode('file');
        }
        void refreshParentChecks();
        return true;
      }
      appendLog(
        `Unfinished inscription found. Re-select ${attempt.fileName ?? 'the original file'} to resume.`,
        'support'
      );
      renderParentSelection();
      renderResumeNotice();
      return false;
    };

    const clearOpusHtmlHandoffRequest = () => {
      if (window.location.search.includes('handoff=opus-player')) {
        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete('handoff');
        cleanUrl.searchParams.delete('handoffId');
        window.history.replaceState(null, '', `${cleanUrl.pathname}${cleanUrl.search}${cleanUrl.hash}`);
      }
    };

    const openOpusHtmlHandoffDb = () =>
      new Promise((resolve, reject) => {
        if (!window.indexedDB) {
          reject(new Error('IndexedDB is not available in this browser.'));
          return;
        }
        const request = window.indexedDB.open(OPUS_HTML_HANDOFF_DB, 1);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(OPUS_HTML_HANDOFF_STORE)) {
            db.createObjectStore(OPUS_HTML_HANDOFF_STORE, { keyPath: 'id' });
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => {
          reject(request.error || new Error('Could not open Opus handoff storage.'));
        };
      });

    const readOpusHtmlHandoffRecord = async (pointer) => {
      if (pointer?.storage !== 'indexeddb' || !pointer.id) {
        return pointer;
      }

      let db = null;
      try {
        db = await openOpusHtmlHandoffDb();
        const record = await new Promise((resolve, reject) => {
          const transaction = db.transaction(OPUS_HTML_HANDOFF_STORE, 'readonly');
          const request = transaction.objectStore(OPUS_HTML_HANDOFF_STORE).get(pointer.id);
          request.onsuccess = () => resolve(request.result || null);
          request.onerror = () => {
            reject(request.error || new Error('Could not read Opus handoff record.'));
          };
        });
        if (!record) {
          throw new Error('Generated HTML handoff record was not found.');
        }
        const html =
          record.htmlBlob instanceof Blob
            ? await record.htmlBlob.text()
            : typeof record.html === 'string'
            ? record.html
            : '';
        return { ...pointer, ...record, html };
      } finally {
        if (db) db.close();
      }
    };

    const deleteOpusHtmlHandoffRecord = async (pointer) => {
      if (pointer?.storage !== 'indexeddb' || !pointer.id) {
        return;
      }

      let db = null;
      try {
        db = await openOpusHtmlHandoffDb();
        await new Promise((resolve, reject) => {
          const transaction = db.transaction(OPUS_HTML_HANDOFF_STORE, 'readwrite');
          transaction.objectStore(OPUS_HTML_HANDOFF_STORE).delete(pointer.id);
          transaction.oncomplete = () => resolve();
          transaction.onerror = () => {
            reject(transaction.error || new Error('Could not delete Opus handoff record.'));
          };
          transaction.onabort = () => {
            reject(transaction.error || new Error('Opus handoff delete was aborted.'));
          };
        });
      } catch (error) {
        console.warn('Could not delete Opus handoff record:', error);
      } finally {
        if (db) db.close();
      }
    };

    const consumeOpusHtmlHandoff = async () => {
      let raw = null;
      let pointer = null;
      const requestedId = new URL(window.location.href).searchParams.get('handoffId');
      try {
        raw = window.localStorage.getItem(OPUS_HTML_HANDOFF_KEY);
      } catch (error) {
        raw = null;
      }

      if (!raw && !requestedId) {
        clearOpusHtmlHandoffRequest();
        return false;
      }

      try {
        const pendingPointer = raw ? JSON.parse(raw) : null;
        pointer =
          requestedId && pendingPointer?.id !== requestedId
            ? { id: requestedId, storage: 'indexeddb' }
            : pendingPointer;
        if (!pointer?.id) {
          throw new Error('Generated HTML handoff identifier was missing.');
        }
        const payload = await readOpusHtmlHandoffRecord(pointer);
        const html = typeof payload.html === 'string' ? payload.html : '';
        if (!html.trim()) {
          throw new Error('Generated HTML payload was empty.');
        }

        const originalFilename =
          typeof payload.filename === 'string' && payload.filename.trim()
            ? payload.filename.trim()
            : 'xtrata-opus-player.html';
        const filename = getCompactOpusHandoffFilename(payload, originalFilename);
        const file = new File([html], filename, { type: 'text/html' });

        dom.textPayload.value = '';
        dom.payloadType.value = 'text/html';
        dom.nameInput.value = '';
        setSelectedFile(file);
        state.handoffDependencyIds = normalizeOpusHandoffDependencyIds(payload.dependencies);
        appendLog(
          originalFilename === filename
            ? `Selected generated Opus HTML player: ${filename}. Add parents, then click Prepare.`
            : `Selected generated Opus HTML player: ${filename} (from ${originalFilename}). Add parents, then click Prepare.`
        );
        renderPreparedState();
        document
          .getElementById('inscribeTitle')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return true;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        appendLog(`Could not load Opus HTML player handoff: ${message}`);
        setStatus(dom.walletStatus, `<strong>Opus handoff failed</strong> ${message}`, 'error', 'rose');
        return false;
      } finally {
        try {
          const currentRaw = window.localStorage.getItem(OPUS_HTML_HANDOFF_KEY);
          const currentPointer = currentRaw ? JSON.parse(currentRaw) : null;
          if (currentPointer?.id === pointer?.id) {
            window.localStorage.removeItem(OPUS_HTML_HANDOFF_KEY);
          }
        } catch (error) {}
        await deleteOpusHtmlHandoffRecord(pointer);
        clearOpusHtmlHandoffRequest();
      }
    };

    const markPreparedDirty = () => {
      if (!state.prepared) {
        return;
      }
      state.prepared = null;
      state.duplicateId = null;
      state.uploadState = null;
      resetSteps();
      renderPreparedState();
    };

    // Public views shared by boot deep-links and SPA tab switches:
    //   ?gallery=<id>, ?wallet=/?showcase=<addr|name> (+ &sel=<tokenId>).
    const openPublicViewFromParams = async (params) => {
      const requestedGallery = params.get('gallery')?.trim() || null;
      const requestedPublicWallet =
        params.get('wallet')?.trim() || params.get('showcase')?.trim() || null;
      if (requestedGallery) {
        await openCuratedGallery(requestedGallery, { scroll: false });
        return true;
      }
      if (!requestedPublicWallet) {
        return false;
      }
      if (/^S[PM][0-9A-Z]+$/i.test(requestedPublicWallet)) {
        await viewWalletByAddress(requestedPublicWallet);
      } else {
        dom.walletLookupInput.value = requestedPublicWallet.replace(/\.btc$/i, '');
        updateWalletLookupInputMode();
        await viewWalletFromInput();
      }
      const requestedSel = parsePositiveBigInt(params.get('sel') ?? '');
      if (requestedSel !== null) {
        try {
          await focusWalletTokenById(requestedSel);
        } catch (error) {
          debugLog('grid', 'deep-link token focus failed', {
            sel: requestedSel.toString(),
            error: error instanceof Error ? error.message : String(error)
          }, 'warn');
        }
      }
      return true;
    };

    // Default My Wallet view: a connected wallet WITH inscriptions opens its
    // own latest page; otherwise Music by Various, so there's always content.
    const openMyWalletDefaultView = async () => {
      let openedOwnWallet = false;
      if (state.walletSession.isConnected && state.walletSession.address) {
        await loadWalletInscriptions();
        const ownedCount = state.walletUsesPagedHoldings
          ? state.walletTotalCount
          : state.walletTokenIds.length;
        openedOwnWallet = ownedCount > 0;
        if (!openedOwnWallet) {
          appendLog('Connected wallet has no inscriptions yet — showing Music by Various.');
        }
      }
      if (!openedOwnWallet) {
        await openCuratedGallery('jim-music', { scroll: false });
      }
    };

    // SPA tab switching: the primary site pages share this shell, so nav clicks
    // just swap the page mode and run that page's loads — no reload, and the
    // radio, wallet session and caches all survive the switch.
    let pageSwitchRun = 0;

    const ensureWizardFrame = () => {
      if (!dom.wizardFrame || dom.wizardFrame.getAttribute('src')) {
        return;
      }
      dom.wizardFrame.setAttribute(
        'src',
        dom.wizardFrame.dataset.src || WIZARD_EMBED_ROUTE
      );
    };

    // ------------------------------------------------------------------
    // Market page: multi-asset inscription marketplace (homepage-native).
    // Listings render as media thumbnails with an expandable details section
    // (metadata, relationships, price, creation + trading history). All logic
    // reuses src/lib: market registry/settlement/sponsored, viewer summaries
    // and content loaders, and the market activity indexer.
    // ------------------------------------------------------------------
    const MARKET_LISTINGS_PER_CONTRACT = 24;
    const MARKET_THUMB_HYDRATION_CONCURRENCY = 4;
    const marketState = {
      filter: 'all',
      run: 0,
      listings: [],
      liveFrames: 0, // sandboxed iframes currently mounted (shares the grid's cap)
      summaries: new Map(), // `${nftContract}:${tokenId}` -> TokenSummary|null
      media: new Map(), // same key -> { url, kind } | null
      activity: new Map(), // market contractId -> MarketIndexSnapshot events
      clients: new Map() // nftContract principal -> XtrataClient
    };
    const marketDom = {
      toolbar: $('marketToolbar'),
      status: $('marketStatus'),
      listings: $('marketListings'),
      badge: $('marketNetworkBadge')
    };

    const marketEntriesForNetwork = () =>
      MARKET_REGISTRY.filter((entry) => entry.network === state.contract.network);

    const formatAssetAmount = (amount, decimals, symbol) => {
      const base = 10n ** BigInt(decimals);
      const whole = amount / base;
      const frac = (amount % base).toString().padStart(decimals, '0').replace(/0+$/, '');
      return `${whole.toString()}${frac ? '.' + frac : ''} ${symbol}`;
    };

    const formatByteSize = (size) => {
      const n = Number(size);
      if (!Number.isFinite(n)) return `${size} B`;
      if (n < 1024) return `${n} B`;
      if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
      return `${(n / (1024 * 1024)).toFixed(2)} MB`;
    };

    const shortPrincipal = (value) =>
      value && value.length > 14 ? `${value.slice(0, 8)}…${value.slice(-4)}` : String(value ?? '');

    // BNS display names for market/drops cards — same resolver the Xplorer
    // uses, cached per address so each seller is looked up at most once.
    const marketBnsCache = new Map(); // address -> Promise<string|null>
    const marketBnsNameFor = (address) => {
      if (!address) return Promise.resolve(null);
      let pending = marketBnsCache.get(address);
      if (!pending) {
        pending = resolveBnsNames({ address, network: state.contract.network })
          .then((result) => result.primary ?? null)
          .catch(() => null);
        marketBnsCache.set(address, pending);
      }
      return pending;
    };
    // Renders "name.btc" into the span once resolved; keeps the short
    // principal until then (and permanently when the address has no name).
    const applyBnsName = (span, address) => {
      span.textContent = shortPrincipal(address);
      span.title = address;
      void marketBnsNameFor(address).then((name) => {
        if (name && span.isConnected) span.textContent = name;
      });
    };
    const bnsNameSpan = (address) => {
      const span = document.createElement('span');
      applyBnsName(span, address);
      return span;
    };

    const marketTokenKey = (listing) => `${listing.nftContract}:${listing.tokenId}`;

    const marketClientFor = (nftContract, network) => {
      let client = marketState.clients.get(nftContract);
      if (!client) {
        const [address, contractName] = nftContract.split('.');
        client = createXtrataClient({ contract: { address, contractName, network } });
        marketState.clients.set(nftContract, client);
      }
      return client;
    };

    const readMarketListings = async (entry) => {
      const contractId = getMarketContractId(entry);
      const settlement = getMarketSettlementAsset(entry.paymentTokenContractId ?? null);
      const lastJson = await callReadOnlyJson({
        contractId,
        functionName: 'get-last-listing-id',
        network: entry.network
      });
      const lastId = BigInt(lastJson?.value?.value ?? 0);
      const results = [];
      const from = lastId;
      const floor = lastId > BigInt(MARKET_LISTINGS_PER_CONTRACT) ? lastId - BigInt(MARKET_LISTINGS_PER_CONTRACT) : 0n;
      for (let id = from; id >= floor; id -= 1n) {
        try {
          const json = await callReadOnlyJson({
            contractId,
            functionName: 'get-listing',
            args: [uintCV(id)],
            network: entry.network
          });
          const tuple = unwrapBindingTuple(json);
          if (!tuple) continue;
          const soldRaw = tuple['sold-at']?.value ?? null;
          results.push({
            entry,
            contractId,
            settlement,
            listingId: id,
            seller: String(tuple.seller.value),
            nftContract: String(tuple['nft-contract'].value),
            tokenId: BigInt(tuple['token-id'].value),
            price: BigInt(tuple.price.value),
            createdAt: tuple['created-at'] ? BigInt(tuple['created-at'].value) : null,
            feeBudget: tuple['fee-budget'] ? BigInt(tuple['fee-budget'].value) : null,
            claimed: tuple.claimed ? BigInt(tuple.claimed.value) : null,
            budgetRemaining: tuple['budget-remaining'] ? BigInt(tuple['budget-remaining'].value) : null,
            // sold sponsored listings stay visible to their seller for reclaim
            soldAt: soldRaw === null || soldRaw === undefined ? null : BigInt(soldRaw.value ?? soldRaw)
          });
        } catch {
          // sparse ids / deleted listings: skip
        }
        if (id === 0n) break;
      }
      return results;
    };

    const getListingPublicBlockReason = (listing) =>
      getMarketListingPublicBlockReason({
        nftContract: listing.nftContract,
        marketContractId: listing.contractId
      });

    const isListingPubliclyBuyable = (listing) =>
      isMarketListingPubliclyBuyable({
        nftContract: listing.nftContract,
        marketContractId: listing.contractId
      });

    // Deny-mode post-conditions for contract-side payouts (cancel / reclaim /
    // claim): the exact NFT and STX escrow outflows, so the wallet shows
    // precisely what moves instead of the Allow-mode "this app may transfer
    // any of your assets" warning.
    const marketEscrowPostConditions = (listing, { includeNft = true } = {}) => {
      const pcs = [];
      if (includeNft) {
        const [nftAddress, nftName] = listing.nftContract.split('.');
        pcs.push(
          buildContractTransferPostCondition({
            nftContract: { address: nftAddress, contractName: nftName, network: listing.entry.network },
            senderContract: {
              address: listing.entry.address,
              contractName: listing.entry.contractName,
              network: listing.entry.network
            },
            tokenId: listing.tokenId
          })
        );
      }
      if (listing.budgetRemaining !== null && listing.budgetRemaining !== undefined) {
        pcs.push(
          makeContractSTXPostCondition(
            listing.entry.address,
            listing.entry.contractName,
            FungibleConditionCode.Equal,
            listing.budgetRemaining
          )
        );
      }
      return pcs;
    };

    const setMarketActionStatus = (target, html) => {
      if (!target) return;
      target.hidden = false;
      target.innerHTML = html;
    };

    const marketCancel = async (listing, statusTarget = marketDom.status) => {
      if (!state.walletSession.isConnected || !state.walletSession.address) {
        setMarketActionStatus(
          statusTarget,
          '<span><strong>Market</strong> connect the seller wallet to cancel.</span>'
        );
        return;
      }
      if (!addressesEqual(state.walletSession.address, listing.seller)) {
        setMarketActionStatus(
          statusTarget,
          '<span><strong>Market</strong> only the listing seller can cancel.</span>'
        );
        return;
      }
      const [nftAddress, nftName] = listing.nftContract.split('.');
      setMarketActionStatus(
        statusTarget,
        '<span><strong>Market</strong> confirm the unlist in your wallet…</span>'
      );
      showContractCall({
        contractAddress: listing.entry.address,
        contractName: listing.entry.contractName,
        functionName: 'cancel',
        functionArgs: [contractPrincipalCV(nftAddress, nftName), uintCV(listing.listingId)],
        network: listing.entry.network,
        stxAddress: state.walletSession.address,
        postConditionMode: PostConditionMode.Deny,
        postConditions: marketEscrowPostConditions(listing),
        onFinish: (payload) => {
          const txId = payload?.txId ?? payload?.txid ?? '';
          setMarketActionStatus(
            statusTarget,
            `<span><strong>Market</strong> unlist submitted${txId ? ` — tx ${txId}` : ''}. Once it confirms, the inscription returns to your wallet and you can relist it at the new price.</span>`
          );
        },
        onCancel: () => {
          setMarketActionStatus(
            statusTarget,
            '<span><strong>Market</strong> unlist cancelled.</span>'
          );
        }
      });
    };

    const marketBuy = async (listing) => {
      const publicBlockReason = getListingPublicBlockReason(listing);
      if (publicBlockReason) {
        marketDom.status.innerHTML = publicBlockReason === 'legacy-nft'
          ? '<span><strong>Market</strong> this legacy inscription is not for sale — the seller must cancel, migrate to v3, and relist.</span>'
          : '<span><strong>Market</strong> this legacy market cannot complete purchases — the seller must cancel and relist on a supported market.</span>';
        return;
      }
      if (!state.walletSession.isConnected || !state.walletSession.address) {
        marketDom.status.innerHTML = '<span><strong>Market</strong> connect a wallet to buy.</span>';
        return;
      }
      const [nftAddress, nftName] = listing.nftContract.split('.');
      const postConditions = buildMarketBuyPostConditions({
        settlement: listing.settlement,
        buyerAddress: state.walletSession.address,
        amount: listing.price,
        nftContract: { address: nftAddress, contractName: nftName, network: listing.entry.network },
        senderContract: {
          address: listing.entry.address,
          contractName: listing.entry.contractName,
          network: listing.entry.network
        },
        tokenId: listing.tokenId
      });
      if (!postConditions) {
        marketDom.status.innerHTML = '<span><strong>Market</strong> unsupported payment token for this listing.</span>';
        return;
      }
      marketDom.status.innerHTML = '<span><strong>Market</strong> confirm the purchase in your wallet…</span>';
      showContractCall({
        contractAddress: listing.entry.address,
        contractName: listing.entry.contractName,
        functionName: 'buy',
        functionArgs: [contractPrincipalCV(nftAddress, nftName), uintCV(listing.listingId)],
        network: listing.entry.network,
        stxAddress: state.walletSession.address,
        postConditionMode: PostConditionMode.Deny,
        postConditions,
        onFinish: (payload) => {
          const txId = payload?.txId ?? payload?.txid ?? '';
          marketDom.status.innerHTML = `<span><strong>Market</strong> purchase submitted${txId ? ` — tx ${txId}` : ''}.</span><span class="badge green">sent</span>`;
        },
        onCancel: () => {
          marketDom.status.innerHTML = '<span><strong>Market</strong> purchase cancelled.</span>';
        }
      });
    };

    // --- thumbnails -------------------------------------------------------
    const MARKET_KIND_ICONS = {
      image: '🖼', audio: '🎵', video: '🎞', html: '🧩', text: '📄',
      json: '{ }', code: '⌨', unknown: '◼'
    };

    const marketSummaryFor = async (listing) => {
      const key = marketTokenKey(listing);
      if (marketState.summaries.has(key)) return marketState.summaries.get(key);
      let summary = null;
      try {
        summary = await fetchTokenSummary({
          client: marketClientFor(listing.nftContract, listing.entry.network),
          id: listing.tokenId,
          senderAddress: listing.entry.address
        });
      } catch {
        summary = null;
      }
      marketState.summaries.set(key, summary);
      return summary;
    };

    const MARKET_MEDIA_MAX_BYTES = 512n * 1024n;
    const MARKET_REMOTE_THUMBNAIL_MAX_BYTES = 5 * 1024 * 1024;

    const marketFetchContent = async (listing, meta) => {
      const bytes = await fetchOnChainContent({
        client: marketClientFor(listing.nftContract, listing.entry.network),
        id: listing.tokenId,
        senderAddress: listing.entry.address,
        totalSize: meta.totalSize,
        mimeType: meta.mimeType
      });
      return bytes;
    };

    const marketCachedThumbnailFor = async (listing) => {
      const key = marketTokenKey(listing);
      const memoryHit = state.thumbnailCache.has(key);
      let thumbnail = state.thumbnailCache.get(key);
      if (thumbnail === undefined) {
        thumbnail = await loadInscriptionThumbnailFromCache(
          listing.nftContract,
          listing.tokenId
        );
        state.thumbnailCache.set(key, thumbnail);
      }
      if (!thumbnail?.data) return null;
      debugLog('cache', 'market thumbnail cache hit', {
        tokenId: listing.tokenId.toString(),
        contractId: listing.nftContract,
        source: memoryHit ? 'memory' : 'indexeddb',
        bytes: thumbnail.data.length
      });
      return {
        kind: 'image',
        url: URL.createObjectURL(
          new Blob([thumbnail.data], {
            type: thumbnail.mimeType ?? 'image/webp'
          })
        )
      };
    };

    const warmMarketThumbnailCache = async (listing, bytes, mimeType) => {
      try {
        const thumbnail = await createImageThumbnail({ bytes, mimeType });
        if (!thumbnail?.data) return null;
        await saveInscriptionThumbnailToCache(
          listing.nftContract,
          listing.tokenId,
          thumbnail.data,
          {
            mimeType: thumbnail.mimeType,
            width: thumbnail.width,
            height: thumbnail.height
          }
        );
        state.thumbnailCache.set(marketTokenKey(listing), thumbnail);
        debugLog('cache', 'market thumbnail cache warmed', {
          tokenId: listing.tokenId.toString(),
          contractId: listing.nftContract,
          bytes: thumbnail.data.length,
          mimeType: thumbnail.mimeType
        });
        return thumbnail;
      } catch (error) {
        debugLog('cache', 'market thumbnail cache warm failed', {
          tokenId: listing.tokenId.toString(),
          contractId: listing.nftContract,
          error: error instanceof Error ? error.message : String(error)
        }, 'warn');
        return null;
      }
    };

    const cacheMarketRemoteImage = async (listing, url) => {
      try {
        const response = await fetch(url);
        if (!response.ok) return;
        const declaredSize = Number(response.headers.get('content-length') ?? 0);
        if (declaredSize > MARKET_REMOTE_THUMBNAIL_MAX_BYTES) return;
        const bytes = new Uint8Array(await response.arrayBuffer());
        if (!bytes.length || bytes.length > MARKET_REMOTE_THUMBNAIL_MAX_BYTES) return;
        const declaredMime = response.headers.get('content-type')?.split(';')[0]?.trim() ?? '';
        const mimeType = getMediaKind(declaredMime) === 'image'
          ? declaredMime
          : 'image/png';
        await warmMarketThumbnailCache(listing, bytes, mimeType);
      } catch {
        // Cross-origin or transient image fetch failures only skip caching; the
        // browser can still render the already-resolved source URL directly.
      }
    };

    // Resolve a listing's thumbnail media. Kinds:
    //   image      → <img> (covers static + SMIL/CSS-animated SVG)
    //   html-live  → sandboxed <iframe srcdoc> (HTML inscriptions and
    //                script-driven SVG animations, per the wallet-grid pattern)
    //   video      → muted looping <video>
    const marketMediaFor = async (listing) => {
      const key = marketTokenKey(listing);
      if (marketState.media.has(key)) return marketState.media.get(key);
      let media = null;
      try {
        media = await marketCachedThumbnailFor(listing);
        if (media) {
          marketState.media.set(key, media);
          return media;
        }
        const summary = await marketSummaryFor(listing);
        const meta = summary?.meta ?? null;
        const mime = (meta?.mimeType ?? '').toLowerCase();
        const kind = getMediaKind(mime);
        const fetchable =
          meta && meta.totalSize > 0n && meta.totalSize <= MARKET_MEDIA_MAX_BYTES;

        if (kind === 'image' && fetchable && mime.includes('svg')) {
          // On-chain SVG: script-driven animations need a real document.
          const bytes = await marketFetchContent(listing, meta);
          const text = new TextDecoder().decode(bytes);
          if (/<script[\s>]/i.test(text)) {
            media = { kind: 'html-live', html: text };
          } else {
            await warmMarketThumbnailCache(listing, bytes, 'image/svg+xml');
            media = {
              kind: 'image',
              url: URL.createObjectURL(new Blob([bytes], { type: 'image/svg+xml' }))
            };
          }
        } else if (kind === 'image' && fetchable) {
          const bytes = await marketFetchContent(listing, meta);
          await warmMarketThumbnailCache(listing, bytes, meta.mimeType);
          media = {
            kind: 'image',
            url: URL.createObjectURL(new Blob([bytes], { type: meta.mimeType }))
          };
        } else if (kind === 'html' && fetchable) {
          const bytes = await marketFetchContent(listing, meta);
          media = { kind: 'html-live', html: new TextDecoder().decode(bytes) };
        } else if (kind === 'video' && fetchable) {
          const bytes = await marketFetchContent(listing, meta);
          media = {
            kind: 'video',
            url: URL.createObjectURL(new Blob([bytes], { type: meta.mimeType }))
          };
        } else if ((kind === 'text' || kind === 'json' || kind === 'code') && fetchable) {
          // Text-like inscriptions: show the actual words, not a logo.
          const bytes = await marketFetchContent(listing, meta);
          const text = new TextDecoder().decode(bytes).trim().slice(0, 400);
          if (text) media = { kind: 'text', text };
        }

        // Fallbacks: inline SVG data URI from the summary, then token-URI image.
        if (!media && summary?.svgDataUri) {
          media = { kind: 'image', url: summary.svgDataUri };
        }
        if (!media && summary?.tokenUri) {
          const uriImage = await fetchTokenImageFromUri(summary.tokenUri);
          if (uriImage) {
            void cacheMarketRemoteImage(listing, uriImage);
            media = { kind: 'image', url: uriImage };
          }
        }
      } catch {
        media = null;
      }
      marketState.media.set(key, media);
      return media;
    };

    const hydrateMarketThumbnails = async (run, listings, root = marketDom.listings) => {
      await runLimited(listings, MARKET_THUMB_HYDRATION_CONCURRENCY, async (listing) => {
        if (run !== marketState.run) return;
        const media = await marketMediaFor(listing);
        if (run !== marketState.run) return;
        const slot = root?.querySelector(
          `[data-market-thumb="${listing.contractId}:${listing.listingId}"]`
        );
        if (!slot) return;
        if (media?.kind === 'html-live' && marketState.liveFrames < MAX_LIVE_HTML_FRAMES) {
          marketState.liveFrames += 1;
          const frame = document.createElement('iframe');
          frame.className = 'market-thumb__frame';
          frame.title = `Inscription #${listing.tokenId} preview`;
          frame.sandbox = 'allow-scripts';
          frame.referrerPolicy = 'no-referrer';
          frame.loading = 'lazy';
          frame.setAttribute('scrolling', 'no');
          frame.srcdoc = media.html;
          slot.replaceChildren(frame);
          slot.classList.add('market-thumb--media');
        } else if (media?.kind === 'video' && media.url) {
          const video = document.createElement('video');
          video.src = media.url;
          video.muted = true;
          video.loop = true;
          video.autoplay = true;
          video.playsInline = true;
          slot.replaceChildren(video);
          slot.classList.add('market-thumb--media');
        } else if (media?.kind === 'text') {
          const pre = document.createElement('div');
          pre.className = 'market-thumb__snippet';
          pre.textContent = media.text;
          slot.replaceChildren(pre);
          slot.classList.add('market-thumb--media');
        } else if (media?.url) {
          const img = document.createElement('img');
          img.src = media.url;
          img.alt = `Inscription #${listing.tokenId}`;
          img.loading = 'lazy';
          slot.replaceChildren(img);
          slot.classList.add('market-thumb--media');
        } else {
          const summary = marketState.summaries.get(marketTokenKey(listing));
          const kind = getMediaKind(summary?.meta?.mimeType);
          slot.replaceChildren(
            Object.assign(document.createElement('span'), {
              className: 'market-thumb__icon',
              textContent: MARKET_KIND_ICONS[kind] ?? MARKET_KIND_ICONS.unknown
            }),
            Object.assign(document.createElement('span'), {
              className: 'market-thumb__label',
              textContent: summary?.meta?.mimeType ?? 'no preview'
            })
          );
        }
      });
    };

    // --- expandable details ----------------------------------------------
    const marketActivityFor = async (listing) => {
      const contractId = listing.contractId;
      if (!marketState.activity.has(contractId)) {
        try {
          const snapshot = await loadMarketActivity({
            contract: {
              address: listing.entry.address,
              contractName: listing.entry.contractName,
              network: listing.entry.network
            }
          });
          marketState.activity.set(contractId, snapshot?.events ?? []);
        } catch {
          marketState.activity.set(contractId, []);
        }
      }
      return marketState.activity
        .get(contractId)
        .filter((event) => event.tokenId === listing.tokenId);
    };

    const detailRow = (label, value) => {
      const row = document.createElement('div');
      row.className = 'market-detail__row';
      const dt = document.createElement('span');
      dt.className = 'market-detail__label';
      dt.textContent = label;
      const dd = document.createElement('span');
      dd.className = 'market-detail__value';
      if (value instanceof HTMLElement) dd.append(value);
      else dd.textContent = String(value);
      row.append(dt, dd);
      return row;
    };

    const xplorerTokenLink = (tokenId, label = null) => {
      const link = document.createElement('a');
      link.href = `/xplorer?token=${tokenId}`;
      link.target = '_self';
      link.textContent = label ?? `#${tokenId}`;
      return link;
    };

    const loadMarketDetails = async (listing, body) => {
      body.replaceChildren(
        Object.assign(document.createElement('p'), { className: 'muted', textContent: 'Loading details…' })
      );
      const client = marketClientFor(listing.nftContract, listing.entry.network);
      const sender = listing.entry.address;
      const [summary, parents, deps, events] = await Promise.all([
        marketSummaryFor(listing),
        client.getParents(listing.tokenId, sender).catch(() => []),
        client.getDependencies(listing.tokenId, sender).catch(() => []),
        marketActivityFor(listing)
      ]);

      const frag = document.createDocumentFragment();

      // metadata
      const metaBlock = document.createElement('div');
      metaBlock.className = 'market-detail__section';
      metaBlock.append(Object.assign(document.createElement('strong'), { textContent: 'Metadata' }));
      if (summary?.meta) {
        metaBlock.append(
          detailRow('Type', summary.meta.mimeType),
          detailRow('Size', formatByteSize(summary.meta.totalSize)),
          detailRow('Creator', bnsNameSpan(summary.meta.creator ?? summary.meta.owner)),
          detailRow('Owner', summary.owner ? bnsNameSpan(summary.owner) : '—')
        );
      } else {
        metaBlock.append(detailRow('Metadata', 'unavailable'));
      }
      if (summary?.tokenUri) {
        const uriLink = document.createElement('a');
        if (isHttpUrl(summary.tokenUri)) {
          uriLink.href = summary.tokenUri;
          uriLink.target = '_blank';
          uriLink.rel = 'noreferrer';
        }
        uriLink.textContent =
          summary.tokenUri.length > 48 ? `${summary.tokenUri.slice(0, 48)}…` : summary.tokenUri;
        metaBlock.append(detailRow('Token URI', uriLink));
      }
      frag.append(metaBlock);

      // relationships
      const relBlock = document.createElement('div');
      relBlock.className = 'market-detail__section';
      relBlock.append(Object.assign(document.createElement('strong'), { textContent: 'Relationships' }));
      const relValue = (ids) => {
        if (!ids?.length) return '—';
        const wrap = document.createElement('span');
        ids.slice(0, 8).forEach((id, index) => {
          if (index) wrap.append(', ');
          wrap.append(xplorerTokenLink(id));
        });
        if (ids.length > 8) wrap.append(` +${ids.length - 8} more`);
        return wrap;
      };
      relBlock.append(
        detailRow(`Parents (${parents?.length ?? 0})`, relValue(parents)),
        detailRow(`Dependencies (${deps?.length ?? 0})`, relValue(deps))
      );
      frag.append(relBlock);

      // price + listing
      const priceBlock = document.createElement('div');
      priceBlock.className = 'market-detail__section';
      priceBlock.append(Object.assign(document.createElement('strong'), { textContent: 'Listing' }));
      const symbol = getMarketSettlementLabel(listing.settlement);
      priceBlock.append(
        detailRow('Price', formatMarketPriceWithUsd(listing.price, listing.settlement, state.usdPriceBook)),
        detailRow('Listing', `#${listing.listingId} on ${listing.entry.label}`),
        detailRow('Seller', bnsNameSpan(listing.seller))
      );
      if (listing.createdAt !== null) {
        priceBlock.append(detailRow('Listed at block', listing.createdAt.toString()));
      }
      if (isSponsoredMarket(listing.entry) && listing.budgetRemaining !== null) {
        priceBlock.append(
          detailRow('Sponsorship', `no STX needed — fee budget ${formatAssetAmount(listing.budgetRemaining, 6, 'STX')} remaining`)
        );
      }
      frag.append(priceBlock);

      // trading history
      const historyBlock = document.createElement('div');
      historyBlock.className = 'market-detail__section';
      historyBlock.append(Object.assign(document.createElement('strong'), { textContent: 'Trading history' }));
      if (events.length) {
        events
          .slice(0, 12)
          .forEach((event) => {
            const what =
              event.type === 'buy'
                ? `Sold${event.price !== undefined ? ` for ${formatAssetAmount(event.price, listing.settlement.decimals ?? 6, symbol)}` : ''}`
                : event.type === 'list'
                  ? `Listed${event.price !== undefined ? ` at ${formatAssetAmount(event.price, listing.settlement.decimals ?? 6, symbol)}` : ''}`
                  : event.type === 'cancel'
                    ? 'Listing cancelled'
                    : event.type;
            const when = event.timestamp
              ? new Date(event.timestamp).toLocaleDateString()
              : event.blockHeight
                ? `block ${event.blockHeight}`
                : '';
            historyBlock.append(detailRow(when || '—', what));
          });
      } else {
        historyBlock.append(detailRow('History', 'No prior market activity for this inscription.'));
      }
      frag.append(historyBlock);

      body.replaceChildren(frag);
    };


    // --- Sell an inscription (any currency, optional sponsorship) ----------
    const sellDom = {
      details: $('marketSell'),
      tokenId: $('marketSellTokenId'),
      market: $('marketSellMarket'),
      price: $('marketSellPrice'),
      priceLabel: $('marketSellPriceLabel'),
      deposit: $('marketSellDeposit'),
      button: $('marketSellButton'),
      status: $('marketSellStatus')
    };
    const sellState = { quote: null, quoteRun: 0 };

    // Legacy markets stay in the registry so old listings remain readable,
    // but new listings must not go to them — exclude from the sell selector.
    const sellEntries = () =>
      marketEntriesForNetwork().filter((entry) => !/legacy/i.test(entry.label ?? ''));

    const sellSelectedEntry = () => {
      const id = sellDom.market?.value;
      return sellEntries().find((entry) => getMarketContractId(entry) === id) ?? null;
    };

    const populateSellMarkets = () => {
      if (!sellDom.market) return;
      const current = sellDom.market.value;
      const orderedEntries = [...sellEntries()].sort((a, b) =>
        Number(isSponsoredMarket(a)) - Number(isSponsoredMarket(b))
      );
      sellDom.market.replaceChildren(
        ...orderedEntries.map((entry) => {
          const settlement = getMarketSettlementAsset(entry.paymentTokenContractId ?? null);
          const symbol = getMarketSettlementLabel(settlement);
          const option = document.createElement('option');
          option.value = getMarketContractId(entry);
          option.textContent = isSponsoredMarket(entry)
            ? `${symbol} - sponsored (buyer pays no fee)`
            : `${symbol} - standard`;
          return option;
        })
      );
      if (current) sellDom.market.value = current;
      updateSellUi();
    };

    const parseSellPrice = (raw, decimals) => {
      const trimmed = String(raw ?? '').trim();
      if (!/^\d+(\.\d+)?$/.test(trimmed)) return null;
      const [w, f = ''] = trimmed.split('.');
      if (f.length > decimals) return null;
      const amount = BigInt(w) * 10n ** BigInt(decimals) + BigInt((f || '0').padEnd(decimals, '0'));
      return amount > 0n ? amount : null;
    };

    const updateSellUi = async () => {
      const entry = sellSelectedEntry();
      if (!entry || !sellDom.priceLabel) return;
      const settlement = getMarketSettlementAsset(entry.paymentTokenContractId ?? null);
      const symbol = getMarketSettlementLabel(settlement);
      sellDom.priceLabel.textContent = `Price (${symbol})`;
      if (isSponsoredMarket(entry) && entry.sponsorApi) {
        const run = ++sellState.quoteRun;
        sellDom.deposit.textContent = 'Fetching sponsorship deposit quote...';
        try {
          const base = entry.sponsorApi.replace(/\/+$/, '');
          const r = await fetch(`${base}/sponsor/quote`, { method: 'POST' });
          if (run !== sellState.quoteRun) return;
          if (!r.ok) throw new Error('quote unavailable');
          const q = await r.json();
          sellState.quote = BigInt(q.budgetUstx ?? 60000);
          sellDom.deposit.textContent =
            `Sponsorship deposit: ${formatAssetAmount(sellState.quote, 6, 'STX')} - covers the buyer's network fee so they need no extra STX; the unused part is refunded to you when it sells or you cancel.`;
        } catch {
          if (run !== sellState.quoteRun) return;
          sellState.quote = 60_000n;
          sellDom.deposit.textContent =
            'Sponsorship deposit: 0.06 STX (default - live quote unavailable). Unused portion refunds to you.';
        }
      } else {
        sellState.quote = null;
        sellDom.deposit.textContent = 'Standard listing: the buyer pays their own network fee.';
      }
    };

    const marketList = async () => {
      const entry = sellSelectedEntry();
      if (!entry) return;
      if (!state.walletSession.isConnected || !state.walletSession.address) {
        sellDom.status.textContent = 'Connect a wallet to list.';
        return;
      }
      const tokenIdRaw = sellDom.tokenId?.value?.trim();
      if (!/^\d+$/.test(tokenIdRaw ?? '')) {
        sellDom.status.textContent = 'Enter the inscription number you want to sell.';
        return;
      }
      const tokenId = BigInt(tokenIdRaw);
      const settlement = getMarketSettlementAsset(entry.paymentTokenContractId ?? null);
      const decimals = settlement.decimals ?? 6;
      const priceAmount = parseSellPrice(sellDom.price?.value, decimals);
      if (priceAmount === null) {
        sellDom.status.textContent = `Enter a valid price (up to ${decimals} decimals).`;
        return;
      }
      const sponsored = isSponsoredMarket(entry);
      const budget = sponsored ? (sellState.quote ?? 60_000n) : null;

      // ownership check before the wallet opens
      sellDom.status.textContent = 'Checking ownership...';
      try {
        const owner = await state.client.getOwner(tokenId, state.walletSession.address);
        if (!owner || owner !== state.walletSession.address) {
          sellDom.status.textContent = owner
            ? `Inscription #${tokenId} is owned by ${owner.slice(0, 8)}..., not your wallet.`
            : `Inscription #${tokenId} not found.`;
          return;
        }
      } catch {
        sellDom.status.textContent = 'Could not verify ownership - try again.';
        return;
      }

      const postConditions = [
        buildTransferPostCondition({
          contract: state.contract,
          senderAddress: state.walletSession.address,
          tokenId
        })
      ];
      const functionArgs = [
        contractPrincipalCV(state.contract.address, state.contract.contractName),
        uintCV(tokenId),
        uintCV(priceAmount)
      ];
      if (sponsored && budget !== null) {
        functionArgs.push(uintCV(budget));
        postConditions.push(
          makeStandardSTXPostCondition(
            state.walletSession.address,
            FungibleConditionCode.Equal,
            budget
          )
        );
      }
      sellDom.status.textContent = 'Confirm the listing in your wallet...';
      showContractCall({
        contractAddress: entry.address,
        contractName: entry.contractName,
        functionName: 'list-token',
        functionArgs,
        network: entry.network,
        stxAddress: state.walletSession.address,
        postConditionMode: PostConditionMode.Deny,
        postConditions,
        onFinish: (payload) => {
          const txId = payload?.txId ?? payload?.txid ?? '';
          sellDom.status.textContent = `Listing submitted${txId ? ` - tx ${txId}` : ''}. It appears here once confirmed.`;
        },
        onCancel: () => {
          sellDom.status.textContent = 'Listing cancelled.';
        }
      });
    };

    sellDom.market?.addEventListener('change', () => { void updateSellUi(); });
    sellDom.button?.addEventListener('click', () => { void marketList(); });

    const openSellForToken = (tokenId) => {
      if (sellDom.details) sellDom.details.open = true;
      if (sellDom.tokenId) sellDom.tokenId.value = tokenId;
      populateSellMarkets();
      void updateSellUi();
      sellDom.details?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const renderMarketToolbar = () => {
      if (!marketDom.toolbar) return;
      const symbols = ['all', ...new Set(marketEntriesForNetwork().map((entry) =>
        getMarketSettlementLabel(getMarketSettlementAsset(entry.paymentTokenContractId ?? null))
      ))];
      marketDom.toolbar.replaceChildren(
        ...symbols.map((symbol) => {
          const chip = document.createElement('button');
          chip.type = 'button';
          chip.className = 'market-chip';
          chip.setAttribute('role', 'tab');
          chip.setAttribute('aria-selected', String(marketState.filter === symbol));
          chip.textContent = symbol === 'all' ? 'All assets' : symbol;
          chip.addEventListener('click', () => {
            marketState.filter = symbol;
            renderMarketToolbar();
            renderMarketListings();
          });
          return chip;
        })
      );
    };

    const renderMarketListings = () => {
      if (!marketDom.listings) return;
      const run = marketState.run;
      const visible = marketState.listings.filter((listing) =>
        listing.soldAt === null &&
        isListingPubliclyBuyable(listing) &&
        (marketState.filter === 'all' ||
          getMarketSettlementLabel(listing.settlement) === marketState.filter)
      );
      if (!visible.length) {
        marketDom.listings.replaceChildren();
        marketDom.status.innerHTML = '<span><strong>Market</strong> no live listings right now — list one from My Wallet.</span>';
        return;
      }
      marketDom.status.innerHTML = `<span><strong>Market</strong> ${visible.length} live listing${visible.length === 1 ? '' : 's'}.</span>`;
      marketState.liveFrames = 0; // cards re-render from scratch; recount frames
      marketDom.listings.replaceChildren(
        ...visible.map((listing) => {
          const card = document.createElement('article');
          card.className = 'market-card';
          const symbol = getMarketSettlementLabel(listing.settlement);
          const decimals = listing.settlement.decimals ?? 6;
          const sponsored = isSponsoredMarket(listing.entry);
          const isOwnListing = !!state.walletSession.address &&
            addressesEqual(listing.seller, state.walletSession.address);

          const thumb = document.createElement('a');
          thumb.className = 'market-thumb';
          thumb.href = `/xplorer?token=${listing.tokenId}`;
          thumb.target = '_self';
          thumb.dataset.marketThumb = `${listing.contractId}:${listing.listingId}`;
          thumb.setAttribute('aria-label', `View inscription #${listing.tokenId}`);
          thumb.append(
            Object.assign(document.createElement('span'), {
              className: 'market-thumb__label',
              textContent: 'Loading…'
            })
          );

          const badges = document.createElement('div');
          badges.className = 'market-card__badge-row';
          badges.innerHTML = `<span class="badge">${symbol}</span>${
            sponsored ? '<span class="badge green">No STX needed</span>' : ''
          }${isOwnListing ? '<span class="badge blue">Your listing</span>' : ''}`;

          const price = document.createElement('div');
          price.className = 'market-card__price';
          // Always show the USD equivalent next to the asset price (live
          // Coinbase spot rates; falls back to asset-only while loading).
          price.textContent = formatMarketPriceWithUsd(
            listing.price,
            listing.settlement,
            state.usdPriceBook
          );

          const meta = document.createElement('div');
          meta.className = 'market-card__meta';
          meta.textContent = `Inscription #${listing.tokenId} · listing #${listing.listingId} · seller `;
          const sellerSpan = document.createElement('span');
          applyBnsName(sellerSpan, listing.seller);
          meta.append(sellerSpan);

          const details = document.createElement('details');
          details.className = 'market-card__details';
          const summaryEl = document.createElement('summary');
          summaryEl.textContent = 'Details';
          const body = document.createElement('div');
          body.className = 'market-detail';
          details.append(summaryEl, body);
          details.addEventListener('toggle', () => {
            if (details.open && !details.dataset.loaded) {
              details.dataset.loaded = '1';
              void loadMarketDetails(listing, body).catch(() => {
                body.replaceChildren(
                  Object.assign(document.createElement('p'), {
                    className: 'muted',
                    textContent: 'Details unavailable right now.'
                  })
                );
              });
            }
          });

          const actions = document.createElement('div');
          actions.className = 'market-card__actions';
          if (isOwnListing) {
            const cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.className = 'market-chip';
            cancelBtn.textContent = 'Cancel / change price';
            cancelBtn.title = 'Unlist this inscription; once confirmed, relist it at the new price.';
            cancelBtn.addEventListener('click', () => { void marketCancel(listing); });
            actions.append(cancelBtn);
          } else {
            const buy = document.createElement('button');
            buy.type = 'button';
            buy.className = 'market-chip';
            buy.textContent = sponsored ? 'Buy — no STX needed' : 'Buy';
            buy.addEventListener('click', () => { void marketBuy(listing); });
            actions.append(buy);
          }

          card.append(thumb, badges, price, meta, details, actions);
          return card;
        })
      );
      void hydrateMarketThumbnails(run, visible);
    };

    // --- Seller dashboard: my listings across all markets -----------------
    const marketReclaim = async (listing) => {
      if (!state.walletSession.isConnected || !state.walletSession.address) return;
      marketDom.status.innerHTML = '<span><strong>Market</strong> confirm the reclaim in your wallet…</span>';
      showContractCall({
        contractAddress: listing.entry.address,
        contractName: listing.entry.contractName,
        functionName: 'settle-refund',
        functionArgs: [uintCV(listing.listingId)],
        network: listing.entry.network,
        stxAddress: state.walletSession.address,
        postConditionMode: PostConditionMode.Deny,
        postConditions: marketEscrowPostConditions(listing, { includeNft: false }),
        onFinish: (payload) => {
          const txId = payload?.txId ?? payload?.txid ?? '';
          marketDom.status.innerHTML = `<span><strong>Market</strong> reclaim submitted${txId ? ` — tx ${txId}` : ''}. Your unused deposit returns when it confirms.</span>`;
        },
        onCancel: () => {
          marketDom.status.innerHTML = '<span><strong>Market</strong> reclaim cancelled.</span>';
        }
      });
    };

    const renderSellerDashboard = () => {
      let host = document.getElementById('marketMine');
      if (!host) {
        host = document.createElement('details');
        host.id = 'marketMine';
        host.className = 'inscribe-details market-sell';
        marketDom.listings?.parentElement?.insertBefore(host, marketDom.listings);
      }
      const mine = state.walletSession.address
        ? marketState.listings.filter((listing) =>
            addressesEqual(listing.seller, state.walletSession.address)
          )
        : [];
      if (!mine.length) {
        host.hidden = true;
        return;
      }
      host.hidden = false;
      host.replaceChildren();
      const summary = document.createElement('summary');
      summary.textContent = `My listings (${mine.length})`;
      host.append(summary);
      const body = document.createElement('div');
      body.className = 'market-mine';
      for (const listing of mine) {
        const row = document.createElement('div');
        row.className = 'market-mine__row';
        const symbol = getMarketSettlementLabel(listing.settlement);
        const sponsored = isSponsoredMarket(listing.entry);
        const publicBlockReason = getListingPublicBlockReason(listing);
        const info = document.createElement('div');
        info.className = 'market-card__meta';
        const priceText = formatMarketPriceWithUsd(listing.price, listing.settlement, state.usdPriceBook);
        const budgetText = sponsored && listing.budgetRemaining !== null
          ? ` · deposit ${formatAssetAmount(listing.feeBudget ?? listing.budgetRemaining, 6, 'STX')}, ${formatAssetAmount(listing.budgetRemaining, 6, 'STX')} remaining`
          : '';
        const listingStatus = publicBlockReason === 'legacy-nft'
          ? 'not shown to buyers — cancel, migrate to v3, then relist'
          : publicBlockReason === 'broken-market'
            ? 'not shown to buyers — cancel and relist on a supported market'
            : listing.soldAt !== null
              ? 'SOLD — settlement pending'
              : 'live';
        info.textContent = `#${listing.tokenId} · ${priceText} · ${listingStatus}${budgetText}`;
        const actions = document.createElement('div');
        actions.className = 'market-card__actions';
        if (listing.soldAt === null) {
          const cancelBtn = document.createElement('button');
          cancelBtn.type = 'button';
          cancelBtn.className = 'market-chip';
          cancelBtn.textContent = publicBlockReason
            ? 'Cancel listing (return NFT)'
            : 'Cancel (return NFT + deposit)';
          cancelBtn.addEventListener('click', () => { void marketCancel(listing); });
          actions.append(cancelBtn);
          if (publicBlockReason === 'legacy-nft') {
            const migrate = document.createElement('a');
            migrate.className = 'market-chip';
            migrate.href = '/web/migrate.html';
            migrate.target = '_self';
            migrate.textContent = 'Migration guide';
            actions.append(migrate);
          }
        } else if (sponsored && (listing.budgetRemaining ?? 0n) > 0n) {
          const reclaimBtn = document.createElement('button');
          reclaimBtn.type = 'button';
          reclaimBtn.className = 'market-chip';
          reclaimBtn.textContent = 'Reclaim deposit';
          reclaimBtn.addEventListener('click', () => { void marketReclaim(listing); });
          actions.append(reclaimBtn);
          const note = document.createElement('span');
          note.className = 'market-card__meta';
          note.textContent = 'Usually automatic; self-reclaim unlocks ~24h after the sale if the relayer has not settled.';
          actions.append(note);
        }
        row.append(info, actions);
        body.append(row);
      }
      host.append(body);
    };

    // Fast path: the edge-cached aggregate endpoint (functions/market/listings)
    // turns ~1+N Hiro reads per market into ONE cached request. Falls back to
    // direct reads when unavailable (local dev without wrangler).
    const loadListingsFromCache = async ({ seller = null, allowEmpty = false } = {}) => {
      const query = seller ? `?seller=${encodeURIComponent(seller)}` : '';
      const response = await fetch(`/market/listings${query}`);
      if (!response.ok) throw new Error(`cache endpoint ${response.status}`);
      const payload = await response.json();
      // Never trust an empty or degraded cache answer: a transient upstream
      // failure server-side must not render as "no listings" when listings
      // exist on-chain. Throwing here falls back to direct reads.
      if (payload.degraded === true || (!allowEmpty && !(payload.listings ?? []).length)) {
        throw new Error('cache empty or degraded - verifying with direct reads');
      }
      const byId = new Map(
        marketEntriesForNetwork().map((entry) => [getMarketContractId(entry), entry])
      );
      return (payload.listings ?? [])
        .map((row) => {
          const entry = byId.get(row.contractId);
          if (!entry) return null;
          return {
            entry,
            contractId: row.contractId,
            settlement: getMarketSettlementAsset(entry.paymentTokenContractId ?? null),
            listingId: BigInt(row.listingId),
            seller: row.seller,
            nftContract: row.nftContract,
            tokenId: BigInt(row.tokenId),
            price: BigInt(row.price),
            createdAt: row.createdAt !== null ? BigInt(row.createdAt) : null,
            feeBudget: row.feeBudget !== null ? BigInt(row.feeBudget) : null,
            claimed: row.claimed !== null ? BigInt(row.claimed) : null,
            budgetRemaining: row.budgetRemaining !== null ? BigInt(row.budgetRemaining) : null,
            soldAt: row.soldAt !== null && row.soldAt !== undefined ? BigInt(row.soldAt) : null
          };
        })
        .filter(Boolean);
    };

    const renderWalletMarketListings = () => {
      const host = dom.walletMarketListings;
      const body = dom.walletMarketListingsBody;
      if (!host || !body) return;
      const viewingAddress = getViewingWalletAddress();
      const listingState = state.walletMarketListings;
      const listings = viewingAddress && addressesEqual(listingState.address, viewingAddress)
        ? listingState.listings.filter((listing) => {
            if (listing.soldAt !== null) return false;
            if (isListingPubliclyBuyable(listing)) return true;
            return !!state.walletSession.address &&
              addressesEqual(state.walletSession.address, listing.seller);
          })
        : [];
      if (listings.length === 0) {
        host.hidden = true;
        body.replaceChildren();
        return;
      }
      host.hidden = false;
      host.open = true;
      if (dom.walletMarketListingsSummary) {
        dom.walletMarketListingsSummary.textContent = `Listed / escrowed (${listings.length})`;
      }
      body.replaceChildren(
        ...listings.map((listing) => {
          const publicBlockReason = getListingPublicBlockReason(listing);
          const row = document.createElement('div');
          row.className = 'market-mine__row wallet-market-listing__row';
          const thumb = document.createElement('a');
          thumb.className = 'market-thumb wallet-market-listing__thumb';
          thumb.href = `/xplorer?token=${listing.tokenId}`;
          thumb.target = '_self';
          thumb.dataset.marketThumb = `${listing.contractId}:${listing.listingId}`;
          thumb.setAttribute('aria-label', `View inscription #${listing.tokenId}`);
          thumb.append(
            Object.assign(document.createElement('span'), {
              className: 'market-thumb__label',
              textContent: 'Loading…'
            })
          );
          const content = document.createElement('div');
          content.className = 'wallet-market-listing__content';
          const info = document.createElement('div');
          info.className = 'market-card__meta';
          const availabilityText = publicBlockReason === 'legacy-nft'
            ? 'not shown to buyers — cancel, migrate to v3, then relist'
            : publicBlockReason === 'broken-market'
              ? 'not shown to buyers — cancel and relist on a supported market'
              : 'held safely in market escrow';
          info.textContent = `#${listing.tokenId} · ${formatMarketPriceWithUsd(
            listing.price,
            listing.settlement,
            state.usdPriceBook
          )} · ${availabilityText} · seller: ${getViewingWalletLabel()}`;
          const actions = document.createElement('div');
          actions.className = 'market-card__actions';
          if (!publicBlockReason) {
            const view = document.createElement('a');
            view.className = 'market-chip';
            view.href = '/market';
            view.target = '_self';
            view.textContent = 'View market';
            actions.append(view);
          }
          if (
            state.walletSession.address &&
            addressesEqual(state.walletSession.address, listing.seller)
          ) {
            const cancel = document.createElement('button');
            cancel.type = 'button';
            cancel.className = 'market-chip';
            cancel.textContent = publicBlockReason
              ? 'Cancel listing (return NFT)'
              : 'Unlist / change price';
            cancel.title = 'The market contract requires cancel and relist to change price.';
            cancel.addEventListener('click', () => {
              void marketCancel(listing, dom.walletMarketListingsStatus);
            });
            actions.append(cancel);
            if (publicBlockReason === 'legacy-nft') {
              const migrate = document.createElement('a');
              migrate.className = 'market-chip';
              migrate.href = '/web/migrate.html';
              migrate.target = '_self';
              migrate.textContent = 'Migration guide';
              actions.append(migrate);
            }
          }
          content.append(info, actions);
          row.append(thumb, content);
          return row;
        })
      );
      void hydrateMarketThumbnails(marketState.run, listings, body);
    };

    const refreshWalletMarketListings = async (walletAddress) => {
      if (!walletAddress || state.explorerMode) return;
      const requestId = (state.walletMarketListings.requestId ?? 0) + 1;
      state.walletMarketListings = { address: walletAddress, listings: [], requestId };
      renderWalletMarketListings();
      let listings = [];
      try {
        listings = await loadListingsFromCache({ seller: walletAddress, allowEmpty: true });
      } catch {
        const perContract = await Promise.all(
          marketEntriesForNetwork().map((entry) => readMarketListings(entry).catch(() => []))
        );
        listings = perContract.flat();
      }
      if (
        requestId !== state.walletMarketListings.requestId ||
        !addressesEqual(walletAddress, getViewingWalletAddress())
      ) {
        return;
      }
      state.walletMarketListings = {
        address: walletAddress,
        listings: listings.filter((listing) => addressesEqual(listing.seller, walletAddress)),
        requestId
      };
      renderWalletMarketListings();
    };

    const loadMarketPage = async (params = null) => {
      const run = ++marketState.run;
      if (!marketDom.listings) return;
      if (marketDom.badge) marketDom.badge.textContent = state.contract.network;
      // USD conversion: fetch spot rates in the background and re-render the
      // cards once available (asset-only prices show in the meantime).
      void loadUsdPriceBook().then(() => {
        if (run === marketState.run && state.usdPriceBook) {
          renderMarketListings();
          renderSellerDashboard();
        }
      });
      renderMarketToolbar();
      populateSellMarkets();
      const listParam = params?.get?.('list');
      if (listParam && /^\d+$/.test(listParam)) {
        openSellForToken(listParam);
      }
      marketDom.status.innerHTML = '<span><strong>Market</strong> loading listings…</span>';
      try {
        let listings;
        try {
          listings = await loadListingsFromCache();
          debugLog('market', 'listings served from edge cache', { count: listings.length });
        } catch {
          const perContract = await Promise.all(
            marketEntriesForNetwork().map((entry) => readMarketListings(entry).catch(() => []))
          );
          listings = perContract.flat();
        }
        if (run !== marketState.run) return;
        marketState.listings = listings.sort((a, b) => (b.listingId > a.listingId ? 1 : -1));
        renderMarketListings();
        renderSellerDashboard();
      } catch (error) {
        if (run !== marketState.run) return;
        marketDom.status.innerHTML = '<span><strong>Market</strong> could not load listings.</span>';
        debugLog('market', 'load failed', { error: String(error?.message ?? error) });
      }
    };


    // --- Drops: sponsored free claims (data-page 'drops') -------------------
    // Reuses the market module's thumbnail/media caches and card styling; the
    // drops contract exposes market-shaped read-onlys, so reads look identical.
    const dropsState = { run: 0, drops: [] };
    const dropsDom = {
      status: $('dropsStatus'),
      listings: $('dropsListings'),
      badge: $('dropsNetworkBadge'),
      create: $('dropsCreate'),
      createTokenId: $('dropsCreateTokenId'),
      createGroup: $('dropsCreateGroup'),
      createDeposit: $('dropsCreateDeposit'),
      createButton: $('dropsCreateButton'),
      createStatus: $('dropsCreateStatus')
    };
    const dropsEntriesForNetwork = () =>
      DROPS_REGISTRY.filter((entry) => entry.network === state.contract.network);
    let dropsQuote = null; // deposit quote from the relayer (ustx)

    const readDrops = async (entry) => {
      const contractId = `${entry.address}.${entry.contractName}`;
      const lastJson = await callReadOnlyJson({
        contractId,
        functionName: 'get-last-drop-id',
        network: entry.network
      });
      const lastId = BigInt(lastJson?.value?.value ?? 0);
      const results = [];
      const floor = lastId > BigInt(MARKET_LISTINGS_PER_CONTRACT)
        ? lastId - BigInt(MARKET_LISTINGS_PER_CONTRACT)
        : 0n;
      for (let id = lastId; id >= floor; id -= 1n) {
        try {
          const json = await callReadOnlyJson({
            contractId,
            functionName: 'get-drop',
            args: [uintCV(id)],
            network: entry.network
          });
          const tuple = unwrapBindingTuple(json);
          if (!tuple) continue;
          const claimedRaw = tuple['claimed-at']?.value ?? null;
          results.push({
            entry,
            contractId,
            dropId: id,
            // market-compatible keys so marketMediaFor/thumbnail caches work
            listingId: id,
            creator: String(tuple.creator.value),
            nftContract: String(tuple['nft-contract'].value),
            tokenId: BigInt(tuple['token-id'].value),
            groupId: BigInt(tuple['group-id'].value),
            feeBudget: tuple['fee-budget'] ? BigInt(tuple['fee-budget'].value) : null,
            budgetRemaining: tuple['budget-remaining'] ? BigInt(tuple['budget-remaining'].value) : null,
            claimedAt: claimedRaw === null || claimedRaw === undefined ? null : BigInt(claimedRaw.value ?? claimedRaw)
          });
        } catch {
          // sparse ids / settled drops: skip
        }
        if (id === 0n) break;
      }
      return results;
    };

    // Claims cost the claimer nothing, so the only post-condition is the NFT
    // leaving escrow — a "send exactly 0 STX" condition just confuses wallets.
    const dropClaimPostConditions = (drop) => {
      const [nftAddress, nftName] = drop.nftContract.split('.');
      return [
        buildContractTransferPostCondition({
          nftContract: { address: nftAddress, contractName: nftName, network: drop.entry.network },
          senderContract: {
            address: drop.entry.address,
            contractName: drop.entry.contractName,
            network: drop.entry.network
          },
          tokenId: drop.tokenId
        })
      ];
    };

    const dropClaimSelfPaid = (drop) => {
      const [nftAddress, nftName] = drop.nftContract.split('.');
      const postConditions = dropClaimPostConditions(drop);
      dropsDom.status.innerHTML = '<span><strong>Drops</strong> confirm the claim in your wallet…</span>';
      showContractCall({
        contractAddress: drop.entry.address,
        contractName: drop.entry.contractName,
        functionName: 'claim',
        functionArgs: [contractPrincipalCV(nftAddress, nftName), uintCV(drop.dropId)],
        network: drop.entry.network,
        stxAddress: state.walletSession.address,
        postConditionMode: PostConditionMode.Deny,
        postConditions,
        onFinish: (payload) => {
          const txId = payload?.txId ?? payload?.txid ?? '';
          dropsDom.status.innerHTML = `<span><strong>Drops</strong> claim submitted${txId ? ` — tx ${txId}` : ''}.</span><span class="badge green">claimed</span>`;
        },
        onCancel: () => {
          dropsDom.status.innerHTML = '<span><strong>Drops</strong> claim cancelled.</span>';
        }
      });
    };

    const dropClaim = async (drop) => {
      if (!state.walletSession.isConnected || !state.walletSession.address) {
        dropsDom.status.innerHTML = '<span><strong>Drops</strong> connect a wallet to claim — new wallets work, no STX needed.</span>';
        return;
      }
      const claimantAddress = state.walletSession.address;
      const [nftAddress, nftName] = drop.nftContract.split('.');
      const postConditions = dropClaimPostConditions(drop);
      dropsDom.status.innerHTML = '<span><strong>Drops</strong> confirm the free claim in your wallet (fee 0)…</span>';
      // Xverse's stx_callContract signs AND broadcasts even with
      // sponsored: true; broadcasting a sponsored tx before the relayer
      // countersigns fails SignatureValidation (the sponsor slot is empty).
      // So we build the unsigned sponsored tx ourselves and ask the wallet
      // to sign it via stx_signTransaction with broadcast: false.
      let signed = null;
      try {
        signed = await signSponsoredContractCall({
          contractAddress: drop.entry.address,
          contractName: drop.entry.contractName,
          functionName: 'claim',
          functionArgs: [contractPrincipalCV(nftAddress, nftName), uintCV(drop.dropId)],
          network: drop.entry.network,
          stxAddress: claimantAddress,
          postConditionMode: PostConditionMode.Deny,
          postConditions
        });
      } catch (error) {
        debugLog('drops', 'sponsored signing unavailable', { error: String(error?.message ?? error) }, 'warn');
        dropsDom.status.innerHTML = `<span><strong>Drops</strong> sponsored signing unavailable (${String(error?.message ?? error)}) — claiming self-paid instead.</span>`;
        dropClaimSelfPaid(drop);
        return;
      }
      if (!signed) {
        dropsDom.status.innerHTML = '<span><strong>Drops</strong> claim cancelled.</span>';
        return;
      }
      if (
        !state.walletSession.isConnected ||
        !addressesEqual(state.walletSession.address, claimantAddress)
      ) {
        dropsDom.status.innerHTML = '<span><strong>Drops</strong> wallet changed while signing — claim again with the active account.</span>';
        renderDrops();
        return;
      }
      debugLog('drops', 'sponsored claim signed', {
        dropId: drop.dropId.toString(),
        txBytes: signed.txRaw.length / 2
      });
      dropsDom.status.innerHTML = '<span><strong>Drops</strong> submitting to the sponsor relayer…</span>';
      {
        try {
          const base = (drop.entry.sponsorApi ?? '/').replace(/\/+$/, '');
          const r = await fetch(`${base}/sponsor/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              txHex: signed.txRaw,
              contractId: drop.contractId,
              listingId: drop.dropId.toString()
            })
          });
          const body = await r.json().catch(() => ({}));
          if (!r.ok) throw new Error(body?.message ?? `relayer ${r.status}`);
          const buyTx = body?.txids?.buy ?? '';
          debugLog('drops', 'sponsored claim broadcast', { jobId: body?.id ?? null, buyTx });
          dropsDom.status.innerHTML = `<span><strong>Drops</strong> claim sponsored and broadcast${buyTx ? ` — tx ${buyTx}` : ''}. The inscription lands in your wallet when it confirms.</span><span class="badge green">no STX needed</span>`;
        } catch (error) {
          debugLog('drops', 'relayer submit failed', { error: String(error?.message ?? error) }, 'warn');
          dropsDom.status.innerHTML = `<span><strong>Drops</strong> sponsorship failed (${String(error?.message ?? error)}) — you can claim self-paid instead.</span>`;
        }
      }
    };

    const hydrateDropThumbnails = async (run, drops) => {
      await runLimited(drops, MARKET_THUMB_HYDRATION_CONCURRENCY, async (drop) => {
        if (run !== dropsState.run) return;
        const media = await marketMediaFor(drop);
        if (run !== dropsState.run) return;
        const slot = dropsDom.listings?.querySelector(
          `[data-drop-thumb="${drop.contractId}:${drop.dropId}"]`
        );
        if (!slot) return;
        if (media?.kind === 'html-live') {
          const frame = document.createElement('iframe');
          frame.className = 'market-thumb__frame';
          frame.title = `Inscription #${drop.tokenId} preview`;
          frame.sandbox = 'allow-scripts';
          frame.referrerPolicy = 'no-referrer';
          frame.loading = 'lazy';
          frame.setAttribute('scrolling', 'no');
          frame.srcdoc = media.html;
          slot.replaceChildren(frame);
          slot.classList.add('market-thumb--media');
        } else if (media?.kind === 'text') {
          const pre = document.createElement('div');
          pre.className = 'market-thumb__snippet';
          pre.textContent = media.text;
          slot.replaceChildren(pre);
          slot.classList.add('market-thumb--media');
        } else if (media?.kind === 'video' && media.url) {
          const video = document.createElement('video');
          video.src = media.url;
          video.muted = true;
          video.loop = true;
          video.autoplay = true;
          video.playsInline = true;
          slot.replaceChildren(video);
          slot.classList.add('market-thumb--media');
        } else if (media?.url && media.kind !== 'html-live') {
          const img = document.createElement('img');
          img.src = media.url;
          img.alt = `Inscription #${drop.tokenId}`;
          img.loading = 'lazy';
          slot.replaceChildren(img);
          slot.classList.add('market-thumb--media');
        } else {
          slot.replaceChildren(
            Object.assign(document.createElement('span'), {
              className: 'market-thumb__label',
              textContent: `#${drop.tokenId}`
            })
          );
        }
      });
    };

    const renderDrops = () => {
      if (!dropsDom.listings) return;
      const run = dropsState.run;
      const live = dropsState.drops.filter((drop) => drop.claimedAt === null);
      if (!live.length) {
        dropsDom.listings.replaceChildren();
        dropsDom.status.innerHTML = '<span><strong>Drops</strong> no live drops right now — create one below, or check back soon.</span>';
        return;
      }
      dropsDom.status.innerHTML = `<span><strong>Drops</strong> ${live.length} free claim${live.length === 1 ? '' : 's'} available.</span>`;
      dropsDom.listings.replaceChildren(
        ...live.map((drop) => {
          const card = document.createElement('article');
          card.className = 'market-card';

          const thumb = document.createElement('a');
          thumb.className = 'market-thumb';
          thumb.href = `/xplorer?token=${drop.tokenId}`;
          thumb.target = '_self';
          thumb.dataset.dropThumb = `${drop.contractId}:${drop.dropId}`;
          thumb.setAttribute('aria-label', `View inscription #${drop.tokenId}`);
          thumb.append(
            Object.assign(document.createElement('span'), {
              className: 'market-thumb__label',
              textContent: 'Loading…'
            })
          );

          const badges = document.createElement('div');
          badges.className = 'market-card__badge-row';
          badges.innerHTML = '<span class="badge green">Free claim</span><span class="badge">No STX needed</span>';

          const price = document.createElement('div');
          price.className = 'market-card__price';
          price.textContent = 'Free';

          const meta = document.createElement('div');
          meta.className = 'market-card__meta';
          meta.textContent = `Inscription #${drop.tokenId} · drop #${drop.dropId} · from `;
          const creatorSpan = document.createElement('span');
          applyBnsName(creatorSpan, drop.creator);
          meta.append(creatorSpan);

          const actions = document.createElement('div');
          actions.className = 'market-card__actions';
          const isMine =
            state.walletSession.isConnected &&
            !!state.walletSession.address &&
            addressesEqual(state.walletSession.address, drop.creator);
          if (isMine) {
            const cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.className = 'market-chip';
            cancelBtn.textContent = 'Cancel drop (reclaim)';
            cancelBtn.addEventListener('click', () => {
              const [nftAddress, nftName] = drop.nftContract.split('.');
              dropsDom.status.innerHTML = '<span><strong>Drops</strong> confirm the cancel in your wallet…</span>';
              showContractCall({
                contractAddress: drop.entry.address,
                contractName: drop.entry.contractName,
                functionName: 'cancel',
                functionArgs: [contractPrincipalCV(nftAddress, nftName), uintCV(drop.dropId)],
                network: drop.entry.network,
                stxAddress: state.walletSession.address,
                postConditionMode: PostConditionMode.Deny,
                postConditions: marketEscrowPostConditions(drop),
                onFinish: () => {
                  dropsDom.status.innerHTML = '<span><strong>Drops</strong> cancel submitted — NFT and deposit return when it confirms.</span>';
                },
                onCancel: () => {
                  dropsDom.status.innerHTML = '<span><strong>Drops</strong> cancel aborted.</span>';
                }
              });
            });
            actions.append(cancelBtn);
          } else {
            const claimBtn = document.createElement('button');
            claimBtn.type = 'button';
            claimBtn.className = 'market-chip';
            claimBtn.textContent = 'Claim free — no STX needed';
            claimBtn.addEventListener('click', () => { void dropClaim(drop); });
            actions.append(claimBtn);
          }

          card.append(thumb, badges, price, meta, actions);
          return card;
        })
      );
      void hydrateDropThumbnails(run, live);
    };

    const updateDropsDepositHint = async () => {
      if (!dropsDom.createDeposit) return;
      const entry = dropsEntriesForNetwork()[0];
      if (!entry) return;
      dropsDom.createDeposit.textContent = 'Fetching sponsorship deposit quote...';
      try {
        const base = (entry.sponsorApi ?? '/').replace(/\/+$/, '');
        const r = await fetch(`${base}/sponsor/quote`, { method: 'POST' });
        if (!r.ok) throw new Error(String(r.status));
        const body = await r.json();
        dropsQuote = BigInt(body.budgetUstx ?? '60000');
      } catch {
        dropsQuote = 60_000n;
      }
      dropsDom.createDeposit.textContent =
        `Sponsorship deposit: ${formatAssetAmount(dropsQuote, 6, 'STX')} — covers the claimer's network fee so they need zero STX; the unused part refunds to you after the claim or on cancel.`;
    };

    const dropsCreateDrop = async () => {
      const entry = dropsEntriesForNetwork()[0];
      if (!entry) return;
      if (!state.walletSession.isConnected || !state.walletSession.address) {
        dropsDom.createStatus.textContent = 'Connect a wallet to create a drop.';
        return;
      }
      const tokenIdRaw = dropsDom.createTokenId?.value?.trim();
      if (!/^\d+$/.test(tokenIdRaw ?? '')) {
        dropsDom.createStatus.textContent = 'Enter the inscription number you want to drop.';
        return;
      }
      const tokenId = BigInt(tokenIdRaw);
      const groupRaw = dropsDom.createGroup?.value?.trim();
      // A shared batch id limits claims to one per person per batch; leaving it
      // blank gives the drop a unique id (no per-person limit).
      const groupId = /^\d+$/.test(groupRaw ?? '')
        ? BigInt(groupRaw)
        : BigInt(Date.now()) * 1000n + BigInt(Math.floor(Math.random() * 1000));
      const budget = dropsQuote ?? 60_000n;

      dropsDom.createStatus.textContent = 'Checking ownership...';
      try {
        const owner = await state.client.getOwner(tokenId, state.walletSession.address);
        if (!owner || owner !== state.walletSession.address) {
          dropsDom.createStatus.textContent = owner
            ? `Inscription #${tokenId} is owned by ${owner.slice(0, 8)}..., not your wallet.`
            : `Inscription #${tokenId} not found.`;
          return;
        }
      } catch {
        dropsDom.createStatus.textContent = 'Could not verify ownership - try again.';
        return;
      }

      const postConditions = [
        buildTransferPostCondition({
          contract: state.contract,
          senderAddress: state.walletSession.address,
          tokenId
        }),
        makeStandardSTXPostCondition(
          state.walletSession.address,
          FungibleConditionCode.Equal,
          budget
        )
      ];
      dropsDom.createStatus.textContent = 'Confirm the drop in your wallet...';
      showContractCall({
        contractAddress: entry.address,
        contractName: entry.contractName,
        functionName: 'create-drop',
        functionArgs: [
          contractPrincipalCV(state.contract.address, state.contract.contractName),
          uintCV(tokenId),
          uintCV(budget),
          uintCV(groupId)
        ],
        network: entry.network,
        stxAddress: state.walletSession.address,
        postConditionMode: PostConditionMode.Deny,
        postConditions,
        onFinish: (payload) => {
          const txId = payload?.txId ?? payload?.txid ?? '';
          dropsDom.createStatus.textContent = `Drop submitted${txId ? ` - tx ${txId}` : ''}. It appears here once confirmed.`;
        },
        onCancel: () => {
          dropsDom.createStatus.textContent = 'Drop cancelled.';
        }
      });
    };

    dropsDom.createButton?.addEventListener('click', () => { void dropsCreateDrop(); });

    const loadDropsPage = async () => {
      const run = ++dropsState.run;
      if (!dropsDom.listings) return;
      if (dropsDom.badge) dropsDom.badge.textContent = state.contract.network;
      void updateDropsDepositHint();
      dropsDom.status.innerHTML = '<span><strong>Drops</strong> loading…</span>';
      try {
        const perContract = await Promise.all(
          dropsEntriesForNetwork().map((entry) => readDrops(entry).catch(() => []))
        );
        if (run !== dropsState.run) return;
        dropsState.drops = perContract.flat().sort((a, b) => (b.dropId > a.dropId ? 1 : -1));
        renderDrops();
      } catch (error) {
        if (run !== dropsState.run) return;
        dropsDom.status.innerHTML = '<span><strong>Drops</strong> could not load drops.</span>';
        debugLog('drops', 'load failed', { error: String(error?.message ?? error) });
      }
    };

    const switchToPage = async (page, params = null) => {
      const run = ++pageSwitchRun;
      PAGE_MODE = page;
      document.documentElement.dataset.page = page;
      document.title = PAGE_TITLES[page] ?? PAGE_TITLES.home;
      window.scrollTo({ top: 0 });
      if (page === 'wizard') {
        // Load once, then leave the frame mounted while users visit other tabs.
        // This preserves dropped files, active jobs, and progress in the Wizard.
        ensureWizardFrame();
      }
      if (page === 'xplorer') {
        if (params && (await openPublicViewFromParams(params))) {
          if (run === pageSwitchRun) {
            updateControls();
          }
          return;
        }
        setExplorerModeFromRequest();
        state.explorerMode = true;
        await loadExplorerMode();
        if (run === pageSwitchRun) {
          updateControls();
        }
        return;
      }
      // Leaving the explorer: drop its state so explorer-mode CSS stops
      // suppressing the other pages' panels.
      state.explorerMode = false;
      state.explorerInitialTokenId = null;
      if (page === 'home' || page === 'inscribe' || page === 'wizard') {
        state.curatedGalleryId = null;
        state.curatedGalleryTitle = null;
        state.homeLatestView = false;
        clearExampleDescription();
      }
      if (page === 'my-wallet') {
        await openMyWalletDefaultView();
      }
      if (page === 'market') {
        await loadMarketPage(params);
      }
      if (page === 'drops') {
        await loadDropsPage();
      }
      if (run === pageSwitchRun) {
        updateControls();
      }
    };

    const classifyPath = (pathname, params) => {
      const seg = (pathname.split('/').filter(Boolean)[0] || '').toLowerCase();
      if (isWizardShellRequest(pathname, params)) {
        return 'wizard';
      }
      if (seg === 'inscribe' || params.has('handoff') || params.has('handoffId')) {
        return 'inscribe';
      }
      if (seg === 'my-wallet' || seg === 'wallet') {
        return 'my-wallet';
      }
      if (seg === 'market') {
        return 'market';
      }
      if (seg === 'drops') {
        return 'drops';
      }
      if (
        seg === 'xplorer' ||
        seg === 'x' ||
        params.get('view') === 'explorer' ||
        params.has('explorer') ||
        params.has('token') ||
        params.has('inscription') ||
        params.has('wallet') ||
        params.has('showcase') ||
        params.has('gallery')
      ) {
        return 'xplorer';
      }
      return 'home';
    };

    const initialize = async () => {
      applyTheme(loadTheme());
      if (PAGE_MODE === 'wizard') {
        ensureWizardFrame();
      }
      setExplorerModeFromRequest();
      const pageParams = new URLSearchParams(window.location.search);
      const requestedGallery = pageParams.get('gallery')?.trim() || null;
      const requestedPublicWallet =
        pageParams.get('wallet')?.trim() || pageParams.get('showcase')?.trim() || null;
      if (
        !state.explorerMode &&
        PAGE_MODE === 'xplorer' &&
        !requestedGallery &&
        !requestedPublicWallet
      ) {
        // /xplorer always lands in the explorer, even when the URL carried no
        // usable token id (e.g. /x/not-a-number falls back to the latest page).
        // Gallery/wallet params instead open that public view on this page.
        state.explorerMode = true;
      }
      dom.tokenUriInput.value = DEFAULT_TOKEN_URI;
      void updateTokenUriHeadPreview();
      dom.walletLookupInput.value = '';
      updateWalletLookupInputMode();
      applyContract(state.contract);
      const walletViewRequestId = state.walletViewRequestId;
      resetSteps();
      renderTokenGridPlaceholders();
      updateWalletStatus();
      const consumedHandoff = await consumeOpusHtmlHandoff();
      if (!consumedHandoff) {
        await restoreSavedMintAttempt();
      }
      if (state.explorerMode) {
        await loadExplorerMode();
      } else {
        await fetchAdminStatus();
        // Deep links (rendered on the Xplorer page):
        //   ?gallery=<id>          → curated example gallery
        //   ?wallet= / ?showcase=  → any wallet's public ledger (address or .btc
        //                            name), optional &sel=<tokenId> to focus one.
        const openedPublicView = await openPublicViewFromParams(pageParams);
        if (openedPublicView) {
          // handled above
        } else if (PAGE_MODE === 'market') {
          await loadMarketPage(pageParams);
        } else if (PAGE_MODE === 'drops') {
          await loadDropsPage();
        } else if (
          PAGE_MODE === 'my-wallet' &&
          walletViewRequestId === state.walletViewRequestId &&
          !consumedHandoff
        ) {
          // Home, inscribe, and Wizard skip the grid preload — their pages hide the
          // wallet panel entirely.
          await openMyWalletDefaultView();
        }
      }
      updateControls();
    };

    dom.connectButton.addEventListener('click', connectWallet);
    dom.introConnectButton?.addEventListener('click', connectWallet);
    dom.introPrepareButton?.addEventListener('click', () => {
      if (PAGE_MODE !== 'inscribe') {
        window.history.pushState(null, '', '/inscribe');
        void switchToPage('inscribe');
        return;
      }
      document.getElementById('inscribeTitle')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      dom.nameInput?.focus();
    });
    dom.disconnectButton.addEventListener('click', disconnectWallet);
    dom.viewInscriptionsButton.addEventListener('click', () => {
      if (PAGE_MODE === 'home' || PAGE_MODE === 'inscribe' || PAGE_MODE === 'wizard') {
        // The wallet grid lives on its own tab now.
        window.history.pushState(null, '', '/my-wallet');
        void switchToPage('my-wallet');
        return;
      }
      scrollToWalletGrid();
    });
    dom.backToGridButton.addEventListener('click', scrollToWalletGrid);
    dom.refreshWalletButton.addEventListener('click', loadWalletInscriptions);
    dom.explorerJumpButton?.addEventListener('click', () => {
      void handleExplorerJump();
    });
    dom.explorerRandomButton?.addEventListener('click', () => {
      void jumpToRandomInscription();
    });

    // Grid keyboard navigation (Xplorer + My Wallet): ←/→ turn pages, ↑/↓ move
    // the selection. Skipped while typing, while the fullscreen viewer is open
    // (it has its own arrow handling), or with modifier keys held.
    document.addEventListener('keydown', (event) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
        return;
      }
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (state.fullscreenOpen) {
        return;
      }
      if ((PAGE_MODE !== 'xplorer' && PAGE_MODE !== 'my-wallet') || state.walletTokens.length === 0) {
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        dom.walletPrevButton?.click();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        dom.walletNextButton?.click();
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
        const direction = event.key === 'ArrowDown' ? 1 : -1;
        const currentIndex = state.walletTokens.findIndex(
          (token) => token.id === state.selectedTokenId
        );
        const nextIndex =
          currentIndex === -1
            ? 0
            : Math.min(state.walletTokens.length - 1, Math.max(0, currentIndex + direction));
        const nextToken = state.walletTokens[nextIndex];
        if (nextToken && nextToken.id !== state.selectedTokenId) {
          void selectToken(nextToken.id);
        }
      }
    });
    dom.explorerLatestButton?.addEventListener('click', () => {
      void showLatestExplorerPage();
    });
    // Explorer page arrows: proxy to the existing Prev/Next buttons so they reuse
    // the exact same paging logic, guards and enabled/disabled state.
    dom.explorerPrevPageButton?.addEventListener('click', () => {
      dom.walletPrevButton?.click();
    });
    dom.explorerNextPageButton?.addEventListener('click', () => {
      dom.walletNextButton?.click();
    });
    dom.explorerPageInput?.addEventListener('input', () => {
      if (document.activeElement === dom.explorerPageInput && dom.explorerTokenInput) {
        dom.explorerTokenInput.value = '';
      }
    });
    dom.explorerFilterInputs.forEach((input) => {
      input.addEventListener('change', () => {
        void applyExplorerFilterControls();
      });
    });
    dom.explorerFilterToggle?.addEventListener('click', () => {
      state.explorerFiltersCollapsed = !state.explorerFiltersCollapsed;
      syncExplorerFilterControls();
    });
    dom.explorerClearFiltersButton?.addEventListener('click', () => {
      void clearExplorerFilters();
    });
    [dom.explorerPageInput, dom.explorerTokenInput].forEach((input) => {
      input?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          void handleExplorerJump();
        }
      });
    });
    dom.walletLookupForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      // "Clear" (empty box or the wallet already on screen) keeps the in-place
      // reset that returns to the default feed / connected wallet.
      if (shouldClearWalletLookupOnSubmit()) {
        await viewWalletFromInput();
        return;
      }
      const raw = normalizeWalletLookupInputValue(dom.walletLookupInput.value).trim();
      if (!raw) {
        await viewWalletFromInput();
        return;
      }
      // "View" → navigate to the wallet's own URL, exactly like clicking an
      // owner/holder link. This loads the wallet through the same clean boot
      // path a shared link uses, so the address bar shows ?wallet=<name|address>
      // and the correct wallet always loads (no stale grid, preview, or URL).
      const walletParam = raw.replace(/\.btc$/i, '');
      window.location.assign(`/?wallet=${encodeURIComponent(walletParam)}`);
    });


    document.querySelectorAll('[data-wallet-showcase]').forEach((button) => {
      button.addEventListener('click', () => {
        const lookup = button.dataset.walletShowcase ?? '';
        const showcaseKey = lookup.trim().toLowerCase();

        if (!showcaseKey) {
          return;
        }

        const isTogglingOff = activeExampleDescriptionKey === showcaseKey;

        if (isTogglingOff) {
          void clearWalletLookupToConnectedWallet();
          return;
        }

        // Important:
        // DYLE uses the wallet lookup path, but viewWalletFromInput()
        // will clear instead of loading if a curated gallery is currently active.
        // So we clear the current example state first, without running the full clear/reset flow.
        cancelWalletLookup();

        state.curatedGalleryId = null;
        state.curatedGalleryTitle = null;
        state.homeLatestView = false;
        state.walletViewAddress = null;
        state.walletViewName = null;
        state.walletLookupNotice = null;

        activeExampleDescriptionKey = showcaseKey;
        setExampleDescription(showcaseKey);

        dom.walletLookupInput.value = toBtcLookupLabel(lookup);
        updateWalletLookupInputMode();

        const defaultTokenId =
          WALLET_SHOWCASE_DEFAULT_TOKEN_IDS[showcaseKey] ?? null;
        debugLog('grid', 'wallet showcase lookup started', {
          showcaseKey,
          lookup,
          normalizedLookup: dom.walletLookupInput.value,
          defaultTokenId: defaultTokenId?.toString() ?? null,
          deferSelection: defaultTokenId !== null,
          deferHydration: defaultTokenId !== null
        });

        void viewWalletFromInput({
          deferSelection: defaultTokenId !== null,
          deferHydration: defaultTokenId !== null
        }).then(async () => {

          if (defaultTokenId !== null) {
            try {
              debugLog('grid', 'wallet showcase default token focus started', {
                showcaseKey,
                defaultTokenId: defaultTokenId.toString(),
                pageCount: getWalletPageCount(),
                currentPageIndex: state.walletPageIndex
              });
              const selected = await focusWalletTokenById(defaultTokenId);

              if (!selected) {
                debugLog('grid', 'wallet showcase default token focus missed', {
                  showcaseKey,
                  defaultTokenId: defaultTokenId.toString(),
                  pageCount: getWalletPageCount()
                }, 'warn');
                appendLog(
                  `Default showcase token ${defaultTokenId.toString()} not found in this wallet view.`
                );
              } else {
                debugLog('grid', 'wallet showcase default token focus finished', {
                  showcaseKey,
                  defaultTokenId: defaultTokenId.toString(),
                  selectedTokenId: state.selectedTokenId?.toString() ?? null,
                  pageIndex: state.walletPageIndex
                });
              }
            } catch (error) {
              const message = error instanceof Error ? error.message : String(error);
              debugLog('grid', 'wallet showcase default token focus failed', {
                showcaseKey,
                defaultTokenId: defaultTokenId.toString(),
                error: message
              }, 'warn');

              appendLog(
                `Unable to auto-select showcase token ${defaultTokenId.toString()}: ${message}`
              );
            }
          }

          document.getElementById('walletTitle')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        });
      });
    });



    document.querySelectorAll('[data-curated-gallery]').forEach((button) => {
      button.addEventListener('click', () => {
        const galleryId = button.dataset.curatedGallery ?? '';

        if (!galleryId) {
          return;
        }

        const isTogglingOff =
          state.curatedGalleryId === galleryId ||
          activeExampleDescriptionKey === galleryId;
        debugLog('grid', 'curated gallery button clicked', {
          galleryId,
          isTogglingOff,
          currentGalleryId: state.curatedGalleryId,
          activeExampleDescriptionKey
        });

        if (isTogglingOff) {
          void clearWalletLookupToConnectedWallet();
          return;
        }

        activeExampleDescriptionKey = galleryId;
        void openCuratedGallery(galleryId);
      });
    });
    document.querySelectorAll('[data-latest-view]').forEach((button) => {
      button.addEventListener('click', () => {
        const isTogglingOff = activeExampleDescriptionKey === 'latest';
        if (isTogglingOff) {
          return;
        }
        void loadHomeLatestView({ scrollToGrid: true });
      });
    });
    dom.walletLookupInput.addEventListener('input', () => {
      normalizeWalletLookupField();
      if (state.walletLookupPending) {
        cancelWalletLookup();
      }
      state.walletLookupNotice = null;
      updateWalletLookupStatus();
      updateControls();
    });
    dom.walletPrevButton.addEventListener('click', async () => {
      if (state.walletPageIndex <= 0 || state.walletLoadingPage) {
        return;
      }
      debugLog('grid', 'previous page clicked', {
        fromPageIndex: state.walletPageIndex,
        toPageIndex: state.walletPageIndex - 1,
        mode: getGridModeLabel(),
        pageCount: getWalletPageCount()
      });
      state.walletPageIndex -= 1;
      try {
        await loadWalletPage();
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setStatus(dom.walletGridStatus, `<strong>Grid</strong> ${message}`, 'error', 'rose');
        appendLog(`Page load failed: ${message}`);
      }
    });
    dom.walletNextButton.addEventListener('click', async () => {
      const pageCount = getWalletPageCount();
      if (state.walletPageIndex >= pageCount - 1 || state.walletLoadingPage) {
        return;
      }
      debugLog('grid', 'next page clicked', {
        fromPageIndex: state.walletPageIndex,
        toPageIndex: state.walletPageIndex + 1,
        mode: getGridModeLabel(),
        pageCount
      });
      state.walletPageIndex += 1;
      try {
        await loadWalletPage();
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setStatus(dom.walletGridStatus, `<strong>Grid</strong> ${message}`, 'error', 'rose');
        appendLog(`Page load failed: ${message}`);
      }
    });
    const runPrepare = async () => {
      setBusy(true);
      try {
        await preparePayload();
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        appendLog(`Prepare failed: ${message}`);
        setStatus(dom.walletStatus, `<strong>Prepare failed</strong> ${message}`, 'error', 'rose');
      } finally {
        setBusy(false);
      }
    };
    autoPrepareHook = runPrepare;
    dom.prepareButton.addEventListener('click', runPrepare);
    dom.inscribeButton.addEventListener('click', runInscription);
    dom.resetInscriberButton.addEventListener('click', resetInscriberFlow);
    dom.clearInscriberButton.addEventListener('click', clearInscriberPanel);
    dom.allowDuplicateInput.addEventListener('change', updateControls);
    dom.parentIdsInput.addEventListener('input', () => {
      state.parentStatusMessage = null;
      renderParentSelection();
      updateControls();
    });
    dom.addParentsButton.addEventListener('click', applyParentInput);
    dom.clearParentsButton.addEventListener('click', clearParentIds);
    dom.transferRecipientInput.addEventListener('input', updateTransferControls);
    dom.transferButton.addEventListener('click', transferSelectedToken);
    // "List for sale" jumps to the Market page with the selected inscription
    // prefilled in the sell form (any currency, optional sponsorship).
    const listForSaleButton = $('listForSaleButton');
    listForSaleButton?.addEventListener('click', () => {
      if (state.selectedTokenId === null || state.selectedTokenId === undefined) return;
      const target = `/market?list=${state.selectedTokenId.toString()}`;
      window.history.pushState(null, '', target);
      void switchToPage('market', new URLSearchParams({ list: state.selectedTokenId.toString() }));
    });
    dom.payloadPreviewExpandButton?.addEventListener('click', openPreparedPayloadFullscreen);
    dom.fullscreenButton?.addEventListener('click', openFullscreenViewer);
    dom.previewExpandButton.addEventListener('click', openFullscreenViewer);
    dom.fullscreenCloseButton.addEventListener('click', () => {
      void closeFullscreenViewer();
    });
    dom.fullscreenPrevButton.addEventListener('click', () => {
      void navigateFullscreenSelection(-1);
    });
    dom.fullscreenNextButton.addEventListener('click', () => {
      void navigateFullscreenSelection(1);
    });
    window.addEventListener('keydown', (event) => {
      if (!state.fullscreenOpen) {
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        void closeFullscreenViewer();
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        void navigateFullscreenSelection(-1);
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        void navigateFullscreenSelection(1);
      }
    });

    dom.themeSelect.addEventListener('change', () => {
      applyTheme(dom.themeSelect.value);
    });

    dom.fileInput.addEventListener('change', () => {
      const file = dom.fileInput.files?.[0] ?? null;
      if (file) {
        setSelectedFile(file);
      }
    });
    dom.dropzone.addEventListener('click', () => dom.fileInput.click());
    dom.dropzone.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        dom.fileInput.click();
      }
    });
    dom.dropzone.addEventListener('dragover', (event) => {
      event.preventDefault();
      dom.dropzone.classList.add('dragging');
    });
    dom.dropzone.addEventListener('dragleave', () => {
      dom.dropzone.classList.remove('dragging');
    });
    dom.dropzone.addEventListener('drop', (event) => {
      event.preventDefault();
      dom.dropzone.classList.remove('dragging');
      const file = event.dataTransfer?.files?.[0] ?? null;
      if (file) {
        setSelectedFile(file);
      }
    });
    // ---- File vs Text tabs: mode toggle, live byte stats, instant text cost ----
    const TEXT_MAX_BYTES = 16384; // product cap: text stays <= 16 KB = one chunk = one transaction
    const textByteEncoder = new TextEncoder();
    const textBytes = () => textByteEncoder.encode(dom.textPayload.value).length;
    // Text is always one chunk, so the Xtrata protocol fee is flat — quote it ONCE and reuse it.
    // The network (miner) fee is the only size-dependent part, so we LADDER it by size band:
    // <=100 B, <=500 B, <=1 KB, then every 1 KB up to 16 KB. Each band is charged at its ceiling
    // (a slight over-estimate, never an under-quote), so tiny inscriptions read cheap and the cost
    // only steps up as the text grows. Computed locally — no per-keystroke quoting.
    let textXtrataFeeMicroStx = null; // flat Xtrata fee for one chunk (quoted once)
    const textFeeTier = (bytes) => {
      if (bytes <= 100) return 100;
      if (bytes <= 500) return 500;
      if (bytes <= 1024) return 1024;
      return Math.min(TEXT_MAX_BYTES, Math.ceil(bytes / 1024) * 1024); // every 1 KB up to 16 KB
    };
    const textFeeLabel = () => {
      const bytes = textBytes();
      if (bytes === 0 || textXtrataFeeMicroStx == null) return null;
      const total = BigInt(Math.round(textXtrataFeeMicroStx)) + walletMinerFeeMicroStx(textFeeTier(bytes));
      return `about ${formatMicroStxWithUsd(total, state.usdPriceBook).combined}`;
    };
    const paintTextFee = () => {
      if (!dom.textCost || dom.inscribePanelBody?.dataset.mode !== 'text') return;
      const bytes = textBytes();
      if (bytes > 0 && bytes <= TEXT_MAX_BYTES) {
        dom.textCost.textContent = textFeeLabel() || 'about … STX';
      }
    };
    const ensureTextXtrataFee = async () => {
      if (textXtrataFeeMicroStx != null) { paintTextFee(); return; }
      try {
        const q = await state.client.quoteSingleTxFee(BigInt(TEXT_MAX_BYTES), BigInt(1), getReadOnlySenderAddress());
        textXtrataFeeMicroStx = Number(q);
      } catch (_) { /* leave the placeholder; retried on next text-mode entry */ }
      paintTextFee();
    };
    const updateTextStats = () => {
      if (!dom.textStats) return;
      const s = dom.textPayload.value;
      const bytes = textByteEncoder.encode(s).length;
      dom.textStats.textContent =
        `${s.length.toLocaleString()} character${s.length === 1 ? '' : 's'} · ${bytes.toLocaleString()} byte${bytes === 1 ? '' : 's'}`;
    };
    // Reveal the chosen path. Hoisted (function decl) so setSelectedFile / boot-restore can
    // call it before the const helpers below are initialised.
    // The activity log is shared by both modes. In text mode it lives inside the
    // single "Advanced" disclosure (so the text panel reads as just type + inscribe);
    // in file/none mode it returns to its own top-level spot. Re-parenting keeps one
    // log node (and its listeners) rather than duplicating it.
    const activityLogHome = dom.activityLog
      ? { parent: dom.activityLog.parentNode, next: dom.activityLog.nextSibling }
      : null;
    const placeActivityLog = (mode) => {
      if (!dom.activityLog) return;
      if (mode === 'text') {
        if (dom.textAdvancedLogSlot && dom.activityLog.parentNode !== dom.textAdvancedLogSlot) {
          dom.textAdvancedLogSlot.appendChild(dom.activityLog);
        }
      } else if (activityLogHome && dom.activityLog.parentNode !== activityLogHome.parent) {
        activityLogHome.parent.insertBefore(dom.activityLog, activityLogHome.next);
      }
    };
    function applyInscribeMode(mode) {
      if (dom.inscribePanelBody) dom.inscribePanelBody.dataset.mode = mode;
      dom.tabFile?.classList.toggle('is-active', mode === 'file');
      dom.tabText?.classList.toggle('is-active', mode === 'text');
      dom.tabFile?.setAttribute('aria-selected', mode === 'file' ? 'true' : 'false');
      dom.tabText?.setAttribute('aria-selected', mode === 'text' ? 'true' : 'false');
      placeActivityLog(mode);
    }
    // Threads: a "reply to" inscription id becomes a dependency (existence-only reference), so the
    // text is minted as an on-chain reply via mint-single-tx-recursive. Anyone can reply to any
    // inscription — no ownership needed. The reply-to input is the source of truth.
    const syncThreadDep = () => {
      const raw = (dom.threadReplyTo?.value || '').trim();
      const valid = /^\d+$/.test(raw);
      state.handoffDependencyIds = valid ? [BigInt(raw)] : [];
      if (dom.threadReplyNote) {
        dom.threadReplyNote.textContent = valid
          ? `↳ Your text will be inscribed as a reply to #${raw}`
          : raw ? "Enter a numeric inscription id (the message you're replying to)."
          : 'Optional — turns your text into an on-chain reply. Anyone can reply to any inscription.';
      }
    };
    // File card: the Dependencies input (existence-only references). Parses a
    // numeric list into the same handoff dependency slot the mint reads. Kept
    // separate from Parents so the two are never confused.
    const syncDependencyInput = () => {
      const raw = (dom.dependencyIdsInput?.value || '').trim();
      const ids = raw.split(/[\s,]+/).filter(Boolean);
      const valid = ids.length > 0 && ids.every((s) => /^\d+$/.test(s));
      state.handoffDependencyIds = valid ? ids.map((s) => BigInt(s)) : [];
      if (dom.dependencyStatusList) {
        dom.dependencyStatusList.textContent = valid
          ? `Referencing ${ids.length} inscription${ids.length === 1 ? '' : 's'}: #${ids.join(', #')}`
          : raw
            ? 'Enter numeric inscription IDs only (e.g. 134, 90).'
            : 'No dependencies added.';
      }
      markPreparedDirty();
    };
    // Text card: cost + inscribe button (label switches to "Inscribe reply" when replying).
    const syncTextCard = () => {
      if (!dom.inscribeTextButton) return;
      const bytes = textBytes();
      const over = bytes > TEXT_MAX_BYTES;
      const replying = (state.handoffDependencyIds?.length ?? 0) > 0;
      if (dom.textCost) {
        dom.textCost.textContent =
          bytes === 0 ? 'Enter text to see the cost'
          : over ? `Over the 16 KB limit by ${(bytes - TEXT_MAX_BYTES).toLocaleString()} byte${bytes - TEXT_MAX_BYTES === 1 ? '' : 's'} — trim it`
          : (textFeeLabel() || 'about … STX');
      }
      dom.inscribeTextButton.textContent = replying ? 'Inscribe reply' : 'Inscribe text';
      // Enabled on valid text alone — the click handler connects the wallet if needed and
      // prepares on the fly (runInscription → validateMintReadiness), so we never gate on
      // state.prepared here (that left the button stuck when the background prepare didn't run).
      dom.inscribeTextButton.disabled = !(bytes > 0 && !over && !state.busy);
    };
    const setInscribeMode = (mode) => {
      applyInscribeMode(mode);
      if (mode === 'text') {
        if (state.selectedFile) setSelectedFile(null); // text drops any selected file (also clears deps)
        updateTextStats();
        void ensureTextXtrataFee(); // quote the flat Xtrata rate once, on entering text mode
        syncThreadDep(); // re-apply any reply-to (e.g. a deep link) after the clear above
        syncTextCard();
        dom.textPayload?.focus();
      } else if (mode === 'file') {
        if (dom.textPayload?.value) { dom.textPayload.value = ''; updateTextStats(); markPreparedDirty(); }
        if (dom.threadReplyTo) dom.threadReplyTo.value = '';
        syncDependencyInput(); // file mode owns dependencies via the Dependencies input
      } else { // none — back to the landing; clear both sources
        if (state.selectedFile) setSelectedFile(null);
        if (dom.textPayload?.value) { dom.textPayload.value = ''; updateTextStats(); }
        if (dom.threadReplyTo) dom.threadReplyTo.value = '';
        if (dom.dependencyIdsInput) dom.dependencyIdsInput.value = '';
        state.handoffDependencyIds = [];
        markPreparedDirty();
      }
    };
    dom.tabFile?.addEventListener('click', () => setInscribeMode('file'));
    dom.tabText?.addEventListener('click', () => setInscribeMode('text'));
    dom.inscribeChange?.addEventListener('click', () => setInscribeMode('none'));
    dom.inscribeTextButton?.addEventListener('click', () => {
      const bytes = textBytes();
      if (bytes === 0 || bytes > TEXT_MAX_BYTES) return; // hard guard — never inscribe > 16 KB of text
      runInscription();
    });
    // Hero "Galleries" button expands the (collapsed-by-default) galleries list as it scrolls to it.
    document.querySelector('a[href="#homeExamples"]')?.addEventListener('click', () => {
      const galleries = document.getElementById('homeExamples');
      if (galleries) galleries.open = true;
    });
    // Thread deep link: /inscribe?reply=<tokenId> opens the text tab pre-filled as a reply.
    if (document.documentElement.dataset.page === 'inscribe' && dom.threadReplyTo) {
      const replyTo = (new URLSearchParams(window.location.search).get('reply') || '').trim();
      if (/^\d+$/.test(replyTo)) {
        dom.threadReplyTo.value = replyTo;
        const td = document.getElementById('textAdvancedDetails');
        if (td) td.open = true;
        setInscribeMode('text'); // switches to text + re-applies the reply-to dependency
      }
    }

    dom.textPayload.addEventListener('input', () => {
      if (dom.textPayload.value.length > 0 && state.selectedFile) {
        setSelectedFile(null);
      }
      updateTextStats();
      markPreparedDirty(); // clear any prior prepare; runInscription re-prepares on click
      syncTextCard();      // cost is the cached flat rate; button enables on valid text
    });
    dom.threadReplyTo?.addEventListener('input', () => {
      syncThreadDep();     // reply-to id → dependency (an on-chain reply, minted recursively)
      markPreparedDirty();
      syncTextCard();
    });
    dom.nameInput.addEventListener('input', markPreparedDirty);
    dom.dependencyIdsInput?.addEventListener('input', syncDependencyInput);
    dom.payloadType.addEventListener('change', markPreparedDirty);
    dom.tokenUriInput.addEventListener('input', () => {
      markPreparedDirty();
      queueTokenUriHeadPreviewUpdate();
    });

    window.addEventListener('beforeunload', (event) => {
      // Warn before leaving mid-inscription: a transaction may be signing or
      // broadcasting. Progress is saved locally and resumes on reopen, but the
      // native prompt stops an accidental close from interrupting the current tx.
      if (state.busy) {
        event.preventDefault();
        event.returnValue = '';
        return '';
      }
    });

    window.addEventListener('pagehide', () => {
      if (state.tokenUriPreviewTimer !== null) {
        window.clearTimeout(state.tokenUriPreviewTimer);
      }
      revokePayloadPreview();
      revokeTokenPreview();
      revokeFullscreenPreview();
      revokeGridThumbUrls();
    });

    void initialize();

    // SPA tab navigation: same-tab site links (nav, cards, example chips)
    // switch pages client-side — the radio and wallet session never restart.
    // Links outside the shell page modes (/wizard, /g/…, static apps) navigate
    // normally, as do modified-clicks (new tab/window).
    document.addEventListener('click', (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const origin = event.target instanceof Element ? event.target : null;
      const link = origin?.closest('a[target="_self"][href^="/"]');
      if (!link) {
        return;
      }
      const url = new URL(link.getAttribute('href') ?? '/', window.location.origin);
      const page = classifyPath(url.pathname, url.searchParams);
      const seg = (url.pathname.split('/').filter(Boolean)[0] || '').toLowerCase();
      const isSitePagePath =
        url.pathname === '/' ||
        ['inscribe', 'my-wallet', 'wallet', 'xplorer', 'x', 'market', 'drops'].includes(seg);
      if (!isSitePagePath) {
        return; // /wizard, /g/…, docs, static apps → real navigation
      }
      event.preventDefault();
      window.history.pushState(null, '', url.pathname + url.search + url.hash);
      void switchToPage(page, url.searchParams);
    });

    window.addEventListener('popstate', () => {
      const params = new URLSearchParams(window.location.search);
      void switchToPage(classifyPath(window.location.pathname, params), params);
    });

    // Sticky header: condense after a little scroll so the nav, connected
    // wallet and docked radio stay visible without eating vertical space.
    //
    // Oscillation protection (two layers):
    // 1. The header's LAYOUT height is locked to its expanded size, so
    //    condensing only shrinks the visible bar inside a constant-height box.
    //    Document height therefore never changes with the toggle, which makes
    //    the feedback loop (shrink → scrollY drops → expand → scrollY rises…)
    //    physically impossible. The box itself is transparent and click-through
    //    (see CSS), so the reserved space never hides or blocks content.
    // 2. A hysteresis band (condense above 64px, expand only below 8px) so
    //    trackpad jitter around a single threshold can't flutter the state.
    const siteHeader = document.getElementById('siteHeader');
    if (siteHeader) {
      let headerCondensed = false;
      const lockHeaderHeight = () => {
        // Measure the EXPANDED height (class briefly removed inside one frame
        // — no paint happens in between) and freeze the box at that size.
        const wasCondensed = siteHeader.classList.contains('is-condensed');
        siteHeader.classList.remove('is-condensed');
        siteHeader.style.height = 'auto';
        const expandedHeight = siteHeader.offsetHeight;
        const lockedHeight = `${expandedHeight}px`;
        if (siteHeader.style.height !== lockedHeight) {
          siteHeader.style.height = lockedHeight;
        }
        siteHeader.classList.toggle('is-condensed', wasCondensed);
      };
      const syncHeader = () => {
        const y = window.scrollY;
        const next = headerCondensed ? y > 8 : y > 64;
        if (next !== headerCondensed) {
          headerCondensed = next;
          siteHeader.classList.toggle('is-condensed', next);
        }
      };
      let headerResizeTimer = null;
      const queueHeaderRelock = () => {
        if (headerResizeTimer !== null) {
          window.clearTimeout(headerResizeTimer);
        }
        headerResizeTimer = window.setTimeout(lockHeaderHeight, 150);
      };
      window.addEventListener('resize', queueHeaderRelock);
      // Re-lock when the header's CONTENT genuinely changes size (connected
      // readout appearing, nav wrapping). lockHeaderHeight's class flip is
      // synchronous within one frame, so it never retriggers the observer.
      if (typeof ResizeObserver === 'function') {
        const headerObserver = new ResizeObserver(queueHeaderRelock);
        siteHeader.querySelectorAll('.topbar, .site-nav').forEach((el) => {
          headerObserver.observe(el);
        });
      }
      lockHeaderHeight();
      window.addEventListener('scroll', syncHeader, { passive: true });
      syncHeader();
    }

    // Keep the station playing: internal links to other pages open in new
    // tabs so the homepage (and its radio) is never torn down mid-song.
    document.querySelectorAll('a[href^="/"]').forEach((link) => {
      const href = link.getAttribute('href') || '';
      if (href === '/' || href.startsWith('/?') || href.startsWith('/#') || link.target) {
        return;
      }
      link.target = '_blank';
      link.rel = link.rel ? link.rel + ' noopener' : 'noopener';
    });

    // Xtrata Radio: site soundtrack, docked in the sticky header (falls back
    // to the classic floating widget if the slot is missing).
    initXtrataRadio({
      tokenIds: (CURATED_GALLERIES.find((gallery) => gallery.id === 'jim-music')?.tokenIds ?? []),
      stationName: 'XTRATA FM',
      mount: document.getElementById('radioSlot')
    });
