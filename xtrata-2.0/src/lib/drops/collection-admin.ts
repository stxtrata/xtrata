import { boolCV, contractPrincipalCV, uintCV, validateStacksAddress } from '@stacks/transactions';

export const COLLECTION_DROPS_DEPLOYER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
export const COLLECTION_DROPS_CONTRACT_NAME = 'xtrata-drops-v1-1';
export const COLLECTION_DROPS_CONTRACT_ID = `${COLLECTION_DROPS_DEPLOYER}.${COLLECTION_DROPS_CONTRACT_NAME}`;
export const COLLECTION_DROPS_NFT_CONTRACT_NAME = 'xtrata-v3-2-3';
export const COLLECTION_DROPS_NFT_CONTRACT_ID = `${COLLECTION_DROPS_DEPLOYER}.${COLLECTION_DROPS_NFT_CONTRACT_NAME}`;
export const COLLECTION_DROPS_BNS_NAME = 'jim.btc';
export const COLLECTION_DROPS_MIN_BUDGET_USTX = 50_000n;
export const COLLECTION_DROPS_MAX_SUPPLY = 10_000n;

export type CollectionDropAccessRole = 'xtrata' | 'jim.btc';

export const collectionDropAccessRole = (
  address: string | null | undefined,
  jimBtcOwner: string | null | undefined
): CollectionDropAccessRole | null => {
  const normalized = address?.trim().toUpperCase();
  if (!normalized) return null;
  if (normalized === COLLECTION_DROPS_DEPLOYER) return 'xtrata';
  if (jimBtcOwner && normalized === jimBtcOwner.trim().toUpperCase()) return 'jim.btc';
  return null;
};

export const readBnsV2Owner = (payload: unknown): string | null => {
  if (!payload || typeof payload !== 'object') return null;
  const record = payload as {
    status?: unknown;
    owner?: unknown;
    data?: { owner?: unknown; is_valid?: unknown; revoked?: unknown };
  };
  if (
    record.status === 'inactive' ||
    record.data?.is_valid === false ||
    record.data?.revoked === true
  ) {
    return null;
  }
  const owner = record.data?.owner ?? record.owner;
  if (typeof owner !== 'string') return null;
  const trimmed = owner.trim();
  return trimmed.startsWith('SP') && validateStacksAddress(trimmed) ? trimmed : null;
};

export const parseCollectionUint = (
  value: string,
  label: string,
  options: { min?: bigint; max?: bigint } = {}
): { ok: true; value: bigint } | { ok: false; error: string } => {
  const text = value.trim();
  if (!/^\d+$/.test(text)) return { ok: false, error: `${label} must be a whole number.` };
  const parsed = BigInt(text);
  if (options.min !== undefined && parsed < options.min) {
    return { ok: false, error: `${label} must be at least ${options.min}.` };
  }
  if (options.max !== undefined && parsed > options.max) {
    return { ok: false, error: `${label} must be no more than ${options.max}.` };
  }
  return { ok: true, value: parsed };
};

export const parseCollectionBudget = (
  value: string
): { ok: true; ustx: bigint } | { ok: false; error: string } => {
  const text = value.trim();
  if (!/^(?:\d+)(?:\.\d{1,6})?$/.test(text)) {
    return { ok: false, error: 'Sponsorship budget must be an STX amount with up to 6 decimals.' };
  }
  const [whole, fraction = ''] = text.split('.');
  const ustx = BigInt(whole) * 1_000_000n + BigInt(fraction.padEnd(6, '0'));
  if (ustx < COLLECTION_DROPS_MIN_BUDGET_USTX) {
    return { ok: false, error: 'Sponsorship budget must be at least 0.05 STX.' };
  }
  return { ok: true, ustx };
};

export const validateCollectionCampaignRules = (params: {
  engineId: string;
  maxSupply: string;
  onePerWallet: boolean;
  requireBns: boolean;
  onePerBns: boolean;
}) => {
  const engineId = parseCollectionUint(params.engineId, 'Engine inscription ID');
  if (!engineId.ok) return engineId;
  const maxSupply = parseCollectionUint(params.maxSupply, 'Maximum supply', {
    min: 1n,
    max: COLLECTION_DROPS_MAX_SUPPLY
  });
  if (!maxSupply.ok) return maxSupply;
  if (params.onePerBns && !params.requireBns) {
    return { ok: false as const, error: 'One per BNS requires BNS ownership to be required.' };
  }
  return {
    ok: true as const,
    engineId: engineId.value,
    maxSupply: maxSupply.value,
    functionArgs: [
      uintCV(engineId.value),
      uintCV(maxSupply.value),
      boolCV(params.onePerWallet),
      boolCV(params.requireBns),
      boolCV(params.onePerBns)
    ]
  };
};

export const buildCollectionDropArgs = (params: {
  tokenId: bigint;
  budgetUstx: bigint;
  campaignId: bigint;
}) => [
  contractPrincipalCV(COLLECTION_DROPS_DEPLOYER, COLLECTION_DROPS_NFT_CONTRACT_NAME),
  uintCV(params.tokenId),
  uintCV(params.budgetUstx),
  uintCV(params.campaignId)
];
