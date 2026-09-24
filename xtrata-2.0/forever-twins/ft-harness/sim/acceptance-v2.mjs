// FT-SPEC-2 acceptance suite: forever-twin-helper-v2 (rendered) against
//   - the REAL archived zombie-wabbits source (proposed pilot; unmodified logic)
//   - the REAL archived Gamma-template bitcoin-pepe source (listing semantics)
// Test ids (T-xx) are referenced from docs/forever-twins-v2-spec.md section 9.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { boot, Cl, val, isOk, errCode, okUint, xtrataHash, art, makeRunner, ownerOf, ROOT } from './lib.mjs';
import { render } from '../scripts/render-helper.mjs';

const { s, D, W, C, CORE } = await boot();
const R = makeRunner('acceptance-v2');
const { scenario, check, note } = R;
const pub = (c, f, a, who) => s.callPublicFn(c, f, a, who);
const ro = (c, f, a) => s.callReadOnlyFn(c, f, a, D);
const own = (c, id) => ownerOf(s, D, c, id);
const code = (r) => String(errCode(r));

const ZW = C('zombie-wabbits'), H = C('ft2-zombie-wabbits');
const sponsor = W(3), holder = W(1), buyer = W(2), stranger = W(8), feeTo = W(7);

// ---- media and canonical record -------------------------------------------------
const media = {};
const canonEntry = (id, { mime = 'image/png', uri = `https://xtrata.xyz/ft/zombie-wabbits/${id}.json` } = {}) => {
  media[id] ??= art(`wabbit ${id}`);
  return Cl.tuple({ id: Cl.uint(id), 'content-hash': Cl.buffer(xtrataHash([media[id]])), mime: Cl.stringAscii(mime),
    'total-size': Cl.uint(media[id].length), 'token-uri': Cl.stringAscii(uri) });
};
const seed = (entries, who = D) => pub(H, 'seed-canonical', [Cl.list(entries)], who);
const inscribe = (id, who = sponsor, bytes = media[id]) => pub(H, 'inscribe', [Cl.uint(id), Cl.list([Cl.buffer(bytes)])], who);
const binding = (id) => val(ro(H, 'get-binding', [Cl.uint(id)]));
const custody = (id) => val(ro(H, 'get-custody-state', [Cl.uint(id)]))?.value;
const xidOf = (id) => Number(binding(id).value['xtrata-id'].value);

// ---- source population: deployer holds 1,2,44,45 from the contract's own init;
//      wallets mint more through the real public mint (150 STX each).
const giveaway = [1, 2, 44, 45];
const minted = [];
for (const w of [W(1), W(1), W(4)]) {
  const r = pub(ZW, 'mint', [], w); // the real mint returns (ok true); the id is in the mint event
  const ev = r.events.find((e) => e.event === 'nft_mint_event');
  if (isOk(r) && ev) minted.push(Number(ev.data.value.value));
}
if (minted.length !== 3) throw new Error(`pilot mint setup failed: ${minted}`);
console.log(`zombie-wabbits real mint produced ids ${minted.join(", ")} (giveaway ids 1, 2, 44, 45 minted at deploy)`);
pub(ZW, 'transfer', [Cl.uint(1), Cl.principal(D), Cl.principal(holder)], D);
pub(ZW, 'transfer', [Cl.uint(2), Cl.principal(D), Cl.principal(W(5))], D);
const [m1, m2, m3] = minted; // real mint order gives 43, 3, 42; m1, m2 -> holder (W1); m3 -> W4

scenario('T01', 'Canonical lifecycle: admin-only, validated, count-checked, one-way', '7.4');
{
  const n = seed([canonEntry(1)], stranger);
  check('non-admin cannot seed', !isOk(n) && code(n) === '204', code(n));
  const z = seed([Cl.tuple({ id: Cl.uint(9), 'content-hash': Cl.buffer(Buffer.alloc(32)), mime: Cl.stringAscii('image/png'), 'total-size': Cl.uint(0), 'token-uri': Cl.stringAscii('x') })]);
  check('zero-size entry rejected', !isOk(z) && code(z) === '215', code(z));
  const big = seed([Cl.tuple({ id: Cl.uint(9), 'content-hash': Cl.buffer(Buffer.alloc(32)), mime: Cl.stringAscii('image/png'), 'total-size': Cl.uint(524289), 'token-uri': Cl.stringAscii('x') })]);
  check('entry above the 512 KiB single-tx ceiling rejected', !isOk(big) && code(big) === '215', code(big));
  const ok1 = seed([1, 2, 44, 45, m1, m2, m3].map((i) => canonEntry(i)));
  check('batch seed accepted, count = 7', isOk(ok1) && okUint(ok1) === 7, JSON.stringify(val(ok1)));
  const again = seed([canonEntry(1)]);
  check('re-seeding an existing id before finalisation does not inflate the count', isOk(again) && okUint(again) === 7);
}

