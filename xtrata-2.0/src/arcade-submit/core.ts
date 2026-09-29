// Pure logic for the Astro Blaster 3 score submit page (no DOM, no wallet).
import { Cl, Pc, PostConditionMode, addressFromVersionHash, addressToString, createAddress, validateStacksAddress } from '@stacks/transactions';
import './ab3-engine.js';
import { ARCADE_BOARDS, ARCADE_GAME, isArcadeBoard } from './arcade-boards';

export const ARCADE_CONTRACT = {
  address: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
  name: 'xtrata-arcade-scores-v2'
} as const;
export const ARCADE_CONTRACT_ID = `${ARCADE_CONTRACT.address}.${ARCADE_CONTRACT.name}`;
export const ALLOWED_BOARDS = ['astro3', 'astro3-daily'] as const;
export { ARCADE_BOARDS, ARCADE_GAME, isArcadeBoard } from './arcade-boards';
const XAR_HEADER = 44, XAR_MAX_STEPS = 108000;
export const MAX_REPLAY_BYTES = 65536;
const NAME_RE = /^[A-Za-z0-9 _.-]{3,12}$/;

type Engine = {
  ENGINE_VERSION: number;
  MODE_DAILY: number;
  readHeader(bytes: Uint8Array): { engine: number; mode: number; period: number; frames: number; score: number; seed: number; pilot: Uint8Array; pilotVersion: number };
  verifyReplay(bytes: Uint8Array, opts?: { score?: number; period?: number | null; mode?: number; chunk?: number }): Promise<{ ok: boolean; score: number; frames: number; reason: string; header: { mode: number; period: number } }>;
  fromBase64Url(s: string): Uint8Array;
};
export const engine = (globalThis as unknown as { AB3: Engine }).AB3;

export type SubmitPayload = {
  /** 'ab3' = Astro Blaster 3 replay; 'xar' = Xtrata Arcade replay (any of the 26 arcade boards). */
  kind: 'ab3' | 'xar';
  board: string;
  period: number;
  claimedScore: number;
  name: string;
  replay: Uint8Array;
  /** Mainnet address of the wallet this run was flown for (read from the replay header). */
  pilot: string;
};

const toHex = (b: Uint8Array) => Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');

export const isXar = (b: Uint8Array) => b.length >= XAR_HEADER && b[0] === 88 && b[1] === 65 && b[2] === 82;
const pilotHex = (replay: Uint8Array) => (isXar(replay) ? toHex(replay.subarray(4, 24)) : toHex(engine.readHeader(replay).pilot));

/** The pilot address recorded in a replay header, as a mainnet (SP/SM) address. */
export function replayPilot(replay: Uint8Array): string {
  const version = isXar(replay) ? (replay[24] === 20 ? 20 : 22) : (engine.readHeader(replay).pilotVersion === 20 ? 20 : 22);
  return addressToString(addressFromVersionHash(version, pilotHex(replay)));
}

/** True when `address` is the wallet the run was flown for (same hash160, the part the contract checks). */
export function isPilot(replay: Uint8Array, address: string): boolean {
  try { return createAddress(address).hash160 === pilotHex(replay); } catch { return false; }
}

export class PayloadError extends Error {}

function b64urlToBytes(s: string): Uint8Array {
  if (!/^[A-Za-z0-9_-]*$/.test(s)) throw new PayloadError('The submit link is damaged.');
  return engine.fromBase64Url(s);
}

