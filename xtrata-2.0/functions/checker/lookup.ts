import { validateStacksAddress } from '@stacks/transactions';
import { jsonResponse } from '../lib/utils';
import { applyHiroApiKey, getHiroApiKeys, isTransientHiroStatus, shouldRetryWithNextHiroKey } from '../lib/hiro-keys';

/**
 * Preservation checker lookup (POST /checker/lookup).
 *   POST { q }   q is whatever the visitor pasted: a Stacks contract id (SP….name), a wallet address (SP…),
 *                a marketplace or explorer link that contains either, or a collection link / name.
 *
 * Answers with report cards drawn from the research dataset, which lives privately in R2 at DATASET_KEY
 * (built by forever-twins/ft-harness/checker/export_checker_data.py and uploaded by hand).
 *
 * Why POST: a wallet address never goes into a URL, so it is not in access logs, referrers or browser history.
 * Nothing about the visitor is stored. The rate limit keeps a salted hash of the IP for the hour.
 *
 * There is deliberately no way to list or search the dataset: a collection is found only by its contract id, or by
 * its exact name / slug (a link's path), and a wallet only shows what that wallet holds.
 *
 * Failed is not the same as empty: when the research data or the holdings cannot be read, the answer is an error that
 * says so (503 / 502), never "no results".
 */
export const DATASET_KEY = '_system/checker/checker-data.json';

const NO_STORE = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' };
const MAX_BODY = 4096;
const MAX_TWINS = 40;
const MAX_SEARCH = 12;
const MAX_QUERY = 2000;
const HOUR_MS = 3600_000;
const LOOKUPS_PER_HOUR = 120;
const WALLETS_PER_HOUR = 20;
const DATASET_TTL_MS = 5 * 60_000;
const DATASET_STALE_OK_MS = HOUR_MS;
const HOLDINGS_BASE = 'https://api.hiro.so';
const HOLDINGS_PAGE = 200;
const HOLDINGS_MAX_PAGES = 5; // 1000 items; beyond that the answer says so
const OTHERS_LISTED = 200;
const DEMAND_MAX_ROWS = 100;
const NAME_MATCHES_MAX = 5;

// Xtrata inscriptions: stored in the core contract itself. Matched by deployer + name so older core versions held in a
// wallet get the same card (CLAUDE.md: the app *writes* to the newest core only; this is read-only recognition).
const XTRATA_DEPLOYER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const XTRATA_CORE_NAME = /^xtrata-v\d/;

// Worst first. unclear and not_art sort last on purpose: nothing to act on.
const SEVERITY = ['not_found', 'marketplace_only', 'marketplace_broken', 'one_host', 'unclear', 'solid', 'on_chain', 'not_art'];

const C32 = '0-9A-HJKMNP-TV-Z';
const CONTRACT_IN_TEXT = new RegExp(`(?<![A-Za-z0-9])(S[PM][${C32}]{37,40})\\.([A-Za-z][A-Za-z0-9_-]{0,127})`, 'i');
const ADDRESS_IN_TEXT = new RegExp(`(?<![A-Za-z0-9])(S[PMTN][${C32}]{37,40})(?![A-Za-z0-9])`, 'i');
const LOOKS_LIKE_ADDRESS = /^S[PMTN][A-Z0-9]{20,}$/i;
const BNS_NAME = /^[a-z0-9][a-z0-9_-]{0,47}\.(btc|stx|id|app)$/i;
const BITCOIN_ADDRESS = /^(bc1[a-z0-9]{20,90}|[13][a-km-zA-HJ-NP-Z1-9]{25,34})$/;
const GENERIC_WORDS = new Set([
  'collections', 'collection', 'stacks', 'nft', 'nfts', 'marketplace', 'explore', 'token', 'tokens', 'asset', 'assets',
  'txid', 'address', 'inscription', 'inscriptions', 'view', 'details', 'profile', 'user', 'users', 'c', 'www'
]);

