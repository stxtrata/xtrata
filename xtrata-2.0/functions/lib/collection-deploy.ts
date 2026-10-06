import { queryAll, type Env } from './db';
import { applyHiroApiKey, getHiroApiKeys, shouldRetryWithNextHiroKey } from './hiro-keys';
import {
  verifyCollectionSource,
  type ApprovedCollectionTemplate,
  type CollectionSourceVerdict
} from '../../src/lib/deploy/template-fingerprint';
import { resolveArtistDeployCoreTarget } from '../../src/lib/deploy/artist-deploy';

type CollectionRow = Record<string, unknown>;

type QueryResult = {
  results?: Array<Record<string, unknown>>;
};

type HiroTxResponse = {
  tx_status?: unknown;
};

type HiroContractSourceResponse = {
  source?: unknown;
};

export type CollectionDeployReadiness = {
  ready: boolean;
  reason: string;
  collection: CollectionRow | null;
  metadata: Record<string, unknown> | null;
  deployTxId: string | null;
  deployTxStatus: string | null;
  network: 'mainnet' | 'testnet' | null;
};

type ReadinessParams = {
  env: Env;
  collectionId: string;
  fetcher?: typeof fetch;
  queryAllImpl?: (
    env: Env,
    query: string,
    binds?: Array<unknown>
  ) => Promise<QueryResult>;
};

const toNullableString = (value: unknown) => {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const parseMetadata = (value: unknown) => {
  if (!value) {
    return null;
  }
  if (typeof value === 'object') {
    return value as Record<string, unknown>;
  }
  if (typeof value !== 'string') {
    return null;
  }
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return null;
  }
};

const normalizeTxId = (value: string) =>
  value.startsWith('0x') ? value : `0x${value}`;

const CONTRACT_NAME_PATTERN = /^[a-zA-Z][a-zA-Z0-9-_]{0,127}$/;

const inferNetworkFromPrincipal = (value?: string | null): 'mainnet' | 'testnet' | null => {
  if (!value) {
    return null;
  }
  const principal = value.split('.')[0]?.trim().toUpperCase() ?? '';
  if (principal.startsWith('SP') || principal.startsWith('SM')) {
    return 'mainnet';
  }
  if (principal.startsWith('ST') || principal.startsWith('SN')) {
    return 'testnet';
  }
  return null;
};

const resolveNetworkOrder = (params: {
  contractAddress?: string | null;
  coreContractId?: string | null;
}) => {
  const inferredFromCore = inferNetworkFromPrincipal(params.coreContractId);
  const inferredFromAddress = inferNetworkFromPrincipal(params.contractAddress);
  const inferred = inferredFromCore ?? inferredFromAddress;
  if (inferred === 'testnet') {
    return ['testnet', 'mainnet'] as const;
  }
  return ['mainnet', 'testnet'] as const;
};

const hiroBaseByNetwork = (network: 'mainnet' | 'testnet') =>
  network === 'testnet'
    ? 'https://api.testnet.hiro.so'
    : 'https://api.mainnet.hiro.so';

