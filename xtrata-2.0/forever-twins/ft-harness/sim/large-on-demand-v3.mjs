// v3 large-on-demand: a helper rendered with largeOnDemand=true finalises without waiting
// for large (over 512 KB) entries, and anyone may twin one later with inscribe-large after
// inscribing the file through the core's multi-transaction upload from their own wallet.
// Runs on a G1 (Bitcoin Monkeys) and a G2 (See Yourself Out) helper against the real
// xtrata-v3-2-3 core. Simnet only.
//
//  L-1 finalise does not wait for large entries; the counter stays exact; the original
//      (non on-demand) helper still refuses (u221)
//  L-2 inscribe-large refused before finalisation (u208); bind-preinscribed refused after (u207)
//  L-3 wrong route refused: small entry via inscribe-large (u220); large entry via inscribe (u220)
//  L-4 refusals: wrong bytes, wrong token-uri, no such inscription (u220); twin held by someone
//      else (u210); a caller who cannot pay the fee; nothing is taken from a refused call
//  L-5 any wallet twins a large token: custody, binding, fee split 50/50, counter, event route
//  L-6 same content hash from two wallets (core allows it): independent uploads, both seal,
//      the second bind is refused (u201), the loser keeps a valid inscription that binds nowhere else
//  L-7 an upload in flight can be interleaved with another wallet's upload of the same hash
//  L-8 an upload session expires after UPLOAD-EXPIRY-BLOCKS; the helper is unaffected
//  L-9 swaps work both ways on an on-demand twin; custody stays consistent
//  L-10 record stays immutable after finalisation (seed refused, u207)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Cl, cvToJSON } from '@stacks/transactions';
import { boot, xtrataHash, makeRunner, ROOT } from './lib.mjs';

const { s, D, W, C, CORE } = await boot();
const R = makeRunner('large-on-demand-v3');
const { scenario, check } = R;
const [PA, PB] = JSON.parse(readFileSync(join(ROOT, 'scripts/simnet-payees.json'), 'utf8'));
const HALF = 500000;
const pub = (c, f, a, who) => s.callPublicFn(c, f, a, who);
const ro = (c, f, a) => s.callReadOnlyFn(c, f, a, D);
const isOk = (r) => r.result.type === 'ok';
const code = (r) => (r.result.type === 'err' ? String(r.result.value.value) : 'ok');
const json = (r) => cvToJSON(r.result);
const principalOf = (cv) => (cv && cv.type === 'some' ? cv.value.value : null);
const own = (c, id) => principalOf(ro(c, 'get-owner', [Cl.uint(id)]).result.value);
const iface = (h) => json(ro(h, 'get-twin-interface', [])).value;
const paidTo = (r, who) => r.events.filter((e) => e.event === 'stx_transfer_event' && e.data.recipient === who).reduce((n, e) => n + Number(e.data.amount), 0);
const custody = (h, id) => JSON.stringify(json(ro(h, 'get-custody-state', [Cl.uint(id)])));
const consistent = (h, id) => custody(h, id).includes('"consistent":{"type":"bool","value":true}');
const stxOf = (who) => Number(s.getAssetsMap().get('STX').get(who) ?? 0);

const CH = 16384;
const chunksOf = (b) => { const o = []; for (let i = 0; i < b.length; i += CH) o.push(b.subarray(i, i + CH)); return o; };
const bytes = (n, seed) => { const b = Buffer.alloc(n); b.set([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]); for (let i = 6; i < n; i++) b[i] = (i * 131 + seed * 7 + (i >> 9)) & 255; return b; };
const entry = (id, b, mime, uri) => Cl.tuple({ id: Cl.uint(id), 'content-hash': Cl.buffer(xtrataHash(chunksOf(b))), mime: Cl.stringAscii(mime), 'total-size': Cl.uint(b.length), 'token-uri': Cl.stringAscii(uri) });

// the core's multi-transaction upload, as any funder's wallet would run it
const begin = (b, mime, who) => { const cs = chunksOf(b), hash = xtrataHash(cs);
  return pub(CORE, 'begin-inscription', [Cl.buffer(hash), Cl.stringAscii(mime), Cl.uint(b.length), Cl.uint(cs.length)], who); };
const addBatch = (b, from, who) => { const cs = chunksOf(b), hash = xtrataHash(cs);
  return pub(CORE, 'add-chunk-batch', [Cl.buffer(hash), Cl.list(cs.slice(from, from + 32).map((c) => Cl.buffer(c)))], who); };
