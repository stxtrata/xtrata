import { uintCV, callReadOnlyFunction, cvToJSON, PostConditionMode } from '@stacks/transactions';
import { toStacksNetwork } from './lib/network/stacks';
import { getApiBaseUrls } from './lib/network/config';
import {
  connectWallet,
  disconnectWallet,
  showContractCall
} from './lib/wallet/connect';
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
      onProgress(`still waiting for confirmation… ${minutes}m ${seconds}s elapsed (this is normal; blocks can take a few minutes)`);
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

const SOURCES: Record<string, { name: string; fn: string; label: string }> = {
  v1: { name: 'xtrata-v1-1-1', fn: 'migrate-from-v1', label: 'v1 (xtrata-v1-1-1)' },
  v2: { name: 'xtrata-v2-1-0', fn: 'migrate-from-v2-1-0', label: 'v2 (xtrata-v2-1-0)' }
};

type State = {
  session: WalletSession;
  source: 'v1' | 'v2';
  eligible: bigint[];
  v3Minted: Set<string>;
  busyId: string | null;
  busyPhase: 'signing' | 'confirming' | null;
  scanning: boolean;
  owned: number;
  scanned: number;
  log: string[];
};

const state: State = {
  session: { isConnected: false },
  source: 'v1',
  eligible: [],
  v3Minted: new Set(),
  busyId: null,
  busyPhase: null,
  scanning: false,
  owned: 0,
  scanned: 0,
  log: []
};

const app = document.getElementById('app') as HTMLDivElement;

const note = (message: string) => {
  state.log.unshift(`${new Date().toLocaleTimeString()}  ${message}`);
  state.log = state.log.slice(0, 40);
  render();
};

