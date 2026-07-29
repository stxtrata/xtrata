/**
 * Guards on the inscribed audio player template, so a future edit cannot ship a
 * player that plays fine on a laptop and not at all on a phone.
 *
 * These matter more than most tests here because the template is INSCRIBED. Once a
 * player is on chain it is permanent, so a regression is not something we can patch
 * afterwards — every inscription made while it was broken stays broken forever.
 *
 * The bug these exist to prevent, seen on inscription #2883:
 *   loadRealWaveform() decoded the entire track to raw PCM at load time, purely to
 *   draw a waveform. One minute of 48 kHz stereo float32 is ~23 MB, so a long track
 *   runs to hundreds of MB. Desktop absorbed it. iOS did not, and when the decode
 *   blew the frame's memory the <audio> element beside it died too: the player sat
 *   at 0:00 reading "ready to play" and the tap did nothing. Older players had no
 *   waveform, which is why only newer inscriptions broke.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const COPIES = [
  '../../../opus-file-generator/HTML_Template.js',
  '../../../xtrata-agent-one/wizard/HTML_Template.js',
  '../../../xtrata-agent-one/svc/vendor/HTML_Template.js'
] as const;

const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), 'utf8');
const template = read(COPIES[0]);

describe('inscribed audio player: mobile playability', () => {
  it('never decodes a whole track to PCM without checking the cost first', () => {
    expect(template).toContain('const waveformDecodeIsSafe = (src) =>');
    // The guard must run BEFORE any AudioContext work, or the cost is already paid.
    const fn = template.slice(
      template.indexOf('const loadRealWaveform = () =>'),
      template.indexOf('fetch(src)')
    );
    expect(fn).toContain('if (!waveformDecodeIsSafe(src)) return;');
    expect(fn.indexOf('waveformDecodeIsSafe')).toBeLessThan(
      fn.indexOf('AudioContextClass') === -1 ? Infinity : fn.indexOf('AudioContextClass')
    );
  });

  it('caps the decode by payload size and by device memory', () => {
    expect(template).toMatch(/MAX_WAVEFORM_SRC_CHARS = \d+/);
    expect(template).toContain('src.length > MAX_WAVEFORM_SRC_CHARS');
    expect(template).toContain('navigator.deviceMemory');
  });

  it('treats a skipped waveform as normal, never as a failed player', () => {
    // Playback is the product. The waveform is decoration and must degrade quietly.
    const fn = template.slice(
      template.indexOf('const loadRealWaveform = () =>'),
      template.indexOf('fetch(src)')
    );
    expect(fn).not.toMatch(/throw |console\.error/);
  });

  it('coalesces resize redraws to one per frame', () => {
    // iOS fires resize continuously while scrolling as the URL bar hides and shows.
    // A raw handler here made the controls flash and swallowed taps.
    expect(template).not.toContain("window.addEventListener('resize', drawHoverWave)");
    expect(template).toContain('requestAnimationFrame');
    const at = template.indexOf("window.addEventListener('resize'");
    expect(template.slice(at, at + 260)).toContain('hoverWaveFrame');
  });

  it('keeps every copy of the template identical', () => {
    // Three copies ship. A fix applied to one leaves the other two emitting the old,
    // broken player, and nothing else in the build would notice.
    const [first, ...rest] = COPIES.map(read);
    for (const [i, other] of rest.entries()) {
      expect(other, `${COPIES[i + 1]} has drifted from ${COPIES[0]}`).toBe(first);
    }
  });

  it('emits a player script that parses', () => {
    const match = /<script>([\s\S]*?)<\\\/script>/.exec(template);
    expect(match, 'inline player script not found in template').toBeTruthy();
    expect(() => new Function(match![1])).not.toThrow();
  });
});
