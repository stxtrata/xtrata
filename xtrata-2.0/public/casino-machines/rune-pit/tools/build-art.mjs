#!/usr/bin/env node
// Builds art/art.js (window.RP_ART), art/manifest.json and art/sources.json for Rune Pit from the two bundled data files:
//   art/runes-source.json      the rune data collected on 2026-11-01 (numbers, names, symbols, supply, block, full etching txids)
//   art/runestone-source.json  the Runestone still (a 128 px WebP of inscription 63140674) and the 19 child inscriptions
// An optional official DOG•GO•TO•THE•MOON logo is bundled only if a file exists at art/images/dog/dog-logo.(png|webp|jpg).
// Nothing is fetched here. Run: node tools/build-art.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const ART = resolve(dirname(fileURLToPath(import.meta.url)), '../art');
const runes = JSON.parse(readFileSync(join(ART, 'runes-source.json'), 'utf8'));
const stone = JSON.parse(readFileSync(join(ART, 'runestone-source.json'), 'utf8'));

// Reel/First Hundred rule: a rune is shown with a plain "#n" when its number was read from ordiscan; otherwise "#n?" and it is listed here.
const list = runes.runes.map(r => ({
  n: r.number, name: r.name, symbol: r.symbol || null, supply: r.supply || null, premineOnly: !!r.supplyIsPremineOnly,
  mint: r.mintTerms ? { cap: r.mintTerms.cap, amountPerMint: r.mintTerms.amountPerMint } : null, block: r.block ?? null, txid: r.txid || null, confirmed: !!r.numberConfirmedOnOrdiscan
}));

// DOG logo: only if a file was supplied.
let dog = null, dogFile = null;
for (const f of ['dog-logo.png', 'dog-logo.webp', 'dog-logo.jpg']) { const p = join(ART, 'images/dog', f); if (existsSync(p)) { const mime = f.endsWith('png') ? 'image/png' : f.endsWith('webp') ? 'image/webp' : 'image/jpeg'; dog = { src: `data:${mime};base64,` + readFileSync(p).toString('base64') }; dogFile = 'images/dog/' + f; break; } }

writeFileSync(join(ART, 'art.js'), `/* Rune Pit bundled art: the Runestone still (a real Runestone inscription preview) and, only if a licensed file was supplied, the\n   official DOG logo. Every rune tile is drawn live from the data in manifest.json; nothing else is bundled. Sources: sources.json.\n   Rebuild with tools/build-art.mjs. */\nwindow.RP_ART=${JSON.stringify({ runestone: stone.still, dog })};\n`);
writeFileSync(join(ART, 'manifest.json'), JSON.stringify({
  machine: 'rune-pit', generated: '2026-11-01',
  note: 'Rune data for every rune tile. "confirmed" is true only where the rune NUMBER was read on ordiscan.com; every other number is derived or inferred and the game shows it as "#n?". Fields are null where no source was found; the game never fills them in.',
  runes: list, runestone: stone.children, runestoneOriginal: stone.original
}, null, 0));

const unverifiedNumbers = list.filter(r => !r.confirmed).map(r => ({ number: r.n, name: r.name }));
writeFileSync(join(ART, 'sources.json'), JSON.stringify({
  machine: 'rune-pit', generated: '2026-11-01',
  rule: 'Every symbol is real Bitcoin material. Rune data below was collected on 2026-11-01. Where a field was not confirmed it is null and the game shows it as unverified; it is never invented.',
  dataMethod: runes.method,
  runes: runes.runes.map(r => ({ number: r.number, numberStatus: r.numberConfirmedOnOrdiscan ? 'confirmed on ordiscan' : 'unverified number (derived or inferred; shown as #n? on screen)', name: r.name, symbol: r.symbol, supply: r.supply, supplyIsPremineOnly: r.supplyIsPremineOnly, divisibility: r.divisibility, premine: r.premine, mintTerms: r.mintTerms, maxSupplyIfFullyMinted: r.maxSupplyIfFullyMinted, block: r.block, etchingTxid: r.txid, runeId: r.runeId, sourceUrl: r.sourceUrl, ordiscanUrl: r.ordiscanUrl, notes: r.notes })),
  unverifiedNumbers,
  gaps: [
    'UNCOMMON•GOODS (#0): symbol, supply, etching block and etching transaction are all unverified (it has no etching transaction). It is shown as a typeset name tile with an unverified number and is excluded from the Etching (scatter) pool.',
    'Runes #45 to #99 were not collected, so the Rune Number tiles and the First Hundred tablet draw from #0 to #44 only.',
    'SATOSHI•NAKAMOTO: 168,000 is the mint CAP; the amount actually minted was not confirmed, so the game states the data (premine plus open-mint terms) and never "fully minted".',
    'Entries marked supplyIsPremineOnly show their supply as the amount at etching only, never as total supply.',
    'RUNES•PROTOCOL (#41) has no symbol in the data; its tile is typeset.'
  ],
  duplicateEtch: runes.duplicateNameNote,
  collectionFailures: runes.failures,
  runestone: { still: stone.imageRecord, listSource: stone.listSource, children: stone.children.length, note: 'Carried over unchanged from the Ordinal Rush build: ' + stone.fetchedOn },
  dogLogo: dog
    ? { status: 'bundled', file: dogFile, source: runes.dogLogo.url, permission: 'confirm with the DOG project before shipping' }
    : { status: 'official logo found, not bundled', url: runes.dogLogo.url, pageUrl: runes.dogLogo.pageUrl, notes: runes.dogLogo.notes, tile: 'The DOG tile is typeset in gold lettering (DOG•GO•TO•THE•MOON with the symbol) until a licensed logo file is placed at art/images/dog/dog-logo.png and tools/build-art.mjs is run again.' },
  logosNeedingPermission: [{ name: 'DOG•GO•TO•THE•MOON official logo', url: runes.dogLogo.url, status: dog ? 'bundled; permission to be confirmed' : 'not bundled; permission and a file are needed' }],
  logosMissing: dog ? [] : ['DOG•GO•TO•THE•MOON official logo (file)'],
  brandAssets: ['Xtrata mark: drawn on the cabinet door with the XLOGO vector code (vendor/xlogo.js, the same trace as the bible SVG).', 'ParallaX Casino wordmark and sign: the bible SVGs, used as given, on the test page header only.']
}, null, 1));
console.log(`art: ${list.length} runes (${unverifiedNumbers.length} with unverified numbers), runestone still + ${stone.children.length} children, DOG logo ${dog ? 'bundled' : 'NOT bundled (typeset tile)'}`);
