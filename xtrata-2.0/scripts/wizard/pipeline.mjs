#!/usr/bin/env node
/**
 * pipeline.mjs — take the fleet from nothing on chain to a complete, listed
 * body of work, in one command.
 *
 * REHEARSAL BY DEFAULT. With no flags this runs the whole pipeline against a
 * chain that lives in memory: no key is read, nothing is signed, nothing is
 * sent, and the fake chain throws on any URL it does not recognise, so
 * "nothing was broadcast" is a checkable property rather than an assurance.
 * `--broadcast` is the only thing that spends.
 *
 * The rehearsal is not a dry run. A dry run mints nothing, so there are no ids,
 * so there is nothing to read back, so every gate is skipped -- and the gates
 * are the only thing standing between the fleet and a permanent manifest citing
 * the wrong plate. The rehearsal runs the real loop against a fake chain, so
 * every gate fires. See pipeline-rehearse.mjs.
 *
 * Seven stages, in the only order the dependency graph permits:
 *
 *   personas (3)  ->  plates (24)  ->  manifests (3)  ->  marks (3)
 *                 ->  arms (1)     ->  page (1)       ->  listings
 *
 * 35 inscriptions. Each stage is verified against the chain before the next one
 * starts, and a gate that fails halts the run rather than skipping ahead.
 *
 * See what it would cost, without touching anything:
 *   node scripts/wizard/pipeline.mjs --cost
 *
 * Rehearse the whole thing against a chain in memory:
 *   node scripts/wizard/pipeline.mjs
 *
 * Where the real run has got to, reconciled against mainnet:
 *   node scripts/wizard/pipeline.mjs --status
 *
 * One stage at a time, which is how the first real run should go:
 *   node scripts/wizard/pipeline.mjs --to personas --broadcast
 *   node scripts/wizard/pipeline.mjs --from plates --to plates --broadcast
 *
 * Really do all of it (real mainnet transactions, real STX, irreversible):
 *   node scripts/wizard/pipeline.mjs --broadcast
 *
 * The kill switch is a file: `touch scripts/wizard/KILL` stops the run between
 * steps, never mid-transaction.
 *
 * See docs/plans/WIZARD-RELEASE-RUNBOOK.md.
 */

import { pathToFileURL } from 'node:url';

import {
  DEFAULT_BALANCE_FLOOR_USTX,
  DEFAULT_HIRO_URL,
  DEFAULT_MAX_TX_FEE_USTX,
  DEFAULT_SPEND_CAP_USTX,
  WizardSafetyError,
  formatPlan,
  killSwitchEngaged,
  loadWizardEnv
} from './inscribe.mjs';
import { journalPorts, liveSubmit, walletsFor } from './run-thread.mjs';
import {
  DEFAULT_RUN_SPEND_CAP_USTX,
  STAGE_IDS,
  TOTAL_MINTS,
  costModel,
  formatCostModel,
  formatPipelineReport,
  formatPipelineStatus,
  microStxToStx,
  pipelineStatusReport,
  runPipeline
} from './pipeline-core.mjs';
import { REHEARSAL_WALLETS, makeFakeChain, makeFastClock, makeMemoryJournal } from './pipeline-rehearse.mjs';

const USAGE = `
pipeline.mjs — the whole fleet, from three roots to twenty-four listings.

  (no flags)              rehearse everything against a chain in memory
  --broadcast             really mint, on mainnet, irreversibly
  --status                what is on chain now, reconciled against the journal
  --cost                  what the run commits, per wallet, without touching anything

  --from <stage>          start at this stage   (default ${STAGE_IDS[0]})
  --to <stage>            stop after this stage (default ${STAGE_IDS[STAGE_IDS.length - 1]})
  --run-id <id>           journal name (default fleet)

  --run-spend-cap-ustx N  halt before the broadcast that crosses this (default ${DEFAULT_RUN_SPEND_CAP_USTX})
  --spend-cap-ustx N      per-transaction cap
  --balance-floor-ustx N  refuse to take a wallet below this
  --miner-fee-ustx N      miner bid per transaction (default ${DEFAULT_MAX_TX_FEE_USTX})
  --hiro-url URL          API base (default ${DEFAULT_HIRO_URL})

  stages: ${STAGE_IDS.join(', ')}
`.trim();

