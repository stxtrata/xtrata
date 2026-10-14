import { describe, expect, it } from 'vitest';
import {
  addressToString, createStacksPrivateKey, cvToJSON, deserializeTransaction, encodeStructuredData, getAddressFromPrivateKey, makeRandomPrivKey,
  privateKeyToString, signMessageHashRsv, TransactionVersion
} from '@stacks/transactions';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';
import { createPppController, type GateConfig } from '../controller';
import { CancelledError, createListeningEngine, type Panel } from '../../listening-wallet/frame/engine';
import { verifyLinkSignature } from '../../lib/listening-wallet/link';
import { verifySlotSignature } from '../../lib/listening-wallet/slots';
import { MIN_PLAY_INTERVAL_MS, TARGET } from '../../lib/listening-wallet/policy';
import { validateSaved } from '../../radio-test-wallet/chain';
import type { FunderResult, InboundTransfer } from '../../lib/listening-wallet/funder';
import type { Outgoing } from '../../lib/listening-wallet/ledger';
import type { GiftInfo } from '../controller';

const PRF = Uint8Array.from({ length: 32 }, (_, i) => i);
const LISTENING = 'SPHRV6ESV321YCV6W990X4FKXB4S9D7F665FSCTV';
const mainKey = privateKeyToString(makeRandomPrivKey()).slice(0, 64) + '01';
const MAIN = getAddressFromPrivateKey(mainKey, TransactionVersion.Mainnet);
// A second main wallet with its own key (for tests where a different wallet links).
const otherKey = privateKeyToString(makeRandomPrivKey()).slice(0, 64) + '01';
const OTHER_MAIN = getAddressFromPrivateKey(otherKey, TransactionVersion.Mainnet);
const HOLDER = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';
const rid = (n: number) => n.toString(16).padStart(32, '0');

function setup(over: Partial<GateConfig> = {}, opts: { tabLock?: boolean; hold?: string[]; onWait?: () => void; oldWallet?: boolean; noMulti?: boolean } = {}) {
  let likesChanged = 0;
  const likeBy = new Map<number, string[]>(), sent: [number, boolean][] = [], failed: number[] = [], confirmed: [number, boolean][] = [];
  let likeReadFails = false;
  let time = 1_760_000_000_000;
  let main: string | undefined = MAIN;
  const gate: GateConfig = {
    enabled: true, allowed: true, here: true, radioUrl: 'https://radio.xtrata.test/radio.html', walletOrigin: 'https://wallet.xtrata.test', canary: true,
    limits: { playFee: '300', returnFee: '3000', maxSessionPlays: 3000, sessionHours: 168 }, ...over
  };
  const server = { mains: new Map<string, string>(), mainOfFails: false, mainOfCalls: 0 };
  const chain = { balanceOf: new Map<string, bigint>(), deposits: [] as [string, bigint][], balance: 0n, nonce: 0n, confirmed: 0n, rejectNext: false, mined: new Set<string>(), broadcasts: [] as string[], owner: HOLDER, accountFails: false, funder: { ok: true, funder: null, distinct: 0 } as FunderResult, funderCalls: 0 };
  const gift = { inboundBy: new Map<string, InboundTransfer[]>(), info: null as GiftInfo | null, fails: false, calls: 0, inbound: [] as InboundTransfer[], outgoing: [] as Outgoing[], historyFails: false };
  const savedLinks: any[] = [];
  const store = new Map<string, string>();
  const requests: [string, any][] = [];
  const names = new Map<string, string>();
  let evaluations = 0;
  let created = 0;
  const prfs = new Map<string, Uint8Array>();
  const walletStore = new Map<string, string>();
  const held: { panel: Panel; tap: () => void; cancel: () => void }[] = [];
  const engine = createListeningEngine({
    // The first wallet is the fixed LISTENING address; each further one (another address's) is a different passkey and wallet.
    passkey: {
      available: () => true,
      create: async () => { const id = created === 0 ? 'c1' : `c${created + 1}`; prfs.set(id, created === 0 ? PRF.slice() : PRF.map((b) => (b + created * 5) % 256)); created++; return { credentialId: id }; },
      evaluate: async (id) => { evaluations++; const k = id ?? 'c1'; return { credentialId: k, prf: (prfs.get(k) ?? PRF).slice() }; }
    },
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
    links: async (m) => savedLinks.filter((l) => !l.main || l.main === m).map((l) => ({ listening: l.listening, issued: l.issued, mainSignature: l.mainSignature })),
    saveLink: async (body) => { savedLinks.push(body); },
    // `oldWallet`: a wallet box built before `features`, `listening.cancel` and `listening.signLike`.
    bridge: async () => ({
      request: async (m: string, p?: unknown) => {
        requests.push([m, p]);
        // `noMulti`: a wallet box from before one-listening-wallet-per-address: it ignores the connected address.
        if (opts.noMulti && (m === 'listening.status' || m === 'listening.unlock') && p) p = { ...(p as object), main: undefined };
        if (opts.oldWallet && ['listening.cancel', 'listening.signLike'].includes(m)) return new Promise(() => {});
        const r = await (engine.handlers as any)[m](p);
        if (opts.oldWallet && m === 'listening.status') { const { features: _f, ...rest } = r; return rest; }
        if (opts.noMulti && m === 'listening.status') return { ...r, features: (r.features ?? []).filter((f: string) => f !== 'multi') };
        return r;
      }
    }),
    chain: {
      verify: async () => {},
      balance: async (a) => chain.balanceOf.get(a) ?? chain.balance,
      account: async (a) => { if (chain.accountFails) throw new Error('Node busy (503)'); return { balance: chain.balanceOf.get(a) ?? chain.balance, nonce: chain.nonce }; },
      confirmedNonce: async () => chain.confirmed,
      owner: async () => chain.owner,
      broadcast: async (raw, txid) => { if (chain.rejectNext) { chain.rejectNext = false; throw Object.assign(new Error('Node rejected the fee as too low.'), { feeRejected: true }); } chain.broadcasts.push(raw); return txid; },
      transaction: async (txid) => (chain.mined.has(txid) ? { tx_status: 'success', canonical: true, is_unanchored: false, fee_rate: 300 } : null)
    },
    signWithMain: async (m, data) => signMessageHashRsv({ messageHash: bytesToHex(sha256(encodeStructuredData(data))), privateKey: createStacksPrivateKey(m === OTHER_MAIN ? otherKey : mainKey) }).data,
    deposit: async (_m, r, amount) => { chain.deposits.push([r, amount]); if (chain.balanceOf.has(r)) chain.balanceOf.set(r, chain.balanceOf.get(r)! + amount); else chain.balance += amount; return '0x' + 'd'.repeat(64); },
    validate: validateSaved,
    tabLock: async () => opts.tabLock ?? true,
    store: { get: (k) => store.get(k) ?? null, set: (k, v) => void store.set(k, v) },
    changed: () => {},
    likesChanged: () => { likesChanged++; },
    funder: async () => { chain.funderCalls++; return chain.funder; },
    mainOf: async (listening) => { server.mainOfCalls++; if (server.mainOfFails) throw new Error('503'); return server.mains.get(listening) ?? null; },
    likeState: async (_main, song) => { if (likeReadFails) throw new Error('503'); const by = likeBy.get(song) ?? []; return { liked: by.length > 0, by }; },
    likeSent: (song, liked) => { sent.push([song, liked]); },
    likeFailed: (song) => { failed.push(song); },
    likeConfirmed: (song, liked) => { confirmed.push([song, liked]); },
    wait: async (ms) => { time += ms; opts.onWait?.(); },
    nameOf: (a) => names.get(a),
    giftInfo: async () => { gift.calls++; if (gift.fails) throw new Error('503'); return gift.info; },
    history: async (w) => (gift.historyFails ? { ok: false } : { ok: true, inbound: gift.inboundBy.get(w) ?? gift.inbound, outgoing: gift.outgoing })
  });
  const mineAll = () => {
    for (const raw of chain.broadcasts) chain.mined.add('0x' + deserializeTransaction(raw).txid());
    chain.nonce = BigInt(chain.broadcasts.length);
  };
  const settle = () => new Promise((r) => setTimeout(r, 0));
  return { ppp, chain, gate, savedLinks, store, walletStore, held, settle, likesChanged: () => likesChanged, likeBy, sent, failed, confirmed, setLikeReadFails: (v: boolean) => { likeReadFails = v; }, tap: () => held.shift()!.tap(), tick: (ms: number) => { time += ms; }, setMain: (m?: string) => { main = m; }, mineAll, evaluations: () => evaluations, requests, names, engine, server, gift };
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
    expect(s.ppp.snapshot()).toMatchObject({ step: 'locked', armed: false, message: 'Not now. Nothing was signed.' });
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
    expect(s.ppp.snapshot().message).toBe('♥ Liked “Night Drive”');
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
    expect(s.ppp.snapshot().message).toBe('Unlock to like “Entertainment”. It sends straight after.');
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

  describe('with an album wallet open (the main listener wallet still signs every like)', () => {
    const signer = (raw: string) => addressToString({ type: 0, version: 22, hash160: (deserializeTransaction(raw) as any).auth.spendingCondition.signer } as any);
    const album = async (s: ReturnType<typeof setup>, albumBalance = 0n) => {
      await ready(s);
      const opened = await (s.engine.handlers as any)['listening.openSlot']({ slot: 2 });
      s.chain.balanceOf.set(opened.address, albumBalance);
      await s.ppp.forceRefresh();
      return opened.address as string;
    };

    it('signs from the first wallet and files the like under it, whatever the album wallet holds', async () => {
      const s = setup();
      const slot = await album(s);
      expect(s.ppp.snapshot()).toMatchObject({ listening: slot, likeFunds: { address: LISTENING, album: true, low: false } });
      expect(s.ppp.heart({ song: 7, title: 'Night Drive' })).toBe(true);
      await settleLike(s);
      expect(s.chain.broadcasts).toHaveLength(1);
      expect(signer(s.chain.broadcasts[0])).toBe(LISTENING);
      expect(s.sent).toEqual([[7, true]]);
      expect(s.ppp.snapshot().entries).toHaveLength(0); // the open album wallet's own list stays its own
      s.mineAll(); await s.ppp.forceRefresh();
      expect(s.likesChanged()).toBe(1);
      expect(JSON.parse(s.store.get(`xtrata.ppp.v1.entries:${LISTENING}`)!)[0]).toMatchObject({ kind: 'like', song: 7, status: 'confirmed', address: LISTENING });
      // tapped again: it unlikes from the same wallet
      s.likeBy.set(7, [LISTENING]); s.tick(5_000);
      await s.ppp.toggleLike({ song: 7 });
      expect(signer(s.chain.broadcasts[1])).toBe(LISTENING);
    });

    it('says the main listener wallet is out of funds, shows its address, and carries on after a top-up', async () => {
      const s = setup();
      await album(s);
      const DEPOSIT = '0x' + 'd'.repeat(64);
      s.chain.mined.add(DEPOSIT); // the deposit `ready` made has long confirmed
      s.chain.balanceOf.set(LISTENING, 0n);
      await s.ppp.forceRefresh();
      s.chain.mined.delete(DEPOSIT);
      expect(s.ppp.snapshot().likeFunds).toMatchObject({ address: LISTENING, album: true, low: true, balance: 0n, pending: false });
      await s.ppp.toggleLike({ song: 7 });
      expect(s.chain.broadcasts).toHaveLength(0);
      expect(s.ppp.snapshot().error).toMatch(/main listener wallet is out of funds/);
      expect(s.failed).toEqual([7]);
      await s.ppp.topUpLikes();
      expect(s.chain.deposits.at(-1)).toEqual([LISTENING, TARGET]);
      expect(s.ppp.snapshot().likeFunds).toMatchObject({ low: false, pending: true });
      await s.ppp.topUpLikes();
      expect(s.chain.deposits).toHaveLength(2); // the first is `ready`'s own deposit: no second top-up while one is confirming
      expect(s.ppp.snapshot().error).toMatch(/still confirming/);
      s.tick(5_000);
      await s.ppp.toggleLike({ song: 7 });
      expect(signer(s.chain.broadcasts[0])).toBe(LISTENING);
    });

    it('does not read an unreadable balance as empty', async () => {
      const s = setup();
      await album(s);
      expect(s.ppp.snapshot().likeFunds?.low).toBe(false);
      s.chain.accountFails = true;
      await s.ppp.toggleLike({ song: 7 });
      expect(s.ppp.snapshot().error).toMatch(/Like not sent: Node busy/);
      expect(s.ppp.snapshot().error).not.toMatch(/out of funds/);
    });
  });
});

