#!/usr/bin/env node
// Pre-flight check for a new Arcade game cartridge, before it is inscribed and added to xtrata-games-v1. Offline; sends nothing.
//   node ops/games-check.mjs path/to/cartridge.js [--title "Game Title"] [--engine-min 1] [--kit path/to/arcade-kit.js]
//
// It runs the cartridge against the real arcade kit in an empty sandbox and checks what the games contract and the hall will check:
//   - it registers exactly ONE game, with a valid id (3-24 of a-z 0-9 _), not one of the 21 built-in ids, and all the required fields
//   - every score board it needs has an id of at most 24 characters (the scores contract's limit), and which boards those are
//   - the file is at most 1 MiB, and it reads as text the hall can run
// Then it prints the Xtrata hash/size to pass to add-game and the three steps, in order.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { parseArgs, die } from './lib/cli.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const args = parseArgs(process.argv.slice(2), { title: 'value', engineMin: 'value', kit: 'value' });
const file = args._[0];
if (!file) die('usage: node ops/games-check.mjs <cartridge.js> [--title "Game Title"] [--engine-min 1] [--kit path/to/arcade-kit.js]');

const MAX_BYTES = 1048576, CHUNK = 16384;
const ID_OK = /^[a-z0-9_]{3,24}$/;
const BUILT_IN = ['xa_block_defence', 'xa_block_drop', 'xa_block_runner', 'xa_brick_breaker', 'xa_bubble_pop', 'xa_cave_diver', 'xa_helix_drop', 'xa_invader_wave',
  'xa_lunar_lander', 'xa_maze_muncher', 'xa_merge_2048', 'xa_mine_sprint', 'xa_neon_snake', 'xa_orbit_merge', 'xa_pong_streak', 'xa_reflex_tap', 'xa_road_hopper',
  'xa_rock_drift', 'xa_stack_tower', 'xa_swerve', 'xa_tile_tap'];

const problems = [], notes = [];
const bad = (m) => problems.push(m);

const bytes = readFileSync(file);
const text = bytes.toString('utf8');
if (bytes.length === 0) bad('the file is empty');
if (bytes.length > MAX_BYTES) bad(`the file is ${bytes.length} bytes; the contract allows at most ${MAX_BYTES} (1 MiB)`);
if (Buffer.from(text, 'utf8').compare(bytes) !== 0) bad('the file is not valid UTF-8 text (the hall decodes it as UTF-8)');
if (/^﻿/.test(text)) notes.push('the file starts with a byte-order mark; harmless but better removed');

// The same hash the Xtrata core stores: a chain over 16 KiB chunks, h = sha256(h + chunk), starting from 32 zero bytes.
function chainHash(buf) {
  let h = Buffer.alloc(32);
  for (let i = 0; i < buf.length; i += CHUNK) h = createHash('sha256').update(Buffer.concat([h, buf.subarray(i, Math.min(buf.length, i + CHUNK))])).digest();
  return h.toString('hex');
}

// A sandbox with no network, wallet, DOM or timers that matter: just enough for the kit and a cartridge to register.
function sandbox() {
  const win = {};
  const noop = () => {};
  const el = () => new Proxy(function () {}, { get: (t, k) => (k === 'style' ? {} : k === 'getContext' ? () => new Proxy({}, { get: () => noop, set: () => true }) : noop), set: () => true });
  Object.assign(win, {
    console, Math, JSON, Date, Array, Object, String, Number, Boolean, RegExp, Error, Map, Set, WeakMap, Uint8Array, Uint16Array, Uint32Array, Int32Array, Float32Array, Float64Array,
    Promise, Symbol, parseInt, parseFloat, isNaN, isFinite, TextEncoder, TextDecoder,
    document: { createElement: el, body: el(), documentElement: el(), addEventListener: noop, getElementById: () => null, querySelector: () => null },
    navigator: { userAgent: 'games-check', maxTouchPoints: 0 }, location: { href: 'about:blank', search: '', hash: '' },
    setTimeout: noop, clearTimeout: noop, setInterval: noop, clearInterval: noop, requestAnimationFrame: noop, cancelAnimationFrame: noop,
    addEventListener: noop, removeEventListener: noop, dispatchEvent: noop, CustomEvent: class { constructor(t, o) { this.type = t; this.detail = o && o.detail; } },
    AudioContext: undefined, webkitAudioContext: undefined, localStorage: undefined, devicePixelRatio: 1, innerWidth: 800, innerHeight: 600,
    performance: { now: () => 0 }
  });
  win.window = win; win.self = win; win.globalThis = win;
  return vm.createContext(win);
}

const kitPath = resolve(args.kit || join(here, '..', '..', '..', 'recursive-apps', 'xtrata-arcade', 'src', 'parts', 'arcade-kit.js'));
let kit;
try { kit = readFileSync(kitPath, 'utf8'); } catch { die(`cannot read the arcade kit at ${kitPath} (pass --kit)`); }

