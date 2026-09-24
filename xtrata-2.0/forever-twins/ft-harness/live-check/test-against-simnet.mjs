// Proves live-check.mjs end to end without touching mainnet: stands up a mock
// Stacks node/API whose answers come from simnet, seeds known anomalies, runs
// the real live-check script against it and asserts that each anomaly is found.
import http from 'node:http';
import { spawn } from 'node:child_process';
import { writeFileSync, readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { cvToHex, hexToCV } from '@stacks/transactions';
import { boot, Cl, isOk, xtrataHash, art, makeRunner, ROOT } from '../sim/lib.mjs';

const { s, D, W, C, CORE } = await boot();
const printEvents = new Map(); // contractId -> [raw hex]
const mintEvents = new Map();  // asset identifier -> [raw hex]
const push = (m, k, v) => { if (!m.has(k)) m.set(k, []); m.get(k).push(v); };
const pub = (c, f, a, who) => {
  const r = s.callPublicFn(c, f, a, who);
  for (const e of r.events) {
    if (e.event === 'print_event') push(printEvents, e.data.contract_identifier, e.data.raw_value ?? cvToHex(e.data.value));
    if (e.event === 'nft_mint_event') push(mintEvents, e.data.asset_identifier, e.data.raw_value);
  }
  return r;
};

// ---- seed a v1-interface helper with known states ------------------------------
const G = C('gamma-bitcoin-pepe'), HG = C('ref-helper-gamma'), ZW = C('zombie-wabbits');
const holder = W(1), sponsor = W(3);
const bytes = Object.fromEntries([11, 12, 13, 14].map((i) => [i, art(`live ${i}`)]));
for (const i of [11, 12, 13, 14]) pub(G, 'simnet-mint', [Cl.uint(i), Cl.principal(holder)], D);
pub(HG, 'seed-canonical', [Cl.list([11, 12, 13, 14].map((i) => Cl.tuple({ id: Cl.uint(i), hash: Cl.buffer(xtrataHash([bytes[i]])) })))], D);
const ins = (i, mime = 'image/png') => pub(HG, 'inscribe', [Cl.uint(i), Cl.buffer(xtrataHash([bytes[i]])), Cl.stringAscii(mime), Cl.uint(bytes[i].length), Cl.list([Cl.buffer(bytes[i])]), Cl.stringAscii('https://xtrata.xyz/i/{id}')], sponsor);
ins(11); ins(12); ins(13, 'text/html');                                               // #13: unexpected mime
pub(HG, 'swap-pepe-for-xtrata', [Cl.uint(12)], holder);                              // #12: consistent, original escrowed
pub(G, 'transfer', [Cl.uint(11), Cl.principal(holder), Cl.principal(HG)], holder);   // #11: stranded
pub(HG, 'seed-canonical', [Cl.list([Cl.tuple({ id: Cl.uint(12), hash: Cl.buffer(Buffer.alloc(32, 9)) })])], D); // #12: canonical changed after binding
for (const w of [W(4), W(5)]) pub(ZW, 'mint', [], w);
// zombie-wabbits mints 45, 1, 44, 2 in its deploy-time initialiser (not observable as tx events here)
for (const id of [45, 1, 44, 2]) push(mintEvents, `${ZW}::zombie-wabbits`, cvToHex(Cl.uint(id)));

// ---- mock API backed by simnet -------------------------------------------------
const ifaces = s.getContractsInterfaces();
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const send = (code, body) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(body)); };
  const parts = url.pathname.split('/').filter(Boolean);
  let body = '';
  for await (const c of req) body += c;
  try {
    if (url.pathname === '/v2/info') return send(200, { stacks_tip_height: s.blockHeight, stacks_tip: '0xsimnet', burn_block_height: s.burnBlockHeight });
    if (parts[0] === 'v2' && parts[1] === 'contracts' && parts[2] === 'call-read') {
      const [, , , a, n, fn] = parts; const id = `${a}.${n}`;
      const f = ifaces.get(id)?.functions.find((x) => x.name === fn);
      if (!f) return send(200, { okay: false, cause: 'Unchecked(NoSuchPublicFunction)' });
      if (f.access !== 'read_only') return send(200, { okay: false, cause: 'not a read-only function' });
      const args = JSON.parse(body).arguments.map((h) => hexToCV(h));
      return send(200, { okay: true, result: cvToHex(s.callReadOnlyFn(id, fn, args, D).result) });
    }
    if (parts[0] === 'v2' && parts[1] === 'data_var') {
      try { return send(200, { data: cvToHex(s.getDataVar(`${parts[2]}.${parts[3]}`, parts[4])) }); } catch { return send(404, {}); }
    }
    if (parts[0] === 'v2' && parts[1] === 'contracts' && parts[2] === 'source')
      return send(200, { source: s.getContractSource(`${parts[3]}.${parts[4]}`), publish_height: 1 });
    if (parts[0] === 'extended' && parts[2] === 'contract' && parts[4] === 'events') {
      const all = [...(printEvents.get(parts[3]) ?? [])].reverse(); // newest first, like the API
      const off = Number(url.searchParams.get('offset') ?? 0), lim = Number(url.searchParams.get('limit') ?? 50);
      return send(200, { limit: lim, offset: off, total: all.length, results: all.slice(off, off + lim).map((hex) => ({
        event_type: 'smart_contract_log', tx_id: '0xsim', contract_log: { contract_id: parts[3], topic: 'print', value: { hex, repr: '' } } })) });
    }
    if (url.pathname === '/extended/v1/tokens/nft/mints') {
      const all = mintEvents.get(url.searchParams.get('asset_identifier')) ?? [];
      const off = Number(url.searchParams.get('offset') ?? 0), lim = Number(url.searchParams.get('limit') ?? 50);
      return send(200, { limit: lim, offset: off, total: all.length, results: all.slice(off, off + lim).map((hex) => ({ value: { hex } })) });
    }
    send(404, {});
  } catch (e) { send(500, { error: String(e) }); }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

