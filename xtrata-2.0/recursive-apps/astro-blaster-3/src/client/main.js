// ---------------------------------------------------------------------------
// App: screens, main loop, runs, replays, leaderboard and submit flow.
// ---------------------------------------------------------------------------

(function () {
  var $ = function (id) { return document.getElementById(id); };
  var cv = $('cv');
  R.init(cv);
  Input.bindTouch(cv);

  var STEP_MS = 1000 / 60;
  var BOT = typeof botInput === 'function' ? botInput : AB3.botInput; // attract-mode demo pilot
  var app = {
    mode: 'title',          // title | play | results | watch
    screen: 'scrTitle',
    back: [],
    run: null,              // { st, rec, board, period, mode, startedAt }
    attract: null,
    watch: null,            // { st, reader, frames, speed, entry, onDone }
    paused: false,
    lastT: 0, acc: 0,
    boardTab: 'campaign',
    lastReplay: null        // { bytes, st }
  };

  // ------------------------------------------------------------ storage (best effort)
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem('ab3:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('ab3:' + k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };
  var settings = store.get('settings', { sfx: 0.7, music: 0.55, shake: true, flashes: true, contrast: false });
  function applySettings() {
    SFX.setVolume('sfx', settings.sfx); SFX.setVolume('music', settings.music);
    R.settings.shake = settings.shake; R.settings.flashes = settings.flashes; R.settings.contrast = settings.contrast;
    store.set('settings', settings);
  }
  applySettings();
  $('engineV').textContent = AB3.ENGINE_VERSION;

  // ------------------------------------------------------------ screens
  var SCREENS = ['scrTitle', 'scrPilot', 'scrBoard', 'scrHow', 'scrSettings', 'scrPause', 'scrCards', 'scrDock', 'scrResults'];
  function show(id, push) {
    if (push && app.screen) app.back.push(app.screen);
    SCREENS.forEach(function (s) { $(s).classList.toggle('hidden', s !== id); });
    app.screen = id;
    if (id) {
      var first = $(id).querySelector('.btn.primary, .card, .btn, .tab');
      if (first && !Input.usedTouch()) setTimeout(function () { try { first.focus({ preventScroll: true }); } catch (e) { /* noop */ } }, 30);
    }
  }
  function goBack() {
    var prev = app.back.pop();
    show(prev || (app.mode === 'play' ? 'scrPause' : 'scrTitle'));
    SFX.play('uiBack');
  }
  document.querySelectorAll('[data-back]').forEach(function (b) { b.addEventListener('click', goBack); });

  var toastTimer = null;
  function toast(msg, ms) {
    var t = $('toast'); t.textContent = msg; t.classList.remove('hidden');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.add('hidden'); }, ms || 2600);
  }

  function setPlaying(on) { document.body.classList.toggle('playing', !!on); }
  function detectTouch() { if (('ontouchstart' in window) || navigator.maxTouchPoints > 0) document.body.classList.add('touch'); }
  detectTouch();

  // ------------------------------------------------------------ pilot (wallet address bound into runs)
  var pilot = Chain.validateAddress(store.get('pilot', ''));
  var pendingStart = null;
  function short(a) { return a.slice(0, 6) + '…' + a.slice(-4); }
  function updatePilot() {
    $('pilotLabel').textContent = pilot ? 'Pilot ' + short(pilot.address) : 'No pilot set · runs cannot be submitted';
    $('btnPilot').textContent = pilot ? 'Change' : 'Set pilot';
  }
  function openPilot(then) {
    pendingStart = then || null;
    $('pilotInput').value = pilot ? pilot.address : '';
    $('pilotMsg').textContent = ''; $('pilotMsg').className = 'msg';
    var embedded = false; try { embedded = window.parent !== window; } catch (e) { embedded = true; }
    $('btnPilotWallet').classList.toggle('hidden', !embedded);
    $('btnPilotSave').textContent = then ? 'Save and play' : 'Save';
    $('btnPilotSkip').classList.toggle('hidden', !then);
    show('scrPilot', true);
  }
  function savePilot(v) {
    pilot = v; store.set('pilot', v.address); updatePilot();
    var go = pendingStart; pendingStart = null;
    if (go) go(); else goBack();
  }
  $('btnPilot').addEventListener('click', function () { SFX.ensure(); SFX.play('ui'); openPilot(null); });
  $('btnPilotSave').addEventListener('click', function () {
    var v = Chain.validateAddress($('pilotInput').value);
    if (!v || (v.version !== 22 && v.version !== 20)) { $('pilotMsg').className = 'msg err'; $('pilotMsg').textContent = 'Enter a valid mainnet Stacks address (starts with SP or SM).'; return; }
    savePilot(v);
  });
  $('pilotInput').addEventListener('keydown', function (e) { e.stopPropagation(); if (e.key === 'Enter') $('btnPilotSave').click(); });
  $('btnPilotWallet').addEventListener('click', function () {
    $('pilotMsg').className = 'msg'; $('pilotMsg').textContent = 'Asking xtrata.xyz for your wallet address…';
    Chain.requestHostAddress().then(function (v) { $('pilotInput').value = v.address; $('pilotMsg').className = 'msg ok'; $('pilotMsg').textContent = 'Got it. Press Save and play.'; },
      function (e) { $('pilotMsg').className = 'msg err'; $('pilotMsg').textContent = e.message; });
  });
  $('btnPilotSkip').addEventListener('click', function () { var go = pendingStart; pendingStart = null; if (go) go(true); });
  updatePilot();

  // ------------------------------------------------------------ attract mode (title background)
  function newAttract() {
    app.attract = AB3.createGame({ seed: (Math.random() * 4294967296) >>> 0 });
    app.attract.testGod = true;
  }
  newAttract();

  // ------------------------------------------------------------ runs
  function startRun(kind, practice) {
    SFX.ensure();
    if (!pilot && !practice) { openPilot(function (p2) { startRun(kind, p2); }); return; }
    if (kind === 'daily' && !practice) {
      // always use the chain's current day, even if this tab has been open a while
      toast('Checking today\'s daily run…', 1500);
      Chain.fetchPeriod().then(function () { beginRun(kind, practice); }, function () { toast('The daily run needs a chain connection. Try again in a moment.'); updateTitle(); });
      return;
    }
    beginRun(kind, practice);
  }
  function beginRun(kind, practice) {
    var period = 0, board = CHAIN_CONFIG.boards.campaign, mode = AB3.MODE_CAMPAIGN;
    if (kind === 'daily') {
      var pi = Chain.period();
      if (pi.status !== 'ok') { toast('The daily run needs a chain connection. Try again in a moment.'); refreshPeriod(); return; }
      period = pi.value; board = CHAIN_CONFIG.boards.daily; mode = AB3.MODE_DAILY;
    }
    var runPilot = practice ? null : pilot;
    var seed = new Uint32Array(1);
    if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(seed); else seed[0] = (Math.random() * 4294967296) >>> 0;
    var st = AB3.createGame({ mode: mode, seed: seed[0], period: period, pilot: runPilot ? runPilot.hash : null, pilotVersion: runPilot ? runPilot.version : 0 });
    app.run = { st: st, rec: new AB3.Recorder(), board: board, period: period, kind: kind, pilot: runPilot };
    app.mode = 'play'; app.paused = false; app.back = [];
    Input.reset(); R.clearParticles(); R.setPalette(0);
    show(null); setPlaying(true);
    SFX.startMusic({ sector: 0 }); SFX.setMusic({ title: false, sector: 0, boss: false });
    // refresh the board in the background so the end-of-run check is current
    Chain.fetchTop10(board, period).catch(function () { /* handled at game over */ });
  }

  function stepRun(input) {
    var run = app.run;
    run.rec.push(input);
    AB3.step(run.st, input);
    handleEvents(run.st, run.st.events, true);
  }

  function handleEvents(st, events, live) {
    R.onEvents(st, events);
    for (var i = 0; i < events.length; i++) {
      var e = events[i];
      switch (e.type) {
        case 'kill': SFX.play(e.big ? 'killBig' : 'kill'); break;
        case 'hit': SFX.play('hit'); break;
        case 'block': case 'shieldHit': SFX.play('block'); break;
        case 'graze': SFX.play('graze'); break;
        case 'scrap': SFX.play('scrap'); break;
        case 'playerHit': SFX.play('playerHit'); if (navigator.vibrate && live) try { navigator.vibrate(60); } catch (x) { /* noop */ } break;
        case 'shieldBreak': SFX.play('shieldBreak'); break;
        case 'bomb': SFX.play('bomb'); break;
        case 'bossWarn': SFX.play('bossWarn'); break;
        case 'bossStart': SFX.setMusic({ boss: true }); break;
        case 'beamWarn': SFX.play('beamWarn'); break;
        case 'beamFire': SFX.play('beamFire'); break;
        case 'lightning': SFX.play('lightning'); break;
        case 'laneWarn': SFX.play('laneWarn'); break;
        case 'mineDrop': SFX.play('mine'); break;
        case 'snipe': SFX.play('snipe'); break;
        case 'waveClear': SFX.play('waveClear'); break;
        case 'bossDead': SFX.play('bossDead'); SFX.setMusic({ boss: false }); break;
        case 'bombGained': SFX.play('bombGained'); break;
        case 'chainLost': SFX.play('chainLost'); break;
        case 'launch': SFX.play('launch'); break;
        case 'sectorStart': SFX.setMusic({ sector: e.sector, boss: false }); break;
        case 'cards': if (live) openCards(st); break;
        case 'dock': if (live) openDock(st); break;
        case 'cardPicked': if (!live && app.mode === 'watch') toast('Picked: ' + e.title, 1400); break;
        case 'gameOver': SFX.play('gameOver'); if (live) setTimeout(endRun, 400); break;
      }
    }
  }

  // ------------------------------------------------------------ cards
  var ICONS = {
    weapon: '<svg viewBox="0 0 42 42"><path d="M21 4 L26 18 L21 38 L16 18 Z" fill="none" stroke="#7dff7a" stroke-width="2"/><path d="M21 12 V30" stroke="#fff" stroke-width="1.5"/></svg>',
    repair: '<svg viewBox="0 0 42 42"><path d="M21 6 L35 34 H7 Z" fill="none" stroke="#ff4f6a" stroke-width="2"/><path d="M21 15 V29 M14 22 H28" stroke="#fff" stroke-width="2"/></svg>',
    drone: '<svg viewBox="0 0 42 42"><path d="M21 12 L27 21 L21 30 L15 21 Z" fill="none" stroke="#39e6ff" stroke-width="2"/><path d="M8 26 L11 21 L14 26 Z M28 26 L31 21 L34 26 Z" fill="#39e6ff"/></svg>',
    shield: '<svg viewBox="0 0 42 42"><circle cx="21" cy="21" r="14" fill="none" stroke="#9fd8ff" stroke-width="2"/><circle cx="21" cy="21" r="8" fill="none" stroke="#fff" stroke-width="1.2" opacity=".6"/></svg>',
    magnet: '<svg viewBox="0 0 42 42"><path d="M12 10 V22 A9 9 0 0 0 30 22 V10" fill="none" stroke="#39e6ff" stroke-width="5"/><circle cx="21" cy="34" r="2.5" fill="#4dffa0"/></svg>',
    over: '<svg viewBox="0 0 42 42"><path d="M23 5 L11 23 H20 L18 37 L31 18 H22 Z" fill="none" stroke="#ffd76a" stroke-width="2"/></svg>',
    after: '<svg viewBox="0 0 42 42"><path d="M8 14 H26 M4 21 H30 M8 28 H26" stroke="#39e6ff" stroke-width="2.5"/><path d="M30 12 L38 21 L30 30" fill="none" stroke="#fff" stroke-width="2"/></svg>',
    graze: '<svg viewBox="0 0 42 42"><circle cx="21" cy="21" r="3" fill="#fff"/><circle cx="21" cy="21" r="12" fill="none" stroke="#39e6ff" stroke-dasharray="3 3" stroke-width="1.5"/><circle cx="33" cy="12" r="3" fill="#ff4f9a"/></svg>',
    bomb: '<svg viewBox="0 0 42 42"><circle cx="21" cy="21" r="10" fill="none" stroke="#ffd76a" stroke-width="2.5"/><circle cx="21" cy="21" r="16" fill="none" stroke="#ffd76a" stroke-width="1" opacity=".5"/></svg>',
    chain: '<svg viewBox="0 0 42 42"><rect x="6" y="16" width="16" height="10" rx="5" fill="none" stroke="#39e6ff" stroke-width="2"/><rect x="20" y="16" width="16" height="10" rx="5" fill="none" stroke="#fff" stroke-width="2"/></svg>'
  };
  function cardIcon(c) {
    if (c.kind === 'weapon') return ICONS.weapon;
    if (c.kind === 'repair') return ICONS.repair;
    return ICONS[c.id.slice(2)] || ICONS.drone;
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function openCards(st) {
    var box = $('cards'); box.innerHTML = '';
    st.cards.forEach(function (c, i) {
      var b = document.createElement('button');
      b.className = 'card ' + c.kind;
      b.innerHTML = '<span class="key">' + (i + 1) + '</span><div class="kind">' + (c.kind === 'module' ? 'Module' : c.kind === 'repair' ? 'Repair' : 'Weapon') + '</div>' +
        '<div class="ico">' + cardIcon(c) + '</div><div class="ttl">' + esc(c.title) + '</div><div class="dsc">' + esc(c.desc) + '</div>';
      b.addEventListener('click', function () { pickCard(i); });
      box.appendChild(b);
    });
    show('scrCards');
    SFX.play('ui');
  }
  function pickCard(i) {
    if (!app.run || app.run.st.phase !== 'cards') return;
    stepRun({ ax: 0, ay: 0, cmd: AB3.CMD.CARD1 + i });
    SFX.play('card');
    show(null);
  }

  // ------------------------------------------------------------ dock
  function openDock(st) {
    renderDock(st);
    show('scrDock');
  }
  function renderDock(st) {
    $('dockScrap').textContent = st.scrap + ' scrap';
    var box = $('dockItems'); box.innerHTML = '';
    st.dock.forEach(function (it, i) {
      var b = document.createElement('button');
      b.className = 'dockItem';
      var can = it.ok && st.scrap >= it.cost;
      b.disabled = !can;
      b.innerHTML = '<div><b>' + (i + 1) + ' · ' + esc(it.title) + '</b><span>' + esc(it.ok ? it.desc : 'Maxed') + '</span></div><div class="cost">' + it.cost + '</div>';
      b.addEventListener('click', function () { buyDock(i); });
      box.appendChild(b);
    });
  }
  function buyDock(i) {
    var st = app.run && app.run.st;
    if (!st || st.phase !== 'dock') return;
    var it = st.dock[i];
    if (!it || !it.ok || st.scrap < it.cost) { SFX.play('deny'); return; }
    stepRun({ ax: 0, ay: 0, cmd: AB3.CMD.DOCK1 + i });
    SFX.play('buy');
    renderDock(st);
  }
  function leaveDock() {
    var st = app.run && app.run.st;
    if (!st || st.phase !== 'dock') return;
    stepRun({ ax: 0, ay: 0, cmd: AB3.CMD.DOCK_LEAVE });
    SFX.play('ui');
    show(null);
  }
  $('btnDockLeave').addEventListener('click', leaveDock);

  // ------------------------------------------------------------ pause
  function pause() {
    if (app.mode !== 'play' || app.paused) return;
    var ph = app.run.st.phase;
    if (ph === 'cards' || ph === 'dock') return;
    app.paused = true; show('scrPause'); SFX.suspend(true);
  }
  function resume() {
    if (!app.paused) return;
    app.paused = false; show(null); SFX.suspend(false); Input.reset();
  }
  $('btnPause').addEventListener('click', pause);
  $('btnResume').addEventListener('click', resume);
  $('btnPauseSettings').addEventListener('click', function () { openSettings(true); });
  $('btnQuit').addEventListener('click', function () { app.paused = false; SFX.suspend(false); endRun(true); });
  document.addEventListener('visibilitychange', function () { if (document.hidden) pause(); });

  Input.on('pause', function () {
    if (app.mode === 'play') { if (app.paused) resume(); else pause(); }
    else if (app.mode === 'watch') exitWatch();
    else if (app.screen !== 'scrTitle' && app.screen !== 'scrResults') goBack();
  });
  Input.on('number', function (n) {
    if (app.screen === 'scrCards' && n <= 3) pickCard(n - 1);
    else if (app.screen === 'scrDock') buyDock(n - 1);
  });
  Input.on('enter', function () { if (app.screen === 'scrDock') leaveDock(); });
  Input.on('shipPos', function () { var st = app.run ? app.run.st : null; return st ? [st.player.x, st.player.y] : [180, 550]; });
  Input.on('blur', function () { pause(); });
  $('btnBomb').addEventListener('touchstart', function (e) { e.preventDefault(); e.stopPropagation(); Input.bomb(); }, { passive: false });
  $('btnBomb').addEventListener('click', function () { Input.bomb(); });

  // ------------------------------------------------------------ end of run
  function endRun(quit) {
    if (!app.run || app.mode !== 'play') return;
    var run = app.run;
    app.mode = 'results'; setPlaying(false);
    SFX.setMusic({ title: true, boss: false });
    var st = run.st;
    // personal best
    var pbKey = 'best:' + run.board;
    var best = store.get(pbKey, 0);
    var isPB = st.score > best;
    if (isPB) store.set(pbKey, st.score);
    $('resTitle').textContent = quit ? 'Run abandoned' : (isPB && st.score > 0 ? 'New personal best' : 'Run over');
    $('resScore').textContent = R.fmt(st.score);
    var secs = Math.floor(run.rec.frames / 60);
    var stage = (st.loop ? 'L' + st.loop + ' ' : '') + 'S' + (st.sector + 1) + (st.wave < 4 ? '-' + (st.wave + 1) : ' boss');
    $('resStats').innerHTML = [
      ['Reached', stage], ['Time', Math.floor(secs / 60) + ':' + ('0' + secs % 60).slice(-2)], ['Kills', st.kills],
      ['Max chain', st.maxChain], ['Grazes', st.grazes], ['Bosses', st.bossTimes.length]
    ].map(function (r) { return '<div class="stat"><b>' + esc(r[1]) + '</b><span>' + r[0] + '</span></div>'; }).join('');
    $('submitBox').innerHTML = '';
    show('scrResults');
    app.lastReplay = null;
    AB3.encodeReplay(st, run.rec).then(function (bytes) {
      app.lastReplay = { bytes: bytes, st: st, board: run.board, period: run.period };
      if (!quit && st.score > 0) offerSubmit(run, bytes);
    }).catch(function (e) {
      $('submitBox').innerHTML = '<h3>Replay error</h3><p class="msg err">' + esc(e.message) + '</p>';
    });
  }

  function offerSubmit(run, bytes) {
    var box = $('submitBox'), st = run.st;
    box.innerHTML = '<h3>Checking the chain…</h3>';
    Chain.fetchTop10(run.board, run.period).then(function () { return 'ok'; }, function () { return 'err'; }).then(function () {
      var rank = Chain.estimateRank(run.board, run.period, st.score);
      if (bytes.length > AB3.REPLAY_MAX_BYTES) {
        box.innerHTML = '<h3>Replay too long</h3><p>This run\'s replay is ' + bytes.length + ' bytes; the limit is ' + AB3.REPLAY_MAX_BYTES + '. Save the replay file to keep it.</p>';
        return;
      }
      if (rank === 0) {
        box.innerHTML = '<h3>Not in the Top 10 this time</h3><p>Your run is saved as a personal best on this device if it beat your old one.</p>';
        return;
      }
      if (!run.pilot) {
        box.innerHTML = '<h3>Top 10 score — practice run</h3><p>This run had no pilot address, so it cannot be submitted. Set your pilot on the title screen and your next run can go on the board.</p>';
        return;
      }
      var label = rank > 0 ? 'Top 10 — about rank #' + rank : 'Could not check the board right now';
      var hint = rank > 0 ? 'Submit this run and it stays on the ' + (run.kind === 'daily' ? 'daily' : 'campaign') + ' board until someone beats it. The full replay goes with it so anyone can watch and verify it.'
        : 'The chain did not answer, so the rank is unknown. You can still submit; the contract makes the final call before anything is charged.';
      var lastName = store.get('name', '');
      box.innerHTML = '<h3>' + esc(label) + '</h3><p>' + esc(hint) + '</p>' +
        '<div class="row"><input type="text" id="nameInput" maxlength="12" placeholder="Name (3–12)" autocomplete="off" autocapitalize="characters" spellcheck="false" value="' + esc(lastName) + '">' +
        '<button class="btn primary" id="btnSubmit">Submit to chain</button></div><div class="msg" id="submitMsg"></div>';
      $('btnSubmit').addEventListener('click', function () { doSubmit(run, bytes); });
      $('nameInput').addEventListener('keydown', function (e) { if (e.key === 'Enter') doSubmit(run, bytes); e.stopPropagation(); });
    });
  }

  function doSubmit(run, bytes) {
    var name = ($('nameInput').value || '').trim();
    var msg = $('submitMsg');
    if (!/^[A-Za-z0-9 _.\-]{3,12}$/.test(name)) {
      msg.className = 'msg err'; msg.textContent = 'Use 3–12 letters, numbers, spaces, dots, dashes or underscores.'; return;
    }
    store.set('name', name);
    var payload = Chain.buildPayload({ board: run.board, period: run.period, score: run.st.score, name: name, replay: bytes, pilot: run.pilot.address });
    msg.className = 'msg'; msg.textContent = 'Opening the Xtrata submit page…';
    $('btnSubmit').disabled = true;
    Chain.handOff(payload).then(function (res) {
      if (res.mode === 'host') {
        msg.className = 'msg ok'; msg.textContent = 'xtrata.xyz is opening the submit page. Confirm there with the wallet for ' + short(run.pilot.address) + '.';
        return;
      }
      var opened = null;
      if (!res.embedded) {
        try { opened = window.open(res.url, '_blank'); if (opened) { try { opened.opener = null; } catch (x) { /* noop */ } } } catch (e) { opened = null; }
      }
      if (opened) {
        msg.className = 'msg ok';
        msg.innerHTML = 'The submit page opened in a new tab. Confirm there with your wallet. <a href="' + esc(res.url) + '" target="_blank" rel="noopener" style="color:var(--cyan)">Open it again</a>';
      } else {
        msg.className = 'msg';
        msg.innerHTML = 'Open the submit page to finish (if this viewer blocks new tabs, copy the link into your browser):<div class="linkBox" id="linkBox"></div><div class="row" style="margin-top:8px"><a class="btn small primary" id="btnOpenLink" target="_blank" rel="noopener">Open submit page</a><button class="btn small" id="btnCopy">Copy link</button></div>';
        $('btnOpenLink').href = res.url;
        $('linkBox').textContent = res.url;
        $('btnCopy').addEventListener('click', function () {
          var ok = false;
          try { navigator.clipboard.writeText(res.url).then(function () { toast('Link copied'); }, function () { selectLink(); }); ok = true; } catch (e) { ok = false; }
          if (!ok) selectLink();
        });
      }
      $('btnSubmit').disabled = false;
    });
  }
  function selectLink() { var r = document.createRange(); r.selectNodeContents($('linkBox')); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); toast('Link selected — copy it'); }

  Chain.onHostMessage(function (d) {
    var msg = $('submitMsg');
    if (!msg) return;
    if (d.type === 'xtrata:arcade:submit-result') {
      if (d.txId) { msg.className = 'msg ok'; msg.innerHTML = 'Submitted. Transaction <code>' + esc(String(d.txId).slice(0, 14)) + '…</code> — your score appears once it confirms.'; }
      else if (d.error) { msg.className = 'msg err'; msg.textContent = d.error; $('btnSubmit').disabled = false; }
      else if (d.cancelled) { msg.className = 'msg'; msg.textContent = 'Cancelled. You can submit again.'; $('btnSubmit').disabled = false; }
    }
  });

  $('btnAgain').addEventListener('click', function () { startRun(app.run ? app.run.kind : 'campaign'); });
  $('btnMenu').addEventListener('click', toTitle);
  $('btnWatchMine').addEventListener('click', function () {
    if (!app.lastReplay) { toast('The replay is still being prepared'); return; }
    startWatch(app.lastReplay.bytes, { label: 'Your run', score: app.lastReplay.st.score, back: 'scrResults' });
  });
  $('btnSaveReplay').addEventListener('click', function () {
    if (!app.lastReplay) return;
    try {
      var blob = new Blob([app.lastReplay.bytes], { type: 'application/octet-stream' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'astro-blaster-3-' + app.lastReplay.st.score + '.ab3';
      document.body.appendChild(a); a.click(); a.remove();
    } catch (e) { toast('This viewer does not allow downloads'); }
  });

  function toTitle() {
    app.mode = 'title'; app.run = null; app.watch = null; app.back = [];
    setPlaying(false); $('watchBar').classList.add('hidden');
    SFX.setMusic({ title: true, boss: false });
    show('scrTitle'); updateTitle();
  }

  // ------------------------------------------------------------ watch replays
  function startWatch(bytes, opts) {
    AB3.decodeReplay(bytes).then(function (dec) {
      if (dec.header.engine !== AB3.ENGINE_VERSION) throw new Error('This replay was made with engine v' + dec.header.engine);
      var s = AB3.replaySession(dec);
      app.watch = { st: s.st, reader: s.reader, frames: dec.header.frames, done: 0, speed: 1, opts: opts, claimed: opts.score };
      app.mode = 'watch'; setPlaying(false);
      R.clearParticles(); R.setPalette(0);
      show(null);
      $('watchBar').classList.remove('hidden');
      $('watchLabel').textContent = opts.label || 'Replay';
      setSpeed(1);
      SFX.ensure(); SFX.startMusic({ sector: 0 }); SFX.setMusic({ title: false, sector: 0, boss: false });
    }).catch(function (e) { toast('Could not play this replay: ' + e.message, 4000); });
  }
  function setSpeed(n) {
    if (!app.watch) return;
    app.watch.speed = n;
    document.querySelectorAll('#watchBar [data-speed]').forEach(function (b) { b.classList.toggle('on', +b.getAttribute('data-speed') === n); });
  }
  document.querySelectorAll('#watchBar [data-speed]').forEach(function (b) { b.addEventListener('click', function () { setSpeed(+b.getAttribute('data-speed')); }); });
  function exitWatch() {
    if (!app.watch) return;
    var back = app.watch.opts.back;
    app.watch = null; $('watchBar').classList.add('hidden');
    SFX.setMusic({ title: true, boss: false });
    if (back === 'scrResults' && app.run) { app.mode = 'results'; show('scrResults'); }
    else if (back === 'scrBoard') { app.mode = 'title'; show('scrBoard'); }
    else toTitle();
  }
  $('btnWatchExit').addEventListener('click', exitWatch);

  function finishWatch() {
    var w = app.watch;
    var ok = w.claimed == null || w.st.score === w.claimed;
    toast(ok ? 'Replay finished — score ' + R.fmt(w.st.score) + (w.claimed != null ? ' matches ✓' : '') : 'Replay finished at ' + R.fmt(w.st.score) + ' but ' + R.fmt(w.claimed) + ' was claimed ✗', 5000);
    w.finished = true;
  }

  // ------------------------------------------------------------ leaderboard
  function currentBoardRef() {
    if (app.boardTab === 'daily') {
      var pi = Chain.period();
      return { board: CHAIN_CONFIG.boards.daily, period: pi.status === 'ok' ? pi.value : null };
    }
    return { board: CHAIN_CONFIG.boards.campaign, period: 0 };
  }
  function renderBoard() {
    var ref = currentBoardRef();
    var list = $('boardList'), status = $('boardStatus');
    document.querySelectorAll('.tab').forEach(function (t) { t.classList.toggle('on', t.getAttribute('data-board') === app.boardTab); });
    if (ref.period == null) { status.className = 'status err'; status.textContent = 'Could not read today\'s period from the chain.'; list.innerHTML = ''; return; }
    var b = Chain.boards[Chain.boardKey(ref.board, ref.period)];
    if (!b || b.status === 'loading' || b.status === 'idle') { status.className = 'status'; status.textContent = 'Reading the chain…'; if (!b || !b.entries.length) { list.innerHTML = ''; return; } }
    else if (b.status === 'error') { status.className = 'status err'; status.textContent = 'Could not reach the chain (' + b.error + '). This is not an empty board — try Refresh.'; }
    else status.textContent = b.entries.length ? '' : '';
    var entries = b ? b.entries : [];
    if (b && b.status === 'ok' && !entries.length) { list.innerHTML = '<li class="empty">No scores yet. The first run on the board takes #1.</li>'; return; }
    list.innerHTML = '';
    entries.forEach(function (e) {
      var li = document.createElement('li');
      var v = e.verify, vtxt = v === 'ok' ? '<small class="v-ok">✓ Verified</small>' : v === 'bad' ? '<small class="v-bad">✗ Mismatch</small>' : v === 'err' ? '<small class="v-wait">Not checked</small>' : '<small class="v-wait">Checking…</small>';
      li.innerHTML = '<span class="rk">' + e.rank + '</span><span class="nm">' + esc(e.name) + '<small>' + esc(e.player.slice(0, 6) + '…' + e.player.slice(-4)) + '</small></span>' +
        '<span class="sc">' + R.fmt(e.score) + vtxt + '</span>';
      var wb = document.createElement('button'); wb.className = 'btn small'; wb.textContent = 'Watch';
      wb.addEventListener('click', function () { watchEntry(ref, e); });
      li.appendChild(wb);
      list.appendChild(li);
    });
  }
  function loadBoard() {
    var ref = currentBoardRef();
    renderBoard();
    if (ref.period == null) { refreshPeriod().then(loadBoard, renderBoard); return; }
    Chain.fetchTop10(ref.board, ref.period).then(function (entries) { renderBoard(); verifyEntries(ref, entries); }, renderBoard);
  }
  var verifyQueue = Promise.resolve();
  var verifyCache = {}; // replay hash -> 'ok' | 'bad'
  var verifyQueued = {};
  function verifyEntries(ref, entries) {
    var daily = ref.board === CHAIN_CONFIG.boards.daily;
    entries.forEach(function (e) {
      var key = e.replayHash + ':' + e.score + ':' + e.player;
      if (verifyCache[key]) { e.verify = verifyCache[key]; return; }
      if (verifyQueued[key]) return;
      verifyQueued[key] = true;
      verifyQueue = verifyQueue.then(function () {
        return Chain.fetchReplay(ref.board, ref.period, e).then(function (bytes) {
          e._bytes = bytes;
          // chunked so a long (or hostile) replay never freezes the page
          return AB3.verifyReplay(bytes, {
            score: e.score, period: daily ? ref.period : null, mode: daily ? AB3.MODE_DAILY : AB3.MODE_CAMPAIGN,
            pilot: e.pHash, chunk: 6000
          });
        }).then(function (r) { e.verify = r.ok ? 'ok' : 'bad'; verifyCache[key] = e.verify; }, function () { e.verify = 'err'; })
          .then(function () { delete verifyQueued[key]; if (app.screen === 'scrBoard') renderBoard(); });
      });
    });
  }
  function watchEntry(ref, e) {
    var go = function (bytes) { startWatch(bytes, { label: '#' + e.rank + ' ' + e.name, score: e.score, back: 'scrBoard' }); };
    if (e._bytes) { go(e._bytes); return; }
    toast('Loading replay from the chain…');
    Chain.fetchReplay(ref.board, ref.period, e).then(function (b) { e._bytes = b; go(b); }, function (err) { toast('Could not load the replay: ' + err.message, 4000); });
  }
  document.querySelectorAll('.tab').forEach(function (t) { t.addEventListener('click', function () { app.boardTab = t.getAttribute('data-board'); loadBoard(); }); });
  $('btnBoardRefresh').addEventListener('click', loadBoard);

  // ------------------------------------------------------------ title
  function refreshPeriod() {
    return Chain.fetchPeriod().then(function (p) { updateTitle(); return p; }, function (e) { updateTitle(); throw e; });
  }
  function updateTitle() {
    var pi = Chain.period();
    $('dailyLabel').textContent = pi.status === 'ok' ? '· day ' + pi.value : (pi.status === 'error' ? '· offline' : '');
    $('dailyTabLabel').textContent = pi.status === 'ok' ? '· day ' + pi.value : '';
    var best = store.get('best:' + CHAIN_CONFIG.boards.campaign, 0);
    var top = Chain.boards[Chain.boardKey(CHAIN_CONFIG.boards.campaign, 0)];
    var parts = [];
    if (best) parts.push('Your best ' + R.fmt(best));
    if (top && top.status === 'ok' && top.entries.length) parts.push('#1 ' + top.entries[0].name + ' ' + R.fmt(top.entries[0].score));
    $('bestLine').textContent = parts.join('  ·  ');
  }
  $('btnPlay').addEventListener('click', function () { SFX.play('ui'); startRun('campaign'); });
  $('btnDaily').addEventListener('click', function () { SFX.play('ui'); startRun('daily'); });
  $('btnBoard').addEventListener('click', function () { SFX.ensure(); SFX.play('ui'); show('scrBoard', true); loadBoard(); });
  $('btnHow').addEventListener('click', function () { SFX.ensure(); SFX.play('ui'); show('scrHow', true); });
  $('btnSettings').addEventListener('click', function () { openSettings(false); });

  function openSettings(fromPause) {
    SFX.ensure(); SFX.play('ui');
    $('setSfx').value = settings.sfx; $('setMusic').value = settings.music;
    $('setShake').checked = settings.shake; $('setFlash').checked = settings.flashes; $('setContrast').checked = settings.contrast;
    show('scrSettings', true);
    void fromPause;
  }
  $('setSfx').addEventListener('input', function (e) { settings.sfx = +e.target.value; applySettings(); SFX.play('scrap'); });
  $('setMusic').addEventListener('input', function (e) { settings.music = +e.target.value; applySettings(); });
  $('setShake').addEventListener('change', function (e) { settings.shake = e.target.checked; applySettings(); });
  $('setFlash').addEventListener('change', function (e) { settings.flashes = e.target.checked; applySettings(); });
  $('setContrast').addEventListener('change', function (e) { settings.contrast = e.target.checked; applySettings(); });

  // first interaction starts the title music
  window.addEventListener('pointerdown', function first() {
    window.removeEventListener('pointerdown', first);
    if (SFX.ensure()) SFX.startMusic({ title: app.mode === 'title', sector: 0 });
  });
  window.addEventListener('keydown', function first() {
    window.removeEventListener('keydown', first);
    if (SFX.ensure()) SFX.startMusic({ title: app.mode === 'title', sector: 0 });
  });

  // ------------------------------------------------------------ main loop
  function frame(t) {
    requestAnimationFrame(frame);
    if (!app.lastT) app.lastT = t;
    var dt = Math.min(100, t - app.lastT); app.lastT = t;
    app.acc += dt;
    var steps = 0;
    while (app.acc >= STEP_MS && steps < 5) {
      app.acc -= STEP_MS; steps++;
      tick();
    }
    if (steps === 5) app.acc = 0;
    var st = app.mode === 'play' || app.mode === 'results' ? (app.run && app.run.st) : (app.mode === 'watch' ? app.watch && app.watch.st : app.attract);
    var top = null;
    if (app.run) { var b = Chain.boards[Chain.boardKey(app.run.board, app.run.period)]; if (b && b.status === 'ok' && b.entries.length) top = b.entries[0].score; else if (b && b.status === 'ok') top = 0; }
    R.draw(st, {
      paused: app.paused || app.mode === 'results',
      hi: app.mode === 'play' ? top : null,
      replay: app.mode === 'watch' && app.watch ? (app.watch.speed + 'x') : null
    });
  }

  function tick() {
    if (app.mode === 'play' && app.run && !app.paused) {
      var st = app.run.st;
      var auto = false;
      /*TEST-HOOKS-START*/ auto = !!(window.__ab3 && window.__ab3.autopilot); /*TEST-HOOKS-END*/
      if (st.phase === 'play') stepRun(auto ? BOT(st) : Input.sample(st));
      else if (auto && (st.phase === 'cards' || st.phase === 'dock')) {
        var bi = BOT(st);
        if (st.phase === 'cards') pickCard(bi.cmd - AB3.CMD.CARD1); else if (bi.cmd === AB3.CMD.DOCK_LEAVE) leaveDock(); else buyDock(bi.cmd - AB3.CMD.DOCK1);
      }
    } else if (app.mode === 'watch' && app.watch && !app.watch.finished) {
      var w = app.watch;
      for (var i = 0; i < w.speed && w.done < w.frames; i++) {
        AB3.step(w.st, w.reader.nextInput()); w.done++;
        handleEvents(w.st, w.st.events, false);
      }
      if (w.done >= w.frames) finishWatch();
    } else if (app.mode === 'title' && app.attract) {
      var a = app.attract;
      AB3.step(a, BOT(a, { noBomb: false }));
      R.onEvents(a, a.events);
      if (a.phase === 'over' || a.frame > 60 * 60 * 4) newAttract();
    }
  }

  window.addEventListener('resize', function () { R.resize(); });
  show('scrTitle');
  refreshPeriod().catch(function () { /* shown in the title */ });
  Chain.fetchTop10(CHAIN_CONFIG.boards.campaign, 0).then(updateTitle, updateTitle);
  requestAnimationFrame(frame);

  /*TEST-HOOKS-START*/
  // test hook for automated checks (stripped from the production build)
  window.__ab3 = {
    // drives a live run through the same code paths a player uses (recorded), for automated checks
    simulateLive: function (frames) {
      for (var i = 0; i < frames && app.run && app.mode === 'play'; i++) {
        var st = app.run.st, bi = BOT(st);
        if (st.phase === 'play') stepRun(bi);
        else if (st.phase === 'cards') pickCard(bi.cmd - AB3.CMD.CARD1);
        else if (st.phase === 'dock') { if (bi.cmd === AB3.CMD.DOCK_LEAVE) leaveDock(); else buyDock(bi.cmd - AB3.CMD.DOCK1); }
        else break;
      }
      return app.run ? { frames: app.run.rec.frames, score: app.run.st.score, sector: app.run.st.sector, phase: app.run.st.phase } : null;
    },
    app: app, openCards: openCards, openDock: openDock, startRun: startRun, pickCard: pickCard, buyDock: buyDock, leaveDock: leaveDock, endRun: endRun, startWatch: startWatch, toTitle: toTitle };
  /*TEST-HOOKS-END*/
})();
