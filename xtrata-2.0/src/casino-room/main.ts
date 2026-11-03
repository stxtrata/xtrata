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
 * and optional     moves(list) / move(one)  other players walking on the floor: everyone at once, or one change
 *                  ({ key, label, x, z, r, at } with `at` on the room's clock, or { key, off: true })
 *
 * Spins: the page announces the visitor's own spins with a `px-room-play` window event ({ spot, s: reel stops, b: bet, f: free }).
 * This client passes them to the room only when the room lists the `play` feature and the visitor holds that cabinet, and hands
 * everyone else's spins to `play()`. Nothing about a spin moves money or is checked here; it only makes a cabinet look alive.
 *
 * Walking: the page announces the visitor's position on the floor with a `px-room-move` window event ({ x, z, r } or { off }).
 * This client passes it on only when the room lists the `move` feature and the visitor is signed in, resends the last one
 * after a reconnect, and hands everyone else's positions to `moves()` / `move()`.
 *
 * Built with `npm run build:casino-room` into public/casino/room.js (not part of `prebuild`, so it can never break a deploy).
 */
import { createAddress, addressToString, AddressVersion } from '@stacks/transactions';
import { requestStructuredSignature } from '../lib/wallet/structured-sign';
import { createNameCache } from '../lib/bns/name-cache';
import { resolvePrimaryBnsName } from '../lib/bns/primary';
import { roomProofData, type RoomChallenge } from '../../functions/lib/casino-room-proof';
import { casinoSignRoomJoin, casinoWalletUi, connectWallet, connectTrail, rememberProvider, walletMessage, type LinkedWallet, type WalletKind } from './wallet';
import { createChat, type Chat } from './chat';
import { addressBlock } from './address-card';
import { isChatError } from './chat-core';
import { baccaratCards, rouletteResult, sicboDice, verifySeed } from '../../functions/lib/casino-rounds';

type Person = { key: string; spot: string; label: string; since: number };
type Spin = { a: string; s: number[]; b: number; f: boolean };
type Walker = { key: string; label: string; x: number; z: number; r: number; at: number };
type Pos = { x: number; z: number; r: number; at: number };
interface PXRoomHost {
  version: number;
  currentSpot(): string | null;
  setPeople(list: Person[]): void;
  mount?(): HTMLElement | null;
  play?(spot: string, spin: Spin): void;
  moves?(list: Walker[]): void;
  move?(one: Walker | { key: string; off: true }): void;
  /** Whether the visitor is signed into the room (visible to others), and as which address. */
  self?(info: { signed: boolean; address: string | null }): void;
  /**
   * The Salon's door (docs/plans/CASINO-SALON-BNS-PLAN.md): whether the visitor may go into the Salon, as the room says.
   * `allowed` (with their primary BNS name), `no-name`, `unchecked` (the lookup failed: offer "try again"), `guest` (join the room
   * first), `connecting`, `offline`, or `unenforced` (an older room without the rule: the Salon behaves as it always did).
   * The page asks for a fresh check with a `px-room-bns-check` window event; the answer comes back through on({ t: 'bns-check' }).
   */
  salon?(info: SalonInfo): void;
  /** Who is here (docs/plans/CASINO-WHO-IS-HERE-PLAN.md): the addresses marked away (idle), so their name tags can turn grey. */
  awayOf?(list: string[]): void;
  /** The visitor went away (idle): stand them up from their seat or machine, if the page can. */
  standUp?(): void;
  /**
   * The social layer (docs/plans/CASINO-PLAY-TOGETHER-PLAN.md): every room message the page may want that this client does not
   * handle itself (react, win, daily, round, bet, gift, seek, pvp, say), plus `{ t: 'room', features, wins, bets, seekers, at }`
   * on each fresh connection and `{ t: 'err', code }` for a refusal of something the page sent. The page sends its own messages
   * with a `px-room-send` window event ({ detail: message }); see onPageSend.
   */
  on?(message: Record<string, unknown>): void;
  /** The table the visitor is at or watching (for table chat), or null. */
  table?(): string | null;
}
type SpotView = { a: string; n: string; since: number };
type SalonState = 'allowed' | 'no-name' | 'unchecked' | 'guest' | 'connecting' | 'offline' | 'unenforced';
type SalonInfo = { state: SalonState; address: string | null; name: string | null };
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
  features: [] as string[],           // what the room says it can do ('play': spins, 'move': walking); an older room lists nothing
  walk: new Map<string, Pos>(),       // other signed-in players on the floor, by address: their latest position
  ownMove: null as null | { x: number; z: number; r: number },   // the visitor's own last position on the floor (null: off it)
  ownSent: false,                     // whether the room currently holds a position for this connection
  spots: {} as Record<string, SpotView>,
  joined: 0,
  guests: 0,
  busy: '' as '' | 'connect' | 'sign',
  watch: true,                        // false: the room hides itself from visitors who have not signed in (CASINO_ROOM_GUESTS off)
  prompted: false,                    // the arrival "Join the room" panel has opened once on this page
  arrivedAt: 0,                       // when the first room message came, for the arrival prompt's short wait
  error: '',
  open: false,
  want: null as string | null,
  badSpot: null as string | null,     // a spot the room said it has no such place (an older room Worker): not asked again
  yielded: null as string | null,     // a spot another tab of the same player took from this one: not asked for again until this tab moves
  standSent: null as string | null,   // the spot this tab last asked to stand up from: asked once, not every 0.6 s
  lastSent: 0,
  host: null as PXRoomHost | null,
  retryTimer: 0,
  // who is here (docs/plans/CASINO-WHO-IS-HERE-PLAN.md): everyone signed in (with whether they are away), the visitor's own away,
  // whether this tab has left by itself (parked: in the background too long, or idle too long), and the clocks for those
  players: new Map<string, { a: string; aw?: boolean }>(),
  away: false,
  parked: '' as '' | 'hidden' | 'idle',
  lastActive: Date.now(),
  hiddenAt: 0,
  lastBeat: 0,
  // the welcome card (docs/plans/CASINO-WELCOME-JOIN-PLAN.md): the join step lives in the page's welcome card, not a second window
  resumed: false,                     // signed in from an earlier visit's session (the card says "Welcome back")
  trying: null as WalletKind | null,  // the wallet being asked right now, for the card's "Check Leather..." line
  later: false,                       // the visitor went in without signing in: the card's join step shrinks to one line
  introSeen: false                    // the welcome card has shown while the room was on: no separate arrival panel
};

/** Heartbeat, leave after this long in the background, away after this long idle, leave after this long idle. `?roomtimes=a,b,c,d`
 *  (milliseconds) shortens them for a test. */
const HERE = (() => {
  const t = { beat: 30_000, hide: 5 * 60_000, away: 20 * 60_000, leave: 30 * 60_000 };
  try { const m = /[?&]roomtimes=(\d+),(\d+),(\d+),(\d+)/.exec(location.search); if (m) { t.beat = +m[1]; t.hide = +m[2]; t.away = +m[3]; t.leave = +m[4]; } } catch { /* no location */ }
  return t;
})();

