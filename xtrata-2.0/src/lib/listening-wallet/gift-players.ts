/**
 * Radio gift players: shared rules for the page and the server.
 *
 * A gift link on its own carries only an amount. A gift PLAYER is a stored definition a link can point to:
 * a title, an ordered track list (songs already in the radio catalogue) and the rule that the player
 * has no free mode. The recipient opens the link, makes a passkey wallet, and the radio arrives with the
 * album loaded as a looping band and a "plays remaining" meter. Plan: Xtrata Music project,
 * claude/radio-gift-player-plan.md.
 *
 * Players are made by the gift admin with a SIP-018 signature (no password on the server), and a
 * definition never changes after it is made: a new version is a new player, so a link already sent
 * cannot be turned into something its sender did not mean.
 */
import {
  createMessageSignature,
  encodeStructuredData,
  getAddressFromPublicKey,
  publicKeyFromSignatureRsv,
  stringAsciiCV,
  TransactionVersion,
  tupleCV,
  uintCV
} from '@stacks/transactions';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';
import { CAMPAIGN_DOMAIN, CAMPAIGN_MAX_AGE_MS } from './gifts';
import { costPerPlay, DEFAULT_PLAY_FEE, HOLDER_PAYMENT, RESERVE } from './policy';

export const PLAYER_MAX_TRACKS = 40;
export const PLAYER_PURPOSE = 'Create an Xtrata radio gift player';
/** Player ids are short and url-safe: they travel in a campaign request, not in a link. */
export const isPlayerId = (id: unknown): id is string => typeof id === 'string' && /^[0-9a-f]{16}$/.test(id);

export interface PlayerDefinition {
  /** Shown as the player's name: "Proof of Sound". Plain text, no markup. */
  title: string;
  /** Shown under the title: usually the artist. Optional. */
  subtitle: string;
  /** Radio catalogue token ids, in play order. The band loops when it reaches the end. */
  tracks: number[];
  /** A catalogue token whose artwork fronts the player; defaults to the first track's. */
  cover: number | null;
}

/** No control characters, no angle brackets (the page uses textContent, this is belt and braces). */
const TEXT = /^[^\u0000-\u001f\u007f<>]+$/u;
export function validText(value: unknown, max: number, required: boolean): value is string {
  if (typeof value !== 'string') return false;
  if (!value.length) return !required;
  return value.length <= max && value === value.trim() && TEXT.test(value);
}

/** Throws a listener-or-admin-facing reason. Does NOT check the catalogue: the server does, against its own table. */
export function validatePlayer(def: PlayerDefinition): PlayerDefinition {
  if (!def || typeof def !== 'object') throw new Error('A player needs a definition.');
  if (!validText(def.title, 60, true)) throw new Error('Title: 1 to 60 plain characters.');
  if (!validText(def.subtitle ?? '', 80, false)) throw new Error('Subtitle: up to 80 plain characters.');
  if (!Array.isArray(def.tracks) || def.tracks.length < 1 || def.tracks.length > PLAYER_MAX_TRACKS) throw new Error(`A player holds 1 to ${PLAYER_MAX_TRACKS} songs.`);
  const seen = new Set<number>();
  for (const id of def.tracks) {
    if (!Number.isSafeInteger(id) || id < 1) throw new Error('Songs are catalogue token numbers.');
    if (seen.has(id)) throw new Error('A song appears twice in the list.');
    seen.add(id);
  }
  if (def.cover !== null && def.cover !== undefined && (!Number.isSafeInteger(def.cover) || def.cover < 1)) throw new Error('Cover is a catalogue token number.');
  return { title: def.title, subtitle: def.subtitle ?? '', tracks: [...def.tracks], cover: def.cover ?? null };
}

/** The same definition always hashes the same, whatever key order it arrived in. */
export const playerHash = (def: PlayerDefinition) =>
  bytesToHex(sha256(new TextEncoder().encode(JSON.stringify({ title: def.title, subtitle: def.subtitle ?? '', tracks: def.tracks, cover: def.cover ?? null }))));

