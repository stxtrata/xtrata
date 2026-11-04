#!/usr/bin/env node
// Builds the Rune Pit cabinet (src/model.json) in a headless browser with the same THREE build the machines use.
//   node tools/build-cabinet.mjs [--preview]
// THREE (vendor/three-subset.js) and the XLOGO vector code (vendor/xlogo.js) are read, never written.
// --preview rebuilds the exported model the way the casino does (packedCabinet) and photographs it into dist/cabinet-*.png.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
let chromium; try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = await import('playwright')); }

const TOOLS = dirname(fileURLToPath(import.meta.url)), HERE = resolve(TOOLS, '..');
const three = readFileSync(join(HERE, 'vendor/three-subset.js'), 'utf8'), xlogo = readFileSync(join(HERE, 'vendor/xlogo.js'), 'utf8');
const page = `<!doctype html><html><body style="margin:0;background:#222"><script>${three}</script><script>${xlogo}</script><script>${readFileSync(join(HERE, 'src/cabinet.js'), 'utf8')}</script></body></html>`;
mkdirSync(join(HERE, 'dist'), { recursive: true }); writeFileSync(join(HERE, 'dist/cabinet-builder.html'), page);

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await browser.newPage({ viewport: { width: 900, height: 1100 } });
p.on('pageerror', e => console.error('page error:', e.message));
p.on('console', m => { if (m.type() === 'error') console.error('console error:', m.text()); });
await p.setContent(page);
const r = await p.evaluate(() => window.buildCabinet({}));
writeFileSync(join(HERE, 'src/model.json'), r.json);
console.log('src/model.json', (r.json.length / 1024).toFixed(0) + ' KB', JSON.stringify(r.stats));
if (process.argv.includes('--preview')) {
  const only = (process.argv.find(a => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
  // name, camera position, look-at, fov, width, height, lever pose ('rest' | 'peak'), core turn, light level
  const SHOTS = [
    ['front', [0, 3.2, 12.5], [0, 2.95, 0], 32, 900, 1100, 'rest', 0, 1],
    ['threequarter', [6.8, 3.6, 9.4], [0, 2.9, 0], 32, 900, 1100, 'rest', 0, 1],
    ['deck-lever', [4.6, 2.5, 4.4], [1.0, 1.7, .35], 38, 1000, 800, 'rest', 0, 1],
    ['strike', [4.6, 2.3, 4.2], [1.0, 1.5, .45], 38, 1000, 800, 'peak', 0, 1],
    ['topper', [2.2, 5.1, 4.6], [0, 5.2, 0], 38, 1000, 800, 'rest', .5, 1],
    ['screen', [0, 3.0, 4.2], [0, 2.95, 0], 38, 1000, 800, 'rest', 0, 1],
    ['door', [-1.5, 1.2, 3.6], [0, .9, 0], 36, 1000, 800, 'rest', 0, 1],
    ['rear', [-5.5, 3.2, -8.5], [0, 2.9, 0], 32, 900, 1100, 'rest', 0, 1],
    ['dim', [5.2, 3.0, 7.6], [0, 2.8, 0], 32, 900, 1100, 'rest', .8, .28]
  ].filter(s => !only.length || only.includes(s[0]));
  const shots = await p.evaluate(({ json, SHOTS }) => {
    const d = JSON.parse(json); const imgs = d.textures.map(t => { const i = new Image(); i.src = t.image; return i; });
    return Promise.all(imgs.map(i => i.decode())).then(() => {
      const geos = d.geometries.map(g => { const o = new THREE.BufferGeometry(); for (const [k, v] of Object.entries(g.attributes)) o.setAttribute(k, new THREE.BufferAttribute(new Float32Array(v.array), v.size)); if (g.index) o.setIndex(g.index); for (const gr of g.groups) o.addGroup(gr.start, gr.count, gr.materialIndex); o.computeBoundingSphere(); return o; });
      const tex = d.textures.map((t, i) => { const o = new THREE.CanvasTexture(imgs[i]); o.wrapS = t.wrapS; o.wrapT = t.wrapT; o.repeat.fromArray(t.repeat); o.offset.fromArray(t.offset); o.flipY = t.flipY; o.colorSpace = THREE.SRGBColorSpace; o.anisotropy = 8; o.needsUpdate = true; return o; });
      const env = document.createElement('canvas'); env.width = 512; env.height = 256; const eg = env.getContext('2d'); const gr = eg.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, '#ffe6c0'); gr.addColorStop(.5, '#3a2a1a'); gr.addColorStop(1, '#120c08'); eg.fillStyle = gr; eg.fillRect(0, 0, 512, 256); const envTex = new THREE.CanvasTexture(env); envTex.mapping = THREE.EquirectangularReflectionMapping;
      const mats = d.materials.map(m => { const props = { color: m.color, map: m.map == null ? null : tex[m.map], transparent: m.transparent, opacity: m.opacity, side: m.side, depthWrite: m.depthWrite, alphaTest: m.alphaTest }; return m.type === 'basic' ? new THREE.MeshBasicMaterial(props) : new THREE.MeshStandardMaterial(Object.assign(props, { roughness: m.roughness, metalness: m.metalness, emissive: m.emissive, emissiveIntensity: m.emissiveIntensity, flatShading: m.flatShading, envMap: envTex, envMapIntensity: .65 })); });
      const node = n => { const o = n.g == null ? new THREE.Group() : new THREE.Mesh(geos[n.g], Array.isArray(n.m) ? n.m.map(i => mats[i]) : mats[n.m]); o.position.fromArray(n.p); o.quaternion.fromArray(n.q); o.scale.fromArray(n.s); o.visible = n.visible; if (n.role) o.name = 'px-' + n.role; n.children.forEach(c => o.add(node(c))); return o; };
      const scene = new THREE.Scene(); scene.background = new THREE.Color('#1a1410'); const m = node(d.root); scene.add(m);
      const leverO = m.getObjectByName('px-lever'), coreO = m.getObjectByName('px-core'), leverBase = leverO.rotation.x, coreBase = coreO.rotation.y;
      const hemi = new THREE.HemisphereLight(0xffead7, 0x192437, 1.2), l = new THREE.PointLight(0xffdfb3, 60, 40, 1.4), l2 = new THREE.PointLight(0xffc890, 25, 30, 1.4); l.position.set(3, 6, 8); l2.position.set(-4, 4, 5); scene.add(hemi, l, l2);
      const r = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); r.outputColorSpace = THREE.SRGBColorSpace; document.body.appendChild(r.domElement);
      const out = [];
      for (const [name, pos, look, fov, w, h, pose, turn, light] of SHOTS) {
        r.setSize(w, h); hemi.intensity = 1.2 * light; l.intensity = 60 * light; l2.intensity = 25 * light;
        leverO.rotation.x = leverBase + (pose === 'peak' ? 1.02 : 0); coreO.rotation.y = coreBase + turn; scene.updateMatrixWorld(true);
        const cam = new THREE.PerspectiveCamera(fov, w / h, .1, 100); cam.position.set(...pos); cam.lookAt(...look); r.render(scene, cam); out.push([name, r.domElement.toDataURL('image/png')]);
      }
      return out;
    });
  }, { json: r.json, SHOTS });
  shots.forEach(([n, s]) => writeFileSync(join(HERE, `dist/cabinet-${n}.png`), Buffer.from(s.split(',')[1], 'base64')));
  console.log('previews written to dist/:', shots.map(s => s[0]).join(' '));
}
await browser.close();
