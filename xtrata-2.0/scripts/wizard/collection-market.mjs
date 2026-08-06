/**
 * collection-market.mjs — a wizard lists its own collection, and earns from it.
 *
 * Minting is the expense. This is the other half: each of the three wizards
 * puts its own eight plates and its own manifest on a sponsored market, at a
 * price that follows from what that wizard thinks a price is, and keeps
 * whatever a sale returns. The Builder prices at cost, the Archivist prices for
 * permanence, the Skeptic prices low because it doubts the value it is asking
 * for. Those arguments are in the three collection files and in the three
 * manifests; what is here is the mechanism that acts on them.
 *
 * **Nothing about listing is reimplemented.** `market-run-core.mjs` already
 * knows how to list one token: the allowlist assertion, the escrowed STX fee
 * budget, the post-conditions, the probe that decides whether a lost
 * transaction landed, the nonce asymmetry, the journal and the halt semantics.
 * A second implementation of "did this listing land" would be exactly one too
 * many, and this file therefore does one thing: it decides *what* to list and
 * at what price, then calls `runMarketScenarios` once per plate with the
 * listing scenario for the chosen market.
 *
 * One market run per plate, each with its own run id and its own journal. That
 * is deliberate rather than convenient. `runMarketScenarios` records a
 * scenario's outcome under its scenario id and skips it on a resume, so eight
 * listings inside one run would be one listing and seven no-ops. Separate run
 * ids give each plate its own resumable record, which is also what a partially
 * completed listing sweep needs.
 *
 * The one rail that is genuinely this file's own is the collection-level spend
 * cap. A per-plate market run cannot see a loop that lists nine things, so the
 * cumulative committed spend is carried across the calls and checked before
 * each one, with `assertRunSpendCap` imported rather than restated.
 *
 * Only the three **sponsored** markets accept a v3-2-3 inscription. The other
 * three hardcode ALLOWED-NFT-CONTRACT to the retired core and reject these at
 * `list-token`. That is asserted live inside the scenario, not trusted here.
 *
 * Everything is injected. There is no terminal in this file, no direct network
 * call and no direct disk access.
 */

import { WizardSafetyError, groupDigits, microStxToStx } from './inscribe.mjs';
import { MANIFEST_KEY, RunHalt, assertRunSpendCap } from './run-thread-core.mjs';
import {
  MARKET_KEYS,
  MIN_FEE_BUDGET_USTX,
  NULL_PORTS,
  formatAmount,
  getMarket,
  priceForMarket,
  runMarketScenarios
} from './market-run-core.mjs';
import { DEFAULT_COLLECTION_ID, getCollection } from './collections.mjs';

export { MARKET_KEYS, MIN_FEE_BUDGET_USTX, MANIFEST_KEY };

/**
 * The cap across a whole listing sweep, in microSTX.
 *
 * Nine listings at the contract's 50,000 minimum budget is 450,000 escrowed
 * plus nine miner fees. This sits above that and well below anything a wizard
 * holds, so a loop stops at the cap rather than at the balance floor. Every
 * microSTX it counts is recoverable — a cancel returns the budget in full — and
 * it is counted anyway, because the number exists to stop a loop and not to
 * balance the books.
 */
export const DEFAULT_LISTING_RUN_SPEND_CAP_USTX = 1_000_000n;

/** The market a listing sweep uses when nothing says otherwise. */
export const DEFAULT_LISTING_MARKET = 'stx';

/** The scenario in market-run-core that lists on a given market. */
export const listScenarioFor = (marketKey) => `list-${getMarket(marketKey).key}`;

/**
 * A stable run id per plate, so each listing has its own resumable journal.
 *
 * The collection id is already constrained to journal-safe characters, and the
 * suffix is a piece index or the literal `manifest`, so the result always
 * satisfies `marketJournalPathFor`.
 */
export const listingRunIdFor = ({ collectionId, key }) => `${collectionId}-${key}`;

/* ------------------------------------------------------------------ */
/* what would be listed                                                */
/* ------------------------------------------------------------------ */

/**
 * The listing plan for a whole collection: which inscription, at what price, on
 * which market, and the exact `market-run.mjs` command that would do it alone.
 *
 * Pure. Reads nothing, needs no key, and is what `--list` prints before it does
 * anything and what `--list` with no ids prints instead of doing anything. The
 * per-row command is the documented handoff: every row here is runnable on its
 * own with `market-run.mjs --scenario list-<market> --token-list-<market> <id>`,
 * which is the same code path this file calls.
 *
 * @param {object} input
 * @param {string} input.collectionId
 * @param {Record<string, string>} input.ids  inscription id per key: '1'..'8' and 'manifest'
 * @param {string} input.market               short market key
 */
