// Immutable, transport-independent dependency documents. No wallet or store access.
import { validateClipSnapshot } from './clip-contract.js';
import { validateLegacyImport } from './legacy-bridge/provenance.js';
export const CHAIN_MANIFEST_FORMAT = 'audionaut-chain-manifest/1';
export const CHAIN_SONG_FORMAT = 'audionaut-chain-song/1';
export const CHAIN_LIMITS = Object.freeze({ maxAssets: 4096, maxAssetBytes: 256 * 1024 * 1024,
  maxTotalBytes: 512 * 1024 * 1024, maxDepth: 80, maxNodes: 2000000, maxDocumentBytes: 64 * 1024 * 1024 });
const REF_FIELDS = ['network', 'contractId', 'tokenId', 'sha256', 'bytes', 'mediaType'];
const KINDS = new Set(['audio', 'impulse-response', 'wavetable', 'library', 'code', 'asset']);
const SOURCE_TYPES = new Set(['ordinal', 'xtrata', 'url', 'file', 'pack', 'synth', 'chain']);
const FORBIDDEN_KEYS = new Set(['__proto__', 'prototype', 'constructor']);
const SOURCE_META = new Set(['label', 'audioSha256']);
const LOCATOR = /^(?:https?:|data:|blob:|file:|ipfs:|ipns:|ar:|asset:|cache:|indexeddb:|javascript:|\/\/)/i;
const RESOURCE_KEY = /(?:url|uri|path|assetId|cacheId|assetData|audioData|base64|binary|buffer|source|(?:sample|ir|wavetable|library|device)Ref)$/i;
const ptr = (path, key) => `${path}/${String(key).replace(/~/g, '~0').replace(/\//g, '~1')}`;

export class ChainValidationError extends Error {
  constructor(code, message, path = '') { super(`${message}${path ? ` (${path})` : ''}`); this.name = 'ChainValidationError'; this.code = code; this.path = path; }
}
function fail(code, message, path) { throw new ChainValidationError(code, message, path); }
function limitsFor(options = {}) {
  const limits = { ...CHAIN_LIMITS, ...options.limits };
  for (const key of Object.keys(limits)) if (!(key in CHAIN_LIMITS) || !Number.isSafeInteger(limits[key]) || limits[key] < 1 || limits[key] > CHAIN_LIMITS[key]) fail('LIMIT', 'Invalid chain document limit', key);
  return limits;
}
function record(value, path) {
  if (!value || Array.isArray(value) || typeof value !== 'object' || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) fail('SHAPE', 'Expected a plain JSON object', path);
}
function exactKeys(value, allowed, path) {
  record(value, path);
  for (const key of Object.keys(value)) if (!allowed.includes(key)) fail('FIELD', `Unsupported field ${key}`, path);
}
function networkOf(network, path) {
  if (network !== 'mainnet' && network !== 'testnet') fail('NETWORK', 'Expected mainnet or testnet', path);
  return network;
}
function jsonClone(value, limits, omitRootKeys = []) {
  let count = 0, stringBytes = 0;
  const active = new Set();
  function visit(item, path, depth) {
    if (++count > limits.maxNodes || depth > limits.maxDepth) fail('LIMIT', 'Project exceeds document limits', path);
    if (typeof item === 'string') {
      stringBytes += item.length * 2;
      if (stringBytes > limits.maxDocumentBytes) fail('LIMIT', 'Project text exceeds document limit', path);
      return item;
    }
    if (item === null || typeof item === 'boolean') return item;
    if (typeof item === 'number') { if (!Number.isFinite(item)) fail('JSON', 'Non-finite number', path); return item; }
    if (typeof item !== 'object') fail('JSON', 'Only JSON values are allowed', path);
    if (active.has(item)) fail('JSON', 'Cyclic project object', path);
    if (!Array.isArray(item)) record(item, path);
    active.add(item);
    const out = Array.isArray(item) ? [] : {};
    for (const key of Object.keys(item)) {
      if (FORBIDDEN_KEYS.has(key)) fail('JSON', 'Unsafe object key', ptr(path, key));
      if (!path && omitRootKeys.includes(key)) continue;
      out[key] = visit(item[key], ptr(path, key), depth + 1);
    }
    active.delete(item);
    return out;
  }
  const result = visit(value, '', 0);
  if (new TextEncoder().encode(JSON.stringify(result)).byteLength > limits.maxDocumentBytes) fail('LIMIT', 'Project exceeds encoded document limit');
  return result;
}

