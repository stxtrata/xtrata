// The live counterpart to MockChain: same methods, real chain underneath.
//
// Reads go straight to a Stacks node's read-only endpoint and are decoded with
// the local Clarity codec, so watching a board costs nothing and needs no
// wallet. Writes go through whichever wallet the browser has injected.
//
// The call shape below is the one this repo's wallet canary proved across
// Xverse and Leather on both desktop and mobile: a single combined
// stx_callContract with `contract`, `functionName`, and the arguments under
// both `functionArgs` and `arguments`. Leading with any other shape made one
// wallet or another hang without ever settling the promise.

import {
  bytesToHex,
  deserialize,
  serializeBuffer,
  serializeNone,
  serializeSome,
  serializeStringAscii,
  serializeUint
} from './clarity.js';
import { walletCall, waitForProvider, feePostConditions, callFeeParams } from './wallet.js';
import { CONTRACT_NAME, ERR, PAGE_SIZE } from './protocol.js';

import { PUBLIC_API, makeResilientFetch, preferredApiBase } from './api-base.js';

// Kept for callers that want the public host by name. What this board actually
// uses is chosen at runtime; see src/api-base.js.
export const DEFAULT_API = PUBLIC_API;

// Any principal works as the read-only caller; nothing here reads tx-sender.
const READ_SENDER = 'SP000000000000000000002Q6VF78';

// Fee for a move, in microSTX.
//
// Wallets left to themselves suggest around 0.5 STX for a contract call, which
// is roughly fifty times what this one is worth: submit-move uses 9,150 runtime
// units of a 5,000,000,000 block budget and writes a few hundred bytes. Paying
// a wallet's default here would make the fee the dominant cost of playing chess
// and would price the open board out of being casual.
//
// 0.01 STX has confirmed on mainnet for this contract. It is passed explicitly
// so the wallet shows it rather than guessing.
export const DEFAULT_FEE_USTX = 10_000;

export class LiveChain {
  constructor(options = {}) {
    this.contractAddress = options.contractAddress;
    this.contractName = options.contractName || CONTRACT_NAME;
    this.network = options.network || 'mainnet';
    // Under the Xtrata runtime this is the site's caching proxy, and off it the
    // public host. Overridable, and it falls back on its own if the proxy stops
    // answering, because an inscription cannot be corrected.
    this.apiUrl = options.apiUrl || preferredApiBase(this.network);
    this.api = makeResilientFetch({
      network: this.network,
      base: options.apiUrl,
      fetch: options.fetch,
      onFallback: (from, to) => {
        this.apiUrl = to;
        if (options.onLog) options.onLog('warn', `${from} did not answer; using ${to}`);
      }
    });
    this.fetch = options.fetch || globalThis.fetch?.bind(globalThis);
    this.fee = Number.isFinite(Number(options.fee)) ? Number(options.fee) : DEFAULT_FEE_USTX;
    // The address that will sign, needed to write a post condition about it.
    this.senderAddress = options.senderAddress || null;
    // Which post condition spelling to send; 'strict' permits exactly the fee.
    this.pcShape = options.pcShape || 'strict';
    // The contract's own charge, read once and remembered. undefined means not
    // asked yet; 0 means asked and it charges nothing, which is v1.
    this.contractFee = undefined;
    this.openFee = undefined;

    if (!this.contractAddress) throw new Error('contractAddress is required');
  }

  get contractId() {
    return `${this.contractAddress}.${this.contractName}`;
  }

  // ---- reads ---------------------------------------------------------

