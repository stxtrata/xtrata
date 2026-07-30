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
 *   - the wallet balance is above the floor
 *   - protocol fee plus miner fee is within the per-run spend cap
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
  const url = `${String(hiroUrl).replace(/\/+$/, '')}/v2/contracts/call-read/${CORE_ADDRESS}/${CORE_NAME}/quote-inscription-fee`;
  const response = await fetchImpl(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: senderAddress,
      arguments: [
        cvToHex(uintCV(BigInt(totalSize))),
        cvToHex(uintCV(BigInt(totalChunks))),
        cvToHex(uintCV(BigInt(MODE_SINGLE_TX)))
      ]
    })
  });
  const body = await readJson(response, 'quote-inscription-fee');
  if (body.okay !== true || typeof body.result !== 'string') {
    throw new Error(`quote-inscription-fee failed: ${body.cause ?? body.result ?? 'no Clarity result'}`);
  }
  const parsed = cvToJSON(hexToCV(body.result));
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
  const url = `${String(hiroUrl).replace(/\/+$/, '')}/extended/v2/addresses/${address}/balances/stx`;
  const body = await readJson(await fetchImpl(url), 'stx balance');
  if (body?.balance === undefined || body?.balance === null) throw new Error('balance lookup returned no balance');
  return BigInt(body.balance);
}

/** Live chain tip, so an entry can name the block it was written at. A read. */
export async function fetchChainTip({ fetchImpl = globalThis.fetch, hiroUrl = DEFAULT_HIRO_URL } = {}) {
  const url = `${String(hiroUrl).replace(/\/+$/, '')}/extended/v2/blocks?limit=1`;
  const body = await readJson(await fetchImpl(url), 'chain tip');
  const height = body?.results?.[0]?.height ?? body?.total;
  if (height === undefined || height === null) throw new Error('chain tip lookup returned no height');
  return BigInt(height);
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
  killReason = null
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
  env = process.env
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
    killReason
  };
}

const ustx = (value) => `${groupDigits(value)} microSTX (${microStxToStx(value)} STX)`;

/** Render a plan for a terminal. Pure string building. */
export function formatPlan(plan) {
  const lines = [];
  lines.push('--- wizard inscription plan (DRY RUN) ---');
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
  if (plan.senderAddress) {
    lines.push(
      `wallet      : ${plan.senderAddress} balance ${plan.balanceUstx === null ? `unknown (${plan.balanceError ?? 'not checked'})` : ustx(plan.balanceUstx)}  floor ${ustx(plan.balanceFloorUstx)}`
    );
  } else {
    lines.push('wallet      : not supplied (dry run needs no wallet)');
  }
  if (plan.killReason) lines.push(`KILL SWITCH : ENGAGED (${plan.killReason})`);
  return lines.join('\n');
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

  console.log(formatPlan(plan));

  const outPath = typeof arg('out') === 'string' ? arg('out') : null;
  if (outPath) {
    writeFileSync(outPath, plan.body, 'utf8');
    console.log(`\nwrote body to ${outPath}`);
  }

  console.log('\n--- composed entry ---\n');
  console.log(plan.body);

  if (!flag('broadcast')) {
    console.log('--- DRY RUN. Nothing was signed and nothing was sent. ---');
    console.log('To inscribe for real, re-run with --broadcast and the wizard key in');
    console.log(`  ${`WIZARD_KEY_${persona.id.toUpperCase()}`}=<hex private key>`);
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
    killReason: plan.killReason
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
