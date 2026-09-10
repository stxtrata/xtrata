// Reading the games that came before.
//
// Three contracts are deployed and immutable under
// SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X. They are Clarity 3, they store a
// `mv` where this one stores a `value`, they have no sponsorship, no ranked
// flag and no result hints, and they were played under a protocol in which no
// string meant anything but a move.
//
// All of that has to be preserved exactly. A legacy game replayed under
// today's assumptions would be a DIFFERENT GAME, and the people who played it
// are not available to be asked about it.

import { deserialize, serializeUint } from './clarity.js';
import type { ClarityJs } from './clarity.js';
import { bytesToHex } from '../protocol/sha256.js';
import { makeEndpoint } from './endpoint.js';
import type { Endpoint, EndpointOptions } from './endpoint.js';
import { EVENTS_NONE, REPLAY_PROTOCOL } from '../protocol/versions.js';
import { DEFAULT_RULES } from '../protocol/rules.js';
import type { Rules } from '../protocol/rules.js';
import type { EntryRow, GameRow } from './client.js';

export const LEGACY_DEPLOYER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';

/** Newest first. A reader walks these and labels what it finds. */
export const LEGACY_CONTRACTS = [
  { name: 'xtrata-chess-log-v3', label: 'Legacy X Chess v3' },
  { name: 'xtrata-chess-log-v2', label: 'Legacy X Chess v2' },
  { name: 'xtrata-chess-log-v1', label: 'Legacy X Chess v1' }
] as const;

export type LegacyContractName = (typeof LEGACY_CONTRACTS)[number]['name'];

/**
 * The protocol a legacy game was played under.
 *
 * `events-none` is the load-bearing part. Those games predate control strings
 * entirely, so `resgn` in one of them was a submission replay skipped as
 * malformed, and it must stay one. Applying events-v1 would end a game that its
 * players went on to finish, and change a result that is already the record.
 *
 * Legacy games are also unrated, permanently. Their participants never agreed
 * to ranked play, and assigning consequences to people who did not consent is
 * not something a later version gets to do.
 */
export function legacyRules(over: Partial<Rules> = {}): Rules {
  return {
    ...DEFAULT_RULES,
    replayProtocol: REPLAY_PROTOCOL,
    eventsProtocol: EVENTS_NONE,
    ranked: false,
    ...over
  };
}

export interface LegacyGame extends GameRow {
  contract: string;
  label: string;
}

/**
 * A reader for one legacy contract.
 *
 * Deliberately read-only. Nothing here writes: those games are finished or they
 * are not, and either way this build is not the thing that should be adding to
 * them.
 */
export class LegacyReader {
  readonly contractAddress: string;
  readonly contractName: LegacyContractName;
  readonly label: string;
  private readonly endpoint: Endpoint;

  constructor(
    contractName: LegacyContractName,
    options: EndpointOptions & { contractAddress?: string } = {}
  ) {
    this.contractAddress = options.contractAddress ?? LEGACY_DEPLOYER;
    this.contractName = contractName;
    this.label =
      LEGACY_CONTRACTS.find((c) => c.name === contractName)?.label ?? 'Legacy X Chess';
    this.endpoint = makeEndpoint(options);
  }

  get contractId(): string {
    return `${this.contractAddress}.${this.contractName}`;
  }

  private async callReadOnly(functionName: string, args: string[] = []): Promise<ClarityJs> {
    const path = `/v2/contracts/call-read/${this.contractAddress}/${this.contractName}/${functionName}`;
    const response = await this.endpoint.request(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender: 'SP000000000000000000002Q6VF78', arguments: args })
    });
    if (!response.ok) throw new Error(`${functionName}: HTTP ${response.status}`);
    const body = (await response.json()) as { okay?: boolean; result?: string; cause?: string };
    if (!body.okay || typeof body.result !== 'string') {
      throw new Error(`${functionName}: ${body.cause ?? 'read failed'}`);
    }
    return deserialize(body.result);
  }

  async getGameCount(): Promise<number> {
    return Number(await this.callReadOnly('get-game-count'));
  }

  async getGame(game: number): Promise<LegacyGame | null> {
    const row = await this.callReadOnly('get-game', [serializeUint(game)]);
    if (!row || typeof row !== 'object' || Array.isArray(row)) return null;
    const r = row as Record<string, ClarityJs>;
    const hash = r['rules-hash'];
    return {
      id: game,
      openedBy: String(r['opened-by']),
      openedAt: Number(r['opened-at']),
      nextSeq: Number(r['next-seq']),
      rulesHash: hash instanceof Uint8Array ? bytesToHex(hash) : null,
      // No legacy contract has a ranked flag, and none of those games is rated.
      ranked: false,
      contract: this.contractId,
      label: this.label
    };
  }

  /**
   * One entry.
   *
   * The legacy field is `mv`; this build calls it `value`, because the contract
   * stores a string and does not know that some of them are moves. Mapping the
   * name here rather than everywhere is the whole job of an adapter.
   */
  async getEntry(game: number, seq: number): Promise<EntryRow | null> {
    const row = await this.callReadOnly('get-move', [serializeUint(game), serializeUint(seq)]);
    if (!row || typeof row !== 'object' || Array.isArray(row)) return null;
    const r = row as Record<string, ClarityJs>;
    return {
      seq,
      value: String(r.mv),
      sender: String(r.sender),
      height: Number(r.height)
    };
  }

  async getAllEntries(game: number): Promise<EntryRow[]> {
    const out: EntryRow[] = [];
    let start = 0;
    for (;;) {
      const page = (await this.callReadOnly('get-page', [
        serializeUint(game),
        serializeUint(start)
      ])) as ClarityJs[];
      const found: EntryRow[] = [];
      page.forEach((row, index) => {
        if (!row || typeof row !== 'object' || Array.isArray(row)) return;
        const r = row as Record<string, ClarityJs>;
        found.push({
          seq: start + index,
          value: String(r.mv),
          sender: String(r.sender),
          height: Number(r.height)
        });
      });
      out.push(...found);
      if (found.length < 50) break;
      start += 50;
    }
    return out;
  }
}
