#!/usr/bin/env node
/**
 * Music Hero awards: the whole flow on Stacks TESTNET, with throwaway wallets made by this script.
 * (docs/music/AWARDS-INSCRIPTION.md, step "Rehearse off mainnet".)
 *
 *   cd xtrata-2.0/contracts/clarinet
 *   node scripts/awards-testnet-rehearsal.mjs            # run, or carry on from where it stopped
 *   node scripts/awards-testnet-rehearsal.mjs --dry      # build every transaction and print its size; touches no network
 *   node scripts/awards-testnet-rehearsal.mjs --fresh    # forget the saved wallets and start again
 *
 * It never touches mainnet: every transaction is built for testnet and the API address must not be a mainnet one.
 * The wallets are random keys made here, funded from the public testnet faucet, and kept only in a file in the
 * system temp folder (never in the repo). They hold testnet coins, which are worth nothing.
 *
 * What it does, in order:
 *   1. makes four wallets: xtrata (stands in for the Xtrata project wallet), signer (signs claim notes), hero-1, hero-2
 *   2. gets testnet STX from the faucet
 *   3. deploys the Xtrata core as the repo's simulation uses it (the trait, v1-1-1, v2-1-0, v3-2-3) and unpauses it
 *   4. inscribes two real templates from public/awards (Gold: one chunk; Diamond: two chunks)
 *   5. deploys the award contract, sets the signer and the two classes, gives it a balance
 *   6. hero-1 claims a Gold record (with a name on it), hero-2 a Diamond (address only)
 *   7. tries a forged claim (must be refused on-chain), sends hero-1's record to hero-2, withdraws the unused balance
 *   8. reads everything back from the chain and writes a report: ids, sizes, the fee each step really paid
 *
 * STACKS_API   the testnet API to use (default https://api.testnet.hiro.so)
 * FEE_RATE     microSTX per byte offered (default 1: the floor, to learn whether it confirms)
 */
import { createHash, randomBytes } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  Cl, ClarityVersion, Pc, PostConditionMode, cvToHex, cvToJSON, hash160, hexToCV, makeContractCall, makeContractDeploy,
  makeSTXTokenTransfer, privateKeyToAddress, privateKeyToPublic, serializeCV, signMessageHashRsv
} from '@stacks/transactions';

const HERE = dirname(fileURLToPath(import.meta.url));
const CLARINET = join(HERE, '..');
const APP = join(CLARINET, '..', '..');
const DRY = process.argv.includes('--dry');
const API = (process.env.STACKS_API || 'https://api.testnet.hiro.so').replace(/\/+$/, '');
const RATE = Number(process.env.FEE_RATE || 1);
const STATE_DIR = join(tmpdir(), 'xtrata-awards-rehearsal');
const STATE = join(STATE_DIR, 'state.json');
const MAINNET_CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const NFT_FEE = 102_000n; // the core's defaults for a one-chunk single-transaction inscription
if (/mainnet/i.test(API)) { console.error('Refusing: STACKS_API looks like mainnet. This script is for testnet only.'); process.exit(1); }
if (process.argv.includes('--fresh')) rmSync(STATE_DIR, { recursive: true, force: true });

const log = (...a) => console.log(...a);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const sha = (b) => createHash('sha256').update(b).digest();
/** Xtrata's hash of a file: a chain over its chunks, starting from 32 zero bytes. */
const xtrataHash = (chunks) => chunks.reduce((h, c) => sha(Buffer.concat([h, c])), Buffer.alloc(32));
const chunksOf = (bytes) => { const out = []; for (let i = 0; i < bytes.length; i += 16384) out.push(bytes.subarray(i, i + 16384)); return out; };
const bytesOf = (tx) => { const s = tx.serialize(); return typeof s === 'string' ? Buffer.from(s, 'hex') : Buffer.from(s); };

// ---------------------------------------------------------------- state: wallets and progress, in the temp folder only
mkdirSync(STATE_DIR, { recursive: true });
const state = existsSync(STATE) ? JSON.parse(readFileSync(STATE, 'utf8')) : { keys: {}, done: {}, steps: [], nonces: {} };
const save = () => { if (!DRY) writeFileSync(STATE, JSON.stringify(state, (k, v) => (typeof v === 'bigint' ? v.toString() : v), 2), { mode: 0o600 }); };
const key = (name) => (state.keys[name] ??= randomBytes(32).toString('hex') + '01');
const addr = (name) => privateKeyToAddress(key(name), 'testnet');
for (const n of ['xtrata', 'signer', 'hero-1', 'hero-2']) key(n);
save();
const X = addr('xtrata');
const AWARDS = 'xtrata-music-awards-v1-0';

