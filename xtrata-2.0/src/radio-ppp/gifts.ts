/**
 * Radio gift wallets on the page (server: functions/lib/radio-gifts.ts).
 *
 *  - Recipient: a `?gift=` link is kept on this device until it is claimed. Once their brand-new
 *    listening wallet exists (and is empty) the gift is claimed automatically: the treasury sends it,
 *    and the panel tracks it like a deposit.
 *  - Friend gift: anyone with a Stacks wallet picks 0.1 to 1 STX, pays it (+ the network fee) into the
 *    gift treasury, and gets a link to share once that payment confirms.
 *  - Admin: campaign links paid from the treasury, made with a signature from the admin's wallet.
 * Where returns go for a gifted wallet comes from the gift record (`funder`), not the chain's first
 * sender, so a friend's gift goes back to the friend.
 */
import { CAMPAIGN_MAX_LINKS, campaignData, GIFT_FEE, GIFT_MAX, GIFT_MIN, giftLink, giftPlays, isGiftCode, type CampaignRequest, type GiftView } from '../lib/listening-wallet/gifts';
import type { FunderResult } from '../lib/listening-wallet/funder';
import { stx } from '../lib/listening-wallet/policy';
import type { Snapshot } from './controller';

export interface GiftDeps {
  json(url: string, init?: RequestInit): Promise<any>;
  /** The connected Stacks wallet, if any. */
  main(): string | undefined;
  /** STX transfer from the connected wallet (one popup); resolves with the txid. */
  pay(main: string, recipient: string, amount: bigint, memo: string): Promise<string>;
  /** SIP-018 signature from the connected wallet (one popup). */
  sign(main: string, data: ReturnType<typeof campaignData>): Promise<string>;
  giftSent(txid: string, amount: bigint): void;
  /** "jim.btc · SP12…AB" style label. */
  who(address?: string): string;
  changed(): void;
  store: { get(key: string): string | null; set(key: string, value: string | null): void };
  now(): number;
}

/** Where public/radio.html puts a `#gift=` code the moment the page opens (and strips it from the URL). */
export const INCOMING_KEY = 'xtrata.radio.gift.incoming.v1';
const mineKey = (main: string) => 'xtrata.radio.gift.mine.v1:' + main;
type Mine = { id: string; code: string; amount: string; at: number; txid?: string; view?: GiftView; error?: string };

const el = (tag: string, text = '', cls = '') => { const n = document.createElement(tag); if (text) n.textContent = text; if (cls) n.className = cls; return n; };
const button = (label: string, run: () => void, cls = '') => { const b = el('button', label, cls) as HTMLButtonElement; b.type = 'button'; b.onclick = run; return b; };
const stxNice = (v: bigint) => stx(v).replace(/\.?0+$/, '');

