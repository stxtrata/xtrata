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
  async function onWalletClick() {
    XA.audio.unlock();
    if (walletStatus.address) { S.disconnect(); return; }
    if (walletStatus.route === 'none') {
      openInfo('View-only here',
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
        h('span', { class: 'xa-pts', text: fmtVal(mode, e.score) })
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
          boards[key] = await S.getTop10(game.id, mode, true);
          body.replaceChildren(boardList(boards[key], game, 0, mode));
        } }, ['↻ Refresh']),
        h('button', { class: 'xa-btn', type: 'button', onclick: closeModal }, ['Close'])
      ])
    ]);
    modal(h('div', { class: 'xa-card', style: '--c:' + game.color }, [h('h3', { text: 'High scores' }), tabs, modeTabs, body, foot]));
    if (!boards[key]) S.getTop10(game.id, mode).then(function (b) {
      boards[key] = b;
      if (modalEl && body.isConnected) body.replaceChildren(boardList(b, game, 0, mode));
    });
  }

  /* ------------------------------------------------------- session */
  function startGame(id, variantKey) {
    XA.audio.unlock();
    closeModal();
    var game = XA.games.filter(function (g) { return g.id === id; })[0];
    if (!game) return;
    var variant = variantOf(game, variantKey);
    var mode = variant ? variant.mode : game.mode;
    endSession();
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
    var input = XA.createInput(stage);
    var pads = buildPads(game.touch, input, game);
    if (pads) gameEl.appendChild(pads);
    rootEl.appendChild(gameEl);
    roomEl.setAttribute('aria-hidden', 'true');

    var seed = U.newSeed();
    var fx = XA.createFx();
    session = {
      game: game, variant: variant, mode: mode, completed: false, canvas: canvas, ctx: canvas.getContext('2d'), stage: stage, input: input, fx: fx,
      score: 0, shake: 0, state: 'countdown', countdown: 3.0, acc: 0, seed: seed,
      scoreEl: scoreEl, statusEl: statusEl, hiEl: hiEl, scale: 1, overlay: null, startedAt: Date.now()
    };
    var s = session;
    var api = {
      W: game.size.w, H: game.size.h, input: input, audio: XA.audio, fx: fx,
      rng: U.rng(seed), seed: seed,
      shake: function (n) { s.shake = Math.max(s.shake, n); },
      addScore: function (n) { if (s.state === 'play') s.score += Math.max(0, Math.floor(n)); },
      setScore: function (n) { if (s.state === 'play') s.score = Math.max(0, Math.floor(n)); },
      getScore: function () { return s.score; },
      setStatus: function (t) { if (s.statusEl.textContent !== t) s.statusEl.textContent = t; },
      gameOver: function () { if (s.state === 'play') finish(); },
      // Which board this run is for. In 'time' mode the score is the elapsed
      // time in centiseconds (lower wins): keep it current with setScore and
      // call finish() on completion. gameOver() without finish() is a DNF.
      mode: mode,
      variant: variant ? variant.key : null,
      finish: function () { if (s.state === 'play') { s.completed = true; finish(); } },
      // Pointer in playfield units. `moved` increments on every move/press, so a
      // game can tell "the pointer is steering" from "the keys are steering".
      pointer: function () {
        var p = input.pointer, r = canvas.getBoundingClientRect();
        return { x: (p.x - r.left) / s.scale, y: (p.y - r.top) / s.scale, down: p.down, moved: p.moved };
      }
    };
    s.instance = game.create(api);
    fit();
    showCountdown();
    S.getTop10(game.id, mode).then(function (b) {
      boards[bk(game, mode)] = b;
      if (session !== s) return;
      hiEl.textContent = b.ok ? (b.entries[0] ? fmtVal(mode, b.entries[0].score) : '—') : 'offline';
    });
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

  function endSession() {
    if (!session) return;
    session.input.destroy();
    session = null;
    if (XA.music) { XA.music.stop(0.35); XA.music.clearListeners(); }
    if (gameEl) { gameEl.remove(); gameEl = null; }
    roomEl.removeAttribute('aria-hidden');
    cabinets.forEach(function (c) { refreshCabinet(c); });
    var btn = $('[data-play]');
    if (btn) btn.focus();
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
    var prevBest = localBest(g, mode);
    var best = recordLocal(g, mode, score);
    var isPb = score > 0 && (mode === 'time' ? (!prevBest || score < prevBest) : score > prevBest);
    XA.audio.arp(isPb ? [523, 659, 784, 1047] : [392, 330, 262], 0.09, { type: 'triangle', vol: 0.2 });

    var verdict = h('p', { class: 'xa-verdict', text: 'Checking the on-chain board…' });
    var submitBox = h('div', { class: 'xa-submit xa-hidden' });
    var again = h('button', { class: 'xa-btn xa-btn-play', style: '--c:' + g.color, type: 'button', onclick: function () { startGame(g.id, vkey); } }, ['↻ Play again']);
    setOverlay(h('div', { class: 'xa-overlay', 'data-xa-ui': '1' }, [h('div', { class: 'xa-over' }, [
      h('h3', { text: dnf ? 'DID NOT FINISH' : mode === 'time' ? 'FINISHED' : 'GAME OVER' }),
      h('div', { class: 'xa-final', text: dnf ? '—' : fmtVal(mode, score) }),
      isPb ? h('span', { class: 'xa-badge', text: '★ NEW PERSONAL BEST' }) : h('span', { class: 'xa-note', text: 'Best ' + fmtBest(g, mode) }),
      verdict,
      submitBox,
      h('div', { class: 'xa-over-actions' }, [again, h('button', { class: 'xa-btn', type: 'button', onclick: endSession }, ['◀ Arcade'])])
    ])]));
    again.focus();

    if (dnf) { verdict.textContent = 'Finish the run to set a time for the board.'; return; }
    if (!(score > 0)) { verdict.textContent = 'Score something to get on the board.'; return; }
    var board = await S.getTop10(g.id, mode, true);
    if (session !== s) return;
    boards[bk(g, mode)] = board;
    var rank = insertRank(board, score, mode);
    if (!board.ok) {
      verdict.textContent = 'Couldn’t check the leaderboard right now — you can still try to post.';
    } else if (rank) {
      verdict.replaceChildren('That run makes the top 10 at ', h('b', { text: '#' + rank }), '. Post it on-chain to keep it until someone beats it.');
    } else {
      var tenth = board.entries[9];
      verdict.textContent = mode === 'time'
        ? 'The top 10 starts at ' + fmtVal(mode, tenth.score) + '. ' + fmtVal(mode, score - tenth.score + 1) + ' faster to get on the board.'
        : 'The top 10 starts at ' + U.fmt(tenth.score) + '. ' + U.fmt(tenth.score - score + 1) + ' more to get on the board.';
      return;
    }
    buildSubmit(submitBox, s, score, rank);
  }

  function buildSubmit(box, s, score, rank) {
    var g = s.game;
    var st = S.status();
    box.classList.remove('xa-hidden');
    if (st.route === 'none') {
      box.replaceChildren(
        h('p', { class: 'xa-note', style: 'margin:0', text: 'This copy of the arcade can’t reach a wallet, so this score can’t be posted from here. Open the arcade on Xtrata to post your runs.' }),
        h('a', { class: 'xa-btn', href: S.runtimeUrl(), target: '_blank', rel: 'noopener', style: 'display:block;text-align:center;text-decoration:none;margin-top:10px' }, ['Open on xtrata.xyz ↗'])
      );
      return;
    }
    var name = h('input', { class: 'xa-name', id: 'xa-name', maxlength: '12', autocomplete: 'off', spellcheck: 'false',
      value: U.store('name') || '', placeholder: 'AAA', 'aria-describedby': 'xa-name-note' });
    name.addEventListener('input', function () {
      var c = S.cleanName(name.value).toUpperCase();
      if (c !== name.value) name.value = c;
    });
    var msg = h('p', { class: 'xa-msg', 'aria-live': 'polite' });
    var btn = h('button', { class: 'xa-btn xa-btn-primary', type: 'button' }, ['Post score on-chain']);
    var feeNote = h('p', { class: 'xa-note', id: 'xa-name-note', text: '3–12 letters or numbers. Your wallet will ask you to confirm.' });
    S.getFee().then(function (f) {
      if (f.ok) feeNote.textContent = '3–12 letters or numbers. Fee ' + (Number(f.value) / 1e6) + ' STX plus network fee, capped by a post-condition.';
    });
    btn.addEventListener('click', async function () {
      var n = S.cleanName(name.value).toUpperCase();
      if (n.length < 3) { msg.className = 'xa-msg is-err'; msg.textContent = 'Name needs at least 3 characters.'; name.focus(); return; }
      U.store('name', n);
      btn.disabled = true; name.disabled = true;
      msg.className = 'xa-msg'; msg.textContent = 'Check your wallet to confirm…';
      try {
        var r = await S.submit({ gameId: g.id, mode: s.mode, score: score, name: n });
        if (r.ok) {
          var tx = r.txid ? (/^0x/.test(r.txid) ? r.txid : '0x' + r.txid) : '';
          msg.className = 'xa-msg is-ok';
          msg.replaceChildren('Submitted! It shows on the board once the transaction confirms. ',
            tx ? h('a', { href: 'https://explorer.hiro.so/txid/' + tx + '?chain=' + S.config().network, target: '_blank', rel: 'noopener', text: 'View transaction ↗' }) : '');
          btn.textContent = 'Posted ✓';
          XA.audio.arp([784, 988, 1175, 1568], 0.07, { type: 'square', vol: 0.18 });
        } else if (r.needsRuntime) {
          msg.className = 'xa-msg is-err';
          msg.replaceChildren(r.reason + ' ', h('a', { href: r.runtimeUrl, target: '_blank', rel: 'noopener', text: 'Open the secure runtime ↗' }));
          btn.disabled = false; name.disabled = false;
        }
      } catch (e) {
        msg.className = 'xa-msg is-err';
        msg.textContent = (e && e.message) || 'The wallet did not sign.';
        btn.disabled = false; name.disabled = false;
      }
    });
    box.replaceChildren(h('label', { for: 'xa-name', text: 'NAME ON THE BOARD' }), name, feeNote, btn, msg);
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
          s.instance.update(STEP);
          s.input.endFrame();
          s.fx.update(STEP);
          s.acc -= STEP;
          steps++;
        }
      }
    } else if (s.state === 'over') {
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
          doc.activeElement.tagName !== 'BUTTON' && doc.activeElement.tagName !== 'A') startGame(session.game.id, session.variant && session.variant.key);
      if ((e.key === 'Escape' || e.key === 'p' || e.key === 'P') && session.state === 'paused') togglePause();
    });
    raf = root.requestAnimationFrame(frame);
  }

  root.XARoom = {
    boot: boot,
    start: startGame,
    back: endSession,
    _session: function () { return session; }
  };
})(window);
