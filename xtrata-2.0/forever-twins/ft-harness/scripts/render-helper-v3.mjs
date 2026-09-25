#!/usr/bin/env node
// Render templates/forever-twin-helper-v3.clar.tmpl for one collection.
//
//   node scripts/render-helper-v3.mjs <config.json> [out.clar]
//   node scripts/render-helper-v3.mjs --example <config.json> [out.clar]
//
// Config fields (all required unless noted):
//   collectionKey      lowercase key, e.g. "zombie-wabbits"
//   master             Xtrata core principal, e.g. "SP3JN...X743X.xtrata-v3-2-3" (or ".xtrata-v3-2-3" on simnet)
//   source             source NFT contract principal
//   sourceAsset        the source's define-non-fungible-token name, exactly (case-sensitive)
//   group              "G1" (plain owner transfer) or "G2" (source has its own listing market)
//   listingReadFn      G2 only, optional: read-only listing lookup, default "get-listing-in-ustx"
//   payees             [payeeA, payeeB]: two distinct STANDARD principals. Fixed forever at deploy;
//                      each receives exactly half of every fee.
//   initialFeeUstx     starting fee in micro-STX; must be even and <= maxFeeUstx (1 STX = 1000000)
//   maxFeeUstx         ceiling on set-fee, fixed forever at deploy
//   rescueEnabled      true | false  (spec decision D2)
//   rescueDelayBurnBlocks  e.g. 432 (~3 days of Bitcoin blocks)
//   profileTier        must be "S" (standard). Adapters are separate contracts.
//
// The renderer refuses unknown placeholders, never guesses a value, and refuses any
// payee that is not a valid principal. With --example, a payee written as
// "<SOMETHING>" is emitted verbatim: the output is then NOT valid Clarity and cannot
// be deployed by accident. Use --example only for review copies.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const TEMPLATE = join(HERE, '..', 'templates', 'forever-twin-helper-v3.clar.tmpl');

const C32 = '[0-9A-HJKMNP-TV-Z]';
const STANDARD = new RegExp(`^S[PMTN]${C32}{28,41}$`);
const CONTRACT_NAME = /^[a-zA-Z][a-zA-Z0-9_-]{0,127}$/;
const PLACEHOLDER = /^<[A-Z0-9_-]+>$/;

const network = (p) => (/^S[PM]/.test(p) ? 'mainnet' : /^S[TN]/.test(p) ? 'testnet' : null);

