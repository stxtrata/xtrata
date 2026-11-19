import { store } from './state.js';
import { normalizeInstrumentConfig } from './pro-instruments-config.js';
import { fetchAndDecode, assignDecodedSample } from './loader.js';
import { beginTransaction, endTransaction } from './history.js';
const pending = new WeakMap();

export async function browseDrumPad(trackId, note, { onLoaded } = {}) {
  const project = store.project, instrument = store.track(trackId);
  if (instrument?.synthId !== 'drumrack') throw Error('This drum rack no longer exists.');
  const pad = normalizeInstrumentConfig('drumrack', instrument.sampleInstrument).pads.find(p => p.note === note);
  if (!pad) throw Error('This drum pad no longer exists.');
  const { openSamplePicker } = await import('./ui.js');
  openSamplePicker({ label: `${instrument.name} · ${pad.name}`, load: async source => {
    const tickets = pending.get(instrument) || new Map(); pending.set(instrument, tickets);
    const ticket = Symbol(); tickets.set(note, ticket);
    const current = () => store.project === project && store.track(trackId) === instrument && instrument.synthId === 'drumrack' && tickets.get(note) === ticket;
    if (!current()) throw Error('The drum rack changed. Choose the sample again.');
    const result = await fetchAndDecode(source);
    if (!current()) throw Error('The drum rack changed while loading.');
    const config = normalizeInstrumentConfig('drumrack', instrument.sampleInstrument);
    const target = config.pads.find(p => p.note === note);
    if (!target) throw Error('The drum pad changed while loading.');
    const used = new Set(config.pads.filter(p => p !== target).map(p => p.sourceId));
    config.sources = config.sources.filter(s => used.has(s.id));
    if (config.sources.length >= 128) throw Error('This instrument has too many sample sources.');
    beginTransaction();
    try {
      if (!store.addChannel()) throw Error('The sample-channel limit is reached. Remove an unused channel or choose an already loaded pad sample.');
      const index = store.numChannels - 1;
      const name = assignDecodedSample(index, source, result);
      const id = crypto.randomUUID();
      config.sources.push({ id, sourceTrackId: store.channel(index).id });
      target.sourceId = id;
      store.setTrackProp(trackId, 'sampleInstrument', config);
      onLoaded?.();
      return name;
    } finally { endTransaction(); }
  }});
}
