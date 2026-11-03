import { describe, expect, it } from 'vitest';
import { getAddressFromPrivateKey, TransactionVersion, makeRandomPrivKey, privateKeyToString, createStacksPrivateKey, signMessageHashRsv } from '@stacks/transactions';
import { deriveListeningIdentity, deriveSlotIdentity, isSlot, LISTENING_HKDF_INFO, LISTENING_PRF_SALT, listeningBase, MAX_SLOT, slotInfo } from '../derive';
import { signSlotBinding, validateSlotBinding, verifySlotSignature } from '../slots';
import { linkHash, signLink, validateLinkRequest, verifyLinkSignature, LINK_MAX_AGE_MS } from '../link';
import {
  balanceState, costPerPlay, fundingAllowance, playsCovered, returnPlan, SessionLedger, stx, TARGET,
  validateSessionTerms, MIN_PLAY_INTERVAL_MS, RESERVE
} from '../policy';

const prf = Uint8Array.from({ length: 32 }, (_, i) => i);

describe('listening key derivation', () => {
  it('is locked by known answers: if these change, existing wallets have moved to unreachable addresses', async () => {
    // Fix the code, never these vectors.
    expect(new TextDecoder().decode(LISTENING_PRF_SALT)).toBe('xtrata.radio.listening-wallet.v1');
    expect(LISTENING_HKDF_INFO).toBe('xtrata-radio-listening-key-v1');
    const id = await deriveListeningIdentity(prf);
    // Scalar cross-checked with an independent RFC 5869 HKDF (Python hmac/hashlib).
    expect(id.privateKey).toBe('27f4e24cab6260a5de746d14139104a797263b729358be4230e7d827185b5855' + '01');
    expect(id.address).toBe('SPHRV6ESV321YCV6W990X4FKXB4S9D7F665FSCTV');
    expect(id.publicKey).toBe('029e09b0fc71f55fb4fdf0dd50133b247156975699ee825435980be986dd648d52');
    expect((await deriveListeningIdentity(new Uint8Array(32).fill(0xab))).address).toBe('SP1MTEBDVB49XSDP5HNGM1ZYS3X5495V1CRMWM3EE');
  });
  it('is deterministic, mainnet, and different for different passkeys', async () => {
    const a = await deriveListeningIdentity(prf), b = await deriveListeningIdentity(prf.slice());
    expect(a).toEqual(b);
    expect(getAddressFromPrivateKey(a.privateKey, TransactionVersion.Mainnet)).toBe(a.address);
    expect(a.address.startsWith('SP')).toBe(true);
    const other = Uint8Array.from(prf); other[0] ^= 1;
    expect((await deriveListeningIdentity(other)).address).not.toBe(a.address);
  });
  it('refuses short PRF output rather than weakening the key', async () => {
    await expect(deriveListeningIdentity(new Uint8Array(16))).rejects.toThrow(/at least 32/);
  });
});

