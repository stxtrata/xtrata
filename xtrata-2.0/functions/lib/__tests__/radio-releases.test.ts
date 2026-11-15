// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { createStacksPrivateKey, getAddressFromPrivateKey, makeRandomPrivKey, privateKeyToString, signMessageHashRsv, TransactionVersion } from '@stacks/transactions';
import { createRelease, HELD_MAX, releasesBy, releaseView, RELEASES_PER_DAY, shelfAct, songsHeld, type ReleaseEnv } from '../radio-releases';
import { ensureGiftTables, GiftError, type GiftChain, type GiftDeps } from '../radio-gifts';
import { playerHash, type PlayerDefinition } from '../../../src/lib/listening-wallet/gift-players';
import { releaseDigest, SHELF_MAX, signShelfRequest, type ReleaseRequest, type ShelfAction } from '../../../src/lib/music-releases/release';
const { DatabaseSync } = createRequire(import.meta.url)('node:sqlite');

function database() {
  const sql = new DatabaseSync(':memory:');
  sql.exec(readFileSync('functions/migrations/026_radio_listening_wallets.sql', 'utf8'));
  sql.exec(readFileSync('functions/migrations/027_radio_gifts.sql', 'utf8'));
  sql.exec('CREATE TABLE radio_metadata (token_id INTEGER PRIMARY KEY, title TEXT, artist TEXT, is_song INTEGER, status TEXT)');
  const statement = (query: string) => {
    let args: any[] = [];
    const s: any = {
      bind(...values: any[]) { args = values; return s; },
      async all() { return { results: sql.prepare(query).all(...args) }; },
      async first() { return sql.prepare(query).get(...args) ?? null; },
      async run() { const r = sql.prepare(query).run(...args); return { meta: { changes: Number(r.changes) } }; }
    };
    return s;
  };
  return { sql, prepare: statement };
}
const key = () => privateKeyToString(makeRandomPrivKey()).slice(0, 64) + '01';
const addr = (k: string) => getAddressFromPrivateKey(k, TransactionVersion.Mainnet);
const T0 = 1_800_000_000_000;

async function setup(over: Partial<ReleaseEnv> = {}) {
  const db = database();
  const env = { DB: db, RADIO_RELEASES_ENABLED: '1', TELEMETRY_SALT: 's', ...over } as unknown as ReleaseEnv;
  await ensureGiftTables(env);
  const artistKey = key(), artist = addr(artistKey);
  const owners = new Map<number, string | null>();
  // Songs 315..320 are ready songs; 318 is a hidden track; 900 is not a song at all.
  for (const [id, title, isSong] of [[315, 'Entertainment', 1], [316, 'Lipstick', 1], [317, 'SuperUser', 1], [318, 'Secret', 2], [319, 'Russian Rampage', 1], [320, 'Sahara', 1]] as const) {
    db.sql.prepare('INSERT INTO radio_metadata VALUES(?,?,?,?,?)').run(id, title, 'melophonic', isSong, 'ready');
    owners.set(id, artist);
  }
  let now = T0;
  const chain = { ownerOf: async (id: number) => { if (owners.get(id) === undefined) return null; return owners.get(id)!; } } as unknown as GiftChain;
  const deps = (): GiftDeps => ({ chain, now });
  const def = (o: Partial<PlayerDefinition> = {}): PlayerDefinition => ({ title: 'Reload', subtitle: 'melophonic', tracks: [315, 316], cover: null, ...o });
  const signed = (d: PlayerDefinition, k = artistKey, by = addr(k)) => {
    const request: ReleaseRequest = { artist: by, hash: playerHash(d), issued: now };
    return { definition: d, request, signature: signMessageHashRsv({ messageHash: releaseDigest(request), privateKey: createStacksPrivateKey(k) }).data };
  };
  const release = async (d = def(), k = artistKey) => createRelease(env, signed(d, k), deps());
  // A listener's player: its own key signs every shelf request.
  const listener = () => {
    const k = key(), player = addr(k);
    const ask = (action: ShelfAction, rel = '', at = (now += 1000)) => {
      const request = { action, release: action === 'list' ? '' : rel, player, issued: at };
      return shelfAct(env, { request, signature: signShelfRequest(request, k) }, now);
    };
    return { k, player, ask };
  };
  return { env, db, artist, artistKey, owners, def, signed, release, listener, deps, tick: (ms: number) => { now += ms; }, now: () => now };
}

