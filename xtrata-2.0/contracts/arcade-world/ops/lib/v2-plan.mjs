// Planning for the hall on xtrata-world-v2 (the object registry): the PURE part. No imports at all (no Node built-ins, no
// network, no keys, no files), so a browser page can import this file directly and replay the calls with a wallet.
// ops/lib/v2.mjs re-exports everything here and adds the parts that need Node (scene files, the hall's own source).
//
// Every planner returns { steps, manifest, notes, errors, doc } where `steps` are relay-steps calls (see lib/steps.mjs for the
// argument forms) and `manifest` is the updated record of what exists (ids, base params, the patch each object currently
// shows). The schema these produce, and that recursive-apps/xtrata-arcade/src/parts/world2.js reads, is docs/HALL-V2-SCHEMA.md.
//
// Ids are PREDICTED: spaces and objects share the contract's `next-id` counter (it starts at 2) and kinds count from 0, so the
// calls must land in the planned order and in full. verifyManifest() reads the chain back and stops at the first id that differs.

export const MANIFEST_FORMAT = 'arcade-hall-v2-manifest/1';
export const CONTRACT = 'xtrata-world-v2';
export const ROOT = 1;
export const CAP = { STATE: 1, OBJECT: 2 };
export const LIMITS = { states: 8, patch: 256, params: 512, name: 24, slug: 24, children: 32, addStates: 8 };

// The hall's rooms: the scene-file room id -> its space in the registry, and how many bays it has.
export const ROOMS = {
  'arcade-hall': { slug: 'hall', title: 'Arcade Hall', bays: 4, objects: 128 },
  lobby: { slug: 'lobby', title: 'Lobby', bays: 2, objects: 64 },
};
export const ROOM_IDS = Object.keys(ROOMS);
export const SPACE_ORDER = ['arcade', 'hall', 'lobby'];   // arcade first; hall and lobby are its children

/* ------------------------------------------------------------------ kinds */
// Category numbers (contract / standard): 0 shell 1 material 2 shape 3 prop 4 light 5 audio 6 display 7 door 8 cover 9 interactive 10 container.
// The bay is category 7 because only category-7 objects can carry a portal (set-portal), and a bay is where a doorway goes.
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
// The tier-0 kinds a fresh registry gets, in order (ids 0..23). The Node tools derive this list from the hall's own source
// (v2.mjs kindRegistry()); tests/hall-v2-seed.test.mjs checks the two are identical, so this copy cannot drift.
export const HALL_KINDS = Object.freeze([
  ['bay', 7, 'Bay'], ['curtain-house', 8, 'House curtain'], ['sign-board', 6, 'Sign board'], ['caution-tape', 3, 'Caution tape'],
  ['work-site', 5, 'Work site sounds'], ['hum', 5, 'Room hum'], ['light-steady', 4, 'Steady light'], ['light-pulse', 4, 'Pulsing light'],
  ['light-flicker', 4, 'Flickering light'], ['door-skin', 1, 'Door skin'],
  ...['rect', 'tall', 'wide', 'arch', 'gothic', 'double', 'cathedral', 'circle', 'oval', 'hexagon', 'octagon', 'industrial', 'vintage', 'scifi']
    .map((s) => ['door-' + s, 7, 'Door: ' + s]),
].map(([key, category, name]) => Object.freeze({ key, category, name })));

const NAME_OF = { 'curtain-house': 'curtain', 'sign-board': 'sign', 'caution-tape': 'tape', 'door-skin': 'skin', 'work-site': 'work', hum: 'hum', 'light-steady': 'lamp', 'light-pulse': 'lamp', 'light-flicker': 'lamp' };
export const shortName = (key) => (key.startsWith('door-') && key !== 'door-skin' ? 'door' : NAME_OF[key] || key.slice(0, 20));