describe('album wallets (numbered wallets of one passkey)', () => {
  const ready = async (s: ReturnType<typeof setup>) => { await s.ppp.forceRefresh(); await s.ppp.create(); await s.ppp.link(); await s.ppp.deposit(); };

  it('proves a number belongs to the passkey with both signatures, without a popup', async () => {
    const s = setup();
    await ready(s);
    const before = s.evaluations();
    const b = await s.ppp.bindAlbum(3);
    expect(s.evaluations()).toBe(before);
    expect(b).toMatchObject({ root: LISTENING, slot: 3 });
    expect(verifySlotSignature(b, b.rootSignature, LISTENING)).toBe(true);
    expect(verifySlotSignature(b, b.slotSignature, b.address)).toBe(true);
    expect(b.address).not.toBe(LISTENING);
  });

  it('opens an album wallet, tracks its arriving gift there, and reads that wallet\'s own balance and album', async () => {
    const s = setup({ gifts: { enabled: true, treasury: HOLDER, turnstileSiteKey: null, admin: false, fee: '3000' } });
    await ready(s);
    const { address } = await s.ppp.bindAlbum(2);
    s.chain.balanceOf.set(address, 0n);
    s.gift.info = { returnTo: HOLDER, from: null, source: 'campaign', amount: '100000', treasury: HOLDER, state: 'sending', player: { id: '0123456789abcdef', title: 'Proof of Sound', subtitle: 'Someone', tracks: [{ id: 11, title: 'One', artist: 'X' }], cover: null, paidOnly: true } } as any;
    await s.ppp.albumArriving(2, address, '0x' + 'a'.repeat(64), 100_000n);
    const snap = s.ppp.snapshot();
    expect(snap).toMatchObject({ listening: address, slot: 2, root: LISTENING, depositPending: true, likeFunds: { address: LISTENING, album: true } });
    expect(snap.gift?.player?.title).toBe('Proof of Sound');
    expect(JSON.parse(s.store.get(`xtrata.ppp.v1.deposit:${address}`)!)).toMatchObject({ txid: '0x' + 'a'.repeat(64), amount: '100000' });
    expect(JSON.parse(s.store.get(`xtrata.ppp.v1.deposit:${LISTENING}`) ?? 'null')).not.toMatchObject({ txid: '0x' + 'a'.repeat(64) });
    // back to the listener's own wallet
    await s.ppp.openAlbum(0);
    expect(s.ppp.snapshot()).toMatchObject({ listening: LISTENING, slot: 0 });
  });

  it('an unlock lands on the first wallet when it can play, even if an album was open before the lock', async () => {
    const s = setup();
    await ready(s);
    const { address } = await s.ppp.bindAlbum(4);
    await s.ppp.openAlbum(4);
    expect(s.ppp.snapshot().listening).toBe(address);
    s.chain.balance = 500_000n; // the first wallet has plays of its own
    await s.ppp.lock(); await s.ppp.unlock();
    expect(s.ppp.snapshot()).toMatchObject({ slot: 0 });
    expect(s.ppp.snapshot().listening).not.toBe(address);
  });

  it('an unlock lands on the last album when the first wallet cannot pay for a play yet (a new listener who was gifted an album)', async () => {
    const s = setup();
    await ready(s);
    const { address } = await s.ppp.bindAlbum(4);
    await s.ppp.openAlbum(4);
    s.chain.balance = 0n;
    await s.ppp.lock(); await s.ppp.unlock();
    expect(s.ppp.snapshot()).toMatchObject({ slot: 4, listening: address });
  });

  describe('the curated-album lock', () => {
    const GIFTER = 'SP1FVCANW8KX51C70JJAFTES86SR48CPP6F2ANQKP', FRIEND = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', TREASURY = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
    const inbound = (sender: string, amount: string, i = 1) => ({ sender, amount, txId: '0x' + String(i).repeat(64), blockHeight: i, txIndex: 0 });
    const PLAYER = { id: '0123456789abcdef', title: 'Proof of Sound', subtitle: 'Someone', tracks: [{ id: 11, title: 'One', artist: 'X' }], cover: null, paidOnly: true as const };
    const open = async () => {
      const s = setup({ gifts: { enabled: true, treasury: TREASURY, turnstileSiteKey: null, admin: false, fee: '3000' } });
      await ready(s);
      s.gift.info = { returnTo: GIFTER, from: GIFTER, source: 'friend', amount: '100000', treasury: TREASURY, state: 'arrived', player: PLAYER } as any;
      const { address } = await s.ppp.bindAlbum(2);
      await s.ppp.albumArriving(2, address, '0x' + 'a'.repeat(64), 100_000n);
      await s.ppp.forceRefresh();
      return s;
    };

    it('an album stays an album: locked whatever its wallet receives, and nothing is read to decide', async () => {
      const s = await open();
      expect(s.ppp.snapshot().albumLock).toEqual({ locked: true, known: true });
      s.gift.inbound = [inbound(FRIEND, '5000000', 1), inbound(LISTENING, '5000000', 2), inbound(GIFTER, '500000', 3)];
      s.tick(10 * 60_000); await s.ppp.forceRefresh();
      expect(s.ppp.snapshot().albumLock).toEqual({ locked: true, known: true });
      s.gift.historyFails = true;
      s.tick(10 * 60_000); await s.ppp.forceRefresh();
      expect(s.ppp.snapshot().albumLock).toEqual({ locked: true, known: true });
    });

    it('never locks the listener\'s own wallet', async () => {
      const s = await open();
      await s.ppp.openAlbum(0);
      expect(s.ppp.snapshot().albumLock).toBeNull();
    });
  });

  it('says the wallet box needs an update when it cannot hold albums', async () => {
    const s = setup({}, { oldWallet: true });
    await s.ppp.forceRefresh(); await s.ppp.create();
    expect(s.ppp.snapshot().walletCannotAlbums).toBe(true);
    await expect(s.ppp.bindAlbum(1)).rejects.toThrow(/needs an update/);
    await s.ppp.openAlbum(1);
    expect(s.ppp.snapshot().error).toMatch(/needs an update/);
  });
});

