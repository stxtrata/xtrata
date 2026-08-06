/**
 * Direct tests for the Pages sponsor relayer (functions/sponsor/[[path]].ts).
 *
 * These exercise THE PRODUCTION HANDLER, not the Node svc: real signed
 * fixtures, an in-memory D1 double, and a stubbed fetch for every chain call.
 * They encode the 5.6 SOL findings so the protections cannot silently
 * regress again:
 *   1. signed-arg binding (body listingId must match the signed transaction)
 *   2. atomic settlement transitions (no duplicate claim-fee broadcasts)
 *   3. per-origin rolling rate limit (429 RATE_LIMITED)
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AnchorMode,
  Cl,
  FungibleConditionCode,
  NonFungibleConditionCode,
  PostConditionMode,
  TransactionVersion,
  bufferCV,
  contractPrincipalCV,
  createAssetInfo,
  cvToHex,
  makeContractCall,
  makeContractNonFungiblePostCondition,
  makeStandardSTXPostCondition,
  someCV,
  getAddressFromPrivateKey,
  hexToCV,
  uintCV
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import { onRequest } from '../[[path]]';
import {
  attestorPubkeyHash,
  campaignHexToBytes
} from '../../../src/lib/drops/campaign-attestation';

const DEPLOYER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const MARKET = `${DEPLOYER}.xtrata-market-sponsored-stx-v1-1`;
const DROPS = `${DEPLOYER}.xtrata-drops-v1-0`;
const DROPS_V11 = `${DEPLOYER}.xtrata-drops-v1-1`;
const POF = `${DEPLOYER}.proof-of-free-v1`;
const NFT = `${DEPLOYER}.xtrata-v3-2-3`;
// throwaway keys, never used on-chain
const BUYER_KEY = 'f9d7f5e0d0d81fdd90dcef4e0e2c1b9e3ea361776a5cd91b5c9a52b98b3e1cb601';
const SPONSOR_KEY = 'a5c9a52b98b3e1cb6f9d7f5e0d0d81fdd90dcef4e0e2c1b9e3ea361776a5cd9101';
const ATTESTOR_KEY = '2ae156d224f73bfee9d1d52e0210012b4ae4e85df2705f4f25b7ac62db45aa3b01';
const BUYER_ADDRESS = getAddressFromPrivateKey(BUYER_KEY, TransactionVersion.Mainnet);

type Row = Record<string, unknown> & { id: string; state: string };

const makeDb = () => {
  const jobs: Row[] = [];
  const policies: Row[] = [];
  const policyClaims: Row[] = [];
  const exec = (raw: string, binds: unknown[]) => {
    const q = raw.replace(/\s+/g, ' ').trim();
    if (q.startsWith('CREATE TABLE') || q.startsWith('CREATE INDEX')) {
      return { results: [], meta: { changes: 0 } };
    }
    if (q.startsWith('INSERT OR REPLACE INTO drop_policies')) {
      const [
        scope_key,
        contract_id,
        creator,
        group_id,
        one_per_wallet,
        require_bns_name,
        one_per_bns_name,
        tx_id,
        _scopeForCreatedAt,
        created_at,
        updated_at
      ] = binds;
      const existing = policies.find((row) => row.scope_key === scope_key);
      const next = {
        id: String(scope_key),
        state: 'policy',
        scope_key,
        contract_id,
        creator,
        group_id,
        one_per_wallet,
        require_bns_name,
        one_per_bns_name,
        tx_id,
        created_at: existing?.created_at ?? created_at,
        updated_at
      } as Row;
      if (existing) Object.assign(existing, next);
      else policies.push(next);
      return { results: [], meta: { changes: 1 } };
    }
    if (q.startsWith('SELECT * FROM drop_policies WHERE scope_key=?')) {
      return { results: policies.filter((row) => row.scope_key === binds[0]), meta: {} };
    }
    if (q.startsWith('INSERT INTO drop_policy_claims')) {
      const [scope_key, claim_kind, claim_key, buyer, bns_name, job_id, created_at] = binds;
      if (
        policyClaims.some(
          (row) =>
            row.scope_key === scope_key &&
            row.claim_kind === claim_kind &&
            row.claim_key === claim_key
        )
      ) {
        throw new Error('UNIQUE constraint failed: drop_policy_claims');
      }
      policyClaims.push({
        id: `${scope_key}:${claim_kind}:${claim_key}`,
        state: 'claim',
        scope_key,
        claim_kind,
        claim_key,
        buyer,
        bns_name,
        job_id,
        created_at
      });
      return { results: [], meta: { changes: 1 } };
    }
    if (q.startsWith('DELETE FROM drop_policy_claims WHERE job_id=?')) {
      const before = policyClaims.length;
      for (let index = policyClaims.length - 1; index >= 0; index -= 1) {
        if (policyClaims[index].job_id === binds[0]) policyClaims.splice(index, 1);
      }
      return { results: [], meta: { changes: before - policyClaims.length } };
    }
    if (q.startsWith('ALTER TABLE')) throw new Error('duplicate column');
    if (q.startsWith('UPDATE sponsor_jobs SET state=?')) {
      // transition(): binds = [to, now, to-for-reservation, ...extra, id, from]
      const to = binds[0] as string;
      const from = binds[binds.length - 1] as string;
      const id = binds[binds.length - 2] as string;
      const row = jobs.find((j) => j.id === id && j.state === from);
      if (!row) return { results: [], meta: { changes: 0 } };
      row.state = to;
      row.updated_at = binds[1];
      if (to === 'SETTLED' || to === 'ABANDONED') row.reservation_key = null;
      const extra = q.match(/reservation_key END, (.+?) WHERE/);
      if (extra) {
        extra[1].split(',').forEach((part, index) => {
          row[part.trim().split('=')[0]] = binds[3 + index];
        });
      }
      return { results: [], meta: { changes: 1 } };
    }
    if (
      q.startsWith("UPDATE sponsor_jobs SET state='ABANDONED', reservation_key=NULL, payload_hash=NULL") &&
      q.includes('WHERE id=?')
    ) {
      const [error, updatedAt, id] = binds as [string, number, string];
      const row = jobs.find((job) => job.id === id && job.state === 'RECEIVED');
      if (!row) return { results: [], meta: { changes: 0 } };
      row.state = 'ABANDONED';
      row.reservation_key = null;
      row.payload_hash = null;
      row.error = error;
      row.updated_at = updatedAt;
      return { results: [], meta: { changes: 1 } };
    }
    if (
      q.startsWith("UPDATE sponsor_jobs SET state='ABANDONED', reservation_key=NULL, payload_hash=NULL") &&
      q.includes("WHERE state='RECEIVED'")
    ) {
      const [updatedAt, staleBefore] = binds as [number, number];
      const stale = jobs.filter(
        (job) =>
          job.state === 'RECEIVED' &&
          Number(job.updated_at ?? job.created_at) < staleBefore
      );
      for (const row of stale) {
        row.state = 'ABANDONED';
        row.reservation_key = null;
        row.payload_hash = null;
        row.error = 'never broadcast';
        row.updated_at = updatedAt;
      }
      return { results: [], meta: { changes: stale.length } };
    }
    if (q.startsWith("UPDATE sponsor_jobs SET state='")) {
      return { results: [], meta: { changes: 0 } }; // stale-lease reverts: nothing stale in tests
    }
    if (q.includes('WHERE buyer=?')) {
      const [buyer, after] = binds as [string, number];
      const n = jobs.filter(
        (j) => j.buyer === buyer && (j.created_at as number) > after && j.state !== 'ABANDONED'
      ).length;
      return { results: [{ n }], meta: {} };
    }
    if (q.startsWith('SELECT COUNT(*) as n FROM sponsor_jobs WHERE state NOT IN')) {
      const n = jobs.filter((j) => !['SETTLED', 'ABANDONED'].includes(j.state)).length;
      return { results: [{ n }], meta: {} };
    }
    if (q.startsWith('INSERT INTO sponsor_jobs')) {
      const [id, contract_id, listing_id, buyer, payload_hash, reservation_key, fee_ustx, created_at, updated_at] =
        binds as [string, string, string, string, string, string, string, number, number];
      if (jobs.some((j) => j.payload_hash === payload_hash)) {
        throw new Error('UNIQUE constraint failed: sponsor_jobs.payload_hash');
      }
      if (jobs.some((j) => j.reservation_key === reservation_key)) {
        throw new Error('UNIQUE constraint failed: sponsor_jobs.reservation_key');
      }
      jobs.push({
        id, state: 'RECEIVED', contract_id, listing_id, buyer, payload_hash, reservation_key, fee_ustx,
        buy_tx: null, claim_tx: null, refund_tx: null, error: null, created_at, updated_at
      });
      return { results: [], meta: { changes: 1 } };
    }
    if (q.includes("WHERE state IN ('SPONSORED','CONFIRMED','CLAIMED')")) {
      const pending = jobs.filter((j) => ['SPONSORED', 'CONFIRMED', 'CLAIMED'].includes(j.state));
      return { results: pending.slice(0, Number(binds[0] ?? 4)), meta: {} };
    }
    if (q.includes("WHERE state='ABANDONED' AND buy_tx IS NOT NULL AND error LIKE 'buy tx %'")) {
      const [after, limit] = binds as [number, number];
      const recoverable = jobs.filter(
        (j) =>
          j.state === 'ABANDONED' &&
          j.buy_tx !== null &&
          String(j.error ?? '').startsWith('buy tx ') &&
          Number(j.updated_at ?? j.created_at) > after
      );
      return { results: recoverable.slice(0, Number(limit ?? 4)), meta: {} };
    }
    if (q.includes('WHERE payload_hash=?')) {
      return { results: jobs.filter((j) => j.payload_hash === binds[0]), meta: {} };
    }
    if (q.includes('WHERE reservation_key=?')) {
      return {
        results: jobs.filter(
          (j) => j.reservation_key === binds[0] && !['SETTLED', 'ABANDONED'].includes(j.state)
        ),
        meta: {}
      };
    }
    if (q.includes('WHERE id=?')) {
      return { results: jobs.filter((j) => j.id === binds[0]), meta: {} };
    }
    if (q.startsWith('SELECT id FROM sponsor_jobs WHERE state=')) {
      return { results: [], meta: {} };
    }
    throw new Error(`unhandled query in test double: ${q}`);
  };
  const statement = (q: string, binds: unknown[] = []) => ({
    bind: (...next: unknown[]) => statement(q, next),
    all: async () => exec(q, binds),
    run: async () => exec(q, binds)
  });
  return { db: { prepare: (q: string) => statement(q) }, jobs, policies, policyClaims };
};

const listingTuple = () =>
  Cl.some(
    Cl.tuple({
      seller: Cl.standardPrincipal('SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7'),
      'nft-contract': Cl.contractPrincipal(DEPLOYER, 'xtrata-v3-2-3'),
      'token-id': Cl.uint(2759),
      price: Cl.uint(0),
      'created-at': Cl.uint(1),
      'fee-budget': Cl.uint(100_000),
      'budget-remaining': Cl.uint(100_000),
      claimed: Cl.uint(0),
      buyer: Cl.none(),
      'sold-at': Cl.none()
    })
  );

const dropTuple = (id = 3n, campaign = false) =>
  Cl.some(
    Cl.tuple({
      creator: Cl.standardPrincipal('SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7'),
      'nft-contract': Cl.contractPrincipal(DEPLOYER, 'xtrata-v3-2-3'),
      'token-id': Cl.uint(2759),
      'fee-budget': Cl.uint(100_000),
      'budget-remaining': Cl.uint(100_000),
      'group-id': Cl.uint(id === 32n || id === 31n ? 17481260230060069n : 1n),
      'campaign-id': campaign ? Cl.some(Cl.uint(0)) : Cl.none(),
      edition: campaign ? Cl.some(Cl.uint(id)) : Cl.none(),
      claimer: Cl.none(),
      'claimed-at': Cl.none()
    })
  );

const campaignTuple = () =>
  Cl.some(Cl.tuple({
    creator: Cl.standardPrincipal('SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7'),
    'engine-id': Cl.uint(99),
    'max-supply': Cl.uint(1024),
    'drops-created': Cl.uint(1),
    'one-per-wallet': Cl.bool(true),
    'require-bns': Cl.bool(true),
    'one-per-bns': Cl.bool(true),
    active: Cl.bool(true),
    'created-at': Cl.uint(1)
  }));

const broadcasts: string[] = [];
const balanceApiKeys: Array<string | null> = [];
let rejectAuthenticatedBalanceRequests = false;
let failBalanceLookup = false;
let failBroadcast = false;
let transactionKnown = true;
let transactionStatus = 'success';
let feeRate = 1;
let collectionAlreadyClaimed = false;
let bnsOwner = BUYER_ADDRESS;
let transientDropReadFailures = 0;

const stubFetch = () => {
  broadcasts.length = 0;
  balanceApiKeys.length = 0;
  rejectAuthenticatedBalanceRequests = false;
  failBalanceLookup = false;
  failBroadcast = false;
  transactionKnown = true;
  transactionStatus = 'success';
  feeRate = 1;
  collectionAlreadyClaimed = false;
  bnsOwner = BUYER_ADDRESS;
  transientDropReadFailures = 0;
  vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url.includes('api.bnsv2.com/names/')) {
      return Response.json({ status: 'active', data: { owner: bnsOwner, is_valid: true, revoked: false } });
    }
    if (url.includes('/v2/fees/transfer')) return new Response(String(feeRate), { status: 200 });
    if (url.includes('/stx')) {
      const apiKey = new Headers(init?.headers).get('x-api-key');
      balanceApiKeys.push(apiKey);
      if (failBalanceLookup) return new Response('<html>upstream unavailable</html>', { status: 502 });
      if (rejectAuthenticatedBalanceRequests && apiKey) {
        return Response.json({ error: 'rate limited' }, { status: 429 });
      }
      return Response.json({ balance: '100000000' });
    }
    if (url.includes('/nonces')) return Response.json({ possible_next_nonce: 5 });
    if (url.endsWith('/v2/info')) return Response.json({ stacks_tip_height: 900 });
    if (url.includes('/get-listing')) {
      return Response.json({ okay: true, result: cvToHex(listingTuple()) });
    }
    if (url.includes('/get-drop')) {
      if (transientDropReadFailures > 0) {
        transientDropReadFailures -= 1;
        return new Response('upstream unavailable', { status: 503 });
      }
      let id = 3n;
      try {
        const parsed = JSON.parse(String(init?.body ?? '{}')) as { arguments?: string[] };
        const arg = parsed.arguments?.[0];
        if (arg) id = BigInt(String((hexToCV(arg) as { value?: bigint }).value ?? 3n));
      } catch {
        // Test defaults to drop id 3.
      }
      return Response.json({
        okay: true,
        result: cvToHex(dropTuple(id, url.includes('xtrata-drops-v1-1') || url.includes('proof-of-free-v1')))
      });
    }
    if (url.includes('/get-campaign')) {
      return Response.json({ okay: true, result: cvToHex(campaignTuple()) });
    }
    if (url.includes('/get-bns-attestor-pubkey-hash')) {
      return Response.json({
        okay: true,
        result: cvToHex(Cl.ok(Cl.some(Cl.buffer(campaignHexToBytes(attestorPubkeyHash(ATTESTOR_KEY))))))
      });
    }
    if (url.includes('/has-claimed-in-group')) {
      return Response.json({ okay: true, result: cvToHex(Cl.bool(collectionAlreadyClaimed)) });
    }
    if (url.includes('/extended/v1/tx/')) {
      return transactionKnown
        ? Response.json({ tx_status: transactionStatus })
        : Response.json({ error: 'not found' }, { status: 404 });
    }
    if (url.includes('/v2/transactions')) {
      if (failBroadcast) throw new Error('upstream connection reset');
      broadcasts.push(String(init?.body ?? ''));
      const txid = broadcasts.length.toString(16).padStart(64, '0');
      return new Response(JSON.stringify(txid), { status: 200 });
    }
    throw new Error(`unexpected fetch in test: ${url}`);
  }));
};

const fixture = async (params: {
  contract?: string;
  fn?: string;
  listingId?: bigint;
  sponsored?: boolean;
  nonce?: bigint;
  postConditions?: ReturnType<typeof makeStandardSTXPostCondition>[];
  functionArgs?: Parameters<typeof makeContractCall>[0]['functionArgs'];
} = {}) => {
  const contract = params.contract ?? MARKET;
  const [addr, name] = contract.split('.');
  const [nftAddr, nftName] = NFT.split('.');
  const tx = await makeContractCall({
    contractAddress: addr,
    contractName: name,
    functionName: params.fn ?? 'buy',
    functionArgs: params.functionArgs ?? [contractPrincipalCV(nftAddr, nftName), uintCV(params.listingId ?? 7n)],
    senderKey: BUYER_KEY,
    network: new StacksMainnet(),
    fee: 0n,
    nonce: params.nonce ?? 0n,
    sponsored: params.sponsored ?? true,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
    postConditions: params.postConditions ?? (contract === DROPS || contract === DROPS_V11 || contract === POF
      ? [makeContractNonFungiblePostCondition(
          DEPLOYER,
          contract === DROPS_V11
            ? 'xtrata-drops-v1-1'
            : contract === POF
              ? 'proof-of-free-v1'
              : 'xtrata-drops-v1-0',
          NonFungibleConditionCode.Sends,
          createAssetInfo(DEPLOYER, 'xtrata-v3-2-3', 'xtrata-inscription'),
          uintCV(2759n)
        )]
      : [makeStandardSTXPostCondition(
          'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7',
          FungibleConditionCode.Equal,
          0n
        )])
  });
  return Buffer.from(tx.serialize()).toString('hex');
};

const submit = (env: unknown, body: Record<string, unknown>) =>
  onRequest({
    request: new Request('https://x/sponsor/submit', {
      method: 'POST',
      body: JSON.stringify(body)
    }),
    env
  } as never) as Promise<Response>;

const savePolicy = (env: unknown, body: Record<string, unknown>) =>
  onRequest({
    request: new Request('https://x/sponsor/drop-policy', {
      method: 'POST',
      body: JSON.stringify(body)
    }),
    env
  } as never) as Promise<Response>;

const attestCampaign = (env: unknown, body: Record<string, unknown>) =>
  onRequest({
    request: new Request('https://x/sponsor/attest-campaign', {
      method: 'POST',
      body: JSON.stringify(body)
    }),
    env
  } as never) as Promise<Response>;

const readPolicy = (env: unknown, params: URLSearchParams) =>
  onRequest({
    request: new Request(`https://x/sponsor/drop-policy?${params.toString()}`, { method: 'GET' }),
    env
  } as never) as Promise<Response>;

describe('sponsor relayer Pages handler', () => {
  let db: ReturnType<typeof makeDb>;
  let env: Record<string, unknown>;

  beforeEach(() => {
    db = makeDb();
    env = {
      SPONSOR_KEY,
      BNS_ATTESTATION_PRIVATE_KEY: ATTESTOR_KEY,
      DB: db.db
    };
    stubFetch();
  });
  afterEach(() => vi.unstubAllGlobals());

  it('accepts a valid market buy and persists the SIGNED listing id', async () => {
    const res = await submit(env, { txHex: await fixture({ listingId: 7n }), contractId: MARKET, listingId: '7' });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.state).toBe('SPONSORED');
    expect(db.jobs[0].listing_id).toBe('7');
    expect(db.jobs[0].state).toBe('SPONSORED');
  });

  it('accepts a valid nonce-0 drops claim from a fresh wallet', async () => {
    const res = await submit(env, {
      txHex: await fixture({ contract: DROPS, fn: 'claim', listingId: 3n, nonce: 0n }),
      contractId: DROPS,
      listingId: '3'
    });
    expect(res.status).toBe(200);
  });

  it('attests, validates, and sponsors a complete v1.1 campaign claim', async () => {
    const attested = await attestCampaign(env, {
      contractId: DROPS_V11,
      listingId: '3',
      claimer: BUYER_ADDRESS,
      bnsName: 'alice.btc'
    });
    expect(attested.status).toBe(200);
    const permit = await attested.json() as {
      bnsKey: string;
      expiresAt: string;
      signature: string;
      campaignId: string;
    };
    expect(permit).toMatchObject({ campaignId: '0', expiresAt: '920' });

    const txHex = await fixture({
      contract: DROPS_V11,
      fn: 'claim-campaign',
      listingId: 3n,
      functionArgs: [
        contractPrincipalCV(DEPLOYER, 'xtrata-v3-2-3'),
        uintCV(3n),
        someCV(bufferCV(campaignHexToBytes(permit.bnsKey, 32))),
        uintCV(BigInt(permit.expiresAt)),
        bufferCV(campaignHexToBytes(permit.signature, 65))
      ]
    });
    const sponsored = await submit(env, {
      txHex,
      contractId: DROPS_V11,
      listingId: '3',
      bnsName: 'alice.btc'
    });
    expect(sponsored.status).toBe(200);
    expect(await sponsored.json()).toMatchObject({ state: 'SPONSORED' });
  });

  // A single 503 anywhere in ATTESTATION_STATE used to fail the whole claim as
  // RELAYER_INTERNAL, because hiroFetch only rotated API keys for 401/403/429
  // and never retried an unavailable node.
  it('rides out a transient 503 on a campaign state read', async () => {
    transientDropReadFailures = 2;
    const attested = await attestCampaign(env, {
      contractId: DROPS_V11,
      listingId: '3',
      claimer: BUYER_ADDRESS,
      bnsName: 'alice.btc'
    });
    expect(attested.status).toBe(200);
    expect(transientDropReadFailures).toBe(0);
    await expect(attested.json()).resolves.toMatchObject({ campaignId: '0' });
  });

  it('still gives up when the node stays unavailable', async () => {
    transientDropReadFailures = 99;
    const attested = await attestCampaign(env, {
      contractId: DROPS_V11,
      listingId: '3',
      claimer: BUYER_ADDRESS,
      bnsName: 'alice.btc'
    });
    // Exhausted retries surface as RELAYER_INTERNAL, not a masked success.
    expect(attested.status).toBe(500);
    await expect(attested.json()).resolves.toMatchObject({ code: 'RELAYER_INTERNAL' });
  });

  it('uses the campaign claim path for an explicitly allowlisted PoF controller', async () => {
    env.SPONSOR_MARKETS = `${MARKET},${DROPS},${DROPS_V11},${POF}`;
    const attested = await attestCampaign(env, {
      contractId: POF,
      listingId: '3',
      claimer: BUYER_ADDRESS,
      bnsName: 'alice.btc'
    });
    expect(attested.status).toBe(200);
    const permit = await attested.json() as {
      bnsKey: string;
      expiresAt: string;
      signature: string;
    };
    const txHex = await fixture({
      contract: POF,
      fn: 'claim-campaign',
      listingId: 3n,
      functionArgs: [
        contractPrincipalCV(DEPLOYER, 'xtrata-v3-2-3'),
        uintCV(3n),
        someCV(bufferCV(campaignHexToBytes(permit.bnsKey, 32))),
        uintCV(BigInt(permit.expiresAt)),
        bufferCV(campaignHexToBytes(permit.signature, 65))
      ]
    });
    const response = await submit(env, {
      txHex,
      contractId: POF,
      listingId: '3',
      bnsName: 'alice.btc'
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ state: 'SPONSORED' });
  });

  it('refuses to spend sponsor fees on a forged v1.1 attestation', async () => {
    const attested = await attestCampaign(env, {
      contractId: DROPS_V11,
      listingId: '3',
      claimer: BUYER_ADDRESS,
      bnsName: 'alice.btc'
    });
    const permit = await attested.json() as { bnsKey: string; expiresAt: string; signature: string };
    const forged = `${permit.signature.slice(0, -2)}${permit.signature.endsWith('00') ? '01' : '00'}`;
    const txHex = await fixture({
      contract: DROPS_V11,
      fn: 'claim-campaign',
      listingId: 3n,
      functionArgs: [
        contractPrincipalCV(DEPLOYER, 'xtrata-v3-2-3'),
        uintCV(3n),
        someCV(bufferCV(campaignHexToBytes(permit.bnsKey, 32))),
        uintCV(BigInt(permit.expiresAt)),
        bufferCV(campaignHexToBytes(forged, 65))
      ]
    });
    const blocked = await submit(env, {
      txHex,
      contractId: DROPS_V11,
      listingId: '3',
      bnsName: 'alice.btc'
    });
    expect(blocked.status).toBe(400);
    expect(await blocked.json()).toMatchObject({
      code: 'VALIDATION',
      stage: 'CAMPAIGN_ATTESTATION',
      message: 'campaign attestation signature is invalid'
    });
    expect(broadcasts).toHaveLength(0);
  });

  it('saves and reads toggleable drop policies for a creator group', async () => {
    const saved = await savePolicy(env, {
      contractId: DROPS,
      dropId: '3',
      creator: 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7',
      groupId: '1',
      rules: {
        onePerWallet: false,
        requireBnsName: true,
        onePerBnsName: true
      },
      txId: 'abc'
    });
    expect(saved.status).toBe(200);
    expect(await saved.json()).toMatchObject({
      ok: true,
      rules: {
        onePerWallet: false,
        requireBnsName: true,
        onePerBnsName: true
      }
    });

    const read = await readPolicy(env, new URLSearchParams({
      contractId: DROPS,
      creator: 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7',
      groupId: '1'
    }));
    expect(read.status).toBe(200);
    expect(await read.json()).toMatchObject({
      rules: {
        onePerWallet: false,
        requireBnsName: true,
        onePerBnsName: true
      }
    });
  });

  it('enforces require-BNS before sponsoring a drop claim', async () => {
    await savePolicy(env, {
      contractId: DROPS,
      dropId: '3',
      creator: 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7',
      groupId: '1',
      rules: { onePerWallet: false, requireBnsName: true, onePerBnsName: false }
    });

    const blocked = await submit(env, {
      txHex: await fixture({ contract: DROPS, fn: 'claim', listingId: 3n, nonce: 0n }),
      contractId: DROPS,
      listingId: '3'
    });
    expect(blocked.status).toBe(403);
    expect(await blocked.json()).toMatchObject({ code: 'BNS_REQUIRED', stage: 'BNS_POLICY' });
    expect(broadcasts).toHaveLength(0);

    const accepted = await submit(env, {
      txHex: await fixture({ contract: DROPS, fn: 'claim', listingId: 3n, nonce: 1n }),
      contractId: DROPS,
      listingId: '3',
      bnsName: 'alice.btc'
    });
    expect(accepted.status).toBe(200);
  });

  it('enforces one-per-BNS across different drops in the same policy group', async () => {
    await savePolicy(env, {
      contractId: DROPS,
      dropId: '3',
      creator: 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7',
      groupId: '1',
      rules: { onePerWallet: false, requireBnsName: true, onePerBnsName: true }
    });
    const first = await submit(env, {
      txHex: await fixture({ contract: DROPS, fn: 'claim', listingId: 3n, nonce: 0n }),
      contractId: DROPS,
      listingId: '3',
      bnsName: 'alice.btc'
    });
    expect(first.status).toBe(200);
    const second = await submit(env, {
      txHex: await fixture({ contract: DROPS, fn: 'claim', listingId: 4n, nonce: 1n }),
      contractId: DROPS,
      listingId: '4',
      bnsName: 'alice.btc'
    });
    expect(second.status).toBe(409);
    expect(await second.json()).toMatchObject({ code: 'POLICY_LIMIT', stage: 'POLICY_RESERVATION' });
  });

  it('crosses one-per-wallet and one-per-BNS when both toggles are selected', async () => {
    await savePolicy(env, {
      contractId: DROPS,
      dropId: '3',
      creator: 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7',
      groupId: '1',
      rules: { onePerWallet: true, requireBnsName: true, onePerBnsName: true }
    });
    const first = await submit(env, {
      txHex: await fixture({ contract: DROPS, fn: 'claim', listingId: 3n, nonce: 0n }),
      contractId: DROPS,
      listingId: '3',
      bnsName: 'alice.btc'
    });
    expect(first.status).toBe(200);
    const sameWalletDifferentName = await submit(env, {
      txHex: await fixture({ contract: DROPS, fn: 'claim', listingId: 4n, nonce: 1n }),
      contractId: DROPS,
      listingId: '4',
      bnsName: 'bob.btc'
    });
    expect(sameWalletDifferentName.status).toBe(409);
    expect(await sameWalletDifferentName.json()).toMatchObject({ code: 'POLICY_LIMIT' });
  });

  it('sanitizes a comma/newline Hiro key list before constructing request headers', async () => {
    env.HIRO_API_KEY = 'key-one, key-two\nkey-three';
    const res = await submit(env, {
      txHex: await fixture({ contract: DROPS, fn: 'claim', listingId: 3n, nonce: 0n }),
      contractId: DROPS,
      listingId: '3'
    });
    expect(res.status).toBe(200);
    expect(balanceApiKeys[0]).toBe('key-one');
    expect(balanceApiKeys[0]).not.toMatch(/[\s,]/);
  });

  it('retries rate-limited Hiro keys and finally uses the public endpoint', async () => {
    env.HIRO_API_KEYS = 'rate-limited-one\nrate-limited-two';
    rejectAuthenticatedBalanceRequests = true;
    const res = await submit(env, {
      txHex: await fixture({ contract: DROPS, fn: 'claim', listingId: 3n, nonce: 0n }),
      contractId: DROPS,
      listingId: '3'
    });
    expect(res.status).toBe(200);
    expect(balanceApiKeys).toEqual(['rate-limited-one', 'rate-limited-two', null]);
  });

  it('returns an actionable 503 when the sponsor balance upstream is unavailable', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    failBalanceLookup = true;
    const res = await submit(env, {
      txHex: await fixture({ contract: DROPS, fn: 'claim', listingId: 3n, nonce: 0n }),
      contractId: DROPS,
      listingId: '3'
    });
    expect(res.status).toBe(503);
    expect(await res.json()).toMatchObject({
      code: 'RELAYER_UNAVAILABLE',
      message: 'sponsor balance lookup unavailable; retry shortly',
      stage: 'SPONSOR_BALANCE',
      requestId: expect.any(String)
    });
    expect(broadcasts).toHaveLength(0);
    consoleError.mockRestore();
  });

  it('caps a free-drop sponsor fee at the exact reimbursable budget during a transient fee spike', async () => {
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    feeRate = 250; // 150,000 µSTX estimate versus the fixture's 100,000 µSTX budget
    const res = await submit(env, {
      txHex: await fixture({ contract: DROPS, fn: 'claim', listingId: 3n, nonce: 0n }),
      contractId: DROPS,
      listingId: '3'
    });
    expect(res.status).toBe(200);
    expect(db.jobs[0].fee_ustx).toBe('100000');
    expect(broadcasts).toHaveLength(1);
    expect(consoleWarn).toHaveBeenCalledWith(
      '[sponsor:fee-cap]',
      expect.objectContaining({
        estimatedFeeUstx: '150000',
        budgetRemainingUstx: '100000',
        sponsoredFeeUstx: '100000'
      })
    );
    consoleWarn.mockRestore();
  });

  it('rejects a locked collection drop when the wallet already claimed another group in the batch', async () => {
    collectionAlreadyClaimed = true;
    const res = await submit(env, {
      txHex: await fixture({ contract: DROPS, fn: 'claim', listingId: 32n, nonce: 0n }),
      contractId: DROPS,
      listingId: '32'
    });
    expect(res.status).toBe(409);
    expect(await res.json()).toMatchObject({
      code: 'COLLECTION_LIMIT',
      stage: 'COLLECTION_LOCK',
      message: 'wallet already claimed from Dropped collection; one free drop per address'
    });
    expect(broadcasts).toHaveLength(0);
  });

  it('releases an unbroadcast reservation so the same Xverse payload can retry', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const txHex = await fixture({ contract: DROPS, fn: 'claim', listingId: 3n, nonce: 0n });
    failBroadcast = true;
    transactionKnown = false;
    const failed = await submit(env, { txHex, contractId: DROPS, listingId: '3' });
    expect(failed.status).toBe(503);
    expect(await failed.json()).toMatchObject({
      code: 'RELAYER_UNAVAILABLE',
      stage: 'BROADCAST',
      message: 'broadcast upstream unavailable; retry shortly'
    });
    expect(db.jobs[0]).toMatchObject({
      state: 'ABANDONED',
      reservation_key: null,
      payload_hash: null
    });

    failBroadcast = false;
    transactionKnown = true;
    const retried = await submit(env, { txHex, contractId: DROPS, listingId: '3' });
    expect(retried.status).toBe(200);
    expect(db.jobs).toHaveLength(2);
    expect(db.jobs[1].state).toBe('SPONSORED');
    consoleError.mockRestore();
  });

  it('expires a stale RECEIVED reservation before accepting a fresh retry', async () => {
    db.jobs.push({
      id: 'stale-xverse',
      state: 'RECEIVED',
      contract_id: DROPS,
      listing_id: '3',
      buyer: 'SP3W6567DR121BHVV05J5ECQM4G3YXG87137EATW',
      payload_hash: 'stale-payload',
      reservation_key: `${DROPS}:3`,
      fee_ustx: '3000',
      buy_tx: null,
      claim_tx: null,
      refund_tx: null,
      error: null,
      created_at: Date.now() - 3 * 60_000,
      updated_at: Date.now() - 3 * 60_000
    });
    const retried = await submit(env, {
      txHex: await fixture({ contract: DROPS, fn: 'claim', listingId: 3n, nonce: 0n }),
      contractId: DROPS,
      listingId: '3'
    });
    expect(retried.status).toBe(200);
    expect(db.jobs[0]).toMatchObject({
      state: 'ABANDONED',
      reservation_key: null,
      payload_hash: null,
      error: 'never broadcast'
    });
    expect(db.jobs[1].state).toBe('SPONSORED');
  });

  // Was 'keeps the strict insufficient-budget block for sponsored market buys'.
  // That block treated a noisy over-estimate as fact: on 2026-08-06
  // /v2/fees/transfer read ~322 instead of its usual 1, the relayer refused, the
  // market page fell through silently, and the buyer paid 0.193 STX for a
  // purchase that had been sponsored for free 39 minutes earlier. Refusing to
  // sponsor is not the safe option when the fallback spends the buyer's money.
  it('caps a fee-estimate spike instead of refusing to sponsor', async () => {
    feeRate = 250; // estimate = 250 * 600 = 150,000 uSTX, well over the escrow
    const res = await submit(env, {
      txHex: await fixture({ listingId: 7n }),
      contractId: MARKET,
      listingId: '7'
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ state: 'SPONSORED' });
    expect(broadcasts).toHaveLength(1);
    // Capped to 0.01 STX: not the 150,000 estimate, and not the 100,000 escrow.
    expect(db.jobs[0].fee_ustx).toBe('10000');
  });

  it('still pays the plain estimate when it is under the cap', async () => {
    feeRate = 10; // estimate = 6,000 uSTX
    const res = await submit(env, {
      txHex: await fixture({ listingId: 7n }),
      contractId: MARKET,
      listingId: '7'
    });
    expect(res.status).toBe(200);
    expect(db.jobs[0].fee_ustx).toBe('6000');
  });

  it('normalizes a 0x-prefixed sponsor secret before deriving and signing', async () => {
    const res = await submit(
      { ...env, SPONSOR_KEY: `0x${SPONSOR_KEY}` },
      {
        txHex: await fixture({ contract: DROPS, fn: 'claim', listingId: 3n, nonce: 0n }),
        contractId: DROPS,
        listingId: '3'
      }
    );
    expect(res.status).toBe(200);
    expect((await res.json()).state).toBe('SPONSORED');
  });

  it('returns a structured preflight block for a malformed sponsor secret', async () => {
    const res = await submit(
      { ...env, SPONSOR_KEY: 'not-a-private-key' },
      {
        txHex: await fixture({ contract: DROPS, fn: 'claim', listingId: 3n }),
        contractId: DROPS,
        listingId: '3'
      }
    );
    expect(res.status).toBe(503);
    expect(await res.json()).toMatchObject({
      code: 'RELAYER_KEY_INVALID',
      stage: 'REQUEST_PREFLIGHT',
      requestId: expect.any(String)
    });
    expect(broadcasts).toHaveLength(0);
  });

  it('converts unexpected server failures into request-scoped stage diagnostics', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const res = await submit(
      {
        SPONSOR_KEY,
        DB: { prepare: () => { throw new Error('database credentials leaked here'); } }
      },
      {
        txHex: await fixture({ contract: DROPS, fn: 'claim', listingId: 3n }),
        contractId: DROPS,
        listingId: '3'
      }
    );
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body).toMatchObject({
      code: 'RELAYER_INTERNAL',
      message: 'sponsor relayer failed during DB_INIT',
      stage: 'DB_INIT',
      requestId: expect.any(String)
    });
    expect(JSON.stringify(body)).not.toContain('database credentials');
    expect(consoleError).toHaveBeenCalledWith(
      '[sponsor:request]',
      expect.objectContaining({ requestId: body.requestId, stage: 'DB_INIT' })
    );
    consoleError.mockRestore();
  });

  it('rejects a drops claim whose deny-mode post-condition cannot authorize the NFT transfer', async () => {
    const wrongPostCondition = makeStandardSTXPostCondition(
      'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7',
      FungibleConditionCode.Equal,
      0n
    );
    const res = await submit(env, {
      txHex: await fixture({ contract: DROPS, fn: 'claim', listingId: 3n, postConditions: [wrongPostCondition] }),
      contractId: DROPS,
      listingId: '3'
    });
    expect(res.status).toBe(400);
    expect((await res.json()).message).toMatch(/post-conditions/);
    expect(broadcasts).toHaveLength(0);
  });

  it('reserves one sponsorship per drop across different signed payloads', async () => {
    const [first, second] = await Promise.all([
      submit(env, {
        txHex: await fixture({ contract: DROPS, fn: 'claim', listingId: 3n, nonce: 0n }),
        contractId: DROPS,
        listingId: '3'
      }),
      submit(env, {
        txHex: await fixture({ contract: DROPS, fn: 'claim', listingId: 3n, nonce: 1n }),
        contractId: DROPS,
        listingId: '3'
      })
    ]);
    expect([first.status, second.status].sort()).toEqual([200, 409]);
    const blocked = first.status === 409 ? first : second;
    expect((await blocked.json()).code).toBe('LISTING_BUSY');
    expect(db.jobs).toHaveLength(1);
    expect(broadcasts).toHaveLength(1);
  });

  it('advances a drops sponsorship through reimbursement and creator refund', async () => {
    const submitted = await submit(env, {
      txHex: await fixture({ contract: DROPS, fn: 'claim', listingId: 3n }),
      contractId: DROPS,
      listingId: '3'
    });
    const initial = await submitted.json();
    const status = () => onRequest({
      request: new Request(`https://x/sponsor/status/${initial.id}`, { method: 'GET' }),
      env
    } as never) as Promise<Response>;
    await status();
    const settled = await status();
    const body = await settled.json();
    expect(body.state).toBe('SETTLED');
    expect(body.txids).toMatchObject({ buy: expect.any(String), claim: expect.any(String), refund: expect.any(String) });
    expect(db.jobs[0].reservation_key).toBeNull();
  });

  it('FINDING 1: rejects body listingId B when the signed transaction targets A, before any job or broadcast', async () => {
    const res = await submit(env, { txHex: await fixture({ listingId: 7n }), contractId: MARKET, listingId: '8' });
    expect(res.status).toBe(400);
    expect((await res.json()).message).toMatch(/listingId mismatch/);
    expect(db.jobs.length).toBe(0);
    expect(broadcasts.length).toBe(0);
  });

  it('rejects buy on a drops contract and claim on a market contract', async () => {
    const wrongDrops = await submit(env, {
      txHex: await fixture({ contract: DROPS, fn: 'buy', listingId: 3n }),
      contractId: DROPS,
      listingId: '3'
    });
    expect(wrongDrops.status).toBe(400);
    const wrongMarket = await submit(env, {
      txHex: await fixture({ contract: MARKET, fn: 'claim', listingId: 7n }),
      contractId: MARKET,
      listingId: '7'
    });
    expect(wrongMarket.status).toBe(400);
  });

  it('rejects malformed listingId and oversized/odd txHex before deserialization', async () => {
    const hex = await fixture({ listingId: 7n });
    expect((await submit(env, { txHex: hex, contractId: MARKET, listingId: '-1' })).status).toBe(400);
    expect((await submit(env, { txHex: hex, contractId: MARKET, listingId: '1.5' })).status).toBe(400);
    expect((await submit(env, { txHex: `${hex}0`, contractId: MARKET, listingId: '7' })).status).toBe(400);
    expect((await submit(env, { txHex: 'zz'.repeat(10), contractId: MARKET, listingId: '7' })).status).toBe(400);
    expect(
      (await submit(env, { txHex: 'aa'.repeat(20_001), contractId: MARKET, listingId: '7' })).status
    ).toBe(400);
    expect(db.jobs.length).toBe(0);
  });

  it('FINDING 3: rate-limits the sixth job from one origin with 429 RATE_LIMITED', async () => {
    for (let i = 0; i < 5; i += 1) {
      const res = await submit(env, {
        txHex: await fixture({ listingId: BigInt(10 + i) }),
        contractId: MARKET,
        listingId: String(10 + i)
      });
      expect(res.status).toBe(200);
    }
    const sixth = await submit(env, {
      txHex: await fixture({ listingId: 99n }),
      contractId: MARKET,
      listingId: '99'
    });
    expect(sixth.status).toBe(429);
    expect((await sixth.json()).code).toBe('RATE_LIMITED');
  });

  it('duplicate payload returns 409 with the existing job instead of double-broadcasting', async () => {
    const hex = await fixture({ listingId: 7n });
    const first = await submit(env, { txHex: hex, contractId: MARKET, listingId: '7' });
    expect(first.status).toBe(200);
    const beforeBroadcasts = broadcasts.length;
    const second = await submit(env, { txHex: hex, contractId: MARKET, listingId: '7' });
    expect(second.status).toBe(409);
    // The second request legitimately advances SETTLEMENT of job 1 (one
    // claim-fee broadcast); what must NOT happen is a second buy broadcast.
    expect(broadcasts.length).toBeLessThanOrEqual(beforeBroadcasts + 1);
    expect(db.jobs.length).toBe(1);
    expect(db.jobs[0].state).toBe('CLAIMED');
  });

  it('FINDING 2: concurrent settlement advances a CONFIRMED job with exactly one claim-fee broadcast', async () => {
    db.jobs.push({
      id: 'job-1', state: 'CONFIRMED', contract_id: MARKET, listing_id: '7',
      buyer: 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7', payload_hash: 'h1', fee_ustx: '3000',
      buy_tx: 'buytx', claim_tx: null, refund_tx: null, error: null,
      created_at: Date.now(), updated_at: Date.now()
    });
    const status = () =>
      onRequest({
        request: new Request('https://x/sponsor/status/job-1', { method: 'GET' }),
        env
      } as never) as Promise<Response>;
    // Each request runs settleBatch first; both race to advance the job.
    await Promise.all([status(), status()]);
    expect(broadcasts.length).toBe(1);
    expect(db.jobs[0].state).toBe('CLAIMED');
  });

  it('keeps a newly broadcast claim alive when Hiro transiently reports dropped_replace_by_fee', async () => {
    transactionStatus = 'dropped_replace_by_fee';
    db.jobs.push({
      id: 'racing-drop', state: 'SPONSORED', contract_id: DROPS, listing_id: '3',
      buyer: 'SP3W6567DR121BHVV05J5ECQM4G3YXG87137EATW', payload_hash: 'racing', fee_ustx: '3000',
      buy_tx: 'buytx', claim_tx: null, refund_tx: null, error: null,
      created_at: Date.now() - 5_000, updated_at: Date.now() - 5_000
    });

    const response = await onRequest({
      request: new Request('https://x/sponsor/status/racing-drop'),
      env
    } as never) as Response;

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ state: 'SPONSORED' });
    expect(db.jobs[0].state).toBe('SPONSORED');
    expect(broadcasts).toHaveLength(0);
  });

  it('eventually abandons a persistently dropped claim after the confirmation grace window', async () => {
    transactionStatus = 'dropped_replace_by_fee';
    db.jobs.push({
      id: 'real-drop', state: 'SPONSORED', contract_id: DROPS, listing_id: '3',
      buyer: 'SP3W6567DR121BHVV05J5ECQM4G3YXG87137EATW', payload_hash: 'dropped', fee_ustx: '3000',
      buy_tx: 'buytx', claim_tx: null, refund_tx: null, error: null,
      created_at: Date.now() - 61_000, updated_at: Date.now() - 61_000
    });

    const response = await onRequest({
      request: new Request('https://x/sponsor/status/real-drop'),
      env
    } as never) as Response;

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      state: 'ABANDONED',
      error: 'buy tx dropped_replace_by_fee'
    });
  });

  it('revives an abandoned job when its exact claim transaction later resolves to success', async () => {
    db.jobs.push({
      id: 'late-success', state: 'ABANDONED', contract_id: DROPS, listing_id: '3',
      buyer: 'SP3W6567DR121BHVV05J5ECQM4G3YXG87137EATW', payload_hash: 'late', fee_ustx: '3000',
      buy_tx: 'buytx', claim_tx: null, refund_tx: null, error: 'buy tx dropped_replace_by_fee',
      created_at: Date.now() - 61_000, updated_at: Date.now() - 5_000
    });

    const response = await onRequest({
      request: new Request('https://x/sponsor/status/late-success'),
      env
    } as never) as Response;

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ state: 'CLAIMED' });
    expect(db.jobs[0]).toMatchObject({ state: 'CLAIMED', error: null });
    expect(broadcasts).toHaveLength(1);
  });
});
