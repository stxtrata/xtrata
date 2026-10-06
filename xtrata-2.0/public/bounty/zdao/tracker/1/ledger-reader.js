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

  // Pull one source newest first. Stops at a transaction it has already seen (`known`) or at the cutoff.
  async function pullSource(src, cfg, get, known) {
    var out = [], heads = [], top = 0, off = 0, limit = 50, cutMs = Date.parse(cfg.cutoff), pages = 0, stop = false, sawKnown = false;
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
        if (cc.contract_id !== src.id || src.fns.indexOf(cc.function_name) < 0) continue;
        var args = cc.function_args || [];
        if (src.kind === 'lk' && cc.function_name === 'set-liked' && args[1] && String(args[1].repr) !== 'true') continue;   // an unlike is not a ticket
        var game = null;
        if (src.kind === 'ch' && args[0]) game = src.id.split('.')[1] + '#' + String(args[0].repr || '').replace(/^u/, '');
        out.push({ addr: t.sender_address, ms: ms, tx: t.tx_id, game: game });
      }
      off += limit; pages++;
      if (rows.length < limit) break;
      await sleep(100);
    }
    return { out: out, heads: heads, top: top, sawKnown: sawKnown, pages: pages };
  }

  function blank(a, ms, nDraws) { return { addr: a, first: ms, last: ms, n: {}, w: Array.apply(null, Array(nDraws)).map(function () { return {}; }), tx: {}, g: {} }; }

  // Fold new events into the per-address records (works for a first full run and for later increments).
  function apply(by, kind, ev, drawMs, touched) {
    var a = by[ev.addr] || (by[ev.addr] = blank(ev.addr, ev.ms, drawMs.length));
    touched[ev.addr] = 1;
    a.first = Math.min(a.first, ev.ms); a.last = Math.max(a.last, ev.ms);
    if (kind === 'ch') { var g = ev.game == null ? ev.tx : ev.game; a.g[g] = a.g[g] ? Math.min(a.g[g], ev.ms) : ev.ms; return; }
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
    var queue = cfg.sources.slice(), results = [];
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
      x.r.out.slice().reverse().forEach(function (ev) { if (ev.addr) apply(by, s.kind, ev, drawMs, touched); });   // oldest first
      var had = prev && prev.heads && prev.heads[s.id];
      heads[s.id] = x.r.out.length || !had ? x.r.heads : prev.heads[s.id];
      top[s.id] = x.r.out.length || !had ? x.r.top : prev.top[s.id];
      calls[s.id] = ((prev && prev.calls && prev.calls[s.id]) || 0) + x.r.out.length;
      var st = { kind: s.kind, label: s.label, ok: true, calls: calls[s.id] }; if (x.nf) st.note = 'not deployed'; status.push(st);
    });
    var failed = status.some(function (s) { return !s.ok; });
    Object.keys(touched).forEach(function (k) { finishChess(by[k], drawMs); });
    return { by: by, touched: touched, status: status, heads: heads, top: top, calls: calls, failed: failed };
  }

  async function run(userCfg, fetchFn, prevState, opts) {
    var cfg = Object.assign({}, DEFAULT_CFG, userCfg || {}); cfg.sources = (userCfg && userCfg.sources ? userCfg.sources : DEFAULT_CFG.sources).map(function (x) { return Object.assign({}, x); });
    var get = fetchFn || async function (u) { var r = await fetch(u); if (!r.ok) throw new Error(u + ' -> ' + r.status); return r.json(); };
    var now = Date.now(), mode = 'incremental', prev = prevState && prevState.v === 2 && prevState.cutoff === cfg.cutoff && JSON.stringify(prevState.draws || []) === JSON.stringify(cfg.draws || []) ? prevState : null;   // another cutoff or draw list means the saved counts no longer fit
    if (prev && ((opts && opts.full) || now - Date.parse(prev.full) > cfg.fullEveryMs)) prev = null;
    var res = prev ? await scan(cfg, get, JSON.parse(JSON.stringify(prev))) : null;
    if (!res || res.needFull) { mode = 'full'; res = await scan(cfg, get, null); }
    var list = Object.keys(res.by).map(function (k) { var a = res.by[k]; return { addr: a.addr, first: a.first, last: a.last, n: a.n, w: a.w, tx: a.tx }; });
    list.sort(function (x, y) { return y.last - x.last; });
    var state = { v: 2, cutoff: cfg.cutoff, draws: cfg.draws, at: new Date(now).toISOString(), full: mode === 'full' ? new Date(now).toISOString() : prev.full, heads: res.heads, top: res.top, calls: res.calls, addrs: res.by };
    var changed = mode === 'full' ? list.map(function (a) { return a.addr; }) : Object.keys(res.touched);
    return { at: new Date(now).toISOString(), mode: mode, cutoff: cfg.cutoff, draws: cfg.draws, status: res.status, failed: res.failed, addresses: list, changed: changed, state: res.failed ? (prevState || null) : state };
  }

  var api = { run: run, pullSource: pullSource, DEFAULT_CFG: DEFAULT_CFG };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.XtrataLedger = api;
})(typeof window !== 'undefined' ? window : globalThis);