type Rec = Record<string, any>;
type Dataset = { generated: string | null; sources: Rec; caveats: string[]; scale: Rec; byId: Map<string, Rec>; byNorm: Map<string, string[]> };
type Cached = { at: number; dataset: Dataset };
type Deps = { now?: number; fetcher?: typeof fetch; sleep?: (ms: number) => Promise<void>; waitUntil?: (promise: Promise<unknown>) => void };

let cache: Cached | null = null;
/** Tests only. */
export const resetDatasetCache = () => { cache = null; };

const hex = (bytes: Uint8Array) => Array.from(bytes, (v) => v.toString(16).padStart(2, '0')).join('');
const norm = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '');
const fail = (status: number, error: string, message: string, extra: Rec = {}) => jsonResponse({ ok: false, error, message, ...extra }, status, NO_STORE);

class BadRequest extends Error {}

// ---------- the research data ----------

type Loaded = { ok: true; dataset: Dataset } | { ok: false; status: number; error: string; message: string };

function buildDataset(raw: any): Dataset | null {
  if (!raw || raw.schema !== 1 || !raw.collections || typeof raw.collections !== 'object' || Array.isArray(raw.collections)) return null;
  const scale = raw.scale && typeof raw.scale === 'object' ? raw.scale : null;
  if (!scale) return null;
  const byId = new Map<string, Rec>();
  const byNorm = new Map<string, string[]>();
  const add = (key: string, id: string) => {
    if (!key) return;
    const list = byNorm.get(key) || [];
    if (!list.includes(id)) list.push(id);
    byNorm.set(key, list);
  };
  for (const rec of Object.values(raw.collections) as Rec[]) {
    if (!rec || typeof rec.id !== 'string' || typeof rec.name !== 'string' || !scale[rec.status]) return null;
    byId.set(rec.id, rec);
    add(norm(rec.name), rec.id);
    add(norm(rec.id.split('.').slice(1).join('.')), rec.id);
  }
  if (byId.size === 0) return null;
  return {
    generated: typeof raw.generated === 'string' ? raw.generated : null,
    sources: raw.sources && typeof raw.sources === 'object' ? raw.sources : {},
    caveats: Array.isArray(raw.caveats) ? raw.caveats.filter((c: unknown) => typeof c === 'string') : [],
    scale,
    byId,
    byNorm
  };
}

async function loadDataset(env: any, now: number): Promise<Loaded> {
  if (cache && now - cache.at < DATASET_TTL_MS) return { ok: true, dataset: cache.dataset };
  const bucket = env?.COLLECTION_ASSETS;
  if (!bucket) return { ok: false, status: 503, error: 'not_switched_on', message: 'The checker is not switched on yet.' };
  let text: string;
  try {
    const object = await bucket.get(DATASET_KEY);
    if (!object) {
      return { ok: false, status: 503, error: 'data_not_loaded', message: 'The research data has not been loaded yet, so we cannot say anything about any collection. This is not a result.' };
    }
    text = await object.text();
  } catch {
    // A stale copy is still real data (its date is shown on the page); anything older than an hour is not trusted.
    if (cache && now - cache.at < DATASET_STALE_OK_MS) return { ok: true, dataset: cache.dataset };
    return { ok: false, status: 503, error: 'data_unavailable', message: 'We could not read the research data right now. This is not a result; please try again in a minute.' };
  }
  let dataset: Dataset | null = null;
  try {
    dataset = buildDataset(JSON.parse(text));
  } catch {
    dataset = null;
  }
  if (!dataset) {
    return { ok: false, status: 500, error: 'data_unreadable', message: 'The research data is in an unexpected shape, so we cannot answer. This is not a result.' };
  }
  cache = { at: now, dataset };
  return { ok: true, dataset };
}

// ---------- what the visitor pasted ----------

type Parsed =
  | { kind: 'contract'; id: string; token?: string }
  | { kind: 'wallet'; address: string }
  | { kind: 'name'; from: 'link' | 'text'; matches: string[]; tried: string[] }
  | { kind: 'notice'; code: string; message: string };

