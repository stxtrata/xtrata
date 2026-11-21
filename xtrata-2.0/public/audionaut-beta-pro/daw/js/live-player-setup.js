import { store } from './state.js';
import { engine } from './engine.js';
import { isProInstrument, normalizeInstrumentConfig } from './pro-instruments-config.js';
import { loadSample, reloadAllSamples } from './loader.js';
import { drumStarterSample } from './synths/drums/drumrack.js';
import { granularStarterSample } from './synths/fx/granulator.js';
import { pianoStarterSample } from './synths/keys/concertpiano.js';

const projectLoads = new WeakMap(), channelLoads = new WeakMap();
export function restoreEditorSamples() {
  const project = store.project;
  const loading = reloadAllSamples().finally(() => {
    if (projectLoads.get(project) === loading) projectLoads.delete(project);
  });
  projectLoads.set(project, loading);
  return loading;
}
async function prepareChannel(index, current) {
  const project = store.project, channel = project.channels[index];
  const batch = projectLoads.get(project);
  if (batch) {
    let off;
    try {
      await Promise.race([batch, new Promise(resolve => {
        off = store.on('channel', ({ch}) => { if (ch === index && engine.buffers[ch]) resolve(); });
      })]);
    } finally { off?.(); }
  }
  if (!current() || engine.buffers[index]) return;
  const source = channel.source;
  if (!source) throw Error('Load a sample for ' + channel.name + '.');
  const pending = channelLoads.get(channel);
  if (pending?.source === source) return pending.work;
  const work = (async () => {
    if (channel.clipSnapshot && !source.chainRef && !source.localAssetId && !source.collectedFrom) {
      const {restoreClipChannel} = await import('./clip-actions.js');
      if (current() && store.channel(index) === channel && channel.source === source) await restoreClipChannel(index);
    } else await loadSample(index, source, {preserve:true});
  })().finally(() => { if (channelLoads.get(channel)?.work === work) channelLoads.delete(channel); });
  channelLoads.set(channel, {source,work});
  await work;
}

const prefix = 'audionaut.beta-pro.live-player.';
export function livePreference(key, fallback) {
  try { return JSON.parse(localStorage.getItem(prefix + key)) ?? fallback; }
  catch { return fallback; }
}
export function saveLivePreference(key, value) {
  try { localStorage.setItem(prefix + key, JSON.stringify(value)); } catch {}
}

export async function prepareLiveInstrument(track, pitches, current) {
  let ids = [];
  const starters = [];
  if (isProInstrument(track.synthId)) {
    const config = normalizeInstrumentConfig(track.synthId, track.sampleInstrument);
    const assigned = new Set([config.sourceId, ...(config.pads || []).map(p => p.sourceId),
      ...(config.zones || []).map(z => z.sourceId)].filter(Boolean));
    ids = config.sources.filter(source => assigned.has(source.id)).map(source => source.sourceTrackId);
    if (config.kind === 'drumrack') config.pads.forEach((pad,i) => {
      if (!pad.sourceId) starters.push(() => drumStarterSample(engine.ctx, i));
    });
    if (config.kind === 'granulator' && !config.sourceId) starters.push(() => granularStarterSample(engine.ctx));
    if (config.kind === 'concertpiano' && !config.zones.length) {
      const roots = new Set(pitches.map(p => Math.max(21, Math.min(108, Math.round(p / 3) * 3))));
      for (const root of roots) for (const layer of [1,2]) starters.push(() => pianoStarterSample(engine.ctx, root, layer));
    }
  } else if (track.sampler?.enabled) {
    ids = (track.sampler.zones || []).map(zone => zone.sourceTrackId);
    if (!ids.length) throw Error('Assign a sample zone to this instrument.');
  }
  const project = store.project;
  for (const id of new Set(ids)) {
    if (!current() || store.project !== project) return;
    const index = project.channels.findIndex(t => t.id === id);
    if (index < 0) throw Error('Relink the missing instrument sample.');
    if (!engine.buffers[index]) {
      await prepareChannel(index, current);
    }
  }
  for (const warm of starters) {
    await new Promise(resolve => setTimeout(resolve, 0));
    if (!current()) return;
    warm();
  }
  if (current()) await engine.effectsReady();
}
