#!/usr/bin/env node
/**
 * provision.mjs — the gated provisioning canary for the wizard fleet.
 *
 * Run this before any wizard wallet is funded. It is the only guard on the one
 * irreversible step in the whole system: STX sent to a wrong address is gone,
 * there is no contract-level escape hatch, and a phrase written down wrong is
 * silent until the day the wallet is needed.
 *
 * Seven stages, in order, each gated on the one before:
 *
 *   1. Generate           three fresh wallets, then type two words of each
 *                         phrase back from memory of the paper you just wrote
 *   2. Record             a paste-ready .env.wizards block, saved by you
 *   3. Verify derivation  recorded address == key-derived == phrase-derived
 *   4. Pre-funding        mainnet, distinct, not a project wallet, zero balance
 *   5. Funding            print the targets, then watch until the money lands
 *   6. Baseline           confirmed balances, chain tip, timestamp
 *   7. Dry-run gate       the existing inscribe dry run has to pass
 *
 * Usage:
 *   node scripts/wizard/provision.mjs              # the real gated run
 *   node scripts/wizard/provision.mjs --dry        # fakes, no network, no prompts (CI)
 *   node scripts/wizard/provision.mjs --verify-only  # stage 3 alone, as a health check
 *   node scripts/wizard/provision.mjs --report out.json
 *
 * What it never does, in any mode:
 *   - sign, send or broadcast anything
 *   - move a microSTX (stage 5 observes; a human sends)
 *   - write a key or a phrase to disk, including into the report
 *   - create .env.wizards, which is yours and is gitignored
 */

import { spawn } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { WIZARD_DERIVATION_PATH, generateFleet } from './make-wizards.mjs';
import { DEFAULT_HIRO_URL, killSwitchEngaged } from './inscribe.mjs';
import {
  DEFAULT_FUND_USTX,
  DEFAULT_POLL_INTERVAL_MS,
  DEFAULT_FUNDING_TIMEOUT_MS,
  PROVISION_STAGES,
  WizardSafetyError,
  describeChallenge,
  formatReport,
  groupDigits,
  makeBalanceReader,
  microStxToStx,
  newChallengeSeed,
  parseEnvFile,
  readChainTip,
  recordsFromEnv,
  runProvisioning,
  verifyDerivation
} from './provision-core.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const ENV_FILE = join(HERE, '.env.wizards');

/**
 * Kept repo-relative, not absolute: children are spawned with cwd at the repo
 * root, and the command that lands in the report should be one a reader can
 * paste into their own checkout.
 */
const INSCRIBE_PATH = 'scripts/wizard/inscribe.mjs';

/* ------------------------------------------------------------------ */
/* argv                                                                */
/* ------------------------------------------------------------------ */

const arg = (name, fallback = null) => {
  const index = process.argv.indexOf(`--${name}`);
  if (index === -1) return fallback;
  const value = process.argv[index + 1];
  return value && !value.startsWith('--') ? value : true;
};
const flag = (name) => arg(name) === true;

const rule = (char = '-') => char.repeat(78);
const say = (line = '') => console.log(line);

/* ------------------------------------------------------------------ */
/* prompting                                                           */
/* ------------------------------------------------------------------ */

function makePrompt() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ask = (question) => new Promise((resolve) => rl.question(question, (answer) => resolve(String(answer ?? ''))));
  ask.close = () => rl.close();
  return ask;
}

/* ------------------------------------------------------------------ */
/* the real ports                                                      */
/* ------------------------------------------------------------------ */

