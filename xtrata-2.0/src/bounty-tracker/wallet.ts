// Bounty tracker wallet bridge. The static tracker page loads this bundle for two things:
// the same connect flow as the rest of the site, and one free signed message (SIP-018, no
// transaction, no fee) that links an X handle to the connected wallet. Wallet work goes only
// through src/lib/wallet (see docs/WALLET-PLAYBOOK.md).
import { createStacksWalletAdapter } from '../lib/wallet/adapter';
import { requestStructuredSignature } from '../lib/wallet/structured-sign';
import { bountyHandleData, isMainnetAddress, normalizeHandle } from '../../functions/lib/bounty-handle';

const adapter = createStacksWalletAdapter({ appName: 'Xtrata Bounty Tracker', appIcon: '/favicon.svg' });
let lastAddress: string | undefined;

const connectedAddress = () => {
  const session = adapter.getSession();
  return session.isConnected && isMainnetAddress(session.address) ? session.address : '';
};
const announce = () => {
  const address = connectedAddress();
  if (address === (lastAddress ?? '')) return;
  lastAddress = address;
  window.dispatchEvent(new CustomEvent('xtrata:wallet-changed', { detail: { address } }));
};

const api = {
  address: connectedAddress,
  async connect() {
    await adapter.connect();
    announce();
    const address = connectedAddress();
    if (!address) throw new Error('Connect a Stacks mainnet account to continue.');
    return address;
  },
  async disconnect() {
    await adapter.disconnect();
    announce();
  },
  /** Ask the connected wallet to sign "handle is mine" for this campaign. Nothing is sent anywhere. */
  async signHandle(campaign: string, handle: string) {
    const address = connectedAddress();
    if (!address) throw new Error('Connect your wallet first.');
    const clean = normalizeHandle(handle);
    if (clean === null) throw new Error('That is not a valid X handle. Use 1 to 15 letters, numbers or underscores.');
    const issued = Date.now();
    const claim = { campaign, address, handle: clean, issued };
    const signature = await requestStructuredSignature({ ...bountyHandleData(claim), network: 'mainnet', stxAddress: address });
    return { campaign, address, handle: clean, issued, signature };
  }
};

(window as unknown as { XtrataBountyWallet: typeof api }).XtrataBountyWallet = api;
lastAddress = connectedAddress();
window.addEventListener('focus', announce);
window.addEventListener('storage', (event) => {
  if (event.key === null || event.key === 'xtrata.v15.1.wallet.session') announce();
});
window.dispatchEvent(new CustomEvent('xtrata:wallet-ready'));
announce();
