import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import * as xtrata from './generated/xtrata-seed.mjs';
import * as partner from './upstream/dist/index.js';
import {HDKey} from '@scure/bip32';
import {mnemonicToSeedSync} from '@scure/bip39';
import {stacksAddressFromMnemonic} from './upstream/test/vectors/verify.mjs';
import {makeUnsignedContractCall,Cl,deserializeTransaction,privateKeyToPublic,PostConditionMode} from '@stacks/transactions';
import {signReviewed,TESTNET_CONTRACT} from './generated/adapter.mjs';
const vectors=JSON.parse(await readFile(new URL('upstream/test/vectors/derivation.vectors.json',import.meta.url)));
const baseline=JSON.parse(await readFile(new URL('provenance.json',import.meta.url)));
for(const [file,expected] of [['generated/xtrata-seed.mjs',baseline.xtrataBundleSha256],['source-snapshots/xtrata-seed.ts',baseline.xtrataSeedSha256],['upstream/test/vectors/derivation.vectors.json',baseline.vectorSha256]]) {
 assert.equal(createHash('sha256').update(await readFile(new URL(file,import.meta.url))).digest('hex'),expected,`Pinned artifact changed: ${file}`);
}
const rows=[];
const paths="m/44'/5757'/0'/0/0";
for(const v of vectors.vectors) for(const network of ['mainnet','testnet']) test(`three-way derivation: ${v.name} / ${network}`,async()=>{
 const ours=await xtrata.accountFromMnemonic(v.mnemonic,network);
 const theirs=partner.deriveAddresses(Buffer.from(v.prfBytesHex,'hex'),{network,salt:v.salt}).stacks;
 const reference=await stacksAddressFromMnemonic(v.mnemonic,network);
 assert.equal(ours.address,theirs.address);assert.equal(ours.address,reference);assert.equal(ours.path,paths);
 if(network==='mainnet')assert.equal(ours.address,v.stacks.address);
 rows.push({vector:v.name,network,address:ours.address,threeWayMatch:true});
});
const ZERO24='abandon '.repeat(23)+'art',ZERO12='abandon '.repeat(11)+'about';
for(const [name,phrase] of [['Xtrata 24-word lock',ZERO24],['Xtrata 12-word import',ZERO12]])for(const network of ['mainnet','testnet'])test(`reverse seed compatibility: ${name} / ${network}`,async()=>{
 const ours=await xtrata.accountFromMnemonic(phrase,network),root=partner.mnemonicToRoot(phrase);
 try{assert.equal(ours.address,partner.deriveStacksAccount(root,network).address);assert.equal(ours.address,await stacksAddressFromMnemonic(phrase,network));rows.push({vector:name,network,address:ours.address,threeWayMatch:true});}finally{root.wipePrivateData();}
});
test('negative controls: salt, account index, invalid words and network remain significant',async()=>{
 const v=vectors.vectors[0],input=Buffer.from(v.prfBytesHex,'hex');
 assert.notEqual(partner.deriveAddresses(input,{salt:v.salt+'/wrong'}).stacks.address,v.stacks.address);
 const a=await xtrata.accountFromMnemonic(v.mnemonic,'mainnet',1);assert.notEqual(a.address,v.stacks.address);
 const b=await xtrata.accountFromMnemonic(v.mnemonic,'testnet');assert.notEqual(b.address,v.stacks.address);
 await assert.rejects(xtrata.accountFromMnemonic('abandon '.repeat(24)));
 assert.equal((await xtrata.accountFromMnemonic('  '+ZERO24.toUpperCase()+'\n','mainnet')).address,'SP1JAHE8GEHB0MCBGR8J6W0AA7TJEE1XKFTFJMQ5W');
});
const publicPrf=()=>new Uint8Array(32).fill(7);
async function unsigned(overrides={}){
 const {root}=partner.prfBytesToRoot(publicPrf());
 try{const node=root.derive(paths);return makeUnsignedContractCall({contractAddress:TESTNET_CONTRACT.split('.')[0],contractName:TESTNET_CONTRACT.split('.')[1],functionName:'set-parent-delegate',functionArgs:[Cl.principal(partner.deriveStacksAccount(root,'testnet').address),Cl.bool(false)],publicKey:privateKeyToPublic(Buffer.from(node.privateKey).toString('hex')+'01'),network:'testnet',fee:0n,nonce:3n,postConditionMode:'deny',postConditions:[],...overrides});}finally{root.wipePrivateData();}
}
const policy=tx=>({contractId:TESTNET_CONTRACT,functionNames:['set-parent-delegate'],maxMinerFee:10000n,expectedUnsignedHex:tx.serialize()});
test('adapter verifies standard signature and preserves all reviewed fields',async()=>{
 const tx=await unsigned(),prf=publicPrf(),p=policy(tx),r=signReviewed(prf,tx.serialize(),p);
 assert.equal(r.kind,'complete');deserializeTransaction(r.transactionHex).verifyOrigin();assert.equal(r.txid,deserializeTransaction(r.transactionHex).txid());assert.ok(prf.every(b=>b===0));
 assert.deepEqual(Object.keys(r).sort(),['kind','publicKey','transactionHex','txid']);
});
test('sponsored result has no premature txid and preserves reserved origin nonce',async()=>{
 const tx=await unsigned({sponsored:true}),prf=publicPrf(),r=signReviewed(prf,tx.serialize(),policy(tx));
 assert.equal(r.kind,'origin-signed');assert.equal('txid' in r,false);assert.equal(deserializeTransaction(r.transactionHex).auth.spendingCondition.nonce,3n);assert.ok(prf.every(b=>b===0));
});
test('adapter refuses wrong passkey, changed bytes, mainnet, mixed chain, Allow mode, fee excess and foreign target',async()=>{
 let count=0;const expectRefusal=(tx,prf=publicPrf(),p=policy(tx))=>{assert.throws(()=>signReviewed(prf,tx.serialize(),p));assert.ok(prf.every(b=>b===0));count++;};
 expectRefusal(await unsigned(),new Uint8Array(32).fill(8));
 const t=await unsigned();expectRefusal(t,publicPrf(),{...policy(t),expectedUnsignedHex:'00'});
 expectRefusal(await unsigned({network:'mainnet'}));
 const mixed=await unsigned();mixed.chainId=1;expectRefusal(mixed);
 expectRefusal(await unsigned({postConditionMode:PostConditionMode.Allow}));
 expectRefusal(await unsigned({fee:10001n}));
 expectRefusal(await unsigned({contractName:'different-contract'}));
 expectRefusal(await unsigned({functionName:'set-paused',functionArgs:[Cl.bool(false)]}));
 assert.equal(count,8);
});
test('record reproducible public compatibility results',async()=>{
 assert.equal(rows.length,12);
 const provenance=JSON.parse(await readFile(new URL('provenance.json',import.meta.url)));
 await writeFile(new URL('compatibility-results.json',import.meta.url),JSON.stringify({checkedAt:new Date().toISOString(),provenance,matches:rows,negativeControlGroups:1,adapterCases:'standard, sponsored, eight refusal cases',actualWebAuthnCeremonies:0,broadcasts:0},null,2)+'\n');
});