describe('releasing music', () => {
  it('is off unless switched on', async () => {
    const s = await setup({ RADIO_RELEASES_ENABLED: '0' });
    await expect(s.release()).rejects.toMatchObject({ status: 404 });
    await expect(releaseView(s.env, '0123456789abcdef')).rejects.toMatchObject({ status: 404 });
    await expect(s.listener().ask('list')).rejects.toMatchObject({ status: 404 });
  });

  it('any wallet that holds every song can release them, signed by that wallet; the release is public with its songs and artist', async () => {
    const s = await setup();
    const r = await s.release();
    expect(r).toMatchObject({ title: 'Reload', tracks: 2, existing: false });
    const v = await releaseView(s.env, r.id);
    expect(v).toMatchObject({ id: r.id, title: 'Reload', subtitle: 'melophonic', artist: s.artist, added: 0, cover: null });
    expect(v.tracks.map((t) => [t.id, t.title])).toEqual([[315, 'Entertainment'], [316, 'Lipstick']]);
    expect((await releasesBy(s.env, s.artist)).releases.map((x) => x.id)).toEqual([r.id]);
    // The same release again is the same release, not a second one.
    s.tick(1000);
    expect(await s.release()).toMatchObject({ id: r.id, existing: true });
    expect((await releasesBy(s.env, s.artist)).releases).toHaveLength(1);
  });

  it('refuses songs the wallet does not hold, songs that are not songs, and a signature that is not the artist’s', async () => {
    const s = await setup();
    const stranger = key();
    s.owners.set(316, addr(stranger));
    await expect(s.release()).rejects.toThrow(/Song #316 is not in this wallet/);
    s.owners.set(316, 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.market');
    await expect(s.release()).rejects.toThrow(/held by a contract/);
    s.owners.set(316, s.artist);
    await expect(s.release(s.def({ tracks: [315, 900] }))).rejects.toThrow(/Song #900 is not a ready song/);
    await expect(s.release(s.def({ tracks: [318] }))).rejects.toThrow(/at least one song that is not a hidden track/);
    await expect(s.release(s.def({ title: '<b>x</b>' }))).rejects.toThrow(/Title/);
    // Signed by someone else's key but claiming to be the artist.
    await expect(createRelease(s.env, s.signed(s.def(), stranger, s.artist), s.deps())).rejects.toMatchObject({ status: 403 });
    // A signature for one album cannot release another.
    const a = s.signed(s.def());
    await expect(createRelease(s.env, { ...a, definition: s.def({ tracks: [315, 316, 317] }) }, s.deps())).rejects.toThrow(/different release/);
    s.tick(16 * 60_000);
    await expect(createRelease(s.env, a, s.deps())).rejects.toThrow(/expired/);
    expect((await releasesBy(s.env, s.artist)).releases).toHaveLength(0);
  });

  it('nobody can take over an album another wallet released, and a wallet cannot flood releases', async () => {
    const s = await setup();
    const first = await s.release();
    const other = key();
    for (const id of [315, 316]) s.owners.set(id, addr(other));   // the songs were sold on: the new holder releases the very same album
    s.tick(1000);
    await expect(s.release(s.def(), other)).rejects.toMatchObject({ status: 409 });
    expect((await releaseView(s.env, first.id)).artist).toBe(s.artist);
    const t = await setup();
    for (let i = 0; i < RELEASES_PER_DAY; i++) { t.tick(1000); await t.release(t.def({ title: 'Single ' + i, tracks: [315] })); }
    t.tick(1000);
    await expect(t.release(t.def({ title: 'One more', tracks: [315] }))).rejects.toMatchObject({ status: 429 });
  });

  it('lists the ready songs a wallet holds, and a failed read is an error, never "no songs"', async () => {
    const s = await setup();
    const out = await songsHeld(s.env, s.artist, async () => [320, 900, 315, 318, 315]);
    expect(out).toEqual({ songs: [{ id: 315, title: 'Entertainment', artist: 'melophonic' }, { id: 320, title: 'Sahara', artist: 'melophonic' }], more: false });
    expect((await songsHeld(s.env, s.artist, async () => Array.from({ length: HELD_MAX }, (_, i) => i + 1))).more).toBe(true);
    await expect(songsHeld(s.env, s.artist, async () => { throw new Error('503'); })).rejects.toMatchObject({ status: 503 });
    await expect(songsHeld(s.env, 'jim.btc', async () => [])).rejects.toMatchObject({ status: 400 });
  });
});

describe('a player’s shelf', () => {
  it('an added album stays added, on any device, until the listener hides or removes it', async () => {
    const s = await setup();
    const r = await s.release();
    const me = s.listener();
    expect((await me.ask('list')).albums).toEqual([]);
    const added = await me.ask('add', r.id);
    expect(added.albums).toHaveLength(1);
    expect(added.albums[0]).toMatchObject({ id: r.id, title: 'Reload', artist: s.artist, hidden: false, added: 1 });
    expect((await me.ask('add', r.id)).albums).toHaveLength(1);            // adding twice is still one
    expect((await me.ask('hide', r.id)).albums[0].hidden).toBe(true);
    expect((await me.ask('list')).albums[0].hidden).toBe(true);            // a later visit sees the same
    expect((await me.ask('show', r.id)).albums[0].hidden).toBe(false);
    expect((await me.ask('remove', r.id)).albums).toEqual([]);
    expect((await releaseView(s.env, r.id)).added).toBe(0);
    await expect(me.ask('hide', r.id)).rejects.toMatchObject({ status: 404 });
    expect((await me.ask('add', r.id)).albums).toHaveLength(1);            // and it can be added again
  });

  it('the count of players is public; whose shelf an album is on is not, and only the player’s own key can read or change it', async () => {
    const s = await setup();
    const r = await s.release();
    const a = s.listener(), b = s.listener();
    await a.ask('add', r.id); await b.ask('add', r.id);
    const v = await releaseView(s.env, r.id);
    expect(v.added).toBe(2);
    expect(JSON.stringify(v)).not.toContain(a.player);
    expect(JSON.stringify(await releasesBy(s.env, s.artist))).not.toContain(b.player);
    // Someone else signing a request that names this player is refused.
    const forged = { action: 'remove' as const, release: r.id, player: a.player, issued: s.now() + 5000 };
    await expect(shelfAct(s.env, { request: forged, signature: signShelfRequest(forged, b.k) }, s.now())).rejects.toMatchObject({ status: 403 });
    await expect(shelfAct(s.env, { request: { ...forged, action: 'list', release: '' }, signature: 'ab'.repeat(65) }, s.now())).rejects.toMatchObject({ status: 403 });
    expect((await a.ask('list')).albums).toHaveLength(1);
  });

  it('a signed request cannot be used twice or after a newer one, and it expires', async () => {
    const s = await setup();
    const r = await s.release();
    const me = s.listener();
    s.tick(1000);
    const at = s.now();
    const request = { action: 'add' as const, release: r.id, player: me.player, issued: at };
    const signature = signShelfRequest(request, me.k);
    await shelfAct(s.env, { request, signature }, at);
    await me.ask('remove', r.id);
    await expect(shelfAct(s.env, { request, signature }, s.now())).rejects.toMatchObject({ status: 409 });   // the old "add" cannot undo the remove
    expect((await me.ask('list')).albums).toEqual([]);
    const old = { action: 'list' as const, release: '', player: me.player, issued: s.now() - 10 * 60_000 };
    await expect(shelfAct(s.env, { request: old, signature: signShelfRequest(old, me.k) }, s.now())).rejects.toThrow(/expired/);
  });

  it('only real releases can be added, and a shelf has a limit', async () => {
    const s = await setup();
    const me = s.listener();
    await expect(me.ask('add', '0123456789abcdef')).rejects.toMatchObject({ status: 404 });
    await expect(me.ask('add', 'nope')).rejects.toBeInstanceOf(GiftError);
    const r = await s.release();
    for (let i = 0; i < SHELF_MAX; i++) s.db.sql.prepare('INSERT INTO radio_release_shelf(player, release, added_at, hidden) VALUES(?,?,?,0)').run(me.player, 'x'.repeat(8) + String(i).padStart(8, '0'), T0);
    await expect(me.ask('add', r.id)).rejects.toThrow(/up to 200 albums/);
  });
});
