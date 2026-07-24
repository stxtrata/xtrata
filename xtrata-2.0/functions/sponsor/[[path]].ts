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
 * Setup (once): set SPONSOR_KEY to the fee hot-wallet key. Drops v1.1 also
 * requires BNS_ATTESTATION_PRIVATE_KEY, whose compressed public-key hash160 must match
 * get-bns-attestor-pubkey-hash on-chain. Optional: SPONSOR_MARKETS to override
 * the allowlist, HIRO_API_KEY for rate limits.
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
  bufferCV,
  cvToJSON,
  cvToHex,
  createAssetInfo,
  deserializeTransaction,
  getAddressFromPrivateKey,
  hexToCV,
  makeContractCall,
  makeContractNonFungiblePostCondition,
  principalCV,
  serializePostCondition,
  sponsorTransaction,
  uintCV,
  validateStacksAddress
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import { jsonResponse } from '../lib/utils';
import { run, queryAll, type Env } from '../lib/db';
import { applyHiroApiKey, getHiroApiKeys, shouldRetryWithNextHiroKey } from '../lib/hiro-keys';
import { getDropsCollectionLockForDrop } from '../../src/lib/drops/collection-lock';
import {
  DEFAULT_DROP_POLICY_RULES,
  hasBnsPolicy,
  normalizeDropBnsName,
  normalizeDropPolicyRules,
  type DropPolicyRules
} from '../../src/lib/drops/policies';
import {
  CAMPAIGN_ATTESTATION_TTL_BLOCKS,
  DROPS_V11_MAINNET_CONTRACT_ID,
  attestorPubkeyHash,
  bnsNameKey,
  campaignBytesToHex,
  signCampaignAttestation,
  verifyCampaignAttestation
} from '../../src/lib/drops/campaign-attestation';

const DEPLOYER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const DEFAULT_MARKETS = [
  `${DEPLOYER}.xtrata-market-sponsored-stx-v1-1`,
  `${DEPLOYER}.xtrata-market-sponsored-sbtc-v1-1`,
  `${DEPLOYER}.xtrata-market-sponsored-usdcx-v1-1`,
  `${DEPLOYER}.xtrata-drops-v1-0`,
  DROPS_V11_MAINNET_CONTRACT_ID
];

// Buyer-facing function the relayer will sponsor per contract type.
// Drops contracts expose `claim` (free claim); markets expose `buy`.
// Contract IDs still require an exact entry in SPONSOR_MARKETS. Recognising
// the dedicated PoF ABI here only selects the correct parser/function after
// that allowlist gate; it does not grant sponsorship by contract name.
const isProofOfFreeContract = (contractId: string) =>
  /\.proof-of-free-v1$/.test(contractId);
const isDropsContract = (contractId: string) =>
  /\.xtrata-drops-/.test(contractId) || isProofOfFreeContract(contractId);
const isCampaignDropsContract = (contractId: string) =>
  contractId === DROPS_V11_MAINNET_CONTRACT_ID || isProofOfFreeContract(contractId);
const sponsoredFunction = (contractId: string) =>
  isCampaignDropsContract(contractId)
    ? 'claim-campaign'
    : isDropsContract(contractId)
      ? 'claim'
      : 'buy';
const FEE_MULTIPLIER = 3n;
const MIN_BUDGET_USTX = 50_000n;
const MAX_FEE_USTX = 2_000_000n;
const LOW_BALANCE_USTX = 5_000_000n; // refuse below 5 STX float
const MAX_UNSETTLED = 20;
const SETTLE_BATCH = 4; // jobs advanced per incoming request
const SETTLE_TIMEOUT_MS = 2 * 3_600_000;
// Mempool drop statuses can race block ingestion: Hiro may briefly report a
// transaction as dropped_replace_by_fee from one index while the canonical
// transaction endpoint is about to expose that exact tx as successful. Do
// not turn a single early observation into a terminal user-facing failure.
const TX_TERMINAL_GRACE_MS = 60_000;
// A sponsored buy/claim tx is a few hundred bytes; cap the hex well above
// that but low enough to bound deserialization work on garbage input.
const MAX_TXHEX_CHARS = 20_000;
// Rolling per-origin limit (accepted jobs per address per window) so one
// wallet cannot fill the global unsettled queue. Mirrors the Node svc.
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 3_600_000;
// A reservation has no durable transaction id until broadcast succeeds. Keep
// this short so a transport exception cannot block the same free drop for the
// full settlement lease. Retrying the identical tx is safe and idempotent.
const RECEIVED_TIMEOUT_MS = 2 * 60_000;
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
  BNS_ATTESTATION_PRIVATE_KEY?: string;
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
const BNS_V2 = 'https://api.bnsv2.com';

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

type HiroBroadcastResult = { txid: string } | { error: string; reason?: string };

