/*
 * Xtrata Arcade — score client (leaf module)
 *
 * The only module that talks to the network or a wallet. Shared by every
 * cartridge in the room; each game is just a different `game-id` on the same
 * contract (xtrata-arcade-scores-v2 by default).
 *
 * Reads:   Hiro `call-read` → get-top10 / get-board / get-replay, decoded here.
 * Writes:  submit-score(board, period, score, name, replay), signed in this priority order:
 *   1. Host bridge, generic         `stx_callContract`          (runtime page)
 *   2. Direct wallet provider       (only when the page is top-level)
 *   3. Nothing can sign here        → hand the player the secure-runtime link
 *
 * Every write is Deny-mode with a single STX post-condition capped at the
 * contract's current fee, so a signature can never move more than the fee.
 *
 * A read that FAILED is reported as { ok:false } — never as an empty board.
 */
(function (root) {
  'use strict';
  if (root.XAScores) return;

  var CFG = {
    network: 'mainnet',
    contractAddress: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
    contractName: 'xtrata-arcade-scores-v2',
    readSender: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
    apiBases: null,               // default: same-origin /hiro proxy (if any) then Hiro
    runtimeOrigin: 'https://xtrata.xyz',
    contentContractId: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3',
    parentTokenId: 0,
    boardTtlMs: 45000,
    bridgeTimeoutMs: 170000,
    appName: 'xtrata-arcade',
    inlineMax: 60000              // replays larger than this are stored as their own inscription
  };

  var HEX = '0123456789abcdef';
  var C32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

  function err(message, code) {
    var e = new Error(message);
    if (code !== undefined) e.code = code;
    return e;
  }
  function log() {
    try {
      var args = Array.prototype.slice.call(arguments);
      args.unshift('[xa:scores]');
      console.log.apply(console, args);
    } catch (e) {}
  }

  /* ---------------------------------------------------------- bytes */
  function hexToBytes(hex) {
    var clean = String(hex || '').replace(/^0x/i, '');
    if (clean.length % 2) throw err('Invalid hex length');
    var out = new Uint8Array(clean.length / 2);
    for (var i = 0; i < out.length; i++) out[i] = parseInt(clean.substr(i * 2, 2), 16);
    return out;
  }
  function bytesToHex(bytes) {
    var s = '';
    for (var i = 0; i < bytes.length; i++) s += HEX[bytes[i] >> 4] + HEX[bytes[i] & 15];
    return s;
  }
  function asciiBytes(str) {
    var out = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i++) out[i] = str.charCodeAt(i) & 0x7f;
    return out;
  }

  /* --------------------------------------------------------- sha256 */
  var K = new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ]);
  function sha256(msg) {
    var h = new Uint32Array([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
      0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]);
    var l = msg.length;
    var padLen = ((l + 9 + 63) >> 6) << 6;
    var buf = new Uint8Array(padLen);
    buf.set(msg); buf[l] = 0x80;
    var bits = l * 8;
    buf[padLen - 4] = (bits >>> 24) & 255; buf[padLen - 3] = (bits >>> 16) & 255;
    buf[padLen - 2] = (bits >>> 8) & 255; buf[padLen - 1] = bits & 255;
    var w = new Uint32Array(64);
    for (var off = 0; off < padLen; off += 64) {
      for (var i = 0; i < 16; i++) {
        w[i] = (buf[off + i * 4] << 24) | (buf[off + i * 4 + 1] << 16) | (buf[off + i * 4 + 2] << 8) | buf[off + i * 4 + 3];
      }
      for (i = 16; i < 64; i++) {
        var a0 = w[i - 15], a1 = w[i - 2];
        var s0 = ((a0 >>> 7) | (a0 << 25)) ^ ((a0 >>> 18) | (a0 << 14)) ^ (a0 >>> 3);
        var s1 = ((a1 >>> 17) | (a1 << 15)) ^ ((a1 >>> 19) | (a1 << 13)) ^ (a1 >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }
      var a = h[0], b = h[1], c = h[2], d = h[3], e = h[4], f = h[5], g = h[6], hh = h[7];
      for (i = 0; i < 64; i++) {
        var S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
        var ch = (e & f) ^ (~e & g);
        var t1 = (hh + S1 + ch + K[i] + w[i]) | 0;
        var S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
        var mj = (a & b) ^ (a & c) ^ (b & c);
        var t2 = (S0 + mj) | 0;
        hh = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      h[0] += a; h[1] += b; h[2] += c; h[3] += d; h[4] += e; h[5] += f; h[6] += g; h[7] += hh;
    }
    var out = new Uint8Array(32);
    for (i = 0; i < 8; i++) {
      out[i * 4] = h[i] >>> 24; out[i * 4 + 1] = (h[i] >>> 16) & 255;
      out[i * 4 + 2] = (h[i] >>> 8) & 255; out[i * 4 + 3] = h[i] & 255;
    }
    return out;
  }

  /* ------------------------------------------------------------ c32 */
  function c32encode(bytes) {
    var lead = 0;
    while (lead < bytes.length && bytes[lead] === 0) lead++;
    var n = BigInt('0x' + (bytesToHex(bytes) || '0'));
    var s = '';
    while (n > 0n) { s = C32[Number(n % 32n)] + s; n = n / 32n; }
    for (var i = 0; i < lead; i++) s = '0' + s;
    return s;
  }
  function c32address(version, hash160) {
    var payload = new Uint8Array(21);
    payload[0] = version; payload.set(hash160, 1);
    var check = sha256(sha256(payload)).slice(0, 4);
    var data = new Uint8Array(24);
    data.set(hash160); data.set(check, 20);
    return 'S' + C32[version] + c32encode(data);
  }
  function c32decodeAddress(address) {
    var a = String(address || '').trim().toUpperCase();
    if (!/^S[0-9A-Z]{20,41}$/.test(a)) throw err('Invalid Stacks address');
    var version = C32.indexOf(a[1]);
    var body = a.slice(2);
    var n = 0n;
    for (var i = 0; i < body.length; i++) {
      var v = C32.indexOf(body[i]);
      if (v < 0) throw err('Invalid Stacks address');
      n = n * 32n + BigInt(v);
    }
    var bytes = hexToBytes(n.toString(16).padStart(48, '0'));
    var hash160 = bytes.slice(0, 20);
    if (c32address(version, hash160) !== a) throw err('Stacks address checksum mismatch');
    return { version: version, hash160: hash160 };
  }
  function isMainnetAddress(a) {
    try { c32decodeAddress(a); } catch (e) { return false; }
    return /^S[PM]/.test(String(a).toUpperCase());
  }

  /* ---------------------------------------------------- Clarity codec */
  function cvUint(value) {
    var n = BigInt(value);
    if (n < 0n) throw err('uint cannot be negative');
    return '0x01' + n.toString(16).padStart(32, '0');
  }
  function cvBuff(bytes) {
    return '0x02' + bytes.length.toString(16).padStart(8, '0') + bytesToHex(bytes);
  }
  function cvPrincipal(address) {
    var d = c32decodeAddress(address);
    return '0x05' + d.version.toString(16).padStart(2, '0') + bytesToHex(d.hash160);
  }
  function cvAscii(str) {
    var s = String(str);
    if (!/^[\x20-\x7e]*$/.test(s)) throw err('string-ascii must be printable ASCII');
    return '0x0d' + s.length.toString(16).padStart(8, '0') + bytesToHex(asciiBytes(s));
  }
  // Minimal deserializer: enough for the leaderboard contract's return types.
  function decodeCV(hex) {
    var b = hexToBytes(hex);
    var p = 0;
    function u32() { var v = ((b[p] << 24) | (b[p + 1] << 16) | (b[p + 2] << 8) | b[p + 3]) >>> 0; p += 4; return v; }
    function big(nbytes, signed) {
      var v = BigInt('0x' + bytesToHex(b.slice(p, p + nbytes)));
      if (signed && b[p] & 0x80) v -= (1n << BigInt(nbytes * 8));
      p += nbytes;
      return v;
    }
    function read() {
      var t = b[p++];
      switch (t) {
        case 0x00: return { type: 'int', value: big(16, true) };
        case 0x01: return { type: 'uint', value: big(16, false) };
        case 0x02: { var n = u32(); var v = b.slice(p, p + n); p += n; return { type: 'buffer', value: v }; }
        case 0x03: return { type: 'bool', value: true };
        case 0x04: return { type: 'bool', value: false };
        case 0x05: { var ver = b[p++]; var h = b.slice(p, p + 20); p += 20;
          return { type: 'principal', value: c32address(ver, h) }; }
        case 0x06: { var ver2 = b[p++]; var h2 = b.slice(p, p + 20); p += 20;
          var ln = b[p++]; var name = String.fromCharCode.apply(null, b.slice(p, p + ln)); p += ln;
          return { type: 'principal', value: c32address(ver2, h2) + '.' + name }; }
        case 0x07: return { type: 'ok', value: read() };
        case 0x08: return { type: 'err', value: read() };
        case 0x09: return { type: 'none', value: null };
        case 0x0a: return { type: 'some', value: read() };
        case 0x0b: { var len = u32(); var arr = []; for (var i = 0; i < len; i++) arr.push(read()); return { type: 'list', value: arr }; }
        case 0x0c: { var cnt = u32(); var obj = {};
          for (var j = 0; j < cnt; j++) {
            var kl = b[p++]; var key = String.fromCharCode.apply(null, b.slice(p, p + kl)); p += kl;
            obj[key] = read();
          }
          return { type: 'tuple', value: obj }; }
        case 0x0d: { var sl = u32(); var s = String.fromCharCode.apply(null, b.slice(p, p + sl)); p += sl; return { type: 'ascii', value: s }; }
        case 0x0e: { var ul = u32(); var ub = b.slice(p, p + ul); p += ul;
          return { type: 'utf8', value: new TextDecoder().decode(ub) }; }
        default: throw err('Unsupported Clarity type 0x' + t.toString(16));
      }
    }
    return read();
  }

  /* STX post-condition, wire format (for direct wallet routes).
     type 0x00 STX | principal 0x02 standard(version,hash160) | code | u64 amount
     BARE hex, no 0x: Leather parses post-condition strings with a strict
     decoder (@noble/hashes hexToBytes) that rejects "0x" and reports it as
     "Not a serialized post condition". Xverse accepts bare hex too. */
  var CONDITION_LTE = 0x05;
  function stxPostConditionHex(address, amount) {
    var d = c32decodeAddress(address);
    var amt = BigInt(amount).toString(16).padStart(16, '0');
    return '00' + '02' + d.version.toString(16).padStart(2, '0') + bytesToHex(d.hash160) +
      CONDITION_LTE.toString(16).padStart(2, '0') + amt;
  }

  /* ---------------------------------------------------------- reads */
  function hasRealOrigin() {
    try { return /^https?:$/.test(root.location.protocol) && root.location.origin !== 'null'; }
    catch (e) { return false; }
  }
  function apiBases() {
    if (Array.isArray(CFG.apiBases) && CFG.apiBases.length) return CFG.apiBases.slice();
    var out = [];
    if (hasRealOrigin() && /xtrata\.xyz$/.test(root.location.hostname)) {
      out.push(root.location.origin + '/hiro/' + CFG.network);
    }
    out.push(CFG.network === 'testnet' ? 'https://api.testnet.hiro.so' : 'https://api.mainnet.hiro.so');
    return out;
  }
  async function callRead(fn, args, contractId) {
    var bases = apiBases();
    var last = null;
    var target = contractId ? String(contractId).split('.') : [CFG.contractAddress, CFG.contractName];
    for (var i = 0; i < bases.length; i++) {
      var url = bases[i].replace(/\/+$/, '') + '/v2/contracts/call-read/' +
        target[0] + '/' + target[1] + '/' + fn;
      try {
        var res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sender: CFG.readSender, arguments: args || [] })
        });
        if (!res.ok) throw err('HTTP ' + res.status);
        var body = await res.json();
        if (!body || body.okay !== true || typeof body.result !== 'string') {
          throw err(body && body.cause ? String(body.cause) : 'read-only call failed');
        }
        return decodeCV(body.result);
      } catch (e) { last = e; }
    }
    throw last || err('read-only call failed');
  }

  var boardCache = {};
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

  /* ------------------------------------------- long replays as Xtrata inscriptions
     A replay larger than INLINE_MAX does not fit in a score entry. It is inscribed on the Xtrata core in one
     transaction (mint-single-tx, up to 32 chunks = 512 KB; the player pays the core fee and the network fee),
     and the score entry stores a small pointer to it (XA.replay.makePointer). */
  var INLINE_MAX = 60000, CHUNK = 16384, MAX_INSCRIBE_CHUNKS = 32;
  var REPLAY_MIME = 'application/octet-stream';
  var TOKEN_URI = 'https://xvgh3sbdkivby4blejmripeiyjuvji3d4tycym6hgaxalescegjq.arweave.net/vUx9yCNSKhxwKyJZFDyIwmlUo2Pk8CwzxzAuBZJCIZM';
  function cvList(items) {
    return '0x0b' + items.length.toString(16).padStart(8, '0') + items.map(function (x) { return String(x).replace(/^0x/i, ''); }).join('');
  }
  function chunksOf(bytes) {
    var out = [];
    for (var i = 0; i < bytes.length; i += CHUNK) out.push(bytes.subarray(i, Math.min(bytes.length, i + CHUNK)));
    return out;
  }
  function chainHash(bytes) {
    var h = new Uint8Array(32);
    chunksOf(bytes).forEach(function (c) { var m = new Uint8Array(32 + c.length); m.set(h, 0); m.set(c, 32); h = sha256(m); });
    return h;
  }
  function needsInscription(bytes) { return bytes.length > (Number(CFG.inlineMax) || INLINE_MAX); }
  // What storing a long replay costs: { ok, chunks, fee (micro-STX string), tooBig } — fee excludes the network fee.
  async function quoteReplay(size) {
    var n = Math.ceil(size / CHUNK);
    if (n > MAX_INSCRIBE_CHUNKS) return { ok: true, chunks: n, tooBig: true, fee: '0' };
    try {
      var cv = await callRead('quote-single-tx-fee', [cvUint(size), cvUint(n)], CFG.contentContractId);
      var t = cv && cv.type === 'ok' ? cv.value : cv;
      return { ok: true, chunks: n, tooBig: false, fee: String(t.value['total-fee'].value) };
    } catch (e) { return { ok: false, chunks: n, tooBig: false, error: (e && e.message) || String(e) }; }
  }
  async function inscriptionIdByHash(hash) {
    var cv = await callRead('get-id-by-hash', [cvBuff(hash)], CFG.contentContractId);
    var v = cv && cv.type === 'ok' ? cv.value : cv;
    v = some(v);
    return v ? Number(v.value) : null;
  }
  async function inscriptionMeta(id) {
    var cv = await callRead('get-inscription-meta', [cvUint(id)], CFG.contentContractId);
    var v = cv && cv.type === 'ok' ? cv.value : cv;
    v = some(v);
    if (!v) return null;
    var t = v.value;
    return { chunks: Number(t['total-chunks'].value), size: Number(t['total-size'].value), sealed: !!(t.sealed && t.sealed.value),
      creator: t.creator ? t.creator.value : '', hash: t['final-hash'] ? bytesToHex(t['final-hash'].value) : '' };
  }
  // Bytes of inscription `id`, checked against the expected chain hash: the xtrata.xyz gateway first, the chain as fallback.
  var inscriptionCache = {};
  async function getInscription(id, hash) {
    var want = bytesToHex(hash);
    var key = id + ':' + want;
    if (inscriptionCache[key]) return inscriptionCache[key];
    var p = (async function () {
      try {
        var res = await fetch(CFG.runtimeOrigin.replace(/\/+$/, '') + '/i/' + id + '?raw=1', { cache: 'force-cache' });
        if (res.ok) {
          var b = new Uint8Array(await res.arrayBuffer());
          if (bytesToHex(chainHash(b)) === want) return b;
        }
      } catch (e) { /* gateway unreachable: read the chain */ }
      var meta = await inscriptionMeta(id);
      if (!meta || !meta.sealed) throw err('Replay inscription #' + id + ' is not on chain yet.');
      var parts = [], got = 0;
      for (var i = 0; i < meta.chunks; i += 8) {
        var idx = [];
        for (var k = i; k < Math.min(meta.chunks, i + 8); k++) idx.push(cvUint(k));
        var cv = await callRead('get-chunk-batch', [cvUint(id), cvList(idx)], CFG.contentContractId);
        var list = (cv && cv.type === 'ok' ? cv.value : cv).value;
        list.forEach(function (it) { var v = it.type === 'some' ? it.value : it; parts.push(v.value); got += v.value.length; });
      }
      var out = new Uint8Array(got), o = 0;
      parts.forEach(function (c) { out.set(c, o); o += c.length; });
      if (bytesToHex(chainHash(out)) !== want) throw err('Replay inscription #' + id + ' does not match its hash.');
      return out;
    })();
    inscriptionCache[key] = p;
    p.catch(function () { delete inscriptionCache[key]; });
    return p;
  }
  // Waits until a broadcast transaction is confirmed; throws if it failed.
  async function waitTx(txid, onTick) {
    var id = /^0x/.test(txid) ? txid : '0x' + txid;
    var started = Date.now();
    while (Date.now() - started < 20 * 60000) {
      var bases = apiBases();
      for (var i = 0; i < bases.length; i++) {
        try {
          var res = await fetch(bases[i].replace(/\/+$/, '') + '/extended/v1/tx/' + id, { cache: 'no-store' });
          if (res.status === 404) break;
          if (!res.ok) continue;
          var tx = await res.json();
          if (tx.tx_status === 'success') return tx;
          if (/^abort|^dropped/.test(String(tx.tx_status))) {
            throw err('The transaction failed on chain (' + tx.tx_status + (tx.tx_result && tx.tx_result.repr ? ': ' + tx.tx_result.repr : '') + ').');
          }
          break;
        } catch (e) { if (e && /failed on chain/.test(e.message)) throw e; }
      }
      if (onTick) try { onTick(Math.round((Date.now() - started) / 1000)); } catch (e) {}
      await new Promise(function (res) { setTimeout(res, 4000); });
    }
    throw err('Still waiting for transaction ' + id.slice(0, 12) + '… Check your wallet history, then post again: nothing is paid twice.');
  }
  function base64url(bytes) {
    var bin = '';
    for (var i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  // Inside the xtrata.xyz viewer the site signs: hand it the whole run; it stores the replay and posts the score.
  function hostSubmitLong(input) {
    var targets = bridgeTargets();
    if (!targets.length) return Promise.reject(err('No host window.', -32001));
    var id = 'xa-long-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    var payload = { v: 1, game: 'xtrata-arcade', network: CFG.network, contract: CFG.contractAddress + '.' + CFG.contractName,
      board: input.board, period: 0, score: input.score, name: input.name, replay: base64url(input.replay) };
    return new Promise(function (resolve, reject) {
      var opened = false;
      var t0 = setTimeout(function () {
        if (opened) return;
        root.removeEventListener('message', onMsg);
        reject(err('This viewer cannot store long replays yet. Open the arcade at xtrata.xyz/arcade to post this run, or save the replay and post it later.', -32601));
      }, 5000);
      function onMsg(ev) {
        var d = ev && ev.data;
        if (!d || typeof d !== 'object' || d.id !== id) return;
        if (d.type === 'xtrata:arcade:submit-opened') { opened = true; clearTimeout(t0); if (input.onProgress) input.onProgress('Confirm in the xtrata.xyz dialog…'); return; }
        if (d.type !== 'xtrata:arcade:submit-result') return;
        root.removeEventListener('message', onMsg); clearTimeout(t0);
        if (d.txId) resolve({ ok: true, txid: d.txId, route: 'host:long' });
        else if (d.cancelled) reject(err('Cancelled. Nothing was posted.', 4001));
        else reject(err(String(d.error || 'The score was not posted.')));
      }
      root.addEventListener('message', onMsg);
      targets.forEach(function (t) { try { t.postMessage({ type: 'xtrata:arcade:submit', id: id, payload: payload }, '*'); } catch (e) {} });
    });
  }

  /* --------------------------------------------------- host bridge */
  var bridge = { token: '', hostOrigin: '', nonce: '', tries: 0, seq: 0, pending: {}, listening: false };
  function bridgeTargets() {
    var out = [];
    try { if (root.opener && root.opener !== root) out.push(root.opener); } catch (e) {}
    try { if (root.parent && root.parent !== root) out.push(root.parent); } catch (e) {}
    try { if (root.top && root.top !== root && out.indexOf(root.top) < 0) out.push(root.top); } catch (e) {}
    return out;
  }
  function postOrigin() {
    if (bridge.hostOrigin) return bridge.hostOrigin;
    return hasRealOrigin() ? root.location.origin : '*';
  }
  function listen() {
    if (bridge.listening) return;
    bridge.listening = true;
    root.addEventListener('message', function (ev) {
      var d = ev && ev.data;
      if (!d || typeof d !== 'object') return;
      if (d.type === 'xtrata:wallet:hello-ack') {
        if (bridge.token || d.nonce !== bridge.nonce || typeof d.bridgeToken !== 'string') return;
        bridge.token = d.bridgeToken;
        bridge.hostOrigin = ev.origin && ev.origin !== 'null' ? ev.origin : '';
        log('host bridge granted by', bridge.hostOrigin || '(opaque origin)');
        emit();
        return;
      }
      if (d.type !== 'xtrata:wallet:response') return;
      var okOrigin = (bridge.hostOrigin && ev.origin === bridge.hostOrigin) ||
        (hasRealOrigin() && ev.origin === root.location.origin);
      if (!okOrigin) return;
      var entry = bridge.pending[d.requestId];
      if (!entry) return;
      delete bridge.pending[d.requestId];
      clearTimeout(entry.timer);
      if (d.ok) entry.resolve(d.result);
      else {
        var detail = d.error || {};
        entry.reject(err(detail.message || 'Host wallet bridge rejected the request.',
          typeof detail.code === 'number' ? detail.code : undefined));
      }
    });
  }
  function hello() {
    var targets = bridgeTargets();
    if (!targets.length || bridge.token) return;
    if (!bridge.nonce) {
      try { bridge.nonce = root.crypto.randomUUID(); }
      catch (e) { bridge.nonce = 'xa-' + Date.now().toString(36) + Math.random().toString(36).slice(2); }
    }
    bridge.tries++;
    targets.forEach(function (t) {
      try {
        t.postMessage({ type: 'xtrata:wallet:hello', app: CFG.appName, version: 'v1',
          nonce: bridge.nonce, wants: ['wallet-bridge', 'arcade-score'] }, '*');
      } catch (e) {}
    });
    if (bridge.tries < 6) setTimeout(hello, 600 * bridge.tries);
  }
  function bridgeRequest(method, params, timeoutMs) {
    if (!bridge.token) return Promise.reject(err('No host wallet bridge.', -32001));
    var targets = bridgeTargets();
    if (!targets.length) return Promise.reject(err('No host window.', -32001));
    return new Promise(function (resolve, reject) {
      var id = 'xa-' + (++bridge.seq) + '-' + Date.now().toString(36);
      var timer = setTimeout(function () {
        delete bridge.pending[id];
        reject(err('No wallet response. Check your wallet history before retrying.', -32002));
      }, timeoutMs || CFG.bridgeTimeoutMs);
      bridge.pending[id] = { resolve: resolve, reject: reject, timer: timer };
      var msg = { type: 'xtrata:wallet:request', requestId: id, bridgeToken: bridge.token,
        method: method, params: params == null ? null : params };
      targets.forEach(function (t) { try { t.postMessage(msg, postOrigin()); } catch (e) {} });
    });
  }

  /* ------------------------------------------------- direct wallets */
  function isTopLevel() {
    try { return root.top === root; } catch (e) { return false; }
  }
  // Every Stacks wallet this top-level page can reach, one entry per wallet (Leather, Xverse).
  function directProviders() {
    if (!isTopLevel()) return [];
    var out = [];
    var ok = function (p) { return p && typeof p.request === 'function'; };
    if (ok(root.LeatherProvider)) out.push({ kind: 'leather', name: 'Leather', p: root.LeatherProvider });
    var xv = root.XverseProviders || root.xverseProviders;
    if (xv && ok(xv.BitcoinProvider)) out.push({ kind: 'xverse', name: 'Xverse', p: xv.BitcoinProvider });
    else if (xv && ok(xv.StacksProvider)) out.push({ kind: 'xverse', name: 'Xverse', p: xv.StacksProvider });
    // A bare window.StacksProvider belongs to whichever wallet claimed it last: only use it when nothing else answered.
    if (!out.length && ok(root.StacksProvider)) out.push({ kind: 'leather', name: 'Stacks wallet', p: root.StacksProvider });
    return out;
  }
  // The wallet the player picked when connecting; before that, any reachable one (for "can this page sign?").
  function directProvider() {
    var all = directProviders();
    if (!all.length) return null;
    return all.filter(function (d) { return d.kind === state.via; })[0] || all[0];
  }
  // Several wallets installed: ask which one, every time a wallet is connected (never pick one silently).
  function chooseProvider(all) {
    if (all.length < 2) return Promise.resolve(all[0] || null);
    return new Promise(function (resolve) {
      var doc = root.document;
      var wrap = doc.createElement('div');
      wrap.setAttribute('role', 'dialog'); wrap.setAttribute('aria-modal', 'true'); wrap.setAttribute('aria-label', 'Choose a wallet');
      wrap.style.cssText = 'position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;background:rgba(3,4,12,.72);font:15px/1.4 system-ui,sans-serif';
      var card = doc.createElement('div');
      card.style.cssText = 'width:min(340px,calc(100% - 32px));padding:20px;border-radius:16px;border:1px solid rgba(120,140,255,.45);background:#0c1230;color:#eef4ff;box-shadow:0 20px 60px rgba(0,0,0,.6)';
      var h = doc.createElement('div');
      h.textContent = 'Connect with which wallet?';
      h.style.cssText = 'font-weight:800;font-size:18px;margin-bottom:12px';
      card.appendChild(h);
      function done(v) { root.removeEventListener('keydown', onKey, true); wrap.remove(); resolve(v); }
      function onKey(e) { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); done(null); } }
      all.forEach(function (d, i) {
        var b = doc.createElement('button');
        b.type = 'button'; b.textContent = d.name;
        b.style.cssText = 'display:block;width:100%;margin:0 0 8px;padding:12px 14px;border-radius:10px;border:1px solid rgba(57,230,255,.5);background:rgba(57,230,255,.08);color:#eef4ff;font:700 15px system-ui,sans-serif;cursor:pointer;text-align:left';
        b.onclick = function () { done(d); };
        card.appendChild(b);
        if (i === 0) setTimeout(function () { try { b.focus(); } catch (e) {} }, 0);
      });
      var c = doc.createElement('button');
      c.type = 'button'; c.textContent = 'Cancel';
      c.style.cssText = 'display:block;width:100%;margin-top:4px;padding:10px;border-radius:10px;border:0;background:transparent;color:#9fb0d8;font:600 14px system-ui,sans-serif;cursor:pointer';
      c.onclick = function () { done(null); };
      card.appendChild(c);
      wrap.addEventListener('click', function (e) { if (e.target === wrap) done(null); });
      wrap.appendChild(card);
      (doc.body || doc.documentElement).appendChild(wrap);
      root.addEventListener('keydown', onKey, true);
    });
  }
  function unwrap(r) {
    if (r && r.error) throw err(r.error.message || 'Wallet error', r.error.code);
    if (r && r.status === 'error') throw err((r.error && r.error.message) || 'Wallet error');
    return r && r.result !== undefined ? r.result : r;
  }
  function findStxAddress(payload) {
    var found = '';
    (function walk(v, depth) {
      if (found || depth > 6 || v == null) return;
      if (typeof v === 'string') {
        if (/^S[PMTN][0-9A-Z]{20,41}$/.test(v)) {
          try { c32decodeAddress(v); found = v; } catch (e) { /* not an address */ }
        }
        return;
      }
      if (typeof v !== 'object') return;
      // Prefer entries explicitly marked as STX / stacks.
      if ((v.symbol === 'STX' || v.purpose === 'stacks') && typeof v.address === 'string') {
        found = v.address; return;
      }
      Object.keys(v).forEach(function (k) { walk(v[k], depth + 1); });
    })(payload, 0);
    return found;
  }

  /* --------------------------------------------------------- state */
  var state = { address: '', via: '' };
  var subs = [];
  function emit() { subs.forEach(function (fn) { try { fn(status()); } catch (e) {} }); }
  function status() {
    var route = bridge.token ? 'host' : directProvider() ? 'direct' : 'none';
    return { route: route, address: state.address, network: CFG.network,
      contract: CFG.contractAddress + '.' + CFG.contractName };
  }

  async function connect() {
    var s = status();
    var result;
    if (s.route === 'host') {
      result = await bridgeRequest('wallet_connect', { app: CFG.appName }, 120000);
      state.via = 'host';
    } else if (s.route === 'direct') {
      var d = await chooseProvider(directProviders());
      if (!d) throw err('Wallet connection cancelled.', 4001);
      if (d.kind === 'leather') result = unwrap(await d.p.request('getAddresses'));
      else result = unwrap(await d.p.request('wallet_connect', {
        addresses: ['stacks'], message: 'Connect to Xtrata Arcade to post high scores.' }));
      state.via = d.kind;
    } else {
      throw err('No wallet is reachable from here. Open the arcade on xtrata.xyz.', 4900);
    }
    var address = findStxAddress(result);
    if (!address) throw err('The wallet did not return a Stacks address.');
    if (CFG.network === 'mainnet' && !/^S[PM]/.test(address)) {
      throw err('Switch your wallet to Stacks mainnet and connect again.');
    }
    state.address = address;
    emit();
    return address;
  }
  function disconnect() { state.address = ''; state.via = ''; emit(); }

  function cleanName(name) {
    return String(name || '').replace(/[^A-Za-z0-9_.\- ]/g, '').trim().slice(0, 12);
  }
  function runtimeUrl() {
    // Without a minted parent id there is no runtime page to deep-link to yet.
    if (!(Number(CFG.parentTokenId) > 0)) return CFG.runtimeOrigin.replace(/\/+$/, '') + '/arcade';
    var u = CFG.runtimeOrigin.replace(/\/+$/, '') + '/runtime/?contractId=' +
      encodeURIComponent(CFG.contentContractId) + '&network=' + CFG.network;
    if (Number(CFG.parentTokenId) > 0) u += '&tokenId=' + CFG.parentTokenId;
    return u;
  }
  function openRuntime() {
    var url = runtimeUrl();
    if (!(Number(CFG.parentTokenId) > 0)) return url;
    bridgeTargets().forEach(function (t) {
      try {
        t.postMessage({ type: 'xtrata:arcade:wallet-intent', intent: 'open-runtime',
          payload: { runtimeUrl: url }, bridgeToken: bridge.token || '' }, postOrigin());
      } catch (e) {}
    });
    return url;
  }
  function txidOf(r) {
    if (!r) return '';
    if (typeof r === 'string') return r;
    return r.txid || r.txId || (r.result && (r.result.txid || r.result.txId)) || '';
  }

  /*
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
    if (!(replay instanceof Uint8Array) || !replay.length) throw err('This run has no replay to post.');
    var progress = typeof input.onProgress === 'function' ? input.onProgress : function () {};
    var seal = !!input.seal;            // keep the replay, post only its fingerprint (any size, one approval)
    var long = !seal && needsInscription(replay);
    if (long && Math.ceil(replay.length / CHUNK) > MAX_INSCRIBE_CHUNKS) {
      throw err('This replay is ' + Math.round(replay.length / 1024) + ' KB, more than the 512 KB a single inscription can hold. Save the replay so the run is kept.');
    }

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
    var r;

    if (long && s.route === 'host') return hostSubmitLong({ board: board, score: score, name: name, replay: replay, onProgress: progress });

    var stored = replay, replayId = null, minted = false;
    if (seal) {
      stored = root.XA.replay.makeSeal(replay);
      progress('Approve in your wallet: post your score with your replay\'s fingerprint.');
    }
    if (long) {
      // 1. The full replay as its own inscription (re-used if these exact bytes are already on chain).
      var d0 = directProvider();
      var hash = chainHash(replay);
      replayId = await inscriptionIdByHash(hash).catch(function () { return null; });
      if (replayId === null) {
        var q = await quoteReplay(replay.length);
        if (!q.ok) throw err('Could not read the inscription fee right now. Try again in a moment.');
        progress('Approve 1 of 2 in your wallet: store your ' + Math.round(replay.length / 1024) + ' KB replay as an inscription.');
        var chunkArgs = chunksOf(replay).map(function (c) { return cvBuff(c); });
        var margs = [cvBuff(hash), cvAscii(REPLAY_MIME), cvUint(replay.length), cvList(chunkArgs), cvAscii(TOKEN_URI)]
          .map(function (a) { return String(a).replace(/^0x/i, ''); });
        var core = CFG.contentContractId;
        var mp = { contract: core, functionName: 'mint-single-tx', functionArgs: margs, arguments: margs,
          postConditionMode: 'deny', postConditions: [stxPostConditionHex(address, q.fee)] };
        if (d0.kind === 'leather') mp.network = CFG.network;
        var mr = unwrap(await d0.p.request('stx_callContract', mp));
        var mtx = txidOf(mr); minted = true;
        if (!mtx) throw err('The wallet did not return a transaction id for the replay.');
        progress('Storing your replay on chain… (this takes a block or two)');
        await waitTx(mtx, function (sec) { progress('Storing your replay on chain… ' + sec + ' s'); });
        for (var tries = 0; tries < 20 && replayId === null; tries++) {
          replayId = await inscriptionIdByHash(hash).catch(function () { return null; });
          if (replayId === null) await new Promise(function (res) { setTimeout(res, 3000); });
        }
        if (replayId === null) throw err('The replay was stored but its inscription id is not visible yet. Post again in a minute: it will not be stored twice.');
      }
      stored = root.XA.replay.makePointer(replay, replayId, hash);
      progress((minted ? 'Approve 2 of 2' : 'Your replay is already stored as #' + replayId + '. Approve') + ' in your wallet: post your score.');
    }
    var args = [cvAscii(board), cvUint(0), cvUint(score), cvAscii(name), cvBuff(stored)];

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
    var bareArgs = args.map(function (a) { return String(a).replace(/^0x/i, ''); });   // bare hex for wallets
    var params = {
      contract: contract,
      functionName: 'submit-score',
      functionArgs: bareArgs,
      arguments: bareArgs,
      postConditionMode: 'deny',
      postConditions: [stxPostConditionHex(address, fee.value)]
    };
    if (d.kind === 'leather') params.network = CFG.network;
    r = unwrap(await d.p.request('stx_callContract', params));
    return { ok: true, txid: txidOf(r), route: 'direct:' + d.kind, replayId: replayId, sealed: seal };
  }

  /* ------------------------------------------------------ local PBs */
  function localBest(gameId) {
    var v = root.XA && root.XA.util.store('pb:' + gameId);
    return typeof v === 'number' ? v : 0;
  }
  function recordLocal(gameId, score) {
    var best = localBest(gameId);
    if (score > best && root.XA) root.XA.util.store('pb:' + gameId, score);
    return Math.max(best, score);
  }

  /* ----------------------------------------------------------- boot */
  (function boot() {
    listen();
    try {
      var t = new URLSearchParams(root.location.search || '').get('walletBridgeToken');
      if (t) { bridge.token = t.trim(); log('host bridge token from URL'); }
    } catch (e) {}
    hello();
    var lastRoute = status().route, polls = 0;
    var watch = setInterval(function () {
      var r = status().route;
      if (r !== lastRoute) { lastRoute = r; emit(); }
      if (++polls >= 40 || r === 'host') clearInterval(watch);
    }, 500);
  })();

  root.XAScores = {
    configure: function (patch) {
      Object.keys(patch || {}).forEach(function (k) { if (k in CFG) CFG[k] = patch[k]; });
      boardCache = {}; infoCache = {};
      emit();
    },
    config: function () { return Object.assign({}, CFG); },
    getTop10: getTop10,
    qualifies: qualifies,
    getFee: getFee,
    getBoardInfo: getBoardInfo,
    getReplay: getReplay,
    getInscription: getInscription,
    inscriptionIdByHash: inscriptionIdByHash,
    quoteReplay: quoteReplay,
    needsInscription: needsInscription,
    INLINE_MAX: INLINE_MAX,
    status: status,
    onChange: function (fn) { subs.push(fn); fn(status()); },
    connect: connect,
    disconnect: disconnect,
    submit: submit,
    runtimeUrl: runtimeUrl,
    openRuntime: openRuntime,
    cleanName: cleanName,
    localBest: localBest,
    recordLocal: recordLocal,
    shortAddress: function (a) { a = String(a || ''); return a.length > 12 ? a.slice(0, 5) + '…' + a.slice(-4) : a; },
    // exposed for tests
    _codec: { cvUint: cvUint, cvAscii: cvAscii, cvBuff: cvBuff, cvPrincipal: cvPrincipal, decodeCV: decodeCV, c32address: c32address,
      c32decodeAddress: c32decodeAddress, stxPostConditionHex: stxPostConditionHex, sha256: sha256,
      bytesToHex: bytesToHex, hexToBytes: hexToBytes, isMainnetAddress: isMainnetAddress }
  };
})(typeof window !== 'undefined' ? window : globalThis);
