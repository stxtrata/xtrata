// Synthwave access-screen audio, ported from the standalone Audionaut access screen.
// Everything is synthesised on the fly (no audio files, no network) and nothing plays until the
// visitor switches sound on. Key: A minor / C major.
//   RED locked     -> low double-blip "lock engaged"
//   ORANGE working -> pulsing minor arpeggio + data blips
//   GREEN cleared  -> bright major-7 stab + rising arp
//   lock release   -> servo whine + ratchet, then a steam vent
//   unlocked       -> Fmaj7 pad + shimmer arp

export interface AccessAudio {
  /** Create or resume the audio context. Returns false when sound is off or unsupported. */
  resume(): boolean;
  mute(muted: boolean): void;
  powerOn(): void;
  lamp(color: string): void;
  beep(frequency?: number, length?: number, gain?: number): void;
  scan(): void;
  success(): void;
  deny(): void;
  wheel(): void;
  hiss(): void;
  clunk(strength?: number): void;
  portal(): void;
}

interface Options {
  isEnabled: () => boolean;
  reducedMotion: () => boolean;
}

interface SynthOptions {
  type?: OscillatorType;
  voices?: number;
  spread?: number;
  cut0?: number;
  cut1?: number;
  q?: number;
  attack?: number;
  release?: number;
  reverb?: number;
  echo?: number;
  glide?: number;
}

interface LaserOptions {
  type?: OscillatorType;
  reverb?: number;
  echo?: number;
  q?: number;
  cut?: number;
}

