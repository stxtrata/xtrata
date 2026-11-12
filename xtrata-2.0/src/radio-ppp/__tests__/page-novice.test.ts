// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BANNED_WORDS } from '../novice';

/**
 * Novice mode on the real panel, with the controller and the radio faked (as in album.test.ts). The main path is
 * what a newcomer sees without opening a fold: it must not say STX, wallet, address, seed or sign, and nothing may
 * be lost (it moves into a fold). With the flag off the classic page is untouched.
 */
const h = vi.hoisted(() => ({ snap: {} as any, changed: () => {}, calls: [] as [string, unknown[]][], route: null as null | ((url: string, init?: any) => Response | undefined), radio: null as any, state: { playing: false, nowPlaying: null as any }, feeds: [] as ((st: any) => void)[] }));
vi.mock('../controller', () => ({
  TOP_UP_PLAYS: [100, 250, 500], ARRIVAL_GRACE_MS: 60_000, OUT_OF_LIKES: 'Your album keeps playing. Likes need a little STX in your main listener wallet, which is empty right now: top it up and your likes carry on.',
  createPppController: (deps: any) => {
    h.changed = deps.changed;
    const record = (name: string) => (...a: unknown[]) => { h.calls.push([name, a]); return Promise.resolve(); };
    return new Proxy({ snapshot: () => h.snap, refresh: async () => {} }, { get: (t: any, k: string) => t[k] ?? record(k) });
  }
}));
vi.mock('../../lib/wallet/passkey/bridge/client', () => ({ WalletBridgeClient: class {} }));
vi.mock('../../lib/wallet/session', () => ({ createWalletSessionStore: () => ({ load: () => ({ isConnected: false }) }) }));
vi.mock('../../lib/wallet/structured-sign', () => ({ requestStructuredSignature: async () => 'ab'.repeat(65) }));
vi.mock('../../lib/wallet/connect', () => ({ showStxTransfer: vi.fn() }));
vi.mock('../../radio-test-wallet/chain', () => ({ account: vi.fn(), api: vi.fn(), balance: vi.fn(), broadcast: vi.fn(), owner: vi.fn(), transaction: vi.fn(), validateSaved: vi.fn(), verify: vi.fn() }));
vi.mock('../../lib/wallet/installed', () => ({ hasInstalledStacksWallet: () => false }));
vi.mock('../../lib/bns/primary', () => ({ resolvePrimaryBnsName: async () => null }));

const ME = 'SPHRV6ESV321YCV6W990X4FKXB4S9D7F665FSCTV';
const FUNDER = 'SP1FVCANW8KX51C70JJAFTES86SR48CPP6F2ANQKP';
const PLAYER = { id: '0123456789abcdef', title: '2007 EP', subtitle: 'melophonic', cover: null, paidOnly: true,
  tracks: [{ id: 315, title: 'Entertainment', artist: 'melophonic' }, { id: 319, title: 'Russian Rampage', artist: 'melophonic' }] };
const base = {
  step: 'ready', busy: null, message: '', error: '', notice: '', main: undefined, mainConnected: false, listening: ME, root: ME, slot: 0, linked: undefined, balance: 100_000n,
  balanceState: 'ok', playsLeft: 277, allowance: 900_000n, session: { playsLeft: 277 }, payingOn: true, entries: [] as any[], depositPending: false, arrival: null, linkedListening: [], armed: false,
  stuck: 0, queued: 0, solo: true, returnTo: FUNDER, returnToKind: 'funder', funderState: 'found', funderMultiple: false, others: [], createdHere: true, brandNew: false, walletCannotAlbums: false,
  gate: { enabled: true, here: true, allowed: false, radioUrl: null, walletOrigin: 'https://w.test', passkeyOnly: true, limits: { playFee: '300' }, gifts: { enabled: true, turnstileSiteKey: null, admin: false } },
  gift: null, giftPlays: 0, playCost: 350n, giftStop: null, returnPlan: { state: 'none' }, likeFunds: null, albumLock: null
};
const PLAYED = [{ id: 'p1', kind: 'play', song: 11, status: 'confirmed', created: Date.now(), amount: '50', recipient: FUNDER, address: ME }];

