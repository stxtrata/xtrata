// The review lane: posters from publishers start hidden when the lane is on. The admin looks at them and releases the good ones.
import { Cl } from '@stacks/transactions';
import { readAllPosters, readPosterConfig } from './readback.mjs';
import { todayOf } from './posters.mjs';
import { explain } from './errors.mjs';

// Hidden posters that have not already expired, with what is needed to judge them.
export async function waitingPosters(t) {
  const today = todayOf(await t.height());
  return (await readAllPosters(t)).filter((p) => p.hidden && (p.evergreen || p.endDay > today));
}

export function releaseChunks(ids, size = 20) {
  const out = []; for (let i = 0; i < ids.length; i += size) out.push(ids.slice(i, i + size)); return out;
}

// ids: poster ids to release (admin only). execute false just lists what would be sent.
export async function releasePosters(t, { ids, execute = false, from = null, log = () => {} }) {
  const chunks = releaseChunks(ids);
  const res = { chunks: chunks.length, released: 0, failed: null };
  for (const [i, ch] of chunks.entries()) {
    if (!execute) { log(`dry run ${i + 1}/${chunks.length}: release-posters [${ch.join(', ')}]`); continue; }
    const r = await t.send('posters', 'release-posters', [Cl.list(ch.map((x) => Cl.uint(x)))], from);
    if (!r.ok) { res.failed = explain('posters', Number(r.value)); log(`release failed: ${res.failed}`); return res; }
    res.released += ch.length; log(`released ${ch.join(', ')}`);
  }
  return res;
}

export { readPosterConfig };
