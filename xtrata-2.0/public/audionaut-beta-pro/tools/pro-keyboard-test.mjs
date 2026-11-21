import { makeProject } from '../daw/js/state.js';
import assert from 'node:assert/strict';
import { serve, browser, page, selectWorkspace } from './serve.mjs';
const { srv, url } = await serve();
let b;
try {
  b = await browser();
  const logs = [],
    p = await page(b, url, { logs, hasTouch: true });
  await p.addInitScript(
    (project) =>
      localStorage.setItem(
        'audionaut.beta-pro.v0.2.project',
        JSON.stringify({
          ...project,
          format: 'audionaut-workstation/3',
          projectName: 'Keyboard test'
        })
      ),
    makeProject()
  );
  await p.goto(url + '/audionaut-beta-pro/daw.html');
  await p.waitForSelector('#synth-front');
  const result = await p.evaluate(async () => {
    const base = '/audionaut-beta-pro/daw/js/',
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
    const base = '/audionaut-beta-pro/daw/js/',
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
  // Enter from the actual synth dock and play in both orientations.
  await p.setViewportSize({ width: 390, height: 844 });
  await p.locator('#expand-synth-keys').tap();
  const dialog = p.locator('dialog.expanded-keyboard[open]'),
    bed = dialog.locator('.kb');
  const span = dialog.getByLabel('Visible octaves'),
    pitches = bed.locator('[data-midi]');
  await pitches.first().waitFor();
  assert.equal(await pitches.count(), 13);
  await p.evaluate(() => {
    window.expandedNotes = [];
    document.addEventListener('live-note', ({ detail: { inst, pitch, on } }) =>
      expandedNotes.push([inst, pitch, on])
    );
  });
  await bed.locator('[data-midi="49"]').tap();
  assert.deepEqual(await p.evaluate(() => expandedNotes.slice(-2)), [
    [0, 49, true],
    [0, 49, false]
  ]);
  const pitch = bed.locator('[data-midi="49"]');
  const xy = await pitch.boundingBox();
  await p.evaluate(() => { expandedNotes.length = 0; });
  for (let n = 0; n < 5; n++) await p.touchscreen.tap(xy.x + xy.width/2, xy.y + 15);
  assert.deepEqual(await p.evaluate(() => expandedNotes), Array.from({length:5}, () => [[0,49,true],[0,49,false]]).flat());
  assert.equal(await p.evaluate(() => visualViewport.scale), 1);
  assert.equal(await dialog.evaluate(d => d.matches(':modal')), false);
  await p.setViewportSize({ width: 844, height: 390 });
  await p.waitForFunction(
    () => document.querySelectorAll('.expanded-keybed [data-midi]').length === 25
  );
  await span.selectOption('1');
  for (const [width, height] of [
    [390, 844],
    [820, 1180],
    [844, 390],
    [1180, 820]
  ]) {
    await p.setViewportSize({ width, height });
    const bounds = await bed.boundingBox();
    assert.ok(
      bounds.width >= width - 28 &&
        bounds.height >= 88 && bounds.height <= height * 0.3 &&
        bounds.y + bounds.height <= height + 1,
      'Docked keyboard has full width and a bounded depth at ' + width + 'x' + height
    );
    assert.equal(await pitches.count(), 13, 'Manual one-octave range survives rotation');
  }
  await p.setViewportSize({width:820, height:1180});
  const dockBefore = await dialog.boundingBox();
  const synth = await p.locator('#synth-front').boundingBox();
  assert.ok(synth.y < dockBefore.y && synth.y + synth.height <= dockBefore.y + 2, 'Synth stays visible above portrait keys');
  const dockSize = p.locator('#synth-dock-size');
  await dockSize.tap();
  if (process.env.SCREENSHOT_DIR)
    await p.screenshot({ path: process.env.SCREENSHOT_DIR + '/docked-ipad-portrait.png' });
  // Some Safari hosts provide only studio fullscreen. Keep the simulated viewport during rotation.
  const player = dialog.locator('.expanded-key-player');
  await player.evaluate(el => { el.requestFullscreen = undefined; el.webkitRequestFullscreen = undefined; });
  const full = dialog.getByRole('button', {name:'Full screen',exact:true});
  await full.tap();
  await dialog.getByRole('button', {name:'Exit full screen'}).waitFor();
  assert.equal(await dialog.evaluate(d => d.matches(':modal')), true);
  assert.ok((await bed.boundingBox()).height <= 305);
  await p.setViewportSize({width:1180, height:820});
  assert.ok((await bed.boundingBox()).height > 520, 'Landscape playing surface fills the player');
  if (process.env.SCREENSHOT_DIR)
    await p.screenshot({ path: process.env.SCREENSHOT_DIR + '/expanded-ipad.png' });
  await dialog.getByRole('button', { name: 'Higher octave' }).tap();
  assert.equal(await pitches.first().getAttribute('data-midi'), '60');
  await span.selectOption('4');
  assert.equal(await pitches.count(), 49);
  // Hold a chord, change the visible range, and check the shared live engine releases both notes.
  const hold = () =>
    bed.evaluate((node) => {
      for (const [index, key] of [...node.querySelectorAll('.kb-w')].slice(0, 2).entries()) {
        const r = key.getBoundingClientRect();
        key.dispatchEvent(
          new PointerEvent('pointerdown', {
            bubbles: true,
            pointerId: 31 + index,
            button: 0,
            buttons: 1,
            pointerType: 'touch',
            clientX: r.x + r.width / 2,
            clientY: r.y + r.height * 0.8
          })
        );
      }
    });
  await p.evaluate(async () => {
    window.heldKeys = (await import('/audionaut-beta-pro/daw/js/live-keys.js')).heldCount;
  });
  const held = () => p.evaluate(() => window.heldKeys());
  const firstKey = pitches.first();
  await hold();
  assert.equal(await held(), 2);
  await dialog.getByRole('button', {name:'Exit full screen'}).tap();
  await full.waitFor();
  assert.equal(await held(), 0);
  assert.equal(await dialog.evaluate(d => d.matches(':modal')), false);
  await player.evaluate(el => { delete el.requestFullscreen; delete el.webkitRequestFullscreen; });
  await full.tap();
  if (await p.evaluate(() => Boolean(document.fullscreenElement))) {
    await p.evaluate(() => document.exitFullscreen());
    await full.waitFor();
    await full.tap();
  }
  await firstKey.focus();
  await p.keyboard.press('ArrowRight');
  await p.keyboard.down('Enter');
  assert.equal(await held(), 1);
  await p.keyboard.up('Enter');
  assert.equal(await held(), 0);
  await firstKey.evaluate((k) => k.click());
  assert.equal(await held(), 1);
  await p.waitForFunction(() => window.heldKeys() === 0);
  await hold();
  assert.equal(await held(), 2);
  await span.selectOption('2');
  assert.equal(await held(), 0);
  await hold();
  await dialog.getByRole('button', { name: 'Done' }).tap();
  await p.waitForSelector('dialog.expanded-keyboard', { state: 'detached' });
  assert.equal(await held(), 0);
  await p.locator('#expand-synth-keys').tap();
  await player.evaluate(el => { el.requestFullscreen = undefined; el.webkitRequestFullscreen = undefined; });
  await full.tap();
  await p.keyboard.press('Escape');
  await full.waitFor();
  await p.keyboard.press('Escape');
  await dialog.waitFor({state:'detached'});
  assert.equal(await p.evaluate(() => document.activeElement?.id), 'expand-synth-keys');
  // The Mobile shortcut uses the selected slot and the rack's actual note map.
  await p.setViewportSize({ width: 390, height: 844 });
  await selectWorkspace(p, 'Mobile');
  const rack = await p.evaluate(async () => {
    const { store } = await import('/audionaut-beta-pro/daw/js/state.js');
    store.setInstrumentProp(1, 'synthId', 'drumrack');
    return store.instrument(1).id;
  });
  await p.getByLabel('Track', { exact: true }).selectOption(rack);
  await p.locator('.mobile-devices').getByRole('button', { name: 'Expand keyboard' }).tap();
  assert.equal(await pitches.count(), 16);
  assert.match(await pitches.first().getAttribute('aria-label'), /C1/);
  assert.equal(await span.isVisible(), false);
  await pitches.first().tap({ position: { x: 5, y: 120 } });
  assert.deepEqual(await p.evaluate(() => expandedNotes.slice(-2)), [
    [1, 36, true],
    [1, 36, false]
  ]);
  await dialog.getByRole('button', { name: 'Done' }).tap();
  await p.waitForSelector('dialog.expanded-keyboard', { state: 'detached' });
  assert.equal(await p.getByLabel('Track', { exact: true }).inputValue(), rack);
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
