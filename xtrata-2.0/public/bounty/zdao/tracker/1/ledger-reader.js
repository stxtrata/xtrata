// Xtrata Bounty ledger collector, incremental. Read-only: it only GETs public Stacks API pages.
// Run it in a browser tab open on https://xtrata.xyz/ with api = location.origin + '/hiro/mainnet'
// (a tab on api.hiro.so cannot fetch). It remembers what it has read: pass the previous `state`
// back in and it only pages down to the transactions it has already seen. No wallet, key or broadcast.
//   var out = await XtrataLedger.run({ api: location.origin + '/hiro/mainnet' }, getFn, prevState);
//   out.addresses = every wallet, out.changed = wallets that changed this run, out.state = save for next time.
(function (root) {
  var DEP = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
  var AUD = 'SP3JB6BCKV14CG25NF017CR7KRVSM8RAGHB52DWHX.xtrata-collection-audionauts-1-3c855746';
  var MARKETS = ['xtrata-market-v1-0', 'xtrata-market-v1-1', 'xtrata-market-v1-2', 'xtrata-market-stx-v1-0', 'xtrata-market-sbtc-v1-0', 'xtrata-market-usdc-v1-0',
    'xtrata-market-sponsored-stx-v1-0', 'xtrata-market-sponsored-stx-v1-1', 'xtrata-market-sponsored-sbtc-v1-0', 'xtrata-market-sponsored-sbtc-v1-1',
    'xtrata-market-sponsored-usdcx-v1-0', 'xtrata-market-sponsored-usdcx-v1-1'];
  var DEFAULT_CFG = {
    api: 'https://api.hiro.so',
    cutoff: '2026-10-01T00:00:00Z',
    draws: ['2026-10-07T22:59:59Z', '2026-10-14T22:59:59Z', '2026-10-21T22:59:59Z'],
    frozenDraws: 1,                                // draws already held and paid keep the counts they were frozen with: wizard hand-overs only count for later draws
    fullEveryMs: 24 * 3600 * 1000,                 // rebuild from scratch at least this often, so any drift heals
    sources: [
      { kind: 'ins', label: 'Inscriptions', id: DEP + '.xtrata-v3-2-3', fns: ['seal-inscription', 'seal-inscription-batch', 'seal-recursive', 'seal-with-relationships', 'mint-single-tx', 'mint-single-tx-recursive', 'mint-single-tx-with-relationships'] },
      { kind: 'aud', label: 'Audionauts', id: AUD, fns: ['mint-seal', 'mint-seal-batch', 'mint-small-single-tx', 'mint-small-single-tx-recursive'] },
      { kind: 'sc', label: 'Scores v1-3', id: DEP + '.xtrata-arcade-scores-v1-3', fns: ['submit-score'], optional: true },
      { kind: 'sc', label: 'Scores v2', id: DEP + '.xtrata-arcade-scores-v2', fns: ['submit-score'], optional: true },
      { kind: 'ch', label: 'Chess v3', id: DEP + '.xtrata-chess-log-v3', fns: ['submit-move'], optional: true },
      { kind: 'ch', label: 'Chess v2', id: DEP + '.xtrata-chess-log-v2', fns: ['submit-move'], optional: true },
      { kind: 'mu', label: 'Music plays', id: DEP + '.xtrata-radio-plays-v1-0', fns: ['play'] },
      { kind: 'dr', label: 'Drops v1-0', id: DEP + '.xtrata-drops-v1-0', fns: ['claim', 'claim-campaign'], optional: true },
      { kind: 'dr', label: 'Drops v1-1', id: DEP + '.xtrata-drops-v1-1', fns: ['claim', 'claim-campaign'], optional: true },
      { kind: 'dr', label: 'Drops v1-2', id: DEP + '.xtrata-drops-v1-2', fns: ['claim', 'claim-campaign'], optional: true },
      { kind: 'lk', label: 'Likes', id: DEP + '.xtrata-radio-likes-v1-0', fns: ['set-liked', 'set-likes'], optional: true }
    ].concat(MARKETS.map(function (m) { return { kind: 'mk', label: 'Market ' + m.replace('xtrata-market-', ''), id: DEP + '.' + m, fns: ['list-token', 'buy'], optional: true }; }))
  };

  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  // ---- Inscription size tickets ----
  // An inscription earns 1 ticket up to 1 MB (1,048,576 bytes), then one more for every further MB, capped at 5:
  // up to 1 MB = 1, 1-2 MB = 2, 2-3 MB = 3, 3-4 MB = 4, over 4 MB = 5.
  var MB = 1048576, BEGIN_FNS = ['begin-inscription', 'begin-or-get'], SINGLE_TX = ['mint-single-tx', 'mint-single-tx-recursive', 'mint-single-tx-with-relationships'];
  function sizePoints(bytes) { return Math.min(5, Math.max(1, Math.ceil(bytes / MB))); }
  function uintOf(arg) { var m = /^u(\d+)$/.exec(String((arg && arg.repr) || '')); return m ? parseInt(m[1], 10) : null; }
  function hashOf(arg) { var m = /^0x([0-9a-f]{64})$/i.exec(String((arg && arg.repr) || '')); return m ? m[1].toLowerCase() : null; }
  // The inscriptions one call sealed, each with the size we could read for it. size null = not seen (begun before the window).
  function itemsOf(fn, args) {
    if (SINGLE_TX.indexOf(fn) >= 0) return [{ size: uintOf(args[2]) }];
    if (fn === 'seal-inscription-batch') {
      var hs = [], re = /hash 0x([0-9a-f]{64})/gi, m, txt = String((args[0] && args[0].repr) || '');
      while ((m = re.exec(txt))) hs.push({ hash: m[1].toLowerCase() });
      return hs.length ? hs : [{}];
    }
    return [{ hash: hashOf(args[0]) }];
  }

  function principalOf(arg) { var m = /^'?([A-Z0-9]{30,}(?:\.[A-Za-z][A-Za-z0-9-]*)?)$/.exec(String((arg && arg.repr) || '')); return m ? m[1] : null; }

  // ---- Wizard inscriptions ----
  // The inscription wizard mints from a throwaway wallet and then transfers the inscription to the person it was made for. The mint is
  // credited to whoever ends up with it: a direct transfer by the minter within XFER_WINDOW_MS of the mint moves the tickets to the
  // receiver. Needs the token ids a mint created, which only the NFT mint list shows (newest first, 50 a page).
  var ATT = 1;                                                                          // bump when the way mints are credited changes: older saved states are then read again from scratch
  var XFER_WINDOW_MS = 6 * 3600 * 1000, RC_KEEP_MS = 12 * 3600 * 1000;
  async function attachIds(out, cfg, get) {
    var need = {}, left = 0, off = 0, limit = 50, pages = 0, extra = 1, asset = encodeURIComponent(DEP + '.xtrata-v3-2-3::xtrata-inscription');
    out.forEach(function (ev) { if (ev.items && !need[ev.tx]) { need[ev.tx] = []; left++; } });
    if (!left) return;
    try {
      while ((left > 0 || extra-- > 0) && pages < 80) {                                // one page past the last one needed, in case a batch straddles a page
        var j = await get(cfg.api + '/extended/v1/tokens/nft/mints?asset_identifier=' + asset + '&limit=' + limit + '&offset=' + off);
        var rows = (j && j.results) || [];
        if (!rows.length) break;
        rows.forEach(function (m) { var id = uintOf(m.value), l = need[m.tx_id]; if (id != null && l && l.indexOf(id) < 0) { if (!l.length) left--; l.push(id); } });
        off += limit; pages++;
        if (rows.length < limit) break;
      }
    } catch (e) { return; }                                                             // no ids: the mints simply stay with the wallet that sent them
    out.forEach(function (ev) { var ids = need[ev.tx]; if (ids && ids.length === ev.items.length) ev.ids = ids.slice().sort(function (a, b) { return a - b; }); });
  }
  function moveMint(by, rc, xf, drawMs, touched, frozen) {
    for (var i = 0; i < rc.length; i++) {
      var r = rc[i]; if (r.id !== xf.id || r.a !== xf.from) continue;
      if (xf.ms < r.ms || xf.ms - r.ms > XFER_WINDOW_MS) return;
      rc.splice(i, 1);
      var from = by[r.a], to = by[xf.to] || (by[xf.to] = blank(xf.to, xf.ms, drawMs.length));
      var sub = function (o) { if (!o) return; o.ins = (o.ins || 0) - 1; o.inp = (o.inp || 0) - r.p; if (r.u) o.inu = (o.inu || 0) - r.u; ['ins', 'inp', 'inu'].forEach(function (k) { if (o[k] != null && (o[k] <= 0 || !o.ins)) delete o[k]; }); };
      var add = function (o) { o.ins = (o.ins || 0) + 1; o.inp = (o.inp || 0) + r.p; if (r.u) o.inu = (o.inu || 0) + r.u; };
      sub(from.n); add(to.n);
      drawMs.forEach(function (d, k) { if (k >= frozen && r.ms <= d && xf.ms <= d) { sub(from.w[k]); add(to.w[k]); } });
      if (!from.n.ins) delete from.tx.ins;
      if (!to.tx.ins) to.tx.ins = r.tx;
      to.first = Math.min(to.first, r.ms); to.last = Math.max(to.last, xf.ms);
      touched[r.a] = 1; touched[xf.to] = 1;
      return;
    }
  }

  // Pull one source newest first. Stops at a transaction it has already seen (`known`) or at the cutoff.
  async function pullSource(src, cfg, get, known) {
    var sizes = {}, out = [], xfers = [], heads = [], top = 0, off = 0, limit = 50, cutMs = Date.parse(cfg.cutoff), pages = 0, stop = false, sawKnown = false;
    while (!stop && pages < 400) {
      var j = await get(cfg.api + '/extended/v1/address/' + src.id + '/transactions?limit=' + limit + '&offset=' + off);
      var rows = (j && j.results) || [];
      if (!rows.length) break;
      for (var i = 0; i < rows.length; i++) {
        var t = rows[i], ms = (t.burn_block_time || 0) * 1000;
        if (!ms) continue;                                   // not confirmed yet
        if (!top) top = ms;
        if (heads.length < 3) heads.push(t.tx_id);
        if (known && known.indexOf(t.tx_id) >= 0) { sawKnown = true; stop = true; break; }
        if (ms < cutMs) { stop = true; break; }
        if (t.tx_type !== 'contract_call' || t.tx_status !== 'success') continue;
        var cc = t.contract_call || {};
        if (cc.contract_id !== src.id) continue;
        var args = cc.function_args || [];
        if (src.kind === 'ins' && BEGIN_FNS.indexOf(cc.function_name) >= 0) {      // a begin carries the size a later seal needs
          var bh = hashOf(args[0]), bs = uintOf(args[2]);
          if (bh && bs != null) sizes[bh] = bs;
          continue;
        }
        if (src.kind === 'ins' && cc.function_name === 'transfer') {                // a direct transfer by the minter may hand a wizard inscription over
          var xid = uintOf(args[0]), xf = principalOf(args[1]), xt = principalOf(args[2]);
          if (xid != null && xf && xt && xf === t.sender_address && xt !== xf) xfers.push({ id: xid, from: xf, to: xt, ms: ms, tx: t.tx_id });
          continue;
        }
        if (src.fns.indexOf(cc.function_name) < 0) continue;
        if (src.kind === 'lk' && cc.function_name === 'set-liked' && args[1] && String(args[1].repr) !== 'true') continue;   // an unlike is not a ticket
        var game = null;
        if (src.kind === 'ch' && args[0]) game = src.id.split('.')[1] + '#' + String(args[0].repr || '').replace(/^u/, '');
        var ev = { addr: t.sender_address, ms: ms, tx: t.tx_id, game: game };
        if (src.kind === 'ins') ev.items = itemsOf(cc.function_name, args);
        out.push(ev);
      }
      off += limit; pages++;
      if (rows.length < limit) break;
      await sleep(100);
    }
    if (src.kind === 'ins' && out.length) await attachIds(out, cfg, get);
    if (src.kind === 'ins') out.forEach(function (ev) {                             // sizes are all in by now, newest-first paging saw the seals first
      ev.items = ev.items.map(function (it) {
        var size = it.size != null ? it.size : (it.hash && (sizes[it.hash] != null ? sizes[it.hash] : (src.priorSizes || {})[it.hash]));
        return size != null ? { p: sizePoints(size) } : { p: 1, u: 1 };            // unseen size: 1 ticket, flagged
      });
    });
    return { out: out, xfers: xfers, heads: heads, top: top, sawKnown: sawKnown, pages: pages, sizes: sizes };
  }

  function blank(a, ms, nDraws) { return { addr: a, first: ms, last: ms, n: {}, w: Array.apply(null, Array(nDraws)).map(function () { return {}; }), tx: {}, g: {} }; }

  // Fold new events into the per-address records (works for a first full run and for later increments).
  function apply(by, kind, ev, drawMs, touched, rc) {
    var a = by[ev.addr] || (by[ev.addr] = blank(ev.addr, ev.ms, drawMs.length));
    touched[ev.addr] = 1;
    a.first = Math.min(a.first, ev.ms); a.last = Math.max(a.last, ev.ms);
    if (kind === 'ch') { var g = ev.game == null ? ev.tx : ev.game; a.g[g] = a.g[g] ? Math.min(a.g[g], ev.ms) : ev.ms; return; }
    if (kind === 'ins' && ev.items) {                                           // one count per inscription, plus its size tickets in inp
      var cnt = ev.items.length, pts = ev.items.reduce(function (t, it) { return t + it.p; }, 0), unk = ev.items.reduce(function (t, it) { return t + (it.u || 0); }, 0);
      var add = function (o) { o.ins = (o.ins || 0) + cnt; o.inp = (o.inp || 0) + pts; if (unk) o.inu = (o.inu || 0) + unk; };
      add(a.n); drawMs.forEach(function (d, i) { if (ev.ms <= d) add(a.w[i]); });
      if (!a.tx.ins) a.tx.ins = ev.tx;
      if (rc && ev.ids) ev.items.forEach(function (it, k) { rc.push({ id: ev.ids[k], a: ev.addr, ms: ev.ms, p: it.p, u: it.u || 0, tx: ev.tx }); });
      return;
    }
    a.n[kind] = (a.n[kind] || 0) + 1;
    drawMs.forEach(function (d, i) { if (ev.ms <= d) a.w[i][kind] = (a.w[i][kind] || 0) + 1; });
    if (!a.tx[kind]) a.tx[kind] = ev.tx;
  }
  function finishChess(a, drawMs) {
    var games = Object.keys(a.g || {});
    if (!games.length) { delete a.n.ch; a.w.forEach(function (w) { delete w.ch; }); return; }
    a.n.ch = games.length;
    drawMs.forEach(function (d, i) { var c = games.filter(function (g) { return a.g[g] <= d; }).length; if (c) a.w[i].ch = c; else delete a.w[i].ch; });
  }

  async function scan(cfg, get, prev) {
    var drawMs = cfg.draws.map(Date.parse), by = prev ? prev.addrs : {}, touched = {}, status = [], heads = {}, top = {}, calls = {}, needFull = false;
    var queue = cfg.sources.slice(), results = [], sizes = Object.assign({}, prev && prev.sizes), rc = ((prev && prev.rc) || []).slice();
    cfg.sources.forEach(function (s) { s.priorSizes = sizes; });
    async function worker() {
      while (queue.length) {
        var s = queue.shift();
        try {
          var known = prev && prev.heads && prev.heads[s.id] ? prev.heads[s.id] : null;
          var r = await pullSource(s, cfg, get, known);
          // A previous newest transaction that was inside the window must still be there, or the chain moved under us.
          if (known && known.length && !r.sawKnown && prev.top[s.id] >= Date.parse(cfg.cutoff)) needFull = true;
          results.push({ s: s, r: r });
        } catch (e) {
          if (s.optional && /\b404\b/.test(String(e.message || e))) results.push({ s: s, r: { out: [], heads: [], top: 0, sawKnown: true, pages: 0 }, nf: true });
          else results.push({ s: s, err: String(e.message || e) });
        }
      }
    }
    await Promise.all([worker(), worker(), worker()]);
    if (needFull) return { needFull: true };
    cfg.sources.forEach(function (s) {
      var x = results.filter(function (z) { return z.s === s; })[0];
      if (!x || x.err) { status.push({ kind: s.kind, label: s.label, ok: false, note: x ? x.err : 'not read' }); if (prev && prev.heads && prev.heads[s.id]) { heads[s.id] = prev.heads[s.id]; top[s.id] = prev.top[s.id]; calls[s.id] = (prev.calls || {})[s.id] || 0; } return; }
      if (x.r.sizes) Object.assign(sizes, x.r.sizes);
      x.r.out.slice().reverse().forEach(function (ev) { if (ev.addr) apply(by, s.kind, ev, drawMs, touched, rc); });   // oldest first
      (x.r.xfers || []).slice().reverse().forEach(function (xf) { moveMint(by, rc, xf, drawMs, touched, cfg.frozenDraws || 0); });          // after the mints, so a same-block transfer finds its mint
      var had = prev && prev.heads && prev.heads[s.id];
      heads[s.id] = x.r.out.length || (x.r.xfers || []).length || !had ? x.r.heads : prev.heads[s.id];
      top[s.id] = x.r.out.length || (x.r.xfers || []).length || !had ? x.r.top : prev.top[s.id];
      calls[s.id] = ((prev && prev.calls && prev.calls[s.id]) || 0) + x.r.out.reduce(function (t, ev) { return t + (ev.items ? ev.items.length : 1); }, 0);   // an inscription batch counts each item
      var st = { kind: s.kind, label: s.label, ok: true, calls: calls[s.id] }; if (x.nf) st.note = 'not deployed'; status.push(st);
    });
    var failed = status.some(function (s) { return !s.ok; });
    Object.keys(touched).forEach(function (k) { finishChess(by[k], drawMs); });
    var keepFrom = Date.now() - RC_KEEP_MS;
    return { by: by, touched: touched, status: status, heads: heads, top: top, calls: calls, failed: failed, sizes: sizes, rc: rc.filter(function (r) { return r.ms >= keepFrom; }) };
  }

  async function run(userCfg, fetchFn, prevState, opts) {
    var cfg = Object.assign({}, DEFAULT_CFG, userCfg || {}); cfg.sources = (userCfg && userCfg.sources ? userCfg.sources : DEFAULT_CFG.sources).map(function (x) { return Object.assign({}, x); });
    var get = fetchFn || async function (u) { var r = await fetch(u); if (!r.ok) throw new Error(u + ' -> ' + r.status); return r.json(); };
    var now = Date.now(), mode = 'incremental', prev = prevState && prevState.v === 2 && prevState.att === ATT && prevState.cutoff === cfg.cutoff && JSON.stringify(prevState.draws || []) === JSON.stringify(cfg.draws || []) ? prevState : null;   // another cutoff or draw list means the saved counts no longer fit
    if (prev && ((opts && opts.full) || now - Date.parse(prev.full) > cfg.fullEveryMs)) prev = null;
    var res = prev ? await scan(cfg, get, JSON.parse(JSON.stringify(prev))) : null;
    if (!res || res.needFull) { mode = 'full'; res = await scan(cfg, get, null); }
    var list = Object.keys(res.by).map(function (k) { var a = res.by[k]; return { addr: a.addr, first: a.first, last: a.last, n: a.n, w: a.w, tx: a.tx }; });
    list.sort(function (x, y) { return y.last - x.last; });
    var state = { v: 2, att: ATT, cutoff: cfg.cutoff, draws: cfg.draws, at: new Date(now).toISOString(), full: mode === 'full' ? new Date(now).toISOString() : prev.full, heads: res.heads, top: res.top, calls: res.calls, sizes: res.sizes, rc: res.rc, addrs: res.by };
    var changed = mode === 'full' ? list.map(function (a) { return a.addr; }) : Object.keys(res.touched);
    return { at: new Date(now).toISOString(), mode: mode, cutoff: cfg.cutoff, draws: cfg.draws, status: res.status, failed: res.failed, addresses: list, changed: changed, state: res.failed ? (prevState || null) : state };
  }

  var api = { run: run, pullSource: pullSource, DEFAULT_CFG: DEFAULT_CFG, sizePoints: sizePoints };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.XtrataLedger = api;
})(typeof window !== 'undefined' ? window : globalThis);
