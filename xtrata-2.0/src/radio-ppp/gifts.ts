/**
 * Radio gift wallets on the page (server: functions/lib/radio-gifts.ts).
 *
 *  - Recipient: a `?gift=` link is kept on this device until it is claimed. Once their brand-new
 *    listening wallet exists (and is empty) the gift is claimed automatically: the treasury sends it,
 *    and the panel tracks it like a deposit.
 *  - Friend gift: anyone with a Stacks wallet picks 0.1 to 1 STX, pays it (+ the network fee) into the
 *    gift treasury, and gets a link to share once that payment confirms.
 *  - Admin: prefunded batches. The creator signs one request, pays for every copy in ONE transfer to the treasury, and the
 *    links go live when it confirms. Unclaimed copies go back to the creator after 30 days. The treasury pays nothing itself.
 * Where returns go for a gifted wallet comes from the gift record (`funder`), not the chain's first
 * sender, so a friend's gift goes back to the friend.
 */
import { GIFT_FEE, GIFT_MAX, GIFT_MIN, giftLink, giftPlays, isGiftCode, type GiftView } from '../lib/listening-wallet/gifts';
import {
  BATCH_MAX_COPIES, batchBreakdown, batchData, copyAmountForPlays, maxCopyPlays, validBatchAmount, type BatchRequest, type BatchView
} from '../lib/listening-wallet/batches';
import { listedTracks, PLAY_PRESETS, playerData, playerHash, validatePlayer } from '../lib/listening-wallet/gift-players';
import type { FunderResult } from '../lib/listening-wallet/funder';
import { stx } from '../lib/listening-wallet/policy';
import type { Snapshot } from './controller';
import { copyButton, feedbackButton, shareLink } from './feedback';

export interface GiftDeps {
  json(url: string, init?: RequestInit): Promise<any>;
  /** The connected Stacks wallet, if any. */
  main(): string | undefined;
  /** STX transfer from the connected wallet (one popup); resolves with the txid. */
  pay(main: string, recipient: string, amount: bigint, memo: string): Promise<string>;
  /** SIP-018 signature from the connected wallet (one popup). */
  sign(main: string, data: ReturnType<typeof playerData> | ReturnType<typeof batchData>): Promise<string>;
  giftSent(txid: string, amount: bigint): void;
  /** A claim started (true) or ended without a gift (false): the wallet should read as "plays on their way", never empty. */
  claiming?(on: boolean): void;
  /** Album wallets of the open passkey: prove a number is theirs, and track the album's gift once it is on its way. */
  album: {
    bind(slot: number): Promise<{ root: string; slot: number; address: string; issued: number; rootSignature: string; slotSignature: string }>;
    arrived(slot: number, address: string, txid: string, amount: bigint): Promise<void>;
  };
  /** "jim.btc · SP12…AB" style label. */
  who(address?: string): string;
  changed(): void;
  store: { get(key: string): string | null; set(key: string, value: string | null): void };
  now(): number;
}

/** Where public/radio.html puts a `#gift=` code the moment the page opens (and strips it from the URL). */
export const INCOMING_KEY = 'xtrata.radio.gift.incoming.v1';
const mineKey = (main: string) => 'xtrata.radio.gift.mine.v1:' + main;
const batchesKey = (main: string) => 'xtrata.radio.gift.batches.v1:' + main;
/** A prefunded batch as kept on this device. The links exist only here (the server keeps hashes), so they are saved the moment they are made. */
type MyBatch = { id: string; codes: string[]; count: number; amount: string; label: string; player: string | null; depositTo: string; deposit: string; memo: string; at: number;
  txid?: string; view?: BatchView; error?: string };
type Mine = { id: string; code: string; amount: string; at: number; txid?: string; view?: GiftView; error?: string };

const el = (tag: string, text = '', cls = '') => { const n = document.createElement(tag); if (text) n.textContent = text; if (cls) n.className = cls; return n; };
const button = (label: string, run: () => void, cls = '') => { const b = el('button', label, cls) as HTMLButtonElement; b.type = 'button'; b.onclick = run; return b; };
const opt = (label: string, value: string) => { const o = document.createElement('option'); o.textContent = label; o.value = value; return o; };
const stxNice = (v: bigint) => stx(v).replace(/\.?0+$/, '');

