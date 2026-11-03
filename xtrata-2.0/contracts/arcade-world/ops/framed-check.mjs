#!/usr/bin/env node
// Pre-flight check for a FRAMED game (games contract kind 2): a game that is already its own inscription, with its own engine and its own score board
// (for example Astro Blaster 3, inscription #3075). The hall gives it a cabinet and plays the inscription in a sandboxed frame. Offline; sends nothing.
//   node ops/framed-check.mjs path/to/the-game.html --id astro3 --title "Astro Blaster 3" [--inscription 3075] [--engine-min 1]
//
// The file must be exactly the bytes that were inscribed (download it from xtrata.xyz/i/<id> or use the release file). It checks what the games contract
// and the hall will check, and prints the hash/size for add-game and the steps in order.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { parseArgs, die } from './lib/cli.mjs';

const args = parseArgs(process.argv.slice(2), { id: 'value', title: 'value', inscription: 'value', engineMin: 'value' });
const file = args._[0];
if (!file || !args.id) die('usage: node ops/framed-check.mjs <the-game.html> --id astro3 --title "Astro Blaster 3" [--inscription 3075] [--engine-min 1]');

const MAX_BYTES = 1048576, CHUNK = 16384;
const ID_OK = /^[a-z0-9_]{3,24}$/;
const BUILT_IN = ['xa_block_defence', 'xa_block_drop', 'xa_block_runner', 'xa_brick_breaker', 'xa_bubble_pop', 'xa_cave_diver', 'xa_helix_drop', 'xa_invader_wave',
  'xa_lunar_lander', 'xa_maze_muncher', 'xa_merge_2048', 'xa_mine_sprint', 'xa_neon_snake', 'xa_orbit_merge', 'xa_pong_streak', 'xa_reflex_tap', 'xa_road_hopper',
  'xa_rock_drift', 'xa_stack_tower', 'xa_swerve', 'xa_tile_tap'];
const problems = [], notes = [];
const bad = (m) => problems.push(m);

const bytes = readFileSync(file);
const text = bytes.toString('utf8');
if (!bytes.length) bad('the file is empty');
if (bytes.length > MAX_BYTES) bad(`the file is ${bytes.length} bytes; the contract allows at most ${MAX_BYTES} (1 MiB)`);
if (Buffer.from(text, 'utf8').compare(bytes) !== 0) bad('the file is not valid UTF-8 text (the hall decodes it as UTF-8)');
if (!/<html|<!doctype html|<script/i.test(text)) bad('this does not look like a web page (no <html>, <!doctype> or <script>); a framed game must be a single HTML page');
if (/<script[^>]+src=["']https?:/i.test(text) || /<link[^>]+href=["']https?:[^"']*\.css/i.test(text)) notes.push('the page loads a script or stylesheet from the web; in the hall\'s frame it will work only if that host allows an opaque-origin page');

const id = String(args.id);
if (!ID_OK.test(id)) bad(`the game id "${id}" must be 3-24 characters of a-z, 0-9 and _`);
const clash = BUILT_IN.find((b) => id.startsWith(b));
if (clash) bad(`the game id "${id}" ${id === clash ? 'is' : 'begins with'} the built-in id "${clash}"`);
const title = String(args.title || id);
if (title.length > 32) bad(`the title is ${title.length} characters; add-game takes at most 32`);
if (id.length > 24) bad('the id is too long for a score board');
notes.push(`the cabinet shows the Top 10 of the board named exactly "${id}" (highest score wins); the game's other boards (a daily one, say) still work inside the game but have no cabinet screen`);
notes.push('a framed game has no hall replay: the hall does not replay or verify its runs, the score contract and the game\'s own replay format do');

function chainHash(buf) {
  let h = Buffer.alloc(32);
  for (let i = 0; i < buf.length; i += CHUNK) h = createHash('sha256').update(Buffer.concat([h, buf.subarray(i, Math.min(buf.length, i + CHUNK))])).digest();
  return h.toString('hex');
}
console.log(`file        ${file}`);
console.log(`size        ${bytes.length} bytes (${Math.ceil(bytes.length / CHUNK)} chunks of 16 KiB)`);
console.log(`xtrata hash ${chainHash(bytes)}   (what the core stores for the inscription; the contract compares against it)`);
console.log(`game id     ${id}`);
console.log(`title       ${title}`);
notes.forEach((n) => console.log(`note: ${n}`));
if (problems.length) { console.log('\nNOT READY:'); problems.forEach((p) => console.log(`  - ${p}`)); process.exit(1); }

console.log('\nREADY. Do these in order (nothing here has been sent):');
console.log(`  1. The inscription${args.inscription ? ' #' + args.inscription : ''} must be SEALED and must have been created by the wallet that is the games contract admin (xtrata.btc): add-game refuses any other creator.`);
console.log(`     Check on xtrata.xyz that #${args.inscription || '<id>'} was minted by that wallet. If it was not, the game has to be inscribed again from the admin wallet.`);
console.log('  2. On the scores contract the hall reads, as its owner, make sure the board exists (about 0.02 STX):');
console.log(`       set-board  id "${id}"  mode u0   (highest wins)    -- skip if it is already there; check get-board first`);
console.log('     The cabinet reads this contract; the board must exist for the Top 10 to show and for scores to post.');
console.log('  3. On xtrata-games-v1, as the admin, call add-game with:');
console.log(`       id          "${id}"`);
console.log(`       title       "${title}"`);
console.log(`       code-id     u${args.inscription || '<the inscription id>'}`);
console.log(`       code-hash   0x${chainHash(bytes)}`);
console.log(`       code-size   u${bytes.length}`);
console.log('       kind        u2');
console.log(`       engine-min  u${Number(args.engineMin || 1)}`);
console.log('     The game goes live in the hall after the contract\'s delay (get-config shows it). To pull it back: set-hidden with its number and true.');
