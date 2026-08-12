#!/usr/bin/env node
//
// Measure how much data a Stacks NFT collection would put on chain as Forever Twins.
//
//   node scripts/measure-collection.mjs SP2N959SER36FZ5QT1CX9BR63W3E8X35WQCMBYYWC.leo-cats
//   node scripts/measure-collection.mjs <contract-id> [--samples 20] [--json]
//
// Reads supply from the source contract, samples the art the collection's own
// token URI points at, and reports total bytes, chunk counts, and the Xtrata
// protocol fee for the whole collection.
//
// A twin stores the source file byte for byte, so `supply x mean image bytes` is
// the real on-chain footprint. Verified: Miami Degen #406's twin reports
// total-size 126772 and its source PNG is exactly 126772 bytes.
//
// Two numbers this script does NOT give you:
//   - the Stacks miner fee, which depends on the fee rate chosen at submit time
//     and has varied 32x across the live helpers. Read it off real `inscribe`
//     transactions instead.
//   - the helper contract's own inscribe-fee, which is a campaign choice.
//
// Failures are reported as failures. A collection whose art cannot be fetched
// prints "unreachable", never a zero, because those mean very different things.

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { callReadOnlyFunction, cvToJSON, uintCV } = require('@stacks/transactions');
const { StacksMainnet } = require('@stacks/network');

const CHUNK_SIZE = 16384;
const SINGLE_TX_CHUNK_LIMIT = 32;
const network = new StacksMainnet();
const SENDER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://dweb.link/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
  'https://4everland.io/ipfs/'
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function readOnly(contractId, functionName, functionArgs = []) {
  const [contractAddress, contractName] = contractId.split('.');
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const cv = await callReadOnlyFunction({
        contractAddress, contractName, functionName, functionArgs,
        senderAddress: SENDER, network
      });
      return { ok: true, value: cvToJSON(cv) };
    } catch (e) {
      const msg = String(e.message || e);
      if (!/429/.test(msg) || attempt === 4) return { ok: false, error: msg.slice(0, 160) };
      await sleep(1500 * (attempt + 1));
    }
  }
}

function resolveUri(uri) {
  if (!uri) return null;
  if (uri.startsWith('ipfs://ipfs/')) return { gateways: GATEWAYS.map((g) => g + uri.slice(12)) };
  if (uri.startsWith('ipfs://')) return { gateways: GATEWAYS.map((g) => g + uri.slice(7)) };
  if (uri.startsWith('ar://')) return { gateways: ['https://arweave.net/' + uri.slice(5)] };
  if (uri.startsWith('http')) return { gateways: [uri] };
  return null;
}

async function fetchAny(uri, method = 'GET') {
  const r = resolveUri(uri);
  if (!r) return null;
  for (let round = 0; round < 2; round++) {
    for (const url of r.gateways) {
      try {
        const ctl = new AbortController();
        const timer = setTimeout(() => ctl.abort(), 20000);
        const res = await fetch(url, { method, signal: ctl.signal, redirect: 'follow' });
        clearTimeout(timer);
        if (res.ok) return res;
      } catch (e) { /* try the next gateway */ }
    }
  }
  return null;
}

// HEAD first, because the point is the byte count and some of these files are megabytes.
async function imageBytes(imageUri) {
  const head = await fetchAny(imageUri, 'HEAD');
  if (head) {
    const len = Number(head.headers.get('content-length'));
    if (len > 0) return { bytes: len, contentType: head.headers.get('content-type') };
  }
  const res = await fetchAny(imageUri, 'GET');
  if (!res) return null;
  try {
    const buf = Buffer.from(await res.arrayBuffer());
    return { bytes: buf.length, contentType: res.headers.get('content-type') };
  } catch (e) {
    return null;
  }
}

const applyTemplate = (uri, id) =>
  uri.replace(/\{id\}/g, id).replace(/\$TOKEN_ID/g, id).replace(/\{tokenId\}/g, id);

// Stacks Invaders got sized at 100 MB off its IPFS PNGs before anyone noticed the
// contract renders its own ~950-byte SVG. `get-token-uri` pointing at IPFS does not
// mean IPFS holds the artwork. Check the contract before trusting the fetched bytes.
async function onChainRenderer(contractId) {
  const [address, name] = contractId.split('.');
  try {
    const res = await fetch(`https://api.mainnet.hiro.so/v2/contracts/interface/${address}/${name}`);
    if (!res.ok) return { checked: false, reason: `HTTP ${res.status}` };
    const iface = await res.json();
    const suspects = (iface.functions || [])
      .filter((f) => f.access === 'read_only' || f.access === 'public')
      .map((f) => f.name)
      .filter((n) => /svg|render|design|generate|token-image|onchain/i.test(n));
    return { checked: true, suspects };
  } catch (e) {
    return { checked: false, reason: String(e.message).slice(0, 80) };
  }
}

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: limit }, async () => {
    while (i < items.length) { const idx = i++; out[idx] = await fn(items[idx]); }
  }));
  return out;
}

// Xtrata v3-2-3 single-transaction fee: 10,000 + 1,000 per chunk microSTX.
// Over 32 chunks the mint drops to the staged path, which is quoted separately.
const singleTxFee = (chunks) => 10000 + 1000 * chunks;

