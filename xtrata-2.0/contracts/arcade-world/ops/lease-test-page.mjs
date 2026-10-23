#!/usr/bin/env node
// Builds public/arcade-world-preview/lease-test.html: the live testnet test of the draft lease contract (drafts/xtrata-lease-v1.clar).
// A page, not a Node script, because the workspace cannot reach the Hiro API but a browser can. Reads only this repo; nothing is sent from here.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const aw = join(here, '..');
const tpl = readFileSync(join(here, 'lease-test', 'page.template.html'), 'utf8');
const lease = readFileSync(join(aw, 'drafts', 'xtrata-lease-v1.clar'), 'utf8');
const html = tpl.replace("/*LEASE_SRC*/''", () => JSON.stringify(lease));
const out = process.argv[2] || join(aw, '..', '..', 'public', 'arcade-world-preview', 'lease-test.html');
writeFileSync(out, html);
console.log('written', out, html.length, 'bytes');
