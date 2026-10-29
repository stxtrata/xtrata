/**
 * Casino room test page (P0 spike of docs/plans/CASINO-PRESENCE-PLAN.md).
 *
 * Connect a wallet the way the casino pages do (public/casino/index.html: providers found on the top window, Leather via
 * getAddresses, Xverse via wallet_disconnect then wallet_connect, either network accepted), sign ONE free SIP-018 message
 * with the app's own signing code (WALLET-PLAYBOOK: legacy bridge first, RPC only when the wallet removed it), exchange it
 * for a session cookie, then open the room WebSocket, sit on a spot, and prove the room survives idling and reconnecting.
 *
 * The app's standard connect adapter is NOT used: it only accepts mainnet accounts, and the casino runs on testnet, so a
 * tester whose wallet is set up for the casino would be refused (found in the first real-wallet test, 2026-10-29).
 * Built with `npm run build:casino-room-spike` into public/casino-room-spike/spike.js (not part of `prebuild`).
 */
import { clearSelectedProviderId, setSelectedProviderId } from '@stacks/connect-ui';
import { getSelectedWalletProviderId } from '../lib/wallet/connect';
import { requestStructuredSignature } from '../lib/wallet/structured-sign';
import { roomProofData, type RoomChallenge } from '../../functions/lib/casino-room-proof';
import { SPOTS } from '../../functions/lib/casino-room';

const $ =<T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;

type SpotView = { a: string; n: string; since: number };
const state = {
  signedAs: null as null | { address: string; hash160: string; network: string; expiresAt: number },
  spots: {} as Record<string, SpotView>,
  joined: 0,
  guests: 0,
  you: null as null | { a: string | null; n: string; guest: boolean },
  ws: null as null | WebSocket,
  wantSpot: null as string | null,
  attempts: 0,
  reconnects: 0,
  lastClose: null as null | { code: number; reason: string },
  replaced: false,
  timers: {} as Record<string, number | string>,
  results: {} as Record<string, unknown>,
  opened: 0,
  pingSent: 0,
  idleCheck: null as null | { before: string; started: number }
};

const t0 = performance.now();
const log = (line: string) => {
  const el = $('log');
  el.textContent += `${((performance.now() - t0) / 1000).toFixed(1).padStart(6)}s  ${line}\n`;
  el.scrollTop = el.scrollHeight;
};
const setStatus = (id: string, text: string, tone: '' | 'ok' | 'bad' = '') => {
  const el = $(id);
  el.textContent = text;
  el.className = 'status ' + (tone || 'dim');
};
const short = (a: string | null | undefined) => (a ? `${a.slice(0, 5)}…${a.slice(-4)}` : 'Guest');
const message = (e: unknown) => (e instanceof Error ? e.message : String(e));

// ------------------------------------------------------------------ wallet

type Kind = 'leather' | 'xverse';
type Linked = { kind: Kind; address: string; network: 'mainnet' | 'testnet'; via: string };
let linked: Linked | null = null;
const trail: string[] = [];     // what each wallet method answered, for the report

const usable = (p: any) => !!p && typeof p.request === 'function';
// Extensions inject into the top same-origin window only (WALLET-PLAYBOOK), so look there first.
const hostWin = (): any => {
  try { const t = window.top; if (t && t !== window.self && t.location.origin === window.location.origin) return t; } catch { /* cross-origin parent */ }
  return window;
};
const wins = (): any[] => { const h = hostWin(); return h === window ? [window] : [h, window]; };
const find = (get: (w: any) => any) => { for (const w of wins()) { const v = get(w); if (v) return v; } return null; };
const providerFor = (kind: Kind) => {
  if (kind === 'leather') {
    const le = find((w) => (usable(w.LeatherProvider) ? w.LeatherProvider : null));
    return le ? { rpc: le } : null;
  }
  const X = find((w) => { const x = w.XverseProviders || w.xverseProviders; return x && (usable(x.BitcoinProvider) || usable(x.StacksProvider)) ? x : null; });
  if (!X) return null;
  const bt = usable(X.BitcoinProvider) ? X.BitcoinProvider : null;
  const st = usable(X.StacksProvider) ? X.StacksProvider : null;
  return { rpc: bt || st };
};
const detect = (kind: Kind, ms: number) => new Promise<ReturnType<typeof providerFor>>((resolve) => {
  const started = Date.now();
  (function look() {
    const p = providerFor(kind);
    if (p || Date.now() - started >= ms) resolve(p); else window.setTimeout(look, 150);
  })();
});

