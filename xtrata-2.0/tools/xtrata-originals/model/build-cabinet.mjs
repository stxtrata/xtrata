#!/usr/bin/env node
// Builds the Xtrata Originals cabinet (model/xtrata-originals-model.json) in headless Chromium with the same THREE build the machines use.
//   node tools/xtrata-originals/model/build-cabinet.mjs [--preview]
// THREE is read (never written) from the Forever Twins pack inside public/casino/index.html (or PX_CASINO_HTML); the XLOGO
// vector code is vendor/xlogo.js, byte-identical to the one in that pack (verify.py checks it).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
const HERE = dirname(fileURLToPath(import.meta.url)), TOOL = resolve(HERE, '..'), ROOT = resolve(TOOL, '../..');
const CASINO = process.env.PX_CASINO_HTML || join(ROOT, 'public/casino/index.html');
const html = readFileSync(CASINO, 'utf8'), OPEN = 'window.PX_MACHINE_PACKS=', a = html.indexOf(OPEN);
const packs = JSON.parse(html.slice(a + OPEN.length, html.indexOf('];</script>', a) + 1)), ft = packs.find(p => p.name === 'Forever Twins');
const game = gunzipSync(Buffer.from(ft.game, 'base64')).toString('utf8');
const s = game.indexOf('<script>var THREE='), three = game.slice(s, game.indexOf('</script>', s) + 9);
const xlogo = '<script>' + readFileSync(join(TOOL, 'vendor/xlogo.js'), 'utf8') + '</script>';
const art = JSON.parse(readFileSync(join(TOOL, 'art/xo-art.json'), 'utf8'));
const ids = art.layers.map(l => l.id), portraits = art.audionauts.filter(x => x.edition !== 29).slice(0, 12).map(x => x.uri);
const wordmark = 'data:image/svg+xml;base64,' + Buffer.from(readFileSync(join(TOOL, 'art/parallax-casino-wordmark.svg'))).toString('base64');
const page = `<!doctype html><html><body style="margin:0;background:#111">${three}${xlogo}<script>${readFileSync(join(HERE, 'cabinet.js'), 'utf8')}</script></body></html>`;
mkdirSync(join(HERE, 'preview'), { recursive: true });
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await browser.newPage({ viewport: { width: 900, height: 1100 } });
p.on('pageerror', e => console.error('page error:', e.message));
await p.setContent(page);
const r = await p.evaluate(o => window.buildCabinet(o), { ids, portraits, wordmark });
writeFileSync(join(HERE, 'xtrata-originals-model.json'), r.json);
console.log('model', (r.json.length / 1024).toFixed(0) + ' KB', JSON.stringify(r.stats));
if (process.argv.includes('--preview')) {
  const shots = await p.evaluate(json => {
    const d = JSON.parse(json); const imgs = d.textures.map(t => { const i = new Image(); i.src = t.image; return i; });
    return Promise.all(imgs.map(i => i.decode())).then(() => {
      const geos = d.geometries.map(g => { const o = new THREE.BufferGeometry(); for (const [k, v] of Object.entries(g.attributes)) o.setAttribute(k, new THREE.BufferAttribute(new Float32Array(v.array), v.size)); if (g.index) o.setIndex(g.index); for (const gr of g.groups) o.addGroup(gr.start, gr.count, gr.materialIndex); return o; });
      const tex = d.textures.map((t, i) => { const o = new THREE.CanvasTexture(imgs[i]); o.flipY = t.flipY; o.colorSpace = THREE.SRGBColorSpace; o.needsUpdate = true; return o; });
      const env = document.createElement('canvas'); env.width = 512; env.height = 256; const eg = env.getContext('2d'); const gr = eg.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, '#cfdcff'); gr.addColorStop(.5, '#1a2030'); gr.addColorStop(1, '#07090d'); eg.fillStyle = gr; eg.fillRect(0, 0, 512, 256); const envTex = new THREE.CanvasTexture(env); envTex.mapping = THREE.EquirectangularReflectionMapping;
      const mats = d.materials.map(m => { const props = { color: m.color, map: m.map == null ? null : tex[m.map], transparent: m.transparent, opacity: m.opacity, side: m.side, alphaTest: m.alphaTest, depthWrite: m.depthWrite }; return m.type === 'basic' ? new THREE.MeshBasicMaterial(props) : new THREE.MeshStandardMaterial(Object.assign(props, { roughness: m.roughness, metalness: m.metalness, envMap: envTex, envMapIntensity: .65 })); });
      const node = n => { const o = n.g == null ? new THREE.Group() : new THREE.Mesh(geos[n.g], Array.isArray(n.m) ? n.m.map(i => mats[i]) : mats[n.m]); o.position.fromArray(n.p); o.quaternion.fromArray(n.q); o.scale.fromArray(n.s); if (n.role === 'crest') o.rotation.y = .45; n.children.forEach(c => o.add(node(c))); return o; };
      const scene = new THREE.Scene(); scene.background = new THREE.Color('#0b0d12'); const m = node(d.root); scene.add(m);
      scene.add(new THREE.HemisphereLight(0xdfe8ff, 0x10141c, 1.2)); const l = new THREE.PointLight(0xffffff, 60, 40, 1.4); l.position.set(3, 6, 8); scene.add(l); const l2 = new THREE.PointLight(0x6593cf, 25, 30, 1.4); l2.position.set(-4, 4, 5); scene.add(l2);
      const fl = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.MeshStandardMaterial({ color: 0x080a10, roughness: .4, metalness: .3 })); fl.rotation.x = -Math.PI / 2; scene.add(fl);
      const r = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); r.setSize(900, 1100); r.outputColorSpace = THREE.SRGBColorSpace; document.body.appendChild(r.domElement);
      const cam = new THREE.PerspectiveCamera(32, 900 / 1100, .1, 100), out = [];
      for (const [x, y, z, ty] of [[0, 3.1, 11.5, 2.9], [6.5, 3.6, 9.2, 2.9], [-3.4, 3.2, 3.8, 3.6], [0, 5.6, 4.2, 5.4]]) { cam.position.set(x, y, z); cam.lookAt(0, ty, 0); r.render(scene, cam); out.push(r.domElement.toDataURL('image/png')); }
      return out;
    });
  }, r.json);
  shots.forEach((sh, i) => writeFileSync(join(HERE, `preview/cabinet-${i}.png`), Buffer.from(sh.split(',')[1], 'base64')));
  console.log('previews written to model/preview/');
}
await browser.close();
