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

describe('inscribed audio player: the tap that asks for sound must make the sound', () => {
  /**
   * The SECOND mobile regression in this template, reported the same way as the first:
   * "#1117 and #1122 play with one click, the new ones need frantic tapping, like a
   * gate opens every now and then."
   *
   * A tap is the browser's permission to make sound, and it is only valid while the
   * handler is still on the stack. Two places threw it away:
   *
   *   1. toggleAudioPlayback returned early when the audio was not buffered yet,
   *      setting playWhenReady and letting a BUFFERING EVENT call play() later. No
   *      gesture in scope, so mobile refused it.
   *   2. Clicking the artwork deferred toggleAudioPlayback through a 300ms setTimeout
   *      to tell single clicks from double ones. A timer callback carries no gesture
   *      either, so tapping the cover — the obvious thing to do — could never work.
   *
   * The "gate" was isAudioReady: only a tap landing after buffering finished reached
   * play() synchronously. Hence the tapping, and hence older players being fine.
   */
  it('calls play() on the tap even when the audio is still buffering', () => {
    const fn = template.slice(template.indexOf('const toggleAudioPlayback'),
                              template.indexOf('const seekBy'));
    // No early return that skips the play() call.
    expect(fn).not.toMatch(/if \(!isAudioReady\) \{[\s\S]{0,140}return;/);
    expect(fn).toContain('audio.play()');
  });

  it('never starts playback from a buffering event', () => {
    // markAudioReady runs from progress/canplay handlers. A play() there is refused on
    // mobile AND races the one the tap already started.
    const fn = template.slice(template.indexOf('const markAudioReady'),
                              template.indexOf('const evaluateReadiness'));
    expect(fn).not.toContain('toggleAudioPlayback()');
  });

  it('plays the artwork tap immediately rather than on a timer', () => {
    expect(template).not.toContain('window.setTimeout(toggleAudioPlayback');
    const handler = template.slice(template.indexOf("cover.addEventListener('click'"),
                                   template.indexOf("cover.addEventListener('dblclick'"));
    expect(handler).toContain('toggleAudioPlayback();');
    // The double-click case is handled by undoing, not by delaying the first click.
    expect(handler).toContain('resetAudioToStart();');
  });

  it('never disables the play button while buffering', () => {
    // A disabled button cannot receive the tap that would authorise playback, so the
    // only control that still worked was unreachable exactly when it was needed.
    expect(template).not.toContain('playToggleButton.disabled = !isAudioReady');
  });
});

describe('inscribed audio player: controls must survive a finger', () => {
  /**
   * Round two. Gating the auto-hide timers on '(hover: hover)' was not enough: that
   * media query describes the DEVICE, and it reports true on iPadOS, on tablets in
   * desktop mode, and on any phone with a mouse or trackpad paired. On all of those the
   * controls went straight back to fading out from under a finger.
   *
   * pointerType on the actual event is ground truth — a touch says 'touch' whatever the
   * device claims it is capable of.
   */
  it('decides from the pointer actually in use, not from the device', () => {
    expect(template).not.toContain('CAN_HOVER');
    expect(template).toContain("event.pointerType === 'mouse'");
    expect(template).toContain("event.pointerType === 'touch'");
  });

  it('arms the auto-hide only once a mouse has been seen', () => {
    expect(template).toContain('if (usingMouse) {\n          hoverHideTimer = window.setTimeout(hideHoverTransport, HOVER_HIDE_DELAY_MS);');
    expect(template).toContain('if (usingMouse) idleTimer = window.setTimeout(goIdle, IDLE_HIDE_DELAY_MS);');
  });

  it('lets a touch disarm it again on a device that also has a mouse', () => {
    // Pairing a trackpad must not permanently condemn the phone to fading controls.
    expect(template).toContain("if (event && event.pointerType === 'touch') usingMouse = false;");
  });

  it('never hides on a pointerleave raised by a finger', () => {
    // pointerleave fires the moment a finger lifts, so acting on it hides the controls
    // on every single tap — the worst version of this bug.
    for (const marker of ["cover.addEventListener('pointerleave'", "player.addEventListener('pointerleave'"]) {
      const at = template.indexOf(marker);
      expect(at, `${marker} not found`).toBeGreaterThan(-1);
      const handler = template.slice(at, at + 260);
      expect(handler, `${marker} acts on a touch pointerleave`).toContain("event.pointerType === 'touch'");
    }
  });

  it('starts with the transport VISIBLE, not hidden', () => {
    // Hidden at init meant opacity:0 AND pointer-events:none — so on a phone there was
    // no play button, seek bar or waveform to aim at, only the artwork.
    expect(template).toContain("player.dataset.transport = 'visible';");
    expect(template).not.toMatch(/dataset\.transport = 'hidden';\s*\n\s*renderWaveform/);
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