export function validateChainReference(value, options = {}) {
  const path = options.path || '', limits = limitsFor(options);
  exactKeys(value, [...REF_FIELDS, 'version'], path);
  const network = networkOf(value.network, path);
  if (options.network && options.network !== network) fail('NETWORK', 'Dependency network does not match this document', path);
  const match = typeof value.contractId === 'string' && /^S([PMTN])[0-9A-HJKMNP-TV-Z]{20,40}\.[a-zA-Z][a-zA-Z0-9-]{0,127}$/.exec(value.contractId);
  if (!match) fail('CONTRACT', 'Malformed Stacks contract identifier', path);
  if ((network === 'mainnet') !== ['P', 'M'].includes(match[1])) fail('NETWORK', 'Contract address belongs to a different network', path);
  if (typeof value.tokenId !== 'string' || !/^(0|[1-9][0-9]{0,38})$/.test(value.tokenId) || BigInt(value.tokenId) > (1n << 128n) - 1n) fail('TOKEN', 'Token ID must be a canonical uint128 decimal string', path);
  if (typeof value.sha256 !== 'string' || !/^[0-9a-f]{64}$/.test(value.sha256)) fail('HASH', 'Expected lowercase SHA-256 hex', path);
  if (!Number.isSafeInteger(value.bytes) || value.bytes < 1 || value.bytes > limits.maxAssetBytes) fail('LIMIT', 'Dependency byte length is outside limits', path);
  if (typeof value.mediaType !== 'string' || !/^[a-z0-9][a-z0-9!#$&^_.+-]*\/[a-z0-9][a-z0-9!#$&^_.+-]*$/.test(value.mediaType) || value.mediaType.length > 127) fail('TYPE', 'Expected a canonical media type without parameters', path);
  if (value.version !== undefined && (typeof value.version !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9._+-]{0,95}$/.test(value.version))) fail('VERSION', 'Malformed runtime version', path);
  return Object.fromEntries([...REF_FIELDS, ...(value.version === undefined ? [] : ['version'])].map(key => [key, value[key]]));
}

// Location identity intentionally excludes claimed hash: conflicting hashes at one location are errors.
export function chainRefKey(ref) { const value = validateChainReference(ref); return `${value.network}:${value.contractId}:${value.tokenId}`; }
export function assetChainReference(asset) { return Object.fromEntries(REF_FIELDS.map(key => [key, asset[key]])); }

export function validateChainManifest(value, options = {}) {
  const limits = limitsFor(options);
  exactKeys(value, ['format', 'network', 'runtime', 'assets'], '/manifest');
  if (value.format !== CHAIN_MANIFEST_FORMAT) fail('VERSION', 'Unsupported dependency manifest format', '/manifest/format');
  const network = networkOf(value.network, '/manifest/network');
  if (options.network && options.network !== network) fail('NETWORK', 'Manifest network does not match the selected network', '/manifest/network');
  const runtime = validateChainReference(value.runtime, { ...options, network, path: '/manifest/runtime' });
  if (!runtime.version) fail('VERSION', 'An immutable runtime version is required', '/manifest/runtime/version');
  if (!Array.isArray(value.assets) || value.assets.length > limits.maxAssets) fail('LIMIT', 'Invalid asset list or too many dependencies', '/manifest/assets');
  const ids = new Set(), locations = new Set([chainRefKey(runtime)]);
  let totalBytes = runtime.bytes;
  const assets = value.assets.map((asset, index) => {
    const path = `/manifest/assets/${index}`;
    exactKeys(asset, ['id', 'kind', ...REF_FIELDS], path);
    if (typeof asset.id !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,95}$/.test(asset.id)) fail('ID', 'Malformed dependency ID', path);
    if (ids.has(asset.id)) fail('COLLISION', 'Duplicate dependency ID', path);
    ids.add(asset.id);
    if (!KINDS.has(asset.kind)) fail('TYPE', 'Unsupported dependency kind', path);
    const ref = validateChainReference(assetChainReference(asset), { ...options, network, path });
    const location = chainRefKey(ref);
    if (locations.has(location)) fail('COLLISION', 'Duplicate or conflicting chain location', path);
    locations.add(location); totalBytes += ref.bytes;
    if (totalBytes > limits.maxTotalBytes) fail('LIMIT', 'Combined dependency size exceeds limits', path);
    return { id: asset.id, kind: asset.kind, ...ref };
  });
  if (totalBytes > limits.maxTotalBytes) fail('LIMIT', 'Combined dependency size exceeds limits');
  return { format: CHAIN_MANIFEST_FORMAT, network, runtime, assets };
}

