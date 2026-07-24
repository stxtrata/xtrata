import {
  ClarityType,
  addressToString,
  cvToJSON,
  type ClarityValue
} from '@stacks/transactions';

export const DROPS_V12_CONTRACT_NAME = 'xtrata-drops-v1-2';
export const DROPS_V12_SOURCE_PATH = 'contracts/live/xtrata-drops-v1.2.clar';
export const DROPS_V12_DEPLOYER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
export const DROPS_V12_NFT_NAME = 'xtrata-v3-2-3';
export const DROPS_V12_BATCH_LIMIT = 25n;
export const DROPS_V12_MIN_BUDGET_USTX = 50_000n;

export type CanaryLogLevel = 'info' | 'success' | 'warning' | 'error';
export type CanaryLogEntry = {
  at: string;
  action: string;
  level: CanaryLogLevel;
  message: string;
  txId?: string;
};

export const sha256Hex = async (text: string) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
};

const activeSource = (source: string) =>
  source
    .split('\n')
    .map((line) => line.replace(/;;.*$/, ''))
    .join('\n');

export const inspectDropsV12Source = (source: string, deployer = DROPS_V12_DEPLOYER) => {
  const active = activeSource(source);
  const nftContract = `${deployer}.${DROPS_V12_NFT_NAME}`;
  const requirements: Array<[string, string]> = [
    [
      `(define-constant PRIMARY-NFT-CONTRACT '${nftContract})`,
      `PRIMARY-NFT-CONTRACT must be '${nftContract}'`
    ],
    [
      `(map-set AllowedNftContracts '${nftContract} true)`,
      `AllowedNftContracts must initially allow '${nftContract}'`
    ],
    ['(define-constant MAX-CAMPAIGN-BATCH u25)', 'MAX-CAMPAIGN-BATCH must be u25'],
    ['intake-open: bool', 'campaign intake-open state is missing'],
    ['active: false', 'campaigns must start claim-closed'],
    ['intake-open: true', 'campaigns must start with intake open'],
    ['(define-public (create-campaign-drops', 'create-campaign-drops is missing'],
    ['(define-read-only (get-campaign-drop-id', 'get-campaign-drop-id is missing'],
    ['(define-read-only (get-max-campaign-batch)', 'get-max-campaign-batch is missing'],
    ['ERR-CAMPAIGN-NOT-READY', 'campaign readiness guard is missing'],
    ['(define-public (claim-campaign', 'claim-campaign is missing'],
    ['(define-public (cancel', 'cancel escape hatch is missing'],
    ['(define-public (settle-refund', 'settle-refund escape hatch is missing']
  ];
  const problems = requirements.filter(([needle]) => !active.includes(needle)).map(([, problem]) => problem);
  if (active.includes('.mock-')) problems.push('active source contains a mock contract reference');
  if (active.match(/[( ]\.[a-z0-9][a-z0-9-]*/)) {
    problems.push('active source contains a local contract principal');
  }
  if (
    !active.includes(
      "'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait"
    )
  ) {
    problems.push('the mainnet SIP-009 trait is not active');
  }
  return problems;
};

export const deploymentConfirmation = (hash: string) =>
  `DEPLOY ${DROPS_V12_CONTRACT_NAME} ${hash.slice(0, 12)}`;

export const extractTxId = (payload: unknown): string | null => {
  if (!payload || typeof payload !== 'object') return null;
  const value = payload as { txId?: unknown; txid?: unknown };
  const txId = typeof value.txId === 'string' ? value.txId : value.txid;
  return typeof txId === 'string' && txId.trim() ? txId.trim() : null;
};

export const formatCanaryLog = (entries: CanaryLogEntry[]) =>
  entries
    .map((entry) => {
      const tx = entry.txId ? ` | tx ${entry.txId}` : '';
      return `${entry.at} | ${entry.level.toUpperCase()} | ${entry.action} | ${entry.message}${tx}`;
    })
    .join('\n');

export const classifyTxStatus = (status: string | null | undefined) => {
  if (status === 'success') return 'success' as const;
  if (
    status === 'abort_by_response' ||
    status === 'abort_by_post_condition' ||
    status === 'dropped_replace_by_fee' ||
    status === 'dropped_replace_across_fork' ||
    status === 'dropped_too_expensive' ||
    status === 'dropped_stale_garbage_collect' ||
    status === 'dropped_problematic'
  ) {
    return 'failed' as const;
  }
  return 'pending' as const;
};

export const unwrapResponse = (value: ClarityValue): ClarityValue => {
  if (value.type !== ClarityType.ResponseOk) {
    throw new Error(`read-only call failed: ${JSON.stringify(cvToJSON(value))}`);
  }
  return value.value;
};

export const unwrapOptional = (value: ClarityValue): ClarityValue | null => {
  if (value.type === ClarityType.OptionalNone) return null;
  if (value.type !== ClarityType.OptionalSome) {
    throw new Error(`expected optional value: ${JSON.stringify(cvToJSON(value))}`);
  }
  return value.value;
};

export const clarityUint = (value: ClarityValue) => {
  if (value.type !== ClarityType.UInt) {
    throw new Error(`expected uint: ${JSON.stringify(cvToJSON(value))}`);
  }
  return value.value;
};

export const clarityPrincipal = (value: ClarityValue) => {
  if (
    value.type !== ClarityType.PrincipalStandard &&
    value.type !== ClarityType.PrincipalContract
  ) {
    throw new Error(`expected principal: ${JSON.stringify(cvToJSON(value))}`);
  }
  return value.type === ClarityType.PrincipalStandard
    ? value.value
    : `${addressToString(value.address)}.${value.contractName.content}`;
};

export const campaignSnapshot = (value: ClarityValue) => {
  const campaign = unwrapOptional(value);
  if (!campaign || campaign.type !== ClarityType.Tuple) return null;
  const data = campaign.value.data;
  const bool = (key: string) => data[key]?.type === ClarityType.BoolTrue;
  return {
    creator: clarityPrincipal(data.creator),
    maxSupply: clarityUint(data['max-supply']),
    dropsCreated: clarityUint(data['drops-created']),
    intakeOpen: bool('intake-open'),
    active: bool('active'),
    onePerWallet: bool('one-per-wallet'),
    requireBns: bool('require-bns'),
    onePerBns: bool('one-per-bns')
  };
};
