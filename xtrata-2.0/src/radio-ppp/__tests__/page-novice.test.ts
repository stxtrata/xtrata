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
    <div class="ppp-switch" hidden></div><div class="ppp-key"></div><div class="ppp-featured" hidden></div><p class="ppp-frame-label"></p><div class="ppp-frame"></div><div class="ppp-actions"></div><p class="ppp-msg"></p><p class="ppp-err"></p>
    <details class="ppp-recent"><ol class="ppp-recent-list"></ol><details class="ppp-history"></details></details><details class="ppp-wallets"><dl class="ppp-facts"></dl><div class="ppp-actions ppp-actions2"></div></details>
    <details class="ppp-more"><div class="ppp-body"></div></details><details class="ppp-yours" hidden><summary></summary><div class="ppp-yours-body"></div></details><details class="ppp-shelf" hidden><summary></summary><div class="ppp-shelf-body"></div></details><details class="ppp-gifts"><div class="ppp-gift-body"></div></details></section></aside></main>
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

beforeEach(() => { vi.unstubAllGlobals(); delete (window as any).XtrataRadio; localStorage.clear(); sessionStorage.clear(); h.route = null; document.querySelectorAll('dialog').forEach((d) => d.remove()); for (const k of ['view', 'welcome', 'asking', 'noviceBoot', 'tier']) delete document.documentElement.dataset[k]; });

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

describe('novice welcome: a newcomer sees one short page, not the whole radio', () => {
  const NEW = { step: 'intro', listening: undefined, root: undefined, balance: undefined, session: null, giftStop: { reason: 'setup', text: 'SET UP YOUR PLAYER TO LISTEN' } };
  const page = () => document.getElementById('album')!;
  const named = (re: RegExp) => [...page().querySelectorAll('button')].find((b) => re.test(b.textContent || '')) as HTMLButtonElement | undefined;
  const html = () => document.documentElement;

  it('no player on this device: one button makes it, and nothing on the page is a crypto word', async () => {
    await open(NEW);
    expect(html().dataset.view).toBe('album'); // the radio and the panel are hidden behind it
    expect(html().dataset.welcome).toBe('new');
    expect(text(page())).toContain('Music that pays the artist');
    expect(text(page())).not.toMatch(BANNED_WORDS);
    expect(buttons(page())).toEqual(['Make my player', 'I’ve listened here before', 'Look around first']);
    named(/Make my player/)!.click();
    expect(h.calls.filter(([n]) => n === 'create')).toHaveLength(1);
    named(/listened here before/)!.click();
    expect(h.calls.filter(([n]) => n === 'unlock')).toEqual([['unlock', [true]]]);
  });

  it('while the box asks for a tap the page points to it, and a cancelled passkey is said plainly', async () => {
    await open({ ...NEW, busy: 'Waiting for your passkey…' });
    expect(html().dataset.asking).toBe('1');
    expect(text(page())).toContain('Continue in the box below.');
    expect(named(/Make my player/)).toBeUndefined();
    h.snap = { ...h.snap, busy: null, error: 'The passkey request was cancelled or timed out. Try again when ready.' };
    h.changed();
    expect(html().dataset.asking).toBeUndefined();
    expect(text(page())).toContain('cancelled or timed out');
    expect(named(/Make my player/)).toBeTruthy();
  });

  it('"Look around first" opens the full radio for this visit', async () => {
    await open(NEW);
    named(/Look around first/)!.click();
    expect(html().dataset.view).toBeUndefined();
    expect(html().dataset.welcome).toBeUndefined();
    expect(page().hidden).toBe(true);
    expect(sessionStorage.getItem('xtrata.radio.novice.full')).toBe('1');
  });

  it('a locked player: welcome back, one tap to unlock', async () => {
    await open({ step: 'locked', balance: undefined, session: null, giftStop: { reason: 'locked', text: 'UNLOCK TO LISTEN' } });
    expect(html().dataset.welcome).toBe('back');
    expect(text(page())).not.toMatch(BANNED_WORDS);
    named(/Unlock my player/)!.click();
    expect(h.calls.filter(([n]) => n === 'unlock')).toEqual([['unlock', []]]);
  });

  it('a player with no plays says so and leads to "Add plays"', async () => {
    await open({ step: 'fund', balance: 0n, playsLeft: 0, session: null, giftStop: { reason: 'out', text: 'EMPTY — ADD STX TO PLAY' } });
    expect(html().dataset.welcome).toBe('empty');
    expect(text(page())).toContain('Your player is ready');
    expect(text(page())).not.toMatch(BANNED_WORDS);
    expect(buttons(page())).toEqual(['Add plays', 'Look around the radio']);
    named(/Add plays/)!.click();
    const sheet = document.querySelector('dialog.ppp-restock')!;
    expect(text(sheet)).toContain('Your player is out of plays.');
    expect(text(sheet)).toContain(ME);
  });

  it('holds a quiet screen until it knows who this is, then gets out of the way for a listener with plays', async () => {
    await open({ step: 'off', gate: null, solo: false });
    expect(html().dataset.welcome).toBe('checking');
    expect(text(page())).toContain('One moment');
    h.snap = { ...base, entries: PLAYED };
    h.changed();
    expect(html().dataset.welcome).toBeUndefined();
    expect(html().dataset.view).toBeUndefined();
  });

  it('never shows for a listener who connected a Stacks wallet', async () => {
    await open({ step: 'connect', solo: false, listening: undefined, balance: undefined, session: null });
    expect(html().dataset.welcome).toBeUndefined();
    expect(html().dataset.view).toBeUndefined();
  });

  // Checked on this page's own mount, not on <html>: pages opened by earlier tests are still alive (their timers
  // redraw from the shared fake) and write to the same document element, but only this page owns this mount.
  it('never shows with the flag off', async () => {
    await open(NEW, null);
    expect(page().hidden).toBe(true);
    expect(page().childElementCount).toBe(0);
    expect(text(document.getElementById('ppp'))).toContain('Start listening'); // the classic panel, as before
  });
});

