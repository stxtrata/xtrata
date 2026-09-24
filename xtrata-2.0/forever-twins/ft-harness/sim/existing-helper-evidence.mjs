// Forever Twins — evidence about the CURRENT reference helper (pepe-4ever-fakfun
// source; only MASTER/SOURCE/asset changed). Findings F1-F6 in
// docs/forever-twins-v2-spec.md section 3 cite these scenario ids.
// Runs the reference helper (pepe-4ever-fakfun source, only MASTER/SOURCE/asset
// names changed) against: a Bitcoin-Pepe-semantics test double, and the REAL
// archived ThisIsNumberOne V1/V2 sources. Every scenario checks actual NFT
// ownership in both contracts, not just the helper's stored flag.
import { initSimnet } from '@stacks/clarinet-sdk';
import { ROOT } from './lib.mjs';
import { join } from 'node:path';
import { mkdirSync } from 'node:fs';
import { Cl, cvToValue } from '@stacks/transactions';
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';

const s = await initSimnet(join(ROOT, 'Clarinet.toml'));
const acc = s.getAccounts();
const D = acc.get('deployer');
const W = (n) => acc.get(`wallet_${n}`);
const C = (name) => `${D}.${name}`;
const CORE = C('xtrata-v3-2-3');
const results = [];
let current = null;

const val = (r) => cvToValue(r.result, true);
const isOk = (r) => r.result.type === 'ok';
const errCode = (r) => {
  const j = JSON.parse(JSON.stringify(r.result, (k, v) => (typeof v === 'bigint' ? v.toString() : v)));
  return j.type === 'err' ? j.value?.value ?? JSON.stringify(j.value) : null;
};
const pub = (c, fn, args, sender) => s.callPublicFn(c, fn, args, sender);
const ro = (c, fn, args) => s.callReadOnlyFn(c, fn, args, D);
const ownerOf = (c, id) => {
  const v = val(ro(c, 'get-owner', [Cl.uint(id)]));
  const inner = v?.value ?? v; // (ok (optional principal))
  return inner?.value ?? inner ?? null;
};
const binding = (helper, id) => val(ro(helper, 'get-binding', [Cl.uint(id)]));

function scenario(id, title) { current = { id, title, checks: [], notes: [] }; results.push(current); }
function check(label, cond, detail = '') {
  current.checks.push({ label, pass: !!cond, detail });
  if (!cond) console.log(`   ✗ ${label} ${detail}`);
}
const note = (t) => current.notes.push(t);

// xtrata rolling hash: h0 = 32 zero bytes; h = sha256(h || chunk)
function xtrataHash(chunks) {
  let h = Buffer.alloc(32);
  for (const c of chunks) h = createHash('sha256').update(Buffer.concat([h, c])).digest();
  return h;
}
const art = (label) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg"><text>${label}</text></svg>`);

// --- setup -------------------------------------------------------------------
pub(CORE, 'set-paused', [Cl.bool(false)], D);

function seed(helper, pairs) {
  return pub(helper, 'seed-canonical', [Cl.list(pairs.map(([id, h]) => Cl.tuple({ id: Cl.uint(id), hash: Cl.buffer(h) })))], D);
}
function inscribe(helper, tokenId, bytes, sender, { mime = 'image/svg+xml', uri = 'https://xtrata.xyz/i/{id}' } = {}) {
  const h = xtrataHash([bytes]);
  return pub(helper, 'inscribe', [Cl.uint(tokenId), Cl.buffer(h), Cl.stringAscii(mime), Cl.uint(bytes.length), Cl.list([Cl.buffer(bytes)]), Cl.stringAscii(uri)], sender);
}

