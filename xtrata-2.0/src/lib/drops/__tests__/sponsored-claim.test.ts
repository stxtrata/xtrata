import { describe, expect, it, vi } from 'vitest';
import { StacksMainnet } from '@stacks/network';
import {
  AnchorMode,
  PostConditionMode,
  TransactionVersion,
  contractPrincipalCV,
  getAddressFromPrivateKey,
  makeContractCall,
  uintCV
} from '@stacks/transactions';
import { buildContractTransferPostCondition } from '../../contract/post-conditions';
import {
  extractSponsoredTransactionHex,
  inspectSponsoredClaimTransaction,
  pollSponsorJob
} from '../sponsored-claim';

const DROPS_ADDRESS = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const DROPS_NAME = 'xtrata-drops-v1-0';
const DROPS = `${DROPS_ADDRESS}.${DROPS_NAME}`;
const NFT = `${DROPS_ADDRESS}.xtrata-v3-2-3`;
const BUYER_KEY = 'f9d7f5e0d0d81fdd90dcef4e0e2c1b9e3ea361776a5cd91b5c9a52b98b3e1cb601';
const BUYER_ADDRESS = getAddressFromPrivateKey(BUYER_KEY, TransactionVersion.Mainnet);

const fixture = async (postConditions = [
  buildContractTransferPostCondition({
    nftContract: { address: DROPS_ADDRESS, contractName: 'xtrata-v3-2-3', network: 'mainnet' },
    senderContract: { address: DROPS_ADDRESS, contractName: DROPS_NAME, network: 'mainnet' },
    tokenId: 2759n
  })
]) => {
  const tx = await makeContractCall({
    contractAddress: DROPS_ADDRESS,
    contractName: DROPS_NAME,
    functionName: 'claim',
    functionArgs: [contractPrincipalCV(DROPS_ADDRESS, 'xtrata-v3-2-3'), uintCV(7n)],
    senderKey: BUYER_KEY,
    network: new StacksMainnet(),
    fee: 0n,
    nonce: 0n,
    sponsored: true,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
    postConditions
  });
  return { tx, hex: Buffer.from(tx.serialize()).toString('hex') };
};

describe('sponsored drop claim inspection', () => {
  it('normalizes documented Xverse and Leather response envelopes', async () => {
    const { tx, hex } = await fixture();
    expect(extractSponsoredTransactionHex({ status: 'success', result: { txid: tx.txid(), transaction: hex } })).toBe(hex);
    expect(extractSponsoredTransactionHex({ jsonrpc: '2.0', result: { txid: tx.txid(), transaction: `0x${hex}` } })).toBe(hex);
    expect(extractSponsoredTransactionHex({ txId: tx.txid(), txRaw: hex })).toBe(hex);
  });

  it('proves the signed transaction targets the selected free claim', async () => {
    const { tx, hex } = await fixture();
    const result = inspectSponsoredClaimTransaction(
      { status: 'success', result: { txid: tx.txid(), transaction: hex } },
      {
        dropsContractId: DROPS,
        nftContractId: NFT,
        dropId: 7n,
        tokenId: 2759n,
        network: 'mainnet',
        claimerAddress: BUYER_ADDRESS
      }
    );
    expect(result.ok).toBe(true);
    expect(result.checks.every((check) => check.ok)).toBe(true);
  });

  it('blocks a signed claim with an irrelevant post-condition', async () => {
    const { hex } = await fixture([]);
    const result = inspectSponsoredClaimTransaction(hex, {
      dropsContractId: DROPS,
      nftContractId: NFT,
      dropId: 7n,
      tokenId: 2759n,
      network: 'mainnet'
    });
    expect(result.ok).toBe(false);
    expect(result.checks.find((check) => check.code === 'NFT_POST_CONDITION')).toMatchObject({ ok: false });
  });
});

describe('sponsor job polling', () => {
  it('logs every state transition through settlement', async () => {
    const statuses = [
      { id: 'sp-1', state: 'CONFIRMED', txids: { buy: 'buy' } },
      { id: 'sp-1', state: 'CLAIMED', txids: { buy: 'buy', claim: 'claim' } },
      { id: 'sp-1', state: 'SETTLED', txids: { buy: 'buy', claim: 'claim', refund: 'refund' } }
    ] as const;
    const client = { status: vi.fn().mockImplementation(async () => statuses.shift()) };
    const seen: string[] = [];
    const final = await pollSponsorJob({
      client: client as never,
      job: { id: 'sp-1', state: 'SPONSORED', txids: { buy: 'buy' } },
      intervalMs: 0,
      maxAttempts: 5,
      wait: async () => undefined,
      onStatus: (job) => seen.push(job.state)
    });
    expect(final.state).toBe('SETTLED');
    expect(seen).toEqual(['SPONSORED', 'CONFIRMED', 'CLAIMED', 'SETTLED']);
  });
});
