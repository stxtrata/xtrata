/**
 * Casino room client for /casino (P1 of docs/plans/CASINO-PRESENCE-PLAN.md).
 *
 * What it does: connects to the live room (a Durable Object behind /casino/room/*), lets a visitor join with ONE free wallet
 * signature, tells the room which seat or machine the visitor is at, and hands the page the list of other people so it can draw
 * them. It never touches money or the casino's own game state, and it is fail-open: if the room is switched off, unreachable or
 * broken, nothing is drawn, no button appears and the casino plays exactly as before.
 *
 * The page it talks to is public/casino/index.html, through one small contract that the page publishes as window.PXRoomHost:
 *   currentSpot(): string | null          the seat/machine id the visitor is at right now (ids: functions/lib/casino-room.ts)
 *   setPeople(list): void                 everyone else in the room: { key (address), spot, label, since }
 * and an optional  mount(): HTMLElement   where the "Room" button goes (the page's top-right button group).
 * and an optional  play(spot, spin): void  another player's spin at a cabinet, for the page to replay on that cabinet
 *
 * Spins: the page announces the visitor's own spins with a `px-room-play` window event ({ spot, s: reel stops, b: bet, f: free }).
 * This client passes them to the room only when the room lists the `play` feature and the visitor holds that cabinet, and hands
 * everyone else's spins to `play()`. Nothing about a spin moves money or is checked here; it only makes a cabinet look alive.
 *
 * Built with `npm run build:casino-room` into public/casino/room.js (not part of `prebuild`, so it can never break a deploy).
 */
import { createAddress, addressToString, AddressVersion } from '@stacks/transactions';
import { requestStructuredSignature } from '../lib/wallet/structured-sign';
import { createNameCache } from '../lib/bns/name-cache';
import { resolvePrimaryBnsName } from '../lib/bns/primary';
import { roomProofData, type RoomChallenge } from '../../functions/lib/casino-room-proof';
import { connectWallet, connectTrail, rememberProvider, walletMessage, type LinkedWallet, type WalletKind } from './wallet';
import { createChat, type Chat } from './chat';
import { isChatError } from './chat-core';

type Person = { key: string; spot: string; label: string; since: number };
type Spin = { a: string; s: number[]; b: number; f: boolean };
interface PXRoomHost {
  version: number;
  currentSpot(): string | null;
  setPeople(list: Person[]): void;
  mount?(): HTMLElement | null;
  play?(spot: string, spin: Spin): void;
}
type SpotView = { a: string; n: string; since: number };
type Signed = { address: string; hash160?: string; expiresAt?: number };

const S = {
  service: 'unknown' as 'unknown' | 'offline' | 'ok',
  signed: null as Signed | null,
  wallet: null as LinkedWallet | null,
  ws: null as WebSocket | null,
  connected: false,
  attempts: 0,
  replaced: false,
  you: null as null | { a: string | null; n: string; guest: boolean },
  features: [] as string[],           // what the room says it can do ('play': spins); an older room lists nothing
  spots: {} as Record<string, SpotView>,
  joined: 0,
  guests: 0,
  busy: '' as '' | 'connect' | 'sign',
  error: '',
  open: false,
  want: null as string | null,
  badSpot: null as string | null,     // a spot the room said it has no such place (an older room Worker): not asked again
  yielded: null as string | null,     // a spot another tab of the same player took from this one: not asked for again until this tab moves
  standSent: null as string | null,   // the spot this tab last asked to stand up from: asked once, not every 0.6 s
  lastSent: 0,
  host: null as PXRoomHost | null,
  retryTimer: 0
};

let chat: Chat | null = null;      // the floating chat column (chat.ts); made with the button, only when the room is on

const short = (a: string) => (a.length <= 12 ? a : `${a.slice(0, 5)}…${a.slice(-4)}`);
const mainnetOf = (a: string) => {
  if (a.startsWith('SP')) return a;
  const d = createAddress(a);
  return addressToString({ ...d, version: AddressVersion.MainnetSingleSig });
};
// Names are looked up on the mainnet address of the same key (BNS names live on mainnet; ST and SP share one key).
const names = createNameCache((address) => resolvePrimaryBnsName({ address: mainnetOf(address), network: 'mainnet' }), () => { pushPeople(); chat?.refreshNames(); });
const labelFor = (address: string) => {
  let name: string | null = null;
  try { name = names.get(address); } catch { /* bad address: show it short */ }
  return name || short(address);
};

// ------------------------------------------------------------------ the page

