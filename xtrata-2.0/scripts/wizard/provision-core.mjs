/**
 * provision-core.mjs — the provisioning canary, minus the terminal.
 *
 * Provisioning is the one irreversible step in the wizard fleet. Everything
 * else in scripts/wizard is a dry run by default, refuses without a live quote,
 * and is bounded by a spend cap. Funding is none of those things: STX sent to a
 * mistyped address is gone, there is no contract to appeal to, and the mistake
 * is silent until the day the wallet is needed.
 *
 * So funding is gated. Seven stages, in order, each one has to pass before the
 * next unlocks, and the run halts at the first failure rather than carrying a
 * bad address forward.
 *
 * Everything here is pure or takes its I/O by injection: the prompt, the
 * balance reader, the clock, the sleep, the child process that runs the gate.
 * There is no terminal in this file and no direct network call, so every stage
 * is unit-testable.
 *
 * This module observes. It never signs, never sends a transaction, never moves
 * a satoshi of STX, and never writes key material anywhere. Stage 5 watches
 * balances arrive; it does not make them arrive.
 */

import { randomBytes } from 'node:crypto';
import { sha256 } from '@noble/hashes/sha256';
import { TransactionVersion, getAddressFromPrivateKey, validateStacksAddress } from '@stacks/transactions';

import { addressEnvName, keyEnvName, keyFromMnemonic } from './make-wizards.mjs';
import { PERSONAS } from './personas.mjs';
import {
  DEFAULT_HIRO_URL,
  WizardSafetyError,
  fetchChainTip,
  fetchStxBalance,
  groupDigits,
  microStxToStx
} from './inscribe.mjs';

export { DEFAULT_HIRO_URL, WizardSafetyError, groupDigits, microStxToStx };

export const REPORT_VERSION = 1;

/* ------------------------------------------------------------------ */
/* the stages                                                          */
/* ------------------------------------------------------------------ */

/**
 * The gate. Ordered, and the order is the point: nothing about funding is
 * checked until the phrases have been proven transcribable, and nothing is
 * funded until the addresses have been proven fresh.
 */
export const PROVISION_STAGES = [
  {
    id: 'generate',
    number: 1,
    title: 'Generate',
    summary: 'Three fresh wallets, printed once, then a transcription check on every phrase.'
  },
  {
    id: 'record',
    number: 2,
    title: 'Record',
    summary: 'A paste-ready .env.wizards block. The operator writes the file, never this script.'
  },
  {
    id: 'verify-derivation',
    number: 3,
    title: 'Verify derivation',
    summary: 'Recorded address, key-derived address and phrase-derived address must all agree.'
  },
  {
    id: 'pre-funding',
    number: 4,
    title: 'Pre-funding check',
    summary: 'Well-formed mainnet, mutually distinct, no collision with a project wallet, zero balance.'
  },
  {
    id: 'funding',
    number: 5,
    title: 'Funding',
    summary: 'Print the targets, then watch until the money lands. This stage moves nothing.'
  },
  {
    id: 'baseline',
    number: 6,
    title: 'Baseline',
    summary: 'Record the confirmed starting balances, the chain tip and the time, so spend reconciles later.'
  },
  {
    id: 'dry-run-gate',
    number: 7,
    title: 'Dry-run gate',
    summary: 'The existing inscribe dry run has to pass before provisioning counts as complete.'
  }
];

export const STAGE_IDS = PROVISION_STAGES.map((stage) => stage.id);

const STAGE_BY_ID = Object.fromEntries(PROVISION_STAGES.map((stage) => [stage.id, stage]));

/** Resolve a stage descriptor, or throw with the list of real ones. */
export function getStage(id) {
  const stage = STAGE_BY_ID[String(id)];
  if (!stage) throw new WizardSafetyError(`unknown provisioning stage "${id}". Known: ${STAGE_IDS.join(', ')}`);
  return stage;
}

/**
 * A stage is unlocked only when every stage before it has passed. This is the
 * whole gate expressed as one function, so it can be asserted directly.
 */
export function stageIsUnlocked(stageId, results = []) {
  const index = STAGE_IDS.indexOf(getStage(stageId).id);
  const status = (id) => results.find((result) => result.id === id)?.status ?? 'not-run';
  return STAGE_IDS.slice(0, index).every((id) => status(id) === 'passed');
}

/** The stage that is blocking `stageId`, or null when it is unlocked. */
export function blockingStage(stageId, results = []) {
  const index = STAGE_IDS.indexOf(getStage(stageId).id);
  for (const id of STAGE_IDS.slice(0, index)) {
    const status = results.find((result) => result.id === id)?.status ?? 'not-run';
    if (status !== 'passed') return { id, status, ...getStage(id) };
  }
  return null;
}

const normaliseOutcome = (stage, outcome) => ({
  id: stage.id,
  number: stage.number,
  title: stage.title,
  status: outcome.ok ? 'passed' : 'failed',
  problems: outcome.problems ?? [],
  notes: outcome.notes ?? [],
  detail: outcome.detail ?? null
});

