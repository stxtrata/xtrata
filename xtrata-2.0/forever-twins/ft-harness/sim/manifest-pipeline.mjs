// Manifest pipeline, end to end in simnet with the real xtrata-v3-2-3 core:
// build a manifest from fixture art -> seeding plan -> apply the plan to a v3 helper
// -> checker says "ready to finalise" -> finalise with the manifest sha256 -> checker
// says "finalised and matches" -> the manifest's bytes inscribe through the core
// (so the builder's Xtrata hash equals the core's) -> tampering and oversize are caught.
import { hexToCV } from '@stacks/transactions';
import { boot, makeRunner, Cl } from './lib.mjs';
import { buildAll, manifestDoc, manifestText, chunk, MAX_BYTES, MAX_RECORD_BYTES, xtrataHashHex } from '../manifest/lib.mjs';
import { makePlan } from '../manifest/seed-plan.mjs';
import { checkHelper } from '../manifest/check-canonical.mjs';

const { s, D, W, C } = await boot();
const R = makeRunner('manifest-pipeline');
const { scenario, check } = R;
const SRC = C('zombie-wabbits'), H = C('ft3-zombie-wabbits');
const holder = W(1), sponsor = W(3);
const isOk = (r) => r.result.type === 'ok';
const code = (r) => (r.result.type === 'err' ? String(r.result.value.value) : 'ok');

// originals
const ids = [];
for (let k = 0; k < 7; k++) {
  const r = s.callPublicFn(SRC, 'mint', [], holder);
  ids.push(Number(r.events.find((e) => e.event === 'nft_mint_event').data.value.value));
}
ids.sort((a, b) => a - b);

// fixture "web": metadata JSON per id, media of assorted sizes (1 to 3+ chunks, PNG/SVG/JPEG magic)
const web = new Map();
const png = (n, seed) => { const b = new Uint8Array(n); b.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]); for (let i = 8; i < n; i++) b[i] = (i * 31 + seed) & 255; return b; };
const sizes = [900, 16384, 16385, 40000, 70001, 120000, 700000]; // the last is over 512 KB: pre-inscribed
ids.forEach((id, k) => {
  const media = k === 1 ? new TextEncoder().encode(`<svg xmlns="http://www.w3.org/2000/svg"><text>wabbit ${id}</text></svg>`) : png(sizes[k], id);
  web.set(`https://gw.test/ipfs/QmMeta/${id}.json`, new TextEncoder().encode(JSON.stringify({ name: `Wabbit ${id}`, image: `ipfs://QmArt/${id}.png` })));
  web.set(`https://gw.test/ipfs/QmArt/${id}.png`, media);
});
const fetcher = async (url) => (web.has(url) ? { bytes: web.get(url), contentType: 'application/octet-stream', status: 200 } : { bytes: new Uint8Array(), contentType: '', status: 404 });
const cfg = {
  collectionKey: 'zombie-wabbits', source: `${D}.zombie-wabbits`, sourceAsset: 'zombie-wabbits',
  metadataUri: 'ipfs://QmMeta/{id}.json', gateway: 'https://gw.test', twinTokenUri: 'https://xtrata.xyz/ft/zombie-wabbits/{id}.json', retries: 1,
};

scenario('M-1', 'builder: hashes, mime from magic bytes, fixed token-uri');
const built = await buildAll(cfg, ids, fetcher);
check('every token built, none refused', built.tokens.length === ids.length && !built.failures.length && !built.oversize.length, JSON.stringify(built.failures));
check('mime sniffed (png + svg)', built.tokens[0].twin.mime === 'image/png' && built.tokens[1].twin.mime === 'image/svg+xml', built.tokens[1].twin.mime);
check('token-uri is the fixed twin URI', built.tokens[2].twin.tokenUri === `https://xtrata.xyz/ft/zombie-wabbits/${ids[2]}.json`);
check('xtrata hash differs from plain sha256 (rolling hash, not file hash)', built.tokens[0].twin.contentHash.slice(2) !== built.tokens[0].twin.sha256);
const text = manifestText(manifestDoc(cfg, built.tokens, null));

check('700 KB token marked for pre-inscription', built.tokens[6].twin.route === 'preinscribed' && built.preinscribed.length === 1 && !built.tokens[5].twin.route);

scenario('M-2', 'refusals: over the 32 MiB core cap, missing art, partial manifest');
web.set(`https://gw.test/ipfs/QmMeta/999.json`, new TextEncoder().encode(JSON.stringify({ image: 'ipfs://QmArt/999.png' })));
web.set(`https://gw.test/ipfs/QmArt/999.png`, png(MAX_RECORD_BYTES + 1, 9));
const big = await buildAll(cfg, [999, 998], fetcher);
check('token over 32 MiB flagged as oversize', big.oversize.length === 1 && big.oversize[0].id === 999, JSON.stringify(big.oversize));
check('missing art is a failure, not a silent skip', big.failures.length === 1 && big.failures[0].id === 998);
const exactly = await buildAll(cfg, [997], async (u) => ({ bytes: u.endsWith('.json') ? new TextEncoder().encode('{"image":"x"}') : png(MAX_BYTES, 1), contentType: '', status: 200 }));
check('exactly 512 KB is accepted', exactly.oversize.length === 0 && exactly.tokens.length === 1);
let refused = '';
try { makePlan(manifestText({ ...JSON.parse(text), scope: 'declared-subset (1-5) - NOT for finalisation' }), H); } catch (e) { refused = e.message; }
check('seed plan refuses a partial manifest', /partial/.test(refused), refused);
try { const d = JSON.parse(text); d.tokens[0].twin.totalSize = MAX_RECORD_BYTES + 1; makePlan(manifestText(d), H); refused = ''; } catch (e) { refused = e.message; }
check('seed plan refuses an oversize entry', /outside/.test(refused), refused);

