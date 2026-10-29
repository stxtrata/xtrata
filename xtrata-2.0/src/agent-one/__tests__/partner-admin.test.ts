import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { RESERVED_SLUGS, addPartner, listPartners, lookalikeKey, setActive } from '../partner-admin';
import { XTRATA_FEE_ADDRESS, parseRegistry } from '../referral';

const A = 'SP8H248H248H248H248H248H248H248H24ARTQ82';
const B = 'SPH248H248H248H248H248H248H248H249PPB6QW';
const empty = () => ({ version: 1, partners: [] as unknown[] });
const ok = <T extends { ok: boolean }>(r: T) => { expect(r.ok).toBe(true); return r as Extract<T, { ok: true }>; };
const bad = (r: { ok: boolean; errors?: string[] }) => { expect(r.ok).toBe(false); return (r.errors ?? []).join(' | '); };

describe('the committed registry', () => {
  it('parses with no errors (this is what the wizard loads)', () => {
    const raw = JSON.parse(readFileSync(new URL('../../../public/music-partners.json', import.meta.url), 'utf8'));
    expect(parseRegistry(raw).errors).toEqual([]);
  });
});

describe('addPartner: standard terms', () => {
  it('writes only what is needed, so the entry shows the deal; the wizard then reads the standard 25%, self-referral off', () => {
    const res = ok(addPartner(empty(), { slug: 'blue-note', name: 'Blue Note', address: A }));
    expect(res.registry.partners).toEqual([{ slug: 'blue-note', name: 'Blue Note', payoutAddress: A, active: true }]);
    expect(parseRegistry(res.registry).partners[0]).toMatchObject({ shareBps: 2500, selfReferral: false });
    expect(res.summary).toContain('25%');
    expect(res.summary).toContain('self-referral off');
  });
  it('a negotiated deal is written out explicitly: share 0.5 with self-referral on', () => {
    const res = ok(addPartner(empty(), { slug: 'fak-fun', name: 'fak.fun', address: A, share: 0.5, selfReferral: true }));
    expect(res.registry.partners[0]).toMatchObject({ share: 0.5, selfReferral: true });
    expect(parseRegistry(res.registry).partners[0]).toMatchObject({ shareBps: 5000, selfReferral: true });
  });
  it('does not change the input registry', () => {
    const input = empty(); Object.freeze(input.partners);
    ok(addPartner(input, { slug: 'blue-note', name: 'Blue Note', address: A }));
    expect(input.partners).toHaveLength(0);
  });
});

describe('addPartner: refusals', () => {
  const base = { name: 'X', address: A };
  it('bad slugs', () => {
    for (const slug of ['', 'Has Caps', 'a'.repeat(24), '-lead', 'trail-', 'sp ace', 'a_b']) {
      expect(addPartner(empty(), { ...base, slug }).ok, slug).toBe(false);
    }
  });
  it('reserved names and look-alikes of them', () => {
    expect(bad(addPartner(empty(), { ...base, slug: 'xtrata' }))).toContain('reserved');
    expect(bad(addPartner(empty(), { ...base, slug: 'x-trata' }))).toContain('too close to "xtrata"');
    expect(bad(addPartner(empty(), { ...base, slug: 'adm1n' }))).toContain('too close to "admin"');
    expect(RESERVED_SLUGS.every((s) => s === s.toLowerCase())).toBe(true);
  });
  it('look-alikes of an existing partner, and exact duplicates', () => {
    const one = ok(addPartner(empty(), { slug: 'fak-fun', name: 'fak.fun', address: A })).registry;
    expect(bad(addPartner(one, { slug: 'fakfun', name: 'x', address: B }))).toContain('too close to "fak-fun"');
    expect(bad(addPartner(one, { slug: 'f4k-fun', name: 'x', address: B }))).toContain('too close to "fak-fun"');
    expect(bad(addPartner(one, { slug: 'fak-fun', name: 'x', address: B }))).toContain('already registered');
  });
  it('payout address: invalid, testnet, the Xtrata fee address, or already used', () => {
    expect(addPartner(empty(), { slug: 'a1', name: 'x', address: 'nope' }).ok).toBe(false);
    expect(addPartner(empty(), { slug: 'a1', name: 'x', address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM' }).ok).toBe(false);
    expect(addPartner(empty(), { slug: 'a1', name: 'x', address: XTRATA_FEE_ADDRESS }).ok).toBe(false);
    const one = ok(addPartner(empty(), { slug: 'one', name: 'One', address: A })).registry;
    expect(bad(addPartner(one, { slug: 'two', name: 'Two', address: A }))).toContain('already belongs to "one"');
  });
  it('shares outside 0..1 or with too many decimals; bad names', () => {
    for (const share of [-0.1, 1.1, 0.12345, Number.NaN]) expect(addPartner(empty(), { ...base, slug: 'ok', share }).ok, String(share)).toBe(false);
    expect(addPartner(empty(), { slug: 'ok', name: '<script>', address: A }).ok).toBe(false);
  });
  it('refuses to edit a registry that is already invalid, and says why', () => {
    const broken = { version: 1, partners: [{ slug: 'Bad Slug', name: 'x', payoutAddress: A, active: true }] };
    expect(bad(addPartner(broken, { slug: 'fine', name: 'Fine', address: B }))).toContain('already invalid');
  });
});

describe('setActive and listPartners', () => {
  it('switches a partner off and on without touching the others', () => {
    let reg = ok(addPartner(empty(), { slug: 'one', name: 'One', address: A })).registry;
    reg = ok(addPartner(reg, { slug: 'two', name: 'Two', address: B })).registry;
    const off = ok(setActive(reg, 'one', false)).registry;
    expect(parseRegistry(off).partners.map((p) => [p.slug, p.active])).toEqual([['one', false], ['two', true]]);
    expect(ok(setActive(off, 'one', true)).registry).toEqual(reg);
    expect(bad(setActive(reg, 'nobody', false))).toContain('no partner');
  });
  it('lists partners with their terms', () => {
    const reg = ok(addPartner(empty(), { slug: 'fak-fun', name: 'fak.fun', address: A, share: 0.5, selfReferral: true })).registry;
    const [line] = listPartners(reg);
    expect(line).toMatch(/active\s+fak-fun\s+50%\s+self-referral on\s+SP8H/);
  });
});

describe('lookalikeKey', () => {
  it('folds hyphens and look-alike characters', () => {
    expect(lookalikeKey('fak-fun')).toBe(lookalikeKey('f4kfun'));
    expect(lookalikeKey('xtrata')).not.toBe(lookalikeKey('xtrada'));
  });
});
