// Read-only leaderboard lookups shared by /arcade/submit and the viewer's
// in-place submit dialog. A failed read throws; it is never read as "empty".
import { cvToHex, cvToValue, hexToCV, Cl, principalCV, type ClarityValue } from '@stacks/transactions';
import { ARCADE_CONTRACT, type BoardInfo, type SubmitPayload } from './core';

const API_BASES = ['/hiro/mainnet', 'https://api.mainnet.hiro.so'];

function timeoutSignal(ms: number): AbortSignal | undefined {
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') return AbortSignal.timeout(ms);
  if (typeof AbortController === 'undefined') return undefined;
  const c = new AbortController(); setTimeout(() => c.abort(), ms); return c.signal;
}

export async function readOnly(fn: string, args: ClarityValue[]): Promise<unknown> {
  const body = JSON.stringify({ sender: ARCADE_CONTRACT.address, arguments: args.map((a) => cvToHex(a)) });
  let lastError: unknown;
  for (const base of API_BASES) {
    try {
      const r = await fetch(`${base}/v2/contracts/call-read/${ARCADE_CONTRACT.address}/${ARCADE_CONTRACT.name}/${fn}`, {
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
