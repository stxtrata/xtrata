import { describe, expect, it } from 'vitest';
import {
  createStacksPrivateKey, deserializeTransaction, getAddressFromPrivateKey, makeRandomPrivKey, privateKeyToString,
  signMessageHashRsv, TransactionVersion, cvToJSON, addressToString, PostConditionMode
} from '@stacks/transactions';
import { createListeningEngine, CancelledError, type Panel, type PasskeyPort } from '../engine';
import { deriveListeningIdentity as deriveOriginalIdentity } from '../../../lib/listening-wallet/derive';
import { derivePhraseSlot, phraseBase } from '../../../lib/listening-wallet/phrase';
/** The player a newly made passkey gives: one with a backup phrase (phrase.ts). */
const deriveListeningIdentity = async (prf: Uint8Array) => derivePhraseSlot(await phraseBase(prf), 0);
void deriveOriginalIdentity;
import { linkHash, verifyLinkSignature } from '../../../lib/listening-wallet/link';
import { verifySlotSignature } from '../../../lib/listening-wallet/slots';
import { MIN_LIKE_INTERVAL_MS, MIN_PLAY_INTERVAL_MS, TARGET } from '../../../lib/listening-wallet/policy';
import { AWARDS_CONTRACT, LIKES_CONTRACT } from '../../../lib/listening-wallet/tx';
import { buildRecord } from '../../../lib/music-awards/record';
import { verifyShelfSignature } from '../../../lib/music-releases/release';
import { assertNoSecrets } from '../../../lib/wallet/passkey/bridge/protocol';
import { validateSaved } from '../../../radio-test-wallet/chain';

const PRF = Uint8Array.from({ length: 32 }, (_, i) => i);
const ADDRESS = 'SP1SY289GQAHCH7JZ1MSS5VMPNPH8GEK2DPRKKJ6N';
const mainKey = privateKeyToString(makeRandomPrivKey()).slice(0, 64) + '01';
const MAIN = getAddressFromPrivateKey(mainKey, TransactionVersion.Mainnet);
const receipt = 'ab'.repeat(16);

function setup(opts: { handle?: string; store?: Record<string, string>; onPanel?: (p: Panel) => void; createPrf?: boolean; outputs?: Uint8Array[]; cancel?: Panel['kind'][]; available?: boolean } = {}) {
  let time = 1_760_000_000_000;
  const outputs = opts.outputs ?? [PRF, PRF, PRF, PRF];
  const panels: Panel[] = [];
  const idle: unknown[] = [];
  const map = new Map<string, string>(Object.entries(opts.store ?? {}));
  let evaluations = 0;
  let handle: string | undefined = opts.handle;
  const passkey: PasskeyPort = {
    available: () => opts.available ?? true,
    // Like a real authenticator: the passkey keeps the public user id it was made with and hands it back on sign-in.
    create: async (_exclude, _name, userId) => { handle = userId; return { credentialId: 'cred-1', prf: opts.createPrf ? outputs[evaluations++].slice() : undefined }; },
    evaluate: async (id) => ({ credentialId: id ?? 'cred-1', prf: outputs[evaluations++].slice(), userHandle: handle })
  };
  const engine = createListeningEngine({
    passkey,
    store: { get: (k) => map.get(k) ?? null, set: (k, v) => void map.set(k, v) },
    now: () => time,
    ui: {
      act: async (panel, action) => {
        panels.push(panel);
        opts.onPanel?.(panel);
        if (opts.cancel?.includes(panel.kind)) throw new CancelledError();
        return action();
      },
      cancel: () => false,
      idle: (v) => void idle.push(v)
    }
  });
  const h = engine.handlers;
  const terms = (maxPlays = 3) => ({ fee: '300', maxPlays, budget: String(Math.min(350 * maxPlays, 1_000_000)), expires: time + 3600_000 });
  return { h, panels, map, idle, terms, handle: () => handle, evaluations: () => evaluations, tick: (ms: number) => { time += ms; }, now: () => time };
}

const play = (balance = '500000', nonce = '0') => ({ core: 3, song: 1234, receipt, fee: '300', nonce, balance });

