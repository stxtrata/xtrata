import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../../', import.meta.url));
const args = process.argv.slice(2);
if (args.some(a => !['--report','--gate','schemas','ui'].includes(a)) || (args.includes('--gate') && !['schemas','ui'].includes(args[args.indexOf('--gate')+1]))) {
  console.error('Only --report or --gate schemas|ui is available. No broadcast command exists.'); process.exit(2);
}
const gate = args.includes('--gate') ? args[args.indexOf('--gate')+1] : 'ui';
const cases = [['schemas','src/lib/radio/support/__tests__/protocol.test.ts'], ...(gate === 'ui' ? [['ui','src/lib/radio/support/__tests__/panel.test.ts']] : [])];
const result = { schema: 1, implementationComplete: false, scope: 'Read-only schemas and DOM checks; browser visual gate outstanding', gates: [] };
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
writeFileSync(resolve(dir,'summary.md'),`# Radio support harness\n\n${result.scope}\n\n${result.gates.map(g=>`- ${g.id}: ${g.status}`).join('\n')}\n\nGates 3–9 are not implemented. No signing or broadcasts.\n`);
console.log(`Report: ${dir}`);
