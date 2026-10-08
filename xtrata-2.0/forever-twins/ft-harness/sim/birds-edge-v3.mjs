// Bitcoin Birds v1 edge checks for the v3 public-owner helper variant (ft3-bitcoin-birds).
// Birds v1 has a define-public get-owner and a per-owner id list capped at 400 (= full supply),
// so the helper's read-only views answer custody from that list. Simnet only.
//
//  B-1  full supply mints (ids 0..399, id 0 included); the 401st mint is refused
//  B-2  read-only views before any custody: nothing is reported held
//  B-3  token id 0 and 399 inscribe, swap in, report consistent through the id-list path
//  B-4  the helper holding the entire collection (list at its 400 cap): every id reports held,
//       custody-state stays consistent for bound tokens, stray-side names the stray side
//  B-5  redemption and rescue still work at the cap
import { Cl, cvToJSON } from '@stacks/transactions';
import { boot, xtrataHash, makeRunner } from './lib.mjs';

const { s, D, W, C, CORE } = await boot();
const R = makeRunner('birds-edge-v3');
const { scenario, check } = R;
const SRC = C('bitcoin-birds'), H = C('ft3-bitcoin-birds');
const pub = (c, f, a, who) => s.callPublicFn(c, f, a, who);
const ro = (c, f, a) => s.callReadOnlyFn(c, f, a, D);
const isOk = (r) => r.result.type === 'ok';
const code = (r) => (r.result.type === 'err' ? String(r.result.value.value) : 'ok');
const json = (r) => cvToJSON(r.result);
const owner = (id) => { const v = pub(SRC, 'get-owner', [Cl.uint(id)], D).result.value; return v.type === 'some' ? v.value.value : null; };
const stray = (id) => JSON.stringify(json(ro(H, 'stray-side', [Cl.uint(id)])));
const state = (id) => JSON.stringify(json(ro(H, 'get-custody-state', [Cl.uint(id)])));
const media = (id) => Buffer.from(`<svg>bird ${id}</svg>`);
const entry = (id) => Cl.tuple({ id: Cl.uint(id), 'content-hash': Cl.buffer(xtrataHash([media(id)])), mime: Cl.stringAscii('image/svg+xml'),
  'total-size': Cl.uint(media(id).length), 'token-uri': Cl.stringAscii(`https://xtrata.xyz/ft/bitcoin-birds/${id}.json`) });
const holder = W(1), sponsor = W(3);

scenario('B-1', 'full supply mints; id 0 exists; supply cap holds', 'B-1');
const minted = [];
for (let i = 0; i < 400; i++) {
  const r = pub(SRC, 'mint', [], holder);
  if (!isOk(r)) { check(`mint ${i}`, false, code(r)); break; }
  minted.push(Number(r.events.find((e) => e.event === 'nft_mint_event').data.value.value));
}
check('400 mints succeed', minted.length === 400, minted.length);
check('ids are exactly 0..399, each once', new Set(minted).size === 400 && Math.min(...minted) === 0 && Math.max(...minted) === 399);
const over = pub(SRC, 'mint', [], holder);
check('401st mint refused (u101)', code(over) === '101', code(over));

scenario('B-2', 'read-only views before any custody', 'B-2');
check('stray-side(0) is none while the holder owns it', stray(0).includes('"type":"none"') || stray(0).includes('"value":null'), stray(0));
check('get-custody-state(0) is none before binding', state(0).includes('"value":null') || state(0).includes('none'), state(0));

// canonical record: all 400, seeded 100 per call
for (let a = 0; a < 400; a += 100)
  pub(H, 'seed-canonical', [Cl.list(Array.from({ length: 100 }, (_, i) => entry(a + i)))], D);
check('owner finalises the 400-entry record', isOk(pub(H, 'finalize-canonical', [Cl.buffer(Buffer.alloc(32, 5)), Cl.uint(400)], D)));

scenario('B-3', 'ids 0 and 399 inscribe, swap in, report consistent', 'B-3');
for (const id of [0, 399]) {
  const ri = pub(H, 'inscribe', [Cl.uint(id), Cl.list([Cl.buffer(media(id))])], sponsor);
  check(`sponsor inscribes id ${id}`, isOk(ri), code(ri));
  const rs = pub(H, 'swap-original-for-twin', [Cl.uint(id)], holder);
  check(`holder swaps id ${id} in`, isOk(rs) && owner(id) === H, code(rs));
  check(`id ${id} custody consistent (id-list path)`, state(id).includes('"consistent":{"type":"bool","value":true}'), state(id));
  check(`id ${id} is not stranded`, state(id).includes('"stranded":{"type":"bool","value":false}'));
}
check('an unbound, holder-owned id reports no stray', stray(5).includes('"type":"none"') || stray(5).includes('"value":null'), stray(5));

scenario('B-4', 'helper holds the whole collection (id list at its 400 cap)', 'B-4');
let moved = 0, firstFail = '';
for (const id of minted) {
  if (id === 0 || id === 399) continue;
  const r = pub(SRC, 'transfer', [Cl.uint(id), Cl.principal(holder), Cl.principal(H)], holder);
  if (isOk(r)) moved++; else { firstFail ||= `${id}:${code(r)}`; }
}
check('398 remaining originals transferred to the helper (list reaches 400)', moved === 398, `${moved} ${firstFail}`);
const all = ro(SRC, 'get-birds-entry-by-owner', [Cl.principal(H)]);
check('source id list for the helper holds all 400', json(all).value.ids.value.length === 400, json(all).value.ids.value.length);
let held = 0;
for (let id = 0; id < 400; id++) if (owner(id) === H) held++;
check('every id is owned by the helper per get-owner', held === 400, held);
check('stray-side(0): bound and twin escrow flag false -> consistent, not stray', stray(0).includes('"type":"none"') || stray(0).includes('"value":null'), stray(0));
check('stray-side(200): unbound original sent directly is reported as stray "original"', stray(200).includes('original'), stray(200));
check('stray-side(398) likewise', stray(398).includes('original'), stray(398));
check('get-custody-state(399) still consistent at the cap', state(399).includes('"consistent":{"type":"bool","value":true}'), state(399));

scenario('B-5', 'redemption and rescue at the cap', 'B-5');
const x0 = Number(json(ro(H, 'get-binding', [Cl.uint(0)])).value.value['xtrata-id'].value);
const red = pub(H, 'swap-twin-for-original', [Cl.uint(0)], holder);
check('holder redeems id 0 (list drops to 399)', isOk(red) && owner(0) === holder, code(red));
check('id 0 custody consistent after redemption (twin held, original with the holder)', state(0).includes('"consistent":{"type":"bool","value":true}'), state(0));
check('twin of id 0 back in helper custody', JSON.stringify(json(ro(CORE, 'get-owner', [Cl.uint(x0)]))).includes(H));
check('id 0 can be swapped back in', isOk(pub(H, 'swap-original-for-twin', [Cl.uint(0)], holder)) && owner(0) === H);
const pr = pub(H, 'propose-rescue', [Cl.uint(200), Cl.principal(holder)], D);
check('owner proposes rescue of stray id 200', isOk(pr), code(pr));
s.mineEmptyBurnBlocks(4);
const ex = pub(H, 'execute-rescue', [Cl.uint(200)], D);
check('rescue executes after the delay; id 200 back with the holder', isOk(ex) && owner(200) === holder, code(ex));
check('stray-side(200) cleared', stray(200).includes('"type":"none"') || stray(200).includes('"value":null'), stray(200));

R.finish('birds-edge-v3.json');
