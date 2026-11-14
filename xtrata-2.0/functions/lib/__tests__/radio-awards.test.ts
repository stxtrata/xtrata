// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { getAddressFromPrivateKey, makeRandomPrivKey, privateKeyToString, TransactionVersion, createStacksPrivateKey, getPublicKey, publicKeyToString } from '@stacks/transactions';
import { sha256 } from '@noble/hashes/sha256';
import { ripemd160 } from '@noble/hashes/ripemd160';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import {
  AwardUnavailable, awardAtNumber, awardNote, awardsConfig, awardStatus, heroPlays, MAX_PAGES, NOTES_PER_HOUR, playsOf, RECOUNT_MS, targetFor,
  type AwardChain, type AwardsEnv, type ChainTx
} from '../radio-awards';
import { ensureGiftTables } from '../radio-gifts';
import { ensureGiveawayTables } from '../radio-giveaway';
import { ensureSlotTable } from '../radio-listening-wallet';
import { giftCodeHash, newGiftCode } from '../../../src/lib/listening-wallet/gifts';
import { PLAYS_CONTRACT } from '../../../src/lib/listening-wallet/tx';
import { AWARD_CLASS, awardSeed, recordHash } from '../../../src/lib/music-awards/record';
import { noteSignerHash } from '../../../src/lib/music-awards/note';
const { DatabaseSync } = createRequire(import.meta.url)('node:sqlite');

