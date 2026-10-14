// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * The panel for a gifted wallet, with the controller faked: it speaks in plays, hands the album to the radio,
 * tells the radio when to stop, and shows the split before a return.
 */
const h = vi.hoisted(() => ({ snap: {} as any, changed: () => {}, returnFunds: null as any, topUp: vi.fn(), radio: null as any, session: { isConnected: false } as any, signed: [] as any[] }));
vi.mock('../controller', () => ({
  createPppController: (deps: any) => {
    h.changed = deps.changed;
    return new Proxy({ snapshot: () => h.snap, refresh: async () => {}, returnFunds: (m: string) => h.returnFunds(m), topUpLikes: () => h.topUp(), onListened: async () => {}, giftSent: () => {} }, {
      get: (t: any, k) => t[k] ?? (async () => {})
    });
  }
}));
vi.mock('../../lib/wallet/passkey/bridge/client', () => ({ WalletBridgeClient: class {} }));
vi.mock('../../lib/wallet/session', () => ({ createWalletSessionStore: () => ({ load: () => h.session }) }));
vi.mock('../../lib/wallet/structured-sign', () => ({ requestStructuredSignature: async (d: any) => { h.signed.push(d); return 'ab'.repeat(65); } }));
vi.mock('../../lib/wallet/connect', () => ({ showStxTransfer: vi.fn() }));
vi.mock('../../radio-test-wallet/chain', () => ({ account: vi.fn(), api: vi.fn(), balance: vi.fn(), broadcast: vi.fn(), owner: vi.fn(), transaction: vi.fn(), validateSaved: vi.fn(), verify: vi.fn() }));
vi.mock('../../lib/wallet/installed', () => ({ hasInstalledStacksWallet: () => false }));
vi.mock('../../lib/bns/primary', () => ({ resolvePrimaryBnsName: async () => null }));

const PLAYER = { id: '0123456789abcdef', title: 'Proof of Sound', subtitle: 'Someone', tracks: [{ id: 11, title: 'One', artist: 'X' }, { id: 12, title: 'Two', artist: 'X' }], cover: null, paidOnly: true };
const base = {
  step: 'ready', busy: null, message: '', error: '', main: undefined, listening: 'SPHRV6ESV321YCV6W990X4FKXB4S9D7F665FSCTV', linked: undefined, balance: 100_000n,
  balanceState: 'ok', playsLeft: 277, allowance: 900_000n, session: { playsLeft: 277, plays: 0, spent: 0n, budgetLeft: 900_000n, expires: 0 }, payingOn: true, entries: [],
  depositPending: false, walletOutdated: false, linkedListening: [], serverLinked: false, armed: false, stuck: 0, queued: 0, solo: true, returnTo: 'SP1FVCANW8KX51C70JJAFTES86SR48CPP6F2ANQKP', returnToKind: 'funder',
  funderState: 'found', funderMultiple: false, walletCannotSolo: false, walletCannotMulti: false, others: [], createdHere: true,
  gate: { enabled: true, allowed: false, here: true, radioUrl: null, walletOrigin: 'https://w.test', canary: false, passkeyOnly: true, limits: { playFee: '300', returnFee: '3000', maxSessionPlays: 3000, sessionHours: 168 }, gifts: { enabled: true, treasury: null, turnstileSiteKey: null, admin: false, fee: '3000' } },
  gift: { player: PLAYER, from: null, source: 'campaign', amount: '100000' }, giftPlays: 277, giftStop: null, returnPlan: { state: 'none' }
};

async function open(over: object = {}) {
  vi.resetModules();
  document.body.innerHTML = `<section id="ppp" hidden><div class="ppp-head"><h3><span class="ppp-badge"></span></h3><span class="ppp-state"></span></div><ol class="ppp-steps"></ol><p class="ppp-stage"></p>
    <div class="ppp-key"></div><p class="ppp-frame-label"></p><div class="ppp-frame"></div><div class="ppp-actions"></div><p class="ppp-msg"></p><p class="ppp-err"></p>
    <details class="ppp-recent"><ol class="ppp-recent-list"></ol><details class="ppp-history"></details></details><details class="ppp-wallets"><dl class="ppp-facts"></dl><div class="ppp-actions ppp-actions2"></div></details>
    <details class="ppp-more"><div class="ppp-body"></div></details><details class="ppp-gifts"><div class="ppp-gift-body"></div></details></section>`;
  h.radio = { setGiftPlayer: vi.fn(), setGiftStop: vi.fn(), subscribe: vi.fn(), refreshLikes: vi.fn() };
  (window as any).XtrataRadio = h.radio;
  h.snap = { ...base, ...over };
  vi.stubGlobal('fetch', vi.fn(async (url: string, init?: any) => new Response(String(url).endsWith('/radio/gift/player') ? JSON.stringify({ id: 'fedcba9876543210', title: 'Proof of Sound', tracks: 2, existing: false }) : '{}')));
  await import('../page');
  h.changed();
  return document.getElementById('ppp')!;
}
const text = (root: Element) => root.textContent ?? '';
beforeEach(() => { vi.unstubAllGlobals(); delete (window as any).XtrataRadio; h.session = { isConnected: false }; h.signed = []; });

