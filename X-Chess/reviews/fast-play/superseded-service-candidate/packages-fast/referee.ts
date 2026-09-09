// Portable referee: all accepted state is committed with compare-and-swap.
// No receipt leaves this module until its exact archive has been durably stored.
import { MAX_ARCHIVE_BYTES, MAX_EVENTS, FAST_PROTOCOL, canonical, digest, exact, insist, integer, sign, verify, startState, verifyArchive, acceptIntent, endingFor, flagged, playerKey } from './protocol.js';
import type { Opening, Key, Archive, Signed, Ready, Start, Intent, Side, State } from './protocol.js';
export interface MatchRecord { revision: number; opening: Opening; ready: Partial<Record<Side, Signed<Ready>>>; startedMs: number | null; archive: Archive | null }
export interface Store {
  get(game: number): Promise<MatchRecord | null>;
  put(game: number, expectedRevision: number | null, row: MatchRecord): Promise<boolean>;
}
export interface RefereeOptions { store: Store; key: Key; loadOpening(game: number): Promise<Opening>; now?(): number }
export class Referee {
  private readonly now: () => number;
  constructor(private readonly options: RefereeOptions) { this.now = options.now ?? Date.now; }
  private async get(game: number): Promise<MatchRecord> {
    const existing = await this.options.store.get(game);
    if (existing) return existing;
    const opening = await this.options.loadOpening(game);
    insist(opening.referee === this.options.key.public, 'This game uses a different referee');
    const row: MatchRecord = { opening, revision: 0, ready: {}, startedMs: null, archive: null };
    await this.options.store.put(game, null, row);
    return (await this.options.store.get(game))!;
  }
  async transact(game: number, input?: Signed<Ready> | Signed<Intent>): Promise<MatchRecord> {
    insist(integer(game, 1, Number.MAX_SAFE_INTEGER), 'Invalid game number');
    for (let attempt = 0; attempt < 6; attempt++) {
      const row = await this.get(game);
      const next = structuredClone(row);
      let changed = false;
      if (next.archive) {
        const state = await verifyArchive(next.archive, next.opening);
        const elapsed = Math.max(state.at, this.now() - next.startedMs!);
        if (!next.archive.end && (state.result || flagged(state, elapsed) || state.seq >= MAX_EVENTS)) {
          next.archive.end = await sign(endingFor(state, elapsed), this.options.key.secret); changed = true;
        }
        if (input?.payload.type === 'action') {
          const action = input as Signed<Intent>;
          // Retried identical payloads return their original receipt, even after end.
          const prior = next.archive.events.find(e => e.intent.payload.seq === action.payload.seq);
          if (prior && digest(prior.intent.payload) === digest(input.payload)) {
            await verify(action, playerKey(next.opening, action.payload.side));
          } else if (!next.archive.end) {
            const receipt = await acceptIntent(state, input as Signed<Intent>, elapsed);
            next.archive.events.push({ intent: input as Signed<Intent>, receipt: await sign(receipt, this.options.key.secret) });
            state.root = digest(receipt); state.at = receipt.at; state.seq = receipt.seq;
            if (state.result || state.seq >= MAX_EVENTS) next.archive.end = await sign(endingFor(state, elapsed), this.options.key.secret);
            changed = true;
          } else if (!changed) throw Error('Game has ended');
        } else if (input && input.payload.type !== 'ready') throw Error('Invalid action');
      } else if (input) {
        insist(input.payload.type === 'ready', 'Both players must be ready first');
        const ready = input as Signed<Ready>;
        const side = ready.payload.side;
        insist(side === 'white' || side === 'black', 'Invalid player');
        exact(ready.payload, { type: 'ready', match: digest(next.opening), side }, 'Wrong readiness commitment');
        await verify(ready, playerKey(next.opening, side));
        if (!next.ready[side]) { next.ready[side] = ready; changed = true; }
        if (next.ready.white && next.ready.black) {
          const payload: Start = { type: 'start', match: digest(next.opening), ready: [next.ready.white, next.ready.black], at: 0 };
          const start = await sign(payload, this.options.key.secret);
          await startState(next.opening, start);
          next.startedMs = this.now();
          next.archive = { format: 'xchess-fast-archive-v1', opening: next.opening, start, events: [], end: null };
          changed = true;
        }
      }
      if (!changed) return row;
      insist(new TextEncoder().encode(canonical(next)).length <= MAX_ARCHIVE_BYTES, 'Game archive capacity reached');
      next.revision++;
      if (await this.options.store.put(game, row.revision, next)) return next;
      // Another request committed first. Re-read and check this intent against it.
    }
    throw Error('Game is busy; reconnect and retry');
  }
  async snapshot(game: number, input?: Signed<Ready> | Signed<Intent>): Promise<MatchRecord & { elapsedMs: number }> {
    const row = await this.transact(game, input);
    return { ...row, elapsedMs: row.startedMs === null ? 0 : Math.max(0, this.now() - row.startedMs) };
  }
}
export interface ServiceInfo { protocol: typeof FAST_PROTOCOL; referee: string; registry: string; network: Opening['network']; confirmations: number }
export function serviceHandler(referee: Referee, info: ServiceInfo) {
  return async (request: Request): Promise<Response> => {
    const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
    const reply = (value: unknown, status = 200) => new Response(JSON.stringify(value), { status, headers });
    try {
      if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
      const url = new URL(request.url);
      if (url.pathname === '/v1/info' && request.method === 'GET') return reply(info);
      const match = /^\/v1\/games\/([1-9][0-9]{0,14})$/.exec(url.pathname);
      if (!match) return reply({ error: 'Not found' }, 404);
      insist(request.method === 'GET' || request.method === 'POST', 'Unsupported method');
      let input: Signed<Ready> | Signed<Intent> | undefined;
      if (request.method === 'POST') {
        insist(request.headers.get('Content-Type')?.startsWith('application/json'), 'JSON required');
        const reader = request.body?.getReader(); insist(reader, 'Empty action');
        let text = '', length = 0; const decoder = new TextDecoder();
        try { for (;;) { const part = await reader.read(); if (part.done) break; length += part.value.length; insist(length <= 4096, 'Action too large'); text += decoder.decode(part.value, { stream: true }); } }
        finally { await reader.cancel(); }
        input = JSON.parse(text + decoder.decode());
        insist(input && input.payload && (input.payload.type === 'ready' || input.payload.type === 'action'), 'Invalid action');
      }
      const snapshot = await referee.snapshot(Number(match[1]), input);
      // Start-wall timestamp is internal; elapsed display is advisory, receipts are signed.
      const { startedMs: _, ...publicSnapshot } = snapshot;
      return reply(publicSnapshot);
    } catch (error) { return reply({ error: error instanceof Error ? error.message : 'Request failed' }, 409); }
  };
}
export type { State };
