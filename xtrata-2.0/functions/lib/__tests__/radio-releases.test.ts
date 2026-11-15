// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { createStacksPrivateKey, getAddressFromPrivateKey, makeRandomPrivKey, privateKeyToString, signMessageHashRsv, TransactionVersion } from '@stacks/transactions';
import { createRelease, HELD_MAX, orderPaid, orderStatus, releasesBy, releasesConfig, releaseView, RELEASES_PER_DAY, setPrice, shelfAct, songsHeld, type ReleaseEnv } from '../radio-releases';
import { confirmBatch, createBatch, ensureGiftTables, GiftError, type ChainTransfer, type GiftChain, type GiftDeps } from '../radio-gifts';
import { batchDeposit, batchRequestHash, type BatchRequest } from '../../../src/lib/listening-wallet/batches';
import { GIFT_FEE } from '../../../src/lib/listening-wallet/gifts';
import { playerHash, type PlayerDefinition } from '../../../src/lib/listening-wallet/gift-players';
import { orderMemo, parseStx, priceDigest, releaseDigest, SHELF_MAX, signShelfRequest, stxText, type PriceRequest, type ReleaseRequest, type ShelfAction } from '../../../src/lib/music-releases/release';
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
  const batch = async (list: any[]) => {
    sql.exec('BEGIN');
    try { const out = []; for (const st of list) out.push(await st.run()); sql.exec('COMMIT'); return out; }
    catch (e) { sql.exec('ROLLBACK'); throw e; }
  };
  return { sql, prepare: statement, batch };
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
  const txs = new Map<string, ChainTransfer>();
  const world = { chainDown: false };
  const chain = {
    ownerOf: async (id: number) => { if (owners.get(id) === undefined) return null; return owners.get(id)!; },
    transfer: async (txid: string) => { if (world.chainDown) throw new Error('down'); return txs.get(txid) ?? null; },
    inbound: async (to: string) => { if (world.chainDown) throw new Error('down'); return [...txs].filter(([, t]) => t.recipient === to).map(([txid, t]) => ({ ...t, txid })); }
  } as unknown as GiftChain;
  let txn = 0;
  /** A transfer as the chain would show it. */
  const transfer = (t: Partial<ChainTransfer> & { recipient: string; amount: bigint; memo: string }) => { const txid = '0x' + (++txn).toString(16).padStart(64, 'a'); txs.set(txid, { status: 'success', sender: addr(key()), ...t }); return txid; };
  const price = (release: string, stx: string, k = artistKey, by = addr(k), at = (now += 1000)) => {
    const request: PriceRequest = { artist: by, release, price: stx, issued: at };
    return setPrice(env, { request, signature: signMessageHashRsv({ messageHash: priceDigest(request), privateKey: createStacksPrivateKey(k) }).data }, now);
  };
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
  return { env, db, artist, artistKey, owners, def, signed, release, listener, deps, chain, txs, world, transfer, price, tick: (ms: number) => { now += ms; }, now: () => now };
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