scenario('M-3', 'seeding plan applied by the owner; checker before finalisation');
const plan = makePlan(text, H);
check(`plan: ${plan.seedCalls} seed call(s) + finalize`, plan.seedCalls === 1 && plan.steps.at(-1).function === 'finalize-canonical');
check('plan: one pre-inscription (begin, 2 batches, seal, bind)', plan.preinscribedCount === 1 && plan.preinscribe[0].steps.map((x) => x.function).join(',') === 'begin-inscription,add-chunk-batch,add-chunk-batch,seal-inscription,bind-preinscribed');
check('plan carries unsigned payloads', plan.steps.every((st) => typeof st.unsignedPayloadHex === 'string' && st.unsignedPayloadHex.length > 20));
const ro = async (fn, args) => s.callReadOnlyFn(H, fn, args, D).result;
const empty = await checkHelper(text, ro);
check('checker on an unseeded helper: MISMATCH (count 0, entries missing)', !empty.ok && empty.mismatches.length === ids.length);
const seed = plan.steps[0];
const rs = s.callPublicFn(H, 'seed-canonical', seed.argsHex.map(hexToCV), D);
check('seed-canonical from the plan: ok, count = n', code(rs) === 'ok' && Number(rs.result.value.value) === ids.length, code(rs));
const notYet = await checkHelper(text, ro);
check('checker: record matches but the large twin is unbound, so not ready', !notYet.ok && notYet.problems.some((p) => /not yet bound/.test(p)) && notYet.mismatches.length === 1);
check('finalise refused while the large twin is unbound (u221)', code(s.callPublicFn(H, 'finalize-canonical', plan.steps.at(-1).argsHex.map(hexToCV), D)) === '221');
// the owner runs the pre-inscription exactly as the plan lays it out
const P = plan.preinscribe[0], bigBytes = web.get(`https://gw.test/ipfs/QmArt/${P.id}.png`), CORE = C('xtrata-v3-2-3');
let pr = s.callPublicFn(CORE, 'begin-inscription', P.steps[0].argsHex.map(hexToCV), D);
for (const st of P.steps.filter((x) => x.function === 'add-chunk-batch')) {
  const cs = chunk(bigBytes).slice(st.chunkRange[0], st.chunkRange[1] + 1);
  pr = isOk(pr) ? s.callPublicFn(CORE, 'add-chunk-batch', [hexToCV(P.steps[0].argsHex[0]), Cl.list(cs.map((c) => Cl.buffer(c)))], D) : pr;
}
const sealed = isOk(pr) ? s.callPublicFn(CORE, 'seal-inscription', P.steps.at(-2).argsHex.map(hexToCV), D) : pr;
check('owner pre-inscription from the plan seals (core hash check passes)', isOk(sealed), code(sealed));
const xid = Number(sealed.result.value.value);
const bound = s.callPublicFn(H, 'bind-preinscribed', [Cl.uint(P.id), Cl.uint(xid)], D);
check('bind-preinscribed ok', isOk(bound), code(bound));
const pre = await checkHelper(text, ro);
check('checker: seeded record matches, ready to finalise', pre.ok && /ready to finalise/.test(pre.verdict), JSON.stringify(pre.problems.concat(pre.mismatches)));

scenario('M-4', 'finalise from the plan; checker after finalisation');
const fin = plan.steps.at(-1);
const rf = s.callPublicFn(H, 'finalize-canonical', fin.argsHex.map(hexToCV), D);
check('finalize-canonical(manifest sha256, count) ok', code(rf) === 'ok', code(rf));
const post = await checkHelper(text, ro);
check('checker: finalised and matches manifest (hash included)', post.ok && /finalised/.test(post.verdict) && post.interface.manifestHash === plan.manifestSha256);
const tampered = JSON.parse(text); tampered.tokens[3].twin.tokenUri += '?x';
const bad = await checkHelper(manifestText(tampered), ro);
check('checker catches an edited manifest (token-uri + manifest hash)', !bad.ok && bad.mismatches.length === 1 && bad.problems.some((p) => /manifest-hash/.test(p)));

scenario('M-5', 'builder hash == core hash: the manifest bytes inscribe through the real core');
for (const [k, id] of ids.entries()) {
  if (id === P.id) continue; // already a twin (pre-inscribed)
  const bytes = web.get(`https://gw.test/ipfs/QmArt/${id}.png`);
  const r = s.callPublicFn(H, 'inscribe', [Cl.uint(id), Cl.list(chunk(bytes).map((c) => Cl.buffer(c)))], sponsor);
  check(`id ${id}: ${bytes.length} bytes / ${chunk(bytes).length} chunk(s) inscribed`, code(r) === 'ok', code(r));
}
check('hash helper agrees with lib', (await xtrataHashHex(new Uint8Array([1, 2, 3]))).length === 64);

R.finish('manifest-pipeline.json');
