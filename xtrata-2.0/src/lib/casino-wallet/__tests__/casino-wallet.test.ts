import { hkdfSync } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { bytesToHex } from '@stacks/common';
import { getAddressFromPrivateKey, makeSTXTokenTransfer, TransactionVersion } from '@stacks/transactions';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import {
  CASINO_HKDF_INFO, CASINO_PRF_SALT, casinoBase, deriveCasinoIdentity, identityFromKeyHex, randomCasinoKeyHex
} from '../derive';
import { deriveListeningIdentity, LISTENING_HKDF_INFO, LISTENING_PRF_SALT } from '../../listening-wallet/derive';
import { BUY_FEE, BUY_FEE_CAP, BUY_MEMO, buyTransferOptions, checkSignedBuy, EXCHANGE_ADDRESS, validateBuy } from '../tx';

const PRF = Uint8Array.from({ length: 32 }, (_, i) => i);
/** Known answer for PRF = 00 01 … 1f. If this changes, every player's casino wallet has moved. Fix the code, never the vector. */
const KAT_KEY = 'eea49baae1f80f37dcbfb87a7a997ead9fe848850ff6c6073f422a9cf913cb35';
const KAT_ADDRESS = 'ST2SMCB4CV776FCP9A2EK0ZM37NAXM1MFJMMX9DW8';

describe('casino wallet derivation (locked)', () => {
  it('constants never change', () => {
    expect(new TextDecoder().decode(CASINO_PRF_SALT)).toBe('xtrata.casino.testnet-wallet.v1');
    expect(CASINO_HKDF_INFO).toBe('xtrata-casino-testnet-key-v1');
    expect(CASINO_HKDF_INFO).not.toBe(LISTENING_HKDF_INFO);
    expect(new TextDecoder().decode(CASINO_PRF_SALT)).not.toBe(new TextDecoder().decode(LISTENING_PRF_SALT));
  });

  it('matches an independent RFC 5869 HKDF and the locked vector', async () => {
    const independent = Buffer.from(hkdfSync('sha256', PRF, new Uint8Array(32), Buffer.from(CASINO_HKDF_INFO), 32)).toString('hex');
    expect(independent).toBe(KAT_KEY);
    const id = await deriveCasinoIdentity(await casinoBase(PRF));
    expect(id.privateKey).toBe(KAT_KEY + '01');
    expect(id.address).toBe(KAT_ADDRESS);
    expect(getAddressFromPrivateKey(KAT_KEY + '01', TransactionVersion.Testnet)).toBe(KAT_ADDRESS);
  });

  it('gives a testnet address unrelated to the radio wallet from the same secret', async () => {
    const casino = await deriveCasinoIdentity(await casinoBase(PRF));
    const radio = await deriveListeningIdentity(PRF);
    expect(casino.address.startsWith('ST')).toBe(true);
    expect(radio.address.startsWith('SP')).toBe(true);
    expect(casino.privateKey).not.toBe(radio.privateKey);
  });

  it('browser-only keys are random, in range, and reload to the same wallet', () => {
    const a = randomCasinoKeyHex(), b = randomCasinoKeyHex();
    expect(a).toMatch(/^[0-9a-f]{64}$/);
    expect(a).not.toBe(b);
    expect(identityFromKeyHex(a).address).toBe(identityFromKeyHex(a).address);
    expect(identityFromKeyHex(a).address.startsWith('ST')).toBe(true);
    expect(() => identityFromKeyHex('00'.repeat(32))).toThrow();
    expect(() => identityFromKeyHex('zz')).toThrow();
  });
});

describe('the one transaction the casino wallet signs', () => {
  const key = KAT_KEY + '01';
  const sign = async (o: Partial<Parameters<typeof makeSTXTokenTransfer>[0]> = {}) => {
    const tx = await makeSTXTokenTransfer({ ...buyTransferOptions({ stx: 10, fee: BUY_FEE, nonce: 4n }), senderKey: key, ...o } as any);
    return bytesToHex(tx.serialize() as unknown as Uint8Array);
  };
  const expected = { address: KAT_ADDRESS, stx: 10, fee: BUY_FEE, nonce: 4n };

  it('accepts only whole 1-10 STX, a capped fee and a sane nonce', () => {
    expect(validateBuy({ stx: 1, fee: '3000', nonce: '0' })).toEqual({ stx: 1, fee: 3000n, nonce: 0n });
    expect(validateBuy({ stx: 10, fee: BUY_FEE_CAP.toString(), nonce: '12' }).stx).toBe(10);
    for (const bad of [0, 11, 1.5, '5', -1, NaN]) expect(() => validateBuy({ stx: bad, fee: '3000', nonce: '0' })).toThrow();
    for (const fee of ['0', String(BUY_FEE_CAP + 1n), '-1', 'x', 3000]) expect(() => validateBuy({ stx: 1, fee, nonce: '0' })).toThrow();
    for (const nonce of ['-1', '1.5', 'x', '99999999999999999']) expect(() => validateBuy({ stx: 1, fee: '3000', nonce })).toThrow();
  });

  it('pays the fixed exchange address on testnet, with the memo', () => {
    const o = buyTransferOptions({ stx: 3, fee: BUY_FEE, nonce: 0n });
    expect(o.recipient).toBe(EXCHANGE_ADDRESS);
    expect(o.amount).toBe(3_000_000n);
    expect(o.memo).toBe(BUY_MEMO);
    expect(o.network).toBeInstanceOf(StacksTestnet);
  });

  it('the page accepts exactly what was asked for and returns its txid', async () => {
    const raw = await sign();
    expect(checkSignedBuy(raw, expected)).toMatch(/^0x[0-9a-f]{64}$/);
  });

  it('the page refuses anything else before broadcast', async () => {
    const raw = await sign();
    expect(() => checkSignedBuy(raw, { ...expected, stx: 9 })).toThrow(/something other/);
    expect(() => checkSignedBuy(raw, { ...expected, fee: 2999n })).toThrow(/something other/);
    expect(() => checkSignedBuy(raw, { ...expected, nonce: 5n })).toThrow(/something other/);
    expect(() => checkSignedBuy(raw, { ...expected, address: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG' })).toThrow(/something other/);
    const elsewhere = await sign({ recipient: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG' });
    const otherMemo = await sign({ memo: 'other' });
    const mainnet = await sign({ network: new StacksMainnet() });
    expect(() => checkSignedBuy(elsewhere, expected)).toThrow(/something other/);
    expect(() => checkSignedBuy(otherMemo, expected)).toThrow(/something other/);
    expect(() => checkSignedBuy(mainnet, expected)).toThrow(/something other/);
    expect(() => checkSignedBuy('zz', expected)).toThrow();
  });
});
