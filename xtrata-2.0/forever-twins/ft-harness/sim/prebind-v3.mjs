// v3 large files: records up to the core's 32 MiB cap, owner pre-inscription through
// the core's multi-transaction upload, bind-preinscribed, and finalisation gated on
// every large entry being bound. Runs on a G1 (Bitcoin Monkeys) and a G2 (See Yourself
// Out) helper against the real xtrata-v3-2-3 core. Simnet only.
//
//  P-1 large records seed (up to 32 MiB); over the cap refused (u215); interface counts them
//  P-2 finalise refused while a large entry is unbound (u221)
//  P-3 bind refused: non-owner (u204), wrong bytes / wrong token-uri / no such
//      inscription (u220), caller doesn't hold the twin (u210)
//  P-4 bind: twin moves from owner into custody; binding identical in shape to inscribe
//  P-5 a bound entry can't be re-seeded (u215) or bound again (u201); finalise after all bound
//  P-6 after finalisation: bind refused (u207); sponsors inscribe small tokens as usual
//      (fee split 50/50); a pre-bound token can't be inscribed again (u201)
//  P-7 swaps work for pre-bound twins; custody consistent both ways
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Cl, cvToJSON } from '@stacks/transactions';
import { boot, xtrataHash, makeRunner, ROOT } from './lib.mjs';

const { s, D, W, C, CORE } = await boot();
const R = makeRunner('prebind-v3');
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

const CH = 16384;
const chunksOf = (b) => { const o = []; for (let i = 0; i < b.length; i += CH) o.push(b.subarray(i, i + CH)); return o; };
const bytes = (n, seed) => { const b = Buffer.alloc(n); b.set([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]); for (let i = 6; i < n; i++) b[i] = (i * 131 + seed * 7 + (i >> 9)) & 255; return b; };
const entry = (id, b, mime, uri) => Cl.tuple({ id: Cl.uint(id), 'content-hash': Cl.buffer(xtrataHash(chunksOf(b))), mime: Cl.stringAscii(mime), 'total-size': Cl.uint(b.length), 'token-uri': Cl.stringAscii(uri) });

// the core's multi-transaction upload, as the owner would run it
function bigInscribe(b, mime, uri, who) {
  const cs = chunksOf(b), hash = xtrataHash(cs);
  const r0 = pub(CORE, 'begin-inscription', [Cl.buffer(hash), Cl.stringAscii(mime), Cl.uint(b.length), Cl.uint(cs.length)], who);
  if (!isOk(r0)) throw new Error(`begin ${code(r0)}`);
  for (let i = 0; i < cs.length; i += 32) {
    const r = pub(CORE, 'add-chunk-batch', [Cl.buffer(hash), Cl.list(cs.slice(i, i + 32).map((c) => Cl.buffer(c)))], who);
    if (!isOk(r)) throw new Error(`batch ${code(r)}`);
  }
  const r1 = pub(CORE, 'seal-inscription', [Cl.buffer(hash), Cl.stringAscii(uri)], who);
  if (!isOk(r1)) throw new Error(`seal ${code(r1)}`);
  return Number(json(r1).value.value);
}

let appended = 5001;
const cases = [
  { name: 'bitcoin-monkeys', group: 'G1', mint: (to) => Number(pub(C('bitcoin-monkeys'), 'claim', [], to).events.find((e) => e.event === 'nft_mint_event').data.value.value) },
  { name: 'see-yourself-out', group: 'G2', mint: (to) => { const id = appended++; pub(C('see-yourself-out'), 'simnet-mint', [Cl.uint(id), Cl.principal(to)], D); return id; } },
];
const holder = W(1), sponsor = W(3), stranger = W(5);

