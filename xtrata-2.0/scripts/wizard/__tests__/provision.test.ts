import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_FUND_USTX,
  KNOWN_PROJECT_WALLETS,
  MAINNET_ADDRESS_PATTERN,
  PROVISION_STAGES,
  STAGE_IDS,
  WizardSafetyError,
  addressProblems,
  assertDryRunCommandIsSafe,
  assertReportIsSecretFree,
  blockingStage,
  buildBaseline,
  buildReport,
  checkTranscription,
  describeChallenge,
  dryRunGateCommand,
  envBlockFor,
  formatReport,
  makeBalanceReader,
  parseEnvFile,
  pollFunding,
  preFundingCheck,
  recordsFromEnv,
  runProvisioning,
  runStages,
  stageIsUnlocked,
  transcriptionChallenge,
  verifyDerivation
} from '../provision-core.mjs';
import { addressEnvName, generateFleet, keyEnvName } from '../make-wizards.mjs';

type Wizard = {
  id: string;
  name: string;
  wallet: string;
  address: string;
  privateKey: string;
  mnemonic: string;
};

/**
 * One real fleet, generated once. Real keys and real phrases, because the
 * derivation and the leak tests are only worth anything against the actual
 * values. Never funded, never written, never leaves this process.
 */
const FLEET = generateFleet() as Wizard[];
const RECORDS = FLEET.map((wizard) => ({ ...wizard }));

const DEPLOYER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const SPONSOR = 'SP3EHW9BYF23GNAQ3CC6818J1ZZRWVQM3DSRSN0AF';

/* ------------------------------------------------------------------ */
/* fake ports for the whole seven-stage run                            */
/* ------------------------------------------------------------------ */

const fakeRun = (overrides: Record<string, unknown> = {}) => {
  const fleet = FLEET;
  const ledger = new Map(fleet.map((wizard) => [wizard.address, 0n]));
  let clock = Date.UTC(2026, 6, 30, 12, 0, 0);
  const gateCalls: string[][] = [];
  const confirmed: string[] = [];

  const ports = {
    generateFleet: () => fleet,
    newSeed: () => 'a-seed-fixed-for-tests',
    fetchBalance: vi.fn(async (address: string) => ledger.get(address) ?? 0n),
    readChainTip: async () => 8_700_000n,
    now: () => (clock += 1_000),
    // The money "arrives" between polls, so the poll loop runs at least twice.
    sleep: async () => {
      for (const address of ledger.keys()) ledger.set(address, DEFAULT_FUND_USTX);
    },
    askTranscription: async ({ wizard, challenge }: { wizard: Wizard; challenge: { positions: number[] } }) =>
      challenge.positions.map((position) => wizard.mnemonic.split(' ')[position - 1]),
    confirm: async ({ expect: expected }: { expect: string }) => {
      confirmed.push(expected);
      return true;
    },
    runGate: async (argv: string[]) => {
      gateCalls.push(argv);
      return { exitCode: 0, stderr: '' };
    },
    ...overrides
  };
  return { ports, ledger, fleet, gateCalls, confirmed };
};

/* ------------------------------------------------------------------ */

