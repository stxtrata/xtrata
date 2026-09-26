import { useCallback, useEffect, useState } from 'react';
import { addressToString, bufferCV, callReadOnlyFunction, ClarityType, listCV, PostConditionMode, stringAsciiCV, tupleCV } from '@stacks/transactions';
import { isCollectionV15 } from '../../../packages/xtrata-sdk/src/collection-v15';
import { showContractCall } from '../../lib/wallet/connect';
import { toStacksNetwork } from '../../lib/network/stacks';
import { DEFAULT_TOKEN_URI } from '../../lib/mint/constants';
import { useManageWallet } from '../ManageWalletContext';
import { resolveCollectionContractLink } from '../lib/contract-link';
import {
  collectInventoryHashes,
  computeInventoryDigest,
  INVENTORY_REGISTRATION_METADATA_KEY,
  isInventoryRegistrationCurrent,
  parseInventoryRegistrationRecord,
  type InventoryRegistrationRecord
} from '../lib/inventory-registration';

/** Registration writes are grouped so each wallet approval stays small. */
const REGISTER_BATCH_SIZE = 50;

type Inventory = {
  address: string;
  contractName: string;
  contractId: string;
  hashes: string[];
  digest: string;
  record: InventoryRegistrationRecord | null;
};
type LoadState =
  | { kind: 'loading' }
  | { kind: 'not-applicable' }
  | { kind: 'not-deployed' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; inventory: Inventory };

const toBuffer = (hash: string) => bufferCV(Uint8Array.from(hash.match(/../g)!.map((x) => parseInt(x, 16))));
const networkOf = (address: string) => (address.startsWith('ST') || address.startsWith('SN') ? 'testnet' : 'mainnet');

type Props = {
  collectionId: string;
  /** Bumped by the studio after deploys/uploads so the panel re-reads the collection. */
  refreshKey?: number;
  onVerified?: () => void;
};

