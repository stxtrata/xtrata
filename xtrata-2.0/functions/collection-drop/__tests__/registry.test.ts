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
            'max-supply': Cl.uint(1024)
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
      dropsCreated: 1,
      claimedCount: 1
    });
    expect(registry.items).toEqual([
      {
        edition: 1,
        claimed: true,
        inscription: '2743',
        contentUrl: 'https://xtrata.xyz/inscription/2743',
        owner: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
        tx: '0xclaim'
      }
    ]);
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
});