/** Parses `#p=<base64url(JSON)>` (or a raw object) and validates every field. */
export function parsePayload(input: string | Record<string, unknown>): SubmitPayload {
  let raw: Record<string, unknown>;
  if (typeof input === 'string') {
    const m = /(?:^|[#&])p=([A-Za-z0-9_-]+)/.exec(input);
    if (!m) throw new PayloadError('No score was attached to this link. Finish a run in Astro Blaster 3 and press Submit again.');
    try {
      raw = JSON.parse(new TextDecoder().decode(b64urlToBytes(m[1])));
    } catch (e) {
      if (e instanceof PayloadError) throw e;
      throw new PayloadError('The submit link is damaged.');
    }
  } else raw = input;
  if (!raw || typeof raw !== 'object') throw new PayloadError('The submit link is damaged.');
  const isArcade = raw.game === ARCADE_GAME;
  if (raw.v !== 1 || (raw.game !== 'astro-blaster-3' && !isArcade)) throw new PayloadError('This link is not an Xtrata Arcade score.');
  if (raw.contract !== ARCADE_CONTRACT_ID) throw new PayloadError('This score is for a different leaderboard contract.');
  if (raw.network !== 'mainnet') throw new PayloadError('This score is not for mainnet.');
  const board = raw.board;
  if (typeof board !== 'string' || !(isArcade ? isArcadeBoard(board) : (ALLOWED_BOARDS as readonly string[]).includes(board))) throw new PayloadError('Unknown leaderboard.');
  const period = raw.period, claimed = raw.score, name = raw.name, replay = raw.replay;
  if (typeof period !== 'number' || !Number.isSafeInteger(period) || period < 0) throw new PayloadError('Invalid board period.');
  if (typeof claimed !== 'number' || !Number.isSafeInteger(claimed) || claimed <= 0) throw new PayloadError('Invalid score.');
  if (typeof name !== 'string' || !NAME_RE.test(name)) throw new PayloadError('Names are 3–12 letters, numbers, spaces, dots, dashes or underscores.');
  if (typeof replay !== 'string' || !replay) throw new PayloadError('The replay is missing.');
  const bytes = b64urlToBytes(replay);
  if (bytes.length === 0 || bytes.length > MAX_REPLAY_BYTES) throw new PayloadError(`The replay must be 1–${MAX_REPLAY_BYTES} bytes.`);
  if ((isArcade || board === 'astro3') && period !== 0) throw new PayloadError('Invalid board period.');
  if (isArcade !== isXar(bytes)) throw new PayloadError('The replay does not belong to this game.');
  let pilot: string;
  try { pilot = replayPilot(bytes); } catch { throw new PayloadError('The replay is not a run from this version.'); }
  if (/^S[PM]0{20,}/.test(pilot) || pilotHex(bytes) === '0'.repeat(40))
    throw new PayloadError('This was a practice run with no pilot, so it cannot be submitted.');
  return { kind: isArcade ? 'xar' : 'ab3', board, period, claimedScore: claimed, name, replay: bytes, pilot };
}

export type Verification =
  | { ok: true; score: number; frames: number }
  | { ok: false; reason: string };

/** Re-plays the run in the engine. The score that gets submitted is the replayed one, never the claimed one. */
export async function verifyPayload(p: SubmitPayload): Promise<Verification> {
  if (p.kind === 'xar') return verifyArcade(p);
  let header;
  try { header = engine.readHeader(p.replay); } catch { return { ok: false, reason: 'The replay is not an Astro Blaster 3 run.' }; }
  if (header.engine !== engine.ENGINE_VERSION)
    return { ok: false, reason: `This run was recorded with engine v${header.engine}; this page verifies v${engine.ENGINE_VERSION}.` };
  const daily = p.board === 'astro3-daily';
  if (daily !== (header.mode === engine.MODE_DAILY)) return { ok: false, reason: 'The run mode does not match the chosen board.' };
  if (daily && header.period !== p.period) return { ok: false, reason: 'The run is for a different day.' };
  const r = await engine.verifyReplay(p.replay, { score: p.claimedScore, period: daily ? p.period : null, mode: header.mode, chunk: 8000 });
  if (!r.ok) return { ok: false, reason: `The replay did not reproduce this score (${r.reason}).` };
  return { ok: true, score: r.score, frames: r.frames };
}

/**
 * Arcade runs are checked for consistency here (the header must match the board, the wallet and the claimed score, and the
 * event stream must unpack). The leaderboard contract stores the replay beside the score; anyone can re-play it through the
 * inscribed arcade (#3076) to confirm the score. The score that is submitted is always the one written in the replay.
 */
async function verifyArcade(p: SubmitPayload): Promise<Verification> {
  const b = p.replay, info = ARCADE_BOARDS[p.board];
  if (!info || !isXar(b)) return { ok: false, reason: 'The replay is not an Xtrata Arcade run.' };
  if ((b[3] & 127) !== 1) return { ok: false, reason: `Unsupported replay format ${b[3] & 127}.` };
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
  const time = !!(b[25] & 1), steps = dv.getUint32(32, true), score = dv.getUint32(36, true), gameIdx = b[40], variantIdx = b[41];
  if (gameIdx !== info.gameIdx || variantIdx !== info.variantIdx || time !== info.time) return { ok: false, reason: 'The run does not match the chosen board.' };
  if (!(b[25] & 2) && time) return { ok: false, reason: 'A timed run must be finished to be ranked.' };
  if (steps < 1 || steps > XAR_MAX_STEPS) return { ok: false, reason: 'The run length is out of range.' };
  if (score <= 0) return { ok: false, reason: 'The run has no score.' };
  if (score !== p.claimedScore) return { ok: false, reason: 'The replay does not record the claimed score.' };
  if (!(b[3] & 128)) {
    try {
      const ds = new Response(new Blob([b.subarray(XAR_HEADER) as BlobPart]).stream().pipeThrough(new DecompressionStream('deflate-raw')));
      await ds.arrayBuffer();
    } catch { return { ok: false, reason: 'The replay data is damaged.' }; }
  }
  return { ok: true, score, frames: steps };
}

export type BoardInfo = { fee: bigint; enabled: boolean; maxScore: bigint };

/** Contract-call options for showContractCall. Deny mode; the only STX that may move is the board's entry fee. */
export function buildSubmitCall(p: SubmitPayload, score: number, address: string, board: BoardInfo) {
  if (!validateStacksAddress(address) || !address.startsWith('SP') && !address.startsWith('SM')) throw new Error('Connect a mainnet wallet.');
  if (!isPilot(p.replay, address)) throw new Error(`This run was flown as ${p.pilot}. Connect that wallet to submit it.`);
  if (!board.enabled) throw new Error('This leaderboard is closed.');
  if (BigInt(score) > board.maxScore) throw new Error('This score is above the leaderboard limit.');
  const postConditions = board.fee > 0n ? [Pc.principal(address).willSendEq(board.fee).ustx()] : [];
  return {
    contractAddress: ARCADE_CONTRACT.address,
    contractName: ARCADE_CONTRACT.name,
    functionName: 'submit-score',
    functionArgs: [Cl.stringAscii(p.board), Cl.uint(p.period), Cl.uint(score), Cl.stringAscii(p.name), Cl.buffer(p.replay)],
    network: 'mainnet' as const,
    stxAddress: address,
    sponsored: false,
    postConditionMode: PostConditionMode.Deny,
    postConditions
  };
}

export const SUBMIT_ERRORS: Record<number, string> = {
  101: 'The leaderboard is paused.',
  102: 'This leaderboard does not exist yet.',
  103: 'This leaderboard is closed.',
  104: 'This score is outside the allowed range.',
  105: 'That name is not allowed.',
  106: 'That day’s board has closed.',
  107: 'The replay is empty.',
  108: 'You already have an equal or better score on this board.',
  109: 'This score is no longer in the Top 10.',
  113: 'This run was flown for a different wallet.',
  114: 'This wallet is barred from this leaderboard.'
};