function livePorts({ ask, hiroUrl }) {
  const fetchBalance = makeBalanceReader({ hiroUrl });
  return {
    generateFleet: () => generateFleet(),
    newSeed: () => newChallengeSeed(),
    fetchBalance,
    readChainTip: () => readChainTip({ hiroUrl }),
    now: () => Date.now(),
    sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),

    presentFleet: ({ fleet, seed, challenges }) => {
      say('');
      say(rule('='));
      say('  STAGE 1 / 7  GENERATE');
      say(rule('='));
      say('');
      say('  Three fresh mainnet wallets. This is the only time they are shown, and');
      say('  nothing here is written to disk. Write the phrases down on paper now.');
      say('');
      for (const wizard of fleet) {
        say(`  ${wizard.name}`);
        say(`    address : ${wizard.address}`);
        say(`    phrase  : ${wizard.mnemonic}`);
        say(`    key     : ${wizard.privateKey}`);
        say('');
      }
      say(`  Phrases derive these keys at ${WIZARD_DERIVATION_PATH}, the first-account path`);
      say('  Leather and Xverse use, so any of them imports into a normal wallet.');
      say('');
      say(rule());
      say(`  TRANSCRIPTION CHECK. challenge seed: ${seed}`);
      say(rule());
      say('  Read the words off the paper you just wrote, not off this screen. That is');
      say('  the entire point: this catches a phrase transcribed wrong, which is silent');
      say('  until the day the wallet is needed.');
      say('');
      for (const challenge of challenges) say(`    ${challenge.wizardId}: ${describeChallenge(challenge)}`);
      say('');
    },

    askTranscription: async ({ wizard, challenge, asked }) => {
      const answers = [];
      for (const position of challenge.positions) {
        const answer = await ask(`  ${wizard.name} — ${asked}. Word ${position}: `);
        answers.push(answer);
      }
      return answers;
    },

    presentEnvBlock: ({ block }) => {
      say('');
      say(rule('='));
      say('  STAGE 2 / 7  RECORD');
      say(rule('='));
      say('');
      say('  Paste-ready block for scripts/wizard/.env.wizards. That file is gitignored');
      say('  and this script will not create it: a script that writes a live key to disk');
      say('  is the thing this whole design avoids.');
      say('');
      say(rule());
      process.stdout.write(block);
      say(rule());
      say('');
    },

    presentDerivation: (verdict) => {
      say('');
      say(rule('='));
      say('  STAGE 3 / 7  VERIFY DERIVATION');
      say(rule('='));
      say('');
      for (const result of verdict.results) {
        say(`  ${result.name}`);
        say(`    recorded      : ${result.recordedAddress}`);
        say(`    from the key  : ${result.keyDerivedAddress ?? 'could not derive'}`);
        say(`    from the phrase: ${result.phraseChecked ? result.phraseDerivedAddress : 'not supplied'}`);
        say(`    agree         : ${result.ok ? 'yes' : 'NO'}`);
        say('');
      }
    },

    presentPreFunding: (verdict) => {
      say('');
      say(rule('='));
      say('  STAGE 4 / 7  PRE-FUNDING CHECK');
      say(rule('='));
      say('');
      for (const balance of verdict.balances) {
        say(`  ${balance.address}  balance ${groupDigits(balance.balanceUstx)} microSTX`);
      }
      if (verdict.ok) say('  All three are well-formed mainnet, distinct, not a project wallet, and empty.');
      say('');
    },

    presentFundingTargets: ({ targets, expectedUstx }) => {
      say('');
      say(rule('='));
      say('  STAGE 5 / 7  FUNDING');
      say(rule('='));
      say('');
      say(`  Send ${microStxToStx(expectedUstx)} STX (${groupDigits(expectedUstx)} microSTX) to each address below.`);
      say('  This script sends nothing. It watches. If you mistype an address into your');
      say('  wallet, that STX is gone and the only symptom you will get is this stage');
      say('  never completing.');
      say('');
      for (const target of targets) {
        say(`  ${target.name}   ${microStxToStx(target.expectedUstx)} STX`);
        say(`  ${target.address}`);
        say('');
      }
    },

    onPoll: ({ poll, elapsedMs, results }) => {
      const summary = results
        .map((result) => `${result.address.slice(0, 6)}…${result.address.slice(-4)} ${microStxToStx(result.balanceUstx)}`)
        .join('   ');
      say(`  poll ${poll} (${Math.round(elapsedMs / 1000)}s): ${summary}`);
    },

    confirm: async ({ question, expect }) => {
      const answer = await ask(`\n  ${question} > `);
      return answer.trim().toUpperCase() === String(expect).toUpperCase();
    },

    runGate: async (argv) => {
      say('');
      say(rule('='));
      say('  STAGE 7 / 7  DRY-RUN GATE');
      say(rule('='));
      say('');
      say(`  node ${argv.join(' ')}`);
      say('');
      return runChild(argv);
    }
  };
}

