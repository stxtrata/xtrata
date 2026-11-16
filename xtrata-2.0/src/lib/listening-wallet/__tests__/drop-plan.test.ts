import { describe, expect, it } from 'vitest';
import { validateBatch, type BatchView } from '../batches';
import { dropStatus, dropSteps, dropTotals, stepStatus, wallCheck, type DropBatch } from '../drop-plan';
import { giftPlays } from '../gifts';
import { tierOfAmount, TIERS } from '../tiers';
// @ts-expect-error a plain script, no types
import { codesIn, MIX, run, shuffled, TOTAL, wallProblem } from '../../../../scripts/load-players-wall.mjs';

const NOW = 1_800_000_000_000;
const ME = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const code = (n: number) => 'c' + String(n).padStart(21, '0');
const view = (b: { id: string; count: number; amount: string; label: string }, waiting = b.count): BatchView => ({
  id: b.id, status: 'live', count: b.count, amount: b.amount, label: b.label, player: null, deposit: '1', memo: 'batch ' + b.id, expires: NOW + 90 * 86_400_000,
  copies: { waiting, claiming: 0, claimed: b.count - waiting, refunding: 0, refunded: 0 }
});
/** Every batch of the drop, made on this device and live. */
function allLive(): DropBatch[] {
  let n = 0;
  return dropSteps().map((s) => {
    const b: DropBatch = { id: s.n.toString(16).padStart(16, '0'), codes: Array.from({ length: s.count }, () => code(++n)), count: s.count, amount: s.amount.toString(), label: s.label, player: null, at: NOW - 1000, txid: '0x1' };
    b.view = view(b);
    return b;
  });
}

describe('the 1,000 players as a plan', () => {
  const steps = dropSteps();
  it('is 13 batches, 1,000 players, 29.8875 STX, none bigger than a batch may be', () => {
    expect(steps).toHaveLength(13);
    expect(dropTotals()).toMatchObject({ batches: 13, players: 1000, deposit: 29_887_500n });
    expect(steps.map((s) => s.count)).toEqual([5, 10, 20, 100, 100, 100, 100, 100, 100, 100, 100, 100, 65]);
    expect(steps.map((s) => s.n)).toEqual(steps.map((_, i) => i + 1));
  });
  it('every batch is one the server accepts, lands in its class, and its label gives nothing away', () => {
    for (const s of steps) {
      expect(() => validateBatch({ creator: ME, count: s.count, amount: s.amount.toString(), label: s.label, issued: NOW }, NOW)).not.toThrow();
      expect(tierOfAmount(s.amount).id).toBe(s.tier);
      expect(giftPlays(s.amount)).toBe(s.plays);
      for (const t of TIERS) expect(s.label.toLowerCase()).not.toContain(t.name.toLowerCase());
    }
    expect(new Set(steps.map((s) => s.label)).size).toBe(13);
  });
  it('the loader script expects the same mix', () => {
    expect(TOTAL).toBe(dropTotals().players);
    expect(MIX.map((t: any) => [t.plays, t.count])).toEqual(dropTotals().tiers.map((t) => [t.plays, t.count]));
  });
});

describe('telling where the drop stands from the batches on this device', () => {
  const steps = dropSteps();
  it('starts with everything to do and the first batch next', () => {
    const s = dropStatus([], NOW);
    expect(s).toMatchObject({ done: 0, ready: false, codes: [], problems: [] });
    expect(s.next?.n).toBe(1);
  });
  it('walks a batch through made, paid and live, and moves on only when it is made', () => {
    const b: DropBatch = { id: 'a'.repeat(16), codes: Array.from({ length: 5 }, (_, i) => code(i)), count: 5, amount: steps[0].amount.toString(), label: steps[0].label, player: null, at: NOW - 5 };
    expect(stepStatus(steps[0], [b], NOW).state).toBe('unpaid');
    expect(dropStatus([b], NOW).next?.n).toBe(2);
    b.txid = '0x1';
    expect(stepStatus(steps[0], [b], NOW).state).toBe('confirming');
    b.view = view(b);
    expect(stepStatus(steps[0], [b], NOW)).toMatchObject({ state: 'live', extras: 0 });
    expect(dropStatus([b], NOW)).toMatchObject({ done: 1, ready: false });
  });
  it('never mistakes another batch for part of the drop', () => {
    const base = { id: 'b'.repeat(16), codes: Array.from({ length: 5 }, (_, i) => code(i)), count: 5, amount: steps[0].amount.toString(), label: steps[0].label, player: null, at: NOW - 5, txid: '0x1' } as DropBatch;
    for (const other of [{ label: 'Launch' }, { count: 4, codes: base.codes.slice(0, 4) }, { amount: steps[1].amount.toString() }, { player: '0123456789abcdef' }, { codes: [] /* made on another device */ }]) {
      expect(stepStatus(steps[0], [{ ...base, ...other }], NOW).state).toBe('todo');
    }
    // A batch made and left unpaid for a day is gone on the server: the step is to do again.
    expect(stepStatus(steps[0], [{ ...base, txid: undefined, at: NOW - 24 * 3600_000 }], NOW).state).toBe('todo');
  });
  it('a batch made twice is called out, and the live one is the one that counts', () => {
    const one = allLive()[0];
    const two: DropBatch = { ...one, id: 'c'.repeat(16), codes: one.codes.map((c) => c.replace(/^c/, 'd')), txid: undefined, view: undefined };
    const s = stepStatus(steps[0], [two, one], NOW);
    expect(s).toMatchObject({ state: 'live', extras: 1 });
    expect(s.batch?.id).toBe(one.id);
    expect(dropStatus([two, one], NOW).problems.join(' ')).toMatch(/Batch 1 was made more than once/);
  });
  it('is ready only when all 13 are live, untouched, and hold 1,000 different links', () => {
    const all = allLive();
    const s = dropStatus(all, NOW);
    expect(s).toMatchObject({ done: 13, ready: true, next: null, problems: [] });
    expect(new Set(s.codes).size).toBe(1000);
    expect(dropStatus(all.slice(1), NOW)).toMatchObject({ ready: false, codes: [] });
    const claimed = allLive(); claimed[3].view = view(claimed[3], 99);
    const t = dropStatus(claimed, NOW);
    expect(t).toMatchObject({ ready: false, codes: [] });
    expect(t.problems.join(' ')).toMatch(/Batch 4 has copies that are no longer waiting/);
    const twin = allLive(); twin[1].codes[0] = twin[0].codes[0];
    expect(dropStatus(twin, NOW)).toMatchObject({ ready: false, codes: [] });
  });
});

