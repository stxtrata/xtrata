#!/usr/bin/env node
// Run the whole launch sequence on a simulated chain (no network, no keys). Writes ops/out/rehearsal-report.md.
//   node ops/rehearsal.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { initSimnet } from '@stacks/clarinet-sdk';
import { runRehearsal, reportMarkdown } from './lib/rehearsal.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const simnet = await initSimnet(join(here, '..', 'Clarinet.toml'));
const A = simnet.getAccounts();
const result = await runRehearsal({ simnet, accounts: { deployer: A.get('deployer'), publisher: A.get('wallet_1'), newAdmin: A.get('wallet_6') }, log: (m) => console.log(m) });
const out = join(here, 'out', 'rehearsal-report.md');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, reportMarkdown(result));
console.log(`\n${result.ok ? 'PASS' : 'FAIL'}: report at ${out}${result.error ? '\n' + result.error : ''}`);
process.exit(result.ok ? 0 : 1);