/**
 * Run an ordered list of stages, halting at the first failure.
 *
 * Each entry is `{ id, run }` where run is `async (context) => ({ ok, problems,
 * notes, detail })`. A stage whose predecessor did not pass is never invoked:
 * its `run` is not called at all, and it is recorded as blocked. A throw is
 * caught and recorded as a failure, so one bad stage cannot take the report
 * down with it.
 */
export async function runStages(stages, context = {}) {
  const results = [];
  for (const stage of stages) {
    const descriptor = getStage(stage.id);
    if (!stageIsUnlocked(descriptor.id, results)) {
      const blocker = blockingStage(descriptor.id, results);
      results.push({
        id: descriptor.id,
        number: descriptor.number,
        title: descriptor.title,
        status: 'blocked',
        problems: [`blocked by stage ${blocker.number} (${blocker.title}), which is ${blocker.status}`],
        notes: [],
        detail: null
      });
      continue;
    }
    let outcome;
    try {
      outcome = (await stage.run({ ...context, results: results.slice() })) ?? { ok: false, problems: ['stage returned nothing'] };
    } catch (error) {
      outcome = { ok: false, problems: [error instanceof Error ? error.message : String(error)] };
    }
    results.push(normaliseOutcome(descriptor, outcome));
  }
  const complete = STAGE_IDS.every((id) => results.find((result) => result.id === id)?.status === 'passed');
  return { complete, results };
}

/* ------------------------------------------------------------------ */
/* stage 1: transcription check                                        */
/* ------------------------------------------------------------------ */

export const CHALLENGE_WORDS_PER_WIZARD = 2;

/**
 * A fresh challenge seed. Generated at run time and printed with the phrases,
 * so the challenge is reproducible from the report afterwards but cannot be
 * anticipated before the phrases exist. Guessing which words will be asked for
 * is exactly the shortcut this stage is designed to prevent.
 */
export function newChallengeSeed(randomImpl = randomBytes) {
  return Buffer.from(randomImpl(16)).toString('hex');
}

/**
 * Which word positions this wizard is challenged on. Deterministic in the seed
 * and the wizard id, 1-based, distinct, sorted.
 */
export function transcriptionChallenge({ seed, wizardId, wordCount = 12, count = CHALLENGE_WORDS_PER_WIZARD } = {}) {
  if (!seed) throw new WizardSafetyError('a transcription challenge needs a seed');
  if (count > wordCount) {
    throw new WizardSafetyError(`cannot ask for ${count} distinct words out of ${wordCount}`);
  }
  const digest = sha256(Buffer.from(`${seed}:${wizardId}`, 'utf8'));
  const positions = [];
  for (let round = 0; positions.length < count; round += 1) {
    const byte = digest[round % digest.length] + Math.floor(round / digest.length);
    const position = (byte % wordCount) + 1;
    if (!positions.includes(position)) positions.push(position);
  }
  return { wizardId, positions: positions.sort((a, b) => a - b) };
}

/** Every wizard's challenge for one seed, in fleet order. */
export function transcriptionChallenges({ seed, fleet, wordCount = 12 } = {}) {
  return fleet.map((wizard) =>
    transcriptionChallenge({ seed, wizardId: wizard.id, wordCount: wordCount ?? wizard.mnemonic.trim().split(/\s+/).length })
  );
}

/** Human wording for the challenge, e.g. "word 3 and word 9". */
export function describeChallenge(challenge) {
  const words = challenge.positions.map((position) => `word ${position}`);
  return words.length <= 1 ? words.join('') : `${words.slice(0, -1).join(', ')} and ${words.at(-1)}`;
}

/**
 * Compare what the operator typed against the phrase.
 *
 * The result never carries the expected words. A failure says which positions
 * were wrong and nothing else, so a check result can be printed, logged or put
 * in a report without leaking a third of a recovery phrase.
 */
export function checkTranscription({ challenge, mnemonic, answers = [] } = {}) {
  const words = String(mnemonic ?? '').trim().split(/\s+/).filter(Boolean);
  const given = answers.map((answer) => String(answer ?? '').trim().toLowerCase());
  const wrong = [];
  challenge.positions.forEach((position, index) => {
    const expected = words[position - 1];
    if (expected === undefined || given[index] !== expected) wrong.push(position);
  });
  return {
    wizardId: challenge.wizardId,
    positions: challenge.positions.slice(),
    ok: wrong.length === 0 && given.length === challenge.positions.length,
    wrongPositions: wrong
  };
}

/* ------------------------------------------------------------------ */
/* stage 2: the .env.wizards block                                     */
/* ------------------------------------------------------------------ */

/**
 * The paste-ready block. Keys and addresses for all three, which is what the
 * derivation check in stage 3 needs in order to have anything to cross-check.
 *
 * This is a string. Nothing in this module writes it anywhere: .env.wizards is
 * the operator's file, it is gitignored, and a script that creates it is a
 * script that has put a live key on disk.
 */
export function envBlockFor(fleet) {
  const lines = ['# scripts/wizard/.env.wizards — gitignored. Create it yourself. Never commit it.'];
  for (const wizard of fleet) lines.push(`${keyEnvName(wizard.id)}=${wizard.privateKey}`);
  lines.push('');
  for (const wizard of fleet) lines.push(`${addressEnvName(wizard.id)}=${wizard.address}`);
  return `${lines.join('\n')}\n`;
}

