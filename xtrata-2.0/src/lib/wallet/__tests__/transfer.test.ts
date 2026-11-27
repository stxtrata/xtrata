import { describe, expect, it } from 'vitest';
import {
  getTransferValidationMessage,
  parseRecipientInput,
  validateTransferRequest
} from '../transfer';

const SENDER = 'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B';
const RECIPIENT = 'SPD60B1MGZVZR8758E86SR364N95VSP13E5FHYXE';

describe('transfer validation', () => {
  it('requires a wallet address', () => {
    const result = validateTransferRequest({
      senderAddress: null,
      recipientAddress: RECIPIENT,
      tokenId: 1n
    });

    expect(result.ok).toBe(false);
    expect(result.reason).toBe('missing-wallet');
    expect(getTransferValidationMessage(result)).toBe(
      'Connect a wallet to transfer inscriptions.'
    );
  });

  it('blocks on network mismatch', () => {
    const result = validateTransferRequest({
      senderAddress: SENDER,
      recipientAddress: RECIPIENT,
      tokenId: 1n,
      networkMismatch: true
    });

    expect(result.ok).toBe(false);
    expect(result.reason).toBe('network-mismatch');
  });

  it('requires a token selection', () => {
    const result = validateTransferRequest({
      senderAddress: SENDER,
      recipientAddress: RECIPIENT,
      tokenId: null
    });

    expect(result.ok).toBe(false);
    expect(result.reason).toBe('missing-token');
  });

  it('requires a recipient address', () => {
    const result = validateTransferRequest({
      senderAddress: SENDER,
      recipientAddress: '  ',
      tokenId: 5n
    });

    expect(result.ok).toBe(false);
    expect(result.reason).toBe('missing-recipient');
  });

  it('validates the recipient address', () => {
    const result = validateTransferRequest({
      senderAddress: SENDER,
      recipientAddress: 'SPBAD',
      tokenId: 5n
    });

    expect(result.ok).toBe(false);
    expect(result.reason).toBe('invalid-recipient');
  });

  it('blocks self transfers', () => {
    const result = validateTransferRequest({
      senderAddress: SENDER,
      recipientAddress: SENDER,
      tokenId: 5n
    });

    expect(result.ok).toBe(false);
    expect(result.reason).toBe('self-recipient');
  });

  it('accepts a valid transfer request', () => {
    const result = validateTransferRequest({
      senderAddress: SENDER,
      recipientAddress: ` ${RECIPIENT} `,
      tokenId: 5n
    });

    expect(result.ok).toBe(true);
    expect(result.reason).toBeNull();
    expect(result.recipient).toBe(RECIPIENT);
  });

  it('sends to the address in the error-free path unchanged', () => {
    const result = validateTransferRequest({
      senderAddress: SENDER,
      recipientAddress: RECIPIENT,
      tokenId: 5n,
      expectedNetwork: 'mainnet'
    });
    expect(result.ok).toBe(true);
    expect(result.recipient).toBe(RECIPIENT);
    expect(result.recipientName).toBeUndefined();
  });
});

describe('recipient input parsing', () => {
  it('tells addresses, names and contract principals apart', () => {
    expect(parseRecipientInput('  ')).toEqual({ kind: 'empty' });
    expect(parseRecipientInput(RECIPIENT)).toEqual({ kind: 'address', address: RECIPIENT });
    expect(parseRecipientInput(' Jim.BTC ')).toEqual({ kind: 'bns', name: 'jim.btc' });
    // A contract principal must not be looked up as a BNS name.
    expect(parseRecipientInput(`${RECIPIENT}.some-contract`).kind).toBe('invalid');
    expect(parseRecipientInput('not a name').kind).toBe('invalid');
  });
});

describe('BNS recipients', () => {
  const base = { senderAddress: SENDER, tokenId: 7n, recipientAddress: 'jim.btc' };

  it('is never sendable before the name has resolved', () => {
    const none = validateTransferRequest(base);
    expect(none.ok).toBe(false);
    expect(none.reason).toBe('bns-pending');
    const loading = validateTransferRequest({
      ...base,
      bnsResolution: { name: 'jim.btc', status: 'loading' }
    });
    expect(loading.reason).toBe('bns-pending');
    expect(getTransferValidationMessage(loading)).toBe('Looking up jim.btc...');
  });

  it('ignores a resolution that belongs to a different name', () => {
    const result = validateTransferRequest({
      ...base,
      bnsResolution: { name: 'jim.bt', status: 'resolved', address: RECIPIENT }
    });
    expect(result.ok).toBe(false);
    expect(result.reason).toBe('bns-pending');
  });

  it('keeps a failed lookup apart from a name with no address', () => {
    const failed = validateTransferRequest({
      ...base,
      bnsResolution: { name: 'jim.btc', status: 'error' }
    });
    expect(failed.reason).toBe('bns-lookup-failed');
    const missing = validateTransferRequest({
      ...base,
      bnsResolution: { name: 'jim.btc', status: 'missing', address: null }
    });
    expect(missing.reason).toBe('bns-not-found');
  });

  it('sends to the resolved address and keeps the name for display', () => {
    const result = validateTransferRequest({
      ...base,
      bnsResolution: { name: 'jim.btc', status: 'resolved', address: RECIPIENT }
    });
    expect(result.ok).toBe(true);
    expect(result.recipient).toBe(RECIPIENT);
    expect(result.recipientName).toBe('jim.btc');
  });

  it('blocks a name that resolves to the sender', () => {
    const result = validateTransferRequest({
      ...base,
      bnsResolution: { name: 'jim.btc', status: 'resolved', address: SENDER }
    });
    expect(result.reason).toBe('self-recipient');
  });

  it('blocks a recipient on the wrong network', () => {
    const result = validateTransferRequest({
      ...base,
      expectedNetwork: 'testnet',
      bnsResolution: { name: 'jim.btc', status: 'resolved', address: RECIPIENT }
    });
    expect(result.ok).toBe(false);
    expect(result.reason).toBe('recipient-network-mismatch');
  });
});
