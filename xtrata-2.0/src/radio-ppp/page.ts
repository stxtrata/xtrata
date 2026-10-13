/**
 * /radio pay-per-play panel. Mounts the listening wallet frame (its own origin) and walks the
 * listener through: create → link → deposit → approve → first paid play. Holds no key.
 */
import { StacksMainnet } from '@stacks/network';
import { WalletBridgeClient } from '../lib/wallet/passkey/bridge/client';
import { createWalletSessionStore } from '../lib/wallet/session';
import { requestStructuredSignature } from '../lib/wallet/structured-sign';
import { showStxTransfer } from '../lib/wallet/connect';
import { costPerPlay, HOLDER_PAYMENT, stx } from '../lib/listening-wallet/policy';
import { account, api, balance, broadcast, owner, transaction, validateSaved, verify } from '../radio-test-wallet/chain';
import { createPppController, type GateConfig, type Snapshot } from './controller';
import { showSteps, stagesFor, stageOf, type StageView } from './stages';
import { findFunder } from '../lib/listening-wallet/funder';
import { resolvePrimaryBnsName } from '../lib/bns/primary';
import { radioArtist, radioTitle } from '../lib/radio/artist-credits.mjs';

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
    funder: (listening) => findFunder(listening, api),
    likesChanged: () => { void (window as any).XtrataRadio?.refreshLikes?.(); },
    likeState: async (main, song) => {
      const r = await json('/radio/chain-likes?' + new URLSearchParams({ wallet: main, ids: String(song) }));
      const row = Array.isArray(r?.rows) ? r.rows.find((x: any) => x?.id === song) : null;
      if (!row || typeof row.liked !== 'boolean') throw new Error('Like state unavailable.');
      return { liked: row.liked, by: Array.isArray(row.by) ? row.by.filter((a: unknown) => typeof a === 'string') : row.liked ? [main] : [] };
    },
    likeSent: (song, liked) => window.dispatchEvent(new CustomEvent('xtrata:radio-like-sent', { detail: { song, liked } })),
    likeFailed: (song) => window.dispatchEvent(new CustomEvent('xtrata:radio-like-failed', { detail: { song } }))
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
  let walletShown = false; // the listener opened the resting wallet box
  // BNS names (e.g. jim.btc) for main wallets, looked up once per address per page view.
  const names = new Map<string, string | null>();
  const nameOf = (address?: string) => {
    if (!address) return null;
    if (!names.has(address)) {
      names.set(address, null);
      resolvePrimaryBnsName({ address, network: 'mainnet' })
        .then((n) => { if (n) { names.set(address, n); render(ppp.snapshot()); } })
        .catch(() => { /* no name: the short address is shown */ });
    }
    return names.get(address) ?? null;
  };
  const who = (address?: string) => { const n = nameOf(address); return n ? `${n} · ${short(address)}` : short(address); };
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
    if (s.step === 'over') return ['OVER 1 STX', 'bad'];
    if (s.step === 'locked') return ['LOCKED', 'mute'];
    if (s.step === 'intro' || s.step === 'link') return ['', '']; // the SETUP HELPER badge says it
    if (s.step === 'fund') return s.entries.length ? ['OUT OF FUNDS', 'bad'] : ['ADD FUNDS', 'warn'];
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
    if (s.step === 'connect') { (document.getElementById('radio-wallet-connect') as HTMLButtonElement | null)?.click(); return; }
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
      case 'locked': return set(s.payingOn ? 'Unlock · keep paying' : 'Unlock wallet', '', 'Opens the listening wallet: one tap there asks for your passkey');
      case 'link': return set('Finish setup', 'warn', 'Link the listening wallet to your main wallet');
      case 'fund': return set(s.entries.some((e) => e.kind === 'play') ? 'Out of funds · top up' : 'Add funds', 'warn', 'Add up to 1 STX to keep paying artists');
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
    link: 'Not paying artists yet',
    fund: 'Out of funds · artists unpaid',
    over: 'Paused · artists unpaid',
    ready: 'Paying is off · artists get nothing'
  };
  const NUDGE_ACTION: Partial<Record<Snapshot['step'], string>> = {
    elsewhere: 'Pay as I listen', connect: 'Connect', intro: 'Set up', locked: 'Unlock',
    link: 'Finish setup', fund: 'Top up', over: 'Fix it', ready: 'Switch on'
  };
  function renderMode(s: Snapshot) {
    if (s.step === 'loading') return; // keep the last look while it checks
    const left = s.session ? Math.min(s.session.playsLeft, s.playsLeft) : 0;
    const paying = s.step === 'ready' && s.payingOn && left > 0;
    const warning = paying ? '' : NOT_PAYING[s.step] ?? '';
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
  const WALLET_TIP = 'Want your plays and likes under a wallet of your own? Get Xverse or Leather, connect it here, and link this listening wallet to it.';
  function walletTip(): HTMLElement {
    const p = el('p', WALLET_TIP + ' ', 'ppp-mute');
    p.append(link('Xverse', 'https://www.xverse.app/download'), ' · ', link('Leather', 'https://leather.io/install-extension'));
    return p;
  }

  function render(s: Snapshot) {
    syncIdentity(s);
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
    const showFrame = !['elsewhere', 'connect', 'not-invited', 'unsupported', 'off'].includes(s.step)
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
    if (s.listening) {
      const copy = button('Copy', () => void navigator.clipboard?.writeText(s.listening || ''), 'tiny');
      rows.push(...fact('Listening wallet', short(s.listening), 'ppp-addr-short', copy));
    }
    // Which main wallet this listening wallet serves: its likes and paid plays count for that wallet.
    if (s.listening && s.step !== 'intro') {
      if (s.linked) rows.push(...fact('Linked to', `${who(s.linked)} · returns go here`, s.linked === s.main || s.solo ? 'ppp-ok' : 'ppp-warn'));
      else if (s.solo) {
        // Passkey-only: returns go back where the money came from, unless the listener chose another address.
        const where = s.returnTo
          ? `${short(s.returnTo)} · ${s.returnToKind === 'chosen' ? 'chosen by you' : 'sent the first funds'}`
          : s.funderState === 'failed' ? 'could not check who funded it right now' : 'set when it is funded';
        rows.push(...fact('Returns go to', s.returnTo ? where.replace(short(s.returnTo), s.returnTo) : where, s.returnTo ? 'ppp-addr-full' : 'ppp-mute'));
      } else rows.push(...fact('Linked to', 'not linked yet', 'ppp-warn'));
    }
    if (s.linkedListening.length && s.gate?.here) {
      const list = s.linkedListening.map((a) => short(a) + (a === s.listening ? ' (this one)' : '')).join(', ');
      rows.push(...fact(s.linkedListening.length === 1 ? 'Listening wallet linked to you' : 'Listening wallets linked to you', list, 'ppp-addr-short'));
    }
    if (s.balance !== undefined && ['fund', 'ready', 'over'].includes(s.step)) {
      const tone = s.balanceState === 'ok' ? 'ppp-ok' : s.balanceState === 'low' ? 'ppp-warn' : 'ppp-bad';
      rows.push(...fact('Balance', `${stx(s.balance)} STX · about ${s.playsLeft.toLocaleString()} plays`, tone));
    }
    const last = (s.entries as Shown[]).find((e) => e.kind === 'play');
    if (last) loadCatalogue();
    if (last) rows.push(...fact('Last paid song', `${songLabel(last)} → ${short(last.recipient)}`, STATUS_CLASS[last.status] || ''));
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
        key.push(el('p', 'Connect your wallet to pay artists as you listen.'));
        lines.push(el('p', 'Every payment is recorded on-chain. Listening is always free.'));
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
        actions.push(button('Turn on pay-per-play', () => void ppp.create(), 'primary'));
        actions.push(button('I already have a listening wallet', () => void ppp.unlock(true)));
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
        if (s.entries.length) key.push(el('p', 'Out of funds · top up to keep paying', 'ppp-bad'));
        else key.push(el('p', `Add funds · 1 STX ≈ ${Math.floor(Number(1_000_000n / cost)).toLocaleString()} songs`));
        if (s.entries.length) lines.push(el('p', 'Songs play free until you top up. Paying carries on by itself once the top-up confirms.'));
        if (s.payingOn && !s.entries.length) lines.push(el('p', 'Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.', 'ppp-ok'));
        if (s.solo) {
          // No wallet to deposit from: the address is the whole interface. Anyone can send to it.
          lines.push(el('p', 'Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.'));
          lines.push(el('p', s.listening || '', 'ppp-addr-full'));
          if (s.listening) actions.push(button('Copy my address', () => void navigator.clipboard?.writeText(s.listening || ''), 'primary'));
        } else lines.push(el('p', `Or send STX from an exchange to the listening wallet address (Copy above).`, 'ppp-mute'));
        if (s.depositPending && s.depositTxid) { const p = el('p', 'Deposit on its way… ', 'ppp-warn'); p.append(link('View', explorer(s.depositTxid))); key.push(p); }
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
        if (s.balanceState === 'low') key.push(el('p', 'Running low · top up', 'ppp-warn'));
        if (s.depositPending) key.push(el('p', 'Top-up on its way…', 'ppp-warn'));
        else if (s.allowance > 0n && s.balanceState !== 'ok' && !s.solo) actions.push(button(`Top up ${stx(s.allowance)} STX`, () => void ppp.deposit()));
        break;
    }
    if (s.solo && s.walletCannotSolo)
      lines.push(el('p', 'The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.', 'ppp-warn'));
    if (s.solo && ['fund', 'ready'].includes(s.step)) {
      if ((s.balance ?? 0n) > 0n) lines.push(returnPicker(s));
      lines.push(walletTip());
      // Once a paid play has landed, a single quiet pointer outside the fold. Never a blocker.
      if (s.step === 'ready' && (s.entries as Shown[]).some((e) => e.kind === 'play' && e.status === 'confirmed')) {
        const tip = el('p', 'Have a Stacks wallet? ', 'ppp-mute');
        tip.append(link('Get Xverse or Leather', 'https://www.xverse.app/download'), ' to keep your plays and likes under your own address.');
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
    if (['ready', 'fund'].includes(s.step) && s.returnTo && (s.balance ?? 0n) > 0n)
      more.push(button(s.linked ? 'Return all to my wallet' : `Return all to ${short(s.returnTo)}`, () => void ppp.returnFunds('all'), 'quiet'));
    if (['ready', 'fund', 'link', 'over'].includes(s.step)) more.push(button('Lock', () => void ppp.lock(), 'quiet'));
    if (showFrame && !asking) more.push(button(walletShown ? 'Hide listening wallet box' : 'Show listening wallet box', () => { walletShown = !walletShown; render(ppp.snapshot()); }, 'quiet'));

    [...actions, ...more].forEach((a) => ((a as HTMLButtonElement).disabled = busy));
    // While the wallet box is asking for a tap it is the only thing to press: page buttons step aside.
    if (busy) actions.length = 0;
    // The balance is the one wallet detail a listener needs at a glance: on the same line once set up.
    if (s.balance !== undefined && ['fund', 'ready', 'over'].includes(s.step)) {
      const tone = s.balanceState === 'ok' ? 'ppp-ok' : s.balanceState === 'low' ? 'ppp-warn' : 'ppp-bad';
      const first = key.at(0);
      if (s.step === 'ready' && first) first.append(el('span', ` · ${stxShort(s.balance)} STX`, tone));
      else key.push(el('p', `Balance ${stxShort(s.balance)} STX`, tone));
    }
    $('.ppp-key').replaceChildren(...key);
    $('.ppp-body').replaceChildren(...lines);
    $('.ppp-actions').replaceChildren(...actions);
    $('.ppp-actions2').replaceChildren(...more);
    // Say it once: a message that repeats the line already shown stays quiet.
    const msg = s.busy || s.message || '';
    $('.ppp-msg').textContent = msg && key.some((k) => (k.textContent ?? '').startsWith(msg.replace(/[.✓\s]+$/, ''))) ? '' : msg;
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
        ? [el('span', songLabel(e), 'ppp-song'), el('span', ` · ${stx(BigInt(e.amount))} STX to ${short(e.recipient)}`, 'ppp-mute')]
        : e.kind === 'like'
          ? [el('span', `${e.liked ? '♥ Liked' : 'Unliked'} ${songLabel(e)}`, 'ppp-song'), el('span', ` · for ${s.linked ? who(s.linked) : 'this listening wallet'}`, 'ppp-mute')]
          : [el('span', `Returned ${stx(BigInt(e.amount))} STX`, 'ppp-song'), el('span', ` to ${short(e.recipient)}`, 'ppp-mute')];
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
