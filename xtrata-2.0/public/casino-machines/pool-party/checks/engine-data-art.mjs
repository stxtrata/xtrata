// Verifies the bundled token art and protocol snapshots against their recorded primary-source responses.
// This checks evidence consistency, not live prices, rates, ownership, or third-party permission.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = async path => JSON.parse(await readFile(join(ROOT, path), 'utf8'));
const sources = await read('art/sources.json'), data = await read('data/pool-party-snapshots.json');
const contracts = {
  USDA: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.usda-token',
  DIKO: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.arkadiko-token',
  CHA: 'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.charisma-token',
  VELAR: 'SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.velar-token',
  ALEX: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.age000-governance-token'
};
const checks = [];
function check(name, ok, info = null) { checks.push({ name, ok: Boolean(ok), info }); }
for (const symbol of ['USDA', 'DIKO', 'CHA', 'VELAR', 'ALEX', 'STX']) {
  const asset = sources.assets.find(item => item.symbol === symbol);
  if (!asset) { check(`${symbol} supplied`, false); continue; }
  const bytes = await readFile(join(ROOT, asset.file));
  const actual = createHash('sha256').update(bytes).digest('hex');
  check(`${symbol} original file hash`, actual === asset.sha256 && asset.modified === false,
    { path: asset.file, bytes: bytes.length, sha256: actual });
  check(`${symbol} has primary source, retrieval date, and pending public permission`,
    /^https:\/\//.test(asset.source_url) && !Number.isNaN(Date.parse(asset.downloaded_at)) && asset.permission_required_before_public_build === true,
    { source: asset.source_url, permission: asset.permission_status });
  if (contracts[symbol]) {
    const metadata = await read(asset.metadata_snapshot);
    check(`${symbol} exact contract verified in metadata snapshot`,
      asset.contract === contracts[symbol] && metadata.contract === contracts[symbol] &&
      metadata.metadata.asset_identifier.startsWith(contracts[symbol] + '::'),
      { contract: asset.contract, metadata: asset.metadata_snapshot });
  }
}
const velar = (await read('data/raw/velar-pools.json')).data;
const charisma = (await read('data/raw/charisma-vaults.json')).data;
check('All four data-symbol families contain at least eighteen records',
  ['poolPairs', 'lpTokens', 'swaps', 'yields'].every(key => data[key].length >= 18),
  Object.fromEntries(['poolPairs', 'lpTokens', 'swaps', 'yields'].map(key => [key, data[key].length])));
check('Every bundled data tile is dated and labelled as a snapshot',
  ['poolPairs', 'lpTokens', 'swaps', 'yields'].every(key => data[key].every(item =>
    item.snapshotDate === data.snapshotDate && /SNAPSHOT/.test(item.label) && /^https:\/\//.test(item.source))),
  { snapshotDate: data.snapshotDate });
check('Pair contracts and token addresses match bundled Charisma API responses', data.poolPairs.every(item => {
  const record = charisma.find(record => record.contractId === item.contractId);
  return record && record.tokenA.contractId === item.tokenA && record.tokenB.contractId === item.tokenB;
}));
check('LP token contracts and pair addresses match bundled Velar API responses', data.lpTokens.every(item => {
  const record = velar.find(record => record.lpTokenContractAddress === item.lpTokenContract);
  return record && record.symbol === item.pair && record.token0ContractAddress === item.tokenA && record.token1ContractAddress === item.tokenB;
}));
check('Unavailable APR is null and is never inferred from APY', data.yields.every(item => {
  const record = velar.find(record => record.lpTokenContractAddress === item.lpTokenContract);
  return record && item.apr === null && item.aprStatus === 'unavailable' && item.display === 'APR UNAVAILABLE' &&
    item.rawAPY === record.stats.apy && item.rawAPYField === 'stats.apy';
}));
const transactionCache = new Map();
for (const item of data.swaps) {
  if (!transactionCache.has(item.sourceFile)) transactionCache.set(item.sourceFile, (await read(item.sourceFile)).results);
}
check('Swap IDs, contracts, functions, blocks and success status match raw transaction responses', data.swaps.every(item => {
  const record = transactionCache.get(item.sourceFile).find(record => record.tx_id === item.txid);
  return record && record.tx_status === item.status && item.status === 'success' && record.block_height === item.blockHeight &&
    record.contract_call.contract_id === item.contract && record.contract_call.function_name === item.function && /swap/i.test(item.function);
}));
const fund = await read('fund.json');
check('Machine Fund config is type W, all-live, weekly and unsplit', fund.type === 'W' && fund.collections === 'all-live' &&
  fund.period === 'weekly' && fund.periodStart === 'Monday 00:00 UTC' && fund.split === null);
const report = { checkedAt: new Date().toISOString(), scope: 'Bundled evidence consistency', checks,
  outstanding: ['No verified APR was available; yield tiles must remain explicitly labelled APR UNAVAILABLE.',
    'Third-party logos require project permission before a public build.',
    'All API records are dated build snapshots, not live data.'],
  ok: checks.every(item => item.ok) };
await mkdir(join(ROOT, 'checks/results'), { recursive: true });
await writeFile(join(ROOT, 'checks/results/art-data.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (!report.ok) process.exitCode = 1;
