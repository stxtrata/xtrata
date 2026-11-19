import {setMidiTarget, getMidiTarget} from './midi-input.js';
import { browseDrumPad } from './drum-library-ui.js';
import { store } from './state.js';
import { engine } from './engine.js';
import { SYNTH_BANK, synthDefaults } from './synths.js';
import {
  isProInstrument,
  defaultInstrumentConfig,
  normalizeInstrumentConfig,
  PRO_INSTRUMENT_IDS
} from './pro-instruments-config.js';
import { registerBlob } from './assets.js';
import { loadSample } from './loader.js';
import { el, action, row, number, choice, textField, status } from './pro-ui.js';
import { openEffects } from './pro-mixer-ui.js';

export function mount(root) {
  let instrumentId = (isProInstrument(store.instrument(getMidiTarget())?.synthId) ? store.instrument(getMidiTarget()) : store.project.instruments.find((t) => isProInstrument(t.synthId)))?.id,
    disposed = false;
  const body = el('div'),
    input = el('input', null, { type: 'file', accept: 'audio/*', multiple: true, hidden: true });
  root.append(
    el('h2', 'New instruments'),
    el(
      'p',
      'Drum Rack, Sample Granulator and Concert Piano use original, generated starter sounds. Replace them with your own recordings or verified chain samples. The piano starter is modeled; a recorded piano library can be mapped below.',
      { className: 'pro-help' }
    ),
    body,
    input
  );
  input.onchange = async () => {
    try {
      const project = store.project,
        files = [...input.files];
      input.value = '';
      if (project.channels.length + files.length > 64)
        throw Error('There is room for ' + (64 - project.channels.length) + ' more sample tracks.');
      for (const file of files) {
        if (disposed || project !== store.project)
          throw Error('The project changed during import.');
        if (file.size > 128 * 1024 * 1024) throw Error('Choose samples smaller than 128 MiB each.');
        const source = registerBlob(file, { name: file.name });
        store.addChannel();
        await loadSample(store.numChannels - 1, source);
      }
      paint();
      status('Samples imported. Choose them for a pad, grain source or piano zone.');
    } catch (error) {
      status(error.message, true);
    }
  };
  const available = () => [
    ['', 'Generated starter'],
    ...store.project.channels
      .filter((t) => t.source)
      .map((t) => [
        t.id,
        t.name + (engine.buffers[store.project.channels.indexOf(t)] ? '' : ' (audio unavailable)')
      ])
  ];
  function paint() {
    if (disposed) return;
    body.replaceChildren();
    const instruments = store.project.instruments.filter((t) => isProInstrument(t.synthId));
    if (!instruments.some((t) => t.id === instrumentId)) instrumentId = instruments[0]?.id;
    body.append(
      row(
        ...PRO_INSTRUMENT_IDS.map((id) =>
          action('+ ' + SYNTH_BANK[id].name, () => {
            const t = store.addInstrument(id);
            if (!t) throw Error('The 32-instrument limit is reached.');
            instrumentId = t.id;
            store.setTrackProp(t.id, 'name', SYNTH_BANK[id].name);
            paint();
          })
        ),
        action('Import samples', () => input.click())
      )
    );
    if (!instruments.length) {
      body.append(el('p', 'Add an instrument to begin.'));
      return;
    }
    body.append(
      choice(
        'Instrument',
        instruments.map((t) => [t.id, t.name + ' · ' + SYNTH_BANK[t.synthId].name]),
        instrumentId,
        (v) => {
          instrumentId = v;
          paint();
        }
      )
    );
    setMidiTarget(store.project.instruments.findIndex(t=>t.id===instrumentId));
    const instrument = store.track(instrumentId),
      definition = SYNTH_BANK[instrument.synthId];
    let config = normalizeInstrumentConfig(instrument.synthId, instrument.sampleInstrument);
    const save = () => {
      const validated = normalizeInstrumentConfig(instrument.synthId, config);
      store.setTrackProp(instrumentId, 'sampleInstrument', validated);
    };
    const sourceTrack = (id) => config.sources.find((s) => s.id === id)?.sourceTrackId || '';
    const sourceId = (trackId) => {
      if (!trackId) return null;
      let entry = config.sources.find((s) => s.sourceTrackId === trackId);
      if (!entry) {
        entry = { id: crypto.randomUUID(), sourceTrackId: trackId };
        config.sources.push(entry);
      }
      return entry.id;
    };
    const audition = async (pitch) => {
      const index = store.project.instruments.findIndex((t) => t.id === instrumentId);
      engine.ensureContext();
      await engine.effectsReady();
      const voice = engine.startNote(index, pitch, 0.8);
      setTimeout(() => engine.releaseNote(voice), 400);
    };
    body.append(
      row(
        textField('Track name', instrument.name, (v) =>
          store.setTrackProp(instrumentId, 'name', v)
        ),
        action(instrument.synthId === 'drumrack' ? 'Play kick' : 'Play C4', () =>
          audition(instrument.synthId === 'drumrack' ? 36 : 60)
        ),
        action('Effects', () => openEffects(instrumentId)),
        action('Restore starter mappings', () => {
          config = defaultInstrumentConfig(instrument.synthId);
          save();
          paint();
        })
      )
    );
    const params = { ...synthDefaults(instrument.synthId), ...instrument.params },
      controls = row();
    for (const p of definition.params) {
      const set = (v) =>
        store.setTrackProp(instrumentId, 'params', {
          ...store.track(instrumentId).params,
          [p.key]: v
        });
      controls.append(
        p.options
          ? choice(p.label, p.options, params[p.key], set)
          : number(p.label, params[p.key], set, { min: p.min, max: p.max, step: p.step })
      );
    }
    body.append(controls);
    if (instrument.synthId === 'drumrack') {
      const triggers = el('div', null, { className: 'pro-pad-triggers', 'aria-label': 'Drum pads' });
      for (const pad of config.pads) triggers.append(action(pad.name, () => audition(pad.note), { 'aria-label': `Play ${pad.name}, MIDI ${pad.note}` }));
      const mappings = el('details');
      mappings.append(el('summary', 'Edit pad samples and controls'));
      const pads = el('div', null, { className: 'pro-pad-grid' });
      mappings.append(pads);
      body.append(triggers, mappings);
      for (const pad of config.pads) {
        const card = el('section', null, { className: 'pro-take' });
        const set = (key, value) => {
          pad[key] = value;
          save();
        };
        card.append(
          action(`${pad.name} · MIDI ${pad.note}`, () => audition(pad.note)),
          action('Browse drum samples', () => browseDrumPad(instrument.id, pad.note, { onLoaded: () => { if (!disposed) paint(); } }), { 'aria-label': `Browse samples for ${pad.name}` }),
          choice('Pad sample', available(), sourceTrack(pad.sourceId), (v) =>
            set('sourceId', sourceId(v))
          ),
          row(
            number('Gain', pad.gain, (v) => set('gain', v), { min: 0, max: 2, step: 0.05 }),
            number('Pan', pad.pan, (v) => set('pan', v), { min: -1, max: 1, step: 0.05 }),
            number('Tune', pad.tune, (v) => set('tune', v), { min: -24, max: 24, step: 1 })
          ),
          textField('Choke group', pad.chokeGroup, (v) => set('chokeGroup', v)),
          choice(
            'Playback',
            [
              ['oneShot', 'One shot'],
              ['gate', 'Follow note length']
            ],
            pad.mode,
            (v) => set('mode', v)
          )
        );
        pads.append(card);
      }
    } else if (instrument.synthId === 'granulator') {
      body.append(
        row(
          choice('Grain source', available(), sourceTrack(config.sourceId), (v) => {
            config.sourceId = sourceId(v);
            save();
          }),
          number(
            'Source root MIDI',
            config.rootMidi,
            (v) => {
              config.rootMidi = v;
              save();
            },
            { min: 0, max: 127, step: 1 }
          )
        )
      );
    } else {
      body.append(
        el('h3', 'Piano sample zones'),
        el(
          'p',
          'MIDI velocity runs from 1 to 127. Map softer and louder recordings to separate ranges. Every played note needs a matching zone in a custom library.'
        )
      );
      let selected = available()[1]?.[0];
      body.append(
        row(
          choice('New zone sample', available().slice(1), selected, (v) => (selected = v)),
          action('Add piano zone', () => {
            if (!selected) throw Error('Import a sample first.');
            config.zones.push({
              id: crypto.randomUUID(),
              sourceId: sourceId(selected),
              rootMidi: 60,
              lowMidi: 0,
              highMidi: 127,
              lowVelocity: 1,
              highVelocity: 127,
              gain: 1
            });
            save();
            paint();
          }, {disabled:!selected})
        )
      );
      for (const zone of config.zones) {
        const card = el('section', null, { className: 'pro-take' });
        const set = (key, value) => {
          const old = zone[key];
          zone[key] = value;
          try {
            save();
          } catch (error) {
            zone[key] = old;
            throw error;
          }
        };
        card.append(
          choice('Zone sample', available().slice(1), sourceTrack(zone.sourceId), (v) =>
            set('sourceId', sourceId(v))
          )
        );
        for (const [key, label, min, max] of [
          ['rootMidi', 'Root note', 0, 127],
          ['lowMidi', 'Lowest note', 0, 127],
          ['highMidi', 'Highest note', 0, 127],
          ['lowVelocity', 'Lowest velocity', 1, 127],
          ['highVelocity', 'Highest velocity', 1, 127]
        ])
          card.append(number(label, zone[key], (v) => set(key, v), { min, max, step: 1 }));
        card.append(
          action('Remove zone', () => {
            config.zones = config.zones.filter((z) => z.id !== zone.id);
            save();
            paint();
          })
        );
        body.append(card);
      }
    }
  }
  const off = store.on('load', paint);
  paint();
  return () => {
    disposed = true;
    off();
  };
}
