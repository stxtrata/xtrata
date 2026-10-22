/*
 * Xtrata Arcade: world reader (leaf module, part of the hall pack)
 *
 * Reads the two on-chain contracts the hall is managed by:
 *   xtrata-posters-v1   a registry of posters (text, image, sheet, live) with pins and a suppress list
 *   xtrata-world-v1     rooms, bays, timed scenes and looks
 * and turns what it reads into a plain snapshot for the hall. It also holds the pure
 * "compose the wall" step, so it can be tested in Node with no browser.
 *
 * Safety rules (see arcade-world-contracts-plan.md, 7.1 and 7.5):
 *   - Off by default. With no contract ids configured, or any read failing, nothing changes:
 *     the hall shows exactly what v1.3 (#3111) shows.
 *   - Never executes anything it reads. Chain data is text and numbers; images are checked
 *     against their chain hash by XAScores.getInscription before they are used.
 *   - A read that FAILED is reported as { ok:false }, never as an empty wall.
 *   - The embedded poster rotation is never touched. Chain posters are laid OVER it:
 *     no chain data can re-roll the embedded wall, and no chain data means no overlay.
 *
 * Depends on XAScores (score-client.js) for the Clarity codec, read-only calls and the
 * hash-checked inscription fetch. Config: window.XA_WORLD_CONFIG or XAWorld.configure().
 */
