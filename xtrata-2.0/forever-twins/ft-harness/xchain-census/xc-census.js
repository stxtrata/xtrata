// Forever Twins cross-chain preservation census: browser harness (v1)
// Paste into any https tab of the Claude desktop app's built-in browser (e.g. https://api.tzkt.io/v1/head).
// Read-only: JSON-RPC eth_call / eth_getCode, public indexer GETs, image loads. No keys are sent anywhere
// except the optional Alchemy / OpenSea keys you set yourself in XC.keys.
(() => {
  if (!window.__wsleep) {
    const w = new Worker(URL.createObjectURL(new Blob(['onmessage=e=>setTimeout(()=>postMessage(e.data.id), e.data.ms)'], { type: 'text/javascript' })));
    const cbs = {}; let k = 0; w.onmessage = (e) => { const f = cbs[e.data]; delete cbs[e.data]; f && f(); };
    window.__wsleep = (ms) => new Promise((r) => { const id = ++k; cbs[id] = r; w.postMessage({ id, ms }); });
  }
  const sleep = window.__wsleep;
  const withTimeout = (p, ms, label = 'timeout') => Promise.race([p, sleep(ms).then(() => { throw new Error(label); })]);
  const LS = 'xccensus-v1';
  const XC = (window.XC = window.XC || {});
  const saved = (() => { try { return JSON.parse(localStorage.getItem(LS) || '{}'); } catch { return {}; } })();
  XC.triage = XC.triage || saved.triage || {};
  XC.results = XC.results || saved.results || {};
  XC.cidCache = XC.cidCache || {};
  XC.keys = XC.keys || { alchemy: 'demo', opensea: null };
  XC.log = XC.log || [];
  const save = () => { try { localStorage.setItem(LS, JSON.stringify({ triage: XC.triage, results: XC.results })); } catch (e) { XC.log.push('save: ' + e.message); } };

  const CHAINS = {
    ethereum: { rpc: 'https://ethereum-rpc.publicnode.com', alchemy: 'eth-mainnet', opensea: 'ethereum' },
    base: { rpc: 'https://base-rpc.publicnode.com', alchemy: 'base-mainnet', opensea: 'base' },
    polygon: { rpc: 'https://polygon-bor-rpc.publicnode.com', alchemy: 'polygon-mainnet', opensea: 'matic' },
    arbitrum: { rpc: 'https://arbitrum-one-rpc.publicnode.com', alchemy: 'arb-mainnet', opensea: 'arbitrum' },
    optimism: { rpc: 'https://optimism-rpc.publicnode.com', alchemy: 'opt-mainnet', opensea: 'optimism' },
    tezos: { tzkt: 'https://api.tzkt.io' },
  };
  XC.CHAINS = CHAINS;
  // CoinGecko asset_platform_id -> our chain name
  const CG_PLATFORM = { ethereum: 'ethereum', base: 'base', 'polygon-pos': 'polygon', 'arbitrum-one': 'arbitrum', 'optimistic-ethereum': 'optimism' };

  // ---------- polite fetch: one gap per host ----------
  const lastHit = {}; const GAP = { 'api.coingecko.com': 2500, 'eth-mainnet.g.alchemy.com': 400, default: 150 };
  async function pfetch(url, opts = {}, ms = 20000, tries = 3) {
    const h = new URL(url).host; const gap = GAP[h] ?? (h.endsWith('alchemy.com') ? 400 : GAP.default);
    for (let k = 0; k < tries; k++) {
      const wait = Math.max(0, (lastHit[h] || 0) + gap - Date.now()); lastHit[h] = Date.now() + wait; if (wait) await sleep(wait);
      try {
        const r = await withTimeout(fetch(url, opts), ms);
        if (r.status === 429) { await sleep(4000 * (k + 1)); continue; }
        return r;
      } catch (e) { if (k === tries - 1) throw e; await sleep(1500); }
    }
    throw new Error('429');
  }

  // ---------- EVM ----------
  let rpcId = 0;
  async function rpc(chain, method, params) {
    const r = await pfetch(CHAINS[chain].rpc, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: ++rpcId, method, params }) });
    const j = await r.json(); if (j.error) throw new Error('rpc:' + (j.error.message || '').slice(0, 60)); return j.result;
  }
  const u256 = (n) => BigInt(n).toString(16).padStart(64, '0');
  const ethCall = (chain, to, data) => rpc(chain, 'eth_call', [{ to, data }, 'latest']);
  function decodeString(hex) {
    if (!hex || hex === '0x') return null; const b = hex.slice(2);
    try {
      const off = parseInt(b.slice(0, 64), 16) * 2; const len = parseInt(b.slice(off, off + 64), 16);
      const data = b.slice(off + 64, off + 64 + len * 2);
      return new TextDecoder().decode(new Uint8Array(data.match(/../g)?.map((x) => parseInt(x, 16)) || []));
    } catch { return null; }
  }
  const decodeUint = (hex) => { try { return hex && hex !== '0x' ? BigInt(hex).toString() : null; } catch { return null; } };
  const SEL = { tokenURI: '0xc87b56dd', uri: '0x0e89341c', totalSupply: '0x18160ddd', supportsInterface: '0x01ffc9a7', name: '0x06fdde03', owner: '0x8da5cb5b' };
  const MUTATORS = { '55f804b3': 'setBaseURI', '162094c4': 'setTokenURI', '02fe5305': 'setURI', '30176e13': 'setBaseTokenURI', '862440e2': 'setURI(id)', '99e0dd7c': 'setTokenURIPrefix', '931688cb': 'updateBaseURI', 'fd4fe8a8': 'setMetadataRenderer', '56d3163d': 'setRenderer' };
  const FREEZERS = { d111515d: 'freezeMetadata', '989bdbb6': 'lockMetadata' };
  async function evmInfo(chain, addr) {
    const info = { chain, addr };
    try {
      const code = await rpc(chain, 'eth_getCode', [addr, 'latest']);
      info.codeBytes = (code.length - 2) / 2;
      info.minimalProxy = /363d3d373d3d3d363d73/.test(code);
      const impl = await rpc(chain, 'eth_getStorageAt', [addr, '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc', 'latest']);
      info.upgradeable = !!impl && !/^0x0*$/.test(impl);
      if (info.upgradeable) info.impl = '0x' + impl.slice(-40);
      let scan = code;
      if (info.upgradeable) { try { scan = await rpc(chain, 'eth_getCode', [info.impl, 'latest']); } catch {} }
      info.mutators = Object.entries(MUTATORS).filter(([s]) => scan.includes('63' + s)).map(([, n]) => n);
      info.freezers = Object.entries(FREEZERS).filter(([s]) => scan.includes('63' + s)).map(([, n]) => n);
    } catch (e) { info.codeErr = e.message; }
    const tryCall = async (data) => { try { return await ethCall(chain, addr, data); } catch { return null; } };
    const is721 = await tryCall(SEL.supportsInterface + '80ac58cd' + '0'.repeat(56));
    const is1155 = await tryCall(SEL.supportsInterface + 'd9b67a26' + '0'.repeat(56));
    const isTrue = (h) => { try { return !!h && h !== '0x' && BigInt(h) === 1n; } catch { return false; } };
    info.kind = isTrue(is1155) ? '1155' : (isTrue(is721) ? '721' : 'unknown');
    info.name = decodeString(await tryCall(SEL.name));
    info.totalSupply = decodeUint(await tryCall(SEL.totalSupply));
    return info;
  }
  async function evmTokenUri(chain, addr, id, kind) {
    const order = kind === '1155' ? ['uri', 'tokenURI'] : ['tokenURI', 'uri'];
    let last;
    for (const f of order) {
      try {
        const s = decodeString(await ethCall(chain, addr, SEL[f] + u256(id)));
        if (s) return { uri: s.replace(/\{id\}/gi, u256(id)), via: f };
      } catch (e) { last = e.message; }
    }
    return { err: last || 'no uri' };
  }
  async function alchemyIds(chain, addr, n) {
    if (!XC.keys.alchemy || !CHAINS[chain].alchemy) return [];
    try {
      const r = await pfetch(`https://${CHAINS[chain].alchemy}.g.alchemy.com/nft/v3/${XC.keys.alchemy}/getNFTsForContract?contractAddress=${addr}&withMetadata=false&limit=100`);
      const j = await r.json(); const ids = (j.nfts || []).map((x) => x.tokenId);
      return spread(ids, n);
    } catch { return []; }
  }
  async function alchemyMeta(chain, addr, id) {
    if (!XC.keys.alchemy || !CHAINS[chain].alchemy) return null;
    try {
      const r = await pfetch(`https://${CHAINS[chain].alchemy}.g.alchemy.com/nft/v3/${XC.keys.alchemy}/getNFTMetadata?contractAddress=${addr}&tokenId=${id}&refreshCache=false`);
      if (!r.ok) return { err: 'http' + r.status };
      const j = await r.json();
      return { cached: j.image?.cachedUrl || j.image?.pngUrl || null, original: j.image?.originalUrl || null, tokenUri: j.tokenUri || j.raw?.tokenUri || null, error: j.raw?.error || null, coll: j.contract?.openSeaMetadata?.collectionName || null };
    } catch (e) { return { err: e.message }; }
  }
  async function openseaImage(chain, addr, id) {
    if (!XC.keys.opensea || !CHAINS[chain].opensea) return null;
    try {
      const r = await pfetch(`https://api.opensea.io/api/v2/chain/${CHAINS[chain].opensea}/contract/${addr}/nfts/${id}`, { headers: { 'x-api-key': XC.keys.opensea } });
      const j = await r.json(); return j.nft?.display_image_url || j.nft?.image_url || null;
    } catch { return null; }
  }

  // ---------- Tezos ----------
  async function tzCount(kt) { const r = await pfetch(`${CHAINS.tezos.tzkt}/v1/tokens/count?contract=${kt}`); return +(await r.text()); }
  async function tzIds(kt, n, filter = '') {
    const total = await tzCount(kt); const out = new Set();
    for (let k = 0; k < n * 2 && out.size < n; k++) {
      const off = Math.floor((k / (n * 2)) * Math.max(total - 1, 0));
      const r = await pfetch(`${CHAINS.tezos.tzkt}/v1/tokens?contract=${kt}&select=tokenId&limit=1&offset=${off}${filter}`);
      const j = await r.json(); if (j[0] != null) out.add(String(j[0]));
    }
    return { total, ids: [...out] };
  }
  const hexToUtf8 = (h) => { try { return new TextDecoder().decode(new Uint8Array(h.match(/../g).map((x) => parseInt(x, 16)))); } catch { return null; } };
  async function tzPointer(kt, id) { // the on-chain pointer, straight from the token_metadata big map
    try {
      const r = await pfetch(`${CHAINS.tezos.tzkt}/v1/contracts/${kt}/bigmaps/token_metadata/keys/${id}`);
      if (!r.ok) return { err: 'bigmap http' + r.status };
      const j = await r.json(); const info = j.value?.token_info || {};
      if (info['']) return { uri: hexToUtf8(info['']) };
      return { inline: Object.fromEntries(Object.entries(info).map(([k, v]) => [k, hexToUtf8(v)])) };
    } catch (e) { return { err: e.message }; }
  }
  async function tzIndexMeta(kt, id) { // TzKT's cached copy of the metadata JSON (indexer layer)
    try { const r = await pfetch(`${CHAINS.tezos.tzkt}/v1/tokens?contract=${kt}&tokenId=${id}&select=metadata`); const j = await r.json(); return j[0] ? { metadata: j[0] } : null; } catch { return null; }
  }

  // ---------- URL helpers ----------
  const cidRe = /(?:ipfs:\/\/(?:ipfs\/)?|\/ipfs\/)((?:Qm[1-9A-HJ-NP-Za-km-z]{44})|(?:b[a-z2-7]{50,}))(\/[^?#]*)?/;
  const subCidRe = /^https?:\/\/((?:Qm[1-9A-HJ-NP-Za-km-z]{44})|(?:b[a-z2-7]{50,}))\.ipfs\.[^/]+(\/[^?#]*)?/;
  function ipfsParts(u) { if (!u) return null; let m = u.match(cidRe); if (m) return { cid: m[1], path: m[2] || '' }; m = u.match(subCidRe); if (m) return { cid: m[1], path: m[2] || '' }; if (/^(Qm[1-9A-HJ-NP-Za-km-z]{44}|b[a-z2-7]{50,})/.test(u)) return { cid: u.split('/')[0], path: u.slice(u.indexOf('/') > 0 ? u.indexOf('/') : u.length) }; return null; }
  const host = (u) => { try { return new URL(u).host; } catch { return ''; } };
  const DEAD_GATEWAYS = /cloudflare-ipfs\.com|ipfs\.infura\.io|gateway\.ipfs\.io|ipfs\.fleek\.co/;
  function category(u) {
    if (!u) return 'none';
    if (u.startsWith('data:')) return 'on-chain';
    if (u.startsWith('ar://') || /arweave\.net|\.arweave\.|ardrive/.test(u)) return 'arweave';
    const p = ipfsParts(u);
    if (p) { if (u.startsWith('ipfs://') || /^(Qm|baf)/.test(u)) return 'ipfs'; if (DEAD_GATEWAYS.test(u)) return 'ipfs(dead gateway)'; return 'ipfs(gateway)'; }
    if (/amazonaws\.com|storage\.googleapis\.com|firebasestorage|cloudfront\.net|digitaloceanspaces|blob\.core\.windows/.test(u)) return 'cloud bucket';
    if (/herokuapp|vercel\.app|netlify\.app|onrender\.com|fly\.dev|railway\.app/.test(u)) return 'app host';
    if (/^https?:/.test(u)) return 'web server';
    return 'other';
  }
  const RISK = { 'on-chain': 0, arweave: 1, ipfs: 2, 'ipfs(gateway)': 3, 'web server': 4, 'cloud bucket': 4, 'app host': 5, 'ipfs(dead gateway)': 5, other: 3, none: 3 };
  function candidates(u) {
    if (!u) return [];
    if (u.startsWith('data:')) return [['inline', u]];
    const p = ipfsParts(u); const out = [];
    if (/^https?:/.test(u)) out.push(['as-written', u]);
    if (p) {
      out.push(['filebase', `https://ipfs.filebase.io/ipfs/${p.cid}${p.path}`]);
      out.push(['pinata-public', `https://gateway.pinata.cloud/ipfs/${p.cid}${p.path}`]);
    }
    if (u.startsWith('ar://')) out.push(['arweave.net', 'https://arweave.net/' + u.slice(5)]);
    return out;
  }

  // ---------- probes ----------
  const q = []; let active = 0;
  function testImg(u, ms = 25000) {
    return new Promise((res) => {
      const run = () => {
        active++; const i = new Image(); let done = false;
        const fin = (v) => { if (done) return; done = true; active--; i.src = ''; res(v); const n = q.shift(); n && n(); };
        sleep(ms).then(() => fin('timeout')); i.onload = () => fin(i.naturalWidth > 1 ? 'ok' : 'tiny'); i.onerror = () => fin('error'); i.src = u;
      };
      active < (XC.imgConcurrency || 10) ? run() : q.push(run);
    });
  }
  async function probe(u, ms = 8000) { try { await withTimeout(fetch(u, { mode: 'no-cors' }), ms); return 'responded'; } catch (e) { return e.message === 'timeout' ? 'timeout' : 'neterr'; } }
  async function headType(u, ms = 20000) { // for video / html / audio art: status + content type from the first bytes
    try { const r = await withTimeout(fetch(u, { headers: { Range: 'bytes=0-511' } }), ms); return (r.ok ? 'ok ' : 'http' + r.status + ' ') + (r.headers.get('content-type') || ''); }
    catch (e) { return e.message === 'timeout' ? 'timeout' : 'cors-or-net:' + (await probe(u)); }
  }
  async function getJson(u, ms = 15000) {
    if (u.startsWith('data:')) {
      try { const [h, d] = [u.slice(0, u.indexOf(',')), u.slice(u.indexOf(',') + 1)]; const s = h.includes('base64') ? new TextDecoder().decode(Uint8Array.from(atob(d), (c) => c.charCodeAt(0))) : decodeURIComponent(d); return { st: 'ok', json: JSON.parse(s) }; } catch { return { st: 'bad-data-uri' }; }
    }
    try {
      const r = await withTimeout(fetch(u), ms); if (!r.ok) return { st: 'http' + r.status };
      const t = await r.text(); try { return { st: 'ok', json: JSON.parse(t) }; } catch { return { st: /<html/i.test(t.slice(0, 500)) ? 'html' : 'notjson' }; }
    } catch (e) {
      if (e.message === 'timeout') return { st: 'timeout' };
      // v1.4: an http:// pointer is blocked as mixed content in an https tab, so retry it over https before judging it
      if (u.startsWith('http://') && !u.startsWith('http://localhost')) { const h = await getJson('https://' + u.slice(7), ms); if (h.st !== 'neterr') return Object.assign(h, { httpsUpgrade: true }); }
      const p = await probe(u); if (p === 'responded') return { st: 'cors-blocked' };
      if (p === 'neterr') { const d = await dnsCheck(u); if (d === 'nxdomain') return { st: 'nxdomain' }; }
      return { st: p };
    }
  }
  async function dnsCheck(u) { // v1.4: does the host still exist? (DNS over HTTPS)
    try { const h = new URL(u).hostname; const j = await (await withTimeout(fetch(`https://dns.google/resolve?name=${h}&type=A`), 10000)).json(); return j.Status === 3 ? 'nxdomain' : j.Status === 0 ? 'resolves' : 'dns' + j.Status; } catch { return 'unknown'; }
  }
  async function providers(cid) {
    if (XC.cidCache[cid]) return XC.cidCache[cid];
    try {
      const r = await withTimeout(fetch(`https://delegated-ipfs.dev/routing/v1/providers/${cid}`, { headers: { accept: 'application/json' } }), 20000);
      if (r.status === 404) return (XC.cidCache[cid] = { n: 0, who: [] });
      const j = await r.json(); const ps = j.Providers || [];
      const who = [...new Set(ps.map((p) => ((p.Addrs || []).join(' ').match(/(pinata|filebase|nft\.storage|web3\.storage|storacha|4everland|fleek|infura|cloudflare|lighthouse|quicknode)/i) || ['other'])[0].toLowerCase()))];
      return (XC.cidCache[cid] = { n: ps.length, who });
    } catch (e) { return (XC.cidCache[cid] = { n: -1, err: e.message }); }
  }
  function artFields(m) {
    if (!m || typeof m !== 'object') return {};
    const image = m.image || m.image_url || m.imageUrl || m.imageURI || m.displayUri || m.thumbnailUri || '';
    const anim = m.animation_url || m.animationUrl || m.artifactUri || '';
    return { image: String(image || ''), anim: String(anim || ''), svgInline: !!m.image_data };
  }
  async function testArt(u) { // image first, then range fetch for video / html / audio
    if (!u) return null;
    if (u.startsWith('data:')) return { via: 'inline', res: 'ok' };
    let last;
    for (const [lab, cu] of candidates(u)) {
      const r = await testImg(cu); if (r === 'ok') return { via: lab, res: 'ok' };
      const h = await headType(cu); last = lab + ':' + r + '/' + h; if (h.startsWith('ok')) return { via: lab, res: 'ok', type: h.slice(3) };
    }
    return { res: 'dead', detail: last };
  }

  const spread = (arr, n) => { if (arr.length <= n) return arr; const out = []; for (let k = 0; k < n; k++) out.push(arr[Math.floor((k * (arr.length - 1)) / Math.max(n - 1, 1))]); return [...new Set(out)]; };
  function evmFallbackIds(info, n) {
    const ts = info.totalSupply ? Number(info.totalSupply) : 0;
    if (ts > 0 && ts < 1e7) return spread(Array.from({ length: Math.min(ts, 5000) }, (_, k) => String(k + 1)), n).concat(['0']).slice(0, n + 1);
    return ['0', '1', '2', '3'];
  }

  // ---------- triage: cheap targeting pass ----------
  async function triageOne(t) {
    const key = t.chain + ':' + t.contract; const out = { key, ...t, at: new Date().toISOString() };
    try {
      if (t.chain === 'tezos') {
        const { total, ids } = await tzIds(t.contract, 2, t.filter || '');
        out.total = total; out.uris = [];
        for (const id of ids) { const p = await tzPointer(t.contract, id); out.uris.push(p.uri || (p.inline ? 'inline-metadata' : 'ERR ' + p.err)); }
      } else {
        const info = await evmInfo(t.chain, t.contract); out.info = info;
        let ids = t.ids || (await alchemyIds(t.chain, t.contract, 2)); if (!ids.length) ids = evmFallbackIds(info, 2);
        out.uris = [];
        for (const id of ids.slice(0, 3)) { const r = await evmTokenUri(t.chain, t.contract, id, info.kind); out.uris.push(r.uri ? r.uri.slice(0, 200) : 'ERR ' + r.err); if (out.uris.filter((u) => !u.startsWith('ERR')).length >= 2) break; }
      }
      const cats = out.uris.filter((u) => !u.startsWith('ERR')).map((u) => (u === 'inline-metadata' ? 'on-chain' : category(u)));
      out.cats = [...new Set(cats)];
      let score = cats.length ? Math.max(...cats.map((c) => RISK[c] ?? 3)) : 3;
      if (out.info?.upgradeable) score += 1;
      if (out.info?.mutators?.length && !out.info?.freezers?.length) score += 0.5;
      out.score = score;
    } catch (e) { out.err = e.message; out.score = 3; }
    XC.triage[key] = out; save(); return out;
  }

  // ---------- deep pass ----------
  async function deepOne(t, n = 6) {
    const key = t.chain + ':' + t.contract; const out = { key, ...t, at: new Date().toISOString(), tok: [] };
    let ids;
    if (t.chain === 'tezos') { const s = await tzIds(t.contract, n, t.filter || ''); out.total = s.total; ids = s.ids; }
    else {
      out.info = XC.triage[key]?.info?.kind ? XC.triage[key].info : await evmInfo(t.chain, t.contract);
      ids = t.ids || (await alchemyIds(t.chain, t.contract, n)); if (!ids.length) ids = evmFallbackIds(out.info, n);
    }
    const cids = new Set();
    for (const id of ids.slice(0, n)) {
      const rec = { id };
      // contract layer
      let ptr;
      if (t.chain === 'tezos') { ptr = await tzPointer(t.contract, id); rec.uri = ptr.uri || (ptr.inline ? 'inline-metadata' : null); if (ptr.err) rec.uriErr = ptr.err; }
      else { ptr = await evmTokenUri(t.chain, t.contract, id, out.info.kind); rec.uri = ptr.uri || null; if (ptr.err) rec.uriErr = ptr.err; }
      let meta = null;
      if (ptr.inline) { meta = ptr.inline; rec.meta = { inline: 'ok' }; }
      else if (rec.uri) {
        rec.uriCat = category(rec.uri); rec.meta = {};
        for (const [lab, cu] of candidates(rec.uri)) { const g = await getJson(cu); rec.meta[lab] = g.st; if (g.st === 'ok') { meta = g.json; break; } }
      }
      if (meta) {
        const a = artFields(meta); rec.img = a.image.slice(0, 200); rec.anim = a.anim.slice(0, 200);
        rec.imgCat = a.svgInline ? 'on-chain' : category(a.image || a.anim);
        rec.art = a.svgInline ? { via: 'inline', res: 'ok' } : await testArt(a.image || a.anim);
        if (a.anim && a.image && a.anim !== a.image) rec.animTest = await testArt(a.anim);
      }
      // index layer
      if (t.chain === 'tezos') {
        const im = await tzIndexMeta(t.contract, id); const a = artFields(im?.metadata);
        rec.idx = { src: 'tzkt', has: !!im?.metadata, art: a.image || a.anim ? await testArt(a.image || a.anim) : null };
        // the server blocks browser reads of its metadata: use TzKT's copy for the art address (tested at its original address)
        if (!meta && rec.meta && Object.values(rec.meta).some((v) => v === 'cors-blocked' || v === 'timeout') && (a.anim || a.image)) {
          rec.metaVia = 'indexer copy (server blocks browser reads)'; rec.img = String(a.image || '').slice(0, 200); rec.anim = String(a.anim || '').slice(0, 200);
          rec.imgCat = category(a.image || a.anim); rec.art = rec.idx.art;
        }
      } else {
        const am = await alchemyMeta(t.chain, t.contract, id);
        if (am) {
          let ia = null;
          if (am.cached) { const r = await testImg(am.cached); ia = { res: r === 'ok' ? 'ok' : 'dead', img: r }; if (r !== 'ok') { const h = await headType(am.cached); if (h.startsWith('ok')) ia = { res: 'ok', type: h.slice(3) }; } }
          rec.idx = { src: 'alchemy', cached: (am.cached || '').slice(0, 160), error: am.error, art: ia };
          // the server blocks browser reads of its metadata: test the art the indexer says the metadata names, at its original address
          if (!meta && rec.meta && Object.values(rec.meta).some((v) => v === 'cors-blocked' || v === 'timeout') && am.original) {
            rec.metaVia = 'indexer copy (server blocks browser reads)'; rec.img = am.original.slice(0, 200); rec.imgCat = category(am.original); rec.art = await testArt(am.original);
          }
        }
        const os = await openseaImage(t.chain, t.contract, id);
        if (os) rec.os = { url: os.slice(0, 160), res: await testImg(os) };
      }
      [rec.uri, rec.img, rec.anim].forEach((u) => { const p = ipfsParts(u || ''); if (p) cids.add(p.cid); });
      out.tok.push(rec);
    }
    out.cids = {}; for (const c of [...cids].slice(0, 4)) out.cids[c] = await providers(c);
    XC.results[key] = out; save(); return out;
  }

  // ---------- discovery ----------
  async function discoverCoinGecko(pages = 1, chains = Object.keys(CG_PLATFORM).map((k) => CG_PLATFORM[k])) {
    const out = [];
    for (let p = 1; p <= pages; p++) {
      const r = await pfetch(`https://api.coingecko.com/api/v3/nfts/list?order=market_cap_usd_desc&per_page=250&page=${p}`);
      const j = await r.json();
      j.forEach((x, i) => { const chain = CG_PLATFORM[x.asset_platform_id]; if (chain && chains.includes(chain) && x.contract_address) out.push({ chain, contract: x.contract_address, name: x.name, rank: (p - 1) * 250 + i + 1, source: 'coingecko-mcap' }); });
    }
    return out;
  }
  async function discoverObjkt(limit = 100) {
    const r = await pfetch('https://data.objkt.com/v3/graphql', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ query: `{ fa(limit:${limit}, order_by:{volume_total:desc_nulls_last}) { contract name volume_total items } }` }) });
    const j = await r.json();
    return (j.data?.fa || []).map((x, i) => ({ chain: 'tezos', contract: x.contract, name: x.name, rank: i + 1, items: x.items, volume_xtz: x.volume_total ? Math.round(x.volume_total / 1e6) : null, source: 'objkt-volume' }));
  }

  // ---------- runners (lanes, resumable) ----------
  async function lanes(list, fn, nLanes, doneMap) {
    XC.stop = false; const claimed = new Set(); let i = 0;
    const next = () => { while (i < list.length) { const t = list[i++]; const k = t.chain + ':' + t.contract; if (!claimed.has(k) && !doneMap[k]) { claimed.add(k); return t; } } return null; };
    await Promise.all(Array.from({ length: nLanes }, async () => { for (let t = next(); t && !XC.stop; t = next()) { try { await fn(t); } catch (e) { XC.log.push(t.contract + ': ' + e.message); } } }));
  }
  XC.runTriage = (list, nLanes = 4) => (XC.triageRun = lanes(list, triageOne, nLanes, XC.triage));
  XC.runDeep = (list, n = 6, nLanes = 3) => (XC.deepRun = lanes(list, (t) => deepOne(t, n), nLanes, XC.results));
  XC.pickTargets = (minScore = 3, max = 100) => Object.values(XC.triage).filter((x) => x.score >= minScore).sort((a, b) => b.score - a.score).slice(0, max).map(({ chain, contract, name, rank, source, why, filter }) => ({ chain, contract, name, rank, source, why, filter }));
  XC.status = () => ({ triage: Object.keys(XC.triage).length, deep: Object.keys(XC.results).length, log: XC.log.slice(-5) });
  XC.dump = () => JSON.stringify({ generated: new Date().toISOString(), version: XC.version, triage: XC.triage, results: XC.results, cidCache: XC.cidCache });
  XC.reset = () => { XC.triage = {}; XC.results = {}; save(); };
  Object.assign(XC, { dnsCheck, triageOne, deepOne, discoverCoinGecko, discoverObjkt, evmInfo, evmTokenUri, tzPointer, tzIds, alchemyMeta, category, ipfsParts, testImg, testArt, getJson, providers, version: 'xc-v1.4' });
  return 'XC harness ' + XC.version + ' loaded; triage ' + Object.keys(XC.triage).length + ', deep ' + Object.keys(XC.results).length;
})();
