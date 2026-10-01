import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  bufferCV,
  callReadOnlyFunction,
  ClarityType,
  cvToString,
  listCV,
  PostConditionMode,
  stringAsciiCV,
  tupleCV,
  type ClarityValue
} from '@stacks/transactions';
import { showContractCall } from '../../lib/wallet/connect';
import { toStacksNetwork } from '../../lib/network/stacks';
import { useManageWallet } from '../ManageWalletContext';
import { signerPreflight } from '../lib/contract-preflight';
import { waitForTxConfirmation } from '../lib/tx-confirmation';
import type {
  InventoryReplacementRecord,
  ReplacementChainState,
  ReplacementPlan
} from '../../lib/collections/inventory-replacement';

type Status = {
  record: InventoryReplacementRecord | null;
  chain: ReplacementChainState | null;
  plan: ReplacementPlan | null;
  activeFileCount: number;
};
type Asset = { asset_id: string; path?: string | null; state?: string | null; expected_hash?: string | null };

const toBuffer = (hash: string) => bufferCV(Uint8Array.from(hash.match(/../g)!.map((x) => parseInt(x, 16))));
const networkOf = (contractId: string) => (/^S[TN]/.test(contractId) ? 'testnet' : 'mainnet') as 'mainnet' | 'testnet';
const short = (hash: string) => `${hash.slice(0, 10)}…`;
const isActive = (asset: Asset) => !['expired', 'sold-out'].includes(String(asset.state ?? '').toLowerCase());

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { cache: 'no-store', ...init });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(String((body as { error?: unknown }).error ?? `Request failed (${response.status}).`));
  return body as T;
}

type Props = {
  collectionId: string;
  /** Published collections only: uploads are locked, so files are replaced here instead. */
  published: boolean;
  refreshKey?: number;
  /** Called after the files are swapped, so the studio re-checks registration and caches. */
  onReplaced?: () => void;
};

/**
 * Replace unminted files in a published, paused collection: upload → register
 * the new files → remove the old registrations → finish. Every step re-reads
 * the chain through /replacements, so it can be resumed after any interruption.
 */
