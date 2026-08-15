// Moving a name collection off a seed you no longer trust.
//
// BNS v1 allowed one name per address, so a collector of any size ended up with
// one wallet per name — sixty-two of them here, all from a single seed at
// different derivation indices. BNS-V2 lifted that limit, `transfer` costs
// nothing but a miner fee, and `name-renewal` asserts
// `(is-eq contract-caller owner)` — so every one of those wallets has to sign
// for itself either way. Sixty-two signatures now, while the derivation is
// known, or sixty-two in five years, from a seed you may no longer be able to
// reconstruct.
//
// THE ORDER MATTERS AND IT ONLY WORKS ONE WAY.
//
//   1. transfer the NAME, paying a miner fee out of the wallet
//   2. sweep the STX REMAINDER
//
// Sweeping first strands the name: a wallet at zero cannot pay the fee to move
// anything, and the name is then locked in a wallet that also cannot renew it.
// So the sweep is always second, always after the transfer has been accepted,
// and always leaves the fee for itself.
//
// WHAT THIS FILE NEVER DOES.
//
// It does not take a seed on the command line, print one, log one, or write one
// anywhere. The phrase is read from a file you control and every derived key is
// scrubbed by shape on its way to any output. A key in shell history is a key in
// a backup you forgot about.
//
//   node harness/bns/rescue.mjs --names names.txt
//   node harness/bns/rescue.mjs --names names.txt --live --to SP…
//
// Dry by default. This spends real money and moves permanent assets, so the
// default has to be the one that costs nothing.

import { readFileSync, existsSync, statSync } from 'node:fs';
import { mnemonicToSeedSync, validateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english.js';
import { HDKey } from '@scure/bip32';
import {
  Cl,
  privateKeyToAddress,
  makeContractCall,
  makeSTXTokenTransfer,
  broadcastTransaction,
  Pc,
  PostConditionMode,
  fetchNonce
} from '@stacks/transactions';
import { createApiKeyMiddleware, createFetchFn } from '@stacks/common';
import { lookup, normaliseLabel } from './check-names.mjs';

const BNS_V2 = 'SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2';
const [BNS_ADDRESS, BNS_NAME] = BNS_V2.split('.');
const API = 'https://api.mainnet.hiro.so';
const SEED_FILE = new URL('./.seed', import.meta.url);

/* ------------------------------------------------------------------ */
/* the rules that keep this from being the mistake it is preventing     */
/* ------------------------------------------------------------------ */

/** Refused before anything is signed. Never thrown after a broadcast. */
export class RescueError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RescueError';
  }
}

/**
 * The only contract this may call.
 *
 * An allow-list, not a check on an argument. A key with real STX behind it that
 * can call any contract can be talked into calling one that empties it, and the
 * whole premise here is a seed somebody else may already hold.
 */
export const ALLOWED_CONTRACT = BNS_V2;

/** And the only function on it. Not `list-in-ustx`, not `mng-transfer`. */
export const ALLOWED_FUNCTION = 'transfer';

/** Anything key-shaped, wherever it turns up. 64 hex, or 66 with the suffix. */
export const KEY_SHAPED = /\b[0-9a-fA-F]{64,66}\b/g;

/** A BIP39 phrase is 12 or 24 words. Redacted by shape, like a key. */
export const PHRASE_SHAPED = /\b(?:[a-z]{3,8}\s+){11,23}[a-z]{3,8}\b/gi;

export const scrub = (text) =>
  String(text ?? '')
    .replace(KEY_SHAPED, '<key redacted>')
    .replace(PHRASE_SHAPED, '<phrase redacted>');

/**
 * A miner fee, set rather than estimated.
 *
 * The fee estimator is a network call on a shared rate limit, and a run that
 * dies partway through 124 transactions because the estimator was throttled is
 * a run that has already spent money. Measured on this contract: 3,000 µSTX is
 * comfortably enough and has never been rejected.
 */
