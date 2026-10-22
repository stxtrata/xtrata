// Planning for the hall on xtrata-world-v2 (the object registry). Pure functions: no network, no keys, no files.
// Every planner returns { steps, manifest, notes } where `steps` are relay-steps calls (see lib/steps.mjs) and `manifest` is the
// updated record of what exists (ids, base params, the patch each object currently shows). The schema these produce, and that
// recursive-apps/xtrata-arcade/src/parts/world2.js reads, is docs/HALL-V2-SCHEMA.md.
import { lookRegistry, defaultLookBook } from './catalogue.mjs';
import { compileScenes } from './scene.mjs';
import { WIZARDS } from './steps.mjs';

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
// The tier-0 kinds to register on a fresh registry, in a fixed order (so kind ids are predictable): bay, then the v1 look vocabulary.
export function kindRegistry() {
  return [{ key: 'bay', category: 7, name: 'Bay' }].concat(lookRegistry().map((l) => ({ key: l.key, category: categoryOf(l.key), name: l.name })));
}
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
// The arcade domain holds the two rooms; the rooms are leaves that draw only built-in (tier 0) kinds, run native, take no bindings.
const POLICY = {
  arcade: { children: 16, descendants: 64, objects: 128, depth: 4, runtimes: 15, tiers: 15, interfaces: 15 },
  hall: { children: 0, descendants: 0, objects: 128, depth: 0, runtimes: 1, tiers: 1, interfaces: 0 },
  lobby: { children: 0, descendants: 0, objects: 64, depth: 0, runtimes: 1, tiers: 1, interfaces: 0 },
};

/* ------------------------------------------------------------------ helpers */
const json = (o) => JSON.stringify(o);
const same = (a, b) => json(a) === json(b);
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
const clone = (x) => JSON.parse(JSON.stringify(x));
const isAscii = (s) => /^[\x20-\x7e]*$/.test(s);

export function newManifest({ owner, as = 'deployer', nextId = 2, nextKind = 0 } = {}) {
  return { format: MANIFEST_FORMAT, contract: CONTRACT, owner: owner || null, as, nextId, nextKind, spaces: {}, kinds: {}, objects: {} };
}

