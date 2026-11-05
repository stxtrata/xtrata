// Deploy step (called from vite.config.ts after the build, next to prune-casino-machines-dist.mjs).
//
// public/casino-machines/<id>/pack.json holds a machine's 3D model and its playable game as gzipped base64 text, so one machine
// is 1 to 7 MB of JSON and a floor of twelve is about 28 MB, all fetched before the room can be built and all decoded on every
// visit, although the game is only needed when someone sits down to play.
//
// For each pack, this writes into dist/ only (the source files, and every machine's own page, are left exactly as they are):
//   dist/casino-assets/<id>-model.<hash>.bin   the model, as the gzip bytes (a quarter smaller than the base64)
//   dist/casino-assets/<id>-game.<hash>.bin    the game, the same way
//   dist/casino-machines/<id>/pack.slim.json   the pack without model and game, with modelUrl / modelBytes / gameUrl / gameBytes
//
// The casino page asks for pack.slim.json first and falls back to pack.json, so a build without this step still works.
// /casino-assets/* is served `immutable` (public/_headers): a changed machine is a new file name, so a return visit downloads
// none of the models, and the games are fetched only when played.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export function splitCasinoPacks(distDir) {
  const root = path.join(distDir, 'casino-machines');
  const assets = path.join(distDir, 'casino-assets');
  const done = [];
  const skipped = [];
  if (!fs.existsSync(root)) return { done, skipped };
  fs.mkdirSync(assets, { recursive: true });
  const put = (id, name, b64) => {
    const bytes = Buffer.from(b64, 'base64');
    if (bytes.length < 20 || bytes[0] !== 0x1f || bytes[1] !== 0x8b) throw new Error(`${id} ${name} is not gzip data`);
    const hash = crypto.createHash('sha256').update(bytes).digest('hex').slice(0, 10);
    const file = `${id}-${name}.${hash}.bin`;
    const target = path.join(assets, file);
    if (!fs.existsSync(target)) fs.writeFileSync(target, bytes);
    return { url: '/casino-assets/' + file, bytes: bytes.length };
  };
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const id = entry.name;
    const src = path.join(root, id, 'pack.json');
    if (!fs.existsSync(src)) continue;
    try {
      const pack = JSON.parse(fs.readFileSync(src, 'utf8'));
      if (!pack || typeof pack.model !== 'string' || typeof pack.game !== 'string') { skipped.push(id + ' (no inline model/game)'); continue; }
      const { model, game, ...rest } = pack;
      const m = put(id, 'model', model);
      const g = put(id, 'game', game);
      const slim = { ...rest, modelUrl: m.url, modelBytes: m.bytes, gameUrl: g.url, gameBytes: g.bytes };
      fs.writeFileSync(path.join(root, id, 'pack.slim.json'), JSON.stringify(slim));
      done.push(id);
    } catch (e) {
      // never fail a deploy over one machine: it keeps its pack.json, which the page falls back to
      skipped.push(id + ' (' + (e && e.message) + ')');
    }
  }
  return { done, skipped };
}
