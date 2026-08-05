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
import { walletCall, waitForProvider } from './wallet.js';
import { CONTRACT_NAME, ERR, PAGE_SIZE } from './protocol.js';

export const DEFAULT_API = {
  mainnet: 'https://api.mainnet.hiro.so',
  testnet: 'https://api.testnet.hiro.so'
};

// Any principal works as the read-only caller; nothing here reads tx-sender.
const READ_SENDER = 'SP000000000000000000002Q6VF78';

export class LiveChain {
  constructor(options = {}) {
    this.contractAddress = options.contractAddress;
    this.contractName = options.contractName || CONTRACT_NAME;
    this.network = options.network || 'mainnet';
    this.apiUrl = options.apiUrl || DEFAULT_API[this.network];
    this.fetch = options.fetch || globalThis.fetch?.bind(globalThis);

    if (!this.contractAddress) throw new Error('contractAddress is required');
  }

  get contractId() {
    return `${this.contractAddress}.${this.contractName}`;
  }

  // ---- reads ---------------------------------------------------------

  async callReadOnly(functionName, args = []) {
    const url = `${this.apiUrl}/v2/contracts/call-read/${this.contractAddress}/${this.contractName}/${functionName}`;
    const response = await this.fetch(url, {
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

    const params = {
      contract: this.contractId,
      functionName,
      functionArgs: args,
      // Some wallet builds read `arguments` rather than `functionArgs`. Sending
      // both is what the canary found to work everywhere.
      arguments: args,
      // This contract moves no tokens, so deny with an empty list is both
      // correct and the strictest thing we can ask for.
      postConditionMode: 'deny',
      postConditions: [],
      network: this.network
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
