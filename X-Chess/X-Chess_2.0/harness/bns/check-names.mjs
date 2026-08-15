// What you own, who holds it, and when it lapses.
//
// A BNS name that expires is not warned about by anybody. It stops resolving,
// then it becomes available, then somebody else has it — and the first two
// steps are silent. For a collection of any size the only defence is a list you
// can re-read, so this prints one.
//
// EVERYTHING COMES FROM THE BNS-V2 REGISTRY, never `/v1/names/<name>`. The
// legacy index answers from a snapshot that can be years stale and will report
// an address that has not held a name since it migrated. `packages/chain/bns.ts`
// carries the same warning for the same reason: a wrong owner here would be
// worse than no answer, because it would tell you a name is safe when it is
// somebody else's.
//
//   node harness/bns/check-names.mjs names.txt
//   node harness/bns/check-names.mjs names.txt --json
//
// One name per line. A trailing `.btc` is stripped, case is ignored, and em and
// en dashes are read as hyphens — BNS labels cannot contain them, and a list
// typed on a phone or pasted through a text field will have them.

import { readFileSync } from 'node:fs';
import { deserializeCV, cvToString } from '@stacks/transactions';

const BNS_V2 = 'SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2';
const [BNS_ADDRESS, BNS_NAME] = BNS_V2.split('.');
const API = 'https://api.mainnet.hiro.so';

/** Any principal will do; a read-only call does not spend from it. */
const SENDER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';

const KEY = process.env.HIRO_API_KEY || readKeyFromEnvFile();
const JSON_OUT = process.argv.includes('--json');

/**
 * Bitcoin blocks, not Stacks blocks.
 *
 * The `.btc` namespace lifetime is 262,800 and renewal heights are compared
 * against the BURN height. Read in post-Nakamoto Stacks blocks the same number
 * would be about five weeks rather than five years, which is exactly the
 * arithmetic that has already gone wrong once in this project — so the units are
 * stated here rather than assumed anywhere.
 */
const MINUTES_PER_BURN_BLOCK = 10;

/**
 * The same places the wizards look, in the same order.
 *
 * Anonymous reads are capped at about fifty a minute, and sixty names is four
 * reads each. Without a key this job cannot finish, and it fails as a wall of
 * 429s that look exactly like names not existing - which is the worst possible
 * way for a tool about not losing things to be wrong.
 */
