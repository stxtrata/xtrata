// Read-only protocol. This module cannot construct or submit a transaction.
export type Status = {
  schema: 1; address: string; enabled: boolean; locked: boolean;
  confirmed: string; reserved: string; reserve: string; usable: string;
  fee: string; holder: '50'; pending: number;
  attention: 'none' | 'offline' | 'recovery' | 'active-elsewhere';
};
export type Entry = {
  id: string; core: number; masterId: number; title: string; artist: string;
  state: 'pending' | 'unknown' | 'confirmed' | 'aborted' | 'rejected';
  startedAt: string; fee: string | null; holder: string | null; txid: string | null;
};
export type Page = { entries: Entry[]; next: string | null };
export interface ReadOnlyCompanion {
  status(signal: AbortSignal): Promise<unknown>;
  history(cursor: string | null, limit: number, signal: AbortSignal): Promise<unknown>;
}
function record(value: unknown, keys: string[]): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw Error('Invalid response');
  const obj = value as Record<string, unknown>;
  if (Object.keys(obj).length !== keys.length || keys.some(k => !Object.hasOwn(obj, k))) throw Error('Invalid fields');
  return obj;
}
function str(v: unknown, max = 200): string {
  if (typeof v !== 'string' || v.length > max || /[\u0000-\u001f]/.test(v)) throw Error('Invalid text');
  return v;
}
function amount(v: unknown): string {
  const s = str(v, 20);
  if (!/^(0|[1-9][0-9]{0,19})$/.test(s)) throw Error('Invalid amount');
  return s;
}
function integer(v: unknown): number {
  if (typeof v !== 'number' || !Number.isSafeInteger(v) || v < 0) throw Error('Invalid integer');
  return v;
}
export function parseStatus(raw: unknown): Status {
  const v = record(raw, ['schema','address','enabled','locked','confirmed','reserved','reserve','usable','fee','holder','pending','attention']);
  if (v.schema !== 1 || typeof v.enabled !== 'boolean' || typeof v.locked !== 'boolean' || !/^SP[0-9A-HJKMNP-TV-Z]{26,39}$/.test(str(v.address, 41))) throw Error('Invalid identity');
  for (const key of ['confirmed','reserved','reserve','usable','fee','holder']) amount(v[key]);
  if (v.holder !== '50' || BigInt(v.fee as string) === 0n) throw Error('Invalid policy');
  const available = BigInt(v.confirmed as string) - BigInt(v.reserved as string) - BigInt(v.reserve as string);
  if (BigInt(v.usable as string) !== (available > 0n ? available : 0n)) throw Error('Invalid balance');
  if (integer(v.pending) > 100 || !['none','offline','recovery','active-elsewhere'].includes(String(v.attention))) throw Error('Invalid status');
  return { ...v } as Status;
}
export function parsePage(raw: unknown): Page {
  const v = record(raw, ['entries','next']);
  if (!Array.isArray(v.entries) || v.entries.length > 50) throw Error('Invalid page');
  if (v.next !== null) str(v.next, 128);
  const ids = new Set<string>();
  const entries = v.entries.map(rawEntry => {
    const e = record(rawEntry, ['id','core','masterId','title','artist','state','startedAt','fee','holder','txid']);
    if (!/^[0-9a-f]{32}$/.test(str(e.id, 32)) || ids.has(e.id as string)) throw Error('Invalid receipt');
    ids.add(e.id as string);
    if (![1,2,3].includes(integer(e.core))) throw Error('Invalid core');
    integer(e.masterId); str(e.title); str(e.artist);
    if (!['pending','unknown','confirmed','aborted','rejected'].includes(String(e.state))) throw Error('Invalid state');
    if (!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(str(e.startedAt, 24)) || !Number.isFinite(Date.parse(e.startedAt as string))) throw Error('Invalid date');
    if (e.txid !== null && !/^0x[0-9a-f]{64}$/.test(str(e.txid, 66))) throw Error('Invalid transaction');
    if (e.fee !== null) amount(e.fee);
    if (e.holder !== null) amount(e.holder);
    if (e.state === 'confirmed' && (e.holder !== '50' || e.fee === null || e.txid === null)) throw Error('Missing confirmed accounting');
    if (e.state === 'aborted' && (e.holder !== '0' || e.fee === null || e.txid === null)) throw Error('Invalid abort accounting');
    if (['pending','unknown'].includes(e.state as string) && (e.fee !== null || e.holder !== null)) throw Error('Unconfirmed debit');
    if (e.state === 'rejected' && (e.fee !== '0' || e.holder !== '0')) throw Error('Invalid rejection accounting');
    return { ...e } as Entry;
  });
  return { entries, next: v.next as string | null };
}
export function stx(value: string): string {
  const n = BigInt(amount(value));
  return `${n / 1000000n}.${(n % 1000000n).toString().padStart(6, '0')} STX`;
}
