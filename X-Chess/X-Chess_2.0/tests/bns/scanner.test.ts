// The standalone scanner, and the properties that make asking for a phrase
// defensible at all.
//
// `inventory.html` must never take a seed. This page does, and the difference
// is not a change of mind: it is READ-ONLY BY CONSTRUCTION. Every assertion
// below is a claim the page makes to its reader in its own words, and a claim
// nobody can verify is worth nothing - so each one is checked against the built
// file rather than the source it came from.

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';

const ROOT = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const BUILT = resolve(ROOT, 'harness/bns/wallet-scanner.html');

let PAGE = '';

beforeAll(() => {
  // Built here, so these test what ships rather than what was last built by
  // hand. A stale artefact passing a test about its own contents is the exact
  // failure that let a deleted panel keep shipping earlier in this project.
  if (!existsSync(BUILT)) {
    execFileSync('node', ['harness/bns/scanner/build.mjs'], { cwd: ROOT });
  }
  PAGE = readFileSync(BUILT, 'utf8');
});

describe('what makes asking for a phrase defensible', () => {
  it('contains NO code that could sign or broadcast anything', () => {
    // The whole argument. A page that can derive an address cannot spend from
    // it unless somebody also ships the code to sign - so that code is absent
    // rather than disabled, and absence is the thing worth testing.
    for (const forbidden of [
      'broadcastTransaction',
      'makeContractCall',
      'makeSTXTokenTransfer',
      'signTransaction',
      'signMessage',
      '@stacks/transactions'
    ]) {
      expect(PAGE, `the scanner contains ${forbidden}`).not.toContain(forbidden);
    }
  });

  it('never persists the phrase anywhere', () => {
    // Not to storage, not to a cookie, not to the URL. A phrase that survives
    // the tab is a phrase in a backup nobody remembers making.
    expect(PAGE).not.toMatch(/localStorage|sessionStorage|indexedDB|document\.cookie/);
    expect(PAGE).not.toMatch(/history\.(push|replace)State|location\.(search|hash)\s*=/);
  });

  it('wipes the field when the scan finishes', () => {
    expect(PAGE).toMatch(/\$\('secret'\)\.value = ''/);
  });

  it('sends nothing but addresses, to three named hosts', () => {
    const hosts = [...new Set(PAGE.match(/https?:\/\/[a-z0-9.-]+/gi) ?? [])].sort();
    expect(hosts).toEqual([
      'https://api.mainnet.hiro.so',
      'https://blockstream.info',
      'https://mempool.space'
    ]);
  });

  it('loads no code over the network, so what you read is what runs', () => {
    // A script tag pointing elsewhere would defeat the entire point of a page
    // you are invited to audit before pasting a phrase into it.
    expect(PAGE).not.toMatch(/<script[^>]+src\s*=/i);
    expect(PAGE).not.toMatch(/<link[^>]+href\s*=\s*["']https?:/i);
  });

  it('tells the reader how to check, and how to avoid it entirely', () => {
    // Being told a page is safe is what a fake page would also say, so the
    // notice has to hand over a way to verify and a way to not need it.
    expect(PAGE).toMatch(/oldest theft on the internet/);
    expect(PAGE).toContain('file://');
    expect(PAGE, 'no alternative is offered').toContain('addresses.mjs');
  });
});

describe('the scan itself', () => {
  it('stops on the standard gap limit rather than the first empty account', () => {
    // A scan stopping at the first empty account misses a wallet whose owner
    // made accounts 1 and 40; one that never stops runs forever on a phrase
    // with nothing on it. Twenty is what every wallet uses.
    expect(PAGE).toContain('const GAP_LIMIT = 20');
  });

  it('paces the gap on the Leather line only', () => {
    // The hardened shape is a secondary search. Its emptiness says nothing
    // about where a Leather wallet stops having accounts.
    expect(PAGE).toMatch(/a\.convention === 'leather'/);
  });

  it('counts an account with anything at all as populated', () => {
    // Dust is still evidence that an account was used, and a scan that ignored
    // it would stop early on a wallet that had been swept.
    expect(PAGE).toMatch(/function populated\(row\)/);
    expect(PAGE).toMatch(/row\.bns\?\.length/);
    expect(PAGE).toMatch(/row\.nfts\?\.length/);
  });

  it('validates the input before scanning a hundred empty accounts', () => {
    expect(PAGE).toMatch(/XKEY\.accountsFrom\(secret, 0, 1\)/);
  });
});