// ============================================================================
// P: reference helper vs. Bitcoin-Pepe transfer semantics
// ============================================================================
const PEPE = C('mock-pepe');
const HP = C('ref-helper-pepe');
const holder = W(1), buyer = W(2), sponsor = W(3), other = W(4), stranger = W(8);
for (const [id, to] of [[1, holder], [2, holder], [3, holder], [4, other], [5, other], [6, other], [7, other]]) pub(PEPE, 'test-mint', [Cl.uint(id), Cl.principal(to)], D);
const A = Object.fromEntries([1, 2, 3, 4, 5, 6, 7].map((i) => [i, art(`pepe ${i}`)]));
A[7] = A[6]; // identical bytes for two different originals (edition-style)
seed(HP, [1, 2, 4, 5, 6, 7].map((i) => [i, xtrataHash([A[i]])]));

scenario('P1', 'Third-party sponsor funds preservation without gaining rights');
{
  const r = inscribe(HP, 1, A[1], sponsor);
  check('sponsor can inscribe a token they do not own', isOk(r), JSON.stringify(val(r)));
  const b = binding(HP, 1);
  const xid = Number(b.value['xtrata-id'].value);
  check('twin minted into helper custody', ownerOf(CORE, xid) === HP, ownerOf(CORE, xid));
  check('original stays with holder', ownerOf(PEPE, 1) === holder);
  check('binding records sponsor only as inscriber', b.value.inscriber.value === sponsor);
  const r2 = pub(HP, 'swap-pepe-for-xtrata', [Cl.uint(1)], sponsor);
  check('sponsor cannot withdraw the twin', !isOk(r2), `err ${errCode(r2)}`);
  current.xid = xid;
}

scenario('P2', 'Holder swap both ways; redemption follows the circulating twin');
{
  const xid = results[0].xid;
  check('holder deposits original, receives twin', isOk(pub(HP, 'swap-pepe-for-xtrata', [Cl.uint(1)], holder)));
  check('helper now owns original', ownerOf(PEPE, 1) === HP);
  check('holder owns twin', ownerOf(CORE, xid) === holder);
  check('twin sold/transferred to buyer', isOk(pub(CORE, 'transfer', [Cl.uint(xid), Cl.principal(holder), Cl.principal(buyer)], holder)));
  const bad = pub(HP, 'swap-xtrata-for-pepe', [Cl.uint(1)], holder);
  check('previous holder cannot redeem', !isOk(bad), `err ${errCode(bad)}`);
  check('new twin holder redeems original', isOk(pub(HP, 'swap-xtrata-for-pepe', [Cl.uint(1)], buyer)));
  check('buyer owns original, helper owns twin', ownerOf(PEPE, 1) === buyer && ownerOf(CORE, xid) === HP);
}

scenario('P3', 'Caller-controlled mime and token-uri are recorded permanently on the twin');
{
  const r = inscribe(HP, 2, A[2], sponsor, { mime: 'text/html', uri: 'https://not-the-artist.example/meta.json' });
  const xid = Number(val(r).value ?? val(r));
  check('inscribe accepted with sponsor-chosen mime + URI', isOk(r));
  const uri = val(ro(CORE, 'get-token-uri', [Cl.uint(xid)]));
  const meta = val(ro(CORE, 'get-inscription-meta', [Cl.uint(xid)]));
  check('twin token-uri is the sponsor string', JSON.stringify(uri).includes('not-the-artist.example'), JSON.stringify(uri));
  check('twin mime is the sponsor string', JSON.stringify(meta).includes('text/html'));
  note('Canonical hash pins bytes only. mime and token-uri are unconstrained inputs to a permissionless function and are immutable after mint.');
}

scenario('P4', 'Canonical records are mutable by helper admin until finalised, and inscription does not wait for finalisation');
{
  check('is-finalized false', JSON.stringify(val(ro(HP, 'is-finalized', []))).includes('false'));
  const h1 = xtrataHash([A[3]]), h2 = xtrataHash([art('substitute')]);
  seed(HP, [[3, h1]]);
  seed(HP, [[3, h2]]);
  const got = val(ro(HP, 'get-canonical-hash', [Cl.uint(3)]));
  check('admin re-seed silently replaced the canonical hash', JSON.stringify(got).includes(h2.toString('hex')));
  const r = inscribe(HP, 3, art('substitute'), sponsor);
  check('substitute bytes inscribed and bound before finalisation', isOk(r));
  note('Binding is permanent (map-insert, no delete). Whoever controls the helper admin key before finalize-canonical defines "genuine" content.');
}

