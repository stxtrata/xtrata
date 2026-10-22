/*
 * Xtrata Arcade: centre screen (leaf module, part of the hall pack)
 *
 * The big screen in the middle of the hall. It shows, on one 16:9 canvas:
 *   - the Bitcoin Day clock along the top (what the old day board showed, kept intact)
 *   - LATEST SCORERS on the left (fed by the hall's own score boards, no extra reads)
 *   - a rotating FEATURE panel on the right (news, ads and messages from xtrata-screen-v1)
 *   - a scrolling TICKER along the bottom (short messages and news headlines)
 *
 * Reads one contract: xtrata-screen-v1 (get-version, get-live, get-items). Everything it reads is
 * text and numbers; a picture is fetched through XAWorld.loadImageBytes, which checks it against
 * its chain hash before it is used. Nothing it reads is ever executed.
 *
 * Safety rules (same as world.js, see xtrata-world-standard.md):
 *   - Off by default. With no contract configured, or any read failing, the screen is the Bitcoin Day
 *     clock plus latest scorers, exactly what the hall shows without a contract.
 *   - A read that FAILED keeps the last good snapshot. It is never shown as "no news".
 *   - Expiry is decided here from the chain height, because the contract only prunes on writes.
 *
 * Depends on XAWorld (world.js) for the Clarity read helper. Config: XA_WORLD_CONFIG.screen or
 * XAScreen.configure({ contract }). Tests load it in a vm with a fake window, like world.js.
 */
