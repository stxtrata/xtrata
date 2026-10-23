// Worst-case read costs of the read-only functions the hall calls (shared by the budget test and by
// `node tests/world2-costs.mjs`, which prints the table). Builds the heaviest rows the contract accepts:
// 24-char names, 512-char params, 4 bindings to 40-char contract names, a 64-char door path, 8 live states of
// 256-char patches, 20 kinds with the longest names, a 6-deep chain of 24-char slugs, a full page of children.
import { standardWorld, U, S, Cl, idOf, pp, POL, bindingsArg } from './world2-helpers.mjs';

export const BUDGET = { reads: 24, readLength: 90000 };

export async function measure() {
  const w = await standardWorld({ costs: true });
  const { deployer: D, simnet, ids } = w;
  const must = (r, what) => { if (r.result.type !== 'ok') throw new Error(`${what}: ${pp(r.result)}`); return r; };
  const long = `${D}.${'a'.repeat(40)}`;
  // a 6-deep chain of 24-character slugs under the root, each a live room with a full title
  const slug = (d) => `d${d}`.padEnd(24, 'x');
  let parent = 1; const chain = [];
  for (let d = 1; d <= 6; d++) {
    const id = idOf(must(w.space(D, { parent, slug: slug(d), title: 'T'.repeat(48), policy: POL({ depth: 6 - d, desc: 1000 - d, objects: 128 }) }), 'chain ' + d));
    must(w.setState(D, id, 1), 'live ' + d); chain.push(id); parent = id;
  }
  const leaf = chain[5];
  // a room full of the heaviest objects: 16 of them (two pages of 8, one page of 16 ids)
  const room = ids.hall;
  const objs = [];
  for (let i = 0; i < 16; i++) {
    const id = idOf(must(w.object(D, room, w.kinds.door, { name: 'n'.repeat(24), params: 'x'.repeat(512) }), 'obj'));
    must(w.call('set-bindings', [U(id), bindingsArg([['r'.repeat(16), long, 1], ['r'.repeat(16), long, 2], ['r'.repeat(16), long, 3], ['r'.repeat(16), long, 1]])]), 'bind');
    must(w.call('set-portal', [U(id), Cl.some(Cl.tuple({ 'to-space': U(0), arrival: U(0), path: S('/' + 'p'.repeat(63)) }))]), 'portal');
    objs.push(id);
  }
  // 8 live states of 256 characters on the first object
  for (let k = 0; k < 8; k++) must(w.addState(D, objs[0], { from: w.h() + 1 + k, patch: 'p'.repeat(256) }), 'state');
  simnet.mineEmptyBurnBlocks(4);
  // 20 kinds with the longest names (4 exist already)
  for (let k = 4; k < 20; k++) must(w.kind(D, { category: 3, name: 'K'.repeat(32), builtin: 'b'.repeat(24) }), 'kind');
  // a full page of children (16) with the longest slugs and titles under one domain
  const dom = idOf(must(w.space(D, { parent: 1, slug: 'dom', kind: 0, policy: POL({ children: 64, depth: 3 }) }), 'dom'));
  for (let c = 0; c < 16; c++) must(w.space(D, { parent: dom, slug: `c${c}`.padEnd(24, 'y'), title: 'T'.repeat(48), policy: POL({ depth: 2 }) }), 'child');
  // moderation recorded on the room (the read is the same size either way)
  must(w.call('set-space-paused', [U(room), Cl.bool(true)]), 'pause');

  const ro = (fn, args) => simnet.callReadOnlyFn('xtrata-world-v2', fn, args, D);
  const rows = {};
  const take = (label, fn, args) => {
    const r = ro(fn, args);
    rows[label] = { fn, reads: Number(r.costs.total.readCount), readLength: Number(r.costs.total.readLength), runtime: Number(r.costs.total.runtime) };
    return r;
  };
  take('get-version', 'get-version', []);
  take('resolve-path (6 slugs)', 'resolve-path', [Cl.list(chain.map((_, i) => S(slug(i + 1))))]);
  take('get-space (room)', 'get-space', [U(room)]);
  take('get-space (deep leaf)', 'get-space', [U(leaf)]);
  take('get-object-ids (16)', 'get-object-ids', [U(room), U(0)]);
  take('get-objects-8 (page 0)', 'get-objects-8', [U(room), U(0)]);
  take('get-objects-8 (page 1)', 'get-objects-8', [U(room), U(1)]);
  take('get-kinds (20)', 'get-kinds', [Cl.list(Array.from({ length: 20 }, (_, i) => U(i)))]);
  take('get-object-view (8 states)', 'get-object-view', [U(objs[0])]);
  take('get-timeline (8)', 'get-timeline', [U(objs[0])]);
  take('get-child-ids (16)', 'get-child-ids', [U(dom), U(0)]);
  take('get-children-8', 'get-children-8', [U(dom), U(0)]);
  take('get-moderation', 'get-moderation', [U(room)]);
  // compatibility reads: a full page is over budget (the hall must not use them)
  const compat = {};
  for (const [label, fn, args] of [['get-objects (16)', 'get-objects', [U(room), U(0)]], ['get-children (16)', 'get-children', [U(dom), U(0)]]]) {
    const r = ro(fn, args);
    compat[label] = { fn, reads: Number(r.costs.total.readCount), readLength: Number(r.costs.total.readLength) };
  }
  return { rows, compat, limit: ro('get-version', []).costs.limit, w, objs, room, dom };
}

if (process.argv[1] && process.argv[1].endsWith('world2-costs.mjs')) {
  const { rows, compat, limit } = await measure();
  console.log('budget: reads <= %d, read_length <= %d (simnet limit: %j)', BUDGET.reads, BUDGET.readLength, limit);
  for (const [k, v] of Object.entries(rows)) console.log(`${k.padEnd(30)} reads ${String(v.reads).padStart(3)}  read_length ${String(v.readLength).padStart(6)}  runtime ${v.runtime}`);
  console.log('compatibility (not for the hall):');
  for (const [k, v] of Object.entries(compat)) console.log(`${k.padEnd(30)} reads ${String(v.reads).padStart(3)}  read_length ${String(v.readLength).padStart(6)}`);
}
