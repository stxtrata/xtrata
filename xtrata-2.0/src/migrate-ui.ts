import { uintCV, callReadOnlyFunction, cvToJSON, PostConditionMode } from '@stacks/transactions';
import { toStacksNetwork } from './lib/network/stacks';
import { getApiBaseUrls } from './lib/network/config';
import { parseGetBeginFeeUnit } from './lib/protocol/parsers';
import {
  buildMigrationQuote,
  mergeEscrowedMigrationItems,
  parseMigrationTokenId,
  scanMigrationHoldings,
  summarizeMigrationItems,
  type MigrationItem,
  type MigrationSourceDefinition,
  type MigrationSourceError
} from './lib/migration/quote';
import { connectWallet, disconnectWallet, showContractCall } from './lib/wallet/coordinator';
import type { WalletSession } from './lib/wallet/types';

const DEPLOYER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const CORE = 'xtrata-v3-2-3';
const ASSET = 'xtrata-inscription';
// Route every Hiro call through the dev/prod /hiro proxy, which injects the
// HIRO_API_KEY server-side (avoids browser rate limits).
const apiBase = getApiBaseUrls('mainnet')[0];
const network = toStacksNetwork('mainnet', apiBase);
// A migration is a tiny contract call — one uint arg, no inscription data — so
// the fee is pinned low and FIXED. Wallets otherwise offer wildly varying
// estimates (seen as high as 0.34 STX) for what should cost a fraction of a cent.
// 5000 uSTX = 0.005 STX. Kept as a number (not bigint) — @stacks/connect
// JSON-serializes the call options and cannot serialize a BigInt.
const FEE_USTX = 5000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Poll the proxy until the tx leaves the mempool. Bounded and talkative: gives a
// progress note every ~30s, detects dropped/replaced transactions, and times out
// after 15 minutes instead of hanging forever.
const WAIT_TIMEOUT_MS = 15 * 60 * 1000;
const waitForTx = async (
  txid: string,
  onProgress?: (message: string) => void
): Promise<'success' | 'failed' | 'dropped' | 'timeout'> => {
  const id = `0x${txid.replace(/^0x/, '')}`;
  const startedAt = Date.now();
  let lastNoteAt = 0;
  for (;;) {
    await sleep(8000);
    const elapsed = Date.now() - startedAt;
    if (elapsed > WAIT_TIMEOUT_MS) {
      return 'timeout';
    }
    if (onProgress && elapsed - lastNoteAt > 30000) {
      lastNoteAt = elapsed;
      const minutes = Math.floor(elapsed / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      onProgress(
        `still waiting for confirmation… ${minutes}m ${seconds}s elapsed (this is normal; blocks can take a few minutes)`
      );
    }
    try {
      const res = await fetch(`${apiBase}/extended/v1/tx/${id}`);
      if (!res.ok) continue;
      const json = (await res.json()) as { tx_status?: string };
      const st = json.tx_status;
      if (!st || st === 'pending') continue;
      if (st === 'success') return 'success';
      if (st.startsWith('dropped')) return 'dropped';
      return 'failed';
    } catch {
      // network blip — keep polling
    }
  }
};

const appDetails = {
  name: 'Xtrata Migration',
  icon: `${window.location.origin}/favicon.svg`
};

const SOURCES: MigrationSourceDefinition[] = [
  {
    key: 'v1',
    contractName: 'xtrata-v1-1-1',
    migrationFunction: 'migrate-from-v1',
    label: 'v1 (xtrata-v1-1-1)'
  },
  {
    key: 'v2',
    contractName: 'xtrata-v2-1-0',
    migrationFunction: 'migrate-from-v2-1-0',
    label: 'v2 (xtrata-v2-1-0)'
  },
  {
    key: 'v2-1-1',
    contractName: 'xtrata-v2-1-1',
    label: 'v2.1.1 (unsupported source)'
  }
];

type State = {
  session: WalletSession;
  items: MigrationItem[];
  sourceErrors: MigrationSourceError[];
  listingReadError: string | null;
  busyId: string | null;
  busyPhase: 'signing' | 'confirming' | null;
  scanning: boolean;
  scanRun: number;
  hasScanned: boolean;
  owned: number;
  scanned: number;
  protocolFeeMicroStx: bigint | null;
  feeReadError: string | null;
  quoteUpdatedAt: number | null;
  log: string[];
};

const state: State = {
  session: { isConnected: false },
  items: [],
  sourceErrors: [],
  listingReadError: null,
  busyId: null,
  busyPhase: null,
  scanning: false,
  scanRun: 0,
  hasScanned: false,
  owned: 0,
  scanned: 0,
  protocolFeeMicroStx: null,
  feeReadError: null,
  quoteUpdatedAt: null,
  log: []
};

const app = document.getElementById('app') as HTMLDivElement;

const note = (message: string) => {
  state.log.unshift(`${new Date().toLocaleTimeString()}  ${message}`);
  state.log = state.log.slice(0, 40);
  render();
};

const readOnly = async (
  contractName: string,
  functionName: string,
  args: ReturnType<typeof uintCV>[] = []
) => {
  const res = await callReadOnlyFunction({
    contractAddress: DEPLOYER,
    contractName,
    functionName,
    functionArgs: args,
    senderAddress: DEPLOYER,
    network
  });
  return cvToJSON(res);
};

// True if the id already exists on the v3 core (i.e. already migrated). Migrated
// tokens keep their source id and native v3 ids start above the legacy range, so
// a low source id existing on v3 means it was migrated. One cheap read per token,
// instead of loading the entire v3 mint set up front.
const existsOnV3 = async (id: bigint): Promise<boolean> => {
  const j = (await readOnly(CORE, 'get-owner', [uintCV(id)])) as { value?: { value?: unknown } };
  return j.value?.value != null;
};

const loadProtocolFee = async () => {
  try {
    const value = await callReadOnlyFunction({
      contractAddress: DEPLOYER,
      contractName: CORE,
      functionName: 'get-begin-fee-unit',
      functionArgs: [],
      senderAddress: state.session.address ?? DEPLOYER,
      network
    });
    return {
      fee: parseGetBeginFeeUnit(value),
      error: null,
      updatedAt: Date.now()
    };
  } catch (error) {
    return {
      fee: null,
      error: error instanceof Error ? error.message : String(error),
      updatedAt: null
    };
  }
};

const fetchSellerEscrowedTokens = async (address: string) => {
  const response = await fetch(`/market/listings?seller=${encodeURIComponent(address)}`);
  if (!response.ok) throw new Error(`Market listing lookup failed (${response.status}).`);
  const payload = (await response.json()) as {
    degraded?: boolean;
    listings?: Array<{
      seller?: string;
      nftContract?: string;
      tokenId?: string | number;
      soldAt?: string | number | null;
    }>;
  };
  if (payload.degraded) throw new Error('Market listing lookup is temporarily degraded.');
  const normalizedAddress = address.toUpperCase();
  return (payload.listings ?? []).flatMap((listing) => {
    if (String(listing.seller ?? '').toUpperCase() !== normalizedAddress) return [];
    if (listing.soldAt !== null && listing.soldAt !== undefined) return [];
    const source = SOURCES.find(
      (candidate) => `${DEPLOYER}.${candidate.contractName}` === listing.nftContract
    );
    if (!source || listing.tokenId === undefined) return [];
    try {
      return [{ sourceKey: source.key, tokenId: BigInt(listing.tokenId) }];
    } catch {
      return [];
    }
  });
};

// Opt-in, incremental scan. It pages every known legacy source, classifies each
// holding against v3, and merges the connected seller's market-escrowed tokens.
// Press Scan again to stop; partial results remain visible and are never quoted
// as complete.
const scan = async () => {
  if (!state.session.isConnected || !state.session.address) return;
  if (state.scanning) {
    state.scanning = false;
    return;
  } // second press = stop
  const scanRun = state.scanRun + 1;
  state.scanRun = scanRun;
  const address = state.session.address;
  state.scanning = true;
  state.hasScanned = false;
  state.items = [];
  state.sourceErrors = [];
  state.listingReadError = null;
  state.owned = 0;
  state.scanned = 0;
  note(`Scanning all known legacy cores for ${address}…`);
  render();
  try {
    const feePromise = loadProtocolFee();
    const escrowPromise = fetchSellerEscrowedTokens(address);
    const result = await scanMigrationHoldings({
      sources: SOURCES,
      shouldContinue: () => state.scanning && state.scanRun === scanRun,
      fetchPage: async (source, offset, limit) => {
        const assetId = `${DEPLOYER}.${source.contractName}::${ASSET}`;
        const url = `${apiBase}/extended/v1/tokens/nft/holdings?principal=${address}&asset_identifiers=${encodeURIComponent(assetId)}&limit=${limit}&offset=${offset}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Holdings lookup failed (${response.status}).`);
        const json = (await response.json()) as {
          total?: number;
          results?: Array<{ value?: { repr?: string } }>;
        };
        const results = json.results ?? [];
        const parsedIds = results.map((entry) => parseMigrationTokenId(entry.value?.repr));
        if (parsedIds.some((id) => id === null)) {
          throw new Error('A holding returned an unrecognised token id. Please retry.');
        }
        return {
          total: json.total ?? 0,
          resultCount: results.length,
          tokenIds: parsedIds.filter((id): id is bigint => id !== null)
        };
      },
      existsOnTarget: existsOnV3,
      onProgress: (progress) => {
        if (state.scanRun !== scanRun) return;
        state.items = progress.items;
        state.owned = progress.owned;
        state.scanned = progress.checked;
        render();
      }
    });
    let escrowed: Array<{ sourceKey: string; tokenId: bigint }> = [];
    let listingReadError: string | null = null;
    try {
      escrowed = await escrowPromise;
    } catch (error) {
      listingReadError = error instanceof Error ? error.message : String(error);
    }
    const feeResult = await feePromise;
    if (state.scanRun !== scanRun || state.session.address !== address) return;
    state.items = mergeEscrowedMigrationItems({
      items: result.items,
      escrowed,
      sources: SOURCES
    });
    state.sourceErrors = result.sourceErrors;
    state.listingReadError = listingReadError;
    state.owned = result.owned;
    state.scanned = result.checked;
    state.protocolFeeMicroStx = feeResult.fee;
    state.feeReadError = feeResult.error;
    state.quoteUpdatedAt = feeResult.updatedAt;
    state.hasScanned =
      !result.stopped && result.sourceErrors.length === 0 && !state.listingReadError;
    const summary = summarizeMigrationItems(state.items);
    if (result.stopped) {
      note('Scan stopped. Partial results are shown but no complete quote is available.');
    } else {
      note(
        `Scan complete: ${state.items.length} legacy item${state.items.length === 1 ? '' : 's'} found; ${summary.ready} ready to migrate.`
      );
    }
  } catch (error) {
    if (state.scanRun === scanRun) {
      note(`Scan error: ${error instanceof Error ? error.message : String(error)}`);
    }
  } finally {
    if (state.scanRun === scanRun) {
      state.scanning = false;
      render();
    }
  }
};

