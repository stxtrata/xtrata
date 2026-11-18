import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseClipLibrary, resolveClipRegion, canonicalJSON, sha256Text, validateClipSnapshot } from '../daw/js/clip-contract.js';
import { CHAIN_MANIFEST_FORMAT, CHAIN_SONG_FORMAT, validateChainReference, validateChainManifest,
  scanProjectSources, buildChainSong, validateChainSong, chainRefKey, ChainValidationError } from '../daw/js/chain-manifest.js';
import { sha256Bytes, verifyChainBytes, createChainLibrary, chainContentUrl,
  fetchChainBytes, prepareChainSongImport, verifyManifestDependencies } from '../daw/js/chain-library.js';

const tests = [];
function test(name, fn) { tests.push([name, fn]); }
const encoder = new TextEncoder(), audio = encoder.encode('immutable PCM fixture'), runtime = encoder.encode('self-contained runtime fixture');
const contractId = 'SP000000000000000000002Q6VF78.audionaut-test';
const ref = { network: 'mainnet', contractId, tokenId: '1', sha256: await sha256Bytes(audio), bytes: audio.length, mediaType: 'audio/wav' };
const runtimeRef = { ...ref, tokenId: '2', sha256: await sha256Bytes(runtime), bytes: runtime.length, mediaType: 'text/html', version: 'beta-pro-devices-1' };
const manifest = { format: CHAIN_MANIFEST_FORMAT, network: 'mainnet', runtime: runtimeRef, assets: [{ id: 'kick', kind: 'audio', ...ref }] };
const project = { channels: [{ id: 'sample-1', kind: 'sample', source: { type: 'file', value: 'data:audio/wav;base64,Zml4dHVyZQ==', localAssetId: 'local-kick', label: 'Kick' } }], instruments: [], sequences: [] };
const options = { manifest, bindings: { '/channels/0/source': 'kick' } };
const clone = value => structuredClone(value);
const code = expected => error => error instanceof ChainValidationError && error.code === expected;
const fixtureLibrary = () => createChainLibrary({ fetchBytes: async value => value.tokenId === '2' ? runtime : audio });
const catalogue = parseClipLibrary(JSON.parse(await readFile(new URL('../daw/data/samples-loops-catalogue.json', import.meta.url), 'utf8')));
const originalSource = clone(catalogue.sources[0]);
const originalClip = clone(catalogue.clips.find(clip => clip.sourceId === originalSource.id));
originalClip.region = { startSeconds: 0, endSeconds: .5, startFrame: null, endFrame: null, frameRate: null, endExclusive: true };
const snapshotContent = { version: 1, source: originalSource, clip: originalClip,
  playback: resolveClipRegion(originalClip, { duration: .5, sampleRate: 44100, length: 22050 }, { mode: 'one-shot', rate: 1 }),
  decoded: { duration: .5, sampleRate: 44100, frames: 22050, channels: 1 },
  retrieved: { sourceHash: '1'.repeat(64), payloadHash: '2'.repeat(64), verificationScope: 'Synthetic local fixture.' },
  effectiveVerification: { tempo: false, seam: false, tuning: false } };
const originalSnapshot = { ...snapshotContent, snapshotHash: sha256Text(canonicalJSON(snapshotContent)) };
validateClipSnapshot(originalSnapshot);