/** What the admin signs: the hash of the definition, so the signature covers every song and word. */
export interface PlayerRequest {
  admin: string;
  /** playerHash of the definition submitted with it. */
  hash: string;
  issued: number;
}

export function validatePlayerRequest(req: PlayerRequest, def: PlayerDefinition, now = Date.now()): PlayerRequest {
  if (!req || typeof req.admin !== 'string') throw new Error('The player request needs the admin address.');
  if (typeof req.hash !== 'string' || req.hash !== playerHash(def)) throw new Error('The signed request is for a different player.');
  if (!Number.isSafeInteger(req.issued) || req.issued > now + 60_000 || now - req.issued > CAMPAIGN_MAX_AGE_MS) throw new Error('Request expired. Sign again.');
  return req;
}

export const playerData = (req: PlayerRequest) => ({
  domain: tupleCV({ name: stringAsciiCV(CAMPAIGN_DOMAIN), version: stringAsciiCV('1'), 'chain-id': uintCV(1) }),
  message: tupleCV({
    purpose: stringAsciiCV(PLAYER_PURPOSE),
    admin: stringAsciiCV(req.admin),
    player: stringAsciiCV(req.hash),
    issued: uintCV(req.issued)
  })
});

/** True only when `signature` (65-byte RSV hex) was made by `address` over this request. */
export function verifyPlayerSignature(req: PlayerRequest, signature: unknown, address: string): boolean {
  try {
    if (typeof signature !== 'string') return false;
    const hex = signature.replace(/^0x/, '');
    if (!/^[a-fA-F0-9]{130}$/.test(hex)) return false;
    const hash = bytesToHex(sha256(encodeStructuredData(playerData(req))));
    return getAddressFromPublicKey(publicKeyFromSignatureRsv(hash, createMessageSignature(hex)), TransactionVersion.Mainnet) === address;
  } catch {
    return false;
  }
}

/** What a recipient's page gets with a gift that carries a player (no secrets). */
export interface PlayerView {
  id: string;
  title: string;
  subtitle: string;
  /**
   * Resolved from the catalogue by the server: titles and artists are never typed in by the creator. `hidden`: a
   * hidden track, not listed, played only after a silence when the album ran start to finish without a skip.
   */
  tracks: { id: number; title: string; artist: string; hidden?: true }[];
  cover: number | null;
  /** True: when the paid plays run out the radio stops instead of carrying on for free. */
  paidOnly: true;
}

// ---- plays: the interface speaks in plays, not STX ----

/** Gift amount (microSTX) that buys at least `plays` paid plays at `fee`, after the return reserve. */
export const amountForPlays = (plays: number, fee = DEFAULT_PLAY_FEE) => RESERVE + BigInt(plays) * costPerPlay(fee);

/** Whole plays a balance still buys: floor((balance - reserve) / cost of one play). */
export const playsRemaining = (balance: bigint, fee = DEFAULT_PLAY_FEE): number =>
  balance <= RESERVE ? 0 : Number((balance - RESERVE) / costPerPlay(fee));

/** Presets offered to the admin. Max is the largest gift (1 STX). */
/** The songs an album lists (its hidden track, if any, is not one of them). */
export const listedTracks = (p: Pick<PlayerView, 'tracks'>) => p.tracks.filter((t) => !t.hidden);
/** The album's hidden track: plays only after a silence when the album ran start to finish without a skip. */
export const hiddenTrack = (p: Pick<PlayerView, 'tracks'>) => p.tracks.find((t) => t.hidden) ?? null;

export const PLAY_PRESETS = [300, 500, 1000] as const;

/** Of the gift: what goes to song holders and what is network fee, at `fee` per play. */
export function giftBreakdown(plays: number, fee = DEFAULT_PLAY_FEE) {
  const holders = BigInt(plays) * HOLDER_PAYMENT;
  return { holders, fees: BigInt(plays) * fee, reserve: RESERVE, total: amountForPlays(plays, fee) };
}
