import { describe, expect, it } from 'vitest';
import {
  createStacksPrivateKey, deserializeTransaction, getAddressFromPrivateKey, makeRandomPrivKey, privateKeyToString,
  signMessageHashRsv, TransactionVersion, cvToJSON
} from '@stacks/transactions';
import { createListeningEngine, CancelledError, type Panel, type PasskeyPort } from '../engine';
import { deriveListeningIdentity } from '../../../lib/listening-wallet/derive';
import { linkHash, verifyLinkSignature } from '../../../lib/listening-wallet/link';
import { MIN_PLAY_INTERVAL_MS, TARGET } from '../../../lib/listening-wallet/policy';
import { assertNoSecrets } from '../../../lib/wallet/passkey/bridge/protocol';
import { validateSaved } from '../../../radio-test-wallet/chain';

const PRF = Uint8Array.from({ length: 32 }, (_, i) => i);
const ADDRESS = 'SPHRV6ESV321YCV6W990X4FKXB4S9D7F665FSCTV';
const mainKey = privateKeyToString(makeRandomPrivKey()).slice(0, 64) + '01';
const MAIN = getAddressFromPrivateKey(mainKey, TransactionVersion.Mainnet);
const receipt = 'ab'.repeat(16);

function setup(opts: { createPrf?: boolean; outputs?: Uint8Array[]; cancel?: Panel['kind'][]; available?: boolean } = {}) {
  let time = 1_760_000_000_000;
  const outputs = opts.outputs ?? [PRF, PRF, PRF, PRF];
  const panels: Panel[] = [];
  const idle: unknown[] = [];
  const map = new Map<string, string>();
  let evaluations = 0;
  const passkey: PasskeyPort = {
    available: () => opts.available ?? true,
    create: async () => ({ credentialId: 'cred-1', prf: opts.createPrf ? outputs[evaluations++].slice() : undefined }),
    evaluate: async (id) => ({ credentialId: id ?? 'cred-1', prf: outputs[evaluations++].slice() })
  };
  const engine = createListeningEngine({
    passkey,
    store: { get: (k) => map.get(k) ?? null, set: (k, v) => void map.set(k, v) },
    now: () => time,
    ui: {
      act: async (panel, action) => {
        panels.push(panel);
        if (opts.cancel?.includes(panel.kind)) throw new CancelledError();
        return action();
      },
      cancel: () => false,
      idle: (v) => void idle.push(v)
    }
  });
  const h = engine.handlers;
  const terms = (maxPlays = 3) => ({ fee: '300', maxPlays, budget: String(Math.min(350 * maxPlays, 1_000_000)), expires: time + 3600_000 });
  return { h, panels, map, idle, terms, evaluations: () => evaluations, tick: (ms: number) => { time += ms; }, now: () => time };
}

const play = (balance = '500000', nonce = '0') => ({ core: 3, song: 1234, receipt, fee: '300', nonce, balance });

