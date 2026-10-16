import { describe, expect, it } from 'vitest';
import {
  createStacksPrivateKey, deserializeTransaction, getAddressFromPrivateKey, makeRandomPrivKey, privateKeyToString,
  signMessageHashRsv, TransactionVersion, cvToJSON, addressToString, PostConditionMode
} from '@stacks/transactions';
import { createListeningEngine, CancelledError, type Panel, type PasskeyPort } from '../engine';
import { deriveListeningIdentity } from '../../../lib/listening-wallet/derive';
import { linkHash, verifyLinkSignature } from '../../../lib/listening-wallet/link';
import { verifySlotSignature } from '../../../lib/listening-wallet/slots';
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
    expect(await s.h['listening.status']()).toEqual({ state: 'none', session: null, features: ['cancel', 'like', 'standalone', 'multi', 'partial', 'slots', 'rootLike', 'move'] });
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
    expect(await s.h['listening.status']()).toEqual({ state: 'none', session: null, features: ['cancel', 'like', 'standalone', 'multi', 'partial', 'slots', 'rootLike', 'move'] });
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
    await expect(s.h['listening.signLike'](like(true, '0', '100'))).rejects.toThrow(/out of funds/);
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
    await expect(s.h['listening.signLike'](like(false, '1', '3100'))).rejects.toThrow(/out of funds/);
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

    it('returns a chosen amount to the supplied destination, showing the amount and the full address', async () => {
      const s = setup();
      await s.h['listening.unlock']({ mode: 'create', terms: s.terms() });
      const r = await s.h['listening.prepareReturn']({ mode: 'amount', amount: '250000', balance: '900000', nonce: '2', fee: '3000', destination: OTHER });
      expect(r).toMatchObject({ recipient: OTHER, amount: '250000', fee: '3000', mode: 'amount' });
      const tx = deserializeTransaction(r.raw) as any;
      expect(cvToJSON(tx.payload.recipient).value).toBe(OTHER);
      expect(tx.payload.amount).toBe(250000n);
      const panel = s.panels.at(-1)!;
      expect(panel.title).toBe('Return part of the balance');
      expect(panel.lines.join(' ')).toContain(OTHER);
      expect(panel.lines.join(' ')).toContain('0.250000');
      // 900000 - 250000 - 3000 stays in the wallet
      expect(panel.lines.join(' ')).toContain('0.647000');
    });

    it('refuses an amount that is missing, zero, not a plain number or more than the balance covers', async () => {
      const s = setup();
      await s.h['listening.unlock']({ mode: 'create', terms: s.terms() });
      const base = { mode: 'amount' as const, balance: '900000', nonce: '2', fee: '3000', destination: OTHER };
      await expect(s.h['listening.prepareReturn'](base)).rejects.toThrow(/Invalid amount/);
      await expect(s.h['listening.prepareReturn']({ ...base, amount: '0' })).rejects.toThrow(/Choose an amount/);
      await expect(s.h['listening.prepareReturn']({ ...base, amount: '-5' })).rejects.toThrow(/Invalid amount/);
      await expect(s.h['listening.prepareReturn']({ ...base, amount: '1.5' })).rejects.toThrow(/Invalid amount/);
      await expect(s.h['listening.prepareReturn']({ ...base, amount: '899000' })).rejects.toThrow(/cannot cover/);
      expect(s.panels.filter((p) => p.kind === 'return')).toHaveLength(0);
    });

    it('applies the same destination rules to an amount return', async () => {
      const s = setup();
      await s.h['listening.unlock']({ mode: 'create', terms: s.terms() });
      const part = (destination?: string) => ({ mode: 'amount' as const, amount: '100000', balance: '900000', nonce: '2', fee: '3000', ...(destination === undefined ? {} : { destination }) });
      await expect(s.h['listening.prepareReturn'](part())).rejects.toThrow(/Choose where to send/);
      await expect(s.h['listening.prepareReturn'](part(OTHER + '.contract'))).rejects.toThrow(/standard mainnet address/);
      await expect(s.h['listening.prepareReturn'](part(ADDRESS))).rejects.toThrow(/this listening wallet itself/);
    });

    it('a cancelled amount return signs nothing and the build reports the partial feature', async () => {
      const s = setup({ cancel: ['return'] });
      await s.h['listening.unlock']({ mode: 'create', terms: s.terms() });
      await expect(s.h['listening.prepareReturn']({ mode: 'amount', amount: '100000', balance: '900000', nonce: '2', fee: '3000', destination: OTHER })).rejects.toBeInstanceOf(CancelledError);
      expect((await s.h['listening.status']()).features).toContain('partial');
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
    expect(s.panels[0].confirmLabel).toMatch(/start listening/);
    expect(s.panels[0].lines.join(' ')).toMatch(/until you switch it off or the wallet runs out/);
    expect(r.session).toMatchObject({ playsLeft: 2857 }); // 1 STX / 350 µSTX caps it before 3000 plays
    await s.h['listening.lock']();
    await s.h['listening.unlock']({ mode: 'unlock', terms: s.terms(3000) });
    expect(s.panels.at(-1)).toMatchObject({ kind: 'unlock', confirmLabel: 'Unlock and keep listening' });
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

describe('one listening wallet per main-wallet address', () => {
  const shortOf = (a: string) => a.slice(0, 6) + '…' + a.slice(-4);
  const keyB = privateKeyToString(makeRandomPrivKey()).slice(0, 64) + '01';
  const MAIN_B = getAddressFromPrivateKey(keyB, TransactionVersion.Mainnet);
  const keyC = privateKeyToString(makeRandomPrivKey()).slice(0, 64) + '01';
  const MAIN_C = getAddressFromPrivateKey(keyC, TransactionVersion.Mainnet);

  function box() {
    let time = 1_760_000_000_000, n = 0;
    const map = new Map<string, string>();
    const prfs = new Map<string, Uint8Array>();
    const panels: Panel[] = [];
    const creates: { exclude?: string[]; name?: string }[] = [];
    const evaluated: (string | undefined)[] = [];
    const engine = createListeningEngine({
      passkey: {
        available: () => true,
        create: async (exclude, name) => {
          const id = `cred-${++n}`;
          prfs.set(id, Uint8Array.from({ length: 32 }, (_, i) => (i * 3 + n * 11) % 256));
          creates.push({ exclude, name });
          return { credentialId: id, prf: prfs.get(id)!.slice() };
        },
        evaluate: async (id) => { evaluated.push(id); const k = id ?? 'cred-1'; return { credentialId: k, prf: prfs.get(k)!.slice() }; }
      },
      store: { get: (k) => map.get(k) ?? null, set: (k, v) => void map.set(k, v) },
      now: () => time,
      ui: { act: async (panel, action) => { panels.push(panel); return action(); }, cancel: () => false, idle: () => {} }
    });
    const h = engine.handlers;
    const link = async (main: string, key: string, listening: string) => {
      const issued = time++;
      await h['listening.link']({ main, issued, mainSignature: signMessageHashRsv({ messageHash: linkHash({ main, listening, issued }), privateKey: createStacksPrivateKey(key) }).data });
    };
    /** A wallet for `main`, linked to it, then locked again. */
    const makeFor = async (main: string, key: string) => {
      const r = await h['listening.unlock']({ mode: 'create', main });
      await link(main, key, r.address);
      await h['listening.lock']();
      return r.address as string;
    };
    return { h, map, panels, creates, evaluated, makeFor, link };
  }

  it('each address has its own wallet: status answers for the connected address, a new address gets none', async () => {
    const b = box();
    const a1 = await b.makeFor(MAIN, mainKey);
    const a2 = await b.makeFor(MAIN_B, keyB);
    expect(a1).not.toBe(a2);
    expect(await b.h['listening.status']({ main: MAIN })).toMatchObject({ state: 'known', address: a1, linked: MAIN });
    expect(await b.h['listening.status']({ main: MAIN_B })).toMatchObject({ state: 'known', address: a2, linked: MAIN_B });
    // never offers a wallet that belongs to a different address
    expect(await b.h['listening.status']({ main: MAIN_C })).toMatchObject({ state: 'none' });
    // without a main wallet it is the one used last, as before
    expect(await b.h['listening.status']()).toMatchObject({ address: a2 });
  });

  it('unlock opens the wallet for the connected address, not the last one used', async () => {
    const b = box();
    await b.makeFor(MAIN, mainKey);
    await b.makeFor(MAIN_B, keyB);
    b.evaluated.length = 0;
    await b.h['listening.unlock']({ mode: 'unlock', main: MAIN });
    expect(b.evaluated).toEqual(['cred-1']);
    expect(b.panels.at(-1)!.title).toContain(shortOf(MAIN));
  });

  it('with no address given, a second passkey still excludes the existing ones so it is not quietly duplicated', async () => {
    const b = box();
    await b.makeFor(MAIN, mainKey);
    await b.h['listening.unlock']({ mode: 'create' }).catch(() => undefined);
    expect(b.creates.at(-1)?.exclude).toEqual(['cred-1']);
  });

  it('switching to another address locks the open wallet and moves to that address', async () => {
    const b = box();
    const a1 = await b.makeFor(MAIN, mainKey);
    const a2 = await b.makeFor(MAIN_B, keyB);
    await b.h['listening.unlock']({ mode: 'unlock', main: MAIN, terms: { fee: '300', maxPlays: 3, budget: '1000', expires: 1_760_000_000_000 + 3600_000 } });
    expect(await b.h['listening.status']({ main: MAIN })).toMatchObject({ state: 'unlocked', address: a1 }); // same address: stays open
    const after = await b.h['listening.status']({ main: MAIN_B });
    expect(after).toMatchObject({ state: 'known', address: a2, linked: MAIN_B, session: null });
    await expect(b.h['listening.signPlay']({ core: 3, song: 1, receipt: 'ab'.repeat(16), fee: '300', nonce: '0', balance: '500000' })).rejects.toThrow(/Unlock/);
  });

  it('a new address gets a separate wallet, named for it in the passkey list, and the old one stays', async () => {
    const b = box();
    const a1 = await b.makeFor(MAIN, mainKey);
    const r = await b.h['listening.unlock']({ mode: 'create', main: MAIN_B });
    expect(r.address).not.toBe(a1);
    // Nothing is excluded: a real authenticator refuses a new passkey when an excluded credential is already on it.
    expect(b.creates.at(-1)).toMatchObject({ exclude: [], name: `Xtrata listening wallet · ${shortOf(MAIN_B)}` });
    const panel = b.panels.find((p) => p.kind === 'create' && p.summary?.includes('separate'))!;
    expect(panel.summary).toContain(shortOf(MAIN_B));
    await b.link(MAIN_B, keyB, r.address);
    await b.h['listening.lock']();
    expect(await b.h['listening.status']({ main: MAIN })).toMatchObject({ address: a1 });
  });

  it('a never-linked (passkey-only) wallet can be claimed by the first address that links it, then belongs to it', async () => {
    const b = box();
    const solo = await b.h['listening.unlock']({ mode: 'create' }); // no main wallet
    await b.h['listening.lock']();
    expect(await b.h['listening.status']({ main: MAIN })).toMatchObject({ state: 'known', address: solo.address, linked: undefined });
    await b.h['listening.unlock']({ mode: 'unlock', main: MAIN });
    await b.link(MAIN, mainKey, solo.address);
    await b.h['listening.lock']();
    expect(await b.h['listening.status']({ main: MAIN })).toMatchObject({ address: solo.address, linked: MAIN });
    expect(await b.h['listening.status']({ main: MAIN_B })).toMatchObject({ state: 'none' }); // no longer anyone else's to claim
  });

  it('an unlinked wallet open with no main wallet connected stays open when one connects that it serves, and closes when another serves it', async () => {
    const b = box();
    const mine = await b.makeFor(MAIN, mainKey);
    const solo = await b.h['listening.unlock']({ mode: 'create' });
    expect(await b.h['listening.status']({ main: MAIN_B })).toMatchObject({ state: 'unlocked', address: solo.address }); // can be claimed by B
    await b.link(MAIN_B, keyB, solo.address);
    expect(await b.h['listening.status']({ main: MAIN })).toMatchObject({ state: 'known', address: mine }); // MAIN has its own: solo-then-B wallet closes
  });

  it('reports which other addresses have a wallet on this device, so the page can say so', async () => {
    const b = box();
    await b.makeFor(MAIN, mainKey);
    await b.makeFor(MAIN_B, keyB);
    // a third address has none: it hears about both
    expect((await b.h['listening.status']({ main: MAIN_C })).others?.slice().sort()).toEqual([MAIN, MAIN_B].sort());
    // a connected address with its own wallet hears about the other one only
    expect(await b.h['listening.status']({ main: MAIN })).toMatchObject({ linked: MAIN, others: [MAIN_B] });
    // no other wallets: the field is left out
    const solo = box();
    await solo.makeFor(MAIN, mainKey);
    expect(await solo.h['listening.status']({ main: MAIN })).not.toHaveProperty('others');
  });

  it('keeps up to 25 wallets on the device', async () => {
    const b = box();
    for (let i = 0; i < 27; i++) await b.h['listening.unlock']({ mode: 'create' }), await b.h['listening.lock']();
    expect(JSON.parse(b.map.get('xtrata.listening-wallet.v1')!).wallets).toHaveLength(25);
  });
});

describe('one passkey, many wallets (slots)', () => {
  const SLOT1 = 'SP3ANJ3MWZKPPAEN8JAHBXA7QZ85GDHDZR47V8ZC1';
  const SLOT2 = 'SP1H6JGJNMR9KJPKGSR70TDRDBGH0TZZKAH9Q2THA';

  it('gives the address of any slot without a tap, only while unlocked, and never key material', async () => {
    const s = setup();
    await expect(s.h['listening.slotAddress']({ slot: 1 })).rejects.toThrow(/Unlock/);
    await s.h['listening.unlock']({ mode: 'create' });
    const before = s.evaluations(), panels = s.panels.length;
    const r = await s.h['listening.slotAddress']({ slot: 1 });
    expect(r).toEqual({ slot: 1, address: SLOT1 });
    assertNoSecrets(r);
    expect((await s.h['listening.slotAddress']({ slot: 0 })).address).toBe(ADDRESS);
    expect(s.evaluations()).toBe(before);
    expect(s.panels).toHaveLength(panels);
    for (const bad of [-1, 1.5, 100_001, '1', undefined]) await expect(s.h['listening.slotAddress']({ slot: bad })).rejects.toThrow(/not available/);
  });

  it('switches the open wallet and signs plays and likes as that wallet, with one shared session budget', async () => {
    const s = setup();
    await s.h['listening.unlock']({ mode: 'create', terms: s.terms(3) });
    expect(await s.h['listening.status']()).toMatchObject({ state: 'unlocked', address: ADDRESS, slot: 0 });
    const before = s.evaluations();
    const opened = await s.h['listening.openSlot']({ slot: 1 });
    expect(opened).toMatchObject({ slot: 1, address: SLOT1 });
    expect(s.evaluations()).toBe(before);
    expect(await s.h['listening.status']()).toMatchObject({ state: 'unlocked', address: SLOT1, slot: 1 });
    const signed = await s.h['listening.signPlay'](play());
    expect(deserializeTransaction(signed.raw).auth.spendingCondition.signer).toBeTruthy();
    const tx = deserializeTransaction(signed.raw) as any;
    expect(addressToString({ type: 0, version: 22, hash160: tx.auth.spendingCondition.signer } as any)).toBe(SLOT1);
    // the session's play budget is for the listener, whichever wallet pays
    s.tick(MIN_PLAY_INTERVAL_MS);
    await s.h['listening.openSlot']({ slot: 2 });
    await s.h['listening.signPlay'](play('500000', '0'));
    s.tick(MIN_PLAY_INTERVAL_MS);
    await s.h['listening.openSlot']({ slot: 0 });
    await s.h['listening.signPlay'](play('500000', '0'));
    s.tick(MIN_PLAY_INTERVAL_MS);
    await expect(s.h['listening.signPlay'](play('500000', '1'))).rejects.toThrow(/number of paid plays/);
  });

  it('signs every like with the passkey\'s own wallet, whichever album wallet is open, and reports it as root', async () => {
    const s = setup();
    await s.h['listening.unlock']({ mode: 'create', terms: s.terms() });
    expect(await s.h['listening.status']()).toMatchObject({ slot: 0, root: ADDRESS });
    await s.h['listening.openSlot']({ slot: 2 });
    expect(await s.h['listening.status']()).toMatchObject({ address: SLOT2, slot: 2, root: ADDRESS });
    const like = (liked = true, nonce = '0', balance = '500000') => ({ song: 1234, liked, fee: '200', nonce, balance });
    const signer = (raw: string) => addressToString({ type: 0, version: 22, hash160: (deserializeTransaction(raw) as any).auth.spendingCondition.signer } as any);
    expect(signer((await s.h['listening.signLike'](like())).raw)).toBe(ADDRESS);
    // the album wallet's own balance never matters: the page sends the main listener wallet's
    s.tick(MIN_LIKE_INTERVAL_MS);
    await expect(s.h['listening.signLike'](like(false, '1', '100'))).rejects.toThrow(/main listener wallet is out of funds/);
  });

  it('moves money only between wallets of the same passkey: the destination is a wallet number, nothing else can be aimed at', async () => {
    const s = setup();
    await expect(s.h['listening.signMove']({ to: 1, amount: '15000', fee: '3000', nonce: '0', balance: '500000' })).rejects.toThrow(/Unlock/);
    await s.h['listening.unlock']({ mode: 'create' });
    const before = s.evaluations(), panels = s.panels.length;
    const move = (over: object = {}) => ({ to: 1, amount: '15000', fee: '3000', nonce: '4', balance: '500000', ...over });
    const signer = (raw: string) => addressToString({ type: 0, version: 22, hash160: (deserializeTransaction(raw) as any).auth.spendingCondition.signer } as any);
    // first wallet -> album wallet, from the open wallet by default
    const r = await s.h['listening.signMove'](move());
    expect(r).toMatchObject({ from: ADDRESS, to: SLOT1, amount: '15000', fee: '3000' });
    const tx = deserializeTransaction(r.raw) as any;
    expect(signer(r.raw)).toBe(ADDRESS);
    expect(cvToJSON(tx.payload.recipient).value).toBe(SLOT1);
    expect(String(tx.payload.amount)).toBe('15000');
    assertNoSecrets(r);
    // an album wallet is the open one: move from it to the first wallet, or from the first wallet while it is open
    await s.h['listening.openSlot']({ slot: 1 });
    const back = await s.h['listening.signMove'](move({ to: 0 }));
    expect(signer(back.raw)).toBe(SLOT1);
    expect(cvToJSON((deserializeTransaction(back.raw) as any).payload.recipient).value).toBe(ADDRESS);
    const fromRoot = await s.h['listening.signMove'](move({ from: 0, to: 1 }));
    expect(signer(fromRoot.raw)).toBe(ADDRESS);
    // no passkey tap and no panel
    expect(s.evaluations()).toBe(before);
    expect(s.panels).toHaveLength(panels);
  });

  it('refuses moves that are the same wallet, a bad number, too small, a runaway fee, or leave no reserve', async () => {
    const s = setup();
    await s.h['listening.unlock']({ mode: 'create' });
    const move = (over: object = {}) => ({ to: 1, amount: '15000', fee: '3000', nonce: '0', balance: '500000', ...over });
    await expect(s.h['listening.signMove'](move({ to: 0 }))).rejects.toThrow(/two different wallets/);
    for (const to of [-1, 1.5, 100_001, '1', undefined]) await expect(s.h['listening.signMove'](move({ to }))).rejects.toThrow(/two different wallets/);
    await expect(s.h['listening.signMove'](move({ amount: '4999' }))).rejects.toThrow(/too small/);
    await expect(s.h['listening.signMove'](move({ fee: '10001' }))).rejects.toThrow(/fee is not allowed/);
    await expect(s.h['listening.signMove'](move({ fee: '0' }))).rejects.toThrow(/fee is not allowed/);
    await expect(s.h['listening.signMove'](move({ balance: '20000' }))).rejects.toThrow(/reserve/);
    await expect(s.h['listening.signMove'](move({ balance: '21000' }))).resolves.toBeDefined(); // 15000 + 3000 fee + 3000 reserve
    await expect(s.h['listening.signMove'](move({ to: 'SP1FVCANW8KX51C70JJAFTES86SR48CPP6F2ANQKP' }))).rejects.toThrow(/two different wallets/);
  });

  it('switching changes nothing about where returns go: a linked passkey sends every wallet to its main wallet', async () => {
    const s = setup();
    await s.h['listening.unlock']({ mode: 'create', terms: s.terms() });
    const issued = s.now(), link = { main: MAIN, listening: ADDRESS, issued };
    const mainSignature = signMessageHashRsv({ messageHash: linkHash(link), privateKey: createStacksPrivateKey(mainKey) }).data;
    await s.h['listening.link']({ main: MAIN, issued, mainSignature });
    await s.h['listening.openSlot']({ slot: 1 });
    // linking is the passkey's own wallet's job
    await expect(s.h['listening.link']({ main: MAIN, issued, mainSignature })).rejects.toThrow(/own listening wallet/);
    const r = await s.h['listening.prepareReturn']({ mode: 'all', balance: '900000', nonce: '0', fee: '3000' });
    expect(r.recipient).toBe(MAIN);
    const tx = deserializeTransaction(r.raw) as any;
    expect(addressToString({ type: 0, version: 22, hash160: tx.auth.spendingCondition.signer } as any)).toBe(SLOT1);
  });

  it('binds a slot to the passkey wallet with both signatures and no panel; refuses root, bad numbers and stale times', async () => {
    const s = setup();
    await s.h['listening.unlock']({ mode: 'create' });
    const panels = s.panels.length;
    const b = await s.h['listening.bindSlot']({ slot: 2, issued: s.now() });
    assertNoSecrets(b);
    expect(b).toMatchObject({ root: ADDRESS, slot: 2, address: SLOT2 });
    expect(verifySlotSignature(b, b.rootSignature, ADDRESS) && verifySlotSignature(b, b.slotSignature, SLOT2)).toBe(true);
    expect(s.panels).toHaveLength(panels);
    // binding is the same whichever wallet is open
    await s.h['listening.openSlot']({ slot: 5 });
    expect(await s.h['listening.bindSlot']({ slot: 2, issued: s.now() })).toMatchObject({ root: ADDRESS, address: SLOT2 });
    await expect(s.h['listening.bindSlot']({ slot: 0, issued: s.now() })).rejects.toThrow(/1 or more/);
    await expect(s.h['listening.bindSlot']({ slot: -3, issued: s.now() })).rejects.toThrow(/not available/);
    await expect(s.h['listening.bindSlot']({ slot: 2, issued: s.now() - 16 * 60_000 })).rejects.toThrow(/expired/);
  });

  it('lock drops every wallet: nothing can be derived or switched afterwards, and an unlock starts at the passkey wallet', async () => {
    const s = setup();
    await s.h['listening.unlock']({ mode: 'create' });
    await s.h['listening.openSlot']({ slot: 3 });
    await s.h['listening.lock']();
    await expect(s.h['listening.slotAddress']({ slot: 1 })).rejects.toThrow(/Unlock/);
    await expect(s.h['listening.openSlot']({ slot: 1 })).rejects.toThrow(/Unlock/);
    await expect(s.h['listening.bindSlot']({ slot: 1, issued: s.now() })).rejects.toThrow(/Unlock/);
    expect(await s.h['listening.status']()).toMatchObject({ state: 'known', address: ADDRESS });
    expect((await s.h['listening.status']()).slot).toBeUndefined();
    await s.h['listening.unlock']({ mode: 'unlock' });
    expect(await s.h['listening.status']()).toMatchObject({ address: ADDRESS, slot: 0 });
  });

  it('will not switch wallet while a panel is waiting for the listener, and the panel then signs for the wallet it was shown for', async () => {
    let release!: () => void;
    const waiting = new Promise<void>((r) => { release = r; });
    const map = new Map<string, string>();
    const engine = createListeningEngine({
      passkey: { available: () => true, create: async () => ({ credentialId: 'cred-1', prf: PRF.slice() }), evaluate: async (id) => ({ credentialId: id ?? 'cred-1', prf: PRF.slice() }) },
      store: { get: (k) => map.get(k) ?? null, set: (k, v) => void map.set(k, v) },
      now: () => 1_760_000_000_000,
      ui: { act: async (panel, action) => { if (panel.kind === 'return') await waiting; return action(); }, cancel: () => false, idle: () => undefined }
    });
    const h = engine.handlers as any;
    await h['listening.unlock']({ mode: 'create' });
    const pending = h['listening.prepareReturn']({ mode: 'all', balance: '900000', nonce: '0', fee: '3000', destination: 'SP1RKMSSGS3TCZW6HXFYXAM0DGHS2VNKSBTB4G183' });
    await expect(h['listening.openSlot']({ slot: 1 })).rejects.toThrow(/waiting for you in its panel/);
    release();
    const r = await pending;
    const tx = deserializeTransaction(r.raw) as any;
    expect(addressToString({ type: 0, version: 22, hash160: tx.auth.spendingCondition.signer } as any)).toBe(ADDRESS);
    await expect(h['listening.openSlot']({ slot: 1 })).resolves.toMatchObject({ address: SLOT1 });
  });
});