async function open(over: object = {}, flag: string | null = '1') {
  vi.resetModules();
  if (flag) localStorage.setItem('xtrata.radio.novice', flag);
  document.documentElement.removeAttribute('data-novice');
  document.body.innerHTML = `<header class="topbar"></header><p id="paidRadioStatus"></p><main><section class="album" id="album" hidden></section><section class="albumlist" id="albumList" hidden></section><section class="rx"></section>
    <aside class="side"><div class="sheet-bar"><b id="sheetTitle"></b><button id="sheetClose">×</button></div><div class="sheet-extra" id="sheetExtra"></div>
    <section id="ppp" hidden><div class="ppp-head"><h3><span class="ppp-badge"></span></h3><span class="ppp-state"></span></div><ol class="ppp-steps"></ol><p class="ppp-stage"></p>
    <div class="ppp-switch" hidden></div><div class="ppp-key"></div><p class="ppp-frame-label"></p><div class="ppp-frame"></div><div class="ppp-actions"></div><p class="ppp-msg"></p><p class="ppp-err"></p>
    <details class="ppp-recent"><ol class="ppp-recent-list"></ol><details class="ppp-history"></details></details><details class="ppp-wallets"><dl class="ppp-facts"></dl><div class="ppp-actions ppp-actions2"></div></details>
    <details class="ppp-more"><div class="ppp-body"></div></details><details class="ppp-shelf" hidden><summary></summary><div class="ppp-shelf-body"></div></details><details class="ppp-gifts"><div class="ppp-gift-body"></div></details></section></aside></main>
    <div id="onair" hidden><b>ON AIR</b><span class="onair-sub"></span></div><div class="nudge" id="pppNudge" hidden><span class="nudge-txt"><b class="nudge-t"></b><span class="nudge-s"></span></span><button type="button">Start</button></div>`;
  h.state = { playing: false, nowPlaying: null };
  h.feeds = [];
  h.radio = { setGiftPlayer: vi.fn(), setGiftStop: vi.fn(), setGiftLock: vi.fn(), setGiftWait: vi.fn(), subscribe: vi.fn((fn: (st: any) => void) => { h.feeds.push(fn); }), refreshLikes: vi.fn(), forgetWallets: vi.fn(),
    getState: () => h.state, getPosition: () => ({ current: 0, duration: 0 }), playToken: vi.fn(), playPause: vi.fn(), next: vi.fn(), prev: vi.fn(), toggleLike: vi.fn() };
  (window as any).XtrataRadio = h.radio;
  h.snap = { ...base, ...over };
  h.calls = [];
  vi.stubGlobal('fetch', vi.fn(async (url: string, init?: any) => h.route?.(String(url), init) ?? new Response('{}')));
  await import('../page');
  h.changed();
  return document.getElementById('ppp')!;
}
const text = (n: Element | null) => n?.textContent ?? '';
/** Everything outside a fold: the lines, the buttons under them, the setup track, the state pill and the note by the radio. */
const mainPath = (root: Element) => [root.querySelector('.ppp-key'), root.querySelector('.ppp-actions:not(.ppp-actions2)'), root.querySelector('.ppp-steps:not([hidden])'), root.querySelector('.ppp-stage:not([hidden])'),
  root.querySelector('.ppp-state'), document.getElementById('pppNudge'), document.getElementById('paidRadioStatus')].map(text).join(' | ');
const buttons = (root: Element | null) => [...(root?.querySelectorAll('button') ?? [])].map((b) => b.textContent);
const say = (st: { playing: boolean; nowPlaying: any }) => { h.state = st; for (const fn of h.feeds) fn(st); };

beforeEach(() => { vi.unstubAllGlobals(); delete (window as any).XtrataRadio; localStorage.clear(); h.route = null; });