const codeOf = (x: any) => x?.code ?? x?.error?.code;
const msgOf = (x: any) => String(x?.message ?? x?.error?.message ?? x ?? 'unknown error');
const cancelled = (e: any) => [4001, -31001].includes(Number(codeOf(e))) || /cancel|denied|reject|declin|closed/i.test(msgOf(e));
const unsupported = (e: any) => Number(codeOf(e)) === -32601 || /not supported|method not found|unsupported|not implemented|legacy method/i.test(msgOf(e));
// Wallets answer as {result}, {error}, {status}, or throw. Everything comes out of here as a result or an Error.
const call = async (p: any, method: string, params?: unknown) => {
  const r = params === undefined ? await p.request(method) : await p.request(method, params);
  if (r && typeof r === 'object') {
    if (r.error) throw Object.assign(new Error(msgOf(r.error)), { code: codeOf(r.error) });
    if (r.status === 'error') throw Object.assign(new Error(msgOf(r.error || r)), { code: codeOf(r.error || r) });
    if ('result' in r) return r.result;
  }
  return r;
};
// Xverse mobile can reject with a toast and leave the request pending for ever: stop waiting after 90 s.
const watchdog = <T,>(pr: Promise<T>) => new Promise<T>((resolve, reject) => {
  const t = window.setTimeout(() => reject(new Error('The wallet did not answer. Check its window.')), 90_000);
  pr.then((v) => { window.clearTimeout(t); resolve(v); }, (e) => { window.clearTimeout(t); reject(e); });
});
const addressesIn = (res: unknown) => (JSON.stringify(res) || '').match(/S[PT][0-9A-HJKMNP-TV-Z]{38,39}/g) || [];

async function connectWallet(kind: Kind): Promise<Linked> {
  const pv = await detect(kind, 1500);
  if (!pv) throw new Error(`${kind === 'leather' ? 'Leather' : 'Xverse'} was not found in this browser.`);
  trail.length = 0;
  let plans: string[];
  if (kind === 'xverse') {
    try { await call(pv.rpc, 'wallet_disconnect'); trail.push('wallet_disconnect: ok'); } catch (e) { trail.push('wallet_disconnect: ' + msgOf(e).slice(0, 80)); }
    plans = ['wallet_connect', 'wallet_getAccount'];
  } else {
    plans = ['getAddresses', 'stx_getAccounts', 'stx_getAddresses', 'stx_requestAccounts'];
  }
  let lastError: unknown = null;
  for (const method of plans) {
    try {
      const res = await (kind === 'xverse' ? watchdog(call(pv.rpc, method)) : call(pv.rpc, method));
      const found = addressesIn(res);
      if (found.length) {
        const address = found[0] as string;
        trail.push(`${method}: ok`);
        return { kind, address, network: address.startsWith('SP') ? 'mainnet' : 'testnet', via: method };
      }
      trail.push(`${method}: answered but no Stacks address in it`);
    } catch (e) {
      if (cancelled(e)) { trail.push(`${method}: cancelled`); throw new Error('Connection cancelled.'); }
      trail.push(`${method}: ${unsupported(e) ? 'not supported' : msgOf(e).slice(0, 80)}`);
      if (!unsupported(e)) lastError = e;
    }
  }
  throw new Error(lastError ? msgOf(lastError) : 'The wallet did not share a Stacks address.');
}

