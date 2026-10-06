import { describe, expect, it } from 'vitest';
import { HELMET_ASSETS, HELMET_MEMBERS } from '../helmet-data';
import { fetchHelmet, helmetStyle, parseHelmetBundle } from '../helmet';

const bundleHtml = (override: Partial<Record<string, unknown>> = {}) => {
  const assets: Record<string, unknown> = {};
  for (const name of HELMET_ASSETS) assets[`${name}.webp`] = { mime: 'image/webp', base64: 'AAAA' };
  const payload = { format: 'audionauts-helmets-v1', assets, ...override };
  return `<head><script type="application/json" id="audionauts-helmets-v1">${JSON.stringify(payload)}</script></head>`;
};

describe('helmet table', () => {
  it('covers all 111 editions', () => expect(HELMET_MEMBERS).toHaveLength(111));
  it('dresses Audionaut 29 (Callisto) like the engine does', () => {
    expect(helmetStyle(29)).toMatchObject({
      asset: 'prism',
      name: 'Callisto',
      filter: 'hue-rotate(272deg) saturate(.6) brightness(1.22)',
      pixel: true
    });
    expect(helmetStyle(29)?.clipPath).toBeUndefined();
  });
  it('gives outline-clipped helmets a polygon', () => {
    const outlined = Array.from({ length: 111 }, (_, i) => helmetStyle(i + 1)).find((s) => s?.clipPath);
    expect(outlined?.clipPath).toMatch(/^polygon\(\d/);
  });
  it('rejects editions outside 1 to 111', () => {
    expect(helmetStyle(0)).toBeNull();
    expect(helmetStyle(112)).toBeNull();
  });
});

describe('parseHelmetBundle', () => {
  it('returns a data URL per helmet', () => {
    const parsed = parseHelmetBundle(bundleHtml());
    expect(Object.keys(parsed ?? {})).toEqual([...HELMET_ASSETS]);
    expect(parsed?.prism).toBe('data:image/webp;base64,AAAA');
  });
  it('rejects a wrong format or a missing helmet', () => {
    expect(parseHelmetBundle(bundleHtml({ format: 'other' }))).toBeNull();
    expect(parseHelmetBundle(bundleHtml({ assets: {} }))).toBeNull();
    expect(parseHelmetBundle('<html></html>')).toBeNull();
    expect(parseHelmetBundle(undefined)).toBeNull();
  });
});

describe('fetchHelmet', () => {
  it('loads the bundle once and returns the look', async () => {
    let calls = 0;
    const fetchImpl = (async () => {
      calls++;
      return { ok: true, text: async () => bundleHtml() } as unknown as Response;
    }) as unknown as typeof fetch;
    const a = await fetchHelmet(29, { fetchImpl });
    const b = await fetchHelmet(30, { fetchImpl });
    expect(a?.src).toBe('data:image/webp;base64,AAAA');
    expect(b?.name).toBeTruthy();
    expect(calls).toBe(1);
  });
});
