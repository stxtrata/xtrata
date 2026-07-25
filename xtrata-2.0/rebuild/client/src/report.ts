import type { Manifest } from './manifest.js';
import type { ItemProgress } from './progress.js';
import { rollup } from './progress.js';

/** Final collection run report — serializable to JSON and markdown. */

export interface ItemOutcome {
  index: number;
  fileName: string;
  state: ItemProgress['state'];
  tokenId?: number;
  txCount: number;
  feePaidMicroStx: string;
  error?: string;
}

export interface CollectionReport {
  collectionName: string;
  network: Manifest['network'];
  manifestChecksum: string;
  generatedAt: string;
  totals: {
    items: number;
    succeeded: number;
    failed: number;
    expired: number;
    inFlight: number;
    txCount: number;
    feePaidMicroStx: string;
    estimatedFeeMicroStx?: string;
    feeDeltaMicroStx?: string; // paid − estimated (negative = under estimate)
  };
  items: ItemOutcome[];
}

export interface BuildReportParams {
  manifest: Manifest;
  progress: readonly ItemProgress[];
  estimatedFeeMicroStx?: bigint;
  now?: () => Date;
}

export const buildReport = (params: BuildReportParams): CollectionReport => {
  const { manifest, progress } = params;
  const agg = rollup(progress);
  const byIndex = new Map(progress.map((p) => [p.index, p]));

  const items: ItemOutcome[] = manifest.items.map((item) => {
    const p = byIndex.get(item.index);
    return {
      index: item.index,
      fileName: item.fileName,
      state: p?.state ?? 'prepared',
      ...(p?.tokenId !== undefined ? { tokenId: p.tokenId } : {}),
      txCount: p?.txids.length ?? 0,
      feePaidMicroStx: (p?.feePaidMicroStx ?? 0n).toString(),
      ...(p?.error !== undefined ? { error: p.error } : {})
    };
  });

  const totals: CollectionReport['totals'] = {
    items: manifest.items.length,
    succeeded: agg.done,
    failed: agg.failed,
    expired: agg.expired,
    inFlight: agg.inFlight,
    txCount: progress.reduce((sum, p) => sum + p.txids.length, 0),
    feePaidMicroStx: agg.totalFeePaidMicroStx.toString()
  };
  if (params.estimatedFeeMicroStx !== undefined) {
    totals.estimatedFeeMicroStx = params.estimatedFeeMicroStx.toString();
    totals.feeDeltaMicroStx = (agg.totalFeePaidMicroStx - params.estimatedFeeMicroStx).toString();
  }

  return {
    collectionName: manifest.collection.name,
    network: manifest.network,
    manifestChecksum: manifest.checksum,
    generatedAt: (params.now ?? (() => new Date()))().toISOString(),
    totals,
    items
  };
};

export const reportToJson = (report: CollectionReport): string => JSON.stringify(report, null, 2);

const microToStx = (micro: string): string => {
  const value = BigInt(micro);
  const abs = value < 0n ? -value : value;
  const sign = value < 0n ? '-' : '';
  return `${sign}${abs / 1_000_000n}.${(abs % 1_000_000n).toString().padStart(6, '0')} STX`;
};

export const reportToMarkdown = (report: CollectionReport): string => {
  const lines: string[] = [];
  lines.push(`# Collection Report — ${report.collectionName}`);
  lines.push('');
  lines.push(`- Network: ${report.network}`);
  lines.push(`- Manifest checksum: \`${report.manifestChecksum}\``);
  lines.push(`- Generated: ${report.generatedAt}`);
  lines.push('');
  lines.push('## Totals');
  lines.push('');
  lines.push(`| Items | Succeeded | Failed | Expired | In flight | Txs | Fees paid |`);
  lines.push(`|---|---|---|---|---|---|---|`);
  lines.push(
    `| ${report.totals.items} | ${report.totals.succeeded} | ${report.totals.failed} | ` +
      `${report.totals.expired} | ${report.totals.inFlight} | ${report.totals.txCount} | ` +
      `${microToStx(report.totals.feePaidMicroStx)} |`
  );
  if (report.totals.estimatedFeeMicroStx !== undefined) {
    lines.push('');
    lines.push(
      `Estimate: ${microToStx(report.totals.estimatedFeeMicroStx)} · ` +
        `Delta: ${microToStx(report.totals.feeDeltaMicroStx ?? '0')}`
    );
  }
  lines.push('');
  lines.push('## Items');
  lines.push('');
  lines.push('| # | File | State | Token | Txs | Fees | Error |');
  lines.push('|---|---|---|---|---|---|---|');
  for (const item of report.items) {
    lines.push(
      `| ${item.index} | ${item.fileName} | ${item.state} | ` +
        `${item.tokenId ?? '—'} | ${item.txCount} | ${microToStx(item.feePaidMicroStx)} | ` +
        `${item.error ?? ''} |`
    );
  }
  lines.push('');
  return lines.join('\n');
};
