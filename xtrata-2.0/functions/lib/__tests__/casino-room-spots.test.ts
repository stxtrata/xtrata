import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { SPOTS, isSpot } from '../casino-room';

// The room server accepts only the spot ids in SPOTS, and the casino page makes its ids from its own SEATS table and machine
// list. If the two drift apart, people would silently stop appearing, so this reads the page and checks them against each other.
const html = readFileSync(join(__dirname, '../../../public/casino/index.html'), 'utf8');

const literal = (source: string) => new Function(`return ${source}`)();

const seatsBlock = /const SEATS = (\{[\s\S]*?\n {2}\});/.exec(html);
const machBlock = /const MACH = (\[[^\]]*\])/.exec(html);

describe('casino room spots match the /casino page', () => {
  it('finds the seat table and the machine list in the page', () => {
    expect(seatsBlock).not.toBeNull();
    expect(machBlock).not.toBeNull();
  });

  const seats: Record<string, Array<{ pad?: boolean }>> = seatsBlock ? literal(seatsBlock[1]) : {};
  const machines: string[] = machBlock ? literal(machBlock[1]) : [];
  const fromSeats = Object.entries(seats).flatMap(([id, list]) => list.map((s, i) => (s.pad ? `${id}.pad` : `${id}.${i + 1}`)));
  const fromMachines = machines.flatMap((id) => [`${id}.1`, `${id}.2`]);

  it('accepts every seat the page can report', () => {
    expect(fromSeats.length).toBe(14);
    for (const id of fromSeats) expect(isSpot(id), id).toBe(true);
  });

  it('accepts every cabinet the page can report (five machines, a left and a right wall each)', () => {
    expect(fromMachines.length).toBe(10);
    for (const id of fromMachines) expect(isSpot(id), id).toBe(true);
  });

  it('has no spot the page can never produce, apart from the bar stools reserved for later', () => {
    const known = new Set([...fromSeats, ...fromMachines]);
    const dead = SPOTS.filter((id) => !known.has(id) && !id.startsWith('bar.'));
    expect(dead).toEqual([]);
  });
});
