import { describe, expect, it, vi } from 'vitest';
import { StacksMainnet } from '@stacks/network';
import {
  AnchorMode,
  PostConditionMode,
  TransactionVersion,
  bufferCV,
  contractPrincipalCV,
  getAddressFromPrivateKey,
  makeContractCall,
  someCV,
  uintCV
} from '@stacks/transactions';
import { buildContractTransferPostCondition } from '../../contract/post-conditions';
import { SponsorClientError } from '../../market/sponsor-client';
import {
  SPONSOR_JOB_MAX_ATTEMPTS,
  SPONSOR_JOB_POLL_INTERVAL_MS,
  SPONSOR_SUBMIT_RETRY_DELAYS_MS,
  extractSponsoredTransactionHex,
  inspectSponsoredClaimTransaction,
  isSponsorClaimConfirmedState,
  pollSponsorJob,
  submitSponsorClaimWithRetry
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
    expect(extractSponsoredTransactionHex({ jsonrpc: '2.0', result: { txHex: `0x${hex}` } })).toBe(hex);
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

  it('proves all five signed v1.1 campaign claim arguments', async () => {
    const bnsKey = '11'.repeat(32);
    const signature = '22'.repeat(65);
    const postConditions = [
      buildContractTransferPostCondition({
        nftContract: { address: DROPS_ADDRESS, contractName: 'xtrata-v3-2-3', network: 'mainnet' },
        senderContract: { address: DROPS_ADDRESS, contractName: 'xtrata-drops-v1-1', network: 'mainnet' },
        tokenId: 2759n
      })
    ];
    const tx = await makeContractCall({
      contractAddress: DROPS_ADDRESS,
      contractName: 'xtrata-drops-v1-1',
      functionName: 'claim-campaign',
      functionArgs: [
        contractPrincipalCV(DROPS_ADDRESS, 'xtrata-v3-2-3'),
        uintCV(7n),
        someCV(bufferCV(Buffer.from(bnsKey, 'hex'))),
        uintCV(1_000n),
        bufferCV(Buffer.from(signature, 'hex'))
      ],
      senderKey: BUYER_KEY,
      network: new StacksMainnet(),
      fee: 0n,
      nonce: 0n,
      sponsored: true,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Deny,
      postConditions
    });
    const result = inspectSponsoredClaimTransaction(Buffer.from(tx.serialize()).toString('hex'), {
      dropsContractId: `${DROPS_ADDRESS}.xtrata-drops-v1-1`,
      nftContractId: NFT,
      dropId: 7n,
      tokenId: 2759n,
      network: 'mainnet',
      claimerAddress: BUYER_ADDRESS,
      campaignAttestation: { bnsKeyHex: bnsKey, expiresAt: 1_000n, signatureHex: signature }
    });
    expect(result.ok).toBe(true);
  });
});

describe('sponsor job polling', () => {
  it('treats origin confirmation as claimed while reimbursement continues', () => {
    expect(isSponsorClaimConfirmedState('SPONSORED')).toBe(false);
    expect(isSponsorClaimConfirmedState('CONFIRMED')).toBe(true);
    expect(isSponsorClaimConfirmedState('CLAIMING')).toBe(true);
    expect(isSponsorClaimConfirmedState('CLAIMED')).toBe(true);
    expect(isSponsorClaimConfirmedState('REFUNDING')).toBe(true);
    expect(isSponsorClaimConfirmedState('SETTLED')).toBe(true);
    expect(isSponsorClaimConfirmedState('ABANDONED')).toBe(false);
  });

  it('polls every four seconds for a fifteen-minute settlement window', async () => {
    const wait = vi.fn().mockResolvedValue(undefined);
    const client = {
      status: vi.fn().mockResolvedValue({ id: 'sp-1', state: 'SETTLED', txids: { buy: 'buy' } })
    };
    await pollSponsorJob({
      client: client as never,
      job: { id: 'sp-1', state: 'SPONSORED', txids: { buy: 'buy' } },
      wait
    });
    expect(SPONSOR_JOB_POLL_INTERVAL_MS).toBe(4_000);
    expect(SPONSOR_JOB_MAX_ATTEMPTS).toBe(225);
    expect(wait).toHaveBeenCalledWith(4_000);
    expect(client.status).toHaveBeenCalledTimes(1);
  });

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

describe('sponsor claim submit retry', () => {
  it('retries a transient sponsor-balance outage without requiring another signed transaction', async () => {
    const wait = vi.fn().mockResolvedValue(undefined);
    const retryError = new SponsorClientError(
      'RELAYER_UNAVAILABLE',
      'sponsor balance lookup unavailable; retry shortly',
      undefined,
      { httpStatus: 503, requestId: 'req-balance', stage: 'SPONSOR_BALANCE' }
    );
    const submit = vi
      .fn()
      .mockRejectedValueOnce(retryError)
      .mockResolvedValueOnce({ id: 'sp-1', state: 'SPONSORED', txids: { buy: 'buy' } });
    const onRetry = vi.fn();

    const job = await submitSponsorClaimWithRetry({
      client: { submit } as never,
      txHex: 'signed-once',
      contractId: DROPS,
      listingId: 11n,
      retryDelaysMs: [25],
      wait,
      onRetry
    });

    expect(job.state).toBe('SPONSORED');
    expect(submit).toHaveBeenCalledTimes(2);
    expect(submit).toHaveBeenNthCalledWith(1, {
      txHex: 'signed-once',
      contractId: DROPS,
      listingId: 11n
    });
    expect(submit).toHaveBeenNthCalledWith(2, {
      txHex: 'signed-once',
      contractId: DROPS,
      listingId: 11n
    });
    expect(wait).toHaveBeenCalledWith(25);
    expect(onRetry).toHaveBeenCalledWith(retryError, 1, 2, 25);
  });

  it('keeps submit retry delays bounded for user-visible recovery', () => {
    expect(SPONSOR_SUBMIT_RETRY_DELAYS_MS).toEqual([2_000, 5_000, 10_000, 20_000]);
  });
});
