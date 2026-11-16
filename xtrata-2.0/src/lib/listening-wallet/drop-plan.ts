/**
 * The 1,000 free starter players as a plan: which prefunded batches to make, and how to tell from the batches a
 * creator already has which of them are done. Shared by the radio's admin panel (src/radio-ppp/gifts.ts) and the
 * loader script (scripts/load-players-wall.mjs reads the same numbers through `dropTotals`).
 *
 * A batch holds copies of ONE size and at most BATCH_MAX_COPIES of them, so the suggested mix (tiers.ts: 5 Diamond,
 * 10 Gold, 20 Silver, 100 Bronze, 865 Classic) is 13 batches. Each is recognised afterwards by its label, its size and
 * its amount together, so a batch made for anything else can never be mistaken for part of the drop.
 */
import { BATCH_MAX_COPIES, batchDeposit, copyAmountForPlays, type BatchView } from './batches';
import { SUGGESTED_DROP, tierById, type TierId } from './tiers';

export interface DropStep {
  /** 1-based place in the plan. */
  n: number;
  tier: TierId;
  plays: number;
  count: number;
  /** What the batch is called, and how it is found again: "1000 Players 01". */
  label: string;
  /** microSTX that land in each player. */
  amount: bigint;
  /** What the creator pays for this batch, network fees included. */
  deposit: bigint;
}

/** A recipient can see a gift's label, so it never names the class: that stays a surprise until the plays land. */
export const DROP_LABEL = '1000 Players';

export function dropSteps(max = BATCH_MAX_COPIES): DropStep[] {
  const out: DropStep[] = [];
  for (const row of SUGGESTED_DROP) {
    const amount = copyAmountForPlays(row.plays, false);
    for (let left = row.count; left > 0; left -= max) {
      const count = Math.min(left, max), n = out.length + 1;
      out.push({ n, tier: row.tier, plays: row.plays, count, label: `${DROP_LABEL} ${String(n).padStart(2, '0')}`, amount, deposit: batchDeposit(count, amount) });
    }
  }
  return out;
}

export const dropTotals = (steps = dropSteps()) => ({
  batches: steps.length,
  players: steps.reduce((a, s) => a + s.count, 0),
  deposit: steps.reduce((a, s) => a + s.deposit, 0n),
  tiers: SUGGESTED_DROP.map((r) => ({ id: r.tier, plays: r.plays, count: r.count }))
});

/** A batch as the page keeps it (the links exist only on the device that made them). */
export interface DropBatch { id: string; codes: string[]; count: number; amount: string; label: string; player: string | null; at: number; txid?: string; view?: BatchView; error?: string }

/**
 * todo: not made · unpaid: made, links saved, payment not sent · confirming: paid, waiting for the chain ·
 * live: paid and every copy waiting to be claimed · touched: live, but some copies are no longer waiting (claimed or
 * refunded), so the drop would come up short.
 */
export type StepState = 'todo' | 'unpaid' | 'confirming' | 'live' | 'touched';
export interface StepStatus { step: DropStep; state: StepState; batch?: DropBatch; /** Other batches that look like this step (made twice). */ extras: number; detail: string }

/** A batch nobody paid for is dropped by the server after a day; do not offer to pay it after that. */
const UNPAID_FOR_MS = 23 * 3600_000;
const rank = (s: StepState) => ['todo', 'unpaid', 'confirming', 'touched', 'live'].indexOf(s);

function stateOf(b: DropBatch, now: number): StepState {
  const v = b.view;
  if (v?.status === 'live') return v.copies.waiting === b.count ? 'live' : 'touched';
  if (b.txid) return 'confirming';
  return now - b.at < UNPAID_FOR_MS ? 'unpaid' : 'todo';
}

