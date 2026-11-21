// Stereo BS.1770-style K-weighted loudness (400 ms / 3 s / gated integrated)
// and 4x, 24-tap-per-phase windowed-sinc true-peak estimation. The estimator is
// explicitly labelled; this is not a claim of certified broadcast-meter compliance.
// Filter constants: ITU-R BS.1770 K weighting; sample-rate conversion checked against
// libebur128's public reference implementation: https://github.com/jiixyj/libebur128.
export class StereoMeter {
  constructor(sampleRate) {
    this.sr = sampleRate;
    const filter = (b, a) => ({ b, a, x1: 0, x2: 0, y1: 0, y2: 0 });
    const k = Math.tan(Math.PI * 1681.974450955533 / sampleRate), q = .7071752369554196;
    const h = Math.pow(10, 3.999843853973347 / 20), m = Math.pow(h, .4996667741545416), z = 1 + k / q + k * k;
    const shelfB = [(h + m * k / q + k * k) / z, 2 * (k * k - h) / z, (h - m * k / q + k * k) / z];
    const shelfA = [2 * (k * k - 1) / z, (1 - k / q + k * k) / z];
    const r = Math.tan(Math.PI * 38.13547087602444 / sampleRate), rq = .5003270373238773, rz = 1 + r / rq + r * r;
    this.filters = [0, 1].map(() => [filter(shelfB, shelfA), filter([1, -2, 1], [2 * (r * r - 1) / rz, (1 - r / rq + r * r) / rz])]);
    this.taps = 24;
    this.fir = [.25, .5, .75].map((phase) => {
      const weights = Array.from({ length: this.taps }, (_, i) => {
        const x = i - 11 - phase, sinc = Math.abs(x) < 1e-12 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x);
        return sinc * (.42 - .5 * Math.cos(2 * Math.PI * i / 23) + .08 * Math.cos(4 * Math.PI * i / 23));
      });
      const sum = weights.reduce((a, b) => a + b, 0); return weights.map((v) => v / sum);
    });
    this.reset();
  }
  reset() {
    this.history = [new Float64Array(this.taps), new Float64Array(this.taps)]; this.position = 0;
    this.peak = [0, 0]; this.truePeak = [0, 0]; this.samples = 0; this.clipped = 0;
    this.bins = []; this.bin = { count: 0, energy: 0, left: 0, right: 0, cross: 0, dcL: 0, dcR: 0 };
    this.histCount = new Float64Array(1200); this.histEnergy = new Float64Array(1200);
    for (const channel of this.filters) for (const f of channel) f.x1 = f.x2 = f.y1 = f.y2 = 0;
  }
  process(left, right = left) {
    const tick = Math.max(1, Math.round(this.sr / 10));
    for (let i = 0; i < left.length; i++) {
      const l = Number.isFinite(left[i]) ? left[i] : 0, r = Number.isFinite(right[i]) ? right[i] : 0;
      for (let channel = 0; channel < 2; channel++) {
        let x = channel ? r : l;
        this.peak[channel] = Math.max(this.peak[channel], Math.abs(x));
        this.history[channel][this.position] = x;
        this.truePeak[channel] = Math.max(this.truePeak[channel], Math.abs(x));
        for (const phase of this.fir) {
          let value = 0;
          for (let tap = 0; tap < this.taps; tap++) value += phase[tap] * this.history[channel][(this.position - tap + this.taps) % this.taps];
          this.truePeak[channel] = Math.max(this.truePeak[channel], Math.abs(value));
        }
        for (const f of this.filters[channel]) {
          const y = f.b[0] * x + f.b[1] * f.x1 + f.b[2] * f.x2 - f.a[0] * f.y1 - f.a[1] * f.y2;
          f.x2 = f.x1; f.x1 = x; f.y2 = f.y1; f.y1 = y; x = y;
        }
        this.bin.energy += x * x;
      }
      this.bin.left += l * l; this.bin.right += r * r; this.bin.cross += l * r; this.bin.dcL += l; this.bin.dcR += r;
      if (Math.abs(l) >= 1 || Math.abs(r) >= 1) this.clipped++;
      this.position = (this.position + 1) % this.taps; this.samples++; this.bin.count++;
      if (this.bin.count >= tick) {
        this.bins.push(this.bin); if (this.bins.length > 30) this.bins.shift();
        if (this.bins.length >= 4) {
          const recent = this.bins.slice(-4), count = recent.reduce((s, b) => s + b.count, 0), energy = recent.reduce((s, b) => s + b.energy, 0) / count;
          const lufs = -.691 + 10 * Math.log10(Math.max(1e-20, energy));
          if (lufs >= -70) { const index = Math.max(0, Math.min(1199, Math.floor((lufs + 70) * 10))); this.histCount[index]++; this.histEnergy[index] += energy; }
        }
        this.bin = { count: 0, energy: 0, left: 0, right: 0, cross: 0, dcL: 0, dcR: 0 };
      }
    }
  }
  read() {
    const loudness = (energy) => energy > 1e-20 ? -.691 + 10 * Math.log10(energy) : -120;
    const window = (count) => { const bins = this.bins.slice(-count), n = bins.reduce((s, b) => s + b.count, 0); return n ? loudness(bins.reduce((s, b) => s + b.energy, 0) / n) : -120; };
    let energy = 0, count = 0;
    for (let i = 0; i < 1200; i++) { energy += this.histEnergy[i]; count += this.histCount[i]; }
    const relative = count ? loudness(energy / count) - 10 : -70;
    energy = 0; count = 0;
    for (let i = Math.max(0, Math.ceil((relative + 70) * 10)); i < 1200; i++) { energy += this.histEnergy[i]; count += this.histCount[i]; }
    const b = this.bins.at(-1) || this.bin, n = Math.max(1, b.count);
    return { channels: [0, 1].map((i) => ({ peak: this.peak[i], truePeak: this.truePeak[i], rms: Math.sqrt((i ? b.right : b.left) / n), dc: (i ? b.dcR : b.dcL) / n })), samplePeak: Math.max(...this.peak), truePeak: Math.max(...this.truePeak), truePeakMethod: "4x FIR estimate", momentaryLufs: this.bins.length >= 4 ? window(4) : -120, shortTermLufs: this.bins.length >= 30 ? window(30) : -120, integratedLufs: count ? loudness(energy / count) : -120, correlation: b.left * b.right > 1e-20 ? b.cross / Math.sqrt(b.left * b.right) : 0, clippedSamples: this.clipped, seconds: this.samples / this.sr };
  }
}