let chat: Chat | null = null;      // the floating chat column (chat.ts); made with the button, only when the room is on

const short = (a: string) => (a.length <= 12 ? a : `${a.slice(0, 5)}…${a.slice(-4)}`);
const mainnetOf = (a: string) => {
  if (a.startsWith('SP')) return a;
  const d = createAddress(a);
  return addressToString({ ...d, version: AddressVersion.MainnetSingleSig });
};
// Names are looked up on the mainnet address of the same key (BNS names live on mainnet; ST and SP share one key).
const names = createNameCache((address) => resolvePrimaryBnsName({ address: mainnetOf(address), network: 'mainnet' }), () => { pushPeople(); pushWalkers(); chat?.refreshNames(); paint(); });
const labelFor = (address: string) => {
  let name: string | null = null;
  try { name = names.get(address); } catch { /* bad address: show it short */ }
  return name || short(address);
};

// ------------------------------------------------------------------ the page

const walkerOf = (key: string, p: Pos): Walker => ({ key, label: labelFor(key), x: p.x, z: p.z, r: p.r, at: p.at });
/** Everyone else walking on the floor, as one list (the page keeps whoever is still in it and drops the rest). */
const pushWalkers = () => {
  if (!S.host?.moves || S.service !== 'ok') return;
  const me = S.you?.a ?? null;
  const list = [...S.walk.entries()].filter(([a]) => a !== me).map(([a, p]) => walkerOf(a, p));
  try { S.host.moves(list); } catch (e) { console.warn('[room] the page could not draw the walkers', e); }
};
const walkOne = (key: string, p: Pos | null) => {
  if (p) S.walk.set(key, p); else S.walk.delete(key);
  if (!S.host?.move || key === (S.you?.a ?? null)) return;
  try { S.host.move(p ? walkerOf(key, p) : { key, off: true }); } catch (e) { console.warn('[room] the page could not move a walker', e); }
};
/** Sends the visitor's own position (or that they left the floor), when the room takes moves and the visitor is signed in. */
const sendOwnMove = () => {
  if (!S.features.includes('move') || S.service !== 'ok' || !S.connected || !S.signed || !S.you || S.you.guest) return;
  if (S.ws?.readyState !== WebSocket.OPEN) return;
  // Sent directly, not through send(): moves must not hold back the seat updates, which wait for a quiet moment after a send.
  if (S.ownMove) { S.ws.send(JSON.stringify({ t: 'move', ...S.ownMove })); S.ownSent = true; }
  else if (S.ownSent) { S.ws.send(JSON.stringify({ t: 'move', off: true })); S.ownSent = false; }
};

/** Hands a room message to the page's social layer. A failure there changes nothing here. */
const tellPage = (m: Record<string, unknown>) => {
  try { S.host?.on?.(m); } catch (e) { console.warn('[room] the page could not take a room message', e); }
};
/** Refusals of the page's own social messages (they go back to the page, never into the chat column). */
const PAGE_CODES = /^(react|win|daily|round|gift|pvp|table|no-table|log|bal|board|friends|tourney|card|mission)/;

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
  if (S.away) return;      // away: the room stood the visitor up; no seat is asked for until they are back
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
        S.watch = m.watch !== false;                         // an older room says nothing: guests may watch there
        if (!S.arrivedAt) S.arrivedAt = Date.now();
        S.features = Array.isArray(m.features) ? m.features.filter((f: unknown) => typeof f === 'string') : [];
        S.walk = new Map();
        for (const w of Array.isArray(m.walkers) ? m.walkers : []) if (w && typeof w.a === 'string') S.walk.set(w.a, { x: +w.x, z: +w.z, r: +w.r, at: +w.at });
        pushWalkers();
        S.ownSent = false; sendOwnMove();               // a fresh connection: say where the visitor is standing, if on the floor
        S.standSent = null;                                 // a fresh connection holds no seat yet
        if (S.signed && S.you?.guest) S.signed = null;      // the session ran out (4 hours) while the page stayed open
        chat?.room(m.players, !!(S.you && !S.you.guest));
        S.players = new Map();
        for (const p of Array.isArray(m.players) ? m.players : []) if (p && typeof p.a === 'string') S.players.set(p.a, { a: p.a, aw: p.aw === true });
        tellAway();
        if (S.features.includes('here') && S.ws?.readyState === WebSocket.OPEN) {      // this tab sends heartbeats; and is still away, if it was
          S.ws.send(JSON.stringify({ t: 'here' }));
          if (S.away && S.signed && S.you && !S.you.guest) S.ws.send(JSON.stringify({ t: 'away', on: true }));
        }
        tellPage({ t: 'room', features: S.features.slice(), wins: m.wins || [], bets: m.bets || {}, seekers: m.seekers || [], at: m.at, you: S.you, watch: S.watch,
          // phase 3: levels, the jackpot, the tournament, happy hour, and the visitor's own profile, balance, friends and notices
          levels: m.levels || {}, jackpot: m.jackpot || null, tourney: m.tourney || null, hh: m.hh || null, me: m.me || null, bal: m.bal ?? null, friends: m.friends || null, notices: m.notices || [] });
        break;
      case 'sat': S.spots[m.spot] = m.who; if (m.who?.a && S.walk.has(m.who.a)) walkOne(m.who.a, null); break;
      case 'stood': delete S.spots[m.spot]; if (S.standSent === m.spot) S.standSent = null; break;
      case 'moved': S.yielded = m.spot; break;       // another tab of this player sat down elsewhere: that tab wins; this one stops asking
      case 'count': S.joined = m.joined; S.guests = m.guests; break;
      case 'say': case 'dm': chat?.heard(m); if (m.t === 'say') tellPage(m); return;
      case 'join': if (m.who && typeof m.who.a === 'string') S.players.set(m.who.a, { a: m.who.a }); chat?.joined(m.who); tellPage(m); paint(); return;
      case 'leave': S.players.delete(m.a); tellAway(); chat?.left(m.a); if (S.walk.has(m.a)) walkOne(m.a, null); tellPage(m); paint(); return;
      case 'away': if (typeof m.a === 'string') { S.players.set(m.a, { a: m.a, aw: m.on === true }); tellAway(); } break;
      case 'react': case 'win': case 'daily': case 'round': case 'bet': case 'gift': case 'seek': case 'pvp': case 'spec': tellPage(m); return;
      // phase 3 (functions/lib/casino-progress.ts)
      case 'me': case 'hh': case 'lvl': case 'badge': case 'mission-done': case 'bal': case 'board': case 'friends': case 'tourney': case 'tourney-end': case 'jp': case 'jackpot': case 'card': tellPage(m); return;
      case 'reported': chat?.reported(); return;
      case 'play':
        // Another player's spin: the page spins its copy of that cabinet to the same stops. A failure there changes nothing else.
        if (typeof m.spot === 'string' && Array.isArray(m.s) && typeof m.b === 'number') {
          try { S.host?.play?.(m.spot, { a: String(m.a || ''), s: m.s, b: m.b, f: !!m.f }); } catch (e) { console.warn('[room] the page could not show a spin', e); }
        }
        return;
      case 'move':
        // Another player walking (or leaving the floor): the page draws them there, a moment behind.
        if (typeof m.a === 'string') {
          if (m.off) walkOne(m.a, null);
          else if ([m.x, m.z, m.r, m.at].every((n) => typeof n === 'number' && Number.isFinite(n))) walkOne(m.a, { x: m.x, z: m.z, r: m.r, at: m.at });
        }
        return;
      case 'err':
        if (typeof m.code === 'string' && (m.code.startsWith('play-') || m.code.startsWith('move-'))) return;   // spins and moves the room did not pass on: nothing to show
        if (typeof m.code === 'string' && PAGE_CODES.test(m.code)) { tellPage({ t: 'err', code: m.code }); if (m.code !== 'no-table') return; }
        if (m.code === 'no-such-spot' || (typeof m.code === 'string' && m.code.startsWith('salon-'))) S.badSpot = S.want;   // a seat the room will not give: stop asking
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
    S.walk = new Map(); pushWalkers(); S.ownSent = false;
    S.players = new Map(); tellAway();
    chat?.disconnected();
    if (event.code === 4001) { S.replaced = true; paint(); return; }     // another tab of the visitor's took over
    paint(); retry();
  };
  ws.onerror = () => { /* onclose follows */ };
};