export function createGifts(deps: GiftDeps) {
  // ---------------------------------------------------------------- recipient
  /**
   * The gift link waiting on this device. `error` is only for a real dead end (used, expired, not for this wallet):
   * shown red. Anything that can still work by itself (a slow network, the treasury busy or being topped up, a
   * payment not confirmed yet) is `retry`: an amber progress line, and the claim is tried again on its own.
   */
  let incoming: { code: string; view?: GiftView; error?: string; claiming?: boolean; done?: boolean; waiting?: boolean;
    retry?: { text: string }; tries?: number } | null = null;
  /** Waits that grow (5 s, 10 s, 20 s, 30 s, then every minute), so a slow network is not hammered. */
  const backoff = (tries: number) => [5_000, 10_000, 20_000, 30_000][tries] ?? 60_000;
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
    let lookups = 0;
    const lookUp = () => fetch('/radio/gift/status', { method: 'POST', headers: { 'content-type': 'application/json' }, cache: 'no-store', body: JSON.stringify({ code }), signal: AbortSignal.timeout(15_000) })
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));
        if (res.status === 404) { deps.store.set(INCOMING_KEY, null); incoming = { ...incoming!, error: body?.error || 'That gift link is not valid.' }; deps.changed(); return; }
        if (!res.ok) throw new Error('busy');
        const v = body as GiftView;
        incoming = { ...incoming!, view: v, retry: undefined };
        if (['claimed', 'expired', 'refunding', 'refunded'].includes(v.status)) deps.store.set(INCOMING_KEY, null);
        deps.changed();
      })
      .catch(() => {
        // A slow or busy network is not a broken gift: say we are still looking, and look again.
        if (!incoming || incoming.view) return;
        incoming = { ...incoming, retry: { text: 'Still looking up your gift… the network is slow, trying again.' } };
        deps.changed();
        setTimeout(() => void lookUp(), backoff(lookups++));
      });
    void lookUp();
  }
  const liveGift = () => !!incoming?.view && incoming.view.status === 'live' && !incoming.done;
  /** A live gift link that comes with an album: what the album view needs to show it before it is claimed. */
  const incomingAlbum = () => {
    const v = incoming?.view;
    if (!v?.player || !liveGift()) return null;
    return { player: v.player, from: fromLabel(v), plays: giftPlays(BigInt(v.amount)) };
  };
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

  /** Start the claim after the render that asked for it has finished: the claim redraws everything, and must not be painted over by the older draw. */
  const later = (run: () => Promise<void>) => { queueMicrotask(() => void run()); };
  let retryTimer: ReturnType<typeof setTimeout> | undefined;
  /**
   * Claim the open gift. A starter gift goes into this brand-new listening wallet. An album (a gift that comes with a
   * player) goes into its own numbered wallet of the same passkey: the wallet box proves the number is theirs (no popup)
   * and the server records it, so the album's plays and the likes all come back to this listener.
   */
  async function claim(s: Snapshot) {
    if (!incoming || incoming.claiming || !s.listening) return;
    const album = !!incoming.view?.player;
    if (album && !s.root) return;
    incoming.claiming = true; incoming.error = undefined; deps.claiming?.(true); deps.changed();
    const post = async (body: object) => {
      const res = await fetch('/radio/gift/claim', {
        method: 'POST', headers: { 'content-type': 'application/json' }, cache: 'no-store', signal: AbortSignal.timeout(30_000),
        body: JSON.stringify({ code: incoming!.code, turnstile: turnstile.token, ...body })
      });
      return { res, r: await res.json().catch(() => ({})) };
    };
    try {
      let slot = 0, wallet = s.listening, answer: Awaited<ReturnType<typeof post>>;
      if (album) {
        const next = Number((await deps.json('/radio/gift/slots?root=' + encodeURIComponent(s.root!)))?.next);
        if (!Number.isSafeInteger(next) || next < 1) throw new Error('Could not pick a wallet number for this album. Try again.');
        slot = next;
        for (let tries = 0; ; tries++) {
          const binding = await deps.album.bind(slot); // a fresh proof each time: they expire after 15 minutes
          wallet = binding.address;
          answer = await post({ wallet, binding });
          // Someone else's claim took that number a moment ago: the next one is free.
          if (answer.res.status === 409 && /just taken/.test(answer.r?.error || '') && tries < 5) { slot += 1; continue; }
          break;
        }
      } else answer = await post({ wallet });
      const { res, r } = answer;
      if (res.status === 503 && /sending another gift/.test(r?.error || '')) {
        // The treasury sends one gift at a time: wait a moment and try again by itself.
        incoming.waiting = true; deps.claiming?.(true);
        clearTimeout(retryTimer);
        retryTimer = setTimeout(() => { if (incoming) { incoming.waiting = false; deps.changed(); } }, 12_000);
        return;
      }
      if (!res.ok) {
        const said = String(r?.error || '');
        // Forgotten only when it can never work for this visitor: unknown, used up or expired, or a
        // wallet that is not new. "Not paid for yet" or "being sent" can still change.
        const permanent = res.status === 404 || res.status === 410 || (res.status === 409 && /already had a gift|brand-new|already have this album/.test(said));
        if (permanent) { deps.store.set(INCOMING_KEY, null); throw new Error(said || 'This gift cannot be opened.'); }
        // Real stops that do not fix themselves while the page is open: say so plainly, without alarm.
        if (res.status === 429 || res.status === 403 || (res.status === 400 && !/wallet number/i.test(said))) throw new Error(said || `Could not open the gift (${res.status}).`);
        // Everything else can still work: keep going by itself, with an amber line saying what is happening.
        const text = /topping up/.test(said) ? 'Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open.'
          : /not paid for yet/.test(said) ? 'Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does.'
          : /being sent to another wallet/.test(said) ? 'Your gift is busy for a moment. Checking again…'
          : 'Still sending your gift… the network is slow, trying again.';
        throw Object.assign(new Error(text), { retry: true, slow: /topping up|not paid for yet/.test(said) });
      }
      incoming.done = true;
      deps.store.set(INCOMING_KEY, null);
      if (album) await deps.album.arrived(slot, wallet, r.txid, BigInt(r.amount));
      else deps.giftSent(r.txid, BigInt(r.amount));
    } catch (e) {
      const err = e as Error & { retry?: boolean; slow?: boolean };
      // A request that never got an answer (offline, timed out) is a slow network, not a failed gift.
      const unanswered = err.name === 'TypeError' || err.name === 'AbortError' || err.name === 'TimeoutError' || /wallet number/i.test(err.message);
      if (err.retry || unanswered) {
        const tries = incoming.tries ?? 0;
        incoming.tries = tries + 1;
        incoming.retry = { text: err.retry ? err.message : 'Still sending your gift… the network is slow, trying again.' };
        deps.claiming?.(true); // still on its way: keep the calm "arriving" look going
        clearTimeout(retryTimer);
        retryTimer = setTimeout(() => { if (incoming) { incoming.retry = undefined; deps.changed(); } }, err.slow ? 60_000 : backoff(tries));
      } else { incoming.error = err.message; deps.claiming?.(false); }
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
    if (!(sending.state === 'sending' && sending.problem)) return [];
    // The network's own words stay out of sight (a tooltip): they read like an error, and nothing has failed.
    const line = el('p', '🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.', 'ppp-warn');
    line.title = `Network reply: ${sending.problem}`;
    return [line];
  }

  function albumBanner(s: Snapshot, v: GiftView, bare = false): HTMLElement[] {
    const player = v.player!;
    const amount = BigInt(v.amount);
    const out: HTMLElement[] = bare ? [] : [el('p', `🎁 ${fromLabel(v)} sent you “${player.title}”${player.subtitle ? ` by ${player.subtitle}` : ''}: ${listedTracks(player).length} ${listedTracks(player).length === 1 ? 'song' : 'songs'} and ${giftPlays(amount).toLocaleString()} plays of on-chain music.`, 'ppp-gift')];
    const unlocked = !!s.root && ['fund', 'ready', 'over', 'link'].includes(s.step);
    if (!unlocked) {
      if (bare) return out; // the album view says it with its own button
      out.push(el('p', s.step === 'intro' ? 'Tap below and use your face or fingerprint. Your album arrives in a few seconds.' : s.step === 'locked' ? 'Unlock your player and the album arrives.' : 'Open your player and the album arrives.', 'ppp-mute'));
      // The detail is there for anyone who wants it, folded away for everyone else.
      if (s.step === 'intro') {
        const how = document.createElement('details');
        how.className = 'ppp-how';
        const sum = document.createElement('summary');
        sum.textContent = 'How does this work?';
        how.append(sum, el('p', 'Your device makes a passkey: a private key that never leaves it, and that works as your wallet on Stacks. Each album goes into its own numbered wallet under that passkey, so you can keep as many albums as you like.', 'ppp-mute'));
        out.push(how);
      }
      return out;
    }
    if (s.walletCannotAlbums) { out.push(el('p', 'The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.', 'ppp-warn')); return out; }
    const siteKey = s.gate?.gifts?.turnstileSiteKey;
    if (siteKey && !turnstile.token) out.push(el('p', 'One quick check and it is yours:', 'ppp-mute'), turnstileBox(siteKey));
    else if (!incoming!.claiming && !incoming!.error && !incoming!.waiting && !incoming!.retry) later(() => claim(s));
    out.push(...claimLines(s, 'Sending your album…'));
    return out;
  }

  /** How the claim is going: progress in cyan, a wait in amber (with "Try now"), red only for a real dead end. */
  function claimLines(s: Snapshot, sending: string): HTMLElement[] {
    const out: HTMLElement[] = [];
    if (incoming!.claiming || incoming!.waiting) out.push(el('p', incoming!.waiting ? 'Another gift is on its way out first. Yours is next…' : sending, 'ppp-cyan'));
    else if (incoming!.retry) out.push(el('p', incoming!.retry.text, 'ppp-warn'), button('Try now', () => { clearTimeout(retryTimer); incoming!.retry = undefined; void claim(s); }, 'quiet'));
    if (incoming!.error) out.push(el('p', incoming!.error, 'ppp-bad'), button('Try again', () => { incoming!.error = undefined; void claim(s); }));
    return out;
  }

  /**
   * A gift is on its way to this wallet, or about to be claimed into it: the page should look like it is waiting
   * for the gift, not like an empty wallet (no "artists unpaid", no "add funds", no red zero balance).
   */
  const inProgress = (s: Snapshot) =>
    !!incoming && !incoming.done && !incoming.error && liveGift() && !!s.listening && (
      // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
      // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
      !!(incoming.claiming || incoming.waiting || incoming.retry)
      || (!s.linked && !s.creditedTo && (s.createdHere || s.brandNew || !!incoming.view?.player) && (s.balance ?? 0n) === 0n && !s.entries.length));

  /**
   * Lines for the top of the panel while a gift link is in play, or a gift is on its way. `bare`: for the album view,
   * which shows the album itself: only progress, waits and real errors, no headline or "tap below" line.
   */
  function banner(s: Snapshot, opts: { bare?: boolean } = {}): HTMLElement[] {
    const status = watchSending(s);
    if (!incoming || ['off', 'elsewhere'].includes(s.step)) return status;
    const v = incoming.view;
    if (incoming.error && !v) return [el('p', `🎁 ${incoming.error}`, 'ppp-warn')];
    if (!v) return [el('p', incoming.retry ? `🎁 ${incoming.retry.text}` : '🎁 Checking your gift…', incoming.retry ? 'ppp-warn' : 'ppp-mute')];
    if (incoming.done) return status;
    if (v.status === 'claimed' || v.status === 'claiming') return [el('p', '🎁 This gift link has already been used.', 'ppp-mute')];
    if (['expired', 'refunding', 'refunded'].includes(v.status)) return [el('p', '🎁 This gift link has expired.', 'ppp-mute')];
    if (v.status === 'pending-deposit') return [el('p', `🎁 ${fromLabel(v)} is still sending this gift. Check back in a few minutes.`, 'ppp-warn')];
    // An album goes into its own numbered wallet, so any unlocked passkey wallet may receive it, new or old.
    if (v.player) return [...albumBanner(s, v, !!opts.bare), ...status];
    // An existing wallet is open (linked, funded or used before): the gift is not for it. One quiet line,
    // so it does not read as if this wallet were the gift.
    const notNew = !!s.listening && (!(s.createdHere || s.brandNew) || !!s.linked || !!s.creditedTo || (s.balance ?? 0n) > 0n || s.entries.length > 0);
    if (notNew)
      return [el('p', '🎁 A gift link is also waiting on this device. Gifts are for brand-new listening wallets, not this one: share the link with someone new.', 'ppp-mute'), button('Forget this gift link here', setAside, 'quiet')];
    const amount = BigInt(v.amount);
    const plays = giftPlays(amount).toLocaleString();
    const head = el('p',
      `🎁 ${fromLabel(v)} sent you ${stxNice(amount)} STX of on-chain music: about ${plays} paid plays.`, 'ppp-gift');
    const out: HTMLElement[] = [head];
    // Only a brand-new, empty wallet with no main wallet linked takes a gift automatically. A listener who
    // unlocks a wallet they already had (e.g. one linked to their Stacks wallet) keeps the gift link for later.
    const ready = !!s.listening && (s.createdHere || s.brandNew) && !s.linked && !s.creditedTo && s.step === 'fund' && (s.balance ?? 1n) === 0n && !s.depositPending && !s.entries.length;
    const siteKey = s.gate?.gifts?.turnstileSiteKey;
    if (ready) {
      if (siteKey && !turnstile.token) { out.push(el('p', 'One quick check and it is yours:', 'ppp-mute'), turnstileBox(siteKey)); }
      else if (!incoming.claiming && !incoming.error && !incoming.waiting && !incoming.retry) later(() => claim(s));
      out.push(...claimLines(s, 'Sending your gift…'));
    } else if (s.step === 'intro') out.push(el('p', 'Tap below and use your face or fingerprint. Your gift arrives in a few seconds.', 'ppp-mute'));
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

  // ---------------------------------------------------------------- friend gifts and prefunded batches (the fold)
  const fold = el('div', '', 'ppp-gift-fold');
  let amount = 250_000n;
  let working = '';
  let note = '';
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

  // Gift players the admin made on this device (their ids are public; the server holds the definitions).
  type MadePlayer = { id: string; title: string; tracks: number };
  const playersKey = (main: string) => 'xtrata.radio.gift.players.v1:' + main;
  const loadPlayers = (main: string): MadePlayer[] => { try { const v = JSON.parse(deps.store.get(playersKey(main)) || '[]'); return Array.isArray(v) ? v.filter((x) => x && /^[0-9a-f]{16}$/.test(x.id)) : []; } catch { return []; } };

  async function makePlayer(main: string, def: { title: string; subtitle: string; tracks: string; cover?: string }) {
    if (working) return;
    working = 'Checking the player…'; note = ''; deps.changed();
    try {
      const tracks = def.tracks.split(/[\s,]+/).filter(Boolean).map((t) => Number(t.replace(/^#/, '')));
      const definition = validatePlayer({ title: def.title.trim(), subtitle: def.subtitle.trim(), tracks, cover: def.cover?.trim() ? Number(def.cover.trim().replace(/^#/, '')) : null });
      working = 'Sign in your wallet…'; deps.changed();
      const request = { admin: main, hash: playerHash(definition), issued: deps.now() };
      const signature = await deps.sign(main, playerData(request));
      working = 'Making the player…'; deps.changed();
      const r = await deps.json('/radio/gift/player', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ definition, request, signature }) });
      const list = loadPlayers(main).filter((x) => x.id !== r.id);
      list.unshift({ id: r.id, title: r.title, tracks: r.tracks });
      deps.store.set(playersKey(main), JSON.stringify(list.slice(0, 30)));
      note = `${r.existing ? 'That player already exists' : 'Player made'} ✓ “${r.title}” · ${r.tracks} songs. Pick it below for a batch.`;
    } catch (e) { note = (e as Error).message || 'Not made.'; }
    finally { working = ''; deps.changed(); }
  }

  const linkFor = (radioUrl: string | null, code: string) => giftLink(radioUrl || location.origin + '/radio.html', code);
  const share = (url: string) => shareLink({ title: 'On-chain music for you', text: 'I sent you some on-chain music on Xtrata Radio 🎁', url });

  // ---------------------------------------------------------------- prefunded batches
  const loadBatches = (main: string): MyBatch[] => {
    try { const v = JSON.parse(deps.store.get(batchesKey(main)) || '[]'); return Array.isArray(v) ? v.filter((x) => x && /^[0-9a-f]{16}$/.test(x.id) && Array.isArray(x.codes)) : []; } catch { return []; }
  };
  const saveBatches = (main: string, list: MyBatch[]) => deps.store.set(batchesKey(main), JSON.stringify(list.slice(0, 20)));
  const batchDone = (b: MyBatch) => !!b.view && b.view.status === 'live' && b.view.copies.waiting + b.view.copies.claiming + b.view.copies.refunding === 0;
  const postJson = (url: string, body: unknown) => deps.json(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  let checkedBatches = 0;

  /** Brings every unfinished batch up to date; a payment the wallet never reported is found by the batch's memo. */
  async function refreshBatches(main: string) {
    const list = loadBatches(main);
    for (const b of list) {
      if (batchDone(b)) continue;
      try {
        b.view = !b.view || b.view.status === 'pending-deposit'
          ? await postJson('/radio/gift/batch/confirm', { id: b.id, ...(b.txid ? { txid: b.txid } : {}) })
          : await deps.json('/radio/gift/batch?id=' + b.id);
        b.error = undefined;
      } catch (e) { b.error = (e as Error).message; }
    }
    // Batches this creator made on another device: listed, but their links are not here.
    try {
      const r = await deps.json('/radio/gift/batches?creator=' + encodeURIComponent(main));
      for (const v of (r?.batches ?? []) as BatchView[]) {
        const mine = list.find((x) => x.id === v.id);
        if (mine) { if (!mine.error) mine.view = v; continue; }
        list.push({ id: v.id, codes: [], count: v.count, amount: v.amount, label: v.label, player: v.player, depositTo: '', deposit: v.deposit, memo: v.memo, at: 0, view: v });
      }
    } catch { /* the local list is still right; the server list is a bonus */ }
    saveBatches(main, list);
    deps.changed();
  }

  /** The creator's payment. Kept separate so a payment that was cancelled can be retried from the list. */
  async function payBatch(main: string, id: string) {
    const b = loadBatches(main).find((x) => x.id === id);
    if (!b || !b.depositTo || working) return;
    working = 'Approve the payment in your wallet…'; note = ''; deps.changed();
    try {
      const txid = await deps.pay(main, b.depositTo, BigInt(b.deposit), b.memo);
      const after = loadBatches(main);
      const x = after.find((y) => y.id === id);
      if (x) x.txid = txid;
      saveBatches(main, after);
      note = 'Paid ✓ Your links work as soon as the payment confirms (a few minutes).';
      working = ''; void refreshBatches(main);
    } catch (e) {
      // The links are already saved: a cancelled or failed payment can simply be retried from the list.
      note = `${/cancel/i.test((e as Error).message) ? 'Payment cancelled.' : ((e as Error).message || 'Not paid.')} Your links are saved below. Tap Pay now when you are ready.`;
    } finally { working = ''; deps.changed(); }
  }

  async function makeBatch(main: string, plan: ReturnType<typeof batchPlan>, label: string, player?: string) {
    if (working) return;
    if (!plan.ok) { note = plan.reason; deps.changed(); return; }
    working = 'Sign in your wallet…'; note = ''; deps.changed();
    let made: { id: string; codes: string[]; depositTo: string; deposit: string; memo: string; amount: string } | null = null;
    try {
      const request: BatchRequest = { creator: main, count: plan.count, amount: plan.amount.toString(), label, issued: deps.now(), ...(player ? { player } : {}) };
      const signature = await deps.sign(main, batchData(request));
      working = 'Making your links…'; deps.changed();
      made = await postJson('/radio/gift/batch', { request, signature });
      // The links are shown by the server once. Save them before anything else can go wrong.
      const list = loadBatches(main);
      list.unshift({ id: made!.id, codes: made!.codes, count: plan.count, amount: made!.amount, label, player: player ?? null, depositTo: made!.depositTo, deposit: made!.deposit, memo: made!.memo, at: deps.now() });
      saveBatches(main, list);
    } catch (e) { note = (e as Error).message || 'Not made.'; working = ''; deps.changed(); return; }
    working = ''; deps.changed();
    await payBatch(main, made!.id);
  }

  /** What the batch form would cost for the current choices (also used to explain it). */
  function batchPlan() {
    const album = !!batchPlayer.value;
    const plays = batchPreset.value === 'max' ? maxCopyPlays(album) : Number(batchPreset.value);
    const amount = copyAmountForPlays(plays, album);
    const count = Number(batchCount.value);
    if (!Number.isInteger(count) || count < 1 || count > BATCH_MAX_COPIES) return { ok: false as const, reason: `Make 1 to ${BATCH_MAX_COPIES} copies at a time.`, album, plays, amount, count };
    if (!validBatchAmount(amount)) return { ok: false as const, reason: 'Each copy must be 0.1 to 1 STX.', album, plays, amount, count };
    return { ok: true as const, reason: '', album, plays, amount, count, bill: batchBreakdown(count, amount, album) };
  }
  const billText = () => {
    const p = batchPlan();
    if (!p.ok) return p.reason;
    const b = p.bill;
    return `Each copy: ${p.plays.toLocaleString()} paid plays (${stxNice(b.holders)} to song holders, ${stxNice(b.fees)} network fees)`
      + `${p.album ? `, ${stxNice(b.float)} for the album’s likes` : ''}, ${stxNice(b.reserve)} kept so a listener can return what is left, `
      + `+ ${stxNice(b.sendFee)} to send it = ${stxNice(b.perCopy)} STX. ${p.count} copies = ${stxNice(b.total)} STX, paid now in one payment. `
      + 'Copies nobody claims within 30 days come back to you.';
  };

  const batchLinks = (radioUrl: string | null, b: MyBatch) => b.codes.map((c) => linkFor(radioUrl, c));

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
  const playerTitle = el('input') as HTMLInputElement; playerTitle.maxLength = 60; playerTitle.placeholder = 'Title, e.g. Proof of Sound'; playerTitle.setAttribute('aria-label', 'Player title');
  const playerSubtitle = el('input') as HTMLInputElement; playerSubtitle.maxLength = 80; playerSubtitle.placeholder = 'Artist (optional)'; playerSubtitle.setAttribute('aria-label', 'Player subtitle');
  const playerTracks = el('textarea') as HTMLTextAreaElement; playerTracks.rows = 3; playerTracks.placeholder = 'Radio song numbers in play order, e.g. 1021, 1022, 1023'; playerTracks.setAttribute('aria-label', 'Songs');
  const playerCover = el('input') as HTMLInputElement; playerCover.inputMode = 'numeric'; playerCover.placeholder = 'Cover inscription number (optional), shown when the album loads'; playerCover.setAttribute('aria-label', 'Cover inscription');

  const batchPlayer = el('select') as HTMLSelectElement; batchPlayer.setAttribute('aria-label', 'Batch album');
  const batchPreset = el('select') as HTMLSelectElement; batchPreset.setAttribute('aria-label', 'Plays per copy');
  for (const n of PLAY_PRESETS) batchPreset.append(opt(`${n.toLocaleString()} plays`, String(n)));
  batchPreset.append(opt('Max (1 STX)', 'max'));
  const batchCount = el('input') as HTMLInputElement; batchCount.type = 'number'; batchCount.min = '1'; batchCount.max = String(BATCH_MAX_COPIES); batchCount.value = '10'; batchCount.setAttribute('aria-label', 'Copies');
  const batchLabel = el('input') as HTMLInputElement; batchLabel.maxLength = 40; batchLabel.placeholder = 'Label, e.g. Opera launch'; batchLabel.setAttribute('aria-label', 'Batch label');
  const batchBill = el('p', '', 'ppp-mute');
  const syncBill = () => { batchBill.textContent = billText(); };
  for (const x of [batchPlayer, batchPreset, batchCount]) { x.oninput = syncBill; x.onchange = syncBill; }
  syncBill();

  function renderFold(s: Snapshot): HTMLElement | null {
    const g = s.gate?.gifts;
    // Albums only: the "send music to a friend" gift is retired from the page. The section is for gift admins, who make
    // albums and fund batches of copies. (The server still honours old friend-gift links and refunds.)
    if (!g?.enabled || !g.admin || ['off', 'elsewhere', 'unsupported'].includes(s.step)) return null;
    const main = deps.main();
    const parts: HTMLElement[] = [el('p', 'Make an album and fund copies of it to give away.', 'ppp-mute')];
    if (!main) {
      parts.push(el('p', 'Connect a Stacks wallet (top right) to make albums.'));
    } else {
      if (g.admin) {
        const box = el('div', '', 'ppp-gift-admin');
        const labelled = (text: string, input: HTMLElement) => { const l = el('label', text); l.append(input); return l; };
        // Players first: a player is an album that comes with a gift and has no free mode.
        const made = loadPlayers(main);
        box.append(
          el('p', 'Gift players (admin) · an album that comes with the gift', 'ppp-cyan'),
          playerTitle, playerSubtitle, playerTracks, playerCover,
          button('Sign and make player', () => void makePlayer(main, { title: playerTitle.value, subtitle: playerSubtitle.value, tracks: playerTracks.value, cover: playerCover.value }))
        );
        // Prefunded batches: the creator pays for every copy up front.
        const gobtn = button('Sign, pay and make links', () => { void makeBatch(main, batchPlan(), batchLabel.value.trim(), batchPlayer.value || undefined); });
        gobtn.disabled = !!working;
        const keepB = batchPlayer.value;
        batchPlayer.replaceChildren(opt('No album (starter copies)', ''), ...made.map((x) => opt(`${x.title} · ${x.tracks} songs`, x.id)));
        if (made.some((x) => x.id === keepB)) batchPlayer.value = keepB;
        syncBill();
        box.append(
          el('p', 'Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after 30 days', 'ppp-cyan'),
          labelled('Album ', batchPlayer), labelled('Plays each ', batchPreset), labelled('Copies ', batchCount), batchLabel, batchBill, gobtn);
        if (deps.now() - checkedBatches > 30_000) { checkedBatches = deps.now(); void refreshBatches(main); }
        const myBatches = loadBatches(main);
        if (myBatches.length) {
          const blist = el('ul', '', 'ppp-gift-list');
          for (const b of myBatches.slice(0, 10)) {
            const v = b.view, c = v?.copies;
            const status = b.error ? b.error : !v || v.status === 'pending-deposit' ? (b.txid ? 'payment confirming…' : 'waiting for your payment')
              : `${c!.claimed} of ${v.count} claimed${c!.refunding + c!.refunded ? ` · ${c!.refunded} refunded${c!.refunding ? `, ${c!.refunding} on their way` : ''}` : ''}`;
            const li = el('li');
            li.append(el('span', `${b.label || 'Batch'} · ${b.count} × ${stxNice(BigInt(b.amount))} STX`, 't'), el('span', status, 'ppp-mute'));
            if (!b.txid && b.depositTo && (!v || v.status === 'pending-deposit')) li.append(button('Pay now', () => void payBatch(main, b.id), 'tiny'));
            if (b.codes.length && v?.status === 'live') {
              const links = batchLinks(s.gate?.radioUrl ?? null, b);
              li.append(
                copyButton('batch-copy:' + b.id, 'Copy all links', () => links.join('\n'), 'tiny', deps.changed),
                copyButton('batch-csv:' + b.id, 'Copy as CSV', () => ['copy,link', ...links.map((u, n) => `${n + 1},${u}`)].join('\n'), 'tiny', deps.changed));
            } else if (!b.codes.length) li.append(el('span', 'links were made on another device', 'ppp-mute'));
            blist.append(li);
          }
          box.append(blist);
        }
        parts.push(box);
      }
    }
    if (working) parts.push(el('p', working, 'ppp-cyan'));
    if (note) parts.push(el('p', note, /✓/.test(note) ? 'ppp-ok' : 'ppp-warn'));
    fold.replaceChildren(...parts);
    return fold;
  }

  /** The gift code still waiting on this device (to carry it to another browser), or null. */
  const pendingCode = () => (incoming && !incoming.done && (!incoming.view || incoming.view.status === 'live') ? incoming.code : null);
  return { banner, funder, renderFold, liveGift, incomingAlbum, setAside, pendingCode, inProgress };
}