const seal = (b, uri, who) => pub(CORE, 'seal-inscription', [Cl.buffer(xtrataHash(chunksOf(b))), Cl.stringAscii(uri)], who);
function bigInscribe(b, mime, uri, who) {
  const r0 = begin(b, mime, who);
  if (!isOk(r0)) throw new Error(`begin ${code(r0)}`);
  for (let i = 0; i < chunksOf(b).length; i += 32) { const r = addBatch(b, i, who); if (!isOk(r)) throw new Error(`batch ${code(r)}`); }
  const r1 = seal(b, uri, who);
  if (!isOk(r1)) throw new Error(`seal ${code(r1)}`);
  return Number(json(r1).value.value);
}

let appended = 6001;
const cases = [
  { name: 'bitcoin-monkeys', group: 'G1', mint: (to) => Number(pub(C('bitcoin-monkeys'), 'claim', [], to).events.find((e) => e.event === 'nft_mint_event').data.value.value) },
  { name: 'see-yourself-out', group: 'G2', mint: (to) => { const id = appended++; pub(C('see-yourself-out'), 'simnet-mint', [Cl.uint(id), Cl.principal(to)], D); return id; } },
];
const holder = W(1), funder = W(4), funder2 = W(6), stranger = W(5);

for (const k of cases) {
  try {
  const SRC = C(k.name), H = C(`ft3lod-${k.name}`), HOLD = C(`ft3-${k.name}`), tag = `${k.name} [v3 ${k.group} large-on-demand]`;
  const A = k.mint(holder), B = k.mint(holder), S = k.mint(holder), T = k.mint(holder);
  const uri = (id) => `https://xtrata.xyz/ft/${k.name}/${id}.json`;
  const bigA = bytes(600000, A), bigB = bytes(1100000, B), small = bytes(9000, S), bigT = bytes(700000, T);

  scenario(`${k.name}:L-1`, `${tag} finalise does not wait for large entries`, 'L-1');
  const seedArgs = [Cl.list([entry(A, bigA, 'image/gif', uri(A)), entry(B, bigB, 'image/gif', uri(B)), entry(S, small, 'image/gif', uri(S)), entry(T, bigT, 'image/gif', uri(T))])];
  check('4 entries seed (3 large, 1 small)', isOk(pub(H, 'seed-canonical', seedArgs, D)));
  check('interface: large-unbound = 3', iface(H)['large-unbound'].value === '3');
  // the ordinary helper for the same source still refuses (regression: default behaviour unchanged)
  pub(HOLD, 'seed-canonical', seedArgs, D);
  check('the ordinary (flag off) helper still refuses to finalise (u221)', code(pub(HOLD, 'finalize-canonical', [Cl.buffer(Buffer.alloc(32, 9)), Cl.uint(4)], D)) === '221');
  let noFn = false; try { noFn = code(pub(HOLD, 'inscribe-large', [Cl.uint(A), Cl.uint(1)], funder)) !== 'ok'; } catch { noFn = true; }
  check('the ordinary helper has no inscribe-large', noFn);

  scenario(`${k.name}:L-2`, `${tag} route gated by finalisation`, 'L-2');
  const xEarly = bigInscribe(bigA, 'image/gif', uri(A), funder);
  check('inscribe-large before finalisation refused (u208)', code(pub(H, 'inscribe-large', [Cl.uint(A), Cl.uint(xEarly)], funder)) === '208');
  const rf = pub(H, 'finalize-canonical', [Cl.buffer(Buffer.alloc(32, 9)), Cl.uint(4)], D);
  check('finalise ok with 3 large entries unbound', isOk(rf), code(rf));
  check('interface: finalised, large-unbound still 3', iface(H)['canonical-finalized'].value === true && iface(H)['large-unbound'].value === '3');
  check('bind-preinscribed after finalisation refused (u207)', code(pub(H, 'bind-preinscribed', [Cl.uint(A), Cl.uint(xEarly)], D)) === '207');

  scenario(`${k.name}:L-3`, `${tag} wrong route refused`, 'L-3');
  const xSmall = bigInscribe(small, 'image/gif', uri(S), funder);
  check('small entry via inscribe-large refused (u220)', code(pub(H, 'inscribe-large', [Cl.uint(S), Cl.uint(xSmall)], funder)) === '220');
  check('large entry via inscribe refused (u220)', code(pub(H, 'inscribe', [Cl.uint(A), Cl.list(chunksOf(bigA).slice(0, 32).map((c) => Cl.buffer(c)))], funder)) === '220');
  check('small entry still inscribes the normal way', isOk(pub(H, 'inscribe', [Cl.uint(S), Cl.list([Cl.buffer(small)])], stranger)));

  scenario(`${k.name}:L-4`, `${tag} refusals`, 'L-4');
  const xWrongUri = bigInscribe(bigA, 'image/gif', `${uri(A)}?x`, funder);
  const xOther = bigInscribe(bytes(600000, A + 77), 'image/gif', uri(A), funder);
  const xB = bigInscribe(bigB, 'image/gif', uri(B), funder);
  check('different bytes refused (u220)', code(pub(H, 'inscribe-large', [Cl.uint(A), Cl.uint(xOther)], funder)) === '220');
  check('right bytes, wrong token-uri refused (u220)', code(pub(H, 'inscribe-large', [Cl.uint(A), Cl.uint(xWrongUri)], funder)) === '220');
  check('no such inscription refused (u220)', code(pub(H, 'inscribe-large', [Cl.uint(A), Cl.uint(987654)], funder)) === '220');
  check('a twin made for another token refused (u220)', code(pub(H, 'inscribe-large', [Cl.uint(A), Cl.uint(xB)], funder)) === '220');
  const before = stxOf(stranger);
  const rs = pub(H, 'inscribe-large', [Cl.uint(B), Cl.uint(xB)], stranger);
  check('matching twin held by someone else refused (u210), nothing taken', code(rs) === '210' && stxOf(stranger) === before, code(rs));
  check('token not in the record refused (u206)', code(pub(H, 'inscribe-large', [Cl.uint(424242), Cl.uint(xB)], funder)) === '206');

  scenario(`${k.name}:L-5`, `${tag} any wallet twins a large token`, 'L-5');
  const xA = bigInscribe(bigA, 'image/gif', uri(A), funder);
  const ra = pub(H, 'inscribe-large', [Cl.uint(A), Cl.uint(xA)], funder);
  check('inscribe-large ok, returns the xtrata id', isOk(ra) && Number(json(ra).value.value) === xA, code(ra));
  check('twin held by the helper; original untouched', own(CORE, xA) === H && own(SRC, A) === holder);
  const bd = json(ro(H, 'get-binding', [Cl.uint(A)])).value.value;
  check('binding: xtrata id, content hash, escrowed, inscriber = funder',
    Number(bd['xtrata-id'].value) === xA && bd['xtrata-escrowed'].value === true && bd.inscriber.value === funder
    && bd['content-hash'].value === '0x' + xtrataHash(chunksOf(bigA)).toString('hex'));
  check('twin-to-original recorded', Number(json(ro(H, 'get-original-by-twin', [Cl.uint(xA)])).value.value) === A);
  check('each payee got exactly half the fee', paidTo(ra, PA) === HALF && paidTo(ra, PB) === HALF);
  check('interface: large-unbound = 2, inscribed-count = 2 (one small, one large)', iface(H)['large-unbound'].value === '2' && iface(H)['inscribed-count'].value === '2');
  check('event says route large-on-demand', JSON.stringify(ra.events).includes('large-on-demand'));
  check('custody consistent', consistent(H, A));
  check('bound token cannot be bound again (u201)', code(pub(H, 'inscribe-large', [Cl.uint(A), Cl.uint(xA)], funder)) === '201');

  scenario(`${k.name}:L-6`, `${tag} same content hash from two wallets`, 'L-6');
  const rT1 = begin(bigT, 'image/gif', funder), rT2 = begin(bigT, 'image/gif', funder2);
  check('the core lets two wallets begin the same hash', isOk(rT1) && isOk(rT2), `${code(rT1)}/${code(rT2)}`);
  for (let i = 0; i < chunksOf(bigT).length; i += 32) { addBatch(bigT, i, funder); addBatch(bigT, i, funder2); }
  const xT1 = Number(json(seal(bigT, uri(T), funder)).value.value);
  const xT2 = Number(json(seal(bigT, uri(T), funder2)).value.value);
  check('both seal; two different inscription ids, each held by its own wallet', xT1 !== xT2 && own(CORE, xT1) === funder && own(CORE, xT2) === funder2);
  const w1 = pub(H, 'inscribe-large', [Cl.uint(T), Cl.uint(xT1)], funder);
  check('first wallet binds', isOk(w1), code(w1));
  const w2 = pub(H, 'inscribe-large', [Cl.uint(T), Cl.uint(xT2)], funder2);
  const funder2Before = stxOf(funder2);
  check('second wallet refused (u201); its twin stays with it', code(w2) === '201' && own(CORE, xT2) === funder2 && stxOf(funder2) === funder2Before);
  check('the first wallet\'s binding is intact', Number(json(ro(H, 'get-binding', [Cl.uint(T)])).value.value['xtrata-id'].value) === xT1 && own(CORE, xT1) === H);
  check('the loser\'s inscription binds to no other token (u220)', code(pub(H, 'inscribe-large', [Cl.uint(B), Cl.uint(xT2)], funder2)) === '220');
  check('the loser still owns a valid sealed inscription it may transfer', isOk(pub(CORE, 'transfer', [Cl.uint(xT2), Cl.principal(funder2), Cl.principal(holder)], funder2)));

  scenario(`${k.name}:L-7`, `${tag} interleaved uploads of the same hash`, 'L-7');
  const interleavedB = bytes(1100000, B);  // same bytes as token B's record
  const f1 = begin(interleavedB, 'image/gif', funder2);
  const cs = chunksOf(interleavedB);
  addBatch(interleavedB, 0, funder2);
  const f3 = begin(interleavedB, 'image/gif', stranger);       // a second wallet starts the same hash mid-way
  addBatch(interleavedB, 0, stranger);
  addBatch(interleavedB, 32, funder2);
  addBatch(interleavedB, 32, stranger);
  addBatch(interleavedB, 64, funder2);
  addBatch(interleavedB, 64, stranger);
  const sealX = seal(interleavedB, uri(B), funder2);
  check('interleaving does not disturb the first uploader', isOk(f1) && isOk(f3) && isOk(sealX), code(sealX));
  const xBf = Number(json(sealX).value.value);
  check('first uploader binds B', isOk(pub(H, 'inscribe-large', [Cl.uint(B), Cl.uint(xBf)], funder2)));
  check('the other uploader\'s session is still its own and can seal', isOk(seal(interleavedB, uri(B), stranger)));

  scenario(`${k.name}:L-8`, `${tag} upload expiry (core behaviour)`, 'L-8');
  const bigE = bytes(600000, 4242 + k.name.length);
  check('begin ok', isOk(begin(bigE, 'image/gif', funder)));
  s.mineEmptyBlocks(4400);
  const late = addBatch(bigE, 0, funder);
  check('after UPLOAD-EXPIRY-BLOCKS the core refuses further chunks', !isOk(late), code(late));
  const again = begin(bigE, 'image/gif', funder);
  check('the same wallet cannot restart an expired session (a disposable wallet is always fresh)', !isOk(again), code(again));
  check('a fresh wallet can begin the same hash at once', isOk(begin(bigE, 'image/gif', stranger)));
  check('the helper is unaffected by an expired session', iface(H)['canonical-finalized'].value === true);

  scenario(`${k.name}:L-9`, `${tag} swaps on an on-demand twin`, 'L-9');
  check('custody consistent before swap', consistent(H, A));
  const sw = pub(H, 'swap-original-for-twin', [Cl.uint(A)], holder);
  check('holder swaps in: original to helper, twin to holder', isOk(sw) && own(SRC, A) === H && own(CORE, xA) === holder, code(sw));
  check('custody consistent after swap in', consistent(H, A));
  const back = pub(H, 'swap-twin-for-original', [Cl.uint(A)], holder);
  check('holder swaps back', isOk(back) && own(SRC, A) === holder && own(CORE, xA) === H, code(back));

  scenario(`${k.name}:L-10`, `${tag} record immutable after finalisation`, 'L-10');
  check('seed-canonical refused after finalisation (u207)', code(pub(H, 'seed-canonical', [Cl.list([entry(A, bigA, 'image/png', uri(A))])], D)) === '207');
  check('all three large entries are now bound; counter is exact (0)', iface(H)['large-unbound'].value === '0' && iface(H)['inscribed-count'].value === '4');
  } catch (e) {
    scenario(`${k.name}:ERR`, `${k.name} suite aborted`, '');
    check('no unexpected exception', false, e.stack || e.message);
  }
}

R.finish('large-on-demand-v3.json');