const WALL = { state: 'open', total: 1000, claimed: 0, free: 1000, held: 0, tiers: [{ id: 'diamond', plays: 1000, total: 5, left: 5 }, { id: 'gold', plays: 500, total: 10, left: 10 }, { id: 'silver', plays: 250, total: 20, left: 20 }, { id: 'bronze', plays: 100, total: 100, left: 100 }, { id: 'classic', plays: 50, total: 865, left: 865 }] };
describe('checking the public wall against the drop', () => {
  it('passes only the exact mix', () => {
    expect(wallCheck(WALL)).toMatchObject({ ok: true });
    expect(wallCheck({ ...WALL, claimed: 3, free: 997 }).ok).toBe(true); // claims are the point
    expect(wallCheck({ state: 'open', total: 3, claimed: 1, free: 2, held: 0, tiers: [{ id: 'classic', plays: 50, total: 3, left: 2 }] })).toMatchObject({ ok: false });
    expect(wallCheck({ ...WALL, tiers: WALL.tiers.map((t) => (t.plays === 1000 ? { ...t, total: 4 } : t)) }).ok).toBe(false);
    expect(wallCheck({ ...WALL, free: 990 }).ok).toBe(false); // ten gone
    expect(wallCheck({ state: 'empty', total: 0, claimed: 0, free: 0, held: 0 }).text).toMatch(/empty/);
    expect(wallCheck(null).ok).toBe(false);
    expect(wallProblem(WALL)).toBeNull();
    expect(wallProblem({ ...WALL, claimed: 1, free: 999 })).toMatch(/already claimed/);
    expect(wallProblem({ ...WALL, claimed: 1, free: 999 }, { allowClaimed: true })).toBeNull();
  });
});

/** A stand-in for the operator route and the wall, with the same rules as functions/lib/radio-giveaway.ts. */
function server(liveCodes: string[], tierOf: (code: string) => number, old = 0) {
  const s = { wall: [] as string[], archived: new Set<string>(), old, paused: false, calls: [] as string[], failAdd: 0 };
  const status = () => ({ list: 'players', wall: true, total: s.wall.length + s.old, free: s.wall.length + s.old, held: 0, claimed: 0, gone: 0, paused: s.paused });
  const admin = async (body: any) => {
    s.calls.push(body.action);
    if (body.action === 'pause') s.paused = true;
    if (body.action === 'resume') s.paused = false;
    if (body.action === 'archive') { const archived = s.wall.length + s.old; for (const c of s.wall) s.archived.add(c); s.wall = []; s.old = 0; return { archived, withdrawn: archived, ...status() }; }
    if (body.action === 'add') {
      if (s.failAdd && s.calls.filter((c) => c === 'add').length === s.failAdd) return null;
      const codes = codesIn(body.text);
      let added = 0, duplicates = 0; const notFound: number[] = [], notLive: number[] = [];
      const good: string[] = [];
      codes.forEach((c: string, i: number) => { if (!liveCodes.includes(c)) notLive.push(i + 1); else good.push(c); });
      for (const c of good) { if (s.wall.includes(c) || s.archived.has(c)) duplicates++; else { s.wall.push(c); added++; } }
      return { added, duplicates, notFound, notLive, ...status() };
    }
    return status();
  };
  const wall = async () => {
    const tiers = new Map<number, number>();
    for (const c of s.wall) tiers.set(tierOf(c), (tiers.get(tierOf(c)) ?? 0) + 1);
    return { state: s.paused ? 'paused' : 'open', total: s.wall.length + s.old, claimed: 0, free: s.wall.length + s.old, held: 0, tiers: [...tiers].map(([plays, total]) => ({ plays, total, left: total })) };
  };
  return { s, io: (lines: string[]) => ({ admin, wall, say: (l: string) => lines.push(l), wait: async () => {} }) };
}

