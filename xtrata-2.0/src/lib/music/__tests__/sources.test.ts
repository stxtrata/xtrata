import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import { chunkBytes, computeExpectedHash } from '../../chunking/hash';
import { audioMime, webmAudioOnly } from '../../radio/song-sources.mjs';

// music-sources.js is a plain browser script. It runs in this realm (not a vm context) so
// Uint8Array / Response / crypto are the same objects the code under test sees.
const win: any = {};
new Function(
  'window',
  readFileSync(
    new URL('../../../../xtrata-agent-one/wizard/music-sources.js', import.meta.url),
    'utf8'
  )
)(win);
const S = win.XtrataMusicSources;

const ascii = (s: string) => [...s].map((c) => c.charCodeAt(0));
const pad = (parts: number[], to = 64) =>
  Uint8Array.from([...parts, ...Array(Math.max(0, to - parts.length)).fill(0)]);
const noise = (n: number) => {
  const out = new Uint8Array(n);
  let x = 12345;
  for (let i = 0; i < n; i++) {
    x = (x * 1103515245 + 12345) & 0x7fffffff;
    out[i] = x >> 16;
  }
  return out;
};
const hex = (u: Uint8Array) => Array.from(u, (b) => b.toString(16).padStart(2, '0')).join('');

const heads = {
  mp3: pad([...ascii('ID3'), 3, 0, 0, 0, 0, 0, 0]),
  ogg: pad(ascii('OggS')),
  flac: pad(ascii('fLaC')),
  wav: pad([...ascii('RIFF'), 0, 0, 0, 0, ...ascii('WAVE')]),
  m4a: pad([0, 0, 0, 0x20, ...ascii('ftypM4A ')]),
  webmOpus: pad([0x1a, 0x45, 0xdf, 0xa3, 0x86, 0x86, ...ascii('A_OPUS')]),
  webmVideo: pad([
    0x1a,
    0x45,
    0xdf,
    0xa3,
    0x86,
    0x85,
    ...ascii('V_VP9'),
    0x86,
    0x86,
    ...ascii('A_OPUS')
  ]),
  text: pad(ascii('hello world, not audio'))
};
const images = {
  png: pad([0x89, ...ascii('PNG'), 0x0d, 0x0a, 0x1a, 0x0a]),
  jpeg: pad([0xff, 0xd8, 0xff, 0xe0]),
  webp: pad([...ascii('RIFF'), 0, 0, 0, 0, ...ascii('WEBP')]),
  gif: pad(ascii('GIF89a')),
  avif: pad([0, 0, 0, 0x1c, ...ascii('ftypavif')]),
  svg: pad(ascii('<svg xmlns="http://www.w3.org/2000/svg"></svg>'))
};

describe('parseId', () => {
  it('accepts plain and #-prefixed inscription numbers only', () => {
    expect(S.parseId('8')).toBe('8');
    expect(S.parseId(' #134 ')).toBe('134');
    expect(S.parseId(319)).toBe('319');
    for (const bad of [
      '',
      '0',
      '08',
      '-1',
      '1.5',
      '8x',
      '8,9',
      '1234567890',
      'abc',
      null,
      undefined,
      '8/../9'
    ])
      expect(S.parseId(bad as any)).toBe('');
  });
});

describe('type sniffing', () => {
  it('recognises each audio family and rejects non-audio and video WebM', () => {
    expect(S.sniffAudio(heads.mp3)).toBe('audio/mpeg');
    expect(S.sniffAudio(heads.ogg)).toBe('audio/ogg');
    expect(S.sniffAudio(heads.flac)).toBe('audio/flac');
    expect(S.sniffAudio(heads.wav)).toBe('audio/wav');
    expect(S.sniffAudio(heads.m4a)).toBe('audio/mp4');
    expect(S.sniffAudio(heads.webmOpus)).toBe('audio/webm');
    expect(S.sniffAudio(heads.webmVideo)).toBe('');
    expect(S.sniffAudio(heads.text)).toBe('');
    expect(S.sniffAudio(new Uint8Array(2))).toBe('');
  });
  it('agrees with the radio on every audio signature', () => {
    for (const [name, head] of Object.entries(heads)) {
      const radio = name.startsWith('webm')
        ? webmAudioOnly(head)
          ? audioMime(head)
          : ''
        : audioMime(head);
      expect(S.sniffAudio(head), name).toBe(radio);
    }
  });
  it('recognises raster images and never SVG', () => {
    expect(S.sniffImage(images.png)).toBe('image/png');
    expect(S.sniffImage(images.jpeg)).toBe('image/jpeg');
    expect(S.sniffImage(images.webp)).toBe('image/webp');
    expect(S.sniffImage(images.gif)).toBe('image/gif');
    expect(S.sniffImage(images.avif)).toBe('image/avif');
    expect(S.sniffImage(images.svg)).toBe('');
    expect(S.sniffImage(heads.mp3)).toBe('');
  });
});

