// The chain, as the rest of the application sees it.
//
// One interface, three implementations: the live contract, an in-memory mock,
// and a sealed game that carries its own log and touches no network. The
// application is written against the interface and never against any of them,
// which is what lets the whole board be driven deterministically in tests and
// what lets a sealed game work with no node at all.
//
// Reads are separated from writes on purpose. Watching a game costs nothing and
// needs no wallet, and a great deal of what this application does - the
// explorer, the leaderboard, every profile, verifying somebody else's game - is
// read-only. A reader that demanded a wallet would make all of that impossible
// for a visitor who has not connected one.

import {
  deserialize,
  serializeBool,
  serializeBuffer,
  serializeNone,
  serializePrincipal,
  serializeSome,
  serializeStringAscii,
  serializeUint
} from './clarity.js';
import type { ClarityJs } from './clarity.js';
import { bytesToHex } from '../protocol/sha256.js';
import { makeEndpoint } from './endpoint.js';
import { REBATE_CEILING } from '../wallet/postconditions.js';
import type { Endpoint, EndpointOptions, Network } from './endpoint.js';

export const PAGE_SIZE = 50;

/** Any principal works as the read-only caller; nothing here reads tx-sender. */
const READ_SENDER = 'SP000000000000000000002Q6VF78';

export interface GameRow {
  id: number;
  openedBy: string;
  openedAt: number;
  nextSeq: number;
  /** Lower-case hex with no prefix, or null for a game that committed to nothing. */
  rulesHash: string | null;
  /** A DISCOVERY HINT. The truth is inside the rules that hash to rulesHash. */
  ranked: boolean;
}

export interface EntryRow {
  seq: number;
  /** Exactly the string that was stored. Not interpreted here. */
  value: string;
  sender: string;
  height: number;
}

export interface SponsorshipRow {
  rebatesLeft: bigint;
  rebate: bigint;
  reserved: bigint;
  expiry: number;
  settled: boolean;
  fundedBy: string;
}

export interface SponsorPrice {
  bootstrap: bigint;
  liability: bigint;
  margin: bigint;
  total: bigint;
}

/**
 * A submission that has been broadcast but is not in a block yet.
 *
 * A board that ignores the mempool makes everybody stare at nothing between
 * clicking and confirming, and makes them race: two people see the same
 * position, both move, and one pays for a submission that will be skipped.
 * Reading it costs nothing and needs no wallet, and it is what lets the OTHER
 * player see a move coming.
 */
export interface PendingRow {
  txid: string;
  sender: string;
  value: string;
  /** Milliseconds since the epoch, or null if the node did not say. */
  receivedAt: number | null;
  fee: number | null;
}

export interface ResultHintRow {
  result: string;
  terminalSeq: number;
  claimant: string;
  height: number;
}

/**
 * Everything the application can learn from the chain without a wallet.
 *
 * Deliberately absent: anything chess-shaped. There is no getPosition and no
 * getWinner, because the chain does not have them. They are replay's answers.
 */
export interface ChainReader {
  readonly contractId: string;
  getFormatVersion(): Promise<number>;
  getGameCount(): Promise<number>;
  getGame(game: number): Promise<GameRow | null>;
  getEntry(game: number, seq: number): Promise<EntryRow | null>;
  getPage(game: number, start: number): Promise<(EntryRow | null)[]>;
  /**
   * The whole log for a game.
   *
   * `knownNextSeq` is a HINT, not a promise: a caller that has just read the
   * game row already knows how many entries exist, and a reader with a cache can
   * use that to skip the chain entirely. Every implementation is free to ignore
   * it, and the plain ones do.
   */
  getAllEntries(game: number, knownNextSeq?: number): Promise<EntryRow[]>;
  getOpenFee(): Promise<bigint>;
  getSponsorPrice(): Promise<SponsorPrice>;
  getSponsorship(game: number, who: string): Promise<SponsorshipRow | null>;
  getRankedCount(): Promise<number>;
  getRankedGame(index: number): Promise<number | null>;
  getResultHint(game: number): Promise<ResultHintRow | null>;
  getTotalReserved(): Promise<bigint>;
  isSolvent(): Promise<boolean>;
  getWithdrawable(): Promise<bigint>;
  getHeight(): Promise<number>;
  /** Broadcast but unconfirmed submissions for a game. Never throws. */
  getPending(game: number): Promise<PendingRow[]>;
}

