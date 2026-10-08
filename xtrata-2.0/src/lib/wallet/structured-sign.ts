import { legacyNetworkFromConnectNetwork, signStructuredMessage } from '@stacks/connect';
import { cvToHex, type ClarityValue } from '@stacks/transactions';
import { getSelectedWalletProviderId, getStacksProvider } from './connect';

type SignParams = {
  domain: ClarityValue;
  message: ClarityValue;
  network: 'mainnet' | 'testnet';
  stxAddress: string;
};

// Hex without the 0x prefix, the same shape stx_callContract arguments already use with Leather.
const hexOf = (value: ClarityValue) => cvToHex(value).replace(/^0x/, '');

const NO_SIGNER = 'This wallet cannot sign messages. Try Xverse or Leather.';

const hasRpc = (provider: any) => typeof provider?.request === 'function';
const hasLegacy = (provider: any) => typeof provider?.structuredDataSignatureRequest === 'function';

// A wallet that does not know the RPC method (wallets without stx_signStructuredMessage).
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

// What current Leather says when the old bridge is called: "This legacy method is no
// longer supported. Upgrade to the LeatherProvider.request() RPC API". Only this signal
// moves a wallet whose legacy bridge still exists over to the RPC: a wallet that signs
// through the legacy bridge today keeps doing exactly that.
const isLegacyRemoved = (error: unknown) => {
  const message = (error instanceof Error ? error.message : String(error ?? '')).toLowerCase();
  return (
    /legacy (method|api|bridge)/.test(message) ||
    message.includes('no longer supported') ||
    message.includes('request() rpc') ||
    message.includes('upgrade to the')
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
    message: hexOf(params.message),
    domain: hexOf(params.domain)
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
 * transaction, no fees). Old and new wallets both work, and a wallet that signs
 * today keeps signing exactly as before:
 *   - The legacy bridge (`structuredDataSignatureRequest`) is tried first
 *     wherever it exists. It is the path every currently working Leather and
 *     Xverse build has used.
 *   - New Leather removed that bridge and answers with "This legacy method is no
 *     longer supported. Upgrade to the LeatherProvider.request() RPC API". Only
 *     that answer (or a missing bridge) moves the request to
 *     `request('stx_signStructuredMessage')`. A user cancelling, or any other
 *     wallet error, is surfaced as is and never re-prompted.
 *   - Xverse's account picker runs on its Bitcoin bridge, but structured signing
 *     lives on its Stacks bridge, so the selected wallet family is kept. Xverse
 *     never goes to the RPC.
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

  if (hasLegacy(provider)) {
    try {
      return await signViaLegacy(provider, params);
    } catch (error) {
      if (isXverse || !hasRpc(provider) || !isLegacyRemoved(error)) throw error;
    }
  }
  if (!isXverse && hasRpc(provider)) {
    try {
      return await signViaRpc(provider, params);
    } catch (error) {
      if (isMethodUnsupported(error)) throw new Error(NO_SIGNER);
      throw error;
    }
  }
  throw new Error(NO_SIGNER);
}
