/**
 * Editing the music partner registry (`public/music-partners.json`) safely, by hand, one partner at a time.
 *
 * Pure functions over the parsed JSON so they are testable; `scripts/music-partner.ts` is the thin command-line
 * wrapper. Every edit is re-validated with the same `parseRegistry` the wizard uses at runtime, so a registry this
 * produces is one the wizard accepts, with no errors.
 */
import { SLUG_MAX, parseRegistry, payoutAddressProblem, sanitizeSlug, shareToBps } from './referral';

/** Names nobody may register: they read as Xtrata itself or as a place money is sent. */
export const RESERVED_SLUGS: readonly string[] = [
  'xtrata', 'xtrata-xyz', 'xtratalayers', 'layers', 'official', 'admin', 'support', 'help', 'team', 'staff',
  'wallet', 'treasury', 'fee', 'fees', 'airdrop', 'giveaway', 'free', 'claim', 'radio', 'music', 'wizard', 'agent',
  'agent-one', 'audionals', 'audionauts', 'stacks', 'bitcoin', 'xverse', 'leather', 'hiro', 'null', 'undefined', 'test',
];

export type RegistryFile = { version: 1; partners: Array<Record<string, unknown>> };
export type EditResult = { ok: true; registry: RegistryFile; summary: string } | { ok: false; errors: string[] };

export type AddArgs = {
  slug: string;
  name: string;
  address: string;
  /** 0..1. Omit for the standard share. */
  share?: number;
  /** Allow the rebate-as-change when the payer is the partner. Omit for off. */
  selfReferral?: boolean;
  selfShare?: number;
  minPayoutUstx?: number;
};

/** Same letters with the hyphens taken out and look-alike digits folded, so `fak-fun` / `fakfun` / `f4k-fun` collide. */
export function lookalikeKey(slug: string): string {
  return slug.replace(/-/g, '').replace(/0/g, 'o').replace(/[1l]/g, 'i').replace(/3/g, 'e').replace(/4/g, 'a').replace(/5/g, 's');
}

function load(raw: unknown): { registry?: RegistryFile; errors: string[] } {
  const parsed = parseRegistry(raw);
  // Edits are refused on top of a registry that is already invalid: fix that first, so a new error is never hidden in old ones.
  if (parsed.errors.length) return { errors: ['the registry is already invalid:', ...parsed.errors.map((e) => '  ' + e)] };
  const r = raw as RegistryFile;
  return { registry: { version: 1, partners: r.partners.map((p) => ({ ...p })) }, errors: [] };
}

function finish(registry: RegistryFile, summary: string): EditResult {
  const check = parseRegistry(registry);
  if (check.errors.length) return { ok: false, errors: check.errors };
  return { ok: true, registry, summary };
}

export function addPartner(raw: unknown, args: AddArgs): EditResult {
  const { registry, errors } = load(raw);
  if (!registry) return { ok: false, errors };
  const slug = sanitizeSlug(args.slug);
  if (!slug || slug !== args.slug) return { ok: false, errors: [`slug must be 1-${SLUG_MAX} lowercase letters, digits or inner hyphens`] };
  if (RESERVED_SLUGS.includes(slug)) return { ok: false, errors: [`"${slug}" is reserved`] };
  const key = lookalikeKey(slug);
  const clash = [...RESERVED_SLUGS, ...registry.partners.map((p) => String(p.slug))].find((s) => lookalikeKey(s) === key);
  if (clash) return { ok: false, errors: [clash === slug ? `"${slug}" is already registered` : `"${slug}" is too close to "${clash}"`] };
  const addrProblem = payoutAddressProblem(args.address);
  if (addrProblem) return { ok: false, errors: [addrProblem] };
  const dupAddr = registry.partners.find((p) => String(p.payoutAddress).toUpperCase() === args.address.toUpperCase());
  if (dupAddr) return { ok: false, errors: [`that payout address already belongs to "${String(dupAddr.slug)}"`] };
  for (const [label, v] of [['share', args.share], ['selfShare', args.selfShare]] as const) {
    if (v !== undefined && shareToBps(v) === null) return { ok: false, errors: [`${label} must be a number from 0 to 1 with at most 4 decimals`] };
  }
  const entry: Record<string, unknown> = { slug, name: args.name.trim(), payoutAddress: args.address, active: true };
  // Only what differs from the standard terms is written down, so an entry's explicit fields ARE its deal.
  if (args.share !== undefined) entry.share = args.share;
  if (args.selfReferral) entry.selfReferral = true;
  if (args.selfShare !== undefined) entry.selfShare = args.selfShare;
  if (args.minPayoutUstx !== undefined) entry.minPayoutUstx = args.minPayoutUstx;
  registry.partners.push(entry);
  const done = finish(registry, '');
  if (!done.ok) return done;
  const p = parseRegistry(registry).partners.find((x) => x.slug === slug)!;
  return { ok: true, registry, summary: `added ${slug}: ${p.shareBps / 100}% of the wizard fee, self-referral ${p.selfReferral ? 'on' : 'off'}, link /music/?ref=${slug}` };
}

export function setActive(raw: unknown, slug: string, active: boolean): EditResult {
  const { registry, errors } = load(raw);
  if (!registry) return { ok: false, errors };
  const entry = registry.partners.find((p) => p.slug === slug);
  if (!entry) return { ok: false, errors: [`no partner "${slug}"`] };
  entry.active = active;
  return finish(registry, `${active ? 'activated' : 'deactivated'} ${slug}`);
}

export function listPartners(raw: unknown): string[] {
  const parsed = parseRegistry(raw);
  const lines = parsed.partners.map((p) => `${p.active ? 'active  ' : 'inactive'} ${p.slug.padEnd(SLUG_MAX)} ${String(p.shareBps / 100).padStart(5)}%  self-referral ${p.selfReferral ? 'on ' : 'off'}  ${p.address}`);
  return [...lines, ...parsed.errors.map((e) => 'ERROR ' + e)];
}
