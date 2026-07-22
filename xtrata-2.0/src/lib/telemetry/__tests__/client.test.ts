import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Telemetry is inert until enabled; enable it per test after a fresh import.
beforeEach(() => {
  vi.resetModules();
});
afterEach(() => {
  vi.unstubAllGlobals();
});

async function freshTelemetry() {
  const mod = await import('../index');
  mod.setTelemetryEnabled(true);
  return mod.telemetry;
}

describe('telemetry client queue + delivery', () => {
  it('flushes immediately on an error and sends a well-formed batch via beacon', async () => {
    const beacon = vi.fn(() => true);
    vi.stubGlobal('navigator', { sendBeacon: beacon, onLine: true, userAgent: 'test' });
    const telemetry = await freshTelemetry();

    telemetry.event({
      flow: 'market_buy',
      step: 'broadcast',
      outcome: 'error',
      errorCode: 'NONCE_MISMATCH',
      error: new Error('nonce mismatch expected 4 got 2')
    });

    expect(beacon).toHaveBeenCalledTimes(1);
    const [url, blob] = beacon.mock.calls[0];
    expect(url).toBe('/log');
    const payload = JSON.parse(await (blob as Blob).text());
    expect(payload.events).toHaveLength(1);
    expect(payload.events[0].errorFingerprint).toMatch(/^[0-9a-f]{16}$/);
    expect(payload.events[0].errorMessage).toContain('nonce mismatch');
  });

  it('batches non-error events until the batch size, then flushes', async () => {
    const beacon = vi.fn(() => true);
    vi.stubGlobal('navigator', { sendBeacon: beacon, onLine: true, userAgent: 'test' });
    const telemetry = await freshTelemetry();

    for (let i = 0; i < 19; i += 1) telemetry.event({ flow: 'app', outcome: 'info', step: 'tick' });
    expect(beacon).not.toHaveBeenCalled();
    telemetry.event({ flow: 'app', outcome: 'info', step: 'tick' }); // 20th
    expect(beacon).toHaveBeenCalledTimes(1);
  });

  it('falls back to keepalive fetch when sendBeacon is unavailable', async () => {
    vi.stubGlobal('navigator', { onLine: true, userAgent: 'test' });
    const fetchMock = vi.fn(() => Promise.resolve({ ok: true }));
    vi.stubGlobal('fetch', fetchMock);
    const telemetry = await freshTelemetry();

    telemetry.event({ flow: 'app', outcome: 'error', error: 'boom' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect(init.keepalive).toBe(true);
  });

  it('includes the active wallet and network context on later events', async () => {
    const beacon = vi.fn(() => true);
    vi.stubGlobal('navigator', { sendBeacon: beacon, onLine: true, userAgent: 'test' });
    vi.resetModules();
    const mod = await import('../index');
    mod.setTelemetryEnabled(true);
    mod.setWallet('SP000000000000000000002Q6VF78', 'xverse');
    mod.setNetwork('mainnet');

    mod.event({ flow: 'mint', step: 'readiness', outcome: 'error', error: 'test' });

    const [, blob] = beacon.mock.calls[0];
    const payload = JSON.parse(await (blob as Blob).text());
    expect(payload.events[0]).toMatchObject({
      walletAddress: 'SP000000000000000000002Q6VF78',
      walletKind: 'xverse',
      network: 'mainnet'
    });
  });

  it('stays inert (no network) until enabled', async () => {
    const beacon = vi.fn(() => true);
    vi.stubGlobal('navigator', { sendBeacon: beacon, onLine: true, userAgent: 'test' });
    vi.resetModules();
    const mod = await import('../index'); // NOT enabled
    mod.telemetry.event({ flow: 'app', outcome: 'error', error: 'x' });
    expect(beacon).not.toHaveBeenCalled();
  });

  it('never throws even if no delivery mechanism exists', async () => {
    vi.stubGlobal('navigator', { onLine: true });
    vi.stubGlobal('fetch', undefined);
    const telemetry = await freshTelemetry();
    expect(() => telemetry.event({ flow: 'app', outcome: 'error', error: 'x' })).not.toThrow();
  });

  it('sends a boot heartbeat when global telemetry is installed', async () => {
    const beacon = vi.fn(() => true);
    vi.stubGlobal('navigator', { sendBeacon: beacon, onLine: true, userAgent: 'test' });
    vi.stubGlobal('window', { addEventListener: vi.fn() });
    vi.resetModules();
    const mod = await import('../index');

    mod.installGlobalTelemetry();
    mod.flush('test');

    expect(beacon).toHaveBeenCalledTimes(1);
    const [, blob] = beacon.mock.calls[0];
    const payload = JSON.parse(await (blob as Blob).text());
    expect(payload.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ flow: 'app', step: 'boot', outcome: 'info' })
      ])
    );
  });
});