(function (root) {
  'use strict';
  if (root.XAWorld) return;

  var CFG = {
    roomId: 'arcade-hall',
    lobbyId: 'lobby',
    posters: '',                 // 'SP….xtrata-posters-v1'  (empty = off)
    world: '',                   // 'SP….xtrata-world-v1'    (empty = off)
    registry: '',                // 'SP….xtrata-world-v2'    the object registry; when set it replaces `world` for the bays (world2.js)
    path: ['arcade', 'hall'],    // the hall's space in the registry (its lobby is the sibling 'lobby' unless lobbyPath says otherwise)
    lobbyPath: null,
    pollMs: 240000,              // how often to check the two version counters
    overlayMax: 8,               // at most this many chain posters on the wall at once
    maxLive: 64,                 // the contract's live-set bound
    snapKey: 'xa-world-snap-v1'
  };
  var PALETTE = { blue: 1, orange: 1, audio: 1, stacks: 1, white: 1, fun: 1, gold: 1 };

  function codec() { return root.XAScores && root.XAScores._codec; }
  function cfgFromHost() {
    try { if (root.XA_WORLD_CONFIG) configure(root.XA_WORLD_CONFIG); } catch (e) {}
  }
  function configure(patch) {
    Object.keys(patch || {}).forEach(function (k) { if (k in CFG) CFG[k] = patch[k]; });
  }
  // 2: bays from the object registry (xtrata-world-v2, read by world2.js); 1: from the scene contract (xtrata-world-v1); 0: off
  function mode() { return CFG.registry && root.XAWorld2 ? 2 : (CFG.world ? 1 : 0); }
  function enabled() { return !!(CFG.posters && mode() && codec()); }
  function host() { return { read: callRead, plain: plain, hexList: hexList, codec: codec(), registry: CFG.registry, path: CFG.path, lobbyPath: CFG.lobbyPath }; }

  /* ------------------------------------------------------------ pure helpers (rotation side) */
  function rng(s) { return function () { s |= 0; s = s + 0x6D2B79F5 | 0; var t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function hash32(n) { n = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b); n ^= n >>> 13; n = Math.imul(n, 0xc2b2ae35); return (n ^ (n >>> 16)) >>> 0; }

  // A poster entry from the chain, in the shape the hall uses. All numbers are plain JS numbers.
  function normalizePoster(id, r) {
    var colour = String(r.colour || '');
    return {
      id: id, set: r.set, kind: r.kind,
      head: r.head, sub: r.sub, foot: r.foot,
      c: PALETTE[colour] ? colour : 'white', art: r.art,
      imageId: r.imageId, imageHash: r.imageHash, imageSize: r.imageSize,
      cols: r.cols, frames: r.frames, fps: r.fps,
      actKind: r.actKind, actId: r.actId, actText: r.actText,
      weight: r.weight, start: r.start, end: r.end, evergreen: !!r.evergreen,
      scope: r.scope || [], hidden: !!r.hidden
    };
  }
  // Is this poster in the pool on `day` for this room?
  function isActive(e, day, room) {
    if (!e || e.hidden) return false;
    if (e.scope && e.scope.length && e.scope.indexOf(room) < 0) return false;
    if (day < e.start) return false;
    return e.evergreen || day < e.end;
  }

  /*
   * composeWall: lay the chain on top of the embedded wall.
   *   base        the embedded wall for the day (indices into the embedded pool), exactly as v1.3 computes it
   *   ctx.day, ctx.nEmbedded, ctx.weights[]   embedded weights (the v1.3 SET_WEIGHTS per poster)
   *   ctx.snapshot  { posters:[entry], pinned:{id:entry}, pins:[{spot,poster,from,to}], suppressed:[idx] } or null
   *   ctx.overlaySlots  slot indices chain posters may take (default: all)
   *   ctx.pinSlots      [spot -> slot]; spot numbers start at 1
   * Returns one item per slot: { src:'e', idx } for an embedded poster, { src:'c', entry } for a chain poster.
   * With no snapshot (or an empty one) the result is exactly `base`.
   */
  function composeWall(base, ctx) {
    var n = base.length, out = new Array(n);
    for (var i = 0; i < n; i++) out[i] = { src: 'e', idx: base[i] };
    var snap = ctx.snapshot;
    if (!snap) return out;
    var day = ctx.day, room = ctx.room || CFG.roomId;

    // 1. suppressed embedded posters are swapped for another embedded one (others stay put)
    var sup = {}; (snap.suppressed || []).forEach(function (ix) { sup[ix] = true; });
    var supCount = 0; for (var k in sup) if (Object.prototype.hasOwnProperty.call(sup, k)) supCount++;
    if (supCount) {
      var onWall = {}; for (i = 0; i < n; i++) onWall[out[i].idx] = true;
      for (i = 0; i < n; i++) {
        if (!sup[out[i].idx]) continue;
        var R = rng(hash32(day * 31 + i * 977 + 11)), tot = 0, j;
        for (j = 0; j < ctx.nEmbedded; j++) if (!sup[j] && !onWall[j]) tot += ctx.weights[j];
        if (tot <= 0) continue;
        var r = R() * tot, pick = -1;
        for (j = 0; j < ctx.nEmbedded; j++) if (!sup[j] && !onWall[j]) { pick = j; r -= ctx.weights[j]; if (r <= 0) break; }
        if (pick >= 0) { delete onWall[out[i].idx]; onWall[pick] = true; out[i] = { src: 'e', idx: pick }; }
      }
    }

    // 2. chain posters in the pool today take slots over the embedded wall
    var cand = (snap.posters || []).filter(function (e) { return isActive(e, day, room); });
    if (cand.length) {
      // which ones show today: lowest key first; key = hash / weight, so heavier posters tend to win
      var keyed = cand.map(function (e) { return { e: e, key: (hash32(day * 2654435761 ^ e.id * 40503) + 1) / Math.max(1, e.weight) }; });
      keyed.sort(function (a, b) { return a.key - b.key || a.e.id - b.e.id; });
      var chosen = keyed.slice(0, CFG.overlayMax).map(function (x) { return x.e; }).sort(function (a, b) { return a.id - b.id; });
      var slots = ctx.overlaySlots && ctx.overlaySlots.length ? ctx.overlaySlots : out.map(function (_, ix) { return ix; });
      var used = {};
      chosen.forEach(function (e) {
        var at = hash32(e.id * 7 + 13) % slots.length, tries = 0;
        while (used[slots[at]] && tries++ < slots.length) at = (at + 1) % slots.length;
        if (used[slots[at]]) return;
        used[slots[at]] = true; out[slots[at]] = { src: 'c', entry: e };
      });
    }

    // 3. pins are the immediate path and win over everything for their days
    var pinned = snap.pinned || {};
    (snap.pins || []).forEach(function (p) {
      if (day < p.from || day > p.to) return;
      var e = pinned[p.poster];
      if (!e || e.hidden) return;
      var slot = ctx.pinSlots && ctx.pinSlots[p.spot];
      if (slot === undefined || slot === null || slot < 0 || slot >= n) return;
      for (var q = 0; q < n; q++) if (out[q].src === 'c' && out[q].entry.id === e.id) out[q] = { src: 'e', idx: base[q] };
      out[slot] = { src: 'c', entry: e };
    });
    return out;
  }

  /*
   * pinSlotMap: which wall slot each pin spot means. Spot numbers start at 1 and cover EVERY slot (n of them), so any poster on the
   * wall can be pinned. `first` lists the slots that take spots 1, 2, 3 ... in that order (the hall puts the four free slots nearest the
   * entrance first, then each bay's two posters, bay 0 to bay 3); every slot not listed follows in wall order.
   */
  function pinSlotMap(n, first) {
    var map = [null], seen = {};
    (first || []).forEach(function (s) { if (typeof s === 'number' && s >= 0 && s < n && !seen[s]) { seen[s] = true; map.push(s); } });
    for (var i = 0; i < n; i++) if (!seen[i]) map.push(i);
    return map;
  }

  /* ------------------------------------------------------------ reading */
  function hasRealOrigin() { try { return /^https?:$/.test(root.location.protocol) && root.location.origin !== 'null'; } catch (e) { return false; } }
  function apiBases() {
    var sc = (root.XAScores && root.XAScores.config && root.XAScores.config()) || {};
    if (Array.isArray(sc.apiBases) && sc.apiBases.length) return sc.apiBases.slice();
    var net = sc.network === 'testnet' ? 'testnet' : 'mainnet', out = [];
    if (hasRealOrigin() && /xtrata\.xyz$/.test(root.location.hostname)) out.push(root.location.origin + '/hiro/' + net);
    out.push(net === 'testnet' ? 'https://api.testnet.hiro.so' : 'https://api.mainnet.hiro.so');
    return out;
  }
  async function callRead(contractId, fn, args) {
    var sc = (root.XAScores.config && root.XAScores.config()) || {};
    var parts = String(contractId).split('.'), bases = apiBases(), last = null;
    for (var i = 0; i < bases.length; i++) {
      try {
        var res = await fetch(bases[i].replace(/\/+$/, '') + '/v2/contracts/call-read/' + parts[0] + '/' + parts[1] + '/' + fn, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sender: sc.readSender || parts[0], arguments: args || [] })
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        var body = await res.json();
        if (!body || body.okay !== true || typeof body.result !== 'string') throw new Error(body && body.cause ? String(body.cause) : 'read-only call failed');
        return codec().decodeCV(body.result);
      } catch (e) { last = e; }
    }
    throw last || new Error('read-only call failed');
  }
  function hexList(items) { return '0x0b' + items.length.toString(16).padStart(8, '0') + items.map(function (x) { return x.replace(/^0x/i, ''); }).join(''); }

  // Decoded Clarity value -> plain JS (uint -> Number, tuple -> object, list -> array, some/none -> value/null).
  function plain(cv) {
    if (!cv) return null;
    switch (cv.type) {
      case 'int': case 'uint': return Number(cv.value);
      case 'bool': return !!cv.value;
      case 'ascii': case 'utf8': case 'principal': return cv.value;
      case 'buffer': return cv.value;
      case 'none': return null;
      case 'some': return plain(cv.value);
      case 'ok': return plain(cv.value);
      case 'err': throw new Error('contract returned an error');
      case 'list': return cv.value.map(plain);
      case 'tuple': { var o = {}; Object.keys(cv.value).forEach(function (k) { o[k] = plain(cv.value[k]); }); return o; }
      default: return null;
    }
  }
  function toPoster(id, t) {
    return normalizePoster(id, {
      set: t.set, kind: t.kind, head: t.head, sub: t.sub, foot: t.foot, colour: t.colour, art: t.art,
      imageId: t['image-id'], imageHash: t['image-hash'], imageSize: t['image-size'],
      cols: t.cols, frames: t.frames, fps: t.fps, actKind: t['act-kind'], actId: t['act-id'], actText: t['act-text'],
      weight: t.weight, start: t['start-day'], end: t['end-day'], evergreen: t.evergreen, scope: t.scope, hidden: t.hidden
    });
  }
  async function readPosters(ids) {
    var out = {};
    for (var i = 0; i < ids.length; i += 10) {
      var chunk = ids.slice(i, i + 10), C = codec();
      var cv = await callRead(CFG.posters, 'get-posters', [hexList(chunk.map(function (id) { return C.cvUint(id); }))]);
      var rows = cv.value;
      rows.forEach(function (row, k) {
        var t = row.type === 'some' ? plain(row) : null;
        if (t) out[chunk[k]] = toPoster(chunk[k], t);
      });
    }
    return out;
  }
  function baseName(n) { return n === 1 ? 'wall' : n === 2 ? 'door' : 'posters'; }
  function toBay(row) {
    if (!row || row.type !== 'some') return null;
    var t = plain(row);
    var scene = t.active;                         // null = show the default (posters)
    return {
      scene: scene ? { base: baseName(scene.base), baseId: scene.base, interaction: scene.interaction, doorLook: scene['door-look'],
        layers: scene.layers || [], link: scene.link, fromHeight: scene['from-height'] } : null,
      nextHeight: t['next-height'], height: t.height
    };
  }
  async function readVersions() {
    var a = await callRead(CFG.posters, 'get-version', []), b = mode() === 2 ? await root.XAWorld2.probe(host()) : plain(await callRead(CFG.world, 'get-version', []));
    return { posters: plain(a), world: b };
  }
  async function loadSnapshot() {
    var C = codec();
    var live = plain(await callRead(CFG.posters, 'get-live', [])) || [];
    var pins = (plain(await callRead(CFG.posters, 'get-pins', [C.cvAscii(CFG.roomId)])) || []).map(function (p) {
      return { spot: p.spot, poster: p.poster, from: p['from-day'], to: p['to-day'] };
    });
    var suppressed = plain(await callRead(CFG.posters, 'get-suppressed', [])) || [];
    var need = live.slice(0, CFG.maxLive); pins.forEach(function (p) { if (need.indexOf(p.poster) < 0) need.push(p.poster); });
    var recs = await readPosters(need);
    var bays, lobbyBays = [], looks, versions, w2 = null;
    if (mode() === 2) {
      // The bays come from the object registry: world2.js turns its objects into the same bay shape. A failed read throws (the last
      // good snapshot stays); a registry with nothing for the hall gives four null bays, which is the posters.
      w2 = await root.XAWorld2.load(host());
      bays = w2.bays; lobbyBays = w2.lobbyBays; looks = w2.looks;
      versions = { posters: plain(await callRead(CFG.posters, 'get-version', [])), world: w2.sig };
    } else {
      bays = (await callRead(CFG.world, 'get-bays', [C.cvAscii(CFG.roomId)])).value.map(toBay);
      // The lobby is its own room on the contract (its two back-wall doors). A contract with nothing for it, or a read that fails,
      // leaves those doors as plain walls: it never takes the hall down.
      try { lobbyBays = (await callRead(CFG.world, 'get-bays', [C.cvAscii(CFG.lobbyId)])).value.map(toBay); } catch (e) { lobbyBays = []; }
      looks = await readLooks(bays.concat(lobbyBays));
      versions = await readVersions();
    }
    var pinned = {}; pins.forEach(function (p) { if (recs[p.poster]) pinned[p.poster] = recs[p.poster]; });
    var snap = {
      versions: versions, at: Date.now(),
      posters: live.map(function (id) { return recs[id]; }).filter(Boolean),
      pins: pins, pinned: pinned, suppressed: suppressed, bays: bays, rooms: { lobby: { bays: lobbyBays } }, looks: looks
    };
    if (w2) { snap.src = CFG.registry; snap.v2 = w2.meta; }     // v1 snapshots stay exactly as they were
    return snap;
  }
  // The looks the active scenes use (door look and every layer), in one or two reads. { id: { kind, name, tier, builtin, hidden, approved } }
  async function readLooks(bays) {
    var ids = [];
    bays.forEach(function (b) {
      var sc = b && b.scene; if (!sc) return;
      if (sc.doorLook != null && ids.indexOf(sc.doorLook) < 0) ids.push(sc.doorLook);
      (sc.layers || []).forEach(function (l) { if (ids.indexOf(l.look) < 0) ids.push(l.look); });
    });
    var out = {}, C = codec();
    for (var i = 0; i < ids.length; i += 20) {
      var chunk = ids.slice(i, i + 20);
      var cv = await callRead(CFG.world, 'get-looks', [hexList(chunk.map(function (id) { return C.cvUint(id); }))]);
      cv.value.forEach(function (row, k) {
        var t = row.type === 'some' ? plain(row) : null;
        if (t) out[chunk[k]] = { kind: t.kind, name: t.name, tier: t.tier, builtin: t.builtin, hidden: !!t.hidden, approved: !!t.approved };
      });
    }
    return out;
  }

  /* ------------------------------------------------------------ last-good snapshot (localStorage, where it works) */
  function save(snap) {
    try {
      root.localStorage.setItem(CFG.snapKey, JSON.stringify(snap, function (k, v) {
        return v instanceof Uint8Array ? { $hex: root.XAScores._codec.bytesToHex(v) } : v;
      }));
    } catch (e) {}
  }
  function restore() {
    try {
      var s = root.localStorage.getItem(CFG.snapKey);
      if (!s) return null;
      var snap = JSON.parse(s, function (k, v) { return v && typeof v === 'object' && typeof v.$hex === 'string' ? root.XAScores._codec.hexToBytes(v.$hex) : v; });
      // a snapshot from the other bay source (v1 scenes vs the v2 registry, or another registry) is not shown while the reader catches up
      return snap && (snap.src || '') === (mode() === 2 ? CFG.registry : '') ? snap : null;
    } catch (e) { return null; }
  }

  /* ------------------------------------------------------------ the running reader */
  var state = { snap: null, versions: null, timer: null, busy: false, listeners: [] };
  function emit(why) { state.listeners.forEach(function (fn) { try { fn(state.snap, why); } catch (e) {} }); }
  // One refresh: only reloads when either version counter moved. Returns { ok, changed }.
  async function refresh(force) {
    if (!enabled() || state.busy) return { ok: false, changed: false, error: enabled() ? 'busy' : 'off' };
    state.busy = true;
    try {
      var v = await readVersions();
      if (!force && state.versions && state.versions.posters === v.posters && state.versions.world === v.world) return { ok: true, changed: false };
      var snap = await loadSnapshot();
      state.snap = snap; state.versions = snap.versions; save(snap); emit('chain');
      return { ok: true, changed: true };
    } catch (e) {
      return { ok: false, changed: false, error: (e && e.message) || String(e) };   // keep the last good snapshot
    } finally { state.busy = false; }
  }
  // A scene can start at a block height with no write at all, so the version counters do not move. The hall tells us the
  // chain height; when it passes the earliest scene start we know of, read again (at most once per 30 s).
  function onHeight(h) {
    if (!enabled() || !state.snap || !state.snap.bays || state.busy) return false;
    var next = Infinity;
    var all = state.snap.bays.concat(state.snap.rooms && state.snap.rooms.lobby ? state.snap.rooms.lobby.bays : []);
    all.forEach(function (b) { if (b && b.nextHeight != null && b.nextHeight < next) next = b.nextHeight; });
    if (!(h >= next)) return false;
    var now = Date.now();
    if (state.lastHeightRead && now - state.lastHeightRead < 30000) return false;
    state.lastHeightRead = now;
    refresh(true);
    return true;
  }
  // Starts reading. `fn(snapshot)` is called when a snapshot arrives or changes.
  function start(fn) {
    cfgFromHost();
    if (fn) state.listeners.push(fn);
    if (!enabled()) return false;
    var old = restore();
    if (old && !state.snap) { state.snap = old; state.versions = null; emit('cache'); }
    refresh(true);
    if (!state.timer) state.timer = setInterval(function () { refresh(false); }, Math.max(30000, Number(CFG.pollMs) || 240000));
    return true;
  }
  function stop() { if (state.timer) clearInterval(state.timer); state.timer = null; }

  // Bytes of a poster's picture, hash-checked (gateway first, chain as fallback).
  function loadImageBytes(entry) {
    if (!entry || !entry.imageHash || !root.XAScores) return Promise.reject(new Error('no image'));
    return root.XAScores.getInscription(entry.imageId, entry.imageHash);
  }

  root.XAWorld = {
    configure: configure, config: function () { return Object.assign({}, CFG); }, enabled: enabled, mode: mode,
    start: start, stop: stop, refresh: refresh, onHeight: onHeight, snapshot: function () { return state.snap; },
    onChange: function (fn) { state.listeners.push(fn); },
    composeWall: composeWall, pinSlotMap: pinSlotMap, isActive: isActive, loadImageBytes: loadImageBytes,
    // read helpers for sibling modules (the centre screen reads its own contract through these)
    read: callRead, plain: plain, hexList: hexList,
    // exposed for tests
    _t: { plain: plain, toPoster: toPoster, toBay: toBay, readLooks: readLooks, hexList: hexList, normalizePoster: normalizePoster, rng: rng, hash32: hash32,
      loadSnapshot: loadSnapshot, callRead: callRead, restore: restore, save: save, state: state }
  };
})(typeof window !== 'undefined' ? window : globalThis);