const paintWallet = () => {
  const on = !!linked;
  $<HTMLButtonElement>('signin').disabled = !on || !!state.signedAs;
  $<HTMLButtonElement>('disconnect').disabled = !on;
  setStatus('walletStatus', linked
    ? `Connected: ${linked.address} (${linked.network}, ${linked.kind}, via ${linked.via})`
    : 'Not connected.', linked ? 'ok' : '');
};

const startConnect = async (kind: Kind) => {
  try {
    log(`connect: asking ${kind}`);
    linked = await connectWallet(kind);
    setSelectedProviderId(kind === 'leather' ? 'LeatherProvider' : 'XverseProviders.BitcoinProvider');   // the ids the standard chooser stores; the signing helper uses them to find the same wallet
    state.results.connect = `ok (${linked.kind}, ${linked.network}, via ${linked.via})`;
    log(`connect: ok ${short(linked.address)} (${linked.network}) via ${linked.via}`);
  } catch (e) {
    linked = null;
    state.results.connect = 'error: ' + message(e);
    log('connect failed: ' + message(e));
    setStatus('walletStatus', 'Could not connect: ' + message(e), 'bad');
    return;
  }
  paintWallet();
};
$('connect-leather').onclick = () => startConnect('leather');
$('connect-xverse').onclick = () => startConnect('xverse');
$('disconnect').onclick = async () => {
  const was = linked; linked = null;
  try { clearSelectedProviderId(); } catch { /* nothing selected */ }
  if (was) {
    const pv = providerFor(was.kind);
    for (const m of was.kind === 'xverse' ? ['wallet_disconnect'] : ['stx_disconnect', 'wallet_disconnect', 'disconnect', 'deactivate']) {
      try { if (pv) await call(pv.rpc, m); break; } catch (e) { if (!unsupported(e)) break; }
    }
  }
  log('wallet disconnected'); paintWallet(); paintSigned();
};

// ------------------------------------------------------------------ sign in

const postJson = async (path: string, init?: RequestInit) => {
  const res = await fetch(path, { credentials: 'same-origin', ...init });
  let body: any = null;
  try { body = await res.json(); } catch { /* no body */ }
  return { res, body };
};

$('signin').onclick = async () => {
  const s = linked;
  if (!s) return;
  const button = $<HTMLButtonElement>('signin');
  button.disabled = true;
  try {
    setStatus('signStatus', 'Asking the room for a sign-in request…');
    const a = performance.now();
    const { res: cres, body: cbody } = await postJson(`/casino/room/challenge?address=${encodeURIComponent(s.address)}`);
    state.timers.challengeMs = Math.round(performance.now() - a);
    if (!cres.ok) throw new Error(cbody?.error || `The room answered ${cres.status}.`);
    const challenge = cbody.challenge as RoomChallenge;
    log(`challenge: ok (${state.timers.challengeMs} ms), network ${challenge.network}`);

    setStatus('signStatus', 'Your wallet should now ask you to sign. This is free.');
    const { domain, message: msg } = roomProofData(challenge);
    const b = performance.now();
    let signature: string;
    try {
      signature = await requestStructuredSignature({ domain, message: msg, network: challenge.network, stxAddress: s.address });
    } catch (e) {
      state.results.sign = 'wallet error: ' + message(e);
      throw new Error('The wallet did not sign: ' + message(e));
    }
    state.timers.signMs = Math.round(performance.now() - b);
    state.results.sign = 'ok';
    log(`sign: ok (${state.timers.signMs} ms)`);

    const c = performance.now();
    const { res: sres, body: sbody } = await postJson('/casino/room/session', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ challenge, signature })
    });
    state.timers.sessionMs = Math.round(performance.now() - c);
    if (!sres.ok) { state.results.session = `rejected ${sres.status}: ${sbody?.error}`; throw new Error(sbody?.error || `The room answered ${sres.status}.`); }
    state.results.session = 'ok';
    state.signedAs = { address: sbody.address, hash160: sbody.hash160, network: sbody.network, expiresAt: sbody.expiresAt };
    log(`session: ok (${state.timers.sessionMs} ms), key hash ${sbody.hash160}`);
    paintSigned();
    reconnect('signed in');
  } catch (e) {
    log('sign-in failed: ' + message(e));
    setStatus('signStatus', message(e), 'bad');
    button.disabled = false;
  }
};

