/*
 * Xtrata Arcade — the room (leaf module)
 *
 * Builds the arcade floor from whatever cartridges registered with XA, runs
 * one play session at a time, and owns the game-over → on-chain submit flow.
 * Cartridges never see the wallet: they only report a score through `api`.
 *
 * Boot: the parent sets window.XA_CONFIG (optional) and calls XARoom.boot().
 */
(function (root) {
  'use strict';
  var XA = root.XA, S = root.XAScores;
  if (!XA || !S) throw new Error('arcade-kit and score-client must load before arcade-room');
  var U = XA.util;
  var doc = root.document;

  function h(tag, attrs, kids) {
    var el = doc.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k === 'style') el.setAttribute('style', v);
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    });
    (kids || []).forEach(function (c) { if (c != null) el.appendChild(typeof c === 'string' ? doc.createTextNode(c) : c); });
    return el;
  }
  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }

  var rootEl, roomEl, gameEl, modalEl;
  var cabinets = [];            // { game, canvas, ctx, statsEl }
  var session = null;
  var raf = 0, lastTs = 0;
  var walletStatus = S.status();
  var boards = {};              // gameId:mode → last board result
  function boardOf(g, mode) { return XA.replay.boardFor(g, mode); }   // contract board id

  /* A cabinet can host variants (e.g. Block Drop Sprint 40). Each variant posts
     under the same game-id with its own contract mode, so boards, personal
     bests and formatting are all keyed by (game, mode). */
  function bk(g, mode) { return g.id + ':' + (mode || g.mode); }
  function variantOf(g, key) {
    return key ? (g.variants || []).filter(function (v) { return v.key === key; })[0] || null : null;
  }
  function modeLabel(g, mode) {
    if (mode === g.mode) return g.modeLabel || (mode === 'time' ? 'Time' : 'Score');
    var v = (g.variants || []).filter(function (x) { return x.mode === mode; })[0];
    return v ? v.label : mode;
  }
  // Time scores are centiseconds: 8345 → 1:23.45.
  function fmtVal(mode, v) {
    if (mode !== 'time') return U.fmt(v);
    v = Math.max(0, Math.round(Number(v) || 0));
    var m = Math.floor(v / 6000), sec = Math.floor(v / 100) % 60, cs = v % 100;
    return (m ? m + ':' + (sec < 10 ? '0' : '') : '') + sec + '.' + (cs < 10 ? '0' : '') + cs + (m ? '' : 's');
  }
  function localBest(g, mode) {
    if (mode !== 'time') return S.localBest(g.id);
    var v = U.store('pbt:' + g.id);
    return typeof v === 'number' && v > 0 ? v : 0;
  }
  function recordLocal(g, mode, v) {
    if (mode !== 'time') return S.recordLocal(g.id, v);
    var best = localBest(g, mode);
    if (v > 0 && (!best || v < best)) { U.store('pbt:' + g.id, v); return v; }
    return best;
  }
  function fmtBest(g, mode) {
    var b = localBest(g, mode);
    return mode === 'time' && !b ? '—' : fmtVal(mode, b);
  }

  /* ------------------------------------------------------ room view */
  function buildRoom() {
    var cfg = root.XA_CONFIG || {};
    var walletBtn = h('button', { class: 'xa-pill', id: 'xa-wallet', type: 'button', onclick: onWalletClick },
      [h('span', { class: 'xa-dot' }), h('span', { class: 'xa-wallet-label', text: 'Wallet' })]);
    var muteBtn = h('button', { class: 'xa-icon', id: 'xa-mute', type: 'button', 'aria-label': 'Toggle sound', onclick: function () {
      XA.audio.setMuted(!XA.audio.isMuted()); XA.audio.unlock(); paintMute();
    } });
    var boardsBtn = h('button', { class: 'xa-pill', type: 'button', onclick: function () { openBoards(XA.games[0] && XA.games[0].id); } },
      [h('span', { text: '🏆' }), h('span', { text: 'High scores' })]);

    var grid = h('div', { class: 'xa-cabinets' });
    XA.games.forEach(function (g) {
      var canvas = h('canvas', { width: 320, height: 240, 'aria-hidden': 'true' });
      var stats = h('div', { class: 'xa-cab-stats' }, [
        h('div', {}, [h('span', { text: 'YOUR BEST' }), h('b', { class: 'xa-pb', text: fmtBest(g, g.mode) })]),
        h('div', { class: 'xa-right' }, [h('span', { text: 'CHAIN #1' }), h('b', { class: 'xa-top1', text: '…' })])
      ]);
      var cab = h('article', { class: 'xa-cab', style: '--c:' + g.color, 'data-game': g.id }, [
        h('div', { class: 'xa-marquee' }, [h('h2', { text: g.title }), h('p', { text: g.tagline || '' })]),
        h('div', { class: 'xa-screen' }, [canvas, h('div', { class: 'xa-insert', text: 'PRESS PLAY' })]),
        stats,
        h('div', { class: 'xa-cab-actions' + (g.variants.length ? ' has-variants' : '') }, [
          h('button', { class: 'xa-btn xa-btn-play', style: '--c:' + g.color, type: 'button', 'data-play': g.id,
            onclick: function () { startGame(g.id); } }, ['▶ Play']),
          h('button', { class: 'xa-btn', type: 'button', 'aria-label': g.title + ' high scores',
            onclick: function () { openBoards(g.id); } }, ['🏆'])
        ].concat(g.variants.map(function (v) {
          return h('button', { class: 'xa-btn xa-btn-variant', style: '--c:' + g.color, type: 'button',
            'data-play-variant': g.id + ':' + v.key, title: v.tagline || v.label,
            onclick: function () { startGame(g.id, v.key); } }, [(v.mode === 'time' ? '⏱ ' : '▶ ') + v.label]);
        })))
      ]);
      grid.appendChild(cab);
      cabinets.push({ game: g, canvas: canvas, ctx: canvas.getContext('2d'), el: cab });
    });

    roomEl = h('main', { class: 'xa-room' }, [
      h('div', { class: 'xa-floor-grid' }),
      h('div', { class: 'xa-wrap' }, [
        h('header', { class: 'xa-top' }, [
          h('div', {}, [
            h('h1', { class: 'xa-logo' }, [h('span', { text: 'XTRATA ' }), h('span', { text: 'ARCADE' })]),
            h('p', { class: 'xa-sub', text: cfg.subtitle || (XA.games.length + ' cabinets · one on-chain leaderboard contract · built on Stacks') })
          ]),
          h('div', { class: 'xa-top-actions' }, [boardsBtn, walletBtn, muteBtn])
        ]),
        grid,
        h('p', { class: 'xa-foot' }, [
          'Top 10 per game lives on-chain in ',
          h('code', { text: S.config().contractName }),
          '. Posting a score costs the contract fee plus the network fee.'
        ])
      ])
    ]);
    rootEl.appendChild(roomEl);
    paintMute();
    paintWallet();
  }

  function paintMute() {
    var b = $('#xa-mute');
    if (b) b.textContent = XA.audio.isMuted() ? '🔇' : '🔊';
  }
  function paintWallet() {
    var b = $('#xa-wallet');
    if (!b) return;
    var dot = $('.xa-dot', b), label = $('.xa-wallet-label', b);
    dot.className = 'xa-dot';
    if (walletStatus.address) {
      dot.classList.add('is-on');
      label.textContent = S.shortAddress(walletStatus.address);
      b.title = 'Connected ' + walletStatus.address;
    } else if (walletStatus.route === 'none') {
      dot.classList.add('is-warn');
      label.textContent = 'View only';
      b.title = 'Scores can be posted when the arcade is opened on xtrata.xyz';
    } else {
      label.textContent = 'Connect';
      b.title = 'Connect a Stacks wallet to post high scores';
    }
  }
  function onXtrataTop() {
    try { return root.top === root && /(^|\.)xtrata\.xyz$/.test(root.location.hostname); } catch (e) { return false; }
  }
  async function onWalletClick() {
    XA.audio.unlock();
    walletStatus = S.status(); paintWallet();   // never trust a status read before the extension arrived
    if (walletStatus.address) { S.disconnect(); return; }
    if (walletStatus.route === 'none') {
      if (onXtrataTop()) openInfo('No wallet found',
        'No Stacks wallet extension answered in this browser. Install or unlock Leather or Xverse and reload, or play from the arcade page on Xtrata.', S.runtimeUrl());
      else openInfo('View-only here',
        'This copy of the arcade cannot reach a wallet, so you can play and see the boards but not post scores. ' +
        'Open the arcade on Xtrata to post.', S.runtimeUrl());
      return;
    }
    try { await S.connect(); } catch (e) { openInfo('Wallet not connected', e.message || String(e)); }
  }

  async function refreshCabinet(cab, force) {
    var g = cab.game;
    $('.xa-pb', cab.el).textContent = fmtBest(g, g.mode);
    var board = await S.getTop10(g.id, g.mode, force);
    boards[bk(g)] = board;
    var el = $('.xa-top1', cab.el);
    if (!board.ok) { el.textContent = 'offline'; el.title = board.error || ''; return; }
    var top = board.entries[0];
    el.textContent = top ? fmtVal(g.mode, top.score) + ' ' + top.name : 'be first';
    el.title = top ? top.name + ' · ' + top.player : 'No scores yet';
  }

  /* ----------------------------------------------------- scoreboard */
  function closeModal() {
    if (modalEl) { modalEl.remove(); modalEl = null; }
  }
  function modal(card) {
    closeModal();
    modalEl = h('div', { class: 'xa-modal', role: 'dialog', 'aria-modal': 'true', onclick: function (e) {
      if (e.target === modalEl) closeModal();
    } }, [card]);
    rootEl.appendChild(modalEl);
    var f = card.querySelector('button');
    if (f) f.focus();
  }
  function openInfo(title, text, link) {
    modal(h('div', { class: 'xa-card' }, [
      h('h3', { text: title }),
      h('p', { class: 'xa-verdict', text: text }),
      link ? h('p', { class: 'xa-note' }, [h('a', { href: link, target: '_blank', rel: 'noopener', style: 'color:var(--xa-cyan)', text: 'Open on xtrata.xyz ↗' })]) : null,
      h('div', { class: 'xa-card-foot' }, [h('span'), h('button', { class: 'xa-btn', type: 'button', onclick: closeModal, text: 'Close' })])
    ]));
  }
  function verifyButton(game, mode, e) {
    var b = h('button', { class: 'xa-btn', type: 'button', title: 'Fetch the stored replay and run it through this game' }, ['✓?']);
    b.addEventListener('click', async function () {
      b.disabled = true; b.textContent = '…';
      try {
        var bytes = await S.getReplay(boardOf(game, mode), e.player);
        if (!bytes) throw new Error('no replay stored');
        var r = await XA.replay.verify(bytes, { address: e.player, score: e.score, board: boardOf(game, mode), file: sealedCopy(bytes) });
        if (r.sealed) { b.disabled = false; b.textContent = '🔒 sealed'; b.style.color = 'var(--xa-gold)'; b.onclick = function () { sealedInfo(game, mode, e, bytes); }; return; }
        b.textContent = r.ok ? '✓ verified' : '✗ ' + r.reason;
        b.style.color = r.ok ? '#7dffb2' : '#ff8c8c';
      } catch (x) { b.textContent = '✗ ' + ((x && x.message) || 'failed'); b.style.color = '#ff8c8c'; }
    });
    return b;
  }
  var replayCache = {};
  async function fetchReplay(game, mode, e) {
    var key = boardOf(game, mode) + ':' + e.player + ':' + e.score;
    if (!replayCache[key]) replayCache[key] = S.getReplay(boardOf(game, mode), e.player).then(function (b) {
      if (!b) { delete replayCache[key]; throw new Error('No replay is stored for this entry.'); }
      // a long run's entry points at its replay inscription; a sealed one is matched to a copy kept here or on chain
      return XA.replay.resolve(b, null, { file: sealedCopy(b) }).catch(function (x) { if (x && x.sealed) x.stored = b; throw x; });
    }).catch(function (x) { delete replayCache[key]; throw x; });
    return replayCache[key];
  }
  function watchButton(game, mode, e) {
    return h('button', { class: 'xa-btn', type: 'button', title: 'Watch this run, replayed from the chain', onclick: async function (ev) {
      var b = ev.currentTarget; b.disabled = true; b.textContent = '…';
      try { var bytes = await fetchReplay(game, mode, e); closeModal(); watchReplay(bytes, { name: e.name, rank: e.rank }); }
      catch (x) { b.disabled = false; b.textContent = '▶'; if (x && x.sealed) sealedInfo(game, mode, e, x.stored); else openInfo('Replay unavailable', (x && x.message) || String(x)); }
    } }, ['▶']);
  }
  function saveButton(game, mode, e) {
    return h('button', { class: 'xa-btn', type: 'button', title: 'Download this replay file', onclick: async function (ev) {
      var b = ev.currentTarget; b.disabled = true;
      try { saveReplay(await fetchReplay(game, mode, e), boardOf(game, mode) + '-' + e.name + '-' + e.score); }
      catch (x) { if (x && x.sealed) sealedInfo(game, mode, e, x.stored); else openInfo('Replay unavailable', (x && x.message) || String(x)); }
      b.disabled = false;
    } }, ['⬇']);
  }
  function saveReplay(bytes, base) {
    try {
      var url = URL.createObjectURL(new Blob([bytes], { type: 'application/octet-stream' }));
      var a = doc.createElement('a');
      a.href = url; a.download = 'xtrata-arcade-' + String(base).replace(/[^A-Za-z0-9_.-]+/g, '_') + '.xar';
      doc.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 10000);
    } catch (x) { openInfo('Download blocked', 'This viewer does not allow downloads. Open the arcade on xtrata.xyz to save replays.'); }
  }
  /* ------------------------ sealed runs: the board holds the replay's fingerprint, the player holds the file */
  function hex(b) { return S._codec.bytesToHex(b); }
  function runKey(bytes) { return b64(bytes.subarray(4, 44)); }          // the run itself, whatever form it is stored in
  function sealedCopies() { var v = U.store('sealed'); return Array.isArray(v) ? v : []; }
  function keepSealed(bytes) {
    try {
      var k = runKey(bytes), list = sealedCopies().filter(function (u) { return u.k !== k; });
      list.unshift({ k: k, at: Date.now(), b: b64(bytes) });
      list = list.slice(0, UNPOSTED_MAX);
      while (list.length && JSON.stringify(list).length > UNPOSTED_BYTES) list.pop();
      U.store('sealed', list);
    } catch (e) { /* storage blocked or full: the downloaded file is the copy */ }
  }
  // A copy of a sealed run's replay held in this browser (the player's own, or one checked here), if any.
  function sealedCopy(stored) {
    try {
      if (!XA.replay.isSeal(stored)) return null;
      var k = runKey(stored), hit = sealedCopies().concat(unposted()).filter(function (u) { return (u.k || (u.b && runKey(unb64(u.b)))) === k; });
      for (var i = 0; i < hit.length; i++) { var full = unb64(hit[i].b); if (!XA.replay.mismatch(stored, full)) return full; }
    } catch (e) {}
    return null;
  }
  function sealedInfo(game, mode, e, stored) {
    var R = XA.replay, p = R.readPointer(stored), kb = Math.max(1, Math.round(p.length / 1024));
    var out = h('p', { class: 'xa-msg', 'aria-live': 'polite' });
    var pick = h('button', { class: 'xa-btn xa-btn-primary', type: 'button', text: 'Check a replay file' });
    pick.addEventListener('click', function () {
      var inp = h('input', { type: 'file', accept: '.xar,application/octet-stream', style: 'display:none' });
      inp.addEventListener('change', async function () {
        var f = inp.files && inp.files[0]; inp.remove();
        if (!f) return;
        var full = new Uint8Array(await f.arrayBuffer()), why = R.mismatch(stored, full);
        if (why) { out.className = 'xa-msg is-err'; out.textContent = '✗ ' + why + '.'; return; }
        out.className = 'xa-msg'; out.textContent = 'Fingerprint matches ✓ Re-playing the run…';
        var r = await R.verify(stored, { address: e.player, score: e.score, board: boardOf(game, mode), file: full });
        if (!out.isConnected) return;
        if (!r.ok) { out.className = 'xa-msg is-err'; out.textContent = '✗ Fingerprint matches but the run does not check out: ' + r.reason; return; }
        keepSealed(full);
        delete replayCache[boardOf(game, mode) + ':' + e.player + ':' + e.score];
        out.className = 'xa-msg is-ok';
        out.replaceChildren('✓ Verified: this file is the sealed run and it scores ' + fmtVal(mode, r.score) + '. ',
          h('button', { class: 'xa-link', type: 'button', text: 'Watch it', onclick: function () { closeModal(); watchReplay(full, { name: e.name, rank: e.rank }); } }));
      });
      doc.body.appendChild(inp); inp.click();
    });
    modal(h('div', { class: 'xa-card' }, [
      h('h3', { text: '🔒 Sealed run' }),
      h('p', { class: 'xa-verdict', text: e.name + ' · ' + fmtVal(mode, e.score) + ' · ' + kb + ' KB replay' }),
      h('p', { class: 'xa-note', text: 'The player posted this score with a fingerprint of the replay instead of the replay itself, and kept the file. ' +
        'Whoever has the file can check it here: it must match the fingerprint exactly and re-play to this score. If the file is ever inscribed on Xtrata, it is found and played from the chain automatically.' }),
      h('p', { class: 'xa-note', style: 'word-break:break-all;font-size:11px;opacity:.8', text: 'sha256 ' + hex(p.sha256) }),
      out,
      h('div', { class: 'xa-card-foot' }, [pick, h('button', { class: 'xa-btn', type: 'button', onclick: closeModal, text: 'Close' })])
    ]));
  }

  function openReplayFile(post) {
    var inp = h('input', { type: 'file', accept: '.xar,application/octet-stream', style: 'display:none' });
    inp.addEventListener('change', async function () {
      var f = inp.files && inp.files[0]; inp.remove();
      if (!f) return;
      try {
        var bytes = await XA.replay.resolve(new Uint8Array(await f.arrayBuffer()));
        if (post === true) postSavedRun(bytes); else watchReplay(bytes, { name: f.name.replace(/\.xar$/, '') });
      } catch (x) { openInfo('Could not open that replay', (x && x.message) || String(x)); }
    });
    doc.body.appendChild(inp); inp.click();
  }

  /* --------------------------- unposted runs: a great run is never lost
     Every ranked run that would make a Top 10 is kept in this browser (when storage is allowed) until it is
     posted, and can always be saved as a file. Either can be posted later from the machine's title screen. */
  var UNPOSTED_MAX = 3, UNPOSTED_BYTES = 1500000;
  function b64(bytes) {
    var bin = '';
    for (var i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  }
  function unb64(t) { var bin = atob(t), out = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i); return out; }
  function unposted() { var v = U.store('unposted'); return Array.isArray(v) ? v : []; }
  function keepUnposted(board, score, mode, bytes) {
    try {
      var list = unposted().filter(function (u) { return u.r !== b64(bytes.subarray(0, 44)); });
      list.unshift({ board: board, score: score, mode: mode, at: Date.now(), r: b64(bytes.subarray(0, 44)), b: b64(bytes) });
      list = list.slice(0, UNPOSTED_MAX);
      while (list.length > 1 && JSON.stringify(list).length > UNPOSTED_BYTES) list.pop();
      U.store('unposted', list);
    } catch (e) { /* storage blocked: Save replay still works */ }
  }
  function dropUnposted(bytes) {
    try { var k = b64(bytes.subarray(0, 44)); U.store('unposted', unposted().filter(function (u) { return u.r !== k; })); } catch (e) {}
  }
  // A saved or kept run: re-played here first, then posted like a fresh one.
  async function postSavedRun(bytes) {
    var R = XA.replay, hd;
    try { hd = R.readHeader(bytes); } catch (x) { openInfo('Not a replay', 'That file is not an Xtrata Arcade replay.'); return; }
    var game = XA.games.filter(function (g) { return g.id === R.GAME_IDS[hd.gameIdx]; })[0];
    if (!game) { openInfo('Unknown game', 'This replay is for a game that is not in this arcade.'); return; }
    var variant = hd.variantIdx ? (game.variants || [])[hd.variantIdx - 1] : null;
    var mode = variant ? variant.mode : game.mode, board = R.boardFor(game, mode);
    var pilotAddr = S._codec.c32address(hd.version || 22, hd.hash160);
    var body = h('div', {});
    modal(h('div', { class: 'xa-card' }, [
      h('h3', { text: 'Post a saved run' }),
      h('p', { class: 'xa-verdict', text: game.title + (variant ? ' · ' + variant.label : '') + ' · ' + fmtVal(mode, hd.score) + ' · flown by ' + S.shortAddress(pilotAddr) }),
      body,
      h('div', { class: 'xa-card-foot' }, [h('span'), h('button', { class: 'xa-btn', type: 'button', onclick: closeModal, text: 'Close' })])
    ]));
    body.replaceChildren(h('p', { class: 'xa-note', text: 'Re-playing the run to check it…' }));
    var chk = await R.verify(bytes, { score: hd.score, board: board });
    if (!body.isConnected) return;
    if (!chk.ok) { body.replaceChildren(h('p', { class: 'xa-msg is-err', text: 'This run does not check out (' + chk.reason + '), so it cannot be posted.' })); return; }
    var top = await S.getTop10(board, mode, true);
    if (!body.isConnected) return;
    var rank = insertRank(top, hd.score, mode);
    if (top.ok && !rank) { body.replaceChildren(h('p', { class: 'xa-note', text: 'Replay checked ✓ but the Top 10 has moved on: this score no longer makes the board.' })); return; }
    var box = h('div', { class: 'xa-submit' });
    body.replaceChildren(h('p', { class: 'xa-note', text: rank ? 'Replay checked ✓ It would be #' + rank + ' on the board.' : 'Replay checked ✓' }), box);
    postCard(box, { game: game, mode: mode, score: hd.score, bytes: bytes, pilot: { address: pilotAddr, hash160: hd.hash160 }, checked: true });
  }
  // Replays are drawn and heard like a live run, fed from the recorded input instead of the keyboard.
  async function watchReplay(bytes, info) {
    var dec;
    try { dec = await XA.replay.decode(bytes); }
    catch (x) { openInfo('Could not read that replay', (x && x.message) || String(x)); return; }
    var game = XA.games.filter(function (g) { return g.id === XA.replay.GAME_IDS[dec.gameIdx]; })[0];
    if (!game) { openInfo('Unknown game', 'This replay is for a game that is not in this arcade.'); return; }
    var variant = dec.variantIdx ? (game.variants || [])[dec.variantIdx - 1] : null;
    startGame(game.id, variant && variant.key, { watch: dec, bytes: bytes, info: info || {} });
  }
  function boardList(board, game, highlight, mode) {
    mode = mode || (game && game.mode) || 'score';
    if (!board) return h('div', { class: 'xa-empty', text: 'Loading…' });
    if (!board.ok) return h('div', { class: 'xa-error', text: 'Couldn’t reach the leaderboard right now. It isn’t empty — try again in a moment.' });
    if (!board.entries.length) return h('div', { class: 'xa-empty', text: 'No scores yet. The first run that lands here is permanent until someone beats it.' });
    return h('ol', { class: 'xa-board' }, board.entries.map(function (e) {
      var you = walletStatus.address && e.player === walletStatus.address;
      return h('li', { class: you || (highlight && highlight === e.rank) ? 'is-you' : '' }, [
        h('span', { class: 'xa-rank', text: '#' + e.rank }),
        h('span', { class: 'xa-who' }, [h('b', { text: e.name }), h('small', { text: S.shortAddress(e.player) + (you ? ' · you' : '') })]),
        h('span', { class: 'xa-pts', text: fmtVal(mode, e.score) }),
        game ? h('span', { class: 'xa-tools' }, [watchButton(game, mode, e), saveButton(game, mode, e), verifyButton(game, mode, e)]) : null
      ]);
    }));
  }
  function openBoards(gameId, mode) {
    var game = XA.games.filter(function (g) { return g.id === gameId; })[0] || XA.games[0];
    var modes = [game.mode].concat(game.variants.map(function (v) { return v.mode; }));
    if (modes.indexOf(mode) < 0) mode = game.mode;
    var key = bk(game, mode);
    var body = h('div', {}, [boardList(boards[key], game, 0, mode)]);
    var tabs = h('div', { class: 'xa-tabs', role: 'tablist' }, XA.games.map(function (g) {
      return h('button', { class: 'xa-tab', role: 'tab', type: 'button', style: '--c:' + g.color,
        'aria-selected': g.id === game.id ? 'true' : 'false', onclick: function () { openBoards(g.id); } }, [g.title]);
    }));
    var modeTabs = modes.length > 1 ? h('div', { class: 'xa-mode-tabs', role: 'tablist', 'aria-label': game.title + ' boards' }, modes.map(function (m) {
      return h('button', { class: 'xa-mode-tab', role: 'tab', type: 'button', 'data-mode': m,
        'aria-selected': m === mode ? 'true' : 'false', onclick: function () { openBoards(game.id, m); } },
        [(m === 'time' ? '⏱ ' : '') + modeLabel(game, m)]);
    })) : null;
    var foot = h('div', { class: 'xa-card-foot' }, [
      h('span', { text: 'Your best: ' + fmtBest(game, mode) }),
      h('span', {}, [
        h('button', { class: 'xa-btn', type: 'button', style: 'margin-right:8px', onclick: async function () {
          body.replaceChildren(boardList(null));
          boards[key] = await S.getTop10(boardOf(game, mode), mode, true);
          body.replaceChildren(boardList(boards[key], game, 0, mode));
        } }, ['↻ Refresh']),
        h('button', { class: 'xa-btn', type: 'button', onclick: closeModal }, ['Close'])
      ])
    ]);
    modal(h('div', { class: 'xa-card', style: '--c:' + game.color }, [h('h3', { text: 'High scores' }), tabs, modeTabs, body, foot]));
    if (!boards[key]) S.getTop10(boardOf(game, mode), mode).then(function (b) {
      boards[key] = b;
      if (modalEl && body.isConnected) body.replaceChildren(boardList(b, game, 0, mode));
    });
  }

  /* ------------------------------------------------------- session */
  function startGame(id, variantKey, opts) {
    opts = opts || {};
    XA.audio.unlock();
    closeModal();
    var game = XA.games.filter(function (g) { return g.id === id; })[0];
    if (!game) return;
    var variant = variantOf(game, variantKey);
    var mode = variant ? variant.mode : game.mode;
    endSession(true);
    if (XA.music) { XA.music.stop(0.15); XA.music.clearListeners(); }

    var canvas = h('canvas', { 'aria-label': game.title + ' playfield' });
    var stage = h('div', { class: 'xa-stage' }, [canvas]);
    var scoreEl = h('b', { id: 'xa-score', text: '0' });
    var bestEl = h('b', { text: fmtBest(game, mode) });
    var hiEl = h('b', { text: '…' });
    var statusEl = h('div', { class: 'xa-status', 'aria-live': 'polite' });
    var pauseBtn = h('button', { class: 'xa-icon', type: 'button', 'aria-label': 'Pause', text: '❚❚', onclick: function () { togglePause(); } });
    gameEl = h('section', { class: 'xa-game', style: '--c:' + game.color }, [
      h('div', { class: 'xa-hud' }, [
        h('button', { class: 'xa-icon', type: 'button', 'aria-label': 'Back to the arcade', text: '◀', onclick: function () { endSession(); } }),
        h('span', { class: 'xa-title', text: game.title + (variant ? ' · ' + variant.label : '') }),
        h('div', { class: 'xa-hud-stats' }, [
          h('div', {}, [h('small', { text: mode === 'time' ? 'TIME' : 'SCORE' }), scoreEl]),
          h('div', {}, [h('small', { text: 'BEST' }), bestEl]),
          h('div', {}, [h('small', { text: 'CHAIN #1' }), hiEl])
        ]),
        pauseBtn
      ]),
      statusEl,
      stage
    ]);
    var watch = opts.watch || null, pb = watch ? XA.replay.playback(watch.events) : null;
    var input = watch ? pb.input : XA.createInput(stage);
    var pads = watch ? null : buildPads(game.touch, input, game);
    if (pads) gameEl.appendChild(pads);
    rootEl.appendChild(gameEl);
    roomEl.setAttribute('aria-hidden', 'true');

    var pilot = watch ? null : XA.replay.pilotFor(walletStatus.address);      // connected wallet → a ranked, recorded run
    var nonce = U.newSeed();
    var seed = watch ? XA.replay.seedFor(watch.hash160, watch.nonce, watch.gameIdx) : pilot ? XA.replay.seedFor(pilot.hash160, nonce, XA.replay.gameIndex(game)) : nonce;
    var fx = XA.createFx();
    session = {
      game: game, variant: variant, mode: mode, completed: false, canvas: canvas, ctx: canvas.getContext('2d'), stage: stage, input: input, fx: fx,
      score: 0, shake: 0, state: 'countdown', countdown: 3.0, acc: 0, seed: seed,
      scoreEl: scoreEl, statusEl: statusEl, hiEl: hiEl, scale: 1, overlay: null, startedAt: Date.now()
    };
    var s = session;
    if (watch) { s.state = 'watch'; s.watch = watch; s.pb = pb; s.steps = 0; s.speed = 1; s.bytes = opts.bytes; s.info = opts.info; }
    else if (!opts.go) s.state = 'ready';
    var live = function () { return s.state === 'play' || s.state === 'watch'; };
    var api = {
      W: game.size.w, H: game.size.h, input: input, audio: XA.audio, fx: fx,
      rng: U.rng(seed), seed: seed, ranked: !!pilot,
      shake: function (n) { s.shake = Math.max(s.shake, n); },
      addScore: function (n) { if (live()) s.score += Math.max(0, Math.floor(n)); },
      setScore: function (n) { if (live()) s.score = Math.max(0, Math.floor(n)); },
      getScore: function () { return s.score; },
      setStatus: function (t) { if (s.statusEl.textContent !== t) s.statusEl.textContent = t; },
      gameOver: function () { if (s.state === 'play') finish(); else if (s.state === 'watch') endWatch(s); },
      // Which board this run is for. In 'time' mode the score is the elapsed
      // time in centiseconds (lower wins): keep it current with setScore and
      // call finish() on completion. gameOver() without finish() is a DNF.
      mode: mode,
      variant: variant ? variant.key : null,
      finish: function () { if (s.state === 'play') { s.completed = true; finish(); } else if (s.state === 'watch') { s.completed = true; endWatch(s); } },
      // Pointer in playfield units. `moved` increments on every move/press, so a
      // game can tell "the pointer is steering" from "the keys are steering".
      pointer: watch ? pb.pointer : function () {
        var p = input.pointer, r = canvas.getBoundingClientRect();
        // quarter-unit resolution, so a replay can reproduce exactly what the game saw
        return { x: XA.replay.qpt((p.x - r.left) / s.scale), y: XA.replay.qpt((p.y - r.top) / s.scale), down: p.down, moved: p.moved };
      }
    };
    if (pilot && gameEl) {
      s.pilot = pilot;
      s.rec = XA.replay.record(game, variant, pilot, nonce, input, api.pointer);
    }
    var tag = s.tagEl = h('span', { class: 'xa-runtag', style: 'margin-left:8px;font-size:11px;letter-spacing:.08em;white-space:nowrap;color:' + (pilot ? '#7dffb2' : '#9aa3c7'),
      title: watch ? 'Replay' : pilot ? 'Ranked: this run is recorded and can be posted on-chain.' : 'Practice: connect a wallet before you start to rank a run.',
      text: watch ? '▶ REPLAY' : pilot ? '● RANKED' : 'PRACTICE' });
    var ttl = $('.xa-title', gameEl); if (ttl) ttl.appendChild(tag);
    if (watch) { var realStore = U.store; U.store = blankStore(s); try { s.instance = game.create(api); } finally { U.store = realStore; } }
    else s.instance = game.create(api);
    fit();
    if (watch) showWatch(s); else if (s.state === 'ready') showReady(s); else showCountdown();
    S.getTop10(boardOf(game, mode), mode).then(function (b) {
      boards[bk(game, mode)] = b;
      if (session !== s) return;
      hiEl.textContent = b.ok ? (b.entries[0] ? fmtVal(mode, b.entries[0].score) : '—') : 'offline';
    });
  }

  (function () {
    var st = doc.createElement('style');
    st.textContent = '.xa-board li { grid-template-columns: 34px 1fr auto auto; }\n.xa-tools { display: flex; gap: 4px; justify-content: flex-end; }\n.xa-tools .xa-btn { margin: 0 !important; padding: 3px 8px !important; font-size: 11px !important; min-height: 0; }\n.xa-ready-overlay { overflow: auto; align-items: start; background: rgba(3, 4, 12, .6); }\n.xa-ready { width: min(520px, 100%); margin: auto; padding: 18px 16px; border-radius: 16px; border: 1px solid var(--xa-line); background: rgba(8, 10, 26, .9); box-shadow: 0 0 40px -12px var(--c); }\n.xa-ready h3 { font-size: 30px; text-shadow: 0 0 14px var(--c), 0 0 34px var(--c); }\n.xa-ready-variant { margin-top: 6px; font: 800 12px/1 var(--xa-mono); letter-spacing: .16em; color: var(--c); text-transform: uppercase; }\n.xa-ready-tag { margin: 12px 0 0; font: 800 12px/1.4 var(--xa-mono); letter-spacing: .1em; color: var(--xa-dim); }\n.xa-ready-tag.is-ranked { color: var(--xa-green); }\n.xa-ready-tag.is-warn { color: #ffc53d; }\n.xa-ready-msg { margin: 6px 0 0; font: 700 12px/1.4 var(--xa-mono); color: var(--xa-dim); min-height: 0; }\n.xa-ready-msg.is-err { color: #ff4d6d; }\n.xa-btn-connect { font-weight: 800; }\n.xa-link { background: none; border: 0; padding: 0; font: inherit; color: var(--xa-cyan); text-decoration: underline; cursor: pointer; }\n.xa-ready-head { display: flex; justify-content: space-between; margin: 16px 0 4px; font: 800 11px/1 var(--xa-mono); letter-spacing: .14em; color: var(--xa-faint); }\n.xa-ready-board { max-height: 38vh; overflow: auto; text-align: left; border-top: 1px solid var(--xa-line); }\n.xa-ready-board .xa-board { font-size: 13px; }\n.xa-ready-board .xa-board li { padding: 7px 6px; }\n.xa-ready .xa-variants { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-top: 10px; }\n.xa-replay-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px; }';
    (doc.head || doc.documentElement).appendChild(st);
  })();
  function blankStore(s) {
    var mem = {};
    return function (k, v) { if (v === undefined) return k in mem ? mem[k] : null; mem[k] = v; return null; };
  }
  function beginRun(s) {
    if (!s || session !== s || s.state !== 'ready') return;
    s.state = 'countdown'; s.countdown = 3.0; s.input.reset();
    showCountdown();
  }
  // Connect from the ready card, then reopen the same machine as a ranked run.
  async function connectForRun(s, btn, msg) {
    if (!s || session !== s || s.state !== 'ready' || s.connecting) return;
    s.connecting = true;
    var label = btn.textContent;
    btn.disabled = true; btn.textContent = 'Check your wallet\u2026';
    msg.className = 'xa-ready-msg'; msg.textContent = '';
    try {
      await S.connect();
      walletStatus = S.status(); paintWallet();
      if (session === s && s.state === 'ready' && walletStatus.address) {
        startGame(s.game.id, s.variant ? s.variant.key : null);   // same machine, now ranked
        return;
      }
      throw new Error('The wallet did not return an address.');
    } catch (e) {
      if (session !== s) return;
      msg.className = 'xa-ready-msg is-err';
      msg.textContent = 'Not connected: ' + ((e && e.message) || String(e)) + ' Try again, or play a practice run.';
      btn.disabled = false; btn.textContent = label;
    } finally { s.connecting = false; }
  }
  // "You have an unposted run" on a machine's title screen.
  function unpostedRow(g, mode) {
    var mine = unposted().filter(function (u) { return u.board === boardOf(g, mode); });
    if (!mine.length) return null;
    return h('div', { class: 'xa-note', style: 'margin-top:10px;padding:10px;border-radius:10px;border:1px solid var(--xa-gold);text-align:left' },
      [h('b', { style: 'color:var(--xa-gold)', text: 'Unposted run' + (mine.length > 1 ? 's' : '') + ' kept in this browser' })].concat(mine.map(function (u) {
        var bytes = unb64(u.b);
        return h('div', { style: 'display:flex;gap:8px;align-items:center;justify-content:space-between;margin-top:6px' }, [
          h('span', { text: fmtVal(u.mode, u.score) + ' · ' + new Date(u.at).toLocaleString() }),
          h('span', { style: 'display:flex;gap:6px' }, [
            h('button', { class: 'xa-btn', type: 'button', style: 'padding:4px 10px;font-size:11px', onclick: function () { postSavedRun(bytes); } }, ['Post']),
            h('button', { class: 'xa-btn', type: 'button', style: 'padding:4px 10px;font-size:11px', onclick: function () { saveReplay(bytes, u.board + '-' + u.score); } }, ['⬇ Save'])
          ])
        ]);
      })));
  }
  function showReady(s) {
    var g = s.game, mode = s.mode, vkey = s.variant ? s.variant.key : null;
    var list = h('div', { class: 'xa-ready-board' }, [boardList(boards[bk(g, mode)], g, 0, mode)]);
    // A run is bound to the wallet it starts with (the replay is seeded from it),
    // so a score can only be posted if the wallet is connected BEFORE the run.
    // Not connected → connecting is the main action; practice is the fallback.
    walletStatus = S.status(); paintWallet();
    var canConnect = !s.pilot && walletStatus.route !== 'none';
    var start, practice = null, tag, msg = h('p', { class: 'xa-ready-msg', 'aria-live': 'polite' });
    if (s.pilot) {
      start = h('button', { class: 'xa-btn xa-btn-play', style: '--c:' + g.color, type: 'button', onclick: function () { beginRun(s); } }, ['▶ START']);
      tag = h('p', { class: 'xa-ready-tag is-ranked', text: '● RANKED · flying as ' + S.shortAddress(s.pilot.address) });
    } else if (canConnect) {
      start = h('button', { class: 'xa-btn xa-btn-play xa-btn-connect', style: '--c:' + g.color, type: 'button', onclick: function () { connectForRun(s, start, msg); } }, ['\uD83D\uDD17 CONNECT WALLET']);
      practice = h('button', { class: 'xa-btn', type: 'button', title: 'Play without a wallet. The score cannot be posted on-chain.', onclick: function () { beginRun(s); } }, ['▶ Practice']);
      tag = h('p', { class: 'xa-ready-tag is-warn', text: 'NOT CONNECTED · connect first to post your score on-chain. A practice run cannot be posted afterwards.' });
    } else {
      start = h('button', { class: 'xa-btn xa-btn-play', style: '--c:' + g.color, type: 'button', onclick: function () { beginRun(s); } }, ['▶ PRACTICE']);
      tag = h('p', { class: 'xa-ready-tag is-warn' }, ['VIEW ONLY · no wallet can be reached here, so this score cannot be posted. ',
        h('a', { href: S.runtimeUrl(), target: '_blank', rel: 'noopener', style: 'color:var(--xa-cyan)', text: 'Play on xtrata.xyz \u2197' })]);
    }
    s.primary = canConnect ? function () { connectForRun(s, start, msg); } : function () { beginRun(s); };
    var modes = [null].concat(g.variants || []);
    var switcher = modes.length > 1 ? h('div', { class: 'xa-variants' }, modes.filter(function (v) { return (v ? v.key : null) !== vkey; }).map(function (v) {
      return h('button', { class: 'xa-btn xa-btn-variant', style: '--c:' + g.color, type: 'button', onclick: function () { startGame(g.id, v ? v.key : null); } },
        [v ? (v.mode === 'time' ? '⏱ ' : '▶ ') + v.label : '▶ ' + modeLabel(g, g.mode)]);
    })) : null;
    setOverlay(h('div', { class: 'xa-overlay xa-ready-overlay', 'data-xa-ui': '1' }, [h('div', { class: 'xa-over xa-ready' }, [
      h('h3', { text: g.title }),
      s.variant ? h('div', { class: 'xa-ready-variant', text: s.variant.label }) : null,
      h('p', { class: 'xa-verdict', text: (s.variant && s.variant.tagline) || g.tagline || '' }),
      g.controls ? h('p', { class: 'xa-note', text: g.controls }) : null,
      tag,
      msg,
      h('div', { class: 'xa-ready-head' }, [h('span', { text: 'ON-CHAIN TOP 10' }), h('span', { text: 'YOUR BEST ' + fmtBest(g, mode) })]),
      list,
      h('div', { class: 'xa-over-actions' }, [start, practice, h('button', { class: 'xa-btn', type: 'button', onclick: endSession }, ['◀ Arcade'])]),
      switcher,
      unpostedRow(g, mode),
      h('p', { class: 'xa-note' }, [canConnect ? 'Enter or Space to connect · Esc to go back · ' : 'Enter or Space to start · Esc to go back · ',
        h('button', { class: 'xa-link', type: 'button', onclick: function () { openReplayFile(false); } }, ['watch a replay file']), ' · ',
        h('button', { class: 'xa-link', type: 'button', onclick: function () { openReplayFile(true); } }, ['post a saved run'])])
    ])]));
    start.focus();
    S.getTop10(boardOf(g, mode), mode, true).then(function (b) {
      boards[bk(g, mode)] = b;
      if (session === s && s.state === 'ready' && list.isConnected) list.replaceChildren(boardList(b, g, 0, mode));
    });
  }
  function showWatch(s) {
    var who = s.info && s.info.name ? s.info.name : 'replay';
    s.statusEl.textContent = 'REPLAY · ' + who + (s.info && s.info.rank ? ' · #' + s.info.rank : '') + ' · target ' + fmtVal(s.mode, s.watch.score);
    var speed = h('button', { class: 'xa-icon', type: 'button', 'aria-label': 'Replay speed', text: '1×', onclick: function () {
      s.speed = s.speed >= 8 ? 1 : s.speed * 2; speed.textContent = s.speed + '×';
    } });
    var hud = $('.xa-hud', gameEl); if (hud) hud.insertBefore(speed, hud.lastChild);
    setOverlay(null);
  }
  function endWatch(s) {
    if (s.state !== 'watch') return;
    s.state = 'watched';
    var ok = s.score === s.watch.score;
    var g = s.game, vkey = s.variant ? s.variant.key : null;
    setOverlay(h('div', { class: 'xa-overlay', 'data-xa-ui': '1' }, [h('div', { class: 'xa-over' }, [
      h('h3', { text: 'REPLAY OVER' }),
      h('div', { class: 'xa-final', text: fmtVal(s.mode, s.score) }),
      h('p', { class: 'xa-verdict', text: ok ? 'The replay reached exactly the recorded score.' : 'This replay ended at ' + fmtVal(s.mode, s.score) + ', not the recorded ' + fmtVal(s.mode, s.watch.score) + '.' }),
      h('div', { class: 'xa-over-actions' }, [
        h('button', { class: 'xa-btn xa-btn-play', style: '--c:' + g.color, type: 'button', onclick: function () { watchReplay(s.bytes, s.info); } }, ['↻ Watch again']),
        h('button', { class: 'xa-btn', type: 'button', onclick: function () { startGame(g.id, vkey); } }, ['◀ Back'])
      ]),
      h('div', { class: 'xa-replay-row' }, [h('button', { class: 'xa-btn', type: 'button', onclick: function () { saveReplay(s.bytes, boardOf(g, s.mode) + '-' + ((s.info && s.info.name) || 'replay') + '-' + s.watch.score); } }, ['⬇ Save replay'])])
    ])]));
  }
  function buildPads(kind, input, game) {
    var coarse = root.matchMedia && root.matchMedia('(pointer: coarse)').matches;
    if (!coarse && !/[?&]pads=1/.test(root.location.search || '')) return null;
    function pad(name, label, cls) {
      var b = h('button', { class: 'xa-pad ' + (cls || '') + ' ' + name, type: 'button', 'aria-label': name, text: label });
      function down(e) { e.preventDefault(); XA.audio.unlock(); b.classList.add('is-down'); input.press(name); try { b.setPointerCapture(e.pointerId); } catch (x) {} }
      function up() { b.classList.remove('is-down'); input.release(name); }
      b.addEventListener('pointerdown', down);
      b.addEventListener('pointerup', up);
      b.addEventListener('pointercancel', up);
      b.addEventListener('lostpointercapture', up);
      b.addEventListener('contextmenu', function (e) { e.preventDefault(); });
      return b;
    }
    if (kind === 'dpad') {
      return h('div', { class: 'xa-pads' }, [
        h('div', { class: 'xa-pad-hint', text: 'SWIPE OR USE THE PAD' }),
        h('div', { class: 'xa-pad-group xa-dpad' }, [pad('up', '▲'), pad('left', '◀'), pad('down', '▼'), pad('right', '▶')])
      ]);
    }
    if (kind === 'blocks') {
      return h('div', { class: 'xa-pads' }, [
        h('div', { class: 'xa-pad-group xa-row' }, [pad('left', '◀'), pad('down', '▼'), pad('right', '▶')]),
        h('div', { class: 'xa-pad-group xa-grid2' }, [pad('b', '⟲'), pad('c', '⟳'), pad('d', 'HOLD', 'xa-wide'), pad('a', '⤓')])
      ]);
    }
    if (kind === 'lander') {
      return h('div', { class: 'xa-pads' }, [
        h('div', { class: 'xa-pad-group xa-row' }, [pad('left', '⟲'), pad('right', '⟳')]),
        h('div', { class: 'xa-pad-group xa-row' }, [pad('up', 'THRUST', 'xa-wide')])
      ]);
    }
    if (kind === 'shooter') {
      return h('div', { class: 'xa-pads' }, [
        h('div', { class: 'xa-pad-group xa-row' }, [pad('left', '◀'), pad('right', '▶')]),
        h('div', { class: 'xa-pad-group xa-row' }, [pad('a', 'FIRE', 'xa-wide')])
      ]);
    }
    if (kind === 'ship') {
      return h('div', { class: 'xa-pads' }, [
        h('div', { class: 'xa-pad-group xa-row' }, [pad('left', '⟲'), pad('right', '⟳')]),
        h('div', { class: 'xa-pad-group xa-row' }, [pad('up', 'THRUST', 'xa-wide'), pad('a', 'FIRE', 'xa-wide')])
      ]);
    }
    if (kind === 'hint') {
      return h('div', { class: 'xa-pads' }, [h('div', { class: 'xa-pad-hint', text: game.touchHint || '' })]);
    }
    if (kind === 'hold') {
      return h('div', { class: 'xa-pads' }, [h('div', { class: 'xa-pad-hint', text: 'TOUCH AND HOLD ANYWHERE ON THE SCREEN TO SWIM' })]);
    }
    return null;
  }

  function fit() {
    if (!session) return;
    var s = session, g = s.game;
    var rect = s.stage.getBoundingClientRect();
    var availW = Math.max(100, rect.width - 20), availH = Math.max(100, rect.height - 12);
    var scale = Math.min(availW / g.size.w, availH / g.size.h);
    var dpr = Math.min(root.devicePixelRatio || 1, 2.5);
    s.scale = scale;
    s.dpr = dpr;
    s.canvas.style.width = Math.floor(g.size.w * scale) + 'px';
    s.canvas.style.height = Math.floor(g.size.h * scale) + 'px';
    s.canvas.width = Math.floor(g.size.w * scale * dpr);
    s.canvas.height = Math.floor(g.size.h * scale * dpr);
  }

  function setOverlay(el) {
    if (!session) return;
    if (session.overlay) session.overlay.remove();
    session.overlay = el;
    if (el) session.stage.appendChild(el);
  }
  function showCountdown() {
    var n = h('div', { class: 'xa-countdown', text: '3' });
    setOverlay(h('div', { class: 'xa-overlay', style: 'background:rgba(3,4,12,.35)' }, [n]));
    session.countEl = n;
    XA.audio.tone(440, 0.1, { type: 'square', vol: 0.15 });
  }

  function togglePause(force) {
    var s = session;
    if (!s) return;
    if (s.state === 'play' && force !== false) {
      s.state = 'paused';
      if (XA.music) XA.music.pause();
      s.input.reset();
      setOverlay(h('div', { class: 'xa-overlay', 'data-xa-ui': '1' }, [h('div', { class: 'xa-over xa-pause' }, [
        h('h3', { text: 'PAUSED' }),
        h('div', { class: 'xa-over-actions' }, [
          h('button', { class: 'xa-btn xa-btn-play', style: '--c:' + s.game.color, type: 'button', onclick: function () { togglePause(); } }, ['Resume']),
          h('button', { class: 'xa-btn', type: 'button', onclick: endSession }, ['Quit'])
        ])
      ])]));
      $('.xa-overlay button', s.stage).focus();
    } else if (s.state === 'paused' && force !== true) {
      s.state = 'play';
      s.acc = 0;
      s.input.reset();
      if (XA.music) XA.music.resume();
      setOverlay(null);
    }
  }

  function endSession(silent) {
    if (!session) return;
    session.input.destroy();
    session = null;
    if (XA.music) { XA.music.stop(0.35); XA.music.clearListeners(); }
    if (gameEl) { gameEl.remove(); gameEl = null; }
    roomEl.removeAttribute('aria-hidden');
    cabinets.forEach(function (c) { refreshCabinet(c); });
    var btn = $('[data-play]');
    if (btn && btn.offsetParent) btn.focus();
    var hostCfg = root.XA_CONFIG || {};
    if (silent !== true && typeof hostCfg.onExit === 'function') { try { hostCfg.onExit(); } catch (e) { console.error(e); } }
  }

  /* --------------------------------------------------- game over */
  function insertRank(board, score, mode) {
    if (!board || !board.ok) return 0;
    for (var i = 0; i < 10; i++) {
      var e = board.entries[i];
      if (!e) return i + 1;
      if (mode === 'time' ? score < e.score : score > e.score) return i + 1;
    }
    return 0;
  }

  async function finish() {
    var s = session;
    s.state = 'over';
    s.input.reset();
    // Games may already have stopped their music (e.g. their own death cue).
    if (XA.music && XA.music.isPlaying()) XA.music.tapeStop(1.3);
    var g = s.game, mode = s.mode, vkey = s.variant ? s.variant.key : null;
    var score = s.score;
    var dnf = mode === 'time' && !s.completed;
    if (dnf) score = 0;
    if (s.rec && !s.replayP) s.replayP = s.rec.finish(score, s.completed);   // ready for Watch / Save on the game-over card
    var prevBest = localBest(g, mode);
    var best = recordLocal(g, mode, score);
    var isPb = score > 0 && (mode === 'time' ? (!prevBest || score < prevBest) : score > prevBest);
    XA.audio.arp(isPb ? [523, 659, 784, 1047] : [392, 330, 262], 0.09, { type: 'triangle', vol: 0.2 });

    var verdict = h('p', { class: 'xa-verdict', text: 'Checking the on-chain board…' });
    var submitBox = h('div', { class: 'xa-submit xa-hidden' });
    var again = h('button', { class: 'xa-btn xa-btn-play', style: '--c:' + g.color, type: 'button', onclick: function () { startGame(g.id, vkey, { go: true }); } }, ['↻ Play again']);
    setOverlay(h('div', { class: 'xa-overlay', 'data-xa-ui': '1' }, [h('div', { class: 'xa-over' }, [
      h('h3', { text: dnf ? 'DID NOT FINISH' : mode === 'time' ? 'FINISHED' : 'GAME OVER' }),
      h('div', { class: 'xa-final', text: dnf ? '—' : fmtVal(mode, score) }),
      isPb ? h('span', { class: 'xa-badge', text: '★ NEW PERSONAL BEST' }) : h('span', { class: 'xa-note', text: 'Best ' + fmtBest(g, mode) }),
      verdict,
      submitBox,
      h('div', { class: 'xa-over-actions' }, [again, h('button', { class: 'xa-btn', type: 'button', onclick: endSession }, ['◀ Arcade'])]),
      s.replayP ? h('div', { class: 'xa-replay-row' }, [
        h('button', { class: 'xa-btn', type: 'button', onclick: async function () { var b = await s.replayP; if (b) watchReplay(b, { name: 'Your run' }); } }, ['▶ Watch my run']),
        h('button', { class: 'xa-btn', type: 'button', onclick: async function () { var b = await s.replayP; if (b) saveReplay(b, boardOf(g, mode) + '-' + score); } }, ['⬇ Save replay'])
      ]) : null
    ])]));
    again.focus();

    if (dnf) { verdict.textContent = 'Finish the run to set a time for the board.'; return; }
    if (!(score > 0)) { verdict.textContent = 'Score something to get on the board.'; return; }
    var board = await S.getTop10(boardOf(g, mode), mode, true);
    if (session !== s) return;
    boards[bk(g, mode)] = board;
    var rank = insertRank(board, score, mode);
    if (!board.ok) {
      verdict.textContent = 'Couldn’t check the leaderboard right now — you can still try to post.';
    } else if (rank) {
      if (s.rec) verdict.replaceChildren('That run makes the top 10 at ', h('b', { text: '#' + rank }), '. Post it on-chain to keep it until someone beats it.');
      // A practice run is not bound to a wallet, so it can never be posted: say so up front, not after a connect.
      else verdict.replaceChildren('That would have been ', h('b', { text: '#' + rank }), ' on the board, but practice runs can\u2019t be posted.');
    } else {
      var tenth = board.entries[9];
      verdict.textContent = mode === 'time'
        ? 'The top 10 starts at ' + fmtVal(mode, tenth.score) + '. ' + fmtVal(mode, score - tenth.score + 1) + ' faster to get on the board.'
        : 'The top 10 starts at ' + U.fmt(tenth.score) + '. ' + U.fmt(tenth.score - score + 1) + ' more to get on the board.';
      return;
    }
    if (s.rec && !s.replayP) s.replayP = s.rec.finish(score, s.completed);
    // A Top 10 run is kept in this browser until it is posted, so closing the tab or a failed post never loses it.
    if (s.rec && s.replayP) s.replayP.then(function (b) { if (b) keepUnposted(boardOf(g, mode), score, mode, b); });
    buildSubmit(submitBox, s, score, rank);
  }

  // Game over after a practice run. A run is locked to the wallet it started with (its replay is seeded
  // from it), so this score can't be posted even if the player connects now. Say that plainly, let them
  // connect here, show the result as soon as the wallet answers, and offer a ranked run straight away.
  function practiceBox(box, s) {
    var g = s.game, vkey = s.variant ? s.variant.key : null;
    function render() {
      if (session !== s || !box.isConnected) return;
      var st = S.status();
      if (st.address) {
        box.replaceChildren(
          h('p', { class: 'xa-note', style: 'margin:0;color:var(--xa-green)', text: '\u2713 Connected as ' + S.shortAddress(st.address) + '. Your next run is ranked and can be posted.' }),
          h('p', { class: 'xa-note', text: 'This practice run stays unposted: a run is locked to the wallet it starts with, so nobody can claim a score they didn\u2019t play.' }),
          h('button', { class: 'xa-btn xa-btn-play', style: 'margin-top:10px;--c:' + g.color, type: 'button', onclick: function () { startGame(g.id, vkey, { go: true }); } }, ['\u25B6 Play a ranked run'])
        );
        return;
      }
      var msg = h('p', { class: 'xa-msg' });
      var btn = h('button', { class: 'xa-btn', type: 'button', style: 'margin-top:10px', onclick: async function () {
        if (btn.disabled) return;
        walletStatus = S.status(); paintWallet();
        if (walletStatus.route === 'none') { onWalletClick(); return; }
        btn.disabled = true; btn.textContent = 'Check your wallet\u2026'; msg.className = 'xa-msg'; msg.textContent = '';
        try {
          await S.connect();
          walletStatus = S.status(); paintWallet();
          if (!walletStatus.address) throw new Error('The wallet did not return an address.');
          render();
        } catch (e) {
          if (session !== s || !box.isConnected) return;
          btn.disabled = false; btn.textContent = 'Connect wallet';
          msg.className = 'xa-msg is-err'; msg.textContent = 'Not connected: ' + ((e && e.message) || String(e));
        }
      } }, ['Connect wallet']);
      box.replaceChildren(
        h('p', { class: 'xa-note', style: 'margin:0', text: 'Practice run: this score can\u2019t be posted, even if you connect now. A run is locked to the wallet it starts with.' }),
        h('p', { class: 'xa-note', text: 'Connect, then play again: every run after that is ranked and can be posted on-chain.' }),
        btn, msg
      );
    }
    render();
    // The wallet may connect from elsewhere (the hall's button, a slow extension): keep this box in step.
    S.onChange(function () { render(); });
  }
  function buildSubmit(box, s, score, rank) {
    var g = s.game;
    var st = S.status();
    box.classList.remove('xa-hidden');
    if (!s.rec) { practiceBox(box, s); return; }
    if (st.route === 'none') {
      box.replaceChildren(
        h('p', { class: 'xa-note', style: 'margin:0', text: 'This copy of the arcade can’t reach a wallet, so this score can’t be posted from here. Open the arcade on Xtrata to post your runs.' }),
        h('a', { class: 'xa-btn', href: S.runtimeUrl(), target: '_blank', rel: 'noopener', style: 'display:block;text-align:center;text-decoration:none;margin-top:10px' }, ['Open on xtrata.xyz ↗'])
      );
      return;
    }
    postCard(box, { game: g, mode: s.mode, score: score, bytesP: s.replayP, pilot: s.pilot });
  }
  // The name / cost / post box for a ranked run: at game over, or later from a saved replay.
  // opts: { game, mode, score, pilot:{address, hash160}, bytes | bytesP, checked }
  function postCard(box, opts) {
    var g = opts.game, mode = opts.mode, score = opts.score;
    var s = { pilot: opts.pilot };
    var name = h('input', { class: 'xa-name', id: 'xa-name', maxlength: '12', autocomplete: 'off', spellcheck: 'false',
      value: U.store('name') || '', placeholder: 'AAA', 'aria-describedby': 'xa-name-note' });
    name.addEventListener('input', function () {
      var c = S.cleanName(name.value).toUpperCase();
      if (c !== name.value) name.value = c;
    });
    var msg = h('p', { class: 'xa-msg', 'aria-live': 'polite' });
    var btn = h('button', { class: 'xa-btn xa-btn-primary', type: 'button' }, ['Post score on-chain']);
    var feeNote = h('p', { class: 'xa-note', id: 'xa-name-note', text: '3–12 letters or numbers. Your wallet will ask you to confirm.' });
    var boardId = boardOf(g, mode), replayBytes = null;
    var longNote = h('div', { class: 'xa-note xa-long', style: 'display:none;color:var(--xa-gold)' });
    var how = 'inline';     // inline | inscribe | seal
    function choice(val, title, text, on) {
      var r = h('input', { type: 'radio', name: 'xa-how', value: val });
      r.checked = !!on;
      r.addEventListener('change', function () { if (r.checked) { how = val; btn.textContent = val === 'seal' ? 'Save replay & post sealed score' : 'Post score on-chain'; } });
      return h('label', { class: 'xa-how', style: 'display:flex;gap:8px;align-items:flex-start;margin:6px 0;cursor:pointer;color:var(--xa-ink,#e8eef7)' },
        [r, h('span', {}, [h('b', { text: title }), h('br'), h('span', { style: 'opacity:.85', text: text })])]);
    }
    btn.disabled = true;
    msg.textContent = 'Checking your replay…';
    S.getFee(boardId).then(function (f) {
      if (!f.ok) return;
      if (!f.registered) { feeNote.textContent = 'This board is not open for scores yet.'; return; }
      feeNote.textContent = '3–12 letters or numbers. Fee ' + (Number(f.value) / 1e6) + ' STX plus network fee, capped by a post-condition.';
    });
    (async function () {
      replayBytes = opts.bytes || await opts.bytesP;
      if (!replayBytes) { msg.className = 'xa-msg is-err'; msg.textContent = 'This run is longer than 4 hours and cannot be recorded.'; return; }
      var long = S.needsInscription(replayBytes), kb = Math.max(1, Math.round(replayBytes.length / 1024));
      if (long) {
        how = 'inscribe';
        longNote.style.display = '';
        longNote.replaceChildren(h('p', { text: 'Long run: the replay is ' + kb + ' KB, more than a score entry holds. Working out the cost…' }));
        var tooBig = Math.ceil(replayBytes.length / XA.replay.CHUNK) > XA.replay.MAX_INSCRIBE_CHUNKS;
        var sealText = 'Board fee plus a normal network fee, one approval. Your replay file is saved to your device now and the board keeps its fingerprint. ' +
          'Anyone you give the file to can check it matches, and you can inscribe it later. Keep the file safe: without it nobody can watch the run.';
        var render = function (q) {
          if (!longNote.isConnected) return;
          if (tooBig) {
            how = 'seal'; btn.textContent = 'Save replay & post sealed score';
            longNote.replaceChildren(h('p', { text: 'Long run: the replay is ' + kb + ' KB, more than the 512 KB one inscription holds, so this score is posted sealed.' }),
              choice('seal', 'Seal it', sealText, true));
            return;
          }
          longNote.replaceChildren(h('p', { text: 'Long run: the replay is ' + kb + ' KB, more than a score entry holds. Choose how to post it:' }),
            choice('inscribe', 'Inscribe the replay', (q && q.ok ? 'Inscription fee ' + (Number(q.fee) / 1e6) + ' STX' : 'A small inscription fee') +
              ' plus network fees (higher for a bigger replay), two approvals. The replay lives on chain and anyone can watch it.', how === 'inscribe'),
            choice('seal', 'Seal it (cheaper)', sealText, how === 'seal'));
        };
        S.quoteReplay(replayBytes.length).then(render, function () { render(null); });
      }
      if (!opts.checked) {
        msg.textContent = long ? 'Checking your replay (a long run takes a moment)…' : 'Checking your replay…';
        // Re-run our own replay first: never let anyone pay to post a run that will not check out.
        var chk = await XA.replay.verify(replayBytes, { address: s.pilot.address, score: score, board: boardId });
        if (!msg.isConnected) return;
        if (!chk.ok) { msg.className = 'xa-msg is-err'; msg.textContent = 'This run could not be verified, so it can’t be posted (' + chk.reason + ').'; return; }
      }
      msg.className = 'xa-msg is-ok'; msg.textContent = 'Replay checked ✓ Ready to post.';
      btn.disabled = false;
    })();
    btn.addEventListener('click', async function () {
      var n = S.cleanName(name.value).toUpperCase();
      if (n.length < 3) { msg.className = 'xa-msg is-err'; msg.textContent = 'Name needs at least 3 characters.'; name.focus(); return; }
      U.store('name', n);
      var sealIt = how === 'seal';
      btn.disabled = true; name.disabled = true;
      longNote.querySelectorAll('input').forEach(function (r) { r.disabled = true; });
      msg.className = 'xa-msg'; msg.textContent = 'Check your wallet to confirm…';
      if (sealIt) { keepSealed(replayBytes); saveReplay(replayBytes, boardId + '-' + n + '-' + score + '-sealed'); }
      try {
        var r = await S.submit({ board: boardId, score: score, name: n, replay: replayBytes, seal: sealIt, pilotHash: S._codec.bytesToHex(s.pilot.hash160),
          onProgress: function (t) { if (msg.isConnected) { msg.className = 'xa-msg'; msg.textContent = t; } } });
        if (r.ok) {
          dropUnposted(replayBytes);
          var tx = r.txid ? (/^0x/.test(r.txid) ? r.txid : '0x' + r.txid) : '';
          msg.className = 'xa-msg is-ok';
          msg.replaceChildren('Submitted! It shows on the board once the transaction confirms. ',
            tx ? h('a', { href: 'https://explorer.hiro.so/txid/' + tx + '?chain=' + S.config().network, target: '_blank', rel: 'noopener', text: 'View transaction ↗' }) : '');
          btn.textContent = sealIt ? 'Posted sealed ✓' : 'Posted ✓';
          if (sealIt) msg.append(h('br'), 'Your replay file was saved as xtrata-arcade-' + (boardId + '-' + n + '-' + score + '-sealed').replace(/[^A-Za-z0-9_.-]+/g, '_') + '.xar. Keep it: it is the proof of this run. ',
            h('button', { class: 'xa-link', type: 'button', text: 'Save it again', onclick: function () { saveReplay(replayBytes, boardId + '-' + n + '-' + score + '-sealed'); } }));
          XA.audio.arp([784, 988, 1175, 1568], 0.07, { type: 'square', vol: 0.18 });
        } else if (r.needsRuntime) {
          msg.className = 'xa-msg is-err';
          msg.replaceChildren(r.reason + ' ', h('a', { href: r.runtimeUrl, target: '_blank', rel: 'noopener', text: 'Open the secure runtime ↗' }));
          btn.disabled = false; name.disabled = false;
          longNote.querySelectorAll('input').forEach(function (r) { r.disabled = false; });
        }
      } catch (e) {
        msg.className = 'xa-msg is-err';
        msg.textContent = (e && e.message) || 'The wallet did not sign.';
        btn.disabled = false; name.disabled = false;
        longNote.querySelectorAll('input').forEach(function (r) { r.disabled = false; });
      }
    });
    box.replaceChildren(h('label', { for: 'xa-name', text: 'NAME ON THE BOARD' }), name, feeNote, longNote, btn, msg);
  }

  /* ---------------------------------------------------------- loop */
  var STEP = 1 / 60;
  var attractT = 0, attractAcc = 0;
  function frame(ts) {
    raf = root.requestAnimationFrame(frame);
    var dt = lastTs ? Math.min(0.1, (ts - lastTs) / 1000) : 0;
    lastTs = ts;
    if (session) runSession(dt);
    else runAttract(dt);
  }
  function runAttract(dt) {
    attractT += dt;
    attractAcc += dt;
    if (attractAcc < 1 / 30) return;
    attractAcc = 0;
    cabinets.forEach(function (c) {
      var r = c.canvas.getBoundingClientRect();
      if (!r.width) return;
      var dpr = Math.min(root.devicePixelRatio || 1, 2);
      var w = Math.round(r.width * dpr), hgt = Math.round(r.height * dpr);
      if (c.canvas.width !== w || c.canvas.height !== hgt) { c.canvas.width = w; c.canvas.height = hgt; }
      c.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      try { c.game.attract(c.ctx, r.width, r.height, attractT); } catch (e) {}
    });
  }
  function runSession(dt) {
    var s = session;
    var g = s.game;
    if (s.state === 'countdown') {
      var before = Math.ceil(s.countdown);
      s.countdown -= dt;
      var now = Math.ceil(s.countdown);
      if (now !== before && now > 0) { s.countEl.textContent = String(now); XA.audio.tone(440, 0.1, { type: 'square', vol: 0.15 }); }
      if (s.countdown <= 0) {
        s.state = 'play';
        s.input.reset();
        setOverlay(null);
        XA.audio.tone(880, 0.16, { type: 'square', vol: 0.18 });
      }
    } else if (s.state === 'play') {
      if (s.input.hit('pause')) { togglePause(); }
      else {
        s.acc += dt;
        var steps = 0;
        while (s.acc >= STEP && steps < 6 && session === s && s.state === 'play') {
          if (s.rec) s.rec.before();
          s.instance.update(STEP);
          if (s.rec) s.rec.after();
          s.input.endFrame();
          s.fx.update(STEP);
          s.acc -= STEP;
          steps++;
        }
        // Long-run hint: once the replay outgrows a score entry, say so (posting will store it as an inscription).
        if (s.rec && !s.longHint && s.rec.step % 120 === 0 && s.rec.estimate() > (S.config().inlineMax || S.INLINE_MAX) && s.tagEl) {
          s.longHint = true;
          s.tagEl.textContent = '\u25CF RANKED \u00B7 LONG RUN';
          s.tagEl.style.color = '#ffcf5a';
          s.tagEl.title = 'This replay is now bigger than a score entry holds. You can still post it: it will be stored as its own Xtrata inscription (a small extra fee and one more wallet approval).';
        }
      }
    } else if (s.state === 'ready') {
      if (s.input.hit('start') || s.input.hit('a')) (s.primary || function () { beginRun(s); })();
      else if (s.input.hit('pause')) { endSession(); return; }
      s.input.endFrame();
    } else if (s.state === 'watch') {
      s.acc += dt * s.speed;
      var wsteps = 0, realStore = U.store;
      U.store = s.blank || (s.blank = blankStore(s));
      try {
        while (s.acc >= STEP && wsteps < 6 * s.speed && session === s && s.state === 'watch') {
          if (s.steps >= s.watch.steps) { endWatch(s); break; }
          s.pb.load(s.steps);
          s.instance.update(STEP);
          s.steps++;
          s.fx.update(STEP);
          s.acc -= STEP;
          wsteps++;
        }
      } finally { U.store = realStore; }
    } else if (s.state === 'over' || s.state === 'watched') {
      s.fx.update(dt);
    }
    if (session !== s) return;
    var shown = fmtVal(s.mode, s.score);
    if (s.scoreEl.textContent !== shown) s.scoreEl.textContent = shown;

    var ctx = s.ctx, k = s.scale * s.dpr;
    ctx.setTransform(k, 0, 0, k, 0, 0);
    if (s.shake > 0.1) {
      ctx.translate((Math.random() - 0.5) * s.shake, (Math.random() - 0.5) * s.shake);
      s.shake *= Math.pow(0.02, dt);
    } else s.shake = 0;
    ctx.save();
    ctx.beginPath(); ctx.rect(-20, -20, g.size.w + 40, g.size.h + 40); ctx.clip();
    if (s.state === 'ready') {
      s.attractT = (s.attractT || 0) + dt;
      try { g.attract(ctx, g.size.w, g.size.h, s.attractT); } catch (e) { s.instance.render(ctx); }
      ctx.restore();
      return;
    }
    s.instance.render(ctx);
    s.fx.draw(ctx);
    ctx.restore();
  }

  /* ---------------------------------------------------------- boot */
  function boot(mount) {
    if (rootEl) return;
    var cfg = root.XA_CONFIG || {};
    if (cfg.scores) S.configure(cfg.scores);
    rootEl = mount || doc.getElementById('xa-root') || doc.body;
    buildRoom();
    S.onChange(function (st) {
      walletStatus = st;
      paintWallet();
    });
    cabinets.forEach(function (c) { refreshCabinet(c); });
    root.addEventListener('resize', fit);
    doc.addEventListener('visibilitychange', function () { if (doc.hidden) togglePause(true); });
    root.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modalEl) { closeModal(); return; }
      if (!session) return;
      if (e.key === 'Enter' && session.state === 'over' && doc.activeElement && doc.activeElement.id !== 'xa-name' &&
          doc.activeElement.tagName !== 'BUTTON' && doc.activeElement.tagName !== 'A') startGame(session.game.id, session.variant && session.variant.key, { go: true });
      if ((e.key === 'Escape' || e.key === 'p' || e.key === 'P') && session.state === 'paused') togglePause();
    });
    raf = root.requestAnimationFrame(frame);
  }

  root.XARoom = {
    boot: boot,
    start: startGame,
    back: endSession,
    boards: openBoards,
    wallet: onWalletClick,
    _session: function () { return session; }
  };
})(window);
