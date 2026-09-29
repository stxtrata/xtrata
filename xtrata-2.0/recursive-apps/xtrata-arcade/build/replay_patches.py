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

    return engine