// ---- targets pointing at simnet ids -------------------------------------------
const dir = mkdtempSync(join(tmpdir(), 'ft-live-'));
const targets = {
  core: { id: CORE, reference: join(ROOT, 'contracts/core/xtrata-v3-2-3.clar') },
  helpers: [{ key: 'gamma-live-test', interface: 'v1', helper: HG, source: G, reference: join(ROOT, 'contracts/rendered/ref-helper-gamma.clar'), expectedMimePattern: '^image/' }],
  sources: [
    { id: G, reference: join(ROOT, 'contracts/legacy/gamma-bitcoin-pepe.clar'), dataVars: ['metadata-frozen', 'no-such-var'] },
    // deliberately compared with the ARCHIVED mainnet file: must be reported as CODE-DIFFERS (trait line differs)
    { id: ZW, reference: join(ROOT, 'screener/sources/zombie-wabbits.clar'), dataVars: ['wabbit-counter'], census: { asset: 'zombie-wabbits' } },
  ],
};
writeFileSync(join(dir, 'targets.json'), JSON.stringify(targets));
const outFile = join(ROOT, 'results', 'live-check-simnet.json');
// async spawn: the mock server lives in THIS process, so a blocking spawnSync would deadlock
const run = await new Promise((done) => {
  const p = spawn(process.execPath, [join(ROOT, 'live-check/live-check.mjs'), '--targets', join(dir, 'targets.json'),
    '--api', `http://127.0.0.1:${port}`, '--delay-ms', '0', '--all', '--out', outFile]);
  let stdout = '', stderr = '';
  p.stdout.on('data', (d) => (stdout += d)); p.stderr.on('data', (d) => (stderr += d));
  const kill = setTimeout(() => p.kill(), 120000);
  p.on('close', (status) => { clearTimeout(kill); done({ status, stdout, stderr }); });
});
server.close();
process.stdout.write(run.stdout.split('\n').filter((l) => !l.startsWith('(') && !l.startsWith('{')).join('\n'));
if (run.status !== 0) { console.error(run.stderr); process.exit(1); }

// ---- assertions ---------------------------------------------------------------
const rep = JSON.parse(readFileSync(outFile, 'utf8'));
const R = makeRunner('live-check-vs-simnet');
const has = (kind, where) => rep.anomalies.some((a) => a.kind === kind && (!where || a.where.includes(where)));
const H = rep.helpers[0];
R.scenario('L1', 'Transport, chain tip and source comparison', '10');
R.check('chain tip recorded', rep.chainTip.stacks_tip_height > 0);
R.check('core source byte-identical to reference', rep.core.source.status === 'byte-identical', rep.core.source.status);
R.check('helper source byte-identical to reference', H.sourceCompare.status === 'byte-identical', H.sourceCompare.status);
R.check('differing source code is reported', has('deployed-source-differs-from-archive', ZW));
R.check('missing data var reported as absent, present var decoded', JSON.stringify(rep.sources[0].dataVars['no-such-var']).includes('absent') && JSON.stringify(rep.sources[0].dataVars['metadata-frozen']).includes('false'));
R.scenario('L2', 'Binding scan finds seeded anomalies', '10');
R.check('all 3 bindings scanned', H.bindingsScanned === 3, H.bindingsScanned);
R.check('custody tallies: 2 consistent, 1 stranded', H.custody.consistent === 2 && H.custody.stranded === 1, JSON.stringify(H.custody));
R.check('stranded pair flagged (#11)', has('helper-holds-both-sides', '#11'));
R.check('unexpected mime flagged (#13)', has('unexpected-twin-mime', '#13'));
R.check('canonical changed after binding flagged (#12)', has('canonical-hash-changed-after-binding', '#12'));
R.check('unfinalised canonical record flagged', has('canonical-not-finalised'));
R.scenario('L3', 'Census via mint events + get-owner', '10');
const cz = rep.sources[1].census;
R.check('6 zombie-wabbits minted ever, none burned', cz.mintedEver === 6 && cz.burned === 0, JSON.stringify(cz));
R.finish('live-check-vs-simnet.json');
