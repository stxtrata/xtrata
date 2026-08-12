// Making the noise, and remembering who wanted to hear it.
//
// The sounds themselves are in sounds.ts, as numbers. This is the part that
// owns an AudioContext, a master gain, thirteen switches and a volume each, and
// the two browser behaviours that make audio in a page like this awkward:
//
//   A CONTEXT STARTS SUSPENDED. Browsers refuse to make a sound until the
//   person has interacted with the page. That is exactly wrong for the sound
//   this module was asked for: "it is your turn" arrives from the chain, on its
//   own, with nobody touching anything. So the first tap ANYWHERE unlocks the
//   context and it is kept alive from then on - and until that has happened,
//   the panel says so rather than failing silently.
//
//   THE TAB IS OFTEN NOT IN FRONT. A game with a fifteen minute gap between
//   moves is a game nobody sits and watches, which is the whole reason a turn
//   sound is worth having. See the background option, and `Sound.background`,
//   which the poller reads.
//
// Everything that touches Web Audio is wrapped. A page that cannot make a sound
// must still play chess.

import { EVENTS, SOUND_EVENTS, VOICES, isVoiceId, voiceLength } from './sounds.js';
import type { Layer, SoundEvent, VoiceId } from './sounds.js';

export interface EventSetting {
  on: boolean;
  /** This event's own volume, 0 to 1, on top of the master. */
  gain: number;
  /**
   * Which voice from the library this event plays.
   *
   * The join between the two tables, and the whole reason they are separate.
   * Starts at the event's default and is whatever the player last chose after
   * that. Validated on the way in from storage, because a name from a build
   * that had a voice this one does not would otherwise be silence with no
   * explanation.
   */
  voice: VoiceId;
}

export interface SoundState {
  /** The master switch. Off means silence, whatever else is set. */
  master: boolean;
  /** Master volume, 0 to 1. */
  volume: number;
  /** Keep reading the chain, and keep announcing, while the tab is hidden. */
  background: boolean;
  events: Record<SoundEvent, EventSetting>;
}

/**
 * Sound is ON by default, and the background option is OFF.
 *
 * Opposite defaults on purpose. A sound is a small surprise that a person can
 * turn off in one click, and a board that is silent until you find a panel is a
 * board where nobody discovers the feature at all. Background polling is not
 * that: it spends somebody's rate limit on a tab they are not looking at, so it
 * is asked for rather than assumed.
 */
export function defaultState(): SoundState {
  const events = {} as Record<SoundEvent, EventSetting>;
  for (const name of SOUND_EVENTS) {
    const spec = EVENTS[name];
    events[name] = { on: spec.on, gain: 1, voice: spec.voice };
  }
  return { master: true, volume: 0.7, background: false, events };
}

const clamp = (value: number): number => Math.min(1, Math.max(0, Number(value) || 0));

/** Where a browser keeps this. Versioned, so a later shape cannot be misread. */
export const SOUND_SLOT = 'xchess.sound.v1';

export interface SoundOptions {
  document?: Document;
  slot?: string;
  /** Injected by tests, which have no Web Audio and want to count calls. */
  context?: () => AudioContext | null;
}

type Ctor = new () => AudioContext;

export class Sound {
  private readonly doc: Document;
  private readonly slot: string;
  private readonly make: () => AudioContext | null;

  readonly state: SoundState = defaultState();

  private ctx: AudioContext | null = null;
  private out: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private listeners: (() => void)[] = [];
  private wake: (() => void) | null = null;

  constructor(options: SoundOptions = {}) {
    this.doc = options.document ?? document;
    this.slot = options.slot ?? SOUND_SLOT;
    this.make =
      options.context ??
      ((): AudioContext | null => {
        const view = this.doc.defaultView as
          | (Window & typeof globalThis & { webkitAudioContext?: Ctor })
          | null;
        // webkit's prefixed name is still the only one on older iOS, which is
        // a large share of the people this sound is for.
        const Ctx = view?.AudioContext ?? view?.webkitAudioContext ?? null;
        return Ctx ? new Ctx() : null;
      });
    this.restore();
  }

  // ----------------------------------------------------------------
  // Settings
  // ----------------------------------------------------------------

  get enabled(): boolean {
    return this.state.master;
  }

  /** True when the poller should keep reading a hidden tab. */
  get background(): boolean {
    return this.state.master && this.state.background;
  }

  /**
   * True when a sound would be wanted but the browser has not allowed one yet.
   *
   * The panel shows this. Silence with no explanation is the worst outcome
   * here: it reads as a broken feature rather than as a browser waiting for a
   * tap it never asked for out loud.
   */
  get waitingForATap(): boolean {
    if (!this.state.master) return false;
    return this.ctx === null || this.ctx.state === 'suspended';
  }

