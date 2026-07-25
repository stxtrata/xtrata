/**
 * Test fixtures: real serialized sponsored transactions built with
 * makeContractCall({sponsored:true}) and a fake in-memory chain implementing
 * the ChainTransport interface.
 */
import {
  Cl,
  hexToCV,
  makeContractCall,
  type ClarityValue,
  type PostCondition
} from '@stacks/transactions';
import { defaultConfig, type BroadcastResult, type ChainTransport, type RelayerConfig, type TxStatus } from '../src/types.js';

export const DEPLOYER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
export const DROPS_ID = `${DEPLOYER}.xtrata-drops-v3`;
export const NFT_ID = `${DEPLOYER}.xtrata-v3-2-3`;
export const COLLECTION_ID = `${DEPLOYER}.xtrata-collection-v3`;

export const SPONSOR_KEY = '2ae156d224f73bfee9d1d52e0210012b4ae4e85df2705f4f25b7ac62db45aa3b01';
export const ATTESTOR_KEY = '1c83f3b0b8fc8af8c7c4e336f4f9cdf4dbc8f6b8e1f3ebec705fca8d98379e4e01';

/** Deterministic distinct claimer keys. */
export const claimerKey = (i: number): string =>
  (i + 11).toString(16).padStart(64, '0') + '01';

export const testConfig = (overrides: Partial<RelayerConfig> = {}): RelayerConfig =>
  defaultConfig({
    dropsContractId: DROPS_ID,
    nftContractId: NFT_ID,
    sponsorKey: SPONSOR_KEY,
    attestorKey: ATTESTOR_KEY,
    ...overrides
  });

export const nftPostCondition = (tokenId: bigint): PostCondition => ({
  type: 'nft-postcondition',
  address: DROPS_ID,
  condition: 'sent',
  asset: `${NFT_ID}::xtrata-inscription`,
  assetId: Cl.uint(tokenId)
});

export interface BuildTxOptions {
  senderKey?: string;
  dropId?: bigint;
  functionName?: string;
  functionArgs?: ClarityValue[];
  fee?: bigint;
  nonce?: bigint;
  sponsored?: boolean;
  network?: 'mainnet' | 'testnet';
  postConditionMode?: 'allow' | 'deny';
  postConditions?: PostCondition[];
  contractName?: string;
  contractAddress?: string;
}

export const buildClaimTx = async (options: BuildTxOptions = {}): Promise<string> => {
  const {
    senderKey = claimerKey(0),
    dropId = 1n,
    functionName = 'claim',
    functionArgs,
    fee = 0n,
    nonce = 0n,
    sponsored = true,
    network = 'mainnet',
    postConditionMode = 'deny',
    postConditions = [nftPostCondition(7n)],
    contractName = 'xtrata-drops-v3',
    contractAddress = DEPLOYER
  } = options;
  const tx = await makeContractCall({
    contractAddress,
    contractName,
    functionName,
    functionArgs: functionArgs ?? [Cl.uint(dropId)],
    senderKey,
    network,
    fee,
    nonce,
    sponsored,
    postConditionMode,
    postConditions
  });
  return tx.serialize();
};

// ---------------------------------------------------------------- fake chain

export interface FakeDrop {
  status: bigint;
  mode: bigint;
  eligibility: bigint;
  startBlock: bigint;
  endBlock: bigint;
  budgetRemaining: bigint;
  perWalletLimit: bigint;
  feesSettled: bigint;
  claimedCount: bigint;
  remaining: bigint;
  walletClaims: Map<string, bigint>;
  reservations: Set<string>;
}

export const makeDrop = (overrides: Partial<FakeDrop> = {}): FakeDrop => ({
  status: 1n,
  mode: 3n,
  eligibility: 1n,
  startBlock: 0n,
  endBlock: 0n,
  budgetRemaining: 10_000_000n,
  perWalletLimit: 1n,
  feesSettled: 0n,
  claimedCount: 0n,
  remaining: 10n,
  walletClaims: new Map(),
  reservations: new Set(),
  ...overrides
});

