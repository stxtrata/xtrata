// Randomised, seeded, stateful invariant test of the large-on-demand helper (G1, Bitcoin Monkeys shape) against
// the real xtrata-v3-2-3 core, simnet only. Hundreds of random calls from random wallets (right and wrong
// inscriptions, wrong tokens, non-owners, swaps, transfers, fee changes), with the invariants re-checked after
// EVERY call. Reproduce a failure with FUZZ_SEED=<n>.
//
//   FUZZ_SEED=20261006 FUZZ_OPS=300 node sim/lod-fuzz-v3.mjs
//
// Invariants
//  I1  the helper never holds STX
//  I2  every token has at most one binding; a twin id is bound to at most one token; counters are exact
//      (inscribed-count = bindings, large-unbound = large records without a binding)
//  I3  custody is consistent for every bound token (the helper holds exactly the side its state says)
//  I4  a refused call changes NOTHING (interface, bindings, every owner, every wallet's STX)
//  I5  inscribe-large succeeds only for the exact inscription the record fixes, for a held, unbound, large token,
//      and a success pays each payee exactly half the live fee and no one else
//  I6  owner-only functions never succeed for anyone else; set-fee obeys the cap and evenness
//  I7  the canonical record never changes after finalisation
//  I8  the run actually exercised the interesting paths (it is not vacuous)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Cl, cvToJSON } from '@stacks/transactions';
import { boot, xtrataHash, makeRunner, ROOT } from './lib.mjs';

