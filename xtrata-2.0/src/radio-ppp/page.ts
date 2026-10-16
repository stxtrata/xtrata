/**
 * /radio pay-per-play panel. Mounts the listening wallet frame (its own origin) and walks the
 * listener through: create → link → deposit → approve → first paid play. Holds no key.
 */
import { StacksMainnet } from '@stacks/network';
import { WalletBridgeClient } from '../lib/wallet/passkey/bridge/client';
import { createWalletSessionStore } from '../lib/wallet/session';
import { requestStructuredSignature } from '../lib/wallet/structured-sign';
import { showStxTransfer } from '../lib/wallet/connect';
import { costPerPlay, HOLDER_PAYMENT, stx, TARGET } from '../lib/listening-wallet/policy';
import { account, api, balance, broadcast, owner, transaction, validateSaved, verify } from '../radio-test-wallet/chain';
import { createPppController, TOP_UP_CHOICES, type GateConfig, type Snapshot } from './controller';
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
import { copyButton } from './feedback';
import { browserName, inAppBrowser, openInBrowserHref } from './in-app';

const root = document.getElementById('ppp');
if (root) start(root);

function start(root: HTMLElement) {
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
        setTimeout(() => reject(new Error('The listening wallet did not load. Listening stays free.')), 15000);
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
          new Promise<T>((_, reject) => setTimeout(() => reject(new Error('The listening wallet is not answering. Listening stays free.')), 10000))
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

  // The radio's heart asks here first: the listening wallet signs the like when it can, for the main wallet.
  // Returns true when it takes the tap (any listener with a listening wallet here): it then toggles the
  // like itself and never opens the main-wallet page.
  (window as any).XtrataRadioLikeHandler = (d: { song: number; likedBy?: string[]; title?: string; artist?: string }) => {
    if (!d || !Number.isSafeInteger(d.song) || d.song < 0) return false;
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

  // A gifted wallet's album becomes a band on the radio; when its paid plays run out the radio stops (no free mode).
  let giftPushed = '', stopPushed: string | null = null, lockPushed = false, waitPushed = false;
  const syncGift = (s: Snapshot) => {
    const radio = (window as any).XtrataRadio;
    if (!radio?.setGiftPlayer || !radio?.setGiftStop) return; // pushed again at the next render, once the radio is there
    const p = s.step === 'off' || s.step === 'elsewhere' ? null : s.gift?.player ?? null;
    const id = p ? p.id + ':' + p.cover + ':' + p.tracks.map((t) => t.id).join(',') : '';
    if (id !== giftPushed) {
      radio.setGiftPlayer(p ? { id: p.id, title: p.title, subtitle: p.subtitle, tracks: listedTracks(p).map((t) => t.id), hidden: hiddenTrack(p)?.id ?? null, cover: p.cover } : null);
      giftPushed = id;
    }
    const stop = s.giftStop?.text ?? null; // any passkey wallet is paid-only, not just a gifted album
    if (stop !== stopPushed) { radio.setGiftStop(stop); stopPushed = stop; }
    // Plays on their way: the radio greys its controls and says so, instead of looking broken.
    const wait = s.giftStop?.reason === 'arriving';
    if (wait !== waitPushed) { radio.setGiftWait?.(wait); waitPushed = wait; }
    const lock = !!p && !!s.albumLock?.locked;
    if (lock !== lockPushed) { radio.setGiftLock?.(lock); lockPushed = lock; }
    // Per-wallet song memory lasts only while this passkey stays unlocked on this page.
    if (['locked', 'intro', 'wrong-wallet', 'unsupported', 'connect', 'not-invited', 'off', 'elsewhere'].includes(s.step)) radio.forgetWallets?.();
  };

  const short = (a?: string) => (a ? a.slice(0, 6) + '…' + a.slice(-4) : '');
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
    const out: HTMLElement[] = [el('p', `You are in ${app}'s built-in browser, where passkeys often do not work. Open this page in ${browser} to make your listening wallet${code ? ' and claim your gift' : ''}.`, 'ppp-warn')];
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
    if (s.step === 'over') return ['OVER 1 STX', 'bad'];
    if (s.step === 'locked') return ['LOCKED', 'mute'];
    if (s.step === 'intro' || s.step === 'link') return ['', '']; // the SETUP HELPER badge says it
    if (s.step === 'fund') return s.depositPending ? ['ON ITS WAY', 'warn'] : s.entries.length ? ['OUT OF FUNDS', 'bad'] : ['ADD FUNDS', 'warn'];
    return s.payingOn && s.session && s.session.playsLeft > 0 ? ['ON · PAYING', 'ok'] : ['OFF', 'mute'];
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
  /** The next step, from the top bar or a nudge: connect, open the pay-per-play radio, or unlock. */
  const go = () => {
    const s = ppp.snapshot();
    if (s.step === 'connect' || s.step === 'wrong-wallet') { (document.getElementById('radio-wallet-connect') as HTMLButtonElement | null)?.click(); return; }
    if (s.step === 'elsewhere' && s.gate?.radioUrl) { location.href = s.gate.radioUrl; return; }
    if (s.step === 'locked' && !s.armed && !s.busy) void ppp.unlock();
    if (s.step === 'ready' && !s.payingOn && !s.busy) void ppp.switchOn();
    focusPanel();
  };
  if (top) top.onclick = go;
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
      case 'elsewhere': return set('Pay-per-play radio', 'quiet', 'Open the pay-per-play radio');
      case 'connect': top.hidden = true; return; // "Connect wallet" sits right beside it
      case 'intro': return set('Set up pay-per-play', '', 'Create your passkey listening wallet');
      case 'wrong-wallet': return set(`Connect ${who(s.linked)}`, 'warn', `This device's listening wallet belongs to ${who(s.linked)}. Connect that wallet to pay artists or like songs.`);
      case 'locked': return set(s.payingOn ? 'Unlock · keep paying' : 'Unlock wallet', '', 'Opens the listening wallet: one tap there asks for your passkey');
      case 'link': return set('Finish setup', 'warn', 'Link the listening wallet to your main wallet');
      case 'fund': return s.depositPending ? set('Funds on their way', 'quiet', 'Paying starts by itself when they land')
        : set(s.entries.some((e) => e.kind === 'play') ? 'Out of funds · top up' : 'Add funds', 'warn', 'Add up to 1 STX to keep paying artists');
      case 'over': return set('Over 1 STX', 'warn', 'Return the excess to keep paying');
      case 'loading': return set('Pay-per-play', 'quiet', 'Checking the listening wallet');
      case 'ready':
        return s.payingOn && left > 0
          ? set(`On · ${left.toLocaleString()} plays left`, 'on', 'Paying artists as you listen')
          : set('Paying off · switch on', 'off', 'Pay-per-play is switched off');
    }
  }

  // The whole radio dresses for it (public/radio.html): gold trim and a lit ON AIR lamp while it
  // pays artists, drab with small orange nudges while it does not. Pages without the hooks ignore it.
  const nudge = document.getElementById('pppNudge');
  const onair = document.getElementById('onair');
  nudge?.querySelector('button')?.addEventListener('click', () => go());
  const NOT_PAYING: Partial<Record<Snapshot['step'], string>> = {
    elsewhere: 'Listening free · artists get nothing',
    connect: 'Not paying artists',
    intro: 'Not paying artists',
    locked: 'Locked · not paying artists',
    'wrong-wallet': 'Wrong wallet connected · not paying artists',
    link: 'Not paying artists yet',
    fund: 'No funds yet · artists unpaid',
    over: 'Paused · artists unpaid',
    ready: 'Paying is off · artists get nothing'
  };
  const NUDGE_ACTION: Partial<Record<Snapshot['step'], string>> = {
    elsewhere: 'Pay as I listen', connect: 'Connect', 'wrong-wallet': 'Switch wallet', intro: 'Set up', locked: 'Unlock',
    link: 'Finish setup', fund: 'Top up', over: 'Fix it', ready: 'Switch on'
  };
  function renderMode(s: Snapshot) {
    if (s.step === 'loading') return; // keep the last look while it checks
    const left = s.session ? Math.min(s.session.playsLeft, s.playsLeft) : 0;
    const paying = s.step === 'ready' && s.payingOn && left > 0;
    // Funds already on their way (a deposit or a gift): nothing has gone wrong, so no "artists unpaid" warning.
    const waiting = s.step === 'fund' && s.depositPending;
    const warning = paying || waiting ? '' : NOT_PAYING[s.step] ?? '';
    const mode = paying ? 'on' : warning ? 'off' : '';
    if (mode) document.documentElement.dataset.ppp = mode;
    else delete document.documentElement.dataset.ppp;
    if (onair) {
      onair.hidden = !mode;
      onair.querySelector('.onair-sub')!.textContent = paying ? `Paying artists · ${left.toLocaleString()} plays left` : 'Not paying';
    }
    if (nudge) {
      nudge.hidden = mode !== 'off';
      if (mode === 'off') {
        const perStx = Math.floor(Number(1_000_000n / costPerPlay(BigInt(s.gate?.limits.playFee ?? '300'))));
        nudge.querySelector('.nudge-t')!.textContent = '⚠ ' + warning;
        nudge.querySelector('.nudge-s')!.textContent = `1 STX (less than $1) pays for ${perStx.toLocaleString()} plays, on-chain, straight to the artists.`;
        nudge.querySelector('button')!.textContent = NUDGE_ACTION[s.step] ?? 'Start paying';
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
    if (`${mark}|${installed}` === headerMark) return;
    headerMark = `${mark}|${installed}`;
    if (mark) root.dataset.pppSolo = mark; else delete root.dataset.pppSolo;
    if (installed) root.dataset.pppWalletInstalled = installed; else delete root.dataset.pppWalletInstalled;
    window.dispatchEvent(new Event('xtrata:ppp-header'));
  };
  for (const ms of [1500, 4000, 9000]) setTimeout(() => render(ppp.snapshot()), ms);

  /**
   * An album wallet is open, and the main listener wallet that signs every like has run out of funds. Loud on purpose:
   * the address, a copy button and (with a main wallet connected) a one-tap top-up. Quiet again once funds are on the way.
   */
  /** Add plays to the open album from My player: one tap per amount, greyed out when My player cannot cover it. */
  function topUpAlbumRow(s: Snapshot, cls = ''): HTMLElement {
    const box = el('div', '', 'ppp-topup');
    const mine = s.likeFunds?.balance;
    box.append(el('span', 'Add plays from My player: ', 'ppp-mute'));
    for (const amount of TOP_UP_CHOICES) {
      const b = button(`+${(Number(amount) / 1e6).toFixed(2)} STX`, () => void ppp.topUpAlbum(amount), cls) as HTMLButtonElement;
      b.disabled = mine === undefined || mine < amount + 6_000n || s.depositPending || !!s.busy;
      box.append(b);
    }
    if (mine !== undefined && mine < TOP_UP_CHOICES[0] + 6_000n) box.append(el('p', 'My player is nearly empty: add STX to it first (switch to My player above).', 'ppp-mute'));
    return box;
  }

  function likeFundsBanner(s: Snapshot): HTMLElement[] {
    const f = s.likeFunds;
    if (!f || !f.album || (!f.low && !f.pending)) return [];
    const box = el('div', '', 'ppp-pick ppp-lowbox');
    if (!f.low) {
      const p = el('p', 'Top-up for your main listener wallet is on its way. ', 'ppp-warn');
      if (f.txid) p.append(link('View', explorer(f.txid)));
      box.append(p);
      return [box];
    }
    box.append(el('p', '⚠ YOUR MAIN LISTENER WALLET IS OUT OF FUNDS', 'ppp-bad ppp-lowtitle'));
    box.append(el('p', 'It signs every like for all your albums, so they all count for you. Likes are paused until it has a little STX. 0.1 STX is hundreds of likes.'));
    box.append(el('p', f.address, 'ppp-addr-full'));
    const row = el('div', '', 'ppp-open-row'); // not .ppp-actions: the panel refills the first element with that class
    row.append(copyButton('copy-likes-address', 'Copy address', () => f.address, 'primary', () => render(ppp.snapshot())));
    if (f.main && !s.solo) {
      const room = TARGET - (f.balance ?? 0n);
      if (room > 0n) row.append(button(`Pay ${stx(room)} STX from my wallet`, () => void ppp.topUpLikes(), 'primary'));
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
      text.textContent = 'Still arriving… this can take a few minutes. Nothing for you to do: it starts by itself.';
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

  function render(raw: Snapshot) {
    // A gift being claimed or sent to this wallet is money on its way: the panel and the radio say "on its way",
    // never "no funds · artists unpaid" (which reads as if something went wrong). The gift code sees the real state.
    const giftWait = gifts.inProgress(raw);
    const s: Snapshot = giftWait && raw.step === 'fund' ? { ...raw, depositPending: true } : raw;
    syncIdentity(s);
    syncGift(raw);
    syncHeader(s);
    // The gift banner can start the claim while it draws, and the claim redraws everything as "on its way". Stop here
    // rather than paint this older, not-yet-waiting picture over it.
    if (!giftWait && gifts.inProgress(raw)) return;
    renderTop(s);
    renderMode(s);
    root.hidden = s.step === 'off';
    if (root.hidden) return;
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
    const setup = showSteps(s, stage);
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
    const payLine = `Each song you listen to for 30 seconds sends ${stx(HOLDER_PAYMENT)} STX to whoever holds it, plus a ${stx(cost - HOLDER_PAYMENT)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`;
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
            ? `This device has listening wallets for ${whoList(mine)}. Connect one of them to keep paying artists.`
            : `This device's listening wallet is linked to ${who(s.linked)}. Connect that wallet to keep paying artists.`));
          lines.push(el('p', 'Connect a different wallet instead and it gets a listening wallet of its own: each address keeps its own plays, likes and funds. Listening is always free.'));
        } else {
          key.push(el('p', 'Connect your wallet to pay artists as you listen.'));
          lines.push(el('p', 'Every payment is recorded on-chain. Listening is always free.'));
        }
        break;
      case 'wrong-wallet':
        // Only with a wallet box older than one-listening-wallet-per-address (it cannot offer this address its own).
        key.push(el('p', `This device's listening wallet belongs to ${who(s.linked)}. Connect that wallet to pay artists or like songs.`, 'ppp-warn'));
        lines.push(el('p', `You are connected as ${who(s.main)}. Listening is still free, and nothing is paid from the listening wallet while this wallet is connected.`));
        lines.push(el('p', 'The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.', 'ppp-mute'));
        actions.push(button('Switch wallet', () => (document.getElementById('radio-wallet-connect') as HTMLButtonElement | null)?.click(), 'primary'));
        break;
      case 'not-invited':
        key.push(el('p', 'Coming soon. Listening is free.', 'ppp-mute'));
        break;
      case 'unsupported':
        key.push(el('p', 'Needs a passkey this browser cannot make. Try Chrome or Safari.', 'ppp-warn'));
        break;
      case 'intro':
        key.push(el('p', `Pay artists ${stx(cost)} STX a song as you listen.`));
        lines.push(el('p', payLine));
        lines.push(el('p', 'Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.', 'ppp-ok'));
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
        actions.push(button(gift ? 'Claim my gift · no wallet needed' : s.solo ? 'Turn on pay-per-play · no wallet needed' : s.others.length && s.main ? `Set up for ${who(s.main)}` : 'Turn on pay-per-play', () => void ppp.create(), 'primary'));
        if (!gift && !s.solo && s.main && s.others.length) actions.push(button('Switch wallet', () => (document.getElementById('radio-wallet-connect') as HTMLButtonElement | null)?.click()));
        if (!gift && s.solo) actions.push(button('I have a Stacks wallet', () => (document.getElementById('radio-wallet-connect') as HTMLButtonElement | null)?.click()));
        actions.push(button('I already have a listening wallet', () => void ppp.unlock(true)));
        if (gift) actions.push(button('Not now', () => gifts.setAside(), 'quiet'));
        break;
      case 'locked':
        if (s.armed) {
          // The unlock confirm is already open in the frame: one tap there goes straight to the passkey.
          // The unlock is waiting in the wallet box right below: nothing to read.
        } else {
          key.push(el('p', 'Locked.', 'ppp-mute'));
          actions.push(button(s.payingOn ? 'Unlock and keep paying' : 'Unlock', () => void ppp.unlock(), 'primary'));
        }
        more.push(button('Use a different listening wallet', () => void ppp.unlock(true), 'quiet'));
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
        else if (s.gift?.player) key.push(el('p', 'Out of plays · add more to keep listening', 'ppp-bad'));
        else if (s.entries.length) key.push(el('p', 'Out of funds · top up to keep paying', 'ppp-bad'));
        else key.push(el('p', `Add funds · 1 STX ≈ ${Math.floor(Number(1_000_000n / cost)).toLocaleString()} songs`));
        if (s.gift?.player) lines.push(el('p', 'This player has no free mode: it carries on by itself once the plays arrive.'));
        else if (s.entries.length) lines.push(el('p', 'Songs play free until you top up. Paying carries on by itself once the top-up confirms.'));
        if (s.payingOn && !s.entries.length) lines.push(el('p', 'Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.', 'ppp-ok'));
        if (giftWait) { /* the gift banner shows its progress: no "add funds" while a gift is on its way */ }
        else if (s.solo) {
          // No wallet to deposit from: the address is the whole interface. Anyone can send to it.
          lines.push(el('p', 'Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.'));
          lines.push(el('p', s.listening || '', 'ppp-addr-full'));
          if (s.listening && !s.depositPending) actions.push(copyButton('copy-address', 'Copy my address', () => s.listening || '', 'primary', () => render(ppp.snapshot())));
        } else lines.push(el('p', `Or send STX from an exchange to the listening wallet address (Copy above).`, 'ppp-mute'));
        if (s.depositPending && s.depositTxid) { const p = el('p', 'Funds on their way · paying starts by itself when they land. ', 'ppp-warn'); p.append(link('View', explorer(s.depositTxid))); key.push(p); }
        else if (s.allowance > 0n && !s.solo) actions.push(button(`Deposit ${stx(s.allowance)} STX from my wallet`, () => void ppp.deposit(), 'primary'));
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
        if (s.payingOn && s.session && s.session.playsLeft > 0) {
          // Whichever runs out first: the approval or the balance. A new approval brings the same figures back.
          const left = Math.min(s.session.playsLeft, s.playsLeft);
          key.push(el('p', `Paying as you listen · up to ${left.toLocaleString()} plays left`, 'ppp-ok'));
          lines.push(el('p', 'Each song pays its holder once you have heard 30 seconds of it. Skips stay free. The heart likes or unlikes from this wallet for 0.0002 STX.'));
          actions.push(button('Switch off', () => void ppp.switchOff()));
        } else {
          key.push(el('p', 'Paying is off. Music stays free.', 'ppp-mute'));
          actions.push(button('Switch on paying as I listen', () => void ppp.switchOn(), 'primary'));
        }
        if (s.queued) key.push(el('p', s.queued === 1 ? '1 song waiting to be paid · sends as soon as the last transaction confirms' : `${s.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, 'ppp-warn'));
        if (s.balanceState === 'low') key.push(el('p', 'Running low · top up', 'ppp-warn'));
        if (s.depositPending) key.push(el('p', 'Top-up on its way…', 'ppp-warn'));
        else if (s.allowance > 0n && s.balanceState !== 'ok' && !s.solo) actions.push(button(`Top up ${stx(s.allowance)} STX`, () => void ppp.deposit()));
        break;
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
    if (s.balance !== undefined && ['fund', 'ready', 'over'].includes(s.step) && !(s.step === 'fund' && s.depositPending && s.balance === 0n) && !s.gift?.player) {
      const tone = s.balanceState === 'ok' ? 'ppp-ok' : s.balanceState === 'low' ? 'ppp-warn' : 'ppp-bad';
      const first = key.at(0);
      if (s.step === 'ready' && first) first.append(el('span', ` · ${stxShort(s.balance)} STX`, tone));
      else key.push(el('p', `Balance ${stxShort(s.balance)} STX`, tone));
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
    // A gift link in play goes first: it is why this visitor is here.
    key.unshift(...gifts.banner(raw));
    key.unshift(...likeFundsBanner(s));
    // Inside an app's own browser (Instagram, X, ...) passkeys often fail: before anything else, offer the real one.
    if (inApp && (gifts.pendingCode() || ['intro', 'locked', 'unsupported'].includes(s.step))) key.unshift(...openElsewhere(inApp, gifts.pendingCode()));
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
          b.append(el('span', title, 'tt'), el('span', bal === undefined ? '…' : `${stxShort(bal)} STX`, 'ts'));
          b.disabled = !!s.busy;
          return b;
        };
        const albumTitle = inAlbum ? s.gift?.player?.title ?? 'Album' : latestAlbum!.title;
        switcher.replaceChildren(
          tab('🎧 My player', inAlbum ? s.likeFunds?.balance : s.balance, !inAlbum, () => { if (inAlbum) void ppp.openAlbum(0); }),
          tab('💿 ' + albumTitle, inAlbum ? s.balance : undefined, inAlbum, () => { if (!inAlbum && latestAlbum) void ppp.openAlbum(latestAlbum.slot); })
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
    $('.ppp-body').replaceChildren(...lines);
    $('.ppp-actions').replaceChildren(...actions);
    $('.ppp-actions2').replaceChildren(...more);
    // Say it once: a message that repeats the line already shown stays quiet.
    const msg = s.busy || s.message || '';
    const msgEl = $('.ppp-msg');
    const shownMsg = msg && key.some((k) => (k.textContent ?? '').startsWith(msg.replace(/[.✓\s]+$/, ''))) ? '' : msg;
    // A check that has not answered yet is an amber "still trying", never an error, and only when nothing else is said.
    const notice = !shownMsg && !s.error ? s.notice : '';
    msgEl.textContent = shownMsg || notice;
    msgEl.classList.toggle('is-warn', !!notice);
    $('.ppp-err').textContent = s.error;

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
  }

  // Song titles and artists from the radio itself, for history and messages.
  const titles = new Map<number, { title?: string; artist?: string }>();
  const watchRadio = () => {
    const api = (window as any).XtrataRadio;
    if (!api?.subscribe) return false;
    api.subscribe((st: any) => {
      const np = st?.nowPlaying;
      if (np && Number.isSafeInteger(Number(np.tokenId))) titles.set(Number(np.tokenId), { title: np.title || undefined, artist: np.artist || undefined });
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
    if (d && Number.isSafeInteger(d.song) && typeof d.id === 'string' && /^[0-9a-f]{32}$/.test(d.id)) { loadCatalogue(); const n = songName(d.song, titles.get(d.song)); void ppp.onListened({ song: d.song, id: d.id, title: n.title || undefined, artist: n.artist || undefined }); }
  });
  window.addEventListener('xtrata:wallet-changed', () => void ppp.refresh());
  document.addEventListener('visibilitychange', () => { if (!document.hidden) void ppp.refresh(); });
  setInterval(() => { if (!document.hidden && ppp.snapshot().step !== 'off') void ppp.refresh(); }, 15000);
  void ppp.refresh();
}
