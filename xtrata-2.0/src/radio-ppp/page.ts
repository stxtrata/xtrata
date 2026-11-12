/**
 * /radio pay-per-play panel. Mounts the listening wallet frame (its own origin) and walks the
 * listener through: create → link → deposit → approve → first paid play. Holds no key.
 */
import { StacksMainnet } from '@stacks/network';
import { WalletBridgeClient } from '../lib/wallet/passkey/bridge/client';
import { createWalletSessionStore } from '../lib/wallet/session';
import { requestStructuredSignature } from '../lib/wallet/structured-sign';
import { showStxTransfer } from '../lib/wallet/connect';
import { costPerPlay, HOLDER_PAYMENT, RESERVE, stx, TARGET } from '../lib/listening-wallet/policy';
import { account, api, balance, broadcast, owner, transaction, validateSaved, verify } from '../radio-test-wallet/chain';
import { ARRIVAL_GRACE_MS, createPppController, OUT_OF_LIKES, TOP_UP_PLAYS, type GateConfig, type Snapshot } from './controller';
import { showSteps, stagesFor, stageOf, type StageView } from './stages';
import { findFunder } from '../lib/listening-wallet/funder';
import { readHistory } from '../lib/listening-wallet/ledger';
import { hasInstalledStacksWallet } from '../lib/wallet/installed';
import { resolvePrimaryBnsName } from '../lib/bns/primary';
import { createNameCache } from '../lib/bns/name-cache';
import { radioArtist, radioTitle } from '../lib/radio/artist-credits.mjs';
import { createGifts } from './gifts';
import { hiddenTrack, listedTracks } from '../lib/listening-wallet/gift-players';
import { createShelf } from './shelf';
import { createAlbumView, type AlbumInput } from './album';
import type { PlayerView } from '../lib/listening-wallet/gift-players';
import { copyButton } from './feedback';
import { browserName, inAppBrowser, openInBrowserHref } from './in-app';
import { musicWalletOptions } from './connect-choice';
import { hasBannedWord, markPreviewed, newPreview, PLAIN_CHECKING, PLAIN_LABEL, PLAIN_NUDGE, plainLines, plainStop, previewedAlbums, previewLive, readNovice, stepPreview } from './novice';
import type { GiftStopReason } from './controller';
import { createWelcomeView, type WelcomeMode } from './welcome';
import { createRestockSheet, type RestockInput } from './restock-sheet';
import { buildSongs, createFindBox } from './find';
import { isTierId, tierById, tierOfAmount, type Tier } from '../lib/listening-wallet/tiers';

const root = document.getElementById('ppp');
if (root) start(root);

