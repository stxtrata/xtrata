import { describe, expect, it } from 'vitest';
import { bufferCV, someCV } from '@stacks/transactions';
import dropsV11Source from '../../../../contracts/live/xtrata-drops-v1.1.clar?raw';
import {
  DROPS_V11_CONTRACT_NAME,
  DROPS_V11_SOURCE_PATH,
  buildBnsAttestorArg,
  classifyContractInterfaceResponse,
  extractWalletTxId,
  formatDeployLog,
  inspectDropsV11Source,
  normalizeHash160
} from '../drops-v1-1';

const DEPLOYER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';

describe('Drops v1.1 deploy helpers', () => {
  it('pins the deploy-page contract name and immutable live source', () => {
    expect(DROPS_V11_CONTRACT_NAME).toBe('xtrata-drops-v1-1');
    expect(DROPS_V11_SOURCE_PATH).toBe('contracts/live/xtrata-drops-v1.1.clar');
    expect(inspectDropsV11Source(dropsV11Source, DEPLOYER)).toEqual([]);
  });

  it('rejects a source whose primary NFT contract points at another deployer', () => {
    const altered = dropsV11Source.replaceAll(DEPLOYER, 'SP000000000000000000002Q6VF78');
    expect(inspectDropsV11Source(altered, DEPLOYER)).toEqual([
      `PRIMARY-NFT-CONTRACT must be '${DEPLOYER}.xtrata-v3-2-3'`,
      `AllowedNftContracts must initially allow '${DEPLOYER}.xtrata-v3-2-3'`
    ]);
  });

  it('normalizes a hash160 with or without an 0x prefix', () => {
    const raw = 'A1'.repeat(20);
    const normalized = normalizeHash160(`  0x${raw}  `);
    expect(normalized.ok).toBe(true);
    if (!normalized.ok) return;
    expect(normalized.hex).toBe('a1'.repeat(20));
    expect([...normalized.bytes]).toEqual(Array(20).fill(0xa1));
  });

  it('rejects malformed BNS attestor hashes', () => {
    expect(normalizeHash160('abcd')).toEqual({
      ok: false,
      error: 'Enter the attestor public-key hash as exactly 20 bytes (40 hexadecimal characters).'
    });
    expect(normalizeHash160('z1'.repeat(20)).ok).toBe(false);
  });

  it('constructs the optional buff20 argument required by the admin function', () => {
    const hex = '12'.repeat(20);
    expect(buildBnsAttestorArg(hex)).toEqual({
      ok: true,
      hex,
      arg: someCV(bufferCV(Uint8Array.from(Array(20).fill(0x12))))
    });
  });

  it('fails closed when the contract-name lookup is not a success or a 404', () => {
    expect(classifyContractInterfaceResponse(true, 200)).toBe('deployed');
    expect(classifyContractInterfaceResponse(false, 404)).toBe('available');
    expect(classifyContractInterfaceResponse(false, 429)).toBe('unknown');
    expect(classifyContractInterfaceResponse(false, 500)).toBe('unknown');
  });

  it('extracts either wallet transaction-id spelling', () => {
    expect(extractWalletTxId({ txId: '0xabc' })).toBe('0xabc');
    expect(extractWalletTxId({ txid: '0xdef' })).toBe('0xdef');
    expect(extractWalletTxId({})).toBeNull();
  });

  it('formats deployment events as a copyable audit log', () => {
    expect(
      formatDeployLog([
        {
          at: '2026-07-21T12:00:00.000Z',
          action: 'deploy',
          level: 'success',
          message: 'Submitted to mainnet.',
          txId: '0xabc'
        }
      ])
    ).toBe('2026-07-21T12:00:00.000Z | SUCCESS | deploy | Submitted to mainnet. | tx 0xabc');
  });
});
