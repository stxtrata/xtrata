/**
 * A Music Hero record: the few hundred bytes that are inscribed when a listener claims their award
 * (docs/music/AWARDS-INSCRIPTION.md). One function builds them, for the server and for the tests, so a record is
 * always byte-for-byte what the award contract was given a note for. The bytes are the same as the two records
 * inscribed in the testnet rehearsal (the test holds them).
 *
 * NEVER change the shape of a record once claiming has opened: a retry must give the same bytes as the first try.
 */
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';

/** The contract's number for each class (set with `set-class`). Diamond and Gold are as in the testnet rehearsal. */
export const AWARD_CLASS = { diamond: 1, gold: 2, silver: 3, bronze: 4, classic: 5 } as const;
export type AwardClassId = keyof typeof AWARD_CLASS;
export const AWARD_CLASS_NAME: Record<AwardClassId, string> = { diamond: 'Diamond', gold: 'Gold', silver: 'Silver', bronze: 'Bronze', classic: 'Classic' };
/** The contract refuses a longer record. */
export const MAX_RECORD_BYTES = 1024;

const ADDRESS = /^S[PMTN][0-9A-Z]{28,41}$/;
/** A .btc-style name as it may appear on a plaque: lower case, one dot, nothing that could be markup or a parameter. */
const NAME = /^[a-z0-9][a-z0-9_-]{0,36}\.[a-z0-9][a-z0-9-]{0,19}$/;
export const cleanAwardName = (name: unknown): string | null => {
  if (typeof name !== 'string') return null;
  const n = name.trim().toLowerCase();
  return NAME.test(n) ? n : null;
};

/** The record's own look within its class: fixed by the drop, the wall number and the hero, so it never changes. */
export const awardSeed = (drop: number, number: number, hero: string): string =>
  bytesToHex(sha256(new TextEncoder().encode(`xtrata-music-hero:${drop}:${number}:${hero}`))).slice(0, 8);

export interface RecordInput {
  /** The class template's inscription number on Xtrata. */
  template: number;
  cls: AwardClassId;
  /** The listener address that made the plays. */
  hero: string;
  /** The player's number on the wall. */
  number: number;
  /** The plays that earned it. */
  plays: number;
  /** A name to show beside the address, or null. */
  name: string | null;
  drop: number;
}

const whole = (n: unknown, max: number) => Number.isSafeInteger(n) && (n as number) >= 0 && (n as number) <= max;

export function buildRecord(i: RecordInput): Uint8Array {
  if (!whole(i.template, 1e12) || !whole(i.number, 9_999_999) || i.number < 1 || !whole(i.plays, 9_999_999) || i.plays < 1 || !whole(i.drop, 1e6)) throw new Error('That record cannot be built.');
  if (!ADDRESS.test(i.hero) || !(i.cls in AWARD_CLASS)) throw new Error('That record cannot be built.');
  const name = i.name === null ? '' : cleanAwardName(i.name);
  if (name === null) throw new Error('That name cannot go on a record.');
  const bytes = new TextEncoder().encode(
    `<!doctype html><meta charset=utf-8><title>Xtrata Music Hero · ${AWARD_CLASS_NAME[i.cls]} record No. ${String(i.number).padStart(4, '0')}${name ? ' · ' + name : ''}</title>` +
    `<style>html,body,iframe{margin:0;width:100%;height:100%;border:0;background:#040509}</style>` +
    `<iframe src="/i/${i.template}#n=${i.number}&a=${i.hero}${name ? '&b=' + name : ''}&p=${i.plays}&s=${awardSeed(i.drop, i.number, i.hero)}"></iframe>`);
  if (bytes.length > MAX_RECORD_BYTES) throw new Error('That record is too long.');
  return bytes;
}

/** Xtrata's hash of a one-chunk inscription: sha256(32 zero bytes, then the bytes). What the note covers. */
export const recordHash = (record: Uint8Array): Uint8Array => {
  const joined = new Uint8Array(32 + record.length);
  joined.set(record, 32);
  return sha256(joined);
};

export interface ParsedRecord { template: number; cls: AwardClassId; hero: string; number: number; plays: number; name: string | null }
const SHAPE = /^<!doctype html><meta charset=utf-8><title>Xtrata Music Hero · (Diamond|Gold|Silver|Bronze|Classic) record No\. \d{4,7}(?: · [a-z0-9._-]+)?<\/title><style>[^<]*<\/style><iframe src="\/i\/(\d{1,12})#n=(\d{1,7})&a=(S[PMTN][0-9A-Z]{28,41})(?:&b=([a-z0-9._-]+))?&p=(\d{1,7})&s=[0-9a-f]{8}"><\/iframe>$/;
/**
 * Reads a record back into its parts, and accepts it only if building those parts again gives the very same bytes.
 * So whatever passes is a genuine record of this drop, with nothing extra in it. Null for anything else.
 * The wallet box uses this to show the listener what they are about to claim, from the bytes themselves.
 */
export function parseRecord(record: Uint8Array, drop: number): ParsedRecord | null {
  if (record.length > MAX_RECORD_BYTES) return null;
  let text: string;
  try { text = new TextDecoder('utf-8', { fatal: true }).decode(record); } catch { return null; }
  const m = SHAPE.exec(text);
  if (!m) return null;
  const cls = (Object.keys(AWARD_CLASS_NAME) as AwardClassId[]).find((k) => AWARD_CLASS_NAME[k] === m[1]);
  if (!cls) return null;
  const parsed: ParsedRecord = { template: Number(m[2]), cls, number: Number(m[3]), hero: m[4], name: m[5] ?? null, plays: Number(m[6]) };
  try {
    const again = buildRecord({ ...parsed, drop });
    if (again.length !== record.length || !again.every((b, i) => b === record[i])) return null;
  } catch { return null; }
  return parsed;
}
