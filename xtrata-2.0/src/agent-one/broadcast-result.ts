// A broadcast that the network did not accept must never look like one that it did.
//
// @stacks/transactions returns the parsed JSON body of ANY non-OK response, so a refusal
// from a gateway in front of the node (for example Hiro answering HTTP 403
// {"message":"Forbidden"}) comes back as an object with neither `error` nor `txid`.
// The wizard only looked at `.error`, logged "broadcast 0x[object Object]", then waited
// for a transaction that did not exist and kept raising its fee. This turns anything
// that is not an accepted transaction into the same { error, reason } shape that a
// node rejection already has, so every existing caller handles it.

// Gateway wording for "no, and I looked at it" (AWS/Cloudflare style 401/403). Other messages
// ("Service Unavailable", "injected failure") say nothing about whether the node got the transaction.
const REFUSAL_WORDS = /forbidden|not authori[sz]ed|unauthori[sz]ed|access denied|blocked|denied/i;

const TXID = /^(0x)?[0-9a-f]{64}$/i;

export type BroadcastResult = { txid?: string; error?: string; reason?: string; ambiguous?: boolean; [k: string]: unknown };

export function normalizeBroadcastResult(res: unknown): BroadcastResult {
  if (typeof res === 'string' && TXID.test(res.replace(/"/g, ''))) return { txid: res.replace(/"/g, '') };
  const r = (res && typeof res === 'object' ? res : null) as BroadcastResult | null;
  if (r && typeof r.error === 'string' && r.error) return r;       // a node rejection: already in the right shape
  if (r && typeof r.txid === 'string' && TXID.test(r.txid)) return r;
  const message = r && typeof (r as any).message === 'string' ? String((r as any).message) : '';
  // A gateway that says it refused is a definite "no". A response with no reason at all
  // (an empty 5xx body, say) is ambiguous: the node may or may not have the transaction,
  // so callers that journal the signed transaction must keep it and look again.
  if (message && REFUSAL_WORDS.test(message)) return { error: 'broadcast refused', reason: `by the network gateway (${message}). Nothing was broadcast.` };
  const detail = r ? JSON.stringify(r).slice(0, 160) : String(res).slice(0, 160);
  return { error: 'broadcast refused', reason: `- unexpected response (${detail}). It is not known whether the node has the transaction.`, ambiguous: true };
}
