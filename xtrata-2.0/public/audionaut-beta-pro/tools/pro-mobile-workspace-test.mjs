import assert from 'node:assert/strict';
import { serve, browser, page, selectWorkspace } from './serve.mjs';
const server = await serve(),
  b = await browser(),
  logs = [];
try {
  const p = await page(b, server.url, { width: 390, height: 844, logs });
  p.setDefaultTimeout(9000);
  const studio = server.url + '/audionaut-beta-pro/daw.html';
  await p.goto(studio);
  await p.waitForSelector('.mobile-pads button');
  await p.waitForFunction(() => document.querySelector('#project-name').value.includes('Lagos'));
  assert.equal(await p.locator('.mobile-pads button').count(), 16);
  const documentBefore = await p.evaluate(async () =>
    JSON.stringify((await import('/audionaut-beta-pro/daw/js/state.js')).store.project)
  );
  await selectWorkspace(p, 'Timeline');
  await p.waitForSelector('.song-canvas');
  await selectWorkspace(p, 'Mobile');
  await p.waitForSelector('.mobile-pads');
  assert.equal(
    await p.evaluate(async () =>
      JSON.stringify((await import('/audionaut-beta-pro/daw/js/state.js')).store.project)
    ),
    documentBefore
  );
  await p.getByRole('button', { name: 'Bar 3', exact: true }).click();
  const pad = p.locator('.mobile-pads button').first(),
    previous = await pad.getAttribute('aria-pressed');
  await pad.click();
  assert.notEqual(await pad.getAttribute('aria-pressed'), previous);
  const saved = await p.evaluate(async () => {
    const { store, stepVal } = await import('/audionaut-beta-pro/daw/js/state.js');
    const id = document.querySelector('#mobile-track').value;
    return !!stepVal(store.seq.steps[store.project.channels.findIndex((c) => c.id === id)][32]);
  });
  assert.equal(saved, previous !== 'true');
  await p.getByRole('button', { name: 'Show me', exact: true }).click();
  await p.waitForSelector('#btn-play.studio-target');
  await p.getByRole('button', { name: 'End lesson', exact: true }).click();
  assert.equal(await p.locator('.studio-target').count(), 0);
  await p.locator('#studio-help').click();
  await p.getByRole('searchbox', { name: 'Search the guide' }).fill('inscription');
  assert.equal(await p.locator('.studio-help details[open]').count(), 1);
  await p.getByRole('button', { name: 'Add a channel effect', exact: true }).click();
  await p.locator('#mobile-effects.studio-target').click();
  await p.locator('#chain-add-type.studio-target').selectOption({ index: 1 });
  await p.locator('#chain-add-btn.studio-target').click();
  await p.locator('#chain-close.studio-target').click();
  assert.equal(await p.locator('.studio-target').count(), 0);
  const lesson = async (name) => {
    await p.locator('#studio-help').click();
    await p.getByRole('button', { name, exact: true }).click();
  };
  await lesson('Load and place a sample');
  await p.locator('#mobile-load.studio-target').click();
  await p.locator('#modal-loader [data-tab="library"].studio-target').click();
  const pack = await p
    .locator('#library-category option')
    .evaluateAll((options) => options.find((o) => o.label.includes('Analog')).value);
  await p.locator('#library-category').selectOption(pack);
  await p.locator('#library-sample.studio-target').selectOption({ index: 1 });
  await p.locator('#loader-load.studio-target').click();
  await p.locator('.mobile-pads.studio-target button[aria-pressed=false]').first().click();
  assert.equal(await p.locator('.studio-target').count(), 0);
  await lesson('Trim a sample');
  await p.locator('#mobile-trim.studio-target').click();
  await p.locator('#trim-start.studio-target').focus();
  await p.keyboard.press('ArrowRight');
  await p.locator('#trim-close.studio-target').click();
  await lesson('Layer a second channel');
  await p.locator('select.studio-target').selectOption({ index: 1 });
  await p.locator('.mobile-pads.studio-target button').first().click();
  await p.locator('#btn-play.studio-target').click();
  await p.locator('#btn-stop').click();
  assert.equal(await p.locator('.studio-target').count(), 0);
  await selectWorkspace(p, 'Sequences');
  await p.reload();
  await p.waitForSelector('#studio-help');
  assert.equal(await p.locator('#workspace-tab-sequence').getAttribute('aria-selected'), 'true');
  await selectWorkspace(p, 'Mobile');
  for (const width of [320, 390, 768, 1440]) {
    await p.setViewportSize({ width, height: 844 });
    assert.ok(
      await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      'No horizontal page overflow at ' + width
    );
    for (const selector of [
      '#btn-play',
      '#studio-help',
      '.mobile-pads',
      '[popovertarget=studio-views]'
    ]) {
      const box = await p.locator(selector).boundingBox();
      assert.ok(box && box.x >= 0 && box.x + box.width <= width + 1, selector + ' fits ' + width);
    }
  }
  await p.setViewportSize({ width: 390, height: 844 });
  await p.screenshot({ path: '/tmp/audionaut-mobile-studio.png' });
  await p.setViewportSize({ width: 1440, height: 900 });
  await selectWorkspace(p, 'Sequences');
  await p.screenshot({ path: '/tmp/audionaut-sequences-studio.png' });
  assert.deepEqual(
    logs.filter((l) => l.startsWith('pageerror:')),
    []
  );
  console.log(
    'PASS Mobile defaults, shared project edits, guided effects workflow, Help, remembered view and responsive controls'
  );
} finally {
  await b.close();
  server.srv.close();
}
