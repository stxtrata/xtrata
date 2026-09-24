// Feasibility probes for a SHARED multi-collection helper (spec section 6).
//  S1-S3: runtime-selected source contract + asset name inside Clarity 4 `with-nft`
//  S4-S5: Clarity analysis limits that shape the design (read-only discovery)
// Simnet evidence only; must be repeated on a pinned mainnet fork before any decision.
import { initSimnet } from '@stacks/clarinet-sdk';
import { join } from 'node:path';
import { boot, Cl, isOk, errCode, makeRunner, ROOT } from './lib.mjs';

const { s, D, W, C } = await boot();
const R = makeRunner('shared-helper-probe');
const P = C('probe-shared'), PEPE = C('mock-pepe'), V1 = C('thisisnumberone-v1');
const u = W(1);

R.scenario('S1', 'Trait deposit + dynamic with-nft release (mock Pepe, no impl-trait)', '6.2');
s.callPublicFn(PEPE, 'test-mint', [Cl.uint(50), Cl.principal(u)], D);
R.check('register source + asset', isOk(s.callPublicFn(P, 'register', [Cl.principal(PEPE), Cl.stringAscii('bitcoin-pepe')], D)));
R.check('deposit via trait call', isOk(s.callPublicFn(P, 'deposit', [Cl.principal(PEPE), Cl.uint(50)], u)));
R.check('release with registry-supplied contract + asset name', isOk(s.callPublicFn(P, 'release', [Cl.principal(PEPE), Cl.uint(50), Cl.principal(u)], u)));

R.scenario('S2', 'Allowance rejects a wrong registered asset name', '6.2');
s.callPublicFn(P, 'deposit', [Cl.principal(PEPE), Cl.uint(50)], u);
s.callPublicFn(P, 'register', [Cl.principal(PEPE), Cl.stringAscii('wrong-name')], D);
const bad = s.callPublicFn(P, 'release', [Cl.principal(PEPE), Cl.uint(50), Cl.principal(u)], u);
R.check('release fails (post-condition allowance)', !isOk(bad), `err ${errCode(bad)}`);

R.scenario('S3', 'Implicit trait conformance with a Clarity 1 source (ThisIsNumberOne V1)', '6.2');
s.callPublicFn(V1, 'mint-token', [Cl.buffer(Buffer.alloc(32, 7)), Cl.buffer(Buffer.from('x')), Cl.uint(1), Cl.uint(0),
  Cl.list(Array(10).fill(Cl.principal(u))), Cl.list(Array(10).fill(Cl.uint(0)))], u);
s.callPublicFn(P, 'register', [Cl.principal(V1), Cl.stringAscii('my-nft')], D);
R.check('deposit V1 token through <nft-trait>', isOk(s.callPublicFn(P, 'deposit', [Cl.principal(V1), Cl.uint(0)], u)));
R.check('release V1 token with dynamic allowance', isOk(s.callPublicFn(P, 'release', [Cl.principal(V1), Cl.uint(0), Cl.principal(u)], u)));
R.note('Feasible does not mean safe: V1 still fails custody (existing-helper-evidence V1-B).');

async function expectAnalysisFailure(dir) {
  try { await initSimnet(join(ROOT, 'sim', 'probes', dir, 'Clarinet.toml')); return 'deployed'; }
  catch (e) { return String(e.message || e).split('\n')[0]; }
}
R.scenario('S4', 'Read-only functions cannot dispatch through a trait', '6.3');
{ const m = await expectAnalysisFailure('readonly-trait'); R.check('analysis rejects it as a writing operation', /writing operation/.test(m), m); }
R.scenario('S5', 'Read-only functions cannot call a constant-bound contract principal', '7.3');
{ const m = await expectAnalysisFailure('readonly-const'); R.check('analysis rejects it; template must inline literals', /writing operation/.test(m), m); }

R.finish('shared-helper-probe.json');