describe('final hash', () => {
  it('matches the protocol running hash for every chunk boundary', async () => {
    for (const size of [1, 16383, 16384, 16385, 40000, 100000]) {
      const data = noise(size);
      expect(await S.finalHashHex(data), String(size)).toBe(
        hex(computeExpectedHash(chunkBytes(data)))
      );
    }
  });
});

const respond = (body: Uint8Array | string, headers: Record<string, string> = {}, status = 200) =>
  new Response(body as any, { status, headers });
const fetching = (r: Response | Error) => {
  const calls: string[] = [];
  const fn = async (url: string) => {
    calls.push(url);
    if (r instanceof Error) throw r;
    return r.clone();
  };
  return { fn, calls };
};
const withHash = async (data: Uint8Array, headers: Record<string, string>) => ({
  'x-xtrata-runtime-final-hash': await S.finalHashHex(data),
  'x-xtrata-runtime-network': 'mainnet',
  ...headers
});

describe('inspect: audio', () => {
  it('accepts a plain audio inscription and verifies its hash', async () => {
    const data = Uint8Array.from([...heads.mp3, ...noise(5000)]);
    const { fn, calls } = fetching(
      respond(data, await withHash(data, { 'content-type': 'audio/mpeg' }))
    );
    const r = await S.inspect('audio', '#8', { fetch: fn, base: '' });
    expect(r.ok).toBe(true);
    expect(r.id).toBe('8');
    expect(r.url).toBe('https://xtrata.xyz/inscription/8');
    expect(r.mime).toBe('audio/mpeg');
    expect(r.hashChecked).toBe(true);
    expect(r.finalHash).toMatch(/^[0-9a-f]{64}$/);
    expect(calls).toEqual(['/inscription/8']);
  });
  it('reads from the canonical origin when asked to', async () => {
    const data = Uint8Array.from([...heads.ogg, ...noise(100)]);
    const { fn, calls } = fetching(
      respond(data, await withHash(data, { 'content-type': 'audio/ogg' }))
    );
    await S.inspect('audio', '8', { fetch: fn, base: 'https://xtrata.xyz' });
    expect(calls).toEqual(['https://xtrata.xyz/inscription/8']);
  });
  it('accepts audio-only WebM minted as video/webm, as the radio does', async () => {
    const data = Uint8Array.from([...heads.webmOpus, ...noise(2000)]);
    const { fn } = fetching(respond(data, await withHash(data, { 'content-type': 'video/webm' })));
    const r = await S.inspect('audio', '8', { fetch: fn });
    expect(r.ok).toBe(true);
    expect(r.mime).toBe('audio/webm; codecs=opus');
  });
  it('refuses a real video, an HTML player, other types, and bytes that are not audio', async () => {
    const video = Uint8Array.from([...heads.webmVideo, ...noise(500)]);
    let r = await S.inspect('audio', '8', {
      fetch: fetching(respond(video, await withHash(video, { 'content-type': 'video/webm' }))).fn
    });
    expect(r).toMatchObject({ ok: false, reason: 'wrong-type' });

    r = await S.inspect('audio', '319', {
      fetch: fetching(respond('<!doctype html><audio></audio>', { 'content-type': 'text/html' })).fn
    });
    expect(r).toMatchObject({ ok: false, reason: 'wrong-type' });
    expect(r.message).toMatch(/HTML player/);

    r = await S.inspect('audio', '5', {
      fetch: fetching(respond('{}', { 'content-type': 'application/json' })).fn
    });
    expect(r).toMatchObject({ ok: false, reason: 'wrong-type' });

    const liar = Uint8Array.from([...heads.text, ...noise(200)]);
    r = await S.inspect('audio', '5', {
      fetch: fetching(respond(liar, await withHash(liar, { 'content-type': 'audio/mpeg' }))).fn
    });
    expect(r).toMatchObject({ ok: false, reason: 'wrong-type' });
  });
});

