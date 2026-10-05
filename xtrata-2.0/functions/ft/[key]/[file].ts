// Forever Twins resolver: GET /ft/<collection>/<id>.json
// This is the token URI recorded in each helper's canonical record (permanent once finalised).
// It returns SIP-16 style metadata for the twin of original token <id>: the preserved on-chain bytes
// (via the Xtrata inscription route) plus provenance (original contract and id, hashes, manifest, snapshot).
// Read-only: GETs the manifest asset and one Hiro read-only call (helper get-binding). No writes.
import { cvToHex, cvToJSON, hexToCV, uintCV } from '@stacks/transactions';
import resolverConfig from '../collections.json';
import { getHiroApiKeys } from '../lib/hiro-keys';
import {
  buildTwinMetadata,
  cacheControlFor,
  findToken,
  parseTokenFile,
  type Manifest,
  type ResolverConfig,
  type TwinState
} from '../lib';

type Fetcher = { fetch: (request: Request) => Promise<Response> };
type Env = Record<string, unknown> & { ASSETS: Fetcher };

const config = resolverConfig as unknown as ResolverConfig;
const HIRO = 'https://api.hiro.so';

const json = (body: unknown, status: number, cache: string) =>
  new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': cache,
      'access-control-allow-origin': '*'
    }
  });

const readBinding = async (helper: string, id: number, env: Env): Promise<TwinState> => {
  const [address, name] = helper.split('.');
  const url = `${HIRO}/v2/contracts/call-read/${address}/${name}/get-binding`;
  const body = JSON.stringify({ sender: address, arguments: [cvToHex(uintCV(id))] });
  // Try each configured key (a list may be newline/comma separated), rotating on 401/403/429, then keyless.
  const attempts: Array<string | null> = [...getHiroApiKeys(env), null];
  let res: Response | undefined;
  for (const key of attempts) {
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...(key ? { 'x-api-key': key } : {}) },
        body
      });
    } catch {
      res = undefined;
      continue;
    }
    if (![401, 403, 429].includes(res.status)) break;
  }
  if (!res || !res.ok) throw new Error(`Hiro ${res ? res.status : 'unreachable'}`);
  const reply = (await res.json()) as { okay?: boolean; result?: string };
  if (!reply.okay || !reply.result) throw new Error('read-only call failed');
  const parsed = cvToJSON(hexToCV(reply.result)) as { value?: { value?: Record<string, { value?: string }> } | null };
  const tuple = parsed.value && (parsed.value as { value?: Record<string, { value?: string }> }).value;
  const xtrata = tuple?.['xtrata-id']?.value;
  return xtrata ? { status: 'inscribed', xtrataId: BigInt(xtrata) } : { status: 'not-inscribed' };
};

export const onRequest = async ({
  request,
  params,
  env
}: {
  request: Request;
  params: { key?: string | string[]; file?: string | string[] };
  env: Env;
}) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: { 'access-control-allow-origin': '*' } });
  }
  const key = Array.isArray(params.key) ? params.key[0] : params.key;
  const file = Array.isArray(params.file) ? params.file[0] : params.file;
  const collection = key ? config.collections[key] : undefined;
  // Not a collection key (for example /ft/data/<file>): serve the static asset as is.
  if (!key || !collection) return env.ASSETS.fetch(request);

  const id = file ? parseTokenFile(file) : null;
  if (id === null) return json({ error: 'expected /ft/<collection>/<id>.json' }, 400, 'no-store');

  const manifestRes = await env.ASSETS.fetch(new Request(new URL(collection.manifestPath, request.url)));
  if (!manifestRes.ok) return json({ error: 'manifest unavailable' }, 503, 'no-store');
  const manifest = (await manifestRes.json()) as Manifest;
  const token = findToken(manifest, id);
  if (!token) return json({ error: `token ${id} is not in the ${collection.label} manifest` }, 404, 'public, max-age=300');

  let state: TwinState;
  if (!collection.helper) {
    state = { status: 'helper-not-deployed' };
  } else {
    try {
      state = await readBinding(collection.helper, id, env);
    } catch (err) {
      // Never cache a guess: if the chain read fails, say so.
      return json({ error: 'could not read the helper contract right now', detail: err instanceof Error ? err.message : 'unknown' }, 503, 'no-store');
    }
  }

  const body = buildTwinMetadata({ config, key, collection, manifest, token, state });
  return json(body, 200, cacheControlFor(state));
};
