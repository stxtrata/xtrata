import { selectWorkspace } from './serve.mjs';
import assert from 'node:assert/strict';
import { serve, browser, page } from './serve.mjs';
import { makeProject } from '../daw/js/state.js';
const { srv, url } = await serve();
let b,
  checks = 0;
const ok = (v, m) => {
  assert.ok(v, m);
  checks++;
};
try {
  b = await browser();
  const logs = [],
    p = await page(b, url, { logs });
  await p.addInitScript(
    (project) =>
      localStorage.setItem(
        'audionaut.beta-pro.v0.2.project',
        JSON.stringify({ ...project, format: 'audionaut-workstation/3' })
      ),
    makeProject()
  );
  await p.goto(url + '/audionaut-beta-pro/daw.html');
  await p.waitForSelector('#pro-workspace-nav');
  await p.evaluate(async () => {
    const base = '/audionaut-beta-pro/daw/js/';
    window.test = {
      ...(await import(base + 'state.js')),
      ...(await import(base + 'song-regions.js')),
      ...(await import(base + 'history.js')),
      engine: (await import(base + 'engine.js')).engine
    };
  });
  async function reset(view, { steps = [4, 20, 36], seconds = 0.5, reverse = false } = {}) {
    await p.evaluate(
      ({ steps, seconds, reverse }) => {
        const { store, engine, makeProject, makeSequence } = test;
        engine.stop();
        const q = makeProject();
        q.bpm = 120;
        q.choke = false;
        q.sequences = [makeSequence(), makeSequence()];
        q.sequences.forEach((s) => s.steps.forEach((row) => row.fill(0)));
        q.channels[0].reverse = reverse;
        q.channels[0].trimStart = 0;
        q.channels[0].trimEnd = 1;
        q.channels[0].pitch = 1;
        for (const s of steps) q.sequences[0].steps[0][s] = 1;
        store.loadProject(q);
        test.seconds = seconds;
      },
      { steps, seconds, reverse }
    );
    await p.waitForTimeout(50);
    await p.evaluate(async () => {
      const { closeSynthPanel } = await import('/audionaut-beta-pro/daw/js/synth-panel.js');
      closeSynthPanel();
    });
    await p.evaluate(() => {
      const { engine, store } = test,
        ctx = engine.ensureContext(),
        buffer = ctx.createBuffer(1, Math.round(test.seconds * 44100), 44100);
      buffer.getChannelData(0).fill(0.25);
      engine.setBuffer(0, buffer);
      store.emit('channel', { ch: 0 }, { dirty: false });
    });
    await selectWorkspace(p, view);
    await p.waitForTimeout(70);
    if (view === 'Timeline')
      await p.locator('.song-scroll').evaluate((n) => {
        n.scrollLeft = 0;
        n.scrollTop = 0;
        n.dispatchEvent(new Event('scroll'));
      });
    return p.evaluate((view) => {
      const c =
          view === 'Sequences'
            ? document.querySelector('.channel[data-ch="0"] .arrange-strip')
            : document.querySelector('.song-canvas'),
        r = c.getBoundingClientRect();
      return {
        left: r.left + (view === 'Sequences' ? 0 : +c.dataset.controlsWidth),
        top: r.top + (view === 'Sequences' ? 0 : 44),
        scale: view === 'Sequences' ? r.width / 64 : 14,
        selector: view === 'Sequences' ? '.channel[data-ch="0"] .arrange-strip' : '.song-canvas'
      };
    }, view);
  }
  const value = (step) =>
    p.evaluate((step) => test.store.project.sequences[0].steps[0][step], step);
  // Use physical pixel positions consistently: engines round subpixel mouse events differently.
  const coords = (box, step, y = 20) => [
    Math.round(box.left + step * box.scale),
    Math.round(box.top + y)
  ];
  const delta = (box, from, to) => (coords(box, to)[0] - coords(box, from)[0]) / box.scale;
  const at = async (pos) =>
    p.evaluate(
      (pos) =>
        test.store.project.sequences[0].steps[0]
          .map((v, i) => ({ v, pos: i + (v?.off || 0) }))
          .find((r) => r.v && Math.abs(r.pos - pos) < 0.002)?.v,
      pos
    );
  async function drag(box, from, to, modifier) {
    if (modifier) await p.keyboard.down(modifier);
    await p.mouse.move(...coords(box, from));
    await p.mouse.down();
    await p.mouse.move(...coords(box, to), { steps: 6 });
    const cursor = await p.locator(box.selector).evaluate((n) => n.style.cursor);
    await p.mouse.up();
    if (modifier) await p.keyboard.up(modifier);
    return cursor;
  }
  async function select(box, steps) {
    await p.keyboard.down('Shift');
    for (const step of steps) await p.mouse.click(...coords(box, step));
    await p.keyboard.up('Shift');
  }
  const results = [];
  for (const view of ['Sequences', 'Timeline']) {
    let box = await reset(view);
    for (const [step, cursor] of [
      [6, 'grab'],
      [4.1, 'ew-resize'],
      [7.9, 'ew-resize'],
      [12, 'cell']
    ]) {
      await p.mouse.move(...coords(box, step));
      ok(
        (await p.locator(box.selector).evaluate((n) => n.style.cursor)) === cursor,
        view +
          ' hover ' +
          cursor +
          ' ' +
          JSON.stringify(
            await p.evaluate(
              ({ box, step }) => ({
                box,
                cursor: document.querySelector(box.selector).style.cursor,
                hit: document
                  .elementFromPoint(box.left + step * box.scale, box.top + 20)
                  ?.outerHTML.slice(0, 100),
                regions: test
                  .songRegions(test.store.project, test.engine.buffers, { patterns: true })
                  .regions.slice(0, 4)
                  .map((r) => ({ start: r.start, end: r.end, step: r.step })),
                buffer: test.engine.buffers[0]?.duration
              }),
              { box, step }
            )
          )
      );
    }
    ok((await drag(box, 6, 8)) === 'grabbing', view + ' dragging cursor');
    ok(!!(await value(6)) && !(await value(4)), view + ' move');
    await p.evaluate(() => test.undo());
    ok(!!(await value(4)) && !(await value(6)), view + ' one undo per move');
    box = await reset(view);
    await drag(box, 4.1, 6.1);
    let v = await at(4 + delta(box, 4.1, 6.1));
    ok(
      v &&
        Math.abs(v.trimStart - delta(box, 4.1, 6.1) / 4) < 0.001 &&
        Math.abs(v.trimEnd - 1) < 0.001,
      view + ' left trim keeps source/end'
    );
    box = await reset(view);
    await drag(box, 7.9, 6.9);
    v = await value(4);
    ok(Math.abs(v.trimEnd - (1 + delta(box, 7.9, 6.9) / 4)) < 0.001, view + ' right trim');
    box = await reset(view, { reverse: true });
    await drag(box, 4.1, 5.1);
    v = await at(4 + delta(box, 4.1, 5.1));
    ok(
      v && Math.abs(v.trimEnd - (1 - delta(box, 4.1, 5.1) / 4)) < 0.001 && v.trimStart === 0,
      view + ' reverse left trim'
    );
    box = await reset(view);
    await select(box, [6, 22]);
    await drag(box, 6, 8);
    ok(
      !!(await value(6)) && !!(await value(22)) && !(await value(4)) && !(await value(20)),
      view + ' group move'
    );
    await p.keyboard.press('ArrowRight');
    ok(!!(await value(7)) && !!(await value(23)), view + ' repeatable nudge keeps selection');
    await p.keyboard.press('Shift+ArrowRight');
    ok(!!(await value(11)) && !!(await value(27)), view + ' shift nudge x4');
    await p.keyboard.press('Delete');
    ok(!(await value(11)) && !(await value(27)), view + ' group delete');
    await p.evaluate(() => test.undo());
    ok(!!(await value(11)) && !!(await value(27)), view + ' group delete undo');
    box = await reset(view);
    await select(box, [6, 22]);
    await drag(box, 7.9, 6.9);
    ok(
      Math.abs((await value(4)).trimEnd - (1 + delta(box, 7.9, 6.9) / 4)) < 0.001 &&
        Math.abs((await value(20)).trimEnd - (1 + delta(box, 7.9, 6.9) / 4)) < 0.001,
      view + ' group right trim'
    );
    box = await reset(view);
    await select(box, [6, 22]);
    await drag(box, 4.1, 5.1);
    ok(
      Math.abs((await at(4 + delta(box, 4.1, 5.1))).trimStart - delta(box, 4.1, 5.1) / 4) < 0.001 &&
        Math.abs((await at(20 + delta(box, 4.1, 5.1))).trimStart - delta(box, 4.1, 5.1) / 4) <
          0.001,
      view + ' group left trim'
    );
    box = await reset(view);
    await p.mouse.move(...coords(box, 1, 5));
    await p.mouse.down();
    await p.mouse.move(...coords(box, 25, 35), { steps: 5 });
    await p.mouse.up();
    await p.keyboard.press('Delete');
    ok(!(await value(4)) && !(await value(20)) && !!(await value(36)), view + ' marquee selection');
    box = await reset(view);
    await p.mouse.click(...coords(box, 6), { button: 'right' });
    ok((await value(4)).rev === true, view + ' right click reverse');
    box = await reset(view);
    await drag(box, 6, 8.5, 'Alt');
    v = await value(6);
    ok(v && Math.abs(v.off - (delta(box, 6, 8.5) - 2)) < 0.001, view + ' alt free drag');
    box = await reset(view);
    await drag(box, 6, 8.4, 'Control');
    v = await value(6);
    ok(
      v && Math.abs(v.off - (Math.round(delta(box, 6, 8.4) * 16) / 16 - 2)) < 0.001 && !v.rev,
      view + ' ctrl fine drag'
    );
    box = await reset(view);
    await p.mouse.move(...coords(box, 6));
    await p.mouse.down();
    await p.mouse.move(...coords(box, 9), { steps: 4 });
    await p.keyboard.press('Escape');
    await p.mouse.up();
    ok(!!(await value(4)) && !(await value(7)), view + ' escape cancels preview');
    box = await reset(view);
    await drag(box, 6, 24);
    ok(!!(await value(19)) && !!(await value(20)), view + ' collision stops before neighbour');
    box = await reset(view, { steps: [4, 8], seconds: 1 });
    await p.mouse.move(...coords(box, 8));
    ok(
      (await p.locator(box.selector).evaluate((n) => n.style.cursor)) === 'col-resize',
      view + ' crossfade cursor'
    );
    await drag(box, 8, 9);
    ok(
      Math.abs((await value(8)).xfade - ((coords(box, 9)[0] - box.left) / box.scale - 8) * 125) < 2,
      view + ' crossfade drag'
    );
    box = await reset(view);
    await p.mouse.click(...coords(box, 12));
    ok(
      !!(await value(Math.floor((coords(box, 12)[0] - box.left) / box.scale))),
      view + ' empty click adds trigger'
    );
    results.push(view);
  }
  // Linked appearances are edited once; grouped neighbours can occupy each other's old cells.
  const batch = await p.evaluate(() => {
    const { makeProject, makeSequence, songRegions, batchEditSongRegions } = test,
      q = makeProject();
    q.sequences = [makeSequence()];
    q.sequences[0].steps[0][4] = 1;
    q.sequences[0].steps[0][5] = 2;
    const rs = songRegions(q).regions.filter((r) => r.index === 0);
    const n = batchEditSongRegions(
      q,
      rs.map((region) => ({ region, patch: { start: region.start + 0.25 } }))
    ).project;
    return [n.sequences[0].steps[0][4], n.sequences[0].steps[0][5].v, n.sequences[0].steps[0][6].v];
  });
  assert.deepEqual(batch, [0, 1, 2]);
  checks++;
  assert.deepEqual(
    logs.filter((s) => s.startsWith('pageerror:')),
    []
  );
  checks++;
  console.log(
    JSON.stringify({
      checks,
      views: results,
      browser: process.env.AUDIONAUT_TEST_BROWSER || 'chromium'
    })
  );
} finally {
  await b?.close();
  await new Promise((r) => srv.close(r));
}
