// @vitest-environment node
// The incremental chain reader shared by the Bounty Ticket Ledger and the public tracker page
// (public/bounty/zdao/tracker/1/ledger-reader.js), run against a mock chain.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
// @ts-expect-error plain JS, no types
import { bake, slimState } from '../../../scripts/bounty-tracker-bake.mjs';

// The reader is a browser script: load it the way a page does and take what it publishes.
const scope: any = {};
new Function('window', readFileSync('public/bounty/zdao/tracker/1/ledger-reader.js', 'utf8').replace(/\}\)\(typeof window[^\n]*$/m, '})(window);'))(scope);
const L = scope.XtrataLedger;
const DEP = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const C = (n: string) => DEP + '.' + n;
const D = Date.parse('2026-10-05T00:00:00Z') / 1000;

function world() {
  let seq = 0, reqs = 0;
  const chain: Record<string, any[]> = {};
  const add = (id: string, fn: string, addr: string, off: number, extra: any = {}) => {
    (chain[id] = chain[id] || []).unshift({ tx_id: '0x' + (++seq).toString(16).padStart(4, '0'), tx_status: 'success', tx_type: 'contract_call',
      burn_block_time: D + off, sender_address: addr, contract_call: { contract_id: id, function_name: fn, function_args: [] }, ...extra });
  };
  const get = async (u: string) => {
    reqs++;
    const m = u.match(/address\/([^/]+)\/transactions\?limit=(\d+)&offset=(\d+)/)!;
    if (!(m[1] in chain) && /v1-2|xtrata-market|chess|v1-3/.test(m[1])) throw new Error(u + ' -> 404');
    const all = chain[m[1]] || [];
    return { total: all.length, results: all.slice(+m[3], +m[3] + +m[2]) };
  };
  return { chain, add, get, reqs: () => reqs, reset: () => { reqs = 0; } };
}
function seeded() {
  const w = world();
  for (let i = 0; i < 120; i++) w.add(C('xtrata-radio-plays-v1-0'), 'play', 'SPMUSIC', i);
  w.add(C('xtrata-v3-2-3'), 'seal-inscription', 'SPA', 10);
  w.add(C('xtrata-v3-2-3'), 'seal-inscription', 'SPA', 20);
  w.add(C('xtrata-arcade-scores-v2'), 'submit-score', 'SPA', 30);
  w.add(C('xtrata-arcade-scores-v2'), 'submit-score', 'SPB', 40);
  w.add(C('xtrata-arcade-scores-v2'), 'submit-score', 'SPB', 50, { tx_status: 'abort_by_post_condition' });
  const likes = C('xtrata-radio-likes-v1-0');
  w.add(likes, 'set-liked', 'SPA', 60, { contract_call: { contract_id: likes, function_name: 'set-liked', function_args: [{ repr: 'u1' }, { repr: 'true' }] } });
  w.add(likes, 'set-liked', 'SPB', 61, { contract_call: { contract_id: likes, function_name: 'set-liked', function_args: [{ repr: 'u1' }, { repr: 'false' }] } });
  return w;
}
const cfg = { api: 'x' };
const norm = (r: any) => JSON.stringify(r.addresses.map((x: any) => [x.addr, x.n, x.w]).sort());

