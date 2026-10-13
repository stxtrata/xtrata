// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import {
  createStacksPrivateKey, cvToString, deserializeTransaction, encodeStructuredData, getAddressFromPrivateKey, makeRandomPrivKey,
  privateKeyToString, signMessageHashRsv, TransactionVersion
} from '@stacks/transactions';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';
import {
  BUMP_AFTER_MS, claimGift, hiroGiftChain, RETRY_FAILED_MS, CLAIMS_PER_IP, confirmFriendGift, createCampaign, createFriendGift, GiftError, giftForWallet, giftsConfig,
  giftStatus, NONCE_SETTLE_MS, REBROADCAST_MS, sweepGifts, type ChainTransfer, type GiftChain, type GiftEnv
} from '../radio-gifts';
import { campaignData, GIFT_EXPIRY_MS, GIFT_FEE, GIFT_MEMO, giftCodeHash, giftDepositMemo, type CampaignRequest } from '../../../src/lib/listening-wallet/gifts';
const { DatabaseSync } = createRequire(import.meta.url)('node:sqlite');

function database() {
  const sql = new DatabaseSync(':memory:');
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
  // D1 batches are transactions: all or nothing.
  const batch = async (list: any[]) => {
    sql.exec('BEGIN');
    try { const out = []; for (const st of list) out.push(await st.run()); sql.exec('COMMIT'); return out; }
    catch (e) { sql.exec('ROLLBACK'); throw e; }
  };
  return { sql, prepare: statement, batch };
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
    inbound: async () => chain.inbound
  };
  let now = T0;
  const deps = () => ({ chain: fake, now, human: async () => true });
  const sign = (req: CampaignRequest, k = adminKey) => signMessageHashRsv({ messageHash: bytesToHex(sha256(encodeStructuredData(campaignData(req)))), privateKey: createStacksPrivateKey(k) }).data;
  const campaign = async (count = 2, amount = '100000', k = adminKey) => {
    const req: CampaignRequest = { admin: addr(adminKey), count, amount, label: 'Launch week', issued: now };
    return createCampaign(env, { request: req, signature: sign(req, k) }, deps(), request);
  };
  const claim = (code: string, w = wallet(), ip: string | null = null) => claimGift(env, { code, wallet: w }, deps(), ip, request);
  /** The chain confirms the send that is open (the last transaction signed) and the sweep notices. */
  const land = async () => {
    const last = chain.sent.at(-1)!; const d = decode(last.raw);
    chain.txs.set(last.txid, { status: 'success', sender: treasury, recipient: d.recipient, amount: d.amount, memo: d.memo });
    chain.mempoolNonce = d.nonce + 1n; chain.executed = d.nonce;
    return sweepGifts(env, deps());
  };
  return { env, db, request, chain, deps, campaign, claim, land, sign, treasury, admin: addr(adminKey), adminKey, tick: (ms: number) => { now += ms; }, now: () => now };
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

  it('campaign links: only the admin’s signature makes them, each signed request works once, only hashes are stored', async () => {
    const s = setup();
    const req: CampaignRequest = { admin: s.admin, count: 3, amount: '250000', label: 'Launch week', issued: s.now() };
    const body = { request: req, signature: s.sign(req) };
    const { codes } = await createCampaign(s.env, body, s.deps(), s.request);
    expect(codes).toHaveLength(3);
    await expect(createCampaign(s.env, body, s.deps(), s.request)).rejects.toThrow(/already used/);
    const stored = s.db.sql.prepare('SELECT * FROM radio_gifts').all();
    expect(stored.map((r: any) => r.code_hash).sort()).toEqual(codes.map(giftCodeHash).sort());
    expect(JSON.stringify(stored)).not.toContain(codes[0]);
    expect(await giftStatus(s.env, { code: codes[0] })).toMatchObject({ status: 'live', amount: '250000', source: 'campaign', from: null });
    await expect(s.campaign(1, '100000', key())).rejects.toThrow(/Only the gift admin/);
    await expect(s.campaign(1, '99999')).rejects.toMatchObject({ status: 400 });
    s.tick(16 * 60_000);
    await expect(createCampaign(s.env, { request: { ...req, issued: T0 }, signature: s.sign({ ...req, issued: T0 }) }, s.deps(), s.request)).rejects.toMatchObject({ status: 400 });
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

  it('refuses used wallets, failed checks, an empty treasury and over-limit claims, and leaves the gift claimable', async () => {
    const s = setup({ RADIO_GIFT_DAILY_CAP: '250000' });
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
    await expect(s.claim(codes[2])).rejects.toThrow(/still works tomorrow/);
    s.tick(86_400_001);
    await s.claim(codes[2]);
  });

  it('limits claims per IP', async () => {
    const s = setup();
    const codes = (await s.campaign(CLAIMS_PER_IP + 1)).codes;
    for (let i = 0; i < CLAIMS_PER_IP; i++) { await s.claim(codes[i], wallet(), '9.9.9.9'); await s.land(); }
    await expect(s.claim(codes[CLAIMS_PER_IP], wallet(), '9.9.9.9')).rejects.toThrow(/Too many gifts/);
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