/* ------------------------------------------------------------------ argument builders (relay-steps forms) */
export const U = (n) => ({ uint: n });
export const ASCII = (s) => ({ ascii: s });
export const transformArg = () => ({ tuple: { x: { int: 0 }, y: { int: 0 }, z: { int: 0 }, yaw: U(0), scale: U(100) } });
export const stateArg = (obj, from, patch, visibility, interaction) => ({ tuple: { obj: U(obj), from: U(from), patch: ASCII(patch), visibility: U(visibility), interaction: U(interaction) } });
export const policyArg = (o) => ({ tuple: {
  'max-children': U(o.children), 'max-descendants': U(o.descendants), 'max-objects': U(o.objects), 'max-depth': U(o.depth),
  runtimes: U(o.runtimes), tiers: U(o.tiers), interfaces: U(o.interfaces), 'approved-only': { bool: !!o.approved },
  'portals-in': U(o.portalsIn ?? 0), 'portals-out': U(o.portalsOut ?? 0), review: { bool: !!o.review }, 'create-fee': U(0),
} });
// A relay-steps argument -> a Clarity value, with the caller's own `Cl` (from @stacks/transactions; in a browser, whatever bundle
// the page loaded). `who` maps a name to an address (default: unchanged).
export function clarityArg(a, Cl, who = (v) => v) {
  if (a == null || typeof a !== 'object') throw new Error('bad argument ' + JSON.stringify(a));
  const cv = (x) => clarityArg(x, Cl, who);
  if ('uint' in a) return Cl.uint(a.uint);
  if ('int' in a) return Cl.int(a.int);
  if ('ascii' in a) return Cl.stringAscii(a.ascii);
  if ('bool' in a) return Cl.bool(a.bool);
  if ('principal' in a) return Cl.principal(who(a.principal));
  if ('hex' in a) {
    if (!/^([0-9a-fA-F]{2})*$/.test(a.hex)) throw new Error('hex argument must be pairs of hex digits');
    return Cl.buffer(Uint8Array.from((a.hex.match(/../g) || []).map((x) => parseInt(x, 16))));
  }
  if ('none' in a) return Cl.none();
  if ('some' in a) return Cl.some(cv(a.some));
  if ('list' in a) return Cl.list(a.list.map(cv));
  if ('tuple' in a) return Cl.tuple(Object.fromEntries(Object.entries(a.tuple).map(([k, v]) => [k, cv(v)])));
  throw new Error('unknown argument form ' + JSON.stringify(a));
}

// The arcade domain holds the rooms; the rooms are leaves that draw only built-in (tier 0) kinds, run native, take no bindings.
export const SPACE_POLICY = {
  arcade: { children: 16, descendants: 64, objects: 128, depth: 4, runtimes: 15, tiers: 15, interfaces: 15 },
  hall: { children: 0, descendants: 0, objects: 128, depth: 0, runtimes: 1, tiers: 1, interfaces: 0 },
  lobby: { children: 0, descendants: 0, objects: 64, depth: 0, runtimes: 1, tiers: 1, interfaces: 0 },
};

/* ------------------------------------------------------------------ helpers */
const json = (o) => JSON.stringify(o);
export const same = (a, b) => json(a) === json(b);
export function diffPatch(base, want) {
  const p = {};
  for (const k of Object.keys(want)) if (!(k in base) || !same(base[k], want[k])) p[k] = want[k];
  for (const k of Object.keys(base)) if (!(k in want)) p[k] = null;
  return p;
}
export function applyPatch(base, patch) {
  const o = { ...base };
  for (const [k, v] of Object.entries(patch || {})) { if (v === null) delete o[k]; else o[k] = v; }
  return o;
}
export const clone = (x) => JSON.parse(JSON.stringify(x));
export const isAscii = (s) => /^[\x20-\x7e]*$/.test(s);

export function newManifest({ owner, as = 'deployer', nextId = 2, nextKind = 0 } = {}) {
  return { format: MANIFEST_FORMAT, contract: CONTRACT, owner: owner || null, as, nextId, nextKind, spaces: {}, kinds: {}, objects: {} };
}

