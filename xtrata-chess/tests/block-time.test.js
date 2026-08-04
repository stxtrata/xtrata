// Real-time playback rests on one fact: the contract stores a block height, and
// a block height is a key into that block's timestamp. These check the lookup,
// the arithmetic, and the honest handling of the two cases that make real chess
// timing awkward — submissions that shared a block, and gaps nobody wants to sit
// through.

import { describe, expect, it, vi } from 'vitest';
import {
  BlockTimes,
  StaticBlockTimes,
  formatClock,
  formatDuration,
  gapAt,
  stampLog
} from '../src/block-time.js';
import { MockChain, BLOCK_SECONDS, SIM_EPOCH } from '../src/mock-chain.js';
import { runSimulation } from '../src/simulation.js';

function stubFetch(times) {
  return vi.fn(async (url) => {
    const height = Number(String(url).split('/').pop());
    if (!(height in times)) return { ok: false, status: 404 };
    return { ok: true, json: async () => ({ block_time: times[height], burn_block_time: 1 }) };
  });
}

describe('formatting', () => {
  it('describes gaps at every scale', () => {
    expect(formatDuration(0)).toBe('0s');
    expect(formatDuration(45)).toBe('45s');
    expect(formatDuration(90)).toBe('1m 30s');
    expect(formatDuration(3600)).toBe('1h 0m');
    expect(formatDuration(8130)).toBe('2h 15m');
    expect(formatDuration(273_600)).toBe('3d 4h');
  });

  it('runs a clock', () => {
    expect(formatClock(0)).toBe('0:00');
    expect(formatClock(65)).toBe('1:05');
    expect(formatClock(3725)).toBe('1:02:05');
    expect(formatClock(90_000)).toBe('1d1h');
  });

  it('says nothing about unknown times', () => {
    expect(formatDuration(null)).toBe('');
    expect(formatDuration(NaN)).toBe('');
    expect(formatClock(undefined)).toBe('');
  });
});

describe('BlockTimes', () => {
  it('resolves and caches one lookup per block, not per move', async () => {
    const fetch = stubFetch({ 100: 1000, 101: 1012 });
    const times = new BlockTimes({ apiUrl: 'https://api', fetch });

    // Ten submissions across two blocks.
    const heights = [100, 100, 100, 100, 101, 101, 100, 101, 101, 100];
    expect(await times.resolve(heights)).toBe(true);

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(times.get(100)).toBe(1000);
    expect(times.get(101)).toBe(1012);

    expect(await times.resolve(heights)).toBe(false);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('caches a failure so it does not re-ask on every poll', async () => {
    const fetch = stubFetch({});
    const times = new BlockTimes({ apiUrl: 'https://api', fetch });

    await times.resolve([500]);
    await times.resolve([500]);
    await times.resolve([500]);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(times.known(500)).toBe(true);
    expect(times.get(500)).toBe(undefined);
  });

  it('survives the API failing or answering nonsense', async () => {
    const dead = new BlockTimes({
      apiUrl: 'https://api',
      fetch: vi.fn(async () => {
        throw new Error('offline');
      })
    });
    await expect(dead.resolve([1, 2])).resolves.toBe(false);

    const garbled = new BlockTimes({
      apiUrl: 'https://api',
      fetch: vi.fn(async () => ({ ok: true, json: async () => ({ block_time: 'soon' }) }))
    });
    await expect(garbled.resolve([1])).resolves.toBe(false);
    expect(garbled.get(1)).toBe(undefined);
  });
});

describe('StaticBlockTimes', () => {
  it('serves times a sealed game carried', () => {
    const times = new StaticBlockTimes({ 900: 1700, 901: 1712 });
    expect(times.get(900)).toBe(1700);
    expect(times.get('901')).toBe(1712);
    expect(times.get(902)).toBe(undefined);
  });

  it('copes with nothing embedded', async () => {
    expect(new StaticBlockTimes().get(1)).toBe(undefined);
    await expect(new StaticBlockTimes().resolve([1])).resolves.toBe(false);
  });
});

describe('stamping a log', () => {
  const times = new StaticBlockTimes({ 10: 1000, 11: 1030, 13: 1200 });
  const moves = [
    { height: 10 },
    { height: 10 },
    { height: 11 },
    { height: 12 }, // unknown
    { height: 13 }
  ];

  it('maps each submission to its block time', () => {
    expect(stampLog(moves, times)).toEqual([1000, 1000, 1030, null, 1200]);
  });

  it('gives zero for submissions that shared a block', () => {
    // Not a rounding error. They landed together, so no time passed between them.
    expect(gapAt(stampLog(moves, times), 1)).toBe(0);
  });

  it('gives the real gap between blocks', () => {
    expect(gapAt(stampLog(moves, times), 2)).toBe(30);
  });

  it('refuses to guess when a timestamp is missing', () => {
    const stamps = stampLog(moves, times);
    expect(gapAt(stamps, 3)).toBe(null);
    expect(gapAt(stamps, 4)).toBe(null);
    expect(gapAt(stamps, 0)).toBe(null);
    expect(gapAt(stamps, 99)).toBe(null);
  });

  it('leaves everything null when there are no times at all', () => {
    expect(stampLog(moves, null)).toEqual([null, null, null, null, null]);
  });
});

describe('the mock chain clock', () => {
  it('advances time with height', () => {
    const chain = new MockChain();
    expect(chain.blockTimes.get(1)).toBe(SIM_EPOCH);
    chain.advance(1);
    expect(chain.blockTimes.get(2)).toBe(SIM_EPOCH + BLOCK_SECONDS);
    chain.advance(10);
    expect(chain.blockTimes.get(12)).toBe(SIM_EPOCH + 11 * BLOCK_SECONDS);
  });

  it('reads like the other block-time sources', () => {
    const chain = new MockChain();
    chain.advance(3);
    expect(stampLog([{ height: 4 }], chain.blockTimes)).toEqual([
      SIM_EPOCH + 3 * BLOCK_SECONDS
    ]);
  });
});

describe('simulated games have replayable timing', () => {
  it('produces varied gaps rather than one fixed interval', async () => {
    const result = await runSimulation({ seed: 3, griefRate: 0.3 });
    const moves = await result.chain.getAllMoves(result.game);
    const stamps = stampLog(moves, result.chain.blockTimes);

    expect(stamps.every((value) => value !== null)).toBe(true);

    const gaps = moves.map((_, index) => gapAt(stamps, index)).filter((g) => g !== null);
    expect(new Set(gaps).size).toBeGreaterThan(2);
    // Some quick, some slow: a fixed cadence would make real-time playback moot.
    expect(Math.max(...gaps)).toBeGreaterThan(Math.min(...gaps) * 4);
  });

  it('never runs time backwards', async () => {
    const result = await runSimulation({ seed: 9, griefRate: 0.4 });
    const moves = await result.chain.getAllMoves(result.game);
    const stamps = stampLog(moves, result.chain.blockTimes);

    for (let i = 1; i < stamps.length; i++) {
      expect(stamps[i]).toBeGreaterThanOrEqual(stamps[i - 1]);
    }
  });

  it('is reproducible from the seed, timestamps included', async () => {
    const a = await runSimulation({ seed: 12 });
    const b = await runSimulation({ seed: 12 });
    const stamps = async (r) => stampLog(await r.chain.getAllMoves(r.game), r.chain.blockTimes);
    expect(await stamps(b)).toEqual(await stamps(a));
  });
});
