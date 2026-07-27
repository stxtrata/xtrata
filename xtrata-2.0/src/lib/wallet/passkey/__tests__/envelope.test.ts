import { describe, expect, it } from 'vitest';
import { EnvelopeError, openSeed, sealSeed, wipe, withSeed } from '../envelope';

const prf = (fill: number) => new Uint8Array(32).fill(fill);
const seedBytes = () => Uint8Array.from({ length: 32 }, (_, i) => i + 1);

describe('passkey seed envelope', () => {
  it('unseals what it sealed', async () => {
    const seed = seedBytes();
    const sealed = await sealSeed(seed, prf(7));
    expect(await openSeed(sealed, prf(7))).toEqual(seed);
  });

  it('produces ciphertext longer than the seed (GCM tag present)', async () => {
    const sealed = await sealSeed(seedBytes(), prf(7));
    expect(sealed.ciphertext.length).toBe(48); // 32 seed + 16 tag
    expect(sealed.iv.length).toBe(12);
  });

  it('never emits the plaintext seed as ciphertext', async () => {
    const seed = seedBytes();
    const sealed = await sealSeed(seed, prf(7));
    expect(sealed.ciphertext.slice(0, 32)).not.toEqual(seed);
  });

  it('uses a fresh nonce per seal, so identical seeds do not collide', async () => {
    const seed = seedBytes();
    const a = await sealSeed(seed, prf(7));
    const b = await sealSeed(seed, prf(7));
    expect(a.iv).not.toEqual(b.iv);
    expect(a.ciphertext).not.toEqual(b.ciphertext);
  });

  // The security boundary: a different passkey is a different PRF output.
  it('refuses to open with the wrong passkey', async () => {
    const sealed = await sealSeed(seedBytes(), prf(7));
    await expect(openSeed(sealed, prf(8))).rejects.toThrow(EnvelopeError);
  });

  // AES-GCM authenticates: a tampered blob must fail loudly rather than yield a
  // garbage seed, which would silently derive a different wallet.
  it('refuses to open tampered ciphertext', async () => {
    const sealed = await sealSeed(seedBytes(), prf(7));
    sealed.ciphertext[0] ^= 0xff;
    await expect(openSeed(sealed, prf(7))).rejects.toMatchObject({ code: 'OPEN_FAILED' });
  });

  it('refuses to open with a tampered nonce', async () => {
    const sealed = await sealSeed(seedBytes(), prf(7));
    sealed.iv[0] ^= 0xff;
    await expect(openSeed(sealed, prf(7))).rejects.toMatchObject({ code: 'OPEN_FAILED' });
  });

  // A short PRF output must never be silently accepted as weaker key material.
  it('rejects a PRF output under 32 bytes', async () => {
    await expect(sealSeed(seedBytes(), new Uint8Array(16).fill(1))).rejects.toMatchObject({
      code: 'PRF_TOO_SHORT'
    });
  });

  it('wipes buffers in place', () => {
    const buf = seedBytes();
    wipe(buf, undefined);
    expect(buf.every((b) => b === 0)).toBe(true);
  });

  describe('withSeed', () => {
    it('exposes the seed to the callback', async () => {
      const sealed = await sealSeed(seedBytes(), prf(7));
      const seen = await withSeed(sealed, prf(7), async (s) => Array.from(s));
      expect(seen).toEqual(Array.from(seedBytes()));
    });

    it('zeroes the seed after use', async () => {
      const sealed = await sealSeed(seedBytes(), prf(7));
      let captured: Uint8Array | undefined;
      await withSeed(sealed, prf(7), async (s) => {
        captured = s;
      });
      expect(captured!.every((b) => b === 0)).toBe(true);
    });

    // The important one: an exception mid-signing must not leave a live seed behind.
    it('zeroes the seed even when the callback throws', async () => {
      const sealed = await sealSeed(seedBytes(), prf(7));
      let captured: Uint8Array | undefined;
      await expect(
        withSeed(sealed, prf(7), async (s) => {
          captured = s;
          throw new Error('signing blew up');
        })
      ).rejects.toThrow('signing blew up');
      expect(captured!.every((b) => b === 0)).toBe(true);
    });
  });
});