/** Run the inscribe dry run as a child. It gets no key, and no --broadcast. */
function runChild(argv, { env = {} } = {}) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, argv, {
      cwd: ROOT,
      env: { ...process.env, ...env },
      stdio: ['ignore', 'pipe', 'pipe']
    });
    let stderr = '';
    child.stdout.on('data', () => {});
    child.stderr.on('data', (chunk) => {
      stderr += String(chunk);
    });
    child.on('error', (error) => resolve({ exitCode: 1, stderr: error.message }));
    child.on('close', (code) => resolve({ exitCode: code, stderr }));
  });
}

/* ------------------------------------------------------------------ */
/* the fake ports, for --dry                                           */
/* ------------------------------------------------------------------ */

/**
 * --dry runs all seven stages against fakes: a deterministic fleet, a ledger
 * that starts empty and is credited between polls, a frozen clock, a no-op
 * sleep, and answers typed by nobody. No network, no prompts, no funds.
 *
 * The one thing it does for real is stage 7, which shells out to the actual
 * inscribe dry run with --offline. That needs no network and no key, and it
 * means the child-process wiring is exercised rather than mocked.
 */
function dryPorts({ fundUstx }) {
  const fleet = generateFleet();
  const ledger = new Map(fleet.map((wizard) => [wizard.address, 0n]));
  let clock = Date.UTC(2026, 6, 30, 12, 0, 0);

  return {
    generateFleet: () => fleet,
    newSeed: () => 'dry000000000000000000000000000000',
    fetchBalance: async (address) => ledger.get(address) ?? 0n,
    readChainTip: async () => 8_700_000n,
    now: () => (clock += 1_000),
    sleep: async () => {
      // The money "arrives" between the first and second poll, so the poll loop
      // is exercised rather than short-circuited.
      for (const address of ledger.keys()) ledger.set(address, BigInt(fundUstx));
    },

    presentFleet: ({ fleet: generated, seed }) => {
      say(`  [dry] stage 1: generated ${generated.length} wallets, challenge seed ${seed}`);
    },
    askTranscription: async ({ wizard, challenge }) => {
      const words = wizard.mnemonic.split(' ');
      return challenge.positions.map((position) => words[position - 1]);
    },
    presentEnvBlock: ({ fleet: generated }) => say(`  [dry] stage 2: env block for ${generated.length} wizards, not written`),
    presentDerivation: (verdict) => say(`  [dry] stage 3: ${verdict.results.length} wallets, sources agree: ${verdict.ok}`),
    presentPreFunding: (verdict) => say(`  [dry] stage 4: ${verdict.checked} addresses checked, all empty: ${verdict.ok}`),
    presentFundingTargets: ({ targets, expectedUstx }) =>
      say(`  [dry] stage 5: watching ${targets.length} addresses for ${groupDigits(expectedUstx)} microSTX each`),
    onPoll: ({ poll, results }) =>
      say(`  [dry] poll ${poll}: ${results.map((result) => microStxToStx(result.balanceUstx)).join(' / ')} STX`),
    confirm: async ({ expect }) => {
      say(`  [dry] auto-confirming "${expect}"`);
      return true;
    },
    runGate: async (argv) => {
      say(`  [dry] stage 7: node ${argv.join(' ')}`);
      return runChild(argv);
    }
  };
}

/* ------------------------------------------------------------------ */
/* the standalone health check                                         */
/* ------------------------------------------------------------------ */

/** Read .env.wizards if it exists, without ever writing it. */
function loadWizardEnv() {
  const fromFile = existsSync(ENV_FILE) ? parseEnvFile(readFileSync(ENV_FILE, 'utf8')) : {};
  return { ...fromFile, ...process.env };
}

function verifyOnly() {
  const { records, missing } = recordsFromEnv(loadWizardEnv());
  say('');
  say(rule('='));
  say('  DERIVATION HEALTH CHECK (stage 3 only, read-only, provisions nothing)');
  say(rule('='));
  say('');
  if (records.length === 0) {
    say('  No wizard keys found. Set WIZARD_KEY_<WIZARD> and WIZARD_ADDRESS_<WIZARD>, or');
    say(`  fill in ${relative(ROOT, ENV_FILE)}, then run this again.`);
    return 1;
  }
  if (missing.length > 0) say(`  not configured: ${missing.join(', ')}`);
  const verdict = verifyDerivation(records);
  for (const result of verdict.results) {
    say('');
    say(`  ${result.name}`);
    say(`    recorded       : ${result.recordedAddress}`);
    say(`    from the key   : ${result.keyDerivedAddress ?? 'could not derive'}`);
    say(`    from the phrase: ${result.phraseChecked ? result.phraseDerivedAddress : 'not supplied'}`);
    say(`    agree          : ${result.ok ? 'yes' : 'NO'}`);
  }
  say('');
  for (const note of verdict.notes) say(`  note: ${note}`);
  for (const problem of verdict.problems) say(`  ! ${problem}`);
  say('');
  say(verdict.ok ? '  Every recorded address matches the key filed under it.' : '  MISMATCH. Do not fund or spend from this fleet.');
  return verdict.ok ? 0 : 1;
}