export interface WriteResult {
  ok: true;
  txid: string | null;
  provider?: string;
  raw?: unknown;
}

/**
 * A call the wallet layer will actually sign.
 *
 * The chain layer builds these and knows nothing about how they get signed;
 * the wallet layer signs them and knows nothing about what they mean. `fee` is
 * what the CONTRACT will move, not the network fee, and it is what the post
 * condition has to be written against.
 */
export interface ContractCall {
  functionName: string;
  functionArgs: string[];
  /** MicroSTX the contract will take from the sender. Zero for most calls. */
  sends: bigint;
  /**
   * MicroSTX the CONTRACT will pay out, to ANYBODY.
   *
   * Not "to the sender". That was the original mistake and it cost a real
   * transaction: `open-sponsored-game` pays the bootstrap to the OPPONENT, so a
   * condition written only about what the sender receives left the contract's
   * own transfer uncovered, and deny mode aborted a call the contract had
   * already completed successfully. The chain reported `(ok u3)` and threw it
   * away.
   *
   * A STX post condition caps what a named principal SENDS and says nothing
   * about who receives it, so one condition about the contract covers every
   * payout it makes in the call - whoever they go to.
   */
  contractSends: bigint;
}

export type Signer = (call: ContractCall) => Promise<WriteResult>;

export interface ChainWriter {
  openGame(rulesHash: string | null, ranked: boolean): Promise<WriteResult>;
  openSponsoredGame(rulesHash: string | null, ranked: boolean, opponent: string): Promise<WriteResult>;
  openSponsoredBoth(
    rulesHash: string | null,
    ranked: boolean,
    white: string,
    black: string
  ): Promise<WriteResult>;
  /**
   * Submit a value to a game.
   *
   * `expectRebate` is a HINT and only ever a negative one: false means the
   * caller knows the contract cannot pay this player, so the transaction can
   * declare that no money moves. Absent means unknown, and unknown covers the
   * rebate ceiling. See the comment in LiveChain.submit for what that costs.
   */
  submit(game: number, value: string, opts?: { expectRebate?: boolean }): Promise<WriteResult>;
  topUpSponsorship(game: number, who: string): Promise<WriteResult>;
  settleSponsorship(game: number, who: string): Promise<WriteResult>;
  claimResult(game: number, result: string, terminalSeq: number): Promise<WriteResult>;
}

export type Chain = ChainReader & ChainWriter;

// ---------------------------------------------------------------------------
// Decoding helpers
// ---------------------------------------------------------------------------

const num = (value: ClarityJs): number => Number(value as bigint);
const big = (value: ClarityJs): bigint => BigInt(value as bigint);

function toGame(id: number, row: ClarityJs): GameRow | null {
  if (!row || typeof row !== 'object' || Array.isArray(row)) return null;
  const r = row as Record<string, ClarityJs>;
  const hash = r['rules-hash'];
  return {
    id,
    openedBy: String(r['opened-by']),
    openedAt: num(r['opened-at']),
    nextSeq: num(r['next-seq']),
    rulesHash: hash instanceof Uint8Array ? bytesToHex(hash) : null,
    ranked: r.ranked === true
  };
}

function toEntry(seq: number, row: ClarityJs): EntryRow | null {
  if (!row || typeof row !== 'object' || Array.isArray(row)) return null;
  const r = row as Record<string, ClarityJs>;
  return {
    seq,
    value: String(r.value),
    sender: String(r.sender),
    height: num(r.height)
  };
}

// ---------------------------------------------------------------------------
// The live contract
// ---------------------------------------------------------------------------

export interface LiveChainOptions extends EndpointOptions {
  contractAddress: string;
  contractName: string;
  network?: Network;
  /** Supplied by the wallet layer. Without one, this is a reader. */
  signer?: Signer;
}

