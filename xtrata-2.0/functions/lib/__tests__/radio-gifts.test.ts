// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import {
  createStacksPrivateKey, cvToHex, cvToString, noneCV, principalCV, responseOkCV, someCV, deserializeTransaction, encodeStructuredData, getAddressFromPrivateKey, makeRandomPrivKey,
  privateKeyToString, signMessageHashRsv, TransactionVersion
} from '@stacks/transactions';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';
import {
  BUMP_AFTER_MS, claimGift, hiroGiftChain, RETRY_FAILED_MS, CLAIMS_PER_IP, confirmFriendGift, createFriendGift, createPlayer, ensureGiftTables, GiftError, giftForWallet, giftsConfig,
  adminAddresses, giftStatus, nextSlot, NONCE_SETTLE_MS, principalIn, REBROADCAST_MS, shelfFor, sweepGifts, type ChainTransfer, type GiftChain, type GiftEnv,
  batchesFor, batchStatus, confirmBatch, createBatch, ensureGiftTables, MAX_PENDING_BATCHES, REFUND_GROUP_MAX, runSweep, sweepAuthorised, SCAN_EVERY_MS, SCAN_WHILE_EXPECTING_MS
} from '../radio-gifts';
import { batchDeposit, batchRequestHash, type BatchRequest } from '../../../src/lib/listening-wallet/batches';
import { deriveSlotIdentity, listeningBase } from '../../../src/lib/listening-wallet/derive';
import { signSlotBinding } from '../../../src/lib/listening-wallet/slots';
import { playerData, playerHash, type PlayerDefinition, type PlayerRequest } from '../../../src/lib/listening-wallet/gift-players';
import { GIFT_EXPIRY_MS, GIFT_FEE, GIFT_MEMO, giftCodeHash, giftDepositMemo, newGiftCode } from '../../../src/lib/listening-wallet/gifts';
const { DatabaseSync } = createRequire(import.meta.url)('node:sqlite');

function database() {
  const sql = new DatabaseSync(':memory:');
  sql.exec(readFileSync('functions/migrations/027_radio_gifts.sql', 'utf8'));
  const statement = (query: string) => {
    db.onPrepare?.(query); // lets a test change the world between a read and the write that follows it
    let args: any[] = [];
    const s: any = {
      bind(...values: any[]) { args = values; return s; },
      async all() { return { results: sql.prepare(query).all(...args) }; },
      async first() { return sql.prepare(query).get(...args) ?? null; },
      async run() { const r = sql.prepare(query).run(...args); return { meta: { changes: Number(r.changes) } }; }
    };
    return s;
  };
  // D1 batches are transactions: all or nothing.
  const batch = async (list: any[]) => {
    sql.exec('BEGIN');
    try { const out = []; for (const st of list) out.push(await st.run()); sql.exec('COMMIT'); return out; }
    catch (e) { sql.exec('ROLLBACK'); throw e; }
  };
  const db: { sql: DatabaseSync; prepare: typeof statement; batch: typeof batch; onPrepare?: (query: string) => void } = { sql, prepare: statement, batch };
  return db;
}

const key = () => privateKeyToString(makeRandomPrivKey()).slice(0, 64) + '01';
const addr = (k: string) => getAddressFromPrivateKey(k, TransactionVersion.Mainnet);
const wallet = () => addr(key());
const T0 = 1_800_000_000_000;
type Tx = ChainTransfer & { txid: string };

function setup(over: Partial<GiftEnv> = {}) {
  const treasuryKey = key(), adminKey = key();
  const db = database();
  const env = {
    DB: db, RADIO_PPP_ENABLED: '1', RADIO_PPP_HOST: 'radio.xtrata.test', RADIO_LISTENING_WALLET_ORIGIN: 'https://wallet.xtrata.test',
    RADIO_GIFT_ENABLED: '1', RADIO_GIFT_TREASURY_KEY: treasuryKey, RADIO_GIFT_ADMIN: addr(adminKey), TELEMETRY_SALT: 'salt', ...over
  } as unknown as GiftEnv;
  const request = new Request('https://radio.xtrata.test/radio/gift/claim', { method: 'POST' });
  const treasury = addr(treasuryKey);
  /** What the fake chain knows. `broadcastMode` decides how the next broadcast goes. */
  const chain = {
    sent: [] as { raw: Uint8Array; txid: string }[],
    balances: new Map<string, bigint>([[treasury, 10_000_000n]]),
    activity: new Map<string, number>(),
    txs: new Map<string, ChainTransfer>(),
    inbound: [] as Tx[],
    /** Who holds each song: by default the admin holds every one (see `holder`). */
    owners: new Map<number, string | null>(),
    ownerError: false,
    mempoolNonce: 7n, executed: 6n as bigint | null,
    broadcastMode: 'ok' as 'ok' | 'refuse' | 'unclear'
  };
  const fake: GiftChain = {
    balance: async (a) => chain.balances.get(a) ?? 0n,
    activity: async (a) => chain.activity.get(a) ?? 0,
    nonce: async () => chain.mempoolNonce,
    executedNonce: async () => chain.executed,
    broadcast: async (raw, txid) => {
      const mode = chain.broadcastMode; chain.broadcastMode = 'ok';
      if (mode === 'refuse') throw new GiftError('Broadcast answered 400', 502);
      chain.sent.push({ raw, txid });
      if (mode === 'unclear') throw new GiftError('The network did not answer.', 502);
      return txid;
    },
    transfer: async (txid) => chain.txs.get(txid) ?? null,
    inbound: async () => chain.inbound,
    ownerOf: async (id) => {
      if (chain.ownerError) throw new GiftError('Could not check who owns a song right now.', 503);
      return chain.owners.has(id) ? chain.owners.get(id)! : addr(adminKey);
    }
  };
  let now = T0;
  const deps = () => ({ chain: fake, now, human: async () => true });
  /**
   * Campaign links made before that route was removed: rows inserted directly (the production database still holds some
   * until they expire), so their claim, limit and expiry rules stay tested.
   */
  const campaign = async (count = 2, amount = '100000', opts: { player?: string; label?: string } = {}) => {
    await ensureGiftTables(env);
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      const code = newGiftCode();
      db.sql.prepare("INSERT INTO radio_gifts(id, code_hash, amount, source, gifter, label, status, created_at, expires_at, updated_at, player_id) VALUES(?, ?, ?, 'campaign', NULL, ?, 'live', ?, ?, ?, ?)")
        .run('legacy' + Math.random().toString(16).slice(2, 14) + i, giftCodeHash(code), Number(amount), opts.label ?? 'Launch week', now, now + GIFT_EXPIRY_MS, now, opts.player ?? null);
      codes.push(code);
    }
    return { codes, amount, expires: now + GIFT_EXPIRY_MS };
  };
  const claim = (code: string, w = wallet(), ip: string | null = null) => claimGift(env, { code, wallet: w }, deps(), ip, request);
  /** The chain confirms the send that is open (the last transaction signed) and the sweep notices. */
  const land = async () => {
    const last = chain.sent.at(-1)!; const d = decode(last.raw);
    chain.txs.set(last.txid, { status: 'success', sender: treasury, recipient: d.recipient, amount: d.amount, memo: d.memo });
    chain.mempoolNonce = d.nonce + 1n; chain.executed = d.nonce;
    return sweepGifts(env, deps());
  };
  return { env, db, request, chain, deps, campaign, claim, land, treasury, admin: addr(adminKey), adminKey, tick: (ms: number) => { now += ms; }, now: () => now };
}
const decode = (raw: Uint8Array) => {
  const tx = deserializeTransaction(raw) as any;
  return { recipient: cvToString(tx.payload.recipient), amount: BigInt(tx.payload.amount), memo: String(tx.payload.memo.content).replace(/\0+$/, ''), nonce: BigInt(tx.auth.spendingCondition.nonce), fee: BigInt(tx.auth.spendingCondition.fee) };
};
const sends = (s: ReturnType<typeof setup>) => s.db.sql.prepare('SELECT * FROM radio_gift_sends ORDER BY created_at').all() as any[];

