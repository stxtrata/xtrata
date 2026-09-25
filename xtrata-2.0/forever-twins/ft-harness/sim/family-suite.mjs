// G1 / G2 template family suite (FT-SPEC-2 + Forever-Twins-Collection-Families.md).
// Runs the SAME checks against every prepared real source, adds listing checks
// for G2, and proves the G2 listing guard against a deliberately unsafe source.
//
//  F-1  third-party sponsor inscribes; twin carries the canonical mime + URI
//  F-2  holder swaps in; custody consistent; repeat deposit is WRONG-STATE
//  F-3  a stranger cannot swap somebody else's original
//  F-4  twin resale: old holder cannot redeem, new holder can
//  F-5  former holder cannot move or burn the held original through the source
//  F-6  stray original sent straight to the helper: detected, rescued after delay
//  F-L1 (G2) a listed original is refused by the helper guard (u217)
//  F-L2 (G2) nobody can list or buy a held original; source reports no listing
//  F-L4 G1 vs G2 on an unsafe listing source: G1 is drained, G2 refuses
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { boot, Cl, val, isOk, errCode, xtrataHash, makeRunner, ownerOf, ROOT } from './lib.mjs';

const { s, D, W, C, CORE } = await boot();
const R = makeRunner('family-suite');
const { scenario, check } = R;
const pub = (c, f, a, who) => s.callPublicFn(c, f, a, who);
const ro = (c, f, a) => s.callReadOnlyFn(c, f, a, D);
const own = (c, id) => ownerOf(s, D, c, id);
const code = (r) => String(errCode(r));
const COMM = C('mock-commission');
const ifaces = s.getContractsInterfaces();
const hasFn = (c, f) => ifaces.get(c).functions.some((x) => x.name === f);
const consistent = (h, id) => JSON.stringify(val(ro(h, 'get-custody-state', [Cl.uint(id)]))).includes('"consistent":{"type":"bool","value":true}');
const stranded = (h, id) => JSON.stringify(val(ro(h, 'get-custody-state', [Cl.uint(id)]))).includes('"stranded":{"type":"bool","value":true}');

const cfg = JSON.parse(readFileSync(join(ROOT, 'scripts/legacy-sources.json'), 'utf8')).sources;
const sources = [
  { name: 'zombie-wabbits', group: 'G1', family: 'stacksart', mint: 'public-mint' },
  ...cfg.filter((x) => x.family === 'stacksart'),
  { name: 'gamma-bitcoin-pepe', helper: 'ft2-gamma-pepe', group: 'G2', family: 'gamma', mint: 'appended' },
  ...cfg.filter((x) => x.family !== 'stacksart'),
];

let megapontMintSet = false;
const giftEnabled = new Set();
function mintTo(src, kind, to, preferredId) {
  let r;
  if (kind === 'public-mint') r = pub(src, 'mint', [], to);
  else if (kind === 'appended') r = pub(src, 'simnet-mint', [Cl.uint(preferredId), Cl.principal(to)], D);
  else if (kind === 'owner-mint') r = pub(src, 'mint', [Cl.principal(to)], D);
  else if (kind === 'claim') r = pub(src, 'claim', [], to);
  else if (kind === 'gift') {
    if (!giftEnabled.has(src)) { pub(src, 'set-minting-enabled', [Cl.bool(true)], D); giftEnabled.add(src); }
    r = pub(src, 'gift', [Cl.principal(to)], D);
  }
  else if (kind === 'owner-mint-via-mint-address') {
    if (!megapontMintSet) { pub(src, 'set-mint-address', [], D); megapontMintSet = true; }
    r = pub(src, 'mint', [Cl.principal(to)], D);
  }
  if (!isOk(r)) throw new Error(`${src}: mint failed ${code(r)}`);
  const ev = r.events.find((e) => e.event === 'nft_mint_event');
  return Number(ev.data.value.value);
}

const holder = W(1), holder2 = W(2), sponsor = W(3), buyer = W(4), stranger = W(5);

