// Forever Twins registry helpers (registry.v2.json).
// Pure ES module: runs in the browser and in Node (tests, verifier). No dependencies.

export const REGISTRY_URL = '/forever-twins/data/registry.v2.json';

export const STATUS = {
  live:             { label: 'Live',             tone: 'ok',   tool: true,  order: 0 },
  deploying:        { label: 'Deploying',        tone: 'warn', tool: false, order: 1 },
  'manifest-review':{ label: 'Manifest review',  tone: 'warn', tool: false, order: 2 },
  screening:        { label: 'Screening',        tone: 'mute', tool: false, order: 3 },
  planned:          { label: 'Planned',          tone: 'mute', tool: false, order: 4 }
};
export const COMMUNITY_STATUS = {
  live:          { label: 'Live' },
  'coming-soon': { label: 'Coming soon' }
};

export const PRINCIPAL_RE = /^S[PM][0-9A-Z]{20,40}\.[a-zA-Z][a-zA-Z0-9_-]{0,127}$/;
const KEY_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const CORE_SINGLE_TX_MAX_BYTES = 32 * 16384; // 524,288: above this the owner pre-inscribes

/** Returns a list of human-readable problems; empty means valid. */
export function validateRegistry(reg) {
  const errors = [];
  const err = (m) => errors.push(m);
  if (!reg || typeof reg !== 'object') return ['registry is not an object'];
  if (reg.registry !== 'forever-twins') err('registry must be "forever-twins"');
  if (reg.version !== 2) err('version must be 2');
  if (reg.network !== 'mainnet') err('network must be "mainnet"');
  if (!reg.core || !PRINCIPAL_RE.test(reg.core.contract || '')) err('core.contract is not a valid principal');
  if (!reg.core || !reg.core.assetName) err('core.assetName missing');
  if (!Array.isArray(reg.collections)) { err('collections must be an array'); return errors; }
  const communities = Array.isArray(reg.communities) ? reg.communities : [];

  const keys = new Set(), helpers = new Map(), sources = new Map();
  for (const c of reg.collections) {
    const id = `collection "${c && c.key}"`;
    if (!c || !KEY_RE.test(c.key || '')) { err(`${id}: key must be lowercase-hyphen`); continue; }
    if (keys.has(c.key)) err(`${id}: duplicate key`);
    keys.add(c.key);
    if (!c.name) err(`${id}: name missing`);
    const ht = c.theme && c.theme.heroTwin;
    if (ht && !(Number.isInteger(ht.tokenId) && ht.tokenId > 0 && Number.isInteger(ht.xtrataId) && ht.xtrataId > 0)) err(`${id}: theme.heroTwin needs positive integer tokenId and xtrataId`);
    if (!STATUS[c.status]) err(`${id}: unknown status "${c.status}"`);
    if (!['v1', 'v3'].includes(c.interface)) err(`${id}: interface must be v1 or v3`);
    if (!['G1', 'G2'].includes(c.group)) err(`${id}: group must be G1 or G2`);
    if (!PRINCIPAL_RE.test(c.source || '')) err(`${id}: source is not a valid principal`);
    if (!c.sourceAsset) err(`${id}: sourceAsset missing`);
    if (c.helper !== null && !PRINCIPAL_RE.test(c.helper || '')) err(`${id}: helper must be null or a valid principal`);
    if (c.helper === null && (c.status === 'live' || c.status === 'deploying')) err(`${id}: status "${c.status}" needs a helper`);
    if (c.helper !== null && c.status === 'planned') err(`${id}: has a helper but status is "planned"`);
    if (c.interface === 'v1' && c.status === 'live' && !c.legacyPage) err(`${id}: live v1 helpers must keep a legacyPage (the only write path for v1)`);
    if (c.legacyPage != null && !/^\/forever-twins\/[a-z0-9-]+\/$/.test(c.legacyPage)) err(`${id}: legacyPage must look like /forever-twins/<name>/`);
    if (c.largeOnDemand != null && (typeof c.largeOnDemand !== 'boolean' || c.interface !== 'v3' || !c.helper)) err(`${id}: largeOnDemand must be a boolean on a v3 collection with a helper`);
    if (c.coverage != null) {
      const cv = c.coverage;
      if (!Number.isInteger(cv.recovered) || cv.recovered < 0) err(`${id}: coverage.recovered must be a whole number`);
      else if (c.manifest && Number.isInteger(c.manifest.count) && cv.recovered > c.manifest.count) err(`${id}: coverage.recovered exceeds the manifest count`);
      if (cv.of != null && c.manifest && cv.of !== c.manifest.count) err(`${id}: coverage.of must equal the manifest count`);
    }
    if (c.interface === 'v3' && c.twinTokenUri != null && !String(c.twinTokenUri).includes('{id}')) err(`${id}: twinTokenUri must contain {id}`);
    if (c.helper) {
      if (helpers.has(c.helper)) err(`${id}: helper already used by "${helpers.get(c.helper)}"`);
      helpers.set(c.helper, c.key);
    }
    if (c.source) {
      if (sources.has(c.source)) err(`${id}: source already listed under "${sources.get(c.source)}" (one helper per source)`);
      sources.set(c.source, c.key);
    }
    if (c.community != null && !communities.some((m) => m.slug === c.community)) err(`${id}: unknown community "${c.community}"`);
  }

  const slugs = new Set();
  for (const m of communities) {
    const id = `community "${m && m.slug}"`;
    if (!m || !KEY_RE.test(m.slug || '')) { err(`${id}: slug must be lowercase-hyphen`); continue; }
    if (slugs.has(m.slug)) err(`${id}: duplicate slug`);
    slugs.add(m.slug);
    if (!COMMUNITY_STATUS[m.status]) err(`${id}: unknown status "${m.status}"`);
    for (const k of m.collections || []) {
      const col = reg.collections.find((c) => c.key === k);
      if (!col) err(`${id}: lists unknown collection "${k}"`);
      else if (col.community !== m.slug) err(`${id}: lists "${k}" but that collection says community "${col.community}"`);
    }
    for (const col of reg.collections) {
      if (col.community === m.slug && !(m.collections || []).includes(col.key)) err(`${id}: collection "${col.key}" claims this community but is not in its list`);
    }
    if (m.status === 'live' && !(m.collections || []).some((k) => (reg.collections.find((c) => c.key === k) || {}).status === 'live')) {
      err(`${id}: marked live but has no live collection`);
    }
  }
  return errors;
}

