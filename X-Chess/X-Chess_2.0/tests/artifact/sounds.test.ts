// The sounds are SYNTHESISED, and this is what stops them being recorded.
//
// Every byte of this application is inscribed permanently. One short WAV,
// base64ed into the page, costs twenty to fifty kilobytes; a dozen of them
// would be several times the size of the chess engine, the replay, the wallet
// handling and the whole interface put together. So each sound is a handful of
// oscillators built from a table of numbers at play time.
//
// The obvious "improvement" - drop in some nice recorded samples - would be
// unnoticeable in review, unnoticeable in development, and permanent. These
// fail loudly if anybody tries it.

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { build } from 'esbuild';
import { SOUND_EVENTS, VOICES } from '../../packages/ui/sounds.js';

const HTML = readFileSync('dist/xchess.html', 'utf8');

/**
 * What the sound module is allowed to weigh, minified, in the bundle.
 *
 * Thirteen sounds, a synthesiser, thirteen switches with a volume each, storage
 * and a generated panel. Set with headroom for a few more voices and not for a
 * change of approach: a single recorded sample would blow it on its own, which
 * is exactly what it is for.
 */
const BUDGET = 12_000;

describe('the built artefact', () => {
  it('carries no recorded audio of any kind', () => {
    // Each of these is a different way of smuggling a sample into a permanent
    // page, and the point is that none of them is available.
    expect(HTML, 'an audio data URI is in the artefact').not.toMatch(/data:audio/i);
    expect(HTML, 'an audio element is in the artefact').not.toMatch(/<audio[\s>]/i);
    expect(HTML).not.toMatch(/\.(wav|mp3|ogg|m4a|flac|aac)\b/i);
    expect(HTML, 'a decoder means there is something to decode').not.toContain('decodeAudioData');
  });

  it('fetches nothing to make a sound', () => {
    // An inscription cannot fetch anything, so a sound that needed a request
    // would simply never play - and would fail nowhere but on chain.
    expect(HTML).not.toContain('new Audio(');
    expect(HTML).not.toMatch(/XMLHttpRequest[^;]{0,80}audio/i);
  });

  it('builds its sounds from oscillators, in the shipped bytes', () => {
    for (const call of ['createOscillator', 'createGain', 'createBufferSource', 'createBiquadFilter']) {
      expect(HTML, `${call} did not survive the build`).toContain(call);
    }
    // Both spellings of the context, because the prefixed one is still the only
    // one on older iOS - a large share of the people this sound is for.
    expect(HTML).toContain('AudioContext');
    expect(HTML).toContain('webkitAudioContext');
  });

  it('carries the numbers that ARE the sounds', () => {
    // The table is the library. If these did not survive, the module shipped
    // with a synthesiser and nothing to play.
    const distinctive = [
      VOICES['your-turn'].layers[0].from,
      VOICES.win.layers[0].from,
      VOICES.capture.layers[1].from,
      VOICES.check.layers[0].from
    ];
    for (const hz of distinctive) {
      expect(HTML, `${hz}Hz did not survive the build`).toContain(String(hz));
    }
  });

  it('ships the controls, so nothing here is unswitchable', () => {
    // A sound with no off switch in a page that cannot be corrected is the one
    // outcome worth failing a build over.
    for (const id of ['sound-toggle', 'sound-master', 'sound-volume', 'sound-background', 'sound-list']) {
      expect(HTML, `#${id} is missing from the artefact`).toContain(id);
    }
    // And the rows are generated from the table, so every sound gets one.
    for (const name of SOUND_EVENTS) {
      expect(HTML, `${name} has no label in the artefact`).toContain(VOICES[name].label);
    }
  });

  it('keeps the whole module inside its byte budget', async () => {
    // Measured rather than asserted about the page total, which moves for
    // reasons that have nothing to do with sound.
    const result = await build({
      entryPoints: ['apps/chess/main.ts'],
      bundle: true,
      format: 'iife',
      platform: 'browser',
      target: ['es2022'],
      minify: true,
      write: false,
      legalComments: 'none',
      metafile: true,
      define: { __XCHESS_BUILD__: '"measuring"' }
    });

    const inputs = Object.values(result.metafile.outputs)[0].inputs;
    const mine = ['packages/ui/sounds.ts', 'packages/ui/audio.ts', 'packages/ui/sound-panel.ts'];
    let bytes = 0;
    for (const path of mine) {
      const one = inputs[path]?.bytesInOutput ?? 0;
      expect(one, `${path} contributed nothing, so it is not in the bundle`).toBeGreaterThan(0);
      bytes += one;
    }
    expect(bytes, `the sound module is ${bytes} bytes, budget ${BUDGET}`).toBeLessThan(BUDGET);
  });
});