$('signout').onclick = async () => {
  await postJson('/casino/room/session', { method: 'DELETE' });
  state.signedAs = null; state.wantSpot = null;
  log('signed out');
  paintSigned();
  reconnect('signed out');
};

function paintSigned() {
  const s = state.signedAs;
  $<HTMLButtonElement>('signin').disabled = !!s || !linked;
  $<HTMLButtonElement>('signout').disabled = !s;
  setStatus('signStatus', s
    ? `Signed in as ${s.address} (${s.network}). Account key hash ${s.hash160.slice(0, 12)}… Session ends ${new Date(s.expiresAt).toLocaleTimeString()}.`
    : 'Not signed in. You can still watch the room as a guest.', s ? 'ok' : '');
  paintChat();
}

// ------------------------------------------------------------------ room

const paintRoom = () => {
  const mine = state.you?.a ?? null;
  const grid = $('spots');
  grid.textContent = '';
  for (const id of SPOTS) {
    const holder = state.spots[id];
    const b = document.createElement('button');
    const name = document.createElement('span'); name.textContent = id;
    const who = document.createElement('small'); who.textContent = holder ? (holder.a === mine ? 'you' : holder.n) : 'free';
    b.append(name, who);
    if (holder?.a === mine && mine) b.className = 'mine'; else if (holder) b.className = 'taken';
    b.disabled = !mine || (!!holder && holder.a !== mine);
    b.onclick = () => send({ t: 'sit', spot: id });
    grid.append(b);
  }
  $<HTMLButtonElement>('stand').disabled = !mine || !Object.values(state.spots).some((s) => s.a === mine);
  $('counts').textContent = `${state.joined} signed in, ${state.guests} watching. ${state.you ? 'You are ' + (state.you.guest ? 'a guest (watching only).' : state.you.n + '.') : ''}`;
};

const send = (msg: unknown) => {
  if (state.ws?.readyState === WebSocket.OPEN) {
    if ((msg as any).t === 'sit') state.wantSpot = (msg as any).spot;
    if ((msg as any).t === 'stand') state.wantSpot = null;
    state.ws.send(JSON.stringify(msg));
  } else log('not connected to the room');
};
$('stand').onclick = () => send({ t: 'stand' });

