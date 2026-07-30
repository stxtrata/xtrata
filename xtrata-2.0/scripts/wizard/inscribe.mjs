#!/usr/bin/env node
/**
 * inscribe.mjs — the wizard inscribe skill. Plan stage 2.
 *
 * DRY RUN BY DEFAULT. With no flags this needs no private key, signs nothing
 * and broadcasts nothing. It composes the entry, chunks it, computes the core
 * final hash, builds the exact Clarity call, and quotes the fee live from the
 * contract so the number it prints is the number you will actually pay.
 *
 * The live quote is a read-only call. It moves no funds. Pass --offline to skip
 * the network entirely and fall back to a labelled estimate.
 *
 * Dry run (safe, no key):
 *   node scripts/wizard/inscribe.mjs
 *   node scripts/wizard/inscribe.mjs --wizard skeptic --subject chunk-size \
 *     --thread t-2026-07-30-a --position 2 --parents 1234 \
 *     --parent-quote "the claim being answered"
 *
 * Read the whole thread and its manifest without any network:
 *   node scripts/wizard/inscribe.mjs --preview-thread --subject what-was-retired
 *
 * Broadcast (real mainnet transaction, spends real STX, irreversible):
 *   WIZARD_KEY_ARCHIVIST=<hex> node scripts/wizard/inscribe.mjs --broadcast
 *
 * Before it will broadcast, every one of these must hold:
 *   - the kill switch is off
 *   - the matching WIZARD_KEY_<WIZARD> env var is set
 *   - the payload is exactly one chunk
 *   - the contract says the mint is single-transaction eligible
 *   - every quoted parent fragment is present in that parent's own on-chain
 *     bytes, and the credited wizard really created it
 *   - the core contract is not paused
 *   - the wallet balance is above the floor
 *   - protocol fee plus miner fee is within the per-run spend cap
 *
 * A dry run also reports four advisory preflight checks that never block:
 * whole-thread affordability, duplicate content, the wallet's pending nonce,
 * and the post-condition the broadcast would carry.
 *
 * See scripts/wizard/README.md.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { sha256 } from '@noble/hashes/sha256';
import {
  AnchorMode,
  FungibleConditionCode,
  PostConditionMode,
  TransactionVersion,
  broadcastTransaction,
  bufferCV,
  cvToHex,
  cvToJSON,
  getAddressFromPrivateKey,
  hexToCV,
  listCV,
  makeContractCall,
  makeStandardSTXPostCondition,
  stringAsciiCV,
  uintCV
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';

import {
  CHUNK_SIZE,
  composeEntry,
  composeThread,
  groupDigits,
  microStxToStx,
  parseEntry,
  personaForPosition
} from './compose.mjs';
import { PERSONA_IDS, SUBJECT_IDS, getPersona, getSubject } from './personas.mjs';

export { CHUNK_SIZE, groupDigits, microStxToStx };

const HERE = dirname(fileURLToPath(import.meta.url));

export const CORE_ADDRESS = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
export const CORE_NAME = 'xtrata-v3-2-3';
export const CORE_CONTRACT = `${CORE_ADDRESS}.${CORE_NAME}`;

export const DEFAULT_HIRO_URL = 'https://api.hiro.so';
export const MAX_SINGLE_TX_CHUNKS = 32;
export const MODE_SINGLE_TX = 2;
export const MIME = 'text/markdown';

/** Safety rails. Plan section 4.4. All overridable, none removable. */
export const DEFAULT_SPEND_CAP_USTX = 500_000n;
export const DEFAULT_BALANCE_FLOOR_USTX = 1_000_000n;
export const DEFAULT_MAX_TX_FEE_USTX = 30_000n;

/**
 * Used only when --offline is set. Labelled as an estimate everywhere it is
 * printed, and never accepted as the basis for a broadcast.
 */
export const OFFLINE_FEE_ESTIMATE_USTX = 11_000n;

export const KILL_FILE = join(HERE, 'KILL');

/**
 * The env file the provisioning canary tells the operator to create.
 *
 * provision.mjs reads it; this script did not, so a key saved exactly where
 * provisioning said to put it was still invisible here and --broadcast refused
 * with "no key" after the operator had done everything right. Load it, but let
 * a real environment variable win, so an exported key or a CI secret still
 * overrides the file.
 */
export const ENV_FILE = join(HERE, '.env.wizards');

/** How the env file is named to a human, since ENV_FILE is an absolute path. */
export const ENV_FILE_LABEL = 'scripts/wizard/.env.wizards';

/** Placeholder thread id. Fine for a dry run, refused for a broadcast. */
export const DEMO_THREAD_ID = 't-demo-0001';

export function loadWizardEnv({ path = ENV_FILE, env = process.env, readFile = readFileSync } = {}) {
  if (!existsSync(path)) return env;
  for (const rawLine of String(readFile(path, 'utf8')).split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim().replace(/^export\s+/, '');
    let value = line.slice(eq + 1).trim();
    if (/^".*"$/.test(value) || /^'.*'$/.test(value)) value = value.slice(1, -1);
    if (key && env[key] === undefined) env[key] = value;
  }
  return env;
}

/** Thrown by every safety refusal, so callers can tell a rail from a bug. */
export class WizardSafetyError extends Error {
  constructor(message) {
    super(message);
    this.name = 'WizardSafetyError';
  }
}

/* ------------------------------------------------------------------ */
/* payload                                                             */
/* ------------------------------------------------------------------ */

/** Split bytes on the core chunk boundary. */
export function chunkBytes(bytes) {
  const chunks = [];
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) chunks.push(bytes.subarray(i, i + CHUNK_SIZE));
  return chunks.length ? chunks : [bytes.subarray(0, 0)];
}

/**
 * The core final hash. H0 is 32 zero bytes, Hi is sha256(H(i-1) || chunk_i).
 * Empty input still folds once, over no chunk bytes, which is what the contract
 * computes. Copied deliberately from scripts/inscribe-xip-corpus.mjs so the two
 * cannot drift.
 */
export function finalHash(bytes) {
  let h = new Uint8Array(32);
  if (bytes.length === 0) return sha256(h);
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    const chunk = bytes.subarray(i, i + CHUNK_SIZE);
    const buffer = new Uint8Array(h.length + chunk.length);
    buffer.set(h, 0);
    buffer.set(chunk, h.length);
    h = sha256(buffer);
  }
  return h;
}

export const toHex = (bytes) => `0x${Buffer.from(bytes).toString('hex')}`;

/** Default token uri for a wizard entry. Kept short and inside the 256 ascii bound. */
export const tokenUriFor = ({ threadId, position, wizardId, manifest = false }) =>
  manifest ? `xtrata:wizard/${threadId}/manifest` : `xtrata:wizard/${threadId}/${position}/${wizardId}`;

/**
 * Build the exact Clarity call for a body.
 *
 * A thread parent becomes a core *dependency* edge, so the narrowest function
 * that fits is mint-single-tx-recursive when there are parents and
 * mint-single-tx when there are none. The core's own `parents` argument means
 * supersession and requires the sender to own each id, which is impossible
 * between three separate wizard wallets.
 */
