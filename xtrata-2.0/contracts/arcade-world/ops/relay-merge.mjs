#!/usr/bin/env node
// Join several packed files into one, in the order given: node ops/relay-merge.mjs a.txt b.txt --out c.txt
import { readFileSync, writeFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { pack } from './lib/relay.mjs';
const argv = process.argv.slice(2); const o = argv.indexOf('--out');
if (o < 0) { console.error('usage: relay-merge.mjs a.txt b.txt --out c.txt'); process.exit(1); }
const files = argv.filter((_, i) => i !== o && i !== o + 1);
const items = files.flatMap((f) => JSON.parse(gunzipSync(Buffer.from(readFileSync(f, 'utf8').trim(), 'base64')).toString('utf8')));
writeFileSync(argv[o + 1], pack(items));
console.log(`${items.length} transaction(s) -> ${argv[o + 1]}`); items.forEach((i, n) => console.log(`  ${n + 1}. ${i.label}`));
