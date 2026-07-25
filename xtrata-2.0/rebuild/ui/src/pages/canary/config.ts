import { assertPrincipalOnNetwork, parseContractId, XtrataClientError } from '@xtrata/collections-client';
import { CONTRACT_NAME_PATTERN } from '../studio/template';
import type { NetworkType } from '../../wallet/network';

/**
 * Deployment configuration for one canary run.
 *
 * Deliberately separate from `src/config.ts`: that module describes the
 * contracts the app TALKS to (already deployed, pinned), while this one
 * describes the contracts a run is about to CREATE. Conflating them is how a
 * half-deployed family ends up being treated as live (threat 16).
 *
 * The relayer base URL is read from the environment here rather than from the
 * app config, because stage 10 is allowed to be absent: a build with no relayer
 * configured records an explicit skip instead of failing the pipeline.
 */

export interface CanaryDeployConfig {
  /** Network this run targets. Stage 5 requires testnet, stage 13 mainnet. */
  network: NetworkType;
  /** Deploying principal — must be the connected wallet. */
  deployerAddress: string;
  /** Stacks API base for source/interface/balance reads. */
  apiBaseUrl: string;
  /** The pinned inscription core both contracts depend on. */
  coreContractId: string;
  /** Contract name for the drops singleton, e.g. `xtrata-drops-v3`. */
  dropsContractName: string;
  /** Contract name for the throwaway canary collection instance. */
  collectionContractName: string;
  /** Relayer base URL, or null when this build has no relayer. */
  relayerBaseUrl: string | null;
}

export const DEFAULT_DROPS_CONTRACT_NAME = 'xtrata-drops-v3';
export const DEFAULT_COLLECTION_CONTRACT_NAME = 'xtrata-canary-collection';

/** `VITE_XTRATA_RELAYER_URL` when set and non-empty, else null. */
export const relayerBaseUrlFromEnv = (
  env: Record<string, string | undefined> = import.meta.env as Record<string, string | undefined>
): string | null => {
  const value = env['VITE_XTRATA_RELAYER_URL'];
  return typeof value === 'string' && value.trim().length > 0 ? value.trim().replace(/\/+$/, '') : null;
};

export interface ConfigProblem {
  field: keyof CanaryDeployConfig;
  message: string;
}

const principalProblem = (principal: string, network: NetworkType): string | null => {
  try {
    assertPrincipalOnNetwork(principal, network);
    return null;
  } catch (error) {
    return error instanceof XtrataClientError ? error.message : String(error);
  }
};

/**
 * Stage 1's configuration half. Every problem is reported, not just the first —
 * an operator fixing a deploy config should see the whole list at once.
 */
export const validateDeployConfig = (config: CanaryDeployConfig): ConfigProblem[] => {
  const problems: ConfigProblem[] = [];

  if (config.network !== 'mainnet' && config.network !== 'testnet') {
    problems.push({ field: 'network', message: `unknown network "${String(config.network)}"` });
    return problems;
  }

  if (config.deployerAddress.trim().length === 0) {
    problems.push({ field: 'deployerAddress', message: 'no deployer address — connect a wallet' });
  } else {
    const problem = principalProblem(config.deployerAddress, config.network);
    if (problem) problems.push({ field: 'deployerAddress', message: problem });
  }

  try {
    parseContractId(config.coreContractId);
    const problem = principalProblem(config.coreContractId, config.network);
    if (problem) problems.push({ field: 'coreContractId', message: problem });
  } catch {
    problems.push({
      field: 'coreContractId',
      message: `core must be a full contract id, received "${config.coreContractId}"`
    });
  }

  for (const field of ['dropsContractName', 'collectionContractName'] as const) {
    const name = config[field];
    if (!CONTRACT_NAME_PATTERN.test(name)) {
      problems.push({
        field,
        message: `"${name}" is not a valid contract name (lowercase, digits and dashes, max 40)`
      });
    }
  }

  if (
    CONTRACT_NAME_PATTERN.test(config.dropsContractName) &&
    config.dropsContractName === config.collectionContractName
  ) {
    problems.push({
      field: 'collectionContractName',
      message: 'the drops singleton and the canary collection cannot share one contract name'
    });
  }

  if (!/^https?:\/\//.test(config.apiBaseUrl)) {
    problems.push({ field: 'apiBaseUrl', message: `"${config.apiBaseUrl}" is not an http(s) URL` });
  }

  if (config.relayerBaseUrl !== null && !/^https?:\/\//.test(config.relayerBaseUrl)) {
    problems.push({
      field: 'relayerBaseUrl',
      message: `"${config.relayerBaseUrl}" is not an http(s) URL — unset it to skip the sponsored-claim stage`
    });
  }

  return problems;
};

/** `SPxxx.name` for a contract this run will create. */
export const plannedContractId = (config: CanaryDeployConfig, contractName: string): string =>
  `${config.deployerAddress}.${contractName}`;