const pushPeople = () => {
  if (!S.host || S.service !== 'ok') return;
  const me = S.you?.a ?? null;
  const list: Person[] = Object.entries(S.spots)
    .filter(([, v]) => v.a !== me)
    .map(([spot, v]) => ({ key: v.a, spot, label: labelFor(v.a), since: v.since }));
  try { S.host.setPeople(list); } catch (e) { console.warn('[room] the page could not draw the people', e); }
};

// ------------------------------------------------------------------ the room service

const postJson = async (path: string, init?: RequestInit) => {
  const res = await fetch(path, { credentials: 'same-origin', ...init });
  let body: any = null;
  try { body = await res.json(); } catch { /* no body */ }
  return { res, body };
};

const send = (msg: unknown) => {
  if (S.ws?.readyState !== WebSocket.OPEN) return false;
  S.ws.send(JSON.stringify(msg));
  S.lastSent = Date.now();
  return true;
};

/** Bring the room in line with where the visitor is: sit when they sit, stand when they stand. */
const reconcile = () => {
  if (S.service !== 'ok' || !S.connected || !S.you || S.you.guest || !S.signed) return;
  const mine = Object.entries(S.spots).find(([, v]) => v.a === S.you!.a)?.[0] ?? null;
  if (S.want) {
    if (mine !== S.want && S.want !== S.badSpot && S.want !== S.yielded && !S.spots[S.want] && Date.now() - S.lastSent > 1200) send({ t: 'sit', spot: S.want });
  } else if (mine && mine !== S.standSent && Date.now() - S.lastSent > 600) {
    // Once per spot. The room only stands up the connection that sat there, so if the seat belongs to another tab or device of
    // this player, repeating this would never take effect and would only run into the room's message limit ("slow down").
    S.standSent = mine;
    send({ t: 'stand' });
  }
};

