/**
 * Launching the Music Hero awards on mainnet, one checked step at a time (web/awards-launch.html).
 *
 * This file is the rules; it never signs anything. It reads the chain and says, for every step of the launch, whether
 * it is done AND correct, what the next step is, and exactly what that step's transaction must contain. The page asks
 * the wallet to sign only the step this file names as next, and re-reads the chain afterwards: a step counts as done
 * only when the chain shows the expected result, never because a transaction was sent.
 *
 * The order: five award templates inscribed on Xtrata -> the award contract deployed -> five classes set (each naming
 * its template) -> the note signer set -> the contract funded -> awards switched on at the server -> a first claim.
 */
import {
  bufferCV, cvToHex, cvToJSON, hexToCV, listCV, noneCV, someCV, stringAsciiCV, uintCV, type ClarityValue
} from '@stacks/transactions';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { chunkBytes, computeExpectedHash } from '../chunking/hash';

export const OWNER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X'; // xtrata.btc: the only wallet that may run the launch
export const CORE = { address: OWNER, name: 'xtrata-v3-2-3' };
export const AWARDS_NAME = 'xtrata-music-awards-v1-0';
export const AWARDS_ID = `${OWNER}.${AWARDS_NAME}`;
export const DROP = 1;
export const TEMPLATE_MIME = 'text/html';
/** Class numbers and caps as the contract and the server know them (src/lib/music-awards/record.ts AWARD_CLASS). */
export const CLASSES = [
  { id: 1, key: 'diamond', name: 'Diamond', cap: 5 },
  { id: 2, key: 'gold', name: 'Gold', cap: 10 },
  { id: 3, key: 'silver', name: 'Silver', cap: 20 },
  { id: 4, key: 'bronze', name: 'Bronze', cap: 100 },
  { id: 5, key: 'classic', name: 'Classic', cap: 865 }
] as const;
export type ClassKey = typeof CLASSES[number]['key'];
/** What one record costs the contract at the core's default fees (single-tx 100,000 + one chunk 2,000). Read live too. */
export const RECORD_FEE_DEFAULT = 102_000n;
export const TOTAL_AWARDS = CLASSES.reduce((n, c) => n + c.cap, 0);
export const tokenUriFor = (key: ClassKey) => `https://xtrata.xyz/awards/${key}`;

