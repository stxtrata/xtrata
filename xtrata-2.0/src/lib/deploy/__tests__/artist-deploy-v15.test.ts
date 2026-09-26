import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildArtistDeployContractSource, resolveArtistDeployCoreTarget } from '../artist-deploy';
import { buildArtistDeployContractSource as sdkBuild, resolveArtistDeployCoreTarget as sdkResolve } from '../../../../packages/xtrata-sdk/src/deploy';
import { CONTRACT_REGISTRY } from '../../contract/registry';
const source = readFileSync(new URL('../../../../contracts/clarinet/contracts/xtrata-collection-mint-v1.5.clar', import.meta.url), 'utf8');
const address = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const params = { input: { collectionName:'Test',symbol:'TEST',description:'Test',supply:'2',mintType:'standard' as const,mintPriceStx:'1',artistAddress:address,marketplaceAddress:address }, templateSources:{standardSource:source,preinscribedSource:''},coreContractId:`${address}.xtrata-v3-2-3`,operatorAddress:address };
describe('v1.5 source and target integration', () => {
  it.each([buildArtistDeployContractSource,sdkBuild])('retargets the pin and static duplicate check together', build => {
    const result=build(params);
    expect(result.errors).toEqual([]);
    expect(result.source).toContain(`(define-constant ALLOWED-XTRATA-CONTRACT '${params.coreContractId})`);
    expect(result.source).toContain(`(contract-call? '${params.coreContractId} get-id-by-hash hash)`);
    expect(result.source).not.toContain('(contract-call? .xtrata-v3-2-3');
    expect(build({...params,coreContractId:`${address}.xtrata-v2-1-0`}).errors).toContain('Collection v1.5 requires core v3.2.3.');
  });
  it('selects exact supported targets without crossing networks or changing legacy defaults', () => {
    expect(resolveArtistDeployCoreTarget('mainnet',CONTRACT_REGISTRY,'3.2.3')?.contractId).toBe(params.coreContractId);
    expect(resolveArtistDeployCoreTarget('testnet',CONTRACT_REGISTRY,'3.2.3')).toBeNull();
    expect(resolveArtistDeployCoreTarget('mainnet')?.contractId).toContain('v2-1-0');
    expect(sdkResolve('mainnet',CONTRACT_REGISTRY,'3.2.3')?.contractId).toBe(params.coreContractId);
  });
});
describe('v1.7 template pinning', () => {
  const v17 = readFileSync(new URL('../../../../contracts/clarinet/contracts/xtrata-collection-mint-v1.7.clar', import.meta.url), 'utf8');
  it.each([buildArtistDeployContractSource, sdkBuild])('pins every static core call, including the fee reads', build => {
    const result = build({ ...params, templateSources: { standardSource: v17, preinscribedSource: '' } });
    expect(result.errors).toEqual([]);
    expect(result.source).not.toMatch(/\(contract-call\? \.xtrata-v3-2-3/);
    expect(result.source.split(`(contract-call? '${params.coreContractId} `).length - 1).toBe(8);
  });
});