describe('heart lock and older wallet boxes', () => {
  const ready = async (s: ReturnType<typeof setup>) => { await s.ppp.forceRefresh(); await s.ppp.create(); await s.ppp.link(); await s.ppp.deposit(); };

  it('locks a song\'s heart until its last like confirms, then for 3 seconds more', async () => {
    const s = setup();
    await ready(s);
    await s.ppp.toggleLike({ song: 7, title: 'Night Drive' });
    expect(s.chain.broadcasts).toHaveLength(1);
    s.tick(5_000);
    await s.ppp.toggleLike({ song: 7, title: 'Night Drive' });
    expect(s.chain.broadcasts).toHaveLength(1); // still on its way: nothing sent
    expect(s.ppp.snapshot().error).toMatch(/Your last like for “Night Drive” is still on its way/);
    expect(s.failed).toEqual([7]);
    s.mineAll(); await s.ppp.forceRefresh(); // confirms now
    s.likeBy.set(7, [LISTENING]);
    await s.ppp.toggleLike({ song: 7, title: 'Night Drive' });
    expect(s.chain.broadcasts).toHaveLength(1);
    expect(s.ppp.snapshot().error).toMatch(/has only just confirmed/);
    s.tick(3_000);
    await s.ppp.toggleLike({ song: 7, title: 'Night Drive' });
    expect(s.chain.broadcasts).toHaveLength(2); // the unlike goes through after the cool-down
  });

  it('a like on another song is not blocked by this song\'s lock, only queued behind its transaction', async () => {
    let mine = () => {};
    const s = setup({}, { onWait: () => mine() });
    await ready(s);
    await s.ppp.toggleLike({ song: 1 });
    mine = () => s.mineAll();
    s.tick(5_000);
    await s.ppp.toggleLike({ song: 2 });
    expect(s.chain.broadcasts).toHaveLength(2);
  });

  it('an older wallet box: the heart falls back to the main-wallet page and the panel says why', async () => {
    const s = setup({}, { oldWallet: true });
    await ready(s);
    expect(s.ppp.snapshot()).toMatchObject({ step: 'ready', walletOutdated: true });
    expect(s.ppp.heart({ song: 7 })).toBe(false);
    expect(s.chain.broadcasts).toHaveLength(0);
    const fresh = setup();
    await ready(fresh);
    expect(fresh.ppp.snapshot().walletOutdated).toBe(false);
  });
});