describe('incremental ledger reader', () => {
  it('reads everything on a first run, ignoring failed transactions and unlikes', async () => {
    const w = seeded();
    const a = await L.run(cfg, w.get, null);
    expect(a.mode).toBe('full');
    expect(a.failed).toBe(false);
    const by = Object.fromEntries(a.addresses.map((x: any) => [x.addr, x.n]));
    expect(by.SPA).toEqual({ ins: 2, inp: 2, inu: 2, sc: 1, lk: 1 });   // no begin visible: 1 ticket each, flagged
    expect(by.SPB).toEqual({ sc: 1 });
    expect(by.SPMUSIC).toEqual({ mu: 120 });
  });

  it('only adds what is new and matches a from-scratch read', async () => {
    const w = seeded();
    const a = await L.run(cfg, w.get, null);
    w.reset(); await L.run(cfg, w.get, null); const fullReqs = w.reqs();
    w.add(C('xtrata-arcade-scores-v2'), 'submit-score', 'SPB', 300);
    w.add(C('xtrata-arcade-scores-v2'), 'submit-score', 'SPC', 310);
    w.add(C('xtrata-radio-plays-v1-0'), 'play', 'SPMUSIC', 320);
    w.add(C('xtrata-v3-2-3'), 'seal-inscription', 'SPC', 330);
    w.reset();
    const b = await L.run(cfg, w.get, a.state);
    const incReqs = w.reqs();
    expect(b.mode).toBe('incremental');
    expect(b.changed.sort()).toEqual(['SPB', 'SPC', 'SPMUSIC']);
    expect(incReqs).toBeLessThan(fullReqs);
    const f = await L.run(cfg, w.get, null);
    expect(norm(b)).toBe(norm(f));
  });

  it('does almost no work when nothing changed', async () => {
    const w = seeded();
    const a = await L.run(cfg, w.get, null);
    w.reset();
    const c = await L.run(cfg, w.get, a.state);
    expect(c.changed).toEqual([]);
    expect(w.reqs()).toBeLessThanOrEqual(23); // one page per contract
  });

  it('falls back to a full read when a remembered transaction has vanished (reorg)', async () => {
    const w = seeded();
    const a = await L.run(cfg, w.get, null);
    w.add(C('xtrata-radio-plays-v1-0'), 'play', 'SPMUSIC', 400);
    const st = JSON.parse(JSON.stringify(a.state));
    st.heads[C('xtrata-radio-plays-v1-0')] = ['0xdead'];
    const d = await L.run(cfg, w.get, st);
    expect(d.mode).toBe('full');
    expect(norm(d)).toBe(norm(await L.run(cfg, w.get, null)));
  });

  it('rebuilds from scratch when the saved state is too old, or for another cutoff', async () => {
    const w = seeded();
    const a = await L.run(cfg, w.get, null);
    const old = JSON.parse(JSON.stringify(a.state)); old.full = '2020-01-01T00:00:00Z';
    expect((await L.run(cfg, w.get, old)).mode).toBe('full');
    expect((await L.run({ ...cfg, cutoff: '2026-10-02T00:00:00Z' }, w.get, a.state)).mode).toBe('full');
    expect((await L.run({ ...cfg, draws: ['2026-10-07T22:59:59Z'] }, w.get, a.state)).mode).toBe('full'); // per-draw counts would be stale
  });

  it('keeps the old state when a source fails, and never loses counts', async () => {
    const w = seeded();
    const a = await L.run(cfg, w.get, null);
    const flaky = async (u: string) => { if (u.includes('xtrata-radio-plays-v1-0')) throw new Error('boom'); return w.get(u); };
    w.add(C('xtrata-v3-2-3'), 'seal-inscription', 'SPD', 500);
    const b = await L.run(cfg, flaky, a.state);
    expect(b.failed).toBe(true);
    expect(b.state).toBe(a.state);
    expect(b.addresses.find((x: any) => x.addr === 'SPMUSIC').n.mu).toBe(120);
    expect(b.addresses.find((x: any) => x.addr === 'SPD').n.ins).toBe(1);
  });

  it('works with the slimmed state the page bakes in (per-draw counts and draw list kept)', async () => {
    const w = seeded();
    const pageCfg = { api: 'x', draws: ['2026-10-07T22:59:59Z', '2026-10-14T22:59:59Z', '2026-10-21T22:59:59Z'] };
    const a = await L.run(pageCfg, w.get, null);
    const slim = slimState(a.state);
    expect(slim.draws).toEqual(pageCfg.draws);
    w.add(C('xtrata-arcade-scores-v2'), 'submit-score', 'SPA', 600);
    w.reset();
    const b = await L.run(pageCfg, w.get, slim);
    expect(b.mode).toBe('incremental');
    expect(b.addresses.find((x: any) => x.addr === 'SPA').n.sc).toBe(2);
  });
});

describe('tracker page snapshot', () => {
  it('bakes a state into the page and keeps a valid script', () => {
    const html = readFileSync('public/bounty/zdao/tracker/1/index.html', 'utf8');
    expect(html).toMatch(/^ {2}var SNAP = .*\/\*SNAP\*\/$/m);
    const state = { v: 2, cutoff: 'c', at: '2026-10-06T00:00:00Z', full: '2026-10-06T00:00:00Z', heads: { a: ['0x1'] }, top: { a: 1 }, calls: { a: 1 },
      addrs: { SPX: { addr: 'SPX', first: 1, last: 2, n: { ins: 1 }, w: [[1]], tx: { ins: '0x1' }, g: {} } } };
    const next = bake(html, state);
    const line = next.split('\n').find((l: string) => l.endsWith('/*SNAP*/'))!;
    const snap = JSON.parse(line.replace(/^ {2}var SNAP = /, '').replace(/; \/\*SNAP\*\/$/, ''));
    expect(snap.addrs.SPX).toEqual({ addr: 'SPX', first: 1, last: 2, n: { ins: 1 }, w: [[1]], tx: {}, g: {} });
    expect(() => bake(html, { v: 1 })).toThrow();
    expect(bake(next, state)).toBe(next); // baking is repeatable
  });
  it('ships a baked state that matches its own totals', () => {
    const html = readFileSync('public/bounty/zdao/tracker/1/index.html', 'utf8');
    const line = html.split('\n').find((l) => l.endsWith('/*SNAP*/'))!;
    const snap = JSON.parse(line.replace(/^ {2}var SNAP = /, '').replace(/; \/\*SNAP\*\/$/, ''));
    expect(snap.v).toBe(2);
    const events = Object.values<any>(snap.addrs).reduce((t, a) => t + Object.entries<number>(a.n).reduce((x, [k, v]) => x + (k === 'ch' || k === 'inp' || k === 'inu' ? 0 : v), 0), 0);   // inp/inu are ticket points and a flag, not events
    const calls = Object.values<number>(snap.calls).reduce((x, y) => x + y, 0);
    expect(events).toBe(calls);
  });
});

