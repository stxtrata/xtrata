import {afterEach,describe,it,expect,vi} from 'vitest';
import {webcrypto} from 'node:crypto';
import {Cl,makeUnsignedContractCall,makeContractCall,getAddressFromPrivateKey,TransactionVersion,cvToHex,PostConditionMode} from '@stacks/transactions';
import {micro,feeValue,Budget,safeReport,RESERVE} from '../model';
import {createVault,unlockVault,parseVault} from '../vault';
import {playOptions,owner,account,withdrawalPreview,validateSaved,hex} from '../chain';
vi.stubGlobal('crypto',webcrypto);
afterEach(()=>vi.restoreAllMocks());
const address='SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const publicKey='0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798';
describe('financial controls',()=>{
 it('uses exact integer microSTX and rejects ambiguous currency inputs',()=>{expect(micro('0.000257')).toBe(257n);expect(micro('1')).toBe(1000000n);for(const bad of ['1e-4','-1','.2','0.0000001','NaN','01',''])expect(()=>micro(bad)).toThrow();expect(()=>feeValue('0')).toThrow();expect(()=>feeValue('1')).toThrow();});
 it('enforces per-session fee, song, budget, count and expiry inside the signer policy',()=>{const p={fee:'300',budget:'700',max:2,expires:Date.now()+60000,core:3,songs:[2910]};const b=new Budget(p);expect(()=>b.consume(3,2910,301n)).toThrow();expect(()=>b.consume(2,2910,300n)).toThrow();expect(()=>b.consume(3,1,300n)).toThrow();b.consume(3,2910,300n);b.consume(3,2910,300n);expect(()=>b.consume(3,2910,300n)).toThrow();expect(()=>new Budget({...p,expires:Date.now()-1})).toThrow();expect(()=>new Budget({...p,max:21})).toThrow();expect(RESERVE).toBe(1000n);});
 it('never exports signed executable bytes in a public report',()=>{expect(safeReport([{raw:'sensitive-signed-bytes',id:'receipt'} as any])).toEqual([{id:'receipt'}]);});
 it('constructs the pinned contract call with exact spend protection',async()=>{const options=playOptions(address,publicKey,3,2910,'01'.repeat(16),200n,0n);expect(options.contractName).toBe('xtrata-radio-plays-v1-0');expect(options.postConditionMode).toBe(PostConditionMode.Deny);expect(options.postConditions[0].amount).toBe(50n);expect(options.fee).toBe(200n);expect((await makeUnsignedContractCall(options)).serialize().length).toBe(257);expect(()=>playOptions(address,publicKey,4,2910,'01'.repeat(16),200n,0n)).toThrow();});
});
describe('encrypted disposable wallet',()=>{
 it('creates distinct wallets, restores backup, and rejects password/tamper attacks',async()=>{
  const password='test-only-long-password';const v=await createVault(password),other=await createVault(password);expect(v.address).not.toBe(other.address);expect(v.iv).not.toBe(other.iv);expect(JSON.stringify(v)).not.toContain(password);
  const opened=await unlockVault(JSON.parse(JSON.stringify(v)),password);expect(opened.address).toBe(v.address);expect(JSON.stringify(v)).not.toContain(opened.privateKey);
  await expect(unlockVault(v,'wrong-long-password')).rejects.toThrow();await expect(unlockVault({...v,address:other.address},password)).rejects.toThrow();await expect(unlockVault({...v,ciphertext:'ff'+v.ciphertext.slice(2)},password)).rejects.toThrow();expect(()=>parseVault({...v,iterations:1})).toThrow();await expect(createVault('short')).rejects.toThrow();
 });
});
describe('read and nonce validation',()=>{
 it('decodes the on-chain holder and rejects contract holders',async()=>{let holder=Cl.standardPrincipal(address);vi.spyOn(globalThis,'fetch').mockImplementation(async()=>new Response(JSON.stringify({okay:true,result:cvToHex(Cl.ok(Cl.some(holder)))})));expect(await owner(3,2910)).toBe(address);holder=Cl.contractPrincipal(address,'escrow');await expect(owner(3,2910)).rejects.toThrow();});
 it('blocks foreign pending nonces before signing',async()=>{let next=0;vi.spyOn(globalThis,'fetch').mockImplementation(async(url)=>new Response(JSON.stringify(String(url).endsWith('/nonces')?{possible_next_nonce:next,last_mempool_tx_nonce:null,detected_missing_nonces:[]}:{balance:'0x0f4240',nonce:0})));expect((await account(address)).balance).toBe(1000000n);next=1;await expect(account(address)).rejects.toThrow('unresolved');});
 it('rejects self/invalid withdrawal recipients before reading network',async()=>{const fetcher=vi.spyOn(globalThis,'fetch');await expect(withdrawalPreview(address,publicKey,address,100n,200n)).rejects.toThrow();expect(fetcher).not.toHaveBeenCalled();});
});

it('verifies persisted signatures and rejects changed nonce, fee and song before resending',async()=>{
 const key='0'.repeat(63)+'1'+'01',payer=getAddressFromPrivateKey(key,TransactionVersion.Mainnet),receipt='01'.repeat(16);
 const tx=await makeContractCall({...playOptions(payer,publicKey,3,2910,receipt,300n,0n),senderKey:key});
 const entry:any={id:receipt,address:payer,kind:'play',core:3,song:2910,recipient:address,amount:'50',fee:'300',nonce:'0',created:Date.now(),status:'signed',raw:hex(tx.serialize()),txid:'0x'+tx.txid()};
 expect(()=>validateSaved(entry)).not.toThrow();for(const patch of [{fee:'301'},{nonce:'1'},{song:2911},{amount:'51'},{txid:'0x'+'00'.repeat(32)}])expect(()=>validateSaved({...entry,...patch})).toThrow();
});
