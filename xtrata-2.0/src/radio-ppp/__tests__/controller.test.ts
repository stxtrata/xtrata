import { describe, expect, it } from 'vitest';
import {
  createStacksPrivateKey, cvToJSON, deserializeTransaction, encodeStructuredData, getAddressFromPrivateKey, makeRandomPrivKey,
  privateKeyToString, signMessageHashRsv, TransactionVersion
} from '@stacks/transactions';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';
import { createPppController, type GateConfig } from '../controller';
import { CancelledError, createListeningEngine, type Panel } from '../../listening-wallet/frame/engine';
import { verifyLinkSignature } from '../../lib/listening-wallet/link';
import { MIN_PLAY_INTERVAL_MS, TARGET } from '../../lib/listening-wallet/policy';
import { validateSaved } from '../../radio-test-wallet/chain';

const PRF = Uint8Array.from({ length: 32 }, (_, i) => i);
const LISTENING = 'SPHRV6ESV321YCV6W990X4FKXB4S9D7F665FSCTV';
const mainKey = privateKeyToString(makeRandomPrivKey()).slice(0, 64) + '01';
const MAIN = getAddressFromPrivateKey(mainKey, TransactionVersion.Mainnet);
const HOLDER = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';
const rid = (n: number) => n.toString(16).padStart(32, '0');

function setup(over: Partial<GateConfig> = {}, opts: { tabLock?: boolean; hold?: string[]; onWait?: () => void } = {}) {
  let likesChanged = 0;
  const likeBy = new Map<number, string[]>(), sent: [number, boolean][] = [], failed: number[] = [];
  let likeReadFails = false;
  let time = 1_760_000_000_000;
  let main: string | undefined = MAIN;
  const gate: GateConfig = {
    enabled: true, allowed: true, here: true, radioUrl: 'https://radio.xtrata.test/radio.html', walletOrigin: 'https://wallet.xtrata.test', canary: true,
    limits: { playFee: '300', returnFee: '3000', maxSessionPlays: 3000, sessionHours: 168 }, ...over
  };
  const chain = { balance: 0n, nonce: 0n, confirmed: 0n, rejectNext: false, mined: new Set<string>(), broadcasts: [] as string[], owner: HOLDER };
  const savedLinks: any[] = [];
  const store = new Map<string, string>();
  let evaluations = 0;
  const walletStore = new Map<string, string>();
  const held: { panel: Panel; tap: () => void; cancel: () => void }[] = [];
  const engine = createListeningEngine({
    passkey: { available: () => true, create: async () => ({ credentialId: 'c1' }), evaluate: async () => { evaluations++; return { credentialId: 'c1', prf: PRF.slice() }; } },
    ui: {
      // Panels of the held kinds wait for the listener's tap, like the real frame; others confirm at once.
      act: (panel, action) => (opts.hold?.includes(panel.kind)
        ? new Promise((resolve, reject) => held.push({ panel, tap: () => action().then(resolve, reject), cancel: () => reject(new CancelledError()) }))
        : action()),
      cancel: () => { const h = held.shift(); if (!h) return false; h.cancel(); return true; },
      idle: () => {}
    },
    store: { get: (k) => walletStore.get(k) ?? null, set: (k, v) => void walletStore.set(k, v) },
    now: () => time
  });
  const ppp = createPppController({
    now: () => time,
    main: () => main,
    config: async () => ({ ...gate, allowed: gate.allowed && !!main }),
    links: async () => savedLinks.map((l) => ({ listening: l.listening, issued: l.issued, mainSignature: l.mainSignature })),
    saveLink: async (body) => { savedLinks.push(body); },
    bridge: async () => ({ request: (m: string, p?: unknown) => (engine.handlers as any)[m](p) }),
    chain: {
      verify: async () => {},
      balance: async () => chain.balance,
      account: async () => ({ balance: chain.balance, nonce: chain.nonce }),
      confirmedNonce: async () => chain.confirmed,
      owner: async () => chain.owner,
      broadcast: async (raw, txid) => { if (chain.rejectNext) { chain.rejectNext = false; throw Object.assign(new Error('Node rejected the fee as too low.'), { feeRejected: true }); } chain.broadcasts.push(raw); return txid; },
      transaction: async (txid) => (chain.mined.has(txid) ? { tx_status: 'success', canonical: true, is_unanchored: false, fee_rate: 300 } : null)
    },
    signWithMain: async (_m, data) => signMessageHashRsv({ messageHash: bytesToHex(sha256(encodeStructuredData(data))), privateKey: createStacksPrivateKey(mainKey) }).data,
    deposit: async (_m, _r, amount) => { chain.balance += amount; return '0x' + 'd'.repeat(64); },
    validate: validateSaved,
    tabLock: async () => opts.tabLock ?? true,
    store: { get: (k) => store.get(k) ?? null, set: (k, v) => void store.set(k, v) },
    changed: () => {},
    likesChanged: () => { likesChanged++; },
    likeState: async (_main, song) => { if (likeReadFails) throw new Error('503'); const by = likeBy.get(song) ?? []; return { liked: by.length > 0, by }; },
    likeSent: (song, liked) => { sent.push([song, liked]); },
    likeFailed: (song) => { failed.push(song); },
    wait: async (ms) => { time += ms; opts.onWait?.(); }
  });
  const mineAll = () => {
    for (const raw of chain.broadcasts) chain.mined.add('0x' + deserializeTransaction(raw).txid());
    chain.nonce = BigInt(chain.broadcasts.length);
  };
  const settle = () => new Promise((r) => setTimeout(r, 0));
  return { ppp, chain, gate, savedLinks, store, walletStore, held, settle, likesChanged: () => likesChanged, likeBy, sent, failed, setLikeReadFails: (v: boolean) => { likeReadFails = v; }, tap: () => held.shift()!.tap(), tick: (ms: number) => { time += ms; }, setMain: (m?: string) => { main = m; }, mineAll, evaluations: () => evaluations };
}

