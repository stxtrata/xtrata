// Shared by the SNES catalogue canary and the harness builds: reads the pinned contracts, emulator, ROMs and artwork,
// checks them, and returns the data both pages embed (`snes:pack`).
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dir = resolve(root, 'canaries/snes-catalogue');
const CAT = resolve(root, 'contracts/snes-game-catalogue/contracts/snes-game-catalogue-v1.clar');
const ADA = resolve(root, 'contracts/snes-game-catalogue/contracts/snes-xtrata-adapter-v3-2-3.clar');

const PINNED_CATALOGUE = 'a7a8704be4d6bdc91fd7b71ace78c7936f039ae0e5ad88e99719fd7834533a36';
const PINNED_ADAPTER = '9f2f88c86ed8570b85b2f78f00394af9a1e91d5ca40e3ccc8daaa3fc99690a27';
const PINNED_EMULATOR = 'aa4017bcf37e2600721c6d48bfe4f2d8ec9561a5216b9d130dab401edfce923d'; // snes-emulator-v1.0.html
const PINNED_RELEASE = '6324e69a96a11f6938cc12a679c126812b56a69094806a7fa2e339b74de2637b';
const ROM_MIME = 'application/x-snes-rom';
const MAX_ROM = 512 * 1024;      // one-transaction inscription limit (32 chunks)
const MAX_ART = 200_000;         // the wrapper only shows covers under this size
const sha = (b) => createHash('sha256').update(b).digest('hex');
const fail = (m) => { console.error(m); process.exit(1); };

const catalogue = readFileSync(CAT, 'utf8'), adapter = readFileSync(ADA, 'utf8');
if (sha(catalogue) !== PINNED_CATALOGUE) fail(`catalogue source sha256 ${sha(catalogue)} is not the pinned ${PINNED_CATALOGUE}`);
if (sha(adapter) !== PINNED_ADAPTER) fail(`adapter source sha256 ${sha(adapter)} is not the pinned ${PINNED_ADAPTER}`);

const emu = readFileSync(resolve(dir, 'assets/emulator/snes-emulator-v1.0.html'));
if (sha(emu) !== PINNED_EMULATOR) fail(`emulator is ${sha(emu)}, not the pinned ${PINNED_EMULATOR}`);

const defs = JSON.parse(readFileSync(resolve(dir, 'games.json'), 'utf8'));
const slugs = new Set(), hashes = new Set();
const pngSig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const art = (path, w, h) => {
  if (!path) return null;
  const b = readFileSync(resolve(dir, path));
  if (!b.subarray(0, 8).equals(pngSig)) fail(`${path} is not a PNG`);
  if (b.readUInt32BE(16) !== w || b.readUInt32BE(20) !== h) fail(`${path} is ${b.readUInt32BE(16)}x${b.readUInt32BE(20)}, expected ${w}x${h}`);
  if (b.length > MAX_ART) fail(`${path} is ${b.length} bytes, over ${MAX_ART}`);
  return b;
};
const games = defs.map((d) => {
  if (!/^[a-z0-9-]{1,32}$/.test(d.slug) || slugs.has(d.slug)) fail(`bad or duplicate slug ${d.slug}`);
  slugs.add(d.slug);
  if (d.title.length < 1 || d.title.length > 32) fail(`${d.slug}: title must be 1-32 characters`);
  if (d.note.length > 96) fail(`${d.slug}: note is ${d.note.length} characters, the limit is 96`);
  if (d.profile.length > 16) fail(`${d.slug}: profile is longer than 16 characters`);
  const rom = readFileSync(resolve(dir, d.rom));
  if (!rom.length || rom.length > MAX_ROM) fail(`${d.rom}: ${rom.length} bytes is outside 1..${MAX_ROM}`);
  const canon = rom.length % 1024 === 512 ? rom.subarray(512) : rom;
  const romSha = sha(canon);
  if (hashes.has(romSha)) fail(`${d.slug}: duplicate ROM hash ${romSha}`);
  hashes.add(romSha);
  const cover = art(d.cover, 512, 384), icon = art(d.icon, 256, 256);
  return { slug: d.slug, title: d.title, note: d.note, profile: d.profile, board: d.board, coreMin: d.coreMin, size: rom.length, romSha,
    rom: rom.toString('base64'), cover: cover && cover.toString('base64'), icon: icon && icon.toString('base64'),
    coverSha: cover && sha(cover), iconSha: icon && sha(icon) };
});
const pack = { romMime: ROM_MIME, emulator: { html: emu.toString('utf8'), sha256: PINNED_EMULATOR }, games };
const releaseSha = sha(JSON.stringify({ catalogue: PINNED_CATALOGUE, adapter: PINNED_ADAPTER, emulator: PINNED_EMULATOR, mime: ROM_MIME,
  games: games.map((g) => ({ ...g, rom: sha(Buffer.from(g.rom, 'base64')), cover: g.cover && sha(Buffer.from(g.cover, 'base64')), icon: g.icon && sha(Buffer.from(g.icon, 'base64')) })) }));
if (releaseSha !== PINNED_RELEASE) fail(`release sha256 ${releaseSha} is not the pinned ${PINNED_RELEASE}.\nIf this release is intended, set PINNED_RELEASE = '${releaseSha}' in scripts/build-snes-catalogue-canary.mjs.`);


export { root, dir, sha, fail, catalogue, adapter, games, pack, releaseSha, PINNED_CATALOGUE, PINNED_ADAPTER, PINNED_RELEASE };
export const packPlugin = {
  name: 'snes-pack',
  setup(b) {
    b.onResolve({ filter: /^snes:pack$/ }, () => ({ path: 'pack', namespace: 'snes' }));
    b.onLoad({ filter: /.*/, namespace: 'snes' }, () => ({ contents: JSON.stringify(pack), loader: 'json' }));
  }
};
