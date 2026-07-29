import {
  boolCV,
  bufferCV,
  listCV,
  noneCV,
  principalCV,
  responseOkCV,
  serializeCV,
  someCV,
  stringAsciiCV,
  tupleCV,
  uintCV
} from '@stacks/transactions';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  MAX_READ_BATCH_SIZE,
  chunkBytes,
  computeExpectedHash
} from '../../../packages/xtrata-reconstruction/src/index';
import { onRequest } from '../content';
import type { RuntimeEnv } from '../lib';

const CONTRACT_ADDRESS = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const CONTRACT_NAME = 'xtrata-v2-1-0';
const CONTRACT_ID = `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`;
const FINAL_HASH = new Uint8Array([0xab, 0xcd]);

const cvHex = (value: Parameters<typeof serializeCV>[0]) =>
  `0x${Array.from(serializeCV(value))
    .map((entry) => entry.toString(16).padStart(2, '0'))
    .join('')}`;

const streamFrom = (bytes: Uint8Array) =>
  new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(bytes);
      controller.close();
    }
  });

const finalHashForBytes = (bytes: Uint8Array) => computeExpectedHash(chunkBytes(bytes));

const metaResult = (params?: {
  mimeType?: string;
  totalSize?: bigint;
  totalChunks?: bigint;
  finalHash?: Uint8Array;
}) =>
  cvHex(
    someCV(
      tupleCV({
        owner: principalCV(CONTRACT_ADDRESS),
        'mime-type': stringAsciiCV(params?.mimeType ?? 'image/gif'),
        'total-size': uintCV(params?.totalSize ?? 2n),
        'total-chunks': uintCV(params?.totalChunks ?? 1n),
        sealed: boolCV(true),
        'final-hash': bufferCV(params?.finalHash ?? FINAL_HASH)
      })
    )
  );

