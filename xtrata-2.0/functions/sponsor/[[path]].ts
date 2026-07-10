/**
 * Serverless sponsor relayer — Cloudflare Pages Function.
 *
 * Replaces the Node relayer (xtrata-agent-one/svc/sponsor-service.mjs) with a
 * zero-server deployment: it ships with the site, costs nothing extra, and
 * needs no machine to run. Same protocol, same trust model:
 *
 *   POST /sponsor/quote        → fee-budget quote for the list flow
 *   POST /sponsor/submit       → validate a buyer-signed sponsored `buy`
 *                                (fee 0), attach the fee from the hot wallet,
 *                                broadcast
 *   GET  /sponsor/status/:id   → job state
 *
 * Settlement is TRAFFIC-DRIVEN instead of a background loop: every request
 * first advances a bounded batch of unsettled jobs (buy confirmed → claim-fee
 * → settle-refund). If traffic ever stops entirely, nothing strands — the
 * contract lets sellers self-refund 144 blocks after a sale.
 *
 * Job state lives in the existing D1 database (table auto-created).
 *
 * Setup (once): wrangler pages secret put SPONSOR_KEY   (the hot-wallet key
 * from the Sponsor Ops page). Optional: SPONSOR_MARKETS to override the
 * allowlist, HIRO_API_KEY for rate limits.
 *
 * NOTE: the validation rules here mirror svc/sponsor-service.mjs and are
 * covered by its offline test suite (npm run sponsor:test in agent-one).
 */
import {
  AnchorMode,
  AuthType,
  PayloadType,
  PostConditionMode,
  TransactionVersion,
  addressToString,
  AddressVersion,
  broadcastTransaction,
  cvToJSON,
  cvToHex,
  deserializeTransaction,
  getAddressFromPrivateKey,
  hexToCV,
  makeContractCall,
  sponsorTransaction,
  uintCV
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import { jsonResponse } from '../lib/utils';
import { run, queryAll, type Env } from '../lib/db';

const DEPLOYER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const DEFAULT_MARKETS = [
  `${DEPLOYER}.xtrata-market-sponsored-sbtc-v1-0`,
  `${DEPLOYER}.xtrata-market-sponsored-usdcx-v1-0`
];
const FEE_MULTIPLIER = 3n;
const MIN_BUDGET_USTX = 50_000n;
const MAX_FEE_USTX = 2_000_000n;
const LOW_BALANCE_USTX = 5_000_000n; // refuse below 5 STX float
const MAX_UNSETTLED = 20;
const SETTLE_BATCH = 4; // jobs advanced per incoming request
const SETTLE_TIMEOUT_MS = 2 * 3_600_000;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'content-type',
  'Cache-Control': 'no-store'
};

type SponsorEnv = Env & {
  SPONSOR_KEY?: string;
  SPONSOR_MARKETS?: string;
  HIRO_API_KEY?: string;
};

const hiroHeaders = (env: SponsorEnv): HeadersInit =>
  env.HIRO_API_KEY ? { 'x-api-key': env.HIRO_API_KEY } : {};

const HIRO = 'https://api.hiro.so';

const allowlist = (env: SponsorEnv) =>
  (env.SPONSOR_MARKETS?.split(',').map((s) => s.trim()).filter(Boolean) ?? DEFAULT_MARKETS);

const err = (code: string, message: string, status = 400) =>
  jsonResponse({ code, message }, status, CORS);

// ---------------------------------------------------------------- chain helpers

const estimateBuyFee = async (env: SponsorEnv): Promise<bigint> => {
  try {
    const r = await fetch(`${HIRO}/v2/fees/transfer`, { headers: hiroHeaders(env) });
    const rate = Number(await r.json());
    return BigInt(Math.max(3000, rate * 600));
  } catch {
    return 30_000n;
  }
};

const getBalance = async (env: SponsorEnv, address: string): Promise<bigint> => {
  const r = await fetch(`${HIRO}/extended/v1/address/${address}/stx`, { headers: hiroHeaders(env) });
  const j = (await r.json()) as { balance?: string };
  return BigInt(j.balance ?? '0');
};

const getNonce = async (env: SponsorEnv, address: string): Promise<bigint> => {
  const r = await fetch(`${HIRO}/extended/v1/address/${address}/nonces`, { headers: hiroHeaders(env) });
  const j = (await r.json()) as { possible_next_nonce?: number };
  return BigInt(j.possible_next_nonce ?? 0);
};

