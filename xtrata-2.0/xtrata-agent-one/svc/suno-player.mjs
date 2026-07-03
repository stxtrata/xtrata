#!/usr/bin/env node
/**
 * Xtrata Agent One — SUNO player builder (the opus tool's player, automated).
 * -------------------------------------------------------------------------
 * Turns a Suno-style MP3 into a single, self-contained **HTML player** that is
 * what gets inscribed: the optimised Opus audio, the embedded cover art, and the
 * song title / artist are all combined into one file using the *exact* player the
 * opus-file-generator produces on its main page.
 *
 * Pipeline (all server-side, ffmpeg-only — no ffprobe needed):
 *   1. extract tags  (title/artist/album/comment) via `ffmpeg -f ffmetadata -`
 *   2. extract cover  (the attached_pic) via `ffmpeg ... -f image2pipe -` + magic-byte mime sniff
 *   3. base64 the Opus (.weba) produced by opus-convert.mjs + base64 the cover
 *   4. feed an { mode:'embedded', audioBase64, imageBase64, metadata } config to the
 *      vendored template (svc/vendor/HTML_Template.js, byte-identical to the tool)
 *      run in a Node `vm` shim, yielding the same `xtrata-opus-player-v6` player
 *      (eye → Controls tab, hover waveform transport over the artwork, and a
 *      2 s cursor-idle fade of all layered overlays so the artwork shows clean).
 *
 * The vendored template's `buildXtrataAudioPlayerHtml` is pure string-building, so
 * running it under a minimal `{ window }` context reproduces the browser tool's
 * output exactly. To re-sync after a tool update, just re-copy HTML_Template.js.
 *
 * FAIL-SAFE: never throws. On any problem the caller (core.runJob) falls back to
 * inscribing the plain Opus file, or the original.
 *
 * CLI:
 *   node suno-player.mjs <audio.mp3> [out.html]   # convert -> build a player
 *   node suno-player.mjs --selftest               # offline build + verify
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import vm from 'node:vm';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolveFfmpeg, convertToOpusWebm } from './opus-convert.mjs';

const log = (o) => { try { console.log(JSON.stringify({ mod: 'suno-player', ...o })); } catch {} };

// ----------------------------- vendored template -----------------------------
let _build = null;
function getBuilder() {
  if (_build) return _build;
  const p = fileURLToPath(new URL('./vendor/HTML_Template.js', import.meta.url));
  const code = fs.readFileSync(p, 'utf8');
  const sandbox = { window: {}, console, navigator: { userAgent: 'node' } };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: 'HTML_Template.js' });
  _build = sandbox.window.buildXtrataAudioPlayerHtml;
  if (typeof _build !== 'function') throw new Error('vendored template did not export buildXtrataAudioPlayerHtml');
  return _build;
}
/** Build player HTML from a config (exact opus-tool template). */
export function buildPlayerHtml(config) { return getBuilder()(config); }

// ----------------------------- ffmpeg helpers --------------------------------
function runCapture(ff, args, encoding) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const c = spawn(ff, args, { stdio: ['ignore', 'pipe', 'ignore'] });
    c.stdout.on('data', (d) => chunks.push(d));
    c.on('error', reject);
    c.on('close', () => { const buf = Buffer.concat(chunks); resolve(encoding ? buf.toString(encoding) : buf); });
  });
}

// ffmetadata: unescape \=, \;, \#, \\ ; physical lines ending in an odd run of
// backslashes are continuations (escaped newlines) — join them so a multi-line
// value (e.g. lyrics) can't be mis-read as separate keys.
const ffUnescape = (s) => String(s).replace(/\\(.)/g, (_m, c) => c);
function parseFfmetadata(text) {
  const out = {}; const lines = String(text).split('\n'); let i = 0;
  const endsEscaped = (s) => { let n = 0; for (let j = s.length - 1; j >= 0 && s[j] === '\\'; j--) n++; return n % 2 === 1; };
  while (i < lines.length) {
    let line = lines[i++];
    if (!line || line[0] === ';' || line[0] === '#') continue;
    while (endsEscaped(line) && i < lines.length) line = line.slice(0, -1) + '\n' + lines[i++];
    let eq = -1;
    for (let j = 0; j < line.length; j++) if (line[j] === '=') { let n = 0, k = j - 1; while (k >= 0 && line[k] === '\\') { n++; k--; } if (n % 2 === 0) { eq = j; break; } }
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim().toLowerCase();
    if (!(key in out)) out[key] = ffUnescape(line.slice(eq + 1));
  }
  return out;
}

