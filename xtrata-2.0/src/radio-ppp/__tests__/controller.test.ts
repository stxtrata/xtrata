import { describe, expect, it } from 'vitest';
import {
  createStacksPrivateKey, cvToJSON, deserializeTransaction, encodeStructuredData, getAddressFromPrivateKey, makeRandomPrivKey,
  privateKeyToString, signMessageHashRsv, TransactionVersion
} from '@stacks/transactions';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';
import { createPppController, type GateConfig } from '../controller';
import { createListeningEngine } from '../../listening-wallet/frame/engine';
import { verifyLinkSignature } from '../../lib/listening-wallet/link';
import { MIN_PLAY_INTERVAL_MS, TARGET } from '../../lib/listening-wallet/policy';
import { validateSaved } from '../../radio-test-wallet/chain';

const PRF = Uint8Array.from({ length: 32 }, (_, i) => i);
const LISTENING = 'SPHRV6ESV321YCV6W990X4FKXB4S9D7F665FSCTV';
const mainKey = privateKeyToString(makeRandomPrivKey()).slice(0, 64) + '01';
const MAIN = getAddressFromPrivateKey(mainKey, TransactionVersion.Mainnet);
const HOLDER = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';
const rid = (n: number) => n.toString(16).padStart(32, '0');

function setup(over: Partial<GateConfig> = {}, opts: { tabLock?: boolean } = {}) {
  let time = 1_760_000_000_000;
  let main: string | undefined = MAIN;
  const gate: GateConfig = {
    enabled: true, allowed: true, walletOrigin: 'https://wallet.xtrata.test', canary: true,
    limits: { playFee: '300', returnFee: '3000', firstSessionPlays: 1, maxSessionPlays: 3000, sessionHours: 4 }, ...over
  };
  const chain = { balance: 0n, nonce: 0n, confirmed: 0n, rejectNext: false, mined: new Set<string>(), broadcasts: [] as string[], owner: HOLDER };
  const savedLinks: any[] = [];
  const store = new Map<string, string>();
  let evaluations = 0;
  const walletStore = new Map<string, string>();
  const engine = createListeningEngine({
    passkey: { available: () => true, create: async () => ({ credentialId: 'c1' }), evaluate: async () => { evaluations++; return { credentialId: 'c1', prf: PRF.slice() }; } },
    ui: { act: async (_p, action) => action(), idle: () => {} },
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
    changed: () => {}
  });
  const mineAll = () => {
    for (const raw of chain.broadcasts) chain.mined.add('0x' + deserializeTransaction(raw).txid());
    chain.nonce = BigInt(chain.broadcasts.length);
  };
  return { ppp, chain, gate, savedLinks, store, walletStore, tick: (ms: number) => { time += ms; }, setMain: (m?: string) => { main = m; }, mineAll, evaluations: () => evaluations };
}

