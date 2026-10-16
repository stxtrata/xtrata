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
import { amountForPlays, listedTracks, PLAY_PRESETS, playerData, playerHash, validatePlayer } from '../lib/listening-wallet/gift-players';
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
  sign(main: string, data: ReturnType<typeof campaignData> | ReturnType<typeof playerData>): Promise<string>;
  giftSent(txid: string, amount: bigint): void;
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
  /**
   * Claim the open gift. A starter gift goes into this brand-new listening wallet. An album (a gift that comes with a
   * player) goes into its own numbered wallet of the same passkey: the wallet box proves the number is theirs (no popup)
   * and the server records it, so the album's plays and the likes all come back to this listener.
   */
  async function claim(s: Snapshot) {
    if (!incoming || incoming.claiming || !s.listening) return;
    const album = !!incoming.view?.player;
    if (album && !s.root) return;
    incoming.claiming = true; incoming.error = undefined; deps.changed();
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
        incoming.waiting = true;
        clearTimeout(retryTimer);
        retryTimer = setTimeout(() => { if (incoming) { incoming.waiting = false; deps.changed(); } }, 12_000);
        return;
      }
      if (!res.ok) {
        const said = String(r?.error || '');
        // Forgotten only when it can never work for this visitor: unknown, used up or expired, or a
        // wallet that is not new. "Not paid for yet" or "being sent" can still change.
        const permanent = res.status === 404 || res.status === 410 || (res.status === 409 && /already had a gift|brand-new/.test(said));
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
        clearTimeout(retryTimer);
        retryTimer = setTimeout(() => { if (incoming) { incoming.retry = undefined; deps.changed(); } }, err.slow ? 60_000 : backoff(tries));
      } else incoming.error = err.message;
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

  function albumBanner(s: Snapshot, v: GiftView): HTMLElement[] {
    const player = v.player!;
    const amount = BigInt(v.amount);
    const out: HTMLElement[] = [el('p', `🎁 ${fromLabel(v)} sent you “${player.title}”${player.subtitle ? ` by ${player.subtitle}` : ''}: ${listedTracks(player).length} ${listedTracks(player).length === 1 ? 'song' : 'songs'} and ${giftPlays(amount).toLocaleString()} plays of on-chain music.`, 'ppp-gift')];
    const unlocked = !!s.root && ['fund', 'ready', 'over', 'link'].includes(s.step);
    if (!unlocked) {
      out.push(el('p', s.step === 'intro' ? 'Tap below: your passkey makes a listening wallet, and the album arrives in its own wallet. You can keep as many albums as you like.' : s.step === 'locked' ? 'Unlock your listening wallet and the album arrives in its own wallet.' : 'Open your listening wallet and the album arrives in its own wallet.', 'ppp-mute'));
      return out;
    }
    if (s.walletCannotAlbums) { out.push(el('p', 'The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.', 'ppp-warn')); return out; }
    const siteKey = s.gate?.gifts?.turnstileSiteKey;
    if (siteKey && !turnstile.token) out.push(el('p', 'One quick check and it is yours:', 'ppp-mute'), turnstileBox(siteKey));
    else if (!incoming!.claiming && !incoming!.error && !incoming!.waiting && !incoming!.retry) void claim(s);
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
    !!incoming && !incoming.done && !incoming.error && liveGift() && !!s.listening && !s.linked && !s.creditedTo
    && (s.createdHere || s.brandNew || !!incoming.view?.player) && (s.balance ?? 0n) === 0n && !s.entries.length;

  /** Lines for the top of the panel while a gift link is in play, or a gift is on its way. */
  function banner(s: Snapshot): HTMLElement[] {
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
    if (v.player) return [...albumBanner(s, v), ...status];
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
      else if (!incoming.claiming && !incoming.error && !incoming.waiting && !incoming.retry) void claim(s);
      out.push(...claimLines(s, 'Sending your gift…'));
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
      note = `${r.existing ? 'That player already exists' : 'Player made'} ✓ “${r.title}” · ${r.tracks} songs. Pick it below for a campaign.`;
    } catch (e) { note = (e as Error).message || 'Not made.'; }
    finally { working = ''; deps.changed(); }
  }

  async function makeCampaign(main: string, count: number, each: bigint, label: string, player?: string) {
    if (working) return;
    working = 'Sign in your wallet…'; note = ''; campaign = null; deps.changed();
    try {
      const request: CampaignRequest = { admin: main, count, amount: each.toString(), label, issued: deps.now(), ...(player ? { player } : {}) };
      const signature = await deps.sign(main, campaignData(request));
      working = 'Making links…'; deps.changed();
      const r = await deps.json('/radio/gift/campaign', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ request, signature }) });
      campaign = { codes: r.codes, amount: r.amount };
    } catch (e) { note = (e as Error).message || 'Not made.'; }
    finally { working = ''; deps.changed(); }
  }

  const linkFor = (radioUrl: string | null, code: string) => giftLink(radioUrl || location.origin + '/radio.html', code);
  const share = (url: string) => shareLink({ title: 'On-chain music for you', text: 'I sent you some on-chain music on Xtrata Radio 🎁', url });

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
  const adminAmount = el('input') as HTMLInputElement; adminAmount.type = 'number'; adminAmount.min = '0.1'; adminAmount.max = '1'; adminAmount.step = '0.05'; adminAmount.value = String(Number(amountForPlays(PLAY_PRESETS[0])) / 1e6); adminAmount.setAttribute('aria-label', 'STX per link');
  const playerTitle = el('input') as HTMLInputElement; playerTitle.maxLength = 60; playerTitle.placeholder = 'Title, e.g. Proof of Sound'; playerTitle.setAttribute('aria-label', 'Player title');
  const playerSubtitle = el('input') as HTMLInputElement; playerSubtitle.maxLength = 80; playerSubtitle.placeholder = 'Artist (optional)'; playerSubtitle.setAttribute('aria-label', 'Player subtitle');
  const playerTracks = el('textarea') as HTMLTextAreaElement; playerTracks.rows = 3; playerTracks.placeholder = 'Radio song numbers in play order, e.g. 1021, 1022, 1023'; playerTracks.setAttribute('aria-label', 'Songs');
  const playerCover = el('input') as HTMLInputElement; playerCover.inputMode = 'numeric'; playerCover.placeholder = 'Cover inscription number (optional), shown when the album loads'; playerCover.setAttribute('aria-label', 'Cover inscription');
  const adminPlayer = el('select') as HTMLSelectElement; adminPlayer.setAttribute('aria-label', 'Gift player');
  const adminPreset = el('select') as HTMLSelectElement; adminPreset.setAttribute('aria-label', 'Plays per link');
  for (const n of PLAY_PRESETS) adminPreset.append(opt(`${n.toLocaleString()} plays`, String(amountForPlays(n))));
  adminPreset.append(opt('Max (1 STX)', String(GIFT_MAX)), opt('Custom STX', ''));
  adminPreset.onchange = () => { if (adminPreset.value) adminAmount.value = String(Number(adminPreset.value) / 1e6); };
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
            li.append(copyButton('gift-copy:' + x.id, 'Copy link', () => url, 'tiny', deps.changed), feedbackButton('gift-share:' + x.id, 'Share', () => share(url), 'tiny', deps.changed));
          }
          list.append(li);
        }
        parts.push(list);
      }
      if (g.admin) {
        const make = button('Sign and make links', () => {
          const each = BigInt(Math.round(Number(adminAmount.value) * 1e6));
          void makeCampaign(main, Number(adminCount.value), each, adminLabel.value.trim(), adminPlayer.value || undefined);
        });
        const box = el('div', '', 'ppp-gift-admin');
        const labelled = (text: string, input: HTMLElement) => { const l = el('label', text); l.append(input); return l; };
        // Players first: a player is an album that comes with a gift and has no free mode.
        const made = loadPlayers(main);
        const keep = adminPlayer.value;
        adminPlayer.replaceChildren(opt('No player (plain gift)', ''), ...made.map((x) => opt(`${x.title} · ${x.tracks} songs`, x.id)));
        if (made.some((x) => x.id === keep)) adminPlayer.value = keep;
        box.append(
          el('p', 'Gift players (admin) · an album that comes with the gift', 'ppp-cyan'),
          playerTitle, playerSubtitle, playerTracks, playerCover,
          button('Sign and make player', () => void makePlayer(main, { title: playerTitle.value, subtitle: playerSubtitle.value, tracks: playerTracks.value, cover: playerCover.value })),
          el('p', 'Campaign links (admin) · paid from the gift treasury', 'ppp-cyan'),
          labelled('Player ', adminPlayer), labelled('Plays each ', adminPreset), labelled('Links ', adminCount), labelled('STX each ', adminAmount), adminLabel, make);
        if (campaign) {
          const all = campaign.codes.map((c) => linkFor(s.gate?.radioUrl ?? null, c)).join('\n');
          const area = el('textarea') as HTMLTextAreaElement; area.readOnly = true; area.value = all; area.rows = Math.min(8, campaign.codes.length);
          box.append(el('p', `${campaign.codes.length} links, ${stxNice(BigInt(campaign.amount))} STX each. Copy them now: they are not shown again.`, 'ppp-warn'), area, copyButton('campaign-copy', 'Copy all', () => all, 'tiny', deps.changed));
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
  return { banner, funder, renderFold, liveGift, setAside, pendingCode, inProgress };
}
