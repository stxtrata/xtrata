#!/usr/bin/env node
/*
 * Xtrata Arcade: the world preview page
 *
 *   node build/modular.mjs build     first: src/ -> dist/
 *   node build/preview.mjs           dist single file + build/preview-head.html -> public/arcade-world-preview/index.html
 *   node build/preview.mjs --check   exit 1 if the committed page is not what this would write
 *
 * The preview is the real hall with a small head script on top (sample data for the world reader, panel of buttons).
 * build/rooms/*.html (the casino room) are copied beside it. Nothing in it is on chain. It is a static file served from public/, so it only changes when this is re-run and the
 * result is committed and merged. Re-run it whenever the hall (src/) or build/preview-head.html changes.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const OUT = resolve(root, '..', '..', 'public', 'arcade-world-preview', 'index.html');
const files = readdirSync(join(root, 'dist')).filter((f) => /^xtrata-arcade-v[\d.]+\.html$/.test(f)).sort();
if (!files.length) { console.error('no dist/xtrata-arcade-v*.html: run node build/modular.mjs build first'); process.exit(1); }
const hall = readFileSync(join(root, 'dist', files[files.length - 1]), 'utf8');
const head = readFileSync(join(here, 'preview-head.html'), 'utf8').replace(/\s+$/, '\n');   // starts "<head><script>", ends "</script>"
const at = hall.indexOf('<head>');
if (at < 0) throw new Error('the hall has no <head>');
const page = hall.slice(0, at) + head + hall.slice(at + '<head>'.length).replace(/^\n/, '');
// Rooms that are their own page (build/rooms/*.html) sit beside the preview, so the hall can frame them (the lobby's CASINO door).
const roomsDir = join(here, 'rooms'), outDir = dirname(OUT);
const rooms = existsSync(roomsDir) ? readdirSync(roomsDir).filter((f) => /\.html$/.test(f)).sort() : [];
if (process.argv.includes('--check')) {
  let cur = ''; try { cur = readFileSync(OUT, 'utf8'); } catch (e) {}
  const stale = rooms.filter((f) => { try { return readFileSync(join(outDir, f), 'utf8') !== readFileSync(join(roomsDir, f), 'utf8'); } catch (e) { return true; } });
  if (cur !== page || stale.length) { console.error('preview is out of date: run node build/preview.mjs' + (stale.length ? ' (rooms: ' + stale.join(', ') + ')' : '')); process.exit(1); }
  console.log('preview is up to date'); process.exit(0);
}
writeFileSync(OUT, page);
rooms.forEach((f) => writeFileSync(join(outDir, f), readFileSync(join(roomsDir, f))));
console.log('wrote', OUT, (page.length / 1024).toFixed(0) + ' KB from', files[files.length - 1]);
