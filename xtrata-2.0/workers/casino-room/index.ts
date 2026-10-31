/**
 * Casino room: the Durable Object that holds who is in the casino and where they sit (P0 spike of
 * docs/plans/CASINO-PRESENCE-PLAN.md).
 *
 * - One object (`idFromName('main')`) is the whole room. WebSockets use the Hibernation API, so an idle room costs almost
 *   nothing; the room's state lives in each connection's attachment and is rebuilt from `ctx.getWebSockets()` after a wake-up.
 * - No timers or alarms (they keep a Durable Object awake). Clean-up happens when a socket closes.
 * - This Worker has NO public route (workers_dev = false, no routes). Only the Pages project can reach the object, through
 *   its binding, and the Pages Function (functions/casino/room/ws.ts) is the only place that sets the trusted `x-px-addr`
 *   header after checking the player's session cookie. Never add a route or workers.dev address to this Worker.
 * - Everything the room decides is in functions/lib/casino-room.ts and is unit tested; this file only moves data.
 * - The room never touches money. A seat here does not give a seat at a contract table.
 * - Talk: the room also passes on public chat and private messages between signed-in players. Nothing said is stored or
 *   replayed to later joiners; only reports are written down (newest REPORT_KEEP, and a `[casino-room] report` log line).
 * - Spins: a player at a machine sends each spin's reel stops; the room passes them to everyone else so their copy of that
 *   cabinet spins to the same result. Only the player seated at that cabinet may send one, spins have their own limit (they
 *   never count against the general one), and nothing about them is kept. The `room` message lists `features: ['play']` so a
 *   newer client only sends spins to a room that understands them.
 */
import { DurableObject } from 'cloudflare:workers';
import {
  MAX_SOCKETS,
  ROOM_FEATURES,
  applyLeave,
  applySit,
  applyStand,
  buildReport,
  deriveView,
  newPeer,
  overflowForAddress,
  parseClientMessage,
  routeDm,
  routePlay,
  routeSay,
  setBlocks,
  shortAddress,
  takeChatRate,
  takePlayRate,
  takeRate,
  upgradePeer,
  type Change,
  type Peer
} from '../../functions/lib/casino-room';

interface Env { [key: string]: unknown }

const NONCE_PREFIX = 'n:';
/** Reports people have made about each other (plan section 5.3). Only the newest REPORT_KEEP are kept. */
const REPORT_PREFIX = 'r:';
const REPORT_KEEP = 200;

export class CasinoRoom extends DurableObject<Env> {
  /** When this in-memory instance was created. After a hibernation the constructor runs again, so a changed value in a
   *  pong shows the room slept and woke (the P0 idle test uses this). Nothing depends on it. */
  private readonly up = Date.now();

  /** Every open connection with its peer record. Rebuilt from attachments, so it is correct after hibernation. */
  private peers(): Array<{ ws: WebSocket; peer: Peer }> {
    const list: Array<{ ws: WebSocket; peer: Peer }> = [];
    for (const ws of this.ctx.getWebSockets()) {
      const peer = ws.deserializeAttachment() as Peer | null;
      if (peer && typeof peer.id === 'string') list.push({ ws, peer: upgradePeer(peer) });
    }
    return list;
  }

  private save(entries: Array<{ ws: WebSocket; peer: Peer }>) {
    for (const { ws, peer } of entries) {
      try { ws.serializeAttachment(peer); } catch { /* a closing socket cannot take an attachment */ }
    }
  }

  private send(ws: WebSocket, message: unknown) {
    try { ws.send(JSON.stringify(message)); } catch { /* the socket is closing; its close handler cleans up */ }
  }

  private broadcast(entries: Array<{ ws: WebSocket }>, message: unknown) {
    const text = JSON.stringify(message);
    for (const { ws } of entries) {
      try { ws.send(text); } catch { /* ignore */ }
    }
  }

  private counts(entries: Array<{ peer: Peer }>) {
    const view = deriveView(entries.map((e) => e.peer));
    return { joined: view.joined, guests: view.guests };
  }

