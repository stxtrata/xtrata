// The reader snapshot the hall uses (see world.js loadSnapshot), built from tool data instead of a live chain.
// Used by the local preview: lets the real hall show a scene file at any block height.
import { BASES } from './catalogue.mjs';
const BASE_NAME = ['posters', 'wall', 'door'];

// Which scene (index in `scenes`, which must all be for one room) is showing in a bay at `height`, and when the next one starts.
export function resolveScenes(scenes, bay, height) {
  const mine = scenes.map((s, i) => ({ s, i })).filter((x) => x.s.bay === bay);
  let active = null, next = null;
  for (const { s, i } of mine) {
    const from = Math.max(s.from, 0);
    if (from <= height) { if (!active || from >= active.s.from) active = { s, i }; }
    else if (next === null || from < next) next = from;
  }
  return { active, nextHeight: next };
}

// bayCount bays. looks: the look book. Returns a snapshot in the hall's shape. Posters are optional (empty = the hall's own wall).
export function snapshotAt({ scenes, looks, height, bayCount = 4, posters = [], versions = { posters: 1, world: 1 } }) {
  const lookTable = {};
  for (const l of looks) lookTable[l.id] = { kind: l.kind, name: l.name, tier: l.tier, builtin: l.builtin, hidden: !!l.hidden, approved: !!l.approved };
  const bays = [];
  for (let b = 0; b < bayCount; b++) {
    const { active, nextHeight } = resolveScenes(scenes, b, height);
    const s = active && active.s;
    bays.push({
      scene: s ? {
        base: BASE_NAME[s.base], baseId: s.base, interaction: s.interaction, doorLook: s.doorLook,
        layers: s.layers.map((l) => ({ slot: l.slot, look: l.look, params: l.params, state: l.state })),
        link: s.link ? { 'target-room': s.link.targetRoom, 'arrival-bay': s.link.arrivalBay, path: s.link.path } : null,
        fromHeight: s.from,
      } : null,
      nextHeight, height,
    });
  }
  return { versions, at: 0, posters, pins: [], pinned: {}, suppressed: [], bays, looks: lookTable };
}

export { BASES };