const parseArgs = (argv) => {
  const args = { flags: new Set(), values: {} };
  for (let at = 0; at < argv.length; at += 1) {
    const token = argv[at];
    if (!token.startsWith('--')) throw new WizardSafetyError(`unexpected argument "${token}"`);
    const name = token.slice(2);
    const takesValue = [
      'from',
      'to',
      'run-id',
      'run-spend-cap-ustx',
      'spend-cap-ustx',
      'balance-floor-ustx',
      'miner-fee-ustx',
      'hiro-url'
    ].includes(name);
    if (takesValue) {
      const value = argv[at + 1];
      if (value === undefined || value.startsWith('--')) {
        throw new WizardSafetyError(`--${name} needs a value`);
      }
      args.values[name] = value;
      at += 1;
    } else {
      args.flags.add(name);
    }
  }
  return args;
};

const requireStage = (value, label) => {
  if (value === undefined) return undefined;
  if (!STAGE_IDS.includes(value)) {
    throw new WizardSafetyError(`--${label} "${value}" is not a stage. Stages: ${STAGE_IDS.join(', ')}`);
  }
  return value;
};

/**
 * Ports for a rehearsal.
 *
 * The journal is in memory, not on disk, so a rehearsal cannot leave behind a
 * file a real run might later resume from. That is a stronger guarantee than
 * the `.dry` filename suffix, which only makes the confusion unlikely.
 */
const rehearsalPorts = ({ say }) => {
  const chain = makeFakeChain();
  const journal = makeMemoryJournal();
  const clock = makeFastClock();
  return {
    chain,
    ports: {
      fetchImpl: chain.fetchImpl,
      submit: chain.submit,
      readJournal: journal.readJournal,
      writeJournal: journal.writeJournal,
      killSwitch: killSwitchEngaged,
      now: clock.now,
      sleep: clock.sleep,
      say
    }
  };
};