export class Planner {
  constructor(manifest, { as } = {}) {
    this.m = clone(manifest);
    this.as = as || this.m.as || 'deployer';
    this.steps = []; this.notes = []; this.errors = [];
  }
  call(fn, args, note, as = this.as) { this.steps.push({ as, contract: 'reg', fn, args, note }); }
  err(msg) { this.errors.push(msg); }
  newId() { return this.m.nextId++; }
  obj(path) { const o = this.m.objects[path]; if (!o) this.err(`no object "${path}" in the manifest`); return o; }
  result() {
    return { steps: this.steps, manifest: this.m, notes: this.notes, errors: this.errors, doc: stepsDoc(this.m, this.steps) };
  }
}
export function stepsDoc(manifest, steps) {
  return { owner: manifest.owner, contracts: { reg: CONTRACT }, steps };
}

/* ------------------------------------------------------------------ the shape of the hall */
// `rooms`: which of ROOMS to build (scene-file room ids). The hall alone is ['arcade-hall']; the lobby can follow later.
export const roomsFor = ({ hallOnly, rooms } = {}) => (rooms ? rooms.slice() : hallOnly ? ['arcade-hall'] : ROOM_IDS.slice());
const slugsOf = (rooms) => ROOM_IDS.filter((r) => rooms.includes(r)).map((r) => ROOMS[r].slug);

export function ensureKinds(P, kinds = HALL_KINDS) {
  if (Object.keys(P.m.kinds).length) return;
  for (const k of kinds) {
    P.call('register-kind', [U(ROOT), U(k.category), ASCII(k.name), U(0), ASCII(k.key), U(0), { hex: '' }, U(0)], `kind ${k.key}`);
    P.m.kinds[k.key] = P.m.nextKind++;
  }
}
export function ensureSpaces(P, owner, rooms = ROOM_IDS) {
  const ids = P.m.spaces;
  const make = (slug, parent, kind, title) => {
    if (ids[slug]) return;
    P.call('create-space', [U(parent), ASCII(slug), ASCII(title), U(kind), { principal: owner }, U(0), { bool: false }, policyArg(SPACE_POLICY[slug])], `space ${slug}`);
    ids[slug] = P.newId();
  };
  make('arcade', ROOT, 0, 'Xtrata Arcade');
  for (const r of ROOM_IDS) if (rooms.includes(r)) make(ROOMS[r].slug, ids.arcade, 1, ROOMS[r].title);
  const live = P.m.live || (P.m.live = {});
  const want = ['arcade', ...slugsOf(rooms)];
  for (const s of SPACE_ORDER) if (want.includes(s) && !live[s]) { P.call('set-space-state', [U(ids[s]), U(1)], `${s} live`); live[s] = true; }
}
// Publishers and bots get STATE only (they change what existing objects show; they never add objects, bindings or doors).
// `expires`: a burn height after which the grant lapses (0 = until revoked).
export function ensureDelegates(P, who, { rooms = ROOM_IDS, expires = 0 } = {}) {
  const g = P.m.delegates || (P.m.delegates = {});
  for (const d of who) for (const s of slugsOf(rooms)) {
    const key = d + '@' + s;
    if (g[key]) continue;
    P.call('grant', [U(P.m.spaces[s]), { principal: d }, U(CAP.STATE), { bool: false }, U(expires)],
      `${d} may change states in ${s}${expires ? ' until block ' + expires : ''}`);
    g[key] = { caps: CAP.STATE, expires };
  }
}
export function createObject(P, { space, parent, kindKey, name, params, path, parentPath }) {
  const kind = P.m.kinds[kindKey];
  if (kind == null) { P.err(`kind "${kindKey}" is not in the manifest`); return null; }
  const text = json(params);
  if (text.length > LIMITS.params) P.err(`${path}: params are ${text.length} characters; the contract allows ${LIMITS.params}`);
  if (!isAscii(text)) P.err(`${path}: params must be printable ASCII`);
  if (name.length > LIMITS.name) P.err(`${path}: name "${name}" is longer than ${LIMITS.name}`);
  P.call('create-object', [U(P.m.spaces[space]), U(parent), U(kind), ASCII(name), transformArg(), ASCII(text)], `${path} (${kindKey})`);
  const id = P.newId();
  P.m.objects[path] = { id, space, kind: kindKey, name, parent: parentPath || null, base: clone(params), patch: {}, vis: 0, interaction: 0, states: 0, retracted: [] };
  return id;
}
export function ensureBays(P, rooms = ROOM_IDS) {
  for (const r of ROOM_IDS) {
    if (!rooms.includes(r)) continue;
    const room = ROOMS[r];
    for (let i = 0; i < room.bays; i++) {
      const path = `${room.slug}/bay-${i}`;
      if (!P.m.objects[path]) createObject(P, { space: room.slug, parent: 0, kindKey: 'bay', name: `bay-${i}`, params: {}, path });
    }
  }
}