describe('passkey-only listening (no Stacks wallet)', () => {
  const solo = (opts: Parameters<typeof setup>[1] = {}) => {
    const s = setup({ passkeyOnly: true }, opts);
    s.setMain(undefined);
    return s;
  };
  /** Created and funded from outside (a friend or an exchange sent STX to the address). */
  const funded = async (s: ReturnType<typeof setup>, amount = TARGET) => { await s.ppp.forceRefresh(); await s.ppp.create(); s.chain.balance = amount; await s.ppp.forceRefresh(); };
  const lastRecipient = (s: ReturnType<typeof setup>) => {
    const tx = deserializeTransaction(s.chain.broadcasts.at(-1)!) as any;
    return { to: cvToJSON(tx.payload.recipient).value as string, amount: String(tx.payload.amount) };
  };

  it('walks from nothing to paid plays with no wallet connected and no link', async () => {
    const s = solo();
    await s.ppp.forceRefresh();
    expect(s.ppp.snapshot()).toMatchObject({ step: 'intro', solo: true });
    await s.ppp.create();
    expect(s.ppp.snapshot()).toMatchObject({ step: 'fund', listening: LISTENING, solo: true, error: '' });
    s.chain.balance = TARGET;
    await s.ppp.forceRefresh();
    expect(s.ppp.snapshot()).toMatchObject({ step: 'ready', payingOn: true });
    await s.ppp.onListened({ song: 7, id: rid(2), title: 'Night Drive' });
    expect(s.chain.broadcasts).toHaveLength(1);
    expect(s.savedLinks).toHaveLength(0);
  });

  it('a gift is tracked like a deposit: on its way, then paying starts once it lands', async () => {
    const s = solo();
    await s.ppp.forceRefresh(); await s.ppp.create();
    const gift = '0x' + 'c'.repeat(64);
    s.ppp.giftSent(gift, 250_000n);
    expect(s.ppp.snapshot()).toMatchObject({ step: 'fund', depositPending: true, depositTxid: gift });
    expect(s.ppp.snapshot().message).toMatch(/Gift on its way/);
    s.ppp.giftSent('0x' + 'd'.repeat(64), 250_000n); // a second gift for the same wallet is ignored
    expect(s.ppp.snapshot().depositTxid).toBe(gift);
    s.chain.mined.add(gift); s.chain.balance = 250_000n;
    await s.ppp.forceRefresh();
    expect(s.ppp.snapshot()).toMatchObject({ step: 'ready', depositPending: false, payingOn: true });
    expect(s.ppp.snapshot().message).not.toMatch(/on its way/); // gone once it has landed
  });

  it('an empty wallet that never sent anything counts as brand-new even when made elsewhere; one that was used does not', async () => {
    const s = solo();
    await s.ppp.forceRefresh(); await s.ppp.create();
    for (const k of [...s.store.keys()]) if (k.includes('created')) s.store.delete(k); // e.g. made in another tab, then this page reloaded
    s.chain.confirmed = 0n;
    await s.ppp.forceRefresh();
    expect(s.ppp.snapshot()).toMatchObject({ createdHere: false, brandNew: true });
    const used = solo();
    await used.ppp.forceRefresh(); await used.ppp.create();
    for (const k of [...used.store.keys()]) if (k.includes('created')) used.store.delete(k);
    used.chain.confirmed = 3n; // it has sent transactions (e.g. returned a gift)
    await used.ppp.forceRefresh();
    expect(used.ppp.snapshot()).toMatchObject({ createdHere: false, brandNew: false });
  });

  it('only a wallet created in this browser counts as made here (a gift link claims into nothing else)', async () => {
    const s = solo();
    await s.ppp.forceRefresh(); await s.ppp.create();
    expect(s.ppp.snapshot().createdHere).toBe(true);
    // the same wallet reached after the site data was cleared (its passkey still syncs): not made here
    for (const k of [...s.store.keys()]) if (k.includes('created')) s.store.delete(k);
    await s.ppp.forceRefresh();
    expect(s.ppp.snapshot()).toMatchObject({ listening: LISTENING, createdHere: false });
  });

  it('a wallet linked elsewhere (passkey synced to a new device) says whose it is, without changing where returns go', async () => {
    const s = solo();
    s.chain.funder = { ok: true, funder: HOLDER, distinct: 1 };
    s.server.mains.set(LISTENING, MAIN);
    await funded(s);
    expect(s.ppp.snapshot()).toMatchObject({ solo: true, creditedTo: MAIN, returnTo: HOLDER, returnToKind: 'funder' });
    const calls = s.server.mainOfCalls;
    await s.ppp.forceRefresh();
    expect(s.server.mainOfCalls).toBe(calls); // asked once per wallet
  });

  it('a failed lookup of whose wallet it is shows nothing and is tried again a minute later', async () => {
    const s = solo();
    s.server.mainOfFails = true;
    await funded(s);
    expect(s.ppp.snapshot().creditedTo).toBeUndefined();
    s.server.mainOfFails = false; s.server.mains.set(LISTENING, MAIN);
    await s.ppp.forceRefresh();
    expect(s.ppp.snapshot().creditedTo).toBeUndefined(); // too soon
    s.tick(61_000);
    await s.ppp.forceRefresh();
    expect(s.ppp.snapshot().creditedTo).toBe(MAIN);
  });

  it('with a Stacks wallet connected the link comes from that wallet, not from this lookup', async () => {
    const s = setup({ passkeyOnly: true });
    s.server.mains.set(LISTENING, MAIN);
    await s.ppp.forceRefresh(); await s.ppp.create();
    expect(s.ppp.snapshot()).toMatchObject({ solo: false });
    expect(s.ppp.snapshot().creditedTo).toBeUndefined();
    expect(s.server.mainOfCalls).toBe(0);
  });

  it('stays off by default: without the flag a visitor with no wallet is asked to connect', async () => {
    const s = setup();
    s.setMain(undefined);
    await s.ppp.forceRefresh();
    expect(s.ppp.snapshot()).toMatchObject({ step: 'connect', solo: false });
    await s.ppp.create().catch(() => {});
    expect(s.ppp.snapshot().listening).toBeUndefined();
  });

  it('a connected, invited main wallet keeps the linked flow even when passkey-only is on', async () => {
    const s = setup({ passkeyOnly: true });
    await s.ppp.forceRefresh(); await s.ppp.create();
    expect(s.ppp.snapshot()).toMatchObject({ step: 'link', solo: false });
  });

  it('a main wallet that is not invited can still listen as passkey-only', async () => {
    const s = setup({ passkeyOnly: true, allowed: false });
    await s.ppp.forceRefresh();
    expect(s.ppp.snapshot()).toMatchObject({ step: 'intro', solo: true });
  });

  it('returns go to the first meaningful funder, and the wallet shows that address for confirmation', async () => {
    const s = solo({ hold: ['return'] });
    s.chain.funder = { ok: true, funder: MAIN, txId: '0x1', amount: '1000000', distinct: 1 };
    await funded(s);
    expect(s.ppp.snapshot()).toMatchObject({ returnTo: MAIN, returnToKind: 'funder', funderState: 'found', funderMultiple: false });
    const pending = s.ppp.returnFunds('all');
    await s.settle();
    expect(s.held[0].panel.kind).toBe('return');
    expect(s.held[0].panel.lines.join(' ')).toContain(MAIN); // the full address, not a short form
    s.tap();
    await pending;
    expect(s.chain.broadcasts).toHaveLength(1);
    expect(lastRecipient(s)).toEqual({ to: MAIN, amount: (TARGET - 3_000n).toString() });
    expect(s.ppp.snapshot()).toMatchObject({ payingOn: false });
  });

  it('a failed funder lookup is "could not check", never "no funder", and nothing is sent', async () => {
    const s = solo();
    s.chain.funder = { ok: false };
    await funded(s);
    expect(s.ppp.snapshot()).toMatchObject({ funderState: 'failed', returnTo: undefined });
    await s.ppp.returnFunds('all');
    expect(s.ppp.snapshot().error).toMatch(/Choose where to send/);
    expect(s.chain.broadcasts).toHaveLength(0);
    // retried after a minute, and used once it works
    s.chain.funder = { ok: true, funder: MAIN, distinct: 1 };
    s.tick(61_000);
    await s.ppp.forceRefresh();
    expect(s.ppp.snapshot()).toMatchObject({ funderState: 'found', returnTo: MAIN });
  });

  it('backs off a failing funder lookup instead of retrying every minute', async () => {
    const s = solo();
    s.chain.funder = { ok: false };
    await funded(s);
    const calls = () => s.chain.funderCalls;
    expect(calls()).toBe(1);
    s.tick(61_000); await s.ppp.forceRefresh(); expect(calls()).toBe(2);
    s.tick(61_000); await s.ppp.forceRefresh(); expect(calls()).toBe(2); // second failure: waits 2 minutes
    s.tick(61_000); await s.ppp.forceRefresh(); expect(calls()).toBe(3);
  });

  it('a connected invited wallet is never passkey-only, even before its own gate has been read', async () => {
    const s = setup({ passkeyOnly: true });
    await s.ppp.forceRefresh();
    s.setMain(HOLDER); // a different wallet connects; the gate on hand was fetched for the old one
    expect(s.ppp.snapshot().solo).toBe(false);
    await s.ppp.forceRefresh();
    expect(s.ppp.snapshot().solo).toBe(false);
  });

  it('an unfunded wallet with no qualifying sender has no return target (dust never counts)', async () => {
    const s = solo();
    s.chain.funder = { ok: true, funder: null, distinct: 0 };
    await funded(s);
    expect(s.ppp.snapshot()).toMatchObject({ funderState: 'none', returnTo: undefined });
  });

  it('does not hammer the chain: a found funder is looked up once', async () => {
    const s = solo();
    s.chain.funder = { ok: true, funder: MAIN, distinct: 1 };
    await funded(s);
    await s.ppp.forceRefresh(); await s.ppp.forceRefresh();
    expect(s.chain.funderCalls).toBe(1);
  });

  it('an address the listener chooses beats the funder; bad or self addresses are refused', async () => {
    const s = solo();
    s.chain.funder = { ok: true, funder: MAIN, distinct: 2 };
    await funded(s);
    expect(s.ppp.snapshot().funderMultiple).toBe(true);
    s.ppp.setReturnAddress('not-an-address');
    expect(s.ppp.snapshot().error).toMatch(/standard mainnet address/);
    s.ppp.setReturnAddress(LISTENING);
    expect(s.ppp.snapshot().error).toMatch(/itself/);
    s.ppp.setReturnAddress('SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.some-contract'); // contracts are not plain addresses
    expect(s.ppp.snapshot().error).toMatch(/standard mainnet address/);
    s.ppp.setReturnAddress(HOLDER);
    expect(s.ppp.snapshot()).toMatchObject({ returnTo: HOLDER, returnToKind: 'chosen' });
    await s.ppp.returnFunds('all');
    expect(lastRecipient(s).to).toBe(HOLDER);
    s.ppp.clearReturnAddress();
    expect(s.ppp.snapshot()).toMatchObject({ returnTo: MAIN, returnToKind: 'funder' });
  });

  it('a listening wallet linked to a main wallet is never passkey-only: without that wallet it asks to connect', async () => {
    const s = setup({ passkeyOnly: true });
    await s.ppp.forceRefresh(); await s.ppp.create(); await s.ppp.link(); await s.ppp.deposit();
    expect(s.ppp.snapshot()).toMatchObject({ step: 'ready', solo: false, payingOn: true });
    s.setMain(undefined); // the same browser later, wallet not connected
    s.chain.funder = { ok: true, funder: HOLDER, distinct: 1 };
    await s.ppp.forceRefresh();
    expect(s.ppp.snapshot()).toMatchObject({ step: 'connect', solo: false, linked: MAIN, returnTo: MAIN, returnToKind: 'linked' });
    expect(s.chain.funderCalls).toBe(0); // no funder guessing for a wallet that already has an owner
    // it stops paying, and cannot be used, liked from, returned from or created over until the wallet is back
    await s.ppp.onListened({ song: 7, id: rid(2) });
    expect(s.chain.broadcasts).toHaveLength(0);
    await s.ppp.returnFunds('all');
    await s.ppp.toggleLike({ song: 7 });
    expect(s.chain.broadcasts).toHaveLength(0);
    s.setMain(MAIN);
    await s.ppp.forceRefresh();
    expect(s.ppp.snapshot()).toMatchObject({ step: 'ready', solo: false });
  });

  it('a wallet linked to another main wallet is not offered passkey-only either', async () => {
    const s = setup({ passkeyOnly: true });
    await s.ppp.forceRefresh(); await s.ppp.create(); await s.ppp.link();
    s.setMain(HOLDER); // a different wallet connects (not invited: the fake gate allows any connected main, so link step)
    await s.ppp.forceRefresh();
    expect(s.ppp.snapshot().solo).toBe(false);
  });

  it('excess above 1 STX can be returned to the funder', async () => {
    const s = solo();
    s.chain.funder = { ok: true, funder: MAIN, distinct: 1 };
    await funded(s, TARGET + 500_000n);
    expect(s.ppp.snapshot().step).toBe('over');
    await s.ppp.returnFunds('excess');
    expect(lastRecipient(s)).toEqual({ to: MAIN, amount: '497000' });
  });

  it('likes are signed from the listening address and need no link', async () => {
    const s = solo();
    await funded(s);
    await s.ppp.toggleLike({ song: 7, title: 'Night Drive' });
    expect(s.chain.broadcasts).toHaveLength(1);
    expect(s.sent).toEqual([[7, true]]);
    expect(s.ppp.snapshot().entries[0]).toMatchObject({ kind: 'like', address: LISTENING, liked: true });
  });

  it('a song liked from another wallet is not toggled from here', async () => {
    const s = solo();
    await funded(s);
    s.likeBy.set(4, [MAIN]);
    await s.ppp.toggleLike({ song: 4, title: 'Smalltalk' });
    expect(s.chain.broadcasts).toHaveLength(0);
    expect(s.ppp.snapshot().error).toMatch(/another wallet of yours/);
  });

  it('an older wallet box still pays, but will not return to another address or like, and says so', async () => {
    const s = solo({ oldWallet: true });
    s.chain.funder = { ok: true, funder: MAIN, distinct: 1 };
    await funded(s);
    expect(s.ppp.snapshot()).toMatchObject({ step: 'ready', walletCannotSolo: true });
    await s.ppp.returnFunds('all');
    expect(s.ppp.snapshot().error).toMatch(/needs an update/);
    expect(s.chain.broadcasts).toHaveLength(0);
    await s.ppp.toggleLike({ song: 1 });
    expect(s.chain.broadcasts).toHaveLength(0);
    await s.ppp.onListened({ song: 7, id: rid(2) });
    expect(s.chain.broadcasts).toHaveLength(1);
  });
});