export function buildMintCall({ body, mime = MIME, tokenUri, parentIds = [] }) {
  if (typeof body !== 'string' || body.length === 0) {
    throw new WizardSafetyError('buildMintCall needs a non-empty body string');
  }
  if (typeof tokenUri !== 'string' || tokenUri.length === 0 || tokenUri.length > 256) {
    throw new WizardSafetyError(`token uri must be 1..256 ascii characters, got ${tokenUri?.length ?? 0}`);
  }
  if (mime.length > 64) throw new WizardSafetyError(`mime must be at most 64 characters, got ${mime.length}`);

  const bytes = new Uint8Array(Buffer.from(body, 'utf8'));
  const chunks = chunkBytes(bytes);
  const hash = finalHash(bytes);
  const dependencies = parentIds.map((id) => BigInt(id));

  const base = [
    bufferCV(hash),
    stringAsciiCV(mime),
    uintCV(BigInt(bytes.length)),
    listCV(chunks.map((chunk) => bufferCV(chunk))),
    stringAsciiCV(tokenUri)
  ];
  const functionName = dependencies.length > 0 ? 'mint-single-tx-recursive' : 'mint-single-tx';
  const functionArgs = dependencies.length > 0 ? [...base, listCV(dependencies.map((id) => uintCV(id)))] : base;

  return {
    bytes,
    totalSize: bytes.length,
    totalChunks: chunks.length,
    chunkByteLengths: chunks.map((chunk) => chunk.length),
    finalHash: hash,
    finalHashHex: toHex(hash),
    mime,
    tokenUri,
    dependencies: dependencies.map(String),
    contract: CORE_CONTRACT,
    functionName,
    functionArgs,
    argShape: describeArgs({
      hash,
      mime,
      totalSize: bytes.length,
      chunks,
      tokenUri,
      dependencies
    })
  };
}

/** A printable, assertable description of the Clarity arguments. */
export function describeArgs({ hash, mime, totalSize, chunks, tokenUri, dependencies = [] }) {
  const shape = [
    { name: 'expected-hash', type: 'buff', length: 32, value: toHex(hash) },
    { name: 'mime', type: 'string-ascii', maxLength: 64, value: mime },
    { name: 'total-size', type: 'uint', value: String(totalSize) },
    {
      name: 'chunks',
      type: 'list',
      maxLength: MAX_SINGLE_TX_CHUNKS,
      of: `buff ${CHUNK_SIZE}`,
      length: chunks.length,
      byteLengths: chunks.map((chunk) => chunk.length)
    },
    { name: 'token-uri-string', type: 'string-ascii', maxLength: 256, value: tokenUri }
  ];
  if (dependencies.length > 0) {
    shape.push({
      name: 'dependencies',
      type: 'list',
      maxLength: 50,
      of: 'uint',
      length: dependencies.length,
      values: dependencies.map(String)
    });
  }
  return shape;
}

/* ------------------------------------------------------------------ */
/* live reads (no funds move)                                          */
/* ------------------------------------------------------------------ */

const readJson = async (response, label) => {
  let body;
  try {
    body = await response.json();
  } catch {
    throw new Error(`${label} returned non-JSON content (HTTP ${response.status})`);
  }
  if (!response.ok) throw new Error(`${label} returned HTTP ${response.status}`);
  return body;
};

const trimSlash = (url) => String(url).replace(/\/+$/, '');

/**
 * One read-only contract call, decoded.
 *
 * The Hiro call-read endpoint evaluates a function against the current chain
 * state and returns the Clarity value. It cannot sign, it cannot broadcast and
 * it cannot move funds; there is no key involved on either side. Every preflight
 * check below goes through here for exactly that reason.
 */
export async function callReadOnly({
  fetchImpl = globalThis.fetch,
  hiroUrl = DEFAULT_HIRO_URL,
  functionName,
  functionArgs = [],
  senderAddress = CORE_ADDRESS
} = {}) {
  const url = `${trimSlash(hiroUrl)}/v2/contracts/call-read/${CORE_ADDRESS}/${CORE_NAME}/${functionName}`;
  const response = await fetchImpl(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: senderAddress,
      arguments: functionArgs.map((argument) => cvToHex(argument))
    })
  });
  const body = await readJson(response, functionName);
  if (body.okay !== true || typeof body.result !== 'string') {
    throw new Error(`${functionName} failed: ${body.cause ?? body.result ?? 'no Clarity result'}`);
  }
  return cvToJSON(hexToCV(body.result));
}

/** `(response T ...)` unwrapped to T. Anything else passes through untouched. */
const unwrapResponse = (parsed) =>
  typeof parsed?.type === 'string' && parsed.type.startsWith('(response') ? parsed.value : parsed;

/**
 * `(optional T)` unwrapped to the inner `{ type, value }`, or null for `none`.
 * cvToJSON nests one level per wrapper, so `some` is `{ value: { type, value } }`
 * and `none` is `{ value: null }`.
 */
const optionalOf = (parsed) => {
  const inner = unwrapResponse(parsed);
  return inner && inner.value !== null && inner.value !== undefined ? inner.value : null;
};

const errorMessage = (error) => (error instanceof Error ? error.message : String(error));

/**
 * Live fee quote from the core, mode u2 (single transaction).
 * A read-only call. Nothing is signed and nothing is spent.
 */
export async function quoteSingleTxFee({
  fetchImpl = globalThis.fetch,
  hiroUrl = DEFAULT_HIRO_URL,
  totalSize,
  totalChunks,
  senderAddress = CORE_ADDRESS
} = {}) {
  const parsed = await callReadOnly({
    fetchImpl,
    hiroUrl,
    senderAddress,
    functionName: 'quote-inscription-fee',
    functionArgs: [uintCV(BigInt(totalSize)), uintCV(BigInt(totalChunks)), uintCV(BigInt(MODE_SINGLE_TX))]
  });
  const tuple = parsed?.value?.value;
  if (!tuple) throw new Error('quote-inscription-fee returned an unexpected Clarity shape');
  return {
    source: 'live-quote',
    mode: MODE_SINGLE_TX,
    totalFeeUstx: BigInt(tuple['total-fee'].value),
    singleTxFeeUstx: BigInt(tuple['single-tx-fee'].value),
    singleTxEligible: tuple['single-tx-eligible'].value === true,
    chunkSize: Number(tuple['chunk-size'].value),
    uploadBatches: Number(tuple['upload-batches'].value)
  };
}

/** Live STX balance. A read. */
export async function fetchStxBalance({ fetchImpl = globalThis.fetch, hiroUrl = DEFAULT_HIRO_URL, address } = {}) {
  const url = `${trimSlash(hiroUrl)}/extended/v2/addresses/${address}/balances/stx`;
  const body = await readJson(await fetchImpl(url), 'stx balance');
  if (body?.balance === undefined || body?.balance === null) throw new Error('balance lookup returned no balance');
  return BigInt(body.balance);
}

/** Live chain tip, so an entry can name the block it was written at. A read. */
export async function fetchChainTip({ fetchImpl = globalThis.fetch, hiroUrl = DEFAULT_HIRO_URL } = {}) {
  const url = `${trimSlash(hiroUrl)}/extended/v2/blocks?limit=1`;
  const body = await readJson(await fetchImpl(url), 'chain tip');
  const height = body?.results?.[0]?.height ?? body?.total;
  if (height === undefined || height === null) throw new Error('chain tip lookup returned no height');
  return BigInt(height);
}

/* ------------------------------------------------------------------ */
/* preflight checks (every one of them a read)                         */
/* ------------------------------------------------------------------ */