function looksLikeSource(value, key) {
  return value && typeof value === 'object' && !Array.isArray(value) && !('sourceTrackId' in value) &&
    ((/^(?:source|.*Source|(?:sample|ir|wavetable|library|device)Ref)$/.test(key)) ||
      (SOURCE_TYPES.has(value.type) && ('value' in value || 'localAssetId' in value || 'chainRef' in value)));
}

function validateInertClipSnapshot(value, path) {
  exactKeys(value, ['version', 'source', 'clip', 'playback', 'decoded', 'retrieved', 'effectiveVerification', 'snapshotHash'], path);
  try { validateClipSnapshot(value); } catch (error) { fail('SNAPSHOT', error.message, path); }
  function inspect(item, itemPath, key = '') {
    if (typeof item === 'string' && /^(?:data:|blob:|asset:|cache:|indexeddb:|file:)/i.test(item.trim())) fail('UNRESOLVED', 'Pinned metadata must not embed media or local resource handles', itemPath);
    if (item !== null && /(?:localAssetId|cacheId|assetData|audioData|base64|binary|buffer)$/i.test(key)) fail('UNRESOLVED', 'Pinned metadata contains an unbound resource', itemPath);
    if (item && typeof item === 'object') for (const [childKey, child] of Object.entries(item)) inspect(child, ptr(itemPath, childKey), childKey);
  }
  inspect(value, path);
}

export function scanProjectSources(project, options = {}) {
  const clean = jsonClone(project, limitsFor(options)), procedural = new Set(options.proceduralKeys || []);
  const sources = [], trackReferences = [], unresolved = [], tracks = new Map();
  // Only active sample channels are routing targets. Frozen originals and take snapshots
  // retain their source dependencies but may intentionally repeat an active track ID.
  for (const [index, channel] of (clean.channels || []).entries()) if (channel && typeof channel.id === 'string') {
    if (tracks.has(channel.id)) unresolved.push({ path: `/channels/${index}/id`, reason: 'Duplicate sample track identity' });
    tracks.set(channel.id, channel);
  }
  function walk(value, path = '', key = '') {
    // Original catalogue snapshots carry hashed provenance URLs, not fetch instructions.
    // Their channel's source is still bound normally; chain loading never follows this metadata.
    if (key === 'clipSnapshot' && value !== null) { validateInertClipSnapshot(value, path); return; }
    // This bounded schema contains provenance only (hashes, reviewed repair
    // evidence and inactive legacy instructions). Audio sources remain on the
    // channel graph and must still bind to immutable manifest dependencies.
    if(path==='/legacyImport'&&value!==null){validateLegacyImport(value);return;}
    if (value !== null && typeof value === 'object' && /(?:assetData|audioData|base64|binary|buffer)$/i.test(key)) unresolved.push({ path, reason: 'Inline binary resource has no immutable dependency' });
    if (!value || typeof value !== 'object') {
      if (typeof value === 'string' && value && (LOCATOR.test(value.trim()) || RESOURCE_KEY.test(key))) unresolved.push({ path, reason: 'Unbound external or local resource' });
      return;
    }
    if (looksLikeSource(value, key)) {
      sources.push({ path, source: value, procedural: value.type === 'synth' && procedural.has(value.value) });
      // Sources are atomic playback references. Binding removes provenance such as collectedFrom;
      // validation rejects unknown fields instead of treating provenance as another playable asset.
      return;
    }
    if ('sourceTrackId' in value && value.sourceTrackId !== null && value.sourceTrackId !== '') trackReferences.push({ path: ptr(path, 'sourceTrackId'), sourceTrackId: value.sourceTrackId });
    for (const [childKey, child] of Object.entries(value)) walk(child, ptr(path, childKey), childKey);
  }
  walk(clean);
  for (const ref of trackReferences) if (typeof ref.sourceTrackId !== 'string' || !tracks.has(ref.sourceTrackId) || !tracks.get(ref.sourceTrackId).source) unresolved.push({ path: ref.path, reason: 'Missing sample-track dependency' });
  return { sources, trackReferences, unresolved };
}

