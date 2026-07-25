/**
 * Thin Cloudflare Pages Function wrapper around the platform-agnostic core.
 *
 * Everything testable lives in the sibling modules; this file only wires:
 *   - a Hiro-backed ChainTransport (fetch)
 *   - the D1JobStore (env.DB, schema applied via src/schema.sql — never per request)
 *   - the Durable Object nonce authority (env.SPONSOR_NONCE) with an in-memory
 *     fallback for local `wrangler pages dev` without a DO binding
 *   - HTTP <-> RelayerRequest translation + CORS
 */
import {
  ClarityType,
  getAddressFromPrivateKey,
  hexToCV,
  type ClarityValue
} from '@stacks/transactions';
import { createRouter, type RelayerRequest } from './http.js';
import { D1JobStore, type D1DatabaseLike } from './jobs.js';
import {
  DurableObjectNonceAuthority,
  InMemoryNonceAuthority,
  type DurableObjectStubLike,
  type NonceAuthority
} from './nonce.js';
import { SponsorRelayer } from './sponsor.js';
import { defaultConfig, type BroadcastResult, type ChainTransport, type TxStatus } from './types.js';

export interface RelayerEnv {
  DB: D1DatabaseLike;
  SPONSOR_KEY: string;
  ATTESTOR_KEY?: string;
  DROPS_CONTRACT_ID: string;
  NFT_CONTRACT_ID: string;
  HIRO_API_KEY?: string;
  RELAYER_DISABLED?: string;
  DENIED_DROPS?: string;
  SPONSOR_NONCE?: { idFromName(name: string): unknown; get(id: unknown): DurableObjectStubLike };
}

const HIRO = 'https://api.hiro.so';

export const createHiroTransport = (apiKey?: string): ChainTransport => {
  const headers = (): Record<string, string> => (apiKey ? { 'x-api-key': apiKey } : {});
  const get = async (path: string) => fetch(`${HIRO}${path}`, { headers: headers() });
  const getJson = async <T>(path: string): Promise<T> => {
    const res = await get(path);
    if (!res.ok) throw new Error(`Hiro HTTP ${res.status}`);
    return (await res.json()) as T;
  };
  return {
    async getAccountNonce(address) {
      const j = await getJson<{ possible_next_nonce?: number }>(`/extended/v1/address/${address}/nonces`);
      return BigInt(j.possible_next_nonce ?? 0);
    },
    async getBalance(address) {
      const j = await getJson<{ balance?: string }>(`/extended/v1/address/${address}/stx`);
      if (typeof j.balance !== 'string' || !/^\d+$/.test(j.balance)) throw new Error('bad balance');
      return BigInt(j.balance);
    },
    async getTipHeight() {
      const j = await getJson<{ stacks_tip_height?: number }>(`/v2/info`);
      if (!Number.isSafeInteger(j.stacks_tip_height)) throw new Error('bad tip');
      return BigInt(j.stacks_tip_height!);
    },
    async estimateFeeUstx() {
      const rate = Number(await getJson<unknown>(`/v2/fees/transfer`));
      return BigInt(Math.max(3_000, Math.floor(rate * 600)));
    },
    async callReadOnly(contractId, fn, argsHex): Promise<ClarityValue | null> {
      const [address, name] = contractId.split('.');
      const res = await fetch(`${HIRO}/v2/contracts/call-read/${address}/${name}/${fn}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers() },
        body: JSON.stringify({ sender: address, arguments: argsHex })
      });
      if (!res.ok) return null;
      const j = (await res.json()) as { okay?: boolean; result?: string };
      if (!j.okay || !j.result) return null;
      try {
        return hexToCV(j.result);
      } catch {
        return null;
      }
    },
    async broadcast(txHex, expectedTxid): Promise<BroadcastResult> {
      const res = await fetch(`${HIRO}/v2/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream', ...headers() },
        body: Uint8Array.from(Buffer.from(txHex.replace(/^0x/i, ''), 'hex'))
      });
      const text = await res.text();
      if (res.ok) {
        const txid = text.trim().replace(/^"|"$/g, '').replace(/^0x/, '');
        if (!/^[0-9a-f]{64}$/i.test(txid)) return { ok: false, error: 'BAD_TXID', reason: text };
        return { ok: true, txid };
      }
      let rejected: { error?: unknown; reason?: unknown } = {};
      try {
        rejected = JSON.parse(text);
      } catch {
        /* unstructured upstream body */
      }
      void expectedTxid; // idempotency handled by the orchestrator via isTxKnown
      return {
        ok: false,
        error: String(rejected.error ?? `HTTP ${res.status}`),
        reason: String(rejected.reason ?? rejected.error ?? text)
      };
    },
    async isTxKnown(txid) {
      const res = await get(`/extended/v1/tx/0x${txid.replace(/^0x/, '')}`);
      return res.ok;
    },
    async getTxStatus(txid): Promise<TxStatus> {
      const res = await get(`/extended/v1/tx/0x${txid.replace(/^0x/, '')}`);
      if (res.status === 404) return 'not_found';
      if (!res.ok) return 'pending';
      const j = (await res.json()) as { tx_status?: string };
      const s = j.tx_status ?? 'pending';
      if (s === 'success') return 'success';
      if (s === 'abort_by_response') return 'abort_by_response';
      if (s === 'abort_by_post_condition') return 'abort_by_post_condition';
      if (s.startsWith('dropped')) return 'dropped';
      return 'pending';
    }
  };
};

