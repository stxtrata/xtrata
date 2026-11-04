#!/usr/bin/env node
// Builds the Rare Pepe Directory cabinet (src/model.json) in a headless browser with the same THREE build the machines use.
//   node tools/build-cabinet.mjs [--preview]
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const TOOLS = dirname(fileURLToPath(import.meta.url)), HERE = resolve(TOOLS, '..');
// THREE and the XLOGO vector code come from this folder's vendor/ (copies of the casino's own, never written here).
const three = readFileSync(join(HERE, 'vendor/three-subset.js'), 'utf8'), xlogo = readFileSync(join(HERE, 'vendor/xlogo.js'), 'utf8');
const manifest = JSON.parse(readFileSync(join(HERE, 'art/manifest.json'), 'utf8'));
// Real asset names from the Directory for the display cases and the topper: Series 1 first, then spread through the 36 series.
const names = [manifest.rare.names[0], ...[75, 130, 210, 280, 340, 410, 470, 540, 610, 700, 800, 910, 1020, 1130, 1260, 1400, 1530].map(i => manifest.rare.names[i]).filter(Boolean)];
const page = `<!doctype html><html><body style="margin:0;background:#222"><script>${three}</script><script>${xlogo}</script><script>${readFileSync(join(HERE, 'src/cabinet.js'), 'utf8')}</script></body></html>`;
mkdirSync(join(HERE, 'dist'), { recursive: true }); writeFileSync(join(HERE, 'dist/cabinet-builder.html'), page);

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await browser.newPage({ viewport: { width: 900, height: 1100 } });
p.on('pageerror', e => console.error('page error:', e.message));
await p.setContent(page);
const r = await p.evaluate(o => window.buildCabinet(o), { names, total: manifest.rare.count });
writeFileSync(join(HERE, 'src/model.json'), r.json);
console.log('src/model.json', (r.json.length / 1024).toFixed(0) + ' KB', JSON.stringify(r.stats));
if (process.argv.includes('--preview')) {
  // Rebuild the exported model the way the casino does (packedCabinet) and photograph it, front and three-quarter.
  const shots = await p.evaluate(json => {
    const d = JSON.parse(json); const imgs = d.textures.map(t => { const i = new Image(); i.src = t.image; return i; });
    return Promise.all(imgs.map(i => i.decode())).then(() => {
      const geos = d.geometries.map(g => { const o = new THREE.BufferGeometry(); for (const [k, v] of Object.entries(g.attributes)) o.setAttribute(k, new THREE.BufferAttribute(new Float32Array(v.array), v.size)); if (g.index) o.setIndex(g.index); for (const gr of g.groups) o.addGroup(gr.start, gr.count, gr.materialIndex); return o; });
      const tex = d.textures.map((t, i) => { const o = new THREE.CanvasTexture(imgs[i]); o.flipY = t.flipY; o.colorSpace = THREE.SRGBColorSpace; o.needsUpdate = true; return o; });
      const env = document.createElement('canvas'); env.width = 512; env.height = 256; const eg = env.getContext('2d'); const gr = eg.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, '#e6ffe9'); gr.addColorStop(.5, '#1a3a24'); gr.addColorStop(1, '#08120b'); eg.fillStyle = gr; eg.fillRect(0, 0, 512, 256); const envTex = new THREE.CanvasTexture(env); envTex.mapping = THREE.EquirectangularReflectionMapping;
      const mats = d.materials.map(m => { const props = { color: m.color, map: m.map == null ? null : tex[m.map], transparent: m.transparent, opacity: m.opacity, side: m.side, alphaTest: m.alphaTest }; return m.type === 'basic' ? new THREE.MeshBasicMaterial(props) : new THREE.MeshStandardMaterial(Object.assign(props, { roughness: m.roughness, metalness: m.metalness, envMap: envTex, envMapIntensity: .65 })); });
      const node = n => { const o = n.g == null ? new THREE.Group() : new THREE.Mesh(geos[n.g], Array.isArray(n.m) ? n.m.map(i => mats[i]) : mats[n.m]); o.position.fromArray(n.p); o.quaternion.fromArray(n.q); o.scale.fromArray(n.s); n.children.forEach(c => o.add(node(c))); return o; };
      const scene = new THREE.Scene(); scene.background = new THREE.Color('#0f1612'); const m = node(d.root); scene.add(m);
      scene.add(new THREE.HemisphereLight(0xffead7, 0x192437, 1.2)); const l = new THREE.PointLight(0xffdfb3, 60, 40, 1.4); l.position.set(3, 6, 8); scene.add(l); const l2 = new THREE.PointLight(0xffc890, 25, 30, 1.4); l2.position.set(-4, 4, 5); scene.add(l2);
      const r = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); r.setSize(900, 1100); r.outputColorSpace = THREE.SRGBColorSpace; document.body.appendChild(r.domElement);
      const cam = new THREE.PerspectiveCamera(32, 900 / 1100, .1, 100), out = [];
      for (const [x, y, z] of [[0, 3.1, 11.5], [6.5, 3.6, 9.2], [-3.2, 3.0, 3.6]]) { cam.position.set(x, y, z); cam.lookAt(0, x < 0 ? 4.2 : 2.9, 0); r.render(scene, cam); out.push(r.domElement.toDataURL('image/png')); }
      return out;
    });
  }, r.json);
  shots.forEach((s, i) => writeFileSync(join(HERE, `dist/cabinet-${i}.png`), Buffer.from(s.split(',')[1], 'base64')));
  console.log('previews written to dist/');
}
await browser.close();
