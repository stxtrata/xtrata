import {
  isSettled,
  stageDefinition,
  STAGE_IDS,
  type StageId,
  type StageStatus,
  type StageVerification
} from './stages';
import type { CanaryState, DeployRecord, EvidenceEntry, VerificationRecord } from './store';

/**
 * The deployment report.
 *
 * Built from whatever the run has produced SO FAR — a canary abandoned at stage
 * 6 still yields a complete, honest report of stages 1–6 plus nine untouched
 * stages. That is the point: the report is the artefact you keep when something
 * goes wrong, so it must never depend on the run finishing.
 *
 * Two invariants the tests hold this to:
 * - every stage appears, including the ones that never ran;
 * - `verification` travels with each stage, so an attested stage can never be
 *   read back as machine-verified evidence.
 */

export const REPORT_SCHEMA = 'xtrata.canary.report/1';

export interface ReportStage {
  id: StageId;
  number: number;
  title: string;
  status: StageStatus;
  verification: StageVerification;
  startedAt?: string;
  finishedAt?: string;
  durationMs?: number;
  evidence: EvidenceEntry[];
  error?: string;
  skipReason?: string;
  attestation?: {
    commands: string[];
    outcome: 'passed' | 'failed';
    attestedBy: string;
    attestedAt: string;
    output: string;
  };
}

export interface CanaryReport {
  schema: typeof REPORT_SCHEMA;
  generatedAt: string;
  startedAt: string;
  /** True once every stage is settled. */
  complete: boolean;
  config: {
    network: string;
    deployerAddress: string;
    apiBaseUrl: string;
    coreContractId: string;
    dropsContractName: string;
    collectionContractName: string;
    relayerBaseUrl: string | null;
  };
  totals: {
    stages: number;
    passed: number;
    failed: number;
    skipped: number;
    pending: number;
    machineVerified: number;
    operatorAttested: number;
  };
  intendedSources: { id: string; contractId: string; clarityVersion: number; sourceHash: string }[];
  deploys: { stage: string; records: DeployRecord[] }[];
  verifications: { stage: string; records: VerificationRecord[] }[];
  nameConflicts: CanaryState['nameConflicts'];
  reviewNotes: string;
  stages: ReportStage[];
}

const durationOf = (stage: { startedAt?: string; finishedAt?: string }): number | undefined => {
  if (!stage.startedAt || !stage.finishedAt) return undefined;
  const ms = Date.parse(stage.finishedAt) - Date.parse(stage.startedAt);
  return Number.isFinite(ms) ? ms : undefined;
};

export const buildCanaryReport = (
  state: CanaryState,
  options: { now?: () => Date } = {}
): CanaryReport => {
  const now = options.now ?? (() => new Date());

  const stages: ReportStage[] = STAGE_IDS.map((id) => {
    const definition = stageDefinition(id);
    const stage = state.stages[id];
    const duration = durationOf(stage);
    return {
      id,
      number: definition.number,
      title: definition.title,
      status: stage.status,
      verification: definition.verification,
      ...(stage.startedAt !== undefined ? { startedAt: stage.startedAt } : {}),
      ...(stage.finishedAt !== undefined ? { finishedAt: stage.finishedAt } : {}),
      ...(duration !== undefined ? { durationMs: duration } : {}),
      evidence: stage.evidence,
      ...(stage.error !== undefined ? { error: stage.error } : {}),
      ...(stage.skipReason !== undefined ? { skipReason: stage.skipReason } : {}),
      ...(stage.attestation !== undefined
        ? {
            attestation: {
              commands: stage.attestation.commands,
              outcome: stage.attestation.outcome,
              attestedBy: stage.attestation.attestedBy,
              attestedAt: stage.attestation.attestedAt,
              output: stage.attestation.output
            }
          }
        : {})
    };
  });

  const count = (status: StageStatus): number => stages.filter((s) => s.status === status).length;

  return {
    schema: REPORT_SCHEMA,
    generatedAt: now().toISOString(),
    startedAt: state.startedAt,
    complete: stages.every((stage) => isSettled(stage.status)),
    config: {
      network: state.config.network,
      deployerAddress: state.config.deployerAddress,
      apiBaseUrl: state.config.apiBaseUrl,
      coreContractId: state.config.coreContractId,
      dropsContractName: state.config.dropsContractName,
      collectionContractName: state.config.collectionContractName,
      relayerBaseUrl: state.config.relayerBaseUrl
    },
    totals: {
      stages: stages.length,
      passed: count('passed'),
      failed: count('failed'),
      skipped: count('skipped'),
      pending: count('pending') + count('running'),
      machineVerified: stages.filter((s) => s.verification === 'machine' && s.status === 'passed').length,
      operatorAttested: stages.filter((s) => s.attestation !== undefined).length
    },
    intendedSources: state.deployables.map((deployable) => ({
      id: deployable.id,
      contractId: deployable.contractId,
      clarityVersion: deployable.clarityVersion,
      sourceHash: deployable.sourceHash
    })),
    deploys: (['testnet-deploy', 'production-deploy'] as const).map((stage) => ({
      stage,
      records: state.deploys[stage]
    })),
    verifications: (['testnet-verify', 'production-verify'] as const).map((stage) => ({
      stage,
      records: state.verifications[stage]
    })),
    nameConflicts: state.nameConflicts,
    reviewNotes: state.reviewNotes,
    stages
  };
};