describe('a free starter player: claimed, arriving, landed', () => {
  const NEW = { step: 'intro', listening: undefined, root: undefined, balance: undefined, session: null, giftStop: { reason: 'setup', text: 'SET UP YOUR PLAYER TO LISTEN' } };
  const page = () => document.getElementById('album')!;
  const named = (re: RegExp) => [...page().querySelectorAll('button')].find((b) => re.test(b.textContent || '')) as HTMLButtonElement | undefined;
  const html = () => document.documentElement;
  const starter = (status = 'live') => {
    localStorage.setItem('xtrata.radio.gift.incoming.v1', JSON.stringify({ code: 'ABCDEFGHJKMNPQRSTVWXYZ', at: Date.now() }));
    h.route = (url) => (url.endsWith('/radio/gift/status') ? new Response(JSON.stringify({ status, amount: '100000', source: 'batch', from: null, label: '', expires: 0, player: null })) : undefined);
  };

  it('the link opens on one screen: how many plays, what a player is, one button', async () => {
    starter();
    await open(NEW);
    await vi.waitFor(() => expect(html().dataset.welcome).toBe('gift'));
    expect(text(page())).toContain('Your free player is waiting');
    expect(text(page())).toContain('277 plays');
    expect(text(page())).toContain('Play any song you like');
    expect(text(page())).toContain('It pays the artist');
    expect(text(page())).toContain('Likes build your playlist');
    expect(text(page())).not.toMatch(BANNED_WORDS);
    // The secure box was asked for its button the moment the link opened (the visitor already pressed "claim" on the
    // page that sent them): once, and never again by itself. This screen's button is there to ask again.
    expect(h.calls.filter(([n]) => n === 'create')).toHaveLength(1);
    named(/Claim my free player/)!.click();
    expect(h.calls.filter(([n]) => n === 'create')).toHaveLength(2);
  });

  it('after the tap it waits calmly for the plays, then says "You’re in" and starts the music', async () => {
    starter();
    await open(NEW);
    await vi.waitFor(() => expect(html().dataset.welcome).toBe('gift'));
    // The player now exists and is empty: the gift is on its way.
    h.snap = { ...base, step: 'fund', balance: 0n, playsLeft: 0, session: null, createdHere: true, giftStop: { reason: 'out', text: 'EMPTY — ADD STX TO PLAY' } };
    h.changed();
    expect(html().dataset.welcome).toBe('arriving');
    expect(text(page())).toContain('Your player is made');
    expect(page().querySelector('.ppp-bad')).toBeNull(); // never looks failed while it is on its way
    expect(text(page())).not.toMatch(/No plays|out of plays|Add plays/i);
    // The plays land.
    h.snap = { ...base, step: 'ready', balance: 100_000n, playsLeft: 277, gift: { player: null, from: null, source: 'batch', amount: '100000' }, giftPlays: 277 };
    localStorage.removeItem('xtrata.radio.gift.incoming.v1');
    h.changed();
    await vi.waitFor(() => expect(html().dataset.welcome).toBe('landed'));
    expect(text(page())).toContain('You got a Silver player'); // 277 plays: the class it turned out to be
    expect(page().querySelector('.tier-disc')!.getAttribute('data-tier')).toBe('silver');
    expect(html().dataset.tier).toBe('silver');
    expect(text(document.querySelector('#ppp .ppp-tier'))).toBe('✦ SILVER PLAYER');
    expect(text(page())).toContain('277 plays');
    expect(text(page())).not.toMatch(BANNED_WORDS);
    named(/Start listening/)!.click();
    expect(h.radio.playPause).toHaveBeenCalledTimes(1);
    expect(html().dataset.view).toBeUndefined(); // the radio itself
  });

  it('someone who already has a player is asked, kindly, to pass it on', async () => {
    starter();
    const root = await open({ entries: PLAYED, createdHere: false });
    await vi.waitFor(() => expect(text(root.querySelector('.ppp-key'))).toContain('You already have a player'));
    expect(text(root.querySelector('.ppp-key'))).toContain('Pass it on and bring them in');
    expect(buttons(root.querySelector('.ppp-key'))).toEqual(expect.arrayContaining(['Copy the link to pass on', 'Forget this gift link here']));
    expect(text(root.querySelector('.ppp-key'))).not.toMatch(/brand-new listening wallets/);
  });
});