// The structure of the hall without any scenes: kinds, the arcade, the rooms, live, publisher grants, bay objects.
//   opts: { manifest?, owner, ownerAddress?, as?, hallOnly?, rooms?, delegates?: [name|address], delegateExpires?, kinds?, nextId?, kindBase? }
export function planHallBase(opts = {}) {
  const base = opts.manifest || newManifest({ owner: opts.ownerAddress || opts.owner || null, as: opts.as || 'deployer', nextId: opts.nextId ?? 2, nextKind: opts.kindBase ?? 0 });
  const P = new Planner(base, { as: opts.as });
  const rooms = roomsFor(opts);
  ensureKinds(P, opts.kinds || HALL_KINDS);
  ensureSpaces(P, opts.owner || 'deployer', rooms);
  ensureDelegates(P, opts.delegates || [], { rooms, expires: opts.delegateExpires || 0 });
  ensureBays(P, rooms);
  return { P, rooms };
}

/* ------------------------------------------------------------------ for a browser: the whole launch as one ordered call list */
const ADDRESS = { testnet: /^S[TN][0-9A-HJKMNP-TV-Z]{38,40}$/, mainnet: /^S[PM][0-9A-HJKMNP-TV-Z]{38,40}$/ };
// Every call, in order, that builds the hall on a fresh registry for `owner` on `network`, signed by the owner's wallet.
//   { network: 'testnet'|'mainnet', owner: 'ST…' (the registry's deployer = root owner), contractName?, hallOnly? (default true),
//     publisher?: 'ST…' (STATE-only grant), publisherExpires?: burn height, rooms?: [{ slug, title, objects?, entry?: {id, hash, size} }],
//     nextId?, nextKind? (for a registry that already holds something) }
// -> { network, contract: 'ST….xtrata-world-v2', calls: [{ fn, args, note }], manifest, errors, notes }
// `args` are relay-steps forms: turn each into a Clarity value with clarityArg(arg, Cl). The browser replays them one at a time,
// each after the previous one confirmed, then may run verifyManifest() with its own read function.
export function launchCalls(opts = {}) {
  const network = opts.network || 'testnet';
  const errors = [];
  if (!ADDRESS[network]) errors.push(`network must be testnet or mainnet (got ${JSON.stringify(network)})`);
  else if (!ADDRESS[network].test(String(opts.owner || ''))) errors.push(`owner must be a ${network} address (got ${JSON.stringify(opts.owner)})`);
  if (opts.publisher && ADDRESS[network] && !ADDRESS[network].test(String(opts.publisher))) errors.push(`publisher must be a ${network} address`);
  const contract = `${opts.owner}.${opts.contractName || CONTRACT}`;
  if (errors.length) return { network, contract, calls: [], manifest: null, errors, notes: [] };
  const { P } = planHallBase({
    owner: opts.owner, ownerAddress: opts.owner, as: opts.owner, hallOnly: opts.hallOnly !== false, rooms: opts.lobby ? ROOM_IDS : undefined,
    delegates: opts.publisher ? [opts.publisher] : [], delegateExpires: opts.publisherExpires || 0, nextId: opts.nextId, kindBase: opts.nextKind,
  });
  for (const r of opts.rooms || []) addRoom(P, r);
  P.m.contract = opts.contractName || CONTRACT;
  return { network, contract, calls: P.steps.map((s) => ({ fn: s.fn, args: s.args, note: s.note })), manifest: P.m, errors: P.errors, notes: P.notes };
}

