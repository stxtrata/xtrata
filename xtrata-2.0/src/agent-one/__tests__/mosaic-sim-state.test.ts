import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
// @ts-expect-error — plain .mjs dev tool, no types
import { readState, ownerOf, contentOf, tokenIdFor, TREASURY } from '../../../tools/mosaic-sim/state.mjs';

/**
 * The mosaic simulator's state layer, which stands in for the chain so the mosaic can be
 * driven into states mainnet cannot produce.
 *
 * Two traps are built into it deliberately, and these tests hold them there, because a
 * harness that quietly makes them go away would let the real mosaic ship with the bug:
 *
 *   token id  != collection index
 *   mint order != collection order
 */

let dir: string;
afterEach(() => { if (dir) rmSync(dir, { recursive: true, force: true }); });

const build = (opts: {
  treasury?: number[]; released?: number[]; config?: any;
  mintOrder?: number[]; content?: (i: number) => string;
}) => {
  dir = mkdtempSync(join(tmpdir(), 'mosaic-sim-'));
  mkdirSync(join(dir, 'treasury'), { recursive: true });
  mkdirSync(join(dir, 'released'), { recursive: true });
  const slug = opts.config?.slug ?? 'demo';
  const body = opts.content ?? ((i: number) => `xtrata:seed/${slug}/${String(i).padStart(4, '0')}:abc${i}`);
  for (const i of opts.treasury ?? []) writeFileSync(join(dir, 'treasury', String(i).padStart(4, '0')), body(i));
  for (const i of opts.released ?? []) writeFileSync(join(dir, 'released', String(i).padStart(4, '0')), body(i));
  if (opts.mintOrder) writeFileSync(join(dir, 'mint-order.json'), JSON.stringify(opts.mintOrder));
  writeFileSync(join(dir, 'config.json'), JSON.stringify({ slug, maxSupply: 1024, ...(opts.config ?? {}) }));
  return readState(dir);
};

describe('the three states an item can be in', () => {
  it('an item in neither folder is not minted', () => {
    const s = build({ treasury: [0], released: [] });
    expect(ownerOf(s, tokenIdFor(5))).toBeNull();
    expect(contentOf(s, tokenIdFor(5))).toBeNull();
  });

  it('an item in treasury/ is minted and held by the treasury', () => {
    const s = build({ treasury: [7] });
    expect(ownerOf(s, tokenIdFor(7))).toBe(TREASURY);
  });

  it('an item in released/ is minted and held by someone else', () => {
    const s = build({ released: [7], config: { holders: { 7: 'SP2W89C1HN0PWSPG3XBWXK05WD5K1TF2XJAJXD05P' } } });
    expect(ownerOf(s, tokenIdFor(7))).toBe('SP2W89C1HN0PWSPG3XBWXK05WD5K1TF2XJAJXD05P');
    expect(ownerOf(s, tokenIdFor(7))).not.toBe(TREASURY);
  });

  it('moving a file from treasury to released is what a sale looks like', () => {
    const before = build({ treasury: [7] });
    expect(ownerOf(before, tokenIdFor(7))).toBe(TREASURY);
    rmSync(join(dir, 'treasury', '0007'));
    writeFileSync(join(dir, 'released', '0007'), `xtrata:seed/demo/0007:abc7`);
    const after = readState(dir);
    expect(ownerOf(after, tokenIdFor(7))).not.toBe(TREASURY);
  });
});

describe('the two traps the harness exists to expose', () => {
  it('token id is NOT the collection index', () => {
    // A mosaic that assumes tokenId === index breaks on the very first item here.
    expect(tokenIdFor(0)).not.toBe(0);
    expect(tokenIdFor(417)).toBe(3417);
  });

  it('mint order is NOT collection order', () => {
    const s = build({ treasury: [0, 1, 2, 3], mintOrder: [2, 0, 3, 1] });
    expect(s.mintOrder).toEqual([2, 0, 3, 1]);
    expect(s.mintOrderExplicit).toBe(true);
  });

  it('says so when a scenario forgot to pin the mint order', () => {
    // The easy case hides ordering bugs, so the harness reports when it is in use.
    const s = build({ treasury: [0, 1, 2] });
    expect(s.mintOrderExplicit).toBe(false);
    expect(s.mintOrder).toEqual([0, 1, 2]);
  });

  it('a minted item missing from an explicit order is still reachable', () => {
    const s = build({ treasury: [0, 1, 2], mintOrder: [2, 0] });
    expect(s.mintOrder).toContain(1);
    expect(s.mintOrder).toHaveLength(3);
  });
});

describe('broken states are reported, never corrected', () => {
  it('flags the same index in both folders — the retry twin', () => {
    const s = build({ treasury: [417], released: [417] });
    expect(s.anomalies.join(' ')).toMatch(/both folders.*417/);
  });

  it('flags an index beyond maxSupply — a stray', () => {
    const s = build({ treasury: [2000], config: { maxSupply: 1024 } });
    expect(s.anomalies.join(' ')).toMatch(/2000 is beyond maxSupply/);
  });

  it('flags content that is not a namespaced seed', () => {
    const s = build({ treasury: [3], content: () => 'just-a-bare-seed' });
    expect(s.anomalies.join(' ')).toMatch(/content does not match/);
  });

  it('leaves a hole as a hole rather than closing the gap', () => {
    const s = build({ treasury: [0, 1, 3] });   // 2 is missing
    expect(s.items.has(2)).toBe(false);
    expect(ownerOf(s, tokenIdFor(2))).toBeNull();
    expect(s.mintedCount).toBe(3);
  });

  it('an empty collection is valid, not an error', () => {
    const s = build({});
    expect(s.mintedCount).toBe(0);
    expect(s.anomalies).toEqual([]);
  });
});

describe('the grid is laid out as the artwork is', () => {
  // Behaviour was verified in a browser (32 columns, square cells, item 32 starting a new
  // row). These guard the two ways it silently regresses: an auto-fill grid that reflows
  // with the window, and a hardcoded side that breaks on a different supply.
  const mosaic = readFileSync(new URL('../../../tools/mosaic-sim/mosaic.html', import.meta.url), 'utf8');

  it('never uses auto-fill, which would put every item in the wrong place', () => {
    // Match the USAGE, not the word — the file mentions auto-fill in a comment saying
    // exactly why it must not be used, and an assertion on the bare word fails on that.
    expect(mosaic).not.toMatch(/repeat\(\s*auto-fi[lt]/);
  });

  it('derives the square side from the supply rather than hardcoding 32', () => {
    expect(mosaic).toContain('Math.sqrt(maxSupply)');
    expect(mosaic).toContain('gridTemplateColumns = `repeat(${side}, 1fr)`');
  });

  it('says so when the supply cannot be a square', () => {
    expect(mosaic).toContain('is not a perfect square');
  });
});
