import { uintCV } from '@stacks/transactions';
import { expectBuffer, expectOptional, expectPrincipal, expectTuple, expectUInt, unwrapResponse } from '../../src/lib/protocol/clarity';
import { CORE_ASSET_ID, COLLECTION_CONTRACT_ID } from '../../src/audionaut/core';
import { makeChainReader, type ChainReader } from './collection-storage/chain';
import { applyHiroApiKey, getHiroApiKeys } from './hiro-keys';
import { networkForAddress } from './creator-proof';
import type { Env } from './db';
import catalogue from './audionaut-royalties-catalogue.json';

export const CORE = CORE_ASSET_ID.split('::')[0];
export const ROYALTY_MICRO_STX = 5_000_000;
export { catalogue };
export type Edition = typeof catalogue.editions[number];
export type ReceivingArtist = typeof catalogue.artists[number] & { address: string | null; error: string | null };
export type MintedAudionaut = Edition & { tokenId: number; mintedAt: number };
export type PaymentRecord = { tx_id: string; recipient: string; editions_json: string };
export type PaymentState = { status: 'paid' | 'unrecorded' | 'unverified'; txId: string | null; recipient: string | null; note: string };
export type RoyaltyRow = MintedAudionaut & PaymentState & { receivingAddress: string | null; firstSongId: number; dueMicroStx: number };
export type Snapshot = { minted: MintedAudionaut[]; artists: ReceivingArtist[]; checkedAt: number; blockHeight: number };

function okValue(value: Parameters<typeof unwrapResponse>[0]) {
  const result = unwrapResponse(value, 'Audionaut read');
  if (!result.ok) throw Error('The chain rejected the Audionaut read.');
  return result.value;
}
const safeNumber = (n: bigint) => {
  const number = Number(n);
  if (!Number.isSafeInteger(number) || number < 0) throw Error('Invalid chain number.');
  return number;
};
async function parallel<T, R>(items: T[], action: (item: T) => Promise<R>, width = 6): Promise<R[]> {
  const result: R[] = [];
  for (let i = 0; i < items.length; i += width) result.push(...await Promise.all(items.slice(i, i + width).map(action)));
  return result;
}

/** All mint and ownership reads refer to the same confirmed block. No staging row
 * or reservation is used as proof that a collectible has actually minted. */
