import { cvToJSON, hexToCV } from '@stacks/transactions';
import { applyHiroApiKey, getHiroApiKeys, shouldRetryWithNextHiroKey } from './hiro-keys';
import type { Env } from './db';

const BASES = { mainnet: 'https://api.hiro.so', testnet: 'https://api.testnet.hiro.so' } as const;

export const networkOfContract = (contractId: string): 'mainnet' | 'testnet' | null => {
  const address = contractId.split('.')[0]?.toUpperCase() ?? '';
  if (address.startsWith('SP') || address.startsWith('SM')) return 'mainnet';
  if (address.startsWith('ST') || address.startsWith('SN')) return 'testnet';
  return null;
};

/**
 * Server-side read-only call. `{ ok:false }` means the read failed — callers must
 * say "could not check", never treat it as a zero/empty value.
 */
export async function readOnlyJson(
  env: Env,
  contractId: string,
  functionName: string,
  args: string[] = [],
  fetcher: typeof fetch = (input, init) => globalThis.fetch(input, init)
): Promise<{ ok: true; value: any } | { ok: false; error: string }> {
  const network = networkOfContract(contractId);
  const [address, name] = contractId.split('.');
  if (!network || !name) return { ok: false, error: 'Invalid contract id.' };
  const url = `${BASES[network]}/v2/contracts/call-read/${address}/${name}/${functionName}`;
  const keys = getHiroApiKeys(env);
  const candidates = keys.length ? keys : [null];
  for (let i = 0; i < candidates.length; i += 1) {
    try {
      const headers = new Headers({ 'Content-Type': 'application/json' });
      applyHiroApiKey(headers, candidates[i]);
      const response = await fetcher(url, { method: 'POST', headers, body: JSON.stringify({ sender: address, arguments: args }) });
      if (i < candidates.length - 1 && shouldRetryWithNextHiroKey(response.status)) continue;
      if (!response.ok) return { ok: false, error: `HTTP ${response.status}` };
      const body = (await response.json()) as { okay?: boolean; result?: string; cause?: string };
      if (!body.okay || !body.result) return { ok: false, error: body.cause ?? 'read failed' };
      return { ok: true, value: cvToJSON(hexToCV(body.result)) };
    } catch (error) {
      if (i === candidates.length - 1) return { ok: false, error: error instanceof Error ? error.message : 'read failed' };
    }
  }
  return { ok: false, error: 'read failed' };
}

export async function readOnlyUint(env: Env, contractId: string, functionName: string, fetcher?: typeof fetch) {
  const result = await readOnlyJson(env, contractId, functionName, [], fetcher);
  if (!result.ok) return { ok: false as const, value: null };
  let value = result.value;
  if (typeof value?.type === 'string' && value.type.startsWith('(response')) value = value.value;
  if (value?.type !== 'uint') return { ok: false as const, value: null };
  return { ok: true as const, value: BigInt(value.value) };
}
