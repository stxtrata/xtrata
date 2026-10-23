// Planning for the hall on xtrata-world-v2 (the object registry). No network, no keys, no file writes.
// The pure planners (no Node built-ins: a browser can import them) live in ./v2-plan.mjs and are re-exported here unchanged;
// this file adds what needs Node: scene files (compileScenes) and the kind list read from the hall's own source.
// Every planner returns { steps, manifest, notes } where `steps` are relay-steps calls (see lib/steps.mjs) and `manifest` is the
// updated record of what exists (ids, base params, the patch each object currently shows). The schema these produce, and that
// recursive-apps/xtrata-arcade/src/parts/world2.js reads, is docs/HALL-V2-SCHEMA.md.
import { lookRegistry, defaultLookBook } from './catalogue.mjs';
import { compileScenes } from './scene.mjs';
import { WIZARDS } from './steps.mjs';
import {
  CONTRACT, ROOMS, LIMITS, U, ASCII, categoryOf, shortName, newManifest, Planner, same, diffPatch, emitStates,
  createObject, ensureKinds, ensureSpaces, ensureDelegates, ensureBays, roomsFor, BASE_NAME,
} from './v2-plan.mjs';

export * from './v2-plan.mjs';

const json = (o) => JSON.stringify(o);

// The tier-0 kinds to register on a fresh registry, in a fixed order (so kind ids are predictable): bay, then the v1 look
// vocabulary, read from the hall's own source. v2-plan.mjs HALL_KINDS is a frozen copy for browsers (a test keeps them equal).
export function kindRegistry() {
  return [{ key: 'bay', category: 7, name: 'Bay' }].concat(lookRegistry().map((l) => ({ key: l.key, category: categoryOf(l.key), name: l.name })));
}

/* ------------------------------------------------------------------ deploy */
export function planDeploy({ owner = WIZARDS.deployer.address, as = 'deployer' } = {}) {
  return { doc: { owner, contracts: { reg: CONTRACT }, steps: [{ as, deploy: CONTRACT, note: 'needs .mock-xtrata-core already deployed at the same address' }] }, manifest: newManifest({ owner, as }) };
}

/* ------------------------------------------------------------------ seeding from scene files */
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
//   opts: { owner (address or wizard name), manifest?, height, delegates: [wizard], delegateExpires?: burn height, linkRooms: {name: spaceId},
//           as, nextId, kindBase, hallOnly?: the hall without the lobby (no lobby space, no lobby bays), rooms?: [room ids] }
// Delegates (the publisher / bot) get STATE only: they change what existing objects show, nothing else.
export function planSeed(docs, opts = {}) {
  const owner = opts.owner || 'deployer';
  const base = opts.manifest || newManifest({ owner: opts.ownerAddress || WIZARDS.deployer.address, as: opts.as || 'deployer', nextId: opts.nextId ?? 2, nextKind: opts.kindBase ?? 0 });
  const P = new Planner(base, { as: opts.as });
  const build = roomsFor(opts);
  const findings = [];
  const rooms = Object.fromEntries(Object.entries(ROOMS).map(([id, r]) => [id, { bays: r.bays, hidden: false }]));
  for (const n of Object.keys(opts.linkRooms || {})) rooms[n] = { bays: 8, hidden: false };
  const compiled = [];
  for (const doc of docs) {
    const { findings: f, scenes } = compileScenes(doc, { looks: PLAN_BOOK, rooms, height: opts.height ?? null, timelineUsed: {} });
    findings.push(f);
    if (!ROOMS[doc.room]) f.error('room', `a hall scene file is for "arcade-hall" or "lobby" (got ${JSON.stringify(doc.room)})`);
    else if (!build.includes(doc.room) && !P.m.spaces[ROOMS[doc.room].slug]) f.error('room', `this plan does not build "${doc.room}" (hall only): plan the lobby first (node ops/v2.mjs lobby)`);
    if (!f.ok) return { ...P.result(), findings };
    compiled.push(...scenes);
  }

  ensureKinds(P, opts.kinds || kindRegistry());
  ensureSpaces(P, owner, build);
  ensureDelegates(P, opts.delegates || [], { rooms: build, expires: opts.delegateExpires || 0 });
  const touched = new Set(compiled.map((s) => `${ROOMS[s.room].slug}/bay-${s.bay}`));
  for (const t of touched) if (P.m.objects[t] && P.m.objects[t].states > 0) P.err(`${t} already has states; change it with patch / add / bay instead of seeding it again`);
  ensureBays(P, build);

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
        if (!to && slug && !build.includes(l0.targetRoom)) P.err(`${t}: links to the ${slug}, which this plan does not build (hall only): leave this bay out, run node ops/v2.mjs lobby, then seed a scene file for this bay`);
        else if (!to) P.err(`${t}: link to room "${l0.targetRoom}" has no space (pass --link-room ${l0.targetRoom}=<space id>)`);
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

// The lobby after a hall-only seed: its space (live), its two bay objects, the delegates' STATE grants there, and any lobby scenes.
//   planLobby(manifest, [lobby scene docs], { height, delegates, delegateExpires, linkRooms, as })
export function planLobby(manifest, docs = [], opts = {}) {
  const refuse = (msg) => { const P = new Planner(manifest || newManifest(), { as: opts.as }); P.err(msg); return { ...P.result(), findings: [] }; };
  if (!manifest || !manifest.spaces || !manifest.spaces.arcade) return refuse('the manifest has no arcade space: seed the hall first (seed --hall-only)');
  const other = docs.find((d) => d.room !== 'lobby');
  if (other) return refuse(`the lobby command takes lobby scene files only (got room ${JSON.stringify(other.room)})`);
  return planSeed(docs, { ...opts, manifest, rooms: ['lobby'] });
}