const normalizePrincipal = (value: string) => value.trim().replace(/^'+/, '');

type ContractLookupTarget = {
  address: string;
  contractName: string;
  contractId: string;
};

const parseContractId = (value: string | null): ContractLookupTarget | null => {
  if (!value) {
    return null;
  }
  const normalized = normalizePrincipal(value);
  const dotIndex = normalized.indexOf('.');
  if (dotIndex <= 0 || dotIndex >= normalized.length - 1) {
    return null;
  }
  const address = normalized.slice(0, dotIndex).trim();
  const contractName = normalized.slice(dotIndex + 1).trim();
  if (!inferNetworkFromPrincipal(address) || !CONTRACT_NAME_PATTERN.test(contractName)) {
    return null;
  }
  return {
    address,
    contractName,
    contractId: `${address}.${contractName}`
  };
};

const deriveExpectedContractName = (params: {
  collection: CollectionRow;
  metadata: Record<string, unknown> | null;
}) => {
  const rawSlug = toNullableString(params.collection.slug);
  if (!rawSlug) {
    return null;
  }
  const slug = rawSlug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
  if (!slug) {
    return null;
  }

  const mintType =
    toNullableString(params.metadata?.mintType)?.toLowerCase() === 'pre-inscribed'
      ? 'pre-inscribed'
      : 'standard';
  const prefix = mintType === 'pre-inscribed' ? 'xtrata-preinscribed' : 'xtrata-collection';
  const seed = (toNullableString(params.collection.id) ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 8);

  let contractName = `${prefix}-${slug}`;
  if (seed) {
    contractName = `${contractName}-${seed}`;
  }
  contractName = contractName.slice(0, 128).replace(/-+$/g, '');
  return CONTRACT_NAME_PATTERN.test(contractName) ? contractName : null;
};

const resolveContractLookupTarget = (params: {
  collection: CollectionRow;
  contractAddress: string;
  metadata: Record<string, unknown> | null;
}) => {
  const parsedFromContractAddress = parseContractId(params.contractAddress);
  if (parsedFromContractAddress) {
    return parsedFromContractAddress;
  }

  const parsedFromContractId = parseContractId(toNullableString(params.metadata?.contractId));
  if (parsedFromContractId) {
    return parsedFromContractId;
  }

  const contractName =
    toNullableString(params.metadata?.contractName) ??
    deriveExpectedContractName({
      collection: params.collection,
      metadata: params.metadata
    });
  if (!contractName || !CONTRACT_NAME_PATTERN.test(contractName)) {
    return null;
  }

  const principalFromCollection = normalizePrincipal(params.contractAddress);
  if (inferNetworkFromPrincipal(principalFromCollection)) {
    return {
      address: principalFromCollection,
      contractName,
      contractId: `${principalFromCollection}.${contractName}`
    };
  }

  const principalFromMetadata = normalizePrincipal(
    toNullableString(params.metadata?.contractAddress) ?? ''
  );
  if (!inferNetworkFromPrincipal(principalFromMetadata)) {
    return null;
  }

  return {
    address: principalFromMetadata,
    contractName,
    contractId: `${principalFromMetadata}.${contractName}`
  };
};

const buildHiroHeaders = (apiKey: string | null) => {
  const headers = new Headers();
  applyHiroApiKey(headers, apiKey);
  return headers;
};

const fetchWithHiroKeyFallback = async (params: {
  fetcher: typeof fetch;
  url: string;
  apiKeys: string[];
}) => {
  const keyCandidates = params.apiKeys.length > 0 ? params.apiKeys : [null];
  for (let i = 0; i < keyCandidates.length; i += 1) {
    const response = await params.fetcher(params.url, {
      headers: buildHiroHeaders(keyCandidates[i])
    });
    const hasNextKey = i < keyCandidates.length - 1;
    if (hasNextKey && shouldRetryWithNextHiroKey(response.status)) {
      continue;
    }
    return response;
  }
  return new Response('Hiro request failed.', { status: 502 });
};

/**
 * Collections created from this moment on must be deployed from an approved
 * template (see src/lib/deploy/template-fingerprint.ts). Older collections were
 * created before the check existed and are left as they are. Override with the
 * COLLECTION_SOURCE_CHECK_FROM env var (ISO date or epoch ms).
 */
export const DEFAULT_SOURCE_CHECK_FROM = '2026-10-01T00:00:00Z';

const resolveSourceCheckFrom = (env: Env) => {
  const raw = toNullableString(env.COLLECTION_SOURCE_CHECK_FROM) ?? DEFAULT_SOURCE_CHECK_FROM;
  const asNumber = /^\d+$/.test(raw) ? Number(raw) : Date.parse(raw);
  return Number.isFinite(asNumber) ? asNumber : Date.parse(DEFAULT_SOURCE_CHECK_FROM);
};

const requiresSourceCheck = (env: Env, collection: CollectionRow) => {
  const createdAt = Number(collection.created_at);
  return Number.isFinite(createdAt) && createdAt > 0 && createdAt >= resolveSourceCheckFrom(env);
};

/** The core each approved template must pin, from Xtrata's own registry. */
const expectedCoreFor = (network: 'mainnet' | 'testnet') => (template: ApprovedCollectionTemplate) =>
  resolveArtistDeployCoreTarget(
    network,
    undefined,
    template === 'xtrata-preinscribed-collection-sale-v1.0' ? 'legacy' : '3.2.3'
  )?.contractId ?? null;

// Deployed code never changes, so a verdict on a contract id holds for the
// life of this isolate.
const sourceVerdictCache = new Map<string, CollectionSourceVerdict>();

export const clearCollectionSourceVerdictCache = () => sourceVerdictCache.clear();

type SourceCheck = { ok: true } | { ok: false; reason: string };

const checkDeployedSource = async (params: {
  env: Env;
  collection: CollectionRow;
  metadata: Record<string, unknown> | null;
  contractAddress: string;
  network: 'mainnet' | 'testnet';
  fetcher: typeof fetch;
  apiKeys: string[];
  /** Source already fetched for this contract (no-txid path). */
  source?: string | null;
  target?: ContractLookupTarget | null;
}): Promise<SourceCheck> => {
  if (!requiresSourceCheck(params.env, params.collection)) {
    return { ok: true };
  }
  const target =
    params.target ??
    resolveContractLookupTarget({
      collection: params.collection,
      contractAddress: params.contractAddress,
      metadata: params.metadata
    });
  if (!target) {
    return { ok: false, reason: 'Could not work out which contract this collection uses, so its code cannot be checked.' };
  }
  const cached = sourceVerdictCache.get(target.contractId);
  if (cached) {
    return cached.ok ? { ok: true } : { ok: false, reason: cached.reason };
  }
  let source = params.source ?? null;
  if (!source) {
    const response = await fetchWithHiroKeyFallback({
      fetcher: params.fetcher,
      url: `${hiroBaseByNetwork(params.network)}/v2/contracts/source/${target.address}/${target.contractName}`,
      apiKeys: params.apiKeys
    });
    if (!response.ok) {
      // A failed read is "could not check", never "the code is wrong".
      return {
        ok: false,
        reason: `Could not check the contract code right now (Hiro ${response.status}). Try again shortly.`
      };
    }
    source = toNullableString(((await response.json()) as HiroContractSourceResponse).source);
    if (!source) {
      return { ok: false, reason: 'Could not check the contract code right now (empty response). Try again shortly.' };
    }
  }
  const verdict = await verifyCollectionSource({ source, expectedCoreFor: expectedCoreFor(params.network) });
  sourceVerdictCache.set(target.contractId, verdict);
  return verdict.ok ? { ok: true } : { ok: false, reason: verdict.reason };
};

export async function getCollectionDeployReadiness(
  params: ReadinessParams
): Promise<CollectionDeployReadiness> {
  const providedFetcher = params.fetcher;
  const fetcher: typeof fetch = providedFetcher
    ? (input, init) => providedFetcher(input, init)
    : (input, init) => globalThis.fetch(input, init);
  const queryAllImpl = params.queryAllImpl ?? queryAll;
  const collectionId = params.collectionId.trim();
  if (!collectionId) {
    return {
      ready: false,
      reason: 'Collection id missing.',
      collection: null,
      metadata: null,
      deployTxId: null,
      deployTxStatus: null,
      network: null
    };
  }

  const collectionResult = await queryAllImpl(
    params.env,
    'SELECT * FROM collections WHERE id = ?',
    [collectionId]
  );
  const collection = (collectionResult.results?.[0] as CollectionRow | undefined) ?? null;

  if (!collection) {
    return {
      ready: false,
      reason: 'Collection not found.',
      collection: null,
      metadata: null,
      deployTxId: null,
      deployTxStatus: null,
      network: null
    };
  }

  const contractAddress = toNullableString(collection.contract_address);
  if (!contractAddress) {
    return {
      ready: false,
      reason: 'Deploy the collection contract before uploading artwork.',
      collection,
      metadata: parseMetadata(collection.metadata),
      deployTxId: null,
      deployTxStatus: null,
      network: null
    };
  }

  const metadata = parseMetadata(collection.metadata);
  const networkOrder = resolveNetworkOrder({
    contractAddress,
    coreContractId: toNullableString(metadata?.coreContractId)
  });
  const apiKeys = getHiroApiKeys(params.env);
  const deployTxId = toNullableString(metadata?.deployTxId);
  if (!deployTxId) {
    const contractTarget = resolveContractLookupTarget({
      collection,
      contractAddress,
      metadata
    });
    if (!contractTarget) {
      return {
        ready: false,
        reason:
          'Deployment transaction is not recorded yet. Retry deployment and wait for wallet submission.',
        collection,
        metadata,
        deployTxId: null,
        deployTxStatus: null,
        network: null
      };
    }

    for (const network of networkOrder) {
      const contractSourceUrl = `${hiroBaseByNetwork(network)}/v2/contracts/source/${contractTarget.address}/${contractTarget.contractName}`;
      const response = await fetchWithHiroKeyFallback({
        fetcher,
        url: contractSourceUrl,
        apiKeys
      });

      if (response.status === 404) {
        continue;
      }

      if (!response.ok) {
        return {
          ready: false,
          reason: `Unable to verify deployed contract on Hiro (${response.status}). Try again shortly.`,
          collection,
          metadata,
          deployTxId: null,
          deployTxStatus: null,
          network
        };
      }

      const payload = (await response.json()) as HiroContractSourceResponse;
      if (!toNullableString(payload.source)) {
        return {
          ready: false,
          reason: 'Contract source response from Hiro was empty. Try again shortly.',
          collection,
          metadata,
          deployTxId: null,
          deployTxStatus: null,
          network
        };
      }

      const sourceCheck = await checkDeployedSource({
        env: params.env,
        collection,
        metadata,
        contractAddress,
        network,
        fetcher,
        apiKeys,
        source: toNullableString(payload.source),
        target: contractTarget
      });
      if (!sourceCheck.ok) {
        return {
          ready: false,
          reason: sourceCheck.reason,
          collection,
          metadata,
          deployTxId: null,
          deployTxStatus: 'success',
          network
        };
      }
      return {
        ready: true,
        reason: `Deployment confirmed from contract source (${contractTarget.contractId}).`,
        collection,
        metadata,
        deployTxId: null,
        deployTxStatus: 'success',
        network
      };
    }

    return {
      ready: false,
      reason:
        'Deployment transaction is not recorded yet. Retry deployment and wait for wallet submission.',
      collection,
      metadata,
      deployTxId: null,
      deployTxStatus: null,
      network: networkOrder[0]
    };
  }

  const txId = normalizeTxId(deployTxId);

  for (const network of networkOrder) {
    const url = `${hiroBaseByNetwork(network)}/extended/v1/tx/${txId}`;
    const response = await fetchWithHiroKeyFallback({
      fetcher,
      url,
      apiKeys
    });
    if (response.status === 404) {
      continue;
    }

    if (!response.ok) {
      return {
        ready: false,
        reason: `Unable to verify deployment on Hiro (${response.status}). Try again shortly.`,
        collection,
        metadata,
        deployTxId: txId,
        deployTxStatus: null,
        network
      };
    }

    const payload = (await response.json()) as HiroTxResponse;
    const txStatus = toNullableString(payload.tx_status);
    if (!txStatus) {
      return {
        ready: false,
        reason: 'Deployment status is unavailable from Hiro. Try again shortly.',
        collection,
        metadata,
        deployTxId: txId,
        deployTxStatus: null,
        network
      };
    }

    if (txStatus === 'success') {
      const sourceCheck = await checkDeployedSource({
        env: params.env,
        collection,
        metadata,
        contractAddress,
        network,
        fetcher,
        apiKeys
      });
      if (!sourceCheck.ok) {
        return {
          ready: false,
          reason: sourceCheck.reason,
          collection,
          metadata,
          deployTxId: txId,
          deployTxStatus: txStatus,
          network
        };
      }
      return {
        ready: true,
        reason: 'Deployment confirmed.',
        collection,
        metadata,
        deployTxId: txId,
        deployTxStatus: txStatus,
        network
      };
    }

    return {
      ready: false,
      reason: `Deployment transaction status is "${txStatus}". Upload unlocks after success.`,
      collection,
      metadata,
      deployTxId: txId,
      deployTxStatus: txStatus,
      network
    };
  }

  return {
    ready: false,
    reason: 'Deployment transaction is not indexed yet. Wait for confirmation, then retry.',
    collection,
    metadata,
    deployTxId: txId,
    deployTxStatus: null,
    network: networkOrder[0]
  };
}