describe('plays heard while the wallet is busy are queued, not lost', () => {
  const ready = async (s: ReturnType<typeof setup>) => { await s.ppp.forceRefresh(); await s.ppp.create(); await s.ppp.link(); await s.ppp.deposit(); };
  const flush = async (s: ReturnType<typeof setup>) => { for (let i = 0; i < 20; i++) await s.settle(); };
  const plays = (s: ReturnType<typeof setup>) => s.ppp.snapshot().entries.filter((e) => e.kind === 'play');

  it('a song that crosses 30 seconds while a like is being signed is paid once the like confirms', async () => {
    const s = setup();
    await ready(s);
    const like = s.ppp.toggleLike({ song: 3, title: 'A like' }); // starts: the wallet is now busy with it
    await s.ppp.onListened({ song: 7, id: rid(2), title: 'Night Drive' });
    expect(s.ppp.snapshot().queued).toBe(1);
    expect(s.chain.broadcasts).toHaveLength(0);
    await like; await flush(s);
    expect(s.chain.broadcasts).toHaveLength(1); // the like; the play waits for its nonce
    expect(s.ppp.snapshot().queued).toBe(1);
    s.mineAll(); s.tick(MIN_PLAY_INTERVAL_MS);
    await s.ppp.forceRefresh(); await flush(s);
    expect(plays(s)).toHaveLength(1);
    expect(plays(s)[0]).toMatchObject({ song: 7, id: rid(2), title: 'Night Drive', status: 'pending', recipient: HOLDER });
    expect((deserializeTransaction(s.chain.broadcasts[1]) as any).auth.spendingCondition.nonce).toBe(1n);
    expect(s.ppp.snapshot().queued).toBe(0);
  });

  it('songs heard while an earlier payment confirms are paid one at a time, oldest first', async () => {
    const s = setup();
    await ready(s);
    await s.ppp.onListened({ song: 7, id: rid(2) });
    s.tick(MIN_PLAY_INTERVAL_MS);
    await s.ppp.onListened({ song: 8, id: rid(3) });
    s.tick(MIN_PLAY_INTERVAL_MS);
    await s.ppp.onListened({ song: 9, id: rid(4) });
    expect(s.chain.broadcasts).toHaveLength(1);
    expect(s.ppp.snapshot().queued).toBe(2);
    s.mineAll(); s.tick(MIN_PLAY_INTERVAL_MS); await s.ppp.forceRefresh(); await flush(s);
    expect(s.chain.broadcasts).toHaveLength(2);
    expect(s.ppp.snapshot().queued).toBe(1);
    s.mineAll(); s.tick(MIN_PLAY_INTERVAL_MS); await s.ppp.forceRefresh(); await flush(s);
    expect(s.chain.broadcasts).toHaveLength(3);
    expect(plays(s).map((e) => e.song).sort()).toEqual([7, 8, 9]);
    expect(s.ppp.snapshot().queued).toBe(0);
  });

  it('the same listen is never paid twice, and a backlog is capped', async () => {
    const s = setup();
    await ready(s);
    await s.ppp.onListened({ song: 7, id: rid(2) });
    await s.ppp.onListened({ song: 7, id: rid(2) });
    expect(s.ppp.snapshot().queued).toBe(0);
    for (let i = 0; i < 14; i++) await s.ppp.onListened({ song: 100 + i, id: rid(50 + i) });
    expect(s.ppp.snapshot().queued).toBe(10);
    expect(plays(s)).toHaveLength(1);
  });

  it('a listen that waited more than 30 minutes plays free instead of paying late', async () => {
    const s = setup();
    await ready(s);
    await s.ppp.onListened({ song: 7, id: rid(2) });
    await s.ppp.onListened({ song: 8, id: rid(3) });
    expect(s.ppp.snapshot().queued).toBe(1);
    s.mineAll(); s.tick(31 * 60_000);
    await s.ppp.forceRefresh(); await flush(s);
    expect(s.ppp.snapshot().queued).toBe(0);
    expect(plays(s)).toHaveLength(1);
  });

  it('switching paying off or locking forgets queued songs', async () => {
    const s = setup();
    await ready(s);
    await s.ppp.onListened({ song: 7, id: rid(2) });
    await s.ppp.onListened({ song: 8, id: rid(3) });
    expect(s.ppp.snapshot().queued).toBe(1);
    await s.ppp.switchOff();
    expect(s.ppp.snapshot().queued).toBe(0);
    s.mineAll(); s.tick(MIN_PLAY_INTERVAL_MS); await s.ppp.forceRefresh(); await flush(s);
    expect(plays(s)).toHaveLength(1);
  });
});

