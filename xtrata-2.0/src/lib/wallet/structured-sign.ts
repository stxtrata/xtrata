import { legacyNetworkFromConnectNetwork, signStructuredMessage } from '@stacks/connect';
import { cvToHex, type ClarityValue } from '@stacks/transactions';
import { getSelectedWalletProviderId, getStacksProvider } from './connect';

type SignParams = {
  domain: ClarityValue;
  message: ClarityValue;
  network: 'mainnet' | 'testnet';
  stxAddress: string;
};

const NO_SIGNER = 'This wallet cannot sign messages. Try Xverse or Leather.';

const hasRpc = (provider: any) => typeof provider?.request === 'function';
const hasLegacy = (provider: any) => typeof provider?.structuredDataSignatureRequest === 'function';

// A wallet that does not know the RPC method (older Leather builds, wallets
// without stx_signStructuredMessage). Only these fall back to the legacy bridge:
// a user cancelling or a real wallet error must never silently re-prompt.
const isMethodUnsupported = (error: unknown) => {
  const code = error && typeof error === 'object' ? (error as { code?: unknown }).code : undefined;
  const message = (error instanceof Error ? error.message : String(error ?? '')).toLowerCase();
  return (
    code === -32601 ||
    message.includes('method not found') ||
    message.includes('not supported') ||
    message.includes('unsupported') ||
    message.includes('not implemented') ||
    message.includes('not available')
  );
};

/**
 * Modern path: the documented RPC call, `request('stx_signStructuredMessage')`.
 * Current Leather removed the legacy `structuredDataSignatureRequest` bridge and
 * answers it with "This legacy method is no longer supported. Upgrade to the
 * LeatherProvider.request() RPC API". The reply is a JSON-RPC envelope
 * (`{ result: { signature, publicKey } }`); some wallets return the bare result.
 */
async function signViaRpc(provider: any, params: SignParams): Promise<string> {
  const response = await provider.request('stx_signStructuredMessage', {
    message: cvToHex(params.message),
    domain: cvToHex(params.domain)
  });
  if (response?.error) {
    throw Object.assign(new Error(response.error.message || 'The wallet rejected the signing request.'), {
      code: response.error.code
    });
  }
  const result = response?.result ?? response;
  if (!result?.signature) throw new Error('The wallet did not return a signature. Nothing changed.');
  return String(result.signature);
}

/** Legacy path: a JWT-style request token handed to the wallet's own bridge (older wallets, Xverse's Stacks bridge). */
async function signViaLegacy(provider: any, params: SignParams): Promise<string> {
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

/**
 * Ask the connected wallet to sign a SIP-018 structured message (no
 * transaction, no fees). Old and new wallets both work:
 *   - Leather and any other wallet with a request() bridge: the RPC method
 *     first, falling back to the legacy bridge only when the wallet reports the
 *     RPC method as unsupported (older Leather builds).
 *   - Xverse keeps its proven path: its account picker runs on the Bitcoin
 *     bridge, but structured signing lives on its Stacks bridge, so the
 *     selected wallet family is kept and the legacy Stacks bridge is used.
 *   - The request envelope is built directly; the legacy popup helper reads
 *     Blockstack user data even when an explicit address is supplied.
 * No `sender` is sent anywhere (WALLET-PLAYBOOK §1).
 */
export async function requestStructuredSignature(params: SignParams): Promise<string> {
  const selected = getSelectedWalletProviderId() || '';
  const isXverse = /xverse/i.test(selected);
  let provider = getStacksProvider() as any;
  if (isXverse && !hasLegacy(provider)) {
    const w = window as any;
    provider = w.XverseProviders?.StacksProvider ?? w.xverseProviders?.StacksProvider;
  }

  if (!isXverse && hasRpc(provider)) {
    try {
      return await signViaRpc(provider, params);
    } catch (error) {
      if (!isMethodUnsupported(error) || !hasLegacy(provider)) throw error;
    }
  }
  if (hasLegacy(provider)) return signViaLegacy(provider, params);
  if (hasRpc(provider)) {
    try {
      return await signViaRpc(provider, params);
    } catch (error) {
      if (isMethodUnsupported(error)) throw new Error(NO_SIGNER);
      throw error;
    }
  }
  throw new Error(NO_SIGNER);
}
