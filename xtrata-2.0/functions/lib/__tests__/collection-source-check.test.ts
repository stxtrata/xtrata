import { beforeEach, describe, expect, it } from 'vitest';
import v19Template from '../../../contracts/live/xtrata-collection-mint-v1.9.clar?raw';
import v17Template from '../../../contracts/live/xtrata-collection-mint-v1.7.clar?raw';
import preinscribedTemplate from '../../../contracts/live/xtrata-preinscribed-collection-sale-v1.0.clar?raw';
import { buildArtistDeployContractSource } from '../../../src/lib/deploy/artist-deploy';
import { compactClaritySource } from '../../../src/lib/deploy/template-fingerprint';
import {
  clearCollectionSourceVerdictCache,
  DEFAULT_SOURCE_CHECK_FROM,
  getCollectionDeployReadiness
} from '../collection-deploy';

const ARTIST = 'SP3JB6BCKV14CG25NF017CR7KRVSM8RAGHB52DWHX';
const CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
const CONTRACT = 'xtrata-collection-numbers-c1';
const AFTER = Date.parse(DEFAULT_SOURCE_CHECK_FROM) + 1000;
const BEFORE = Date.parse(DEFAULT_SOURCE_CHECK_FROM) - 1000;

const approvedSource = compactClaritySource(buildArtistDeployContractSource({
  input: { collectionName: 'Numbers', symbol: 'NUM', description: '', supply: '10', mintType: 'standard',
    mintPriceStx: '5', artistAddress: ARTIST, marketplaceAddress: ARTIST },
  templateSources: { standardSource: v19Template, preinscribedSource: preinscribedTemplate },
  coreContractId: CORE,
  operatorAddress: ARTIST
}).source);

const row = (createdAt: number | null, extra: Record<string, unknown> = {}) => ({
  id: 'c1',
  contract_address: ARTIST,
  created_at: createdAt,
  metadata: JSON.stringify({ contractName: CONTRACT, ...extra })
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

/** Hiro stand-in: contract source by URL, tx status by URL. */
const hiro = (source: string | null, options: { sourceStatus?: number; urls?: string[] } = {}) =>
  async (input: RequestInfo | URL) => {
    const url = String(input);
    options.urls?.push(url);
    if (url.includes('/extended/v1/tx/')) return json({ tx_status: 'success' });
    if (url.includes('/v2/contracts/source/')) {
      if (options.sourceStatus && options.sourceStatus !== 200) return new Response('busy', { status: options.sourceStatus });
      return source === null ? new Response('not found', { status: 404 }) : json({ source });
    }
    return new Response('unexpected', { status: 500 });
  };

const readiness = (collection: Record<string, unknown>, fetcher: typeof fetch, env: Record<string, unknown> = {}) =>
  getCollectionDeployReadiness({
    env,
    collectionId: 'c1',
    queryAllImpl: async () => ({ results: [collection] }),
    fetcher
  });

beforeEach(() => clearCollectionSourceVerdictCache());

describe('deployed-code check', () => {
  it('lists a new collection deployed from the approved template', async () => {
    const result = await readiness(row(AFTER), hiro(approvedSource));
    expect(result.ready).toBe(true);
  });

  it('refuses a new collection whose code was edited before deploying', async () => {
    const edited = approvedSource.replace('(define-constant PLATFORM-MIN-BPS u250)', '(define-constant PLATFORM-MIN-BPS u0)');
    const result = await readiness(row(AFTER), hiro(edited));
    expect(result.ready).toBe(false);
    expect(result.reason).toContain('does not match an approved Xtrata template');
  });

  it('refuses a new collection deployed from v1.7', async () => {
    const result = await readiness(row(AFTER), hiro(v17Template));
    expect(result.ready).toBe(false);
  });

  it('checks the code on the deploy-tx path too, reading the collection contract', async () => {
    const urls: string[] = [];
    const edited = `${approvedSource}\n(define-public (drain) (ok true))`;
    const result = await readiness(row(AFTER, { deployTxId: '0xabc' }), hiro(edited, { urls }));
    expect(result.ready).toBe(false);
    expect(urls.some((url) => url.endsWith(`/v2/contracts/source/${ARTIST}/${CONTRACT}`))).toBe(true);
    clearCollectionSourceVerdictCache();
    expect((await readiness(row(AFTER, { deployTxId: '0xabc' }), hiro(approvedSource))).ready).toBe(true);
  });

  it('says "could not check" when the code cannot be read, instead of rejecting it', async () => {
    const result = await readiness(row(AFTER, { deployTxId: '0xabc' }), hiro(approvedSource, { sourceStatus: 429 }));
    expect(result.ready).toBe(false);
    expect(result.reason).toContain('Could not check the contract code right now');
    // Not cached: a later successful read lists it.
    expect((await readiness(row(AFTER, { deployTxId: '0xabc' }), hiro(approvedSource))).ready).toBe(true);
  });

  it('leaves collections created before the check (e.g. Audionauts on v1.7) alone', async () => {
    expect((await readiness(row(BEFORE), hiro(v17Template))).ready).toBe(true);
    expect((await readiness(row(null), hiro(v17Template))).ready).toBe(true);
  });

  it('honours the COLLECTION_SOURCE_CHECK_FROM override', async () => {
    const env = { COLLECTION_SOURCE_CHECK_FROM: String(BEFORE - 5000) };
    expect((await readiness(row(BEFORE), hiro(v17Template), env)).ready).toBe(false);
  });

  it('reads each contract once per isolate', async () => {
    const urls: string[] = [];
    const fetcher = hiro(approvedSource, { urls });
    await readiness(row(AFTER, { deployTxId: '0xabc' }), fetcher);
    await readiness(row(AFTER, { deployTxId: '0xabc' }), fetcher);
    expect(urls.filter((url) => url.includes('/v2/contracts/source/'))).toHaveLength(1);
  });
});