function connect() {
  state.attempts += 1;
  const url = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/casino/room/ws`;
  const started = performance.now();
  setStatus('roomStatus', state.attempts > 1 ? 'Reconnecting…' : 'Connecting…');
  let ws: WebSocket;
  try { ws = new WebSocket(url); } catch (e) { log('websocket could not start: ' + message(e)); return scheduleRetry(); }
  state.ws = ws;
  ws.onopen = () => {
    state.timers.wsOpenMs = Math.round(performance.now() - started);
    state.results.websocket = 'open';
    state.opened += 1;
    log(`room: connected (${state.timers.wsOpenMs} ms)`);
    setStatus('roomStatus', 'Connected to the room.', 'ok');
    paintChat();
    if (state.attempts > 1) state.reconnects += 1;
    state.attempts = 0;
  };
  ws.onmessage = (event) => {
    let m: any; try { m = JSON.parse(String(event.data)); } catch { return; }
    switch (m.t) {
      case 'room':
        state.you = m.you; state.spots = m.spots || {}; state.joined = m.joined; state.guests = m.guests;
        chat.players = m.players || []; chat.known = true; sendBlocks();
        if (state.wantSpot && state.you && !state.you.guest && !Object.values(state.spots).some((s) => s.a === state.you!.a)) {
          log('re-sitting at ' + state.wantSpot); ws.send(JSON.stringify({ t: 'sit', spot: state.wantSpot }));
        }
        if (state.idleCheck) finishIdle(m); break;
      case 'sat': state.spots[m.spot] = m.who; break;
      case 'stood': delete state.spots[m.spot]; break;
      case 'moved': log(`another tab of yours took ${m.spot}`); if (state.wantSpot === m.spot) state.wantSpot = null; break;
      case 'count': state.joined = m.joined; state.guests = m.guests; break;
      case 'join':
        if (!chat.players.some((p) => p.a === m.who.a)) chat.players.push({ a: m.who.a, n: m.who.n, spot: null });
        note(chat.room, `${m.who.n} arrived.`);
        break;
      case 'leave': {
        const gone = chat.players.find((p) => p.a === m.a);
        chat.players = chat.players.filter((p) => p.a !== m.a);
        if (gone) { note(chat.room, `${gone.n} left.`); if (chat.threads[m.a]) note(chat.threads[m.a].lines, `${gone.n} left the room.`); }
        break;
      }
      case 'say': case 'dm': heard(m); break;
      case 'blocks': log(`room keeps ${m.list.length} blocked`); break;
      case 'reported': setStatus('chatStatus', 'Report sent. Thank you.', 'ok'); log('report sent'); break;
      case 'pong': state.timers.pingMs = Math.round(performance.now() - state.pingSent); log(`pong (${state.timers.pingMs} ms)`); break;
      case 'err': log('room says: ' + m.code); chatFailed(m.code); break;
    }
    paintRoom();
    paintChat();
  };
  ws.onclose = (event) => {
    state.lastClose = { code: event.code, reason: event.reason };
    log(`room: closed (${event.code}${event.reason ? ' ' + event.reason : ''})`);
    if (state.ws !== ws) return;     // a newer connection replaced this one on purpose
    state.ws = null;
    if (event.code === 4001) { state.replaced = true; setStatus('roomStatus', 'Another tab of yours replaced this one.', 'bad'); return; }
    setStatus('roomStatus', 'Disconnected. Reconnecting…', 'bad');
    paintChat();
    scheduleRetry();
  };
  ws.onerror = () => { state.results.websocket = state.results.websocket === 'open' ? 'open' : 'error'; };
}

function scheduleRetry() {
  const wait = Math.min(15000, 1000 * 2 ** Math.min(state.attempts, 4));
  log(`retrying in ${wait / 1000}s`);
  window.setTimeout(() => { if (!state.ws) connect(); }, wait);
}

function reconnect(why: string) {
  log('reconnecting: ' + why);
  const old = state.ws; state.ws = null; state.attempts = 0; state.replaced = false;
  try { old?.close(1000, 'client'); } catch { /* already closed */ }
  connect();
}
$('reconnect').onclick = () => reconnect('button');

// Idle test: sit still for 30 s (the object should hibernate), then ask for the room again and see whether it remembers us.
$('idle').onclick = () => {
  if (state.ws?.readyState !== WebSocket.OPEN) { log('idle test: connect first'); return; }
  const before = JSON.stringify(Object.keys(state.spots).sort());
  state.idleCheck = { before, started: performance.now() };
  setStatus('idleStatus', 'Idle test running. Do not touch anything for 30 seconds…');
  window.setTimeout(() => { state.pingSent = performance.now(); send({ t: 'ping' }); send({ t: 'hello' }); }, 30_000);
};
function finishIdle(m: any) {
  const check = state.idleCheck; if (!check) return;
  state.idleCheck = null;
  const after = JSON.stringify(Object.keys(m.spots || {}).sort());
  const same = after === check.before;
  state.results.idle = same ? 'ok: room state intact after 30 s idle' : `changed: before ${check.before} after ${after}`;
  setStatus('idleStatus', same ? 'Idle test passed: the room remembered everyone after 30 seconds.' : 'Idle test: the room changed while idle (see report).', same ? 'ok' : 'bad');
  log('idle test: ' + state.results.idle);
}

// ------------------------------------------------------------------ people and chat

type Person = { a: string; n: string };
type Line = { who: Person | null; mine: boolean; text: string; at: number };   // `who` is null for a note from the room
type Thread = { name: string; lines: Line[]; unread: boolean };
const MAX_LINES = 200;
const MAX_BLOCKS = 40;
const BLOCKS_KEY = 'px_room_blocks_v1';
const loadBlocks = (): string[] => {
  try {
    const v = JSON.parse(localStorage.getItem(BLOCKS_KEY) || '[]');
    return Array.isArray(v) ? v.filter((a) => typeof a === 'string').slice(0, MAX_BLOCKS) : [];
  } catch { return []; }
};
const chat = {
  players: [] as Array<{ a: string; n: string; spot: string | null }>,
  known: false,                         // the room has told us who is here at least once; before that, "nobody here" would be a guess
  room: [] as Line[],
  threads: {} as Record<string, Thread>,
  open: [] as string[],                 // addresses with a tab, in the order they were opened
  active: 'room',
  unreadRoom: false,
  blocks: loadBlocks(),
  pending: null as null | string,       // the text just sent, handed back if the room refuses it
  sent: 0,
  received: 0,
  errors: [] as string[]
};
const saveBlocks = () => {
  try { localStorage.setItem(BLOCKS_KEY, JSON.stringify(chat.blocks)); } catch { /* a private window: the list lasts until the page closes */ }
};
const CHAT_ERRORS: Record<string, string> = {
  'no-links': 'Links are not allowed in messages.',
  'too-long': 'That message is too long (280 characters at most).',
  'empty': 'Type something first.',
  'slow-down': 'Slow down a little: one message every two seconds.',
  'not-here': 'That person has left the room.',
  'blocked': 'You have blocked this person. Unblock them to message them.',
  'not-you': 'You cannot do that to yourself.',
  'sign-in-first': 'Sign in (step 2) to chat.',
  'no-such-player': 'That person is not in the room.'
};

const mine = () => (state.you && !state.you.guest ? state.you.a : null);
const connected = () => state.ws?.readyState === WebSocket.OPEN;
const spotOf = (address: string) => Object.entries(state.spots).find(([, v]) => v.a === address)?.[0] ?? null;
const pushLine = (lines: Line[], line: Line) => { lines.push(line); if (lines.length > MAX_LINES) lines.splice(0, lines.length - MAX_LINES); };
const note = (lines: Line[], text: string) => pushLine(lines, { who: null, mine: false, text, at: Date.now() });
const clock = (at: number) => new Date(at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const el = <K extends keyof HTMLElementTagNameMap>(tag: K, text?: string, className?: string) => {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;          // always text, never markup: a message must not be able to run anything
  if (className) node.className = className;
  return node;
};

const ensureThread = (p: Person) => {
  const thread = chat.threads[p.a] ?? (chat.threads[p.a] = { name: p.n, lines: [], unread: false });
  if (!chat.open.includes(p.a)) chat.open.push(p.a);
  return thread;
};
const openThread = (p: Person) => {
  ensureThread(p).unread = false;
  chat.active = p.a;
  paintChat();
  $<HTMLInputElement>('chatInput').focus();
};

const paintPlayers = () => {
  const box = $('players');
  box.textContent = '';
  box.classList.toggle('stale', chat.known && !connected());
  if (!chat.known || chat.players.length === 0) {
    // A room we could not reach is not an empty room: only say "nobody" when the room itself said so.
    box.append(el('div', !chat.known ? (connected() ? 'Asking the room who is here…' : 'Not connected to the room.') : 'Nobody is signed in right now.', 'status dim'));
    return;
  }
  const me = mine();
  for (const p of chat.players) {
    const b = el('button', undefined, p.a === me ? 'me' : '');
    b.type = 'button';
    b.setAttribute('role', 'listitem');
    b.append(el('span', p.a === me ? 'You' : p.n), el('small', [spotOf(p.a) ?? 'not seated', chat.blocks.includes(p.a) ? 'blocked' : ''].filter(Boolean).join(' · ')));
    b.disabled = !me || p.a === me || !connected();
    b.onclick = () => openThread({ a: p.a, n: p.n });
    box.append(b);
  }
};

const paintTabs = () => {
  const tabs = $('tabs');
  tabs.textContent = '';
  const add = (id: string, label: string, unread: boolean) => {
    const b = el('button', label, chat.active === id ? 'on' : '');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', String(chat.active === id));
    if (unread) b.append(el('span', undefined, 'dot'));
    b.onclick = () => {
      chat.active = id;
      if (id === 'room') chat.unreadRoom = false; else chat.threads[id].unread = false;
      paintChat();
    };
    tabs.append(b);
  };
  add('room', 'Room', chat.unreadRoom);
  for (const a of chat.open) add(a, chat.threads[a].name, chat.threads[a].unread);
};

const paintThread = () => {
  const box = $('thread');
  const stick = box.scrollTop + box.clientHeight >= box.scrollHeight - 24;
  box.textContent = '';
  const inRoom = chat.active === 'room';
  const lines = inRoom ? chat.room : chat.threads[chat.active]?.lines ?? [];
  if (lines.length === 0) box.append(el('p', mine() ? 'No messages yet.' : 'Guests can see who is here but cannot read or send messages.', 'line note'));
  for (const l of lines) {
    const p = el('p', undefined, 'line' + (l.who ? (l.mine ? ' mine' : ' other') : ' note'));
    if (l.who) {
      const who = l.who;
      const name = el('b', l.mine ? 'You' : who.n);
      if (!l.mine && inRoom) { name.title = 'Message ' + who.n; name.onclick = () => openThread(who); }
      p.append(name, document.createTextNode(' ' + l.text));
    } else p.append(document.createTextNode(l.text));
    p.append(el('time', clock(l.at)));
    box.append(p);
  }
  if (stick) box.scrollTop = box.scrollHeight;
};

const paintTools = () => {
  const inDm = chat.active !== 'room';
  $('threadTools').hidden = !inDm;
  if (inDm) {
    $('blockBtn').textContent = chat.blocks.includes(chat.active) ? 'Unblock' : 'Block';
    $<HTMLButtonElement>('reportBtn').disabled = !mine() || !connected();
  }
};

const paintComposer = () => {
  const can = !!mine() && connected();
  const input = $<HTMLInputElement>('chatInput');
  input.disabled = !can;
  $<HTMLButtonElement>('chatSend').disabled = !can;
  input.placeholder = !mine() ? 'Sign in to chat' : !connected() ? 'Reconnecting…' : chat.active === 'room' ? 'Say something to the room' : `Message ${chat.threads[chat.active]?.name ?? ''}`;
  $('chatGate').textContent = mine()
    ? 'Messages are not private: they pass through the room service and are not stored. No links. Block hides you and them from each other.'
    : 'Guests can see who is here but cannot read or send messages. Sign in (step 2) to chat.';
};

function paintChat() { paintPlayers(); paintTabs(); paintThread(); paintTools(); paintComposer(); }

const chatFailed = (code: string) => {
  const text = CHAT_ERRORS[code];
  if (!text) return;
  chat.errors.push(code);
  if (chat.errors.length > 10) chat.errors.shift();
  setStatus('chatStatus', text, 'bad');
  const input = $<HTMLInputElement>('chatInput');
  if (chat.pending && !input.value) input.value = chat.pending;   // give the person their words back
  chat.pending = null;
};

const sendBlocks = () => { if (mine() && connected()) state.ws!.send(JSON.stringify({ t: 'blocks', list: chat.blocks })); };

const heard = (m: any) => {
  const me = mine();
  const own = m.from.a === me;
  if (own) chat.pending = null; else chat.received += 1;
  if (m.t === 'say') {
    pushLine(chat.room, { who: m.from, mine: own, text: m.text, at: m.at });
    if (chat.active !== 'room' && !own) chat.unreadRoom = true;
    return;
  }
  const other: Person = own ? m.to : m.from;
  const thread = ensureThread(other);
  pushLine(thread.lines, { who: m.from, mine: own, text: m.text, at: m.at });
  if (chat.active !== other.a && !own) thread.unread = true;
};

$<HTMLFormElement>('composer').onsubmit = (event) => {
  event.preventDefault();
  const input = $<HTMLInputElement>('chatInput');
  const text = input.value.replace(/\s+/g, ' ').trim();
  if (!text) return;
  if (!mine() || !connected()) { setStatus('chatStatus', 'Not connected to the room.', 'bad'); return; }
  chat.pending = text;
  input.value = '';
  setStatus('chatStatus', '');
  chat.sent += 1;
  send(chat.active === 'room' ? { t: 'say', text } : { t: 'dm', to: chat.active, text });
};

$('blockBtn').onclick = () => {
  const who = chat.active;
  if (who === 'room') return;
  const thread = chat.threads[who];
  if (chat.blocks.includes(who)) {
    chat.blocks = chat.blocks.filter((a) => a !== who);
    note(thread.lines, `You unblocked ${thread.name}.`);
  } else {
    if (chat.blocks.length >= MAX_BLOCKS) { setStatus('chatStatus', 'Your block list is full.', 'bad'); return; }
    chat.blocks.push(who);
    note(thread.lines, `You blocked ${thread.name}. Neither of you will see the other's messages.`);
  }
  saveBlocks();
  sendBlocks();
  paintChat();
};

