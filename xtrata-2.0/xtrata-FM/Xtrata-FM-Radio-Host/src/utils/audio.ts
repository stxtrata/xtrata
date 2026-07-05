import { SfxType } from "../types";

let audioCtx: AudioContext | null = null;
let musicInterval: any = null;
let currentMusicSource: AudioNode | null = null;

export function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// 1. Synthesize Airhorn
export function playAirhorn(ctx: AudioContext, destination: AudioNode) {
  const duration = 1.2;
  const now = ctx.currentTime;

  // Combine multiple oscillators to create the thick, detuned "brass" of an airhorn
  const frequencies = [220, 224, 440, 445, 660, 665, 880];
  const oscillators: OscillatorNode[] = [];
  const mainGain = ctx.createGain();
  mainGain.gain.setValueAtTime(0, now);
  mainGain.gain.linearRampToValueAtTime(0.3, now + 0.05);
  mainGain.gain.setValueAtTime(0.3, now + 0.8);
  mainGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  // Bandpass filter to give it that radio/megaphone boxiness
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(600, now);
  filter.Q.setValueAtTime(1.5, now);

  // Reverb/Delay simulation
  const delay = ctx.createDelay();
  delay.delayTime.setValueAtTime(0.12, now);
  const delayGain = ctx.createGain();
  delayGain.gain.setValueAtTime(0.2, now);

  frequencies.forEach((freq) => {
    const osc = ctx.createOscillator();
    osc.type = freq > 440 ? "sawtooth" : "square";
    osc.frequency.setValueAtTime(freq, now);
    
    // Add rapid vibrato
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(8, now); // 8Hz vibrato
    lfoGain.gain.setValueAtTime(4, now); // vibrato depth
    
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start(now);
    
    osc.connect(mainGain);
    oscillators.push(osc);
    lfo.stop(now + duration);
  });

  mainGain.connect(filter);
  filter.connect(destination);

  // Delay loop for echo
  filter.connect(delay);
  delay.connect(delayGain);
  delayGain.connect(destination);
  delayGain.connect(delay); // feedback loop

  oscillators.forEach((osc) => {
    osc.start(now);
    osc.stop(now + duration);
  });
}

// 2. Synthesize Bass Drop
export function playBassDrop(ctx: AudioContext, destination: AudioNode) {
  const duration = 2.5;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(130, now);
  osc.frequency.exponentialRampToValueAtTime(30, now + duration - 0.5);

  oscGain.gain.setValueAtTime(0, now);
  oscGain.gain.linearRampToValueAtTime(0.8, now + 0.1);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(oscGain);
  oscGain.connect(destination);

  osc.start(now);
  osc.stop(now + duration);
}

// 3. Synthesize Laser Siren
export function playLaserSiren(ctx: AudioContext, destination: AudioNode) {
  const duration = 2.0;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(600, now);

  // LFO to sweep laser frequency rapidly
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.type = "triangle";
  lfo.frequency.setValueAtTime(6, now); // 6 sweeps per second
  lfoGain.gain.setValueAtTime(400, now); // sweep range +- 400Hz

  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);

  oscGain.gain.setValueAtTime(0, now);
  oscGain.gain.linearRampToValueAtTime(0.25, now + 0.1);
  oscGain.gain.setValueAtTime(0.25, now + duration - 0.5);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  // Megaphone distortion effect
  const dist = ctx.createWaveShaper();
  const makeDistortionCurve = (amount = 20) => {
    const k = typeof amount === "number" ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  };
  dist.curve = makeDistortionCurve(10);
  dist.oversample = "4x";

  const delay = ctx.createDelay();
  delay.delayTime.setValueAtTime(0.15, now);
  const delayGain = ctx.createGain();
  delayGain.gain.setValueAtTime(0.3, now);

  lfo.start(now);
  osc.connect(dist);
  dist.connect(oscGain);
  oscGain.connect(destination);

  // Delay echo
  oscGain.connect(delay);
  delay.connect(delayGain);
  delayGain.connect(destination);
  delayGain.connect(delay);

  osc.start(now);
  
  lfo.stop(now + duration);
  osc.stop(now + duration);
}

// 4. Synthesize Record Scratch
export function playRecordScratch(ctx: AudioContext, destination: AudioNode) {
  const duration = 0.5;
  const now = ctx.currentTime;

  // Create noise buffer
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  // Dynamic filter sweep
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(200, now);
  filter.frequency.exponentialRampToValueAtTime(2500, now + 0.25);
  filter.frequency.exponentialRampToValueAtTime(100, now + duration);
  filter.Q.setValueAtTime(4.0, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.5, now + 0.1);
  gain.gain.setValueAtTime(0.5, now + 0.3);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(destination);

  noise.start(now);
}

// 5. Synthesize Radio Static Sweep
export function playRadioStatic(ctx: AudioContext, destination: AudioNode) {
  const duration = 1.2;
  const now = ctx.currentTime;

  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(400, now);
  filter.frequency.linearRampToValueAtTime(1600, now + 0.6);
  filter.frequency.linearRampToValueAtTime(600, now + duration);
  filter.Q.setValueAtTime(8.0, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.4, now + 0.1);
  gain.gain.linearRampToValueAtTime(0.3, now + 0.8);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(destination);

  noise.start(now);
}