describe('radio pay-per-play walk-through (real wallet engine, mocked chain)', () => {
  it('turns on once and then pays for every new song, with no extra step after the first', async () => {
    const s = setup();
    await s.ppp.forceRefresh();
    expect(s.ppp.snapshot().step).toBe('intro');

    await s.ppp.create();
    expect(s.ppp.snapshot()).toMatchObject({ step: 'link', listening: LISTENING, error: '' });

    await s.ppp.link();
    const link = s.savedLinks[0];
    expect(verifyLinkSignature(link, link.mainSignature, MAIN)).toBe(true);
    expect(verifyLinkSignature(link, link.listeningSignature, LISTENING)).toBe(true);
    expect(s.ppp.snapshot()).toMatchObject({ step: 'fund', linked: MAIN, allowance: TARGET });

    await s.ppp.deposit();
    expect(s.ppp.snapshot()).toMatchObject({ step: 'ready', balance: TARGET, allowance: 0n, payingOn: true });
    expect(s.ppp.snapshot().session!.playsLeft).toBeGreaterThan(100); // approved when the wallet was created

    await s.ppp.onListened({ song: 7, id: rid(2), title: 'Night Drive', artist: 'Audionals' });
    expect(s.chain.broadcasts).toHaveLength(1);
    expect(s.ppp.snapshot().entries[0]).toMatchObject({ kind: 'play', song: 7, status: 'pending', recipient: HOLDER, amount: '50', fee: '300', title: 'Night Drive', artist: 'Audionals' });
    expect(s.ppp.snapshot().message).toMatch(/“Night Drive” by Audionals/);

    s.tick(MIN_PLAY_INTERVAL_MS);
    await s.ppp.onListened({ song: 8, id: rid(3) });
    expect(s.chain.broadcasts).toHaveLength(1); // one unresolved payment at a time

    s.mineAll();
    s.tick(MIN_PLAY_INTERVAL_MS);
    await s.ppp.onListened({ song: 9, id: rid(4) }); // confirmed now, so the next song pays straight away
    expect(s.chain.broadcasts).toHaveLength(2);
    const tx = deserializeTransaction(s.chain.broadcasts[1]) as any;
    expect(tx.auth.spendingCondition.nonce).toBe(1n);
    expect(s.ppp.snapshot().entries.find((e) => e.song === 7)).toMatchObject({ status: 'confirmed' });
  });

  it('stays switched off once switched off, including across a lock and unlock, until switched on again', async () => {
    const s = setup();
    await s.ppp.forceRefresh(); await s.ppp.create(); await s.ppp.link(); await s.ppp.deposit();
    await s.ppp.switchOff();
    expect(s.ppp.snapshot()).toMatchObject({ step: 'ready', payingOn: false, session: null });
    await s.ppp.onListened({ song: 1, id: rid(1) });
    expect(s.chain.broadcasts).toHaveLength(0);
    await s.ppp.lock(); await s.ppp.unlock();
    expect(s.ppp.snapshot()).toMatchObject({ payingOn: false, session: null });
    await s.ppp.switchOn();
    expect(s.ppp.snapshot()).toMatchObject({ payingOn: true });
    await s.ppp.onListened({ song: 1, id: rid(2) });
    expect(s.chain.broadcasts).toHaveLength(1);
  });

  it('resumes paying after a lock with one unlock, and pays nothing while out of funds', async () => {
    const s = setup();
    await s.ppp.forceRefresh(); await s.ppp.create(); await s.ppp.link(); await s.ppp.deposit();
    await s.ppp.lock(); await s.ppp.unlock();
    expect(s.ppp.snapshot()).toMatchObject({ step: 'ready', payingOn: true });
    s.chain.balance = 1_000n;
    await s.ppp.forceRefresh();
    expect(s.ppp.snapshot().step).toBe('fund');
    await s.ppp.onListened({ song: 3, id: rid(5) });
    expect(s.chain.broadcasts).toHaveLength(0);
    s.chain.balance = TARGET;
    await s.ppp.forceRefresh();
    await s.ppp.onListened({ song: 3, id: rid(6) });
    expect(s.chain.broadcasts).toHaveLength(1); // carries on after the top-up, no extra step
  });

  it('pauses above 1 STX and returns the excess only to the linked main wallet', async () => {
    const s = setup();
    await s.ppp.forceRefresh(); await s.ppp.create(); await s.ppp.link();
    s.chain.balance = 1_500_000n;
    await s.ppp.forceRefresh();
    expect(s.ppp.snapshot().step).toBe('over');
    await s.ppp.returnFunds('excess');
    const tx = deserializeTransaction(s.chain.broadcasts[0]) as any;
    expect(cvToJSON(tx.payload.recipient).value).toBe(MAIN);
    expect(tx.payload.amount).toBe(497_000n);
    expect(s.ppp.snapshot().entries[0]).toMatchObject({ kind: 'withdraw', status: 'pending', recipient: MAIN });
  });

  it('keeps music free on any payment problem: own song, other tab, kill switch, not invited, no wallet', async () => {
    const s = setup();
    await s.ppp.forceRefresh(); await s.ppp.create(); await s.ppp.link(); await s.ppp.deposit();
    s.chain.owner = LISTENING;
    await s.ppp.onListened({ song: 1, id: rid(1) });
    expect(s.chain.broadcasts).toHaveLength(0);

    s.gate.enabled = false;
    await s.ppp.forceRefresh();
    expect(s.ppp.snapshot().step).toBe('off');
    s.chain.owner = HOLDER;
    await s.ppp.onListened({ song: 2, id: rid(2) });
    expect(s.chain.broadcasts).toHaveLength(0);

    const t = setup({ allowed: false });
    await t.ppp.forceRefresh();
    expect(t.ppp.snapshot().step).toBe('not-invited');
    t.setMain(undefined);
    await t.ppp.forceRefresh();
    expect(t.ppp.snapshot().step).toBe('connect');

    const u = setup({}, { tabLock: false });
    await u.ppp.forceRefresh(); await u.ppp.create();
    expect(u.ppp.snapshot().error).toMatch(/another tab/);
    await u.ppp.link(); await u.ppp.deposit();
    await u.ppp.onListened({ song: 2, id: rid(9) });
    expect(u.chain.broadcasts).toHaveLength(0);
  });

  it('restores the link on a new device from the server record without another wallet popup', async () => {
    const s = setup({}, { hold: ['unlock'] });
    await s.ppp.forceRefresh(); await s.ppp.create(); await s.ppp.link();
    await s.ppp.lock(); await s.settle();
    expect(s.ppp.snapshot()).toMatchObject({ step: 'locked', armed: true });
    s.tap(); await s.ppp.unlock();
    expect(s.ppp.snapshot()).toMatchObject({ linked: MAIN, step: 'fund' });
    // A second device: the passkey synced, but the frame has no local records.
    await s.ppp.lock(); await s.settle();
    s.walletStore.clear();
    await s.ppp.forceRefresh(); await s.settle();
    expect(s.ppp.snapshot()).toMatchObject({ step: 'intro', armed: false }); // nothing to unlock here: the panel was withdrawn
    const unlocking = s.ppp.unlock(true);
    await s.settle(); s.tap(); await unlocking;
    s.tick(61_000); await s.ppp.forceRefresh();
    // The server link is found, but the frame still asks the listener to confirm it (no wallet popup).
    expect(s.ppp.snapshot()).toMatchObject({ listening: LISTENING, step: 'link', serverLinked: true });
    await s.ppp.link();
    expect(s.ppp.snapshot()).toMatchObject({ linked: MAIN, step: 'fund' });
    expect(s.evaluations()).toBeGreaterThanOrEqual(5); // new-device unlock re-proved PRF stability
    expect(s.savedLinks).toHaveLength(1);
  });

  it('catches up on confirmations at the next song even when the tab was in the background', async () => {
    const s = setup();
    await s.ppp.forceRefresh(); await s.ppp.create(); await s.ppp.link(); await s.ppp.deposit();
    await s.ppp.onListened({ song: 1, id: rid(1) });
    s.mineAll();
    s.tick(MIN_PLAY_INTERVAL_MS);
    await s.ppp.onListened({ song: 2, id: rid(2) }); // no explicit refresh in between
    s.mineAll();
    s.tick(MIN_PLAY_INTERVAL_MS);
    await s.ppp.onListened({ song: 3, id: rid(3) });
    expect(s.chain.broadcasts).toHaveLength(3);
  });

  it('marks a payment the node refused as failed instead of blocking every later song', async () => {
    const s = setup();
    await s.ppp.forceRefresh(); await s.ppp.create(); await s.ppp.link(); await s.ppp.deposit();
    s.chain.rejectNext = true;
    await s.ppp.onListened({ song: 1, id: rid(1) });
    expect(s.ppp.snapshot().entries[0]).toMatchObject({ status: 'failed' });
    s.tick(MIN_PLAY_INTERVAL_MS);
    await s.ppp.onListened({ song: 2, id: rid(2) });
    expect(s.chain.broadcasts).toHaveLength(1);
  });

  it('offers no second deposit while one is confirming, so the wallet is not over-funded', async () => {
    const s = setup();
    await s.ppp.forceRefresh(); await s.ppp.create(); await s.ppp.link();
    s.chain.balance = 0n;
    const depositOnce = s.chain.balance;
    await s.ppp.deposit();
    s.chain.balance = depositOnce; // still unconfirmed on-chain
    await s.ppp.forceRefresh();
    expect(s.ppp.snapshot()).toMatchObject({ depositPending: true, allowance: 0n });
    await s.ppp.deposit();
    expect(s.ppp.snapshot().error).toMatch(/still confirming/);
  });

  it('plays free when the listener\'s own main wallet holds the song', async () => {
    const s = setup();
    await s.ppp.forceRefresh(); await s.ppp.create(); await s.ppp.link(); await s.ppp.deposit();
    s.chain.owner = MAIN;
    await s.ppp.onListened({ song: 1, id: rid(1) });
    expect(s.chain.broadcasts).toHaveLength(0);
  });

  it('only points to the dedicated radio host anywhere else, and never loads the wallet there', async () => {
    const s = setup({ here: false, walletOrigin: null });
    await s.ppp.forceRefresh();
    expect(s.ppp.snapshot()).toMatchObject({ step: 'elsewhere' });
    expect(s.ppp.snapshot().gate?.radioUrl).toBe('https://radio.xtrata.test/radio.html');
    await s.ppp.onListened({ song: 1, id: rid(1) });
    expect(s.chain.broadcasts).toHaveLength(0);
  });
});