describe('"Add plays": where running out leads', () => {
  const sheet = () => document.querySelector('dialog.ppp-restock');
  const OUT = { step: 'fund', balance: 3_100n, playsLeft: 0, session: null, entries: PLAYED, createdHere: false, giftStop: { reason: 'out', text: 'EMPTY — ADD STX TO PLAY' } };
  const press = (root: Element, re: RegExp) => ([...root.querySelectorAll('button')].find((b) => re.test(b.textContent || '')) as HTMLButtonElement).click();

  it('a played-out player has one primary button, with packs in plays and exactly what to send', async () => {
    const root = await open(OUT);
    expect(buttons(root.querySelector('.ppp-actions:not(.ppp-actions2)'))![0]).toBe('Add plays');
    press(root, /^Add plays$/);
    expect(text(sheet())).toContain('Your player is out of plays.');
    expect(text(sheet())).toContain('So far your player has paid for 1 play to 1 artist');
    expect(buttons(sheet()).slice(0, 4)).toEqual(['100plays', '250plays', '500plays', '1,000plays']);
    expect(text(sheet())).toContain('Send 0.0875 STX to your player'); // 250 plays, chosen to start with
    expect(text(sheet())).toContain(ME);
    press(sheet()!, /^1,000plays$/);
    expect(text(sheet())).toContain('Send 0.35 STX to your player');
  });

  it('card and Bitcoin are there but off until the deployment switches them on', async () => {
    const root = await open(OUT);
    press(root, /^Add plays$/);
    const ways = [...sheet()!.querySelectorAll('.ppp-restock__way')] as HTMLButtonElement[];
    expect(ways.map((b) => [b.querySelector('b')!.textContent, b.disabled])).toEqual([['STX', false], ['Card', true], ['Bitcoin', true]]);
    expect(ways.slice(1).every((b) => /Soon/.test(b.textContent || ''))).toBe(true);
  });

  it('says so when plays are already on their way, or when the balance cannot be read', async () => {
    const root = await open({ step: 'ready', balanceState: 'low', balance: 20_000n, playsLeft: 48, entries: PLAYED });
    press(root, /^Add plays$/);
    expect(text(sheet())).toContain('Your player has 48 plays left.');
    h.snap = { ...h.snap, depositPending: true };
    h.changed();
    expect(text(sheet())).toContain('already on their way');
    expect(sheet()!.querySelector('.ppp-restock__packs')).toBeNull();
  });

  it('a pack that would take the player over its limit cannot be chosen', async () => {
    const root = await open({ step: 'ready', balance: 800_000n, playsLeft: 2277, entries: PLAYED });
    press(root, /^Add plays$/);
    const packs = [...sheet()!.querySelectorAll('.ppp-restock__pack')] as HTMLButtonElement[];
    expect(packs.map((b) => b.disabled)).toEqual([false, false, false, true]);
  });
});

