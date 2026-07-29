/**
 * Behavioural tests for the mobile playback shim.
 *
 * Players inscribed from 2026-07-03 onward decode the whole track to raw PCM at load
 * to draw a waveform. On a phone that blows the frame's memory and takes the <audio>
 * element down with it, so the player sits at 0:00 and the tap does nothing. The
 * template is fixed, but inscriptions are permanent — every player already on chain
 * would stay broken forever without this.
 *
 * These run the injected script for real against a stub environment rather than
 * grepping the source, because "the string is present" would not have caught a shim
 * that engaged on desktop or failed to engage on a phone.
 */
import { describe, expect, it } from 'vitest';
import { injectMobilePlaybackShim } from '../html-preview';

const HOST = '<!doctype html><html><head><title>p</title></head><body>player</body></html>';

/** Pulls the shim out of the injected document and runs it against a fake window. */
const runShim = (env: { deviceMemory?: number; userAgent: string }) => {
  const html = injectMobilePlaybackShim(HOST);
  const body = /<script data-xtrata-playback-shim="true">([\s\S]*?)<\/script>/.exec(html)?.[1];
  if (!body) throw new Error('shim script not found in injected document');

  const decodeCalls: number[] = [];
  class StubAudioContext {
    decodeAudioData(buffer: { byteLength: number }) {
      decodeCalls.push(buffer.byteLength);
      return Promise.resolve({ decoded: true });
    }
  }
  const win = {
    AudioContext: StubAudioContext,
    navigator: { deviceMemory: env.deviceMemory, userAgent: env.userAgent }
  } as any;
  // The shim reads `window.` and bare `navigator`, so bind both.
  new Function('window', 'navigator', body)(win, win.navigator);
  return { StubAudioContext, decodeCalls };
};

const decode = (ctx: any, bytes: number) => ctx.decodeAudioData({ byteLength: bytes });

describe('mobile playback shim', () => {
  it('is injected before anything else in the document', () => {
    const html = injectMobilePlaybackShim(HOST);
    expect(html.indexOf('data-xtrata-playback-shim')).toBeLessThan(html.indexOf('<body'));
  });

  it('is idempotent, so re-rendering never stacks copies', () => {
    const once = injectMobilePlaybackShim(HOST);
    expect(injectMobilePlaybackShim(once)).toBe(once);
  });

  it('refuses an oversized decode on a phone', async () => {
    const { StubAudioContext, decodeCalls } = runShim({ userAgent: 'iPhone', deviceMemory: 4 });
    await expect(decode(new StubAudioContext(), 6_700_000)).rejects.toThrow(/waveform decode skipped/);
    // Crucially the real decode never ran, so the memory was never allocated.
    expect(decodeCalls).toEqual([]);
  });

  it('still allows a small decode on a phone, so short tracks keep their waveform', async () => {
    const { StubAudioContext, decodeCalls } = runShim({ userAgent: 'iPhone', deviceMemory: 4 });
    await expect(decode(new StubAudioContext(), 500_000)).resolves.toEqual({ decoded: true });
    expect(decodeCalls).toEqual([500_000]);
  });

  it('does nothing at all on desktop', async () => {
    // Desktop rendering must be bit-for-bit what it was.
    const { StubAudioContext, decodeCalls } = runShim({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      deviceMemory: 16
    });
    await expect(decode(new StubAudioContext(), 6_700_000)).resolves.toEqual({ decoded: true });
    expect(decodeCalls).toEqual([6_700_000]);
  });

  it('treats a low-memory machine as constrained even without a mobile UA', async () => {
    const { decodeCalls, StubAudioContext } = runShim({
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
      deviceMemory: 2
    });
    await expect(decode(new StubAudioContext(), 6_700_000)).rejects.toThrow();
    expect(decodeCalls).toEqual([]);
  });

  it('never throws when the environment lacks Web Audio', () => {
    const html = injectMobilePlaybackShim(HOST);
    const body = /<script data-xtrata-playback-shim="true">([\s\S]*?)<\/script>/.exec(html)![1];
    const win = { navigator: { userAgent: 'iPhone' } } as any;
    expect(() => new Function('window', 'navigator', body)(win, win.navigator)).not.toThrow();
  });
});
