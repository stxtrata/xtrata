#!/usr/bin/env node
//
// Ground-truth snapshot of a live Xtrata core.
//
// Built for the DeOrganized collaboration (github.com/DeOrganized/builds-with-xtrata).
// Integrators need to know what the fee schedule is *right now* and when it moved.
// The read-onlys are always authoritative; this turns them into a diffable file so
// a change shows up as a commit instead of a surprise on someone's invoice.
//
// Read-only. It never signs, never broadcasts, never needs a key.
//
//   node scripts/xtrata-state-snapshot.mjs
//   node scripts/xtrata-state-snapshot.mjs --network testnet --contract STX....xtrata-v3-2-3
//   node scripts/xtrata-state-snapshot.mjs --check     # exit 1 if state moved
//
// --check is the notification mechanism: run it on a schedule, and a non-zero
// exit means the fee schedule (or pause state, or admin) has changed since the
// committed snapshot.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { callReadOnlyFunction, cvToJSON, uintCV, principalCV } from '@stacks/transactions';
import { StacksMainnet, StacksTestnet } from '@stacks/network';

const root = new URL('../', import.meta.url);

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at === -1 ? fallback : args[at + 1];
};
const has = (name) => args.includes(`--${name}`);

const NETWORK = flag('network', 'mainnet');
const CHECK_ONLY = has('check');

const DEFAULTS = {
  mainnet: {
    api: process.env.XTRATA_MAINNET_API_URL ?? 'https://api.hiro.so',
    contract: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3',
    sender: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X'
  },
  testnet: {
    api: process.env.XTRATA_TESTNET_API_URL ?? 'https://api.testnet.hiro.so',
    contract: process.env.XTRATA_TESTNET_CONTRACT ?? '',
    sender: 'ST000000000000000000002AMW42H'
  }
};

const target = DEFAULTS[NETWORK];
if (!target) throw new Error(`unknown network: ${NETWORK}`);

const API_URL = (flag('api', target.api)).replace(/\/$/, '');

// Optional. Raises the Hiro rate limit; the snapshot works without one.
const readEnvLocal = () => {
  const file = fileURLToPath(new URL('.env.local', root));
  if (!existsSync(file)) return '';
  const line = readFileSync(file, 'utf8').split('\n').find((l) => l.startsWith('HIRO_API_KEY='));
  return line ? line.slice('HIRO_API_KEY='.length).trim().replace(/^["']|["']$/g, '') : '';
};
const API_KEY = process.env.XTRATA_MAINNET_HIRO_API_KEY ?? process.env.HIRO_API_KEY ?? readEnvLocal();
const CONTRACT = flag('contract', target.contract);
if (!CONTRACT) throw new Error(`no contract for ${NETWORK}; pass --contract or set XTRATA_TESTNET_CONTRACT`);

const [ADDRESS, NAME] = CONTRACT.split('.');
const SENDER = flag('sender', target.sender);
const OUT = fileURLToPath(new URL(flag('out', `state/${NETWORK}-${NAME}.json`), root));

// Principals we want an allowlist reading for. Public addresses only, never keys.
const WATCHED_CALLERS = (flag('callers', process.env.XTRATA_WATCHED_CALLERS ?? '') || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

// Shapes we quote so integrators can sanity-check their own quoting against ours.
// A "typical article" is the first row: one 16 KiB chunk.
const QUOTE_SHAPES = [
  { label: 'article-1-chunk', totalSize: 16384, totalChunks: 1 },
  { label: 'article-2-chunks', totalSize: 32768, totalChunks: 2 },
  { label: 'media-8-chunks', totalSize: 131072, totalChunks: 8 },
  { label: 'media-32-chunks', totalSize: 524288, totalChunks: 32 },
  // Past MAX-SINGLE-TX-CHUNKS (32), so staged is the only route.
  { label: 'media-100-chunks', totalSize: 1638400, totalChunks: 100, stagedOnly: true }
];

const headers = () => {
  const out = { 'content-type': 'application/json' };
  if (API_KEY) out['x-api-key'] = API_KEY;
  return out;
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Unwraps the cvToJSON tree into plain JS. Responses and optionals are
// transparent; tuples become objects; everything else lands as a scalar.
const plain = (json) => {
  if (json === null || json === undefined) return null;
  const type = String(json.type ?? '');
  if (type === 'responseOk' || type === 'responseErr' || type === 'optional' || type.startsWith('(response ') || type.startsWith('(optional ')) {
    return plain(json.value);
  }
  if (type === 'tuple' || type.startsWith('(tuple')) {
    const out = {};
    for (const [key, value] of Object.entries(json.value ?? {})) out[key] = plain(value);
    return out;
  }
  if (type === 'uint' || type === 'int') return Number(json.value);
  if (type === 'bool') return Boolean(json.value);
  return json.value ?? null;
};

// Use the SDK client rather than hand-rolling the URL: Hiro's raw
// /v2/contracts/call-read-only path 404s from some hosts, and the SDK tracks
// whichever endpoint is current.
const network = NETWORK === 'testnet'
  ? new StacksTestnet({ url: API_URL })
  : new StacksMainnet({ url: API_URL });
if (API_KEY) network.fetchFn = (url, init = {}) =>
  fetch(url, { ...init, headers: { ...(init.headers ?? {}), 'x-api-key': API_KEY } });

const callReadOnly = async (fn, callArgs = []) => {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: ADDRESS,
        contractName: NAME,
        functionName: fn,
        functionArgs: callArgs,
        network,
        senderAddress: SENDER
      });
      return { value: plain(cvToJSON(result)) };
    } catch (error) {
      lastError = error;
      if (attempt < 3) await sleep(attempt * 750);
    }
  }
  return { error: String(lastError?.message ?? lastError) };
};

