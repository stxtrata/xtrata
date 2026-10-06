// Read-only leaderboard lookups shared by /arcade/submit and the viewer's
// in-place submit dialog. A failed read throws; it is never read as "empty".
import { cvToHex, cvToValue, hexToCV, Cl, principalCV, type ClarityValue } from '@stacks/transactions';
import { ARCADE_CONTRACT, CORE_CONTRACT, type BoardInfo, type SubmitPayload } from './core';

const API_BASES = ['/hiro/mainnet', 'https://api.mainnet.hiro.so'];

function timeoutSignal(ms: number): AbortSignal | undefined {
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') return AbortSignal.timeout(ms);
  if (typeof AbortController === 'undefined') return undefined;
  const c = new AbortController(); setTimeout(() => c.abort(), ms); return c.signal;
}

export async function readOnly(fn: string, args: ClarityValue[], contract: { address: string; name: string } = ARCADE_CONTRACT): Promise<unknown> {
  const body = JSON.stringify({ sender: ARCADE_CONTRACT.address, arguments: args.map((a) => cvToHex(a)) });
  let lastError: unknown;
  for (const base of API_BASES) {
    try {
      const r = await fetch(`${base}/v2/contracts/call-read/${contract.address}/${contract.name}/${fn}`, {
        method: 'POST', headers: { 'content-type': 'application/json' }, body, signal: timeoutSignal(12000)
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const j = await r.json();
      if (!j.okay) throw new Error(j.cause || 'read failed');
      return cvToValue(hexToCV(j.result), true);
    } catch (e) { lastError = e; }
  }
  throw lastError instanceof Error ? lastError : new Error('Could not reach the Stacks API');
}

export async function loadBoard(board: string): Promise<BoardInfo> {
  const v = (await readOnly('get-board', [Cl.stringAscii(board)])) as { value?: Record<string, { value: string | boolean }> } | null;
  if (!v || !v.value) throw new Error('This leaderboard does not exist yet.');
  const b = v.value;
  return { fee: BigInt(String(b.fee.value)), enabled: Boolean(b.enabled.value), maxScore: BigInt(String(b['max-score'].value)) };
}

/** true = that day's board has closed; false = open or unknown (the contract checks again). */
export async function isPeriodClosed(p: SubmitPayload): Promise<boolean> {
  if (p.board !== 'astro3-daily') return false;
  try {
    const cur = Number(await readOnly('current-period', []));
    return p.period !== cur && p.period + 1 !== cur;
  } catch { return false; }
}

/** Rank the contract would give (0 = refused), or null when the read failed. */
export async function previewRank(p: SubmitPayload, score: number, address: string): Promise<number | null> {
  try {
    return Number(await readOnly('preview-rank', [Cl.stringAscii(p.board), Cl.uint(p.period), Cl.uint(score), principalCV(address)]));
  } catch { return null; }
}

/** The Xtrata core fee for storing a long replay in one transaction (micro-STX; the network fee is extra). */
export async function quoteReplayFee(size: number): Promise<bigint> {
  const chunks = Math.ceil(size / 16384);
  const v = (await readOnly('quote-single-tx-fee', [Cl.uint(size), Cl.uint(chunks)], CORE_CONTRACT)) as { value?: Record<string, { value: string }> };
  const t = (v && v.value) as Record<string, { value: string }> | undefined;
  if (!t || !t['total-fee']) throw new Error('Could not read the inscription fee.');
  return BigInt(String(t['total-fee'].value));
}

/** The inscription id already holding these exact bytes (by content hash), or null. */
export async function replayIdByHash(hash: Uint8Array): Promise<number | null> {
  const v = (await readOnly('get-id-by-hash', [Cl.buffer(hash)], CORE_CONTRACT)) as { value?: unknown } | null;
  if (!v) return null;
  const inner = (v as { value?: unknown }).value;
  const n = typeof inner === 'object' && inner && 'value' in (inner as object) ? (inner as { value: string }).value : inner;
  return n == null ? null : Number(n);
}

/** Resolves when the transaction is confirmed; throws if it failed or is still pending after `timeoutMs`. */
export async function waitForTx(txId: string, onTick?: (seconds: number) => void, timeoutMs = 20 * 60_000): Promise<void> {
  const id = txId.startsWith('0x') ? txId : '0x' + txId;
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    for (const base of API_BASES) {
      try {
        const r = await fetch(`${base}/extended/v1/tx/${id}`, { cache: 'no-store', signal: timeoutSignal(12000) });
        if (r.status === 404) break;
        if (!r.ok) continue;
        const tx = await r.json();
        if (tx.tx_status === 'success') return;
        if (/^abort|^dropped/.test(String(tx.tx_status))) throw new Error(`The transaction failed on chain (${tx.tx_status}${tx.tx_result?.repr ? ': ' + tx.tx_result.repr : ''}).`);
        break;
      } catch (e) { if (e instanceof Error && /failed on chain/.test(e.message)) throw e; }
    }
    onTick?.(Math.round((Date.now() - started) / 1000));
    await new Promise((res) => setTimeout(res, 4000));
  }
  throw new Error(`Still waiting for ${id.slice(0, 12)}… Check your wallet history, then post again: the replay is not stored twice.`);
}
