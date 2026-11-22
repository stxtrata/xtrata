// A separate live transport shares the audio device, never the editor's song or buffer slots.
import { Engine, engine } from './engine.js';
import { makeProject, makeChannel, store } from './state.js';
import { configureBeatChannel, prepareBeatPreset } from './l1-beat-loader.js';

let songMonitor;
function monitorSong(ctx, audible) {
  if (songMonitor?.context !== ctx) {
    songMonitor = ctx.createGain();
    engine.masterGain.disconnect(ctx.destination);
    engine.masterGain.connect(songMonitor).connect(ctx.destination);
  }
  songMonitor.gain.setTargetAtTime(audible ? 1 : 0, ctx.currentTime, 0.004);
}

export async function auditionBeat(preset, signal, onProgress) {
  const ctx = engine.ensureContext(); // Unlock audio synchronously on the user's tap.
  const rows = await prepareBeatPreset(preset, { signal, onProgress });
  signal.throwIfAborted();
  const project = makeProject();
  project.bpm = store.project.bpm;
  project.swing = store.project.swing;
  project.masterVolume = store.project.masterVolume;
  project.channels = rows.map((row, i) => {
    const channel = project.channels[i] || makeChannel(i);
    channel.source = row.result.source || row.def.source;
    channel.soundMetadata = row.result.soundMetadata || null;
    channel.gateSteps = channel.soundMetadata?.loop ? 8 : 0;
    channel.sampleMidi = row.result.rootMidi ?? channel.soundMetadata?.rootMidi ?? null;
    configureBeatChannel(channel, row);
    return channel;
  });
  project.instruments = [];
  project.sequences[0].steps = rows.map((row) => row.steps);
  project.sequences[0].notes = [];
  // Immutable during preview. Only the editor's store has history and autosave listeners.
  const view = {
    project,
    numChannels: rows.length,
    channel: (i) => project.channels[i],
    instrument: (i) => project.instruments[i],
    on: () => () => {}
  };
  const player = new Engine({ store: view, contextFactory: () => ctx });
  player.editorTransport = {
    events: new EventTarget(),
    loop: () => ({ enabled: true, start: 0, end: Math.min(4, Math.max(1, preset.bars || 4)) * 4 })
  };
  let monitoring = false;
  const release = () => {
    if (monitoring) monitorSong(ctx, true);
    monitoring = false;
    player.dispose();
  };
  try {
    rows.forEach((row, i) => player.setBuffer(i, row.result.audioBuffer));
    await player.play({ fromBeat: 0 });
    signal.throwIfAborted();
    monitorSong(ctx, false);
    monitoring = true;
    signal.addEventListener('abort', release, { once: true });
  } catch (error) {
    release();
    throw error;
  }
}
