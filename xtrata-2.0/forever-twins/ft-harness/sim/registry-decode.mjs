// The registry page decodes Clarity values without @stacks/transactions. Check its
// decoder against the SDK on real values from the v3 helper and the core (simnet).
import { serializeCV, cvToValue } from '@stacks/transactions';
import { boot, makeRunner, Cl } from './lib.mjs';
import { decode, registryProblems } from '../registry/clarity-lite.mjs';
import { readFileSync } from 'node:fs';

const { s, D, C, CORE } = await boot();
const R = makeRunner('registry-decode');
const { scenario, check } = R;
const hexOf = (cv) => { const x = serializeCV(cv); return typeof x === 'string' ? x : Buffer.from(x).toString('hex'); };
const H = C('ft3-megapont-ape-club-nft');

scenario('R-1', 'clarity-lite decodes get-twin-interface exactly like the SDK');
const cv = s.callReadOnlyFn(H, 'get-twin-interface', [], D).result;
const mine = await decode(hexOf(cv));
const sdk = cvToValue(cv, true);
const flat = (v) => (v && typeof v === 'object' && 'value' in v ? flat(v.value) : v);
for (const k of ['collection-key', 'source', 'master', 'payee-a', 'payee-b', 'owner', 'group', 'fee', 'max-fee', 'canonical-count', 'canonical-finalized', 'manifest-hash', 'interface-version']) {
  const a = mine[k], b = flat(sdk[k]);
  check(`${k}: ${a}`, String(a) === String(typeof b === 'bigint' ? b.toString() : b), `${a} vs ${b}`);
}
check('pending-owner none -> null', mine['pending-owner'] === null);

scenario('R-2', 'responses, optionals, contract principals, strings, lists');
const cases = [Cl.ok(Cl.uint(4000000)), Cl.error(Cl.uint(204)), Cl.some(Cl.contractPrincipal(D, 'xtrata-v3-2-3')), Cl.none(), Cl.bool(false),
  Cl.stringAscii('image/png'), Cl.list([Cl.uint(1), Cl.uint(2)]), Cl.int(-5), Cl.bufferFromHex('00ff')];
const want = [{ ok: '4000000' }, { err: '204' }, `${D}.xtrata-v3-2-3`, null, false, 'image/png', ['1', '2'], '-5', '0x00ff'];
for (const [k, c] of cases.entries()) check(`case ${k}`, JSON.stringify(await decode(hexOf(c))) === JSON.stringify(want[k]), JSON.stringify(await decode(hexOf(c))));
const mainnetP = Cl.standardPrincipal('SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X');
check('mainnet principal round-trips through c32', (await decode(hexOf(mainnetP))) === 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X');

scenario('R-3', 'registry rules');
const reg = JSON.parse(readFileSync(new URL('../registry/registry.v1.json', import.meta.url), 'utf8'));
check('published registry: one helper per collection, ids valid', registryProblems(reg).length === 0, registryProblems(reg).join('; '));
const dup = { helpers: [...reg.helpers, { ...reg.helpers[0], helper: 'SP000000000000000000002Q6VF78.second-pepe-helper' }] };
check('a second helper for the same collection is rejected', registryProblems(dup).some((p) => /two helpers/.test(p)));
R.finish('registry-decode.json');