const getTxStatus = async (env: SponsorEnv, txid: string): Promise<string> => {
  const r = await fetch(`${HIRO}/extended/v1/tx/0x${txid.replace(/^0x/, '')}`, { headers: hiroHeaders(env) });
  if (!r.ok) return 'pending';
  const j = (await r.json()) as { tx_status?: string };
  return j.tx_status ?? 'pending';
};

const getListing = async (env: SponsorEnv, contractId: string, listingId: string) => {
  const [address, name] = contractId.split('.');
  const r = await fetch(`${HIRO}/v2/contracts/call-read/${address}/${name}/get-listing`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...hiroHeaders(env) },
    body: JSON.stringify({ sender: address, arguments: [cvToHex(uintCV(BigInt(listingId)))] })
  });
  const j = (await r.json()) as { okay?: boolean; result?: string };
  if (!j.okay || !j.result) return null;
  const parsed = cvToJSON(hexToCV(j.result)) as { value?: { value?: Record<string, { value: unknown }> } };
  const rec = parsed?.value?.value;
  if (!rec) return null;
  const soldRaw = (rec['sold-at'] as { value?: { value?: unknown } | null })?.value ?? null;
  return {
    budgetRemaining: BigInt(String((rec['budget-remaining'] as { value: unknown }).value)),
    soldAt: soldRaw === null || soldRaw === undefined ? null : String((soldRaw as { value?: unknown }).value ?? soldRaw)
  };
};

const network = new StacksMainnet();

const sponsorCall = async (
  env: SponsorEnv,
  key: string,
  contractId: string,
  functionName: string,
  args: ReturnType<typeof uintCV>[]
) => {
  const [contractAddress, contractName] = contractId.split('.');
  const sponsorAddress = getAddressFromPrivateKey(key, TransactionVersion.Mainnet);
  const nonce = await getNonce(env, sponsorAddress);
  const tx = await makeContractCall({
    contractAddress,
    contractName,
    functionName,
    functionArgs: args,
    senderKey: key,
    network,
    fee: 5_000n,
    nonce,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow
  });
  const res = await broadcastTransaction(tx, network);
  if ((res as { error?: string }).error) {
    throw new Error((res as { reason?: string; error?: string }).reason ?? (res as { error?: string }).error);
  }
  return String((res as { txid?: string }).txid ?? res);
};

// ---------------------------------------------------------------- validation (mirrors svc/sponsor-service.mjs)

const VALIDATION = {
  BAD_TX: 'payload does not deserialize',
  NOT_SPONSORED: 'transaction is not sponsored-auth',
  NONZERO_FEE: 'origin fee must be 0',
  NOT_CONTRACT_CALL: 'payload must be a contract call',
  CONTRACT_NOT_ALLOWED: 'contract not allowlisted',
  FUNCTION_NOT_ALLOWED: 'function must be buy',
  NO_POST_CONDITIONS: 'buyer post-conditions required',
  PC_MODE: 'post-condition mode must be deny'
};

const validatePayload = (txHex: string, markets: string[]) => {
  let tx;
  try {
    tx = deserializeTransaction(txHex);
  } catch {
    return { error: 'BAD_TX' as const };
  }
  if (tx.auth.authType !== AuthType.Sponsored) return { error: 'NOT_SPONSORED' as const };
  if (BigInt(tx.auth.spendingCondition.fee ?? 0n) !== 0n) return { error: 'NONZERO_FEE' as const };
  if (tx.payload.payloadType !== PayloadType.ContractCall) return { error: 'NOT_CONTRACT_CALL' as const };
  const payload = tx.payload as unknown as {
    contractAddress: Parameters<typeof addressToString>[0];
    contractName: { content: string };
    functionName: { content: string };
  };
  const contractId = `${addressToString(payload.contractAddress)}.${payload.contractName.content}`;
  if (!markets.includes(contractId)) return { error: 'CONTRACT_NOT_ALLOWED' as const };
  if (payload.functionName.content !== 'buy') return { error: 'FUNCTION_NOT_ALLOWED' as const };
  const pcs = (tx as unknown as { postConditions?: { values?: unknown[] } }).postConditions;
  if (!pcs?.values?.length) return { error: 'NO_POST_CONDITIONS' as const };
  if ((tx as unknown as { postConditionMode: PostConditionMode }).postConditionMode !== PostConditionMode.Deny) {
    return { error: 'PC_MODE' as const };
  }
  const buyer = addressToString({
    version:
      (tx as unknown as { version: TransactionVersion }).version === TransactionVersion.Mainnet
        ? AddressVersion.MainnetSingleSig
        : AddressVersion.TestnetSingleSig,
    hash160: (tx.auth.spendingCondition as { signer: string }).signer,
    type: 0
  } as Parameters<typeof addressToString>[0]);
  return { tx, contractId, buyer };
};