const notice = (code: string, message: string): Parsed => ({ kind: 'notice', code, message });

function wordsFromLink(q: string): string[] | null {
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(q) && !/^www\./i.test(q) && !q.includes('/')) return null;
  let url: URL;
  try {
    url = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(q) ? q : `https://${q}`);
  } catch {
    return null;
  }
  return url.pathname.split('/')
    .map((part) => { try { return decodeURIComponent(part); } catch { return part; } })
    .map((part) => part.trim())
    .filter((part) => part !== '' && part.length <= 128 && !/^\d+$/.test(part) && !GENERIC_WORDS.has(part.toLowerCase()));
}

function parse(q: string, dataset: Dataset): Parsed {
  const contract = CONTRACT_IN_TEXT.exec(q);
  if (contract) {
    const address = contract[1].toUpperCase();
    if (!validateStacksAddress(address)) return notice('invalid_address', 'That contract address does not pass its built-in checksum, so it probably has a typo. Please copy it again.');
    // A marketplace link to one piece looks like .../nfts/<contract>_<token id>. The "_5" is the piece, not part of the contract name.
    const piece = /\/nfts?\//i.test(q) ? /^(.+)_(\d+)$/.exec(contract[2]) : null;
    return piece
      ? { kind: 'contract', id: `${address}.${piece[1]}`, token: piece[2] }
      : { kind: 'contract', id: `${address}.${contract[2]}` };
  }

  const address = ADDRESS_IN_TEXT.exec(q);
  if (address) {
    const value = address[1].toUpperCase();
    if (value.startsWith('ST') || value.startsWith('SN')) return notice('testnet', 'That is a Stacks testnet address. The checker only covers Stacks mainnet (addresses starting SP).');
    if (!validateStacksAddress(value)) return notice('invalid_address', 'That address does not pass its built-in checksum, so it probably has a typo. Please copy it again.');
    return { kind: 'wallet', address: value };
  }
  if (LOOKS_LIKE_ADDRESS.test(q.trim())) return notice('invalid_address', 'That looks like a Stacks address but is the wrong length or has a typo. Please copy it again.');

  if (BNS_NAME.test(q.trim())) return notice('bns_not_supported', 'Names like this (BNS) cannot be looked up yet. Paste the Stacks address that starts with SP instead.');
  if (BITCOIN_ADDRESS.test(q.trim())) return notice('bitcoin_not_supported', 'That is a Bitcoin address. The checker looks at Stacks NFTs, so it needs a Stacks address (it starts with SP).');

  // A link or a name: find a collection whose name or contract name equals a piece of it exactly. No partial matching,
  // so typing a few letters never turns into a list of collections.
  const fromLink = wordsFromLink(q);
  const tried = (fromLink ?? [q.trim().slice(0, 128)]).filter((w) => w !== '');
  const matches: string[] = [];
  for (const word of tried) {
    for (const id of dataset.byNorm.get(norm(word)) || []) if (!matches.includes(id)) matches.push(id);
  }
  return { kind: 'name', from: fromLink ? 'link' : 'text', matches: matches.slice(0, NAME_MATCHES_MAX), tried: tried.slice(0, 8) };
}

// ---------- cards ----------

const isXtrataCore = (contractId: string) => {
  const [address, name] = contractId.split('.');
  return address === XTRATA_DEPLOYER && XTRATA_CORE_NAME.test(name || '');
};

