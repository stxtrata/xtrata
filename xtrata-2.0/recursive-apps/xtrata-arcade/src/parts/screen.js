/*
 * Xtrata Arcade: centre screen (leaf module, part of the hall pack)
 *
 * The big screen in the middle of the hall. It shows, on one 16:9 canvas:
 *   - the Bitcoin Day clock along the top (what the old day board showed, kept intact)
 *   - the left column alternates (fed by the hall's own score boards, no extra reads): LATEST SCORERS for 20 s, then the NUMBER ONES
 *     (the current best score on every board, newest crown first, paged) for 40 s, then latest scorers again, then the number ones A to Z
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
    fullEvery: 3,                // every 3rd slot is a full-screen slot (when something has a picture to show)
    tickerPxPerSec: 80,
    leftLatestSecs: 20,          // left column: latest scorers for this long ...
    leftChampSecs: 40,           // ... then the number ones for this long (newest crown first, then the next round A to Z)
    leftRows: 8,                 // rows on a page
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
      layout: Number(t.layout) === 1 ? 1 : 0,     // 0 standard, 1 full-screen only (premium)
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

  // Weighted round-robin over a list: weight w = the item appears in the first w layers, so heavier items come round more often.
  function pick(list, k) {
    if (!list.length) return null;
    var layers = [], max = 0; list.forEach(function (it) { if (it.weight > max) max = it.weight; });
    for (var w = 1; w <= max; w++) layers.push(list.filter(function (it) { return it.weight >= w; }).sort(function (a, b) { return a.id - b.id; }));
    var order = []; layers.forEach(function (l) { order = order.concat(l); });
    var n = order.length;
    return order[((k % n) + n) % n];
  }
  // What is on the feature panel / screen at time t (seconds): { item, full }.
  // Two rotations share the clock, one slot per rotateSecs, the same for everyone in the hall at the same moment:
  //   panel rotation       standard items (layout 0), weighted, shown in the feature panel
  //   full-screen rotation every item with a picture (standard ones and the full-screen-only premium ones), shown on the whole screen
  // Every fullEvery-th slot is a full-screen slot, so everything with a picture gets the whole screen now and then, while a
  // full-screen-only item is never shown in the panel. With nothing to put full-screen it is all panel; with only full-screen items, all full.
  function slotAt(items, t, secs, every) {
    var panel = (items || []).filter(function (it) { return it.layout !== 1 && (it.kind !== 0 || it.body || it.head); });
    var full = (items || []).filter(function (it) {
      var rec = state.pics[it.id];
      return hasPicture(it) && !(rec && rec.failed);
    });
    var secs2 = Math.max(2, secs || CFG.rotateSecs), n = Math.max(2, Math.floor(every || CFG.fullEvery) || 3);
    var k = Math.floor(Math.max(0, t) / secs2);
    if (!panel.length && !full.length) return { item: null, full: false };
    if (!full.length) return { item: pick(panel, k), full: false };
    if (!panel.length) return { item: pick(full, k), full: true };
    var cycle = Math.floor(k / n), r = k % n;
    if (r === n - 1) return { item: pick(full, cycle), full: true };
    return { item: pick(panel, cycle * (n - 1) + r), full: false };
  }
  function featureAt(items, t, secs) { return slotAt(items, t, secs).item; }
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
      if (used < words.length) {
        // cut at a word boundary: drop whole words until the ellipsis fits; only a lone long word is cut by character
        var last = lines[maxLines - 1];
        while (measure(last + '…') > maxW && last.indexOf(' ') > 0) last = last.slice(0, last.lastIndexOf(' '));
        while (last.length > 1 && measure(last + '…') > maxW) last = last.slice(0, -1);
        lines[maxLines - 1] = last.replace(/[ ,.;:]+$/, '') + '…';
      }
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
  var state = { snap: null, version: null, timer: null, busy: false, listeners: [], pics: {}, animating: false };
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
    if (!enabled() || state.busy) return { ok: false, changed: false, error: enabled() ? 'busy' : 'off' };
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

  // What kind of media are these bytes? Decided from the bytes themselves (the contract only stores an id, a hash and a size),
  // never from a name or a type somebody claims. Anything not on this list is refused: no SVG, no HTML, nothing that can run.
  function sniffMedia(b) {
    if (!b || b.length < 12) return null;
    if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return { kind: 'png', mime: 'image/png', video: false, animated: false };
    if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { kind: 'jpeg', mime: 'image/jpeg', video: false, animated: false };
    if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38) return { kind: 'gif', mime: 'image/gif', video: false, animated: true };
    if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return { kind: 'webp', mime: 'image/webp', video: false, animated: true };
    if (b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70) return { kind: 'mp4', mime: 'video/mp4', video: true, animated: true };
    if (b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3) return { kind: 'webm', mime: 'video/webm', video: true, animated: true };
    return null;
  }
  function dims(m) {
    if (!m) return { w: 1, h: 1 };
    return { w: Math.max(1, m.videoWidth || m.naturalWidth || m.width || 1), h: Math.max(1, m.videoHeight || m.naturalHeight || m.height || 1) };
  }
  // A feature picture (or short clip), decoded once. Returns the drawable when ready, else null (and starts loading it).
  // Pictures and animated GIF / WebP are an Image; MP4 / WebM are a muted, looping video element that is never put on the page.
  // The painter pauses every clip that is not the one on screen.
  function pictureFor(it) {
    if (!hasPicture(it) || !root.XAWorld || !root.XAWorld.loadImageBytes || typeof Image === 'undefined') return null;
    var rec = state.pics[it.id];
    if (rec) return rec.img || null;
    rec = state.pics[it.id] = { img: null, failed: false, video: null, animated: false };
    root.XAWorld.loadImageBytes({ imageId: it.imageId, imageHash: it.imageHash }).then(function (bytes) {
      var media = sniffMedia(bytes);
      if (!media) { rec.failed = true; return; }
      var url = URL.createObjectURL(new Blob([bytes], { type: media.mime }));
      rec.animated = media.animated;
      if (media.video) {
        if (typeof document === 'undefined') { rec.failed = true; return; }
        var v = document.createElement('video');
        v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'auto'; v.setAttribute('playsinline', ''); v.setAttribute('muted', '');
        v.onloadeddata = function () { rec.video = v; rec.img = v; emit('picture'); };
        v.onerror = function () { rec.failed = true; };
        v.src = url;
      } else {
        var img = new Image();
        img.onload = function () { rec.img = img; emit('picture'); };
        img.onerror = function () { rec.failed = true; };
        img.src = url;
      }
    }).catch(function () { rec.failed = true; });
    return null;
  }
  // Called once per frame with the item on screen: play its clip, pause the others, say whether the screen needs a fast repaint.
  function tendMedia(current) {
    var animating = false;
    Object.keys(state.pics).forEach(function (k) {
      var rec = state.pics[k], on = current && String(current.id) === k;
      if (rec.video) {
        try { if (on) { if (rec.video.paused) { var p = rec.video.play(); if (p && p.catch) p.catch(function () {}); } } else if (!rec.video.paused) rec.video.pause(); } catch (e) {}
      }
      if (on && rec.img && rec.animated) animating = true;
    });
    state.animating = animating;
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

    // --- left: latest scorers, alternating with the number ones (newest crown first, then A to Z)
    var lx = 28 * u, lw = 400 * u, top = 112 * u, bottom = H - 120 * u, NR = CFG.leftRows;
    var champs = d.champions && d.champions.length ? d.champions : null, ph0 = leftPhase(d.t || 0, !!champs), shownRows, title, sub = '';
    var rh = (bottom - (top + 48 * u)) / NR, fade = 1;
    if (ph0.kind === 'champs') {
      var list = orderChampions(champs, ph0.order), pages = Math.max(1, Math.ceil(list.length / NR));
      var pageSecs = pages > 1 ? Math.min(10, Math.max(5, CFG.leftChampSecs / pages)) : CFG.leftChampSecs, pi = Math.floor(ph0.local / pageSecs) % pages, pt = ph0.local - Math.floor(ph0.local / pageSecs) * pageSecs;
      shownRows = list.slice(pi * NR, pi * NR + NR); title = 'NUMBER ONES';
      sub = (ph0.order === 'new' ? 'NEWEST FIRST' : 'A TO Z') + (pages > 1 ? '  ' + (pi + 1) + '/' + pages : '');
      if (pages > 1) fade = Math.max(0, Math.min(1, pt / .35, (pageSecs - pt) / .35));
    } else { shownRows = (d.scorers || []).slice(0, NR); title = 'LATEST SCORERS'; }
    x.textAlign = 'left'; x.font = Math.round(28 * u) + 'px Bungee, Impact, sans-serif'; x.fillStyle = '#3be4ff'; x.shadowColor = '#3be4ff'; x.shadowBlur = 8;
    x.fillText(title, lx, top + 24 * u); x.shadowBlur = 0;
    if (sub) { x.font = Math.round(22 * u) + 'px VT323, monospace'; x.textAlign = 'right'; x.fillStyle = '#8fd3ff'; x.fillText(sub, lx + lw, top + 24 * u); x.textAlign = 'left'; }
    x.fillStyle = '#3be4ff'; x.fillRect(lx, top + 36 * u, lw, 2 * u);
    x.font = Math.round(26 * u) + 'px VT323, monospace';
    if (!shownRows.length) {
      x.fillStyle = '#6f6a8f'; x.fillText('NO SCORES YET', lx, top + 48 * u + rh);
    }
    x.globalAlpha = fade;
    shownRows.forEach(function (r, k) {
      var y = top + 48 * u + rh * k + rh * .72;
      if (ph0.kind === 'champs' && r.claimed && r.age != null && r.age < bpd) { x.fillStyle = 'rgba(57,255,136,.08)'; x.fillRect(lx - 6 * u, y - rh * .72, lw + 12 * u, rh - 2 * u); }
      x.font = Math.round(26 * u) + 'px VT323, monospace';
      x.textAlign = 'left'; x.fillStyle = r.claimed === false ? dim(r.colour) : (r.colour || '#3be4ff'); x.fillText(String(r.game).toUpperCase().slice(0, 13), lx, y);
      if (r.claimed === false) {
        x.fillStyle = '#6f6a8f'; x.fillText('NO #1 YET', lx + 172 * u, y);
        x.textAlign = 'right'; x.fillStyle = '#ffc53d'; x.fillText('BE FIRST', lx + lw, y);
        return;
      }
      x.fillStyle = '#ffffff'; x.fillText(String(r.name).slice(0, 10), lx + 172 * u, y);
      x.textAlign = 'right'; x.fillStyle = '#ffc53d'; x.fillText(String(r.score), lx + lw - 56 * u, y);
      var fresh = ph0.kind === 'champs' && r.age != null && r.age < bpd;
      x.fillStyle = fresh ? '#39ff88' : '#6f6a8f'; x.fillText(r.age == null ? '' : ago(r.age), lx + lw, y);
      if (fresh) { x.font = Math.round(14 * u) + 'px VT323, monospace'; x.fillStyle = '#39ff88'; x.fillText('NEW', lx + lw, y - 24 * u); }
    });
    x.globalAlpha = 1;

    // --- right: feature panel
    var px = 460 * u, pw = W - px - 28 * u, py = top, ph = bottom - top;
    x.fillStyle = '#0d0b16'; x.fillRect(px, py, pw, ph);
    var slot = slotAt(d.items, d.t || 0, d.rotateSecs || CFG.rotateSecs, d.fullEvery), it = slot.item;
    tendMedia(it);
    // look one slot ahead: if the next slot is a full-screen one, start fetching its picture now so it is ready when its turn comes
    var nx = slotAt(d.items, (d.t || 0) + (d.rotateSecs || CFG.rotateSecs), d.rotateSecs || CFG.rotateSecs, d.fullEvery);
    if (nx.item && nx.full && nx.item !== it) pictureFor(nx.item);
    if (it) paintFeature(x, it, px, py, pw, ph, u, slot.full);
    else paintIdle(x, d, px, py, pw, ph, u);

    // --- bottom: ticker
    var ty = H - 100 * u, th = 100 * u;
    // a full-screen slot takes over everything above the ticker, but only once its picture is ready (until then the item shows in the panel)
    var bigPic = it && slot.full ? pictureFor(it) : null;
    if (bigPic) paintFill(x, it, bigPic, 0, 0, W, ty, u);
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
  function paintFeature(x, it, px, py, pw, ph, u, full) {
    var col = KIND_COLOUR[it.kind] || '#8fd3ff', pic = pictureFor(it), pad = 28 * u;
    if (full && pic) return;                              // a full-screen slot with its picture ready: paint() draws it over the whole screen
    x.fillStyle = col; x.fillRect(px, py, 6 * u, ph);
    x.textAlign = 'left'; x.font = Math.round(24 * u) + 'px Bungee, Impact, sans-serif'; x.shadowColor = col; x.shadowBlur = 8; x.fillStyle = col;
    x.fillText(KINDS[it.kind] + (it.paid && it.kind === 2 ? ' · PAID' : ''), px + pad, py + 40 * u); x.shadowBlur = 0;
    var textW = pw - pad * 2, imgW = 0;
    if (pic) {
      imgW = Math.min(ph * .8, pw * .5);   // a big picture: half the panel
      var ix = px + pw - pad - imgW, iy = py + 60 * u, pd = dims(pic), ih = imgW * (pd.h / pd.w);
      ih = Math.min(ih, ph - 80 * u); iy = py + 56 * u + Math.max(0, (ph - 56 * u - ih) / 2);   // centred in the space under the label
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
  // The picture fills a rectangle (the whole screen face above the ticker): fitted whole, never cropped or stretched, with a small
  // label top-left and the headline along the bottom edge so an ad is always attributable and readable.
  function paintFill(x, it, pic, rx, ry, rw, rh, u) {
    var col = KIND_COLOUR[it.kind] || '#8fd3ff', pd = dims(pic), sc = Math.min(rw / pd.w, rh / pd.h), dw = pd.w * sc, dh = pd.h * sc;
    x.fillStyle = '#000000'; x.fillRect(rx, ry, rw, rh);
    try { x.drawImage(pic, rx + (rw - dw) / 2, ry + (rh - dh) / 2, dw, dh); } catch (e) {}
    x.textAlign = 'left';
    var label = KINDS[it.kind] + (it.paid && it.kind === 2 ? ' · PAID' : '');
    x.font = Math.round(24 * u) + 'px Bungee, Impact, sans-serif';
    var lw = x.measureText(label).width + 28 * u;
    x.fillStyle = 'rgba(0,0,0,.62)'; x.fillRect(rx + 16 * u, ry + 16 * u, lw, 42 * u);
    x.fillStyle = col; x.shadowColor = col; x.shadowBlur = 8; x.fillText(label, rx + 30 * u, ry + 46 * u); x.shadowBlur = 0;
    if (it.head) {
      x.font = Math.round(44 * u) + 'px VT323, monospace';
      var line = wrapText(function (s) { return x.measureText(s).width; }, it.head.toUpperCase(), rw - 64 * u, 1)[0] || '';
      x.fillStyle = 'rgba(0,0,0,.66)'; x.fillRect(rx, ry + rh - 62 * u, rw, 62 * u);
      x.fillStyle = col; x.fillRect(rx, ry + rh - 62 * u, rw, 3 * u);
      x.fillStyle = '#ffffff'; x.fillText(line, rx + 32 * u, ry + rh - 18 * u);
    }
  }
  function paintIdle(x, d, px, py, pw, ph, u) {
    x.textAlign = 'center'; x.fillStyle = '#ffc53d'; x.shadowColor = '#ffb000'; x.shadowBlur = 20;
    x.font = Math.round(150 * u) + 'px VT323, monospace'; x.fillText(String(d.day), px + pw / 2, py + ph * .58); x.shadowBlur = 0;
    x.fillStyle = ORANGE; x.font = Math.round(30 * u) + 'px Bungee, Impact, sans-serif'; x.fillText('BITCOIN DAY', px + pw / 2, py + ph * .30);
    x.fillStyle = '#8fd3ff'; x.font = Math.round(34 * u) + 'px VT323, monospace'; x.fillText('EVERY TOP SCORE LIVES ON BITCOIN', px + pw / 2, py + ph * .82);
  }

  /* ------------------------------------------------------------ the left column's rotation (pure) */
  // Which view the left column shows at time t (seconds): latest scorers, number ones newest first, latest scorers, number ones A to Z, and round again.
  // With no number ones to show (the boards are not read yet) it stays on the latest scorers.
  function leftPhase(t, haveChamps) {
    if (!haveChamps) return { kind: 'latest', order: '', local: 0 };
    var a = CFG.leftLatestSecs, b = CFG.leftChampSecs, cyc = 2 * (a + b), u = (((Number(t) || 0) % cyc) + cyc) % cyc;
    if (u < a) return { kind: 'latest', order: '', local: u };
    if (u < a + b) return { kind: 'champs', order: 'new', local: u - a };
    if (u < 2 * a + b) return { kind: 'latest', order: '', local: u - a - b };
    return { kind: 'champs', order: 'abc', local: u - 2 * a - b };
  }
  // The number one on every board. `boards` = [{ game, variant, colour, mode, entries }]; entries is null while the hall has not read that board
  // (skipped: not read is not the same as empty) and [] when it is read and empty (an unclaimed row, "BE FIRST"). The best score wins: the highest, or
  // on a time board the lowest; a tie goes to the earlier one. Rows: { game, colour, name, score, age, burn, claimed }.
  function champions(boards, height, fmt) {
    var h = Number(height) || 0, out = [];
    (boards || []).forEach(function (b) {
      if (!b || !Array.isArray(b.entries)) return;
      var label = String(b.game || '') + (b.variant ? ' ' + String(b.variant) : '');
      if (b.variant) label = String(b.game || '').slice(0, 8) + ' ' + String(b.variant).slice(0, 4);
      var best = null, low = b.mode === 'time';
      b.entries.forEach(function (e) {
        var sc = Number(e && e.score); if (!isFinite(sc)) return;
        if (!best) { best = e; return; }
        var bs = Number(best.score), eb = Number(e.burn) || 0, bb = Number(best.burn) || 0;
        if (low ? sc < bs : sc > bs) best = e;
        else if (sc === bs && eb > 0 && (bb <= 0 || eb < bb)) best = e;
      });
      if (!best) { out.push({ game: label, colour: b.colour, name: '', score: '', age: null, burn: 0, claimed: false }); return; }
      var burn = Number(best.burn) || 0, age = burn > 0 && h ? Math.max(0, h - burn) : null;
      out.push({ game: label, colour: b.colour, name: String(best.name || ''), score: fmt ? fmt(b.mode, best.score) : String(best.score), age: age, burn: burn, claimed: true });
    });
    return out;
  }
  // 'new': newest crown first, the unclaimed boards last (A to Z); 'abc': every board A to Z. Does not change the list it is given.
  function orderChampions(rows, order) {
    var byName = function (a, b) { return String(a.game).toLowerCase() < String(b.game).toLowerCase() ? -1 : String(a.game).toLowerCase() > String(b.game).toLowerCase() ? 1 : 0; };
    var list = (rows || []).slice();
    if (order === 'abc') return list.sort(byName);
    var claimed = list.filter(function (r) { return r.claimed; }).sort(function (a, b) { return (b.burn || 0) - (a.burn || 0) || byName(a, b); });
    return claimed.concat(list.filter(function (r) { return !r.claimed; }).sort(byName));
  }
  function dim(c) { return c && /^#[0-9a-f]{6}$/i.test(c) ? c + '66' : '#6f6a8f'; }

  /* ------------------------------------------------------------ latest scorers (pure) */
  // Builds the scorers list from the hall's board cache. `boards` = [{ game, colour, mode, entries:[{name,score,burn}] }].
  // Newest first. With a window (burn blocks, default 288 when omitted) entries older than it are left out; with no window (0) the newest
  // top scores are shown whatever their age, and the age on each row says how old. `fmt(mode, score)` formats a score.
  function latestScorers(boards, height, windowBlocks, fmt, limit) {
    var out = [], win = windowBlocks == null ? 288 : Number(windowBlocks), h = Number(height) || 0;
    (boards || []).forEach(function (b) {
      (b.entries || []).forEach(function (e) {
        var burn = Number(e.burn);
        if (!isFinite(burn) || burn <= 0) return;
        var age = h ? h - burn : 0;
        if (win > 0 && h && (age < 0 || age > win)) return;
        if (age < 0) age = 0;
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
    paint: paint, latestScorers: latestScorers, champions: champions, orderChampions: orderChampions, leftPhase: leftPhase, slotAt: slotAt, sniffMedia: sniffMedia, idle: function () { tendMedia(null); }, animating: function () { return !!state.animating; },
    normalizeItem: normalizeItem, isActive: isActive, activeItems: activeItems, featureAt: featureAt,
    wrapText: wrapText, tickerText: tickerText, ago: ago, hasPicture: hasPicture,
    _t: { state: state, load: load, restore: restore, save: save }
  };
  root.XAScreen = api;
})(typeof window !== 'undefined' ? window : globalThis);