for (const src of sources) {
  const SRC = C(src.name), H = C(src.helper ?? `ft2-${src.name}`), g2 = src.group === 'G2';
  const tag = `${src.name} [${src.group}/${src.family}]`;
  const A = mintTo(SRC, src.mint, holder, 1001), B = mintTo(SRC, src.mint, holder2, 1002);
  const media = { [A]: Buffer.from(`<svg>${src.name} ${A}</svg>`), [B]: Buffer.from(`<svg>${src.name} ${B}</svg>`) };
  pub(H, 'seed-canonical', [Cl.list([A, B].map((i) => Cl.tuple({ id: Cl.uint(i), 'content-hash': Cl.buffer(xtrataHash([media[i]])),
    mime: Cl.stringAscii('image/svg+xml'), 'total-size': Cl.uint(media[i].length), 'token-uri': Cl.stringAscii(`https://xtrata.xyz/ft/${src.name}/${i}.json`) })))], D);
  pub(H, 'finalize-canonical', [Cl.buffer(Buffer.alloc(32, 7)), Cl.uint(2)], D);
  const xidOf = (id) => Number(val(ro(H, 'get-binding', [Cl.uint(id)])).value['xtrata-id'].value);

  scenario(`${src.name}:F-1`, `${tag} sponsor inscribes; canonical metadata on twin`, 'F-1');
  check('sponsor inscribes A and B (held by others)', isOk(pub(H, 'inscribe', [Cl.uint(A), Cl.list([Cl.buffer(media[A])])], sponsor)) && isOk(pub(H, 'inscribe', [Cl.uint(B), Cl.list([Cl.buffer(media[B])])], sponsor)));
  const xA = xidOf(A), xB = xidOf(B);
  check('twins in helper custody; originals untouched', own(CORE, xA) === H && own(CORE, xB) === H && own(SRC, A) === holder && own(SRC, B) === holder2);
  check('twin URI is the canonical URI', JSON.stringify(val(ro(CORE, 'get-token-uri-raw', [Cl.uint(xA)]))).includes(`/ft/${src.name}/${A}.json`));
  check(`interface reports group ${src.group}`, JSON.stringify(val(ro(H, 'get-twin-interface', []))).includes(`"group":{"type":"(string-ascii 2)","value":"${src.group}"}`));

  if (g2) {
    scenario(`${src.name}:F-L1`, `${tag} listed original refused by helper guard`, 'F-L1');
    check('holder lists A on the source market', isOk(pub(SRC, 'list-in-ustx', [Cl.uint(A), Cl.uint(5000), Cl.principal(COMM)], holder)));
    check('helper reports A as listed', JSON.stringify(val(ro(H, 'is-source-listed', [Cl.uint(A)]))).includes('true'));
    const r = pub(H, 'swap-original-for-twin', [Cl.uint(A)], holder);
    check('deposit refused by the G2 guard (u217) before the source is touched', !isOk(r) && code(r) === '217', code(r));
    check('holder unlists', isOk(pub(SRC, 'unlist-in-ustx', [Cl.uint(A)], holder)));
  }

  scenario(`${src.name}:F-2`, `${tag} holder swaps in`, 'F-2');
  check('holder swaps A in, receives twin', isOk(pub(H, 'swap-original-for-twin', [Cl.uint(A)], holder)) && own(SRC, A) === H && own(CORE, xA) === holder);
  check('custody consistent', consistent(H, A));
  const again = pub(H, 'swap-original-for-twin', [Cl.uint(A)], holder);
  check('repeat deposit is WRONG-STATE (u203)', !isOk(again) && code(again) === '203', code(again));

  scenario(`${src.name}:F-5`, `${tag} held original cannot be moved through the source`, 'F-5');
  const mv = pub(SRC, 'transfer', [Cl.uint(A), Cl.principal(H), Cl.principal(holder)], holder);
  check('former holder cannot transfer it out', !isOk(mv) && own(SRC, A) === H, code(mv));
  if (hasFn(SRC, 'burn')) { const b = pub(SRC, 'burn', [Cl.uint(A)], holder); check('former holder cannot burn it', !isOk(b) && own(SRC, A) === H, code(b)); }

  if (g2) {
    scenario(`${src.name}:F-L2`, `${tag} no listing can exist on a held original`, 'F-L2');
    const l1 = pub(SRC, 'list-in-ustx', [Cl.uint(A), Cl.uint(1), Cl.principal(COMM)], stranger);
    const l2 = pub(SRC, 'list-in-ustx', [Cl.uint(A), Cl.uint(1), Cl.principal(COMM)], holder);
    check('stranger cannot list it', !isOk(l1), code(l1));
    check('former holder cannot list it', !isOk(l2), code(l2));
    const by = pub(SRC, 'buy-in-ustx', [Cl.uint(A), Cl.principal(COMM)], stranger);
    check('nobody can buy it', !isOk(by) && own(SRC, A) === H, code(by));
    check('helper reports no listing', JSON.stringify(val(ro(H, 'is-source-listed', [Cl.uint(A)]))).includes('false'));
  }

  scenario(`${src.name}:F-3`, `${tag} stranger cannot swap another holder's original`, 'F-3');
  const st = pub(H, 'swap-original-for-twin', [Cl.uint(B)], stranger);
  check('swap by non-owner fails; B stays with its holder', !isOk(st) && own(SRC, B) === holder2, code(st));

  scenario(`${src.name}:F-4`, `${tag} twin resale then redemption`, 'F-4');
  check('holder sells the twin', isOk(pub(CORE, 'transfer', [Cl.uint(xA), Cl.principal(holder), Cl.principal(buyer)], holder)));
  const old = pub(H, 'swap-twin-for-original', [Cl.uint(A)], holder);
  check('old holder cannot redeem', !isOk(old), code(old));
  check('buyer redeems the original', isOk(pub(H, 'swap-twin-for-original', [Cl.uint(A)], buyer)) && own(SRC, A) === buyer && own(CORE, xA) === H);
  check('custody consistent after redemption', consistent(H, A));

  scenario(`${src.name}:F-6`, `${tag} stray original rescued after delay`, 'F-6');
  check('holder2 sends B straight to the helper by mistake', isOk(pub(SRC, 'transfer', [Cl.uint(B), Cl.principal(holder2), Cl.principal(H)], holder2)));
  check('custody state reports stranded', stranded(H, B));
  const iface = val(ro(H, 'get-twin-interface', []));
  const rescueOn = iface['rescue-enabled'].value === true, delay = Number(iface['rescue-delay'].value);
  if (!rescueOn) {
    const p = pub(H, 'propose-rescue', [Cl.uint(B), Cl.principal(holder2)], D);
    check('instance rendered with rescue disabled refuses (u216); stray is permanent (decision D2)', !isOk(p) && code(p) === '216' && stranded(H, B), code(p));
  } else {
    check('admin proposes rescue to the sender', isOk(pub(H, 'propose-rescue', [Cl.uint(B), Cl.principal(holder2)], D)));
    const early = pub(H, 'execute-rescue', [Cl.uint(B)], D);
    check(`too early: TIMELOCK (u213) before ${delay} Bitcoin blocks`, !isOk(early) && code(early) === '213', code(early));
    s.mineEmptyBurnBlocks(delay);
    check('rescue returns B; pair consistent again', isOk(pub(H, 'execute-rescue', [Cl.uint(B)], D)) && own(SRC, B) === holder2 && own(CORE, xB) === H && consistent(H, B));
    check('normal swap works afterwards', isOk(pub(H, 'swap-original-for-twin', [Cl.uint(B)], holder2)) && own(CORE, xB) === holder2);
  }
}

