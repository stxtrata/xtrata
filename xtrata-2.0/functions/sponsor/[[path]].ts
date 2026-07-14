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
 * NOTE: the validation rules here parallel svc/sponsor-service.mjs (the Node
 * local-dev adapter) but are implemented independently; direct tests for THIS
 * handler live in functions/sponsor/__tests__/handler.test.ts. The signed
 * transaction is the sole source of truth for contract, function and listing
 * id — request metadata may duplicate signed facts but never overrides them.
 */
import {
  AnchorMode,
  AuthType,
  ClarityType,
  NonFungibleConditionCode,
  PayloadType,
  PostConditionMode,
  TransactionVersion,
  addressToString,
  AddressVersion,
  broadcastTransaction,
  cvToJSON,
  cvToHex,
  createAssetInfo,
  deserializeTransaction,
  getAddressFromPrivateKey,
  hexToCV,
  makeContractCall,
  makeContractNonFungiblePostCondition,
  serializePostCondition,
  sponsorTransaction,
  uintCV
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import { jsonResponse } from '../lib/utils';
import { run, queryAll, type Env } from '../lib/db';
import { applyHiroApiKey, getHiroApiKeys, shouldRetryWithNextHiroKey } from '../lib/hiro-keys';

const DEPLOYER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const DEFAULT_MARKETS = [
  `${DEPLOYER}.xtrata-market-sponsored-stx-v1-1`,
  `${DEPLOYER}.xtrata-market-sponsored-sbtc-v1-1`,
  `${DEPLOYER}.xtrata-market-sponsored-usdcx-v1-1`,
  `${DEPLOYER}.xtrata-drops-v1-0`
];

// Buyer-facing function the relayer will sponsor per contract type.
// Drops contracts expose `claim` (free claim); markets expose `buy`.
const sponsoredFunction = (contractId: string) =>
  /\.xtrata-drops-/.test(contractId) ? 'claim' : 'buy';
const FEE_MULTIPLIER = 3n;
const MIN_BUDGET_USTX = 50_000n;
const MAX_FEE_USTX = 2_000_000n;
const LOW_BALANCE_USTX = 5_000_000n; // refuse below 5 STX float
const MAX_UNSETTLED = 20;
const SETTLE_BATCH = 4; // jobs advanced per incoming request
const SETTLE_TIMEOUT_MS = 2 * 3_600_000;
// A sponsored buy/claim tx is a few hundred bytes; cap the hex well above
// that but low enough to bound deserialization work on garbage input.
const MAX_TXHEX_CHARS = 20_000;
// Rolling per-origin limit (accepted jobs per address per window) so one
// wallet cannot fill the global unsettled queue. Mirrors the Node svc.
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 3_600_000;
// A job stuck in an in-flight signing state longer than this is assumed to
// have crashed between lease and broadcast; it reverts one state and retries.
// (Crash AFTER broadcast can cause one duplicate claim-fee attempt — bounded
// by the contract's budget/claim-cap and paid to the sponsor, never lost.)
const LEASE_TIMEOUT_MS = 15 * 60_000;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'content-type',
  'Cache-Control': 'no-store'
};

type SponsorEnv = Env & {
  SPONSOR_KEY?: string;
  SPONSOR_MARKETS?: string;
  HIRO_API_KEYS?: string;
  HIRO_API_KEY?: string;
  VITE_HIRO_API_KEY?: string;
};

type RelayerDiagnostics = {
  requestId: string;
  traceId?: string;
  stage: string;
};

const HIRO = 'https://api.hiro.so';

const allowlist = (env: SponsorEnv) =>
  (env.SPONSOR_MARKETS?.split(',').map((s) => s.trim()).filter(Boolean) ?? DEFAULT_MARKETS);

// ---------------------------------------------------------------- chain helpers

