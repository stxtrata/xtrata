// Read the world and poster contracts through a transport, and compare what is there with what a file says.
import { Cl } from '@stacks/transactions';

export async function readLookBook(t) {
  const n = await t.ro('world', 'get-look-count');
  const book = [];
  for (let i = 0; i < n; i += 20) {
    const ids = []; for (let j = i; j < Math.min(n, i + 20); j++) ids.push(j);
    const rows = await t.ro('world', 'get-looks', [Cl.list(ids.map((x) => Cl.uint(x)))]);
    rows.forEach((r, k) => { if (r) book.push({ id: ids[k], kind: r.kind, name: r.name, tier: r.tier, builtin: r.builtin, hidden: !!r.hidden, approved: !!r.approved, owner: r.owner }); });
  }
  return book;
}

export async function readRooms(t, ids) {
  const out = {};
  for (const id of ids) {
    const r = await t.ro('world', 'get-room', [Cl.stringAscii(id)]);
    if (r) out[id] = { title: r.title, owner: r.owner, bays: r.bays, hidden: !!r.hidden, entryId: r['entry-id'] };
  }
  return out;
}

export async function readTimelineCounts(t, room, bays) {
  const out = {};
  for (let b = 0; b < bays; b++) out[`${room}#${b}`] = (await t.ro('world', 'get-timeline', [Cl.stringAscii(room), Cl.uint(b)])).length;
  return out;
}

const sceneFromChain = (seq, r) => ({
  seq, from: r['from-height'], retracted: !!r.retracted, base: r.base, doorLook: r['door-look'],
  layers: (r.layers || []).map((l) => ({ slot: l.slot, look: l.look, params: l.params, state: l.state })),
  interaction: r.interaction,
  link: r.link ? { targetRoom: r.link['target-room'], arrivalBay: r.link['arrival-bay'], path: r.link.path } : null,
  author: r.author,
});

export async function readScenes(t, room, bay) {
  const n = await t.ro('world', 'get-scene-count', [Cl.stringAscii(room), Cl.uint(bay)]);
  const out = [];
  for (let seq = 0; seq < n; seq++) {
    const r = await t.ro('world', 'get-scene', [Cl.stringAscii(room), Cl.uint(bay), Cl.uint(seq)]);
    if (r) out.push(sceneFromChain(seq, r));
  }
  return out;
}

export async function readBayView(t, room, bay) {
  const v = await t.ro('world', 'get-bay', [Cl.stringAscii(room), Cl.uint(bay)]);
  if (!v) return null;
  return { activeSeq: v['active-seq'], active: v.active ? sceneFromChain(v['active-seq'], v.active) : null, nextHeight: v['next-height'], height: v.height };
}

const same = (a, b) => a.base === b.base && (a.doorLook ?? null) === (b.doorLook ?? null) && a.interaction === b.interaction
  && JSON.stringify(a.layers) === JSON.stringify(b.layers) && JSON.stringify(a.link || null) === JSON.stringify(b.link || null);

// Does the chain hold every compiled scene? A scene whose start was already past when it landed is raised to its landing height,
// so "from" must be equal for future starts and >= the requested start for past ones. Each chain scene matches at most one file scene.
// Returns { ok, missing: [scene], matched: [{scene, seq}], extra: [chain scene] (scenes on the touched bays that the file does not explain) }
export async function verifyScenes(t, compiled, { submittedAt = null } = {}) {
  const bays = [...new Set(compiled.map((s) => `${s.room}#${s.bay}`))];
  const chain = {};
  for (const key of bays) { const [room, bay] = key.split('#'); chain[key] = (await readScenes(t, room, Number(bay))).filter((s) => !s.retracted); }
  const used = new Set(), missing = [], matched = [];
  for (const s of compiled) {
    const key = `${s.room}#${s.bay}`;
    const hit = chain[key].find((c) => !used.has(`${key}:${c.seq}`) && same(s, c) && (submittedAt != null && s.from <= submittedAt ? c.from >= s.from : c.from === s.from));
    if (hit) { used.add(`${key}:${hit.seq}`); matched.push({ scene: s, seq: hit.seq }); } else missing.push(s);
  }
  const extra = [];
  for (const key of bays) chain[key].forEach((c) => { if (!used.has(`${key}:${c.seq}`)) extra.push({ key, ...c }); });
  return { ok: missing.length === 0, missing, matched, extra };
}

// What the hall will show at the given heights, from the chain's own timeline (no hall code involved): [{height, bay, seq|null}]
export async function resolveAt(t, room, bay, heights) {
  const tl = await t.ro('world', 'get-timeline', [Cl.stringAscii(room), Cl.uint(bay)]);
  return heights.map((h) => {
    let best = null;
    for (const e of tl) if (e.from <= h && (best === null || e.from >= best.from)) best = e;
    return { height: h, bay, seq: best ? best.seq : null };
  });
}

export async function readPosterConfig(t) {
  const c = await t.ro('posters', 'get-config');
  return { admin: c.admin, pendingAdmin: c['pending-admin'], paused: !!c.paused, reviewLane: !!c['review-lane'], capPerDay: c['cap-per-day'], capLivePerPublisher: c['cap-live-per-publisher'], minGap: c['min-gap'] };
}
export async function readWorldConfig(t) {
  const c = await t.ro('world', 'get-config');
  return { admin: c.admin, pendingAdmin: c['pending-admin'], paused: !!c.paused };
}

const posterFromChain = (id, r) => ({
  id, owner: r.owner, set: r.set, kind: r.kind, head: r.head, sub: r.sub, foot: r.foot, colour: r.colour, art: r.art,
  imageId: r['image-id'], imageHash: r['image-hash'], imageSize: r['image-size'], cols: r.cols, frames: r.frames, fps: r.fps,
  actKind: r['act-kind'], actId: r['act-id'], actText: r['act-text'], weight: r.weight, startDay: r['start-day'], endDay: r['end-day'],
  scope: r.scope, hidden: !!r.hidden, evergreen: !!r.evergreen, payout: r.payout, addedAt: r['added-at'],
});

export async function readPosters(t, ids) {
  const out = [];
  for (let i = 0; i < ids.length; i += 10) {
    const chunk = ids.slice(i, i + 10);
    const rows = await t.ro('posters', 'get-posters', [Cl.list(chunk.map((x) => Cl.uint(x)))]);
    rows.forEach((r, k) => { if (r) out.push(posterFromChain(chunk[k], r)); });
  }
  return out;
}
export async function readAllPosters(t) {
  const n = await t.ro('posters', 'get-count');
  return readPosters(t, Array.from({ length: n }, (_, i) => i));
}
export async function readLive(t) { return t.ro('posters', 'get-live'); }
