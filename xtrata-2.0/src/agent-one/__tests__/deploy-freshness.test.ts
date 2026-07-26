import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const core = readFileSync(new URL('../agent-core.ts', import.meta.url), 'utf8');
const headers = readFileSync(new URL('../../../public/_headers', import.meta.url), 'utf8');
const pages = ['index.html', 'suno.html', 'manifests.html'].map((f) => ({
  f, html: readFileSync(new URL(`../../../xtrata-agent-one/wizard/${f}`, import.meta.url), 'utf8')
}));

const AGENT_BUILD = /AGENT_BUILD = '([^']+)'/.exec(core)?.[1] ?? '';

// A deploy shipped the right bundle and the browser ran an eleven-version-old one:
// /wizard/*.js in _headers never matched (Cloudflare Pages does not support a `*`
// mid-segment), so agent-one.js fell back to the Pages default of max-age=14400, and
// the ?v= cache-buster in the pages had not moved since v=16.
describe('a redeploy actually reaches the browser', () => {
  it('busts the cache with the agent build itself, so it cannot drift', () => {
    expect(AGENT_BUILD).toMatch(/^\d{4}-\d{2}-\d{2}\.\d+$/);
    for (const { f, html } of pages) {
      const refs = [...html.matchAll(/agent-one\.js\?v=([^"']+)/g)].map((m) => m[1]);
      expect(refs.length, `${f} should load the agent bundle`).toBeGreaterThan(0);
      for (const v of refs) expect(v, `${f} cache-buster is stale`).toBe(AGENT_BUILD);
    }
  });

  it('marks the stable-named bundles no-cache by EXACT path', () => {
    // Exact paths only: a mid-segment wildcard silently matches nothing here.
    expect(headers).not.toMatch(/^\/wizard\/\*\.js$/m);
    for (const file of ['agent-one.js', 'suno-build.js', 'HTML_Template.js']) {
      const rule = new RegExp(`^/wizard/${file.replace('.', '\\.')}\\n\\s+Cache-Control: no-cache`, 'm');
      expect(headers, `no no-cache rule for ${file}`).toMatch(rule);
    }
  });

  it('keeps the SUNO handshake at or below the shipped build', () => {
    const min = /XAO_MIN_AGENT_BUILD='([^']+)'/.exec(pages.find((p) => p.f === 'suno.html')!.html)?.[1] ?? '';
    expect(min).toBeTruthy();
    // Requiring a build newer than the one we ship bricks the page on deploy.
    expect(min <= AGENT_BUILD, `handshake ${min} > shipped ${AGENT_BUILD}`).toBe(true);
  });
});