const SEED = Number(process.env.FUZZ_SEED || 20261006), N = Number(process.env.FUZZ_OPS || 300);
let st = SEED >>> 0;
const rnd = () => { st = (st + 0x6D2B79F5) >>> 0; let t = st; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const pick = (a) => a[Math.floor(rnd() * a.length)];
const chance = (p) => rnd() < p;

const { s, D, W, C, CORE } = await boot();
const R = makeRunner('lod-fuzz-v3');
const { scenario, check } = R;
const [PA, PB] = JSON.parse(readFileSync(join(ROOT, 'scripts/simnet-payees.json'), 'utf8'));
const pub = (c, f, a, who) => s.callPublicFn(c, f, a, who);
const ro = (c, f, a) => s.callReadOnlyFn(c, f, a, D);
const isOk = (r) => r.result.type === 'ok';
const code = (r) => (r.result.type === 'err' ? String(r.result.value.value) : 'ok');
const json = (r) => cvToJSON(r.result);
const principalOf = (cv) => (cv && cv.type === 'some' ? cv.value.value : null);
const own = (c, id) => principalOf(ro(c, 'get-owner', [Cl.uint(id)]).result.value);
const iface = (h) => json(ro(h, 'get-twin-interface', [])).value;
const paidTo = (r, who) => r.events.filter((e) => e.event === 'stx_transfer_event' && e.data.recipient === who).reduce((n, e) => n + Number(e.data.amount), 0);
const stxOf = (who) => Number(s.getAssetsMap().get('STX')?.get(who) ?? 0);
const CH = 16384;
const chunksOf = (b) => { const o = []; for (let i = 0; i < b.length; i += CH) o.push(b.subarray(i, i + CH)); return o; };
const bytes = (n, seed) => { const b = Buffer.alloc(n); b.set([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]); for (let i = 6; i < n; i++) b[i] = (i * 131 + seed * 7 + (i >> 9)) & 255; return b; };
const entry = (id, b, uri) => Cl.tuple({ id: Cl.uint(id), 'content-hash': Cl.buffer(xtrataHash(chunksOf(b))), mime: Cl.stringAscii('image/gif'), 'total-size': Cl.uint(b.length), 'token-uri': Cl.stringAscii(uri) });
function bigInscribe(b, uri, who) {
  const cs = chunksOf(b), hash = xtrataHash(cs);
  if (!isOk(pub(CORE, 'begin-inscription', [Cl.buffer(hash), Cl.stringAscii('image/gif'), Cl.uint(b.length), Cl.uint(cs.length)], who))) throw new Error('begin');
  for (let i = 0; i < cs.length; i += 32) if (!isOk(pub(CORE, 'add-chunk-batch', [Cl.buffer(hash), Cl.list(cs.slice(i, i + 32).map((c) => Cl.buffer(c)))], who))) throw new Error('batch');
  const r = pub(CORE, 'seal-inscription', [Cl.buffer(hash), Cl.stringAscii(uri)], who);
  if (!isOk(r)) throw new Error('seal ' + code(r));
  return Number(json(r).value.value);
}

const SRC = C('bitcoin-monkeys'), H = C('ft3lod-bitcoin-monkeys');
const holders = [W(1), W(2), W(3)], others = [W(4), W(5), W(6)], ALL = [D, ...holders, ...others];
const mint = (to) => Number(pub(SRC, 'claim', [], to).events.find((e) => e.event === 'nft_mint_event').data.value.value);
const T = [mint(holders[0]), mint(holders[0]), mint(holders[1]), mint(holders[1]), mint(holders[2]), mint(holders[2])];
const uri = (id) => `https://xtrata.xyz/ft/bitcoin-monkeys/${id}.json`;
const art = [bytes(530000, 1), bytes(540000, 2), bytes(560000, 3), bytes(9000, 4), bytes(9500, 5), bytes(10000, 6)];
const LARGE = [T[0], T[1], T[2]], SMALL = [T[3], T[4], T[5]];

scenario('FZ-0', `setup: seed ${T.length} records, finalise, pre-seal a pool of inscriptions (seed ${SEED})`);
check('seed ok', isOk(pub(H, 'seed-canonical', [Cl.list(T.map((t, i) => entry(t, art[i], uri(t))))], D)));
check('finalise ok', isOk(pub(H, 'finalize-canonical', [Cl.buffer(Buffer.alloc(32, 9)), Cl.uint(T.length)], D)));
// the pool: what a visitor (or an attacker) could hold. kind says whether the record accepts it.
const pool = [];
const add = (token, b, u, who, kind) => { pool.push({ xid: bigInscribe(b, u, who), token, kind, owner0: who }); };
for (let i = 0; i < 3; i++) { add(LARGE[i], art[i], uri(LARGE[i]), others[i % 3], 'good'); add(LARGE[i], art[i], uri(LARGE[i]), others[(i + 1) % 3], 'good'); }
add(LARGE[0], art[0], uri(LARGE[0]) + '?x', others[0], 'bad-uri');
add(LARGE[1], bytes(540000, 99), uri(LARGE[1]), others[1], 'bad-bytes');
add(SMALL[0], art[3], uri(SMALL[0]), others[2], 'small');
const xids = pool.map((p) => p.xid);
const poolByXid = new Map(pool.map((p) => [p.xid, p]));
const tokens = T;
const initialRecord = JSON.stringify(tokens.map((t) => json(ro(H, 'get-canonical', [Cl.uint(t)]))));
const custodyOk = (t) => JSON.stringify(json(ro(H, 'get-custody-state', [Cl.uint(t)]))).includes('"consistent":{"type":"bool","value":true}');
const bindingOf = (t) => { const b = json(ro(H, 'get-binding', [Cl.uint(t)])).value; return b ? Number(b.value['xtrata-id'].value) : null; };
const digest = () => JSON.stringify({ i: iface(H), b: tokens.map((t) => json(ro(H, 'get-binding', [Cl.uint(t)]))), xo: xids.map((x) => own(CORE, x)), so: tokens.map((t) => own(SRC, t)), stx: ALL.map(stxOf), hs: stxOf(H) });

const viol = []; const cov = { il_ok: 0, il_refused: 0, inscribe_ok: 0, swap_out_ok: 0, swap_in_ok: 0, refused: 0, setfee_ok: 0, setfee_refused: 0, xfer_ok: 0, ops: 0 };
const bad = (i, kind, msg) => { viol.push(`op ${i} [${kind}] ${msg}`); if (viol.length <= 8) console.log(`   ✗ op ${i} [${kind}] ${msg}`); };

function invariants(i, tag) {
  if (stxOf(H) !== 0) bad(i, 'I1', `helper holds ${stxOf(H)} µSTX after ${tag}`);
  const bound = new Map(); let n = 0;
  for (const t of tokens) { const x = bindingOf(t); if (x != null) { n++; if (bound.has(x)) bad(i, 'I2', `twin ${x} bound to tokens ${bound.get(x)} and ${t}`); bound.set(x, t); if (!custodyOk(t)) bad(i, 'I3', `custody inconsistent for token ${t} after ${tag}`); } }
  const f = iface(H);
  if (Number(f['inscribed-count'].value) !== n) bad(i, 'I2', `inscribed-count ${f['inscribed-count'].value} != bindings ${n}`);
  const unboundLarge = LARGE.filter((t) => bindingOf(t) == null).length;
  if (Number(f['large-unbound'].value) !== unboundLarge) bad(i, 'I2', `large-unbound ${f['large-unbound'].value} != ${unboundLarge}`);
  if (JSON.stringify(tokens.map((t) => json(ro(H, 'get-canonical', [Cl.uint(t)])))) !== initialRecord) bad(i, 'I7', 'the canonical record changed');
}

scenario('FZ-1', `${N} random calls with every invariant checked after each`);
for (let i = 0; i < N; i++) {
  cov.ops++;
  const roll = rnd(); const before = digest(); let r, tag, expectOk = null;
  const fee = Number(iface(H).fee.value);
  if (roll < 0.40) {
    // inscribe-large: mostly the real owner of a pool inscription, sometimes anyone; token mostly the right one, sometimes wrong
    const x = chance(0.1) ? 987654 : pick(xids); const p = poolByXid.get(x);
    const t = chance(0.75) && p ? p.token : pick([...tokens, 424242]);
    const holderNow = own(CORE, x);
    const who = chance(0.7) && holderNow && ALL.includes(holderNow) ? holderNow : pick(ALL);
    tag = `inscribe-large(${t}, ${x}) by ${ALL.indexOf(who)}`;
    const bound0 = bindingOf(t) != null, isLargeTok = LARGE.includes(t);
    const shouldOk = !!p && p.kind === 'good' && p.token === t && isLargeTok && !bound0 && holderNow === who && own(SRC, t) !== H;
    r = pub(H, 'inscribe-large', [Cl.uint(t), Cl.uint(x)], who);
    if (isOk(r)) {
      cov.il_ok++;
      if (!shouldOk) bad(i, 'I5', `${tag} SUCCEEDED but should have been refused (kind ${p && p.kind})`);
      if (fee > 0 && (paidTo(r, PA) !== fee / 2 || paidTo(r, PB) !== fee / 2)) bad(i, 'I5', `${tag}: payees got ${paidTo(r, PA)}/${paidTo(r, PB)}, fee ${fee}`);
      const total = r.events.filter((e) => e.event === 'stx_transfer_event').reduce((a, e) => a + Number(e.data.amount), 0);
      if (total !== fee) bad(i, 'I5', `${tag}: STX moved ${total} != fee ${fee}`);
      if (bindingOf(t) !== x || own(CORE, x) !== H) bad(i, 'I5', `${tag}: not bound/in custody after success`);
    } else {
      cov.il_refused++;
      if (shouldOk && fee <= stxOf(who)) bad(i, 'I5', `${tag} was REFUSED (${code(r)}) but is valid`);
    }
  } else if (roll < 0.48) {
    // inscribe: small tokens the normal way, large tokens must be refused (u220)
    const t = pick(tokens), idx = tokens.indexOf(t), who = pick(ALL);
    tag = `inscribe(${t}) by ${ALL.indexOf(who)}`;
    r = pub(H, 'inscribe', [Cl.uint(t), Cl.list(chunksOf(art[idx]).slice(0, 32).map((c) => Cl.buffer(c)))], who);
    if (isOk(r)) { cov.inscribe_ok++; if (LARGE.includes(t)) bad(i, 'I5', `${tag}: a large token was inscribed through the small route`); }
  } else if (roll < 0.63) {
    const t = pick(tokens); const holder = own(SRC, t); const who = chance(0.7) && holder && ALL.includes(holder) ? holder : pick(ALL);
    tag = `swap-original-for-twin(${t}) by ${ALL.indexOf(who)}`;
    r = pub(H, 'swap-original-for-twin', [Cl.uint(t)], who); if (isOk(r)) cov.swap_out_ok++;
  } else if (roll < 0.78) {
    const t = pick(tokens); const x = bindingOf(t); const holder = x != null ? own(CORE, x) : null; const who = chance(0.7) && holder && ALL.includes(holder) ? holder : pick(ALL);
    tag = `swap-twin-for-original(${t}) by ${ALL.indexOf(who)}`;
    r = pub(H, 'swap-twin-for-original', [Cl.uint(t)], who); if (isOk(r)) cov.swap_in_ok++;
  } else if (roll < 0.86) {
    const x = pick(xids); const cur = own(CORE, x); const to = pick(ALL.filter((a) => a !== cur)); const who = chance(0.8) && cur && ALL.includes(cur) ? cur : pick(ALL);
    tag = `core transfer #${x} ${cur && ALL.indexOf(cur)} -> ${ALL.indexOf(to)} by ${ALL.indexOf(who)}`;
    r = pub(CORE, 'transfer', [Cl.uint(x), Cl.principal(cur || D), Cl.principal(to)], who); if (isOk(r)) cov.xfer_ok++;
  } else if (roll < 0.93) {
    const t = pick(tokens); const cur = own(SRC, t); const to = pick(ALL.filter((a) => a !== cur)); const who = chance(0.8) && cur && ALL.includes(cur) ? cur : pick(ALL);
    tag = `source transfer #${t} -> ${ALL.indexOf(to)} by ${ALL.indexOf(who)}`;
    r = pub(SRC, 'transfer', [Cl.uint(t), Cl.principal(cur || D), Cl.principal(to)], who);
  } else {
    const who = chance(0.5) ? D : pick(holders.concat(others)); const v = pick([0, 2, 500000, 1000000, 1000001, 4000000, 5000000, 6000000, 999999999]);
    tag = `set-fee(${v}) by ${who === D ? 'owner' : 'someone else'}`;
    r = pub(H, 'set-fee', [Cl.uint(v)], who);
    const max = Number(iface(H)['max-fee'].value);
    if (isOk(r)) { cov.setfee_ok++; if (who !== D) bad(i, 'I6', `${tag} SUCCEEDED for a non-owner`); if (v > max || v % 2) bad(i, 'I6', `${tag} succeeded outside the cap/evenness rule`); }
    else { cov.setfee_refused++; if (who === D && v <= max && v % 2 === 0) bad(i, 'I6', `${tag} was refused (${code(r)}) but is valid`); }
  }
  if (r && !isOk(r)) { cov.refused++; const after = digest(); if (after !== before) bad(i, 'I4', `${tag} was refused (${code(r)}) but changed state`); }
  invariants(i, tag);
}

check('I1 helper never held STX', !viol.some((v) => v.includes('[I1]')), viol.filter((v) => v.includes('[I1]'))[0]);
check('I2 bindings unique and counters exact', !viol.some((v) => v.includes('[I2]')), viol.filter((v) => v.includes('[I2]'))[0]);
check('I3 custody consistent for every bound token', !viol.some((v) => v.includes('[I3]')), viol.filter((v) => v.includes('[I3]'))[0]);
check('I4 every refused call changed nothing', !viol.some((v) => v.includes('[I4]')), viol.filter((v) => v.includes('[I4]'))[0]);
check('I5 inscribe-large exactly when valid, fee exactly half/half', !viol.some((v) => v.includes('[I5]')), viol.filter((v) => v.includes('[I5]'))[0]);
check('I6 owner-only functions and the fee rules', !viol.some((v) => v.includes('[I6]')), viol.filter((v) => v.includes('[I6]'))[0]);
check('I7 canonical record unchanged', !viol.some((v) => v.includes('[I7]')), viol.filter((v) => v.includes('[I7]'))[0]);
console.log('   coverage:', JSON.stringify(cov));
check('I8 the run was not vacuous: valid binds, refusals, swaps both ways, fee changes', cov.il_ok >= 2 && cov.il_refused >= 20 && cov.swap_out_ok >= 1 && cov.swap_in_ok >= 1 && cov.setfee_ok >= 1 && cov.setfee_refused >= 1 && cov.refused >= 50, JSON.stringify(cov));
R.finish('lod-fuzz-v3.json');
