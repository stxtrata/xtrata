// v3 template suite: fixed 50/50 fee split, owner-set even+capped fee, two-step
// ownership, no pause. Runs the G1/G2 family checks (F-*) against every prepared
// real source with a v3 helper, then the v3-specific checks (V3-*).
//
//  F-1  forged or wrong-length chunks refused by the core (u103/u102); sponsor inscribes; twin carries the canonical URI; fee split 50/50
//  F-2  holder swaps in; custody consistent; swap charges no fee; repeat is u203
//  F-3  a stranger cannot swap somebody else's original
//  F-4  twin resale: old holder cannot redeem, new holder can
//  F-5  former holder cannot move or burn the held original through the source
//  F-6  stray original rescued after the delay
//  F-L1 (G2) listed original refused (u217)     F-L2 (G2) no listing on a held original
//  F-L4 G1 vs G2 helper on an unsafe listing source
//  V3-1 payee inscribing pays only the other payee's half; fee-for matches exactly
//  V3-2 set-fee: owner only (u204), even only (u218), capped (u214); new fee split 50/50; zero fee
//  V3-3 two-step ownership: propose, wrong acceptor refused, accept, old owner powerless
//  V3-4 ownership proposal can be cancelled; nothing to accept afterwards (u219)
//  V3-5 record is locked after finalisation (u207)
//  V3-6 removed surface: no pause, free threshold, fee recipient, payee setter or one-step transfer
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Cl, cvToJSON } from '@stacks/transactions';
import { boot, xtrataHash, makeRunner, ROOT } from './lib.mjs';

const { s, D, W, C, CORE } = await boot();
const R = makeRunner('family-suite-v3');
const { scenario, check } = R;
const [PA, PB] = JSON.parse(readFileSync(join(ROOT, 'scripts/simnet-payees.json'), 'utf8'));
const FEE = 1000000, HALF = FEE / 2;

// local helpers (independent of the shape of lib.mjs's own helpers)
const pub = (c, f, a, who) => s.callPublicFn(c, f, a, who);
const ro = (c, f, a) => s.callReadOnlyFn(c, f, a, D);
const isOk = (r) => r.result.type === 'ok';
const code = (r) => (r.result.type === 'err' ? String(r.result.value.value) : 'ok');
const json = (r) => cvToJSON(r.result);
const principalOf = (cv) => (cv && cv.type === 'some' ? cv.value.value : null);
const own = (c, id) => principalOf(ro(c, 'get-owner', [Cl.uint(id)]).result.value);
const ifaces = s.getContractsInterfaces();
const deployed = (c) => ifaces.has(c);
const hasFn = (c, f) => ifaces.get(c).functions.some((x) => x.name === f);
const custody = (h, id) => JSON.stringify(json(ro(h, 'get-custody-state', [Cl.uint(id)])));
const consistent = (h, id) => custody(h, id).includes('"consistent":{"type":"bool","value":true}');
const stranded = (h, id) => custody(h, id).includes('"stranded":{"type":"bool","value":true}');
const iface = (h) => json(ro(h, 'get-twin-interface', [])).value;
const xidOf = (h, id) => Number(json(ro(h, 'get-binding', [Cl.uint(id)])).value.value['xtrata-id'].value);
const feeFor = (h, who) => Number(ro(h, 'fee-for', [Cl.principal(who)]).result.value);
// STX paid to each payee by one transaction
const paidTo = (r, who) => r.events.filter((e) => e.event === 'stx_transfer_event' && e.data.recipient === who)
  .reduce((n, e) => n + Number(e.data.amount), 0);
const stxEvents = (r) => r.events.filter((e) => e.event === 'stx_transfer_event').length;

const cfg = JSON.parse(readFileSync(join(ROOT, 'scripts/legacy-sources.json'), 'utf8')).sources;
const sources = [
  { name: 'zombie-wabbits', group: 'G1', family: 'stacksart', mint: 'public-mint' },
  ...cfg.filter((x) => x.family === 'stacksart'),
  { name: 'gamma-bitcoin-pepe', helper: 'ft3-gamma-pepe', group: 'G2', family: 'gamma', mint: 'appended' },
  ...cfg.filter((x) => x.family !== 'stacksart'),
].filter((x) => deployed(C(x.name)) && deployed(C(x.helper ?? `ft3-${x.name}`)));

