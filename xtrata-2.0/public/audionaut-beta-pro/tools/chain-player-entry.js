// Bundled into one inscribable HTML file, including workers, SDK and licence notices.
import {
  createXtrataReadClient,
  createXtrataReconstructionSources
} from '../../../packages/xtrata-sdk/src/simple.ts';
import { reconstructXtrataInscription } from '../../../packages/xtrata-reconstruction/src/index.ts';
import { createChainLibrary, prepareChainSongImport } from '../daw/js/chain-library.js';
import { validateChainReference } from '../daw/js/chain-manifest.js';
import { RUNTIME_VERSION } from '../daw/js/runtime-version.js';
import { importProject } from '../daw/js/persistence.js';
import { reloadAllSamples, setChainSourceLibrary } from '../daw/js/loader.js';
import { engine } from '../daw/js/engine.js';
import { store } from '../daw/js/state.js';

const status = document.querySelector('#status'),
  play = document.querySelector('#play');
let loaded = false,
  loading = false;
const clients = new Map();
async function fromChain(ref, { signal } = {}) {
  validateChainReference(ref);
  signal?.throwIfAborted();
  const api = document.querySelector('#rpc').value.trim();
  if (!/^https:\/\//.test(api)) throw Error('Use an HTTPS Stacks API endpoint.');
  const key = api + '|' + ref.contractId;
  let client = clients.get(key);
  if (!client) {
    client = createXtrataReadClient({ contractId: ref.contractId, apiBaseUrls: [api] });
    clients.set(key, client);
  }
  const meta = await client.getInscriptionMeta(BigInt(ref.tokenId));
  signal?.throwIfAborted();
  if (
    !meta ||
    !meta.sealed ||
    BigInt(meta.totalSize) !== BigInt(ref.bytes) ||
    meta.totalChunks !== BigInt(Math.ceil(ref.bytes / 16384))
  )
    throw Error('Inscription is missing, unsealed, or has inconsistent size/chunk metadata.');
  const sources = createXtrataReconstructionSources(client, []);
  // The explicit manifest is the complete dependency list. Each item is verified separately.
  sources[0].readers.getInscriptionMeta = async () => meta;
  sources[0].readers.getDependencies = async () => [];
  for (const [method, read] of Object.entries(sources[0].readers))
    if (typeof read === 'function')
      sources[0].readers[method] = async (...args) => {
        signal?.throwIfAborted();
        const value = await read(...args);
        signal?.throwIfAborted();
        return value;
      };
  const result = await reconstructXtrataInscription({
    tokenId: BigInt(ref.tokenId),
    sources,
    strict: true,
    maxNodes: 1,
    concurrency: 2,
    isTerminalReadError: () => !!signal?.aborted
  });
  signal?.throwIfAborted();
  return result.bytes;
}
const library = createChainLibrary({ fetchBytes: fromChain, timeoutMs: 120000 });
setChainSourceLibrary(library);
async function openSong(document) {
  if (loading) throw Error('Wait for the current song to finish loading.');
  if (document?.manifest?.runtime?.version !== RUNTIME_VERSION)
    throw Error('This song needs a different inscribed AudioNaut runtime version.');
  loading = true;
  play.disabled = true;
  engine.stop();
  try {
    status.textContent = 'Verifying the runtime and every sound from chain…';
    const staged = await prepareChainSongImport(document, { library });
    const pinned = new DOMParser().parseFromString(
      new TextDecoder().decode(staged.verified.get('$runtime')),
      'text/html'
    );
    const scripts = pinned.querySelectorAll('script');
    if (
      scripts.length !== 1 ||
      scripts[0].id !== 'audionaut-runtime' ||
      scripts[0].textContent !==
        globalThis.document.querySelector('#audionaut-runtime')?.textContent
    )
      throw Error(
        'The pinned playback code differs from this player. Open the song’s exact inscribed runtime.'
      );
    importProject({ ...staged.project, format: 'audionaut-workstation/3' });
    const failures = await reloadAllSamples();
    if (failures.length) throw Error('Could not decode every sound. Playback has not started.');
    loaded = true;
    play.disabled = false;
    status.textContent = `${store.project.projectName} · Ready. Audio comes from the verified instructions and chain dependencies.`;
  } finally {
    loading = false;
  }
}
document.querySelector('#song').onchange = async (event) => {
  try {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 16 * 1024 * 1024) throw Error('Instruction file exceeds 16 MiB.');
    await openSong(JSON.parse(await file.text()));
  } catch (error) {
    status.textContent = error.message;
  }
};
play.onclick = async () => {
  try {
    if (!loaded) return;
    await engine.play();
    status.textContent = 'Playing';
  } catch (error) {
    status.textContent = error.message;
  }
};
document.querySelector('#stop').onclick = () => {
  engine.stop();
  status.textContent = 'Stopped';
};
document.querySelector('#load-chain').onclick = async () => {
  try {
    const ref = JSON.parse(document.querySelector('#song-ref').value);
    status.textContent = 'Reading the song instructions from chain…';
    const bytes = await library.read(ref);
    await openSong(JSON.parse(new TextDecoder().decode(bytes)));
  } catch (error) {
    status.textContent = error.message;
  }
};
// Exposed for reproducible offline transport tests; never signs or broadcasts.
globalThis.AudioNautChainPlayer = { version: RUNTIME_VERSION, openSong, library, engine, store };
