// referral-registry.ts — loads the music partner registry and freezes a referral onto a job.
//
// No money moves here (stage 2 of the referral build). It only answers "who, if anyone,
// referred this job?" and records that answer on the job so nothing later can change it.
//
// Rules this file exists to keep:
//  - The partner (and their payout address) come ONLY from the registry file served by
//    our own site, never from a URL parameter or a request body. `?ref=` is just a slug.
//  - A registry read that FAILED is not the same as a registry that is EMPTY. A failed read
//    throws, so the job is not created and the user can simply retry; we never quietly drop
//    a partner's attribution because of a network blip.
//  - A slug that is unknown, inactive or malformed is simply "no referral": no error.

import { parseRegistry, resolvePartner, sanitizeSlug, type Partner } from './referral';

export const REGISTRY_PATH = '/music-partners.json';
const CACHE_MS = 5 * 60 * 1000;
const ATTEMPTS = 3;

/** What is stored on the job. bigint is stored as a decimal string so JSON round-trips. */
export type FrozenReferral = {
  slug: string;
  name: string;
  address: string;
  shareBps: number;
  selfReferral: boolean;
  selfShareBps: number;
  minPayoutUstx: string;
  frozenAt: string;
};

let cache: { at: number; partners: Partner[] } | null = null;

export function clearReferralRegistryCache() { cache = null; }

async function fetchOnce(url: string): Promise<Partner[]> {
  const r = await fetch(url, { cache: 'no-store' } as any);
  if (!r.ok) throw new Error(`registry ${r.status}`);
  let raw: unknown;
  try { raw = await r.json(); } catch { throw new Error('registry is not valid JSON'); }
  const parsed = parseRegistry(raw);
  // A wholly unreadable registry (wrong shape/version) is a failed read, not an empty one.
  if (!parsed.partners.length && parsed.errors.some((e) => e.startsWith('registry'))) {
    throw new Error(parsed.errors[0]);
  }
  return parsed.partners;
}

/** Load the partners, using a short cache. Throws if the registry cannot be read. */
export async function loadPartners(opts: { sleep?: (ms: number) => Promise<void>; now?: () => number } = {}): Promise<Partner[]> {
  const now = (opts.now || Date.now)();
  if (cache && now - cache.at < CACHE_MS) return cache.partners;
  const url = (typeof location !== 'undefined' ? location.origin : '') + REGISTRY_PATH;
  let lastErr: unknown = null;
  for (let i = 0; i < ATTEMPTS; i += 1) {
    try {
      const partners = await fetchOnce(url);
      cache = { at: now, partners };
      return partners;
    } catch (e) {
      lastErr = e;
      if (i < ATTEMPTS - 1 && opts.sleep) await opts.sleep(500 * (i + 1));
    }
  }
  throw new Error(`Could not check the referral link right now (${lastErr instanceof Error ? lastErr.message : String(lastErr)}). No job was created — please try again.`);
}

/**
 * Resolve the `referral` option of createJob/createBatchJob into a frozen record, or null.
 *  - Only the music wizard takes referrals (origin === 'music'); anything else is ignored
 *    and the registry is not even fetched.
 *  - Only a plain string slug is read. An object (e.g. someone passing an address) is ignored.
 *  - No slug → null with no network call, so jobs without a referral behave exactly as before.
 */
export async function freezeReferral(
  referral: unknown,
  origin: string,
  opts: { sleep?: (ms: number) => Promise<void>; now?: () => number } = {},
): Promise<FrozenReferral | null> {
  if (origin !== 'music') return null;
  if (typeof referral !== 'string') return null;
  const slug = sanitizeSlug(referral);
  if (!slug) return null;
  const partners = await loadPartners(opts);
  const p = resolvePartner(partners, slug);
  if (!p) return null;
  return {
    slug: p.slug, name: p.name, address: p.address,
    shareBps: p.shareBps, selfReferral: p.selfReferral, selfShareBps: p.selfShareBps,
    minPayoutUstx: p.minPayoutUstx.toString(),
    frozenAt: new Date((opts.now || Date.now)()).toISOString(),
  };
}