export function collectionListingPlan({
  collectionId = DEFAULT_COLLECTION_ID,
  ids = {},
  market: marketKey = DEFAULT_LISTING_MARKET,
  feeBudgetUstx = MIN_FEE_BUDGET_USTX
} = {}) {
  const art = getCollection(collectionId);
  const market = getMarket(marketKey);
  const scenarioId = listScenarioFor(market.key);

  const targets = [
    ...art.pieces.map((piece) => ({
      key: String(piece.index),
      index: piece.index,
      label: piece.id,
      caption: piece.caption,
      askUstx: art.price.pieceUstx
    })),
    {
      key: MANIFEST_KEY,
      index: null,
      label: 'manifest',
      caption: `The list that says what ${art.title} was.`,
      askUstx: art.price.manifestUstx
    }
  ];

  const rows = targets.map((target) => {
    const id = ids[target.key] === undefined || ids[target.key] === null ? null : String(ids[target.key]);
    const priceAmount = priceForMarket(target.askUstx, market);
    return {
      ...target,
      inscriptionId: id,
      priceAmount,
      priceLabel: formatAmount(priceAmount, market.payment.decimals, market.payment.symbol),
      runId: listingRunIdFor({ collectionId: art.id, key: target.key }),
      command: id
        ? `node scripts/wizard/market-run.mjs --run ${listingRunIdFor({ collectionId: art.id, key: target.key })} ` +
          `--scenario ${scenarioId} --token-${market.key} ${id} --seller ${art.wizard} ` +
          `--price-ustx ${target.askUstx} --broadcast`
        : null
    };
  });

  const listable = rows.filter((row) => row.inscriptionId !== null);
  return {
    collectionId: art.id,
    collectionTitle: art.title,
    wizard: art.wizard,
    wizardName: art.persona.name,
    market,
    scenarioId,
    feeBudgetUstx: BigInt(feeBudgetUstx),
    reasoning: art.pricing.reasoning,
    rows,
    listable,
    missing: rows.filter((row) => row.inscriptionId === null),
    // What the sweep escrows, not what it earns. The budget comes back on a
    // cancel and mostly comes back on a sale, and saying "total ask" next to a
    // number nobody has offered would be the kind of claim this fleet refuses
    // to make about itself.
    escrowUstx: BigInt(feeBudgetUstx) * BigInt(listable.length),
    totalAskUstx: listable.reduce((sum, row) => sum + BigInt(row.askUstx), 0n)
  };
}

/**
 * Inscription ids for a collection, taken from a mint journal.
 *
 * The journal is the only place that knows what a run actually minted, and a
 * listing sweep that took ids from anywhere else could list somebody else's
 * token at this collection's price. Only `confirmed` and `external` records
 * count: a record that is merely `broadcast` has a transaction id and no
 * inscription id, and there is nothing to list yet.
 */
export function idsFromMintJournal(journal) {
  const ids = {};
  for (const [key, record] of Object.entries(journal?.pieces ?? {})) {
    if (!record?.inscriptionId) continue;
    if (record.status !== 'confirmed' && record.status !== 'external') continue;
    ids[key] = String(record.inscriptionId);
  }
  return ids;
}

/* ------------------------------------------------------------------ */
/* the sweep                                                           */
/* ------------------------------------------------------------------ */

/**
 * List every member of a collection, one market run per member.
 *
 * Never throws for a condition it expects. A halt, a refusal or a failed
 * listing comes back as `{ ok: false, halted }` with every row that did
 * complete still in the result, because by the time any of them happens there
 * is state worth reporting.
 *
 * The seller is the collection's own wizard and cannot be overridden. A
 * collection listed out of another wizard's wallet would fail at the contract
 * anyway — `list-token` needs the owner — but failing here, before a miner fee
 * is paid, is better than failing there.
 */