export function createAccessAudio({ isEnabled, reducedMotion }: Options): AccessAudio {
  let context!: AudioContext;
  let master!: GainNode;
  let noise!: AudioBuffer;
  let dry!: GainNode;
  let reverbIn!: GainNode;
  let delayIn!: GainNode;
  let ready = false;
  const N = (m: number) => 440 * Math.pow(2, (m - 69) / 12); // MIDI note -> Hz

  function makeImpulse(seconds: number, decay: number) {
    const rate = context.sampleRate;
    const length = Math.ceil(rate * seconds);
    const buffer = context.createBuffer(2, length, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      let smooth = 0;
      for (let i = 0; i < length; i++) {
        smooth += (Math.random() * 2 - 1 - smooth) * 0.45; // dark, plate-like tail
        data[i] = smooth * Math.pow(1 - i / length, decay);
      }
    }
    return buffer;
  }

  function init(): boolean {
    if (!isEnabled()) return false;
    try {
      if (!ready) {
        const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return false;
        context = new Ctor();
        master = context.createGain();
        master.gain.value = 0.8;
        const limiter = context.createDynamicsCompressor();
        limiter.threshold.value = -16;
        limiter.knee.value = 12;
        limiter.ratio.value = 6;
        limiter.attack.value = 0.004;
        limiter.release.value = 0.22;
        master.connect(limiter);
        limiter.connect(context.destination);

        dry = context.createGain();
        dry.connect(master);

        reverbIn = context.createGain();
        const convolver = context.createConvolver();
        convolver.buffer = makeImpulse(2.6, 2.4);
        const reverbOut = context.createGain();
        reverbOut.gain.value = 0.6;
        reverbIn.connect(convolver);
        convolver.connect(reverbOut);
        reverbOut.connect(master);

        delayIn = context.createGain(); // echo with dark feedback
        const delay = context.createDelay(1);
        delay.delayTime.value = 0.3;
        const feedback = context.createGain();
        feedback.gain.value = 0.42;
        const darken = context.createBiquadFilter();
        darken.type = 'lowpass';
        darken.frequency.value = 2600;
        const delayOut = context.createGain();
        delayOut.gain.value = 0.5;
        delayIn.connect(delay);
        delay.connect(darken);
        darken.connect(feedback);
        feedback.connect(delay);
        darken.connect(delayOut);
        delayOut.connect(master);

        noise = context.createBuffer(1, Math.ceil(context.sampleRate * 2), context.sampleRate);
        const samples = noise.getChannelData(0);
        for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
        ready = true;
      }
      if (context.state === 'suspended') context.resume().catch(() => {});
      return true;
    } catch {
      return false;
    }
  }

  // ---- building blocks -------------------------------------------------------------------
  function bus(node: AudioNode, reverb = 0.2, echo = 0) {
    node.connect(dry);
    if (reverb) {
      const g = context.createGain();
      g.gain.value = reverb;
      node.connect(g);
      g.connect(reverbIn);
    }
    if (echo) {
      const g = context.createGain();
      g.gain.value = echo;
      node.connect(g);
      g.connect(delayIn);
    }
  }
  function tidy(source: AudioScheduledSourceNode, ...nodes: AudioNode[]) {
    source.onended = () => {
      try {
        source.disconnect();
      } catch {
        /* already gone */
      }
      for (const n of nodes) {
        try {
          n.disconnect();
        } catch {
          /* already gone */
        }
      }
    };
  }

  // Detuned multi-oscillator "supersaw" through a swept low-pass.
  function synth(t: number, freq: number, length: number, gain: number, o: SynthOptions = {}) {
    const { type = 'sawtooth', voices = 3, spread = 12, cut0 = 600, cut1 = 3000, q = 3, attack = 0.012, release = 0.18, reverb = 0.25, echo = 0, glide = 0 } = o;
    const lp = context.createBiquadFilter();
    lp.type = 'lowpass';
    lp.Q.value = q;
    lp.frequency.setValueAtTime(cut0, t);
    lp.frequency.exponentialRampToValueAtTime(Math.max(40, cut1), t + length);
    const env = context.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.linearRampToValueAtTime(gain, t + attack);
    env.gain.setValueAtTime(gain, t + Math.max(attack, length - 0.02));
    env.gain.exponentialRampToValueAtTime(0.0001, t + length + release);
    lp.connect(env);
    bus(env, reverb, echo);
    let last: OscillatorNode | undefined;
    for (let i = 0; i < voices; i++) {
      const osc = context.createOscillator();
      osc.type = type;
      osc.detune.value = (i - (voices - 1) / 2) * spread;
      osc.frequency.setValueAtTime(freq, t);
      if (glide) osc.frequency.exponentialRampToValueAtTime(Math.max(20, freq * glide), t + length);
      const g = context.createGain();
      g.gain.value = 1 / voices;
      osc.connect(g);
      g.connect(lp);
      osc.start(t);
      osc.stop(t + length + release + 0.05);
      last = osc;
    }
    if (last) tidy(last, lp, env);
  }

  // Pitch-diving "pew" / rising zap with a resonant filter.
  function laser(t: number, f0: number, f1: number, length: number, gain: number, o: LaserOptions = {}) {
    const { type = 'sawtooth', reverb = 0.3, echo = 0.25, q = 6, cut = 3500 } = o;
    const osc = context.createOscillator();
    const lp = context.createBiquadFilter();
    const env = context.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(f0, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + length);
    lp.type = 'lowpass';
    lp.Q.value = q;
    lp.frequency.setValueAtTime(cut, t);
    lp.frequency.exponentialRampToValueAtTime(Math.max(120, cut * 0.15), t + length);
    env.gain.setValueAtTime(0.0001, t);
    env.gain.linearRampToValueAtTime(gain, t + 0.004);
    env.gain.exponentialRampToValueAtTime(0.0001, t + length);
    osc.connect(lp);
    lp.connect(env);
    bus(env, reverb, echo);
    osc.start(t);
    osc.stop(t + length + 0.03);
    tidy(osc, lp, env);
  }

  function sub(t: number, f0: number, f1: number, length: number, gain: number) {
    const osc = context.createOscillator();
    const env = context.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f0, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(18, f1), t + length);
    env.gain.setValueAtTime(0.0001, t);
    env.gain.linearRampToValueAtTime(gain, t + 0.01);
    env.gain.exponentialRampToValueAtTime(0.0001, t + length);
    osc.connect(env);
    bus(env, 0.04, 0);
    osc.start(t);
    osc.stop(t + length + 0.03);
    tidy(osc, env);
  }

  function hush(t: number, length: number, gain: number, f0: number, f1: number, type: BiquadFilterType = 'bandpass', q = 0.9, reverb = 0.3) {
    const src = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const env = context.createGain();
    src.buffer = noise;
    src.loop = true;
    filter.type = type;
    filter.Q.value = q;
    filter.frequency.setValueAtTime(f0, t);
    filter.frequency.exponentialRampToValueAtTime(Math.max(40, f1), t + length);
    env.gain.setValueAtTime(0.0001, t);
    env.gain.linearRampToValueAtTime(gain, t + Math.min(0.12, length * 0.25));
    env.gain.exponentialRampToValueAtTime(0.0001, t + length);
    src.connect(filter);
    filter.connect(env);
    bus(env, reverb, 0);
    src.start(t);
    src.stop(t + length + 0.03);
    tidy(src, filter, env);
  }

  function arp(t: number, notes: number[], step: number, gain: number, o: SynthOptions = {}) {
    notes.forEach((m, i) =>
      synth(t + i * step, N(m), step * 0.9, gain, { cut0: 3400, cut1: 600, q: 6, spread: 10, release: 0.1, reverb: 0.3, echo: 0.4, ...o })
    );
  }

  return {
    resume: init,
    mute(muted) {
      if (!ready) return;
      master.gain.cancelScheduledValues(context.currentTime);
      master.gain.setTargetAtTime(muted ? 0 : 0.8, context.currentTime, 0.025);
    },

    // Sound switched on: a quick power-up arpeggio.
    powerOn() {
      if (!init()) return;
      const t = context.currentTime;
      arp(t, [57, 64, 69, 76], 0.07, 0.07, { echo: 0.5 });
      laser(t + 0.28, 600, 2800, 0.22, 0.05);
    },

    // Light changes colour: one short, distinct voice per colour.
    lamp(color) {
      if (!init()) return;
      const t = context.currentTime;
      if (color === 'red') {
        laser(t, 190, 150, 0.09, 0.08, { type: 'square', cut: 1400, echo: 0.1 });
        laser(t + 0.13, 190, 140, 0.1, 0.08, { type: 'square', cut: 1400, echo: 0.1 });
        sub(t, 70, 40, 0.25, 0.3);
      } else if (color === 'amber') {
        laser(t, 520, 700, 0.09, 0.28, { type: 'triangle', cut: 4200, echo: 0.3 });
      } else {
        laser(t, 880, 1320, 0.1, 0.2, { type: 'triangle', cut: 6000, echo: 0.4 });
        laser(t + 0.1, 1320, 1760, 0.14, 0.18, { type: 'triangle', cut: 6000, echo: 0.4 });
      }
    },

    // Scanner data blip (called once per scan stage).
    beep(frequency = 880, length = 0.08, gain = 0.08) {
      if (!init()) return;
      laser(context.currentTime, frequency * 1.3, frequency * 2.4, length, gain * 3.4, { type: 'square', cut: 5200, q: 3, echo: 0.35 });
    },

    // Orange: identity check. Pulsing minor arpeggio over a throbbing bass, with a rising shimmer.
    scan() {
      if (!init()) return;
      const t = context.currentTime;
      const pattern = [57, 60, 64, 69, 64, 60, 57, 64];
      for (let i = 0; i < 16; i++) {
        synth(t + 0.05 + i * 0.11, N(pattern[i % 8] + (i >= 8 ? 12 : 0)), 0.1, 0.055 + i * 0.003, { cut0: 3300, cut1: 500, q: 7, spread: 9, release: 0.1, reverb: 0.3, echo: 0.4 });
      }
      for (let i = 0; i < 4; i++) {
        synth(t + i * 0.44, N(33), 0.3, 0.14, { voices: 2, spread: 6, cut0: 420, cut1: 130, q: 2, reverb: 0.1, release: 0.12 });
        sub(t + i * 0.44, 55, 41, 0.3, 0.22);
      }
      hush(t, 1.7, 0.05, 700, 6500, 'bandpass', 2, 0.3);
    },

    // Green: access granted.
    success() {
      if (!init()) return;
      const t = context.currentTime;
      [60, 64, 67, 71].forEach((m) => synth(t, N(m), 0.55, 0.065, { voices: 4, spread: 16, cut0: 900, cut1: 5200, q: 2, attack: 0.015, release: 0.7, reverb: 0.5, echo: 0.3 }));
      synth(t, N(36), 0.6, 0.15, { voices: 2, spread: 5, cut0: 300, cut1: 200, q: 1, reverb: 0.1, release: 0.2 });
      sub(t, 65, 42, 0.5, 0.28);
      arp(t + 0.1, [72, 76, 79, 84], 0.085, 0.07, { cut0: 4200, cut1: 1200, q: 4, echo: 0.5 });
      laser(t, 900, 5200, 0.3, 0.035, { cut: 9000, q: 2 });
    },

    // Red fault.
    deny() {
      if (!init()) return;
      const t = context.currentTime;
      laser(t, 520, 90, 0.45, 0.12, { cut: 2600, q: 8, echo: 0.1 });
      laser(t + 0.14, 400, 70, 0.4, 0.09, { type: 'square', cut: 1800, q: 6, echo: 0.1 });
      sub(t, 72, 34, 0.55, 0.32);
    },

    // Orange: handwheel servo whine + ratchet clicks.
    wheel() {
      if (!init() || reducedMotion()) return;
      const t = context.currentTime;
      laser(t, 110, 520, 1.0, 0.055, { type: 'triangle', cut: 2800, q: 10, reverb: 0.3, echo: 0.2 });
      laser(t + 0.05, 220, 1040, 0.95, 0.022, { type: 'square', cut: 3200, q: 8, reverb: 0.3, echo: 0.3 });
      hush(t, 1.0, 0.1, 500, 2400, 'bandpass', 1.4, 0.25);
      for (let i = 0; i < 18; i++) {
        const f = i / 18;
        hush(t + 0.025 + 0.93 * f * f, 0.04, 0.09, 2300 + i * 40, 2300 + i * 40, 'highpass', 0.7, 0.12);
      }
      sub(t, 72, 46, 1.0, 0.18);
    },

    // Steam vent: air + a short falling zap.
    hiss() {
      if (!init() || reducedMotion()) return;
      const t = context.currentTime;
      hush(t, 1.2, 0.2, 1800, 7000, 'bandpass', 0.9, 0.35);
      laser(t, 2600, 320, 0.9, 0.018, { type: 'sawtooth', cut: 5000, q: 2 });
    },

    // Mechanical thunk: sub + noise + relay blip.
    clunk(strength = 1) {
      if (!init()) return;
      const t = context.currentTime;
      sub(t, 95, 36, 0.35, 0.5 * strength);
      hush(t, 0.18, 0.32 * strength, 1500, 300, 'lowpass', 0.8, 0.25);
      laser(t, 1200, 300, 0.07, 0.08 * strength, { type: 'square', cut: 4000, echo: 0.15, reverb: 0.2 });
    },

    // Green: fully unlocked.
    portal() {
      if (!init()) return;
      const t = context.currentTime;
      [53, 57, 60, 64].forEach((m) => synth(t, N(m), 1.4, 0.055, { voices: 4, spread: 18, cut0: 500, cut1: 4200, q: 2, attack: 0.05, release: 1.2, reverb: 0.6, echo: 0.25 }));
      synth(t, N(29), 1.0, 0.18, { voices: 2, spread: 5, cut0: 420, cut1: 140, q: 2, reverb: 0.15, release: 0.3 });
      sub(t, 43.7, 40, 1.0, 0.28);
      arp(t + 0.12, [69, 72, 77, 81, 84, 81, 77, 72], 0.08, 0.05, { cut0: 3800, cut1: 900, q: 5, echo: 0.5, reverb: 0.45 });
      laser(t, 300, 3800, 0.6, 0.028, { cut: 8000, q: 3 });
    }
  };
}
