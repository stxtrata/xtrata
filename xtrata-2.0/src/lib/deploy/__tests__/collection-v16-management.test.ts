// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';
import { collectionArgs, renderCollectionManagement } from '../collection-v16-management';
describe('collection management', () => {
  it('pins recipient-editor grants to the correct core and validates permissions', () => {
    const core='SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
    const editor=core.split('.')[0];
    expect(collectionArgs('set-recipient-editor-access',[core,editor,'true','true'])).toHaveLength(4);
    expect(() => collectionArgs('set-recipient-editor-access',[core+'bad',editor,'true','true'])).toThrow();
    expect(() => collectionArgs('set-recipient-editor-access',[core,editor,'yes','true'])).toThrow();
  });
  it('validates hashes, amounts, booleans and split totals', () => {
    expect(() => collectionArgs('set-registered-token-uri',['bad','uri'])).toThrow();
    expect(() => collectionArgs('set-mint-price',['1.2'])).toThrow();
    expect(() => collectionArgs('set-paused',['yes'])).toThrow();
    expect(() => collectionArgs('set-splits',['10000','1','0'])).toThrow();
    expect(collectionArgs('set-splits',['8000','1000','1000'])).toHaveLength(3);
    expect(collectionArgs('set-registered-token-uri',['ab'.repeat(32),'uri'])).toHaveLength(2);
  });
  it('rejects invalid phases, supply, strings and dependencies', () => {
    expect(() => collectionArgs('set-max-supply',['0'])).toThrow();
    expect(() => collectionArgs('set-phase',['1','true','10','9','0','0','0','0'])).toThrow();
    expect(() => collectionArgs('set-default-token-uri',['é'])).toThrow();
    expect(() => collectionArgs('set-default-dependencies',['1,01'])).toThrow();
  });
  it('exposes six stages without executing any action on render', () => {
    const run = vi.fn(); const root = renderCollectionManagement(run);
    expect(root.querySelectorAll(':scope > details')).toHaveLength(8);
    expect(root.textContent).toContain('Automated storage cleanup');
    expect(run).not.toHaveBeenCalled();
  });
  it('does not submit a cancelled review', async () => {
    const run = vi.fn(); const root = renderCollectionManagement(run);
    const d = [...root.querySelectorAll('details')].find(n => n.querySelector('summary')?.textContent === 'set-paused')!;
    const input = d.querySelector('input')!; input.value = 'true'; input.dispatchEvent(new Event('input'));
    vi.spyOn(window,'confirm').mockReturnValueOnce(false);
    d.querySelector('button')!.click(); await Promise.resolve();
    expect(run).not.toHaveBeenCalled(); vi.restoreAllMocks();
  });
});
