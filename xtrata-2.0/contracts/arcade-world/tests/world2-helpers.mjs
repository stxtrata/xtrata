// Shared helpers for the xtrata-world-v2 tests. Every test boots its own simnet so
// tests never depend on each other's state.
import { Cl } from '@stacks/transactions';
import { boot, pp as ppCv, hash32, mockInscription } from './helpers.mjs';
export const pp = (v) => (typeof v === 'string' ? v : ppCv(v));

export const S = (s) => Cl.stringAscii(s);
export const U = (n) => Cl.uint(n);
export const P = (a) => Cl.principal(a);
export const ok = (n) => `(ok u${n})`;
export const err = (n) => `(err u${n})`;
export const OK = '(ok true)';

// capability bits
export const CAP = { STATE: 1, OBJECT: 2, KIND: 4, LINK: 8, ENTRY: 16, CHILD: 32, GRANT: 64, MOD: 128, PAUSE: 256 };
// admin caps
export const ADM = { PAUSE: 1, KINDS: 2, TRUST: 4, MOD: 8 };

export const POL = (o = {}) => Cl.tuple({
  'max-children': U(o.children ?? 64), 'max-descendants': U(o.desc ?? 1000), 'max-objects': U(o.objects ?? 128),
  'max-depth': U(o.depth ?? 6), runtimes: U(o.runtimes ?? 15), tiers: U(o.tiers ?? 15),
  interfaces: U(o.interfaces ?? 15), 'approved-only': Cl.bool(o.approved ?? false),
  'portals-in': U(o.pin ?? 0), 'portals-out': U(o.pout ?? 0), review: Cl.bool(o.review ?? false),
  'create-fee': U(o.fee ?? 0),
});

// What a user plot looks like: composed rooms only, data kinds, consent doors, approved bindings.
export const PLOT = (o = {}) => POL({
  children: 8, desc: 20, objects: 48, depth: 2, runtimes: 2, tiers: 3, interfaces: 3,
  approved: true, pin: 1, pout: 2, ...o,
});

export const TF = (x = 0, y = 0, z = 0, yaw = 0, scale = 100) =>
  Cl.tuple({ x: Cl.int(x), y: Cl.int(y), z: Cl.int(z), yaw: U(yaw), scale: U(scale) });