describe('likes while paying', () => {
  const ready = async (s: ReturnType<typeof setup>) => { await s.ppp.forceRefresh(); await s.ppp.create(); await s.ppp.link(); await s.ppp.deposit(); };
  const flush = async (s: ReturnType<typeof setup>) => { for (let i = 0; i < 20; i++) await s.settle(); };

  it('tells the radio the moment its own like confirms, so the heart does not wait for the likes list', async () => {
    const s = setup();
    await ready(s);
    await s.ppp.toggleLike({ song: 3, title: 'Heart' });
    expect(s.sent).toEqual([[3, true]]);
    expect(s.confirmed).toEqual([]);
    s.mineAll();
    await s.ppp.forceRefresh();
    expect(s.confirmed).toEqual([[3, true]]);
    await s.ppp.forceRefresh();
    expect(s.confirmed).toHaveLength(1); // once only
  });

  it('a like tapped while a payment confirms goes ahead of songs heard after it', async () => {
    let waits = 0, queuedWhileWaiting = -1;
    const holder: { s?: ReturnType<typeof setup> } = {};
    const s = holder.s = setup({}, {
      onWait: () => {
        waits++;
        if (waits === 1) { void s.ppp.onListened({ song: 8, id: rid(3) }); queuedWhileWaiting = s.ppp.snapshot().queued; } // heard while the like waits
        else s.mineAll();                                                                                                   // then the payment confirms
      }
    });
    await ready(s);
    await s.ppp.onListened({ song: 7, id: rid(2) });  // payment pending
    await s.ppp.toggleLike({ song: 3 });               // waits for it to confirm, then sends
    expect(queuedWhileWaiting).toBe(1);
    expect(s.sent).toEqual([[3, true]]);
    await flush(s);
    const order = () => s.ppp.snapshot().entries.map((e) => e.kind + ':' + e.song).reverse();
    expect(order()).toEqual(['play:7', 'like:3']);   // song 8 did not jump the like
    s.mineAll(); s.tick(MIN_PLAY_INTERVAL_MS); await s.ppp.forceRefresh(); await flush(s);
    expect(order()).toEqual(['play:7', 'like:3', 'play:8']);
  });

  it('the next tap follows our own confirmed like even if the likes list still lags', async () => {
    const s = setup();
    await ready(s);
    await s.ppp.toggleLike({ song: 3 });
    s.mineAll(); await s.ppp.forceRefresh();
    s.tick(5_000);
    await s.ppp.toggleLike({ song: 3 }); // the list (likeBy) still says nothing: must be an UNLIKE, not a repeat like
    expect(s.sent).toEqual([[3, true], [3, false]]);
  });
});


