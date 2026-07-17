#!/usr/bin/env node
/**
 * XTRATA DUELS drop generator.
 *
 * Deterministically generates the fighter and weapon collections as small
 * self-contained pixel-art SVGs (grid of rects), plus a manifest with each
 * file's sha256 and the stats the duels contract will derive from it.
 *
 * Reproducible: same SEED => byte-identical files. If the stat audit looks
 * unhealthy, bump SEED and regenerate BEFORE inscribing anything.
 *
 * Usage: node generate.mjs [--fighters 100] [--weapons 100] [--seed 1] [--out ./out]
 */
import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = args.indexOf('--' + name);
  return i >= 0 ? args[i + 1] : dflt;
};
const N_FIGHTERS = Number(opt('fighters', 100));
const N_WEAPONS = Number(opt('weapons', 100));
const SEED = Number(opt('seed', 1));
const OUT = opt('out', './out');

/* ---------- deterministic PRNG (mulberry32 over a hashed label) ---------- */
const seedFrom = (label) => {
  const h = createHash('sha256').update(`xtrata-duels-drop:${SEED}:${label}`).digest();
  return h.readUInt32BE(0);
};
const rng = (label) => {
  let a = seedFrom(label);
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
const rint = (r, a, b) => a + Math.floor(r() * (b - a + 1));

/* ---------- palettes ---------- */
const FIGHTER_PALETTES = [
  { name: 'ember',   bg: '#1a0b12', skin: '#e8734a', armor: '#8a2f2f', trim: '#ffd561', eye: '#61ffb0' },
  { name: 'glacier', bg: '#0a1223', skin: '#9fc2ff', armor: '#33518f', trim: '#dfe8ff', eye: '#ff5d8f' },
  { name: 'toxin',   bg: '#0b1a0e', skin: '#8fe07a', armor: '#2f8a52', trim: '#eaff61', eye: '#ff9c41' },
  { name: 'void',    bg: '#120b1a', skin: '#b48ae0', armor: '#5a2f8a', trim: '#61e9ff', eye: '#ffe061' },
  { name: 'signal',  bg: '#1a160b', skin: '#e0c98a', armor: '#8a6b2f', trim: '#61ff9e', eye: '#61b0ff' },
  { name: 'rust',    bg: '#140d0a', skin: '#d99a6c', armor: '#7a4a2d', trim: '#a8fff3', eye: '#ff6161' },
  { name: 'mono',    bg: '#0d0d0f', skin: '#cfcfd6', armor: '#4a4a55', trim: '#ffffff', eye: '#ffd561' },
  { name: 'reef',    bg: '#081418', skin: '#6cd9c9', armor: '#2d6b7a', trim: '#ffb461', eye: '#e061ff' }
];
const WEAPON_PALETTES = [
  { name: 'steel',   bg: '#0d0f14', blade: '#c9d4e8', grip: '#5a3a24', glow: '#61b0ff' },
  { name: 'obsidian',bg: '#0a0a0d', blade: '#3a3a48', grip: '#8a2f2f', glow: '#ff5d5d' },
  { name: 'jade',    bg: '#0a120c', blade: '#7ad9a0', grip: '#2f4a3a', glow: '#eaff61' },
  { name: 'plasma',  bg: '#0c0a14', blade: '#b48ae0', grip: '#33406f', glow: '#61e9ff' },
  { name: 'gold',    bg: '#12100a', blade: '#ffd561', grip: '#6b4a1a', glow: '#fff3a8' },
  { name: 'blood',   bg: '#120a0a', blade: '#e05a5a', grip: '#3a1414', glow: '#ffb461' }
];

/* ---------- pixel canvas -> compact SVG ---------- */
class Grid {
  constructor(w, h) { this.w = w; this.h = h; this.px = new Map(); }
  set(x, y, c) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h || !c) return;
    this.px.set(y * this.w + x, c);
  }
  mirror() { // mirror left half onto right
    for (let y = 0; y < this.h; y++)
      for (let x = 0; x < Math.floor(this.w / 2); x++) {
        const c = this.px.get(y * this.w + x);
        if (c) this.set(this.w - 1 - x, y, c);
      }
  }
  toSvg(bg, title) {
    // run-length encode horizontal runs into rects, grouped by colour
    const byColor = new Map();
    for (let y = 0; y < this.h; y++) {
      let x = 0;
      while (x < this.w) {
        const c = this.px.get(y * this.w + x);
        if (!c) { x++; continue; }
        let len = 1;
        while (x + len < this.w && this.px.get(y * this.w + x + len) === c) len++;
        if (!byColor.has(c)) byColor.set(c, []);
        byColor.get(c).push(`M${x} ${y}h${len}v1h-${len}z`);
        x += len;
      }
    }
    let paths = '';
    for (const [c, ds] of byColor) paths += `<path fill="${c}" d="${ds.join('')}"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.w} ${this.h}" shape-rendering="crispEdges">` +
      `<title>${title}</title><rect width="${this.w}" height="${this.h}" fill="${bg}"/>${paths}</svg>`;
  }
}

