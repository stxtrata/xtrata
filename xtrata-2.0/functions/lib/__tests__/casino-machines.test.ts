import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { describe, expect, it } from 'vitest';
import { ALL_MACHINES, CORE_MACHINES, FLOOR_MACHINES, ROTATION_MACHINES, machineName } from '../casino-machines';

// The floor is chosen in a plain script the page loads; the room's list is its own copy. They must name the same five.
const rotation = (() => {
  const sandbox: any = { window: {} };
  vm.runInNewContext(readFileSync(join(__dirname, '../../../public/casino/machine-rotation.js'), 'utf8'), sandbox);
  return sandbox.window.PX_MACHINE_ROTATION as { floor: string[]; mobileFloor?: string[] };
})();

describe('the machines the missions, the tournament and the Slot fan badge are built from', () => {
  it('are the five on the standard floor (public/casino/machine-rotation.js)', () => {
    expect([...FLOOR_MACHINES].sort()).toEqual([...rotation.floor].sort());
  });
  it('are five, all different, and all machines the room takes spins from', () => {
    expect(FLOOR_MACHINES.length).toBe(5);
    expect(new Set(FLOOR_MACHINES).size).toBe(5);
    for (const id of FLOOR_MACHINES) expect((ALL_MACHINES as readonly string[]).includes(id), id).toBe(true);
  });
  it('are on the floor a phone gets too', () => {
    // Phones and tablets use `mobileFloor` when the rotation file has one: a mission must not send them to a machine they cannot reach.
    const phone = rotation.mobileFloor || rotation.floor;
    expect([...phone].sort()).toEqual([...FLOOR_MACHINES].sort());
  });
  it('have names', () => {
    expect(machineName('twins')).toBe('Forever Twins');
    expect(machineName('hot-wallet')).toBe('Hot Wallet');
    expect(machineName('rune-pit')).toBe('Rune Pit');
    for (const id of [...CORE_MACHINES, ...ROTATION_MACHINES]) expect(machineName(id).length).toBeGreaterThan(2);
  });
});
