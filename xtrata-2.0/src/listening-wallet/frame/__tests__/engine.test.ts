import { describe, expect, it } from 'vitest';
import {
  createStacksPrivateKey, deserializeTransaction, getAddressFromPrivateKey, makeRandomPrivKey, privateKeyToString,
  signMessageHashRsv, TransactionVersion, cvToJSON, addressToString, PostConditionMode
} from '@stacks/transactions';
import { createListeningEngine, CancelledError, type Panel, type PasskeyPort } from '../engine';
import { deriveListeningIdentity } from '../../../lib/listening-wallet/derive';
import { linkHash, verifyLinkSignature } from '../../../lib/listening-wallet/link';
import { MIN_LIKE_INTERVAL_MS, MIN_PLAY_INTERVAL_MS, TARGET } from '../../../lib/listening-wallet/policy';
import { LIKES_CONTRACT } from '../../../lib/listening-wallet/tx';
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
    expect(await s.h['listening.status']()).toEqual({ state: 'none', session: null, features: ['cancel', 'like', 'standalone'] });
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
    expect(await s.h['listening.status']()).toEqual({ state: 'none', session: null, features: ['cancel', 'like', 'standalone'] });
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

  it('signs a like only in an approved session on a linked wallet: set-liked, moving nothing, fee from the budget', async () => {
    const s = setup();
    const like = (liked = true, nonce = '0', balance = '500000') => ({ song: 1234, liked, fee: '200', nonce, balance });
    await s.h['listening.unlock']({ mode: 'create' });
    await expect(s.h['listening.signLike'](like())).rejects.toThrow(/Paying is switched off/);
    await s.h['listening.approveSession'](s.terms(3000));
    // Unlinked is fine: a passkey-only listener likes under the listening address itself.
    await expect(s.h['listening.signLike'](like(true, '0', '100'))).rejects.toThrow(/Balance too low/);
    const issued = s.now(), link = { main: MAIN, listening: ADDRESS, issued };
    await s.h['listening.link']({ main: MAIN, issued, mainSignature: signMessageHashRsv({ messageHash: linkHash(link), privateKey: createStacksPrivateKey(mainKey) }).data });
    const before = (await s.h['listening.status']()).session!.budgetLeft;
    const signed = await s.h['listening.signLike'](like());
    assertNoSecrets(signed);
    const tx = deserializeTransaction(signed.raw) as any;
    expect(`${addressToString(tx.payload.contractAddress)}.${tx.payload.contractName.content}`).toBe(LIKES_CONTRACT);
    expect(tx.payload.functionName.content).toBe('set-liked');
    expect(tx.postConditionMode).toBe(PostConditionMode.Deny);
    expect(tx.postConditions.values).toHaveLength(0);
    expect(BigInt(before) - BigInt((await s.h['listening.status']()).session!.budgetLeft)).toBe(200n); // the 0.0002 STX fee only
    const entry = { id: 'l1', address: ADDRESS, kind: 'like' as const, core: 0, song: 1234, liked: true, recipient: '', amount: '0', fee: '200', nonce: '0', created: 0, status: 'signed' as const, raw: signed.raw, txid: signed.txid };
    expect(() => validateSaved(entry)).not.toThrow();
    expect(() => validateSaved({ ...entry, liked: false })).toThrow(/like does not match/);
    expect(() => validateSaved({ ...entry, song: 99 })).toThrow(/like does not match/);
    await expect(s.h['listening.signLike'](like(false, '1'))).rejects.toThrow(/Too soon/);
    s.tick(MIN_LIKE_INTERVAL_MS);
    await expect(s.h['listening.signLike'](like(false, '1', String(TARGET + 1n)))).rejects.toThrow(/more than 1 STX/);
    await expect(s.h['listening.signLike'](like(false, '1', '3100'))).rejects.toThrow(/Top up/);
    await expect(s.h['listening.signLike'](like(false, '1', '3200'))).resolves.toBeDefined(); // 3000 reserve + 200 fee
    s.tick(MIN_LIKE_INTERVAL_MS);
    await expect(s.h['listening.signLike']({ ...like(false, '1'), fee: '300' })).rejects.toThrow(/0.0002 STX/);
    await expect(s.h['listening.signLike']({ ...like(false, '1'), liked: 'yes' })).rejects.toThrow(/like or unlike/);
    expect((deserializeTransaction((await s.h['listening.signLike'](like(false, '1'))).raw) as any).payload.functionArgs[1].type).toBeDefined();
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
    await expect(s.h['listening.prepareReturn']({ mode: 'all', balance: '900000', nonce: '4', fee: '3000' })).rejects.toThrow(/Choose where to send the funds/);
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

  describe('passkey-only (no linked main wallet)', () => {
    const OTHER = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';
    const ret = (destination?: string) => ({ mode: 'all' as const, balance: '900000', nonce: '2', fee: '3000', ...(destination === undefined ? {} : { destination }) });

    it('returns to the destination the page supplies, showing the full address in the confirm', async () => {
      const s = setup();
      await s.h['listening.unlock']({ mode: 'create', terms: s.terms() });
      const r = await s.h['listening.prepareReturn'](ret(OTHER));
      expect(r).toMatchObject({ recipient: OTHER, amount: '897000', mode: 'all' });
      expect(cvToJSON((deserializeTransaction(r.raw) as any).payload.recipient).value).toBe(OTHER);
      const panel = s.panels.at(-1)!;
      expect(panel.kind).toBe('return');
      expect(panel.lines.join(' ')).toContain(OTHER);
      expect(panel.lines.join(' ')).toMatch(/Check every character/);
    });

    it('refuses a missing, malformed, contract or own-address destination', async () => {
      const s = setup();
      await s.h['listening.unlock']({ mode: 'create', terms: s.terms() });
      await expect(s.h['listening.prepareReturn'](ret())).rejects.toThrow(/Choose where to send/);
      await expect(s.h['listening.prepareReturn'](ret('nonsense'))).rejects.toThrow(/standard mainnet address/);
      await expect(s.h['listening.prepareReturn'](ret(OTHER + '.contract'))).rejects.toThrow(/standard mainnet address/);
      await expect(s.h['listening.prepareReturn'](ret(ADDRESS))).rejects.toThrow(/this listening wallet itself/);
    });

    it('a linked main wallet wins: a different destination from the page is ignored', async () => {
      const s = setup();
      await s.h['listening.unlock']({ mode: 'create', terms: s.terms() });
      const issued = s.now(), link = { main: MAIN, listening: ADDRESS, issued };
      await s.h['listening.link']({ main: MAIN, issued, mainSignature: signMessageHashRsv({ messageHash: linkHash(link), privateKey: createStacksPrivateKey(mainKey) }).data });
      const r = await s.h['listening.prepareReturn'](ret(OTHER));
      expect(r.recipient).toBe(MAIN);
      expect(s.panels.at(-1)!.lines.join(' ')).not.toContain(OTHER);
    });

    it('a cancelled return signs nothing', async () => {
      const s = setup({ cancel: ['return'] });
      await s.h['listening.unlock']({ mode: 'create', terms: s.terms() });
      await expect(s.h['listening.prepareReturn'](ret(OTHER))).rejects.toBeInstanceOf(CancelledError);
    });
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

describe('the unlock card says whose wallet it is', () => {
  const shortOf = (a: string) => a.slice(0, 6) + '…' + a.slice(-4);
  const sign = (main: string, key: string, issued: number) => signMessageHashRsv({ messageHash: linkHash({ main, listening: ADDRESS, issued }), privateKey: createStacksPrivateKey(key) }).data;
  const linkedLocked = async () => {
    const s = setup();
    await s.h['listening.unlock']({ mode: 'create' });
    await s.h['listening.link']({ main: MAIN, issued: s.now(), mainSignature: sign(MAIN, mainKey, s.now()) });
    await s.h['listening.lock']();
    return s;
  };

  it('a linked listener is greeted by its main wallet, not the listening address', async () => {
    const s = await linkedLocked();
    await s.h['listening.unlock']({ mode: 'unlock', terms: s.terms(), label: 'jim.btc' });
    const panel = s.panels.at(-1)!;
    expect(panel.kind).toBe('unlock');
    expect(panel.title).toBe('Welcome back, jim.btc');
    const text = [panel.title, panel.summary, ...panel.lines].join(' ');
    expect(text).toContain(shortOf(MAIN));
    expect(text).toMatch(/credited to jim\.btc/);
    expect(text).not.toContain(shortOf(ADDRESS));
  });

  it('without a name it shows the main wallet address, still not the listening address', async () => {
    const s = await linkedLocked();
    await s.h['listening.unlock']({ mode: 'unlock' });
    const panel = s.panels.at(-1)!;
    expect(panel.title).toBe(`Welcome back, ${shortOf(MAIN)}`);
    expect([panel.title, panel.summary, ...panel.lines].join(' ')).not.toContain(shortOf(ADDRESS));
  });

  it('keeps only a plain name from the page', async () => {
    const s = await linkedLocked();
    await s.h['listening.unlock']({ mode: 'unlock', label: '<img src=x onerror=1> alice.btc'.repeat(3) });
    const title = s.panels.at(-1)!.title;
    expect(title).not.toMatch(/[<>=]/);
    expect(title.length).toBeLessThanOrEqual('Welcome back, '.length + 40);
  });

  it('a passkey-only wallet (no link) keeps its own address as the identity', async () => {
    const s = setup();
    await s.h['listening.unlock']({ mode: 'create' });
    await s.h['listening.lock']();
    await s.h['listening.unlock']({ mode: 'unlock', label: 'jim.btc' }); // a label means nothing without a link
    const panel = s.panels.at(-1)!;
    expect(panel.title).toBe('Welcome back');
    expect([panel.summary, ...panel.lines].join(' ')).toContain(shortOf(ADDRESS));
    expect(panel.title).not.toContain('jim.btc');
  });
});