// Module-scope caches (best-effort per isolate; correctness never depends on
// them — the DO owns nonces and D1 owns jobs).
let cachedRelayer: SponsorRelayer | null = null;
let cachedRouter: ReturnType<typeof createRouter> | null = null;

const buildRouter = (env: RelayerEnv) => {
  if (cachedRouter) return cachedRouter;
  const transport = createHiroTransport(env.HIRO_API_KEY);
  const cfg = defaultConfig({
    dropsContractId: env.DROPS_CONTRACT_ID,
    nftContractId: env.NFT_CONTRACT_ID,
    sponsorKey: env.SPONSOR_KEY,
    attestorKey: env.ATTESTOR_KEY,
    disabled: env.RELAYER_DISABLED === '1' || env.RELAYER_DISABLED === 'true',
    deniedDrops: new Set((env.DENIED_DROPS ?? '').split(',').map((s) => s.trim()).filter(Boolean))
  });
  const jobs = new D1JobStore(env.DB);
  let nonces: NonceAuthority;
  if (env.SPONSOR_NONCE) {
    const stub = env.SPONSOR_NONCE.get(env.SPONSOR_NONCE.idFromName('sponsor'));
    nonces = new DurableObjectNonceAuthority(stub);
  } else {
    // Local dev fallback only — a single isolate, so in-memory is safe there.
    const sponsorAddress = getAddressFromPrivateKey(cfg.sponsorKey, cfg.network);
    nonces = new InMemoryNonceAuthority(transport, sponsorAddress);
  }
  cachedRelayer = new SponsorRelayer(cfg, transport, nonces, jobs);
  cachedRouter = createRouter(cachedRelayer, cfg, transport);
  return cachedRouter;
};

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'content-type',
  'Cache-Control': 'no-store'
};

/** Cloudflare Pages Function entrypoint: functions/sponsor/v3/[[path]].ts re-exports this. */
export const onRequest = async (context: {
  request: Request;
  env: RelayerEnv;
}): Promise<Response> => {
  const { request, env } = context;
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  const url = new URL(request.url);
  let body: unknown;
  if (request.method === 'POST') {
    try {
      body = await request.json();
    } catch {
      body = {};
    }
  }
  const relayerRequest: RelayerRequest = {
    method: request.method,
    path: url.pathname,
    body,
    originKey: request.headers.get('cf-connecting-ip') ?? 'unknown'
  };
  const router = buildRouter(env);
  const response = await router(relayerRequest);
  return new Response(JSON.stringify(response.body), {
    status: response.status,
    headers: { 'Content-Type': 'application/json', ...CORS }
  });
};

// Re-export ClarityType so the adapter compiles standalone under isolatedModules.
export { ClarityType };