export async function readRoyaltySnapshot(env: Env, reader: ChainReader = makeChainReader(env,
  { core: CORE, helper: COLLECTION_CONTRACT_ID, network: 'mainnet' })): Promise<Snapshot> {
  const anchor = await reader.anchor();
  const count = safeNumber(expectUInt(okValue(await reader.read(COLLECTION_CONTRACT_ID, 'get-minted-index-count', [], anchor.hash)), 'mint count'));
  if (count > 111) throw Error('Unexpected Audionaut supply.');
  const minted = await parallel(Array.from({ length: count }, (_, i) => i), async index => {
    const item = expectOptional(await reader.read(COLLECTION_CONTRACT_ID, 'get-minted-id', [uintCV(index)], anchor.hash), 'minted index');
    if (!item) throw Error('The minted index is incomplete. Refresh shortly.');
    const tokenId = safeNumber(expectUInt(expectTuple(item, 'minted index')['token-id'], 'token id'));
    const [content, context] = await Promise.all([
      reader.read(CORE, 'get-chunk', [uintCV(tokenId), uintCV(0)], anchor.hash),
      reader.read(COLLECTION_CONTRACT_ID, 'get-token-mint-context', [uintCV(tokenId)], anchor.hash)
    ]);
    const chunk = expectOptional(content, 'edition content'), mint = expectOptional(context, 'mint context');
    if (!chunk || !mint) throw Error(`Could not verify inscription #${tokenId}.`);
    const html = new TextDecoder().decode(expectBuffer(chunk, 'edition bytes'));
    const edition = Number(/data-edition=["'](\d{1,3})["']/.exec(html)?.[1]);
    const seed = Number(/data-seed=["'](\d+)["']/.exec(html)?.[1]);
    const entry = catalogue.editions.find(e => e.edition === edition);
    // Read inertly: no uploaded script runs in the function or in the ledger UI.
    if (!entry || entry.seed !== seed || !/src=["']\/i\/3060\?/.test(html) || !html.includes(CORE))
      throw Error(`Inscription #${tokenId} does not match the reviewed Audionaut catalogue.`);
    return { ...entry, tokenId, mintedAt: safeNumber(expectUInt(expectTuple(mint, 'mint context')['minted-at'], 'mint block')) };
  });
  if (new Set(minted.map(m => m.edition)).size !== minted.length) throw Error('Duplicate Audionaut editions in the minted index.');
  const artists = await parallel(catalogue.artists, async artist => {
    try {
      const value = expectOptional(okValue(await reader.read(CORE, 'get-owner', [uintCV(artist.firstSongId)], anchor.hash)), 'song owner');
      const address = value ? expectPrincipal(value, 'song owner') : null;
      // Escrow contracts cannot sign in. Do not guess a beneficial owner/payee.
      if (!address || address.includes('.') || networkForAddress(address) !== 'mainnet')
        return { ...artist, address: null, error: 'Receiving song has no direct wallet holder. Resolve its ownership before recording a payment.' };
      return { ...artist, address, error: null };
    } catch { return { ...artist, address: null, error: 'Could not verify the receiving song holder.' }; }
  });
  await reader.canonical(anchor.height, anchor.hash);
  return { minted: minted.sort((a, b) => a.edition - b.edition), artists, checkedAt: Date.now(), blockHeight: anchor.height };
}

export function normalizeTxId(value: unknown): string {
  const text = String(value ?? '').trim().toLowerCase();
  if (!/^(0x)?[a-f0-9]{64}$/.test(text)) throw Error('Enter a valid payment transaction ID.');
  return text.startsWith('0x') ? text : '0x' + text;
}
export function paymentEditions(value: unknown): number[] {
  if (!Array.isArray(value) || !value.length || value.length > 111 || value.some(n => !Number.isInteger(n) || n < 1 || n > 111))
    throw Error('Choose minted Audionaut editions from 1 to 111.');
  if (new Set(value).size !== value.length) throw Error('An edition can only be included once.');
  return [...value].sort((a, b) => a - b);
}

export function validatePaymentTransaction(tx: any, txId: string, recipient: string, amount: number, minBlock: number) {
  if (tx?.tx_id?.toLowerCase() !== txId || tx?.tx_status !== 'success' || tx?.canonical !== true || tx?.microblock_canonical === false || tx?.is_unanchored === true)
    throw Error('Payment is pending, failed or no longer canonical.');
  if (tx.tx_type !== 'token_transfer' || tx.token_transfer?.recipient_address !== recipient || String(tx.token_transfer?.amount) !== String(amount))
    throw Error('The transfer recipient or total does not match these 5 STX royalties.');
  if (!Number.isSafeInteger(tx.block_height) || tx.block_height < minBlock || !/^0x[a-f0-9]{64}$/i.test(tx.index_block_hash))
    throw Error('Payment must be confirmed after the selected editions were minted.');
  return { blockHeight: tx.block_height as number, blockHash: tx.index_block_hash.toLowerCase() as string };
}

export async function fetchPaymentTransaction(env: Env, txId: string, fetcher: typeof fetch = fetch) {
  const headers = new Headers({ Accept: 'application/json' });
  applyHiroApiKey(headers, getHiroApiKeys(env)[0] ?? null);
  const response = await fetcher(`https://api.hiro.so/extended/v1/tx/${normalizeTxId(txId)}`, { headers, signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw Error(`Could not verify payment (HTTP ${response.status}).`);
  return response.json();
}

/** Validate a whole transfer allocation at its own block. An artist's receiving
 * song may have changed hands since payment, so use its historical owner. */
export async function verifyRoyaltyPayment(env: Env, record: PaymentRecord, snapshot: Snapshot,
  reader: ChainReader = makeChainReader(env, { core: CORE, helper: COLLECTION_CONTRACT_ID, network: 'mainnet' }),
  fetchTx: (id: string) => Promise<any> = id => fetchPaymentTransaction(env, id)) {
  const editions = paymentEditions(JSON.parse(record.editions_json));
  const selected = editions.map(e => snapshot.minted.find(m => m.edition === e));
  if (selected.some(m => !m)) throw Error('A payment references an edition that is not minted.');
  const rows = selected as MintedAudionaut[];
  const firstSongIds = [...new Set(rows.map(row => catalogue.artists.find(a => a.artist === row.artist)!.firstSongId))];
  const txId = normalizeTxId(record.tx_id);
  const evidence = validatePaymentTransaction(await fetchTx(txId), txId, record.recipient,
    ROYALTY_MICRO_STX * editions.length, Math.max(...rows.map(m => m.mintedAt)));
  if (evidence.blockHeight > snapshot.blockHeight) throw Error('Payment needs more confirmations. Refresh shortly.');
  await reader.canonical(evidence.blockHeight, evidence.blockHash);
  for (const id of firstSongIds) {
    const owner = expectOptional(okValue(await reader.read(CORE, 'get-owner', [uintCV(id)], evidence.blockHash)), 'receiving holder at payment');
    if (!owner || expectPrincipal(owner, 'receiving holder') !== record.recipient)
      throw Error('The receiving address did not hold the artist’s first song when this transfer confirmed.');
  }
  return { editions, txId, recipient: record.recipient, ...evidence };
}

export async function royaltyRows(env: Env, snapshot: Snapshot, payments: PaymentRecord[],
  verify: (record: PaymentRecord) => Promise<unknown> = record => verifyRoyaltyPayment(env, record, snapshot)): Promise<RoyaltyRow[]> {
  const states = new Map<number, PaymentState>();
  await parallel(payments, async record => {
    const editions = paymentEditions(JSON.parse(record.editions_json));
    let state: PaymentState;
    try { await verify(record); state = { status: 'paid', txId: record.tx_id, recipient: record.recipient, note: 'Confirmed transfer to the song holder at the payment block.' }; }
    catch (error) { state = { status: 'unverified', txId: record.tx_id, recipient: record.recipient, note: error instanceof Error ? error.message : 'Could not verify payment.' }; }
    for (const edition of editions) {
      if (states.has(edition)) throw Error('Conflicting payment allocations.');
      states.set(edition, state);
    }
  }, 4);
  return snapshot.minted.map(row => {
    const artist = snapshot.artists.find(a => a.artist === row.artist)!;
    return { ...row, receivingAddress: artist.address, firstSongId: artist.firstSongId, dueMicroStx: ROYALTY_MICRO_STX,
      ...(states.get(row.edition) ?? { status: 'unrecorded', txId: null, recipient: null, note: 'No payment receipt recorded for this edition.' }) };
  });
}