const unwrap = async (fn, callArgs = []) => {
  const { value, error } = await callReadOnly(fn, callArgs);
  return error ? { error } : value;
};

const chainTip = async () => {
  try {
    const response = await fetch(`${API_URL}/v2/info`, { headers: headers() });
    if (!response.ok) return null;
    const info = await response.json();
    return {
      stacksTipHeight: info.stacks_tip_height ?? null,
      burnBlockHeight: info.burn_block_height ?? null,
      stacksTip: info.stacks_tip ?? null
    };
  } catch {
    return null;
  }
};

const main = async () => {
  const tip = await chainTip();

  const [
    contractInfo,
    admin,
    royaltyRecipient,
    paused,
    beginFeeUnit,
    uploadChunkFeeUnit,
    uploadBatchFeeUnit,
    sealFeeUnit,
    singleTxFeeUnit,
    lastTokenId,
    mintedCount
  ] = await Promise.all([
    unwrap('get-contract-info'),
    unwrap('get-admin'),
    unwrap('get-royalty-recipient'),
    unwrap('is-paused'),
    unwrap('get-begin-fee-unit'),
    unwrap('get-upload-chunk-fee-unit'),
    unwrap('get-upload-batch-fee-unit'),
    unwrap('get-seal-fee-unit'),
    unwrap('get-single-tx-fee-unit'),
    unwrap('get-last-token-id'),
    unwrap('get-minted-count')
  ]);

  const quotes = {};
  for (const shape of QUOTE_SHAPES) {
    const fnArgs = [uintCV(shape.totalSize), uintCV(shape.totalChunks)];
    const staged = await unwrap('quote-staged-fee', fnArgs);
    const single = shape.stagedOnly ? null : await unwrap('quote-single-tx-fee', fnArgs);
    quotes[shape.label] = { totalSize: shape.totalSize, totalChunks: shape.totalChunks, single, staged };
  }

  const allowedCallers = {};
  for (const caller of WATCHED_CALLERS) {
    allowedCallers[caller] = await unwrap('is-allowed-caller', [principalCV(caller)]);
  }

  // `state` is everything an integrator's cost math depends on. It is kept
  // separate from `observed` (tip height, supply) so a routine block-height
  // change does not read as a fee change in the diff.
  const snapshot = {
    contract: CONTRACT,
    network: NETWORK,
    state: {
      version: contractInfo?.version ?? null,
      paused,
      admin,
      royaltyRecipient,
      feeUnits: {
        beginFeeUnit,
        uploadChunkFeeUnit,
        uploadBatchFeeUnit,
        sealFeeUnit,
        singleTxFeeUnit
      },
      limits: contractInfo,
      quotes,
      allowedCallers
    },
    observed: {
      lastTokenId,
      mintedCount,
      ...(tip ?? {})
    }
  };

  const previous = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : null;
  const changed = JSON.stringify(previous?.state) !== JSON.stringify(snapshot.state);

  if (CHECK_ONLY) {
    if (!previous) {
      console.error(`no committed snapshot at ${OUT}; run without --check to create one`);
      process.exit(1);
    }
    if (changed) {
      console.error(`STATE CHANGED for ${CONTRACT}`);
      console.error(`  was: ${JSON.stringify(previous.state.feeUnits)}`);
      console.error(`  now: ${JSON.stringify(snapshot.state.feeUnits)}`);
      process.exit(1);
    }
    console.log(`unchanged: ${CONTRACT}`);
    return;
  }

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(`${changed ? 'updated' : 'refreshed'} ${OUT}`);
  console.log(JSON.stringify(snapshot.state.feeUnits, null, 2));
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
