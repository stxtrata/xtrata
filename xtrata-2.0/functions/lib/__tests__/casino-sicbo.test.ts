import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ROUND_TABLES, ROUND_TIMING, cleanBets, isBetKey, isRoundTable, sicboDice } from '../casino-rounds';
import { SPOTS } from '../casino-room';
import { TABLES } from '../casino-social';

// Sic Bo on /casino (docs/plans/CASINO-MAIN-ROOM-PLAN.md): the room's side (a shared-round table, its bet keys, the dice from a
// round's seed) and the page's own rules (SicBoModel, read from public/casino/index.html and run here), checked against each other.
const html = readFileSync(join(__dirname, '../../../public/casino/index.html'), 'utf8');
const block = /\/\* SICBO-MODEL-START[^\n]*\*\/\n([\s\S]*?)\/\* SICBO-MODEL-END \*\//.exec(html);
type Model = { KEYS: string[]; TOTAL_PAYS: Record<string, number>; pays: (k: string, d: number[]) => number; settle: (b: Record<string, number>, d: number[]) => number; odds: (k: string) => string; describe: (d: number[]) => { sum: number; triple: boolean; size: string } };
const SB: Model = block ? new Function(`${block[1]}\nreturn SicBoModel;`)() : (null as unknown as Model);
const ALL: number[][] = [];
for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) for (let c = 1; c <= 6; c++) ALL.push([a, b, c]);
const ret = (key: string) => ALL.reduce((s, d) => s + SB.pays(key, d), 0) / ALL.length;     // expected return per unit staked

describe('Sic Bo: the room side', () => {
  it('is a shared-round table with its own timing and a seat pair', () => {
    expect(ROUND_TABLES).toContain('sicbo');
    expect(isRoundTable('sicbo')).toBe(true);
    expect(ROUND_TIMING.sicbo).toEqual({ period: 30_000, close: 15_000 });
    expect(SPOTS).toContain('sicbo.1');
    expect(SPOTS).toContain('sicbo.2');
    expect(SPOTS).not.toContain('holdem.1');
    expect(TABLES).toContain('sicbo');
  });

  it('accepts the 37 Sic Bo bets and nothing else', () => {
    const good = ['small', 'big', 'odd', 'even', 'any', 'n4', 'n10', 'n17', 'd1', 'd6', 't3', 's5'];
    for (const k of good) expect(isBetKey('sicbo', k), k).toBe(true);
    for (const k of ['n3', 'n18', 'd0', 'd7', 't7', 's0', 'player', 'red', 'tr1', 'n:4', '', 'SMALL']) expect(isBetKey('sicbo', k), k).toBe(false);
    expect(isBetKey('baccarat', 'small')).toBe(false);
    expect(cleanBets('sicbo', { big: 100, n9: 5, t6: 1 })).toEqual({ big: 100, n9: 5, t6: 1 });
    expect(cleanBets('sicbo', { big: 100, banker: 5 })).toBeNull();
    expect(cleanBets('sicbo', { big: -1 })).toBeNull();
  });

  it('rolls three fair dice from a seed, the same way every time', () => {
    const seed = 'ab'.repeat(32);
    expect(sicboDice(seed)).toEqual(sicboDice(seed));
    const counts = [0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 6000; i++) for (const v of sicboDice(i.toString(16).padStart(64, '0'))) { expect(v >= 1 && v <= 6 && Number.isInteger(v)).toBe(true); counts[v]++; }
    for (let v = 1; v <= 6; v++) expect(Math.abs(counts[v] - 3000)).toBeLessThan(250);       // 18,000 dice: each face within about 5 standard deviations
  });
});

describe("Sic Bo: the page's rules", () => {
  it('finds the rules in the page', () => {
    expect(block).not.toBeNull();
    expect(SB.KEYS.length).toBe(37);
  });

  it('only offers bets the room accepts', () => {
    for (const k of SB.KEYS) expect(isBetKey('sicbo', k), k).toBe(true);
  });

  it('pays the published odds', () => {
    expect(SB.pays('small', [1, 2, 3])).toBe(2);
    expect(SB.pays('small', [2, 2, 2])).toBe(0);          // a triple beats Small and Big
    expect(SB.pays('big', [6, 5, 1])).toBe(2);
    expect(SB.pays('big', [5, 5, 5])).toBe(0);
    expect(SB.pays('odd', [1, 1, 3])).toBe(2);
    expect(SB.pays('even', [4, 4, 4])).toBe(0);
    expect(SB.pays('any', [3, 3, 3])).toBe(31);
    expect(SB.pays('t3', [3, 3, 3])).toBe(181);
    expect(SB.pays('t4', [3, 3, 3])).toBe(0);
    expect(SB.pays('d2', [2, 2, 5])).toBe(11);
    expect(SB.pays('d2', [2, 2, 2])).toBe(11);
    expect(SB.pays('s4', [4, 1, 2])).toBe(2);
    expect(SB.pays('s4', [4, 4, 2])).toBe(3);
    expect(SB.pays('s4', [4, 4, 4])).toBe(4);
    expect(SB.pays('n4', [1, 1, 2])).toBe(61);
    expect(SB.pays('n10', [3, 3, 4])).toBe(7);
    expect(SB.pays('n10', [3, 3, 5])).toBe(0);
    expect(SB.settle({ big: 100, s6: 10, n13: 5 }, [6, 6, 1])).toBe(200 + 30 + 45);
  });

  it('always keeps a house edge, and Big or Small is the best bet on the table', () => {
    for (const k of SB.KEYS) { const r = ret(k); expect(r, k).toBeLessThan(1); expect(r, k).toBeGreaterThan(0.7); }
    expect(ret('small')).toBeCloseTo(210 / 216, 10);
    expect(ret('big')).toBeCloseTo(210 / 216, 10);
    expect(ret('odd')).toBeCloseTo(210 / 216, 10);
    expect(ret('s1')).toBeCloseTo(199 / 216, 10);       // 7.9% edge on a single number
    for (const k of SB.KEYS) expect(ret(k)).toBeLessThanOrEqual(ret('small') + 1e-12);
  });

  it('describes a roll', () => {
    expect(SB.describe([1, 2, 3])).toEqual({ sum: 6, triple: false, size: 'small' });
    expect(SB.describe([6, 5, 1])).toEqual({ sum: 12, triple: false, size: 'big' });
    expect(SB.describe([2, 2, 2])).toEqual({ sum: 6, triple: true, size: 'triple' });
    expect(SB.odds('n4')).toBe('60:1');
    expect(SB.odds('t1')).toBe('180:1');
  });
});
