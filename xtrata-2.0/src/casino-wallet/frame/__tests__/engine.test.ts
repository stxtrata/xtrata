import { describe, expect, it } from 'vitest';
import { CancelledError, type Panel, type PasskeyPort } from '../../../listening-wallet/frame/engine';
import { createCasinoEngine, STORE_KEY } from '../engine';
import { BUY_FEE, checkSignedBuy, EXCHANGE_ADDRESS } from '../../../lib/casino-wallet/tx';
import { assertNoSecrets, isBridgeRequest, BRIDGE_PROTOCOL } from '../../../lib/wallet/passkey/bridge/protocol';
import { createListeningEngine } from '../../../listening-wallet/frame/engine';
import { issueRoomChallenge, verifyRoomProof } from '../../../../functions/lib/casino-room-proof';

const PRF = Uint8Array.from({ length: 32 }, (_, i) => i);
const ADDRESS = 'ST2SMCB4CV776FCP9A2EK0ZM37NAXM1MFJMMX9DW8'; // the locked vector in src/lib/casino-wallet/__tests__

function setup(opts: { outputs?: Uint8Array[]; cancel?: Panel['kind'][]; available?: boolean; newTab?: boolean; handle?: string } = {}) {
  const outputs = opts.outputs ?? [PRF, PRF, PRF, PRF, PRF, PRF];
  const panels: Panel[] = [];
  const map = new Map<string, string>();
  const opened: string[] = [];
  let evaluations = 0;
  let madeUserId = '';
  const passkey: PasskeyPort = {
    available: () => opts.available ?? true,
    create: async () => ({ credentialId: 'cred-1' }),
    evaluate: async (id) => ({ credentialId: id ?? 'cred-1', prf: outputs[evaluations++].slice(), userHandle: opts.handle ?? madeUserId }),
    createsInNewTab: () => !!opts.newTab,
    openCreator: (_x, name, userId) => { madeUserId = userId; opened.push(name); }
  };
  const engine = createCasinoEngine({
    passkey,
    store: { get: (k) => map.get(k) ?? null, set: (k, v) => void map.set(k, v) },
    ui: {
      act: async (panel, action) => {
        panels.push(panel);
        if (opts.cancel?.includes(panel.kind)) throw new CancelledError('cancelled');
        return action();
      },
      cancel: () => false,
      idle: () => {}
    }
  });
  return { h: engine.handlers, engine, panels, map, opened };
}