// 6. Synthesize Electronic Ping
export function playElectronicPing(ctx: AudioContext, destination: AudioNode) {
  const duration = 0.8;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(1200, now);
  osc.frequency.exponentialRampToValueAtTime(200, now + duration);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  const delay = ctx.createDelay();
  delay.delayTime.setValueAtTime(0.1, now);
  const delayGain = ctx.createGain();
  delayGain.gain.setValueAtTime(0.4, now);

  osc.connect(gain);
  gain.connect(destination);

  gain.connect(delay);
  delay.connect(delayGain);
  delayGain.connect(destination);
  delayGain.connect(delay);

  osc.start(now);
  osc.stop(now + duration);
}

// Dispatch playback based on SFX Enum
export function playSfx(type: SfxType, ctx: AudioContext, destination: AudioNode) {
  switch (type) {
    case SfxType.AIRHORN:
      playAirhorn(ctx, destination);
      break;
    case SfxType.BASS_DROP:
      playBassDrop(ctx, destination);
      break;
    case SfxType.LASER_SIREN:
      playLaserSiren(ctx, destination);
      break;
    case SfxType.RECORD_SCRATCH:
      playRecordScratch(ctx, destination);
      break;
    case SfxType.RADIO_STATIC:
      playRadioStatic(ctx, destination);
      break;
    case SfxType.ELECTRONIC_PING:
      playElectronicPing(ctx, destination);
      break;
    default:
      break;
  }
}

// Synthesize a continuous, looping retro-futuristic Synthwave Backbeat (using web audio oscillators!)
export function startSynthwaveMusic(ctx: AudioContext, destination: AudioNode, volume = 0.15) {
  if (currentMusicSource) {
    stopSynthwaveMusic();
  }

  const mainMusicGain = ctx.createGain();
  mainMusicGain.gain.setValueAtTime(volume, ctx.currentTime);
  mainMusicGain.connect(destination);

  let step = 0;
  const tempo = 110; // BPM
  const stepTime = 60 / tempo / 2; // Eighth notes (0.272s)

  // Bass frequencies (C, Eb, G, Bb)
  const bassNotes = [
    65.41, 65.41, 65.41, 65.41, // C2
    77.78, 77.78, 77.78, 77.78, // Eb2
    98.00, 98.00, 98.00, 98.00, // G2
    116.54, 116.54, 116.54, 116.54 // Bb2
  ];

  // Helper to synthesize a bass synth pluck
  const playBassPluck = (freq: number, time: number) => {
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq, time);

    // Warm, retro lowpass filter sweep
    const lpFilter = ctx.createBiquadFilter();
    lpFilter.type = "lowpass";
    lpFilter.frequency.setValueAtTime(800, time);
    lpFilter.frequency.exponentialRampToValueAtTime(150, time + 0.2);
    lpFilter.Q.setValueAtTime(2.0, time);

    oscGain.gain.setValueAtTime(0, time);
    oscGain.gain.linearRampToValueAtTime(0.5, time + 0.01);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);

    osc.connect(lpFilter);
    lpFilter.connect(oscGain);
    oscGain.connect(mainMusicGain);

    osc.start(time);
    osc.stop(time + 0.4);
  };

  // Helper to synthesize a synthetic kick drum
  const playKick = (time: number) => {
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(45, time + 0.1);

    oscGain.gain.setValueAtTime(1.0, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

    osc.connect(oscGain);
    oscGain.connect(mainMusicGain);

    osc.start(time);
    osc.stop(time + 0.2);
  };

  // Helper to synthesize a digital snare/hi-hat burst
  const playHihat = (time: number, isAccent = false) => {
    const bufferSize = ctx.sampleRate * 0.05;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const hpFilter = ctx.createBiquadFilter();
    hpFilter.type = "highpass";
    hpFilter.frequency.setValueAtTime(6000, time);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(isAccent ? 0.2 : 0.08, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + (isAccent ? 0.08 : 0.04));

    noise.connect(hpFilter);
    hpFilter.connect(gain);
    gain.connect(mainMusicGain);

    noise.start(time);
  };

  const scheduleNextBeats = () => {
    const bufferSeconds = 0.15; // Schedule 150ms ahead
    let playTime = ctx.currentTime;

    while (playTime < ctx.currentTime + bufferSeconds) {
      const scheduledTime = playTime + step * stepTime;

      // 1. Synth Bassline (every half beat)
      const bassIndex = Math.floor(step / 2) % bassNotes.length;
      playBassPluck(bassNotes[bassIndex], scheduledTime);

      // 2. Kick Drum (on beats 1 and 3)
      if (step % 4 === 0) {
        playKick(scheduledTime);
      }

      // 3. Hi-Hats (on every offbeat or eighth note)
      if (step % 2 === 1) {
        playHihat(scheduledTime, step % 4 === 2);
      }

      step = (step + 1) % 32; // 16 beats loop (32 eighth notes)
    }
  };

  // Initial schedule
  scheduleNextBeats();

  // Keep scheduling beats
  musicInterval = setInterval(() => {
    scheduleNextBeats();
  }, 100);

  currentMusicSource = mainMusicGain;
}

export function stopSynthwaveMusic() {
  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
  if (currentMusicSource) {
    try {
      currentMusicSource.disconnect();
    } catch (e) {}
    currentMusicSource = null;
  }
}