describe('inspect: images', () => {
  it('accepts raster images whose bytes match their label', async () => {
    for (const [name, head] of Object.entries(images)) {
      if (name === 'svg') continue;
      const data = Uint8Array.from([...head, ...noise(300)]);
      const { fn } = fetching(
        respond(data, await withHash(data, { 'content-type': `image/${name}` }))
      );
      const r = await S.inspect('image', '134', { fetch: fn });
      expect(r.ok, name).toBe(true);
      expect(r.mime).toBe(`image/${name}`);
    }
  });
  it('refuses SVG, mislabelled bytes and non-images', async () => {
    let r = await S.inspect('image', '9', {
      fetch: fetching(respond(images.svg, { 'content-type': 'image/svg+xml' })).fn
    });
    expect(r).toMatchObject({ ok: false, reason: 'wrong-type' });
    expect(r.message).toMatch(/SVG/);

    const jpeg = Uint8Array.from([...images.jpeg, ...noise(300)]);
    r = await S.inspect('image', '9', {
      fetch: fetching(respond(jpeg, await withHash(jpeg, { 'content-type': 'image/png' }))).fn
    });
    expect(r).toMatchObject({ ok: false, reason: 'wrong-type' });

    r = await S.inspect('image', '9', {
      fetch: fetching(respond(heads.mp3, { 'content-type': 'audio/mpeg' })).fn
    });
    expect(r).toMatchObject({ ok: false, reason: 'wrong-type' });
  });
});

describe('inspect: failures are reported as what they are', () => {
  it('separates "not found" from "could not check"', async () => {
    expect(
      await S.inspect('audio', '8', { fetch: fetching(respond('', {}, 404)).fn })
    ).toMatchObject({
      reason: 'not-found'
    });
    expect(
      await S.inspect('audio', '8', { fetch: fetching(respond('', {}, 410)).fn })
    ).toMatchObject({
      reason: 'not-found'
    });
    for (const status of [429, 500, 502, 503]) {
      const r = await S.inspect('audio', '8', { fetch: fetching(respond('', {}, status)).fn });
      expect(r, String(status)).toMatchObject({ ok: false, reason: 'unavailable' });
      expect(r.message).not.toMatch(/No inscription/);
    }
    const down = await S.inspect('audio', '8', { fetch: fetching(new Error('offline')).fn });
    expect(down).toMatchObject({ ok: false, reason: 'unavailable' });
  });
  it('rejects bad numbers without making a request', async () => {
    const { fn, calls } = fetching(respond(''));
    expect(await S.inspect('audio', 'abc', { fetch: fn })).toMatchObject({
      ok: false,
      reason: 'invalid-id'
    });
    expect(await S.inspect('video', '8', { fetch: fn })).toMatchObject({
      ok: false,
      reason: 'invalid-kind'
    });
    expect(calls).toEqual([]);
  });
  it('refuses bytes that do not match the hash the route reports', async () => {
    const data = Uint8Array.from([...heads.mp3, ...noise(400)]);
    const { fn } = fetching(
      respond(data, {
        'content-type': 'audio/mpeg',
        'x-xtrata-runtime-final-hash': '0'.repeat(64)
      })
    );
    expect(await S.inspect('audio', '8', { fetch: fn })).toMatchObject({
      ok: false,
      reason: 'mismatch'
    });
  });
  it('proceeds with a visible warning when the route reports no hash', async () => {
    const data = Uint8Array.from([...heads.mp3, ...noise(400)]);
    const r = await S.inspect('audio', '8', {
      fetch: fetching(respond(data, { 'content-type': 'audio/mpeg' })).fn
    });
    expect(r.ok).toBe(true);
    expect(r.hashChecked).toBe(false);
    expect(r.warnings.join(' ')).toMatch(/hash/);
  });
  it('refuses non-mainnet and oversized inscriptions', async () => {
    expect(
      await S.inspect('audio', '8', {
        fetch: fetching(
          respond(heads.mp3, {
            'content-type': 'audio/mpeg',
            'x-xtrata-runtime-network': 'testnet'
          })
        ).fn
      })
    ).toMatchObject({ reason: 'wrong-network' });
    expect(
      await S.inspect('audio', '8', {
        fetch: fetching(
          respond(heads.mp3, {
            'content-type': 'audio/mpeg',
            'x-xtrata-runtime-total-size': String(S.MAX_BYTES + 1)
          })
        ).fn
      })
    ).toMatchObject({ reason: 'too-large' });
  });
});