const connect = () => {
  if (S.service !== 'ok' || S.ws) return;
  S.attempts += 1;
  let ws: WebSocket;
  try { ws = new WebSocket(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/casino/room/ws`); } catch { return retry(); }
  S.ws = ws;
  ws.onopen = () => { S.connected = true; S.attempts = 0; paint(); };
  ws.onmessage = (event) => {
    let m: any;
    try { m = JSON.parse(String(event.data)); } catch { return; }
    switch (m.t) {
      case 'room':
        S.you = m.you; S.spots = m.spots || {}; S.joined = m.joined; S.guests = m.guests;
        S.features = Array.isArray(m.features) ? m.features.filter((f: unknown) => typeof f === 'string') : [];
        S.standSent = null;                                 // a fresh connection holds no seat yet
        if (S.signed && S.you?.guest) S.signed = null;      // the session ran out (4 hours) while the page stayed open
        chat?.room(m.players, !!(S.you && !S.you.guest));
        break;
      case 'sat': S.spots[m.spot] = m.who; break;
      case 'stood': delete S.spots[m.spot]; if (S.standSent === m.spot) S.standSent = null; break;
      case 'moved': S.yielded = m.spot; break;       // another tab of this player sat down elsewhere: that tab wins; this one stops asking
      case 'count': S.joined = m.joined; S.guests = m.guests; break;
      case 'say': case 'dm': chat?.heard(m); return;
      case 'join': chat?.joined(m.who); return;
      case 'leave': chat?.left(m.a); return;
      case 'reported': chat?.reported(); return;
      case 'play':
        // Another player's spin: the page spins its copy of that cabinet to the same stops. A failure there changes nothing else.
        if (typeof m.spot === 'string' && Array.isArray(m.s) && typeof m.b === 'number') {
          try { S.host?.play?.(m.spot, { a: String(m.a || ''), s: m.s, b: m.b, f: !!m.f }); } catch (e) { console.warn('[room] the page could not show a spin', e); }
        }
        return;
      case 'err':
        if (typeof m.code === 'string' && m.code.startsWith('play-')) return;     // a spin the room did not pass on: nothing to show
        if (m.code === 'no-such-spot') S.badSpot = S.want;
        else if (isChatError(m.code) && chat?.failed(m.code)) { /* chat showed it */ }
        else if (m.code === 'slow-down') S.lastSent = Date.now() + 3000;    // the seat updates were too quick: wait a few seconds before the next
        return;
      default: return;      // moved, pong: nothing to draw; reconcile() decides whether to try again
    }
    pushPeople(); reconcile(); paint();
  };
  ws.onclose = (event) => {
    if (S.ws !== ws) return;     // a newer connection replaced this one on purpose
    S.ws = null; S.connected = false;
    S.spots = {}; pushPeople();
    chat?.disconnected();
    if (event.code === 4001) { S.replaced = true; paint(); return; }     // another tab of the visitor's took over
    paint(); retry();
  };
  ws.onerror = () => { /* onclose follows */ };
};

const retry = () => {
  window.clearTimeout(S.retryTimer);
  const wait = Math.min(15_000, 1000 * 2 ** Math.min(S.attempts, 4));
  S.retryTimer = window.setTimeout(() => { if (!S.ws) connect(); }, wait);
};

const reconnect = () => {
  const old = S.ws; S.ws = null; S.connected = false; S.attempts = 0; S.replaced = false;
  try { old?.close(1000, 'client'); } catch { /* already closed */ }
  connect();
};

// ------------------------------------------------------------------ sign in

async function signIn(wallet: LinkedWallet) {
  const { res: cres, body: cbody } = await postJson(`/casino/room/challenge?address=${encodeURIComponent(wallet.address)}`);
  if (!cres.ok) throw new Error(cbody?.error || `The room answered ${cres.status}.`);
  const challenge = cbody.challenge as RoomChallenge;
  const { domain, message } = roomProofData(challenge);
  S.busy = 'sign'; paint();
  let signature: string;
  try {
    signature = await requestStructuredSignature({
      domain, message, network: challenge.network, stxAddress: wallet.address,
      appDetails: { name: 'ParallaX Casino', icon: `${location.origin}/favicons/xtrata-apple-touch-icon.png` }
    });
  } catch (e) { throw new Error('The wallet did not sign: ' + walletMessage(e)); }
  const { res: sres, body: sbody } = await postJson('/casino/room/session', {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ challenge, signature })
  });
  if (!sres.ok) throw new Error(sbody?.error || `The room answered ${sres.status}.`);
  S.signed = { address: sbody.address, hash160: sbody.hash160, expiresAt: sbody.expiresAt };
  reconnect();      // the cookie is set: reconnect so the room knows who this is
}

async function join(kind: WalletKind) {
  if (S.busy) return;
  S.error = ''; S.busy = 'connect'; paint();
  try {
    S.wallet = await connectWallet(kind);
    rememberProvider(kind);
    await signIn(S.wallet);
    S.open = false;
  } catch (e) {
    S.error = walletMessage(e);
  } finally {
    S.busy = ''; paint();
  }
}

async function leave() {
  try { await postJson('/casino/room/session', { method: 'DELETE' }); } catch { /* the cookie dies by itself in 4 hours */ }
  S.signed = null; S.wallet = null; S.error = '';
  chat?.endSession();
  chat?.disconnected();
  reconnect(); paint();
}

// ------------------------------------------------------------------ the button and its panel

const CSS = `
#pxroom{position:relative;display:inline-flex;gap:inherit;align-items:center}
#pxroom-btn .n,#pxchat-btn .n{white-space:nowrap}
#pxchat-btn .ic{display:none}
@media(max-width:620px){
  #pxroom{gap:6px}
  #pxroom-btn .lbl,#pxchat-btn .lbl{display:none}
  #pxroom-btn i{margin:0 2px 0 0}
  #pxchat-btn .ic{display:inline}
  #pxchat-btn .dot{position:absolute;top:-6px;right:-6px;margin:0}
  #pxchat-btn{position:relative;overflow:visible!important}
}
#pxroom-btn{font:inherit;cursor:pointer}
#pxroom-btn i{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px;background:#8a8f98;vertical-align:1px}
#pxroom-btn.live i{background:#2fae66;box-shadow:0 0 6px #2fae66}
#pxroom-btn.wait i{background:#e3b84a}
#pxroom-panel{position:fixed;top:max(64px,calc(env(safe-area-inset-top) + 54px));right:10px;width:min(320px,calc(100vw - 20px));z-index:40;box-sizing:border-box;padding:14px 16px;border-radius:12px;background:rgba(12,9,14,.98);backdrop-filter:blur(6px);color:var(--ink,#f6ead0);border:1px solid var(--gold,#e3b84a);box-shadow:0 10px 40px rgba(0,0,0,.55);font-size:13px;line-height:1.45;pointer-events:auto}
#pxroom-panel[hidden]{display:none}
#pxroom-panel h3{margin:0 0 6px;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold,#e3b84a);font-weight:700}
#pxroom-panel p{margin:0 0 10px;color:var(--dim,#b7a587)}
#pxroom-panel .row{display:flex;gap:8px;flex-wrap:wrap}
#pxroom-panel button{font:inherit;cursor:pointer;flex:1 1 120px;padding:9px 12px;border-radius:8px;background:rgba(227,184,74,.12);color:var(--ink,#f6ead0);border:1px solid var(--gold,#e3b84a)}
#pxroom-panel button:hover:not(:disabled){background:rgba(227,184,74,.26)}
#pxroom-panel button:disabled{opacity:.5;cursor:default}
#pxroom-panel .err{color:#ff8a8a;margin:8px 0 0}
#pxroom-panel .who{color:var(--ink,#f6ead0);font-weight:600;word-break:break-all}
#pxroom-panel .fact{font-size:12px;line-height:1.5;margin:0 0 8px}
#pxroom-panel .fact b{color:var(--gold,#e3b84a);font-weight:700;letter-spacing:.06em;text-transform:uppercase;font-size:11px}
`;

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, text?: string, cls?: string) => {
  const e = document.createElement(tag);
  if (text !== undefined) e.textContent = text;
  if (cls) e.className = cls;
  return e;
};

/** A small labelled line for the panel: bold label, then a plain sentence (textContent only, nothing is parsed as HTML). */
const fact = (label: string, text: string) => {
  const p = el('p', undefined, 'fact');
  p.append(el('b', label), document.createTextNode(` ${text}`));
  return p;
};

let wrap: HTMLElement | null = null;
let btn: HTMLButtonElement | null = null;
let panel: HTMLElement | null = null;

function buildUi() {
  if (wrap || S.service !== 'ok') return;
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.append(style);
  wrap = el('span'); wrap.id = 'pxroom';
  btn = el('button'); btn.id = 'pxroom-btn'; btn.type = 'button';
  btn.setAttribute('aria-label', 'Casino room: see who is here and join');
  btn.onclick = () => { S.open = !S.open; paint(); };
  panel = el('div'); panel.id = 'pxroom-panel'; panel.hidden = true;
  chat = createChat({
    send,
    me: () => (S.you && !S.you.guest ? S.you.a : null),
    connected: () => S.connected,
    labelFor,
    joinPrompt: () => { S.open = true; paint(); }
  });
  wrap.append(btn, chat.button);
  const slot = S.host?.mount?.() ?? document.querySelector<HTMLElement>('#tools .rt');
  if (slot) slot.insertBefore(wrap, slot.firstChild);
  else { wrap.style.cssText = 'position:fixed;top:10px;right:10px;z-index:30'; document.body.append(wrap); }
  document.body.append(panel);
  chat.mount(document.body);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && S.open) { S.open = false; paint(); } });
  // A tap anywhere outside the panel and the button closes it (on a phone there is no Escape key).
  document.addEventListener('pointerdown', (e) => {
    if (!S.open) return;
    const t = e.target as Node | null;
    if (t && (panel!.contains(t) || btn!.contains(t))) return;
    S.open = false; paint();
  });
  window.addEventListener('resize', () => paint());     // the button's words show or hide with the width; paint() also re-hangs an open panel
}

/** Hang the panel just under the Room button wherever the page puts it (on a phone the buttons sit lower than on a laptop). */
function placePanel() {
  if (!btn || !panel) return;
  const r = btn.getBoundingClientRect();
  const top = r.height ? Math.round(r.bottom + 8) : 64;
  panel.style.top = `${Math.min(top, Math.max(64, window.innerHeight - 220))}px`;
}

function paint() {
  if (!wrap || !btn || !panel) return;
  const signed = !!(S.signed && S.you && !S.you.guest);
  btn.className = S.connected ? 'live' : 'wait';
  // On a phone the page's top-right buttons are 34 px icons, so the words hide and only the dot and the number show.
  btn.replaceChildren(el('i'), el('span', signed ? 'In the room' : 'Room', 'lbl'), el('span', S.connected ? (window.matchMedia?.('(max-width:620px)').matches ? String(S.joined) : ` · ${S.joined}`) : '', 'n'));
  btn.setAttribute('aria-label', `Casino room: ${S.connected ? `${S.joined} signed in, ` : ''}${signed ? 'you are in' : 'see who is here and join'}`);
  panel.hidden = !S.open;
  if (!S.open) return;
  placePanel();
  const parts: HTMLElement[] = [];
  if (S.replaced) {
    parts.push(el('h3', 'Room'), el('p', 'Another tab of yours took over the room. You are not connected here.'));
    const b = el('button', 'Use this tab instead'); b.onclick = () => { reconnect(); paint(); };
    parts.push(b);
  } else if (signed) {
    parts.push(el('h3', 'You are in the room'));
    parts.push(el('p', `Others see you at your seat as`), el('p', labelFor(S.signed!.address), 'who'));
    parts.push(el('p', `${S.joined} signed in, ${S.guests} watching.`));
    parts.push(fact('Be seen', 'Sit at a table or connect to a machine and your Adrian and name tag appear there for everyone in the room. Stand up or walk away and they go too.'));
    parts.push(fact('Spaces', 'Each seat and machine holds one person. If someone already has the seat you choose, you are given a free one at the same table.'));
    parts.push(fact('Live chat', 'Press Chat to talk to the room and scroll back through this session. Tap a name, or Here now, to send someone a direct message, block or report them. Messages are not secret; this session\'s chat is kept in this tab only and cleared when you leave the room.'));
    parts.push(el('p', 'Nothing here moves any money.', 'fact'));
    const b = el('button', 'Leave the room'); b.onclick = () => { void leave(); };
    parts.push(b);
  } else {
    parts.push(el('h3', 'Join the room'));
    parts.push(el('p', S.connected
      ? `You are watching: ${S.joined} signed in, ${S.guests} watching.`
      : 'Connecting to the room…'));
    parts.push(fact('Be seen', 'Join, then sit at a table or connect to a machine. Everyone in the room sees your Adrian there, with a name tag (your BNS name, or a short version of your address). Watching alone shows you to nobody.'));
    parts.push(fact('Spaces', 'Each seat and machine holds one person. If someone already has the seat you choose, you are given a free one at the same table.'));
    parts.push(fact('Live chat', 'Signed-in players can chat with the room and send each other direct messages. Messages are not secret and are not saved.'));
    parts.push(fact('Free', 'One signature. It sends no transaction, costs no fee and gives no permission to spend anything.'));
    const row = el('div', undefined, 'row');
    for (const kind of ['leather', 'xverse'] as const) {
      const b = el('button', S.busy ? (S.busy === 'sign' ? 'Check your wallet…' : 'Connecting…') : kind === 'leather' ? 'Leather' : 'Xverse');
      b.disabled = !!S.busy || !S.connected;
      b.onclick = () => { void join(kind); };
      row.append(b);
      if (S.busy) break;
    }
    parts.push(row);
    if (S.error) parts.push(el('p', S.error, 'err'));
  }
  panel.replaceChildren(...parts);
}

// ------------------------------------------------------------------ start

/** The visitor's own spin, announced by the page: passed to the room when the room takes spins and the visitor holds that cabinet. */
const onOwnSpin = (event: Event) => {
  const d = (event as CustomEvent).detail;
  if (!d || typeof d.spot !== 'string' || !Array.isArray(d.s) || typeof d.b !== 'number') return;
  if (!S.features.includes('play') || S.service !== 'ok' || !S.connected || !S.signed || !S.you || S.you.guest) return;
  if (S.spots[d.spot]?.a !== S.you.a) return;      // the room only takes spins from the person at that cabinet
  // Sent directly, not through send(): a spin must not hold back the seat updates, which wait for a quiet moment after a send.
  if (S.ws?.readyState === WebSocket.OPEN) S.ws.send(JSON.stringify({ t: 'play', spot: d.spot, s: d.s.slice(0, 8), b: d.b, f: !!d.f }));
};

const watchSeat = () => {
  const spot = S.host?.currentSpot() ?? null;
  if (spot !== S.want) { S.want = spot; S.yielded = null; S.standSent = null; pushPeople(); }   // the player moved: this tab speaks for them again
  reconcile();
};

async function start() {
  try {
    const { res, body } = await postJson('/casino/room/session');
    if (res.status === 503) return;          // the room is switched off: say nothing, change nothing
    if (res.ok && body?.address) S.signed = { address: body.address, hash160: body.hash160, expiresAt: body.expiresAt };
    S.service = 'ok';
  } catch { return; }                       // unreachable: fail open
  buildUi(); paint();
  connect();
  window.setInterval(watchSeat, 250);
  window.addEventListener('px-room-play', onOwnSpin);
}

const attach = (host: PXRoomHost) => {
  if (S.host) return;
  S.host = host;
  void start();
};
const existing = (window as any).PXRoomHost as PXRoomHost | undefined;
if (existing) attach(existing); else window.addEventListener('px-room-host', () => attach((window as any).PXRoomHost), { once: true });

// For tests and bug reports only: read-only.
(window as any).__pxRoom = {
  chat: () => chat?.debug() ?? null,
  get state() { return { service: S.service, signed: S.signed?.address ?? null, connected: S.connected, you: S.you, spots: S.spots, joined: S.joined, guests: S.guests, want: S.want, features: S.features.slice(), trail: connectTrail.slice() }; }
};
