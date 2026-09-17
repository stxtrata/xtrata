// Validates public messages only. Pairing and authorization belong to the native host.
export type Context = { documentId: string; requestId: string };
export type StartIntent = Context & { schema: 1; method: 'startIntent'; leaseId: string; playbackId: string; core: 1 | 2 | 3; masterId: number };
const id = (value: unknown) => typeof value === 'string' && /^[0-9a-f]{32}$/.test(value);
function shape(raw: unknown, fields: string[]): Record<string, unknown> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw Error('Invalid message');
  const v = raw as Record<string, unknown>;
  if (Object.keys(v).length !== fields.length || fields.some(k => !Object.hasOwn(v,k))) throw Error('Invalid fields');
  if (v.schema !== 1 || !id(v.documentId) || !id(v.requestId)) throw Error('Invalid envelope');
  return v;
}
export function parseStartIntent(raw: unknown): StartIntent {
  const v = shape(raw,['schema','method','documentId','requestId','leaseId','playbackId','core','masterId']);
  if (v.method !== 'startIntent' || !id(v.leaseId) || !id(v.playbackId) || ![1,2,3].includes(v.core as number) || !Number.isSafeInteger(v.masterId) || (v.masterId as number) < 0) throw Error('Invalid intent');
  return {...v} as StartIntent;
}
export function parseLeaseRequest(raw: unknown) {
  const v = shape(raw,['schema','method','documentId','requestId']);
  if (v.method !== 'acquirePlaybackLease') throw Error('Invalid method');
  return {...v};
}
export function parseResponse<T>(raw: unknown, context: Context, decode: (value: unknown) => T): T {
  const v = shape(raw,['schema','documentId','requestId','payload']);
  if (v.documentId !== context.documentId || v.requestId !== context.requestId) throw Error('Uncorrelated response');
  return decode(v.payload);
}
export function parseStartOutcome(raw: unknown) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw Error('Invalid outcome');
  const v = raw as Record<string, unknown>;
  if (Object.keys(v).length !== 2 || !Object.hasOwn(v,'playbackId') || !Object.hasOwn(v,'state') || !id(v.playbackId) || !['accepted','unknown','declined-free'].includes(v.state as string)) throw Error('Invalid outcome');
  return { playbackId: v.playbackId as string, state: v.state as 'accepted' | 'unknown' | 'declined-free' };
}