/* ------------------------------------------------------------------ one change at a time */
// Parse "--when": absolute height, or +N / +Nm / +Nh / +Nd from `height`. 0 / undefined = now.
export function whenOf(at, height) {
  if (at == null || at === '' || at === '0') return 0;
  const m = /^\+(\d+)(m|h|d)?$/.exec(String(at));
  if (m) {
    if (height == null) throw new Error('--at is relative; give --height N');
    const n = Number(m[1]);
    return height + (m[2] === 'm' ? Math.ceil(n / 10) : m[2] === 'h' ? Math.ceil(n * 6) : m[2] === 'd' ? n * 144 : n);
  }
  if (/^\d+$/.test(String(at))) return Number(at);
  throw new Error(`--at: expected a block height or +N / +Nm / +Nh / +Nd (got ${at})`);
}

// Group states into add-states calls of at most 8 (all or nothing), keeping every object's states in order.
export function emitStates(P, states) {
  const per = {};
  for (const s of states) {
    const o = P.m.objects[s.path];
    per[s.path] = (per[s.path] || o.states) + 1;
    if (per[s.path] > LIMITS.states) P.err(`${s.path}: more than ${LIMITS.states} states on one timeline; compact it first (compact-object)`);
  }
  for (let i = 0; i < states.length; i += LIMITS.addStates) {
    const chunk = states.slice(i, i + LIMITS.addStates);
    const note = chunk.length === 1 ? chunk[0].note : `${chunk.length} states: ${chunk.map((c) => c.note).slice(0, 3).join(', ')}${chunk.length > 3 ? ', …' : ''}`;
    P.call(chunk.length === 1 ? 'add-state' : 'add-states',
      chunk.length === 1 ? [stateArg(chunk[0].obj, chunk[0].from, chunk[0].patch, chunk[0].vis, chunk[0].interaction)] : [{ list: chunk.map((c) => stateArg(c.obj, c.from, c.patch, c.vis, c.interaction)) }], note);
  }
  for (const s of states) {
    const o = P.m.objects[s.path];
    o.states++; o.live = (o.live ?? 0) + 1;
    o.patch = JSON.parse(s.patch); o.vis = s.vis; o.interaction = s.interaction;
  }
}

function liveCheck(P, path, o, compact) {
  const live = o.live ?? o.states - o.retracted.length;
  if (live >= LIMITS.states) {
    if (!compact) P.err(`${path} already holds ${live} live states (the limit is ${LIMITS.states}); add --compact to free the old ones first`);
    else { P.call('compact-object', [U(o.id)], `${path}: drop old states`); o.live = 1; }
  }
}

// Change ONE object: new params (merged into what it shows now, null removes a key), and/or show/hide it. One add-state call.
//   { object: 'hall/bay-0/sign', params?: {text:'HELLO'}, replace?: bool, hide?: bool, show?: bool, at?, height?, compact?, as? }
export function planPatch(manifest, a) {
  const P = new Planner(manifest, { as: a.as });
  const o = P.obj(a.object);
  if (!o) return P.result();
  if (o.kind === 'bay') { P.err('a bay is changed with the bay command (base / interaction)'); return P.result(); }
  const from = whenOf(a.at, a.height);
  const patch = a.replace ? {} : clone(o.patch || {});
  for (const [k, v] of Object.entries(a.params || {})) patch[k] = v;
  const vis = a.hide ? 1 : 0;
  // a patch holds the difference from the object's own params: drop keys that change nothing
  for (const k of Object.keys(patch)) if (patch[k] !== null && k in o.base && same(o.base[k], patch[k])) delete patch[k];
  const text = json(patch);
  if (text.length > LIMITS.patch) P.err(`${a.object}: the patch is ${text.length} characters; the contract allows ${LIMITS.patch}`);
  if (!isAscii(text)) P.err(`${a.object}: the patch must be printable ASCII`);
  liveCheck(P, a.object, o, a.compact);
  P.call('add-state', [stateArg(o.id, from, text, vis, 0)], `${a.object} ${vis ? 'hide' : (a.params ? 'change ' + Object.keys(a.params).join(',') : 'show')}${from ? ' at ' + from : ''}`);
  o.states++; o.live = (o.live ?? 0) + 1; o.patch = patch; o.vis = vis;
  return P.result();
}

