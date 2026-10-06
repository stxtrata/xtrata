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
    expect(by.SPA).toEqual({ ins: 2, sc: 1, lk: 1 });
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

  it('works with the slimmed state the page bakes in (no per-draw counts)', async () => {
    const w = seeded();
    const pageCfg = { api: 'x', draws: [] };
    const a = await L.run(pageCfg, w.get, null);
    const slim = slimState(a.state);
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
    expect(snap.addrs.SPX).toEqual({ addr: 'SPX', first: 1, last: 2, n: { ins: 1 }, w: [], tx: {}, g: {} });
    expect(() => bake(html, { v: 1 })).toThrow();
    expect(bake(next, state)).toBe(next); // baking is repeatable
  });
  it('ships a baked state that matches its own totals', () => {
    const html = readFileSync('public/bounty/zdao/tracker/1/index.html', 'utf8');
    const line = html.split('\n').find((l) => l.endsWith('/*SNAP*/'))!;
    const snap = JSON.parse(line.replace(/^ {2}var SNAP = /, '').replace(/; \/\*SNAP\*\/$/, ''));
    expect(snap.v).toBe(2);
    const events = Object.values<any>(snap.addrs).reduce((t, a) => t + Object.entries<number>(a.n).reduce((x, [k, v]) => x + (k === 'ch' ? 0 : v), 0), 0);
    const calls = Object.values<number>(snap.calls).reduce((x, y) => x + y, 0);
    expect(events).toBe(calls);
  });
});
