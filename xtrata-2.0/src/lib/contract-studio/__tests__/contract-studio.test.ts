import { describe, expect, it } from 'vitest';
import { canonicalJson, sha256Hex } from '../canonical';
import { createProjectZip } from '../export';
import {
  generateLeaderboardProject,
  generateLeaderboardSource,
  validateLeaderboardConfiguration
} from '../leaderboard';
import {
  DEFAULT_LEADERBOARD_CONFIGURATION,
  type LeaderboardConfiguration,
  type XtrataAssetRef
} from '../model';
import {
  createSimulation,
  resetSimulatedSeason,
  submitSimulatedScore
} from '../simulation';
import { assertDeploymentNetwork } from '../deployment';

const ADMIN = 'ST000000000000000000002AMW42H';
const asset: XtrataAssetRef = {
  network: 'testnet',
  coreContractId: `${ADMIN}.xtrata-v3-2-3`,
  tokenId: '42',
  contentHash: 'ab'.repeat(32),
  creator: ADMIN,
  owner: ADMIN,
  mimeType: 'text/html',
  totalSize: '1234',
  parents: ['1'],
  dependencies: ['2'],
  protocolVersion: '3.2.3'
};
const configuration: LeaderboardConfiguration = {
  ...DEFAULT_LEADERBOARD_CONFIGURATION,
  administrator: ADMIN
};

describe('Contract Studio generation', () => {
  it('canonicalizes object keys and hashes deterministically', async () => {
    expect(canonicalJson({ z: 1, a: { d: 2, b: 1 } })).toBe(
      '{\n  "a": {\n    "b": 1,\n    "d": 2\n  },\n  "z": 1\n}\n'
    );
    await expect(sha256Hex('xtrata')).resolves.toHaveLength(64);
  });

  it('pins the exact core, token, hash, permissions and bounds in visible source', () => {
    const source = generateLeaderboardSource(asset, configuration);
    expect(source).toContain(`(define-constant XTRATA-CORE '${asset.coreContractId})`);
    expect(source).toContain('(define-constant XTRATA-TOKEN-ID u42)');
    expect(source).toContain(`(define-constant XTRATA-CONTENT-HASH 0x${asset.contentHash})`);
    expect(source).toContain(`(contract-call? '${asset.coreContractId} get-inscription-meta`);
    expect(source).toContain('(get final-hash meta)');
    expect(source).toContain('(define-public (submit-score');
    expect(source).not.toContain('stx-transfer?');
  });

  it('produces byte-identical source and hashes from identical inputs', async () => {
    const left = await generateLeaderboardProject(asset, configuration);
    const right = await generateLeaderboardProject(asset, configuration);
    expect(left.source).toBe(right.source);
    expect(left.sourceHash).toBe(right.sourceHash);
    expect(left.configurationHash).toBe(right.configurationHash);
    expect(left.artifacts.map((entry) => entry.path)).toContain('Clarinet.toml');
  });

  it('rejects invalid configuration rather than inserting it into Clarity', () => {
    expect(() =>
      validateLeaderboardConfiguration({ ...configuration, gameId: 'évil' }, asset)
    ).toThrow(/ASCII/);
    expect(() =>
      validateLeaderboardConfiguration({ ...configuration, minScore: '10', maxScore: '10' }, asset)
    ).toThrow(/greater/);
  });

  it('creates a valid ZIP signature containing all project files', async () => {
    const project = await generateLeaderboardProject(asset, configuration);
    const bytes = new Uint8Array(await createProjectZip(project.artifacts).arrayBuffer());
    expect(Array.from(bytes.slice(0, 4))).toEqual([0x50, 0x4b, 0x03, 0x04]);
    expect(new TextDecoder().decode(bytes)).toContain('xtrata-project.json');
  });
});

describe('Contract Studio simulation and deploy guards', () => {
  it('covers success, duplicate, boundary, permission and reset behavior', () => {
    let state = createSimulation();
    state = submitSimulatedScore(state, configuration, {
      wallet: 'wallet-a',
      alias: 'ACE',
      score: '100'
    });
    expect(state.scores[0].score).toBe(100n);
    expect(() =>
      submitSimulatedScore(state, configuration, {
        wallet: 'wallet-a',
        alias: 'ACE',
        score: '100'
      })
    ).toThrow('ERR-DUPLICATE');
    expect(() =>
      submitSimulatedScore(state, configuration, {
        wallet: 'wallet-b',
        alias: 'BOB',
        score: '1000000001'
      })
    ).toThrow('ERR-INVALID-SCORE');
    expect(() =>
      submitSimulatedScore(state, { ...configuration, submissionPolicy: 'administrator' }, {
        wallet: 'wallet-b',
        alias: 'BOB',
        score: '200'
      })
    ).toThrow('ERR-NOT-AUTHORIZED');
    expect(() => resetSimulatedSeason(state, configuration, false)).toThrow(
      'ERR-NOT-AUTHORIZED'
    );
    expect(resetSimulatedSeason(state, configuration, true).season).toBe(2n);
  });

  it('prevents wallet, asset and deployment network mismatch', () => {
    expect(() =>
      assertDeploymentNetwork({
        assetNetwork: 'testnet',
        walletNetwork: 'mainnet',
        contractName: 'game-scores'
      })
    ).toThrow(/Wallet is on mainnet/);
    expect(() =>
      assertDeploymentNetwork({
        assetNetwork: 'testnet',
        walletNetwork: 'testnet',
        contractName: '.bad'
      })
    ).toThrow(/Contract name/);
  });
});
