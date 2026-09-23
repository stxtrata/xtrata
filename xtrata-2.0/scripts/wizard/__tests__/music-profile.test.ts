// @vitest-environment node
import {it,expect} from 'vitest';
import {mkdtemp,rm,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';import {join} from 'node:path';
import {RadioWizard} from './offline-radio-wallet';
import {beginMusicProfile} from '../music-profile-local.mjs';
import {verifyProfile,PROFILE_TTL} from '../music-profile-proof.mjs';
const owner='SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7';
it('uses the real protected wallet, returns only a purpose-bound proof, and never broadcasts',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'music-profile-'));try{
  const wizard=new RadioWizard(dir);const {address}=await wizard.setup();const before=await readFile(join(dir,'vault.json'),'utf8');let c:any;
  const transport=async(url:any,options:any)=>{expect(url).toBe('https://xtrata.xyz/api/music-profile');const b=JSON.parse(options.body);expect(b.support).toBe(address);const issued=Date.now();c={...b,id:'a'.repeat(64),owner,domain:'xtrata.xyz/music/heroes',network:'mainnet',amount:1234,issued,expires:issued+PROFILE_TTL};return Response.json({challenge:c});};
  const result=await beginMusicProfile(wizard,{approved:true,action:'link',method:'signature',name:'jim.btc'},transport);
  const proof=JSON.parse(Buffer.from(new URL(result.url).hash.slice(1),'base64url').toString());expect(verifyProfile(c,'support',proof.supportProof,address)).toBe(true);
  expect(JSON.stringify(result)).not.toContain(await wizard.key());expect(await wizard.journal()).toEqual([]);expect(await readFile(join(dir,'vault.json'),'utf8')).toBe(before);
  await expect(beginMusicProfile(wizard,{approved:false},transport)).rejects.toThrow('approve');
  await expect(beginMusicProfile(wizard,{approved:true,action:'link',method:'signature',name:'jim.btc'},async()=>Response.json({challenge:{...c,support:owner}}))).rejects.toThrow('match');
 }finally{await rm(dir,{recursive:true,force:true});}
});