  private announce(entries: Array<{ ws: WebSocket; peer: Peer }>, changes: Change[]) {
    for (const change of changes) {
      if (change.kind === 'moved') {
        const target = entries.find((e) => e.peer.id === change.peerId);
        if (target) this.send(target.ws, { t: 'moved', spot: change.spot });
      } else if (change.kind === 'sat') {
        this.broadcast(entries, { t: 'sat', spot: change.spot, who: change.who });
      } else {
        this.broadcast(entries, { t: 'stood', spot: change.spot });
      }
    }
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // Used once by the Pages Function that exchanges a signature for a session: a sign-in request can be used one time.
    if (url.pathname === '/nonce' && request.method === 'POST') {
      let body: { n?: unknown; exp?: unknown };
      try { body = (await request.json()) as { n?: unknown; exp?: unknown }; } catch { return new Response('bad', { status: 400 }); }
      const nonce = typeof body.n === 'string' && /^[a-f0-9]{64}$/.test(body.n) ? body.n : null;
      const exp = typeof body.exp === 'number' && Number.isSafeInteger(body.exp) ? body.exp : null;
      if (!nonce || !exp) return new Response('bad', { status: 400 });
      const key = NONCE_PREFIX + nonce;
      if (await this.ctx.storage.get(key)) return Response.json({ ok: false }, { status: 409 });
      await this.ctx.storage.put(key, exp);
      // Forget nonces that can no longer be replayed (a challenge lasts two minutes).
      const now = Date.now();
      const old = await this.ctx.storage.list<number>({ prefix: NONCE_PREFIX, limit: 200 });
      const stale = [...old.entries()].filter(([, v]) => typeof v !== 'number' || v < now).map(([k]) => k);
      if (stale.length) await this.ctx.storage.delete(stale);
      return Response.json({ ok: true });
    }

    if (url.pathname.endsWith('/ws')) {
      if (request.headers.get('Upgrade') !== 'websocket') return new Response('Expected a WebSocket.', { status: 426 });
      const entries = this.peers();
      if (entries.length >= MAX_SOCKETS) return new Response('The room is full.', { status: 503 });

      const address = request.headers.get('x-px-addr') || null;
      const hash160 = request.headers.get('x-px-k') || null;
      const now = Date.now();
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);
      const peer = newPeer(crypto.randomUUID(), address, hash160, now);
      this.ctx.acceptWebSocket(server);
      server.serializeAttachment(peer);

      // No address may hold more than two connections: the oldest extras are closed and their seats freed.
      const fresh = this.peers();   // includes the connection just accepted
      const dropped = overflowForAddress(fresh.map((e) => e.peer), address);
      for (const extra of dropped) {
        const target = fresh.find((e) => e.peer.id === extra.id);
        if (!target) continue;
        const changes = applyStand(fresh.map((e) => e.peer), extra.id);
        this.save([target]);
        this.announce(fresh, changes);
        try { target.ws.close(4001, 'replaced'); } catch { /* already closing */ }
      }

      const live = fresh.filter((e) => !dropped.some((d) => d.id === e.peer.id));
      const view = deriveView(live.map((e) => e.peer));
      this.send(server, {
        t: 'room', v: 1, features: ROOM_FEATURES,
        you: { a: address, n: shortAddress(address), guest: !address, k: hash160 },
        spots: view.spots, players: view.players, joined: view.joined, guests: view.guests, at: now
      });
      const others = live.filter((e) => e.ws !== server);
      // A second tab of someone already here is not a new person.
      if (address && !others.some((e) => e.peer.a === address)) {
        this.broadcast(others, { t: 'join', who: { a: address, n: shortAddress(address) } });
      }
      this.broadcast(others, { t: 'count', joined: view.joined, guests: view.guests });
      return new Response(null, { status: 101, webSocket: client });
    }