/* ---------- fighter drawing (24x24, mirrored) ---------- */
const FIGHTER_CLASSES = ['bruiser', 'ronin', 'sentinel', 'phantom', 'berserk', 'monk'];
function drawFighter(i) {
  const r = rng(`fighter:${i}`);
  const pal = pick(r, FIGHTER_PALETTES);
  const cls = pick(r, FIGHTER_CLASSES);
  const g = new Grid(24, 24);
  const half = 12;
  const headW = rint(r, 3, 5);       // half-width of head
  const headTop = rint(r, 2, 4);
  const headBot = headTop + rint(r, 5, 7);
  const jaw = rint(r, 0, 2);
  // head
  for (let y = headTop; y <= headBot; y++)
    for (let x = half - headW; x < half; x++) {
      const edge = (y === headTop || y === headBot) && x < half - headW + jaw;
      if (!edge) g.set(x, y, pal.skin);
    }
  // eyes
  const eyeY = headTop + rint(r, 2, 3);
  const eyeX = half - rint(r, 2, Math.max(2, headW - 1));
  g.set(eyeX, eyeY, pal.eye);
  if (r() < 0.35) g.set(eyeX, eyeY + 1, pal.eye); // tall eyes
  // helmet / crest
  const crest = rint(r, 0, 3);
  for (let x = half - headW - (crest > 1 ? 1 : 0); x < half; x++) {
    g.set(x, headTop - 1, pal.armor);
    if (crest >= 2) g.set(x, headTop - 2, pal.trim);
  }
  if (crest === 3) for (let y = headTop - 4; y < headTop - 1; y++) g.set(half - 1, y, pal.trim);
  // body
  const shW = headW + rint(r, 1, 3);
  const bodyTop = headBot + 1;
  const bodyBot = bodyTop + rint(r, 5, 7);
  for (let y = bodyTop; y <= bodyBot; y++) {
    const taper = Math.floor(((y - bodyTop) / Math.max(1, bodyBot - bodyTop)) * rint(r, 0, 2));
    for (let x = half - shW + taper; x < half; x++) g.set(x, y, pal.armor);
  }
  // trim stripe / belt
  const beltY = bodyBot - rint(r, 1, 2);
  for (let x = half - shW + 1; x < half; x++) g.set(x, beltY, pal.trim);
  // shoulder pads
  if (r() < 0.6) { g.set(half - shW, bodyTop, pal.trim); g.set(half - shW, bodyTop + 1, pal.trim); }
  // arms
  for (let y = bodyTop + 1; y <= bodyBot - 1; y++) g.set(half - shW - 1, y, pal.skin);
  // legs
  const legBot = Math.min(22, bodyBot + rint(r, 3, 5));
  for (let y = bodyBot + 1; y <= legBot; y++) { g.set(half - 2, y, pal.armor); g.set(half - 3, y, pal.armor); }
  for (let x = half - 4; x < half - 1; x++) g.set(x, legBot + 1, pal.trim); // boots
  g.mirror();
  // asymmetric scar/mark AFTER mirror for character
  if (r() < 0.4) g.set(half + rint(r, 1, 3), eyeY + rint(r, 1, 2), pal.trim);
  const name = `Duelist #${i} — ${cls} of ${pal.name}`;
  return { svg: g.toSvg(pal.bg, name), meta: { index: i, class: cls, palette: pal.name } };
}

