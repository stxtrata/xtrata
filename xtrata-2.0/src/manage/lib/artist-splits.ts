import {
  ClarityType,
  cvToString,
  listCV,
  noneCV,
  principalCV,
  someCV,
  tupleCV,
  uintCV,
  validateStacksAddress,
  type ClarityValue
} from '@stacks/transactions';

/**
 * v1.9 artist tier, as the studio edits it: one line per slot,
 *   <wallet address> <percent of the artist pool>
 *   #<inscription id> <percent>     (pays whoever holds that inscription at each sale)
 * Percentages allow two decimals and must total exactly 100.
 */
export type ArtistSplitEntry = {
  recipient: string;
  holderOf: bigint | null;
  shareBps: bigint;
};

export const ARTIST_POOL_BPS = 10_000n;
export const MAX_ARTIST_SLOTS = 8;

const PERCENT = /^(\d{1,3})(?:\.(\d{1,2}))?%?$/;
const HOLDER = /^#(\d{1,20})$/;

const percentToBps = (value: string): bigint | null => {
  const match = PERCENT.exec(value);
  if (!match) return null;
  return BigInt(match[1]) * 100n + BigInt((match[2] ?? '').padEnd(2, '0') || '0');
};

export const formatShare = (bps: bigint) => {
  const whole = bps / 100n;
  const cents = bps % 100n;
  return cents === 0n ? `${whole}%` : `${whole}.${cents.toString().padStart(2, '0').replace(/0$/, '')}%`;
};

export type ParsedArtistSplits = { entries: ArtistSplitEntry[]; errors: string[] };

/**
 * Holder slots carry the primary artist's address in their recipient field:
 * the contract ignores it for those slots, but it must be a valid principal.
 */
export function parseArtistSplits(text: string, options: { allowance: number }): ParsedArtistSplits {
  const errors: string[] = [];
  const entries: ArtistSplitEntry[] = [];
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter((line) => line.length > 0);
  lines.forEach((line, index) => {
    const lineNo = index + 1;
    const [target = '', share = '', ...rest] = line.split(/[\s,]+/);
    if (rest.length > 0 || !share) {
      errors.push(`Line ${lineNo}: write a wallet address (or #inscription) then a percentage, e.g. "SP… 50".`);
      return;
    }
    const shareBps = percentToBps(share);
    if (shareBps === null || shareBps === 0n) {
      errors.push(`Line ${lineNo}: "${share}" is not a percentage above 0 (up to two decimals).`);
      return;
    }
    const holder = HOLDER.exec(target);
    if (holder) {
      if (index === 0) {
        errors.push('Line 1 is the primary artist and must be a wallet address, not an inscription holder.');
        return;
      }
      entries.push({ recipient: entries[0]?.recipient ?? '', holderOf: BigInt(holder[1]), shareBps });
      return;
    }
    if (!validateStacksAddress(target) || target.includes('.')) {
      errors.push(`Line ${lineNo}: "${target}" is not a wallet address.`);
      return;
    }
    entries.push({ recipient: target, holderOf: null, shareBps });
  });
  if (lines.length === 0) {
    errors.push('Add at least one line: your wallet address and 100.');
  }
  if (lines.length > options.allowance) {
    errors.push(
      `This collection has ${options.allowance} artist slot${options.allowance === 1 ? '' : 's'}. Ask Xtrata for more if you need to pay ${lines.length} recipients.`
    );
  }
  if (errors.length === 0) {
    const total = entries.reduce((sum, entry) => sum + entry.shareBps, 0n);
    if (total !== ARTIST_POOL_BPS) {
      errors.push(`The shares add up to ${formatShare(total)}. They must add up to exactly 100%.`);
    }
  }
  return { entries, errors };
}