const isTransactionKnown = async (env: SponsorEnv, txid: string): Promise<boolean> => {
  try {
    const response = await hiroFetch(env, `/extended/v1/tx/0x${txid.replace(/^0x/, '')}`);
    return response.ok;
  } catch {
    return false;
  }
};

const broadcastViaHiro = async (
  env: SponsorEnv,
  tx: ReturnType<typeof deserializeTransaction>
): Promise<HiroBroadcastResult> => {
  const expectedTxid = tx.txid().replace(/^0x/, '');
  let response: Response;
  try {
    response = await hiroFetch(env, '/v2/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: tx.serialize() as BodyInit
    });
  } catch (error) {
    // A transport can lose the response after the node accepted the bytes.
    // Treat the exact transaction as accepted if Hiro already knows its txid.
    if (await isTransactionKnown(env, expectedTxid)) return { txid: expectedTxid };
    throw error;
  }

  const text = await response.text();
  if (response.ok) {
    const txid = text.trim().replace(/^"|"$/g, '').replace(/^0x/, '');
    if (!/^[0-9a-f]{64}$/i.test(txid)) {
      throw new Error('Hiro broadcast returned an invalid transaction id');
    }
    return { txid };
  }

  // Retrying after a lost response can produce a duplicate/nonce rejection
  // even though this exact transaction is already in the mempool.
  if (await isTransactionKnown(env, expectedTxid)) return { txid: expectedTxid };
  let rejected: { error?: unknown; reason?: unknown } = {};
  try {
    rejected = JSON.parse(text) as { error?: unknown; reason?: unknown };
  } catch {
    // Preserve only the HTTP status when the upstream body is not structured.
  }
  const error = String(rejected.error ?? `HTTP ${response.status}`);
  const reason = String(rejected.reason ?? rejected.error ?? `Hiro broadcast returned HTTP ${response.status}`);
  return { error, reason };
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

const getStacksTipHeight = async (env: SponsorEnv): Promise<bigint> => {
  const body = await hiroJson<{ stacks_tip_height?: unknown }>(env, '/v2/info');
  const value = Number(body.stacks_tip_height);
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error('Hiro returned an invalid Stacks tip height');
  }
  return BigInt(value);
};

