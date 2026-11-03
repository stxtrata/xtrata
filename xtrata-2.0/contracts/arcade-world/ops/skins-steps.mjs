#!/usr/bin/env node
// Offline: write the steps file that registers the hall's built-in door skins (the same calls as ops/skins.mjs would send), for the
// offline-signing relay (ops/relay-steps.mjs). Nothing is read from or sent to a network. Use it on a TEST NETWORK where this machine
// cannot reach the node. Skins already registered are NOT skipped here: pass --skip key,key to leave some out.
//   node ops/skins-steps.mjs --owner ST…deployer [--contract xtrata-door-skins-v1] [--as deployer] [--skip a,b] [--out file.steps.json]
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs, die } from './lib/cli.mjs';
import { builtinSkins } from './lib/skins.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const args = parseArgs(process.argv.slice(2), { owner: 'value', contract: 'value', as: 'value', skip: 'value', out: 'value' });
if (!args.owner || !/^ST[0-9A-Z]+$/.test(args.owner)) die('usage: node ops/skins-steps.mjs --owner ST…deployer [--contract NAME] [--as WIZARD] [--skip a,b] [--out FILE]   (testnet addresses only)');
const name = args.contract || 'xtrata-door-skins-v1';
const skip = new Set(String(args.skip || '').split(',').filter(Boolean));
const steps = builtinSkins().filter((s) => !skip.has(s.key)).map((s) => ({
  as: args.as || 'deployer', contract: 'skins', fn: 'register-skin', note: s.key,
  args: [{ ascii: s.key }, { ascii: s.name }, { uint: s.family }, { uint: 0 }, { ascii: s.builtin }, { uint: 0 }, { hex: '' }, { uint: 0 },
    { uint: s.styles }, { uint: s.sound }, { ascii: s.frame }, { ascii: s.hardware }, { uint: s.wear }] }));
const out = args.out || join(here, 'out', 'skins.steps.json');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify({ owner: args.owner, contracts: { skins: name }, steps }, null, 1) + '\n');
console.log(`${steps.length} register-skin step(s) -> ${out}`);
