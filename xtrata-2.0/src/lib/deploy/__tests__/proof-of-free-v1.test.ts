import { describe, expect, it } from 'vitest';
import { Cl, cvToHex, cvToJSON, hexToCV } from '@stacks/transactions';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import dropsV11Source from '../../../../contracts/live/xtrata-drops-v1.1.clar?raw';
import {
  PROOF_OF_FREE_COLLECTION_SIZE,
  PROOF_OF_FREE_CONTRACT_NAME,
  PROOF_OF_FREE_ENGINE_CANDIDATE_SHA256,
  generateProofOfFreeContract,
  inspectProofOfFreeSource,
  normalizeProofOfFreeEngine,
  parseProofOfFreeCampaign,
  parseProofOfFreeConfig
} from '../proof-of-free-v1';

const DEPLOYER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';

describe('Proof of Free v1 deploy helpers', () => {
  it('normalizes only a confirmed positive engine ID and 32-byte hash', () => {
    expect(normalizeProofOfFreeEngine('12345', `0x${'AB'.repeat(32)}`)).toEqual({
      ok: true,
      engineId: 12345,
      engineSha256: 'ab'.repeat(32)
    });
    expect(normalizeProofOfFreeEngine('0', 'ab'.repeat(32)).ok).toBe(false);
    expect(normalizeProofOfFreeEngine('1.5', 'ab'.repeat(32)).ok).toBe(false);
    expect(normalizeProofOfFreeEngine('1', 'abcd').ok).toBe(false);
  });

  it('generates the immutable dedicated controller from Drops v1.1', () => {
    const source = generateProofOfFreeContract(dropsV11Source, 12345, 'ab'.repeat(32));
    expect(PROOF_OF_FREE_CONTRACT_NAME).toBe('proof-of-free-v1');
    expect(PROOF_OF_FREE_COLLECTION_SIZE).toBe(1024);
    expect(PROOF_OF_FREE_ENGINE_CANDIDATE_SHA256).toBe(
      '9434263320d2b013d7a6513210480c4cd881d4546072ae3efa0867caa1626768'
    );
    expect(inspectProofOfFreeSource(source, DEPLOYER, 12345, 'ab'.repeat(32))).toEqual([]);
    expect(source).toContain('active: false');
    expect(source).toContain('Opening is impossible until all 1,024 NFTs are escrowed.');
    expect(source).toContain('(asserts! false ERR-CAMPAIGN-CLAIM-REQUIRED)');
  });

  it('fails inspection when the engine binding is changed', () => {
    const source = generateProofOfFreeContract(dropsV11Source, 12345, 'ab'.repeat(32))
      .replace('(define-constant POF-ENGINE-ID u12345)', '(define-constant POF-ENGINE-ID u999)');
    expect(inspectProofOfFreeSource(source, DEPLOYER, 12345, 'ab'.repeat(32))).not.toEqual([]);
  });

  it('matches the command-line release contract generator byte-for-byte', () => {
    const output = join(mkdtempSync(join(tmpdir(), 'pof-console-parity-')), 'proof-of-free-v1.clar');
    execFileSync(process.execPath, [
      '../Proof-of-Free/Living-Synth-v3/scripts/build-contract.mjs',
      '--engine-id', '12345',
      '--engine-sha256', 'ab'.repeat(32),
      '--output', output
    ], { cwd: process.cwd(), stdio: 'pipe' });
    expect(generateProofOfFreeContract(dropsV11Source, 12345, 'ab'.repeat(32))).toBe(
      readFileSync(output, 'utf8')
    );
  });

  it('parses the immutable on-chain collection configuration', () => {
    const decoded = cvToJSON(hexToCV(cvToHex(Cl.ok(Cl.tuple({
      protocol: Cl.stringAscii('proof-of-free/v3'),
      'engine-id': Cl.uint(12345),
      'engine-sha256': Cl.buffer(Uint8Array.from({ length: 32 }, () => 0xab)),
      'campaign-id': Cl.uint(0),
      'max-supply': Cl.uint(1024),
      'one-per-wallet': Cl.bool(true),
      'require-bns': Cl.bool(true),
      'one-per-bns': Cl.bool(true)
    })))));
    expect(parseProofOfFreeConfig(decoded)).toEqual({
      engineId: 12345n,
      engineSha256: 'ab'.repeat(32),
      campaignId: 0n,
      maxSupply: 1024n,
      onePerWallet: true,
      requireBns: true,
      onePerBns: true
    });
  });

  it('parses the closed campaign-zero state', () => {
    const decoded = cvToJSON(hexToCV(cvToHex(Cl.some(Cl.tuple({
      creator: Cl.principal(DEPLOYER),
      'engine-id': Cl.uint(12345),
      'max-supply': Cl.uint(1024),
      'drops-created': Cl.uint(0),
      'one-per-wallet': Cl.bool(true),
      'require-bns': Cl.bool(true),
      'one-per-bns': Cl.bool(true),
      active: Cl.bool(false),
      'created-at': Cl.uint(1)
    })))));
    expect(parseProofOfFreeCampaign(decoded)).toEqual({
      engineId: 12345n,
      maxSupply: 1024n,
      dropsCreated: 0n,
      onePerWallet: true,
      requireBns: true,
      onePerBns: true,
      active: false
    });
  });
});