function readKeyFromEnvFile() {
  const files = [
    new URL('../wizards/.env.wizards', import.meta.url),
    new URL('../../../../xtrata-2.0/.env.local', import.meta.url)
  ];
  for (const file of files) {
    try {
      for (const line of readFileSync(file, 'utf8').split('\n')) {
        const match = /^\s*(HIRO_API_KEYS?|VITE_HIRO_API_KEY)\s*=\s*(.*)$/.exec(line);
        if (match) {
          const value = match[2].trim().replace(/^["']|["']$/g, '').split(/[\s,]+/)[0];
          if (value) return value;
        }
      }
    } catch {
      // No file. Try the next.
    }
  }
  return '';
}

const headers = { 'Content-Type': 'application/json', ...(KEY ? { 'x-api-key': KEY } : {}) };

/**
 * A BNS label, as the registry stores it.
 *
 * Lowercase, and em/en dashes folded to hyphens. That fold is not cosmetic: a
 * name list that has been through a phone keyboard or a rich text field will
 * contain them, they are not legal in a label, and without this every such
 * entry reports NOT FOUND and reads as a lost name.
 */
export function normaliseLabel(raw) {
  return String(raw)
    .trim()
    .replace(/\.btc$/i, '')
    .replace(/[‐-―−]/g, '-')
    .toLowerCase()
    .trim();
}

/** Labels may hold a-z, 0-9, hyphen and underscore. Anything else is not a name. */
const LEGAL_LABEL = /^[a-z0-9\-_]+$/;

const hex = (s) => Buffer.from(s, 'ascii').toString('hex');

async function readOnly(fn, args) {
  const response = await fetch(`${API}/v2/contracts/call-read/${BNS_ADDRESS}/${BNS_NAME}/${fn}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ sender: SENDER, arguments: args })
  });
  if (!response.ok) throw new Error(`${fn} answered ${response.status}`);
  const body = await response.json();
  if (!body.okay) throw new Error(`${fn} failed: ${JSON.stringify(body).slice(0, 120)}`);
  // DESERIALISED, not raw. `body.result` is serialised hex, and reading it as
  // though it were a printed Clarity value silently found nothing in every
  // answer - so a first run reported sixty registered names as non-existent.
  // For a tool whose whole job is "have I lost anything", that is the worst
  // available failure, and it is why the known-good check below exists.
  return cvToString(deserializeCV(body.result));
}

/** The first uint in a printed value: `(some u56554)` -> 56554. */
const firstUint = (repr) => {
  const m = /u(\d+)/.exec(repr ?? '');
  return m ? m[1] : null;
};

/**
 * What the holding wallet is carrying.
 *
 * Reported because a name is rarely the only thing in its wallet, and because
 * the answer bears on whether a seed is being watched: an address holding real
 * STX untouched for years is evidence, though not proof, that nobody else is
 * draining it. It also says whether a wallet can pay its own way - a transfer
 * costs a miner fee and an empty wallet cannot make one.
 */
async function balanceOf(address) {
  // Retried with backoff, and SERIALLY by the caller. The extended API has a
  // tighter allowance than the read-only endpoint, and a first version fired 62
  // of these at once: fifty-four came back 429 and printed as `?`, which reads
  // as an empty wallet. A rate limit that renders as "you own nothing" is the
  // same failure this whole tool exists to avoid.
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const r = await fetch(`${API}/extended/v1/address/${address}/stx`, { headers });
      if (r.ok) return Number((await r.json()).balance) / 1e6;
      if (r.status !== 429) return null;
    } catch {
      // Transport. Same treatment as a 429.
    }
    await new Promise((done) => setTimeout(done, 400 * 2 ** attempt));
  }
  return null;
}

async function burnTip() {
  const info = await fetch(`${API}/v2/info`, { headers }).then((r) => r.json());
  return Number(info.burn_block_height);
}

/* Serialising a uint by hand: 0x01 then 16 big-endian bytes. */
const uintArg = (n) => `01${BigInt(n).toString(16).padStart(32, '0')}`;

/** Clarity buff: 0x02, 4-byte big-endian length, then the bytes. */
function lenPrefixed(ascii) {
  const bytes = Buffer.from(ascii, 'ascii');
  return bytes.length.toString(16).padStart(8, '0') + bytes.toString('hex');
}

// Bare hex, NOT 0x-prefixed. A prefixed argument is accepted and misread, so
// every name came back `none` and the report said sixty names did not exist.
const buffArg = (ascii) => `02${lenPrefixed(ascii)}`;

export async function lookup(label) {
  const row = { label, found: false, owner: null, renewal: null, resolves: false, error: null };
  try {
    const idRepr = await readOnly('get-id-from-bns', [buffArg(label), buffArg('btc')]);
    const id = firstUint(idRepr);
    if (!id) return row;
    row.found = true;
    row.id = id;

    const [ownerRepr, renewRepr, resolveRepr] = await Promise.all([
      readOnly('get-owner', [uintArg(id)]),
      readOnly('get-renewal-height', [uintArg(id)]),
      readOnly('can-resolve-name', [buffArg('btc'), buffArg(label)])
    ]);
    const owner = /(S[PM][0-9A-HJKMNP-TV-Z]{20,})/.exec(ownerRepr);
    row.owner = owner ? owner[1] : null;
    row.renewal = Number(firstUint(renewRepr) ?? 0);
    row.resolves = !/err/i.test(resolveRepr);
  } catch (error) {
    row.error = error.message;
  }
  return row;
}

/** Small, because 60 names is 240 reads and one shared rate limit. */
async function pool(items, width, worker) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(width, items.length) }, async () => {
      for (;;) {
        const at = next++;
        if (at >= items.length) return;
        out[at] = await worker(items[at], at);
      }
    })
  );
  return out;
}

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error('usage: node harness/bns/check-names.mjs <file-of-names> [--json]');
    process.exitCode = 1;
    return;
  }

  const raw = readFileSync(file, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));

  const labels = [...new Set(raw.map(normaliseLabel))].filter(Boolean);
  const illegal = labels.filter((l) => !LEGAL_LABEL.test(l));
  const legal = labels.filter((l) => LEGAL_LABEL.test(l));

  const tip = await burnTip();
  const rows = await pool(legal, 2, lookup);

  const withTime = rows.map((row) => {
    const blocks = row.renewal ? row.renewal - tip : null;
    const days = blocks === null ? null : Math.round((blocks * MINUTES_PER_BURN_BLOCK) / 60 / 24);
    return { ...row, blocksLeft: blocks, daysLeft: days };
  });

  if (JSON_OUT) {
    console.log(JSON.stringify({ burnTip: tip, names: withTime, illegal }, null, 2));
    return;
  }

  const held = withTime.filter((r) => r.found).sort((a, b) => (a.daysLeft ?? 0) - (b.daysLeft ?? 0));
  const missing = withTime.filter((r) => !r.found && !r.error);
  const failed = withTime.filter((r) => r.error);

  console.log(`\nBNS-V2 registry, burn height ${tip}\n`);
  console.log(`${'name'.padEnd(34)} ${'expires in'.padStart(12)}   owner`);
  console.log('-'.repeat(96));
  for (const row of held) {
    const when =
      row.daysLeft === null
        ? 'unknown'
        : row.daysLeft < 0
          ? `LAPSED ${-row.daysLeft}d ago`
          : `${row.daysLeft}d (${(row.daysLeft / 365).toFixed(1)}y)`;
    const flag = row.resolves ? ' ' : '!';
    console.log(`${flag}${`${row.label}.btc`.padEnd(33)} ${when.padStart(12)}   ${row.owner ?? '?'}`);
  }

  console.log(`\n${held.length} held, ${missing.length} not in the registry, ${failed.length} unread`);

  if (missing.length) {
    console.log('\nNOT FOUND — never registered, mistyped, or expired and taken:');
    for (const row of missing) console.log(`  ${row.label}.btc`);
  }
  if (illegal.length) {
    console.log('\nNOT A LEGAL BNS LABEL — a-z, 0-9, hyphen and underscore only:');
    for (const label of illegal) console.log(`  ${label}`);
  }
  if (failed.length) {
    console.log('\nCOULD NOT READ — a failed read is not an expired name; run it again:');
    for (const row of failed) console.log(`  ${row.label}.btc — ${row.error}`);
  }

  const owners = [...new Set(held.map((r) => r.owner).filter(Boolean))];
  const balances = await pool(owners, 1, balanceOf);
  let total = 0;
  let broke = 0;

  console.log(`\nHeld across ${owners.length} address(es):\n`);
  console.log(`${'address'.padEnd(42)} ${'names'.padStart(5)} ${'STX'.padStart(14)}`);
  console.log('-'.repeat(64));
  owners.forEach((owner, at) => {
    const stx = balances[at];
    if (typeof stx === 'number') total += stx;
    // A transfer costs a miner fee. Below this a wallet cannot move its own
    // name without being funded first, which is a separate and slower job.
    if (typeof stx === 'number' && stx < 0.01) broke++;
    const count = held.filter((r) => r.owner === owner).length;
    console.log(
      `${owner.padEnd(42)} ${String(count).padStart(5)} ${(stx === null ? '?' : stx.toFixed(6)).padStart(14)}`
    );
  });
  console.log('-'.repeat(64));
  console.log(`${'total'.padEnd(42)} ${String(held.length).padStart(5)} ${total.toFixed(6).padStart(14)}`);
  if (broke) {
    console.log(`\n${broke} wallet(s) hold under 0.01 STX and cannot pay to move their own name.`);
  }
  console.log('');
}

// Only when run directly. Without this guard, importing anything from here -
// which `rescue.mjs` does, for `lookup` - runs the whole report as a side
// effect and fails on the missing argument.
const invoked = process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop());
if (invoked) {
  main().catch((error) => {
    console.error(`\n${error?.stack ?? error}`);
    process.exitCode = 1;
  });
}
