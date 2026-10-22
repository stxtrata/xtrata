#!/usr/bin/env node
/*
 * Xtrata Arcade: take a room's "entry view": a colour picture and a depth map of what you see the moment you walk in
 *
 *   THREE_JS=/path/to/three.min.js(r128) CHROME_PATH=/path/to/chrome NODE_PATH=<dir with playwright> \
 *     node build/snap-room.cjs [page=casino-room.html] [name=casino-entry]
 *
 * Opens build/rooms/<page>?from=arcade exactly as the arcade's lobby door opens it, waits for the first walking frames, then renders the room's own scene twice from the
 * player's starting eye, with a WIDER lens than the room uses (so the hall has some spare picture to look around the edges with):
 *   <name>.jpg        the colour picture, as the room draws it (tone mapping and all)
 *   <name>-depth.png  how far away each pixel is, along the view axis, packed into 12 bits (R = top 8 bits, G = low 4 bits x 16) over 0..ZMAX metres, at a third of the size
 * Things that only glow or fade (light cones, dust, sprites, sign glass) and instanced bits are left out of the depth map, so the depth is of what is solid.
 * The hall (src/parts/doors.js, ROOM below) turns the two into a doorway you can look into with real parallax, and into the glide you take when you walk in.
 * The numbers here (VFOV, ASPECT, ZMAX, the depth size) must equal doors.js ROOM; tests/hall-room-still.test.cjs checks that they do.
 * Re-run whenever the room's entry view changes, then `node build/preview.mjs`.
 */
const fs = require('fs'), path = require('path'), http = require('http');
const { chromium } = require('playwright');
const here = __dirname, roomsDir = path.join(here, 'rooms');
const page0 = process.argv[2] || 'casino-room.html', name = process.argv[3] || 'casino-entry';
const VFOV = 80, W = 2304, H = 1296, DW = 768, DH = 432, ZMAX = 32;
const THREE = fs.readFileSync(process.env.THREE_JS, 'utf8');
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.jpg': 'image/jpeg', '.png': 'image/png' };
(async () => {
  const srv = http.createServer((q, r) => {
    const f = path.join(roomsDir, path.basename(q.url.split('?')[0]) || page0);
    fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); r.end(b); } });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const b = await chromium.launch({ executablePath: process.env.CHROME_PATH, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const ctx = await b.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 }), page = await ctx.newPage();
  await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort('failed'));
  // the room builds its own renderer, scene and camera out of sight (and r128 gives each renderer its own render function): the three.js we hand it is followed by a few lines
  // that wrap the renderer's constructor, so the first time the room draws we are told which renderer, scene and camera it uses
  const HOOK = ';(function(){var O=THREE.WebGLRenderer;THREE.WebGLRenderer=function(){var r=new O(arguments[0]),f=r.render;r.render=function(s,c){window.__h={r:r,s:s,c:c};return f.call(r,s,c)};return r};THREE.WebGLRenderer.prototype=O.prototype})();';
  await page.route(/cdnjs\.cloudflare\.com.*three/, (r) => r.fulfill({ contentType: 'application/javascript', body: THREE + '\n' + HOOK }));
  await page.goto('http://127.0.0.1:' + srv.address().port + '/' + page0 + '?from=arcade');
  await page.waitForFunction(() => window.__casino && window.__h, null, { timeout: 90000 });
  await page.waitForTimeout(4000);
  const shot = await page.evaluate(({ VFOV, W, H, DW, DH, ZMAX }) => {
    const { r, s, c } = window.__h, T = THREE;
    // colour, drawn the way the room draws it, with the wider lens
    r.setPixelRatio(1); r.setSize(W, H, false); c.fov = VFOV; c.aspect = W / H; c.updateProjectionMatrix(); r.render(s, c);
    const jpg = r.domElement.toDataURL('image/jpeg', 0.8);
    // depth: every solid thing drawn with a material that writes its distance along the view axis
    const hid = [];
    s.traverse((o) => {
      const m = o.material, mm = Array.isArray(m) ? m[0] : m;
      if (o.visible && (o.isPoints || o.isSprite || o.isLine || o.isInstancedMesh || (mm && (mm.blending === T.AdditiveBlending || (mm.transparent && !mm.alphaTest))))) { hid.push(o); o.visible = false; }
    });
    const rt = new T.WebGLRenderTarget(DW, DH, { minFilter: T.NearestFilter, magFilter: T.NearestFilter, format: T.RGBAFormat, type: T.UnsignedByteType });
    const mat = new T.ShaderMaterial({ side: T.DoubleSide,
      vertexShader: 'varying float vZ; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); vZ = -mv.z; gl_Position = projectionMatrix * mv; }',
      fragmentShader: 'varying float vZ; void main(){ float q = floor(clamp(vZ / ' + ZMAX.toFixed(1) + ', 0.0, 1.0) * 4095.0 + 0.5); float hi = floor(q / 16.0); float lo = q - hi * 16.0; gl_FragColor = vec4(hi / 255.0, lo * 16.0 / 255.0, 0.0, 1.0); }' });
    const bg = s.background, fog = s.fog, cc = new T.Color(), ca = r.getClearAlpha(); r.getClearColor(cc);
    s.background = null; s.fog = null; s.overrideMaterial = mat; r.setClearColor(0xffffff, 1); r.setRenderTarget(rt); r.render(s, c);
    const buf = new Uint8Array(DW * DH * 4); r.readRenderTargetPixels(rt, 0, 0, DW, DH, buf);
    r.setRenderTarget(null); s.overrideMaterial = null; s.background = bg; s.fog = fog; r.setClearColor(cc, ca); hid.forEach((o) => { o.visible = true; });
    const cv = document.createElement('canvas'); cv.width = DW; cv.height = DH; const x = cv.getContext('2d'), id = x.createImageData(DW, DH);
    for (let row = 0; row < DH; row++) id.data.set(buf.subarray((DH - 1 - row) * DW * 4, (DH - row) * DW * 4), row * DW * 4);   // (read back bottom row first)
    x.putImageData(id, 0, 0);
    return { jpg, png: cv.toDataURL('image/png'), hidden: hid.length };
  }, { VFOV, W, H, DW, DH, ZMAX });
  const save = (url, f) => { fs.writeFileSync(path.join(roomsDir, f), Buffer.from(url.split(',')[1], 'base64')); console.log('wrote', f, (fs.statSync(path.join(roomsDir, f)).size / 1024).toFixed(0) + ' KB'); };
  save(shot.jpg, name + '.jpg'); save(shot.png, name + '-depth.png'); console.log('left out of the depth map:', shot.hidden, 'objects');
  await b.close(); srv.close();
})().catch((e) => { console.error(e); process.exit(1); });
