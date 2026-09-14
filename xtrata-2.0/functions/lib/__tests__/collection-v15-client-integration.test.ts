import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildArtistDeployContractSource } from '../../../src/lib/deploy/artist-deploy';
import { quoteCollectionV15Mint } from '../../../packages/xtrata-sdk/src/collection-v15';
import { hashBytes } from '../collection-storage/common';
const require = createRequire(import.meta.url);
describe('generated manager helper with actual core v3.2.3 fees', () => {
  it('deploys under a different owner, charges quoted fees, preserves reserved prices, and refuses duplicate minting', async () => {
    const { initSimnet } = require('../../../contracts/clarinet/node_modules/@stacks/clarinet-sdk');
    const { Cl } = require('../../../contracts/clarinet/node_modules/@stacks/transactions');
    const simnet = await initSimnet('contracts/clarinet/Clarinet.toml');
    const accounts = simnet.getAccounts();
    const coreAdmin = accounts.get('deployer'); const owner = accounts.get('wallet_2'); const buyer = accounts.get('wallet_1');
    const core = `${coreAdmin}.xtrata-v3-2-3`; const helper = `${owner}.generated-collection-v15`;
    const source = readFileSync('contracts/clarinet/contracts/xtrata-collection-mint-v1.5.clar','utf8');
    const generated = buildArtistDeployContractSource({
      input: {collectionName:'Integration',symbol:'INT',description:'Local simulation',supply:'3',mintType:'standard',mintPriceStx:'1',artistAddress:owner,marketplaceAddress:coreAdmin},
      templateSources:{standardSource:source,preinscribedSource:''},coreContractId:core,operatorAddress:coreAdmin
    });
    expect(generated.errors).toEqual([]);
    expect(simnet.deployContract('generated-collection-v15',generated.source,{clarityVersion:3},owner).result.type).toBe('true');
    const call = (target: string, name: string, args: any[], sender: string) => {
      const result=simnet.callPublicFn(target,name,args,sender).result;
      expect(result.type).toBe('ok'); return result;
    };
    call(core,'set-paused',[Cl.bool(false)],coreAdmin);
    call(helper,'set-paused',[Cl.bool(false)],owner);
    const units = {begin:123000n,chunk:3000n,batch:81000n,seal:99000n};
    for (const [name,fee] of [['begin',units.begin],['upload-chunk',units.chunk],['upload-batch',units.batch],['seal',units.seal]] as const)
      call(core,`set-${name}-fee-unit`,[Cl.uint(fee)],coreAdmin);
    // Quote boundaries against the core's own read-only quote, with distinct mutable units.
    for (const count of [1,30,32,33,64,65]) {
      const value=simnet.callReadOnlyFn(core,'quote-staged-fee',[Cl.uint(count*16384),Cl.uint(count)],buyer).result.value.value;
      const quote=quoteCollectionV15Mint(units,count,0n);
      expect(value['total-fee'].value).toBe(quote.total);
    }
    const data = new Uint8Array(33*16384).fill(42);
    const hash=Cl.bufferFromHex(hashBytes(data)); const corePrincipal=Cl.contractPrincipal(coreAdmin,'xtrata-v3-2-3');
    call(helper,'set-registered-token-uri',[hash,Cl.stringAscii('data:text/plain,registered')],owner);
    const balance=()=>simnet.getAssetsMap().get('STX').get(buyer);
    const before=balance();
    call(helper,'mint-begin',[corePrincipal,hash,Cl.stringAscii('application/octet-stream'),Cl.uint(data.length),Cl.uint(33)],buyer);
    expect(before-balance()).toBe(units.begin);
    call(helper,'set-mint-price',[Cl.uint(5000000)],owner);
    const uploadBalance=balance();
    for (let start=0; start<33; start+=30) {
      const chunks=Array.from({length:Math.min(30,33-start)},(_,i)=>Cl.buffer(data.slice((start+i)*16384,(start+i+1)*16384)));
      call(helper,'mint-add-chunk-batch',[corePrincipal,hash,Cl.list(chunks)],buyer);
    }
    expect(balance()).toBe(uploadBalance);
    call(helper,'mint-seal',[corePrincipal,hash,Cl.stringAscii('data:text/plain,registered')],buyer);
    expect(before-balance()).toBe(quoteCollectionV15Mint(units,33,1000000n).total);
    const after=balance();
    const duplicate=simnet.callPublicFn(helper,'mint-begin',[corePrincipal,hash,Cl.stringAscii('application/octet-stream'),Cl.uint(data.length),Cl.uint(33)],buyer).result;
    expect(duplicate).toEqual(Cl.error(Cl.uint(122)));
    expect(balance()).toBe(after);
  },30000);
});