const readOnly = async (contractName: string, functionName: string, args: ReturnType<typeof uintCV>[] = []) => {
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

// Opt-in, incremental scan. Pages the wallet's source-core holdings and checks
// each id against v3 as it is found — updating status and listing eligible
// tokens live, so nothing looks hung. Press Scan again to stop.
const scan = async () => {
  if (!state.session.isConnected || !state.session.address) return;
  if (state.scanning) { state.scanning = false; return; }   // second press = stop
  const address = state.session.address;
  const sourceName = SOURCES[state.source].name;
  const assetId = `${DEPLOYER}.${sourceName}::${ASSET}`;
  state.scanning = true;
  state.eligible = [];
  state.owned = 0;
  state.scanned = 0;
  note(`Scanning ${SOURCES[state.source].label} holdings for ${address}…`);
  render();
  try {
    let offset = 0;
    let total = 0;
    do {
      if (!state.scanning) { note('Scan stopped.'); break; }
      const url = `${apiBase}/extended/v1/tokens/nft/holdings?principal=${address}&asset_identifiers=${encodeURIComponent(assetId)}&limit=200&offset=${offset}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Holdings lookup failed (${res.status}).`);
      const json = (await res.json()) as { total: number; results: Array<{ value: { repr?: string } }> };
      total = json.total ?? 0;
      const pageIds: bigint[] = [];
      for (const entry of json.results ?? []) {
        const m = (entry.value?.repr ?? '').match(/^u(\d+)$/);
        if (m) pageIds.push(BigInt(m[1]));
      }
      state.owned += pageIds.length;
      note(`Found ${state.owned}/${total} on ${state.source}; checking which are already on v3…`);
      render();
      for (const id of pageIds) {
        if (!state.scanning) break;
        const onV3 = await existsOnV3(id);
        state.scanned += 1;
        if (!onV3) {
          state.eligible.push(id);
          state.eligible.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
          render();   // tiles appear as they are found
        }
        if (state.scanned % 10 === 0) { note(`Checked ${state.scanned}/${state.owned}; ${state.eligible.length} eligible so far…`); render(); }
      }
      offset += 200;
    } while (offset < total && state.scanning);
    if (state.scanning) note(`Scan complete: ${state.owned} owned on ${state.source}, ${state.eligible.length} eligible (not yet on v3).`);
  } catch (error) {
    note(`Scan error: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    state.scanning = false;
    render();
  }
};

const migrate = (id: bigint) =>
  new Promise<void>((resolve, reject) => {
    if (!state.session.isConnected || !state.session.address) {
      reject(new Error('Connect Xverse first.'));
      return;
    }
    state.busyId = id.toString();
    state.busyPhase = 'signing';
    render();
    showContractCall({
      contractAddress: DEPLOYER,
      contractName: CORE,
      functionName: SOURCES[state.source].fn,
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
            note(`#${id}: no confirmation after 15 minutes. The transaction may still land — check it in the explorer (${txId}) before retrying, to avoid a double migration.`);
            render();
            reject(new Error('confirmation timeout'));
            return;
          }
          if (result === 'dropped') {
            note(`#${id}: the transaction was dropped from the mempool (usually a fee/nonce race). Nothing moved — it is safe to press Migrate again.`);
            render();
            reject(new Error('tx dropped'));
            return;
          }
          if (result === 'success') {
            note(`#${id} confirmed ✓`);
            state.v3Minted.add(id.toString());
            state.eligible = state.eligible.filter((value) => value !== id);
            render();
            // Keep the cached index accurate immediately: the new v3 token and
            // the now-escrowed legacy token both changed. Fire-and-forget.
            const sourceName = SOURCES[state.source].name;
            for (const contractId of [`${DEPLOYER}.${CORE}`, `${DEPLOYER}.${sourceName}`]) {
              void fetch(`/index/${contractId}?id=${id}`, { method: 'POST' }).catch(() => undefined);
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

const migrateAll = async () => {
  const queue = [...state.eligible];
  let done = 0;
  for (const id of queue) {
    try {
      await migrate(id);
      done += 1;
    } catch (error) {
      note(`Run stopped after ${done}/${queue.length}: ${error instanceof Error ? error.message : String(error)}. Fix or retry, then press Migrate all again — completed ids are skipped automatically.`);
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
  note(`Connected ${state.session.address}. Pick a source core, then press Scan.`);
  render();
};

const disconnect = async () => {
  await disconnectWallet();
  state.session = { isConnected: false };
  state.eligible = [];
  render();
};

const render = () => {
  const connected = state.session.isConnected;
  app.innerHTML = `
    <section class="panel">
      <div class="toolbar">
        <div>${connected ? `Connected <code>${state.session.address}</code>` : 'Not connected'}</div>
        <div>
          ${connected
            ? '<button id="disconnect" class="secondary">Disconnect</button>'
            : '<button id="connect">Connect Xverse</button>'}
        </div>
      </div>
      <div class="row">
        <label>Source core:
          <select id="source" ${connected && !state.scanning ? '' : 'disabled'}>
            <option value="v1" ${state.source === 'v1' ? 'selected' : ''}>${SOURCES.v1.label}</option>
            <option value="v2" ${state.source === 'v2' ? 'selected' : ''}>${SOURCES.v2.label}</option>
          </select>
        </label>
        <button id="scan" ${connected && !state.busyId ? '' : 'disabled'}>${state.scanning ? 'Stop scan' : 'Scan eligible'}</button>
        <button id="all" ${connected && state.eligible.length > 0 && !state.busyId && !state.scanning ? '' : 'disabled'}>Migrate all (sign each)</button>
      </div>
      <p class="hint">Pick a source core, then Scan — nothing runs until you do. Each migration is a separate Xverse signature that moves your legacy token into the v3 core and mints the same id on <code>${CORE}</code>. Ids already on v3 are skipped. Network fee is fixed at <strong>0.005 STX</strong> — if Xverse shows a higher amount, set it manually to 0.005.</p>
      ${state.scanning || state.owned
        ? `<p class="hint">${state.scanning ? '⏳ Scanning' : '✓ Scan done'} — ${state.scanned}/${state.owned} checked · ${state.eligible.length} eligible${state.scanning ? '…' : ''}</p>`
        : ''}
    </section>

    <section class="panel">
      <h2>Eligible tokens (${state.eligible.length})</h2>
      <div class="grid">
        ${state.eligible.length === 0
          ? `<p class="hint">${state.scanning ? 'Scanning… eligible tokens will appear here as they are found.' : 'None yet — connect, pick a source core, then press Scan.'}</p>`
          : state.eligible
              .map(
                (id) => `
                <div class="tile">
                  <span>#${id.toString()}</span>
                  <button data-migrate="${id.toString()}" ${state.busyId ? 'disabled' : ''}>
                    ${state.busyId === id.toString()
                      ? state.busyPhase === 'confirming'
                        ? 'Confirming…'
                        : 'Signing…'
                      : 'Migrate'}
                  </button>
                </div>`
              )
              .join('')}
      </div>
    </section>

    <section class="panel">
      <h2>Activity</h2>
      <pre>${state.log.length ? state.log.join('\n') : 'No activity yet.'}</pre>
    </section>
  `;

  document.getElementById('connect')?.addEventListener('click', () => void connect().catch((e) => note(String(e))));
  document.getElementById('disconnect')?.addEventListener('click', () => void disconnect());
  document.getElementById('scan')?.addEventListener('click', () => void scan());
  document.getElementById('all')?.addEventListener('click', () => void migrateAll());
  document.getElementById('source')?.addEventListener('change', (event) => {
    state.source = (event.target as HTMLSelectElement).value as 'v1' | 'v2';
    state.eligible = [];
    render();
  });
  app.querySelectorAll<HTMLButtonElement>('[data-migrate]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = BigInt(button.dataset.migrate!);
      void migrate(id).catch((e) => note(String(e)));
    });
  });
};

render();