scenario('P5', 'Manual transfer to the helper strands both assets (no recovery path)');
{
  const r = inscribe(HP, 4, A[4], sponsor);
  const xid = Number(val(r).value ?? val(r));
  check('token 4 inscribed; twin escrowed', ownerOf(CORE, xid) === HP);
  check('holder manually transfers original to helper address', isOk(pub(PEPE, 'transfer', [Cl.uint(4), Cl.principal(other), Cl.principal(HP)], other)));
  check('helper now owns BOTH sides', ownerOf(PEPE, 4) === HP && ownerOf(CORE, xid) === HP);
  const a = pub(HP, 'swap-pepe-for-xtrata', [Cl.uint(4)], other);
  const b = pub(HP, 'swap-xtrata-for-pepe', [Cl.uint(4)], other);
  check('swap-pepe-for-xtrata fails', !isOk(a), `err ${errCode(a)}`);
  check('swap-xtrata-for-pepe fails', !isOk(b), `err ${errCode(b)}`);
  const bb = binding(HP, 4);
  check('binding still reports original with holder (flag disagrees with chain)', JSON.stringify(bb).includes('"xtrata-escrowed":{"type":"bool","value":true}'));
  note('No admin rescue exists by design. Viewer resolves "real owner" via source get-owner, which now returns the helper itself.');
}

scenario('P6', 'Listed originals cannot be deposited until unlisted');
{
  inscribe(HP, 5, A[5], sponsor);
  pub(PEPE, 'list-in-ustx', [Cl.uint(5), Cl.uint(1000)], other);
  const r = pub(HP, 'swap-pepe-for-xtrata', [Cl.uint(5)], other);
  check('deposit rejected while listed', !isOk(r), `err ${errCode(r)}`);
  pub(PEPE, 'unlist-in-ustx', [Cl.uint(5)], other);
  check('deposit succeeds after unlisting', isOk(pub(HP, 'swap-pepe-for-xtrata', [Cl.uint(5)], other)));
}

scenario('P7', 'Identical bytes for two originals: core mints distinct twins (no dedup)');
{
  const r6 = inscribe(HP, 6, A[6], sponsor), r7 = inscribe(HP, 7, A[7], sponsor);
  const x6 = Number(val(r6).value ?? val(r6)), x7 = Number(val(r7).value ?? val(r7));
  check('both inscriptions succeed', isOk(r6) && isOk(r7));
  check('distinct twin ids', x6 !== x7, `${x6} vs ${x7}`);
  const first = val(ro(CORE, 'get-id-by-hash', [Cl.buffer(xtrataHash([A[6]]))]));
  check('get-id-by-hash returns the first only', JSON.stringify(first).includes(String(x6)));
  note('Distinct redeemable identities are preserved, but bytes are stored twice. Editions need a small per-token record that depends on one shared media inscription.');
}

scenario('P8', 'Unminted original id is rejected');
{
  seed(HP, [[999, xtrataHash([art('x')])]]);
  const r = inscribe(HP, 999, art('x'), sponsor);
  check('inscribe fails with ERR-NO-SUCH-TOKEN (u200)', !isOk(r) && String(errCode(r)) === '200', `err ${errCode(r)}`);
}

// ============================================================================
// L: reference helper vs. REAL ThisIsNumberOne sources
// ============================================================================
function mintNumberOne(src, minter, label) {
  const shares = Array(10).fill(Cl.uint(0));
  const addrs = Array(10).fill(Cl.principal(minter));
  const r = pub(src, 'mint-token', [Cl.buffer(createHash('sha256').update(label).digest()), Cl.buffer(Buffer.from(label)), Cl.uint(1), Cl.uint(0), Cl.list(addrs), Cl.list(shares)], minter);
  return Number(val(r).value ?? val(r));
}

