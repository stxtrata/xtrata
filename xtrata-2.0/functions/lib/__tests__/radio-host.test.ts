import { describe, expect, it, vi } from 'vitest';
import { radioHostGuard, radioHost } from '../radio-host';
import { readFileSync } from 'node:fs';

const env = { RADIO_PPP_HOST: 'radio.xtrata.test' };
const run = async (url: string, e: any = env) => {
  const next = vi.fn(async () => new Response('<script>alert(1)</script>', { headers: { 'content-type': 'text/html' } }));
  const res = await radioHostGuard({ request: new Request(url), env: e, next });
  return { res, next };
};

describe('pay-per-play radio host guard', () => {
  it('leaves the main site untouched', async () => {
    const { res, next } = await run('https://xtrata.test/runtime/?tokenId=1');
    expect(next).toHaveBeenCalled();
    expect(res.headers.get('content-security-policy')).toBeNull();
    expect((await run('https://radio.xtrata.test/runtime/', {})).next).toHaveBeenCalled(); // switch unset
  });
  it('never runs the executable runtime, gallery, explorer or module host as the radio origin', async () => {
    for (const path of ['/runtime/', '/runtime/?tokenId=666', '/runtime/wallet-shim.js', '/runtime/modules/x', '/g/', '/g/abc', '/explorer/1', '/debug/radio']) {
      const { res, next } = await run('https://radio.xtrata.test' + path);
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toBe(302);
      expect(res.headers.get('location')).toBe('https://xtrata.xyz' + path);
    }
  });
  it('serves the media the radio needs, sandboxed so HTML cannot run as the radio', async () => {
    for (const path of ['/runtime/content?tokenId=1', '/i/123', '/inscription/123']) {
      const { res, next } = await run('https://radio.xtrata.test' + path);
      expect(next).toHaveBeenCalled();
      expect(res.headers.get('content-security-policy')).toBe('sandbox');
    }
  });
  it('validates the configured hostname', () => {
    expect(radioHost({ RADIO_PPP_HOST: ' Radio.Xtrata.xyz ' })).toBe('radio.xtrata.xyz');
    expect(radioHost({ RADIO_PPP_HOST: 'https://radio.xtrata.xyz' })).toBeNull();
    expect(radioHost({})).toBeNull();
  });
  it('sandboxes every other static page on the radio host except the radio pages (public/_headers)', () => {
    const headers = readFileSync(new URL('../../../public/_headers', import.meta.url), 'utf8');
    expect(headers).toMatch(/https:\/\/radio\.xtrata\.xyz\/\*\n  Content-Security-Policy: sandbox\n/);
    for (const page of ['/radio', '/radio.html']) expect(headers).toContain(`https://radio.xtrata.xyz${page}\n  ! Content-Security-Policy`);
    expect(headers).not.toMatch(/radio\.xtrata\.xyz\/(runtime|g|wizard|index)/);
  });
});