export async function listCollection({ ports = {}, options = {} } = {}) {
  const io = { ...NULL_PORTS, ...ports };
  const {
    collectionId = DEFAULT_COLLECTION_ID,
    ids = {},
    market: marketKey = DEFAULT_LISTING_MARKET,
    broadcast = false,
    only = null,
    feeBudgetUstx = MIN_FEE_BUDGET_USTX,
    runSpendCapUstx = DEFAULT_LISTING_RUN_SPEND_CAP_USTX,
    env = {},
    wallets = {},
    ...passThrough
  } = options;

  const plan = collectionListingPlan({ collectionId, ids, market: marketKey, feeBudgetUstx });
  const art = getCollection(collectionId);
  const wanted = only === null ? null : new Set((Array.isArray(only) ? only : [only]).map(String));
  const queue = plan.listable.filter((row) => wanted === null || wanted.has(row.key));

  const results = [];
  let committedUstx = 0n;
  let halted = null;

  try {
    if (plan.listable.length === 0) {
      throw new RunHalt(
        'predecessor',
        `nothing to list: no inscription id is known for any member of ${art.id}. Mint it first, or pass the ids ` +
          'with --ids in piece order.'
      );
    }
    if (!wallets[art.wizard]?.address) {
      throw new WizardSafetyError(
        `${art.title} is ${art.persona.name}'s collection and there is no wallet for ${art.wizard} in this run. ` +
          'A collection is listed by the wizard that minted it or not at all.'
      );
    }

    for (const row of queue) {
      const reason = io.killSwitch(env);
      if (reason) {
        throw new RunHalt('kill-switch', `kill switch engaged (${reason}) before listing ${row.label}. The run stops here.`, {
          key: row.key
        });
      }

      // The collection-level cap, which no single market run can see. The
      // escrowed budget plus one miner fee is what a listing commits; the
      // market run then applies its own per-run cap underneath this one.
      assertRunSpendCap({
        committedUstx,
        plannedSpendUstx: BigInt(feeBudgetUstx) + BigInt(passThrough.minerFeeUstx ?? 30_000n),
        runSpendCapUstx,
        label: `listing ${row.label}`
      });

      io.say(`\n  listing ${row.label} (#${row.inscriptionId}) at ${row.priceLabel} on the ${plan.market.label}`);
      const outcome = await runMarketScenarios({
        ports: io,
        options: {
          ...passThrough,
          runId: row.runId,
          scenarios: [plan.scenarioId],
          broadcast,
          env,
          wallets,
          tokens: { [plan.scenarioId]: row.inscriptionId },
          sellerId: art.wizard,
          // This sweep lists for real. The zero-balance assertion belongs to
          // the list-sbtc/list-usdcx PROOF, and a wizard that has earned some
          // of the payment token must still be able to sell more of its work.
          proveZeroTokenBalance: false,
          priceUstx: row.askUstx,
          feeBudgetUstx,
          runSpendCapUstx
        }
      });

      committedUstx += outcome.committedUstx;
      const scenario = outcome.scenarios.find((entry) => entry.id === plan.scenarioId) ?? null;
      results.push({
        key: row.key,
        index: row.index,
        label: row.label,
        inscriptionId: row.inscriptionId,
        priceAmount: row.priceAmount,
        priceLabel: row.priceLabel,
        askUstx: row.askUstx,
        runId: row.runId,
        status: scenario?.status ?? 'not-run',
        summary: scenario?.summary ?? null,
        reason: scenario?.reason ?? null,
        listingId: scenario?.listingId ?? null,
        txid: scenario?.txid ?? null,
        journalPath: outcome.journalPath
      });

      if (outcome.halted) {
        throw new RunHalt(outcome.halted.reason, `listing ${row.label}: ${outcome.halted.message}`, outcome.halted.detail);
      }
      if (scenario?.status === 'failed') {
        throw new RunHalt(
          'tx-failed',
          `listing ${row.label} (#${row.inscriptionId}) failed: ${scenario.reason ?? 'no reason recorded'}. The ` +
            'sweep stops here and nothing later is attempted.',
          { key: row.key }
        );
      }
    }
  } catch (error) {
    if (error instanceof RunHalt || error instanceof WizardSafetyError) {
      halted = {
        reason: error instanceof RunHalt ? error.reason : 'safety',
        message: error.message,
        detail: error instanceof RunHalt ? error.detail : {}
      };
    } else {
      throw error;
    }
  }

  return {
    ok: halted === null && results.every((row) => row.status === 'passed'),
    halted,
    collectionId: art.id,
    collectionTitle: art.title,
    wizard: art.wizard,
    wizardName: art.persona.name,
    market: plan.market.key,
    mode: broadcast ? 'broadcast' : 'dry',
    broadcast,
    plan,
    rows: results,
    committedUstx,
    runSpendCapUstx: BigInt(runSpendCapUstx)
  };
}