describe('listening wallet engine (wallet origin)', () => {
  it('creates a wallet only after two matching PRF results and stores no secrets', async () => {
    const s = setup();
    expect(await s.h['listening.status']()).toEqual({ state: 'none', session: null, features: ['cancel', 'like', 'standalone', 'multi', 'partial', 'slots', 'rootLike', 'move', 'phrase', 'award', 'sendRecord', 'shelf', 'another', 'forget'] });
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
    expect(await s.h['listening.status']()).toEqual({ state: 'none', session: null, features: ['cancel', 'like', 'standalone', 'multi', 'partial', 'slots', 'rootLike', 'move', 'phrase', 'award', 'sendRecord', 'shelf', 'another', 'forget'] });
    // No wallet, and no half-made passkey kept either: an unstable passkey is dropped, not picked up again.
    const kept = JSON.parse(s.map.get('xtrata.listening-wallet.v1') ?? '{"wallets":[]}');
    expect(kept.wallets).toEqual([]);
    expect(kept.pending).toBeUndefined();
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

  describe('a deliberate second player (someone who made theirs before the giveaway claims a free one)', () => {
    it('makes a NEW passkey beside the old one: nothing excluded, a name with a tag, and the box says it is a second player', async () => {
      const b = box();
      const first = (await b.h['listening.unlock']({ mode: 'create' })).address;
      await b.h['listening.lock']();
      const second = (await b.h['listening.unlock']({ mode: 'create', another: true, quick: true })).address;
      expect(second).not.toBe(first);
      expect(b.creates.at(-1)!.exclude).toEqual([]);
      expect(b.creates.at(-1)!.name).toMatch(/^Xtrata player · [0-9A-F]{4}$/);
      const panel = b.panels.find((p) => p.title === 'Make a new player')!;
      expect(panel.summary).toMatch(/A new, separate player with its own passkey \(“Xtrata player · [0-9A-F]{4}”\)\. Your other player and everything in it stay exactly as they are\./);
      expect(panel.warnings!.join(' ')).toContain('This device already has a listening wallet');
      // both are remembered; the new one is the one this device opens next
      await b.h['listening.lock']();
      expect(await b.h['listening.status']()).toMatchObject({ state: 'known', address: second, phrase: true });
      // the old player is untouched and still opens with its own passkey
      b.evaluated.length = 0;
      expect((await b.h['listening.unlock']({ mode: 'unlock', anyPasskey: true })).address).toBe(first);
      expect(b.evaluated[0]).toBeUndefined(); // the browser offered every passkey, not just the last one
    });

    it('is only for a passkey-only player on a device that already has one: otherwise it changes nothing', async () => {
      const fresh = box();
      await fresh.h['listening.unlock']({ mode: 'create', another: true });
      expect(fresh.creates.at(-1)!.exclude).toEqual([]);                                   // a first player is a first player:
      expect(fresh.creates.at(-1)!.name).toMatch(/^Xtrata player · [0-9A-F]{4}$/);         // only its passkey's name is tagged
      expect(fresh.panels.some((p) => p.title === 'Make a new player')).toBe(false);
      expect((await fresh.h['listening.status']()).passkeyName).toMatch(/^Xtrata player · [0-9A-F]{4}$/);
      const b = box();
      await b.makeFor(MAIN, mainKey);
      await b.h['listening.unlock']({ mode: 'create', main: MAIN_B, another: true });
      expect(b.creates.at(-1)!.name).toBe(`Xtrata listening wallet · ${shortOf(MAIN_B)}`);  // an address's wallet stays an address's wallet
      expect(b.panels.some((p) => p.title === 'Make a new player')).toBe(false);
    });

    it('without asking for it, a second passkey-only player is still refused the old way (the existing passkeys are excluded)', async () => {
      const b = box();
      await b.h['listening.unlock']({ mode: 'create' });
      await b.h['listening.lock']();
      await b.h['listening.unlock']({ mode: 'create' }).catch(() => undefined);
      expect(b.creates.at(-1)!.exclude).toEqual(['cred-1']);
    });

    it('the box says it can do this, so a page only offers it to a box that can', async () => {
      expect((await box().h['listening.status']()).features).toEqual(expect.arrayContaining(['another', 'forget']));
    });
  });

  describe('removing an old player from this device (replacing it with a new one)', () => {
    /** A device like a real one: each passkey hands back the public user id it was made with. */
    function device() {
      let n = 0;
      const map = new Map<string, string>(), prfs = new Map<string, Uint8Array>(), handles = new Map<string, string | undefined>();
      const panels: Panel[] = [], creates: { exclude?: string[]; name?: string }[] = [];
      let offered = 'cred-1'; // which passkey the listener picks when the browser offers them all
      const engine = createListeningEngine({
        passkey: {
          available: () => true,
          create: async (exclude, name, userId) => { const id = `cred-${++n}`; prfs.set(id, Uint8Array.from({ length: 32 }, (_, i) => (i * 7 + n * 13) % 256)); handles.set(id, userId); creates.push({ exclude, name }); return { credentialId: id }; },
          evaluate: async (id) => { const k = id ?? offered; return { credentialId: k, prf: prfs.get(k)!.slice(), userHandle: handles.get(k) }; }
        },
        store: { get: (k) => map.get(k) ?? null, set: (k, v) => void map.set(k, v) },
        now: () => 1_760_000_000_000,
        ui: { act: async (panel, action) => { panels.push(panel); return action(); }, cancel: () => false, idle: () => {} }
      });
      /** An old-style player (made before backup words): its passkey has no version-2 user id. */
      const makeOld = async () => { n = 1; prfs.set('cred-1', Uint8Array.from({ length: 32 }, (_, i) => (i * 5 + 3) % 256)); handles.set('cred-1', undefined); creates.push({ exclude: [], name: undefined }); return (await engine.handlers['listening.unlock']({ mode: 'unlock', anyPasskey: true })).address as string; };
      return { h: engine.handlers, panels, creates, pick: (id: string) => { offered = id; }, makeOld };
    }

    it('only an open player can be removed, the box asks first, and it says to empty it', async () => {
      const d = device();
      await d.h['listening.unlock']({ mode: 'create' });
      await d.h['listening.lock']();
      await expect(d.h['listening.forget']()).rejects.toThrow(/Unlock the listening wallet first/);
      await d.h['listening.unlock']({ mode: 'unlock' });
      const out = await d.h['listening.forget']();
      const panel = d.panels.at(-1)!;
      expect(panel).toMatchObject({ kind: 'forget', title: 'Remove this player from this device?', confirmLabel: 'Remove from this device' });
      expect(panel.summary).toContain('Only do this once it is empty');
      expect(panel.warnings!.join(' ')).toContain('Empty it first');
      expect(panel.lines.join(' ')).toContain('Its passkey stays on your phone until you delete it yourself');
      expect(out.left).toBe(0);
      expect(await d.h['listening.status']()).toMatchObject({ state: 'none' }); // locked, and no longer on this device
    });

    it('a refused panel removes nothing', async () => {
      const map = new Map<string, string>();
      const prf = Uint8Array.from({ length: 32 }, (_, i) => i);
      let refuse = false;
      const engine = createListeningEngine({
        passkey: { available: () => true, create: async () => ({ credentialId: 'c' }), evaluate: async () => ({ credentialId: 'c', prf: prf.slice() }) },
        store: { get: (k) => map.get(k) ?? null, set: (k, v) => void map.set(k, v) }, now: () => 1,
        ui: { act: async (panel, action) => { if (refuse && panel.kind === 'forget') throw new CancelledError(); return action(); }, cancel: () => false, idle: () => {} }
      });
      const made = await engine.handlers['listening.unlock']({ mode: 'create' });
      refuse = true;
      await expect(engine.handlers['listening.forget']()).rejects.toBeInstanceOf(CancelledError);
      expect(await engine.handlers['listening.status']()).toMatchObject({ state: 'unlocked', address: made.address });
    });

    it('the removed player is not gone: its passkey opens the very same address again (an old-style one included)', async () => {
      const d = device();
      const old = await d.makeOld();
      expect((await d.h['listening.status']()).phrase).toBeUndefined();        // an old-style player: no backup words
      await d.h['listening.forget']();
      expect((await d.h['listening.unlock']({ mode: 'unlock', anyPasskey: true })).address).toBe(old);
    });

    it('after it is removed, the next player is made the ordinary way with a name that cannot be confused with the old passkey', async () => {
      const d = device();
      const old = await d.makeOld();
      await d.h['listening.forget']();
      const fresh = (await d.h['listening.unlock']({ mode: 'create', another: true, quick: true })).address;
      expect(fresh).not.toBe(old);
      expect(d.creates.at(-1)!.exclude).toEqual([]);                           // the old passkey is still on the phone: it must not block the new one
      expect(d.creates.at(-1)!.name).toMatch(/^Xtrata player · [0-9A-F]{4}$/);
      expect(d.creates[0].name).toBeUndefined();                                // the old one has the plain default name
      const st = await d.h['listening.status']();
      expect(st).toMatchObject({ address: fresh, phrase: true });              // and the new one has backup words
      expect(st.passkeyName).toBe(d.creates.at(-1)!.name);
    });

    it('with two players on the device, removing one leaves the other as the device’s player', async () => {
      const d = device();
      const a = (await d.h['listening.unlock']({ mode: 'create' })).address;
      await d.h['listening.lock']();
      const b = (await d.h['listening.unlock']({ mode: 'create', another: true })).address;
      expect((await d.h['listening.forget']()).forgotten).toBe(b);
      expect(await d.h['listening.status']()).toMatchObject({ state: 'known', address: a });
    });
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
  const SLOT1 = 'SP16538G41XMAGHYB0JZAP29R7YBSKDR569QP1SMF';
  const SLOT2 = 'SP12AWQYW7NNY64RYAP6VH6M4RD11KF0RTEFDT8QP';

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

describe('quick create: a free starter player puts off the second passkey check', () => {
  const other = Uint8Array.from({ length: 32 }, (_, i) => 255 - i);

  it('starts after one use of the passkey and reports the wallet as unproven', async () => {
    const s = setup();
    await s.h['listening.unlock']({ mode: 'create', quick: true });
    expect(s.panels.map((p) => p.kind)).toEqual(['create', 'confirm-passkey']);
    expect(await s.h['listening.status']()).toMatchObject({ state: 'unlocked', address: ADDRESS, unproven: true });
  });

  it('a result that came with creation never counts alone: the passkey is still used once', async () => {
    const s = setup({ createPrf: true });
    await s.h['listening.unlock']({ mode: 'create', quick: true });
    expect(s.panels.map((p) => p.kind)).toEqual(['create', 'verify-passkey']);
    expect((await s.h['listening.status']()).unproven).toBeUndefined();
  });

  it('is ignored when a main wallet is connected, and without the flag nothing changes', async () => {
    const a = setup();
    await a.h['listening.unlock']({ mode: 'create', quick: true, main: MAIN });
    expect(a.panels.map((p) => p.kind)).toEqual(['create', 'confirm-passkey', 'verify-passkey']);
    expect((await a.h['listening.status']({ main: MAIN })).unproven).toBeUndefined();
    const b = setup();
    await b.h['listening.unlock']({ mode: 'create', quick: 'yes' as never });
    expect(b.panels.map((p) => p.kind)).toEqual(['create', 'confirm-passkey', 'verify-passkey']);
  });

  it('listening.prove runs the second check, clears the flag and then answers without a panel', async () => {
    const s = setup();
    await s.h['listening.unlock']({ mode: 'create', quick: true });
    expect(await s.h['listening.prove']()).toEqual({ proven: true });
    expect(s.panels.at(-1)).toMatchObject({ kind: 'verify-passkey', title: 'One more check' });
    expect((await s.h['listening.status']()).unproven).toBeUndefined();
    const before = s.panels.length;
    await s.h['listening.prove']();
    expect(s.panels.length).toBe(before);
  });

  it('listening.prove refuses a passkey that gives a different wallet the second time, and keeps the flag', async () => {
    const s = setup({ outputs: [PRF, other] });
    await s.h['listening.unlock']({ mode: 'create', quick: true });
    await expect(s.h['listening.prove']()).rejects.toThrow(/did not give the same player twice/);
    expect((await s.h['listening.status']()).unproven).toBe(true);
  });

  it('listening.prove needs an open wallet', async () => {
    const s = setup();
    await expect(s.h['listening.prove']()).rejects.toThrow(/Unlock/);
  });

  it('the next ordinary unlock is the second check: a match proves it, a mismatch is refused', async () => {
    const ok = setup();
    await ok.h['listening.unlock']({ mode: 'create', quick: true });
    await ok.h['listening.lock']();
    expect((await ok.h['listening.status']()).unproven).toBe(true);
    await ok.h['listening.unlock']({ mode: 'unlock' });
    expect((await ok.h['listening.status']()).unproven).toBeUndefined();

    const bad = setup({ outputs: [PRF, other] });
    await bad.h['listening.unlock']({ mode: 'create', quick: true });
    await bad.h['listening.lock']();
    await expect(bad.h['listening.unlock']({ mode: 'unlock' })).rejects.toThrow(/no longer gives the same wallet/);
    expect((await bad.h['listening.status']()).unproven).toBe(true);
  });
});

describe('players with a backup phrase, and the original players beside them', () => {
  const V1 = 'SPHRV6ESV321YCV6W990X4FKXB4S9D7F665FSCTV';         // the original player of this test passkey (derive.ts)
  const V1_SLOT1 = 'SP3ANJ3MWZKPPAEN8JAHBXA7QZ85GDHDZR47V8ZC1';
  const V1_SLOT2 = 'SP1H6JGJNMR9KJPKGSR70TDRDBGH0TZZKAH9Q2THA';
  const PHRASE = 'average unfold gather orchard afraid keep biology verb sadness merry dust worry tube inject tube method screen goose label minor minor crowd very oil';
  const KEY = 'xtrata.listening-wallet.v1';
  const v1Store = (extra: object = {}) => ({ [KEY]: JSON.stringify({ version: 1, wallets: [{ credentialId: 'cred-1', address: V1, ...extra }], last: 'cred-1' }) });
  /** Answers the "which word?" panels the way a listener who wrote the words down would (or, with `wrong`, would not). */
  const answering = (wrong = false) => {
    let words: string[] = [];
    return (p: Panel) => {
      if (p.kind === 'phrase') words = p.words!;
      if (p.kind === 'phrase-check') {
        const right = p.pick!.options.indexOf(words[Number(/word (\d+)/.exec(p.title)![1]) - 1]);
        p.pick!.chosen = wrong ? (right + 1) % p.pick!.options.length : right;
      }
    };
  };

  it('an original player is untouched: same address, same album wallets, no phrase, nothing to back up', async () => {
    const s = setup({ store: v1Store() });
    expect(await s.h['listening.status']()).toMatchObject({ state: 'known', address: V1 });
    expect((await s.h['listening.unlock']({ mode: 'unlock' })).address).toBe(V1);
    expect((await s.h['listening.slotAddress']({ slot: 1 })).address).toBe(V1_SLOT1);
    expect((await s.h['listening.slotAddress']({ slot: 2 })).address).toBe(V1_SLOT2);
    const st = await s.h['listening.status']();
    expect(st.phrase).toBeUndefined();
    expect(st.backedUp).toBeUndefined();
    await expect(s.h['listening.backup']()).rejects.toThrow(/made before backup words existed/);
    expect(JSON.parse(s.map.get(KEY)!).wallets[0].v).toBeUndefined();
  });

  it('an original passkey synced to a new device still opens the original player (with or without a user id)', async () => {
    for (const handle of [undefined, 'WE0CAAAAAAAAAAAAAAAAAA']) {
      const s = setup({ handle });
      expect((await s.h['listening.unlock']({ mode: 'unlock', anyPasskey: true })).address).toBe(V1);
      expect((await s.h['listening.status']()).phrase).toBeUndefined();
    }
  });

  it('a passkey half-made before backup phrases existed finishes as an original player', async () => {
    const s = setup({ store: { [KEY]: JSON.stringify({ version: 1, wallets: [], pending: { at: 1_760_000_000_000 - 1000, tries: 0, credentialId: 'cred-1' } }) } });
    expect((await s.h['listening.unlock']({ mode: 'create' })).address).toBe(V1);
    expect(JSON.parse(s.map.get(KEY)!).wallets[0].v).toBeUndefined();
  });

  it('a new player has a phrase, and its passkey opens the same player on a device with no record of it', async () => {
    const a = setup();
    await a.h['listening.unlock']({ mode: 'create' });
    expect(await a.h['listening.status']()).toMatchObject({ address: ADDRESS, phrase: true });
    expect(JSON.parse(a.map.get(KEY)!).wallets[0]).toMatchObject({ v: 2, address: ADDRESS });
    expect(ADDRESS).not.toBe(V1);
    // The same passkey, synced to a device with no record: only its public user id says which kind of player it is.
    const b = setup({ handle: a.handle() });
    expect((await b.h['listening.unlock']({ mode: 'unlock', anyPasskey: true })).address).toBe(ADDRESS);
    expect(await b.h['listening.status']()).toMatchObject({ address: ADDRESS, phrase: true });
    expect(JSON.parse(b.map.get(KEY)!).wallets[0]).toMatchObject({ v: 2 });
  });

  it('the backup shows the 24 words only inside the frame, asks three back, and tells the page only that it was done', async () => {
    const s = setup({ onPanel: answering() });
    await s.h['listening.unlock']({ mode: 'create' });
    const before = s.evaluations();
    const r = await s.h['listening.backup']();
    expect(r).toEqual({ backedUp: true });
    assertNoSecrets(r);
    expect(s.evaluations()).toBe(before + 1); // a fresh passkey tap before anything is shown
    const kinds = s.panels.map((p) => p.kind).slice(-5);
    expect(kinds).toEqual(['backup', 'phrase', 'phrase-check', 'phrase-check', 'phrase-check']);
    const shown = s.panels.find((p) => p.kind === 'phrase')!;
    expect(shown.words!.join(' ')).toBe(PHRASE);
    for (const p of s.panels.filter((x) => x.kind === 'phrase-check')) {
      expect(p.pick!.options).toHaveLength(4);
      expect(new Set(p.pick!.options).size).toBe(4);
    }
    // Nothing of the phrase is stored, and the status says it is done.
    const stored = [...s.map.values()].join(' ');
    for (const w of ['orchard', 'biology', 'sadness', 'goose']) expect(stored).not.toContain(w);
    expect(await s.h['listening.status']()).toMatchObject({ phrase: true, backedUp: true });
    await s.h['listening.lock']();
    expect(await s.h['listening.status']()).toMatchObject({ state: 'known', phrase: true, backedUp: true });
  });

  it('a wrong answer is asked again and records nothing; closing the box part-way records nothing', async () => {
    const wrong = setup({ onPanel: answering(true) });
    await wrong.h['listening.unlock']({ mode: 'create' });
    await expect(wrong.h['listening.backup']()).rejects.toMatchObject({ retryable: true, message: expect.stringMatching(/That is not word \d+/) });
    expect((await wrong.h['listening.status']()).backedUp).toBeUndefined();
    const closed = setup({ cancel: ['phrase'] });
    await closed.h['listening.unlock']({ mode: 'create' });
    await expect(closed.h['listening.backup']()).rejects.toBeInstanceOf(CancelledError);
    expect((await closed.h['listening.status']()).backedUp).toBeUndefined();
  });

  it('the backup needs an open player and the very passkey that opened it', async () => {
    const locked = setup();
    await expect(locked.h['listening.backup']()).rejects.toThrow(/Unlock/);
    const other = Uint8Array.from({ length: 32 }, (_, i) => 255 - i);
    const s = setup({ outputs: [PRF, PRF, other], onPanel: answering() });
    await s.h['listening.unlock']({ mode: 'create' });
    await expect(s.h['listening.backup']()).rejects.toThrow(/did not give this player/);
    expect(s.panels.some((p) => p.kind === 'phrase')).toBe(false);
  });
});

describe('the 1 STX rule, softened for a backed-up player', () => {
  const answering = () => { let words: string[] = []; return (p: Panel) => { if (p.kind === 'phrase') words = p.words!; if (p.kind === 'phrase-check') p.pick!.chosen = p.pick!.options.indexOf(words[Number(/word (\d+)/.exec(p.title)![1]) - 1]); }; };
  const OVER = '1500000';

  it('a player that is not backed up still stops paying and liking over 1 STX', async () => {
    const s = setup();
    await s.h['listening.unlock']({ mode: 'create', terms: s.terms() });
    await expect(s.h['listening.signPlay'](play(OVER))).rejects.toThrow(/more than 1 STX/);
    await expect(s.h['listening.signLike']({ song: 1, liked: true, fee: '200', nonce: '0', balance: OVER })).rejects.toThrow(/more than 1 STX/);
  });

  it('once its words are written down it keeps paying over 1 STX, within the same approved budget as before', async () => {
    const s = setup({ onPanel: answering() });
    await s.h['listening.unlock']({ mode: 'create', terms: s.terms(2) });
    await s.h['listening.backup']();
    const first = await s.h['listening.signPlay'](play(OVER));
    expect(first.txid).toMatch(/^0x[0-9a-f]{64}$/);
    s.tick(MIN_PLAY_INTERVAL_MS + 1);
    await s.h['listening.signPlay'](play(OVER, '1'));
    s.tick(MIN_PLAY_INTERVAL_MS + 1);
    // The backup changes how much it may HOLD, not how much one approval may SPEND.
    await expect(s.h['listening.signPlay'](play(OVER, '2'))).rejects.toThrow();
    await expect(s.h['listening.approveSession']({ fee: '300', maxPlays: 3000, budget: '2000000', expires: s.now() + 3600_000 })).rejects.toThrow(/at most 1 STX/);
  });
});

describe('claiming a Music Hero record', () => {
  const SIG = 'ab'.repeat(65);
  const hexOf = (b: Uint8Array) => Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
  const recordFor = (over: Partial<Parameters<typeof buildRecord>[0]> = {}) => buildRecord({ template: 9002, cls: 'gold', hero: ADDRESS, number: 412, plays: 50, name: 'jim.btc', drop: 1, ...over });
  const ask = (over: Record<string, unknown> = {}) => ({ cls: 2, number: 412, plays: 50, record: hexOf(recordFor()), signature: SIG, fee: '1500', nonce: '7', balance: '20000', ...over });
  const opened = async (opts: Parameters<typeof setup>[0] = {}) => { const s = setup(opts); await s.h['listening.unlock']({ mode: 'create' }); return s; };

  it('signs a claim to the one award contract, as the player itself, that can cost the player only its network fee', async () => {
    const s = await opened();
    const r = await s.h['listening.signAward'](ask());
    expect(r).toMatchObject({ hero: ADDRESS, number: 412, cls: 2, name: 'jim.btc', fee: '1500' });
    assertNoSecrets(r);
    const tx = deserializeTransaction(r.raw) as any;
    expect(`${addressToString(tx.payload.contractAddress)}.${tx.payload.contractName.content}`).toBe(AWARDS_CONTRACT);
    expect(tx.payload.functionName.content).toBe('claim');
    expect(tx.payload.functionArgs.map((a: any) => cvToJSON(a).value)).toEqual(['1', '2', '412', '50', '0x' + hexOf(recordFor()), '0x' + SIG]);
    expect(addressToString({ type: 0, version: 22, hash160: tx.auth.spendingCondition.signer } as any)).toBe(ADDRESS);
    expect(String(tx.auth.spendingCondition.fee)).toBe('1500');
    expect(String(tx.auth.spendingCondition.nonce)).toBe('7');
    // The claimer sends no STX at all: one post-condition, "equal to 0", on the player's own address.
    expect(tx.postConditions.values).toHaveLength(1);
    const pc = tx.postConditions.values[0];
    expect(addressToString(pc.principal.address)).toBe(ADDRESS);
    expect(String(pc.amount)).toBe('0');
    // The listener was shown, inside the box, what the record itself says.
    const panel = s.panels.at(-1)!;
    expect(panel).toMatchObject({ kind: 'award', title: 'Claim your Gold record', confirmLabel: 'Claim my record' });
    expect(panel.summary).toContain('No. 0412 · jim.btc');
    expect(panel.lines.join(' ')).toContain(`jim.btc, ${ADDRESS}, 50 paid plays`);
  });

  it('the page cannot aim a claim anywhere else, and the claim is always the player’s own, whichever album is open', async () => {
    const s = await opened();
    await s.h['listening.openSlot']({ slot: 1 });
    const r = await s.h['listening.signAward'](ask({ contract: 'SP000000000000000000002Q6VF78.evil', functionName: 'steal', drop: 99 }));
    const tx = deserializeTransaction(r.raw) as any;
    expect(`${addressToString(tx.payload.contractAddress)}.${tx.payload.contractName.content}`).toBe(AWARDS_CONTRACT);
    expect(tx.payload.functionName.content).toBe('claim');
    expect(cvToJSON(tx.payload.functionArgs[0]).value).toBe('1');
    expect(addressToString({ type: 0, version: 22, hash160: tx.auth.spendingCondition.signer } as any)).toBe(ADDRESS);
  });

  it('signs only a genuine record for this very player, matching what is being claimed', async () => {
    const s = await opened();
    const other = 'SP16538G41XMAGHYB0JZAP29R7YBSKDR569QP1SMF';
    const tampered = hexOf(new TextEncoder().encode(new TextDecoder().decode(recordFor()).replace('</iframe>', '</iframe><script>x</script>')));
    const cases: [Record<string, unknown>, RegExp][] = [
      [{ record: hexOf(recordFor({ hero: other })) }, /different player/],
      [{ record: tampered }, /not a Music Hero record/],
      [{ record: hexOf(new TextEncoder().encode('<h1>hello</h1>')) }, /not a Music Hero record/],
      [{ record: hexOf(recordFor()).replace('3d3530', '3d3939') }, /not a Music Hero record|does not match/], // p=50 → p=99 inside the bytes
      [{ cls: 1 }, /does not match/], [{ number: 413 }, /does not match/], [{ plays: 51 }, /does not match/],
      [{ record: 'zz' }, /Invalid record/], [{ record: 'ab'.repeat(1025) }, /Invalid record/],
      [{ signature: 'ab'.repeat(64) }, /not valid/], [{ signature: 5 }, /Invalid award note/],
      [{ fee: '10001' }, /fee is not allowed/], [{ fee: '0' }, /fee is not allowed/],
      [{ balance: '1000' }, /network fee/], [{ nonce: '-1' }, /Invalid nonce/]
    ];
    for (const [over, why] of cases) await expect(s.h['listening.signAward'](ask(over)), JSON.stringify(Object.keys(over))).rejects.toThrow(why);
    expect(s.panels.some((p) => p.kind === 'award')).toBe(false); // none of those was even shown
  });

  it('needs an open player and the listener’s own confirm; closing the box signs nothing', async () => {
    const locked = setup();
    await expect(locked.h['listening.signAward'](ask())).rejects.toThrow(/Unlock/);
    const s = await opened({ cancel: ['award'] });
    await expect(s.h['listening.signAward'](ask())).rejects.toBeInstanceOf(CancelledError);
  });

  it('a record with no name is shown by its address alone', async () => {
    const s = await opened();
    const r = await s.h['listening.signAward'](ask({ record: hexOf(recordFor({ name: null })) }));
    expect(r.name).toBeNull();
    expect(s.panels.at(-1)!.summary).toContain('No. 0412 · SP1SY2…KJ6N · 50 paid plays');
  });
});

describe('sending a record on', () => {
  const TO = 'SP16538G41XMAGHYB0JZAP29R7YBSKDR569QP1SMF';
  const ask = (over: Record<string, unknown> = {}) => ({ inscription: 48213, recipient: TO, fee: '1500', nonce: '9', balance: '20000', ...over });
  const opened = async (opts: Parameters<typeof setup>[0] = {}) => { const s = setup(opts); await s.h['listening.unlock']({ mode: 'create' }); return s; };

  it('signs a transfer of that one inscription on the Xtrata core, which can move nothing else', async () => {
    const s = await opened();
    await s.h['listening.openSlot']({ slot: 1 }); // an album is open: the record is still the player's own
    const r = await s.h['listening.signSendRecord'](ask());
    expect(r).toMatchObject({ from: ADDRESS, recipient: TO, inscription: 48213, fee: '1500' });
    assertNoSecrets(r);
    const tx = deserializeTransaction(r.raw) as any;
    expect(`${addressToString(tx.payload.contractAddress)}.${tx.payload.contractName.content}`).toBe('SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3');
    expect(tx.payload.functionName.content).toBe('transfer');
    expect(tx.payload.functionArgs.map((a: any) => cvToJSON(a).value)).toEqual(['48213', ADDRESS, TO]);
    expect(addressToString({ type: 0, version: 22, hash160: tx.auth.spendingCondition.signer } as any)).toBe(ADDRESS);
    expect(tx.postConditionMode).toBe(PostConditionMode.Deny);
    expect(tx.postConditions.values).toHaveLength(1);
    const pc = tx.postConditions.values[0];
    expect(addressToString(pc.principal.address)).toBe(ADDRESS);
    expect(pc.assetInfo.assetName.content).toBe('xtrata-inscription');
    expect(cvToJSON(pc.assetName).value).toBe('48213');
    const panel = s.panels.at(-1)!;
    expect(panel).toMatchObject({ kind: 'send-record', confirmLabel: 'Send it' });
    expect(panel.summary).toBeUndefined();                       // nothing folded away: the full address is in view
    expect(panel.lines[0]).toBe(`Send Xtrata inscription #48213 to this address: ${TO}`);
  });

  it('refuses a bad destination, number or fee before anything is shown, and signs nothing unless confirmed', async () => {
    const s = await opened();
    const cases: [Record<string, unknown>, RegExp][] = [
      [{ recipient: ADDRESS }, /this player itself/], [{ recipient: 'ST2294HSREF13E7W9N7ATV92WPTWH4NM9FKHGMH41' }, /mainnet/], [{ recipient: 'jim.btc' }, /mainnet/],
      [{ recipient: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.contract' }, /mainnet/], [{ inscription: -1 }, /cannot be sent/], [{ inscription: 1.5 }, /cannot be sent/],
      [{ inscription: '48213' }, /cannot be sent/], [{ fee: '10001' }, /fee is not allowed/], [{ balance: '100' }, /network fee/]
    ];
    for (const [over, why] of cases) await expect(s.h['listening.signSendRecord'](ask(over)), JSON.stringify(over)).rejects.toThrow(why);
    expect(s.panels.some((p) => p.kind === 'send-record')).toBe(false);
    const closed = await opened({ cancel: ['send-record'] });
    await expect(closed.h['listening.signSendRecord'](ask())).rejects.toBeInstanceOf(CancelledError);
    await expect(setup().h['listening.signSendRecord'](ask())).rejects.toThrow(/Unlock/);
  });
});

describe('the albums a player keeps (signShelf)', () => {
  it('signs as the player itself, with no panel, naming the player and the time itself', async () => {
    const s = setup();
    await expect(s.h['listening.signShelf']({ action: 'add', release: '0123456789abcdef' })).rejects.toThrow(/Unlock/);
    await s.h['listening.unlock']({ mode: 'create' });
    await s.h['listening.openSlot']({ slot: 1 });
    const panels = s.panels.length;
    const r = await s.h['listening.signShelf']({ action: 'add', release: '0123456789abcdef', player: 'SP16538G41XMAGHYB0JZAP29R7YBSKDR569QP1SMF', issued: 1 } as never);
    expect(r.request).toEqual({ action: 'add', release: '0123456789abcdef', player: ADDRESS, issued: s.now() });
    expect(verifyShelfSignature(r.request as never, r.signature)).toBe(true);
    expect(s.panels.length).toBe(panels);
    assertNoSecrets(r);
    const list = await s.h['listening.signShelf']({ action: 'list', release: 'ignored' });
    expect(list.request).toMatchObject({ action: 'list', release: '', player: ADDRESS });
  });
  it('refuses anything that is not one of its five actions on a real album id', async () => {
    const s = setup();
    await s.h['listening.unlock']({ mode: 'create' });
    for (const bad of [{ action: 'transfer', release: '0123456789abcdef' }, { action: 'add', release: 'x' }, { action: 'add' }, {}, undefined]) await expect(s.h['listening.signShelf'](bad as never)).rejects.toThrow();
  });
});
