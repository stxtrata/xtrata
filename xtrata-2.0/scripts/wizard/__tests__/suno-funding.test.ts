import { describe, it, expect, vi, afterEach } from 'vitest';
import { mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { makeSTXTokenTransfer, TransactionVersion, getAddressFromPrivateKey, AnchorMode } from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import { createFundingHandler, defaultPolicy, validateFunding, sha256 } from '../suno-funding.mjs';
const key='1'.padStart(64,'0'); // disposable mathematical test key, never funded
const address=getAddressFromPrivateKey(key,TransactionVersion.Mainnet);
const recipient=getAddressFromPrivateKey('2'.padStart(64,'0'),TransactionVersion.Mainnet);
const policy={...defaultPolicy,address,playerHashes:[sha256('player')]};
const request={network:'mainnet',recipient,amount:'100000',jobId:'job-test-1',expectedFunder:address,user:address,playerHashes:policy.playerHashes};
const dirs:string[]=[];
afterEach(()=>dirs.splice(0).forEach(d=>rmSync(d,{recursive:true,force:true})));
function fixture(overrides:any={}){
  const dir=mkdtempSync(join(tmpdir(),'suno-funding-'));dirs.push(dir);
  const journal=join(dir,'payment.json');
  const ports={kill:vi.fn(()=>false),balance:vi.fn(async()=>2000000n),nonce:vi.fn(async()=>0n),
    sign:vi.fn(async(plan:any,nonce:bigint)=>makeSTXTokenTransfer({recipient:plan.recipient,amount:BigInt(plan.amount),fee:BigInt(plan.feeUstx),nonce,senderKey:key,network:new StacksMainnet(),anchorMode:AnchorMode.Any})),
    broadcast:vi.fn(async(tx:any)=>({txid:tx.txid()})),...overrides};
  return {journal,ports,handler:createFundingHandler({policy,journal,live:true,ports})};
}
describe('Suno wizard deposit boundary',()=>{
  it.each([
    [{expectedFunder:recipient},'identity'],[{user:recipient},'identity'],[{network:'testnet'},'mainnet'],
    [{recipient:address},'deposit'],[{amount:'-1'},'amount'],[{amount:'500000'},'cap'],
    [{playerHashes:[sha256('changed')]},'approved'],[{playerHashes:[]},'hashes']
  ])('refuses changed funding request %j',(change,message)=>expect(()=>validateFunding({...request,...change},policy)).toThrow(String(message)));
  it('dry run creates a review plan without calling any signing/network ports',async()=>{
    const f=fixture();const handler=createFundingHandler({policy,journal:f.journal,ports:f.ports});
    await expect(handler(request)).rejects.toThrow('Dry run');
    expect(JSON.parse(readFileSync(f.journal+'.plan.json','utf8')).amount).toBe('100000');
    for(const fn of Object.values(f.ports)) expect(fn).not.toHaveBeenCalled();
  });
  it('signs the exact deposit locally and journals one simulated submission',async()=>{
    const f=fixture();const result=await f.handler(request);
    expect(result.txId).toMatch(/^[a-f0-9]{64}$/);
    expect(f.ports.sign).toHaveBeenCalledWith(expect.objectContaining({recipient,amount:'100000',feeUstx:'3000'}),0n);
    expect(JSON.parse(readFileSync(f.journal,'utf8')).state).toBe('submitted');
    expect(readFileSync(f.journal,'utf8')).not.toContain(key);
    await expect(f.handler(request)).rejects.toThrow('reserved');
    expect(f.ports.broadcast).toHaveBeenCalledTimes(1);
  });
  it('allows at most one concurrent deposit',async()=>{
    const f=fixture();const result=await Promise.allSettled([f.handler(request),f.handler(request)]);
    expect(result.filter(r=>r.status==='fulfilled')).toHaveLength(1);
    expect(f.ports.broadcast).toHaveBeenCalledTimes(1);
  });
  it('keeps the signed txid on ambiguous submission and refuses a restarted retry',async()=>{
    const f=fixture({broadcast:vi.fn(async()=>{throw new Error('secret SDK internals');})});
    await expect(f.handler(request)).rejects.toThrow('inspect the local payment journal');
    expect(JSON.parse(readFileSync(f.journal,'utf8'))).toMatchObject({state:'signed',txid:expect.any(String)});
    const restarted=createFundingHandler({policy,journal:f.journal,live:true,ports:f.ports});
    await expect(restarted(request)).rejects.toThrow('reserved');
    expect(f.ports.broadcast).toHaveBeenCalledTimes(1);
  });
  it('enforces balance floor',async()=>{
    const f=fixture({balance:vi.fn(async()=>1000000n)});
    await expect(f.handler(request)).rejects.toThrow('balance floor');expect(f.ports.sign).not.toHaveBeenCalled();
  });
  it('checks kill switch again immediately before broadcast',async()=>{
    const f=fixture({kill:vi.fn().mockReturnValueOnce(false).mockReturnValueOnce(false).mockReturnValue(true)});
    await expect(f.handler(request)).rejects.toThrow('Funding stopped');expect(f.ports.broadcast).not.toHaveBeenCalled();
  });
  it('rejects unapproved live players',async()=>{
    const f=fixture();const handler=createFundingHandler({policy:{...policy,playerHashes:undefined},journal:f.journal,live:true,ports:f.ports});
    await expect(handler(request)).rejects.toThrow('approved');expect(f.ports.sign).not.toHaveBeenCalled();
  });
});
