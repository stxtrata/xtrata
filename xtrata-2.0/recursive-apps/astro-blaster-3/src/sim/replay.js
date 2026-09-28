// ---------------------------------------------------------------------------
// Replays: every step's input is recorded; changes are stored as
//   varint((frameDelta << 1) | hasCmd), byte((ax+4) | (ay+4) << 4), [byte cmd]
// then compressed with deflate-raw. A 32-byte header carries the run summary.
// ---------------------------------------------------------------------------

var REPLAY_MAGIC = [65, 66, 51]; // "AB3"
var REPLAY_FORMAT = 2;
// Header (little endian):
//  0-2 "AB3" | 3 format | 4-23 pilot hash160 | 24 pilot address version | 25 mode
//  26-27 engine | 28-31 seed | 32-35 period | 36-39 frames | 40-47 score (f64) | 48-51 state hash
// Bytes 4-23 sit at a fixed offset so the leaderboard contract can require
// them to equal the submitting wallet's hash160.
var REPLAY_HEADER = 52;
var REPLAY_MAX_BYTES = 65536;
var REPLAY_MAX_FRAMES = 60 * 60 * 60 * 3; // 3 hours

function Recorder() {
  this.bytes = [];
  this.frames = 0;
  this.lastFrame = 0;
  this.pax = 0; this.pay = 0;
}
Recorder.prototype.push = function (input) {
  var ax = clamp(input.ax | 0, -4, 4), ay = clamp(input.ay | 0, -4, 4), cmd = (input.cmd | 0) & 255;
  var f = this.frames++;
  if (ax === this.pax && ay === this.pay && cmd === 0) return;
  var delta = f - this.lastFrame;
  this.lastFrame = f;
  writeVarint(this.bytes, delta * 2 + (cmd ? 1 : 0));
  this.bytes.push(((ax + 4) & 15) | (((ay + 4) & 15) << 4));
  if (cmd) this.bytes.push(cmd & 255);
  this.pax = ax; this.pay = ay;
};

function writeVarint(out, v) {
  while (v >= 128) { out.push((v & 127) | 128); v = Math.floor(v / 128); }
  out.push(v);
}

// Iterates the per-frame inputs of an uncompressed event stream.
function InputReader(body, frames) {
  this.b = body; this.i = 0; this.frames = frames;
  this.f = 0; this.next = -1; this.ax = 0; this.ay = 0; this.pending = null;
  this._read();
}
InputReader.prototype._read = function () {
  if (this.i >= this.b.length) { this.next = -1; return; }
  var v = 0, mul = 1, byte;
  do { byte = this.b[this.i++]; v += (byte & 127) * mul; mul *= 128; } while (byte & 128);
  var hasCmd = v % 2, delta = (v - hasCmd) / 2;
  var packed = this.b[this.i++];
  var rec = { ax: (packed & 15) - 4, ay: ((packed >> 4) & 15) - 4, cmd: hasCmd ? this.b[this.i++] : 0 };
  this.next = (this.pending ? this.pending.at : 0) + delta;
  rec.at = this.next;
  this.pending = rec;
};
InputReader.prototype.nextInput = function () {
  var cmd = 0;
  if (this.pending && this.next === this.f) {
    this.ax = this.pending.ax; this.ay = this.pending.ay; cmd = this.pending.cmd;
    var at = this.pending.at;
    if (this.i < this.b.length) { this._read(); } else { this.pending = null; this.next = -1; }
    void at;
  }
  this.f++;
  return { ax: this.ax, ay: this.ay, cmd: cmd };
};

function writeHeader(st, frames) {
  var h = new Uint8Array(REPLAY_HEADER), dv = new DataView(h.buffer);
  h[0] = REPLAY_MAGIC[0]; h[1] = REPLAY_MAGIC[1]; h[2] = REPLAY_MAGIC[2];
  h[3] = REPLAY_FORMAT;
  h.set(st.pilot, 4);
  h[24] = st.pilotVersion;
  h[25] = st.mode;
  dv.setUint16(26, ENGINE_VERSION, true);
  dv.setUint32(28, st.seed >>> 0, true);
  dv.setUint32(32, st.period >>> 0, true);
  dv.setUint32(36, frames >>> 0, true);
  dv.setFloat64(40, st.score, true);
  dv.setUint32(48, stateHash(st), true);
  return h;
}