test('canonical refs and raw gateway URLs', () => {
  assert.deepEqual(validateChainReference(ref), ref);
  const url = new URL(chainContentUrl(ref), 'https://example.invalid');
  assert.equal(url.searchParams.get('raw'), '1');
  assert.equal(url.searchParams.get('contractId'), contractId);
  assert.equal(chainRefKey(ref), `mainnet:${contractId}:1`);
});
test('token IDs reject precision loss, signs, leading zeros, overflow and malformed hashes', () => {
  for (const tokenId of [1, '-1', '+1', '01', '1.0', '1e3', ' 1', '', (1n << 128n).toString()]) assert.throws(() => validateChainReference({ ...ref, tokenId }), code('TOKEN'));
  assert.equal(validateChainReference({ ...ref, tokenId: ((1n << 128n) - 1n).toString() }).tokenId.length, 39);
  for (const sha256 of ['ff', ref.sha256.toUpperCase(), 'g'.repeat(64)]) assert.throws(() => validateChainReference({ ...ref, sha256 }), code('HASH'));
});
test('network and contract syntax fail closed', () => {
  assert.throws(() => validateChainReference(ref, { network: 'testnet' }), code('NETWORK'));
  assert.throws(() => validateChainReference({ ...ref, network: 'testnet' }), code('NETWORK'));
  for (const bad of ['SP.short', `${contractId}/path`, contractId.replace('SP', 'SI'), 'https://example.com']) assert.throws(() => validateChainReference({ ...ref, contractId: bad }), code('CONTRACT'));
  assert.throws(() => validateChainManifest(manifest, { network: 'testnet' }), code('NETWORK'));
});
test('strict versions, fields, limits, media and runtime are required', () => {
  assert.throws(() => validateChainManifest({ ...manifest, format: 'audionaut-chain-manifest/2' }), code('VERSION'));
  assert.throws(() => validateChainManifest({ ...manifest, runtime: ref }), code('VERSION'));
  assert.throws(() => validateChainManifest({ ...manifest, mystery: true }), code('FIELD'));
  for (const bytes of [0, -1, 1.5, 257 * 1024 * 1024]) assert.throws(() => validateChainReference({ ...ref, bytes }), code('LIMIT'));
  assert.throws(() => validateChainReference({ ...ref, mediaType: 'audio/wav; url=evil' }), code('TYPE'));
  assert.throws(() => validateChainManifest(manifest, { limits: { maxTotalBytes: 1 } }), code('LIMIT'));
  assert.throws(() => validateChainManifest(manifest, { limits: { maxAssets: 0 } }), code('LIMIT'));
});
test('duplicate asset IDs and conflicting chain locations are rejected', () => {
  assert.throws(() => validateChainManifest({ ...manifest, assets: [...manifest.assets, { ...manifest.assets[0], tokenId: '3' }] }), code('COLLISION'));
  assert.throws(() => validateChainManifest({ ...manifest, assets: [...manifest.assets, { ...manifest.assets[0], id: 'alias', sha256: '0'.repeat(64) }] }), code('COLLISION'));
  assert.throws(() => validateChainManifest({ ...manifest, assets: [{ ...manifest.assets[0], tokenId: '2' }] }), code('COLLISION'));
});
test('instruction build is atomic and removes inline/cache payloads', () => {
  const before = JSON.stringify(project), song = buildChainSong(project, options);
  assert.equal(song.format, CHAIN_SONG_FORMAT);
  assert.equal(JSON.stringify(project), before);
  const source = song.project.channels[0].source;
  assert.equal(source.chainAssetId, 'kick');
  assert.equal(source.chainRef.sha256, ref.sha256);
  assert.equal(source.localAssetId, undefined);
  assert.equal(source.value, '1');
  assert.ok(!JSON.stringify(song).includes('data:audio'));
  assert.deepEqual(validateChainSong(song), song);
});
test('missing bindings, unknown paths and media masquerading as code fail closed', () => {
  assert.throws(() => buildChainSong(project, { manifest }), code('MISSING'));
  assert.throws(() => buildChainSong(project, { ...options, bindings: { '/channels/0/source': 'missing' } }), code('MISSING'));
  assert.throws(() => buildChainSong(project, { ...options, bindings: { ...options.bindings, '/missing': 'kick' } }), code('BINDING'));
  assert.throws(() => buildChainSong(project, { ...options, manifest: { ...manifest, assets: [{ ...manifest.assets[0], kind: 'code' }] } }), code('TYPE'));
});
test('nested takes, frozen tracks, IR and wavetable references are scanned', () => {
  const value = clone(project);
  value.channels[0].takes = [{ source: { type: 'url', value: 'https://example.invalid/take.wav' } }];
  value.channels[0].freezeState = { track: { source: { type: 'pack', value: 'bank/kick' } } };
  value.instruments = [{ irSource: { type: 'file', value: 'data:audio/wav;base64,eA==' }, wavetableRef: { id: 'unbound-table' } }];
  const scan = scanProjectSources(value);
  assert.equal(scan.sources.length, 5);
  assert.throws(() => buildChainSong(value, options), code('MISSING'));
  const bindings = Object.fromEntries(scan.sources.map(item => [item.path, 'kick']));
  assert.equal(scanProjectSources(buildChainSong(value, { manifest, bindings }).project).sources.length, 5);
});
test('binding a collected source removes its old provenance source', () => {
  const value = clone(project);
  value.channels[0].source.collectedFrom = { type: 'url', value: 'https://example.invalid/old.wav' };
  assert.equal(scanProjectSources(value).sources.length, 1);
  const song = buildChainSong(value, options);
  assert.equal(song.project.channels[0].source.collectedFrom, undefined);
});
test('hidden URLs, inline assets and device resource paths cannot escape scanning', () => {
  for (const extra of [{ assets: { kick: 'data:audio/wav;base64,eA==' } }, { assetData: [0, 1, 2] }, { device: { wavetablePath: 'tables/pulse.wav' } }, { state: { cacheId: 'browser-only' } }, { nested: { thing: 'https://example.invalid/a.wav' } }]) {
    assert.throws(() => buildChainSong({ ...clone(project), ...extra }, options), code('UNRESOLVED'));
  }
});
test('sample-device references resolve to actual populated sample tracks', () => {
  const value = clone(project);
  value.instruments = [{ sampleInstrument: { sources: [{ sourceTrackId: 'sample-1' }] }, fx: [{ irSource: { sourceTrackId: 'sample-1' } }] }];
  assert.equal(scanProjectSources(value).unresolved.length, 0);
  buildChainSong(value, options);
  value.instruments[0].sampleInstrument.sources[0].sourceTrackId = 'missing';
  assert.throws(() => buildChainSong(value, options), code('UNRESOLVED'));
});
test('frozen snapshots can repeat track IDs while active routing identities stay unique', () => {
  const value = clone(project);
  value.channels[0].freezeState = { original: clone(project.channels[0]) };
  let scan = scanProjectSources(value);
  assert.equal(scan.sources.length, 2); assert.equal(scan.unresolved.length, 0);
  buildChainSong(value, { manifest, bindings: Object.fromEntries(scan.sources.map(source => [source.path, 'kick'])) });
  value.channels.push(clone(project.channels[0]));
  scan = scanProjectSources(value);
  assert.ok(scan.unresolved.some(item => /Duplicate/.test(item.reason)));
  const orphan = { channels: [], freezeState: { original: clone(project.channels[0]) }, irSource: { sourceTrackId: 'sample-1' } };
  assert.ok(scanProjectSources(orphan).unresolved.some(item => /Missing/.test(item.reason)));
});
test('real original clip catalogue snapshots remain inert, hashed and backward compatible', () => {
  const value = clone(project); value.channels[0].clipSnapshot = clone(originalSnapshot);
  const scan = scanProjectSources(value);
  assert.equal(scan.sources.length, 1); assert.equal(scan.unresolved.length, 0);
  const song = buildChainSong(value, options);
  assert.deepEqual(song.project.channels[0].clipSnapshot, originalSnapshot);
  value.channels[0].clipSnapshot.snapshotHash = '0'.repeat(64);
  assert.throws(() => buildChainSong(value, options), code('SNAPSHOT'));
  value.channels[0].clipSnapshot = clone(originalSnapshot);
  value.channels[0].clipSnapshot.unrecognizedSource = { type: 'url', value: 'https://example.invalid/hidden.wav' };
  assert.throws(() => scanProjectSources(value), code('FIELD'));
});
test('procedural allowlist is explicit; onboard bank keys are not implicitly safe', () => {
  const value = clone(project); value.channels[0].source = { type: 'synth', value: 'kick-procedural' };
  assert.throws(() => buildChainSong(value, { manifest }), code('MISSING'));
  buildChainSong(value, { manifest, proceduralKeys: ['kick-procedural'] });
  value.channels[0].source.value = 'onboard:v2:grand';
  assert.throws(() => buildChainSong(value, { manifest, proceduralKeys: ['kick-procedural'] }), code('MISSING'));
});
test('source ID, location and manifest hash cannot disagree', () => {
  const song = buildChainSong(project, options);
  song.project.channels[0].source.chainRef.sha256 = '0'.repeat(64);
  assert.throws(() => validateChainSong(song), code('COLLISION'));
  song.project.channels[0].source.chainRef.sha256 = ref.sha256;
  song.project.channels[0].source.value = '3';
  assert.throws(() => validateChainSong(song), code('COLLISION'));
});
test('non-JSON values, prototype keys, cycles and excessive depth are rejected', () => {
  const bad = JSON.parse('{"channels":[],"__proto__":{"polluted":true}}');
  assert.throws(() => scanProjectSources(bad), code('JSON'));
  const circular = {}; circular.self = circular;
  assert.throws(() => scanProjectSources(circular), code('JSON'));
  assert.throws(() => scanProjectSources({ file: new Uint8Array(2) }), code('SHAPE'));
  assert.throws(() => scanProjectSources({ n: Infinity }), code('JSON'));
  assert.throws(() => scanProjectSources({ a: { b: {} } }, { limits: { maxDepth: 1 } }), code('LIMIT'));
});
test('verification checks both exact byte length and raw payload hash', async () => {
  assert.deepEqual(await verifyChainBytes(ref, audio), audio);
  await assert.rejects(verifyChainBytes(ref, audio.slice(1)), code('LENGTH'));
  await assert.rejects(verifyChainBytes(ref, new Uint8Array(audio.length)), code('HASH'));
  await assert.rejects(verifyChainBytes(ref, new Uint8Array(audio.length + 1)), code('LIMIT'));
});
test('corrupt cache entries are evicted and fetched, never trusted', async () => {
  const cache = new Map(), key = `${chainRefKey(ref)}:${ref.sha256}:${ref.bytes}`;
  cache.set(key, new Uint8Array(audio.length)); let reads = 0;
  const library = createChainLibrary({ cache, fetchBytes: async () => { reads++; return audio; } });
  const bytes = await library.read(ref); bytes[0] ^= 255;
  assert.deepEqual(await library.read(ref), audio);
  assert.equal(reads, 1);
  cache.get(key)[0] ^= 255;
  assert.deepEqual(await library.read(ref), audio);
  assert.equal(reads, 2);
});
test('failed transport verification never poisons the cache', async () => {
  const cache = new Map();
  const library = createChainLibrary({ cache, fetchBytes: async () => new Uint8Array(audio.length) });
  await assert.rejects(library.read(ref), code('HASH'));
  assert.equal(cache.size, 0);
});
test('binding import verifies runtime and every dependency before returning a copy', async () => {
  const song = buildChainSong(project, options), before = JSON.stringify(song);
  const result = await prepareChainSongImport(song, { library: fixtureLibrary() });
  assert.equal(result.verified.size, 2);
  assert.deepEqual(result.verified.get('$runtime'), runtime);
  result.project.channels[0].source.label = 'Changed staged copy';
  assert.equal(JSON.stringify(song), before);
  const badLibrary = { read: async value => value.tokenId === '2' ? runtime : new Uint8Array(audio.length) };
  await assert.rejects(prepareChainSongImport(song, { library: badLibrary }), code('HASH'));
  assert.equal(JSON.stringify(song), before);
});
test('unsupported versions/networks and malformed JSON fail before network reads', async () => {
  let reads = 0; const library = { read: async () => { reads++; return audio; } };
  const song = buildChainSong(project, options);
  await assert.rejects(prepareChainSongImport(song, { library, network: 'testnet' }), code('NETWORK'));
  await assert.rejects(prepareChainSongImport('{bad', { library }), code('JSON'));
  await assert.rejects(prepareChainSongImport({ ...song, schemaVersion: 2 }, { library }), code('VERSION'));
  assert.equal(reads, 0);
});
test('gateway stream is bounded and truncated bodies are rejected', async () => {
  const fetch = async () => new Response(audio);
  assert.deepEqual(await fetchChainBytes(ref, { fetch }), audio);
  await assert.rejects(fetchChainBytes(ref, { fetch: async () => new Response(audio.slice(1)) }), code('LENGTH'));
  await assert.rejects(fetchChainBytes(ref, { fetch: async () => new Response(new Uint8Array(audio.length + 1)) }), code('LIMIT'));
  await assert.rejects(fetchChainBytes(ref, { fetch: async () => new Response(audio, { headers: { 'content-length': '1' } }) }), code('LENGTH'));
});
test('aborted requests and uncooperative transport timeouts are bounded', async () => {
  const controller = new AbortController(); controller.abort();
  await assert.rejects(fixtureLibrary().read(ref, { signal: controller.signal }), error => error.name === 'AbortError');
  const library = createChainLibrary({ fetchBytes: () => new Promise(() => {}), timeoutMs: 10 });
  await assert.rejects(library.read(ref), code('TIMEOUT'));
});
test('asset verification covers unused dependencies, not only active channels', async () => {
  const extra = { ...manifest, assets: [...manifest.assets, { ...manifest.assets[0], id: 'future', tokenId: '3' }] };
  let calls = 0;
  const library = { read: async value => { calls++; if (value.tokenId === '3') throw new Error('Unavailable'); return value.tokenId === '2' ? runtime : audio; } };
  await assert.rejects(verifyManifestDependencies(extra, { library }), /Unavailable/);
  assert.equal(calls, 3);
});

let passed = 0;
for (const [name, run] of tests) {
  try { await run(); passed++; console.log(`PASS ${name}`); }
  catch (error) { console.error(`FAIL ${name}`); throw error; }
}
console.log(`Chain manifest/library: ${passed} tests passed; all transports mocked, no wallet or chain writes.`);
