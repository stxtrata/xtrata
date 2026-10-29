import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { prepareIngest, validateEvent } from '../casino-ingest';

/**
 * Contract between the two casino pages and the ingest endpoint.
 *
 * `fixtures/casino-client-batches.json` holds request bodies captured from the real pages' logger while they played
 * (/casino and /casino-b, all five machines, with bonuses, free spins, gambles, LAYR purchases and bankroll moves),
 * trimmed to a handful of events per machine and kind. The endpoint is strict and silent: an event it does not recognise is
 * dropped without any error, so a field the page sends in a shape the server refuses would quietly lose data. This test
 * fails if either side drifts.
 */
type Batch = { v: number; page: string; pid: string; sid: string; addr: string | null; events: Record<string, unknown>[] };
const batches = JSON.parse(
  readFileSync(new URL('./fixtures/casino-client-batches.json', import.meta.url), 'utf8')
) as Batch[];

describe('captured client batches', () => {
  it('has batches from both pages and every kind of event', () => {
    const pages = new Set(batches.map((b) => b.page));
    expect([...pages].sort()).toEqual(['casino', 'casino-b']);
    const kinds = new Set(batches.flatMap((b) => b.events.map((e) => e.k)));
    for (const kind of ['spin', 'bonus', 'gamble', 'buy']) expect(kinds.has(kind)).toBe(true);
    const machines = new Set(batches.flatMap((b) => b.events.map((e) => e.m)));
    for (const machine of ['bf', 'drop', 'twins', 'ds', 'nv']) expect(machines.has(machine)).toBe(true);
  });

  it('is accepted whole: no event is dropped by the server', () => {
    for (const batch of batches) {
      const prepared = prepareIngest(batch, Date.now());
      expect(prepared, `${batch.page} ${batch.sid}`).not.toBeNull();
      expect(prepared!.rejected).toBe(0);
      expect(prepared!.accepted).toBe(batch.events.length);
    }
  });

  it('keeps what the replay needs: five reel stops per spin and the win split into jackpot and the rest', () => {
    for (const batch of batches) {
      for (const raw of batch.events.filter((e) => e.k === 'spin')) {
        const ev = validateEvent(raw);
        expect(ev?.stops?.split(',')).toHaveLength(5);
        expect(ev?.win).toBe(raw.win);
        expect(ev?.jp).toBe(raw.jp ?? 0);
      }
    }
  });
});
