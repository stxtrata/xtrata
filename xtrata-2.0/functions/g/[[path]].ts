// /g/:name[/:gallery] — resolve a BNS name (or manifest id) to its newest
// Xtrata gallery manifest and render it. Phase 1 of the Manifest Studio plan
// (see MANIFEST-STUDIO-AND-GALLERIES-PLAN.md).
//
//   /g/dyle.btc                → newest profile → default gallery (or newest gallery manifest)
//   /g/dyle.btc/selected-works → that named gallery
//   /g/512                     → a specific manifest inscription id (immutable)
//   ?format=json               → resolved manifest JSON + resolution metadata
//
// Freshness: inscriptions are immutable, so "update" = inscribe a new manifest.
// We scan the address's newest holdings first, so the newest valid manifest
// always wins; `supersedes` chains document history.
import contractRegistry from '../../src/data/contract-registry.json';
import { onRequest as onRuntimeContentRequest } from '../runtime/content';
import type { RuntimeEnv } from '../runtime/lib';
import { getHiroApiKeys, applyHiroApiKey } from '../lib/hiro-keys';

type RegistryEntry = { address: string; contractName: string; network: string };

const NFT_ASSET_NAME = 'xtrata-inscription';
const SCAN_LIMIT = 48; // newest holdings inspected when hunting for manifests
const MAX_MANIFEST_BYTES = 262144;

const mainnetContracts = (contractRegistry as RegistryEntry[])
  .filter((entry) => entry.network === 'mainnet')
  .map((entry) => `${entry.address}.${entry.contractName}`);
const defaultContractId = mainnetContracts[mainnetContracts.length - 1] || '';

const json = (body: unknown, status = 200, cache = 'public, max-age=60') =>
  new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': cache }
  });

const hiroFetch = async (env: RuntimeEnv, path: string) => {
  const headers = new Headers({ accept: 'application/json' });
  const keys = getHiroApiKeys(env);
  applyHiroApiKey(headers, keys[0] ?? null);
  return fetch(`https://api.hiro.so${path}`, { headers });
};

const resolveNameToAddress = async (env: RuntimeEnv, name: string) => {
  const response = await hiroFetch(env, `/v1/names/${encodeURIComponent(name.toLowerCase())}`);
  if (!response.ok) return null;
  const data = (await response.json()) as { address?: string };
  return typeof data.address === 'string' && data.address ? data.address : null;
};

const listNewestHoldings = async (env: RuntimeEnv, address: string) => {
  const identifiers = mainnetContracts.map((id) => `${id}::${NFT_ASSET_NAME}`).join(',');
  const response = await hiroFetch(
    env,
    `/extended/v1/tokens/nft/holdings?principal=${encodeURIComponent(address)}` +
      `&asset_identifiers=${encodeURIComponent(identifiers)}&limit=${SCAN_LIMIT}&unanchored=true`
  );
  if (!response.ok) return [] as Array<{ tokenId: string; contractId: string }>;
  const data = (await response.json()) as {
    results?: Array<{ asset_identifier?: string; value?: { repr?: string } }>;
  };
  const holdings: Array<{ tokenId: string; contractId: string }> = [];
  for (const row of data.results ?? []) {
    const contractId = String(row.asset_identifier ?? '').split('::')[0];
    const tokenId = String(row.value?.repr ?? '').replace(/^u/, '');
    if (contractId && /^\d+$/.test(tokenId)) holdings.push({ tokenId, contractId });
  }
  // Newest inscriptions first — token ids are monotonic per contract.
  return holdings.sort((a, b) => Number(b.tokenId) - Number(a.tokenId));
};

const fetchInscriptionContent = async (
  env: RuntimeEnv,
  waitUntil: (p: Promise<unknown>) => void,
  tokenId: string,
  contractId: string
) => {
  const url = new URL('https://internal/runtime/content');
  url.searchParams.set('contractId', contractId || defaultContractId);
  url.searchParams.set('tokenId', tokenId);
  url.searchParams.set('network', 'mainnet');
  return onRuntimeContentRequest({
    request: new Request(url.toString()),
    env,
    waitUntil
  } as Parameters<typeof onRuntimeContentRequest>[0]);
};