  async callReadOnly(functionName, args = []) {
    const path = `/v2/contracts/call-read/${this.contractAddress}/${this.contractName}/${functionName}`;
    const response = await this.api.request(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender: READ_SENDER, arguments: args })
    });

    if (!response.ok) {
      throw new Error(`${functionName}: HTTP ${response.status}`);
    }

    const body = await response.json();
    if (!body.okay) {
      throw new Error(`${functionName}: ${body.cause || 'read failed'}`);
    }
    return deserialize(body.result);
  }

  async getFormatVersion() {
    return Number(await this.callReadOnly('get-format-version'));
  }

  async getGameCount() {
    return Number(await this.callReadOnly('get-game-count'));
  }

  async getGame(game) {
    const entry = await this.callReadOnly('get-game', [serializeUint(game)]);
    if (!entry) return null;
    const committed = entry['rules-hash'];
    return {
      openedBy: entry['opened-by'],
      openedAt: Number(entry['opened-at']),
      nextSeq: Number(entry['next-seq']),
      // A buffer when the game committed to a rule set, null for the open board.
      rulesHash: committed ? bytesToHex(committed) : null
    };
  }

  async getMove(game, seq) {
    const entry = await this.callReadOnly('get-move', [
      serializeUint(game),
      serializeUint(seq)
    ]);
    if (!entry) return null;
    return { mv: entry.mv, sender: entry.sender, height: Number(entry.height), seq };
  }

  async getPage(game, start) {
    const page = await this.callReadOnly('get-page', [
      serializeUint(game),
      serializeUint(start)
    ]);
    return page.map((entry, index) =>
      entry === null
        ? null
        : {
            mv: entry.mv,
            sender: entry.sender,
            height: Number(entry.height),
            seq: start + index
          }
    );
  }

  async getAllMoves(game) {
    const out = [];
    let start = 0;
    for (;;) {
      const page = await this.getPage(game, start);
      const found = page.filter((entry) => entry !== null);
      out.push(...found);
      if (found.length < PAGE_SIZE) break;
      start += PAGE_SIZE;
    }
    return out;
  }

  /**
   * Moves that have been broadcast but are not in a block yet.
   *
   * A chess board that ignores the mempool makes everybody race: two people see
   * the same position, both move, and one of them pays for a submission that
   * will be skipped. Reading it costs nothing and needs no wallet.
   *
   * Arguments come back as hex, which the local codec decodes, so the move is
   * read the same way here as it is when it lands.
   */
  async getMempool(game) {
    const response = await this.api.request(
      `/extended/v1/address/${this.contractId}/mempool?limit=50`
    );
    if (!response.ok) return [];

    const body = await response.json();
    const out = [];

    for (const tx of body.results || []) {
      const call = tx.contract_call;
      if (tx.tx_type !== 'contract_call' || !call) continue;
      if (call.contract_id !== this.contractId) continue;
      if (call.function_name !== 'submit-move') continue;

      const args = call.function_args || [];
      if (args.length < 2) continue;

      try {
        const forGame = Number(deserialize(args[0].hex));
        if (forGame !== Number(game)) continue;
        out.push({
          txid: tx.tx_id,
          sender: tx.sender_address,
          mv: String(deserialize(args[1].hex)),
          receivedAt: tx.receipt_time ? tx.receipt_time * 1000 : null,
          fee: Number(tx.fee_rate) || null
        });
      } catch {
        // A malformed argument is somebody else's problem; skip it rather than
        // letting one bad entry hide the rest.
      }
    }

    // Oldest first, which is roughly the order they will land in.
    return out.sort((a, b) => (a.receivedAt || 0) - (b.receivedAt || 0));
  }

  /**
   * What this contract charges to make a move, in microSTX.
   *
   * v1 has no such function, and a contract that does not answer is a contract
   * that does not charge, so the failure is cached as zero rather than retried
   * before every move.
   */
  async getContractFee() {
    if (this.contractFee !== undefined) return this.contractFee;
    try {
      this.contractFee = Number(await this.callReadOnly('get-move-fee')) || 0;
    } catch {
      this.contractFee = 0;
    }
    return this.contractFee;
  }

  /**
   * What this contract charges to open a game, in microSTX.
   *
   * v3 prices this separately, and by a lot: a hundred times a move, by
   * default. v1 and v2 have no such function, and for v2 the move fee is the
   * right answer for both calls, so a contract that cannot answer falls back to
   * whatever it charges for a move.
   */
  async getOpenFee() {
    if (this.openFee !== undefined) return this.openFee;
    try {
      const value = await this.callReadOnly('get-open-fee');
      this.openFee = Number(value) || 0;
    } catch {
      this.openFee = await this.getContractFee();
    }
    return this.openFee;
  }

  /**
   * The fee a given call will actually move.
   *
   * This is the whole reason the two are read separately. A post condition is a
   * cap, and one written for the wrong call is not a smaller cap, it is a
   * transaction that aborts — and an aborted transaction still costs its sender
   * the network fee. Opening a game on v3 under a move-fee cap would fail every
   * single time, for a thousandth of what it needed.
   */
  async feeFor(functionName) {
    return functionName === 'open-game' ? this.getOpenFee() : this.getContractFee();
  }

  // The board pairs this with a BlockTimes resolver rather than asking the
  // contract for timestamps, because the contract deliberately stores only the
  // height. See src/block-time.js.
  blockTimesSource() {
    return { apiUrl: this.apiUrl };
  }

  // ---- writes --------------------------------------------------------

  async _call(functionName, args) {
    // Resolved per call, never cached. Under the Xtrata runtime the wallet shim
    // installs itself after the page has already loaded, so a provider captured
    // at startup would be a provider that did not exist yet.
    // Waiting first: under the Xtrata runtime the shim installs after load, so a
    // provider looked up at startup would not exist yet.
    await waitForProvider();

    // A contract that charges must be allowed to charge. Denying every transfer
    // is right for a contract that moves nothing and fatal for one that does, so
    // ask the contract what it takes and permit exactly that.
    const contractFee = await this.feeFor(functionName);
    if (contractFee > 0 && !this.senderAddress) {
      const error = new Error('connect a wallet before moving: this contract charges a fee');
      error.code = 'NO_SENDER';
      throw error;
    }

    const guard = feePostConditions({
      sender: this.senderAddress,
      fee: contractFee,
      shape: this.pcShape
    });

    const params = {
      contract: this.contractId,
      functionName,
      functionArgs: args,
      // Some wallet builds read `arguments` rather than `functionArgs`. Sending
      // both is what the canary found to work everywhere.
      arguments: args,
      postConditionMode: guard.postConditionMode,
      postConditions: guard.postConditions,
      network: this.network,
      ...callFeeParams(this.fee)
    };

    const { result, entry } = await walletCall('stx_callContract', params);
    const txid = result?.txid || result?.result?.txid || result?.txId || result?.result?.txId;
    return { ok: true, txid, raw: result, provider: entry.label };
  }

  async openGame(rulesHash = null) {
    const argument = rulesHash
      ? serializeSome(serializeBuffer(rulesHash))
      : serializeNone();
    return this._call('open-game', [argument]);
  }

  async submitMove(game, mv) {
    return this._call('submit-move', [serializeUint(game), serializeStringAscii(mv)]);
  }
}

export function describeContractError(code) {
  switch (Number(code)) {
    case ERR.NO_GAME:
      return 'that game does not exist';
    case ERR.BAD_LENGTH:
      return 'a move must be four or five characters';
    case ERR.LOG_FULL:
      return 'this game has reached the log limit';
    default:
      return `contract error ${code}`;
  }
}