/** Parse a dotenv-shaped string. Pure, and deliberately unexciting. */
export function parseEnvFile(text) {
  const env = {};
  for (const rawLine of String(text ?? '').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim().replace(/^export\s+/, '');
    let value = line.slice(eq + 1).trim();
    if (/^".*"$/.test(value) || /^'.*'$/.test(value)) value = value.slice(1, -1);
    if (key) env[key] = value;
  }
  return env;
}

/**
 * Rebuild the fleet records from an environment, so stage 3 can run as a
 * standalone health check months after the phrases were written down.
 *
 * Phrases are never in an environment and never should be, so records built
 * this way carry no mnemonic and stage 3 says so rather than pretending it
 * checked three sources when it checked two.
 */
export function recordsFromEnv(env = {}) {
  const records = [];
  const missing = [];
  for (const persona of PERSONAS) {
    const privateKey = env[keyEnvName(persona.id)];
    const address = env[addressEnvName(persona.id)];
    if (!privateKey || !address || /^REPLACE_WITH_/.test(privateKey) || /^REPLACE_WITH_/.test(address)) {
      missing.push(persona.id);
      continue;
    }
    records.push({
      id: persona.id,
      name: persona.name,
      wallet: persona.wallet,
      keyEnv: keyEnvName(persona.id),
      addressEnv: addressEnvName(persona.id),
      privateKey,
      address,
      mnemonic: null
    });
  }
  return { records, missing };
}

/* ------------------------------------------------------------------ */
/* stage 3: derivation                                                 */
/* ------------------------------------------------------------------ */

/**
 * Re-derive each wizard's address from its recorded key and from its recorded
 * phrase, and require every available source to agree.
 *
 * This is the check .env.wizards.example promises by putting the addresses next
 * to the keys and that nothing in the fleet actually performed. It catches the
 * paste error where a key lands under the wrong wizard's name: the file looks
 * fine, every value is real, and the address the Archivist is about to be
 * funded at belongs to the Skeptic's key.
 */
export function verifyDerivation(records = []) {
  const results = records.map((record) => {
    const problems = [];
    let keyDerivedAddress = null;
    let phraseDerivedAddress = null;
    let phraseDerivedKeyMatches = null;

    try {
      keyDerivedAddress = getAddressFromPrivateKey(record.privateKey, TransactionVersion.Mainnet);
    } catch {
      problems.push(`${keyEnvName(record.id)} is not a usable private key`);
    }
    if (record.mnemonic) {
      try {
        const derived = keyFromMnemonic(record.mnemonic);
        phraseDerivedAddress = derived.address;
        phraseDerivedKeyMatches = derived.privateKey === record.privateKey;
      } catch {
        problems.push(`the recovery phrase for ${record.id} does not derive a key`);
      }
    }

    if (keyDerivedAddress && keyDerivedAddress !== record.address) {
      problems.push(
        `${record.name}: ${keyEnvName(record.id)} derives ${keyDerivedAddress}, but ${addressEnvName(record.id)} ` +
          `says ${record.address}. One of the two is filed under the wrong wizard.`
      );
    }
    if (phraseDerivedAddress && phraseDerivedAddress !== record.address) {
      problems.push(
        `${record.name}: the recovery phrase derives ${phraseDerivedAddress}, but the recorded address is ${record.address}.`
      );
    }
    if (phraseDerivedKeyMatches === false) {
      problems.push(`${record.name}: the recovery phrase and the recorded key are not the same wallet.`);
    }

    return {
      id: record.id,
      name: record.name,
      recordedAddress: record.address,
      keyDerivedAddress,
      phraseDerivedAddress,
      phraseChecked: Boolean(record.mnemonic),
      sourcesAgree: problems.length === 0,
      ok: problems.length === 0,
      problems
    };
  });

  const notes = [];
  if (results.length && results.every((result) => !result.phraseChecked)) {
    notes.push(
      'phrases were not supplied, so this compared the recorded address against the key only. ' +
        'Phrases live on paper, never in an environment.'
    );
  }
  return {
    ok: results.length > 0 && results.every((result) => result.ok),
    results,
    notes,
    problems: results.flatMap((result) => result.problems)
  };
}

/* ------------------------------------------------------------------ */
/* stage 4: pre-funding                                                */
/* ------------------------------------------------------------------ */

/**
 * Wallets in this project that a wizard must never be. Sending a wizard float
 * to the deployer is survivable; deriving a "wizard" that turns out to be the
 * deployer, and then treating it as disposable, is not.
 */