type Envelope = {
  xtrataManifest?: {
    kind?: string;
    name?: string;
    title?: string;
    description?: string;
    bnsName?: string;
    supersedes?: string | null;
  };
  items?: Array<{ tokenId?: string; contractId?: string; label?: string; media?: string }>;
  galleries?: Array<{ name?: string; manifestId?: string; title?: string; default?: boolean }>;
  display?: { mode?: string; cover?: string };
};

const readManifest = async (response: Response): Promise<Envelope | null> => {
  const type = (response.headers.get('content-type') || '').toLowerCase();
  const length = Number(response.headers.get('content-length') || '0');
  const looksJson = type.includes('json') || type.includes('text/plain');
  if (!response.ok || !looksJson || length > MAX_MANIFEST_BYTES) {
    try { await response.body?.cancel(); } catch { /* noop */ }
    return null;
  }
  try {
    const text = await response.text();
    if (text.length > MAX_MANIFEST_BYTES) return null;
    const parsed = JSON.parse(text) as Envelope;
    return parsed && typeof parsed === 'object' && parsed.xtrataManifest ? parsed : null;
  } catch {
    return null;
  }
};

const findManifests = async (
  env: RuntimeEnv,
  waitUntil: (p: Promise<unknown>) => void,
  address: string
) => {
  const holdings = await listNewestHoldings(env, address);
  const found: Array<{ tokenId: string; contractId: string; manifest: Envelope }> = [];
  for (const holding of holdings) {
    const response = await fetchInscriptionContent(env, waitUntil, holding.tokenId, holding.contractId);
    const manifest = await readManifest(response);
    if (manifest) found.push({ ...holding, manifest });
    // One profile + one gallery is enough to render; keep scanning shallowly otherwise.
    const hasProfile = found.some((f) => f.manifest.xtrataManifest?.kind === 'profile');
    const hasGallery = found.some((f) => ['gallery', 'creator-collection'].includes(f.manifest.xtrataManifest?.kind || ''));
    if (hasProfile && hasGallery) break;
  }
  return found;
};

const escapeHtml = (value: unknown) =>
  String(value ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string
  );

