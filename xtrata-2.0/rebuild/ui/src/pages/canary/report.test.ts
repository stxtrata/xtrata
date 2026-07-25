import { describe, expect, it } from 'vitest';
import { PRODUCTION_APPROVAL_PHRASE } from './arming';
import { STAGE_IDS } from './stages';
import { CanaryStore, type StageRunner } from './store';
import {
  buildCanaryReport,
  REPORT_SCHEMA,
  reportFileName,
  reportToJson,
  reportToMarkdown
} from './report';
import { buildActivationConfig } from './runners';
import type { CanaryDeployConfig } from './config';

/**
 * The report is what survives a run that goes wrong, so the property under test
 * is that a PARTIAL run still produces a complete, honest document: every stage
 * present, the untouched ones marked as never run, and attestations never
 * readable as machine evidence.
 */

const config: CanaryDeployConfig = {
  network: 'testnet',
  deployerAddress: 'ST3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQR6P0PT',
  apiBaseUrl: 'https://api.testnet.hiro.so',
  coreContractId: 'ST3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQR6P0PT.xtrata-v3-2-3',
  dropsContractName: 'xtrata-drops-v3',
  collectionContractName: 'xtrata-canary-collection',
  relayerBaseUrl: null
};

let clock = 0;
const makeStore = (): CanaryStore => {
  clock = 0;
  return new CanaryStore({ config, now: () => new Date(1_700_000_000_000 + (clock += 5_000)) });
};

const pass: StageRunner = async (api) => {
  api.evidence({ label: 'Deployer', value: config.deployerAddress, tone: 'ok' });
};

const now = () => new Date('2026-07-24T12:00:00.000Z');

describe('partial-run report', () => {
  it('includes every stage even when only the first has run', async () => {
    const store = makeStore();
    await store.runStage('sources', pass);

    const report = buildCanaryReport(store.getState(), { now });
    expect(report.schema).toBe(REPORT_SCHEMA);
    expect(report.stages).toHaveLength(STAGE_IDS.length);
    expect(report.complete).toBe(false);
    expect(report.totals.passed).toBe(1);
    expect(report.totals.pending).toBe(STAGE_IDS.length - 1);
    expect(report.stages.filter((stage) => stage.status === 'pending')).toHaveLength(
      STAGE_IDS.length - 1
    );
  });

  it('captures evidence, timestamps and durations for the stages that ran', async () => {
    const store = makeStore();
    await store.runStage('sources', pass);

    const [stage] = buildCanaryReport(store.getState(), { now }).stages;
    expect(stage!.evidence).toEqual([
      { label: 'Deployer', value: config.deployerAddress, tone: 'ok' }
    ]);
    expect(stage!.startedAt).toBeDefined();
    expect(stage!.durationMs).toBe(5_000);
  });

  it('records a failure with its message and leaves later stages not-run', async () => {
    const store = makeStore();
    await store.runStage('sources', async () => {
      throw new Error('config has 2 problems');
    });

    const report = buildCanaryReport(store.getState(), { now });
    expect(report.totals.failed).toBe(1);
    expect(report.stages[0]!.error).toMatch(/2 problems/);
    expect(report.stages[1]!.status).toBe('pending');
  });

  it('records a skip with its reason', async () => {
    const store = makeStore();
    await store.runStage('sources', pass);
    store.attest('contract-tests', {
      commands: ['clarinet check'],
      output: 'ok',
      outcome: 'passed',
      attestedBy: 'operator'
    });
    await store.runStage('source-parity', pass);
    store.attest('client-tests', {
      commands: ['npm test'],
      output: 'ok',
      outcome: 'passed',
      attestedBy: 'operator'
    });
    for (const id of ['testnet-deploy', 'testnet-verify', 'collection-canary', 'inscription-canary', 'drop-canary'] as const) {
      await store.runStage(id, pass);
    }
    store.skipStage('sponsored-claim-canary', 'no relayer configured for this build');

    const report = buildCanaryReport(store.getState(), { now });
    const skipped = report.stages.find((stage) => stage.id === 'sponsored-claim-canary')!;
    expect(skipped.status).toBe('skipped');
    expect(skipped.skipReason).toBe('no relayer configured for this build');
    expect(report.totals.skipped).toBe(1);
  });

  it('never lets an attested stage read as machine-verified', async () => {
    const store = makeStore();
    await store.runStage('sources', pass);
    store.attest('contract-tests', {
      commands: ['cd rebuild/contracts && clarinet check && npm test'],
      output: '124 tests passed',
      outcome: 'passed',
      attestedBy: 'jim'
    });

    const report = buildCanaryReport(store.getState(), { now });
    const stage = report.stages.find((entry) => entry.id === 'contract-tests')!;
    expect(stage.verification).toBe('attested');
    expect(stage.attestation).toEqual({
      commands: ['cd rebuild/contracts && clarinet check && npm test'],
      outcome: 'passed',
      attestedBy: 'jim',
      attestedAt: expect.any(String),
      output: '124 tests passed'
    });
    expect(report.totals.operatorAttested).toBe(1);
    // Passed AND attested, but not counted as machine-verified.
    expect(report.totals.machineVerified).toBe(1);
  });

  it('is JSON-serializable including bigint-free deploy records', async () => {
    const store = makeStore();
    await store.runStage('sources', async (api) => {
      api.patch({
        deployables: [
          {
            id: 'drops',
            contractName: 'xtrata-drops-v3',
            contractId: `${config.deployerAddress}.xtrata-drops-v3`,
            clarityVersion: 4,
            source: '(ok true)',
            sourceHash: 'a'.repeat(64),
            dependencies: [config.coreContractId],
            substitutions: []
          }
        ]
      });
    });

    const report = buildCanaryReport(store.getState(), { now });
    const parsed = JSON.parse(reportToJson(report)) as typeof report;
    expect(parsed.intendedSources).toEqual([
      {
        id: 'drops',
        contractId: `${config.deployerAddress}.xtrata-drops-v3`,
        clarityVersion: 4,
        sourceHash: 'a'.repeat(64)
      }
    ]);
  });
});

