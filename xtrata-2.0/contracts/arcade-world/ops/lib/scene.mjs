// Scene files: read, validate (mirroring the world contract and the hall), compile to contract calls.
//
//   {
//     "format": "arcade-scene-file/1",
//     "room": "arcade-hall",
//     "scenes": [
//       { "bay": 0, "at": "+6h", "base": "door", "door": "door-gothic", "interaction": "knock",
//         "layers": [ { "look": "curtain-house", "params": { "color": "#7a1020" }, "state": "closed" },
//                     { "look": "sign-board", "params": { "text": "coming soon", "tone": "gold" } } ],
//         "link": { "room": "lobby", "arrivalBay": 0 } }      // or { "path": "/some/page" }
//     ]
//   }
//
// `at` is an absolute burn-block height or "+N" blocks / "+Nm" / "+Nh" / "+Nd" from the base height.
import { Findings, isAscii, parseWhen } from './util.mjs';
import { hallBays, BASES, INTERACTIONS } from './catalogue.mjs';

export const SCENE_FORMAT = 'arcade-scene-file/1';
export const LIMITS = { layers: 8, params: 256, state: 24, room: 24, path: 64, timeline: 48, batch: 8 };
const BASE_NAMES = Object.keys(BASES);
const INTERACTION_NAMES = Object.keys(INTERACTIONS);

// A look book is what the chain says the looks are: [{ id, kind, name, tier, builtin, hidden, approved }].
// resolveLook finds the look a file refers to: a built-in key such as "curtain-house" / "door-arch", a registered name, or an id.
export function resolveLook(ref, book, wantKind) {
  const usable = (l) => !l.hidden && l.approved && (wantKind == null || l.kind === wantKind);
  if (typeof ref === 'number') return book.find((l) => l.id === ref) || null;
  const byBuiltin = book.filter((l) => l.tier === 0 && l.builtin === ref && usable(l));
  if (byBuiltin.length) return byBuiltin[0];
  const byName = book.filter((l) => l.name === ref && usable(l));
  return byName[0] || null;
}

export function parseSceneFile(text) {
  let doc;
  try { doc = JSON.parse(text); } catch (e) { throw new Error('scene file is not valid JSON: ' + e.message); }
  return doc;
}

// Does the hall draw these params the way the file says? Warnings only; the hall clamps whatever it is given.
function paramWarnings(key, params, f, where) {
  const B = hallBays();
  const def = Object.prototype.hasOwnProperty.call(B.BUILTIN, key) ? B.BUILTIN[key] : null;
  if (!def) return;
  const plan = def.norm(params);
  for (const k of Object.keys(params)) {
    if (!(k in plan)) { f.warn(where, `param "${k}" means nothing to ${key}; the hall ignores it`); continue; }
    const raw = params[k], got = plan[k];
    const same = typeof got === 'number' ? Number(raw) === got
      : typeof got === 'string' && typeof raw === 'string' ? raw.toUpperCase() === got.toUpperCase()
      : JSON.stringify(raw) === JSON.stringify(got) || (k === 'kinds' && String(raw).split(',').map((x) => x.trim()).join(',') === got.join(','));
    if (!same) f.warn(where, `param "${k}": ${JSON.stringify(raw)} will be drawn as ${JSON.stringify(got)}`);
  }
}

