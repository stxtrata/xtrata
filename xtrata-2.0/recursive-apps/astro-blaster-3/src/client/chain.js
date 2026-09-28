// ---------------------------------------------------------------------------
// Chain: read-only leaderboard access and the submit hand-off.
// The game never signs. It may read a wallet address (pilot); submitting hands the finished run to the
// Xtrata submit page (overlay when embedded on xtrata.xyz, new tab otherwise).
// ---------------------------------------------------------------------------

var GAME_VERSION = '3.0.1';

var CHAIN_CONFIG = {
  network: 'mainnet',
  contractAddress: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
  contractName: 'xtrata-arcade-scores-v2',
  boards: { campaign: 'astro3', daily: 'astro3-daily' },
  apiBases: ['https://api.mainnet.hiro.so', 'https://api.hiro.so'],
  submitUrl: 'https://xtrata.xyz/arcade/submit',
  readSender: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X'
};

var Chain = (function () {
  // ------------------------------------------------------------ sha256 (sync)
  var K = new Uint32Array([0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2]);
  function sha256(msg) {
    var l = msg.length, bitLen = l * 8;
    var n = ((l + 9 + 63) >> 6) << 6;
    var buf = new Uint8Array(n); buf.set(msg); buf[l] = 0x80;
    var dv = new DataView(buf.buffer);
    dv.setUint32(n - 4, bitLen >>> 0); dv.setUint32(n - 8, Math.floor(bitLen / 4294967296));
    var h = new Uint32Array([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]);
    var w = new Uint32Array(64);
    for (var off = 0; off < n; off += 64) {
      for (var i = 0; i < 16; i++) w[i] = dv.getUint32(off + i * 4);
      for (i = 16; i < 64; i++) {
        var a0 = w[i - 15], a1 = w[i - 2];
        var s0 = ((a0 >>> 7) | (a0 << 25)) ^ ((a0 >>> 18) | (a0 << 14)) ^ (a0 >>> 3);
        var s1 = ((a1 >>> 17) | (a1 << 15)) ^ ((a1 >>> 19) | (a1 << 13)) ^ (a1 >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }
      var A = h[0], B = h[1], C = h[2], D = h[3], E = h[4], F = h[5], G = h[6], HH = h[7];
      for (i = 0; i < 64; i++) {
        var S1 = ((E >>> 6) | (E << 26)) ^ ((E >>> 11) | (E << 21)) ^ ((E >>> 25) | (E << 7));
        var ch = (E & F) ^ (~E & G);
        var t1 = (HH + S1 + ch + K[i] + w[i]) | 0;
        var S0 = ((A >>> 2) | (A << 30)) ^ ((A >>> 13) | (A << 19)) ^ ((A >>> 22) | (A << 10));
        var mj = (A & B) ^ (A & C) ^ (B & C);
        var t2 = (S0 + mj) | 0;
        HH = G; G = F; F = E; E = (D + t1) | 0; D = C; C = B; B = A; A = (t1 + t2) | 0;
      }
      h[0] += A; h[1] += B; h[2] += C; h[3] += D; h[4] += E; h[5] += F; h[6] += G; h[7] += HH;
    }
    var out = new Uint8Array(32), odv = new DataView(out.buffer);
    for (i = 0; i < 8; i++) odv.setUint32(i * 4, h[i]);
    return out;
  }
  function hex(bytes) { var s = ''; for (var i = 0; i < bytes.length; i++) s += (bytes[i] < 16 ? '0' : '') + bytes[i].toString(16); return s; }
  function unhex(s) { s = s.replace(/^0x/, ''); var o = new Uint8Array(s.length / 2); for (var i = 0; i < o.length; i++) o[i] = parseInt(s.substr(i * 2, 2), 16); return o; }

  // ------------------------------------------------------------ c32 addresses
  var C32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  function c32encode(bytes) {
    // big-endian base-32 of bytes, keeping leading zero bytes as '0's
    var digits = [], carry, i, j;
    for (i = 0; i < bytes.length; i++) {
      carry = bytes[i];
      for (j = 0; j < digits.length; j++) { carry += digits[j] << 8; digits[j] = carry & 31; carry >>= 5; }
      while (carry) { digits.push(carry & 31); carry >>= 5; }
    }
    var s = '';
    for (i = digits.length - 1; i >= 0; i--) s += C32[digits[i]];
    for (i = 0; i < bytes.length && bytes[i] === 0; i++) s = '0' + s;
    return s;
  }
  function principalToString(version, hash160) {
    var data = new Uint8Array(21); data[0] = version; data.set(hash160, 1);
    var check = sha256(sha256(data)).subarray(0, 4);
    var full = new Uint8Array(24); full.set(hash160, 0); full.set(check, 20);
    return 'S' + C32[version] + c32encode(full);
  }
  function c32decode(str) {
    var out = [], i, j, carry;
    for (i = 0; i < str.length; i++) {
      carry = C32.indexOf(str[i].toUpperCase());
      if (carry < 0) throw new Error('bad c32');
      for (j = 0; j < out.length; j++) { carry += out[j] * 32; out[j] = carry & 255; carry >>= 8; }
      while (carry) { out.push(carry & 255); carry >>= 8; }
    }
    for (i = 0; i < str.length && str[i] === '0'; i++) out.push(0);
    return new Uint8Array(out.reverse());
  }
  function parseAddress(addr) {
    var version = C32.indexOf(addr[1]);
    var body = c32decode(addr.slice(2));
    var hash = body.subarray(body.length - 24, body.length - 4);
    return { version: version, hash: hash };
  }
  // Returns { address, version, hash } for a valid standard Stacks address (checksum checked), else null.
  function validateAddress(str) {
    str = String(str || '').trim().toUpperCase();
    if (!/^S[PMTN][0-9A-HJKMNP-TV-Z]{28,41}$/.test(str)) return null;
    try {
      var a = parseAddress(str);
      if (a.hash.length !== 20 || principalToString(a.version, a.hash) !== str) return null;
      return { address: str, version: a.version, hash: new Uint8Array(a.hash) };
    } catch (e) { return null; }
  }

  // ------------------------------------------------------------ clarity values
  function cvUint(n) { var o = new Uint8Array(17); o[0] = 1; var v = BigInt(n); for (var i = 16; i >= 1; i--) { o[i] = Number(v & 255n); v >>= 8n; } return o; }
  function cvAscii(s) { var o = new Uint8Array(5 + s.length); o[0] = 0x0d; new DataView(o.buffer).setUint32(1, s.length); for (var i = 0; i < s.length; i++) o[5 + i] = s.charCodeAt(i); return o; }
  function cvPrincipalRaw(version, hash) { var o = new Uint8Array(22); o[0] = 5; o[1] = version; o.set(hash, 2); return o; }

  function decodeCV(bytes) {
    var dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength), p = 0;
    function rd() {
      var t = bytes[p++], n, i, out, len;
      switch (t) {
        case 0x00: case 0x01: {
          var v = 0n; for (i = 0; i < 16; i++) v = (v << 8n) | BigInt(bytes[p++]);
          if (t === 0 && v >= (1n << 127n)) v -= (1n << 128n);
          return Number(v);
        }
        case 0x02: len = dv.getUint32(p); p += 4; out = bytes.slice(p, p + len); p += len; return out;
        case 0x03: return true;
        case 0x04: return false;
        case 0x05: { var ver = bytes[p++], h = bytes.slice(p, p + 20); p += 20; return { principal: principalToString(ver, h), version: ver, hash: h }; }
        case 0x06: { var ver2 = bytes[p++], h2 = bytes.slice(p, p + 20); p += 20; var nl = bytes[p++]; var nm = ''; for (i = 0; i < nl; i++) nm += String.fromCharCode(bytes[p++]); return { principal: principalToString(ver2, h2) + '.' + nm }; }
        case 0x07: return { ok: rd() };
        case 0x08: return { err: rd() };
        case 0x09: return null;
        case 0x0a: return rd();
        case 0x0b: n = dv.getUint32(p); p += 4; out = []; for (i = 0; i < n; i++) out.push(rd()); return out;
        case 0x0c: {
          n = dv.getUint32(p); p += 4; out = {};
          for (i = 0; i < n; i++) { var kl = bytes[p++], k = ''; for (var j = 0; j < kl; j++) k += String.fromCharCode(bytes[p++]); out[k] = rd(); }
          return out;
        }
        case 0x0d: case 0x0e: {
          len = dv.getUint32(p); p += 4; var sb = bytes.slice(p, p + len); p += len;
          return new TextDecoder().decode(sb);
        }
        default: throw new Error('Unknown Clarity type ' + t);
      }
    }
    return rd();
  }

  // ------------------------------------------------------------ read-only calls
  var goodBase = null;
  function callReadOnly(fn, args) {
    var bases = goodBase ? [goodBase].concat(CHAIN_CONFIG.apiBases.filter(function (b) { return b !== goodBase; })) : CHAIN_CONFIG.apiBases.slice();
    var body = JSON.stringify({ sender: CHAIN_CONFIG.readSender, arguments: args.map(function (a) { return '0x' + hex(a); }) });
    var path = '/v2/contracts/call-read/' + CHAIN_CONFIG.contractAddress + '/' + CHAIN_CONFIG.contractName + '/' + fn;
    function attempt(i) {
      if (i >= bases.length) return Promise.reject(new Error('Could not reach the Stacks API'));
      var ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      var to = setTimeout(function () { if (ctl) ctl.abort(); }, 9000);
      return fetch(bases[i] + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: body, signal: ctl ? ctl.signal : undefined })
        .then(function (r) { clearTimeout(to); if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(function (j) {
          if (!j.okay) throw new Error(j.cause || 'read failed');
          goodBase = bases[i];
          return decodeCV(unhex(j.result));
        })
        .catch(function (e) { clearTimeout(to); if (i + 1 < bases.length) return attempt(i + 1); throw e; });
    }
    return attempt(0);
  }

  // Leaderboard state keeps "failed to read" separate from "empty".
  var boards = {}; // key -> { status: 'idle'|'loading'|'ok'|'error', entries, error, at }
  var periodInfo = { status: 'idle', value: null };

  function boardKey(board, period) { return board + ':' + period; }

  function fetchPeriod() {
    periodInfo.status = 'loading';
    return callReadOnly('current-period', []).then(function (v) { periodInfo = { status: 'ok', value: v }; return v; })
      .catch(function (e) { periodInfo = { status: 'error', value: null, error: e.message }; throw e; });
  }

  function fetchTop10(board, period) {
    var key = boardKey(board, period);
    var cur = boards[key] || (boards[key] = { status: 'idle', entries: [] });
    cur.status = 'loading';
    return callReadOnly('get-top10', [cvAscii(board), cvUint(period)]).then(function (list) {
      var entries = [];
      for (var i = 0; i < list.length; i++) {
        var e = list[i];
        if (!e) continue;
        entries.push({
          rank: i + 1, name: e.name, score: e.score, player: e.player.principal,
          pVersion: e.player.version, pHash: e.player.hash,
          engineId: e['engine-id'], replayHash: hex(e['replay-hash']), height: e['stacks-height'], burn: e['burn-height'],
          verify: null
        });
      }
      boards[key] = { status: 'ok', entries: entries, at: Date.now() };
      return entries;
    }).catch(function (e) {
      boards[key] = { status: 'error', entries: cur.entries || [], error: e.message, at: Date.now() };
      throw e;
    });
  }

  function fetchReplay(board, period, entry) {
    return callReadOnly('get-replay', [cvAscii(board), cvUint(period), cvPrincipalRaw(entry.pVersion, entry.pHash)]).then(function (buf) {
      if (!buf) throw new Error('No replay stored for this entry');
      var h = hex(sha256(buf));
      if (entry.replayHash && h !== entry.replayHash) throw new Error('Replay hash does not match the on-chain hash');
      return buf;
    });
  }

  // Estimated rank from the cached board; 0 = not in Top 10, -1 = unknown (read failed).
  function estimateRank(board, period, score) {
    var b = boards[boardKey(board, period)];
    if (!b || b.status !== 'ok') return -1;
    var ahead = 0;
    for (var i = 0; i < b.entries.length; i++) if (b.entries[i].score >= score) ahead++;
    return ahead < 10 ? ahead + 1 : 0;
  }

  // ------------------------------------------------------------ submit hand-off
  function buildPayload(opts) {
    return {
      v: 1, game: 'astro-blaster-3', network: CHAIN_CONFIG.network,
      contract: CHAIN_CONFIG.contractAddress + '.' + CHAIN_CONFIG.contractName,
      board: opts.board, period: opts.period, score: opts.score, name: opts.name, pilot: opts.pilot || '',
      replay: AB3.toBase64Url(opts.replay)
    };
  }
  function submitLink(payload) {
    return CHAIN_CONFIG.submitUrl + '#p=' + AB3.toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  }

  // Tries the host overlay first (when embedded); resolves with
  // { mode: 'host' } once the host confirms it opened, or { mode: 'link', url } otherwise.
  var listeners = [];
  window.addEventListener('message', function (ev) {
    var d = ev.data;
    if (!d || typeof d !== 'object' || typeof d.type !== 'string' || d.type.indexOf('xtrata:arcade:') !== 0) return;
    for (var i = 0; i < listeners.length; i++) listeners[i](d, ev);
  });
  function onHostMessage(fn) { listeners.push(fn); }

  function handOff(payload) {
    var url = submitLink(payload);
    var embedded = false;
    try { embedded = window.parent && window.parent !== window; } catch (e) { embedded = true; }
    if (!embedded) return Promise.resolve({ mode: 'link', url: url });
    var id = 'ab3-' + Date.now() + '-' + Math.floor(Math.random() * 1e6);
    return new Promise(function (resolve) {
      var done = false;
      var timer = setTimeout(function () { if (!done) { done = true; resolve({ mode: 'link', url: url, embedded: true }); } }, 2500);
      onHostMessage(function (d) {
        if (done || d.id !== id) return;
        if (d.type === 'xtrata:arcade:submit-opened') { done = true; clearTimeout(timer); resolve({ mode: 'host', id: id, url: url }); }
      });
      try { window.parent.postMessage({ type: 'xtrata:arcade:submit', id: id, payload: payload }, '*'); }
      catch (e) { done = true; clearTimeout(timer); resolve({ mode: 'link', url: url, embedded: true }); }
    });
  }

  // When embedded on xtrata.xyz, ask the host for the connected wallet address
  // (read only: the host shows its own consent dialog; nothing is signed).
  function requestHostAddress() {
    var embedded = false;
    try { embedded = window.parent && window.parent !== window; } catch (e) { embedded = true; }
    if (!embedded) return Promise.reject(new Error('Not embedded on xtrata.xyz'));
    var nonce = 'ab3n-' + Math.floor(Math.random() * 1e9), reqId = 'ab3r-' + Math.floor(Math.random() * 1e9);
    return new Promise(function (resolve, reject) {
      var token = null, done = false;
      var helloTimer = setTimeout(function () { var e = new Error('This viewer cannot share a wallet address. Paste it instead.'); e.noHost = true; finish(e); }, 2500);
      var reqTimer = null;
      function finish(err, val) {
        if (done) return; done = true;
        clearTimeout(helloTimer); clearTimeout(reqTimer); window.removeEventListener('message', onMsg);
        if (err) reject(err); else resolve(val);
      }
      function onMsg(ev) {
        var d = ev.data;
        if (!d || typeof d !== 'object') return;
        if (d.type === 'xtrata:wallet:hello-ack' && d.nonce === nonce && !token) {
          token = d.bridgeToken; clearTimeout(helloTimer);
          reqTimer = setTimeout(function () { finish(new Error('No answer from the wallet.')); }, 120000);
          window.parent.postMessage({ type: 'xtrata:wallet:request', requestId: reqId, bridgeToken: token, method: 'stx_requestAccounts', params: {} }, '*');
        } else if (d.type === 'xtrata:wallet:response' && d.requestId === reqId) {
          if (!d.ok) return finish(new Error((d.error && d.error.message) || 'Wallet request refused.'));
          var r = d.result || {}, addr = r.address || (r.addresses && r.addresses[0]);
          var v = validateAddress(addr);
          if (!v) return finish(new Error('The wallet returned an unexpected address.'));
          finish(null, v);
        }
      }
      window.addEventListener('message', onMsg);
      window.parent.postMessage({ type: 'xtrata:wallet:hello', nonce: nonce }, '*');
    });
  }

  // ------------------------------------------------------------ direct wallet (top-level pages, e.g. /i/<id>)
  // Read-only: asks an injected wallet extension for its Stacks address. Nothing
  // is ever signed here. Follows the Xtrata wallet playbook: providers are read
  // from the window the extension injects into, the chooser is shown on every
  // connect, Xverse drops its previous session first (or it silently reuses the
  // old account), and stx_getAccounts is never used (it raises a false
  // "network mismatch" prompt in Xverse).
  function walletHost() {
    try { if (window.top && window.top !== window && window.top.location.origin === window.location.origin) return window.top; } catch (e) { /* cross-origin parent */ }
    return window;
  }
  function listWallets() {
    var w = walletHost(), out = [];
    var leather = w.LeatherProvider;
    if (leather && typeof leather.request === 'function') out.push({ id: 'leather', name: 'Leather', provider: leather });
    var xv = (w.XverseProviders && w.XverseProviders.BitcoinProvider) || (w.xverseProviders && w.xverseProviders.BitcoinProvider);
    if (!xv) {
      var reg = [].concat(w.btc_providers || [], w.webbtc_providers || []);
      for (var i = 0; i < reg.length; i++) {
        var info = reg[i] || {};
        if (!/xverse/i.test(String(info.id || '') + ' ' + String(info.name || ''))) continue;
        var found = String(info.id || '').split('.').reduce(function (o, k) { return o ? o[k] : undefined; }, w);
        if (found && typeof found.request === 'function') { xv = found; break; }
      }
    }
    if (xv && typeof xv.request === 'function') out.push({ id: 'xverse', name: 'Xverse', provider: xv });
    return out;
  }
  function walletError(e) {
    var o = e && typeof e === 'object' ? e : {};
    var inner = o.error && typeof o.error === 'object' ? o.error : o;
    var msg = String(inner.message || o.message || (typeof o.error === 'string' ? o.error : '') || e || 'The wallet refused the request.');
    var err = new Error(msg); err.code = inner.code; return err;
  }
  function unwrapWallet(r) {
    if (r && typeof r === 'object') {
      if (r.error) throw walletError(r);
      if (r.status === 'error') throw walletError(r.result || r);
    }
    return r;
  }
  // Walks a wallet response for Stacks addresses; prefers mainnet.
  function addressesIn(v, out, depth) {
    out = out || []; depth = depth || 0;
    if (!v || depth > 6) return out;
    if (typeof v === 'string') { var a = validateAddress(v); if (a) out.push(a); return out; }
    if (Array.isArray(v)) { for (var i = 0; i < v.length; i++) addressesIn(v[i], out, depth + 1); return out; }
    if (typeof v === 'object') for (var k in v) if (Object.prototype.hasOwnProperty.call(v, k)) addressesIn(v[k], out, depth + 1);
    return out;
  }
  function pickMainnet(list) {
    for (var i = 0; i < list.length; i++) if (list[i].version === 22 || list[i].version === 20) return list[i];
    if (list.length) throw new Error('The wallet shared a testnet address. Switch it to mainnet and try again.');
    throw new Error('The wallet did not share a Stacks address.');
  }
  function isCancel(e) {
    var m = String((e && e.message) || '').toLowerCase();
    return (e && (e.code === 4001 || e.code === -31001)) || /cancel|reject|denied|closed/.test(m);
  }
  function directAddress(wallet) {
    var p = wallet.provider;
    var req = function (method, params) { return Promise.resolve(p.request(method, params)).then(unwrapWallet, function (e) { throw walletError(e); }); };
    var run;
    if (wallet.id === 'xverse') {
      run = req('wallet_disconnect').catch(function () { /* best effort */ }).then(function () {
        return req('wallet_connect', { addresses: ['stacks'], network: 'Mainnet', message: 'Astro Blaster 3 reads your address to bind your runs to it. Nothing is signed.' });
      });
    } else {
      run = req('getAddresses').catch(function (e) {
        if (isCancel(e)) throw e;
        return req('stx_getAddresses');
      });
    }
    return run.then(function (r) { return pickMainnet(addressesIn(r)); }, function (e) {
      throw isCancel(e) ? new Error('Cancelled in the wallet. You can paste your address instead.') : e;
    });
  }
  function isEmbedded() { try { return window.parent !== window; } catch (e) { return true; } }

  // Embedded on xtrata.xyz: ask the host. Top-level (or a host that cannot
  // answer): use an injected wallet directly. `choose(list)` resolves to one
  // entry of the list, or null when the player closes the chooser.
  function requestWalletAddress(choose) {
    var direct = function () {
      var list = listWallets();
      if (!list.length) return Promise.reject(new Error('No Stacks wallet was found in this browser. Install or enable Xverse or Leather, or paste your address.'));
      return Promise.resolve(choose(list)).then(function (w) {
        if (!w) throw new Error('No wallet chosen. You can paste your address instead.');
        return directAddress(w);
      });
    };
    if (!isEmbedded()) return direct();
    return requestHostAddress().catch(function (e) {
      // only when no host answered at all; a refusal from the host stands
      if (e && e.noHost && listWallets().length) return direct();
      throw e;
    });
  }

  return {
    validateAddress: validateAddress, requestHostAddress: requestHostAddress, requestWalletAddress: requestWalletAddress, isEmbedded: isEmbedded,
    sha256: sha256, hex: hex, unhex: unhex, principalToString: principalToString, parseAddress: parseAddress,
    cvUint: cvUint, cvAscii: cvAscii, decodeCV: decodeCV, callReadOnly: callReadOnly,
    fetchPeriod: fetchPeriod, fetchTop10: fetchTop10, fetchReplay: fetchReplay, estimateRank: estimateRank,
    boards: boards, period: function () { return periodInfo; }, boardKey: boardKey,
    buildPayload: buildPayload, submitLink: submitLink, handOff: handOff, onHostMessage: onHostMessage
  };
})();
