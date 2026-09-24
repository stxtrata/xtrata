#!/usr/bin/env node
// Render forever-twin-helper-v2 for one source collection.
//   node scripts/render-helper.mjs <config.json> [out.clar]
// Config fields (all required):
//   collectionKey  short stable key, e.g. "zombie-wabbits"
//   master         "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3" or ".xtrata-v3-2-3" (simnet)
//   source         full source contract id, or ".name" for simnet
//   sourceAsset    native NFT asset name from (define-non-fungible-token ...) — CASE SENSITIVE
//   maxFeeUstx     hard ceiling for set-fee, fixed at deploy
//   rescueEnabled  true | false  (spec decision D2)
//   rescueDelayBurnBlocks  e.g. 432 (~3 days of Bitcoin blocks)
//   profileTier    must be "S" (standard). Anything else is refused: adapters are separate contracts.
//   group          "G1" (plain owner transfer) or "G2" (source has its own listing market)
//   listingReadFn  G2 only: the source's read-only listing lookup, default "get-listing-in-ustx"
//                  (must return an optional; its tuple shape does not matter)
// The renderer refuses unknown placeholders and never guesses a value.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const TEMPLATE = join(here, '..', 'templates', 'forever-twin-helper-v2.clar.tmpl');

const principal = (v, field) => {
  if (/^\.[a-z][a-z0-9-]*$/.test(v)) return v;
  if (/^S[PMT][0-9A-Z]{28,40}\.[a-zA-Z][a-zA-Z0-9-]*$/.test(v)) return `'${v}`;
  throw new Error(`${field}: not a contract principal: ${v}`);
};

export function render(cfg) {
  if (cfg.profileTier !== 'S') throw new Error(`profileTier ${cfg.profileTier}: only tier S sources may use the standard template`);
  if (!/^[a-z0-9-]{1,40}$/.test(cfg.collectionKey)) throw new Error('collectionKey must be [a-z0-9-]{1,40}');
  if (!/^[A-Za-z][A-Za-z0-9-]*$/.test(cfg.sourceAsset)) throw new Error('sourceAsset looks wrong');
  for (const k of ['maxFeeUstx', 'rescueDelayBurnBlocks']) if (!Number.isInteger(cfg[k]) || cfg[k] < 0) throw new Error(`${k} must be a non-negative integer`);
  if (typeof cfg.rescueEnabled !== 'boolean') throw new Error('rescueEnabled must be boolean');
  if (!['G1', 'G2'].includes(cfg.group)) throw new Error('group must be "G1" or "G2"');
  const listingReadFn = cfg.group === 'G2' ? (cfg.listingReadFn ?? 'get-listing-in-ustx') : '';
  if (cfg.group === 'G2' && !/^[a-z][a-z0-9-]*$/.test(listingReadFn)) throw new Error('listingReadFn looks wrong');
  const values = {
    GROUP: cfg.group,
    LISTING_READ_FN: listingReadFn,
    COLLECTION_KEY: cfg.collectionKey,
    MASTER: principal(cfg.master, 'master'),
    SOURCE: principal(cfg.source, 'source'),
    SOURCE_ASSET: cfg.sourceAsset,
    MAX_FEE_USTX: String(cfg.maxFeeUstx),
    RESCUE_ENABLED: String(cfg.rescueEnabled),
    RESCUE_DELAY_BURN_BLOCKS: String(cfg.rescueDelayBurnBlocks),
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
  return out;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [cfgPath, outPath] = process.argv.slice(2);
  if (!cfgPath) { console.error('usage: render-helper.mjs <config.json> [out.clar]'); process.exit(2); }
  const text = render(JSON.parse(readFileSync(cfgPath, 'utf8')));
  if (outPath) writeFileSync(outPath, text); else process.stdout.write(text);
}
