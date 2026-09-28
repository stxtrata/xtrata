// Wallet layer for Astro Blaster 3 on top-level pages (e.g. /i/<id>), bundled
// into the single HTML file by tools/build.mjs. It is the same wallet module
// X Chess and the Xtrata canaries use (canaries/collection-v17/wallet.ts,
// docs/WALLET-PLAYBOOK.md): chooser on every connect, Xverse account preflight,
// never `sender`, never stx_getAccounts, 90 s watchdog, deny mode.
// Inside the sandboxed xtrata.xyz viewer none of this runs: the host signs.
import { Cl, PostConditionMode } from '@stacks/transactions';
import * as wallet from '../../../../canaries/collection-v17/wallet';

type Choose = (list: { id: string; name: string }[]) => Promise<string | null>;
type SubmitArgs = {
  contractAddress: string; contractName: string;
  board: string; period: number; score: number; name: string; replay: Uint8Array;
  address: string; onProgress?: (stage: string) => void;
};

let connected: string | null = null;
wallet.setConnectMessage('Astro Blaster 3 reads your address so your runs are bound to it.');

async function connect(choose: Choose): Promise<string> {
  const r = await wallet.connect('mainnet', (providers) => choose(providers.map((p) => ({ id: p.id, name: p.name || p.id }))));
  if (!r.isConnected) {
    connected = null;
    if (r.wrongNetwork) throw new Error('The wallet shared a testnet address. Switch it to mainnet and try again.');
    throw new Error('No wallet connected. You can paste your address instead.');
  }
  connected = r.address;
  return r.address;
}

async function submit(o: SubmitArgs): Promise<string> {
  if (connected !== o.address) throw new Error('Connect the pilot wallet first.');
  const r = await wallet.contractCall({
    contractAddress: o.contractAddress, contractName: o.contractName, functionName: 'submit-score',
    functionArgs: [Cl.stringAscii(o.board), Cl.uint(o.period), Cl.uint(o.score), Cl.stringAscii(o.name), Cl.buffer(o.replay)],
    postConditions: [], postConditionMode: PostConditionMode.Deny, // free boards only: no STX may move
    network: 'mainnet', stxAddress: o.address, onProgress: o.onProgress
  });
  return r.txId.startsWith('0x') ? r.txId : '0x' + r.txId;
}

const hasWallet = () => wallet.listProviders().length > 0;
(globalThis as unknown as { AB3Wallet: unknown }).AB3Wallet = {
  connect, submit, hasWallet,
  connectedAddress: () => connected,
  label: () => wallet.walletLabel(),
  disconnect: async () => { connected = null; await wallet.disconnect(); }
};