describe('stage gating', () => {
  it('describes seven stages, in the order the plan requires', () => {
    expect(STAGE_IDS).toEqual([
      'generate',
      'record',
      'verify-derivation',
      'pre-funding',
      'funding',
      'baseline',
      'dry-run-gate'
    ]);
    expect(PROVISION_STAGES.map((stage) => stage.number)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('locks every stage until the one before it has passed', () => {
    expect(stageIsUnlocked('generate', [])).toBe(true);
    expect(stageIsUnlocked('record', [])).toBe(false);
    expect(stageIsUnlocked('record', [{ id: 'generate', status: 'passed' }])).toBe(true);
    expect(stageIsUnlocked('record', [{ id: 'generate', status: 'failed' }])).toBe(false);
    expect(stageIsUnlocked('funding', [{ id: 'generate', status: 'passed' }])).toBe(false);
    expect(blockingStage('funding', [{ id: 'generate', status: 'passed' }])?.id).toBe('record');
    expect(blockingStage('record', [{ id: 'generate', status: 'passed' }])).toBeNull();
  });

  it('halts the sequence at the first failure and never invokes a later stage', async () => {
    const calls: string[] = [];
    const stage = (id: string, ok: boolean) => ({
      id,
      run: async () => {
        calls.push(id);
        return { ok, problems: ok ? [] : [`${id} refused`] };
      }
    });
    const { complete, results } = await runStages([
      stage('generate', true),
      stage('record', true),
      stage('verify-derivation', false),
      stage('pre-funding', true),
      stage('funding', true),
      stage('baseline', true),
      stage('dry-run-gate', true)
    ]);

    expect(complete).toBe(false);
    expect(calls).toEqual(['generate', 'record', 'verify-derivation']);
    expect(results.map((result) => result.status)).toEqual([
      'passed',
      'passed',
      'failed',
      'blocked',
      'blocked',
      'blocked',
      'blocked'
    ]);
    expect(results[3].problems[0]).toMatch(/blocked by stage 3 \(Verify derivation\), which is failed/);
  });

  it('turns a thrown stage into a failure rather than losing the report', async () => {
    const { results } = await runStages([
      {
        id: 'generate',
        run: async () => {
          throw new Error('the phrase did not come back');
        }
      },
      { id: 'record', run: async () => ({ ok: true }) }
    ]);
    expect(results[0].status).toBe('failed');
    expect(results[0].problems).toEqual(['the phrase did not come back']);
    expect(results[1].status).toBe('blocked');
  });
});

/* ------------------------------------------------------------------ */

describe('the transcription check', () => {
  const wizard = FLEET[0];
  const challenge = transcriptionChallenge({ seed: 'seed-one', wizardId: wizard.id });
  const words = wizard.mnemonic.split(' ');
  const correct = challenge.positions.map((position) => words[position - 1]);

  it('asks for two distinct, in-range word positions', () => {
    expect(challenge.positions).toHaveLength(2);
    expect(new Set(challenge.positions).size).toBe(2);
    for (const position of challenge.positions) {
      expect(position).toBeGreaterThanOrEqual(1);
      expect(position).toBeLessThanOrEqual(12);
    }
    expect(describeChallenge(challenge)).toBe(`word ${challenge.positions[0]} and word ${challenge.positions[1]}`);
  });

  it('is deterministic in the seed, and different per wizard and per seed', () => {
    expect(transcriptionChallenge({ seed: 'seed-one', wizardId: wizard.id })).toEqual(challenge);
    const otherSeed = transcriptionChallenge({ seed: 'seed-two', wizardId: wizard.id });
    const otherWizard = transcriptionChallenge({ seed: 'seed-one', wizardId: 'builder' });
    expect([otherSeed.positions, otherWizard.positions]).not.toEqual([challenge.positions, challenge.positions]);
  });

  it('passes when the words typed back match the phrase', () => {
    const check = checkTranscription({ challenge, mnemonic: wizard.mnemonic, answers: correct });
    expect(check.ok).toBe(true);
    expect(check.wrongPositions).toEqual([]);
  });

  it('tolerates the case and padding a person actually types', () => {
    const typed = correct.map((word, index) => (index === 0 ? `  ${word.toUpperCase()} ` : word));
    expect(checkTranscription({ challenge, mnemonic: wizard.mnemonic, answers: typed }).ok).toBe(true);
  });

  it('fails on a wrong word, and says which position without echoing the right one', () => {
    const wrong = [...correct];
    wrong[1] = 'zebra';
    const check = checkTranscription({ challenge, mnemonic: wizard.mnemonic, answers: wrong });
    expect(check.ok).toBe(false);
    expect(check.wrongPositions).toEqual([challenge.positions[1]]);
    expect(JSON.stringify(check)).not.toContain(correct[1]);
  });

  it('fails when the words are right but in the wrong order, or too few', () => {
    // A phrase whose words are in the wrong order is a phrase that restores
    // nothing, so answering the right words in the wrong slots is a failure.
    if (correct[0] !== correct[1]) {
      expect(checkTranscription({ challenge, mnemonic: wizard.mnemonic, answers: [...correct].reverse() }).ok).toBe(
        false
      );
    }
    expect(checkTranscription({ challenge, mnemonic: wizard.mnemonic, answers: [correct[0]] }).ok).toBe(false);
    expect(checkTranscription({ challenge, mnemonic: wizard.mnemonic, answers: [] }).ok).toBe(false);
    expect(checkTranscription({ challenge, mnemonic: '', answers: correct }).ok).toBe(false);
  });

  it('refuses a challenge with no seed, or one that cannot be satisfied', () => {
    expect(() => transcriptionChallenge({ wizardId: 'archivist' })).toThrow(WizardSafetyError);
    expect(() => transcriptionChallenge({ seed: 's', wizardId: 'a', wordCount: 1, count: 2 })).toThrow(/distinct/);
  });
});

/* ------------------------------------------------------------------ */

describe('the .env.wizards block', () => {
  const block = envBlockFor(FLEET);

  it('carries both the keys and the addresses for all three', () => {
    for (const wizard of FLEET) {
      expect(block).toContain(`${keyEnvName(wizard.id)}=${wizard.privateKey}`);
      expect(block).toContain(`${addressEnvName(wizard.id)}=${wizard.address}`);
    }
  });

  it('round-trips back into records that stage 3 can check', () => {
    const { records, missing } = recordsFromEnv(parseEnvFile(block));
    expect(missing).toEqual([]);
    expect(records.map((record) => record.address)).toEqual(FLEET.map((wizard) => wizard.address));
    // Phrases are never in an environment, so a record read back has none.
    expect(records.every((record) => record.mnemonic === null)).toBe(true);
  });

  it('treats the .example placeholders as not configured', () => {
    const { records, missing } = recordsFromEnv({
      [keyEnvName('archivist')]: 'REPLACE_WITH_ARCHIVIST_PRIVATE_KEY_HEX',
      [addressEnvName('archivist')]: 'REPLACE_WITH_ARCHIVIST_MAINNET_ADDRESS'
    });
    expect(records).toEqual([]);
    expect(missing).toEqual(['archivist', 'skeptic', 'builder']);
  });
});

/* ------------------------------------------------------------------ */

describe('derivation verification', () => {
  it('passes when the recorded address, the key and the phrase all agree', () => {
    const verdict = verifyDerivation(RECORDS);
    expect(verdict.ok).toBe(true);
    expect(verdict.problems).toEqual([]);
    for (const result of verdict.results) {
      expect(result.phraseChecked).toBe(true);
      expect(result.keyDerivedAddress).toBe(result.recordedAddress);
      expect(result.phraseDerivedAddress).toBe(result.recordedAddress);
    }
  });

  it('catches a key filed under the wrong wizard', () => {
    // The paste error this stage exists for: every value is real, the file
    // looks fine, and two of the three keys are under each other's names.
    const swapped = RECORDS.map((record, index) =>
      index === 0
        ? { ...record, privateKey: RECORDS[1].privateKey, mnemonic: RECORDS[1].mnemonic }
        : index === 1
          ? { ...record, privateKey: RECORDS[0].privateKey, mnemonic: RECORDS[0].mnemonic }
          : record
    );
    const verdict = verifyDerivation(swapped);
    expect(verdict.ok).toBe(false);
    expect(verdict.results[0].ok).toBe(false);
    expect(verdict.results[1].ok).toBe(false);
    expect(verdict.results[2].ok).toBe(true);
    expect(verdict.problems.join('\n')).toMatch(/filed under the wrong wizard/);
  });

  it('catches an address that does not match its key', () => {
    const wrong = RECORDS.map((record, index) => (index === 2 ? { ...record, address: RECORDS[0].address } : record));
    const verdict = verifyDerivation(wrong);
    expect(verdict.ok).toBe(false);
    expect(verdict.results[2].problems.join('\n')).toContain(RECORDS[2].address);
  });

  it('catches a phrase that is not the same wallet as the key', () => {
    const crossed = [{ ...RECORDS[0], mnemonic: RECORDS[1].mnemonic }];
    const verdict = verifyDerivation(crossed);
    expect(verdict.ok).toBe(false);
    expect(verdict.problems.join('\n')).toMatch(/not the same wallet|recorded address is/);
  });

  it('catches a key that is not a key at all', () => {
    const verdict = verifyDerivation([{ ...RECORDS[0], privateKey: 'not-a-key', mnemonic: null }]);
    expect(verdict.ok).toBe(false);
    expect(verdict.problems.join('\n')).toMatch(/not a usable private key/);
  });

  it('runs standalone from the environment, and says it only checked two sources', () => {
    const { records } = recordsFromEnv(parseEnvFile(envBlockFor(FLEET)));
    const verdict = verifyDerivation(records);
    expect(verdict.ok).toBe(true);
    expect(verdict.results.every((result) => result.phraseChecked)).toBe(false);
    expect(verdict.notes.join(' ')).toMatch(/phrases were not supplied/);
  });

  it('fails an empty fleet rather than passing vacuously', () => {
    expect(verifyDerivation([]).ok).toBe(false);
  });
});

/* ------------------------------------------------------------------ */

describe('the pre-funding check', () => {
  const zero = async () => 0n;
  const records = RECORDS.map(({ id, name, address }) => ({ id, name, address }));

  it('passes three fresh, distinct, well-formed, empty mainnet wallets', async () => {
    const verdict = await preFundingCheck({ records, fetchBalance: zero });
    expect(verdict.ok).toBe(true);
    expect(verdict.problems).toEqual([]);
    expect(verdict.balances).toHaveLength(3);
  });

  it('rejects a non-zero balance, because the wallet is not fresh', async () => {
    const fetchBalance = async (address: string) => (address === records[1].address ? 1_234n : 0n);
    const verdict = await preFundingCheck({ records, fetchBalance });
    expect(verdict.ok).toBe(false);
    expect(verdict.problems.join('\n')).toMatch(/already holds 1,234 microSTX/);
  });

  it('rejects two wizards sharing an address', async () => {
    const duplicated = records.map((record, index) => (index === 2 ? { ...record, address: records[0].address } : record));
    const verdict = await preFundingCheck({ records: duplicated, fetchBalance: zero });
    expect(verdict.ok).toBe(false);
    expect(verdict.problems.join('\n')).toMatch(/share the address/);
  });

  it('rejects malformed addresses before it looks at any balance', async () => {
    const fetchBalance = vi.fn(zero);
    const malformed = [{ ...records[0], address: 'ST3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X' }];
    const verdict = await preFundingCheck({ records: malformed, fetchBalance });
    expect(verdict.ok).toBe(false);
    expect(verdict.problems.join('\n')).toMatch(/must start with SP or SM/);
    expect(fetchBalance).not.toHaveBeenCalled();
  });

  it('rejects a typo that survives the shape check but fails the c32 checksum', async () => {
    const typo = `${records[0].address.slice(0, -1)}${records[0].address.at(-1) === 'Z' ? 'Y' : 'Z'}`;
    const verdict = await preFundingCheck({ records: [{ ...records[0], address: typo }], fetchBalance: zero });
    expect(verdict.ok).toBe(false);
    expect(verdict.problems.join('\n')).toMatch(/checksum|well-formed c32/);
  });

  it('rejects a collision with the deployer or the sponsor', async () => {
    for (const wallet of [DEPLOYER, SPONSOR]) {
      const verdict = await preFundingCheck({
        records: [{ ...records[0], address: wallet }],
        fetchBalance: zero
      });
      expect(verdict.ok).toBe(false);
      expect(verdict.problems.join('\n')).toMatch(/A wizard is disposable; that wallet is not/);
    }
    expect(KNOWN_PROJECT_WALLETS.map((wallet) => wallet.address)).toEqual([DEPLOYER, SPONSOR]);
  });

  it('accepts the c32 length range real wallets actually produce', () => {
    // c32check drops leading zero bytes, so a mainnet address is 41 characters
    // about three times in four, 40 about one time in four, and 39 about one in
    // 240. Pinning this at 41 would reject a quarter of perfectly good wallets
    // and send the operator off to regenerate a fleet that was never wrong.
    // Both of these are real, checksum-valid mainnet addresses.
    const shortButValid = ['SPFG4WPW393QVH5701X6T09HF3BA23100Z5SHC8R', 'SPSDCCYXF4W3PMWPGZKN4VX0TSCP5RTN05HDKC0'];
    expect(shortButValid.map((address) => address.length)).toEqual([40, 39]);
    for (const address of [...shortButValid, DEPLOYER, SPONSOR]) {
      expect(MAINNET_ADDRESS_PATTERN.test(address)).toBe(true);
      expect(addressProblems(address)).toEqual([]);
    }
    // and every address this repo's own generator produces passes
    for (const record of RECORDS) expect(addressProblems(record.address)).toEqual([]);
  });

  it('names what is wrong rather than just refusing', () => {
    expect(addressProblems('')).toEqual(['address is missing']);
    expect(addressProblems('SP1ILO')[0]).toMatch(/not well-formed c32/);
    // I, L, O and U are not in the c32 alphabet
    expect(addressProblems(`${DEPLOYER.slice(0, 5)}I${DEPLOYER.slice(6)}`)[0]).toMatch(/no I, L, O or U/);
    expect(addressProblems('SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX7432')[0]).toMatch(/fails its c32 checksum/);
  });
});

/* ------------------------------------------------------------------ */

describe('the funding poll', () => {
  const targets = RECORDS.map(({ id, name, address }) => ({ id, name, address, expectedUstx: DEFAULT_FUND_USTX }));

  const clock = () => {
    let value = 0;
    return { now: () => (value += 1_000), advance: (ms: number) => (value += ms) };
  };

  it('succeeds when every address reaches its target, and reports what arrived where', async () => {
    const ledger = new Map(targets.map((target) => [target.address, 0n]));
    const result = await pollFunding({
      targets,
      fetchBalance: async (address: string) => ledger.get(address) ?? 0n,
      now: clock().now,
      sleep: async () => {
        for (const address of ledger.keys()) ledger.set(address, DEFAULT_FUND_USTX);
      }
    });
    expect(result.ok).toBe(true);
    expect(result.timedOut).toBe(false);
    expect(result.polls).toBe(2);
    expect(result.flags).toEqual([]);
    expect(result.results.every((entry) => entry.arrived && entry.status === 'arrived')).toBe(true);
  });

  it('reports the shortfall when one address is underfunded, and times out cleanly', async () => {
    const short = 4_000_000n;
    const ticker = clock();
    const result = await pollFunding({
      targets,
      fetchBalance: async (address: string) => (address === targets[1].address ? short : DEFAULT_FUND_USTX),
      now: ticker.now,
      sleep: async () => ticker.advance(60_000),
      timeoutMs: 120_000
    });
    expect(result.ok).toBe(false);
    expect(result.timedOut).toBe(true);
    expect(result.waiting).toEqual([targets[1].address]);
    const underfunded = result.results.find((entry) => entry.address === targets[1].address);
    expect(underfunded?.status).toBe('short');
    expect(underfunded?.shortfallUstx).toBe(DEFAULT_FUND_USTX - short);
    expect(result.flags.map((flag) => flag.message).join('\n')).toMatch(/1,000,000 short of the 5,000,000 intended/);
  });

  it('times out with nothing sent at all, without hanging', async () => {
    const ticker = clock();
    const result = await pollFunding({
      targets,
      fetchBalance: async () => 0n,
      now: ticker.now,
      sleep: async () => ticker.advance(600_000),
      timeoutMs: 60_000
    });
    expect(result.ok).toBe(false);
    expect(result.timedOut).toBe(true);
    expect(result.polls).toBe(2);
    expect(result.waiting).toHaveLength(3);
    // nothing arrived, so nothing is flagged as the wrong amount
    expect(result.flags).toEqual([]);
  });

  it('flags an address that received suspiciously more than intended', async () => {
    const result = await pollFunding({
      targets,
      fetchBalance: async (address: string) =>
        address === targets[2].address ? DEFAULT_FUND_USTX * 10n : DEFAULT_FUND_USTX,
      now: clock().now
    });
    expect(result.ok).toBe(true);
    expect(result.flags).toHaveLength(1);
    expect(result.flags[0]).toMatchObject({ address: targets[2].address, status: 'over' });
    expect(result.flags[0].message).toMatch(/far more than the 5,000,000 intended/);
  });

  it('never asks for a balance it was not given a reader for', async () => {
    await expect(pollFunding({ targets })).rejects.toThrow(/needs a balance reader/);
  });
});

/* ------------------------------------------------------------------ */

describe('the baseline', () => {
  it('records the confirmed balances, the chain tip and the time', () => {
    const baseline = buildBaseline({
      results: RECORDS.map((record) => ({ ...record, balanceUstx: 5_000_000n })),
      chainTip: 8_700_000n,
      now: () => Date.UTC(2026, 6, 30, 12, 0, 0)
    });
    expect(baseline.recordedAt).toBe('2026-07-30T12:00:00.000Z');
    expect(baseline.chainTip).toBe('8700000');
    expect(baseline.totalUstx).toBe('15000000');
    expect(baseline.balances[0]).toMatchObject({ balanceUstx: '5000000', balanceStx: '5.000' });
  });
});

/* ------------------------------------------------------------------ */

describe('the dry-run gate', () => {
  it('builds the existing dry run and nothing else', () => {
    expect(dryRunGateCommand({ scriptPath: 'scripts/wizard/inscribe.mjs', wizardId: 'archivist' })).toEqual([
      'scripts/wizard/inscribe.mjs',
      '--wizard',
      'archivist'
    ]);
    expect(dryRunGateCommand({ scriptPath: 's.mjs', wizardId: 'skeptic', offline: true })).toContain('--offline');
  });

  it('refuses any command that could spend', () => {
    expect(() => assertDryRunCommandIsSafe(['s.mjs', '--broadcast'])).toThrow(WizardSafetyError);
    expect(() => assertDryRunCommandIsSafe(['s.mjs', '--BROADCAST'])).toThrow(/would spend real STX/);
  });
});

/* ------------------------------------------------------------------ */

describe('the whole seven-stage run, against fakes', () => {
  it('passes every stage and produces a complete report', async () => {
    const { ports, gateCalls, confirmed } = fakeRun();
    const { complete, results, report } = await runProvisioning({
      ports,
      options: { mode: 'dry', scriptPath: 'scripts/wizard/inscribe.mjs', offlineGate: true }
    });

    expect(complete).toBe(true);
    expect(results.map((result) => result.status)).toEqual(Array(7).fill('passed'));
    expect(report.complete).toBe(true);
    expect(confirmed).toEqual(['SAVED', 'FUND']);
    expect(gateCalls).toEqual([['scripts/wizard/inscribe.mjs', '--wizard', 'archivist', '--offline']]);
  });

  it('halts at stage 1 when a phrase was written down wrong', async () => {
    const { ports } = fakeRun({ askTranscription: async () => ['wrong', 'words'] });
    const { complete, results } = await runProvisioning({ ports, options: { mode: 'dry' } });
    expect(complete).toBe(false);
    expect(results[0].status).toBe('failed');
    expect(results[0].problems[0]).toMatch(/phrase you wrote down is not the phrase that was generated/);
    expect(results.slice(1).every((result) => result.status === 'blocked')).toBe(true);
  });

  it('halts at stage 2 when the operator does not confirm the block was saved', async () => {
    const { ports } = fakeRun({ confirm: async ({ expect: e }: { expect: string }) => e !== 'SAVED' });
    const { results } = await runProvisioning({ ports, options: { mode: 'dry' } });
    expect(results[1].status).toBe('failed');
    expect(results[1].problems[0]).toMatch(/an unrecorded key is a wallet/);
    expect(results[3].status).toBe('blocked');
  });

  it('halts at stage 4 when an address is not empty, and never reaches funding', async () => {
    const { ports, fleet } = fakeRun();
    const dirty = { ...ports, fetchBalance: async (address: string) => (address === fleet[0].address ? 7n : 0n) };
    const { results } = await runProvisioning({ ports: dirty, options: { mode: 'dry' } });
    expect(results[3].status).toBe('failed');
    expect(results[4].status).toBe('blocked');
    expect(results[6].status).toBe('blocked');
  });

  it('refuses to mark provisioning complete when the dry-run gate fails', async () => {
    const { ports } = fakeRun({ runGate: async () => ({ exitCode: 1, stderr: 'WizardSafetyError: nope' }) });
    const { complete, results, report } = await runProvisioning({ ports, options: { mode: 'dry' } });
    expect(complete).toBe(false);
    expect(report.complete).toBe(false);
    expect(results[6].status).toBe('failed');
    expect(results[6].problems[0]).toMatch(/exited 1. Provisioning is not complete/);
  });

  it('moves no funds: every balance it read is exactly what it started with', async () => {
    const { ports, ledger, fleet } = fakeRun();
    const before = new Map(ledger);
    await runProvisioning({ ports, options: { mode: 'dry' } });
    // the fake ledger is credited only by the test's own sleep, never by the run
    for (const wizard of fleet) {
      expect(before.get(wizard.address)).toBe(0n);
      expect(ledger.get(wizard.address)).toBe(DEFAULT_FUND_USTX);
    }
    // and it only ever read
    expect((ports.fetchBalance as ReturnType<typeof vi.fn>).mock.calls.length).toBeGreaterThan(0);
  });
});

/* ------------------------------------------------------------------ */

describe('the report', () => {
  it('carries every field a later reconciliation needs', async () => {
    const { ports } = fakeRun();
    const { report } = await runProvisioning({
      ports,
      options: { mode: 'dry', scriptPath: 'scripts/wizard/inscribe.mjs', offlineGate: true }
    });

    expect(report).toMatchObject({
      tool: 'scripts/wizard/provision.mjs',
      mode: 'dry',
      complete: true,
      challengeSeed: 'a-seed-fixed-for-tests'
    });
    expect(report.startedAt).toMatch(/^2026-07-30T12:00/);
    expect(report.finishedAt).toMatch(/^2026-07-30T12:00/);
    expect(report.stages).toHaveLength(7);
    expect(report.stages.map((stage: { status: string }) => stage.status)).toEqual(Array(7).fill('passed'));
    expect(report.wizards.map((wizard: { address: string }) => wizard.address)).toEqual(
      FLEET.map((wizard) => wizard.address)
    );
    expect(report.challenges).toHaveLength(3);
    expect(report.challenges[0]).toMatchObject({ wizardId: 'archivist' });
    expect(report.funding.expectedUstx).toBe('5000000');
    expect(report.funding.received.every((entry: { arrived: boolean }) => entry.arrived)).toBe(true);
    expect(report.baseline.chainTip).toBe('8700000');
    expect(report.baseline.totalUstx).toBe('15000000');
    expect(report.dryRunGate).toMatchObject({ ok: true, exitCode: 0 });
    // and it survives being written out
    expect(() => JSON.parse(JSON.stringify(report))).not.toThrow();
    expect(formatReport(report)).toContain('COMPLETE');
    expect(formatReport(report)).toContain('a-seed-fixed-for-tests');
  });

  it('contains no key and no phrase material, checked against the real values', async () => {
    const { ports } = fakeRun();
    const { report } = await runProvisioning({ ports, options: { mode: 'dry' } });
    const serialised = JSON.stringify(report) + formatReport(report);

    for (const wizard of FLEET) {
      expect(serialised).not.toContain(wizard.privateKey);
      expect(serialised).not.toContain(wizard.privateKey.replace(/01$/, ''));
      expect(serialised).not.toContain(wizard.mnemonic);
      const words = wizard.mnemonic.split(' ');
      for (let index = 0; index + 2 <= words.length; index += 1) {
        expect(serialised).not.toContain(words.slice(index, index + 2).join(' '));
      }
    }
    // the seed is in there on purpose: seed plus report reproduces the challenge
    expect(serialised).toContain(report.challengeSeed);
  });

  it('refuses to emit a report that leaked, so the guard is not decorative', () => {
    const wizard = FLEET[0];
    const secrets = {
      keys: [{ id: wizard.id, key: wizard.privateKey }],
      phrases: [{ id: wizard.id, phrase: wizard.mnemonic }]
    };
    expect(() => assertReportIsSecretFree({ ok: true }, secrets)).not.toThrow();
    expect(() => assertReportIsSecretFree({ note: wizard.privateKey }, secrets)).toThrow(/private key for archivist/);
    expect(() => assertReportIsSecretFree({ note: wizard.mnemonic }, secrets)).toThrow(/recovery phrase for archivist/);
    expect(() =>
      assertReportIsSecretFree({ note: wizard.mnemonic.split(' ').slice(2, 5).join(' ') }, secrets)
    ).toThrow(/phrase material for archivist/);
    // and the refusal never quotes what it found
    try {
      assertReportIsSecretFree({ note: wizard.privateKey }, secrets);
    } catch (error) {
      expect(String((error as Error).message)).not.toContain(wizard.privateKey);
    }
  });

  it('is built by buildReport with no secrets required', () => {
    const report = buildReport({
      mode: 'live',
      startedAt: 'a',
      finishedAt: 'b',
      stages: [{ number: 1, id: 'generate', title: 'Generate', status: 'failed', problems: ['x'] }],
      wizards: []
    });
    expect(report.complete).toBe(false);
    expect(report.funding).toBeNull();
    expect(report.baseline).toBeNull();
    expect(formatReport(report)).toContain('INCOMPLETE');
  });
});

/* ------------------------------------------------------------------ */

describe('it never broadcasts', () => {
  const source = readFileSync(new URL('../provision-core.mjs', import.meta.url), 'utf8');

  it('has no code path that signs or sends a transaction', () => {
    expect(source).not.toMatch(/\bbroadcastTransaction\b/);
    expect(source).not.toMatch(/\bmakeContractCall\b/);
    expect(source).not.toMatch(/\bmakeSTXTokenTransfer\b/);
    expect(source).not.toMatch(/\bmakeStandardSTXPostCondition\b/);
    expect(source).not.toMatch(/\bsignTransaction\b/);
    expect(source).not.toMatch(/\/v2\/transactions/);
  });

  it('imports only read-only helpers from @stacks/transactions', () => {
    const imported = source.match(/import \{([^}]*)\} from '@stacks\/transactions';/)?.[1] ?? '';
    expect(imported.split(',').map((name) => name.trim()).filter(Boolean).sort()).toEqual([
      'TransactionVersion',
      'getAddressFromPrivateKey',
      'validateStacksAddress'
    ]);
  });

  it('issues a plain GET for a balance, with no body', async () => {
    const fetchImpl = vi.fn(async () => Response.json({ balance: '0' }));
    const read = makeBalanceReader({ fetchImpl: fetchImpl as unknown as typeof fetch, hiroUrl: 'https://example.test' });
    expect(await read(DEPLOYER)).toBe(0n);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit | undefined];
    expect(String(url)).toBe(`https://example.test/extended/v2/addresses/${DEPLOYER}/balances/stx`);
    expect(init?.method ?? 'GET').toBe('GET');
    expect(init?.body).toBeUndefined();
  });

  it('writes nothing: the env block is returned as a string, never to disk', () => {
    expect(source).not.toMatch(/writeFileSync|appendFileSync|createWriteStream/);
    expect(typeof envBlockFor(FLEET)).toBe('string');
  });
});