// Add ONE new object under a bay: a sign, tape, lamp, curtain, sound or door. create-object (+ a hidden-then-shown pair when --at is set).
//   { bay: 'hall/bay-1', kind: 'sign-board', name?, params?, at?, height?, as? }
export function planAdd(manifest, a) {
  const P = new Planner(manifest, { as: a.as });
  const bay = P.obj(a.bay);
  if (!bay) return P.result();
  if (bay.kind !== 'bay') { P.err(`${a.bay} is not a bay`); return P.result(); }
  if (!(a.kind in P.m.kinds)) { P.err(`unknown kind "${a.kind}" (${Object.keys(P.m.kinds).join(', ')})`); return P.result(); }
  const kids = Object.values(P.m.objects).filter((x) => x.parent === a.bay).length;
  if (kids >= LIMITS.children) P.err(`${a.bay} already has ${kids} objects (the limit is ${LIMITS.children})`);
  let name = a.name || shortName(a.kind);
  if (!a.name) { let n = 1; while (P.m.objects[`${a.bay}/${name}`]) name = `${shortName(a.kind)}-${++n}`; }
  const path = `${a.bay}/${name}`;
  if (P.m.objects[path]) P.err(`${path} already exists`);
  const id = createObject(P, { space: bay.space, parent: bay.id, kindKey: a.kind, name, params: a.params || {}, path, parentPath: a.bay });
  const from = whenOf(a.at, a.height);
  if (id != null && from) {
    emitStates(P, [
      { path, obj: id, from: 0, patch: '{}', vis: 1, interaction: 0, note: `${path} hidden until ${from}` },
      { path, obj: id, from, patch: '{}', vis: 0, interaction: 0, note: `${path} appears at ${from}` },
    ]);
    P.notes.push(`${path} is hidden now and appears at block ${from}`);
  }
  return P.result();
}

export const BASE_NAME = ['posters', 'wall', 'door'];

// Change a bay's own state: its base and/or interaction (and optionally hide it = show the posters). One add-state call.
//   { bay: 'hall/bay-0', base?: 'posters'|'wall'|'door', interaction?: 'none'|'knock'|'peek'|'enter'|n, hide?, at?, height?, compact?, as? }
export function planBay(manifest, a) {
  const P = new Planner(manifest, { as: a.as });
  const o = P.obj(a.bay);
  if (!o) return P.result();
  if (o.kind !== 'bay') { P.err(`${a.bay} is not a bay`); return P.result(); }
  const I = { none: 0, knock: 1, peek: 2, enter: 3 };
  const interaction = a.interaction == null ? o.interaction : (a.interaction in I ? I[a.interaction] : Number(a.interaction));
  if (!(interaction >= 0 && interaction <= 3)) P.err('interaction must be none, knock, peek or enter');
  if (interaction === 3 && !o.portal) P.err(`${a.bay} has no portal; "enter" needs a door that leads somewhere`);
  if (a.base != null && !BASE_NAME.includes(a.base)) P.err('base must be posters, wall or door');
  const patch = { ...(o.patch || {}) };
  if (a.base != null) patch.base = a.base;
  if (!patch.base) patch.base = 'posters';
  liveCheck(P, a.bay, o, a.compact);
  P.call('add-state', [stateArg(o.id, whenOf(a.at, a.height), json(patch), a.hide ? 1 : 0, interaction)], `${a.bay} ${patch.base}${interaction ? '/' + ['', 'knock', 'peek', 'enter'][interaction] : ''}`);
  o.states++; o.live = (o.live ?? 0) + 1; o.patch = patch; o.vis = a.hide ? 1 : 0; o.interaction = interaction;
  return P.result();
}

