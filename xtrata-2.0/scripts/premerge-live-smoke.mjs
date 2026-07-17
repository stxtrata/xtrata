import { pathToFileURL } from 'node:url';
import { cvToJSON, hexToCV } from '@stacks/transactions';

export const DEFAULT_BASE_URL = 'https://main-staging.xtrata.pages.dev';
export const DEFAULT_HIRO_URL = 'https://api.hiro.so';
export const DROPS_ADDRESS = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
export const DROPS_NAME = 'xtrata-drops-v1-0';
export const DROPS_CONTRACT = `${DROPS_ADDRESS}.${DROPS_NAME}`;
export const SPONSOR_ADDRESS = 'SP3EHW9BYF23GNAQ3CC6818J1ZZRWVQM3DSRSN0AF';
export const MIN_SPONSOR_BALANCE_USTX = 5_000_000n;

export const WALLET_CANARIES = [
  {
    wallet: 'Leather',
    txid: 'ffa5ff1b4b313102f0a6e648b7a7a71663ff73c455c9ff5ed7e9b00a826ca3f0',
    claimer: 'SP1QJJVMB6NQBGMZQVDR22PADW2E3BEP61R2Z8D7V',
    token: 'u2743'
  },
  {
    wallet: 'Xverse',
    txid: 'e9c7680f943864915068cd10d4452af07db6c7e6c283fdd628bbfac8121b1334',
    claimer: 'SP3W6567DR121BHVV05J5ECQM4G3YXG87137EATW',
    token: 'u2761'
  }
];

const requiredDropFunctions = [
  'claim',
  'claim-fee',
  'create-drop',
  'get-listing',
  'get-sponsor',
  'settle-refund'
];

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const fetchWithTimeout = async (fetchImpl, url, init = {}, timeoutMs = 12_000) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetchImpl(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
};

const readJson = async (response, label) => {
  let body;
  try {
    body = await response.json();
  } catch {
    throw new Error(`${label} returned non-JSON content (HTTP ${response.status})`);
  }
  assert(response.ok, `${label} returned HTTP ${response.status}: ${body?.error ?? body?.message ?? 'unknown error'}`);
  return body;
};

const checkCanonicalClaim = (tx, canary) => {
  assert(tx.tx_status === 'success', `${canary.wallet} canary is ${tx.tx_status ?? 'missing'}`);
  assert(tx.canonical === true, `${canary.wallet} canary is not canonical`);
  assert(tx.sponsored === true, `${canary.wallet} canary is not sponsored`);
  assert(Number(tx.nonce) === 0, `${canary.wallet} canary origin nonce is not 0`);
  assert(tx.sender_address === canary.claimer, `${canary.wallet} canary claimer changed`);
  assert(tx.sponsor_address === SPONSOR_ADDRESS, `${canary.wallet} canary sponsor changed`);
  assert(tx.contract_call?.contract_id === DROPS_CONTRACT, `${canary.wallet} canary targets the wrong contract`);
  assert(tx.contract_call?.function_name === 'claim', `${canary.wallet} canary targets the wrong function`);
  const transfer = (tx.events ?? []).find((event) =>
    event.event_type === 'non_fungible_token_asset' &&
    event.asset?.asset_event_type === 'transfer' &&
    event.asset?.recipient === canary.claimer &&
    event.asset?.value?.repr === canary.token
  );
  assert(Boolean(transfer), `${canary.wallet} canary is missing its NFT transfer`);
};

