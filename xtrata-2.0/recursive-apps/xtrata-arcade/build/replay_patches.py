"""Engine patches: score client -> xtrata-arcade-scores-v2, and the replay layer in the room."""


def apply(engine, rep):
    # ------------------------------------------------------------------ score client
    engine = rep(engine, "    contractName: 'xtrata-arcade-scores-v1-3',", "    contractName: 'xtrata-arcade-scores-v2',", name='contract name')
    engine = rep(engine, " * contract (xtrata-arcade-scores-v1-3 by default).", " * contract (xtrata-arcade-scores-v2 by default).", name='header note')
    engine = rep(engine, " * Reads:   Hiro `call-read` → get-top10 / get-fee-unit, decoded here.\n * Writes:  submit-score, signed in this priority order:\n"
                 " *   1. Host bridge, narrow method   `xtrata_submitArcadeScore`  (host builds tx)\n *   2. Host bridge, generic         `stx_callContract`          (runtime page)\n"
                 " *   3. Direct wallet provider       (only when the page is top-level)\n *   4. Nothing can sign here        → hand the player the secure-runtime link\n",
                 " * Reads:   Hiro `call-read` → get-top10 / get-board / get-replay, decoded here.\n"
                 " * Writes:  submit-score(board, period, score, name, replay), signed in this priority order:\n"
                 " *   1. Host bridge, generic         `stx_callContract`          (runtime page)\n"
                 " *   2. Direct wallet provider       (only when the page is top-level)\n"
                 " *   3. Nothing can sign here        → hand the player the secure-runtime link\n", name='header block')

    engine = rep(engine, "  function cvAscii(str) {",
                 "  function cvBuff(bytes) {\n    return '0x02' + bytes.length.toString(16).padStart(8, '0') + bytesToHex(bytes);\n  }\n"
                 "  function cvPrincipal(address) {\n    var d = c32decodeAddress(address);\n    return '0x05' + d.version.toString(16).padStart(2, '0') + bytesToHex(d.hash160);\n  }\n"
                 "  function cvAscii(str) {", name='cv helpers')

    i0 = engine.index("  function modeUint(mode) { return mode === 'time' ? 1 : 0; }")
    i1 = engine.index("  /* --------------------------------------------------- host bridge */")
    reads = r"""  var boardCache = {};
  function some(cv) { return cv && cv.type === 'some' ? cv.value : null; }
  // → { ok:true, entries:[{rank,name,player,score,burn,engineId,replayHash}], at } | { ok:false, error }
  // `board` is the contract board id (XA.replay.boardFor). `mode` is only used for the "qualifies" check.
  async function getTop10(board, mode, force) {
    var hit = boardCache[board];
    if (!force && hit && hit.ok && Date.now() - hit.at < CFG.boardTtlMs) return hit;
    try {
      var cv = await callRead('get-top10', [cvAscii(board), cvUint(0)]);
      if (cv.type === 'ok') cv = cv.value;
      if (cv.type !== 'list') throw err('unexpected get-top10 shape');
      var entries = [];
      cv.value.forEach(function (slot, idx) {
        var some_ = some(slot);
        if (!some_) return;
        var t = some_.value;
        entries.push({
          rank: idx + 1,
          name: t.name.value,
          player: t.player.value,
          score: Number(t.score.value),
          burn: Number(t['burn-height'].value),
          engineId: Number(t['engine-id'].value),
          replayHash: bytesToHex(t['replay-hash'].value)
        });
      });
      var out = { ok: true, entries: entries, at: Date.now() };
      boardCache[board] = out;
      return out;
    } catch (e) {
      log('board read failed', board, e && e.message);
      // Keep serving a stale good board, but flag it.
      if (hit && hit.ok) return Object.assign({}, hit, { stale: true });
      return { ok: false, error: e && e.message ? e.message : String(e) };
    }
  }
  // 'yes' | 'no' | 'unknown' — unknown when the board could not be read.
  function qualifies(board, score, mode) {
    if (!board || !board.ok) return 'unknown';
    if (!(score > 0)) return 'no';
    if (board.entries.length < 10) return 'yes';
    var last = board.entries[board.entries.length - 1].score;
    return (mode === 'time' ? score < last : score > last) ? 'yes' : 'no';
  }
  var infoCache = {};
  // → { ok:true, registered:false } | { ok:true, registered:true, fee, enabled, maxScore, engineId } | { ok:false, error }
  async function getBoardInfo(board) {
    var hit = infoCache[board];
    if (hit && Date.now() - hit.at < 60000) return hit;
    try {
      var cv = await callRead('get-board', [cvAscii(board)]);
      var s = some(cv);
      var out = { ok: true, at: Date.now(), registered: !!s };
      if (s) {
        var t = s.value;
        out.fee = BigInt(t.fee.value).toString();
        out.enabled = t.enabled.value === true;
        out.maxScore = Number(t['max-score'].value);
        out.engineId = Number(t['engine-id'].value);
      }
      infoCache[board] = out;
      return out;
    } catch (e) {
      return { ok: false, error: e && e.message ? e.message : String(e) };
    }
  }
  // The submission fee for a board, as { ok, value } (micro-STX), plus whether the board is open.
  async function getFee(board) {
    var info = await getBoardInfo(board);
    if (!info.ok) return info;
    if (!info.registered) return { ok: true, value: '0', registered: false, enabled: false };
    return { ok: true, value: info.fee, registered: true, enabled: info.enabled };
  }
  // The stored replay bytes for a player's entry on a board (period 0), or null.
  async function getReplay(board, address) {
    var cv = await callRead('get-replay', [cvAscii(board), cvUint(0), cvPrincipal(address)]);
    var s = some(cv);
    return s ? s.value : null;
  }

"""
    engine = engine[:i0] + reads + engine[i1:]

    j0 = engine.index("  /*\n   * submit({ gameId, score, name, mode }) →")
    j1 = engine.index("  /* ------------------------------------------------------ local PBs */")
    submit = r"""  /*
   * submit({ board, score, name, replay, pilotHash? }) →
   *   { ok:true, txid, route } |
   *   { ok:false, needsRuntime:true, runtimeUrl, reason }   (no signer here)
   * `board` is a contract board id, `replay` the Uint8Array from XA.replay. The contract checks that
   * bytes 4..23 of the replay are the signing wallet's hash160; `pilotHash` (hex) lets us fail early.
   * Throws on user cancel / wallet errors.
   */
  async function submit(input) {
    var board = String(input.board || '');
    var score = Math.floor(Number(input.score));
    var name = cleanName(input.name);
    var replay = input.replay;
    if (!/^[a-z0-9_-]{3,24}$/.test(board)) throw err('Invalid board id.');
    if (!(score > 0) || score > Number.MAX_SAFE_INTEGER) throw err('Score must be a positive whole number.');
    if (name.length < 3) throw err('Name needs 3–12 letters or numbers.');
    if (!(replay instanceof Uint8Array) || !replay.length || replay.length > 65536) throw err('This run has no replay to post.');

    var s = status();
    if (s.route === 'none') {
      return { ok: false, needsRuntime: true, runtimeUrl: openRuntime(),
        reason: 'This page cannot reach a wallet.' };
    }
    if (!state.address) await connect();
    var address = state.address;
    if (input.pilotHash && bytesToHex(c32decodeAddress(address).hash160) !== input.pilotHash) {
      throw err('This run was played with a different wallet. Connect that wallet to post it.');
    }

    var fee = await getFee(board);
    if (!fee.ok) throw err('Could not read the board right now. Try again in a moment.');
    if (!fee.registered) throw err('This board is not open yet.');
    if (!fee.enabled) throw err('This board is closed.');

    var contract = CFG.contractAddress + '.' + CFG.contractName;
    var args = [cvAscii(board), cvUint(0), cvUint(score), cvAscii(name), cvBuff(replay)];
    var r;

    if (s.route === 'host') {
      // Generic contract call (the secure /runtime page supports this).
      try {
        r = await bridgeRequest('stx_callContract', {
          contract: contract,
          contractAddress: CFG.contractAddress,
          contractName: CFG.contractName,
          functionName: 'submit-score',
          functionArgs: args,
          network: CFG.network,
          postConditionMode: 'deny',
          postConditions: [{ type: 'stx', principal: address, amount: fee.value, conditionCode: 'lte' }]
        });
        return { ok: true, txid: txidOf(r), route: 'host:contract-call' };
      } catch (e2) {
        if (e2.code !== -32601) throw e2;
        return { ok: false, needsRuntime: true, runtimeUrl: openRuntime(),
          reason: 'This viewer does not sign score transactions yet.' };
      }
    }

    // Direct provider (top-level page). Never send `sender` (wallet playbook §2).
    var d = directProvider();
    var params = {
      contract: contract,
      functionName: 'submit-score',
      functionArgs: args,
      arguments: args,
      postConditionMode: 'deny',
      postConditions: [stxPostConditionHex(address, fee.value)]
    };
    if (d.kind === 'leather') params.network = CFG.network;
    r = unwrap(await d.p.request('stx_callContract', params));
    return { ok: true, txid: txidOf(r), route: 'direct:' + d.kind };
  }

"""
    engine = engine[:j0] + submit + engine[j1:]
    engine = rep(engine, "      boardCache = {}; feeCache = null;\n", "      boardCache = {}; infoCache = {};\n", name='configure caches')
    engine = rep(engine, "    getFee: getFee,\n", "    getFee: getFee,\n    getBoardInfo: getBoardInfo,\n    getReplay: getReplay,\n", name='exports')
    engine = rep(engine, "    _codec: { cvUint: cvUint, cvAscii: cvAscii,", "    _codec: { cvUint: cvUint, cvAscii: cvAscii, cvBuff: cvBuff, cvPrincipal: cvPrincipal,", name='codec exports')

    # ------------------------------------------------------------------ replay module before the room
    engine = rep(engine, "<script>/* arcade-room.js */", "@@REPLAY_MODULE@@\n<script>/* arcade-room.js */", name='replay slot')

    # ------------------------------------------------------------------ room
    engine = rep(engine, "  var boards = {};              // gameId:mode → last board result\n",
                 "  var boards = {};              // gameId:mode → last board result\n"
                 "  function boardOf(g, mode) { return XA.replay.boardFor(g, mode); }   // contract board id\n", name='boardOf')
    engine = rep(engine, "          boards[key] = await S.getTop10(game.id, mode, true);", "          boards[key] = await S.getTop10(boardOf(game, mode), mode, true);", name='boards refresh')
    engine = rep(engine, "    if (!boards[key]) S.getTop10(game.id, mode).then(function (b) {", "    if (!boards[key]) S.getTop10(boardOf(game, mode), mode).then(function (b) {", name='boards open')
    engine = rep(engine, "    S.getTop10(game.id, mode).then(function (b) {\n      boards[bk(game, mode)] = b;", "    S.getTop10(boardOf(game, mode), mode).then(function (b) {\n      boards[bk(game, mode)] = b;", name='hi score')
    engine = rep(engine, "    var board = await S.getTop10(g.id, mode, true);\n    if (session !== s) return;", "    var board = await S.getTop10(boardOf(g, mode), mode, true);\n    if (session !== s) return;", name='finish board')

    # session: ranked (wallet connected) runs are seeded from wallet + nonce and recorded
    engine = rep(engine, "    var seed = U.newSeed();\n    var fx = XA.createFx();",
                 "    var pilot = XA.replay.pilotFor(walletStatus.address);      // connected wallet → a ranked, recorded run\n"
                 "    var nonce = U.newSeed();\n"
                 "    var seed = pilot ? XA.replay.seedFor(pilot.hash160, nonce, XA.replay.gameIndex(game)) : nonce;\n"
                 "    var fx = XA.createFx();", name='seed')
    engine = rep(engine, "      rng: U.rng(seed), seed: seed,\n", "      rng: U.rng(seed), seed: seed, ranked: !!pilot,\n", name='api ranked')
    engine = rep(engine, "        return { x: (p.x - r.left) / s.scale, y: (p.y - r.top) / s.scale, down: p.down, moved: p.moved };",
                 "        // quarter-unit resolution, so a replay can reproduce exactly what the game saw\n"
                 "        return { x: XA.replay.qpt((p.x - r.left) / s.scale), y: XA.replay.qpt((p.y - r.top) / s.scale), down: p.down, moved: p.moved };", name='pointer q')
    engine = rep(engine, "    s.instance = game.create(api);\n    fit();",
                 "    if (pilot && gameEl) {\n"
                 "      s.pilot = pilot;\n"
                 "      s.rec = XA.replay.record(game, variant, pilot, nonce, input, api.pointer);\n"
                 "    }\n"
                 "    var tag = h('span', { class: 'xa-runtag', style: 'margin-left:8px;font-size:11px;letter-spacing:.08em;white-space:nowrap;color:' + (pilot ? '#7dffb2' : '#9aa3c7'),\n"
                 "      title: pilot ? 'Ranked: this run is recorded and can be posted on-chain.' : 'Practice: connect a wallet before you start to rank a run.',\n"
                 "      text: pilot ? '● RANKED' : 'PRACTICE' });\n"
                 "    var ttl = $('.xa-title', gameEl); if (ttl) ttl.appendChild(tag);\n"
                 "    s.instance = game.create(api);\n    fit();", name='recorder')
    engine = rep(engine, "          s.instance.update(STEP);\n          s.input.endFrame();",
                 "          if (s.rec) s.rec.before();\n          s.instance.update(STEP);\n          if (s.rec) s.rec.after();\n          s.input.endFrame();", name='step hook')

    # game over: hand the recorded run to the submit box
    engine = rep(engine, "    buildSubmit(submitBox, s, score, rank);\n  }",
                 "    if (s.rec) s.replayP = s.rec.finish(score, s.completed);\n    buildSubmit(submitBox, s, score, rank);\n  }", name='replay at finish')
    engine = rep(engine, "    var st = S.status();\n    box.classList.remove('xa-hidden');\n",
                 "    var st = S.status();\n    box.classList.remove('xa-hidden');\n"
                 "    if (!s.rec) {\n"
                 "      box.replaceChildren(\n"
                 "        h('p', { class: 'xa-note', style: 'margin:0', text: 'Practice run. Connect your wallet before you start a run to rank it: ranked runs are recorded so anyone can check them.' }),\n"
                 "        h('button', { class: 'xa-btn', type: 'button', style: 'margin-top:10px', onclick: function () { onWalletClick(); } }, ['Connect wallet'])\n"
                 "      );\n"
                 "      return;\n"
                 "    }\n", name='practice box')
    engine = rep(engine, "    S.getFee().then(function (f) {\n      if (f.ok) feeNote.textContent = '3–12 letters or numbers. Fee ' + (Number(f.value) / 1e6) + ' STX plus network fee, capped by a post-condition.';\n    });",
                 "    var boardId = boardOf(g, s.mode), replayBytes = null;\n"
                 "    btn.disabled = true;\n"
                 "    msg.textContent = 'Checking your replay…';\n"
                 "    S.getFee(boardId).then(function (f) {\n"
                 "      if (!f.ok) return;\n"
                 "      if (!f.registered) { feeNote.textContent = 'This board is not open for scores yet.'; return; }\n"
                 "      feeNote.textContent = '3–12 letters or numbers. Fee ' + (Number(f.value) / 1e6) + ' STX plus network fee, capped by a post-condition.';\n"
                 "    });\n"
                 "    (async function () {\n"
                 "      replayBytes = await s.replayP;\n"
                 "      if (!replayBytes) { msg.className = 'xa-msg is-err'; msg.textContent = 'This run is too long to store on-chain.'; return; }\n"
                 "      // Re-run our own replay first: never let anyone pay to post a run that will not check out.\n"
                 "      var chk = await XA.replay.verify(replayBytes, { address: s.pilot.address, score: score, board: boardId });\n"
                 "      if (!msg.isConnected) return;\n"
                 "      if (!chk.ok) { msg.className = 'xa-msg is-err'; msg.textContent = 'This run could not be verified, so it can’t be posted (' + chk.reason + ').'; return; }\n"
                 "      msg.className = 'xa-msg is-ok'; msg.textContent = 'Replay checked ✓ Ready to post.';\n"
                 "      btn.disabled = false;\n"
                 "    })();", name='fee + verify')
    engine = rep(engine, "        var r = await S.submit({ gameId: g.id, mode: s.mode, score: score, name: n });",
                 "        var r = await S.submit({ board: boardId, score: score, name: n, replay: replayBytes, pilotHash: S._codec.bytesToHex(s.pilot.hash160) });", name='submit call')

    # leaderboard rows: one-tap verification of any stored replay
    engine = rep(engine, "        h('span', { class: 'xa-pts', text: fmtVal(mode, e.score) })\n      ]);\n    }));",
                 "        h('span', { class: 'xa-pts', text: fmtVal(mode, e.score) }),\n"
                 "        game ? verifyButton(game, mode, e) : null\n"
                 "      ]);\n    }));", name='board rows')
    engine = rep(engine, "  function boardList(board, game, highlight, mode) {",
                 "  function verifyButton(game, mode, e) {\n"
                 "    var b = h('button', { class: 'xa-btn', type: 'button', style: 'margin-left:8px;padding:2px 8px;font-size:11px', title: 'Fetch the stored replay and run it through this game' }, ['verify']);\n"
                 "    b.addEventListener('click', async function () {\n"
                 "      b.disabled = true; b.textContent = '…';\n"
                 "      try {\n"
                 "        var bytes = await S.getReplay(boardOf(game, mode), e.player);\n"
                 "        if (!bytes) throw new Error('no replay stored');\n"
                 "        var r = await XA.replay.verify(bytes, { address: e.player, score: e.score, board: boardOf(game, mode) });\n"
                 "        b.textContent = r.ok ? '✓ verified' : '✗ ' + r.reason;\n"
                 "        b.style.color = r.ok ? '#7dffb2' : '#ff8c8c';\n"
                 "      } catch (x) { b.textContent = '✗ ' + ((x && x.message) || 'failed'); b.style.color = '#ff8c8c'; }\n"
                 "    });\n"
                 "    return b;\n"
                 "  }\n"
                 "  function boardList(board, game, highlight, mode) {", name='verify button')
    # ------------------------------------------------------------------ v1.1 fixes
    # Typing in the name box: game keys (W A S D J K X Z C F P, digits, space) must not be swallowed.
    engine = rep(engine, """    on(root, 'keydown', function (e) {
      var name = KEYMAP[e.code];
      if (!name) return;""", """    function typing(e) {
      var t = e.target;
      return !!(t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName || '')));
    }
    on(root, 'keydown', function (e) {
      var name = KEYMAP[e.code];
      if (!name || typing(e)) return;""", name='typing keydown')
    engine = rep(engine, """    on(root, 'keyup', function (e) {
      var name = KEYMAP[e.code];
      if (name) release(name);""", """    on(root, 'keyup', function (e) {
      var name = KEYMAP[e.code];
      if (name && !typing(e)) release(name);""", name='typing keyup')

    # Wallet detection on a top-level page: also accept the other injected Stacks providers.
    engine = rep(engine, """    var x = root.XverseProviders && root.XverseProviders.BitcoinProvider;
    if (x && typeof x.request === 'function') return { kind: 'xverse', p: x };
    return null;""", """    var x = root.XverseProviders && root.XverseProviders.BitcoinProvider;
    if (x && typeof x.request === 'function') return { kind: 'xverse', p: x };
    var xs = (root.XverseProviders && root.XverseProviders.StacksProvider) || (root.xverseProviders && root.xverseProviders.StacksProvider);
    if (xs && typeof xs.request === 'function') return { kind: 'xverse', p: xs };
    if (root.StacksProvider && typeof root.StacksProvider.request === 'function') return { kind: 'leather', p: root.StacksProvider };
    return null;""", name='more providers')

    # One stable place to play: xtrata.xyz/arcade (the site points it at the current arcade inscription).
    engine = rep(engine, """    if (!(Number(CFG.parentTokenId) > 0)) return CFG.runtimeOrigin.replace(/\\/+$/, '') + '/';""",
                 """    if (!(Number(CFG.parentTokenId) > 0)) return CFG.runtimeOrigin.replace(/\\/+$/, '') + '/arcade';""", name='arcade link')

    # Say the right thing when this is already xtrata.xyz but no wallet extension is present.
    engine = rep(engine, """      openInfo('View-only here',
        'This copy of the arcade cannot reach a wallet, so you can play and see the boards but not post scores. ' +
        'Open the arcade on Xtrata to post.', S.runtimeUrl());""", """      if (onXtrataTop()) openInfo('No wallet found',
        'No Stacks wallet extension answered in this browser. Install or unlock Leather or Xverse and reload, or play from the arcade page on Xtrata.', S.runtimeUrl());
      else openInfo('View-only here',
        'This copy of the arcade cannot reach a wallet, so you can play and see the boards but not post scores. ' +
        'Open the arcade on Xtrata to post.', S.runtimeUrl());""", name='no wallet text')
    engine = rep(engine, """  async function onWalletClick() {""", """  function onXtrataTop() {
    try { return root.top === root && /(^|\\.)xtrata\\.xyz$/.test(root.location.hostname); } catch (e) { return false; }
  }
  async function onWalletClick() {""", name='onXtrataTop')

    # ------------------------------------------------------------------ v1.2 fixes
    # Wallet extensions (Xverse, Leather) often inject after this big page's scripts have run. Re-check for a
    # while and tell listeners when a wallet appears, so the room stops showing "view only" on a top-level page.
    engine = rep(engine, """    hello();
  })();

  root.XAScores = {""", """    hello();
    var lastRoute = status().route, polls = 0;
    var watch = setInterval(function () {
      var r = status().route;
      if (r !== lastRoute) { lastRoute = r; emit(); }
      if (++polls >= 40 || r === 'host') clearInterval(watch);
    }, 500);
  })();

  root.XAScores = {""", name='late wallet')
    engine = rep(engine, """  async function onWalletClick() {
    XA.audio.unlock();""", """  async function onWalletClick() {
    XA.audio.unlock();
    walletStatus = S.status(); paintWallet();   // never trust a status read before the extension arrived""", name='fresh status on click')

    # ------------------------------------------------------------------ v1.3: title screen, replays


    # Replay tools on every board row: watch, download, verify.
    engine = rep(engine, """        h('span', { class: 'xa-pts', text: fmtVal(mode, e.score) }),
        game ? verifyButton(game, mode, e) : null""", """        h('span', { class: 'xa-pts', text: fmtVal(mode, e.score) }),
        game ? h('span', { class: 'xa-tools' }, [watchButton(game, mode, e), saveButton(game, mode, e), verifyButton(game, mode, e)]) : null""", name='row tools')
    engine = rep(engine, """    var b = h('button', { class: 'xa-btn', type: 'button', style: 'margin-left:8px;padding:2px 8px;font-size:11px', title: 'Fetch the stored replay and run it through this game' }, ['verify']);""",
                 """    var b = h('button', { class: 'xa-btn', type: 'button', title: 'Fetch the stored replay and run it through this game' }, ['✓?']);""", name='verify compact')
    engine = rep(engine, "  function boardList(board, game, highlight, mode) {", r"""  var replayCache = {};
  async function fetchReplay(game, mode, e) {
    var key = boardOf(game, mode) + ':' + e.player + ':' + e.score;
    if (!replayCache[key]) replayCache[key] = S.getReplay(boardOf(game, mode), e.player).then(function (b) {
      if (!b) { delete replayCache[key]; throw new Error('No replay is stored for this entry.'); }
      return b;
    }, function (x) { delete replayCache[key]; throw x; });
    return replayCache[key];
  }
  function watchButton(game, mode, e) {
    return h('button', { class: 'xa-btn', type: 'button', title: 'Watch this run, replayed from the chain', onclick: async function (ev) {
      var b = ev.currentTarget; b.disabled = true; b.textContent = '…';
      try { var bytes = await fetchReplay(game, mode, e); closeModal(); watchReplay(bytes, { name: e.name, rank: e.rank }); }
      catch (x) { b.disabled = false; b.textContent = '▶'; openInfo('Replay unavailable', (x && x.message) || String(x)); }
    } }, ['▶']);
  }
  function saveButton(game, mode, e) {
    return h('button', { class: 'xa-btn', type: 'button', title: 'Download this replay file', onclick: async function (ev) {
      var b = ev.currentTarget; b.disabled = true;
      try { saveReplay(await fetchReplay(game, mode, e), boardOf(game, mode) + '-' + e.name + '-' + e.score); }
      catch (x) { openInfo('Replay unavailable', (x && x.message) || String(x)); }
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
  function openReplayFile() {
    var inp = h('input', { type: 'file', accept: '.xar,application/octet-stream', style: 'display:none' });
    inp.addEventListener('change', async function () {
      var f = inp.files && inp.files[0]; inp.remove();
      if (!f) return;
      try { watchReplay(new Uint8Array(await f.arrayBuffer()), { name: f.name.replace(/\.xar$/, '') }); }
      catch (x) { openInfo('Could not open that replay', (x && x.message) || String(x)); }
    });
    doc.body.appendChild(inp); inp.click();
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
  function boardList(board, game, highlight, mode) {""", name='replay helpers')

    # startGame: title screen by default, go:true to skip it, watch:dec to replay.
    engine = rep(engine, "  function startGame(id, variantKey) {\n    XA.audio.unlock();", "  function startGame(id, variantKey, opts) {\n    opts = opts || {};\n    XA.audio.unlock();", name='startGame opts')
    engine = rep(engine, "    var input = XA.createInput(stage);\n    var pads = buildPads(game.touch, input, game);",
                 "    var watch = opts.watch || null, pb = watch ? XA.replay.playback(watch.events) : null;\n"
                 "    var input = watch ? pb.input : XA.createInput(stage);\n    var pads = watch ? null : buildPads(game.touch, input, game);", name='watch input')
    engine = rep(engine, "    var pilot = XA.replay.pilotFor(walletStatus.address);      // connected wallet → a ranked, recorded run\n    var nonce = U.newSeed();\n    var seed = pilot ? XA.replay.seedFor(pilot.hash160, nonce, XA.replay.gameIndex(game)) : nonce;",
                 "    var pilot = watch ? null : XA.replay.pilotFor(walletStatus.address);      // connected wallet → a ranked, recorded run\n    var nonce = U.newSeed();\n    var seed = watch ? XA.replay.seedFor(watch.hash160, watch.nonce, watch.gameIdx) : pilot ? XA.replay.seedFor(pilot.hash160, nonce, XA.replay.gameIndex(game)) : nonce;", name='watch seed')
    engine = rep(engine, "      scoreEl: scoreEl, statusEl: statusEl, hiEl: hiEl, scale: 1, overlay: null, startedAt: Date.now()\n    };\n    var s = session;",
                 "      scoreEl: scoreEl, statusEl: statusEl, hiEl: hiEl, scale: 1, overlay: null, startedAt: Date.now()\n    };\n    var s = session;\n"
                 "    if (watch) { s.state = 'watch'; s.watch = watch; s.pb = pb; s.steps = 0; s.speed = 1; s.bytes = opts.bytes; s.info = opts.info; }\n"
                 "    else if (!opts.go) s.state = 'ready';\n"
                 "    var live = function () { return s.state === 'play' || s.state === 'watch'; };", name='session state')
    engine = rep(engine, """      addScore: function (n) { if (s.state === 'play') s.score += Math.max(0, Math.floor(n)); },
      setScore: function (n) { if (s.state === 'play') s.score = Math.max(0, Math.floor(n)); },""", """      addScore: function (n) { if (live()) s.score += Math.max(0, Math.floor(n)); },
      setScore: function (n) { if (live()) s.score = Math.max(0, Math.floor(n)); },""", name='live score')
    engine = rep(engine, "      gameOver: function () { if (s.state === 'play') finish(); },", "      gameOver: function () { if (s.state === 'play') finish(); else if (s.state === 'watch') endWatch(s); },", name='live over')
    engine = rep(engine, "      finish: function () { if (s.state === 'play') { s.completed = true; finish(); } },", "      finish: function () { if (s.state === 'play') { s.completed = true; finish(); } else if (s.state === 'watch') { s.completed = true; endWatch(s); } },", name='live finish')
    engine = rep(engine, """      pointer: function () {
        var p = input.pointer, r = canvas.getBoundingClientRect();""", """      pointer: watch ? pb.pointer : function () {
        var p = input.pointer, r = canvas.getBoundingClientRect();""", name='watch pointer')
    engine = rep(engine, "      title: pilot ? 'Ranked: this run is recorded and can be posted on-chain.' : 'Practice: connect a wallet before you start to rank a run.',\n      text: pilot ? '● RANKED' : 'PRACTICE' });",
                 "      title: watch ? 'Replay' : pilot ? 'Ranked: this run is recorded and can be posted on-chain.' : 'Practice: connect a wallet before you start to rank a run.',\n      text: watch ? '▶ REPLAY' : pilot ? '● RANKED' : 'PRACTICE' });", name='watch tag')
    engine = rep(engine, "    s.instance = game.create(api);\n    fit();\n    showCountdown();",
                 "    if (watch) { var realStore = U.store; U.store = blankStore(s); try { s.instance = game.create(api); } finally { U.store = realStore; } }\n"
                 "    else s.instance = game.create(api);\n    fit();\n"
                 "    if (watch) showWatch(s); else if (s.state === 'ready') showReady(s); else showCountdown();", name='start screens')
    engine = rep(engine, "  function buildPads(kind, input, game) {", r"""  (function () {
    var st = doc.createElement('style');
    st.textContent = '.xa-board li { grid-template-columns: 34px 1fr auto auto; }\n.xa-tools { display: flex; gap: 4px; justify-content: flex-end; }\n.xa-tools .xa-btn { margin: 0 !important; padding: 3px 8px !important; font-size: 11px !important; min-height: 0; }\n.xa-ready-overlay { overflow: auto; align-items: start; background: rgba(3, 4, 12, .6); }\n.xa-ready { width: min(520px, 100%); margin: auto; padding: 18px 16px; border-radius: 16px; border: 1px solid var(--xa-line); background: rgba(8, 10, 26, .9); box-shadow: 0 0 40px -12px var(--c); }\n.xa-ready h3 { font-size: 30px; text-shadow: 0 0 14px var(--c), 0 0 34px var(--c); }\n.xa-ready-variant { margin-top: 6px; font: 800 12px/1 var(--xa-mono); letter-spacing: .16em; color: var(--c); text-transform: uppercase; }\n.xa-ready-tag { margin: 12px 0 0; font: 800 12px/1.4 var(--xa-mono); letter-spacing: .1em; color: var(--xa-dim); }\n.xa-ready-tag.is-ranked { color: var(--xa-green); }\n.xa-link { background: none; border: 0; padding: 0; font: inherit; color: var(--xa-cyan); text-decoration: underline; cursor: pointer; }\n.xa-ready-head { display: flex; justify-content: space-between; margin: 16px 0 4px; font: 800 11px/1 var(--xa-mono); letter-spacing: .14em; color: var(--xa-faint); }\n.xa-ready-board { max-height: 38vh; overflow: auto; text-align: left; border-top: 1px solid var(--xa-line); }\n.xa-ready-board .xa-board { font-size: 13px; }\n.xa-ready-board .xa-board li { padding: 7px 6px; }\n.xa-ready .xa-variants { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-top: 10px; }\n.xa-replay-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px; }';
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
  function showReady(s) {
    var g = s.game, mode = s.mode, vkey = s.variant ? s.variant.key : null;
    var list = h('div', { class: 'xa-ready-board' }, [boardList(boards[bk(g, mode)], g, 0, mode)]);
    var start = h('button', { class: 'xa-btn xa-btn-play', style: '--c:' + g.color, type: 'button', onclick: function () { beginRun(s); } }, ['▶ START']);
    var tag = s.pilot
      ? h('p', { class: 'xa-ready-tag is-ranked', text: '● RANKED · flying as ' + S.shortAddress(s.pilot.address) })
      : h('p', { class: 'xa-ready-tag' }, ['PRACTICE · ', h('button', { class: 'xa-link', type: 'button', onclick: async function () {
          await onWalletClick();
          if (session === s && s.state === 'ready' && walletStatus.address) startGame(g.id, vkey);
        } }, ['connect a wallet']), ' to rank this run']);
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
      h('div', { class: 'xa-ready-head' }, [h('span', { text: 'ON-CHAIN TOP 10' }), h('span', { text: 'YOUR BEST ' + fmtBest(g, mode) })]),
      list,
      h('div', { class: 'xa-over-actions' }, [start, h('button', { class: 'xa-btn', type: 'button', onclick: endSession }, ['◀ Arcade'])]),
      switcher,
      h('p', { class: 'xa-note' }, ['Enter or Space to start · Esc to go back · ', h('button', { class: 'xa-link', type: 'button', onclick: openReplayFile }, ['watch a replay file'])])
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
  function buildPads(kind, input, game) {""", name='ready/watch screens')

    # Loop: ready (attract on the playfield), watch (replayed input), watched.
    engine = rep(engine, """    } else if (s.state === 'over') {
      s.fx.update(dt);
    }
    if (session !== s) return;""", """    } else if (s.state === 'ready') {
      if (s.input.hit('start') || s.input.hit('a')) beginRun(s);
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
    if (session !== s) return;""", name='loop states')
    engine = rep(engine, """    ctx.save();
    ctx.beginPath(); ctx.rect(-20, -20, g.size.w + 40, g.size.h + 40); ctx.clip();
    s.instance.render(ctx);""", """    ctx.save();
    ctx.beginPath(); ctx.rect(-20, -20, g.size.w + 40, g.size.h + 40); ctx.clip();
    if (s.state === 'ready') {
      s.attractT = (s.attractT || 0) + dt;
      try { g.attract(ctx, g.size.w, g.size.h, s.attractT); } catch (e) { s.instance.render(ctx); }
      ctx.restore();
      return;
    }
    s.instance.render(ctx);""", name='ready attract')

    # Play again / Enter on game over skip the title screen; game over gets watch + save.
    engine = rep(engine, "type: 'button', onclick: function () { startGame(g.id, vkey); } }, ['↻ Play again']);",
                 "type: 'button', onclick: function () { startGame(g.id, vkey, { go: true }); } }, ['↻ Play again']);", name='again go')
    engine = rep(engine, "doc.activeElement.tagName !== 'BUTTON' && doc.activeElement.tagName !== 'A') startGame(session.game.id, session.variant && session.variant.key);",
                 "doc.activeElement.tagName !== 'BUTTON' && doc.activeElement.tagName !== 'A') startGame(session.game.id, session.variant && session.variant.key, { go: true });", name='enter go')
    engine = rep(engine, """      h('div', { class: 'xa-over-actions' }, [again, h('button', { class: 'xa-btn', type: 'button', onclick: endSession }, ['◀ Arcade'])])
    ])]));
    again.focus();""", """      h('div', { class: 'xa-over-actions' }, [again, h('button', { class: 'xa-btn', type: 'button', onclick: endSession }, ['◀ Arcade'])]),
      s.replayP ? h('div', { class: 'xa-replay-row' }, [
        h('button', { class: 'xa-btn', type: 'button', onclick: async function () { var b = await s.replayP; if (b) watchReplay(b, { name: 'Your run' }); } }, ['▶ Watch my run']),
        h('button', { class: 'xa-btn', type: 'button', onclick: async function () { var b = await s.replayP; if (b) saveReplay(b, boardOf(g, mode) + '-' + score); } }, ['⬇ Save replay'])
      ]) : null
    ])]));
    again.focus();""", name='over replay buttons')

    engine = rep(engine, "    if (s.rec) s.replayP = s.rec.finish(score, s.completed);\n", "    if (s.rec && !s.replayP) s.replayP = s.rec.finish(score, s.completed);\n", name='replay once')
    engine = rep(engine, "    var dnf = mode === 'time' && !s.completed;\n    if (dnf) score = 0;\n", "    var dnf = mode === 'time' && !s.completed;\n    if (dnf) score = 0;\n    if (s.rec && !s.replayP) s.replayP = s.rec.finish(score, s.completed);   // ready for Watch / Save on the game-over card\n", name='replay early')

    return engine