// Put a bay back to posters. Default: retract every state the bay has (history stays readable on chain), so no state is active.
// --soft instead adds one hidden state (one call, undoable by adding a state).
//   { bay, soft?, seqs?: [n], as? }
export function planReset(manifest, a) {
  const P = new Planner(manifest, { as: a.as });
  const o = P.obj(a.bay);
  if (!o) return P.result();
  if (o.kind !== 'bay') { P.err(`${a.bay} is not a bay`); return P.result(); }
  if (a.soft) {
    liveCheck(P, a.bay, o, a.compact);
    P.call('add-state', [stateArg(o.id, 0, '{"base":"posters"}', 1, 0)], `${a.bay} back to posters (hidden state)`);
    o.states++; o.live = (o.live ?? 0) + 1; o.patch = { base: 'posters' }; o.vis = 1; o.interaction = 0;
    return P.result();
  }
  const seqs = a.seqs || Array.from({ length: o.states }, (_, i) => i).filter((i) => !o.retracted.includes(i));
  if (!seqs.length) P.notes.push(`${a.bay} has no live states: it already shows posters`);
  for (const q of seqs) { P.call('retract-state', [U(o.id), U(q)], `${a.bay} retract #${q}`); if (!o.retracted.includes(q)) o.retracted.push(q); }
  o.live = Math.max(0, o.states - o.retracted.length);
  return P.result();
}

/* ------------------------------------------------------------------ a new room (a space a portal can lead to) */
const hex32 = (h) => /^(0x)?[0-9a-fA-F]{64}$/.test(String(h || ''));
function entryArg(e) { return { some: { tuple: { id: U(e.id), hash: { hex: String(e.hash).replace(/^0x/, '') }, size: U(e.size) } } }; }
// Inside a Planner: create the room (draft), set its entry when given (the inscription the hall opens it from), set it live.
// A room that exists already only gets its entry set.
function addRoom(P, a) {
  const slug = String(a.slug || ''), title = String(a.title || '');
  const exists = !!P.m.spaces[slug];
  if (a.entry) {
    const e = a.entry;
    if (!(Number.isInteger(e.id) && e.id >= 0)) P.err(`entry: inscription id must be a whole number (got ${JSON.stringify(e.id)})`);
    if (!hex32(e.hash)) P.err('entry: hash must be 32 bytes of hex (read it from the core: get-inscription-hash)');
    if (!(Number.isInteger(e.size) && e.size > 0)) P.err('entry: size must be a positive whole number (get-inscription-size)');
  }
  if (exists && !a.entry) P.err(`space "${slug}" already exists (id ${P.m.spaces[slug]})`);
  if (!exists) {
    if (!/^[a-z][a-z0-9-]{1,23}$/.test(slug)) P.err(`room slug "${slug}": lowercase letters, digits and dashes, 2 to 24 characters`);
    if (!isAscii(title) || !title || title.length > 48) P.err('room title: 1 to 48 printable ASCII characters');
    if (!P.m.spaces.arcade) P.err('the manifest has no arcade space: seed the hall first');
  }
  if (P.errors.length) return;
  if (!exists) {
    P.call('create-space', [U(P.m.spaces.arcade), ASCII(slug), ASCII(title), U(1), { principal: P.m.owner }, U(0), { bool: false }, policyArg({ ...SPACE_POLICY.lobby, objects: a.objects || SPACE_POLICY.lobby.objects })], `space ${slug}`);
    P.m.spaces[slug] = P.newId();
  }
  if (a.entry) {
    P.call('set-space-entry', [U(P.m.spaces[slug]), entryArg(a.entry)], `${slug} opens from inscription #${a.entry.id}`);
    (P.m.entries || (P.m.entries = {}))[slug] = { id: a.entry.id, hash: String(a.entry.hash).replace(/^0x/, '').toLowerCase(), size: a.entry.size };
  }
  if (!exists) {
    P.call('set-space-state', [U(P.m.spaces[slug]), U(1)], `${slug} live`);
    (P.m.live || (P.m.live = {}))[slug] = true;
    P.notes.push(`space ${slug} = id ${P.m.spaces[slug]}: link a door to it with: seed <lobby scene file> --link-room ${slug}=${P.m.spaces[slug]}`);
  }
}
// A leaf room under the arcade, set live, recorded in the manifest. A room whose page is its own app (the casino) is only a destination:
// the lobby door's portal leads to it and the hall opens the page listed under that slug in window.XA_ROOMS (or the room's entry).
//   { slug, title, objects?, entry?: { id, hash, size }, as? }
export function planRoom(manifest, a) {
  const P = new Planner(manifest, { as: a.as });
  addRoom(P, a);
  return P.result();
}