const STEPS: [string, object][] = [
  ['a new listener', { step: 'intro', listening: undefined, root: undefined, balance: undefined, session: null, giftStop: { reason: 'setup', text: 'SET UP YOUR PLAYER TO LISTEN' } }],
  ['a locked player', { step: 'locked', balance: undefined, session: null, giftStop: { reason: 'locked', text: 'UNLOCK TO LISTEN' } }],
  ['a new, empty player', { step: 'fund', balance: 0n, playsLeft: 0, session: null, giftStop: { reason: 'out', text: 'EMPTY — ADD STX TO PLAY' } }],
  ['a played-out player', { step: 'fund', balance: 3_100n, playsLeft: 0, session: null, entries: PLAYED, createdHere: false, giftStop: { reason: 'out', text: 'EMPTY — ADD STX TO PLAY' } }],
  ['listening', { step: 'ready', entries: PLAYED }],
  ['switched off', { step: 'ready', payingOn: false, giftStop: { reason: 'off', text: 'SWITCH ON MUSIC SUPPORT TO LISTEN' } }],
  ['holding too much', { step: 'over', balance: 1_500_000n, giftStop: { reason: 'over', text: 'OVER 1 STX — RETURN THE EXCESS' } }]
];

describe('novice mode: the main path uses plain words', () => {
  for (const [name, over] of STEPS) {
    it(`${name}: no STX, wallet, address, seed or sign outside the folds`, async () => {
      const root = await open(over);
      const seen = mainPath(root);
      expect(seen.replace(/[\s|]/g, '').length, 'the main path is not empty').toBeGreaterThan(10);
      expect(seen).not.toMatch(BANNED_WORDS);
      expect(root.querySelector('.ppp-steps')!.hasAttribute('hidden')).toBe(true); // no setup track
      // What the radio's own screen says is plain too.
      for (const [said] of h.radio.setGiftStop.mock.calls) if (typeof said === 'string') expect(said).not.toMatch(BANNED_WORDS);
    });
  }

  it('nothing is lost: the address and the Stacks wallet door move into the folds', async () => {
    const root = await open(STEPS[2][1]);
    expect(text(root.querySelector('.ppp-key'))).toContain('No plays yet.');
    expect(text(root.querySelector('.ppp-body'))).toContain(ME); // "How plays work" still has the address to send to
    expect(buttons(root.querySelector('.ppp-actions2'))).toContain('Copy my address');
    const intro = await open(STEPS[0][1]);
    expect(buttons(intro.querySelector('.ppp-actions:not(.ppp-actions2)'))).toEqual(['Start listening', 'I’ve listened here before']);
    expect(buttons(intro.querySelector('.ppp-actions2'))).toContain('I have a Stacks wallet');
    [...intro.querySelectorAll('button')].find((b) => b.textContent === 'Start listening')!.click();
    expect(h.calls.filter(([n]) => n === 'create')).toHaveLength(1);
  });

  it('a listener who connected a Stacks wallet keeps the classic page', async () => {
    const root = await open({ step: 'fund', solo: false, linked: FUNDER, main: FUNDER, mainConnected: true, balance: 0n, playsLeft: 0, allowance: 1_000_000n, createdHere: false, gate: { ...base.gate, allowed: true } });
    expect(buttons(root)).toEqual(expect.arrayContaining([expect.stringMatching(/Deposit 1(\.0+)? STX from my wallet/)]));
  });

  it('with the flag off nothing changes', async () => {
    const root = await open(STEPS[2][1], null);
    expect(document.documentElement.dataset.novice).toBeUndefined();
    expect(text(root.querySelector('.ppp-key'))).toMatch(/1 STX ≈/);
    expect(buttons(root.querySelector('.ppp-actions:not(.ppp-actions2)'))).toContain('Copy my address');
    expect(h.radio.setGiftStop).toHaveBeenLastCalledWith('EMPTY — ADD STX TO PLAY');
    expect(document.getElementById('album')!.hidden).toBe(true);
  });
});

