// A Web Audio context that makes no sound and remembers everything.
//
// jsdom has no Web Audio at all, so without this every test of the sound module
// would be testing that nothing happens - which is also what a broken module
// does. This records what was scheduled instead, so a test can assert that a
// sound was actually built, how many voices it had, and at what level.
//
// Not a test itself. The runner only collects *.test.ts.

export class FakeParam {
  value = 0;
  readonly calls: [string, number][] = [];
  setValueAtTime(value: number): this {
    this.value = value;
    this.calls.push(['set', value]);
    return this;
  }
  linearRampToValueAtTime(value: number): this {
    this.calls.push(['linear', value]);
    return this;
  }
  exponentialRampToValueAtTime(value: number): this {
    this.calls.push(['exponential', value]);
    return this;
  }
  /** The loudest value this parameter was ever ramped to. */
  peak(): number {
    return this.calls.reduce((most, [, value]) => Math.max(most, value), 0);
  }
}

class FakeNode {
  connect(): void {
    // Wiring is not what these tests are about.
  }
  disconnect(): void {
    // Same.
  }
}

export class FakeOscillator extends FakeNode {
  type = 'sine';
  readonly frequency = new FakeParam();
  started: number | null = null;
  stopped: number | null = null;
  start(when: number): void {
    this.started = when;
  }
  stop(when: number): void {
    this.stopped = when;
  }
}

export class FakeSource extends FakeNode {
  buffer: unknown = null;
  started: number | null = null;
  stopped: number | null = null;
  start(when: number): void {
    this.started = when;
  }
  stop(when: number): void {
    this.stopped = when;
  }
}

class FakeGain extends FakeNode {
  readonly gain = new FakeParam();
}

class FakeFilter extends FakeNode {
  type = '';
  readonly Q = new FakeParam();
  readonly frequency = new FakeParam();
}

export class FakeAudioContext {
  static built = 0;

  state: 'suspended' | 'running' | 'closed' = 'suspended';
  currentTime = 0;
  readonly sampleRate = 44_100;
  readonly destination = new FakeNode();

  readonly oscillators: FakeOscillator[] = [];
  readonly sources: FakeSource[] = [];
  readonly gains: FakeGain[] = [];
  buffers = 0;

  constructor() {
    FakeAudioContext.built += 1;
  }

  async resume(): Promise<void> {
    this.state = 'running';
  }

  async close(): Promise<void> {
    this.state = 'closed';
  }

  createGain(): FakeGain {
    const node = new FakeGain();
    this.gains.push(node);
    return node;
  }

  createOscillator(): FakeOscillator {
    const node = new FakeOscillator();
    this.oscillators.push(node);
    return node;
  }

  createBufferSource(): FakeSource {
    const node = new FakeSource();
    this.sources.push(node);
    return node;
  }

  createBiquadFilter(): FakeFilter {
    return new FakeFilter();
  }

  createBuffer(_channels: number, frames: number): { getChannelData(): Float32Array } {
    this.buffers += 1;
    const data = new Float32Array(frames);
    return { getChannelData: () => data };
  }

  /** Every voice scheduled so far: one oscillator or one noise burst each. */
  get voices(): number {
    return this.oscillators.length + this.sources.length;
  }

  forget(): void {
    this.oscillators.length = 0;
    this.sources.length = 0;
    this.gains.length = 0;
  }
}

/** Install it on a jsdom window, as the constructor the module looks for. */
export function installFakeAudio(win: Window): () => FakeAudioContext | null {
  let last: FakeAudioContext | null = null;
  (win as unknown as Record<string, unknown>).AudioContext = function (): FakeAudioContext {
    last = new FakeAudioContext();
    return last;
  } as unknown as typeof AudioContext;
  return () => last;
}
