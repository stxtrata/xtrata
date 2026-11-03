import { deserializeCV } from '@stacks/transactions';
import { expectUInt } from '../../src/lib/protocol/clarity';
import { CORE_ASSET_ID, COLLECTION_CONTRACT_ID } from '../../src/audionaut/core';
import { makeChainReader } from './collection-storage/chain';
import { royaltyChainFetch } from './audionaut-royalty-chain';
import { queryAll, run, type Env } from './db';
import type { MintedAudionaut, Snapshot } from './audionaut-royalties';
import { XTRATA_OWNER_ADDRESS } from './creator-auth';

export type SaleProof = { txId: string; amountMicroStx: string };
export async function readAudionautSale(env: Env, row: MintedAudionaut, live: Snapshot,
  fetcher = royaltyChainFetch(env)): Promise<SaleProof> {
  const reader = makeChainReader(env, { core: CORE_ASSET_ID.split('::')[0], helper: COLLECTION_CONTRACT_ID, network: 'mainnet' }, fetcher);
  const cached = (await queryAll(env, 'SELECT * FROM audionaut_royalty_sales WHERE token_id=?', [row.tokenId])).results?.[0] as any;
  if (cached) {
    if (cached.block_height !== row.mintedAt || cached.block_height > live.blockHeight) throw Error('Sale needs confirmation.');
    await reader.canonical(cached.block_height, cached.block_hash);
    return { txId: cached.tx_id, amountMicroStx: cached.amount_micro_stx };
  }
  async function json(path: string) {
    const response = await fetcher('https://api.hiro.so' + path, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw Error(`Sale receipt unavailable (${response.status}).`);
    return response.json();
  }
  let cursor: string | null = null, mint: any = null;
  for (let page = 0; page < 3; page++) {
    const history = await json(`/extended/v3/tokens/nft/${encodeURIComponent(CORE_ASSET_ID)}/${row.tokenId}/history?limit=50${cursor ? '&cursor=' + encodeURIComponent(cursor) : ''}`);
    if (!Array.isArray(history.results)) throw Error('Invalid mint history.');
    mint = history.results.find((event: any) => event.sender === null && event.block?.height === row.mintedAt);
    if (mint) break;
    const next = history.cursor?.next;
    if (!next || next === cursor) break;
    cursor = String(next);
  }
  const txId = mint?.transaction?.tx_id, hash = mint?.block?.index_hash;
  if (!/^0x[a-f0-9]{64}$/i.test(txId ?? '') || !/^0x[a-f0-9]{64}$/i.test(hash ?? '')) throw Error('Mint receipt could not be located.');
  const tx = await json(`/extended/v1/tx/${txId}?event_limit=50`);
  if (tx.tx_id !== txId || tx.tx_status !== 'success' || tx.canonical !== true || tx.microblock_canonical === false || tx.is_unanchored === true ||
      tx.block_height !== row.mintedAt || tx.block_height > live.blockHeight || tx.block_hash !== mint.block.hash ||
      tx.tx_type !== 'contract_call' || tx.contract_call?.contract_id !== COLLECTION_CONTRACT_ID) throw Error('Sale is not a confirmed collection mint.');
  let events = tx.events;
  if (!Array.isArray(events) || !Number.isSafeInteger(tx.event_count) || tx.event_count < events.length || tx.event_count > 1000) throw Error('Incomplete sale events.');
  for (let offset = events.length; offset < tx.event_count; offset += 50) {
    const part = await json(`/extended/v1/tx/${txId}?event_limit=50&event_offset=${offset}`);
    if (part.tx_id !== txId || part.canonical !== true || part.block_hash !== tx.block_hash || !Array.isArray(part.events) || !part.events.length) throw Error('Incomplete sale events.');
    events = events.concat(part.events);
  }
  if (events.length !== tx.event_count || new Set(events.map((e: any) => e.event_index)).size !== events.length) throw Error('Incomplete sale events.');
  const mints = events.filter((event: any) => event.event_type === 'non_fungible_token_asset' && event.asset?.asset_event_type === 'mint' && event.asset?.asset_id === CORE_ASSET_ID);
  if (!mints.some((event: any) => Number(expectUInt(deserializeCV(event.asset.value.hex), 'sale token')) === row.tokenId)) throw Error('Sale minted another inscription.');
  // Core inscription fees precede mint events. Collection sale splits follow
  // the final mint, so protocol fees cannot masquerade as sale revenue.
  const lastMint = Math.max(...mints.map((event: any) => event.event_index));
  const received = events.filter((event: any) => event.event_index > lastMint && event.event_type === 'stx_asset' &&
    event.asset?.asset_event_type === 'transfer' && event.asset.sender === tx.sender_address && event.asset.recipient === XTRATA_OWNER_ADDRESS)
    .reduce((sum: bigint, event: any) => sum + BigInt(event.asset.amount), 0n);
  if (received < 5_000_000n * BigInt(mints.length)) throw Error('Sale does not show enough incoming STX for these retained royalties.');
  await reader.canonical(row.mintedAt, hash);
  await run(env, `INSERT OR REPLACE INTO audionaut_royalty_sales(token_id,tx_id,block_height,block_hash,amount_micro_stx) VALUES(?,?,?,?,?)`,
    [row.tokenId, txId, row.mintedAt, hash, received.toString()]);
  return { txId, amountMicroStx: received.toString() };
}