// ------------------------------------------------------------------ who is here: heartbeats, the background, idle and away

let toldAway = '';
/** The addresses marked away, to the page (grey name tags), whenever the list changes. */
const tellAway = () => {
  const list = [...S.players.values()].filter((p) => p.aw).map((p) => p.a).sort(), key = list.join();
  if (key === toldAway) return;
  toldAway = key;
  try { S.host?.awayOf?.(list); } catch (e) { console.warn('[room] the page could not take who is away', e); }
};
/** This tab leaves the room by itself (in the background, or idle, too long): the seat is freed and the name goes. The session
 *  stays, so coming back rejoins at once with no new signature. */
const park = (why: 'hidden' | 'idle') => {
  if (S.parked || !S.ws) return;
  S.parked = why;
  const old = S.ws; S.ws = null; S.connected = false;
  window.clearTimeout(S.retryTimer);
  try { old.close(1000, why); } catch { /* already closed */ }
  S.spots = {}; pushPeople(); S.walk = new Map(); pushWalkers(); S.ownSent = false; S.players = new Map(); tellAway();
  chat?.disconnected(); paint();
};
const unpark = () => {
  if (!S.parked) return;
  S.parked = ''; S.attempts = 0; S.lastActive = Date.now();
  connect(); paint();
};
/** Away (idle on an open tab): the room is told, and the page stands the visitor up. Back: the room is told again. */
const setAway = (on: boolean) => {
  if (S.away === on) return;
  S.away = on;
  if (S.ws?.readyState === WebSocket.OPEN && S.features.includes('here') && S.signed && S.you && !S.you.guest) S.ws.send(JSON.stringify({ t: 'away', on }));
  if (on) { try { S.host?.standUp?.(); } catch (e) { console.warn('[room] the page could not stand the visitor up', e); } }
  paint();
};
/** Anything the visitor does (a tap, a key, walking, a spin): they are here. */
const active = () => {
  S.lastActive = Date.now();
  if (S.away) setAway(false);
  if (S.parked === 'idle' || (S.parked === 'hidden' && !document.hidden)) unpark();
};
/** Once a second: the heartbeat when it is due, and the background and idle clocks. */
const hereTick = () => {
  if (S.service !== 'ok') return;
  const now = Date.now();
  if (S.ws?.readyState === WebSocket.OPEN && S.features.includes('here') && now - S.lastBeat >= HERE.beat) {
    S.lastBeat = now;
    try { S.ws.send('ping'); } catch { /* closing */ }     // a bare ping: the room answers it without waking
  }
  if (S.parked) return;
  if (document.hidden) { if (S.hiddenAt && now - S.hiddenAt > HERE.hide) park('hidden'); return; }
  const idle = now - S.lastActive, signedIn = !!(S.signed && S.you && !S.you.guest);
  if (idle > HERE.leave) park('idle');
  else if (signedIn && !S.away && idle > HERE.away && S.features.includes('here')) setAway(true);
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

let joinGen = 0;      // bumped by Cancel in the welcome card: a wallet that answers after that is ignored
const cancelled = () => new Error('Sign-in cancelled.');

async function signIn(wallet: LinkedWallet, gen = joinGen) {
  const { res: cres, body: cbody } = await postJson(`/casino/room/challenge?address=${encodeURIComponent(wallet.address)}`);
  if (!cres.ok) throw new Error(cbody?.error || `The room answered ${cres.status}.`);
  const challenge = cbody.challenge as RoomChallenge;
  const { domain, message } = roomProofData(challenge);
  S.busy = 'sign'; paint();
  let signature: string;
  try {
    // The casino wallet signs in its own frame (no popup while it is open); extensions through the app's standard request.
    signature = wallet.kind === 'casino'
      ? await casinoSignRoomJoin(challenge)
      : await requestStructuredSignature({
        domain, message, network: challenge.network, stxAddress: wallet.address,
        appDetails: { name: 'ParallaX Casino', icon: `${location.origin}/favicons/xtrata-apple-touch-icon.png` }
      });
  } catch (e) { if (gen !== joinGen) throw cancelled(); throw new Error('The wallet did not sign: ' + walletMessage(e)); }
  if (gen !== joinGen) throw cancelled();
  const { res: sres, body: sbody } = await postJson('/casino/room/session', {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ challenge, signature })
  });
  if (!sres.ok) throw new Error(sbody?.error || `The room answered ${sres.status}.`);
  S.signed = { address: sbody.address, hash160: sbody.hash160, expiresAt: sbody.expiresAt };
  S.resumed = false;
  reconnect();      // the cookie is set: reconnect so the room knows who this is
}

async function join(kind: WalletKind) {
  if (S.busy) return;
  const gen = ++joinGen;
  S.error = ''; S.busy = 'connect'; S.trying = kind; paint();
  // A casino wallet made new here gets the exchange's welcome (500 free testnet STX, then the first 1,000,000 LAYR).
  const fresh = kind === 'casino' && !(casinoWalletUi()?.describe().has);
  try {
    const wallet = await connectWallet(kind);
    if (gen !== joinGen) throw cancelled();
    S.wallet = wallet;
    rememberProvider(kind);
    await signIn(wallet, gen);
    S.open = false;
    if (fresh) void casinoWalletUi()?.fundNew().catch(() => {});
  } catch (e) {
    if (gen === joinGen) S.error = /cancel/i.test(walletMessage(e)) ? '' : walletMessage(e);
  } finally {
    if (gen === joinGen) { S.busy = ''; S.trying = null; }
    paint();
  }
}

