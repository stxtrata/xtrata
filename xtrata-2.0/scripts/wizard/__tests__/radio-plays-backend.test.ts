import {describe,it,expect} from 'vitest';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {RadioWizard,policy} from '../radio-plays-backend.mjs';
import {cvToHex,Cl,deserializeTransaction} from '@stacks/transactions';
describe('backend radio wizard',()=>{
 it('validates bounded policies',()=>{expect(policy({core:3,song:2910,fee:300,count:1}).count).toBe(1);for(const value of [{core:4,song:1,fee:300,count:1},{core:3,song:1,fee:1001,count:1},{core:3,song:1,fee:1000,count:5},{core:3,song:-1,fee:300,count:1}])expect(()=>policy(value)).toThrow();});
 it('creates encrypted local identity once and exports no secrets',async()=>{const dir=await mkdtemp(join(tmpdir(),'radio-backend-'));try{const w=new RadioWizard(dir);const first=await w.setup();expect(await w.setup()).toEqual(first);const secret=await w.key();expect(await readFile(join(dir,'vault.json'),'utf8')).not.toContain(secret);const status=await w.status();expect(JSON.stringify(status)).not.toContain(secret);expect(status.address).toMatch(/^SP/);expect(status.entries).toEqual([]);}finally{await rm(dir,{recursive:true,force:true});}});
 it('signs only the pinned call, journals before submission and blocks unknown replacement',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'radio-backend-'));let sent=0;const source=await readFile(new URL('../../../contracts/live/xtrata-radio-plays-v1.0.clar',import.meta.url),'utf8');
 const mock=async(url,opts)=>{let value;if(url.includes('/source/'))value={source};else if(url.endsWith('/v2/info'))value={network_id:1};else if(url.includes('/accounts/'))value={nonce:0,balance:'1000000'};else if(url.endsWith('/nonces'))value={possible_next_nonce:0};else if(url.includes('/get-owner'))value={okay:true,result:cvToHex(Cl.ok(Cl.some(Cl.standardPrincipal('SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X'))))};else if(url.endsWith('/v2/transactions')){sent++;const tx=deserializeTransaction(opts.body);expect(tx.payload.functionName.content).toBe('play');expect(tx.auth.spendingCondition.fee).toBe(300n);const log=JSON.parse(await readFile(join(dir,'journal.json'),'utf8'));expect(log[0].status).toBe('prepared');throw Error('Simulated unknown submission');}else return {ok:false,status:404};return {ok:true,json:async()=>value};};
 try{const w=new RadioWizard(dir,mock);await w.setup();await expect(w.run({core:3,song:2910,fee:300,count:1})).rejects.toThrow('Simulated');expect(sent).toBe(1);await expect(w.run({core:3,song:2910,fee:300,count:1})).rejects.toThrow('not visible');expect(sent).toBe(1);expect(JSON.stringify(await w.status())).not.toContain('raw');}finally{await rm(dir,{recursive:true,force:true});}
 });
});