    return new Response('Not found.', { status: 404 });
  }

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    const entries = this.peers();
    const mine = entries.find((e) => e.ws === ws);
    if (!mine) return;
    const now = Date.now();
    const parsed = parseClientMessage(message);
    // A spin has its own limit and never counts against the general one, so autoplay cannot slow a player's seat or chat.
    if (parsed.ok && parsed.msg.t === 'play') {
      if (!takePlayRate(mine.peer, now)) { this.save([mine]); this.send(ws, { t: 'err', code: 'play-too-fast' }); return; }
      this.save([mine]);
      const routed = routePlay(entries.map((e) => e.peer), mine.peer.id, parsed.msg, now);
      if (!routed.ok) { this.send(ws, { t: 'err', code: routed.code }); return; }
      const text = JSON.stringify(routed.message);
      for (const e of entries) {
        if (!routed.to.includes(e.peer.id)) continue;
        try { e.ws.send(text); } catch { /* closing; its close handler cleans up */ }
      }
      return;
    }
    if (!takeRate(mine.peer, now)) {
      this.save([mine]);
      this.send(ws, { t: 'err', code: 'slow-down' });
      return;
    }
    if (!parsed.ok) { this.save([mine]); this.send(ws, { t: 'err', code: parsed.code }); return; }

    const peers = entries.map((e) => e.peer);
    switch (parsed.msg.t) {
      case 'ping':
        this.save([mine]);
        this.send(ws, { t: 'pong', at: now, up: this.up });
        return;
      case 'hello': {
        this.save([mine]);
        const view = deriveView(peers);
        this.send(ws, { t: 'room', v: 1, features: ROOM_FEATURES, you: { a: mine.peer.a, n: shortAddress(mine.peer.a), guest: !mine.peer.a, k: mine.peer.k }, spots: view.spots, players: view.players, joined: view.joined, guests: view.guests, at: now });
        return;
      }
      case 'sit': {
        const result = applySit(peers, mine.peer.id, parsed.msg.spot, now);
        this.save(entries);
        if (!result.ok) { this.send(ws, { t: 'err', code: result.code }); return; }
        this.announce(entries, result.changes);
        return;
      }
      case 'stand': {
        const changes = applyStand(peers, mine.peer.id);
        this.save(entries);
        this.announce(entries, changes);
        return;
      }
      case 'say':
      case 'dm':
      case 'report': {
        // Guests only watch. Chat is also slower than the room's general limit: one message every 2 s, 20 a minute.
        if (!mine.peer.a) { this.save([mine]); this.send(ws, { t: 'err', code: 'sign-in-first' }); return; }
        if (!takeChatRate(mine.peer, now)) { this.save([mine]); this.send(ws, { t: 'err', code: 'slow-down' }); return; }
        this.save([mine]);
        if (parsed.msg.t === 'report') {
          const built = buildReport(peers, mine.peer.id, parsed.msg.who, parsed.msg.why, parsed.msg.lines, now);
          if (!built.ok) { this.send(ws, { t: 'err', code: built.code }); return; }
          await this.keepReport(built.report);
          this.send(ws, { t: 'reported', who: parsed.msg.who });
          return;
        }
        const routed = parsed.msg.t === 'say'
          ? routeSay(peers, mine.peer.id, parsed.msg.text, now)
          : routeDm(peers, mine.peer.id, parsed.msg.to, parsed.msg.text, now);
        if (!routed.ok) { this.send(ws, { t: 'err', code: routed.code }); return; }
        const text = JSON.stringify(routed.message);
        for (const e of entries) {
          if (!routed.to.includes(e.peer.id)) continue;
          try { e.ws.send(text); } catch { /* closing; its close handler cleans up */ }
        }
        return;
      }
      case 'blocks': {
        const list = setBlocks(peers, mine.peer.id, parsed.msg.list);
        this.save(entries);
        this.send(ws, list ? { t: 'blocks', list } : { t: 'err', code: 'sign-in-first' });
        return;
      }
    }
  }

  /** Stores a report and writes it to the Worker's log (`wrangler tail xtrata-casino-room`). There is no admin page yet. */
  private async keepReport(report: { at: number; by: string; who: string; why: string; lines: string[] }) {
    const key = REPORT_PREFIX + String(report.at).padStart(15, '0') + ':' + crypto.randomUUID().slice(0, 8);
    await this.ctx.storage.put(key, report);
    console.log('[casino-room] report', JSON.stringify(report));
    const all = await this.ctx.storage.list({ prefix: REPORT_PREFIX });
    const extra = [...all.keys()].slice(0, Math.max(0, all.size - REPORT_KEEP));
    if (extra.length) await this.ctx.storage.delete(extra);
  }

  private async gone(ws: WebSocket) {
    const entries = this.peers().filter((e) => e.ws !== ws);
    let peer: Peer | null = null;
    try { peer = ws.deserializeAttachment() as Peer | null; } catch { /* nothing to free */ }
    if (peer) {
      const changes = applyLeave([peer], peer.id);
      this.announce(entries, changes);
      if (peer.a && !entries.some((e) => e.peer.a === peer!.a)) this.broadcast(entries, { t: 'leave', a: peer.a });
    }
    this.broadcast(entries, { t: 'count', ...this.counts(entries) });
  }

  async webSocketClose(ws: WebSocket, code: number, reason: string) {
    try { ws.close(code, reason); } catch { /* already closed */ }
    await this.gone(ws);
  }

  async webSocketError(ws: WebSocket) {
    await this.gone(ws);
  }
}

export default {
  // No route reaches this Worker (workers_dev is off); this answer only matters if someone adds one by mistake.
  async fetch() { return new Response('Casino room service. No public route.', { status: 404 }); }
};