// ---- F-L4: why G2 needs its guard -------------------------------------------------
const LK = C('mock-leaky-market');
for (const [grp, helper, id] of [['G1', 'ft2-leaky-g1', 1], ['G2', 'ft2-leaky-g2', 2]]) {
  const H = C(helper);
  pub(LK, 'simnet-mint', [Cl.uint(id), Cl.principal(holder)], D);
  const m = Buffer.from(`<svg>leaky ${id}</svg>`);
  pub(H, 'seed-canonical', [Cl.list([Cl.tuple({ id: Cl.uint(id), 'content-hash': Cl.buffer(xtrataHash([m])), mime: Cl.stringAscii('image/svg+xml'), 'total-size': Cl.uint(m.length), 'token-uri': Cl.stringAscii('https://xtrata.xyz/ft/leaky.json') })])], D);
  pub(H, 'finalize-canonical', [Cl.buffer(Buffer.alloc(32, 9)), Cl.uint(1)], D);
  pub(H, 'inscribe', [Cl.uint(id), Cl.list([Cl.buffer(m)])], sponsor);
  const x = Number(val(ro(H, 'get-binding', [Cl.uint(id)])).value['xtrata-id'].value);
  scenario(`leaky:F-L4-${grp}`, `unsafe listing source with the ${grp} helper`, 'F-L4');
  check('holder lists the original at 1 uSTX, then tries to swap', isOk(pub(LK, 'list-in-ustx', [Cl.uint(id), Cl.uint(1)], holder)));
  const sw = pub(H, 'swap-original-for-twin', [Cl.uint(id)], holder);
  if (grp === 'G1') {
    check('G1 accepts the deposit (it cannot see listings)', isOk(sw));
    const buy = pub(LK, 'buy-in-ustx', [Cl.uint(id)], stranger);
    check('a buyer drains the original out of the G1 helper; twin now unbacked', isOk(buy) && own(LK, id) === stranger && own(CORE, x) === holder);
  } else {
    check('G2 refuses the deposit (u217)', !isOk(sw) && code(sw) === '217', code(sw));
    check('after unlisting, deposit succeeds', isOk(pub(LK, 'unlist-in-ustx', [Cl.uint(id)], holder)) && isOk(pub(H, 'swap-original-for-twin', [Cl.uint(id)], holder)));
    const buy = pub(LK, 'buy-in-ustx', [Cl.uint(id)], stranger);
    check('nothing can be bought from the G2 helper', !isOk(buy) && own(LK, id) === H, code(buy));
  }
}

R.finish('family-suite.json');
