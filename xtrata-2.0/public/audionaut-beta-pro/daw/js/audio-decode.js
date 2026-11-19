// One decoder for direct loading, the sample catalogue and historical imports.
// Our PCM path is exact and runs off-thread. Other layouts use the same browser
// codec support as Samples & Loops; malformed/oversized PCM never bypasses checks.
import { decodePcmWav } from './pcm-wav.js';
const MAX_DECODED_BYTES = 256 * 1024 * 1024;
function check(signal) {
  if (signal?.aborted)
    throw signal.reason || new DOMException('Audio loading cancelled.', 'AbortError');
}
async function nativeDecode(context, bytes, signal) {
  // Browser decoders cannot be interrupted, but a cancelled request must release
  // its queue slot and never publish a late result.
  if (!signal) return context.decodeAudioData(bytes);
  return new Promise((resolve, reject) => {
    const cancel = () =>
      reject(signal.reason || new DOMException('Audio loading cancelled.', 'AbortError'));
    signal.addEventListener('abort', cancel, { once: true });
    Promise.resolve()
      .then(() => {
        check(signal);
        return context.decodeAudioData(bytes);
      })
      .then(resolve, reject)
      .finally(() => signal.removeEventListener('abort', cancel));
  });
}
export async function decodeAudioBytes(context, bytes, { signal } = {}) {
  check(signal);
  if (!(bytes instanceof ArrayBuffer) || !bytes.byteLength)
    throw Error('The source contains no audio bytes.');
  if (bytes.byteLength > MAX_DECODED_BYTES) throw Error('Audio exceeds the 256 MB import limit.');
  let audio;
  try {
    audio = await decodePcmWav(context, bytes.slice(0), { signal });
  } catch (error) {
    if (error.code !== 'UNSUPPORTED_PCM_LAYOUT') throw error;
  }
  check(signal);
  if (!audio) audio = await nativeDecode(context, bytes.slice(0), signal);
  check(signal);
  if (
    !audio ||
    !Number.isSafeInteger(audio.length) ||
    audio.length <= 0 ||
    !Number.isInteger(audio.numberOfChannels) ||
    audio.numberOfChannels < 1 ||
    audio.numberOfChannels > 32
  )
    throw Error('The source did not decode to valid audio.');
  if (audio.length * audio.numberOfChannels * 4 > MAX_DECODED_BYTES)
    throw Error('Decoded audio exceeds 256 MB. Import a shorter recording.');
  return audio;
}