scenario('T02', 'Nobody can inscribe before finalisation', '7.4 G3');
{
  const r = inscribe(1);
  check('inscribe rejected with ERR-NOT-FINALIZED (u208)', !isOk(r) && code(r) === '208', code(r));
  const bad = pub(H, 'finalize-canonical', [Cl.buffer(Buffer.alloc(32, 1)), Cl.uint(6)], D);
  check('finalise with wrong expected count rejected (u209)', !isOk(bad) && code(bad) === '209', code(bad));
  const manifest = Buffer.alloc(32, 0xab);
  check('finalise with correct count accepted', isOk(pub(H, 'finalize-canonical', [Cl.buffer(manifest), Cl.uint(7)], D)));
  const after = seed([canonEntry(3)]);
  check('seeding after finalisation rejected (u207)', !isOk(after) && code(after) === '207', code(after));
  const iface = val(ro(H, 'get-twin-interface', [])).value ?? val(ro(H, 'get-twin-interface', []));
  check('interface reports finalised + manifest hash', JSON.stringify(iface).includes('ab'.repeat(32)) && JSON.stringify(iface['canonical-finalized']).includes('true'));
}

scenario('T03', 'Third-party funding: sponsor supplies chunks only; canonical record fixes mime, size, URI', '7.5 G2 G4');
{
  const r = inscribe(1);
  check('sponsor inscribes a token held by someone else', isOk(r), code(r));
  const x = xidOf(1);
  check('twin minted into helper custody; original untouched', own(CORE, x) === H && own(ZW, 1) === holder);
  const meta = JSON.stringify(val(ro(CORE, 'get-inscription-meta', [Cl.uint(x)])));
  const uri = JSON.stringify(val(ro(CORE, 'get-token-uri-raw', [Cl.uint(x)])));
  check('twin mime = canonical mime', meta.includes('image/png'));
  check('twin token-uri = canonical token-uri', uri.includes('/ft/zombie-wabbits/1.json'), uri);
  check('binding records sponsor as inscriber only', binding(1).value.inscriber.value === sponsor);
  check('reverse lookup twin -> original', JSON.stringify(val(ro(H, 'get-original-by-twin', [Cl.uint(x)]))).includes('"value":"1"'));
  const abi = s.getContractsInterfaces().get(H).functions.find((f) => f.name === 'inscribe');
  check('inscribe ABI takes only token-id and chunks', abi.args.map((a) => a.name).join(',') === 'token-id,chunks', abi.args.map((a) => a.name).join(','));
}

scenario('T04', 'Inscription guards', '7.5');
{
  const sameLen = Buffer.from(media[2]); sameLen[sameLen.length - 8] ^= 0x01; // one flipped bit
  const wrong = inscribe(2, sponsor, sameLen);
  check('same-length wrong bytes rejected by core hash check (u103), no binding', !isOk(wrong) && code(wrong) === '103' && binding(2) === null, code(wrong));
  const wrongLen = inscribe(2, sponsor, art('not the wabbit at all'));
  check('wrong-length bytes rejected by core shape check (u102), no binding', !isOk(wrongLen) && code(wrongLen) === '102' && binding(2) === null, code(wrongLen));
  check('correct bytes then succeed', isOk(inscribe(2)));
  const dup = inscribe(2);
  check('second inscription of the same original rejected (u201)', !isOk(dup) && code(dup) === '201', code(dup));
  const nc = pub(H, 'inscribe', [Cl.uint(40), Cl.list([Cl.buffer(art('x'))])], sponsor); // 40: not minted, not canonical
  check('id without a canonical record rejected (u206)', !isOk(nc) && code(nc) === '206', code(nc));
  note('Open-supply collections: IDs minted after finalisation have no canonical record and cannot be twinned by this instance. Spec 7.4 / D4.');
}

scenario('T05', 'Swaps: holder only, both directions, redemption follows the circulating twin', '7.5 G4 G5');
{
  const x = xidOf(1);
  const sp = pub(H, 'swap-original-for-twin', [Cl.uint(1)], sponsor);
  check('sponsor cannot take the twin', !isOk(sp), code(sp));
  check('holder deposits original, receives twin', isOk(pub(H, 'swap-original-for-twin', [Cl.uint(1)], holder)));
  check('custody state consistent after deposit', JSON.stringify(custody(1)).includes('"consistent":{"type":"bool","value":true}'));
  const ws = pub(H, 'swap-original-for-twin', [Cl.uint(1)], holder);
  check('repeat deposit is ERR-WRONG-STATE (u203)', !isOk(ws) && code(ws) === '203', code(ws));
  check('twin resold to buyer', isOk(pub(CORE, 'transfer', [Cl.uint(x), Cl.principal(holder), Cl.principal(buyer)], holder)));
  const old = pub(H, 'swap-twin-for-original', [Cl.uint(1)], holder);
  check('previous holder cannot redeem', !isOk(old), code(old));
  check('buyer redeems the original', isOk(pub(H, 'swap-twin-for-original', [Cl.uint(1)], buyer)) && own(ZW, 1) === buyer && own(CORE, x) === H);
  check('custody consistent after redemption', JSON.stringify(custody(1)).includes('"consistent":{"type":"bool","value":true}'));
}

