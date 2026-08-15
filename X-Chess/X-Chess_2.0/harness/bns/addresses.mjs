// Every address your seeds can reach, and nothing else.
//
// Derivation is local, free and instant — four hundred addresses in a second —
// so this makes no network call at all. It exists to answer "which wallets am I
// even talking about" before anything reads or moves them, and to produce a
// list you can paste straight into `inventory.html`.
//
// IT PRINTS ADDRESSES. It does not print, log or return a phrase or a key, and
// there is a test for that. An address is public by construction; the phrase
// that produced it is the only secret in the room.
//
//   node harness/bns/addresses.mjs                 grouped, with seed and path
//   node harness/bns/addresses.mjs --depth 100     how many accounts per seed
//   node harness/bns/addresses.mjs --plain         bare list, for pasting
//   node harness/bns/addresses.mjs --seed old-hiro just one of them
//   node harness/bns/addresses.mjs --canary        write a pre-loaded inventory page
//
// `--canary` writes `inventory-loaded.html`, which is `inventory.html` with your
// addresses already in the box. It is GITIGNORED and the generic page is not:
// the committed file must stay free of anybody's holdings, because a complete
// inventory tied to one person is a different thing from sixty public addresses.
// Add `--names <file>` and the owners of those names are folded in too, which is
// how the wallets a seed CANNOT reach still get inventoried.
//
// Reads `harness/bns/.seed`. Same file, same mode-600 check, same refusal to
// continue past a line whose checksum fails.

import { readFileSync, writeFileSync } from 'node:fs';
import { DERIVATION_PATHS, deriveAllAccounts, readSeeds, scrub } from './rescue.mjs';

const arg = (name, fallback = null) => {
  const at = process.argv.indexOf(`--${name}`);
  return at > -1 && process.argv[at + 1] ? process.argv[at + 1] : fallback;
};
const PLAIN = process.argv.includes('--plain');
const CANARY = process.argv.includes('--canary');

/**
 * The page, with the addresses already in it.
 *
 * Injected into the textarea rather than into a script, so the result is still
 * an ordinary page with an ordinary editable field - you can delete a line, add
 * one, and nothing here has to know. Escaped, because an address that closed the
 * tag early would produce a page that silently inventories half a list.
 */
function writeCanary(addresses) {
  const template = new URL('./inventory.html', import.meta.url);
  const out = new URL('./inventory-loaded.html', import.meta.url);
  const html = readFileSync(template, 'utf8');

  const escaped = addresses
    .join('\n')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const opening = /<textarea id="addresses"[^>]*>/.exec(html);
  if (!opening) throw new Error('inventory.html has no addresses textarea to fill.');
  const start = opening.index + opening[0].length;
  const end = html.indexOf('</textarea>', start);
  if (end === -1) throw new Error('inventory.html has an unclosed textarea.');

  writeFileSync(out, html.slice(0, start) + escaped + html.slice(end), 'utf8');
  return { path: out.pathname, count: addresses.length };
}

function main() {
  const depth = Number(arg('depth', '100'));
  const only = arg('seed');
  const seeds = readSeeds().filter((seed) => !only || seed.label === only);

  if (!seeds.length) {
    throw new Error(`no seed labelled "${only}" in the file.`);
  }

  if (CANARY) {
    const derived = [...deriveAllAccounts(seeds, depth).keys()];

    // The owners of your names go in too, INCLUDING the ones no seed reaches.
    // Those are the wallets most worth inventorying: unreachable means the
    // rescue will not touch them, so what they hold has to be known rather than
    // assumed.
    const namesFile = arg('names');
    let owners = [];
    if (namesFile) {
      owners = [...new Set(readFileSync(namesFile, 'utf8').match(/\bS[PM][0-9A-HJKMNP-TV-Z]{20,}\b/g) ?? [])];
    }

    const all = [...new Set([...derived, ...owners])];
    const written = writeCanary(all);
    console.error(
      `\nWrote ${written.path}\n` +
        `  ${derived.length} derived from ${seeds.length} seed(s) at depth ${depth}\n` +
        (namesFile ? `  ${owners.length} name owners from ${namesFile}\n` : '') +
        `  ${all.length} unique addresses in the box\n\n` +
        'Gitignored. Open it, put your Hiro key in, and take the inventory.\n'
    );
    return;
  }

  if (PLAIN) {
    // Deduplicated across seeds, because that is what the inventory page wants:
    // a wallet reached by two seeds is still one wallet.
    for (const address of deriveAllAccounts(seeds, depth).keys()) console.log(address);
    return;
  }

  console.error(
    `\n${seeds.length} seed(s), ${depth} accounts each on ` +
      `${DERIVATION_PATHS.length} derivation conventions.\n` +
      'No network calls. Nothing here is secret: these are public addresses.\n'
  );

  let total = 0;
  for (const seed of seeds) {
    // Derived per seed for the grouped view, so each address is shown under the
    // seed that reaches it. `deriveAllAccounts` dedupes across seeds, which is
    // right for a paste list and wrong for a report.
    const accounts = deriveAllAccounts([seed], depth);
    console.error(`--- ${seed.label} — ${accounts.size} addresses ---`);
    for (const account of accounts.values()) {
      console.log(`${account.address}\t${account.path}\t${seed.label}`);
    }
    console.error('');
    total += accounts.size;
  }

  const unique = deriveAllAccounts(seeds, depth).size;
  console.error(
    `${total} derived, ${unique} unique${
      total === unique ? '' : ` — ${total - unique} address(es) reached by more than one seed`
    }.\n` +
      `Pipe to a file, or use --plain for a bare list to paste into inventory.html.\n`
  );
}

try {
  main();
} catch (error) {
  // Scrubbed by shape, because a phrase can reach a stack trace through a
  // library that never meant to put it there.
  console.error(`\n${scrub(error?.message ?? String(error))}\n`);
  process.exitCode = 1;
}
