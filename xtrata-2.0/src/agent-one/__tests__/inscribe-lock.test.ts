import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { FakeChain, PAYER, loadAgent, unloadAgent } from './support/fake-chain';
import { INSCRIBE_LOCK, InscribeLockedError, assertInscribeAllowed, inscribeLockActive, isMarkupMime } from '../inscribe-lock';

const file = (n = 1200) => ({ name: 'f.bin', size: n, arrayBuffer: async () => new Uint8Array(n).buffer }) as any;

describe('isMarkupMime', () => {
  it('flags the types the gateway refuses', () => {
    for (const m of ['text/html', 'TEXT/HTML; charset=utf-8', 'text/css', 'image/svg+xml', 'application/xhtml+xml', 'application/xml', 'text/xml', 'text/javascript', 'application/javascript']) {
      expect(isMarkupMime(m), m).toBe(true);
    }
  });
  it('leaves everything else alone', () => {
    for (const m of ['audio/ogg', 'audio/mpeg', 'image/png', 'image/webp', 'application/json', 'application/octet-stream', 'text/plain', '', undefined, null]) {
      expect(isMarkupMime(m), String(m)).toBe(false);
    }
  });
});

describe('assertInscribeAllowed (lock on)', () => {
  beforeEach(() => { (globalThis as any).window = { XAO_CONFIG: {} }; });
  afterEach(() => { delete (globalThis as any).window; });

  it('is on by default', () => {
    expect(INSCRIBE_LOCK.locked).toBe(true);
    expect(inscribeLockActive()).toBe(true);
  });
  it('refuses markup single jobs, markup batches, music/suno jobs and the on-chain receipt', () => {
    expect(() => assertInscribeAllowed({ file: file(), uri: 'u', mime: 'text/html' })).toThrow(InscribeLockedError);
    expect(() => assertInscribeAllowed({ mime: 'text/css' })).toThrow(/paused/);
    expect(() => assertInscribeAllowed({ items: [{ mime: 'audio/ogg' }, { mime: 'image/svg+xml' }] })).toThrow(InscribeLockedError);
    expect(() => assertInscribeAllowed({ mime: 'audio/ogg', origin: 'music' })).toThrow(InscribeLockedError);
    expect(() => assertInscribeAllowed({ mime: 'audio/ogg', sunoPlayer: {} })).toThrow(InscribeLockedError);
    expect(() => assertInscribeAllowed({ mime: 'image/png', receipt: true })).toThrow(/receipt/i);
  });
  it('names what to do and says nothing was charged', () => {
    try { assertInscribeAllowed({ mime: 'text/html' }); expect.unreachable(); }
    catch (e: any) { expect(e.code).toBe('INSCRIBE_LOCKED'); expect(e.message).toMatch(/Nothing has been charged/); }
  });
  it('lets non-markup jobs without a receipt through', () => {
    expect(() => assertInscribeAllowed({ mime: 'image/png', receipt: false })).not.toThrow();
    expect(() => assertInscribeAllowed({ items: [{ mime: 'audio/ogg' }, { mime: 'application/json' }] })).not.toThrow();
  });
  it('can be switched off for live testing only through page config', () => {
    (globalThis as any).window = { XAO_CONFIG: { inscribeLock: false } };
    expect(inscribeLockActive()).toBe(false);
    expect(() => assertInscribeAllowed({ mime: 'text/html', origin: 'music', receipt: true })).not.toThrow();
  });
});

describe('the agent refuses locked jobs before any money moves', () => {
  let chain: FakeChain;
  beforeEach(async () => { chain = new FakeChain(); await loadAgent(chain, { inscribeLock: true }); });
  afterEach(() => { vi.restoreAllMocks(); unloadAgent(); });

  it('exposes the lock for the pages', () => {
    const lock = (window as any).XtrataAgent.inscribeLock;
    expect(lock.locked).toBe(true);
    expect(lock.title).toBe(INSCRIBE_LOCK.title);
  });
  it('createJob throws for a music job and leaves no job behind', async () => {
    const api = (window as any).XtrataAgent;
    await expect(api.createJob({ file: file(), uri: 'xtrata:s', mime: 'text/html', fastTrack: true, origin: 'music', receipt: false, expectedFunder: PAYER })).rejects.toMatchObject({ code: 'INSCRIBE_LOCKED' });
    await expect(api.createJob({ items: [{ file: file(), uri: 'xtrata:a', mime: 'text/html' }], fastTrack: true, origin: 'music', expectedFunder: PAYER })).rejects.toMatchObject({ code: 'INSCRIBE_LOCKED' });
    expect(Object.keys(localStorage).filter((k) => k.includes('xao') && k.includes('job'))).toEqual([]);
    expect(chain.broadcasts?.length ?? 0).toBe(0);
  });
});

describe('pages and release wiring', () => {
  const read = (p: string) => readFileSync(new URL(p, import.meta.url), 'utf8');
  it('the notice is shipped in the bundle source and exposed to the pages', () => {
    const ui = read('../ui-panels.ts');
    expect(ui).toContain('inscribeLockNotice');
    expect(ui).toContain("document.getElementById('sbGo')");
    expect(ui).toContain("closest?.('#sbGo,#go')");
  });
  it('refund, cancel and resume are not behind the lock', () => {
    const core = read('../agent-core.ts');
    const at = (name: string) => core.indexOf(name);
    for (const fn of ['async function refundAndClose', 'cancelJob: async', 'recoverJob:']) {
      const i = at(fn); expect(i, fn).toBeGreaterThan(-1);
      expect(core.slice(i, i + 1500), fn).not.toContain('assertInscribeAllowed');
    }
    expect(core.match(/assertInscribeAllowed\(/g)!.length).toBe(2);   // createJob + createBatchJob only
  });
});