// Validate and compile a scene file.
//   ctx: { looks: look book, height: base height for relative times, rooms?: { id: {bays, hidden} }, timelineUsed?: { "<room>#<bay>": n } }
// Returns { findings, scenes } where scenes are compiled objects (see clar.mjs) sorted by start height (stable).
export function compileScenes(doc, ctx) {
  const f = new Findings();
  const out = [];
  if (!doc || typeof doc !== 'object') { f.error('file', 'not a scene file'); return { findings: f, scenes: out }; }
  if (doc.format !== SCENE_FORMAT) f.error('format', `expected "${SCENE_FORMAT}"`);
  const room = doc.room;
  if (typeof room !== 'string' || !room.length || room.length > LIMITS.room || !isAscii(room)) f.error('room', 'room must be 1 to 24 printable ASCII characters');
  if (!Array.isArray(doc.scenes) || !doc.scenes.length) { f.error('scenes', 'needs a non-empty "scenes" list'); return { findings: f, scenes: out }; }
  const roomInfo = ctx.rooms && ctx.rooms[room];
  if (ctx.rooms && !roomInfo) f.error('room', `room "${room}" is not registered on the world contract`);
  const bays = roomInfo ? roomInfo.bays : null;
  const added = {};

  doc.scenes.forEach((s, i) => {
    const w = `scene ${i + 1}`;
    const n0 = f.errors.length;
    const sc = { room, bay: s.bay, from: 0, base: 0, doorLook: null, layers: [], interaction: 0, link: null, _src: i };
    if (!Number.isInteger(s.bay) || s.bay < 0) f.error(w, '"bay" must be a whole number');
    else if (s.bay >= 8) f.error(w, 'the contract has at most 8 bays per room');
    else if (bays != null && s.bay >= bays) f.error(w, `room "${room}" has ${bays} bay(s); bay ${s.bay} does not exist (u211)`);
    try { sc.from = parseWhen(s.at, ctx.height, `${w} at`); } catch (e) { f.error(w, e.message); }
    if (ctx.height != null && sc.from < ctx.height && sc.from !== 0) f.warn(w, `start ${sc.from} is already past (now ${ctx.height}); the contract raises it to the block it lands in`);

    // base
    const baseName = s.base == null ? 'posters' : s.base;
    if (!(baseName in BASES)) f.error(w, `"base" must be one of ${BASE_NAMES.join(', ')}`); else sc.base = BASES[baseName];
    // interaction
    const iName = s.interaction == null ? 'none' : s.interaction;
    if (!(iName in INTERACTIONS)) f.error(w, `"interaction" must be one of ${INTERACTION_NAMES.join(', ')}`); else sc.interaction = INTERACTIONS[iName];

    // door look
    if (sc.base === BASES.door) {
      const ref = s.door == null ? 'door-rect' : s.door;
      const dl = resolveLook(ref, ctx.looks, 0);
      if (!dl) f.error(w, `door look ${JSON.stringify(ref)} is not a usable door look on this world contract (u205)`);
      else if (dl.kind !== 0) f.error(w, `look ${JSON.stringify(ref)} is not a door (kind ${dl.kind}) (u205)`);
      else if (dl.hidden || !dl.approved) f.error(w, `door look ${JSON.stringify(ref)} is hidden or not approved (u205)`);
      else sc.doorLook = dl.id;
    } else if (s.door != null) f.error(w, '"door" is only valid with base "door" (u205)');

    // layers
    const layers = Array.isArray(s.layers) ? s.layers : [];
    if (s.layers != null && !Array.isArray(s.layers)) f.error(w, '"layers" must be a list');
    if (layers.length > LIMITS.layers) f.error(w, `at most ${LIMITS.layers} layers (got ${layers.length})`);
    const slots = {};
    layers.forEach((l, j) => {
      const lw = `${w} layer ${j + 1}`;
      const look = resolveLook(l.look, ctx.looks, null);
      if (!look) { f.error(lw, `look ${JSON.stringify(l.look)} not found, hidden or not approved (u205)`); return; }
      if (look.hidden || !look.approved) { f.error(lw, `look ${JSON.stringify(l.look)} is hidden or not approved (u205)`); return; }
      if (look.kind < 1 || look.kind > 4) { f.error(lw, `look ${JSON.stringify(l.look)} is a door; doors go in "door", not layers (u205)`); return; }
      const params = l.params == null ? {} : l.params;
      if (typeof params !== 'object' || Array.isArray(params)) { f.error(lw, '"params" must be an object'); return; }
      const ptxt = JSON.stringify(params);
      if (ptxt.length > LIMITS.params) f.error(lw, `params are ${ptxt.length} characters; the contract allows ${LIMITS.params}`);
      if (!isAscii(ptxt)) f.error(lw, 'params must be printable ASCII (no accents or emoji)');
      const state = l.state == null ? '' : l.state;
      if (typeof state !== 'string' || state.length > LIMITS.state || !isAscii(state)) f.error(lw, `"state" must be ASCII text of at most ${LIMITS.state} characters`);
      if (look.tier === 0) {
        paramWarnings(look.builtin, params, f, lw);
        if (look.kind === 1 && state && !['open', 'half', 'closed'].includes(state)) f.warn(lw, `cover state "${state}" is not open/half/closed; the openness param is used instead`);
        if ((look.kind === 3 || look.kind === 4) && state && state !== 'off') f.warn(lw, `state "${state}" has no meaning for a sound or light; only "off" does`);
      } else f.warn(lw, `look "${look.name}" is tier ${look.tier}; this hall draws only built-in (tier 0) looks, so it will not appear until the hall supports it`);
      slots[look.kind] = (slots[look.kind] || 0) + 1;
      sc.layers.push({ slot: look.kind, look: look.id, params: ptxt, state });
    });
    for (const [k, name] of [[1, 'cover'], [3, 'sound'], [4, 'light']]) if ((slots[k] || 0) > 1) f.error(w, `at most one ${name} layer per scene (u212)`);
    if ((slots[2] || 0) > 4) f.warn(w, 'the hall draws at most 4 overlays; the rest are ignored');

    // link
    if (s.link != null) {
      const lk = s.link, tr = lk.room == null ? '' : lk.room, path = lk.path == null ? '' : lk.path, arr = lk.arrivalBay == null ? 0 : lk.arrivalBay;
      if (typeof tr !== 'string' || tr.length > LIMITS.room || !isAscii(tr)) f.error(w, 'link.room must be ASCII, at most 24 characters');
      else if (typeof path !== 'string' || path.length > LIMITS.path || !isAscii(path)) f.error(w, 'link.path must be ASCII, at most 64 characters');
      else if (!Number.isInteger(arr) || arr < 0) f.error(w, 'link.arrivalBay must be a whole number');
      else if (tr.length) {
        const t = ctx.rooms && ctx.rooms[tr];
        if (ctx.rooms && (!t || t.hidden || arr >= t.bays)) f.error(w, `link target room "${tr}" bay ${arr} is not a registered, visible room (u210)`);
        sc.link = { targetRoom: tr, arrivalBay: arr, path: path };
      } else {
        if (!(path.startsWith('/') && !path.startsWith('//') && !path.startsWith('/\\'))) f.error(w, 'link.path must start with "/" and not "//" or "/\\" (u210)');
        sc.link = { targetRoom: '', arrivalBay: arr, path };
      }
    }
    if (sc.interaction === INTERACTIONS.enter && !sc.link) f.error(w, 'interaction "enter" needs a link (u210)');
    if (sc.interaction === INTERACTIONS.enter && sc.base !== BASES.door) f.warn(w, 'only doors can be entered; this base has no door to open');
    if (sc.interaction === INTERACTIONS.peek && !sc.layers.some((l) => l.slot === 1)) f.warn(w, '"peek" needs a cover to peek behind; it does nothing here');
    if (sc.interaction === INTERACTIONS.knock && sc.base !== BASES.door) f.warn(w, '"knock" only works on a door');

    if (f.errors.length === n0) { out.push(sc); added[`${room}#${sc.bay}`] = (added[`${room}#${sc.bay}`] || 0) + 1; }
  });

  for (const [key, n] of Object.entries(added)) {
    const used = (ctx.timelineUsed && ctx.timelineUsed[key]) || 0;
    if (used + n > LIMITS.timeline) f.error(key, `would put ${used + n} scenes on the bay's timeline; the limit is ${LIMITS.timeline}. Run compact-bay first (u207)`);
    else if (used + n > LIMITS.timeline - 8) f.warn(key, `timeline will hold ${used + n} of ${LIMITS.timeline}`);
  }
  // A stable sort by start keeps file order for ties, so "later in the file wins" matches the contract.
  out.sort((a, b) => a.from - b.from || a._src - b._src);
  return { findings: f, scenes: out.map(({ _src, ...s }) => s) };
}