class Planner {
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

/* ------------------------------------------------------------------ deploy */
export function planDeploy({ owner = WIZARDS.deployer.address, as = 'deployer' } = {}) {
  return { doc: { owner, contracts: { reg: CONTRACT }, steps: [{ as, deploy: CONTRACT, note: 'needs .mock-xtrata-core already deployed at the same address' }] }, manifest: newManifest({ owner, as }) };
}

/* ------------------------------------------------------------------ the shape of the hall */
function ensureKinds(P) {
  if (Object.keys(P.m.kinds).length) return;
  for (const k of kindRegistry()) {
    P.call('register-kind', [U(ROOT), U(k.category), ASCII(k.name), U(0), ASCII(k.key), U(0), { hex: '' }, U(0)], `kind ${k.key}`);
    P.m.kinds[k.key] = P.m.nextKind++;
  }
}
function ensureSpaces(P, owner) {
  const ids = P.m.spaces;
  const make = (slug, parent, kind, title) => {
    if (ids[slug]) return;
    P.call('create-space', [U(parent), ASCII(slug), ASCII(title), U(kind), { principal: owner }, U(0), { bool: false }, policyArg(POLICY[slug])], `space ${slug}`);
    ids[slug] = P.newId();
  };
  make('arcade', ROOT, 0, 'Xtrata Arcade');
  make('hall', ids.arcade, 1, ROOMS['arcade-hall'].title);
  make('lobby', ids.arcade, 1, ROOMS.lobby.title);
  const live = P.m.live || (P.m.live = {});
  for (const s of SPACE_ORDER) if (!live[s]) { P.call('set-space-state', [U(ids[s]), U(1)], `${s} live`); live[s] = true; }
}
function ensureDelegates(P, who) {
  const g = P.m.delegates || (P.m.delegates = {});
  for (const d of who) for (const s of ['hall', 'lobby']) {
    const key = d + '@' + s;
    if (g[key]) continue;
    P.call('grant', [U(P.m.spaces[s]), { principal: d }, U(CAP.STATE | CAP.OBJECT), { bool: false }, U(0)], `${d} may build and change states in ${s}`);
    g[key] = true;
  }
}
function createObject(P, { space, parent, kindKey, name, params, path, parentPath }) {
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
function ensureBays(P) {
  for (const room of Object.values(ROOMS)) for (let i = 0; i < room.bays; i++) {
    const path = `${room.slug}/bay-${i}`;
    if (!P.m.objects[path]) createObject(P, { space: room.slug, parent: 0, kindKey: 'bay', name: `bay-${i}`, params: {}, path });
  }
}

/* ------------------------------------------------------------------ seeding from scene files */
const BASE_NAME = ['posters', 'wall', 'door'];
export const PLAN_BOOK = defaultLookBook();
const builtinOf = (id) => { const l = PLAN_BOOK.find((x) => x.id === id); return l ? l.builtin : null; };

// The objects a scene asks for: a door (when the base is a door) and one per layer, each with an identity
// (kind key + how many of that kind came before it in the scene) so the same sign in the next scene is the same object.
function sceneEntries(s) {
  const out = [], seen = {};
  const add = (key, params) => { const n = (seen[key] = (seen[key] || 0) + 1); out.push({ id: `${key}#${n}`, key, params }); };
  if (s.base === 2 && s.doorLook != null) add(builtinOf(s.doorLook), {});
  for (const l of s.layers) {
    const key = builtinOf(l.look);
    let p;
    try { p = l.params ? JSON.parse(l.params) : {}; } catch { p = {}; }
    if (l.state) p = { ...p, state: l.state };
    add(key, p);
  }
  return out;
}

// docs: parsed scene files (room "arcade-hall" or "lobby"). Compiles with the same checks the v1 tools use, then plans the calls.
//   opts: { owner (address or wizard name), manifest?, height, delegates: [wizard], linkRooms: {name: spaceId}, as, nextId, kindBase }
export function planSeed(docs, opts = {}) {
  const owner = opts.owner || 'deployer';
  const base = opts.manifest || newManifest({ owner: opts.ownerAddress || WIZARDS.deployer.address, as: opts.as || 'deployer', nextId: opts.nextId ?? 2, nextKind: opts.kindBase ?? 0 });
  const P = new Planner(base, { as: opts.as });
  const findings = [];
  const rooms = Object.fromEntries(Object.entries(ROOMS).map(([id, r]) => [id, { bays: r.bays, hidden: false }]));
  for (const n of Object.keys(opts.linkRooms || {})) rooms[n] = { bays: 8, hidden: false };
  const compiled = [];
  for (const doc of docs) {
    const { findings: f, scenes } = compileScenes(doc, { looks: PLAN_BOOK, rooms, height: opts.height ?? null, timelineUsed: {} });
    findings.push(f);
    if (!ROOMS[doc.room]) f.error('room', `a hall scene file is for "arcade-hall" or "lobby" (got ${JSON.stringify(doc.room)})`);
    if (!f.ok) return { ...P.result(), findings };
    compiled.push(...scenes);
  }

  ensureKinds(P);
  ensureSpaces(P, owner);
  ensureDelegates(P, opts.delegates || []);
  const touched = new Set(compiled.map((s) => `${ROOMS[s.room].slug}/bay-${s.bay}`));
  for (const t of touched) if (P.m.objects[t] && P.m.objects[t].states > 0) P.err(`${t} already has states; change it with patch / add / bay instead of seeding it again`);
  ensureBays(P);

  const states = [];                 // [{ path, obj, from, patch, vis, interaction, note }] in per-object chronological order
  const portals = [];
  for (const t of [...touched].sort()) {
    const [space, bayName] = t.split('/'), roomId = Object.keys(ROOMS).find((r) => ROOMS[r].slug === space), bayNo = Number(bayName.slice(4));
    const scenes = compiled.filter((s) => s.room === roomId && s.bay === bayNo).sort((a, b) => a.from - b.from);
    const bay = P.m.objects[t];

    // the portal: one per bay, so every scene that links must link to the same place
    const links = scenes.filter((s) => s.link).map((s) => s.link);
    if (links.length) {
      const l0 = links[0];
      if (links.some((l) => !same(l, l0))) P.err(`${t}: scenes link to different places; a bay has one portal (use another bay)`);
      let to = 0, path = '';
      if (l0.targetRoom) {
        const slug = ROOMS[l0.targetRoom] ? ROOMS[l0.targetRoom].slug : null;
        to = slug ? P.m.spaces[slug] : (opts.linkRooms || {})[l0.targetRoom];
        if (!to) P.err(`${t}: link to room "${l0.targetRoom}" has no space (pass --link-room ${l0.targetRoom}=<space id>)`);
      } else path = l0.path;
      portals.push({ path: t, obj: bay.id, to: to || 0, arrival: 0, urlPath: path });
    }

    // the bay's own timeline: base + interaction per scene
    let prev = null;
    for (const s of scenes) {
      const patch = json({ base: BASE_NAME[s.base] });
      const want = { patch, vis: 0, interaction: s.interaction };
      if (prev && same(prev, want)) continue;
      states.push({ path: t, obj: bay.id, from: s.from, patch, vis: 0, interaction: s.interaction, note: `${t} ${BASE_NAME[s.base]}${s.interaction ? '/' + ['', 'knock', 'peek', 'enter'][s.interaction] : ''}` });
      prev = want;
    }

    // the layer objects: one per identity, created with the params of its first appearance
    const idents = [];                                   // in order of first appearance
    const perScene = scenes.map((s) => { const m = {}; for (const e of sceneEntries(s)) { m[e.id] = e; if (!idents.find((i) => i.id === e.id)) idents.push({ id: e.id, key: e.key, first: e.params }); } return m; });
    const names = {};
    for (const ident of idents) {
      const short = shortName(ident.key), n = (names[short] = (names[short] || 0) + 1);
      const name = n === 1 ? short : `${short}-${n}`;
      const path = `${t}/${name}`;
      if (idents.length > LIMITS.children) P.err(`${t}: more than ${LIMITS.children} objects`);
      const id = createObject(P, { space, parent: bay.id, kindKey: ident.key, name, params: ident.first, path, parentPath: t });
      if (id == null) continue;
      let eff = { vis: 0, params: ident.first };
      scenes.forEach((s, i) => {
        const e = perScene[i][ident.id];
        const want = e ? { vis: 0, params: e.params } : { vis: 1, params: ident.first };
        if (want.vis === eff.vis && (want.vis === 1 || same(want.params, eff.params))) return;
        const patch = want.vis === 1 ? '{}' : json(diffPatch(ident.first, want.params));
        if (patch.length > LIMITS.patch) P.err(`${path}: the change at block ${s.from} needs ${patch.length} patch characters; the contract allows ${LIMITS.patch}`);
        states.push({ path, obj: id, from: s.from, patch, vis: want.vis, interaction: 0, note: `${path} ${want.vis ? 'hide' : 'show'}` });
        eff = want;
      });
    }
  }
  for (const p of portals) {
    P.call('set-portal', [U(p.obj), { some: { tuple: { 'to-space': U(p.to), arrival: U(p.arrival), path: ASCII(p.urlPath) } } }], `${p.path} leads ${p.to ? 'to space ' + p.to : p.urlPath}`);
    P.m.objects[p.path].portal = p.to ? { to: p.to } : { path: p.urlPath };
  }
  emitStates(P, states);
  return { ...P.result(), findings };
}

// Group states into add-states calls of at most 8 (all or nothing), keeping every object's states in order.
function emitStates(P, states) {
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
  let patch = a.replace ? {} : clone(o.patch || {});
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

/* ------------------------------------------------------------------ packing */
// Split a steps document into documents of at most `size` steps (a node keeps 25 unconfirmed transactions per sender).
export function chunkSteps(doc, size = 24) {
  const out = [];
  for (let i = 0; i < doc.steps.length; i += size) out.push({ ...doc, steps: doc.steps.slice(i, i + size) });
  return out;
}