const migrationItemKey = (item: Pick<MigrationItem, 'sourceKey' | 'tokenId'>) =>
  `${item.sourceKey}:${item.tokenId.toString()}`;

const migrate = (item: MigrationItem) =>
  new Promise<void>((resolve, reject) => {
    if (!state.session.isConnected || !state.session.address) {
      reject(new Error('Connect Xverse first.'));
      return;
    }
    if (item.status !== 'ready' || !item.migrationFunction) {
      reject(new Error('This token is not currently ready to migrate. Rescan first.'));
      return;
    }
    const id = item.tokenId;
    state.busyId = migrationItemKey(item);
    state.busyPhase = 'signing';
    render();
    showContractCall({
      contractAddress: DEPLOYER,
      contractName: CORE,
      functionName: item.migrationFunction,
      functionArgs: [uintCV(id)],
      // Migration transfers the legacy NFT (and a small begin-fee in STX) into
      // the core. Allow mode is required so those transfers aren't rejected by
      // the wallet's default deny post-conditions (which aborts the migration).
      postConditionMode: PostConditionMode.Allow,
      fee: FEE_USTX,
      appDetails,
      network,
      stxAddress: state.session.address,
      onFinish: (payload: unknown) => {
        const txId =
          (payload && typeof payload === 'object' && 'txId' in (payload as Record<string, unknown>)
            ? String((payload as Record<string, unknown>).txId)
            : '') || '';
        note(`#${id} submitted → ${txId || '(no txid)'}. Waiting for on-chain confirmation…`);
        state.busyPhase = 'confirming';
        render();
        // Only resolve once the tx has actually confirmed on-chain. This is what
        // lets "Migrate all" hold the next signature until this one settles.
        void (async () => {
          if (!txId) {
            note(`#${id}: wallet returned no txid; stopping.`);
            state.busyId = null;
            render();
            reject(new Error('no txid'));
            return;
          }
          const result = await waitForTx(txId, (msg) => note(`#${id}: ${msg}`));
          state.busyId = null;
          if (result === 'timeout') {
            note(
              `#${id}: no confirmation after 15 minutes. The transaction may still land — check it in the explorer (${txId}) before retrying, to avoid a double migration.`
            );
            render();
            reject(new Error('confirmation timeout'));
            return;
          }
          if (result === 'dropped') {
            note(
              `#${id}: the transaction was dropped from the mempool (usually a fee/nonce race). Nothing moved — it is safe to press Migrate again.`
            );
            render();
            reject(new Error('tx dropped'));
            return;
          }
          if (result === 'success') {
            note(`#${id} confirmed ✓`);
            state.items = state.items.map((candidate) =>
              migrationItemKey(candidate) === migrationItemKey(item)
                ? {
                    ...candidate,
                    status: 'already-migrated',
                    detail: 'Migration confirmed during this session.'
                  }
                : candidate
            );
            render();
            // Keep the cached index accurate immediately: the new v3 token and
            // the now-escrowed legacy token both changed. Fire-and-forget.
            for (const contractId of [
              `${DEPLOYER}.${CORE}`,
              `${DEPLOYER}.${item.sourceContractName}`
            ]) {
              void fetch(`/index/${contractId}?id=${id}`, { method: 'POST' }).catch(
                () => undefined
              );
            }
            resolve();
          } else {
            note(`#${id} FAILED on-chain (${txId}). Stopping the run.`);
            render();
            reject(new Error('tx failed'));
          }
        })();
      },
      onCancel: () => {
        note(`Cancelled #${id}.`);
        state.busyId = null;
        render();
        reject(new Error('cancelled'));
      }
    });
  });

