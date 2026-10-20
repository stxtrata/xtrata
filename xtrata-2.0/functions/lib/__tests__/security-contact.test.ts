import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(__dirname, '../../..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');

describe('security contact files', () => {
  it('ships a valid RFC 9116 security.txt', () => {
    const body = read('public/.well-known/security.txt');
    const fields = Object.fromEntries(
      body
        .split('\n')
        .filter((l) => l && !l.startsWith('#'))
        .map((l) => [l.slice(0, l.indexOf(':')), l.slice(l.indexOf(':') + 1).trim()])
    );
    expect(fields.Contact).toMatch(/^(https:\/\/|mailto:)/);
    expect(fields.Canonical).toBe('https://xtrata.xyz/.well-known/security.txt');
    // An expired security.txt is treated as stale by scanners: fail loudly before that happens.
    expect(Date.parse(fields.Expires)).toBeGreaterThan(Date.now());
  });

  it('serves the abuse page the policy and contact point to', () => {
    expect(existsSync(resolve(root, 'public/abuse.html'))).toBe(true);
    const page = read('public/abuse.html');
    expect(page).toContain('https://xtrata.xyz/abuse');
    expect(page).toContain('/.well-known/security.txt');
    expect(read('public/.well-known/security.txt')).toContain('https://xtrata.xyz/abuse');
  });

  it('is not swallowed by a catch-all redirect', () => {
    const redirects = read('public/_redirects');
    expect(redirects).not.toMatch(/^\/\*\s/m);
    expect(redirects).not.toMatch(/^\/abuse\s/m);
  });
});
