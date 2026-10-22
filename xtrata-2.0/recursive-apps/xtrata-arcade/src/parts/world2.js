/*
 * Xtrata Arcade: world reader for xtrata-world-v2 (leaf module, part of the hall pack)
 *
 * The first-generation world contract (xtrata-world-v1) stored a bay as one scene: a base, a door look and up to eight layers,
 * all replaced together. The registry (xtrata-world-v2, "XWS v1") stores every sign, door, lamp, curtain and sound as its OWN object
 * with its own timeline of states, so one sign can change while everything else stays put, and new objects can be added at any time.
 *
 * This module reads the hall's two spaces ("arcade/hall": the four wall bays, "arcade/lobby": the two doorways) and turns the
 * objects into exactly the bay snapshot world.js (v1) produced, so the bay engine (bays.js) and the hall need no changes:
 *
 *   bays[i]  = { scene: { base, baseId, interaction, doorLook, layers[], link, fromHeight } | null, nextHeight, height } | null
 *   looks    = { <kind id>: { kind: <engine slot>, name, tier, builtin, hidden, approved } }
 *
 * The exact object / state / params schema is in contracts/arcade-world/docs/HALL-V2-SCHEMA.md. In short:
 *   bay-0..bay-3   objects of the built-in kind "bay" in the hall space (bay-0, bay-1 in the lobby space): their active state carries
 *                  the base ({"base":"posters"|"wall"|"door"}), the visibility and the interaction; a portal gives scene.link.
 *   children       objects whose parent is the bay: door-<style>, door-skin, curtain-house, sign-board, caution-tape, lamps, sounds.
 *                  Each one's params are the object's own params merged with its active state's patch; hidden ones are left out.
 *
 * Safety rules (same as world.js):
 *   - Off unless XA_WORLD_CONFIG.registry is set (world.js decides). Any failed read throws, and world.js keeps the last good
 *     snapshot; with nothing cached the hall shows the posters, exactly as #3111.
 *   - Nothing read is ever executed. Chain data is text and numbers, looked up in the bay engine's fixed tables. Malformed, oversized
 *     or unknown objects are ignored; JSON is parsed in try/catch; only the built-in (tier 0) kinds are drawn.
 *   - Bounded: at most 32 children per bay and 128 objects per space are read; 8 pages of get-objects at most.
 *
 * The host (world.js, or a test) passes everything this module needs, so it has no dependencies of its own:
 *   host = { read(contractId, fn, argHexList) -> decoded Clarity value, plain(cv), hexList(hexItems), codec: { cvUint, cvAscii },
 *            registry: 'SP….xtrata-world-v2', path: ['arcade','hall'], lobbyPath: ['arcade','lobby'] }
 */