describe('one listening wallet per wallet address', () => {
  const OTHER = OTHER_MAIN;
  const linkedAndPaying = async (s: ReturnType<typeof setup>) => { await s.ppp.forceRefresh(); await s.ppp.create(); await s.ppp.link(); await s.ppp.deposit(); };
  const calls = (s: ReturnType<typeof setup>, m: string) => s.requests.filter(([name]) => name === m);

  it('another address on the same device gets its own listening wallet, and the first keeps its own', async () => {
    const s = setup({ passkeyOnly: true });
    await linkedAndPaying(s);
    const first = s.ppp.snapshot().listening!;
    expect(s.ppp.snapshot()).toMatchObject({ step: 'ready', linked: MAIN });
    const funds = s.chain.balance;
    s.chain.balance = 0n; // (the fake chain has one balance: the new wallet starts empty)
    s.setMain(OTHER);
    await s.ppp.forceRefresh();
    // nothing of the first address's is offered, used or unlocked for this one
    expect(s.ppp.snapshot()).toMatchObject({ step: 'intro', linked: undefined, listening: undefined, main: OTHER });
    await s.ppp.onListened({ song: 7, id: rid(5) });
    expect(s.chain.broadcasts).toHaveLength(0);
    // a new listening wallet for this address: created with it named, then linked to it
    await s.ppp.create();
    expect(calls(s, 'listening.unlock').at(-1)![1]).toMatchObject({ mode: 'create', main: OTHER });
    expect(s.ppp.snapshot().listening).not.toBe(first);
    expect(s.ppp.snapshot().step).toBe('link');
    await s.ppp.link();
    expect(s.ppp.snapshot()).toMatchObject({ step: 'fund', linked: OTHER });
    // back to the first address: its wallet and its link, untouched
    s.chain.balance = funds;
    s.setMain(MAIN);
    await s.ppp.forceRefresh();
    expect(s.ppp.snapshot()).toMatchObject({ linked: MAIN, listening: first });
    expect(['locked', 'ready', 'fund']).toContain(s.ppp.snapshot().step);
  });

  it('switching address while a wallet is open locks it, drops what it was waiting to pay, and pays nothing for the other address', async () => {
    const s = setup({ passkeyOnly: true });
    await linkedAndPaying(s);
    expect(s.ppp.snapshot().step).toBe('ready');
    s.setMain(OTHER);
    await s.ppp.forceRefresh();
    expect(s.ppp.snapshot()).toMatchObject({ step: 'intro', queued: 0 });
    expect((await (s.engine.handlers as any)['listening.status']()).state).toBe('known'); // the first wallet is locked
    await s.ppp.onListened({ song: 7, id: rid(3) });
    await s.ppp.toggleLike({ song: 7 });
    expect(s.chain.broadcasts).toHaveLength(0);
  });

  it('tells a new address that this device already has a listening wallet for another, and lists it', async () => {
    const s = setup({ passkeyOnly: true });
    await linkedAndPaying(s);
    s.setMain(OTHER);
    await s.ppp.forceRefresh();
    expect(s.ppp.snapshot()).toMatchObject({ step: 'intro', others: [MAIN] });
    // an address that already has its own wallet is not asked anything: it just unlocks
    s.setMain(MAIN);
    await s.ppp.forceRefresh();
    expect(s.ppp.snapshot().others).toEqual([]);
    expect(['locked', 'ready', 'fund']).toContain(s.ppp.snapshot().step);
  });

  it('with no wallet connected, lists the wallets this device has listening wallets for', async () => {
    const s = setup({ passkeyOnly: true });
    await linkedAndPaying(s);
    s.setMain(OTHER);
    await s.ppp.forceRefresh();
    await s.ppp.create();
    await s.ppp.link();
    s.setMain(undefined);
    await s.ppp.forceRefresh();
    const snap = s.ppp.snapshot();
    expect(snap.step).toBe('connect');
    expect([snap.linked, ...snap.others].sort()).toEqual([MAIN, OTHER].sort());
  });

  it('asks the box about the connected address on every call, and says nothing about one when none is connected', async () => {
    const s = setup({ passkeyOnly: true });
    await linkedAndPaying(s);
    expect(calls(s, 'listening.status').every(([, p]) => (p as any)?.main === MAIN)).toBe(true);
    const t = setup({ passkeyOnly: true });
    t.setMain(undefined);
    await t.ppp.forceRefresh();
    expect(calls(t, 'listening.status').every(([, p]) => p === undefined)).toBe(true);
  });

  it('passes the main wallet name to the wallet box when unlocking, and nothing for a passkey-only wallet', async () => {
    const s = setup({ passkeyOnly: true });
    await linkedAndPaying(s);
    s.names.set(MAIN, 'jim.btc');
    await s.ppp.lock();
    await s.ppp.unlock();
    expect(calls(s, 'listening.unlock').at(-1)![1]).toMatchObject({ label: 'jim.btc', main: MAIN });
    const t = setup({ passkeyOnly: true });
    t.setMain(undefined);
    await t.ppp.forceRefresh(); await t.ppp.create();
    await t.ppp.lock();
    await t.ppp.unlock();
    expect(calls(t, 'listening.unlock').at(-1)![1]).not.toHaveProperty('label');
    expect(calls(t, 'listening.unlock').at(-1)![1]).not.toHaveProperty('main');
  });

  it('a passkey-only wallet stays singular: with no wallet connected there is one, and creating another is not offered', async () => {
    const s = setup({ passkeyOnly: true });
    s.setMain(undefined);
    await s.ppp.forceRefresh();
    expect(s.ppp.snapshot()).toMatchObject({ step: 'intro', solo: true });
    await s.ppp.create();
    await s.ppp.lock();
    await s.ppp.forceRefresh();
    expect(s.ppp.snapshot().step).toBe('locked'); // intro (and a second wallet) is only for a state of none
  });

  describe('with a wallet box from before this (it ignores the connected address)', () => {
    it('stays locked with a reason: no unlock, pay, like, link, deposit or return through the other address\'s wallet', async () => {
      const s = setup({ passkeyOnly: true }, { noMulti: true, hold: ['unlock'] });
      await linkedAndPaying(s);
      await s.ppp.lock();
      await s.ppp.forceRefresh();
      expect(s.ppp.snapshot()).toMatchObject({ step: 'locked', walletCannotMulti: true });
      s.setMain(OTHER);
      await s.ppp.forceRefresh();
      await s.settle(); // a waiting unlock panel is withdrawn
      expect(s.ppp.snapshot()).toMatchObject({ step: 'wrong-wallet', main: OTHER, linked: MAIN, solo: false, armed: false });
      expect(s.held).toHaveLength(0);
      const before = s.requests.length;
      await s.ppp.unlock();
      await s.ppp.link();
      await s.ppp.deposit();
      await s.ppp.switchOn();
      await s.ppp.returnFunds('all');
      await s.ppp.toggleLike({ song: 7 });
      await s.ppp.onListened({ song: 7, id: rid(9) });
      expect(s.requests.slice(before).filter(([m]) => m !== 'listening.status')).toEqual([]);
      expect(s.chain.broadcasts).toHaveLength(0);
      expect(s.ppp.snapshot().error).toMatch(/belongs to another wallet/);
      expect(s.ppp.heart({ song: 7 })).toBe(false);
    });

    it('an unlocked wallet is locked again, and connecting its own wallet unlocks as normal', async () => {
      const s = setup({ passkeyOnly: true }, { noMulti: true });
      await linkedAndPaying(s);
      s.setMain(OTHER);
      await s.ppp.forceRefresh();
      expect(s.ppp.snapshot()).toMatchObject({ step: 'wrong-wallet', queued: 0 });
      expect(calls(s, 'listening.lock').length).toBeGreaterThan(0);
      await s.ppp.onListened({ song: 7, id: rid(3) });
      expect(s.chain.broadcasts).toHaveLength(0);
      s.setMain(MAIN);
      await s.ppp.forceRefresh();
      expect(s.ppp.snapshot().step).not.toBe('wrong-wallet');
    });
  });
});