describe('novice preview: one free first song from a shared album', () => {
  const NEW = { step: 'intro', listening: undefined, root: undefined, balance: undefined, session: null, giftStop: { reason: 'setup', text: 'SET UP YOUR PLAYER TO LISTEN' } };
  const link = () => {
    localStorage.setItem('xtrata.radio.gift.incoming.v1', JSON.stringify({ code: 'ABCDEFGHJKMNPQRSTVWXYZ', at: Date.now() }));
    h.route = (url) => (url.endsWith('/radio/gift/status') ? new Response(JSON.stringify({ status: 'live', amount: '108000', source: 'batch', from: null, label: '', expires: 0, player: PLAYER })) : undefined);
  };
  const album = () => document.getElementById('album')!;
  const named = (re: RegExp) => [...album().querySelectorAll('button')].find((b) => re.test(b.textContent || '')) as HTMLButtonElement | undefined;

  it('plays the first song before anything is set up, then asks for the player', async () => {
    link();
    await open(NEW, 'preview');
    await vi.waitFor(() => expect(named(/Play the first song/)).toBeTruthy());
    // The radio gets the album, is allowed to play, and is held to that album only.
    expect(h.radio.setGiftPlayer).toHaveBeenLastCalledWith(expect.objectContaining({ id: PLAYER.id, tracks: [315, 319] }));
    expect(h.radio.setGiftLock).toHaveBeenLastCalledWith(true);
    expect(h.radio.setGiftStop.mock.calls.filter(([t]: [unknown]) => typeof t === 'string')).toHaveLength(0);
    expect(text(album())).toContain('The first song is free');
    expect(text(album())).not.toMatch(BANNED_WORDS);
    named(/Play the first song/)!.click();
    expect(h.radio.playToken).toHaveBeenCalledWith(315);
    expect(h.calls.filter(([n]) => n === 'create')).toHaveLength(0); // nothing was set up

    say({ playing: true, nowPlaying: { tokenId: 315, title: 'Entertainment' } });
    expect(JSON.parse(localStorage.getItem('xtrata.radio.novice.previewed.v1')!)).toEqual([PLAYER.id]); // used from the first note
    expect(named(/Pause/)).toBeTruthy();
    expect(named(/Make my player/)).toBeTruthy();
    // The radio moves on to the second song: the preview is over.
    say({ playing: true, nowPlaying: { tokenId: 319, title: 'Russian Rampage' } });
    expect(h.radio.setGiftStop).toHaveBeenLastCalledWith('MAKE YOUR PLAYER TO LISTEN');
    expect(h.radio.setGiftPlayer).toHaveBeenLastCalledWith(null);
    expect(text(album())).toContain('That was the first song');
    named(/Keep listening/)!.click();
    expect(h.calls.filter(([n]) => n === 'create')).toHaveLength(1);
    expect(JSON.parse(localStorage.getItem('xtrata.radio.novice.previewed.v1')!)).toEqual([PLAYER.id]);
  });

  it('is offered once per album on a device', async () => {
    link();
    localStorage.setItem('xtrata.radio.novice.previewed.v1', JSON.stringify([PLAYER.id]));
    await open(NEW, 'preview');
    await vi.waitFor(() => expect(named(/Keep listening/)).toBeTruthy());
    expect(named(/Play the first song/)).toBeUndefined();
    expect(h.radio.setGiftStop).toHaveBeenLastCalledWith('MAKE YOUR PLAYER TO LISTEN');
    expect(h.radio.setGiftPlayer).not.toHaveBeenCalledWith(expect.objectContaining({ id: PLAYER.id }));
  });

  it('plain novice mode (no preview) keeps the paid rule: nothing plays before the player exists', async () => {
    link();
    await open(NEW, '1');
    await vi.waitFor(() => expect(named(/Open album/)).toBeTruthy());
    expect(named(/Play the first song/)).toBeUndefined();
    expect(h.radio.setGiftStop).toHaveBeenLastCalledWith('MAKE YOUR PLAYER TO LISTEN');
    expect(h.radio.setGiftPlayer).not.toHaveBeenCalledWith(expect.objectContaining({ id: PLAYER.id }));
  });

  it('a made player ends the preview: the album then plays on its own plays', async () => {
    link();
    await open(NEW, 'preview');
    await vi.waitFor(() => expect(named(/Play the first song/)).toBeTruthy());
    h.snap = { ...base, step: 'fund', balance: 0n, playsLeft: 0, session: null, depositPending: true, arrival: { since: Date.now(), graceMs: 60_000 }, giftStop: { reason: 'arriving', text: 'YOUR PLAYS ARE ARRIVING' } };
    h.changed();
    expect(h.radio.setGiftStop).toHaveBeenLastCalledWith('YOUR PLAYS ARE ARRIVING');
    expect(h.radio.setGiftLock).toHaveBeenLastCalledWith(false);
  });
});