// Split into add-scenes batches of at most 8 (each all-or-nothing). Never splits one bay's run in a way that changes order.
export function batches(scenes, size = LIMITS.batch) {
  const out = [];
  for (let i = 0; i < scenes.length; i += size) out.push(scenes.slice(i, i + size));
  return out;
}

// Readable timeline for the terminal.
export function describe(scenes, { height = null } = {}) {
  const lines = [];
  const bays = [...new Set(scenes.map((s) => s.bay))].sort();
  const B = ['posters', 'wall', 'door'], I = ['no interaction', 'knock', 'peek', 'enter'];
  for (const b of bays) {
    lines.push(`bay ${b}:`);
    for (const s of scenes.filter((x) => x.bay === b)) {
      const when = height != null ? `block ${s.from} (${s.from <= height ? 'now' : 'in ~' + Math.round((s.from - height) * 10 / 60 * 10) / 10 + ' h'})` : `block ${s.from}`;
      lines.push(`  ${when}: ${B[s.base]}${s.doorLook != null ? ' (door look ' + s.doorLook + ')' : ''}, ${I[s.interaction]}${s.link ? ', link ' + (s.link.targetRoom || s.link.path) : ''}`);
      for (const l of s.layers) lines.push(`      layer slot ${l.slot} look ${l.look} ${l.state ? '[' + l.state + '] ' : ''}${l.params}`);
    }
  }
  return lines.join('\n');
}