$('reportBtn').onclick = () => {
  const who = chat.active;
  if (who === 'room' || !mine() || !connected()) return;
  const why = $<HTMLSelectElement>('reportWhy').value;
  // What the reporter chooses to attach: the last few things this person said that this browser received.
  const lines = [...chat.room, ...(chat.threads[who]?.lines ?? [])].filter((l) => l.who?.a === who).slice(-5).map((l) => l.text.slice(0, 120));
  setStatus('chatStatus', 'Sending report…');
  send({ t: 'report', who, why, lines });
};

$('closeBtn').onclick = () => {
  chat.open = chat.open.filter((a) => a !== chat.active);
  chat.active = 'room';
  paintChat();
};

// ------------------------------------------------------------------ report

const makeReport = () => {
  const report = {
    page: 'casino-room-spike v2 (people and chat)',
    at: new Date().toISOString(),
    userAgent: navigator.userAgent,
    wallet: { kind: linked?.kind ?? null, selectedProviderId: getSelectedWalletProviderId() || null, address: linked?.address ?? null, network: linked?.network ?? null, connectedVia: linked?.via ?? null, connectTrail: trail },
    signedAs: state.signedAs && { address: state.signedAs.address, network: state.signedAs.network, hash160: state.signedAs.hash160 },
    results: state.results,
    timersMs: state.timers,
    websocket: { opened: state.opened, reconnects: state.reconnects, lastClose: state.lastClose, replaced: state.replaced },
    room: { you: state.you, joined: state.joined, guests: state.guests, spots: state.spots },
    chat: { players: chat.players.length, sent: chat.sent, received: chat.received, blocked: chat.blocks.length, openChats: chat.open.length, lastErrors: chat.errors }
  };
  return JSON.stringify(report, null, 2);
};
$('report').onclick = () => { $<HTMLTextAreaElement>('reportText').value = makeReport(); };
$('copy').onclick = async () => {
  const box = $<HTMLTextAreaElement>('reportText');
  if (!box.value) box.value = makeReport();
  try { await navigator.clipboard.writeText(box.value); log('report copied'); } catch { box.select(); log('select the text and copy it by hand'); }
};

// ------------------------------------------------------------------ start

paintWallet();
paintSigned();
paintRoom();
paintChat();
(async () => {
  try {
    const { res, body } = await postJson('/casino/room/session');
    if (res.ok && body?.address) {
      state.signedAs = { address: body.address, hash160: body.hash160, network: 'unknown', expiresAt: body.expiresAt };
      log('already signed in from earlier: ' + short(body.address));
      paintSigned();
    } else if (res.status === 503) {
      state.results.service = 'offline: ' + (body?.reason || 'unknown');
      setStatus('roomStatus', 'The room service is not switched on yet (this is expected before it is deployed).', 'bad');
      log('room service offline: ' + (body?.reason || res.status));
      return;
    }
  } catch (e) { log('could not reach the room service: ' + message(e)); }
  connect();
})();