/* ------------------------------------------------------------------ */
/* rendering                                                           */
/* ------------------------------------------------------------------ */

const pad = (value, width) => String(value ?? '').padEnd(width);

/** The listing plan as a table plus the handoff commands. Pure string building. */
export function formatCollectionListingPlan(plan, { broadcast = false } = {}) {
  const lines = [];
  lines.push(
    broadcast
      ? `--- listing ${plan.collectionId} (BROADCAST — every row below is a real transaction) ---`
      : `--- listing ${plan.collectionId} (DRY RUN) ---`
  );
  lines.push(`collection : ${plan.collectionTitle}, by ${plan.wizardName}`);
  lines.push(`market     : ${plan.market.label}  ${plan.market.contractId}`);
  lines.push(`seller     : ${plan.wizard}  (the wizard that minted it; this cannot be overridden)`);
  lines.push(`fee budget : ${groupDigits(plan.feeBudgetUstx)} microSTX escrowed per listing, in STX, refunded on cancel`);
  lines.push('');
  lines.push(`  ${pad('#', 5)}${pad('piece', 18)}${pad('id', 10)}${pad('ask', 20)}status`);
  for (const row of plan.rows) {
    lines.push(
      `  ${pad(row.index ?? 'man', 5)}${pad(row.label, 18)}` +
        `${pad(row.inscriptionId ? `#${row.inscriptionId}` : '—', 10)}${pad(row.priceLabel, 20)}` +
        `${row.inscriptionId ? 'ready' : 'not minted yet, or no id supplied'}`
    );
  }
  lines.push('');
  lines.push(
    `${plan.listable.length} of ${plan.rows.length} listable. Escrowed if all of them list: ` +
      `${groupDigits(plan.escrowUstx)} microSTX (${microStxToStx(plan.escrowUstx)} STX), refundable. Asking a ` +
      `total of ${groupDigits(plan.totalAskUstx)} microSTX (${microStxToStx(plan.totalAskUstx)} STX), which is a ` +
      'price and not a prediction.'
  );
  lines.push('');
  lines.push(`why this price: ${plan.reasoning}`);
  if (plan.missing.length > 0) {
    lines.push('');
    lines.push(
      `not listable yet: ${plan.missing.map((row) => row.label).join(', ')}. Mint them first, or pass --ids.`
    );
  }
  lines.push('');
  lines.push('Each row is runnable on its own against the same code path:');
  for (const row of plan.listable) lines.push(`  ${row.command}`);
  return lines.join('\n');
}

/** The sweep report. Pure string building. */
export function formatCollectionListingReport(result) {
  const lines = [''];
  lines.push(
    result.broadcast
      ? `--- listed ${result.collectionId} on the ${result.market} market (BROADCAST) ---`
      : `--- listed ${result.collectionId} on the ${result.market} market (DRY RUN — nothing signed, nothing sent) ---`
  );
  for (const row of result.rows) {
    lines.push(
      `  ${pad(row.index ?? 'man', 5)}${pad(row.label, 18)}${pad(`#${row.inscriptionId}`, 10)}` +
        `${pad(row.priceLabel, 20)}${pad(row.status, 9)}${row.listingId ? `listing ${row.listingId}` : ''}`
    );
    if (row.reason) lines.push(`         ${row.reason}`);
  }
  lines.push('');
  lines.push(
    `committed: ${groupDigits(result.committedUstx)} microSTX (${microStxToStx(result.committedUstx)} STX) of a ` +
      `sweep cap of ${groupDigits(result.runSpendCapUstx)}. Most of that is escrowed fee budget and comes back on ` +
      'a cancel.'
  );
  if (result.halted) {
    lines.push('');
    lines.push(`HALTED (${result.halted.reason})`);
    for (const line of String(result.halted.message).split('\n')) lines.push(`  ${line}`);
  } else {
    lines.push('');
    lines.push(
      result.broadcast
        ? `${result.collectionTitle} is listed. Nothing has been bought; a listing is an offer.`
        : 'Dry run complete. Nothing was signed and nothing was sent.'
    );
  }
  return lines.join('\n');
}
