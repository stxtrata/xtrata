// Browser check for the ELEMENTS suite: offline DSP checks, then each face mounts on a real
// chain slot in daw.html without console errors.
// Run from xtrata-2.0: node public/audionaut-beta-pro/tools/pro-elements-fx-test.mjs
import assert from 'node:assert/strict';
import { serve, browser, page } from './serve.mjs';
const edition = process.env.AUDIONAUT_EDITION || 'audionaut-beta-pro';
const shots = process.env.SCREENSHOT_DIR;
const server = await serve(), b = await browser(), logs = [];
try {
  const p = await page(b, server.url, { logs });
  await p.goto(`${server.url}/${edition}/daw.html`);
  await p.waitForSelector('#synth-front', { state: 'attached' });
  const rows = await p.evaluate(async () => (await import('./tools/elements-fx-checks.js')).verifyElements());
  console.log(JSON.stringify(rows, null, 2));
  // Mount every face against a live engine instance and let it draw.
  const faces = await p.evaluate(async () => {
    const { Kit } = await import('./daw/js/plugin-faces/index.js');
    const { PLUGIN_TYPES, pluginDefaults } = await import('./daw/js/plugins.js');
    const ctx = new AudioContext(), out = [];
    for (const id of ['neon', 'iron', 'titanium', 'carbon', 'helium', 'mercury']) {
      const host = document.createElement('div');
      host.style.cssText = 'position:fixed;left:0;top:0;width:900px;height:560px;z-index:99999;background:#000';
      host.id = 'elements-face-host'; document.body.append(host);
      const type = PLUGIN_TYPES[id], nodes = type.create(ctx, {});
      let params = pluginDefaults(id), enabled = true;
      const inAn = ctx.createAnalyser(), outAn = ctx.createAnalyser();
      nodes.output.connect(outAn); const osc = ctx.createOscillator(); osc.connect(nodes.input); osc.connect(inAn); osc.start();
      type.apply(ctx, nodes, params);
      const link = { getParams: () => params, setParams: (v) => { params = { ...params, ...v }; type.apply(ctx, nodes, params); }, getEnabled: () => enabled, setEnabled: (v) => { enabled = v; }, onChange: () => () => {}, inst: () => ({ nodes }), taps: () => ({ inAn, outAn }) };
      await Kit.load(id);
      const face = Kit.mount(host, id, link);
      await new Promise((r) => setTimeout(r, 400));
      const root = host.firstElementChild.firstElementChild.shadowRoot; // faces render in a shadow root
      const knobs = root.querySelectorAll('[data-p]').length, canvas = root.querySelector('canvas');
      // Step to the previous (last) preset through the face and check params changed.
      root.querySelector('[data-prev]')?.click();
      await new Promise((r) => setTimeout(r, 350));
      // Drag on the display: must not throw and keeps values in range.
      const cv = root.querySelector('canvas'), box = cv.getBoundingClientRect();
      for (const type of ['pointerdown', 'pointermove', 'pointerup']) cv.dispatchEvent(new PointerEvent(type, { clientX: box.left + box.width * 0.5, clientY: box.top + box.height * 0.4, pointerId: 1, bubbles: true }));
      const inRange = type.params.every((q) => q.options ? q.options.some(([v]) => v === params[q.key]) : params[q.key] >= q.min && params[q.key] <= q.max);
      out.push({ id, knobs, canvas: !!canvas, presetName: root.querySelector('[data-pname]')?.textContent, changed: JSON.stringify(params) !== JSON.stringify(pluginDefaults(id)), inRange });
      window.__shot = id;
      await new Promise((r) => setTimeout(r, 50));
      face.dispose?.(); osc.stop(); host.remove(); type.dispose?.(nodes);
    }
    await ctx.close();
    return out;
  });
  console.log(JSON.stringify(faces, null, 2));
  for (const f of faces) assert(f.knobs >= 3 && f.canvas && f.changed && f.inRange, `${f.id} face`);
  if (shots) {
    // Screenshot each face for review.
    for (const id of ['neon', 'iron', 'titanium', 'carbon', 'helium', 'mercury']) {
      await p.evaluate(async (id) => {
        const { Kit } = await import('./daw/js/plugin-faces/index.js');
        const { PLUGIN_TYPES, pluginDefaults } = await import('./daw/js/plugins.js');
        const ctx = window.__shotCtx ||= new AudioContext();
        document.getElementById('elements-shot')?.remove();
        const host = document.createElement('div'); host.id = 'elements-shot';
        host.style.cssText = 'position:fixed;left:0;top:0;width:880px;height:520px;z-index:99999;background:#000'; document.body.append(host);
        const type = PLUGIN_TYPES[id], nodes = type.create(ctx, {}); let params = pluginDefaults(id);
        const inAn = ctx.createAnalyser(), outAn = ctx.createAnalyser(), noise = ctx.createBufferSource(), buf = ctx.createBuffer(2, ctx.sampleRate, ctx.sampleRate);
        for (let c = 0; c < 2; c++) { const d = buf.getChannelData(c); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.3 * (i % 12000 < 3000 ? 1 : 0.2); }
        noise.buffer = buf; noise.loop = true; noise.connect(nodes.input); noise.connect(inAn); nodes.output.connect(outAn); noise.start();
        type.apply(ctx, nodes, params);
        const link = { getParams: () => params, setParams: (v) => { params = { ...params, ...v }; type.apply(ctx, nodes, params); }, getEnabled: () => true, setEnabled: () => {}, onChange: () => () => {}, inst: () => ({ nodes }), taps: () => ({ inAn, outAn }) };
        await Kit.load(id); Kit.mount(host, id, link);
        host.firstElementChild.firstElementChild.shadowRoot.querySelector('[data-next]')?.click();
      }, id);
      await p.waitForTimeout(900);
      await p.locator('#elements-shot').screenshot({ path: `${shots}/elements-${id}.png` });
    }
  }
  assert.deepEqual(logs, []);
} finally {
  await b.close();
  await new Promise((resolve) => server.srv.close(resolve));
}