describe('selling a release (the buyer pays the artist directly)', () => {
  const SALES = { RADIO_RELEASE_SALES_ENABLED: '1' };

  it('is its own switch: with sales off nobody can set a price', async () => {
    const s = await setup();
    const r = await s.release();
    await expect(s.price(r.id, '2000000')).rejects.toMatchObject({ status: 404 });
    expect((await releaseView(s.env, r.id)).price).toBe('0');
    expect(releasesConfig(s.env)).toMatchObject({ enabled: true, sales: false, copies: false });
    expect(releasesConfig((await setup(SALES)).env)).toMatchObject({ sales: true });
    expect(releasesConfig({ RADIO_RELEASE_SALES_ENABLED: '1' } as ReleaseEnv)).toMatchObject({ enabled: false, sales: false });
  });

  it('only the artist can set the price, within limits, and a signed price works once', async () => {
    const s = await setup(SALES);
    const r = await s.release();
    expect(await s.price(r.id, '2000000')).toMatchObject({ id: r.id, price: '2000000', sold: 0 });
    const stranger = key();
    await expect(s.price(r.id, '1', s.artistKey)).rejects.toThrow(/0\.1 to 1,000 STX/);
    await expect(s.price(r.id, '2000000000', s.artistKey)).rejects.toThrow(/0\.1 to 1,000 STX/);
    await expect(s.price(r.id, '500000', stranger)).rejects.toMatchObject({ status: 403 });          // their own signature, not their release
    await expect(s.price(r.id, '500000', stranger, s.artist)).rejects.toMatchObject({ status: 403 }); // claims to be the artist
    await expect(s.price('0123456789abcdef', '500000')).rejects.toMatchObject({ status: 404 });
    // an older signed price cannot be replayed over a newer one
    const old = s.now();
    await s.price(r.id, '3000000');
    await expect(s.price(r.id, '100000', s.artistKey, s.artist, old)).rejects.toMatchObject({ status: 409 });
    expect((await releaseView(s.env, r.id)).price).toBe('3000000');
    expect((await s.price(r.id, '0')).price).toBe('0');                                              // free again
  });

  it('adding a priced release opens an order instead of adding it; the album arrives only when the payment to the artist confirms', async () => {
    const s = await setup(SALES);
    const r = await s.release();
    await s.price(r.id, '2000000');
    const me = s.listener();
    const first = await me.ask('add', r.id);
    expect(first.albums).toHaveLength(0);
    expect(first.pay).toMatchObject({ release: r.id, to: s.artist, amount: '2000000', status: 'pending' });
    expect(first.pay!.memo).toBe(orderMemo(first.pay!.order));
    // asking again is the same order, never a second one
    expect((await me.ask('add', r.id)).pay!.order).toBe(first.pay!.order);
    // not paid yet
    expect(await orderPaid(s.env, { order: first.pay!.order }, s.chain, s.now())).toMatchObject({ status: 'pending' });
    // a payment still in the mempool is "confirming", and adds nothing
    const txid = s.transfer({ recipient: s.artist, amount: 2_000_000n, memo: first.pay!.memo, status: 'pending' });
    expect(await orderPaid(s.env, { order: first.pay!.order, txid }, s.chain, s.now())).toMatchObject({ status: 'confirming' });
    expect((await me.ask('list')).albums).toHaveLength(0);
    expect(await orderStatus(s.env, first.pay!.order)).toMatchObject({ status: 'confirming' });
    // confirmed: paid, and the album is in the player
    s.txs.get(txid)!.status = 'success';
    expect(await orderPaid(s.env, { order: first.pay!.order }, s.chain, s.now())).toMatchObject({ status: 'paid' });
    expect((await me.ask('list')).albums.map((a) => a.id)).toEqual([r.id]);
    expect(await releaseView(s.env, r.id)).toMatchObject({ added: 1, sold: 1 });
    // paid is paid: checking again changes nothing
    expect(await orderPaid(s.env, { order: first.pay!.order, txid }, s.chain, s.now())).toMatchObject({ status: 'paid' });
    expect(await releaseView(s.env, r.id)).toMatchObject({ added: 1, sold: 1 });
  });

  it('a payment is found by its memo alone, from any wallet, and overpaying still counts', async () => {
    const s = await setup(SALES);
    const r = await s.release();
    await s.price(r.id, '500000');
    const me = s.listener();
    const { pay } = await me.ask('add', r.id);
    s.transfer({ recipient: s.artist, amount: 600_000n, memo: pay!.memo });
    expect(await orderPaid(s.env, { order: pay!.order }, s.chain, s.now())).toMatchObject({ status: 'paid' });
    expect((await me.ask('list')).albums).toHaveLength(1);
  });

  it('refuses a payment that is too small, to someone else, with another memo, or that failed; and one payment buys one copy', async () => {
    const s = await setup(SALES);
    const r = await s.release();
    await s.price(r.id, '2000000');
    const me = s.listener(), other = s.listener();
    const mine = (await me.ask('add', r.id)).pay!, theirs = (await other.ask('add', r.id)).pay!;
    expect(mine.order).not.toBe(theirs.order);
    const check = (order: string, txid?: string) => orderPaid(s.env, { order, txid }, s.chain, s.now());
    await expect(check(mine.order, s.transfer({ recipient: s.artist, amount: 1_999_999n, memo: mine.memo }))).rejects.toThrow(/does not pay this order/);
    await expect(check(mine.order, s.transfer({ recipient: addr(key()), amount: 2_000_000n, memo: mine.memo }))).rejects.toThrow(/does not pay this order/);
    await expect(check(mine.order, s.transfer({ recipient: s.artist, amount: 2_000_000n, memo: 'buy 0000000000000000' }))).rejects.toThrow(/does not pay this order/);
    await expect(check(mine.order, s.transfer({ recipient: s.artist, amount: 2_000_000n, memo: mine.memo, status: 'aborted' }))).rejects.toThrow(/did not go through/);
    await expect(check(mine.order, 'nope')).rejects.toMatchObject({ status: 400 });
    await expect(check('ffffffffffffffff')).rejects.toMatchObject({ status: 404 });
    // none of those were found by the memo scan either (too small / failed are not matches)
    s.txs.clear();
    expect(await check(mine.order)).toMatchObject({ status: 'pending' });
    expect((await me.ask('list')).albums).toHaveLength(0);
    // my real payment pays MY order only: it cannot be used for the other listener's
    const good = s.transfer({ recipient: s.artist, amount: 2_000_000n, memo: mine.memo });
    await expect(check(theirs.order, good)).rejects.toThrow(/does not pay this order/);
    expect(await check(mine.order, good)).toMatchObject({ status: 'paid' });
    expect((await other.ask('list')).albums).toHaveLength(0);
    expect((await releaseView(s.env, r.id)).sold).toBe(1);
  });

  it('when the chain cannot be read nothing is decided: an error, not "unpaid" and never "paid"', async () => {
    const s = await setup(SALES);
    const r = await s.release();
    await s.price(r.id, '2000000');
    const me = s.listener();
    const { pay } = await me.ask('add', r.id);
    s.transfer({ recipient: s.artist, amount: 2_000_000n, memo: pay!.memo });
    s.world.chainDown = true;
    await expect(orderPaid(s.env, { order: pay!.order }, s.chain, s.now())).rejects.toMatchObject({ status: 503 });
    expect((await me.ask('list')).albums).toHaveLength(0);
    s.world.chainDown = false;
    expect(await orderPaid(s.env, { order: pay!.order }, s.chain, s.now())).toMatchObject({ status: 'paid' });
  });

  it('a bought album is the player’s for good: remove and add again costs nothing, whatever the price is now', async () => {
    const s = await setup(SALES);
    const r = await s.release();
    await s.price(r.id, '500000');
    const me = s.listener();
    const { pay } = await me.ask('add', r.id);
    s.transfer({ recipient: s.artist, amount: 500_000n, memo: pay!.memo });
    await orderPaid(s.env, { order: pay!.order }, s.chain, s.now());
    await me.ask('remove', r.id);
    await s.price(r.id, '9000000');
    const again = await me.ask('add', r.id);
    expect(again.pay).toBeUndefined();
    expect(again.albums.map((a) => a.id)).toEqual([r.id]);
  });

  it('players who added it while it was free keep it; new ones pay; an unpaid order follows the price, a paying one does not', async () => {
    const s = await setup(SALES);
    const r = await s.release();
    const early = s.listener(), late = s.listener();
    expect((await early.ask('add', r.id)).albums).toHaveLength(1);
    await s.price(r.id, '500000');
    expect((await early.ask('add', r.id)).pay).toBeUndefined();                 // already theirs
    expect((await early.ask('list')).albums).toHaveLength(1);
    const o1 = (await late.ask('add', r.id)).pay!;
    await s.price(r.id, '700000');
    const o2 = (await late.ask('add', r.id)).pay!;
    expect(o2).toMatchObject({ order: o1.order, amount: '700000' });
    const txid = s.transfer({ recipient: s.artist, amount: 700_000n, memo: o2.memo, status: 'pending' });
    await orderPaid(s.env, { order: o2.order, txid }, s.chain, s.now());
    await s.price(r.id, '900000');                                              // the price rises while their payment confirms
    expect((await late.ask('add', r.id)).pay).toMatchObject({ amount: '700000', status: 'confirming' });
    s.txs.get(txid)!.status = 'success';
    expect(await orderPaid(s.env, { order: o2.order }, s.chain, s.now())).toMatchObject({ status: 'paid' });
  });

  it('with sales paused a priced album is neither sold nor given away, but a payment already made still counts', async () => {
    const s = await setup(SALES);
    const r = await s.release();
    await s.price(r.id, '500000');
    const me = s.listener(), other = s.listener();
    const { pay } = await me.ask('add', r.id);
    s.transfer({ recipient: s.artist, amount: 500_000n, memo: pay!.memo });
    (s.env as any).RADIO_RELEASE_SALES_ENABLED = '0';
    await expect(other.ask('add', r.id)).rejects.toMatchObject({ status: 503 });
    expect((await other.ask('list')).albums).toHaveLength(0);
    expect(await orderPaid(s.env, { order: pay!.order }, s.chain, s.now())).toMatchObject({ status: 'paid' });
    expect((await me.ask('list')).albums).toHaveLength(1);
  });

  it('prices read and write as people type them', () => {
    expect(stxText(2_000_000n)).toBe('2');
    expect(stxText('500000')).toBe('0.5');
    expect(stxText(12_250_000n)).toBe('12.25');
    expect(parseStx('2')).toBe(2_000_000n);
    expect(parseStx(' 0.5 ')).toBe(500_000n);
    expect(parseStx('1.000001')).toBe(1_000_001n);
    for (const bad of ['', 'abc', '1.', '.5', '-1', '1e3', '1.0000001']) expect(parseStx(bad)).toBeNull();
  });
});

