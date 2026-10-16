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
  BUMP_AFTER_MS, claimGift, hiroGiftChain, RETRY_FAILED_MS, CLAIMS_PER_IP, confirmFriendGift, createCampaign, createFriendGift, createPlayer, ensureGiftTables, GiftError, giftForWallet, giftsConfig,
  adminAddresses, giftStatus, nextSlot, NONCE_SETTLE_MS, principalIn, REBROADCAST_MS, shelfFor, sweepGifts, type ChainTransfer, type GiftChain, type GiftEnv
} from '../radio-gifts';
import { deriveSlotIdentity, listeningBase } from '../../../src/lib/listening-wallet/derive';
import { signSlotBinding } from '../../../src/lib/listening-wallet/slots';
import { playerData, playerHash, type PlayerDefinition, type PlayerRequest } from '../../../src/lib/listening-wallet/gift-players';
import { radioArtist, radioTitle } from '../../../src/lib/radio/artist-credits.mjs';
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

  it('refuses used wallets, failed checks and an empty treasury, leaves the gift claimable, and has no daily cap', async () => {
    const s = setup({ RADIO_GIFT_DAILY_CAP: '250000' }); // set, and ignored: links an admin made are not held back "for today"
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
  const campaignFor = (s: ReturnType<typeof setup>, player: string | undefined, k = s.adminKey) => {
    const req: CampaignRequest = { admin: s.admin, count: 1, amount: '100000', label: 'Gift Edition', issued: s.now(), ...(player ? { player } : {}) };
    const signature = signMessageHashRsv({ messageHash: bytesToHex(sha256(encodeStructuredData(campaignData(req)))), privateKey: createStacksPrivateKey(k) }).data;
    return { req, signature, run: () => createCampaign(s.env, { request: req, signature }, s.deps(), s.request) };
  };

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
      // the supplied credit corrections win, exactly as on the radio (2186–2189 are credited songs)
      tracks: SONGS.map((id, i) => ({ id, title: radioTitle(id, `Song ${i + 1}`), artist: radioArtist(id, 'The Artist') }))
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
    await campaignFor(s, out.id).run();
    for (const id of SONGS) s.chain.owners.set(id, wallet()); // every song is sold to someone else
    const { playerView } = await import('../radio-gifts');
    expect((await playerView(s.env, out.id))?.tracks).toHaveLength(4);
    s.tick(1000);
    await expect(campaignFor(s, out.id).run()).resolves.toMatchObject({ player: out.id });
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

  it('a campaign link opens its player: the id is part of the signature, and it must exist', async () => {
    const s = setup(); catalogue(s);
    const { id } = await make(s);
    const withPlayer = campaignFor(s, id);
    const { codes, player } = await withPlayer.run();
    expect(player).toBe(id);
    expect(await giftStatus(s.env, { code: codes[0] })).toMatchObject({ status: 'live', player: { id, title: 'Proof of Sound', paidOnly: true } });
    // the signature does not cover a different player, and one that does not exist is refused
    const other = campaignFor(s, id.replace(/./, (c) => (c === 'a' ? 'b' : 'a')));
    await expect(createCampaign(s.env, { request: other.req, signature: withPlayer.signature }, s.deps(), s.request)).rejects.toMatchObject({ status: 403 });
    s.tick(1);
    await expect(campaignFor(s, 'f'.repeat(16)).run()).rejects.toThrow(/does not exist/);
    // a campaign without a player is what it always was
    const plain = campaignFor(s, undefined);
    s.tick(1);
    const plainOut = await campaignFor(s, undefined).run();
    expect(plain.req.player).toBeUndefined();
    expect((await giftStatus(s.env, { code: plainOut.codes[0] })).player).toBeUndefined();
  });

  it('a claimed gift tells the wallet its player and where the gift money came from', async () => {
    const s = setup(); catalogue(s);
    const { id } = await make(s);
    const [code] = (await campaignFor(s, id).run()).codes;
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
      const req: CampaignRequest = { admin: s.admin, count: n, amount: '100000', label: 'Gift Edition', issued: s.now(), player: id };
      const signature = signMessageHashRsv({ messageHash: bytesToHex(sha256(encodeStructuredData(campaignData(req)))), privateKey: createStacksPrivateKey(s.adminKey) }).data;
      return (await createCampaign(s.env, { request: req, signature }, s.deps(), s.request)).codes;
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
  });

  it('a plain audio inscription is an album song, and the credits give its title (#315 "Entertainment" by melophonic)', async () => {
    const s = setup(); catalogue(s);
    s.db.sql.exec('CREATE TABLE inscription_index (contract TEXT, token_id INTEGER, sealed INTEGER, mime TEXT)');
    s.db.sql.prepare("INSERT INTO inscription_index VALUES('SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3', 315, 1, 'audio/webm')").run();
    s.db.sql.prepare("INSERT INTO inscription_index VALUES('SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3', 316, 0, 'audio/webm')").run(); // not sealed
    const out = await make(s, definition({ tracks: [315, 2186] }));
    const { playerView } = await import('../radio-gifts');
    expect((await playerView(s.env, out.id))!.tracks[0]).toEqual({ id: 315, title: 'Entertainment', artist: 'melophonic' });
    await expect(make(s, definition({ tracks: [316, 2186] }))).rejects.toMatchObject({ status: 400, message: expect.stringContaining('#316') });
  });

  it('songs the catalogue has not reached yet are read on the spot, then the album is made', async () => {
    const s = setup(); catalogue(s);
    const def = definition({ tracks: [...SONGS, 319] });
    await expect(make(s, def)).rejects.toMatchObject({ message: 'Song #319 is not a ready song in the radio catalogue.' });
    const checkSongs = vi.fn(async (ids: number[]) => {
      for (const id of ids) s.db.sql.prepare("INSERT OR REPLACE INTO radio_metadata VALUES(?, 'Russian Rampage', '', 1, 'ready')").run(id);
    });
    s.tick(1000);
    const out = await createPlayer(s.env, signed(s, def), { ...s.deps(), checkSongs }, s.request);
    expect(checkSongs).toHaveBeenCalledWith([319]);
    expect(out).toMatchObject({ tracks: 5, existing: false });
  });

  it('a hidden track belongs to the album without being listed; an album of only hidden tracks is refused', async () => {
    const s = setup();
    catalogue(s, [...SONGS.map((n, i): [number, string, string, number, string] => [n, `Song ${i + 1}`, 'The Artist', 1, 'ready']), [139, '', '', 2, 'ready']]);
    const out = await make(s, definition({ tracks: [...SONGS, 139] }));
    const { playerView } = await import('../radio-gifts');
    const view = (await playerView(s.env, out.id))!;
    expect(view.tracks.at(-1)).toEqual({ id: 139, title: 'Subterranean (Extended Mix with Phil Hartnoll)', artist: 'melophonic', hidden: true });
    expect(view.tracks.filter((t) => !t.hidden).map((t) => t.id)).toEqual(SONGS);
    s.tick(1000);
    await expect(make(s, definition({ tracks: [139], cover: null }))).rejects.toMatchObject({ status: 400, message: expect.stringContaining('hidden track') });
  });
});