let megapontMintSet = false, nextAppended = 3001;
const giftEnabled = new Set();
function mintTo(src, kind, to) {
  let r;
  if (kind === 'public-mint') r = pub(src, 'mint', [], to);
  else if (kind === 'appended') r = pub(src, 'simnet-mint', [Cl.uint(nextAppended++), Cl.principal(to)], D);
  else if (kind === 'owner-mint') r = pub(src, 'mint', [Cl.principal(to)], D);
  else if (kind === 'gift') {
    if (!giftEnabled.has(src)) { pub(src, 'set-minting-enabled', [Cl.bool(true)], D); giftEnabled.add(src); }
    r = pub(src, 'gift', [Cl.principal(to)], D);
  }
  else if (kind === 'owner-mint-via-mint-address') {
    if (!megapontMintSet) { pub(src, 'set-mint-address', [], D); megapontMintSet = true; }
    r = pub(src, 'mint', [Cl.principal(to)], D);
  }
  if (!isOk(r)) throw new Error(`${src}: mint failed ${code(r)}`);
  return Number(r.events.find((e) => e.event === 'nft_mint_event').data.value.value);
}
const mediaFor = (name, id) => Buffer.from(`<svg>${name} ${id}</svg>`);
const entry = (name, id) => Cl.tuple({ id: Cl.uint(id), 'content-hash': Cl.buffer(xtrataHash([mediaFor(name, id)])),
  mime: Cl.stringAscii('image/svg+xml'), 'total-size': Cl.uint(mediaFor(name, id).length),
  'token-uri': Cl.stringAscii(`https://xtrata.xyz/ft/${name}/${id}.json`) });
const inscribe = (h, name, id, who) => pub(h, 'inscribe', [Cl.uint(id), Cl.list([Cl.buffer(mediaFor(name, id))])], who);

const holder = W(1), holder2 = W(2), sponsor = W(3), buyer = W(4), stranger = W(5), heir = W(6);
const COMM = C('mock-commission');

