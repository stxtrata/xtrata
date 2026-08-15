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
//
// Reads `harness/bns/.seed`. Same file, same mode-600 check, same refusal to
// continue past a line whose checksum fails.

import { DERIVATION_PATHS, deriveAllAccounts, readSeeds, scrub } from './rescue.mjs';

const arg = (name, fallback = null) => {
  const at = process.argv.indexOf(`--${name}`);
  return at > -1 && process.argv[at + 1] ? process.argv[at + 1] : fallback;
};
const PLAIN = process.argv.includes('--plain');

function main() {
  const depth = Number(arg('depth', '100'));
  const only = arg('seed');
  const seeds = readSeeds().filter((seed) => !only || seed.label === only);

  if (!seeds.length) {
    throw new Error(`no seed labelled "${only}" in the file.`);
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
