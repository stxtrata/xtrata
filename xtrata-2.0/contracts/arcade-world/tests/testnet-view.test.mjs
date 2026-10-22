// The local testnet page builder: it can list the pages a lobby door may open (window.XA_ROOMS) and refuses anything that is not a plain file name.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTestnetViewHtml } from '../ops/lib/preview.mjs';

const base = { world: 'ST1.xtrata-world-v1', posters: 'ST1.xtrata-posters-v1', hallHtml: '<html><head></head><body></body></html>' };

test('rooms become window.XA_ROOMS, before the world config', () => {
  const html = buildTestnetViewHtml({ ...base, rooms: { casino: { src: 'casino-room.html', title: 'ROYAL FLUSH CASINO' } } });
  const i = html.indexOf('window.XA_ROOMS='), j = html.indexOf('window.XA_WORLD_CONFIG=');
  assert.ok(i > 0 && i < j);
  assert.match(html, /window\.XA_ROOMS=\{"casino":\{"src":"casino-room\.html","title":"ROYAL FLUSH CASINO"\}\}/);
});
test('no rooms, no XA_ROOMS; the title defaults to the slug', () => {
  assert.ok(!buildTestnetViewHtml(base).includes('XA_ROOMS'));
  assert.match(buildTestnetViewHtml({ ...base, rooms: { casino: { src: 'c.html' } } }), /"title":"CASINO"/);
});
test('a room source must be a plain .html file name beside the page', () => {
  for (const src of ['https://evil.example/x.html', '../x.html', '/x.html', 'x.js', 'a b.html'])
    assert.throws(() => buildTestnetViewHtml({ ...base, rooms: { casino: { src } } }), /src must be a file name/, src);
  assert.throws(() => buildTestnetViewHtml({ ...base, rooms: { 'Bad Slug': { src: 'x.html' } } }), /slug/);
});