// One-signature batch migration via the xtrata-migrate-batch-v1 helper.
// Set BATCH_CONTRACT after deploying contracts/drafts/xtrata-migrate-batch-v1.clar;
// until then the button stays hidden and the sign-each flow below is used.
const BATCH_CONTRACT = ''; // e.g. 'xtrata-migrate-batch-v1'
const BATCH_LIMIT = 25;
const migrateBatch = async () => {
  if (!BATCH_CONTRACT || !state.session.address) return;
  const firstReady = state.items.find((item) => item.status === 'ready' && item.migrationFunction);
  if (!firstReady) return;
  const batchItems = state.items
    .filter((item) => item.status === 'ready' && item.sourceKey === firstReady.sourceKey)
    .slice(0, BATCH_LIMIT);
  const ids = batchItems.map((item) => item.tokenId);
  note(`Batch migrating ${ids.length} token${ids.length === 1 ? '' : 's'} in ONE transaction…`);
  state.busyId = 'batch';
  state.busyPhase = 'signing';
  render();
  const { listCV } = await import('@stacks/transactions');
  showContractCall({
    contractAddress: DEPLOYER,
    contractName: BATCH_CONTRACT,
    functionName: firstReady.sourceKey === 'v1' ? 'migrate-batch-v1' : 'migrate-batch-v2',
    functionArgs: [listCV(ids.map((id) => uintCV(id)))],
    postConditionMode: PostConditionMode.Allow,
    appDetails,
    network,
    stxAddress: state.session.address,
    onFinish: (payload: unknown) => {
      const txId =
        (payload && typeof payload === 'object' && 'txId' in (payload as Record<string, unknown>)
          ? String((payload as Record<string, unknown>).txId)
          : '') || '';
      note(`Batch submitted → ${txId}. One confirmation migrates all ${ids.length}.`);
      state.busyPhase = 'confirming';
      render();
      void (async () => {
        const result = await waitForTx(txId, (msg) => note(`batch: ${msg}`));
        state.busyId = null;
        if (result === 'success') {
          const migratedKeys = new Set(batchItems.map(migrationItemKey));
          state.items = state.items.map((item) =>
            migratedKeys.has(migrationItemKey(item))
              ? { ...item, status: 'already-migrated', detail: 'Batch migration confirmed.' }
              : item
          );
          note(`Batch confirmed ✓ — ${ids.length} tokens migrated in one transaction.`);
        } else {
          note(
            `Batch ${result}. Nothing migrated (a batch is all-or-nothing) — rescan and retry, or use sign-each.`
          );
        }
        render();
      })();
    },
    onCancel: () => {
      note('Batch cancelled.');
      state.busyId = null;
      render();
    }
  });
};

