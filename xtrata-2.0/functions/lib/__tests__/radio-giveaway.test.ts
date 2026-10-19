// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { ensureGiftTables, type GiftEnv } from '../radio-gifts';
import { advance, codesIn, giveawayAdmin, giveawayAuthorised, giveawayView, type GiveawayEnv } from '../radio-giveaway';
import { GIFT_EXPIRY_MS, giftCodeHash, newGiftCode } from '../../../src/lib/listening-wallet/gifts';
const { DatabaseSync } = createRequire(import.meta.url)('node:sqlite');

const T0 = 1_800_000_000_000;
const SECRET = 'giveaway-secret-that-is-long-enough';

function setup(over: Partial<GiveawayEnv> = {}) {
  const sql = new DatabaseSync(':memory:');
  sql.exec(readFileSync('functions/migrations/027_radio_gifts.sql', 'utf8'));
  sql.exec('CREATE TABLE radio_metadata(token_id INTEGER PRIMARY KEY, title TEXT, artist TEXT, is_song INTEGER, status TEXT)');
  const db = {
    prepare(query: string) {
      let args: any[] = [];
      const s: any = {
        bind(...v: any[]) { args = v; return s; },
        async all() { return { results: sql.prepare(query).all(...args) }; },
        async first() { return sql.prepare(query).get(...args) ?? null; },
        async run() { const r = sql.prepare(query).run(...args); return { meta: { changes: Number(r.changes) } }; }
      };
      return s;
    }
  };
  const env = { DB: db, RADIO_GIFT_ENABLED: '1', RADIO_GIVEAWAY_SECRET: SECRET, ...over } as unknown as GiveawayEnv;
  let n = 0;
  /** Gift rows as an album batch leaves them: live, hashed. Returns the codes in order. */
  const gifts = async (count: number, opts: { player?: string } = {}) => {
    await ensureGiftTables(env as unknown as GiftEnv);
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      const code = newGiftCode();
      sql.prepare("INSERT INTO radio_gifts(id, code_hash, amount, source, gifter, label, status, created_at, expires_at, updated_at, player_id) VALUES(?, ?, 100000, 'campaign', NULL, '', 'live', ?, ?, ?, ?)")
        .run('g' + String(n++).padStart(6, '0'), giftCodeHash(code), T0, T0 + GIFT_EXPIRY_MS, T0, opts.player ?? null);
      codes.push(code);
    }
    return codes;
  };
  const setStatus = (code: string, status: string, extra: Record<string, unknown> = {}) => {
    sql.prepare('UPDATE radio_gifts SET status=?, claimed_at=?, claimed_by=? WHERE code_hash=?').run(status, extra.claimed_at ?? null, extra.claimed_by ?? null, giftCodeHash(code));
  };
  const list = (codes: string[]) => codes.map((c) => `https://radio.xtrata.test/radio.html#gift=${c}`).join('\n');
  return { env, sql, gifts, setStatus, list };
}
const fixed = (v: number) => () => v;