describe('radio pay-per-play walk-through (real wallet engine, mocked chain)', () => {
  it('goes from turn-on to a confirmed first paid play, then pays automatically', async () => {
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
    expect(s.ppp.snapshot()).toMatchObject({ step: 'first-play', balance: TARGET, allowance: 0n });

    await s.ppp.onAudibleStart({ song: 7, id: rid(1) });
    expect(s.chain.broadcasts).toHaveLength(0); // nothing pays before the in-frame approval

    await s.ppp.approveFirstPlay();
    expect(s.ppp.snapshot().session).toMatchObject({ playsLeft: 1 });
    await s.ppp.onAudibleStart({ song: 7, id: rid(2) });
    expect(s.chain.broadcasts).toHaveLength(1);
    expect(s.ppp.snapshot().step).toBe('paying');
    expect(s.ppp.snapshot().entries[0]).toMatchObject({ kind: 'play', song: 7, status: 'pending', recipient: HOLDER, amount: '50', fee: '300' });

    s.tick(MIN_PLAY_INTERVAL_MS);
    await s.ppp.onAudibleStart({ song: 8, id: rid(3) });
    expect(s.chain.broadcasts).toHaveLength(1); // one unresolved payment at a time

    s.mineAll();
    await s.ppp.forceRefresh();
    expect(s.ppp.snapshot()).toMatchObject({ step: 'ready', canaryPassed: true });
    expect(s.ppp.snapshot().entries[0]).toMatchObject({ status: 'confirmed' });
    expect(s.ppp.snapshot().entries[0].raw).toBeUndefined();

    await s.ppp.payAutomatically();
    expect(s.ppp.snapshot().session!.playsLeft).toBeGreaterThan(100);
    s.tick(MIN_PLAY_INTERVAL_MS);
    await s.ppp.onAudibleStart({ song: 9, id: rid(4) });
    expect(s.chain.broadcasts).toHaveLength(2);
    const tx = deserializeTransaction(s.chain.broadcasts[1]) as any;
    expect(tx.auth.spendingCondition.nonce).toBe(1n);
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
    await s.ppp.forceRefresh(); await s.ppp.create(); await s.ppp.link(); await s.ppp.deposit(); await s.ppp.approveFirstPlay();
    s.chain.owner = LISTENING;
    await s.ppp.onAudibleStart({ song: 1, id: rid(1) });
    expect(s.chain.broadcasts).toHaveLength(0);

    s.gate.enabled = false;
    await s.ppp.forceRefresh();
    expect(s.ppp.snapshot().step).toBe('off');
    s.chain.owner = HOLDER;
    await s.ppp.onAudibleStart({ song: 2, id: rid(2) });
    expect(s.chain.broadcasts).toHaveLength(0);

    const t = setup({ allowed: false });
    await t.ppp.forceRefresh();
    expect(t.ppp.snapshot().step).toBe('not-invited');
    t.setMain(undefined);
    await t.ppp.forceRefresh();
    expect(t.ppp.snapshot().step).toBe('connect');

    const u = setup({}, { tabLock: false });
    await u.ppp.forceRefresh(); await u.ppp.create(); await u.ppp.link(); await u.ppp.deposit();
    await u.ppp.approveFirstPlay();
    expect(u.ppp.snapshot().error).toMatch(/another tab/);
    await u.ppp.onAudibleStart({ song: 2, id: rid(9) });
    expect(u.chain.broadcasts).toHaveLength(0);
  });

  it('restores the link on a new device from the server record without another wallet popup', async () => {
    const s = setup();
    await s.ppp.forceRefresh(); await s.ppp.create(); await s.ppp.link();
    await s.ppp.lock();
    expect(s.ppp.snapshot().step).toBe('locked');
    await s.ppp.unlock();
    expect(s.ppp.snapshot()).toMatchObject({ linked: MAIN, step: 'fund' });
    // A second device: the passkey synced, but the frame has no local records.
    await s.ppp.lock();
    s.walletStore.clear();
    await s.ppp.forceRefresh();
    expect(s.ppp.snapshot().step).toBe('intro');
    await s.ppp.unlock(true);
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
    await s.ppp.approveFirstPlay();
    await s.ppp.onAudibleStart({ song: 1, id: rid(1) });
    s.mineAll();
    await s.ppp.payAutomatically();
    s.tick(MIN_PLAY_INTERVAL_MS);
    await s.ppp.onAudibleStart({ song: 2, id: rid(2) }); // no explicit refresh in between
    s.mineAll();
    s.tick(MIN_PLAY_INTERVAL_MS);
    await s.ppp.onAudibleStart({ song: 3, id: rid(3) });
    expect(s.chain.broadcasts).toHaveLength(3);
  });

  it('marks a payment the node refused as failed instead of blocking every later song', async () => {
    const s = setup();
    await s.ppp.forceRefresh(); await s.ppp.create(); await s.ppp.link(); await s.ppp.deposit();
    await s.ppp.approveFirstPlay();
    s.chain.rejectNext = true;
    await s.ppp.onAudibleStart({ song: 1, id: rid(1) });
    expect(s.ppp.snapshot().entries[0]).toMatchObject({ status: 'failed' });
    expect(s.ppp.snapshot().step).toBe('first-play');
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
    await s.ppp.forceRefresh(); await s.ppp.create(); await s.ppp.link(); await s.ppp.deposit(); await s.ppp.approveFirstPlay();
    s.chain.owner = MAIN;
    await s.ppp.onAudibleStart({ song: 1, id: rid(1) });
    expect(s.chain.broadcasts).toHaveLength(0);
  });
});
