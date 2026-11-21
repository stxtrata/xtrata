import { makeProject } from '../daw/js/state.js';
import assert from 'node:assert/strict';
import { serve, browser, page } from './serve.mjs';
const { srv, url } = await serve();
let b;
try {
  b = await browser();
  const logs = [],
    p = await page(b, url, { logs });
  await p.addInitScript(
    (project) =>
      localStorage.setItem(
        'audionaut.beta.v0.2.project',
        JSON.stringify({
          ...project,
          format: 'audionaut-workstation/3',
          projectName: 'Keyboard test'
        })
      ),
    makeProject()
  );
  await p.goto(url + '/audionaut-beta/daw.html');
  await p.waitForSelector('#synth-front');
  const result = await p.evaluate(async () => {
    const base = '/audionaut-beta/daw/js/',
      L = await import(base + 'live-keys.js'),
      { buildPianoKeys } = await import(base + 'keyboard-layout.js');
    const host = document.createElement('div');
    host.style.cssText = 'position:fixed;left:0;top:0;width:700px;height:100px;z-index:999999';
    document.body.append(host);
    const { kb, keys } = buildPianoKeys(host, { from: 48, octaves: 3 });
    let checks = 0;
    const ok = (yes, message) => {
      assert(yes, message);
      checks++;
    };
    function assert(v, m) {
      if (!v) throw Error(m);
    }
    const handle = L.attachKeyboard(kb, {
      inst: () => 0,
      keyAt: (n) => {
        const k = n.closest('[data-midi]');
        return k ? { midi: +k.dataset.midi, el: k } : null;
      }
    });
    const send = (type, pointerId, midi, buttons = 1) => {
      const k = keys.find((k) => +k.dataset.midi === midi),
        r = k.getBoundingClientRect();
      kb.dispatchEvent(
        new PointerEvent(type, {
          bubbles: true,
          pointerId,
          pointerType: 'touch',
          button: 0,
          buttons,
          clientX: r.left + r.width / 2,
          clientY: r.top + r.height * 0.8
        })
      );
    };
    L.allOff();
    send('pointerdown', 41, 48);
    send('pointerdown', 42, 52);
    ok(
      L.heldCount() === 2,
      'Two pointers hold independent notes: ' +
        JSON.stringify({
          held: L.heldCount(),
          keys: keys.slice(0, 5).map((k) => {
            const r = k.getBoundingClientRect(),
              hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height * 0.8);
            return {
              midi: k.dataset.midi,
              box: [r.left, r.top, r.width, r.height],
              hit: hit?.outerHTML.slice(0, 200)
            };
          })
        })
    );
    send('pointercancel', 41, 48, 0);
    ok(L.heldCount() === 1, 'Cancel releases only its pointer');
    send('lostpointercapture', 42, 52, 0);
    ok(L.heldCount() === 0, 'Lost capture releases note');
    send('pointerdown', 43, 48);
    send('pointermove', 43, 50);
    ok(L.heldCount() === 1, 'Glissando replaces the held note');
    window.dispatchEvent(new Event('blur'));
    ok(L.heldCount() === 0, 'Blur releases all notes');
    send('pointermove', 43, 52);
    ok(L.heldCount() === 0, 'Motion after blur cannot restart released note');
    send('pointerdown', 44, 48);
    L.setOctave(4);
    send('pointerup', 44, 48, 0);
    ok(L.heldCount() === 0, 'Octave change preserves release identity');
    L.setOctave(3);
    send('pointerdown', 45, 48);
    handle.dispose();
    ok(L.heldCount() === 0, 'Disposal releases held notes');
    send('pointerdown', 46, 48);
    ok(L.heldCount() === 0, 'Disposed keyboard has no listeners');
    host.remove();
    ok(
      !L.noteOn('bad', 0, NaN) && !L.noteOn('bad', 0, 60.5) && !L.noteOn('bad', 0, 60, NaN),
      'Invalid pitches/velocities rejected'
    );
    return { checks };
  });
  // Real custom face geometry at both desktop and mobile sizes.
  await p.evaluate(async () => {
    const base = '/audionaut-beta/daw/js/',
      { store } = await import(base + 'state.js'),
      { Kit } = await import(base + 'synth-faces/index.js'),
      { openSynthPanel } = await import(base + 'synth-panel.js');
    store.setInstrumentProp(0, 'synthId', 'tonewheel');
    await Kit.load('tonewheel');
    openSynthPanel(0);
  });
  for (const width of [1400, 390]) {
    await p.setViewportSize({ width, height: 900 });
    await p.waitForTimeout(100);
    const errors = await p.evaluate(() => {
      const host = document.querySelector('.sfp-face-host'),
        sh = host.firstElementChild.firstElementChild.shadowRoot,
        keys = [...sh.querySelectorAll('.kb-w,.kb-b')];
      return keys
        .filter((k) => k.classList.contains('kb-b'))
        .filter((k) => {
          const white = keys.find((w) => +w.dataset.base === +k.dataset.base - 1),
            a = k.getBoundingClientRect(),
            b = white.getBoundingClientRect();
          return Math.abs(a.left + a.width / 2 - b.right) > 1;
        })
        .map((k) => k.dataset.base);
    });
    assert.deepEqual(errors, []);
    result.checks++;
    if (process.env.SCREENSHOT_DIR)
      await p.screenshot({ path: process.env.SCREENSHOT_DIR + `/cathedral-${width}.png` });
  }
  assert.deepEqual(
    logs.filter((x) => x.startsWith('pageerror:')),
    []
  );
  console.log(
    JSON.stringify({ ...result, browser: process.env.AUDIONAUT_TEST_BROWSER || 'chromium' })
  );
} finally {
  await b?.close();
  await new Promise((r) => srv.close(r));
}
