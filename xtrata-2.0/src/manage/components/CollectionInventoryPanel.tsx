import { useEffect, useState } from 'react';
import { bufferCV, callReadOnlyFunction, ClarityType, listCV, PostConditionMode, stringAsciiCV, tupleCV } from '@stacks/transactions';
import { isCollectionV15 } from '../../../packages/xtrata-sdk/src/collection-v15';
import { showContractCall } from '../../lib/wallet/connect';
import { toStacksNetwork } from '../../lib/network/stacks';
import { DEFAULT_TOKEN_URI } from '../../lib/mint/constants';
import { useManageWallet } from '../ManageWalletContext';

type Inventory = { helper: string; hashes: string[] };
export default function CollectionInventoryPanel({ collectionId }: { collectionId: string }) {
  const { walletSession } = useManageWallet();
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [batch, setBatch] = useState<string[]>([]);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    let cancelled = false;
    setInventory(null); setBatch([]); setOffset(0); setMessage('');
    void (async () => {
      try {
        const response = await fetch(`/collections/${encodeURIComponent(collectionId)}`);
        if (!response.ok) throw new Error('Unable to load collection inventory.');
        const collection = await response.json();
        const metadata = typeof collection.metadata === 'string' ? JSON.parse(collection.metadata) : collection.metadata;
        if (!isCollectionV15(metadata?.templateVersion ?? '')) return;
        const assetsResponse = await fetch(`/collections/${encodeURIComponent(collectionId)}/assets`);
        if (!assetsResponse.ok) throw new Error('Unable to load staged assets.');
        const assets = await assetsResponse.json() as Array<{ expected_hash: string; state: string }>;
        const hashes = [...new Set(assets.filter(a => !['expired', 'sold-out'].includes(a.state))
          .map(a => String(a.expected_hash ?? '').replace(/^0x/, '').toLowerCase()))];
        if (hashes.some(hash => !/^[0-9a-f]{64}$/.test(hash))) throw new Error('Every asset needs a verified hash before registration.');
        if (!cancelled) setInventory({ helper: collection.contract_address, hashes });
      } catch (error) { if (!cancelled) setMessage(error instanceof Error ? error.message : 'Inventory unavailable.'); }
    })();
    return () => { cancelled = true; };
  }, [collectionId]);
  if (!inventory) return message ? <p role="status">{message}</p> : null;
  async function review() {
    setBusy(true); setBatch([]);
    try {
      const [address, contractName] = inventory!.helper.split('.');
      const network = address.startsWith('ST') || address.startsWith('SN') ? 'testnet' : 'mainnet';
      if (!contractName || !walletSession.address || walletSession.network !== network) throw new Error('Connect the collection administrator on the correct network.');
      const slice = inventory!.hashes.slice(offset, offset + 50);
      const missing: string[] = [];
      for (const hash of slice) {
        const value = await callReadOnlyFunction({ contractAddress: address, contractName,
          functionName: 'get-registered-token-uri', functionArgs: [bufferCV(Uint8Array.from(hash.match(/../g)!.map(x => parseInt(x, 16))))],
          senderAddress: walletSession.address, network: toStacksNetwork(network) });
        if (value.type === ClarityType.OptionalNone) missing.push(hash);
        else if (value.type !== ClarityType.OptionalSome) throw new Error('Inventory verification failed.');
      }
      setBatch(missing);
      if (missing.length) setMessage(`${missing.length} unregistered files in this group. Register them, wait for confirmation, then check again.`);
      else {
        const next = offset + slice.length;
        setOffset(next >= inventory!.hashes.length ? 0 : next);
        setMessage(next >= inventory!.hashes.length ? 'All inventory groups checked. Register any newly staged files before opening minting.' : `${next} of ${inventory!.hashes.length} files checked. Continue with the next group.`);
      }
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Inventory check failed.'); }
    finally { setBusy(false); }
  }
  async function register() {
    setBusy(true);
    try {
      const [address, contractName] = inventory!.helper.split('.');
      const network = address.startsWith('ST') || address.startsWith('SN') ? 'testnet' : 'mainnet';
      if (!walletSession.address || walletSession.network !== network) throw new Error('Wallet network changed. Reconnect before registering.');
      await new Promise<void>((resolve, reject) => showContractCall({
        contractAddress: address, contractName, functionName: 'set-registered-token-uri-batch',
        functionArgs: [listCV(batch.map(hash => tupleCV({
          hash: bufferCV(Uint8Array.from(hash.match(/../g)!.map(x => parseInt(x, 16)))),
          'token-uri': stringAsciiCV(DEFAULT_TOKEN_URI)
        })))], network: toStacksNetwork(network), stxAddress: walletSession.address!,
        postConditionMode: PostConditionMode.Deny, postConditions: [],
        onFinish: data => { setMessage(`Registration submitted: ${data.txId}. Wait for confirmation, then check this group again.`); setBatch([]); resolve(); },
        onCancel: () => reject(new Error('Registration cancelled. Inventory is unchanged.'))
      }));
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Registration failed.'); }
    finally { setBusy(false); }
  }
  return <div className="panel__body">
    <h3>Register collection inventory</h3>
    <p>v1.5 requires each file hash to be registered before minting. {inventory.hashes.length} unique staged files. Check groups of up to 50, then confirm any registration in your wallet.</p>
    <div className="mint-actions">
      <button type="button" className="button button--ghost" disabled={busy || !inventory.hashes.length} onClick={() => void review()}>Check inventory group</button>
      <button type="button" className="button" disabled={busy || !batch.length} onClick={() => void register()}>Register {batch.length || ''} files</button>
    </div>
    {message && <p role="status">{message}</p>}
  </div>;
}