(function (root) {
  'use strict';
  if (root.XAWorld2) return;

  var LIMITS = { hallBays: 4, lobbyBays: 2, children: 32, objects: 128, pages: 8, kindsPerCall: 20, params: 512, patch: 256, keys: 16, text: 160, concurrency: 4 };

  // The bay engine's slot for each built-in key (bays.js BUILTIN[key].kind; a test keeps the two tables equal).
  // 0 door, 1 cover, 2 overlay, 3 sound, 4 light. Door looks are "door-<style>" (any style; the engine falls back to the classic door).
  var SLOT = {
    'curtain-house': 1, 'sign-board': 2, 'caution-tape': 2, 'door-skin': 2,
    'work-site': 3, 'hum': 3, 'light-steady': 4, 'light-pulse': 4, 'light-flicker': 4
  };
  var BAY_KEY = 'bay', SKIN_KEY = 'door-skin', SKIN_LOOK = 'v2:door-skin';   // SKIN_LOOK: the look key of a skin given in a door's own params
  var BASES = { posters: 0, wall: 1, door: 2 };
  var BANNED = { '__proto__': 1, constructor: 1, prototype: 1 };

  function hasOwn(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
  function num(v, d) { v = Number(v); return isFinite(v) ? v : d; }
  function slotOf(builtin) {
    if (typeof builtin !== 'string') return -1;
    if (hasOwn(SLOT, builtin)) return SLOT[builtin];
    return /^door-[a-z0-9]{2,16}$/.test(builtin) ? 0 : -1;
  }

  /* ------------------------------------------------------------ params (pure) */
  // Chain text is parsed in try/catch and reduced to a flat object of short strings, numbers, booleans and short string lists.
  function parseJson(s, max) {
    if (typeof s !== 'string' || !s || s.length > max) return {};
    try { var o = JSON.parse(s); return o && typeof o === 'object' && !Array.isArray(o) ? o : {}; } catch (e) { return {}; }
  }
  function clean(o) {
    var out = {}, n = 0;
    Object.keys(o).forEach(function (k) {
      if (n >= LIMITS.keys || BANNED[k] || !/^[A-Za-z][A-Za-z0-9_-]{0,23}$/.test(k)) return;
      var v = o[k];
      if (typeof v === 'string') out[k] = v.replace(/[^\x20-\x7e]/g, '').slice(0, LIMITS.text);
      else if (typeof v === 'number') { if (!isFinite(v)) return; out[k] = v; }
      else if (typeof v === 'boolean') out[k] = v;
      else if (Array.isArray(v)) out[k] = v.slice(0, 8).filter(function (x) { return typeof x === 'string'; }).map(function (x) { return x.replace(/[^\x20-\x7e]/g, '').slice(0, 24); });
      else return;
      n++;
    });
    return out;
  }
  // The object's own params, then its active state's patch on top (a patch key replaces the same key; a null removes it).
  function mergeParams(objParams, patch) {
    var a = clean(parseJson(objParams, LIMITS.params)), raw = parseJson(patch, LIMITS.patch), b = clean(raw);
    Object.keys(raw).forEach(function (k) { if (raw[k] === null && hasOwn(a, k)) delete a[k]; });
    Object.keys(b).forEach(function (k) { a[k] = b[k]; });
    return a;
  }
  // The engine's parseParams takes a string of at most 256 characters; a longer merge goes as an object (bays.js accepts both).
  function forEngine(p) { var s = JSON.stringify(p); return s.length <= 256 ? s : p; }

  /* ------------------------------------------------------------ assembling (pure) */
  function minOf(a, b) { return a == null ? b : (b == null ? a : Math.min(a, b)); }

  function linkOf(portal, slugOf) {
    if (!portal) return null;
    var to = num(portal['to-space'], 0);
    if (to > 0) {
      var slug = slugOf(to);
      return slug ? { 'target-room': slug, 'arrival-bay': 0, path: '' } : null;
    }
    var p = String(portal.path || '');
    return /^\/[A-Za-z0-9._~\-][A-Za-z0-9._~\-\/?=&%#]*$/.test(p) && p.length <= 64 ? { 'target-room': '', 'arrival-bay': 0, path: p } : null;
  }
  function looksOfKind(id, k) {
    return { kind: slotOf(k.builtin), name: String(k.name || ''), tier: k.tier, builtin: k.builtin, hidden: !!k.hidden, approved: !!k.approved };
  }
  // Is this kind one the hall draws? Built-in (tier 0), approved, not hidden, a key the engine has.
  function kindUsable(k, want) {
    if (!k || k.tier !== 0 || !k.approved || k.hidden || typeof k.builtin !== 'string') return false;
    return want === BAY_KEY ? k.builtin === BAY_KEY : slotOf(k.builtin) >= 0;
  }

  /*
   * One bay. sel = { id, children: [{ id, kind }] } (children in id order), views = { id: get-object-view result }, kinds = { id: kind }.
   * Returns the bay as the engine reads it, or null when the bay's own view is missing.
   */
  function assembleBay(sel, views, kinds, slugOf) {
    var bv = views[sel.id];
    if (!bv || !bv.object) return null;
    var next = bv['next-height'] == null ? null : bv['next-height'], height = bv.height == null ? null : bv.height;
    var kids = [];
    sel.children.forEach(function (c) {
      var v = views[c.id];
      if (!v || !v.object || v.object.state !== 0) return;
      next = minOf(next, v['next-height'] == null ? null : v['next-height']);
      kids.push({ id: c.id, kind: c.kind, v: v });
    });
    var a = bv.active;
    if (!a || a.retracted || a.visibility !== 0) return { scene: null, nextHeight: next, height: height };

    var bp = mergeParams(bv.object.params, a.patch);
    var base = hasOwn(BASES, bp.base) ? bp.base : 'posters';
    var link = linkOf(bv.object.portal, slugOf);
    var interaction = Math.max(0, Math.min(3, num(a.interaction, 0) | 0));
    if (interaction === 3 && !link) interaction = base === 'door' ? 1 : 0;       // "enter" needs a door that leads somewhere

    var doorKid = null, layers = [], looks = {};
    kids.forEach(function (c) {
      var k = kinds[c.kind], p, hidden = c.v.active && c.v.active.visibility === 1;
      if (hidden || !kindUsable(k)) return;
      var slot = slotOf(k.builtin);
      p = mergeParams(c.v.object.params, c.v.active ? c.v.active.patch : '');
      var state = typeof p.state === 'string' ? p.state.slice(0, 24) : '';
      delete p.state;
      if (slot === 0) { doorKid = { id: c.id, kind: c.kind, p: p }; return; }              // the newest visible door wins
      layers.push({ slot: slot, look: c.kind, params: forEngine(p), state: state, obj: c.id });
    });
    var doorLook = null;
    if (base === 'door' && doorKid) {
      doorLook = doorKid.kind;
      // a door's own skin keys (skin, frame, hardware, tint, wear) are a door-skin layer in front of any skin objects
      if (typeof doorKid.p.skin === 'string' && doorKid.p.skin) {
        var sp = {}; ['skin', 'frame', 'hardware', 'tint', 'wear'].forEach(function (key) { if (hasOwn(doorKid.p, key)) sp[key] = doorKid.p[key]; });
        layers.unshift({ slot: 2, look: SKIN_LOOK, params: forEngine(sp), state: '', obj: doorKid.id });
      }
    }
    return {
      scene: { base: base, baseId: BASES[base], interaction: interaction, doorLook: doorLook, layers: layers, link: link,
        fromHeight: num(a['from-height'], 0), params: bp },
      nextHeight: next, height: height
    };
  }

  // Choose the bays and their children from a room's object list. items = [{ id, o }] sorted by id.
  function selectBays(items, kinds, expected) {
    var tops = {}, kids = {};
    items.forEach(function (it) {
      var o = it.o, m;
      if (o.parent === 0) {
        m = /^bay-([0-9])$/.exec(String(o.name));
        if (m && Number(m[1]) < expected && kindUsable(kinds[o.kind], BAY_KEY) && !tops[m[1]]) tops[m[1]] = { id: it.id, children: [] };
      } else (kids[o.parent] = kids[o.parent] || []).push({ id: it.id, kind: o.kind });
    });
    var out = [];
    for (var i = 0; i < expected; i++) {
      var t = tops[i];
      if (t) t.children = (kids[t.id] || []).filter(function (c) { return kindUsable(kinds[c.kind]); }).slice(0, LIMITS.children);
      out.push(t || null);
    }
    return out;
  }

  /* ------------------------------------------------------------ reading */
  async function pmap(items, limit, fn) {
    var out = new Array(items.length), next = 0;
    async function worker() { while (next < items.length) { var i = next++; out[i] = await fn(items[i], i); } }
    var ws = []; for (var w = 0; w < Math.min(limit, items.length); w++) ws.push(worker());
    await Promise.all(ws);
    return out;
  }
  function validPath(p) {
    return Array.isArray(p) && p.length >= 1 && p.length <= 6 && p.every(function (s) { return typeof s === 'string' && /^[a-z0-9-]{1,24}$/.test(s); });
  }
  function paths(host) {
    var hall = host.path || ['arcade', 'hall'];
    var lobby = host.lobbyPath || (Array.isArray(hall) && hall.length ? hall.slice(0, -1).concat('lobby') : ['arcade', 'lobby']);
    return { hall: hall, lobby: lobby };
  }
  function rd(host, fn, args) { return host.read(host.registry, fn, args || []); }
  async function rp(host, fn, args) { return host.plain(await rd(host, fn, args)); }
  var U = function (host, n) { return host.codec.cvUint(n); };

  async function resolvePath(host, slugs) {
    if (!validPath(slugs)) return null;
    var id = await rp(host, 'resolve-path', [host.hexList(slugs.map(function (s) { return host.codec.cvAscii(s); }))]);
    return typeof id === 'number' && id > 1 ? id : null;     // the world root (1) is never a room
  }
  async function getSpace(host, id) { return id ? await rp(host, 'get-space', [U(host, id)]) : null; }
  function spaceSig(sp) { return sp ? [sp.version, sp.state, sp['object-slots'], sp.objects].join('.') : 'x'; }
  function roomOpen(sp) { return !!sp && (sp.state === 0 || sp.state === 1); }

  async function spaces(host) {
    var P = paths(host);
    var ids = await Promise.all([resolvePath(host, P.hall), resolvePath(host, P.lobby)]);
    var sps = await Promise.all([getSpace(host, ids[0]), getSpace(host, ids[1])]);
    return { hallId: ids[0], lobbyId: ids[1], hall: sps[0], lobby: sps[1], sig: spaceSig(sps[0]) + '/' + spaceSig(sps[1]) + '@' + ids[0] + ',' + ids[1] };
  }
  async function listObjects(host, id, sp) {
    if (!id || !roomOpen(sp)) return [];
    var slots = Math.min(num(sp['object-slots'], 0), LIMITS.pages * 16), pages = [];
    for (var p = 0; p * 16 < slots; p++) pages.push(p);
    var rows = await pmap(pages, LIMITS.concurrency, function (pg) { return rp(host, 'get-objects', [U(host, id), U(host, pg)]); });
    var seen = {}, out = [];
    rows.forEach(function (list) {
      (Array.isArray(list) ? list : []).forEach(function (r) {
        var o = r && r.object;
        if (!o || typeof r.id !== 'number' || seen[r.id] || o.space !== id || o.state !== 0) return;
        seen[r.id] = true; out.push({ id: r.id, o: o });
      });
    });
    out.sort(function (a, b) { return a.id - b.id; });
    return out.slice(0, LIMITS.objects);
  }
  async function readKinds(host, ids) {
    var out = {};
    var chunks = [];
    for (var i = 0; i < ids.length; i += LIMITS.kindsPerCall) chunks.push(ids.slice(i, i + LIMITS.kindsPerCall));
    var rows = await pmap(chunks, LIMITS.concurrency, function (chunk) { return rp(host, 'get-kinds', [host.hexList(chunk.map(function (id) { return U(host, id); }))]); });
    chunks.forEach(function (chunk, c) {
      (rows[c] || []).forEach(function (k, j) { if (k && typeof k === 'object') out[chunk[j]] = k; });
    });
    return out;
  }
  function kindFingerprint(ids, kinds) {
    return ids.map(function (id) { var k = kinds[id]; return id + ':' + (k ? (k.hidden ? 1 : 0) + '' + (k.approved ? 1 : 0) + k.tier : 'x'); }).join(',');
  }

  var S = { registry: '', kindIds: [], probeGlobal: null, probeSig: null };
  function forget() { S = { registry: '', kindIds: [], probeGlobal: null, probeSig: null }; }
  function own(host) { if (S.registry !== host.registry) { forget(); S.registry = host.registry; } }

  /*
   * Cheap change detector. Returns a string that changes when something the hall draws may have changed.
   * One read (get-version) while the registry has not changed at all; when it has (any write anywhere in the world), a few more reads
   * check just the hall and lobby spaces and the kinds in use, so unrelated activity elsewhere does not cause a full re-read.
   */
  async function probe(host) {
    own(host);
    var g = num(await rp(host, 'get-version', []), -1);
    if (S.probeSig !== null && S.probeGlobal === g) return S.probeSig;
    var sp = await spaces(host);
    var kinds = S.kindIds.length ? await readKinds(host, S.kindIds) : {};
    var sig = sp.sig + '|' + kindFingerprint(S.kindIds, kinds);
    S.probeGlobal = g; S.probeSig = sig;
    return sig;
  }

  /*
   * Read the hall and the lobby. Throws when a needed read fails (the caller keeps its last good snapshot).
   * Returns { bays: [4], lobbyBays: [2], looks, sig, meta }.  An absent or unusable room gives all-null bays: posters.
   */
  async function load(host) {
    own(host);
    var g = num(await rp(host, 'get-version', []), -1);          // read first: a write during the load shows up at the next probe
    var sp = await spaces(host);
    var rooms = await Promise.all([listObjects(host, sp.hallId, sp.hall), listObjects(host, sp.lobbyId, sp.lobby)]);

    // kinds of every bay candidate and child, read once
    var kindIds = [];
    rooms.forEach(function (items) { items.forEach(function (it) { if (kindIds.indexOf(it.o.kind) < 0) kindIds.push(it.o.kind); }); });
    kindIds.sort(function (a, b) { return a - b; });
    var kinds = await readKinds(host, kindIds.slice(0, 80));

    var selHall = selectBays(rooms[0], kinds, LIMITS.hallBays), selLobby = selectBays(rooms[1], kinds, LIMITS.lobbyBays);
    var wanted = [];
    selHall.concat(selLobby).forEach(function (s) { if (s) { wanted.push(s.id); s.children.forEach(function (c) { wanted.push(c.id); }); } });
    var views = {};
    await pmap(wanted, LIMITS.concurrency, async function (id) { var v = await rp(host, 'get-object-view', [U(host, id)]); if (v) views[id] = v; });

    // portal targets: the slug of each destination space (the hall sends 'lobby' to its own lobby, anything else to a room it knows)
    var slugs = {}, want = [];
    Object.keys(views).forEach(function (id) {
      var p = views[id].object && views[id].object.portal, to = p && num(p['to-space'], 0);
      if (to > 0 && want.indexOf(to) < 0) want.push(to);
    });
    await pmap(want, LIMITS.concurrency, async function (to) { var s = await getSpace(host, to); if (s && typeof s.slug === 'string' && /^[a-z0-9-]{1,24}$/.test(s.slug)) slugs[to] = s.slug; });
    var slugOf = function (to) { return slugs[to] || ''; };

    var bays = selHall.map(function (s) { return s ? assembleBay(s, views, kinds, slugOf) : null; });
    var lobbyBays = selLobby.map(function (s) { return s ? assembleBay(s, views, kinds, slugOf) : null; });

    // the looks table the engine reads: every kind a drawn object uses
    var looks = {};
    kindIds.forEach(function (id) { var k = kinds[id]; if (k && k.tier === 0 && slotOf(k.builtin) >= 0) looks[id] = looksOfKind(id, k); });
    looks[SKIN_LOOK] = { kind: SLOT[SKIN_KEY], name: 'Door skin', tier: 0, builtin: SKIN_KEY, hidden: false, approved: true };

    var sig = sp.sig + '|' + kindFingerprint(kindIds, kinds);
    S.kindIds = kindIds; S.probeGlobal = g; S.probeSig = sig;
    return {
      bays: bays, lobbyBays: lobbyBays, looks: looks, sig: sig,
      meta: { hall: sp.hallId, lobby: sp.lobbyId, objects: rooms[0].length + rooms[1].length, kinds: kindIds.length, global: g }
    };
  }

  root.XAWorld2 = {
    load: load, probe: probe, forget: forget,
    LIMITS: LIMITS, SLOT: SLOT,
    _t: { assembleBay: assembleBay, selectBays: selectBays, mergeParams: mergeParams, clean: clean, parseJson: parseJson, linkOf: linkOf,
      slotOf: slotOf, kindUsable: kindUsable, spaceSig: spaceSig, kindFingerprint: kindFingerprint, SKIN_LOOK: SKIN_LOOK }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.XAWorld2;
})(typeof window !== 'undefined' ? window : globalThis);