describe('markdown rendering', () => {
  it('renders a partial run with an explicit incompleteness warning', async () => {
    const store = makeStore();
    await store.runStage('sources', pass);
    const markdown = reportToMarkdown(buildCanaryReport(store.getState(), { now }));

    expect(markdown).toContain('# Xtrata deployment canary report');
    expect(markdown).toContain('Complete: NO — this is a partial run');
    for (const id of STAGE_IDS) {
      expect(markdown).toContain(`| ${STAGE_IDS.indexOf(id) + 1} |`);
    }
    expect(markdown).toContain('not run');
  });

  it('marks attested stages loudly in the table', async () => {
    const store = makeStore();
    await store.runStage('sources', pass);
    store.attest('contract-tests', {
      commands: ['clarinet check'],
      output: 'ok',
      outcome: 'passed',
      attestedBy: 'jim'
    });
    const markdown = reportToMarkdown(buildCanaryReport(store.getState(), { now }));
    expect(markdown).toContain('OPERATOR-ATTESTED (not machine-verified)');
    expect(markdown).toContain('Attested by jim');
  });

  it('escapes pipes so evidence cannot break the table', async () => {
    const store = makeStore();
    await store.runStage('sources', async (api) => {
      api.evidence({ label: 'weird', value: 'a | b' });
    });
    const markdown = reportToMarkdown(buildCanaryReport(store.getState(), { now }));
    expect(markdown).toContain('- weird: a | b');
  });

  it('names the file by network and generation time', async () => {
    const store = makeStore();
    const report = buildCanaryReport(store.getState(), { now });
    expect(reportFileName(report, 'json')).toBe(
      'xtrata-canary-testnet-2026-07-24T12-00-00-000Z.json'
    );
    expect(reportFileName(report, 'md')).toMatch(/\.md$/);
  });
});

describe('activation configuration', () => {
  it('emits nothing for a network with no confirmed deployment', () => {
    const store = makeStore();
    const config = buildActivationConfig(store.getState(), now);
    expect(config.networks).toEqual({});
    expect(config.relayer.allowlist).toEqual([]);
  });

  it('emits per-network contract ids and a relayer allowlist from confirmed deploys', async () => {
    const store = makeStore();
    await store.runStage('sources', async (api) => {
      api.patch({
        deploys: {
          'testnet-deploy': [
            {
              id: 'drops',
              contractId: 'ST3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQR6P0PT.xtrata-drops-v3',
              clarityVersion: 4,
              sourceHash: 'a'.repeat(64),
              status: 'confirmed'
            }
          ],
          'production-deploy': [
            {
              id: 'drops',
              contractId: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-drops-v3',
              clarityVersion: 4,
              sourceHash: 'b'.repeat(64),
              status: 'failed'
            }
          ]
        }
      });
    });

    const activation = buildActivationConfig(store.getState(), now);
    expect(Object.keys(activation.networks)).toEqual(['testnet']);
    // A failed mainnet deploy must never reach the relayer allowlist.
    expect(activation.relayer.allowlist).toEqual([
      'ST3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQR6P0PT.xtrata-drops-v3'
    ]);
  });
});

describe('a full run', () => {
  it('reports complete once every stage is settled', async () => {
    const store = makeStore();
    for (const id of STAGE_IDS) {
      if (id === 'contract-tests' || id === 'client-tests') {
        store.attest(id, {
          commands: ['x'],
          output: 'ok',
          outcome: 'passed',
          attestedBy: 'operator'
        });
      } else if (id === 'production-approval') {
        store.approveProduction({
          phrase: PRODUCTION_APPROVAL_PHRASE,
          expectedPhrase: PRODUCTION_APPROVAL_PHRASE,
          acknowledgedImmutability: true,
          approvedBy: 'operator'
        });
      } else {
        await store.runStage(id, pass);
      }
    }
    const report = buildCanaryReport(store.getState(), { now });
    expect(report.complete).toBe(true);
    expect(report.totals.pending).toBe(0);
    expect(report.totals.operatorAttested).toBe(2);
  });
});