describe('listening wallet engine (wallet origin)', () => {
  it('creates a wallet only after two matching PRF results and stores no secrets', async () => {
    const s = setup();
    expect(await s.h['listening.status']()).toEqual({ state: 'none', session: null });
    const r = await s.h['listening.unlock']({ mode: 'create' });
    expect(r.address).toBe(ADDRESS);
    expect(s.panels.map((p) => p.kind)).toEqual(['create', 'confirm-passkey', 'verify-passkey']);
    expect(s.panels[0].warnings?.join(' ')).toMatch(/no more than 1 STX/);
    const stored = [...s.map.values()].join('');
    const id = await deriveListeningIdentity(PRF);
    expect(stored).toContain(ADDRESS);
    expect(stored).not.toContain(id.privateKey.slice(0, 64));
    expect(stored).not.toContain('000102030405');
    expect(await s.h['listening.status']()).toMatchObject({ state: 'unlocked', address: ADDRESS, session: null });
  });

  it('uses PRF from creation when the authenticator provides it (one fewer tap)', async () => {
    const s = setup({ createPrf: true });
    await s.h['listening.unlock']({ mode: 'create' });
    expect(s.panels.map((p) => p.kind)).toEqual(['create', 'verify-passkey']);
  });

  it('refuses a passkey whose PRF output is unstable, before any address is shown', async () => {
    const other = Uint8Array.from(PRF); other[5] ^= 0xff;
    const s = setup({ outputs: [PRF, other] });
    await expect(s.h['listening.unlock']({ mode: 'create' })).rejects.toThrow(/stable/);
    expect(await s.h['listening.status']()).toEqual({ state: 'none', session: null });
    expect(s.map.size).toBe(0);
  });

  it('unlocks a known wallet and rejects a passkey that now derives a different address', async () => {
    const s = setup();
    await s.h['listening.unlock']({ mode: 'create' });
    await s.h['listening.lock']();
    expect(await s.h['listening.status']()).toMatchObject({ state: 'known', address: ADDRESS });
    await s.h['listening.unlock']({ mode: 'unlock' });
    expect((await s.h['listening.status']()).state).toBe('unlocked');

    const other = Uint8Array.from(PRF); other[0] ^= 1;
    const t = setup({ outputs: [PRF, PRF, other] });
    await t.h['listening.unlock']({ mode: 'create' });
    await t.h['listening.lock']();
    await expect(t.h['listening.unlock']({ mode: 'unlock' })).rejects.toThrow(/no longer gives the same wallet/);
  });

  it('reports unsupported browsers and never prompts there', async () => {
    const s = setup({ available: false });
    expect((await s.h['listening.status']()).state).toBe('unsupported');
    await expect(s.h['listening.unlock']({ mode: 'create' })).rejects.toThrow(/passkeys/);
    expect(s.panels).toHaveLength(0);
  });

  it('signs a paid play only inside an approved session, matching the existing saved-transaction validator', async () => {
    const s = setup();
    await s.h['listening.unlock']({ mode: 'create' });
    await expect(s.h['listening.signPlay'](play())).rejects.toThrow(/No approved listening session/);
    await s.h['listening.unlock']({ mode: 'create', terms: s.terms(2) });
    expect(s.panels.at(-1)?.kind).toBe('session');
    const signed = await s.h['listening.signPlay'](play());
    assertNoSecrets(signed);
    const id = await deriveListeningIdentity(PRF);
    expect(() => validateSaved({ id: receipt, address: id.address, kind: 'play', core: 3, song: 1234, recipient: 'SP000000000000000000002Q6VF78', amount: '50', fee: '300', nonce: '0', created: 0, status: 'signed', raw: signed.raw, txid: signed.txid })).not.toThrow();
    await expect(s.h['listening.signPlay'](play('500000', '1'))).rejects.toThrow(/Too soon/);
    s.tick(MIN_PLAY_INTERVAL_MS);
    await s.h['listening.signPlay'](play('500000', '1'));
    s.tick(MIN_PLAY_INTERVAL_MS);
    await expect(s.h['listening.signPlay'](play('500000', '2'))).rejects.toThrow(/number of paid plays/);
  });

  it('pauses above 1 STX and when the balance cannot cover a play', async () => {
    const s = setup();
    await s.h['listening.unlock']({ mode: 'create', terms: s.terms() });
    await expect(s.h['listening.signPlay'](play(String(TARGET + 1n)))).rejects.toThrow(/more than 1 STX/);
    await expect(s.h['listening.signPlay'](play('3000'))).rejects.toThrow(/Top up/);
    await expect(s.h['listening.signPlay']({ ...play(), fee: '5000' })).rejects.toThrow();
  });

  it('links only with a valid main-wallet signature and countersigns the same message', async () => {
    const s = setup();
    await s.h['listening.unlock']({ mode: 'create' });
    const issued = s.now();
    const link = { main: MAIN, listening: ADDRESS, issued };
    const mainSignature = signMessageHashRsv({ messageHash: linkHash(link), privateKey: createStacksPrivateKey(mainKey) }).data;
    await expect(s.h['listening.link']({ main: MAIN, issued: issued + 1, mainSignature })).rejects.toThrow(/does not match/);
    const r = await s.h['listening.link']({ main: MAIN, issued, mainSignature });
    assertNoSecrets(r);
    expect(verifyLinkSignature(link, r.listeningSignature, ADDRESS)).toBe(true);
    expect(await s.h['listening.status']()).toMatchObject({ linked: MAIN });
  });

  it('returns funds only to the linked main wallet, after an in-frame confirmation, and pauses paying', async () => {
    const s = setup();
    await s.h['listening.unlock']({ mode: 'create', terms: s.terms() });
    await expect(s.h['listening.prepareReturn']({ mode: 'all', balance: '900000', nonce: '4', fee: '3000' })).rejects.toThrow(/Link your main wallet/);
    const issued = s.now(), link = { main: MAIN, listening: ADDRESS, issued };
    await s.h['listening.link']({ main: MAIN, issued, mainSignature: signMessageHashRsv({ messageHash: linkHash(link), privateKey: createStacksPrivateKey(mainKey) }).data });

    const r = await s.h['listening.prepareReturn']({ mode: 'excess', balance: '1500000', nonce: '4', fee: '3000' });
    expect(r).toMatchObject({ amount: '497000', fee: '3000', recipient: MAIN, mode: 'excess' });
    const tx = deserializeTransaction(r.raw) as any;
    expect(cvToJSON(tx.payload.recipient).value).toBe(MAIN);
    expect(tx.payload.amount).toBe(497000n);
    expect(tx.auth.spendingCondition.nonce).toBe(4n);
    expect(s.panels.at(-1)?.lines.join(' ')).toContain(MAIN);
    expect((await s.h['listening.status']()).session).toBeNull();
    await expect(s.h['listening.signPlay'](play())).rejects.toThrow(/No approved/);
  });

  it('signs nothing when the listener cancels in the frame', async () => {
    const s = setup({ cancel: ['create'] });
    await expect(s.h['listening.unlock']({ mode: 'create', terms: s.terms() })).rejects.toBeInstanceOf(CancelledError);
    await expect(s.h['listening.signPlay'](play())).rejects.toThrow(/Unlock/);
    const t = setup({ cancel: ['session'] });
    await t.h['listening.unlock']({ mode: 'create' });
    await expect(t.h['listening.approveSession'](t.terms())).rejects.toBeInstanceOf(CancelledError);
    await expect(t.h['listening.signPlay'](play())).rejects.toThrow(/No approved/);
  });

  it('shows the paying terms on the passkey panel itself, so one confirm creates and switches paying on', async () => {
    const s = setup();
    const r = await s.h['listening.unlock']({ mode: 'create', terms: s.terms(3000) });
    expect(s.panels.map((p) => p.kind)).toEqual(['create', 'confirm-passkey', 'verify-passkey']);
    expect(s.panels[0].confirmLabel).toMatch(/pay as I listen/);
    expect(s.panels[0].lines.join(' ')).toMatch(/until you switch it off or the wallet runs out/);
    expect(r.session).toMatchObject({ playsLeft: 2857 }); // 1 STX / 350 µSTX caps it before 3000 plays
    await s.h['listening.lock']();
    await s.h['listening.unlock']({ mode: 'unlock', terms: s.terms(3000) });
    expect(s.panels.at(-1)).toMatchObject({ kind: 'unlock', confirmLabel: 'Unlock and keep paying' });
    expect((await s.h['listening.status']()).session).toMatchObject({ playsLeft: 2857 }); // 1 STX / 350 µSTX caps it before 3000 plays
  });

  it('drops the key on lock', async () => {
    const s = setup();
    await s.h['listening.unlock']({ mode: 'create', terms: s.terms() });
    await s.h['listening.lock']();
    await expect(s.h['listening.signPlay'](play())).rejects.toThrow(/Unlock/);
    expect((await s.h['listening.status']()).state).toBe('known');
  });

  it('never re-links silently: a different main wallet needs an in-frame confirm, and cancel keeps the old one', async () => {
    const cancel: Panel['kind'][] = [];
    const s = setup({ cancel });
    await s.h['listening.unlock']({ mode: 'create' });
    const sign = (main: string, key: string, issued: number) => signMessageHashRsv({ messageHash: linkHash({ main, listening: ADDRESS, issued }), privateKey: createStacksPrivateKey(key) }).data;
    await s.h['listening.link']({ main: MAIN, issued: s.now(), mainSignature: sign(MAIN, mainKey, s.now()) });
    expect(s.panels.at(-1)).toMatchObject({ kind: 'link', title: 'Confirm your main wallet' });
    expect(s.panels.at(-1)!.lines).toContain(MAIN);

    // A compromised page signs a link to its own address with its own key: a valid signature.
    const attackerKey = privateKeyToString(makeRandomPrivKey()).slice(0, 64) + '01';
    const ATTACKER = getAddressFromPrivateKey(attackerKey, TransactionVersion.Mainnet);
    cancel.push('link');
    await expect(s.h['listening.link']({ main: ATTACKER, issued: s.now() + 1, mainSignature: sign(ATTACKER, attackerKey, s.now() + 1) })).rejects.toBeInstanceOf(CancelledError);
    const panel = s.panels.at(-1)!;
    expect(panel).toMatchObject({ kind: 'link', title: 'Change where returns go?' });
    expect(panel.lines).toContain(ATTACKER);
    expect(panel.warnings?.join(' ')).toContain(MAIN);
    expect(await s.h['listening.status']()).toMatchObject({ linked: MAIN });
  });
});