export const reportToJson = (report: CanaryReport): string => JSON.stringify(report, null, 2);

const STATUS_MARK: Record<StageStatus, string> = {
  passed: 'PASS',
  failed: 'FAIL',
  skipped: 'SKIP',
  running: 'RUNNING',
  pending: 'not run'
};

const VERIFICATION_NOTE: Record<StageVerification, string> = {
  machine: 'machine-verified',
  attested: 'OPERATOR-ATTESTED (not machine-verified)',
  'operator-review': 'operator review'
};

const escapeCell = (value: string): string => value.replace(/\|/g, '\\|').replace(/\n/g, ' ');

export const reportToMarkdown = (report: CanaryReport): string => {
  const lines: string[] = [];

  lines.push('# Xtrata deployment canary report');
  lines.push('');
  lines.push(`- Generated: ${report.generatedAt}`);
  lines.push(`- Run started: ${report.startedAt}`);
  lines.push(`- Complete: ${report.complete ? 'yes' : 'NO — this is a partial run'}`);
  lines.push(`- Network: ${report.config.network}`);
  lines.push(`- Deployer: ${report.config.deployerAddress || '(not connected)'}`);
  lines.push(`- Core: ${report.config.coreContractId}`);
  lines.push(`- Relayer: ${report.config.relayerBaseUrl ?? '(none configured)'}`);
  lines.push('');
  lines.push(
    `Totals: ${report.totals.passed} passed, ${report.totals.failed} failed, ` +
      `${report.totals.skipped} skipped, ${report.totals.pending} not run ` +
      `(of ${report.totals.stages}). ${report.totals.operatorAttested} stage(s) rest on an operator attestation.`
  );
  lines.push('');

  lines.push('## Stages');
  lines.push('');
  lines.push('| # | Stage | Status | Verification | Duration |');
  lines.push('|---|---|---|---|---|');
  for (const stage of report.stages) {
    lines.push(
      `| ${stage.number} | ${escapeCell(stage.title)} | ${STATUS_MARK[stage.status]} | ` +
        `${VERIFICATION_NOTE[stage.verification]} | ${
          stage.durationMs !== undefined ? `${Math.round(stage.durationMs / 1000)}s` : '—'
        } |`
    );
  }
  lines.push('');

  if (report.intendedSources.length > 0) {
    lines.push('## Intended sources');
    lines.push('');
    lines.push('| Contract | Clarity | sha256 |');
    lines.push('|---|---|---|');
    for (const source of report.intendedSources) {
      lines.push(`| ${source.contractId} | ${source.clarityVersion} | \`${source.sourceHash}\` |`);
    }
    lines.push('');
  }

  for (const group of report.deploys) {
    if (group.records.length === 0) continue;
    lines.push(`## Deployments — ${group.stage}`);
    lines.push('');
    lines.push('| Contract | Clarity | Status | txid | sha256 |');
    lines.push('|---|---|---|---|---|');
    for (const record of group.records) {
      lines.push(
        `| ${record.contractId} | ${record.clarityVersion} | ${record.status} | ` +
          `${record.txid ?? '—'} | \`${record.sourceHash}\` |`
      );
    }
    lines.push('');
  }

  for (const group of report.verifications) {
    if (group.records.length === 0) continue;
    lines.push(`## On-chain verification — ${group.stage}`);
    lines.push('');
    for (const record of group.records) {
      lines.push(`### ${record.contractId}`);
      if (record.parity) {
        lines.push(
          `- Source parity: **${record.parity.match}** (expected \`${record.parity.expectedHash}\`, ` +
            `on-chain \`${record.parity.actualHash}\`)`
        );
      }
      if (record.interfaceProbe) {
        const probe = record.interfaceProbe;
        lines.push(
          `- Interface probe: ${probe.ok ? 'OK' : 'MISMATCH'} — ${probe.localCount} local / ` +
            `${probe.onChainCount} on-chain callable functions`
        );
        if (probe.missing.length > 0) {
          lines.push(`  - Missing on chain: ${probe.missing.map((fn) => fn.name).join(', ')}`);
        }
        if (probe.unexpected.length > 0) {
          lines.push(`  - Unexpected on chain: ${probe.unexpected.map((fn) => fn.name).join(', ')}`);
        }
        if (probe.mismatched.length > 0) {
          lines.push(
            `  - Arity/access mismatch: ${probe.mismatched
              .map((entry) => `${entry.name} (local ${entry.local.arity}, chain ${entry.onChain.arity})`)
              .join(', ')}`
          );
        }
      }
      if (record.dependencies) {
        lines.push(
          `- Dependencies: ${record.dependencies.ok ? 'OK' : 'MISMATCH'} — found ${
            record.dependencies.found.join(', ') || 'none'
          }`
        );
        if (record.dependencies.missing.length > 0) {
          lines.push(`  - Missing: ${record.dependencies.missing.join(', ')}`);
        }
        if (record.dependencies.unexpected.length > 0) {
          lines.push(`  - Unexpected: ${record.dependencies.unexpected.join(', ')}`);
        }
      }
      lines.push('');
    }
  }

  if (report.nameConflicts.length > 0) {
    lines.push('## Name-conflict preflight');
    lines.push('');
    for (const conflict of report.nameConflicts) {
      lines.push(`- ${conflict.contractId}: **${conflict.status}** — ${conflict.detail}`);
    }
    lines.push('');
  }

  lines.push('## Evidence');
  lines.push('');
  for (const stage of report.stages) {
    lines.push(`### ${stage.number}. ${stage.title} — ${STATUS_MARK[stage.status]}`);
    lines.push('');
    lines.push(`_${VERIFICATION_NOTE[stage.verification]}_`);
    lines.push('');
    if (stage.skipReason) lines.push(`- Skipped: ${stage.skipReason}`);
    if (stage.error) lines.push(`- Error: ${stage.error}`);
    if (stage.attestation) {
      lines.push(
        `- Attested by ${stage.attestation.attestedBy} at ${stage.attestation.attestedAt}: ` +
          `**${stage.attestation.outcome}**`
      );
      lines.push(`- Commands: \`${stage.attestation.commands.join(' && ')}\``);
      lines.push('');
      lines.push('```');
      lines.push(stage.attestation.output);
      lines.push('```');
    }
    for (const entry of stage.evidence) {
      lines.push(`- ${entry.label}: ${entry.value.replace(/\n/g, ' / ')}`);
    }
    if (
      stage.evidence.length === 0 &&
      !stage.skipReason &&
      !stage.error &&
      !stage.attestation
    ) {
      lines.push('- (no evidence recorded)');
    }
    lines.push('');
  }

  if (report.reviewNotes.trim().length > 0) {
    lines.push('## Operator review notes');
    lines.push('');
    lines.push(report.reviewNotes);
    lines.push('');
  }

  return lines.join('\n');
};

/** Stable, sortable file name so several runs can sit in one folder. */
export const reportFileName = (report: CanaryReport, extension: 'json' | 'md'): string =>
  `xtrata-canary-${report.config.network}-${report.generatedAt.replace(/[:.]/g, '-')}.${extension}`;

/** Browser download. Split out so the builders above stay pure and testable. */
export const downloadReport = (
  report: CanaryReport,
  format: 'json' | 'md',
  documentRef: Document = document
): void => {
  const body = format === 'json' ? reportToJson(report) : reportToMarkdown(report);
  const type = format === 'json' ? 'application/json' : 'text/markdown';
  const url = URL.createObjectURL(new Blob([body], { type: `${type};charset=utf-8` }));
  const anchor = documentRef.createElement('a');
  anchor.href = url;
  anchor.download = reportFileName(report, format);
  documentRef.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};
