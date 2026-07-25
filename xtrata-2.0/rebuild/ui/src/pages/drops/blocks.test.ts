import { describe, expect, it } from 'vitest';
import {
  approximateDateOfBlock,
  blocksToSeconds,
  describeBlock,
  describeDuration,
  secondsToBlocks,
  validateWindow
} from './blocks';

const NOW = new Date('2026-07-24T12:00:00Z');

describe('block ↔ time conversion', () => {
  it('converts both ways at the nominal cadence', () => {
    expect(blocksToSeconds(6)).toBe(60);
    expect(secondsToBlocks(3_600)).toBe(360);
    expect(secondsToBlocks(-5)).toBe(0);
  });

  it('describes durations in the units a person would use', () => {
    expect(describeDuration(6)).toBe('about 1 minute');
    expect(describeDuration(360)).toBe('about 1 hour');
    expect(describeDuration(8_640)).toBe('about 1 day');
    expect(describeDuration(9_000)).toBe('about 1 day 1 hour');
    expect(describeDuration(0)).toBe('no time at all');
    expect(describeDuration(3)).toBe('about under a minute');
  });

  it('projects a future block onto an approximate date', () => {
    const date = approximateDateOfBlock({ targetBlock: 1_360, tipHeight: 1_000, now: NOW });
    expect(date.toISOString()).toBe('2026-07-24T13:00:00.000Z');
  });
});

describe('describeBlock', () => {
  it('always hedges a future estimate', () => {
    const text = describeBlock({ block: 1_360, tipHeight: 1_000, kind: 'end', now: NOW });
    expect(text).toMatch(/about 1 hour from now/);
    expect(text).toMatch(/treat this as an estimate/i);
  });

  it('treats end block 0 as "no end block"', () => {
    expect(describeBlock({ block: 0, tipHeight: 1_000, kind: 'end' })).toMatch(/No end block/);
  });

  it('says a past start block simply means "as soon as it is activated"', () => {
    expect(describeBlock({ block: 10, tipHeight: 1_000, kind: 'start' })).toMatch(/as soon as/);
  });

  it('says a past end block means the window is already shut', () => {
    expect(describeBlock({ block: 10, tipHeight: 1_000, kind: 'end' })).toMatch(/already closed/);
  });

  it('admits when it does not know the chain tip instead of guessing', () => {
    expect(describeBlock({ block: 500, tipHeight: null, kind: 'start' })).toMatch(
      /current height unknown/
    );
  });
});

describe('validateWindow', () => {
  it('accepts an open-ended window', () => {
    const result = validateWindow({ startBlock: 0, endBlock: 0, tipHeight: 1_000 });
    expect(result.errors).toEqual([]);
  });

  it('mirrors the contract check: end must not precede start unless it is 0', () => {
    const result = validateWindow({ startBlock: 900, endBlock: 800, tipHeight: 100 });
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]!.field).toBe('endBlock');
    expect(validateWindow({ startBlock: 900, endBlock: 0, tipHeight: 100 }).errors).toEqual([]);
  });

  it('rejects non-integer and negative heights', () => {
    expect(validateWindow({ startBlock: -1, endBlock: 0, tipHeight: null }).errors).toHaveLength(1);
    expect(validateWindow({ startBlock: 1.5, endBlock: 0, tipHeight: null }).errors).toHaveLength(1);
  });

  it('warns about a window that has already closed', () => {
    const result = validateWindow({ startBlock: 100, endBlock: 200, tipHeight: 1_000 });
    expect(result.errors).toEqual([]);
    expect(result.warnings.some((warning) => /behind the chain tip/.test(warning.message))).toBe(true);
  });

  it('warns about a window too narrow to mine a claim in', () => {
    const result = validateWindow({ startBlock: 1_000, endBlock: 1_003, tipHeight: 900 });
    expect(result.warnings.some((warning) => /few blocks wide/.test(warning.message))).toBe(true);
  });
});
