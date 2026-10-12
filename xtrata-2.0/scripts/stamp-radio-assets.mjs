// Stamp the radio's script URLs with a content hash (`?v=…`) in the pages that load them.
//
// Why: on the custom domains, Cloudflare's zone "Browser Cache TTL" overrides the `no-cache` in
// public/_headers and serves these scripts with `max-age=14400`, so a browser can keep running a
// four-hour-old radio or pay-per-play script inside a freshly loaded page. The pages themselves are
// served with max-age=0, so a hash in the URL guarantees the page always loads the matching script.
//
// Runs after `build:radio` and `build:radio-ppp`. Deterministic: rerunning on unchanged bundles
// changes nothing.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const root = new URL('../public/', import.meta.url);
const hash = (path) => createHash('sha256').update(readFileSync(new URL(path, root))).digest('hex').slice(0, 12);

const assets = { '/xtrata-radio.js': hash('xtrata-radio.js'), '/radio/ppp.js': hash('radio/ppp.js') };
const pages = ['radio.html', 'radio/browser-lounge.html', 'bip110.html'];

for (const page of pages) {
  const file = new URL(page, root);
  const before = readFileSync(file, 'utf8');
  let after = before;
  for (const [path, v] of Object.entries(assets)) {
    const escaped = path.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
    after = after.replace(new RegExp(`(["'])${escaped}(\\?v=[0-9a-f]+)?\\1`, 'g'), `$1${path}?v=${v}$1`);
  }
  if (after !== before) { writeFileSync(file, after); console.log(`stamped ${page}`); }
}