async function main(argv) {
  if (argv.includes('--help') || argv.includes('-h')) {
    console.log(USAGE);
    return 0;
  }

  const args = parseArgs(argv);
  const broadcast = args.flags.has('broadcast');
  const env = loadWizardEnv();
  const hiroUrl = args.values['hiro-url'] ?? DEFAULT_HIRO_URL;
  const runId = args.values['run-id'] ?? 'fleet';

  if (args.flags.has('cost')) {
    console.log(formatCostModel(costModel({ minerFeeUstx: BigInt(args.values['miner-fee-ustx'] ?? DEFAULT_MAX_TX_FEE_USTX) })));
    return 0;
  }

  if (args.flags.has('status')) {
    const wallets = walletsFor({ env, broadcast: true });
    const report = await pipelineStatusReport({
      ports: { fetchImpl: globalThis.fetch, ...journalPorts() },
      options: { runId, hiroUrl, wallets }
    });
    console.log(formatPipelineStatus(report));
    return report.stages.some((stage) => stage.status === 'failed') ? 1 : 0;
  }

  const options = {
    runId,
    broadcast,
    from: requireStage(args.values.from, 'from') ?? STAGE_IDS[0],
    to: requireStage(args.values.to, 'to') ?? STAGE_IDS[STAGE_IDS.length - 1],
    hiroUrl,
    env,
    runSpendCapUstx: BigInt(args.values['run-spend-cap-ustx'] ?? DEFAULT_RUN_SPEND_CAP_USTX),
    spendCapUstx: BigInt(args.values['spend-cap-ustx'] ?? DEFAULT_SPEND_CAP_USTX),
    balanceFloorUstx: BigInt(args.values['balance-floor-ustx'] ?? DEFAULT_BALANCE_FLOOR_USTX),
    minerFeeUstx: BigInt(args.values['miner-fee-ustx'] ?? DEFAULT_MAX_TX_FEE_USTX)
  };

  const say = (line) => console.log(line);

  /**
   * Refuse a run that cannot finish, before it starts.
   *
   * The cap is also checked before every individual broadcast, which is what
   * stops an overspend. Checking it here as well stops something different and
   * worse: a run that gets three stages in, trips the cap, and leaves the fleet
   * holding twenty-seven inscriptions that no manifest cites and no page
   * indexes. Halfway through a permanent graph is the one place not to stop.
   *
   * Applies to the rehearsal too. A rehearsal that completes under a cap the
   * real run would trip is a rehearsal of a different run.
   */
  const plannedUstx = costModel({ minerFeeUstx: options.minerFeeUstx }).totalMintSpentUstx;
  if (plannedUstx > options.runSpendCapUstx) {
    throw new WizardSafetyError(
      `the full run spends ${microStxToStx(plannedUstx)} STX and the run cap is ` +
        `${microStxToStx(options.runSpendCapUstx)} STX, so it would halt partway and leave the graph ` +
        'incomplete.\n' +
        `  --run-spend-cap-ustx ${plannedUstx}    to allow the whole run\n` +
        '  --to <stage>                        to run less of it\n' +
        'The cap is deliberately not raised for you.'
    );
  }

  if (!broadcast) {
    console.log('REHEARSAL. A chain in memory. Nothing is signed, nothing is sent, and the fake');
    console.log('chain throws on any URL it does not recognise. Every gate still fires.');
    console.log('');
    const { chain, ports } = rehearsalPorts({ say });
    // A rehearsal needs a key-shaped value because assertBroadcastAllowed
    // refuses without one -- which is a rail worth keeping. All ones, so a
    // value that ever escaped into a log is unmistakably synthetic.
    const wallets = Object.fromEntries(
      Object.entries(REHEARSAL_WALLETS).map(([wizard, wallet]) => [
        wizard,
        { ...wallet, key: `${'11'.repeat(32)}01` }
      ])
    );
    const result = await runPipeline({
      ports,
      options: { ...options, broadcast: true, wallets, runId: 'rehearsal' }
    });
    console.log('');
    console.log(formatPipelineReport(result));
    console.log('');
    console.log(
      `rehearsed ${chain.state.broadcasts}/${TOTAL_MINTS} mints against ${chain.state.calls.length} reads. ` +
        'Nothing left this process.'
    );
    // The report prints a journal path because that is what the run computed.
    // No such file exists: a rehearsal keeps its journal in memory so it cannot
    // leave behind something a real run might later resume from. Saying so is
    // cheaper than someone going to look for it.
    console.log('The journal path above is where a real run would write. This one wrote nothing to disk.');
    return result.ok ? 0 : 1;
  }

  const wallets = walletsFor({ env, broadcast: true });
  const missing = Object.entries(wallets)
    .filter(([, wallet]) => !wallet.key)
    .map(([wizard]) => `WIZARD_KEY_${wizard.toUpperCase()}`);
  if (missing.length > 0) {
    throw new WizardSafetyError(
      `refusing to broadcast: ${missing.join(', ')} ${missing.length === 1 ? 'is' : 'are'} not set. Every wizard ` +
        'pays for its own work out of its own wallet, so a run missing one key would either stop halfway or ' +
        'put the wrong creator on chain permanently.'
    );
  }

  const model = costModel({ minerFeeUstx: options.minerFeeUstx });
  console.log('BROADCASTING. Real mainnet transactions, real STX, irreversible.');
  console.log('');
  console.log(formatCostModel(model));
  console.log('');
  console.log(`run spend cap: ${microStxToStx(options.runSpendCapUstx)} STX`);
  if (model.totalMintSpentUstx > options.runSpendCapUstx) {
    throw new WizardSafetyError(
      `the run would spend ${microStxToStx(model.totalMintSpentUstx)} STX and the run cap is ` +
        `${microStxToStx(options.runSpendCapUstx)} STX. Raise --run-spend-cap-ustx deliberately, or run fewer ` +
        'stages with --to. The cap is checked here as well as before each broadcast so a run that cannot finish ' +
        'does not start and strand the fleet halfway through a graph.'
    );
  }
  console.log('');

  const result = await runPipeline({
    ports: {
      fetchImpl: globalThis.fetch,
      submit: liveSubmit({ hiroUrl }),
      ...journalPorts(),
      killSwitch: killSwitchEngaged,
      now: () => Date.now(),
      sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
      say,
      presentPlan: (plan) => console.log(formatPlan(plan, { broadcast: true }))
    },
    options: { ...options, wallets }
  });

  console.log('');
  console.log(formatPipelineReport(result));
  return result.ok ? 0 : 1;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main(process.argv.slice(2))
    .then((code) => {
      process.exitCode = code;
    })
    .catch((error) => {
      console.error(error instanceof WizardSafetyError ? `refused: ${error.message}` : error);
      process.exitCode = 1;
    });
}

export { main, parseArgs };