function legacyScenario(tag, srcName, helperName) {
  const SRC = C(srcName), H = C(helperName);
  const owner = W(5), accomplice = W(6), twinBuyer = W(7);

  if (srcName.endsWith('v2')) {
    scenario(`${tag}-A`, `${srcName}: stale approval pulls the original back out of helper custody`);
    const id = mintNumberOne(SRC, owner, `${tag}-approval`);
    const bytes = art(`${tag} a`);
    seed(H, [[id, xtrataHash([bytes])]]);
    const x = Number(val(inscribe(H, id, bytes, W(3))).value);
    check('owner sets approval for accomplice', isOk(pub(SRC, 'set-approval-for', [Cl.uint(id), Cl.principal(accomplice)], owner)));
    check('owner swaps original into helper and receives twin', isOk(pub(H, 'swap-pepe-for-xtrata', [Cl.uint(id)], owner)));
    const pull = pub(SRC, 'transfer', [Cl.uint(id), Cl.principal(H), Cl.principal(accomplice)], accomplice);
    check('accomplice transfers original OUT of helper using stale approval', isOk(pull), `err ${errCode(pull)}`);
    check('accomplice owns original while owner still holds twin', ownerOf(SRC, id) === accomplice && ownerOf(CORE, x) === owner);
    check('owner sells the (now unbacked) twin to an innocent buyer', isOk(pub(CORE, 'transfer', [Cl.uint(x), Cl.principal(owner), Cl.principal(twinBuyer)], owner)) && ownerOf(CORE, x) === twinBuyer);
    const red = pub(H, 'swap-xtrata-for-pepe', [Cl.uint(id)], twinBuyer);
    check('innocent twin buyer can no longer redeem (unbacked twin)', !isOk(red), `err ${errCode(red)}`);
  }

  scenario(`${tag}-0`, `${srcName}: control — an ordinary round trip passes (and proves nothing about safety)`);
  {
    const cid = mintNumberOne(SRC, owner, `${tag}-control`);
    const cb = art(`${tag} control`);
    seed(H, [[cid, xtrataHash([cb])]]);
    const cx = Number(val(inscribe(H, cid, cb, W(3))).value);
    check('deposit original, receive twin', isOk(pub(H, 'swap-pepe-for-xtrata', [Cl.uint(cid)], owner)) && ownerOf(SRC, cid) === H);
    check('redeem twin, receive original', isOk(pub(H, 'swap-xtrata-for-pepe', [Cl.uint(cid)], owner)) && ownerOf(SRC, cid) === owner && ownerOf(CORE, cx) === H);
  }

  scenario(`${tag}-B`, `${srcName}: pre-armed buy-now sale moves the original out of helper custody`);
  const id = mintNumberOne(SRC, owner, `${tag}-buynow`);
  const bytes = art(`${tag} b`);
  seed(H, [[id, xtrataHash([bytes])]]);
  const x = Number(val(inscribe(H, id, bytes, W(3))).value);
  const arm = pub(SRC, 'set-sale-data', [Cl.uint(id), Cl.uint(1), Cl.uint(0), Cl.uint(0), Cl.uint(1000), Cl.uint(9999999999)], owner);
  check('owner arms buy-now at 1000 uSTX before depositing', isOk(arm), `err ${errCode(arm)}`);
  check('ordinary deposit into helper still succeeds', isOk(pub(H, 'swap-pepe-for-xtrata', [Cl.uint(id)], owner)));
  const buy = pub(SRC, 'buy-now', [Cl.uint(id), Cl.principal(H), Cl.principal(accomplice)], accomplice);
  check('anyone paying the armed price takes the original from the helper', isOk(buy), `err ${errCode(buy)}`);
  check('original left helper; twin still circulates', ownerOf(SRC, id) === accomplice && ownerOf(CORE, x) === owner);
  const red = pub(H, 'swap-xtrata-for-pepe', [Cl.uint(id)], owner);
  check('twin can no longer be redeemed', !isOk(red), `err ${errCode(red)}`);
  note('A successful deposit round-trip test would NOT reveal this: sale-data survives ownership change.');
}
legacyScenario('V2', 'thisisnumberone-v2', 'ref-helper-v2');
legacyScenario('V1', 'thisisnumberone-v1', 'ref-helper-v1');