describe('player classes from the giveaway', () => {
  const page = () => document.getElementById('album')!;
  const html = () => document.documentElement;
  const gifted = (amount: string) => ({ player: null, from: null, source: 'batch', amount });

  it('a Diamond player wears its colours every time it loads, and they are remembered while it is locked', async () => {
    const root = await open({ entries: PLAYED, gift: gifted('353000'), giftPlays: 990 });
    expect(html().dataset.tier).toBe('diamond');
    expect(text(root.querySelector('.ppp-tier'))).toBe('◆ DIAMOND PLAYER');
    expect(localStorage.getItem('xtrata.radio.tier.v1')).toBe('diamond');
    // A later visit, still locked: the welcome-back screen already shows which player this is.
    await open({ step: 'locked', balance: undefined, session: null, giftStop: { reason: 'locked', text: 'UNLOCK TO LISTEN' } });
    expect(html().dataset.tier).toBe('diamond');
    expect(text(page())).toContain('Your Diamond player');
    expect(page().querySelector('.tier-disc')!.getAttribute('data-tier')).toBe('diamond');
  });

  it('a player that was not a giveaway gift has no class, and an album never gets one', async () => {
    const root = await open({ entries: PLAYED });
    expect(html().dataset.tier).toBeUndefined();
    expect(root.querySelector('.ppp-tier')).toBeNull();
    await open({ entries: PLAYED, slot: 2, gift: { player: PLAYER, from: null, source: 'batch', amount: '353000' }, likeFunds: { address: ME, balance: 300_000n, low: false, album: true, pending: false } });
    expect(html().dataset.tier).toBeUndefined();
  });

  it('a lottery link keeps the surprise: the gift screen does not say how many plays', async () => {
    localStorage.setItem('xtrata.radio.gift.incoming.v1', JSON.stringify({ code: 'ABCDEFGHJKMNPQRSTVWXYZ', at: Date.now() }));
    h.route = (url) => (url.endsWith('/radio/gift/status') ? new Response(JSON.stringify({ status: 'live', amount: '353000', source: 'batch', from: null, label: '', expires: 0, player: null })) : undefined);
    sessionStorage.setItem('xtrata.radio.mystery', '1');
    await open({ step: 'intro', listening: undefined, root: undefined, balance: undefined, session: null, giftStop: { reason: 'setup', text: 'SET UP YOUR PLAYER TO LISTEN' } });
    await vi.waitFor(() => expect(html().dataset.welcome).toBe('gift'));
    expect(text(page())).toContain('Claim it to find out which one is yours');
    expect(text(page())).not.toMatch(/1,000|plays are/);
    expect(text(page())).not.toMatch(BANNED_WORDS);
  });
});

