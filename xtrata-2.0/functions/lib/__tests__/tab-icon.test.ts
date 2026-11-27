import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { shouldInjectTabIcon, tabIconMarkup, tabIconGuard } from '../tab-icon';

const req = (headers: Record<string, string> = {}, method = 'GET') =>
  new Request('https://xtrata.xyz/inscription/6343', { method, headers });
const html = (status = 200, type = 'text/html') =>
  new Response('<html><head><title>x</title></head><body></body></html>', {
    status,
    headers: { 'content-type': type }
  });

describe('tab icon for raw inscription tabs', () => {
  it('only targets top-level, full, GET HTML documents', () => {
    expect(shouldInjectTabIcon(req({ 'sec-fetch-dest': 'document' }), html())).toBe(true);
    expect(shouldInjectTabIcon(req({ 'sec-fetch-dest': 'iframe' }), html())).toBe(false);
    expect(shouldInjectTabIcon(req({ 'sec-fetch-dest': 'empty' }), html())).toBe(false);
    expect(shouldInjectTabIcon(req({}), html())).toBe(false);
    expect(shouldInjectTabIcon(req({ 'sec-fetch-dest': 'document', range: 'bytes=0-9' }), html())).toBe(false);
    expect(shouldInjectTabIcon(req({ 'sec-fetch-dest': 'document' }), html(206))).toBe(false);
    expect(shouldInjectTabIcon(req({ 'sec-fetch-dest': 'document' }), html(200, 'image/svg+xml'))).toBe(false);
    expect(shouldInjectTabIcon(req({ 'sec-fetch-dest': 'document' }, 'HEAD'), html())).toBe(false);
  });

  it('uses absolute icon URLs so an inscription <base href> cannot break them', () => {
    const markup = tabIconMarkup('https://xtrata.xyz');
    expect(markup).toContain('href="https://xtrata.xyz/favicon.svg"');
    expect(markup).toContain('href="https://xtrata.xyz/favicons/xtrata-favicon-32.png"');
  });

  it('passes bytes through untouched where HTMLRewriter is unavailable', async () => {
    const res = await tabIconGuard({ request: req({ 'sec-fetch-dest': 'document' }), next: async () => html() });
    expect(await res.text()).not.toContain('rel="icon"');
  });

  it('ships a real /favicon.ico so the browser fallback never hits the SPA shell', () => {
    const ico = readFileSync('public/favicon.ico');
    expect([...ico.subarray(0, 4)]).toEqual([0, 0, 1, 0]);
  });
});