/* ---------- weapon drawing (24x24, diagonal showcase) ---------- */
const WEAPON_CLASSES = ['blade', 'axe', 'hammer', 'blaster', 'staff', 'claw'];
function drawWeapon(i) {
  const r = rng(`weapon:${i}`);
  const pal = pick(r, WEAPON_PALETTES);
  const cls = pick(r, WEAPON_CLASSES);
  const g = new Grid(24, 24);
  // thick diagonal grip from bottom-left (2px wide) with wraps
  const gripLen = rint(r, 5, 7);
  for (let t = 0; t < gripLen; t++) {
    const x = 5 + t, y = 19 - t;
    g.set(x, y, pal.grip); g.set(x + 1, y, pal.grip); g.set(x, y + 1, pal.grip);
    if (t % 2 === 0) g.set(x + 1, y + 1, pal.glow); // wrap studs
  }
  // pommel
  g.set(4, 20, pal.glow); g.set(5, 20, pal.glow); g.set(4, 19, pal.glow);
  const hx = 5 + gripLen, hy = 19 - gripLen; // head anchor
  const thick = (x, y, c) => { g.set(x, y, c); g.set(x + 1, y, c); g.set(x, y + 1, c); };
  if (cls === 'blade') {
    const len = rint(r, 8, 10);
    // crossguard
    for (let d = -2; d <= 2; d++) g.set(hx - d, hy - 2 + d, pal.glow);
    for (let t = 1; t <= len; t++) {
      thick(hx + t, hy - t, pal.blade);
      if (t <= len - 2) g.set(hx + t + 2, hy - t, pal.blade); // fuller side
      g.set(hx + t - 1, hy - t, pal.glow); // edge shine
    }
    g.set(hx + len + 1, hy - len - 1, pal.glow); // tip
  } else if (cls === 'axe') {
    for (let t = 1; t <= 4; t++) thick(hx + t, hy - t, pal.grip);
    const ax = hx + 4, ay = hy - 4;
    // big crescent head
    for (let dy = -4; dy <= 4; dy++) {
      const w = 5 - Math.floor(Math.abs(dy) * 1.1);
      for (let dx = 0; dx < w; dx++) g.set(ax + 1 + dx, ay + dy, pal.blade);
    }
    for (let dy = -3; dy <= 3; dy++) g.set(ax + 5 - Math.floor(Math.abs(dy) * 0.8), ay + dy, pal.glow); // edge
  } else if (cls === 'hammer') {
    for (let t = 1; t <= 3; t++) thick(hx + t, hy - t, pal.grip);
    const cx = hx + 4, cy = hy - 4;
    for (let dy = -3; dy <= 3; dy++) for (let dx = -2; dx <= 4; dx++) g.set(cx + dx, cy + dy, pal.blade);
    for (let dy = -3; dy <= 3; dy++) g.set(cx + 5, cy + dy, pal.glow);       // striking face
    for (let dx = -2; dx <= 4; dx++) g.set(cx + dx, cy - 4, pal.grip);       // top band
    if (r() < 0.5) for (const [dx, dy] of [[6, -1], [7, 0], [6, 1]]) g.set(cx + dx, cy + dy, pal.glow); // impact
  } else if (cls === 'blaster') {
    const bx = hx, by = hy;
    for (let dx = 0; dx <= 8; dx++) for (let dy = 0; dy <= 2; dy++) g.set(bx + dx, by - dy, pal.blade);
    for (let dx = 2; dx <= 5; dx++) g.set(bx + dx, by - 3, pal.grip);         // top rail
    g.set(bx + 3, by - 4, pal.glow); g.set(bx + 4, by - 4, pal.glow);         // sight
    for (let dy = 0; dy <= 2; dy++) g.set(bx + 9, by - dy, pal.grip);         // muzzle ring
    // muzzle charge
    g.set(bx + 10, by - 1, pal.glow); g.set(bx + 11, by - 1, pal.glow);
    if (r() < 0.6) { g.set(bx + 13, by - 1, pal.glow); g.set(bx + 12, by - 2, pal.glow); g.set(bx + 12, by, pal.glow); }
  } else if (cls === 'staff') {
    for (let t = 1; t <= 5; t++) thick(hx + t, hy - t, pal.grip);
    const ox = hx + 7, oy = hy - 7;
    // orb 3x3 + halo
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) g.set(ox + dx, oy + dy, pal.blade);
    g.set(ox, oy, pal.glow);
    for (const [dx, dy] of [[0, -2], [0, 2], [-2, 0], [2, 0], [-2, -2], [2, 2], [-2, 2], [2, -2]])
      g.set(ox + dx, oy + dy, pal.glow);
  } else { // claw: three thick talons
    for (let f = -1; f <= 1; f++) {
      const len = rint(r, 5, 7);
      for (let t = 1; t <= len; t++) {
        g.set(hx + t + Math.abs(f), hy - t + f * 2, pal.blade);
        g.set(hx + t + Math.abs(f) + 1, hy - t + f * 2, f === 0 ? pal.glow : pal.blade);
      }
    }
  }
  // floor shadow
  for (let x = 4; x <= 14; x += 1) if ((x + i) % 3 !== 0) g.set(x, 22, pal.grip);
  const name = `Relic #${i} — ${pal.name} ${cls}`;
  return { svg: g.toSvg(pal.bg, name), meta: { index: i, class: cls, palette: pal.name } };
}