function start(root: HTMLElement) {
  const paidHost = document.documentElement.dataset.radioPaidOnly === 'true';
  const paidStatus = document.getElementById('paidRadioStatus');
  const sessionStore = createWalletSessionStore();
  const $ = (sel: string) => root.querySelector(sel) as HTMLElement;
  const frameWrap = $('.ppp-frame');
  let frame: HTMLIFrameElement | null = null;

  const json = async (url: string, init?: RequestInit) => {
    const r = await fetch(url, { cache: 'no-store', ...init, signal: AbortSignal.timeout(15000) });
    const body = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(body?.error || `Request failed (${r.status}).`);
    return body;
  };

  const ppp = createPppController({
    now: Date.now,
    main: () => { const s = sessionStore.load(); return s.isConnected && s.network === 'mainnet' ? s.address : undefined; },
    config: (main) => json('/radio/listening-wallet/config?main=' + encodeURIComponent(main || '')) as Promise<GateConfig>,
    links: async (main) => (await json('/radio/listening-wallet/link?main=' + encodeURIComponent(main))).links ?? [],
    mainOf: async (listening) => {
      const r = (await json('/radio/listening-wallet/link?listening=' + encodeURIComponent(listening))).links as { listening: string; main: string }[] | undefined;
      return r?.find((l) => l.listening === listening)?.main ?? null;
    },
    saveLink: async (body) => { await json('/radio/listening-wallet/link', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }); },
    bridge: async (origin) => {
      frame = document.createElement('iframe');
      frame.title = 'Xtrata listening wallet';
      // Cross-origin frames may use passkeys only when the parent grants it, to that exact origin.
      frame.setAttribute('allow', `publickey-credentials-get ${origin}; publickey-credentials-create ${origin}`);
      frame.referrerPolicy = 'no-referrer';
      const loaded = new Promise<void>((resolve, reject) => {
        frame!.addEventListener('load', () => resolve(), { once: true });
        setTimeout(() => reject(new Error('The listening wallet did not load.')), 15000);
      });
      frame.src = origin + '/';
      frameWrap.replaceChildren(frame);
      await loaded;
      // Interactive requests wait for the listener (up to 30 minutes) so a late confirm in the frame
      // is never signed and then dropped here. Everything else must answer quickly.
      const client = new WalletBridgeClient({ walletOrigin: origin, frame, timeoutMs: 30 * 60_000 });
      const INTERACTIVE = new Set(['listening.unlock', 'listening.link', 'listening.approveSession', 'listening.prepareReturn']);
      const request = <T,>(method: string, params?: unknown) => INTERACTIVE.has(method)
        ? client.request<T>(method as never, params)
        : Promise.race([
          client.request<T>(method as never, params),
          new Promise<T>((_, reject) => setTimeout(() => reject(new Error('The listening wallet is not answering.')), 10000))
        ]);
      // A frame blocked by its own headers still fires load; prove it answers before relying on it.
      await request('listening.status');
      return { request };
    },
    chain: {
      verify, balance, account, owner, broadcast, transaction,
      confirmedNonce: async (address) => {
        const a = await api(`/v2/accounts/${address}?proof=0`);
        if (!Number.isSafeInteger(a?.nonce) || a.nonce < 0) throw new Error('Malformed account data.');
        return BigInt(a.nonce);
      }
    },
    signWithMain: (main, data) => requestStructuredSignature({ ...data, network: 'mainnet', stxAddress: main }),
    deposit: (main, recipient, amount) => new Promise((resolve, reject) => showStxTransfer({
      recipient, amount: amount.toString(), memo: 'Xtrata listening wallet', stxAddress: main, network: new StacksMainnet(),
      appDetails: { name: 'Xtrata Radio · pay-per-play', icon: '/favicon.svg' },
      onFinish: (r) => resolve(r.txId || ''), onCancel: () => reject(new Error('Deposit cancelled. Nothing was sent.')), onError: reject
    })),
    validate: validateSaved,
    tabLock: (listening) => new Promise<boolean>((resolve) => {
      const locks = (navigator as any).locks;
      if (!locks?.request) { resolve(true); return; }
      void locks.request('xtrata-ppp:' + listening, { ifAvailable: true }, async (lock: unknown) => {
        resolve(!!lock);
        if (lock) await new Promise(() => {}); // held until this tab closes
      });
    }),
    store: {
      get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
      set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* history is a convenience */ } }
    },
    changed: () => render(ppp.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (listening) => gifts.funder(listening, () => findFunder(listening, api), !!ppp.snapshot().gate?.gifts?.enabled),
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (listening) => {
      const r = await json('/radio/gift/for?wallet=' + encodeURIComponent(listening));
      const g = r?.gift;
      if (!g) return null;
      if (typeof g.returnTo !== 'string' || typeof g.treasury !== 'string') throw new Error('Unreadable gift record.');
      return { returnTo: g.returnTo, from: typeof g.from === 'string' ? g.from : null, source: String(g.source ?? ''), amount: String(g.amount ?? '0'), treasury: g.treasury, state: g.state === 'sending' ? 'sending' : 'arrived', player: g.player ?? null };
    },
    history: (listening, withOutgoing) => readHistory(listening, (path) => api(path), withOutgoing),
    likesChanged: () => { void (window as any).XtrataRadio?.refreshLikes?.(); },
    likeState: async (main, song) => {
      const r = await json('/radio/chain-likes?' + new URLSearchParams({ wallet: main, ids: String(song) }));
      const row = Array.isArray(r?.rows) ? r.rows.find((x: any) => x?.id === song) : null;
      if (!row || typeof row.liked !== 'boolean') throw new Error('Like state unavailable.');
      return { liked: row.liked, by: Array.isArray(row.by) ? row.by.filter((a: unknown) => typeof a === 'string') : row.liked ? [main] : [] };
    },
    likeSent: (song, liked) => window.dispatchEvent(new CustomEvent('xtrata:radio-like-sent', { detail: { song, liked } })),
    nameOf: (a) => nameOf(a) ?? undefined,
    likeConfirmed: (song, liked) => window.dispatchEvent(new CustomEvent('xtrata:radio-like-confirmed', { detail: { song, liked } })),
    likeFailed: (song) => window.dispatchEvent(new CustomEvent('xtrata:radio-like-failed', { detail: { song } }))
  });

  const gifts = createGifts({
    json,
    main: () => { const s = sessionStore.load(); return s.isConnected && s.network === 'mainnet' ? s.address : undefined; },
    pay: (main, recipient, amount, memo) => new Promise((resolve, reject) => showStxTransfer({
      recipient, amount: amount.toString(), memo, stxAddress: main, network: new StacksMainnet(),
      appDetails: { name: 'Xtrata Radio · gift', icon: '/favicon.svg' },
      onFinish: (r) => resolve(r.txId || ''), onCancel: () => reject(new Error('Gift cancelled. Nothing was sent.')), onError: reject
    })),
    sign: (main, data) => requestStructuredSignature({ ...data, network: 'mainnet', stxAddress: main }),
    giftSent: (txid, amount) => ppp.giftSent(txid, amount),
    claiming: (on) => ppp.giftClaiming(on),
    album: { bind: (slot) => ppp.bindAlbum(slot), arrived: async (slot, address, txid, amount) => { shelf.invalidate(); await ppp.albumArriving(slot, address, txid, amount); } },
    who: (address) => who(address),
    changed: () => render(ppp.snapshot()),
    store: {
      get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
      set: (k, v) => { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch { /* best effort */ } }
    },
    now: Date.now
  });

  const shelf = createShelf({
    json,
    open: (slot) => { void ppp.openAlbum(slot); },
    store: {
      get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
      set: (k, v) => { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch { /* best effort */ } }
    },
    now: Date.now,
    changed: () => render(ppp.snapshot())
  });

  // Album First (src/radio-ppp/album.ts): a listener who was sent an album sees a player, not this panel.
  // Off by default: an album opens inside the normal player (its tab, its plays left, its song list where Your Station
  // was). Switch the separate page on with `?albumpage=1` or localStorage `xtrata.radio.albumpage` = 1, to keep it
  // available for albums that bring a player of their own.
  // Novice mode (src/radio-ppp/novice.ts, docs/music/HANDBOOK.md): off by default. Plain wording on the main path, the
  // album page for anyone who arrives with an album, and (only with `?novice=preview`) one unpaid first song.
  const flagStore = {
    get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k: string, v: string | null) => { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch { /* a convenience */ } }
  };
  const novice = readNovice(location.search, flagStore);
  if (novice.on) document.documentElement.dataset.novice = novice.preview ? 'preview' : '1';
  /** Plain wording applies to a listener with no Stacks wallet in play; anyone who connected one keeps the classic page. */
  const plainFor = (s: Snapshot) => novice.on && s.solo;
  const albumPage = novice.on || (() => { try { return /[?&]albumpage=1\b/.test(location.search) || localStorage.getItem('xtrata.radio.albumpage') === '1'; } catch { return false; } })();
  const albumMount = albumPage ? document.getElementById('album') : null;
  const albumDeps = {
    radio: () => (window as any).XtrataRadio ?? null,
    topUp: (plays: number) => void ppp.topUpAlbum(plays),
    openPlayer: () => void ppp.openAlbum(0)
  };
  const albumView = albumMount ? createAlbumView(albumMount, albumDeps) : null;
  // The player's class from the giveaway (tiers.ts): Diamond, Gold, Silver, Bronze, Neon or Classic, decided by the plays
  // a free starter player was given. Shown every time the player loads: a badge on the panel, the page's trim
  // (`html[data-tier]`, public/radio.html) and a coloured record on the welcome screens. Remembered on the device so a
  // locked player still shows its colours before it is unlocked. Looks only: it changes nothing a player can do.
  const TIER_KEY = 'xtrata.radio.tier.v1';
  let tierNow: Tier | null = (() => { const v = flagStore.get(TIER_KEY); return isTierId(v) ? tierById(v) : null; })();
  // A lottery link from the giveaway page (`?mystery=1`): the gift screen does not say what the player holds.
  const mystery = (() => {
    try {
      if (new URLSearchParams(location.search).get('mystery') === '1') sessionStorage.setItem('xtrata.radio.mystery', '1');
      return sessionStorage.getItem('xtrata.radio.mystery') === '1';
    } catch { return false; }
  })();
  function syncTier(s: Snapshot) {
    // Known only while the listener's own player is open: a starter gift (no album) gives it a class, anything else none.
    if (s.listening && s.slot === 0 && ['fund', 'ready', 'over'].includes(s.step)) {
      let next: Tier | null = null;
      try { next = s.gift && !s.gift.player ? tierOfAmount(BigInt(s.gift.amount)) : null; } catch { next = null; }
      if ((next?.id ?? null) !== (tierNow?.id ?? null)) { tierNow = next; flagStore.set(TIER_KEY, next ? next.id : null); }
    }
    const root = document.documentElement;
    if (tierNow) root.dataset.tier = tierNow.id; else delete root.dataset.tier;
    const head = document.querySelector('#ppp .ppp-head h3');
    if (!head) return;
    let badge = head.querySelector('.ppp-tier') as HTMLElement | null;
    if (!tierNow) { badge?.remove(); return; }
    if (!badge) { badge = el('span', '', 'ppp-tier'); head.append(badge); }
    badge.dataset.tier = tierNow.id;
    badge.textContent = `${tierNow.mark} ${tierNow.name.toUpperCase()} PLAYER`;
    badge.title = `A ${tierNow.name} player from the Xtrata Music giveaway`;
  }

  // Novice mode's first screen (welcome.ts): a newcomer with no player and no album sees one short page and one button,
  // not the whole radio. Until the page knows who this is, a quiet holding screen stands in (never the radio flashing by).
  const welcome = novice.on && albumMount ? createWelcomeView(albumMount) : null;
  const welcomeSince = Date.now();
  let welcomeKnown = false;      // the first real answer about this visitor has arrived
  let welcomeLast: WelcomeMode | null = null;
  let welcomeFull = (() => { try { return sessionStorage.getItem('xtrata.radio.novice.full') === '1'; } catch { return false; } })();
  const showFull = () => { welcomeFull = true; try { sessionStorage.setItem('xtrata.radio.novice.full', '1'); } catch { /* this visit only anyway */ } render(ppp.snapshot()); };
  const welcomeMode = (s: Snapshot, albumActive: boolean): WelcomeMode | null => {
    if (!welcome || albumActive || welcomeFull) return null;
    const waiting = !s.gate || s.step === 'loading';
    if (!waiting) welcomeKnown = true;
    // Not known yet: hold, but never for long (a page that cannot reach the server must still show the radio).
    if (!welcomeKnown) return Date.now() - welcomeSince < 10_000 ? 'checking' : null;
    if (!plainFor(s)) return null;
    if (s.step === 'intro' || s.step === 'unsupported') return gifts.incomingStarter() ? 'gift' : 'new';
    if (s.step === 'locked') return 'back';
    // The listener's own player (not an album), never played from on this device.
    const fresh = s.slot === 0 && !s.gift?.player && !s.entries.some((e) => e.kind === 'play');
    if (s.step === 'fund' && fresh) return s.depositPending ? 'arriving' : 'empty';
    // The plays this page was waiting for have landed: one screen that says what the player is, then the radio.
    if (s.step === 'ready' && fresh && (welcomeLast === 'arriving' || welcomeLast === 'landed')) return 'landed';
    return s.step === 'loading' && welcomeLast !== 'checking' ? welcomeLast : null; // a check in between: stay where we were
  };
  function syncWelcome(s: Snapshot, albumActive: boolean, lines: HTMLElement[] = [], decided?: WelcomeMode | null) {
    if (!welcome) return;
    const mode = decided !== undefined ? decided : welcomeMode(s, albumActive);
    welcomeLast = mode;
    delete document.documentElement.dataset.noviceBoot; // public/radio.html held the page blank until here
    if (!mode) { welcome.render(null, albumActive); return; }
    const status = [...lines];
    if (mode === 'arriving' && s.arrival) status.push(arrivalBar(s.arrival));
    if (s.step === 'unsupported') status.push(el('p', 'This browser cannot make a player. Open this page in Safari or Chrome.', 'ppp-warn'));
    else if (s.error) status.push(el('p', s.error, 'ppp-warn'));
    const starter = mode === 'gift' ? gifts.incomingStarter() : null;
    welcome.render({
      mode, status, asking: !!s.busy || s.armed, busy: !!s.busy, canStart: (s.step === 'intro' || s.step === 'locked') && !inApp,
      plays: starter ? starter.plays : mode === 'landed' ? s.playsLeft : null, from: starter?.from ?? null,
      tier: tierNow, mystery,
      albums: mode === 'landed' ? featured.map((p) => ({ title: p.title, by: p.subtitle, run: () => { showFull(); openFeatured(p, true); } })) : [],
      start: () => void ppp.create(), unlock: () => void ppp.unlock(), returning: () => void ppp.unlock(true), restock: () => restock.open(),
      full: () => {
        // "Start listening" starts the music: it is the listener's own tap, and nothing is playing yet.
        const radio = (window as any).XtrataRadio;
        const begin = mode === 'landed' && !radio?.getState?.()?.playing;
        showFull();
        if (begin) radio?.playPause?.();
      }
    });
  }
  if (welcome) setTimeout(() => { if (!welcomeKnown) render(ppp.snapshot()); }, 10_100);

  // "Add plays" (restock-sheet.ts): where every "out of plays" and "running low" leads. It always restocks the
  // listener's own player (the first wallet), which is also what tops up albums and pays for likes.
  const restockInput = (): RestockInput | null => {
    const s = ppp.snapshot();
    if (!['fund', 'ready', 'over'].includes(s.step)) return null;
    const mine = s.slot === 0 ? { address: s.listening, balance: s.balance } : { address: s.root, balance: s.likeFunds?.balance };
    if (!mine.address) return null;
    const own = s.slot === 0 ? s.entries : [];
    const paid = own.filter((e) => e.kind === 'play' && e.status === 'confirmed');
    return {
      playsLeft: mine.balance === undefined ? null : playsOf(mine.balance), balance: mine.balance, incoming: 0n,
      fee: BigInt(s.gate?.limits.playFee ?? '300'), address: mine.address, switches: s.gate?.restock ?? {},
      done: paid.length ? { plays: paid.length, artists: new Set(paid.map((e) => e.recipient)).size, likes: own.filter((e) => e.kind === 'like' && e.status === 'confirmed' && e.liked).length } : null,
      arriving: s.slot === 0 ? s.depositPending : !!s.likeFunds?.pending
    };
  };
  const restock = createRestockSheet({
    input: restockInput,
    copyButton: (key, label, text, cls) => copyButton(key, label, text, cls, () => { render(ppp.snapshot()); })
  });

  // The open album's songs, with their artwork and the plays left, in the panel where "Your Station" is.
  const albumListMount = document.getElementById('albumList');
  const albumList = albumListMount ? createAlbumView(albumListMount, albumDeps, { list: true }) : null;
  // The album this device last had open, so a locked page (a reload, a new visit) still opens on it.
  const LAST_ALBUM_KEY = 'xtrata.radio.album.last.v1';
  type LastAlbum = { root: string; slot: number; player: PlayerView };
  const readLastAlbum = (): LastAlbum | null => {
    try {
      const v = JSON.parse(localStorage.getItem(LAST_ALBUM_KEY) || 'null');
      return v && typeof v.root === 'string' && Number.isSafeInteger(v.slot) && v.slot > 0 && v.player && Array.isArray(v.player.tracks) ? v : null;
    } catch { return null; }
  };
  let lastAlbumSaved = '';
  const saveLastAlbum = (a: LastAlbum) => {
    const text = JSON.stringify(a);
    if (text === lastAlbumSaved) return;
    lastAlbumSaved = text;
    try { localStorage.setItem(LAST_ALBUM_KEY, text); } catch { /* a convenience */ }
  };
  /** "Continue listening" on a locked album: once unlocked (on the same passkey), go straight back into that album. */
  let resumeAlbum: LastAlbum | null = null;

  // The radio's heart asks here first: the listening wallet signs the like when it can, for the main wallet.
  // Returns true when it takes the tap (any listener with a listening wallet here): it then toggles the
  // like itself and never opens the main-wallet page.
  (window as any).XtrataRadioLikeHandler = (d: { song: number; likedBy?: string[]; title?: string; artist?: string }) => {
    if (!d || !Number.isSafeInteger(d.song) || d.song < 0) return false;
    // The main listener wallet only matters once they use it: tapping the heart is when its funds come into it.
    if (ppp.snapshot().likeFunds?.album) likeTried = true;
    loadCatalogue();
    const n = songName(d.song, { title: d.title, artist: d.artist });
    return ppp.heart({ song: d.song, title: n.title || undefined, artist: n.artist || undefined, likedBy: Array.isArray(d.likedBy) ? d.likedBy : undefined });
  };

  // Passkey-only listeners have no Stacks wallet: the radio lists their likes under the listening address.
  // Only when the controller says it is running solo; a connected, invited wallet is always the identity.
  let identityShown: string | undefined;
  (window as any).XtrataRadioListeningIdentity = () => { const s = ppp.snapshot(); return s.solo && s.step !== 'off' && s.step !== 'elsewhere' ? s.listening : undefined; };
  const syncIdentity = (s: Snapshot) => {
    const now = (window as any).XtrataRadioListeningIdentity() as string | undefined;
    if (now === identityShown) return;
    identityShown = now;
    void (window as any).XtrataRadio?.refreshLikes?.();
  };

  // ---- albums every player comes loaded with (GET /radio/gift/featured, set by RADIO_FEATURED_PLAYERS) ----
  // They are playlists, not wallets: the listener's own player plays them from its own plays, and each play pays the
  // song's holder as any play does. Opening one hands it to the radio as its own band; the rest of the radio (FM,
  // LIKED, CHAIN) stays one tap away, because nothing is locked.
  let featured: PlayerView[] = [];
  let featuredAsked = 0, featuredKnown = false;
  let featuredOpen: PlayerView | null = null;
  const loadFeatured = (s: Snapshot) => {
    if (featuredKnown || !s.gate?.gifts?.enabled || Date.now() - featuredAsked < 60_000) return;
    featuredAsked = Date.now();
    json('/radio/gift/featured').then((r) => {
      featured = (Array.isArray(r?.players) ? r.players : []).filter((p: any) => p && typeof p.id === 'string' && typeof p.title === 'string' && Array.isArray(p.tracks) && p.tracks.length > 0).slice(0, 6);
      featuredKnown = true;
      if (featured.length) render(ppp.snapshot());
    }).catch(() => { /* asked again in a minute: no albums is not an error */ });
  };
  /** The loaded album the radio should be playing from: only in the listener's own player, never over an album wallet. */
  const featuredFor = (s: Snapshot): PlayerView | null =>
    featuredOpen && s.slot === 0 && !s.gift?.player && ['ready', 'fund', 'loading'].includes(s.step) ? featuredOpen : null;
  const openFeatured = (p: PlayerView | null, play = false) => {
    featuredOpen = p;
    render(ppp.snapshot());
    const first = p && play ? listedTracks(p)[0] : null;
    if (first) (window as any).XtrataRadio?.playToken?.(first.id);
  };

  // ---- the free first song (only with `?novice=preview`) ----
  let preview = newPreview();
  /** The shared album the radio may play right now as a preview, worked out once per render. */
  let previewNow: PlayerView | null = null;
  const readPreview = (s: Snapshot): PlayerView | null => {
    const inc = novice.preview && !inApp && s.step === 'intro' ? gifts.incomingAlbum() : null;
    if (!inc) { preview = stepPreview(preview, { kind: 'withdraw' }); return null; }
    preview = stepPreview(preview, { kind: 'offer', album: inc.player.id, already: previewedAlbums(flagStore).includes(inc.player.id) });
    return previewLive(preview) ? inc.player : null;
  };
  /** Feed the preview what the radio reports; when it ends, remember that on this device and redraw. */
  const advancePreview = (ev: Parameters<typeof stepPreview>[1]) => {
    const before = preview.phase;
    preview = stepPreview(preview, ev);
    if (preview.phase === before) return;
    // Remembered from the moment it starts: a reload part-way through does not start the free song again.
    if (preview.album && (preview.phase === 'playing' || preview.phase === 'done')) markPreviewed(flagStore, preview.album);
    render(ppp.snapshot());
  };
  setInterval(() => { if (preview.phase === 'playing') advancePreview({ kind: 'tick', at: Date.now() }); }, 5000);

  // A gifted wallet's album becomes a band on the radio; when its paid plays run out the radio stops (no free mode).
  let giftPushed = '', stopPushed: string | null | undefined, lockPushed = false, waitPushed = false;
  const syncGift = (raw: Snapshot, s: Snapshot) => {
    const radio = (window as any).XtrataRadio;
    if (!radio?.setGiftPlayer || !radio?.setGiftStop) return; // pushed again at the next render, once the radio is there
    const gs = s.depositPending && raw.step === 'fund' && raw.giftStop?.reason === 'out' ? { reason: 'arriving', text: 'YOUR PLAYS ARE ARRIVING' } : raw.giftStop;
    // The free first song (novice preview): the shared album is handed to the radio before a player exists, and
    // nothing else may play. It is unpaid, once per album per device, and ends by itself (novice.ts, stepPreview).
    const pre = previewNow;
    const said = gs ? (plainFor(raw) ? plainStop(gs.reason as GiftStopReason, gs.text) : gs.text) : null;
    const stop = pre ? null : said ?? (paidHost && (!raw.gate?.here || raw.step === 'off') ? 'PAID RADIO IS UNAVAILABLE' : null);
    if (stop && stop !== stopPushed) { radio.setGiftStop(stop); stopPushed = stop; }
    const p = raw.step === 'off' || raw.step === 'elsewhere' ? null : raw.gift?.player ?? pre ?? featuredFor(raw) ?? null;
    const id = p ? p.id + ':' + p.cover + ':' + p.tracks.map((t) => t.id).join(',') : '';
    if (id !== giftPushed) {
      radio.setGiftPlayer(p ? { id: p.id, title: p.title, subtitle: p.subtitle, tracks: listedTracks(p).map((t) => t.id), hidden: hiddenTrack(p)?.id ?? null, cover: p.cover } : null);
      giftPushed = id;
    }
    // Plays on their way (as the panel sees it): the radio says so, never "out of plays".
    if (stop !== stopPushed) { radio.setGiftStop(stop); stopPushed = stop; }
    // Plays on their way: the radio greys its controls and says so, instead of looking broken.
    const wait = gs?.reason === 'arriving';
    if (wait !== waitPushed) { radio.setGiftWait?.(wait); waitPushed = wait; }
    const lock = !!p && (!!pre || !!raw.albumLock?.locked);
    if (lock !== lockPushed) { radio.setGiftLock?.(lock); lockPushed = lock; }
    // Per-wallet song memory lasts only while this passkey stays unlocked on this page.
    if (['locked', 'intro', 'wrong-wallet', 'unsupported', 'connect', 'not-invited', 'off', 'elsewhere'].includes(raw.step)) radio.forgetWallets?.();
  };

  /** The listener has tapped a heart while an album is open: only then does the main listener wallet's balance matter. */
  let likeTried = false;
  /**
   * A new album wallet that holds nothing yet and has never played, just after it opened: its plays are on their way, not
   * missing. For ARRIVAL_GRACE_MS from the first time it is seen like this it reads as "arriving" (amber), never as
   * "out of plays" (red). Only if nothing has landed after that is it a real problem.
   */
  const firstEmpty = new Map<string, number>();
  const settling = (s: Snapshot): number | null => {
    // Never funded: empty, nothing played from it here, and either unused on-chain or made on this device just now.
    const fresh = s.step === 'fund' && !s.depositPending && !!s.gift && !!s.listening && s.balance === 0n
      && !s.entries.some((e) => e.kind === 'play') && (s.brandNew || s.createdHere);
    if (!fresh) return null;
    let since = firstEmpty.get(s.listening!);
    if (since === undefined) { since = Date.now(); firstEmpty.set(s.listening!, since); }
    return Date.now() - since < ARRIVAL_GRACE_MS ? since : null;
  };
  /** Never-played album wallet, past the grace, still empty: the plays really have not arrived. */
  const neverArrived = (s: Snapshot) => s.step === 'fund' && !s.depositPending && !!s.gift && s.balance === 0n
    && !s.entries.some((e) => e.kind === 'play') && !!s.listening && firstEmpty.has(s.listening);

  const short = (a?: string) => (a ? a.slice(0, 6) + '…' + a.slice(-4) : '');
  /** A balance as plays at today's play cost (after the return reserve). */
  const playsOf = (bal: bigint) => { const c = ppp.snapshot().playCost || 350n; return bal > RESERVE ? Number((bal - RESERVE) / c) : 0; };
  // Balances at a glance: 4 decimals (0.9924 STX); tiny amounts keep all 6 (0.000350).
  const stxShort = (v: bigint) => (Number(v) / 1e6).toFixed(v < 1000n ? 6 : 4);
  const ago = (t: number) => {
    const m = Math.round((Date.now() - t) / 60_000);
    return m < 1 ? 'now' : m < 60 ? `${m}m` : m < 1440 ? `${Math.round(m / 60)}h` : `${Math.round(m / 1440)}d`;
  };
  const explorer = (txid: string) => `https://explorer.hiro.so/txid/${txid}?chain=mainnet`;
  const el = (tag: string, text = '', cls = '') => { const n = document.createElement(tag); if (text) n.textContent = text; if (cls) n.className = cls; return n; };
  const button = (label: string, run: () => void, cls = '') => { const b = el('button', label, cls) as HTMLButtonElement; b.type = 'button'; b.onclick = run; return b; };
  const link = (label: string, href: string) => { const a = el('a', label) as HTMLAnchorElement; a.href = href; a.target = '_blank'; a.rel = 'noopener'; return a; };

  let lastStage: StageView | null = null;
  // radio.xtrata.xyz/radio#give (the homepage's "Send someone a wallet") opens the gift section once it is there.
  let wantGive = location.hash === '#give';
  if (wantGive) history.replaceState(null, '', location.pathname + location.search);
  let walletShown = false; // the listener opened the resting wallet box
  // BNS names (e.g. jim.btc), looked up once per address per page view. A wallet with a name is shown by that
  // name wherever its address would be; without one (or while the lookup runs) the short address stands in.
  const names = createNameCache((address) => resolvePrimaryBnsName({ address, network: 'mainnet' }), () => render(ppp.snapshot()));
  const nameOf = (address?: string) => names.get(address);
  const inApp = inAppBrowser(navigator.userAgent);
  /** "Open in Safari" for a visitor inside an app's built-in browser, carrying a waiting gift code with them. */
  const openElsewhere = (app: string, code: string | null): HTMLElement[] => {
    const ua = navigator.userAgent, browser = browserName(ua);
    const url = `${location.origin}${location.pathname}${code ? `#gift=${code}` : ''}`;
    const out: HTMLElement[] = [el('p', `You are in ${app}'s built-in browser, where passkeys often do not work. Open this page in ${browser} to make your ${novice.on ? 'player' : 'listening wallet'}${code ? (novice.on ? ' and open your gift' : ' and claim your gift') : ''}.`, 'ppp-warn')];
    const row = el('div', '', 'ppp-open-row'); // not .ppp-actions: the panel refills the first element with that class
    const href = openInBrowserHref(url, ua);
    if (href) { const a = el('a', `Open in ${browser}`, 'primary ppp-open-in') as HTMLAnchorElement; a.href = href; a.dataset.homeAction = 'radio:open-in-browser'; row.append(a); }
    row.append(copyButton('copy-page-link', 'Copy link', () => url, href ? '' : 'primary', () => render(ppp.snapshot())));
    out.push(row, el('p', `If that does not open ${browser}, use ${app}'s menu (••• or ⋮) and choose "Open in ${browser === 'your browser' ? 'browser' : browser}", or paste the copied link there.`, 'ppp-mute'));
    return out;
  };
  const who = (address?: string) => nameOf(address) ?? short(address);
  /** Up to two wallets, then "and N more". */
  const whoList = (addresses: string[]) => addresses.slice(0, 2).map(who).join(' and ') + (addresses.length > 2 ? ` and ${addresses.length - 2} more` : '');
  type Shown = Snapshot['entries'][number] & { title?: string; artist?: string };
  // Song names exactly as the radio shows them: its catalogue, then the radio's own title and artist
  // overrides (artist-credits), then what was playing when the entry was made.
  const catalogue = new Map<number, { title?: string; artist?: string }>();
  let catalogueAsked = false;
  const placeholder = (t?: string) => !t || /^(?:Inscription )?#\d+$/.test(t.trim());
  const loadCatalogue = () => {
    if (catalogueAsked) return;
    catalogueAsked = true;
    fetch('/radio/counts?range=all&chainLikes=0', { cache: 'no-store', signal: AbortSignal.timeout(20000) })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        for (const t of Array.isArray(data?.tracks) ? data.tracks : []) {
          const id = Number(t?.id);
          if (Number.isSafeInteger(id)) catalogue.set(id, { title: typeof t.title === 'string' ? t.title : undefined, artist: typeof t.artist === 'string' ? t.artist : undefined });
        }
        render(ppp.snapshot());
      })
      .catch(() => { catalogueAsked = false; /* names fall back to what was stored; try again later */ });
  };
  const songName = (id: number, stored?: { title?: string; artist?: string }) => {
    const c = catalogue.get(id);
    const title = radioTitle(id, [c?.title, stored?.title].find((t) => !placeholder(t)) || '');
    const artist = radioArtist(id, c?.artist || stored?.artist || '');
    return { title, artist };
  };
  const songLabel = (e: Shown) => {
    const { title, artist } = songName(e.song, e);
    return title ? `“${title}”${artist ? ` — ${artist}` : ''}` : `Song #${e.song}${artist ? ` — ${artist}` : ''}`;
  };
  const STATUS_CLASS: Record<string, string> = { confirmed: 'ppp-ok', pending: 'ppp-warn', signed: 'ppp-warn', unknown: 'ppp-warn', prepared: 'ppp-warn', failed: 'ppp-bad', cancelled: 'ppp-mute' };
  const STATUS_TEXT: Record<string, string> = { confirmed: 'confirmed', pending: 'confirming', signed: 'sending', unknown: 'checking', prepared: 'preparing', failed: 'failed', cancelled: 'cancelled' };

  /** One-word state for the header pill, coloured by how things stand. */
  function statePill(s: Snapshot): [string, string] {
    if (['elsewhere', 'connect', 'not-invited', 'unsupported', 'loading'].includes(s.step)) return ['', ''];
    if (s.step === 'wrong-wallet') return ['WRONG WALLET', 'warn'];
    if (s.step === 'over') return ['TOO MUCH', 'bad'];
    if (s.step === 'locked') return ['LOCKED', 'mute'];
    if (s.step === 'intro' || s.step === 'link') return ['', '']; // the SETUP HELPER badge says it
    if (s.step === 'fund') return s.depositPending ? ['ON ITS WAY', 'warn'] : s.entries.length ? ['NO PLAYS', 'bad'] : ['ADD PLAYS', 'warn'];
    return s.payingOn && s.session && s.session.playsLeft > 0 ? ['ON', 'ok'] : ['OFF', 'mute'];
  }

  function fact(label: string, value: string, cls = '', extra?: HTMLElement) {
    const dt = el('dt', label), dd = el('dd', value, cls);
    if (extra) dd.append(' ', extra);
    return [dt, dd];
  }

  // The top bar button: pay-per-play's next step or live state, always in reach. Browsers only allow
  // the passkey from a tap inside the wallet box, so it brings that box into view, ready to tap.
  const top = document.getElementById('ppp-top') as HTMLButtonElement | null;
  const focusPanel = () => {
    const target = frameWrap.hidden || frameWrap.classList.contains('ppp-frame--rest') ? root : frameWrap;
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    root.classList.remove('ppp-flash'); void root.offsetWidth; root.classList.add('ppp-flash');
  };
  /** Straight to the Stacks wallet chooser (Xverse, Leather), skipping the Xtrata Music Wallet pop-up. */
  const connectStacks = () => {
    const direct = (window as any).XtrataRadioConnectStacks as (() => void) | undefined;
    if (direct) direct(); else (document.getElementById('radio-wallet-connect') as HTMLButtonElement | null)?.click();
  };
  /** The next step, from the top bar or a nudge: connect, open the pay-per-play radio, or unlock. */
  const go = () => {
    const s = ppp.snapshot();
    if (s.step === 'connect' || s.step === 'wrong-wallet') { connectStacks(); return; }
    if (s.step === 'elsewhere' && s.gate?.radioUrl) { location.href = s.gate.radioUrl; return; }
    if (s.step === 'locked' && !s.armed && !s.busy) void ppp.unlock();
    if (s.step === 'ready' && s.giftStop?.reason === 'off' && !s.busy) void ppp.switchOn();
    // Out of plays with no Stacks wallet to deposit from: straight to "Add plays".
    if (s.step === 'fund' && s.solo && !s.depositPending && !s.busy) { restock.open(); return; }
    focusPanel();
  };
  if (top) top.onclick = go;

  /**
   * A button that pays from the main wallet. While a linked listening wallet runs on its own (no Stacks wallet
   * connected) there is nothing to pay from yet, so the button connects that wallet first.
   */
  const fromMain = (s: Snapshot, label: string, run: () => void, cls = '') =>
    s.standIn && !s.mainConnected ? button(`Connect ${who(s.standIn)} to add STX`, connectStacks, cls) : button(label, run, cls);
  /** Open the device's listening wallet for `main` without its Stacks wallet, then bring the passkey tap into view. */
  const openLinked = (main: string) => { void ppp.useLinked(main).then(() => focusPanel()); };
  /**
   * The connect pop-up (src/radio-likes/wallet.ts asks for it before opening the Stacks wallet chooser):
   * Xtrata Music Wallet rows first (connect-choice.ts), then Xverse or Leather. Resolves 'stacks' to carry on to the
   * Stacks chooser, 'music' once an Xtrata Music Wallet has been started here, or null if the visitor closed it.
   * Where no Xtrata Music Wallet can be offered it resolves 'stacks' straight away, so nothing changes there.
   */
  let chooserOpen: Promise<'stacks' | 'music' | null> | null = null;
  const chooseConnect = (): Promise<'stacks' | 'music' | null> => {
    const options = musicWalletOptions(ppp.snapshot(), who);
    if (!options.length) return Promise.resolve('stacks');
    if (chooserOpen) return chooserOpen;
    chooserOpen = new Promise((resolve) => {
      const dialog = el('dialog', '', 'ppp-connect') as HTMLDialogElement;
      dialog.setAttribute('aria-labelledby', 'ppp-connect-title');
      let picked: 'stacks' | 'music' | null = null;
      const close = (choice: 'stacks' | 'music' | null) => { picked = choice; dialog.close(); };
      dialog.addEventListener('close', () => { dialog.remove(); chooserOpen = null; resolve(picked); });
      dialog.addEventListener('click', (e) => { if (e.target === dialog) close(null); }); // tap outside the card
      const row = (title: string, detail: string, cls: string, run: () => void, disabled = false) => {
        const b = el('button', '', 'ppp-connect__opt ' + cls) as HTMLButtonElement;
        b.type = 'button'; b.disabled = disabled; b.onclick = run;
        b.append(el('b', title), el('span', detail));
        return b;
      };
      const head = el('h2', 'Connect', 'ppp-connect__title'); head.id = 'ppp-connect-title';
      const rows = options.map((option) => row(option.label, option.detail, 'is-music', () => {
        close('music');
        if (option.action === 'linked' && option.main) { openLinked(option.main); return; }
        // Ask again at the tap: the wallet box may have answered since the pop-up opened.
        const now = musicWalletOptions(ppp.snapshot(), who).find((o) => o.action !== 'linked');
        if (now?.action === 'create') void ppp.create();
        else if (now?.action === 'unlock') void ppp.unlock();
        // The passkey prompt is a tap inside the wallet box, so bring it into view.
        focusPanel();
      }, !!option.disabled));
      const stacks = row('Xverse or Leather', 'A Stacks wallet you already have.', 'is-stacks', () => close('stacks'));
      const cancel = button('Cancel', () => close(null), 'quiet ppp-connect__cancel');
      dialog.append(head, ...rows, stacks, cancel);
      document.body.appendChild(dialog);
      dialog.showModal();
      rows.find((b) => !b.disabled)?.focus();
    });
    return chooserOpen;
  };
  (window as any).XtrataRadioConnectChooser = chooseConnect;
  function renderTop(s: Snapshot) {
    if (!top) return;
    const set = (text: string, tone: string, title: string) => {
      top.hidden = false;
      top.className = 'ppp-top' + (tone ? ' is-' + tone : '');
      top.replaceChildren(el('span', '', 'dot'), document.createTextNode(text));
      top.title = title;
    };
    const left = s.session ? Math.min(s.session.playsLeft, s.playsLeft) : 0;
    switch (s.step) {
      case 'off': case 'not-invited': case 'unsupported': top.hidden = true; return;
      case 'elsewhere': return set('Xtrata Music', 'quiet', 'Open Xtrata Music');
      case 'connect': top.hidden = true; return; // "Connect wallet" sits right beside it
      case 'intro': return set('Set up your player', '', 'Create a passkey listening wallet');
      case 'wrong-wallet': return set(`Connect ${who(s.linked)}`, 'warn', `This device's listening wallet belongs to ${who(s.linked)}. Connect that wallet to pay artists or like songs.`);
      case 'locked': return set('Unlock', '', 'One tap with your face or fingerprint');
      case 'link': return set('Finish setup', 'warn', 'Link the listening wallet to your main wallet');
      case 'fund': return s.depositPending ? set('Plays on their way', 'quiet', 'Plays start by themselves when they land')
        : set(s.entries.some((e) => e.kind === 'play') ? 'No plays left · add plays' : 'Add plays', 'warn', 'Add plays to keep listening');
      case 'over': return set('Too much in your player', 'warn', 'Return the extra to keep counting plays');
      case 'loading': return set('Xtrata Music', 'quiet', 'Checking your player');
      case 'ready':
        return s.payingOn && left > 0 && !s.giftStop
          ? set(`${left.toLocaleString()} plays left`, 'on', 'Every play counts for the song’s owner')
          : set('Plays off · switch on', 'off', 'Plays are switched off');
    }
  }

  // The whole radio dresses for it (public/radio.html): gold trim and a lit ON AIR lamp while it
  // pays artists, drab with small orange nudges while it does not. Pages without the hooks ignore it.
  const nudge = document.getElementById('pppNudge');
  const onair = document.getElementById('onair');
  nudge?.querySelector('button')?.addEventListener('click', () => go());
  const NOT_PAYING: Partial<Record<Snapshot['step'], string>> = {
    connect: 'Connect your wallet to listen',
    intro: 'Set up your player to listen',
    locked: 'Unlock your player to listen',
    'wrong-wallet': 'Switch wallets to listen',
    link: 'Finish setup to listen',
    fund: 'No plays yet',
    over: 'Return the excess to listen',
    ready: 'Music support is paused'
  };
  const NUDGE_ACTION: Partial<Record<Snapshot['step'], string>> = {
    elsewhere: 'Open', connect: 'Connect', 'wrong-wallet': 'Switch wallet', intro: 'Set up', locked: 'Unlock',
    link: 'Finish setup', fund: 'Add plays', over: 'Fix it', ready: 'Switch on'
  };
  function renderMode(s: Snapshot) {
    if (s.step === 'loading') return; // keep the last look while it checks
    const left = s.session ? Math.min(s.session.playsLeft, s.playsLeft) : 0;
    const paying = s.step === 'ready' && s.payingOn && left > 0 && !s.giftStop;
    // Funds already on their way (a deposit or a gift): nothing has gone wrong, so no "artists unpaid" warning.
    const waiting = s.step === 'fund' && s.depositPending;
    // The free player (this page on the main site, where nothing is paid): not a warning, an invitation, so no drab
    // "artists unpaid" look and no orange: the radio keeps its normal look and a friendly note says what this is.
    const free = s.step === 'elsewhere' && !paidHost;
    const warning = paying || waiting || free ? '' : NOT_PAYING[s.step] ?? '';
    const mode = paying ? 'on' : free ? 'free' : warning ? 'off' : '';
    if (mode) document.documentElement.dataset.ppp = mode;
    else delete document.documentElement.dataset.ppp;
    if (onair) {
      onair.hidden = !mode || mode === 'free';
      onair.querySelector('.onair-sub')!.textContent = paying ? `${left.toLocaleString()} plays left` : 'Plays off';
    }
    if (nudge) {
      nudge.hidden = mode !== 'off' && mode !== 'free';
      nudge.classList.toggle('is-free', mode === 'free');
      if (mode === 'free') {
        nudge.querySelector('.nudge-t')!.textContent = 'You’re on the free player';
        nudge.querySelector('.nudge-s')!.textContent = 'This one doesn’t pay anyone. To join the new music economy, where every play pays the artist on-chain, get yourself an album player.';
        nudge.querySelector('button')!.textContent = 'Get a player';
      } else if (mode === 'off') {
        nudge.querySelector('.nudge-t')!.textContent = warning;
        nudge.querySelector('.nudge-s')!.textContent = plainFor(s) ? (s.step === 'intro' ? PLAIN_NUDGE : '') : 'This radio requires a funded listening wallet with music support on.';
        nudge.querySelector('button')!.textContent = NUDGE_ACTION[s.step] ?? 'Start';
      }
    }
  }

  /**
   * Passkey-only: where returns go. Defaults to the address that funded the wallet; this lets the
   * listener name a different one (an exchange funder, a wrong sender, their own wallet). The wallet
   * box shows the full address again and asks for confirmation before anything is sent.
   */
  let pickDraft = ''; // survives the panel re-rendering while the listener types
  function returnPicker(s: Snapshot): HTMLElement {
    const box = el('div', '', 'ppp-pick');
    if (s.funderMultiple && s.returnToKind === 'funder')
      box.append(el('p', 'More than one address has sent funds. Returns go to the first. Choose another below if that is not right.', 'ppp-warn'));
    if (s.returnToKind === 'funder')
      box.append(el('p', 'If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.', 'ppp-mute'));
    const input = el('input') as HTMLInputElement;
    input.type = 'text'; input.placeholder = 'SP… address to send returns to'; input.autocomplete = 'off'; input.spellcheck = false;
    input.setAttribute('aria-label', 'Address to return funds to');
    input.value = pickDraft;
    input.oninput = () => { pickDraft = input.value; };
    const set = button(s.returnToKind === 'chosen' ? 'Change address' : 'Use this address', () => { ppp.setReturnAddress(input.value); pickDraft = ''; }, 'tiny');
    box.append(input, ' ', set);
    if (s.returnToKind === 'chosen') box.append(' ', button('Back to the funder', () => ppp.clearReturnAddress(), 'tiny'));
    return box;
  }
  const WALLET_TIP = 'Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.';
  function walletTip(): HTMLElement {
    const p = el('p', WALLET_TIP + ' ', 'ppp-mute');
    p.append(link('Xverse', 'https://www.xverse.app/download'), ' · ', link('Leather', 'https://leather.io/install-extension'));
    return p;
  }

  // The header's wallet bar says "Wallet not connected / Connect wallet". For a visitor using a passkey
  // listening wallet with no Stacks wallet, that contradicts what they just made, so it is told to say
  // what they have and offer a Stacks wallet as an optional extra (src/radio-likes/wallet.ts).
  // Extensions can inject late, so ask again a few times.
  let headerMark = '';
  const syncHeader = (s: Snapshot) => {
    const root = document.documentElement;
    const mark = s.solo && !s.main ? (s.listening ? short(s.listening) : 'new') : '';
    const installed = hasInstalledStacksWallet() ? '1' : '';
    // A linked listening wallet used without its Stacks wallet: the top bar says whose it is.
    const as = s.standIn && !s.mainConnected ? who(s.standIn) : '';
    if (`${mark}|${installed}|${as}` === headerMark) return;
    headerMark = `${mark}|${installed}|${as}`;
    if (mark) root.dataset.pppSolo = mark; else delete root.dataset.pppSolo;
    if (as) root.dataset.pppAs = as; else delete root.dataset.pppAs;
    if (installed) root.dataset.pppWalletInstalled = installed; else delete root.dataset.pppWalletInstalled;
    window.dispatchEvent(new Event('xtrata:ppp-header'));
  };
  for (const ms of [1500, 4000, 9000]) setTimeout(() => render(ppp.snapshot()), ms);

  /** Add plays to the open album from My player: one tap per amount, greyed out when My player cannot cover it. */
  function topUpAlbumRow(s: Snapshot, cls = ''): HTMLElement {
    const box = el('div', '', 'ppp-topup');
    const mine = myPlays(s);
    box.append(el('span', 'Add plays from My player: ', 'ppp-mute'));
    for (const plays of TOP_UP_PLAYS) {
      const b = button(`+${plays.toLocaleString()}`, () => void ppp.topUpAlbum(plays), cls) as HTMLButtonElement;
      b.disabled = mine === undefined || mine < plays || s.depositPending || !!s.busy;
      box.append(b);
    }
    if (mine !== undefined && mine < TOP_UP_PLAYS[0]) box.append(el('p', 'My player needs plays first (switch to My player above).', 'ppp-mute'));
    return box;
  }
  /** Plays My player (the first wallet) can move into an album: it keeps its reserve and the move's network fee. */
  const myPlays = (s: Snapshot): number | undefined => {
    const bal = s.likeFunds?.balance;
    if (bal === undefined || !s.playCost) return undefined;
    const room = bal - RESERVE - 6_000n;
    return room > 0n ? Number(room / s.playCost) : 0;
  };

  /**
   * An album wallet is open and the main listener wallet that signs likes is empty. That is normal for someone who was
   * sent an album: the album plays without it. So nothing is said until they tap a heart; then a calm amber note with the
   * address, a copy button and (with a main wallet connected) a one-tap top-up. It sits under everything else.
   */
  function likeFundsBanner(s: Snapshot): HTMLElement[] {
    const f = s.likeFunds;
    if (!f || !f.album || (!f.low && !f.pending)) return [];
    if (!f.low) likeTried = false; // funded: the next time it runs dry it waits for a heart again
    if (f.low && !likeTried) return [];
    const box = el('div', '', 'ppp-pick ppp-lowbox');
    if (!f.low) {
      if (!f.txid) return [];
      const p = el('p', 'Top-up for liking songs is on its way. ', 'ppp-warn');
      if (f.txid) p.append(link('View', explorer(f.txid)));
      box.append(p);
      return [box];
    }
    box.append(el('p', '♥ Liking songs needs a little STX', 'ppp-warn ppp-lowtitle'));
    box.append(el('p', 'Your album keeps playing as normal. Likes are signed by your main listener wallet, which is empty right now. 0.1 STX there is hundreds of likes, for all your albums.'));
    box.append(el('p', f.address, 'ppp-addr-full'));
    const row = el('div', '', 'ppp-open-row'); // not .ppp-actions: the panel refills the first element with that class
    row.append(copyButton('copy-likes-address', 'Copy address', () => f.address, 'primary', () => render(ppp.snapshot())));
    if (f.main && !s.solo) {
      const room = TARGET - (f.balance ?? 0n);
      if (room > 0n) row.append(fromMain(s, `Pay ${stx(room)} STX from my wallet`, () => void ppp.topUpLikes(), 'primary'));
    }
    box.append(row);
    box.append(el('p', 'Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.', 'ppp-mute'));
    return [box];
  }

  /**
   * "Something is happening, just wait": a progress bar over the usual minute, then a calm moving bar. Never red,
   * never a warning. The bar and its seconds are kept fresh by `tickArrival` without redrawing the panel.
   */
  const arrivalBar = (a: NonNullable<Snapshot['arrival']>): HTMLElement => {
    const box = el('div', '', 'ppp-wait');
    box.dataset.since = String(a.since);
    box.dataset.grace = String(a.graceMs);
    box.setAttribute('role', 'progressbar');
    box.setAttribute('aria-label', 'Your plays are arriving');
    const text = el('p', '', 'ppp-wait-t'), track = el('div', '', 'ppp-wait-track');
    track.append(el('div', '', 'ppp-wait-fill'));
    box.append(text, track);
    paintArrival(box);
    return box;
  };
  function paintArrival(box: HTMLElement) {
    const since = Number(box.dataset.since), grace = Number(box.dataset.grace) || 60_000;
    const elapsed = Math.max(0, Date.now() - since);
    const fill = box.querySelector('.ppp-wait-fill') as HTMLElement, text = box.querySelector('.ppp-wait-t') as HTMLElement;
    if (elapsed < grace) {
      const left = Math.ceil((grace - elapsed) / 1000);
      fill.style.width = Math.max(4, Math.min(95, (elapsed / grace) * 100)).toFixed(0) + '%';
      text.textContent = `Your plays are arriving… usually about a minute · ${left}s`;
      box.classList.remove('is-long');
      box.setAttribute('aria-valuenow', String(Math.round((elapsed / grace) * 100)));
    } else {
      fill.style.width = '';
      text.textContent = 'Your plays are taking longer than usual to arrive. Still watching for them: keep this page open and it starts by itself.';
      box.classList.add('is-long');
      box.removeAttribute('aria-valuenow');
    }
  }
  // Keeps the countdown moving, and re-reads the state now and then so the wait ends by itself once the plays land.
  let arrivalTicks = 0;
  setInterval(() => {
    const bars = document.querySelectorAll<HTMLElement>('.ppp-wait');
    if (!bars.length) { arrivalTicks = 0; return; }
    bars.forEach(paintArrival);
    if (++arrivalTicks % 10 === 0) render(ppp.snapshot());
  }, 1000);

  /**
   * Phones show one column. While there is something to set up (make or unlock the passkey, link, a gift link waiting)
   * the panel goes to the top, where the tap is. Once there is music (playing, or plays on their way) the player comes
   * first and the panel sits under it. CSS order only (public/radio.html): the wallet box never moves, so never reloads.
   */
  let firstShown: boolean | null = null;
  function syncOrder(s: Snapshot) {
    if (s.step === 'loading' && firstShown !== null) return; // keep the last layout while it checks
    const setup = ['intro', 'locked', 'link', 'connect', 'wrong-wallet', 'unsupported'].includes(s.step);
    const first = setup || !!s.busy || s.armed || (!!gifts.pendingCode() && !['ready', 'fund', 'over'].includes(s.step));
    if (first === firstShown) return;
    firstShown = first;
    if (first) document.documentElement.dataset.pppFirst = '1';
    else delete document.documentElement.dataset.pppFirst;
  }

  function render(raw: Snapshot) {
    // "Continue listening" unlocked the same passkey: go back into the album it had open. Another passkey: stay put.
    if (resumeAlbum && ['ready', 'fund', 'over'].includes(raw.step) && !raw.busy) {
      const back = resumeAlbum;
      resumeAlbum = null;
      if (raw.root === back.root && raw.slot !== back.slot) void ppp.openAlbum(back.slot);
    }
    // A gift being claimed or sent to this wallet is money on its way: the panel and the radio say "on its way",
    // never "no funds · artists unpaid" (which reads as if something went wrong). The gift code sees the real state.
    const giftWait = gifts.inProgress(raw);
    const settleSince = settling(raw);
    const s: Snapshot = giftWait && raw.step === 'fund' ? { ...raw, depositPending: true }
      : settleSince !== null ? { ...raw, depositPending: true, arrival: { since: settleSince, graceMs: ARRIVAL_GRACE_MS } }
      : raw;
    // A like refused only because the main listener wallet is empty is a note, not an error: the album is still playing.
    const softError = s.error === OUT_OF_LIKES;
    syncIdentity(s);
    loadFeatured(raw);
    syncTier(raw);
    previewNow = readPreview(raw);
    syncGift(raw, s);
    syncOrder(s);
    syncHeader(s);
    // The gift banner can start the claim while it draws, and the claim redraws everything as "on its way". Stop here
    // rather than paint this older, not-yet-waiting picture over it.
    if (!giftWait && gifts.inProgress(raw)) return;
    renderTop(s);
    renderMode(s);
    if (paidHost && paidStatus) {
      paidStatus.hidden = !['off', 'elsewhere', 'loading'].includes(s.step);
      paidStatus.textContent = s.step === 'loading' || !s.gate ? (novice.on ? PLAIN_CHECKING : 'Checking your listening wallet…') : novice.on ? 'Xtrata Music is unavailable here. Reload to check again.' : 'Paid radio is unavailable. Reload to check again.';
    }
    root.hidden = s.step === 'off';
    if (root.hidden) { syncWelcome(s, false); return; }
    const [pill, tone] = statePill(s);
    const pillEl = $('.ppp-state');
    pillEl.textContent = pill;
    pillEl.className = 'ppp-state' + (tone ? ' ppp-state--' + tone : '');
    pillEl.hidden = !pill;
    // The wallet box sits right under the current step. It opens while it is asking for a tap
    // (an approval or the one-tap unlock) and otherwise rests closed, with a toggle to look inside.
    const asking = !!s.busy || s.armed;
    // Nothing to look at in a resting box before a wallet exists (or while it loads).
    const showFrame = !['elsewhere', 'connect', 'wrong-wallet', 'not-invited', 'unsupported', 'off'].includes(s.step)
      && (asking || !['intro', 'loading'].includes(s.step));
    frameWrap.hidden = !showFrame;
    frameWrap.classList.toggle('ppp-frame--rest', !asking && !walletShown);
    // The label only shows while the box is open; "Show listening wallet box" lives in the fold.
    const label = $('.ppp-frame-label');
    label.hidden = true; // the wallet box speaks for itself

    // Four steps, shown only during first-time setup. Once set up the panel is one line and a button.
    const stage = stageOf(s) ?? lastStage; // loading keeps the last known stage
    lastStage = stage;
    // Once any wallet on this device has played, a further one (an album) is not first-time setup: no steps.
    const HEARD_KEY = 'xtrata.radio.ppp.heard.v1';
    const deviceHeard = (() => { try { return localStorage.getItem(HEARD_KEY) === '1'; } catch { return false; } })();
    if (!deviceHeard && s.entries.some((e) => e.kind === 'play')) { try { localStorage.setItem(HEARD_KEY, '1'); } catch { /* a convenience */ } }
    const heard = deviceHeard || (s.slot > 0 && ((s.likeFunds?.balance ?? 0n) > 0n || shelf.count() > 1));
    const plain = plainFor(s);
    // Novice mode has no setup track: its steps name things a newcomer does not need (a wallet, 1 STX).
    const setup = !plain && showSteps({ ...s, heard }, stage);
    $('.ppp-badge').hidden = !setup;
    const progress = $('.ppp-steps'), caption = $('.ppp-stage');
    progress.hidden = caption.hidden = !setup;
    if (stage && setup) {
      progress.replaceChildren(...stagesFor(s.solo).map((label, i) => {
        const li = el('li', '', i < stage.at ? 'done' : i === stage.at ? (stage.blocked ? 'now blocked' : 'now') : '');
        li.append(el('span', i < stage.at ? '✓' : String(i + 1), 'n'), label);
        if (i === stage.at) li.setAttribute('aria-current', 'step');
        return li;
      }));
      caption.textContent = stage.caption;
      caption.className = 'ppp-stage ' + (stage.at >= stagesFor(s.solo).length ? 'ppp-ok' : stage.blocked ? 'ppp-bad' : 'ppp-cyan');
    }

    // Labelled facts: who is who, and what the wallet holds.
    const facts = $('.ppp-facts');
    const rows: HTMLElement[] = [];
    if (s.main && s.gate?.here && !s.solo) rows.push(...fact('Your wallet', who(s.main), 'ppp-addr-short'));
    // The listening address is the identity only for a passkey-only listener. For anyone linked to a main
    // wallet it is plumbing (needed to fund it), so it comes after who they are and is labelled as technical.
    const listeningRow = () => {
      if (!s.listening) return;
      const copy = copyButton('copy-listening', 'Copy', () => s.listening || '', 'tiny', () => render(ppp.snapshot()));
      rows.push(...fact(s.slot > 0 ? 'Album wallet' : s.linked ? 'My player (technical)' : 'My player wallet', short(s.listening), 'ppp-addr-short', copy));
    };
    if (!s.linked) listeningRow();
    // Which main wallet this listening wallet serves: its likes and paid plays count for that wallet.
    if (s.listening && s.step !== 'intro') {
      if (s.linked) {
        rows.push(...fact('Credited to', `${who(s.linked)} · plays, likes and returns`, s.linked === s.main || s.solo ? 'ppp-ok' : 'ppp-warn'));
        listeningRow();
      } else if (s.solo) {
        if (s.creditedTo) rows.push(...fact('Credited to', `${who(s.creditedTo)} · plays and likes`, 'ppp-ok'));
        // Passkey-only: returns go back where the money came from, unless the listener chose another address.
        const where = s.gift ? 'to whoever it came from: the unused gift to the sender, your own top-ups to you'
          : s.returnTo
          ? `${who(s.returnTo)} · ${s.returnToKind === 'chosen' ? 'chosen by you' : 'sent the first funds'}`
          : s.funderState === 'failed' ? 'could not check who funded it right now' : 'set when it is funded';
        rows.push(...fact('Returns go to', s.gift ? where : s.returnTo && !nameOf(s.returnTo) ? where.replace(short(s.returnTo), s.returnTo) : where, s.returnTo && !s.gift ? 'ppp-addr-full' : 'ppp-mute'));
      } else rows.push(...fact('Linked to', 'not linked yet', 'ppp-warn'));
    }
    if (s.linkedListening.length && s.gate?.here) {
      const list = s.linkedListening.map((a) => short(a) + (a === s.listening ? ' (this one)' : '')).join(', ');
      rows.push(...fact(s.linkedListening.length === 1 ? 'Listening wallet linked to you' : 'Listening wallets linked to you', list, 'ppp-addr-short'));
    }
    if (s.balance !== undefined && ['fund', 'ready', 'over'].includes(s.step)) {
      const tone = s.step === 'fund' && s.depositPending ? 'ppp-mute' : s.balanceState === 'ok' ? 'ppp-ok' : s.balanceState === 'low' ? 'ppp-warn' : 'ppp-bad';
      rows.push(...fact('Balance', `${stx(s.balance)} STX · about ${s.playsLeft.toLocaleString()} plays`, tone));
    }
    const last = (s.entries as Shown[]).find((e) => e.kind === 'play');
    if (last) loadCatalogue();
    if (last) rows.push(...fact('Last paid song', `${songLabel(last)} → ${who(last.recipient)}`, STATUS_CLASS[last.status] || ''));
    facts.replaceChildren(...rows);
    facts.hidden = !rows.length;

    // `key`: the one or two lines a newcomer needs now, shown at the top. `lines`: everything else,
    // folded under "More about this step".
    const key: HTMLElement[] = [];
    const lines: HTMLElement[] = [];
    const actions: HTMLElement[] = [];
    const more: HTMLElement[] = []; // quieter buttons, in the fold
    const cost = costPerPlay(BigInt(s.gate?.limits.playFee ?? '300'));
    const payLine = `After 30 seconds of audible listening (half the length for songs under a minute), an eligible play sends ${stx(HOLDER_PAYMENT)} STX to the song holder, plus a ${stx(cost - HOLDER_PAYMENT)} STX network fee.`;
    const busy = !!s.busy;

    switch (s.step) {
      case 'elsewhere': {
        key.push(el('p', 'Pay artists as you listen.'));
        if (s.gate?.radioUrl) { const p = el('p'); p.append(link('Open the pay-per-play radio →', s.gate.radioUrl)); key.push(p); }
        lines.push(el('p', 'Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet.'));
        break;
      }
      case 'connect':
        if (s.linked) {
          // This device has a listening wallet for a Stacks wallet: connect it to keep paying. Any other wallet gets its own.
          const mine = [s.linked, ...s.others];
          key.push(el('p', mine.length > 1
            ? `This device has listening wallets for ${whoList(mine)}.`
            : `This device has a listening wallet for ${who(s.linked)}.`));
          lines.push(el('p', 'Open it with your passkey, or connect a different Stacks wallet to set up a separate player.'));
          mine.slice(0, 3).forEach((m, i) => actions.push(button(`Open ${who(m)}`, () => openLinked(m), i === 0 ? 'primary' : '')));
        } else {
          key.push(el('p', 'Connect your wallet to pay artists as you listen.'));
          lines.push(el('p', 'Every payment is recorded on-chain.'));
        }
        break;
      case 'wrong-wallet':
        // Only with a wallet box older than one-listening-wallet-per-address (it cannot offer this address its own).
        key.push(el('p', `This device's listening wallet belongs to ${who(s.linked)}. Connect that wallet to pay artists or like songs.`, 'ppp-warn'));
        lines.push(el('p', `You are connected as ${who(s.main)}. Switch to the linked wallet to continue listening.`));
        lines.push(el('p', 'The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.', 'ppp-mute'));
        actions.push(button('Switch wallet', connectStacks, 'primary'));
        break;
      case 'not-invited':
        key.push(el('p', 'Paid radio access is unavailable for this wallet.', 'ppp-mute'));
        break;
      case 'unsupported':
        key.push(el('p', 'Needs a passkey this browser cannot make. Try Chrome or Safari.', 'ppp-warn'));
        break;
      case 'intro':
        key.push(el('p', 'Every play counts for the song’s owner, on-chain.'));
        lines.push(el('p', payLine));
        lines.push(el('p', 'Once your wallet is funded and music support is on, eligible plays pay automatically.', 'ppp-ok'));
        lines.push(el('p', s.solo
          ? 'You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it.'
          : 'You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.', 'ppp-warn'));
        // Two clear doors for a visitor with no wallet connected: a new passkey-only wallet, or their Stacks wallet.
        // One listening wallet per wallet address. If this device already has one for another address, say so first:
        // a mistake (wrong wallet connected) is one tap away, and otherwise this address is set up as a new account.
        if (!s.solo && s.main && s.others.length) {
          key.push(el('p', `This device already has a listening wallet for ${whoList(s.others)}. If you meant to use that one, switch to that wallet.`, 'ppp-warn'));
          lines.push(el('p', `Otherwise, set up a new listening wallet for ${who(s.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`));
        } else if (!s.solo && s.main) lines.push(el('p', `This is the listening wallet for ${who(s.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, 'ppp-mute'));
        if (s.solo) lines.push(el('p', 'Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.', 'ppp-mute'));
        // A live gift link is for a brand-new wallet, so claiming it leads. Someone who already has a listening
        // wallet (e.g. synced from another device) can still unlock it, or put the gift aside for now.
        const gift = gifts.liveGift();
        actions.push(button(gift ? 'Claim my gift · no wallet needed' : s.solo ? 'Start listening · no wallet needed' : s.others.length && s.main ? `Set up for ${who(s.main)}` : 'Start listening', () => void ppp.create(), 'primary'));
        if (!gift && !s.solo && s.main && s.others.length) actions.push(button('Switch wallet', connectStacks));
        if (!gift && s.solo) actions.push(button('I have a Stacks wallet', connectStacks));
        actions.push(button('I already have a listening wallet', () => void ppp.unlock(true)));
        if (gift) actions.push(button('Not now', () => gifts.setAside(), 'quiet'));
        break;
      case 'locked':
        if (s.armed) {
          // The unlock confirm is already open in the frame: one tap there goes straight to the passkey.
          // The unlock is waiting in the wallet box right below: nothing to read.
        } else {
          key.push(el('p', 'Locked.', 'ppp-mute'));
          actions.push(button('Unlock', () => void ppp.unlock(), 'primary'));
        }
        // Standing in for a Stacks wallet: another of the device's wallets is picked from the connect pop-up (by name).
        if (s.standIn) more.push(button('Use a different listening wallet', () => void chooseConnect().then((c) => { if (c === 'stacks') connectStacks(); }), 'quiet'));
        else more.push(button('Use a different listening wallet', () => void ppp.unlock(true), 'quiet'));
        break;
      case 'link':
        key.push(el('p', `Link to ${who(s.main)} · free`));
        lines.push(el('p', 'Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.'));
        lines.push(el('p', 'The listening wallet will show the full address. Check it is yours before confirming.', 'ppp-warn'));
        actions.push(button(s.serverLinked ? 'Confirm my wallet' : 'Link to my wallet', () => void ppp.link(), 'primary'));
        break;
      case 'loading':
        key.push(el('p', 'Checking the listening wallet balance…', 'ppp-mute'));
        break;
      case 'fund': {
        if (s.depositPending) { if (s.arrival) key.push(arrivalBar(s.arrival)); /* the "on their way" line below says the rest */ }
        else if (neverArrived(s)) key.push(el('p', 'Your plays have not arrived yet. Keep this page open: they start by themselves when they land. If nothing happens in a few minutes, open your album link again.', 'ppp-bad'));
        else if (s.gift?.player) key.push(el('p', 'Out of plays · add more to keep listening', 'ppp-bad'));
        else if (s.entries.length) key.push(el('p', 'No plays left · add plays to keep counting', 'ppp-bad'));
        else key.push(el('p', `Add plays · 1 STX ≈ ${Math.floor(Number(1_000_000n / cost)).toLocaleString()} plays`));
        if (s.entries.length) lines.push(el('p', 'Playback is paused until your top-up confirms.'));
        if (s.payingOn && !s.entries.length) lines.push(el('p', 'Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.', 'ppp-ok'));
        if (giftWait) lines.push(el('p', 'Your gift is on its way, so there is nothing to add. STX is only needed once these plays are used up.', 'ppp-mute'));
        else if (s.depositPending) lines.push(el('p', 'Nothing to add: your plays are on their way. Add STX only once they are used up.', 'ppp-mute'));
        else if (s.solo) {
          // No wallet to deposit from: the address is the whole interface. Anyone can send to it.
          lines.push(el('p', 'Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.'));
          lines.push(el('p', s.listening || '', 'ppp-addr-full'));
          if (s.listening && !s.depositPending) actions.push(copyButton('copy-address', 'Copy my address', () => s.listening || '', 'primary', () => render(ppp.snapshot())));
        } else lines.push(el('p', `Or send STX from an exchange to the listening wallet address (Copy above).`, 'ppp-mute'));
        if (s.depositPending && s.depositTxid) { const p = el('p', 'Funds on their way · paying starts by itself when they land. ', 'ppp-warn'); p.append(link('View', explorer(s.depositTxid))); key.push(p); }
        // No deposit button while plays (a gift, or a deposit) are on their way: a button that cannot be pressed only confuses, so there is none.
        else if (s.allowance > 0n && !s.solo && !s.depositPending) actions.push(fromMain(s, `Deposit ${stx(s.allowance)} STX from my wallet`, () => void ppp.deposit(), 'primary'));
        break;
      }
      case 'over':
        key.push(el('p', 'Over 1 STX · return the excess to keep paying', 'ppp-bad'));
        if (s.solo && !s.returnTo) {
          key.push(el('p', s.funderState === 'failed' ? 'Could not check who funded this wallet. Enter an address to send the excess to.' : 'Enter an address to send the excess to.'));
          key.push(returnPicker(s));
        }
        if (!s.solo || s.returnTo) actions.push(button('Return excess', () => void ppp.returnFunds('excess'), 'primary'), button('Return all', () => void ppp.returnFunds('all')));
        break;
      case 'ready':
        if (s.payingOn && s.session && s.session.playsLeft > 0 && s.giftStop?.reason !== 'off') {
          // Whichever runs out first: the approval or the balance. A new approval brings the same figures back.
          const left = Math.min(s.session.playsLeft, s.playsLeft);
          key.push(el('p', `${left.toLocaleString()} plays left`, 'ppp-ok'));
          lines.push(el('p', payLine + ' The heart likes or unlikes from this wallet for 0.0002 STX.'));
          actions.push(button('Switch off', () => void ppp.switchOff()));
        } else {
          key.push(el('p', 'Switch on music support to listen.', 'ppp-mute'));
          actions.push(button('Switch plays on', () => void ppp.switchOn(), 'primary'));
        }
        if (s.queued) key.push(el('p', s.queued === 1 ? '1 song waiting to be paid · sends as soon as the last transaction confirms' : `${s.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, 'ppp-warn'));
        if (s.balanceState === 'low') key.push(el('p', 'Running low on plays', 'ppp-warn'));
        if (s.depositPending) key.push(el('p', 'Plays on their way…', 'ppp-warn'));
        else if (s.allowance > 0n && s.balanceState !== 'ok' && !s.solo) actions.push(fromMain(s, `Top up ${stx(s.allowance)} STX`, () => void ppp.deposit()));
        break;
    }
    // A passkey-only listener has no wallet to deposit from: "Add plays" is the way to restock, at every stage.
    if (s.solo && s.listening && !s.depositPending) {
      const playedOut = s.step === 'fund';
      const low = s.step === 'ready' && (s.balanceState === 'low' || (!!s.gift && s.giftPlays <= 20));
      if (playedOut) actions.unshift(button('Add plays', () => restock.open(), 'primary'));
      else if (low) actions.push(button('Add plays', () => restock.open(), 'primary'));
      else if (s.step === 'ready') more.push(button('Add plays', () => restock.open(), 'quiet'));
    }
    if (s.solo && s.walletCannotSolo)
      lines.push(el('p', 'The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.', 'ppp-warn'));
    if (s.solo && ['fund', 'ready'].includes(s.step)) {
      if ((s.balance ?? 0n) > 0n && s.slot === 0) lines.push(returnPicker(s));
      lines.push(walletTip());
      // Once a paid play has landed, a single quiet pointer outside the fold. Never a blocker.
      if (s.slot === 0 && s.step === 'ready' && (s.entries as Shown[]).some((e) => e.kind === 'play' && e.status === 'confirmed')) {
        const tip = el('p', 'New to Stacks? ', 'ppp-mute');
        tip.append(link('Get Xverse or Leather', 'https://www.xverse.app/download'), ' (free) to keep your plays and likes under a wallet of your own.');
        key.push(tip);
      }
    }
    if (s.walletOutdated)
      lines.push(el('p', 'The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.', 'ppp-warn'));
    if (s.stuck) {
      key.push(el('p', s.stuck === 1 ? '1 payment has not appeared on-chain after 30 minutes.' : `${s.stuck} payments have not appeared on-chain after 30 minutes.`, 'ppp-warn'));
      actions.push(button('Clear stuck payments', () => void ppp.clearStuck()));
    }
    // Quieter actions live in the "Wallet & history" fold.
    if (['ready', 'fund'].includes(s.step) && (s.returnTo || s.gift) && (s.balance ?? 0n) > 0n)
      more.push(button(s.linked ? 'Return all to my wallet' : s.gift ? 'Return what is left…' : `Return all to ${who(s.returnTo)}`, () => void ppp.returnFunds('all'), 'quiet'));
    if (s.slot > 0 && s.gift?.player && ['ready', 'fund'].includes(s.step) && s.giftPlays > 20) more.push(topUpAlbumRow(s, 'quiet'));
    if (['ready', 'fund', 'link', 'over'].includes(s.step)) more.push(button('Lock', () => void ppp.lock(), 'quiet'));
    if (showFrame && !asking) more.push(button(walletShown ? 'Hide listening wallet box' : 'Show listening wallet box', () => { walletShown = !walletShown; render(ppp.snapshot()); }, 'quiet'));

    [...actions, ...more].forEach((a) => ((a as HTMLButtonElement).disabled = busy));
    // While the wallet box is asking for a tap it is the only thing to press: page buttons step aside.
    if (busy) actions.length = 0;
    // The balance is the one wallet detail a listener needs at a glance: on the same line once set up.
    if (!plain && s.balance !== undefined && ['fund', 'ready', 'over'].includes(s.step) && !(s.step === 'fund' && s.depositPending && s.balance === 0n) && !s.gift?.player) {
      const tone = s.balanceState === 'ok' ? 'ppp-ok' : s.balanceState === 'low' ? 'ppp-warn' : 'ppp-bad';
      const first = key.at(0);
      if (s.step === 'ready' && first) first.append(el('span', ` · ${stxShort(s.balance)} STX`, tone));
      else key.push(el('p', `Balance ${stxShort(s.balance)} STX`, tone));
    }
    // Novice mode: the main path (the lines and buttons outside the folds) never says STX, wallet, address, seed or
    // sign. Nothing is removed: a line or button that does is moved into its fold ("How plays work", "This device").
    if (plain) {
      for (const a of [...actions, ...more]) { const t = PLAIN_LABEL[a.textContent ?? '']; if (t) a.textContent = t; }
      for (let i = key.length - 1; i >= 0; i--) if (hasBannedWord(key[i].textContent)) lines.unshift(...key.splice(i, 1));
      for (let i = actions.length - 1; i >= 0; i--) if (hasBannedWord(actions[i].textContent)) more.unshift(...actions.splice(i, 1));
      const played = s.entries.some((e) => e.kind === 'play');
      const said = plainLines(s.step, { played, arriving: s.depositPending });
      if (said.length && key.length) said.shift(); // the classic line that stayed already says where things stand
      key.push(...said.map((t) => el('p', t, 'ppp-mute')));
    }
    // Gift edition: the interface speaks in plays, not STX. Whatever the radio is doing, the meter says how many are left.
    if (s.gift?.player && ['fund', 'ready', 'over', 'locked', 'link', 'loading'].includes(s.step)) {
      const head = el('p', '', 'ppp-gift');
      head.append(`💿 Album · ${s.gift.player.title}`);
      if (s.gift.player.subtitle) head.append(' · ', s.gift.player.subtitle);
      const meter = ['ready', 'fund', 'over'].includes(s.step) && s.balance !== undefined
        ? s.giftPlays === 0 && s.depositPending ? el('span', ' · plays on their way', 'ppp-warn')
        : el('span', s.giftPlays === 0 ? ' · no plays left' : ` · ${s.giftPlays.toLocaleString()} ${s.giftPlays === 1 ? 'play' : 'plays'} left`, s.giftPlays === 0 ? 'ppp-bad' : s.giftPlays <= 20 ? 'ppp-warn' : 'ppp-ok')
        : null;
      if (meter) head.append(meter);
      // The STX line the ordinary panel adds is replaced by the meter above.
      const stxSpan = key.at(0)?.querySelector(':scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad');
      if (s.step === 'ready' && stxSpan && /STX/.test(stxSpan.textContent ?? '')) stxSpan.remove();
      key.unshift(head);
      // Running out is the moment a wallet of their own helps; quiet, never in the way, never a popup.
      if (s.giftPlays <= 20 && ['ready', 'fund'].includes(s.step) && !s.depositPending) {
        if (s.slot > 0) {
          key.splice(1, 0, el('p', s.giftPlays === 0 ? 'This album is out of plays.' : 'Running low on plays for this album.', 'ppp-mute'), topUpAlbumRow(s, 'primary'));
        } else {
        const tip = el('p', s.giftPlays === 0 ? 'Your gift plays are all used. ' : 'Running low. ', 'ppp-mute');
        tip.append('To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. ');
        tip.append(link('Xverse', 'https://www.xverse.app/download'), ' and ', link('Leather', 'https://leather.io/install-extension'), ' are free and make it one tap.');
        key.splice(1, 0, tip);
        }
      }
    }
    // A gifted wallet returns each part to whoever it came from: show the split before anything is sent.
    if (s.gift && !s.linked && ['fund', 'ready', 'over'].includes(s.step) && s.returnPlan.state === 'ready') {
      const plan = s.returnPlan;
      const box = el('div', '', 'ppp-pick');
      box.append(el('p', plan.steps.length > 1 ? 'This goes back in parts, each to whoever it came from:' : 'This goes back to whoever it came from:', 'ppp-cyan'));
      const list = el('ul', '', 'ppp-gift-list');
      plan.steps.forEach((x, i) => {
        const what = x.kind === 'gift' ? 'the unused gift' : x.kind === 'deposit' ? 'what was added to it' : 'the rest';
        const li = el('li');
        li.append(el('span', `${i + 1}. ${stx(BigInt(x.send))} STX · ${what}`, 't'), el('span', x.to ? ` → ${who(x.to)}` : ' → choose an address below', x.to ? 'ppp-mute' : 'ppp-warn'));
        list.append(li);
      });
      box.append(list);
      if (plan.kept) box.append(el('p', 'A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.', 'ppp-mute'));
      if (plan.steps.some((x) => !x.to)) box.append(returnPicker(s));
      box.append(button(plan.steps.length > 1 ? `Confirm part 1 of ${plan.steps.length}` : 'Confirm and return', () => void ppp.returnFunds('all'), 'primary'));
      key.push(box);
    }
    // Album First: a listener with an album (arriving by link, open, or the one this device had open) sees the album
    // view; this panel stays underneath, reached from its "More" and "My music" sheets.
    const albumNow = albumState(s);
    const album = albumPage ? albumNow : null;
    // A gift link in play goes first: it is why this visitor is here. In the album view only its progress shows.
    // Novice screens are decided here, before the gift lines are drawn: on the gift and arriving screens only the
    // gift's progress (the human check, "sending…", real errors) is wanted, as on the album view.
    const wMode = welcomeMode(s, !!album);
    const giftScreen = wMode === 'gift' || wMode === 'arriving' || wMode === 'new';
    const giftLines = gifts.banner(raw, { bare: !!album || wMode === 'gift' || wMode === 'arriving' });
    const elsewhereLines = inApp && (gifts.pendingCode() || ['intro', 'locked', 'unsupported'].includes(s.step)) ? openElsewhere(inApp, gifts.pendingCode()) : [];
    if (!album) {
      key.unshift(...giftLines);
      // Anything about the main listener wallet goes last: the album is what matters here.
      key.push(...likeFundsBanner(s));
      // Inside an app's own browser (Instagram, X, ...) passkeys often fail: before anything else, offer the real one.
      key.unshift(...elsewhereLines);
    }
    // A passkey synced to this device opened someone's existing wallet: say whose, first.
    if (s.solo && s.creditedTo && s.listening && !['intro', 'off', 'elsewhere', 'loading'].includes(s.step))
      key.unshift(el('p', `This is ${who(s.creditedTo)}'s listening wallet. Plays and likes count for ${who(s.creditedTo)}. Connect it (top right) to see its likes here too.`, 'ppp-ok'));
    $('.ppp-key').replaceChildren(...key);
    // The two places a listener can be: the open-world player (wallet 0), and the album that is open (or was last). Every
    // other album is picked from "My albums", which then takes the second tab's place.
    const switcher = document.querySelector('.ppp-switch') as HTMLElement | null;
    if (switcher) {
      const latestAlbum = shelf.latest();
      const inAlbum = s.slot > 0;
      const show = ['fund', 'ready', 'over'].includes(s.step) && (inAlbum || !!latestAlbum);
      switcher.hidden = !show;
      if (show) {
        const tab = (title: string, bal: bigint | undefined, active: boolean, run: () => void) => {
          const b = button('', run, 'ppp-tab') as HTMLButtonElement;
          b.setAttribute('aria-pressed', String(active));
          b.append(el('span', title, 'tt'), el('span', bal === undefined ? '…' : `${playsOf(bal).toLocaleString()} plays`, 'ts'));
          b.disabled = !!s.busy;
          return b;
        };
        const albumTitle = inAlbum ? s.gift?.player?.title ?? 'Album' : latestAlbum!.title;
        // "View all albums" opens the "My albums" fold: every album on this device, one tap to open.
        const all = button('View all albums' + (shelf.count() > 1 ? ` (${shelf.count()})` : ''), () => {
          const fold = document.querySelector('.ppp-shelf') as HTMLDetailsElement | null;
          if (!fold) return;
          fold.hidden = false;
          fold.open = !fold.open; // the button is the toggle: the list opens right under it
          all.setAttribute('aria-expanded', String(fold.open));
          if (fold.open) requestAnimationFrame(() => fold.scrollIntoView({ block: 'nearest', behavior: 'smooth' }));
        }, 'ppp-all-albums');
        all.setAttribute('aria-expanded', String(!!(document.querySelector('.ppp-shelf') as HTMLDetailsElement | null)?.open));
        switcher.replaceChildren(
          tab('🎧 My player', inAlbum ? s.likeFunds?.balance : s.balance, !inAlbum, () => { if (inAlbum) void ppp.openAlbum(0); }),
          tab('💿 ' + albumTitle, inAlbum ? s.balance : undefined, inAlbum, () => { if (!inAlbum && latestAlbum) void ppp.openAlbum(latestAlbum.slot); }),
          all
        );
      }
    }
    const shelfBox = shelf.render(s);
    const shelfFold = document.querySelector('.ppp-shelf') as HTMLDetailsElement | null;
    if (shelfFold) {
      shelfFold.hidden = !shelfBox;
      const shelfSummary = shelfFold.querySelector('summary');
      if (shelfSummary) shelfSummary.textContent = shelf.count() > 0 ? `♪ My albums (${shelf.count()})` : '♪ My albums';
      const shelfBody = shelfFold.querySelector('.ppp-shelf-body');
      if (shelfBox && shelfBody && !shelfBody.contains(shelfBox)) shelfBody.replaceChildren(shelfBox);
    }
    const giftFold = gifts.renderFold(raw);
    $('.ppp-gifts').hidden = !giftFold;
    if (giftFold && !$('.ppp-gift-body').contains(giftFold)) $('.ppp-gift-body').replaceChildren(giftFold);
    if (giftFold && wantGive) {
      wantGive = false;
      const fold = $('.ppp-gifts') as HTMLDetailsElement;
      fold.open = true;
      requestAnimationFrame(() => fold.scrollIntoView({ block: 'center', behavior: 'smooth' }));
    }
    // The albums this player comes loaded with: one tap plays one, another tap goes back to the radio.
    const feat = document.querySelector('#ppp .ppp-featured') as HTMLElement | null;
    if (feat) {
      const show = featured.length > 0 && s.slot === 0 && !s.gift?.player && s.step === 'ready';
      feat.hidden = !show;
      if (show) {
        feat.replaceChildren(el('p', 'Albums in your player', 'ppp-featured__h'), ...featured.map((p) => {
          const on = featuredOpen?.id === p.id;
          const b = button('', () => openFeatured(on ? null : p, !on), 'ppp-featured__a' + (on ? ' is-on' : '')) as HTMLButtonElement;
          const n = listedTracks(p).length;
          b.append(el('b', p.title), el('span', on ? 'Playing now · tap to go back to the radio' : `${p.subtitle ? p.subtitle + ' · ' : ''}${n} ${n === 1 ? 'song' : 'songs'}`));
          b.setAttribute('aria-pressed', String(on));
          b.disabled = !!s.busy;
          return b;
        }));
      }
    }
    // "Make it yours": found, not pushed. Each item is closed until the listener opens it. Only for a passkey-only
    // listener whose player is open; a player already linked to a Stacks wallet has done this.
    const yours = document.querySelector('#ppp .ppp-yours') as HTMLDetailsElement | null;
    if (yours) {
      const show = s.solo && !!s.listening && s.slot === 0 && ['fund', 'ready'].includes(s.step);
      yours.hidden = !show;
      const body = yours.querySelector('.ppp-yours-body');
      if (show && body && body.getAttribute('data-for') !== s.listening) {
        body.setAttribute('data-for', s.listening!);
        const item = (title: string, ...kids: (HTMLElement | string)[]) => { const d = el('details', '', 'ppp-yours-item'); d.append(el('summary', title), ...kids); return d; };
        const name = el('p', 'Your player is a real account on Stacks, the network built on Bitcoin that Xtrata runs on. Right now it is known by a long code. A ');
        name.append(el('b', '.btc name'), ' (for example yourname.btc) is a name you own on that network. Give your player one and your plays, likes and station show under that name everywhere on Xtrata.');
        const how = el('p', 'Names are registered at BNS One. You need a little STX and a Stacks wallet to buy one; then send the name to your player using the code below.', 'ppp-mute');
        const go = el('p'); go.append(link('Find a name at BNS One →', 'https://bns.one'));
        const linkUp = el('p', 'Already have a Stacks wallet with a name (Xverse or Leather)? Connect it (top right) and link this player to it. The player stays on this device and keeps its plays; everything it does is then credited to your name, like a second device on one account.');
        const friend = el('p', 'Know someone who loves music? When there is a giveaway on, send them the page and they can claim a free player of their own.');
        const fl = el('p'); fl.append(link('See the giveaway →', 'https://xtrata.xyz/giveaway'));
        body.replaceChildren(
          item('Give your player a name', name, how, el('p', s.listening!, 'ppp-addr-full'), copyButton('copy-yours-address', 'Copy my player’s code', () => ppp.snapshot().listening || '', 'tiny', () => render(ppp.snapshot())), go),
          item('Link it to a wallet you already have', linkUp),
          item('Bring a friend in', friend, fl));
      }
    }
    $('.ppp-body').replaceChildren(...lines);
    $('.ppp-actions').replaceChildren(...actions);
    $('.ppp-actions2').replaceChildren(...more);
    // Say it once: a message that repeats the line already shown stays quiet.
    const msg = s.busy || s.message || '';
    const msgEl = $('.ppp-msg');
    const shownMsg = msg && key.some((k) => (k.textContent ?? '').startsWith(msg.replace(/[.✓\s]+$/, ''))) ? '' : msg;
    // A check that has not answered yet is an amber "still trying", never an error, and only when nothing else is said.
    const notice = !shownMsg && !s.error ? s.notice : softError && !shownMsg ? s.error : '';
    msgEl.textContent = shownMsg || notice;
    msgEl.classList.toggle('is-warn', !!notice);
    $('.ppp-err').textContent = softError ? '' : s.error;

    // Three small folds: recently played (with the full log inside), wallet, how it works.
    const plays = (s.entries as Shown[]).filter((e) => e.kind === 'play');
    $('.ppp-recent').hidden = !s.entries.length;
    $('.ppp-recent-list').replaceChildren(...plays.slice(0, 5).map((e) => {
      const li = el('li');
      const tone = e.status === 'confirmed' ? 'ok' : e.status === 'failed' ? 'bad' : 'warn';
      li.append(el('span', '', 'd ' + tone), el('span', songLabel(e), 't'), el('span', ago(e.created), 'ppp-mute'));
      if (e.txid) li.append(link('tx', explorer(e.txid)));
      return li;
    }));
    $('.ppp-wallets').hidden = !(facts.childElementCount || more.length);
    $('.ppp-more').hidden = !lines.length;
    const history = $('.ppp-history');
    history.hidden = !s.entries.length;
    if (s.entries.length) loadCatalogue();
    history.replaceChildren(el('summary', `All activity (${s.entries.length})`), ...(s.entries as Shown[]).slice(0, 20).map((e) => {
      const row = el('div', '', 'ppp-row');
      const what = e.kind === 'play'
        ? [el('span', songLabel(e), 'ppp-song'), el('span', ` · ${stx(BigInt(e.amount))} STX to ${who(e.recipient)}`, 'ppp-mute')]
        : e.kind === 'like'
          ? [el('span', `${e.liked ? '♥ Liked' : 'Unliked'} ${songLabel(e)}`, 'ppp-song'), el('span', ` · for ${s.linked ? who(s.linked) : 'this listening wallet'}`, 'ppp-mute')]
          : [el('span', `Returned ${stx(BigInt(e.amount))} STX`, 'ppp-song'), el('span', ` to ${who(e.recipient)}`, 'ppp-mute')];
      row.append(el('span', STATUS_TEXT[e.status] || e.status, 'ppp-status ' + (STATUS_CLASS[e.status] || '')), ...what,
        el('span', ` · ${new Date(e.created).toLocaleString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} `, 'ppp-mute'));
      if (e.txid) row.append(link('tx ↗', explorer(e.txid)));
      return row;
    }));
    albumView?.render(album ? albumInput(s, album, [...elsewhereLines, ...giftLines]) : null);
    syncWelcome(s, !!album, giftScreen ? [...elsewhereLines, ...giftLines] : elsewhereLines, wMode);
    if (restock.isOpen()) restock.refresh();
    syncFind();
    // A loaded album's songs stand in for "Your Station" too, counted against the player's own plays.
    const loaded = albumNow?.mode === 'open' ? null : featuredFor(s);
    albumList?.render(albumNow?.mode === 'open' ? albumInput(s, albumNow, [])
      : loaded ? { ...albumInput(s, { mode: 'open', player: loaded }, []), plays: s.balance === undefined ? null : s.playsLeft } : null);
  }

  type AlbumState = { mode: 'arrive' | 'locked' | 'open'; player: PlayerView; from?: string | null; offered?: number };
  /** Which album view, if any: the open album wallet, a gift link with an album, or the album this device had open. */
  function albumState(s: Snapshot): AlbumState | null {
    if (['off', 'elsewhere', 'not-invited'].includes(s.step)) return null;
    if (s.slot > 0 && s.gift?.player && ['fund', 'ready', 'over', 'link', 'loading'].includes(s.step)) {
      if (s.root) saveLastAlbum({ root: s.root, slot: s.slot, player: s.gift.player });
      return { mode: 'open', player: s.gift.player };
    }
    const incoming = gifts.incomingAlbum();
    if (incoming) return { mode: 'arrive', player: incoming.player, from: incoming.from, offered: incoming.plays };
    const last = readLastAlbum();
    if (last && (s.step === 'locked' || (resumeAlbum && s.step === 'loading'))) return { mode: 'locked', player: last.player };
    return null;
  }

  function albumInput(s: Snapshot, a: AlbumState, lines: HTMLElement[]): AlbumInput {
    const asking = !!s.busy || s.armed;
    const status: HTMLElement[] = [...lines];
    // Plays on their way: a countdown that says "just wait", calm amber, never an error.
    if (s.depositPending && s.arrival) status.push(arrivalBar(s.arrival));
    if (s.error) status.push(el('p', s.error, s.error === OUT_OF_LIKES ? 'ppp-warn' : 'ppp-bad'));
    else if (s.message && !asking) status.push(el('p', s.message, 'ppp-cyan'));
    else if (s.notice) status.push(el('p', s.notice, 'ppp-warn'));
    if (a.mode === 'open' && likeTried && s.likeFunds?.album && s.likeFunds.low && !s.likeFunds.pending)
      status.push(el('p', 'Likes are paused: My player needs a few plays to sign them.', 'ppp-warn'));
    let hint = 'Kept on this device with Face ID or your passkey. No app or account needed.';
    let primary: AlbumInput['primary'] = null, secondary: AlbumInput['secondary'] = null;
    if (a.mode === 'locked') {
      primary = { label: 'Continue listening', run: () => { resumeAlbum = readLastAlbum(); void ppp.unlock(); } };
      secondary = { label: 'Use a different passkey', run: () => { resumeAlbum = null; void ppp.unlock(true); } };
    } else if (a.mode === 'arrive') {
      if (s.step === 'intro' && previewLive(preview) && preview.album === a.player.id) {
        // The free first song: play before anything is set up. Making the player is the second button, never a gate.
        const radio = (window as any).XtrataRadio;
        const first = listedTracks(a.player)[0];
        const going = preview.phase === 'playing';
        const sounding = going && !!radio?.getState?.()?.playing;
        primary = { label: sounding ? 'Pause' : going ? 'Carry on' : 'Play the first song', run: () => { if (going) radio?.playPause?.(); else if (first) radio?.playToken?.(first.id); } };
        secondary = { label: 'Make my player and hear it all', run: () => void ppp.create() };
        hint = 'The first song is free. Nothing to set up yet.';
      } else if (s.step === 'intro') {
        const heardFirst = preview.phase === 'done' && preview.album === a.player.id;
        if (heardFirst && !status.length) status.push(el('p', 'That was the first song. Make your player to hear the rest: one tap with Face ID or your fingerprint.', 'ppp-cyan'));
        primary = { label: heardFirst ? 'Keep listening' : 'Open album', run: () => void ppp.create() };
        secondary = { label: "I've used Xtrata Music here before", run: () => void ppp.unlock(true) };
      } else if (s.step === 'locked') {
        primary = { label: 'Open album', run: () => void ppp.unlock() };
        secondary = { label: 'Use a different passkey', run: () => void ppp.unlock(true) };
      } else if (s.step === 'unsupported') status.push(el('p', 'This browser cannot keep albums. Open the link in Safari or Chrome.', 'ppp-warn'));
      else if (!status.length) status.push(el('p', 'Opening your album…', 'ppp-cyan'));
    }
    return {
      mode: a.mode, player: a.player, from: a.from, offered: a.offered,
      plays: a.mode === 'open' ? (s.balance === undefined ? null : s.giftPlays) : undefined,
      playsComing: s.depositPending,
      status, primary, secondary, hint: primary ? hint : undefined,
      asking, busy: !!s.busy, myPlays: myPlays(s), topUps: TOP_UP_PLAYS, canMake: !!s.gate?.gifts?.admin
    };
  }

  // "Find music" (find.ts): search and browse the whole catalogue by song, artist or number. Names are the catalogue's
  // with Xtrata's corrections on top (artist-credits), the same as everywhere else on this page.
  const findBox = document.getElementById('findBox') as HTMLDetailsElement | null;
  const findBody = document.getElementById('findBody');
  const find = findBox && findBody ? createFindBox(findBody, {
    load: () => fetch('/radio/counts?range=all&chainLikes=0', { cache: 'no-store', signal: AbortSignal.timeout(20000) })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('catalogue unavailable'))))
      .then((d) => buildSongs(d?.tracks, (id, raw) => ({ title: radioTitle(id, placeholder(raw.title) ? '' : raw.title!), artist: radioArtist(id, raw.artist || '') }))),
    play: (id) => { (window as any).XtrataRadio?.playToken?.(id); },
    current: () => { const n = Number((window as any).XtrataRadio?.getState?.()?.nowPlaying?.tokenId); return Number.isSafeInteger(n) ? n : null; },
    locked: () => !!ppp.snapshot().albumLock?.locked,
    explicit: (id) => !!(window as any).XtrataRadio?.isExplicit?.(id)
  }) : null;
  findBox?.addEventListener('toggle', () => { if (findBox.open) find?.load(); });
  let findSeen = '';
  const syncFind = () => {
    if (!find || !findBox?.open) return;
    const mark = `${!!ppp.snapshot().albumLock?.locked}|${(window as any).XtrataRadio?.getState?.()?.nowPlaying?.tokenId ?? ''}`;
    if (mark !== findSeen) { findSeen = mark; find.refresh(); }
  };

  // Song titles and artists from the radio itself, for history and messages.
  const titles = new Map<number, { title?: string; artist?: string }>();
  let previewSounding = false;
  const watchRadio = () => {
    const api = (window as any).XtrataRadio;
    if (!api?.subscribe) return false;
    api.subscribe((st: any) => {
      const np = st?.nowPlaying;
      if (np && Number.isSafeInteger(Number(np.tokenId))) titles.set(Number(np.tokenId), { title: np.title || undefined, artist: np.artist || undefined });
      syncFind();
      if (previewLive(preview)) {
        const sounding = !!st?.playing;
        advancePreview({ kind: 'now', track: np && np.tokenId != null ? String(np.tokenId) : null, playing: sounding, at: Date.now() });
        if (sounding !== previewSounding) { previewSounding = sounding; render(ppp.snapshot()); } // the button follows play / pause
      }
    });
    return true;
  };
  if (!watchRadio()) {
    const t = setInterval(() => { if (watchRadio()) clearInterval(t); }, 500);
    setTimeout(() => clearInterval(t), 60_000);
  }

  // A play is 30 seconds of audible listening (half of a shorter song); skips stay free.
  window.addEventListener('xtrata:radio-listened', (e) => {
    const d = (e as CustomEvent).detail;
    if (previewLive(preview)) advancePreview({ kind: 'listened', at: Date.now() });
    if (d && Number.isSafeInteger(d.song) && typeof d.id === 'string' && /^[0-9a-f]{32}$/.test(d.id)) { loadCatalogue(); const n = songName(d.song, titles.get(d.song)); void ppp.onListened({ song: d.song, id: d.id, title: n.title || undefined, artist: n.artist || undefined }); }
  });
  window.addEventListener('xtrata:wallet-changed', () => void ppp.refresh());
  document.addEventListener('visibilitychange', () => { if (!document.hidden) void ppp.refresh(); });
  setInterval(() => { if (!document.hidden && (paidHost || ppp.snapshot().step !== 'off')) void ppp.refresh(); }, 15000);
  void ppp.refresh();
}
