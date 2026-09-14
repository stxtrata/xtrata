import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { describe, it, expect } from 'vitest';
const window: any = {};
vm.runInNewContext(
  readFileSync(
    new URL('../../../../xtrata-agent-one/wizard/music-player.js', import.meta.url),
    'utf8'
  ),
  { window }
);
const player = window.XtrataMusicPlayer;
const config = {
  audioBase64: 'YWJj',
  audioMimeType: 'audio/wav',
  metadata: {
    title: 'A song',
    artist: 'An artist',
    lyrics: 'Two lines\nOf lyrics',
    songwriters: 'Writer'
  }
};
describe('independent music player', () => {
  it('validates all appearance values and neutralises custom CSS', () => {
    const a = player.normalize({
      style: 'evil',
      accent: '#fff;display:none',
      font: 'url(evil)',
      showLyrics: 'false'
    });
    expect(a.style).toBe('classic');
    expect(a.accent).toBe('');
    expect(a.font).toBe('sans');
    expect(a.showLyrics).toBe(true);
    expect(player.normalize({ accent: '#aBc123', style: 'studio', showLyrics: false }).accent).toBe(
      '#abc123'
    );
  });
  it('safely embeds user text and rejects attribute injection in assets', () => {
    const html = player.build({
      ...config,
      metadata: { title: '</script><img src=x onerror=alert(1)>' }
    });
    expect(html).not.toContain('<img src=x');
    expect(html).toContain('\\u003c/script');
    expect(() => player.build({ ...config, audioBase64: '" onload="bad' })).toThrow(
      'Invalid embedded'
    );
  });
  it('records the selected appearance and omits unused panels', () => {
    const html = player.build({
      ...config,
      appearance: { style: 'sleeve', showLyrics: false, showCredits: false }
    });
    expect(html).toContain('data-style="sleeve"');
    expect(html).toContain('xtrata-music-player-v1');
    expect(html).not.toContain('<dialog');
    expect(html).not.toContain('<svg');
    expect(html).toContain('Two lines'); // Metadata remains intact when presentation is hidden.
  });
  it('embeds only validated bounded waveform peaks with no listener-side decoding', () => {
    const html = player.build({
      ...config,
      appearance: { timeline: 'waveform' },
      peaks: [Infinity, NaN, -5, 1000, 50]
    });
    expect(html).toContain('<svg');
    expect(html).not.toContain('height="1000"');
    expect(html).not.toContain('decodeAudioData');
    expect(html).not.toContain('fetch(');
    expect(html).not.toContain('src="https:');
  });
  it('chooses contrasting button text and emits parsable standalone code', () => {
    expect(player.contrastInk('#ffffff')).toBe('#000000');
    expect(player.contrastInk('#000000')).toBe('#ffffff');
    const html = player.build(config),
      script = html.match(/<script>([\s\S]*?)<\/script>/)![1];
    expect(() => new Function(script)).not.toThrow();
    expect(Buffer.byteLength(html)).toBeLessThan(24000);
  });
});