export const FEE_USTX = 3_000n;

/**
 * What a wallet must hold before it can be rescued at all.
 *
 * Two fees: one to move the name, one to sweep what is left. A wallet below
 * this has to be funded first, which is a slower and more deliberate job — and
 * on a possibly-watched seed, funding is the one action that can feed an
 * adversary, so it is never done automatically here.
 */
export const MINIMUM_USTX = FEE_USTX * 2n;

/** Never move a name to a destination that is not a mainnet principal. */
const MAINNET_ADDRESS = /^S[PM][0-9A-HJKMNP-TV-Z]{20,}$/;
export const looksLikeMainnetAddress = (value) =>
  typeof value === 'string' && MAINNET_ADDRESS.test(value.trim());

/**
 * May this be broadcast?
 *
 * Every refusal is a throw and every one happens before a signature exists.
 */
export function assertRescueAllowed({
  live,
  contract,
  functionName,
  senderAddress,
  destination,
  balanceUstx
}) {
  if (!live) throw new RescueError('dry run: nothing is signed without --live.');
  if (contract !== undefined && contract !== ALLOWED_CONTRACT) {
    throw new RescueError(`may only call ${ALLOWED_CONTRACT}, not ${contract}.`);
  }
  if (functionName !== undefined && functionName !== ALLOWED_FUNCTION) {
    throw new RescueError(`may only call ${ALLOWED_FUNCTION}, not ${functionName}.`);
  }
  if (!looksLikeMainnetAddress(senderAddress)) {
    throw new RescueError(`${senderAddress} is not a mainnet address.`);
  }
  if (!looksLikeMainnetAddress(destination)) {
    throw new RescueError(`destination ${destination} is not a mainnet address.`);
  }
  // The one that catches the worst mistake available: rescuing a wallet TO
  // itself, which spends two fees and moves nothing off the suspect seed.
  if (senderAddress === destination) {
    throw new RescueError(`destination ${destination} is the wallet being rescued.`);
  }
  if (balanceUstx !== undefined && BigInt(balanceUstx) < MINIMUM_USTX) {
    throw new RescueError(
      `${senderAddress} holds ${balanceUstx} uSTX, under the ${MINIMUM_USTX} needed for a ` +
        'transfer and a sweep. Fund it first, deliberately.'
    );
  }
  return true;
}

/* ------------------------------------------------------------------ */
/* derivation                                                          */
/* ------------------------------------------------------------------ */

/**
 * Both conventions, because this project has already met both.
 *
 * Stacks wallets have used the account index in two different positions. The
 * inscription scripts here derive at `m/44'/5757'/0'/0/N`; the mainnet deployer
 * for this repo lives at `m/44'/5757'/3'/0/0`. A tool that searched only one
 * would report half a collection as unreachable and be believed.
 */
export const DERIVATION_PATHS = Object.freeze([
  (n) => `m/44'/5757'/${n}'/0/0`,
  (n) => `m/44'/5757'/0'/0/${n}`
]);

/**
 * Every address this seed can reach, up to `depth` on each convention.
 *
 * Returns addresses paired with their keys. The caller matches against the
 * addresses; the keys never leave this process.
 */
export function deriveAccounts(phrase, depth = 100) {
  if (!validateMnemonic(phrase, wordlist)) {
    throw new RescueError('that is not a valid BIP39 phrase (checksum failed).');
  }
  const root = HDKey.fromMasterSeed(mnemonicToSeedSync(phrase));
  const found = new Map();
  for (const path of DERIVATION_PATHS) {
    for (let n = 0; n < depth; n++) {
      const at = path(n);
      const node = root.derive(at);
      if (!node.privateKey) continue;
      const key = `${Buffer.from(node.privateKey).toString('hex')}01`;
      const address = privateKeyToAddress(key);
      if (!found.has(address)) found.set(address, { address, key, path: at });
    }
  }
  return found;
}

