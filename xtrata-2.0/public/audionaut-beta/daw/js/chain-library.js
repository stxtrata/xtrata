import { ChainValidationError, validateChainReference, validateChainManifest, validateChainSong,
  chainRefKey, assetChainReference, CHAIN_LIMITS } from './chain-manifest.js';

function abortIfNeeded(signal) { if (signal?.aborted) throw signal.reason || new DOMException('Aborted', 'AbortError'); }
async function bytesOf(value, maximum) {
  if (typeof Blob !== 'undefined' && value instanceof Blob) {
    if (value.size > maximum) throw new ChainValidationError('LIMIT', 'Dependency exceeds its declared byte length');
    return new Uint8Array(await value.arrayBuffer());
  }
  const bytes = value instanceof ArrayBuffer ? new Uint8Array(value) : ArrayBuffer.isView(value) ? new Uint8Array(value.buffer, value.byteOffset, value.byteLength) : null;
  if (!bytes) throw new ChainValidationError('BYTES', 'Dependency transport must return binary bytes');
  if (bytes.byteLength > maximum) throw new ChainValidationError('LIMIT', 'Dependency exceeds its declared byte length');
  return bytes;
}

export async function sha256Bytes(value) {
  const bytes = await bytesOf(value, CHAIN_LIMITS.maxAssetBytes);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function verifyChainBytes(reference, value) {
  const ref = validateChainReference(reference), bytes = await bytesOf(value, ref.bytes);
  // Copy before awaiting WebCrypto: callers cannot race verification by changing a shared buffer.
  const owned = bytes.slice();
  if (owned.byteLength !== ref.bytes) throw new ChainValidationError('LENGTH', `Dependency byte length differs from its manifest (${owned.byteLength} / ${ref.bytes})`);
  if (await sha256Bytes(owned) !== ref.sha256) throw new ChainValidationError('HASH', 'Dependency SHA-256 does not match its immutable manifest');
  return owned;
}

export function chainContentUrl(reference, base = '/runtime/content') {
  const ref = validateChainReference(reference);
  const query = new URLSearchParams({ network: ref.network, contractId: ref.contractId, tokenId: ref.tokenId, raw: '1' });
  return `${base}${base.includes('?') ? '&' : '?'}${query}`;
}

// raw=1 is necessary: the website gateway otherwise rewrites HTML/API addresses.
export async function fetchChainBytes(reference, { signal, fetch: fetchImpl = globalThis.fetch, base } = {}) {
  const ref = validateChainReference(reference);
  abortIfNeeded(signal);
  const response = await fetchImpl(chainContentUrl(ref, base), { signal, credentials: 'omit', redirect: 'error' });
  if (!response.ok) throw new ChainValidationError('FETCH', `Chain dependency request failed (${response.status})`);
  const declared = response.headers.get('content-length');
  if (declared !== null && (!/^\d+$/.test(declared) || Number(declared) !== ref.bytes)) throw new ChainValidationError('LENGTH', 'Gateway content length differs from the manifest');
  if (!response.body?.getReader) {
    // A browser Response has a readable stream; injected test transports may not.
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.byteLength !== ref.bytes) throw new ChainValidationError('LENGTH', 'Gateway body length differs from the manifest');
    return bytes;
  }
  const reader = response.body.getReader(), chunks = [];
  let length = 0;
  try {
    while (true) {
      abortIfNeeded(signal);
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > ref.bytes) throw new ChainValidationError('LIMIT', 'Gateway response exceeds declared dependency size');
      chunks.push(value);
    }
    if (length !== ref.bytes) throw new ChainValidationError('LENGTH', 'Gateway returned an incomplete dependency');
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    return bytes;
  } catch (error) { await reader.cancel().catch(() => {}); throw error; }
  finally { reader.releaseLock(); }
}