/* ------------------------------------------------------------------ packing */
// Split a steps document into documents of at most `size` steps (a node keeps 25 unconfirmed transactions per sender).
export function chunkSteps(doc, size = 24) {
  const out = [];
  for (let i = 0; i < doc.steps.length; i += size) out.push({ ...doc, steps: doc.steps.slice(i, i + size) });
  return out;
}

/* ------------------------------------------------------------------ read-back */
// Check that the chain holds what the manifest predicts, in plan order (kinds, spaces, objects, grants), and stop at the FIRST
// difference. `read(fn, args)` makes one read-only call on the registry (args in relay-steps forms) and returns plain JS
// (uint -> number, none -> null, tuples -> objects with the contract's field names, buffers -> '0x…').
// -> { ok: true, checked } or { ok: false, checked, what, expected, got }
export async function verifyManifest(m, read) {
  let checked = 0;
  const bad = (what, expected, got) => ({ ok: false, checked, what, expected, got: got === undefined ? null : got });
  const kinds = Object.entries(m.kinds || {}).sort((a, b) => a[1] - b[1]);
  for (let i = 0; i < kinds.length; i += 20) {
    const chunk = kinds.slice(i, i + 20);
    const rows = await read('get-kinds', [{ list: chunk.map(([, id]) => U(id)) }]);
    for (let j = 0; j < chunk.length; j++) {
      const [key, id] = chunk[j], k = rows && rows[j];
      if (!k || k.builtin !== key || k.tier !== 0) return bad(`kind ${key} (id ${id})`, { builtin: key, tier: 0 }, k && { builtin: k.builtin, tier: k.tier });
      checked++;
    }
  }
  const spaces = Object.entries(m.spaces || {}).sort((a, b) => a[1] - b[1]);
  for (const [slug, id] of spaces) {
    const path = slug === 'arcade' ? ['arcade'] : ['arcade', slug];
    const got = await read('resolve-path', [{ list: path.map(ASCII) }]);
    if (got !== id) return bad(`space ${path.join('/')}`, id, got);
    checked++;
    const sp = await read('get-space', [U(id)]);
    if (m.live && m.live[slug] && !(sp && sp.state === 1)) return bad(`space ${slug} is live`, 1, sp && sp.state);
    const e = m.entries && m.entries[slug];
    if (e) {
      const ge = sp && sp.entry;
      if (!ge || ge.id !== e.id || ge.size !== e.size || String(ge.hash).replace(/^0x/, '').toLowerCase() !== e.hash) return bad(`space ${slug} entry`, e, ge);
      checked++;
    }
  }
  const objects = Object.entries(m.objects || {}).sort((a, b) => a[1].id - b[1].id);
  for (const [path, o] of objects) {
    const got = await read('get-object', [U(o.id)]);
    const want = { space: m.spaces[o.space], name: o.name, kind: m.kinds[o.kind], parent: o.parent ? m.objects[o.parent].id : 0 };
    const have = got && { space: got.space, name: got.name, kind: got.kind, parent: got.parent };
    if (!have || !same(want, have)) return bad(`object ${path} (id ${o.id})`, want, have);
    checked++;
  }
  for (const [key, g] of Object.entries(m.delegates || {})) {
    const [who, slug] = key.split('@');
    const row = await read('get-grant', [U(m.spaces[slug]), { principal: who }]);
    const caps = typeof g === 'object' ? g.caps : null;
    if (!row || (caps != null && row.caps !== caps)) return bad(`grant ${key}`, caps == null ? 'a grant' : { caps }, row && { caps: row.caps });
    checked++;
  }
  return { ok: true, checked };
}