export default function ReplaceFilesPanel({ collectionId, published, refreshKey = 0, onReplaced }: Props) {
  const { walletSession } = useManageWallet();
  const base = `/collections/${encodeURIComponent(collectionId)}/replacements`;
  const [status, setStatus] = useState<Status | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [filter, setFilter] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [loadError, setLoadError] = useState('');
  const resumed = useRef<string | null>(null);

  const reload = useCallback(async () => {
    setLoadError('');
    try {
      const next = await api<Status>(base);
      setStatus(next);
      return next;
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Could not load the replacement status.');
      return null;
    }
  }, [base]);

  useEffect(() => {
    if (!collectionId || !published) return;
    void reload();
    void api<Asset[]>(`/collections/${encodeURIComponent(collectionId)}/assets`).then(setAssets).catch(() => setAssets([]));
  }, [collectionId, published, refreshKey, reload]);

  const record = status?.record?.status === 'open' ? status.record : null;
  const plan = record ? status?.plan ?? null : null;
  const network = record ? networkOf(record.contractId) : 'mainnet';
  const [contractAddress, contractName] = (record?.contractId ?? '.').split('.');

  /** Re-read until the chain shows the step moved on (read-only results can lag the confirmation). */
  const settle = useCallback(async (from: ReplacementPlan['step']) => {
    for (let attempt = 0; attempt < 6; attempt += 1) {
      const next = await reload();
      if (!next?.plan || next.plan.step !== from) return next;
      await new Promise((resolve) => setTimeout(resolve, 5_000));
    }
    return reload();
  }, [reload]);

  const waitAndSettle = useCallback(async (txId: string, step: ReplacementPlan['step']) => {
    setMessage(`Waiting for ${short(txId)} to confirm on-chain…`);
    const result = await waitForTxConfirmation(txId, network);
    if (result.status === 'failed') {
      setMessage(`Transaction ${short(txId)} failed (${result.reason}). Nothing changed for it; try the step again.`);
      await reload();
      return false;
    }
    if (result.status === 'timeout') {
      setMessage(`Transaction ${short(txId)} has not confirmed yet. Come back later — this step resumes where it left off.`);
      return false;
    }
    await settle(step);
    setMessage('Confirmed on-chain.');
    return true;
  }, [network, reload, settle]);

  // Resume: a submitted transaction for the current step is waited on again after a reload.
  useEffect(() => {
    if (!record || !plan || busy) return;
    const pending = plan.step === 'register' ? record.txs.register.at(-1) : plan.step === 'clear' ? record.txs.clear.at(-1) : undefined;
    if (!pending || resumed.current === pending) return;
    resumed.current = pending;
    setBusy('resume');
    void waitAndSettle(pending, plan.step).finally(() => setBusy(null));
  }, [record, plan, busy, waitAndSettle]);

  async function preflightSigner(functionName: string) {
    if (!walletSession.address) return 'Connect your creator wallet first.';
    if (walletSession.network !== network) return `Connect your wallet on ${network}.`;
    const read = (name: string) => callReadOnlyFunction({
      contractAddress, contractName, functionName: name, functionArgs: [],
      senderAddress: walletSession.address!, network: toStacksNetwork(network)
    });
    try {
      const principal = (value: ClarityValue) => {
        const inner = value.type === ClarityType.ResponseOk ? value.value : value;
        return inner.type === ClarityType.PrincipalStandard ? cvToString(inner) : null;
      };
      const [owner, operatorAdmin] = await Promise.all([read('get-owner'), read('get-operator-admin')]);
      return signerPreflight(functionName, walletSession.address, {
        owner: principal(owner), operatorAdmin: principal(operatorAdmin), financeAdmin: null, pendingOwner: null
      });
    } catch {
      return 'Could not check which wallet may sign. Nothing was sent — try again in a moment.';
    }
  }

  function sendContractCall(functionName: string, functionArgs: ClarityValue[]) {
    return new Promise<string>((resolve, reject) => showContractCall({
      contractAddress, contractName, functionName, functionArgs,
      network: toStacksNetwork(network), stxAddress: walletSession.address!,
      // Registration moves no STX.
      postConditionMode: PostConditionMode.Deny, postConditions: [],
      onFinish: (data) => (data.txId ? resolve(data.txId) : reject(new Error('The wallet returned no transaction id.'))),
      onCancel: () => reject(new Error('Cancelled in the wallet. Nothing was changed.'))
    }));
  }

  async function run(label: string, action: () => Promise<void>) {
    setBusy(label);
    setMessage('');
    try {
      await action();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Something went wrong.');
    } finally {
      setBusy(null);
    }
  }

  const start = () => run('start', async () => {
    const next = await api<Status>(base, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'start', assetIds: selected }) });
    setStatus(next);
    setSelected([]);
  });

  const upload = (assetId: string, file: File) => run(`upload:${assetId}`, async () => {
    const next = await api<Status>(`${base}?assetId=${encodeURIComponent(assetId)}`, {
      method: 'PUT', headers: { 'Content-Type': file.type || 'application/octet-stream' }, body: file
    });
    setStatus(next);
  });

  const register = () => run('register', async () => {
    if (!record || !plan) return;
    const problem = await preflightSigner('set-registered-token-uri-batch');
    if (problem) throw new Error(problem);
    const entries = record.items.filter((item) => item.replacement && plan.toRegister.includes(item.replacement.hash));
    const txId = await sendContractCall('set-registered-token-uri-batch', [listCV(entries.map((item) =>
      tupleCV({ hash: toBuffer(item.replacement!.hash), 'token-uri': stringAsciiCV(item.original.tokenUri) })))]);
    await api(base, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'record-tx', kind: 'register', txId }) });
    resumed.current = txId.startsWith('0x') ? txId : `0x${txId}`;
    await waitAndSettle(txId, 'register');
  });

  const clearOld = () => run('clear', async () => {
    if (!plan) return;
    const problem = await preflightSigner('clear-registered-token-uri');
    if (problem) throw new Error(problem);
    // The contract clears one hash per call; each waits for confirmation before the next.
    for (const hash of plan.toClear) {
      const txId = await sendContractCall('clear-registered-token-uri', [toBuffer(hash)]);
      await api(base, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'record-tx', kind: 'clear', txId }) });
      resumed.current = txId.startsWith('0x') ? txId : `0x${txId}`;
      if (!(await waitAndSettle(txId, 'clear'))) return;
    }
  });

  const finish = () => run('finish', async () => {
    const next = await api<Status>(base, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'finish' }) });
    setStatus(next);
    setMessage(`Files replaced. ${next.activeFileCount} files in the collection. Minting stays paused: check registration under “Register your files on the contract”, then open minting when every check passes.`);
    onReplaced?.();
  });

  const cancel = () => run('cancel', async () => {
    setStatus(await api<Status>(base, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'cancel' }) }));
  });

  const choices = useMemo(() => {
    const needle = filter.trim().toLowerCase();
    return assets.filter(isActive).filter((asset) => !needle || String(asset.path ?? '').toLowerCase().includes(needle))
      .sort((a, b) => String(a.path ?? '').localeCompare(String(b.path ?? ''), undefined, { numeric: true }));
  }, [assets, filter]);

  if (!published) return null;
  const working = busy !== null;

  return (
    <div className="panel__body replace-files-panel">
      <h3>Replace unminted files</h3>
      <p className="meta-value">
        Your collection is published, so files can't be added or removed. You can still swap the content of files nobody has minted
        while minting is paused. The file keeps its place in the collection and the original is kept.
      </p>
      {loadError && <p role="alert">{loadError} <button type="button" className="button button--ghost" onClick={() => void reload()}>Try again</button></p>}

      {!record && (
        <>
          <label className="field">
            <span className="field__label">Find files</span>
            <input className="input" value={filter} placeholder="e.g. 84.html" onChange={(event) => setFilter(event.target.value)} />
          </label>
          <ul className="replace-files-panel__choices">
            {choices.slice(0, 30).map((asset) => (
              <li key={asset.asset_id}>
                <label>
                  <input type="checkbox" checked={selected.includes(asset.asset_id)}
                    onChange={(event) => setSelected((current) => event.target.checked ? [...current, asset.asset_id] : current.filter((id) => id !== asset.asset_id))} />
                  {' '}{asset.path ?? asset.asset_id}
                </label>
              </li>
            ))}
          </ul>
          {choices.length > 30 && <p className="meta-value">Showing 30 of {choices.length}. Type a file name to narrow the list.</p>}
          <div className="mint-actions">
            <button type="button" className="button" disabled={working || selected.length === 0} onClick={() => void start()}>
              {busy === 'start' ? 'Checking the contract…' : `Replace ${selected.length || ''} file${selected.length === 1 ? '' : 's'}`}
            </button>
          </div>
          {status?.record?.status === 'complete' && (
            <p className="meta-value">Last replacement finished {new Date(status.record.completedAt ?? status.record.updatedAt).toLocaleString()}: {status.record.items.map((item) => item.path).join(', ')}.</p>
          )}
        </>
      )}

      {record && plan && (
        <>
          {plan.blockers.length > 0 && <div className="alert" role="alert">{plan.blockers.map((blocker) => <p key={blocker}>{blocker}</p>)}</div>}
          <ol className="replace-files-panel__steps">
            <li aria-current={plan.step === 'upload' ? 'step' : undefined}>
              <strong>Upload the new files.</strong>
              <ul>
                {record.items.map((item) => (
                  <li key={item.assetId}>
                    {item.path}: {item.replacement ? <>new file ready (<code>{short(item.replacement.hash)}</code>)</> : 'waiting for the new file'}
                    {(plan.step === 'upload' || (plan.step === 'register' && plan.toRegister.includes(item.replacement?.hash ?? ''))) && (
                      <input type="file" aria-label={`New file for ${item.path}`} disabled={working}
                        onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ''; if (file) void upload(item.assetId, file); }} />
                    )}
                  </li>
                ))}
              </ul>
            </li>
            <li aria-current={plan.step === 'register' ? 'step' : undefined}>
              <strong>Register the new files on your contract.</strong> One wallet approval; it moves no STX.
              {plan.step === 'register' && (
                <div className="mint-actions">
                  <button type="button" className="button" disabled={working} onClick={() => void register()}>
                    {busy === 'register' ? 'Waiting…' : `Register ${plan.toRegister.length} new file${plan.toRegister.length === 1 ? '' : 's'}`}
                  </button>
                </div>
              )}
            </li>
            <li aria-current={plan.step === 'clear' ? 'step' : undefined}>
              <strong>Remove the old registrations,</strong> so the old files can never be minted. One approval per file.
              {plan.step === 'clear' && (
                <div className="mint-actions">
                  <button type="button" className="button" disabled={working} onClick={() => void clearOld()}>
                    {busy === 'clear' ? 'Waiting…' : `Remove ${plan.toClear.length} old registration${plan.toClear.length === 1 ? '' : 's'}`}
                  </button>
                </div>
              )}
            </li>
            <li aria-current={plan.step === 'finish' ? 'step' : undefined}>
              <strong>Finish.</strong> The collection switches to the new files. Minting stays paused until registration is checked again.
              {plan.step === 'finish' && (
                <div className="mint-actions">
                  <button type="button" className="button" disabled={working} onClick={() => void finish()}>
                    {busy === 'finish' ? 'Finishing…' : 'Finish replacement'}
                  </button>
                </div>
              )}
            </li>
          </ol>
          <div className="mint-actions">
            <button type="button" className="button button--ghost" disabled={working} onClick={() => void reload()}>Refresh status</button>
            {(plan.step === 'upload' || plan.step === 'register') && plan.toClear.length === record.items.length && (
              <button type="button" className="button button--ghost" disabled={working} onClick={() => void cancel()}>Cancel replacement</button>
            )}
          </div>
        </>
      )}
      {record && !plan && !loadError && <p role="status">Checking the contract…</p>}
      {message && <p role="status">{message}</p>}
    </div>
  );
}