/* ------------------------------------------------------------------ */
/* the network                                                         */
/* ------------------------------------------------------------------ */

const HIRO_KEY = (() => {
  for (const name of ['HIRO_API_KEYS', 'HIRO_API_KEY', 'VITE_HIRO_API_KEY']) {
    const value = process.env[name];
    if (value) return String(value).split(/[\s,]+/)[0];
  }
  for (const file of [
    new URL('../wizards/.env.wizards', import.meta.url),
    new URL('../../../../xtrata-2.0/.env.local', import.meta.url)
  ]) {
    try {
      for (const line of readFileSync(file, 'utf8').split('\n')) {
        const match = /^\s*(HIRO_API_KEYS?|VITE_HIRO_API_KEY)\s*=\s*(.*)$/.exec(line);
        if (match) {
          const value = match[2].trim().replace(/^["']|["']$/g, '').split(/[\s,]+/)[0];
          if (value) return value;
        }
      }
    } catch {
      // Next file.
    }
  }
  return '';
})();

const headers = { 'Content-Type': 'application/json', ...(HIRO_KEY ? { 'x-api-key': HIRO_KEY } : {}) };

/**
 * The library's own fetch, keyed.
 *
 * `@stacks/transactions` makes network calls this file never sees — the nonce,
 * the broadcast — and keying only our own requests would leave those anonymous.
 * The wizards learned this when a live run died on a 429 from an endpoint the
 * script does not call.
 */
const CLIENT = HIRO_KEY
  ? { baseUrl: API, fetch: createFetchFn(createApiKeyMiddleware({ apiKey: HIRO_KEY })) }
  : { baseUrl: API };

/** Retried, because a 429 that reads as "no balance" would strand a wallet. */
async function getJson(path, tries = 4) {
  for (let attempt = 0; attempt < tries; attempt++) {
    try {
      const response = await fetch(`${API}${path}`, { headers });
      if (response.ok) return await response.json();
      if (response.status !== 429) return null;
    } catch {
      // Same treatment.
    }
    await new Promise((done) => setTimeout(done, 500 * 2 ** attempt));
  }
  return null;
}

const balanceOf = async (address) => {
  const body = await getJson(`/extended/v1/address/${address}/stx`);
  return body ? BigInt(body.balance) : null;
};

/** Names held, straight from the registry's own NFT holdings. */
async function namesHeldBy(address) {
  const body = await getJson(
    `/extended/v1/tokens/nft/holdings?principal=${address}` +
      `&asset_identifiers=${BNS_V2}::BNS-V2&limit=200`
  );
  if (!body?.results) return [];
  return body.results
    .map((row) => {
      const raw = row?.value?.repr ?? '';
      const m = /u(\d+)/.exec(raw);
      return m ? Number(m[1]) : null;
    })
    .filter((id) => id !== null);
}

/* ------------------------------------------------------------------ */
/* the run                                                             */
/* ------------------------------------------------------------------ */

const arg = (name, fallback = null) => {
  const at = process.argv.indexOf(`--${name}`);
  return at > -1 && process.argv[at + 1] ? process.argv[at + 1] : fallback;
};
const LIVE = process.argv.includes('--live');
const ustx = (micro) => `${(Number(micro) / 1e6).toFixed(6)} STX`;

/**
 * The phrase, from a file, checked for permissions before it is read.
 *
 * A world-readable seed file on a machine that may already have leaked one is
 * not a thing to warn about after the fact.
 */
function readPhrase() {
  if (!existsSync(SEED_FILE)) {
    throw new RescueError(
      `no seed file. Write the phrase to harness/bns/.seed and chmod 600 it.\n` +
        'It is gitignored. It is never printed, logged, or sent anywhere.'
    );
  }
  const mode = statSync(SEED_FILE).mode & 0o777;
  if (mode & 0o077) {
    throw new RescueError(
      `harness/bns/.seed is mode ${mode.toString(8)} — other users on this machine can read it. ` +
        'chmod 600 it first.'
    );
  }
  const phrase = readFileSync(SEED_FILE, 'utf8').trim().replace(/\s+/g, ' ');
  if (!phrase) throw new RescueError('harness/bns/.seed is empty.');
  return phrase;
}

async function main() {
  const destination = arg('to');
  console.log('\nBNS rescue — moving names and STX off a seed you no longer trust');
  console.log(`registry   ${BNS_V2}`);
  console.log(LIVE ? 'mode       LIVE — this signs and broadcasts\n' : 'mode       dry run, nothing is sent\n');

  const phrase = readPhrase();
  const accounts = deriveAccounts(phrase, Number(arg('depth', '100')));
  console.log(`derived    ${accounts.size} addresses across ${DERIVATION_PATHS.length} conventions`);

  // THE NAME LIST FIRST, then the seed, then the intersection.
  //
  // A first version asked the network what every derived address held, which at
  // a depth worth using is eight hundred requests for sixty-two answers - and
  // the extended API throttles long before that. Derivation is local and free
  // (four hundred addresses in a second), and the owners are already known from
  // the registry, so matching happens in memory and only the HITS are queried.
  //
  // It also produces the report that matters more than the balances: which of
  // your names this seed cannot reach at all.
  const namesFile = arg('names');
  if (!namesFile) {
    throw new RescueError(
      'needs --names <file>, the same list you gave check-names.mjs.\n' +
        'Without it this would have to ask the network about every derived address.'
    );
  }
  const labels = [
    ...new Set(
      readFileSync(namesFile, 'utf8')
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#'))
        .map(normaliseLabel)
    )
  ].filter(Boolean);

  console.log(`reading    ${labels.length} names from the registry...`);
  const registry = [];
  for (const label of labels) {
    const row = await lookup(label);
    if (row.found && row.owner) registry.push(row);
  }

  const reachable = registry.filter((row) => accounts.has(row.owner));
  const unreachable = registry.filter((row) => !accounts.has(row.owner));
  console.log(
    `matched    ${reachable.length} of ${registry.length} names to this seed\n`
  );

  if (unreachable.length) {
    console.log(`NOT REACHABLE FROM THIS SEED — a different wallet holds these:`);
    for (const row of unreachable) console.log(`  ${row.label}.btc  ${row.owner}`);
    console.log(`  (try a greater --depth before concluding they are elsewhere)\n`);
  }

  // Only the matched addresses are asked about, and only once each.
  const byAddress = new Map();
  for (const row of reachable) {
    if (!byAddress.has(row.owner)) byAddress.set(row.owner, []);
    byAddress.get(row.owner).push(Number(row.id));
  }

  // EVERY derived address is balance-checked, not only the ones holding a name.
  //
  // Some of these wallets hold STX and no name at all - a name was sold, or one
  // was never bought there. Scanning only the name-holders would sweep the
  // collection and quietly leave money behind on the same suspect seed, which
  // is the failure that looks like success.
  //
  // Serial with backoff: the extended API throttles hard, and a throttled read
  // here reads as an empty wallet.
  console.log(`checking   ${accounts.size} derived addresses for STX...`);
  const rows = [];
  for (const account of accounts.values()) {
    const names = byAddress.get(account.address) ?? [];
    const balance = (await balanceOf(account.address)) ?? 0n;
    if (!names.length && balance === 0n) continue;
    rows.push({ ...account, balance, names });
  }

  const withNames = rows.filter((r) => r.names.length);
  const totalStx = rows.reduce((sum, r) => sum + r.balance, 0n);

  console.log(`holding    ${withNames.length} wallets with names, ${ustx(totalStx)} across ${rows.length}\n`);
  console.log(`${'path'.padEnd(24)} ${'address'.padEnd(42)} ${'names'.padStart(5)} ${'STX'.padStart(12)}`);
  console.log('-'.repeat(88));
  for (const row of rows) {
    const flag = row.balance < MINIMUM_USTX && row.names.length ? '!' : ' ';
    console.log(
      `${flag}${row.path.padEnd(23)} ${row.address.padEnd(42)} ` +
        `${String(row.names.length).padStart(5)} ${ustx(row.balance).padStart(12)}`
    );
  }

  const stranded = rows.filter((r) => r.names.length && r.balance < MINIMUM_USTX);
  if (stranded.length) {
    console.log(
      `\n! ${stranded.length} wallet(s) hold a name but under ${ustx(MINIMUM_USTX)} — ` +
        'they cannot pay to move it and are SKIPPED.\n' +
        '  Fund them deliberately, then run again. Funding is the one step that can feed\n' +
        '  a watcher, so it is never automatic here.'
    );
  }

  const movable = rows.filter((r) => r.names.length && r.balance >= MINIMUM_USTX);
  console.log(
    `\nWould move ${movable.reduce((n, r) => n + r.names.length, 0)} name(s) ` +
      `and sweep ${ustx(movable.reduce((s, r) => s + r.balance - FEE_USTX * 2n, 0n))} ` +
      `from ${movable.length} wallet(s).`
  );

  if (!LIVE) {
    console.log('\nDry run. Nothing was signed.');
    console.log('Add --live --to SP… to move it. None of it can be undone.\n');
    return;
  }
  if (!destination) throw new RescueError('--live needs --to SP… , and it has to be typed.');

  for (const row of movable) {
    let nonce = await fetchNonce({ address: row.address, client: CLIENT });

    for (const id of row.names) {
      assertRescueAllowed({
        live: LIVE,
        contract: ALLOWED_CONTRACT,
        functionName: ALLOWED_FUNCTION,
        senderAddress: row.address,
        destination,
        balanceUstx: row.balance
      });
      const tx = await makeContractCall({
        contractAddress: BNS_ADDRESS,
        contractName: BNS_NAME,
        functionName: ALLOWED_FUNCTION,
        functionArgs: [Cl.uint(id), Cl.principal(row.address), Cl.principal(destination)],
        senderKey: row.key,
        network: 'mainnet',
        fee: FEE_USTX,
        nonce,
        // The name moves and nothing else should. Deny with no STX conditions
        // says exactly that: any STX transfer at all fails the transaction.
        postConditionMode: PostConditionMode.Deny,
        postConditions: [],
        client: CLIENT
      });
      const sent = await broadcastTransaction({ transaction: tx, client: CLIENT });
      console.log(`  name ${id} -> ${destination}  ${sent.txid ?? scrub(JSON.stringify(sent))}`);
      nonce += 1n;
    }

    // SECOND, always. The transfers above have each spent a fee, so sweep what
    // is actually left rather than what the wallet held when we read it.
    const left = await balanceOf(row.address);
    const amount = (left ?? 0n) - FEE_USTX;
    if (amount <= 0n) {
      console.log(`  ${row.address} has nothing left to sweep`);
      continue;
    }
    const sweep = await makeSTXTokenTransfer({
      recipient: destination,
      amount,
      senderKey: row.key,
      network: 'mainnet',
      fee: FEE_USTX,
      nonce,
      client: CLIENT,
      postConditionMode: PostConditionMode.Deny,
      postConditions: [Pc.principal(row.address).willSendLte(amount).ustx()]
    });
    const swept = await broadcastTransaction({ transaction: sweep, client: CLIENT });
    console.log(`  swept ${ustx(amount)} -> ${destination}  ${swept.txid ?? scrub(JSON.stringify(swept))}`);
  }

  console.log('\nDone. Check every txid before assuming anything landed.\n');
}

const invoked = process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop());
if (invoked) {
  main().catch((error) => {
    const refusal = error instanceof RescueError || error?.name === 'RescueError';
    console.error(`\n${refusal ? error.message : scrub(error?.stack ?? String(error))}\n`);
    process.exitCode = 1;
  });
}
