// loader.js — fetch + decode samples from Ordinals, Stacks/Xtrata, URLs, and local files.
// Handles raw audio, audional base64 JSON, and HTML pages with embedded audio.

import { store } from './state.js';
import { engine } from './engine.js';
import { renderSynthSample, SYNTH_KIT } from './synthdrums.js';

function base64ToArrayBuffer(base64) {
  const bin = atob(base64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out.buffer;
}

function resolveSource(source) {
  const { ordinalsGateway, xtrataGateway } = store.settings;
  switch (source.type) {
    case 'ordinal': {
      const id = source.value.trim().replace(/^.*\/content\//, '');
      return ordinalsGateway.replace(/\/?$/, '/') + id;
    }
    case 'xtrata': {
      const id = source.value.trim();
      return xtrataGateway.includes('{id}')
        ? xtrataGateway.replace('{id}', id)
        : xtrataGateway.replace(/\/?$/, '/') + id;
    }
    case 'url':
    default:
      return source.value.trim();
  }
}

// Extract { arrayBuffer, sampleName } from a fetch Response of unknown content type.
async function extractAudio(response, fallbackName) {
  const ct = (response.headers.get('content-type') || '').toLowerCase();

  if (ct.includes('application/json')) {
    const json = await response.json();
    const b64 = json.audioData || json.audioData_base64 || '';
    if (!b64) throw new Error('JSON has no audioData field');
    const payload = b64.includes(',') ? b64.split(',')[1] : b64;
    return { arrayBuffer: base64ToArrayBuffer(payload), sampleName: json.filename || json.fileName || fallbackName };
  }

  if (ct.includes('text/html')) {
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    // Sample name: legacy #sampleName element, audional data attribute, OB1 <title>, or fallback.
    const name = doc.getElementById('sampleName')?.textContent.trim()
      || doc.querySelector('audio[data-audionalsamplename]')?.getAttribute('data-audionalsamplename')
      || doc.querySelector('title')?.textContent.trim()
      || fallbackName;

    // 1) Standard <audio>/<source> elements (legacy audionals).
    const src = doc.querySelector('audio source[src], audio[src]');
    const dataSrc = src?.getAttribute('src') || '';
    if (dataSrc.startsWith('data:audio')) {
      return { arrayBuffer: base64ToArrayBuffer(dataSrc.split(',')[1]), sampleName: name };
    }

    // 2) OB1-style pages use varying custom tags/attributes (anchors, custom elements,
    //    data-* attributes). Regex the raw HTML for ANY base64 audio data URI —
    //    tag-agnostic, so every OB1 variant works.
    const m = html.match(/data:audio\/[a-z0-9.+-]+;base64,([A-Za-z0-9+/=]+)/i);
    if (m) {
      return { arrayBuffer: base64ToArrayBuffer(m[1]), sampleName: name };
    }

    // 3) Relative/absolute audio URL referenced from the page.
    if (dataSrc) {
      const r = await fetch(new URL(dataSrc, response.url).href);
      if (!r.ok) throw new Error(`Nested audio fetch failed (${r.status})`);
      return { arrayBuffer: await r.arrayBuffer(), sampleName: name };
    }
    throw new Error('HTML page contains no embedded audio');
  }

  // Assume raw audio bytes (audio/*, application/octet-stream, opus, etc.)
  return { arrayBuffer: await response.arrayBuffer(), sampleName: fallbackName };
}

// Load a sample into a channel from a source descriptor. Returns sample name.
export async function loadSample(ch, source) {
  engine.ensureContext();
  let arrayBuffer, sampleName;

  if (source.type === 'synth') {
    const buffer = await renderSynthSample(source.value);
    engine.setBuffer(ch, buffer);
    const label = SYNTH_KIT[source.value].label;
    store.setChannelProp(ch, 'source', { type: 'synth', value: source.value });
    store.setChannelProp(ch, 'sampleName', label);
    if (store.channel(ch).name.startsWith('Channel ')) {
      store.setChannelProp(ch, 'name', label.slice(0, 24));
    }
    return label;
  }

  if (source.type === 'file') {
    const file = source.file;
    arrayBuffer = await file.arrayBuffer();
    sampleName = file.name;
    source = { type: 'file', value: file.name };
  } else {
    const url = resolveSource(source);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Fetch failed (${response.status})`);
    const fallback = decodeURIComponent(url.split('/').pop() || 'sample');
    ({ arrayBuffer, sampleName } = await extractAudio(response, fallback));
  }

  const audioBuffer = await engine.ctx.decodeAudioData(arrayBuffer.slice(0));
  engine.setBuffer(ch, audioBuffer);
  store.setChannelProp(ch, 'source', { type: source.type, value: source.value });
  store.setChannelProp(ch, 'sampleName', sampleName);
  if (store.channel(ch).name.startsWith('Channel ')) {
    store.setChannelProp(ch, 'name', sampleName.replace(/\.[a-z0-9]+$/i, '').slice(0, 24));
  }
  return sampleName;
}

// Fetch + decode a source WITHOUT assigning it to a channel (library audition / testing).
const previewCache = new Map();
export async function fetchAndDecode(source) {
  engine.ensureContext();
  const key = `${source.type}:${source.value}`;
  if (previewCache.has(key)) return previewCache.get(key);
  if (source.type === 'synth') {
    const audioBuffer = await renderSynthSample(source.value);
    const result = { audioBuffer, sampleName: SYNTH_KIT[source.value].label };
    previewCache.set(key, result);
    return result;
  }
  const url = resolveSource(source);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Fetch failed (${response.status})`);
  const fallback = decodeURIComponent(url.split('/').pop() || 'sample');
  const { arrayBuffer, sampleName } = await extractAudio(response, fallback);
  const audioBuffer = await engine.ctx.decodeAudioData(arrayBuffer.slice(0));
  const result = { audioBuffer, sampleName };
  previewCache.set(key, result);
  return result;
}

// Re-load all channels that have a remote source (used after project load).
export async function reloadAllSamples(onProgress) {
  const chans = store.project.channels;
  for (let i = 0; i < chans.length; i++) {
    const src = chans[i].source;
    if (!src || src.type === 'file') continue;
    try {
      onProgress?.(i, chans[i].sampleName || src.value);
      await loadSample(i, src);
    } catch (e) {
      console.warn(`Channel ${i + 1}: ${e.message}`);
    }
  }
}