// ---------------------------------------------------------------- job store (D1)

const ensureTable = (env: SponsorEnv) =>
  run(env, `CREATE TABLE IF NOT EXISTS sponsor_jobs (
    id TEXT PRIMARY KEY,
    state TEXT NOT NULL,
    contract_id TEXT NOT NULL,
    listing_id TEXT NOT NULL,
    buyer TEXT,
    payload_hash TEXT UNIQUE,
    fee_ustx TEXT,
    buy_tx TEXT, claim_tx TEXT, refund_tx TEXT,
    error TEXT,
    created_at INTEGER NOT NULL
  )`);

type JobRow = {
  id: string; state: string; contract_id: string; listing_id: string;
  buyer: string | null; payload_hash: string | null; fee_ustx: string | null;
  buy_tx: string | null; claim_tx: string | null; refund_tx: string | null;
  error: string | null; created_at: number;
};

const jobJson = (job: JobRow) => ({
  id: job.id,
  state: job.state,
  txids: { buy: job.buy_tx ?? undefined, claim: job.claim_tx ?? undefined, refund: job.refund_tx ?? undefined },
  error: job.error ?? undefined
});

const sha256Hex = async (text: string) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
};

// ---------------------------------------------------------------- settlement (traffic-driven)

const settleBatch = async (env: SponsorEnv, key: string) => {
  const pending = (await queryAll(
    env,
    `SELECT * FROM sponsor_jobs WHERE state IN ('SPONSORED','CONFIRMED','CLAIMED') ORDER BY created_at LIMIT ?`,
    [SETTLE_BATCH]
  )) as JobRow[];
  for (const job of pending) {
    try {
      if (job.state === 'SPONSORED') {
        const status = await getTxStatus(env, job.buy_tx ?? '');
        if (status === 'pending') {
          if (Date.now() - job.created_at > SETTLE_TIMEOUT_MS) {
            await run(env, `UPDATE sponsor_jobs SET state='ABANDONED', error='buy tx timed out' WHERE id=?`, [job.id]);
          }
          continue;
        }
        if (status !== 'success') {
          await run(env, `UPDATE sponsor_jobs SET state='ABANDONED', error=? WHERE id=?`, [`buy tx ${status}`, job.id]);
          continue;
        }
        await run(env, `UPDATE sponsor_jobs SET state='CONFIRMED' WHERE id=?`, [job.id]);
        job.state = 'CONFIRMED';
      }
      if (job.state === 'CONFIRMED') {
        const claimTx = await sponsorCall(env, key, job.contract_id, 'claim-fee', [
          uintCV(BigInt(job.listing_id)),
          uintCV(BigInt(job.fee_ustx ?? '0'))
        ]);
        await run(env, `UPDATE sponsor_jobs SET state='CLAIMED', claim_tx=? WHERE id=?`, [claimTx, job.id]);
        job.state = 'CLAIMED';
        job.claim_tx = claimTx;
        continue; // let the claim confirm before refunding (next request)
      }
      if (job.state === 'CLAIMED') {
        const claimStatus = await getTxStatus(env, job.claim_tx ?? '');
        if (claimStatus === 'pending') continue;
        const refundTx = await sponsorCall(env, key, job.contract_id, 'settle-refund', [
          uintCV(BigInt(job.listing_id))
        ]);
        await run(env, `UPDATE sponsor_jobs SET state='SETTLED', refund_tx=? WHERE id=?`, [refundTx, job.id]);
      }
    } catch {
      // transient chain/nonce error: retry on a later request
    }
  }
};

// ---------------------------------------------------------------- handler