const renderGalleryPage = (params: {
  manifest: Envelope;
  manifestTokenId: string;
  curatorName: string | null;
  address: string | null;
}) => {
  const { manifest, manifestTokenId, curatorName, address } = params;
  const head = manifest.xtrataManifest || {};
  const items = (manifest.items || []).filter((item) => /^\d+$/.test(String(item.tokenId || '')));
  const title = head.title || head.name || 'Xtrata Gallery';
  const kind = head.kind === 'creator-collection' ? 'Owner-attested collection' : 'Curated gallery';
  const mode = manifest.display?.mode || 'viewing';
  const curator = curatorName || head.bnsName || (address ? `${address.slice(0, 6)}…${address.slice(-4)}` : 'unknown');
  // Tiles are hydrated client-side via a content-source ladder: migrated tokens
  // keep their id on v3 but their chunks stay on the core they were minted on,
  // so we probe v3-2-3 -> v2-1-0 -> v1-1-1 and use the first real response.
  const tiles = items
    .map((item) => {
      const id = escapeHtml(item.tokenId);
      const label = escapeHtml(item.label || `#${item.tokenId}`);
      return `<a class="tile" data-token="${id}" href="/inscription/${id}" target="_blank" rel="noopener"><div class="tile-media"><div class="tile-wait">#${id}</div></div><div class="tile-label">${label}</div></a>`;
    })
    .join('\n');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)} · Xtrata Gallery</title>
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<style>
  :root{color-scheme:dark;--bg:#0b0e14;--panel:#121723;--line:#243044;--ink:#e6edf6;--mut:#8b9bb4;--acc:#3ea6ff}
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;background:var(--bg);color:var(--ink);font:15px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
  header{display:flex;align-items:center;gap:12px;padding:14px 20px;border-bottom:1px solid var(--line)}
  header a.home{flex:none;display:block}
  header img{width:28px;height:28px;border-radius:7px;display:block}
  .crumb{font-weight:800}.crumb a{color:var(--acc);text-decoration:none}
  .badge{margin-left:auto;font-size:11px;color:var(--mut);border:1px solid var(--line);border-radius:999px;padding:3px 10px}
  main{max-width:1180px;margin:0 auto;padding:28px 18px 64px}
  h1{margin:0 0 4px;font-size:26px}
  .meta{color:var(--mut);font-size:13px;margin-bottom:6px}
  .meta b{color:var(--ink)}
  .desc{color:var(--mut);max-width:720px;margin:10px 0 26px}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px}
  .tile{display:block;background:var(--panel);border:1px solid var(--line);border-radius:12px;overflow:hidden;color:inherit;text-decoration:none;transition:border-color .12s}
  .tile:hover{border-color:var(--acc)}
  .tile-media{aspect-ratio:1/1;background:#0e131d}
  .tile-media img,.tile-media iframe{width:100%;height:100%;object-fit:cover;border:0;display:block}
  .tile-label{padding:9px 12px;font-size:12.5px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .tile-wait{display:grid;place-items:center;height:100%;color:var(--mut);font-family:ui-monospace,monospace;font-size:12px;text-align:center}
  footer{padding:18px 20px;color:var(--mut);font-size:12px;text-align:center;border-top:1px solid var(--line)}
  footer a{color:var(--acc)}
</style>
</head>
<body>
<header>
  <a class="home" href="/" title="Xtrata home"><img src="/favicon.svg" alt="Xtrata" /></a>
  <span class="crumb"><a href="/">XTRATA</a> · Galleries</span>
  <span class="badge">${escapeHtml(kind)} · manifest #${escapeHtml(manifestTokenId)}</span>
</header>
<main>
  <h1>${escapeHtml(title)}</h1>
  <div class="meta">Curated by <b>${escapeHtml(curator)}</b> · ${items.length} item${items.length === 1 ? '' : 's'} · ${escapeHtml(mode)} gallery${head.supersedes ? ` · <a style="color:var(--acc)" href="/g/${escapeHtml(head.supersedes)}">previous version</a>` : ''}</div>
  ${head.description ? `<p class="desc">${escapeHtml(head.description)}</p>` : ''}
  <div class="grid">${tiles || '<p class="meta">This manifest lists no items yet.</p>'}</div>
</main>
<script>
(function(){
  var CORES=['SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3','SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v2-1-0','SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v1-1-1'];
  async function resolve(id){
    for(var i=0;i<CORES.length;i++){
      var url='/runtime/content?contractId='+encodeURIComponent(CORES[i])+'&tokenId='+id+'&network=mainnet';
      try{var r=await fetch(url);var t=(r.headers.get('content-type')||'').toLowerCase();
        try{r.body&&r.body.cancel&&r.body.cancel()}catch(e){}
        if(r.ok&&t.indexOf('application/json')===-1)return{url:url,type:t};
      }catch(e){}
    }
    return null;
  }
  var tiles=Array.prototype.slice.call(document.querySelectorAll('.tile[data-token]'));
  var queue=tiles.slice();
  function next(){
    var tile=queue.shift();if(!tile)return;
    var id=tile.getAttribute('data-token');
    resolve(id).then(function(m){
      var box=tile.querySelector('.tile-media');
      if(!m){box.innerHTML='<div class="tile-wait">#'+id+'<br>unreachable</div>';}
      else if(m.type.indexOf('image/')===0){box.innerHTML='<img loading="lazy" src="'+m.url+'" alt="#'+id+'" />';tile.href=m.url;}
      else{box.innerHTML='<iframe loading="lazy" src="'+m.url+'" sandbox="allow-scripts allow-same-origin" title="#'+id+'"></iframe>';tile.href=m.url;}
      next();
    });
  }
  // hydrate 4 tiles at a time
  for(var k=0;k<4;k++)next();
})();
</scr`+`ipt>
<footer>Galleries are immutable Xtrata manifests — the newest manifest inscribed by the name's owner is always shown. <a href="/g/${escapeHtml(head.bnsName || '')}?format=json">Raw JSON</a></footer>
</body>
</html>`;
};

const html = (body: string, cache: string) =>
  new Response(body, {
    status: 200,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': cache }
  });

export const onRequest: PagesFunction = async ({ request, env, params, waitUntil }) => {
  const runtimeEnv = env as RuntimeEnv;
  const wait = waitUntil ?? (() => {});
  const rawSegments: unknown[] = Array.isArray(params.path) ? params.path : [params.path];
  const segments = rawSegments
    .filter((s: unknown): s is string => typeof s === 'string' && s.length > 0)
    .map((s: string) => decodeURIComponent(s).trim().toLowerCase());
  const url = new URL(request.url);
  const wantsJson = url.searchParams.get('format') === 'json';

  if (segments.length === 0) {
    return json({ error: 'Usage: /g/<bns-name>[/<gallery>] or /g/<manifest-id>' }, 400);
  }

  const [first, handle] = segments;

  // Direct, immutable manifest id.
  if (/^\d+$/.test(first)) {
    const response = await fetchInscriptionContent(runtimeEnv, wait, first, defaultContractId);
    const manifest = await readManifest(response);
    if (!manifest) return json({ error: `Inscription #${first} is not an Xtrata manifest.` }, 404);
    if (wantsJson) return json({ manifestTokenId: first, manifest }, 200, 'public, max-age=31536000, immutable');
    return html(
      renderGalleryPage({ manifest, manifestTokenId: first, curatorName: manifest.xtrataManifest?.bnsName || null, address: null }),
      'public, max-age=31536000, immutable'
    );
  }

  // BNS name.
  const name = first.includes('.') ? first : `${first}.btc`;
  const address = await resolveNameToAddress(runtimeEnv, name);
  if (!address) return json({ error: `Could not resolve ${name} to a Stacks address.` }, 404);

  const found = await findManifests(runtimeEnv, wait, address);
  const profile = found.find((f) => f.manifest.xtrataManifest?.kind === 'profile');
  let target: { tokenId: string; contractId: string; manifest: Envelope } | null = null;

  if (profile && Array.isArray(profile.manifest.galleries) && profile.manifest.galleries.length) {
    const entry = handle
      ? profile.manifest.galleries.find((g) => g.name === handle)
      : profile.manifest.galleries.find((g) => g.default) || profile.manifest.galleries[0];
    if (entry && /^\d+$/.test(String(entry.manifestId || ''))) {
      const response = await fetchInscriptionContent(runtimeEnv, wait, String(entry.manifestId), defaultContractId);
      const manifest = await readManifest(response);
      if (manifest) target = { tokenId: String(entry.manifestId), contractId: defaultContractId, manifest };
    }
  }
  if (!target) {
    // No profile (or broken pointer): fall back to the newest gallery-like manifest held by the address.
    target =
      found.find((f) => {
        const kind = f.manifest.xtrataManifest?.kind || '';
        const matchesHandle = !handle || f.manifest.xtrataManifest?.name === handle;
        return ['gallery', 'creator-collection'].includes(kind) && matchesHandle;
      }) || null;
  }
  if (!target) {
    return json(
      { error: `No gallery manifest found for ${name}${handle ? `/${handle}` : ''}.`, address, hint: 'Inscribe a manifest with an {"xtrataManifest":{"kind":"gallery",…}} envelope — see /schemas/manifest-envelope.schema.json' },
      404
    );
  }

  if (wantsJson) {
    return json({ name, address, manifestTokenId: target.tokenId, viaProfile: Boolean(profile), manifest: target.manifest });
  }
  return html(
    renderGalleryPage({ manifest: target.manifest, manifestTokenId: target.tokenId, curatorName: name, address }),
    'public, max-age=60'
  );
};
