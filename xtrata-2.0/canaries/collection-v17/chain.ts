import { cvToHex, hexToCV, type ClarityValue, type StacksTransaction } from '@stacks/transactions';
import { StacksMainnet, StacksTestnet, type StacksNetwork } from '@stacks/network';
import type { Net } from './wallet';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const toHex = (b: Uint8Array) => Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');

const NETWORKS: Record<Net, { explorer: string; fallback: string }> = {
  mainnet: { explorer: 'https://explorer.hiro.so', fallback: 'https://api.hiro.so' },
  testnet: { explorer: 'https://explorer.hiro.so', fallback: 'https://api.testnet.hiro.so' }
};

/**
 * Hiro API client: the xtrata.xyz proxy first (same-origin when the page is
 * served from xtrata.xyz), then Hiro directly. 429/5xx retry with backoff.
 * A failed read throws — it is never turned into "empty".
 */
export class Chain {
  readonly bases: string[];
  readonly stacks: StacksNetwork;
  constructor(readonly name: Net) {
    const onXtrata = typeof location !== 'undefined' && /(^|\.)xtrata\.xyz$/.test(location.hostname);
    this.bases = [onXtrata ? `/hiro/${name}` : `https://xtrata.xyz/hiro/${name}`, NETWORKS[name].fallback];
    this.stacks = name === 'mainnet' ? new StacksMainnet({ url: NETWORKS[name].fallback }) : new StacksTestnet({ url: NETWORKS[name].fallback });
  }
  txUrl(txid: string) { return `${NETWORKS[this.name].explorer}/txid/${txid.startsWith('0x') ? txid : `0x${txid}`}?chain=${this.name}`; }
  contractUrl(id: string) { return `${NETWORKS[this.name].explorer}/txid/${id}?chain=${this.name}`; }
  async fetch(path: string, init: RequestInit = {}) {
    let last: unknown;
    for (const base of this.bases) {
      for (let attempt = 0; attempt < 4; attempt++) {
        try {
          const response = await fetch(base + path, init);
          if (response.status === 429 || response.status >= 500) { last = new Error(`${response.status} from ${base}`); await sleep(1500 * (attempt + 1)); continue; }
          return response;
        } catch (e) { last = e; await sleep(800); break; }
      }
    }
    throw last instanceof Error ? last : new Error('network unavailable');
  }
  async json(path: string, init?: RequestInit) {
    const response = await this.fetch(path, init);
    const text = await response.text();
    try { return { status: response.status, body: JSON.parse(text) }; } catch { return { status: response.status, body: text as any }; }
  }
  /** Read-only call; returns the raw ClarityValue. Throws on any failure. */
  async read(contractId: string, fn: string, args: ClarityValue[] = [], sender?: string): Promise<ClarityValue> {
    const [address, name] = contractId.split('.');
    const { body } = await this.json(`/v2/contracts/call-read/${address}/${name}/${fn}`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ sender: sender || address, arguments: args.map((a) => cvToHex(a)) })
    });
    if (!body || !body.okay) throw new Error(`read ${fn} failed: ${body?.cause || JSON.stringify(body).slice(0, 200)}`);
    return hexToCV(body.result);
  }
  /** null = definitely not deployed (404). Throws if the lookup itself failed. */
  async contractSource(contractId: string): Promise<string | null> {
    const [address, name] = contractId.split('.');
    const { status, body } = await this.json(`/v2/contracts/source/${address}/${name}?proof=0`);
    if (status === 404) return null;
    if (status !== 200 || typeof body?.source !== 'string') throw new Error(`Could not check ${contractId} (HTTP ${status}).`);
    return body.source;
  }
  async tx(txid: string) {
    const { status, body } = await this.json(`/extended/v1/tx/${txid.startsWith('0x') ? txid : `0x${txid}`}`);
    return status === 200 ? body : null;
  }
  async balance(address: string): Promise<bigint> {
    const { status, body } = await this.json(`/extended/v1/address/${address}/stx`);
    if (status !== 200 || body?.balance === undefined) throw new Error(`Could not read the balance of ${address} (HTTP ${status}).`);
    return BigInt(body.balance);
  }
  async nonce(address: string): Promise<bigint> {
    const { status, body } = await this.json(`/extended/v1/address/${address}/nonces`);
    if (status !== 200 || body?.possible_next_nonce === undefined) throw new Error(`Could not read the nonce of ${address}.`);
    return BigInt(body.possible_next_nonce);
  }
  async pendingCount(address: string): Promise<number> {
    const { status, body } = await this.json(`/extended/v1/address/${address}/mempool?limit=1`);
    if (status !== 200) throw new Error('Could not read the mempool.');
    return Number(body?.total ?? 0);
  }
  async broadcastRaw(bytes: Uint8Array | string): Promise<string> {
    const raw = typeof bytes === 'string' ? Uint8Array.from(bytes.replace(/^0x/, '').match(/../g)!.map((h) => parseInt(h, 16))) : bytes;
    const response = await this.fetch('/v2/transactions', { method: 'POST', headers: { 'content-type': 'application/octet-stream' }, body: raw as unknown as BodyInit });
    const text = await response.text();
    if (response.status !== 200) throw new Error(`broadcast rejected: ${text.slice(0, 300)}`);
    const parsed = JSON.parse(text);
    const txid = typeof parsed === 'string' ? parsed : parsed.txid;
    return txid.startsWith('0x') ? txid : `0x${txid}`;
  }
  async broadcast(tx: StacksTransaction) { return this.broadcastRaw(tx.serialize() as Uint8Array); }
  async wait(txid: string, onTick: (state: string, seconds: number) => void = () => {}, timeoutMs = 30 * 60_000) {
    const started = Date.now();
    let seen = false;
    while (Date.now() - started < timeoutMs) {
      const tx = await this.tx(txid).catch(() => null);
      if (tx) { seen = true; if (tx.tx_status && tx.tx_status !== 'pending') return tx; }
      onTick(seen ? 'pending' : 'not yet visible', Math.round((Date.now() - started) / 1000));
      await sleep(4000);
    }
    throw new Error(`timed out waiting for ${txid}`);
  }
}

export { toHex };
