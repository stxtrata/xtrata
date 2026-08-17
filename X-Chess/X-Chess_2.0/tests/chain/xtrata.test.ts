// The inscription reader.
//
// `resolveTournament` takes an `Inscribed` by injection so it can be tested
// without a network. This is the implementation that does touch one, so what
// these tests hold is the part a fake cannot: that a partial read is refused
// rather than returned, and that "could not tell" never comes back as a fact.

import { describe, expect, it } from 'vitest';
import { serializeBuffer, serializeSome, serializeUint } from '../../packages/chain/clarity.js';
import { MAX_CHUNKS, XtrataReader } from '../../packages/chain/xtrata.js';
import type { Endpoint } from '../../packages/chain/endpoint.js';

// Fixtures built with the project's OWN serialisers rather than hand-rolled
// bytes. The first version of this file hand-wrote the hex and got it wrong in
// three different ways — the serialisers return an 0x prefix, so concatenating
// them puts one in the middle of the string.
//
// Shapes match what the live contract actually returns, checked against 2993:
// get-inscription-chunks -> (some uint), get-chunk -> (some buff),
// get-dependencies -> (list uint).
const raw = (hex: string): string => hex.replace(/^0x/, '');
const someUint = (n: number): string => serializeSome(serializeUint(n));
const someBuffer = (text: string): string =>
  serializeSome(serializeBuffer(new TextEncoder().encode(text)));
const list = (items: string[]): string => {
  const length = items.length.toString(16).padStart(8, '0');
  return `0x0b${length}${items.map(raw).join('')}`;
};

/** An endpoint that answers from a script and counts what was asked. */
function scripted(answers: Record<string, unknown>, fail = new Set<string>()): {
  endpoint: Endpoint;
  asked: string[];
} {
  const asked: string[] = [];
  const endpoint = {
    base: 'https://example.invalid',
    async request(path: string): Promise<Response> {
      asked.push(path);
      const key = Object.keys(answers).find((k) => path.includes(k));
      if (!key || fail.has(key)) {
        return new Response('no', { status: 500 }) as unknown as Response;
      }
      return new Response(JSON.stringify(answers[key]), { status: 200 }) as unknown as Response;
    }
  } as unknown as Endpoint;
  return { endpoint, asked };
}

describe('reading an inscription', () => {
  it('joins every chunk into one document', async () => {
    const { endpoint } = scripted({
      'get-inscription-chunks': { okay: true, result: someUint(2) },
      'get-chunk': { okay: true, result: someBuffer('half') }
    });
    // Two chunks of the same scripted answer, so the join is what is under test.
    expect(await new XtrataReader({ endpoint }).text(1)).toBe('halfhalf');
  });

  it('REFUSES a document larger than it will read, rather than truncating', async () => {
    // Half a manifest parses as a broken manifest, and would be reported as the
    // entrant's mistake rather than ours.
    const { endpoint, asked } = scripted({
      'get-inscription-chunks': { okay: true, result: someUint(MAX_CHUNKS + 1) },
      'get-chunk': { okay: true, result: someBuffer('x') }
    });
    expect(await new XtrataReader({ endpoint }).text(1)).toBeNull();
    expect(asked.some((p) => p.includes('get-chunk/')), 'it should not start fetching').toBe(false);
  });

  it('returns null when a chunk cannot be read, never a partial', async () => {
    const { endpoint } = scripted(
      {
        'get-inscription-chunks': { okay: true, result: someUint(2) },
        'get-chunk': { okay: true, result: someBuffer('only') }
      },
      new Set(['get-chunk'])
    );
    expect(await new XtrataReader({ endpoint }).text(1)).toBeNull();
  });

  it('reads an inscription once, because an inscription cannot change', async () => {
    const { endpoint, asked } = scripted({
      'get-inscription-chunks': { okay: true, result: someUint(1) },
      'get-chunk': { okay: true, result: someBuffer('sealed') }
    });
    const reader = new XtrataReader({ endpoint });
    await reader.text(7);
    const first = asked.length;
    await reader.text(7);
    expect(asked.length, 'a sealed inscription was fetched twice').toBe(first);
  });
});

describe('when it happened, which Xtrata does not record', () => {
  const MINT = {
    'tokens/nft/history': { results: [{ tx_id: '0xabc' }] },
    'extended/v1/tx/': { tx_status: 'success', block_height: 8_787_817 }
  };

  it('finds the height through the mint event and then the transaction', async () => {
    // Three hops because nothing shorter exists: the event carries the tx id but
    // NOT the height, which is why the second call is not optional.
    const { endpoint } = scripted(MINT);
    expect(await new XtrataReader({ endpoint }).mintedAt(2993)).toBe(8_787_817);
  });

  it('says null when the transaction did not succeed', async () => {
    // A transaction that aborted inscribed nothing, whatever height it landed at.
    const { endpoint } = scripted({
      ...MINT,
      'extended/v1/tx/': { tx_status: 'abort_by_response', block_height: 8_787_817 }
    });
    expect(await new XtrataReader({ endpoint }).mintedAt(2993)).toBeNull();
  });

  it('says null when there is no mint event at all', async () => {
    const { endpoint } = scripted({ ...MINT, 'tokens/nft/history': { results: [] } });
    expect(await new XtrataReader({ endpoint }).mintedAt(2993)).toBeNull();
  });

  it('asks for the token id as ONE hex value, not two prefixes', async () => {
    // The bug this test is named after: `serializeUint` already carries the 0x,
    // and prepending another sent `value=0x0x0100…`. The API answered that with
    // an empty result set rather than an error, so it read as "no mint event"
    // and reported null for an inscription whose height is 8,787,817.
    //
    // Every fake in this file matches on the path and ignores the query, which
    // is exactly why they all passed while it was broken.
    const { endpoint, asked } = scripted(MINT);
    await new XtrataReader({ endpoint }).mintedAt(2993);
    const history = asked.find((p) => p.includes('tokens/nft/history')) ?? '';
    expect(history, 'a doubled 0x prefix').not.toContain('0x0x');
    expect(history).toContain(`value=${serializeUint(2993)}`);
  });

  it('says null rather than guessing when the lookup fails', async () => {
    // Null means "could not tell" and provenance() reports it as unchecked. A
    // guess here would present a retrospective claim as a commitment.
    const { endpoint } = scripted(MINT, new Set(['tokens/nft/history']));
    expect(await new XtrataReader({ endpoint }).mintedAt(2993)).toBeNull();
  });
});

describe('what it declares', () => {
  it('reads dependencies as numbers', async () => {
    const { endpoint } = scripted({
      'get-dependencies': { okay: true, result: list([serializeUint(2991), serializeUint(2992)]) }
    });
    expect(await new XtrataReader({ endpoint }).dependencies(2993)).toEqual([2991, 2992]);
  });

  it('gives an empty list rather than null when there are none', async () => {
    // A caller walking a revision chain must not have to tell "no ancestors"
    // apart from "could not ask".
    const { endpoint } = scripted({ 'get-dependencies': { okay: true, result: list([]) } });
    expect(await new XtrataReader({ endpoint }).dependencies(1)).toEqual([]);
  });
});