export default function CollectionInventoryPanel({ collectionId, refreshKey = 0, onVerified }: Props) {
  const { walletSession } = useManageWallet();
  const [load, setLoad] = useState<LoadState>({ kind: 'loading' });
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ checked: number; total: number } | null>(null);
  const [missing, setMissing] = useState<string[]>([]);
  const [submittedTx, setSubmittedTx] = useState<string | null>(null);
  const [inscribedElsewhere, setInscribedElsewhere] = useState<string[]>([]);

  const reload = useCallback(async (signal?: { cancelled: boolean }) => {
    if (!collectionId) { setLoad({ kind: 'not-applicable' }); return; }
    setLoad({ kind: 'loading' });
    try {
      const response = await fetch(`/collections/${encodeURIComponent(collectionId)}`, { cache: 'no-store' });
      if (!response.ok) throw new Error('Could not load the collection. Try again.');
      const collection = await response.json();
      const metadata = typeof collection.metadata === 'string' ? JSON.parse(collection.metadata) : collection.metadata;
      if (signal?.cancelled) return;
      if (String(metadata?.mintType ?? '') === 'pre-inscribed' || !isCollectionV15(String(metadata?.templateVersion ?? ''))) {
        setLoad({ kind: 'not-applicable' });
        return;
      }
      // The deploy step stores the bare deployer address plus metadata.contractName,
      // so resolve through the shared helper instead of splitting contract_address.
      const link = resolveCollectionContractLink({
        collectionId: String(collection.id ?? ''),
        collectionSlug: String(collection.slug ?? ''),
        contractAddress: String(collection.contract_address ?? ''),
        metadata
      });
      if (!link || !String(collection.contract_address ?? '').trim()) { setLoad({ kind: 'not-deployed' }); return; }
      const assetsResponse = await fetch(`/collections/${encodeURIComponent(collectionId)}/assets`, { cache: 'no-store' });
      if (!assetsResponse.ok) throw new Error('Could not load your uploaded files. Try again.');
      const hashes = collectInventoryHashes(await assetsResponse.json());
      if (hashes === null) throw new Error('Some uploaded files have no verified fingerprint yet. Re-open Artwork & metadata and check every file finished uploading.');
      const digest = await computeInventoryDigest(hashes);
      if (signal?.cancelled) return;
      setLoad({ kind: 'ready', inventory: {
        address: link.address, contractName: link.contractName, contractId: link.contractId,
        hashes, digest, record: parseInventoryRegistrationRecord(metadata)
      } });
    } catch (error) {
      if (!signal?.cancelled) setLoad({ kind: 'error', message: error instanceof Error ? error.message : 'Inventory unavailable.' });
    }
  }, [collectionId]);

  useEffect(() => {
    const signal = { cancelled: false };
    setMissing([]); setProgress(null); setMessage(''); setSubmittedTx(null);
    void reload(signal);
    return () => { signal.cancelled = true; };
  }, [reload, refreshKey]);

  if (load.kind === 'not-applicable') return null;
  if (load.kind === 'loading') return <div className="panel__body"><h3>Register your files on the contract</h3><p role="status">Checking your collection…</p></div>;
  if (load.kind === 'not-deployed') return <div className="panel__body"><h3>Register your files on the contract</h3>
    <p>After your contract is confirmed, each uploaded file must be registered on it. Collectors can only mint registered files. This section unlocks once the deployment above confirms.</p></div>;
  if (load.kind === 'error') return <div className="panel__body"><h3>Register your files on the contract</h3>
    <p role="alert">{load.message}</p><button type="button" className="button button--ghost" onClick={() => void reload()}>Try again</button></div>;

  const inventory = load.inventory;
  const network = networkOf(inventory.address);
  const verified = isInventoryRegistrationCurrent({
    record: inventory.record, contractId: inventory.contractId,
    hashCount: inventory.hashes.length, digest: inventory.digest
  });

  async function check() {
    setBusy(true); setMissing([]); setSubmittedTx(null); setMessage('');
    try {
      if (!walletSession.address || walletSession.network !== network) throw new Error(`Connect your creator wallet on ${network} to check registration.`);
      const found: string[] = [];
      const elsewhere: string[] = [];
      let checked = 0;
      setProgress({ checked, total: inventory.hashes.length });
      const readHelper = (functionName: string, functionArgs: any[]) => callReadOnlyFunction({
        contractAddress: inventory.address, contractName: inventory.contractName, functionName, functionArgs,
        senderAddress: walletSession.address!, network: toStacksNetwork(network) });
      // Files inscribed on the core by anyone else can never be minted here (u122).
      const lockedCore = await readHelper('get-locked-core-contract', []).catch(() => null);
      const coreId = lockedCore && lockedCore.type === ClarityType.ResponseOk && lockedCore.value.type === ClarityType.PrincipalContract
        ? `${addressToString(lockedCore.value.address)}.${lockedCore.value.contractName.content}` : null;
      if (!coreId) throw new Error('Could not read the core contract this collection uses. Nothing was changed. Try again in a moment.');
      const [coreAddress, coreName] = coreId.split('.');
      for (const hash of inventory.hashes) {
        const value = await readHelper('get-registered-token-uri', [toBuffer(hash)]);
        // A failed read is "could not check", never "not registered".
        if (value.type === ClarityType.OptionalNone) found.push(hash);
        else if (value.type !== ClarityType.OptionalSome) throw new Error('Could not read registration from the contract. Nothing was changed. Try again in a moment.');
        const existing = await callReadOnlyFunction({ contractAddress: coreAddress, contractName: coreName,
          functionName: 'get-id-by-hash', functionArgs: [toBuffer(hash)],
          senderAddress: walletSession.address, network: toStacksNetwork(network) });
        if (existing.type === ClarityType.OptionalSome) {
          // Minted through this collection is fine; anything else blocks sell-out.
          const context = await readHelper('get-token-mint-context', [existing.value]);
          if (context.type === ClarityType.OptionalNone) elsewhere.push(hash);
          else if (context.type !== ClarityType.OptionalSome) throw new Error('Could not check whether a file was already minted. Try again in a moment.');
        } else if (existing.type !== ClarityType.OptionalNone) {
          throw new Error('Could not check the core for duplicates. Nothing was changed. Try again in a moment.');
        }
        checked += 1;
        setProgress({ checked, total: inventory.hashes.length });
        if (found.length >= REGISTER_BATCH_SIZE) break;
      }
      setMissing(found);
      setInscribedElsewhere(elsewhere);
      if (found.length) {
        setMessage(`${found.length} file${found.length === 1 ? '' : 's'} still need registering (checked ${checked} of ${inventory.hashes.length}). Approve the registration in your wallet below.`);
        return;
      }
      if (elsewhere.length) {
        setMessage(`${elsewhere.length} file${elsewhere.length === 1 ? ' has' : 's have'} already been inscribed on Xtrata outside this collection, so ${elsewhere.length === 1 ? 'it' : 'they'} can never be minted here and the collection could not sell out. Replace ${elsewhere.length === 1 ? 'it' : 'them'} in Artwork & metadata, then check again.`);
        return;
      }
      const record: InventoryRegistrationRecord = { version: 1, contractId: inventory.contractId,
        hashCount: inventory.hashes.length, digest: inventory.digest, verifiedAt: new Date().toISOString() };
      const patch = await fetch(`/collections/${encodeURIComponent(collectionId)}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metadata: { [INVENTORY_REGISTRATION_METADATA_KEY]: record } })
      });
      if (!patch.ok) throw new Error('All files are registered on-chain, but saving that result failed. Check again to retry.');
      setLoad({ kind: 'ready', inventory: { ...inventory, record } });
      setMessage(`All ${inventory.hashes.length} files are registered. Collectors will be able to mint every file.`);
      onVerified?.();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Registration check failed.'); }
    finally { setBusy(false); }
  }

  async function register() {
    setBusy(true);
    try {
      if (!walletSession.address || walletSession.network !== network) throw new Error('Wallet network changed. Reconnect before registering.');
      await new Promise<void>((resolve, reject) => showContractCall({
        contractAddress: inventory.address, contractName: inventory.contractName, functionName: 'set-registered-token-uri-batch',
        functionArgs: [listCV(missing.map(hash => tupleCV({ hash: toBuffer(hash), 'token-uri': stringAsciiCV(DEFAULT_TOKEN_URI) })))],
        network: toStacksNetwork(network), stxAddress: walletSession.address!,
        postConditionMode: PostConditionMode.Deny, postConditions: [],
        onFinish: data => {
          setSubmittedTx(data.txId ?? null);
          setMessage(`Registration submitted${data.txId ? `: ${data.txId}` : ""}. It usually confirms within a few blocks — then press “Check registration” again to confirm and continue.`);
          setMissing([]); resolve();
        },
        onCancel: () => reject(new Error('Registration cancelled. Nothing was changed.'))
      }));
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Registration failed.'); }
    finally { setBusy(false); }
  }

  return <div className="panel__body">
    <h3>Register your files on the contract</h3>
    <p>Collectors can only mint files that are registered on your contract, so every uploaded file must be registered before minting opens. Registering costs only a network fee and moves no STX.</p>
    <p role="status"><strong>{verified ? `✓ All ${inventory.hashes.length} files registered` : `${inventory.hashes.length} file${inventory.hashes.length === 1 ? '' : 's'} to verify`}</strong>
      {verified && inventory.record ? ` · checked ${new Date(inventory.record.verifiedAt).toLocaleString()}` : ''}</p>
    {!verified && inventory.record && <p>Your files changed since the last check, so registration must be checked again.</p>}
    <ol className="meta-value">
      <li>Press <em>Check registration</em>. We read each file from your contract (no wallet approval needed).</li>
      <li>If any are missing, approve <em>Register files</em> in your wallet (up to {REGISTER_BATCH_SIZE} per approval).</li>
      <li>Once that confirms, check again. Repeat until every file shows as registered.</li>
    </ol>
    <div className="mint-actions">
      <button type="button" className={verified ? 'button button--ghost' : 'button'} disabled={busy || !inventory.hashes.length} onClick={() => void check()}>
        {busy && progress ? `Checking ${progress.checked} of ${progress.total}…` : verified ? 'Check again' : 'Check registration'}</button>
      <button type="button" className="button" disabled={busy || !missing.length} onClick={() => void register()}>Register {missing.length || ''} files</button>
    </div>
    {inscribedElsewhere.length > 0 && <ul className="meta-value">{inscribedElsewhere.map(hash => <li key={hash}><code>{hash.slice(0, 12)}…</code> already inscribed elsewhere</li>)}</ul>}
    {submittedTx && <p className="meta-value">Waiting for confirmation of <code>{submittedTx}</code>.</p>}
    {message && <p role="status">{message}</p>}
  </div>;
}
