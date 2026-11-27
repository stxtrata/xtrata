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

describe('GIF artwork', () => {
  const gif =
    'R0lGODlhBAAEAIEAAP8AAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQACgAAACwAAAAABAAEAAAICQABCBxIsCCAgAAh+QQBCgABACwAAAAABAAEAIEAAP8AAAAAAAAAAAAICQABCBxIsCCAgAA7';
  it('embeds an uploaded GIF as the cover, unchanged, and records its type', () => {
    const html = player.build({ ...config, imageBase64: gif, imageMimeType: 'image/gif' });
    expect(html).toContain(`<img id="coverArt" src="data:image/gif;base64,${gif}"`);
    expect(html).toContain('"visualMimeType":"image/gif"');
  });
  it('still refuses embedded image types it does not know', () => {
    const html = player.build({ ...config, imageBase64: gif, imageMimeType: 'image/svg+xml' });
    expect(html).not.toContain('id="coverArt"');
  });
});

describe('player extras (v2)', () => {
  const fxScript = (html: string) => (html.match(/<script>\(function\(\)\{var A=[\s\S]*?<\/script>/) || [''])[0];
  it('leaves a player with no extras exactly as v1, with no extras code', () => {
    const html = player.build({ ...config, appearance: { style: 'studio', timeline: 'waveform' }, peaks: [10, 90] });
    expect(html).toContain('data-xtrata-template="xtrata-music-player-v1"');
    expect(fxScript(html)).toBe('');
    expect(html).not.toContain('class="viz"');
    expect(html).not.toMatch(/"(backdrop|visualiser|cues|coverColors)":/);
  });
  it('cleans every extra and stores only the ones switched on', () => {
    const a = player.normalize({
      backdrop: 'url(evil)',
      visualiser: 'bars',
      fullArt: 'yes',
      note: 'line\u0000one'.padEnd(400, 'x'),
      cues: [{ t: 30, label: 'Drop' }, { t: -1, label: 'bad' }, { t: 5, label: '' }, { t: 'x', label: 'NaN' }],
      coverColors: { page: '#000000', ink: '#ffffff', muted: '#888888', accent: 'red' }
    });
    expect(a.backdrop).toBe('solid');
    expect(a.visualiser).toBe('bars');
    expect(a.fullArt).toBe(false);
    expect(a.note.length).toBe(200);
    expect(a.note).not.toContain('\u0000');
    expect(a.cues).toEqual([{ t: 30, label: 'Drop' }]);
    expect(a.coverColors).toBe(null);
    const stored = player.compact(a);
    expect(Object.keys(stored)).toEqual([...Object.keys(player.defaults), 'visualiser', 'note', 'cues']);
  });
  it('writes in only the code for the extras that are on, and it parses', () => {
    const env = 'AAgg//gA'.repeat(10);
    const on = player.build({ ...config, envelope: env, appearance: { style: 'vinyl', visualiser: 'bars', fullArt: true, repeat: true, stamp: true } });
    expect(on).toContain('xtrata-music-player-v2');
    const fx = fxScript(on);
    for (const name of ['fxState', 'fxFull', 'fxRepeat', 'fxViz', 'fxStamp', 'fxKeys']) expect(fx).toContain(name);
    for (const name of ['fxLyrics', 'fxCues', 'fxGif', 'fxBackdrop', 'fxWave']) expect(fx).not.toContain(name);
    expect(() => new Function(fx.replace(/^<script>|<\/script>$/g, ''))).not.toThrow();
    expect(fx).toContain(JSON.stringify(env));
    // No loudness track, no visualiser: nothing to drive it.
    const none = player.build({ ...config, appearance: { visualiser: 'bars' } });
    expect(none).not.toContain('class="viz"');
    expect(fxScript(none)).not.toContain('fxViz');
    expect(() => player.build({ ...config, envelope: '"</script>', appearance: { visualiser: 'bars' } })).not.toThrow();
    expect(player.build({ ...config, envelope: '"</script>', appearance: { visualiser: 'bars' } })).not.toContain('class="viz"');
  });
  it('syncs timed lyrics and shows the words without their timestamps', () => {
    const lyrics = '[ar:Someone]\n[00:01.50] First line\n[00:04.00][01:10.00] Chorus <b>';
    expect(player.syncedLines(lyrics).map((l: any) => l.t)).toEqual([1.5, 4, 70]);
    const html = player.build({ ...config, metadata: { ...config.metadata, lyrics } });
    expect(html).toContain('xtrata-music-player-v2');
    expect(html).toContain('<p data-t="1.5">First line</p>');
    expect(html).toContain('Chorus &lt;b&gt;');
    expect(fxScript(html)).toContain('fxLyrics');
    expect(player.versionFor({}, 'plain words\nno times')).toBe('xtrata-music-player-v1');
    expect(player.versionFor({}, lyrics)).toBe('xtrata-music-player-v2');
  });
  it('keeps what the radio reads: the audio source and the cover as the first image', () => {
    const png = 'iVBORw0KGgo=';
    for (const style of ['vinyl', 'poster']) {
      const html = player.build({ ...config, imageBase64: png, imageMimeType: 'image/png', appearance: { style, backdrop: 'blur', signature: '<i>me</i>', stamp: true } });
      expect(html).toMatch(/<source[^>]+src="data:audio\/wav;base64,YWJj"/);
      expect(html.match(/<img\b[^>]*\bsrc=["']([^"']+)["']/)![1]).toBe('data:image/png;base64,' + png);
      expect((html.match(/<img\b/g) || []).length).toBe(1);
      expect(html).toContain('&lt;i&gt;me&lt;/i&gt;');
    }
    const linked = player.build({ ...config, audioBase64: '', audioMimeType: 'audio/mpeg', audioInscription: { id: 8 }, appearance: { style: 'poster' } });
    expect(linked).toContain('<source src="https://xtrata.xyz/inscription/8"');
  });
  it('falls back to the default palette when "From the cover" has no colours', () => {
    const html = player.build({ ...config, appearance: { palette: 'cover' } });
    expect(html).toContain('--page:#151918');
    const coloured = player.build({ ...config, appearance: { palette: 'cover', coverColors: { page: '#101010', ink: '#fafafa', muted: '#aaaaaa', accent: '#ff8800' } } });
    expect(coloured).toContain('--accent:#ff8800');
    expect(coloured).toContain('xtrata-music-player-v2');
  });
  it('stays small with every extra on', () => {
    const html = player.build({
      ...config,
      peaks: Array.from({ length: 160 }, (_, i) => i % 100),
      envelope: 'A'.repeat(2400),
      appearance: { style: 'poster', timeline: 'waveform', waveStyle: 'mirror', visualiser: 'ring', motion: 'zoom', backdrop: 'grain', fullArt: true, repeat: true, stamp: true, note: 'A note', signature: 'Me', cues: [{ t: 5, label: 'Drop' }], button: 'pill', lyricsView: 'overlay' }
    });
    expect(Buffer.byteLength(html)).toBeLessThan(40000);
  });
});

describe('timeline and finishing options', () => {
  const peaks = Array.from({ length: 160 }, (_, i) => (i * 7) % 100);
  const count = (html: string, s: string) => html.split(s).length - 1;
  it('moves the one timeline where it is asked for, keeping a single seek control', () => {
    const at = (wavePos: string) => player.build({ ...config, peaks, appearance: { timeline: 'waveform', wavePos } });
    const inline = at('inline'), below = at('below'), edge = at('edge'), cover = at('cover');
    expect(inline).toContain('xtrata-music-player-v1');
    for (const html of [inline, below, edge, cover]) {
      expect(count(html, 'id="timeline"')).toBe(1);
      expect(count(html, 'id="seekRange"')).toBe(1);
      expect(count(html, 'id="currentTime"')).toBe(1);
    }
    expect(below.indexOf('id="timeline"')).toBeGreaterThan(below.indexOf('id="playToggleButton"'));
    expect(edge).toMatch(/<\/div><div class="timeline tl-edge" id="timeline">[\s\S]*<audio/);
    expect(cover).toMatch(/<div class="art">[\s\S]*class="timeline tl-cover"[\s\S]*<div class="body">/);
    // Studio's small cover cannot hold a timeline, so it goes along the edge instead.
    expect(player.build({ ...config, peaks, appearance: { style: 'studio', timeline: 'waveform', wavePos: 'cover' } })).toContain('tl-edge');
  });
  it('colours the played and unplayed parts, for waveforms and the plain bar', () => {
    const wave = player.build({ ...config, peaks, appearance: { timeline: 'waveform', waveColor: '#FF0000', waveBase: '#00ff00' } });
    expect(wave).toContain('--wave-on:#ff0000;--wave-off:#00ff00');
    expect(wave).toContain('stop-color:var(--wave-on)');
    expect(wave).toContain('fxWave');
    const bar = player.build({ ...config, appearance: { waveColor: '#123456' } });
    expect(bar).toContain('.rail:after{background:var(--wave-on)}');
    expect(player.normalize({ waveColor: 'red;}', vizColor: '#ABCDEF' })).toMatchObject({ waveColor: '', vizColor: '#abcdef' });
  });
  it('draws the needle and block waveforms compactly', () => {
    const needles = player.build({ ...config, peaks, appearance: { timeline: 'waveform', waveStyle: 'needles' } });
    const blocks = player.build({ ...config, peaks, appearance: { timeline: 'waveform', waveStyle: 'blocks' } });
    expect(needles).toMatch(/<svg class="wv"[^>]*>.*<path d="M/);
    expect(count(blocks, '<rect')).toBe(40);
  });
  it('puts visualiser bars along the bottom edge when asked, in the chosen colour', () => {
    const html = player.build({ ...config, envelope: 'AAgg', appearance: { visualiser: 'bars', vizPos: 'edge', vizColor: '#ff00aa' } });
    expect(html).toContain('<div class="viz edge"');
    expect(html).not.toMatch(/<div class="art">[^]*?<div class="viz"[^]*?<div class="body">/);
    expect(html).toContain('.viz i{background:#ff00aa}');
  });
  it('marks text, title, glow and the rounded font as v2 only when used', () => {
    expect(player.versionFor({ align: 'center' }, '')).toBe('xtrata-music-player-v2');
    expect(player.versionFor({ font: 'rounded' }, '')).toBe('xtrata-music-player-v2');
    const html = player.build({ ...config, appearance: { align: 'center', titleSize: 'large', artGlow: true, font: 'rounded' } });
    expect(html).toContain('.identity{text-align:center}');
    expect(html).toContain('ui-rounded');
    expect(html).toContain('drop-shadow');
    expect(Object.keys(player.compact({ visualiser: 'off', vizPos: 'edge', vizColor: '#ffffff' }))).not.toContain('vizPos');
  });
});