/** Short reasons for the compact view, drawn only from the recorded facts. At most four, problems first. */
function tagsFor(rec: Rec): string[] {
  const tags: string[] = [];
  const contract = rec.contract || {};
  const market = rec.marketplace || {};
  const art = rec.art || {};
  if (rec.status === 'on_chain') tags.push('Stored on chain');
  if (contract.reaches_art === false) tags.push('Contract link broken');
  if (rec.status === 'marketplace_only') tags.push('Marketplace copy only');
  if (typeof market.sampled === 'number' && market.sampled > 0 && typeof market.loaded === 'number') {
    if (market.loaded === 0) tags.push('No marketplace images loaded');
    else if (market.loaded < market.sampled) tags.push('Some marketplace images failed');
  }
  if (market.single_pinata_account === true) tags.push('Single Pinata account');
  else if (art.hosts === 'pinata_only') tags.push('Only Pinata held it');
  else if (art.hosts === 'several') tags.push('Several hosts hold it');
  if (art.storage === 'own_server') tags.push("Creator's own server");
  if (rec.status === 'unclear') tags.push('Could not tell');
  return tags.slice(0, 4);
}

function card(rec: Rec, dataset: Dataset, held?: number) {
  return {
    covered: true,
    id: rec.id,
    name: rec.name,
    tokens_approx: rec.tokens_approx ?? null,
    deployed: rec.deployed ?? null,
    status: rec.status,
    label: dataset.scale[rec.status]?.label ?? rec.status,
    headline: rec.headline ?? null,
    summary: rec.summary ?? null,
    evidence_level: rec.evidence_level ?? null,
    evidence: rec.evidence ?? null,
    checked: rec.checked ?? null,
    good: Array.isArray(rec.good) ? rec.good : [],
    worry: Array.isArray(rec.worry) ? rec.worry : [],
    helper: rec.helper ?? null,
    tags: tagsFor(rec),
    ...(held === undefined ? {} : { held })
  };
}

function xtrataCard(dataset: Dataset, contractIds: string[], held?: number) {
  return {
    covered: true,
    special: 'xtrata',
    id: contractIds[0],
    name: 'Xtrata inscription',
    tokens_approx: null,
    deployed: null,
    status: 'on_chain',
    label: dataset.scale.on_chain?.label ?? 'Stored on chain',
    headline: 'Xtrata keeps the content inside its contract, on the Stacks chain itself.',
    summary: null,
    evidence_level: 'by_design',
    evidence: 'This describes how the Xtrata contract works. We did not sample the pieces in this wallet.',
    checked: null,
    good: ['The content is stored in the Xtrata contract, in chunks, so it does not depend on an outside server or file host.'],
    worry: [],
    helper: null,
    tags: ['Stored on chain'],
    ...(held === undefined ? {} : { held })
  };
}

const bySeverity = (a: { status: string; name: string }, b: { status: string; name: string }) =>
  SEVERITY.indexOf(a.status) - SEVERITY.indexOf(b.status) || a.name.localeCompare(b.name);

function datasetInfo(dataset: Dataset) {
  const census = dataset.sources?.census;
  const retest = dataset.sources?.retest;
  return {
    generated: dataset.generated,
    census_date: census?.date ?? null,
    retest_date: retest?.date ?? null,
    frozen_flags_read: dataset.sources?.frozen_flags?.read === true
  };
}

// ---------- holdings (Hiro) ----------

type Page = { ok: true; total: number; items: string[] } | { ok: false; error: string };

async function fetchHoldingsPage(address: string, offset: number, env: any, fetcher: typeof fetch, sleep: (ms: number) => Promise<void>): Promise<Page> {
  const url = `${HOLDINGS_BASE}/extended/v1/tokens/nft/holdings?principal=${encodeURIComponent(address)}&limit=${HOLDINGS_PAGE}&offset=${offset}`;
  const keys = getHiroApiKeys(env || {});
  const candidates: Array<string | null> = keys.length ? keys : [null];
  let lastError = 'no answer';
  for (let i = 0; i < candidates.length; i += 1) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      let response: Response;
      try {
        const headers = new Headers({ Accept: 'application/json' });
        applyHiroApiKey(headers, candidates[i]);
        response = await fetcher(url, { headers, signal: AbortSignal.timeout(8000) });
      } catch (error) {
        lastError = error instanceof Error && error.name === 'TimeoutError' ? 'timed out' : 'network';
        if (attempt === 0) { await sleep(300); continue; }
        break;
      }
      if (i < candidates.length - 1 && shouldRetryWithNextHiroKey(response.status)) { lastError = `HTTP ${response.status}`; break; }
      if (isTransientHiroStatus(response.status) && attempt === 0) { lastError = `HTTP ${response.status}`; await sleep(400); continue; }
      if (!response.ok) return { ok: false, error: `HTTP ${response.status}` };
      let body: any;
      try { body = await response.json(); } catch { return { ok: false, error: 'unreadable answer' }; }
      if (!body || !Array.isArray(body.results) || typeof body.total !== 'number') return { ok: false, error: 'unexpected answer' };
      const items: string[] = [];
      for (const entry of body.results) {
        const id = entry?.asset_identifier;
        if (typeof id !== 'string' || !id.includes('::')) return { ok: false, error: 'unexpected answer' };
        items.push(id);
      }
      return { ok: true, total: body.total, items };
    }
  }
  return { ok: false, error: lastError };
}