const callReadOnlyJson = async (
  env: SponsorEnv,
  contractId: string,
  functionName: string,
  args: string[] = []
) => {
  const [address, name] = contractId.split('.');
  const result = await hiroJson<{ okay?: boolean; result?: string }>(
    env,
    `/v2/contracts/call-read/${address}/${name}/${functionName}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender: address, arguments: args })
    }
  );
  if (!result.okay || !result.result) return null;
  return cvToJSON(hexToCV(result.result)) as { type?: string; value?: unknown };
};

const unwrapJsonNode = (node: unknown): unknown => {
  let current = node;
  while (
    current &&
    typeof current === 'object' &&
    typeof (current as { type?: unknown }).type === 'string' &&
    ((current as { type: string }).type.startsWith('(optional') ||
      (current as { type: string }).type.startsWith('(response'))
  ) {
    current = (current as { value?: unknown }).value ?? null;
  }
  return current;
};

const tupleRecord = (node: unknown) => {
  const unwrapped = unwrapJsonNode(node) as { type?: unknown; value?: unknown } | null;
  return unwrapped &&
    typeof unwrapped.type === 'string' &&
    unwrapped.type.startsWith('(tuple') &&
    unwrapped.value &&
    typeof unwrapped.value === 'object'
    ? (unwrapped.value as Record<string, { type?: string; value?: unknown }>)
    : null;
};

const optionalUintJson = (node: { value?: unknown } | undefined): bigint | null => {
  const unwrapped = unwrapJsonNode(node) as { type?: unknown; value?: unknown } | null;
  return unwrapped?.type === 'uint' && typeof unwrapped.value === 'string'
    ? BigInt(unwrapped.value)
    : null;
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
    seller: String((rec.seller as { value: unknown }).value),
    budgetRemaining: BigInt(String((rec['budget-remaining'] as { value: unknown }).value)),
    nftContract: String((rec['nft-contract'] as { value: unknown }).value),
    tokenId: BigInt(String((rec['token-id'] as { value: unknown }).value)),
    soldAt: soldRaw === null || soldRaw === undefined ? null : String((soldRaw as { value?: unknown }).value ?? soldRaw)
  };
};

const getDrop = async (env: SponsorEnv, contractId: string, dropId: string) => {
  const [address, name] = contractId.split('.');
  const j = await hiroJson<{ okay?: boolean; result?: string }>(
    env,
    `/v2/contracts/call-read/${address}/${name}/get-drop`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender: address, arguments: [cvToHex(uintCV(BigInt(dropId)))] })
    }
  );
  if (!j.okay || !j.result) return null;
  const parsed = cvToJSON(hexToCV(j.result)) as { value?: { value?: Record<string, { value: unknown }> } };
  const rec = parsed?.value?.value;
  if (!rec) return null;
  const claimedRaw = (rec['claimed-at'] as { value?: { value?: unknown } | null })?.value ?? null;
  return {
    creator: String((rec.creator as { value: unknown }).value),
    groupId: BigInt(String((rec['group-id'] as { value: unknown }).value)),
    nftContract: String((rec['nft-contract'] as { value: unknown }).value),
    tokenId: BigInt(String((rec['token-id'] as { value: unknown }).value)),
    claimedAt:
      claimedRaw === null || claimedRaw === undefined
        ? null
        : String((claimedRaw as { value?: unknown }).value ?? claimedRaw),
    campaignId: optionalUintJson(rec['campaign-id']),
    edition: optionalUintJson(rec.edition)
  };
};

const getCampaign = async (env: SponsorEnv, contractId: string, campaignId: bigint) => {
  const tuple = tupleRecord(
    await callReadOnlyJson(env, contractId, 'get-campaign', [cvToHex(uintCV(campaignId))])
  );
  if (!tuple) return null;
  const readBool = (key: string) => tuple[key]?.type === 'bool' && tuple[key]?.value === true;
  return {
    creator: String(tuple.creator?.value ?? ''),
    active: readBool('active'),
    onePerWallet: readBool('one-per-wallet'),
    requireBnsName: readBool('require-bns'),
    onePerBnsName: readBool('one-per-bns'),
    maxSupply: BigInt(String(tuple['max-supply']?.value ?? 0)),
    dropsCreated: BigInt(String(tuple['drops-created']?.value ?? 0))
  };
};

const getConfiguredAttestorHash = async (env: SponsorEnv, contractId: string) => {
  const json = await callReadOnlyJson(env, contractId, 'get-bns-attestor-pubkey-hash');
  const value = unwrapJsonNode(json) as { type?: unknown; value?: unknown } | null;
  return value?.type === '(buff 20)' && typeof value.value === 'string'
    ? value.value.replace(/^0x/i, '').toLowerCase()
    : null;
};

const dropPolicyScopeKey = (contractId: string, creator: string, groupId: string | bigint) =>
  `${contractId}:${creator}:${String(groupId)}`;

type DropPolicyRow = {
  scope_key: string;
  contract_id: string;
  creator: string;
  group_id: string;
  one_per_wallet: number;
  require_bns_name: number;
  one_per_bns_name: number;
  tx_id?: string | null;
};

const rowToDropPolicy = (row?: DropPolicyRow | null): DropPolicyRules =>
  normalizeDropPolicyRules(row
    ? {
        onePerWallet: row.one_per_wallet === 1,
        requireBnsName: row.require_bns_name === 1,
        onePerBnsName: row.one_per_bns_name === 1
      }
    : DEFAULT_DROP_POLICY_RULES);

const getDropPolicy = async (
  env: SponsorEnv,
  contractId: string,
  creator: string,
  groupId: string | bigint
): Promise<DropPolicyRules> => {
  const found = await rows<DropPolicyRow>(
    env,
    `SELECT * FROM drop_policies WHERE scope_key=?`,
    [dropPolicyScopeKey(contractId, creator, groupId)]
  );
  return rowToDropPolicy(found[0]);
};

const saveDropPolicy = async (
  env: SponsorEnv,
  params: {
    contractId: string;
    creator: string;
    groupId: string | bigint;
    rules: DropPolicyRules;
    txId?: string | null;
  }
) => {
  const rules = normalizeDropPolicyRules(params.rules);
  const now = Date.now();
  await run(
    env,
    `INSERT OR REPLACE INTO drop_policies (
       scope_key, contract_id, creator, group_id,
       one_per_wallet, require_bns_name, one_per_bns_name,
       tx_id, created_at, updated_at
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, COALESCE((SELECT created_at FROM drop_policies WHERE scope_key=?), ?), ?)`,
    [
      dropPolicyScopeKey(params.contractId, params.creator, params.groupId),
      params.contractId,
      params.creator,
      String(params.groupId),
      rules.onePerWallet ? 1 : 0,
      rules.requireBnsName ? 1 : 0,
      rules.onePerBnsName ? 1 : 0,
      params.txId ?? null,
      dropPolicyScopeKey(params.contractId, params.creator, params.groupId),
      now,
      now
    ]
  );
  return rules;
};

const releasePolicyClaimsForJob = async (env: SponsorEnv, id: string) => {
  await run(env, `DELETE FROM drop_policy_claims WHERE job_id=?`, [id]).catch(() => undefined);
};

const reserveDropPolicyClaims = async (
  env: SponsorEnv,
  params: {
    scopeKey: string;
    rules: DropPolicyRules;
    buyer: string;
    bnsName: string | null;
    jobId: string;
  }
) => {
  const claims: Array<{ kind: string; key: string }> = [];
  if (params.rules.onePerWallet) claims.push({ kind: 'wallet', key: params.buyer });
  if (params.rules.onePerBnsName && params.bnsName) claims.push({ kind: 'bns', key: params.bnsName });
  for (const claim of claims) {
    try {
      await run(
        env,
        `INSERT INTO drop_policy_claims (scope_key, claim_kind, claim_key, buyer, bns_name, job_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [params.scopeKey, claim.kind, claim.key, params.buyer, params.bnsName, params.jobId, Date.now()]
      );
    } catch {
      throw Object.assign(new Error('drop policy claim already reserved'), { code: 'DROP_POLICY_CLAIM_CONFLICT' });
    }
  }
};

