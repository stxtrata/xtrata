import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { describe, expect, it } from 'vitest';

// The FLAC sample packs served as static web samples (public/audionaut/daw/media/packs)
// and the browser module that loads them. Written to run in Node with a fake Web Audio
// context, so every sound is fetched, verified and decoded exactly as the app does it.
const DAW = path.resolve(__dirname, '../../../public/audionaut/daw');
const MODULE = path.join(DAW, 'js/pack-library.js');
const sha = (b: Uint8Array) => crypto.createHash('sha256').update(b).digest('hex');

const load = async () => (await import(/* @vite-ignore */ MODULE)) as any;

// fetch() stand-in: maps the module-relative URL to the file on disk.
const diskFetch = (tamper?: (id: string, bytes: Buffer) => Buffer) =>
  (async (url: URL) => {
    const m = /media\/packs\/(\w+)\.audpack$/.exec(url.pathname);
    if (!m) return { ok: false, status: 404 };
    let bytes = fs.readFileSync(path.join(DAW, 'media/packs', `${m[1]}.audpack`));
    if (tamper) bytes = tamper(m[1], Buffer.from(bytes));
    return {
      ok: true,
      status: 200,
      arrayBuffer: async () => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
    };
  }) as any;

const fakeContext = () => ({
  createBuffer: (channels: number, length: number, sampleRate: number) => {
    const data = Array.from({ length: channels }, () => new Float32Array(length));
    return {
      length,
      sampleRate,
      numberOfChannels: channels,
      duration: length / sampleRate,
      copyToChannel: (src: Float32Array, ch: number) => data[ch].set(src),
      getChannelData: (ch: number) => data[ch]
    };
  }
});

describe('audionaut FLAC sample packs', () => {
  it('ships 22 packs with 2,438 sounds, each file matching the catalogue hash', async () => {
    const { PACKS } = await load();
    expect(PACKS).toHaveLength(22);
    expect(PACKS.reduce((n: number, p: any) => n + p.sounds.length, 0)).toBe(2438);
    for (const p of PACKS) {
      const bytes = fs.readFileSync(path.join(DAW, 'media/packs', `${p.id}.audpack`));
      expect(bytes.length, p.id).toBe(p.bytes);
      expect(sha(bytes), p.id).toBe(p.sha256);
    }
  });

  it('keeps licences honest: CC0 core, CC-BY attributed, Classic Machines flagged unverified', async () => {
    const { PACKS, packSoundNotice } = await load();
    const byId = Object.fromEntries(PACKS.map((p: any) => [p.id, p]));
    expect(byId.piano.spdx).toBe('CC0-1.0');
    expect(byId.pianoby.attribution).toBe(true);
    expect(byId.classic.tier).toBe('unverified');
    const first = (id: string) => `${id}/${byId[id].sounds[0][0]}`;
    expect(packSoundNotice(first('classic'))).toContain('UNVERIFIED');
    expect(packSoundNotice(first('pianoby'))).toContain('attribution required');
    expect(packSoundNotice(first('pianoby'))).toMatch(/credit: .+/);
    expect(packSoundNotice(first('piano'))).toContain('CC0-1.0');
    // A CC-BY pack can mix 3.0 and 4.0 sounds: the notice follows the sound, not the pack.
    const notices = new Set(byId.pianoby.sounds.map((s: any[]) => packSoundNotice(`pianoby/${s[0]}`).split(' · ')[0]));
    expect([...notices].sort()).toEqual(['CC-BY-3.0', 'CC-BY-4.0']);
  });

  it('loads, verifies and decodes every sound in every pack', async () => {
    const { PACKS, loadPackAudio, clearPackCache } = await load();
    const fetcher = diskFetch();
    const ctx = fakeContext();
    let n = 0;
    for (const p of PACKS) {
      clearPackCache();
      for (const s of p.sounds) {
        const r = await loadPackAudio({ type: 'pack', value: `${p.id}/${s[0]}` }, ctx, { fetcher });
        expect(r.verified, `${p.id}/${s[0]}`).toBe(true);
        expect(r.audioBuffer.length).toBe(s[6]);
        expect(r.audioBuffer.sampleRate).toBe(44100);
        expect(r.rootMidi).toBe(s[2]);
        expect(r.source).toMatchObject({ type: 'pack', value: `${p.id}/${s[0]}` });
        expect(r.source.audioSha256).toMatch(/^[a-f0-9]{64}$/);
        n++;
      }
    }
    expect(n).toBe(2438);
  }, 300_000);

  it('refuses a pack whose bytes were altered', async () => {
    const { PACKS, loadPackAudio, clearPackCache } = await load();
    clearPackCache();
    const p = PACKS.find((x: any) => x.id === 'guitars');
    const fetcher = diskFetch((_, b) => {
      b[b.length - 100] ^= 0xff;
      return b;
    });
    await expect(
      loadPackAudio({ type: 'pack', value: `guitars/${p.sounds[0][0]}` }, fakeContext(), { fetcher })
    ).rejects.toThrow(/integrity/);
  });

  it('refuses a saved sample whose hash no longer matches, and unknown packs or sounds', async () => {
    const { PACKS, loadPackAudio, clearPackCache } = await load();
    clearPackCache();
    const fetcher = diskFetch();
    const p = PACKS.find((x: any) => x.id === 'bass');
    await expect(
      loadPackAudio(
        { type: 'pack', value: `bass/${p.sounds[0][0]}`, audioSha256: '0'.repeat(64) },
        fakeContext(),
        { fetcher }
      )
    ).rejects.toThrow(/differs/);
    await expect(
      loadPackAudio({ type: 'pack', value: 'nope/x@1@1' }, fakeContext(), { fetcher })
    ).rejects.toThrow(/Unknown sample pack/);
    await expect(
      loadPackAudio({ type: 'pack', value: 'bass/not-a-sound@1@1' }, fakeContext(), { fetcher })
    ).rejects.toThrow(/not in its sample pack/);
  });

  it('is wired into the Library tab as one category per pack', async () => {
    const lib = (await import(/* @vite-ignore */ path.join(DAW, 'js/library.js'))) as any;
    const cats = lib.SAMPLE_LIBRARY.filter((c: any) => c.pack);
    expect(cats).toHaveLength(22);
    expect(cats.reduce((n: number, c: any) => n + c.items.length, 0)).toBe(2438);
    expect(cats.every((c: any) => c.items.every((i: any) => i.type === 'pack'))).toBe(true);
  });
});