describe('one-tap unlock', () => {
  const lockedAndFunded = async (s: ReturnType<typeof setup>) => {
    // Set up with panels confirming at once, then make unlock panels wait for a tap from here on.
    await s.ppp.forceRefresh(); await s.ppp.create(); await s.ppp.link(); await s.ppp.deposit();
  };

  it('opens the unlock confirm in the frame on load, so the first tap goes straight to the passkey', async () => {
    const s = setup({}, { hold: ['unlock'] });
    await lockedAndFunded(s);
    await s.ppp.lock();
    await s.settle();
    expect(s.ppp.snapshot()).toMatchObject({ step: 'locked', armed: true, busy: null });
    expect(s.held).toHaveLength(1);
    expect(s.held[0].panel).toMatchObject({ kind: 'unlock', confirmLabel: 'Unlock and keep paying' });
    expect(s.held[0].panel.lines.join(' ')).toMatch(/30 seconds/); // the paying terms are on that same panel
    const before = s.evaluations();
    s.tap(); // the listener's one tap inside the frame
    await s.ppp.unlock(); // a page "Unlock" while armed just waits for that same panel
    expect(s.evaluations()).toBe(before + 1); // the tap went straight to one passkey use
    expect(s.ppp.snapshot()).toMatchObject({ step: 'ready', armed: false, payingOn: true });
    await s.ppp.onListened({ song: 1, id: rid(1) });
    expect(s.chain.broadcasts).toHaveLength(1); // the first paid play went out
  });

  it('cancelling in the frame stops re-opening it until the listener asks again', async () => {
    const s = setup({}, { hold: ['unlock'] });
    await lockedAndFunded(s);
    await s.ppp.lock(); await s.settle();
    s.held[0].cancel(); s.held.shift();
    await s.settle();
    await s.ppp.forceRefresh(); await s.settle();
    expect(s.ppp.snapshot()).toMatchObject({ step: 'locked', armed: false, message: 'Cancelled. Nothing was signed.' });
    expect(s.held).toHaveLength(0);
    const unlocking = s.ppp.unlock(); // the page button asks again
    await s.settle();
    expect(s.held).toHaveLength(1);
    s.tap(); await unlocking;
    expect(s.ppp.snapshot().step).toBe('ready');
  });

  it('"Use a different listening wallet" withdraws the waiting panel and asks for any passkey', async () => {
    const s = setup({}, { hold: ['unlock'] });
    await lockedAndFunded(s);
    await s.ppp.lock(); await s.settle();
    expect(s.held).toHaveLength(1);
    const different = s.ppp.unlock(true);
    await s.settle();
    expect(s.held).toHaveLength(1); // the old panel went, a fresh any-passkey panel is waiting
    expect(s.held[0].panel.lines[0]).toMatch(/Use your listening-wallet passkey/);
    s.tap(); await different;
    expect(s.ppp.snapshot()).toMatchObject({ step: 'ready', message: expect.stringMatching(/^Unlocked/) });
  });

  it('withdraws the panel when the main wallet disconnects, and arms without terms when paying is switched off', async () => {
    const s = setup({}, { hold: ['unlock'] });
    await lockedAndFunded(s);
    await s.ppp.lock(); await s.settle();
    expect(s.ppp.snapshot().armed).toBe(true);
    s.setMain(undefined);
    await s.ppp.forceRefresh(); await s.settle();
    expect(s.ppp.snapshot()).toMatchObject({ step: 'connect', armed: false });
    expect(s.held).toHaveLength(0);

    const t = setup({}, { hold: ['unlock'] });
    await lockedAndFunded(t);
    await t.ppp.switchOff(); await t.ppp.lock(); await t.settle();
    // switched off: still one tap to the passkey, without paying terms
    expect(t.ppp.snapshot()).toMatchObject({ step: 'locked', armed: true, payingOn: false });
    expect(t.held[0].panel).toMatchObject({ kind: 'unlock', confirmLabel: 'Unlock with passkey' });
  });
});

