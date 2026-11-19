// Test-only two-input comparison on the audio clock. No output means no sound
// reaches the test machine's speakers, but both source graphs really run.
class LegacyReference extends AudioWorkletProcessor {
  constructor() {
    super();
    this.peak = 0;
    this.energy = 0;
    this.frames = 0;
    this.port.onmessage = () =>
      this.port.postMessage({ peak: this.peak, energy: this.energy, frames: this.frames });
  }
  process(inputs) {
    const a = inputs[0],
      b = inputs[1];
    for (let c = 0; c < 2; c++)
      for (let n = 0; n < 128; n++) {
        const x = a[c]?.[n] || 0,
          y = b[c]?.[n] || 0;
        this.peak = Math.max(this.peak, Math.abs(x - y));
        this.energy += y * y;
        this.frames++;
      }
    return true;
  }
}
registerProcessor('legacy-compare', LegacyReference);