const hiroFetch = async (env: SponsorEnv, path: string, init: RequestInit = {}): Promise<Response> => {
  // HIRO_API_KEY historically held one key, while current deployments may
  // store a comma/newline list. Never place the raw secret in a header: an
  // embedded newline makes the Workers fetch API throw `Invalid header value`
  // before any request leaves the relayer.
  const keys = getHiroApiKeys(env as unknown as Record<string, unknown>);
  const attempts: Array<string | null> = [...keys, null];
  let lastError: unknown;
  for (let index = 0; index < attempts.length; index += 1) {
    const apiKey = attempts[index];
    const headers = new Headers(init.headers);
    try {
      applyHiroApiKey(headers, apiKey);
    } catch (error) {
      lastError = error;
      continue;
    }
    try {
      const response = await fetch(`${HIRO}${path}`, { ...init, headers });
      const hasAnotherAttempt = index < attempts.length - 1;
      if (hasAnotherAttempt && shouldRetryWithNextHiroKey(response.status)) {
        continue;
      }
      return response;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error('Hiro request failed');
};

const hiroJson = async <T>(env: SponsorEnv, path: string, init: RequestInit = {}): Promise<T> => {
  const response = await hiroFetch(env, path, init);
  if (!response.ok) {
    throw new Error(`Hiro request returned HTTP ${response.status}`);
  }
  try {
    return (await response.json()) as T;
  } catch {
    throw new Error('Hiro request returned invalid JSON');
  }
};

const estimateBuyFee = async (env: SponsorEnv): Promise<bigint> => {
  try {
    const rate = Number(await hiroJson<unknown>(env, '/v2/fees/transfer'));
    return BigInt(Math.max(3000, rate * 600));
  } catch {
    return 30_000n;
  }
};

const getBalance = async (env: SponsorEnv, address: string): Promise<bigint> => {
  const result = await hiroJson<{ balance?: unknown }>(env, `/extended/v1/address/${address}/stx`);
  if (typeof result.balance !== 'string' || !/^\d+$/.test(result.balance)) {
    throw new Error('Hiro balance response is missing a decimal balance');
  }
  return BigInt(result.balance);
};

const getNonce = async (env: SponsorEnv, address: string): Promise<bigint> => {
  const j = await hiroJson<{ possible_next_nonce?: number }>(env, `/extended/v1/address/${address}/nonces`);
  return BigInt(j.possible_next_nonce ?? 0);
};

const getTxStatus = async (env: SponsorEnv, txid: string): Promise<string> => {
  const r = await hiroFetch(env, `/extended/v1/tx/0x${txid.replace(/^0x/, '')}`);
  if (!r.ok) return 'pending';
  const j = (await r.json()) as { tx_status?: string };
  return j.tx_status ?? 'pending';
};

const getListing = async (env: SponsorEnv, contractId: string, listingId: string) => {
  const [address, name] = contractId.split('.');
  const j = await hiroJson<{ okay?: boolean; result?: string }>(
    env,
    `/v2/contracts/call-read/${address}/${name}/get-listing`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender: address, arguments: [cvToHex(uintCV(BigInt(listingId)))] })
    }
  );
  if (!j.okay || !j.result) return null;
  const parsed = cvToJSON(hexToCV(j.result)) as { value?: { value?: Record<string, { value: unknown }> } };
  const rec = parsed?.value?.value;
  if (!rec) return null;
  const soldRaw = (rec['sold-at'] as { value?: { value?: unknown } | null })?.value ?? null;
  return {
    budgetRemaining: BigInt(String((rec['budget-remaining'] as { value: unknown }).value)),
    nftContract: String((rec['nft-contract'] as { value: unknown }).value),
    tokenId: BigInt(String((rec['token-id'] as { value: unknown }).value)),
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
  FUNCTION_NOT_ALLOWED: 'function must be buy (markets) or claim (drops)',
  BAD_ARGS: 'call arguments must be (nft-contract <trait>, listing-id uint)',
  WRONG_NETWORK: 'transaction is not a mainnet transaction',
  NO_POST_CONDITIONS: 'buyer post-conditions required',
  PC_MODE: 'post-condition mode must be deny',
  WRONG_POST_CONDITIONS: 'post-conditions do not exactly authorize the selected NFT claim'
};

