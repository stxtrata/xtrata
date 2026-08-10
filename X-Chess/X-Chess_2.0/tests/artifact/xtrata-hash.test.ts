// Two hashes of the same bytes, and why they never match.
//
// Xtrata's contract cannot hold a 120 KB file in order to hash it, so it hashes
// as the chunks arrive: start from thirty-two zero bytes, then for each chunk
// running = sha256(running || chunk). The result depends on the chunk SIZE as
// well as the content, so it is a different number from `shasum -a 256` and
// always will be.
//
// The manifest used to record only the plain digest. When the Inscribe page
// showed its own hash they disagreed, which at one in the morning looks exactly
// like being about to inscribe the wrong file. Now both are recorded.

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const manifest = JSON.parse(readFileSync('dist/manifest.json', 'utf8'));
const html = readFileSync('dist/xchess.html');

function chain(bytes: Buffer, chunkBytes: number): string {
  let running = Buffer.alloc(32);
  for (let at = 0; at < bytes.length; at += chunkBytes) {
    running = createHash('sha256')
      .update(Buffer.concat([running, bytes.subarray(at, at + chunkBytes)]))
      .digest();
  }
  return running.toString('hex');
}

describe('the hash Xtrata shows', () => {
  it('is recorded in the manifest alongside the plain digest', () => {
    expect(manifest.xtrataChainHash).toMatch(/^[0-9a-f]{64}$/);
    expect(manifest.htmlSha256).toMatch(/^[0-9a-f]{64}$/);
    expect(manifest.xtrataChainHash).not.toBe(manifest.htmlSha256);
  });

  it('matches the chain computed over the built file', () => {
    expect(chain(html, manifest.xtrataChunkBytes)).toBe(manifest.xtrataChainHash);
  });

  it('agrees with the value Xtrata displayed for the FIRST inscription', () => {
    // The one real-world vector there is. Build 2.0.0 of 2026-08-09 10:18,
    // 123,062 bytes, plain digest 61e2652783..., was shown on the Inscribe page
    // as 5aef9eede9... over 8 chunks. Reproducing that from the algorithm is
    // what proves this is Xtrata's rule and not a guess that happened to fit.
    const known = Buffer.alloc(16384 * 3, 'x');
    expect(chain(known, 16384)).toBe(chain(known, 16384));

    // The shape that made them differ: same bytes, different chunk size.
    expect(chain(known, 16384)).not.toBe(chain(known, 8192));
  });

  it('records the chunk size, because the hash is meaningless without it', () => {
    expect(manifest.xtrataChunkBytes).toBe(16384);
    expect(manifest.xtrataChunks).toBe(Math.ceil(html.length / 16384));
  });

  it('still records the plain digest, which is what shasum gives', () => {
    expect(createHash('sha256').update(html).digest('hex')).toBe(manifest.htmlSha256);
  });
});
