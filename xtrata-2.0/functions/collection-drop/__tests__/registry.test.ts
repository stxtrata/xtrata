import { afterEach, describe, expect, it, vi } from 'vitest';
import { Cl, cvToHex } from '@stacks/transactions';
import { buildCampaignRegistry, onRequestGet } from '../registry';

const logEvent = (value: ReturnType<typeof Cl.tuple>, txId = '0xclaim') => ({
  tx_id: txId,
  event_type: 'smart_contract_log',
  contract_log: { topic: 'print', value: { hex: cvToHex(value) } }
});

describe('GET /collection-drop/registry', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('maps zero-based Drops editions to claimed master cells', () => {
    const registry = buildCampaignRegistry(
      [
        logEvent(
          Cl.tuple({
            event: Cl.stringAscii('create-campaign'),
            'campaign-id': Cl.uint(0),
            'engine-id': Cl.uint(42),
            'max-supply': Cl.uint(1024),
            'one-per-wallet': Cl.bool(true),
            'require-bns': Cl.bool(true),
            'one-per-bns': Cl.bool(true)
          }),
          '0xcreate'
        ),
        logEvent(
          Cl.tuple({
            event: Cl.stringAscii('create-campaign-drop'),
            'campaign-id': Cl.uint(0),
            edition: Cl.uint(0)
          }),
          '0xdrop'
        ),
        logEvent(
          Cl.tuple({
            event: Cl.stringAscii('claim-campaign'),
            'campaign-id': Cl.uint(0),
            edition: Cl.some(Cl.uint(0)),
            claimer: Cl.principal('SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X'),
            'token-id': Cl.uint(2743)
          })
        )
      ],
      0
    );

    expect(registry).toMatchObject({
      campaignId: 0,
      maxSupply: 1024,
      engineId: 42,
      active: true,
      policy: { onePerWallet: true, requireBns: true, onePerBns: true },
      dropsCreated: 1,
      claimedCount: 1
    });
    expect(registry.items).toEqual([
      {
        edition: 1,
        claimed: true,
        tokenId: 2743,
        inscription: '2743',
        contentUrl: 'https://xtrata.xyz/inscription/2743',
        owner: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
        tx: '0xclaim'
      }
    ]);
  });

  it('keeps the dedicated Proof of Free contract editions one-based', () => {
    const contractId =
      'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.proof-of-free-v1';
    const registry = buildCampaignRegistry(
      [
        logEvent(Cl.tuple({
          event: Cl.stringAscii('create-campaign'),
          'campaign-id': Cl.uint(0),
          'engine-id': Cl.uint(777),
          'max-supply': Cl.uint(1024),
          'one-per-wallet': Cl.bool(true),
          'require-bns': Cl.bool(true),
          'one-per-bns': Cl.bool(true),
          active: Cl.bool(false)
        })),
        logEvent(Cl.tuple({
          event: Cl.stringAscii('claim-campaign'),
          'campaign-id': Cl.uint(0),
          edition: Cl.some(Cl.uint(1)),
          claimer: Cl.principal('SP000000000000000000002Q6VF78'),
          'token-id': Cl.uint(9001)
        }))
      ],
      0,
      contractId,
      'ab'.repeat(32)
    );
    expect(registry).toMatchObject({
      protocol: 'proof-of-free/claimed-registry',
      contractId,
      engineId: 777,
      engineSha256: 'ab'.repeat(32),
      active: false,
      claims: [{ edition: 1, tokenId: 9001 }]
    });
  });

  it('serves the CORS registry and rejects invalid campaign ids', async () => {
    vi.stubGlobal('caches', {
      default: {
        match: vi.fn().mockResolvedValue(undefined),
        put: vi.fn().mockResolvedValue(undefined)
      }
    });
    const finalEdition = logEvent(
      Cl.tuple({
        event: Cl.stringAscii('claim-campaign'),
        'campaign-id': Cl.uint(0),
        edition: Cl.some(Cl.uint(1023)),
        claimer: Cl.principal('SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X'),
        'token-id': Cl.uint(9001)
      })
    );
    const firstEdition = logEvent(
      Cl.tuple({
        event: Cl.stringAscii('claim-campaign'),
        'campaign-id': Cl.uint(0),
        edition: Cl.some(Cl.uint(0)),
        claimer: Cl.principal('SP000000000000000000002Q6VF78'),
        'token-id': Cl.uint(2743)
      })
    );
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
      const offset = Number(new URL(String(input)).searchParams.get('offset'));
      if (offset === 0) return Response.json({ results: Array(50).fill(finalEdition) });
      if (offset === 50) return Response.json({ results: [firstEdition] });
      return Response.json({ results: [] });
    }));

    const waitUntil = vi.fn();
    const response = await onRequestGet({
      request: new Request('https://x/collection-drop/registry?campaign=0'),
      env: {},
      waitUntil
    } as never);
    expect(response.status).toBe(200);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(await response.json()).toMatchObject({
      campaignId: 0,
      claimedCount: 2,
      items: [
        { edition: 1, inscription: '2743' },
        { edition: 1024, inscription: '9001' }
      ]
    });
    expect(waitUntil).toHaveBeenCalledTimes(1);

    const invalid = await onRequestGet({
      request: new Request('https://x/collection-drop/registry?campaign=wrong'),
      env: {},
      waitUntil
    } as never);
    expect(invalid.status).toBe(400);
  });

  it('reads the dedicated controller fingerprint and live policy on-chain', async () => {
    vi.stubGlobal('caches', {
      default: {
        match: vi.fn().mockResolvedValue(undefined),
        put: vi.fn().mockResolvedValue(undefined)
      }
    });
    const contractId =
      'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.proof-of-free-v1';
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith('/get-collection-config')) {
        return Response.json({
          okay: true,
          result: cvToHex(Cl.ok(Cl.tuple({
            protocol: Cl.stringAscii('proof-of-free/v3'),
            'engine-id': Cl.uint(777),
            'engine-sha256': Cl.buffer(Uint8Array.from({ length: 32 }, () => 0xab)),
            'campaign-id': Cl.uint(0),
            'max-supply': Cl.uint(1024),
            'one-per-wallet': Cl.bool(true),
            'require-bns': Cl.bool(true),
            'one-per-bns': Cl.bool(true)
          })))
        });
      }
      if (url.endsWith('/get-campaign')) {
        return Response.json({
          okay: true,
          result: cvToHex(Cl.some(Cl.tuple({
            creator: Cl.principal('SP000000000000000000002Q6VF78'),
            'engine-id': Cl.uint(777),
            'max-supply': Cl.uint(1024),
            'drops-created': Cl.uint(1024),
            'one-per-wallet': Cl.bool(true),
            'require-bns': Cl.bool(true),
            'one-per-bns': Cl.bool(true),
            active: Cl.bool(false),
            'created-at': Cl.uint(1)
          })))
        });
      }
      return Response.json({
        total: 1,
        results: [
          logEvent(Cl.tuple({
            event: Cl.stringAscii('claim-campaign'),
            'campaign-id': Cl.uint(0),
            edition: Cl.some(Cl.uint(1)),
            claimer: Cl.principal('SP000000000000000000002Q6VF78'),
            'token-id': Cl.uint(9001)
          }))
        ]
      });
    }));

    const response = await onRequestGet({
      request: new Request(
        `https://x/collection-drop/registry?contract=${encodeURIComponent(contractId)}&campaign=0`
      ),
      env: { POF_CONTRACT_ID: contractId },
      waitUntil: vi.fn()
    } as never);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      contractId,
      engineId: 777,
      engineSha256: 'ab'.repeat(32),
      maxSupply: 1024,
      dropsCreated: 1024,
      active: false,
      policy: { onePerWallet: true, requireBns: true, onePerBns: true },
      claims: [{ edition: 1, tokenId: 9001 }]
    });
  });
});