function principal(value, field, { contract = 'either' } = {}) {
  if (typeof value !== 'string') throw new Error(`${field} must be a string`);
  const v = value.replace(/^'/, '');
  if (v.startsWith('.')) {
    if (contract === 'no') throw new Error(`${field} must be a standard principal, not a contract`);
    if (!CONTRACT_NAME.test(v.slice(1))) throw new Error(`${field} contract name looks wrong`);
    return v;
  }
  const [addr, name, extra] = v.split('.');
  if (extra !== undefined || !STANDARD.test(addr)) throw new Error(`${field} is not a valid principal: ${value}`);
  if (name !== undefined) {
    if (contract === 'no') throw new Error(`${field} must be a standard principal, not a contract`);
    if (!CONTRACT_NAME.test(name)) throw new Error(`${field} contract name looks wrong`);
  } else if (contract === 'yes') throw new Error(`${field} must be a contract principal`);
  return `'${v}`;
}

export function render(cfg, { example = false } = {}) {
  if (cfg.profileTier !== 'S') throw new Error('profileTier must be "S"; adapters are not rendered from this template');
  if (!/^[a-z0-9][a-z0-9-]{0,39}$/.test(cfg.collectionKey ?? '')) throw new Error('collectionKey looks wrong');
  if (!/^[A-Za-z][A-Za-z0-9-]*$/.test(cfg.sourceAsset ?? '')) throw new Error('sourceAsset looks wrong');
  if (!['G1', 'G2'].includes(cfg.group)) throw new Error('group must be "G1" or "G2"');
  const listingReadFn = cfg.group === 'G2' ? (cfg.listingReadFn ?? 'get-listing-in-ustx') : '';
  if (cfg.group === 'G2' && !/^[a-z][a-z0-9-]*$/.test(listingReadFn)) throw new Error('listingReadFn looks wrong');
  for (const k of ['maxFeeUstx', 'initialFeeUstx', 'rescueDelayBurnBlocks'])
    if (!Number.isSafeInteger(cfg[k]) || cfg[k] < 0) throw new Error(`${k} must be a non-negative integer`);
  if (cfg.initialFeeUstx % 2 !== 0) throw new Error('initialFeeUstx must be even so both payees receive exactly half');
  if (cfg.initialFeeUstx > cfg.maxFeeUstx) throw new Error('initialFeeUstx must not exceed maxFeeUstx');
  if (typeof cfg.rescueEnabled !== 'boolean') throw new Error('rescueEnabled must be boolean');

  const master = principal(cfg.master, 'master', { contract: 'yes' });
  const source = principal(cfg.source, 'source', { contract: 'yes' });

  if (!Array.isArray(cfg.payees) || cfg.payees.length !== 2) throw new Error('payees must be [payeeA, payeeB]');
  const payees = cfg.payees.map((p, i) => {
    if (example && PLACEHOLDER.test(p)) return p;
    return principal(p, `payees[${i}]`, { contract: 'no' });
  });
  if (payees[0] === payees[1]) throw new Error('payees must be two different addresses');
  // a mainnet helper must pay mainnet addresses (and vice versa)
  const net = network(master.replace(/^'/, ''));
  if (net) for (const [i, p] of payees.entries())
    if (!PLACEHOLDER.test(p) && network(p.replace(/^'/, '')) !== net) throw new Error(`payees[${i}] is not a ${net} address`);

  const values = {
    GROUP: cfg.group,
    LISTING_READ_FN: listingReadFn,
    COLLECTION_KEY: cfg.collectionKey,
    MASTER: master,
    SOURCE: source,
    SOURCE_ASSET: cfg.sourceAsset,
    PAYEE_A: payees[0],
    PAYEE_B: payees[1],
    MAX_FEE_USTX: `u${cfg.maxFeeUstx}`,
    INITIAL_FEE_USTX: `u${cfg.initialFeeUstx}`,
    RESCUE_ENABLED: String(cfg.rescueEnabled),
    RESCUE_DELAY_BURN_BLOCKS: `u${cfg.rescueDelayBurnBlocks}`,
  };
  // keep only the blocks for this group; markers themselves are removed
  const drop = cfg.group === 'G1' ? 'G2' : 'G1';
  const tmpl = readFileSync(TEMPLATE, 'utf8')
    .replace(new RegExp(`;;@${drop}-BEGIN\\n[\\s\\S]*?;;@${drop}-END\\n`, 'g'), '')
    .replace(new RegExp(`;;@${cfg.group}-(BEGIN|END)\\n`, 'g'), '');
  if (/;;@G[12]-/.test(tmpl)) throw new Error('unbalanced group markers in template');
  const out = tmpl.replace(/\{\{([A-Z_]+)\}\}/g, (_, k) => {
    if (!(k in values)) throw new Error(`unknown placeholder ${k}`);
    return values[k];
  });
  return example
    ? `;; !!! REVIEW COPY rendered with --example. Placeholders are NOT valid Clarity. Do not deploy. !!!\n${out}`
    : out;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const example = args[0] === '--example';
  if (example) args.shift();
  const [cfgPath, outPath] = args;
  if (!cfgPath) { console.error('usage: render-helper-v3.mjs [--example] <config.json> [out.clar]'); process.exit(2); }
  const out = render(JSON.parse(readFileSync(cfgPath, 'utf8')), { example });
  if (outPath) writeFileSync(outPath, out); else process.stdout.write(out);
}
