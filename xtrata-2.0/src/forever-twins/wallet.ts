import {
  callReadOnlyFunction,
  Cl,
  cvToJSON,
  cvToValue,
  Pc,
  PostConditionMode
} from '@stacks/transactions';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { createStacksWalletAdapter } from '../lib/wallet/adapter';
import { showContractCall } from '../lib/wallet/connect';

// This module is bundled for the standalone Forever Twins pages. Keeping the
// adapter here makes those pages use the exact same provider selection,
// session persistence, mainnet guard, and disconnect behaviour as Xtrata.
const walletAdapter = createStacksWalletAdapter({
  appName: 'Xtrata Forever Twins',
  appIcon: '/forever-twins/assets/xtrata-X-no-text-256x256.png'
});

let connectInFlight: Promise<ReturnType<typeof walletAdapter.getSession>> | null = null;

export const connectForeverTwinsWallet = () => {
  if (!connectInFlight) {
    connectInFlight = walletAdapter.connect().finally(() => {
      connectInFlight = null;
    });
  }
  return connectInFlight;
};

export const disconnectForeverTwinsWallet = () => walletAdapter.disconnect();

export const getForeverTwinsWalletSession = () => walletAdapter.getSession();

// The standalone pages previously imported a separate Stacks SDK from esm.sh.
// Re-export the small compatibility surface they need from this bundle so all
// wallet operations and Clarity values come from one SDK version.
export const fetchCallReadOnlyFunction = callReadOnlyFunction;
export const STACKS_MAINNET = new StacksMainnet();
export const STACKS_TESTNET = new StacksTestnet();
export {
  Cl,
  cvToJSON,
  cvToValue,
  Pc,
  PostConditionMode,
  showContractCall as openContractCall
};
