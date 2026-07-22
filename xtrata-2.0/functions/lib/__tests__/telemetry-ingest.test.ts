import { describe, expect, it } from 'vitest';
import { scrub, parseUa, isCrossSite, hashWallet, isValidEvent } from '../telemetry-ingest';

describe('telemetry ingest helpers', () => {
  it('scrubs seed phrases and secret key/value pairs', () => {
    const s = scrub(
      'seed: alpha bravo charlie delta echo foxtrot golf hotel india juliet kilo lima'
    );
    expect(s).toContain('<redacted');
    expect(s).not.toContain('juliet kilo lima');
  });

  it('scrubs wallet principals and private-key-shaped hex', () => {
    const address = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
    const privateKey = 'a'.repeat(64);
    const result = scrub(`owner=${address} payload=${privateKey}`);
    expect(result).not.toContain(address);
    expect(result).not.toContain(privateKey);
  });

  it('classifies user agents coarsely', () => {
    const chromeMac = parseUa(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36'
    );
    expect(chromeMac).toEqual({ browser: 'chrome', os: 'macos', device: 'desktop' });
    const iosSafari = parseUa(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605 Version/17 Mobile Safari/604'
    );
    expect(iosSafari.os).toBe('ios');
    expect(iosSafari.device).toBe('mobile');
  });

  it('blocks explicit cross-site, allows same-origin and missing headers', () => {
    const base = 'https://xtrata.app/log';
    expect(isCrossSite(new Request(base, { headers: { 'sec-fetch-site': 'cross-site' } }))).toBe(
      true
    );
    expect(isCrossSite(new Request(base, { headers: { 'sec-fetch-site': 'same-origin' } }))).toBe(
      false
    );
    expect(isCrossSite(new Request(base))).toBe(false);
    expect(isCrossSite(new Request(base, { headers: { origin: 'https://evil.example' } }))).toBe(
      true
    );
  });

  it('hashes wallets deterministically with a salt, and returns null without one', async () => {
    const addr = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
    const h1 = await hashWallet(addr, 'salt-a');
    const h2 = await hashWallet(addr, 'salt-a');
    const h3 = await hashWallet(addr, 'salt-b');
    expect(h1).toBe(h2);
    expect(h1).not.toBe(h3);
    expect(h1).toMatch(/^[0-9a-f]{16}$/);
    expect(await hashWallet(addr, undefined)).toBeNull();
  });

  it('requires a session and a known outcome before accepting an event', () => {
    expect(isValidEvent({ flow: 'app', outcome: 'start', sessionId: 's1' })).toBe(true);
    expect(isValidEvent({ flow: 'app', outcome: 'start' })).toBe(false);
    expect(isValidEvent({ flow: 'app', outcome: 'made-up', sessionId: 's1' })).toBe(false);
  });
});
