// @vitest-environment happy-dom
import { afterEach, describe, it, expect, vi } from 'vitest';
import { mountSupportPanel } from '../panel';
import { exampleStatus, fakeCompanion } from '../fake';
const flush = async () => { for (let i=0;i<12;i++) await Promise.resolve(); };
afterEach(() => { document.body.replaceChildren(); vi.useRealTimers(); });
describe('support panel', () => {
  it('has no requests or timers without a companion', () => {
    const fetch = vi.spyOn(globalThis, 'fetch');
    const panel = mountSupportPanel(document.body);
    expect(document.body.textContent).toContain('Listening free');
    expect(document.querySelector('details')!.hidden).toBe(true);
    expect(fetch).not.toHaveBeenCalled(); panel.dispose(); fetch.mockRestore();
  });
  it('loads history only on expansion and renders hostile text as text', async () => {
    const bridge = fakeCompanion(exampleStatus, [{ entries: [{ id: '01'.repeat(16), core: 3, masterId: 2910, title: '<img src=x onerror=alert(1)>', artist: '', state: 'unknown', startedAt: '2026-09-17T12:00:00.000Z', fee: null, holder: null, txid: null }], next: null }]);
    const history = vi.spyOn(bridge, 'history');
    const panel = mountSupportPanel(document.body, bridge); await flush();
    expect(document.body.textContent).toContain('0.018650 STX');
    expect(history).not.toHaveBeenCalled();
    const details = document.querySelector('details')!; details.open = true; details.dispatchEvent(new Event('toggle')); await flush();
    expect(history).toHaveBeenCalledTimes(1);
    expect(document.body.textContent).toContain('Debit not confirmed');
    expect(document.querySelector('img')).toBeNull();
    details.dispatchEvent(new Event('toggle')); await flush(); expect(history).toHaveBeenCalledTimes(1); panel.dispose();
  });
  it('times out quietly and discards a late result', async () => {
    vi.useFakeTimers(); let resolve!: (v: unknown) => void;
    const panel = mountSupportPanel(document.body, { status: () => new Promise(r => { resolve=r; }), history: vi.fn() }, 100);
    await flush(); await vi.advanceTimersByTimeAsync(101);
    expect(document.body.textContent).toContain('unavailable');
    resolve(exampleStatus); await flush(); expect(document.body.textContent).toContain('unavailable'); panel.dispose();
  });
  it('does not let old status overwrite a refresh', async () => {
    let resolve!: (v: unknown) => void;
    const bridge = fakeCompanion({ ...exampleStatus, locked: true });
    vi.spyOn(bridge, 'status').mockImplementationOnce(() => new Promise(r => {resolve=r;}));
    const panel = mountSupportPanel(document.body, bridge); await flush();
    await panel.refresh(); resolve(exampleStatus); await flush();
    expect(document.body.textContent).toContain('locked'); panel.dispose();
  });
  it('paginates once and rejects repeated cursors', async () => {
    const bridge = fakeCompanion(exampleStatus, [{entries: [], next: 'page-1'}, {entries: [], next: 'page-1'}]);
    const history = vi.spyOn(bridge, 'history');
    const panel = mountSupportPanel(document.body, bridge); await flush();
    const details = document.querySelector('details')!; details.open = true; details.dispatchEvent(new Event('toggle')); await flush();
    const more = [...document.querySelectorAll('button')].find(b => b.textContent === 'Older payments')!;
    more.click(); more.click(); await flush();
    expect(history).toHaveBeenCalledTimes(2);
    expect(document.body.textContent).toContain('Payment history unavailable'); panel.dispose();
  });
  it('clears prior history and ignores its response on wallet refresh', async () => {
    let resolve!: (v: unknown) => void;
    const bridge = fakeCompanion();
    vi.spyOn(bridge, 'history').mockImplementationOnce(() => new Promise(r => {resolve=r;}));
    const panel = mountSupportPanel(document.body, bridge); await flush();
    const details = document.querySelector('details')!; details.open = true; details.dispatchEvent(new Event('toggle')); await flush();
    details.open = false; await panel.refresh();
    resolve({entries: [{id:'02'.repeat(16),core:3,masterId:1,title:'OLD ACCOUNT',artist:'',state:'unknown',startedAt:'2026-09-17T12:00:00.000Z',fee:null,holder:null,txid:null}],next:null}); await flush();
    expect(document.body.textContent).not.toContain('OLD ACCOUNT'); panel.dispose();
  });
  it.each(['offline','recovery','active-elsewhere'] as const)('renders %s without claiming payment', async attention => {
    const panel = mountSupportPanel(document.body, fakeCompanion({ ...exampleStatus, attention })); await flush();
    expect(document.body.textContent).toContain(attention);
    expect(document.body.textContent).toContain('Listening free'); panel.dispose();
  });
});
