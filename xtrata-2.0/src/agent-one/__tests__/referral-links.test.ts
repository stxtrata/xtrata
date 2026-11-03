import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseRegistry, sanitizeSlug } from '../referral';

// Static checks on how referral links are served. The redirect behaviour itself was also
// checked against the Cloudflare Pages emulator (wrangler pages dev) when this was written.
const read = (p: string) => readFileSync(new URL(p, import.meta.url), 'utf8');
const redirects = read('../../../public/_redirects');
const headers = read('../../../public/_headers');
const musicPage = read('../../../music/index.html');
const registry = JSON.parse(read('../../../public/music-partners.json'));

const rules = redirects.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#')).map((l) => l.split(/\s+/));

describe('/m/<slug> short links', () => {
  it('redirects /m/:slug to the music wizard with only the slug', () => {
    expect(rules.find((x) => x[0] === '/m/:slug')).toEqual(['/m/:slug', '/music/?ref=:slug', '302']);
  });
  it('/m and /m/ go to the normal music page', () => {
    expect(rules.find((x) => x[0] === '/m')).toEqual(['/m', '/music/', '302']);
    expect(rules.find((x) => x[0] === '/m/')).toEqual(['/m/', '/music/', '302']);
  });
  it('is temporary (302), so a partner can be switched off without a cached 301', () => {
    for (const r of rules.filter((x) => x[0] === '/m' || x[0] === '/m/' || x[0] === '/m/:slug')) expect(r[2]).toBe('302');
  });
  it('there are exactly these three /m rules, and no catch-all placeholder rule before them', () => {
    expect(rules.filter((x) => x[0] === '/m' || x[0].startsWith('/m/')).length).toBe(3);
    const first = rules.findIndex((x) => x[0] === '/m/:slug');
    expect(rules.slice(0, first).some((x) => /^\/(:\w+|\*)/.test(x[0]))).toBe(false);
  });
});

describe('registry hosting', () => {
  it('is revalidated on every load, so an edit or active:false takes effect at once', () => {
    expect(headers).toMatch(/^\/music-partners\.json\n\s+Cache-Control: no-cache$/m);
  });
  it('the shipped registry is valid and its only active partner is fak.fun, on the agreed terms', () => {
    // Every go-live PR edits this on purpose: a partner earns real STX the moment they are listed,
    // so the shipped list is pinned here and any change to it has to be a visible edit to this test.
    const p = parseRegistry(registry);
    expect(p.errors).toEqual([]);
    expect(p.partners.filter((x) => x.active).map((x) => ({ slug: x.slug, address: x.address, shareBps: x.shareBps, selfReferral: x.selfReferral }))).toEqual([
      { slug: 'fak-fun', address: 'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22', shareBps: 5000, selfReferral: true },
    ]);
  });
});

/** The page's own slug reader, pulled out of music/index.html and run against a fake browser. */
function pageReader() {
  const m = /function referralSlug\(\)\{[\s\S]*?\n\}\n/.exec(musicPage);
  expect(m).not.toBeNull();
  return (search: string, session: Record<string, string> = {}, broken = false) => {
    const store: Record<string, string> = { ...session };
    const sessionStorage = broken
      ? { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } }
      : { getItem: (k: string) => (k in store ? store[k] : null), setItem: (k: string, v: string) => { store[k] = v; } };
    const fn = new Function('location', 'sessionStorage', 'URLSearchParams', `${m![0]}; return referralSlug;`)({ search }, sessionStorage, URLSearchParams);
    return { read: () => fn() as string | null, store };
  };
}

describe('the music page reads ?ref=', () => {
  const page = pageReader();
  it('accepts a good slug, lowercases it, and remembers it for the tab', () => {
    const a = page('?ref=Fak-Fun');
    expect(a.read()).toBe('fak-fun'); expect(a.store['xtrata-music-ref']).toBe('fak-fun');
    expect(page('', { 'xtrata-music-ref': 'fak-fun' }).read()).toBe('fak-fun');
  });
  it('a new valid ref replaces the remembered one; a bad ref falls back to the remembered one', () => {
    expect(page('?ref=other', { 'xtrata-music-ref': 'fak-fun' }).read()).toBe('other');
    expect(page('?ref=../x', { 'xtrata-music-ref': 'fak-fun' }).read()).toBe('fak-fun');
  });
  it('rejects anything that is not a plain slug', () => {
    for (const bad of ['', 'a b', '../x', 'a/b', '-a', 'a-', 'x'.repeat(24), '<script>', 'SP8H248H248H248H248H248H248H248H24ARTQ82.x', '%00']) {
      expect(page('?ref=' + encodeURIComponent(bad)).read()).toBeNull();
    }
  });
  it('works when session storage is blocked', () => {
    expect(page('?ref=fak-fun', {}, true).read()).toBe('fak-fun');
    expect(page('', {}, true).read()).toBeNull();
  });
  it('agrees with the agent-side sanitiser on arbitrary input', () => {
    let seed = 12345; const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
    const alphabet = 'abcXYZ019-_. /%<>é ';
    for (let i = 0; i < 4000; i += 1) {
      const len = Math.floor(rnd() * 28);
      let s = ''; for (let k = 0; k < len; k += 1) s += alphabet[Math.floor(rnd() * alphabet.length)];
      expect(page('?ref=' + encodeURIComponent(s)).read()).toBe(sanitizeSlug(s));
    }
  });
  it('sends only the slug with the job', () => {
    expect(musicPage).toContain('A.createJob({...body,referral:referralSlug()})');
  });
});

describe('only the music and Suno pages take a referral', () => {
  it('no other wizard page mentions it', () => {
    // The general wizard and the manifest page stay out of the referral program on purpose.
    // (Suno joined in 2026-11; its own wiring is covered by referral-suno.test.ts.)
    for (const f of ['index.html', 'manifests.html']) expect(read('../../../xtrata-agent-one/wizard/' + f)).not.toMatch(/referralSlug|xtrata-music-ref/);
  });
  it('the Suno page does take it', () => {
    expect(read('../../../xtrata-agent-one/wizard/suno.html')).toMatch(/referralSlug/);
  });
});