describe('gifted wallets and gift players', () => {
  const TREASURY = 'SP1RKMSSGS3TCZW6HXFYXAM0DGHS2VNKSBTB4G183';
  const GIFTER = 'SP1FVCANW8KX51C70JJAFTES86SR48CPP6F2ANQKP';
  const DEPOSITOR = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
  const PLAYER = { id: '0123456789abcdef', title: 'Proof of Sound', subtitle: 'Someone', tracks: [{ id: 11, title: 'One', artist: 'X' }], cover: null, paidOnly: true as const };
  const INFO: GiftInfo = { returnTo: GIFTER, from: GIFTER, source: 'friend', amount: '300000', treasury: TREASURY, state: 'arrived', player: PLAYER };
  const inb = (sender: string, amount: bigint, blockHeight: number): InboundTransfer => ({ sender, amount: String(amount), txId: `0xin${blockHeight}`, blockHeight, txIndex: 0 });
  const out = (recipient: string, amount: bigint, blockHeight: number): Outgoing => ({ recipient, amount, txId: `0xout${blockHeight}`, blockHeight, txIndex: 0 });
  const gifted = async (balance: bigint, info: GiftInfo | null = INFO, opts: Parameters<typeof setup>[1] = {}) => {
    const s = setup({ passkeyOnly: true, gifts: { enabled: true, treasury: TREASURY, turnstileSiteKey: null, admin: false, fee: '3000' } }, opts);
    s.setMain(undefined);
    s.gift.info = info;
    await s.ppp.forceRefresh(); await s.ppp.create();
    s.chain.balance = balance;
    await s.ppp.forceRefresh();
    return s;
  };
  const lastSent = (s: Awaited<ReturnType<typeof gifted>>) => {
    const tx = deserializeTransaction(s.chain.broadcasts.at(-1)!) as any;
    return { to: cvToJSON(tx.payload.recipient).value as string, amount: String(tx.payload.amount) };
  };

  it('knows the album and counts plays in plays: what the balance buys after the reserve', async () => {
    const s = await gifted(100_000n);
    expect(s.ppp.snapshot()).toMatchObject({ step: 'ready', giftPlays: 277, giftStop: null, gift: { player: { title: 'Proof of Sound' } } });
  });

  it('a wallet that was not gifted has no album, but a passkey wallet has no free mode either: empty means stopped', async () => {
    const s = await gifted(0n, null);
    expect(s.ppp.snapshot()).toMatchObject({ gift: null, giftStop: { reason: 'out', text: 'EMPTY — ADD STX TO PLAY' } });
    s.chain.balance = 500_000n;
    await s.ppp.forceRefresh();
    expect(s.ppp.snapshot().giftStop).toBeNull();
  });

  it('a gift without an album is the same: paid-only, never stopped while it has plays', async () => {
    const s = await gifted(0n, { ...INFO, player: null });
    expect(s.ppp.snapshot().giftStop).toMatchObject({ reason: 'out' });
    s.chain.balance = 500_000n;
    await s.ppp.forceRefresh();
    expect(s.ppp.snapshot().giftStop).toBeNull();
  });

  it('stops the moment there is no play left to pay for, and says so', async () => {
    const s = await gifted(3_349n); // reserve 3,000 + 349: not one whole play
    expect(s.ppp.snapshot()).toMatchObject({ step: 'fund', giftPlays: 0, giftStop: { reason: 'out' } });
  });

  it('a top-up on its way reads as arriving, not as out of plays', async () => {
    const s = await gifted(0n);
    s.ppp.giftSent('0x' + 'e'.repeat(64), 250_000n);
    expect(s.ppp.snapshot().giftStop).toMatchObject({ reason: 'arriving' });
  });

  it('a payment on its way is already spent: the last play stops the radio before it confirms', async () => {
    const s = await gifted(3_000n + 350n); // exactly one play
    expect(s.ppp.snapshot()).toMatchObject({ giftPlays: 1, giftStop: null });
    await s.ppp.onListened({ song: 7, id: rid(2) });
    expect(s.chain.broadcasts).toHaveLength(1);
    expect(s.ppp.snapshot()).toMatchObject({ giftPlays: 0, giftStop: { reason: 'out' } });
  });

  it('locked, switched off and over 1 STX each have their own reason; none is free listening', async () => {
    const s = await gifted(100_000n);
    await s.ppp.switchOff();
    expect(s.ppp.snapshot().giftStop).toMatchObject({ reason: 'off' });
    const over = await gifted(TARGET + 1n);
    expect(over.ppp.snapshot().giftStop).toMatchObject({ reason: 'over' });
    const locked = await gifted(100_000n);
    await locked.ppp.lock();
    expect(locked.ppp.snapshot().giftStop).toMatchObject({ reason: 'locked' });
  });

  it('an unreachable server or a slow balance read never stops the music or forgets the album', async () => {
    const s = await gifted(100_000n);
    s.gift.fails = true;
    s.tick(31 * 60_000);
    await s.ppp.forceRefresh();
    expect(s.ppp.snapshot()).toMatchObject({ gift: { player: { title: 'Proof of Sound' } }, giftStop: null });
  });

  it('a payment that cannot be made right now stays queued and counts against the plays (no free song)', async () => {
    const s = await gifted(100_000n);
    const before = s.ppp.snapshot().giftPlays;
    s.chain.accountFails = true;
    await s.ppp.onListened({ song: 7, id: rid(3) });
    expect(s.chain.broadcasts).toHaveLength(0);
    expect(s.ppp.snapshot()).toMatchObject({ queued: 1, giftPlays: before - 1 });
    s.chain.accountFails = false;
    await s.ppp.forceRefresh();
    await s.settle();
    expect(s.chain.broadcasts).toHaveLength(1);
    expect(s.ppp.snapshot().queued).toBe(0);
  });

  describe('returns follow the money', () => {
    it('shows the split first, then returns a top-up to the depositor and the unused gift to the gifter, one part at a time', async () => {
      const s = await gifted(500_000n);
      s.gift.inbound = [inb(TREASURY, 300_000n, 10), inb(DEPOSITOR, 200_000n, 20)];
      await s.ppp.returnFunds('all');
      expect(s.chain.broadcasts).toHaveLength(0); // nothing is sent until the listener has seen where it goes
      const plan = s.ppp.snapshot().returnPlan;
      expect(plan).toMatchObject({ state: 'ready', steps: [{ to: DEPOSITOR, kind: 'deposit', send: '197000' }, { to: GIFTER, kind: 'gift', send: '297000' }] });

      await s.ppp.returnFunds('all');
      expect(lastSent(s)).toEqual({ to: DEPOSITOR, amount: '197000' });
      expect(s.ppp.snapshot().payingOn).toBe(true); // more to return
      expect(s.ppp.snapshot().message).toMatch(/1 more part/);

      s.mineAll();
      s.chain.balance = 300_000n;
      s.gift.outgoing = [out(DEPOSITOR, 197_000n, 30)];
      await s.ppp.forceRefresh();
      await s.ppp.returnFunds('all');
      await s.ppp.returnFunds('all');
      expect(lastSent(s)).toEqual({ to: GIFTER, amount: '297000' });
      expect(s.ppp.snapshot().payingOn).toBe(false);
    });

    it('the same balance with no top-up goes entirely back to the gifter, in one part', async () => {
      const s = await gifted(120_000n);
      s.gift.inbound = [inb(TREASURY, 300_000n, 10)];
      s.gift.outgoing = [];
      // 180,000 of the gift was spent on plays and fees
      await s.ppp.returnFunds('all');
      await s.ppp.returnFunds('all');
      expect(lastSent(s)).toEqual({ to: GIFTER, amount: '117000' });
      expect(s.ppp.snapshot().payingOn).toBe(false);
    });

    it('does not send when the chain cannot be read completely: could not check, nothing sent', async () => {
      const s = await gifted(120_000n);
      s.gift.historyFails = true;
      await s.ppp.returnFunds('all');
      expect(s.ppp.snapshot().error).toMatch(/Could not check where the funds came from/);
      expect(s.ppp.snapshot().returnPlan).toEqual({ state: 'unavailable' });
      expect(s.chain.broadcasts).toHaveLength(0);
    });

    it('a history that does not add up is also "could not check"', async () => {
      const s = await gifted(500_000n);
      s.gift.inbound = [inb(TREASURY, 100_000n, 10)]; // balance is more than anything that was ever deposited
      await s.ppp.returnFunds('all');
      expect(s.ppp.snapshot().error).toMatch(/Could not check/);
      expect(s.chain.broadcasts).toHaveLength(0);
    });

    it('a preview goes stale when the balance changes, so a different split is never confirmed blind', async () => {
      const s = await gifted(500_000n);
      s.gift.inbound = [inb(TREASURY, 300_000n, 10), inb(DEPOSITOR, 200_000n, 20)];
      await s.ppp.returnFunds('all');
      expect(s.ppp.snapshot().returnPlan.state).toBe('ready');
      s.chain.balance = 450_000n; // a play went through meanwhile
      await s.ppp.forceRefresh();
      expect(s.ppp.snapshot().returnPlan).toEqual({ state: 'none' });
    });

    it('excess above 1 STX goes to whoever sent the newest deposit', async () => {
      const s = await gifted(TARGET + 500_000n);
      s.gift.inbound = [inb(TREASURY, 300_000n, 10), inb(DEPOSITOR, 1_200_000n, 20)];
      await s.ppp.returnFunds('excess');
      expect(lastSent(s)).toEqual({ to: DEPOSITOR, amount: '497000' });
    });

    it('a gifted wallet linked to a main wallet returns everything to that wallet, as before', async () => {
      const s = setup({ gifts: { enabled: true, treasury: TREASURY, turnstileSiteKey: null, admin: false, fee: '3000' } });
      s.gift.info = INFO;
      await s.ppp.forceRefresh(); await s.ppp.create(); await s.ppp.link();
      s.chain.balance = 500_000n;
      s.gift.inbound = [inb(TREASURY, 300_000n, 10), inb(DEPOSITOR, 200_000n, 20)];
      await s.ppp.forceRefresh();
      await s.ppp.returnFunds('all');
      expect(lastSent(s as any)).toEqual({ to: MAIN, amount: '497000' });
    });
  });
});
