import { describe, expect, it, vi } from 'vitest';
import { onRequest } from '../[contract]/[tokenId]';

const CONTRACT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
const WEBP = new Uint8Array([0x52, 0x49, 0x46, 0x46, 1, 2, 3, 4]);

const bodyOf = (bytes: Uint8Array) =>
  new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(bytes);
      controller.close();
    }
  });

const bucketWith = (objects: Record<string, Uint8Array>) => ({
  get: vi.fn(async (key: string) =>
    objects[key]
      ? { body: bodyOf(objects[key]), size: objects[key].length, httpEtag: '"abc"' }
      : null
  )
});

const call = (
  path: string,
  env: Record<string, unknown>,
  params: Record<string, string>,
  method = 'GET'
) =>
  onRequest({
    request: new Request(`https://xtrata.xyz${path}`, { method }),
    env,
    params
  });

const params = { contract: CONTRACT, tokenId: '12' };
const path = `/thumb/${CONTRACT}/12`;
const key = `thumbs/${CONTRACT}/12.webp`;

describe('/thumb/<contract>/<tokenId>', () => {
  it('serves the stored WebP as immutable when the URL carries a version', async () => {
    const bucket = bucketWith({ [key]: WEBP });
    const response = await call(`${path}?v=9f2c1ab4d0e57718`, { THUMBNAILS: bucket }, params);
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('image/webp');
    expect(response.headers.get('cache-control')).toBe('public, max-age=31536000, immutable');
    expect(response.headers.get('x-content-type-options')).toBe('nosniff');
    expect(response.headers.get('content-security-policy')).toContain("default-src 'none'");
    expect(response.headers.get('content-length')).toBe(String(WEBP.length));
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(WEBP);
    expect(bucket.get).toHaveBeenCalledWith(key);
  });

  it('caches briefly without a version, and ignores a malformed one', async () => {
    const bucket = bucketWith({ [key]: WEBP });
    const plain = await call(path, { THUMBNAILS: bucket }, params);
    expect(plain.headers.get('cache-control')).toContain('max-age=3600');
    expect(plain.headers.get('cache-control')).not.toContain('immutable');
    const odd = await call(`${path}?v=../../x`, { THUMBNAILS: bucket }, params);
    expect(odd.headers.get('cache-control')).not.toContain('immutable');
  });

  it('answers 404 when the thumbnail does not exist', async () => {
    const response = await call(path, { THUMBNAILS: bucketWith({}) }, params);
    expect(response.status).toBe(404);
    expect(response.headers.get('cache-control')).toBe('public, max-age=60');
  });

  it('answers 404, not an error, when the bucket is not bound', async () => {
    const response = await call(path, {}, params);
    expect(response.status).toBe(404);
  });

  it('answers 404 when the bucket read fails', async () => {
    const bucket = { get: vi.fn(async () => { throw new Error('r2 down'); }) };
    const response = await call(path, { THUMBNAILS: bucket }, params);
    expect(response.status).toBe(404);
  });

  it('rejects bad contract ids and token ids without touching R2', async () => {
    const bucket = bucketWith({});
    const badContract = await call('/thumb/x/12', { THUMBNAILS: bucket }, { contract: '../x', tokenId: '12' });
    const badToken = await call(path, { THUMBNAILS: bucket }, { contract: CONTRACT, tokenId: 'abc' });
    expect(badContract.status).toBe(400);
    expect(badToken.status).toBe(400);
    expect(bucket.get).not.toHaveBeenCalled();
  });

  it('allows HEAD without a body and refuses other methods', async () => {
    const bucket = bucketWith({ [key]: WEBP });
    const head = await call(path, { THUMBNAILS: bucket }, params, 'HEAD');
    expect(head.status).toBe(200);
    expect(await head.text()).toBe('');
    const post = await call(path, { THUMBNAILS: bucket }, params, 'POST');
    expect(post.status).toBe(405);
  });
});