/** Cancel in the welcome card: stop waiting for the wallet (its window may stay open; whatever it answers is ignored). */
const cancelJoin = () => { joinGen++; S.busy = ''; S.trying = null; S.error = ''; paint(); };

/**
 * A wallet connected somewhere on the page (the LAYR exchange announces it): sign the player into the room straight away
 * (Jim, 2026-10-31). The casino wallet signs silently; Leather and Xverse show their one signature request.
 */
async function joinWithConnected(event: Event) {
  const d = (event as CustomEvent).detail as { kind?: string; address?: string } | undefined;
  if (!d || typeof d.address !== 'string' || S.service !== 'ok' || S.busy) return;
  if (S.signed?.address === d.address) return;
  const kind = d.kind === 'casino' || d.kind === 'leather' || d.kind === 'xverse' ? d.kind : null;
  if (!kind) return;                  // a wallet the room cannot sign with yet: the Join panel still offers the others
  const gen = ++joinGen;
  S.error = ''; S.busy = 'sign'; S.trying = kind; paint();
  try {
    S.wallet = { kind, address: d.address, network: d.address.startsWith('SP') ? 'mainnet' : 'testnet', via: 'page' };
    rememberProvider(kind);
    await signIn(S.wallet, gen);
    S.open = false;
  } catch (e) {
    const text = walletMessage(e);
    if (gen === joinGen && !/cancel/i.test(text)) { S.error = text; S.open = !introShown(); }   // the welcome card shows it, when it is up
  } finally {
    if (gen === joinGen) { S.busy = ''; S.trying = null; }
    paint();
  }
}

/**
 * The arrival prompt: everyone is asked to join the room (Jim, 2026-10-31). Once per page, a couple of seconds after the room
 * answers, never over a hand or a machine in play, and never when a session from the last 4 hours is still live.
 */
const ARRIVAL_WAIT_MS = 2000;
const arrivalPrompt = () => {
  if (S.service === 'ok' && introShown()) { if (!S.introSeen) { S.introSeen = true; paint(); } }
  if (S.introSeen) return;            // the welcome card asked them to join (docs/plans/CASINO-WELCOME-JOIN-PLAN.md): no second window
  if (S.prompted || S.service !== 'ok' || !S.connected || S.signed || S.busy || S.open || !S.arrivedAt) return;
  if (Date.now() - S.arrivedAt < ARRIVAL_WAIT_MS) return;
  if (S.host?.currentSpot()) return;
  S.prompted = true; S.open = true; paint();
};

/** The join buttons, in the order that fits this visitor: their casino wallet or their extension first, a new visitor the casino wallet. */
const joinOrder = (): WalletKind[] => {
  const ui = casinoWalletUi();
  let used: string | null = null;
  try { used = localStorage.getItem('STX_PROVIDER'); } catch { /* storage blocked */ }
  const ext: WalletKind[] = /Xverse/.test(used || '') ? ['xverse', 'leather'] : ['leather', 'xverse'];
  if (!ui) return ext;
  if (ui.describe().has || !used) return ['casino', ...ext];
  return [ext[0] as WalletKind, 'casino', ext[1] as WalletKind];
};