// ============================================================================
// G: reference helper vs. the REAL Gamma-template source (bitcoin-pepe archive)
//    Family also used by Leo Cats, Megapont, Bitslimes, Fractal, Ordinal Pepe,
//    STX Golden Pepe, Stacks Satoshis (per screener; each still needs its own run).
// ============================================================================
{
  const G = C('gamma-bitcoin-pepe'), HG = C('ref-helper-gamma'), COMM = C('mock-commission');
  const h = W(1), x = W(6);
  for (const id of [101, 102]) pub(G, 'simnet-mint', [Cl.uint(id), Cl.principal(h)], D);
  const b1 = art('gamma 101'), b2 = art('gamma 102');
  seed(HG, [[101, xtrataHash([b1])], [102, xtrataHash([b2])]]);
  inscribe(HG, 101, b1, W(3)); inscribe(HG, 102, b2, W(3));

  scenario('G1', 'Gamma template: a live listing blocks deposit; no listing can exist on a helper-held token');
  check('holder lists 101', isOk(pub(G, 'list-in-ustx', [Cl.uint(101), Cl.uint(5000), Cl.principal(COMM)], h)));
  const d = pub(HG, 'swap-pepe-for-xtrata', [Cl.uint(101)], h);
  check('deposit rejected while listed', !isOk(d), `err ${errCode(d)}`);
  check('unlist then deposit', isOk(pub(G, 'unlist-in-ustx', [Cl.uint(101)], h)) && isOk(pub(HG, 'swap-pepe-for-xtrata', [Cl.uint(101)], h)));
  const l1 = pub(G, 'list-in-ustx', [Cl.uint(101), Cl.uint(1), Cl.principal(COMM)], x);
  const l2 = pub(G, 'list-in-ustx', [Cl.uint(101), Cl.uint(1), Cl.principal(COMM)], h);
  check('stranger cannot list a helper-held original', !isOk(l1), `err ${errCode(l1)}`);
  check('former holder cannot list a helper-held original', !isOk(l2), `err ${errCode(l2)}`);
  const buy = pub(G, 'buy-in-ustx', [Cl.uint(101), Cl.principal(COMM)], x);
  check('buy-in-ustx cannot move a helper-held original', !isOk(buy) && ownerOf(G, 101) === HG, `err ${errCode(buy)}`);
  const burn = pub(G, 'burn', [Cl.uint(101)], h);
  check('former holder cannot burn a helper-held original', !isOk(burn) && ownerOf(G, 101) === HG, `err ${errCode(burn)}`);

  scenario('G2', 'Gamma template: full round trip including resale of the twin');
  const tx = Number(binding(HG, 102).value['xtrata-id'].value);
  check('deposit 102', isOk(pub(HG, 'swap-pepe-for-xtrata', [Cl.uint(102)], h)));
  check('twin resold', isOk(pub(CORE, 'transfer', [Cl.uint(tx), Cl.principal(h), Cl.principal(W(7))], h)));
  check('new holder redeems', isOk(pub(HG, 'swap-xtrata-for-pepe', [Cl.uint(102)], W(7))) && ownerOf(G, 102) === W(7) && ownerOf(CORE, tx) === HG);
}

// --- report --------------------------------------------------------------------
let pass = 0, fail = 0;
for (const r of results) {
  const f = r.checks.filter((c) => !c.pass).length;
  pass += r.checks.length - f; fail += f;
  console.log(`${f ? 'FAIL' : 'ok  '} ${r.id.padEnd(5)} ${r.title}`);
}
console.log(`\n${pass} checks passed, ${fail} failed across ${results.length} scenarios`);
mkdirSync(join(ROOT, 'results'), { recursive: true });
writeFileSync(join(ROOT, 'results', 'existing-helper-evidence.json'), JSON.stringify({ ranAt: new Date().toISOString(), note: 'simnet only; not mainnet state', results }, null, 2));
process.exit(fail ? 1 : 0);