(function (root) {
  'use strict';
  if (root.XAScreen) return;

  var CFG = {
    contract: '',                // 'SP….xtrata-screen-v1'  (empty = off)
    pollMs: 180000,              // how often to check the version counter
    rotateSecs: 12,              // one feature item at a time
    tickerPxPerSec: 80,
    maxLive: 32,                 // the contract's live-set bound
    snapKey: 'xa-screen-snap-v1'
  };
  var KINDS = { 0: 'MESSAGE', 1: 'NEWS', 2: 'AD' };
  var KIND_COLOUR = { 0: '#8fd3ff', 1: '#ffc53d', 2: '#ff6bd5' };
  var ORANGE = '#f7931a';

  function configure(patch) {
    Object.keys(patch || {}).forEach(function (k) { if (k in CFG) CFG[k] = patch[k]; });
  }
  function enabled() { return !!(CFG.contract && root.XAWorld && root.XAWorld.read); }

  /* ------------------------------------------------------------ pure helpers */
  function normalizeItem(id, t) {
    t = t || {};
    var kind = Number(t.kind);
    return {
      id: Number(id), kind: kind in KINDS ? kind : 0,
      head: String(t.head || '').slice(0, 80), body: String(t.body || '').slice(0, 240),
      imageId: Number(t['image-id'] || 0), imageHash: t['image-hash'] || null, imageSize: Number(t['image-size'] || 0),
      weight: Math.max(1, Math.min(10, Number(t.weight) || 1)),
      paid: !!t.paid, status: Number(t.status), hidden: !!t.hidden,
      startsAt: Number(t['starts-at'] || 0), endsAt: Number(t['ends-at'] || 0)
    };
  }
  // The contract only prunes the live list when somebody writes, so an item can still be listed after it ended.
  function isActive(it, height) {
    if (!it || it.status !== 1 || it.hidden) return false;
    var h = Number(height);
    if (!isFinite(h) || h <= 0) return true;                // height unknown: trust the contract's own list
    return h >= it.startsAt && h < it.endsAt;
  }
  function activeItems(items, height) { return (items || []).filter(function (it) { return isActive(it, height); }); }
  function hasPicture(it) { return !!(it && it.imageSize > 0 && it.imageHash && it.imageId > 0); }

  // Which feature item is up at time t (seconds). Weighted by `weight`, one slot per rotateSecs, the order is a
  // fixed shuffle of the live ids so two people in the hall see the same item at the same moment.
  function featureAt(items, t, secs) {
    var list = (items || []).filter(function (it) { return it.kind !== 0 || it.body || it.head; });
    if (!list.length) return null;
    // weight w = the item appears in the first w layers of the round-robin, so heavier items come round more often
    var layers = [], max = 0; list.forEach(function (it) { if (it.weight > max) max = it.weight; });
    for (var w = 1; w <= max; w++) layers.push(list.filter(function (it) { return it.weight >= w; }).sort(function (a, b) { return a.id - b.id; }));
    var order = []; layers.forEach(function (l) { order = order.concat(l); });
    var n = order.length, k = Math.floor(Math.max(0, t) / Math.max(2, secs || CFG.rotateSecs));
    return order[((k % n) + n) % n];
  }
  function wrapText(measure, text, maxW, maxLines) {
    var words = String(text || '').split(/\s+/).filter(Boolean), lines = [], cur = '';
    for (var i = 0; i < words.length; i++) {
      var tryLine = cur ? cur + ' ' + words[i] : words[i];
      if (measure(tryLine) <= maxW || !cur) { cur = tryLine; }
      else { lines.push(cur); cur = words[i]; if (lines.length >= maxLines) break; }
    }
    if (cur && lines.length < maxLines) lines.push(cur);
    if (words.length && lines.length === maxLines) {
      var used = lines.join(' ').split(/\s+/).length;
      if (used < words.length) { var last = lines[maxLines - 1]; while (last.length > 1 && measure(last + '…') > maxW) last = last.slice(0, -1); lines[maxLines - 1] = last.replace(/[ ,.;:]+$/, '') + '…'; }
    }
    return lines;
  }
  // Ticker text: short messages and news headlines, in a stable order.
  function tickerText(items) {
    var parts = (items || []).filter(function (it) { return it.kind === 0 || it.kind === 1; })
      .sort(function (a, b) { return a.id - b.id; })
      .map(function (it) { return (it.kind === 1 ? it.head : (it.head || it.body)).toUpperCase(); }).filter(Boolean);
    return parts.join('   ◆   ');
  }
  function ago(blocks) {
    var m = Math.max(0, Number(blocks) || 0) * 10;
    if (m < 60) return Math.max(1, Math.round(m)) + 'M';
    if (m < 1440) return Math.round(m / 60) + 'H';
    return Math.round(m / 1440) + 'D';
  }

  /* ------------------------------------------------------------ the reader */
  var state = { snap: null, version: null, timer: null, busy: false, listeners: [], pics: {} };
  function emit(why) { state.listeners.forEach(function (fn) { try { fn(state.snap, why); } catch (e) {} }); }

  async function load() {
    var W = root.XAWorld, C = root.XAScores._codec;
    var ver = W.plain(await W.read(CFG.contract, 'get-version', []));
    var ids = (W.plain(await W.read(CFG.contract, 'get-live', [])) || []).slice(0, CFG.maxLive);
    var items = [];
    for (var i = 0; i < ids.length; i += 10) {
      var chunk = ids.slice(i, i + 10);
      var cv = await W.read(CFG.contract, 'get-items', [W.hexList(chunk.map(function (id) { return C.cvUint(id); }))]);
      cv.value.forEach(function (row, k) {
        var t = row.type === 'some' ? W.plain(row) : null;
        if (t) items.push(normalizeItem(chunk[k], t));
      });
    }
    var height = null;
    try { height = Number(W.plain(await W.read(CFG.contract, 'get-height', []))) || null; } catch (e) { height = null; }
    return { version: ver, at: Date.now(), height: height, items: items };
  }
  // One refresh. Returns { ok, changed }. A failure keeps the last good snapshot.
  async function refresh(force) {
    if (!enabled() || state.busy) return { ok: false, changed: false, error: 'off' };
    state.busy = true;
    try {
      var W = root.XAWorld;
      var v = W.plain(await W.read(CFG.contract, 'get-version', []));
      if (!force && state.version != null && state.version === v) return { ok: true, changed: false };
      var snap = await load();
      state.snap = snap; state.version = snap.version; save(snap); emit('chain');
      return { ok: true, changed: true };
    } catch (e) {
      return { ok: false, changed: false, error: (e && e.message) || String(e) };
    } finally { state.busy = false; }
  }
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
      return JSON.parse(s, function (k, v) { return v && typeof v === 'object' && typeof v.$hex === 'string' ? root.XAScores._codec.hexToBytes(v.$hex) : v; });
    } catch (e) { return null; }
  }
  function start(fn) {
    try { if (root.XA_WORLD_CONFIG && root.XA_WORLD_CONFIG.screen) configure({ contract: root.XA_WORLD_CONFIG.screen }); } catch (e) {}
    if (fn) state.listeners.push(fn);
    if (!enabled()) return false;
    var old = restore();
    if (old && !state.snap) { state.snap = old; emit('cache'); }
    refresh(true);
    if (!state.timer) state.timer = setInterval(function () { refresh(false); }, Math.max(30000, Number(CFG.pollMs) || 180000));
    return true;
  }
  function stop() { if (state.timer) clearInterval(state.timer); state.timer = null; }

  // A feature picture, decoded once. Returns the drawable when ready, else null (and starts loading it).
  function pictureFor(it) {
    if (!hasPicture(it) || !root.XAWorld || !root.XAWorld.loadImageBytes || typeof Image === 'undefined') return null;
    var rec = state.pics[it.id];
    if (rec) return rec.img || null;
    rec = state.pics[it.id] = { img: null, failed: false };
    root.XAWorld.loadImageBytes({ imageId: it.imageId, imageHash: it.imageHash }).then(function (bytes) {
      var blob = new Blob([bytes]), url = URL.createObjectURL(blob), img = new Image();
      img.onload = function () { rec.img = img; emit('picture'); };
      img.onerror = function () { rec.failed = true; };
      img.src = url;
    }).catch(function () { rec.failed = true; });
    return null;
  }

  /* ------------------------------------------------------------ the painter */
  // Draws one frame. `d` = { height, day, blocksPerDay, live, items, scorers:[{game,name,score,age,colour}], t }.
  // `ctx` is a 2D context sized W x H (16:9). Pure apart from picture loading, so it runs with a fake context in Node.
  function paint(ctx, W, H, d) {
    var x = ctx, bpd = d.blocksPerDay || 144, h = d.height || 0, done = h % bpd, left = bpd - done;
    var u = H / 720;
    x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1;
    x.fillStyle = '#050408'; x.fillRect(0, 0, W, H);
    x.textBaseline = 'alphabetic'; x.textAlign = 'left'; x.shadowBlur = 0;

    // --- header: Bitcoin Day clock
    x.font = Math.round(34 * u) + 'px Bungee, Impact, sans-serif'; x.fillStyle = ORANGE; x.shadowColor = ORANGE; x.shadowBlur = 12;
    x.fillText('BITCOIN DAY', 28 * u, 52 * u);
    var lw0 = x.measureText('BITCOIN DAY').width;
    x.font = Math.round(78 * u) + 'px VT323, monospace'; x.fillStyle = '#ffc53d'; x.shadowColor = '#ffb000'; x.shadowBlur = 22;
    x.fillText(String(d.day), 28 * u + lw0 + 20 * u, 62 * u);
    x.shadowBlur = 0; x.textAlign = 'right'; x.font = Math.round(32 * u) + 'px VT323, monospace';
    var approx = d.live ? '' : '≈';
    x.fillStyle = '#eef2ff'; x.fillText('BLOCK ' + approx + h.toLocaleString('en-US'), W - 28 * u, 36 * u);
    x.fillStyle = '#8fd3ff'; x.fillText(approx + 'NEXT DAY IN ' + left + ' BLOCK' + (left === 1 ? '' : 'S'), W - 28 * u, 66 * u);
    var segW = (W - 56 * u) / bpd;
    for (var i = 0; i < bpd; i++) { x.fillStyle = i < done ? ORANGE : i === done ? '#ffffff' : '#1d1a24'; x.fillRect(28 * u + i * segW, 80 * u, Math.max(1, segW - 1), 10 * u); }

    // --- left: latest scorers
    var lx = 28 * u, lw = 400 * u, top = 112 * u, bottom = H - 120 * u;
    x.textAlign = 'left'; x.font = Math.round(28 * u) + 'px Bungee, Impact, sans-serif'; x.fillStyle = '#3be4ff'; x.shadowColor = '#3be4ff'; x.shadowBlur = 8;
    x.fillText('LATEST SCORERS', lx, top + 24 * u); x.shadowBlur = 0;
    x.fillStyle = '#3be4ff'; x.fillRect(lx, top + 36 * u, lw, 2 * u);
    var rows = (d.scorers || []).slice(0, 8), rh = (bottom - (top + 48 * u)) / 8;
    x.font = Math.round(26 * u) + 'px VT323, monospace';
    if (!rows.length) {
      x.fillStyle = '#6f6a8f'; x.fillText('NO SCORES YET TODAY', lx, top + 48 * u + rh);
    }
    rows.forEach(function (r, k) {
      var y = top + 48 * u + rh * k + rh * .72;
      x.textAlign = 'left'; x.fillStyle = r.colour || '#3be4ff'; x.fillText(String(r.game).toUpperCase().slice(0, 13), lx, y);
      x.fillStyle = '#ffffff'; x.fillText(String(r.name).slice(0, 10), lx + 172 * u, y);
      x.textAlign = 'right'; x.fillStyle = '#ffc53d'; x.fillText(String(r.score), lx + lw - 56 * u, y);
      x.fillStyle = '#6f6a8f'; x.fillText(r.age == null ? '' : ago(r.age), lx + lw, y);
    });

    // --- right: feature panel
    var px = 460 * u, pw = W - px - 28 * u, py = top, ph = bottom - top;
    x.fillStyle = '#0d0b16'; x.fillRect(px, py, pw, ph);
    var it = featureAt(d.items, d.t || 0, d.rotateSecs || CFG.rotateSecs);
    if (it) paintFeature(x, it, px, py, pw, ph, u);
    else paintIdle(x, d, px, py, pw, ph, u);

    // --- bottom: ticker
    var ty = H - 100 * u, th = 100 * u;
    x.fillStyle = '#0a0812'; x.fillRect(0, ty, W, th);
    x.fillStyle = ORANGE; x.fillRect(0, ty, W, 3 * u);
    var text = tickerText(d.items) || 'EVERY TOP SCORE LIVES ON BITCOIN';
    x.font = Math.round(44 * u) + 'px VT323, monospace'; x.textAlign = 'left'; x.fillStyle = '#eef2ff';
    var gap = 120 * u, tw = Math.max(1, x.measureText(text).width), cycle = tw + gap;
    var off = ((d.t || 0) * CFG.tickerPxPerSec * u) % cycle;
    x.save(); x.beginPath(); x.rect(0, ty + 3 * u, W, th - 3 * u); x.clip();
    for (var n = -1; n * cycle - off < W; n++) x.fillText(text, n * cycle - off, ty + 66 * u);
    x.restore();

    // --- scanlines
    x.fillStyle = 'rgba(0,0,0,.30)'; for (var yy = 0; yy < H; yy += 4) x.fillRect(0, yy, W, 1.4);
    x.restore();
  }
  function paintFeature(x, it, px, py, pw, ph, u) {
    var col = KIND_COLOUR[it.kind] || '#8fd3ff', pic = pictureFor(it), pad = 28 * u;
    x.fillStyle = col; x.fillRect(px, py, 6 * u, ph);
    x.textAlign = 'left'; x.font = Math.round(24 * u) + 'px Bungee, Impact, sans-serif'; x.shadowColor = col; x.shadowBlur = 8; x.fillStyle = col;
    x.fillText(KINDS[it.kind] + (it.paid && it.kind === 2 ? ' · PAID' : ''), px + pad, py + 40 * u); x.shadowBlur = 0;
    var textW = pw - pad * 2, imgW = 0;
    if (pic) {
      imgW = Math.min(ph * .62, pw * .36);
      var ix = px + pw - pad - imgW, iy = py + 60 * u, ih = imgW * (pic.naturalHeight / Math.max(1, pic.naturalWidth));
      ih = Math.min(ih, ph - 80 * u);
      try { x.drawImage(pic, ix, iy, imgW, ih); } catch (e) {}
      x.strokeStyle = col; x.lineWidth = 2 * u; x.strokeRect(ix, iy, imgW, ih);
      textW = pw - pad * 3 - imgW;
    }
    x.fillStyle = '#ffffff'; x.font = Math.round(52 * u) + 'px VT323, monospace';
    var head = wrapText(function (s) { return x.measureText(s).width; }, it.head.toUpperCase(), textW, 3), y = py + 100 * u;
    head.forEach(function (l) { x.fillText(l, px + pad, y); y += 54 * u; });
    x.fillStyle = '#c9c4ee'; x.font = Math.round(36 * u) + 'px VT323, monospace';
    var body = wrapText(function (s) { return x.measureText(s).width; }, it.body, textW, Math.max(1, Math.floor((py + ph - y - 24 * u) / (38 * u))));
    y += 8 * u; body.forEach(function (l) { x.fillText(l, px + pad, y); y += 38 * u; });
  }
  function paintIdle(x, d, px, py, pw, ph, u) {
    x.textAlign = 'center'; x.fillStyle = '#ffc53d'; x.shadowColor = '#ffb000'; x.shadowBlur = 20;
    x.font = Math.round(150 * u) + 'px VT323, monospace'; x.fillText(String(d.day), px + pw / 2, py + ph * .58); x.shadowBlur = 0;
    x.fillStyle = ORANGE; x.font = Math.round(30 * u) + 'px Bungee, Impact, sans-serif'; x.fillText('BITCOIN DAY', px + pw / 2, py + ph * .30);
    x.fillStyle = '#8fd3ff'; x.font = Math.round(34 * u) + 'px VT323, monospace'; x.fillText('EVERY TOP SCORE LIVES ON BITCOIN', px + pw / 2, py + ph * .82);
  }

  /* ------------------------------------------------------------ latest scorers (pure) */
  // Builds the scorers list from the hall's board cache. `boards` = [{ game, colour, mode, entries:[{name,score,burn}] }].
  // Newest first; entries older than `windowBlocks` burn blocks are left out. `fmt(mode, score)` formats a score.
  function latestScorers(boards, height, windowBlocks, fmt, limit) {
    var out = [], win = windowBlocks || 288, h = Number(height) || 0;
    (boards || []).forEach(function (b) {
      (b.entries || []).forEach(function (e) {
        var burn = Number(e.burn);
        if (!isFinite(burn) || burn <= 0) return;
        var age = h ? h - burn : 0;
        if (h && (age < 0 || age > win)) return;
        out.push({ game: b.game, colour: b.colour, name: String(e.name || ''), score: fmt ? fmt(b.mode, e.score) : String(e.score), age: age, burn: burn });
      });
    });
    out.sort(function (a, b) { return b.burn - a.burn; });
    var seen = {}, uniq = [];
    out.forEach(function (r) { var k = r.game + '|' + r.name + '|' + r.score; if (!seen[k]) { seen[k] = 1; uniq.push(r); } });
    return uniq.slice(0, limit || 8);
  }

  var api = {
    configure: configure, config: function () { return Object.assign({}, CFG); }, enabled: enabled,
    start: start, stop: stop, refresh: refresh, snapshot: function () { return state.snap; },
    onChange: function (fn) { state.listeners.push(fn); },
    items: function () { return state.snap ? state.snap.items : []; },
    paint: paint, latestScorers: latestScorers,
    normalizeItem: normalizeItem, isActive: isActive, activeItems: activeItems, featureAt: featureAt,
    wrapText: wrapText, tickerText: tickerText, ago: ago, hasPicture: hasPicture,
    _t: { state: state, load: load, restore: restore, save: save }
  };
  root.XAScreen = api;
})(typeof window !== 'undefined' ? window : globalThis);