export const formatArtistSplits = (entries: ArtistSplitEntry[]) =>
  entries
    .map((entry) => `${entry.holderOf !== null ? `#${entry.holderOf}` : entry.recipient} ${formatShare(entry.shareBps).replace('%', '')}`)
    .join('\n');

export const artistSplitsToClarity = (entries: ArtistSplitEntry[]): ClarityValue =>
  listCV(
    entries.map((entry) =>
      tupleCV({
        recipient: principalCV(entry.recipient),
        'holder-of': entry.holderOf === null ? noneCV() : someCV(uintCV(entry.holderOf)),
        share: uintCV(entry.shareBps)
      })
    )
  );

type Cv = ClarityValue & Record<string, any>;

const unwrapOk = (value: Cv): Cv | null =>
  value.type === ClarityType.ResponseOk ? (value.value as Cv) : value.type === ClarityType.ResponseErr ? null : value;
const field = (tuple: Cv | null, key: string): Cv | null =>
  tuple && tuple.type === ClarityType.Tuple ? ((tuple.data as Record<string, Cv>)[key] ?? null) : null;
const uintOf = (value: Cv | null): bigint | null =>
  value && value.type === ClarityType.UInt ? BigInt(value.value as bigint | string) : null;
const principalOf = (value: Cv | null): string | null =>
  value && (value.type === ClarityType.PrincipalStandard || value.type === ClarityType.PrincipalContract)
    ? cvToString(value)
    : null;
const boolOf = (value: Cv | null): boolean | null =>
  value?.type === ClarityType.BoolTrue ? true : value?.type === ClarityType.BoolFalse ? false : null;

export type ArtistSplitsState = { allowance: number; maxSlots: number; entries: ArtistSplitEntry[] };

/** `get-artist-splits`. Null when the read failed or is not v1.9-shaped (never "no splits"). */
export function artistSplitsFromClarity(value: ClarityValue): ArtistSplitsState | null {
  const tuple = unwrapOk(value as Cv);
  const allowance = uintOf(field(tuple, 'allowance'));
  const maxSlots = uintOf(field(tuple, 'max-slots'));
  const list = field(tuple, 'splits');
  if (allowance === null || maxSlots === null || !list || list.type !== ClarityType.List) return null;
  const entries: ArtistSplitEntry[] = [];
  for (const item of list.list as Cv[]) {
    const recipient = principalOf(field(item, 'recipient'));
    const shareBps = uintOf(field(item, 'share'));
    const holder = field(item, 'holder-of');
    if (!recipient || shareBps === null || !holder) return null;
    let holderOf: bigint | null = null;
    if (holder.type === ClarityType.OptionalSome) {
      holderOf = uintOf(holder.value as Cv);
      if (holderOf === null) return null;
    } else if (holder.type !== ClarityType.OptionalNone) {
      return null;
    }
    entries.push({ recipient, holderOf, shareBps });
  }
  return { allowance: Number(allowance), maxSlots: Number(maxSlots), entries };
}

export type PlatformSlot = { recipient: string; bps: bigint };
export type PlatformSplitsState = {
  marketplace: PlatformSlot;
  operator: PlatformSlot;
  auxiliary: PlatformSlot;
  totalBps: bigint;
  minBps: bigint;
  maxBps: bigint;
  launched: boolean;
};

/** `get-platform-splits`. Null when the read failed or is not v1.9-shaped. */
export function platformSplitsFromClarity(value: ClarityValue): PlatformSplitsState | null {
  const tuple = unwrapOk(value as Cv);
  const slot = (key: string): PlatformSlot | null => {
    const entry = field(tuple, key);
    const recipient = principalOf(field(entry, 'recipient'));
    const bps = uintOf(field(entry, 'bps'));
    return recipient && bps !== null ? { recipient, bps } : null;
  };
  const marketplace = slot('marketplace');
  const operator = slot('operator');
  const auxiliary = slot('auxiliary');
  const totalBps = uintOf(field(tuple, 'total-bps'));
  const minBps = uintOf(field(tuple, 'min-bps'));
  const maxBps = uintOf(field(tuple, 'max-bps'));
  const launched = boolOf(field(tuple, 'launched'));
  if (!marketplace || !operator || !auxiliary || totalBps === null || minBps === null || maxBps === null || launched === null) {
    return null;
  }
  return { marketplace, operator, auxiliary, totalBps, minBps, maxBps, launched };
}

export type ArtistPayee = { payee: string; shareBps: bigint; holderOf: bigint | null };

/** `get-artist-payees`: who each slot would pay right now. */
export function artistPayeesFromClarity(value: ClarityValue): ArtistPayee[] | null {
  const list = unwrapOk(value as Cv);
  if (!list || list.type !== ClarityType.List) return null;
  const payees: ArtistPayee[] = [];
  for (const item of list.list as Cv[]) {
    const payee = principalOf(field(item, 'payee'));
    const shareBps = uintOf(field(item, 'share'));
    const holder = field(item, 'holder-of');
    if (!payee || shareBps === null || !holder) return null;
    const holderOf = holder.type === ClarityType.OptionalSome ? uintOf(holder.value as Cv) : null;
    payees.push({ payee, shareBps, holderOf });
  }
  return payees;
}
