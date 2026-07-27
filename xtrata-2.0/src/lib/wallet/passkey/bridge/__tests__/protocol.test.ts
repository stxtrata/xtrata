import { describe, expect, it } from 'vitest';
import {
  BRIDGE_PROTOCOL,
  BridgeSecretLeak,
  assertNoSecrets,
  isBridgeRequest,
  isBridgeResponse,
  newRequestId
} from '../protocol';

describe('bridge protocol', () => {
  describe('assertNoSecrets', () => {
    it('permits the payloads the wallet is supposed to return', () => {
      expect(() =>
        assertNoSecrets({ address: 'SP1234', txHex: 'deadbeef', nonce: '3', hasWallet: true })
      ).not.toThrow();
      expect(() => assertNoSecrets(null)).not.toThrow();
      expect(() => assertNoSecrets('a string')).not.toThrow();
      expect(() => assertNoSecrets([{ address: 'SP1' }, { address: 'SP2' }])).not.toThrow();
    });

    it.each([
      ['seed', { seed: [1, 2, 3] }],
      ['mnemonic', { mnemonic: 'abandon abandon' }],
      ['privateKey', { privateKey: 'ab12' }],
      ['private_key', { private_key: 'ab12' }],
      ['senderKey', { senderKey: 'ab12' }],
      ['recoveryPhrase', { recoveryPhrase: 'words here' }],
      ['entropy', { entropy: 'ff' }],
      ['secret', { secret: 'x' }],
      ['prfOutput', { prfOutput: 'x' }]
    ])('blocks %s', (_label, payload) => {
      expect(() => assertNoSecrets(payload)).toThrow(BridgeSecretLeak);
    });

    it('is case-insensitive', () => {
      expect(() => assertNoSecrets({ SEED_BYTES: 'x' })).toThrow(BridgeSecretLeak);
      expect(() => assertNoSecrets({ WalletMnemonic: 'x' })).toThrow(BridgeSecretLeak);
    });

    it('finds secrets nested deep', () => {
      expect(() => assertNoSecrets({ a: { b: { c: { privateKey: 'x' } } } })).toThrow(BridgeSecretLeak);
    });

    it('finds secrets inside arrays', () => {
      expect(() => assertNoSecrets({ accounts: [{ address: 'SP1' }, { seed: 'x' }] })).toThrow(
        BridgeSecretLeak
      );
    });

    // Raw bytes are the most plausible way a seed escapes without a telltale name.
    it('blocks raw byte containers outright', () => {
      expect(() => assertNoSecrets({ data: new Uint8Array([1, 2, 3]) })).toThrow(BridgeSecretLeak);
      expect(() => assertNoSecrets({ data: new ArrayBuffer(8) })).toThrow(BridgeSecretLeak);
    });

    it('names the offending path so the mistake is obvious', () => {
      expect(() => assertNoSecrets({ wallet: { privateKey: 'x' } })).toThrow(/wallet\.privateKey/);
    });
  });

  describe('isBridgeRequest', () => {
    const valid = { protocol: BRIDGE_PROTOCOL, kind: 'request', id: 'abc', method: 'wallet.status' };

    it('accepts a well-formed request', () => {
      expect(isBridgeRequest(valid)).toBe(true);
    });

    it.each([
      ['wrong protocol', { ...valid, protocol: 'other' }],
      ['wrong kind', { ...valid, kind: 'response' }],
      ['missing id', { ...valid, id: '' }],
      ['unknown method', { ...valid, method: 'wallet.exportSeed' }],
      ['not an object', 'hello'],
      ['null', null],
      ['bare object', {}]
    ])('rejects %s', (_label, value) => {
      expect(isBridgeRequest(value)).toBe(false);
    });

    // The method allowlist is what stops a new handler being reachable by accident.
    it('rejects a plausible-looking exfiltration method', () => {
      expect(isBridgeRequest({ ...valid, method: 'wallet.getPrivateKey' })).toBe(false);
    });
  });

  describe('isBridgeResponse', () => {
    const valid = { protocol: BRIDGE_PROTOCOL, kind: 'response', id: 'abc', ok: true };

    it('accepts a well-formed response', () => {
      expect(isBridgeResponse(valid)).toBe(true);
    });

    it.each([
      ['wrong protocol', { ...valid, protocol: 'x' }],
      ['wrong kind', { ...valid, kind: 'request' }],
      ['non-boolean ok', { ...valid, ok: 'yes' }],
      ['missing id', { ...valid, id: '' }]
    ])('rejects %s', (_label, value) => {
      expect(isBridgeResponse(value)).toBe(false);
    });
  });

  describe('newRequestId', () => {
    it('is long enough not to be guessed', () => {
      expect(newRequestId()).toHaveLength(32);
    });

    it('does not repeat', () => {
      const ids = new Set(Array.from({ length: 500 }, () => newRequestId()));
      expect(ids.size).toBe(500);
    });
  });
});