describe('"Make it yours": found, not pushed', () => {
  it('a passkey-only listener can open what a name is and where to get one, with their player’s code to hand', async () => {
    const root = await open({ entries: PLAYED });
    const fold = root.querySelector('.ppp-yours') as HTMLDetailsElement;
    expect(fold.hidden).toBe(false);
    expect([...fold.querySelectorAll('.ppp-yours-item > summary')].map((x) => x.textContent)).toEqual(['Give your player a name', 'Link it to a wallet you already have', 'Bring a friend in']);
    expect([...fold.querySelectorAll('.ppp-yours-item')].every((d) => !(d as HTMLDetailsElement).open)).toBe(true); // each stays closed until opened
    expect(text(fold)).toContain('.btc name');
    expect(text(fold)).toContain(ME);
    expect((fold.querySelector('a[href="https://bns.one"]') as HTMLAnchorElement).textContent).toContain('BNS One');
  });
  it('is not shown before there is a player, or to someone already linked to a Stacks wallet', async () => {
    const a = await open({ step: 'intro', listening: undefined, root: undefined, balance: undefined, session: null });
    expect((a.querySelector('.ppp-yours') as HTMLDetailsElement).hidden).toBe(true);
    const b = await open({ solo: false, linked: FUNDER, main: FUNDER, mainConnected: true, gate: { ...base.gate, allowed: true } });
    expect((b.querySelector('.ppp-yours') as HTMLDetailsElement).hidden).toBe(true);
  });
});

describe('albums every player comes loaded with', () => {
  const OPERA = { id: 'aaaaaaaaaaaaaaaa', title: 'Audionals — The Opera', subtitle: 'Audionals', cover: null, paidOnly: true, tracks: [{ id: 501, title: 'Silence', artist: 'Audionals' }, { id: 502, title: 'Sound', artist: 'Audionals' }] };
  const EP = { id: 'bbbbbbbbbbbbbbbb', title: '2007 EP: Reload', subtitle: 'melophonic', cover: null, paidOnly: true, tracks: [{ id: 315, title: 'Entertainment', artist: 'melophonic' }] };
  const serve = () => { h.route = (url) => (url.endsWith('/radio/gift/featured') ? new Response(JSON.stringify({ players: [OPERA, EP] })) : undefined); };
  const rows = (root: Element) => [...root.querySelectorAll('.ppp-featured__a')] as HTMLButtonElement[];

  it('are offered in the player; one tap plays one from the player’s own plays, another goes back to the radio', async () => {
    serve();
    const root = await open({ entries: PLAYED });
    await vi.waitFor(() => expect(rows(root)).toHaveLength(2));
    expect(rows(root).map((b) => b.querySelector('b')!.textContent)).toEqual(['Audionals — The Opera', '2007 EP: Reload']);
    expect(text(root.querySelector('.ppp-featured'))).not.toMatch(BANNED_WORDS);
    rows(root)[0].click();
    expect(h.radio.setGiftPlayer).toHaveBeenLastCalledWith(expect.objectContaining({ id: OPERA.id, tracks: [501, 502] }));
    expect(h.radio.playToken).toHaveBeenCalledWith(501);
    expect(h.radio.setGiftLock).not.toHaveBeenCalledWith(true); // the rest of the radio stays open
    expect(text(rows(root)[0])).toContain('Playing now');
    rows(root)[0].click();
    expect(h.radio.setGiftPlayer).toHaveBeenLastCalledWith(null);
  });

  it('never replace an album wallet’s own album, and are not offered to a player with no plays', async () => {
    serve();
    const album = await open({ entries: PLAYED, slot: 2, gift: { player: PLAYER, from: null, source: 'batch', amount: '108000' }, likeFunds: { address: ME, balance: 300_000n, low: false, album: true, pending: false } });
    await vi.waitFor(() => expect((fetch as any).mock.calls.some((c: any[]) => String(c[0]).endsWith('/radio/gift/featured'))).toBe(true));
    expect((album.querySelector('.ppp-featured') as HTMLElement).hidden).toBe(true);
    const empty = await open({ step: 'fund', balance: 3_100n, playsLeft: 0, session: null, entries: PLAYED, createdHere: false });
    expect((empty.querySelector('.ppp-featured') as HTMLElement).hidden).toBe(true);
  });
});