type Holdings =
  | { ok: false; error: string }
  | { ok: true; total: number; read: number; stopped: null | 'cap' | 'read_failed'; byContract: Map<string, { held: number; asset: string }> };

async function readHoldings(address: string, env: any, fetcher: typeof fetch, sleep: (ms: number) => Promise<void>): Promise<Holdings> {
  const byContract = new Map<string, { held: number; asset: string }>();
  let total = 0;
  let read = 0;
  let stopped: null | 'cap' | 'read_failed' = null;
  for (let page = 0; page < HOLDINGS_MAX_PAGES; page += 1) {
    const result = await fetchHoldingsPage(address, page * HOLDINGS_PAGE, env, fetcher, sleep);
    if (!result.ok) {
      // The first page failing means we know nothing; a later page failing means we know part of it, and say so.
      if (page === 0) return { ok: false, error: result.error };
      stopped = 'read_failed';
      break;
    }
    total = result.total;
    for (const identifier of result.items) {
      const [contract, asset] = identifier.split('::');
      const entry = byContract.get(contract);
      if (entry) entry.held += 1;
      else byContract.set(contract, { held: 1, asset });
    }
    read += result.items.length;
    if (read >= total) break;
    if (result.items.length === 0) {
      // The index said there is more but gave nothing: not the same as "that was all".
      if (read === 0) return { ok: false, error: 'inconsistent answer' };
      stopped = 'read_failed';
      break;
    }
    if (page === HOLDINGS_MAX_PAGES - 1) stopped = 'cap';
  }
  return { ok: true, total, read, stopped, byContract };
}

// ---------- anonymous demand counters ----------

type Demand = { id: string; source: 'contract' | 'wallet'; covered: boolean; items: number };
const DEMAND_CONTRACT = new RegExp(`^S[PM][${C32}]{20,41}\\.[A-Za-z][A-Za-z0-9_-]{0,127}$`, 'i');

/**
 * Daily per-collection counts (migration 032): which collections get looked up, which are not covered. No wallet, no IP and no
 * link between lookups is stored. Best effort: a failure here never changes or delays the answer to the visitor.
 */
async function recordDemand(db: any, rows: Demand[], now: number): Promise<void> {
  if (!db) return;
  const valid = rows.filter((row) => DEMAND_CONTRACT.test(row.id)).slice(0, DEMAND_MAX_ROWS);
  if (valid.length === 0) return;
  try {
    const day = new Date(now).toISOString().slice(0, 10);
    const sql = 'INSERT INTO checker_demand(day,contract_id,source,covered,lookups,items) VALUES(?,?,?,?,1,?) ON CONFLICT(day,contract_id,source) DO UPDATE SET lookups=lookups+1, items=items+excluded.items, covered=excluded.covered';
    const statements = valid.map((row) => db.prepare(sql).bind(day, row.id, row.source, row.covered ? 1 : 0, row.items));
    if (typeof db.batch === 'function') await db.batch(statements);
    else for (const statement of statements) await statement.run();
  } catch {
    // counters are a convenience, not part of the answer
  }
}