describe('radio giveaway', () => {
  it('shows one link at a time and never anything else from the list', async () => {
    const s = setup();
    const codes = await s.gifts(4);
    await giveawayAdmin(s.env, { action: 'add', text: s.list(codes) }, T0);
    const v = await giveawayView(s.env, T0);
    expect(v).toMatchObject({ state: 'live', code: codes[0], claimed: 0, left: 4 });
    const json = JSON.stringify(v);
    for (const other of codes.slice(1)) expect(json).not.toContain(other);
    expect((await giveawayView(s.env, T0 + 60_000)).code).toBe(codes[0]); // still the same link while it is free
  });

  it('a claim starts a ten-minute countdown at once; the next link shows when it is over and the funds have arrived', async () => {
    const s = setup();
    const codes = await s.gifts(3);
    const winner = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
    await giveawayAdmin(s.env, { action: 'add', text: s.list(codes) }, T0);
    await giveawayView(s.env, T0);
    s.setStatus(codes[0], 'claiming', { claimed_at: T0 + 1000, claimed_by: winner });
    const taken = await giveawayView(s.env, T0 + 2000);
    expect(taken).toMatchObject({ state: 'taken', claimed: 1, left: 2, wallet: 'SP3JN…X743X', nextAt: T0 + 1000 + 600_000, now: T0 + 2000 });
    expect(JSON.stringify(taken)).not.toContain(winner); // shortened: only the ends are shown
    expect((await giveawayView(s.env, T0 + 3000)).code).toBeUndefined(); // the next link is not shown early
    // The funds land (a few minutes later): still counting down, now between links.
    s.setStatus(codes[0], 'claimed', { claimed_at: T0 + 1000, claimed_by: winner });
    expect(await giveawayView(s.env, T0 + 200_000)).toMatchObject({ state: 'waiting', claimed: 1, left: 2, wallet: 'SP3JN…X743X', nextAt: T0 + 1000 + 600_000 });
    expect((await giveawayView(s.env, T0 + 600_000)).state).toBe('waiting');
    expect(await giveawayView(s.env, T0 + 601_001)).toMatchObject({ state: 'live', code: codes[1], claimed: 1, left: 2 });
  });

  it('the countdown is drawn once per claim: every reader sees the same time, and a slow sweep does not move it', async () => {
    const s = setup();
    const codes = await s.gifts(2);
    await giveawayAdmin(s.env, { action: 'add', text: s.list(codes) }, T0);
    await giveawayAdmin(s.env, { action: 'gap', minSeconds: 100, maxSeconds: 200 }, T0);
    await giveawayView(s.env, T0);
    s.setStatus(codes[0], 'claiming', { claimed_at: T0 + 5000, claimed_by: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X' });
    const a = await giveawayView(s.env, T0 + 6000, fixed(0.25));
    const b = await giveawayView(s.env, T0 + 7000, fixed(0.9));
    expect(a.nextAt).toBe(T0 + 5000 + 125_000);
    expect(b.nextAt).toBe(a.nextAt);
    // First seen already settled (the sweep was slow): the pause still counts from the claim, not from now.
    const t = setup();
    const more = await t.gifts(2);
    await giveawayAdmin(t.env, { action: 'add', text: t.list(more) }, T0);
    await giveawayAdmin(t.env, { action: 'gap', minSeconds: 100, maxSeconds: 100 }, T0);
    await giveawayView(t.env, T0);
    t.setStatus(more[0], 'claimed', { claimed_at: T0 + 5000, claimed_by: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X' });
    expect(await giveawayView(t.env, T0 + 50_000)).toMatchObject({ state: 'waiting', nextAt: T0 + 105_000 });
    expect((await giveawayView(t.env, T0 + 106_000)).code).toBe(more[1]);
  });

  it('the default pause is ten minutes', async () => {
    const s = setup();
    const codes = await s.gifts(2);
    await giveawayAdmin(s.env, { action: 'add', text: s.list(codes) }, T0);
    expect((await giveawayAdmin(s.env, { action: 'status' }, T0)).gap).toEqual({ minSeconds: 600, maxSeconds: 600 });
  });

  it('once the next link is on show there is no countdown and no winner line', async () => {
    const s = setup();
    const codes = await s.gifts(2);
    await giveawayAdmin(s.env, { action: 'add', text: s.list(codes) }, T0);
    await giveawayAdmin(s.env, { action: 'gap', minSeconds: 0, maxSeconds: 0 }, T0);
    await giveawayView(s.env, T0);
    s.setStatus(codes[0], 'claimed', { claimed_at: T0, claimed_by: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X' });
    const v = await giveawayView(s.env, T0 + 1000);
    expect(v).toMatchObject({ state: 'live', code: codes[1] });
    expect(v.nextAt).toBeUndefined();
    expect(v.wallet).toBeUndefined();
  });

  it('a claim that fails goes back to live and the same link is shown again', async () => {
    const s = setup();
    const codes = await s.gifts(2);
    await giveawayAdmin(s.env, { action: 'add', text: s.list(codes) }, T0);
    await giveawayView(s.env, T0);
    s.setStatus(codes[0], 'claiming');
    expect((await giveawayView(s.env, T0 + 1000)).state).toBe('taken');
    s.setStatus(codes[0], 'live');
    expect(await giveawayView(s.env, T0 + 2000)).toMatchObject({ state: 'live', code: codes[0], claimed: 0, left: 2 });
  });

  it('steps over links that can never be claimed, at once and without a pause', async () => {
    const s = setup();
    const codes = await s.gifts(4);
    await giveawayAdmin(s.env, { action: 'add', text: s.list(codes) }, T0);
    s.setStatus(codes[0], 'expired');
    s.setStatus(codes[1], 'refunded');
    s.sql.prepare('DELETE FROM radio_gifts WHERE code_hash=?').run(giftCodeHash(codes[2]));
    expect(await giveawayView(s.env, T0)).toMatchObject({ state: 'live', code: codes[3], claimed: 0, left: 1 });
    // The one on show expires while on show.
    expect((await giveawayView(s.env, T0 + GIFT_EXPIRY_MS + 1)).state).toBe('done');
  });

  it('a link that is on show and then expires or is lost does not start a pause', async () => {
    const s = setup();
    const codes = await s.gifts(2);
    await giveawayAdmin(s.env, { action: 'add', text: s.list(codes) }, T0);
    await giveawayView(s.env, T0);
    s.setStatus(codes[0], 'refunded');
    expect((await giveawayView(s.env, T0 + 1000)).code).toBe(codes[1]);
  });

  it('says when the list is used up', async () => {
    const s = setup();
    const codes = await s.gifts(1);
    await giveawayAdmin(s.env, { action: 'add', text: s.list(codes) }, T0);
    await giveawayView(s.env, T0);
    s.setStatus(codes[0], 'claimed', { claimed_at: T0 });
    await giveawayView(s.env, T0 + 1000);
    expect(await giveawayView(s.env, T0 + 10 * 60_000)).toEqual({ state: 'done', claimed: 1, left: 0, now: T0 + 10 * 60_000 });
    expect(await giveawayView(setup().env, T0)).toMatchObject({ state: 'done', claimed: 0, left: 0 });
  });

  it('many readers at once still move it on exactly once', async () => {
    const s = setup();
    const codes = await s.gifts(3);
    await giveawayAdmin(s.env, { action: 'add', text: s.list(codes) }, T0);
    const views = await Promise.all(Array.from({ length: 12 }, () => giveawayView(s.env, T0)));
    expect(new Set(views.map((v) => v.code))).toEqual(new Set([codes[0]]));
    expect(s.sql.prepare('SELECT COUNT(*) AS n FROM radio_giveaway_links WHERE shown_at IS NOT NULL').get().n).toBe(1);
    s.setStatus(codes[0], 'claimed', { claimed_at: T0 });
    await giveawayAdmin(s.env, { action: 'gap', minSeconds: 0, maxSeconds: 0 }, T0);
    const after = await Promise.all(Array.from({ length: 12 }, () => giveawayView(s.env, T0 + 5000)));
    expect(new Set(after.map((v) => v.code))).toEqual(new Set([codes[1]]));
    expect(s.sql.prepare('SELECT COUNT(*) AS n FROM radio_giveaway_links WHERE shown_at IS NOT NULL').get().n).toBe(2);
  });

  it('adding takes links or bare codes, keeps only real live gifts, skips repeats, and reports positions, never codes', async () => {
    const s = setup();
    const codes = await s.gifts(3);
    s.setStatus(codes[2], 'claimed', { claimed_at: T0 });
    const unknown = newGiftCode();
    const text = `first ${s.list([codes[0]])}\n${codes[1]}\nnot a code: hello-world\n${unknown}\n${s.list([codes[0]])}\n${codes[2]}`;
    const out = await giveawayAdmin(s.env, { action: 'add', text }, T0);
    expect(out).toMatchObject({ added: 2, duplicates: 0, notFound: [3], notLive: [4], total: 2, unseen: 1, onShow: 1 });
    const again = await giveawayAdmin(s.env, { action: 'add', text: s.list(codes.slice(0, 2)) }, T0);
    expect(again).toMatchObject({ added: 0, duplicates: 2, total: 2 });
    expect(JSON.stringify([out, again])).not.toMatch(new RegExp(codes.concat(unknown).join('|')));
    await expect(giveawayAdmin(s.env, { action: 'add' }, T0)).rejects.toThrow(/text required/);
  });

  it('finds codes in links, bare codes and messy text, once each', () => {
    const a = newGiftCode(), b = newGiftCode();
    expect(codesIn(`x https://radio.xtrata.xyz/radio.html#gift=${a} y ${b} ${a}\n?gift=${b}`)).toEqual([a, b]);
    expect(codesIn('nothing here, just words and short-ones')).toEqual([]);
  });

  it('pause stops new links, resume restarts them, skip retires the one on show, now cuts the wait', async () => {
    const s = setup();
    const codes = await s.gifts(3);
    await giveawayAdmin(s.env, { action: 'add', text: s.list(codes) }, T0);
    await giveawayAdmin(s.env, { action: 'gap', minSeconds: 600, maxSeconds: 600 }, T0);
    await giveawayView(s.env, T0);
    expect((await giveawayAdmin(s.env, { action: 'pause' }, T0 + 1)).paused).toBe(true);
    expect((await giveawayView(s.env, T0 + 2)).state).toBe('paused');
    await giveawayAdmin(s.env, { action: 'resume' }, T0 + 3);
    expect((await giveawayView(s.env, T0 + 4)).code).toBe(codes[0]);
    const skipped = await giveawayAdmin(s.env, { action: 'skip' }, T0 + 5);
    expect(skipped).toMatchObject({ skipped: 1, onShow: null });
    expect((await giveawayView(s.env, T0 + 6)).state).toBe('waiting');
    await giveawayAdmin(s.env, { action: 'now' }, T0 + 7);
    expect((await giveawayView(s.env, T0 + 8)).code).toBe(codes[1]);
    await expect(giveawayAdmin(s.env, { action: 'gap', minSeconds: 10, maxSeconds: 5 }, T0)).rejects.toThrow(/minSeconds/);
    await expect(giveawayAdmin(s.env, { action: 'gap', minSeconds: -1, maxSeconds: 5 }, T0)).rejects.toThrow(/minSeconds/);
    await expect(giveawayAdmin(s.env, { action: 'dance' }, T0)).rejects.toThrow(/Unknown action/);
  });

  it('shows the album on show: title, listed songs, cover; a hidden track stays secret', async () => {
    const s = setup();
    await ensureGiftTables(s.env as unknown as GiftEnv);
    s.sql.prepare("INSERT INTO radio_gift_players(id, hash, owner, title, subtitle, tracks, cover, status, created_at) VALUES('p1','h','o','Night Drive','Eight songs','[1,2,3]',77,'active',?)").run(T0);
    for (const [id, title, isSong] of [[1, 'One', 1], [2, 'Two', 1], [3, 'Secret', 2]] as const)
      s.sql.prepare("INSERT INTO radio_metadata(token_id, title, artist, is_song, status) VALUES(?,?,?,?, 'ready')").run(id, title, 'Band', isSong);
    const codes = await s.gifts(1, { player: 'p1' });
    await giveawayAdmin(s.env, { action: 'add', text: s.list(codes) }, T0);
    const v = await giveawayView(s.env, T0);
    expect(v.album).toMatchObject({ title: 'Night Drive', subtitle: 'Eight songs', cover: 77 });
    expect(v.album?.songs.map((x) => x.title)).toEqual(['One', 'Two']);
    expect(JSON.stringify(v)).not.toContain('Secret');
  });

  it('advance alone (the sweep) is enough to move it on', async () => {
    const s = setup();
    const codes = await s.gifts(2);
    await giveawayAdmin(s.env, { action: 'add', text: s.list(codes) }, T0);
    await giveawayAdmin(s.env, { action: 'gap', minSeconds: 0, maxSeconds: 0 }, T0);
    await advance(s.env, T0);
    s.setStatus(codes[0], 'claimed', { claimed_at: T0 });
    await advance(s.env, T0 + 1000);
    await advance(s.env, T0 + 2000);
    expect(s.sql.prepare('SELECT current FROM radio_giveaway_state').get().current).toBe(2);
  });

  it('the operator secret must be long and exact', () => {
    const env = setup().env;
    expect(giveawayAuthorised(env, `Bearer ${SECRET}`)).toBe(true);
    expect(giveawayAuthorised(env, `Bearer ${SECRET}x`)).toBe(false);
    expect(giveawayAuthorised(env, null)).toBe(false);
    expect(giveawayAuthorised(setup({ RADIO_GIVEAWAY_SECRET: 'short' }).env, 'Bearer short')).toBe(false);
    expect(giveawayAuthorised(setup({ RADIO_GIVEAWAY_SECRET: undefined }).env, 'Bearer ')).toBe(false);
  });

  it('the route: the public read has no list and no admin; the operator route answers 404 to anyone else', async () => {
    const { onRequest } = await import('../../radio/giveaway/[[path]]');
    const s = setup();
    const codes = await s.gifts(3);
    const call = (path: string[], init: RequestInit = {}, env = s.env) =>
      onRequest({ request: new Request('https://xtrata.test/radio/giveaway' + (path.length ? '/' + path.join('/') : ''), init), env, params: { path } });
    const admin = (body: unknown, auth: string | null = `Bearer ${SECRET}`) =>
      call(['admin'], { method: 'POST', headers: { 'content-type': 'application/json', ...(auth ? { authorization: auth } : {}) }, body: JSON.stringify(body) });
    expect((await admin({ action: 'add', text: s.list(codes) }, null)).status).toBe(404);
    expect((await admin({ action: 'add', text: s.list(codes) }, 'Bearer wrong')).status).toBe(404);
    expect((await call(['admin'], { method: 'GET' })).status).toBe(404);
    const added = await admin({ action: 'add', text: s.list(codes) });
    expect(added.status).toBe(200);
    expect(await added.json()).toMatchObject({ added: 3, total: 3 });
    const pub = await call([]);
    const body = await pub.json() as { state: string; code: string };
    expect(pub.status).toBe(200);
    expect(body).toMatchObject({ state: 'live', code: codes[0] });
    expect(JSON.stringify(body)).not.toContain(codes[1]);
    expect((await call([], { method: 'POST' })).status).toBe(405);
    expect((await call(['nothing'])).status).toBe(404);
    expect((await call([], {}, setup({ RADIO_GIFT_ENABLED: '0' }).env)).status).toBe(404);
  });
});