export function analyseAudioBuffer(buffer) {
  const meter = new StereoMeter(buffer.sampleRate), left = buffer.getChannelData(0), right = buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : left;
  for (let i = 0; i < left.length; i += 4096) meter.process(left.subarray(i, i + 4096), right.subarray(i, i + 4096));
  return meter.read();
}
const modules = new WeakMap();
export function createMeter(ctx) {
  const input = ctx.createGain(), output = ctx.createGain(); input.connect(output);
  let processor = null, silent = null, latest = null, disposed = false, error = null;
  const ready = (async () => {
    if (!ctx.audioWorklet || typeof AudioWorkletNode === "undefined") { error = "AudioWorklet meters unavailable"; return false; }
    let loading = modules.get(ctx);
    if (!loading) {
      const source = `${StereoMeter.toString()}\nregisterProcessor('audionaut-stereo-meter', class extends AudioWorkletProcessor { constructor(){super();this.m=new StereoMeter(sampleRate);this.n=0;this.dead=false;this.port.onmessage=e=>{if(e.data==='reset')this.m.reset();if(e.data==='stop')this.dead=true;};} process(inputs,outputs){if(this.dead)return false;const a=inputs[0];if(a?.[0]){this.m.process(a[0],a[1]||a[0]);this.n+=a[0].length;if(this.n>=sampleRate/10){this.n=0;this.port.postMessage(this.m.read());}}return true;} });`;
      const url = URL.createObjectURL(new Blob([source], { type: "text/javascript" }));
      loading = ctx.audioWorklet.addModule(url).finally(() => URL.revokeObjectURL(url)); modules.set(ctx, loading);
    }
    try { await loading; if (disposed) return false; processor = new AudioWorkletNode(ctx, "audionaut-stereo-meter", { channelCount: 2, channelCountMode: "explicit", outputChannelCount: [1] }); processor.port.onmessage = (event) => { latest = event.data; }; processor.onprocessorerror = () => { error = "Audio meter processor stopped"; }; silent = ctx.createGain(); silent.gain.value = 0; input.connect(processor).connect(silent).connect(ctx.destination); return true; }
    catch (e) { error = e.message; return false; }
  })();
  return { input, output, ready, read: () => ({ ...latest, available: !!latest, error }), reset: () => { latest = null; processor?.port.postMessage("reset"); }, dispose: () => { disposed = true; processor?.port.postMessage("stop"); for (const node of [input, output, processor, silent]) try { node?.disconnect(); } catch {} } };
}
