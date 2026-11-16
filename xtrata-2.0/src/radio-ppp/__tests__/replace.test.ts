// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest';
import { createReplace, type ReplaceDeps } from '../replace';

const OLD = 'SP2YVF0000000000000000000000000000OLDA1C5', NEW = 'SP1SY289GQAHCH7JZ1MSS5VMPNPH8GEK2DPRKKJ6N', MAIN = 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7';
const flush = async () => { for (let i = 0; i < 6; i++) await Promise.resolve(); };
const snap = (over: object = {}): any => ({ step: 'ready', listening: OLD, slot: 0, balance: 0n, entries: [], depositPending: false, award: null, returnTo: MAIN, gift: null, phrase: false, backedUp: false, busy: null, ...over });

function setup(opts: { albums?: number | null | 'fail'; kept?: object; keepBoth?: boolean } = {}) {
  const store = new Map<string, string>();
  if (opts.kept) store.set('xtrata.radio.replace.v1', JSON.stringify(opts.kept));
  const w = { unlocks: 0, returns: 0, forgets: 0, backups: 0, both: 0, forgetFails: '' as string, changes: 0, shelfCalls: [] as string[] };
  const deps: ReplaceDeps = {
    json: vi.fn(async (url: string) => { w.shelfCalls.push(url); if (opts.albums === 'fail') throw new Error('down'); return { total: opts.albums === undefined ? 0 : opts.albums }; }),
    unlock: () => { w.unlocks++; }, returnAll: () => { w.returns++; }, backup: () => { w.backups++; },
    forget: async () => { w.forgets++; if (w.forgetFails) throw new Error(w.forgetFails); },
    keepBoth: () => (opts.keepBoth === false ? null : () => { w.both++; }),
    who: (a) => (a === MAIN ? 'jim.btc' : String(a).slice(0, 6)),
    changed: () => { w.changes++; },
    store: { get: (k) => store.get(k) ?? null, set: (k, v) => { if (v === null) store.delete(k); else store.set(k, v); } },
    dust: () => 3000n
  };
  const r = createReplace(deps);
  const text = (els: HTMLElement[] | null) => (els ?? []).map((e) => e.textContent).join(' | ');
  const labels = (els: HTMLElement[] | null) => (els ?? []).filter((e) => e.tagName === 'BUTTON').map((e) => e.textContent);
  const press = (els: HTMLElement[] | null, re: RegExp) => { const b = (els ?? []).find((e) => e.tagName === 'BUTTON' && re.test(e.textContent || '')) as HTMLButtonElement | undefined; if (!b) throw new Error('no button ' + re); b.click(); };
  /** Draw, let the album check answer, draw again. */
  const ready = async (s: any) => { r.lines(s); await flush(); return r.lines(s); };
  return { r, w, store, text, labels, press, ready };
}

