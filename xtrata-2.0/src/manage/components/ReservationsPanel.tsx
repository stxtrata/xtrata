import { useCallback, useEffect, useState } from 'react';
import {
  bufferCV,
  callReadOnlyFunction,
  ClarityType,
  cvToValue,
  PostConditionMode,
  principalCV,
  type ClarityValue
} from '@stacks/transactions';
import { showContractCall } from '../../lib/wallet/connect';
import { toStacksNetwork } from '../../lib/network/stacks';
import { useManageWallet } from '../ManageWalletContext';
import { resolveCollectionContractLink } from '../lib/contract-link';
import { collectInventoryHashes } from '../lib/inventory-registration';
import { signerPreflight } from '../lib/contract-preflight';

type Found = { hash: string; owner: string; createdAt: bigint; expired: boolean };
type Target = { address: string; contractName: string; network: 'mainnet' | 'testnet'; hashes: string[] };

const toBuffer = (hash: string) => bufferCV(Uint8Array.from(hash.match(/../g)!.map((x) => parseInt(x, 16))));
const plain = (cv: ClarityValue): any => {
  const value = cvToValue(cv);
  return value && typeof value === 'object' && 'value' in value ? value.value : value;
};
const short = (address: string) => `${address.slice(0, 6)}…${address.slice(-4)}`;

/**
 * Collector reservations for v1.5+ helpers. A reservation holds one file for one
 * collector while they upload. Abandoned ones never expire on their own: they
 * hold supply and block sell-out and finalize until an admin releases them.
 */