scenario('T06', 'Admin pause stops new inscriptions only; swaps stay open', '7.7 G6');
{
  check('admin pauses inscriptions', isOk(pub(H, 'set-inscribe-paused', [Cl.bool(true)], D)));
  const p = inscribe(44);
  check('inscribe rejected while paused (u211)', !isOk(p) && code(p) === '211', code(p));
  check('swap still works while paused', isOk(pub(H, 'swap-original-for-twin', [Cl.uint(2)], W(5))));
  check('redeem still works while paused', isOk(pub(H, 'swap-twin-for-original', [Cl.uint(2)], W(5))));
  pub(H, 'set-inscribe-paused', [Cl.bool(false)], D);
}

scenario('T07', 'Fees: bounded by MAX-FEE, charged to the payer, free tier respected', '7.7');
{
  const over = pub(H, 'set-fee', [Cl.uint(5000001)], D);
  check('fee above deploy-time ceiling rejected (u214)', !isOk(over) && code(over) === '214', code(over));
  pub(H, 'set-fee', [Cl.uint(2000000)], D); pub(H, 'set-fee-recipient', [Cl.principal(feeTo)], D);
  const before = s.getAssetsMap().get('STX').get(feeTo);
  check('fee applies (free threshold 0)', isOk(inscribe(44)));
  const after = s.getAssetsMap().get('STX').get(feeTo);
  check('fee recipient received exactly 2 STX', after - before === 2000000n, `${after - before}`);
  pub(H, 'set-fee', [Cl.uint(0)], D);
}

scenario('T08', 'Stray original: detected, swaps fail safely, time-locked rescue restores the pair', '7.6 D2');
{
  const x = xidOf(44);
  // 44 is still held by the deployer (giveaway). The deployer sends it straight to the helper by mistake.
  check('manual transfer of original to helper succeeds at source', isOk(pub(ZW, 'transfer', [Cl.uint(44), Cl.principal(D), Cl.principal(H)], D)));
  const cs = JSON.stringify(custody(44));
  check('custody state reports stranded and inconsistent', cs.includes('"stranded":{"type":"bool","value":true}') && cs.includes('"consistent":{"type":"bool","value":false}'));
  check('stray-side = original', JSON.stringify(val(ro(H, 'stray-side', [Cl.uint(44)]))).includes('original'));
  const nonAdmin = pub(H, 'propose-rescue', [Cl.uint(44), Cl.principal(stranger)], stranger);
  check('non-admin cannot propose rescue (u204)', !isOk(nonAdmin) && code(nonAdmin) === '204', code(nonAdmin));
  check('admin proposes rescue to the sender', isOk(pub(H, 'propose-rescue', [Cl.uint(44), Cl.principal(D)], D)));
  const early = pub(H, 'execute-rescue', [Cl.uint(44)], D);
  check('execution before the Bitcoin-block delay rejected (u213)', !isOk(early) && code(early) === '213', code(early));
  s.mineEmptyBurnBlocks(6);
  check('execution after the delay returns the original', isOk(pub(H, 'execute-rescue', [Cl.uint(44)], D)) && own(ZW, 44) === D);
  check('pair consistent again; twin still escrowed', own(CORE, x) === H && JSON.stringify(custody(44)).includes('"consistent":{"type":"bool","value":true}'));
}

scenario('T09', 'Stray twin: rescue returns only the stray side', '7.6');
{
  const x = xidOf(2);
  pub(H, 'swap-original-for-twin', [Cl.uint(2)], W(5));
  check('holder manually sends twin back to helper', isOk(pub(CORE, 'transfer', [Cl.uint(x), Cl.principal(W(5)), Cl.principal(H)], W(5))));
  check('stray-side = twin', JSON.stringify(val(ro(H, 'stray-side', [Cl.uint(2)]))).includes('twin'));
  pub(H, 'propose-rescue', [Cl.uint(2), Cl.principal(W(5))], D); s.mineEmptyBurnBlocks(6);
  check('rescue returns the twin, original stays escrowed', isOk(pub(H, 'execute-rescue', [Cl.uint(2)], D)) && own(CORE, x) === W(5) && own(ZW, 2) === H);
}

