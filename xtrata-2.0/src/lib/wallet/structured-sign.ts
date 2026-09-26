import { legacyNetworkFromConnectNetwork, signStructuredMessage } from '@stacks/connect';
import type { ClarityValue } from '@stacks/transactions';
import { getSelectedWalletProviderId, getStacksProvider } from './connect';

/**
 * Ask the connected wallet to sign a SIP-018 structured message (no
 * transaction, no fees). Same bridge handling as the music-profile proof,
 * which is proven on Xverse and Leather:
 *   - Xverse's account picker runs on its Bitcoin bridge, but structured
 *     signing lives on its Stacks bridge — keep the selected wallet family.
 *   - Build the request envelope directly; the legacy popup helper reads
 *     Blockstack user data even when an explicit address is supplied.
 * No `sender` is sent anywhere (WALLET-PLAYBOOK §1).
 */
export async function requestStructuredSignature(params: {
  domain: ClarityValue;
  message: ClarityValue;
  network: 'mainnet' | 'testnet';
  stxAddress: string;
}): Promise<string> {
  let provider = getStacksProvider() as any;
  if (/xverse/i.test(getSelectedWalletProviderId() || '') && typeof provider?.structuredDataSignatureRequest !== 'function') {
    const w = window as any;
    provider = w.XverseProviders?.StacksProvider ?? w.xverseProviders?.StacksProvider;
  }
  if (typeof provider?.structuredDataSignatureRequest !== 'function') {
    throw new Error('This wallet cannot sign messages. Try Xverse or Leather.');
  }
  const token = await signStructuredMessage({
    domain: params.domain as any,
    message: params.message as any,
    network: legacyNetworkFromConnectNetwork(params.network),
    stxAddress: params.stxAddress
  } as any);
  const result = await provider.structuredDataSignatureRequest(token);
  if (!result?.signature) throw new Error('The wallet did not return a signature. Nothing changed.');
  return String(result.signature);
}