const getBnsOwner = async (env: SponsorEnv, name: string): Promise<string | null> => {
  const normalized = normalizeDropBnsName(name);
  if (!normalized) return null;
  try {
    const response = await fetch(`${BNS_V2}/names/${encodeURIComponent(normalized)}`);
    if (response.ok) {
      const body = (await response.json()) as {
        status?: string;
        data?: { owner?: unknown; is_valid?: unknown; revoked?: unknown };
        owner?: unknown;
      };
      const owner = body.data?.owner ?? body.owner;
      const isInvalid = body.status === 'inactive' || body.data?.is_valid === false || body.data?.revoked === true;
      if (!isInvalid && typeof owner === 'string' && owner) return owner;
    }
  } catch {
    // Fall through to Hiro's legacy names endpoint.
  }
  try {
    const body = await hiroJson<{ address?: unknown; zonefile?: unknown }>(
      env,
      `/v1/names/${encodeURIComponent(normalized)}`
    );
    return typeof body.address === 'string' && body.address ? body.address : null;
  } catch {
    return null;
  }
};

const hasClaimedInGroup = async (
  env: SponsorEnv,
  contractId: string,
  creator: string,
  groupId: bigint,
  claimer: string
) => {
  const [address, name] = contractId.split('.');
  const j = await hiroJson<{ okay?: boolean; result?: string }>(
    env,
    `/v2/contracts/call-read/${address}/${name}/has-claimed-in-group`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: address,
        arguments: [
          cvToHex(principalCV(creator)),
          cvToHex(uintCV(groupId)),
          cvToHex(principalCV(claimer))
        ]
      })
    }
  );
  if (!j.okay || !j.result) return false;
  const parsed = cvToJSON(hexToCV(j.result)) as { value?: { value?: boolean } | boolean };
  return parsed.value === true || parsed.value?.value === true;
};