describe('likes from the listening wallet, credited to the main wallet', () => {
  const ready = async (s: ReturnType<typeof setup>) => { await s.ppp.forceRefresh(); await s.ppp.create(); await s.ppp.link(); await s.ppp.deposit(); };
  const settleLike = async (s: ReturnType<typeof setup>) => { for (let i = 0; i < 20; i++) await s.settle(); };

  it('takes every heart tap once a listening wallet exists here, and toggles on the likes contract for 0.0002 STX', async () => {
    const s = setup();
    await s.ppp.forceRefresh();
    expect(s.ppp.heart({ song: 7 })).toBe(false); // no listening wallet yet: the main-wallet page handles it
    await ready(s);
    expect(s.ppp.heart({ song: 7, title: 'Night Drive' })).toBe(true);
    await settleLike(s);
    expect(s.chain.broadcasts).toHaveLength(1);
    const tx = deserializeTransaction(s.chain.broadcasts[0]) as any;
    expect(tx.payload.functionName.content).toBe('set-liked');
    expect(tx.auth.spendingCondition.fee).toBe(200n);
    expect(cvToJSON(tx.payload.functionArgs[1]).value).toBe(true);
    expect(s.sent).toEqual([[7, true]]);
    expect(s.ppp.snapshot().message).toBe('Liked “Night Drive” from your listening wallet, for your main wallet (0.0002 STX).');
    s.mineAll(); await s.ppp.forceRefresh();
    expect(s.likesChanged()).toBe(1);
    // tapped again once the chain shows it liked by this listening wallet: it unlikes
    s.likeBy.set(7, [LISTENING]);
    s.tick(5_000);
    await s.ppp.toggleLike({ song: 7 });
    expect(cvToJSON((deserializeTransaction(s.chain.broadcasts[1]) as any).payload.functionArgs[1]).value).toBe(false);
    expect(s.sent.at(-1)).toEqual([7, false]);
  });

  it('reads the current state at tap time, falling back to what the radio knows', async () => {
    const s = setup();
    await ready(s);
    s.setLikeReadFails(true);
    await s.ppp.toggleLike({ song: 3 });
    expect(s.ppp.snapshot().error).toMatch(/Could not check song #3/);
    expect(s.failed).toEqual([3]);
    await s.ppp.toggleLike({ song: 3, likedBy: [LISTENING] });
    expect(cvToJSON((deserializeTransaction(s.chain.broadcasts[0]) as any).payload.functionArgs[1]).value).toBe(false);
  });

  it('leaves a like made from the main wallet to the main wallet, and says so', async () => {
    const s = setup();
    await ready(s);
    s.likeBy.set(4, [MAIN]);
    await s.ppp.toggleLike({ song: 4, title: 'Smalltalk' });
    expect(s.chain.broadcasts).toHaveLength(0);
    expect(s.ppp.snapshot().error).toMatch(/“Smalltalk” was liked from your main wallet\. Unlike it there/);
  });

  it('explains what is missing instead of opening the main-wallet page', async () => {
    const s = setup();
    await s.ppp.forceRefresh(); await s.ppp.create();
    expect(s.ppp.heart({ song: 1 })).toBe(true);
    await settleLike(s);
    expect(s.ppp.snapshot().error).toMatch(/Link the listening wallet/);
    await s.ppp.link();
    await s.ppp.toggleLike({ song: 1 });
    expect(s.ppp.snapshot().error).toMatch(/Top up the listening wallet to like: each like or unlike costs 0\.0002 STX/);
    await s.ppp.deposit();
    await s.ppp.switchOff();
    await s.ppp.toggleLike({ song: 1 });
    expect(s.ppp.snapshot().error).toMatch(/Paying is switched off/);
    expect(s.chain.broadcasts).toHaveLength(0);
  });

  it('a heart tap while locked is sent right after the one-tap unlock', async () => {
    const s = setup({}, { hold: ['unlock'] });
    await ready(s);
    await s.ppp.lock(); await s.settle();
    expect(s.ppp.heart({ song: 9, title: 'Entertainment' })).toBe(true);
    await settleLike(s);
    expect(s.ppp.snapshot().message).toMatch(/^Unlock to like “Entertainment”: tap “Unlock and keep paying”/);
    s.tap(); await s.ppp.unlock();
    await settleLike(s); await settleLike(s);
    expect(s.chain.broadcasts).toHaveLength(1);
    expect(s.sent).toEqual([[9, true]]);
  });

  it('waits for an earlier payment to confirm before signing (one transaction in flight), and gives up after 2 minutes', async () => {
    let mine = () => {};
    const s = setup({}, { onWait: () => mine() });
    await ready(s);
    await s.ppp.onListened({ song: 1, id: rid(1) });
    expect(s.chain.broadcasts).toHaveLength(1);
    await s.ppp.toggleLike({ song: 2 });
    expect(s.chain.broadcasts).toHaveLength(1);
    expect(s.ppp.snapshot().error).toMatch(/still confirming/);
    expect(s.failed).toEqual([2]);
    mine = () => s.mineAll();
    await s.ppp.toggleLike({ song: 2 });
    expect(s.chain.broadcasts).toHaveLength(2);
    expect(s.ppp.snapshot().entries[0]).toMatchObject({ kind: 'like', song: 2, status: 'pending', fee: '200' });
  });

  it('a song played while a like is being sent plays free rather than racing it for the nonce', async () => {
    const s = setup();
    await ready(s);
    const liking = s.ppp.toggleLike({ song: 2 });
    await s.ppp.onListened({ song: 1, id: rid(1) });
    await liking;
    expect(s.ppp.snapshot().entries.filter((e) => e.kind === 'play')).toHaveLength(0);
    expect(s.chain.broadcasts).toHaveLength(1);
  });
});