function database() {
  const sql = new DatabaseSync(':memory:');
  sql.exec(readFileSync('functions/migrations/026_radio_listening_wallets.sql', 'utf8'));
  sql.exec(readFileSync('functions/migrations/027_radio_gifts.sql', 'utf8'));
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
const wallet = () => getAddressFromPrivateKey(key(), TransactionVersion.Mainnet);
const CONTRACT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-music-awards-v1-0';
const T0 = 1_800_000_000_000;
const amountFor = (plays: number) => 3000 + plays * 350;
const play = (sender: string, height: number, over: Partial<ChainTx> = {}): ChainTx => ({ height, ok: true, sender, contract: PLAYS_CONTRACT, fn: 'play', ...over });

async function setup(over: Partial<AwardsEnv> = {}) {
  const db = database();
  const signerKey = key();
  const env = { DB: db, RADIO_AWARDS_ENABLED: '1', RADIO_AWARDS_CONTRACT: CONTRACT, RADIO_AWARDS_DROP: '1', RADIO_AWARDS_SIGNER_KEY: signerKey, TELEMETRY_SALT: 's', ...over } as unknown as AwardsEnv;
  await ensureGiftTables(env); await ensureGiveawayTables(env as never); await ensureSlotTable(env);
  const world = {
    tip: 1000, fail: new Set<string>(), pages: 0,
    txs: new Map<string, ChainTx[]>(),                      // per address, any order: served newest first
    awards: new Map<string, number>(), byNumber: new Map<number, number>(), owners: new Map<number, string>(),
    classes: new Map<number, { template: number; cap: number; minted: number }>([[1, { template: 9001, cap: 5, minted: 0 }], [2, { template: 9002, cap: 10, minted: 0 }], [5, { template: 9005, cap: 865, minted: 0 }]]),
    paused: false, names: new Map<string, string | null>()
  };
  const guard = (what: string) => { if (world.fail.has(what)) throw new AwardUnavailable(); };
  const chain: AwardChain = {
    async tip() { guard('tip'); return world.tip; },
    async page(address, until, offset) {
      guard('page'); world.pages++;
      const all = (world.txs.get(address) ?? []).filter((t) => t.height <= until).sort((a, b) => b.height - a.height);
      return { total: all.length, txs: all.slice(offset, offset + 50) };
    },
    async awardOf(_c, _d, hero) { guard('awardOf'); return world.awards.get(hero) ?? null; },
    async awardAt(_c, _d, n) { guard('awardAt'); return world.byNumber.get(n) ?? null; },
    async classOf(_c, _d, cls) { guard('classOf'); return world.classes.get(cls) ?? null; },
    async paused() { guard('paused'); return world.paused; },
    async ownerOf(id) { guard('ownerOf'); return world.owners.get(id) ?? null; },
    async primaryName(address) { guard('name'); if (!world.names.has(address)) return null; return world.names.get(address)!; }
  };
  let pos = 0;
  /** A numbered wall player: a claimed starter gift of `plays` on the players list. Returns its address. */
  const wallPlayer = (plays: number, opts: { list?: string; archived?: number; status?: string; address?: string } = {}) => {
    const code = newGiftCode(), address = opts.address ?? wallet();
    db.sql.prepare("INSERT INTO radio_gifts(id, code_hash, amount, source, gifter, label, status, created_at, expires_at, updated_at, claimed_by, claimed_at) VALUES(?, ?, ?, 'friend', NULL, '', ?, ?, ?, ?, ?, ?)")
      .run('g' + ++pos, giftCodeHash(code), amountFor(plays), opts.status ?? 'claimed', T0, T0 + 1e9, T0, address, T0);
    db.sql.prepare('INSERT INTO radio_giveaway_links(code, code_hash, added_at, list, archived) VALUES(?,?,?,?,?)').run(code, giftCodeHash(code), T0, opts.list ?? 'players', opts.archived ?? 0);
    return address;
  };
  const plays = (address: string, n: number, from = 10) => world.txs.set(address, [...(world.txs.get(address) ?? []), ...Array.from({ length: n }, (_, i) => play(address, from + i))]);
  const signerHash = bytesToHex(ripemd160(sha256(hexToBytes(publicKeyToString(getPublicKey(createStacksPrivateKey(signerKey)))))));
  return { env, db, chain, world, wallPlayer, plays, signerHash };
}

describe('Music Hero awards: settings', () => {
  it('is off unless switched on with a real contract; the target is a share of the disc’s plays, 10% by default', async () => {
    expect(awardsConfig({} as AwardsEnv).enabled).toBe(false);
    expect(awardsConfig({ RADIO_AWARDS_ENABLED: '1', RADIO_AWARDS_CONTRACT: 'nope' } as AwardsEnv).enabled).toBe(false);
    const on = awardsConfig({ RADIO_AWARDS_ENABLED: '1', RADIO_AWARDS_CONTRACT: CONTRACT } as AwardsEnv);
    expect(on).toMatchObject({ enabled: true, drop: 1, percent: 10, signerKey: null });
    expect([1000, 500, 250, 100, 50].map((p) => targetFor(p, 10))).toEqual([100, 50, 25, 10, 5]);
    expect([1000, 50].map((p) => targetFor(p, 100))).toEqual([1000, 50]);
    expect(targetFor(50, 90)).toBe(45);
    expect(awardsConfig({ RADIO_AWARDS_TARGET_PERCENT: '250' } as AwardsEnv).percent).toBe(100);
    expect(awardsConfig({ RADIO_AWARDS_TARGET_PERCENT: 'lots' } as AwardsEnv).percent).toBe(10);
    const s = await setup({ RADIO_AWARDS_ENABLED: '0' });
    expect(await awardStatus(s.env, s.chain, wallet(), T0)).toEqual({ state: 'off' });
  });
});

describe('Music Hero awards: counting paid plays from the chain', () => {
  it('counts only confirmed, successful play calls sent by the address itself', async () => {
    const s = await setup(); const a = wallet(), other = wallet();
    s.world.txs.set(a, [
      play(a, 10), play(a, 11),
      play(a, 12, { ok: false }),                                   // failed
      play(a, 13, { fn: 'set-liked' }),                             // a like
      play(a, 14, { contract: 'SP000000000000000000002Q6VF78.pox' }),// another contract
      play(other, 15),                                              // someone else's play that touched this address
      { height: 16, ok: true, sender: a, contract: null, fn: null },// a transfer
      play(a, 2000)                                                 // newer than the block being counted to
    ]);
    expect(await playsOf(s.env, s.chain, a, T0)).toBe(2);
  });

  it('remembers what it counted and afterwards reads only what is new', async () => {
    const s = await setup(); const a = wallet();
    s.plays(a, 120);
    expect(await playsOf(s.env, s.chain, a, T0)).toBe(120);
    const first = s.world.pages;
    expect(first).toBe(3);
    expect(await playsOf(s.env, s.chain, a, T0 + 1000)).toBe(120);   // within a minute: no read at all
    expect(s.world.pages).toBe(first);
    s.world.tip = 1100; s.world.txs.get(a)!.push(play(a, 1050), play(a, 1051));
    expect(await playsOf(s.env, s.chain, a, T0 + RECOUNT_MS + 1)).toBe(122);
    expect(s.world.pages).toBe(first + 1);                           // one page, not the whole history again
  });

  it('a failed read is unavailable, never a number, and nothing wrong is remembered', async () => {
    const s = await setup(); const a = wallet();
    s.plays(a, 7);
    for (const what of ['tip', 'page']) {
      s.world.fail = new Set([what]);
      await expect(playsOf(s.env, s.chain, a, T0)).rejects.toBeInstanceOf(AwardUnavailable);
    }
    s.world.fail.clear();
    expect(await playsOf(s.env, s.chain, a, T0)).toBe(7);
  });

  it('a history too long for one request carries on where it stopped, and says unavailable until it is complete', async () => {
    const s = await setup(); const a = wallet();
    const total = MAX_PAGES * 50 + 130;
    s.plays(a, total, 1);
    s.world.tip = 5000;
    await expect(playsOf(s.env, s.chain, a, T0)).rejects.toThrow(/Still counting/);
    s.world.txs.get(a)!.push(play(a, 5000));       // lands in the newest block while the count is under way: not in this count's set
    s.world.tip = 5001;
    expect(await playsOf(s.env, s.chain, a, T0 + 5)).toBe(total);
    expect(await playsOf(s.env, s.chain, a, T0 + RECOUNT_MS + 10)).toBe(total + 1);
  });

  it('every listen counts: album wallets bound to the player are added to its own plays', async () => {
    const s = await setup(); const hero = wallet(), album = wallet(), stranger = wallet();
    s.plays(hero, 4); s.plays(album, 3); s.plays(stranger, 50);
    s.db.sql.prepare('INSERT INTO radio_listening_slots(address, root, slot, issued, root_signature, slot_signature, created_at) VALUES(?,?,?,?,?,?,?)').run(album, hero, 1, T0, 'r', 's', T0);
    expect(await heroPlays(s.env, s.chain, hero, T0)).toBe(7);
  });
});

describe('Music Hero awards: where a player stands', () => {
  it('only a numbered wall player whose plays have arrived can earn a record', async () => {
    const s = await setup();
    expect(await awardStatus(s.env, s.chain, wallet(), T0)).toEqual({ state: 'not-a-player' });
    for (const opts of [{ list: 'main' }, { archived: 1 }, { status: 'claiming' }])
      expect(await awardStatus(s.env, s.chain, s.wallPlayer(500, opts), T0)).toEqual({ state: 'not-a-player' });
    await expect(awardStatus(s.env, s.chain, 'ST2294HSREF13E7W9N7ATV92WPTWH4NM9FKHGMH41', T0)).rejects.toThrow(/mainnet/);
  });

  it('walks from earning to ready to claimed, with the number and class the wall shows', async () => {
    const s = await setup();
    s.wallPlayer(50); const hero = s.wallPlayer(500); s.wallPlayer(1000);   // the second disc on the wall: number 2, Gold
    s.plays(hero, 12);
    expect(await awardStatus(s.env, s.chain, hero, T0)).toEqual({ state: 'earning', cls: 'gold', number: 2, need: 50, have: 12 });
    s.plays(hero, 38, 1000);
    s.world.tip = 1100;
    expect(await awardStatus(s.env, s.chain, hero, T0 + RECOUNT_MS + 1)).toEqual({ state: 'ready', cls: 'gold', number: 2, need: 50, have: 50 });
    s.world.awards.set(hero, 48213); s.world.owners.set(48213, hero);
    expect(await awardStatus(s.env, s.chain, hero, T0 + RECOUNT_MS + 2)).toEqual({ state: 'claimed', cls: 'gold', number: 2, inscription: 48213, holds: true });
    s.world.owners.set(48213, wallet());                                     // sent to someone else
    expect(await awardStatus(s.env, s.chain, hero, T0 + RECOUNT_MS + 3)).toMatchObject({ state: 'claimed', holds: false });
    s.world.fail = new Set(['ownerOf']);
    expect(await awardStatus(s.env, s.chain, hero, T0 + RECOUNT_MS + 4)).toMatchObject({ state: 'claimed', holds: null });   // unknown, not "sent away"
  });

  it('the target follows the setting, and topping a player up never changes its class', async () => {
    const s = await setup({ RADIO_AWARDS_TARGET_PERCENT: '100' });
    const classic = s.wallPlayer(50);
    s.plays(classic, 49);
    expect(await awardStatus(s.env, s.chain, classic, T0)).toMatchObject({ state: 'earning', cls: 'classic', need: 50, have: 49 });
    s.plays(classic, 400, 1000); s.world.tip = 2000;                                    // it added plays of its own and kept listening
    expect(await awardStatus(s.env, s.chain, classic, T0 + RECOUNT_MS + 1)).toMatchObject({ state: 'ready', cls: 'classic', need: 50, have: 449 });
  });

  it('says paused, full, not open or unavailable plainly, and unavailable is never a zero', async () => {
    const s = await setup(); const hero = s.wallPlayer(500); s.plays(hero, 60);
    s.world.paused = true;
    expect(await awardStatus(s.env, s.chain, hero, T0)).toMatchObject({ state: 'paused' });
    s.world.paused = false; s.world.classes.set(2, { template: 9002, cap: 10, minted: 10 });
    expect(await awardStatus(s.env, s.chain, hero, T0)).toMatchObject({ state: 'class-full' });
    s.world.classes.delete(2);
    expect(await awardStatus(s.env, s.chain, hero, T0)).toMatchObject({ state: 'not-open' });
    for (const what of ['awardOf', 'page', 'tip', 'paused', 'classOf']) {
      const t = await setup(); const h = t.wallPlayer(500); t.plays(h, 60); t.world.fail = new Set([what]);
      const st = await awardStatus(t.env, t.chain, h, T0);
      expect(st).toMatchObject({ state: 'unavailable', cls: 'gold', number: 1, need: 50 });
      expect(st).not.toHaveProperty('have');
    }
  });
});

describe('Music Hero awards: the note', () => {
  const ready = async (over: Partial<AwardsEnv> = {}) => { const s = await setup(over); const hero = s.wallPlayer(500); s.plays(hero, 50); return { ...s, hero }; };

  it('signs exactly one record for a ready player: its address, wall number, class, target and seed', async () => {
    const s = await ready();
    const n = await awardNote(s.env, s.chain, { address: s.hero, name: 'none' }, T0);
    expect(n).toMatchObject({ contract: CONTRACT, drop: 1, cls: AWARD_CLASS.gold, className: 'gold', number: 1, plays: 50, hero: s.hero, name: null });
    const html = new TextDecoder().decode(hexToBytes(n.record));
    expect(html).toContain(`<iframe src="/i/9002#n=1&a=${s.hero}&p=50&s=${awardSeed(1, 1, s.hero)}"></iframe>`);
    expect(html).toContain('<title>Xtrata Music Hero · Gold record No. 0001</title>');
    expect(n.bytes).toBe(hexToBytes(n.record).length);
    // The signature is the awards signer's, over this hero, number, class, plays and these bytes on mainnet.
    const fields = { chain: 1, contract: CONTRACT, drop: 1, cls: 2, number: 1, plays: 50, hero: s.hero, recordHash: recordHash(hexToBytes(n.record)) };
    expect(noteSignerHash(fields, n.signature)).toBe(s.signerHash);
    expect(noteSignerHash({ ...fields, hero: wallet() }, n.signature)).not.toBe(s.signerHash);
    // Asking again gives the very same record and note.
    expect(await awardNote(s.env, s.chain, { address: s.hero, name: 'none' }, T0 + 5)).toEqual(n);
  });

  it('the name: its own first, else its linked main wallet’s, else none; the address is always the listener’s', async () => {
    const s = await ready(); const main = wallet();
    s.db.sql.prepare('INSERT INTO radio_listening_wallets(listening, main, issued, main_signature, listening_signature, created_at, updated_at) VALUES(?,?,?,?,?,?,?)').run(s.hero, main, T0, 'a', 'b', T0, T0);
    expect((await awardNote(s.env, s.chain, { address: s.hero, name: 'auto' }, T0)).name).toBeNull();
    s.world.names.set(main, 'jim.btc');
    const linked = await awardNote(s.env, s.chain, { address: s.hero, name: 'auto' }, T0);
    expect(linked.name).toBe('jim.btc');
    expect(new TextDecoder().decode(hexToBytes(linked.record))).toContain(`&a=${s.hero}&b=jim.btc&p=50`);
    s.world.names.set(s.hero, 'hero.btc');
    expect((await awardNote(s.env, s.chain, { address: s.hero, name: 'auto' }, T0)).name).toBe('hero.btc');
    expect((await awardNote(s.env, s.chain, { address: s.hero, name: 'none' }, T0)).name).toBeNull();
  });

  it('never signs a nameless record because a name could not be read; choosing the address skips the lookup', async () => {
    const s = await ready();
    s.world.fail = new Set(['name']);
    await expect(awardNote(s.env, s.chain, { address: s.hero, name: 'auto' }, T0)).rejects.toMatchObject({ status: 503 });
    expect(s.db.sql.prepare('SELECT COUNT(*) AS n FROM radio_award_notes').get()).toMatchObject({ n: 0 });
    expect((await awardNote(s.env, s.chain, { address: s.hero, name: 'none' }, T0)).name).toBeNull();
    // A name that is not a plain name is not put on a plaque.
    s.world.fail.clear(); s.world.names.set(s.hero, 'x"><script>.btc');
    expect((await awardNote(s.env, s.chain, { address: s.hero, name: 'auto' }, T0)).name).toBeNull();
  });

  it('signs nothing unless the record is ready', async () => {
    const s = await setup(); const earning = s.wallPlayer(500); s.plays(earning, 49);
    await expect(awardNote(s.env, s.chain, { address: earning, name: 'none' }, T0)).rejects.toMatchObject({ status: 409, message: 'Not yet: 49 of 50 plays.' });
    await expect(awardNote(s.env, s.chain, { address: wallet(), name: 'none' }, T0)).rejects.toMatchObject({ status: 409 });
    await expect(awardNote(s.env, s.chain, { address: earning, name: 'whatever' }, T0)).rejects.toThrow(/Choose/);
    const done = await ready(); done.world.awards.set(done.hero, 7);
    await expect(awardNote(done.env, done.chain, { address: done.hero, name: 'none' }, T0)).rejects.toMatchObject({ status: 409 });
    const down = await ready(); down.world.fail = new Set(['page']);
    await expect(awardNote(down.env, down.chain, { address: down.hero, name: 'none' }, T0)).rejects.toMatchObject({ status: 503 });
    const noKey = await ready({ RADIO_AWARDS_SIGNER_KEY: 'not-a-key' });
    await expect(awardNote(noKey.env, noKey.chain, { address: noKey.hero, name: 'none' }, T0)).rejects.toMatchObject({ status: 503 });
    const off = await ready({ RADIO_AWARDS_ENABLED: '0' });
    await expect(awardNote(off.env, off.chain, { address: off.hero, name: 'none' }, T0)).rejects.toMatchObject({ status: 404 });
  });

  it('limits how often one address can be given a note', async () => {
    const s = await ready();
    for (let i = 0; i < NOTES_PER_HOUR; i++) await awardNote(s.env, s.chain, { address: s.hero, name: 'none' }, T0 + i);
    await expect(awardNote(s.env, s.chain, { address: s.hero, name: 'none' }, T0 + 100)).rejects.toMatchObject({ status: 429 });
    expect((await awardNote(s.env, s.chain, { address: s.hero, name: 'none' }, T0 + 3_600_001)).number).toBe(1);
  });

  it('the wall can ask whether a disc has claimed', async () => {
    const s = await setup();
    expect(await awardAtNumber(s.env, s.chain, '412')).toEqual({ state: 'none', number: 412 });
    s.world.byNumber.set(412, 48213);
    expect(await awardAtNumber(s.env, s.chain, '412')).toEqual({ state: 'claimed', number: 412, inscription: 48213 });
    s.world.fail = new Set(['awardAt']);
    expect(await awardAtNumber(s.env, s.chain, '412')).toEqual({ state: 'unavailable', number: 412 });
    await expect(awardAtNumber(s.env, s.chain, 'x')).rejects.toThrow();
  });
});
