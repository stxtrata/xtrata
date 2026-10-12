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
    changed: () => render(ppp.snapshot())
  });

  const short = (a?: string) => (a ? a.slice(0, 6) + '…' + a.slice(-4) : '');
  const time = (ms: number) => new Date(ms).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const explorer = (txid: string) => `https://explorer.hiro.so/txid/${txid}?chain=mainnet`;
  const el = (tag: string, text = '', cls = '') => { const n = document.createElement(tag); if (text) n.textContent = text; if (cls) n.className = cls; return n; };
  const button = (label: string, run: () => void, cls = '') => { const b = el('button', label, cls) as HTMLButtonElement; b.type = 'button'; b.onclick = run; return b; };
  const link = (label: string, href: string) => { const a = el('a', label) as HTMLAnchorElement; a.href = href; a.target = '_blank'; a.rel = 'noopener'; return a; };

  const STEPS = ['Create wallet', 'Link', 'Deposit', 'First paid play'];
  const stepIndex: Partial<Record<Snapshot['step'], number>> = { intro: 0, locked: 0, link: 1, fund: 2, 'first-play': 3, paying: 3, ready: 4, over: 4, loading: 2 };

  function render(s: Snapshot) {
    root.hidden = s.step === 'off';
    if (root.hidden) return;
    $('.ppp-badge').hidden = !s.gate?.canary;
    const showFrame = !['elsewhere', 'connect', 'not-invited', 'unsupported', 'off'].includes(s.step);
    frameWrap.hidden = !showFrame;
    // The frame needs room while it is asking the listener something; it rests small otherwise.
    frameWrap.classList.toggle('ppp-frame--active', !!s.busy);

    const progress = $('.ppp-steps');
    const at = stepIndex[s.step];
    progress.hidden = at === undefined || s.canaryPassed;
    progress.replaceChildren(...STEPS.map((label, i) => el('li', label, at !== undefined && i < at ? 'done' : i === at ? 'now' : '')));

    const body = $('.ppp-body');
    const lines: HTMLElement[] = [];
    const actions: HTMLElement[] = [];
    const cost = costPerPlay(BigInt(s.gate?.limits.playFee ?? '300'));
    const payLine = `Each new song you hear sends ${stx(HOLDER_PAYMENT)} STX to whoever holds it, plus a ${stx(cost - HOLDER_PAYMENT)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`;
    const busy = !!s.busy;

    switch (s.step) {
      case 'elsewhere': {
        lines.push(el('p', 'Pay artists a tiny amount each time a new song starts, recorded on-chain. Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet.'));
        if (s.gate?.radioUrl) { const p = el('p'); p.append(link('Open the pay-per-play radio →', s.gate.radioUrl)); lines.push(p); }
        break;
      }
      case 'connect':
        lines.push(el('p', 'Pay artists a tiny amount each time a new song starts, recorded on-chain. Connect your wallet above to turn it on. Listening is always free.'));
        break;
      case 'not-invited':
        lines.push(el('p', 'Pay-per-play is in a small test right now. Listening is free for everyone, and it will open up soon.'));
        break;
      case 'unsupported':
        lines.push(el('p', 'This browser cannot create the passkey pay-per-play needs. Listening is free. Try Chrome or Safari on a current phone or computer.'));
        break;
      case 'intro':
        lines.push(el('p', payLine));
        lines.push(el('p', 'You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.', 'ppp-warn'));
        actions.push(button('Turn on pay-per-play', () => void ppp.create(), 'primary'));
        actions.push(button('I already have a listening wallet', () => void ppp.unlock(true)));
        break;
      case 'locked':
        lines.push(el('p', `Your listening wallet ${short(s.listening)} is locked.`));
        actions.push(button(s.canaryPassed ? 'Unlock and pay as you listen' : 'Unlock', () => void ppp.unlock(), 'primary'));
        actions.push(button('Use a different listening wallet', () => void ppp.unlock(true), 'quiet'));
        break;
      case 'link':
        lines.push(el('p', s.serverLinked
          ? `This listening wallet was linked to ${short(s.main)} on another device. Confirm it in the listening wallet below.`
          : `Link the listening wallet to your main wallet ${short(s.main)}. This is one signature, not a transaction: no fee, no spending permission. Afterwards, returns can only go back to this main wallet.`));
        lines.push(el('p', 'The listening wallet will show the full address. Check it is yours before confirming.'));
        actions.push(button(s.serverLinked ? 'Confirm my wallet' : 'Link to my wallet', () => void ppp.link(), 'primary'));
        break;
      case 'loading':
        lines.push(el('p', 'Checking the listening wallet balance…'));
        break;
      case 'fund': {
        lines.push(el('p', `Add up to ${stx(s.allowance)} STX. 1 STX covers about ${Math.floor(Number(1_000_000n / cost)).toLocaleString()} paid plays.`));
        const addr = el('p', '', 'ppp-addr');
        addr.append(el('span', 'Or send from an exchange to '), el('code', s.listening || ''), button('Copy', () => void navigator.clipboard?.writeText(s.listening || '')));
        lines.push(addr);
        if (s.depositPending && s.depositTxid) { const p = el('p', 'Deposit sent, waiting for it to confirm. This page checks automatically. '); p.append(link('View', explorer(s.depositTxid))); lines.push(p); }
        else if (s.allowance > 0n) actions.push(button(`Deposit ${stx(s.allowance)} STX from my wallet`, () => void ppp.deposit(), 'primary'));
        break;
      }
      case 'first-play':
        lines.push(el('p', payLine));
        if (s.session?.playsLeft) lines.push(el('p', 'Approved. Now play or skip to a new song: once you can hear it, it sends your first payment.', 'ppp-ok'));
        else actions.push(button('Approve my first paid play', () => void ppp.approveFirstPlay(), 'primary'));
        break;
      case 'paying':
        lines.push(el('p', 'Your first payment is on its way. It usually confirms within a few minutes.'));
        break;
    }
    if (s.stuck) {
      lines.push(el('p', s.stuck === 1 ? '1 payment has not appeared on-chain after 30 minutes.' : `${s.stuck} payments have not appeared on-chain after 30 minutes.`, 'ppp-warn'));
      actions.push(button('Clear stuck payments', () => void ppp.clearStuck()));
    }
    switch (s.step) {
      case 'over':
        lines.push(el('p', `This wallet holds ${stx(s.balance ?? 0n)} STX, more than the recommended 1 STX. Paid plays are paused. Return the excess or everything to your main wallet ${short(s.linked)}.`, 'ppp-warn'));
        actions.push(button('Return excess', () => void ppp.returnFunds('excess'), 'primary'), button('Return all', () => void ppp.returnFunds('all')));
        break;
      case 'ready':
        lines.push(el('p', `Balance ${stx(s.balance ?? 0n)} STX · about ${s.playsLeft.toLocaleString()} plays.`));
        if (s.balanceState === 'low' || s.balanceState === 'empty')
          lines.push(el('p', s.balanceState === 'empty' ? 'Out of funds: songs play free until you top up.' : 'Running low. Top up to keep paying artists.', 'ppp-warn'));
        if (s.session && s.session.playsLeft > 0) {
          lines.push(el('p', `Paying as you listen · up to ${s.session.playsLeft} more plays until ${time(s.session.expires)}.`, 'ppp-ok'));
          actions.push(button('Stop paying', () => void ppp.stop()));
        } else if (s.balanceState !== 'empty') actions.push(button('Pay automatically for each new song', () => void ppp.payAutomatically(), 'primary'));
        if (s.depositPending) lines.push(el('p', 'Top-up sent, waiting for it to confirm.'));
        else if (s.allowance > 0n && s.balanceState !== 'ok') actions.push(button(`Top up ${stx(s.allowance)} STX`, () => void ppp.deposit()));
        break;
    }
    if (['ready', 'fund', 'first-play', 'paying'].includes(s.step) && s.linked && (s.balance ?? 0n) > 0n)
      actions.push(button('Return all to my wallet', () => void ppp.returnFunds('all'), 'quiet'));
    if (['ready', 'fund', 'first-play', 'link', 'over', 'paying'].includes(s.step)) actions.push(button('Lock', () => void ppp.lock(), 'quiet'));

    actions.forEach((a) => ((a as HTMLButtonElement).disabled = busy));
    body.replaceChildren(...lines);
    $('.ppp-actions').replaceChildren(...actions);
    $('.ppp-msg').textContent = s.busy || s.message;
    $('.ppp-err').textContent = s.error;

    const history = $('.ppp-history');
    history.hidden = !s.entries.length;
    history.replaceChildren(el('summary', `Payments and returns (${s.entries.length})`), ...s.entries.slice(0, 20).map((e) => {
      const li = el('div', `${new Date(e.created).toLocaleString()} · ${e.kind === 'play' ? `song #${e.song} · ${stx(BigInt(e.amount))} STX + fee` : `returned ${stx(BigInt(e.amount))} STX`} · ${e.status} `);
      if (e.txid) li.append(link('tx', explorer(e.txid)));
      return li;
    }));
  }

  window.addEventListener('xtrata:radio-audible-start', (e) => {
    const d = (e as CustomEvent).detail;
    if (d && Number.isSafeInteger(d.song) && typeof d.id === 'string') void ppp.onAudibleStart(d);
  });
  window.addEventListener('xtrata:wallet-changed', () => void ppp.refresh());
  document.addEventListener('visibilitychange', () => { if (!document.hidden) void ppp.refresh(); });
  setInterval(() => { if (!document.hidden && ppp.snapshot().step !== 'off') void ppp.refresh(); }, 15000);
  void ppp.refresh();
}