export class LiveChain implements ChainReader, Partial<ChainWriter> {
  readonly contractAddress: string;
  readonly contractName: string;
  readonly network: Network;
  private readonly endpoint: Endpoint;
  private readonly signer: Signer | null;
  /** Read once and remembered. The fee does not change mid-session. */
  private openFee: bigint | undefined;
  private price: SponsorPrice | undefined;

  constructor(options: LiveChainOptions) {
    if (!options.contractAddress) throw new Error('contractAddress is required');
    if (!options.contractName) throw new Error('contractName is required');
    this.contractAddress = options.contractAddress;
    this.contractName = options.contractName;
    this.network = options.network ?? 'mainnet';
    this.endpoint = makeEndpoint(options);
    this.signer = options.signer ?? null;
  }

  get contractId(): string {
    return `${this.contractAddress}.${this.contractName}`;
  }

  get apiBase(): string {
    return this.endpoint.base;
  }

  /**
   * The endpoint this chain is using.
   *
   * Exposed so that the name resolver and the block-time resolver talk to the
   * same node, with the same fallback behaviour, rather than each opening their
   * own idea of where the chain is.
   */
  get reader(): Endpoint {
    return this.endpoint;
  }

  async callReadOnly(functionName: string, args: string[] = []): Promise<ClarityJs> {
    const path = `/v2/contracts/call-read/${this.contractAddress}/${this.contractName}/${functionName}`;
    const response = await this.endpoint.request(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender: READ_SENDER, arguments: args })
    });

    if (!response.ok) {
      // Not a transport problem: the endpoint answered. Say which it was, so a
      // caller can tell "no such contract" from "the network is down".
      const error = new Error(`${functionName}: HTTP ${response.status}`);
      (error as Error & { code?: string; status?: number }).code = 'CHAIN_REFUSED';
      (error as Error & { status?: number }).status = response.status;
      throw error;
    }

    const body = (await response.json()) as { okay?: boolean; result?: string; cause?: string };
    if (!body.okay || typeof body.result !== 'string') {
      throw new Error(`${functionName}: ${body.cause ?? 'read failed'}`);
    }
    return deserialize(body.result);
  }

  async getFormatVersion(): Promise<number> {
    return num(await this.callReadOnly('get-format-version'));
  }

  async getGameCount(): Promise<number> {
    return num(await this.callReadOnly('get-game-count'));
  }

  async getGame(game: number): Promise<GameRow | null> {
    return toGame(game, await this.callReadOnly('get-game', [serializeUint(game)]));
  }

  async getEntry(game: number, seq: number): Promise<EntryRow | null> {
    return toEntry(seq, await this.callReadOnly('get-entry', [serializeUint(game), serializeUint(seq)]));
  }

  async getPage(game: number, start: number): Promise<(EntryRow | null)[]> {
    const page = (await this.callReadOnly('get-page', [
      serializeUint(game),
      serializeUint(start)
    ])) as ClarityJs[];
    return page.map((row, index) => toEntry(start + index, row));
  }

  async getAllEntries(game: number): Promise<EntryRow[]> {
    const out: EntryRow[] = [];
    let start = 0;
    for (;;) {
      const page = await this.getPage(game, start);
      const found = page.filter((entry): entry is EntryRow => entry !== null);
      out.push(...found);
      if (found.length < PAGE_SIZE) break;
      start += PAGE_SIZE;
    }
    return out;
  }

  async getOpenFee(): Promise<bigint> {
    if (this.openFee === undefined) this.openFee = big(await this.callReadOnly('get-open-fee'));
    return this.openFee;
  }

  async getSponsorPrice(): Promise<SponsorPrice> {
    if (!this.price) {
      const row = (await this.callReadOnly('get-sponsor-price')) as Record<string, ClarityJs>;
      this.price = {
        bootstrap: big(row.bootstrap),
        liability: big(row.liability),
        margin: big(row.margin),
        total: big(row.total)
      };
    }
    return this.price;
  }

  async getSponsorship(game: number, who: string): Promise<SponsorshipRow | null> {
    const row = await this.callReadOnly('get-sponsorship', [
      serializeUint(game),
      serializePrincipal(who)
    ]);
    if (!row || typeof row !== 'object' || Array.isArray(row)) return null;
    const r = row as Record<string, ClarityJs>;
    return {
      rebatesLeft: big(r['rebates-left']),
      rebate: big(r.rebate),
      reserved: big(r.reserved),
      expiry: num(r.expiry),
      settled: r.settled === true,
      fundedBy: String(r['funded-by'])
    };
  }

  async getRankedCount(): Promise<number> {
    return num(await this.callReadOnly('get-ranked-count'));
  }

  async getRankedGame(index: number): Promise<number | null> {
    const value = await this.callReadOnly('get-ranked-game', [serializeUint(index)]);
    return value === null ? null : num(value);
  }

  async getResultHint(game: number): Promise<ResultHintRow | null> {
    const row = await this.callReadOnly('get-result-hint', [serializeUint(game)]);
    if (!row || typeof row !== 'object' || Array.isArray(row)) return null;
    const r = row as Record<string, ClarityJs>;
    return {
      result: String(r.result),
      terminalSeq: num(r['terminal-seq']),
      claimant: String(r.claimant),
      height: num(r.height)
    };
  }

  async getTotalReserved(): Promise<bigint> {
    return big(await this.callReadOnly('get-total-reserved'));
  }

  /**
   * Submissions in the mempool for this game.
   *
   * Arguments come back as hex, which the local codec decodes, so a pending
   * move is read exactly the same way as one that has landed.
   *
   * Never throws. The mempool is a convenience: a board that broke because a
   * node would not answer this would be worse than one showing nothing pending.
   */
  async getPending(game: number): Promise<PendingRow[]> {
    try {
      const response = await this.endpoint.request(
        `/extended/v1/address/${this.contractId}/mempool?limit=50`
      );
      if (!response.ok) return [];
      const body = (await response.json()) as { results?: unknown[] };

      const out: PendingRow[] = [];
      for (const raw of body.results ?? []) {
        const tx = raw as {
          tx_type?: string;
          tx_id?: string;
          sender_address?: string;
          receipt_time?: number;
          fee_rate?: string | number;
          contract_call?: {
            contract_id?: string;
            function_name?: string;
            function_args?: { hex?: string }[];
          };
        };
        const call = tx.contract_call;
        if (tx.tx_type !== 'contract_call' || !call) continue;
        if (call.contract_id !== this.contractId) continue;
        if (call.function_name !== 'submit') continue;

        const args = call.function_args ?? [];
        if (args.length < 2) continue;

        try {
          if (Number(deserialize(String(args[0].hex))) !== Number(game)) continue;
          out.push({
            txid: String(tx.tx_id ?? ''),
            sender: String(tx.sender_address ?? ''),
            value: String(deserialize(String(args[1].hex))),
            receivedAt: tx.receipt_time ? tx.receipt_time * 1000 : null,
            fee: Number(tx.fee_rate) || null
          });
        } catch {
          // A malformed argument is somebody else's problem. Skipping it beats
          // letting one bad entry hide every other pending move.
        }
      }

      // Oldest first, roughly the order they will land in.
      return out.sort((a, b) => (a.receivedAt ?? 0) - (b.receivedAt ?? 0));
    } catch {
      return [];
    }
  }

  async isSolvent(): Promise<boolean> {
    return (await this.callReadOnly('is-solvent')) === true;
  }

  /**
   * What the owner may take without touching a reserve.
   *
   * Asked of the CONTRACT rather than worked out here from the balance and the
   * reserve. The subtraction looks obvious and would be a second implementation
   * of the solvency rule, which is exactly the kind of copy that drifts - and
   * this is the one number where drifting means paying a sponsorship out from
   * under somebody who has already bought it.
   */
  async getWithdrawable(): Promise<bigint> {
    return big(await this.callReadOnly('get-withdrawable'));
  }

  /**
   * The Stacks chain tip.
   *
   * Read from the node rather than from a contract, because it is the one thing
   * here that is about the CHAIN rather than about this application. An expiry
   * is a block number and means nothing without it.
   */
  async getHeight(): Promise<number> {
    const response = await this.endpoint.request('/v2/info');
    if (!response.ok) throw new Error(`could not read the chain tip: ${response.status}`);
    const body = (await response.json()) as { stacks_tip_height?: number };
    return Number(body.stacks_tip_height ?? 0);
  }

  // ---- writes ----------------------------------------------------------

  private async sign(call: ContractCall): Promise<WriteResult> {
    if (!this.signer) {
      const error = new Error('this board is reading only: connect a wallet to play');
      (error as Error & { code?: string }).code = 'NO_SIGNER';
      throw error;
    }
    return this.signer(call);
  }

  private rulesArg(rulesHash: string | null): string {
    return rulesHash ? serializeSome(serializeBuffer(rulesHash)) : serializeNone();
  }

  async openGame(rulesHash: string | null, ranked: boolean): Promise<WriteResult> {
    return this.sign({
      functionName: 'open-game',
      functionArgs: [this.rulesArg(rulesHash), serializeBool(ranked)],
      sends: await this.getOpenFee(),
      // The contract pays nobody on a standard open.
      contractSends: 0n
    });
  }

  async openSponsoredGame(
    rulesHash: string | null,
    ranked: boolean,
    opponent: string
  ): Promise<WriteResult> {
    const [fee, price] = await Promise.all([this.getOpenFee(), this.getSponsorPrice()]);
    return this.sign({
      functionName: 'open-sponsored-game',
      functionArgs: [this.rulesArg(rulesHash), serializeBool(ranked), serializePrincipal(opponent)],
      sends: fee + price.total,
      // The bootstrap goes OUT of the contract, to the opponent, in this same
      // transaction. Leaving this at zero is what aborted the first real
      // sponsored open on mainnet.
      contractSends: price.bootstrap
    });
  }

  async openSponsoredBoth(
    rulesHash: string | null,
    ranked: boolean,
    white: string,
    black: string
  ): Promise<WriteResult> {
    const [fee, price] = await Promise.all([this.getOpenFee(), this.getSponsorPrice()]);
    return this.sign({
      functionName: 'open-sponsored-both',
      functionArgs: [
        this.rulesArg(rulesHash),
        serializeBool(ranked),
        serializePrincipal(white),
        serializePrincipal(black)
      ],
      sends: fee + price.total * 2n,
      // Two bootstraps, to two different people.
      contractSends: price.bootstrap * 2n
    });
  }

  /**
   * Submit a string.
   *
   * `receives` is what makes this different from every call the legacy board
   * made. Under a deny-mode post condition EVERY transfer must be covered,
   * including one the CONTRACT makes, so a sponsored player's rebate needs a
   * condition of its own or the transaction aborts. See the wallet layer.
   */
  async submit(
    game: number,
    value: string,
    { expectRebate }: { expectRebate?: boolean } = {}
  ): Promise<WriteResult> {
    return this.sign({
      functionName: 'submit',
      functionArgs: [serializeUint(game), serializeStringAscii(value)],
      sends: 0n,
      // NOTHING, unless somebody is actually being paid.
      //
      // A move costs a network fee and not one microSTX more; the contract
      // charges nothing for it. But a post condition covering the rebate made
      // the wallet say "the contract will transfer less than or equal to 0.1
      // STX" on every single move, and a player reading that reasonably fears a
      // charge. It is a ceiling on money moving TOWARDS them and can never take
      // anything from them - and being right about that is no use if the
      // sentence in front of the person says otherwise.
      //
      // Sound because the contract says so: maybe-rebate matches on a
      // Sponsorships entry for (game, sender) and pays nothing at all without
      // one (clar:490). No row, no transfer, so nothing to cover. With zero
      // conditions in deny mode the transaction asserts that NO money moves,
      // which is both the truth and the strongest thing it could say.
      //
      // THE COST, which is real and has been paid before. The board knows the
      // sponsorship of the account named at CONNECT time and cannot know which
      // account the wallet will sign with. If the signer turns out to be
      // sponsored while the board believed otherwise, maybe-rebate pays them,
      // the transfer is uncovered, and the transaction is discarded after the
      // contract has done the work - the player pays the fee and the move does
      // not count. That is ADR-0008's shape and it cost 0.1 STX on mainnet.
      //
      // So the ceiling is still sent whenever a rebate is POSSIBLE, and the
      // hint is only ever a way to say "this one certainly is not". Absent, it
      // means unknown, and unknown keeps the ceiling.
      contractSends: expectRebate === false ? 0n : REBATE_CEILING
    });
  }

  async topUpSponsorship(game: number, who: string): Promise<WriteResult> {
    const price = await this.getSponsorPrice();
    return this.sign({
      functionName: 'top-up-sponsorship',
      functionArgs: [serializeUint(game), serializePrincipal(who)],
      sends: price.liability + price.margin,
      // A top-up does not repay the bootstrap; the wallet already has it.
      contractSends: 0n
    });
  }

  async settleSponsorship(game: number, who: string): Promise<WriteResult> {
    return this.sign({
      functionName: 'settle-sponsorship',
      functionArgs: [serializeUint(game), serializePrincipal(who)],
      sends: 0n,
      // Settlement moves no money at all: it releases a reservation.
      contractSends: 0n
    });
  }

  // ---- owner ------------------------------------------------------------
  //
  // Used by the gates canary and by nothing else in the application. A board a
  // player opens has no reason to be able to call these.

  async setSponsorship(
    bootstrap: bigint,
    rebate: bigint,
    count: bigint,
    margin: bigint
  ): Promise<WriteResult> {
    return this.sign({
      functionName: 'set-sponsorship',
      functionArgs: [
        serializeUint(bootstrap),
        serializeUint(rebate),
        serializeUint(count),
        serializeUint(margin)
      ],
      sends: 0n,
      contractSends: 0n
    });
  }

  async setOpenFee(amount: bigint): Promise<WriteResult> {
    return this.sign({
      functionName: 'set-open-fee',
      functionArgs: [serializeUint(amount)],
      sends: 0n,
      contractSends: 0n
    });
  }

  /**
   * Withdraw from the treasury.
   *
   * The contract is the one sending, and possibly to somebody other than the
   * caller. Without a condition covering it, a deny-mode withdrawal aborts on
   * its own transfer.
   */
  async withdraw(amount: bigint, to: string): Promise<WriteResult> {
    return this.sign({
      functionName: 'withdraw',
      functionArgs: [serializeUint(amount), serializePrincipal(to)],
      sends: 0n,
      contractSends: amount
    });
  }

  async claimResult(game: number, result: string, terminalSeq: number): Promise<WriteResult> {
    return this.sign({
      functionName: 'claim-result',
      functionArgs: [
        serializeUint(game),
        serializeStringAscii(result),
        serializeUint(terminalSeq)
      ],
      sends: 0n,
      contractSends: 0n
    });
  }
}

export function describeContractError(code: number | bigint): string {
  switch (Number(code)) {
    case 100:
      return 'that game does not exist';
    case 101:
      return 'a submission must be four or five characters';
    case 102:
      return 'this game has reached its log limit';
    case 103:
      return 'only the owner can do that';
    case 104:
      return 'that is above the ceiling written into the contract';
    case 106:
      return 'there is no sponsorship for that player on that game';
    case 107:
      return 'that player is already sponsored on that game';
    case 108:
      return 'this sponsorship has not expired yet';
    case 109:
      return 'this sponsorship has already been settled';
    case 110:
      return 'that would take money the contract owes to a game';
    case 111:
      return 'a game needs two different players';
    case 113:
      return 'the contract tried to move more than it was allowed to';
    case 114:
      return 'a result has already been claimed for this game';
    default:
      return `contract error ${code}`;
  }
}
