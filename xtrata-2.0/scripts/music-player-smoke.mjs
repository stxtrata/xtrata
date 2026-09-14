import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { strict as assert } from 'node:assert';
const source = await readFile(
  new URL('../xtrata-agent-one/wizard/music-player.js', import.meta.url),
  'utf8'
);
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(source, sandbox);
const b = await chromium.launch({ headless: true, channel: 'chrome' });
const p = await b.newPage();
const errors = [];
p.on('pageerror', (e) => errors.push(e.message));
const wav = Buffer.alloc(44 + 8000 * 2 * 10);
wav.write('RIFF');
wav.writeUInt32LE(wav.length - 8, 4);
wav.write('WAVEfmt ', 8);
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20);
wav.writeUInt16LE(1, 22);
wav.writeUInt32LE(8000, 24);
wav.writeUInt32LE(16000, 28);
wav.writeUInt16LE(2, 32);
wav.writeUInt16LE(16, 34);
wav.write('data', 36);
wav.writeUInt32LE(wav.length - 44, 40);
try {
  const artwork = await p.evaluate(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 512;
    const x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, 512, 512);
    g.addColorStop(0, '#c86d42');
    g.addColorStop(1, '#1b293e');
    x.fillStyle = g;
    x.fillRect(0, 0, 512, 512);
    x.fillStyle = '#f5ebd5';
    x.beginPath();
    x.arc(256, 230, 105, 0, Math.PI * 2);
    x.fill();
    x.font = '25px sans-serif';
    x.fillText('AFTER HOURS', 160, 420);
    return c.toDataURL('image/png').split(',')[1];
  });
  for (const withArtwork of [false, true])
    for (const style of ['classic', 'sleeve', 'studio'])
      for (const width of [160, 200, 280, 390, 492, 760]) {
        await p.setViewportSize({ width, height: width });
        const html = sandbox.window.XtrataMusicPlayer.build({
          imageBase64: withArtwork ? artwork : null,
          imageMimeType: 'image/png',
          audioBase64: wav.toString('base64'),
          audioMimeType: 'audio/wav',
          metadata: {
            title: 'The Light Between Buildings',
            artist: 'Mara Ellis',
            album: 'After Hours',
            lyrics: 'A light above the station\nA song beneath the rain',
            songwriters: 'Mara Ellis'
          },
          appearance: {
            style,
            palette: style === 'classic' ? 'paper' : 'charcoal',
            timeline: 'waveform',
            font: style === 'classic' ? 'serif' : 'sans'
          },
          peaks: Array.from({ length: 160 }, (_, i) => Math.abs(Math.sin(i * 0.3)) * 90)
        });
        await p.setContent(html);
        await p.waitForFunction(() => Number.isFinite(document.querySelector('audio').duration));
        const bounds = await p.evaluate(() => {
          const r = document.querySelector('#xtrataPlayer').getBoundingClientRect();
          return [
            ...document.querySelectorAll(
              '.body button,.body #playerStatus,.body .timeline,.body h1'
            )
          ]
            .filter((e) => e.getBoundingClientRect().width)
            .map((e) => ({
              id: e.id || e.tagName,
              inside:
                e.getBoundingClientRect().bottom <= r.bottom + 1 &&
                e.getBoundingClientRect().right <= r.right + 1
            }));
        });
        assert(
          bounds.every((r) => r.inside),
          JSON.stringify({ style, width, bounds })
        );
        await p.locator('#playToggleButton').click();
        await p.waitForFunction(() => !document.querySelector('audio').paused);
        await p.locator('#seekRange').focus();
        await p.keyboard.press('ArrowRight');
        assert(await p.evaluate(() => !document.querySelector('audio').paused));
        await p.locator('#playToggleButton').focus();
        await p.keyboard.press('Space');
        assert(await p.evaluate(() => document.querySelector('audio').paused));
        await p.locator('[data-open="detailsDialog"]').click();
        assert(await p.locator('#detailsDialog').isVisible());
        await p.keyboard.press('Escape');
        assert(!(await p.locator('#detailsDialog').isVisible()));
        await p.locator('[data-open="lyricsDialog"]').click();
        assert((await p.locator('#lyricsDialog').innerText()).includes('station'));
        await p.locator('#lyricsDialog [data-close]').click();
        await p.evaluate(() => document.querySelector('audio').dispatchEvent(new Event('error')));
        assert(
          await p.evaluate(
            () =>
              document.querySelector('#playerStatus').getBoundingClientRect().bottom <=
              document.querySelector('#xtrataPlayer').getBoundingClientRect().bottom + 1
          ),
          'Playback error must remain visible'
        );
        await p.evaluate(() => document.querySelector('audio').dispatchEvent(new Event('canplay')));
        if (width === 390) await p.screenshot({ path: '/tmp/music-player-' + style + '.png' });
      }
  assert.deepEqual(errors, []);
  console.log(
    'PASS: three styles with/without art at 160, 200, 280, 390, 492 and 760 px; playback, keyboard seek/pause, details, lyrics and bounds.'
  );
} finally {
  await b.close();
}