describe('radio gift wallets', () => {
  it('stay off unless pay-per-play, the radio host, the switch and a treasury key are all in place', () => {
    const s = setup();
    expect(giftsConfig(s.env, null, s.request)).toMatchObject({ enabled: true, treasury: s.treasury, admin: false });
    expect(giftsConfig(s.env, s.admin, s.request).admin).toBe(true);
    expect(giftsConfig(s.env, null, new Request('https://xtrata.xyz/radio')).enabled).toBe(false);
    expect(giftsConfig(setup({ RADIO_GIFT_ENABLED: '0' }).env, null, s.request).enabled).toBe(false);
    expect(giftsConfig(setup({ RADIO_GIFT_TREASURY_KEY: 'nope' }).env, null, s.request).enabled).toBe(false);
  });

  it('campaign links already out: only their hashes are stored, and they still show as the treasury’s gift', async () => {
    const s = setup();
    const { codes } = await s.campaign(3, '250000');
    const stored = s.db.sql.prepare('SELECT * FROM radio_gifts').all();
    expect(stored.map((r: any) => r.code_hash).sort()).toEqual(codes.map(giftCodeHash).sort());
    expect(JSON.stringify(stored)).not.toContain(codes[0]);
    expect(await giftStatus(s.env, { code: codes[0] })).toMatchObject({ status: 'live', amount: '250000', source: 'campaign', from: null });
  });

  it('there is no way left to make a campaign link', async () => {
    const mod = await import('../radio-gifts');
    expect((mod as Record<string, unknown>).createCampaign).toBeUndefined();
    const { onRequest } = await import('../../radio/gift/[[path]]');
    const s = setup();
    const r = await onRequest({ request: new Request('https://radio.test/radio/gift/campaign', { method: 'POST', headers: { origin: 'https://radio.test', 'content-type': 'application/json' }, body: '{}' }), env: s.env, params: { path: ['campaign'] } });
    expect(r.status).toBe(404);
  });

  it('a claim funds a brand-new wallet once, recorded before broadcast, and is claimed only when the chain confirms it', async () => {
    const s = setup();
    const [code] = (await s.campaign(1)).codes;
    const w = wallet();
    const out = await s.claim(code, w);
    expect(decode(s.chain.sent[0].raw)).toMatchObject({ recipient: w, amount: 100000n, memo: GIFT_MEMO, nonce: 7n, fee: GIFT_FEE });
    expect(sends(s)).toMatchObject([{ status: 'sent', nonce: 7, kind: 'claim', recipient: w }]);
    expect((await giftStatus(s.env, { code })).status).toBe('claiming');
    expect(await giftForWallet(s.env, w)).toMatchObject({ gift: { returnTo: s.treasury, from: null, source: 'campaign', txid: out.txid } });
    expect(await s.claim(code, w)).toMatchObject({ already: true, txid: out.txid });
    await expect(s.claim(code)).rejects.toThrow(/being sent to another wallet/);
    expect((await s.land()).did).toBe('settled');
    expect((await giftStatus(s.env, { code })).status).toBe('claimed');
    await expect(s.claim(code)).rejects.toThrow(/already been claimed/);
    expect(s.chain.sent).toHaveLength(1);
  });

  it('one treasury send at a time: the next claim waits until the open one has landed', async () => {
    const s = setup();
    const [a, b] = (await s.campaign(2)).codes;
    await s.claim(a);
    await expect(s.claim(b)).rejects.toMatchObject({ status: 503 });
    expect((await giftStatus(s.env, { code: b })).status).toBe('live');
    await s.land();
    await s.claim(b);
    expect(s.chain.sent.map((t) => decode(t.raw).nonce)).toEqual([7n, 8n]);
  });

  it('a failed or refused broadcast never releases the gift: the same bytes go out again until the chain decides', async () => {
    const s = setup();
    const [a, b] = (await s.campaign(2)).codes;
    s.chain.broadcastMode = 'unclear';
    const kept = await s.claim(a);
    expect((await giftStatus(s.env, { code: a })).status).toBe('claiming');
    await expect(s.claim(a)).rejects.toThrow(/being sent/);
    s.chain.txs.set(kept.txid, { status: 'success', sender: s.treasury, recipient: 'x', amount: 100000n, memo: GIFT_MEMO });
    s.chain.executed = 7n;
    expect((await sweepGifts(s.env, s.deps())).did).toBe('settled');
    s.chain.mempoolNonce = 8n;
    s.chain.broadcastMode = 'refuse';
    const refused = await s.claim(b); // e.g. a retried POST the node already had: not "not sent"
    expect((await giftStatus(s.env, { code: b })).status).toBe('claiming');
    s.tick(REBROADCAST_MS + 1);
    expect((await sweepGifts(s.env, s.deps())).did).toBe('rebroadcast');
    expect(s.chain.sent.at(-1)!.txid).toBe(refused.txid);
  });

  it('the send and its gift are written together: a gift that changed meanwhile leaves no send behind', async () => {
    const s = setup();
    const [code] = (await s.campaign(1)).codes;
    const w = wallet();
    await s.claim(code, w); await s.land();
    // the same wallet racing a second code hits the one-gift-per-wallet rule inside the transaction
    s.tick(1);
    const [other] = (await s.campaign(1)).codes;
    s.db.sql.prepare('UPDATE radio_gifts SET claimed_by=NULL WHERE claimed_by=?').run(w); // simulate the race passing the early check
    s.db.sql.prepare("UPDATE radio_gifts SET claimed_by=? WHERE claim_txid IS NOT NULL").run(w);
    const before = sends(s).length;
    await expect(claimGift(s.env, { code: other, wallet: w }, s.deps(), null, s.request)).rejects.toMatchObject({ status: 409 });
    expect(sends(s)).toHaveLength(before);
    expect((await giftStatus(s.env, { code: other })).status).toBe('live');
  });

  it('a stuck send is rebroadcast, then re-signed with the SAME nonce; whichever lands settles it', async () => {
    const s = setup();
    const [code] = (await s.campaign(1)).codes;
    const first = await s.claim(code);
    s.tick(REBROADCAST_MS + 1);
    expect((await sweepGifts(s.env, s.deps())).did).toBe('rebroadcast');
    expect(s.chain.sent.at(-1)!.txid).toBe(first.txid);
    s.tick(BUMP_AFTER_MS);
    expect((await sweepGifts(s.env, s.deps())).did).toBe('bumped');
    const bumped = decode(s.chain.sent.at(-1)!.raw);
    expect([bumped.nonce, bumped.fee]).toEqual([7n, GIFT_FEE * 2n]);
    // the original (dropped, then rebroadcast by someone) lands after all: that is the one counted
    s.chain.txs.set(first.txid, { status: 'success', sender: s.treasury, recipient: 'x', amount: 100000n, memo: GIFT_MEMO });
    expect((await sweepGifts(s.env, s.deps())).did).toBe('settled');
    expect(s.db.sql.prepare('SELECT claim_txid, status FROM radio_gifts').get()).toMatchObject({ claim_txid: first.txid, status: 'claimed' });
  });

  it('released only once its nonce is used without a payment, seen twice minutes apart', async () => {
    const s = setup();
    const [code] = (await s.campaign(1)).codes;
    const out = await s.claim(code);
    s.chain.txs.set(out.txid, { status: 'dropped', sender: s.treasury, recipient: 'x', amount: 100000n, memo: GIFT_MEMO });
    expect((await sweepGifts(s.env, s.deps())).did).toBe('pending'); // dropped is not final: the bytes could come back
    s.chain.executed = 7n; // the indexer shows nonce 7 executed, and not by a successful send of ours
    expect((await sweepGifts(s.env, s.deps())).did).toBe('nonce-used');
    s.tick(NONCE_SETTLE_MS - 1);
    expect((await sweepGifts(s.env, s.deps())).did).toBe('nonce-used');
    s.tick(2);
    expect((await sweepGifts(s.env, s.deps())).did).toBe('released');
    expect((await giftStatus(s.env, { code })).status).toBe('live');
  });

  it('refuses used wallets, failed checks and an empty treasury, leaves the gift claimable, and has no daily cap', async () => {
    const s = setup(); // no daily total: links an admin made are not held back "for today"
    const codes = (await s.campaign(4)).codes;
    const used = wallet(); s.chain.activity.set(used, 1);
    await expect(s.claim(codes[0], used)).rejects.toThrow(/brand-new/);
    await expect(claimGift(s.env, { code: codes[0], wallet: wallet() }, { ...s.deps(), human: async () => false }, null, s.request)).rejects.toThrow(/quick check/);
    s.chain.balances.set(s.treasury, 50_000n);
    await expect(s.claim(codes[0])).rejects.toThrow(/topping up/);
    s.chain.balances.set(s.treasury, 10_000_000n);
    expect((await giftStatus(s.env, { code: codes[0] })).status).toBe('live');
    await s.claim(codes[0]); await s.land();
    await s.claim(codes[1]); await s.land();
    await s.claim(codes[2]); await s.land(); // past the old 0.25 STX daily cap: still fine
  });

  it('limits claims per IP', async () => {
    const s = setup();
    const codes = (await s.campaign(CLAIMS_PER_IP + 1)).codes;
    for (let i = 0; i < CLAIMS_PER_IP; i++) { await s.claim(codes[i], wallet(), '9.9.9.9'); await s.land(); }
    await expect(s.claim(codes[CLAIMS_PER_IP], wallet(), '9.9.9.9')).rejects.toThrow(/on this connection today/);
  });

  it('never limits a friend-paid gift by connection: a household or venue shares one IP', async () => {
    const s = setup();
    const codes = (await s.campaign(CLAIMS_PER_IP)).codes;
    for (const c of codes) { await s.claim(c, wallet(), '9.9.9.9'); await s.land(); }
    const gifter = wallet();
    const g = await createFriendGift(s.env, { gifter, amount: '100000' }, s.deps(), null, s.request);
    const txid = '0x' + 'f'.repeat(64);
    s.chain.txs.set(txid, { status: 'success', sender: gifter, recipient: s.treasury, amount: 103_000n, memo: giftDepositMemo(g.id) });
    await confirmFriendGift(s.env, { id: g.id, txid }, s.deps(), s.request);
    await s.claim(g.code, wallet(), '9.9.9.9'); // same connection, already at the campaign limit
  });

  it('friend gifts: live only once the gifter’s own deposit, with this gift’s memo, confirms', async () => {
    const s = setup();
    const gifter = wallet();
    const g = await createFriendGift(s.env, { gifter, amount: '500000' }, s.deps(), '1.1.1.1', s.request);
    expect(g).toMatchObject({ depositTo: s.treasury, deposit: '503000', memo: giftDepositMemo(g.id) });
    const w = wallet();
    await expect(s.claim(g.code, w)).rejects.toThrow(/not paid for yet/);
    // a made-up txid is never stored, so it cannot hold the gift open
    expect((await confirmFriendGift(s.env, { id: g.id, txid: '0x' + 'f'.repeat(64) }, s.deps(), s.request)).status).toBe('pending-deposit');
    expect(s.db.sql.prepare('SELECT deposit_txid FROM radio_gifts WHERE id=?').get(g.id)).toMatchObject({ deposit_txid: null });
    // the gifter's wallet never reported the txid: found by its memo among the treasury's deposits
    const dep = { txid: '0x' + 'a'.repeat(64), status: 'pending' as const, sender: gifter, recipient: s.treasury, amount: 503000n, memo: giftDepositMemo(g.id) };
    s.chain.inbound = [dep];
    expect((await confirmFriendGift(s.env, { id: g.id }, s.deps(), s.request)).status).toBe('pending-deposit');
    s.chain.txs.set(dep.txid, { ...dep, status: 'success' });
    expect((await confirmFriendGift(s.env, { id: g.id }, s.deps(), s.request)).status).toBe('live');
    await s.claim(g.code, w);
    expect((await giftForWallet(s.env, w)).gift).toMatchObject({ returnTo: gifter, from: gifter, source: 'friend' });
  });

  it('nobody can take over someone else’s deposit (front-running) or pay two gifts with one', async () => {
    const s = setup();
    const victim = wallet();
    const real = await createFriendGift(s.env, { gifter: victim, amount: '500000' }, s.deps(), null, s.request);
    const txid = '0x' + 'b'.repeat(64);
    s.chain.txs.set(txid, { status: 'pending', sender: victim, recipient: s.treasury, amount: 503000n, memo: giftDepositMemo(real.id) });
    // an attacker sees it in the mempool and makes a gift "from" the victim for the same amount
    const fake = await createFriendGift(s.env, { gifter: victim, amount: '500000' }, s.deps(), null, s.request);
    await expect(confirmFriendGift(s.env, { id: fake.id, txid }, s.deps(), s.request)).rejects.toThrow(/does not match/);
    s.chain.txs.set(txid, { status: 'success', sender: victim, recipient: s.treasury, amount: 503000n, memo: giftDepositMemo(real.id) });
    expect((await confirmFriendGift(s.env, { id: real.id, txid }, s.deps(), s.request)).status).toBe('live');
    expect((await giftStatus(s.env, { id: fake.id })).status).toBe('pending-deposit');
  });

  it('the escrow cap counts only paid-for gifts, and campaign gifts never spend friends’ money', async () => {
    const s = setup({ RADIO_GIFT_ESCROW_CAP: '1006000' });
    for (let i = 0; i < 5; i++) await createFriendGift(s.env, { gifter: wallet(), amount: '1000000' }, s.deps(), null, s.request); // unpaid: not counted
    const gifter = wallet();
    const g = await createFriendGift(s.env, { gifter, amount: '1000000' }, s.deps(), null, s.request);
    const txid = '0x' + 'c'.repeat(64);
    s.chain.txs.set(txid, { status: 'success', sender: gifter, recipient: s.treasury, amount: 1_003_000n, memo: giftDepositMemo(g.id) });
    await confirmFriendGift(s.env, { id: g.id, txid }, s.deps(), s.request);
    await expect(createFriendGift(s.env, { gifter: wallet(), amount: '100000' }, s.deps(), null, s.request)).rejects.toThrow(/full right now/);
    // the treasury holds exactly the friend's money: a campaign gift may not dip into it
    s.chain.balances.set(s.treasury, 1_003_000n + 50_000n);
    const [code] = (await s.campaign(1)).codes;
    await expect(s.claim(code)).rejects.toThrow(/topping up/);
    await s.claim(g.code); // the friend's own gift still works
  });

  it('housekeeping expires campaign links, sets unpaid gifts aside and refunds expired friend gifts to the gifter', async () => {
    const s = setup();
    await s.campaign(1);
    const gifter = wallet();
    const g = await createFriendGift(s.env, { gifter, amount: '200000' }, s.deps(), null, s.request);
    const dep = '0x' + 'd'.repeat(64);
    s.chain.txs.set(dep, { status: 'success', sender: gifter, recipient: s.treasury, amount: 203000n, memo: giftDepositMemo(g.id) });
    await confirmFriendGift(s.env, { id: g.id, txid: dep }, s.deps(), s.request);
    const unpaid = await createFriendGift(s.env, { gifter: wallet(), amount: '100000' }, s.deps(), null, s.request);
    s.tick(GIFT_EXPIRY_MS + 1);
    expect((await sweepGifts(s.env, s.deps())).did).toBe('expired');
    expect((await sweepGifts(s.env, s.deps())).did).toBe('abandoned');
    expect((await giftStatus(s.env, { id: unpaid.id })).status).toBe('pending-deposit'); // kept: its payment may still come
    expect((await sweepGifts(s.env, s.deps())).did).toBe('deposits-scanned');
    expect((await sweepGifts(s.env, s.deps())).did).toBe('refund-sent');
    expect(decode(s.chain.sent.at(-1)!.raw)).toMatchObject({ recipient: gifter, amount: 200000n });
    expect((await giftStatus(s.env, { id: g.id })).status).toBe('refunding');
    expect((await s.land()).did).toBe('settled');
    expect((await giftStatus(s.env, { id: g.id })).status).toBe('refunded');
  });

  it('a payment that turns up late still counts, and one that matches no waiting gift is kept for a refund', async () => {
    const s = setup();
    const gifter = wallet();
    const g = await createFriendGift(s.env, { gifter, amount: '300000' }, s.deps(), null, s.request);
    s.tick(25 * 3600_000);
    expect((await sweepGifts(s.env, s.deps())).did).toBe('abandoned');
    // paid from a tab left open overnight: found by its memo, and live
    const late = { txid: '0x' + '1'.repeat(64), status: 'success' as const, sender: gifter, recipient: s.treasury, amount: 303000n, memo: giftDepositMemo(g.id) };
    // ...and paid a second time by mistake
    const twice = { ...late, txid: '0x' + '2'.repeat(64) };
    s.chain.inbound = [twice, late];
    s.chain.txs.set(late.txid, late); s.chain.txs.set(twice.txid, twice);
    expect((await sweepGifts(s.env, s.deps())).did).toBe('deposits-scanned');
    expect((await giftStatus(s.env, { id: g.id })).status).toBe('live');
    const orphans = s.db.sql.prepare("SELECT * FROM radio_gift_orphans WHERE status='needs-refund'").all() as any[];
    expect(orphans.map((o) => [o.sender, o.amount])).toEqual([[gifter, 303000]]);
    // a payment listed for refund that later pays for its gift is no longer owed back
    const g2 = await createFriendGift(s.env, { gifter, amount: '300000' }, s.deps(), null, s.request);
    const third = { ...late, txid: '0x' + '3'.repeat(64), memo: giftDepositMemo(g2.id) };
    s.db.sql.prepare("INSERT INTO radio_gift_orphans(txid, gift_id, sender, amount, reason, status, created_at, updated_at) VALUES(?, ?, ?, ?, 'test', 'needs-refund', 0, 0)").run(third.txid, g2.id, gifter, 303000);
    s.chain.txs.set(third.txid, third);
    expect((await confirmFriendGift(s.env, { id: g2.id, txid: third.txid }, s.deps(), s.request)).status).toBe('live');
    expect(s.db.sql.prepare('SELECT status FROM radio_gift_orphans WHERE txid=?').get(third.txid)).toMatchObject({ status: 'resolved' });
    // a read that fails during a scan never lists a payment for refund
    const g3 = await createFriendGift(s.env, { gifter, amount: '300000' }, s.deps(), null, s.request);
    const flaky = { ...late, txid: '0x' + '4'.repeat(64), memo: giftDepositMemo(g3.id) };
    s.chain.inbound = [flaky];
    const realTransfer = s.deps().chain.transfer;
    s.tick(11 * 60_000);
    const failing = { ...s.deps(), chain: { ...s.deps().chain, transfer: async () => { throw new GiftError('Could not check the transaction right now.', 503); } } };
    expect((await sweepGifts(s.env, failing)).did).toBe('deposits-scanned');
    expect(s.db.sql.prepare('SELECT status FROM radio_gift_orphans WHERE txid=?').get(flaky.txid)).toBeUndefined();
    void realTransfer;
    // money held for that refund is not spent on campaign gifts
    s.chain.balances.set(s.treasury, 303000n * 2n + 50_000n);
    const [code] = (await s.campaign(1)).codes;
    await expect(s.claim(code)).rejects.toThrow(/topping up/);
  });

  it('a failed broadcast is recorded, shown to the recipient, and sent again within seconds', async () => {
    const s = setup();
    const [code] = (await s.campaign(1)).codes;
    const w = wallet();
    s.chain.broadcastMode = 'refuse';
    const out = await s.claim(code, w);
    expect(s.chain.sent).toHaveLength(0);
    expect((await giftForWallet(s.env, w)).gift).toMatchObject({ state: 'sending', problem: expect.stringMatching(/Broadcast answered 400|400/) });
    s.tick(RETRY_FAILED_MS + 1);
    expect((await sweepGifts(s.env, s.deps())).did).toBe('rebroadcast');
    expect(s.chain.sent.map((t) => t.txid)).toEqual([out.txid]); // the same bytes, not a new transaction
    expect((await giftForWallet(s.env, w)).gift).toMatchObject({ state: 'sending', problem: null });
    expect((await s.land()).did).toBe('settled');
    expect((await giftForWallet(s.env, w)).gift).toMatchObject({ state: 'arrived' });
  });

  it('broadcasting tries the next Hiro key when one is turned away, but never re-posts after a lost response', async () => {
    const env = { HIRO_API_KEY_1: 'bad', HIRO_API_KEY_2: 'good' } as any;
    const keys: (string | null)[] = [];
    const fetcher = vi.fn(async (url: string, init: RequestInit) => {
      const k = new Headers(init.headers).get('x-hiro-api-key');
      keys.push(k);
      expect(url).toBe('https://api.hiro.so/v2/transactions');
      return k === 'bad' ? new Response('{}', { status: 401 }) : new Response('"0xabc"', { status: 200 });
    });
    vi.stubGlobal('fetch', fetcher);
    try {
      expect(await hiroGiftChain(env).broadcast(new Uint8Array([1, 2, 3]), '0xabc')).toBe('0xabc');
      expect(keys).toEqual(['bad', 'good']);
      fetcher.mockImplementation(async () => new Response(JSON.stringify({ error: 'transaction rejected', reason: 'NotEnoughFunds' }), { status: 400 }));
      await expect(hiroGiftChain(env).broadcast(new Uint8Array([1]), '0x1')).rejects.toThrow(/HTTP 400, NotEnoughFunds/);
      fetcher.mockClear();
      fetcher.mockImplementation(async () => { throw new Error('connection reset'); });
      await expect(hiroGiftChain(env).broadcast(new Uint8Array([1]), '0x1')).rejects.toThrow(/connection reset/);
      expect(fetcher).toHaveBeenCalledTimes(1);
    } finally { vi.unstubAllGlobals(); }
  });
});