describe('replacing an old player', () => {
  it('does nothing until it is started, and stopping at any point leaves everything as it was', async () => {
    const x = setup();
    expect(x.r.active()).toBe(false);
    expect(x.r.lines(snap())).toBeNull();
    x.r.start(snap());
    expect(x.r.active()).toBe(true);
    x.press(await x.ready(snap()), /Stop · keep my old player/);
    expect(x.r.active()).toBe(false);
    expect(x.store.size).toBe(0);
    expect(x.w.forgets + x.w.returns).toBe(0);
  });

  it('a locked old player is unlocked first', async () => {
    const x = setup(); x.r.start(snap());
    const l = x.r.lines(snap({ step: 'locked', balance: undefined }));
    expect(x.text(l)).toContain('step 1 of 3');
    x.press(l, /Unlock my old player/);
    expect(x.w.unlocks).toBe(1);
  });

  it('a player with money in it must be emptied first: there is no way to remove it while it holds anything', async () => {
    const x = setup(); x.r.start(snap());
    const l = await x.ready(snap({ balance: 987_000n }));
    expect(x.text(l)).toContain('It holds 0.987 STX. Send it back to jim.btc first');
    expect(x.labels(l)).toEqual(['Send everything back', 'Stop · keep my old player']);
    x.press(l, /Send everything back/);
    expect(x.w.returns).toBe(1);
    expect(x.w.forgets).toBe(0);
  });

  it('with nowhere to send it, it says how to set that up and still will not remove it', async () => {
    const x = setup(); x.r.start(snap());
    const l = await x.ready(snap({ balance: 50_000n, returnTo: undefined }));
    expect(x.text(l)).toContain('There is nowhere set to send it');
    expect(x.labels(l)).toEqual(['Stop · keep my old player']);
  });

  it('waits while anything is on its way, and while the balance is not known', async () => {
    const x = setup(); x.r.start(snap());
    expect(x.labels(await x.ready(snap({ entries: [{ status: 'pending' }] })))).toEqual(['Stop · keep my old player']);
    expect(x.labels(await x.ready(snap({ depositPending: true })))).toEqual(['Stop · keep my old player']);
    expect(x.text(await x.ready(snap({ balance: undefined })))).toContain('Checking what it holds');
  });

  it('refuses when the old player has albums, holds a record, or the albums cannot be checked; keeping both is offered instead', async () => {
    const a = setup({ albums: 2 }); a.r.start(snap());
    const la = await a.ready(snap());
    expect(a.text(la)).toContain('This player has 2 albums of its own. Replacing it would leave them behind, so it stays.');
    expect(a.labels(la)).toEqual(['Keep both players instead', 'Stop · keep my old player']);
    a.press(la, /Keep both players instead/);
    expect(a.w.both).toBe(1);
    expect(a.r.active()).toBe(false);
    const b = setup(); b.r.start(snap());
    expect(b.text(await b.ready(snap({ award: { state: 'claimed', holds: true } })))).toContain('holds a Music Hero record');
    const c = setup({ albums: 'fail' }); c.r.start(snap());
    const lc = await c.ready(snap());
    expect(c.text(lc)).toContain('Could not check whether this player has albums');
    expect(c.labels(lc)).not.toContain('Remove my old player');
    const d = setup({ albums: 1, keepBoth: false }); d.r.start(snap());
    expect(d.labels(await d.ready(snap()))).toEqual(['Stop · keep my old player']);
    expect(a.w.shelfCalls[0]).toContain('root=' + OLD);
  });

  it('an empty player can be removed: it says what stays behind, asks the wallet box, and only then moves on', async () => {
    const x = setup(); x.r.start(snap());
    const l = await x.ready(snap({ balance: 2_100n }));
    expect(x.text(l)).toContain('step 2 of 3');
    expect(x.text(l)).toContain('the 0.0021 STX left is less than the network fee to move it');
    expect(x.text(l)).toContain('What stays behind with the old player: its likes, its play history and any progress toward a Music Hero award');
    x.press(l, /Remove my old player/); await flush();
    expect(x.w.forgets).toBe(1);
    expect(x.r.claiming()).toBe(true);
    const after = x.r.lines(snap({ step: 'intro', listening: undefined, balance: undefined }));
    expect(x.text(after)).toContain('step 3 of 3');
    expect(x.text(after)).toContain('Old player removed from this device ✓');
  });

  it('if the wallet box refuses or is closed, nothing moves on', async () => {
    const x = setup(); x.r.start(snap()); x.w.forgetFails = 'Empty this player first. Nothing was removed.';
    x.press(await x.ready(snap()), /Remove my old player/); await flush();
    expect(x.r.claiming()).toBe(false);
    expect(x.text(x.r.lines(snap()))).toContain('Empty this player first. Nothing was removed.');
    x.w.forgetFails = 'Cancelled';
    x.press(x.r.lines(snap()), /Remove my old player/); await flush();
    expect(x.r.claiming()).toBe(false);
    expect(x.text(x.r.lines(snap()))).not.toContain('Cancelled');
  });

  it('once the new player exists: back up first, then which passkey is which, by name; and it survives a reload', async () => {
    const x = setup({ kept: { old: OLD, removed: true } });
    expect(x.r.active()).toBe(true);
    const l = x.r.lines(snap({ listening: NEW, phrase: true, backedUp: false, passkeyName: 'Xtrata player · A1B2', balance: 20_500n }));
    expect(x.text(l)).toContain('Your new player is ready ✓');
    expect(x.text(l)).toContain('First, write down your new player’s 24 backup words');
    expect(x.text(l)).toContain('keep the one called “Xtrata player · A1B2”, which is this new player');
    expect(x.text(l)).toContain('only after the backup words are written down');
    x.press(l, /Back up my player/);
    expect(x.w.backups).toBe(1);
    const done = x.r.lines(snap({ listening: NEW, phrase: true, backedUp: true, passkeyName: 'Xtrata player · A1B2' }));
    expect(x.text(done)).toContain('24 backup words are written down ✓');
    x.press(done, /^Done$/);
    expect(x.r.active()).toBe(false);
  });

  it('opening the old player again after removing it just carries on from there; opening some other player ends it', async () => {
    const x = setup({ kept: { old: OLD, removed: true } });
    expect(x.text(await x.ready(snap({ balance: 0n })))).toContain('step 2 of 3');
    expect(x.r.claiming()).toBe(false);
    const y = setup({ kept: { old: OLD } });
    expect(y.r.lines(snap({ listening: NEW }))).toBeNull();
    expect(y.r.active()).toBe(false);
  });
});