/* ---------- stats exactly as the contract derives them ---------- */
const statsFor = (buf) => {
  const h = createHash('sha256').update(buf).digest();
  return {
    sha256: h.toString('hex'),
    base: h.readUInt16BE(0) % 100,
    weaponBonus: h.readUInt16BE(0) % 60,
    style: h[3] % 4
  };
};

/* ---------- generate ---------- */
mkdirSync(join(OUT, 'fighters'), { recursive: true });
mkdirSync(join(OUT, 'weapons'), { recursive: true });
const manifest = { seed: SEED, generatedAt: 'deterministic', fighters: [], weapons: [] };
let bytesTotal = 0;

for (let i = 1; i <= N_FIGHTERS; i++) {
  const { svg, meta } = drawFighter(i);
  const file = `fighter-${String(i).padStart(3, '0')}.svg`;
  writeFileSync(join(OUT, 'fighters', file), svg);
  bytesTotal += Buffer.byteLength(svg);
  manifest.fighters.push({ ...meta, file, bytes: Buffer.byteLength(svg), ...statsFor(Buffer.from(svg)) });
}
for (let i = 1; i <= N_WEAPONS; i++) {
  const { svg, meta } = drawWeapon(i);
  const file = `weapon-${String(i).padStart(3, '0')}.svg`;
  writeFileSync(join(OUT, 'weapons', file), svg);
  bytesTotal += Buffer.byteLength(svg);
  manifest.weapons.push({ ...meta, file, bytes: Buffer.byteLength(svg), ...statsFor(Buffer.from(svg)) });
}
writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));

/* ---------- stat audit ---------- */
const hist = (vals, buckets, max) => {
  const out = new Array(buckets).fill(0);
  for (const v of vals) out[Math.min(buckets - 1, Math.floor((v / max) * buckets))]++;
  return out;
};
const fBase = manifest.fighters.map((f) => f.base);
const wBonus = manifest.weapons.map((w) => w.weaponBonus);
const fmt = (h) => h.map((n) => String(n).padStart(3)).join(' ');
console.log(`generated ${N_FIGHTERS} fighters + ${N_WEAPONS} weapons, ${(bytesTotal / 1024).toFixed(1)} KB total`);
console.log(`fighter PWR (0-99)  min ${Math.min(...fBase)} max ${Math.max(...fBase)} avg ${(fBase.reduce((a, b) => a + b) / fBase.length).toFixed(1)}`);
console.log(`  histogram(10): ${fmt(hist(fBase, 10, 100))}`);
console.log(`weapon DMG (0-59)   min ${Math.min(...wBonus)} max ${Math.max(...wBonus)} avg ${(wBonus.reduce((a, b) => a + b) / wBonus.length).toFixed(1)}`);
console.log(`  histogram(10): ${fmt(hist(wBonus, 10, 60))}`);
const styles = [0, 1, 2, 3].map((s) => manifest.fighters.filter((f) => f.style === s).length);
console.log(`fighter styles 0..3: ${styles.join(' / ')} (synergy pairing)`);

/* ---------- preview sheet ---------- */
const cell = (entry, dir, statLabel, statVal, statMax) =>
  `<div class="c"><img src="${dir}/${entry.file}"><div>#${entry.index} ${entry.class}</div>` +
  `<div class="s">${statLabel} ${statVal} · sty ${entry.style}</div>` +
  `<div class="bar"><i style="width:${Math.round((statVal / statMax) * 100)}%"></i></div></div>`;
const sheet = `<!doctype html><meta charset="utf-8"><title>Duels drop preview (seed ${SEED})</title>
<style>body{background:#07091a;color:#dfe8ff;font-family:ui-monospace,monospace;padding:20px}
h2{color:#8fd0ff;letter-spacing:.1em}.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:10px}
.c{background:#0e1730;border:1px solid #2a3a63;border-radius:8px;padding:6px;font-size:10px}
.c img{width:100%;image-rendering:pixelated;border-radius:4px}.s{color:#9db4e8}
.bar{height:4px;background:#182448;border-radius:2px;overflow:hidden;margin-top:3px}
.bar i{display:block;height:100%;background:linear-gradient(90deg,#3a7bff,#61ff9e)}</style>
<h2>FIGHTERS (${N_FIGHTERS})</h2><div class="g">${manifest.fighters.map((f) => cell(f, 'fighters', 'PWR', f.base, 99)).join('')}</div>
<h2>WEAPONS (${N_WEAPONS})</h2><div class="g">${manifest.weapons.map((w) => cell(w, 'weapons', 'DMG', w.weaponBonus, 59)).join('')}</div>`;
writeFileSync(join(OUT, 'preview.html'), sheet);
console.log('wrote manifest.json + preview.html');