describe('Gift Edition panel', () => {
  it('names the player, counts plays (not STX) and hands the album to the radio', async () => {
    const root = await open();
    expect(text(root.querySelector('.ppp-key')!)).toContain('Gift Edition · Proof of Sound');
    expect(text(root.querySelector('.ppp-key')!)).toContain('277 plays left');
    expect(text(root.querySelector('.ppp-key')!)).not.toMatch(/STX/);
    expect(h.radio.setGiftPlayer).toHaveBeenCalledWith({ id: PLAYER.id, title: 'Proof of Sound', subtitle: 'Someone', tracks: [11, 12] });
    h.changed(); h.changed();
    expect(h.radio.setGiftPlayer).toHaveBeenCalledTimes(1); // the same album is not pushed again
  });

  it('tells the radio to stop when the plays are gone, with a quiet pointer to Xverse and Leather', async () => {
    const root = await open({ step: 'fund', balance: 3_000n, giftPlays: 0, giftStop: { reason: 'out', text: 'OUT OF PLAYS — ADD MORE TO KEEP LISTENING' } });
    expect(h.radio.setGiftStop).toHaveBeenLastCalledWith('OUT OF PLAYS — ADD MORE TO KEEP LISTENING');
    const key = root.querySelector('.ppp-key')!;
    expect(text(key)).toContain('no plays left');
    expect(text(key)).toContain('Out of plays');
    expect([...key.querySelectorAll('a')].map((a) => a.textContent)).toEqual(expect.arrayContaining(['Xverse', 'Leather']));
    h.snap = { ...h.snap, step: 'ready', giftPlays: 40, giftStop: null };
    h.changed();
    expect(h.radio.setGiftStop).toHaveBeenLastCalledWith(null);
  });

  it('an ordinary wallet leaves the radio alone', async () => {
    await open({ gift: null, giftStop: null, giftPlays: 0 });
    expect(h.radio.setGiftPlayer).not.toHaveBeenCalledWith(expect.objectContaining({ id: expect.any(String) }));
    expect(h.radio.setGiftStop).not.toHaveBeenCalledWith(expect.any(String));
  });

  it('shows the split of a return before anything is sent, and the button confirms it', async () => {
    h.returnFunds = vi.fn();
    const root = await open({ returnPlan: { state: 'ready', kept: 0, excess: null, steps: [{ to: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X', kind: 'deposit', send: '197000' }, { to: 'SP1FVCANW8KX51C70JJAFTES86SR48CPP6F2ANQKP', kind: 'gift', send: '297000' }] } });
    const key = root.querySelector('.ppp-key')!;
    expect(text(key)).toContain('each to whoever it came from');
    expect(text(key)).toContain('0.197000 STX · what was added to it');
    expect(text(key)).toContain('0.297000 STX · the unused gift');
    [...key.querySelectorAll('button')].find((b) => /Confirm part 1 of 2/.test(b.textContent ?? ''))!.click();
    expect(h.returnFunds).toHaveBeenCalledWith('all');
  });

  it('the admin makes a player with a signature over its hash, then offers it for a campaign', async () => {
    const ADMIN = 'SP1FVCANW8KX51C70JJAFTES86SR48CPP6F2ANQKP';
    h.session = { isConnected: true, network: 'mainnet', address: ADMIN };
    const root = await open({ gift: null, giftStop: null, giftPlays: 0, main: ADMIN, gate: { ...base.gate, gifts: { ...base.gate.gifts, admin: true } } });
    const fold = root.querySelector('.ppp-gift-body')!;
    const title = fold.querySelector('input[aria-label="Player title"]') as HTMLInputElement;
    const tracks = fold.querySelector('textarea[aria-label="Songs"]') as HTMLTextAreaElement;
    title.value = 'Proof of Sound'; tracks.value = '11, 12';
    [...fold.querySelectorAll('button')].find((b) => /Sign and make player/.test(b.textContent ?? ''))!.click();
    await vi.waitFor(() => expect((fetch as any).mock.calls.some((c: any[]) => String(c[0]).endsWith('/radio/gift/player'))).toBe(true));
    const post = (fetch as any).mock.calls.find((c: any[]) => String(c[0]).endsWith('/radio/gift/player'));
    const body = JSON.parse(post[1].body);
    expect(body.definition).toEqual({ title: 'Proof of Sound', subtitle: '', tracks: [11, 12], cover: null });
    expect(body.request).toMatchObject({ admin: ADMIN, hash: expect.stringMatching(/^[0-9a-f]{64}$/) });
    expect(h.signed).toHaveLength(1);
    await vi.waitFor(() => expect(JSON.parse(localStorage.getItem('xtrata.radio.gift.players.v1:' + ADMIN) || '[]')[0]).toMatchObject({ id: 'fedcba9876543210', tracks: 2 }));
  });

  it('refuses a bad song list before anything is signed', async () => {
    const ADMIN = 'SP1FVCANW8KX51C70JJAFTES86SR48CPP6F2ANQKP';
    h.session = { isConnected: true, network: 'mainnet', address: ADMIN };
    const root = await open({ gift: null, giftStop: null, giftPlays: 0, main: ADMIN, gate: { ...base.gate, gifts: { ...base.gate.gifts, admin: true } } });
    const fold = root.querySelector('.ppp-gift-body')!;
    (fold.querySelector('input[aria-label="Player title"]') as HTMLInputElement).value = 'Dupes';
    (fold.querySelector('textarea[aria-label="Songs"]') as HTMLTextAreaElement).value = '11, 11';
    [...fold.querySelectorAll('button')].find((b) => /Sign and make player/.test(b.textContent ?? ''))!.click();
    await vi.waitFor(() => expect(text(root.querySelector('.ppp-gift-body')!)).toContain('appears twice'));
    expect(h.signed).toHaveLength(0);
  });
});

describe('main listener wallet out of funds (an album wallet is open)', () => {
  const ROOT = 'SP3X2F7FQH7GQS0YRBWH0H5W6RM2PB1B0WPD1XA2V';
  const low = { address: ROOT, balance: 0n, low: true, album: true, pending: false, main: undefined as string | undefined };
  const album = { gift: null, giftStop: null, giftPlays: 0 };

  it('warns loudly with the address and a copy button, and no pay button without a main wallet', async () => {
    const root = await open({ ...album, likeFunds: low });
    const key = root.querySelector('.ppp-key')!;
    expect(text(key)).toContain('YOUR MAIN LISTENER WALLET IS OUT OF FUNDS');
    expect(text(key)).toContain(ROOT);
    expect(key.querySelector('.ppp-lowbox')).not.toBeNull();
    expect([...key.querySelectorAll('button')].map((b) => b.textContent)).toEqual(['Copy address']);
  });

  it('offers a one-tap top-up from the connected main wallet', async () => {
    const root = await open({ ...album, solo: false, main: 'SP1FVCANW8KX51C70JJAFTES86SR48CPP6F2ANQKP', likeFunds: { ...low, main: 'SP1FVCANW8KX51C70JJAFTES86SR48CPP6F2ANQKP' } });
    const pay = [...root.querySelectorAll('.ppp-key button')].find((b) => /Pay 1.000000 STX from my wallet/.test(b.textContent ?? '')) as HTMLButtonElement;
    expect([...root.querySelectorAll('.ppp-key button')].map((b) => b.textContent)).toContain('Pay 1.000000 STX from my wallet');
    expect(pay).toBeTruthy();
    pay.click();
    expect(h.topUp).toHaveBeenCalledTimes(1);
  });

  it('goes quiet once the top-up is on its way, and shows nothing while funds are fine or no album is open', async () => {
    const root = await open({ ...album, likeFunds: { ...low, low: false, pending: true, txid: '0x' + 'd'.repeat(64) } });
    const key = root.querySelector('.ppp-key')!;
    expect(text(key)).toContain('on its way');
    expect(text(key)).not.toContain('OUT OF FUNDS');
    h.snap = { ...h.snap, likeFunds: { ...low, low: false, balance: 500_000n } }; h.changed();
    expect(key.querySelector('.ppp-lowbox')).toBeNull();
    h.snap = { ...h.snap, likeFunds: { ...low, album: false } }; h.changed();
    expect(key.querySelector('.ppp-lowbox')).toBeNull();
  });
});