describe('/runtime/content', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('serves cached sealed bytes with the original MIME type', async () => {
    const get = vi.fn(async () => ({
      body: streamFrom(new Uint8Array([9, 8])),
      size: 2,
      httpMetadata: {
        contentType: 'image/gif'
      },
      customMetadata: {
        sourceContractId: CONTRACT_ID
      }
    }));
    const fetch = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            okay: true,
            result: metaResult()
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
    );
    vi.stubGlobal('fetch', fetch);
    const env = {
      RUNTIME_CONTENT_CACHE: {
        get,
        put: vi.fn(),
        delete: vi.fn(),
        list: vi.fn(),
        getUploadUrl: vi.fn()
      }
    } as unknown as RuntimeEnv;

    const response = await onRequest({
      request: new Request(
        `https://xtrata.xyz/runtime/content?contractId=${CONTRACT_ID}&tokenId=294&network=mainnet`
      ),
      env
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('image/gif');
    expect(response.headers.get('X-Xtrata-Runtime-Cache')).toBe('HIT');
    expect(response.headers.get('X-Xtrata-Runtime-Final-Hash')).toBe('abcd');
    expect(get).toHaveBeenCalledWith(`runtime-content/mainnet/${CONTRACT_ID}/294/abcd`);
    expect(Array.from(new Uint8Array(await response.arrayBuffer()))).toEqual([9, 8]);
  });

  it('rewrites direct Hiro API bases to the site proxy for cached HTML', async () => {
    const html =
      '<html><script>fetch("https://api.mainnet.hiro.so/v2/contracts/call-read/SP1/board/get-owner")</script></html>';
    const htmlBytes = new TextEncoder().encode(html);
    const get = vi.fn(async () => ({
      body: streamFrom(htmlBytes),
      size: htmlBytes.length,
      httpMetadata: {
        contentType: 'text/html'
      },
      customMetadata: {
        sourceContractId: CONTRACT_ID
      }
    }));
    const fetch = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            okay: true,
            result: metaResult({
              mimeType: 'text/html',
              totalSize: BigInt(htmlBytes.length)
            })
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
    );
    vi.stubGlobal('fetch', fetch);
    const env = {
      RUNTIME_CONTENT_CACHE: {
        get,
        put: vi.fn(),
        delete: vi.fn(),
        list: vi.fn(),
        getUploadUrl: vi.fn()
      }
    } as unknown as RuntimeEnv;

    const response = await onRequest({
      request: new Request(
        `https://xtrata.xyz/runtime/content?contractId=${CONTRACT_ID}&tokenId=350&network=mainnet`
      ),
      env
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('X-Xtrata-Runtime-Api-Rewrite')).toBe('hiro-proxy');
    const body = await response.text();
    expect(body).toContain('https://xtrata.xyz/hiro/mainnet/v2/contracts/call-read/SP1/board/get-owner');
    expect(body).not.toContain('api.mainnet.hiro.so');
    expect(response.headers.get('Content-Length')).toBe(
      new TextEncoder().encode(body).length.toString()
    );
  });

  it('serves canonical HTML bytes when raw=1 is requested', async () => {
    const html =
      '<html><script>fetch("https://api.mainnet.hiro.so/v2/info")</script></html>';
    const htmlBytes = new TextEncoder().encode(html);
    const get = vi.fn(async () => ({
      body: streamFrom(htmlBytes),
      size: htmlBytes.length,
      httpMetadata: {
        contentType: 'text/html'
      },
      customMetadata: {
        sourceContractId: CONTRACT_ID
      }
    }));
    const fetch = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            okay: true,
            result: metaResult({
              mimeType: 'text/html',
              totalSize: BigInt(htmlBytes.length)
            })
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
    );
    vi.stubGlobal('fetch', fetch);
    const env = {
      RUNTIME_CONTENT_CACHE: {
        get,
        put: vi.fn(),
        delete: vi.fn(),
        list: vi.fn(),
        getUploadUrl: vi.fn()
      }
    } as unknown as RuntimeEnv;

    const response = await onRequest({
      request: new Request(
        `https://xtrata.xyz/runtime/content?contractId=${CONTRACT_ID}&tokenId=350&network=mainnet&raw=1`
      ),
      env
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('X-Xtrata-Runtime-Api-Rewrite')).toBeNull();
    expect(await response.text()).toBe(html);
  });

  it('injects module base hrefs into cached HTML module shells', async () => {
    const html =
      '<html><head><title>JMS10</title></head><body><script type="module">import("../../../System/shared/patch_runtime.js")</script></body></html>';
    const htmlBytes = new TextEncoder().encode(html);
    const moduleBaseHref =
      '/runtime/modules/mainnet/SP123/test-contract/237/on-chain-modules/workspace/Plugins/Instruments/JMS10/';
    const get = vi.fn(async () => ({
      body: streamFrom(htmlBytes),
      size: htmlBytes.length,
      httpMetadata: {
        contentType: 'text/html'
      },
      customMetadata: {
        sourceContractId: CONTRACT_ID,
        moduleBaseHref
      }
    }));
    const fetch = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            okay: true,
            result: metaResult({
              mimeType: 'text/html',
              totalSize: BigInt(htmlBytes.length)
            })
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
    );
    vi.stubGlobal('fetch', fetch);

    const response = await onRequest({
      request: new Request(
        `https://xtrata.xyz/runtime/content?contractId=${CONTRACT_ID}&tokenId=237&network=mainnet`
      ),
      env: {
        RUNTIME_CONTENT_CACHE: {
          get,
          put: vi.fn(),
          delete: vi.fn(),
          list: vi.fn(),
          getUploadUrl: vi.fn()
        }
      } as unknown as RuntimeEnv
    });

    const body = await response.text();
    expect(response.status).toBe(200);
    expect(response.headers.get('X-Xtrata-Runtime-Module-Base-Injected')).toBe('true');
    expect(body).toContain(`<base href="${moduleBaseHref}">`);
    expect(body).toContain('import("../../../System/shared/patch_runtime.js")');
    expect(response.headers.get('Content-Length')).toBe(
      new TextEncoder().encode(body).length.toString()
    );
  });

  it('serves cached byte ranges for media playback', async () => {
    const get = vi.fn(
      async (_key: string, options?: { range?: { offset: number; length: number } }) => {
        const bytes = new Uint8Array([9, 8, 7, 6]);
        const range = options?.range;
        return {
          body: streamFrom(range ? bytes.slice(range.offset, range.offset + range.length) : bytes),
          size: bytes.length,
          httpMetadata: {
            contentType: 'audio/webm'
          },
          customMetadata: {
            sourceContractId: CONTRACT_ID
          }
        };
      }
    );
    const fetch = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            okay: true,
            result: metaResult({
              mimeType: 'audio/webm',
              totalSize: 4n
            })
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
    );
    vi.stubGlobal('fetch', fetch);
    const env = {
      RUNTIME_CONTENT_CACHE: {
        get,
        put: vi.fn(),
        delete: vi.fn(),
        list: vi.fn(),
        getUploadUrl: vi.fn()
      }
    } as unknown as RuntimeEnv;

    const response = await onRequest({
      request: new Request(
        `https://xtrata.xyz/runtime/content?contractId=${CONTRACT_ID}&tokenId=294&network=mainnet`,
        {
          headers: {
            Range: 'bytes=1-2'
          }
        }
      ),
      env
    });

    expect(response.status).toBe(206);
    expect(response.headers.get('Content-Type')).toBe('audio/webm');
    expect(response.headers.get('Accept-Ranges')).toBe('bytes');
    expect(response.headers.get('Content-Range')).toBe('bytes 1-2/4');
    expect(response.headers.get('Content-Length')).toBe('2');
    expect(response.headers.get('X-Xtrata-Runtime-Response-Mode')).toBe('range');
    expect(get).toHaveBeenCalledWith(`runtime-content/mainnet/${CONTRACT_ID}/294/abcd`, {
      range: {
        offset: 1,
        length: 2
      }
    });
    expect(Array.from(new Uint8Array(await response.arrayBuffer()))).toEqual([8, 7]);
  });

  it('returns 416 for unsatisfiable byte ranges without reconstructing content', async () => {
    const get = vi.fn();
    const fetch = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            okay: true,
            result: metaResult()
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
    );
    vi.stubGlobal('fetch', fetch);

    const response = await onRequest({
      request: new Request(
        `https://xtrata.xyz/runtime/content?contractId=${CONTRACT_ID}&tokenId=294&network=mainnet`,
        {
          headers: {
            Range: 'bytes=20-30'
          }
        }
      ),
      env: {
        RUNTIME_CONTENT_CACHE: {
          get,
          put: vi.fn(),
          delete: vi.fn(),
          list: vi.fn(),
          getUploadUrl: vi.fn()
        }
      } as unknown as RuntimeEnv
    });

    expect(response.status).toBe(416);
    expect(response.headers.get('Accept-Ranges')).toBe('bytes');
    expect(response.headers.get('Content-Range')).toBe('bytes */2');
    expect(response.headers.get('Content-Length')).toBe('0');
    expect(get).not.toHaveBeenCalled();
  });

  it('returns metadata-only diagnostics for HEAD requests', async () => {
    const fetch = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            okay: true,
            result: metaResult({
              totalSize: 3n,
              totalChunks: 3n
            })
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
    );
    vi.stubGlobal('fetch', fetch);

    const response = await onRequest({
      request: new Request(
        `https://xtrata.xyz/runtime/content?contractId=${CONTRACT_ID}&tokenId=294&network=mainnet`,
        {
          method: 'HEAD'
        }
      ),
      env: {}
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('image/gif');
    expect(response.headers.get('Content-Length')).toBe('3');
    expect(response.headers.get('Accept-Ranges')).toBe('bytes');
    expect(response.headers.get('X-Xtrata-Runtime-Build')).toBe('stream-v1');
    expect(response.headers.get('X-Xtrata-Runtime-Response-Mode')).toBe('head');
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('streams reconstructed bytes on cache misses', async () => {
    const finalHash = finalHashForBytes(new Uint8Array([1, 2, 3]));
    const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const fetch = vi.fn(async (input: RequestInfo | URL) => {
      const endpoint = String(input);
      let result: string;
      if (endpoint.endsWith('/get-inscription-meta')) {
        result = metaResult({
          totalSize: 3n,
          totalChunks: 3n,
          finalHash
        });
      } else if (endpoint.endsWith('/get-chunk')) {
        result = cvHex(someCV(bufferCV(new Uint8Array([1]))));
      } else if (endpoint.endsWith('/get-chunk-batch')) {
        result = cvHex(
          listCV([someCV(bufferCV(new Uint8Array([2]))), someCV(bufferCV(new Uint8Array([3])))])
        );
      } else if (endpoint.endsWith('/get-token-uri')) {
        result = cvHex(responseOkCV(someCV(stringAsciiCV('signal.gif'))));
      } else {
        throw new Error(`Unexpected endpoint ${endpoint}`);
      }
      return new Response(
        JSON.stringify({
          okay: true,
          result
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    });
    vi.stubGlobal('fetch', fetch);

    const response = await onRequest({
      request: new Request(
        `https://xtrata.xyz/runtime/content?contractId=${CONTRACT_ID}&tokenId=294&network=mainnet`
      ),
      env: {
        RUNTIME_CONTENT_DEBUG: '1',
        RUNTIME_CONTENT_READ_RETRIES: '0'
      }
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('X-Xtrata-Runtime-Response-Mode')).toBe('stream');
    expect(response.headers.get('X-Xtrata-Runtime-Cache')).toBe('BYPASS');
    expect(response.headers.get('X-Xtrata-Runtime-Reconstruction-Read-Mode')).toBe('mixed');
    expect(response.headers.get('X-Xtrata-Runtime-Reconstruction-Fallback')).toBe('false');
    expect(response.headers.get('X-Xtrata-Runtime-Read-Batch-Size')).toBe(
      String(MAX_READ_BATCH_SIZE)
    );
    expect(response.headers.get('X-Xtrata-Runtime-Upstream-Requests')).toBe('4');
    expect(response.headers.get('Content-Length')).toBe('3');
    expect(Array.from(new Uint8Array(await response.arrayBuffer()))).toEqual([1, 2, 3]);
    expect(consoleLog).toHaveBeenCalledWith(
      '[runtime/content] reconstructed-stream',
      expect.objectContaining({
        tokenId: '294',
        sourceContractId: CONTRACT_ID,
        diagnostics: expect.objectContaining({
          readMode: 'mixed',
          batchReads: 1,
          singleReads: 1
        })
      })
    );
  });

  it('returns a clear terminal response without amplifying Cloudflare subrequest exhaustion', async () => {
    const finalHash = finalHashForBytes(new Uint8Array([1, 2, 3]));
    const fetch = vi.fn(async (input: RequestInfo | URL) => {
      const endpoint = String(input);
      let result: string;
      if (endpoint.endsWith('/get-inscription-meta')) {
        result = metaResult({
          totalSize: 3n,
          totalChunks: 3n,
          finalHash
        });
      } else if (endpoint.endsWith('/get-chunk')) {
        result = cvHex(someCV(bufferCV(new Uint8Array([1]))));
      } else if (endpoint.endsWith('/get-chunk-batch')) {
        throw new Error('Too many subrequests by single Worker invocation.');
      } else {
        throw new Error(`Unexpected endpoint ${endpoint}`);
      }
      return new Response(
        JSON.stringify({
          okay: true,
          result
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    });
    vi.stubGlobal('fetch', fetch);

    const response = await onRequest({
      request: new Request(
        `https://xtrata.xyz/runtime/content?contractId=${CONTRACT_ID}&tokenId=294&network=mainnet`
      ),
      env: {
        RUNTIME_CONTENT_READ_RETRIES: '2'
      }
    });
    const body = (await response.json()) as {
      error: string;
      diagnostics: {
        upstreamRequests: number;
        batchFallbacks: number;
        singleReads: number;
        errors: Array<{ operation: string }>;
      };
    };

    expect(response.status).toBe(503);
    expect(response.headers.get('X-Xtrata-Runtime-Upstream-Requests')).toBe('3');
    expect(body.error).toBe('Runtime upstream request limit exhausted.');
    expect(body.diagnostics.upstreamRequests).toBe(3);
    expect(body.diagnostics.batchFallbacks).toBe(0);
    expect(body.diagnostics.singleReads).toBe(1);
    expect(body.diagnostics.errors).toEqual([
      expect.objectContaining({
        operation: 'chunk-batch'
      })
    ]);
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it('serves byte ranges after reconstructing uncached content', async () => {
    const finalHash = finalHashForBytes(new Uint8Array([1, 2, 3]));
    const fetch = vi.fn(async (input: RequestInfo | URL) => {
      const endpoint = String(input);
      let result: string;
      if (endpoint.endsWith('/get-inscription-meta')) {
        result = metaResult({
          totalSize: 3n,
          totalChunks: 3n,
          finalHash
        });
      } else if (endpoint.endsWith('/get-chunk')) {
        result = cvHex(someCV(bufferCV(new Uint8Array([1]))));
      } else if (endpoint.endsWith('/get-chunk-batch')) {
        result = cvHex(
          listCV([someCV(bufferCV(new Uint8Array([2]))), someCV(bufferCV(new Uint8Array([3])))])
        );
      } else if (endpoint.endsWith('/get-token-uri')) {
        result = cvHex(responseOkCV(someCV(stringAsciiCV('signal.gif'))));
      } else {
        throw new Error(`Unexpected endpoint ${endpoint}`);
      }
      return new Response(
        JSON.stringify({
          okay: true,
          result
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    });
    vi.stubGlobal('fetch', fetch);

    const response = await onRequest({
      request: new Request(
        `https://xtrata.xyz/runtime/content?contractId=${CONTRACT_ID}&tokenId=294&network=mainnet`,
        {
          headers: {
            Range: 'bytes=1-2'
          }
        }
      ),
      env: {
        RUNTIME_CONTENT_READ_RETRIES: '0'
      }
    });

    expect(response.status).toBe(206);
    expect(response.headers.get('Content-Range')).toBe('bytes 1-2/3');
    expect(response.headers.get('Content-Length')).toBe('2');
    expect(response.headers.get('X-Xtrata-Runtime-Response-Mode')).toBe('range');
    expect(response.headers.get('X-Xtrata-Runtime-Reconstruction-Batch-Reads')).toBe('1');
    expect(Array.from(new Uint8Array(await response.arrayBuffer()))).toEqual([2, 3]);
  });

  // A token that has migrated keeps its id but leaves its bytes on the core it
  // was written to, so "the newest core says no" is routine, not an error. This
  // used to surface as a 502 — which Cloudflare replaces with its own bare
  // error page, so the caller learnt nothing at all.
  it('answers 404, naming the contracts searched, when no core holds the token', async () => {
    const fetch = vi.fn(async (input: RequestInfo | URL) => {
      const endpoint = String(input);
      if (!endpoint.endsWith('/get-inscription-meta')) {
        throw new Error(`Unexpected endpoint ${endpoint}`);
      }
      return new Response(
        JSON.stringify({ okay: true, result: cvHex(noneCV()) }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    });
    vi.stubGlobal('fetch', fetch);

    const fallbackContractId = `${CONTRACT_ADDRESS}.xtrata-v1-1-1`;
    const response = await onRequest({
      request: new Request(
        `https://xtrata.xyz/runtime/content?contractId=${CONTRACT_ID}&fallbackContractId=${fallbackContractId}&tokenId=8&network=mainnet`
      ),
      env: {}
    });

    expect(response.status).toBe(404);
    const body = (await response.json()) as { error: string; detail: string };
    expect(body.error).toBe('Inscription not found on this contract lineage.');
    // The detail is the actionable part: which lineage was actually searched.
    expect(body.detail).toContain('#8');
    expect(body.detail).toContain(CONTRACT_ID);
    expect(body.detail).toContain(fallbackContractId);
  });

  // The cache is keyed by content hash, so we used to read the chain on EVERY
  // request — cache hits included — purely to learn the hash. Measured against
  // production that was ~600ms and up to five upstream calls before a single
  // cached byte moved. For a sealed inscription the index already knows it.
  describe('index fast path', () => {
    const FINAL_HASH_HEX = 'ab'.repeat(32);
    const indexedDb = (row: Record<string, unknown> | null) => ({
      prepare: () => ({
        bind: () => ({
          all: async () => ({ results: row ? [row] : [] })
        }),
        all: async () => ({ results: row ? [row] : [] })
      })
    });
    const indexRow = (overrides: Record<string, unknown> = {}) => ({
      contract: CONTRACT_ID,
      mime: 'image/gif',
      total_size: 2,
      total_chunks: 1,
      final_hash: `0x${FINAL_HASH_HEX}`,
      token_uri: 'xtrata:test',
      ...overrides
    });
    const cacheBucket = (get: ReturnType<typeof vi.fn>) => ({
      get,
      put: vi.fn(),
      delete: vi.fn(),
      list: vi.fn(),
      getUploadUrl: vi.fn()
    });

    it('serves a cache hit without touching the chain at all', async () => {
      const get = vi.fn(async () => ({
        body: streamFrom(new Uint8Array([9, 8])),
        size: 2,
        httpMetadata: { contentType: 'image/gif' },
        customMetadata: { sourceContractId: CONTRACT_ID }
      }));
      const fetch = vi.fn();
      vi.stubGlobal('fetch', fetch);

      const response = await onRequest({
        request: new Request(
          `https://xtrata.xyz/runtime/content?contractId=${CONTRACT_ID}&tokenId=294&network=mainnet`
        ),
        env: {
          DB: indexedDb(indexRow()),
          RUNTIME_CONTENT_CACHE: cacheBucket(get)
        } as unknown as RuntimeEnv
      });

      expect(response.status).toBe(200);
      expect(response.headers.get('X-Xtrata-Runtime-Cache')).toBe('HIT');
      expect(response.headers.get('Content-Type')).toBe('image/gif');
      expect(response.headers.get('X-Xtrata-Runtime-Final-Hash')).toBe(FINAL_HASH_HEX);
      // The whole point: no upstream calls were needed to serve this.
      expect(fetch).not.toHaveBeenCalled();
      expect(response.headers.get('X-Xtrata-Runtime-Upstream-Requests')).toBe('0');
      // And the key it looked under is the indexed hash.
      expect(String(get.mock.calls[0][0])).toContain(FINAL_HASH_HEX);
    });

    it('falls through to the chain when the index has no assembled copy', async () => {
      // A cache miss on the fast path must not short-circuit anything: the
      // normal path still has to run and reconstruct.
      const get = vi.fn(async () => null);
      const fetch = vi.fn(
        async () =>
          new Response(JSON.stringify({ okay: true, result: metaResult() }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
      );
      vi.stubGlobal('fetch', fetch);

      const response = await onRequest({
        request: new Request(
          `https://xtrata.xyz/runtime/content?contractId=${CONTRACT_ID}&tokenId=294&network=mainnet`
        ),
        env: {
          DB: indexedDb(indexRow()),
          RUNTIME_CONTENT_CACHE: cacheBucket(get)
        } as unknown as RuntimeEnv
      });

      expect(fetch).toHaveBeenCalled();
      expect(response.headers.get('X-Xtrata-Runtime-Cache')).not.toBe('HIT');
    });

    it('ignores index rows it cannot trust rather than guessing', async () => {
      // A malformed hash must never be turned into a cache key: that would
      // look up a key that cannot exist, or worse, a key belonging to other
      // content. Each of these has to leave the fast path untaken.
      for (const badHash of ['', 'not-hex', '0xabcd', null]) {
        // Call order is the tell: the fast path looks in the cache BEFORE
        // touching the chain, so a chain read landing first proves it was
        // skipped. (The normal path then does its own cache lookup, which is
        // why counting lookups would not distinguish the two.)
        const order: string[] = [];
        const get = vi.fn(async () => {
          order.push('cache');
          return null;
        });
        const fetch = vi.fn(async () => {
          order.push('chain');
          return new Response(JSON.stringify({ okay: true, result: metaResult() }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        });
        vi.stubGlobal('fetch', fetch);

        await onRequest({
          request: new Request(
            `https://xtrata.xyz/runtime/content?contractId=${CONTRACT_ID}&tokenId=294&network=mainnet`
          ),
          env: {
            DB: indexedDb(indexRow({ final_hash: badHash })),
            RUNTIME_CONTENT_CACHE: cacheBucket(get)
          } as unknown as RuntimeEnv
        });

        expect(order[0], `final_hash=${String(badHash)}`).toBe('chain');
      }
    });

    it('survives an index that is missing entirely', async () => {
      // No DB binding at all — the normal case for a fresh preview
      // environment. The fast path must be skipped silently, not throw.
      const get = vi.fn(async () => ({
        body: streamFrom(new Uint8Array([9, 8])),
        size: 2,
        httpMetadata: { contentType: 'image/gif' },
        customMetadata: { sourceContractId: CONTRACT_ID }
      }));
      const fetch = vi.fn(
        async () =>
          new Response(JSON.stringify({ okay: true, result: metaResult() }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
      );
      vi.stubGlobal('fetch', fetch);

      const response = await onRequest({
        request: new Request(
          `https://xtrata.xyz/runtime/content?contractId=${CONTRACT_ID}&tokenId=294&network=mainnet`
        ),
        env: { RUNTIME_CONTENT_CACHE: cacheBucket(get) } as unknown as RuntimeEnv
      });

      // Served, but only after reading the chain for the hash — i.e. exactly
      // the behaviour we had before the fast path existed.
      expect(response.status).toBe(200);
      expect(response.headers.get('X-Xtrata-Runtime-Cache')).toBe('HIT');
      expect(fetch).toHaveBeenCalled();
    });
  });

  it('keeps a failed read as a server error rather than reporting it as missing', async () => {
    // "We could not reach the chain" must never be reported as "this
    // inscription does not exist" — that is a permanence claim we cannot make.
    const fetch = vi.fn(async () => new Response('upstream exploded', { status: 500 }));
    vi.stubGlobal('fetch', fetch);

    const response = await onRequest({
      request: new Request(
        `https://xtrata.xyz/runtime/content?contractId=${CONTRACT_ID}&tokenId=8&network=mainnet`
      ),
      env: { RUNTIME_CONTENT_READ_RETRIES: '0' }
    });

    expect(response.status).toBe(502);
    const body = (await response.json()) as { error: string };
    expect(body.error).toBe('Failed to reconstruct runtime content.');
  });
});