describe('the loader script, start to finish against a stand-in server', () => {
  const batches = allLive();
  const codes = dropStatus(batches, NOW).codes;
  const playsOf = new Map(batches.flatMap((b) => b.codes.map((c) => [c, giftPlays(BigInt(b.amount))] as const)));
  const tierOf = (c: string) => playsOf.get(c)!;

  it('reads links or bare codes, and shuffles without losing any', () => {
    expect(codesIn(codes.map((c) => `https://radio.xtrata.xyz/radio.html#gift=${c}`).join('\n'))).toEqual(codes);
    expect(codesIn(codes.join('\n') + '\n' + codes[0])).toHaveLength(1000);
    const mixed = shuffled(codes);
    expect([...mixed].sort()).toEqual([...codes].sort());
    expect(mixed).not.toEqual(codes);
  });
  it('a check-only run changes nothing', async () => {
    const { s, io } = server(codes, tierOf);
    const lines: string[] = [];
    expect(await run({ codes }, io(lines))).toBe(false);
    expect(s.calls).toEqual(['status']);
    expect(lines.join('\n')).toMatch(/Check only: nothing was changed/);
  });
  it('loads an empty wall: pause, add everything, check the mix, open', async () => {
    const { s, io } = server(codes, tierOf);
    const lines: string[] = [];
    expect(await run({ codes, go: true }, io(lines))).toBe(true);
    expect(s.calls).toEqual(['status', 'pause', ...Array(10).fill('add'), 'resume']);
    expect(s.wall).toHaveLength(1000);
    expect(s.paused).toBe(false);
    expect(lines.join('\n')).not.toMatch(/c0{10}/); // never a code
    // Spread through the wall, not in the order the batches were made.
    expect(s.wall.slice(0, 5).every((c) => tierOf(c) === 1000)).toBe(false);
  });
  it('will not touch a wall that holds something unless told which way to go', async () => {
    const { s, io } = server(codes, tierOf, 3);
    const lines: string[] = [];
    expect(await run({ codes, go: true }, io(lines))).toBe(false);
    expect(s.calls).toEqual(['status']);
    expect(lines.join('\n')).toMatch(/already holds 3 spots.*--archive-old.*--continue/s);
    expect(await run({ codes, go: true, archiveOld: true }, io(lines))).toBe(true);
    expect(s.calls.slice(1)).toEqual(['status', 'pause', 'archive', ...Array(10).fill('add'), 'resume']);
    expect(s.wall).toHaveLength(1000);
  });
  it('stops, paused, on the wrong number of links or a batch that is not live', async () => {
    const short = server(codes, tierOf); const a: string[] = [];
    expect(await run({ codes: codes.slice(1), go: true }, short.io(a))).toBe(false);
    expect(short.s.calls).toEqual([]);
    expect(a.join('\n')).toMatch(/Found 999 different links; the drop is 1000/);

    const unpaid = server(codes.filter((c) => tierOf(c) !== 500), tierOf); const b: string[] = [];
    expect(await run({ codes, go: true }, unpaid.io(b))).toBe(false);
    expect(unpaid.s.paused).toBe(true);
    expect(unpaid.s.calls).not.toContain('resume');
    expect(b.join('\n')).toMatch(/not live .*The wall is still paused/s);
  });
  it('carries on after a run that stopped part-way, and never archives what it loaded', async () => {
    const { s, io } = server(codes, tierOf); const lines: string[] = [];
    s.failAdd = 4;
    expect(await run({ codes, go: true }, io(lines))).toBe(false);
    expect(s.wall).toHaveLength(300);
    expect(s.paused).toBe(true);
    s.failAdd = 0;
    expect(await run({ codes, go: true }, io(lines))).toBe(false); // without a flag it will not guess
    expect(await run({ codes, go: true, carryOn: true }, io(lines))).toBe(true);
    expect(s.calls).not.toContain('archive');
    expect(new Set(s.wall).size).toBe(1000);
    expect(s.paused).toBe(false);
  });
  it('refuses both flags at once', async () => {
    const { s, io } = server(codes, tierOf, 3); const lines: string[] = [];
    expect(await run({ codes, go: true, archiveOld: true, carryOn: true }, io(lines))).toBe(false);
    expect(s.calls).toEqual(['status']);
  });
});