const migrateAll = async () => {
  const queue = state.items.filter((item) => item.status === 'ready' && item.migrationFunction);
  let done = 0;
  for (const item of queue) {
    try {
      await migrate(item);
      done += 1;
    } catch (error) {
      note(
        `Run stopped after ${done}/${queue.length}: ${error instanceof Error ? error.message : String(error)}. Fix or retry, then press Migrate all again — completed ids are skipped automatically.`
      );
      return;
    }
  }
  note(`Migrate all finished: ${done}/${queue.length} confirmed on v3. ✓`);
};

const connect = async () => {
  state.session = await connectWallet({ appName: appDetails.name, appIcon: appDetails.icon });
  if (!state.session.isConnected) {
    note('Wallet connection cancelled.');
    return;
  }
  note(`Connected ${state.session.address}. Press Scan & quote to check every legacy core.`);
  render();
};

const disconnect = async () => {
  await disconnectWallet();
  state.scanRun += 1;
  state.scanning = false;
  state.session = { isConnected: false };
  state.items = [];
  state.sourceErrors = [];
  state.listingReadError = null;
  state.hasScanned = false;
  state.protocolFeeMicroStx = null;
  state.feeReadError = null;
  state.quoteUpdatedAt = null;
  render();
};

const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const formatMicroStx = (amount: bigint) => {
  const whole = amount / 1_000_000n;
  const fraction = (amount % 1_000_000n).toString().padStart(6, '0').replace(/0+$/, '');
  return `${whole.toString()}${fraction ? `.${fraction}` : ''} STX`;
};

