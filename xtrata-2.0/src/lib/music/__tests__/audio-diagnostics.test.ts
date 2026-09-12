import { it, expect, vi, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const code = readFileSync(
  new URL('../../../../xtrata-agent-one/wizard/audio-processing.js', import.meta.url),
  'utf8'
);
afterEach(() => vi.useRealTimers());
it('reports engine wait, times out, and allows a fresh retry without recording file contents', async () => {
  vi.useFakeTimers();
  const events: any[] = [];
  const exit = vi.fn();
  let calls = 0;
  const window: any = {
    dispatchEvent: (event: any) => events.push(event.detail),
    FFmpeg: {
      createFFmpeg: () => {
        calls++;
        return { load: () => new Promise(() => {}), exit };
      }
    }
  };
  vm.runInNewContext(code, {
    window,
    CustomEvent: class {
      detail: any;
      constructor(_type: string, opts: any) {
        this.detail = opts.detail;
      }
    },
    Date,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval
  });
  const f = new File(['private file contents'], 'private-name.wav');
  const first = window.XtrataAudioProcessing.extract(f, () => {}, 'original');
  const rejected = expect(first).rejects.toThrow('120 seconds');
  await vi.advanceTimersByTimeAsync(120000);
  await rejected;
  expect(events.some((e) => e.phase === 'engine-wait')).toBe(true);
  expect(events.some((e) => e.phase === 'engine-error')).toBe(true);
  expect(exit).toHaveBeenCalled();
  const second = window.XtrataAudioProcessing.extract(f, () => {}, 'original');
  const retry = expect(second).rejects.toThrow('120 seconds');
  await vi.advanceTimersByTimeAsync(120000);
  await retry;
  expect(calls).toBe(2);
  expect(JSON.stringify(events)).not.toContain('private');
  expect(vi.getTimerCount()).toBe(0);
});

it('passes all four bitrates to FFmpeg and caches each bitrate independently', async () => {
  const commands: string[][] = [];
  const window: any = {
    FFmpeg: {
      createFFmpeg: () => ({
        load: async () => {},
        exit: () => {},
        FS: (op: string, name: string) =>
          op === 'readFile'
            ? name === 'out.weba'
              ? new Uint8Array([1, 2, 3])
              : name === 'meta.txt'
                ? new TextEncoder().encode(';FFMETADATA1')
                : null
            : undefined,
        run: async (...args: string[]) => {
          commands.push(args);
        }
      })
    }
  };
  vm.runInNewContext(code, {
    window,
    Date,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    TextDecoder,
    Uint8Array,
    btoa: (s: string) => Buffer.from(s, 'binary').toString('base64')
  });
  const f = new File(['audio'], 'song.wav');
  const a = window.XtrataAudioProcessing;
  await a.extract(f, () => {}, 'compact');
  await a.extract(f, () => {}, 'compact');
  expect(commands).toHaveLength(2);
  expect(commands[0][commands[0].indexOf('-b:a') + 1]).toBe('48k');
  await a.extract(f, () => {}, 'optimised');
  expect(commands).toHaveLength(4);
  expect(commands[2][commands[2].indexOf('-b:a') + 1]).toBe('96k');
  for (const [quality, bitrate] of [['high', '128k'], ['premium', '160k']]) {
    const count = commands.length;
    await a.extract(f, () => {}, quality);
    await a.extract(f, () => {}, quality);
    expect(commands).toHaveLength(count + 2);
    expect(commands[count][commands[count].indexOf('-b:a') + 1]).toBe(bitrate);
  }
});
