import type { GesturePoint, LivingRecording } from "./recording";

export class LivingSynth {
  private context?: AudioContext;
  private oscillator?: OscillatorNode;
  private filter?: BiquadFilterNode;
  private gain?: GainNode;
  private loopTimers: number[] = [];

  async touch(x: number, y: number, pressure = 0.65) {
    const context = await this.audio();
    if (!this.oscillator) {
      this.oscillator = context.createOscillator();
      this.filter = context.createBiquadFilter();
      this.gain = context.createGain();
      this.oscillator.type = "sawtooth";
      this.filter.type = "lowpass";
      this.gain.gain.value = 0;
      this.oscillator.connect(this.filter).connect(this.gain).connect(context.destination);
      this.oscillator.start();
    }
    const now = context.currentTime;
    this.oscillator.frequency.setTargetAtTime(55 * 2 ** (x * 5), now, 0.015);
    this.filter!.frequency.setTargetAtTime(180 + y * y * 10_000, now, 0.02);
    this.gain!.gain.setTargetAtTime(0.035 + pressure * 0.12, now, 0.01);
  }

  release() {
    if (this.context && this.gain) this.gain.gain.setTargetAtTime(0, this.context.currentTime, 0.025);
  }

  stopLoop() {
    this.loopTimers.forEach(window.clearTimeout);
    this.loopTimers = [];
    this.release();
  }

  playLoop(recording: LivingRecording) {
    this.stopLoop();
    const schedule = () => {
      recording.gestures.forEach(point => {
        const timer = window.setTimeout(() => this.perform(point), point.at);
        this.loopTimers.push(timer);
      });
      this.loopTimers.push(window.setTimeout(schedule, recording.engine.loopMs));
    };
    schedule();
  }

  private perform(point: GesturePoint) {
    if (point.gate === "off") this.release();
    else void this.touch(point.x, point.y, point.pressure);
  }

  private async audio() {
    this.context ??= new AudioContext();
    if (this.context.state === "suspended") await this.context.resume();
    return this.context;
  }
}