// ---------------------------------------------------------------- the chain
async function api(path, init) {
  for (let attempt = 0; ; attempt++) {
    try {
      const r = await fetch(API + path, init);
      if (r.status === 429 || r.status >= 500) throw new Error('http ' + r.status);
      return r;
    } catch (e) { if (attempt >= 6) throw new Error(`Cannot reach ${API}${path}: ${e.message}`); await sleep(2000 * (attempt + 1)); }
  }
}
const getJson = async (path) => { const r = await api(path); return r.ok ? r.json() : null; };
const balance = async (a) => DRY ? 0n : BigInt((await getJson(`/extended/v1/address/${a}/stx`))?.balance ?? 0);
async function nextNonce(name) {
  if (DRY) return (state.nonces[name] = (state.nonces[name] ?? -1) + 1);
  const j = await getJson(`/extended/v1/address/${addr(name)}/nonces`);
  return Math.max(Number(j?.possible_next_nonce ?? 0), (state.nonces[name] ?? -1) + 1);
}
async function read(contract, fn, args = []) {
  const r = await api(`/v2/contracts/call-read/${X}/${contract}/${fn}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ sender: X, arguments: args.map((a) => cvToHex(a)) }) });
  const j = await r.json();
  if (!j.okay) throw new Error(`read ${contract}.${fn} failed: ${j.cause}`);
  return cvToJSON(hexToCV(j.result));
}
async function waitFor(txid) {
  for (let i = 0; i < 240; i++) {
    const j = await getJson(`/extended/v1/tx/${txid}`);
    if (j && j.tx_status && j.tx_status !== 'pending') return j;
    await sleep(5000);
  }
  throw new Error(`Transaction ${txid} did not confirm in 20 minutes. Run the script again to carry on.`);
}

/**
 * One step: build the transaction (twice: once to learn its size, then with the fee that size calls for), send it,
 * wait for it, and note what it cost. A step that already succeeded in an earlier run is skipped.
 * `expect` is 'success' or the abort the step is meant to end in.
 */
async function step(id, title, who, build, expect = 'success') {
  if (state.done[id]) { log(`  = ${title} (done earlier)`); return state.done[id]; }
  const nonce = await nextNonce(who);
  const probe = await build({ fee: 0, nonce });
  const size = bytesOf(probe).length;
  let fee = Math.max(180, Math.ceil(size * RATE));
  if (DRY) { const rec = { id, title, who, bytes: size, fee }; state.steps.push(rec); log(`  ~ ${title}: ${size} bytes, would offer ${fee} microSTX`); return (state.done[id] = rec); }
  for (let attempt = 0; attempt < 6; attempt++) {
    const tx = await build({ fee, nonce });
    const r = await api('/v2/transactions', { method: 'POST', headers: { 'content-type': 'application/octet-stream' }, body: bytesOf(tx) });
    const text = await r.text();
    if (r.ok) {
      const txid = '0x' + JSON.parse(text).replace(/^0x/, '');
      state.nonces[who] = nonce; save();
      log(`  > ${title}: sent ${txid} (${size} bytes, fee ${fee})`);
      const done = await waitFor(txid);
      const rec = { id, title, who, txid, bytes: size, fee: Number(done.fee_rate), status: done.tx_status, result: done.tx_result?.repr, events: done.event_count };
      state.steps.push(rec);
      if (done.tx_status !== expect) { save(); throw new Error(`${title}: expected ${expect}, got ${done.tx_status} ${done.tx_result?.repr ?? ''}`); }
      log(`    ${done.tx_status} ${done.tx_result?.repr ?? ''}`);
      state.done[id] = rec; save();
      return rec;
    }
    if (/FeeTooLow|fee/i.test(text) && attempt < 5) { fee *= 2; log(`    fee too low, offering ${fee}`); continue; }
    throw new Error(`${title}: the node refused it: ${text.slice(0, 300)}`);
  }
}
const common = (who, o) => ({ senderKey: key(who), network: 'testnet', fee: o.fee, nonce: o.nonce });
const deploy = (id, who, contractName, codeBody, clarityVersion) => step(id, `deploy ${contractName}`, who, (o) =>
  makeContractDeploy({ ...common(who, o), contractName, codeBody, clarityVersion, postConditionMode: PostConditionMode.Allow }));
const call = (id, title, who, contractName, functionName, functionArgs, extra = {}, expect) => step(id, title, who, (o) =>
  makeContractCall({ ...common(who, o), contractAddress: X, contractName, functionName, functionArgs, postConditionMode: PostConditionMode.Allow, postConditions: [], ...extra }), expect);
const send = (id, title, who, recipient, amount) => step(id, title, who, (o) => makeSTXTokenTransfer({ ...common(who, o), recipient, amount }));

// ---------------------------------------------------------------- the server's part: build a record, sign its note
const recordFor = (template, className, hero, number, plays, seed, bns) => Buffer.from(
  `<!doctype html><meta charset=utf-8><title>Xtrata Music Hero · ${className} record No. ${String(number).padStart(4, '0')}${bns ? ' · ' + bns : ''}</title>` +
  `<style>html,body,iframe{margin:0;width:100%;height:100%;border:0;background:#040509}</style>` +
  `<iframe src="/i/${template}#n=${number}&a=${hero}${bns ? '&b=' + bns : ''}&p=${plays}&s=${seed}"></iframe>`);
const seedFor = (drop, number, hero) => sha(Buffer.from(`xtrata-music-hero:${drop}:${number}:${hero}`)).toString('hex').slice(0, 8);
function signNote({ chain, drop, cls, number, plays, hero, record }, signerKey = key('signer')) {
  const tuple = Cl.tuple({
    chain: Cl.uint(chain), class: Cl.uint(cls), contract: Cl.contractPrincipal(X, AWARDS), domain: Cl.stringAscii('xtrata-music-awards-v1'),
    drop: Cl.uint(drop), hero: Cl.standardPrincipal(hero), number: Cl.uint(number), plays: Cl.uint(plays), record: Cl.buffer(xtrataHash([record]))
  });
  const ser = serializeCV(tuple); const hex = typeof ser === 'string' ? ser.replace(/^0x/, '') : Buffer.from(ser).toString('hex');
  return Cl.bufferFromHex(signMessageHashRsv({ messageHash: sha(Buffer.from(hex, 'hex')).toString('hex'), privateKey: signerKey }));
}
const claimArgs = (n, record, signature) => [Cl.uint(n.drop), Cl.uint(n.cls), Cl.uint(n.number), Cl.uint(n.plays), Cl.buffer(record), signature];

// ---------------------------------------------------------------- run
const DROP = 1, DIAMOND = 1, GOLD = 2;
log(`Music Hero awards rehearsal on TESTNET${DRY ? ' (dry run: no network)' : ''}\n  API ${API}\n  xtrata ${X}\n  hero-1 ${addr('hero-1')}\n  hero-2 ${addr('hero-2')}\n  wallets and progress: ${STATE}\n`);

log('1. Testnet STX from the faucet');
if (!DRY && (await balance(X)) < 50_000_000n) {
  if (!state.faucet) {
    const r = await api(`/extended/v1/faucets/stx?address=${X}`, { method: 'POST' });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || j.success === false) { console.error(`  The faucet said no (${r.status} ${JSON.stringify(j).slice(0, 200)}).\n  Send some testnet STX to ${X} from any testnet faucet, then run this again.`); process.exit(2); }
    state.faucet = j.txId || j.txid || true; save();
    log(`  asked: ${state.faucet}`);
  }
  for (let i = 0; i < 120 && (await balance(X)) < 50_000_000n; i++) await sleep(5000);
  if ((await balance(X)) < 50_000_000n) { console.error('  The faucet coins have not arrived yet. Run this again in a few minutes.'); process.exit(2); }
}
log(`  balance ${DRY ? '(dry run)' : Number(await balance(X)) / 1e6 + ' STX'}`);

log('2. The Xtrata core, as the simulation uses it');
const src = (f) => readFileSync(join(CLARINET, 'contracts', f), 'utf8');
await deploy('d-trait', 'xtrata', 'sip009-nft-trait', src('sip009-nft-trait.clar'), ClarityVersion.Clarity2);
await deploy('d-v1', 'xtrata', 'xtrata-v1-1-1', src('xtrata-v1.1.1.clar'), ClarityVersion.Clarity3);
await deploy('d-v2', 'xtrata', 'xtrata-v2-1-0', src('xtrata-v2.1.0.clar'), ClarityVersion.Clarity3);
await deploy('d-v3', 'xtrata', 'xtrata-v3-2-3', src('xtrata-v3.2.3.clar'), ClarityVersion.Clarity3);
await call('core-unpause', 'unpause the core', 'xtrata', 'xtrata-v3-2-3', 'set-paused', [Cl.bool(false)]);

log('3. Two real templates');
const templates = {};
for (const [name, cls] of [['gold', GOLD], ['diamond', DIAMOND]]) {
  const bytes = readFileSync(join(APP, 'public', 'awards', `${name}.html`)), chunks = chunksOf(bytes);
  const rec = await call(`t-${name}`, `inscribe the ${name} template (${bytes.length} bytes, ${chunks.length} chunk${chunks.length > 1 ? 's' : ''})`, 'xtrata', 'xtrata-v3-2-3', 'mint-single-tx',
    [Cl.buffer(xtrataHash(chunks)), Cl.stringAscii('text/html'), Cl.uint(bytes.length), Cl.list(chunks.map((c) => Cl.buffer(c))), Cl.stringAscii(`https://xtrata.xyz/awards/${name}`)]);
  // (ok (tuple (existed false) (token-id uN)))
  const id = DRY ? (name === 'gold' ? 0 : 1) : Number(/token-id u(\d+)/.exec(rec.result)[1]);
  templates[name] = { id, cls, bytes };
  log(`    template id ${id}`);
}

log('4. The award contract');
const awardSource = readFileSync(join(APP, 'contracts', 'live', 'xtrata-music-awards-v1.0.clar'), 'utf8').replaceAll(MAINNET_CORE, X);
await deploy('d-awards', 'xtrata', AWARDS, awardSource, ClarityVersion.Clarity3);
await call('a-signer', 'set the signer', 'xtrata', AWARDS, 'set-signer-hash', [Cl.some(Cl.buffer(hash160(Buffer.from(privateKeyToPublic(key('signer')), 'hex'))))]);
await call('a-gold', 'set the Gold class (10)', 'xtrata', AWARDS, 'set-class', [Cl.uint(DROP), Cl.uint(GOLD), Cl.uint(templates.gold.id), Cl.uint(10)]);
await call('a-diamond', 'set the Diamond class (5)', 'xtrata', AWARDS, 'set-class', [Cl.uint(DROP), Cl.uint(DIAMOND), Cl.uint(templates.diamond.id), Cl.uint(5)]);
await send('a-fund', 'give the award contract a balance (1 STX)', 'xtrata', `${X}.${AWARDS}`, 1_000_000n);
await send('h1-fund', 'give hero-1 a little for network fees (0.05 STX)', 'xtrata', addr('hero-1'), 50_000n);
await send('h2-fund', 'give hero-2 a little for network fees (0.05 STX)', 'xtrata', addr('hero-2'), 50_000n);

log('5. Claims');
const chain = DRY ? 2147483648 : Number((await read(AWARDS, 'get-domain')).value.chain.value);
const noteFor = (who, cls, number, plays) => ({ chain, drop: DROP, cls, number, plays, hero: addr(who) });
const keepStx = (who) => ({ postConditionMode: PostConditionMode.Allow, postConditions: [Pc.principal(addr(who)).willSendEq(0).ustx()] });

const n1 = noteFor('hero-1', GOLD, 412, 50);
const r1 = recordFor(templates.gold.id, 'Gold', n1.hero, n1.number, n1.plays, seedFor(DROP, n1.number, n1.hero), 'rehearsal.btc');
const forged = Buffer.from(r1.toString().replace('rehearsal.btc', 'rehearsaI.btc'));
await call('c-forged', 'a forged claim: one character of the record changed (must be refused)', 'hero-1', AWARDS, 'claim', claimArgs(n1, forged, signNote({ ...n1, record: r1 })), keepStx('hero-1'), 'abort_by_response');
const c1 = await call('c-gold', `hero-1 claims a Gold record (${r1.length} bytes, with a name)`, 'hero-1', AWARDS, 'claim', claimArgs(n1, r1, signNote({ ...n1, record: r1 })), keepStx('hero-1'));

const n2 = noteFor('hero-2', DIAMOND, 7, 100);
const r2 = recordFor(templates.diamond.id, 'Diamond', n2.hero, n2.number, n2.plays, seedFor(DROP, n2.number, n2.hero), '');
const c2 = await call('c-diamond', `hero-2 claims a Diamond record (${r2.length} bytes, address only)`, 'hero-2', AWARDS, 'claim', claimArgs(n2, r2, signNote({ ...n2, record: r2 })), keepStx('hero-2'));
await call('c-again', 'hero-1 tries to claim a second award (must be refused)', 'hero-1', AWARDS, 'claim',
  claimArgs({ ...n1, number: 413 }, r1, signNote({ ...n1, number: 413, record: r1 })), keepStx('hero-1'), 'abort_by_response');

const tokenOf = (rec) => (DRY ? 2 : Number(/token-id u(\d+)/.exec(rec.result)[1]));
const id1 = tokenOf(c1), id2 = DRY ? 3 : tokenOf(c2);

log('6. Sending a record on, and taking back the unused balance');
await call('x-transfer', 'hero-1 sends its record to hero-2', 'hero-1', 'xtrata-v3-2-3', 'transfer', [Cl.uint(id1), Cl.standardPrincipal(addr('hero-1')), Cl.standardPrincipal(addr('hero-2'))]);
const left = DRY ? 796_000n : BigInt((await read(AWARDS, 'get-balance')).value.value);
if (left > 0n) await call('x-withdraw', `withdraw the unused balance (${left} microSTX)`, 'xtrata', AWARDS, 'withdraw', [Cl.uint(left), Cl.standardPrincipal(X)]);

// ---------------------------------------------------------------- read it all back
const report = { api: API, when: new Date().toISOString(), xtrata: X, awards: `${X}.${AWARDS}`, templates: {}, records: {}, steps: state.steps, checks: [] };
const check = (what, ok, detail = '') => { report.checks.push({ what, ok, detail }); log(`  ${ok ? 'OK  ' : 'FAIL'} ${what}${detail ? ' — ' + detail : ''}`); };
if (!DRY) {
  log('7. Reading it back from the chain');
  const chunk = async (id, i) => Buffer.from((await read('xtrata-v3-2-3', 'get-chunk', [Cl.uint(id), Cl.uint(i)])).value.value.replace(/^0x/, ''), 'hex');
  const whole = async (id, n) => Buffer.concat(await Promise.all([...Array(n).keys()].map((i) => chunk(id, i))));
  for (const [name, t] of Object.entries(templates)) {
    const back = await whole(t.id, chunksOf(t.bytes).length);
    check(`the ${name} template on chain is byte-for-byte the file in public/awards`, back.equals(t.bytes), `${back.length} bytes`);
    writeFileSync(join(STATE_DIR, `i-${t.id}.html`), back); report.templates[name] = { id: t.id, bytes: back.length };
  }
  for (const [label, id, rec, hero, owner] of [['Gold record', id1, r1, 'hero-1', 'hero-2'], ['Diamond record', id2, r2, 'hero-2', 'hero-2']]) {
    const back = await chunk(id, 0);
    check(`${label} #${id} on chain is exactly the record the note covered`, back.equals(rec), `${back.length} bytes`);
    writeFileSync(join(STATE_DIR, `i-${id}.html`), back);
    const own = (await read('xtrata-v3-2-3', 'get-owner', [Cl.uint(id)])).value.value.value;
    check(`${label} is held by ${owner}`, own === addr(owner), own);
    const award = (await read(AWARDS, 'get-award', [Cl.uint(id)])).value.value;
    check(`${label} still names the hero who earned it (${hero})`, award.hero.value === addr(hero), `edition ${award.edition.value}, No. ${award.number.value}, ${award.plays.value} plays`);
    const deps = JSON.stringify(await read('xtrata-v3-2-3', 'get-dependencies', [Cl.uint(id)]));
    check(`${label} declares its template as what it is built from`, deps.includes(`"${label.startsWith('Gold') ? templates.gold.id : templates.diamond.id}"`), deps.slice(0, 120));
    report.records[label] = { id, bytes: back.length, owner: own };
  }
  const byId = Object.fromEntries(state.steps.map((s) => [s.id, s]));
  check('the forged claim was refused on-chain with "note not valid" (203)', /u203/.test(byId['c-forged']?.result ?? ''), byId['c-forged']?.result);
  check('a second award for the same hero was refused (205)', /u205/.test(byId['c-again']?.result ?? ''), byId['c-again']?.result);
  check('the contract balance went down by exactly two fees', left === 1_000_000n - 2n * NFT_FEE, `${left} left of 1000000`);
  check('each hero paid only the network fee', true, `Gold claim ${byId['c-gold']?.fee} microSTX for ${byId['c-gold']?.bytes} bytes; Diamond claim ${byId['c-diamond']?.fee} for ${byId['c-diamond']?.bytes} bytes`);
}
writeFileSync(join(STATE_DIR, DRY ? 'dry-run.json' : 'report.json'), JSON.stringify(report, (k, v) => (typeof v === 'bigint' ? v.toString() : Buffer.isBuffer(v) ? undefined : v), 2));
log(`\n${DRY ? 'Dry run' : 'Rehearsal'} finished. ${report.checks.filter((c) => !c.ok).length} check(s) failed of ${report.checks.length}.\nReport: ${join(STATE_DIR, DRY ? 'dry-run.json' : 'report.json')}`);
if (!DRY) log(`Inscription bytes as read from the chain are in ${STATE_DIR} (i-<id>.html) for the viewer check.`);