// ---------------------------------------------------------------- reading the chain
export interface Reader {
  /** A read-only call's result as cvToJSON gives it. Throws when the chain cannot be read. */
  read(contract: { address: string; name: string }, fn: string, args: ClarityValue[]): Promise<any>;
  /** A contract's source and Clarity version, or null when it is not deployed. Throws when that cannot be told. */
  contract(address: string, name: string): Promise<{ source: string; clarityVersion: number | null } | null>;
}
export function hiroReader(api: string, get: typeof fetch = (...a) => fetch(...a)): Reader {
  return {
    async read(c, fn, args) {
      const r = await get(`${api}/v2/contracts/call-read/${c.address}/${c.name}/${fn}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ sender: OWNER, arguments: args.map((a) => cvToHex(a)) }) });
      if (!r.ok) throw new Error(`could not read ${c.name}.${fn} (HTTP ${r.status})`);
      const j = await r.json() as { okay?: boolean; result?: string; cause?: string };
      if (!j.okay || typeof j.result !== 'string') throw new Error(`${c.name}.${fn} could not be read: ${j.cause ?? 'no result'}`);
      return cvToJSON(hexToCV(j.result));
    },
    async contract(address, name) {
      const r = await get(`${api}/v2/contracts/source/${address}/${name}?proof=0`);
      if (r.status === 404) return null;
      if (!r.ok) throw new Error(`could not check whether ${name} is deployed (HTTP ${r.status})`);
      const j = await r.json() as { source?: unknown };
      if (typeof j.source !== 'string') throw new Error(`${name}: the chain returned no source`);
      let clarityVersion: number | null = null;
      try { const m = await get(`${api}/extended/v1/contract/${address}.${name}`); if (m.ok) { const v = (await m.json() as { clarity_version?: unknown }).clarity_version; if (typeof v === 'number') clarityVersion = v; } } catch { /* shown as unknown */ }
      return { source: j.source, clarityVersion };
    }
  };
}

// cvToJSON shapes, unwrapped strictly: anything unexpected throws, so a misread can never look like "done".
const inner = (v: any): any => (v && typeof v === 'object' && 'value' in v ? v.value : v);
const okOf = (v: any, what: string) => { if (!v?.success && !String(v?.type ?? '').startsWith('(response')) throw new Error(`${what}: not a response`); if (v.success === false) throw new Error(`${what}: the contract answered with an error`); return v.value; };
const optional = (v: any): any | null => (String(v?.type ?? '').startsWith('(optional') ? (v.value === null || v.value === undefined ? null : v.value) : (() => { throw new Error('expected an optional'); })());
const uintOf = (v: any, what: string): bigint => { const x = inner(v); if (typeof x !== 'string' || !/^\d+$/.test(x)) throw new Error(`${what}: not a number`); return BigInt(x); };

// ---------------------------------------------------------------- the plan for one template
export interface TemplatePlan { key: ClassKey; size: number; chunks: Uint8Array[]; hash: string; sha256: string; tokenUri: string }
export function planTemplate(key: ClassKey, bytes: Uint8Array): TemplatePlan {
  const chunks = chunkBytes(bytes);
  if (!bytes.length || chunks.length > 32) throw new Error(`${key}: a template must fit one transaction (1 to 32 chunks)`);
  return { key, size: bytes.length, chunks, hash: bytesToHex(computeExpectedHash(chunks)), sha256: bytesToHex(sha256(bytes)), tokenUri: tokenUriFor(key) };
}
export const templateArgs = (p: TemplatePlan): ClarityValue[] =>
  [bufferCV(hexToBytes(p.hash)), stringAsciiCV(TEMPLATE_MIME), uintCV(p.size), listCV(p.chunks.map((c) => bufferCV(c))), stringAsciiCV(p.tokenUri)];
export const classArgs = (classId: number, template: number, cap: number): ClarityValue[] => [uintCV(DROP), uintCV(classId), uintCV(template), uintCV(cap)];
export const signerArgs = (hash: string | null): ClarityValue[] => [hash ? someCV(bufferCV(hexToBytes(hash))) : noneCV()];
/** What someone pasted, tidied: the key script prints the hash with 0x on the front. */
export const cleanSignerHash = (v: string): string => v.trim().toLowerCase().replace(/^0x/, '');
export const isSignerHash = (v: unknown): v is string => typeof v === 'string' && /^[0-9a-f]{40}$/.test(v);

// ---------------------------------------------------------------- the whole state, read from the chain
export interface LaunchInputs { templates: Record<ClassKey, Uint8Array>; source: string; signerHash?: string | null; fundTarget?: bigint }
export interface TemplateState { plan: TemplatePlan; id: number | null; verified: boolean; problem?: string; fee: bigint }
export interface ClassState { id: number; key: ClassKey; name: string; cap: number; have: { template: number; cap: number; minted: number } | null; ok: boolean; problem?: string }
export interface LaunchState {
  core: { paused: boolean };
  templates: TemplateState[];
  contract: { deployed: boolean; sourceMatches: boolean; clarityVersion: number | null; owner: string | null; paused: boolean | null; problem?: string };
  classes: ClassState[];
  signer: { have: string | null; want: string | null; ok: boolean };
  balance: bigint | null;
  recordFee: bigint;
  minted: number;
}
const awards = { address: OWNER, name: AWARDS_NAME };
const sameBytes = (a: Uint8Array, b: Uint8Array) => a.length === b.length && a.every((x, i) => x === b[i]);

export async function inspect(reader: Reader, input: LaunchInputs): Promise<LaunchState> {
  const paused = inner(okOf(await reader.read(CORE, 'is-paused', []), 'is-paused')) === true;
  const feeOf = async (size: number, chunks: number) => uintOf(okOf(await reader.read(CORE, 'quote-single-tx-fee', [uintCV(size), uintCV(chunks)]), 'quote').value['total-fee'], 'fee');
  const templates: TemplateState[] = [];
  for (const c of CLASSES) {
    const plan = planTemplate(c.key, input.templates[c.key]);
    const fee = await feeOf(plan.size, plan.chunks.length);
    const found = optional(await reader.read(CORE, 'get-id-by-hash', [bufferCV(hexToBytes(plan.hash))]));
    const t: TemplateState = { plan, id: found === null ? null : Number(uintOf(found, 'token id')), verified: false, fee };
    if (t.id !== null) {
      // Inscribed: read every chunk back and compare it with the file byte for byte.
      try {
        for (let i = 0; i < plan.chunks.length; i++) {
          const chunk = optional(await reader.read(CORE, 'get-chunk', [uintCV(t.id), uintCV(i)]));
          const hex = chunk === null ? null : String(inner(chunk)).replace(/^0x/, '');
          if (hex === null || !sameBytes(hexToBytes(hex), plan.chunks[i])) throw new Error(`chunk ${i + 1} on chain is not the file's`);
        }
        t.verified = true;
      } catch (e) { t.problem = (e as Error).message; }
    }
    templates.push(t);
  }
  const live = await reader.contract(OWNER, AWARDS_NAME);
  const contract: LaunchState['contract'] = { deployed: !!live, sourceMatches: !!live && live.source === input.source, clarityVersion: live?.clarityVersion ?? null, owner: null, paused: null };
  const classes: ClassState[] = CLASSES.map((c) => ({ ...c, have: null, ok: false }));
  const signer: LaunchState['signer'] = { have: null, want: isSignerHash(input.signerHash) ? input.signerHash : null, ok: false };
  let balance: bigint | null = null, recordFee = RECORD_FEE_DEFAULT, minted = 0;
  try { recordFee = await feeOf(320, 1); } catch { /* the default is shown */ }
  if (live && !contract.sourceMatches) contract.problem = 'A contract with this name is deployed, but its source is NOT the reviewed one. Stop: do not set anything on it.';
  if (live && contract.sourceMatches) {
    contract.owner = String(inner(okOf(await reader.read(awards, 'get-contract-owner', []), 'owner')));
    contract.paused = inner(okOf(await reader.read(awards, 'is-paused', []), 'paused')) === true;
    if (contract.owner !== OWNER) contract.problem = `The contract's owner is ${contract.owner}, not xtrata.btc.`;
    balance = uintOf(okOf(await reader.read(awards, 'get-balance', []), 'balance'), 'balance');
    const s = optional(okOf(await reader.read(awards, 'get-signer-hash', []), 'signer'));
    signer.have = s === null ? null : String(inner(s)).replace(/^0x/, '');
    signer.ok = !!signer.have && signer.have === signer.want;
    for (const c of classes) {
      const got = optional(await reader.read(awards, 'get-class', [uintCV(DROP), uintCV(c.id)]));
      if (got !== null) { const v = inner(got); c.have = { template: Number(uintOf(v.template, 'template')), cap: Number(uintOf(v.cap, 'cap')), minted: Number(uintOf(v.minted, 'minted')) }; minted += c.have.minted; }
      const t = templates.find((x) => x.plan.key === c.key)!;
      c.ok = !!c.have && t.verified && c.have.template === t.id && c.have.cap === c.cap;
      if (c.have && !c.ok) c.problem = `on chain: template #${c.have.template}, cap ${c.have.cap}; wanted template #${t.id ?? '?'}, cap ${c.cap}`;
    }
  }
  return { core: { paused }, templates, contract, classes, signer, balance, recordFee, minted };
}

