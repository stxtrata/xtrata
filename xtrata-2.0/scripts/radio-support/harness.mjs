import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../../', import.meta.url));
const args = process.argv.slice(2);
if (args.some(a => !['--report','--gate','schemas','ui','companion'].includes(a)) || (args.includes('--gate') && !['schemas','ui','companion'].includes(args[args.indexOf('--gate')+1]))) {
  console.error('Only --report or --gate schemas|ui|companion is available. No broadcast command exists.'); process.exit(2);
}
const gate = args.includes('--gate') ? args[args.indexOf('--gate')+1] : 'companion';
const cases = [['schemas','src/lib/radio/support/__tests__/protocol.test.ts'], ['messages','src/lib/radio/support/__tests__/messages.test.ts'], ...(gate !== 'schemas' ? [['ui','src/lib/radio/support/__tests__/panel.test.ts'],['radio-panel','src/lib/radio/support/__tests__/radio-panel.test.ts']] : []), ...(gate==='companion' ? [['companion','scripts/radio-support/__tests__/companion.test.ts'],['bridge','scripts/radio-support/__tests__/bridge.test.ts']] : [])];
const result = { schema: 1, implementationComplete: false, scope: 'Read-only UI plus SQLite companion simulation; no native authentication, keys or chain integration', gates: [] };
for (const [id,path] of cases) {
  const run = spawnSync(resolve(root,'node_modules/.bin/vitest'), ['run',path], { cwd: root, encoding: 'utf8' });
  // Output uses fixed messages and counts; never persist raw subprocess output.
  result.gates.push({ id, status: run.status === 0 ? 'passed' : 'failed' });
  console.log(`${id}: ${run.status === 0 ? 'passed' : 'failed'}`);
  if (run.status !== 0) { process.exitCode = 1; break; }
}
const dir = resolve(root,'.artifacts/radio-support-harness',new Date().toISOString().replace(/[:.]/g,'-'));
mkdirSync(dir,{recursive:true});
writeFileSync(resolve(dir,'result.json'),JSON.stringify(result,null,2)+'\n');
writeFileSync(resolve(dir,'summary.md'),`# Radio support harness\n\n${result.scope}\n\n${result.gates.map(g=>`- ${g.id}: ${g.status}`).join('\n')}\n\nGate 3 has partial simulated coverage; full gates remain open. No signing or broadcasts.\n`);
console.log(`Report: ${dir}`);