export const addr = (cv) => pp(cv).replace(/^'/, '');
export const idOf = (r) => Number(r.result.value.value);
export const good = (r) => r.result.type === 'ok';

export async function world() {
  const { simnet, deployer, W } = await boot();
  const call = (fn, args = [], sender = deployer) => simnet.callPublicFn('xtrata-world-v2', fn, args, sender);
  const ro = (fn, args = []) => simnet.callReadOnlyFn('xtrata-world-v2', fn, args, deployer).result;
  const h = () => simnet.burnBlockHeight;
  const bal = (who) => simnet.getAssetsMap().get('STX').get(who);

  const w = {
    simnet, deployer, W, call, ro, h, bal,
    // a policy for space `id` (default: its current one) with fields overridden by name
    polOf: (id, over = {}) => {
      const cur = ro('get-space', [U(id)]).value.value.policy.value;
      const names = { children: 'max-children', desc: 'max-descendants', objects: 'max-objects', depth: 'max-depth',
        runtimes: 'runtimes', tiers: 'tiers', interfaces: 'interfaces', pin: 'portals-in', pout: 'portals-out', fee: 'create-fee' };
      const f = { ...cur };
      for (const [k, v] of Object.entries(over)) {
        const key = names[k] ?? k;
        f[key] = typeof v === 'boolean' ? Cl.bool(v) : U(v);
      }
      if (over.approved !== undefined) f['approved-only'] = Cl.bool(over.approved);
      return Cl.tuple(f);
    },
    // space helpers: by default a child gets its parent's policy, depth ceiling kept consistent
    space: (sender, o) => {
      const parent = o.parent ?? 1;
      let policy = o.policy;
      const psOpt = ro('get-space', [U(parent)]);
      if (!policy && psOpt.type !== 'some') policy = POL();
      if (!policy) {
        const ps = psOpt.value.value;
        const pol = { ...ps.policy.value };
        pol['max-depth'] = U(Math.max(0, Number(ps.depth.value) + Number(pol['max-depth'].value) - (Number(ps.depth.value) + 1)));
        pol['create-fee'] = U(0);
        policy = Cl.tuple(pol);
      }
      return call('create-space', [
        U(parent), S(o.slug), S(o.title ?? o.slug), U(o.kind ?? 1), P(o.owner ?? sender),
        U(o.runtime ?? 1), Cl.bool(o.transferable ?? true), policy,
      ], sender);
    },
    // buy a listed space: names the listed price and the space version just read
    buy: (sender, id, price) => {
      const sp = ro('get-space', [U(id)]);
      const ver = sp.type === 'some' ? sp.value.value.version : U(0);
      let pr = price;
      if (pr === undefined) { const l = ro('get-listing', [U(id)]); pr = l.type === 'some' ? Number(l.value.value.price.value) : 0; }
      return call('buy-space', [U(id), U(pr), ver], sender);
    },
    setState: (sender, id, state) => call('set-space-state', [U(id), U(state)], sender),
    grant: (sender, space, who, caps, inherit = false, expires = 0) =>
      call('grant', [U(space), P(who), U(caps), Cl.bool(inherit), U(expires)], sender),
    // kinds and objects
    kind: (sender, o) => call('register-kind', [
      U(o.space ?? 1), U(o.category ?? 1), S(o.name ?? 'k'), U(o.tier ?? 0), S(o.builtin ?? (o.tier ? '' : 'k')),
      U(o.srcId ?? 0), Cl.buffer(o.hash ?? new Uint8Array(0)), U(o.size ?? 0),
    ], sender),
    object: (sender, space, kind, o = {}) => call('create-object', [
      U(space), U(o.parent ?? 0), U(kind), S(o.name ?? 'obj'), o.transform ?? TF(), S(o.params ?? '{}'),
    ], sender),
    addState: (sender, obj, o = {}) => call('add-state', [stateArg(obj, o)], sender),
    portal: (sender, obj, to, arrival = 0, path = '') =>
      call('set-portal', [U(obj), Cl.some(Cl.tuple({ 'to-space': U(to), arrival: U(arrival), path: S(path) }))], sender),
    path: (slugs) => Number(ro('resolve-path', [Cl.list(slugs.map(S))]).value.value),
    get: (id) => ro('get-space', [U(id)]).value.value,
    getObj: (id) => ro('get-object', [U(id)]).value.value,
  };
  return w;
}

export const stateArg = (obj, o = {}) => Cl.tuple({
  obj: U(obj), from: U(o.from ?? 0), patch: S(o.patch ?? '{}'), visibility: U(o.visibility ?? 0), interaction: U(o.interaction ?? 0),
});

export const bindingsArg = (list) => Cl.list(list.map(([role, contract, iface]) =>
  Cl.tuple({ role: S(role), contract: P(contract), interface: U(iface) })));

// A tidy tree used by many tests:
//   1 root (deployer)
//   2 arcade (domain)  3 lobby (room)  4 casino (room)  5 hall (room)    all root-owned, system-locked
//   6 plots (domain)   7 alice (plot, W[0])
// and built-in kinds: 0 carpet (material), 1 door (door), 2 sign (display), 3 stool (prop)
export async function standardWorld() {
  const w = await world();
  const { deployer, W } = w;
  const sys = (parent, slug, kind) => w.space(deployer, { parent, slug, kind, runtime: 0, transferable: false });
  const must = (r, what) => { if (!good(r)) throw new Error(`${what}: ${pp(r.result)}`); return idOf(r); };
  w.ids = {
    arcade: must(sys(1, 'arcade', 0), 'arcade'),
  };
  w.ids.lobby = must(sys(w.ids.arcade, 'lobby', 1), 'lobby');
  w.ids.casino = must(w.space(deployer, { parent: w.ids.arcade, slug: 'casino', kind: 1, runtime: 3, transferable: false }), 'casino');
  w.ids.hall = must(sys(w.ids.arcade, 'hall', 1), 'hall');
  w.ids.plots = must(w.space(deployer, { parent: 1, slug: 'plots', kind: 0, runtime: 1, transferable: false,
    policy: POL({ depth: 5, runtimes: 2, tiers: 3, interfaces: 3, approved: true, pin: 1, pout: 1 }) }), 'plots');
  w.ids.alice = must(w.space(deployer, { parent: w.ids.plots, slug: 'alice', kind: 2, owner: W[0], runtime: 1,
    transferable: true, policy: PLOT() }), 'alice');
  must(w.setState(deployer, w.ids.arcade, 1), 'live');
  for (const k of ['lobby', 'casino', 'hall', 'plots']) must(w.setState(deployer, w.ids[k], 1), `live ${k}`);
  must(w.setState(W[0], w.ids.alice, 1), 'live alice');
  w.kinds = {
    carpet: must(w.kind(deployer, { category: 1, name: 'Carpet', builtin: 'carpet' }), 'carpet'),
    door: must(w.kind(deployer, { category: 7, name: 'Oak door', builtin: 'door-oak' }), 'door'),
    sign: must(w.kind(deployer, { category: 6, name: 'Sign', builtin: 'sign' }), 'sign'),
    stool: must(w.kind(deployer, { category: 3, name: 'Stool', builtin: 'stool' }), 'stool'),
  };
  return w;
}

export { hash32, mockInscription, Cl };