// ---------------------------------------------------------------- which step is next
export type StepId = `template:${ClassKey}` | 'deploy' | `class:${ClassKey}` | 'signer' | 'fund' | 'server' | 'claim';
export const STEP_ORDER: StepId[] = [...CLASSES.map((c) => `template:${c.key}` as StepId), 'deploy', ...CLASSES.map((c) => `class:${c.key}` as StepId), 'signer', 'fund', 'server', 'claim'];
export type StepStatus = 'done' | 'next' | 'locked' | 'problem';
/** What the canary needs in the contract before a first claim: enough for a handful of records. */
export const FUND_MINIMUM = (fee: bigint) => fee * 5n;

/**
 * Every step's status. Exactly one step is `next` (or none: finished, or stopped at a `problem`). A problem anywhere
 * stops everything after it: nothing may be signed on top of something that is wrong.
 */
export function steps(state: LaunchState, server: { enabled: boolean; contract?: string; drop?: number } | null): { id: StepId; status: StepStatus; note: string }[] {
  const out: { id: StepId; status: StepStatus; note: string }[] = [];
  let open = true; // false once a step is not done: everything after is locked
  const add = (id: StepId, done: boolean, note: string, problem?: string) => {
    const status: StepStatus = problem ? 'problem' : done ? 'done' : open ? 'next' : 'locked';
    out.push({ id, status: open || done || problem ? status : 'locked', note: problem ?? note });
    if (!done || problem) open = false;
  };
  for (const t of state.templates) add(`template:${t.plan.key}`, t.id !== null && t.verified, t.id !== null ? `inscription #${t.id}, every byte checked` : `${t.plan.size.toLocaleString()} bytes, ${t.plan.chunks.length} chunk${t.plan.chunks.length === 1 ? '' : 's'}`, t.id !== null && !t.verified ? `inscription #${t.id} exists but does not match the file: ${t.problem}` : undefined);
  const c = state.contract;
  add('deploy', c.deployed && c.sourceMatches && c.owner === OWNER, c.deployed ? `deployed, source identical, Clarity ${c.clarityVersion ?? '?'}, owner xtrata.btc` : 'not deployed', c.problem);
  for (const k of state.classes) add(`class:${k.key}`, k.ok, k.ok ? `template #${k.have!.template}, cap ${k.cap}, ${k.have!.minted} claimed` : 'not set', k.problem);
  add('signer', state.signer.ok, state.signer.ok ? `set to ${state.signer.have}` : state.signer.have ? `on chain: ${state.signer.have}` : 'not set',
    state.signer.have && state.signer.want && !state.signer.ok ? `The contract's signer is ${state.signer.have}, but the hash you entered is ${state.signer.want}.` : undefined);
  const need = FUND_MINIMUM(state.recordFee);
  add('fund', (state.balance ?? 0n) >= need, state.balance === null ? 'not funded' : `${stx(state.balance)} STX in the contract (a record costs ${stx(state.recordFee)})`);
  const serverOk = !!server?.enabled && server.contract === AWARDS_ID && server.drop === DROP;
  add('server', serverOk, serverOk ? 'awards are on, pointing at this contract and drop' : server === null ? 'could not be read from here' : server.enabled ? `on, but pointing at ${server.contract} drop ${server.drop}` : 'off',
    server?.enabled && !serverOk ? `The server is on but points at ${server.contract}, drop ${server.drop}. It must be ${AWARDS_ID}, drop ${DROP}.` : undefined);
  add('claim', state.minted > 0, state.minted > 0 ? `${state.minted} record${state.minted === 1 ? '' : 's'} claimed` : 'no record claimed yet');
  return out;
}
export const stx = (micro: bigint) => { const whole = micro / 1_000_000n, frac = (micro % 1_000_000n).toString().padStart(6, '0').replace(/0+$/, ''); return frac ? `${whole}.${frac}` : `${whole}`; };