  setMaster(on: boolean): void {
    this.state.master = on;
    // Turning it on IS an interaction, and it is the one moment we can be
    // certain a person wants to hear something.
    if (on) this.unlock();
    this.save();
    this.changed();
  }

  setVolume(value: number): void {
    this.state.volume = clamp(value);
    this.save();
    this.changed();
  }

  setBackground(on: boolean): void {
    this.state.background = on;
    this.save();
    this.changed();
  }

  setEvent(name: SoundEvent, patch: Partial<EventSetting>): void {
    const current = this.state.events[name];
    if (!current) return;
    if (patch.on !== undefined) current.on = patch.on;
    if (patch.gain !== undefined) current.gain = clamp(patch.gain);
    // A name that is not in the library is dropped rather than stored. Taking
    // it would leave an event pointing at nothing, which is silence that no
    // control on the panel can explain or undo.
    if (patch.voice !== undefined && isVoiceId(patch.voice)) current.voice = patch.voice;
    this.save();
    this.changed();
  }

  /** Which voice an event is currently set to play. */
  voiceFor(name: SoundEvent): VoiceId {
    return this.state.events[name]?.voice ?? EVENTS[name].voice;
  }

  reset(): void {
    const fresh = defaultState();
    this.state.master = fresh.master;
    this.state.volume = fresh.volume;
    this.state.background = fresh.background;
    for (const name of SOUND_EVENTS) this.state.events[name] = fresh.events[name];
    this.save();
    this.changed();
  }

  /** Told whenever anything changes, so the panel can redraw itself. */
  onChange(run: () => void): void {
    this.listeners.push(run);
  }

  private changed(): void {
    for (const run of this.listeners) {
      try {
        run();
      } catch {
        // A listener that throws must not stop the others, and must never stop
        // a sound from playing.
      }
    }
  }

  // ----------------------------------------------------------------
  // Storage
  // ----------------------------------------------------------------

  private save(): void {
    try {
      this.doc.defaultView?.localStorage?.setItem(this.slot, JSON.stringify(this.state));
    } catch {
      // Private browsing, or a quota. The settings hold for this session and
      // are forgotten on reload, which is what happened before this existed.
    }
  }

  /**
   * Read back what was stored, field by field.
   *
   * Deliberately not `Object.assign`. A stored blob is from whatever version of
   * this application wrote it, and a later build with a new sound in the table
   * must not be broken by an older blob that has never heard of it - nor must
   * an older build choke on a newer one. Unknown keys are dropped and missing
   * ones keep their default.
   */
  private restore(): void {
    try {
      const raw = this.doc.defaultView?.localStorage?.getItem(this.slot);
      if (!raw) return;
      const saved = JSON.parse(raw) as Partial<SoundState>;
      if (typeof saved.master === 'boolean') this.state.master = saved.master;
      if (typeof saved.volume === 'number') this.state.volume = clamp(saved.volume);
      if (typeof saved.background === 'boolean') this.state.background = saved.background;
      for (const name of SOUND_EVENTS) {
        const one = saved.events?.[name];
        if (!one) continue;
        if (typeof one.on === 'boolean') this.state.events[name].on = one.on;
        if (typeof one.gain === 'number') this.state.events[name].gain = clamp(one.gain);
        // Checked against the library rather than trusted. Settings written by
        // a build with a voice this one does not have would otherwise point an
        // event at nothing and make it silently stop working.
        if (isVoiceId(one.voice)) this.state.events[name].voice = one.voice;
      }
    } catch {
      // A corrupt store is not worth failing over. Defaults are a fine board.
    }
  }

  // ----------------------------------------------------------------
  // The context
  // ----------------------------------------------------------------

  /**
   * Take the first gesture on the page as permission.
   *
   * Capture phase and passive, so it cannot interfere with a click on a square,
   * and it stops listening the moment the context is actually running. The
   * alternative - a "click here to enable sound" banner - asks a person to
   * agree to something before they know they want it.
   */
  listen(): void {
    if (this.wake) return;
    const wake = (): void => {
      this.unlock();
      if (this.ctx && this.ctx.state === 'running') this.stopListening();
    };
    this.wake = wake;
    for (const name of ['pointerdown', 'keydown', 'touchend']) {
      this.doc.addEventListener(name, wake, { capture: true, passive: true });
    }
  }

  private stopListening(): void {
    const wake = this.wake;
    if (!wake) return;
    for (const name of ['pointerdown', 'keydown', 'touchend']) {
      this.doc.removeEventListener(name, wake, true);
    }
    this.wake = null;
    this.changed();
  }