/* ------------------------------------------------------------------ */
/* cli                                                                 */
/* ------------------------------------------------------------------ */

function usage() {
  say('provision.mjs — the gated provisioning canary for the wizard fleet.');
  say('');
  for (const stage of PROVISION_STAGES) say(`  ${stage.number}. ${stage.title.padEnd(20)} ${stage.summary}`);
  say('');
  say('  --dry              run all seven stages against fakes: no network, no prompts');
  say('  --verify-only      stage 3 alone, from .env.wizards, as a health check');
  say('  --fund-ustx <n>    target per wizard (default ' + groupDigits(DEFAULT_FUND_USTX) + ')');
  say('  --timeout-minutes <n>  how long stage 5 watches before offering to re-poll');
  say('  --poll-seconds <n>     gap between balance reads');
  say('  --report <path>    write the JSON report (it contains no keys and no phrases)');
  say('  --hiro <url>       Hiro endpoint for the two read-only lookups');
  say('');
  say('  See scripts/wizard/README.md.');
}

async function main() {
  if (flag('help')) {
    usage();
    return 0;
  }
  if (flag('verify-only')) return verifyOnly();

  const killReason = killSwitchEngaged();
  if (killReason) {
    throw new WizardSafetyError(
      `kill switch engaged (${killReason}). Provisioning ends in funding a mainnet wallet, so it does not run while the fleet is halted.`
    );
  }

  const dry = flag('dry');
  const fundUstx = BigInt(arg('fund-ustx', String(DEFAULT_FUND_USTX)));
  const hiroUrl = typeof arg('hiro') === 'string' ? arg('hiro') : DEFAULT_HIRO_URL;
  const timeoutMs = arg('timeout-minutes') ? Number(arg('timeout-minutes')) * 60_000 : DEFAULT_FUNDING_TIMEOUT_MS;
  const intervalMs = arg('poll-seconds') ? Number(arg('poll-seconds')) * 1_000 : DEFAULT_POLL_INTERVAL_MS;
  const reportPath = typeof arg('report') === 'string' ? arg('report') : null;

  const ask = dry ? null : makePrompt();
  const ports = dry ? dryPorts({ fundUstx }) : livePorts({ ask, hiroUrl });

  if (dry) {
    say('');
    say(rule('='));
    say('  WIZARD PROVISIONING — DRY MODE');
    say(rule('='));
    say('  Injected fakes end to end. No network, no prompts, no funds, no real wallets');
    say('  recorded anywhere. This is the CI shape of the run.');
    say('');
  }

  try {
    const { complete, report } = await runProvisioning({
      ports,
      options: {
        mode: dry ? 'dry' : 'live',
        fundUstx,
        timeoutMs,
        intervalMs,
        offlineGate: dry,
        scriptPath: INSCRIBE_PATH
      }
    });

    say('');
    say(formatReport(report));

    if (reportPath) {
      writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
      say(`\n  wrote the report to ${reportPath}`);
    }
    if (!complete) {
      say('');
      say('  Provisioning is NOT complete. Do not fund, spend from, or trust this fleet.');
      return 1;
    }
    say('');
    say('  Next: npm run wizards:dry, then read scripts/wizard/README.md before --broadcast.');
    return 0;
  } finally {
    ask?.close();
  }
}

const isDirectRun = Boolean(process.argv[1]) && pathToFileURL(process.argv[1]).href === import.meta.url;
if (isDirectRun) {
  main()
    .then((code) => {
      process.exitCode = code ?? 0;
    })
    .catch((error) => {
      console.error(`\n${error?.name === 'WizardSafetyError' ? error.message : error}`);
      process.exitCode = 1;
    });
}

export { runChild, verifyOnly };
