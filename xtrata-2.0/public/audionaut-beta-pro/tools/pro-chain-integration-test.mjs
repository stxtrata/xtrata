#!/usr/bin/env node
// Local HTTP and simulated read-only RPC only. Never connects a wallet or submits a transaction.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { cvToHex, deserializeCV, uintCV, tupleCV, someCV, noneCV, listCV, bufferCV,
  principalCV, stringAsciiCV, responseOkCV, trueCV } from '@stacks/transactions';
import { serve, browser } from './serve.mjs';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const runtimeBytes = await readFile(new URL('../chain-runtime/player.html', import.meta.url));
const catalog = JSON.parse(await readFile(new URL('../chain-runtime/manifest.json', import.meta.url), 'utf8'));
assert.equal(hash(runtimeBytes), catalog.sha256, 'runtime artifact SHA matches its build catalog');
assert.equal(runtimeBytes.length, catalog.bytes, 'runtime artifact byte count matches its build catalog');
assert.ok(catalog.workers.length > 0, 'workers/worklets are embedded in the package');
const address = 'SP000000000000000000002Q6VF78', contractId = address + '.audionaut-test';
const chain = new Map([['100', { bytes: runtimeBytes, mediaType: 'text/html' }]]);
const { srv, url } = await serve();
let b;
const unexpected = [], rpcCalls = [], gatewayCalls = [], errors = [];
function rpcReply(request) {
  const name = new URL(request.url()).pathname.split('/').at(-1), input = request.postDataJSON();
  const args = input.arguments.map(arg => deserializeCV(arg));
  const token = args[0]?.value?.toString(), item = chain.get(token);
  rpcCalls.push({ name, token });
  if (!item) return { okay: true, result: cvToHex(noneCV()) };
  const chunks = [];
  let rolling = Buffer.alloc(32);
  for (let i = 0; i < item.bytes.length; i += 16384) {
    const chunk = item.bytes.subarray(i, i + 16384); chunks.push(chunk);
    rolling = createHash('sha256').update(Buffer.concat([rolling, chunk])).digest();
  }
  let result;
  if (name === 'get-inscription-meta') result = someCV(tupleCV({ owner: principalCV(address),
    'mime-type': stringAsciiCV(item.mediaType), 'total-size': uintCV(item.bytes.length),
    'total-chunks': uintCV(item.totalChunks ?? chunks.length), sealed: trueCV(), 'final-hash': bufferCV(rolling) }));
  else if (name === 'get-chunk') result = chunks[Number(args[1].value)] ? someCV(bufferCV(chunks[Number(args[1].value)])) : noneCV();
  else if (name === 'get-chunk-batch') result = listCV(args[1].list.map(index => chunks[Number(index.value)] ? someCV(bufferCV(chunks[Number(index.value)])) : noneCV()));
  else if (name === 'get-token-uri') result = responseOkCV(noneCV());
  else if (name === 'get-dependencies') result = listCV([]);
  else throw new Error(`Unexpected read-only function: ${name}`);
  return { okay: true, result: cvToHex(result) };
}
async function isolatedContext({ cold = false } = {}) {
  const context = await b.newContext();
  if (cold) await context.addInitScript(() => {
    globalThis.chainWorkerErrors = [];
    const NativeWorker = Worker;
    globalThis.Worker = class extends NativeWorker {
      constructor(...args) {
        try { super(...args); } catch (error) { chainWorkerErrors.push(error.message); throw error; }
        this.addEventListener('error', event => chainWorkerErrors.push(event.message || String(args[0])));
      }
    };
  });
  await context.route('**/*', async route => {
    const request = route.request(), target = new URL(request.url());
    if (target.hostname === 'chain-rpc.invalid' && target.pathname.includes('/v2/contracts/call-read/')) {
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify(rpcReply(request)), headers: { 'access-control-allow-origin': '*' } });
    }
    if (!cold && target.origin === url && target.pathname === '/runtime/content') {
      gatewayCalls.push(target.toString());
      assert.equal(target.searchParams.get('raw'), '1', 'canonical gateway requests must disable HTML rewriting');
      const item = chain.get(target.searchParams.get('tokenId'));
      return route.fulfill(item ? { contentType: item.mediaType, body: item.bytes } : { status: 404, body: 'No such simulated inscription' });
    }
    if (!cold && target.origin === url) return route.continue();
    if (target.protocol === 'blob:' || target.protocol === 'file:') return route.continue();
    unexpected.push(request.url());
    return route.abort();
  });
  context.on('page', page => page.on('pageerror', error => errors.push(error.message)));
  return context;
}
async function blank(context) {
  const page = await context.newPage();
  await page.route('**/__chain-test', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Chain integration</title><p id="status-text"></p><main id="panel"></main>' }));
  await page.goto(url + '/__chain-test');
  return page;
}

try {
  b = await browser();
  const context = await isolatedContext(), editor = await blank(context);
  const packaged = await editor.evaluate(async ({ contractId }) => {
    const S = await import('/audionaut-beta-pro/daw/js/state.js');
    const A = await import('/audionaut-beta-pro/daw/js/assets.js');
    const C = await import('/audionaut-beta-pro/daw/js/chain-publishing.js');
    const P = await import('/audionaut-beta-pro/daw/js/persistence.js');
    const L = await import('/audionaut-beta-pro/daw/js/loader.js');
    const CL = await import('/audionaut-beta-pro/daw/js/chain-library.js');
    const CC = await import('/audionaut-beta-pro/daw/js/clip-contract.js');
    const { projectFingerprint, SOURCE_HASH_VERSION } = await import('/audionaut-beta-pro/daw/js/chain-draft-storage.js');
    const ctx = new AudioContext(), audio = ctx.createBuffer(1, 22050, 44100);
    for (let i = 0; i < audio.length; i++) audio.getChannelData(0)[i] = .4 * Math.sin(i * 2 * Math.PI * 220 / 44100);
    const source = await A.registerAudioBuffer(audio, { name: 'Synthetic fixture.wav', bitDepth: 'float32' });
    const project = S.makeProject(); project.projectName = 'Immutable fixture'; project.channels.length = 2;
    project.instruments.length = 0; project.sequences = [S.makeSequence(2, 0)];
    project.channels[0].source = source; project.channels[1].source = structuredClone(source);
    const catalogue = CC.parseClipLibrary(await (await fetch('/audionaut-beta-pro/daw/data/samples-loops-catalogue.json')).json());
    const clipSource = catalogue.sources[0], clip = structuredClone(catalogue.clips.find(clip => clip.sourceId === clipSource.id));
    clip.region = { startSeconds: 0, endSeconds: .5, startFrame: null, endFrame: null, frameRate: null, endExclusive: true };
    const snapshot = { version: 1, source: clipSource, clip, playback: CC.resolveClipRegion(clip, audio, { mode: 'one-shot', rate: 1 }),
      decoded: { duration: .5, sampleRate: 44100, frames: 22050, channels: 1 },
      retrieved: { sourceHash: '1'.repeat(64), payloadHash: '2'.repeat(64), verificationScope: 'Synthetic chain regression fixture.' },
      effectiveVerification: { tempo: false, seam: false, tuning: false } };
    project.channels[0].clipSnapshot = { ...snapshot, snapshotHash: CC.sha256Text(CC.canonicalJSON(snapshot)) };
    project.channels[1].mute = true; project.sequences[0].steps[0][0] = 1;
    project.sequences[0].steps[0][4] = 1; project.bpm = 120;
    S.store.loadProject(project);
    const before = JSON.stringify(project), draft = await C.prepareDependencyPackage(project, { network: 'mainnet', contractId });
    const unchanged = before === JSON.stringify(project);
    draft.sourceProjectHash = await projectFingerprint(project);
    draft.sourceProjectId = project.projectId;
    draft.sourceHashVersion = SOURCE_HASH_VERSION;
    draft.manifest.runtime.tokenId = '100'; draft.manifest.assets[0].tokenId = '101';
    const audioFile = draft.files.find(file => file.name.endsWith('.wav'));
    const audioBytes = Array.from(new Uint8Array(await audioFile.blob.arrayBuffer()));
    globalThis.chainTest = { S, A, C, P, L, CL, draft, project };
    await ctx.close();
    return { unchanged, unique: draft.manifest.assets.length, files: draft.files.length,
      bindings: Object.keys(draft.bindings).length, draft: JSON.parse(C.serializeChainDraft(draft)), originalProject: project, audioBytes };
  }, { contractId });
  assert.equal(packaged.unchanged, true, 'packaging leaves live project untouched');
  assert.equal(packaged.unique, 1, 'identical audio is deduplicated');
  assert.equal(packaged.files, 2, 'one runtime and one unique audio file');
  assert.equal(packaged.bindings, 2, 'both sample channels retain explicit bindings');
  chain.set('101', { bytes: Buffer.from(packaged.audioBytes), mediaType: 'audio/wav' });
  assert.equal(hash(chain.get('101').bytes), packaged.draft.manifest.assets[0].sha256);
  const publication = await editor.evaluate(async () => {
    const { C, draft } = chainTest;
    const file = await C.prepareChainPublication(draft);
    return { name: file.name, song: JSON.parse(await file.text()) };
  });
  const song = publication.song;
  assert.equal(song.format, 'audionaut-chain-song/1');
  assert.ok(!JSON.stringify(song).includes('data:audio/'));
  assert.equal(song.manifest.runtime.sha256, catalog.sha256);
  assert.ok(gatewayCalls.some(value => value.includes('tokenId=100')));
  assert.ok(gatewayCalls.some(value => value.includes('tokenId=101')));
  console.log('PASS package → immutable bindings → byte-verified instruction song');

  const checks = await editor.evaluate(async song => {
    const { S, C, P, L, CL, draft } = chainTest;
    const source = song.project.channels[0].source;
    const decoded = await L.fetchAndDecode(source);
    let wrongLength = false;
    try { await L.fetchAndDecode({ ...source, chainRef: { ...source.chainRef, bytes: source.chainRef.bytes + 1 } }); } catch { wrongLength = true; }
    const beforeGuard = JSON.stringify(S.store.project);
    let guarded = false; try { await P.importProjectAsync(song, { guard: () => false }); } catch { guarded = true; }
    const guardUnchanged = JSON.stringify(S.store.project) === beforeGuard;
    await P.importProjectAsync(song);
    const preservedManifest = S.store.project.chain?.runtime.sha256 === song.manifest.runtime.sha256;
    const preservedSnapshot = JSON.stringify(S.store.project.channels[0].clipSnapshot) === JSON.stringify(song.project.channels[0].clipSnapshot);
    const v2 = { ...structuredClone(song.project), format: 'audionaut-workstation/2' };
    delete v2.schemaVersion; delete v2.chain;
    const legacyView = () => JSON.stringify(S.store.project, (key, value) => ['id', 'projectId', 'renderSeed'].includes(key) ? undefined : value);
    P.importProject(v2); const synchronous = legacyView();
    await P.importProjectAsync(v2); const legacySame = legacyView() === synchronous;
    const badDraft = structuredClone(draft); badDraft.manifest.runtime.sha256 = '0'.repeat(64);
    let badRuntime = false; try { await C.prepareChainPublication(badDraft); } catch { badRuntime = true; }
    const wrapper = new TextEncoder().encode('<!doctype html><audio src="https://offchain.invalid/sound.wav"></audio>');
    const wrapperRef = { ...source.chainRef, tokenId: '909', bytes: wrapper.length, sha256: await CL.sha256Bytes(wrapper), mediaType: 'text/html' };
    L.setChainSourceLibrary(CL.createChainLibrary({ fetchBytes: async () => wrapper }));
    let wrapperRejected = false;
    try { await L.fetchAndDecode({ ...source, value: '909', chainRef: wrapperRef }); } catch (error) { wrapperRejected = /Recursive|external/.test(error.message); }
    L.setChainSourceLibrary(CL.chainLibrary);
    return { duration: decoded.audioBuffer.duration, wrongLength, guarded, guardUnchanged, preservedManifest, preservedSnapshot, legacySame, badRuntime, wrapperRejected };
  }, song);
  assert.ok(Math.abs(checks.duration - .5) < .0001);
  for (const [key, value] of Object.entries(checks)) if (key !== 'duration') assert.equal(value, true, key);
  console.log('PASS atomic guarded import, old native import, decoded-cache length isolation and no wrapper URL escape');

  // A real UI race: hold runtime catalog fetch while a user edits the live project.
  const ui = await blank(context);
  await ui.evaluate(async ({ originalProject, audioBytes }) => {
    const { mount } = await import('/audionaut-beta-pro/daw/js/pro-chain-ui.js');
    const { store } = await import('/audionaut-beta-pro/daw/js/state.js');
    const { registerBlob } = await import('/audionaut-beta-pro/daw/js/assets.js');
    registerBlob(new Blob([new Uint8Array(audioBytes)], { type: 'audio/wav' }), { id: originalProject.channels[0].source.localAssetId });
    store.loadProject(originalProject);
    globalThis.uiStore = store; globalThis.unmountChain = mount(document.querySelector('#panel'));
  }, { originalProject: packaged.originalProject, audioBytes: packaged.audioBytes });
  await ui.locator('input[type=file]').setInputFiles({ name: 'fixture-draft.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(packaged.draft)) });
  await ui.waitForFunction(() => document.querySelector('#panel').textContent.includes('Publishing draft opened'));
  await ui.evaluate(() => {
    const actual = globalThis.fetch;
    globalThis.fetch = async (...args) => {
      if (String(args[0]).endsWith('/chain-runtime/manifest.json')) await new Promise(resolve => { globalThis.releaseCatalog = resolve; });
      return actual(...args);
    };
  });
  await ui.getByRole('button', { name: 'Verify and prepare song', exact: true }).click();
  await ui.waitForFunction(() => typeof releaseCatalog === 'function');
  await ui.evaluate(() => { uiStore.setProjectProp('projectName', 'Edited while verifying'); releaseCatalog(); });
  await ui.waitForFunction(() => /changed|edits/i.test(document.querySelector('#panel [role=status]').textContent));
  await ui.getByRole('button', { name: 'Download instruction song', exact: true }).click();
  await ui.waitForFunction(() => /Verify|Prepare/i.test(document.querySelector('#status-text').textContent));
  await ui.evaluate(() => unmountChain());
  console.log('PASS publishing UI rejects verification completed after a live project edit');

  // Fresh context and a file:// runtime: no website, module server, CDN or warm asset cache.
  const coldContext = await isolatedContext({ cold: true }), player = await coldContext.newPage();
  await player.goto(new URL('../chain-runtime/player.html', import.meta.url).href);
  await player.waitForFunction(() => !!globalThis.AudioNautChainPlayer);
  await player.locator('#rpc').fill('https://chain-rpc.invalid');
  try { await player.evaluate(song => AudioNautChainPlayer.openSong(song), song); }
  catch (error) { throw new Error(`${error.message}\nDiagnostics: ${JSON.stringify(await player.evaluate(() => ({ workerErrors: chainWorkerErrors, sources: AudioNautChainPlayer.store.project.channels.map(channel => channel.source) })))}`); }
  assert.equal(await player.locator('#play').isEnabled(), true);
  const played = await player.evaluate(async () => {
    const { engine, store } = AudioNautChainPlayer;
    const analyser = engine.ctx.createAnalyser(); analyser.fftSize = 2048;
    engine.masterGain.connect(analyser);
    await engine.play();
    const samples = new Float32Array(analyser.fftSize); let peak = 0;
    for (let i = 0; i < 25; i++) {
      await new Promise(resolve => setTimeout(resolve, 30)); analyser.getFloatTimeDomainData(samples);
      for (const sample of samples) peak = Math.max(peak, Math.abs(sample));
    }
    const result = { peak, running: engine.isPlaying, channels: store.project.channels.length,
      duration: engine.buffers[0].duration, context: engine.ctx.state };
    engine.stop(); engine.masterGain.disconnect(analyser); return result;
  });
  assert.ok(played.peak > .01, `cold chain playback must be audible: peak ${played.peak}`);
  assert.equal(played.running, true); assert.equal(played.context, 'running');
  assert.equal(played.channels, 2); assert.ok(Math.abs(played.duration - .5) < .0001);
  assert.ok(rpcCalls.some(call => call.name === 'get-chunk' || call.name === 'get-chunk-batch'));
  assert.ok(rpcCalls.some(call => call.token === '100'));
  assert.ok(rpcCalls.some(call => call.token === '101'));
  console.log(`PASS cold standalone runtime reconstructs chain bytes through SDK RPC and plays audio (peak ${played.peak.toFixed(4)})`);

  const modifiedRuntime = Buffer.from(runtimeBytes.toString().replace('<script type="module" id="audionaut-runtime">', '<script type="module" id="audionaut-runtime">globalThis.unexpectedRuntimeChange=1;'));
  assert.notEqual(hash(modifiedRuntime), hash(runtimeBytes), 'test changes runtime script');
  chain.set('403', { bytes: modifiedRuntime, mediaType: 'text/html' });
  const differentEngine = structuredClone(song);
  Object.assign(differentEngine.manifest.runtime, { tokenId: '403', sha256: hash(modifiedRuntime), bytes: modifiedRuntime.length });
  const mismatch = await player.evaluate(async bad => {
    const before = JSON.stringify(AudioNautChainPlayer.store.project);
    try { await AudioNautChainPlayer.openSong(bad); return { rejected: false }; }
    catch (error) { return { rejected: true, message: error.message, unchanged: before === JSON.stringify(AudioNautChainPlayer.store.project) }; }
  }, differentEngine);
  assert.equal(mismatch.rejected, true); assert.equal(mismatch.unchanged, true);
  console.log('PASS same-version runtime with different executable code is rejected atomically');

  const corrupt = Buffer.from(chain.get('101').bytes); corrupt[corrupt.length - 1] ^= 1;
  chain.set('404', { bytes: corrupt, mediaType: 'audio/wav' });
  const tampered = structuredClone(song); tampered.manifest.assets[0].tokenId = '404';
  for (const channel of tampered.project.channels) { channel.source.value = '404'; channel.source.chainRef.tokenId = '404'; }
  const tamperResult = await player.evaluate(async bad => {
    const before = JSON.stringify(AudioNautChainPlayer.store.project);
    try { await AudioNautChainPlayer.openSong(bad); return { rejected: false }; }
    catch (error) { return { rejected: true, message: error.message, unchanged: before === JSON.stringify(AudioNautChainPlayer.store.project) }; }
  }, tampered);
  assert.equal(tamperResult.rejected, true); assert.match(tamperResult.message, /SHA-256|hash/i); assert.equal(tamperResult.unchanged, true);
  chain.set('405', { ...chain.get('101'), totalChunks: 1000000000 });
  const oversized = structuredClone(song); oversized.manifest.assets[0].tokenId = '405';
  for (const channel of oversized.project.channels) { channel.source.value = '405'; channel.source.chainRef.tokenId = '405'; }
  const metadataResult = await player.evaluate(async bad => {
    const before = JSON.stringify(AudioNautChainPlayer.store.project);
    try { await AudioNautChainPlayer.openSong(bad); return { rejected: false }; }
    catch (error) { return { rejected: true, message: error.message, unchanged: before === JSON.stringify(AudioNautChainPlayer.store.project) }; }
  }, oversized);
  assert.equal(metadataResult.rejected, true); assert.equal(metadataResult.unchanged, true);
  assert.ok(rpcCalls.some(call => call.token === '405' && call.name === 'get-inscription-meta'));
  assert.ok(!rpcCalls.some(call => call.token === '405' && /get-chunk/.test(call.name)), 'hostile chunk count must fail before chunk allocation/reads');
  assert.deepEqual(await player.evaluate(() => chainWorkerErrors), []);
  assert.deepEqual(unexpected, [], 'standalone playback may only use selected chain RPC, never the website or a CDN');
  assert.deepEqual(errors, [], 'no unhandled browser errors');
  console.log('PASS corrupt chain payload and oversized metadata rejected; no external fallback or live-project mutation');
  await context.close(); await coldContext.close();
  console.log(`Chain integration passed; ${rpcCalls.length} simulated read-only RPC calls, zero wallet operations or broadcasts.`);
} finally { if (b) await b.close(); await new Promise(resolve => srv.close(resolve)); }
