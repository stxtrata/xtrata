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
import { STAGES, stageOf, type StageView } from './stages';
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

  const short = (a?: string) => (a ? a.slice(0, 6) + '…' + a.slice(-4) : '');
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

  function render(s: Snapshot) {
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
    const label = $('.ppp-frame-label');
    label.hidden = !showFrame;
    label.replaceChildren(el('span', asking ? 'Listening wallet · tap the button in this box' : 'Listening wallet box'));
    if (!asking) label.append(button(walletShown ? 'Hide' : 'Show', () => { walletShown = !walletShown; render(ppp.snapshot()); }, 'tiny'));

    // Every gate, numbered, from the radio address to paid plays; always shown so progress is clear.
    const stage = stageOf(s) ?? lastStage; // loading keeps the last known stage
    lastStage = stage;
    // The walk-through is a setup helper until paid plays are taking place.
    $('.ppp-badge').hidden = !stage || stage.at >= STAGES.length;
    const progress = $('.ppp-steps'), caption = $('.ppp-stage');
    progress.hidden = caption.hidden = !stage;
    if (stage) {
      progress.replaceChildren(...STAGES.map((label, i) => {
        const li = el('li', '', i < stage.at ? 'done' : i === stage.at ? (stage.blocked ? 'now blocked' : 'now') : '');
        li.append(el('span', i < stage.at ? '✓' : String(i + 1), 'n'), label);
        if (i === stage.at) li.setAttribute('aria-current', 'step');
        return li;
      }));
      caption.textContent = stage.caption;
      caption.className = 'ppp-stage ' + (stage.at >= STAGES.length ? 'ppp-ok' : stage.blocked ? 'ppp-bad' : 'ppp-cyan');
    }

    // Labelled facts: who is who, and what the wallet holds.
    const facts = $('.ppp-facts');
    const rows: HTMLElement[] = [];
    if (s.main && s.gate?.here) rows.push(...fact('Your wallet', who(s.main), 'ppp-addr-short'));
    if (s.listening) {
      const copy = button('Copy', () => void navigator.clipboard?.writeText(s.listening || ''), 'tiny');
      rows.push(...fact('Listening wallet', short(s.listening), 'ppp-addr-short', copy));
    }
    // Which main wallet this listening wallet serves: its likes and paid plays count for that wallet.
    if (s.listening && s.step !== 'intro')
      rows.push(...(s.linked
        ? fact('Linked to', `${who(s.linked)} · returns go here`, s.linked === s.main ? 'ppp-ok' : 'ppp-warn')
        : fact('Linked to', 'not linked yet', 'ppp-warn')));
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
    $('.ppp-wallets').hidden = !rows.length;

    // `key`: the one or two lines a newcomer needs now, shown at the top. `lines`: everything else,
    // folded under "More about this step".
    const key: HTMLElement[] = [];
    const lines: HTMLElement[] = [];
    const actions: HTMLElement[] = [];
    const cost = costPerPlay(BigInt(s.gate?.limits.playFee ?? '300'));
    const payLine = `Each song you listen to for 30 seconds sends ${stx(HOLDER_PAYMENT)} STX to whoever holds it, plus a ${stx(cost - HOLDER_PAYMENT)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`;
    const busy = !!s.busy;

    switch (s.step) {
      case 'elsewhere': {
        key.push(el('p', 'Pay artists a tiny amount for each song you listen to for 30 seconds, recorded on-chain.'));
        if (s.gate?.radioUrl) { const p = el('p'); p.append(link('Open the pay-per-play radio →', s.gate.radioUrl)); key.push(p); }
        lines.push(el('p', 'Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet.'));
        break;
      }
      case 'connect':
        key.push(el('p', 'Connect your wallet above to pay artists a tiny amount for each song you listen to for 30 seconds.'));
        lines.push(el('p', 'Every payment is recorded on-chain. Listening is always free.'));
        break;
      case 'not-invited':
        key.push(el('p', 'Pay-per-play is in a small test right now. Listening is free for everyone, and it will open up soon.', 'ppp-mute'));
        break;
      case 'unsupported':
        key.push(el('p', 'This browser cannot create the passkey pay-per-play needs. Listening is free. Try Chrome or Safari on a current phone or computer.', 'ppp-warn'));
        break;
      case 'intro':
        key.push(el('p', `Pay ${stx(cost)} STX for each song you listen to for 30 seconds, automatically, from a small wallet on this device.`));
        lines.push(el('p', payLine));
        lines.push(el('p', 'Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.', 'ppp-ok'));
        lines.push(el('p', 'You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.', 'ppp-warn'));
        actions.push(button('Turn on pay-per-play', () => void ppp.create(), 'primary'));
        actions.push(button('I already have a listening wallet', () => void ppp.unlock(true)));
        break;
      case 'locked':
        if (s.armed) {
          // The unlock confirm is already open in the frame: one tap there goes straight to the passkey.
          key.push(el('p', `Tap “${s.payingOn ? 'Unlock and keep paying' : 'Unlock with passkey'}” below. It goes straight to your passkey.`, 'ppp-cyan'));
        } else {
          key.push(el('p', s.payingOn ? 'Unlock it with your passkey to keep paying as you listen.' : 'Paying is switched off. Unlock to manage your wallet.', s.payingOn ? '' : 'ppp-mute'));
          actions.push(button(s.payingOn ? 'Unlock and keep paying' : 'Unlock', () => void ppp.unlock(), 'primary'));
        }
        actions.push(button('Use a different listening wallet', () => void ppp.unlock(true), 'quiet'));
        break;
      case 'link':
        key.push(el('p', s.serverLinked
          ? `Confirm your main wallet ${who(s.main)} in the listening wallet box.`
          : `Link to your main wallet ${who(s.main)}: one signature, no fee.`));
        lines.push(el('p', 'Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.'));
        lines.push(el('p', 'The listening wallet will show the full address. Check it is yours before confirming.', 'ppp-warn'));
        actions.push(button(s.serverLinked ? 'Confirm my wallet' : 'Link to my wallet', () => void ppp.link(), 'primary'));
        break;
      case 'loading':
        key.push(el('p', 'Checking the listening wallet balance…', 'ppp-mute'));
        break;
      case 'fund': {
        if (s.entries.length) key.push(el('p', 'Out of funds: songs play free until you top up. Paying carries on by itself once the top-up confirms.', 'ppp-bad'));
        else key.push(el('p', `Add up to ${stx(s.allowance)} STX. 1 STX covers about ${Math.floor(Number(1_000_000n / cost)).toLocaleString()} paid plays.`));
        if (s.payingOn && !s.entries.length) lines.push(el('p', 'Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.', 'ppp-ok'));
        lines.push(el('p', `Or send STX from an exchange to the listening wallet address (Copy above).`, 'ppp-mute'));
        if (s.depositPending && s.depositTxid) { const p = el('p', 'Deposit sent, waiting for it to confirm. This page checks automatically. ', 'ppp-warn'); p.append(link('View', explorer(s.depositTxid))); key.push(p); }
        else if (s.allowance > 0n) actions.push(button(`Deposit ${stx(s.allowance)} STX from my wallet`, () => void ppp.deposit(), 'primary'));
        break;
      }
      case 'over':
        key.push(el('p', `Over 1 STX, so paid plays are paused. Return the excess or everything to your main wallet ${who(s.linked)}.`, 'ppp-bad'));
        actions.push(button('Return excess', () => void ppp.returnFunds('excess'), 'primary'), button('Return all', () => void ppp.returnFunds('all')));
        break;
      case 'ready':
        if (s.payingOn && s.session && s.session.playsLeft > 0) {
          // Whichever runs out first: the approval or the balance. A new approval brings the same figures back.
          const left = Math.min(s.session.playsLeft, s.playsLeft);
          key.push(el('p', `Paying as you listen · up to ${left.toLocaleString()} more plays remaining`, 'ppp-ok'));
          lines.push(el('p', 'Each song pays its holder once you have heard 30 seconds of it. Skips stay free. Tap the heart to like or unlike a song from this wallet (0.0002 STX).'));
          actions.push(button('Switch off', () => void ppp.switchOff()));
        } else {
          key.push(el('p', 'Paying is switched off. Music plays free.', 'ppp-mute'));
          actions.push(button('Switch on paying as I listen', () => void ppp.switchOn(), 'primary'));
        }
        if (s.balanceState === 'low') key.push(el('p', 'Running low. Top up to keep paying artists.', 'ppp-warn'));
        if (s.depositPending) key.push(el('p', 'Top-up sent, waiting for it to confirm.', 'ppp-warn'));
        else if (s.allowance > 0n && s.balanceState !== 'ok') actions.push(button(`Top up ${stx(s.allowance)} STX`, () => void ppp.deposit()));
        break;
    }
    if (s.stuck) {
      key.push(el('p', s.stuck === 1 ? '1 payment has not appeared on-chain after 30 minutes.' : `${s.stuck} payments have not appeared on-chain after 30 minutes.`, 'ppp-warn'));
      actions.push(button('Clear stuck payments', () => void ppp.clearStuck()));
    }
    if (['ready', 'fund'].includes(s.step) && s.linked && (s.balance ?? 0n) > 0n)
      actions.push(button('Return all to my wallet', () => void ppp.returnFunds('all'), 'quiet'));
    if (['ready', 'fund', 'link', 'over'].includes(s.step)) actions.push(button('Lock', () => void ppp.lock(), 'quiet'));

    actions.forEach((a) => ((a as HTMLButtonElement).disabled = busy));
    // While the wallet box is asking for a tap it is the only thing to press: page buttons step aside.
    if (busy) actions.length = 0;
    // The balance is the one wallet detail a listener needs at a glance.
    if (s.balance !== undefined && ['fund', 'ready', 'over'].includes(s.step)) {
      const tone = s.balanceState === 'ok' ? 'ppp-ok' : s.balanceState === 'low' ? 'ppp-warn' : 'ppp-bad';
      key.push(el('p', `Balance ${stx(s.balance)} STX`, tone));
    }
    $('.ppp-key').replaceChildren(...key);
    $('.ppp-body').replaceChildren(...lines);
    $('.ppp-more').hidden = !lines.length;
    $('.ppp-actions').replaceChildren(...actions);
    $('.ppp-msg').textContent = s.busy || s.message;
    $('.ppp-err').textContent = s.error;

    const history = $('.ppp-history');
    history.hidden = !s.entries.length;
    if (s.entries.length) loadCatalogue();
    history.replaceChildren(el('summary', `Payments, likes and returns (${s.entries.length})`), ...(s.entries as Shown[]).slice(0, 20).map((e) => {
      const row = el('div', '', 'ppp-row');
      const what = e.kind === 'play'
        ? [el('span', songLabel(e), 'ppp-song'), el('span', ` · ${stx(BigInt(e.amount))} STX to ${short(e.recipient)}`, 'ppp-mute')]
        : e.kind === 'like'
          ? [el('span', `${e.liked ? '♥ Liked' : 'Unliked'} ${songLabel(e)}`, 'ppp-song'), el('span', ` · for ${who(s.linked)}`, 'ppp-mute')]
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