export function stepStatus(step: DropStep, batches: readonly DropBatch[], now: number): StepStatus {
  // Only a batch whose links are on this device counts: without them its players can never go on the wall.
  const mine = batches
    .filter((b) => b.label === step.label && b.player === null && b.count === step.count && b.amount === step.amount.toString() && b.codes.length === step.count)
    .map((b) => ({ b, state: stateOf(b, now) }))
    .filter((x) => x.state !== 'todo')
    .sort((x, y) => rank(y.state) - rank(x.state) || y.b.at - x.b.at);
  const best = mine[0];
  if (!best) return { step, state: 'todo', extras: 0, detail: 'not made yet' };
  const c = best.b.view?.copies;
  const detail = best.state === 'live' ? `live · all ${step.count} waiting to be claimed`
    : best.state === 'touched' ? `live, but only ${c?.waiting ?? 0} of ${step.count} still waiting (${c?.claimed ?? 0} claimed)`
    : best.state === 'confirming' ? 'paid · waiting for the payment to confirm'
    : 'made · links saved · not paid yet';
  return { step, state: best.state, batch: best.b, extras: mine.length - 1, detail: best.b.error ? `${detail} (${best.b.error})` : detail };
}

export interface DropStatus {
  steps: StepStatus[];
  /** The first step still to make, if any. Steps are made in order so one press can never make the wrong batch. */
  next: DropStep | null;
  done: number;
  /** Every batch is live and untouched, and the links add up: the drop can go on the wall. */
  ready: boolean;
  /** Every link code of the drop, when ready (else empty). */
  codes: string[];
  problems: string[];
}

export function dropStatus(batches: readonly DropBatch[], now: number, steps = dropSteps()): DropStatus {
  const list = steps.map((s) => stepStatus(s, batches, now));
  const problems: string[] = [];
  for (const s of list) {
    if (s.extras) problems.push(`Batch ${s.step.n} was made more than once. The extra ${s.extras === 1 ? 'one is' : 'ones are'} not part of the drop: leave ${s.extras === 1 ? 'it' : 'them'} unpaid, or if paid the money comes back when the copies run out.`);
    if (s.state === 'touched') problems.push(`Batch ${s.step.n} has copies that are no longer waiting, so the wall would come up short.`);
  }
  const allLive = list.every((s) => s.state === 'live');
  const codes = allLive ? list.flatMap((s) => s.batch!.codes) : [];
  const total = dropTotals(steps).players;
  if (allLive && new Set(codes).size !== total) problems.push(`The links do not add up: ${new Set(codes).size} different links for ${total} players.`);
  const ready = allLive && new Set(codes).size === total;
  return { steps: list, next: list.find((s) => s.state === 'todo')?.step ?? null, done: list.filter((s) => s.state === 'live').length, ready, codes: ready ? codes : [], problems };
}

/** What the public wall says against what the drop should be. `wall` is GET /radio/giveaway/players. */
export function wallCheck(wall: unknown, steps = dropSteps()): { ok: boolean; text: string } {
  const w = wall as { state?: string; total?: number; free?: number; held?: number; claimed?: number; tiers?: { id: string; plays: number; total: number; left: number }[] } | null;
  if (!w || typeof w.total !== 'number') return { ok: false, text: 'The wall could not be read just now.' };
  const want = dropTotals(steps);
  if (w.total === 0) return { ok: false, text: 'The wall is empty: nothing is loaded.' };
  const gone = w.total - (w.free ?? 0) - (w.held ?? 0) - (w.claimed ?? 0);
  const mix = want.tiers.map((t) => { const got = w.tiers?.find((x) => x.plays === t.plays); return { ...t, got: got?.total ?? 0 }; });
  const mixText = mix.map((t) => `${t.got} ${tierById(t.id).name}`).join(', ');
  const extra = (w.tiers ?? []).filter((x) => !want.tiers.some((t) => t.plays === x.plays));
  const ok = w.total === want.players && gone === 0 && !!w.tiers && mix.every((t) => t.got === t.count) && extra.length === 0;
  if (ok) return { ok, text: `The wall holds ${w.total.toLocaleString('en-GB')} players: ${mixText}. ${w.claimed ?? 0} claimed so far${w.state === 'paused' ? ' · PAUSED' : ''}.` };
  return { ok, text: `The wall is not the 1,000 yet: ${w.total.toLocaleString('en-GB')} spots${w.tiers ? ` (${mixText}${extra.length ? `, and ${extra.reduce((a, x) => a + x.total, 0)} of another size` : ''})` : ''}${gone ? `, ${gone} no longer available` : ''}.` };
}
