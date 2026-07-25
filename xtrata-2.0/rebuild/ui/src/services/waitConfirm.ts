import { XtrataClientError, type ChainTxResult } from '@xtrata/collections-client';

/**
 * Transaction confirmation polling.
 *
 * Returns the client's `ChainTxResult` (== `TxStatus`) shape. A transaction
 * that is still pending when the window closes resolves as `pending`, NOT as an
 * error: the executor treats that as "lost" and re-reads chain state rather
 * than resubmitting. Only transport failures throw.
 */

export interface WaitConfirmConfig {
  apiBaseUrl: string;
  /** Poll interval in ms. Default 4s. */
  intervalMs?: number;
  /** Give up (as `pending`) after this long. Default 20 minutes. */
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
  sleep?: (ms: number) => Promise<void>;
  now?: () => number;
}

interface ApiTx {
  tx_status?: string;
  tx_result?: { repr?: string };
  block_height?: number;
}

const CHAIN_ERROR_RE = /\(err\s+u(\d+)\)/;

/** Map the API's `tx_status` onto the client's status union. */
export const mapTxStatus = (status: string | undefined): ChainTxResult['status'] => {
  switch (status) {
    case 'success':
      return 'success';
    case 'abort_by_response':
      return 'abort_by_response';
    case 'abort_by_post_condition':
      return 'abort_by_post_condition';
    case 'dropped_replace_by_fee':
    case 'dropped_replace_across_fork':
    case 'dropped_too_expensive':
    case 'dropped_stale_garbage_collect':
    case 'dropped_problematic':
      return 'dropped';
    default:
      return 'pending';
  }
};

/** Pull `uNNN` out of a `(err uNNN)` result repr, when present. */
export const parseChainErrorCode = (repr: string | undefined): number | undefined => {
  if (typeof repr !== 'string') return undefined;
  const match = CHAIN_ERROR_RE.exec(repr);
  return match ? Number(match[1]) : undefined;
};

export const fetchTxStatus = async (
  config: WaitConfirmConfig,
  txid: string
): Promise<ChainTxResult> => {
  const base = config.apiBaseUrl.replace(/\/+$/, '');
  const doFetch = config.fetchImpl ?? globalThis.fetch.bind(globalThis);
  const id = txid.startsWith('0x') ? txid : `0x${txid}`;

  let response: Response;
  try {
    response = await doFetch(`${base}/extended/v1/tx/${id}`);
  } catch (cause) {
    throw new XtrataClientError('broadcast-failed', `could not read status of ${id}`, { cause });
  }

  // Not yet indexed — the mempool view lags the broadcast.
  if (response.status === 404) return { txid: id, status: 'pending' };
  if (!response.ok) {
    throw new XtrataClientError(
      'broadcast-failed',
      `tx status for ${id} returned HTTP ${response.status}`
    );
  }

  const body = (await response.json()) as ApiTx;
  const status = mapTxStatus(body.tx_status);
  const chainErrorCode = parseChainErrorCode(body.tx_result?.repr);
  return {
    txid: id,
    status,
    ...(chainErrorCode !== undefined ? { chainErrorCode } : {}),
    ...(typeof body.block_height === 'number' ? { blockHeight: body.block_height } : {})
  };
};

export const createWaitConfirm = (
  config: WaitConfirmConfig
): ((txid: string) => Promise<ChainTxResult>) => {
  const intervalMs = config.intervalMs ?? 4_000;
  const timeoutMs = config.timeoutMs ?? 20 * 60_000;
  const now = config.now ?? (() => Date.now());
  const sleep =
    config.sleep ??
    ((ms: number) =>
      new Promise<void>((resolve) => {
        setTimeout(resolve, ms);
      }));

  return async (txid: string) => {
    const deadline = now() + timeoutMs;
    let last: ChainTxResult = { txid, status: 'pending' };
    for (;;) {
      last = await fetchTxStatus(config, txid);
      if (last.status !== 'pending') return last;
      if (now() >= deadline) return last; // still pending: caller re-observes.
      await sleep(intervalMs);
    }
  };
};
