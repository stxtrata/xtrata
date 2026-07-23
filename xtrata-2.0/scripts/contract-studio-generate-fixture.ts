import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { generateLeaderboardSource } from '../src/lib/contract-studio/leaderboard';
import {
  DEFAULT_LEADERBOARD_CONFIGURATION,
  type XtrataAssetRef
} from '../src/lib/contract-studio/model';

const SIMNET_DEPLOYER = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const asset: XtrataAssetRef = {
  network: 'testnet',
  coreContractId: `${SIMNET_DEPLOYER}.mock-xtrata-studio-core`,
  tokenId: '42',
  contentHash: 'ab'.repeat(32),
  creator: SIMNET_DEPLOYER,
  owner: SIMNET_DEPLOYER,
  mimeType: 'text/html',
  totalSize: '1234',
  parents: [],
  dependencies: [],
  protocolVersion: 'studio-test/1'
};
const source = generateLeaderboardSource(asset, {
  ...DEFAULT_LEADERBOARD_CONFIGURATION,
  administrator: SIMNET_DEPLOYER,
  minScore: '10',
  maxScore: '1000',
  topN: 5
});
const here = dirname(fileURLToPath(import.meta.url));
await writeFile(
  resolve(here, '../contracts/clarinet/contracts/xtrata-studio-leaderboard-v1.clar'),
  source,
  'utf8'
);
