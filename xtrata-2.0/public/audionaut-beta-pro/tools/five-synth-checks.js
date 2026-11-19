// The same checks can run inside the local browser harness or an offline Web
// Audio implementation. Results identify the renderer separately.
import { SYNTH_BANK, synthDefaults, parseLine, synthTailSeconds } from '../daw/js/synths.js';
import { createVoice } from '../daw/js/synths/voice-lifecycle.js';
import { encodeWav } from '../daw/js/audio-utils.js';

export const instruments = ['portwheel', 'hushwire', 'clatterstep', 'switchyard', 'neverend'];
const references = ['jims10', 'ensemble', 'modal', 'tine', 'stacker'];
function assert(ok, message) {
  if (!ok) throw new Error(message);
}
function energy(data, start = 0, end = data.length) {
  let sum = 0,
    peak = 0;
  for (let i = start; i < end; i++) {
    sum += data[i] * data[i];
    peak = Math.max(peak, Math.abs(data[i]));
  }
  return { rms: Math.sqrt(sum / Math.max(1, end - start)), peak };
}
function difference(a, b, from = 0, to = a.length) {
  let sum = 0;
  for (let i = from; i < to; i++) sum += (a[i] - b[i]) ** 2;
  return Math.sqrt(sum / (to - from));
}
const baseNote = { pitch: 60, vel: 0.8, time: 0.02, dur: 0.45 };
function start(ctx, id, patch, note, seed = 9385) {
  return createVoice(ctx, ctx.destination, SYNTH_BANK[id], id, note, patch, null, { seed });
}
async function render(id, patch, options = {}) {
  const { rate = 44100, seconds = 3, notes = [baseNote], edit, seed } = options;
  const ctx = new OfflineAudioContext(1, Math.ceil(rate * seconds), rate);
  const voices = notes.map((note, i) =>
    start(ctx, id, patch, { ...baseNote, ...note }, (seed ?? 9385) + i)
  );
  const sources = voices[0].sources.length,
    nodes = voices[0].nodes.size;
  if (edit) await edit(voices, ctx);
  const buffer = await ctx.startRendering();
  return { data: buffer.getChannelData(0), buffer, voices, sources, nodes };
}
export async function verifyFiveSynths(report = () => {}) {
  const rows = [];
  for (const [index, id] of instruments.entries()) {
    const def = SYNTH_BANK[id],
      patch = synthDefaults(id),
      message = (text) => id + ' ' + text;
    const baseline = await render(id, patch);
    const row = {
      id,
      sources: baseline.sources,
      nodes: baseline.nodes,
      default: energy(baseline.data),
      presets: {},
      controls: {},
      rates: {}
    };
    row.reference = {
      id: references[index],
      ...energy((await render(references[index], synthDefaults(references[index]))).data)
    };
    assert(def.presets.length >= 8 && def.lines.length === 4, message('factory material'));
    for (const preset of def.presets) {
      for (const [key, value] of Object.entries(preset.params)) {
        const p = def.params.find((p) => p.key === key);
        assert(
          p &&
            (p.options
              ? p.options.includes(value)
              : Number.isFinite(value) && value >= p.min && value <= p.max),
          message(preset.name + ' ' + key)
        );
      }
      const { data } = await render(id, { ...patch, ...preset.params });
      const level = energy(data);
      row.presets[preset.name] = level;
      assert(
        level.rms > 0.0001 && level.peak < 1,
        message(preset.name + ' dry level ' + JSON.stringify(level))
      );
    }
    for (const line of def.lines)
      for (const n of parseLine(line.dsl)) {
        assert(
          n.step >= 0 &&
            n.dur > 0 &&
            n.step + n.dur <= 64 &&
            n.pitch >= 0 &&
            n.pitch <= 127 &&
            n.vel > 0 &&
            n.vel <= 1,
          message(line.name)
        );
      }
    for (const p of def.params) {
      const value = p.options ? p.options.find((v) => v !== p.def) : p.def == p.max ? p.min : p.max;
      // An early note-off exposes damping while the rebound train is loud.
      const options = p.key === 'release' ? { notes: [{ dur: 0.055 }] } : {};
      const reference = p.key === 'release' ? await render(id, patch, options) : baseline;
      const { data } = await render(id, { ...patch, [p.key]: value }, options);
      const delta = difference(reference.data, data);
      row.controls[p.key] = delta;
      assert(delta > 1e-5, message('inaudible control ' + p.key + ' ' + delta));
    }
    for (const rate of [44100, 48000, 96000]) {
      const notes = [
        { pitch: 0, vel: 0.24 },
        { pitch: 36, time: 0.14 },
        { pitch: 60, time: 0.14 },
        { pitch: 67, time: 0.14 },
        { pitch: 60, time: 0.2 },
        { pitch: 127, vel: 1.3, time: 0.55 }
      ];
      const { data } = await render(id, patch, { rate, notes });
      row.rates[rate] = energy(data);
      assert(
        Number.isFinite(row.rates[rate].peak) &&
          energy(data, (rate * 0.6) | 0, (rate * 0.7) | 0).rms > 0.00001,
        message('registers ' + rate)
      );
    }
    const second = await render(id, patch);
    row.repeatRms = difference(baseline.data, second.data);
    assert(row.repeatRms < 1e-6, message('repeatability ' + row.repeatRms));
    const malformed = Object.fromEntries(
      def.params.map((p) => [p.key, p.options ? 'invalid' : NaN])
    );
    assert(
      difference(baseline.data, (await render(id, malformed)).data) < 1e-6,
      message('invalid patch fallback')
    );
    const fast = await render(
      id,
      { ...patch, attack: 0.9, release: 0.07 },
      { notes: [{ dur: 0.008 }], seconds: 0.2 }
    );
    assert(
      energy(fast.data).rms > 1e-6 && energy(fast.data, 4410).peak < 1e-6,
      message('short gate')
    );
    const held = await render(id, patch, {
      notes: [{ held: true, dur: Infinity }],
      seconds: 32.5,
      edit: ([v]) => v.release(31.5, 0.12)
    });
    row.holdRms = energy(held.data, 30 * 44100, 31 * 44100).rms;
    assert(
      def.live?.naturalDecay ? row.holdRms < 1e-6 : row.holdRms > 0.0001,
      message('hold/decay')
    );
    assert(energy(held.data, 32 * 44100).peak < 1e-6, message('release'));
    assert(
      energy(
        baseline.data,
        Math.min(
          baseline.data.length,
          ((baseNote.time + baseNote.dur + synthTailSeconds(id, patch)) * 44100) | 0
        )
      ).peak < 1e-6,
      message('tail bounds')
    );
    const cancelled = await render(id, patch, {
      notes: [{ time: 0.5 }],
      seconds: 1,
      edit: ([v]) => v.stop(0.1)
    });
    assert(energy(cancelled.data).peak < 1e-6, message('cancel before start'));
    const adjusted = await render(id, patch, {
      edit: async ([v]) => {
        await v.setParameters({ level: 0 }, 0.3, {
          curve: 'linear',
          startTime: 0.12,
          fromValues: { level: patch.level }
        });
      }
    });
    assert(
      difference(baseline.data, adjusted.data, 0, 4410) < 1e-6 &&
        energy(adjusted.data, (0.33 * 44100) | 0, (0.44 * 44100) | 0).peak < 1e-6,
      message('scheduled gain ramp')
    );
    const bent = await render(id, patch, { edit: ([v]) => v.setBend(5, 0.09) });
    assert(
      difference(baseline.data, bent.data, (0.1 * 44100) | 0, (0.45 * 44100) | 0) > 0.0001,
      message('pitch bend')
    );
    const soft = await render(id, patch, { notes: [{ vel: 0.2 }] });
    assert(energy(soft.data).rms < row.default.rms * 0.65, message('velocity response'));
    const early = await render(
      id,
      { ...patch, attack: 0.8 },
      { notes: [{ held: true, dur: Infinity }], seconds: 1, edit: ([v]) => v.release(0.055, 0.05) }
    );
    assert(
      energy(early.data).rms > 0 && energy(early.data, 7200).peak < 1e-6,
      message('note-off during attack')
    );
    const dense = await render(id, patch, {
      notes: Array.from({ length: 16 }, (_, i) => ({
        pitch: 40 + (i % 8),
        time: 0.02 + i * 0.009,
        vel: 0.32,
        dur: 0.35
      }))
    });
    assert(
      energy(dense.data).rms > 0.001 && Number.isFinite(energy(dense.data).peak),
      message('dense overlap')
    );
    assert(
      dense.voices.every((v) => v.ended),
      message('dense voice disposal')
    );
    // Exercise the unbound envelope path at the current audio clock, as well
    // as direct performance edits. Keeping a single note handle matters to the
    // recorder, note-off and per-track voice limits.
    let completedEdit;
    const edited = await render(id, patch, {
      notes: [{ held: true, dur: Infinity }],
      seconds: 1,
      edit: ([v], ctx) => {
        completedEdit = ctx.suspend(0.18).then(async () => {
          try {
            await Promise.all([
              v.setParameters({ attack: 0.12 }),
              v.setParameters({ attack: 0.07 })
            ]);
            await v.setParameters({ level: 0.4 });
          } finally {
            await ctx.resume();
          }
          await ctx.suspend(0.5);
          v.release(ctx.currentTime, 0.12);
          await ctx.resume();
        });
      }
    });
    await completedEdit;
    assert(
      energy(edited.data).rms > 0.001 &&
        energy(edited.data, 33075).peak < 1e-6 &&
        edited.voices[0].ended,
      message('edit, release and dispose')
    );
    rows.push(row);
    report(row);
  }
  return rows;
}

export async function dryDemo(id) {
  const step = 60 / 108 / 4;
  const notes = parseLine(SYNTH_BANK[id].lines[0].dsl).map((n) => ({
    ...n,
    time: 0.04 + n.step * step,
    dur: n.dur * step
  }));
  const patch = synthDefaults(id);
  const seconds = Math.max(...notes.map((n) => n.time + n.dur)) + patch.release + 0.08;
  const { buffer } = await render(id, patch, { notes, seconds, rate: 48000 });
  return encodeWav(buffer, { bitDepth: 24, dither: false });
}
