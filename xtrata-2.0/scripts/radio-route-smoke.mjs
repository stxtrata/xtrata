import assert from 'node:assert/strict';

const base = process.argv[2];
if (!base) throw new Error('Usage: node scripts/radio-route-smoke.mjs <base-url>');
const pages = [
  ['share', 'Embed Xtrata Radio'],
  ['embed', 'Xtrata Radio player'],
  ['guide', 'How to listen to Xtrata Radio']
];
for (const [name, title] of pages) {
  for (const suffix of ['', '.html']) {
    const query = name === 'embed' ? '?mode=minimal' : '';
    let url = new URL(`/radio/${name}${suffix}${query}`, base);
    const visited = new Set();
    for (let hop = 0; ; hop++) {
      assert(hop <= 3, `Too many redirects: ${url}`);
      assert(!visited.has(url.href), `Redirect loop: ${url}`);
      visited.add(url.href);
      const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(10000) });
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get('location');
        assert(location, `Missing redirect destination: ${url}`);
        await response.body?.cancel();
        url = new URL(location, url);
        continue;
      }
      assert.equal(response.status, 200, `Page failed: ${url}`);
      assert.match(response.headers.get('content-type') || '', /text\/html/);
      assert((await response.text()).includes(`<title>${title}</title>`), `Wrong page: ${url}`);
      if (query) assert.equal(url.searchParams.get('mode'), 'minimal');
      console.log(`PASS /radio/${name}${suffix}${query} (${hop} redirects)`);
      break;
    }
  }
}
