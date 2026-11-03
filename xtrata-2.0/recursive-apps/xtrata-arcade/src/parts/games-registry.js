/*
 * Extra games from the games contract (xtrata-games-v1).
 *
 * The 21 built-in games are part of the hall and nothing here can touch them. This part adds games that were
 * registered on chain after the hall was inscribed: it reads the contract before the engine starts, fetches each live
 * game's cartridge script from its inscription (hash-checked), gives it its permanent replay index, and runs it so it
 * registers itself like any built-in game. The hall then builds one cabinet per registered game, so the room grows by itself.
 *
 * Never blocks the hall: no contract configured (window.XA_GAMES_CONFIG absent) = nothing happens; a failed read, a slow
 * read, or a bad game = the built-in 21 (plus any good extras) and the reason in XAGamesRegistry.status().
 * The parent calls window.XA_PREBOOT() and waits for it (with its own time limit) before the engine starts.
 */
(function (root) {
  'use strict';
  if (root.XAGamesRegistry) return;

  var KIND_CARTRIDGE = 1;
  var KIND_FRAMED = 2;                // a game that is its own page (an inscription): the hall gives it a cabinet and frames it when played
  var KIND_MANIFEST = 3;              // a framed game described by a small picture (SVG) that names the real game's inscription and its hash, and carries the cabinet art
  var FRAMED_CAP = 16 * 1024 * 1024;  // the same limit as a room page
  var MANIFEST_CAP = 4 * 1024 * 1024; // a manifest picture is small; this only bounds a mistake
  var ART_CAP = 2 * 1024 * 1024;      // each embedded cabinet picture
  var MAX_ADDED = 64;                 // the contract's own cap; also a safety bound here
  var TIME_LIMIT_MS = 20000;          // the whole load, after which the hall starts with what it has
  var ID_OK = /^[a-z0-9_]{3,24}$/;
  var state = { configured: false, done: false, ok: false, error: '', count: 0, loaded: [], skipped: [] };

  function num(cv) { return cv && cv.value !== undefined && cv.value !== null ? Number(cv.value) : NaN; }
  function field(t, k) { return t && t[k] ? t[k] : null; }

  function skip(id, why) { state.skipped.push({ id: id, reason: why }); }

  // One record from get-games → a plain object, or null when the slot is empty.
  function parseGame(n, cv) {
    if (!cv || cv.type !== 'some' || !cv.value || cv.value.type !== 'tuple') return null;
    var t = cv.value.value;
    var hash = field(t, 'code-hash');
    return {
      n: n,
      id: field(t, 'id') ? String(field(t, 'id').value) : '',
      title: field(t, 'title') ? String(field(t, 'title').value) : '',
      index: num(field(t, 'index')),
      kind: num(field(t, 'kind')),
      engineMin: num(field(t, 'engine-min')),
      codeId: num(field(t, 'code-id')),
      codeHash: hash && hash.value ? hash.value : null,
      codeSize: num(field(t, 'code-size')),
      liveAt: num(field(t, 'live-at')),
      hidden: !!(field(t, 'hidden') && field(t, 'hidden').value)
    };
  }

  function runCartridge(g, code) {
    var XA = root.XA, before = XA.games.map(function (x) { return x.id; });
    var s = root.document.createElement('script');
    s.setAttribute('data-xa-game', g.id);
    s.text = code + '\n//# sourceURL=xa-game-' + g.id;
    root.document.body.appendChild(s);                    // a throwing cartridge cannot stop the rest
    // A cartridge may only register its own id: anything else it registered is removed again.
    for (var i = XA.games.length - 1; i >= 0; i--) {
      var id = XA.games[i].id;
      if (before.indexOf(id) < 0 && id !== g.id) XA.games.splice(i, 1);
    }
    var mine = XA.games.filter(function (x) { return x.id === g.id; })[0];
    if (!mine) return false;
    mine.order = 1000 + g.n;                              // after the built-in games, in the order they were added
    XA.games.sort(function (a, b) { return (a.order || 99) - (b.order || 99); });
    return true;
  }

  // The manifest picture (an SVG): <metadata id="xtrata-game"> holds JSON { v:1, kind:"framed-game", game:{ id, hash, size }, board? }, and two <image> elements
  // (id xa-cab-side, id xa-cab-marquee) hold the cabinet art as data URIs. The picture is only READ as text: it is never put in the page, never run.
  function parseManifest(text, gameId, C) {
    var m = /<metadata\b[^>]*\bid="xtrata-game"[^>]*>([\s\S]*?)<\/metadata>/.exec(text);
    if (!m) throw new Error('no game note in the picture');
    var raw = m[1].replace(/^\s*<!\[CDATA\[/, '').replace(/\]\]>\s*$/, '');
    var j;
    try { j = JSON.parse(raw); } catch (e) { throw new Error('the game note is not valid'); }
    var g = j && j.game;
    if (!j || j.v !== 1 || j.kind !== 'framed-game' || !g) throw new Error('not a framed-game note');
    if (!(Number.isSafeInteger(g.id) && g.id > 0) || !/^[0-9a-fA-F]{64}$/.test(String(g.hash || '')) || !(Number.isSafeInteger(g.size) && g.size > 0 && g.size <= FRAMED_CAP)) throw new Error('the game note is incomplete');
    if (j.board !== undefined && j.board !== gameId) throw new Error('the note is for a different board');
    function art(id) {
      var tag = new RegExp('<image\\b[^>]*\\bid="' + id + '"[^>]*>').exec(text);
      if (!tag) return null;
      var h = /(?:xlink:)?href="(data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+\/=]+)"/.exec(tag[0]);
      return h && h[1].length <= ART_CAP ? h[1] : null;
    }
    return { game: { id: g.id, hash: C.hexToBytes(g.hash), size: g.size }, art: { side: art('xa-cab-side'), marquee: art('xa-cab-marquee') } };
  }

  // The cabinet's neon colours, by game number, so every framed game looks different without anything else on chain.
  var COLOURS = ['#3be4ff', '#ff5cf0', '#ffb347', '#7dffb2', '#ff6b6b', '#a78bfa'];

  // A framed game is registered like any other game (so it gets a cabinet, a Top 10 on its screen, a place in the High scores list)
  // but it has no script of its own: def.framed says which inscription to frame, and the hall does the rest.
  function registerFramed(g, framed, art) {
    var XA = root.XA;
    var color = COLOURS[g.n % COLOURS.length];
    var title = g.title || g.id;
    try {
      XA.registerGame({
        id: g.id, order: 1000 + g.n, title: title, tagline: 'Played straight from the chain', color: color,
        size: { w: 320, h: 240 }, controls: 'Opens the original game',
        framed: framed, cabinetArt: art || null,
        create: function () { throw new Error('a framed game is played in its own frame'); },
        attract: function (ctx, w, h, t) { drawFramedAttract(ctx, t || 0, w || 320, h || 240, title, color, framed.id); }
      });
    } catch (e) { return false; }
    return XA.games.some(function (x) { return x.id === g.id; });
  }

  // What a framed game's cabinet shows when nobody is playing: its name over a moving star field.
  function drawFramedAttract(ctx, t, w, h, title, color, codeId) {
    ctx.save();
    ctx.fillStyle = '#05040f'; ctx.fillRect(0, 0, w, h);
    for (var i = 0; i < 46; i++) {
      var sp = 14 + (i * 37) % 60, x = (i * 97.3) % w, y = ((i * 53.7) + t * sp) % h;
      ctx.globalAlpha = 0.25 + ((i * 13) % 7) / 10; ctx.fillStyle = i % 5 === 0 ? color : '#dfe8ff';
      ctx.fillRect(x, y, i % 3 === 0 ? 2 : 1, i % 3 === 0 ? 2 : 1);
    }
    ctx.globalAlpha = 1; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    var size = Math.max(14, Math.min(h * 0.16, w * 1.5 / Math.max(6, String(title).length)));
    ctx.font = 'bold ' + Math.round(size) + 'px Bungee, Impact, sans-serif';
    ctx.shadowColor = color; ctx.shadowBlur = 18; ctx.fillStyle = color;
    ctx.fillText(String(title).toUpperCase(), w / 2, h * 0.44);
    ctx.shadowBlur = 0; ctx.fillStyle = '#e8e2ff'; ctx.font = Math.round(h * 0.075) + 'px VT323, monospace';
    ctx.globalAlpha = 0.6 + 0.4 * Math.sin(t * 3.1);
    ctx.fillText('PRESS START', w / 2, h * 0.64);
    ctx.globalAlpha = 0.55; ctx.fillText('INSCRIPTION #' + codeId, w / 2, h * 0.86);
    ctx.restore();
  }

  async function load() {
    var cfg = root.XA_GAMES_CONFIG;
    if (!cfg || !cfg.contract) return state;              // off: the hall is exactly the built-in 21
    state.configured = true;
    var S = root.XAScores, XA = root.XA, R = XA && XA.replay;
    if (!S || !S.read || !XA || !R || !R.registerIndex) { state.error = 'engine not ready'; return state; }
    var C = S._codec, contract = String(cfg.contract);
    var closed = false;
    var handle = null;
    var timer = new Promise(function (res) { handle = setTimeout(function () { closed = true; res('late'); }, cfg.timeoutMs || TIME_LIMIT_MS); });

    var work = (async function () {
      var count = num(await S.read('get-count', [], contract));
      var height = num(await S.read('get-height', [], contract));
      if (!(count >= 0) || !(height >= 0)) throw new Error('unexpected reply from the games contract');
      state.count = count;
      count = Math.min(count, MAX_ADDED);
      var games = [];
      for (var from = 0; from < count; from += 10) {
        var ids = [];
        for (var k = from; k < Math.min(count, from + 10); k++) ids.push(C.cvUint(k));
        var list = await S.read('get-games', [C.cvList(ids)], contract);
        if (!list || list.type !== 'list') throw new Error('unexpected get-games reply');
        list.value.forEach(function (cv, j) { var g = parseGame(from + j, cv); if (g) games.push(g); });
      }
      // Which games are loaded now: live, not hidden, a kind and engine this hall understands, a valid new id.
      var wanted = games.filter(function (g) {
        if (g.hidden) { skip(g.id, 'hidden'); return false; }
        if (!(g.liveAt <= height)) { skip(g.id, 'not live yet'); return false; }
        if (g.kind !== KIND_CARTRIDGE && g.kind !== KIND_FRAMED && g.kind !== KIND_MANIFEST) { skip(g.id, 'unknown kind'); return false; }
        if (g.kind === KIND_FRAMED && !(g.codeSize > 0 && g.codeSize <= FRAMED_CAP)) { skip(g.id, 'too big to frame'); return false; }
        if (g.kind === KIND_MANIFEST && !(g.codeSize > 0 && g.codeSize <= MANIFEST_CAP)) { skip(g.id, 'manifest too big'); return false; }
        if (!(g.engineMin <= (R.ENGINE || 1))) { skip(g.id, 'needs a newer engine'); return false; }
        if (!ID_OK.test(g.id)) { skip(g.id, 'invalid id'); return false; }
        if (XA.games.some(function (x) { return x.id === g.id; }) || R.GAME_IDS.indexOf(g.id) >= 0 && R.GAME_IDS.indexOf(g.id) < (R.BUILT_IN || 21)) { skip(g.id, 'built-in id'); return false; }
        if (!g.codeHash || g.codeHash.length !== 32) { skip(g.id, 'bad hash'); return false; }
        return true;
      });
      // A framed game is not run here: it gets a cabinet now and its page is fetched (and checked) only when someone plays it.
      var framed = wanted.filter(function (g) { return g.kind === KIND_FRAMED; });
      framed.forEach(function (g) {
        if (closed) return;
        if (!registerFramed(g, { id: g.codeId, hash: g.codeHash, size: g.codeSize }, null)) { skip(g.id, 'could not make a cabinet'); return; }
        state.loaded.push(g.id);
      });
      // A manifest game: the contract's inscription is a small picture (checked against the contract's hash) that names the real game's inscription,
      // its hash and size, and carries the cabinet art. The real game is still fetched only when played, and must match the hash the picture names.
      var manifests = wanted.filter(function (g) { return g.kind === KIND_MANIFEST; });
      wanted = wanted.filter(function (g) { return g.kind === KIND_CARTRIDGE; });
      var mfetched = await Promise.all(manifests.map(function (g) {
        return S.getInscription(g.codeId, g.codeHash).then(function (bytes) {
          if (bytes.length !== g.codeSize) throw new Error('size differs from the contract');
          return parseManifest(new TextDecoder('utf-8').decode(bytes), g.id, C);
        }).then(function (m) { return { g: g, m: m }; }, function (e) { skip(g.id, 'manifest: ' + ((e && e.message) || e)); return null; });
      }));
      mfetched.forEach(function (f) {
        if (!f || closed) return;
        if (!registerFramed(f.g, f.m.game, f.m.art)) { skip(f.g.id, 'could not make a cabinet'); return; }
        state.loaded.push(f.g.id);
      });
      // Fetch every cartridge at once (gateway first, chain as fallback; the bytes must match the contract's hash).
      var fetched = await Promise.all(wanted.map(function (g) {
        return S.getInscription(g.codeId, g.codeHash).then(function (bytes) {
          if (bytes.length !== g.codeSize) throw new Error('size differs from the contract');
          return new TextDecoder('utf-8').decode(bytes);
        }).then(function (text) { return { g: g, text: text }; }, function (e) { skip(g.id, 'could not load: ' + ((e && e.message) || e)); return null; });
      }));
      if (closed) return;                                  // too late: the hall has started without them
      // Run in the order they were added.
      fetched.forEach(function (f) {
        if (!f || closed) return;
        var g = f.g;
        var ran = false;
        try { ran = runCartridge(g, f.text); } catch (e) { skip(g.id, 'cartridge error: ' + ((e && e.message) || e)); return; }
        if (!ran) { skip(g.id, 'did not register itself'); return; }
        // The replay number is given only to a game that is really in the hall, so a failed game leaves no trace.
        if (!R.registerIndex(g.id, g.index)) {
          for (var i = XA.games.length - 1; i >= 0; i--) if (XA.games[i].id === g.id) XA.games.splice(i, 1);
          skip(g.id, 'replay index refused');
          return;
        }
        state.loaded.push(g.id);
      });
      state.ok = true;
    })();

    try {
      await Promise.race([work.catch(function (e) { state.error = (e && e.message) || String(e); }), timer]);
    } finally {
      clearTimeout(handle);
      state.done = true;
      if (closed && !state.error && !state.ok) state.error = 'timed out';
    }
    return state;
  }

  var started = null;
  root.XA_PREBOOT = function () { if (!started) started = load().catch(function (e) { state.error = (e && e.message) || String(e); state.done = true; return state; }); return started; };
  root.XAGamesRegistry = { status: function () { return JSON.parse(JSON.stringify(state)); }, load: root.XA_PREBOOT };
})(typeof window !== 'undefined' ? window : globalThis);
