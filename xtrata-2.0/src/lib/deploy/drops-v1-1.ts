import { bufferCV, someCV } from '@stacks/transactions';

export const DROPS_V11_CONTRACT_NAME = 'xtrata-drops-v1-1';
export const DROPS_V11_SOURCE_PATH = 'contracts/live/xtrata-drops-v1.1.clar';
export const DROPS_V11_PRIMARY_NFT_NAME = 'xtrata-v3-2-3';

export type DeployLogLevel = 'info' | 'success' | 'warning' | 'error';
export type ContractChainStatus = 'available' | 'deployed' | 'unknown';

export type DeployLogEntry = {
  at: string;
  action: string;
  level: DeployLogLevel;
  message: string;
  txId?: string;
};

export const normalizeHash160 = (
  value: string
): { ok: true; hex: string; bytes: Uint8Array } | { ok: false; error: string } => {
  const hex = value.trim().replace(/^0x/i, '').toLowerCase();
  if (!/^[0-9a-f]{40}$/.test(hex)) {
    return {
      ok: false,
      error: 'Enter the attestor public-key hash as exactly 20 bytes (40 hexadecimal characters).'
    };
  }
  const bytes = new Uint8Array(20);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16);
  }
  return { ok: true, hex, bytes };
};

export const buildBnsAttestorArg = (value: string) => {
  const normalized = normalizeHash160(value);
  if (!normalized.ok) return normalized;
  return {
    ok: true as const,
    hex: normalized.hex,
    arg: someCV(bufferCV(normalized.bytes))
  };
};

export const classifyContractInterfaceResponse = (
  ok: boolean,
  status: number
): ContractChainStatus => {
  if (ok) return 'deployed';
  if (status === 404) return 'available';
  return 'unknown';
};

export const inspectDropsV11Source = (source: string, deployer: string): string[] => {
  const active = source
    .split('\n')
    .map((line) => line.replace(/;;.*$/, ''))
    .join('\n');
  const primaryContract = `${deployer}.${DROPS_V11_PRIMARY_NFT_NAME}`;
  const problems: string[] = [];

  if (!active.includes(`(define-constant PRIMARY-NFT-CONTRACT '${primaryContract})`)) {
    problems.push(`PRIMARY-NFT-CONTRACT must be '${primaryContract}'`);
  }
  if (!active.includes(`(map-set AllowedNftContracts '${primaryContract} true)`)) {
    problems.push(`AllowedNftContracts must initially allow '${primaryContract}'`);
  }
  if (!active.includes('(define-public (set-bns-attestor-pubkey-hash')) {
    problems.push('set-bns-attestor-pubkey-hash is missing from the active source');
  }
  if (!active.includes('(define-public (create-campaign-drop')) {
    problems.push('create-campaign-drop is missing from the active source');
  }
  if (!active.includes('(define-public (claim-campaign')) {
    problems.push('claim-campaign is missing from the active source');
  }

  return problems;
};

export const extractWalletTxId = (payload: unknown): string | null => {
  if (!payload || typeof payload !== 'object') return null;
  const candidate = payload as { txId?: unknown; txid?: unknown };
  const value =
    typeof candidate.txId === 'string'
      ? candidate.txId
      : typeof candidate.txid === 'string'
        ? candidate.txid
        : null;
  return value?.trim() || null;
};

export const formatDeployLog = (entries: DeployLogEntry[]): string =>
  entries
    .map((entry) => {
      const tx = entry.txId ? ` | tx ${entry.txId}` : '';
      return `${entry.at} | ${entry.level.toUpperCase()} | ${entry.action} | ${entry.message}${tx}`;
    })
    .join('\n');