const bytesToHex = (bytes: Uint8Array) =>
  [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');

const hasExactDropClaimPostCondition = (
  tx: ReturnType<typeof deserializeTransaction>,
  contractId: string,
  listing: { nftContract: string; tokenId: bigint }
) => {
  if (!/\.xtrata-drops-/.test(contractId)) return true;
  const actual = (tx as unknown as { postConditions?: { values?: unknown[] } }).postConditions?.values ?? [];
  if (actual.length !== 1) return false;
  const [dropAddress, dropName] = contractId.split('.');
  const [nftAddress, nftName] = listing.nftContract.split('.');
  if (!dropAddress || !dropName || !nftAddress || !nftName) return false;
  const expected = makeContractNonFungiblePostCondition(
    dropAddress,
    dropName,
    NonFungibleConditionCode.Sends,
    createAssetInfo(nftAddress, nftName, 'xtrata-inscription'),
    uintCV(listing.tokenId)
  );
  try {
    return bytesToHex(serializePostCondition(actual[0] as Parameters<typeof serializePostCondition>[0])) ===
      bytesToHex(serializePostCondition(expected));
  } catch {
    return false;
  }
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
  if (payload.functionName.content !== sponsoredFunction(contractId)) {
    return { error: 'FUNCTION_NOT_ALLOWED' as const };
  }
  if ((tx as unknown as { version: TransactionVersion }).version !== TransactionVersion.Mainnet) {
    return { error: 'WRONG_NETWORK' as const };
  }
  // SIGNED-ARG BINDING: both `buy` and `claim` take (nft-contract <trait>,
  // id uint). Decode them from the signed transaction — these, not the
  // request body, are the authoritative facts the relayer acts on.
  const args = (payload as unknown as { functionArgs?: unknown[] }).functionArgs ?? [];
  const nftArg = args[0] as
    | {
        type?: ClarityType;
        address?: Parameters<typeof addressToString>[0];
        contractName?: { content: string };
      }
    | undefined;
  const idArg = args[1] as { type?: ClarityType; value?: bigint } | undefined;
  if (
    args.length !== 2 ||
    nftArg?.type !== ClarityType.PrincipalContract ||
    !nftArg.address ||
    !nftArg.contractName ||
    idArg?.type !== ClarityType.UInt ||
    typeof idArg.value !== 'bigint'
  ) {
    return { error: 'BAD_ARGS' as const };
  }
  const nftContractId = `${addressToString(nftArg.address)}.${nftArg.contractName.content}`;
  const listingId = idArg.value;
  const pcs = (tx as unknown as { postConditions?: { values?: unknown[] } }).postConditions;
  if (!pcs?.values?.length) return { error: 'NO_POST_CONDITIONS' as const };
  if ((tx as unknown as { postConditionMode: PostConditionMode }).postConditionMode !== PostConditionMode.Deny) {
    return { error: 'PC_MODE' as const };
  }
  const buyer = addressToString({
    version: AddressVersion.MainnetSingleSig,
    hash160: (tx.auth.spendingCondition as { signer: string }).signer,
    type: 0
  } as Parameters<typeof addressToString>[0]);
  return { tx, contractId, buyer, listingId, nftContractId };
};

// ---------------------------------------------------------------- job store (D1)

const ensureTable = async (env: SponsorEnv) => {
  await run(env, `CREATE TABLE IF NOT EXISTS sponsor_jobs (
    id TEXT PRIMARY KEY,
    state TEXT NOT NULL,
    contract_id TEXT NOT NULL,
    listing_id TEXT NOT NULL,
    buyer TEXT,
    payload_hash TEXT UNIQUE,
    fee_ustx TEXT,
    buy_tx TEXT, claim_tx TEXT, refund_tx TEXT,
    error TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER
  )`);
  // Older deployments lack updated_at; ALTER is idempotent via the catch.
  await run(env, `ALTER TABLE sponsor_jobs ADD COLUMN updated_at INTEGER`).catch(() => undefined);
  await run(env, `ALTER TABLE sponsor_jobs ADD COLUMN reservation_key TEXT`).catch(() => undefined);
  await run(env, `CREATE UNIQUE INDEX IF NOT EXISTS idx_sponsor_jobs_reservation ON sponsor_jobs (reservation_key)`).catch(
    () => undefined
  );
  await run(env, `CREATE INDEX IF NOT EXISTS idx_sponsor_jobs_buyer ON sponsor_jobs (buyer, created_at)`).catch(
    () => undefined
  );
};

// D1's .all() wraps rows in { results }; the raw cast was a latent bug.
const rows = async <T>(env: SponsorEnv, query: string, binds: unknown[] = []): Promise<T[]> => {
  const result = (await queryAll(env, query, binds)) as { results?: unknown[] };
  return (result.results ?? []) as T[];
};

// Atomic conditional transition: returns true only if THIS request moved the
// row (exactly one change), so concurrent requests cannot double-broadcast.
const transition = async (
  env: SponsorEnv,
  id: string,
  from: string,
  to: string,
  extra: { sets?: string; binds?: unknown[] } = {}
): Promise<boolean> => {
  const result = (await run(
    env,
    `UPDATE sponsor_jobs SET state=?, updated_at=?, reservation_key=CASE WHEN ? IN ('SETTLED','ABANDONED') THEN NULL ELSE reservation_key END${extra.sets ? `, ${extra.sets}` : ''} WHERE id=? AND state=?`,
    [to, Date.now(), to, ...(extra.binds ?? []), id, from]
  )) as { meta?: { changes?: number } };
  return (result.meta?.changes ?? 0) === 1;
};

type JobRow = {
  id: string; state: string; contract_id: string; listing_id: string;
  buyer: string | null; payload_hash: string | null; fee_ustx: string | null;
  buy_tx: string | null; claim_tx: string | null; refund_tx: string | null;
  error: string | null; created_at: number;
  reservation_key?: string | null;
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
  // Recover jobs stranded in an in-flight signing state by a crashed worker:
  // after LEASE_TIMEOUT_MS they revert one state and get retried.
  const staleBefore = Date.now() - LEASE_TIMEOUT_MS;
  await run(
    env,
    `UPDATE sponsor_jobs SET state='CONFIRMED', updated_at=? WHERE state='CLAIMING' AND COALESCE(updated_at, created_at) < ?`,
    [Date.now(), staleBefore]
  ).catch(() => undefined);
  await run(
    env,
    `UPDATE sponsor_jobs SET state='CLAIMED', updated_at=? WHERE state='REFUNDING' AND COALESCE(updated_at, created_at) < ?`,
    [Date.now(), staleBefore]
  ).catch(() => undefined);
  // RECEIVED = reserved but never broadcast (worker crashed pre-broadcast).
  await run(
    env,
    `UPDATE sponsor_jobs SET state='ABANDONED', reservation_key=NULL, error='never broadcast', updated_at=? WHERE state='RECEIVED' AND COALESCE(updated_at, created_at) < ?`,
    [Date.now(), staleBefore]
  ).catch(() => undefined);

  const pending = await rows<JobRow>(
    env,
    `SELECT * FROM sponsor_jobs WHERE state IN ('SPONSORED','CONFIRMED','CLAIMED') ORDER BY created_at LIMIT ?`,
    [SETTLE_BATCH]
  );
  for (const job of pending) {
    try {
      if (job.state === 'SPONSORED') {
        const status = await getTxStatus(env, job.buy_tx ?? '');
        if (status === 'pending') {
          if (Date.now() - job.created_at > SETTLE_TIMEOUT_MS) {
            await transition(env, job.id, 'SPONSORED', 'ABANDONED', {
              sets: 'error=?',
              binds: ['buy tx timed out']
            });
          }
          continue;
        }
        if (status !== 'success') {
          await transition(env, job.id, 'SPONSORED', 'ABANDONED', {
            sets: 'error=?',
            binds: [`buy tx ${status}`]
          });
          continue;
        }
        if (!(await transition(env, job.id, 'SPONSORED', 'CONFIRMED'))) continue;
        job.state = 'CONFIRMED';
      }
      if (job.state === 'CONFIRMED') {
        // Lease the job before touching the hot wallet: only the request
        // that wins this transition broadcasts the claim-fee.
        if (!(await transition(env, job.id, 'CONFIRMED', 'CLAIMING'))) continue;
        const claimTx = await sponsorCall(env, key, job.contract_id, 'claim-fee', [
          uintCV(BigInt(job.listing_id)),
          uintCV(BigInt(job.fee_ustx ?? '0'))
        ]);
        await transition(env, job.id, 'CLAIMING', 'CLAIMED', { sets: 'claim_tx=?', binds: [claimTx] });
        continue; // let the claim confirm before refunding (next request)
      }
      if (job.state === 'CLAIMED') {
        const claimStatus = await getTxStatus(env, job.claim_tx ?? '');
        if (claimStatus === 'pending') continue;
        if (!(await transition(env, job.id, 'CLAIMED', 'REFUNDING'))) continue;
        const refundTx = await sponsorCall(env, key, job.contract_id, 'settle-refund', [
          uintCV(BigInt(job.listing_id))
        ]);
        await transition(env, job.id, 'REFUNDING', 'SETTLED', { sets: 'refund_tx=?', binds: [refundTx] });
      }
    } catch (error) {
      // Broadcast failed after a lease was taken: record the reason and put
      // the job back so a later request retries (instead of silently
      // swallowing every settlement error).
      const message = error instanceof Error ? error.message : String(error);
      await transition(env, job.id, 'CLAIMING', 'CONFIRMED', { sets: 'error=?', binds: [message] }).catch(
        () => undefined
      );
      await transition(env, job.id, 'REFUNDING', 'CLAIMED', { sets: 'error=?', binds: [message] }).catch(
        () => undefined
      );
    }
  }
};

// ---------------------------------------------------------------- handler

const handleRequest = async (
  context: Parameters<PagesFunction<SponsorEnv>>[0],
  diagnostics: RelayerDiagnostics
): Promise<Response> => {
  const { request, env } = context;
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });

  const fail = (code: string, message: string, status = 400, headers: HeadersInit = CORS) =>
    jsonResponse({ code, message, requestId: diagnostics.requestId, stage: diagnostics.stage }, status, headers);
  const rawKey = env.SPONSOR_KEY?.trim();
  if (!rawKey) return fail('RELAYER_DISABLED', 'sponsor relayer not configured (set the SPONSOR_KEY secret)', 503);
  // Secrets are commonly pasted with 0x, but @stacks/transactions expects
  // canonical key hex (optionally ending in the 01 compression marker).
  const key = rawKey.replace(/^0x/i, '');
  if (!/^[0-9a-f]{64}(?:01)?$/i.test(key)) {
    return fail('RELAYER_KEY_INVALID', 'sponsor relayer key is not valid Stacks private-key hex', 503);
  }
  let sponsorAddress: string;
  try {
    sponsorAddress = getAddressFromPrivateKey(key, TransactionVersion.Mainnet);
  } catch {
    return fail('RELAYER_KEY_INVALID', 'sponsor relayer key could not derive a Stacks address', 503);
  }

  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '');
  diagnostics.stage = 'DB_INIT';
  await ensureTable(env);

  // advance settlement on every request (bounded)
  diagnostics.stage = 'SETTLEMENT';
  await settleBatch(env, key);

  if (path.endsWith('/sponsor/quote') && request.method === 'POST') {
    diagnostics.stage = 'QUOTE';
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
    diagnostics.stage = 'SUBMIT_PARSE';
    const body = (await request.json().catch(() => ({}))) as {
      txHex?: string;
      contractId?: string;
      listingId?: string | number;
    };
    if (!body.txHex || !body.contractId || body.listingId === undefined) {
      return fail('BAD_REQUEST', 'txHex, contractId, listingId required');
    }
    // Cheap offline checks FIRST: no chain reads, no wallet, no D1 writes
    // happen until the signed payload itself has been validated.
    diagnostics.stage = 'SUBMIT_VALIDATE';
    const txHex = String(body.txHex).replace(/^0x/, '');
    if (txHex.length > MAX_TXHEX_CHARS || !/^[0-9a-fA-F]+$/.test(txHex) || txHex.length % 2 !== 0) {
      return fail('VALIDATION', 'txHex must be canonical hex within size limits');
    }
    if (!/^\d+$/.test(String(body.listingId))) {
      return fail('VALIDATION', 'listingId must be an unsigned decimal integer');
    }

    const validated = validatePayload(txHex, allowlist(env));
    if ('error' in validated) return fail('VALIDATION', VALIDATION[validated.error]);
    // The SIGNED transaction is authoritative. Request metadata must agree
    // with it exactly — otherwise the relayer would check one listing's
    // budget and settle against it while broadcasting a different call.
    if (validated.contractId !== body.contractId) return fail('VALIDATION', 'contractId mismatch with signed transaction');
    if (validated.listingId !== BigInt(String(body.listingId))) {
      return fail('VALIDATION', 'listingId mismatch with signed transaction');
    }
    const contractId = validated.contractId;
    const listingId = validated.listingId;

    // Rolling per-origin limit: one wallet cannot fill the global queue.
    diagnostics.stage = 'SUBMIT_RATE_LIMIT';
    const recent = await rows<{ n: number }>(
      env,
      `SELECT COUNT(*) as n FROM sponsor_jobs WHERE buyer=? AND created_at > ? AND state != 'ABANDONED'`,
      [validated.buyer, Date.now() - RATE_LIMIT_WINDOW_MS]
    );
    if ((recent[0]?.n ?? 0) >= RATE_LIMIT_MAX) {
      return fail(
        'RATE_LIMITED',
        'too many recent sponsorships for this address',
        429,
        { ...CORS, 'Retry-After': '600' }
      );
    }

    const unsettled = await rows<{ n: number }>(
      env,
      `SELECT COUNT(*) as n FROM sponsor_jobs WHERE state NOT IN ('SETTLED','ABANDONED')`
    );
    if ((unsettled[0]?.n ?? 0) >= MAX_UNSETTLED) return fail('AT_CAPACITY', 'too many unsettled sponsorships', 503);

    diagnostics.stage = 'SPONSOR_BALANCE';
    let sponsorBalance: bigint;
    try {
      sponsorBalance = await getBalance(env, sponsorAddress);
    } catch (error) {
      console.error('[sponsor:balance]', {
        requestId: diagnostics.requestId,
        traceId: diagnostics.traceId,
        sponsorAddress,
        error: error instanceof Error ? error.message : String(error)
      });
      return fail('RELAYER_UNAVAILABLE', 'sponsor balance lookup unavailable; retry shortly', 503);
    }
    if (sponsorBalance < LOW_BALANCE_USTX) {
      return fail('LOW_BALANCE', 'sponsor wallet below reserve; try a self-paid buy', 503);
    }

    diagnostics.stage = 'LISTING_READ';
    const listing = await getListing(env, contractId, listingId.toString());
    if (!listing) return fail('LISTING_NOT_FOUND', 'listing unknown');
    if (listing.soldAt !== null) return fail('LISTING_SOLD', 'listing already sold');
    if (listing.nftContract !== validated.nftContractId) {
      return fail('VALIDATION', 'nft contract mismatch between signed transaction and listing');
    }
    if (!hasExactDropClaimPostCondition(validated.tx, contractId, listing)) {
      return fail('VALIDATION', VALIDATION.WRONG_POST_CONDITIONS);
    }
    diagnostics.stage = 'FEE_ESTIMATE';
    const fee = await estimateBuyFee(env);
    if (fee > MAX_FEE_USTX) return fail('FEE_TOO_LARGE', 'network fee above relayer cap', 503);
    if (listing.budgetRemaining < fee) return fail('BUDGET_TOO_SMALL', 'listing budget cannot cover the fee');

    // Reserve the payload hash BEFORE broadcasting: the unique constraint
    // makes concurrent duplicate submissions collide here, not at the wallet.
    diagnostics.stage = 'JOB_RESERVATION';
    const payloadHash = await sha256Hex(txHex);
    const id = `sp-${Date.now().toString(36)}-${payloadHash.slice(0, 8)}`;
    try {
      await run(
        env,
        `INSERT INTO sponsor_jobs (id, state, contract_id, listing_id, buyer, payload_hash, reservation_key, fee_ustx, created_at, updated_at)
         VALUES (?, 'RECEIVED', ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, contractId, listingId.toString(), validated.buyer, payloadHash, `${contractId}:${listingId}`, fee.toString(), Date.now(), Date.now()]
      );
    } catch {
      const existing = await rows<JobRow>(env, `SELECT * FROM sponsor_jobs WHERE payload_hash=?`, [payloadHash]);
      if (existing.length) {
        return jsonResponse({ code: 'DUPLICATE', message: 'payload already sponsored', requestId: diagnostics.requestId, stage: diagnostics.stage, ...jobJson(existing[0]) }, 409, CORS);
      }
      const reserved = await rows<JobRow>(
        env,
        `SELECT * FROM sponsor_jobs WHERE reservation_key=? AND state NOT IN ('SETTLED','ABANDONED')`,
        [`${contractId}:${listingId}`]
      );
      if (reserved.length) {
        return jsonResponse({ code: 'LISTING_BUSY', message: 'this drop or listing already has a sponsorship in progress', requestId: diagnostics.requestId, stage: diagnostics.stage, ...jobJson(reserved[0]) }, 409, CORS);
      }
      return fail('DUPLICATE', 'payload already sponsored', 409);
    }

    const transaction = deserializeTransaction(txHex);
    diagnostics.stage = 'SPONSOR_NONCE';
    const nonce = await getNonce(env, sponsorAddress);
    diagnostics.stage = 'SPONSOR_SIGN';
    const sponsored = await sponsorTransaction({
      transaction,
      sponsorPrivateKey: key,
      fee,
      sponsorNonce: nonce,
      network
    });
    diagnostics.stage = 'BROADCAST';
    const res = await broadcastTransaction(sponsored, network);
    if ((res as { error?: string }).error) {
      const reason = String((res as { reason?: string }).reason ?? (res as { error?: string }).error);
      await transition(env, id, 'RECEIVED', 'ABANDONED', { sets: 'error=?', binds: [`broadcast: ${reason}`] });
      return fail('BROADCAST', reason, 502);
    }
    const buyTx = String((res as { txid?: string }).txid ?? res);
    await transition(env, id, 'RECEIVED', 'SPONSORED', { sets: 'buy_tx=?', binds: [buyTx] });
    return jsonResponse({ id, state: 'SPONSORED', txids: { buy: buyTx } }, 200, CORS);
  }

  const statusMatch = path.match(/\/sponsor\/status\/([^/]+)$/);
  if (statusMatch && request.method === 'GET') {
    diagnostics.stage = 'STATUS';
    const found = await rows<JobRow>(env, `SELECT * FROM sponsor_jobs WHERE id=?`, [statusMatch[1]]);
    if (!found.length) return fail('NOT_FOUND', 'job unknown', 404);
    return jsonResponse(jobJson(found[0]), 200, CORS);
  }

  return fail('NOT_FOUND', 'no such route', 404);
};

export const onRequest: PagesFunction<SponsorEnv> = async (context) => {
  const requestId = crypto.randomUUID();
  const traceId = context.request.headers.get('cf-ray') ?? undefined;
  const diagnostics: RelayerDiagnostics = { requestId, traceId, stage: 'REQUEST_PREFLIGHT' };
  try {
    return await handleRequest(context, diagnostics);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const path = new URL(context.request.url).pathname;
    console.error('[sponsor:request]', {
      requestId,
      traceId,
      stage: diagnostics.stage,
      method: context.request.method,
      path,
      error: message
    });
    return jsonResponse(
      {
        code: 'RELAYER_INTERNAL',
        message: `sponsor relayer failed during ${diagnostics.stage}`,
        requestId,
        stage: diagnostics.stage,
        ...(traceId ? { traceId } : {})
      },
      500,
      CORS
    );
  }
};
