import {
  bufferCV,
  listCV,
  stringAsciiCV,
  uintCV,
  makeStandardSTXPostCondition,
  FungibleConditionCode
} from '@stacks/transactions';
import { chunkBytes, computeExpectedHash } from '../chunking/hash';
import type { XtrataClient } from '../contract/client';
import type { ContractConfig } from '../contract/config';
import { getContractId } from '../contract/config';
import type { WalletSession } from '../wallet/types';
import { loadWalletHoldingsPage, type WalletHoldingsPage } from './wallet-index';

export const GAME_SAVE_CONTRACT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
export const GAME_SAVE_LIMIT = 32 * 16384;
export const GAME_SAVE_METHODS = new Set([
  'xtrata_saveGame',
  'xtrata_checkGameSave',
  'xtrata_loadGameSave',
  'xtrata_listGameSaves'
]);
export type SaveReview = {
  kind: 'save';
  label: string;
  address: string;
  network: 'mainnet';
  bytes: number;
  protocolFee: string;
  contract: string;
  json: string;
};
const error = (message: string, code = -32602) => Object.assign(new Error(message), { code });
const hex = (b: Uint8Array) => Array.from(b, (v) => v.toString(16).padStart(2, '0')).join('');
export function parseGameSave(json: unknown, address: string, requireWallet = true) {
  if (typeof json !== 'string' || json.length > GAME_SAVE_LIMIT)
    throw error(
      'This save is too large for in-game publication. Download the JSON and use Xtrata’s inscription screen.'
    );
  const bytes = new TextEncoder().encode(json);
  if (!bytes.length || bytes.length > GAME_SAVE_LIMIT)
    throw error('This save exceeds the in-game publication limit. Download the JSON instead.');
  let data: any;
  try {
    data = JSON.parse(json);
  } catch {
    throw error('Invalid save JSON.');
  }
  if (
    data?.format !== 'meridian-save' ||
    data.version !== 2 ||
    data.save?.schema !== 1 ||
    !['1.3.5', '1.3.6'].includes(data.save.caseVersion) ||
    !Array.isArray(data.save.commands) ||
    data.save.commands.length > 20000 ||
    data.save.annotations?.version !== 1 ||
    !Array.isArray(data.save.annotations.notes)
  )
    throw error('Unsupported Meridian checkpoint.');
  if (
    (requireWallet || data.wallet != null) &&
    (data.wallet?.address !== address || data.wallet?.network !== 'mainnet')
  )
    throw error('The save must name the connected mainnet wallet. Generate it again.');
  const chunks = chunkBytes(bytes),
    hash = computeExpectedHash(chunks);
  return { json, bytes, chunks, hash, hashHex: hex(hash) };
}
export type SavePorts = {
  client: Pick<
    XtrataClient,
    'quoteSingleTxFee' | 'getIdByHash' | 'getInscriptionMeta' | 'getOwner' | 'getChunk' | 'isPaused'
  >;
  contract: ContractConfig;
  session: WalletSession;
  label: string;
  guard: () => void;
  review: (r: SaveReview) => Promise<boolean>;
  submit: (options: any) => Promise<any>;
  holdingsPage?: (pageIndex: number) => Promise<WalletHoldingsPage>;
};
/** Narrow JSON-only publisher. No caller-selected contracts, methods, spend caps or recipients. */
export async function runGameSave(method: string, params: unknown, p: SavePorts) {
  if (!GAME_SAVE_METHODS.has(method)) throw error('Unsupported save method.', -32601);
  if (getContractId(p.contract) !== GAME_SAVE_CONTRACT || p.contract.network !== 'mainnet')
    throw error('In-game saves currently require the mainnet Xtrata v3.2.3 viewer.', -32601);
  const address = p.session.address;
  if (!p.session.isConnected || !address || p.session.network !== 'mainnet')
    throw error('Connect a mainnet wallet.', 4100);
  const input = params as any;
  if (!input || input.address !== address || input.network !== 'mainnet')
    throw error('Wallet changed. Reconnect and review the save again.');
  p.guard();
  const verifyMeta = async (id: bigint, expected?: string) => {
    const meta = await p.client.getInscriptionMeta(id, address);
    p.guard();
    if (
      !meta?.sealed ||
      meta.creator !== address ||
      meta.mimeType !== 'application/json' ||
      meta.totalSize <= 0n ||
      meta.totalSize > BigInt(GAME_SAVE_LIMIT) ||
      meta.totalChunks !== BigInt(Math.ceil(Number(meta.totalSize) / 16384)) ||
      (expected && hex(meta.finalHash) !== expected)
    )
      throw error('This is not a confirmed JSON save published by the connected wallet.');
    if (await p.client.getOwner(id, address) !== address)
      throw error('This save is no longer owned by the connected wallet.');
    p.guard();
    return meta;
  };
  if (method === 'xtrata_listGameSaves') {
    const cursor = input.cursor ?? 0;
    if (!Number.isSafeInteger(cursor) || cursor < 0 || cursor > 100000)
      throw error('Invalid checkpoint history page.');
    const pageSize = 10;
    const page = await (p.holdingsPage
      ? p.holdingsPage(cursor)
      : loadWalletHoldingsPage({network:'mainnet',walletAddress:address,
          contractIds:[GAME_SAVE_CONTRACT],pageIndex:cursor,pageSize}));
    p.guard();
    const saves: {tokenId:string;bytes:number;createdAt:string|null;hash:string}[] = [];
    // Holdings are candidates only. Validate creator, live NFT ownership,
    // schema and every content byte before offering an entry to the player.
    for (const id of [...new Set(page.tokenIds)].slice(0,pageSize)) {
      try {
        const loaded = await runGameSave('xtrata_loadGameSave', {...input,tokenId:id.toString()}, p);
        const data = JSON.parse(loaded.json!);
        const date = typeof data.createdAt === 'string' && Number.isFinite(Date.parse(data.createdAt))
          ? new Date(data.createdAt).toISOString() : null;
        saves.push({tokenId:id.toString(),bytes:new TextEncoder().encode(loaded.json).length,
          createdAt:date,hash:loaded.hash!});
      } catch (e) {
        p.guard();
        // Non-save assets are expected; network failures must remain visible.
        if ((e as any)?.code !== -32602) throw e;
      }
    }
    saves.sort((a,b)=>BigInt(a.tokenId)>BigInt(b.tokenId)?-1:1);
    return {status:'listed',contract:GAME_SAVE_CONTRACT,address,saves,
      nextCursor:(cursor+1)*pageSize<page.total?cursor+1:null,scanned:page.tokenIds.length};
  }
  if (method === 'xtrata_loadGameSave') {
    if (
      typeof input.tokenId !== 'string' ||
      !/^\d{1,39}$/.test(input.tokenId) ||
      BigInt(input.tokenId) >= 2n ** 128n
    )
      throw error('Enter a valid save inscription ID.');
    const id = BigInt(input.tokenId),
      meta = await verifyMeta(id),
      chunks: Uint8Array[] = [];
    for (let i = 0; i < Number(meta.totalChunks); i++) {
      const part = await p.client.getChunk(id, BigInt(i), address);
      p.guard();
      const expected =
        i === Number(meta.totalChunks) - 1 ? Number(meta.totalSize) - i * 16384 : 16384;
      if (!part || part.length !== expected)
        throw error('Incomplete save bytes. Try loading again.');
      chunks.push(part);
    }
    if (hex(computeExpectedHash(chunks)) !== hex(meta.finalHash))
      throw error('Save integrity check failed.');
    const bytes = new Uint8Array(Number(meta.totalSize));
    let offset = 0;
    for (const c of chunks) {
      bytes.set(c, offset);
      offset += c.length;
    }
    let json: string;
    try { json = new TextDecoder('utf-8', { fatal: true }).decode(bytes); }
    catch { throw error('Invalid checkpoint UTF-8 encoding.'); }
    parseGameSave(json, address, false);
    // Ownership can change while chunks are loading. Do not restore a
    // transferred checkpoint using a stale holdings/metadata response.
    if (await p.client.getOwner(id, address) !== address)
      throw error('This save is no longer owned by the connected wallet.');
    p.guard();
    return {
      status: 'confirmed',
      contract: GAME_SAVE_CONTRACT,
      tokenId: id.toString(),
      hash: hex(meta.finalHash),
      json,
      owner: address,
      creator: address
    };
  }
  if (method === 'xtrata_checkGameSave') {
    if (typeof input.hash !== 'string' || !/^[a-f0-9]{64}$/.test(input.hash))
      throw error('Invalid save fingerprint.');
    const hash = Uint8Array.from(input.hash.match(/../g)!, (v: string) => parseInt(v, 16));
    const id = await p.client.getIdByHash(hash, address);
    p.guard();
    if (id === null)
      return { status: 'unconfirmed', hash: input.hash, contract: GAME_SAVE_CONTRACT };
    await verifyMeta(id, input.hash);
    return {
      status: 'confirmed',
      hash: input.hash,
      tokenId: id.toString(),
      contract: GAME_SAVE_CONTRACT
    };
  }
  const save = parseGameSave(input.json, address);
  const existing = await p.client.getIdByHash(save.hash, address);
  p.guard();
  if (existing !== null) {
    await verifyMeta(existing, save.hashHex);
    return {
      status: 'confirmed',
      tokenId: existing.toString(),
      hash: save.hashHex,
      contract: GAME_SAVE_CONTRACT
    };
  }
  if (await p.client.isPaused(address))
    throw error('Xtrata inscriptions are paused. Keep the JSON and try later.');
  const game = await p.client.getInscriptionMeta(3040n, address);
  if (!game?.sealed) throw error('The original game inscription is unavailable.');
  const fee = await p.client.quoteSingleTxFee(
    BigInt(save.bytes.length),
    BigInt(save.chunks.length),
    address
  );
  p.guard();
  if (fee < 0n || fee > 1000000n)
    throw error('Unexpected protocol fee. Use the standard inscription screen to review it.');
  if (
    !(await p.review({
      kind: 'save',
      label: p.label,
      address,
      network: 'mainnet',
      bytes: save.bytes.length,
      protocolFee: fee.toString(),
      contract: GAME_SAVE_CONTRACT,
      json: save.json
    }))
  )
    throw error('Save publication cancelled.', 4001);
  p.guard();
  // Recheck after the human review, before handing anything to the wallet.
  const fresh = await p.client.quoteSingleTxFee(
    BigInt(save.bytes.length),
    BigInt(save.chunks.length),
    address
  );
  p.guard();
  if (fresh !== fee) throw error('The protocol fee changed. Review the save again.', 4001);
  const result = await p.submit({
    contract: p.contract,
    functionName: 'mint-single-tx-recursive',
    functionArgs: [
      bufferCV(save.hash),
      stringAsciiCV('application/json'),
      uintCV(BigInt(save.bytes.length)),
      listCV(save.chunks.map(bufferCV)),
      stringAsciiCV('meridian-save-v2'),
      listCV([uintCV(3040n)])
    ],
    postConditions: [makeStandardSTXPostCondition(address, FungibleConditionCode.LessEqual, fee)]
  });
  const raw = String(result?.txId ?? result?.txid ?? '');
  if (!/^(0x)?[a-fA-F0-9]{64}$/.test(raw))
    throw error('The wallet outcome is unknown. Check this save before trying again.', -32002);
  return {
    status: 'submitted',
    txid: '0x' + raw.replace(/^0x/, '').toLowerCase(),
    hash: save.hashHex,
    contract: GAME_SAVE_CONTRACT
  };
}
