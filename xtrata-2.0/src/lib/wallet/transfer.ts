import { validateStacksAddress } from '@stacks/transactions';
import type { NetworkType } from '../network/types';
import { getNetworkFromAddress } from '../network/guard';
import { normalizeBnsName } from '../bns/helpers';

/**
 * What the person typed in a recipient box. A BNS name is never a recipient by
 * itself: it only becomes one once it has been resolved to an address, and the
 * caller passes that resolution in as `bnsResolution`.
 */
export type RecipientInput =
  | { kind: 'empty' }
  | { kind: 'address'; address: string }
  | { kind: 'bns'; name: string }
  | { kind: 'invalid'; raw: string };

export const parseRecipientInput = (raw: string | null | undefined): RecipientInput => {
  const trimmed = (raw ?? '').trim();
  if (!trimmed) {
    return { kind: 'empty' };
  }
  if (validateStacksAddress(trimmed)) {
    return { kind: 'address', address: trimmed };
  }
  // "SP....contract-name" also matches the BNS name pattern once lowercased.
  // Sending to a contract principal is not supported here, so do not go and
  // look it up as if it were a name.
  const [head] = trimmed.split('.');
  if (head && validateStacksAddress(head)) {
    return { kind: 'invalid', raw: trimmed };
  }
  const name = normalizeBnsName(trimmed);
  if (name) {
    return { kind: 'bns', name };
  }
  return { kind: 'invalid', raw: trimmed };
};

/**
 * The caller's lookup of a typed BNS name. `error` (the lookup failed) and
 * `missing` (the lookup worked and the name has no address) are kept apart on
 * purpose: one means "try again", the other means "that name is wrong".
 */
export type RecipientBnsResolution = {
  name: string;
  status: 'loading' | 'resolved' | 'missing' | 'error';
  address?: string | null;
};

export type TransferValidationResult = {
  ok: boolean;
  reason:
    | 'missing-wallet'
    | 'network-mismatch'
    | 'missing-token'
    | 'missing-recipient'
    | 'invalid-recipient'
    | 'bns-pending'
    | 'bns-not-found'
    | 'bns-lookup-failed'
    | 'recipient-network-mismatch'
    | 'self-recipient'
    | null;
  /** The address the inscription would go to. */
  recipient?: string;
  /** The BNS name the person typed, when they typed one. */
  recipientName?: string;
};

export const validateTransferRequest = (params: {
  senderAddress?: string | null;
  recipientAddress: string;
  tokenId?: bigint | null;
  networkMismatch?: boolean;
  bnsResolution?: RecipientBnsResolution | null;
  /** When set, the recipient must be an address on this network. */
  expectedNetwork?: NetworkType | null;
}): TransferValidationResult => {
  if (!params.senderAddress) {
    return { ok: false, reason: 'missing-wallet' };
  }
  if (params.networkMismatch) {
    return { ok: false, reason: 'network-mismatch' };
  }
  if (params.tokenId === null || params.tokenId === undefined) {
    return { ok: false, reason: 'missing-token' };
  }
  const parsed = parseRecipientInput(params.recipientAddress);
  if (parsed.kind === 'empty') {
    return { ok: false, reason: 'missing-recipient' };
  }
  if (parsed.kind === 'invalid') {
    return { ok: false, reason: 'invalid-recipient' };
  }

  let recipient: string;
  let recipientName: string | undefined;
  if (parsed.kind === 'bns') {
    recipientName = parsed.name;
    const resolution = params.bnsResolution;
    // A resolution for a different name (the person kept typing) counts as
    // not looked up yet, never as an answer for this one.
    if (!resolution || resolution.name !== parsed.name || resolution.status === 'loading') {
      return { ok: false, reason: 'bns-pending', recipientName };
    }
    if (resolution.status === 'error') {
      return { ok: false, reason: 'bns-lookup-failed', recipientName };
    }
    const resolved = resolution.address?.trim() ?? '';
    if (resolution.status !== 'resolved' || !resolved || !validateStacksAddress(resolved)) {
      return { ok: false, reason: 'bns-not-found', recipientName };
    }
    recipient = resolved;
  } else {
    recipient = parsed.address;
  }

  if (params.expectedNetwork) {
    const recipientNetwork = getNetworkFromAddress(recipient);
    if (recipientNetwork && recipientNetwork !== params.expectedNetwork) {
      return {
        ok: false,
        reason: 'recipient-network-mismatch',
        recipient,
        recipientName
      };
    }
  }
  if (recipient === params.senderAddress) {
    return { ok: false, reason: 'self-recipient', recipient, recipientName };
  }
  return {
    ok: true,
    reason: null,
    recipient,
    recipientName
  };
};

export const getTransferValidationMessage = (
  result: TransferValidationResult
): string | null => {
  if (result.ok) {
    return null;
  }
  const name = result.recipientName ?? 'that name';
  switch (result.reason) {
    case 'missing-wallet':
      return 'Connect a wallet to transfer inscriptions.';
    case 'network-mismatch':
      return 'Network mismatch: switch wallet or contract before transferring.';
    case 'missing-token':
      return 'Select an inscription to transfer.';
    case 'missing-recipient':
      return 'Enter a recipient address or BNS name.';
    case 'invalid-recipient':
      return 'Enter a valid Stacks address or BNS name (for example name.btc).';
    case 'bns-pending':
      return `Looking up ${name}...`;
    case 'bns-not-found':
      return `No address found for ${name}. Check the spelling.`;
    case 'bns-lookup-failed':
      return `Could not look up ${name} right now. Try again in a moment.`;
    case 'recipient-network-mismatch':
      return 'That address is on a different network (mainnet addresses start SP, testnet ST).';
    case 'self-recipient':
      return result.recipientName
        ? `${result.recipientName} points to your own wallet. Pick a different recipient.`
        : 'Recipient must be different from the sender.';
    default:
      return 'Transfer is not ready yet.';
  }
};