/** What a check reports when --offline took the network away from it. */
export const SKIPPED_OFFLINE = 'skipped: --offline';

/** Keep a long quote readable inside a one-line refusal. */
export const truncate = (text, limit = 140) => {
  const value = String(text ?? '').replace(/\s+/g, ' ').trim();
  return value.length > limit ? `${value.slice(0, limit - 1)}…` : value;
};

/**
 * The addresses the fleet is expected to be writing from, read from the
 * environment provisioning already fills in. Keyed by persona id, by full name
 * and by short name, because `--parent-wizard` is a display string an operator
 * types ("Wizard-1, the Archivist") rather than an id.
 */
export function expectedWizardAddresses(env = process.env) {
  const map = {};
  for (const id of PERSONA_IDS) {
    const address = env[`WIZARD_ADDRESS_${id.toUpperCase()}`];
    if (!address) continue;
    const persona = getPersona(id);
    for (const key of [id, persona.name, persona.shortName, persona.wallet]) {
      if (key) map[String(key).toLowerCase()] = address;
    }
  }
  return map;
}

/** Resolve a credited wizard string to the address it is supposed to own. */
export const resolveWizardAddress = (wizard, expectedAddresses = {}) =>
  wizard ? (expectedAddresses[String(wizard).trim().toLowerCase()] ?? null) : null;

/**
 * What a parent inscription actually says, for the "found" half of a mismatch
 * report. A corpus entry's Claim section is the thing a reply is supposed to be
 * quoting, so show that when the parent is a corpus entry, and a flattened
 * excerpt when it is not.
 */
export function foundFragment(text) {
  try {
    const parsed = parseEntry(text);
    if (parsed.claim) return parsed.claim;
  } catch {
    // Not a wizard corpus entry. Fall through to a raw excerpt.
  }
  return truncate(text, 200);
}

/**
 * CHECK 1. Verify every quoted parent fragment against that parent's own bytes.
 *
 * This is the one that matters most, and it is the only check here that guards
 * something no later transaction can fix.
 *
 * The closing manifest tells every reader that each entry's self-description is
 * checkable: the block it was written at, the fee it paid, the exact bytes it
 * committed to. Everything in that list was produced by this script and verified
 * against the chain — except the one string a human types. `--parent-quote` was
 * copied by hand into a reply that names an inscription id and a wizard, and
 * nothing anywhere compared it to what that inscription says. A typo, a
 * paraphrase, or the right words pasted under the wrong id would be signed,
 * minted and permanent: a corpus that advertises its own auditability would be
 * attributing words to another wizard's inscription, and no edit exists.
 *
 * So read it back. `get-chunk(id, u0)` returns the whole body, because wizard
 * entries are always exactly one chunk. The fragment must appear verbatim, and
 * if the reply credits a wizard, `get-inscription-creator(id)` must be that
 * wizard's address.
 *
 * Fails closed: an unreadable parent is a refusal, not a pass. You cannot verify
 * a quote you could not fetch.
 */
export async function verifyParentQuote({
  fetchImpl = globalThis.fetch,
  hiroUrl = DEFAULT_HIRO_URL,
  parentIds = [],
  answering = [],
  expectedAddresses = {},
  senderAddress = CORE_ADDRESS,
  offline = false
} = {}) {
  const ids = parentIds.map((id) => String(id).trim()).filter(Boolean);
  if (ids.length === 0) {
    return {
      name: 'parent quote',
      status: 'not-applicable',
      ok: true,
      results: [],
      note: 'opening statement: nothing is quoted'
    };
  }
  if (offline) {
    return { name: 'parent quote', status: 'skipped', ok: false, results: [], note: SKIPPED_OFFLINE };
  }

  const results = [];
  for (const id of ids) {
    const cited = answering.find((entry) => String(entry?.id).trim() === id) ?? null;
    const quote = String(cited?.quote ?? '').trim();
    const wizard = cited?.wizard ? String(cited.wizard).trim() : null;

    if (!quote) {
      results.push({
        id,
        quote: '',
        wizard,
        status: 'no-quote',
        message: `#${id} is cited as a parent but no quoted fragment was supplied for it`
      });
      continue;
    }

    let body;
    try {
      const parsed = await callReadOnly({
        fetchImpl,
        hiroUrl,
        senderAddress,
        functionName: 'get-chunk',
        functionArgs: [uintCV(BigInt(id)), uintCV(0n)]
      });
      const chunk = optionalOf(parsed);
      if (chunk === null) {
        results.push({
          id,
          quote,
          wizard,
          status: 'no-chunk',
          message: `#${id} has no chunk u0 on chain, so there is nothing it could be quoting`
        });
        continue;
      }
      body = Buffer.from(String(chunk.value).replace(/^0x/, ''), 'hex').toString('utf8');
    } catch (error) {
      results.push({
        id,
        quote,
        wizard,
        status: 'unavailable',
        message: `could not read #${id}: ${errorMessage(error)}`
      });
      continue;
    }

    if (!body.includes(quote)) {
      results.push({
        id,
        quote,
        wizard,
        status: 'quote-mismatch',
        found: foundFragment(body),
        message: `#${id} does not contain the quoted fragment`
      });
      continue;
    }

    if (!wizard) {
      results.push({ id, quote, wizard, status: 'ok', authorChecked: false, note: 'no wizard credited' });
      continue;
    }
    const expectedAuthor = resolveWizardAddress(wizard, expectedAddresses);
    if (!expectedAuthor) {
      results.push({
        id,
        quote,
        wizard,
        status: 'ok',
        authorChecked: false,
        note: `no expected address for "${wizard}" (set WIZARD_ADDRESS_<WIZARD>)`
      });
      continue;
    }

    try {
      const parsed = await callReadOnly({
        fetchImpl,
        hiroUrl,
        senderAddress,
        functionName: 'get-inscription-creator',
        functionArgs: [uintCV(BigInt(id))]
      });
      const creator = optionalOf(parsed);
      const foundAuthor = creator ? String(creator.value) : null;
      if (foundAuthor !== expectedAuthor) {
        results.push({
          id,
          quote,
          wizard,
          status: 'wrong-author',
          expectedAuthor,
          foundAuthor,
          message:
            `#${id} was created by ${foundAuthor ?? '(no creator on chain)'}, but this entry credits ` +
            `"${wizard}" (${expectedAuthor})`
        });
        continue;
      }
      results.push({ id, quote, wizard, status: 'ok', authorChecked: true, expectedAuthor, foundAuthor });
    } catch (error) {
      results.push({
        id,
        quote,
        wizard,
        status: 'unavailable',
        message: `could not read the creator of #${id}: ${errorMessage(error)}`
      });
    }
  }

  const ok = results.every((result) => result.status === 'ok');
  const unavailable = results.some((result) => result.status === 'unavailable');
  return {
    name: 'parent quote',
    status: ok ? 'verified' : unavailable ? 'unavailable' : 'failed',
    ok,
    results,
    failures: results.filter((result) => result.status !== 'ok')
  };
}

/**
 * CHECK 2. Is the core paused?
 *
 * A paused core reverts the mint, and a reverted transaction still pays the
 * miner. Fails closed: if the pause state cannot be read, a broadcast is
 * refused rather than gambled.
 */