describe('an artist funds copies of their own release (plays included)', () => {
  const GIFTS = { RADIO_PPP_ENABLED: '1', RADIO_PPP_HOST: 'radio.xtrata.test', RADIO_LISTENING_WALLET_ORIGIN: 'https://wallet.xtrata.test', RADIO_GIFT_ENABLED: '1', RADIO_GIFT_TREASURY_KEY: key(), RADIO_GIFT_ADMIN: addr(key()) };
  const COPIES = { ...GIFTS, RADIO_RELEASE_COPIES_ENABLED: '1' };
  const request = new Request('https://radio.xtrata.test/radio/gift/batch', { method: 'POST' });
  type S = Awaited<ReturnType<typeof setup>>;
  const fund = (s: S, over: Partial<BatchRequest>, k = s.artistKey) => {
    s.tick(1000); // each signed request works once
    const r: BatchRequest = { creator: addr(k), count: 5, amount: '200000', label: 'Launch', issued: s.now(), ...over };
    return createBatch(s.env, { request: r, signature: signMessageHashRsv({ messageHash: batchRequestHash(r), privateKey: createStacksPrivateKey(k) }).data }, s.deps(), request);
  };

  it('is its own switch, and needs the gift treasury to be set up', async () => {
    const off = await setup(GIFTS);
    const r = await off.release();
    await expect(fund(off, { player: r.id })).rejects.toThrow(/Only a gift admin/);
    expect(releasesConfig(off.env, request).copies).toBe(false);
    expect(releasesConfig((await setup(COPIES)).env, request).copies).toBe(true);
    expect(releasesConfig((await setup({ RADIO_RELEASE_COPIES_ENABLED: '1' })).env, request).copies).toBe(false); // no treasury
  });

  it('the artist can fund copies of a release they made: dormant until their one payment confirms', async () => {
    const s = await setup(COPIES);
    const r = await s.release();
    const made = await fund(s, { player: r.id });
    expect(made).toMatchObject({ count: 5, amount: '200000', deposit: String(batchDeposit(5, 200_000n)), memo: `batch ${made.id}` });
    expect(made.codes).toHaveLength(5);
    const rows = () => s.db.sql.prepare('SELECT status, gifter, player_id FROM radio_gifts WHERE batch_id=?').all(made.id) as { status: string; gifter: string; player_id: string }[];
    expect(rows().every((g) => g.status === 'pending-deposit' && g.gifter === s.artist && g.player_id === r.id)).toBe(true);
    const txid = s.transfer({ sender: s.artist, recipient: made.depositTo, amount: BigInt(made.deposit), memo: made.memo });
    expect(await confirmBatch(s.env, { id: made.id, txid }, s.deps(), request)).toMatchObject({ status: 'live' });
    expect(rows().every((g) => g.status === 'live')).toBe(true);
  });

  it('not for starter copies, not for someone else’s release, and not for an album that is not a release', async () => {
    const s = await setup(COPIES);
    const r = await s.release();
    const stranger = key();
    await expect(fund(s, {})).rejects.toThrow(/Only a gift admin/);                                   // no album
    await expect(fund(s, { player: r.id }, stranger)).rejects.toThrow(/Only a gift admin/);          // not their release
    await expect(fund(s, { player: 'ffffffffffffffff' })).rejects.toThrow(/Only a gift admin/);
    expect(s.db.sql.prepare('SELECT COUNT(*) AS n FROM radio_gifts').get()).toMatchObject({ n: 0 });
  });

  it('holds at most 25 STX of one artist’s money at a time; claimed and refunded copies free the room', async () => {
    const s = await setup(COPIES);
    const r = await s.release();
    const each = 1_000_000n, per = each + GIFT_FEE;
    const a = await fund(s, { player: r.id, count: 20, amount: String(each) });                     // 20.06 STX
    await expect(fund(s, { player: r.id, count: 5, amount: String(each) })).rejects.toThrow(/up to 25 STX in unclaimed copies/);
    expect(Number(per) * 24 <= 25_000_000).toBe(true);
    await fund(s, { player: r.id, count: 4, amount: String(each) });                                // 24.07 STX: fits
    await expect(fund(s, { player: r.id, count: 1, amount: String(each) })).rejects.toMatchObject({ status: 409 });
    // copies that were claimed or refunded no longer count
    s.db.sql.prepare("UPDATE radio_gifts SET status='claimed' WHERE batch_id=?").run(a.id);
    await expect(fund(s, { player: r.id, count: 20, amount: String(each) })).resolves.toMatchObject({ count: 20 });
    // another artist has their own room
    const k2 = key();
    for (const id of [319, 320]) s.owners.set(id, addr(k2));
    const r2 = await s.release(s.def({ title: 'Other', tracks: [319, 320] }), k2);
    await expect(fund(s, { player: r2.id, count: 20, amount: String(each) }, k2)).resolves.toMatchObject({ count: 20 });
  });

  it('the cap is a setting', async () => {
    const s = await setup({ ...COPIES, RADIO_RELEASE_COPIES_CAP: '1000000' });
    const r = await s.release();
    await expect(fund(s, { player: r.id, count: 5, amount: '200000' })).rejects.toThrow(/up to 1 STX/);
    await expect(fund(s, { player: r.id, count: 4, amount: '200000' })).resolves.toMatchObject({ count: 4 });
  });
});