export const KNOWN_PROJECT_WALLETS = [
  { address: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X', label: 'the mainnet deployer' },
  { address: 'SP3EHW9BYF23GNAQ3CC6818J1ZZRWVQM3DSRSN0AF', label: 'the sponsor hot wallet' }
];

/**
 * Mainnet standard (SP) and multisig (SM) addresses in the c32 alphabet, which
 * omits I, L, O and U.
 *
 * The length window is 38 to 41 and not a fixed 41. c32check drops leading zero
 * bytes, so a mainnet address is 41 characters about three times in four, 40
 * roughly one time in four, and 39 about one time in 240. Pinning this at 41
 * would reject a quarter of perfectly good wallets and send the operator off to
 * regenerate a fleet that was never wrong. The checksum below is what actually
 * catches a typo; the length is only a cheap pre-filter.
 */
export const MAINNET_ADDRESS_PATTERN = /^S[PM][0-9A-HJKMNP-TV-Z]{36,39}$/;

/** Shape and checksum of one address. Returns the problems, empty when fine. */
export function addressProblems(address, label = 'address') {
  const value = String(address ?? '');
  if (!value) return [`${label} is missing`];
  if (!/^S[PM]/.test(value)) {
    return [`${label} ${value} is not a mainnet address: it must start with SP or SM`];
  }
  if (!MAINNET_ADDRESS_PATTERN.test(value)) {
    return [
      `${label} ${value} is not well-formed c32: ${value.length} characters, and c32 mainnet addresses are ` +
        '38 to 41 characters drawn from an alphabet with no I, L, O or U'
    ];
  }
  if (!validateStacksAddress(value)) {
    return [`${label} ${value} fails its c32 checksum, so it is a typo rather than an address`];
  }
  return [];
}

/**
 * Everything that has to hold before a single microSTX is sent.
 *
 * The zero-balance rule is the one that looks fussy and is not. A wizard
 * address with a balance already on it is either a wallet that is not fresh, an
 * address that belongs to something else, or a second run against a fleet that
 * was already funded. All three want a person to look before more money moves.
 */
export async function preFundingCheck({ records = [], fetchBalance, knownWallets = KNOWN_PROJECT_WALLETS } = {}) {
  const problems = [];

  for (const record of records) {
    problems.push(...addressProblems(record.address, `${record.name}: address`));
  }

  const seen = new Map();
  for (const record of records) {
    const already = seen.get(record.address);
    if (already) problems.push(`${record.name} and ${already} share the address ${record.address}`);
    else seen.set(record.address, record.name);
  }

  for (const record of records) {
    const collision = knownWallets.find((wallet) => wallet.address === record.address);
    if (collision) {
      problems.push(`${record.name} is ${collision.label} (${collision.address}). A wizard is disposable; that wallet is not.`);
    }
  }

  const balances = [];
  if (problems.length === 0 && typeof fetchBalance === 'function') {
    for (const record of records) {
      const balanceUstx = BigInt(await fetchBalance(record.address));
      balances.push({ id: record.id, name: record.name, address: record.address, balanceUstx });
      if (balanceUstx !== 0n) {
        problems.push(
          `${record.name} (${record.address}) already holds ${groupDigits(balanceUstx)} microSTX. ` +
            'A wizard about to be funded should be empty. Look at this address before sending anything.'
        );
      }
    }
  }

  return { ok: problems.length === 0, problems, balances, checked: records.length };
}

/* ------------------------------------------------------------------ */
/* stage 5: funding, observed                                          */
/* ------------------------------------------------------------------ */

/** ~5 STX each, per the README. Roughly a hundred cycles before a top-up. */
export const DEFAULT_FUND_USTX = 5_000_000n;

/** A balance at or above this multiple of the target is a fat-fingered amount. */
export const DEFAULT_OVERPAY_FACTOR = 4n;

export const DEFAULT_POLL_INTERVAL_MS = 20_000;
export const DEFAULT_FUNDING_TIMEOUT_MS = 15 * 60_000;

const classify = ({ expectedUstx, balanceUstx, overpayFactor }) => {
  if (balanceUstx === 0n) return 'nothing-yet';
  if (balanceUstx < expectedUstx) return 'short';
  if (balanceUstx >= expectedUstx * overpayFactor) return 'over';
  return 'arrived';
};

/**
 * Watch balances until every wizard holds at least its target.
 *
 * Read-only, by construction: the only thing injected is a balance reader. If
 * money is going to arrive, a human sends it from a wallet they control. This
 * function's entire job is to say what actually landed where, including the two
 * cases that matter and are easy to miss: an address that got less than
 * intended, and an address that got very much more than intended.
 */
export async function pollFunding({
  targets = [],
  fetchBalance,
  now = () => Date.now(),
  sleep = async () => {},
  timeoutMs = DEFAULT_FUNDING_TIMEOUT_MS,
  intervalMs = DEFAULT_POLL_INTERVAL_MS,
  overpayFactor = DEFAULT_OVERPAY_FACTOR,
  onPoll = () => {}
} = {}) {
  if (typeof fetchBalance !== 'function') throw new WizardSafetyError('pollFunding needs a balance reader');
  const started = now();
  let polls = 0;
  let results = [];

  for (;;) {
    results = [];
    for (const target of targets) {
      const expectedUstx = BigInt(target.expectedUstx);
      const balanceUstx = BigInt(await fetchBalance(target.address));
      const status = classify({ expectedUstx, balanceUstx, overpayFactor });
      results.push({
        id: target.id,
        name: target.name,
        address: target.address,
        expectedUstx,
        balanceUstx,
        arrived: balanceUstx >= expectedUstx,
        status,
        shortfallUstx: balanceUstx < expectedUstx ? expectedUstx - balanceUstx : 0n,
        excessUstx: balanceUstx > expectedUstx ? balanceUstx - expectedUstx : 0n
      });
    }
    polls += 1;
    onPoll({ poll: polls, elapsedMs: now() - started, results: results.slice() });

    const allArrived = results.length > 0 && results.every((result) => result.arrived);
    const timedOut = now() - started >= timeoutMs;
    if (allArrived || timedOut) {
      const flags = results
        .filter((result) => result.status === 'short' || result.status === 'over')
        .map((result) => ({
          id: result.id,
          address: result.address,
          status: result.status,
          message:
            result.status === 'short'
              ? `${result.name} (${result.address}) holds ${groupDigits(result.balanceUstx)} microSTX, ` +
                `${groupDigits(result.shortfallUstx)} short of the ${groupDigits(result.expectedUstx)} intended.`
              : `${result.name} (${result.address}) holds ${groupDigits(result.balanceUstx)} microSTX, ` +
                `far more than the ${groupDigits(result.expectedUstx)} intended. Check the amount you sent before continuing.`
        }));
      const waiting = results.filter((result) => !result.arrived).map((result) => result.address);
      return {
        ok: allArrived,
        timedOut: timedOut && !allArrived,
        polls,
        elapsedMs: now() - started,
        results,
        flags,
        waiting
      };
    }
    await sleep(intervalMs);
  }
}

/* ------------------------------------------------------------------ */
/* stage 6: baseline                                                   */
/* ------------------------------------------------------------------ */

/**
 * The confirmed starting point. A later run reconciles spend against this: if
 * the fleet has burned more than the entries it produced can account for,
 * something else is signing with those keys.
 */
export function buildBaseline({ results = [], chainTip = null, now = () => Date.now() } = {}) {
  return {
    recordedAt: new Date(now()).toISOString(),
    chainTip: chainTip === null || chainTip === undefined ? null : String(chainTip),
    totalUstx: String(results.reduce((sum, result) => sum + BigInt(result.balanceUstx), 0n)),
    balances: results.map((result) => ({
      id: result.id,
      name: result.name,
      address: result.address,
      balanceUstx: String(result.balanceUstx),
      balanceStx: microStxToStx(BigInt(result.balanceUstx))
    }))
  };
}

/* ------------------------------------------------------------------ */
/* stage 7: the dry-run gate                                           */
/* ------------------------------------------------------------------ */

/**
 * The argv for the gate. It is the existing dry run and nothing else: no
 * --broadcast, no key in the environment, no new code path to audit.
 */
export function dryRunGateCommand({ scriptPath, wizardId, offline = false } = {}) {
  const argv = [scriptPath, '--wizard', String(wizardId)];
  if (offline) argv.push('--offline');
  return assertDryRunCommandIsSafe(argv);
}

/**
 * Refuse any gate command that could spend. The gate exists to prove the fleet
 * is usable, so a gate that spends has misunderstood its own job.
 */
export function assertDryRunCommandIsSafe(argv = []) {
  const offending = argv.filter((part) => /broadcast/i.test(String(part)));
  if (offending.length > 0) {
    throw new WizardSafetyError(
      `refusing to run the gate: "${offending.join(' ')}" would spend real STX. The gate is a dry run and nothing else.`
    );
  }
  return argv;
}

/** Turn a child process result into a stage outcome. */
export function dryRunGateOutcome({ command = [], exitCode = null, stderr = '' } = {}) {
  const ok = exitCode === 0;
  return {
    ok,
    command: command.join(' '),
    exitCode,
    problems: ok
      ? []
      : [
          `the inscribe dry run exited ${exitCode}. Provisioning is not complete until it passes.` +
            (stderr ? ` Last error: ${String(stderr).trim().split('\n').at(-1)}` : '')
        ]
  };
}

/* ------------------------------------------------------------------ */
/* live reads, wired to the shared helpers                             */
/* ------------------------------------------------------------------ */

/** A balance reader bound to one Hiro endpoint. Read-only, like everything here. */
export function makeBalanceReader({ fetchImpl = globalThis.fetch, hiroUrl = DEFAULT_HIRO_URL } = {}) {
  return async (address) => fetchStxBalance({ fetchImpl, hiroUrl, address });
}

/** The chain tip, tolerated as null when the lookup fails. Read-only. */
export async function readChainTip({ fetchImpl = globalThis.fetch, hiroUrl = DEFAULT_HIRO_URL } = {}) {
  try {
    return await fetchChainTip({ fetchImpl, hiroUrl });
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* the report                                                          */
/* ------------------------------------------------------------------ */

/**
 * Prove a report carries no key material before anyone prints it, writes it,
 * pastes it into an issue or attaches it to a message.
 *
 * Full keys, the 32-byte key body without its compression suffix, full phrases,
 * and any three consecutive words of a phrase. Three consecutive BIP39 words do
 * not occur by accident in a document made of addresses, statuses and
 * timestamps, and a single word would false-positive on ordinary English.
 *
 * The error names the wizard and the kind of leak. It never quotes the leak.
 */
export function assertReportIsSecretFree(report, { keys = [], phrases = [] } = {}) {
  const serialised = JSON.stringify(report);
  for (const { id, key } of keys) {
    if (!key) continue;
    const body = String(key).replace(/01$/, '');
    if (serialised.includes(String(key)) || (body.length >= 32 && serialised.includes(body))) {
      throw new WizardSafetyError(`refusing to emit the report: it contains the private key for ${id}`);
    }
  }
  for (const { id, phrase } of phrases) {
    if (!phrase) continue;
    if (serialised.includes(String(phrase))) {
      throw new WizardSafetyError(`refusing to emit the report: it contains the recovery phrase for ${id}`);
    }
    const words = String(phrase).trim().split(/\s+/);
    for (let index = 0; index + 3 <= words.length; index += 1) {
      if (serialised.includes(words.slice(index, index + 3).join(' '))) {
        throw new WizardSafetyError(`refusing to emit the report: it contains phrase material for ${id}`);
      }
    }
  }
  return report;
}

/**
 * The report. Per-stage status, the addresses, what arrived, the baseline, the
 * chain tip, the timestamp and the challenge seed.
 *
 * Not in it, ever: a key, a phrase, or a challenge answer. The challenge seed
 * is here on purpose, because the seed plus the report reproduces which words
 * were asked for, which is what makes the transcription check auditable
 * afterwards. It does not reproduce the words themselves.
 */
export function buildReport({
  mode = 'live',
  startedAt,
  finishedAt,
  challengeSeed = null,
  challenges = [],
  wizards = [],
  stages = [],
  funding = null,
  baseline = null,
  dryRunGate = null,
  secrets = {}
} = {}) {
  const report = {
    tool: 'scripts/wizard/provision.mjs',
    reportVersion: REPORT_VERSION,
    mode,
    startedAt: startedAt ?? null,
    finishedAt: finishedAt ?? null,
    complete: stages.length > 0 && stages.every((stage) => stage.status === 'passed'),
    challengeSeed,
    challenges: challenges.map((challenge) => ({
      wizardId: challenge.wizardId,
      positions: challenge.positions.slice(),
      asked: describeChallenge(challenge)
    })),
    wizards: wizards.map((wizard) => ({
      id: wizard.id,
      name: wizard.name,
      wallet: wizard.wallet ?? null,
      address: wizard.address,
      keyEnv: keyEnvName(wizard.id),
      addressEnv: addressEnvName(wizard.id)
    })),
    stages: stages.map((stage) => ({
      number: stage.number,
      id: stage.id,
      title: stage.title,
      status: stage.status,
      problems: stage.problems ?? [],
      notes: stage.notes ?? []
    })),
    funding: funding
      ? {
          expectedUstx: String(funding.expectedUstx ?? ''),
          polls: funding.polls ?? null,
          timedOut: Boolean(funding.timedOut),
          flags: (funding.flags ?? []).map((flag) => ({ id: flag.id, address: flag.address, status: flag.status, message: flag.message })),
          received: (funding.results ?? []).map((result) => ({
            id: result.id,
            address: result.address,
            expectedUstx: String(result.expectedUstx),
            balanceUstx: String(result.balanceUstx),
            balanceStx: microStxToStx(BigInt(result.balanceUstx)),
            arrived: result.arrived,
            status: result.status,
            shortfallUstx: String(result.shortfallUstx ?? 0n)
          }))
        }
      : null,
    baseline,
    dryRunGate: dryRunGate ? { command: dryRunGate.command, exitCode: dryRunGate.exitCode, ok: dryRunGate.ok } : null
  };
  return assertReportIsSecretFree(report, secrets);
}

/* ------------------------------------------------------------------ */
/* the seven stages, wired                                             */
/* ------------------------------------------------------------------ */

/**
 * Everything the stages need from the outside world, all of it replaceable.
 * The defaults do nothing, so a caller that supplies no presenters gets a
 * silent run rather than a crash.
 */
export const NULL_PORTS = {
  generateFleet: () => [],
  newSeed: () => newChallengeSeed(),
  presentFleet: () => {},
  askTranscription: async () => [],
  presentEnvBlock: () => {},
  presentDerivation: () => {},
  presentPreFunding: () => {},
  presentFundingTargets: () => {},
  onPoll: () => {},
  confirm: async () => false,
  fetchBalance: async () => 0n,
  readChainTip: async () => null,
  runGate: async () => ({ exitCode: 1, stderr: 'no gate runner supplied' }),
  now: () => Date.now(),
  sleep: async () => {}
};

/**
 * Build the seven stages against a set of ports. `state` is filled in as the
 * run proceeds and is what the report is assembled from afterwards.
 *
 * No stage here signs anything, sends anything, or writes anything. Stage 5 is
 * the closest it gets to the money and it only reads balances.
 */
export function buildProvisioningStages({ ports = {}, options = {}, state = {} } = {}) {
  const io = { ...NULL_PORTS, ...ports };
  const {
    fundUstx = DEFAULT_FUND_USTX,
    timeoutMs = DEFAULT_FUNDING_TIMEOUT_MS,
    intervalMs = DEFAULT_POLL_INTERVAL_MS,
    overpayFactor = DEFAULT_OVERPAY_FACTOR,
    maxRepolls = 10,
    gateWizardId = null,
    offlineGate = false,
    scriptPath = 'scripts/wizard/inscribe.mjs'
  } = options;
  const expectedUstx = BigInt(fundUstx);

  state.fleet ??= [];
  state.records ??= [];
  state.challenges ??= [];

  return [
    {
      id: 'generate',
      run: async () => {
        state.fleet = await io.generateFleet();
        state.records = state.fleet.map((wizard) => ({ ...wizard }));
        state.challengeSeed = io.newSeed();
        state.challenges = transcriptionChallenges({ seed: state.challengeSeed, fleet: state.fleet });
        io.presentFleet({ fleet: state.fleet, seed: state.challengeSeed, challenges: state.challenges });

        const problems = [];
        for (const wizard of state.fleet) {
          const challenge = state.challenges.find((entry) => entry.wizardId === wizard.id);
          const answers = await io.askTranscription({ wizard, challenge, asked: describeChallenge(challenge) });
          const check = checkTranscription({ challenge, mnemonic: wizard.mnemonic, answers });
          if (!check.ok) {
            const where = check.wrongPositions.length
              ? check.wrongPositions.map((position) => `word ${position}`).join(' and ')
              : 'the wrong number of words';
            problems.push(
              `${wizard.name}: ${where} did not match. The phrase you wrote down is not the phrase that was ` +
                'generated, and a wrong phrase is silent until the day the wallet is needed. Start again.'
            );
          }
        }
        return { ok: problems.length === 0, problems, detail: { challengeSeed: state.challengeSeed } };
      }
    },
    {
      id: 'record',
      run: async () => {
        io.presentEnvBlock({ block: envBlockFor(state.fleet), fleet: state.fleet });
        const saved = await io.confirm({
          id: 'record',
          expect: 'SAVED',
          question: 'Type SAVED once that block is in scripts/wizard/.env.wizards or your keychain'
        });
        return saved
          ? { ok: true, notes: ['the operator saved the block; this script wrote no key material anywhere'] }
          : {
              ok: false,
              problems: [
                'the .env.wizards block was not confirmed as saved. Nothing further runs: an unrecorded key is ' +
                  'a wallet you are about to send real STX to and never see again.'
              ]
            };
      }
    },
    {
      id: 'verify-derivation',
      run: async () => {
        const verdict = verifyDerivation(state.records);
        io.presentDerivation(verdict);
        return { ok: verdict.ok, problems: verdict.problems, notes: verdict.notes, detail: verdict };
      }
    },
    {
      id: 'pre-funding',
      run: async () => {
        const verdict = await preFundingCheck({ records: state.records, fetchBalance: io.fetchBalance });
        io.presentPreFunding(verdict);
        return { ok: verdict.ok, problems: verdict.problems, detail: verdict };
      }
    },
    {
      id: 'funding',
      run: async () => {
        const targets = state.records.map((record) => ({
          id: record.id,
          name: record.name,
          address: record.address,
          expectedUstx
        }));
        io.presentFundingTargets({ targets, expectedUstx });

        const ready = await io.confirm({
          id: 'funding',
          expect: 'FUND',
          question:
            `Type FUND to confirm you are about to send ${groupDigits(expectedUstx)} microSTX to each address above. ` +
            'This script sends nothing; it only watches.'
        });
        if (!ready) {
          return { ok: false, problems: ['funding was not confirmed. Nothing was watched for and nothing was sent.'] };
        }

        const poll = async () =>
          pollFunding({
            targets,
            fetchBalance: io.fetchBalance,
            now: io.now,
            sleep: io.sleep,
            timeoutMs,
            intervalMs,
            overpayFactor,
            onPoll: io.onPoll
          });

        let result = await poll();
        for (let attempt = 0; !result.ok && result.timedOut && attempt < maxRepolls; attempt += 1) {
          const again = await io.confirm({
            id: 'repoll',
            expect: 'AGAIN',
            question: `Timed out with ${result.waiting.length} address(es) still short. Type AGAIN to keep watching`
          });
          if (!again) break;
          result = await poll();
        }
        state.funding = { ...result, expectedUstx };

        if (!result.ok) {
          return {
            ok: false,
            problems: [
              `funding did not complete after ${result.polls} poll(s): ` +
                `${result.waiting.join(', ')} did not reach ${groupDigits(expectedUstx)} microSTX.`,
              ...result.flags.map((flag) => flag.message)
            ],
            detail: result
          };
        }
        if (result.flags.length > 0) {
          const accepted = await io.confirm({
            id: 'flags',
            expect: 'ACCEPT',
            question: 'An address received an amount that does not match the plan. Type ACCEPT only if that was deliberate'
          });
          if (!accepted) return { ok: false, problems: result.flags.map((flag) => flag.message), detail: result };
          return { ok: true, notes: result.flags.map((flag) => `acknowledged: ${flag.message}`), detail: result };
        }
        return {
          ok: true,
          notes: [`every address reached its target after ${result.polls} poll(s)`],
          detail: result
        };
      }
    },
    {
      id: 'baseline',
      run: async () => {
        const chainTip = await io.readChainTip();
        state.baseline = buildBaseline({ results: state.funding?.results ?? [], chainTip, now: io.now });
        return {
          ok: state.baseline.balances.length > 0,
          problems: state.baseline.balances.length > 0 ? [] : ['no confirmed balances to record a baseline from'],
          notes: [
            `baseline: ${microStxToStx(BigInt(state.baseline.totalUstx))} STX across ${state.baseline.balances.length} ` +
              `wallets at chain tip ${state.baseline.chainTip ?? 'unknown'}`
          ],
          detail: state.baseline
        };
      }
    },
    {
      id: 'dry-run-gate',
      run: async () => {
        const wizardId = gateWizardId ?? state.records[0]?.id;
        if (!wizardId) return { ok: false, problems: ['no wizard to run the gate for'] };
        const command = dryRunGateCommand({ scriptPath, wizardId, offline: offlineGate });
        const { exitCode, stderr } = await io.runGate(command, { wizardId });
        const outcome = dryRunGateOutcome({ command, exitCode, stderr });
        state.dryRunGate = outcome;
        return {
          ok: outcome.ok,
          problems: outcome.problems,
          notes: outcome.ok ? [`gate passed: ${outcome.command}`] : [],
          detail: outcome
        };
      }
    }
  ];
}

/**
 * The whole gated run, from generation to report. Returns the report and the
 * per-stage results, and deliberately does not return the wallet state: the
 * fleet's keys stay inside this function.
 */
export async function runProvisioning({ ports = {}, options = {} } = {}) {
  const io = { ...NULL_PORTS, ...ports };
  const state = {};
  const startedAt = new Date(io.now()).toISOString();
  const { complete, results } = await runStages(buildProvisioningStages({ ports: io, options, state }), {});
  const finishedAt = new Date(io.now()).toISOString();

  const report = buildReport({
    mode: options.mode ?? 'live',
    startedAt,
    finishedAt,
    challengeSeed: state.challengeSeed ?? null,
    challenges: state.challenges ?? [],
    wizards: state.records ?? [],
    stages: results,
    funding: state.funding ?? null,
    baseline: state.baseline ?? null,
    dryRunGate: state.dryRunGate ?? null,
    secrets: {
      keys: (state.fleet ?? []).map((wizard) => ({ id: wizard.id, key: wizard.privateKey })),
      phrases: (state.fleet ?? []).map((wizard) => ({ id: wizard.id, phrase: wizard.mnemonic }))
    }
  });
  return { complete, results, report };
}

const STATUS_MARK = { passed: 'PASS', failed: 'FAIL', blocked: 'BLOCKED', 'not-run': '----' };

/** Render a report for a terminal. Pure string building. */
export function formatReport(report) {
  const lines = [];
  lines.push('==============================================================================');
  lines.push(`  WIZARD PROVISIONING REPORT${report.mode === 'dry' ? '  [--dry: fakes, no network, no funds]' : ''}`);
  lines.push('==============================================================================');
  lines.push(`  started : ${report.startedAt}`);
  lines.push(`  finished: ${report.finishedAt}`);
  lines.push(`  verdict : ${report.complete ? 'COMPLETE — the fleet is provisioned' : 'INCOMPLETE — do not treat this fleet as funded'}`);
  lines.push('');
  lines.push('  stages');
  for (const stage of report.stages) {
    lines.push(`    ${String(stage.number)}. ${stage.title.padEnd(20)} ${STATUS_MARK[stage.status] ?? stage.status}`);
    for (const problem of stage.problems) lines.push(`         ! ${problem}`);
    for (const note of stage.notes) lines.push(`         - ${note}`);
  }
  lines.push('');
  lines.push('  wizards');
  for (const wizard of report.wizards) lines.push(`    ${wizard.name.padEnd(26)} ${wizard.address}`);
  if (report.funding) {
    lines.push('');
    lines.push(`  funding (target ${groupDigits(BigInt(report.funding.expectedUstx || 0))} microSTX each, ${report.funding.polls} poll(s))`);
    for (const received of report.funding.received) {
      lines.push(
        `    ${received.address}  ${received.balanceStx} STX  ${received.arrived ? 'arrived' : `WAITING (short ${groupDigits(BigInt(received.shortfallUstx))})`}`
      );
    }
    for (const flag of report.funding.flags) lines.push(`    ! ${flag.message}`);
  }
  if (report.baseline) {
    lines.push('');
    lines.push(`  baseline at ${report.baseline.recordedAt}, chain tip ${report.baseline.chainTip ?? 'unknown'}`);
    lines.push(`  total float ${microStxToStx(BigInt(report.baseline.totalUstx))} STX`);
  }
  if (report.dryRunGate) {
    lines.push('');
    lines.push(`  dry-run gate: ${report.dryRunGate.ok ? 'passed' : `FAILED (exit ${report.dryRunGate.exitCode})`}`);
    lines.push(`    ${report.dryRunGate.command}`);
  }
  lines.push('');
  lines.push(`  transcription challenge seed: ${report.challengeSeed ?? 'n/a'}`);
  for (const challenge of report.challenges) lines.push(`    ${challenge.wizardId}: ${challenge.asked}`);
  lines.push('');
  lines.push('  This report contains no keys and no phrases, by assertion. Those exist only');
  lines.push('  on the paper you wrote them on and in the file you created yourself.');
  lines.push('==============================================================================');
  return lines.join('\n');
}
