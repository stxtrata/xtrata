/// <reference lib="webworker" />
import {makeContractCall,makeSTXTokenTransfer,AnchorMode} from '@stacks/transactions';
import {StacksMainnet} from '@stacks/network';
import {createVault,unlockVault} from './vault';
import {Budget,RESERVE,type Policy} from './model';
import {preview,playOptions,withdrawalPreview,hex} from './chain';
let identity:Awaited<ReturnType<typeof unlockVault>>|null=null,budget:Budget|null=null,epoch=0,busy=false;
self.onmessage=async(event:MessageEvent)=>{
 const {id,op,data}=event.data;
 if(op==='lock'||op==='stop'){epoch++;budget=null;if(op==='lock')identity=null;self.postMessage({id,result:true});return;}
 if(busy){self.postMessage({id,error:'Signer busy. Wait for the existing operation.'});return;}
 busy=true;const generation=epoch;
 try{
  let result:unknown;
  if(op==='ping')result=true;
  else if(op==='create')result=await createVault(data.password);
  else if(op==='open'){const opened=await unlockVault(data.vault,data.password);if(epoch!==generation)throw Error('Wallet locked.');identity=opened;result={address:opened.address,publicKey:opened.publicKey};}
  else if(op==='verify-backup'){const opened=await unlockVault(data.vault,data.password);result={address:opened.address,publicKey:opened.publicKey};}
  else if(op==='arm'){if(!identity)throw Error('Unlock the listening wallet first.');budget=new Budget(data as Policy);result=true;}
  else if(op==='sign-play'){
   if(!identity||!budget)throw Error('No authorised test session.');
   const who=identity,b=budget,fee=BigInt(data.fee);
   const p=await preview(who.address,who.publicKey,data.core,data.song,data.receipt,fee);
   if(epoch!==generation||identity!==who||budget!==b)throw Error('Test stopped.');
   if(p.nonce!==data.nonce||p.recipient!==data.recipient)throw Error('Owner or nonce changed. Review the transaction again.');
   if(BigInt(p.balance)<fee+50n+RESERVE)throw Error('Not enough funds after retaining 0.001 STX for recovery fees.');
   b.consume(data.core,data.song,fee);
   const tx=await makeContractCall({...playOptions(who.address,who.publicKey,data.core,data.song,data.receipt,fee,BigInt(data.nonce)),senderKey:who.privateKey});
   if(epoch!==generation)throw Error('Test stopped before submission.');
   result={raw:hex(tx.serialize()),txid:'0x'+tx.txid()};
  }else if(op==='withdraw'){
   if(!identity)throw Error('Unlock the wallet first.');budget=null;const who=identity;
   const p=await withdrawalPreview(who.address,who.publicKey,data.recipient,BigInt(data.amount),BigInt(data.fee));
   if(epoch!==generation||identity!==who||p.nonce!==data.nonce)throw Error('Wallet or nonce changed. Review again.');
   const tx=await makeSTXTokenTransfer({recipient:data.recipient,amount:BigInt(data.amount),fee:BigInt(data.fee),nonce:BigInt(data.nonce),network:new StacksMainnet(),memo:'Radio test withdrawal',anchorMode:AnchorMode.Any,senderKey:who.privateKey});
   if(epoch!==generation)throw Error('Wallet locked.');result={raw:hex(tx.serialize()),txid:'0x'+tx.txid()};
  }else throw Error('Unsupported signer operation.');
  self.postMessage({id,result});
 }catch(error){self.postMessage({id,error:error instanceof Error?error.message:'Signer operation failed.'});}finally{busy=false;}
};
