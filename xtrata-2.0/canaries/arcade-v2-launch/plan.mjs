// The registry calls for the arcade v2 launch: a hall-only seed of xtrata-world-v2 (the 24 built-in kinds, the arcade and
// hall spaces set live, the four bay objects, one add-states batch that puts every bay on posters) plus an optional
// STATE-only publisher grant on the hall. Pure and browser-safe: no network, no keys, no node modules.
//
// TODO replace with ops/lib/v2.mjs export: another agent is adding a pure, browser-safe function to
// contracts/arcade-world/ops/lib/v2.mjs that returns this call list. Until it lands this file is a thin local copy of
// that planner's conventions (docs/HALL-V2-SCHEMA.md). The canary build cross-checks it, call for call and argument for
// argument, against a dry run of ops/lib/v2.mjs planSeed() with the lobby calls removed, so the two cannot drift silently.
//
// Arguments are in the relay-steps form the ops tools use ({ uint }, { ascii }, { principal }, { bool }, { hex }, { int },
// { tuple }, { list }, { some }); the canary turns them into Clarity values. Space and object ids are passed in, never
// predicted, because the canary resolves them from the chain before every call.

export const ROOT_SPACE = 1;
export const CAP = { STATE: 1, OBJECT: 2 };
/** xtrata-world-v2 admin caps: 1 PAUSE, 2 KINDS, 4 TRUST, 8 MOD. */
export const ADMIN_CAP = { PAUSE: 1, KINDS: 2, TRUST: 4, MOD: 8 };
export const HALL_BAYS = 4;
export const BAY_KEY = 'bay';
export const BAY_PATCH = '{"base":"posters"}';
export const LIMITS = { addStates: 8, kindsPerRead: 20, objectsPerPage: 16 };

// Same as ops/lib/v2.mjs POLICY. The arcade domain holds the rooms; the hall is a leaf that draws only built-in (tier 0)
// kinds, runs native and takes no bindings.
export const POLICY = {
  arcade: { children: 16, descendants: 64, objects: 128, depth: 4, runtimes: 15, tiers: 15, interfaces: 15 },
  hall: { children: 0, descendants: 0, objects: 128, depth: 0, runtimes: 1, tiers: 1, interfaces: 0 },
};
/** The spaces of a hall-only launch, parents first. No lobby: it comes later, by contract writes. */
export const SPACES = [
  { slug: 'arcade', parent: null, kind: 0, title: 'Xtrata Arcade' },
  { slug: 'hall', parent: 'arcade', kind: 1, title: 'Arcade Hall' },
];

// Category numbers (contract / standard): 0 shell 1 material 2 shape 3 prop 4 light 5 audio 6 display 7 door 8 cover.
// Same as ops/lib/v2.mjs categoryOf.
export function categoryOf(key) {
  if (key === 'bay') return 7;
  if (key === 'curtain-house') return 8;
  if (key === 'sign-board') return 6;
  if (key === 'caution-tape') return 3;
  if (key === 'door-skin') return 1;
  if (key === 'work-site' || key === 'hum') return 5;
  if (key.startsWith('light-')) return 4;
  if (key.startsWith('door-')) return 7;
  throw new Error('no category for ' + key);
}
/** The tier-0 kinds in registration order: the bay, then the hall's look vocabulary (catalogue.mjs lookRegistry()). */
export function kindList(looks) {
  return [{ key: 'bay', category: 7, name: 'Bay' }].concat(looks.map((l) => ({ key: l.key, category: categoryOf(l.key), name: l.name })));
}

const U = (n) => ({ uint: n });
const ASCII = (s) => ({ ascii: s });
export const transformArg = () => ({ tuple: { x: { int: 0 }, y: { int: 0 }, z: { int: 0 }, yaw: U(0), scale: U(100) } });
export const policyArg = (o) => ({ tuple: {
  'max-children': U(o.children), 'max-descendants': U(o.descendants), 'max-objects': U(o.objects), 'max-depth': U(o.depth),
  runtimes: U(o.runtimes), tiers: U(o.tiers), interfaces: U(o.interfaces), 'approved-only': { bool: false },
  'portals-in': U(0), 'portals-out': U(0), review: { bool: false }, 'create-fee': U(0),
} });
export const stateArg = (obj) => ({ tuple: { obj: U(obj), from: U(0), patch: ASCII(BAY_PATCH), visibility: U(0), interaction: U(0) } });

// ---- one call each: { fn, args, note } ----
export const registerKind = (k) => ({ fn: 'register-kind', args: [U(ROOT_SPACE), U(k.category), ASCII(k.name), U(0), ASCII(k.key), U(0), { hex: '' }, U(0)], note: `kind ${k.key}` });
/** The space is created with `owner` = the root wallet (review H1: a space belongs to whoever is named here, and moving it later bumps its epoch). */
export const createSpace = (sp, parentId, owner) => ({ fn: 'create-space',
  args: [U(parentId), ASCII(sp.slug), ASCII(sp.title), U(sp.kind), { principal: owner }, U(0), { bool: false }, policyArg(POLICY[sp.slug])], note: `space ${sp.slug}` });
export const setLive = (slug, id) => ({ fn: 'set-space-state', args: [U(id), U(1)], note: `${slug} live` });
export const createBay = (hallId, kindId, i) => ({ fn: 'create-object',
  args: [U(hallId), U(0), U(kindId), ASCII(`bay-${i}`), transformArg(), ASCII('{}')], note: `hall/bay-${i} (bay)` });
export const postersStates = (objs) => (objs.length === 1
  ? { fn: 'add-state', args: [stateArg(objs[0].id)], note: `hall/bay-${objs[0].bay} posters` }
  : { fn: 'add-states', args: [{ list: objs.map((o) => stateArg(o.id)) }], note: `${objs.length} states: ${objs.map((o) => `hall/bay-${o.bay} posters`).join(', ')}` });
export const stateGrant = (hallId, who) => ({ fn: 'grant', args: [U(hallId), { principal: who }, U(CAP.STATE), { bool: false }, U(0)], note: `${who} may change states in hall` });

/**
 * The whole launch on a fresh registry (next-id 2, no kinds), with the ids a fresh registry would hand out. Used by the build to
 * compare this planner with ops/lib/v2.mjs, and by the README for the call count. The canary itself never uses predicted ids.
 */
export function hallOnlyPlan({ owner, kinds, publisher = null }) {
  const steps = kinds.map(registerKind);
  let next = 2;
  const ids = {};
  for (const sp of SPACES) { steps.push(createSpace(sp, sp.parent ? ids[sp.parent] : ROOT_SPACE, owner)); ids[sp.slug] = next++; }
  for (const sp of SPACES) steps.push(setLive(sp.slug, ids[sp.slug]));
  const bays = [];
  for (let i = 0; i < HALL_BAYS; i++) { steps.push(createBay(ids.hall, 0, i)); bays.push({ id: next++, bay: i }); }
  steps.push(postersStates(bays));
  if (publisher) steps.push(stateGrant(ids.hall, publisher));
  return { steps, ids, bays };
}