scenario('T10', 'Unbound original sent to helper: cannot be inscribed; rescuable', '7.5 7.6');
{
  check('holder sends un-inscribed original directly', isOk(pub(ZW, 'transfer', [Cl.uint(m1), Cl.principal(holder), Cl.principal(H)], holder)));
  const r = inscribe(m1);
  check('inscription refused: would be born stranded (u210)', !isOk(r) && code(r) === '210', code(r));
  pub(H, 'propose-rescue', [Cl.uint(m1), Cl.principal(holder)], D); s.mineEmptyBurnBlocks(6);
  check('rescue returns it', isOk(pub(H, 'execute-rescue', [Cl.uint(m1)], D)) && own(ZW, m1) === holder);
}

scenario('T11', 'Rescue cannot touch a healthy pair', '7.6 G6');
{
  const r = pub(H, 'propose-rescue', [Cl.uint(1), Cl.principal(D)], D);
  check('no rescue when nothing is stray (u212)', !isOk(r) && code(r) === '212', code(r));
  const src = readFileSync(join(ROOT, 'contracts/rendered/ft2-zombie-wabbits.clar'), 'utf8');
  const callers = [...src.matchAll(/\(define-public \(([a-z-]+)[\s\S]*?(?=\n\(define-|\n;; =+|$)/g)]
    .filter((m) => /release-(twin|original)-to/.test(m[0])).map((m) => m[1]).sort();
  check('only swaps and execute-rescue can release a held token', callers.join(',') === 'execute-rescue,swap-original-for-twin,swap-twin-for-original', callers.join(','));
}

scenario('T12', 'Discovery interface and v1-compatible binding shape', '7.3');
{
  const iface = JSON.stringify(val(ro(H, 'get-twin-interface', [])));
  for (const k of ['interface-version', 'collection-key', 'master', 'source', 'source-asset', 'route', 'canonical-finalized', 'manifest-hash', 'swaps-enabled', 'rescue-delay'])
    check(`interface exposes ${k}`, iface.includes(`"${k}"`));
  const keys = Object.keys(binding(1).value).sort().join(',');
  check('get-binding tuple keys identical to v1 (resolver compatible)', keys === 'at,content-hash,inscriber,xtrata-escrowed,xtrata-id', keys);
}

scenario('T13', 'Renderer refuses non-standard sources', '7.2');
{
  let refused = false;
  try { render({ profileTier: 'C', collectionKey: 'thisisnumberone-v2' }); } catch { refused = true; }
  check('tier C (custom review) cannot be rendered with the standard template', refused);
}

// ---- Gamma-template source ---------------------------------------------------------
const G = C('gamma-bitcoin-pepe'), HG = C('ft2-gamma-pepe'), COMM = C('mock-commission');
scenario('T20', 'Gamma template: listing blocks deposit; round trip; rescue disabled by config', '7.2 7.6');
{
  pub(G, 'simnet-mint', [Cl.uint(7), Cl.principal(holder)], D);
  const b = art('gamma 7');
  pub(HG, 'seed-canonical', [Cl.list([Cl.tuple({ id: Cl.uint(7), 'content-hash': Cl.buffer(xtrataHash([b])), mime: Cl.stringAscii('image/png'), 'total-size': Cl.uint(b.length), 'token-uri': Cl.stringAscii('https://xtrata.xyz/ft/pepe/7.json') })])], D);
  pub(HG, 'finalize-canonical', [Cl.buffer(Buffer.alloc(32, 7)), Cl.uint(1)], D);
  check('inscribe', isOk(pub(HG, 'inscribe', [Cl.uint(7), Cl.list([Cl.buffer(b)])], sponsor)));
  pub(G, 'list-in-ustx', [Cl.uint(7), Cl.uint(100), Cl.principal(COMM)], holder);
  const d = pub(HG, 'swap-original-for-twin', [Cl.uint(7)], holder);
  check('listed original rejected by source (u106)', !isOk(d) && code(d) === '106', code(d));
  pub(G, 'unlist-in-ustx', [Cl.uint(7)], holder);
  check('deposit after unlisting', isOk(pub(HG, 'swap-original-for-twin', [Cl.uint(7)], holder)));
  check('redeem', isOk(pub(HG, 'swap-twin-for-original', [Cl.uint(7)], holder)) && own(G, 7) === holder);
  pub(G, 'transfer', [Cl.uint(7), Cl.principal(holder), Cl.principal(HG)], holder);
  const r = pub(HG, 'propose-rescue', [Cl.uint(7), Cl.principal(holder)], D);
  check('instance rendered with rescueEnabled=false refuses rescue (u216)', !isOk(r) && code(r) === '216', code(r));
  note('With rescue disabled, a stray deposit is permanent: decision D2 in the spec.');
}

R.finish('acceptance-v2.json');
