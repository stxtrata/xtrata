import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { SPOTS, isSpot } from '../casino-room';
import { ALL_MACHINES, CORE_MACHINES } from '../casino-machines';

// The room server accepts only the spot ids in SPOTS, and the casino page makes its ids from its own SEATS table and machine
// list. If the two drift apart, people would silently stop appearing, so this reads the page and checks them against each other.
const html = readFileSync(join(__dirname, '../../../public/casino/index.html'), 'utf8');

const literal = (source: string) => new Function(`return ${source}`)();

const seatsBlock = /const SEATS = (\{[\s\S]*?\n {2}\});/.exec(html);
// The machines on the floor come from public/casino/machine-rotation.js (the page reads window.PX_MACHINE_ROTATION and turns the
// floor into MACH). Any id in its catalog can end up on the floor, so every one of them needs cabinets the room server accepts.
const machBlock = /const MACH = window\.PX_FLOOR_KEYS\.slice\(\)/.exec(html);
const rotationJs = readFileSync(join(__dirname, '../../../public/casino/machine-rotation.js'), 'utf8');
const rotation = new Function('window', `${rotationJs}; return window.PX_MACHINE_ROTATION;`)({}) as {
  floor: string[];
  catalog: Array<{ id: string; name: string }>;
};

describe('casino room spots match the /casino page', () => {
  it('finds the seat table and the machine list in the page', () => {
    expect(seatsBlock).not.toBeNull();
    expect(machBlock).not.toBeNull();
  });

  const seats: Record<string, Array<{ pad?: boolean }>> = seatsBlock ? literal(seatsBlock[1]) : {};
  const machines: string[] = rotation.catalog.map((c) => c.id);
  const fromSeats = Object.entries(seats).flatMap(([id, list]) => list.map((s, i) => (s.pad ? `${id}.pad` : `${id}.${i + 1}`)));
  const fromMachines = machines.flatMap((id) => [`${id}.1`, `${id}.2`]);

  it('accepts every seat the page can report', () => {
    expect(fromSeats.length).toBe(14);
    for (const id of fromSeats) expect(isSpot(id), id).toBe(true);
  });

  it('accepts every cabinet the page can report (any machine in the rotation catalog, a left and a right wall each)', () => {
    expect(fromMachines.length).toBe(ALL_MACHINES.length * 2);
    for (const id of fromMachines) expect(isSpot(id), id).toBe(true);
  });

  it('keeps the rotation catalog in step with the machines the room service accepts', () => {
    expect(rotation.catalog.map((c) => c.id)).toEqual([...ALL_MACHINES]);
  });

  it('puts the five original machines on the floor by default, and never more than five', () => {
    expect(rotation.floor).toEqual([...CORE_MACHINES]);
    expect(rotation.floor.length).toBeLessThanOrEqual(5);
  });

  // The lounge chess tables add their seats at run time (public/casino/chess.js: a sofa and an armchair each).
  const chessJs = readFileSync(join(__dirname, '../../../public/casino/chess.js'), 'utf8');
  const chessIds = [...chessJs.matchAll(/\{ id: '(chess\d)'/g)].map((m) => m[1]);
  const fromChess = chessIds.flatMap((id) => [`${id}.1`, `${id}.2`]);

  it('accepts every seat at the lounge chess tables, which the page loads from chess.js', () => {
    expect(html).toContain('<script src="chess.js?v=');
    expect(fromChess).toEqual(['chess1.1', 'chess1.2', 'chess2.1', 'chess2.2']);
    for (const id of fromChess) expect(isSpot(id), id).toBe(true);
  });

  it('has no spot the page can never produce, apart from the bar stools reserved for later', () => {
    const known = new Set([...fromSeats, ...fromMachines, ...fromChess]);
    const dead = SPOTS.filter((id) => !known.has(id) && !id.startsWith('bar.'));
    expect(dead).toEqual([]);
  });
});