const getClaimedCollectionLockGroup = async (
  env: SponsorEnv,
  contractId: string,
  creator: string,
  groupIds: bigint[],
  claimer: string
) => {
  for (const groupId of groupIds) {
    if (await hasClaimedInGroup(env, contractId, creator, groupId, claimer)) {
      return groupId;
    }
  }
  return null;
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
  const res = await broadcastViaHiro(env, tx);
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
  FUNCTION_NOT_ALLOWED: 'function must be buy, claim, or claim-campaign for its allowlisted contract',
  BAD_ARGS: 'call arguments do not match the allowlisted contract function',
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
  if (!isDropsContract(contractId)) return true;
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
  // SIGNED-ARG BINDING: buy/claim take two arguments and claim-campaign adds
  // the BNS key, expiry and attestor signature. The signed call, never request
  // metadata, is the authoritative source for every relayer decision.
  const args = (payload as unknown as { functionArgs?: unknown[] }).functionArgs ?? [];
  const nftArg = args[0] as
    | {
        type?: ClarityType;
        address?: Parameters<typeof addressToString>[0];
        contractName?: { content: string };
      }
    | undefined;
  const idArg = args[1] as { type?: ClarityType; value?: bigint } | undefined;
  const campaignCall = isCampaignDropsContract(contractId);
  if (
    args.length !== (campaignCall ? 5 : 2) ||
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
  let bnsKeyHex: string | null = null;
  let expiresAt: bigint | null = null;
  let signatureHex: string | null = null;
  if (campaignCall) {
    const bnsArg = args[2] as {
      type?: ClarityType;
      value?: { type?: ClarityType; buffer?: Uint8Array };
    } | undefined;
    const expiryArg = args[3] as { type?: ClarityType; value?: bigint } | undefined;
    const signatureArg = args[4] as { type?: ClarityType; buffer?: Uint8Array } | undefined;
    const noBns = bnsArg?.type === ClarityType.OptionalNone;
    const someBns =
      bnsArg?.type === ClarityType.OptionalSome &&
      bnsArg.value?.type === ClarityType.Buffer &&
      bnsArg.value.buffer instanceof Uint8Array &&
      bnsArg.value.buffer.length === 32;
    if (
      (!noBns && !someBns) ||
      expiryArg?.type !== ClarityType.UInt ||
      typeof expiryArg.value !== 'bigint' ||
      signatureArg?.type !== ClarityType.Buffer ||
      !(signatureArg.buffer instanceof Uint8Array) ||
      signatureArg.buffer.length !== 65
    ) {
      return { error: 'BAD_ARGS' as const };
    }
    bnsKeyHex = someBns ? campaignBytesToHex(bnsArg.value!.buffer!) : null;
    expiresAt = expiryArg.value;
    signatureHex = campaignBytesToHex(signatureArg.buffer);
  }
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
  return { tx, contractId, buyer, listingId, nftContractId, bnsKeyHex, expiresAt, signatureHex };
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
  await run(env, `CREATE TABLE IF NOT EXISTS drop_policies (
    scope_key TEXT PRIMARY KEY,
    contract_id TEXT NOT NULL,
    creator TEXT NOT NULL,
    group_id TEXT NOT NULL,
    one_per_wallet INTEGER NOT NULL DEFAULT 1,
    require_bns_name INTEGER NOT NULL DEFAULT 0,
    one_per_bns_name INTEGER NOT NULL DEFAULT 0,
    tx_id TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`).catch(() => undefined);
  await run(env, `CREATE TABLE IF NOT EXISTS drop_policy_claims (
    scope_key TEXT NOT NULL,
    claim_kind TEXT NOT NULL,
    claim_key TEXT NOT NULL,
    buyer TEXT NOT NULL,
    bns_name TEXT,
    job_id TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    PRIMARY KEY (scope_key, claim_kind, claim_key)
  )`).catch(() => undefined);
  await run(env, `CREATE INDEX IF NOT EXISTS idx_drop_policy_claims_job ON drop_policy_claims (job_id)`).catch(
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
  const changed = (result.meta?.changes ?? 0) === 1;
  if (changed && to === 'ABANDONED') {
    await releasePolicyClaimsForJob(env, id);
  }
  return changed;
};

const abandonUnbroadcastJob = async (env: SponsorEnv, id: string, reason: string) => {
  await run(
    env,
    `UPDATE sponsor_jobs SET state='ABANDONED', reservation_key=NULL, payload_hash=NULL, error=?, updated_at=? WHERE id=? AND state='RECEIVED'`,
    [`broadcast: ${reason}`, Date.now(), id]
  );
  await releasePolicyClaimsForJob(env, id);
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
  const receivedStaleBefore = Date.now() - RECEIVED_TIMEOUT_MS;
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
  const staleReceived = await rows<{ id: string }>(
    env,
    `SELECT id FROM sponsor_jobs WHERE state='RECEIVED' AND COALESCE(updated_at, created_at) < ?`,
    [receivedStaleBefore]
  ).catch(() => []);
  await run(
    env,
    `UPDATE sponsor_jobs SET state='ABANDONED', reservation_key=NULL, payload_hash=NULL, error='never broadcast', updated_at=? WHERE state='RECEIVED' AND COALESCE(updated_at, created_at) < ?`,
    [Date.now(), receivedStaleBefore]
  ).catch(() => undefined);
  for (const stale of staleReceived) {
    await releasePolicyClaimsForJob(env, stale.id);
  }

  // Repair jobs that were terminalized from a transient mempool drop before
  // the canonical transaction record became visible. The exact txid is the
  // authority here: only that transaction resolving to success can revive
  // the job, so an unrelated purchase cannot trigger sponsor reimbursement.
  const recoverable = await rows<JobRow>(
    env,
    `SELECT * FROM sponsor_jobs
     WHERE state='ABANDONED' AND buy_tx IS NOT NULL AND error LIKE 'buy tx %'
       AND COALESCE(updated_at, created_at) > ?
     ORDER BY updated_at DESC LIMIT ?`,
    [Date.now() - SETTLE_TIMEOUT_MS, SETTLE_BATCH]
  );
  for (const job of recoverable) {
    try {
      if (await getTxStatus(env, job.buy_tx ?? '') === 'success') {
        await transition(env, job.id, 'ABANDONED', 'CONFIRMED', {
          sets: 'error=?',
          binds: [null]
        });
      }
    } catch {
      // Recovery is best-effort. Normal settlement/status traffic retries it.
    }
  }

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
          if (Date.now() - job.created_at < TX_TERMINAL_GRACE_MS) {
            // Recheck on the next client poll. A canonical success must win
            // over a racing mempool drop observation.
            continue;
          }
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

  if (path.endsWith('/sponsor/attest-campaign') && request.method === 'POST') {
    diagnostics.stage = 'ATTESTATION_PARSE';
    const body = (await request.json().catch(() => ({}))) as {
      contractId?: string;
      listingId?: string | number;
      claimer?: string;
      bnsName?: string | null;
    };
    const contractId = String(body.contractId ?? '');
    const listingId = String(body.listingId ?? '');
    const claimer = String(body.claimer ?? '').trim();
    if (
      !isCampaignDropsContract(contractId) ||
      !allowlist(env).includes(contractId) ||
      !/^\d+$/.test(listingId) ||
      !claimer.startsWith('SP') ||
      !validateStacksAddress(claimer)
    ) {
      return fail(
        'VALIDATION',
        'allowlisted campaign contract, numeric listingId, and mainnet claimer required'
      );
    }

    diagnostics.stage = 'ATTESTATION_STATE';
    const drop = await getDrop(env, contractId, listingId);
    if (!drop || drop.campaignId === null) {
      return fail('DROP_NOT_FOUND', 'campaign drop unknown', 404);
    }
    if (drop.claimedAt !== null) return fail('LISTING_SOLD', 'campaign drop already claimed', 409);
    const campaign = await getCampaign(env, contractId, drop.campaignId);
    if (!campaign) return fail('CAMPAIGN_NOT_FOUND', 'campaign unknown', 404);
    if (!campaign.active) return fail('CAMPAIGN_INACTIVE', 'campaign is paused', 409);

    diagnostics.stage = 'ATTESTATION_BNS';
    const normalizedBns = normalizeDropBnsName(body.bnsName);
    if (campaign.requireBnsName && !normalizedBns) {
      return fail('BNS_REQUIRED', 'this campaign requires a valid BNS name for the claiming wallet', 403);
    }
    if (normalizedBns) {
      const owner = await getBnsOwner(env, normalizedBns);
      if (!owner || owner.toUpperCase() !== claimer.toUpperCase()) {
        return fail('BNS_NOT_OWNED', `${normalizedBns} is not currently owned by the claiming wallet`, 403);
      }
    }

    diagnostics.stage = 'ATTESTATION_KEY';
    const rawAttestorKey = env.BNS_ATTESTATION_PRIVATE_KEY?.trim().replace(/^0x/i, '');
    if (!rawAttestorKey || !/^[0-9a-f]{64}(?:01)?$/i.test(rawAttestorKey)) {
      return fail('ATTESTOR_DISABLED', 'BNS attestor is not configured', 503);
    }
    const configuredHash = await getConfiguredAttestorHash(env, contractId);
    if (!configuredHash || attestorPubkeyHash(rawAttestorKey) !== configuredHash) {
      return fail(
        'ATTESTOR_KEY_MISMATCH',
        'BNS attestor key does not match the on-chain configuration',
        503
      );
    }

    diagnostics.stage = 'ATTESTATION_SIGN';
    const tip = await getStacksTipHeight(env);
    const expiresAt = tip + CAMPAIGN_ATTESTATION_TTL_BLOCKS;
    const bnsKeyHex = normalizedBns ? await bnsNameKey(normalizedBns) : null;
    const signature = await signCampaignAttestation(
      {
        contractId,
        campaignId: drop.campaignId,
        dropId: BigInt(listingId),
        claimer,
        bnsKeyHex,
        expiresAt
      },
      rawAttestorKey
    );
    return jsonResponse(
      {
        contractId,
        listingId,
        campaignId: drop.campaignId.toString(),
        bnsName: normalizedBns,
        bnsKey: bnsKeyHex,
        expiresAt: expiresAt.toString(),
        signature,
        rules: {
          onePerWallet: campaign.onePerWallet,
          requireBnsName: campaign.requireBnsName,
          onePerBnsName: campaign.onePerBnsName
        }
      },
      200,
      CORS
    );
  }

  if (path.endsWith('/sponsor/drop-policy') && request.method === 'GET') {
    diagnostics.stage = 'DROP_POLICY_READ';
    const contractId = url.searchParams.get('contractId') ?? '';
    const creator = url.searchParams.get('creator') ?? '';
    const groupId = url.searchParams.get('groupId') ?? '';
    if (!contractId || !creator || !/^\d+$/.test(groupId)) {
      return fail('BAD_REQUEST', 'contractId, creator, and numeric groupId required');
    }
    if (!allowlist(env).includes(contractId) || !isDropsContract(contractId)) {
      return fail('CONTRACT_NOT_ALLOWED', 'drop contract not allowlisted');
    }
    const rules = await getDropPolicy(env, contractId, creator, groupId);
    return jsonResponse({ contractId, creator, groupId, rules }, 200, CORS);
  }

  if (path.endsWith('/sponsor/drop-policy') && request.method === 'POST') {
    diagnostics.stage = 'DROP_POLICY_SAVE';
    const body = (await request.json().catch(() => ({}))) as {
      contractId?: string;
      dropId?: string | number;
      creator?: string;
      groupId?: string | number;
      rules?: Partial<DropPolicyRules>;
      txId?: string | null;
    };
    const contractId = String(body.contractId ?? '');
    const dropId = String(body.dropId ?? '');
    const creator = String(body.creator ?? '');
    const groupId = String(body.groupId ?? '');
    if (!contractId || !/^\d+$/.test(dropId) || !creator || !/^\d+$/.test(groupId)) {
      return fail('BAD_REQUEST', 'contractId, dropId, creator, and numeric groupId required');
    }
    if (!allowlist(env).includes(contractId) || !isDropsContract(contractId)) {
      return fail('CONTRACT_NOT_ALLOWED', 'drop contract not allowlisted');
    }
    const drop = await getDrop(env, contractId, dropId);
    if (!drop) return fail('DROP_NOT_FOUND', 'drop unknown', 404);
    if (drop.creator !== creator || drop.groupId !== BigInt(groupId)) {
      return fail('VALIDATION', 'drop policy scope does not match on-chain drop');
    }
    const rules = await saveDropPolicy(env, {
      contractId,
      creator,
      groupId,
      rules: normalizeDropPolicyRules(body.rules),
      txId: body.txId ?? null
    });
    return jsonResponse({ ok: true, contractId, dropId, creator, groupId, rules }, 200, CORS);
  }

  if (path.endsWith('/sponsor/submit') && request.method === 'POST') {
    diagnostics.stage = 'SUBMIT_PARSE';
    const body = (await request.json().catch(() => ({}))) as {
      txHex?: string;
      contractId?: string;
      listingId?: string | number;
      bnsName?: string | null;
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
    let dropPolicy: DropPolicyRules | null = null;
    let dropPolicyScope: string | null = null;
    let verifiedBnsName: string | null = null;
    if (isDropsContract(contractId)) {
      diagnostics.stage = 'DROP_POLICY';
      const drop = await getDrop(env, contractId, listingId.toString());
      if (isCampaignDropsContract(contractId)) {
        if (!drop || drop.campaignId === null) {
          return fail('VALIDATION', 'selected drop is not a v1.1 campaign drop');
        }
        const campaign = await getCampaign(env, contractId, drop.campaignId);
        if (!campaign) return fail('CAMPAIGN_NOT_FOUND', 'campaign unknown', 404);
        if (!campaign.active) return fail('CAMPAIGN_INACTIVE', 'campaign is paused', 409);
        dropPolicy = {
          onePerWallet: campaign.onePerWallet,
          requireBnsName: campaign.requireBnsName,
          onePerBnsName: campaign.onePerBnsName
        };
        dropPolicyScope = dropPolicyScopeKey(contractId, drop.creator, drop.campaignId);

        diagnostics.stage = 'CAMPAIGN_ATTESTATION';
        if (validated.expiresAt === null || !validated.signatureHex) {
          return fail('VALIDATION', 'campaign claim is missing its signed attestation');
        }
        const tip = await getStacksTipHeight(env);
        if (validated.expiresAt < tip) {
          return fail('ATTESTATION_EXPIRED', 'campaign attestation has expired', 409);
        }
        if (validated.expiresAt > tip + CAMPAIGN_ATTESTATION_TTL_BLOCKS) {
          return fail('VALIDATION', 'campaign attestation expiry exceeds the relayer window');
        }
        const configuredHash = await getConfiguredAttestorHash(env, contractId);
        if (!configuredHash) {
          return fail('ATTESTOR_DISABLED', 'campaign attestor is not configured on-chain', 503);
        }
        const signatureValid = await verifyCampaignAttestation(
          {
            contractId,
            campaignId: drop.campaignId,
            dropId: listingId,
            claimer: validated.buyer,
            bnsKeyHex: validated.bnsKeyHex,
            expiresAt: validated.expiresAt
          },
          validated.signatureHex,
          configuredHash
        );
        if (!signatureValid) return fail('VALIDATION', 'campaign attestation signature is invalid');
        if (dropPolicy.requireBnsName && !validated.bnsKeyHex) {
          return fail('BNS_REQUIRED', 'this campaign requires a BNS attestation', 403);
        }
        if (validated.bnsKeyHex) {
          verifiedBnsName = normalizeDropBnsName(body.bnsName);
          if (
            !verifiedBnsName ||
            (await bnsNameKey(verifiedBnsName)) !== validated.bnsKeyHex
          ) {
            return fail('VALIDATION', 'BNS name does not match the signed campaign key');
          }
          const owner = await getBnsOwner(env, verifiedBnsName);
          if (!owner || owner.toUpperCase() !== validated.buyer.toUpperCase()) {
            return fail('BNS_NOT_OWNED', `${verifiedBnsName} is not currently owned by the claiming wallet`, 403);
          }
        }
      } else if (drop) {
        dropPolicy = await getDropPolicy(env, contractId, drop.creator, drop.groupId);
        dropPolicyScope = dropPolicyScopeKey(contractId, drop.creator, drop.groupId);
      } else {
        dropPolicy = DEFAULT_DROP_POLICY_RULES;
        dropPolicyScope = dropPolicyScopeKey(contractId, listing.seller, listingId);
      }
      const lock = getDropsCollectionLockForDrop({
        contractId,
        creator: listing.seller,
        dropId: listingId
      });
      if (lock) {
        diagnostics.stage = 'COLLECTION_LOCK';
        const claimedGroupId = await getClaimedCollectionLockGroup(
          env,
          contractId,
          listing.seller,
          lock.groupIds,
          validated.buyer
        );
        if (claimedGroupId !== null) {
          return fail(
            'COLLECTION_LIMIT',
            `wallet already claimed from ${lock.label}; one free drop per address`,
            409
          );
        }
      }
      if (!isCampaignDropsContract(contractId) && dropPolicy && hasBnsPolicy(dropPolicy)) {
        diagnostics.stage = 'BNS_POLICY';
        verifiedBnsName = normalizeDropBnsName(body.bnsName);
        if (!verifiedBnsName) {
          return fail('BNS_REQUIRED', 'this drop requires a valid BNS name for the claiming wallet', 403);
        }
        const owner = await getBnsOwner(env, verifiedBnsName);
        if (!owner || owner.toUpperCase() !== validated.buyer.toUpperCase()) {
          return fail('BNS_NOT_OWNED', `${verifiedBnsName} is not currently owned by the claiming wallet`, 403);
        }
      }
    }
    diagnostics.stage = 'FEE_ESTIMATE';
    const estimatedFee = await estimateBuyFee(env);
    let fee = estimatedFee;
    if (isDropsContract(contractId)) {
      // A free drop cannot offer a self-paid fallback. Cap transient fee-rate
      // spikes at the amount the contract can reimburse. The node still
      // enforces whether that fee is sufficient before accepting broadcast,
      // and claim-fee can repay the sponsor exactly if it confirms.
      fee = [estimatedFee, listing.budgetRemaining, MAX_FEE_USTX].reduce(
        (smallest, candidate) => candidate < smallest ? candidate : smallest
      );
      if (fee < estimatedFee) {
        console.warn('[sponsor:fee-cap]', {
          requestId: diagnostics.requestId,
          traceId: diagnostics.traceId,
          contractId,
          listingId: listingId.toString(),
          estimatedFeeUstx: estimatedFee.toString(),
          budgetRemainingUstx: listing.budgetRemaining.toString(),
          sponsoredFeeUstx: fee.toString()
        });
      }
    } else {
      if (fee > MAX_FEE_USTX) return fail('FEE_TOO_LARGE', 'network fee above relayer cap', 503);
      if (listing.budgetRemaining < fee) {
        return fail(
          'BUDGET_TOO_SMALL',
          `listing budget ${listing.budgetRemaining} µSTX cannot cover estimated fee ${fee} µSTX`
        );
      }
    }

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
    } catch (error) {
      if ((error as { code?: string })?.code === 'DROP_POLICY_CLAIM_CONFLICT') {
        return fail(
          'POLICY_LIMIT',
          'this drop group has already been claimed by that wallet or BNS name',
          409
        );
      }
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
    if (dropPolicy && dropPolicyScope) {
      diagnostics.stage = 'POLICY_RESERVATION';
      try {
        await reserveDropPolicyClaims(env, {
          scopeKey: dropPolicyScope,
          rules: dropPolicy,
          buyer: validated.buyer,
          bnsName: verifiedBnsName,
          jobId: id
        });
      } catch (error) {
        await abandonUnbroadcastJob(env, id, 'policy limit');
        if ((error as { code?: string })?.code === 'DROP_POLICY_CLAIM_CONFLICT') {
          return fail(
            'POLICY_LIMIT',
            'this drop group has already been claimed by that wallet or BNS name',
            409
          );
        }
        throw error;
      }
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
    const expectedTxid = sponsored.txid().replace(/^0x/, '');
    let res: HiroBroadcastResult;
    try {
      res = await broadcastViaHiro(env, sponsored);
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      console.error('[sponsor:broadcast]', {
        requestId: diagnostics.requestId,
        traceId: diagnostics.traceId,
        contractId,
        listingId: listingId.toString(),
        expectedTxid,
        error: reason
      });
      await abandonUnbroadcastJob(env, id, 'upstream unavailable');
      return fail('RELAYER_UNAVAILABLE', 'broadcast upstream unavailable; retry shortly', 503);
    }
    if ((res as { error?: string }).error) {
      const reason = String((res as { reason?: string }).reason ?? (res as { error?: string }).error);
      await abandonUnbroadcastJob(env, id, reason);
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
