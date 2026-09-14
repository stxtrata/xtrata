import { bufferCV, uintCV, listCV, ClarityType, standardPrincipalCV, serializeCV, deserializeCV, type ClarityValue } from '@stacks/transactions';
import { bytesToHex } from '@noble/hashes/utils';
import { parseGetChunkBatch, parseGetIdByHash, parseGetInscriptionMeta } from '../../../src/lib/protocol/parsers';
import { expectOptional, expectPrincipal, expectTuple } from '../../../src/lib/protocol/clarity';
import { applyHiroApiKey, getHiroApiKeys } from '../hiro-keys';
import type { Env } from '../db';
import { boundedInt, CHUNK_SIZE, hashBytes, normalizeHash, type Snapshot, type StoredObject } from './common';

export const DEFAULT_CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
export type ChainProof = { kind: 'sealed-content'; network: 'mainnet' | 'testnet'; core: string; helper: string;
  tokenId: string; hash: string; size: number; chunks: number; blockHeight: number; blockHash: string;
  confirmations: number; verifiedAt: number; collectionMint: boolean; mintOwner: string | null };
export type Target = { core: string; helper: string; network: 'mainnet' | 'testnet' };
export function targetFor(env: Env, collection: Record<string, unknown>): Target {
  const metadata = typeof collection.metadata === 'string' ? JSON.parse(collection.metadata) : collection.metadata as Record<string, unknown>;
  const core = String(metadata?.coreContractId ?? '');
  const helper = String(collection.contract_address ?? '');
  const allowed = String(env.COLLECTION_CLEANUP_CORES ?? DEFAULT_CORE).split(',').map(x => x.trim());
  const pattern = /^(S[PTMN][A-Z0-9]{20,40})\.([a-zA-Z][a-zA-Z0-9_-]{0,127})$/;
  if (!allowed.includes(core) || !pattern.test(core) || !pattern.test(helper)) throw new Error('Collection requires an allowlisted core and a deployed helper.');
  const network = core.startsWith('ST') || core.startsWith('SN') ? 'testnet' : 'mainnet';
  if ((helper.startsWith('ST') || helper.startsWith('SN')) !== (network === 'testnet')) throw new Error('Core and helper networks disagree.');
  return { core, helper, network };
}
export function makeChainReader(env: Env, target: Target, fetcher: typeof fetch = fetch) {
  const base = target.network === 'mainnet' ? 'https://api.mainnet.hiro.so' : 'https://api.testnet.hiro.so';
  async function json(path: string, init?: RequestInit) {
    const headers = new Headers(init?.headers);
    applyHiroApiKey(headers, getHiroApiKeys(env)[0] ?? null);
    const response = await fetcher(base + path, { ...init, headers, signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`Chain verification unavailable (${response.status}).`);
    return response.json();
  }
  async function block(height: number) {
    const result = await json(`/extended/v1/block/by_height/${height}`);
    if (result.canonical !== true || result.height !== height || !/^0x[0-9a-f]{64}$/i.test(result.index_block_hash)) throw new Error('Canonical block evidence unavailable.');
    return { height, hash: result.index_block_hash.toLowerCase() as string };
  }
  return {
    async anchor() {
      const info = await json('/v2/info');
      const confirmations = boundedInt(env.COLLECTION_CLEANUP_CONFIRMATIONS, 6, 6, 10000);
      const tip = Number(info.stacks_tip_height);
      if (!Number.isSafeInteger(tip) || tip < confirmations) throw new Error('Confirmed chain tip unavailable.');
      return { ...await block(tip - confirmations), confirmations };
    },
    async canonical(height: number, hash: string) { if ((await block(height)).hash !== hash) throw new Error('Chain reorganization: rescan required.'); },
    async read(contract: string, name: string, args: ClarityValue[], tip: string) {
      const [address, contractName] = contract.split('.');
      const queryTip = tip.replace(/^0x/, '');
      if (queryTip !== 'latest' && !/^[0-9a-f]{64}$/.test(queryTip)) throw new Error('Invalid verification block ID.');
      const body = await json(`/v2/contracts/call-read/${address}/${contractName}/${name}?tip=${encodeURIComponent(queryTip)}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: address, arguments: args.map(arg => '0x' + bytesToHex(serializeCV(arg))) })
      });
      if (body.okay !== true || typeof body.result !== 'string') throw new Error(`Read-only verification failed: ${name}.`);
      return deserializeCV(body.result);
    }
  };
}
export type ChainReader = ReturnType<typeof makeChainReader>;
export async function verifySealedContent(env: Env, target: Target, object: StoredObject, snapshot: Snapshot,
  reader: ChainReader = makeChainReader(env, target), now = Date.now()): Promise<ChainProof> {
  if (snapshot.assets.some(a => a.collection_id !== object.collection_id || normalizeHash(a.expected_hash) !== object.content_hash ||
      Number(a.total_bytes) !== object.total_bytes || Number(a.total_chunks) !== object.total_chunks)) throw new Error('Shared asset references disagree with verified bytes.');
  if (snapshot.reservations.length > 100) throw new Error('Too many reservation records for one verification.');
  const anchor = await reader.anchor();
  const hashArg = bufferCV(Uint8Array.from(object.content_hash.match(/../g)!.map(x => parseInt(x, 16))));
  const id = parseGetIdByHash(await reader.read(target.core, 'get-id-by-hash', [hashArg], anchor.hash));
  if (id === null) throw new Error('Hash has no confirmed inscription. Keep staged bytes.');
  const meta = parseGetInscriptionMeta(await reader.read(target.core, 'get-inscription-meta', [uintCV(id)], anchor.hash));
  if (!meta?.sealed || bytesToHex(meta.finalHash) !== object.content_hash || meta.totalSize !== BigInt(object.total_bytes) ||
      meta.totalChunks !== BigInt(object.total_chunks)) throw new Error('Sealed metadata does not match staged content.');
  const bytes = new Uint8Array(object.total_bytes);
  let offset = 0;
  for (let start = 0; start < object.total_chunks; start += 50) {
    const length = Math.min(50, object.total_chunks - start);
    const indexes = Array.from({ length }, (_, i) => uintCV(start + i));
    const chunks = parseGetChunkBatch(await reader.read(target.core, 'get-chunk-batch', [uintCV(id), listCV(indexes)], anchor.hash));
    if (chunks.length !== length) throw new Error('Incomplete chain reconstruction.');
    for (const chunk of chunks) {
      const expected = Math.min(CHUNK_SIZE, bytes.length - offset);
      if (!chunk || chunk.length !== expected || expected <= 0) throw new Error('On-chain bytes are missing or have invalid shape.');
      bytes.set(chunk, offset); offset += chunk.length;
    }
  }
  if (offset !== bytes.length || hashBytes(bytes) !== object.content_hash) throw new Error('Reconstructed chain hash mismatch.');
  // Reservations are checked at the current tip as well, not only the older evidence block.
  const locked = await reader.read(target.helper, 'get-locked-core-contract', [], 'latest');
  if (locked.type !== ClarityType.ResponseOk || expectPrincipal(locked.value, 'locked core') !== target.core) throw new Error('Helper is not pinned to this core.');
  const context = expectOptional(await reader.read(target.helper, 'get-token-mint-context', [uintCV(id)], anchor.hash), 'mint context');
  const mintOwner = context ? expectPrincipal(expectTuple(context, 'mint context').owner, 'mint owner') : null;
  // v1.4 has no global hash lock. Fail closed for unknown methods/versions in this first v1.5 cleanup release.
  const hashReservation = expectOptional(await reader.read(target.helper, 'get-hash-reservation', [hashArg], 'latest'), 'hash reservation');
  if (hashReservation) throw new Error('The helper still has an active hash reservation.');
  for (const reservation of snapshot.reservations) {
    if (reservation.collection_id !== object.collection_id || normalizeHash(reservation.hash_hex) !== object.content_hash) throw new Error('Reservation reference mismatch.');
    const pending = expectOptional(await reader.read(target.helper, 'get-reservation', [standardPrincipalCV(reservation.buyer_address), hashArg], 'latest'), 'reservation');
    if (pending) throw new Error('An on-chain reservation is still active.');
    if (!['released', 'cancelled'].includes(reservation.status) && reservation.buyer_address !== mintOwner) throw new Error('Unsettled reservation needs manual resolution.');
  }
  await reader.canonical(anchor.height, anchor.hash);
  return { kind: 'sealed-content', ...target, tokenId: id.toString(), hash: object.content_hash, size: object.total_bytes,
    chunks: object.total_chunks, blockHeight: anchor.height, blockHash: anchor.hash, confirmations: anchor.confirmations,
    verifiedAt: now, collectionMint: mintOwner !== null, mintOwner };
}
