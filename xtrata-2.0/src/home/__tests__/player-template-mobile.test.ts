/**
 * Guards on the inscribed audio player template, so a future edit cannot ship a
 * player that behaves on a laptop and not on a phone.
 *
 * These matter more than most tests here because the template is INSCRIBED. Once a
 * player is on chain it is permanent, so a regression cannot be patched afterwards —
 * every inscription made while it was broken stays broken forever.
 *
 * The bug they exist to prevent, shipped on 2026-07-03 in a6e49511 and found on
 * inscription #2883:
 *
 *   The player auto-hid its controls two seconds after the last pointer event, and
 *   hid them IMMEDIATELY on pointerleave. That is a mouse idea. It works because a
 *   mouse emits a continuous pointermove stream that keeps waking the controls, and
 *   because a cursor can rest over the artwork without touching it.
 *
 *   A finger does neither. It emits one pointerdown and then nothing, and pointerleave
 *   fires the instant it lifts. So on a phone every tap was followed at once by the
 *   controls hiding again, and the next tap landed on something fading out from under
 *   it. Playing a track took roughly twenty taps and the player appeared to flash.
 *
 * Proof it was this and not file size or memory: #1117 is 7.64 MB and plays fine;
 * #2883 is 6.82 MB and did not. The larger file works. The difference is that #1117
 * predates the commit that added these timers.
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

describe('inscribed audio player: controls must survive a finger', () => {
  it('decides once whether the device can hover', () => {
    expect(template).toContain("window.matchMedia('(hover: hover)').matches");
    expect(template).toMatch(/const CAN_HOVER =/);
  });

  it('never starts an auto-hide timer on a device that cannot hover', () => {
    // Both timers must be gated. Either one left ungated still takes the controls away.
    expect(template).toContain('if (CAN_HOVER) {\n          hoverHideTimer = window.setTimeout(hideHoverTransport, HOVER_HIDE_DELAY_MS);');
    expect(template).toContain('if (CAN_HOVER) idleTimer = window.setTimeout(goIdle, IDLE_HIDE_DELAY_MS);');
  });

  it('never hides controls on pointerleave without hover', () => {
    // pointerleave fires the moment a finger lifts, so an ungated handler here hides
    // the controls on every single tap — the worst version of this bug.
    for (const marker of ["cover.addEventListener('pointerleave'", "player.addEventListener('pointerleave'"]) {
      const at = template.indexOf(marker);
      expect(at, `${marker} not found`).toBeGreaterThan(-1);
      // The nearest preceding gate must be a CAN_HOVER check.
      const before = template.slice(Math.max(0, at - 200), at);
      expect(before, `${marker} is not gated on CAN_HOVER`).toContain('if (CAN_HOVER)');
    }
  });

  it('still auto-hides for a mouse, so the desktop design is unchanged', () => {
    expect(template).toContain('HOVER_HIDE_DELAY_MS = 2000');
    expect(template).toContain('IDLE_HIDE_DELAY_MS = 2000');
  });

  it('coalesces resize redraws to one per frame', () => {
    // iOS fires resize continuously while scrolling as the URL bar hides and shows.
    // A raw handler here repainted the canvas throughout every scroll.
    expect(template).not.toContain("window.addEventListener('resize', drawHoverWave)");
    const at = template.indexOf("window.addEventListener('resize'");
    expect(template.slice(at, at + 260)).toContain('requestAnimationFrame');
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