// ---- family checks on every source -------------------------------------------------
const reserved = {}; // extra tokens per source for the V3 checks
for (const src of sources) {
  const SRC = C(src.name), H = C(src.helper ?? `ft3-${src.name}`), g2 = src.group === 'G2';
  const tag = `${src.name} [v3 ${src.group}/${src.family}]`;
  const A = mintTo(SRC, src.mint, holder), B = mintTo(SRC, src.mint, holder2);
  const extra = [mintTo(SRC, src.mint, holder), mintTo(SRC, src.mint, holder), mintTo(SRC, src.mint, holder), mintTo(SRC, src.mint, holder)];
  reserved[src.name] = { SRC, H, extra };
  pub(H, 'seed-canonical', [Cl.list([A, B, ...extra].map((i) => entry(src.name, i)))], D);
  pub(H, 'finalize-canonical', [Cl.buffer(Buffer.alloc(32, 7)), Cl.uint(6)], D);

  scenario(`${src.name}:F-1`, `${tag} sponsor inscribes; canonical URI; fee split 50/50`, 'F-1');
  check(`fee-for(sponsor) quotes the full fee (${FEE})`, feeFor(H, sponsor) === FEE, feeFor(H, sponsor));
  // core hash check through the v3 helper: the sponsor supplies only the chunks
  const good = mediaFor(src.name, A), forged = Buffer.from(good); forged[forged.length - 2] ^= 1;
  const rF = pub(H, 'inscribe', [Cl.uint(A), Cl.list([Cl.buffer(forged)])], sponsor);
  check('same-length wrong bytes refused by the core hash check (u103); no binding, no fee', code(rF) === '103'
    && ro(H, 'get-binding', [Cl.uint(A)]).result.type === 'none' && stxEvents(rF) === 0, code(rF));
  const rL = pub(H, 'inscribe', [Cl.uint(A), Cl.list([Cl.buffer(Buffer.concat([good, Buffer.from(' ')]))])], sponsor);
  check('wrong-length bytes refused by the core shape check (u102)', code(rL) === '102', code(rL));
  const rA = inscribe(H, src.name, A, sponsor), rB = inscribe(H, src.name, B, sponsor);
  check('sponsor inscribes A and B (held by others)', isOk(rA) && isOk(rB), `${code(rA)} ${code(rB)}`);
  check(`each payee receives exactly ${HALF} per inscription`, paidTo(rA, PA) === HALF && paidTo(rA, PB) === HALF && paidTo(rB, PA) === HALF && paidTo(rB, PB) === HALF,
    `${paidTo(rA, PA)}/${paidTo(rA, PB)}`);
  const xA = xidOf(H, A), xB = xidOf(H, B);
  check('twins in helper custody; originals untouched', own(CORE, xA) === H && own(CORE, xB) === H && own(SRC, A) === holder && own(SRC, B) === holder2);
  check('twin URI is the canonical URI', JSON.stringify(json(ro(CORE, 'get-token-uri-raw', [Cl.uint(xA)]))).includes(`/ft/${src.name}/${A}.json`));
  const i = iface(H);
  check(`interface: v3, group ${src.group}, fee ${FEE}, both payees`, i['interface-version'].value === '3' && i.group.value === src.group
    && i.fee.value === String(FEE) && i['payee-a'].value === PA && i['payee-b'].value === PB, JSON.stringify([i['interface-version'].value, i.group.value, i.fee.value]));

  if (g2) {
    scenario(`${src.name}:F-L1`, `${tag} listed original refused by helper guard`, 'F-L1');
    check('holder lists A on the source market', isOk(pub(SRC, 'list-in-ustx', [Cl.uint(A), Cl.uint(5000), Cl.principal(COMM)], holder)));
    check('helper reports A as listed', ro(H, 'is-source-listed', [Cl.uint(A)]).result.type === 'true');
    const r = pub(H, 'swap-original-for-twin', [Cl.uint(A)], holder);
    check('deposit refused by the G2 guard (u217)', code(r) === '217', code(r));
    check('holder unlists', isOk(pub(SRC, 'unlist-in-ustx', [Cl.uint(A)], holder)));
  }

  scenario(`${src.name}:F-2`, `${tag} holder swaps in`, 'F-2');
  const sw = pub(H, 'swap-original-for-twin', [Cl.uint(A)], holder);
  check('holder swaps A in, receives twin', isOk(sw) && own(SRC, A) === H && own(CORE, xA) === holder, code(sw));
  check('swap charges no fee', stxEvents(sw) === 0, stxEvents(sw));
  check('custody consistent', consistent(H, A));
  const again = pub(H, 'swap-original-for-twin', [Cl.uint(A)], holder);
  check('repeat deposit is WRONG-STATE (u203)', code(again) === '203', code(again));

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
    check('helper reports no listing', ro(H, 'is-source-listed', [Cl.uint(A)]).result.type === 'false');
  }

  scenario(`${src.name}:F-3`, `${tag} stranger cannot swap another holder's original`, 'F-3');
  const st = pub(H, 'swap-original-for-twin', [Cl.uint(B)], stranger);
  check('swap by non-owner fails; B stays with its holder', !isOk(st) && own(SRC, B) === holder2, code(st));

  scenario(`${src.name}:F-4`, `${tag} twin resale then redemption`, 'F-4');
  check('holder sells the twin', isOk(pub(CORE, 'transfer', [Cl.uint(xA), Cl.principal(holder), Cl.principal(buyer)], holder)));
  const old = pub(H, 'swap-twin-for-original', [Cl.uint(A)], holder);
  check('old holder cannot redeem', !isOk(old), code(old));
  const red = pub(H, 'swap-twin-for-original', [Cl.uint(A)], buyer);
  check('buyer redeems the original, no fee', isOk(red) && own(SRC, A) === buyer && own(CORE, xA) === H && stxEvents(red) === 0, code(red));
  check('custody consistent after redemption', consistent(H, A));

  scenario(`${src.name}:F-6`, `${tag} stray original rescued after delay`, 'F-6');
  check('holder2 sends B straight to the helper by mistake', isOk(pub(SRC, 'transfer', [Cl.uint(B), Cl.principal(holder2), Cl.principal(H)], holder2)));
  check('custody state reports stranded', stranded(H, B));
  const delay = Number(iface(H)['rescue-delay'].value);
  const nonOwner = pub(H, 'propose-rescue', [Cl.uint(B), Cl.principal(holder2)], stranger);
  check('a non-owner cannot propose a rescue (u204)', code(nonOwner) === '204', code(nonOwner));
  check('owner proposes rescue to the sender', isOk(pub(H, 'propose-rescue', [Cl.uint(B), Cl.principal(holder2)], D)));
  const early = pub(H, 'execute-rescue', [Cl.uint(B)], D);
  check(`too early: TIMELOCK (u213) before ${delay} Bitcoin blocks`, code(early) === '213', code(early));
  s.mineEmptyBurnBlocks(delay);
  check('rescue returns B; pair consistent again', isOk(pub(H, 'execute-rescue', [Cl.uint(B)], D)) && own(SRC, B) === holder2 && own(CORE, xB) === H && consistent(H, B));
  check('normal swap works afterwards', isOk(pub(H, 'swap-original-for-twin', [Cl.uint(B)], holder2)) && own(CORE, xB) === holder2);
}