export async function checkCorePaused({
  fetchImpl = globalThis.fetch,
  hiroUrl = DEFAULT_HIRO_URL,
  senderAddress = CORE_ADDRESS,
  offline = false
} = {}) {
  if (offline) {
    return { name: 'core paused', status: 'skipped', ok: false, paused: null, note: SKIPPED_OFFLINE };
  }
  try {
    const parsed = await callReadOnly({ fetchImpl, hiroUrl, senderAddress, functionName: 'is-paused' });
    const paused = unwrapResponse(parsed)?.value === true;
    return { name: 'core paused', status: paused ? 'paused' : 'running', ok: !paused, paused };
  } catch (error) {
    return { name: 'core paused', status: 'unavailable', ok: false, paused: null, error: errorMessage(error) };
  }
}

/**
 * CHECK 4. Can this wallet afford the whole thread, not just this entry?
 *
 * Deliberately pessimistic. The three wizards take turns, so in practice each
 * wallet pays for a third of the thread. Sizing one wallet against all six
 * entries is the conservative reading, and it is the one worth warning on: a
 * thread that stops halfway leaves a permanent argument with no ending and a
 * manifest that can never be written, because composeThreadManifest refuses a
 * short thread.
 *
 * Advisory. It warns and never refuses: the operator may be topping up between
 * entries, and that is a legitimate way to run this.
 */
export function checkThreadAffordability({
  threadLength = 6,
  plannedSpendUstx,
  balanceUstx = null,
  balanceFloorUstx = DEFAULT_BALANCE_FLOOR_USTX
} = {}) {
  const entries = BigInt(Math.max(1, Number(threadLength) || 1));
  const perEntryUstx = BigInt(plannedSpendUstx ?? 0);
  const threadCostUstx = perEntryUstx * entries;
  const base = {
    name: 'thread cost',
    ok: true,
    threadLength: Number(entries),
    perEntryUstx,
    threadCostUstx
  };
  if (balanceUstx === null || balanceUstx === undefined) {
    return { ...base, status: 'unknown', availableUstx: null, affordable: null, shortfallUstx: null };
  }
  const availableUstx = BigInt(balanceUstx) - BigInt(balanceFloorUstx);
  const affordable = availableUstx >= threadCostUstx;
  return {
    ...base,
    status: affordable ? 'affordable' : 'short',
    availableUstx,
    affordable,
    shortfallUstx: affordable ? 0n : threadCostUstx - availableUstx
  };
}

/**
 * CHECK 5. Have these exact bytes been inscribed before?
 *
 * v3.2.3 permits duplicates, so `get-id-by-hash` is advisory in the contract and
 * advisory here. A hit almost always means a re-run of a command that already
 * succeeded, which is worth seeing before paying for it twice. It never blocks:
 * two wizards may legitimately want the same bytes under different owners.
 */
export async function checkDuplicateContent({
  fetchImpl = globalThis.fetch,
  hiroUrl = DEFAULT_HIRO_URL,
  senderAddress = CORE_ADDRESS,
  finalHash,
  offline = false
} = {}) {
  if (offline) {
    return { name: 'duplicate', status: 'skipped', ok: true, existingId: null, note: SKIPPED_OFFLINE };
  }
  try {
    const parsed = await callReadOnly({
      fetchImpl,
      hiroUrl,
      senderAddress,
      functionName: 'get-id-by-hash',
      functionArgs: [bufferCV(finalHash)]
    });
    const existing = optionalOf(parsed);
    return {
      name: 'duplicate',
      status: existing ? 'duplicate' : 'new',
      ok: true,
      existingId: existing ? String(existing.value) : null
    };
  } catch (error) {
    return { name: 'duplicate', status: 'unavailable', ok: true, existingId: null, error: errorMessage(error) };
  }
}

/**
 * CHECK 6. Is anything already in flight from this wallet?
 *
 * A pending or stuck transaction holds the nonce, and a new mint queues behind
 * it instead of confirming. That is not dangerous, but it is the difference
 * between "nothing happened" and "nothing happened yet", and an operator who
 * does not know which one they are looking at tends to broadcast again.
 *
 * Advisory. It never blocks.
 */
export async function checkPendingNonce({
  fetchImpl = globalThis.fetch,
  hiroUrl = DEFAULT_HIRO_URL,
  address = null,
  offline = false
} = {}) {
  const base = {
    name: 'nonce',
    ok: true,
    nextNonce: null,
    lastExecutedNonce: null,
    missingNonces: [],
    warning: null
  };
  if (offline) return { ...base, status: 'skipped', note: SKIPPED_OFFLINE };
  if (!address) return { ...base, status: 'skipped', note: 'no wallet address supplied' };
  try {
    const body = await readJson(await fetchImpl(`${trimSlash(hiroUrl)}/extended/v1/address/${address}/nonces`), 'nonces');
    const lastExecutedNonce = body?.last_executed_tx_nonce ?? null;
    const nextNonce = body?.possible_next_nonce ?? null;
    const missingNonces = Array.isArray(body?.detected_missing_nonces) ? body.detected_missing_nonces : [];
    // A wallet that has executed nothing reads as -1, so a possible-next of 3
    // on a fresh wallet is three transactions in flight, not a clean slate.
    const executed = lastExecutedNonce === null ? -1 : Number(lastExecutedNonce);
    const gap = nextNonce !== null && Number(nextNonce) > executed + 1;
    const pending = missingNonces.length > 0 || gap;
    return {
      ...base,
      status: pending ? 'pending' : 'clear',
      nextNonce,
      lastExecutedNonce,
      missingNonces,
      warning: pending
        ? `a pending or stuck transaction is holding this nonce; a mint sent now queues behind it` +
          (missingNonces.length > 0 ? ` (missing nonces ${missingNonces.join(', ')})` : '')
        : null
    };
  } catch (error) {
    return { ...base, status: 'unavailable', error: errorMessage(error) };
  }
}

/* ------------------------------------------------------------------ */
/* safety rails                                                        */
/* ------------------------------------------------------------------ */

/** The kill switch: an env var or a KILL file next to this script. */
export function killSwitchEngaged(env = process.env, fileExists = existsSync) {
  const flag = String(env.WIZARD_KILL_SWITCH ?? '').trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(flag)) return 'WIZARD_KILL_SWITCH is set';
  if (fileExists(KILL_FILE)) return `${KILL_FILE} exists`;
  return null;
}

/**
 * Every reason to refuse a broadcast, checked in one place and in a fixed
 * order so the first failure is the most important one.
 *
 * Throws WizardSafetyError. Returns the planned spend when it passes.
 */