describe('derived wallets (slots) of one passkey', () => {
  it('slot 0 is the wallet every listener already has; other slots are locked by known answers too', async () => {
    // Scalars cross-checked with an independent RFC 5869 HKDF (Python hmac/hashlib), info = <label>/slot/<n>.
    expect(slotInfo(0)).toBe('xtrata-radio-listening-key-v1');
    expect(slotInfo(7)).toBe('xtrata-radio-listening-key-v1/slot/7');
    const base = await listeningBase(prf);
    expect(await deriveSlotIdentity(base, 0)).toEqual(await deriveListeningIdentity(prf));
    const vectors: [number, string, string][] = [
      [1, 'f2fecabcfbba3ab1e1e152fded76aedd5ec4905a5ea795419c8fc127bf15fdda', 'SP3ANJ3MWZKPPAEN8JAHBXA7QZ85GDHDZR47V8ZC1'],
      [2, 'c8f67d6af10c2920b9cdccf8f17e6453ec7fd793e027f76a6a49bb2c2ea21f96', 'SP1H6JGJNMR9KJPKGSR70TDRDBGH0TZZKAH9Q2THA'],
      [100, '016e24b2fa32ea2090641eb1321a04a292771c8b2fce57a6ad17589dca220cab', 'SP1GV2VVEV8640AZ109BM721GEVQMPFPFWW8995NV']
    ];
    for (const [slot, scalar, address] of vectors) {
      const id = await deriveSlotIdentity(base, slot);
      expect(id.privateKey).toBe(scalar + '01');
      expect(id.address).toBe(address);
    }
  });
  it('gives a different wallet per slot, the same wallet each time, and a different set per passkey', async () => {
    const base = await listeningBase(prf);
    const addrs = new Set<string>();
    for (let n = 0; n < 40; n++) addrs.add((await deriveSlotIdentity(base, n)).address);
    expect(addrs.size).toBe(40);
    expect((await deriveSlotIdentity(await listeningBase(prf.slice()), 5)).address).toBe((await deriveSlotIdentity(base, 5)).address);
    const other = Uint8Array.from(prf); other[0] ^= 1;
    expect((await deriveSlotIdentity(await listeningBase(other), 5)).address).not.toBe((await deriveSlotIdentity(base, 5)).address);
  });
  it('keeps the secret non-extractable and refuses slots out of range', async () => {
    const base = await listeningBase(prf);
    expect(base.extractable).toBe(false);
    await expect(crypto.subtle.exportKey('raw', base)).rejects.toBeTruthy();
    for (const bad of [-1, 1.5, MAX_SLOT + 1, NaN, '1' as unknown as number]) await expect(deriveSlotIdentity(base, bad)).rejects.toThrow(/not available/);
    expect(isSlot(0) && isSlot(MAX_SLOT) && !isSlot(MAX_SLOT + 1)).toBe(true);
    await expect(listeningBase(new Uint8Array(16))).rejects.toThrow(/at least 32/);
  });
  it('a binding needs BOTH keys, and neither signature works for another address, slot or time', async () => {
    const base = await listeningBase(prf);
    const root = await deriveSlotIdentity(base, 0), slot = await deriveSlotIdentity(base, 3), now = 1_760_000_000_000;
    const b = { root: root.address, slot: 3, address: slot.address, issued: now };
    expect(() => validateSlotBinding(b, now)).not.toThrow();
    const rootSig = signSlotBinding(b, root.privateKey), slotSig = signSlotBinding(b, slot.privateKey);
    expect(verifySlotSignature(b, rootSig, root.address) && verifySlotSignature(b, slotSig, slot.address)).toBe(true);
    expect(verifySlotSignature(b, rootSig, slot.address)).toBe(false);
    expect(verifySlotSignature({ ...b, slot: 4 }, rootSig, root.address)).toBe(false);
    expect(verifySlotSignature({ ...b, address: root.address }, slotSig, slot.address)).toBe(false);
    expect(verifySlotSignature({ ...b, issued: now + 1 }, slotSig, slot.address)).toBe(false);
    expect(verifySlotSignature(b, 'nope', root.address)).toBe(false);
    // a signature made for the link message cannot be replayed as a binding
    expect(verifySlotSignature(b, signLink({ main: root.address, listening: slot.address, issued: now }, root.privateKey), root.address)).toBe(false);
  });
  it('validates addresses, slot number and freshness', async () => {
    const base = await listeningBase(prf);
    const root = await deriveSlotIdentity(base, 0), slot = await deriveSlotIdentity(base, 1), now = 1_760_000_000_000;
    const ok = { root: root.address, slot: 1, address: slot.address, issued: now };
    expect(() => validateSlotBinding({ ...ok, slot: 0 }, now)).toThrow(/1 or more/);
    expect(() => validateSlotBinding({ ...ok, address: root.address }, now)).toThrow(/different/);
    expect(() => validateSlotBinding({ ...ok, issued: now - LINK_MAX_AGE_MS - 1 }, now)).toThrow(/expired/);
    expect(() => validateSlotBinding({ ...ok, root: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG' }, now)).toThrow();
  });
});

describe('link signatures', () => {
  const mainKey = privateKeyToString(makeRandomPrivKey()).slice(0, 64) + '01';
  const main = getAddressFromPrivateKey(mainKey, TransactionVersion.Mainnet);
  it('verifies both signatures over the same message and rejects swaps', async () => {
    const id = await deriveListeningIdentity(prf);
    const link = { main, listening: id.address, issued: 1_760_000_000_000 };
    const mainSig = signMessageHashRsv({ messageHash: linkHash(link), privateKey: createStacksPrivateKey(mainKey) }).data;
    const listeningSig = signLink(link, id.privateKey);
    expect(verifyLinkSignature(link, mainSig, main)).toBe(true);
    expect(verifyLinkSignature(link, listeningSig, id.address)).toBe(true);
    expect(verifyLinkSignature(link, listeningSig, main)).toBe(false);
    expect(verifyLinkSignature({ ...link, issued: link.issued + 1 }, mainSig, main)).toBe(false);
    expect(verifyLinkSignature(link, 'nope', main)).toBe(false);
  });
  it('validates freshness and addresses', async () => {
    const id = await deriveListeningIdentity(prf), now = 1_760_000_000_000;
    expect(() => validateLinkRequest({ main, listening: id.address, issued: now }, now)).not.toThrow();
    expect(() => validateLinkRequest({ main, listening: id.address, issued: now - LINK_MAX_AGE_MS - 1 }, now)).toThrow(/expired/);
    expect(() => validateLinkRequest({ main, listening: main, issued: now }, now)).toThrow(/different/);
    expect(() => validateLinkRequest({ main: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG', listening: id.address, issued: now }, now)).toThrow();
  });
});

describe('1 STX policy', () => {
  it('formats and counts plays after the reserve', () => {
    expect(stx(1_234_567n)).toBe('1.234567');
    expect(costPerPlay(300n)).toBe(350n);
    expect(playsCovered(TARGET, 300n)).toBe(Number((TARGET - RESERVE) / 350n));
    expect(playsCovered(RESERVE, 300n)).toBe(0);
  });
  it('caps deposits at the 1 STX target including incoming funds', () => {
    expect(fundingAllowance(0n)).toBe(TARGET);
    expect(fundingAllowance(400_000n, 100_000n)).toBe(500_000n);
    expect(fundingAllowance(TARGET + 5n)).toBe(0n);
  });
  it('classifies balances', () => {
    expect(balanceState(0n)).toBe('empty');
    expect(balanceState(10_000n)).toBe('low');
    expect(balanceState(TARGET)).toBe('ok');
    expect(balanceState(TARGET + 1n)).toBe('over');
  });
  it('computes Return excess and Return all exactly', () => {
    expect(returnPlan('excess', 1_500_000n, 3_000n)).toEqual({ mode: 'excess', amount: 497_000n, fee: 3_000n, remaining: TARGET });
    expect(returnPlan('all', 1_500_000n, 3_000n)).toEqual({ mode: 'all', amount: 1_497_000n, fee: 3_000n, remaining: 0n });
    expect(() => returnPlan('excess', TARGET + 2_000n, 3_000n)).toThrow(/Return all/);
    expect(() => returnPlan('all', 2_000n, 3_000n)).toThrow(/cannot cover/);
    expect(() => returnPlan('all', TARGET, 50_000n)).toThrow(/range/);
  });
  it('computes Return an amount exactly, with the fee paid from what stays', () => {
    expect(returnPlan('amount', 1_000_000n, 3_000n, 400_000n)).toEqual({ mode: 'amount', amount: 400_000n, fee: 3_000n, remaining: 597_000n });
    // spending everything but the fee is allowed: the recipient still gets exactly the amount
    expect(returnPlan('amount', 403_000n, 3_000n, 400_000n)).toMatchObject({ amount: 400_000n, remaining: 0n });
    expect(() => returnPlan('amount', 402_999n, 3_000n, 400_000n)).toThrow(/cannot cover/);
    expect(() => returnPlan('amount', 1_000_000n, 3_000n)).toThrow(/Choose an amount/);
    expect(() => returnPlan('amount', 1_000_000n, 3_000n, 0n)).toThrow(/Choose an amount/);
    expect(() => returnPlan('amount', 1_000_000n, 3_000n, -5n)).toThrow(/Choose an amount/);
    expect(() => returnPlan('amount', 1_000_000n, 50_000n, 1n)).toThrow(/range/);
  });
  it('enforces session terms: fee, count, budget, spacing and expiry', () => {
    const now = 1_000_000;
    expect(() => validateSessionTerms({ fee: 200n, maxPlays: 1, budget: 1000n, expires: now + 1000 }, now)).toThrow(/fee/);
    expect(() => validateSessionTerms({ fee: 300n, maxPlays: 1, budget: TARGET + 1n, expires: now + 1000 }, now)).toThrow(/budget/);
    expect(() => validateSessionTerms({ fee: 300n, maxPlays: 1, budget: 350n, expires: now + 8 * 24 * 3600_000 }, now)).toThrow(/7 days/);
    const ledger = new SessionLedger({ fee: 300n, maxPlays: 2, budget: 700n, expires: now + 3600_000 }, now);
    expect(() => ledger.consume(301n, now)).toThrow(/differs/);
    ledger.consume(300n, now);
    expect(() => ledger.consume(300n, now + MIN_PLAY_INTERVAL_MS - 1)).toThrow(/Too soon/);
    ledger.consume(300n, now + MIN_PLAY_INTERVAL_MS);
    expect(() => ledger.consume(300n, now + 2 * MIN_PLAY_INTERVAL_MS)).toThrow(/number of paid plays/);
    expect(ledger.summary).toMatchObject({ plays: 2, spent: 700n, playsLeft: 0, budgetLeft: 0n });
    const short = new SessionLedger({ fee: 300n, maxPlays: 5, budget: 400n, expires: now + 1000 }, now);
    short.consume(300n, now);
    expect(() => short.consume(300n, now + MIN_PLAY_INTERVAL_MS)).toThrow();
  });
});