for (const k of cases) {
  try {
  const SRC = C(k.name), H = C(`ft3-${k.name}`), tag = `${k.name} [v3 ${k.group}]`;
  const A = k.mint(holder), B = k.mint(holder), S = k.mint(holder);
  const uri = (id) => `https://xtrata.xyz/ft/${k.name}/${id}.json`;
  const bigA = bytes(600000, A), bigB = bytes(1100000, B), small = bytes(9000, S);

  scenario(`${k.name}:P-1`, `${tag} large records seed; over the core cap refused`, 'P-1');
  const huge = Cl.tuple({ id: Cl.uint(999999), 'content-hash': Cl.buffer(Buffer.alloc(32, 1)), mime: Cl.stringAscii('image/gif'), 'total-size': Cl.uint(33554433), 'token-uri': Cl.stringAscii(uri(999999)) });
  check('entry over 32 MiB refused (u215)', code(pub(H, 'seed-canonical', [Cl.list([huge])], D)) === '215');
  const rs = pub(H, 'seed-canonical', [Cl.list([entry(A, bigA, 'image/gif', uri(A)), entry(B, bigB, 'image/gif', uri(B)), entry(S, small, 'image/gif', uri(S))])], D);
  check('600 KB and 1.1 MB entries seed alongside a small one', isOk(rs), code(rs));
  check('interface: large-unbound = 2', iface(H)['large-unbound'].value === '2', iface(H)['large-unbound'].value);
  const rr = pub(H, 'seed-canonical', [Cl.list([entry(B, bigB, 'image/gif', uri(B))])], D);
  check('re-seeding an unbound large entry keeps the count exact', isOk(rr) && iface(H)['large-unbound'].value === '2');

  scenario(`${k.name}:P-2`, `${tag} finalise refused while large entries are unbound`, 'P-2');
  check('finalise refused (u221)', code(pub(H, 'finalize-canonical', [Cl.buffer(Buffer.alloc(32, 9)), Cl.uint(3)], D)) === '221');

  scenario(`${k.name}:P-3`, `${tag} bind refusals`, 'P-3');
  const xA = bigInscribe(bigA, 'image/gif', uri(A), D);
  const xWrongUri = bigInscribe(bigA, 'image/gif', `${uri(A)}?x`, D);
  const xOther = bigInscribe(bytes(600000, A + 77), 'image/gif', uri(A), D);
  const xStranger = bigInscribe(bigB, 'image/gif', uri(B), stranger);
  check('owner multi-tx inscription of the 600 KB file succeeds', own(CORE, xA) === D);
  check('non-owner cannot bind (u204)', code(pub(H, 'bind-preinscribed', [Cl.uint(A), Cl.uint(xA)], stranger)) === '204');
  check('different bytes refused (u220)', code(pub(H, 'bind-preinscribed', [Cl.uint(A), Cl.uint(xOther)], D)) === '220');
  check('right bytes, wrong token-uri refused (u220)', code(pub(H, 'bind-preinscribed', [Cl.uint(A), Cl.uint(xWrongUri)], D)) === '220');
  check('no such inscription refused (u220)', code(pub(H, 'bind-preinscribed', [Cl.uint(A), Cl.uint(987654)], D)) === '220');
  check('matching twin held by someone else refused (u210)', code(pub(H, 'bind-preinscribed', [Cl.uint(B), Cl.uint(xStranger)], D)) === '210');
  check('a bytes-for-another-token twin refused (u220)', code(pub(H, 'bind-preinscribed', [Cl.uint(B), Cl.uint(xA)], D)) === '220');

  scenario(`${k.name}:P-4`, `${tag} bind moves the twin into custody`, 'P-4');
  const rb = pub(H, 'bind-preinscribed', [Cl.uint(A), Cl.uint(xA)], D);
  check('bind ok, returns the xtrata id', isOk(rb) && Number(json(rb).value.value) === xA, code(rb));
  check('twin now held by the helper; original untouched', own(CORE, xA) === H && own(SRC, A) === holder);
  const bd = json(ro(H, 'get-binding', [Cl.uint(A)])).value.value;
  check('binding: same xtrata id, content hash, escrowed', Number(bd['xtrata-id'].value) === xA && bd['xtrata-escrowed'].value === true
    && bd['content-hash'].value === '0x' + xtrataHash(chunksOf(bigA)).toString('hex'));
  check('twin-to-original recorded', Number(json(ro(H, 'get-original-by-twin', [Cl.uint(xA)])).value.value) === A);
  check('interface: large-unbound = 1, inscribed-count = 1', iface(H)['large-unbound'].value === '1' && iface(H)['inscribed-count'].value === '1');
  check('no fee taken by the bind', paidTo(rb, PA) === 0 && paidTo(rb, PB) === 0);

  scenario(`${k.name}:P-5`, `${tag} bound entries are fixed; finalise once all are bound`, 'P-5');
  check('bound entry cannot be re-seeded (u215)', code(pub(H, 'seed-canonical', [Cl.list([entry(A, bigA, 'image/png', uri(A))])], D)) === '215');
  check('bound token cannot be bound again (u201)', code(pub(H, 'bind-preinscribed', [Cl.uint(A), Cl.uint(xA)], D)) === '201');
  check('finalise still refused with one unbound (u221)', code(pub(H, 'finalize-canonical', [Cl.buffer(Buffer.alloc(32, 9)), Cl.uint(3)], D)) === '221');
  const xB = bigInscribe(bigB, 'image/gif', uri(B), D);
  check('1.1 MB twin (68 chunks, 3 batches) binds', isOk(pub(H, 'bind-preinscribed', [Cl.uint(B), Cl.uint(xB)], D)));
  const rf = pub(H, 'finalize-canonical', [Cl.buffer(Buffer.alloc(32, 9)), Cl.uint(3)], D);
  check('finalise ok once every large entry is bound', isOk(rf), code(rf));

  scenario(`${k.name}:P-6`, `${tag} after finalisation`, 'P-6');
  const xS = bigInscribe(small, 'image/gif', uri(S), D);
  check('bind after finalisation refused (u207)', code(pub(H, 'bind-preinscribed', [Cl.uint(S), Cl.uint(xS)], D)) === '207');
  check('pre-bound token cannot be inscribed (u201)', code(pub(H, 'inscribe', [Cl.uint(A), Cl.list(chunksOf(bigA).slice(0, 32).map((c) => Cl.buffer(c)))], sponsor)) === '201');
  const ri = pub(H, 'inscribe', [Cl.uint(S), Cl.list([Cl.buffer(small)])], sponsor);
  check('sponsor inscribes the small token; each payee gets half', isOk(ri) && paidTo(ri, PA) === HALF && paidTo(ri, PB) === HALF, code(ri));
  check('inscribed-count = 3', iface(H)['inscribed-count'].value === '3');

  scenario(`${k.name}:P-7`, `${tag} swaps on a pre-bound twin`, 'P-7');
  check('custody consistent before swap', consistent(H, A));
  const sw = pub(H, 'swap-original-for-twin', [Cl.uint(A)], holder);
  check('holder swaps in: original to helper, twin to holder', isOk(sw) && own(SRC, A) === H && own(CORE, xA) === holder, code(sw));
  check('custody consistent after swap in', consistent(H, A));
  const back = pub(H, 'swap-twin-for-original', [Cl.uint(A)], holder);
  check('holder swaps back', isOk(back) && own(SRC, A) === holder && own(CORE, xA) === H, code(back));
  } catch (e) {
    scenario(`${k.name}:ERR`, `${k.name} suite aborted`, '');
    check('no unexpected exception', false, e.message);
  }
}

R.finish('prebind-v3.json');
