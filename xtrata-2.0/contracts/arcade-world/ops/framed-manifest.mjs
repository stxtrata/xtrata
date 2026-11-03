#!/usr/bin/env node
// Makes the MANIFEST PICTURE for a framed game (games contract kind 3): the game's cabinet poster, as an ordinary webp or png still image, with a note
// written into its metadata. The note says which inscription is the real game, the exact bytes it must have (chain hash and size), and carries the
// cabinet's marquee picture. The poster itself is not changed: every pixel is the file you gave. Inscribe it from the games admin wallet (xtrata.btc);
// add-game then names IT, and the hall checks the real game against the hash inside the note. Offline; sends nothing.
//   node ops/framed-manifest.mjs --game-file path/to/the-inscribed-game.html --game-inscription 3075 --id astro3 --title "Astro Blaster 3" \
//        --poster poster.webp --marquee marquee.png --out astro-blaster-3-cabinet.webp [--engine-min 1]
// --game-file must be EXACTLY the bytes of the game inscription (download it from xtrata.xyz/i/<id>): the hash in the note is computed from it.
// --poster is a webp or png (a jpeg cannot hold a note this big). --out keeps the poster's format.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { parseArgs, die } from './lib/cli.mjs';

const args = parseArgs(process.argv.slice(2), { gameFile: 'value', gameInscription: 'value', id: 'value', title: 'value', poster: 'value', marquee: 'value', out: 'value', engineMin: 'value' });
for (const k of ['gameFile', 'gameInscription', 'id', 'title', 'poster', 'marquee', 'out']) if (!args[k]) die('usage: node ops/framed-manifest.mjs --game-file <html> --game-inscription <id> --id <board id> --title "<title>" --poster <webp|png> --marquee <png|jpg|webp> --out <file>');
const CHUNK = 16384, CONTRACT_MAX = 1048576, ID_OK = /^[a-z0-9_]{3,24}$/;
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
const kindOf = (b) => (b[0] === 0xff && b[1] === 0xd8 ? 'jpeg' : b.subarray(1, 4).toString() === 'PNG' ? 'png' : b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP' ? 'webp' : null);
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = (b) => { let c = 0xffffffff; for (const x of b) c = CRC[(c ^ x) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const u32le = (n) => { const b = Buffer.alloc(4); b.writeUInt32LE(n); return b; };
const u32be = (n) => { const b = Buffer.alloc(4); b.writeUInt32BE(n >>> 0); return b; };

// Put `note` (a string) into the image's metadata without touching its pixels. Returns the new file.
function embed(img, kind, note) {
  const text = Buffer.from(note, 'latin1');
  if (kind === 'png') {                       // a tEXt chunk just before IEND
    const data = Buffer.concat([Buffer.from('xtrata-game\0', 'latin1'), text]);
    const body = Buffer.concat([Buffer.from('tEXt'), data]);
    const chunk = Buffer.concat([u32be(data.length), body, u32be(crc32(body))]);
    const iend = img.length - 12;
    if (img.subarray(iend + 4, iend + 8).toString() !== 'IEND') throw new Error('the png has no IEND chunk at its end');
    return Buffer.concat([img.subarray(0, iend), chunk, img.subarray(iend)]);
  }
  // webp: RIFF container. Make sure there is a VP8X header with the XMP flag, then append an XMP chunk.
  const chunks = [];
  for (let o = 12; o + 8 <= img.length;) { const t = img.subarray(o, o + 4).toString(), n = img.readUInt32LE(o + 4); chunks.push({ t, d: img.subarray(o + 8, o + 8 + n) }); o += 8 + n + (n & 1); }
  if (!chunks.length) throw new Error('the webp has no chunks');
  if (chunks[0].t !== 'VP8X') {
    const d = chunks[0].d; let w, h;
    if (chunks[0].t === 'VP8 ') { w = d.readUInt16LE(6) & 0x3fff; h = d.readUInt16LE(8) & 0x3fff; }
    else if (chunks[0].t === 'VP8L') { const v = d.readUInt32LE(1); w = (v & 0x3fff) + 1; h = ((v >>> 14) & 0x3fff) + 1; }
    else throw new Error('unknown webp layout');
    const x = Buffer.alloc(10); x[0] = chunks[0].t === 'VP8L' ? 0x10 : 0; x.writeUIntLE(w - 1, 4, 3); x.writeUIntLE(h - 1, 7, 3);   // (alpha flag set only if VP8L may carry alpha)
    chunks.unshift({ t: 'VP8X', d: x });
  }
  chunks[0].d = Buffer.from(chunks[0].d); chunks[0].d[0] |= 0x04;     // XMP present
  const xmp = Buffer.concat([Buffer.from('<?xpacket begin="" id="W5M0MpCehiHzreSzNTczkc9d"?><x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description xmlns:xtrata="https://xtrata.xyz/ns/">', 'latin1'),
    text, Buffer.from('</rdf:Description></rdf:RDF></x:xmpmeta><?xpacket end="w"?>', 'latin1')]);
  chunks.push({ t: 'XMP ', d: xmp });
  const parts = chunks.map(({ t, d }) => Buffer.concat([Buffer.from(t, 'latin1'), u32le(d.length), d, d.length & 1 ? Buffer.alloc(1) : Buffer.alloc(0)]));
  const body = Buffer.concat([Buffer.from('WEBP'), ...parts]);
  return Buffer.concat([Buffer.from('RIFF'), u32le(body.length), body]);
}

const game = readFileSync(args.gameFile);
const gid = Number(args.gameInscription);
const title = String(args.title);
if (!(Number.isSafeInteger(gid) && gid > 0)) bad('--game-inscription must be a positive whole number');
if (!ID_OK.test(args.id)) bad(`the id "${args.id}" must be 3-24 characters of a-z, 0-9 and _ (it is also the name of the score board)`);
if (BUILT_IN.some((b) => args.id.startsWith(b))) bad(`the id "${args.id}" begins with a built-in id`);
if (title.length < 1 || title.length > 32) bad('the title must be 1-32 characters');
if (!game.length || game.length > 16 * 1024 * 1024) bad('the game file is empty or over 16 MiB');
if (!/<html|<!doctype html|<script/i.test(game.toString('utf8'))) bad('the game file does not look like a web page');
const poster = readFileSync(args.poster), marquee = readFileSync(args.marquee);
const pk = kindOf(poster), mk = kindOf(marquee);
if (pk !== 'webp' && pk !== 'png') bad('--poster must be a webp or png picture');
if (!mk) bad('--marquee must be a jpeg, png or webp picture');
if (marquee.length > 1.4 * 1024 * 1024) bad('the marquee is too big (over 1.4 MB)');
if (problems.length) { console.log('NOT READY:'); problems.forEach((p) => console.log('  - ' + p)); process.exit(1); }

const note = { v: 1, kind: 'framed-game', board: args.id, game: { id: gid, hash: chainHash(game), size: game.length }, marquee: `data:image/${mk};base64,${marquee.toString('base64')}` };
const text = `<xtrata-game>${JSON.stringify(note)}</xtrata-game>`;
let out;
try { out = embed(poster, pk, text); } catch (e) { console.log('NOT READY:\n  - ' + e.message); process.exit(1); }
if (out.length > CONTRACT_MAX) { console.log(`NOT READY:\n  - the picture is ${out.length} bytes; the games contract allows at most ${CONTRACT_MAX} (1 MiB). Use a smaller poster or marquee.`); process.exit(1); }
writeFileSync(args.out, out);
console.log(`wrote       ${args.out}  (${out.length} bytes, ${Math.ceil(out.length / CHUNK)} chunks of 16 KiB, ${pk}; the poster was ${poster.length} bytes)`);
console.log(`game        inscription #${gid}, ${game.length} bytes, xtrata hash ${note.game.hash}`);
console.log('\nDo these in order (nothing here has been sent):');
console.log('  1. Open the picture in a browser: it should look exactly like your poster.');
console.log('  2. Check the game hash above is what the chain holds for #' + gid + ' (the file you passed must be the exact bytes of that inscription).');
console.log(`  3. From the games admin wallet (xtrata.btc), inscribe the picture with Xtrata (mime image/${pk}). Note its inscription id and wait until it is sealed.`);
console.log(`  4. On the scores contract, the board "${args.id}" must exist (astro3 already does on xtrata-arcade-scores-v2).`);
console.log('  5. On xtrata-games-v1, as the admin, call add-game with:');
console.log(`       id          "${args.id}"`);
console.log(`       title       "${title}"`);
console.log('       code-id     u<the picture\'s inscription id from step 3>');
console.log(`       code-hash   0x${chainHash(out)}`);
console.log(`       code-size   u${out.length}`);
console.log('       kind        u3');
console.log(`       engine-min  u${Number(args.engineMin || 1)}`);
