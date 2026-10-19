// "Put this bay back to posters now": one scene, base posters, starting now. Reversible like any scene.
import { Cl } from '@stacks/transactions';
import { sceneCv } from './clar.mjs';
import { readBayView } from './readback.mjs';
import { explain } from './errors.mjs';

export const postersScene = (room, bay) => ({ room, bay, from: 0, base: 0, doorLook: null, layers: [], interaction: 0, link: null });

export async function revertBay(t, { room, bay, execute = false, from = null, log = () => {} }) {
  const before = await readBayView(t, room, bay);
  log(`bay ${bay} is showing ${before && before.active ? 'scene #' + before.activeSeq + ' (base ' + before.active.base + ')' : 'posters already'}`);
  if (!execute) { log('dry run: add-scene with base posters, starting now'); return { executed: false }; }
  const r = await t.send('world', 'add-scene', [sceneCv(postersScene(room, bay))], from);
  if (!r.ok) { const e = explain('world', Number(r.value)); log('FAILED ' + e); return { executed: true, failed: e }; }
  const after = await readBayView(t, room, bay);
  const upcoming = after && after.nextHeight != null;
  if (upcoming) log(`note: a scheduled scene still starts at block ${after.nextHeight}; retract it too if it should not (retract-scene)`);
  return { executed: true, seq: r.value, nextHeight: after ? after.nextHeight : null };
}
