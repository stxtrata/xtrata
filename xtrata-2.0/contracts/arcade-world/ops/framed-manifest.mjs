#!/usr/bin/env node
// Makes the MANIFEST PICTURE for a framed game (games contract kind 3): a small SVG that looks like a normal still image (the cabinet's art) and
// carries what the hall needs: which inscription is the real game, the exact bytes it must have (chain hash and size), and the two cabinet pictures.
// Inscribe the picture from the games admin wallet (xtrata.btc); add-game then names IT, and the hall checks the real game against the hash inside.
// Offline; sends nothing.
//   node ops/framed-manifest.mjs --game-file path/to/the-inscribed-game.html --game-inscription 3075 --id astro3 --title "Astro Blaster 3" \
//        --side cabinet-side.jpg --marquee cabinet-marquee.jpg --out astro-blaster-3-cabinet.svg [--engine-min 1]
// --game-file must be EXACTLY the bytes of the game inscription (download it from xtrata.xyz/i/<id>): the hash in the picture is computed from it.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { parseArgs, die } from './lib/cli.mjs';

const args = parseArgs(process.argv.slice(2), { gameFile: 'value', gameInscription: 'value', id: 'value', title: 'value', side: 'value', marquee: 'value', out: 'value', engineMin: 'value' });
for (const k of ['gameFile', 'gameInscription', 'id', 'title', 'side', 'marquee', 'out']) if (!args[k]) die('usage: node ops/framed-manifest.mjs --game-file <html> --game-inscription <id> --id <board id> --title "<title>" --side <jpg|png> --marquee <jpg|png> --out <file.svg>');
const CHUNK = 16384, ID_OK = /^[a-z0-9_]{3,24}$/;
const BUILT_IN = ['xa_block_defence', 'xa_block_drop', 'xa_block_runner', 'xa_brick_breaker', 'xa_bubble_pop', 'xa_cave_diver', 'xa_helix_drop', 'xa_invader_wave',
  'xa_lunar_lander', 'xa_maze_muncher', 'xa_merge_2048', 'xa_mine_sprint', 'xa_neon_snake', 'xa_orbit_merge', 'xa_pong_streak', 'xa_reflex_tap', 'xa_road_hopper',
  'xa_rock_drift', 'xa_stack_tower', 'xa_swerve', 'xa_tile_tap'];
const problems = [];
const bad = (m) => problems.push(m);
function chainHash(buf) {
  let h = Buffer.alloc(32);
  for (let i = 0; i < buf.length; i += CHUNK) h = createHash('sha256').update(Buffer.concat([h, buf.subarray(i, Math.min(buf.length, i + CHUNK))])).digest();
  return h.toString('hex');
}
const game = readFileSync(args.gameFile);
const gid = Number(args.gameInscription);
const title = String(args.title);
if (!(Number.isSafeInteger(gid) && gid > 0)) bad('--game-inscription must be a positive whole number');
if (!ID_OK.test(args.id)) bad(`the id "${args.id}" must be 3-24 characters of a-z, 0-9 and _ (it is also the name of the score board)`);
if (BUILT_IN.some((b) => args.id.startsWith(b))) bad(`the id "${args.id}" begins with a built-in id`);
if (title.length < 1 || title.length > 32 || /[<>&"]/.test(title)) bad('the title must be 1-32 characters with no < > & "');
if (!game.length || game.length > 16 * 1024 * 1024) bad('the game file is empty or over 16 MiB');
if (!/<html|<!doctype html|<script/i.test(game.toString('utf8'))) bad('the game file does not look like a web page');
const uri = (file) => {
  const b = readFileSync(file), t = b[0] === 0xff && b[1] === 0xd8 ? 'jpeg' : b.subarray(1, 4).toString() === 'PNG' ? 'png' : b.subarray(8, 12).toString() === 'WEBP' ? 'webp' : null;
  if (!t) bad(`${file} is not a jpeg, png or webp picture`);
  if (b.length > 2 * 1024 * 1024) bad(`${file} is over 2 MiB`);
  return `data:image/${t};base64,${b.toString('base64')}`;
};
const side = uri(args.side), marquee = uri(args.marquee);
if (problems.length) { console.log('NOT READY:'); problems.forEach((p) => console.log('  - ' + p)); process.exit(1); }

const note = { v: 1, kind: 'framed-game', board: args.id, game: { id: gid, hash: chainHash(game), size: game.length } };
// 1024 x 1536: the marquee across the top, the side print below it. A picture people can look at; the note is in <metadata>.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1536" width="1024" height="1536">
<title>${title} · cabinet art</title>
<desc>The arcade cabinet art for ${title}, with the note the Xtrata Arcade needs to show the game in its cabinet. The playable game is inscription #${gid}.</desc>
<metadata id="xtrata-game"><![CDATA[${JSON.stringify(note)}]]></metadata>
<rect width="1024" height="1536" fill="#05040f"/>
<image id="xa-cab-marquee" x="0" y="0" width="1024" height="256" preserveAspectRatio="xMidYMid slice" href="${marquee}" xlink:href="${marquee}"/>
<image id="xa-cab-side" x="192" y="256" width="640" height="1280" preserveAspectRatio="xMidYMid slice" href="${side}" xlink:href="${side}"/>
</svg>
`;
const bytes = Buffer.from(svg, 'utf8');
if (bytes.length > 1048576) { console.log(`NOT READY:\n  - the picture is ${bytes.length} bytes; the games contract allows at most 1048576 (1 MiB). Use smaller cabinet pictures.`); process.exit(1); }
writeFileSync(args.out, svg);
console.log(`wrote       ${args.out}  (${bytes.length} bytes, ${Math.ceil(bytes.length / CHUNK)} chunks of 16 KiB)`);
console.log(`game        inscription #${gid}, ${game.length} bytes, xtrata hash ${note.game.hash}`);
console.log('\nDo these in order (nothing here has been sent):');
console.log('  1. Look at the SVG in a browser: it should show the marquee over the rocket side print.');
console.log('  2. Check the game hash above is what the chain holds for #' + gid + ' (the file you passed must be the exact bytes of that inscription).');
console.log('  3. From the games admin wallet (xtrata.btc), inscribe the SVG with Xtrata (mime image/svg+xml). Note its inscription id and wait until it is sealed.');
console.log(`  4. On the scores contract, the board "${args.id}" must exist (astro3 already does on xtrata-arcade-scores-v2).`);
console.log('  5. On xtrata-games-v1, as the admin, call add-game with:');
console.log(`       id          "${args.id}"`);
console.log(`       title       "${title}"`);
console.log('       code-id     u<the SVG inscription id from step 3>');
console.log(`       code-hash   0x${chainHash(bytes)}`);
console.log(`       code-size   u${bytes.length}`);
console.log('       kind        u3');
console.log(`       engine-min  u${Number(args.engineMin || 1)}`);