const statusLabel = (item: MigrationItem) => {
  switch (item.status) {
    case 'ready':
      return 'Ready';
    case 'already-migrated':
      return 'Already on v3';
    case 'listed-escrowed':
      return 'Cancel listing first';
    case 'unsupported':
      return 'Unsupported source';
    case 'unreadable':
      return 'Retry required';
  }
};

const render = () => {
  const connected = state.session.isConnected;
  const readyItems = state.items.filter((item) => item.status === 'ready');
  const blockedItems = state.items.filter((item) => item.status !== 'ready');
  const summary = summarizeMigrationItems(state.items);
  const quote =
    state.protocolFeeMicroStx !== null
      ? buildMigrationQuote({
          items: state.items,
          protocolFeePerItemMicroStx: state.protocolFeeMicroStx,
          miningAllowancePerItemMicroStx: BigInt(FEE_USTX)
        })
      : null;
  const discoveryWarnings = [
    ...state.sourceErrors.map((error) => `${error.sourceLabel}: ${error.message}`),
    ...(state.listingReadError ? [`Market escrow: ${state.listingReadError}`] : [])
  ];
  const quoteReady = state.hasScanned && quote !== null;
  app.innerHTML = `
    <section class="panel">
      <div class="toolbar">
        <div>${connected ? `Connected <code>${state.session.address}</code>` : 'Not connected'}</div>
        <div>
          ${
            connected
              ? '<button id="disconnect" class="secondary">Disconnect</button>'
              : '<button id="connect">Connect Xverse</button>'
          }
        </div>
      </div>
      <div class="row">
        <button id="scan" ${connected && !state.busyId ? '' : 'disabled'}>${state.scanning ? 'Stop scan' : 'Scan & quote all'}</button>
        <button id="all" ${connected && quoteReady && readyItems.length > 0 && !state.busyId && !state.scanning ? '' : 'disabled'}>Migrate all ready (sign each)</button>
        ${BATCH_CONTRACT ? `<button id="batch" ${connected && quoteReady && readyItems.length > 0 && !state.busyId && !state.scanning ? '' : 'disabled'}>⚡ Batch migrate ${Math.min(readyItems.length, BATCH_LIMIT)} (1 signature)</button>` : ''}
      </div>
      <p class="hint">The scan checks both supported source cores, flags v2.1.1 as unsupported, and checks your active listings on registered Xtrata markets. Nothing is signed or funded by scanning. The quote covers tokens held directly or in those registered markets; unrelated third-party custody contracts cannot be attributed automatically. The <strong>0.005 STX</strong> amount is the mining-fee allowance per transaction; the separate protocol fee is read live from <code>${CORE}</code>.</p>
      ${
        state.scanning || state.hasScanned || state.items.length || discoveryWarnings.length
          ? `<p class="hint">${state.scanning ? '⏳ Scanning' : state.hasScanned ? '✓ Complete scan' : '⚠ Incomplete scan'} — ${state.owned} directly held · ${state.scanned} supported status checks · ${summary.ready} ready${state.scanning ? '…' : ''}</p>`
          : ''
      }
      ${
        discoveryWarnings.length
          ? `<div class="notice warning"><strong>Quote incomplete — retry the scan.</strong>${discoveryWarnings.map((warning) => `<span>${escapeHtml(warning)}</span>`).join('')}</div>`
          : ''
      }
    </section>

    <section class="panel">
      <div class="section-heading">
        <div>
          <h2>Quote only</h2>
          <p class="hint">No temporary wallet is created and no funds are requested in this rollout.</p>
        </div>
        <span class="status-pill ${quoteReady ? 'ready' : ''}">${quoteReady ? 'Live quote' : 'Awaiting complete scan'}</span>
      </div>
      ${
        quoteReady && quote
          ? `<div class="quote-grid">
            <div class="quote-card"><span>Ready inscriptions</span><strong>${quote.itemCount}</strong></div>
            <div class="quote-card"><span>Protocol fee</span><strong>${formatMicroStx(quote.protocolFeeMicroStx)}</strong><small>${formatMicroStx(quote.protocolFeePerItemMicroStx)} each · live on-chain</small></div>
            <div class="quote-card"><span>Mining allowance</span><strong>${formatMicroStx(quote.miningAllowanceMicroStx)}</strong><small>${formatMicroStx(quote.miningAllowancePerItemMicroStx)} per signed transaction</small></div>
            <div class="quote-card total"><span>Estimated total</span><strong>${formatMicroStx(quote.estimatedTotalMicroStx)}</strong><small>Protocol + mining allowance</small></div>
          </div>
          ${
            quote.bySource.length
              ? `<div class="quote-lines">${quote.bySource.map((line) => `<div><span>${escapeHtml(line.sourceLabel)} · ${line.itemCount} token${line.itemCount === 1 ? '' : 's'}</span><strong>${formatMicroStx(line.estimatedTotalMicroStx)}</strong></div>`).join('')}</div>`
              : '<p class="hint">No directly migratable inscriptions were found.</p>'
          }
          <p class="hint">Fee read ${state.quoteUpdatedAt ? escapeHtml(new Date(state.quoteUpdatedAt).toLocaleString()) : 'during this scan'}. The protocol portion is exact at quote time; mining fees can change or require retrying. Funding, refund, service fee and refundable buffer are not included because automated funding is not enabled.</p>`
          : `<p class="hint">${
              state.feeReadError
                ? `The live protocol fee could not be read: ${escapeHtml(state.feeReadError)}. Retry the scan before relying on a total.`
                : 'Connect your wallet and run a complete scan to calculate the quote.'
            }</p>`
      }
    </section>

    <section class="panel">
      <h2>Ready to migrate (${readyItems.length})</h2>
      <div class="grid">
        ${
          readyItems.length === 0
            ? `<p class="hint">${state.scanning ? 'Scanning… ready tokens will appear here as they are found.' : state.hasScanned ? 'No ready tokens found.' : 'No complete scan yet.'}</p>`
            : readyItems
                .map(
                  (item) => `
                <div class="tile">
                  <div><span>#${item.tokenId.toString()}</span><small>${escapeHtml(item.sourceLabel)}</small></div>
                  <button data-source="${escapeHtml(item.sourceKey)}" data-migrate="${item.tokenId.toString()}" ${state.busyId || !quoteReady ? 'disabled' : ''}>
                    ${
                      state.busyId === migrationItemKey(item)
                        ? state.busyPhase === 'confirming'
                          ? 'Confirming…'
                          : 'Signing…'
                        : 'Migrate'
                    }
                  </button>
                </div>`
                )
                .join('')
        }
      </div>
    </section>

    <section class="panel">
      <h2>Not included in quote (${blockedItems.length})</h2>
      <div class="blocked-list">
        ${
          blockedItems.length === 0
            ? `<p class="hint">${state.hasScanned ? 'No blockers found.' : 'Blocked and already-migrated tokens will be explained here after scanning.'}</p>`
            : blockedItems
                .map(
                  (item) => `
              <div class="blocked-row">
                <div><strong>#${item.tokenId.toString()} · ${escapeHtml(item.sourceLabel)}</strong><span>${escapeHtml(item.detail ?? statusLabel(item))}</span></div>
                <span class="status-pill ${item.status}">${statusLabel(item)}</span>
                ${item.status === 'listed-escrowed' ? '<a class="button-link" href="/market">Open market</a>' : ''}
              </div>`
                )
                .join('')
        }
      </div>
    </section>

    <section class="panel">
      <h2>Activity</h2>
      <pre>${state.log.length ? escapeHtml(state.log.join('\n')) : 'No activity yet.'}</pre>
    </section>
  `;

  document
    .getElementById('connect')
    ?.addEventListener('click', () => void connect().catch((e) => note(String(e))));
  document.getElementById('disconnect')?.addEventListener('click', () => void disconnect());
  document.getElementById('scan')?.addEventListener('click', () => void scan());
  document.getElementById('all')?.addEventListener('click', () => void migrateAll());
  document.getElementById('batch')?.addEventListener('click', () => void migrateBatch());
  app.querySelectorAll<HTMLButtonElement>('[data-migrate]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = BigInt(button.dataset.migrate!);
      const sourceKey = button.dataset.source ?? '';
      const item = state.items.find(
        (candidate) => candidate.sourceKey === sourceKey && candidate.tokenId === id
      );
      if (!item) {
        note(`Could not find #${id} in the current scan. Please rescan.`);
        return;
      }
      void migrate(item).catch((e) => note(String(e)));
    });
  });
};

render();