// ---- F-L4: why G2 needs its guard (unchanged from v2) ----------------------------------
const LK = C('mock-leaky-market');
for (const [grp, helper, id] of [['G1', 'ft3-leaky-g1', 1], ['G2', 'ft3-leaky-g2', 2]]) {
  const H = C(helper);
  pub(LK, 'simnet-mint', [Cl.uint(id), Cl.principal(holder)], D);
  pub(H, 'seed-canonical', [Cl.list([entry('leaky', id)])], D);
  pub(H, 'finalize-canonical', [Cl.buffer(Buffer.alloc(32, 9)), Cl.uint(1)], D);
  inscribe(H, 'leaky', id, sponsor);
  const x = xidOf(H, id);
  scenario(`leaky:F-L4-${grp}`, `unsafe listing source with the v3 ${grp} helper`, 'F-L4');
  check('holder lists the original at 1 uSTX, then tries to swap', isOk(pub(LK, 'list-in-ustx', [Cl.uint(id), Cl.uint(1)], holder)));
  const sw = pub(H, 'swap-original-for-twin', [Cl.uint(id)], holder);
  if (grp === 'G1') {
    check('G1 accepts the deposit (it cannot see listings)', isOk(sw));
    const buy = pub(LK, 'buy-in-ustx', [Cl.uint(id)], stranger);
    check('a buyer drains the original out of the G1 helper; twin now unbacked', isOk(buy) && own(LK, id) === stranger && own(CORE, x) === holder);
  } else {
    check('G2 refuses the deposit (u217)', code(sw) === '217', code(sw));
    check('after unlisting, deposit succeeds', isOk(pub(LK, 'unlist-in-ustx', [Cl.uint(id)], holder)) && isOk(pub(H, 'swap-original-for-twin', [Cl.uint(id)], holder)));
    const buy = pub(LK, 'buy-in-ustx', [Cl.uint(id)], stranger);
    check('nothing can be bought from the G2 helper', !isOk(buy) && own(LK, id) === H, code(buy));
  }
}

