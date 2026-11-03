// Forever Twins preservation census — browser harness (v1)
// Runs inside a gamma.io tab (same-origin Gamma API; Hiro + gateways via CORS / image loads).
// Read-only: GET requests, Hiro read-only calls, image loads. No signing, no writes.
(() => {
  if (!window.__wsleep) {
    const w = new Worker(URL.createObjectURL(new Blob(['onmessage=e=>setTimeout(()=>postMessage(e.data.id), e.data.ms)'], { type: 'text/javascript' })));
    const cbs = {}; let k = 0; w.onmessage = (e) => { const f = cbs[e.data]; delete cbs[e.data]; f && f(); };
    window.__wsleep = (ms) => new Promise((r) => { const id = ++k; cbs[id] = r; w.postMessage({ id, ms }); });
  }
  const HIRO = 'https://api.hiro.so';
  const LS_KEY = 'ftcensus-v1';
  const FT = (window.FT = window.FT || {});
  FT.results = FT.results || JSON.parse(localStorage.getItem(LS_KEY) || '{}');
  FT.cidCache = FT.cidCache || {};
  FT.log = FT.log || [];
  const save = () => { try { localStorage.setItem(LS_KEY, JSON.stringify(FT.results)); } catch (e) { FT.log.push('save fail ' + e.message); } };
  // Timers via a worker: hidden tabs throttle page timers to ~1/min, workers are not throttled.
  const sleep = (ms) => (window.__wsleep ? window.__wsleep(ms) : new Promise((r) => setTimeout(r, ms)));
  const withTimeout = (p, ms, label = 'timeout') => Promise.race([p, sleep(ms).then(() => { throw new Error(label); })]);

  // ---------- Clarity value decoding ----------
  function decodeCV(hex) {
    const b = hex.startsWith('0x') ? hex.slice(2) : hex; let i = 0;
    const rd = (n) => { const s = b.slice(i, i + n * 2); i += n * 2; return s; };
    const u32 = () => parseInt(rd(4), 16);
    const txt = (h) => { try { return decodeURIComponent(h.replace(/(..)/g, '%$1')); } catch { return h.replace(/(..)/g, (m) => String.fromCharCode(parseInt(m, 16))); } };
    const val = () => {
      const t = parseInt(rd(1), 16);
      switch (t) {
        case 0: case 1: return { t: t ? 'uint' : 'int', v: BigInt('0x' + rd(16)).toString() };
        case 2: { const n = u32(); return { t: 'buff', v: rd(n) }; }
        case 3: return { t: 'bool', v: true }; case 4: return { t: 'bool', v: false };
        case 5: rd(21); return { t: 'principal' };
        case 6: { rd(21); const n = parseInt(rd(1), 16); rd(n); return { t: 'principal' }; }
        case 7: return { t: 'ok', v: val() }; case 8: return { t: 'err', v: val() };
        case 9: return { t: 'none' }; case 10: return { t: 'some', v: val() };
        case 11: { const n = u32(); const a = []; for (let k = 0; k < n; k++) a.push(val()); return { t: 'list', v: a }; }
        case 12: { const n = u32(); const o = {}; for (let k = 0; k < n; k++) { const l = parseInt(rd(1), 16); const name = txt(rd(l)); o[name] = val(); } return { t: 'tuple', v: o }; }
        case 13: case 14: { const n = u32(); return { t: 'str', v: txt(rd(n)) }; }
        default: return { t: '?' + t };
      }
    };
    return val();
  }
  const unwrap = (cv) => { while (cv && ['ok', 'some'].includes(cv.t)) cv = cv.v; return cv; };
  const uintArg = (n) => '0x01' + BigInt(n).toString(16).padStart(32, '0');

  // ---------- Hiro ----------
  let lastHiro = 0;
  async function hiro(path, opts = {}, tries = 4) {
    for (let k = 0; k < tries; k++) {
      const wait = Math.max(0, lastHiro + (FT.hiroGapMs || 350) - Date.now()); if (wait) await sleep(wait);
      lastHiro = Date.now();
      try {
        const r = await withTimeout(fetch(HIRO + path, opts), 20000);
        if (r.status === 429) { await sleep(5000 * (k + 1)); continue; }
        if (!r.ok) return { status: r.status };
        return { status: 200, json: await r.json() };
      } catch (e) { if (k === tries - 1) return { status: 0, err: e.message }; await sleep(1500); }
    }
    return { status: 429 };
  }
  async function readOnly(cid, fn, args = []) {
    const [addr, name] = cid.split('.');
    const r = await hiro(`/v2/contracts/call-read/${addr}/${name}/${fn}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ sender: addr, arguments: args }) });
    if (!r.json) return { err: 'http' + r.status };
    if (!r.json.okay) return { err: (r.json.cause || 'not okay').slice(0, 80) };
    try { return { cv: decodeCV(r.json.result) }; } catch (e) { return { err: 'decode' }; }
  }

  // ---------- URL helpers ----------
  const cidRe = /(?:ipfs:\/\/(?:ipfs\/)?|\/ipfs\/)((?:Qm[1-9A-HJ-NP-Za-km-z]{44})|(?:b[a-z2-7]{50,}))(\/[^?#]*)?/;
  const subCidRe = /^https?:\/\/((?:Qm[1-9A-HJ-NP-Za-km-z]{44})|(?:b[a-z2-7]{50,}))\.ipfs\.[^/]+(\/[^?#]*)?/;
  function ipfsParts(u) { if (!u) return null; let m = u.match(cidRe); if (m) return { cid: m[1], path: m[2] || '' }; m = u.match(subCidRe); if (m) return { cid: m[1], path: m[2] || '' }; return null; }
  function category(u) {
    if (!u) return 'none';
    if (u.startsWith('data:')) return 'data-uri';
    if (u.startsWith('ar://') || /arweave\.net|ardrive|arweave\.dev/.test(u)) return 'arweave';
    if (/^https?:\/\/[^/]*(images\.gamma\.io)/.test(u)) return ipfsParts(u) ? 'ipfs(gamma-cache)' : 'gamma-cache';
    if (ipfsParts(u)) { if (u.startsWith('ipfs://')) return 'ipfs'; if (/mypinata\.cloud|pinata\.cloud/.test(u)) return 'ipfs(pinata-gw)'; return 'ipfs(gw)'; }
    if (/amazonaws\.com/.test(u)) return 's3';
    if (/storage\.googleapis\.com|firebasestorage/.test(u)) return 'gcs';
    if (/cloudfront\.net/.test(u)) return 'cloudfront';
    if (/stacksart\.com/.test(u)) return 'stacksart';
    if (/^https?:/.test(u)) return 'web';
    return 'other';
  }
  const host = (u) => { try { return new URL(u).host; } catch { return u ? u.slice(0, 30) : ''; } };
  function candidates(u) {
    const p = ipfsParts(u); const out = [];
    if (u && !u.startsWith('ipfs://') && !u.startsWith('ar://')) out.push(['as-written', u]);
    if (p) {
      out.push(['filebase', `https://ipfs.filebase.io/ipfs/${p.cid}${p.path}`]);
      out.push(['pinata-public', `https://gateway.pinata.cloud/ipfs/${p.cid}${p.path}`]);
      out.push(['gamma-pinata', `https://stxnft.mypinata.cloud/ipfs/${p.cid}${p.path}`]);
    }
    if (u && u.startsWith('ar://')) out.push(['arweave.net', 'https://arweave.net/' + u.slice(5)]);
    return out;
  }

  // ---------- Probes ----------
  const imgQueue = []; let imgActive = 0;
  function testImg(u, ms = 20000) {
    return new Promise((res) => {
      const run = () => {
        imgActive++; const i = new Image(); let done = false;
        const fin = (v) => { if (done) return; done = true; imgActive--; i.src = ''; res(v); const nx = imgQueue.shift(); if (nx) nx(); };
        sleep(ms).then(() => fin('timeout'));
        i.onload = () => fin(i.naturalWidth > 1 ? 'ok' : 'tiny');
        i.onerror = () => fin('error');
        i.src = u;
      };
      if (imgActive < (FT.imgConcurrency || 6)) run(); else imgQueue.push(run);
    });
  }
  async function probe(u, ms = 20000) { // reachability without CORS
    try { await withTimeout(fetch(u, { mode: 'no-cors' }), ms); return 'responded'; } catch (e) { return e.message === 'timeout' ? 'timeout' : 'neterr'; }
  }
  async function getJson(u, ms = 12000) {
    if (u.startsWith('data:')) {
      try { const [h, d] = u.split(','); const s = h.includes('base64') ? atob(d) : decodeURIComponent(d); return { st: 'ok', json: JSON.parse(s) }; } catch { return { st: 'baddata' }; }
    }
    try {
      const r = await withTimeout(fetch(u), ms);
      if (!r.ok) return { st: 'http' + r.status };
      const t = await r.text();
      try { return { st: 'ok', json: JSON.parse(t) }; } catch { return { st: /<html/i.test(t.slice(0, 500)) ? 'html' : 'notjson' }; }
    } catch (e) {
      if (e.message === 'timeout') return { st: 'timeout' };
      const p = await probe(u, 6000);
      return { st: p === 'responded' ? 'cors-blocked' : p };
    }
  }
  async function providers(cid) {
    if (FT.cidCache[cid] !== undefined) return FT.cidCache[cid];
    try {
      const r = await withTimeout(fetch(`https://delegated-ipfs.dev/routing/v1/providers/${cid}`, { headers: { accept: 'application/json' } }), 20000);
      if (r.status === 404) return (FT.cidCache[cid] = { n: 0 });
      const j = await r.json(); const ps = j.Providers || [];
      const who = [...new Set(ps.map((p) => ((p.Addrs || []).join(' ').match(/(pinata|filebase|nft\.storage|web3\.storage|storacha|4everland|fleek|infura|cloudflare|lighthouse)/i) || ['other'])[0].toLowerCase()))];
      return (FT.cidCache[cid] = { n: ps.length, who });
    } catch (e) { return (FT.cidCache[cid] = { n: -1, err: e.message }); }
  }

  // ---------- Source analysis ----------
  function analyzeSource(src) {
    const nft = (src.match(/define-non-fungible-token\s+([^\s)]+)/) || [])[1] || null;
    const i = src.indexOf('(get-token-uri'); let fn = '';
    if (i >= 0) { const j = src.indexOf('(define-', i + 10); fn = src.slice(i, j > 0 ? j : i + 1500); }
    let style = 'missing';
    if (fn) {
      if (/data:/.test(fn)) style = 'data-uri';
      else if (/concat/.test(fn)) style = 'concat';
      else if (/map-get\?/.test(fn)) style = 'per-token-map';
      else if (/contract-call\?/.test(fn)) style = 'delegated';
      else style = 'constant-or-template';
    }
    const urls = [...new Set((src.match(/(https?:\/\/|ipfs:\/\/|ar:\/\/)[^\s"'()]+/g) || []))];
    const mutable = /define-public\s+\((set|update|change)-[a-z-]*(uri|metadata)[a-z-]*/i.test(src);
    const freezeFn = /freeze|frozen|lock-metadata|metadata-lock/i.test(src);
    const sig = {
      svg: (src.match(/<svg/gi) || []).length,
      dataUri: (src.match(/data:(image|application|text)/gi) || []).length,
      b64: /base64/i.test(src),
      svgFn: /define-read-only\s+\([a-z-]*svg/i.test(src),
      bigBuff: /\(buff\s+(\d{5,})\)/.test(src),
      inscr: /inscri|xtrata|ordinal/i.test(src),
    };
    return { nft, style, tmplId: /\{id\}/.test(src), mutable, freezeFn, urls: urls.slice(0, 6), sig, len: src.length };
  }

  // ---------- Per-collection run ----------
  async function runCollection(row, cfg = {}) {
    const nIdx = cfg.nIdx || 16, nTok = cfg.nTok || 4;
    const id = row.id; const [addr, name] = id.split('.');
    const out = { r: row.r, id, n: row.n, v: row.v, at: new Date().toISOString() };
    // contract source
    const s = await hiro(`/v2/contracts/source/${addr}/${name}?proof=0`);
    out.src = s.json ? analyzeSource(s.json.source || '') : { err: 'http' + s.status };
    const last = await readOnly(id, 'get-last-token-id');
    out.last = last.cv ? (unwrap(last.cv) || {}).v || null : null;
    // Gamma index sample
    let items = [];
    try {
      const j = await withTimeout(fetch(`/api/get-stacks-nfts?a=&contract_id_or_slug=${encodeURIComponent(id)}&sort=`).then((r) => r.json()), 25000);
      items = (j.items || []).slice(0, nIdx);
    } catch (e) { out.idxErr = e.message; }
    const idx = await Promise.all(items.map(async (it) => {
      const u = it.asset_content?.content_url || ''; const ct = it.asset_content?.content_type || '';
      const tid = (it.id || '').split('_').pop();
      let res;
      if (!u) res = 'nourl';
      else if (/video|html|audio|model|gltf/i.test(ct)) res = 'nonimg:' + (await probe(u));
      else res = await testImg(u);
      return { tid, u, cat: category(u), res, ct };
    }));
    const tally = (arr, k) => arr.reduce((a, x) => ((a[x[k]] = (a[x[k]] || 0) + 1), a), {});
    out.idx = {
      n: idx.length, ok: idx.filter((x) => x.res === 'ok' || x.res === 'nonimg:responded').length,
      cats: tally(idx, 'cat'),
      failCats: tally(idx.filter((x) => !(x.res === 'ok' || x.res === 'nonimg:responded')), 'cat'),
      hosts: tally(idx.map((x) => ({ h: host(x.u) })), 'h'),
      eg: idx.slice(0, 3).map((x) => [x.tid, x.u.slice(0, 120), x.res]),
      egFail: idx.filter((x) => !(x.res === 'ok' || x.res === 'nonimg:responded')).slice(0, 2).map((x) => [x.tid, x.u.slice(0, 120), x.res]),
    };
    // contract layer
    let tids = idx.map((x) => x.tid).filter((t) => /^\d+$/.test(t));
    if (!tids.length) tids = ['1', '2', '3'];
    tids = [...new Set(tids)].slice(0, nTok);
    out.tok = []; const metaCache = {};
    for (const t of tids) {
      const rec = { t };
      const r = await readOnly(id, 'get-token-uri', [uintArg(t)]);
      if (r.err) { rec.uriErr = r.err; out.tok.push(rec); continue; }
      const v = unwrap(r.cv);
      if (!v || v.t !== 'str') { rec.uriErr = 'type:' + (v ? v.t : 'null'); out.tok.push(rec); continue; }
      let uri = v.v.replace('{id}', t); rec.uri = uri.slice(0, 160); rec.uriCat = category(uri);
      // metadata: as written first, then alternates
      let meta = null; rec.meta = {};
      if (metaCache[uri]) { rec.meta = { ...metaCache[uri].st, cached: 1 }; meta = metaCache[uri].json; }
      else {
        FT.deadHosts = FT.deadHosts || {};
        for (const [lab, cu] of candidates(uri).concat(uri.startsWith('data:') ? [['inline', uri]] : [])) {
          const h = host(cu);
          if (lab === 'as-written' && FT.deadHosts[h] >= 2) { rec.meta[lab] = 'host-dead(skipped)'; continue; }
          const g = await getJson(cu); rec.meta[lab] = g.st;
          if (lab === 'as-written' && (g.st === 'neterr' || g.st === 'timeout')) FT.deadHosts[h] = (FT.deadHosts[h] || 0) + 1;
          if (g.st === 'ok') { meta = g.json; break; }
        }
        metaCache[uri] = { st: rec.meta, json: meta };
      }
      if (meta) {
        const img = meta.image || meta.image_url || meta.imageUrl || meta.animation_url || (meta.properties && meta.properties.image) || '';
        rec.img = String(img).slice(0, 160); rec.imgCat = category(img); rec.imgTest = {};
        for (const [lab, cu] of candidates(img).concat(String(img).startsWith('data:') ? [['inline', img]] : [])) {
          const res = await testImg(cu); rec.imgTest[lab] = res; if (res === 'ok') break;
        }
        rec.sameImgAsIndex = !!idx.find((x) => x.tid === t && ipfsParts(x.u) && ipfsParts(img) && ipfsParts(x.u).cid === ipfsParts(img).cid);
      }
      out.tok.push(rec);
    }
    // IPFS providers for roots seen
    const cids = new Set();
    [...idx.map((x) => x.u), ...out.tok.map((x) => x.uri), ...out.tok.map((x) => x.img)].forEach((u) => { const p = ipfsParts(u || ''); if (p) cids.add(p.cid); });
    out.cids = {};
    for (const c of [...cids].slice(0, 4)) out.cids[c] = await providers(c);
    FT.results[id] = out; save();
    return out;
  }

  async function runList(rows, cfg = {}) {
    FT.running = true; FT.progress = { total: rows.length, done: 0, started: new Date().toISOString() };
    for (const row of rows) {
      if (FT.stop) break;
      if (FT.results[row.id] && !cfg.force) { FT.progress.done++; continue; }
      FT.progress.current = row.n;
      try { await runCollection(row, cfg); } catch (e) { FT.results[row.id] = { r: row.r, id: row.id, n: row.n, v: row.v, fatal: e.message }; save(); }
      FT.progress.done++;
    }
    FT.running = false; FT.progress.finished = new Date().toISOString();
  }

  Object.assign(FT, { runCollection, runList, analyzeSource, decodeCV, category, ipfsParts, testImg, getJson, providers, readOnly, version: 'v1.3' });
  return 'FT harness loaded ' + FT.version + '; cached results: ' + Object.keys(FT.results).length;
})();