export function assertBroadcastAllowed({
  senderKey,
  wizardId = 'unknown',
  totalChunks,
  singleTxEligible,
  feeSource = 'live-quote',
  balanceUstx,
  protocolFeeUstx,
  minerFeeUstx = DEFAULT_MAX_TX_FEE_USTX,
  spendCapUstx = DEFAULT_SPEND_CAP_USTX,
  balanceFloorUstx = DEFAULT_BALANCE_FLOOR_USTX,
  killReason = null,
  parentQuoteCheck = null,
  pausedCheck = null
} = {}) {
  if (killReason) {
    throw new WizardSafetyError(`kill switch engaged (${killReason}). Nothing will be broadcast.`);
  }
  if (!senderKey) {
    throw new WizardSafetyError(
      `refusing to broadcast: no key. Set ${`WIZARD_KEY_${String(wizardId).toUpperCase()}`} to the ` +
        'hex private key for this wizard. Dry run needs no key.'
    );
  }
  if (typeof senderKey !== 'string' || !/^[0-9a-fA-F]{64,66}$/.test(senderKey)) {
    throw new WizardSafetyError('refusing to broadcast: key is not a hex private key');
  }
  if (Number(totalChunks) !== 1) {
    throw new WizardSafetyError(
      `refusing to broadcast: payload is ${totalChunks} chunks. Wizard entries must be exactly one chunk, ` +
        'which is the cheap single-transaction path. Shorten the entry.'
    );
  }
  if (singleTxEligible !== true) {
    throw new WizardSafetyError('refusing to broadcast: the contract says this mint is not single-transaction eligible');
  }
  if (feeSource !== 'live-quote') {
    throw new WizardSafetyError(
      `refusing to broadcast: the fee is a ${feeSource}, not a live quote. Broadcasting needs the real number.`
    );
  }

  // The two chain-truth rails sit here, after the local rails and before the
  // money rails. They both fail closed, and putting them behind the fee-source
  // rail means an --offline plan is turned away for being an estimate rather
  // than for a check it was never allowed to run.
  if (parentQuoteCheck && parentQuoteCheck.ok !== true) {
    const failures = parentQuoteCheck.failures ?? parentQuoteCheck.results ?? [];
    const detail = failures
      .filter((result) => result.status !== 'ok')
      .map((result) => {
        const lines = [`  - ${result.message ?? `#${result.id} failed verification`}`];
        if (result.status === 'quote-mismatch') {
          lines.push(`      expected: "${truncate(result.quote)}"`);
          lines.push(`      found   : "${truncate(result.found ?? '(nothing readable)')}"`);
        }
        return lines.join('\n');
      })
      .join('\n');
    throw new WizardSafetyError(
      'refusing to broadcast: a quoted parent fragment could not be verified against that parent\'s own ' +
        `on-chain bytes.\n${detail || `  - ${parentQuoteCheck.note ?? parentQuoteCheck.status}`}\n` +
        'Fix --parent-quote, --parents or --parent-wizard. This text is signed into a record that tells ' +
        'readers every claim it makes about itself is checkable, and a wrong quote permanently attributes ' +
        'words to another wizard\'s inscription. A quote that could not be fetched is not a quote that passed.'
    );
  }
  if (pausedCheck && pausedCheck.ok !== true) {
    throw new WizardSafetyError(
      pausedCheck.status === 'paused'
        ? 'refusing to broadcast: the core contract is paused. The mint would revert and the miner fee would ' +
          'still be spent.'
        : `refusing to broadcast: could not read whether the core is paused (${pausedCheck.error ?? pausedCheck.note ?? pausedCheck.status}). ` +
          'A paused core reverts the mint and burns the miner fee, so this fails closed.'
    );
  }

  const protocolFee = BigInt(protocolFeeUstx);
  const minerFee = BigInt(minerFeeUstx);
  const floor = BigInt(balanceFloorUstx);
  const cap = BigInt(spendCapUstx);
  const plannedSpend = protocolFee + minerFee;

  if (balanceUstx === undefined || balanceUstx === null) {
    throw new WizardSafetyError('refusing to broadcast: wallet balance unknown');
  }
  const balance = BigInt(balanceUstx);
  if (balance < floor) {
    throw new WizardSafetyError(
      `refusing to broadcast: balance ${groupDigits(balance)} microSTX is below the floor of ` +
        `${groupDigits(floor)}. Top the wizard up. Never spend the last of the float, or recovery ` +
        'transactions stop being affordable.'
    );
  }
  if (plannedSpend > cap) {
    throw new WizardSafetyError(
      `refusing to broadcast: planned spend ${groupDigits(plannedSpend)} microSTX ` +
        `(${groupDigits(protocolFee)} protocol + ${groupDigits(minerFee)} miner) exceeds the per-run cap of ` +
        `${groupDigits(cap)}.`
    );
  }
  if (balance - plannedSpend < floor) {
    throw new WizardSafetyError(
      `refusing to broadcast: spending ${groupDigits(plannedSpend)} microSTX would leave ` +
        `${groupDigits(balance - plannedSpend)}, below the floor of ${groupDigits(floor)}.`
    );
  }
  return { plannedSpendUstx: plannedSpend, protocolFeeUstx: protocolFee, minerFeeUstx: minerFee };
}

/* ------------------------------------------------------------------ */
/* planning                                                            */
/* ------------------------------------------------------------------ */

/**
 * Resolve the protocol fee for a one-chunk single-transaction mint.
 *
 * The fee is a function of chunk count, not of exact byte length, which is what
 * makes it safe for an entry to quote its own cost inside its own body. This
 * probes with a minimal one-chunk shape, then confirms against the real size
 * once the body exists, and refuses if the two disagree.
 */
export async function probeOneChunkFee({ fetchImpl, hiroUrl, senderAddress, offline = false } = {}) {
  if (offline) {
    return {
      source: 'offline-estimate',
      totalFeeUstx: OFFLINE_FEE_ESTIMATE_USTX,
      singleTxEligible: true,
      chunkSize: CHUNK_SIZE,
      note: 'offline: not a quote, an estimate from the last observed schedule'
    };
  }
  return quoteSingleTxFee({ fetchImpl, hiroUrl, totalSize: 1, totalChunks: 1, senderAddress });
}

/**
 * Build the whole dry-run plan: the composed entry, its chunking, its hash, the
 * Clarity call, the live fee and the safety verdict. Never signs, never
 * broadcasts, never needs a key.
 */
export async function planInscription({
  wizard,
  threadId,
  position = 1,
  subject,
  parentIds = [],
  answering = [],
  blockHeight = null,
  threadLength = 6,
  fetchImpl = globalThis.fetch,
  hiroUrl = DEFAULT_HIRO_URL,
  offline = false,
  senderAddress = null,
  spendCapUstx = DEFAULT_SPEND_CAP_USTX,
  balanceFloorUstx = DEFAULT_BALANCE_FLOOR_USTX,
  minerFeeUstx = DEFAULT_MAX_TX_FEE_USTX,
  env = process.env,
  expectedAddresses = expectedWizardAddresses(env)
} = {}) {
  const persona = getPersona(wizard);
  const resolvedSubject = getSubject(subject);

  const block =
    blockHeight !== null && blockHeight !== undefined
      ? BigInt(blockHeight)
      : offline
        ? 0n
        : await fetchChainTip({ fetchImpl, hiroUrl });

  const probe = await probeOneChunkFee({ fetchImpl, hiroUrl, senderAddress: senderAddress ?? CORE_ADDRESS, offline });

  const body = composeEntry({
    persona,
    threadId,
    position,
    subject: resolvedSubject,
    parentIds,
    answering,
    blockHeight: block,
    feeMicroStx: probe.totalFeeUstx,
    threadLength
  });

  const call = buildMintCall({
    body,
    tokenUri: tokenUriFor({ threadId, position, wizardId: persona.id }),
    parentIds
  });

  // Confirm the probe against the real payload shape. The fee depends on chunk
  // count only, so this should always agree. If it ever does not, the body is
  // quoting a price it will not pay and the run must stop.
  let quote = probe;
  if (!offline) {
    quote = await quoteSingleTxFee({
      fetchImpl,
      hiroUrl,
      totalSize: call.totalSize,
      totalChunks: call.totalChunks,
      senderAddress: senderAddress ?? CORE_ADDRESS
    });
    if (quote.totalFeeUstx !== probe.totalFeeUstx) {
      throw new WizardSafetyError(
        `fee changed between probe (${groupDigits(probe.totalFeeUstx)}) and confirmation ` +
          `(${groupDigits(quote.totalFeeUstx)}) microSTX. The entry states a cost it would not pay. Aborting.`
      );
    }
  }

  let balanceUstx = null;
  let balanceError = null;
  if (senderAddress && !offline) {
    try {
      balanceUstx = await fetchStxBalance({ fetchImpl, hiroUrl, address: senderAddress });
    } catch (error) {
      balanceError = error instanceof Error ? error.message : String(error);
    }
  }

  const killReason = killSwitchEngaged(env);
  const protocolFeeUstx = quote.totalFeeUstx;
  const plannedSpendUstx = protocolFeeUstx + BigInt(minerFeeUstx);

  // Preflight. Every one of these is a read; none of them can broadcast. They
  // run sequentially so the order of requests is the order of the report.
  const checks = {
    parentQuote: await verifyParentQuote({
      fetchImpl,
      hiroUrl,
      parentIds,
      answering,
      expectedAddresses,
      senderAddress: senderAddress ?? CORE_ADDRESS,
      offline
    }),
    corePaused: await checkCorePaused({
      fetchImpl,
      hiroUrl,
      senderAddress: senderAddress ?? CORE_ADDRESS,
      offline
    }),
    threadAffordability: checkThreadAffordability({
      threadLength,
      plannedSpendUstx,
      balanceUstx,
      balanceFloorUstx
    }),
    duplicateContent: await checkDuplicateContent({
      fetchImpl,
      hiroUrl,
      senderAddress: senderAddress ?? CORE_ADDRESS,
      finalHash: call.finalHash,
      offline
    }),
    pendingNonce: await checkPendingNonce({ fetchImpl, hiroUrl, address: senderAddress, offline })
  };
  const skippedChecks = Object.values(checks)
    .filter((check) => check.status === 'skipped' && check.note === SKIPPED_OFFLINE)
    .map((check) => check.name);

  return {
    wizard: persona,
    subject: resolvedSubject,
    threadId,
    position,
    threadLength,
    parentIds: parentIds.map(String),
    block,
    body,
    call,
    quote,
    feeSource: quote.source,
    protocolFeeUstx,
    minerFeeUstx: BigInt(minerFeeUstx),
    plannedSpendUstx,
    spendCapUstx: BigInt(spendCapUstx),
    balanceFloorUstx: BigInt(balanceFloorUstx),
    senderAddress,
    balanceUstx,
    balanceError,
    killReason,
    offline,
    // The post-condition the broadcast would actually carry. Deny mode plus a
    // LessEqual cap on STX leaving the sender, surfaced here so formatPlan can
    // print the bound instead of leaving the operator to read the source.
    postCondition: {
      mode: 'deny',
      asset: 'STX',
      principal: senderAddress,
      condition: 'LessEqual',
      capUstx: protocolFeeUstx
    },
    checks,
    skippedChecks
  };
}

const ustx = (value) => `${groupDigits(value)} microSTX (${microStxToStx(value)} STX)`;

/* ------------------------------------------------------------------ */
/* rendering the checks                                                */
/* ------------------------------------------------------------------ */

/** The post-condition line. The spend bound, stated rather than implied. */
export function formatPostCondition(postCondition) {
  if (!postCondition) return 'post-conditions: (not planned)';
  const who = postCondition.principal ?? '<the wizard wallet>';
  const bound = postCondition.condition === 'LessEqual' ? '<=' : postCondition.condition;
  return `post-conditions: ${postCondition.mode} mode; ${postCondition.asset} from ${who} ${bound} ${ustx(postCondition.capUstx)}`;
}

/** The parent-quote check, including a FAIL line a dry run can be read for. */
export function formatParentQuoteCheck(check) {
  if (!check) return ['  parent quote: (not checked)'];
  if (check.status === 'not-applicable') return [`  parent quote: not applicable (${check.note})`];
  if (check.status === 'skipped') return ['  parent quote: skipped (--offline); nothing was verified'];

  const lines = [];
  const verified = check.results.filter((result) => result.status === 'ok').length;
  lines.push(
    check.ok
      ? `  parent quote: verified ${verified} of ${check.results.length} against the parents' own on-chain bytes`
      : `  parent quote: FAIL — ${check.results.length - verified} of ${check.results.length} could not be verified. ` +
        'A broadcast is refused.'
  );
  for (const result of check.results) {
    if (result.status === 'ok') {
      const author = result.authorChecked
        ? `creator ${result.foundAuthor} matches "${result.wizard}"`
        : `author check skipped (${result.note})`;
      lines.push(`    #${result.id} ok   quote found in chunk u0; ${author}`);
      continue;
    }
    lines.push(`    #${result.id} FAIL ${result.message}`);
    if (result.status === 'quote-mismatch') {
      lines.push(`         expected: "${truncate(result.quote)}"`);
      lines.push(`         found   : "${truncate(result.found ?? '(nothing readable)')}"`);
    }
  }
  return lines;
}

/** Every preflight check, as a block. */
export function formatChecks(plan) {
  const checks = plan.checks ?? {};
  const lines = ['preflight (all reads; nothing in this section can broadcast):'];
  lines.push(...formatParentQuoteCheck(checks.parentQuote));

  const paused = checks.corePaused;
  lines.push(
    `  core paused: ${
      !paused
        ? '(not checked)'
        : paused.status === 'paused'
          ? 'YES — the mint would revert and the miner fee would still be spent. A broadcast is refused.'
          : paused.status === 'running'
            ? 'no'
            : paused.status === 'skipped'
              ? 'skipped (--offline)'
              : `unavailable (${paused.error}). A broadcast is refused: this fails closed.`
    }`
  );

  const thread = checks.threadAffordability;
  if (thread) {
    const affordable =
      thread.status === 'unknown'
        ? 'unknown (no balance read)'
        : thread.affordable
          ? 'yes'
          : `NO, short by ${ustx(thread.shortfallUstx)}`;
    lines.push(
      `  thread cost: ${thread.threadLength} x ${groupDigits(thread.perEntryUstx)} = ${ustx(thread.threadCostUstx)}; ` +
        `affordable: ${affordable}`
    );
    if (thread.status === 'short') {
      lines.push(
        '    warning: this wallet cannot fund the whole thread above the floor. Advisory only, but a thread ' +
          'that stops halfway can never be closed by a manifest.'
      );
    }
  }

  const duplicate = checks.duplicateContent;
  lines.push(
    `  duplicate: ${
      !duplicate
        ? '(not checked)'
        : duplicate.status === 'duplicate'
          ? `already inscribed as #${duplicate.existingId} (advisory: v3.2.3 permits duplicates)`
          : duplicate.status === 'new'
            ? 'no prior inscription with these bytes'
            : duplicate.status === 'skipped'
              ? 'skipped (--offline)'
              : `unavailable (${duplicate.error})`
    }`
  );

  const nonce = checks.pendingNonce;
  if (nonce) {
    lines.push(
      `  nonce: ${
        nonce.status === 'skipped'
          ? `skipped (${nonce.note === SKIPPED_OFFLINE ? '--offline' : nonce.note})`
          : nonce.status === 'unavailable'
            ? `unavailable (${nonce.error})`
            : `next ${nonce.nextNonce}, last executed ${nonce.lastExecutedNonce ?? 'none'}`
      }`
    );
    if (nonce.warning) lines.push(`    warning: ${nonce.warning}`);
  }

  if (plan.skippedChecks?.length) {
    lines.push(
      `  offline: skipped ${plan.skippedChecks.join(', ')}. None of them ran, so none of them passed; ` +
        '--broadcast refuses an offline plan.'
    );
  }
  return lines;
}

/**
 * Render a plan for a terminal. Pure string building.
 *
 * The header used to say "(DRY RUN)" unconditionally, including on a real
 * broadcast — the plan prints before the broadcast branch is reached, so an
 * operator scanning the output saw DRY RUN at the top of a run that then spent
 * real STX and wrote a permanent record. The only contradiction was one line at
 * the very bottom. Pass `broadcast: true` so the first line tells the truth.
 */
export function formatPlan(plan, { broadcast = false } = {}) {
  const lines = [];
  lines.push(
    broadcast
      ? '--- wizard inscription plan (BROADCAST — this will spend STX and cannot be undone) ---'
      : '--- wizard inscription plan (DRY RUN) ---'
  );
  lines.push(`wizard      : ${plan.wizard.name}`);
  lines.push(`thread      : ${plan.threadId}  position ${plan.position} of ${plan.threadLength}`);
  lines.push(`subject     : ${plan.subject.id}  (${plan.subject.title})`);
  lines.push(`answers     : ${plan.parentIds.length ? plan.parentIds.map((id) => `#${id}`).join(', ') : '(opening statement)'}`);
  lines.push(`block       : ${groupDigits(plan.block)}`);
  lines.push(`body        : ${groupDigits(plan.call.totalSize)} bytes / ${plan.call.totalChunks} chunk(s) of ${groupDigits(CHUNK_SIZE)}`);
  lines.push(`headroom    : ${groupDigits(CHUNK_SIZE - plan.call.totalSize)} bytes under the single-chunk limit`);
  lines.push(`finalHash   : ${plan.call.finalHashHex}`);
  lines.push(`contract    : ${plan.call.contract}`);
  lines.push(`function    : ${plan.call.functionName}`);
  lines.push(`token-uri   : ${plan.call.tokenUri}`);
  lines.push('');
  lines.push('clarity arguments:');
  for (const [index, arg] of plan.call.argShape.entries()) {
    const detail =
      arg.type === 'list'
        ? `(list ${arg.maxLength} (${arg.of})) length ${arg.length}` +
          (arg.byteLengths ? ` byte-lengths [${arg.byteLengths.join(', ')}]` : '') +
          (arg.values ? ` values [${arg.values.join(', ')}]` : '')
        : arg.type === 'buff'
          ? `(buff ${arg.length}) ${arg.value}`
          : arg.type === 'uint'
            ? `uint ${arg.value}`
            : `(string-ascii ${arg.maxLength}) "${arg.value}"`;
    lines.push(`  ${index}. ${arg.name.padEnd(17)} ${detail}`);
  }
  lines.push('');
  lines.push(
    `protocol fee: ${ustx(plan.protocolFeeUstx)}  [${plan.feeSource === 'live-quote' ? 'live quote-inscription-fee, mode u2' : plan.feeSource}]`
  );
  lines.push(`miner fee   : up to ${ustx(plan.minerFeeUstx)}  [a bid, set by the network, not refundable]`);
  lines.push(`planned spend: ${ustx(plan.plannedSpendUstx)}   cap ${ustx(plan.spendCapUstx)}`);
  lines.push(`single-tx eligible: ${plan.quote.singleTxEligible === true ? 'yes' : 'NO'}`);
  lines.push(formatPostCondition(plan.postCondition));
  if (plan.senderAddress) {
    lines.push(
      `wallet      : ${plan.senderAddress} balance ${plan.balanceUstx === null ? `unknown (${plan.balanceError ?? 'not checked'})` : ustx(plan.balanceUstx)}  floor ${ustx(plan.balanceFloorUstx)}`
    );
  } else {
    lines.push('wallet      : not supplied (dry run needs no wallet)');
  }
  lines.push('');
  lines.push(...formatChecks(plan));
  if (plan.killReason) lines.push(`KILL SWITCH : ENGAGED (${plan.killReason})`);
  return lines.join('\n');
}

/* ------------------------------------------------------------------ */
/* the closing instruction                                             */
/* ------------------------------------------------------------------ */

const shellQuote = (value) => `"${String(value).replace(/(["\\$`])/g, '\\$1')}"`;

/**
 * What to actually type next, after a dry run.
 *
 * This used to say "re-run with the key in WIZARD_KEY_<WIZARD>" unconditionally.
 * loadWizardEnv now reads .env.wizards, so for an operator who has provisioned
 * the fleet the key is already loaded and that instruction was simply false: it
 * asked for something that was already done, and it left out --thread, which a
 * broadcast refuses to proceed without. Print what is true of this run.
 */
export function broadcastInstruction({
  wizardId,
  hasKey = false,
  threadId = DEMO_THREAD_ID,
  subject = null,
  position = null,
  parentIds = [],
  parentQuote = null,
  parentWizard = null,
  offline = false,
  script = 'scripts/wizard/inscribe.mjs'
} = {}) {
  const keyVar = `WIZARD_KEY_${String(wizardId).toUpperCase()}`;
  const realThread = threadId && threadId !== DEMO_THREAD_ID;
  const parts = [`node ${script}`, `--wizard ${wizardId}`];
  if (subject) parts.push(`--subject ${subject}`);
  if (position !== null && position !== undefined) parts.push(`--position ${position}`);
  parts.push(`--thread ${realThread ? threadId : '<your-thread-id>'}`);
  if (parentIds.length > 0) parts.push(`--parents ${parentIds.join(',')}`);
  if (parentQuote) parts.push(`--parent-quote ${shellQuote(parentQuote)}`);
  if (parentWizard) parts.push(`--parent-wizard ${shellQuote(parentWizard)}`);
  parts.push('--broadcast');

  const lines = ['--- DRY RUN. Nothing was signed and nothing was sent. ---'];
  if (hasKey) {
    lines.push(`The key for ${wizardId} is already loaded (${keyVar}, from the environment or ${ENV_FILE_LABEL}).`);
    lines.push('To inscribe for real, run:');
    lines.push(`  ${parts.join(' ')}`);
  } else {
    lines.push('To inscribe for real, re-run with --broadcast and the wizard key in');
    lines.push(`  ${keyVar}=<hex private key>`);
    lines.push(`or filled in at ${ENV_FILE_LABEL}, which this script loads. Then run:`);
    lines.push(`  ${parts.join(' ')}`);
  }
  lines.push(
    realThread
      ? '--thread is mandatory for a broadcast, and this run already has a real one.'
      : `--thread is mandatory for a broadcast: the placeholder "${DEMO_THREAD_ID}" is refused, because the ` +
        'thread id is written into the entry and quoted by the manifest and cannot be changed afterwards.'
  );
  if (offline) {
    lines.push(
      '--offline skipped every live check, and a broadcast refuses an offline plan. Drop --offline before you ' +
        'add --broadcast.'
    );
  }
  return lines;
}

/* ------------------------------------------------------------------ */
/* cli                                                                 */
/* ------------------------------------------------------------------ */

const arg = (name, fallback = null) => {
  const index = process.argv.indexOf(`--${name}`);
  if (index === -1) return fallback;
  const value = process.argv[index + 1];
  return value && !value.startsWith('--') ? value : true;
};
const flag = (name) => arg(name) === true;
const csv = (value) =>
  value && typeof value === 'string' ? value.split(',').map((part) => part.trim()).filter(Boolean) : [];

async function main() {
  if (flag('help')) {
    console.log('See the header of scripts/wizard/inscribe.mjs and scripts/wizard/README.md.');
    console.log(`wizards : ${PERSONA_IDS.join(', ')}`);
    console.log(`subjects: ${SUBJECT_IDS.join(', ')}`);
    return;
  }

  loadWizardEnv();

  const offline = flag('offline');
  const hiroUrl = typeof arg('hiro') === 'string' ? arg('hiro') : DEFAULT_HIRO_URL;
  const threadId = typeof arg('thread') === 'string' ? arg('thread') : DEMO_THREAD_ID;

  // A dry run may use the demo thread id; a real inscription may not. The id is
  // written into the entry's front matter and quoted by the closing manifest,
  // so broadcasting the default would put the word "demo" permanently into the
  // first real corpus entry, where it cannot be edited out.
  if (flag('broadcast') && threadId === DEMO_THREAD_ID) {
    throw new WizardSafetyError(
      `refusing to broadcast with the placeholder thread id "${DEMO_THREAD_ID}". Pass --thread <id> with the ` +
        'real thread name. It is written into the entry and into the manifest, and it cannot be changed later.'
    );
  }
  const subject = typeof arg('subject') === 'string' ? arg('subject') : SUBJECT_IDS[0];
  const threadLength = Number(arg('thread-length', 6));

  if (flag('preview-thread')) {
    const fee = offline
      ? OFFLINE_FEE_ESTIMATE_USTX
      : (await probeOneChunkFee({ hiroUrl })).totalFeeUstx;
    const block = offline ? 0n : await fetchChainTip({ hiroUrl });
    const ids = Array.from({ length: threadLength }, (_, index) => `9${String(index + 1).padStart(3, '0')}`);
    const thread = composeThread({ threadId, subject, blockHeight: block, feeMicroStx: fee, ids, threadLength });
    console.log('=== PREVIEW: inscription ids below are SYNTHETIC. Nothing here is on chain. ===\n');
    for (const entry of thread.entries) {
      console.log(`----- #${entry.id}  ${entry.wizardName}  (${groupDigits(entry.bytes)} bytes) -----\n`);
      console.log(entry.body);
    }
    console.log(`----- manifest  (${groupDigits(Buffer.byteLength(thread.manifest, 'utf8'))} bytes) -----\n`);
    console.log(thread.manifest);
    console.log('=== PREVIEW END. No key was read, no transaction was built, nothing was sent. ===');
    return;
  }

  const position = Number(arg('position', 1));
  const wizardId = typeof arg('wizard') === 'string' ? arg('wizard') : personaForPosition(position).id;
  const persona = getPersona(wizardId);
  const parentIds = csv(arg('parents'));
  const parentQuote = typeof arg('parent-quote') === 'string' ? arg('parent-quote') : null;
  const parentWizard = typeof arg('parent-wizard') === 'string' ? arg('parent-wizard') : undefined;
  const answering = parentIds.map((id) => ({ id, wizard: parentWizard, quote: parentQuote ?? '' }));

  const senderKey = process.env[`WIZARD_KEY_${persona.id.toUpperCase()}`] ?? null;
  const senderAddress = senderKey
    ? getAddressFromPrivateKey(senderKey, TransactionVersion.Mainnet)
    : (process.env[`WIZARD_ADDRESS_${persona.id.toUpperCase()}`] ?? null);

  const plan = await planInscription({
    wizard: persona,
    threadId,
    position,
    subject,
    parentIds,
    answering,
    blockHeight: arg('block') ? BigInt(arg('block')) : null,
    threadLength,
    hiroUrl,
    offline,
    senderAddress,
    spendCapUstx: BigInt(arg('spend-cap-ustx', String(DEFAULT_SPEND_CAP_USTX))),
    balanceFloorUstx: BigInt(arg('balance-floor-ustx', String(DEFAULT_BALANCE_FLOOR_USTX))),
    minerFeeUstx: BigInt(arg('max-tx-fee-ustx', String(DEFAULT_MAX_TX_FEE_USTX)))
  });

  console.log(formatPlan(plan, { broadcast: flag('broadcast') }));

  const outPath = typeof arg('out') === 'string' ? arg('out') : null;
  if (outPath) {
    writeFileSync(outPath, plan.body, 'utf8');
    console.log(`\nwrote body to ${outPath}`);
  }

  console.log('\n--- composed entry ---\n');
  console.log(plan.body);

  if (!flag('broadcast')) {
    for (const line of broadcastInstruction({
      wizardId: persona.id,
      hasKey: Boolean(senderKey),
      threadId,
      subject,
      position,
      parentIds,
      parentQuote,
      parentWizard,
      offline
    })) {
      console.log(line);
    }
    return;
  }

  const spend = assertBroadcastAllowed({
    senderKey,
    wizardId: persona.id,
    totalChunks: plan.call.totalChunks,
    singleTxEligible: plan.quote.singleTxEligible,
    feeSource: plan.feeSource,
    balanceUstx: plan.balanceUstx,
    protocolFeeUstx: plan.protocolFeeUstx,
    minerFeeUstx: plan.minerFeeUstx,
    spendCapUstx: plan.spendCapUstx,
    balanceFloorUstx: plan.balanceFloorUstx,
    killReason: plan.killReason,
    parentQuoteCheck: plan.checks.parentQuote,
    pausedCheck: plan.checks.corePaused
  });

  const network = new StacksMainnet();
  console.log(`\nBROADCAST as ${senderAddress}, spending up to ${ustx(spend.plannedSpendUstx)}`);
  const tx = await makeContractCall({
    contractAddress: CORE_ADDRESS,
    contractName: CORE_NAME,
    functionName: plan.call.functionName,
    functionArgs: plan.call.functionArgs,
    senderKey,
    network,
    fee: spend.minerFeeUstx,
    anchorMode: AnchorMode.Any,
    // LessEqual, never Equal: an exact-match post-condition aborts the
    // transaction and burns the miner fee if the schedule moves under us.
    postConditionMode: PostConditionMode.Deny,
    postConditions: [
      makeStandardSTXPostCondition(senderAddress, FungibleConditionCode.LessEqual, spend.protocolFeeUstx)
    ]
  });
  const result = await broadcastTransaction(tx, network);
  if (result.error) {
    console.error('BROADCAST ERROR:', JSON.stringify(result));
    process.exitCode = 1;
    return;
  }
  console.log('txid:', result.txid);
  console.log('watch:', `https://explorer.hiro.so/txid/0x${result.txid}?chain=mainnet`);
  console.log('Record the returned inscription id: the next entry in this thread cites it.');
}

const isDirectRun = Boolean(process.argv[1]) && pathToFileURL(process.argv[1]).href === import.meta.url;
if (isDirectRun) {
  main().catch((error) => {
    console.error(`\n${error?.name === 'WizardSafetyError' || error?.name === 'WizardComposeError' ? error.message : error}`);
    process.exitCode = 1;
  });
}