describe('casino wallet engine (wallet origin)', () => {
  it('makes a passkey wallet only after two matching PRF results, stores no key, and approves buys in the same tap', async () => {
    const s = setup();
    expect(await s.h['casino.status']()).toMatchObject({ state: 'none', passkeys: true });
    expect(await s.h['casino.open']({ mode: 'create' })).toEqual({ address: ADDRESS, kind: 'passkey' });
    expect(s.panels.map((p) => p.kind)).toEqual(['create', 'confirm-passkey', 'verify-passkey']);
    const stored = s.map.get(STORE_KEY) ?? '';
    expect(stored).toContain(ADDRESS);
    expect(stored).not.toContain('eea49baae1f8'); // the derived key
    expect(stored).not.toContain('000102030405'); // the PRF output
    expect(await s.h['casino.status']()).toMatchObject({ state: 'unlocked', kind: 'passkey', address: ADDRESS });
    // No second prompt to buy: the open tap approved it.
    const signed = await s.h['casino.signBuy']({ stx: 10, fee: BUY_FEE.toString(), nonce: '0' });
    expect(s.panels).toHaveLength(3);
    expect(checkSignedBuy(signed.raw, { address: ADDRESS, stx: 10, fee: BUY_FEE, nonce: 0n })).toBe(signed.txid);
    assertNoSecrets(signed);
    assertNoSecrets(await s.h['casino.status']());
  });

  it('refuses an unstable passkey before any address exists', async () => {
    const other = Uint8Array.from(PRF); other[3] ^= 1;
    const s = setup({ outputs: [PRF, other] });
    await expect(s.h['casino.open']({ mode: 'create' })).rejects.toThrow(/stable/);
    expect(await s.h['casino.status']()).toMatchObject({ state: 'none' });
  });

  it('unlocks the same wallet on the next visit with one tap, and lock drops the key', async () => {
    const s = setup();
    await s.h['casino.open']({ mode: 'create' });
    await s.h['casino.lock']();
    expect(await s.h['casino.status']()).toMatchObject({ state: 'known', kind: 'passkey', address: ADDRESS });
    await expect(s.h['casino.signBuy']({ stx: 1, fee: '3000', nonce: '0' })).rejects.toThrow(/Open the casino wallet/);
    s.panels.length = 0;
    expect(await s.h['casino.open']({ mode: 'unlock' })).toEqual({ address: ADDRESS, kind: 'passkey' });
    expect(s.panels.map((p) => p.kind)).toEqual(['unlock']);
  });

  it('WebKit: makes the passkey in a new tab and accepts only that passkey back', async () => {
    const s = setup({ newTab: true });
    expect(await s.h['casino.open']({ mode: 'create' })).toEqual({ address: ADDRESS, kind: 'passkey' });
    expect(s.opened[0]).toMatch(/^Xtrata casino wallet \(testnet\) · [0-9A-F]{4}$/);
    expect(s.panels.map((p) => p.kind)).toEqual(['create', 'confirm-passkey', 'verify-passkey']); // the sign-in back counts as the first PRF result
  });

  it('browser-only wallet: no passkey, made once, same address after a reload', async () => {
    const s = setup({ available: false });
    expect(await s.h['casino.status']()).toMatchObject({ state: 'none', passkeys: false });
    await expect(s.h['casino.open']({ mode: 'create' })).rejects.toThrow(/without a passkey/);
    const first = await s.h['casino.open']({ mode: 'device' });
    expect(first.kind).toBe('device');
    expect(first.address).toMatch(/^ST/);
    // A new frame on the same storage (a reload) opens the same wallet.
    const again = createCasinoEngine({
      passkey: { available: () => false, create: async () => { throw new Error('x'); }, evaluate: async () => { throw new Error('x'); } },
      store: { get: (k) => s.map.get(k) ?? null, set: (k, v) => void s.map.set(k, v) },
      ui: { act: async (_p, a) => a(), cancel: () => false, idle: () => {} }
    });
    expect(await again.handlers['casino.status']()).toMatchObject({ state: 'known', kind: 'device', address: first.address });
    expect(await again.handlers['casino.open']({ mode: 'device' })).toEqual(first);
    const signed = await again.handlers['casino.signBuy']({ stx: 2, fee: '3000', nonce: '7' });
    expect(checkSignedBuy(signed.raw, { address: first.address, stx: 2, fee: 3000n, nonce: 7n })).toBe(signed.txid);
    assertNoSecrets(await again.handlers['casino.status']());
  });

  it('signs nothing but a 1-10 STX buy to the exchange', async () => {
    const s = setup();
    await s.h['casino.open']({ mode: 'create' });
    for (const bad of [{ stx: 0 }, { stx: 11 }, { stx: 2.5 }, { stx: 1, fee: '999999' }, { stx: 1, nonce: '-1' }, { stx: 1, recipient: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG', fee: 'x' }])
      await expect(s.h['casino.signBuy']({ fee: '3000', nonce: '0', ...bad })).rejects.toThrow();
    // A recipient from the page is ignored: the exchange address is fixed in the box.
    const signed = await s.h['casino.signBuy']({ stx: 1, fee: '3000', nonce: '0', recipient: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG' });
    expect(() => checkSignedBuy(signed.raw, { address: ADDRESS, stx: 1, fee: 3000n, nonce: 0n })).not.toThrow();
    expect(EXCHANGE_ADDRESS).toBe('ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA');
  });

  it('reports both wallets a device holds, so the page can offer a passkey wallet to a browser-only player', async () => {
    const s = setup();
    const device = await s.h['casino.open']({ mode: 'device' });
    expect(await s.h['casino.status']()).toMatchObject({ state: 'unlocked', kind: 'device', deviceAddress: device.address });
    expect((await s.h['casino.status']()).passkeyAddress).toBeUndefined();
    // Upgrading: the open browser-only wallet does not stop a passkey wallet being made.
    expect(await s.h['casino.open']({ mode: 'create' })).toEqual({ address: ADDRESS, kind: 'passkey' });
    expect(await s.h['casino.status']()).toMatchObject({ state: 'unlocked', kind: 'passkey', passkeyAddress: ADDRESS, deviceAddress: device.address });
    await s.h['casino.lock']();
    expect(await s.h['casino.status']()).toMatchObject({ state: 'known', kind: 'passkey', passkeyAddress: ADDRESS, deviceAddress: device.address });
  });

  it('cancel in the frame signs nothing and leaves no wallet', async () => {
    const s = setup({ cancel: ['create'] });
    await expect(s.h['casino.open']({ mode: 'create' })).rejects.toThrow(/cancelled/);
    expect(await s.h['casino.status']()).toMatchObject({ state: 'none' });
  });
});

describe('casino room sign-in from the wallet box', () => {
  const SECRET = 's'.repeat(40);
  it('signs the room sentence the server verifies, for its own address only', async () => {
    const s = setup();
    await expect(s.h['casino.signRoomJoin']({})).rejects.toThrow(/Open the casino wallet/);
    await s.h['casino.open']({ mode: 'create' });
    const challenge = issueRoomChallenge(SECRET, ADDRESS);
    const { signature } = await s.h['casino.signRoomJoin']({ address: challenge.address, network: challenge.network, nonce: challenge.nonce, expires: challenge.expires });
    expect(verifyRoomProof(challenge, signature)).toMatchObject({ address: ADDRESS });
    assertNoSecrets({ signature });
    expect(s.panels).toHaveLength(3); // no extra prompt: the Room panel tap is the consent
  });

  it('refuses another address, mainnet, a stale or far-off expiry and a bad nonce', async () => {
    const s = setup();
    await s.h['casino.open']({ mode: 'create' });
    const c = issueRoomChallenge(SECRET, ADDRESS);
    const base = { address: c.address, network: c.network, nonce: c.nonce, expires: c.expires };
    await expect(s.h['casino.signRoomJoin']({ ...base, address: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG' })).rejects.toThrow(/different wallet/);
    await expect(s.h['casino.signRoomJoin']({ ...base, network: 'mainnet' })).rejects.toThrow(/testnet/);
    await expect(s.h['casino.signRoomJoin']({ ...base, expires: Date.now() - 1 })).rejects.toThrow(/expired/);
    await expect(s.h['casino.signRoomJoin']({ ...base, expires: Date.now() + 60 * 60_000 })).rejects.toThrow(/expired/);
    await expect(s.h['casino.signRoomJoin']({ ...base, nonce: 'zz' })).rejects.toThrow(/Invalid/);
  });
});

describe('the casino and radio wallet boxes stay apart', () => {
  it('casino methods are in the bridge protocol', () => {
    for (const method of ['casino.status', 'casino.open', 'casino.signBuy', 'casino.signRoomJoin', 'casino.cancel', 'casino.lock'])
      expect(isBridgeRequest({ protocol: BRIDGE_PROTOCOL, kind: 'request', id: 'x1', method })).toBe(true);
  });

  it('the casino box implements only casino methods, and the radio box none of them', () => {
    const casino = Object.keys(setup().h);
    expect(casino.every((m) => m.startsWith('casino.'))).toBe(true);
    const radio = Object.keys(createListeningEngine({
      passkey: { available: () => true, create: async () => ({ credentialId: 'c' }), evaluate: async () => ({ credentialId: 'c', prf: PRF }) },
      store: { get: () => null, set: () => {} },
      ui: { act: async (_p, a) => a(), cancel: () => false, idle: () => {} }
    }).handlers);
    expect(radio.some((m) => m.startsWith('casino.'))).toBe(false);
  });
});