export default function ReservationsPanel({ collectionId }: { collectionId: string }) {
  const { walletSession } = useManageWallet();
  const [target, setTarget] = useState<Target | null>(null);
  const [summary, setSummary] = useState<{ reserved: bigint; expiry: bigint; block: bigint | null } | null>(null);
  const [found, setFound] = useState<Found[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const read = useCallback(async (t: Target, functionName: string, functionArgs: ClarityValue[] = []) => {
    const value = await callReadOnlyFunction({ contractAddress: t.address, contractName: t.contractName, functionName,
      functionArgs, senderAddress: walletSession.address ?? t.address, network: toStacksNetwork(t.network) });
    return value.type === ClarityType.ResponseOk ? value.value : value;
  }, [walletSession.address]);

  const refresh = useCallback(async () => {
    setMessage(''); setFound(null);
    try {
      const collection = await (await fetch(`/collections/${encodeURIComponent(collectionId)}`, { cache: 'no-store' })).json();
      const metadata = collection.metadata ?? null;
      const link = resolveCollectionContractLink({ collectionId, collectionSlug: collection.slug, contractAddress: collection.contract_address, metadata });
      if (!link || !String(collection.contract_address ?? '').trim() || metadata?.mintType === 'pre-inscribed') { setTarget(null); return; }
      const assets = await (await fetch(`/collections/${encodeURIComponent(collectionId)}/assets`, { cache: 'no-store' })).json();
      const t: Target = { address: link.address, contractName: link.contractName,
        network: link.address.startsWith('ST') || link.address.startsWith('SN') ? 'testnet' : 'mainnet',
        hashes: collectInventoryHashes(assets) ?? [] };
      if (collectInventoryHashes(assets) === null) {
        setMessage('Some uploaded files have no verified fingerprint, so reservations cannot be checked. Re-check your uploads first.');
      }
      setTarget(t);
      const [reserved, expiry] = await Promise.all([read(t, 'get-reserved-count'), read(t, 'get-reservation-expiry-blocks')]);
      const info = await fetch(`/hiro/${t.network}/v2/info`, { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
      setSummary({ reserved: BigInt(plain(reserved)), expiry: BigInt(plain(expiry)),
        block: typeof info?.stacks_tip_height === 'number' ? BigInt(info.stacks_tip_height) : null });
    } catch {
      setMessage('Could not read reservations right now. Try again in a moment.');
    }
  }, [collectionId, read]);

  useEffect(() => { void refresh(); }, [refresh]);

  if (!target) return null;

  const scan = async () => {
    if (!summary) return;
    setBusy(true); setMessage('');
    try {
      const list: Found[] = [];
      for (const hash of target.hashes) {
        const holder = await read(target, 'get-hash-reservation', [toBuffer(hash)]);
        if (holder.type !== ClarityType.OptionalSome) continue;
        const owner = String(plain(holder));
        const session = await read(target, 'get-reservation', [principalCV(owner), toBuffer(hash)]);
        if (session.type !== ClarityType.OptionalSome) continue;
        const createdAt = BigInt(plain(session)['created-at'].value ?? plain(session)['created-at']);
        const expired = summary.block !== null && summary.expiry > 0n && summary.block >= createdAt + summary.expiry;
        list.push({ hash, owner, createdAt, expired });
      }
      setFound(list);
      if (!list.length) setMessage(target.hashes.length
        ? 'No open reservations found among your current files.'
        : 'No files with verified fingerprints to check.');
    } catch {
      setMessage('Could not finish checking reservations. Nothing was changed. Try again in a moment.');
    } finally { setBusy(false); }
  };

  const release = async (item: Found) => {
    setBusy(true); setMessage('');
    try {
      const [owner, operatorAdmin] = await Promise.all([read(target, 'get-owner'), read(target, 'get-operator-admin')]);
      const problem = signerPreflight('release-expired-reservation', walletSession.address ?? null,
        { owner: String(plain(owner)), operatorAdmin: String(plain(operatorAdmin)), financeAdmin: null, pendingOwner: null });
      if (problem) throw new Error(problem);
      await new Promise<void>((resolve, reject) => showContractCall({
        contractAddress: target.address, contractName: target.contractName, functionName: 'release-expired-reservation',
        functionArgs: [principalCV(item.owner), toBuffer(item.hash)], network: toStacksNetwork(target.network),
        stxAddress: walletSession.address!, postConditionMode: PostConditionMode.Deny, postConditions: [],
        onFinish: () => { setMessage('Release submitted. Check again after it confirms.'); resolve(); },
        onCancel: () => reject(new Error('Cancelled. Nothing changed.'))
      }));
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Release failed.'); }
    finally { setBusy(false); }
  };

  return <div className="panel__body">
    <h3>Collector reservations</h3>
    <p>A reservation holds one file for one collector while they upload it. If a collector abandons a mint, the reservation stays until you release it; until then that file can't be minted by anyone else and the collection can't sell out or be finalized.</p>
    {summary ? <p role="status"><strong>{summary.reserved.toString()} open reservation{summary.reserved === 1n ? '' : 's'}</strong> · reservations expire after {summary.expiry.toString()} blocks{summary.block === null ? ' · could not read the current block' : ''}</p> : null}
    <div className="mint-actions">
      <button type="button" className="button button--ghost" disabled={busy || !summary || summary.reserved === 0n} onClick={() => void scan()}>
        {busy ? 'Checking…' : 'Find reservations'}
      </button>
      <button type="button" className="button button--ghost" disabled={busy} onClick={() => void refresh()}>Refresh</button>
    </div>
    {found && found.length > 0 ? <ul>
      {found.map((item) => <li key={item.hash}>
        <code>{item.hash.slice(0, 10)}…</code> reserved by {short(item.owner)} at block {item.createdAt.toString()} —{' '}
        {item.expired ? <>
          <strong>expired</strong>{' '}
          <button type="button" className="button button--mini" disabled={busy} onClick={() => void release(item)}>Release</button>
        </> : 'still active'}
      </li>)}
    </ul> : null}
    <p className="meta-value">Releasing an expired reservation frees the file for other collectors. The original collector's begin fee is not refunded.</p>
    {message ? <p role="status">{message}</p> : null}
  </div>;
}