const ctx = sandbox();
let registered = [];
try {
  vm.runInContext(kit, ctx, { filename: 'arcade-kit.js', timeout: 5000 });
} catch (e) { die(`the arcade kit did not load in the sandbox: ${e.message}`); }
const XA = ctx.XA;
if (!XA || !XA.registerGame) die('the arcade kit did not provide XA.registerGame');
const before = XA.games.length;
try {
  vm.runInContext(text, ctx, { filename: 'cartridge.js', timeout: 5000 });
} catch (e) { bad(`the cartridge threw when it was loaded: ${e.message}`); }
registered = XA.games.slice(before);

if (registered.length === 0) bad('the cartridge did not register a game (it must call XA.registerGame({...}) when it loads)');
if (registered.length > 1) bad(`the cartridge registered ${registered.length} games (${registered.map((g) => g.id).join(', ')}); the hall allows exactly one id per cartridge`);

const g = registered[0];
let boards = [];
if (g) {
  if (!ID_OK.test(g.id)) bad(`the game id "${g.id}" must be 3-24 characters of a-z, 0-9 and _ (the contract and the score boards allow no more)`);
  if (BUILT_IN.includes(g.id)) bad(`the game id "${g.id}" is a built-in game's id`);
  for (const f of ['title', 'tagline', 'color', 'size', 'create', 'attract']) if (!g[f]) bad(`the game has no "${f}"`);
  if (g.title && String(g.title).length > 32) bad(`the title is ${String(g.title).length} characters; add-game takes at most 32`);
  if (g.size && !(g.size.w > 0 && g.size.h > 0)) bad('size must be { w, h } with positive numbers');
  if (typeof g.create !== 'function') bad('"create" must be a function');
  if (typeof g.attract !== 'function') bad('"attract" must be a function');
  // Boards: the base board is the game id (mode of the game); each variant adds id_key with its own mode.
  const modeNum = (m) => (m === 'time' ? 1 : 0);
  boards.push({ id: g.id, mode: modeNum(g.mode), label: g.title });
  for (const v of g.variants || []) boards.push({ id: `${g.id}_${v.key}`, mode: modeNum(v.mode), label: `${g.title} · ${v.label}` });
  for (const b of boards) if (b.id.length > 24) bad(`the board id "${b.id}" is ${b.id.length} characters; the scores contract allows at most 24. Shorten the game id or the variant key.`);
  // A quick smoke run: create() and a few updates, to catch an immediate crash. (Full replay checks are the hall's test-suite's job.)
  try {
    const api = {
      rng: () => 0.5, input: { hit: () => false, down: () => false, pressed: () => false, axis: () => 0 }, addScore: () => {}, gameOver: () => {}, audio: new Proxy({}, { get: () => () => {} }),
      fx: new Proxy({}, { get: () => () => {} }), util: XA.util, width: g.size && g.size.w, height: g.size && g.size.h, seed: 1, variant: null, mode: g.mode
    };
    const inst = g.create(api);
    if (!inst || typeof inst.update !== 'function' || typeof inst.render !== 'function') bad('create() must return { update, render }');
  } catch (e) { notes.push(`create() could not be smoke-tested in the empty sandbox (${e.message}); it may need the real hall. Check it in the hall's own test run.`); }
}

const sha = createHash('sha256').update(bytes).digest('hex');
const hash = chainHash(bytes);
console.log(`file        ${file}`);
console.log(`size        ${bytes.length} bytes (${Math.ceil(bytes.length / CHUNK)} chunk${Math.ceil(bytes.length / CHUNK) === 1 ? '' : 's'} of 16 KiB)`);
console.log(`sha256      ${sha}`);
console.log(`xtrata hash ${hash}   (what the core stores for the inscription; the contract compares against it)`);
if (g) {
  console.log(`game id     ${g.id}`);
  console.log(`title       ${g.title}`);
  console.log(`boards      ${boards.map((b) => `${b.id} (${b.mode ? 'lowest wins' : 'highest wins'})`).join(', ')}`);
}
notes.forEach((n) => console.log(`note: ${n}`));
if (problems.length) {
  console.log('\nNOT READY:');
  problems.forEach((p) => console.log(`  - ${p}`));
  process.exit(1);
}

const title = String(args.title || g.title).slice(0, 32);
const engineMin = Number(args.engineMin || 1);
console.log('\nREADY. Do these in order (nothing here has been sent):');
console.log('  1. Inscribe the file with Xtrata from the wallet that is the games contract admin (xtrata.btc). Note the inscription id and wait until it is sealed.');
console.log('  2. Create each score board on the scores contract (owner only, about 0.02 STX each):');
for (const b of boards) console.log(`       set-board  id "${b.id}"  mode u${b.mode}   (${b.label})`);
console.log('     The board must exist before players can post; the delay in step 3 is the time to get this done.');
console.log('  3. On xtrata-games-v1, as the admin, call add-game with:');
console.log(`       id          "${g.id}"`);
console.log(`       title       "${title}"`);
console.log('       code-id     u<the inscription id from step 1>');
console.log(`       code-hash   0x${hash}`);
console.log(`       code-size   u${bytes.length}`);
console.log('       kind        u1');
console.log(`       engine-min  u${engineMin}`);
console.log('     The game goes live in the hall after the contract\'s delay (get-config shows it; 144 burn blocks, about a day, on mainnet).');
console.log('     To pull it back in an emergency: set-hidden with its number and true. Boards and replays stay on chain.');