function readHeader(bytes) {
  if (!bytes || bytes.length < REPLAY_HEADER) throw new Error('Replay too short');
  if (bytes[0] !== 65 || bytes[1] !== 66 || bytes[2] !== 51) throw new Error('Not an Astro Blaster 3 replay');
  if (bytes[3] !== REPLAY_FORMAT) throw new Error('Unsupported replay format ' + bytes[3]);
  var dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return {
    format: bytes[3], pilot: bytes.slice(4, 24), pilotVersion: bytes[24], mode: bytes[25],
    engine: dv.getUint16(26, true), seed: dv.getUint32(28, true), period: dv.getUint32(32, true),
    frames: dv.getUint32(36, true), score: dv.getFloat64(40, true), hash: dv.getUint32(48, true)
  };
}

function streamBytes(bytes, format) {
  var cs = format === 'compress' ? new CompressionStream('deflate-raw') : new DecompressionStream('deflate-raw');
  var blobStream = new Blob([bytes]).stream().pipeThrough(cs);
  return new Response(blobStream).arrayBuffer().then(function (ab) { return new Uint8Array(ab); });
}

// Returns a Promise<Uint8Array> of the full replay.
function encodeReplay(st, recorder) {
  var header = writeHeader(st, recorder.frames);
  return streamBytes(new Uint8Array(recorder.bytes), 'compress').then(function (body) {
    var out = new Uint8Array(header.length + body.length);
    out.set(header, 0); out.set(body, header.length);
    return out;
  });
}

function decodeReplay(bytes) {
  var h = readHeader(bytes);
  return streamBytes(bytes.subarray(REPLAY_HEADER), 'decompress').then(function (body) {
    return { header: h, body: body };
  });
}

// Creates the game a replay describes plus a reader for its inputs.
function replaySession(decoded) {
  var h = decoded.header;
  var st = createGame({ mode: h.mode, seed: h.seed, period: h.period, pilot: h.pilot, pilotVersion: h.pilotVersion });
  return { st: st, reader: new InputReader(decoded.body, h.frames), header: h };
}

function samePilot(a, b) {
  if (!a || !b || a.length !== 20 || b.length !== 20) return false;
  for (var i = 0; i < 20; i++) if (a[i] !== b[i]) return false;
  return true;
}

// Full headless verification. Resolves to { ok, score, frames, header, reason }.
// opts: { score, period, mode, pilot (Uint8Array 20), chunk (frames per slice; yields between slices) }
function verifyReplay(bytes, opts) {
  opts = opts || {};
  return decodeReplay(bytes).then(function (dec) {
    var h = dec.header;
    var fail = function (reason) { return { ok: false, reason: reason, header: h, score: null, frames: h.frames }; };
    if (h.engine !== ENGINE_VERSION) return fail('engine version ' + h.engine + ' (this engine is ' + ENGINE_VERSION + ')');
    if (h.frames < 1 || h.frames > REPLAY_MAX_FRAMES) return fail('run length out of range');
    if (opts.mode != null && h.mode !== opts.mode) return fail('mode mismatch');
    if (h.mode === MODE_DAILY && opts.period != null && h.period !== opts.period) return fail('daily period mismatch');
    if (opts.pilot && !samePilot(opts.pilot, h.pilot)) return fail('flown by a different wallet');
    var s = replaySession(dec);
    var f = 0, chunk = opts.chunk || 0;
    function run() {
      var end = chunk ? Math.min(h.frames, f + chunk) : h.frames;
      for (; f < end; f++) {
        if (s.st.phase === 'over') return fail('input continues after game over');
        step(s.st, s.reader.nextInput());
      }
      if (f < h.frames) return new Promise(function (res) { setTimeout(res, 0); }).then(run);
      var score = s.st.score, hash = stateHash(s.st);
      var ok = score === h.score && hash === h.hash && (opts.score == null || opts.score === score);
      return {
        ok: ok, score: score, frames: h.frames, header: h, over: s.st.phase === 'over',
        reason: ok ? '' : (score !== h.score ? 'score mismatch' : (hash !== h.hash ? 'state mismatch' : 'claimed score mismatch'))
      };
    }
    return run();
  });
}

function toBase64Url(bytes) {
  var s = '';
  for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function fromBase64Url(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  var bin = atob(str), out = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