/** Read tags from any media file with ffmpeg alone. Returns {} on failure. */
export async function extractMetadata(filePath, ff) {
  try {
    const text = await runCapture(ff, ['-y', '-hide_banner', '-loglevel', 'error', '-i', filePath, '-f', 'ffmetadata', '-'], 'utf8');
    const m = parseFfmetadata(text);
    const lyricsKey = Object.keys(m).find((k) => /^lyrics/.test(k) || k === 'unsyncedlyrics' || k === 'uslt');
    const lyrics = m['lyrics-eng'] || m['lyrics'] || (lyricsKey ? m[lyricsKey] : '') || '';
    return { title: m.title || '', artist: m.artist || '', album: m.album || '', comment: m.comment || '', genre: m.genre || '', date: m.date || '', lyrics, raw: m };
  } catch { return { title: '', artist: '', album: '', comment: '', genre: '', date: '', lyrics: '', raw: {} }; }
}

function sniffImageMime(buf) {
  if (buf.length >= 3 && buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return 'image/jpeg';
  if (buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return 'image/png';
  if (buf.length >= 6 && buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return 'image/gif';
  if (buf.length >= 12 && buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 && buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) return 'image/webp';
  return null;
}

/** Extract the embedded cover (attached_pic) as { base64, mime, bytes } or null. */
export async function extractCover(filePath, ff) {
  try {
    const buf = await runCapture(ff, ['-hide_banner', '-loglevel', 'error', '-i', filePath, '-an', '-map', '0:v:0', '-c', 'copy', '-frames:v', '1', '-f', 'image2pipe', '-'], null);
    if (!buf || !buf.length) return null;
    const mime = sniffImageMime(buf);
    if (!mime) return null;
    return { base64: buf.toString('base64'), mime, bytes: buf.length };
  } catch { return null; }
}

/** Heuristic: does this look like a Suno export? */
export function isSunoSource(meta = {}, filePath = '') {
  const hay = `${meta.comment || ''} ${meta.title || ''} ${meta.artist || ''} ${meta.album || ''} ${(meta.raw && (meta.raw.encoder || meta.raw.tool)) || ''} ${filePath}`.toLowerCase();
  return /made with suno/.test(hay) || /\bsuno\b/.test(hay);
}

// ------------------------------- orchestrator --------------------------------
/**
 * Build the self-contained player. `audioWebaPath` = the Opus/WebM to embed,
 * `sourcePath` = the original file to read tags + cover from (the MP3).
 * Returns { ok, path, bytes, mime:'text/html', title, artist, hasCover, ... } | { ok:false, reason }.
 */
export async function buildSunoPlayer(opts = {}) {
  const { audioWebaPath, sourcePath, outDir, titleFallback = 'Untitled', ffmpeg } = opts;
  try {
    if (!audioWebaPath || !fs.existsSync(audioWebaPath)) return { ok: false, reason: 'audio (weba) not found' };
    const ff = ffmpeg || await resolveFfmpeg();
    const metaSrc = (sourcePath && fs.existsSync(sourcePath)) ? sourcePath : audioWebaPath;
    const meta = ff ? await extractMetadata(metaSrc, ff) : { title: '', artist: '', album: '' };
    const cover = ff ? await extractCover(metaSrc, ff) : null;
    const audioBase64 = fs.readFileSync(audioWebaPath).toString('base64');

    const title = (meta.title || '').trim() || titleFallback;
    const artist = (meta.artist || '').trim();
    const album = (meta.album || '').trim();
    const lyrics = (meta.lyrics || '').trim();
    const config = {
      mode: 'embedded',
      audioMimeType: 'audio/webm; codecs=opus',
      audioBase64,
      imageMimeType: cover ? cover.mime : undefined,
      imageBase64: cover ? cover.base64 : undefined,
      artFit: 'cover',
      metadata: { assetType: 'song', title, artist, album, lyrics },
    };
    const html = getBuilder()(config);
    if (!html || html.length < 200 || /Error generating Xtrata audio player/.test(html)) return { ok: false, reason: 'template returned no player' };

    const stem = (path.basename(audioWebaPath).replace(/\.[^.]+$/, '').replace(/\.opus-hq$/, '') || 'player');
    const outPath = opts.outPath || path.join(outDir || path.dirname(audioWebaPath), `${stem}.player.html`);
    fs.writeFileSync(outPath, html);
    const bytes = fs.statSync(outPath).size;
    const isSuno = isSunoSource(meta, metaSrc);
    log({ event: 'player-built', out: path.basename(outPath), bytes, title, artist, cover: cover ? cover.mime : null, lyrics: !!lyrics, suno: isSuno });
    return { ok: true, path: outPath, bytes, mime: 'text/html', title, artist, album, hasCover: !!cover, coverMime: cover ? cover.mime : null, hasLyrics: !!lyrics, lyricsChars: lyrics.length, isSuno, meta };
  } catch (e) { return { ok: false, reason: String((e && e.message) || e) }; }
}

// --------------------------------- self-test ---------------------------------
async function selftest() {
  const ff = await resolveFfmpeg();
  if (!ff) { console.error('selftest: no ffmpeg available'); process.exit(2); }
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'suno-st-'));
  const wav = path.join(tmp, 'tone.wav');
  const weba = path.join(tmp, 'tone.weba');
  spawnSync(ff, ['-y', '-hide_banner', '-loglevel', 'error', '-f', 'lavfi', '-i', 'sine=frequency=440:sample_rate=48000:duration=4', '-ac', '2', wav], { stdio: 'ignore' });
  // weba carrying title/artist tags (matroska metadata) — exercises metadata extraction
  spawnSync(ff, ['-y', '-hide_banner', '-loglevel', 'error', '-i', wav, '-c:a', 'libopus', '-b:a', '96k',
    '-metadata', 'title=Self Test Track', '-metadata', 'artist=Agent One', '-metadata', 'comment=made with suno', '-f', 'webm', weba], { stdio: 'ignore' });

  const r = await buildSunoPlayer({ audioWebaPath: weba, sourcePath: weba, outDir: tmp, titleFallback: 'Untitled', ffmpeg: ff });
  const checks = {
    ok: !!r.ok,
    titleEmbedded: !!r.ok && fs.readFileSync(r.path, 'utf8').includes('Self Test Track'),
    artistEmbedded: !!r.ok && fs.readFileSync(r.path, 'utf8').includes('Agent One'),
    audioEmbedded: !!r.ok && fs.readFileSync(r.path, 'utf8').includes('data:audio/webm;codecs=opus;base64,'),
    sunoDetected: !!r.isSuno,
    isHtml: r.mime === 'text/html',
  };
  // cover path: build directly with a synthesized jpeg cover
  const cover = path.join(tmp, 'c.jpg');
  spawnSync(ff, ['-y', '-hide_banner', '-loglevel', 'error', '-f', 'lavfi', '-i', 'color=c=teal:s=240x240:d=1', '-frames:v', '1', cover], { stdio: 'ignore' });
  const audioB64 = fs.readFileSync(weba).toString('base64');
  const coverHtml = buildPlayerHtml({ mode: 'embedded', audioMimeType: 'audio/webm; codecs=opus', audioBase64: audioB64, imageMimeType: 'image/jpeg', imageBase64: fs.readFileSync(cover).toString('base64'), metadata: { title: 'Cover Test', artist: 'X' } });
  checks.coverEmbedded = coverHtml.includes('data:image/jpeg;base64,');
  // lyrics panel: present + rendered when supplied, absent when not
  const lyricHtml = buildPlayerHtml({ mode: 'embedded', audioMimeType: 'audio/webm; codecs=opus', audioBase64: audioB64, metadata: { title: 'L', artist: 'A', lyrics: 'line one\nline two\nline three' } });
  checks.lyricsTab = lyricHtml.includes('data-panel-target="lyrics"');
  checks.lyricsText = lyricHtml.includes('line one') && lyricHtml.includes('line three');
  const noLyricHtml = buildPlayerHtml({ mode: 'embedded', audioMimeType: 'audio/webm; codecs=opus', audioBase64: audioB64, metadata: { title: 'L', artist: 'A' } });
  checks.lyricsHiddenWhenAbsent = !noLyricHtml.includes('data-panel-target="lyrics"');

  const pass = Object.values(checks).every(Boolean);
  console.log(JSON.stringify({ selftest: pass ? 'PASS' : 'FAIL', checks, playerBytes: r.bytes || null }, null, 2));
  try { fs.rmSync(tmp, { recursive: true, force: true }); } catch {}
  process.exit(pass ? 0 : 1);
}

// ----------------------------------- CLI -------------------------------------
const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  if (process.argv.includes('--selftest')) selftest();
  else if (process.argv[2]) {
    const src = process.argv[2], out = process.argv[3];
    (async () => {
      const ff = await resolveFfmpeg();
      if (!ff) { console.error('no ffmpeg'); process.exit(2); }
      const conv = await convertToOpusWebm(src, { outDir: path.dirname(out || src), ffmpeg: ff });
      if (!conv.ok) { console.error('opus convert failed: ' + conv.reason); process.exit(1); }
      const r = await buildSunoPlayer({ audioWebaPath: conv.path, sourcePath: src, outPath: out, outDir: path.dirname(out || src), titleFallback: path.basename(src).replace(/\.[^.]+$/, ''), ffmpeg: ff });
      console.log(JSON.stringify(r, null, 2));
      process.exit(r.ok ? 0 : 1);
    })();
  } else {
    console.log('usage: node suno-player.mjs <audio.mp3> [out.html]   |   node suno-player.mjs --selftest');
  }
}
