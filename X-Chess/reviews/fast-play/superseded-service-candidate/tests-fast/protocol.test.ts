import { describe, it, expect } from 'vitest';
import { webcrypto } from 'node:crypto';
import { Position } from '../../packages/chess/engine.js';
import { generateKey, FAST_PROTOCOL, FAST_RULES, digest, sign, verifyArchive, intentFor, parseArchive, canonical, flagResult, endingFor } from '../../packages/fast/protocol.js';
import type { Opening, Side, Ready, Intent } from '../../packages/fast/protocol.js';
import { Referee, serviceHandler } from '../../packages/fast/referee.js';
import type { Store, MatchRecord } from '../../packages/fast/referee.js';
if (!globalThis.crypto?.subtle) Object.defineProperty(globalThis, 'crypto', { value: webcrypto });
const WHITE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const BLACK = 'SP000000000000000000002Q6VF78';
export class MemoryStore implements Store {
  rows = new Map<number, MatchRecord>(); fail = false;
  async get(id: number) { return structuredClone(this.rows.get(id) ?? null); }
  async put(id: number, version: number | null, row: MatchRecord) {
    if (this.fail) throw Error('disk failed');
    if ((this.rows.get(id)?.revision ?? null) !== version) return false;
    this.rows.set(id, structuredClone(row)); return true;
  }
}
export async function setup(baseMs = 60000, incrementMs = 2000) {
  const keys = { white: await generateKey(), black: await generateKey(), referee: await generateKey() };
  const opening: Opening = { protocol: FAST_PROTOCOL, rules: FAST_RULES, network: 'mainnet', registry: WHITE + '.xchess-fast-v1', game: 1,
    white: WHITE, black: BLACK, whiteKey: keys.white.public, blackKey: keys.black.public, referee: keys.referee.public, baseMs, incrementMs, joinedHeight: 99 };
  const store = new MemoryStore(); let now = 100000;
  const ref = new Referee({ store, key: keys.referee, loadOpening: async () => opening, now: () => now });
  const ready = async (side: Side) => ref.transact(1, await sign<Ready>({type:'ready', match:digest(opening), side}, keys[side].secret));
  const started = async () => { await ready('white'); return ready('black'); };
  const action = async (side: Side, kind: Intent['kind'], move = '', ms = 1000) => {
    const row = await ref.transact(1); const state = await verifyArchive(row.archive!); now += ms;
    return ref.transact(1, await sign(intentFor(state, side, kind, move), keys[side].secret));
  };
  return { keys, opening, store, ref, ready, started, action, time: (ms: number) => { now += ms; } };
}
describe('Fast Play signed protocol and persistent referee', () => {
  it('starts only after both registered players are ready', async () => {
    const g = await setup(); expect((await g.ready('white')).archive).toBeNull(); g.time(900000);
    const row = await g.ready('black'); expect(row.archive!.events).toHaveLength(0); expect((await verifyArchive(row.archive!)).whiteMs).toBe(60000);
  });
  it('records mate without a losing-player final signature', async () => {
    const g = await setup(); await g.started();
    await g.action('white','move','f2f3'); await g.action('black','move','e7e5'); await g.action('white','move','g2g4');
    const row = await g.action('black','move','d8h4');
    expect(row.archive!.end!.payload.result).toBe('0-1');
    expect(row.archive!.end!.payload.reason).toBe('checkmate');
    await expect(verifyArchive(JSON.parse(canonical(row.archive!)), g.opening)).resolves.toBeTruthy();
  });
  it('rejects a forged opponent signature', async () => {
    const g = await setup(); const row = await g.started(); const state = await verifyArchive(row.archive!);
    await expect(g.ref.transact(1, await sign(intentFor(state, 'white','move','e2e4'), g.keys.black.secret))).rejects.toThrow('Signature');
    expect((await g.store.get(1))!.archive!.events).toHaveLength(0);
  });
  it('rejects illegal moves and moves out of turn without changing the record', async () => {
    const g = await setup(); const before = await g.started();
    await expect(g.action('white','move','e2e5')).rejects.toThrow('Illegal');
    await expect(g.action('black','move','e7e5')).rejects.toThrow('turn');
    expect((await g.store.get(1))!.revision).toBe(before.revision);
  });
  it('prevents duplicate moves from adding increment twice', async () => {
    const g = await setup(); await g.started(); const row = await g.action('white','move','e2e4');
    const again = await g.ref.transact(1, row.archive!.events[0].intent);
    expect(again.revision).toBe(row.revision); expect((await verifyArchive(again.archive!)).whiteMs).toBe(61000);
  });
  it('serializes conflicting concurrent moves with compare-and-swap', async () => {
    const g = await setup(); const row = await g.started(), state = await verifyArchive(row.archive!);
    const a = await sign(intentFor(state,'white','move','e2e4'), g.keys.white.secret);
    const b = await sign(intentFor(state,'white','move','d2d4'), g.keys.white.secret);
    const results = await Promise.allSettled([g.ref.transact(1,a),g.ref.transact(1,b)]);
    expect(results.filter(r=>r.status==='fulfilled')).toHaveLength(1);
    expect((await g.store.get(1))!.archive!.events).toHaveLength(1);
  });
  it('does not publish a receipt when storage fails', async () => {
    const g = await setup(); const row = await g.started(); g.store.fail = true;
    await expect(g.action('white','move','e2e4')).rejects.toThrow('disk failed');
    expect(await g.store.get(1)).toEqual(row);
  });
  it('recovers the exact accepted history through a new referee instance', async () => {
    const g = await setup(); await g.started(); const row = await g.action('white','move','e2e4');
    const ref = new Referee({store:g.store,key:g.keys.referee,loadOpening:async()=>g.opening,now:()=>101000});
    expect(await ref.transact(1)).toEqual(row);
  });
  it('records an absent player timeout and rejects later moves', async () => {
    const g = await setup(60000,0); await g.started(); g.time(60000);
    const row = await g.ref.transact(1); expect(row.archive!.end!.payload).toMatchObject({result:'0-1',reason:'timeout'});
    await expect(g.action('white','move','e2e4',0)).rejects.toThrow('ended');
  });
  it('accepts just before deadline but not at deadline', async () => {
    const g = await setup(60000,0); await g.started();
    expect((await g.action('white','move','e2e4',59999)).archive!.events).toHaveLength(1);
    const h = await setup(60000,0); await h.started();
    expect((await h.action('white','move','e2e4',60000)).archive!.end!.payload.reason).toBe('timeout');
    expect((await h.store.get(1))!.archive!.events).toHaveLength(0);
  });
  it('supports untimed games without inventing abandonment wins', async () => {
    const g = await setup(0,0); await g.started(); g.time(999999999);
    expect((await g.ref.transact(1)).archive!.end).toBeNull();
  });
  it('authenticates resignations from either side', async () => {
    const g = await setup(); await g.started();
    const row = await g.action('black','resign'); expect(row.archive!.end!.payload).toMatchObject({result:'1-0',reason:'resignation'});
    await expect(verifyArchive(row.archive!)).resolves.toBeTruthy();
  });
  it('requires opponent acceptance for an agreed draw', async () => {
    const g = await setup(); await g.started();
    await expect(g.action('black','accept-draw')).rejects.toThrow('No opponent');
    await g.action('white','offer-draw');
    await expect(g.action('white','accept-draw')).rejects.toThrow('No opponent');
    const row = await g.action('black','accept-draw'); expect(row.archive!.end!.payload.result).toBe('1/2-1/2');
  });
  it('a move clears a pending draw offer and does not add increments for offers', async () => {
    const g = await setup(); await g.started(); const offer = await g.action('white','offer-draw');
    expect((await verifyArchive(offer.archive!)).whiteMs).toBe(59000);
    const row = await g.action('white','move','e2e4'); const state = await verifyArchive(row.archive!);
    expect(state.offer).toBeNull(); expect(state.whiteMs).toBe(60000);
  });
  it('rejects changed histories, endings and chain openings', async () => {
    const g = await setup(); await g.started(); const row = await g.action('white','resign');
    const a = structuredClone(row.archive!); a.events[0].intent.payload.side = 'black';
    await expect(verifyArchive(a)).rejects.toThrow();
    const b = structuredClone(row.archive!); b.end!.payload.result = '1-0';
    await expect(verifyArchive(b)).rejects.toThrow();
    await expect(verifyArchive(row.archive!,{...g.opening,game:2})).rejects.toThrow('registry');
  });
  it('rejects new network or clock settings even if an archive is otherwise valid', async () => {
    const g = await setup(); const row = await g.started();
    for (const replacement of [{network:'testnet'}, {baseMs:90000}, {whiteKey:g.keys.black.public}]) {
      const a = structuredClone(row.archive!); Object.assign(a.opening,replacement); await expect(verifyArchive(a)).rejects.toThrow();
    }
  });
  it('rejects replay, missing receipt and unknown action types', async () => {
    const g = await setup(); await g.started(); const row = await g.action('white','move','e2e4');
    const a = structuredClone(row.archive!); a.events.push(a.events[0]); await expect(verifyArchive(a)).rejects.toThrow();
    const b = structuredClone(row.archive!); (b.events[0].intent.payload as any).kind = 'win'; await expect(verifyArchive(b)).rejects.toThrow();
  });
  it('referee cannot manufacture checkmate or a premature flag', async () => {
    const g = await setup(); const row = await g.started(); const state = await verifyArchive(row.archive!);
    const a = structuredClone(row.archive!);
    a.end = await sign({...endingFor(state,60000),reason:'checkmate',result:'1-0'},g.keys.referee.secret);
    await expect(verifyArchive(a)).rejects.toThrow();
    a.end = await sign({...endingFor(state,60000),at:59999},g.keys.referee.secret);
    await expect(verifyArchive(a)).rejects.toThrow();
  });
  it('bare-king timeout is a draw under the explicitly versioned clock rule', async () => {
    const g = await setup(); const row = await g.started(); const state = await verifyArchive(row.archive!);
    state.position = new Position('7k/8/8/8/8/8/P7/K7 w - - 0 1');
    expect(flagResult(state)).toBe('1/2-1/2');
    state.position = new Position('6rk/8/8/8/8/8/P7/K7 w - - 0 1'); expect(flagResult(state)).toBe('0-1');
  });
  it('rejects huge or deeply nested imports', () => {
    expect(()=>parseArchive(' '.repeat(2000001))).toThrow('large'); expect(()=>parseArchive('['.repeat(21)+'0'+']'.repeat(21))).toThrow('deep');
  });
  it('HTTP validates input bounds and serves public-only signed records', async () => {
    const g = await setup(); const handler = serviceHandler(g.ref,{protocol:FAST_PROTOCOL,referee:g.keys.referee.public,registry:g.opening.registry,network:'mainnet',confirmations:2});
    const info = await handler(new Request('https://clock.test/v1/info')); expect(info.status).toBe(200);
    expect(info.headers.get('Access-Control-Allow-Origin')).toBe('*');
    await g.started();
    const snapshot = await (await handler(new Request('https://clock.test/v1/games/1'))).json(); expect(snapshot.startedMs).toBeUndefined();
    const invalid = await handler(new Request('https://clock.test/v1/games/1',{method:'POST',headers:{'Content-Type':'application/json'},body:' '.repeat(5000)})); expect(invalid.status).toBe(409);
    expect(JSON.stringify(snapshot)).not.toContain('secret');
  });
});