export class FakeChain implements ChainTransport {
  nonce = 100n;
  balance = 100_000_000n; // 100 STX
  tip = 500n;
  feeEstimate = 10_000n;
  paused = false;
  claimFeeCap = 2_000_000n;
  drops = new Map<string, FakeDrop>();
  knownTxids = new Set<string>();
  txStatuses = new Map<string, TxStatus>();
  broadcasts: Array<{ txid: string; txHex: string }> = [];
  /** Optional per-broadcast override; return null for default accept. */
  broadcastHook: ((txid: string, txHex: string) => BroadcastResult | 'throw' | null) | null = null;
  nonceCalls = 0;

  async getAccountNonce(): Promise<bigint> {
    this.nonceCalls += 1;
    return this.nonce;
  }
  async getBalance(): Promise<bigint> {
    return this.balance;
  }
  async getTipHeight(): Promise<bigint> {
    return this.tip;
  }
  async estimateFeeUstx(): Promise<bigint> {
    return this.feeEstimate;
  }

  async callReadOnly(_contractId: string, fn: string, argsHex: string[]): Promise<ClarityValue | null> {
    const arg = (i: number) => hexToCV(argsHex[i]!) as { value?: unknown };
    if (fn === 'is-paused') return Cl.ok(Cl.bool(this.paused));
    if (fn === 'get-claim-fee-cap') return Cl.ok(Cl.uint(this.claimFeeCap));
    const drop = this.drops.get(String(arg(0).value));
    if (fn === 'get-drop') {
      if (!drop) return Cl.none();
      return Cl.some(
        Cl.tuple({
          status: Cl.uint(drop.status),
          mode: Cl.uint(drop.mode),
          eligibility: Cl.uint(drop.eligibility),
          'start-block': Cl.uint(drop.startBlock),
          'end-block': Cl.uint(drop.endBlock),
          'fee-budget-remaining': Cl.uint(drop.budgetRemaining),
          'per-wallet-limit': Cl.uint(drop.perWalletLimit),
          'fees-settled': Cl.uint(drop.feesSettled),
          'claimed-count': Cl.uint(drop.claimedCount),
          collection: Cl.contractPrincipal(DEPLOYER, 'xtrata-collection-v3')
        })
      );
    }
    if (!drop) return Cl.none();
    if (fn === 'get-remaining') return Cl.ok(Cl.uint(drop.remaining));
    if (fn === 'get-wallet-claims') {
      const claimer = principalString(hexToCV(argsHex[1]!));
      return Cl.ok(Cl.uint(drop.walletClaims.get(claimer) ?? 0n));
    }
    if (fn === 'get-claim-reservation') {
      const claimer = principalString(hexToCV(argsHex[1]!));
      return drop.reservations.has(claimer)
        ? Cl.some(Cl.tuple({ index: Cl.uint(0), 'reserved-at': Cl.uint(1) }))
        : Cl.none();
    }
    return null;
  }

  async broadcast(txHex: string, expectedTxid: string): Promise<BroadcastResult> {
    if (this.broadcastHook) {
      const hooked = this.broadcastHook(expectedTxid, txHex);
      if (hooked === 'throw') throw new Error('transport lost');
      if (hooked) return hooked;
    }
    this.broadcasts.push({ txid: expectedTxid, txHex });
    this.knownTxids.add(expectedTxid);
    if (!this.txStatuses.has(expectedTxid)) this.txStatuses.set(expectedTxid, 'pending');
    return { ok: true, txid: expectedTxid };
  }

  async isTxKnown(txid: string): Promise<boolean> {
    return this.knownTxids.has(txid);
  }

  async getTxStatus(txid: string): Promise<TxStatus> {
    return this.txStatuses.get(txid) ?? 'not_found';
  }
}

const principalString = (cv: ClarityValue): string => {
  const v = cv as { value?: unknown };
  return typeof v.value === 'string' ? v.value : String(v.value);
};