describe('song holder lookup', () => {
  const reply = (cv: ReturnType<typeof responseOkCV>) => new Response(JSON.stringify({ okay: true, result: cvToHex(cv) }));
  it('reads who holds a song from the core contract, and says "could not check" when it cannot', async () => {
    const env = { RADIO_GIFT_ENABLED: '1' } as GiftEnv;
    const holder = addr(key());
    const fetcher = vi.fn(async () => reply(responseOkCV(someCV(principalCV(holder)))));
    vi.stubGlobal('fetch', fetcher);
    try {
      expect(await hiroGiftChain(env).ownerOf(2187)).toBe(holder);
      expect(String((fetcher.mock.calls[0] as unknown[])[0])).toContain('/xtrata-v3-2-3/get-owner');
      fetcher.mockImplementation(async () => reply(responseOkCV(noneCV())));
      expect(await hiroGiftChain(env).ownerOf(2187)).toBeNull();
      fetcher.mockImplementation(async () => new Response('nope', { status: 500 }));
      await expect(hiroGiftChain(env).ownerOf(2187)).rejects.toMatchObject({ status: 503 });
    } finally { vi.unstubAllGlobals(); }
  });
});

describe('radio gift players', () => {
  const SONGS = [785, 2186, 2187, 2188];
  const catalogue = (s: ReturnType<typeof setup>, rows: [number, string, string, number, string][] = SONGS.map((n, i) => [n, `Song ${i + 1}`, 'The Artist', 1, 'ready'])) => {
    s.db.sql.exec('CREATE TABLE radio_metadata (token_id INTEGER PRIMARY KEY, title TEXT, artist TEXT, is_song INTEGER, status TEXT)');
    for (const [id, title, artist, isSong, status] of rows) s.db.sql.prepare('INSERT INTO radio_metadata VALUES(?,?,?,?,?)').run(id, title, artist, isSong, status);
  };
  const definition = (over: Partial<PlayerDefinition> = {}): PlayerDefinition => ({ title: 'Proof of Sound', subtitle: 'The Artist', tracks: SONGS, cover: 785, ...over });
  const signed = (s: ReturnType<typeof setup>, def = definition(), k = s.adminKey) => {
    const request: PlayerRequest = { admin: s.admin, hash: playerHash(def), issued: s.now() };
    const signature = signMessageHashRsv({ messageHash: bytesToHex(sha256(encodeStructuredData(playerData(request)))), privateKey: createStacksPrivateKey(k) }).data;
    return { definition: def, request, signature };
  };
  const make = (s: ReturnType<typeof setup>, def = definition(), k = s.adminKey) => createPlayer(s.env, signed(s, def, k), s.deps(), s.request);
  it('the admin signs a definition once; only its hash is signed and the catalogue supplies every title and artist', async () => {
    const s = setup(); catalogue(s);
    const out = await make(s);
    expect(out).toMatchObject({ title: 'Proof of Sound', tracks: 4, existing: false });
    expect(out.id).toMatch(/^[0-9a-f]{16}$/);
    const body = signed(s);
    await expect(createPlayer(s.env, body, s.deps(), s.request)).resolves.toMatchObject({ id: out.id, existing: true });
    const { playerView } = await import('../radio-gifts');
    expect(await playerView(s.env, out.id)).toEqual({
      id: out.id, title: 'Proof of Sound', subtitle: 'The Artist', cover: 785, paidOnly: true,
      tracks: SONGS.map((id, i) => ({ id, title: `Song ${i + 1}`, artist: 'The Artist' }))
    });
  });

  it('several admins: each can make albums from the songs it holds, and a stranger still cannot', async () => {
    const second = key();
    const s = setup(); catalogue(s);
    s.env.RADIO_GIFT_ADMIN = `${s.admin}, ${addr(second)}`;
    expect(giftsConfig(s.env, addr(second), s.request).admin).toBe(true);
    expect(giftsConfig(s.env, s.admin, s.request).admin).toBe(true);
    expect(giftsConfig(s.env, wallet(), s.request).admin).toBe(false);
    for (const id of SONGS) s.chain.owners.set(id, addr(second)); // the second admin holds the songs
    await expect(make(s)).rejects.toMatchObject({ status: 403, message: /not in this wallet/ }); // the first admin does not
    await expect(make(s, definition(), second)).rejects.toMatchObject({ status: 403 }); // signed by the second key but names the first admin
    const out = await createPlayer(s.env, (() => {
      const request: PlayerRequest = { admin: addr(second), hash: playerHash(definition()), issued: s.now() };
      const signature = signMessageHashRsv({ messageHash: bytesToHex(sha256(encodeStructuredData(playerData(request)))), privateKey: createStacksPrivateKey(second) }).data;
      return { definition: definition(), request, signature };
    })(), s.deps(), s.request);
    expect(out).toMatchObject({ existing: false });
    await expect(make(s, definition({ title: 'Other' }), key())).rejects.toMatchObject({ status: 403 });
  });

  it('lists admins by commas or spaces and ignores anything that is not an address', () => {
    const real = 'SP3JB6BCKV14CG25NF017CR7KRVSM8RAGHB52DWHX';
    expect(adminAddresses({ RADIO_GIFT_ADMIN: `${real},  nonsense ; ${real} ${wallet()}` } as GiftEnv)).toHaveLength(2);
    expect(adminAddresses({ RADIO_GIFT_ADMIN: real } as GiftEnv)).toEqual([real]);
    expect(adminAddresses({} as GiftEnv)).toEqual([]);
  });

  it('an album never stops working: selling a song afterwards changes nothing for the album or its links', async () => {
    const s = setup(); catalogue(s);
    const out = await make(s);
    const { codes } = await s.campaign(1, '100000', { player: out.id });
    for (const id of SONGS) s.chain.owners.set(id, wallet()); // every song is sold to someone else
    const { playerView } = await import('../radio-gifts');
    expect((await playerView(s.env, out.id))?.tracks).toHaveLength(4);
    s.tick(1000);
    expect(await giftStatus(s.env, { code: codes[0] })).toMatchObject({ status: 'live', player: { id: out.id } });
    s.chain.ownerError = true; // and a chain outage never touches an existing album
    expect((await playerView(s.env, out.id))?.tracks).toHaveLength(4);
  });

  it('only the wallet that owns every song can make its album', async () => {
    const s = setup(); catalogue(s);
    const other = key();
    s.chain.owners.set(2187, addr(other)); // one song belongs to someone else
    await expect(make(s)).rejects.toMatchObject({ status: 403, message: /Song #2187 is not in this wallet/ });
    s.chain.owners.set(2187, 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.some-market'); // listed in a contract
    await expect(make(s)).rejects.toMatchObject({ status: 403, message: /held by a contract/ });
    s.chain.owners.set(2187, null); // nobody holds it
    await expect(make(s)).rejects.toMatchObject({ status: 403 });
    await ensureGiftTables(s.env);
    expect(s.db.sql.prepare('SELECT * FROM radio_gift_players').all()).toHaveLength(0);
    s.chain.owners.delete(2187); // back in the admin's wallet
    await expect(make(s)).resolves.toMatchObject({ existing: false });
  });

  it('a chain that cannot say who owns a song is "try again", never "allowed"', async () => {
    const s = setup(); catalogue(s);
    s.chain.ownerError = true;
    await expect(make(s)).rejects.toMatchObject({ status: 503 });
    await ensureGiftTables(s.env);
    expect(s.db.sql.prepare('SELECT * FROM radio_gift_players').all()).toHaveLength(0);
  });

  it('reads a holder out of a contract reply', () => {
    expect(principalIn({ type: '(response (optional principal) UnknownType)', value: { type: '(optional principal)', value: { type: 'principal', value: 'SP123' } } })).toBe('SP123');
    expect(principalIn({ type: '(response (optional none) UnknownType)', value: { type: '(optional none)', value: null } })).toBeNull();
    expect(principalIn({ type: 'uint', value: '5' })).toBeUndefined();
  });

  it('refuses anyone but the admin, a signature for a different definition, a stale request and a replay', async () => {
    const s = setup(); catalogue(s);
    await expect(make(s, definition(), key())).rejects.toMatchObject({ status: 403 });
    const body = signed(s);
    await expect(createPlayer(s.env, { ...body, definition: definition({ title: 'Something else' }) }, s.deps(), s.request)).rejects.toMatchObject({ status: 400 });
    await expect(createPlayer(s.env, { ...body, definition: definition({ tracks: [785, 2186] }) }, s.deps(), s.request)).rejects.toMatchObject({ status: 400 });
    const stale = signed(s);
    s.tick(16 * 60_000);
    await expect(createPlayer(s.env, stale, s.deps(), s.request)).rejects.toMatchObject({ status: 400 });
    await ensureGiftTables(s.env);
    expect(s.db.sql.prepare('SELECT * FROM radio_gift_players').all()).toHaveLength(0);
  });

  it('only songs already in the radio catalogue can be in a player', async () => {
    const s = setup();
    catalogue(s, [[785, 'A', 'X', 1, 'ready'], [2186, 'B', 'X', 0, 'ready'], [2187, 'C', 'X', 1, 'failed']]);
    await expect(make(s, definition({ tracks: [785, 2186], cover: null }))).rejects.toThrow(/Song #2186/);
    await expect(make(s, definition({ tracks: [785, 2187], cover: null }))).rejects.toThrow(/Song #2187/);
    await expect(make(s, definition({ tracks: [785, 99999], cover: null }))).rejects.toThrow(/Song #99999/);
    // the cover is any inscription, not necessarily a song
    await expect(make(s, definition({ tracks: [785], cover: 4242 }))).resolves.toMatchObject({ tracks: 1 });
    await expect(make(s, definition({ tracks: [785], cover: null }))).resolves.toMatchObject({ tracks: 1 });
  });

  it('rejects bad definitions before touching the catalogue', async () => {
    const s = setup(); catalogue(s);
    for (const bad of [
      definition({ title: '' }), definition({ title: 'x'.repeat(61) }), definition({ title: '<b>hi</b>' }), definition({ subtitle: 'line\nbreak' }),
      definition({ tracks: [] }), definition({ tracks: [785, 785] }), definition({ tracks: Array.from({ length: 41 }, (_, i) => i + 1) }),
      definition({ tracks: [0] }), definition({ tracks: [1.5] }), definition({ cover: -1 })
    ]) await expect(make(s, bad)).rejects.toMatchObject({ status: 400 });
  });

  it('a link opens its player, and a link without one is what it always was', async () => {
    const s = setup(); catalogue(s);
    const { id } = await make(s);
    const { codes } = await s.campaign(1, '100000', { player: id });
    expect(await giftStatus(s.env, { code: codes[0] })).toMatchObject({ status: 'live', player: { id, title: 'Proof of Sound', paidOnly: true } });
    const plain = await s.campaign(1);
    expect((await giftStatus(s.env, { code: plain.codes[0] })).player).toBeUndefined();
  });

  it('a claimed gift tells the wallet its player and where the gift money came from', async () => {
    const s = setup(); catalogue(s);
    const { id } = await make(s);
    const [code] = (await s.campaign(1, '100000', { player: id })).codes;
    const w = wallet();
    await s.claim(code, w);
    await s.land();
    const f = (await giftForWallet(s.env, w)).gift as any;
    expect(f).toMatchObject({ state: 'arrived', treasury: s.treasury, returnTo: s.treasury, player: { id, tracks: expect.any(Array) } });
    expect(f.player.tracks).toHaveLength(4);
  });

  it('a song that later leaves the catalogue is dropped from the player instead of failing it', async () => {
    const s = setup(); catalogue(s);
    const { id } = await make(s);
    s.db.sql.prepare("UPDATE radio_metadata SET status='failed' WHERE token_id=2187").run();
    const { playerView } = await import('../radio-gifts');
    expect((await playerView(s.env, id))!.tracks.map((t) => t.id)).toEqual([785, 2186, 2188]);
  });
  describe('albums in numbered wallets (one passkey, many wallets)', () => {
    const PRF = Uint8Array.from({ length: 32 }, (_, i) => i + 7);
    const passkey = async () => {
      const base = await listeningBase(PRF);
      const root = await deriveSlotIdentity(base, 0);
      const proof = async (slot: number, issued: number, over: Partial<{ root: string; address: string; signer: string }> = {}) => {
        const id = await deriveSlotIdentity(base, slot);
        const b = { root: over.root ?? root.address, slot, address: over.address ?? id.address, issued };
        return { id, binding: { ...b, rootSignature: signSlotBinding(b, root.privateKey), slotSignature: signSlotBinding(b, over.signer ?? id.privateKey) } };
      };
      return { root, proof };
    };
    const album = async (s: ReturnType<typeof setup>, n = 1) => {
      catalogue(s);
      const { id } = await make(s);
      return (await s.campaign(n, '100000', { player: id, label: 'Gift Edition' })).codes;
    };
    const claimInto = (s: ReturnType<typeof setup>, code: string, p: { id: { address: string }; binding: any }) =>
      claimGift(s.env, { code, wallet: p.id.address, binding: p.binding }, s.deps(), null, s.request);

    it('an album goes into the next numbered wallet with a binding signed by both keys, and the shelf lists it', async () => {
      const s = setup(); const codes = await album(s, 3);
      const { root, proof } = await passkey();
      expect(await nextSlot(s.env, root.address)).toEqual({ next: 1 });
      const a = await proof(1, s.now());
      const out = await claimInto(s, codes[0], a);
      expect(out.already).toBe(false);
      expect(decode(s.chain.sent[0].raw)).toMatchObject({ recipient: a.id.address, amount: 100000n });
      expect(await nextSlot(s.env, root.address)).toEqual({ next: 2 });
      await s.land();
      s.tick(1_000);
      const b = await proof(2, s.now());
      await claimInto(s, codes[1], b); await s.land();
      const page = await shelfFor(s.env, root.address);
      expect(page).toMatchObject({ total: 2, next: null });
      expect(page.shelf.map((x) => [x.slot, x.address, x.state])).toEqual([[1, a.id.address, 'arrived'], [2, b.id.address, 'arrived']]);
      expect(page.shelf[0].player).toMatchObject({ title: 'Proof of Sound' });
      // each numbered wallet is its own gift record, and the binding is stored for credit
      expect((await giftForWallet(s.env, b.id.address)).gift).toMatchObject({ player: { title: 'Proof of Sound' } });
      expect(s.db.sql.prepare('SELECT address, root, slot FROM radio_listening_slots ORDER BY slot').all()).toEqual([
        { address: a.id.address, root: root.address, slot: 1 }, { address: b.id.address, root: root.address, slot: 2 }]);
      // repeating the same claim is the same gift, not another
      expect(await claimInto(s, codes[0], a)).toMatchObject({ already: true });
    });

    it('pages the shelf for a large collection', async () => {
      const s = setup(); await album(s, 1);
      const { root } = await passkey();
      const insert = s.db.sql.prepare("INSERT INTO radio_gifts(id, code_hash, amount, source, label, status, created_at, expires_at, claimed_by, claim_txid, claimed_at, updated_at, root, slot) VALUES(?, ?, 100000, 'campaign', '', 'claimed', 1, 2, ?, ?, 1, 1, ?, ?)");
      for (let n = 1; n <= 130; n++) insert.run('g' + n, 'h' + n, 'w' + n, 't' + n, root.address, n);
      const first = await shelfFor(s.env, root.address, 0, 50);
      expect(first).toMatchObject({ total: 130, next: 50 });
      expect(first.shelf).toHaveLength(50);
      const last = await shelfFor(s.env, root.address, 100, 50);
      expect(last.shelf.map((x) => x.slot)).toEqual(Array.from({ length: 30 }, (_, i) => 101 + i));
      expect(last.next).toBeNull();
      expect((await shelfFor(s.env, root.address, 0, 9999)).shelf).toHaveLength(100); // never more than 100 a page
      expect(await nextSlot(s.env, root.address)).toEqual({ next: 131 });
      await expect(shelfFor(s.env, 'nope')).rejects.toMatchObject({ status: 400 });
    });

    it('refuses a binding that is not signed by both keys, is for another wallet or number, or is stale', async () => {
      const s = setup(); const codes = await album(s, 4);
      const { root, proof } = await passkey();
      const stranger = key();
      const wrongSlotKey = await proof(1, s.now(), { signer: stranger });
      await expect(claimInto(s, codes[0], wrongSlotKey)).rejects.toThrow(/not proven to belong/);
      const forged = await proof(1, s.now(), { address: wallet() }); // an address the passkey does not derive: the slot key cannot have signed it
      await expect(claimInto(s, codes[0], forged)).rejects.toThrow(/not proven to belong/);
      const other = await proof(2, s.now());
      await expect(claimGift(s.env, { code: codes[0], wallet: wallet(), binding: other.binding }, s.deps(), null, s.request)).rejects.toThrow(/different wallet/);
      const stale = await proof(3, s.now() - 16 * 60_000);
      await expect(claimInto(s, codes[0], stale)).rejects.toThrow(/expired/);
      const rootAsSlot = await proof(1, s.now());
      await expect(claimInto(s, codes[0], { ...rootAsSlot, binding: { ...rootAsSlot.binding, slot: 0 } })).rejects.toThrow();
      expect(s.chain.sent).toHaveLength(0);
      expect(sends(s)).toHaveLength(0);
      expect(await nextSlot(s.env, root.address)).toEqual({ next: 1 });
    });

    it('a starter gift (no album) goes only to the listener’s own wallet, never a numbered one', async () => {
      const s = setup();
      const [code] = (await s.campaign(1)).codes;
      const { proof } = await passkey();
      await expect(claimInto(s, code, await proof(1, s.now()))).rejects.toThrow(/starter gift/);
      expect(s.chain.sent).toHaveLength(0);
    });

    it('a number is used once per passkey: a second gift for it is refused, while another passkey can use the same number', async () => {
      const s = setup(); const codes = await album(s, 3);
      const { proof } = await passkey();
      const one = await proof(1, s.now());
      await claimInto(s, codes[0], one);
      await s.land();
      s.tick(1_000);
      await expect(claimInto(s, codes[1], await proof(1, s.now()))).rejects.toMatchObject({ status: 409, message: expect.stringMatching(/just taken/) });
      // another passkey can use number 1 for itself
      const otherPrf = Uint8Array.from({ length: 32 }, (_, i) => 200 - i);
      const base = await listeningBase(otherPrf), root = await deriveSlotIdentity(base, 0), id = await deriveSlotIdentity(base, 1);
      const b = { root: root.address, slot: 1, address: id.address, issued: s.now() };
      await expect(claimInto(s, codes[1], { id, binding: { ...b, rootSignature: signSlotBinding(b, root.privateKey), slotSignature: signSlotBinding(b, id.privateKey) } })).resolves.toMatchObject({ already: false });
    });

  describe('prefunded batches (the creator pays for every copy up front)', () => {
    const PRF = Uint8Array.from({ length: 32 }, (_, i) => i + 11);
    type S = ReturnType<typeof setup>;
    const req = (s: S, over: Partial<BatchRequest> = {}): BatchRequest => ({ creator: s.admin, count: 3, amount: '123000', label: 'Opera launch', issued: s.now(), ...over });
    const sig = (r: BatchRequest, k: string) => signMessageHashRsv({ messageHash: batchRequestHash(r), privateKey: createStacksPrivateKey(k) }).data;
    const fund = (s: S, over: Partial<BatchRequest> = {}, k = s.adminKey) => { const r = req(s, over); return createBatch(s.env, { request: r, signature: sig(r, k) }, s.deps(), s.request); };
    let n = 0;
    /** The creator's deposit as the chain would show it. */
    const pay = (s: S, made: { deposit: string; memo: string }, over: Partial<ChainTransfer> = {}) => {
      const txid = '0x' + (++n).toString(16).padStart(64, 'e');
      s.chain.txs.set(txid, { status: 'success', sender: s.admin, recipient: s.treasury, amount: BigInt(made.deposit), memo: made.memo, ...over });
      return txid;
    };
    const live = async (s: S, over: Partial<BatchRequest> = {}) => {
      const made = await fund(s, over);
      await confirmBatch(s.env, { id: made.id, txid: pay(s, made) }, s.deps(), s.request);
      return made;
    };
    const rowsOf = (s: S, id: string) => s.db.sql.prepare('SELECT status, gifter, amount, expires_at AS expires FROM radio_gifts WHERE batch_id=?').all(id) as { status: string; gifter: string; amount: number; expires: number }[];

    it('a batch is dormant until its ONE deposit confirms, then every copy goes live together', async () => {
      const s = setup();
      const made = await fund(s);
      expect(made).toMatchObject({ count: 3, amount: '123000', depositTo: s.treasury, deposit: String(batchDeposit(3, 123000n)), memo: `batch ${made.id}` });
      expect(made.codes).toHaveLength(3);
      expect(new Set(made.codes).size).toBe(3);
      expect(rowsOf(s, made.id).map((r) => r.status)).toEqual(['pending-deposit', 'pending-deposit', 'pending-deposit']);
      await expect(s.claim(made.codes[0])).rejects.toThrow(/not paid for yet/);
      expect(await batchStatus(s.env, made.id)).toMatchObject({ status: 'pending-deposit', copies: { waiting: 0, claimed: 0 } });
      s.tick(5_000);
      const view = await confirmBatch(s.env, { id: made.id, txid: pay(s, made) }, s.deps(), s.request);
      expect(view).toMatchObject({ status: 'live', copies: { waiting: 3, claiming: 0, claimed: 0 }, expires: s.now() + GIFT_EXPIRY_MS });
      expect(rowsOf(s, made.id)).toEqual(Array(3).fill({ status: 'live', gifter: s.admin, amount: 123000, expires: s.now() + GIFT_EXPIRY_MS }));
      // the recipient sees who paid
      expect(await giftStatus(s.env, { code: made.codes[1] })).toMatchObject({ status: 'live', from: s.admin, source: 'friend', amount: '123000', label: 'Opera launch' });
    });

    it('only a gift admin can fund a batch, with their own signature, once per signed request', async () => {
      const s = setup();
      const stranger = key();
      const mine = req(s);
      await expect(createBatch(s.env, { request: mine, signature: sig(mine, stranger) }, s.deps(), s.request)).rejects.toMatchObject({ status: 403 });
      const theirs = req(s, { creator: addr(stranger) });
      await expect(createBatch(s.env, { request: theirs, signature: sig(theirs, stranger) }, s.deps(), s.request)).rejects.toMatchObject({ status: 403 }); // signed by themselves, but not an admin
      const bad = { ...mine, count: 4 }; // signed for 3, asks for 4
      await expect(createBatch(s.env, { request: bad, signature: sig(mine, s.adminKey) }, s.deps(), s.request)).rejects.toMatchObject({ status: 403 });
      await expect(createBatch(s.env, { request: { ...mine, issued: s.now() - 16 * 60_000 }, signature: 'x' }, s.deps(), s.request)).rejects.toMatchObject({ status: 400, message: expect.stringMatching(/expired/) });
      await expect(createBatch(s.env, { request: req(s, { creator: s.treasury }), signature: 'x' }, s.deps(), s.request)).rejects.toMatchObject({ status: 400 });
      await ensureGiftTables(s.env); // nothing has created the tables yet: every attempt above was refused first
      expect(s.db.sql.prepare('SELECT COUNT(*) AS n FROM radio_gift_batches').get()).toEqual({ n: 0 });
      const ok = await createBatch(s.env, { request: mine, signature: sig(mine, s.adminKey) }, s.deps(), s.request);
      expect(ok.codes).toHaveLength(3);
      await expect(createBatch(s.env, { request: mine, signature: sig(mine, s.adminKey) }, s.deps(), s.request)).rejects.toMatchObject({ status: 409, message: expect.stringMatching(/already used/) });
      expect(s.db.sql.prepare('SELECT COUNT(*) AS n FROM radio_gifts WHERE batch_id IS NOT NULL').get()).toEqual({ n: 3 }); // the replay left nothing behind
    });

    it('limits the size, the amount and the label of a batch', async () => {
      const s = setup();
      for (const over of [{ count: 0 }, { count: 101 }, { amount: '99999' }, { amount: '1000001' }, { label: 'é' }, { player: 'nope' }] as Partial<BatchRequest>[])
        await expect(fund(s, over)).rejects.toMatchObject({ status: 400 });
      await expect(fund(s, { count: 100, amount: '100000' })).resolves.toMatchObject({ count: 100 });
      expect(s.db.sql.prepare('SELECT COUNT(*) AS n FROM radio_gifts WHERE batch_id IS NOT NULL').get()).toEqual({ n: 100 }); // 100 copies, one transaction
    });

    it('an album’s copies can only be funded by the wallet that made the album', async () => {
      const s = setup(); catalogue(s);
      const second = key();
      s.env.RADIO_GIFT_ADMIN = `${s.admin}, ${addr(second)}`;
      const { id } = await make(s);
      await expect(fund(s, { creator: addr(second), player: id }, second)).rejects.toMatchObject({ status: 403, message: expect.stringMatching(/made an album/) });
      await expect(fund(s, { player: '0'.repeat(16) })).rejects.toMatchObject({ status: 400, message: expect.stringMatching(/does not exist/) });
      const made = await fund(s, { player: id });
      expect(s.db.sql.prepare('SELECT DISTINCT player_id FROM radio_gifts WHERE batch_id=?').all(made.id)).toEqual([{ player_id: id }]);
    });

    it('the wrong sender, amount or memo never makes a batch live, and a payment cannot fund two batches', async () => {
      const s = setup();
      const a = await fund(s, { label: 'a' }), b = await fund(s, { label: 'b' });
      const confirm = (id: string, txid: string) => confirmBatch(s.env, { id, txid }, s.deps(), s.request);
      await expect(confirm(a.id, pay(s, a, { sender: wallet() }))).rejects.toMatchObject({ status: 400 });          // someone else paid
      await expect(confirm(a.id, pay(s, a, { amount: BigInt(a.deposit) - 1n }))).rejects.toMatchObject({ status: 400 }); // one microSTX short
      await expect(confirm(a.id, pay(s, a, { amount: BigInt(a.deposit) + 1n }))).rejects.toMatchObject({ status: 400 }); // or over
      await expect(confirm(a.id, pay(s, a, { memo: 'batch ' + '0'.repeat(16) }))).rejects.toMatchObject({ status: 400 });  // another batch's memo
      await expect(confirm(a.id, pay(s, a, { recipient: wallet() }))).rejects.toMatchObject({ status: 400 });      // not to the treasury
      await expect(confirm(a.id, pay(s, a, { status: 'aborted' }))).rejects.toMatchObject({ status: 400, message: expect.stringMatching(/did not go through/) });
      expect(rowsOf(s, a.id).every((r) => r.status === 'pending-deposit')).toBe(true);
      const good = pay(s, a);
      await expect(confirm(b.id, good)).rejects.toMatchObject({ status: 400 }); // a's payment carries a's memo: b cannot use it
      expect((await confirm(a.id, good)).status).toBe('live');
      expect(rowsOf(s, b.id).every((r) => r.status === 'pending-deposit')).toBe(true);
      await expect(confirm(a.id, 'nonsense')).rejects.toMatchObject({ status: 400 });
      await expect(confirmBatch(s.env, { id: 'ffffffffffffffff' }, s.deps(), s.request)).rejects.toMatchObject({ status: 404 });
    });

    it('a payment still confirming keeps the batch dormant, and counts once it lands', async () => {
      const s = setup();
      const made = await fund(s);
      const txid = pay(s, made, { status: 'pending' });
      expect((await confirmBatch(s.env, { id: made.id, txid }, s.deps(), s.request)).status).toBe('pending-deposit');
      expect(rowsOf(s, made.id).every((r) => r.status === 'pending-deposit')).toBe(true);
      s.chain.txs.set(txid, { ...s.chain.txs.get(txid)!, status: 'success' });
      expect((await confirmBatch(s.env, { id: made.id }, s.deps(), s.request)).status).toBe('live'); // no txid needed once it is remembered
    });

    it('finds a deposit the wallet never reported, by its memo', async () => {
      const s = setup();
      const made = await fund(s);
      s.chain.inbound.push({ txid: '0x' + 'a'.repeat(64), status: 'success', sender: s.admin, recipient: s.treasury, amount: BigInt(made.deposit), memo: made.memo });
      expect((await confirmBatch(s.env, { id: made.id }, s.deps(), s.request)).status).toBe('live');
    });

    it('the periodic scan makes a paid batch live, and keeps a payment that belongs to no waiting batch for a refund', async () => {
      const s = setup();
      const made = await fund(s);
      const stray = '0x' + 'b'.repeat(64), unknown = '0x' + 'c'.repeat(64), twice = '0x' + 'd'.repeat(64);
      s.chain.inbound.push(
        { txid: '0x' + 'a'.repeat(64), status: 'success', sender: s.admin, recipient: s.treasury, amount: BigInt(made.deposit), memo: made.memo },
        { txid: stray, status: 'success', sender: s.admin, recipient: s.treasury, amount: 5n, memo: made.memo },                    // right memo, wrong amount
        { txid: unknown, status: 'success', sender: s.admin, recipient: s.treasury, amount: 999n, memo: 'batch ' + '1'.repeat(16) }, // no such batch
        { txid: twice, status: 'success', sender: s.admin, recipient: s.treasury, amount: BigInt(made.deposit), memo: made.memo }  // paid twice
      );
      for (const t of s.chain.inbound) s.chain.txs.set(t.txid, t); // the scan looks each deposit up by txid, as it would on the chain
      expect((await sweepGifts(s.env, s.deps())).did).toBe('deposits-scanned');
      expect((await batchStatus(s.env, made.id)).status).toBe('live');
      const orphans = s.db.sql.prepare("SELECT txid, status FROM radio_gift_orphans WHERE txid<>'scan' ORDER BY txid").all();
      expect(orphans).toEqual([{ txid: stray, status: 'needs-refund' }, { txid: unknown, status: 'needs-refund' }, { txid: twice, status: 'needs-refund' }]);
    });

    it('an unpaid batch is set aside after a day, and a late payment still makes it live', async () => {
      const s = setup();
      const made = await fund(s);
      s.tick(25 * 3600_000);
      expect((await sweepGifts(s.env, s.deps())).did).toBe('abandoned');
      expect(s.db.sql.prepare('SELECT status FROM radio_gift_batches').get()).toEqual({ status: 'abandoned' });
      await expect(s.claim(made.codes[0])).rejects.toThrow(/not paid for yet/); // still nothing to claim
      expect((await confirmBatch(s.env, { id: made.id, txid: pay(s, made) }, s.deps(), s.request)).status).toBe('live');
      expect(rowsOf(s, made.id).every((r) => r.status === 'live')).toBe(true);
      await s.claim(made.codes[0]); // and now it can be claimed
    });

    it('the escrow cap counts live copies and unpaid batches, and an unpaid batch stops counting after a day', async () => {
      const total = batchDeposit(3, 123000n);
      const s = setup({ RADIO_GIFT_ESCROW_CAP: String(total + 1_000n) });
      const first = await fund(s);
      await expect(fund(s, { count: 1, amount: '100000', label: 'second' })).rejects.toMatchObject({ status: 503, message: expect.stringMatching(/full right now/) });
      s.tick(25 * 3600_000);
      await expect(fund(s, { count: 1, amount: '100000', label: 'second' })).resolves.toMatchObject({ count: 1 });
      expect(first.count).toBe(3);
      const t = setup({ RADIO_GIFT_ESCROW_CAP: String(total + 1_000n) });
      await live(t);
      await expect(fund(t, { count: 1, amount: '100000', label: 'second' })).rejects.toMatchObject({ status: 503 }); // paid copies count too
    });

    it('a creator cannot leave piles of unpaid batches waiting', async () => {
      const s = setup();
      for (let i = 0; i < MAX_PENDING_BATCHES; i++) await fund(s, { count: 1, amount: '100000', label: 'b' + i });
      await expect(fund(s, { count: 1, amount: '100000', label: 'one more' })).rejects.toMatchObject({ status: 429 });
    });

    it('a claim is paid from the creator’s money: leftovers return to the creator, and no per-connection limit applies', async () => {
      const s = setup();
      const made = await live(s, { count: 12 });
      for (const code of made.codes.slice(0, 11)) { await s.claim(code, wallet(), '203.0.113.9'); await s.land(); s.tick(1_000); }
      const last = wallet();
      await s.claim(made.codes[11], last, '203.0.113.9'); // a campaign link would have stopped at 10 from one connection
      expect(decode(s.chain.sent.at(-1)!.raw)).toMatchObject({ recipient: last, amount: 123000n, memo: GIFT_MEMO });
      expect((await giftForWallet(s.env, last)).gift).toMatchObject({ returnTo: s.admin, from: s.admin, source: 'friend', amount: '123000' });
      await s.land();
      expect(await batchStatus(s.env, made.id)).toMatchObject({ copies: { waiting: 0, claiming: 0, claimed: 12 } });
    });

    it('the treasury’s own float can no longer be spent by anything but a prefunded copy, and a promo link never spends a creator’s money', async () => {
      const s = setup();
      const made = await live(s, { count: 2 });
      const owed = batchDeposit(2, 123000n);
      s.chain.balances.set(s.treasury, owed + 50_000n); // the creator's money plus a little spare
      const [promo] = (await s.campaign(1)).codes;
      await expect(s.claim(promo)).rejects.toThrow(/topping up/);
      await s.claim(made.codes[0]); // the creator's copy is claimable
    });

    it('unclaimed copies go back to the creator after 30 days in ONE refund; claimed copies are never refunded', async () => {
      const s = setup();
      const made = await live(s, { count: 3 });
      await s.claim(made.codes[0]); await s.land();
      s.tick(GIFT_EXPIRY_MS + 1);
      await expect(s.claim(made.codes[1])).rejects.toMatchObject({ status: 410, message: expect.stringMatching(/expired/) });
      expect((await sweepGifts(s.env, s.deps())).did).toBe('deposits-scanned');
      const sent = await sweepGifts(s.env, s.deps());
      expect(sent).toMatchObject({ did: 'refund-sent', copies: 2 });
      // two copies back to the creator in one transfer: both amounts, plus the sending fee of the second copy (only ONE network fee is spent)
      expect(decode(s.chain.sent.at(-1)!.raw)).toMatchObject({ recipient: s.admin, amount: 2n * 123000n + GIFT_FEE });
      expect(s.chain.sent.filter((x) => decode(x.raw).amount > 200000n)).toHaveLength(1);
      expect(rowsOf(s, made.id).map((r) => r.status).sort()).toEqual(['claimed', 'refunding', 'refunding']);
      expect(await batchStatus(s.env, made.id)).toMatchObject({ copies: { waiting: 0, claimed: 1, refunding: 2, refunded: 0 } });
      expect((await s.land()).did).toBe('settled');
      expect((await sweepGifts(s.env, s.deps())).did).toBe('nothing');
      expect(await batchStatus(s.env, made.id)).toMatchObject({ copies: { waiting: 0, claimed: 1, refunding: 0, refunded: 2 } });
      const refundTx = s.chain.sent.at(-1)!.txid;
      expect(s.db.sql.prepare("SELECT DISTINCT refund_txid FROM radio_gifts WHERE status='refunded'").all()).toEqual([{ refund_txid: refundTx }]);
    });

    it('the treasury keeps exactly what it owes: after a refund it holds no creator money, and it spent one network fee', async () => {
      const s = setup();
      const made = await live(s, { count: 4 });
      const deposit = batchDeposit(4, 123000n);
      s.tick(GIFT_EXPIRY_MS + 1);
      await sweepGifts(s.env, s.deps()); // scan
      await sweepGifts(s.env, s.deps()); // refund
      const out = decode(s.chain.sent.at(-1)!.raw);
      expect(out.amount + out.fee).toBe(deposit); // everything the creator paid comes back except the one network fee
      expect(made.count).toBe(4);
    });

    it('one refund per gifter, and at most REFUND_GROUP_MAX copies in a transfer', async () => {
      const s = setup();
      const second = key();
      s.env.RADIO_GIFT_ADMIN = `${s.admin}, ${addr(second)}`;
      const a = await live(s, { count: REFUND_GROUP_MAX + 5, amount: '100000' });
      const r2 = req(s, { creator: addr(second), count: 2, amount: '100000' });
      const b = await createBatch(s.env, { request: r2, signature: sig(r2, second) }, s.deps(), s.request);
      s.chain.txs.set('0x' + 'b'.repeat(64), { status: 'success', sender: addr(second), recipient: s.treasury, amount: BigInt(b.deposit), memo: b.memo });
      await confirmBatch(s.env, { id: b.id, txid: '0x' + 'b'.repeat(64) }, s.deps(), s.request);
      s.tick(GIFT_EXPIRY_MS + 1);
      await sweepGifts(s.env, s.deps()); // scan
      const seen: { to: string; amount: bigint }[] = [];
      for (let i = 0; i < 6; i++) {
        const r = await sweepGifts(s.env, s.deps());
        if (r.did !== 'refund-sent') break;
        const d = decode(s.chain.sent.at(-1)!.raw); seen.push({ to: d.recipient, amount: d.amount });
        await s.land();
      }
      expect(seen).toHaveLength(3);
      expect(seen.filter((x) => x.to === addr(second))).toEqual([{ to: addr(second), amount: 2n * 100000n + GIFT_FEE }]);
      expect(seen.filter((x) => x.to === s.admin).map((x) => x.amount).sort()).toEqual([5n * 100000n + 4n * GIFT_FEE, BigInt(REFUND_GROUP_MAX) * 100000n + BigInt(REFUND_GROUP_MAX - 1) * GIFT_FEE].sort());
      expect(rowsOf(s, a.id).every((r) => r.status === 'refunded')).toBe(true);
    });

    it('a stuck refund is re-signed with the same nonce and higher fee for EVERY copy it returns, and whichever lands settles all of them', async () => {
      const s = setup();
      const made = await live(s, { count: 3 });
      s.tick(GIFT_EXPIRY_MS + 1);
      await sweepGifts(s.env, s.deps());
      await sweepGifts(s.env, s.deps());
      const first = s.chain.sent.at(-1)!;
      s.tick(BUMP_AFTER_MS + 1);
      expect((await sweepGifts(s.env, s.deps())).did).toBe('bumped');
      const bumped = s.chain.sent.at(-1)!;
      expect(bumped.txid).not.toBe(first.txid);
      expect(decode(bumped.raw)).toMatchObject({ nonce: decode(first.raw).nonce, amount: decode(first.raw).amount, fee: GIFT_FEE * 2n });
      expect(s.db.sql.prepare("SELECT DISTINCT refund_txid FROM radio_gifts WHERE batch_id=? AND status='refunding'").all(made.id)).toEqual([{ refund_txid: bumped.txid }]);
      s.chain.txs.set(first.txid, { status: 'success', sender: s.treasury, recipient: s.admin, amount: decode(first.raw).amount, memo: '' }); // the first one lands after all
      expect((await sweepGifts(s.env, s.deps())).did).toBe('settled');
      expect(rowsOf(s, made.id).every((r) => r.status === 'refunded')).toBe(true);
      expect(s.db.sql.prepare('SELECT DISTINCT refund_txid FROM radio_gifts WHERE batch_id=?').all(made.id)).toEqual([{ refund_txid: first.txid }]);
    });

    it('a refund whose nonce is used without a payment puts EVERY copy back, and it is tried again', async () => {
      const s = setup();
      const made = await live(s, { count: 3 });
      s.tick(GIFT_EXPIRY_MS + 1);
      await sweepGifts(s.env, s.deps());
      await sweepGifts(s.env, s.deps());
      const lost = s.chain.sent.at(-1)!;
      s.chain.txs.set(lost.txid, { status: 'dropped', sender: s.treasury, recipient: s.admin, amount: decode(lost.raw).amount, memo: '' });
      s.chain.executed = decode(lost.raw).nonce;
      expect((await sweepGifts(s.env, s.deps())).did).toBe('nonce-used');
      s.tick(NONCE_SETTLE_MS + 1);
      expect((await sweepGifts(s.env, s.deps())).did).toBe('released');
      expect(rowsOf(s, made.id).map((r) => r.status)).toEqual(['live', 'live', 'live']);
      expect(s.db.sql.prepare('SELECT COUNT(*) AS n FROM radio_gifts WHERE refund_txid IS NOT NULL').get()).toEqual({ n: 0 });
      s.chain.mempoolNonce = decode(lost.raw).nonce + 1n; // and the next sweep sends them again
      expect((await sweepGifts(s.env, s.deps())).did).toBe('refund-sent');
      expect(decode(s.chain.sent.at(-1)!.raw).amount).toBe(3n * 123000n + 2n * GIFT_FEE);
    });

    it('a refund is never recorded half-way: if one copy stopped being live, no copy is touched and no send exists', async () => {
      const s = setup();
      const made = await live(s, { count: 3 });
      s.tick(GIFT_EXPIRY_MS + 1);
      await sweepGifts(s.env, s.deps());
      // The sweep reads the expired copies, then one of them is claimed by a racing request before the refund is written.
      let raced = false;
      s.db.onPrepare = (sql: string) => { if (!raced && /status='refunding', refund_txid/.test(sql)) { raced = true; s.db.sql.prepare("UPDATE radio_gifts SET status='claimed' WHERE batch_id=? AND id=(SELECT id FROM radio_gifts WHERE batch_id=? ORDER BY id LIMIT 1)").run(made.id, made.id); } };
      const r = await sweepGifts(s.env, s.deps());
      expect(r.did).toBe('refund-later');
      expect(s.db.sql.prepare("SELECT COUNT(*) AS n FROM radio_gift_sends WHERE kind='refund'").get()).toEqual({ n: 0 });
      expect(rowsOf(s, made.id).map((x) => x.status).sort()).toEqual(['claimed', 'live', 'live']);
      s.db.onPrepare = undefined;
      expect(s.db.sql.prepare("SELECT COUNT(*) AS n FROM radio_gifts WHERE status='refunding' OR refund_txid IS NOT NULL").get()).toEqual({ n: 0 });
      // the next sweep returns the two that are still waiting
      expect(await sweepGifts(s.env, s.deps())).toMatchObject({ did: 'refund-sent', copies: 2 });
    });

    it('shouts when the treasury holds less than it owes, and stays quiet when it holds enough', async () => {
      const s = setup();
      await live(s, { count: 2 });
      const alarm = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      s.chain.balances.set(s.treasury, batchDeposit(2, 123000n) - 1n);
      expect((await sweepGifts(s.env, s.deps())).did).toBe('deposits-scanned');
      expect(alarm).toHaveBeenCalledWith(expect.stringContaining('under-collateralised'), expect.objectContaining({ owed: String(batchDeposit(2, 123000n)) }));
      alarm.mockClear(); s.tick(11 * 60_000);
      s.chain.balances.set(s.treasury, batchDeposit(2, 123000n));
      await sweepGifts(s.env, s.deps());
      expect(alarm).not.toHaveBeenCalled();
      alarm.mockRestore();
    });

    it('lists a creator’s batches with where each copy stands, and never shows a code', async () => {
      const s = setup();
      const a = await live(s, { label: 'one' });
      await fund(s, { label: 'two', count: 1 });
      const { batches } = await batchesFor(s.env, s.admin);
      expect(batches.map((b) => [b.label, b.status, b.count])).toEqual(expect.arrayContaining([['one', 'live', 3], ['two', 'pending-deposit', 1]]));
      expect(JSON.stringify(batches)).not.toMatch(new RegExp(a.codes.join('|')));
      expect(await batchesFor(s.env, wallet())).toEqual({ batches: [] });
      await expect(batchesFor(s.env, 'nonsense')).rejects.toMatchObject({ status: 400 });
    });

    it('an album copy goes into a numbered wallet, opens its album, and its leftovers return to the creator', async () => {
      const s = setup(); catalogue(s);
      const { id } = await make(s);
      const made = await live(s, { player: id, amount: '123000' });
      const base = await listeningBase(PRF);
      const root = await deriveSlotIdentity(base, 0), slot = await deriveSlotIdentity(base, 1);
      const b = { root: root.address, slot: 1, address: slot.address, issued: s.now() };
      const binding = { ...b, rootSignature: signSlotBinding(b, root.privateKey), slotSignature: signSlotBinding(b, slot.privateKey) };
      await claimGift(s.env, { code: made.codes[0], wallet: slot.address, binding }, s.deps(), null, s.request);
      expect(decode(s.chain.sent.at(-1)!.raw)).toMatchObject({ recipient: slot.address, amount: 123000n });
      await s.land();
      expect((await giftForWallet(s.env, slot.address)).gift).toMatchObject({ returnTo: s.admin, player: { title: 'Proof of Sound' } });
      expect((await shelfFor(s.env, root.address)).shelf[0]).toMatchObject({ slot: 1, address: slot.address, from: s.admin, state: 'arrived' });
    });

    it('everything the older routes did still works beside it: friend gifts and campaign links', async () => {
      const s = setup();
      const gifter = wallet();
      const g = await createFriendGift(s.env, { gifter, amount: '200000' }, s.deps(), null, s.request);
      const dep = '0x' + 'f'.repeat(64);
      s.chain.txs.set(dep, { status: 'success', sender: gifter, recipient: s.treasury, amount: 203000n, memo: giftDepositMemo(g.id) });
      await confirmFriendGift(s.env, { id: g.id, txid: dep }, s.deps(), s.request);
      const made = await live(s);
      await s.claim(g.code); await s.land();
      await s.claim(made.codes[0]); await s.land();
      const [code] = (await s.campaign(1)).codes;
      await s.claim(code);
    });

    describe('the scheduled sweep', () => {
      const SECRET = 's3cret-'.repeat(5);
      it('refunds an expired batch with nobody visiting any page, then idles', async () => {
        const s = setup();
        const made = await live(s, { count: 3 });
        s.tick(GIFT_EXPIRY_MS + 1);
        const first = await runSweep(s.env, s.deps());
        expect(first.steps).toEqual(['deposits-scanned', 'refund-sent', 'pending']); // scan, one refund for all three, then wait for the chain
        await s.land();
        expect((await runSweep(s.env, s.deps())).steps).toEqual(['nothing']);
        expect(rowsOf(s, made.id).every((r) => r.status === 'refunded')).toBe(true);
      });

      it('never loops forever: it stops after maxSteps even when every step does something', async () => {
        const s = setup();
        for (let i = 0; i < 3; i++) await fund(s, { count: 1, amount: '100000', label: 'b' + i });
        s.tick(25 * 3600_000);
        const r = await runSweep(s.env, s.deps(), 2);
        expect(r.steps.length).toBeLessThanOrEqual(2);
      });

      it('does nothing at all while gifts are switched off', async () => {
        const s = setup({ RADIO_GIFT_ENABLED: '0' });
        expect((await runSweep(s.env, s.deps())).steps).toEqual(['off']);
      });

      it('looks for deposits every minute while a payment is expected, and every ten minutes otherwise', async () => {
        const s = setup();
        expect((await sweepGifts(s.env, s.deps())).did).toBe('deposits-scanned');
        s.tick(SCAN_WHILE_EXPECTING_MS + 1);
        expect((await sweepGifts(s.env, s.deps())).did).toBe('nothing'); // nobody is expected to pay: not yet
        s.tick(SCAN_EVERY_MS);
        expect((await sweepGifts(s.env, s.deps())).did).toBe('deposits-scanned');
        const made = await fund(s); // now a creator has been asked to pay
        s.tick(SCAN_WHILE_EXPECTING_MS + 1);
        s.chain.inbound.push({ txid: '0x' + 'a'.repeat(64), status: 'success', sender: s.admin, recipient: s.treasury, amount: BigInt(made.deposit), memo: made.memo });
        s.chain.txs.set('0x' + 'a'.repeat(64), s.chain.inbound[0]);
        expect((await sweepGifts(s.env, s.deps())).did).toBe('deposits-scanned');
        expect((await batchStatus(s.env, made.id)).status).toBe('live'); // found by the sweep within a minute, with no page open
      });

      it('accepts only the exact long secret', () => {
        const env = { RADIO_GIFT_SWEEP_SECRET: SECRET } as GiftEnv;
        expect(sweepAuthorised(env, `Bearer ${SECRET}`)).toBe(true);
        expect(sweepAuthorised(env, SECRET)).toBe(true);
        for (const bad of [null, '', 'Bearer', `Bearer ${SECRET}x`, `Bearer ${SECRET.slice(1)}`, 'Bearer wrong']) expect(sweepAuthorised(env, bad)).toBe(false);
        expect(sweepAuthorised({} as GiftEnv, `Bearer ${SECRET}`)).toBe(false);
        expect(sweepAuthorised({ RADIO_GIFT_SWEEP_SECRET: 'short' } as GiftEnv, 'Bearer short')).toBe(false); // too short to be a secret
      });
    });
  });
  });
});