describe('size-weighted inscription tickets', () => {
  const MB = 1048576;
  const H = (n: number) => '0x' + n.toString(16).padStart(64, '0');
  const arg = (name: string, repr: string) => ({ name, repr });
  const begin = (w: ReturnType<typeof world>, who: string, hash: string, size: number, off: number) =>
    w.add(C('xtrata-v3-2-3'), 'begin-or-get', who, off, { contract_call: { contract_id: C('xtrata-v3-2-3'), function_name: 'begin-or-get', function_args: [arg('expected-hash', hash), arg('mime', '"audio/mpeg"'), arg('total-size', 'u' + size), arg('total-chunks', 'u1')] } });
  const seal = (w: ReturnType<typeof world>, who: string, hash: string, off: number) =>
    w.add(C('xtrata-v3-2-3'), 'seal-inscription', who, off, { contract_call: { contract_id: C('xtrata-v3-2-3'), function_name: 'seal-inscription', function_args: [arg('expected-hash', hash), arg('token-uri-string', '"x"')] } });
  const single = (w: ReturnType<typeof world>, who: string, size: number, off: number) =>
    w.add(C('xtrata-v3-2-3'), 'mint-single-tx', who, off, { contract_call: { contract_id: C('xtrata-v3-2-3'), function_name: 'mint-single-tx', function_args: [arg('expected-hash', H(off)), arg('mime', '"image/png"'), arg('total-size', 'u' + size), arg('chunks', '(list)'), arg('token-uri-string', '"x"')] } });
  const run = async (w: ReturnType<typeof world>, prev: any = null) => L.run({ api: 'x', cutoff: '2026-10-01T00:00:00Z', draws: [] }, w.get, prev);
  const ofAddr = (out: any, a: string) => out.addresses.find((x: any) => x.addr === a);

  it('maps file size to 1-5 tickets with the boundaries on the exact megabyte', () => {
    const f = scope.XtrataLedger.sizePoints;
    expect([0, 1, MB - 1, MB, MB + 1, 2 * MB, 2 * MB + 1, 3 * MB, 3 * MB + 1, 4 * MB, 4 * MB + 1, 5 * MB, 50 * MB].map(f)).toEqual([1, 1, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 5]);
  });

  it('scores a begin then seal by the size declared at begin, and a single-tx mint by its own size', async () => {
    const w = world();
    begin(w, 'SPA', H(1), Math.round(3.4 * MB), 10); seal(w, 'SPA', H(1), 11);
    single(w, 'SPA', 600 * 1024, 20);
    single(w, 'SPB', 9 * MB, 21);
    const out = await run(w);
    expect(ofAddr(out, 'SPA').n).toMatchObject({ ins: 2, inp: 4 + 1 });
    expect(ofAddr(out, 'SPB').n).toMatchObject({ ins: 1, inp: 5 });
    expect(ofAddr(out, 'SPA').n.inu).toBeUndefined();
  });

  it('counts every item in a batch seal on its own size', async () => {
    const w = world();
    begin(w, 'SPA', H(1), 2 * MB, 10); begin(w, 'SPA', H(2), 100, 11);
    w.add(C('xtrata-v3-2-3'), 'seal-inscription-batch', 'SPA', 12, { contract_call: { contract_id: C('xtrata-v3-2-3'), function_name: 'seal-inscription-batch', function_args: [arg('items', `(list (tuple (hash ${H(1)}) (token-uri-string "a")) (tuple (hash ${H(2)}) (token-uri-string "b")))`)] } });
    const n = ofAddr(await run(w), 'SPA').n;
    expect(n).toMatchObject({ ins: 2, inp: 2 + 1 });
  });

  it('remembers sizes between runs, so a seal in a later run still finds its begin', async () => {
    const w = world();
    begin(w, 'SPA', H(1), 4.5 * MB, 10);
    const first = await run(w);
    seal(w, 'SPA', H(1), 30);
    const second = await run(w, first.state);
    expect(ofAddr(second, 'SPA').n).toMatchObject({ ins: 1, inp: 5 });
    const scratch = await run(w);
    expect(ofAddr(scratch, 'SPA').n).toEqual(ofAddr(second, 'SPA').n);
  });

  it('gives a seal with no visible begin 1 ticket and flags it', async () => {
    const w = world();
    seal(w, 'SPA', H(9), 10);
    expect(ofAddr(await run(w), 'SPA').n).toMatchObject({ ins: 1, inp: 1, inu: 1 });
  });
});
