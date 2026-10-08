#!/usr/bin/env node
// Bake a collector state into the tracker page so first paint shows real numbers and the first
// visit only has to fetch what happened since. Usage:
//   node scripts/bounty-tracker-bake.mjs path/to/ledger-state.json
// The state comes from XtrataLedger.run(...).state (localStorage['xt-ledger-state']). The page's Live draw
// needs the per-draw counts (`w`) and the draw list, so both are kept; first-transaction ids are dropped to keep the page small.
import { readFileSync, writeFileSync } from 'node:fs';
const PAGE = new URL('../public/bounty/zdao/tracker/1/index.html', import.meta.url);

export function slimState(state) {
  if (!state || state.v !== 2 || !state.addrs || !state.heads) throw new Error('Not a collector state (v2).');
  const addrs = {};
  for (const [addr, rec] of Object.entries(state.addrs)) {
    const slim = { addr, first: rec.first, last: rec.last, n: rec.n, w: rec.w || [], tx: {}, g: rec.g || {} };
    addrs[addr] = slim;
  }
  return { v: 2, cutoff: state.cutoff, draws: state.draws || [], at: state.at, full: state.full, heads: state.heads, top: state.top, calls: state.calls, sizes: state.sizes || {}, addrs };
}
export function bake(html, state) {
  const line = '  var SNAP = ' + JSON.stringify(slimState(state)) + '; /*SNAP*/';
  const next = html.replace(/^ {2}var SNAP = .*\/\*SNAP\*\/$/m, () => line);
  if (next === html && !html.includes(line)) throw new Error('SNAP line not found in the page.');
  return next;
}
if (process.argv[1] && import.meta.url === new URL('file://' + process.argv[1]).href) {
  const file = process.argv[2];
  if (!file) { console.error('Usage: node scripts/bounty-tracker-bake.mjs state.json'); process.exit(1); }
  const state = JSON.parse(readFileSync(file, 'utf8'));
  writeFileSync(PAGE, bake(readFileSync(PAGE, 'utf8'), state));
  console.log('Baked', Object.keys(state.addrs).length, 'wallets read', state.at);
}
