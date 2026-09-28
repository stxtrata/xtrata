// ---------------------------------------------------------------------------
// Astro Blaster 3 — deterministic simulation core.
//
// DETERMINISM RULES (the replay proof depends on these):
// - The sim never reads the clock, Math.random, the DOM or device state.
// - Only + - * / Math.floor/abs/min/max/sqrt/imul and bit ops are used.
//   Math.sin/cos/atan2/pow/exp are NOT used: their results may differ between
//   browser engines. dsin/dcos below are pure polynomials instead.
// - Arrays are iterated in insertion order; removal is order-preserving.
// ---------------------------------------------------------------------------

var ENGINE_VERSION = 1;
var W = 360, H = 640;
var TAU = 6.283185307179586, PI = 3.141592653589793, HALF_PI = 1.5707963267948966;

function dsin(x) {
  // range-reduce to [-PI, PI]
  var k = Math.floor(x / TAU + 0.5);
  x = x - k * TAU;
  // reflect to [-PI/2, PI/2]
  if (x > HALF_PI) x = PI - x;
  else if (x < -HALF_PI) x = -PI - x;
  var x2 = x * x;
  // Taylor series to x^13 (error < 1e-9 on [-PI/2, PI/2])
  return x * (1 + x2 * (-1 / 6 + x2 * (1 / 120 + x2 * (-1 / 5040 + x2 * (1 / 362880 + x2 * (-1 / 39916800 + x2 / 6227020800))))));
}
function dcos(x) { return dsin(x + HALF_PI); }

function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
function len(x, y) { return Math.sqrt(x * x + y * y); }

// mulberry32 — 32-bit integer PRNG, identical on every engine.
function makeRng(seed) {
  var s = seed >>> 0;
  var rng = function () {
    s = (s + 0x6D2B79F5) >>> 0;
    var t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  rng.int = function (n) { return Math.floor(rng() * n); };
  rng.range = function (a, b) { return a + rng() * (b - a); };
  rng.pick = function (arr) { return arr[Math.floor(rng() * arr.length)]; };
  rng.chance = function (p) { return rng() < p; };
  rng.state = function () { return s; };
  return rng;
}

// Stable string hash (FNV-1a 32) — used for daily seeds and state hashes.
function fnv1a(str) {
  var h = 0x811c9dc5;
  for (var i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}
function hashMix(h, v) {
  // v: number; mixes its integer part (and 1/64 fraction) into h
  var n = Math.floor(v * 64) | 0;
  h ^= n & 0xffff; h = Math.imul(h, 0x01000193) >>> 0;
  h ^= (n >>> 16) & 0xffff; h = Math.imul(h, 0x01000193) >>> 0;
  return h;
}

function dailySeed(period) { return fnv1a('astro3-daily-' + period); }

// Order-preserving in-place filter.
function compact(arr, keep) {
  var j = 0;
  for (var i = 0; i < arr.length; i++) { if (keep(arr[i])) arr[j++] = arr[i]; }
  arr.length = j;
}

// Rotate a unit vector (x, y) by angle a.
function rot(x, y, a) {
  var c = dcos(a), s = dsin(a);
  return [x * c - y * s, x * s + y * c];
}
function aimAt(fx, fy, tx, ty) {
  var dx = tx - fx, dy = ty - fy, l = len(dx, dy) || 1;
  return [dx / l, dy / l];
}
