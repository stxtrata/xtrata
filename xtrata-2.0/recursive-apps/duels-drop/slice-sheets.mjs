#!/usr/bin/env node
/**
 * SPACE RENEGADE sheet slicer.
 *
 * Cuts Jim's compendium sheets into individual fighter/weapon sprites — each
 * sprite becomes one inscription, so its PNG bytes become its on-chain stats.
 *
 * Config-driven: sheets.config.json describes, per sheet image, the grid
 * region (as fractions of the image), rows/cols, inner padding, and the cell
 * labels in reading order (labels come from the sheet captions and are the
 * source of truth for names). Cells listed in "skip" are ignored.
 *
 * Usage:
 *   node slice-sheets.mjs --art ./art --config ./art/sheets.config.json --out ./out-sr
 *   node slice-sheets.mjs ... --debug     # also writes <sheet>.overlay.png with the grid drawn
 *
 * Then: node audit-sprites.mjs --in ./out-sr   (manifest + stat audit)
 * Requires: npm i sharp
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import sharp from 'sharp';

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
const ART = opt('art', './art');
const CONFIG = opt('config', './art/sheets.config.json');
const OUT = opt('out', './out-sr');
const DEBUG = args.includes('--debug');

const cfg = JSON.parse(readFileSync(CONFIG, 'utf8'));
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const manifest = { source: 'space-renegade-sheets', fighters: [], weapons: [], items: [] };

for (const sheet of cfg.sheets) {
  const path = join(ART, sheet.file);
  const img = sharp(path);
  const meta = await img.metadata();
  const W = meta.width, H = meta.height;
  const rx = Math.round(sheet.region.x * W);
  const ry = Math.round(sheet.region.y * H);
  const rw = Math.round(sheet.region.w * W);
  const rh = Math.round(sheet.region.h * H);
  const cw = rw / sheet.cols, ch = rh / sheet.rows;
  const padX = Math.round((sheet.padX ?? 0.04) * cw);
  const padY = Math.round((sheet.padY ?? 0.04) * ch);
  const labelCut = Math.round((sheet.labelCut ?? 0) * ch); // bottom strip with the caption

  const roleDir = sheet.role + 's';
  mkdirSync(join(OUT, roleDir), { recursive: true });

  let overlays = [];
  let cell = 0;
  for (let r = 0; r < sheet.rows; r++) {
    for (let c = 0; c < sheet.cols; c++, cell++) {
      const label = sheet.labels[cell];
      if (!label || (sheet.skip || []).includes(cell)) continue;
      const left = rx + Math.round(c * cw) + padX;
      const top = ry + Math.round(r * ch) + padY;
      const width = Math.round(cw) - padX * 2;
      const height = Math.round(ch) - padY * 2 - labelCut;
      const file = `${slug(label)}.png`;
      const buf = await sharp(path).extract({ left, top, width, height }).png().toBuffer();
      writeFileSync(join(OUT, roleDir, file), buf);
      const h = createHash('sha256').update(buf).digest();
      const entry = {
        name: label, file: `${roleDir}/${file}`, sheet: sheet.file, bytes: buf.length,
        sha256: h.toString('hex'),
        base: h.readUInt16BE(0) % 100,
        weaponBonus: h.readUInt16BE(0) % 60,
        style: h[3] % 4
      };
      manifest[roleDir].push(entry);
      overlays.push({ left, top, width, height, label });
    }
  }
  if (DEBUG) {
    const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">` +
      overlays.map((o) =>
        `<rect x="${o.left}" y="${o.top}" width="${o.width}" height="${o.height}" fill="none" stroke="#00ff88" stroke-width="4"/>` +
        `<text x="${o.left + 8}" y="${o.top + 34}" fill="#00ff88" font-size="30" font-family="monospace">${o.label}</text>`
      ).join('') + '</svg>';
    await sharp(path).composite([{ input: Buffer.from(svg) }]).png()
      .toFile(join(OUT, sheet.file.replace(/\.[a-z]+$/i, '') + '.overlay.png'));
  }
  console.log(`${sheet.file}: sliced ${overlays.length} ${sheet.role}(s)`);
}

writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));

// stat audit
const audit = (list, key, max, label) => {
  if (!list.length) return;
  const vals = list.map((e) => e[key]);
  console.log(`${label}: n=${vals.length} min ${Math.min(...vals)} max ${Math.max(...vals)} avg ${(vals.reduce((a, b) => a + b) / vals.length).toFixed(1)} (0-${max})`);
  for (const e of list) console.log(`  ${String(e[key]).padStart(3)}  sty ${e.style}  ${e.name}`);
};
audit(manifest.fighters, 'base', 99, 'FIGHTER PWR');
audit(manifest.weapons, 'weaponBonus', 59, 'WEAPON DMG');
audit(manifest.items, 'weaponBonus', 59, 'ITEM DMG');
console.log('wrote', join(OUT, 'manifest.json'));