async function leave() {
  try { await postJson('/casino/room/session', { method: 'DELETE' }); } catch { /* the cookie dies by itself in 4 hours */ }
  S.signed = null; S.wallet = null; S.error = ''; S.resumed = false; S.later = false;
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
#pxroom-btn.away i{background:#8a8f98;box-shadow:none}
#pxroom-btn .lbl{display:inline-block;max-width:150px;overflow:hidden;text-overflow:ellipsis;vertical-align:bottom;white-space:nowrap}
#pxroom-panel .here{display:flex;flex-direction:column;gap:4px;max-height:240px;overflow:auto;margin:0 0 10px}
#pxroom-panel .here .person{display:flex;justify-content:space-between;align-items:center;gap:8px;flex:none;text-align:left;padding:6px 10px;background:rgba(255,255,255,.03);border:1px solid rgba(227,184,74,.25)}
#pxroom-panel .here .nm{color:var(--ink,#f6ead0);font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#pxroom-panel .here .at{color:var(--dim,#b7a587);font-size:12px;white-space:nowrap}
#pxroom-panel .here .away .nm,#pxroom-panel .here .away .at{color:#8a8f98;font-style:italic}
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
#intro #introJoin{margin:0 0 4px;padding:14px 0 0;border-top:1px solid rgba(227,184,74,.18)}
#intro #introJoin[hidden]{display:none}
#introJoin .jh{display:flex;align-items:center;gap:8px;margin:0 0 6px;font:700 10px Arial,sans-serif;letter-spacing:.2em;color:var(--gold,#e3b84a);text-transform:uppercase}
#introJoin .jh i{font-style:normal;display:inline-grid;place-items:center;width:18px;height:18px;border-radius:50%;border:1px solid var(--gold,#e3b84a);font-size:10px;letter-spacing:0}
#introJoin .jh.done i{border-color:#2fae66;color:#2fae66}
#intro #introJoin p{font:11.5px/1.6 Arial,sans-serif;color:#9aa6b6;margin:0 0 10px;max-width:none}
#intro #introJoin p b{color:#e8d6b0;font-weight:600}
#intro #introJoin p.fine{font-size:10px;line-height:1.5;color:#7f8ca0;margin:0 0 4px}
#intro #introJoin p.fine b{color:#b9c3d0}
#intro #introJoin p.lead2{font-size:12px;color:#aab4c2}
#introJoin .wallets{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:0 0 8px}
#introJoin .wallets button{font:600 13px Arial,sans-serif;color:var(--ink,#f6ead0);background:rgba(227,184,74,.08);border:1px solid rgba(227,184,74,.55);border-radius:6px;padding:11px 10px;text-align:left;cursor:pointer;margin:0;letter-spacing:0;text-transform:none;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#introJoin .wallets button small{display:block;font:400 10px Arial,sans-serif;color:#8997a9;margin-top:3px;white-space:normal}
#introJoin .wallets button.wide{grid-column:1/-1;background:linear-gradient(100deg,rgba(227,184,74,.22),rgba(227,184,74,.08));border-color:var(--gold,#e3b84a)}
#introJoin .wallets button:hover:not(:disabled){background:rgba(227,184,74,.24)}
#introJoin .wallets button:disabled{opacity:.5;cursor:default}
#introJoin .wallets button.on{opacity:.85;border-style:dashed}
#introJoin .lnk{display:inline;background:none!important;border:0!important;padding:0!important;margin:0;font:11px Arial,sans-serif!important;color:#b7a587!important;text-decoration:underline;text-underline-offset:3px;cursor:pointer;width:auto;letter-spacing:0;text-transform:none}
#introJoin .lnk.guest{display:block;margin:6px auto 4px}
#introJoin .msg{display:flex;gap:10px;align-items:center;border:1px dashed rgba(227,184,74,.6);border-radius:6px;padding:12px;font:12px/1.5 Arial,sans-serif;color:#e8d6b0;margin:0 0 8px}
#introJoin .msg small{display:block;color:#9aa6b6;font-size:11px}
#introJoin .msg.err{border-style:solid;border-color:rgba(255,120,120,.6);color:#ffb0b0;background:rgba(120,30,30,.18)}
#introJoin .spin{width:16px;height:16px;flex:none;border:2px solid rgba(227,184,74,.3);border-top-color:var(--gold,#e3b84a);border-radius:50%;animation:pxspin .9s linear infinite}
@keyframes pxspin{to{transform:rotate(360deg)}}
#introJoin .me{display:flex;align-items:center;gap:12px;background:rgba(47,174,102,.08);border:1px solid rgba(47,174,102,.45);border-radius:6px;padding:10px 12px;margin:0 0 8px}
#introJoin .me.away{background:rgba(138,143,152,.08);border-color:rgba(138,143,152,.45)}
#introJoin .me .dot{width:10px;height:10px;border-radius:50%;background:#2fae66;box-shadow:0 0 8px #2fae66;flex:none}
#introJoin .me.away .dot{background:#8a8f98;box-shadow:none}
#introJoin .me div{min-width:0;flex:1}
#introJoin .me b{display:block;font:600 15px Arial,sans-serif;color:var(--ink,#f6ead0);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#introJoin .me div span{font:11px Arial,sans-serif;color:#9aa6b6}
#introJoin .me .lnk{flex:none}
#intro #introJoin p.here{font-size:11px;margin:0 0 4px}
#intro #introJoin p.here b{color:var(--gold,#e3b84a)}
#introJoin button.later{display:flex;width:100%;justify-content:space-between;align-items:center;gap:10px;margin:0 0 4px;padding:10px 12px;border:1px solid rgba(227,184,74,.35);border-radius:6px;background:rgba(227,184,74,.06);font:11.5px Arial,sans-serif;color:#9aa6b6;text-align:left;cursor:pointer;letter-spacing:0;text-transform:none}
#introJoin button.later b{color:#e8d6b0;font-weight:600}
#introJoin button.later .go{color:var(--gold,#e3b84a);font-size:16px}
@media(max-width:620px){
  #intro #introJoin{padding-top:10px}
  #introJoin .wallets button{padding:9px 8px;font-size:12px}
  #introJoin .me{padding:8px 10px}
  #introJoin .me b{font-size:14px}
}
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
    mainnetOf,
    joinPrompt: () => { S.open = true; paint(); },
    table: () => (S.features.includes('table') ? (S.host?.table?.() ?? null) : null)
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

/** Tells the page whether the visitor is visible in the room (signed in) and as which address: personal space and their own look. */
let toldSelf: string | null | undefined;
const tellSelf = () => {
  const signed = !!(S.signed && S.you && !S.you.guest), address = signed ? S.signed!.address : null;
  if (address === toldSelf) return;
  toldSelf = address;
  try { S.host?.self?.({ signed, address }); } catch (e) { console.warn('[room] the page could not take the sign-in state', e); }
};

/** The Salon's door, as the room sees the visitor (see PXRoomHost.salon). Told to the page whenever it changes. */
const salonInfo = (): SalonInfo => {
  const you = S.you as (null | { a: string | null; guest: boolean; bns?: string | null; bnsChecked?: boolean });
  const address = you && !you.guest ? you.a : null;
  if (S.service === 'offline') return { state: 'offline', address: null, name: null };
  if (!S.connected || !you) return { state: 'connecting', address: null, name: null };
  if (!S.features.includes('salon-bns')) return { state: 'unenforced', address, name: null };
  if (you.guest || !S.signed) return { state: 'guest', address: null, name: null };
  if (you.bnsChecked !== true) return { state: 'unchecked', address, name: null };
  if (!you.bns) return { state: 'no-name', address, name: null };
  return { state: 'allowed', address, name: you.bns };
};
let toldSalon = '';
const tellSalon = () => {
  const info = salonInfo(), key = JSON.stringify(info);
  if (key === toldSalon) return;
  toldSalon = key;
  try { S.host?.salon?.(info); } catch (e) { console.warn('[room] the page could not take the Salon state', e); }
};
/** "Check my BNS name again": the session is renewed with the new answer, then the room is rejoined so it sees it too. */
let bnsChecking = false;
const onBnsCheck = async () => {
  if (bnsChecking || S.service !== 'ok') return;
  bnsChecking = true;
  try {
    const { res, body } = await postJson('/casino/room/bns', { method: 'POST' });
    tellPage({ t: 'bns-check', ok: res.ok, bns: body?.bns ?? null, bnsChecked: body?.bnsChecked === true, failed: !res.ok || body?.failed === true, error: res.ok ? null : body?.error || `The room answered ${res.status}.` });
    if (res.ok) reconnect();
  } catch {
    tellPage({ t: 'bns-check', ok: false, bns: null, bnsChecked: false, failed: true, error: 'Could not reach the room.' });
  } finally { bnsChecking = false; }
};

/** Where a player is, for the Here now list: their table or machine, walking, or just in the room. */
const PLACE: Record<string, string> = { blackjack: 'Blackjack', baccarat: 'Baccarat', sicbo: 'Sic Bo', roulette: 'Roulette', videopoker: 'Video poker', pvpholdem: "Salon Hold'em", liars: "Liar's Dice",
  drop: 'The Drop', twins: 'Forever Twins', ds: 'Deep Strata', bf: 'Block Fortune', nv: 'Neon Vault', bar: 'The bar', chess1: 'Chess', chess2: 'Chess' };
const whereOf = (a: string) => {
  const spot = Object.entries(S.spots).find(([, v]) => v.a === a)?.[0];
  if (spot) { const id = spot.split('.')[0]; return PLACE[id] || id; }
  return S.walk.has(a) ? 'walking' : 'in the room';
};
/** Everyone signed in, you first; a tap opens their card (name, address, message, block, report), the same as in chat. */
const hereNow = (parts: HTMLElement[]) => {
  const me = S.you?.a ?? null;
  const list = [...S.players.values()].sort((x, y) => (x.a === me ? -1 : y.a === me ? 1 : labelFor(x.a).localeCompare(labelFor(y.a))));
  parts.push(el('h3', `Here now · ${list.length}`));
  const box = el('div', undefined, 'here');
  for (const p of list.slice(0, 50)) {
    const row = el('button', undefined, 'person' + (p.aw ? ' away' : '')); row.type = 'button';
    row.append(el('span', labelFor(p.a) + (p.a === me ? ' (you)' : ''), 'nm'), el('span', p.aw ? 'away' : whereOf(p.a), 'at'));
    row.onclick = () => { const d: { a: string; handled?: boolean } = { a: p.a }; window.dispatchEvent(new CustomEvent('px-room-person', { detail: d })); if (d.handled) { S.open = false; paint(); } };
    box.append(row);
  }
  if (list.length > 50) box.append(el('p', `and ${list.length - 50} more`, 'fact'));
  if (!list.length) box.append(el('p', 'Nobody is signed in yet.', 'fact'));
  parts.push(box, el('p', `${S.guests} watching without signing in.`, 'fact'));
};

// ------------------------------------------------------------------ the welcome card's join step

/*
 * The welcome card (docs/plans/CASINO-WELCOME-JOIN-PLAN.md): the page's "The night is yours." card has an empty
 * <div id="introJoin"> and this fills it with the room sign-in, so a visitor sees one window with two steps (join, then step in)
 * instead of the card plus a Room panel that opened by itself. The same join() as the Room panel; the panel stays on the Room
 * button for switching, leaving and Here now. Classes on #intro tell the page's own part of the card what to show:
 *   join-on     the room is on (the step headings may show)     join-ask   asking them to join: Enter is outlined
 *   join-steps  show "2 Step in"                                  join-back  "Welcome back": the card's lead line hides
 * With the room off or unreachable nothing is added and the card is exactly as before.
 */
const introBox = () => document.getElementById('intro');
const introShown = () => {
  const box = introBox();
  if (!box || !box.classList.contains('on') || !document.getElementById('introJoin')) return false;
  try { return getComputedStyle(box).display !== 'none'; } catch { return true; }
};
const WALLET_NAME: Record<WalletKind, string> = { leather: 'Leather', xverse: 'Xverse', casino: 'your casino wallet' };
let introHtml = '';

function paintIntro() {
  const box = introBox(), slot = document.getElementById('introJoin');
  if (!box || !slot) return;
  const set = (on: Record<string, boolean>) => { for (const [k, v] of Object.entries(on)) box.classList.toggle(k, v); };
  if (S.service !== 'ok') {
    set({ 'join-on': false, 'join-ask': false, 'join-steps': false, 'join-back': false });
    slot.hidden = true; slot.replaceChildren(); introHtml = '';
    return;
  }
  const signed = !!(S.signed && S.you && !S.you.guest);
  const mode = S.parked ? 'parked' : S.replaced ? 'replaced' : signed ? (S.resumed ? 'back' : 'in')
    : S.signed ? 'joining' : S.busy ? 'busy' : S.later ? 'later' : 'join';
  const ask = mode === 'join' || mode === 'busy' || mode === 'joining';
  set({ 'join-on': true, 'join-ask': ask, 'join-steps': ask || mode === 'in', 'join-back': mode === 'back' });

  const parts: HTMLElement[] = [];
  const head = (n: string, text: string, done = false) => { const h = el('div', undefined, 'jh' + (done ? ' done' : '')); h.append(el('i', n), document.createTextNode(text)); return h; };
  const link = (text: string, go: () => void, cls = 'lnk') => { const b = el('button', text, cls); b.type = 'button'; b.onclick = go; return b; };
  const ui = casinoWalletUi();
  const walletButtons = (live: boolean) => {
    const row = el('div', undefined, 'wallets');
    const order = joinOrder();
    order.forEach((kind, i) => {
      const b = el('button', undefined, (order.length === 3 && i === 0 ? 'wide' : '') + (S.trying === kind ? ' on' : '')); b.type = 'button';
      const title = kind === 'casino' ? (ui ? ui.describe().label : 'Casino wallet') : kind === 'leather' ? 'Leather' : 'Xverse';
      const note = kind === 'casino'
        ? (ui?.describe().has ? 'Face ID or fingerprint · your passkey' : 'Face ID or fingerprint · free · 1,000,000 LAYR to start')
        : S.trying === kind ? 'waiting…' : kind === 'leather' ? 'browser extension' : 'extension or app';
      b.append(document.createTextNode(title), el('small', note));
      b.disabled = !live || !S.connected;
      b.onclick = () => { void join(kind); };
      row.append(b);
    });
    return row;
  };
  const meBox = (sub: string, action: string) => {
    const box = el('div', undefined, 'me' + (S.away ? ' away' : ''));
    const txt = el('div'); txt.append(el('b', labelFor(S.signed!.address)), el('span', sub));
    box.append(el('span', undefined, 'dot'), txt, link(action, () => { void leave(); }));
    return box;
  };
  const count = (n: number) => `${n} ${n === 1 ? 'player is' : 'players are'} in the room now.`;

  if (mode === 'join') {
    parts.push(head('1', 'Join the room'));
    const p = el('p'); p.append(document.createTextNode('Sign in so other players can see you, chat and play the shared tables with you. '));
    p.append(el('b', S.connected ? (S.joined ? count(S.joined) : 'Be the first one in tonight.') : 'Connecting to the room…'));
    parts.push(p, walletButtons(true));
    const fine = el('p', undefined, 'fine'); fine.append(el('b', 'One free signature.'), document.createTextNode(' No transaction, no fee, no permission to spend anything.'));
    parts.push(fine);
    if (S.error) parts.push(el('div', S.error, 'msg err'));
    parts.push(link('Or look around first, without signing in', () => { S.later = true; paint(); document.getElementById('walkin')?.click(); }, 'lnk guest'));
  } else if (mode === 'busy' || mode === 'joining') {
    parts.push(head('1', 'Join the room'));
    const name = S.trying ? WALLET_NAME[S.trying] : 'your wallet';
    const text = mode === 'joining' ? `Joining the room as ${labelFor(S.signed!.address)}…`
      : S.busy === 'connect' ? (S.trying === 'casino' ? 'Opening your casino wallet…' : `Connecting to ${name}…`)
        : S.trying === 'casino' ? 'Confirm with Face ID or your fingerprint to sign in.' : `Check ${name}: approve the free sign-in message.`;
    const msg = el('div', undefined, 'msg'), t = el('div', text);
    if (mode === 'busy') t.append(el('small', 'No transaction. Nothing to pay.'));
    msg.append(el('span', undefined, 'spin'), t);
    parts.push(msg);
    if (mode === 'busy') parts.push(walletButtons(false), link('Cancel', cancelJoin, 'lnk guest'));
  } else if (mode === 'in') {
    parts.push(head('✓', 'You are in the room', true));
    const via = S.wallet ? `${S.wallet.kind === 'casino' ? 'Casino wallet' : WALLET_NAME[S.wallet.kind]} · ` : '';
    parts.push(meBox(S.away ? 'away · do anything to come back' : `${via}the name others see on your tag`, 'Switch'));
    const others = [...S.players.values()].filter((p) => p.a !== S.signed!.address);
    const here = el('p', undefined, 'here');
    if (!others.length) here.textContent = 'Nobody else is signed in yet. Sit down and they will see you when they arrive.';
    else {
      here.append(document.createTextNode('Here now: '));
      others.slice(0, 2).forEach((p, i) => {
        const w = whereOf(p.a), at = p.aw ? 'away' : w === 'walking' || w === 'in the room' ? w : `at ${w}`;
        if (i) here.append(document.createTextNode(' · '));
        here.append(el('b', labelFor(p.a)), document.createTextNode(` ${at}`));
      });
      if (others.length > 2) here.append(document.createTextNode(' · '), el('b', `+${others.length - 2} more`));
    }
    parts.push(here);
  } else if (mode === 'back') {
    parts.push(el('p', 'Welcome back. You are still signed in from earlier, so you are already in the room.', 'lead2'));
    parts.push(meBox(S.away ? 'away · do anything to come back' : `signed in · ${S.joined} here now`, 'Not you?'));
  } else if (mode === 'later') {
    const b = el('button', undefined, 'later'); b.type = 'button';
    const t = el('span'); t.append(el('b', 'Join the room'), document.createTextNode(' to be seen, chat and play together'));
    b.append(t, el('span', '›', 'go'));
    b.onclick = () => { S.later = false; paint(); };
    parts.push(b);
  } else if (mode === 'parked') {
    parts.push(el('div', S.parked === 'hidden' ? 'This tab was in the background for a while, so it left the room.' : 'You were away for a while, so you left the room.', 'msg'));
    parts.push(link('Rejoin the room', () => { active(); unpark(); }, 'lnk guest'));
  } else {
    parts.push(el('div', 'Another tab of yours is in the room. You are not connected here.', 'msg'));
    parts.push(link('Use this tab instead', () => { reconnect(); paint(); }, 'lnk guest'));
  }
  // Only rebuilt when something changed, so a click is never lost to a repaint between press and release.
  const next = el('div'); next.append(...parts);
  slot.hidden = false;
  if (next.innerHTML === introHtml) return;
  introHtml = next.innerHTML;
  slot.replaceChildren(...parts);
}

function paint() {
  tellSelf();
  tellSalon();
  paintIntro();
  if (!wrap || !btn || !panel) return;
  const signed = !!(S.signed && S.you && !S.you.guest);
  const me = signed ? labelFor(S.signed!.address) : null;
  btn.className = S.parked ? 'wait' : S.away ? 'away' : S.connected ? 'live' : 'wait';
  // On a phone the page's top-right buttons are 34 px icons, so the words hide and only the dot and the number show.
  btn.replaceChildren(el('i'), el('span', S.parked ? 'Rejoin the room' : me ? (S.away ? `${me} · away` : me) : 'Room', 'lbl'), el('span', S.connected ? (window.matchMedia?.('(max-width:620px)').matches ? String(S.joined) : ` · ${S.joined}`) : '', 'n'));
  btn.setAttribute('aria-label', `Casino room: ${S.connected ? `${S.joined} signed in, ` : ''}${S.parked ? 'you left; tap to rejoin' : me ? `you are in as ${me}${S.away ? ', marked away' : ''}` : 'see who is here and join'}`);
  panel.hidden = !S.open;
  if (!S.open) return;
  placePanel();
  const parts: HTMLElement[] = [];
  if (S.parked) {
    parts.push(el('h3', 'Room'), el('p', S.parked === 'hidden'
      ? 'This tab was in the background for a while, so it left the room and your seat was freed.'
      : 'You were away for a while, so you left the room and your seat was freed.'));
    const b = el('button', 'Rejoin the room'); b.onclick = () => { active(); unpark(); };
    parts.push(b);
  } else if (S.replaced) {
    parts.push(el('h3', 'Room'), el('p', 'Another tab of yours took over the room. You are not connected here.'));
    const b = el('button', 'Use this tab instead'); b.onclick = () => { reconnect(); paint(); };
    parts.push(b);
  } else if (signed) {
    parts.push(el('h3', 'Connected as'), el('p', me!, 'who'));
    const via: Record<string, string> = { leather: 'Leather', xverse: 'Xverse', casino: 'your casino wallet' };
    parts.push(el('p', (S.wallet ? `With ${via[S.wallet.kind] || S.wallet.kind}. ` : '') + 'Others see this name on your tag.', 'fact'));
    if (S.away) {
      parts.push(el('p', 'You are marked away (idle for a while), so you were stood up. Do anything to come back.', 'err'));
      const back = el('button', "I'm back"); back.onclick = () => active(); parts.push(back);
    }
    parts.push(el('p', 'Your address (tap Copy to share it, say for someone to send you a BNS name):'), addressBlock(S.signed!.address, mainnetOf));
    hereNow(parts);
    parts.push(fact('Be seen', 'Sit at a table or connect to a machine and your Adrian and name tag appear there for everyone in the room. Stand up or walk away and they go too.'));
    parts.push(fact('Spaces', 'Each seat and machine holds one person. If someone already has the seat you choose, you are given a free one at the same table.'));
    parts.push(fact('Live chat', 'Press Chat to talk to the room and scroll back through this session. Tap a name, or Here now, to send someone a direct message, block or report them. Messages are not secret; this session\'s chat is kept in this tab only and cleared when you leave the room.'));
    if (S.features.includes('rounds')) parts.push(fact('Play together', 'Roulette and baccarat are shared tables: everyone there plays the same spin or hand, dealt by the room on a timer and checked by your own browser. In the Strata Salon you can take on another player instead of the house bot.'));
    if (S.features.includes('react')) parts.push(fact('React', 'Press 😊 to react, buy your table a round, send someone a drink or invite a friend. Table chat (the Table button in Chat) reaches only the people at your table. Sign in each day for a free daily drop of LAYR.'));
    parts.push(el('p', 'Nothing here moves any money.', 'fact'));
    const b = el('button', 'Leave the room'); b.onclick = () => { void leave(); };
    parts.push(b);
  } else {
    parts.push(el('h3', 'Join the room'));
    parts.push(el('p', !S.connected
      ? 'Connecting to the room…'
      : S.watch
        ? `You are watching: ${S.joined} signed in, ${S.guests} watching.`
        : `${S.joined} ${S.joined === 1 ? 'person is' : 'people are'} in the room. Sign in to join them.`));
    parts.push(fact('Be seen', S.watch
      ? 'Join, then sit at a table or connect to a machine. Everyone in the room sees your Adrian there, with a name tag (your BNS name, or a short version of your address). Watching alone shows you to nobody.'
      : 'Join, then sit at a table or connect to a machine. Everyone in the room sees your Adrian there, with a name tag (your BNS name, or a short version of your address). Until you join you are invisible, and the room is hidden from you; the casino still plays as normal.'));
    if (S.connected && S.watch) hereNow(parts);
    parts.push(fact('Spaces', 'Each seat and machine holds one person. If someone already has the seat you choose, you are given a free one at the same table.'));
    parts.push(fact('Live chat', 'Signed-in players can chat with the room and send each other direct messages. Messages are not secret and are not saved.'));
    parts.push(fact('Free', 'One signature. It sends no transaction, costs no fee and gives no permission to spend anything.'));
    const row = el('div', undefined, 'row');
    const ui = casinoWalletUi();
    const names: Record<WalletKind, string> = { leather: 'Leather', xverse: 'Xverse', casino: ui ? ui.describe().label : 'Casino wallet' };
    for (const kind of joinOrder()) {
      const b = el('button', S.busy ? (S.busy === 'sign' ? 'Check your wallet…' : 'Connecting…') : names[kind]);
      b.disabled = !!S.busy || !S.connected;
      b.onclick = () => { void join(kind); };
      if (kind === 'casino') b.style.flexBasis = '100%';
      row.append(b);
      if (S.busy) break;
    }
    parts.push(row);
    if (ui && !ui.describe().has) parts.push(el('p', 'Casino wallet: use your casino passkey from any of your devices, or make one free with Face ID or your fingerprint (500 free testnet STX and your first 1,000,000 LAYR).', 'fact'));
    if (S.error) parts.push(el('p', S.error, 'err'));
    if (!S.busy) { const later = el('button', 'Not now'); later.onclick = () => { S.open = false; paint(); }; parts.push(later); }
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

/** The visitor's own position on the floor (or that they left it), announced by the page. */
const onOwnMove = (event: Event) => {
  const d = (event as CustomEvent).detail;
  if (!d) return;
  if (d.off) S.ownMove = null;
  else if ([d.x, d.z, d.r].every((n) => typeof n === 'number' && Number.isFinite(n))) S.ownMove = { x: d.x, z: d.z, r: d.r };
  else return;
  sendOwnMove();
};

/**
 * The page's own social messages (reactions, wins, the daily drop, shared-round bets, drinks, Salon moves, chess snapshots...). Only what the room
 * lists as a feature is sent; everything but `round` and `watch` needs the visitor signed in. A message that cannot go now is
 * handed back as `{ t: 'unsent', msg }`, so the page never waits for an answer that will not come.
 */
const FEATURE_OF: Record<string, string> = {
  react: 'react', win: 'win', daily: 'daily', watch: 'table', round: 'rounds', bet: 'rounds', gift: 'gift', seek: 'pvp', pvp: 'pvp', spec: 'spec',
  log: 'progress', mission: 'missions', card: 'progress', board: 'boards', tjoin: 'tourney', bal: 'bal', friends: 'friends'
};
const onPageSend = (event: Event) => {
  const msg = (event as CustomEvent).detail as Record<string, unknown> | undefined;
  if (!msg || typeof msg.t !== 'string' || !FEATURE_OF[msg.t]) return;
  const anyone = msg.t === 'round' || msg.t === 'watch' || (msg.t === 'spec' && msg.ask === true);   // a guest may watch a chess game
  const ok = S.service === 'ok' && S.connected && S.features.includes(FEATURE_OF[msg.t]) && (anyone || !!(S.signed && S.you && !S.you.guest));
  if (!ok || S.ws?.readyState !== WebSocket.OPEN) { tellPage({ t: 'unsent', msg }); return; }
  S.ws.send(JSON.stringify(msg));     // directly: social messages must not hold back the seat updates
};

const watchSeat = () => {
  const spot = S.host?.currentSpot() ?? null;
  if (spot !== S.want) { S.want = spot; S.yielded = null; S.standSent = null; pushPeople(); }   // the player moved: this tab speaks for them again
  reconcile();
};

async function start() {
  const offline = () => { S.service = 'offline'; tellSalon(); };   // the casino plays on; only the Salon's door needs to know
  try {
    const { res, body } = await postJson('/casino/room/session');
    if (res.status === 503) return offline();          // the room is switched off: say nothing, change nothing
    if (res.ok && body?.address) { S.signed = { address: body.address, hash160: body.hash160, expiresAt: body.expiresAt }; S.resumed = true; }
    S.service = 'ok';
  } catch { return offline(); }                       // unreachable: fail open
  buildUi(); paint();
  connect();
  window.setInterval(watchSeat, 250);
  window.setInterval(arrivalPrompt, 500);
  window.addEventListener('px-wallet-connected', (e) => { void joinWithConnected(e); });
  window.addEventListener('px-casino-wallet-ready', () => paint());
  window.addEventListener('px-room-play', onOwnSpin);
  window.addEventListener('px-room-move', onOwnMove);
  window.addEventListener('px-room-send', onPageSend);
  window.addEventListener('px-room-bns-check', () => { void onBnsCheck(); });
  // The welcome card's own buttons (Enter, a table, the bar...): going in without signing in means "later" for the join step.
  document.getElementById('intro')?.addEventListener('click', (e) => {
    // composedPath, not closest(): a button inside the join step may already have been redrawn (detached) by its own click
    const path = e.composedPath() as Element[];
    if (!path.some((n) => n instanceof HTMLButtonElement) || path.some((n) => n instanceof Element && n.id === 'introJoin')) return;
    if (!(S.signed && S.you && !S.you.guest) && !S.busy && !S.later) { S.later = true; paint(); }
  });
  // who is here: a heartbeat, and the background and idle clocks; anything the visitor does means they are here
  window.setInterval(hereTick, 1000);
  for (const type of ['pointerdown', 'keydown', 'wheel', 'touchstart']) window.addEventListener(type, active, { capture: true, passive: true });
  window.addEventListener('px-room-play', active);
  window.addEventListener('px-room-move', active);
  document.addEventListener('visibilitychange', () => { if (document.hidden) S.hiddenAt = Date.now(); else { S.hiddenAt = 0; active(); } });
  // The page: somebody tapped another player in the casino (their figure or name tag). Their menu (with their address) opens in chat.
  window.addEventListener('px-room-person', (e) => { const d = (e as CustomEvent).detail; if (d && chat && chat.openPerson(d.a)) d.handled = true; });
}

// The shared rounds' fairness check and results, for the page (the same code the room's tests run): see casino-rounds.ts.
(window as any).PXRounds = Object.freeze({ verifySeed, rouletteResult, baccaratCards, sicboDice });

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
  here: () => ({ away: S.away, parked: S.parked, players: [...S.players.values()], idleFor: Date.now() - S.lastActive, times: { ...HERE } }),
  get state() { return { service: S.service, signed: S.signed?.address ?? null, connected: S.connected, watch: S.watch, prompted: S.prompted, open: S.open, busy: S.busy, error: S.error, you: S.you, spots: S.spots, joined: S.joined, guests: S.guests, want: S.want, features: S.features.slice(), walkers: [...S.walk.keys()], ownMove: S.ownMove, salon: salonInfo(), trail: connectTrail.slice() }; }
};
