import { scanProjectSources, buildChainSong, validateChainManifest } from './chain-manifest.js';
import { sha256Bytes, chainLibrary, prepareChainSongImport } from './chain-library.js';
import { fetchAndDecode } from './loader.js';
import { assetBlob, dataUrlBlob } from './assets.js';
import { encodeWavAsync } from './audio-utils.js';
import { RUNTIME_VERSION } from './runtime-version.js';

const RUNTIME_BASE = new URL('../../chain-runtime/', import.meta.url);
function at(root, pointer, value) {
  const keys = pointer
    .slice(1)
    .split('/')
    .map((k) => k.replace(/~1/g, '/').replace(/~0/g, '~'));
  let node = root;
  for (const key of keys.slice(0, -1)) node = node[key];
  node[keys.at(-1)] = value;
}
export async function currentRuntime({ signal } = {}) {
  const response = await fetch(new URL('manifest.json', RUNTIME_BASE), { signal });
  if (!response.ok)
    throw Error(
      'The chain playback package is unavailable. Retry after the current build completes.'
    );
  const build = await response.json();
  if (
    build.format !== 'audionaut-runtime-build/1' ||
    build.version !== RUNTIME_VERSION ||
    build.file !== 'player.html'
  )
    throw Error('The playback package does not match this AudioNaut version.');
  return build;
}
export async function prepareDependencyPackage(
  project,
  { network = 'mainnet', contractId = '', signal, onProgress = () => {} } = {}
) {
  const copy = structuredClone(project);
  delete copy.chain;
  copy.format = 'audionaut-workstation/3';
  copy.schemaVersion = 3;
  const runtime = await currentRuntime({ signal }),
    response = await fetch(new URL('player.html', RUNTIME_BASE), { signal });
  if (!response.ok) throw Error('The playback package could not be read.');
  const runtimeBlob = await response.blob();
  if (
    runtimeBlob.size !== runtime.bytes ||
    (await sha256Bytes(await runtimeBlob.arrayBuffer())) !== runtime.sha256
  )
    throw Error('The playback package failed verification.');
  const scan = scanProjectSources(copy);
  if (scan.unresolved.length)
    throw Error(scan.unresolved[0].reason + ' at ' + scan.unresolved[0].path);
  const files = [{ name: `audionaut-${runtime.version}.html`, blob: runtimeBlob }],
    assets = [],
    bindings = {},
    byHash = new Map(),
    sources = scan.sources;
  let total = runtimeBlob.size;
  for (let i = 0; i < sources.length; i++) {
    signal?.throwIfAborted();
    const { path, source } = sources[i];
    let blob, ref;
    if (source.chainRef) {
      ref = source.chainRef;
      blob = new Blob([await chainLibrary.read(ref, { signal })], { type: ref.mediaType });
    } else if (source.localAssetId) blob = assetBlob(source.localAssetId);
    else if (source.value?.startsWith('data:audio/')) blob = dataUrlBlob(source.value);
    else {
      const decoded = await fetchAndDecode(source, { signal });
      blob = await encodeWavAsync(decoded.audioBuffer, { bitDepth: 'float32', signal });
    }
    const sha256 = await sha256Bytes(await blob.arrayBuffer());
    let asset = byHash.get(sha256);
    if (!asset) {
      const mediaType = (blob.type || 'audio/wav').split(';')[0];
      asset = {
        id: 'audio-' + sha256.slice(0, 32),
        kind: 'audio',
        network: ref?.network || network,
        contractId: ref?.contractId || contractId,
        tokenId: ref?.tokenId || '',
        sha256,
        bytes: blob.size,
        mediaType
      };
      total += blob.size;
      if (total > 512 * 1024 * 1024) throw Error('Dependencies exceed the 512 MiB package limit.');
      assets.push(asset);
      byHash.set(sha256, asset);
      if (!ref)
        files.push({ name: asset.id + (mediaType === 'audio/wav' ? '.wav' : '.audio'), blob });
    }
    bindings[path] = asset.id;
    // Prepared audio is a new exact-byte dependency. Preserve a separate extracted
    // audio hash only for an existing wrapper; never reuse it after PCM conversion.
    at(copy, path, {
      type: 'file',
      value: 'prepared:' + sha256,
      label: source.label || asset.id,
      ...(ref && source.audioSha256 ? { audioSha256: source.audioSha256 } : {})
    });
    onProgress({ completed: i + 1, total: sources.length });
  }
  return {
    format: 'audionaut-chain-draft/1',
    project: copy,
    bindings,
    manifest: {
      format: 'audionaut-chain-manifest/1',
      network,
      runtime: {
        version: runtime.version,
        network,
        contractId,
        tokenId: '',
        sha256: runtime.sha256,
        bytes: runtime.bytes,
        mediaType: 'text/html'
      },
      assets
    },
    files
  };
}
export function serializeChainDraft(draft) {
  const { files, ...document } = draft;
  return JSON.stringify(document, null, 2);
}
export async function prepareChainPublication(draft, { signal, onProgress } = {}) {
  const runtime = await currentRuntime({ signal }),
    manifest = validateChainManifest(draft.manifest);
  if (
    manifest.runtime.version !== runtime.version ||
    manifest.runtime.sha256 !== runtime.sha256 ||
    manifest.runtime.bytes !== runtime.bytes
  )
    throw Error('Use the exact playback runtime prepared by this AudioNaut release.');
  const document = buildChainSong(draft.project, { manifest, bindings: draft.bindings });
  await prepareChainSongImport(document, { signal, onProgress });
  return new File(
    [JSON.stringify(document)],
    `${String(document.project.projectName || 'AudioNaut song')
      .replace(/[^\w -]/g, '')
      .slice(0, 80)}.chain.json`,
    { type: 'application/json' }
  );
}