// Cache is optional {get,set,delete}; both sync Maps and async IndexedDB adapters work.
// Every read verifies bytes, including cache hits. A cache is never evidence of publication.
function memoryCache(maxBytes = 64 * 1024 * 1024) {
  const entries = new Map(); let size = 0;
  function remove(key) { const bytes = entries.get(key); if (bytes) size -= bytes.byteLength; entries.delete(key); }
  return {
    get(key) { const bytes = entries.get(key); if (bytes) { entries.delete(key); entries.set(key, bytes); } return bytes; },
    set(key, bytes) { remove(key); if (bytes.byteLength > maxBytes) return; while (size + bytes.byteLength > maxBytes) remove(entries.keys().next().value); entries.set(key, bytes); size += bytes.byteLength; },
    delete: remove
  };
}
export function createChainLibrary({ fetchBytes = fetchChainBytes, cache = memoryCache(), timeoutMs = 30000 } = {}) {
  if (typeof fetchBytes !== 'function' || !Number.isFinite(timeoutMs) || timeoutMs < 1 || timeoutMs > 120000) throw new ChainValidationError('CONFIG', 'Invalid chain library transport or timeout');
  return Object.freeze({
    async read(reference, { signal } = {}) {
      const ref = validateChainReference(reference), key = `${chainRefKey(ref)}:${ref.sha256}:${ref.bytes}`;
      abortIfNeeded(signal);
      let cached;
      try { cached = await cache?.get?.(key); } catch { /* A broken local cache must not block chain retrieval. */ }
      if (cached !== undefined && cached !== null) {
        try { const bytes = await verifyChainBytes(ref, cached); abortIfNeeded(signal); return bytes; }
        catch (error) {
          abortIfNeeded(signal);
          try { await cache?.delete?.(key); } catch { /* Best effort accelerator eviction. */ }
          if (!(error instanceof ChainValidationError)) throw error;
        }
      }
      const controller = new AbortController();
      const abort = () => controller.abort(signal?.reason || new DOMException('Aborted', 'AbortError'));
      signal?.addEventListener('abort', abort, { once: true });
      let timer, onAbort;
      try {
        abortIfNeeded(signal);
        const cancellation = new Promise((_, reject) => {
          onAbort = () => reject(controller.signal.reason || new DOMException('Aborted', 'AbortError'));
          controller.signal.addEventListener('abort', onAbort, { once: true });
          timer = setTimeout(() => controller.abort(new ChainValidationError('TIMEOUT', 'Chain dependency request timed out')), timeoutMs);
        });
        const value = await Promise.race([fetchBytes(ref, { signal: controller.signal }), cancellation]);
        abortIfNeeded(controller.signal);
        const bytes = await verifyChainBytes(ref, value);
        abortIfNeeded(controller.signal);
        try { await cache?.set?.(key, bytes.slice()); } catch { /* Quota errors do not invalidate verified chain bytes. */ }
        abortIfNeeded(controller.signal);
        return bytes;
      } finally {
        clearTimeout(timer);
        signal?.removeEventListener('abort', abort);
        controller.signal.removeEventListener('abort', onAbort);
      }
    }
  });
}

export const chainLibrary = createChainLibrary();

export async function verifyManifestDependencies(value, { library = chainLibrary, signal, network, limits, onProgress } = {}) {
  const manifest = validateChainManifest(value, { network, limits });
  const refs = [{ id: '$runtime', ref: manifest.runtime }, ...manifest.assets.map(asset => ({ id: asset.id, ref: assetChainReference(asset) }))];
  const verified = new Map();
  // Sequential reads cap memory/network pressure; shared caches make later imports inexpensive.
  for (const { id, ref } of refs) {
    abortIfNeeded(signal);
    // Verify again at this boundary: an injected library cannot claim unverified bytes are safe.
    verified.set(id, await verifyChainBytes(ref, await library.read(ref, { signal })));
    onProgress?.({ completed: verified.size, total: refs.length, id });
  }
  abortIfNeeded(signal);
  return { manifest, verified };
}

// Pure staging boundary: callers install project state only after this Promise succeeds.
// Nothing here executes downloaded runtime code, mutates the project, signs or broadcasts.
export async function prepareChainSongImport(value, options = {}) {
  if (typeof value === 'string') {
    if (value.length * 2 > (options.limits?.maxDocumentBytes || CHAIN_LIMITS.maxDocumentBytes)) throw new ChainValidationError('LIMIT', 'Chain song exceeds document limit');
    try { value = JSON.parse(value); } catch { throw new ChainValidationError('JSON', 'Malformed chain song JSON'); }
  }
  const document = validateChainSong(value, options);
  const { verified } = await verifyManifestDependencies(document.manifest, options);
  return { document, project: document.project, manifest: document.manifest, verified, verifiedAssets: verified };
}