export async function loadRegistry(url = REGISTRY_URL, fetchFn = globalThis.fetch) {
  const res = await fetchFn(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Registry unavailable (HTTP ${res.status})`);
  const reg = await res.json();
  const problems = validateRegistry(reg);
  if (problems.length) throw new Error(`Registry invalid: ${problems.slice(0, 3).join('; ')}`);
  return reg;
}

export const getCollection = (reg, key) => reg.collections.find((c) => c.key === key) || null;
export const getCommunity = (reg, slug) => (reg.communities || []).find((m) => m.slug === slug) || null;
export const collectionsOf = (reg, slug) => reg.collections.filter((c) => c.community === slug);
export const independentCollections = (reg) => reg.collections.filter((c) => !c.community);
/**
 * Image for a collection's card, tile and page header. A hand-made logo wins; otherwise the first twin that was
 * inscribed (theme.heroTwin, a permanent fact recorded in the registry); otherwise null (callers show text).
 */
export function heroImage(reg, c) {
  if (!c || !c.theme) return null;
  if (c.theme.logo) return c.theme.logo;
  const h = c.theme.heroTwin;
  if (!h || !reg || !reg.core || !reg.core.contract) return null;
  const [addr, name] = reg.core.contract.split('.');
  return `/inscription/mainnet/${addr}/${name}/${h.xtrataId}`;
}

export const toolEnabled = (c) => !!(c && c.helper && STATUS[c.status] && STATUS[c.status].tool);

/**
 * Key from a path like /forever-twins/collection/nyc-degens (or .../nyc-degens/),
 * falling back to ?key=. Works with the _redirects rewrite and as a plain static file.
 */
export function routeKey(pathname, search, segment = 'collection') {
  const parts = String(pathname || '').split('/').filter(Boolean);
  const i = parts.lastIndexOf(segment);
  const fromPath = i >= 0 && parts[i + 1] && !['index.html', 'view.html', 'view'].includes(parts[i + 1]) ? parts[i + 1] : null;
  const q = new URLSearchParams(search || '');
  const raw = fromPath || q.get(segment === 'collection' ? 'key' : 'c') || q.get('key') || q.get('c');
  return raw && KEY_RE.test(raw) ? raw : null;
}

export const collectionUrl = (key) => `/forever-twins/collection/${key}`;
export const communityUrl = (slug) => `/forever-twins/community/${slug}`;
export const principalName = (p) => String(p || '').split('.')[1] || '';
export const stacksExplorer = (principal) => `https://explorer.hiro.so/address/${encodeURIComponent(principal)}?chain=mainnet`;
export const contractExplorer = (principal) => `https://explorer.hiro.so/txid/${encodeURIComponent(principal)}?chain=mainnet`;