export function createGifts(deps: GiftDeps) {
  // ---------------------------------------------------------------- recipient
  let incoming: { code: string; view?: GiftView; error?: string; claiming?: boolean; done?: boolean; waiting?: boolean } | null = null;
  // Links carry the code after `#` (never sent to a server); radio.html usually moves it to storage
  // before this runs. An older `?gift=` link is accepted too. Either way it leaves the address bar.
  const fromUrl = (() => {
    try {
      const url = new URL(location.href);
      const code = new URLSearchParams(url.hash.slice(1)).get('gift') ?? url.searchParams.get('gift');
      if (code !== null) {
        url.searchParams.delete('gift');
        history.replaceState(null, '', url.pathname + (url.search || ''));
      }
      return isGiftCode(code) ? code : null;
    } catch { return null; }
  })();
  const saved = (() => { try { const v = JSON.parse(deps.store.get(INCOMING_KEY) || 'null'); return isGiftCode(v?.code) ? v.code as string : null; } catch { return null; } })();
  const code = fromUrl ?? saved;
  if (code) {
    incoming = { code };
    deps.store.set(INCOMING_KEY, JSON.stringify({ code, at: deps.now() }));
    // The code now lives only on this device: it is forgotten only when the server says the link can
    // never work (unknown, used, expired), never because of a network hiccup.
    fetch('/radio/gift/status', { method: 'POST', headers: { 'content-type': 'application/json' }, cache: 'no-store', body: JSON.stringify({ code }), signal: AbortSignal.timeout(15_000) })
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));
        if (!res.ok) { if (res.status === 404) deps.store.set(INCOMING_KEY, null); throw new Error(body?.error || 'Could not check your gift right now. Reload to try again.'); }
        const v = body as GiftView;
        incoming = { ...incoming!, view: v };
        if (['claimed', 'expired', 'refunding', 'refunded'].includes(v.status)) deps.store.set(INCOMING_KEY, null);
        deps.changed();
      })
      .catch((e: Error) => { incoming = { ...incoming!, error: e.message }; deps.changed(); });
  }
  const liveGift = () => !!incoming?.view && incoming.view.status === 'live' && !incoming.done;
  /**
   * "Not now": forget the link on this device without touching the gift itself. It stays unclaimed on the
   * server, so opening the same link again brings it back (until it is claimed or expires).
   */
  const setAside = () => { incoming = null; deps.store.set(INCOMING_KEY, null); deps.changed(); };
  const fromLabel = (v: GiftView) => (v.from ? deps.who(v.from) : v.label ? `Xtrata Radio · ${v.label}` : 'Xtrata Radio');

  let turnstile: { token?: string; rendered?: boolean; box?: HTMLElement } = {};
  const turnstileBox = (siteKey: string) => {
    if (turnstile.box) return turnstile.box;
    const box = el('div', '', 'ppp-gift-check');
    turnstile.box = box;
    const draw = () => {
      const t = (window as any).turnstile;
      if (!t || turnstile.rendered) return;
      turnstile.rendered = true;
      t.render(box, { sitekey: siteKey, callback: (token: string) => { turnstile.token = token; deps.changed(); }, 'expired-callback': () => { turnstile.token = undefined; } });
    };
    if ((window as any).turnstile) draw();
    else {
      const s = document.createElement('script');
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      s.async = true; s.onload = draw;
      document.head.append(s);
    }
    return box;
  };

  let retryTimer: ReturnType<typeof setTimeout> | undefined;
  async function claim(s: Snapshot) {
    if (!incoming || incoming.claiming || !s.listening) return;
    incoming.claiming = true; incoming.error = undefined; deps.changed();
    try {
      const res = await fetch('/radio/gift/claim', {
        method: 'POST', headers: { 'content-type': 'application/json' }, cache: 'no-store', signal: AbortSignal.timeout(30_000),
        body: JSON.stringify({ code: incoming.code, wallet: s.listening, turnstile: turnstile.token })
      });
      const r = await res.json().catch(() => ({}));
      if (res.status === 503 && /sending another gift/.test(r?.error || '')) {
        // The treasury sends one gift at a time: wait a moment and try again by itself.
        incoming.waiting = true;
        clearTimeout(retryTimer);
        retryTimer = setTimeout(() => { if (incoming) { incoming.waiting = false; deps.changed(); } }, 12_000);
        return;
      }
      if (!res.ok) {
        // Forgotten only when it can never work for this visitor: unknown, used up or expired, or a
        // wallet that is not new. "Not paid for yet" or "being sent" can still change.
        const permanent = res.status === 404 || res.status === 410 || (res.status === 409 && /already had a gift|brand-new/.test(r?.error || ''));
        if (permanent) deps.store.set(INCOMING_KEY, null);
        throw new Error(r?.error || `Could not claim the gift (${res.status}).`);
      }
      incoming.done = true;
      deps.store.set(INCOMING_KEY, null);
      deps.giftSent(r.txid, BigInt(r.amount));
    } catch (e) {
      incoming.error = (e as Error).message;
      turnstile.token = undefined;
      try { (window as any).turnstile?.reset?.(turnstile.box); } catch { /* fresh token on retry */ }
    } finally {
      incoming.claiming = false;
      deps.changed();
    }
  }

  // While a gift is on its way to this wallet: ask the server how the send is going every 30 s. That
  // also keeps the treasury's sends moving (a failed broadcast is retried on these requests), and
  // says so plainly if the network keeps refusing it, instead of a silent wait.
  let sending: { wallet: string; at: number; state?: string; problem?: string | null } | null = null;
  function watchSending(s: Snapshot): HTMLElement[] {
    if (!s.listening || !s.depositPending || s.step !== 'fund') { sending = null; return []; }
    if (!sending || sending.wallet !== s.listening || deps.now() - sending.at > 30_000) {
      const wallet = s.listening;
      sending = { ...(sending?.wallet === wallet ? sending : {}), wallet, at: deps.now() };
      deps.json('/radio/gift/for?wallet=' + encodeURIComponent(wallet))
        .then((r) => { if (sending?.wallet === wallet) { sending.state = r?.gift?.state; sending.problem = r?.gift?.problem ?? null; deps.changed(); } })
        .catch(() => { /* asked again in 30 s */ });
    }
    return sending.state === 'sending' && sending.problem
      ? [el('p', `🎁 Your gift is waiting to go out (${sending.problem}). It is retried automatically.`, 'ppp-warn')]
      : [];
  }

  /** Lines for the top of the panel while a gift link is in play, or a gift is on its way. */
  function banner(s: Snapshot): HTMLElement[] {
    const status = watchSending(s);
    if (!incoming || ['off', 'elsewhere'].includes(s.step)) return status;
    const v = incoming.view;
    if (incoming.error && !v) return [el('p', `🎁 ${incoming.error}`, 'ppp-warn')];
    if (!v) return [el('p', '🎁 Checking your gift…', 'ppp-mute')];
    if (incoming.done) return status;
    if (v.status === 'claimed' || v.status === 'claiming') return [el('p', '🎁 This gift link has already been used.', 'ppp-mute')];
    if (['expired', 'refunding', 'refunded'].includes(v.status)) return [el('p', '🎁 This gift link has expired.', 'ppp-mute')];
    if (v.status === 'pending-deposit') return [el('p', `🎁 ${fromLabel(v)} is still sending this gift. Check back in a few minutes.`, 'ppp-warn')];
    const amount = BigInt(v.amount);
    const head = el('p', `🎁 ${fromLabel(v)} sent you ${stxNice(amount)} STX of on-chain music: about ${giftPlays(amount).toLocaleString()} paid plays.`, 'ppp-gift');
    const out: HTMLElement[] = [head];
    // Only a brand-new, empty wallet with no main wallet linked takes a gift automatically. A listener who
    // unlocks a wallet they already had (e.g. one linked to their Stacks wallet) keeps the gift link for later.
    const ready = !!s.listening && !s.linked && s.step === 'fund' && (s.balance ?? 1n) === 0n && !s.depositPending && !s.entries.length;
    const siteKey = s.gate?.gifts?.turnstileSiteKey;
    if (ready) {
      if (siteKey && !turnstile.token) { out.push(el('p', 'One quick check and it is yours:', 'ppp-mute'), turnstileBox(siteKey)); }
      else if (!incoming.claiming && !incoming.error && !incoming.waiting) void claim(s);
      if (incoming.claiming || incoming.waiting) out.push(el('p', incoming.waiting ? 'Another gift is on its way out first. Yours is next…' : 'Sending your gift…', 'ppp-cyan'));
      if (incoming.error) out.push(el('p', incoming.error, 'ppp-bad'), button('Try again', () => { incoming!.error = undefined; void claim(s); }));
    } else if (s.step === 'intro') out.push(el('p', 'Tap below: your passkey makes a listening wallet, and the gift lands in it.', 'ppp-mute'));
    else if (s.listening && s.linked) out.push(el('p', 'Gifts are for brand-new listening wallets, and this one is linked to a Stacks wallet. The link still works for someone new.', 'ppp-mute'), button('Forget this gift link here', setAside, 'quiet'));
    else if (s.listening && (s.balance ?? 0n) > 0n) out.push(el('p', 'Gifts are for brand-new listening wallets, and this one already has funds. Share the link with someone new instead.', 'ppp-mute'), button('Forget this gift link here', setAside, 'quiet'));
    return out;
  }

  /** Who a gifted wallet's returns go to (the friend who paid, or the treasury). */
  async function funder(listening: string, fallback: () => Promise<FunderResult>, giftsOn: boolean): Promise<FunderResult> {
    try {
      const r = await deps.json('/radio/gift/for?wallet=' + encodeURIComponent(listening));
      if (r?.gift?.returnTo) return { ok: true, funder: r.gift.returnTo, txId: r.gift.txid ?? undefined, amount: r.gift.amount, distinct: 1 };
    } catch {
      // While gifts are on, an unreadable gift record is "could not check", never "not a gift".
      if (giftsOn) return { ok: false };
    }
    return fallback();
  }

  // ---------------------------------------------------------------- friend gifts and campaigns (the fold)
  const fold = el('div', '', 'ppp-gift-fold');
  let amount = 250_000n;
  let working = '';
  let note = '';
  let campaign: { codes: string[]; amount: string } | null = null;
  const loadMine = (main: string): Mine[] => { try { const v = JSON.parse(deps.store.get(mineKey(main)) || '[]'); return Array.isArray(v) ? v : []; } catch { return []; } };
  const saveMine = (main: string, list: Mine[]) => deps.store.set(mineKey(main), JSON.stringify(list.slice(0, 50)));
  let checked = 0;

  async function refreshMine(main: string) {
    const list = loadMine(main);
    for (const g of list) {
      if (g.view && ['claimed', 'refunded', 'expired'].includes(g.view.status)) continue;
      try {
        // Still waiting for the payment: the server checks it (or, if the wallet never said which
        // transaction it was, finds it by this gift's memo).
        g.view = !g.view || g.view.status === 'pending-deposit'
          ? await deps.json('/radio/gift/confirm', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: g.id, ...(g.txid ? { txid: g.txid } : {}) }) })
          : await deps.json('/radio/gift?id=' + g.id);
        g.error = undefined;
      } catch (e) { g.error = (e as Error).message; }
    }
    saveMine(main, list);
    deps.changed();
  }

  async function give(main: string) {
    if (working) return;
    working = 'Starting your gift…'; note = ''; deps.changed();
    let made: { id: string; code: string; depositTo: string; deposit: string; memo: string } | null = null;
    try {
      made = await deps.json('/radio/gift/create', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ gifter: main, amount: amount.toString() }) });
      const list = loadMine(main);
      list.unshift({ id: made!.id, code: made!.code, amount: amount.toString(), at: deps.now() });
      saveMine(main, list);
      working = 'Approve the gift in your wallet…'; deps.changed();
      // The memo ties this payment to this one gift (the server checks it).
      const txid = await deps.pay(main, made!.depositTo, BigInt(made!.deposit), made!.memo);
      const after = loadMine(main);
      const g = after.find((x) => x.id === made!.id);
      if (g) { g.txid = txid; g.view = { status: 'pending-deposit', amount: amount.toString(), source: 'friend', from: main, label: '', expires: 0 }; }
      saveMine(main, after);
      note = 'Sent ✓ Your link works as soon as the payment confirms (a few minutes).';
      void refreshMine(main);
    } catch (e) {
      // Kept: if the payment went through anyway (the wallet just did not say), the memo finds it.
      note = (e as Error).message || 'Not sent.';
    } finally { working = ''; deps.changed(); }
  }

  async function makeCampaign(main: string, count: number, each: bigint, label: string) {
    if (working) return;
    working = 'Sign in your wallet…'; note = ''; campaign = null; deps.changed();
    try {
      const request: CampaignRequest = { admin: main, count, amount: each.toString(), label, issued: deps.now() };
      const signature = await deps.sign(main, campaignData(request));
      working = 'Making links…'; deps.changed();
      const r = await deps.json('/radio/gift/campaign', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ request, signature }) });
      campaign = { codes: r.codes, amount: r.amount };
    } catch (e) { note = (e as Error).message || 'Not made.'; }
    finally { working = ''; deps.changed(); }
  }

  const linkFor = (radioUrl: string | null, code: string) => giftLink(radioUrl || location.origin + '/radio.html', code);
  const copy = (text: string) => void navigator.clipboard?.writeText(text);
  const share = (url: string) => (navigator as any).share ? (navigator as any).share({ title: 'On-chain music for you', text: 'I sent you some on-chain music on Xtrata Radio 🎁', url }).catch(() => undefined) : copy(url);

  // Built once; only the moving parts are refreshed, so the slider keeps its place while the panel re-renders.
  const range = el('input') as HTMLInputElement;
  range.type = 'range'; range.min = String(GIFT_MIN); range.max = String(GIFT_MAX); range.step = '50000'; range.value = String(amount);
  range.setAttribute('aria-label', 'Gift amount');
  const amountLine = el('p', '', 'ppp-gift-amount');
  const giftButton = button('', () => { const m = deps.main(); if (m) void give(m); }, 'primary');
  const syncAmount = () => { amountLine.textContent = amountText(); giftButton.textContent = `Gift ${stxNice(amount)} STX`; };
  range.oninput = () => { amount = BigInt(range.value); syncAmount(); };
  const amountText = () => `${stxNice(amount)} STX · about ${giftPlays(amount).toLocaleString()} paid plays · you pay ${stxNice(amount + GIFT_FEE)} STX with the network fee`;
  syncAmount();
  const adminCount = el('input') as HTMLInputElement; adminCount.type = 'number'; adminCount.min = '1'; adminCount.max = String(CAMPAIGN_MAX_LINKS); adminCount.value = '10'; adminCount.setAttribute('aria-label', 'How many links');
  const adminAmount = el('input') as HTMLInputElement; adminAmount.type = 'number'; adminAmount.min = '0.1'; adminAmount.max = '1'; adminAmount.step = '0.05'; adminAmount.value = '0.1'; adminAmount.setAttribute('aria-label', 'STX per link');
  const adminLabel = el('input') as HTMLInputElement; adminLabel.maxLength = 40; adminLabel.placeholder = 'Label, e.g. Launch week'; adminLabel.setAttribute('aria-label', 'Campaign label');

  function renderFold(s: Snapshot): HTMLElement | null {
    const g = s.gate?.gifts;
    if (!g?.enabled || ['off', 'elsewhere', 'unsupported'].includes(s.step)) return null;
    const main = deps.main();
    const parts: HTMLElement[] = [el('p', 'Give someone on-chain music. They need no wallet: a passkey and your link is all it takes.', 'ppp-mute')];
    if (!main) {
      parts.push(el('p', 'Connect a Stacks wallet (top right) to send a gift.'));
    } else {
      giftButton.disabled = !!working;
      parts.push(range, amountLine, giftButton);
      if (deps.now() - checked > 30_000) { checked = deps.now(); void refreshMine(main); }
      const mine = loadMine(main);
      if (mine.length) {
        const list = el('ul', '', 'ppp-gift-list');
        for (const x of mine.slice(0, 10)) {
          const st = x.view?.status;
          const status = x.error ? x.error : !st || st === 'pending-deposit' ? (x.txid ? 'payment confirming…' : 'waiting for your payment')
            : st === 'live' ? 'ready to share' : st === 'claiming' || st === 'claimed' ? 'claimed ✓'
            : st === 'refunding' ? 'expired · refund on its way' : st === 'refunded' ? 'expired · refunded to you' : st;
          const li = el('li');
          li.append(el('span', `${stxNice(BigInt(x.amount))} STX`, 't'), el('span', status, x.view?.status === 'claimed' ? 'ppp-ok' : 'ppp-mute'));
          if (x.view?.status === 'live') {
            const url = linkFor(s.gate?.radioUrl ?? null, x.code);
            li.append(button('Copy link', () => copy(url), 'tiny'), button('Share', () => share(url), 'tiny'));
          }
          list.append(li);
        }
        parts.push(list);
      }
      if (g.admin) {
        const make = button('Sign and make links', () => {
          const each = BigInt(Math.round(Number(adminAmount.value) * 1e6));
          void makeCampaign(main, Number(adminCount.value), each, adminLabel.value.trim());
        });
        const box = el('div', '', 'ppp-gift-admin');
        const labelled = (text: string, input: HTMLElement) => { const l = el('label', text); l.append(input); return l; };
        box.append(el('p', 'Campaign links (admin) · paid from the gift treasury', 'ppp-cyan'), labelled('Links ', adminCount), labelled('STX each ', adminAmount), adminLabel, make);
        if (campaign) {
          const all = campaign.codes.map((c) => linkFor(s.gate?.radioUrl ?? null, c)).join('\n');
          const area = el('textarea') as HTMLTextAreaElement; area.readOnly = true; area.value = all; area.rows = Math.min(8, campaign.codes.length);
          box.append(el('p', `${campaign.codes.length} links, ${stxNice(BigInt(campaign.amount))} STX each. Copy them now: they are not shown again.`, 'ppp-warn'), area, button('Copy all', () => copy(all), 'tiny'));
        }
        parts.push(box);
      }
    }
    if (working) parts.push(el('p', working, 'ppp-cyan'));
    if (note) parts.push(el('p', note, /✓/.test(note) ? 'ppp-ok' : 'ppp-warn'));
    fold.replaceChildren(...parts);
    return fold;
  }

  return { banner, funder, renderFold, liveGift, setAside };
}