// ---------- rate limit ----------

/**
 * Counts this visit in the hour's bucket. Returns the count, or null if the counter itself could not be used (no table yet,
 * D1 trouble). A lookup is a read of non-secret data, so a broken counter does not block it; the request form, which writes,
 * does fail when its table is missing. Cloudflare's own rate-limiting rules are the backstop for the Hiro quota.
 */
async function bump(db: any, prefix: string, ip: string, salt: string, now: number): Promise<number | null> {
  if (!db) return null;
  try {
    const key = prefix + hex(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${salt}:${prefix}${ip}:${Math.floor(now / HOUR_MS)}`))));
    const row = await db.prepare('INSERT INTO checker_request_rate(key,started,count) VALUES(?,?,1) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count').bind(key, now).first();
    if (!row || typeof row.count !== 'number') return null;
    if (row.count === 1) await db.prepare('DELETE FROM checker_request_rate WHERE started<?').bind(now - 2 * HOUR_MS).run();
    return row.count;
  } catch {
    return null;
  }
}

async function readBody(request: Request) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) throw new BadRequest('JSON required.');
  const text = await request.text();
  if (text.length > MAX_BODY) throw new BadRequest('Request too large.');
  try {
    return JSON.parse(text);
  } catch {
    throw new BadRequest('Invalid request.');
  }
}

// ---------- handler ----------

export async function handleCheckerLookup(request: Request, env: any, deps: Deps = {}) {
  const now = deps.now ?? Date.now();
  const fetcher = deps.fetcher ?? ((input: RequestInfo | URL, init?: RequestInit) => globalThis.fetch(input, init));
  const sleep = deps.sleep ?? ((ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms)));

  if (request.method !== 'POST') return jsonResponse({ ok: false, error: 'method', message: 'Method not allowed' }, 405, { ...NO_STORE, Allow: 'POST' });
  const url = new URL(request.url);
  const origin = request.headers.get('origin');
  if (origin && origin !== url.origin) return fail(403, 'wrong_origin', 'Wrong origin');

  try {
    const body = await readBody(request);
    const isObject = body && typeof body === 'object' && !Array.isArray(body);
    const twins: unknown = isObject ? body.twins : undefined;
    const q = isObject ? body.q : undefined;
    // Reports for a list of contract ids (the page's "has a Forever Twin" filter asks for the collections that have a helper).
    // Public contract ids in, cards out. Nothing is recorded: these are not lookups anyone made.
    if (Array.isArray(twins)) {
      const ids = Array.from(new Set(twins.filter((v): v is string => typeof v === 'string' && DEMAND_CONTRACT.test(v)))).slice(0, MAX_TWINS);
      const tip = request.headers.get('CF-Connecting-IP') || 'local';
      const tsalt = typeof env?.TELEMETRY_SALT === 'string' ? env.TELEMETRY_SALT : '';
      const tcount = await bump(env?.DB, 'lookup:', tip, tsalt, now);
      if (tcount !== null && tcount > LOOKUPS_PER_HOUR) return fail(429, 'rate_limited', 'Too many lookups from here. Try again in an hour.');
      const tloaded = await loadDataset(env, now);
      if (!tloaded.ok) return fail(tloaded.status, tloaded.error, tloaded.message);
      const results = ids.map((id) => tloaded.dataset.byId.get(id)).filter((rec): rec is Rec => Boolean(rec)).map((rec) => card(rec, tloaded.dataset));
      return jsonResponse({ ok: true, dataset: datasetInfo(tloaded.dataset), caveats: tloaded.dataset.caveats, kind: 'twins', results }, 200, NO_STORE);
    }
    // Search by name across the whole research. Needs three letters or digits, shows at most MAX_SEARCH, and is rate limited with
    // the lookups, so it answers "does this collection have a report?" but is a poor way to copy the whole list out.
    const search: unknown = isObject ? body.search : undefined;
    if (typeof search === 'string') {
      const needle = norm(search);
      if (search.length > 80 || needle.length < 3) throw new BadRequest('Type at least three letters or numbers of the collection\'s name.');
      const sip = request.headers.get('CF-Connecting-IP') || 'local';
      const ssalt = typeof env?.TELEMETRY_SALT === 'string' ? env.TELEMETRY_SALT : '';
      const scount = await bump(env?.DB, 'lookup:', sip, ssalt, now);
      if (scount !== null && scount > LOOKUPS_PER_HOUR) return fail(429, 'rate_limited', 'Too many lookups from here. Try again in an hour.');
      const sloaded = await loadDataset(env, now);
      if (!sloaded.ok) return fail(sloaded.status, sloaded.error, sloaded.message);
      const sd = sloaded.dataset;
      const hits: Array<{ rec: Rec; first: boolean }> = [];
      for (const rec of sd.byId.values()) {
        const names = [norm(String(rec.name ?? '')), norm(String(rec.id).split('.')[1] ?? '')];
        if (names.some((n) => n.includes(needle))) hits.push({ rec, first: names.some((n) => n.startsWith(needle)) });
      }
      hits.sort((x, y) => Number(y.first) - Number(x.first) || String(x.rec.name).localeCompare(String(y.rec.name)));
      return jsonResponse({
        ok: true, dataset: datasetInfo(sd), caveats: sd.caveats, kind: 'search', matches_total: hits.length,
        results: hits.slice(0, MAX_SEARCH).map((h) => card(h.rec, sd)),
        ...(hits.length === 0 ? { message: 'No collection in our research has that in its name. It may not be covered yet: paste its contract address (it looks like SP….name) to ask us to check it.' } : {})
      }, 200, NO_STORE);
    }
    if (typeof q !== 'string' || q.trim() === '') throw new BadRequest('Paste your wallet address, or a link or contract address.');
    if (q.length > MAX_QUERY) throw new BadRequest('That is too long to be a link or an address.');

    const ip = request.headers.get('CF-Connecting-IP') || 'local';
    const salt = typeof env?.TELEMETRY_SALT === 'string' ? env.TELEMETRY_SALT : '';
    const count = await bump(env?.DB, 'lookup:', ip, salt, now);
    if (count !== null && count > LOOKUPS_PER_HOUR) return fail(429, 'rate_limited', 'Too many lookups from here. Try again in an hour.');

    const loaded = await loadDataset(env, now);
    if (!loaded.ok) return fail(loaded.status, loaded.error, loaded.message);
    const { dataset } = loaded;
    const base = { ok: true, dataset: datasetInfo(dataset), caveats: dataset.caveats };

    const parsed = parse(q.trim(), dataset);

    if (parsed.kind === 'notice') return jsonResponse({ ...base, kind: 'notice', code: parsed.code, message: parsed.message, results: [] }, 200, NO_STORE);

    const remember = (rows: Demand[]) => {
      const job = recordDemand(env?.DB, rows, now);
      if (deps.waitUntil) deps.waitUntil(job);
      else return job;
      return undefined;
    };

    if (parsed.kind === 'contract') {
      if (isXtrataCore(parsed.id)) {
        await remember([{ id: parsed.id, source: 'contract', covered: true, items: 0 }]);
        return jsonResponse({ ...base, kind: 'contract', ...(parsed.token ? { token_id: parsed.token } : {}), results: [xtrataCard(dataset, [parsed.id])] }, 200, NO_STORE);
      }
      const rec = dataset.byId.get(parsed.id);
      const results = rec ? [card(rec, dataset)] : [{ covered: false, id: parsed.id }];
      await remember([{ id: parsed.id, source: 'contract', covered: Boolean(rec), items: 0 }]);
      return jsonResponse({ ...base, kind: 'contract', ...(parsed.token ? { token_id: parsed.token } : {}), results }, 200, NO_STORE);
    }

    if (parsed.kind === 'name') {
      if (parsed.matches.length === 0) {
        return jsonResponse({
          ...base, kind: 'collection', matched_from: parsed.from, tried: parsed.tried, results: [],
          message: parsed.from === 'link'
            ? 'We could not tell which collection that link is for. Marketplace links often do not contain the contract address: paste the contract address (it looks like SP….name) instead, or paste your wallet address.'
            : 'We could not match that to a collection by name. Paste the contract address (it looks like SP….name) or a wallet address instead.'
        }, 200, NO_STORE);
      }
      const results = parsed.matches.map((id) => card(dataset.byId.get(id) as Rec, dataset));
      await remember(parsed.matches.map((id) => ({ id, source: 'contract' as const, covered: true, items: 0 })));
      return jsonResponse({ ...base, kind: 'collection', matched_from: parsed.from, tried: parsed.tried, results }, 200, NO_STORE);
    }

    // Wallet
    const walletCount = await bump(env?.DB, 'wallet:', ip, salt, now);
    if (walletCount !== null && walletCount > WALLETS_PER_HOUR) return fail(429, 'rate_limited', 'Too many wallet lookups from here. Try again in an hour.');
    const holdings = await readHoldings(parsed.address, env, fetcher, sleep);
    if (!holdings.ok) {
      // 503, not 502: Cloudflare replaces a 502 or 504 from the site with its own plain error page on the live domain, which hides this message.
      // The reason is only ever one of our short codes ("HTTP 401", "timed out", "unexpected answer"), never upstream text.
      return fail(503, 'holdings_unavailable', 'We could not read that wallet\'s NFT list right now. That does not mean it is empty. Please try again in a minute.', { reason: holdings.error });
    }

    const covered: Array<ReturnType<typeof card>> = [];
    const others: Array<{ id: string; asset: string; held: number }> = [];
    const xtrataIds: string[] = [];
    let xtrataHeld = 0;
    for (const [contractId, entry] of holdings.byContract) {
      if (isXtrataCore(contractId)) { xtrataIds.push(contractId); xtrataHeld += entry.held; continue; }
      const rec = dataset.byId.get(contractId);
      if (rec) covered.push(card(rec, dataset, entry.held));
      else others.push({ id: contractId, asset: entry.asset, held: entry.held });
    }
    const results: Array<ReturnType<typeof card> | ReturnType<typeof xtrataCard>> = [...covered];
    if (xtrataIds.length) results.push(xtrataCard(dataset, xtrataIds, xtrataHeld));
    results.sort(bySeverity);
    others.sort((a, b) => b.held - a.held || a.id.localeCompare(b.id));
    const itemsInReports = results.reduce((sum, r) => sum + (typeof (r as any).held === 'number' ? (r as any).held : 0), 0);
    const itemsNotCovered = others.reduce((sum, o) => sum + o.held, 0);

    const seen: Demand[] = [
      ...results.map((r) => ({ id: r.id, source: 'wallet' as const, covered: true, items: (r as any).held as number })),
      ...others.map((o) => ({ id: o.id, source: 'wallet' as const, covered: false, items: o.held }))
    ].sort((a, b) => b.items - a.items);
    await remember(seen);

    return jsonResponse({
      ...base,
      kind: 'wallet',
      wallet: {
        items_total: holdings.total,
        items_read: holdings.read,
        complete: holdings.stopped === null && holdings.read >= holdings.total,
        stopped: holdings.stopped,
        collections_held: holdings.byContract.size,
        collections_covered: results.length,
        collections_not_covered: others.length,
        items_in_reports: itemsInReports,
        items_not_covered: itemsNotCovered
      },
      results,
      others: others.slice(0, OTHERS_LISTED),
      others_total: others.length
    }, 200, NO_STORE);
  } catch (error) {
    if (error instanceof BadRequest) return fail(400, 'bad_request', error.message);
    return fail(500, 'lookup_failed', 'Something went wrong on our side. This is not a result; please try again.');
  }
}

export const onRequest: PagesFunction = ({ request, env, waitUntil }) => handleCheckerLookup(request, env, { waitUntil });