async function measure(contractId, samples) {
  const last = await readOnly(contractId, 'get-last-token-id');
  if (!last.ok) return { contractId, error: `get-last-token-id failed: ${last.error}` };
  const supply = Number(last.value?.value?.value ?? last.value?.value);
  if (!Number.isFinite(supply) || supply < 1) return { contractId, error: 'no usable supply' };

  const renderer = await onChainRenderer(contractId);

  const uriRes = await readOnly(contractId, 'get-token-uri', [uintCV(1)]);
  const rawUri = (() => {
    const v = uriRes.ok ? uriRes.value?.value?.value : null;
    return typeof v === 'string' ? v : v?.value ?? null;
  })();
  if (!rawUri) return { contractId, supply, renderer, error: `get-token-uri failed: ${uriRes.error ?? 'empty'}` };

  const hasTemplate = /\{id\}|\$TOKEN_ID|\{tokenId\}/.test(rawUri);
  const ids = [];
  for (let i = 0; i < samples; i++) ids.push(1 + Math.floor((i * supply) / samples));

  // Collections without a templated URI need one chain read per sampled token.
  let targets;
  if (hasTemplate) {
    targets = ids.map((tid) => ({ tid, uri: applyTemplate(rawUri, tid) }));
  } else {
    targets = [];
    for (const tid of ids) {
      const r = await readOnly(contractId, 'get-token-uri', [uintCV(tid)]);
      const v = r.ok ? r.value?.value?.value : null;
      targets.push({ tid, uri: typeof v === 'string' ? v : v?.value ?? null });
      await sleep(400);
    }
  }

  const results = await mapLimit(targets, 5, async ({ tid, uri }) => {
    if (!uri) return { tid, error: 'token uri unavailable' };
    const res = await fetchAny(uri);
    if (!res) return { tid, error: 'metadata unreachable' };
    const contentType = res.headers.get('content-type') || '';
    if (/image\//.test(contentType)) {
      const buf = await res.arrayBuffer().catch(() => null);
      return buf ? { tid, bytes: buf.byteLength, contentType } : { tid, error: 'body read failed' };
    }
    const text = await res.text().catch(() => null);
    if (!text) return { tid, error: 'body read failed' };
    let meta;
    try { meta = JSON.parse(text); } catch (e) { return { tid, error: 'metadata not json' }; }
    const image = meta.image || meta.image_url || meta.imageUrl || meta.properties?.image;
    if (!image) return { tid, error: 'metadata has no image field' };
    const size = await imageBytes(image);
    return size
      ? { tid, bytes: size.bytes, contentType: size.contentType, metadataBytes: text.length }
      : { tid, error: 'image unreachable' };
  });

  const measured = results.filter((r) => r.bytes);
  if (!measured.length) {
    return { contractId, supply, tokenUri: rawUri, renderer, sampled: 0, tried: results.length,
             error: 'art unreachable for every sampled token', results };
  }

  const sizes = measured.map((r) => r.bytes).sort((a, b) => a - b);
  const mean = Math.round(sizes.reduce((a, b) => a + b, 0) / sizes.length);
  const meanChunks = Math.ceil(mean / CHUNK_SIZE);
  const singleTxEligible = meanChunks <= SINGLE_TX_CHUNK_LIMIT;

  return {
    contractId, supply, tokenUri: rawUri, renderer,
    sampled: measured.length, tried: results.length,
    meanBytes: mean,
    medianBytes: sizes[Math.floor(sizes.length / 2)],
    minBytes: sizes[0],
    maxBytes: sizes[sizes.length - 1],
    contentType: measured[0].contentType,
    totalBytes: mean * supply,
    chunksPerItem: meanChunks,
    singleTxEligible,
    protocolFeeSTX: singleTxEligible ? (singleTxFee(meanChunks) * supply) / 1e6 : null,
    results
  };
}

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const samplesFlag = args.indexOf('--samples');
const samples = samplesFlag >= 0 ? Number(args[samplesFlag + 1]) : 12;
const contractIds = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--samples');

if (!contractIds.length) {
  console.error('Usage: node scripts/measure-collection.mjs <contract-id> [...] [--samples N] [--json]');
  process.exit(1);
}

const all = [];
for (const contractId of contractIds) {
  const r = await measure(contractId, samples);
  all.push(r);
  if (asJson) continue;
  const rendererWarning = r.renderer?.suspects?.length
    ? `  WARNING: contract exposes ${r.renderer.suspects.join(', ')} — the art may be rendered on chain,\n           in which case the bytes below are a mirror and not the artwork.`
    : r.renderer && !r.renderer.checked
      ? `  note: could not check for an on-chain renderer (${r.renderer.reason})`
      : null;
  if (r.error) {
    console.log(`\n${contractId}`);
    console.log(`  supply: ${r.supply ?? 'unknown'}`);
    if (rendererWarning) console.log(rendererWarning);
    console.log(`  ERROR: ${r.error}`);
    continue;
  }
  const mb = (r.totalBytes / 1e6).toFixed(1);
  const mib = (r.totalBytes / 1024 / 1024).toFixed(1);
  console.log(`\n${contractId}`);
  console.log(`  supply            ${r.supply}`);
  if (rendererWarning) console.log(rendererWarning);
  console.log(`  sampled           ${r.sampled}/${r.tried}  (${r.contentType ?? 'unknown type'})`);
  console.log(`  bytes per item    mean ${r.meanBytes}  median ${r.medianBytes}  range ${r.minBytes}-${r.maxBytes}`);
  console.log(`  chunks per item   ${r.chunksPerItem}${r.singleTxEligible ? '' : '  (over the 32-chunk single-tx cap, staged mint)'}`);
  console.log(`  TOTAL ON CHAIN    ${mb} MB  (${mib} MiB)`);
  if (r.protocolFeeSTX !== null) {
    console.log(`  Xtrata protocol   ${r.protocolFeeSTX.toFixed(2)} STX for the whole collection (miner fees are separate)`);
  } else {
    console.log(`  Xtrata protocol   staged mint, quote with quote-staged-fee; ~5 transactions per item`);
  }
}

if (asJson) console.log(JSON.stringify(all, null, 2));
