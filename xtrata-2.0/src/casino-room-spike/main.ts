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
    if (state.attempts > 1) state.reconnects += 1;
    state.attempts = 0;
  };
  ws.onmessage = (event) => {
    let m: any; try { m = JSON.parse(String(event.data)); } catch { return; }
    switch (m.t) {
      case 'room':
        state.you = m.you; state.spots = m.spots || {}; state.joined = m.joined; state.guests = m.guests;
        if (state.wantSpot && state.you && !state.you.guest && !Object.values(state.spots).some((s) => s.a === state.you!.a)) {
          log('re-sitting at ' + state.wantSpot); ws.send(JSON.stringify({ t: 'sit', spot: state.wantSpot }));
        }
        if (state.idleCheck) finishIdle(m); break;
      case 'sat': state.spots[m.spot] = m.who; break;
      case 'stood': delete state.spots[m.spot]; break;
      case 'moved': log(`another tab of yours took ${m.spot}`); if (state.wantSpot === m.spot) state.wantSpot = null; break;
      case 'count': state.joined = m.joined; state.guests = m.guests; break;
      case 'pong': state.timers.pingMs = Math.round(performance.now() - state.pingSent); log(`pong (${state.timers.pingMs} ms)`); break;
      case 'err': log('room says: ' + m.code); break;
    }
    paintRoom();
  };
  ws.onclose = (event) => {
    state.lastClose = { code: event.code, reason: event.reason };
    log(`room: closed (${event.code}${event.reason ? ' ' + event.reason : ''})`);
    if (state.ws !== ws) return;     // a newer connection replaced this one on purpose
    state.ws = null;
    if (event.code === 4001) { state.replaced = true; setStatus('roomStatus', 'Another tab of yours replaced this one.', 'bad'); return; }
    setStatus('roomStatus', 'Disconnected. Reconnecting…', 'bad');
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

// ------------------------------------------------------------------ report

const makeReport = () => {
  const report = {
    page: 'casino-room-spike v1',
    at: new Date().toISOString(),
    userAgent: navigator.userAgent,
    wallet: { kind: linked?.kind ?? null, selectedProviderId: getSelectedWalletProviderId() || null, address: linked?.address ?? null, network: linked?.network ?? null, connectedVia: linked?.via ?? null, connectTrail: trail },
    signedAs: state.signedAs && { address: state.signedAs.address, network: state.signedAs.network, hash160: state.signedAs.hash160 },
    results: state.results,
    timersMs: state.timers,
    websocket: { opened: state.opened, reconnects: state.reconnects, lastClose: state.lastClose, replaced: state.replaced },
    room: { you: state.you, joined: state.joined, guests: state.guests, spots: state.spots }
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
