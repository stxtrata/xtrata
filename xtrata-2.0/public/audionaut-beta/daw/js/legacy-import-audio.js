// Import audio is held separately until the entire candidate is ready. Network
// failures, cancellation, or an intervening edit never replace the active song.
import { fetchAndDecode, assignDecodedSample } from './loader.js';
import { sourceIdentity } from './assets.js';
import { engine } from './engine.js';
import { store } from './state.js';
import { commitPreparedProject } from './persistence.js';

const pending = new WeakMap();
const MAX_DECODED_BYTES = 256 * 1024 * 1024;
function check({ signal, guard }) {
  if (signal?.aborted)
    throw signal.reason || new DOMException('Song import cancelled.', 'AbortError');
  if (!guard())
    throw new Error(
      'The project changed while the song was opening. Your current work was retained.'
    );
}
export async function prepareImportedAudio(
  project,
  {
    signal,
    guard = () => true,
    onProgress = () => {},
    load = fetchAndDecode,
    previous = null,
    maxDecodedBytes = MAX_DECODED_BYTES
  } = {}
) {
  const options = { signal, guard };
  check(options);
  const jobs = new Map(),
    results = new Map(),
    failures = [];
  let decodedBytes = 0,
    completed = 0;
  for (const [ch, channel] of project.channels.entries()) {
    if (channel.source) {
      const key = sourceIdentity(channel.source);
      if (!jobs.has(key)) jobs.set(key, { key, source: channel.source, channels: [] });
      jobs.get(key).channels.push(ch);
    } else if (project.sequences.some((sequence) => sequence.steps[ch]?.some(Boolean))) {
      failures.push({
        channel: ch + 1,
        source: null,
        message:
          'This active channel has no saved sample reference. Relink its original sound after opening.'
      });
    }
  }
  const queue = [...jobs.values()];
  let cursor = 0;
  const successful = new Map();
  await Promise.all(
    Array.from({ length: Math.min(3, queue.length) }, async () => {
      while (cursor < queue.length) {
        check(options);
        const job = queue[cursor++];
        try {
          const result = previous?.successful?.get(job.key) || (await load(job.source, { signal }));
          check(options);
          const buffer = result?.audioBuffer;
          if (
            !buffer ||
            !Number.isSafeInteger(buffer.length) ||
            buffer.length <= 0 ||
            !Number.isInteger(buffer.numberOfChannels) ||
            buffer.numberOfChannels < 1 ||
            buffer.numberOfChannels > 32
          )
            throw new Error('The source did not decode to valid audio.');
          const bytes = buffer.length * buffer.numberOfChannels * 4;
          if (decodedBytes + bytes > maxDecodedBytes)
            throw new Error('This song exceeds the 256 MB decoded audio limit.');
          decodedBytes += bytes;
          successful.set(job.key, result);
          for (const ch of job.channels) results.set(ch, result);
        } catch (error) {
          check(options);
          for (const ch of job.channels)
            failures.push({
              channel: ch + 1,
              source: structuredClone(job.source),
              message: String(error.message || error).slice(0, 500)
            });
        }
        completed++;
        onProgress({ completed, total: queue.length, failures: failures.length });
      }
    })
  );
  check(options);
  return {
    project,
    results,
    successful,
    failures: failures.sort((a, b) => a.channel - b.channel),
    decodedBytes
  };
}

export function commitImportedAudio(staged, { guard = () => true, allowMissing = false } = {}) {
  if (staged.failures.length && !allowMissing)
    throw new Error('Some samples are unavailable. Retry or explicitly open with missing samples.');
  check({ guard });
  pending.set(staged.project, staged);
  // All synchronous load listeners (including the engine's graph reset) must
  // finish before the prepared buffers are installed.
  try {
    const project = commitPreparedProject(staged.project, { guard });
    installPreparedImportAudio(project);
    return project;
  } finally {
    pending.delete(staged.project);
  }
}

export function preparedImportFailures(project = store.project) {
  return pending.get(project)?.failures.map((item) => item.channel) ?? null;
}

// Called after every load listener, in the same synchronous commit turn.
// The buffers stay strongly held while a large song is staged; the normal audio
// cache may evict earlier sources long before the last source has downloaded.
export function installPreparedImportAudio(project = store.project) {
  const staged = pending.get(project);
  if (!staged) return null;
  for (const [ch, channel] of project.channels.entries()) {
    const result = staged.results.get(ch);
    if (result)
      assignDecodedSample(ch, channel.source, result, {
        reset: false,
        dirty: false,
        preserveLabels: true
      });
    else {
      engine.setBuffer(ch, null);
      const failure = staged.failures.find((item) => item.channel === ch + 1);
      if (failure)
        channel.unresolvedSource = {
          message: failure.message,
          source: structuredClone(channel.source)
        };
    }
  }
  return staged.failures.map((item) => item.channel);
}