  /**
   * Build the context if there is not one, and resume it if it is asleep.
   *
   * Built lazily rather than in the constructor because iOS wants the context
   * CREATED inside a gesture, not merely resumed inside one.
   */
  unlock(): void {
    try {
      if (!this.ctx) {
        this.ctx = this.make();
        if (this.ctx) {
          this.out = this.ctx.createGain();
          this.out.gain.value = 1;
          this.out.connect(this.ctx.destination);
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') void this.ctx.resume();
    } catch {
      // No Web Audio here. Nothing else in the application depends on it.
    }
  }

  /** Only for tests and for shutting a board down cleanly. */
  close(): void {
    this.stopListening();
    try {
      void this.ctx?.close();
    } catch {
      // Already closed, or never opened.
    }
    this.ctx = null;
    this.out = null;
    this.noiseBuffer = null;
  }

  private noise(ctx: AudioContext): AudioBuffer {
    if (this.noiseBuffer) return this.noiseBuffer;
    // One second, made once and reused. Every percussive sound in the table
    // takes its transient from this, so generating it per click would be a
    // thousand samples of arithmetic for a thirty millisecond tick.
    const frames = Math.floor(ctx.sampleRate);
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;
    this.noiseBuffer = buffer;
    return buffer;
  }

  // ----------------------------------------------------------------
  // Playing
  // ----------------------------------------------------------------

  /**
   * Play one sound, if everything says it should be heard.
   *
   * Every reason not to make a noise is checked here rather than at the call
   * sites, so the board can simply say what happened and this can decide
   * whether it is audible.
   */
  play(event: SoundEvent): void {
    if (!this.state.master) return;
    const setting = this.state.events[event];
    if (!setting?.on) return;

    const voice = VOICES[setting.voice];
    if (!voice) return;
    this.emit(voice.layers, this.state.volume * setting.gain * voice.gain);
  }

  /**
   * Play a voice on its own, at the master volume.
   *
   * What the picker uses. Auditioning is about the SOUND rather than about the
   * event, so it deliberately ignores the event's switch and its slider: the
   * question being asked is "what does this one sound like", and answering it
   * through a muted event would answer with silence.
   */
  audition(id: VoiceId, level = 1): void {
    const voice = VOICES[id];
    if (!voice) return;
    this.unlock();
    this.emit(voice.layers, Math.max(this.state.volume, 0.25) * clamp(level) * voice.gain);
  }

  /** Preview an event, as its assigned voice, even if the event is muted. */
  preview(event: SoundEvent): void {
    this.audition(this.voiceFor(event));
  }

  /** Schedule a set of layers at a level, if anything is able to play them. */
  private emit(layers: readonly Layer[], level: number): void {
    if (level <= 0) return;
    this.unlock();
    const ctx = this.ctx;
    const out = this.out;
    if (!ctx || !out) return;

    try {
      // A hair in the future. Scheduling at exactly `currentTime` leaves the
      // envelope's first ramp partly in the past, which some browsers render as
      // a click on the front of every sound.
      const t0 = ctx.currentTime + 0.012;
      for (const layer of layers) this.layer(ctx, out, layer, level, t0);
    } catch {
      // A context that was closed under us, or a browser refusing to schedule.
      // Nothing here is worth interrupting a game for.
    }
  }

  /** One oscillator or noise burst, with its envelope, wired to the master. */
  private layer(
    ctx: AudioContext,
    out: GainNode,
    layer: Layer,
    level: number,
    t0: number
  ): void {
    const start = t0 + layer.delay;
    const end = start + layer.attack + layer.decay;

    const gain = ctx.createGain();
    gain.connect(out);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(level * layer.level, start + layer.attack);
    // Exponential on the way down, because loudness is not linear and a linear
    // fade reads as a sound being cut off rather than dying away.
    gain.gain.exponentialRampToValueAtTime(0.0001, end);

    let source: AudioScheduledSourceNode;
    if (layer.wave === 'noise') {
      const noise = ctx.createBufferSource();
      noise.buffer = this.noise(ctx);
      // Band-passed rather than raw. Raw white noise is hiss; swept through a
      // narrow band it is the knock of one object against another, which is
      // what a piece landing on a square actually is.
      const band = ctx.createBiquadFilter();
      band.type = 'bandpass';
      band.Q.value = 1.2;
      band.frequency.setValueAtTime(layer.from, start);
      band.frequency.exponentialRampToValueAtTime(Math.max(40, layer.to), end);
      noise.connect(band);
      band.connect(gain);
      source = noise;
    } else {
      const osc = ctx.createOscillator();
      osc.type = layer.wave;
      osc.frequency.setValueAtTime(layer.from, start);
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, layer.to), end);
      osc.connect(gain);
      source = osc;
    }

    source.start(start);
    // Stopped, always. An oscillator left running is a tone that never ends and
    // a node that is never collected, and a long game makes thousands of them.
    source.stop(end + 0.03);
  }
}

export { EVENTS, SOUND_EVENTS, VOICES, voiceLength };
export type { SoundEvent, VoiceId };