export const onRequest: PagesFunction<SponsorEnv> = async (context) => {
  const { request, env } = context;
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });

  const key = env.SPONSOR_KEY?.trim();
  if (!key) return err('RELAYER_DISABLED', 'sponsor relayer not configured (set the SPONSOR_KEY secret)', 503);

  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '');
  await ensureTable(env);

  // advance settlement on every request (bounded)
  await settleBatch(env, key);

  if (path.endsWith('/sponsor/quote') && request.method === 'POST') {
    const est = await estimateBuyFee(env);
    let budget = est * FEE_MULTIPLIER;
    if (budget < MIN_BUDGET_USTX) budget = MIN_BUDGET_USTX;
    if (budget > MAX_FEE_USTX) budget = MAX_FEE_USTX;
    return jsonResponse(
      {
        estimatedFeeUstx: est.toString(),
        budgetUstx: budget.toString(),
        minBudgetUstx: MIN_BUDGET_USTX.toString(),
        expiresAt: Date.now() + 5 * 60_000
      },
      200,
      CORS
    );
  }

  if (path.endsWith('/sponsor/submit') && request.method === 'POST') {
    const body = (await request.json().catch(() => ({}))) as {
      txHex?: string;
      contractId?: string;
      listingId?: string | number;
    };
    if (!body.txHex || !body.contractId || body.listingId === undefined) {
      return err('BAD_REQUEST', 'txHex, contractId, listingId required');
    }

    const unsettled = (await queryAll(
      env,
      `SELECT COUNT(*) as n FROM sponsor_jobs WHERE state NOT IN ('SETTLED','ABANDONED')`
    )) as Array<{ n: number }>;
    if ((unsettled[0]?.n ?? 0) >= MAX_UNSETTLED) return err('AT_CAPACITY', 'too many unsettled sponsorships', 503);

    const sponsorAddress = getAddressFromPrivateKey(key, TransactionVersion.Mainnet);
    if ((await getBalance(env, sponsorAddress)) < LOW_BALANCE_USTX) {
      return err('LOW_BALANCE', 'sponsor wallet below reserve; try a self-paid buy', 503);
    }

    const validated = validatePayload(body.txHex, allowlist(env));
    if ('error' in validated) return err('VALIDATION', VALIDATION[validated.error]);
    if (validated.contractId !== body.contractId) return err('VALIDATION', 'contractId mismatch');

    const listing = await getListing(env, body.contractId, String(body.listingId));
    if (!listing) return err('LISTING_NOT_FOUND', 'listing unknown');
    if (listing.soldAt !== null) return err('LISTING_SOLD', 'listing already sold');
    const fee = await estimateBuyFee(env);
    if (fee > MAX_FEE_USTX) return err('FEE_TOO_LARGE', 'network fee above relayer cap', 503);
    if (listing.budgetRemaining < fee) return err('BUDGET_TOO_SMALL', 'listing budget cannot cover the fee');

    const payloadHash = await sha256Hex(body.txHex);
    const existing = (await queryAll(env, `SELECT * FROM sponsor_jobs WHERE payload_hash=?`, [payloadHash])) as JobRow[];
    if (existing.length) return err('DUPLICATE', 'payload already sponsored', 409);

    const transaction = deserializeTransaction(body.txHex);
    const nonce = await getNonce(env, sponsorAddress);
    const sponsored = await sponsorTransaction({
      transaction,
      sponsorPrivateKey: key,
      fee,
      sponsorNonce: nonce,
      network
    });
    const res = await broadcastTransaction(sponsored, network);
    if ((res as { error?: string }).error) {
      return err('BROADCAST', String((res as { reason?: string }).reason ?? (res as { error?: string }).error), 502);
    }
    const buyTx = String((res as { txid?: string }).txid ?? res);
    const id = `sp-${Date.now().toString(36)}-${payloadHash.slice(0, 8)}`;
    await run(
      env,
      `INSERT INTO sponsor_jobs (id, state, contract_id, listing_id, buyer, payload_hash, fee_ustx, buy_tx, created_at)
       VALUES (?, 'SPONSORED', ?, ?, ?, ?, ?, ?, ?)`,
      [id, body.contractId, String(body.listingId), validated.buyer, payloadHash, fee.toString(), buyTx, Date.now()]
    );
    return jsonResponse({ id, state: 'SPONSORED', txids: { buy: buyTx } }, 200, CORS);
  }

  const statusMatch = path.match(/\/sponsor\/status\/([^/]+)$/);
  if (statusMatch && request.method === 'GET') {
    const rows = (await queryAll(env, `SELECT * FROM sponsor_jobs WHERE id=?`, [statusMatch[1]])) as JobRow[];
    if (!rows.length) return err('NOT_FOUND', 'job unknown', 404);
    return jsonResponse(jobJson(rows[0]), 200, CORS);
  }

  return err('NOT_FOUND', 'no such route', 404);
};