// ---- V3 checks: run on one G1 and one G2 helper -----------------------------------------
const v3targets = [sources.find((x) => x.group === 'G1'), sources.find((x) => x.group === 'G2')].filter(Boolean);
for (const src of v3targets) {
  const { SRC, H, extra: [e1, e2, e3, e4] } = reserved[src.name];
  const tag = `${src.name} [v3 ${src.group}]`;

  scenario(`${src.name}:V3-1`, `${tag} a payee inscribing pays only the other half`, 'V3-1');
  s.transferSTX(10_000_000, PA, sponsor);
  check(`fee-for(payee A) quotes ${HALF}`, feeFor(H, PA) === HALF, feeFor(H, PA));
  const rp = inscribe(H, src.name, e1, PA);
  check('payee A can inscribe', isOk(rp), code(rp));
  check(`payee B receives ${HALF}; payee A pays itself nothing`, paidTo(rp, PB) === HALF && paidTo(rp, PA) === 0, `${paidTo(rp, PB)}/${paidTo(rp, PA)}`);

  scenario(`${src.name}:V3-2`, `${tag} fee changes: owner only, even, capped`, 'V3-2');
  const byStranger = pub(H, 'set-fee', [Cl.uint(2000000)], stranger);
  check('a non-owner cannot set the fee (u204)', code(byStranger) === '204', code(byStranger));
  const byPayee = pub(H, 'set-fee', [Cl.uint(2000000)], PB);
  check('a payee cannot set the fee either (u204)', code(byPayee) === '204', code(byPayee));
  const odd = pub(H, 'set-fee', [Cl.uint(1000001)], D);
  check('an odd fee is refused (u218), so halves are always equal', code(odd) === '218', code(odd));
  const over = pub(H, 'set-fee', [Cl.uint(5000002)], D);
  check('a fee above the cap is refused (u214)', code(over) === '214', code(over));
  check('owner sets 2 STX', isOk(pub(H, 'set-fee', [Cl.uint(2000000)], D)) && feeFor(H, sponsor) === 2000000);
  const r2 = inscribe(H, src.name, e2, sponsor);
  check('next inscription pays 1 STX to each payee', isOk(r2) && paidTo(r2, PA) === 1000000 && paidTo(r2, PB) === 1000000, `${paidTo(r2, PA)}/${paidTo(r2, PB)}`);
  check('owner can set the cap exactly', isOk(pub(H, 'set-fee', [Cl.uint(5000000)], D)));
  check('owner sets the fee to zero', isOk(pub(H, 'set-fee', [Cl.uint(0)], D)) && feeFor(H, sponsor) === 0);
  const r0 = inscribe(H, src.name, e3, sponsor);
  check('zero fee: inscription works and pays the payees nothing', isOk(r0) && paidTo(r0, PA) === 0 && paidTo(r0, PB) === 0, code(r0));
  pub(H, 'set-fee', [Cl.uint(FEE)], D);

  scenario(`${src.name}:V3-3`, `${tag} two-step ownership handover`, 'V3-3');
  const pNon = pub(H, 'propose-ownership', [Cl.principal(stranger)], stranger);
  check('a non-owner cannot propose (u204)', code(pNon) === '204', code(pNon));
  check('owner proposes the heir', isOk(pub(H, 'propose-ownership', [Cl.principal(heir)], D)));
  check('owner unchanged until accepted', iface(H).owner.value === D && JSON.stringify(iface(H)['pending-owner']).includes(heir));
  check('owner still in charge while pending', isOk(pub(H, 'set-fee', [Cl.uint(FEE)], D)));
  const wrong = pub(H, 'accept-ownership', [], stranger);
  check('someone else cannot accept (u204)', code(wrong) === '204', code(wrong));
  check('heir accepts', isOk(pub(H, 'accept-ownership', [], heir)) && iface(H).owner.value === heir && iface(H)['pending-owner'].value === null);
  const oldFee = pub(H, 'set-fee', [Cl.uint(FEE)], D);
  check('old owner can no longer set the fee (u204)', code(oldFee) === '204', code(oldFee));
  check('new owner can set the fee', isOk(pub(H, 'set-fee', [Cl.uint(FEE)], heir)));
  const payeesAfter = iface(H);
  check('payees did not change with ownership', payeesAfter['payee-a'].value === PA && payeesAfter['payee-b'].value === PB);
  const reAccept = pub(H, 'accept-ownership', [], heir);
  check('nothing left to accept (u219)', code(reAccept) === '219', code(reAccept));
  check('handed back to the deployer (two steps)', isOk(pub(H, 'propose-ownership', [Cl.principal(D)], heir)) && isOk(pub(H, 'accept-ownership', [], D)) && iface(H).owner.value === D);

  scenario(`${src.name}:V3-4`, `${tag} ownership proposal can be cancelled`, 'V3-4');
  check('owner proposes then cancels', isOk(pub(H, 'propose-ownership', [Cl.principal(heir)], D)) && isOk(pub(H, 'cancel-ownership-proposal', [], D)));
  const late = pub(H, 'accept-ownership', [], heir);
  check('cancelled proposal cannot be accepted (u219)', code(late) === '219' && iface(H).owner.value === D, code(late));
  const cancelNone = pub(H, 'cancel-ownership-proposal', [], D);
  check('cancelling with nothing pending is u219', code(cancelNone) === '219', code(cancelNone));

  scenario(`${src.name}:V3-5`, `${tag} record is locked after finalisation`, 'V3-5');
  const seedLate = pub(H, 'seed-canonical', [Cl.list([entry(src.name, 999999)])], D);
  check('owner cannot seed after finalisation (u207)', code(seedLate) === '207', code(seedLate));
  const finLate = pub(H, 'finalize-canonical', [Cl.buffer(Buffer.alloc(32, 1)), Cl.uint(6)], D);
  check('owner cannot re-finalise (u207)', code(finLate) === '207', code(finLate));
  const r4 = inscribe(H, src.name, e4, sponsor);
  check('last seeded token inscribes; nothing further can be (u201 on repeat)', isOk(r4) && code(inscribe(H, src.name, e4, sponsor)) === '201');

  scenario(`${src.name}:V3-6`, `${tag} removed admin surface`, 'V3-6');
  for (const f of ['set-inscribe-paused', 'set-free-threshold', 'set-fee-recipient', 'transfer-ownership', 'get-free-threshold', 'set-payee', 'set-payees'])
    check(`no ${f}`, !hasFn(H, f));
}

R.finish('family-suite-v3.json');
