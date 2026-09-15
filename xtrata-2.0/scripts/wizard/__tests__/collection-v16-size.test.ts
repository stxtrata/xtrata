import { it, expect } from 'vitest';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { randomBytes } from 'node:crypto';
const T=createRequire(resolve('contracts/clarinet/package.json'))('@stacks/transactions');
it('serializes 32 full chunks below the Stacks 2 MiB transaction limit',async()=>{
 const key=randomBytes(32).toString('hex')+'01';
 const address='SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
 const tx=await T.makeContractCall({senderKey:key,network:'mainnet',nonce:0n,fee:1000n,contractAddress:address,contractName:'xtrata-collection-mint-v1-6',functionName:'mint-small-single-tx',functionArgs:[T.Cl.contractPrincipal(address,'xtrata-v3-2-3'),T.Cl.buffer(Buffer.alloc(32)),T.Cl.stringAscii('image/jpeg'),T.Cl.uint(524288),T.Cl.list(Array.from({length:32},()=>T.Cl.buffer(Buffer.alloc(16384)))),T.Cl.stringAscii('x'.repeat(256))],postConditionMode:T.PostConditionMode.Deny,postConditions:[]});
 const raw=tx.serialize();const size=typeof raw==='string'?raw.length/2:raw.length;
 expect(size).toBeGreaterThan(524288);expect(size).toBeLessThan(2*1024*1024);
 console.log('32-chunk serialized transaction bytes:',size);
});