export const runReadOnlyReleaseSmoke = async ({
  fetchImpl = globalThis.fetch,
  baseUrl = process.env.XTRATA_SMOKE_BASE_URL || DEFAULT_BASE_URL,
  hiroUrl = process.env.XTRATA_SMOKE_HIRO_URL || DEFAULT_HIRO_URL
} = {}) => {
  const site = baseUrl.replace(/\/+$/, '');
  const hiro = hiroUrl.replace(/\/+$/, '');
  const results = [];
  const check = async (name, action) => {
    try {
      const detail = await action();
      results.push({ name, ok: true, detail });
    } catch (error) {
      results.push({ name, ok: false, detail: error instanceof Error ? error.message : String(error) });
    }
  };

  await check('SPA /drops route', async () => {
    const response = await fetchWithTimeout(fetchImpl, `${site}/drops`);
    const html = await response.text();
    assert(response.status === 200, `/drops returned HTTP ${response.status}`);
    assert(html.includes('id="dropsListings"'), '/drops did not return the Drops SPA shell');
    return '200 with Drops shell';
  });

  await check('SPA /market route', async () => {
    const response = await fetchWithTimeout(fetchImpl, `${site}/market`);
    const html = await response.text();
    assert(response.status === 200, `/market returned HTTP ${response.status}`);
    assert(html.includes('id="marketListings"'), '/market did not return the Market SPA shell');
    return '200 with Market shell';
  });

  await check('Edge market listings feed', async () => {
    const response = await fetchWithTimeout(fetchImpl, `${site}/market/listings`);
    const body = await readJson(response, 'market listings');
    assert(Array.isArray(body.listings), 'market listings response has no listings array');
    return `${body.listings.length} rows${body.degraded ? ' (degraded, direct-read fallback remains active)' : ''}`;
  });

  await check('Sponsor function route (non-spending OPTIONS)', async () => {
    const response = await fetchWithTimeout(fetchImpl, `${site}/sponsor/quote`, { method: 'OPTIONS' });
    assert(response.status === 204, `sponsor OPTIONS returned HTTP ${response.status}`);
    assert(
      response.headers.get('access-control-allow-methods')?.includes('POST'),
      'sponsor route is missing POST CORS support'
    );
    return '204 with sponsor CORS';
  });

  await check('Drops contract ABI', async () => {
    const response = await fetchWithTimeout(
      fetchImpl,
      `${hiro}/v2/contracts/interface/${DROPS_ADDRESS}/${DROPS_NAME}`
    );
    const body = await readJson(response, 'drops ABI');
    const names = new Set((body.functions ?? []).map((fn) => fn.name));
    const missing = requiredDropFunctions.filter((name) => !names.has(name));
    assert(missing.length === 0, `drops ABI is missing ${missing.join(', ')}`);
    return `${requiredDropFunctions.length} required functions present`;
  });

  await check('On-chain drops sponsor', async () => {
    const response = await fetchWithTimeout(
      fetchImpl,
      `${hiro}/v2/contracts/call-read/${DROPS_ADDRESS}/${DROPS_NAME}/get-sponsor`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: DROPS_ADDRESS, arguments: [] })
      }
    );
    const body = await readJson(response, 'get-sponsor');
    assert(body.okay === true && typeof body.result === 'string', 'get-sponsor returned no Clarity result');
    const sponsor = cvToJSON(hexToCV(body.result))?.value?.value;
    assert(sponsor === SPONSOR_ADDRESS, `on-chain sponsor is ${sponsor ?? 'missing'}`);
    return sponsor;
  });

  await check('Sponsor wallet reserve', async () => {
    const response = await fetchWithTimeout(fetchImpl, `${hiro}/extended/v1/address/${SPONSOR_ADDRESS}/stx`);
    const body = await readJson(response, 'sponsor balance');
    const balance = BigInt(body.balance ?? '-1');
    assert(balance >= MIN_SPONSOR_BALANCE_USTX, `sponsor balance ${balance} is below ${MIN_SPONSOR_BALANCE_USTX}`);
    return `${(Number(balance) / 1_000_000).toFixed(6)} STX`;
  });

  for (const canary of WALLET_CANARIES) {
    await check(`${canary.wallet} nonce-0 sponsored claim canary`, async () => {
      const response = await fetchWithTimeout(fetchImpl, `${hiro}/extended/v1/tx/0x${canary.txid}`);
      const body = await readJson(response, `${canary.wallet} canary`);
      checkCanonicalClaim(body, canary);
      return `canonical success; ${canary.token}`;
    });
  }

  return results;
};

export const assertReleaseSmokePassed = (results) => {
  const failures = results.filter((result) => !result.ok);
  if (failures.length) {
    throw new Error(`${failures.length} release smoke check${failures.length === 1 ? '' : 's'} failed`);
  }
};

const isDirectRun = process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url;
if (isDirectRun) {
  const results = await runReadOnlyReleaseSmoke();
  for (const result of results) {
    console.log(`${result.ok ? 'PASS' : 'FAIL'}  ${result.name}: ${result.detail}`);
  }
  try {
    assertReleaseSmokePassed(results);
    console.log(`\nRelease smoke passed (${results.length}/${results.length}). No transactions were signed or broadcast.`);
  } catch (error) {
    console.error(`\n${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}