function sourceForAsset(source, asset) {
  const meta = {};
  for (const key of SOURCE_META) if (source[key] !== undefined) {
    if (typeof source[key] !== 'string' || (key === 'audioSha256' && !/^[0-9a-f]{64}$/.test(source[key]))) fail('HASH', `Invalid source ${key}`);
    meta[key] = source[key];
  }
  return { type: 'xtrata', value: asset.tokenId, network: asset.network, contractId: asset.contractId,
    chainAssetId: asset.id, chainRef: assetChainReference(asset), ...meta };
}
function sameReference(a, b) { return REF_FIELDS.every(key => a[key] === b[key]); }
function matchAsset(source, manifest, assets) {
  const asset = source.chainAssetId ? assets.get(source.chainAssetId) : manifest.assets.find(item => source.type === 'xtrata' && source.value === item.tokenId && source.network === item.network && source.contractId === item.contractId);
  if (!asset) return null;
  if (source.chainRef && !sameReference(validateChainReference(source.chainRef, { network: manifest.network }), asset)) fail('COLLISION', 'Source reference conflicts with its manifest dependency');
  if (source.chainAssetId && (source.type !== 'xtrata' || source.value !== asset.tokenId || source.network !== asset.network || source.contractId !== asset.contractId)) fail('COLLISION', 'Source locator conflicts with its dependency ID');
  return asset;
}
function replaceAt(project, path, value) {
  const keys = path.slice(1).split('/').map(key => key.replace(/~1/g, '/').replace(/~0/g, '~'));
  let node = project;
  for (const key of keys.slice(0, -1)) node = node[key];
  node[keys.at(-1)] = value;
}

export function buildChainSong(project, options = {}) {
  const manifest = validateChainManifest(options.manifest, options);
  const candidate = jsonClone(project, limitsFor(options), ['chain']);
  record(candidate, '/project');
  const assets = new Map(manifest.assets.map(asset => [asset.id, asset]));
  const bindings = options.bindings instanceof Map ? options.bindings : new Map(Object.entries(options.bindings || {}));
  const scan = scanProjectSources(candidate, options), seen = new Set(), replaced = [];
  for (const { path, source, procedural } of scan.sources) {
    if (replaced.some(parent => path.startsWith(`${parent}/`))) continue;
    seen.add(path);
    const bound = bindings.has(path);
    const asset = bound ? assets.get(bindings.get(path)) : matchAsset(source, manifest, assets);
    if (bound && !asset) fail('MISSING', 'Binding names a missing manifest dependency', path);
    if (asset) {
      if (asset.kind === 'code' || asset.kind === 'library') fail('TYPE', 'Playable sources require explicit media dependencies', path);
      replaceAt(candidate, path, sourceForAsset(source, asset));
      replaced.push(path);
    } else if (procedural) {
      replaceAt(candidate, path, { type: 'synth', value: source.value, ...(typeof source.label === 'string' ? { label: source.label } : {}) });
      replaced.push(path);
    } else fail('MISSING', 'Source has no immutable chain dependency', path);
  }
  for (const path of bindings.keys()) if (!seen.has(path)) fail('BINDING', 'Binding path does not identify a project source', path);
  const doc = { format: CHAIN_SONG_FORMAT, schemaVersion: 1, manifest, project: candidate };
  return validateChainSong(doc, options);
}

export function validateChainSong(value, options = {}) {
  const doc = jsonClone(value, limitsFor(options));
  exactKeys(doc, ['format', 'schemaVersion', 'manifest', 'project'], '');
  if (doc.format !== CHAIN_SONG_FORMAT || doc.schemaVersion !== 1) fail('VERSION', 'Unsupported chain song format');
  const manifest = validateChainManifest(doc.manifest, options);
  record(doc.project, '/project');
  if (doc.project.chain !== undefined) fail('FIELD', 'Chain song project must not contain a second chain manifest', '/project/chain');
  const scan = scanProjectSources(doc.project, options), assets = new Map(manifest.assets.map(asset => [asset.id, asset]));
  if (scan.unresolved.length) fail('UNRESOLVED', scan.unresolved[0].reason, scan.unresolved[0].path);
  for (const { path, source, procedural } of scan.sources) {
    if (procedural) {
      exactKeys(source, ['type', 'value', 'label'], path);
      continue;
    }
    exactKeys(source, ['type', 'value', 'network', 'contractId', 'chainAssetId', 'chainRef', ...SOURCE_META], path);
    const asset = matchAsset(source, manifest, assets);
    if (!asset || !source.chainRef || !source.chainAssetId) fail('MISSING', 'Source is not bound to its manifest dependency', path);
    if (asset.kind === 'code' || asset.kind === 'library') fail('TYPE', 'Playable sources require explicit media dependencies', path);
    sourceForAsset(source, asset);
  }
  return { format: CHAIN_SONG_FORMAT, schemaVersion: 1, manifest, project: doc.project };
}
