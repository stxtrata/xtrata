// MIDI roll safety: Clear asks first and is undoable; Backspace deletes are undoable; the
// roll's own Undo/Redo buttons follow the project history; row paste warns before replacing.
// Run from xtrata-2.0: node public/audionaut-beta/tools/pro-roll-undo-test.mjs
import assert from 'node:assert/strict';
import { serve, browser, page } from './serve.mjs';
const edition = process.env.AUDIONAUT_EDITION || 'audionaut-beta';
const server = await serve(), b = await browser(), logs = [];
try {
  const p = await page(b, server.url, { logs });
  let answer = false, prompts = [];
  p.on('dialog', (d) => { prompts.push(d.message()); return answer ? d.accept() : d.dismiss(); });
  await p.goto(`${server.url}/${edition}/daw.html`);
  await p.waitForSelector('#synth-front', { state: 'attached' });
  const setup = await p.evaluate(async () => {
    const { store } = await import('./daw/js/state.js');
    const roll = await import('./daw/js/pianoroll.js');
    store.setNotes(0, [60, 64, 67].map((pitch, k) => ({ id: 't' + k, pitch, step: k * 4, dur: 2, vel: 0.8, rawStep: k * 4, rawDur: 2, expression: [] })));
    roll.openRoll(0);
    await new Promise((r) => setTimeout(r, 800)); // let the MIDI-permission status settle first
    window.__count = () => store.seq.notes[0].length;
    // Headless Chrome has no MIDI, so the roll may also post a MIDI-permission status: keep every message.
    window.__statuses = [];
    new MutationObserver(() => window.__statuses.push(document.querySelector('#roll-status').textContent)).observe(document.querySelector('#roll-status'), { childList: true, characterData: true, subtree: true });
    return { notes: window.__count(), undoDisabled: document.querySelector('#roll-undo').disabled };
  });
  assert.equal(setup.notes, 3);
  const count = () => p.evaluate(() => window.__count());
  const status = () => p.evaluate(() => window.__statuses.splice(0).join(' | '));
  // 1. Clear, then cancel: nothing changes.
  await p.click('#roll-clear');
  assert.equal(await count(), 3);
  assert.match(prompts.at(-1), /Clear all 3 notes/);
  assert.match(await status(), /cancelled/);
  // 2. Clear, confirm: notes go, status points at undo, roll Undo brings them back, Redo clears again.
  answer = true;
  await p.click('#roll-clear');
  assert.equal(await count(), 0);
  assert.match(await status(), /Undo/);
  assert.equal(await p.isDisabled('#roll-undo'), false);
  await p.click('#roll-undo');
  assert.equal(await count(), 3);
  assert.equal(await p.isDisabled('#roll-redo'), false);
  await p.click('#roll-redo');
  assert.equal(await count(), 0);
  await p.click('#roll-undo');
  assert.equal(await count(), 3);
  // 3. Select all + Backspace: deleted without a prompt, then ⌘/Ctrl+Z restores.
  const before = prompts.length;
  await p.click('#roll-canvas', { position: { x: 5, y: 5 } }).catch(() => {});
  await p.evaluate(() => document.querySelector('#roll-canvas').focus?.());
  await p.keyboard.press('Control+a');
  await p.keyboard.press('Backspace');
  assert.equal(await count(), 0);
  assert.equal(prompts.length, before);
  assert.match(await status(), /Deleted 3 notes.*Undo/);
  await p.keyboard.press('Control+z');
  assert.equal(await count(), 3);
  // 4. Empty roll: Clear does not prompt.
  await p.evaluate(async () => { const { store } = await import('./daw/js/state.js'); store.setNotes(0, []); });
  const n = prompts.length;
  await p.click('#roll-clear');
  assert.equal(prompts.length, n);
  // 5. Row paste over existing notes warns first (dismiss keeps them).
  const paste = await p.evaluate(async () => {
    const { store } = await import('./daw/js/state.js');
    (await import('./daw/js/pianoroll.js')).closeRoll();
    store.setNotes(0, [{ id: 'a', pitch: 60, step: 0, dur: 2, vel: 0.8, rawStep: 0, rawDur: 2, expression: [] }]);
    store.setNotes(1, [{ id: 'b', pitch: 62, step: 0, dur: 2, vel: 0.8, rawStep: 0, rawDur: 2, expression: [] }, { id: 'c', pitch: 64, step: 4, dur: 2, vel: 0.8, rawStep: 4, rawDur: 2, expression: [] }]);
    await new Promise((r) => setTimeout(r, 50));
    const rows = [...document.querySelectorAll('.channel.instrument')];
    const btn = (row, title) => [...row.querySelectorAll('button')].find((x) => x.title.startsWith(title));
    btn(rows[0], 'Copy MIDI notes').click();
    return { pasteButton: !!btn(rows[1], 'Paste MIDI notes'), click: () => {} };
  });
  assert.ok(paste.pasteButton);
  answer = false;
  await p.evaluate(() => { const rows = [...document.querySelectorAll('.channel.instrument')]; [...rows[1].querySelectorAll('button')].find((x) => x.title.startsWith('Paste MIDI notes')).click(); });
  assert.match(prompts.at(-1), /Replace the 2 notes/);
  assert.equal(await p.evaluate(async () => (await import('./daw/js/state.js')).store.seq.notes[1].length), 2);
  answer = true;
  await p.evaluate(() => { const rows = [...document.querySelectorAll('.channel.instrument')]; [...rows[1].querySelectorAll('button')].find((x) => x.title.startsWith('Paste MIDI notes')).click(); });
  assert.equal(await p.evaluate(async () => (await import('./daw/js/state.js')).store.seq.notes[1].length), 1);
  console.log('roll undo ok:', prompts.length, 'prompts checked');
  assert.deepEqual(logs, []);
} finally {
  await b.close();
  await new Promise((resolve) => server.srv.close(resolve));
}
